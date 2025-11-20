---
title: "Những điều cần nắm về việc Amazon Bedrock ngừng tính năng Model Access"
date: 2025-10-19
draft: false
categories: ["AWS", "AI and Machine Learning"]
tags: ["Amazon-Bedrock", "Model-Access", "Foundation-Models", "AI-Security", "AWS-Updates"]
description: "Tìm hiểu về việc Amazon Bedrock ngừng tính năng Model Access từ 15/10/2025 và các thay đổi quan trọng trong cách truy cập foundation models."
---

**Tác giả:** @hayao_k  
**Tổ chức:** 株式会社セゾンテクノロジー (Saison Technology Co., Ltd.)  
**Ngày đăng:** 19/10/2025  
**Ngày cập nhật:** 19/10/2025  
**Nguồn:** https://qiita.com/hayao_k/items/aaaf92e15a60bebd137a

**Engagement:** 13 Likes, 4 Stocks

---

## 📢 Giới thiệu

Với update vào **15/10/2025**, tính năng **Model Access** của Amazon Bedrock đã bị **ngừng** và việc truy cập ban đầu vào các foundation model được cung cấp bởi Bedrock đã được **đơn giản hóa**.

Tham khảo announcement chính thức:

🔗 **[Amazon Bedrock simplifies access with automatic enablement of serverless foundation models](https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-automatic-enablement-serverless-foundation-models/)**

📚 **[Simplified model access in Amazon Bedrock | Amazon Web Services](https://aws.amazon.com/jp/blogs/security/simplified-amazon-bedrock-model-access/)**

Đây không chỉ đơn giản là một tính năng bị loại bỏ, mà các hoạt động xung quanh cũng đã thay đổi đáng kể. Hiểu rõ các thay đổi này sẽ giúp bạn đánh giá tác động đến việc sử dụng trong tổ chức và phát triển ứng dụng. Bài viết này tổng hợp những thông tin tôi đã nắm được tại thời điểm hiện tại.

---

## 🔍 Model Access là gì?

**Model Access** là tính năng để kiểm soát các foundation model có thể sử dụng trên Bedrock. Trước đây, bạn cần phải **request access một cách rõ ràng** và **kích hoạt** cho từng model muốn sử dụng, nhưng từ nay **không còn cần thiết nữa**.

Thông báo lỗi `AccessDeniedExeption (You don't have access to the model with the specified model ID)` khi model access chưa được kích hoạt chắc hẳn tất cả Bedrock users đều đã gặp ít nhất một lần.

Từ nay, **các model mới cũng có thể sử dụng ngay lập tức** mà không cần thêm bất kỳ bước nào. Trang Model Access trên console cũng đã bị ngừng, hiện tại hiển thị như sau:

![Model Access Deprecated](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F125105%2F151b96c6-113c-4e93-9b5f-837a0b06814f.png)

---

## 🔐 Vẫn cần đăng ký lần đầu cho các model Anthropic

Để sử dụng các model do **Anthropic** cung cấp, trước khi request access, bạn cần phải **gửi chi tiết use case**. **Yêu cầu này không thay đổi** ngay cả sau khi Model Access bị ngừng.

Đối với account chưa từng sử dụng Anthropic model hoặc account mới, khi mở **Chat / Text playground** trên Bedrock console và chọn Anthropic model, form đăng ký lần đầu sẽ hiển thị. Quy trình này không trực quan lắm, nên nếu không biết có thể khó tìm thấy.

![Anthropic Use Case Form](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F125105%2F11942fda-cb41-4cc7-bd4c-adf195d7d7c5.png)

### 📋 Đơn giản hóa quy trình với AWS Organizations

Khi sử dụng **AWS Organizations**, nếu gửi use case từ **management account**, các **member account** sẽ **không cần nhập form lần đầu** như được giới thiệu trong release và blog ở đầu bài (chưa xác nhận hành vi thực tế).

### ⚙️ Gửi Use Case qua API

Việc gửi use case lần đầu có thể **tự động hóa** bằng cách sử dụng `PutUseCaseForModelAccess API`. Như sẽ đề cập sau, API này đã có từ trước.

🔗 **[PutUseCaseForModelAccess - Amazon Bedrock API Reference](https://docs.aws.amazon.com/es_es/bedrock/latest/APIReference/API_PutUseCaseForModelAccess.html)**

**Request Syntax** rất đơn giản. `formData` cần được **Base64 encode**:

```
POST /use-case-for-model-access HTTP/1.1
Content-type: application/json

{
  "formData": blob
}
```

Nội dung của `formData` gửi đi tương tự như nội dung gửi từ console, ở định dạng **JSON**. `intendedUsers` với giá trị `"0"` nghĩa là **Internal users**:

```json
{
  "companyName": "Example Corp",
  "companyWebsite": "https://example.com",
  "intendedUsers": "0",
  "industryOption": "Software as a Service",
  "otherIndustryOption": "",
  "useCases": "YOUR_USECASE_HERE"
}
```

### 💻 Code Example - Gửi Use Case

Dưới đây là ví dụ code. Lưu ý đây chỉ là sample, khi thực tế gửi hãy nhập thông tin use case đúng đắn:

```python
# put_use_case_for_model_access.py
import boto3
import base64
import json

def main():
    client = boto3.client('bedrock', region_name='us-east-1')
    
    form_data = {
        "companyName": "",
        "companyWebsite": "",
        "intendedUsers": "",
        "industryOption": "",
        "otherIndustryOption": "",
        "useCases": ""
    }
    
    # Gửi thông tin use case
    # Với blob type, boto3 không cần Base64 encode thủ công
    client.put_use_case_for_model_access(
        formData=form_data
    )

if __name__ == "__main__":
    main()
```

### 📥 Lấy Use Case đã gửi

Với `GetUseCaseForModelAccess API`, bạn có thể lấy use case đã gửi trước đó, giúp tham khảo khi gửi cho account mới:

```python
# get_use_case_for_model_access.py
import boto3
import base64

def main():
    client = boto3.client('bedrock', region_name='us-east-1')
    
    response = client.get_use_case_for_model_access()
    print(base64.b64decode(response['formData']).decode('utf-8'))

if __name__ == "__main__":
    main()
```

---

## 🛒 Quy trình Subscribe AWS Marketplace

**Trước đây:** Subscribe khi kích hoạt model trong Model Access  
**Từ nay:** Subscribe khi **lần đầu tiên gọi model**

Ngoại trừ các model do **Amazon, DeepSeek, Mistral AI, Meta, Qwen, OpenAI** cung cấp, các model từ 3rd party model providers được cung cấp qua **AWS Marketplace**. Trước đây, việc subscribe marketplace product tương ứng diễn ra khi kích hoạt model trong Model Access. Sau khi Model Access bị ngừng, việc subscribe diễn ra **khi lần đầu tiên gọi model**.

### 🔑 IAM cần có quyền Marketplace để Subscribe

Đây vốn là yêu cầu từ trước. Điều cần chú ý là do Model Access bị ngừng, việc **subscribe product diễn ra khi lần đầu gọi model**. Nghĩa là **IAM principal thực hiện lần gọi đầu tiên** cần được cấp quyền action `aws-marketplace:Subscribe`.

Do đó, trong trường hợp các **ứng dụng** như **AI agent** hoặc **Bedrock Knowledge Bases** thực hiện lần gọi đầu tiên mà **không có sự can thiệp của con người**, **IAM role** mà các ứng dụng này sử dụng cũng cần được cấp quyền action `aws-marketplace:Subscribe`.

### 📜 Cách xác nhận EULA

Nhiều 3rd party model, ngoài AWS service terms tiêu chuẩn, còn định nghĩa **End User License Agreement (EULA)** riêng cho từng model provider, và bạn cần **đồng ý với EULA** để sử dụng. Khi gọi model, bạn được coi là đã đồng ý với EULA tương ứng.

Dashboard Model Access có link đến EULA của từng công ty, đóng vai trò nhất định giúp xác nhận trước khi kích hoạt, nhưng dashboard đã bị ngừng. **Giờ đây người dùng cần chủ động xác nhận EULA hơn bao giờ hết**.

EULA có thể xác nhận từ **Model Catalog**:

![Model Catalog EULA](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F125105%2F6269226b-1ad3-4d16-8a82-4bfc808c8f6d.png)

Ngoài ra, các EULA cũng được liệt kê tập trung tại link dưới đây.

---

## 🔒 Cách kiểm soát truy cập vào Model

Trong trường hợp sử dụng doanh nghiệp, nhiều case muốn **bắt buộc xác nhận EULA** trước khi bắt đầu sử dụng model. Trong những trường hợp này, phương pháp kiểm soát truy cập bằng **SCP** hoặc **IAM policy** vẫn có thể sử dụng như trước. Mặc định **block truy cập vào model**, và chỉ khi đã trải qua quy trình nội bộ cần thiết và đồng ý EULA, mới thay đổi policy để cho phép truy cập.

### 📝 Ví dụ Policy - Chặn Subscribe ngoại trừ Claude Haiku 4.5

Ví dụ, để từ chối Subscribe tất cả các model ngoại trừ **Claude Haiku 4.5**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": [
        "aws-marketplace:Subscribe"
      ],
      "Resource": "*",
      "Condition": {
        "ForAllValues:StringNotEquals": {
          "aws-marketplace:ProductId": [
            "prod-xdkflymybwmvi"
          ]
        }
      }
    }
  ]
}
```

⚠️ **Lưu ý quan trọng:** Các model do **Amazon, DeepSeek, Mistral AI, Meta, Qwen, OpenAI** cung cấp **không sử dụng AWS Marketplace**. Do đó **policy trên không thể giới hạn việc sử dụng các model này**.

Để block việc sử dụng specific model ID đã được cấp quyền truy cập, và các ví dụ khác, vui lòng tham khảo document dưới đây.

---

## 🔧 Các API liên quan đến Model Access

**Trước đây:** Cung cấp các API liên quan đến Model Access  
**Từ nay:** `PutFoundationModelEntitlement` (internal API) bị **ngừng**, các API khác hiện không thay đổi

Các thao tác với Model Access cơ bản cần thực hiện trên console. Một số operation đã công khai API vào khoảng cuối tháng 6/2025, có thể sử dụng với AWS CLI và SDK.

`CreateFoundationModelAgreement API` là API để tạo model access agreement (đồng ý EULA) - điều kiện tiên quyết để sử dụng một số 3rd party model như Anthropic, **không phải API để request model access cuối cùng**.

Ngoài ra, `PutFoundationModelEntitlement API` để request model access **không được công bố trong API Reference**. Do đó không thể sử dụng với AWS CLI hay SDK, và được sử dụng nội bộ khi kích hoạt model qua console.

### 📊 Bảng tổng hợp các API

| API | Mô tả | Trạng thái công khai | Trạng thái tương lai |
|-----|-------|---------------------|---------------------|
| **CreateFoundationModelAgreement** | Chỉ định model ID và offer, tạo model access agreement | Công khai | Chưa có thông báo |
| **DeleteFoundationModelAgreement** | Xóa access agreement của model được chỉ định | Công khai | Chưa có thông báo |
| **GetFoundationModelAvailability** | Lấy thông tin availability của model được chỉ định | Công khai | Chưa có thông báo |
| **ListFoundationModelAgreementOffers** | Lấy offer của model được chỉ định | Công khai | Chưa có thông báo |
| **PutUseCaseForModelAccess** | Gửi use case khi sử dụng Anthropic model | Công khai | Chưa có thông báo |
| **GetUseCaseForModelAccess** | Lấy use case đã gửi | Công khai | Chưa có thông báo |
| **PutFoundationModelEntitlement** | Request access vào model được chỉ định | Không công khai (internal API) | **Ngừng** |

### 🚫 API bị ngừng

Trong AWS Blog được giới thiệu ở đầu bài, có thông báo rằng `PutFoundationModelEntitlement API` và IAM policy action đi kèm `bedrock:PutFoundationModelEntitlement` đã bị **vô hiệu hóa**.

### 📈 Response của GetFoundationModelAvailability

Có giá trị `entitlementAvailability` cho biết trạng thái request access của model, trước đây có thể xác nhận model đã được kích hoạt hay chưa qua giá trị này (`AVAILABLE | NOT_AVAILABLE`). Nhờ đó có thể kiểm soát như "chỉ hiển thị những foundation model có model access đã kích hoạt ở phía ứng dụng".

Do Model Access bị ngừng, giá trị `entitlementAvailability` giờ đây **luôn trả về `AVAILABLE`**.

**Ví dụ Response của GetFoundationModelAvailability:**

```bash
$ aws bedrock get-foundation-model-availability \
  --model-id 'anthropic.claude-haiku-4-5-20251001-v1:0' --region us-east-1

{
  "modelId": "anthropic.claude-haiku-4-5-20251001-v1",
  "agreementAvailability": {
    "status": "AVAILABLE"
  },
  "authorizationStatus": "AUTHORIZED",
  "entitlementAvailability": "AVAILABLE",
  "regionAvailability": "AVAILABLE"
}
```

### ❓ Các API khác sẽ như thế nào?

Tại thời điểm đăng bài này, không tìm thấy thông tin nào (xóa hoặc thay đổi) về các public API khác. Tuy nhiên, **không loại trừ khả năng specification thay đổi trong tương lai** do việc ngừng Model Access.

Nếu có implementation sử dụng các API này trong ứng dụng, hãy thực hiện **error handling thích hợp** và **theo dõi thông tin mới nhất**.

---

## 📌 Tổng kết

Bài viết này đã tổng hợp những điều cần nắm về việc ngừng Model Access của Amazon Bedrock.

### ✨ Key Changes Summary

1. ✅ **Truy cập đơn giản hóa** - Các model mới có thể sử dụng ngay lập tức không cần thêm bước
2. 🔐 **Anthropic vẫn cần đăng ký** - Anthropic model vẫn yêu cầu gửi use case lần đầu
3. 🛒 **Thay đổi timing Subscribe** - Subscribe diễn ra khi lần đầu gọi model thay vì khi kích hoạt
4. 🔑 **IAM cần quyền Subscribe** - IAM thực hiện lần gọi đầu tiên cần có `aws-marketplace:Subscribe`
5. 📜 **Xác nhận EULA chủ động** - Người dùng cần chủ động xác nhận EULA hơn
6. 🔒 **Kiểm soát qua Policy** - Có thể kiểm soát access qua SCP hoặc IAM policy
7. 🚫 **API bị ngừng** - `PutFoundationModelEntitlement API` đã bị ngừng
8. 📊 **API Availability thay đổi** - `GetFoundationModelAvailability` luôn trả về `AVAILABLE`

### 🎯 Đối tượng ảnh hưởng

- **Amazon Bedrock users**
- **AWS Organizations administrators**
- **AI Agent developers**
- **Bedrock Knowledge Bases users**
- **Người phụ trách triển khai Bedrock trong doanh nghiệp**

### ⚠️ Những điểm quan trọng cần nhớ

1. ❌ Trang Model Access trên console đã bị ngừng
2. ✍️ Anthropic model vẫn cần gửi use case lần đầu
3. 🤖 IAM role của AI Agent và Knowledge Bases cần quyền Subscribe
4. 📖 EULA cần được xác nhận chủ động bởi người dùng
5. 🚫 Không thể giới hạn model không dùng AWS Marketplace (Amazon, DeepSeek, Mistral AI, Meta, Qwen, OpenAI) bằng Subscribe policy
6. 🔄 Cần chú ý khả năng thay đổi các public API trong tương lai

### 📚 Tài liệu tham khảo

1. **[Amazon Bedrock simplifies access with automatic enablement of serverless foundation models](https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-automatic-enablement-serverless-foundation-models/)**
2. **[Simplified model access in Amazon Bedrock | Amazon Web Services](https://aws.amazon.com/jp/blogs/security/simplified-amazon-bedrock-model-access/)**
3. **[PutUseCaseForModelAccess - Amazon Bedrock API Reference](https://docs.aws.amazon.com/es_es/bedrock/latest/APIReference/API_PutUseCaseForModelAccess.html)**
4. **[GetUseCaseForModelAccess - Amazon Bedrock API Reference](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_GetUseCaseForModelAccess.html)**

---

## 💬 Kết luận

Việc ngừng **Model Access** là một thay đổi quan trọng trong Amazon Bedrock, **đơn giản hóa việc truy cập** vào các foundation model nhưng cũng **yêu cầu awareness cao hơn** về EULA, IAM permissions, và access control.

**Khuyến nghị:**
- 🔍 Review IAM policies và roles hiện tại
- 📋 Thiết lập quy trình xác nhận EULA trong tổ chức
- 🔑 Đảm bảo IAM roles của AI applications có quyền Subscribe đầy đủ
- 📊 Theo dõi thông tin mới nhất về API changes
- 🛡️ Implement appropriate error handling

Hy vọng bài viết này hữu ích! 🎯

URL: https://qiita.com/hayao_k/items/aaaf92e15a60bebd137a
TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
