---
title: "Giới thiệu Amazon Nova 2 Lite: Mô hình suy luận nhanh và tiết kiệm chi phí"
date: 2025-12-12
draft: false
slug: "aws-amazon-nova-2-lite-reasoning-model"
description: "Amazon Nova 2 Lite mang lại hiệu suất giá cả hàng đầu với Extended Thinking, 1 triệu token context window, multimodal input và built-in tools cho ứng dụng AI hàng ngày."
tags: ["AWS", "Amazon Nova", "Amazon Bedrock", "AI", "Machine Learning", "Reasoning Model", "Extended Thinking", "Agentic AI", "Multimodal", "Cost Optimization", "Python", "Boto3"]
categories: ["AI and Machine Learning", "Cloud", "Development"]
author: "Danilo Poccia"
---

# Giới thiệu Amazon Nova 2 Lite: Mô hình suy luận nhanh và tiết kiệm chi phí

**Tác giả:** Danilo Poccia ([@danilop](https://twitter.com/danilop))  
**Ngày xuất bản:** 12 tháng 12 năm 2025  
**Ngày công bố:** 2 tháng 12 năm 2025  
**Danh mục:** Amazon Bedrock, Amazon Machine Learning, Amazon Nova, Announcements, Artificial Intelligence, AWS re:Invent  
**URL:** https://aws.amazon.com/jp/blogs/news/introducing-amazon-nova-2-lite-a-fast-cost-effective-reasoning-model/

## Tổng quan

Ngày 2 tháng 12 năm 2025, chúng tôi đã phát hành Amazon Nova 2 Lite. Đây là một mô hình suy luận nhanh và tiết kiệm chi phí dành cho các khối lượng công việc hàng ngày. Mô hình này có sẵn trên Amazon Bedrock, cung cấp **hiệu suất giá cả hàng đầu trong ngành**, giúp các doanh nghiệp và nhà phát triển xây dựng các ứng dụng AI đại lý (agentic AI) hiệu suất cao, đáng tin cậy và hiệu quả.

Đối với các tổ chức cần AI thực sự hiểu lĩnh vực của họ, Nova 2 Lite là mô hình lý tưởng để sử dụng kết hợp với Nova Forge nhằm xây dựng trí tuệ tiên phong độc đáo của riêng mình.

## Các tính năng chính

### 1. Extended Thinking (Tư duy mở rộng)

Nova 2 Lite hỗ trợ tư duy mở rộng, bao gồm suy luận từng bước và phân tách nhiệm vụ trước khi phản hồi hoặc thực hiện hành động.

**Cấu hình:**
- **Cài đặt ban đầu:** Tắt
- **Kích hoạt:** Bật khi cần phân tích chi tiết hơn
- **Mức ngân sách tư duy:** Chọn từ 3 mức "Thấp", "Trung bình", "Cao"
- **Kiểm soát:** Điều chỉnh sự đánh đổi giữa tốc độ, trí tuệ và chi phí

### 2. Đầu vào đa phương thức và bối cảnh quy mô lớn

**Đầu vào được hỗ trợ:**
- Văn bản
- Hình ảnh
- Video
- Tài liệu

**Cửa sổ bối cảnh:** 1 triệu token

Điều này mở rộng phạm vi suy luận và cho phép học tập theo bối cảnh phong phú hơn.

### 3. Công cụ tích hợp sẵn

**Web Grounding (Nền tảng web):**
- Lấy thông tin công khai kèm theo trích dẫn
- Câu trả lời dựa trên thông tin mới nhất

**Code Interpreter (Trình thông dịch mã):**
- Mô hình thực thi mã trong cùng một quy trình làm việc
- Đánh giá mã và trả về kết quả

### 4. Có thể tùy chỉnh

Nova 2 Lite có thể được tùy chỉnh để phù hợp với các nhu cầu kinh doanh cụ thể:
- Tùy chỉnh trên Amazon Bedrock
- Tùy chỉnh trên Amazon SageMaker AI

## Hiệu suất

Amazon Nova 2 Lite cho thấy hiệu suất xuất sắc trên nhiều bài kiểm tra đánh giá khác nhau.

**Trí tuệ cốt lõi:**
- Tuân thủ hướng dẫn với suy luận thời gian
- Toán học
- Hiểu video

**Quy trình làm việc dạng đại lý:**
- Tự động hóa nhiệm vụ
- Gọi chức năng tương tác UI chính xác

**Kỹ thuật phần mềm:**
- Khả năng tạo mã mạnh mẽ
- Khả năng giải quyết vấn đề thực tiễn

## Các trường hợp sử dụng

### Ứng dụng kinh doanh
- Tự động hóa quy trình làm việc kinh doanh
- Xử lý tài liệu thông minh (IDP)
- Hỗ trợ khách hàng
- Tìm kiếm web

### Kỹ thuật phần mềm
- Tạo mã
- Gỡ lỗi
- Tái cấu trúc
- Di chuyển hệ thống

### Trí tuệ kinh doanh và nghiên cứu
- Tận dụng suy luận dài hạn và nền tảng web
- Phân tích nguồn thông tin nội bộ và bên ngoài
- Rút ra thông tin chi tiết
- Ra quyết định dựa trên thông tin

**Ví dụ khách hàng ban đầu:**
- Chatbot dịch vụ khách hàng
- Xử lý tài liệu
- Tự động hóa quy trình kinh doanh

## Cách sử dụng

### Bảng điều khiển Amazon Bedrock

Bạn có thể nhanh chóng kiểm tra mô hình mới bằng các lời nhắc trong sân chơi chat/văn bản.

### Tích hợp API

Bạn có thể sử dụng bất kỳ AWS SDK nào với API InvokeModel và Converse của Amazon Bedrock.

**Ví dụ Python (Boto3):**

```python
import boto3

AWS_REGION="us-east-1"
MODEL_ID="global.amazon.nova-2-lite-v1:0"
MAX_REASONING_EFFORT="low"  # low, medium, high

bedrock_runtime = boto3.client("bedrock-runtime", region_name=AWS_REGION)

# Kích hoạt tư duy mở rộng
response = bedrock_runtime.converse(
    modelId=MODEL_ID,
    messages=[{
        "role": "user",
        "content": [{"text": "Tôi cần tối ưu hóa một mạng lưới logistics bao gồm 5 kho hàng, 12 trung tâm phân phối và 200 cửa hàng bán lẻ. Mục tiêu là giảm thiểu tổng chi phí vận chuyển trong khi đảm bảo không có địa điểm nào cách trung tâm phân phối hơn 50 dặm. Tôi nên tiếp cận như thế nào?"}]
    }],
    additionalModelRequestFields={
        "reasoningConfig": {
            "type": "enabled",  # enabled, disabled (default)
            "maxReasoningEffort": MAX_REASONING_EFFORT
        }
    }
)

# Phản hồi bao gồm khối suy luận, tiếp theo là câu trả lời cuối cùng
for block in response["output"]["message"]["content"]:
    if "reasoningContent" in block:
        reasoning_text = block["reasoningContent"]["reasoningText"]["text"]
        print(f"Quá trình suy nghĩ của Nova:\n{reasoning_text}\n")
    elif "text" in block:
        print(f"Khuyến nghị cuối cùng:\n{block['text']}")
```

### Framework đại lý

Các mô hình này có thể được sử dụng trong bất kỳ framework đại lý nào hỗ trợ Amazon Bedrock. Bạn có thể triển khai các đại lý bằng cách sử dụng Amazon Bedrock AgentCore.

**Ví dụ Strands Agents SDK:**

```python
from strands import Agent
from strands.models import BedrockModel
from strands_tools import calculator, editor, file_read, file_write, shell, http_request, graph, swarm, use_agent, think

AWS_REGION="us-east-1"
MODEL_ID="global.amazon.nova-2-lite-v1:0"
MAX_REASONING_EFFORT="low"

SYSTEM_PROMPT = (
    "You are a helpful assistant. "
    "Hãy làm theo hướng dẫn từ người dùng. "
    "Bạn có thể tạo các đại lý chuyên dụng động và điều phối các quy trình làm việc phức tạp để hỗ trợ nhiệm vụ."
)

bedrock_model = BedrockModel(
    region_name=AWS_REGION,
    model_id=MODEL_ID,
    additional_request_fields={
        "reasoningConfig": {
            "type": "enabled",
            "maxReasoningEffort": MAX_REASONING_EFFORT
        }
    }
)

agent = Agent(
    model=bedrock_model,
    system_prompt=SYSTEM_PROMPT,
    tools=[calculator, editor, file_read, file_write, shell, http_request, graph, swarm, use_agent, think]
)

while True:
    try:
        prompt = input("\nNhập câu hỏi của bạn (hoặc 'quit' để thoát): ").strip()
        if prompt.lower() in ['quit', 'exit', 'q']:
            break
        if len(prompt) > 0:
            agent(prompt)
    except KeyboardInterrupt:
        break
    except EOFError:
        break

print("\nTạm biệt!")
```

## Những điều cần biết

**Tình trạng cung cấp:**
- Có sẵn trên Amazon Bedrock với suy luận xuyên vùng toàn cầu tại nhiều địa điểm
- Tham khảo AWS Capabilities by Region để biết tình trạng cung cấp theo vùng

**AI có trách nhiệm:**
- Tích hợp sẵn các điều khiển an toàn để thúc đẩy việc sử dụng AI có trách nhiệm
- Kiểm duyệt nội dung để duy trì đầu ra phù hợp trên nhiều ứng dụng

**Chi phí:**
Tham khảo bảng giá Amazon Bedrock

**Tài liệu:**
Xem chi tiết trong Hướng dẫn sử dụng Amazon Nova

## Bắt đầu xây dựng ngay bây giờ

**Cách dùng thử:**
1. Truy cập trang web tương tác Amazon Nova (https://nova.amazon.com/)
2. Thử mô hình trong bảng điều khiển Amazon Bedrock
3. Chia sẻ phản hồi trên AWS re:Post

Nova 2 Lite cung cấp sự kết hợp tối ưu về giá cả, hiệu suất và tốc độ, phục vụ một loạt các nhiệm vụ AI hàng ngày. Khi sử dụng kết hợp với Nova Forge, bạn có thể xây dựng trí tuệ tiên phong độc đáo thực sự hiểu lĩnh vực của công ty mình.

---

**Bài viết gốc:** [Introducing Amazon Nova 2 Lite: A Fast, Cost-Effective Reasoning Model](https://aws.amazon.com/jp/blogs/aws/introducing-amazon-nova-2-lite-a-fast-cost-effective-reasoning-model/)
