---
title: "Amazon Bedrock AgentCore Gateway Interceptors: Kiểm soát quyền truy cập chi tiết cho AI Agent"
date: 2025-12-02T10:00:00+09:00
draft: false
categories: ["AI and Machine Learning", "Security and Networking", "Development"]
tags: ["Amazon Bedrock", "AgentCore Gateway", "MCP", "Access Control", "Security", "AI Agents", "OAuth", "Lambda"]
author: "AWS Machine Learning Blog"
description: "Tìm hiểu cách sử dụng Gateway Interceptors của Amazon Bedrock AgentCore để triển khai kiểm soát quyền truy cập chi tiết, lọc công cụ động, và quản lý identity cho AI agent systems quy mô lớn."
---

## Tổng quan

Khi các tổ chức triển khai AI agent với tốc độ chóng mặt, họ đối mặt với thách thức lớn: quản lý quyền truy cập an toàn đến hàng nghìn công cụ trên toàn tổ chức. Trong các ứng dụng AI hiện đại, hàng trăm agent, ứng dụng AI tiêu dùng và workflow tự động cần truy cập hàng nghìn công cụ MCP (Model Context Protocol) trải rộng trên các team, tổ chức và bộ phận khác nhau.

Quy mô này tạo ra các thách thức bảo mật và quản trị cơ bản:

- Làm thế nào để đảm bảo mỗi caller chỉ truy cập các công cụ được phép?
- Làm thế nào để lọc động quyền truy cập công cụ dựa trên user identity, agent context và quyền hạn?
- Làm thế nào để bảo vệ dữ liệu nhạy cảm qua các workflow multi-hop?
- Làm thế nào để đạt được điều này mà không tạo ra bottleneck về hiệu suất hoặc vận hành?

Để giải quyết các thách thức này, Amazon Bedrock AgentCore Gateway giới thiệu **Gateway Interceptors** - một tính năng mới cho phép kiểm soát quyền truy cập chi tiết.

## Các thách thức chính

### 1. Kiểm soát truy cập công cụ chi tiết (Fine-Grained Tool Access Control)

Trong môi trường doanh nghiệp, hàng nghìn công cụ MCP được triển khai qua một AgentCore Gateway thống nhất. Thách thức là bảo vệ quyền truy cập vào các công cụ MCP dựa trên quyền hạn của principal, và trả về response phù hợp với context cho các API call như ListTools, InvokeTool và Search.

Việc lọc công cụ cần dựa trên các yếu tố động:
- Agent ID
- User ID
- Execution context
- Workspace access level
- Các context attribute khác

Quyền hạn có thể thay đổi động, do đó cần có security-aware filtering phản ánh ngay lập tức các thay đổi permission mà không cache trạng thái quyền cũ.

### 2. Bảo vệ dữ liệu và chuyển đổi schema giữa MCP và downstream API

Quản lý tương tác giữa AI agent và downstream API trong khi duy trì bảo mật và tính linh hoạt là một thách thức phức tạp. Tổ chức cần:

- Map động MCP request schema sang downstream API schema
- Loại bỏ/redact PII (Personally Identifiable Information) và SPI (Sensitive Personal Information) mà user có thể gửi
- Khả năng chuyển đổi schema giúp duy trì MCP schema trong khi cho phép thay đổi API spec
- Backend team tự do sửa đổi API implementation mà không ép buộc thay đổi ở agent layer

### 3. Tenant isolation trong Multi-tenant SaaS

Các tổ chức cung cấp agent và tool as-a-service có yêu cầu multi-tenancy phức tạp:

- Cung cấp MCP server cho tất cả user trong khi duy trì tenant isolation phù hợp
- Xác thực cả tenant ID và user ID
- Isolation hoàn toàn giữa các user và workspace khác nhau
- Quyền truy cập công cụ được kiểm soát nghiêm ngặt dựa trên tenant boundary

### 4. Dynamic Tool Filtering

Tổ chức cần real-time tool filtering phản ánh thay đổi permission và user context:

- Lọc theo agent permission và workspace context
- Lọc theo semantic search
- Permission có thể thay đổi bất cứ lúc nào nên không cache kết quả lọc mà phải quyết định động

### 5. Custom Header Propagation và Identity Context Management

AI agent là tự động và non-deterministic, khác biệt căn bản so với microservice truyền thống. Agent thực thi workflow thay mặt end-user và cần truy cập downstream tool, API, resource dựa trên user context.

Tuy nhiên, gửi authorization token nguyên trạng xuống downstream service tạo ra các lỗ hổng bảo mật nghiêm trọng:
- Token theft
- Privilege escalation
- Confused Deputy Problem

## So sánh các phương thức ủy quyền

### Phương thức Impersonation (Mạo danh)

JWT token của user gốc được truyền không thay đổi qua từng hop của multi-hop execution.

**Nhược điểm**:
- Downstream service nhận token với nhiều quyền hơn cần thiết
- Tăng nguy cơ privilege escalation nếu component bị xâm nhập
- Không giới hạn scope của token cho specific downstream target
- Dễ bị tấn công impersonation

**Khuyến nghị**: ❌ Không khuyên dùng

### Phương thức Act-on-Behalf (Đại diện thực thi)

Mỗi hop của workflow nhận một scoped token riêng biệt được phát hành đặc biệt cho downstream target đó.

**Ưu điểm**:
- **Principle of Least Privilege**: Mỗi service chỉ nhận quyền cần thiết để truy cập specific downstream API
- **Giới hạn blast radius**: Token bị leak có scope hạn chế, không thể tái sử dụng ở nơi khác
- **Auditability tốt hơn**: Có thể track responsibility rõ ràng với AgentCore Observability
- **Token scope constraint**: Mỗi downstream target nhận token với scope đặc biệt cho API đó
- **Security boundary**: Ép buộc separation phù hợp giữa các service khác nhau trong call chain
- **Confused Deputy Prevention**: Scoped token ngăn chặn unauthorized operation

**Khuyến nghị**: ✅ Được khuyên dùng

Với act-on-behalf, gateway trích xuất execution context từ incoming request và tạo scoped authorization token mới cho từng downstream target.

## AgentCore Gateway: Tích hợp MCP an toàn cho AI Agent

AgentCore Gateway chuyển đổi các existing API và AWS Lambda function thành agent-compatible MCP tool. Ngoài ra, có thể kết nối gateway với existing MCP server hoặc tích hợp liền mạch với third-party business tool như Jira, Asana, Zendesk.

### Gateway Interceptors

Gateway Interceptors của AgentCore Gateway cho phép triển khai fine-grained access control và credential management qua 2 custom Lambda function:

#### 1. Gateway Request Interceptor

Xử lý incoming request trước khi đến target tool.

**Chức năng**:
- Xác thực user credential
- Xác nhận session context
- Kiểm soát truy cập dựa trên organizational policy
- Tạo audit trail
- Chuyển đổi schema

#### 2. Gateway Response Interceptor

Xử lý outgoing response trước khi trả về calling agent.

**Chức năng**:
- Tạo audit trail
- Lọc tool
- Chuyển đổi schema
- Access control cho search và list tool

### Cấu trúc Payload

**Input của Gateway Request Interceptor**:
```json
{
  "interceptorInputVersion": "1.0",
  "mcp": {
    "gatewayRequest": {
        "headers": { "Authorization": "Bearer eyJhbG...", ... },
        "body": { "jsonrpc": "2.0", "method": "tools/list", ... }
    },
    "requestContext": { ... }
  }
}
```

**Output của Gateway Request Interceptor**:
```json
{
  "interceptorOutputVersion": "1.0",
  "mcp": {
    "transformedGatewayRequest": {
        "headers": { ... },
        "body": { ... }
    }
  }
}
```

**Input của Gateway Response Interceptor**:
```json
{
  "interceptorInputVersion": "1.0",
  "mcp": {
    "gatewayRequest": { ... },
    "requestContext": { ... },
    "gatewayResponse": {
        "statusCode": 200,
        "headers": { ... },
        "body": { 
            "jsonrpc": "2.0",
            "result": { "tools": [ ... ] }
        }
    }
  }
}
```

## Use Case của Gateway Interceptors

### 1. Fine-Grained Access Control cho Tool Invocation

AgentCore Gateway expose nhiều backend tool qua unified MCP endpoint. Kết hợp JWT scope và gateway interceptor, chỉ cho phép user invoke các tool được authorize.

**Quy ước đặt tên scope**:
- `mcp-target-123`: Full access
- `mcp-target-123:getOrder`: Tool-level access

**Các bước triển khai**:

1. Trích xuất và decode JWT để lấy scope claim
2. Sử dụng `tools/call` để xác định tool nào đang được invoke
3. Tham khảo configuration file hoặc access policy datastore
4. Trả về structured MCP error cho unauthorized call

**Core authorization logic**:
```python
def check_tool_authorization(scopes, tool, target):
    if target in scopes:
        return True 
    return f"{target}:{tool}" in scopes
```

Pattern này cho phép enforce authorization có thể dự đoán được ở cả invocation và discovery path.

**Operational Security Key Points**:
- Interceptor giữ behavior deterministic
- Tránh branching logic phức tạp
- Chỉ dựa vào token claim, không phải LLM instruction

### 2. Dynamic Filtering cho Tool Discovery

Agent discover các công cụ có sẵn qua 2 phương thức chính:
1. Semantic search capability
2. Standard `tools/list` operation

Không có proper filtering control, MCP server sẽ trả về list tất cả tool có sẵn bất kể authorization level của requesting agent hoặc user.

**Dynamic Filtering Workflow**:

1. Target xác thực JWT token và trả về full tool list hoặc filtered subset từ semantic search
2. AgentCore Gateway invoke response interceptor
3. Interceptor trích xuất và decode JWT từ payload, lấy scope claim
4. Với mỗi tool trong list, đánh giá authorization của user dựa trên JWT scope
5. Loại bỏ các tool mà user không được phép truy cập khỏi list
6. Trả về transformed response chỉ chứa authorized tool

**Response Interceptor Code Example**:

```python
def lambda_handler(event, context):
    # Trích xuất gateway response và auth header
    gateway_response = event['mcp']['gatewayResponse'] 
    auth_header = gateway_response['headers'].get('Authorization', '')
    token = auth_header.replace('Bearer ', '')

    # Trích xuất scope từ JWT
    claims = decode_jwt_payload(token)
    scopes = claims.get('scope', '').split()
    
    # Lấy tool list từ gateway response
    tools = gateway_response['body']['result'].get('tools', [])
    
    # Nếu là MCP tools/list
    if not tools:
        tools = gateway_response['body']['result'].get('structuredContent', {}).get('tools', [])
    
    # Lọc tool dựa trên scope
    filtered_tools = filter_tools_by_scope(tools, scopes)
    
    # Trả về transformed response chỉ chứa authorized tool
    return {
        "interceptorOutputVersion": "1.0",
        "mcp": {
            "transformedGatewayResponse": {
                "statusCode": 200,
                "headers": {"Authorization": auth_header},
                "body": {
                    "result": {"tools": filtered_tools}
                }
            }
        }
    }
```

**Filtering Function**:
```python
def filter_tools_by_scope(tools, allowed_scopes):
    """Lọc tool dựa trên scope được phép của user"""
    filtered_tools = [] 
    for tool in tools:
        target, action = tool['name'].split('___')
        # Kiểm tra user có full access vào target hoặc access vào tool cụ thể
        if target in allowed_scopes or f"{target}:{action}" in allowed_scopes:
            filtered_tools.append(tool)
    return filtered_tools
```

### 3. Custom Header Propagation

Khi AI agent tương tác với nhiều downstream service, việc duy trì user identity (user identifier hoặc user information) qua service boundary là quan trọng cho security, compliance và audit trail.

**Thách thức**:
Không có proper identity propagation, downstream service không thể:
- Enforce user-specific authorization policy
- Duy trì accurate audit log
- Implement tenant isolation

**Workflow**:

1. MCP client invoke AgentCore Gateway
2. AgentCore Gateway authenticate inbound request
3. AgentCore Gateway invoke custom interceptor
4. Gateway request interceptor transform incoming request payload
   - Thêm auth token như parameter để gửi cho downstream Lambda target
   - Không gửi nguyên received JWT (rủi ro privilege escalation và credential theft)
   - Thêm JWT mới với scoped-down token có least-privilege scope
5. AgentCore Gateway invoke target với transformed request
6. AgentCore Gateway trả về response từ target

**Interceptor Code Example**:

```python
import json 
import uuid 

def lambda_handler(event, context):
    # Trích xuất request đến gateway
    mcp_data = event.get('mcp', {})
    gateway_request = mcp_data.get('gatewayRequest', {})
    headers = gateway_request.get('headers', {})
    body = gateway_request.get('body', {})
    extended_body = body 
    
    # Pass-through auth header
    auth_header = headers.get('authorization', '') or headers.get('Authorization', '')
    if "arguments" in extended_body["params"]:
        extended_body["params"]["arguments"]["authorization"] = auth_header 
    
    # Trả về transformed request với auth header được preserve
    response = {
        "interceptorOutputVersion": "1.0",
        "mcp": {
            "transformedGatewayRequest": {
                "headers": {
                    "Accept": "application/json",
                    "Authorization": auth_header,
                    "Content-Type": "application/json"
                },
                "body": extended_body 
            }
        }
    }
    return response
```

## No-Auth và OAuth-Based Authorization

Nhiều doanh nghiệp cần flexible authorization model cân bằng giữa tool discoverability và security.

**Use Case**:
- AI agent và application có thể discover và search các MCP tool có sẵn **không cần authorization**
- Cho phép seamless tool exploration và semantic search trên toàn tool catalog
- Khi **thực sự invoke** các tool này, yêu cầu strict OAuth-based authorization

**Implementation Approach**:

AgentCore Gateway hỗ trợ tính linh hoạt này bằng cách giới thiệu "no-auth" authorization type ở gateway level cho tất cả inbound invocation.

**Workflow**:

1. **Unauthenticated ListTools Call** đến AgentCore Gateway với `no-auth` được set mặc định cho tất cả inbound call
   - User có thể thấy các tool có sẵn mà không cần authentication

2. Khi user muốn **CallTool request** để invoke specific tool, authentication được yêu cầu
   - AgentCore Gateway invoke custom request interceptor
   - Validate JWT token từ auth header
   - Check scope và permission của user đối với specific tool đang được invoke

3. Nếu authentication thành công, interceptor transform và augment request với auth context cần thiết

4. AgentCore Gateway forward transformed request đến target service

**Gateway Creation Example**:

```json
{
  "name": "no-auth-gateway",
  "protocolType": "MCP",
  "protocolConfiguration": {
    "mcp": {
      "supportedVersions": ["2025-03-26"] 
    }
  },
  "authorizerType": "NONE",
  "roleArn": "<role-arn>"
}
```

Process này giữ cho tool listing open trong khi enforce strict OAuth-based authentication cho actual tool execution.

## Observability

AgentCore Observability cung cấp comprehensive observability rất quan trọng cho việc monitoring, debugging và auditing các AI agent workflow tương tác với nhiều tool và service qua AgentCore Gateway.

### Key Benefits

#### 1. Security Decision Visibility

Interceptor tạo trusted log của authorization outcome bao gồm allow/deny decision và JWT scope được evaluate. Điều này cho phép:
- Xem denied request
- Validate policy behavior
- Analyze enforcement của authorization rule qua tool invocation

#### 2. Request và Response Traceability

Interceptor ghi lại:
- Header enrichment
- Schema transformation
- Sensitive data redaction

Điều này cho phép trace hoàn toàn các modification của payload, support secure và compliant data handling qua toàn bộ agent workflow.

#### 3. Downstream Tool Observability

Interceptor log:
- Status code
- Latency
- Error response

Điều này đảm bảo visibility nhất quán qua tất cả target, giúp team dễ dàng troubleshoot failure, identify reliability issue và hiểu end-to-end execution characteristic.

### Automatic Integration

Gateway Interceptor tự động tích hợp với AgentCore Observability, cung cấp:

- Real-time monitoring của authorization decision
- Identify performance bottleneck theo duration và invocation metric
- End-to-end traceability trong multi-hop agent workflow
- Validate authorization behavior trong multi-tenant environment theo identity và context attribute

### Monitoring Example

**CloudWatch Metrics**:
- Success rate: 100%
- Average latency: 4.47ms
- Throttling: Không có vấn đề

Các metric này cho thấy system đang hoạt động trong optimal parameter.

## Kết luận

Khi deploy agentic AI system ở quy mô lớn, tổ chức đối mặt với thách thức căn bản về security và access control. Gateway Interceptor của AgentCore Gateway giải quyết thách thức này.

### 3 Pattern cơ bản

1. **Fine-Grained Access Control cho Tool Invocation**
   - Deterministic authorization dựa trên JWT scope
   - Security enforcement tại gateway boundary

2. **Dynamic Tool Filtering**
   - Real-time filtering dựa trên user permission
   - Phản ánh permission ngay lập tức không cache

3. **Identity Propagation**
   - Act-on-behalf approach cho principle of least privilege
   - Security boundary với scoped token

### Key Advantage

- Đóng gap trong authentication
- Isolate credential phù hợp
- Enforce unique security policy
- Không sửa đổi existing tool implementation hoặc MCP server architecture

Gateway Interceptor cung cấp programmable intervention point cho cả request và response, đảm bảo security, compliance và operational visibility khi tổ chức scale đến hàng trăm agent và hàng nghìn tool.

### Tài nguyên

Chi tiết code sample:
- [Fine-Grained Access Control](https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-tutorials/02-AgentCore-gateway/09-fine-grained-access-control)
- [Custom Header Propagation](https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-tutorials/02-AgentCore-gateway/08-custom-header-propagation)

Full documentation:
- [Amazon Bedrock AgentCore Gateway Fine-Grained Access Control](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-fine-grained-access-control.html)

---

**Tác giả**: Dhawal Patel (Principal Generative AI Tech Lead, AWS), Ganesh Thiyagarajan (Senior Solutions Architect, AWS), và đồng nghiệp  
**Dịch**: AWS Vietnam Community
