---
title: "Biến đổi kiến trúc MCP với AgentCore Gateway - Tích hợp MCP servers"
date: 2025-11-13
draft: false
categories: ["AWS", "AI & Machine Learning", "Development"]
tags: ["Amazon Bedrock", "AgentCore Gateway", "MCP", "Model Context Protocol", "AI Agent", "Enterprise AI"]
author: "Frank Dallezotte, Ganesh Thiyagarajan, Dhawal Patel"
translator: "日平"
description: "Amazon Bedrock AgentCore Gateway thêm hỗ trợ MCP server targets, cho phép tích hợp nhiều MCP servers dưới một gateway thống nhất với authentication, tool discovery và semantic search tập trung."
---

# Biến đổi kiến trúc MCP với AgentCore Gateway - Tích hợp MCP servers

**Tác giả**: Frank Dallezotte, Ganesh Thiyagarajan, Dhawal Patel (AWS)  
**Dịch giả**: Takuya Aida  
**Ngày xuất bản**: 13 tháng 11 năm 2025  
**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/transform-your-mcp-architecture-unite-mcp-servers-through-agentcore-gateway/)

---

## Tổng quan

Amazon Bedrock AgentCore Gateway đã bổ sung hỗ trợ MCP (Model Context Protocol) server targets. Điều này cho phép tích hợp nhiều MCP servers phía sau một gateway duy nhất, cung cấp authentication thống nhất, khám phá công cụ (tool discovery) và tìm kiếm ngữ nghĩa (semantic search). Giải pháp này đơn giản hóa việc quản lý MCP servers trong môi trường doanh nghiệp, cung cấp quản lý công cụ tập trung tương tự như REST API hay Lambda functions.

## Thách thức của MCP Silos

Trong các tổ chức doanh nghiệp, nhiều nhóm vận hành các MCP servers riêng biệt, dẫn đến những thách thức sau:

**Ví dụ: Nền tảng eCommerce**
- **Nhóm Shopping Cart**: MCP server cho thao tác giỏ hàng, kiểm tra tồn kho, tính giá
- **Nhóm Product Catalog**: MCP server cho tìm kiếm sản phẩm, lấy thông tin chi tiết
- **Nhóm Promotion**: MCP server cho áp dụng coupon, xác thực giảm giá

### Các vấn đề

1. **Phức tạp trong kết nối riêng lẻ**: Cần kết nối và quản lý authentication riêng cho từng MCP server
2. **Khó khăn trong khám phá công cụ**: Việc phát hiện và chia sẻ các công cụ có sẵn gặp khó khăn
3. **Tăng công sức quản lý**: Vận hành trong môi trường phân mảnh rất phức tạp
4. **Phân tán bảo mật**: Khó có kiểm soát bảo mật thống nhất

## Giải pháp với AgentCore Gateway

AgentCore Gateway hỗ trợ MCP servers như native targets, giải quyết các vấn đề trên.

### Kiến trúc

```
┌────────────────────────────────────────────────────┐
│         AgentCore Gateway (Hub tích hợp)           │
│  ┌──────────────────────────────────────────────┐ │
│  │  Giao diện thống nhất                        │ │
│  │  - OAuth 2.0 authentication                  │ │
│  │    (AgentCore Identity)                      │ │
│  │  - Semantic search                           │ │
│  │  - Tool discovery và routing                 │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
              │         │         │         │
    ┌─────────┴─┐ ┌────┴────┐ ┌─┴──────┐ ┌┴────────┐
    │ MCP       │ │ MCP     │ │Lambda  │ │OpenAPI  │
    │ Server 1  │ │ Server 2│ │Function│ │REST API │
    └───────────┘ └─────────┘ └────────┘ └─────────┘
```

### Tính năng chính

1. **Authentication thống nhất**: OAuth 2.0 authentication sử dụng AgentCore Identity
2. **Tích hợp công cụ**: Hỗ trợ hỗn hợp MCP, Lambda, OpenAPI, Smithy
3. **Semantic search**: Tìm kiếm công cụ trên tất cả các loại targets khác nhau
4. **Federation**: Tổ chức phân cấp các Gateways với nhau

## Hướng dẫn triển khai

### Bước 1: Tạo Gateway

```python
import boto3

bedrock = boto3.client('bedrock-agentcore')

# Tạo Gateway với xác thực Cognito JWT token
response = bedrock.create_gateway(
    gatewayName='ecommerce-gateway',
    authenticationConfiguration={
        'cognitoJwt': {
            'userPoolArn': 'arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_ABC123',
            'allowedAudiences': ['your-app-client-id']
        }
    }
)

gateway_id = response['gatewayId']
```

### Bước 2: Tạo MCP Server

Sử dụng FastMCP để tạo stateless HTTP server.

```python
from fastmcp import FastMCP

# Kích hoạt stateless operation với stateless_http=True
mcp = FastMCP("Shopping Cart MCP", stateless_http=True)

@mcp.tool()
def add_to_cart(item_id: str, quantity: int) -> dict:
    """Thêm item vào giỏ hàng"""
    return {
        "status": "success",
        "item_id": item_id,
        "quantity": quantity
    }

@mcp.tool()
def get_cart_total(user_id: str) -> dict:
    """Lấy tổng giá trị giỏ hàng"""
    # Logic triển khai thực tế
    return {
        "user_id": user_id,
        "total": 150.00,
        "currency": "USD"
    }
```

### Bước 3: Deploy lên AgentCore Runtime

Sử dụng AgentCore Runtime Starter toolkit để deploy MCP server.

```bash
# Clone Starter toolkit
git clone https://github.com/awslabs/amazon-bedrock-agentcore-samples

# Deploy MCP server
cd 01-tutorials/02-AgentCore-gateway/05-mcp-server-as-a-target
python deploy.py --mcp-server-path ./shopping_cart_mcp
```

### Bước 4: Tạo OAuth Credential Provider

```python
# Cấu hình OAuth 2.0 Client Credentials Flow
response = bedrock.create_credential_provider(
    credentialProviderName='shopping-cart-oauth',
    configuration={
        'oauth2': {
            'grantType': 'CLIENT_CREDENTIALS',
            'tokenUrl': 'https://your-cognito-domain.auth.us-east-1.amazoncognito.com/oauth2/token',
            'clientId': 'your-client-id',
            'clientSecret': 'your-client-secret',
            'scope': 'mcp/read mcp/write'
        }
    }
)

credential_provider_id = response['credentialProviderId']
```

### Bước 5: Tạo Gateway Target

```python
# Thêm MCP server làm Gateway target
response = bedrock.create_gateway_target(
    gatewayId=gateway_id,
    targetName='shopping-cart-mcp',
    targetConfiguration={
        'mcpServer': {
            'url': 'https://your-mcp-server.execute-api.us-east-1.amazonaws.com',
            'credentialProviderId': credential_provider_id
        }
    },
    targetPrefix='cart_'  # Prefix để tránh xung đột tên tool
)

target_id = response['targetId']
```

### Bước 6: Kiểm tra hoạt động

Sử dụng Strands Agents framework để test.

```python
from strands import Agent

# Tạo agent sử dụng Gateway
agent = Agent(
    gateway_id=gateway_id,
    model="anthropic.claude-3-5-sonnet-20241022-v2:0"
)

# Thực thi task với agent
response = agent.run(
    "Thêm 2 item-456 vào giỏ hàng của user 123 và cho tôi biết tổng giá trị giỏ hàng"
)

print(response)
```

## Cơ chế đồng bộ công cụ (Tool Synchronization)

AgentCore Gateway cung cấp 2 phương pháp đồng bộ.

### 1. Đồng bộ tường minh (Explicit Sync - SynchronizeGatewayTargets API)

Người quản trị có thể đồng bộ tool definitions khi cần thiết.

```python
# Đồng bộ tool definitions theo yêu cầu
response = bedrock.synchronize_gateway_targets(
    gatewayId=gateway_id,
    targetIds=[target_id]
)

print(f"Trạng thái đồng bộ: {response['synchronizationStatus']}")
```

**Quy trình:**
1. Quản trị viên gọi API
2. Gateway lấy OAuth token từ AgentCore Identity
3. Khởi tạo session với MCP server
4. Lấy tool definitions qua `tools/list` (xử lý theo batch 100 items)
5. Thêm prefix để tránh xung đột tên tool

**Lợi ích:**
- Quản lý tính nhất quán của schema
- Cập nhật vào thời điểm chiến lược
- Kiểm soát tác động đến hiệu suất

### 2. Đồng bộ ngầm (Implicit Sync)

Tự động đồng bộ tool definitions khi tạo/cập nhật target.

**Triggers:**
- `CreateGatewayTarget`
- `UpdateGatewayTarget`

**Quy trình:**
1. Thao tác tạo/cập nhật target
2. Gateway bắt đầu quá trình đồng bộ bất đồng bộ
3. Lấy OAuth token
4. Khởi tạo session với MCP server
5. Lấy tool definitions qua `tools/list`

**Lợi ích:**
- Targets ở trạng thái READY có thể sử dụng ngay lập tức
- Chỉ giữ các tool definitions đã được xác thực

## Các thao tác với công cụ

### ListTools: Phương pháp Cache-First

```python
response = bedrock.list_tools(gatewayId=gateway_id)

for tool in response['tools']:
    print(f"Tên tool: {tool['name']}")
    print(f"Mô tả: {tool['description']}")
    print(f"Nguồn: {tool['sourceTarget']}")
```

**Hoạt động:**
- Lấy tool definitions đã đồng bộ trước từ persistent storage
- Không cần gọi MCP server realtime
- Hiệu suất cao

### InvokeTool: Giao tiếp Realtime

```python
response = bedrock.invoke_tool(
    gatewayId=gateway_id,
    toolName='cart_add_to_cart',
    parameters={
        'item_id': 'item-789',
        'quantity': 3
    }
)

print(response['result'])
```

**Hoạt động:**
1. Xác thực tool tồn tại trong definitions đã đồng bộ
2. Lấy OAuth token từ AgentCore Identity
3. Khởi tạo session với MCP server
4. Thực thi tool qua `tools/call`

### SearchTools: Semantic Search

```python
response = bedrock.search_tools(
    gatewayId=gateway_id,
    query='tính tổng giá trị giỏ hàng'
)

for tool in response['tools']:
    print(f"Tool khớp: {tool['name']}")
    print(f"Điểm liên quan: {tool['relevanceScore']}")
```

**Tính năng:**
- Tự động tạo vector representations cho tên tool, mô tả, parameters
- Không yêu cầu khớp thuật ngữ chính xác
- Hiểu ý định và ngữ cảnh
- Hoạt động trên tất cả các loại target khác nhau

## Use Cases

### 1. Tích hợp nền tảng eCommerce

```
┌──────────────────────────────────────┐
│    eCommerce Gateway                 │
├──────────────────────────────────────┤
│  cart_add_to_cart                    │
│  cart_get_total                      │
│  product_search                      │
│  product_get_details                 │
│  promo_apply_coupon                  │
│  promo_validate_discount             │
└──────────────────────────────────────┘
```

### 2. Quản lý công cụ theo Business Units

Mỗi phòng ban quản lý MCP server riêng nhưng cung cấp qua giao diện thống nhất.

### 3. Domain-specific tools theo tính năng sản phẩm

Các nhóm chức năng duy trì MCP servers riêng, sử dụng xuyên suốt qua Gateway.

## Lợi ích

1. **Môi trường công cụ thống nhất**: Truy cập tất cả tools qua một giao diện duy nhất
2. **Bảo mật cấp doanh nghiệp**: Authentication thống nhất qua OAuth 2.0
3. **Phát triển agent đơn giản**: Agents không cần quan tâm đến từng MCP server riêng lẻ
4. **Chiến lược migration từng bước**: Có thể cùng tồn tại với REST APIs và Lambda functions hiện có
5. **Kiểm soát bảo mật nhất quán**: Quản lý access tập trung
6. **Nâng cao hiệu quả vận hành**: Tự động hóa và chuẩn hóa quản lý công cụ

## Cân nhắc về bảo mật

### Tách biệt Inbound và Target Authentication

- **Inbound Authentication**: Xác thực khi agents truy cập Gateway (Cognito JWT)
- **Target Authentication**: Xác thực khi Gateway truy cập MCP servers (OAuth 2.0)

Sự tách biệt này cho phép kiểm soát access chi tiết.

### Ví dụ IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:ListTools",
        "bedrock-agentcore:InvokeTool",
        "bedrock-agentcore:SearchTools"
      ],
      "Resource": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/gateway-id"
    }
  ]
}
```

## Tối ưu hóa hiệu suất

### Best practices cho đồng bộ công cụ

1. **Đồng bộ định kỳ**: Thực hiện batch sync ngoài giờ làm việc
2. **Cập nhật tăng dần**: Chỉ đồng bộ các targets có thay đổi
3. **Tận dụng cache**: ListTools lấy dữ liệu nhanh từ cache

### Khả năng mở rộng

- **Batch processing**: Xử lý tool definitions theo batch 100 items
- **Thực thi song song**: Đồng bộ nhiều MCP servers song song
- **Xử lý lỗi**: Lỗi target riêng lẻ không ảnh hưởng toàn Gateway

## Kịch bản Federation

Có thể tổ chức các Gateways theo cấu trúc phân cấp.

```
┌─────────────────────────────────┐
│  Master Gateway toàn công ty    │
└─────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───┴────┐   ┌───┴────┐
│Phòng A  │   │Phòng B  │
│Gateway  │   │Gateway  │
└───┬────┘   └───┬────┘
    │             │
┌───┴────┐   ┌───┴────┐
│MCP     │   │MCP     │
│Servers │   │Servers │
└────────┘   └────────┘
```

## Khắc phục sự cố

### Vấn đề thường gặp

1. **Lỗi đồng bộ**: Kiểm tra thông tin xác thực OAuth
2. **Không tìm thấy tool**: Xác nhận trạng thái đồng bộ
3. **Timeout thực thi**: Kiểm tra thời gian phản hồi của MCP server

### Lệnh Debug

```python
# Kiểm tra trạng thái target
response = bedrock.get_gateway_target(
    gatewayId=gateway_id,
    targetId=target_id
)

print(f"Trạng thái: {response['status']}")
print(f"Đồng bộ lần cuối: {response['lastSyncTime']}")

# Kiểm tra lịch sử đồng bộ
response = bedrock.list_gateway_target_sync_history(
    gatewayId=gateway_id,
    targetId=target_id
)

for sync in response['syncHistory']:
    print(f"Thời gian: {sync['timestamp']}, Kết quả: {sync['result']}")
```

## Kết luận

Hỗ trợ MCP server của AgentCore Gateway đã đơn giản hóa đáng kể việc sử dụng MCP trong môi trường doanh nghiệp. Bằng cách tận dụng authentication thống nhất, quản lý công cụ và semantic search, bạn có thể xây dựng kiến trúc AI agent có khả năng mở rộng và an toàn.

## Tài liệu tham khảo

- [AgentCore Gateway Documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html)
- [Sample code (GitHub)](https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-tutorials/02-AgentCore-gateway/05-mcp-server-as-a-target)
- [AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing/)
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/docs/getting-started/intro)

---

**Tags**: Amazon Bedrock, AgentCore Gateway, MCP, Model Context Protocol, AI Agent, Enterprise AI  
**Categories**: AWS, AI, Architecture
