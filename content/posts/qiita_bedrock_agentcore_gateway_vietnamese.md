---
title: "Hiểu Amazon Bedrock AgentCore Gateway qua thực hành"
date: 2025-10-26
draft: false
categories: ["AWS", "AI", "Serverless"]
tags: ["Amazon-Bedrock", "AgentCore", "MCP", "Lambda", "AI-Agents", "OAuth", "API-Gateway"]
description: "Hướng dẫn thực hành Amazon Bedrock AgentCore Gateway - chuyển đổi Lambda functions và external APIs thành MCP-compatible tools cho AI agents."
---

**Tác giả:** @yakumo_09  
**Ngày đăng:** 26/10/2025  
**Cập nhật:** 26/10/2025  
**Nguồn:** https://qiita.com/yakumo_09/items/d7b8aedc166ac19231eb

**Likes:** 10 | **Stocks:** 3

---

## 📋 Tóm tắt

Bài viết hướng dẫn thực hành về **Amazon Bedrock AgentCore Gateway** - tính năng chuyển đổi **các hàm Lambda** và **API bên ngoài** thành **công cụ tương thích MCP** cho AI agents.

**Điểm nổi bật:**
- ✅ **Gateway là gì:** Chuyển đổi API/Lambda/dịch vụ hiện có thành công cụ tương thích MCP
- ✅ **3 lợi ích chính:** Đơn giản hóa tích hợp công cụ, Khám phá công cụ động, Xác thực toàn diện
- ✅ **Thực hành:** Tạo Gateway với Cognito OAuth, triển khai các công cụ Lambda (thời tiết/thời gian)
- ✅ **2 mẫu sử dụng:** Strands → Gateway, Runtime → Gateway
- ✅ **Khả năng quan sát:** Log CloudWatch cho việc khám phá công cụ và theo dõi thực thi
- ✅ **Luồng xác thực:** Agent→Gateway (OAuth) → Identity (xác minh) → Lambda (IAM)

---

## 🎬 Giới thiệu

### 📖 Bối cảnh và động lực

Sau khi thử nghiệm chức năng Runtime của AgentCore, tác giả muốn thử tiếp chức năng Gateway, nên đã quyết định tiến hành thực hiện.

### 📚 Cách tiếp cận bài viết

Lần này, hướng dẫn từ tài liệu chính thức khá dễ hiểu nên tác giả đã thực hiện theo đó. Ngoài ra, tác giả cũng sẽ giải thích cơ chế của Gateway theo cách hiểu của mình.

### 🎯 Điều chỉnh phạm vi

Ban đầu tác giả định tích hợp Runtime với Gateway, nhưng đã quyết định thực hiện theo cách đơn giản hơn là sử dụng từ Strands trước. (Tuy nhiên cuối cùng bài viết vẫn bao gồm cả phần tích hợp Runtime!)

### 🔗 Tài liệu chính thức tham khảo

Tài liệu Amazon Bedrock AgentCore Gateway: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html

---

## 🤔 Gateway là gì?

### 📖 Định nghĩa chính thức

Theo tài liệu chính thức, Gateway chuyển đổi các API, hàm Lambda và dịch vụ hiện có thành công cụ tương thích Model Context Protocol (MCP), giúp agent có thể dễ dàng sử dụng chúng.

**Gateway chuyển đổi:**
- 🔧 API
- 🔧 Hàm Lambda
- 🔧 Dịch vụ hiện có

**Thành:**
- ✅ Công cụ tương thích Model Context Protocol (MCP)

**Kết quả:**
- 🎯 Agent có thể dễ dàng sử dụng

### 🔗 Tích hợp công cụ phổ biến

Ngoài ra, về loại đầu vào, có thể tích hợp với các công cụ nổi tiếng như Salesforce, Slack, Jira.

**Tích hợp khả dụng với:**
- 📊 Salesforce
- 💬 Slack
- 🎫 Jira
- 🎯 Và các công cụ phổ biến khác

### 😢 Ghi chú cá nhân của tác giả

(Với tư cách là người dùng Teams, tác giả không kìm được nước mắt vì Teams không có trong danh sách)

---

## 💪 Lợi ích khi sử dụng Gateway

### 🎯 Lợi ích 1: Đơn giản hóa tích hợp công cụ

Đây có vẻ là lợi ích lớn nhất, có thể chuyển đổi các tài nguyên hiện có thành công cụ tương thích với agent, dễ dàng tùy chỉnh agent.

**Lợi ích lớn nhất:**
- ✅ Chuyển đổi tài nguyên hiện có thành công cụ tương thích agent
- ✅ Dễ dàng tùy chỉnh agent

Không chỉ tích hợp một cú nhấp chuột với nhiều công cụ phổ biến khác nhau, mà còn tăng cường khả năng liên kết với các thành phần tiện ích như Lambda, API Gateway và MCP server được thêm vào làm mục tiêu.

**Ngoài ra:**
- ✅ Tích hợp một cú nhấp chuột với nhiều công cụ phổ biến
- ✅ Tăng cường liên kết với các thành phần hữu ích:
  - Lambda (mục tiêu)
  - API Gateway
  - MCP server (mới được thêm vào)

---

## 🔍 Lợi ích 2: Khám phá công cụ động

### 🚨 Vấn đề khi mở rộng quy mô

Khi thêm hàng trăm hoặc hàng nghìn công cụ, agent có thể bối rối "Ủa, mình nên dùng công cụ nào đây?", dẫn đến tăng chi phí, tăng độ trễ và giảm độ chính xác khi chọn công cụ.

**Khi thêm hàng trăm hoặc hàng nghìn công cụ:**

**Agent bối rối:**
- 🤔 "Ủa, mình nên dùng công cụ nào đây?"

**Hậu quả:**
1. ❌ Tăng chi phí
2. ❌ Tăng độ trễ
3. ❌ Giảm độ chính xác khi chọn công cụ

### ✅ Giải pháp: Tìm kiếm ngữ nghĩa

Khi đó, cần có cách tiếp cận để quản lý và chọn công cụ hiệu quả, và chức năng tìm kiếm ngữ nghĩa của AgentCore Gateway sẽ giải quyết vấn đề này.

**Nhu cầu phát sinh:**
- 🎯 Cần cách tiếp cận quản lý/chọn công cụ hiệu quả

**AgentCore Gateway cung cấp:**
- ✨ Chức năng tìm kiếm ngữ nghĩa giải quyết vấn đề này

### 🚀 Cải thiện hiệu suất

Chức năng này cho phép agent khám phá và chọn một cách thông minh chỉ những công cụ có liên quan nhất đến ngữ cảnh hoặc câu hỏi cụ thể, giúp giảm chi phí vận hành và thời gian phản hồi đồng thời cải thiện đáng kể hiệu suất của agent.

**Chức năng này cho phép:**

**Khám phá/chọn lựa thông minh:**
- 🎯 Agent khám phá và chọn một cách thông minh
- 🎯 Chỉ những công cụ có liên quan nhất với ngữ cảnh/câu hỏi cụ thể

**Kết quả:**
- ✅ Giảm chi phí vận hành
- ✅ Giảm thời gian phản hồi
- ✅ Cải thiện đáng kể hiệu suất agent

### 📊 Ví dụ trực quan từ Workshop

Dưới đây là hình ảnh lấy từ workshop chính thức, có thể thấy việc tìm kiếm công cụ từ Gateway và lấy công cụ một cách hợp lý.

**Hình ảnh từ workshop chính thức:**
- 🖼️ Hiển thị tìm kiếm công cụ từ Gateway
- ✅ Lấy công cụ một cách hợp lý

**Luồng công việc được hiển thị:**
```
Truy vấn Agent → Tìm kiếm ngữ nghĩa Gateway → Lấy các công cụ liên quan
```

### 🧪 Tự mình thử nghiệm

Những người quan tâm có thể trải nghiệm qua workshop chính thức "Diving Deep into Bedrock AgentCore", hãy thử nhé!

**Dành cho những người quan tâm:**
- 📚 Workshop chính thức: "Diving Deep into Bedrock AgentCore"
- 🔗 https://catalog.us-east-1.prod.workshops.aws/workshops/015a2de4-9522-4532-b2eb-639280dc31d8/ja-JP/30-agentcore-gateway/34-gateway-search-tools
- ✅ Có thể trải nghiệm

### 📖 Tài liệu chính thức

Tìm kiếm công cụ bằng truy vấn ngôn ngữ tự nhiên: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-semantic-search.html

---

## 🔐 Lợi ích 3: Xác thực toàn diện

### 🎯 Quản lý xác thực kép

Gateway có thể quản lý cả xác thực Inbound (xác minh danh tính agent) và xác thực Outbound (kết nối với công cụ bên ngoài) bằng dịch vụ quản lý Identity.

**Gateway quản lý cả hai:**

#### **Xác thực Inbound**
- 🔒 Xác minh danh tính agent

#### **Xác thực Outbound**
- 🔒 Kết nối với công cụ bên ngoài

**Được quản lý bởi:**
- ✅ Dịch vụ quản lý: Identity

### 📊 Luồng xác thực tích hợp Lambda

Về tích hợp với hàm Lambda sẽ triển khai lần này, workshop chính thức cũng có sơ đồ nên hãy kiểm tra.

**Đối với tích hợp hàm Lambda:**
- 📊 Có sơ đồ trong workshop chính thức

### 🔄 Phân tích luồng xác thực

Luồng đại khái như sau:

#### **Bước 1: Agent → Gateway**
- 🔐 Xác thực bằng OAuth token

#### **Bước 2: Gateway → Identity**
- ✅ Xác minh token

#### **Bước 3: Gateway → Lambda**
- 🔑 Quyền thực thi bằng IAM role

### 🔗 Tham khảo Workshop

Workshop: Chuyển đổi Lambda sang MCP - https://catalog.us-east-1.prod.workshops.aws/workshops/015a2de4-9522-4532-b2eb-639280dc31d8/ja-JP/30-agentcore-gateway/31-transforming-lambda-to-mcp

### 📝 Ghi chú về phạm vi

Phần xác thực này cũng muốn viết kỹ lưỡng, nhưng lần này thật sự nên tách ra bài viết riêng...

**Chi tiết xác thực:**
- 📖 Muốn viết kỹ lưỡng
- ✅ NHƯNG sẽ tách thành bài viết riêng

Lần này chỉ cần hiểu đại khái là "Có xen vào xử lý xác thực như thế này" và nắm được luồng chung là được.

**Hiện tại:**
- 🎯 Hiểu đại khái: "Có xen vào xử lý xác thực như thế này"
- 🎯 Nắm được luồng chung

---

## 🚀 Thực hành

### 📋 Bắt đầu

Từ bây giờ sẽ thực hành theo hướng dẫn từ tài liệu.

**Bây giờ hãy thực hành:**
- 📚 Theo hướng dẫn từ tài liệu

### 🛠️ Điều kiện tiên quyết

Tài liệu chính thức có phần thiết lập môi trường trước và cài đặt phụ thuộc.

**Tài liệu chính thức bao gồm:**
- ⚙️ Thiết lập môi trường trước
- 📦 Cài đặt phụ thuộc

Việc xây dựng môi trường ảo Python và cài đặt thư viện Bedrock AgentCore có thể thực hiện theo hướng dẫn từ các bài viết dưới đây.

**Có thể làm theo các bài viết này:**
- 🐍 Xây dựng môi trường ảo Python
- 📚 Cài đặt thư viện Bedrock AgentCore

### 📖 Bài viết tham khảo

**Bài viết 1:** Bắt đầu với StrandsAgents - https://qiita.com/yakumo_09/items/f85a8a0634e30b0d756c
- 🎯 Giới thiệu Strands Agents

**Bài viết 2:** Triển khai agent lên Runtime - https://qiita.com/yakumo_09/items/eaa3b6062396227615a2
- 🎯 Hướng dẫn triển khai Runtime

---

## 🏗️ Tạo Gateway

### 📄 Script thiết lập

Trước tiên tạo mới file `setup_gateway.py` và thực thi.

**Các bước:**
1. ✅ Tạo file mới: `setup_gateway.py`
2. ✅ Thực thi file đó

### 💻 Môi trường của tác giả

Lần này tác giả xây dựng môi trường ảo bằng uv nên đã thực thi như sau:

**Tác giả sử dụng `uv` cho môi trường ảo:**

```bash
uv run setup_gateway.py
```

---

## 🔍 Xác nhận những gì đang làm

### 🔐 Bước 2.1: Tạo máy chủ xác thực OAuth

#### 📖 Mục đích

Như đã trình bày ở trên, Gateway được bảo vệ bởi máy chủ ủy quyền OAuth, đảm bảo chỉ những người dùng được ủy quyền mới có thể truy cập Gateway.

**Như đã trình bày:**
- 🔒 Gateway được bảo vệ bởi máy chủ ủy quyền OAuth
- ✅ Chỉ người dùng được ủy quyền mới có thể truy cập Gateway

Đang tạo thông tin xác thực cho việc đó sử dụng Amazon Cognito.

**Tạo thông tin xác thực bằng:**
- 🔐 Amazon Cognito

#### 💻 Đoạn code

```python
# Bước 2.1: Tạo bộ ủy quyền OAuth
print("Bước 2.1: Đang tạo máy chủ ủy quyền OAuth...")
cognito_response = client.create_oauth_authorizer_with_cognito("TestGateway")
print("✓ Đã tạo máy chủ ủy quyền\n")
```

#### 🎯 Những gì được tạo

Tạo user pool Amazon Cognito được cấu hình với luồng thông tin xác thực máy khách OAuth 2.0.

**Được tạo:**
- 👥 User pool Amazon Cognito
- ⚙️ Được cấu hình với luồng thông tin xác thực máy khách OAuth 2.0

Cung cấp ID máy khách và secret có thể sử dụng để lấy access token.

**Cung cấp:**
- 🔑 ID máy khách
- 🔑 Secret
- 🎯 Có thể sử dụng để lấy access token

#### 🖼️ Xác nhận Cognito User Pool

Khi kiểm tra Cognito user pool, đã tạo thông tin xác thực như sau.

**Khi kiểm tra Cognito user pool:**
- ✅ Đã tạo thông tin xác thực như hiển thị

Thông tin này được sử dụng để xác thực khi agent truy cập Gateway.

**Thông tin này được sử dụng:**
- 🔐 Để xác thực khi agent truy cập Gateway

---

## 🌉 Bước 2.2: Tạo Gateway

### 📋 Mục đích

Ở đây thực sự đang tạo Gateway.

**Ở đây:**
- ✅ Thực sự đang tạo Gateway

Ngoài ra cũng bật tìm kiếm ngữ nghĩa.

**Ngoài ra:**
- ✅ Bật tìm kiếm ngữ nghĩa

### 💻 Đoạn code

```python
# Bước 2.2: Tạo Gateway
print("Bước 2.2: Đang tạo Gateway...")
gateway = client.create_mcp_gateway(
    # tên của Gateway - nếu không đặt thì sẽ được tạo tự động.
    name=None,
    # role arn mà Gateway sẽ sử dụng - nếu không đặt thì sẽ được tạo tự động.
    # LƯU Ý: nếu sử dụng role của riêng bạn, hãy đảm bảo nó có chính sách tin cậy bedrock-agentcore.amazonaws.com
    role_arn=None,
    # chi tiết máy chủ ủy quyền OAuth. Nếu cung cấp máy chủ ủy quyền riêng,
    # hãy truyền đầu vào dạng: {"customJWTAuthorizer": {"allowedClients": ["<INSERT CLIENT ID>"], "discoveryUrl": "<INSERT DISCOVERY URL>"}}
    authorizer_config=cognito_response["authorizer_config"],
    # bật tìm kiếm ngữ nghĩa
    enable_semantic_search=True,
)
print(f"✓ Đã tạo Gateway: {gateway['gatewayUrl']}\n")

# Nếu không cung cấp role_arn, sửa quyền IAM
# LƯU Ý: Việc này được xử lý nội bộ bởi toolkit khi không cung cấp role
client.fix_iam_permissions(gateway)
print("⏳ Đang chờ 30 giây để IAM được phổ biến...")
time.sleep(30)
print("✓ Đã cấu hình quyền IAM\n")
```

### 🎯 Giải thích tham số

#### **name (Tùy chọn)**
- 📝 Tên Gateway
- ✅ Nếu không đặt: Tự động tạo

#### **role_arn (Tùy chọn)**
- 🔑 IAM role mà Gateway sẽ sử dụng
- ✅ Nếu không đặt: Tự động tạo
- ⚠️ LƯU Ý: Nếu sử dụng role riêng, đảm bảo chính sách tin cậy tin tưởng `bedrock-agentcore.amazonaws.com`

#### **authorizer_config**
- 🔐 Chi tiết máy chủ ủy quyền OAuth
- 📊 Từ thiết lập Cognito trước đó

**Tùy chọn JWT tùy chỉnh:**
```json
{
  "customJWTAuthorizer": {
    "allowedClients": ["<INSERT CLIENT ID>"],
    "discoveryUrl": "<INSERT DISCOVERY URL>"
  }
}
```

#### **enable_semantic_search**
- ✅ Đặt thành `True` để bật tìm kiếm ngữ nghĩa

### ⏰ Quyền IAM

**Xử lý tự động:**
- ✅ Toolkit sửa quyền IAM khi không cung cấp role
- ⏳ Chờ 30 giây để IAM được phổ biến

### 🖼️ Xác nhận Gateway

Khi kiểm tra cái này, có thể thấy đã tạo Gateway.

**Khi kiểm tra:**
- ✅ Có thể thấy đã tạo Gateway

---

## 🎯 Bước 2.3-2.4: Tạo và thêm hàm mục tiêu

### 📋 Mục đích

Đang tạo và thêm mục tiêu hàm Lambda.

**Đang tạo và thêm:**
- 🎯 Mục tiêu hàm Lambda

Tự động tạo hàm Lambda bao gồm công cụ thời tiết và thời gian.

**Tự động tạo:**
- ☀️ Công cụ thời tiết
- ⏰ Công cụ thời gian

### 💻 Cấu hình được lưu

```python
# Bước 2.4: Lưu cấu hình cho agent
config = {
    "gateway_url": gateway["gatewayUrl"],
    "gateway_id": gateway["gatewayId"],
    "region": region,
    "client_info": cognito_response["client_info"]
}

with open("gateway_config.json", "w") as f:
    json.dump(config, f, indent=2)

print("=" * 60)
print("✅ Hoàn tất thiết lập Gateway!")
print(f"URL Gateway: {gateway['gatewayUrl']}")
print(f"ID Gateway: {gateway['gatewayId']}")
print("\nĐã lưu cấu hình vào: gateway_config.json")
print("\nBước tiếp theo: Chạy 'python run_agent.py' để kiểm tra Gateway của bạn")
print("=" * 60)

return config
```

### 📄 Đầu ra

**Được lưu vào:** `gateway_config.json`
- 🔗 `gateway_url`
- 🆔 `gateway_id`
- 🌍 `region`
- 🔐 `client_info`

---

## 🔧 Hàm mục tiêu Lambda

### 📋 Tổng quan về hàm

Hàm mục tiêu được tạo như sau.

**Hàm mục tiêu được tạo:**

Là hàm giả lập trả về giá trị cố định cho thời tiết và thời gian tương ứng, được đăng ký làm công cụ.

**Đặc điểm:**
- 🧪 Hàm giả lập
- 📊 Trả về giá trị cố định cho thời tiết và thời gian
- 🔧 Được đăng ký làm công cụ

### 💻 Code Lambda

```python
# lambda_function.py
import json

def lambda_handler(event, context):
    # Trích xuất tên công cụ từ ngữ cảnh
    tool_name = context.client_context.custom.get('bedrockAgentCoreToolName', 'unknown')
    
    if 'get_weather' in tool_name:
        return {
            'statusCode': 200,
            'body': json.dumps({
                'location': event.get('location', 'Unknown'),
                'temperature': '72°F',
                'conditions': 'Sunny'
            })
        }
    elif 'get_time' in tool_name:
        return {
            'statusCode': 200,
            'body': json.dumps({
                'timezone': event.get('timezone', 'UTC'),
                'time': '2:30 PM'
            })
        }
    else:
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Unknown tool'})
        }
```

### 🔧 Các công cụ được tạo

#### **Công cụ 1: get_weather**
**Đầu vào:**
- 📍 `location` (chuỗi)

**Đầu ra:**
- 📍 `location`: Phản hồi đầu vào
- 🌡️ `temperature`: "72°F" (cố định)
- ☀️ `conditions`: "Sunny" (cố định)

#### **Công cụ 2: get_time**
**Đầu vào:**
- 🌍 `timezone` (chuỗi)

**Đầu ra:**
- 🌍 `timezone`: Phản hồi đầu vào
- ⏰ `time`: "2:30 PM" (cố định)

---

## 🤖 Kết nối với Gateway và thực thi

### 📋 Bước tiếp theo

Tiếp theo, thực sự tạo agent, kết nối với Gateway và sử dụng.

**Tiếp theo:**
- ✅ Tạo agent thực sự
- ✅ Kết nối với Gateway
- ✅ Sử dụng

### 💻 Code Agent

**File:** `run_agent.py`

Toàn bộ code được hiển thị trong phần có thể mở rộng.

---

## 💬 LLM diễn giải và trả về kết quả

### 📋 Phản hồi dự kiến

Khi thực hiện truy vấn cuối cùng, có thể dự kiến phản hồi như sau.

**Khi thực hiện truy vấn cuối cùng:**
- 💬 Có thể dự kiến phản hồi như sau

Khi thực sự truy vấn thời tiết, đã sử dụng công cụ liên quan đến thời tiết.

**Khi thực sự truy vấn thời tiết:**
- ✅ Sử dụng công cụ liên quan đến thời tiết

### 🖥️ Ví dụ tương tác

```
Bạn: Thời tiết ở Seattle như thế nào?

🤔 Đang suy nghĩ...

Tôi sẽ kiểm tra thời tiết ở Seattle.

Công cụ #1: TestGatewayTarget74eb18fa___get_weather

Thời tiết hiện tại ở Seattle như sau:
- **Địa điểm**: Seattle
- **Nhiệt độ**: 72°F (khoảng 22°C)
- **Thời tiết**: Nắng

Hôm nay ở Seattle trời nắng và nhiệt độ dễ chịu nhỉ!

Agent: [{'text': 'Thời tiết hiện tại ở Seattle như sau:\n\n- **Địa điểm**: Seattle\n- **Nhiệt độ**: 72°F (khoảng 22°C)\n- **Thời tiết**: Nắng\n\nHôm nay ở Seattle trời nắng và nhiệt độ dễ chịu nhỉ!'}]
```

### ✅ Cột mốc đạt được

Đến đây, đã có thể thử toàn bộ chức năng Gateway bằng cách đăng ký hàm Lambda làm công cụ MCP và sử dụng từ agent.

**Đến nay đã hoàn thành:**
- ✅ Đăng ký hàm Lambda làm công cụ MCP
- ✅ Sử dụng từ agent
- ✅ Đã thử toàn bộ chức năng Gateway

---

## 🔄 Thử tích hợp với Runtime

### 📋 Thiết lập hiện tại so với mong muốn

Cho đến nay đã sử dụng Gateway từ Strands.

**Cho đến nay:**
- 🔧 Sử dụng Gateway từ Strands

Đã đến đây rồi thì muốn triển khai agent lên Runtime, kết nối từ Runtime với Gateway và thực thi luôn.

**Bây giờ muốn:**
- 🚀 Triển khai agent lên Runtime
- 🔗 Kết nối từ Runtime với Gateway
- ▶️ Thực thi

### 📚 Tham khảo

Trong kho lưu trữ workshop chính thức có mẫu nên đã tham khảo.

**Đã tìm thấy mẫu:**
- 📖 Trong kho lưu trữ workshop chính thức

---

## 🔧 Thay đổi code theo đặc tả Runtime

### 📋 Phạm vi thay đổi

Công việc không nhiều lắm, chỉ cần thay đổi file `run_agent.py` đã tạo ở trên theo đặc tả Runtime là được.

**Không nhiều việc:**
- ✅ Thay đổi `run_agent.py` đã tạo ở trên
- ✅ Thay đổi theo đặc tả Runtime
- ✅ Vậy là xong!

### 💻 Code đã thay đổi

**File:** `run_agent.py` (phiên bản Runtime)

Toàn bộ code được hiển thị trong phần có thể mở rộng.

---

## 🚀 Triển khai và thực thi

### 💻 Các lệnh

Sau khi thay đổi, triển khai lên Runtime bằng các lệnh sau và thực thi, công cụ sẽ được thực thi và phản hồi được trả về như trước.

**Sau khi thay đổi:**
- 🚀 Triển khai lên Runtime bằng các lệnh sau
- ✅ Công cụ thực thi và trả về phản hồi như trước

```bash
# Cấu hình điểm vào
uv run agentcore configure --entrypoint run_agent.py

# Khởi chạy runtime
uv run agentcore launch

# Gọi với truy vấn
uv run agentcore invoke '{"prompt": "Hãy cho tôi biết về thời tiết ở Seattle"}'
```

**Dự kiến:**
- ✅ Thực thi công cụ giống nhau
- ✅ Phản hồi giống nhau

---

## 📊 Xác nhận khả năng quan sát

### 📋 Mục đích

Cuối cùng chỉ kiểm tra log và trace.

**Cuối cùng:**
- 📝 Kiểm tra log
- 🔍 Kiểm tra trace

---

## 🔍 Log AgentCore.Gateway.ListTools

### 📋 Điểm tập trung

Trước tiên, tập trung vào "AgentCore.Gateway.ListTools", đang lấy các công cụ có sẵn được đăng ký trong Gateway.

**Tập trung vào "AgentCore.Gateway.ListTools":**
- ✅ Lấy các công cụ có sẵn được đăng ký trong Gateway

### 📊 Trích xuất Log

Xin lỗi vì khó đọc, nhưng trích xuất log nguyên bản như sau.

**Xin lỗi vì định dạng khó đọc:**
- 📝 Trích xuất log nguyên bản

```json
{
  "resource_arn": "arn:aws:bedrock-agentcore:us-west-2:017820658462:gateway/testgateway6ff97ace-x6wakfaq7e",
  "event_timestamp": 1761430247527,
  "body": {
    "isError": false,
    "responseBody": "{jsonrpc=2.0, id=1, result={tools=[
      {
        inputSchema={type=object, properties={query={type=string}}, required=[query]}, 
        name=x_amz_bedrock_agentcore_search, 
        description=Công cụ đặc biệt trả về danh sách công cụ được cắt giảm dựa trên ngữ cảnh. Chỉ sử dụng công cụ này khi có nhiều công cụ và bạn muốn lấy tập con khớp với ngữ cảnh được cung cấp.
      }, 
      {
        inputSchema={type=object, properties={timezone={type=string}}, required=[timezone]}, 
        name=TestGatewayTarget74eb18fa___get_time, 
        description=Lấy thời gian cho múi giờ
      }, 
      {
        inputSchema={type=object, properties={location={type=string}}, required=[location]}, 
        name=TestGatewayTarget74eb18fa___get_weather, 
        description=Lấy thời tiết cho địa điểm
      }
    ]}}",
    "log": "Đã xử lý yêu cầu thành công",
    "id": "1"
  },
  "account_id": "017820658462",
  "request_id": "a79b9900-9d86-4739-99d5-a39e25559a20",
  "trace_id": "68fd4ae65e9784515c42aa192a72cc06",
  "span_id": "53f7a7285f074c52"
}
```

### 🔧 Các công cụ có sẵn

Trong phần "responseBody", có thể thấy `get_time` và `get_weather` được trả về là các công cụ có sẵn.

**Trong "responseBody":**

**3 công cụ được trả về là có sẵn:**

#### **1. x_amz_bedrock_agentcore_search**
- 🔍 Công cụ đặc biệt cho tìm kiếm ngữ nghĩa
- 📋 Mô tả: "Trả về danh sách công cụ được cắt giảm dựa trên ngữ cảnh"
- 🎯 Sử dụng khi: Có nhiều công cụ, muốn tập con khớp với ngữ cảnh
- 📥 Đầu vào: `query` (chuỗi)

#### **2. TestGatewayTarget74eb18fa___get_time**
- ⏰ Lấy thời gian cho múi giờ
- 📥 Đầu vào: `timezone` (chuỗi)

#### **3. TestGatewayTarget74eb18fa___get_weather**
- ☀️ Lấy thời tiết cho địa điểm
- 📥 Đầu vào: `location` (chuỗi)

---

## 🔧 Log thực thi công cụ

### 📋 Lựa chọn công cụ

Dưới đây là log của phần thực sự chọn và thực thi công cụ cho truy vấn.

**Log sau hiển thị:**
- ✅ Thực sự chọn công cụ cho truy vấn
- ✅ Thực thi nó

### 💬 Phân tích truy vấn

Đối với truy vấn muốn kiểm tra thời tiết Seattle, có thể thấy công cụ `get_weather` đang được sử dụng trong phần toolUse.

**Đối với truy vấn muốn kiểm tra thời tiết Seattle:**
- ✅ Trong phần `toolUse`: công cụ `get_weather` được sử dụng

Trong phần tool.result, có thể thấy đã thực hiện truy vấn và lấy được giá trị đã đăng ký trong Lambda.

**Trong phần `tool.result`:**
- ✅ Đã thực hiện truy vấn
- ✅ Lấy được giá trị đã đăng ký trong Lambda

### 📊 Log chi tiết

```json
"body": {
  "output": {
    "messages": [
      {
        "content": {
          "message": [
            {
              "text": "Tôi sẽ kiểm tra thời tiết ở Seattle."
            },
            {
              "toolUse": {
                "toolUseId": "tooluse_Ppenr0ikQK-2KKyL6Ek69w",
                "name": "TestGatewayTarget74eb18fa___get_weather",
                "input": {
                  "location": "Seattle"
                }
              }
            }
          ],
          "tool.result": [
            {
              "toolResult": {
                "status": "success",
                "toolUseId": "tooluse_Ppenr0ikQK-2KKyL6Ek69w",
                "content": [
                  {
                    "text": {
                      "statusCode": 200,
                      "body": {
                        "location": "Seattle",
                        "temperature": "72°F",
                        "conditions": "Sunny"
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
```

### 🎯 Phân tích Log

**Phần toolUse:**
- 🆔 `toolUseId`: "tooluse_Ppenr0ikQK-2KKyL6Ek69w"
- 🔧 `name`: "TestGatewayTarget74eb18fa___get_weather"
- 📥 `input`: {"location": "Seattle"}

**Phần tool.result:**
- ✅ `status`: "success"
- 📤 `body`:
  - 📍 `location`: "Seattle"
  - 🌡️ `temperature`: "72°F"
  - ☀️ `conditions`: "Sunny"

---

## 🎯 Kết luận

### 📝 Những gì đã hoàn thành

Đến đây đã trải nghiệm toàn bộ chức năng của AgentCore Gateway.

**Đến nay:**
- ✅ Đã trải nghiệm toàn bộ chức năng AgentCore Gateway

Đây là chức năng thú vị có thể chuyển đổi hàm Lambda thành công cụ MCP.

**Chức năng thú vị:**
- 🎯 Có thể chuyển đổi hàm Lambda thành công cụ MCP

### 🔮 Khám phá trong tương lai

Lần này công cụ đã đăng ký chỉ là Lambda giả lập, nhưng có vẻ còn có thể sử dụng nhiều thứ khác nên sẽ tiếp tục xác minh.

**Lần này:**
- 🧪 Chỉ có công cụ Lambda giả lập

**Kế hoạch tương lai:**
- 🔍 Có vẻ có thể sử dụng nhiều thứ khác
- ✅ Sẽ tiếp tục điều tra

### 📖 Đi sâu vào xác thực

Không thể giải thích nhiều về xử lý xác thực, nên muốn viết kỹ trong bài viết tiếp theo.

**Chi tiết xác thực:**
- ⚠️ Không thể giải thích nhiều về xử lý xác thực

**Bài viết tiếp theo:**
- 📝 Muốn viết kỹ lưỡng

---

## 🎯 Những điểm quan trọng

### 📋 Các khái niệm cốt lõi về Gateway

| Khía cạnh | Mô tả |
|-----------|-------|
| **Gateway là gì** | Chuyển đổi API/Lambda/Dịch vụ → công cụ tương thích MCP |
| **Loại đầu vào** | Salesforce, Slack, Jira, Lambda, API Gateway, MCP Server |
| **Xác thực** | Kép: Inbound (OAuth) + Outbound (IAM) |
| **Khám phá công cụ** | Tìm kiếm ngữ nghĩa cho việc lựa chọn công cụ thông minh |

### 💪 3 lợi ích chính

**1. Đơn giản hóa tích hợp công cụ**
- ✅ Tích hợp một cú nhấp chuột với các công cụ phổ biến
- ✅ Chuyển đổi tài nguyên hiện có → công cụ tương thích agent
- ✅ Tăng cường cộng tác MCP server

**2. Khám phá công cụ động**
- ✅ Chức năng tìm kiếm ngữ nghĩa
- ✅ Lựa chọn công cụ thông minh từ hàng trăm/hàng nghìn
- ✅ Giảm chi phí, độ trễ, cải thiện độ chính xác

**3. Xác thực toàn diện**
- ✅ Inbound: Xác minh danh tính agent (OAuth)
- ✅ Outbound: Kết nối công cụ bên ngoài (IAM)
- ✅ Được quản lý bởi dịch vụ Identity

### 🔄 Luồng xác thực

```
Agent → Gateway (OAuth token)
         ↓
Gateway → Identity (Xác minh token)
         ↓
Gateway → Lambda (Thực thi IAM role)
```

### 🛠️ Các bước triển khai

**Bước 1: Tạo Gateway**
- 🔐 Tạo máy chủ OAuth (Amazon Cognito)
- 🌉 Tạo Gateway (bật tìm kiếm ngữ nghĩa)
- 📄 Lưu cấu hình vào `gateway_config.json`

**Bước 2: Tạo hàm mục tiêu**
- 🔧 Lambda với công cụ thời tiết (giả lập: 72°F, Nắng)
- 🔧 Lambda với công cụ thời gian (giả lập: 2:30 PM)

**Bước 3: Kết nối và thực thi**
- 🤖 Sử dụng Strands → Gateway
- 🚀 Triển khai Runtime → Gateway

**Bước 4: Khả năng quan sát**
- 📊 Log ListTools hiển thị các công cụ có sẵn
- 🔍 Trace thực thi công cụ trong CloudWatch

### 💻 Các file code

**setup_gateway.py:**
- Tạo bộ ủy quyền OAuth
- Tạo Gateway
- Thêm mục tiêu Lambda
- Lưu cấu hình

**run_agent.py:**
- Tạo agent với kết nối Gateway
- Thực thi truy vấn
- Có thể thay đổi cho triển khai Runtime

**lambda_function.py:**
- Trích xuất tên công cụ từ ngữ cảnh
- Trả về dữ liệu giả lập dựa trên công cụ
- get_weather hoặc get_time

### 📊 Các công cụ có sẵn sau khi thiết lập

**1. x_amz_bedrock_agentcore_search**
- Công cụ tìm kiếm ngữ nghĩa đặc biệt
- Trả về danh sách công cụ được cắt giảm cho ngữ cảnh

**2. TestGatewayTarget74eb18fa___get_time**
- Đầu vào: múi giờ
- Đầu ra: Thời gian giả lập (2:30 PM)

**3. TestGatewayTarget74eb18fa___get_weather**
- Đầu vào: địa điểm
- Đầu ra: Thời tiết giả lập (72°F, Nắng)

### 🖥️ Ví dụ tương tác

**Truy vấn:** "Thời tiết ở Seattle như thế nào?"

**Quy trình:**
1. Agent suy nghĩ
2. Chọn công cụ get_weather
3. Gọi Lambda với location="Seattle"
4. Trả về dữ liệu giả lập
5. LLM định dạng phản hồi thân thiện

**Phản hồi:** "Seattle trời nắng và 72°F (khoảng 22°C)"

### 🚀 Hai mẫu triển khai

**Mẫu 1: Strands → Gateway**
- Tạo agent trực tiếp
- Kết nối với URL Gateway
- Sử dụng thông tin xác thực OAuth
- Thực thi truy vấn

**Mẫu 2: Runtime → Gateway**
- Thay đổi run_agent.py cho Runtime
- Triển khai: `agentcore configure/launch`
- Gọi với lời nhắc JSON
- Thực thi công cụ giống nhau

### 📚 Tài nguyên liên quan

**Điều kiện tiên quyết:**
- Giới thiệu StrandsAgents - https://qiita.com/yakumo_09/items/f85a8a0634e30b0d756c
- Triển khai Runtime - https://qiita.com/yakumo_09/items/eaa3b6062396227615a2

**Tài liệu chính thức:**
- Tài liệu Gateway - https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
- Tìm kiếm ngữ nghĩa - https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-semantic-search.html

**Workshop:**
- Diving Deep into Bedrock AgentCore - https://catalog.us-east-1.prod.workshops.aws/workshops/015a2de4-9522-4532-b2eb-639280dc31d8/ja-JP/30-agentcore-gateway/

### 💡 Những hiểu biết chính

**Những gì hoạt động tốt:**
- ✅ Chuyển đổi Lambda → công cụ MCP rất đơn giản
- ✅ Tìm kiếm ngữ nghĩa giải quyết khám phá công cụ ở quy mô lớn
- ✅ OAuth + IAM cung cấp bảo mật toàn diện
- ✅ Hoạt động với cả Strands và Runtime

**Khám phá trong tương lai:**
- 🔍 Triển khai Lambda thực tế (không phải giả lập)
- 🔍 Tích hợp công cụ khác (Salesforce, Slack, Jira)
- 🔍 Đi sâu vào cơ chế xác thực
- 🔍 Hiệu suất ở quy mô lớn với nhiều công cụ

### 🎯 Các trường hợp sử dụng

**Phù hợp cho:**
- 🎯 Chuyển đổi API hiện có thành công cụ agent
- 🎯 Bọc hàm Lambda để agent sử dụng
- 🎯 Quản lý danh mục công cụ lớn
- 🎯 Kết nối agent-to-service an toàn
- 🎯 Tạo nguyên mẫu nhanh với dữ liệu giả lập

**Yêu cầu kỹ thuật:**
- Môi trường Python (khuyến nghị uv)
- Tài khoản AWS với quyền truy cập Bedrock
- Amazon Cognito cho OAuth
- Lambda cho triển khai công cụ
- IAM role và quyền

---

TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
