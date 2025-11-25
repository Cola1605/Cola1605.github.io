---
title: "Amazon Bedrock Service Tiers mới giúp khớp hiệu năng với chi phí cho workload AI"
date: 2025-11-25T00:00:00Z
draft: false
categories: ["AWS"]
tags: ["Amazon Bedrock", "AI", "Machine Learning", "Cost Optimization", "Service Tiers", "Performance"]
author: "Sébastien Stormacq"
source: "AWS Blog"
source_url: "https://aws.amazon.com/jp/blogs/news/new-amazon-bedrock-service-tiers-help-you-match-ai-workload-performance-with-cost/"
---

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [3 Service Tier](#3-service-tier)
- [Chọn tier phù hợp cho workload](#chọn-tier-phù-hợp-cho-workload)
- [Ước tính chi phí và giám sát](#ước-tính-chi-phí-và-giám-sát)
- [Cách sử dụng](#cách-sử-dụng)
- [Tổng kết](#tổng-kết)

---

## Giới thiệu

Ngày 18 tháng 11 năm 2025, **Amazon Bedrock** đã giới thiệu **các service tier mới** giúp kiểm soát chi phí workload AI một cách chi tiết hơn trong khi vẫn duy trì mức hiệu năng cần thiết cho ứng dụng.

Nhiều tổ chức chạy workload AI đối mặt với thách thức **cân bằng giữa yêu cầu hiệu năng và tối ưu hóa chi phí**. Một số ứng dụng cần thời gian phản hồi nhanh cho tương tác thời gian thực, trong khi những ứng dụng khác có thể xử lý dữ liệu theo từng giai đoạn.

Với những thách thức này, các tùy chọn giá mới được công bố hôm nay sẽ tăng tính linh hoạt trong việc khớp yêu cầu workload với tối ưu hóa chi phí.

---

## 3 Service Tier

Amazon Bedrock hiện cung cấp **3 service tier cho workload: Priority, Standard và Flex**. Mỗi tier được thiết kế để phù hợp với các yêu cầu workload cụ thể.

### Priority Tier

**Priority Tier** xử lý request ưu tiên hơn các tier khác, do đó tài nguyên computing được phân bổ ưu tiên cho **các ứng dụng mission-critical** như:

- Chat assistant hỗ trợ khách hàng
- Dịch vụ dịch thuật thời gian thực
- Trợ lý AI tương tác

Tuy nhiên, giá của tier này cao hơn các tier khác. Với các model hỗ trợ Priority tier, khách hàng có thể đạt được **latency OTPS (Output Tokens Per Second) tốt hơn tới 25% so với Standard tier** trong hầu hết các trường hợp.

### Standard Tier

**Standard Tier** cung cấp hiệu năng ổn định cho **các tác vụ AI hàng ngày** với giá tiêu chuẩn, phù hợp cho các use case như:

- Tạo nội dung
- Phân tích văn bản
- Xử lý tài liệu định dạng chuẩn

### Flex Tier

Đối với các workload có thể chấp nhận latency dài hơn, **Flex Tier với giá thấp** cung cấp tùy chọn hiệu quả về chi phí. Tier này lý tưởng cho:

- Đánh giá model
- Tóm tắt nội dung
- Workflow phân tích nhiều bước
- Workload agentic

---

## Chọn tier phù hợp cho workload

Dưới đây là mental model giúp bạn chọn tier phù hợp cho workload.

### Các pattern sử dụng được đề xuất

| Danh mục | Service Tier được đề xuất | Mô tả |
|----------|---------------------------|-------|
| **Mission-critical** | Priority | Request được xử lý ưu tiên hơn các tier khác. Phản hồi low-latency cho ứng dụng hướng người dùng (chat assistant dịch vụ khách hàng, dịch thuật thời gian thực, trợ lý AI tương tác, v.v.) |
| **Business (chuẩn)** | Standard | Hiệu năng responsive cho workload quan trọng (tạo nội dung, phân tích văn bản, xử lý tài liệu định dạng, v.v.) |
| **Business (không quan trọng)** | Flex | Hiệu quả chi phí xuất sắc cho workload ít khẩn cấp (đánh giá model, tóm tắt nội dung, workflow agentic nhiều bước, v.v.) |

### Best practice triển khai

Bắt đầu bằng cách **xem xét pattern sử dụng hiện tại** cùng với chủ sở hữu ứng dụng. Tiếp theo, xác định workload cần phản hồi tức thì và workload có thể xử lý dữ liệu theo từng giai đoạn.

Sau đó, **bắt đầu routing một phần nhỏ traffic** sử dụng các tier khác nhau để test lợi ích về hiệu năng và chi phí.

### Ví dụ thực tế

Từ nay, bạn có thể tối ưu hóa chi phí bằng cách khớp mỗi workload với tier phù hợp nhất.

- Nếu bạn đang chạy **chat assistant dịch vụ khách hàng cần phản hồi nhanh**, hãy sử dụng **Priority tier** để đạt được thời gian xử lý nhanh nhất.
- Đối với **tác vụ tóm tắt nội dung có thể chấp nhận thời gian xử lý dài hơn**, bạn có thể sử dụng **Flex tier** để giảm chi phí trong khi vẫn duy trì hiệu năng đáng tin cậy.

---

## Ước tính chi phí và giám sát

### Ước tính chi phí

[AWS Pricing Calculator](https://calculator.aws/#/createCalculator/bedrock) giúp ước tính chi phí của các service tier khác nhau bằng cách nhập workload dự kiến cho mỗi tier. Bạn có thể ước tính ngân sách dựa trên pattern sử dụng cụ thể.

### Giám sát

Để giám sát mức sử dụng và chi phí, có các phương pháp sau:

1. **Sử dụng AWS Service Quotas console**
   - Truy cập [Service Quotas console](https://us-east-1.console.aws.amazon.com/servicequotas/home/services/bedrock/quotas)

2. **Bật logging model invocation trong Amazon Bedrock**
   - [Thiết lập logging model invocation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)
   - Sử dụng **Amazon CloudWatch** để quan sát metrics

Các công cụ này **hiển thị mức sử dụng token** và **theo dõi hiệu năng** trên các tier khác nhau.

![Observability của invocation trong Amazon Bedrock](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/17/2025-10-17_13-49-02.png)
*Giám sát Amazon Bedrock bằng CloudWatch*

---

## Cách sử dụng

Các service tier mới **có thể bắt đầu sử dụng ngay**. Bạn chọn tier cho mỗi API call.

### Ví dụ code

Dưới đây là ví dụ sử dụng `ChatCompletions` OpenAI API, nhưng bạn có thể truyền cùng parameter `service_tier` trong body của các API `InvokeModel`, `InvokeModelWithResponseStream`, `Converse`, và `ConverseStream` (đối với các model được hỗ trợ).

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://bedrock-runtime.us-west-2.amazonaws.com/openai/v1",
    api_key="$AWS_BEARER_TOKEN_BEDROCK" # Replace with actual API key
)

completion = client.chat.completions.create(
    model= "openai.gpt-oss-20b-1:0",
    messages=[
        {
            "role": "developer",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Hello!"
        }
    ]
    service_tier= "priority"  # options: "priority | default | flex"
)

print(completion.choices[0].message)
```

### Model được hỗ trợ

Vui lòng xem [danh sách model mới nhất được hỗ trợ cho mỗi service tier](https://docs.aws.amazon.com/bedrock/latest/userguide/service-tiers-inference.html) trong tài liệu Amazon Bedrock.

---

## Tổng kết

Các service tier mới của Amazon Bedrock cho phép tối ưu hóa hiệu năng và chi phí workload AI một cách linh hoạt.

### Các đặc điểm chính

- **Priority Tier**: Latency OTPS tốt hơn tới 25%, cho ứng dụng mission-critical
- **Standard Tier**: Hiệu năng ổn định, cho các tác vụ AI hàng ngày
- **Flex Tier**: Hiệu quả chi phí xuất sắc, cho workload ít khẩn cấp

### Bắt đầu sử dụng

Để biết thêm chi tiết, vui lòng xem:

- [Amazon Bedrock User Guide](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- Liên hệ với AWS Account Team

Bằng cách chọn tier tối ưu cho mỗi workload, bạn có thể tối ưu hóa chi phí trong khi vẫn duy trì hiệu năng.

---

**Danh mục**: AWS, Amazon Bedrock, AI  
**Tags**: #AmazonBedrock #AI #MachineLearning #CostOptimization #ServiceTiers #Performance
