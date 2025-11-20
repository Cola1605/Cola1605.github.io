---
title: "Đơn giản hóa quản lý Log sử dụng Amazon CloudWatch Logs Centralization"
date: 2025-11-10
draft: false
categories:
  - "AWS"
  - "Monitoring and Observability"
tags:
  - "AWS"
  - "CloudWatch"
  - "Logs"
  - "Centralization"
  - "Management"
  - "Multi-Account"
author: "Raviteja Sunkavalli, Andres Silva, Siddharth Bhate"
translator: "日平"
description: "Hướng dẫn đơn giản hóa quản lý log trên nhiều AWS account và region sử dụng Amazon CloudWatch Logs Centralization"
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/simplifying-log-management-using-amazon-cloudwatch-logs-centralization/)

---

## Tổng quan

Quản lý log trên nhiều AWS account và region luôn là thách thức phức tạp đối với các tổ chức. Khi cơ sở hạ tầng AWS phát triển với các account riêng biệt cho môi trường production, development, staging và các region khác nhau, độ phức tạp của quản lý log tăng theo cấp số nhân. Đặc biệt trong các sự cố nghiêm trọng ngoài giờ, các team phải tốn thời gian quý báu để tìm kiếm qua nhiều account, liên kết các sự kiện giữa các region khác nhau, quản lý hệ thống tập hợp log phức tạp và xử lý quyền truy cập cross-account.

Các phương pháp quản lý log truyền thống không chỉ tiêu tốn nhiều tài nguyên mà còn làm chậm việc giải quyết sự cố, ảnh hưởng đến trải nghiệm khách hàng. Blog này giới thiệu cách đơn giản hóa quản lý log cho môi trường quy mô lớn.

---

## Giới thiệu CloudWatch Logs Centralization

[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) đã cung cấp [cross-account observability](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) thông qua federation của log trên nhiều account, nhưng [CloudWatch Logs Centralization](https://aws.amazon.com/jp/about-aws/whats-new/2025/09/amazon-cloudwatch-cross-account-cross-region-log-centralization/) mới áp dụng phương pháp hoàn toàn khác biệt.

CloudWatch Logs Centralization tích hợp dữ liệu log từ nhiều account và region vào central account. Việc tích hợp này loại bỏ cả overhead vận hành và chi phí liên quan đến quản lý các giải pháp tập hợp tùy chỉnh, đồng thời cung cấp nguồn thông tin duy nhất đáng tin cậy cho toàn bộ dữ liệu log của tổ chức.

![図1. 複数のアカウントとリージョンにまたがるログの統一](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/%E5%90%8D%E7%A7%B0%E6%9C%AA%E8%A8%AD%E5%AE%9A-scaled.jpg)

**Hình 1. Thống nhất log trên nhiều account và region**

CloudWatch Logs Centralization làm việc với [AWS Organizations](https://aws.amazon.com/jp/organizations/) để định nghĩa các rule tự động sao chép dữ liệu log dựa trên yêu cầu chính xác của bạn. Bạn có toàn quyền kiểm soát về những gì cần centralize, nơi lưu trữ và cách mã hóa, đồng thời duy trì security boundary và compliance requirement.

---

## Hướng dẫn triển khai Solution

### Yêu cầu tiên quyết

1. **Thiết lập AWS Organizations**
   - Đảm bảo source account và destination account là một phần của organization
   
2. **Bật Trusted Access cho CloudWatch**
   - Truy cập CloudWatch console → Settings
   - Tại tab Organization, nhấp "Turn on trusted access"
   
   ![図2. CloudWatch の信頼されたアクセスの有効化](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/Trusted-access.png)
   
   **Hình 2. Bật Trusted Access cho CloudWatch**

3. **(Tùy chọn) Đăng ký Delegated Administrator**
   - Delegated administrator có thể chọn deploy các tính năng CloudWatch cho tất cả account trong organization hoặc các OU cụ thể

---

### Cấu hình Log Centralization Rule

Để tạo centralization rule sao chép dữ liệu log từ source account đến destination account:

**Bước 1: Chỉ định Source Details**

1. Truy cập [CloudWatch console](http://console.aws.amazon.com/cloudwatch/home) của management account hoặc delegated administrator account
2. Chọn Settings → Organization
3. Chọn "Configure rules"
4. Chỉ định source details:
   - Nhập rule name (ví dụ: `production-logs-central`)
   - Chọn `Source account` bằng Account ID, Organization Unit ID, hoặc Organization ID
   - Chọn `Source Regions` để chọn các log cần tích hợp
   
   ![図3. ログ一元化の送信元詳細の指定](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/Specify-source.png)
   
   **Hình 3. Chỉ định Source Details cho Log Centralization**

5. Chọn "Next"

**Bước 2: Chỉ định Destination Details**

6. Chọn `Destination account` và `Destination Region`
7. (Tùy chọn) Chỉ định `Backup Region` trong destination account để giữ bản sao đồng bộ của log, đảm bảo tính khả dụng của dữ liệu khi primary region gặp sự cố
   
   ![図4. ログ一元化の送信先詳細の指定](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/Specify-destination.png)
   
   **Hình 4. Chỉ định Destination Details cho Log Centralization**

**Bước 3: Chỉ định Telemetry Data**

7. Cấu hình các trường sau và chọn "Next":
   
   a. **Chọn log group:**
   - Chọn tất cả log group hoặc filter log group để chỉ định các log group muốn tích hợp
   
   b. **Log group selection criteria:**
   - Supported key: `LogGroupName | *`
   - Supported operator: `= | != | IN | NOT IN | AND | OR | LIKE | NOT LIKE`
   
   c. **Xử lý KMS encrypted log group:**
   
   - **Option 1: Centralize log groups encrypted with AWS KMS key in destination account with AWS KMS key**
     - Sử dụng destination KMS key ARN được cung cấp để centralize encrypted log group từ source account
     - Cần cung cấp destination encryption key ARN và backup destination encryption key ARN (nếu đã chọn backup region)
     - KMS key phải có permission cho CloudWatch Logs để mã hóa. Xem: [Bước 2: Thiết lập permission với KMS key](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatchLogs-Insights-Query-Encrypt.html#cmk-permissions)
   
   - **Option 2: Centralize log groups encrypted with AWS KMS key in destination account without AWS KMS key**
     - Centralize KMS encrypted log group từ source account mà không mã hóa ở destination account
   
   - **Option 3: Do not centralize log groups encrypted with AWS KMS key**
     - Không centralize các log group được AWS KMS mã hóa ở source account
   
   ![図5. ログ一元化のテレメトリーデータの指定](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/Specify-Log-groups.png)
   
   **Hình 5. Chỉ định Telemetry Data cho Log Centralization**

**Bước 4: Xác nhận và Tạo**

8. Trên trang Review and Configure, xem xét tất cả các chi tiết và nhấp "Create centralization rule"

**Kết quả:**

Khi centralization rule được tạo và kích hoạt, các log event bắt đầu tích hợp vào central account. Các log group cùng tên được hợp nhất để tối ưu hóa quản lý log, và log stream được thêm identifier của source account ID và source region. Hơn nữa, các log event được thêm các system field mới (`@aws.account` và `@aws.region`) để dễ dàng theo dõi nguồn gốc của dữ liệu log.

![図6. 送信先アカウントでの一元化されたログ](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/Destination-Logs.png)

**Hình 6. Centralized log trong destination account**

> **Lưu ý quan trọng:** CloudWatch log centralization chỉ xử lý dữ liệu log mới đến source account sau khi tạo centralization rule. Dữ liệu log lịch sử (log tồn tại trước khi tạo rule) sẽ không được centralize.

---

### Giám sát Health của Centralization Rule

Khi rule được kích hoạt, bạn có thể kiểm tra health status thông qua console hoặc theo chương trình bằng API `GetCentralizationRuleForOrganization`.

![図7. 一元化ルールの健全性の監視](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/Rule-health.png)

**Hình 7. Giám sát Health của Centralization Rule**

**Rule health status:**

- **HEALTHY (Bình thường):** Rule hoạt động bình thường và đang sao chép dữ liệu log theo cấu hình
- **UNHEALTHY (Bất thường):** Rule gặp vấn đề và dữ liệu có thể không được sao chép đúng cách
- **PROVISIONING (Đang cung cấp):** Organization centralization đang trong quá trình thiết lập

Khi rule được đánh dấu `UNHEALTHY`, trường FailureReason sẽ hiển thị chi tiết về vấn đề cụ thể cần giải quyết.

---

## Phân tích tích hợp sử dụng Centralized Log

Khi log được centralize, các tính năng phân tích mạnh mẽ mà không thể thực hiện với distributed log trở nên khả dụng. Việc thêm các system field `@aws.account` và `@aws.region` biến đổi cách troubleshooting và phân tích quy mô lớn. Các field này được tự động index hóa để hỗ trợ truy xuất kết quả query nhanh hơn.

**Ví dụ 1: Query log từ account và region cụ thể**

Sử dụng [CloudWatch Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) để thực hiện query hiển thị timestamp, account, region, message, log stream và log group field từ tất cả các region, giới hạn kết quả ở 100 entry:

```
fields @timestamp, @aws.account, @aws.region, @message, @logStream, @log 
| filter @aws.account = 123456789012 and @aws.region = 'us-west-2'
| sort @timestamp desc
| limit 100
```

![図8. CloudWatch Log Insights を使用したクエリの実行](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/LogsInsights.png)

**Hình 8. Thực hiện Query bằng CloudWatch Log Insights**

**Ví dụ 2: Liệt kê các lần thử authentication thất bại theo account và region**

```
fields @timestamp, @aws.account, @aws.region, @message 
| filter @message like /(?i)(failed|unauthorized|denied|forbidden)/
| stats count() as failed_attempts by @aws.account, @aws.region
| sort failed_attempts desc
```

**Ví dụ 3: Phân tích slow query của DB trên nhiều account và region**

```
fields @timestamp, @message, @aws.account, @aws.region
| filter @message like /(query|database|sql)/ and @message like /(slow|timeout|duration)/
| parse @message /query.*?(?<query_duration>\d+)ms/
| parse @message /rows.*?examined[=:]?\s*(?<rows_examined>\d+)/
| parse @message /rows.*?returned[=:]?\s*(?<rows_returned>\d+)/
| parse @message /(?<query_type>SELECT|INSERT|UPDATE|DELETE)/
| parse @message /table[=:]?\s*(?<table_name>\w+)/
| filter query_duration > 1000
| stats 
    count() as slow_queries,
    avg(query_duration) as avg_duration,
    max(query_duration) as max_duration,
    avg(rows_examined) as avg_rows_examined,
    avg(rows_returned) as avg_rows_returned
    by query_type, table_name, @aws.account, @aws.region, bin(5m)
| sort max_duration desc
```

---

## Best Practice cho các tính năng CloudWatch Logs

### 1. Metric và Subscription Filter

CloudWatch Logs Centralization cho phép các tính năng chuyển đổi dữ liệu và tích hợp mạnh mẽ thông qua metric và subscription filter. Tổ chức có thể chuyển đổi dữ liệu log centralized thành numeric metric, thực hiện visualization bằng graph và monitoring dựa trên alarm.

**Ví dụ: Tạo metric filter cho tất cả log**

Bạn có thể [tạo metric filter](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/MonitoringLogData.html) cho tất cả log bất kể account hoặc region:

```bash
aws logs put-metric-filter \
  --log-group-name /centralized/production \
  --filter-name ThrottledAPICalls \
  --filter-pattern '{ $.errorCode = "*Throttled*" }' \
  --metric-transformations \
metricName=ThrottledCalls,\
metricNamespace=CentralizedMetrics,\
metricValue=1,\
dimensions={Account=$aws.account,Region=$aws.region}
```

Hơn nữa, bạn có thể thiết lập real-time log event streaming thông qua [subscription filter](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/Subscriptions.html), tích hợp với nhiều destination như [Amazon Kinesis stream](https://aws.amazon.com/jp/kinesis/data-streams/), [Amazon Data Firehose stream](https://aws.amazon.com/jp/firehose/), [Amazon OpenSearch Service](https://aws.amazon.com/jp/opensearch-service/), [AWS Lambda](https://aws.amazon.com/jp/pm/lambda/).

![図9. サブスクリプションフィルターでのアカウントとリージョンフィールドのフィルタリング](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/10/subscription-filters.png)

**Hình 9. Filtering Account và Region field trong Subscription Filter**

---

### 2. Log Transformation

Khi sử dụng CloudWatch Logs Centralization, chỉ raw log data được copy từ source account sang central account. [Log transformation](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) được áp dụng tại thời điểm ingestion ở source account sẽ không được phản ánh trong centralized log.

Để thực hiện log transformation nhất quán trên toàn tổ chức, hãy thiết lập log transformation trực tiếp trong central account sau khi log được tích hợp.

---

### 3. Tối ưu hóa Chi phí Lưu trữ Log

CloudWatch Logs Centralization cung cấp cấu trúc giá cost-effective cho quản lý log trên nhiều account và region. Bản copy centralized đầu tiên không phát sinh phí ingestion bổ sung hoặc chi phí data transfer cross-region, chỉ tính phí storage và feature pricing chuẩn của CloudWatch. Các bản copy bổ sung vượt quá centralization đầu tiên phát sinh phí $0.05 mỗi GB (việc sử dụng backup region feature cũng tạo bản copy bổ sung). Chi tiết: [Trang giá CloudWatch](https://aws.amazon.com/jp/cloudwatch/pricing/).

#### 1. Triển khai Tiered Retention Strategy

Bạn có thể giảm đáng kể chi phí storage bằng cách triển khai 2-tier retention policy:

1. **Source account:** Thiết lập short-term retention (7-30 ngày) cho nhu cầu vận hành ngay lập tức
2. **Centralized account:** Thiết lập long-term retention (90 ngày trở lên) để đáp ứng compliance requirement và hỗ trợ phân tích lịch sử

#### 2. Sử dụng Selective Centralization

Khi tạo bản copy bổ sung của log, hãy áp dụng phương pháp centralization chiến lược:

1. Tận dụng log group filter để chỉ centralize các application hoặc service cụ thể
2. Xác định chỉ những log phù hợp với business requirement để centralize
3. Tránh centralize dữ liệu log không cần thiết không hữu ích cho use case cụ thể

#### 3. Backup Strategy

Khi lập kế hoạch backup strategy, hãy xem xét các yếu tố sau:

1. Lưu ý rằng backup copy được coi là bản copy bổ sung và phát sinh phí $0.05 mỗi GB
2. Chỉ bật backup centralization khi có requirement cụ thể về dedicated backup cho central account
3. Xem xét tận dụng source account như backup copy để loại bỏ phí bổ sung

Bằng cách triển khai các optimization strategy này, bạn có thể duy trì quản lý log hiệu quả trong khi kiểm soát chi phí.

---

## Kết luận

CloudWatch Logs Centralization biến đổi quản lý log cross-account và cross-region bằng cách cung cấp giải pháp AWS native loại bỏ độ phức tạp của custom log aggregation system. Với các tính năng như automatic replication, seamless integration với AWS Organizations, cross-region support và flexible encryption option, tổ chức có thể đạt được quản lý log toàn diện với thời gian thiết lập tối thiểu.

Nó mang lại giá trị ngay lập tức thông qua cải thiện hiệu quả vận hành, tăng cường security posture và giải quyết sự cố nhanh hơn. Để bắt đầu, hãy tham khảo tài liệu [Cross-account cross-region log centralization](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html).

---

## Về các Tác giả

**Raviteja Sunkavalli**  
Senior Worldwide Specialist Solutions Architect tại Amazon Web Services, chuyên về AIOps và GenAI observability. Hỗ trợ khách hàng toàn cầu triển khai các giải pháp observability và incident management trên môi trường cloud phức tạp và phân tán. Ngoài công việc, thích chơi cricket và khám phá các công thức nấu ăn mới.

**Andres Silva**  
Global Cloud Operations Leader và Principal Specialist Solutions Architect tại Amazon Web Services (AWS), hỗ trợ doanh nghiệp chuyển đổi cloud operation. Với hơn 30 năm kinh nghiệm technology bao gồm 10 năm tại AWS, chuyên về DevOps, cloud technology và SaaS infrastructure management. Đặt trụ sở tại High Point, North Carolina, thúc đẩy cloud operation strategy toàn doanh nghiệp tập trung vào AIOps và observability.

**Siddharth Bhate**  
Senior Product Manager – Technical tại Amazon CloudWatch team. Tập trung vào core telemetry product, tham gia xây dựng highly scalable và resilient log ingestion và management service trở thành nền tảng observability cho khách hàng AWS. Đam mê hỗ trợ khách hàng chuyển đổi operational data thành actionable insight, cải thiện application performance và tối ưu hóa chi phí. Ngoài công việc, là cha của chó Beagle và golfer handicap cao nhiệt tình.

---


**Bài viết gốc:** [Simplifying Log Management using Amazon CloudWatch Logs Centralization](https://aws.amazon.com/jp/blogs/mt/simplifying-log-management-using-amazon-cloudwatch-logs-centralization/)  
**Dịch bởi:** Technical Account Manager 日平
