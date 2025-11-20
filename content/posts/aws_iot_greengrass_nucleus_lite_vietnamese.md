---
title: "AWS IoT Greengrass nucleus lite – Cách mạng hóa điện toán biên trên các thiết bị bị hạn chế tài nguyên"
date: 2025-10-14
draft: false
categories: ["AWS", "DevOps and Infrastructure"]
tags: ["AWS-IoT", "Greengrass", "edge-computing", "IoT-edge", "nucleus-lite", "resource-constrained", "embedded-systems", "smart-devices"]
description: "AWS IoT Greengrass nucleus lite - edge runtime mã nguồn mở nhẹ viết bằng C, cách mạng hóa IoT edge computing trên thiết bị hạn chế tài nguyên như smart home hub, wearables và robotics với yêu cầu RAM chỉ từ 64MB."
---

# AWS IoT Greengrass nucleus lite – Cách mạng hóa điện toán biên trên các thiết bị bị hạn chế tài nguyên

**Tác giả:** Yuki Kawasaki (Người dịch), Camilla Panni, Greg Breen (Tác giả gốc)  
**Ngày xuất bản:** 14 tháng 10 năm 2025  
**Danh mục:** AWS IoT Greengrass, General, Internet of Things  
**Thẻ:** AWS IoT, AWS IoT Greengrass V2, Edge Computing, IoT Edge

---

## Tổng quan

[AWS IoT Greengrass](https://docs.aws.amazon.com/greengrass/v2/developerguide/what-is-iot-greengrass.html) là một edge runtime mã nguồn mở. Dịch vụ đám mây này có thể xây dựng, triển khai và quản lý các ứng dụng đa tiến trình ở quy mô lớn, hỗ trợ vận hành toàn bộ hạm đội IoT.

AWS IoT Greengrass đã phát hành V2 vào tháng 12 năm 2020 và giới thiệu edge runtime bằng Java được gọi là [nucleus](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html). Trong [release 2.14.0](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-release-2024-12-16.html) vào tháng 12 năm 2024, họ đã thêm nucleus lite, một tùy chọn edge runtime bổ sung được viết bằng ngôn ngữ C.

AWS IoT Greengrass nucleus lite là một edge runtime [mã nguồn mở](https://github.com/aws-greengrass/aws-greengrass-lite) nhẹ nhắm đến các thiết bị bị hạn chế tài nguyên. Nó mở rộng khả năng của AWS IoT Greengrass trên các máy tính đơn bảng chi phí thấp cho các ứng dụng sản xuất hàng loạt như smart home hub, đồng hồ thông minh, xe thông minh, edge AI và robotics.

Blog này giải thích lợi ích của hai tùy chọn edge runtime và cung cấp hướng dẫn để chọn tùy chọn tốt nhất cho trường hợp sử dụng của bạn.

---

## Sự khác biệt chính giữa nucleus và nucleus lite

AWS IoT Greengrass nucleus lite hoàn toàn tương thích với [API dịch vụ đám mây V2](https://docs.aws.amazon.com/greengrass/v2/APIReference/API_Operations.html) và giao diện [Inter-Process Communication (IPC)](https://docs.aws.amazon.com/greengrass/v2/developerguide/interprocess-communication.html) của AWS IoT Greengrass. Điều này có nghĩa là bạn có thể xây dựng và triển khai các component nhắm đến một hoặc cả hai runtime, và có thể tiếp tục sử dụng dịch vụ đám mây để quản lý hạm đội thiết bị. Tuy nhiên, nucleus lite có một số điểm khác biệt quan trọng, khiến nó phù hợp với các trường hợp sử dụng cụ thể.

### Sử dụng bộ nhớ

AWS IoT Greengrass nucleus yêu cầu [không gian đĩa từ 256 MB trở lên, RAM từ 96 MB trở lên](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html#greengrass-v2-requirements).

Tuy nhiên, vì hệ điều hành, Java Virtual Machine (JVM) và ứng dụng hoạt động, RAM tối thiểu 512 MB được khuyến nghị. Gần đây, các thiết bị có RAM 1GB trở lên đã trở nên phổ biến. Nhưng vẫn còn nhiều thiết bị phải hoạt động với tài nguyên hạn chế. nucleus lite ra đời để có thể được sử dụng ngay cả trên các thiết bị có điều kiện tài nguyên vật lý nghiêm ngặt.

nucleus lite hoạt động với footprint cực kỳ nhỏ. Nó chỉ cần [RAM 5MB, lưu trữ (đĩa/flash) 5MB](https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-lite-component.html#greengrass-nucleus-lite-component-requirements). Ngoài ra, nó không cần JVM và có thể hoạt động chỉ với thư viện chuẩn C.

![Memory footprint of nucleus versus nucleus lite](Hình 1: So sánh footprint bộ nhớ của nucleus và nucleus lite)

Một lựa chọn mới để sử dụng AWS IoT Greengrass ngay cả trên các thiết bị bị hạn chế tài nguyên đã xuất hiện.

### Phân bổ bộ nhớ tĩnh

Footprint bộ nhớ của AWS IoT Greengrass nucleus lite runtime được xác định trong quá trình cấu hình ban đầu và quá trình build. Khi runtime khởi động, nucleus lite phân bổ một lượng bộ nhớ cố định và sau đó lượng đó vẫn không đổi.

Điều này có nghĩa là yêu cầu tài nguyên của nucleus lite có thể dự đoán được và tái tạo lại, rủi ro rò rỉ bộ nhớ được giảm thiểu và loại bỏ độ trễ không xác định liên quan đến các ngôn ngữ thực hiện garbage collection.

Sử dụng bộ nhớ chỉ thay đổi thông qua phân bổ bộ nhớ động bởi các component AWS IoT Greengrass đã triển khai hoặc các chương trình chạy bên ngoài AWS IoT Greengrass.

### Cấu trúc thư mục

Nucleus lite phân tách nucleus lite runtime, Greengrass component, cấu hình và log vào các vùng khác nhau trên đĩa. Trong hệ thống Linux nhúng, các yếu tố khác nhau này thường có thể được lưu trữ trên các phân vùng hoặc volume khác nhau.

Ví dụ:

- nucleus lite runtime có thể được lưu trữ trên phân vùng chỉ đọc như một phần của phân vùng A/B để cho phép cập nhật image OS.
- Các component và cấu hình của AWS IoT Greengrass có thể được lưu trữ trên phân vùng đọc-ghi hoặc overlay để ứng dụng có thể được quản lý thông qua triển khai AWS IoT Greengrass.
- Các file log có thể được lưu trữ trên phân vùng tạm thời hoặc một volume vật lý khác để không tiêu thụ chu kỳ ghi của bộ nhớ flash hạn chế của root volume.

Sự phân tách này giúp xây dựng golden image để sản xuất thiết bị ở quy mô lớn. Để biết thêm chi tiết, xem [Manufacturing devices at scale with AWS IoT Greengrass golden images](https://docs.aws.amazon.com/prescriptive-guidance/latest/iot-greengrass-golden-images/introduction.html).

### Tích hợp với systemd

[systemd](https://systemd.io/) là framework quản lý hệ thống và dịch vụ thường có sẵn trên hệ thống Linux, và là bắt buộc cho AWS IoT Greengrass nucleus lite.

Khi cài đặt nucleus lite trên thiết bị, nó được cài đặt như [một tập hợp các dịch vụ hoặc daemon systemd](https://github.com/aws-greengrass/aws-greengrass-lite/blob/main/docs/design/overview.md). nucleus lite cài đặt mỗi component AWS IoT Greengrass mà bạn triển khai lên thiết bị như một dịch vụ systemd riêng biệt. nucleus lite có thể được coi như một systemd được quản lý đám mây mở rộng trên nhiều hạm đội thiết bị.

Vì nucleus lite và các component được cài đặt như các dịch vụ systemd, systemd xử lý và quản lý tập trung log hệ thống. Điều này có nghĩa là bạn có thể giám sát, bảo trì và gỡ lỗi phần mềm thiết bị bằng các công cụ hệ thống Linux phổ biến.

---

## Lựa chọn giữa nucleus và nucleus lite

Việc lựa chọn giữa nucleus runtime và nucleus lite runtime phụ thuộc vào trường hợp sử dụng, hạn chế của thiết bị, tính năng cần thiết và OS. Bảng sau tóm tắt hướng dẫn lựa chọn.

### Bảng 1: Hướng dẫn khi lựa chọn giữa nucleus và nucleus lite

| **Trường hợp sử dụng nucleus** | **Trường hợp sử dụng nucleus lite** |
|----------------------|--------------------------|
| Muốn sử dụng Windows làm hệ điều hành, hoặc muốn sử dụng bản phân phối Linux không bao gồm systemd | Bộ nhớ thiết bị bị hạn chế và RAM là 512 MB trở xuống |
| Các component ứng dụng là Docker container | Tần số clock của CPU thiết bị dưới 1 GHz |
| Các component ứng dụng là hàm Lambda | Tạo bản phân phối Linux nhúng và cần kiểm soát chính xác lược đồ phân vùng để hỗ trợ các tính năng như cập nhật image OS và phân vùng A/B |
| Phát triển các component ứng dụng bằng ngôn ngữ kịch bản hoặc ngôn ngữ lập trình thông dịch | Phát triển các component ứng dụng bằng ngôn ngữ lập trình biên dịch sang mã máy |
| Muốn sử dụng [các tính năng chưa được hỗ trợ bởi nucleus lite](https://docs.aws.amazon.com/greengrass/v2/developerguide/operating-system-feature-support-matrix.html) | Có yêu cầu tuân thủ không phù hợp với Java |
| Tạo [AWS IoT SiteWise gateway](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/gw-self-host-gg2.html) | Ưa thích phân bổ bộ nhớ tĩnh |

Hướng dẫn trong Bảng 1 không phải là quy phạm mà là hướng dẫn chung. Ví dụ, bạn có thể sử dụng nucleus lite trên các thiết bị có gigabyte RAM dựa trên nhu cầu của trường hợp sử dụng. Ngoài ra, nếu thiết bị có đủ tài nguyên, bạn cũng có thể triển khai các component được viết bằng ngôn ngữ kịch bản hoặc ngôn ngữ thông dịch lên nucleus lite.

---

## Các tình huống và trường hợp sử dụng

### Trường hợp sử dụng

nucleus lite phù hợp với các thiết bị chi phí thấp có bộ nhớ và khả năng xử lý hạn chế, cùng với các bản phân phối Linux nhúng được chọn lọc cẩn thận do yêu cầu tài nguyên thấp. Các thiết bị này bao gồm nhiều lĩnh vực như smart home, công nghiệp, ô tô và đồng hồ thông minh.

### Hệ thống nhúng

nucleus lite thể hiện bước tiến lớn cho các nhà phát triển hệ thống nhúng bằng cách bao gồm hỗ trợ Linux nhúng được cung cấp bởi [meta-aws project](https://github.com/aws4embeddedlinux/meta-aws) ngay từ khi ra mắt. Dự án này bao gồm [sample recipe](https://github.com/aws4embeddedlinux/meta-aws/tree/master/recipes-iot/aws-iot-greengrass), cho phép build AWS IoT Greengrass vào dự án OpenEmbedded hoặc Yocto. Dự án anh em của dự án này, [meta-aws-demos](https://github.com/aws4embeddedlinux/meta-aws-demos), bao gồm nhiều demo AWS IoT Greengrass, bao gồm [demo cập nhật A/B sử dụng RAUC](https://github.com/aws4embeddedlinux/meta-aws-demos/tree/master/meta-aws-demos/recipes-core/images/aws-iot-greengrass-lite-demo-image#ab-update-example-made-with-meta-rauc).

### Hỗ trợ đa người thuê với AWS IoT Greengrass nucleus lite được container hóa nhẹ

Vì nucleus lite có footprint nhỏ, nó cho phép container hóa hiệu quả cho triển khai IoT đa người thuê. Bạn có thể chạy nhiều ứng dụng tách biệt được tích hợp với AWS IoT Greengrass runtime riêng của chúng.

![Multi-tenant containerization](Hình 2: Container hóa đa người thuê)

Lợi ích của kiến trúc như sau:

- **Cách ly có ý thức về bảo mật**: Mỗi instance được container hóa duy trì ranh giới nghiêm ngặt giữa các ứng dụng.
- **Tối ưu hóa tài nguyên**: Footprint nhẹ cho phép hỗ trợ nhiều container ngay cả trong môi trường bị hạn chế.
- **Vận hành độc lập**: Có thể quản lý, gỡ lỗi và cập nhật các ứng dụng riêng lẻ.
- **Triển khai linh hoạt**: Hỗ trợ nhiều chiến lược container hóa khác nhau dựa trên khả năng của thiết bị.

---

## Các phương pháp hay nhất trong triển khai

Không cần phải viết lại các component để sử dụng nucleus lite. Tuy nhiên, nếu bạn muốn tối đa hóa hiệu suất bộ nhớ, bạn có thể chọn tối ưu hóa hoặc viết lại các component.

Khi sử dụng nucleus lite, hãy kiểm tra các cân nhắc quan trọng sau.

### Tương thích plugin

[Plugin component](https://docs.aws.amazon.com/greengrass/v2/developerguide/develop-greengrass-components.html#component-types) là các component Java đặc biệt được tích hợp chặt chẽ với nucleus runtime phiên bản Java. Các plugin này không thể sử dụng được trên nucleus lite runtime.

### Cân nhắc về ngôn ngữ component

Khi chọn ngôn ngữ lập trình cho custom component, cần xem xét rằng interpreter hoặc môi trường runtime của mỗi ngôn ngữ ảnh hưởng đến toàn bộ footprint bộ nhớ. Chọn ngôn ngữ như Python sẽ phần nào bù trừ hiệu quả tiết kiệm bộ nhớ của nucleus lite. Nếu chọn Java, bạn cần đưa JVM vào hệ thống.

### Khuyến nghị cho các tình huống khác nhau

Khi di chuyển từ nucleus sang nucleus lite, các component hiện có sẽ hoạt động như cũ. Do đó, việc di chuyển sang nucleus lite trở nên dễ dàng và chức năng được duy trì trong khi lập kế hoạch tối ưu hóa.

**Khi tạo mới:**

- Xem xét viết lại các component quan trọng để đạt hiệu quả tối đa.
- Chọn ngôn ngữ có overhead runtime tối thiểu như C, C++, Rust.
- Cân bằng giữa nỗ lực phát triển và nhu cầu tối ưu hóa bộ nhớ.

**Khi lập kế hoạch dung lượng bộ nhớ:**

- Trong tính toán bộ nhớ, hãy xem xét tất cả các phụ thuộc runtime.
- Đánh giá footprint toàn bộ hệ thống, không chỉ kích thước của nucleus lite.
- Xem xét tích hợp component khi thích hợp.

---

## Triển vọng tương lai và kết luận

Trong tương lai, bằng cách tận dụng AWS IoT Greengrass nucleus lite, bạn có thể tái cấu trúc triển khai điện toán biên.

Bằng cách giảm đáng kể yêu cầu tài nguyên, những điều sau trở nên khả thi:

- Triển khai chức năng IoT lên các thiết bị có giới hạn tài nguyên
- Triển khai giải pháp điện toán biên trên phần cứng rộng hơn
- Giảm overhead vận hành trong khi duy trì chức năng
- Thực hiện các trường hợp sử dụng mới đã bị giới hạn bởi yêu cầu tài nguyên

Đối với các nhà phát triển, nucleus lite cung cấp cơ hội mới để làm điều sáng tạo ở biên. Thay vì lo lắng về việc điện toán biên có khả thi trên các thiết bị bị hạn chế tài nguyên hay không, bạn có thể tập trung vào triển khai các giải pháp tạo ra giá trị kinh doanh.

Sự cải tiến này trong danh mục AWS IoT cho thấy cam kết xây dựng các giải pháp IoT hiệu quả và có thể mở rộng phục vụ nhiều thiết bị và trường hợp sử dụng hơn.

Xem xét những điều sau để phát triển giải pháp IoT bằng AWS IoT Greengrass nucleus lite:

- **Hiểu chi tiết hơn**: Tham khảo [tài liệu AWS IoT Greengrass](https://docs.aws.amazon.com/greengrass/v2/developerguide/what-is-iot-greengrass.html).
- **Thử nucleus lite**: Theo [hướng dẫn cài đặt](https://github.com/aws-greengrass/aws-greengrass-lite/blob/main/docs/SETUP.md#setting-up-greengrass-nucleus-lite) hoặc [hướng dẫn Getting Started](https://docs.aws.amazon.com/greengrass/v2/developerguide/getting-started.html) để bắt đầu thử nghiệm và phát triển.
- **Hỏi chuyên gia**: Nếu có câu hỏi hoặc cần hướng dẫn, hãy tham khảo ý kiến chuyên gia AWS IoT.
- **Tham gia cộng đồng**: Chia sẻ trải nghiệm hoặc học hỏi từ người dùng khác tại diễn đàn cộng đồng [AWS IoT](https://repost.aws/topics/TAEQXJMLWWTp2elx_Bkb1Kvw/internet-of-things-iot).
- **Đóng góp**: Đóng góp code vào [kho mã nguồn mở](https://github.com/aws-greengrass/aws-greengrass-lite).

---

## Về tác giả

**Camilla Panni** là Solution Architect tại Amazon Web Services. Cô ấy hỗ trợ khách hàng khu vực công ở khắp nước Ý tăng tốc các nỗ lực áp dụng đám mây của họ. Nền tảng kỹ thuật của cô trong tự động hóa và IoT thúc đẩy niềm đam mê của cô trong việc hỗ trợ khách hàng đổi mới với các công nghệ mới nổi.

**Greg Breen** là Senior IoT Specialist Solution Architect tại Amazon Web Services. Có trụ sở tại Úc, ông hỗ trợ khách hàng trên toàn khu vực châu Á - Thái Bình Dương xây dựng các giải pháp IoT. Với kinh nghiệm phong phú trong hệ thống nhúng, ông đặc biệt quan tâm đến việc hỗ trợ các nhóm phát triển sản phẩm đưa thiết bị ra thị trường.

---

**Bài viết gốc**: [AWS IoT Greengrass nucleus lite – Revolutionizing edge computing on resource-constrained devices](https://aws.amazon.com/jp/blogs/iot/aws-iot-greengrass-nucleus-lite-revolutionizing-edge-computing-on-resource-constrained-devices/)  
**Người dịch**: Solution Architect Kawasaki
