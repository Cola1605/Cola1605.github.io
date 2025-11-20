---
title: "Triển khai Authentication cho Amazon Bedrock AgentCore (Giải thích Inbound Auth)"
date: 2025-11-15
draft: false
categories: ["AWS", "AI & Machine Learning", "Security & Networking"]
tags: ["Amazon Bedrock", "AgentCore", "Cognito", "Authentication", "Bearer Token"]
author: "やくも (Yakumo)"
translator: "日平"
description: "Hướng dẫn thực hành triển khai Inbound Authentication cho Amazon Bedrock AgentCore sử dụng Amazon Cognito, bao gồm cả troubleshooting và best practices"
---

# Amazon Bedrock AgentCore エージェント呼び出し時の認証を実装してみる（Inbound Auth解説）

**Tác giả**: やくも (@yakumo_09)  
**Ngày xuất bản**: 15 tháng 11, 2025  

**Nền tảng**: Qiita  **Nền tảng**: Qiita  

**Thẻ**: AWS, やってみた, bedrock, 生成AI, AgentCore**Tags**: AWS, やってみた, bedrock, 生成AI, AgentCore



---## Giới thiệu



## Giới thiệuAmazon Bedrock AgentCore là một framework mạnh mẽ để xây dựng các AI agent sinh tạo. Bài viết này sẽ giải thích cách triển khai authentication khi gọi agent (Inbound Authentication).



Bài viết này giải thích cách triển khai "**Inbound Auth (Xác thực Đầu vào)**" trong tính năng **Identity** của Amazon Bedrock AgentCore.## Tổng quan về Identity



Chúng ta sẽ xây dựng tính năng xác thực khi gọi agent bằng cách kết hợp với Amazon Cognito, thực hiện cơ chế **nhận diện an toàn ai đang truy cập với quyền hạn gì**. Bài viết sẽ giải thích chi tiết các bước triển khai, khắc phục sự cố và tầm quan trọng của bảo mật.AgentCore có 2 loại authentication:



---### Inbound Auth (Xác thực Đầu vào)

- Authentication khi gọi agent

## Tổng quan Tính năng Identity- Xác định ai đang gọi agent

- Nội dung được giải thích trong bài viết này

Tính năng **Identity** của Amazon Bedrock AgentCore có 2 hướng xác thực:

### Outbound Auth (Xác thực Đầu ra)

### 1. Inbound Auth (Xác thực Đầu vào)- Authentication khi agent gọi các service bên ngoài

- Sẽ được giải thích trong bài viết tương lai

**Định nghĩa**: Xác thực khi gọi agent

## Cơ chế của Authentication Flow

**Mục đích**: 

- Ai có thể truy cập agentAuthentication flow của Inbound Auth hoạt động theo các bước sau:

- Xác nhận ai đang truy cập

1. **Caller (Người gọi)**: Gửi request có chứa Bearer token

**Phương thức xác thực**: Dịch vụ xác thực người dùng như Amazon Cognito2. **Runtime**: Xác thực token và trích xuất thông tin user

3. **Agent**: Thực thi agent sử dụng Identity Context

**Nội dung bài viết này xử lý**: ✅ Chúng ta sẽ triển khai điều này4. **Tools**: Thực hiện xử lý dựa trên thông tin user



### 2. Outbound Auth (Xác thực Đầu ra)## Tại sao cần Authentication?



**Định nghĩa**: Xác thực để agent gọi các dịch vụ bên ngoài### Rủi ro Bảo mật



**Liên kết**: Kết nối với các dịch vụ bên ngoài như Slack hoặc Google Drive thông qua tính năng GatewayTrong trường hợp không có authentication, có những rủi ro sau:



**Nội dung bài viết này xử lý**: ❌ Dự kiến giải thích trong bài viết tiếp theo- Bất kỳ ai cũng có thể gọi agent

- Khả năng truy cập bất hợp pháp hoặc lạm dụng

---- Không thể xác định user



## 4 Bước của Luồng Xác thực### Lợi ích của Authentication



Luồng xác thực của Inbound Auth bao gồm 4 bước sau:Bằng cách triển khai authentication:



### Bước 1: Cấp Access Token- **Xác định User**: Xác định ai đã gọi

Client cấp access token với header `Authorization: Bearer`.- **Kiểm soát Quyền hạn**: Thiết lập quyền truy cập khác nhau cho mỗi user

- **Personalization**: Tạo phản hồi theo user

### Bước 2: Xác minh Token- **Audit**: Ghi lại và phân tích access log

Runtime xác minh token tại endpoint xác thực như Cognito.

## Các bước Triển khai

### Bước 3: Giữ Identity Context

Sau khi xác minh thành công, thông tin người dùng được giữ bên trong dưới dạng **Identity Context**.### 1. Setup Amazon Cognito



### Bước 4: Hoạt động được Cá nhân hóaĐầu tiên, tạo user pool trong Amazon Cognito.

Agent có thể thay đổi hoạt động cho từng người dùng.

```bash

---#!/bin/bash

# setup_cognito.sh

## Tại sao Xác thực lại Quan trọng?

# Tạo user pool

### Rủi ro Bảo mật khi Không có Xác thựcaws cognito-idp create-user-pool \

  --pool-name bedrock-agentcore-users \

1. **Bất kỳ ai cũng có thể truy cập AI**  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}" \

   - Bao gồm cả người dùng có ác ý, bất kỳ ai cũng có thể thao tác agent  --auto-verified-attributes email



2. **Bất kỳ ai cũng có thể truy cập các công cụ**# Lấy User Pool ID

   - Truy cập không giới hạn vào hệ thống nội bộ và API mà agent kết nốiUSER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 \

  --query "UserPools[?Name=='bedrock-agentcore-users'].Id" --output text)

3. **Thực thi công cụ không mong muốn hoặc rò rỉ dữ liệu**

   - Người dùng không có quyền có thể truy cập thông tin bí mật# Tạo app client

aws cognito-idp create-user-pool-client \

### Lợi ích khi Có Xác thực  --user-pool-id $USER_POOL_ID \

  --client-name bedrock-agentcore-client \

1. **Chỉ người dùng hợp lệ mới có thể truy cập**  --explicit-auth-flows "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" \

   - Chỉ người dùng có thông tin xác thực mới có thể sử dụng agent  --generate-secret



2. **Chỉ quản trị viên mới có thể thực thi Lambda cụ thể**# Tạo test user

   - Có thể kiểm soát quyền dựa trên vai tròaws cognito-idp admin-create-user \

  --user-pool-id $USER_POOL_ID \

3. **Thay đổi nội dung trả lời cho từng người dùng**  --username testuser \

   - Cung cấp phản hồi được cá nhân hóa  --user-attributes Name=email,Value=testuser@example.com \

  --temporary-password TempPassword123! \

4. **Kiểm soát hoạt động dựa trên quyền**  --message-action SUPPRESS

   - Hạn chế chức năng theo mức quyền của người dùng

echo "Cognito setup completed!"

---echo "User Pool ID: $USER_POOL_ID"

```

## Các Bước Triển khai

### 2. Cấu hình Agent

### Xây dựng Môi trường

Tiếp theo, cấu hình AgentCore agent.

**Technology Stack sử dụng**:

- Xác thực: Amazon Cognito User Pool```python

- Agent Framework: Strands# AgentCore_Identity.py

- LLM Model: Claude Haiku 4.5 (global.anthropic.claude-haiku-4-5-20251001-v1:0)

- Runtime: BedrockAgentCoreAppfrom strands import Agent, AgentCore

- Deployment Tool: agentcore CLI (uv)

- Region: us-west-2# Sử dụng Claude Haiku 4.5

agent = Agent(

### Bước 1: Thiết lập Amazon Cognito    name="SecureAgent",

    model="claude-haiku-4.5",

Thực thi shell script sau (`setup_cognito.sh`) để xây dựng môi trường Cognito:    instructions="""

    Bạn là một agent bảo mật.

```bash    Hãy kiểm tra thông tin user và phản hồi thích hợp.

#!/bin/bash    """,

    tools=[]

# Thiết lập biến)

USER_POOL_NAME="MyUserPool"

CLIENT_NAME="MyClient"# Khởi động agent

USER_NAME="testuser"if __name__ == "__main__":

PASSWORD="TempPassword123!"    agent.launch()

```

# Tạo User Pool

echo "Creating User Pool..."### 3. Cấu hình Authentication Settings

POOL_ID=$(aws cognito-idp create-user-pool \

  --pool-name $USER_POOL_NAME \Thêm authentication settings vào agent:

  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=false,RequireLowercase=false,RequireNumbers=false,RequireSymbols=false}" \

  --query 'UserPool.Id' \```bash

  --output text)# Thiết lập OAuth Discovery URL

OAUTH_DISCOVERY_URL="https://cognito-idp.{region}.amazonaws.com/{user-pool-id}/.well-known/openid-configuration"

echo "User Pool ID: $POOL_ID"

# Thiết lập Request Header Allowlist

# Tạo App Clientagentcore configure \

echo "Creating App Client..."  --oauth-discovery-url $OAUTH_DISCOVERY_URL \

CLIENT_ID=$(aws cognito-idp create-user-pool-client \  --request-header-allowlist "Authorization" "X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id"

  --user-pool-id $POOL_ID \```

  --client-name $CLIENT_NAME \

  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \**Các mục cấu hình quan trọng**:

  --query 'UserPoolClient.ClientId' \

  --output text)- **OAuth Discovery URL**: OIDC endpoint của Cognito

- **Request Header Allowlist**: Request header được phép

echo "App Client ID: $CLIENT_ID"  - `Authorization`: Bearer token

  - `X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id`: Custom user ID

# Tạo User

echo "Creating User..."### 4. Lấy Bearer Token

aws cognito-idp admin-create-user \

  --user-pool-id $POOL_ID \Lấy token từ Cognito:

  --username $USER_NAME \

  --message-action SUPPRESS```bash

# Script lấy token

# Thiết lập Passwordaws cognito-idp initiate-auth \

echo "Setting permanent password..."  --auth-flow USER_PASSWORD_AUTH \

aws cognito-idp admin-set-user-password \  --client-id $CLIENT_ID \

  --user-pool-id $POOL_ID \  --auth-parameters USERNAME=testuser,PASSWORD=YourPassword123! \

  --username $USER_NAME \  --query 'AuthenticationResult.IdToken' \

  --password $PASSWORD \  --output text

  --permanent```



echo "Setup complete!"**Về Bearer Token**:

echo "POOL_ID: $POOL_ID"- Thời hạn: 1 giờ

echo "CLIENT_ID: $CLIENT_ID"- Format: JWT (JSON Web Token)

echo "USERNAME: $USER_NAME"- Mục đích: User authentication và chứng minh identity

echo "PASSWORD: $PASSWORD"

```### 5. Deploy Agent



**Nội dung thực thi**:Deploy agent:

1. Tạo User Pool (Password Policy: tối thiểu 8 ký tự)

2. Tạo App Client (kích hoạt USER_PASSWORD_AUTH, REFRESH_TOKEN_AUTH)```bash

3. Tạo test user (không cần email xác nhận với SUPPRESS message)agentcore launch AgentCore_Identity.py

4. Thiết lập password (vĩnh viễn với --permanent)```



### Bước 2: Tạo Agent Code### 6. Gọi Agent với Authentication



Tạo `AgentCore_Identity.py`:Sử dụng token đã lấy để gọi agent:



```python```bash

from bedrock_strands import Agentagentcore invoke \

from bedrock_strands.app_core import BedrockAgentCoreApp  --bearer-token $ID_TOKEN \

  --headers "X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id: user123" \

def invoke(app: BedrockAgentCoreApp):  --prompt "Xin chào, hãy cho tôi biết thông tin của tôi"

    """Entry point của Agent"""```

    

    # Định nghĩa Agent## Troubleshooting

    agent = Agent(

        name="IdentityAgent",Giới thiệu các lỗi thường gặp khi triển khai và cách giải quyết.

        model="global.anthropic.claude-haiku-4-5-20251001-v1:0",

        instructions="You are a helpful assistant with authentication capabilities."### Lỗi 1: ValidationException

    )

    **Triệu chứng**:

    # Xử lý prompt```

    prompt = app.event.get("prompt", "Hello")ValidationException: Request Header Allowlist is not configured

    response = agent.invoke(prompt)```

    

    return response**Nguyên nhân**: Request Header Allowlist chưa được thiết lập

```

**Cách giải quyết**:

**Điểm quan trọng**:```bash

- Sử dụng Strands frameworkagentcore configure \

- Hàm `invoke` là entry point  --request-header-allowlist "Authorization" "X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id"

- Lấy prompt từ `app.event` để xử lý```



### Bước 3: Cấu hình Agent (Configure)### Lỗi 2: AccessDeniedException



```bash**Triệu chứng**:

uv run agentcore configure --entrypoint AgentCore_Identity.py```

```AccessDeniedException: Authorization method not configured

```

**Các mục thiết lập dạng đối thoại**:

**Nguyên nhân**: Không sử dụng Bearer token

#### 1. OAuth Discovery URL

```**Cách giải quyết**:

OAuth discovery URL: https://cognito-idp.us-west-2.amazonaws.com/us-west-2_XXXXXXXXX/.well-known/openid-configuration```bash

```# Thêm option --bearer-token

agentcore invoke --bearer-token $ID_TOKEN --prompt "your prompt"

**Format**: `https://cognito-idp.$REGION.amazonaws.com/$POOL_ID/.well-known/openid-configuration````



**Vai trò**: OpenID Connect configuration endpoint của Cognito### Lỗi 3: 403 Forbidden



#### 2. Client ID**Triệu chứng**:

``````

Client ID: <Cognito App Client ID>403 Forbidden: Invalid token

``````



Nhập `CLIENT_ID` đã lấy từ Bước 1.**Nguyên nhân**: Cấu hình audience của token sai



#### 3. Allowed Audience**Cách giải quyết**:

``````bash

Allowed audience: (để trống và nhấn Enter)# Thiết lập allowedAudience đúng

```agentcore configure \

  --oauth-discovery-url $OAUTH_DISCOVERY_URL \

⚠️ **Quan trọng**: Đây là đáp án đúng khi **để trống và nhấn Enter**. Nếu nhập access token sẽ gặp lỗi 403.  --allowed-audience $CLIENT_ID

```

#### 4. Request Header Allowlist

## Sơ đồ Architecture

```

Request header allowlist:```

- AuthorizationCaller (with Bearer Token)

- X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id    ↓

```Runtime (Token Verification via Cognito)

    ↓

**Vai trò của mỗi header**:Agent (with Identity Context)

    ↓

##### AuthorizationTools (User-specific processing)

- **Mục đích**: Truyền Bearer Token (Cognito access token) cho Runtime```

- **Vai trò**: Trung tâm của OAuth authentication

- **Format**: `Authorization: Bearer <ACCESS_TOKEN>`## Best Practices về Bảo mật



##### X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id1. **Quản lý Token An toàn**:

- **Mục đích**: Header nhận diện người dùng tùy chỉnh   - Không hardcode token

- **Cách sử dụng**: Truyền tên người dùng, v.v.   - Sử dụng biến môi trường hoặc AWS Secrets Manager

- **Ứng dụng**: 

  - Xác định người sử dụng trong Runtime2. **Nguyên tắc Quyền hạn Tối thiểu**:

  - Phân tách log   - Chỉ cấp quyền tối thiểu cần thiết

  - Thay đổi hoạt động cho từng người dùng   - Thiết kế IAM role và Cognito group thích hợp



### Bước 4: Deploy Agent (Launch)3. **Thời hạn Token**:

   - Thiết lập thời hạn ngắn (khuyến nghị: 1 giờ)

```bash   - Quản lý refresh token thích hợp

uv run agentcore launch

```4. **Audit Log**:

   - Ghi lại access log với CloudWatch Logs

Agent được deploy lên AWS.   - Phát hiện các pattern truy cập bất thường



### Bước 5: Lấy Access Token## Use Cases



Lấy access token từ Cognito:Inbound Auth hiệu quả trong các trường hợp sau:



```bash- **Ứng dụng nội bộ**: Agent chỉ nhân viên có thể truy cập

TOKEN=$(aws cognito-idp initiate-auth \- **Bot công khai hạn chế**: Chỉ công khai cho nhóm user cụ thể

  --auth-flow USER_PASSWORD_AUTH \- **Phản hồi Personalized**: Phản hồi dựa trên lịch sử và cài đặt của user

  --client-id $CLIENT_ID \- **Chức năng Admin**: Các thao tác chỉ admin mới có thể thực hiện

  --auth-parameters USERNAME=$USER_NAME,PASSWORD=$PASSWORD \

  --query 'AuthenticationResult.AccessToken' \## Tóm tắt

  --output text)

Bài viết này đã giải thích cách triển khai Inbound Authentication của Amazon Bedrock AgentCore. Các điểm chính là:

echo "Access Token: $TOKEN"

```1. **Cấu hình Cognito**: Tạo user pool và app client

2. **Cấu hình Authentication**: Thiết lập OAuth Discovery URL và Request Header Allowlist

**Điểm quan trọng**:3. **Bearer Token**: Lấy từ Cognito và sử dụng khi gọi agent

- Sử dụng flow `USER_PASSWORD_AUTH`4. **Troubleshooting**: Các lỗi thường gặp và cách giải quyết

- Lấy `AccessToken` (thời hạn hiệu lực: 1 giờ)

- Token này trở thành "chứng chỉ" cho Inbound AuthBằng cách triển khai authentication, có thể xây dựng hệ thống agent được bảo mật và quản lý. Lần tới sẽ giải thích về Outbound Auth (authentication khi gọi service bên ngoài).



### Bearer Token là gì?## Tài liệu tham khảo



**Định nghĩa**: Giống như chứng chỉ đã xác thực- [Amazon Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock/)

- [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/)

**Mục đích**: Chứng minh với agent rằng đã đăng nhập và được xác thực- [OAuth 2.0 and OpenID Connect](https://openid.net/connect/)



**Cơ chế**:---

1. Người dùng đăng nhập vào Cognito

2. Cognito phát hành access token (Bearer Token)**Thông tin bài viết**:

3. Khi gọi agent, xuất trình chứng chỉ này- Số lượt thích: 12

4. Agent xác nhận "người này là chính chủ"- Số bình luận: 0

- Bài viết gốc: https://qiita.com/yakumo_09/items/a091b38d23cd16bdbf1c

### Bước 6: Gọi Agent (Invoke)

```bash
uv run agentcore invoke \
  --bearer-token "$TOKEN" \
  --headers "X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id: yakumo_0905" \
  --prompt "Hello, authenticated world!"
```

**Giải thích tham số**:

- `--bearer-token "$TOKEN"`: Access token cho OAuth authentication
- `--headers`: Custom user ID header
- `--prompt`: Câu hỏi cho agent

**Khi thành công**:
- Agent phản hồi như người dùng đã xác thực
- Identity Context chứa thông tin người dùng
- User ID được ghi vào log

---

## Khắc phục Sự cố

Giới thiệu 3 lỗi thường gặp trong quá trình triển khai và cách giải quyết.

### Lỗi 1: Khi quên thiết lập Request Header Allowlist

#### Thông báo lỗi
```
ValidationException: Value '[X-Amzn-Bedrock-AgentCore-Runtime-User-Id]' 
failed to satisfy constraint
```

#### Nguyên nhân
Runtime từ chối header không có trong danh sách cho phép.

#### Cách giải quyết
1. Thực thi lại `agentcore configure`
2. Nhập các header cần thiết vào Request Header Allowlist:
   - `Authorization`
   - `X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id`
3. Thực thi lại `agentcore launch`

### Lỗi 2: Lỗi Authorization method mismatch

#### Thông báo lỗi
```
AccessDeniedException: Authorization method mismatch
```

#### Nguyên nhân
Runtime đang mong đợi CustomJWTAuthorizer, nhưng phía CLI gọi bằng SigV4 signature hoặc header passing.

#### Cách giải quyết
Sử dụng rõ ràng option `--bearer-token` trong CLI:

```bash
uv run agentcore invoke \
  --bearer-token "$TOKEN" \
  --prompt "your prompt here"
```

**Quan trọng**: Nếu cần cả Bearer Token và header, hãy chỉ định cả hai.

### Lỗi 3: 403 Client Error: Forbidden

#### Thông báo lỗi
```
Failed to invoke agent endpoint: 403 Client Error: Forbidden for url
```

#### Nguyên nhân
Khi thực thi lệnh `configure`, đã nhập access token thay vì để trống **allowedAudience**.

#### Cách giải quyết
Thực thi lại `agentcore configure`, khi nhập allowedAudience **không nhập gì và nhấn Enter**:

```
Allowed audience: (không nhập gì và nhấn Enter ở đây)
```

Sau đó, thực thi lại `agentcore launch`.

---

## Sơ đồ Kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│                  Inbound Auth Flow                      │
└─────────────────────────────────────────────────────────┘

┌──────────┐
│  Caller  │  (Client - phía gọi agent)
└────┬─────┘
     │
     │ Authorization: Bearer <TOKEN>
     │ X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id: yakumo
     │
     ▼
┌─────────────────────┐
│  Bedrock Runtime    │  (Xác minh token + Tạo Identity Context)
└────┬────────────────┘
     │
     │ Yêu cầu xác minh Token
     │
     ▼
┌─────────────────────┐
│  Amazon Cognito     │  (Nhà cung cấp xác thực)
└────┬────────────────┘
     │
     │ Kết quả xác minh
     │
     ▼
┌─────────────────────┐
│  Bedrock Agent      │  (Thực thi Agent)
└────┬────────────────┘
     │
     │ Phản hồi được cá nhân hóa cho từng người dùng
     │
     ▼
┌─────────────────────┐
│  Tools / Lambda     │  (Thực thi theo quyền)
└─────────────────────┘

Security Boundary: Chỉ người dùng có token đúng mới có thể thực thi agent
```

---

## Các Cân nhắc về Bảo mật

1. **Không thể gọi agent nếu không có thông tin xác thực**
   - Ngăn chặn truy cập trái phép

2. **Thời hạn hiệu lực token là 1 giờ**
   - Cần xác thực lại định kỳ

3. **Chỉ header được phép trong Request Header Allowlist mới được thông qua**
   - Ngăn chặn tấn công bằng header không mong đợi

4. **Phân tách rõ ràng OAuth authentication và SigV4 authentication**
   - Ngăn chặn nhầm lẫn về phương thức xác thực

5. **Có thể kiểm soát quyền chi tiết bằng User ID**
   - Triển khai Role-Based Access Control (RBAC)

---

## Use Cases

Các trường hợp Inbound Auth có hiệu quả:

### 1. Vận hành Bot an toàn trong Ứng dụng Nội bộ Công ty
- Liên kết với xác thực nhân viên
- Kiểm soát quyền theo bộ phận

### 2. Dịch vụ Agent Giới hạn Công khai
- AI assistant theo mời
- Tính năng dành cho hội viên trả phí

### 3. Phản hồi được Cá nhân hóa cho từng Người dùng
- Phản hồi dựa trên lịch sử hội thoại trước đây
- Đề xuất xem xét hồ sơ người dùng

### 4. Hạn chế Chức năng Cụ thể bằng Quyền Quản trị viên
- Kiểm soát truy cập vào dữ liệu bí mật
- Hạn chế các thao tác có chi phí cao

### 5. Nhận diện Người dùng cho Audit Trail
- Log ai đã thực thi gì và khi nào
- Đáp ứng yêu cầu tuân thủ

---

## Cấu trúc Code

### setup_cognito.sh
Script tạo User Pool, App Client, test user

### AgentCore_Identity.py
Định nghĩa agent bằng Strands framework

### Các lệnh chính

#### Cấu hình
```bash
uv run agentcore configure --entrypoint AgentCore_Identity.py
```

#### Deploy
```bash
uv run agentcore launch
```

#### Lấy Token
```bash
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id $CLIENT_ID \
  --auth-parameters USERNAME=$USER_NAME,PASSWORD=$PASSWORD
```

#### Gọi
```bash
uv run agentcore invoke \
  --bearer-token "$TOKEN" \
  --headers "X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id: yakumo_0905"
```

---

## Bài học Quan trọng

1. **Inbound Auth chịu trách nhiệm xác thực khi gọi agent**
   - Nhận diện ai đang truy cập

2. **Có thể kết hợp với hạ tầng xác thực hiện có như Cognito**
   - Tận dụng hệ thống quản lý người dùng hiện có

3. **Thiết lập Request Header Allowlist rất quan trọng**
   - Điểm mấu chốt của bảo mật

4. **Cách truyền Bearer Token đúng**
   - Sử dụng option `--bearer-token`

5. **Nguy hiểm khi không có xác thực, bất kỳ ai cũng có thể thao tác agent**
   - Inbound Auth là biện pháp bảo mật cần thiết

6. **Có thể triển khai tự nhiên cá nhân hóa từng cá nhân hoặc kiểm soát dựa trên quyền**
   - Tận dụng Identity Context

---

## Dự Cáo Kỳ Tới

Kỳ tới sẽ giải thích về **Outbound Auth** (xác thực khi liên kết với dịch vụ bên ngoài):

- Xác thực khi agent gọi API bên ngoài như Slack hoặc Google Drive
- Liên kết với tính năng Gateway
- Triển khai OAuth 2.0 flow

Hãy mong chờ!

---

## Đối tượng Độc giả

- Nhà phát triển sử dụng Bedrock AgentCore
- Người triển khai muốn xem xét bảo mật của AI Agent
- Kỹ sư muốn xây dựng hệ thống xác thực bằng Cognito
- Nhà phát triển ứng dụng AI cấp doanh nghiệp

---

## Giá trị của Bài viết

Bài viết này giải thích chi tiết việc triển khai Inbound Auth khó hiểu chỉ từ tài liệu chính thức, bao gồm các bước thực tế và khắc phục sự cố. Đây là hướng dẫn thực tế có thể học theo luồng nhất quán từ sắp xếp khái niệm xác thực/ủy quyền đến triển khai và xác nhận hoạt động.

---

**Số lượt thích**: 12  
**Số bình luận**: 0  
**Cập nhật lần cuối**: 15 tháng 11, 2025
