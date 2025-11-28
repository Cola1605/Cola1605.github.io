---
title: "Bài 2: Quản lý ngân sách AWS với Budgets và Cost Anomaly Detection"
date: 2025-11-27
draft: false
tags: ["#Tech_News", "AWS", "Cost Management", "AWS Budgets", "Hands-on", "Jr.Champions", "30 Days AWS"]
categories: ["AWS", "DevOps and Infrastructure"]
author: "nwwn25"
---

# Bài 2: Quản lý ngân sách AWS với Budgets và Cost Anomaly Detection

## Thông tin bài viết
- **Tác giả**: nwwn25
- **Ngày xuất bản**: 27/11/2025
- **Tags**: AWS, Hands-on, Jr.Champions, 30days-aws-master-handson, AWS Budgets, Cost Management
- **Nguồn**: [Qiita](https://qiita.com/nwwn25/items/7c95f0233aecb365c3b2)

## Tổng quan

Bài học thứ 2 trong bộ 30 bài hands-on do 2025 Japan AWS Jr.Champions xây dựng. Học cách quản lý chi phí cloud với AWS Budgets và Cost Anomaly Detection, bao gồm thiết lập cảnh báo ngân sách và phát hiện bất thường tự động. Thời gian thực hiện khoảng 30 phút, **2 budgets đầu tiên hoàn toàn miễn phí**.

## Các điểm chính

1. **Bài 2 của chương trình 30 ngày** học xây dựng các dịch vụ AWS chính dành cho người mới bắt đầu
2. **Học quản lý chi phí** với AWS Budgets và Cost Anomaly Detection
3. **Thời gian: ~30 phút**, 2 budgets đầu miễn phí
4. **Nhận thông báo qua Email** khi chi phí vượt ngân sách tháng
5. **Machine Learning tự động phát hiện** các pattern bất thường về chi phí AWS
6. **Cảnh báo Email tức thì** khi có phát sinh chi phí không mong đợi
7. **Chi phí ~$0.60/tháng/budget** từ budget thứ 3 trở đi
8. Cost Anomaly Detection **miễn phí cơ bản** (phí riêng cho SNS notification)
9. **Cần kích hoạt Cost Explorer** trước khi sử dụng
10. Có thể **mở rộng với budget actions và SNS notifications**

## 📘 Day 02: Bắt đầu quản lý chi phí với AWS Budgets và Cost Anomaly Detection

### 📝 Tổng quan

Đây là bài thứ 2 trong bộ hands-on do các thành viên 2025 Japan AWS Jr.Champions xây dựng với chủ đề **'Xây dựng được các dịch vụ AWS chính trong 30 ngày'** dành cho người mới bắt đầu!

Thông tin về mục đích và quá trình xây dựng bộ bài tập này có thể tham khảo tại:  
[https://qiita.com/satosato_kozakana/items/446971c2deca7e27d0aa](https://qiita.com/satosato_kozakana/items/446971c2deca7e27d0aa)

| Mục | Nội dung |
|------|------|
| **Thời gian** | Khoảng 30 phút |
| **Dịch vụ chính** | AWS Budgets, AWS Cost Anomaly Detection |
| **Học được gì** | Phương pháp quản lý chi phí AWS, thiết lập cảnh báo ngân sách, cơ bản về phát hiện bất thường |
| **Chi phí dự kiến** | Miễn phí (2 budgets đầu tiên miễn phí) |

#### 💡 Lưu ý quan trọng
> Cloud hoạt động theo mô hình pay-as-you-go, vì vậy khi xây dựng môi trường hãy thiết lập budgets để tránh vượt ngân sách.

#### ⚠️ Cảnh báo chi phí
Các tài nguyên sau có thể phát sinh chi phí:

- **AWS Budgets**: Từ budget thứ 3 trở đi: ~$0.60/tháng/budget
- **AWS Cost Anomaly Detection**: Miễn phí cơ bản (phí riêng nếu sử dụng SNS notification)

**Chi tiết giá:**
- [AWS Budgets Pricing](https://aws.amazon.com/jp/aws-cost-management/aws-budgets/pricing/)
- [AWS Cost Anomaly Detection Pricing](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2024_AWS-CostAnomalyDetection_0831_v1.pdf)

## 🎯 Nội dung bài tập

Sử dụng AWS Budgets và Cost Anomaly Detection để **thiết lập quản lý chi phí**. Các ngưỡng cảnh báo hãy tính toán dựa trên lượng sử dụng hiện tại của môi trường.

### 🔧 Các tính năng triển khai

1. **Gửi thông báo qua Email** khi chi phí sử dụng vượt ngân sách tháng
2. **Machine learning tự động phát hiện** các pattern bất thường về chi phí AWS và **gửi Email ngay lập tức** khi phát sinh chi phí không mong đợi

## 💡 Gợi ý triển khai

### Thiết lập AWS Budgets
Các gợi ý về quy trình thiết lập AWS Budgets được cung cấp trong bài gốc.

### Thiết lập Cost Anomaly Detection
Các gợi ý về quy trình thiết lập Cost Anomaly Detection được cung cấp trong bài gốc.

## ✅ Checklist sau khi hoàn thành

Hãy kiểm tra các điểm sau:

- ✅ **Budget đã được tạo trên AWS Budgets và hiển thị trên budget dashboard**
- ✅ **Cấu hình cảnh báo budget chính xác, địa chỉ email nhận thông báo đã được xác nhận**
- ✅ **Cost monitor và alert subscription của Cost Anomaly Detection đã được tạo**
- ✅ **Cost Explorer đã được kích hoạt và cả hai dịch vụ hoạt động bình thường**

## 🧰 Tài nguyên sử dụng

Tạo thủ công trên AWS Console, không cần file đặc biệt

## 🔗 Tài liệu tham khảo

### AWS Budgets

- [Quản lý chi phí với AWS Budgets - AWS Cost Management](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/budgets-managing-costs.html)
- [【AWS】Thiết lập AWS Budgets "ngay" sau khi tạo account #Security - Qiita](https://qiita.com/NAMICHAN/items/80e66e62d95291a8cd22)

### Cost Anomaly Detection

- [Bắt đầu với AWS Cost Anomaly Detection - AWS Cost Management](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/getting-started-ad.html)
- [Tổng quan AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/manage-ad.html)
- [Phát hiện bất thường chi phí trong organization! Giới thiệu cách thiết lập Cost Anomaly Detection | DevelopersIO](https://dev.classmethod.jp/articles/how-to-setup-cost-anomaly-detection/)

## 🛠️ Giải đáp & Các bước xây dựng

**Lưu ý**: Giải đáp và các bước xây dựng chi tiết được cung cấp trong bài gốc dưới dạng có thể nhấp để xem.

### Giải đáp và các bước xây dựng AWS Budgets
Các bước xây dựng chi tiết được cung cấp trong bài gốc.

### Giải đáp và các bước xây dựng Cost Anomaly Detection
Các bước xây dựng chi tiết được cung cấp trong bài gốc.

## 🧹 Dọn dẹp (Xóa tài nguyên)

Sau khi hoàn thành bài tập, hãy xóa tài nguyên theo các bước sau:

1. **Xóa Budgets**
2. **Xóa Cost Monitor**
3. **Xóa Alert Subscription**

## 🏁 Chúc mừng bạn đã hoàn thành!

**Khi xây dựng môi trường trên cloud, nhất định phải thiết lập Budgets và quản lý chi phí!**

Qua bài tập này với AWS Budgets và Cost Anomaly Detection, bạn đã học được **kỹ năng quản lý chi phí thực tế**.

Nếu còn thời gian, hãy thử thách bản thân với **budget actions và SNS notifications**!

---

## Thông tin Series

**Tiêu đề**: Bộ hands-on 30 ngày làm chủ AWS  
**Day**: 2  
**Tổ chức**: 2025 Japan AWS Jr.Champions  
**Chủ đề**: Xây dựng được các dịch vụ AWS chính trong 30 ngày

---

**Hãy thử thách các bài tập Day khác nhé!**
