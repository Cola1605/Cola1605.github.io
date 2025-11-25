---
title: "Tăng tốc ứng dụng AI quy mô lớn với Amazon EC2 P6-B300 instances mới"
date: 2025-11-25T00:00:00Z
draft: false
categories: ["AWS"]
tags: ["Amazon EC2", "GPU", "AI", "Machine Learning", "NVIDIA Blackwell", "High Performance Computing", "AWS Nitro System"]
author: "Veliswa Boya"
source: "AWS Blog"
source_url: "https://aws.amazon.com/jp/blogs/news/accelerate-large-scale-ai-applications-with-the-new-amazon-ec2-p6-b300-instances/"
---

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Hỗ trợ các mô hình AI quy mô lớn](#hỗ-trợ-các-mô-hình-ai-quy-mô-lớn)
- [Những cải tiến so với thế hệ trước](#những-cải-tiến-so-với-thế-hệ-trước)
- [Thông số kỹ thuật](#thông-số-kỹ-thuật)
- [Thông tin hữu ích](#thông-tin-hữu-ích)
- [Hiện đã có sẵn](#hiện-đã-có-sẵn)
- [Tổng kết](#tổng-kết)

---

## Giới thiệu

Ngày 18 tháng 11 năm 2025, AWS đã công bố **Amazon Elastic Compute Cloud (Amazon EC2) P6-B300 instances** - nền tảng GPU thế hệ tiếp theo được tăng tốc bởi **NVIDIA Blackwell Ultra GPU**. Các instance này cung cấp **băng thông mạng gấp 2 lần** và **bộ nhớ GPU gấp 1.5 lần** so với thế hệ trước, tạo nên một nền tảng cân bằng cho các ứng dụng AI quy mô lớn.

---

## Hỗ trợ các mô hình AI quy mô lớn

Với những cải tiến này, P6-B300 instances được thiết kế để tối đa hóa hiệu năng training và inference cho các **mô hình AI quy mô lớn**, đặc biệt là các mô hình sử dụng các kỹ thuật tiên tiến như **Mixture of Experts (MoE)** và xử lý đa phương thức.

Đối với các tổ chức cần distributed training trên hàng nghìn GPU, các instance này cung cấp **sự cân bằng hoàn hảo giữa khả năng computing, memory và network**.

![Tổng quan về Amazon EC2 P6-B300 instances](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/12/p6b300screen.png)
*Sơ đồ kiến trúc của P6-B300 instances*

---

## Những cải tiến so với thế hệ trước

P6-B300 instances cung cấp **băng thông mạng Elastic Fabric Adapter (EFA) lên đến 6.4 Tbps**, hỗ trợ giao tiếp hiệu quả giữa các GPU cluster quy mô lớn.

Các instance này được trang bị **2.1 TB bộ nhớ GPU**, cho phép đặt các mô hình quy mô lớn trong **một NVLink domain duy nhất**. Kết quả là giảm đáng kể sharding của mô hình và overhead trong giao tiếp.

Khi kết hợp các instance này với EFA networking và các tính năng ảo hóa cũng như bảo mật tiên tiến của **AWS Nitro System**, bạn có thể đạt được **tốc độ, khả năng mở rộng và độ tin cậy chưa từng có** cho các workload AI.

### Các cải tiến chính

- **Băng thông mạng**: 6.4 Tbps (gấp 2 lần thế hệ trước)
- **Bộ nhớ GPU**: 2.1 TB (gấp 1.5 lần thế hệ trước)
- **Kết nối GPU**: 1,800 GB/giây qua NVLink
- **Ảo hóa và Bảo mật**: Các tính năng tiên tiến từ AWS Nitro System

---

## Thông số kỹ thuật

Thông số kỹ thuật của EC2 P6-B300 instances như sau:

### P6-B300.48xlarge

| Thông số | Giá trị |
|----------|---------|
| **Kích thước instance** | P6-B300.48xlarge |
| **vCPU** | 192 |
| **Bộ nhớ hệ thống** | 4TB |
| **GPU** | 8x B300 GPU |
| **Bộ nhớ GPU** | 2,144 GB HBM3e |
| **Kết nối GPU-to-GPU** | 1,800 GB/giây |
| **Băng thông mạng EFA** | 6.4 Tbps |
| **Băng thông ENA** | 300 Gbps |
| **Băng thông EBS** | 100 Gbps |
| **Local storage** | 8x 3.84TB |

### Tech stack

- **GPU**: NVIDIA Blackwell Ultra B300
- **Bộ nhớ**: HBM3e (High Bandwidth Memory 3e)
- **Mạng**: Elastic Fabric Adapter (EFA)
- **Kết nối**: NVLink
- **Nền tảng**: AWS Nitro System

---

## Thông tin hữu ích

### Tùy chọn lưu trữ

Về lưu trữ bền vững, dựa trên các yếu tố về chi phí và hiệu năng, các workload AI chủ yếu sử dụng các dịch vụ sau:

- **Amazon FSx for Lustre**
- **Amazon S3 Express One Zone**
- **Amazon Elastic Block Store (Amazon EBS)**

Các dịch vụ này cho phép **truy cập hot storage với throughput cao**, hỗ trợ các workload training quy mô lớn.

### Đạt throughput tối đa

Khi sử dụng **FSx for Lustre**, bạn có thể kết hợp **EFA và GPUDirect Storage (GDS)** để đạt **throughput lên đến 1.2 Tbps** đến hệ thống file Lustre của P6-B300 instances, cho phép load mô hình nhanh chóng.

#### Lợi ích của GPUDirect Storage (GDS)

- Truyền dữ liệu trực tiếp đến GPU, bỏ qua CPU và system memory
- Giảm latency trong việc di chuyển dữ liệu
- Cải thiện hiệu năng tổng thể của hệ thống
- Rút ngắn thời gian load các mô hình quy mô lớn

---

## Hiện đã có sẵn

### Khu vực cung cấp

P6-B300 instances hiện đã có sẵn tại **AWS Region US West (Oregon)** với các tùy chọn sau:

- **Amazon EC2 Capacity Blocks for ML**
- **Savings Plan**

### Đặt trước và liên hệ

Để đặt trước **on-demand** P6-B300 instances, vui lòng liên hệ với Account Manager của bạn.

### Giá cả

Giống như thông thường với Amazon EC2, **bạn chỉ trả tiền cho phần bạn sử dụng**.

Để biết thêm chi tiết, vui lòng xem [Giá Amazon EC2](https://aws.amazon.com/ec2/pricing/).

### Tài nguyên

Khám phá bộ sưu tập đầy đủ các [high-performance computing instances](https://aws.amazon.com/ec2/instance-types/) để giúp bạn bắt đầu di chuyển ứng dụng.

---

## Tổng kết

Amazon EC2 P6-B300 instances là nền tảng GPU thế hệ tiếp theo được trang bị NVIDIA Blackwell Ultra GPU, cung cấp các đặc điểm sau:

### Các đặc điểm chính

1. **Băng thông mạng gấp 2 lần thế hệ trước** (6.4 Tbps)
2. **Bộ nhớ GPU gấp 1.5 lần thế hệ trước** (2.1 TB)
3. **Được tối ưu hóa cho các mô hình AI quy mô lớn** (MoE, xử lý đa phương thức)
4. **Truy cập storage tốc độ cao** (lên đến 1.2 Tbps)
5. **Bảo mật tiên tiến với AWS Nitro System**

### Workload phù hợp

- Training các mô hình ngôn ngữ lớn (LLM)
- Các mô hình Mixture of Experts (MoE)
- Các mô hình AI đa phương thức
- Distributed training trên hàng nghìn GPU
- Workload inference tốc độ cao

### Thông tin chi tiết

Để biết thêm chi tiết, vui lòng xem [trang Amazon EC2 P6-B300 instances](https://aws.amazon.com/ec2/instance-types/p6/).

Hãy chia sẻ feedback của bạn tại [AWS re:Post for EC2](https://repost.aws/tags/TAO-wqN9fYRoyrpdULLa5y7g/amazon-ec-2/) hoặc thông qua AWS Support thông thường.

---

**Danh mục**: AWS, Compute, Amazon EC2  
**Tags**: #GPU #AI #MachineLearning #HighPerformanceComputing #NVIDIA #Blackwell #EFA #NitroSystem
