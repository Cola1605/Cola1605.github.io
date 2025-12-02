---
title: "Xây dựng REST API Có Khả Năng Mở Rộng với Amazon API Gateway Private Integration và Application Load Balancer"
slug: aws-api-gateway-alb-private-integration
date: 2025-12-01
categories:
  - Cloud Computing
  - Development
tags:
  - API Gateway
  - Application Load Balancer
  - VPC Link v2
  - REST API
  - Microservices
  - Cost Optimization
  - AWS Architecture
description: "Amazon API Gateway REST API giờ đây hỗ trợ tích hợp riêng tư với Application Load Balancer (ALB). Tính năng mới này loại bỏ nhu cầu Network Load Balancer (NLB) trung gian, đơn giản hóa kiến trúc, giảm chi phí và nâng cao hiệu năng."
---

Hôm nay, Amazon API Gateway REST API công bố hỗ trợ tích hợp riêng tư (private integration) với Application Load Balancer (ALB). Tính năng mới này cho phép bạn public ứng dụng dựa trên VPC một cách an toàn thông qua REST API mà không cần expose ALB ra public internet.

## Bối Cảnh

Trước đây, khi kết nối API Gateway với private ALB, bạn phải đặt một Network Load Balancer (NLB) ở giữa, điều này làm tăng chi phí và độ phức tạp. Hiện tại, bạn có thể tích hợp trực tiếp API Gateway với private ALB mà không cần NLB, giảm overhead vận hành và tối ưu hóa chi phí.

## Kiến Trúc Truyền Thống: Kết Nối API Gateway với Private ALB

Trong kiến trúc truyền thống, bạn phải đặt một NLB ở giữa API Gateway và private ALB.

### Các Thành Phần Kiến Trúc

1. **API Gateway**: Nhận request từ client
2. **Network Load Balancer (trung gian)**: Hoạt động như bridge giữa API Gateway và ALB
3. **Application Load Balancer**: Cung cấp load balancing layer 7 và khả năng authentication/authorization
4. **Ứng Dụng Dựa Trên VPC**: Backend service thực tế

### Thách Thức Của Kiến Trúc Truyền Thống

- **Chi phí bổ sung**: Phí theo giờ và Network Load Balancer Capacity Units (NLCU) cho NLB
- **Overhead quản lý**: Cần provisioning, cấu hình, quản lý và monitoring load balancer trung gian
- **Network latency**: Tăng latency do thêm network hop
- **Điểm lỗi tiềm ẩn**: Nhiều infrastructure component hơn đồng nghĩa với nhiều điểm lỗi tiềm ẩn hơn

Nhiều khách hàng đã sử dụng kiến trúc này để xây dựng và vận hành production workload, chứng minh độ tin cậy cho ứng dụng business-critical.

## Kiến Trúc Mới: Kết Nối API Gateway với Private ALB

Với tích hợp trực tiếp private ALB, kiến trúc trở nên đơn giản và hiệu quả hơn.

### Các Thành Phần Kiến Trúc Mới

1. **API Gateway**: Nhận request từ client
2. **VPC Link v2**: Cung cấp kết nối an toàn giữa API Gateway và ALB
3. **Application Load Balancer**: Load balancing layer 7 với kết nối trực tiếp
4. **Ứng Dụng Dựa Trên VPC**: Backend service

### Cải Tiến Của Kiến Trúc Mới

- **Loại bỏ NLB trung gian**: Không cần NLB, đơn giản hóa infrastructure
- **Giảm network hop**: Traffic flow trực tiếp từ API Gateway đến ALB trong AWS network
- **Data flow hiệu quả**: Tránh các hop không cần thiết, giảm latency
- **Sử dụng tính năng ALB hiệu quả**: Load balancing layer 7, authentication và authorization được sử dụng hiệu quả hơn

## Lợi Ích Của Tích Hợp Trực Tiếp Giữa API Gateway và Private ALB

### 1. Đơn Giản Hóa Kiến Trúc và Tối Ưu Vận Hành

- **Không cần provisioning**: Không cần provisioning, cấu hình, quản lý và monitoring NLB trung gian
- **Giảm overhead vận hành**: Giảm số lượng infrastructure component cần quản lý
- **Giảm điểm lỗi**: Ít component hơn đồng nghĩa với ít điểm lỗi tiềm ẩn hơn
- **Giảm latency**: Traffic flow trực tiếp từ API Gateway đến ALB trong AWS network, giảm network hop

### 2. Cải Thiện Khả Năng Mở Rộng

**Quan Hệ 1-Nhiều của VPC Link v2**

- Một VPC Link v2 duy nhất cho phép API Gateway tích hợp với nhiều ALB hoặc NLB trong VPC
- Lý tưởng cho quản lý ứng dụng phức tạp với nhiều microservice (mỗi service có ALB riêng)
- Khi ứng dụng phát triển và thêm nhiều service/load balancer hơn, có thể mở rộng mà không cần provisioning thêm VPC Link

**Tính Linh Hoạt Trong Quản Lý**

- Giảm overhead quản lý
- Cung cấp tính linh hoạt lớn hơn trong việc mở rộng kiến trúc
- Dễ dàng mở rộng infrastructure trong khi duy trì hiệu quả vận hành

### 3. Tối Ưu Hóa Chi Phí

**Giảm Chi Phí NLB**

- Giảm phí theo giờ cho việc chạy NLB
- Giảm phí Network Load Balancer Capacity Units (NLCU) sử dụng mỗi giờ
- Với tổ chức chạy nhiều môi trường hoặc nhiều API, có thể tiết kiệm hàng nghìn đô la mỗi năm

**Hiệu Quả Hóa Data Transfer**

- Traffic flow trực tiếp từ API Gateway đến ALB trong AWS network
- Tránh các hop không cần thiết có thể phát sinh nhiều phí data transfer hơn
- Giảm network latency, đồng thời cải thiện performance

## Bắt Đầu

Tutorial này sẽ hướng dẫn setup sử dụng cả AWS Management Console và AWS Command Line Interface (AWS CLI).

### Điều Kiện Tiên Quyết

- Đã có internal ALB được cấu hình trong VPC
- Có quyền truy cập vào AWS Management Console hoặc AWS CLI

### Bước 1: Tạo VPC Link v2

Bước đầu tiên là tạo VPC Link v2 cho phép API Gateway route traffic đến internal ALB.

#### Các Bước Trên Console

1. Truy cập API Gateway console
2. Trong navigation pane bên trái, chọn **VPC links**
3. Chọn **Create VPC link**
4. Chọn **VPC link v2** làm VPC Link type
5. Nhập tên dễ hiểu cho VPC Link
6. Chọn VPC và subnet nơi ALB tồn tại
   - Để đạt high availability, chọn subnet từ nhiều AWS Availability Zone (AZ) khớp với cấu hình ALB
7. Gán một hoặc nhiều security group cho VPC Link
   - Các security group này kiểm soát traffic flow giữa API Gateway và VPC
8. Chọn **Create** và đợi VPC Link status thành **Available** (có thể mất vài phút)

#### Thực Hiện Với AWS CLI

```bash
# Tạo VPC Link v2
aws apigatewayv2 create-vpc-link \
    --name "test-vpc-link-v2" \
    --subnet-ids "<your-subnet1-id>" "<your-subnet2-id>" \
    --security-group-ids "<your-security-group-id>" \
    --region <your-AWS-region>

# Kiểm tra status của VPC Link v2
aws apigatewayv2 get-vpc-link \
    --vpc-link-id "<your-vpc-link-v2-id>" \
    --region <your-AWS-region>
```

### Bước 2: Tạo REST API và Cấu Hình Integration

Khi VPC Link v2 available, bước tiếp theo là tạo REST API và cấu hình sử dụng VPC Link.

#### Các Bước Trên Console

1. Trong API Gateway console, chọn **Create API**
2. Chọn **REST API**
3. Nhập tên API và chọn **Create API**
4. Chọn **Actions** sau đó chọn **Create resource** để tạo resource mới
   - Resource này đại diện cho endpoint của API
5. Chọn **Actions** sau đó chọn **Create method** để tạo method
   - Method định nghĩa loại request API chấp nhận (GET, POST, v.v.)
6. Cấu hình integration:
   - Chọn **VPC link** làm integration type
   - Chọn HTTP method cho backend integration
   - Chọn **VPC Link v2** vừa tạo
   - Chỉ định **ALB** làm integration target
   - Nhập endpoint URL cho integration (port được chỉ định trong URL sẽ được sử dụng để route request đến backend)
   - Cấu hình **Integration timeout**

#### Thực Hiện Với AWS CLI

```bash
# Tạo REST API
aws apigateway create-rest-api \
    --name "test-rest-api" \
    --description "REST API integration with internal ALB via VPC link v2" \
    --region <your-AWS-region>

# Lấy root resource ID của REST API
aws apigateway get-resources \
    --rest-api-id "<your-rest-api-id>" \
    --region <your-AWS-region>

# Tạo resource mới
aws apigateway create-resource \
    --rest-api-id "<your-rest-api-id>" \
    --parent-id "<your-parent-id>" \
    --path-part "internal-alb" \
    --region <your-AWS-region>

# Tạo method mới
aws apigateway put-method \
    --rest-api-id "<your-rest-api-id>" \
    --resource-id "<your-resource-id>" \
    --http-method ANY \
    --authorization-type NONE \
    --region <your-AWS-region>

# Tạo integration
aws apigateway put-integration \
    --rest-api-id "<your-rest-api-id>" \
    --resource-id "<your-resource-id>" \
    --http-method ANY \
    --type HTTP_PROXY \
    --integration-http-method ANY \
    --uri "http://test-internal-alb.com/test" \
    --connection-type VPC_LINK \
    --connection-id "<your-vpc-link-v2-id>" \
    --integration-target "<your-ALB-arn>" \
    --region <your-AWS-region>
```

### Bước 3: Deploy và Test

Sau khi cấu hình API, deploy và verify hoạt động chính xác.

#### Các Bước Deploy

1. Chọn **Deploy API** để tạo deployment mới cho API
2. Tạo stage mới (ví dụ: "test")
   - Stage cho phép quản lý nhiều version của API
3. Sau khi deploy, API endpoint URL sẽ được hiển thị
   - Copy URL này vì cần thiết để test

#### Thực Hiện Với AWS CLI

```bash
# Tạo deployment mới cho test stage
aws apigateway create-deployment \
    --rest-api-id "<your-rest-api-id>" \
    --stage-name "test" \
    --region <your-AWS-region>
```

#### Test API

Test API integration sử dụng lệnh curl:

```bash
curl https://<rest-api-id>.execute-api.<your-aws-region>.amazonaws.com/internal-alb
{"message": "Hello from internal ALB"}
```

### Bước 4: Mở Rộng VPC Link v2

Một VPC Link duy nhất có thể kết nối với nhiều ALB hoặc NLB trong VPC, đơn giản hóa quản lý infrastructure.

#### Ví Dụ Tích Hợp Nhiều Service

Ví dụ này cho thấy cách API Gateway sử dụng một VPC Link v2 duy nhất để tích hợp với nhiều internal service (ví dụ: orders service và payments service), mỗi service có ALB riêng.

```bash
# Integration cho orders service (ALB-1)
aws apigateway put-integration \
    --rest-api-id "<your-rest-api-id>" \
    --resource-id "<orders-resource-id>" \
    --http-method ANY \
    --type HTTP_PROXY \
    --integration-http-method ANY \
    --uri "<your-orders-alb-endpoint>" \
    --connection-type VPC_LINK \
    --connection-id "<your-vpc-link-v2-id>" \
    --integration-target "<your-orders-alb-arn>" \
    --region "<your-aws-region>"

# Integration cho payments service (ALB-2)
aws apigateway put-integration \
    --rest-api-id "<your-rest-api-id>" \
    --resource-id "<payments-resource-id>" \
    --http-method ANY \
    --type HTTP_PROXY \
    --integration-http-method ANY \
    --uri "<your-payments-alb-endpoint>" \
    --connection-type VPC_LINK \
    --connection-id "<your-vpc-link-v2-id>" \
    --integration-target "<your-payments-alb-arn>" \
    --region "<your-aws-region>"
```

**Quan trọng**: Lưu ý cả hai integration đều sử dụng cùng VPC Link ID.

Để có hướng dẫn chi tiết từng bước, xem tài liệu chính thức trong [API Gateway Developer Guide](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/private-integration.html).

## Use Case

Private ALB integration với API Gateway cho phép các architecture pattern giải quyết thách thức enterprise.

### 1. Microservices Trên Amazon ECS và Amazon EKS

Việc public microservice chạy trên Amazon ECS hoặc Amazon EKS trở nên đơn giản hơn với integration này.

**Lợi Ích**:

- Không cần expose ALB ra public internet
- Không cần sử dụng pattern NLB proxy phức tạp
- Path-based routing an toàn đến các service khác nhau

### 2. Kiến Trúc Hybrid Cloud

Thông qua AWS Direct Connect hoặc AWS Site-to-Site VPN, đạt được kết nối seamless và an toàn giữa cloud-native API và on-premise resource.

**Lợi Ích**:

- Kết nối an toàn giữa cloud và on-premise
- Routing linh hoạt dựa trên HTTP method và header
- Integration seamless với các internal system khác nhau

### 3. Modernization Enterprise

Cho phép migration dần dần từ monolithic architecture sang microservice, thúc đẩy application modernization từng bước.

**Lợi Ích**:

- Migration dần dần trong khi duy trì operational continuity
- Migration sang kiến trúc mới với rủi ro tối thiểu
- Có thể route traffic giữa legacy component và component mới

## Tổng Kết

Direct private integration giữa API Gateway REST API và ALB làm mạnh mẽ hơn API architecture trên AWS. Bằng cách đơn giản hóa infrastructure và giảm operational overhead, tính năng này cải thiện performance và hiệu quả của ứng dụng API-driven.

### Điểm Chính

- **Không cần NLB**: Loại bỏ NLB trung gian, đơn giản hóa kiến trúc
- **Giảm chi phí**: Giảm phí theo giờ và phí NLCU của NLB, với nhiều môi trường có thể tiết kiệm hàng nghìn đô la mỗi năm
- **Hiệu quả vận hành**: Giảm gánh nặng provisioning, cấu hình, quản lý và monitoring
- **Khả năng mở rộng**: Một VPC Link v2 duy nhất có thể kết nối với nhiều ALB/NLB
- **Cải thiện performance**: Giảm network hop và latency

### Tính Khả Dụng

Tính năng này available ngay hôm nay trong tất cả AWS region nơi VPC Link v2 và ALB available.

### Bước Tiếp Theo

Bạn có thể bắt đầu ngay bằng cách truy cập API Gateway console và tạo VPC Link v2 đầu tiên cho direct integration với ALB.

Để biết thêm chi tiết, xem các tài nguyên sau:

- [API Gateway Product Page](https://aws.amazon.com/jp/api-gateway/)
- [Chi Tiết Pricing](https://aws.amazon.com/jp/api-gateway/pricing/)
- [Developer Documentation](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/welcome.html)
- [Private Integration Guide](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/private-integration.html)

---

**Tác giả**: Vijay Menon (Principal Solutions Architect), Christian Silva (Senior Solutions Architect)  
**Dịch bởi**: Yuya Matsumoto  
**Ngày xuất bản**: 01/12/2025  
**Bài gốc**: [Build scalable REST APIs using Amazon API Gateway private integration with Application Load Balancer](https://aws.amazon.com/blogs/compute/build-scalable-rest-apis-using-amazon-api-gateway-private-integration-with-application-load-balancer/) (Xuất bản ngày 21/11/2025)
