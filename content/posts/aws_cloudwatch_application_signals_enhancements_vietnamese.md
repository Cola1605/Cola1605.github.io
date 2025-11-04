---
title: "Amazon CloudWatch Application Signals: Các Cải Tiến Mới Cho Giám Sát Ứng Dụng"
date: 2025-11-04
categories: ["AWS", "Monitoring", "DevOps"]
tags: ["CloudWatch", "Application-Signals", "APM", "Observability", "SLO", "SLI"]
description: "Các tính năng mới của CloudWatch Application Signals: Service Map, Operations view, automatic dashboards, SLO monitoring và integration với Java/Python/NodeJS."
---

# Amazon CloudWatch Application Signals: Các Cải Tiến Mới Cho Giám Sát Ứng Dụng

## Metadata
- **Tiêu đề gốc**: アプリケーション監視における Amazon CloudWatch Application Signals の新しい機能強化
- **Tác giả**: Taiki Hibira (Technical Account Manager)
- **Ngày công bố**: 7 tháng 10, 2025
- **Ngày xuất bản**: 4 tháng 11, 2025
- **Nền tảng**: AWS Japan Blog
- **URL gốc**: https://aws.amazon.com/jp/blogs/news/amazon-cloudwatch-application-signals-new-enhancements-for-application-monitoring/
- **URL bài viết tiếng Anh**: https://aws.amazon.com/jp/blogs/mt/amazon-cloudwatch-application-signals-new-enhancements-for-application-monitoring/
- **Categories**: Amazon CloudWatch, Announcements, General, Management Tools, Monitoring and observability
- **Tags**: Amazon CloudWatch, Application Performance Monitoring, Observability, SLO, SLI, Troubleshooting, DevOps
- **Loại bài viết**: Thông báo sản phẩm (Product Announcement)
- **Độ khó**: Trung cấp (Intermediate)
- **Thời gian đọc ước tính**: 10-12 phút

---

## Thông Báo

**Ngày 7 tháng 10 năm 2025**, AWS vui mừng công bố các **tính năng cải tiến mới** của **Amazon CloudWatch Application Signals** - công cụ giúp đơn giản hóa việc giám sát các ứng dụng phân tán quy mô lớn.

---

## Tổng Quan Các Cải Tiến

### 🎯 Cải Tiến Application Map

**CloudWatch Application Signals** đã cải thiện **Application Map** (Bản đồ ứng dụng) với các khả năng sau:

1. ✅ **Tự động phát hiện và nhóm service** dựa trên mối quan hệ giữa các service
2. ✅ **Hỗ trợ Custom Groups** phù hợp với góc nhìn kinh doanh
3. ✅ **Hiển thị thời gian deploy mới nhất** của service
4. ✅ **Đánh giá kết quả audit tự động** về các vấn đề vi phạm SLI (Service Level Indicator)

---

## Tính Năng Chính

### 1. Application Map - Bản Đồ Ứng Dụng

**Mô tả:**

Application Map của CloudWatch Application Signals hiển thị:
- 📊 **Service Level Objectives (SLO)** - Mục tiêu cấp độ dịch vụ
- 💚 **Health Indicators** - Chỉ số sức khỏe
- 📈 **Operational Signals** - Tín hiệu vận hành

---

### 2. Troubleshooting Drawer - Ngăn Khắc Phục Sự Cố

**Đặc điểm:**

Ngăn khắc phục sự cố theo ngữ cảnh (Context-aware) cho phép:

✅ Truy cập ngay lập tức vào:
- **Standard Metrics** - Metric tiêu chuẩn
- **Deployment Status** - Trạng thái deploy gần đây
- **Actionable Insights** - Thông tin chi tiết có thể hành động

---

### 3. Custom Dashboards - Dashboard Tùy Chỉnh

**Khả năng:**

- 🔄 **Chuyển đổi liền mạch** sang dashboard tùy chỉnh
- 🎯 **Phân tích chi tiết** cho troubleshooting toàn diện
- 📊 **Tùy chỉnh cho từng application**

---

### 4. Trải Nghiệm Tích Hợp

**Kết quả:**

> Trải nghiệm tích hợp này giúp **team xác định root cause nhanh hơn** và **giảm thời gian giải quyết trung bình (MTTR)**

---

## Bắt Đầu Sử Dụng Ngay

### Cho Người Dùng Hiện Tại

**Tin vui! 🎉**

> Nếu **Application Signals đã được kích hoạt** trong AWS account của bạn → **KHÔNG cần cấu hình thêm** để sử dụng các tính năng mới!

---

### Cho Người Dùng Mới

**Bước 1: Kích Hoạt Application Signals**

📚 Tham khảo: [Kích hoạt Application Signals trong account](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable.html)

**Yêu cầu:**

- ✅ Cấp quyền cần thiết để Application Signals phát hiện service

---

**Bước 2: Thử Nghiệm Với Sample App**

Trước khi triển khai vào application thực tế, hãy thử với sample app:

📚 Tài liệu: [CloudWatch Application Signals với EKS Sample](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EKS-sample.html)

---

## Root Cause Analysis - Phân Tích Nguyên Nhân Gốc Rễ

### Workflow Của DevOps Engineer

**Tình huống:**

```
Incident xảy ra → Service có tỷ lệ lỗi cao ⚠️
```

**Các bước xử lý:**

#### 1️⃣ Sử Dụng Application Map

DevOps engineer có thể **nhanh chóng xác định root cause** khi incident xảy ra

#### 2️⃣ Click Vào Node Bị Ảnh Hưởng

Khi service hiển thị **error rate cao** → Click vào node

#### 3️⃣ Xem Troubleshooting Drawer

Troubleshooting Drawer sẽ hiển thị:

| Thông tin | Mô tả |
|-----------|-------|
| **Metrics** | Các chỉ số hiện tại |
| **Recent Deployments** | Deploy gần đây |
| **Dependency Health** | Sức khỏe của các dependency |

#### 4️⃣ Kiểm Tra Audit Results

Engineer có thể xem kết quả audit về:

- 📊 **Metrics**
- 🚀 **Latest Deployments**
- ⚠️ **SLI Violations** (Vi phạm SLI)

---

### 🖼️ Hình Minh Họa

![Services](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/02/Services-1024x455-1.png)

**Hình 1**: Giao diện Services với thông tin chi tiết

---

## Tích Hợp CloudWatch Investigations

### Sức Mạnh Của AI 🤖

**CloudWatch Investigations** - Trợ lý được trang bị **Generative AI**:

✅ **Quét telemetry của hệ thống**

✅ **Hiển thị ngay lập tức:**
- Dữ liệu liên quan đến vấn đề
- Đề xuất giải pháp

---

### Tích Hợp Với Application Signals

**Khả năng:**

> Application Signals **tích hợp với CloudWatch Investigations** → Bạn có thể **bắt đầu investigation** trực tiếp từ **service dashboard**

📚 Tài liệu: [CloudWatch Investigations](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Investigations.html)

---

### 🖼️ Hình Minh Họa

![Investigate](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/02/Investigate-1024x516-1.png)

**Hình 2**: Giao diện Investigation với AI assistance

---

## Service Grouping & Exploration - Nhóm & Khám Phá Service

### Standard Grouping - Nhóm Tiêu Chuẩn

**Application Map** đơn giản hóa việc khám phá và troubleshooting service thông qua **Standard Grouping**:

#### Hành Vi Mặc Định

> Các service được **tự động nhóm** dựa trên **downstream dependencies** (phụ thuộc phía dưới)

---

### Custom Groups - Nhóm Tùy Chỉnh

**Khả năng:**

Sử dụng **"Manage Groups"** để:

✅ Định nghĩa **custom groups** riêng

✅ Tổ chức service dựa trên:
- 🎯 **Business Requirements** - Yêu cầu kinh doanh
- ⚙️ **Operational Priorities** - Ưu tiên vận hành

📚 Tài liệu: [Managing Groups](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ServiceMap.html#Service-map-exploring)

---

### Filters - Bộ Lọc

**Mục đích:**

Filters giúp tập trung vào:

| Filter | Mô tả |
|--------|-------|
| 🚀 **Deployment Changes** | Thay đổi deploy |
| ⚠️ **SLI Violations** | Vi phạm SLI |
| 🖥️ **Computing Platforms** | Nền tảng tính toán |

**Các platform được hỗ trợ:**
- ✅ **Amazon EKS** (Elastic Kubernetes Service)
- ✅ **Amazon ECS** (Elastic Container Service)
- ✅ **AWS Lambda**

---

### View Insights Feature - Tính Năng Xem Thông Tin Chi Tiết

**Chức năng "View Insights" hiển thị:**

1. 💚 **Service Health** - Sức khỏe service
2. 📜 **Change History** - Lịch sử thay đổi
3. 📊 **Metrics** - Các metric

---

### Dashboard Views

**Dashboard bao gồm các view:**

#### 1. Resource Analysis - Phân Tích Tài Nguyên

Phân tích chi tiết về resources

#### 2. Attribute Filtering - Lọc Theo Thuộc Tính

Lọc dựa trên các thuộc tính cụ thể

**Lợi ích:**

> Có thể **bắt đầu root cause analysis** từ **nhiều góc độ khác nhau** 🔍

---

### 🖼️ Hình Minh Họa

![Application Map](https://d2908q01vomqb2.cloudfront.net/b3f0c7f6bb763af1be91d9e74eabfeb199dc1f1f/2025/11/02/Application_map-1024x527-1.png)

**Hình 3**: Application Map với grouping và filtering

---

## Tóm Tắt

### Lợi Ích Chính

#### 1. Giám Sát & Troubleshooting Quy Mô Lớn

✅ Giám sát và troubleshooting **ứng dụng phân tán quy mô lớn** trên AWS

✅ **Tự động nhóm** service và dependency của application

✅ Cung cấp **operational insights** theo ngữ cảnh

---

#### 2. Giảm Gánh Nặng Vận Hành

✅ **Loại bỏ gánh nặng** duy trì custom dashboard

✅ **Giảm thời gian** maintenance vận hành

---

#### 3. Observability-Centric Approach

**Khi độ phức tạp của application tiếp tục tăng:**

> Cách tiếp cận **Application-Centric Observability** của AWS cung cấp **visibility và tools cần thiết** để team duy trì service:
> - 🎯 **Quy mô lớn**
> - 🔒 **Độ tin cậy cao**
> - ⚡ **Performance cao**

---

### Call To Action

> **"Vậy thì, hãy bắt đầu khám phá!"** 🚀

---

## Các Bước Tiếp Theo

### 1. 🎥 Virtual Tour - Tour Ảo

**Mô tả:**

Muốn **trải nghiệm trực tiếp** cách Application Signals:
- Hiển thị application
- Cải thiện troubleshooting
- Chuyển đổi monitoring

**Lợi ích:**

✅ **KHÔNG cần setup môi trường riêng**

✅ Tour **interactive** (tương tác)

🔗 **Link**: [Interactive Virtual Tour](https://aws-cloudops.storylane.io/share/applicationmap)

---

### 2. 📅 Schedule Demo - Đặt Lịch Demo

**Mô tả:**

Liên hệ với **AWS Account Team** để:

✅ Xác nhận cách **transform application monitoring experience**

🔗 **Link**: [Contact AWS](https://aws.amazon.com/jp/contact-us/sales-support/)

---

### 3. 🚀 Bắt Đầu AWS Observability

**Mục đích:**

✅ Triển khai **comprehensive monitoring**

✅ Tăng cường **observability foundation**

✅ Đảm bảo **capture data** cần thiết cho phân tích hiệu quả

🔗 **Link**: [AWS Observability](https://aws.amazon.com/jp/cloudops/monitoring-and-observability/)

---

### 4. 🛠️ Observability Workshop

**Mô tả:**

Khám phá **hands-on experience** với bộ công cụ rộng lớn mà AWS cung cấp để:

✅ Thực hiện **observability** cho application

🔗 **Link**: [Observability Workshop](https://catalog.workshops.aws/observability/en-US)

---

## Tác Giả

### Arun Chandapillai

**Vai trò**: Senior Cloud Architect

**Giới thiệu**:

Arun Chandapillai là:
- 🏆 **Diversity & Inclusion Champion**
- ☁️ Senior Cloud Architect

**Đam mê:**

Giúp khách hàng:
- ✅ Tăng tốc **IT modernization** thông qua **business-first cloud adoption strategy**
- ✅ Xây dựng, deploy và quản lý **application & infrastructure** thành công trên cloud

**Sở thích:**
- 🚗 Đam mê ô tô
- 🎤 Diễn giả nhiệt tình
- ❤️ Từ thiện - Tin tưởng: **"Cho đi là nhận lại"**

![Arun Chandapillai](https://d2908q01vomqb2.cloudfront.net/2e01e17467891f7c933dbaa00e1459d23db3fe4f/2021/08/27/ArunChandapillai-photo.png)

---

### Siva Guruvareddiar

**Vai trò**: Senior Solutions Architect

**Giới thiệu**:

Siva Guruvareddiar là Senior Solutions Architect tại AWS

**Đam mê:**

Giúp khách hàng:
- ✅ Thiết kế **high-availability systems**
- ✅ **Modernize** platform infrastructure và internal architecture

**Chuyên môn:**

Sử dụng các công nghệ:
- 🔧 **Microservices**
- 📦 **Containerization**
- 👁️ **Observability**
- 🕸️ **Service Mesh**
- ☁️ **Cloud Migration**

→ Tăng tốc **cloud-native adoption**

🔗 **LinkedIn**: [linkedin.com/in/sguruvar](https://linkedin.com/in/sguruvar)

![Siva Guruvareddiar](https://d2908q01vomqb2.cloudfront.net/fe2ef495a1152561572949784c16bf23abb28057/2022/08/12/Picture1-4.png)

---

### Mitun Lahiri

**Vai trò**: Software Development Manager

**Affiliation**: CloudWatch Application Signals

![Mitun Lahiri](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/10/10/mlahiri.jpg)

---

## Người Dịch

**Tên**: 日平 (Hibira)

**Vai trò**: Technical Account Manager

---

## Ghi Chú Nguồn

> Bài viết này là bản dịch của: [Amazon CloudWatch Application Signals new enhancements for application monitoring](https://aws.amazon.com/jp/blogs/mt/amazon-cloudwatch-application-signals-new-enhancements-for-application-monitoring/)
>
> Người dịch: **Technical Account Manager - 日平**

---

## Key Features - Tính Năng Chính

### 10 Tính Năng Nổi Bật

1. ✅ **Automatic Service Grouping** - Nhóm service tự động
2. ✅ **Custom Groups Support** - Hỗ trợ nhóm tùy chỉnh
3. ✅ **Latest Deploy Time Visibility** - Hiển thị thời gian deploy mới nhất
4. ✅ **Automatic SLI Violation Audit** - Audit tự động vi phạm SLI
5. ✅ **Context-Aware Troubleshooting Drawer** - Ngăn troubleshooting theo ngữ cảnh
6. ✅ **CloudWatch Investigations Integration** - Tích hợp CloudWatch Investigations
7. ✅ **Standard & Custom Grouping** - Nhóm tiêu chuẩn & tùy chỉnh
8. ✅ **Advanced Filters** - Bộ lọc nâng cao (deploy, SLI, platform)
9. ✅ **View Insights Feature** - Tính năng View Insights
10. ✅ **Resource Analysis & Attribute Filtering** - Phân tích tài nguyên & lọc thuộc tính

---

## Technical Highlights - Điểm Nổi Bật Kỹ Thuật

### 8 Điểm Kỹ Thuật Quan Trọng

1. 🎯 **SLO & Health Indicators Display** - Hiển thị SLO và chỉ số sức khỏe

2. 🔄 **Downstream Dependency-Based Auto Grouping** - Tự động nhóm theo downstream dependency

3. 🤖 **Generative AI-Powered CloudWatch Investigations** - CloudWatch Investigations được trang bị AI tạo sinh

4. 🔍 **Multi-Perspective Root Cause Analysis** - Phân tích root cause đa góc độ

5. ⏱️ **MTTR Reduction** - Giảm thời gian giải quyết trung bình

6. 📊 **Automatic Custom Dashboard Generation** - Tự động tạo custom dashboard

7. ☁️ **Amazon EKS, ECS, Lambda Support** - Hỗ trợ EKS, ECS, Lambda

8. 🚀 **Zero Additional Configuration** - Không cần cấu hình thêm (cho người dùng hiện tại)

---

## Benefits - Lợi Ích

### 8 Lợi Ích Chính

1. ⚡ **Rapid Root Cause Identification** - Xác định root cause nhanh chóng

2. ⏱️ **Reduced MTTR** - Giảm thời gian giải quyết trung bình

3. 🗑️ **Eliminated Custom Dashboard Maintenance** - Loại bỏ gánh nặng duy trì custom dashboard

4. 🕐 **Reduced Operational Maintenance Time** - Giảm thời gian maintenance vận hành

5. 🌐 **Simplified Large-Scale Distributed App Monitoring** - Đơn giản hóa giám sát ứng dụng phân tán quy mô lớn

6. 🎯 **Business Requirement-Based Service Organization** - Tổ chức service theo yêu cầu kinh doanh

7. 🔍 **Multi-Angle Root Cause Analysis** - Phân tích root cause từ nhiều góc độ

8. 📈 **Instantly Accessible Operational Insights** - Truy cập ngay operational insights

---

## Tags

`#AWS` `#CloudWatch` `#ApplicationSignals` `#Observability` `#Monitoring` `#SLO` `#SLI` `#Troubleshooting` `#DevOps` `#AIOps` `#GenerativeAI` `#EKS` `#ECS` `#Lambda` `#RootCauseAnalysis` `#MTTR` `#ApplicationPerformance`

---

**Nguồn bài viết gốc**: [AWS Japan Blog](https://aws.amazon.com/jp/blogs/news/amazon-cloudwatch-application-signals-new-enhancements-for-application-monitoring/)

**Dịch và biên soạn bởi**: GitHub Copilot AI Assistant

**Ngày dịch**: 2025

---

## Phụ Lục: Quick Reference

### Workflow Sử Dụng Application Signals

```
1. Kích hoạt Application Signals
   ↓
2. Cấp quyền cần thiết
   ↓
3. Service tự động được phát hiện
   ↓
4. Application Map hiển thị
   ↓
5. Incident xảy ra
   ↓
6. Click vào service bị ảnh hưởng
   ↓
7. Xem Troubleshooting Drawer
   ↓
8. Kiểm tra Metrics, Deploys, SLI Violations
   ↓
9. Tích hợp CloudWatch Investigations (nếu cần)
   ↓
10. Xác định root cause và giải quyết
```

---

### Checklist Triển Khai

- [ ] Kích hoạt Application Signals trong AWS account
- [ ] Cấp quyền cần thiết cho service discovery
- [ ] Thử nghiệm với sample app (optional)
- [ ] Cấu hình custom groups (nếu cần)
- [ ] Setup filters phù hợp với use case
- [ ] Tích hợp với CloudWatch Investigations
- [ ] Train team về các tính năng mới
- [ ] Monitor và đánh giá hiệu quả

---

**🎉 Chúc bạn thành công với CloudWatch Application Signals!**
