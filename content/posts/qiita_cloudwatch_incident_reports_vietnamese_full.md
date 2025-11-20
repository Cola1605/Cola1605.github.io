---
title: "Tự Động Tạo Báo Cáo Sự Cố AWS! Trải Nghiệm Thực Tế CloudWatch Incident Reports"
date: 2025-11-03
categories: ["AWS", "DevOps & Infrastructure"]
tags: ["CloudWatch", "Incident-Reports", "AIOps", "Automation", "AWS-Observability"]
description: "Hướng dẫn thực hành CloudWatch Incident Reports để tự động tạo báo cáo sự cố. AIOps, post-mortem automation, và tiết kiệm thời gian vận hành AWS."
---

# Tự Động Tạo Báo Cáo Sự Cố AWS! Trải Nghiệm Thực Tế CloudWatch Incident Reports

## Metadata
- **Tiêu đề gốc**: AWS障害対応の事後報告書を自動生成！CloudWatch Incident Reportsを実際に使ってみた
- **Tác giả**: sh_fk2 (@sh_fk2)
- **Ngày xuất bản**: 3 tháng 11, 2025
- **Nền tảng**: Qiita
- **URL gốc**: https://qiita.com/sh_fk2/items/14e5595e40fc3024c805
- **Engagement**: 6 Likes, 3 Stocks, 0 Comments
- **Tags**: AWS, CloudWatch, AIOps, 運用調査, IncidentReport, Observability, Automation
- **Loại bài viết**: Hướng dẫn thực hành (Hands-on Tutorial)
- **Độ khó**: Trung cấp (Intermediate)
- **Thời gian đọc ước tính**: 15-20 phút

---

## 1. Giới Thiệu

### Bối Cảnh Vấn Đề

Khi vận hành hệ thống cấp doanh nghiệp (Enterprise), sau khi xử lý sự cố, việc **tổng hợp báo cáo sự cố hậu sự** (障害報告書) theo định dạng thường tốn rất nhiều thời gian và công sức. Điều này khiến chúng ta không thể tập trung vào việc tạo **post-mortem** thực sự và các biện pháp cải tiến cần thiết.

### Thông Báo Tính Năng Mới

Vào **tháng 10 năm 2025**, AWS đã bổ sung tính năng tạo **Incident Reports** (Báo cáo Sự cố) trong **CloudWatch Investigations** (運用調査機能).

### Mô Tả Từ AWS

> "Sử dụng tính năng mới này, bạn có thể tự động capture các telemetry vận hành quan trọng, cấu hình dịch vụ, và kết quả điều tra để tạo ra các báo cáo chi tiết. Báo cáo bao gồm: executive summary, timeline sự kiện, đánh giá tác động, và các khuyến nghị hành động. Những báo cáo này giúp bạn nhận diện pattern tốt hơn, triển khai các biện pháp phòng ngừa, và liên tục cải thiện tình hình vận hành thông qua phân tích sau sự cố có cấu trúc."

### Kỳ Vọng Của Tác Giả

Tôi kỳ vọng rằng tính năng này có thể tạo ra các tài liệu hữu ích cho báo cáo sự cố, nên đã tiến hành kiểm chứng.

---

## 2. Môi Trường Kiểm Thử

### Hệ Thống Cơ Bản

Tôi sử dụng môi trường đang học về **Dead Letter Queue (DLQ)** của SQS trong một dự án khác làm chủ đề kiểm thử.

### Kiến Trúc Hệ Thống

![Architecture Diagram](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F5c9289af-bc02-4f9d-8f71-72b4c9d2f1ca.png)

**Luồng xử lý:**

1. **Producer Lambda** đẩy dữ liệu vào **SQS**
2. **Consumer Lambda** đọc từ SQS, xử lý, và ghi vào **DynamoDB**
3. Khi **ReceiveCount** đạt đến **maxReceiveCount** (retry 2 lần, tổng cộng 3 lần thử), message được chuyển vào **DLQ**
4. Giám sát metric tích lũy của DLQ queue
5. Khi lượng tích lũy vượt quá ngưỡng → **CloudWatch Alarm** được kích hoạt

### Kịch Bản Kiểm Thử

**Tình huống giả định:**

> Trong một lỗi vận hành, **IAM Role** được gán cho Consumer Lambda vô tình bị xóa **policy truy cập DynamoDB**

**Trigger khởi động:**

Khi lượng tích lũy DLQ vượt ngưỡng → **CloudWatch Investigations** (運用調査機能) được tự động khởi chđộng

---

## 3. Hướng Dẫn Cài Đặt CloudWatch Investigations

### Lưu Ý Giao Diện

Trên Management Console, tính năng này hiển thị là **"AI Operations"** (AIオペレーション), khá khó hiểu lần đầu sử dụng. Trong tài liệu AWS, nó được gọi là **"Investigations"**, nên tốt hơn là nên thống nhất cách gọi để dễ hiểu hơn.

---

### Bước 1: Cài Đặt Ban Đầu

Click vào **"このアカウント用に設定"** (Thiết lập cho account này) để tiến hành cài đặt ban đầu.

![Step 1 Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F8026cab7-f437-4131-84d8-7623bd0e8cd4.png)

---

### Bước 2: Cài Đặt IAM Role

Đối với **Access Permissions** (アクセス許可), chọn **IAM Role tự động tạo** theo mặc định, sau đó click **"調査グループを作成"** (Tạo Investigation Group).

![Step 2 Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fd410ffde-b193-411e-acee-d9b7cc856add.png)

---

### Bước 3: Tạo Investigation

Sau khi Investigation Group được tạo, từ menu **"調査を作成"** (Tạo Investigation), chọn **"アラームから作成"** (Tạo từ Alarm).

![Step 3 Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fbb1eff87-2cbe-47ea-99fe-aecb21fb6d7d.png)

---

### Bước 4: Chỉnh Sửa CloudWatch Alarm

Trên màn hình **CloudWatch Alarm**, từ menu **Actions**, click **"編集"** (Edit).

![Step 4 Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fd3c2853a-32d8-4d1d-a8fc-dc264d209a96.png)

---

### Bước 5: Thêm Investigation Action

Trên màn hình cấu hình Action, click **"調査アクションの追加"** (Thêm Investigation Action).

![Step 5 Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F9f4b8f44-a0c4-4306-a11c-c3948703ca8d.png)

---

### Bước 6: Chọn Investigation Group

Chọn **DefaultInvestigationGroup** và tiếp tục với các cài đặt tiếp theo.

![Step 6a Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F5cc6a894-9e3c-46b1-8250-76f571639097.png)

![Step 6b Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F1a1f125a-a713-4394-9781-46c9444b3a6d.png)

![Step 6c Screenshot](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fed1f1307-6b2f-42a0-8cc9-d07561043df8.png)

---

## 4. Thực Thi Kịch Bản

### Bước 1: Xóa Quyền IAM

Xóa quyền **DynamoDB write access** được gán cho **Consumer Lambda**.

![Delete IAM Permission 1](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F08920248-967d-4924-932a-de34a42f8dac.png)

![Delete IAM Permission 2](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fa0a026f6-d17b-4cbf-a398-f414ed7b91c3.png)

---

### Bước 2: Thực Thi Lambda

Trong trạng thái này, thực thi **Producer Lambda** để thêm record vào SQS.

**Kết quả:** Lambda thực thi thất bại như mong đợi ✅

![Lambda Execution Failed](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F0d3f87fc-4daa-4ddc-9e03-270251875e19.png)

---

### Bước 3: Chuyển Message Vào DLQ

Sau khi chờ đến **Visibility Timeout** của SQS:
- Lambda retry và thất bại
- Message được chuyển vào **DLQ**
- Số lượng message trong DLQ **tăng đều đặn** ⬆️

![DLQ Message Count](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F02b1aed5-6d09-4647-aa88-7e4c8a251f75.png)

---

### Bước 4: Khởi Động Investigations

Khi DLQ vượt ngưỡng → **CloudWatch Investigations** được tự động khởi động! 🚀

![Investigation Triggered](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Ff604081d-3a89-424c-940a-179717f0d0e2.png)

---

### Bước 5: Phê Duyệt Dữ Liệu

Tiến hành phê duyệt (approve) dữ liệu sẽ được sử dụng cho investigation.

![Data Approval](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fee5cacc4-f2b1-4b96-9da5-40c39cec245d.jpeg)

---

### Bước 6: Đề Xuất Từ CloudWatch

Sau một lúc, CloudWatch đưa ra **đề xuất** → Phát hiện chính xác vấn đề **thiếu quyền IAM** 🎯

![CloudWatch Suggestion 1](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fa674b205-c3da-48dc-a93c-8676a405abd1.png)

![CloudWatch Suggestion 2](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fc95701d6-d050-4dee-9e55-629671067e21.png)

---

### Bước 7: Kiểm Tra Agent Queue

Trong mục **Agent Queue**, bạn có thể thấy danh sách các task phân tích (analysis tasks) mà agent của Investigations đã tự động thực hiện:

- ✅ Đã thực thi (Executed)
- ⏳ Đang thực thi (In Progress)
- 🕐 Đang chờ (Queued)

Đây là tài liệu tham khảo để theo dõi cách agent hoạt động. Các tính năng **AI Observability** ngày càng được bổ sung phong phú! 🧠

![Agent Queue](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F502e3965-a522-46ef-8a4a-49e900cb33b9.png)

---

### Bước 8: Tạo Incident Report

Click vào **"Incident Report"** ở góc trên bên phải để bắt đầu xuất báo cáo.

![Create Incident Report 1](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Ffae7013e-79a0-4d4f-8dd0-da55980684c9.png)

![Create Incident Report 2](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F9e15d7fb-9bbd-474f-8f30-9ac3b47f0e6a.png)

---

## 5. Phân Tích Kết Quả Báo Cáo

### Lưu Ý Ngôn Ngữ

Output được tạo **toàn bộ bằng tiếng Anh**. Để xem, tôi sử dụng chức năng dịch tiếng Nhật của trình duyệt.

---

### 5.1. Report Assessment (Đánh Giá Báo Cáo)

Phần này tóm tắt các **thông tin còn thiếu** khi tạo báo cáo.

![Report Assessment](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F094ca916-81e2-4891-a2ac-519c79f86b4e.png)

#### Những Điểm Quan Trọng:

1. **Dữ liệu tác động khách hàng**:
   - Nếu có thể hiển thị **số lượng khách hàng bị ảnh hưởng** và **tỷ lệ ảnh hưởng** thông qua **Application Signals**, **SLO**, và **burn rate**, báo cáo sẽ được bổ sung nhiều hơn

2. **Trọng tâm vào tác động kinh doanh**:
   > "Nếu không có dữ liệu về tác động kinh doanh, báo cáo không thể đánh giá tác động thương mại hoặc ưu tiên công việc phục hồi dựa trên mức độ quan trọng kinh doanh, và việc hỗ trợ quyết định của ban lãnh đạo sẽ bị hạn chế"

3. **Giá trị của góc nhìn**:
   Chỉ riêng việc báo cáo được viết từ góc nhìn này đã có giá trị rồi. Nó khiến chúng ta nhận ra rằng **chỉ góc nhìn kỹ thuật là không đủ** ⚠️

---

### 5.2. Báo Cáo Chi Tiết

Các thông tin còn thiếu được đề cập trong **Report Assessment** được hiển thị dưới dạng **biến số** (variable).

**Điểm nổi bật:**
- ✅ Thiếu quyền IAM Role được ghi rõ
- ✅ Việc tự động tổng hợp đến mức này **thực sự góp phần vào hiệu quả hóa**

![Report Details](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fb5a7511c-7d53-4011-9eac-b2720f18336e.png)

---

### 5.3. Tác Động Đến Khách Hàng (Customer Impact)

Việc phát hiện được qua **Alarm** được đánh giá là điều tích cực ✅

![Customer Impact](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F8f30c589-6b09-444c-95c2-fcbe188a46d6.png)

---

### 5.4. Đánh Giá Xử Lý Sự Cố (Incident Response Assessment)

Đưa ra các điểm cần xem xét để **giảm thời gian chẩn đoán xuống 1/2**. Đánh giá khách quan dựa trên sự thật 📊

![Incident Response Assessment](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fd2d0c141-782c-4c3f-900a-48ae6c8d708f.png)

---

### 5.5. Phân Tích "5 Whys"

Thực hiện phân tích sâu và nhìn lại giống như **"5 Whys Analysis"** (なぜなぜ分析) 🔍

![5 Whys Analysis](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fc8703de1-e9dd-4b43-98a7-fdf994663a9f.png)

---

### 5.6. Bài Học Kinh Nghiệm (Lessons Learned)

Các **bài học kinh nghiệm** được tổng hợp và ghi lại một cách ngăn nắp.

#### Suy Nghĩ Của Tác Giả:

> Trung thực mà nói, phần này **tổng hợp quá hoàn hảo** đến mức tôi hơi ngỡ ngàng 😅

**Mối quan ngại:**

Những nội dung mà các kỹ sư chỉ có thể học được sau khi:
- Nhìn lại (振り返り)
- Thảo luận (議論)
- Tự mình suy nghĩ (自ら考えて)
- Nhận ra (気づいて)

...lại được **tổng hợp sẵn ngay từ đầu** trong tài liệu hoàn chỉnh. Điều này khiến tôi lo lắng:

> "Liệu có thực sự biến thành **bài học của riêng mình** (自分ごと) và dẫn đến bài học thực sự không?" 🤔

![Lessons Learned](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fd02b9119-bbe9-4589-8ee4-a4d31696c653.png)

---

### 5.7. Action Items (Hành Động Cần Thực Hiện)

Các **Action Items** được phân loại theo mức độ ưu tiên:

| Ưu tiên | Thời hạn |
|---------|----------|
| 🔴 **Cao** | 30 ngày |
| 🟡 **Trung bình** | 60 ngày |
| 🟢 **Thấp** | 90 ngày |

**Nội dung chi tiết:**
- ✅ Hành động cần thực hiện cho mỗi mục
- ✅ Các mối quan hệ phụ thuộc (dependencies)

![Action Items](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fbf3b4ef0-3d58-4524-851c-11991a656356.png)

---

### 5.8. Tùy Chọn Xuất Báo Cáo

**Định dạng hỗ trợ:**
- 📄 **PDF**
- 📝 **Markdown**

**Khuyến nghị:**

Vì toàn bộ nội dung **được viết bằng tiếng Anh**, nên hiện tại cách thực tế nhất là:

1. Copy dưới dạng **Markdown**
2. Sử dụng **AI Agent** để dịch sang tiếng Nhật
3. Bổ sung các yếu tố còn thiếu

---

### 5.9. Đánh Giá Tổng Thể

> "Nói một cách **khiêm tốn**, báo cáo được tạo ở mức độ **tuyệt vời**" 🌟

**Nhận xét:**

- ❌ Không thể áp dụng toàn bộ như hiện tại
- ✅ Nhưng chỉ cần bổ sung một chút các góc nhìn còn thiếu là **đã có thể sử dụng đầy đủ**
- ⏱️ Điều này được tạo ra chỉ trong **vài phút** → Đáng sợ!

**Kết luận:**

> "Cảm thấy sợ hãi trước trình độ này, đồng thời **không thể bỏ lỡ cơ hội sử dụng nó**" 💪

---

## 6. Lưu Ý Quan Trọng

### 6.1. ⚠️ IAM Role Cũ Của Investigations

**Vấn đề:**

Trong AWS account mà tôi đã thử nghiệm **CloudWatch Investigations trước đây**, việc tạo **Incident Report không tiến triển**.

**Nguyên nhân:**

IAM Role của Investigations **thiếu quyền**

**Policy bị thiếu:**

`AIOpsAssistantIncidentReportPolicy`

**Nội dung policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Action": [
        "aiops:PutFact",
        "aiops:ListFacts",
        "aiops:GetFact",
        "aiops:GetFactVersions",
        "aiops:UpdateReport",
        "aiops:CreateReport",
        "aiops:GetReport",
        "aiops:GenerateReport",
        "aiops:GetInvestigation",
        "aiops:ListInvestigationEvents",
        "aiops:GetInvestigationEvent"
      ],
      "Resource": [
        "arn:aws:aiops:ap-northeast-1:XXXXXXXXXXXX:investigation-group/*"
      ]
    }
  ]
}
```

**Cảnh báo:**

> Nếu bạn đã thử nghiệm **CloudWatch Investigations trước tháng 10/2025** và đã tạo IAM Role, vui lòng **chú ý** ⚠️

![IAM Policy Warning](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Ff7d9fcc4-b870-442a-b48c-185b1e848c69.png)

---

### 6.2. Cross-Region Inference (Suy Luận Xuyên Vùng)

**Tính đến ngày 3/11/2025:**

Khi đối tượng là **Tokyo Region**, các region thực thi là:
- 🇺🇸 **US East (N. Virginia)**
- 🇺🇸 **US East (Ohio)**
- 🇺🇸 **US West (Oregon)**

**Ghi chú:**

Gần đây, **Amazon Bedrock** đã bắt đầu cung cấp **Cross-Region Inference trong nước Nhật** cho **Anthropic Claude 4.5**, nhưng **CloudWatch Investigations** có vẻ còn phải chờ.

![Cross-Region Inference](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Ff262ef3b-7296-4329-aae5-e3da35aed69c.png)

---

### 6.3. 💰 Chi Phí (Pricing)

**Tính đến ngày 3/11/2025:**

#### Incident Report Generation:

> **KHÔNG MẤT PHÍ BỔ SUNG** ✅

**Tuyên bố chính thức từ AWS:**

> "Incident report generation is included at no additional charge for all CloudWatch investigations users and integrates seamlessly with your investigation workflow."

**Bản dịch tiếng Nhật:**

> "インシデントレポートの生成は、すべての CloudWatch 調査ユーザーに追加料金なしで含まれており、調査ワークフローとシームレスに統合されます。"

#### Giới Hạn Investigations:

- **1 account**: Tối đa **150 investigations/tháng**

#### Nhận xét của tác giả:

> "Mặc dù tài liệu được tạo ra **đáng tiếc là bằng tiếng Anh**, nhưng về mặt **ví tiền** thì có thể **yên tâm thử nghiệm**. Việc mức độ này **không mất thêm phí** khiến tôi hơi lo ngại 😅"

![Pricing 1](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2F4dba285a-c948-4c13-aa42-1f82bf146775.png)

![Pricing 2](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3925746%2Fe5a8c86d-5839-471d-bd47-e8aab6b3de88.png)

---

## 7. Kết Luận

### Ấn Tượng Tổng Thể

> Incident Report được tạo ra, thành thật mà nói, đã **vượt xa kỳ vọng** của tôi 🚀

### Phạm Vi Bao Phủ

- ✅ Mỗi doanh nghiệp có **góc nhìn kinh doanh** khác nhau
- ✅ Định dạng báo cáo sự cố (các điểm được chú trọng) cũng khác nhau
- ⚠️ Hiện tại, **Incident Report chưa thể bao phủ tất cả**
- ✅ Nhưng như một **input cơ bản**, đây là mức độ **quá đủ** 💯

### Mong Muốn

> "Tôi mong rằng sớm sẽ có **hỗ trợ tiếng Nhật**" 🙏

### Ưu Điểm

1. **Môi trường AWS đóng**:
   - ✅ Có thể thực hiện trong **môi trường AWS đóng**
   - ✅ **KHÔNG MẤT PHÍ BỔ SUNG**
   - ✅ Đây là một **lợi thế rất lớn**

2. **Độ chính xác cao**:
   - ✅ Các tài liệu cơ bản được tạo ra với **độ chính xác rất cao**
   - ✅ Bổ sung phần còn thiếu
   - ✅ Cuối cùng, kỹ sư nắm bắt nội dung và tổng hợp

### Hạn Chế

❌ **Xử lý sự cố bên ngoài môi trường AWS** (ví dụ: escalation đến các bên liên quan) là phạm vi mà **Incident Report không thể bao phủ**

---

### Suy Nghĩ Cuối Cùng

> "Nếu nội dung này có thể trở thành tài liệu tham khảo cho bất kỳ ai đang suy nghĩ về **hiệu quả hóa xử lý sự cố**, tôi sẽ rất vui mừng" 😊

---

## 8. Tính Năng Chính (Key Features)

1. ✅ Ví dụ sử dụng thực tế của **CloudWatch Incident Reports**
2. ✅ Kịch bản giám sát DLQ với **SQS + Lambda + DynamoDB**
3. ✅ Tự động phát hiện và phân tích **thiếu quyền IAM**
4. ✅ Hiển thị các task phân tích AI qua **Agent Queue**
5. ✅ Góc nhìn đánh giá báo cáo **tập trung vào tác động kinh doanh**
6. ✅ Tự động tạo **phân tích "5 Whys"** và **bài học kinh nghiệm**
7. ✅ Tự động đề xuất **Action Items có phân loại ưu tiên**
8. ✅ **Có thể sử dụng mà KHÔNG MẤT PHÍ BỔ SUNG** 💰

---

## 9. Điểm Nổi Bật Kỹ Thuật (Technical Highlights)

1. 🔧 Cách cài đặt **CloudWatch Investigations** (運用調査機能)
2. 🔧 Cấu hình khởi động Investigation từ **CloudWatch Alarm**
3. 🔧 Sử dụng tính năng **tự động tạo IAM Role**
4. 🔧 Tính minh bạch của quy trình phân tích qua **Agent Queue**
5. 🔧 Tính năng **AI Observability** phong phú
6. 🔧 Export báo cáo dưới dạng **Markdown/PDF**
7. 🔧 Sử dụng **Cross-Region Inference**
8. 🔧 **AIOpsAssistantIncidentReportPolicy** là bắt buộc ⚠️

---

## Tags

`#AWS` `#CloudWatch` `#AIOps` `#運用調査` `#IncidentReport` `#Observability` `#Automation` `#CloudWatchInvestigations` `#IncidentManagement` `#PostMortem` `#SRE` `#DevOps`

---

**Nguồn bài viết gốc**: [Qiita - @sh_fk2](https://qiita.com/sh_fk2/items/14e5595e40fc3024c805)

**Dịch và biên soạn bởi**: GitHub Copilot AI Assistant

**Ngày dịch**: 2025

---

## Phụ Lục: Workflow Đề Xuất

### Workflow Sử Dụng Incident Report

```
1. Sự cố xảy ra
   ↓
2. CloudWatch Alarm kích hoạt
   ↓
3. CloudWatch Investigations tự động khởi động
   ↓
4. Phê duyệt dữ liệu phân tích
   ↓
5. Nhận đề xuất từ AI
   ↓
6. Tạo Incident Report (English)
   ↓
7. Export dưới dạng Markdown
   ↓
8. Dịch sang tiếng Nhật bằng AI Agent
   ↓
9. Bổ sung thông tin còn thiếu
   ↓
10. Hoàn thiện báo cáo cuối cùng
```

### Checklist Trước Khi Sử Dụng

- [ ] Đã tạo **CloudWatch Investigations** (Investigation Group)
- [ ] Đã cấu hình **CloudWatch Alarm** với Investigation Action
- [ ] Đã cấp quyền **AIOpsAssistantIncidentReportPolicy** cho IAM Role
- [ ] Đã thiết lập **Application Signals** (nếu muốn báo cáo SLO)
- [ ] Đã hiểu về **Cross-Region Inference** (dữ liệu được xử lý tại US)

---

**🎉 Chúc bạn thành công với CloudWatch Incident Reports!**
