---
title: "Triển khai Data Pipeline Observability Vector của Datadog (Rust) vào Môi trường Production"
date: 2025-12-11
draft: false
categories:
  - "DevOps and Infrastructure"
  - "Cloud"
tags:
  - "Datadog"
  - "Kubernetes"
  - "Vector"
  - "Observability"
  - "Rust"
  - "VRL"
  - "GKE"
  - "Logging"
  - "Monitoring"
author: "黒崎 優太 (Yuta Kurosaki)"
translator: "日平"
description: "Chia sẻ kinh nghiệm triển khai Vector của Datadog - data pipeline observability được viết bằng Rust - vào môi trường production tại ABEMA. Bài viết chi tiết về kiến trúc, VRL (Vector Remap Language), so sánh với Observability Pipelines, và kinh nghiệm đóng góp vào OSS."
---

**Nguồn:** [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/60707/)

---

## Giới thiệu tác giả

**Tác giả:** 黒崎 優太 / Yuta Kurosaki ([@kuro_m88](https://x.com/kuro_m88))  
**Công ty:** サイバーエージェント (CyberAgent)  
**Phòng ban:** ABEMA / CTO統括室 (Ban Tổng Giám đốc Công nghệ)  
**Thời điểm gia nhập:** 2015年新卒入社 (Tuyển dụng sinh viên mới tốt nghiệp năm 2015)  
**Vai trò:** Phụ trách phát triển backend, hạ tầng và bảo mật  
**Sở thích:** Mua máy chủ và thiết bị mạng cũ để cài đặt và vận hành tại data center  
**Blog cá nhân:** https://kurochan-note.hatenablog.jp/  
**GitHub:** https://github.com/kurochan  

**Phân loại:** エンジニア (Kỹ sư)  
**Thẻ tag:** #ABEMA, #Datadog, #kubernetes, #Vector  
**Ngày đăng:** 11 tháng 12, 2025  

**Advent Calendar:** Bài viết này là bài ngày thứ 11 của [Datadog Advent Calendar 2025](https://qiita.com/advent-calendar/2025/datadog) 🎄

---

## Mở đầu

Tôi là Kurosaki ([@kuro_m88](https://x.com/kuro_m88)), hiện đang phụ trách backend trong nhóm phát triển hệ thống phân phối quảng cáo của ABEMA.

Năm nay chúng tôi đã triển khai Vector của Datadog vào môi trường production, vì vậy tôi muốn chia sẻ case study này.

---

## Vector - Data Pipeline Observability của Datadog viết bằng Rust là gì?

Bản thân Vector không phải là dịch vụ của Datadog, vì vậy ngay cả trong số người dùng Datadog cũng có nhiều người nghe lần đầu.

Ban đầu, Vector được phát triển bởi **Timber Technologies**, và **vào năm 2021, Datadog đã mua lại công ty này**, sau đó Vector trở thành phần mềm do Community Open Source Engineering team của Datadog phát triển.

Tham khảo: https://www.datadoghq.com/blog/datadog-acquires-timber-technologies-vector/

### Data Pipeline Observability là gì?

Data Pipeline Observability là **pipeline thu thập dữ liệu observability (metrics, logs, traces), thực hiện biến đổi, tổng hợp, lọc và chuyển tiếp đến các đích đầu ra khác nhau**.

Tài liệu về Vector rất phong phú, tôi khuyên bạn nên đọc qua một lượt nếu quan tâm.

**Tài liệu chính thức:** https://vector.dev/docs/

![Khái niệm](https://github.com/vectordotdev/vector)
*Hình: Vector GitHub - https://github.com/vectordotdev/vector*

### Khái niệm cơ bản

Về cơ bản, Vector xử lý dữ liệu observability theo 3 luồng sau:

1. **[Sources (Nguồn đầu vào)](https://vector.dev/docs/reference/configuration/sources/)** - Nhận dữ liệu từ các nguồn
2. **[Transforms (Biến đổi)](https://vector.dev/docs/reference/configuration/transforms/)** - Biến đổi và lọc dữ liệu
3. **[Sinks (Đầu ra)](https://vector.dev/docs/reference/configuration/sinks/)** - Chuyển tiếp đến các đích đầu ra

Khi xem danh sách các nguồn đầu vào/đầu ra và phương thức biến đổi được hỗ trợ, bạn sẽ thấy Vector hỗ trợ rất đa dạng và có thể cover nhiều use case khác nhau.

![Data Model](https://vector.dev/docs/architecture/data-model/)
*Hình: Vector Data Model - https://vector.dev/docs/architecture/data-model/*

### Các phương thức triển khai

Phần mềm cần thiết chỉ là Vector worker, và có 3 phương thức triển khai:

1. **Phương thức Sidecar:** Triển khai như sidecar của application container
2. **Phương thức DaemonSet:** Chạy trên các node của container cluster (DaemonSet trong Kubernetes)
3. **Phương thức Aggregator:** Thu thập và xử lý dữ liệu từ nhiều node

Lần này, vì chúng tôi muốn **sử dụng datadog-agent làm nguồn dữ liệu**, nên đã chọn **phương thức Aggregator**.

Tham khảo: https://vector.dev/docs/setup/deployment/roles/

### Đặc điểm về hiệu năng

Phần mềm được viết bằng **Rust**, trong môi trường thử nghiệm chúng tôi đã xác nhận được hoạt động nhẹ như sau:

- **Đầu vào:** Khoảng 3000 req/s dữ liệu observability
- **Tiêu thụ tài nguyên:** Với xử lý đơn giản chỉ mất khoảng **0.1 vCPU, 30MB bộ nhớ**

Tuy nhiên, lượng tiêu thụ tài nguyên này **biến động khá nhiều tùy thuộc vào tải và độ phức tạp của xử lý trong Transforms, cũng như lượng buffering**, vì vậy cần xác định mức phân bổ tài nguyên cần thiết trong quá trình vận hành.

### So sánh với Fluentd

Nói đến chuyển tiếp log thì **Fluentd** rất nổi tiếng, nhưng Vector được phát triển sau nên có ấn tượng vượt trội ở các điểm sau:

- ✅ Metrics hữu ích cho vận hành rất phong phú
- ✅ Hiệu năng tốt
- ✅ Được chú ý đến tính sẵn sàng cao

---

## Datadog Observability Pipelines

Datadog có dịch vụ **Observability Pipelines**. Có thể xây dựng data pipeline trên Web UI, thiết lập đầu vào, filter, biến đổi, đầu ra một cách trực quan.

Tham khảo: https://www.datadoghq.com/product/observability-pipelines/

### Kết luận: Sử dụng Vector thuần

Nói trước kết luận thì **chúng tôi không áp dụng dịch vụ này, mà quyết định triển khai và vận hành Vector thuần trong môi trường của mình**. Tôi sẽ chia sẻ lý do.

### Hiểu về Observability Pipelines

Triển khai container **Observability Pipelines Worker** vào môi trường của mình để sử dụng, nhưng từ log output và cách cấu hình, có vẻ bên trong đang chạy thứ gì đó giống Vector, vì vậy tôi hiểu Observability Pipelines là một dịch vụ managed giống như Vector + khả năng Remote Config thông qua Web UI của Datadog.

### Ưu điểm: Tính năng Live Capture

Điều tôi thấy hay nhất khi thử nghiệm là **cơ chế cho phép stream log theo thời gian thực khi thiết lập filter, và xác nhận kết quả áp dụng trong quá trình vận hành**. Tính năng này không có trong phiên bản OSS của Vector, vì vậy đây sẽ là ưu điểm khi áp dụng Observability Pipelines.

![Live Capture]()
*Hình: Tính năng Live Capture của Observability Pipelines*

### Nhược điểm 1: Hỗ trợ Terraform chưa hoàn thiện

Mặc dù có thể click-click thiết lập trên UI, nhưng nếu nhìn về vận hành production thì **muốn làm IaC (Infrastructure as Code) với terraform**.

Khi đang xem xét xây dựng bằng terraform provider, phát hiện ra **lỗi xảy ra khi không có cấu hình vốn dĩ là optional**, nên tôi đã tạo pull request.

**PR:** [observability_pipeline: Fix nil dereference when sources/processors/destinations are unset in pipeline config #3137](https://github.com/DataDog/terraform-provider-datadog/pull/3137)

Tuy nghĩ rằng nếu vấn đề này được giải quyết thì có thể dùng được, nhưng khi đọc API document thì hiện tại **API vẫn đang ở trạng thái preview** và có vẻ **cần phải đăng ký mới sử dụng được**. Thực tế khi gọi API này thì bị trả về lỗi. Như vậy, dù sao thì vận hành bằng terraform vẫn còn khó khăn.

**Tài liệu API:** https://docs.datadoghq.com/api/latest/observability-pipelines/

### Nhược điểm 2: Cấu trúc giá

Và yếu tố quyết định nhất là **cấu trúc giá**.

Theo trang giá:
- **Datadog Logs** phí thu thập: **$0.10/GB**
- **Observability Pipelines** phí thu thập: **$0.095/GB**

Tham khảo:
- https://www.datadoghq.com/ja/pricing/?product=observability-pipelines#products
- https://www.datadoghq.com/ja/pricing/?product=log-management#products

Ở đây, phí thu thập của Observability Pipelines là phí thu thập dữ liệu đầu vào (ingestion) vào worker của Observability Pipelines (tài nguyên do chúng ta tự host), và **nếu sau đó thu thập log vào Datadog Logs thì sẽ phát sinh chi phí kép**.

Ngoài ra, tuy chúng tôi nhắm đến việc giảm chi phí bằng cách lọc bớt nhiều log không cần thiết bằng Observability Pipelines và chỉ chuyển log cần thiết đến Datadog Logs, nhưng **do Observability Pipelines tự nó đã có phí, nên tổng chi phí có vẻ sẽ cao hơn so với việc chuyển toàn bộ và chỉ viết exclusion filter ở phía Datadog Logs**.

Cũng có cấu trúc giá theo vCPU, với **sử dụng từ 30TB/tháng trở lên** thì được khuyến nghị dùng cách này, nhưng vì Datadog Logs mới bắt đầu triển khai nên không thể dự đoán được lượng chuyển tiếp nên đã không xem xét.

### Nhược điểm 3: Tính linh hoạt trong cấu hình

Ngoài ra, như sẽ đề cập sau, trong quá trình xem xét, **Vector thuần hiện tại có tính linh hoạt cao hơn trong khả năng biểu đạt cấu hình**, vì vậy ngay cả khi không có các vấn đề trên thì có lẽ chúng tôi vẫn sẽ chọn Vector.

---

## VRL (Vector Remap Language)

Có ngôn ngữ chuyên dụng để biến đổi và lọc các observability event cho Vector gọi là **Vector Remap Language (VRL)**.

Lý do không chỉ sử dụng ngôn ngữ có sẵn hoặc biểu thức điều kiện đơn giản được viết trong blog của Vector.

**Tham khảo:** https://vector.dev/blog/vector-remap-language/

### Đặc điểm của VRL

Các đặc điểm chính:

1. **Tốc độ cao:** Chuyên biệt cho biến đổi và lọc event, cú pháp đơn giản nên **nhanh hơn Lua hoặc JavaScript**
2. **An toàn kiểu:** Có type system và có thể compile, **phát hiện lỗi cú pháp tĩnh**
3. **Có thể test:** Có thể viết test code
4. **Hiển thị lỗi:** Hiển thị lỗi trực quan

### Cú pháp và tài liệu

Tôi sẽ không giới thiệu chi tiết cú pháp, nhưng **cú pháp khá đơn giản và có các hàm built-in** nên có thể bắt đầu sử dụng ngay. Vì **type và error handling được thiết kế sẵn**, nên khó bị sót trong việc xem xét, điều này rất tốt.

**VRL Reference:** https://vector.dev/docs/reference/vrl/

### Cảm nhận khi sử dụng trong môi trường production

File cấu hình Vector hiện đang chạy production, VRL chiếm phần lớn, có **khoảng 400 dòng**. Với số lượng dòng nhiều như vậy, có vẻ sẽ hay xảy ra lỗi runtime do sai sót trong code, nhưng nhờ có **lệnh `vector validate` để kiểm tra tính nhất quán của cú pháp**, nên ở cấp độ đó không gặp nhiều lỗi trong cả quá trình thử nghiệm.

---

## Cấu hình production cuối cùng

Cuối cùng, sau khi triển khai Vector, observability pipeline có cấu hình như hình dưới đây.

![Pipeline]()
*Hình: Cấu hình Observability Pipeline trong môi trường production*

### Tổng quan về cấu hình

Nhắm đến mục đích chuyển tiếp log và metrics của các app (Pod) đang chạy trên **GKE (Google Kubernetes Engine)**, Vector được triển khai như **Aggregator**. Trong cluster production, Pod Vector **thường xuyên chạy vài cái**.

Kubernetes có sẵn **Helm Chart**.

**Helm Chart:** https://github.com/vectordotdev/helm-charts/tree/vector-0.48.0/charts/vector

### Nguồn dữ liệu: datadog-agent

Nguồn dữ liệu nhận log của các container từ **datadog-agent**. Bằng cách không kết nối trực tiếp standard output của application container với Vector mà đi qua datadog-agent, **các tag liên quan đến datadog được tạo và gắn trước từ metadata của kubernetes**, dữ liệu được chuyển đến Vector ở trạng thái đó.

Metrics và log của chính Vector được biểu diễn như `internal-logs` và `internal-metrics`, và có thể chuyển tiếp trực tiếp đến Datadog, rất tiện lợi.

### Xử lý ở tầng Transforms

Phần lớn **file cấu hình Vector khoảng 400 dòng chủ yếu là VRL của tầng Transforms**, thực hiện các xử lý sau:

1. **Xóa tag:** Xóa các tag rõ ràng không cần thiết để **giảm chi phí Datadog Metrics**
2. **Chuẩn hóa timestamp:** Parse trước các trường liên quan đến timestamp của log để chuẩn hóa format
3. **Biến đổi dữ liệu:** Chuyển đổi thành dạng dễ xử lý với Datadog Logs

Phía Datadog Logs cũng có thể viết rule để biến đổi và lọc sau khi log được chuyển đến Datadog, nhưng **xử lý trước những gì có thể xử lý rồi mới gửi đến Datadog giúp cấu hình phía Datadog đơn giản hơn**, và **VRL dễ xử lý theo kiểu lập trình hơn** là những ưu điểm.

### Ví dụ VRL 1: Log Filter

VRL lọc bỏ log khớp với điều kiện cụ thể có thể viết như sau. Trông có vẻ phức tạp, nhưng nếu kết quả đánh giá log chảy đến khớp với điều kiện cụ thể (điều kiện muốn bỏ) thì trở thành `false` và bị bỏ, còn không thì trở thành `true` và không bị bỏ.

```yaml
datadog_logs_filter:
  type: filter
  inputs:
    - datadog_logs_parse_tags
  condition:
    type: vrl
    source: |-
      # Exclude vector own stdout
      !(get!(%custom_metadata.tags, path: ["kube_namespace"]) == "datadog" &&
        get!(%custom_metadata.tags, path: ["kube_container_name"]) == "vector") &&

      # Exclude vector-haproxy info logs
      !(get!(%custom_metadata.tags, path: ["kube_namespace"]) == "datadog" &&
        get!(%custom_metadata.tags, path: ["kube_container_name"]) == "haproxy" &&
        !starts_with(to_string(.) ?? "", "[")) &&
      # Except for access logs, starting with "[" (e.g "[WARNING]")

      # Exclude image-package-extractor
      !(get!(%custom_metadata.tags, path: ["kube_namespace"]) == "kube-system" &&
        %datadog_agent.service == "image-package-extractor") &&

      # Exclude gke-metadata-server
      !(get!(%custom_metadata.tags, path: ["kube_namespace"]) == "kube-system" &&
        %datadog_agent.service == "gke-metadata-server") &&

      # Exclude proxy-agent
      !(get!(%custom_metadata.tags, path: ["kube_namespace"]) == "kube-system" &&
        %datadog_agent.service == "proxy-agent") &&

      # terminate conditions
      true
```

### Ví dụ VRL 2: Parse ddtags

Nói hơi chuyên sâu một chút, tag của Datadog có thể định nghĩa nhiều key giống nhau nên **không có cấu trúc key/value trong biểu diễn nội bộ, mà được biểu diễn dưới dạng chuỗi ngăn cách bằng dấu phẩy trong trường `ddtags`**.

Với VRL có thể viết như sau để parse và làm cho dễ xử lý ở transformer phía sau.

```yaml
datadog_logs_parse_tags:
  type: remap
  inputs:
    - datadog_agent.logs
  source: |-
    # parse ddtags
    tags = {}
    for_each(split!(%datadog_agent.ddtags, ",")) -> |_index, tag| {
      kv = split(tag, ":")
      if length(kv) > 0 {
        key = kv[0]
        value = null
        if length(kv) > 2 {
          value = join!(slice!(kv, start: 1), separator: ":")
        } else {
          value = kv[1]
        }
        tags = set!(value: tags, path: [key], data: value)
      }
    }
    %custom_metadata.tags = tags
```

### Ví dụ VRL 3: Xử lý riêng cho ứng dụng

Về log, chúng tôi đã thiết lập để **có thể viết cấu hình riêng cho từng ứng dụng cụ thể**. Ví dụ như cấu hình chuyên biệt cho log của **Argo Workflow**.

Điều chỉnh `severity`, timestamp và error stack trace của log theo format của Datadog Logs.

```yaml
datadog_logs_argo:
  type: remap
  inputs:
    - datadog_logs_split_route.argo
  source: |-
    if is_object(.) {
      if !is_nullish(.level) {
        %datadog_agent.status = .level
      }

      ts = .timestamp || .ts
      if is_float(ts) || is_integer(ts) {
        ts, err = from_unix_timestamp(to_int(to_float!(.ts)*1000*1000), unit: "microseconds")
        if err == null {
          %datadog_agent.timestamp = ts
          del(.timestamp)
        }
      }

      if !is_nullish(.error) {
        msg = del(.error)
        .error.kind = "WorkflowError"
        .error.message = msg
      }

      if !is_nullish(.stacktrace) {
        .error.kind = "WorkflowError"
        .error.stack = del(.stacktrace)
      }
    }
```

### Đầu ra cuối cùng

Sau các biến đổi này, dữ liệu được chuyển tiếp đến **Datadog Logs** và **Datadog Metrics**.

### Metrics trong môi trường production

Hình dưới đây là dashboard Vector tạo trong Datadog. Đây là tình hình môi trường production trong một ngày, có thể thấy xử lý khoảng **2 vạn event mỗi giây**.

![Dashboard]()
*Hình: Dashboard Vector - Metrics trong môi trường production*

### Tiêu thụ tài nguyên

Tiêu thụ tài nguyên thay đổi xu hướng tải tùy theo nội dung viết trong transformer nên không thể tham khảo cho môi trường khác, nhưng hiện tại để đảm bảo dự phòng, cấu hình **4 Pod**, mỗi Pod tiêu thụ khoảng:

- **CPU:** Khoảng 0.5 vCPU
- **Bộ nhớ:** Khoảng 500MB

Có thể **lấy metrics theo từng component của pipeline** nên ngay cả khi tải đột ngột tăng cao cũng có thể xác nhận ngay component nào là nguyên nhân.

### Cải thiện Load Balancer

Ban đầu cung cấp endpoint trong cluster như kubernetes service (L4 LB), nhưng **khi xem metrics từng Pod thì thấy có sự lệch trong kết nối**, nên đã **đi qua haproxy (L7 LB)**. Helm chart có option sử dụng haproxy nên chỉ cần enable là có thể thay đổi cấu hình.

---

## Ngoại truyện

Về cơ bản đây là phần mềm chất lượng cao và hoạt động ổn định, nhưng trong quá trình thử nghiệm tôi đã làm Vector crash vài lần.

### Phát hiện và sửa bug

Khi triển khai, có cấu hình để **chèn secret như API key của Datadog vào biến môi trường**, nhưng do **nhầm lẫn trong cách restore secret nên có ký tự không phải text hoặc ký tự xuống dòng lẫn vào biến môi trường, điều này đã kích hoạt bug** và gây crash.

Nguyên nhân được xác định ngay từ log, và sau khi tạo pull request thì đã được merge nên bây giờ không còn vấn đề.

**Các PR đã gửi:**
- [fix(config): prevent panic on non-UTF8 environment variables #23513](https://github.com/vectordotdev/vector/pull/23513)
- [fix(datadog_common sink): prevent panic on invalid api key #23514](https://github.com/vectordotdev/vector/pull/23514)

![Hình ảnh Vector crash]()
*Hình: Hình ảnh Vector crash*

### Lần đầu tiên phát triển Rust

Nhờ đó tôi đã **làm Rust lần đầu tiên trong đời**, nhưng vì đã biết code liên quan nên **nhờ ChatGPT giúp và sửa được ngay**. Thời đại tiện lợi quá.

---

## Tổng kết

Vậy thì, **tiếp tục tăng cường observability trong năm 2026 nào!** 🎄

---

## Technology Stack

- Datadog Vector
- Rust
- VRL (Vector Remap Language)
- Kubernetes (GKE)
- datadog-agent
- Datadog Logs
- Datadog Metrics
- haproxy
- Helm
- Argo Workflow

---

## Những điều học được

1. Vector viết bằng Rust, nhẹ và hiệu năng cao
2. VRL có type safety và có thể kiểm tra tĩnh
3. Về giá cả, Observability Pipelines bất lợi hơn Vector thuần
4. Tận dụng metadata kubernetes thông qua liên kết với datadog-agent
5. Đơn giản hóa cấu hình phía Datadog bằng xử lý trước
6. Giám sát chi tiết với metrics theo từng component
7. Cải thiện chất lượng môi trường production bằng đóng góp vào OSS

---

**Bài viết liên quan:**
- [識別式型 vs JWT: Ameba認証基盤刷新でアクセストークン形式をどう選んだか](https://developers.cyberagent.co.jp/blog/archives/60232/)

**Bài gốc:** https://developers.cyberagent.co.jp/blog/archives/60707/
