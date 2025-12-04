---
title: "AWS Clean Rooms Ra mắt Tính năng Tạo Synthetic Dataset Tăng cường Quyền riêng tư cho Huấn luyện Mô hình ML"
date: 2025-12-04T10:00:00+09:00
draft: false
categories: ["AI and Machine Learning", "Cloud", "Security and Networking"]
tags: ["AWS Clean Rooms", "Machine Learning", "Synthetic Data", "Privacy", "Differential Privacy", "ML Training", "Data Security"]
author: "Micah Walter"
translator: "日平"
---

# AWS Clean Rooms Ra mắt Tính năng Tạo Synthetic Dataset Tăng cường Quyền riêng tư cho Huấn luyện Mô hình ML

**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/aws-clean-rooms-launches-privacy-enhancing-synthetic-dataset-generation-for-ml-model-training/)  
**Tác giả**: Micah Walter  
**Ngày**: 3 tháng 12, 2025

---

## Giới thiệu

Ngày 30 tháng 11 năm 2025, AWS công bố **tính năng tạo synthetic dataset tăng cường quyền riêng tư** cho AWS Clean Rooms. Đây là tính năng mới cho phép tổ chức và đối tác của họ tạo synthetic dataset tăng cường quyền riêng tư từ dữ liệu đã thu thập, sử dụng để huấn luyện các mô hình machine learning (ML) hồi quy và phân loại. 

**Lợi ích chính**: Với tính năng này, bạn có thể **truy cập dữ liệu nhạy cảm mới nhất để huấn luyện mô hình ML mà không cần học hoặc suy luận về cá nhân**.

---

## Thách thức: Data Utility vs Privacy Protection

### Vấn đề Cơ bản

Khi xây dựng mô hình ML, các data scientist và analyst thường đối mặt với **vấn đề cơ bản giữa data utility và privacy protection**.

**Yêu cầu về Data Quality:**
- Truy cập dữ liệu chất lượng cao và chi tiết là **cần thiết** để huấn luyện mô hình chính xác
- Mô hình cần nhận diện xu hướng, cá nhân hóa trải nghiệm, thúc đẩy kết quả kinh doanh

**Mối lo về Privacy:**
- Sử dụng dữ liệu chi tiết như **user-level event data** gây ra lo ngại nghiêm trọng về quyền riêng tư
- Tạo ra **thách thức về compliance**
- Huấn luyện dựa trên signal ở cấp độ cá nhân thường **xung đột với chính sách bảo mật** và yêu cầu quy định

**Câu hỏi kinh doanh**: "Đặc điểm nào cho thấy khách hàng có tỷ lệ chuyển đổi cao?" - nhưng việc sử dụng dữ liệu cá nhân để trả lời câu hỏi này lại vi phạm quyền riêng tư.

---

## Giải pháp: Privacy-Enhancing Synthetic Dataset Generation

### AWS Clean Rooms ML

**Cách tiếp cận mới**: Tạo **phiên bản synthetic** của dataset nhạy cảm, có thể sử dụng an toàn trong ML model training.

#### Công nghệ

Sử dụng **kỹ thuật machine learning tiên tiến** để:
- **Duy trì các đặc tính thống kê** của dữ liệu gốc
- **Tạo dataset mới** mà không thể nhận dạng subject từ dữ liệu nguồn gốc

#### So sánh với Phương pháp Truyền thống

**Phương pháp truyền thống (Masking):**
- ❌ Vẫn có **rủi ro tái nhận dạng** cá nhân trong dataset
- ❌ Ví dụ: Chỉ cần biết mã bưu điện + ngày sinh có thể nhận dạng cá nhân qua dữ liệu điều tra dân số

**Phương pháp Synthetic Data:**
- ✅ Hệ thống tạo ra **record hoàn toàn mới**
- ✅ Record tương tự nhưng **không khớp** với record gốc
- ✅ **Bảo vệ toán học** chống tái nhận dạng

---

## Privacy Controls & Quality Metrics

### Tham số Có thể Cấu hình

Tổ chức sử dụng tính năng này có thể kiểm soát:

**1. Noise Level**
- Lượng noise được áp dụng vào dữ liệu

**2. Membership Inference Attack Protection**
- Mức độ bảo vệ chống lại kẻ tấn công cố gắng xác định liệu training set có chứa dữ liệu của một cá nhân cụ thể hay không

### Quality Metrics

Sau khi tạo synthetic dataset, AWS Clean Rooms cung cấp **metrics chi tiết** giúp khách hàng và compliance team hiểu chất lượng của synthetic dataset.

**1. Fidelity Score**
- **Phương pháp**: Sử dụng KL-Divergence
- **Đo lường**: Synthetic data tương tự như thế nào so với dataset gốc

**2. Privacy Score**
- **Phương pháp**: Sử dụng differential privacy guarantees
- **Đánh giá**: Dataset chống lại membership inference attack như thế nào

---

## Workflow: Sử dụng Synthetic Data trong AWS Clean Rooms

Quy trình tuân theo **established AWS Clean Rooms ML custom model workflow** với các bước mới để chỉ định privacy requirements và xác minh quality metrics.

### Bước 1: Tạo Configured Table

Tạo **configured table** với analysis rule được cấu hình, sử dụng data source ưa thích của bạn.

### Bước 2: Tham gia hoặc Tạo Collaboration

Tham gia hoặc tạo **collaboration** với đối tác.

### Bước 3: Tạo Analysis Template

Data owner định nghĩa:
- **SQL query** tạo dataset
- **Chỉ định nhu cầu synthesize** dataset

**Cấu hình Analysis Template:**
- Phân loại column để chỉ ra column mà ML model sẽ dự đoán
- Chỉ ra column chứa categorical value và numerical value
- Bao gồm **privacy threshold**:
  - **Epsilon value**: Chỉ định lượng noise có thể có trong synthetic data để bảo vệ khỏi re-identification
  - **Membership inference attack protection level**

### Bước 4: Phê duyệt Analysis Template

Tất cả data owner xem xét và phê duyệt analysis template.

### Bước 5: Tạo ML Input Channel

Collaboration member tạo **machine learning input channel** tham chiếu đến template.

### Bước 6: Tạo Synthetic Dataset

- AWS Clean Rooms bắt đầu quá trình tạo synthetic dataset
- **Thời gian**: Thường hoàn thành trong vài giờ (phụ thuộc vào kích thước và độ phức tạp của dataset)

**Kết quả**: Nếu synthetic dataset đáp ứng privacy threshold cần thiết, **synthetic ML input channel** sẽ có sẵn cùng với quality metrics chi tiết.

### Bước 7: Xác minh Quality Metrics

Data scientist có thể xem:
- **Protection score thực tế** đạt được chống lại simulated membership inference attack

### Bước 8: Huấn luyện ML Model

Sử dụng synthetic dataset trong AWS Clean Rooms collaboration để bắt đầu huấn luyện ML model.

**Tùy chọn:**
- Export trained model weight
- Tiếp tục chạy inference job trong collaboration

---

## Console Features

### 1. Collaboration Setup

Khi tạo AWS Clean Rooms collaboration mới, bạn có thể **cấu hình ai sẽ trả phí** cho synthetic dataset generation.

### 2. Analysis Template Creation

Khi tạo analysis template mới, chọn **"Request that analysis template output be synthesized"**.

### 3. Query Execution

Sau khi synthetic analysis template sẵn sàng:
- Chạy protected query
- Xem chi tiết tất cả ML input channel liên quan

---

## Khả dụng & Pricing

### Availability

✅ **Có sẵn ngay bây giờ**  
✅ Trong **tất cả các AWS commercial region** mà AWS Clean Rooms có sẵn

### Pricing Model

**Billing Unit**: **Synthetic Data Generation Unit (SDGU)**

**Tính phí:**
- Chỉ tính phí cho **compute time** được sử dụng để tạo synthetic dataset
- Số lượng SDGU phụ thuộc vào **kích thước và độ phức tạp** của dataset gốc

**Payer Configuration:**
- Có thể cấu hình như **payer setting**
- Bất kỳ collaboration member nào cũng có thể đồng ý trả phí

📄 **Chi tiết pricing**: [AWS Clean Rooms Pricing](https://aws.amazon.com/clean-rooms/pricing/)

---

## Capabilities & Integration

### Initial Release

**Hỗ trợ:**
- ✅ **Tabular data**
- ✅ **Classification model training**
- ✅ **Regression model training**

### Integration

**Khả năng tương thích:**
- ✅ Synthetic dataset tương thích với **standard ML framework**
- ✅ Tích hợp với **existing model development pipeline** mà không cần thay đổi workflow

---

## Benefits

### Privacy Protection

✅ **Giảm thiểu rủi ro** rò rỉ thông tin nhạy cảm của từng user

### Data Utility

✅ **Khai thác giá trị** của user-level sensitive data để huấn luyện mô hình

### Use Cases

**Ứng dụng thực tế:**
- 📊 **Tối ưu hóa quảng cáo campaign**
- 💼 **Cá nhân hóa báo giá bảo hiểm**
- 🤖 Các ứng dụng ML khác

### Advancement

Tính năng này giới thiệu **bước tiến đáng kể trong privacy-enhanced machine learning**, cho phép tổ chức khai thác giá trị của sensitive user-level data trong model training đồng thời giảm thiểu rủi ro rò rỉ thông tin nhạy cảm của từng cá nhân.

---

## Tài liệu Tham khảo

📚 **AWS Clean Rooms Documentation**: [What is AWS Clean Rooms](https://docs.aws.amazon.com/clean-rooms/latest/userguide/what-is.html)

🔗 **Bài viết gốc**: [AWS Blog - AWS Clean Rooms Launches Privacy-Enhancing Synthetic Dataset Generation](https://aws.amazon.com/jp/blogs/aws/aws-clean-rooms-launches-privacy-enhancing-synthetic-dataset-generation-for-ml-model-training/)
