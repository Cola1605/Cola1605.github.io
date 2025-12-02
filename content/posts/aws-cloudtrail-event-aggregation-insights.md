---
title: "AWS CloudTrail: Tính Năng Event Aggregation và Insights cho Data Events"
slug: "aws-cloudtrail-event-aggregation-insights"
description: "AWS CloudTrail ra mắt 2 tính năng mới cho data events: Event Aggregation tổng hợp dữ liệu thành bản tóm tắt 5 phút giảm 90% lượng dữ liệu gửi downstream, và Insights tự động phát hiện bất thường API call rate và error rate. Tích hợp CloudWatch Logs Insights, Athena, subscription filters và EventBridge cho bảo mật và tối ưu chi phí."
date: 2025-12-01
draft: false
images: ["/images/og-aws-cloudtrail-aggregation.png"]
categories:
  - Cloud Computing
  - Development
tags:
  - AWS CloudTrail
  - Event Aggregation
  - Insights
  - Data Events
  - CloudWatch Logs
  - Security Monitoring
  - Cost Optimization
  - Amazon S3
  - AWS Lambda
  - Kinesis
  - Firehose
author: "Fumiya Kato"
---

AWS CloudTrail vừa công bố 2 tính năng mới quan trọng cho data events: **Event Aggregation** và **Insights**. Event Aggregation tổng hợp data events thành bản tóm tắt 5 phút, giảm đáng kể lượng dữ liệu gửi đến hệ thống downstream. Insights tự động phát hiện các mẫu hoạt động API bất thường. Bài viết hướng dẫn chi tiết cấu hình, phân tích với CloudWatch Logs Insights/Athena, sử dụng subscription filters và tạo alerts với CloudWatch Metrics filters/EventBridge.

<!--more-->

## Bối cảnh và thách thức

### Vấn đề với Data Events

Data events (như S3 object-level operations, Lambda invocations) tạo ra khối lượng logs khổng lồ, dẫn đến:

- **Tăng chi phí**: Storage và processing costs cho downstream workflows
- **Khó phát hiện bất thường**: Khó xác định anomalies trong data events
- **Phản ứng chậm**: Khó phản hồi nhanh khi có bất thường

Những thách thức này gây ra chi phí không cần thiết, làm chậm troubleshooting và để lại rủi ro bảo mật tiềm ẩn.

### Giải pháp với 2 tính năng mới

**1. Event Aggregation**
- Tối ưu hóa lượng dữ liệu
- Xác định API activity patterns

**2. Insights**
- Phát hiện anomalies trong data events
- Tăng cường security monitoring

## Event Aggregation

### Tổng quan

Event Aggregation tổng hợp data events thành bản tóm tắt 5 phút, cung cấp:

- **Access frequency**: Số lần truy cập resources
- **Error rates**: Tỷ lệ lỗi
- **Most frequently used API actions**: Xu hướng sử dụng API

Giữ được insights quan trọng cho security và operational monitoring trong khi giảm đáng kể lượng dữ liệu gửi đến downstream analysis systems.

### 3 Aggregation Templates

#### 1. API Activity

Tóm tắt 5 phút về data events của API calls. Hiểu được:

- Tần suất API
- Caller
- Source
- API usage patterns

#### 2. Resource Access

Activity patterns của AWS resources. Hiểu được:

- Cách AWS resources được truy cập
- Số lần truy cập trong 5 phút
- Ai đang truy cập resources
- Actions nào được thực hiện

#### 3. User Actions

Activity patterns dựa trên IAM principals thực hiện API calls.

### Cấu hình

1. Vào CloudTrail console
2. Menu bên trái chọn **Trails**
3. Chọn trail cho CloudTrail events
4. Tại **Aggregated events**, chọn **Edit**
5. Ở **Aggregation template**, chọn template mong muốn
6. Chọn **Save changes**

**Lưu ý**: Có thể cấu hình khi tạo trail mới.

### Storage và truy cập

Aggregated events được gửi đến folder `CloudTrail-Aggregated` trong S3 bucket của trail.

### Phân tích

#### Amazon Athena

Query trực tiếp từ S3 bucket.

#### CloudWatch Logs Insights

Nếu đã gửi CloudTrail events đến CloudWatch Logs, có thể phân tích bằng SQL queries.

**Sample SQL Query**:

```sql
SELECT accountId, awsRegion, 
`summary.primaryDimension.dimension` as Dimension, 
`timeWindow.windowStart` as `Start Time`,
`timeWindow.windowEnd` as `End Time`,
`summary.details.3.statistics.0.name` as sourceIpAddress,
`summary.primaryDimension.statistics.0.name` as eventName, 
`summary.primaryDimension.statistics.0.value` as Count,
`summary.details.1.statistics.0.name` as userIdentity, 
`summary.details.0.statistics.0.name` as resource,
`summary.details.0.statistics.0.value` as `Resource Count`
FROM `[Log Group]`
WHERE `eventCategory` = 'Aggregated'
AND `summary.primaryDimension.dimension` = 'eventName'
ORDER BY `timeWindow.windowStart`, `timeWindow.windowEnd` DESC;
```

**Kết quả query**:
- API actions được thực hiện và tổng count trong mỗi aggregation period
- Thống kê về users và resources đóng góp vào API activity

### Hiệu quả giảm dữ liệu

Lượng events được gửi giảm đáng kể so với data events (xem hình 3 trong bài gốc).

## Subscription Filters để gửi dữ liệu hiệu quả

### Mục đích

Giảm thêm lượng dữ liệu gửi đến downstream systems.

### Destinations

- Kinesis Data Streams
- Amazon Data Firehose
- Lambda functions
- Amazon OpenSearch Service

### Filter Pattern

Chỉ gửi management events và aggregated events, loại bỏ data events:

```json
{ ($.eventCategory = "Management") || ($.eventCategory = "Aggregated") }
```

### Cấu hình

1. Vào CloudWatch console
2. Menu bên trái chọn **Log groups**
3. Chọn log group của CloudTrail
4. Chọn tab **Subscription filters**
5. Chọn **Create** và chọn destination
6. Log format: **JSON**
7. Subscription filter pattern: Pattern ở trên

### Lợi ích

Giảm chi phí bằng cách chỉ gửi management events và aggregated events.

## Insights cho Data Events

### Tổng quan

AWS CloudTrail Insights phân tích CloudTrail events để tự động phát hiện các API activity patterns bất thường trong AWS account. Trước đây chỉ hỗ trợ management events, giờ đã hỗ trợ data events.

### 2 Insights Types

#### 1. API Call Rate Insights

- **Đối tượng**: Chỉ write operations
- **Điều kiện phát hiện**: Số data API calls mỗi phút lệch khỏi baseline call rate
- **Kết quả**: Tạo insights event

#### 2. API Error Rate Insights

- **Đối tượng**: Cả read và write
- **Điều kiện phát hiện**: Số data API calls thất bại và trả về error lệch khỏi baseline error rate
- **Kết quả**: Tạo insights event

### Cấu hình

1. Vào CloudTrail console
2. Menu bên trái chọn **Trails**
3. Chọn trail cho CloudTrail events
4. Chọn **Edit Insights events**
5. Ở **Data events Insights types**, chọn options mong muốn

### Thiết lập Baseline

Khi enable Insights events, CloudTrail phải thiết lập baseline cho normal activity patterns trước.

- **Lần đầu**: Mất tối đa 36 giờ để Insights event đầu tiên được gửi
- **Kích hoạt lại**: Nếu disable → re-enable Insights, hoặc stop → restart trail logging, cũng mất tối đa 36 giờ

### Phân tích

#### Xem trên Console

1. Vào CloudTrail console
2. Menu bên trái chọn **Insights**
3. Chọn tab **Data events** để xem danh sách Insights events
4. Chọn một Insights event từ list để xem chi tiết

Trang chi tiết Insights event hiển thị biểu đồ timeline của abnormal activity.

#### Cài đặt Alerts

Sử dụng CloudWatch Metrics filters hoặc EventBridge rules để tạo alarms và notifications dựa trên các Insights patterns cụ thể.

**Tham khảo**:
- [Leveraging AWS CloudTrail Insights for Proactive API Monitoring and Cost Optimization](https://aws.amazon.com/blogs/mt/leveraging-aws-cloudtrail-insights-for-proactive-api-monitoring-and-cost-optimization/)
- [Analyzing AWS CloudTrail in Amazon CloudWatch](https://aws.amazon.com/blogs/mt/analyzing-cloudtrail-in-cloudwatch/)

## Yêu cầu trước

Để thực hiện walkthrough này, cần:

- **CloudTrail trail hiện có**: Đã enable data events
- **Trail mới**: Có thể enable aggregated events và Insights events ngay khi tạo
- **Chi phí bổ sung**: 2 tính năng mới này phát sinh thêm chi phí CloudTrail

Xem chi tiết tại [AWS CloudTrail Pricing](https://aws.amazon.com/cloudtrail/pricing/).

**Quan trọng**: Để sử dụng event aggregation và Insights cho data events, phải enable data events trong trail.

## Cleanup

Để tránh phát sinh chi phí, xóa cấu hình CloudTrail Insights và aggregated events đã tạo trong walkthrough.

## Lợi ích

### Giảm chi phí

- Giảm storage và processing costs nhờ giảm lượng dữ liệu gửi đến downstream systems
- Tối ưu thêm chi phí với subscription filters

### Tăng cường bảo mật

- Tự động phát hiện API activity patterns bất thường
- Không cần phân tích thủ công
- Phát hiện đột biến trong resource provisioning

### Hiệu quả vận hành

- Giảm lượng log data trong khi vẫn giữ insights quan trọng
- Troubleshooting nhanh hơn
- Tích hợp CloudWatch linh hoạt cho phân tích

### Tăng khả năng quan sát

- Hiểu rõ access frequency
- Hiểu rõ error rates
- Hiểu rõ API usage trends

## Tóm tắt

CloudTrail Event Aggregation và Insights cho Data Events cung cấp 2 tính năng mạnh mẽ đáp ứng nhu cầu đa dạng:

### Event Aggregation

Giải pháp cho khách hàng gửi CloudTrail data đến downstream workflows, giúp giảm lượng dữ liệu và chi phí liên quan trong khi vẫn duy trì visibility cần thiết.

### Insights

Cung cấp context cần thiết để xác định rõ ràng anomalies và patterns, giúp security teams và operations teams phát hiện abnormal activity mà không cần phân tích thủ công.

### Hướng dẫn thực tế

Bài viết đã trình bày cách:

1. **Tối ưu data processing pipeline**: Cấu hình CloudTrail Event Aggregation
2. **Tự động hóa phát hiện bất thường**: Cấu hình CloudTrail Insights cho data events
3. **Tạo alerts**: Sử dụng CloudWatch Metrics filters

Để tìm hiểu chi tiết hơn về cách các tính năng CloudTrail mới này giúp tăng cường security posture và tối ưu chi phí, xem [AWS CloudTrail Documentation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html).

## Dịch vụ liên quan

- AWS CloudTrail
- Amazon S3
- AWS Lambda
- Amazon DynamoDB
- Amazon CloudWatch
- Amazon Athena
- Amazon Kinesis Data Streams
- Amazon Data Firehose
- Amazon OpenSearch Service
- Amazon EventBridge

## Tham khảo

- [AWS CloudTrail Pricing](https://aws.amazon.com/cloudtrail/pricing/)
- [CloudTrail Record Contents for Aggregated Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-aggregated-events.html)
- [AWS CloudTrail Documentation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
- [Leveraging AWS CloudTrail Insights for Proactive API Monitoring and Cost Optimization](https://aws.amazon.com/blogs/mt/leveraging-aws-cloudtrail-insights-for-proactive-api-monitoring-and-cost-optimization/)
- [Analyzing AWS CloudTrail in Amazon CloudWatch](https://aws.amazon.com/blogs/mt/analyzing-cloudtrail-in-cloudwatch/)

---

*Bài viết gốc được dịch bởi Solutions Architect Kato Fumiya. Nguồn: [Announcing AWS CloudTrail Event Aggregation and Insights for Data Events](https://aws.amazon.com/jp/blogs/mt/announcing-aws-cloudtrail-event-aggregation-and-insights-for-data-events/)*
