---
title: "Deploy ứng dụng container dễ dàng với AWS App Runner"
date: 2025-11-13
draft: false
categories: ["AWS", "Container", "Serverless"]
tags: ["AWS", "Docker", "AppRunner", "Tutorial", "BIPROGY"]
author: "YuNagura (Yu Nagura) - BIPROGY株式会社"
translator: "日平"
description: "Hướng dẫn thực hành xây dựng container application với AWS App Runner. Serverless, auto-scaling và auto-deploy - triển khai web bulletin board app từ ECR với các bước đơn giản qua Management Console."
---

# Deploy ứng dụng container dễ dàng với AWS App Runner

**Tác giả**: YuNagura (Yu Nagura) - BIPROGY株式会社  
**Ngày xuất bản**: 13 tháng 11 năm 2025  
**Nguồn**: [Qiita](https://qiita.com/YuNagura/items/d42f2cd6c60d9723931e)

---

## Tổng quan

Bài viết giới thiệu các bước thực hành xây dựng container application sử dụng AWS App Runner. Với các đặc điểm serverless, auto-scaling và auto-deploy, App Runner cho phép deploy một web bulletin board app đơn giản từ ECR và kiểm tra hoạt động. Có thể xây dựng dễ dàng từ Management Console, là môi trường lý tưởng cho việc kiểm thử container applications.

## AWS App Runner là gì?

AWS App Runner là dịch vụ fully managed cho phép chạy container applications theo mô hình serverless. Bạn có thể deploy container apps nhanh chóng mà không cần quan tâm đến việc quản lý infrastructure.

### Đặc điểm chính

#### 1. Serverless

- Người dùng không cần quan tâm đến infrastructure (VPC, servers, load balancers)
- Các components này vận hành bên trong nhưng người dùng không thấy
- Trải nghiệm serverless hoàn toàn

#### 2. Auto-scaling

- Tự động scale theo traffic
- Ngưỡng (threshold) có thể tùy chỉnh
- Tự động đáp ứng sự biến động nhu cầu

#### 3. Auto-deploy

- Tích hợp với code repository hoặc Amazon ECR
- Tự động build và deploy khi push code hoặc image mới
- Thực hiện continuous deployment

### Ràng buộc

#### Chỉ hỗ trợ single container

App Runner chỉ hỗ trợ **một container duy nhất**. Không thể chạy đồng thời nhiều containers. Về điểm này, nó khác hoàn toàn với ECS hay EKS.

#### Không hỗ trợ persistent storage

- Sử dụng temporary storage trong khi chạy
- Dữ liệu bị mất khi container kết thúc
- Cần external DB hoặc storage service cho dữ liệu cần lưu trữ lâu dài

### Use cases

App Runner phù hợp cho các tình huống sau:

1. **Public các web application nhỏ**
2. **Triển khai backend API cho ứng dụng bên ngoài**
3. **Kiểm thử hoạt động container đang phát triển**

### Mô hình giá

Phí App Runner được tính dựa trên lượng sử dụng host resources (vCPU, memory).

- **Trạng thái idle**: Tính theo memory usage
- **Trạng thái active**: Tính theo vCPU usage + memory usage

Chi tiết xem tại [AWS App Runner Pricing](https://aws.amazon.com/jp/apprunner/pricing/).

## Các bước triển khai

Lần này giới thiệu cách xây dựng dễ dàng từ Management Console (không dùng IaC, để xác nhận tính tiện lợi).

### 0. Chuẩn bị

#### Tạo application

Lần này sử dụng một web bulletin board app đơn giản viết bằng Flask.

**Đặc điểm:**
- Không sử dụng external DB hay storage
- Hiển thị màn hình bằng HTML + CSS
- Tính năng tạo thread và viết bài
- **Tạo bằng Github Copilot**

#### Tạo Dockerfile

Dockerfile để containerize application cũng **được tạo bằng Github Copilot**.

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### 1. Tạo ECR Repository

Tạo repository để lưu trữ container images.

**Các bước:**
1. Mở Amazon ECR console
2. Click "Tạo repository"
3. Nhập tên repository (ví dụ: `ynag_apprunner_ecr`)
4. Tạo với các cài đặt còn lại để mặc định

**Lưu ý:**
Không có parameters nào cần đặc biệt chú ý. Cài đặt mặc định là đủ.

### 2. Build và Push Container Image

Build Docker image ở local và push lên ECR.

#### Build image

```bash
docker build -t apprunner_test .
```

#### Login vào ECR

```bash
aws ecr get-login-password --region us-east-1 --profile <profile> | \
  docker login --username AWS --password-stdin \
  <accountid>.dkr.ecr.us-east-1.amazonaws.com
```

#### Tag image

```bash
docker tag apprunner_test:latest \
  <accountid>.dkr.ecr.us-east-1.amazonaws.com/ynag_apprunner_ecr:latest
```

#### Push image

```bash
docker push <accountid>.dkr.ecr.us-east-1.amazonaws.com/ynag_apprunner_ecr:latest
```

**Xác nhận:**
Có thể xác nhận image đã được push thành công trong ECR console.

### 3. Setup App Runner

#### 3.1 Cài đặt Source và Deploy

**Repository type:** Chọn Container registry

**Provider:** Amazon ECR

**Container image URI:** Chỉ định URI của image đã push lên ECR
```
<accountid>.dkr.ecr.us-east-1.amazonaws.com/ynag_apprunner_ecr:latest
```

**Deploy trigger:** Chọn Automatic
- Deploy tự động khi image được cập nhật

**ECR access role:** Sử dụng có sẵn hoặc tạo mới
- Cần thiết để App Runner pull image từ ECR

#### 3.2 Cài đặt Service

Thực hiện cài đặt chi tiết cho App Runner service.

##### Service settings

- **Service name**: Nhập tên tùy ý
- **vCPU**: Chọn từ 0.25, 0.5, 1, 2, 4
- **Memory**: Chọn trong khoảng 0.5GB~12GB
- **Port**: Port mà application public (với Flask là 5000)

##### Auto-scaling

- **Minimum instances**: Giới hạn dưới của scale down
- **Maximum instances**: Giới hạn trên của scale up
- **Concurrency**: Số lượng concurrent requests mà 1 instance có thể xử lý

##### Health check

- **Protocol**: HTTP hoặc TCP
- **Path**: Health check endpoint (ví dụ: `/health`)
- **Interval**: Khoảng thời gian thực hiện check
- **Timeout**: Thời gian timeout của check
- **Healthy threshold**: Số lần thành công liên tiếp để đánh giá là healthy
- **Unhealthy threshold**: Số lần thất bại liên tiếp để đánh giá là unhealthy

##### Security

- **Instance role**: IAM role khi application truy cập AWS resources
- **KMS key**: Sử dụng để mã hóa biến môi trường (optional)

##### Networking

- **Public method**: 
  - Public: Có thể truy cập từ internet
  - Private: Chỉ có thể truy cập từ trong VPC
- **Outbound communication**: 
  - Public: Qua internet
  - Custom VPC: Qua VPC

##### Observability

- **AWS X-Ray**: Kích hoạt distributed tracing (optional)

##### Tags

- Thêm tags để quản lý resources (optional)

#### 3.3 Tạo và Deploy

Sau khi xác nhận cài đặt, click "Tạo và deploy".

**Thời gian deploy:**
Việc xây dựng và deploy App Runner service mất vài phút. Có thể xác nhận tiến độ trong console.

### 4. Kiểm tra hoạt động

#### Truy cập Application

Khi deploy hoàn tất, App Runner cung cấp URL.

**Nội dung xác nhận:**
- Màn hình bulletin board hiển thị bình thường
- Có thể tạo thread
- Có thể viết bài

Đã xác nhận application hoạt động bình thường khi thực sự truy cập.

#### Xác nhận Logs

Có thể xác nhận các logs sau từ Management Console.

**Event logs:**
- Các events như khởi động, dừng, deploy service

**Application logs:**
- Logs mà application output

#### Tạm dừng Application

Chọn "Tạm dừng" từ action menu để tạm thời dừng application. Điều này giúp giảm chi phí trong thời gian không sử dụng.

### 5. Kiểm thử Auto-deploy

Kiểm thử tính năng auto-deploy của App Runner.

#### Cập nhật Source Code

Cập nhật một phần của source code application.

#### Rebuild và Push

```bash
# Rebuild image
docker build -t apprunner_test .

# Tag
docker tag apprunner_test:latest \
  <accountid>.dkr.ecr.us-east-1.amazonaws.com/ynag_apprunner_ecr:latest

# Push
docker push <accountid>.dkr.ecr.us-east-1.amazonaws.com/ynag_apprunner_ecr:latest
```

#### Thực hiện Auto-deploy

Khi image mới được push lên ECR, App Runner tự động phát hiện và bắt đầu redeploy.

**Lưu ý:**
Có time lag cho đến khi auto-deploy bắt đầu. Không bắt đầu ngay lập tức nhưng sẽ bắt đầu trong vài phút.

#### Xác nhận cập nhật

Sau khi redeploy hoàn tất, truy cập application và xác nhận nội dung cập nhật đã được phản ánh.

**Về dữ liệu:**
Vì không sử dụng persistent storage, dữ liệu trước đó đã được khởi tạo lại. Đây là điều cần hiểu như một ràng buộc.

## Chi tiết Sample Application

### Technology Stack

- **Framework**: Flask (Python)
- **Frontend**: HTML + CSS
- **Phương pháp tạo**: Sử dụng Github Copilot

### Chức năng

1. **Tạo thread**: Tạo thread mới
2. **Viết bài**: Thêm bài viết vào thread
3. **Hiển thị**: Hiển thị danh sách threads và bài viết

### Kiến trúc

Cấu trúc đơn giản, không sử dụng external DB hay storage. Tất cả dữ liệu được quản lý trên memory (với mục đích kiểm thử).

## Công việc trong tương lai

Để sử dụng App Runner thực tiễn hơn, dự định kiểm thử các điều sau.

### 1. Kết nối với VPC

Cài đặt kết nối VPC để truy cập các private resources (RDS, ElastiCache, v.v.).

### 2. Sử dụng cùng RDS

Kiểm thử cấu hình lưu trữ dữ liệu cần persistence vào RDS.

### 3. Sử dụng cùng S3

Kiểm thử cấu hình sử dụng S3 cho các tính năng như file upload.

## Kết luận

### Ưu điểm

1. **Các bước đơn giản**: Có thể triển khai nhanh chóng mà không cần cài đặt phức tạp
2. **Không cần quản lý infrastructure**: Không cần quan tâm đến VPC, servers, LB
3. **Developer-friendly**: Có thể tập trung vào containers và code
4. **Auto-deploy**: Không cần thao tác deploy thủ công

### Cân nhắc

1. **External dependencies**: Khi cần DB hoặc storage, cần thiết kế riêng
2. **Phạm vi áp dụng**: Không phải trong mọi trường hợp đều "đơn giản"
3. **Khác biệt với ECS/EKS**: Khi cần nhiều containers, cần xem xét các dịch vụ khác

### Tình huống áp dụng

App Runner lý tưởng cho các trường hợp sau.

- Web applications quy mô nhỏ
- API servers
- Môi trường kiểm thử hoạt động container
- Phát triển prototypes

Ngược lại, với kiến trúc microservices phức tạp hoặc khi cần sự phối hợp của nhiều containers, ECS hoặc EKS phù hợp hơn.

## Tài liệu tham khảo

- [AWS App Runner Official Documentation](https://docs.aws.amazon.com/ja_jp/apprunner/)
- [AWS App Runner Pricing](https://aws.amazon.com/jp/apprunner/pricing/)
- [Amazon ECR User Guide](https://docs.aws.amazon.com/ja_jp/ecr/)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

**Tags**: AWS, Docker, AppRunner, 駆け出しエンジニア, BIPROGY_AWS_Ambassador  
**Categories**: AWS, Container, Serverless

**Về tác giả:**  
Với vai trò AWS Ambassador của BIPROGY株式会社, tôi chia sẻ các phương pháp sử dụng thực tiễn của AWS services.
