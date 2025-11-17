---
title: "Triển khai Xác thực cho Amazon Bedrock AgentCore khi Gọi Agent (Giải thích Inbound Auth)"
date: 2025-11-15
draft: false
categories: ["AWS", "Bedrock", "AI"]
tags: ["AgentCore", "Cognito", "Authentication", "Security"]
author: "やくも (Yakumo)"
translator: "日平"
description: "Hướng dẫn triển khai Inbound Auth trong Amazon Bedrock AgentCore với Cognito để nhận diện an toàn người dùng và quyền truy cập"
---

# Triển khai Xác thực cho Amazon Bedrock AgentCore khi Gọi Agent

**Tác giả**: やくも (@yakumo_09)  
**Ngày xuất bản**: 15 tháng 11, 2025  
**URL gốc**: https://qiita.com/yakumo_09/items/a091b38d23cd16bdbf1c

## Giới thiệu

Bài viết này giải thích cách triển khai "**Inbound Auth (Xác thực Đầu vào)**" trong tính năng **Identity** của Amazon Bedrock AgentCore. Chúng ta sẽ xây dựng tính năng xác thực khi gọi agent bằng cách kết hợp với Amazon Cognito, thực hiện cơ chế nhận diện an toàn ai đang truy cập với quyền hạn gì.

## Tổng quan Tính năng Identity

### 1. Inbound Auth (Xác thực Đầu vào)

Xác thực khi gọi agent. Xác nhận ai có thể truy cập agent và ai đang truy cập. Phương thức xác thực sử dụng dịch vụ xác thực người dùng như Amazon Cognito.

### 2. Outbound Auth (Xác thực Đầu ra)

Xác thực để agent gọi các dịch vụ bên ngoài. Kết nối với các dịch vụ bên ngoài như Slack hoặc Google Drive thông qua tính năng Gateway.

## 4 Bước của Luồng Xác thực

1. **Cấp Access Token**: Client cấp access token với header `Authorization: Bearer`
2. **Xác minh Token**: Runtime xác minh token tại endpoint xác thực như Cognito
3. **Giữ Identity Context**: Sau khi xác minh thành công, thông tin người dùng được giữ bên trong dưới dạng **Identity Context**
4. **Hoạt động Cá nhân hóa**: Agent có thể thay đổi hoạt động cho từng người dùng

## Tại sao Xác thực quan trọng?

### Rủi ro khi Không có Xác thực

- Bất kỳ ai cũng có thể truy cập AI
- Bất kỳ ai cũng có thể truy cập các công cụ
- Thực thi công cụ không mong muốn hoặc rò rỉ dữ liệu

### Lợi ích khi Có Xác thực

- Chỉ người dùng hợp lệ mới có thể truy cập
- Chỉ quản trị viên mới có thể thực thi Lambda cụ thể
- Thay đổi nội dung trả lời cho từng người dùng
- Kiểm soát hoạt động dựa trên quyền

## Các Bước Triển khai

### Bước 1: Thiết lập Amazon Cognito

Tạo User Pool, App Client và test user.

```bash
#!/bin/bash
USER_POOL_NAME="MyUserPool"
CLIENT_NAME="MyClient"
USER_NAME="testuser"
PASSWORD="TempPassword123!"

# Tạo User Pool
POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name $USER_POOL_NAME \
  --policies "PasswordPolicy={MinimumLength=8}" \
  --query 'UserPool.Id' \
  --output text)

# Tạo App Client
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id $POOL_ID \
  --client-name $CLIENT_NAME \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --query 'UserPoolClient.ClientId' \
  --output text)

# Tạo User và thiết lập Password
aws cognito-idp admin-create-user \
  --user-pool-id $POOL_ID \
  --username $USER_NAME \
  --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
  --user-pool-id $POOL_ID \
  --username $USER_NAME \
  --password $PASSWORD \
  --permanent
```

### Bước 2: Cấu hình Agent (Configure)

```bash
uv run agentcore configure --entrypoint AgentCore_Identity.py
```

**Các mục thiết lập**:

- **OAuth Discovery URL**: `https://cognito-idp.us-west-2.amazonaws.com/$POOL_ID/.well-known/openid-configuration`
- **Client ID**: Cognito App Client ID
- **Allowed Audience**: Để trống và nhấn Enter
- **Request Header Allowlist**: `Authorization`, `X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id`

### Bước 3: Deploy (Launch)

```bash
uv run agentcore launch
```

### Bước 4: Lấy Access Token

```bash
TOKEN=$(aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id $CLIENT_ID \
  --auth-parameters USERNAME=$USER_NAME,PASSWORD=$PASSWORD \
  --query 'AuthenticationResult.AccessToken' \
  --output text)
```

### Bước 5: Gọi Agent (Invoke)

```bash
uv run agentcore invoke \
  --bearer-token "$TOKEN" \
  --headers "X-Amzn-Bedrock-AgentCore-Runtime-Custom-User-Id: yakumo_0905" \
  --prompt "Hello, authenticated world!"
```

## Khắc phục Sự cố

### Lỗi 1: Quên thiết lập Request Header Allowlist

```
ValidationException: Value '[X-Amzn-Bedrock-AgentCore-Runtime-User-Id]' failed to satisfy constraint
```

**Giải quyết**: Thực thi lại `agentcore configure` và thêm các header cần thiết

### Lỗi 2: Authorization method mismatch

```
AccessDeniedException: Authorization method mismatch
```

**Giải quyết**: Sử dụng rõ ràng option `--bearer-token`

### Lỗi 3: 403 Forbidden

```
Failed to invoke agent endpoint: 403 Client Error: Forbidden
```

**Giải quyết**: Để trống allowedAudience

## Tổng kết

Bằng cách triển khai Inbound Auth, có thể quản lý truy cập vào agent một cách an toàn. Khi kết hợp với hạ tầng xác thực hiện có như Cognito, có thể thực hiện cá nhân hóa từng người dùng và kiểm soát dựa trên quyền.

## Tài liệu tham khảo

- Bedrock AgentCore Documentation
- Amazon Cognito User Pools

**Số lượt thích**: 12  
**Cập nhật cuối**: 15 tháng 11, 2025
