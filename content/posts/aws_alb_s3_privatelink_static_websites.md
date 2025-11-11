---
title: "Hosting Internal HTTPS Static Website với ALB, S3 và PrivateLink"
date: 2023-11-08
draft: false
categories:
  - "AWS"
  - "Networking"
tags:
  - "ALB"
  - "S3"
  - "PrivateLink"
  - "VPC Endpoint"
  - "Static Website"
author: "Schuyler Jager, Yuya Matsumoto"
translator: "日平"
description: "Hướng dẫn chi tiết cách hosting static website nội bộ với HTTPS sử dụng ALB, S3 và PrivateLink trong môi trường closed network"
---

# Hosting Internal HTTPS Static Website với ALB, S3 và PrivateLink

## Tổng quan

Solution này giới thiệu cách kết hợp Application Load Balancer (ALB), Amazon S3 và AWS PrivateLink để hosting static website với custom domain và HTTPS trong môi trường closed network không kết nối internet.

### Đặc điểm của Solution

- **Môi trường closed network hoàn toàn**: Không cần kết nối internet
- **Hỗ trợ HTTPS**: Giao tiếp bảo mật với ACM certificate
- **Custom domain**: Name resolution với Route53 Private Hosted Zone
- **Khả năng mở rộng**: Kiến trúc serverless
- **High availability**: Độ tin cậy cao nhờ AWS managed services

### Các thành phần của Architecture

1. **Application Load Balancer (Internal)**
   - Triển khai trong private subnet
   - Giao tiếp HTTPS với ACM certificate
   - Hỗ trợ custom domain

2. **Amazon S3**
   - Lưu trữ static content
   - Tên bucket phải khớp với custom domain name của ALB

3. **S3 VPC Endpoint (Interface Endpoint)**
   - Kết nối private từ trong VPC
   - Sử dụng private IP address làm ALB target

4. **Route53 Private Hosted Zone**
   - Name resolution trong VPC
   - Resolve custom domain về ALB

5. **AWS Certificate Manager**
   - Quản lý SSL/TLS certificate
   - Sử dụng cho HTTPS listener của ALB

## Yêu cầu tiên quyết

Trước khi triển khai solution này, hãy chuẩn bị:

1. **AWS Account**: Môi trường triển khai
2. **ACM Certificate**: Cho custom domain (cùng region với ALB)
3. **S3 Bucket**: Cho static content (tên bucket = custom domain name của ALB)
4. **VPC**: Bao gồm private subnet
5. **Kết nối private**: Phương thức kết nối đến VPC (VPN, Direct Connect, v.v.)
6. **Route53 Private Hosted Zone**: Đã associate với VPC
7. **Static content**: Đã upload lên S3
8. **Kiến thức AWS cơ bản**: Hiểu về VPC, ALB, S3

## Các bước triển khai

### Bước 1: Tạo S3 VPC Endpoint

S3 có 2 loại VPC Endpoint:
- **Gateway Endpoint**: Dành cho S3 và DynamoDB
- **Interface Endpoint**: Có private IP address, có thể dùng làm target của ALB

#### Các bước tạo Interface Endpoint

1. Mở VPC console
2. "Endpoints" → "Create endpoint"
3. Cấu hình như sau:
   - **Service category**: AWS services
   - **Service name**: `com.amazonaws.{region}.s3` (type: Interface)
   - **VPC**: Chọn VPC đích
   - **Subnets**: Chọn private subnet (khuyến nghị cùng subnet với ALB)
   - **Security groups**: Cho phép HTTP access từ ALB

#### Xác nhận IP address của Interface Endpoint

```bash
# Xác nhận bằng AWS CLI
aws ec2 describe-network-interfaces \
  --filters "Name=description,Values=*vpce-*" \
  --query 'NetworkInterfaces[*].[PrivateIpAddress]' \
  --output text
```

Network interface của Interface Endpoint giữ nguyên private IP address trong suốt thời gian tồn tại.

#### Xác nhận hoạt động của health check

```bash
# Request đến S3 Interface Endpoint sẽ trả về 307 redirect
curl -v http://10.0.1.xx

# Response mong đợi
HTTP/1.1 307 Temporary Redirect
...
```

### Bước 2: Cấu hình S3 Bucket Policy

Thiết lập bucket policy để cho phép access từ S3 VPC Endpoint.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Access-from-specific-VPCE",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-alb-domain-name",
                "arn:aws:s3:::your-alb-domain-name/*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:SourceVpce": "vpce-xxxxxxxxxxxxxxxxx"
                }
            }
        }
    ]
}
```

**Điểm quan trọng**:
- Chỉ định tên bucket (khớp với custom domain name của ALB) trong `Resource`
- Chỉ định ID của Interface Endpoint đã tạo trong `aws:SourceVpce`
- Cho phép cả `s3:GetObject` và `s3:ListBucket`

### Bước 3: Tạo Target Group

Đăng ký IP address của S3 Interface Endpoint làm target của ALB.

#### Cấu hình Target Group

1. EC2 console → "Target Groups" → "Create target group"
2. Cấu hình cơ bản:
   - **Target type**: IP addresses
   - **Target group name**: Ví dụ `s3-interface-endpoint-tg`
   - **Protocol**: HTTP
   - **Port**: 80
   - **VPC**: Chọn VPC đích

3. Cấu hình health check:
   ```
   Protocol: HTTP
   Path: /
   Success codes: 307
   ```
   
   **Quan trọng**: Chỉ định `307` trong success codes vì S3 Interface Endpoint trả về 307 redirect

4. Đăng ký target:
   - Thêm private IP address của S3 Interface Endpoint
   - Nếu tạo Endpoint ở nhiều AZ, đăng ký tất cả IP

#### Khi health check trở thành Unhealthy

- Xác nhận success codes có chứa `307`
- Xác nhận security group cho phép HTTP (80) access từ ALB

### Bước 4: Tạo Application Load Balancer

Tạo internal ALB và cấu hình HTTPS listener.

#### Cấu hình cơ bản ALB

1. EC2 console → "Load Balancers" → "Create Load Balancer"
2. Chọn Application Load Balancer
3. Cấu hình cơ bản:
   - **Name**: Ví dụ `internal-s3-alb`
   - **Scheme**: internal
   - **IP address type**: IPv4
   - **VPC**: Chọn VPC đích
   - **Subnets**: Private subnets (nhiều AZ)
   - **Security groups**: Cho phép HTTPS (443)

#### Cấu hình HTTPS Listener

1. Phần "Listeners and routing"
2. Thêm listener:
   - **Protocol**: HTTPS
   - **Port**: 443
   - **Default action**: Forward đến Target Group đã tạo
   - **Security policy**: Policy khuyến nghị
   - **Default SSL certificate**: Chọn ACM certificate (cho custom domain)

### Bước 5: Cấu hình Listener Rules

Thiết lập listener rules của ALB để redirect đến index.html của S3.

#### Rule 1: Redirect từ root path đến index.html

**Điều kiện**:
- Path: `/` (exact match)

**Action**:
- Type: Redirect
- Protocol: `#{protocol}`
- Port: `#{port}`
- Path: `/index.html`
- Status code: 301

Với cấu hình này, access đến `https://your-domain/` sẽ redirect đến `https://your-domain/index.html`.

#### Rule 2: Forward các request khác đến Target Group

**Điều kiện**:
- Path: `/*` (tất cả)

**Action**:
- Type: Forward
- Target group: S3 Target Group đã tạo

**Thứ tự ưu tiên của rules**:
1. Root path redirect (ưu tiên cao)
2. Target group forward (ưu tiên thấp)

### Bước 6: Cấu hình Route53 Private Hosted Zone

Tạo A record để resolve custom domain về ALB.

#### Các bước tạo A record

1. Mở Route53 console
2. Chọn Private Hosted Zone
3. "Create record":
   - **Record name**: Custom domain (ví dụ: `app.example.internal`)
   - **Record type**: A
   - **Alias**: Yes
   - **Route traffic to**: 
     - Chọn Application Load Balancer
     - Region: Region của ALB
     - Load balancer: ALB đã tạo
   - **Routing policy**: Simple

4. Click "Create record"

#### Xác nhận DNS resolution

```bash
# Xác nhận từ instance trong VPC
nslookup app.example.internal

# Kết quả mong đợi: Private IP address của ALB
```

## Testing và Troubleshooting

### Xác nhận hoạt động cơ bản

1. **Test DNS resolution**:
```bash
nslookup your-custom-domain.internal
# Xác nhận trả về IP address của ALB
```

2. **Test HTTPS connection**:
```bash
curl -v https://your-custom-domain.internal/
# Xác nhận trả về 301 redirect

curl -v https://your-custom-domain.internal/index.html
# Xác nhận trả về 200 OK với content
```

3. **Access từ browser**:
   - Access từ thiết bị đã kết nối đến VPC
   - Xác nhận certificate hợp lệ
   - Xác nhận content hiển thị đúng

### Các vấn đề thường gặp và cách giải quyết

#### Vấn đề 1: Target Unhealthy

**Nguyên nhân**:
- Success codes của health check không chứa 307
- Security group không cho phép access từ ALB

**Giải pháp**:
- Thêm `307` vào success codes trong cấu hình health check của Target Group
- Xác nhận security group của Interface Endpoint

#### Vấn đề 2: Lỗi 403 Forbidden

**Nguyên nhân**:
- S3 bucket policy không được cấu hình đúng
- Tên bucket không khớp với custom domain name của ALB

**Giải pháp**:
- Xác nhận bucket policy cho phép access từ VPC Endpoint
- Xác nhận tên S3 bucket và custom domain name của ALB khớp hoàn toàn

#### Vấn đề 3: Lỗi DNS resolution

**Nguyên nhân**:
- Private Hosted Zone chưa associate với VPC
- A record không được cấu hình đúng

**Giải pháp**:
- Xác nhận VPC association của Private Hosted Zone
- Xác nhận cấu hình A record (alias destination)

#### Vấn đề 4: Lỗi SSL/TLS certificate

**Nguyên nhân**:
- Domain name của ACM certificate không khớp
- Certificate ở region khác

**Giải pháp**:
- Xác nhận ACM certificate ở cùng region với ALB
- Xác nhận domain name của certificate khớp với custom domain

## Best Practices về Security

### 1. S3 Bucket Policy

- Chỉ cho phép access qua VPC Endpoint
- Chỉ cấp quyền tối thiểu cần thiết (GetObject, ListBucket)
- Giới hạn bằng điều kiện `aws:SourceVpce`

### 2. Security Groups

**Security Group của ALB**:
- Inbound: Chỉ cho phép HTTPS (443) từ trong VPC
- Outbound: HTTP (80) đến Interface Endpoint

**Security Group của Interface Endpoint**:
- Inbound: Chỉ cho phép HTTP (80) từ ALB
- Outbound: Không cần

### 3. Network Design

- Khuyến nghị đặt ALB và Interface Endpoint trong cùng private subnet
- Cấu hình high availability trải dài nhiều AZ
- Không cần NAT Gateway (không có internet connection)

### 4. Access Control

- Private Hosted Zone chỉ associate với VPC cụ thể
- Tạo ALB với internal scheme
- Kiểm soát access đến VPC (VPN, Direct Connect, v.v.)

## Tối ưu hóa chi phí

### Các yếu tố chi phí chính

1. **Application Load Balancer**:
   - Phí theo giờ
   - Phí theo LCU (Load Balancer Capacity Unit)

2. **S3 VPC Endpoint (Interface Endpoint)**:
   - Phí theo giờ (mỗi AZ)
   - Phí data processing

3. **Amazon S3**:
   - Phí storage
   - Phí request

4. **Data transfer**:
   - Transfer trong VPC miễn phí
   - Chú ý cross-AZ transfer

### Tips giảm chi phí

- Môi trường dev có thể cân nhắc cấu hình single AZ
- Stop các resource có thể dừng trong thời gian không cần thiết
- Monitor usage bằng CloudWatch metrics
- Xóa content cũ bằng S3 lifecycle policy

## Cleanup

Khi xóa resources, thực hiện theo thứ tự sau:

1. **Xóa Route53 record**
2. **Xóa ALB**
3. **Xóa Target Group**
4. **Xóa S3 VPC Endpoint**
5. **Xóa S3 bucket** (xóa content trước)
6. **Xóa Security groups**
7. **Xóa ACM certificate** (nếu cần)

## Tóm tắt

Solution này cho phép thực hiện:

✅ **Môi trường closed network hoàn toàn**: Hosting static website không cần internet connection
✅ **Giao tiếp bảo mật**: Encrypted communication với HTTPS
✅ **Custom domain**: Access bằng domain name dễ nhớ
✅ **Scalability**: Auto scaling nhờ AWS managed services
✅ **High availability**: Fault tolerance với cấu hình multi-AZ

### Ràng buộc quan trọng

⚠️ **Tên S3 bucket phải khớp hoàn toàn với custom domain name của ALB**

Ràng buộc này xuất phát từ việc S3 sử dụng virtual host-style request (host header) để xác định bucket.

### Scenarios áp dụng

- Internal portal của tổ chức tài chính
- Hệ thống nghiệp vụ của cơ quan công
- Enterprise application có yêu cầu security cao
- Môi trường bị giới hạn external connection do quy định

### Tài liệu tham khảo

- [AWS PrivateLink là gì](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html)
- [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/)
- [VPC Endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html)
- [Ví dụ về S3 Bucket Policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies-vpc-endpoint.html)

Architecture này cho phép hosting modern Web application trong môi trường closed network.
