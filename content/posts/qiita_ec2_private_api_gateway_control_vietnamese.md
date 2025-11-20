---
title: "Điều Khiển EC2 từ Môi Trường On-Premise qua Private API Gateway cho Tài Khoản Government Cloud Dạng Shared"
date: 2025-11-03
categories: ["AWS", "DevOps and Infrastructure", "Security and Networking"]
tags: ["API-Gateway", "EC2", "Government-Cloud", "Lambda", "VPC", "Private-Network", "FinOps"]
description: "Hướng dẫn triển khai kiến trúc điều khiển EC2 từ on-premise qua Private API Gateway. Government Cloud setup, Lambda, Cognito authentication và VPC networking."
---

# Điều Khiển EC2 từ Môi Trường On-Premise qua Private API Gateway cho Tài Khoản Government Cloud Dạng Shared

**Tác giả**: takeda_h (@takeda_h)  
**Ngày đăng**: 2025-11-03  
**Cập nhật**: 2025-11-03  
**URL gốc**: https://qiita.com/takeda_h/items/ef6e74da773769519573  

**Tags**: #AWS #APIGateway #GovernmentCloud #EC2 #Lambda #Cognito #VPC #FinOps #PrivateNetwork

**Engagement**: 👍 5 Likes | 📚 1 Stocks | 💬 0 Comments

---

## Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Bối Cảnh và Thách Thức](#bối-cảnh-và-thách-thức)
3. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
4. [Hướng Dẫn Triển Khai](#hướng-dẫn-triển-khai)
5. [Phương Pháp Thay Thế](#phương-pháp-thay-thế)
6. [Thảo Luận và Đánh Giá](#thảo-luận-và-đánh-giá)
7. [Kết Luận](#kết-luận)

---

## Giới Thiệu

Gần đây, Cơ quan Kỹ thuật số Nhật Bản (Digital Agency) đã công bố [Hướng dẫn Giảm Chi phí Vận hành Liên tục (FinOps Guide)](https://guide.gcas.cloud.go.jp/general/finops-guide). Trong tài liệu này, có đề cập đến "Ví dụ về Phương pháp Giảm thiểu Công việc Vận hành Bảo trì", trong đó khuyến nghị các chính quyền địa phương tự động hóa nội bộ các tác vụ như khởi động và dừng dịch vụ.

Trong bối cảnh di chuyển Government Cloud của các chính quyền địa phương, AWS thường sử dụng EC2 hoặc ECS cho các ứng dụng, do đó việc khởi động/dừng dịch vụ ở đây có nghĩa là khởi động/dừng EC2 instances hoặc ECS tasks.

---

## Bối Cảnh và Thách Thức

### Thách Thức của Mô Hình Shared trong Government Cloud

Tuy nhiên, trong Government Cloud, vì các chính quyền địa phương không tự quản lý tài khoản public cloud mà để các nhà cung cấp dịch vụ quản lý theo **"mô hình shared (共同利用方式)"**, nên nhân viên chính quyền khó có thể thực hiện các thao tác khởi động/dừng dịch vụ.

Government Cloud có tính năng xác thực và phân quyền được cung cấp bởi nền tảng **GCAS**. Với AWS, có thể truy cập vào permission set của tài khoản qua single sign-on của IAM Identity Center, nhưng trong mô hình shared, chỉ có GCAS account của nhà cung cấp dịch vụ mới được phép truy cập.

### Các Vấn Đề Cụ Thể

1. **Hạn Chế Quyền Truy Cập**
   - Nhân viên chính quyền không thể thao tác resources của AWS account dạng shared từ GCAS account của họ qua Management Console hoặc AWS CLI

2. **Ràng Buộc của Mạng Riêng Tư**
   - Môi trường Government Cloud của chính quyền cơ bản là mạng riêng tư (閉域), do đó không thể thao tác EC2 instances từ Systems Manager qua Internet

### Hướng Giải Quyết

Vì vậy, đối với trường hợp AWS, tôi đã nghiên cứu kiến trúc để **nhân viên chính quyền có thể tự mình thực hiện các thao tác khởi động/dừng EC2 instances trong VPC riêng tư của tài khoản dạng shared**, và đã thực hiện kiểm chứng trong môi trường cá nhân.

---

## Tổng Quan Kiến Trúc

### Concept của Kiến Trúc

Cụ thể, trong tài khoản dạng shared, tạo một **Lambda function có khả năng thực hiện thao tác khởi động/dừng EC2 instances và cho phép thực thi qua API Gateway, sau đó cho phép truy cập API Gateway này từ môi trường on-premise riêng tư của chính quyền địa phương qua VPC endpoint**.

Ý tưởng là tạo script để có thể truy cập API từ PowerShell, và nhân viên chính quyền thực hiện thao tác khởi động/dừng từ script đó.

### Các Thành Phần Chính

- **Lambda Function**: Thực thi khởi động/dừng EC2 instances
- **API Gateway (Private)**: Cho phép thực thi Lambda function từ mạng riêng tư
- **VPC Endpoint (Interface)**: execute-api endpoint
- **Cognito User Pool**: Xác thực người dùng cho việc truy cập API
- **Route 53 Inbound Endpoint**: Liên kết với DNS on-premise

### Điều Kiện Tiên Quyết

- DNS server của môi trường on-premise chính quyền địa phương và Route 53 Inbound Endpoint của VPC đã được liên kết
- Khi deploy API Gateway vào VPC, có thể resolve tên endpoint của API Gateway từ môi trường on-premise chính quyền địa phương
- Tất cả resources được deploy tại **Tokyo Region (ap-northeast-1)**

### Sơ Đồ Kiến Trúc

![Architecture Diagram](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Fbc557318-76af-4737-b8f3-ded3a1fbfe90.png)

Kiểm soát truy cập của API Gateway sẽ được giải thích chi tiết sau. Bây giờ hãy bắt đầu xây dựng.

---

## Hướng Dẫn Triển Khai

## Bước 1: Tạo Lambda Function

### Tạo Lambda Function để Khởi động/Dừng EC2 Instances

Lambda function sử dụng boto3 client của Python để truy cập EC2 API và cho phép khởi động/dừng các EC2 instances đích.

Vì chỉ thao tác EC2 API, **không cần liên kết Lambda function với VPC**.

### Tạo IAM Role cho Lambda Function

Tạo IAM policy sau đây và gán vào IAM role làm execution role của Lambda để cho phép Lambda function thực hiện thao tác khởi động/dừng EC2.

Cũng cho phép `ec2:DescribeInstanceStatus` để có thể lấy trạng thái khởi động/dừng của instances.

#### Trusted Entity

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### Permissions Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstanceStatus"
      ],
      "Resource": "*",
      "Effect": "Allow"
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
```

### Cấu Hình Thời Gian Timeout cho Lambda Function

Vì thời gian timeout mặc định không đủ để xử lý, nên đã thay đổi thành khoảng **30 giây**.

### Code của Lambda Function

Code thực tế như sau. Truyền JSON dưới đây vào event. Set `Start` vào key `Action` để khởi động instance, set `Stop` để dừng.

**Định dạng Event**:
```json
{"Action": "Start | Stop"}
```

Sau khi thao tác EC2 API để khởi động hoặc dừng, function sẽ trả về trạng thái của instances.

Cũng có implement xử lý retry, nhưng không rõ hiệu quả như thế nào trong trường hợp xảy ra `InsufficientInstanceCapacity` Error.

```python
import time
import boto3
import botocore
from botocore.config import Config

# Cấu hình số lần retry khi có lỗi
config = Config(retries={"total_max_attempts": 10, "mode": "standard"})

# Chỉ định region của EC2
region = "ap-northeast-1"

# Liệt kê các instance ID đích vào list
instances = [
    "ID của instance đích",
]

def lambda_handler(event, context):
    ec2 = boto3.client("ec2", config=config, region_name=region)
    action = event["Action"]
    instance_states = dict()

    try:
        if action == "Start":
            ec2.start_instances(InstanceIds=instances)
        elif action == "Stop":
            ec2.stop_instances(InstanceIds=instances)
        else:
            return {
                "statusCode": 200,
                "body": "Action parameter không hợp lệ.",
            }

        time.sleep(15)
        statuses = ec2.describe_instance_status(InstanceIds=instances, IncludeAllInstances=True)
        for status in statuses["InstanceStatuses"]:
            instance_states[status["InstanceId"]] = status["InstanceState"]["Name"]

        return {
            "statusCode": 200,
            "body": {
                "Action": action,
                "States": instance_states,
            },
        }

    except botocore.exceptions.ClientError as error:
        return {
            "statusCode": 503,
            "body": error.response["Error"]["Message"],
        }
```

Sau khi test Lambda function thành công, tiếp tục cho phép thực thi Lambda function qua API Gateway.

---

## Bước 2: Tạo API Gateway

### Tạo API Gateway để Thực Thi Lambda Function từ Mạng Riêng Tư

### Tạo Interface VPC Endpoint

Để deploy API Gateway với endpoint type là private (riêng tư), cần tạo trước Interface VPC endpoint sau:

- `com.amazonaws.ap-northeast-1.execute-api`

⚠️ **Lưu Ý Quan Trọng**:
Khi deploy API Gateway ở chế độ private, nếu không cấu hình riêng với Route 53, chỉ có thể resolve tên từ VPC đã deploy. Do đó, **để client on-premise có thể resolve tên, cần forward có điều kiện các query resolve tên amazonaws.com tới Route 53 Inbound Endpoint**.

### Tạo REST API

Từ Management Console của API Gateway, tạo REST API. Set API endpoint type là "**Private**" và chỉ định VPC endpoint đã tạo ở trên.

![REST API Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F0932aaf4-4947-4b33-b615-29db70ec878e.png)

### Tạo Method

Chỉ định method type là "**POST**", integration type là "**Lambda function**", và Lambda function là function đã tạo ở trên.

![Method Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Ff41df106-6b55-4676-a8bc-56e5d412b5e4.png)

### Tạo Access Control bằng Resource Policy

Private API Gateway **không thể deploy nếu không áp dụng resource policy**.

Do đó, đã tạo resource policy sau để chỉ cho phép truy cập API Gateway từ VPC đã deploy VÀ từ địa chỉ IP nguồn cụ thể của on-premise.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/*",
      "Condition": {
        "StringNotEquals": {
          "aws:SourceVpc": "VPC ID nơi deploy"
        }
      }
    },
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/*",
      "Condition": {
        "NotIpAddress": {
          "aws:VPCSourceIp": "Địa chỉ IP của client on-premise"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/*"
    }
  ]
}
```

### Deploy và Test API cho Lambda

Deploy API. Set stage name tùy ý (ở đây dùng "**v1**").

![API Deployment](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Fc87f31f9-5724-4ad1-9a4c-47dcc092b867.png)

Sau khi deploy, URL endpoint sẽ hiển thị trong "Stage Details" của "Stages" trong Management Console, hãy truy cập endpoint đó bằng POST từ bất kỳ client nào.

```bash
# Xử lý khởi động
$ curl -w'\n' -X POST "https://hoge.execute-api.ap-northeast-1.amazonaws.com/v1" -H "Content-Type: application/json" -d '{"Action": "Start"}'

# Xử lý dừng
$ curl -w'\n' -X POST "https://hoge.execute-api.ap-northeast-1.amazonaws.com/v1" -H "Content-Type: application/json" -d '{"Action": "Stop"}'
```

![Test Result](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F641e7dcd-4b33-4276-8b22-1933971b919f.png)

Nếu nhận được giá trị mong đợi đã set trong Lambda function thì test thành công.

Khi thực thi từ client có địa chỉ IP không được cho phép trong resource policy, sẽ trả về lỗi.

![Access Denied](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Fee673f58-7c1b-4932-a8ec-5c2010e2a277.png)

Nếu tạo script bằng Bash hoặc PowerShell và thực thi từ terminal có địa chỉ IP đã chỉ định của on-premise, có thể khởi động/dừng EC2 instances qua mạng riêng tư mà không cần thao tác trực tiếp EC2 API.

Đến đây đã có **chức năng tối thiểu**.

---

## Bước 3: Tạo Cognito User Pool

### Tạo Cognito User Pool để Kiểm Soát Truy Cập API Lambda

API đã tạo đến giờ chỉ có access control bằng **địa chỉ IP nguồn** nên còn yếu.

Do đó, sẽ **sử dụng Cognito User Pool để thiết lập xác thực người dùng cho việc truy cập API**.

⚠️ **Lưu Ý Quan Trọng**:
- Hiện tại Cognito **không hỗ trợ Interface VPC endpoint** nên không thể sử dụng trực tiếp từ VPC riêng tư
- Tuy nhiên, **có thể sử dụng Cognito từ VPC riêng tư bằng cách tích hợp với API Gateway**
- Cần lưu ý rằng **thông tin xác thực của Cognito sẽ đi qua mạng global của AWS**
- Ngoài ra, vì chưa kiểm chứng trong môi trường Government Cloud thực tế nên có thể không sử dụng được

Về xác thực người dùng trong mạng riêng tư của AWS, đã tham khảo blog của AWS.

### Tạo User Pool

Từ Management Console của Cognito, tạo user pool.

Application type chọn "**Single Page Application (SPA)**". Vì mục đích kiểm chứng nên **không enable self-registration** và tạo user directory.

![User Pool Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F8ed32ba1-3a4d-42ab-b249-997e0e0e0a6f.png)

Sau khi tạo user pool, edit thông tin "Application Client" và **enable xác thực bằng username và password (USER_PASSWORD_AUTH)**.

![Enable USER_PASSWORD_AUTH](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F1f30ed15-5e96-4fc5-95bc-cf631bab502a.png)

### Tạo User

Tạo user với địa chỉ email tùy ý làm username. Password là tạm thời nên set tùy ý (cần tuân thủ policy).

![User Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Ff74d8dc4-7315-4314-85c8-0ed9e97e17d4.png)

Ngay sau khi tạo user, status của password là **chưa xác nhận**.

![Password Unconfirmed](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F32fded93-df2b-4c86-8cd1-ea8dcdd3b8da.png)

Do đó, tạm thời set password của user (ví dụ "`Passw0rd!`") bằng lệnh AWS CLI.

```bash
$ aws cognito-idp admin-set-user-password \
  --region ap-northeast-1 \
  --user-pool-id "User Pool ID" \
  --username "Địa chỉ email đã set làm username" \
  --password Passw0rd! \
  --permanent \
  --profile "Profile name"
```

Status của password đã chuyển sang "**đã xác nhận**" nên có thể xác thực được.

![Password Confirmed](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F79ed588c-f529-416f-8349-97077591f5a1.png)

---

## Bước 4: Tạo Cognito API Gateway

### Tạo API Gateway để Truy Cập Cognito từ VPC Riêng Tư

### Tạo IAM Role để API Gateway Thao Tác Cognito

Tạo IAM role sau để cho phép API Gateway thao tác Cognito.

#### Trusted Entity

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### Permissions Policy

Đã set các AWS managed policy có ARN sau vào permissions policy.

- `arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs`
- `arn:aws:iam::aws:policy/AmazonCognitoPowerUser`

### Tạo REST API

Vì Interface VPC endpoint của API Gateway đã được tạo, có thể tạo REST API để truy cập Cognito từ VPC riêng tư.

### Tạo Resource

Trong REST API đã tạo, tạo resource với tên resource là "**initiate-auth**".

![Resource Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Faa1c715c-43b5-45e7-ab6f-4652def7fa62.png)

### Tạo Method

Tạo method cho resource đã tạo. Khác với method đã tạo trước, integration type chọn "**AWS Service**", chọn AWS region và service (**Cognito IDP**). Action type của action name là "**InitiateAuth**", execution role chọn IAM role đã tạo ở trên.

![Cognito Method Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F2e37b903-5196-4af7-b62b-feb2e6811958.png)

### Tạo Resource Policy và Deploy API

Cấu hình resource policy tương tự như API của Lambda, và deploy API.

### Test Cognito API

Gửi request tới API từ client có địa chỉ IP nguồn đã set trong resource policy.

```bash
$ curl -w'\n' -X POST "https://fuga.execute-api.ap-northeast-1.amazonaws.com/v1/initiate-auth" \
  -H "Content-Type: application/json" \
  -d '{
    "AuthFlow": "USER_PASSWORD_AUTH",
    "AuthParameters": {
      "USERNAME": "Username đã tạo trong Cognito",
      "PASSWORD": "Passw0rd!"
    },
    "ClientId": "Application Client ID của Cognito"
  }'
```

Output khá dài nên bỏ qua, nhưng **nếu nhận được ID Token thì test thành công**.

Bây giờ tiếp tục thiết lập xác thực token với Cognito cho API thực thi Lambda đã tạo ban đầu.

---

## Bước 5: Thiết Lập Token Authentication

### Thiết Lập Token Authentication cho API Thực Thi Lambda

### Tạo Cognito Authorizer

Từ Management Console, chọn API thực thi Lambda đã tạo ban đầu và tạo authorizer.

Authorizer type chọn "**Cognito**", Cognito user pool chọn pool đã tạo ở trên, token source chọn "**Authorization**".

![Authorizer Creation](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Ff839dcc8-7ad0-4e56-b030-3f127fd2963d.png)

Edit method đã tạo, set "Authorization" trong cấu hình method request thành authorizer ở trên.

![Method Authorization](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Fe26d7ab6-fefe-47f7-97f6-8d44ac8a50f5.png)

Sau khi cấu hình xong, deploy API. Như vậy, API thực thi Lambda **không thể thực thi nếu không set giá trị ID Token lấy được từ xác thực Cognito vào HTTP header của request**.

### Test Authorizer

Test API của Cognito, extract **Token ID** từ response nhận được và paste vào "Token value" để test.

![Authorizer Test](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Ffe6552c5-6d3a-4d6a-b3b8-9e1b65ff5494.png)

Nếu nhận được claims thì test thành công.

### Lấy Token từ Cognito API và Thực Thi API Lambda từ Client

Thực tế truy cập API từ client bằng Curl.

Đầu tiên truy cập Cognito API để lấy ID Token, sau đó set tạm vào biến môi trường và sử dụng khi tạo request tới API thực thi Lambda.

```bash
# Truy cập Cognito API để lấy ID Token
$ curl -w'\n' -X POST "https://fuga.execute-api.ap-northeast-1.amazonaws.com/v1/initiate-auth" \
  -H "Content-Type: application/json" \
  -d '{
    "AuthFlow": "USER_PASSWORD_AUTH",
    "AuthParameters": {
      "USERNAME": "Username đã tạo trong Cognito",
      "PASSWORD": "Passw0rd!"
    },
    "ClientId": "Application Client ID của Cognito"
  }'

# Set ID Token vào biến môi trường
$ TOKEN="Paste giá trị ID Token"

# Request tới API thực thi Lambda
$ curl -w'\n' -X POST "https://hoge.execute-api.ap-northeast-1.amazonaws.com/v2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"Action": "Start"}'
```

![End to End Test](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2F847f6588-b84e-4997-b83d-e7ad9ae936bc.png)

Đã xác nhận rằng khi không set token vào HTTP header sẽ có **lỗi xác thực**, và khi set token sẽ **nhận được giá trị mong đợi**.

Như vậy **tất cả các API đã hoàn thành**. Tiếp theo sẽ tích hợp vào script để nhân viên chính quyền có thể sử dụng trong vận hành.

---

## Bước 6: Tạo PowerShell Script

### Cho Phép Khởi động/Dừng EC2 Instances từ PowerShell

Dưới đây là mẫu script để khởi động/dừng EC2 instances từ PowerShell sử dụng các API đã tạo.

**test.ps1**:
```powershell
$ErrorActionPreference = "Stop"

# Endpoint của API Gateway tích hợp với Cognito
$authApiUrl = "https://fuga.execute-api.ap-northeast-1.amazonaws.com/v1/initiate-auth"

# Username và password đã tạo trong Cognito User Pool
$userName = "admin@localhost"
$password = "Passw0rd!"

# Cognito Application Client ID
$clientId = "xyz123"

# Endpoint của API Gateway tích hợp với Lambda
$execApiUrl = "https://hoge.execute-api.ap-northeast-1.amazonaws.com/v2"

# Chỉ định Start để khởi động, Stop để dừng
$Action = "Start"

# Xử lý lấy Bearer Token từ Cognito
# Tạo chuỗi JSON để truyền vào Request Body
$authRequestBody = '{"AuthFlow": "USER_PASSWORD_AUTH", "AuthParameters": {"USERNAME": "' + $userName + '", "PASSWORD": "' + $password + '"}, "ClientId": "' + $clientId + '"}'

# Request tới endpoint API Gateway tích hợp với Cognito
$authResponse = Invoke-WebRequest $AuthApiUrl -Method "Post" -Headers @{"Content-Type" = "application/json" } -Body $authRequestBody | ConvertFrom-Json

# Extract chuỗi ID Token từ giá trị trả về
$idToken = $authResponse.AuthenticationResult.IdToken

# Xử lý khởi động hoặc dừng EC2 từ Lambda
# Tạo chuỗi JSON để truyền vào Request Body
$execRequestBody = '{"Action": "' + $Action + '"}'

# Request tới endpoint API Gateway tích hợp với Lambda
Invoke-WebRequest $execApiUrl -Method "Post" -Headers @{"Content-Type" = "application/json"; "Authorization" = "Bearer ${idToken}" } -Body $execRequestBody
```

Khi thực thi script sẽ có output như sau.

![PowerShell Execution](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F443658%2Fb96d3524-03e3-42aa-adad-108c130399cb.png)

Như vậy có thể **khởi động/dừng EC2 instances trong tài khoản dạng shared từ PowerShell script**.

---

## Phương Pháp Thay Thế

### Một Phương Pháp Khác (Thao Tác EC2 API qua Bastion EC2)

Lần này đã kiểm chứng kiến trúc thực thi EC2 API từ Lambda qua API Gateway.

Thực ra, với điều kiện có kết nối mạng trong mạng riêng tư, có một phương pháp khác có thể thực hiện.

**Chuẩn bị bastion EC2 trong VPC của tài khoản dạng shared có thể remote connect từ on-premise chính quyền địa phương, attach IAM role có quyền tương tự đã set cho Lambda function vào EC2 này, thì có thể truy cập EC2 API từ AWS CLI của EC2 và thực hiện khởi động/dừng instances**.

⚠️ **Vấn Đề Bảo Mật**:
Tuy nhiên, **việc để nhân viên chính quyền remote connect vào server một cách dễ dàng có vấn đề bảo mật nghiêm trọng nên không nên làm** (nếu tôi là người hỗ trợ quản lý vận hành thì sẽ không cho phép).

---

## Thảo Luận và Đánh Giá

### Liệu Nhân Viên Chính Quyền Có Nên Khởi động/Dừng EC2 Instances?

Mục đích lớn nhất của lần kiểm chứng này là **muốn xác nhận kiến trúc nào có thể thực hiện khi đưa nội dung hướng dẫn FinOps của Digital Agency vào triển khai thực tế**.

**Cá nhân tôi phản đối việc nhân viên chính quyền thường xuyên thực hiện khởi động/dừng EC2 instances**.

#### Lý Do Phản Đối

1. **Độ Phức Tạp của Quy Trình Vận Hành**
   - Khi khởi động/dừng server, cần có các bước xem xét trước như dừng service, backup dữ liệu, v.v.

2. **Tính Không Chắc Chắn của Cloud**
   - Do đặc tính của public cloud, cần xem xét khả năng API không thể thực thi bình thường do các nguyên nhân không lường trước như thiếu resources

### Vậy Nhân Viên Chính Quyền Có Thể Làm Được Gì?

Mặt khác, **có khả năng giảm chi phí nếu nhân viên chính quyền tự động hóa một phần vận hành**.

Đây là vấn đề rất khó, vì khi nói về việc nhân viên chính quyền có thể tự động hóa vận hành cloud đến đâu, **tình hình mỗi chính quyền địa phương khác nhau nên không có câu trả lời chung**.

Khi cần nghĩ xem có thể làm gì và không thể làm gì, **việc người ở hiện trường như tôi thực hiện PoC và feedback những điều nhận thấy có lẽ có ý nghĩa nhất định**, và tôi muốn tiếp tục học hỏi nhiều điều hơn nữa.

Thay cho báo cáo tham dự [Gov-JAWS lần thứ 4](https://gov-jaws.connpass.com/event/371566/), tôi đã viết bài này dựa trên những suy nghĩ của bản thân từ hướng dẫn FinOps. **Cố gắng lên!**

---

## Kết Luận

### 🎯 Các Điểm Chính

1. **Khả Năng Thực Hiện Kỹ Thuật**
   - Tồn tại phương pháp kỹ thuật để điều khiển EC2 từ mạng riêng tư ngay cả trong mô hình shared của Government Cloud

2. **Các Thành Phần Kiến Trúc**
   - Kết hợp API Gateway (Private) + Lambda + Cognito cho phép truy cập API an toàn từ mạng riêng tư
   - Liên kết VPC Endpoint và Route 53 Inbound Endpoint cho phép truy cập closed API từ on-premise

3. **Biện Pháp Bảo Mật**
   - Access control bằng VPC và IP nguồn qua resource policy
   - Tăng cường bảo mật bằng cách thêm token authentication với Cognito
   - Nguyên tắc least privilege dựa trên IAM role

4. **Xem Xét Về Vận Hành**
   - Thực hiện workflow vận hành mà nhân viên chính quyền có thể thao tác bằng PowerShell script
   - Cần xem xét thận trọng về mặt vận hành và bảo mật dù có thể thực hiện về mặt kỹ thuật
   - Phạm vi tự động hóa nội bộ khác nhau tùy theo tình hình của từng chính quyền địa phương

### 🔧 Điểm Nổi Bật Kỹ Thuật

- Đối ứng mạng riêng tư bằng Private API Gateway
- Chức năng xác thực từ mạng riêng tư bằng tích hợp Cognito và API Gateway
- Implement xử lý retry trong Lambda function (đối phó với InsufficientInstanceCapacity Error)
- Phòng thủ nhiều tầng bằng resource policy
- Sử dụng VPC Endpoint (execute-api)
- Script tự động hóa vận hành bằng PowerShell

### 📚 Tài Liệu Tham Khảo

- [Digital Agency - Hướng dẫn Giảm Chi phí Vận hành Liên tục (FinOps Guide)](https://guide.gcas.cloud.go.jp/general/finops-guide)
- [Gov-JAWS lần thứ 4](https://gov-jaws.connpass.com/event/371566/)
- AWS Blog - Xác thực người dùng trong mạng riêng tư

### ⚠️ Lưu Ý Quan Trọng

- Thông tin xác thực của Cognito đi qua mạng global của AWS
- Không đảm bảo hoạt động trong môi trường Government Cloud thực tế
- Cần xem xét thận trọng về vận hành và quản lý quyền phù hợp
- Quan trọng là phán đoán mức độ tự động hóa nội bộ phù hợp theo tình hình của chính quyền địa phương

### 💡 Key Takeaways

- Tồn tại phương pháp kỹ thuật để điều khiển EC2 từ mạng riêng tư trong mô hình shared Government Cloud
- Cần cân bằng giữa khả năng kỹ thuật và yêu cầu vận hành thực tế
- Bảo mật và kiểm soát truy cập là ưu tiên hàng đầu
- PoC và feedback từ hiện trường có giá trị cao
- Không có giải pháp one-size-fits-all cho mọi chính quyền địa phương

---

**Nếu bài viết này hữu ích, hãy like và stock nhé!** 👍📚

**Nếu có câu hỏi hoặc comments, đừng ngại chia sẻ!** 💬
