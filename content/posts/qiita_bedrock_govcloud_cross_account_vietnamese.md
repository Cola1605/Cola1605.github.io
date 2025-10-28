---
title: "Truy cập Bedrock Third-Party Model từ VPC đóng của Government Cloud thông qua Cross-Account Access"
date: 2025-10-26
draft: false
categories: ["AWS", "AI", "Security"]
tags: ["Amazon-Bedrock", "Government-Cloud", "Cross-Account", "VPC-Endpoint", "Claude", "AWS-Security", "Multi-Account"]
description: "Hướng dẫn triển khai kiến trúc đa tài khoản để sử dụng Amazon Bedrock Third-Party Model từ môi trường VPC đóng của Government Cloud Nhật Bản."
---

**Nguồn:** [Qiita - takeda_h](https://qiita.com/takeda_h/items/f2bc07154a74f00894e2)  
**Tác giả:** takeda_h  
**Ngày đăng:** 26/10/2025  
**Tags:** #AWS #Bedrock #GovernmentCloud

---

## Tổng quan

Bài viết này trình bày cách triển khai kiến trúc đa tài khoản để sử dụng Amazon Bedrock Third-Party Model (Claude Haiku 4.5) từ môi trường VPC đóng của Government Cloud Nhật Bản. Tác giả đã xây dựng môi trường AWS đa tài khoản để mô phỏng Government Cloud và kiểm chứng khả năng truy cập Bedrock từ subnet riêng tư thông qua cross-account access.

---

## Bối cảnh và Động lực

Tác giả đã nghe nhiều câu chuyện về kiến trúc sử dụng Amazon Bedrock trong môi trường Government Cloud để ứng dụng AI sinh tạo. Tuy nhiên, muốn hiểu cụ thể cấu hình hạ tầng cần thiết để chính quyền địa phương có thể sử dụng Bedrock API từ môi trường đóng của Government Cloud.

Sau khi đọc lại blog về ứng dụng AI sinh tạo của công ty Osaki Computer Engineering, tác giả quyết định tự xây dựng môi trường AWS đa tài khoản mô phỏng Government Cloud để kiểm chứng.

---

## Các ràng buộc của Government Cloud

### 1. Truy cập Bedrock API qua VPC Endpoint

Môi trường Government Cloud dành cho chính quyền địa phương cơ bản là VPC đóng, do đó cần tạo Interface VPC Endpoint cho Bedrock trong private subnet và truy cập Bedrock API qua VPC Endpoint.

### 2. Cross-account access do không thể sử dụng Third-Party Model trực tiếp

Tài khoản chính quyền địa phương trong Government Cloud có giới hạn về việc sử dụng model của Bedrock, cụ thể là không thể sử dụng Third-Party Model như Claude của Anthropic.

Theo thông tin từ workshop, môi trường Government Cloud có nhiều ràng buộc riêng, để đưa AI vào cần vượt qua các ràng buộc đó. Cụ thể, tài khoản trên Government Cloud không thể sử dụng trực tiếp Amazon Bedrock do vấn đề hợp đồng và chính sách. Để triển khai, cần có sự cho phép của chính quyền địa phương, đảm bảo mức độ bảo mật tương đương với tài khoản Government Cloud, và sử dụng Bedrock thông qua cấu hình cross-account.

Do đó, để tài khoản chính quyền địa phương sử dụng Bedrock Third-Party Model, cần thực hiện theo phương pháp sau:

1. Chuẩn bị tài khoản AWS không thuộc Government Cloud (gọi là tài khoản nhà thầu)
2. Kích hoạt Third-Party Model trong Bedrock của tài khoản nhà thầu
3. Tạo IAM role cho phép truy cập vào model này trong tài khoản nhà thầu
4. Tài khoản chính quyền Assume Role vào IAM role của tài khoản nhà thầu để cross-account access vào Bedrock

### 3. Giới hạn Cross-region inference trong nội địa Nhật Bản

Government Cloud có ràng buộc không thể sử dụng region ngoài Nhật Bản, do đó cross-region inference của Bedrock cũng cần giới hạn trong nước.

Trong kiểm chứng này, tác giả chọn model Anthropic Claude Haiku 4.5 và sử dụng inference profile JP Claude Haiku 4.5 để giới hạn cross-region inference ở Tokyo và Osaka.

**Lưu ý quan trọng:** Khi sử dụng Claude của Anthropic, có các điểm cần chú ý bổ sung về hợp đồng. Khi thực hiện thực tế, hãy tham vấn kỹ lưỡng với người phụ trách AWS và nhất định phải xử lý vấn đề hợp đồng.

---

## Tổng quan kiến trúc kiểm chứng

Mục tiêu của kiểm chứng này là sử dụng 2 tài khoản (tài khoản chính quyền mô phỏng và tài khoản nhà thầu mô phỏng), truy cập Bedrock API từ private subnet của tài khoản chính quyền, và có thể sử dụng model của tài khoản nhà thầu thông qua cross-account access.

Điểm quan trọng ở phía tài khoản nhà thầu là:
- Kích hoạt Third-Party Model trong Bedrock
- Tạo IAM role để cho phép cross-account access từ tài khoản chính quyền

Ở phía tài khoản chính quyền:
- Cài đặt boto3 (Python SDK) trên EC2 (Amazon Linux 2023)
- Xác nhận có thể truy cập Bedrock từ boto3 client

**Sách tham khảo:** Đối với phát triển thực tế sử dụng Bedrock, tác giả khuyên dùng sách "AI Agent Development & Operations Guide" xuất bản bởi SB Creative.

---

## Cấu hình môi trường kiểm chứng

### Tài khoản nhà thầu

**Mục đích:** Tạo môi trường có thể truy cập Bedrock model từ IAM role

#### 1. Kích hoạt model access

Tính đến ngày 26/10/2025, không còn cần phải kích hoạt model access riêng lẻ, màn hình trên Management Console cũng đã được đánh dấu là retired. Tuy nhiên, khi sử dụng model của Anthropic, vẫn cần đăng ký như trước đây.

Nếu truy cập API mà không đăng ký, sẽ nhận được lỗi access denied. Khi sử dụng model lần đầu, form đăng ký sẽ xuất hiện, do đó hãy chọn Claude Haiku 4.5 từ Model Catalog và mở Playground. Điền mục đích sử dụng vào form đăng ký. Khi đăng ký được phê duyệt, AWS sẽ gửi email thông báo.

#### 2. Tạo Interface Endpoint cho Bedrock API

Tạo Interface VPC Endpoint trong private subnet để EC2 trong private subnet có thể truy cập Bedrock API.

Trong kiểm chứng này, chỉ cần xác nhận có thể sử dụng InvokeModel API và Converse API, do đó chỉ cần tạo endpoint sau:

- `com.amazonaws.ap-northeast-1.bedrock-runtime`

#### 3. Tạo IAM role để cross-account access

Tạo IAM role được cấp quyền cần thiết để sử dụng Claude Haiku 4.5. IAM role này cũng cần thiết lập để tài khoản chính quyền có thể Assume Role.

##### a) Tạo IAM policy cho phép truy cập foundation model và inference profile

Tạo IAM policy như sau để attach vào IAM role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel"],
      "Resource": [
        "arn:aws:bedrock:ap-northeast-1::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0",
        "arn:aws:bedrock:ap-northeast-3::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0",
        "arn:aws:bedrock:ap-northeast-1:[contractor-account-id]:inference-profile/jp.anthropic.claude-haiku-4-5-20251001-v1:0"
      ]
    }
  ]
}
```

Cho phép thực thi `bedrock:InvokeModel` từ ARN của foundation model Claude Haiku 4.5 ở Tokyo và Osaka. Vì lần này sử dụng cross-region inference giới hạn trong nội địa, cũng cho phép ARN của inference profile này. ARN của inference profile có thể xác nhận từ mục Inference Profiles trên Management Console.

##### b) Thêm permission policy cho Bedrock API

Vì kiểm chứng này chỉ đến mức truy cập Bedrock API, nên thêm AWS managed policy `AmazonBedrockLimitedAccess` vào permission policy.

##### c) Thêm permission policy cho truy cập ban đầu vào Marketplace

Khi truy cập model lần đầu, cần có quyền đọc Marketplace. Nếu không có quyền này khi truy cập API, sẽ nhận được lỗi. Do đó, đã thêm AWS managed policy `AWSMarketplaceRead-only` vào permission policy của IAM role.

##### d) Cài đặt trust policy cho phép Assume Role từ tài khoản chính quyền

Cài đặt trust policy như sau để IAM role của tài khoản chính quyền có thể Assume Role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::[municipality-account-id]:role/[municipality-iam-role]"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### 4. Cài đặt cho truy cập model lần đầu

##### a) Deploy EC2 vào private subnet và attach IAM role

Khởi động EC2 instance Amazon Linux 2023 trong private subnet và attach IAM role đã tạo.

##### b) Tạo S3 Gateway Endpoint

Deploy S3 Gateway Endpoint vào private subnet để có thể cài đặt pip bằng dnf từ Amazon Linux 2023 trong private subnet. Nhờ đó, dnf có thể cài đặt package qua S3.

##### c) Tạo CodeArtifact Interface Endpoint

Tạo Interface VPC Endpoint của CodeArtifact trong private subnet để có thể cài đặt pip package trên EC2 trong private subnet.

Các endpoint cần thiết:
- `com.amazonaws.ap-northeast-1.codeartifact.api`
- `com.amazonaws.ap-northeast-1.codeartifact.repositories`

Có thể xóa sau khi cài đặt boto3 xong.

##### d) Cài đặt python3-pip

Cài đặt python3-pip bằng dnf:

```bash
$ sudo dnf install python3-pip
```

##### e) Tạm thời thêm quyền đọc CodeArtifact vào IAM role

Tạm thời thêm AWS managed policy `AWSCodeArtifactReadOnlyAccess` vào IAM role. Có thể xóa khỏi permission policy sau khi cài đặt boto3 xong.

##### f) Tạo repository trong CodeArtifact với PyPi Store làm upstream

Để cài đặt boto3 bằng pip từ EC2 trong private subnet không thể kết nối internet, tạo repository trong CodeArtifact với PyPi Store làm upstream.

Từ Management Console, tiến hành "Create repository", chọn "pypi-store" làm upstream repository. Cài đặt tên domain phù hợp. Sau khi tạo repository, chọn repository đó từ Management Console và tiến hành "View connection instructions".

##### g) Cài đặt boto3

Thực thi lệnh đã xác nhận trên console của EC2:

```bash
$ aws codeartifact login --tool pip --repository [repository-name] --domain [domain-name] --domain-owner [contractor-account-id] --region ap-northeast-1
```

Nhờ đó, tạm thời có thể cài đặt package từ PyPi Store bằng pip. Tiếp theo, cài đặt boto3 bằng pip:

```bash
$ pip install boto3
```

#### 5. Thực hiện truy cập lần đầu vào Claude Haiku 4.5

Kiêm test Bedrock, thử truy cập lần đầu vào Claude Haiku 4.5 bằng Python code sau:

```python
import boto3

client = boto3.client("bedrock-runtime", region_name="ap-northeast-1")

response = client.converse(
    modelId="jp.anthropic.claude-haiku-4-5-20251001-v1:0",
    messages=[
        {
            "role": "user",
            "content": [{"text": "こんにちは"}]
        }
    ]
)

print(response)
```

Điểm quan trọng là phần model ID. Lần này để cross-region inference giới hạn trong nước với inference profile, không chỉ định model ID của Claude Haiku 4.5 mà chỉ định ID của JP Claude Haiku 4.5 inference profile (`jp.anthropic.claude-haiku-4-5-20251001-v1:0`).

Đây chỉ là code xuất response ra standard output, nhưng nếu thành công sẽ nhận được output như sau. Nhờ đó, IAM role đã tạo có thể truy cập Claude Haiku 4.5 model.

EC2 instance và VPC Endpoint đã tạo trong tài khoản nhà thầu có thể xóa. Còn lại chỉ cần tạo VPC Endpoint cho STS và Bedrock-Runtime trong tài khoản chính quyền, rồi Assume Role vào IAM role đã thực thi Bedrock API trong tài khoản nhà thầu.

---

### Tài khoản chính quyền

#### 1. Tạo Interface Endpoint cho Bedrock API

Tương tự như tài khoản nhà thầu, tạo Interface VPC Endpoint sau:

- `com.amazonaws.ap-northeast-1.bedrock-runtime`

#### 2. Tạo STS Regional Endpoint

Tương tự, tạo Interface VPC Endpoint sau vào private subnet có EC2 instance làm boto3 client:

- `com.amazonaws.ap-northeast-1.sts`

#### 3. Tạo IAM role để cross-account access vào tài khoản nhà thầu

##### a) Cho phép Assume Role vào tài khoản nhà thầu

Tạo IAM policy cho phép Assume Role vào tài khoản nhà thầu như sau và attach vào IAM role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Action": ["sts:AssumeRole"],
      "Resource": ["arn:aws:iam::[contractor-account-id]:role/[contractor-bedrock-role]"]
    }
  ]
}
```

##### b) Cho phép truy cập Bedrock API

Vì kiểm chứng này chỉ đến mức truy cập Bedrock API, nên thêm AWS managed policy `AmazonBedrockLimitedAccess` vào permission policy.

#### 4. Cài đặt EC2, VPC Endpoint cho truy cập model

Tương tự như tài khoản nhà thầu. Tạo S3 Gateway Endpoint, cài đặt pip trên Amazon Linux 2023, và cài đặt boto3 qua repository của CodeArtifact.

---

## Thực hiện cross-account access từ VPC đóng

Với các cài đặt trên, đã sẵn sàng để tài khoản chính quyền sử dụng Bedrock Claude Haiku 4.5 model của tài khoản nhà thầu.

Để xác nhận, thử thực thi Python code sau:

```python
import boto3

# Assume Role vào IAM Role của tài khoản nhà thầu để lấy credential
sts_client = boto3.client(
    "sts",
    region_name="ap-northeast-1",
    endpoint_url="https://sts.ap-northeast-1.amazonaws.com"
)

assumed_role = sts_client.assume_role(
    RoleArn="arn:aws:iam::[contractor-account-id]:role/[contractor-bedrock-role]",
    RoleSessionName="assume_role_session"
)

assume_role_session = boto3.session.Session(
    aws_access_key_id=assumed_role["Credentials"]["AccessKeyId"],
    aws_secret_access_key=assumed_role["Credentials"]["SecretAccessKey"],
    aws_session_token=assumed_role["Credentials"]["SessionToken"],
)

# Kết nối Bedrock bằng credential đã lấy
bedrock_client = assume_role_session.client("bedrock-runtime", region_name="ap-northeast-1")

response = bedrock_client.converse(
    modelId="jp.anthropic.claude-haiku-4-5-20251001-v1:0",
    messages=[
        {
            "role": "user",
            "content": [{"text": "こんにちは"}]
        }
    ]
)

print(response)
```

Response đã được trả về thành công! Nhờ đó xác nhận được rằng có thể sử dụng Bedrock từ VPC đóng như Government Cloud, và có thể sử dụng Bedrock model của tài khoản khác thông qua cross-account access.

---

## Cảm nhận sau khi thử Bedrock từ VPC đóng

### Những điểm ấn tượng

1. **Bedrock rất dễ sử dụng:** Hầu như không cần ý thức về hạ tầng, có thể dễ dàng sử dụng nhiều model khác nhau, rất bất ngờ.

2. **Truy cập dễ dàng từ môi trường đóng:** Như đã kiểm chứng, có thể dễ dàng truy cập từ môi trường đóng, do đó có vẻ có thể yên tâm sử dụng trong môi trường enterprise.

3. **Kiến trúc cross-account rất thông minh:** Động lực kiểm chứng lần này xuất phát từ việc đọc lại blog về ứng dụng AI sinh tạo của công ty Osaki Computer Engineering, muốn xác nhận từ góc độ hạ tầng xem nó được triển khai như thế nào. Việc nghĩ ra cơ chế này thực sự rất tuyệt.

### Kết quả đạt được

Qua kiểm chứng này, đã có tự tin có thể lập tức tạo môi trường PoC ngay cả khi được yêu cầu sử dụng AI sinh tạo trong Government Cloud.

### Bước tiếp theo

Tiếp theo muốn thử thách với AI Agent.

---

## Tài liệu tham khảo

1. Workshop "Tham gia workshop Government Cloud cho 20 nghiệp vụ tiêu chuẩn hóa chính quyền địa phương và vendor" | DevelopersIO
2. Blog của công ty Osaki Computer Engineering về ứng dụng AI trong Government Cloud
3. Comment trên X/Twitter từ @whitebird_sp về các điểm cần chú ý khi sử dụng Anthropic
4. Tài liệu AWS Bedrock về inference profile
5. Tài liệu CodeArtifact về PyPi upstream repository

---

## Kết luận

Bài viết đã trình bày chi tiết cách triển khai kiến trúc sử dụng Amazon Bedrock Third-Party Model từ môi trường VPC đóng của Government Cloud thông qua cross-account access. Kiến trúc đa tài khoản này không chỉ tuân thủ các ràng buộc của Government Cloud mà còn đảm bảo tính bảo mật cao và khả năng mở rộng cho các ứng dụng AI trong tương lai.

**Các điểm kỹ thuật quan trọng:**

1. **VPC Endpoint Architecture:** Sử dụng Interface VPC Endpoint cho Bedrock Runtime và STS Regional Endpoint để truy cập từ private subnet
2. **Cross-account IAM Trust:** Thiết lập trust policy giữa hai tài khoản với assume role pattern
3. **Initial Model Access:** Quy trình permission cho lần truy cập đầu tiên yêu cầu Marketplace read access
4. **Closed Network Package Installation:** Sử dụng S3 Gateway Endpoint và CodeArtifact để cài đặt boto3 trong môi trường không có internet
5. **Regional Inference Profile:** Giới hạn cross-region inference trong nội địa Nhật Bản bằng cách sử dụng JP Claude Haiku 4.5 inference profile

Kiến trúc này đặc biệt hữu ích cho các tổ chức cần tuân thủ các yêu cầu bảo mật và quy định nghiêm ngặt khi triển khai giải pháp AI.
