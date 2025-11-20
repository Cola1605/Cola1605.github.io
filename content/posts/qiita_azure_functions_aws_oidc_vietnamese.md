---
title: "Thao tác AWS từ Azure Functions không cần khóa dài hạn - Truy cập S3 bằng OIDC + AssumeRoleWithWebIdentity"
date: 2025-11-04
categories: ["Azure", "AWS", "Security"]
tags: ["Azure-Functions", "OIDC", "AWS-S3", "AssumeRole", "Multi-Cloud", "Security"]
description: "Hướng dẫn truy cập AWS từ Azure Functions không dùng access key. OIDC authentication với AssumeRoleWithWebIdentity, multi-cloud integration an toàn."
---

# 【Mẹo nhỏ】Thao tác AWS từ Azure Functions "không cần khóa dài hạn" ~ Truy cập S3 bằng OIDC + AssumeRoleWithWebIdentity ~

**Tác giả:** YutoSekine  
**Tổ chức:** BIPROGY株式会社  
**Ngày xuất bản:** 04/11/2025  
**Nguồn:** [Qiita](https://qiita.com/YutoSekine/items/cbe78c96c18c289ab7a2)  
**Likes:** 11 👍

---

## 📋 Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Tóm tắt nội dung (Dành cho người bận rộn)](#tóm-tắt-nội-dung)
3. [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
4. [Hướng dẫn triển khai - Azure](#hướng-dẫn-triển-khai-azure)
5. [Hướng dẫn triển khai - AWS](#hướng-dẫn-triển-khai-aws)
6. [Kiểm tra hoạt động](#kiểm-tra-hoạt-động)
7. [Các điểm gặp khó khăn](#các-điểm-gặp-khó-khăn)
8. [Tổng kết](#tổng-kết)

---

## Giới thiệu

Cảm ơn bạn đã đọc bài viết này!

Tiếp nối bài viết trước, lần này tôi cũng chia sẻ một mẹo nhỏ về việc xác minh cấu hình thao tác AWS từ Azure Functions. Lần này, tôi không sử dụng cấu hình SSO mà xác minh kết nối **không cần khóa dài hạn** bằng **OIDC + AssumeRoleWithWebIdentity**.

### 🎯 Bối cảnh

Có nhu cầu phân tích dữ liệu của hệ thống được xây dựng trên AWS bằng công cụ BI của Azure, nên tôi đã thực hiện cấu hình sử dụng **Azure Functions làm Hub** để truy cập tài khoản AWS.

Mặc dù tôi đã làm việc với AWS và Azure riêng lẻ, nhưng đây là lần đầu tiên tôi thực hiện liên kết giữa chúng. Tôi nghĩ có nhiều người cũng gặp trường hợp tương tự, nên quyết định chia sẻ kết quả xác minh lần này.

---

## Tóm tắt nội dung (Dành cho người bận rộn)

### 📌 Nội dung xác minh

**Truy cập tài khoản Hub của AWS từ Azure Functions (Python) không cần khóa dài hạn, và lấy danh sách object S3 bằng Switch Role.**

#### Azure:
- ✅ Thiết lập Azure App Registration làm OIDC IdP
- ✅ Azure Functions là nơi thực thi batch processing

#### AWS:
- ✅ Đăng ký thông tin OIDC của Azure vào IAM Identity Provider
- ✅ Tạo IAM Role và cho phép AssumeRole từ OIDC IdP
- ✅ Switch Role (ủy quyền) sang IAM Role để truy cập S3

### ⚠️ Các điểm gặp khó khăn:
- Chỉ định Issuer

---

## Tổng quan kiến trúc

![Kiến trúc hệ thống](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F236355%2F752731a3-a1f0-4502-8aba-dbce212e9952.png)

### 🔄 So sánh với SSO

Khi nói đến liên kết giữa Azure và AWS, **cấu hình SSO** sử dụng Microsoft Entra ID (trước đây là Azure AD) và AWS Identity Center là phổ biến. Đặc biệt đối với use case như người dùng nội bộ đăng nhập vào AWS Console, SSO là phương pháp chủ đạo.

Tuy nhiên, lần này tôi **không sử dụng cấu hình nặng nề như vậy**, mà tập trung vào mục đích **thực thi batch processing một cách an toàn từ Azure Functions lên các tài nguyên AWS như S3**, bằng cách sử dụng cấu hình **assume role bằng liên kết IdP qua OIDC (OpenID Connect)** - **AssumeRoleWithWebIdentity**.

---

### 🔐 OIDC là gì?

**OIDC (OpenID Connect)** là giao thức xác thực dựa trên OAuth 2.0.

| Giao thức | Mục đích | Đặc điểm |
|-----------|----------|----------|
| **OAuth 2.0** | Cấp quyền (Authorization) | Cho phép ủy quyền truy cập |
| **OIDC** | Xác thực (Authentication) | Thêm chức năng xác thực vào OAuth 2.0 |

Sau khi xác thực, **ID token (định dạng JWT)** được phát hành, cho phép trao đổi thông tin ID của người dùng hoặc dịch vụ một cách an toàn.

**Trong cấu hình lần này:**
1. **Entra ID** phát hành OIDC token
2. **AWS** xác minh token đó và assume IAM role

---

### 🎫 AssumeRoleWithWebIdentity của STS là gì?

**AWS STS (Security Token Service)** API `AssumeRoleWithWebIdentity`:

- Xác minh **JWT (ID token)** được truyền từ IdP bên ngoài (Azure trong trường hợp này)
- Trả về **access key tạm thời + session token**

Cơ chế này cho phép các dịch vụ bên ngoài như Azure Functions có thể truy cập tài nguyên AWS một cách **an toàn và động**.

---

### ✅ Lợi ích về bảo mật và vận hành

| Lợi ích | Chi tiết |
|---------|----------|
| 🔒 **Giảm thiểu rủi ro rò rỉ** | Không phân phối access key dài hạn, giảm đáng kể rủi ro rò rỉ |
| 🎯 **Nguyên tắc quyền tối thiểu** | Dễ dàng tuân thủ nguyên tắc least privilege bằng cách thu hẹp quyền IAM role về mức tối thiểu cần thiết |
| 🔄 **Tập trung quản lý ID** | Có thể tận dụng nguyên vẹn nền tảng xác thực của Azure, góp phần vào việc tập trung quản lý ID |

---

## Hướng dẫn triển khai - Azure

### 📦 Bước 1: Azure側 (Đăng ký App & Chuẩn bị Functions)

#### 1.1. Tạo Azure Functions

Tạo Azure Functions trên Azure Portal.

![Azure Functions Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F236355%2F96cd46a9-9a8e-4b5c-afc5-9e055612ef58.jpeg)

---

#### 1.2. Phát hành Managed ID

Click menu "**ID**" ở thanh bên trái trang Azure Functions trên Azure Portal và thiết lập như sau để phát hành:

**Cài đặt:**
- ✅ **Trạng thái:** Bật (On)

![Managed ID Setup](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F236355%2Fe6029ccf-bc55-4184-9b89-9872b6b42c65.jpeg)

---

#### 1.3. Phát triển Code

**Luồng xử lý code:**

Sử dụng Managed Identity của Azure Functions để switch sang AWS role một cách an toàn:

1. **Lấy OIDC token bằng Azure MI** (aud = APP_ID_URI/.default)
2. **AssumeRoleWithWebIdentity** sang FuncRole của AWS
3. **AssumeRole** sang TargetRole bằng credential đó
4. **Lấy danh sách object S3** bằng TargetRole

##### 💻 Source Code:

```python
import os, json
import azure.functions as func
from azure.identity import ManagedIdentityCredential
import boto3

app = func.FunctionApp()

@app.function_name(name="bridge")
@app.route(route="bridge", methods=["GET"])
def bridge(req: func.HttpRequest) -> func.HttpResponse:
    app_id_uri       = os.environ["APP_ID_URI"]
    func_role_arn    = os.environ["FUNC_ROLE_ARN"]
    target_role_arn  = os.environ["TARGET_ROLE_ARN"]
    aws_region       = os.environ.get("AWS_REGION", "ap-northeast-1")
    s3_bucket        = os.environ["S3_BUCKET"]

    # 1) Azure MI → Lấy token với aud = APP_ID_URI/.default
    web_id_token = ManagedIdentityCredential().get_token(f"{app_id_uri}/.default").token

    # 2) STS: AssumeRoleWithWebIdentity sang FuncRole
    sts_func = boto3.client("sts", region_name=aws_region)
    creds_func = sts_func.assume_role_with_web_identity(
        RoleArn=func_role_arn,
        RoleSessionName="funcrole-bridge",
        WebIdentityToken=web_id_token,
        DurationSeconds=3600
    )["Credentials"]

    # 3) STS: AssumeRole sang TargetRole bằng credential ngắn hạn của FuncRole
    sts_target = boto3.client(
        "sts",
        region_name=aws_region,
        aws_access_key_id=creds_func["AccessKeyId"],
        aws_secret_access_key=creds_func["SecretAccessKey"],
        aws_session_token=creds_func["SessionToken"]
    )
    creds_target = sts_target.assume_role(
        RoleArn=target_role_arn,
        RoleSessionName="targetrole-session",
        DurationSeconds=3600
    )["Credentials"]

    # 4) S3 list bằng credential ngắn hạn của TargetRole (không dùng khóa dài hạn)
    s3 = boto3.client(
        "s3",
        region_name=aws_region,
        aws_access_key_id=creds_target["AccessKeyId"],
        aws_secret_access_key=creds_target["SecretAccessKey"],
        aws_session_token=creds_target["SessionToken"]
    )
    resp = s3.list_objects_v2(Bucket=s3_bucket, MaxKeys=10)
    keys = [it["Key"] for it in resp.get("Contents", [])]

    return func.HttpResponse(
        json.dumps({"ok": True, "assumed_to": "targetrole", "keys": keys}, ensure_ascii=False),
        mimetype="application/json", status_code=200
    )
```

##### 🔧 Biến môi trường cần thiết:

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `APP_ID_URI` | Application ID URI | `api://[client-id]` |
| `FUNC_ROLE_ARN` | ARN của IAM role mà Functions assume | `arn:aws:iam::xxx:role/func-role` |
| `TARGET_ROLE_ARN` | ARN của IAM role đích Switch | `arn:aws:iam::xxx:role/target-role` |
| `AWS_REGION` | AWS Region | `ap-northeast-1` |
| `S3_BUCKET` | Tên bucket đích | `my-bucket` |

---

#### 1.4. Deploy Code lên Azure Functions

Vì tôi phát triển ở local, nên di chuyển đến thư mục chứa code và thực thi Azure CLI sau:

##### Deploy:
```bash
func azure functionapp publish [Functions名]
```

##### Build local để kiểm tra hoạt động:
```bash
func build
```

---

#### 1.5. Đăng ký App

Trên Azure Portal, nhập các giá trị sau và tạo đăng ký app:

**Cài đặt:**
- **Tên:** Tên tùy ý
- **Loại tài khoản được hỗ trợ:** Chỉ tài khoản trong thư mục tổ chức này (Single tenant)

![App Registration](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F236355%2F040ff14f-659a-446a-ba76-02fd83b5d274.jpeg)

---

#### 1.6. Phát hành URI của Application ID

Trên Azure Portal, nhập giá trị sau và thiết lập Application ID URI (ví dụ: `api://[client-id]`):

**Cài đặt:**
- **Application ID URI:** `api://[client-id]`

![Application ID URI](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F236355%2F44564dcd-5d06-4cc0-a341-2128ee951b6d.jpeg)

---

## Hướng dẫn triển khai - AWS

### 🔐 Bước 2: AWS側 (OIDC IdP và IAM Role)

#### 2.1. Tạo Identity Provider

Trên AWS Console, nhập các giá trị sau và tạo Identity Provider:

**Cài đặt:**
- **Loại Provider:** OpenID Connect
- **URL Provider:** `https://sts.windows.net/[tenant-id]/`
- **Audience:** Application ID URI được phát hành ở bước 1.6 (ví dụ: `api://[client-id]`)

![Identity Provider Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F236355%2F3396e05b-c9a4-48b7-ae4f-3048c237faad.jpeg)

---

#### 2.2. Tạo IAM Role đích Switch

##### 2.2.1. Trust Policy

Mặc dù chưa tạo, nhưng chỉ định Functions IAM role trong Principal:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::[AWSアカウントID]:role/[Functions用IAMロール名]"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

##### 2.2.2. Permission Policy

Lần này chỉ lấy danh sách bucket trong S3, nên attach policy AWS managed **AmazonS3ReadOnlyAccess**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*",
        "s3:Describe*",
        "s3-object-lambda:Get*",
        "s3-object-lambda:List*"
      ],
      "Resource": "*"
    }
  ]
}
```

---

#### 2.3. Tạo IAM Role cho Functions

##### 2.3.1. Trust Policy

Chỉ định Issuer(iss) và Audience(aud) trong Condition:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::[AWSアカウントID]:oidc-provider/sts.windows.net/[tenant-id]/"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "sts.windows.net/[tenant-id]/:aud": "api://[client-id]"
        }
      }
    }
  ]
}
```

⚠️ **LƯU Ý QUAN TRỌNG:**

> **Issuer URL khi tạo OIDC IdP và key Federated/StringEquals của trust policy này phải khớp nhau.**  
> Sai ở đây sẽ gây ra lỗi `InvalidIdentityToken` rất nhiều.

##### 2.3.2. Permission Policy

Chỉ định tên role đích Switch bằng `sts:AssumeRole`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": [
        "arn:aws:iam::[AWSアカウントID]:role/[Switch先IAMロール名]"
      ],
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    }
  ]
}
```

---

## Kiểm tra hoạt động

### 📊 Bước 3: Xác minh

#### 3.1. Chuẩn bị S3

Chuẩn bị S3 để kiểm tra hoạt động và upload object.

![S3 Setup](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F236355%2F0ee015dc-f894-4604-b254-ece3581208f4.jpeg)

---

#### 3.2. Chuẩn bị biến môi trường

Thiết lập biến môi trường để thực thi Functions:

```powershell
az functionapp config appsettings set `
   --name [Function名] `
   --resource-group [ResoueceGroup名] `
   --settings `
     APP_ID_URI='[アプリケーションID URI]' `
     FUNC_ROLE_ARN='[Function用IAMロールのARN]' `
     TARGET_ROLE_ARN="[Switch先IAMロールのARN]" `
     S3_BUCKET='[動作確認用S3バケット名]' `
     AWS_REGION='ap-northeast-1'
```

---

#### 3.3. Thực thi Functions

Thực thi Functions bằng lệnh sau để kiểm tra hoạt động:

```powershell
$app = "[Functions名]"
$rg = "[ResourceGroup名]"
$func = "[関数名]"

$invoke = az functionapp function show `
   --name $app `
   --resource-group $rg `
   --function-name $func `
   --query "invokeUrlTemplate" -o tsv
   
$key = az functionapp function keys list `
   --name $app `
   --resource-group $rg `
   --function-name $func `
   --query "default" -o tsv
   
Invoke-RestMethod -Method GET -Uri $invoke -Headers @{ "x-functions-key" = $key }
```

##### ✅ Kết quả:

```
  ok assumed_to keys
  -- ---------- ----
True targetrole {qiita.pptx}
```

🎉 **Thành công!** Đã lấy được danh sách object S3 từ kết quả thực thi Functions.

---

## Các điểm gặp khó khăn

### ⚠️ Vấn đề về Issuer(iss)

#### ❌ Lỗi gặp phải:

Khi chỉ định Issuer URL của OIDC IdP, tôi đã nhập OIDC endpoint v2 của Entra ID sau đây và gặp lỗi:

```
❌ SAI: login.microsoftonline.com/{tenant-id}/v2.0
```

#### ✅ Giải pháp:

Như đã đề cập ở bước 1.3, khi nhập OIDC endpoint v1 của Entra ID sau đây thì thành công:

```
✅ ĐÚNG: sts.windows.net/{tenant-id}/
```

---

### 🔍 Nguyên nhân

Hành vi này thay đổi tùy theo nội dung thiết lập trong "**Đăng ký App**" của Entra ID. 

Đặc biệt, tùy thuộc vào loại tài khoản được hỗ trợ và thiết lập quyền API, ngay cả khi yêu cầu token đối với v2 endpoint, thực tế có thể claim `iss` ở định dạng v1 (`sts.windows.net`) được trả về.

#### Các điều kiện v1 được trả về:

1. ✅ **App là "Chỉ thư mục tổ chức này"** (Single tenant)
2. ⚠️ Sử dụng Azure AD resource truyền thống (v1 API)
3. ✅ **`accessTokenAcceptedVersion` không được thiết lập rõ ràng thành 2**

---

### 📝 Phân tích trường hợp này

Trong trường hợp này, tôi sử dụng **custom Web API (Azure Functions)** và không trực tiếp sử dụng v1 API như Microsoft Graph. Do đó, không phải trường hợp 2 "Azure AD resource truyền thống".

Tuy nhiên, nếu sử dụng dịch vụ chỉ cung cấp v1 API như Microsoft Graph hoặc Azure AD Graph, thì token định dạng v1 (`sts.windows.net`) thường được trả về.

#### Kết luận:

**Điều kiện 1 và 3 đã ảnh hưởng:**

| Điều kiện | Giải thích |
|-----------|------------|
| **1. Single tenant app** | Không giống multitenant app coi trọng tương thích v2 để hỗ trợ người dùng bên ngoài và tài khoản cá nhân, single tenant app coi trọng tương thích với v1 endpoint cũ nên thường trả về v1 |
| **3. accessTokenAcceptedVersion = null** | Khi không thiết lập rõ ràng = null, thường trả về v1 |

---

### 💡 Workaround

Nếu muốn **chắc chắn sử dụng v2**, cần:

1. ✅ Thiết lập `accessTokenAcceptedVersion` thành **2** trong app manifest
2. ✅ Sử dụng **v2 endpoint** (Provider URL)
3. ✅ Chỉ định **scope** (audience)

⚠️ **Lưu ý:** Phương pháp này chưa được xác minh trong lần kiểm tra này.

---

## Tổng kết

### 🎯 Kết quả xác minh

Lần này tôi đã xác minh cấu hình thao tác AWS từ Azure Functions. Phương pháp sử dụng là **OIDC + AssumeRoleWithWebIdentity**.

---

### ✨ Lý do phương pháp này tiện lợi và dễ sử dụng

#### 1. 🔒 Không cần access key dài hạn

| Lợi ích | Chi tiết |
|---------|----------|
| ⚡ **Zero effort** | Không cần phân phối, lưu trữ, rotate |
| 🛡️ **Giới hạn rủi ro** | Mô hình credential ngắn hạn của STS |

#### 2. 🤖 Tự động hóa hoàn toàn

| Lợi ích | Chi tiết |
|---------|----------|
| 📝 **Trong code** | Lấy token trong code Azure Functions |
| 🚫 **Không cần browser** | Thao tác AWS mà không cần xác thực browser |
| 📦 **Tối ưu cho batch** | Phù hợp hoàn hảo với batch processing |

#### 3. 🎨 Cấu hình đơn giản

| Component | Azure | AWS |
|-----------|-------|-----|
| **Thiết lập** | App Registration + Managed ID | OIDC IdP + Role |
| **So với SSO** | Đơn giản hơn nhiều | Dễ triển khai hơn |

---

### 🌐 Về Multi-Cloud

Mặc dù việc sử dụng Azure và AWS riêng lẻ khá phổ biến, nhưng **liên kết multi-cloud** như thế này thực ra ít có cơ hội.

Tôi hy vọng xác minh lần này sẽ là tài liệu tham khảo cho những ai đang xem xét cấu hình tương tự.

---

## 📊 Tổng hợp Technical

### 🏗️ Architecture Components

#### Azure:
- ✅ Azure Functions (Python)
- ✅ Azure Managed Identity
- ✅ Azure App Registration (OIDC IdP)
- ✅ Entra ID (trước đây là Azure AD)

#### AWS:
- ✅ AWS IAM Identity Provider (OIDC)
- ✅ AWS IAM Role (cho Functions)
- ✅ AWS IAM Role (đích Switch - truy cập S3)
- ✅ AWS STS (Security Token Service)
- ✅ Amazon S3

---

### 🔄 Luồng xử lý

```
1. Azure Functions
   ↓ [Managed Identity]
2. Lấy OIDC Token
   ↓ [JWT]
3. AWS STS AssumeRoleWithWebIdentity
   ↓ [Temporary Credentials]
4. Functions用IAM Role
   ↓ [AssumeRole]
5. Switch先IAM Role
   ↓ [Access]
6. Amazon S3
```

---

### 🔐 Security Benefits

| Benefit | Mô tả |
|---------|-------|
| 🛡️ **Giảm thiểu rủi ro rò rỉ** | Không phân phối access key dài hạn |
| 🎯 **Least Privilege** | Dễ dàng thu hẹp quyền IAM role |
| 🔄 **Tập trung quản lý ID** | Tận dụng nền tảng xác thực Azure |
| ⏱️ **Giới hạn thời gian** | STS credential ngắn hạn (1 giờ) |
| 🤖 **Tự động hóa** | Không cần xác thực browser |

---

### 📋 Use Cases

1. ✅ **Phân tích dữ liệu AWS trên BI tool Azure**
2. ✅ **Multi-cloud với Azure Functions làm Hub**
3. ✅ **Batch processing truy cập AWS resource an toàn**
4. ✅ **Liên kết nhẹ không cần cấu hình SSO**

---

### 🆚 So sánh với SSO

| Aspect | SSO Approach | OIDC Approach (Bài viết này) |
|--------|--------------|------------------------------|
| **Công nghệ** | Entra ID + AWS Identity Center | OIDC + AssumeRoleWithWebIdentity |
| **Phù hợp cho** | Người dùng login AWS Console | Batch processing từ Azure Functions |
| **Đặc điểm** | Cấu hình nặng, chủ đạo | Nhẹ, dễ triển khai |
| **Tự động hóa** | Cần browser | Tự động hoàn toàn |
| **Độ phức tạp** | Cao | Thấp |

---

### 🛠️ Technical Specifications

| Specification | Value |
|---------------|-------|
| **Authentication Protocol** | OIDC (OpenID Connect) |
| **AWS API** | AssumeRoleWithWebIdentity |
| **Token Format** | JWT (JSON Web Token) |
| **Credential Type** | Access Key + Session Token (ngắn hạn) |
| **Session Duration** | 3600 giây (1 giờ) |
| **Programming Language** | Python |
| **Azure SDK** | azure-identity, azure-functions |
| **AWS SDK** | boto3 |

---

## 🎓 Bài học kinh nghiệm

### ✅ Điều nên làm:

1. ✅ **Kiểm tra Issuer URL kỹ lưỡng** - v1 vs v2
2. ✅ **Verify trust policy** - Federated và Condition phải khớp
3. ✅ **Test từng bước** - Token → FuncRole → TargetRole → S3
4. ✅ **Log đầy đủ** - Để debug khi có lỗi

### ❌ Điều cần tránh:

1. ❌ **Không sử dụng khóa dài hạn** - Vi phạm security best practice
2. ❌ **Không skip kiểm tra Issuer** - Nguyên nhân phổ biến của InvalidIdentityToken
3. ❌ **Không hardcode credentials** - Luôn dùng biến môi trường
4. ❌ **Không over-permission** - Tuân thủ least privilege

---

## 🙏 Lời cảm ơn

Cảm ơn bạn đã đọc đến cuối!

Nếu bạn có câu hỏi hoặc feedback, vui lòng để lại comment. 💬

---

## 🔗 Tài nguyên tham khảo

### 📚 Documentation:
- [AWS STS AssumeRoleWithWebIdentity](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html)
- [Microsoft Entra ID OIDC](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc)
- [Azure Managed Identity](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)

### 🔧 Tools:
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

---

## 📝 Thông tin bổ sung

**Ngày cập nhật:** 04/11/2025  
**Phiên bản:** 1.0  
**Trạng thái:** ✅ Đã xác minh thành công

---

**© 2025 BIPROGY株式会社**

*Tài liệu này được dịch và bổ sung từ bài viết gốc trên Qiita. Mọi code examples và technical details được giữ nguyên từ nguồn gốc.*
