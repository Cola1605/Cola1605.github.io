---
title: "2025 Edition - Closed Network Static Website Hosting với ALB, S3 và PrivateLink"
date: 2025-11-11
draft: false
categories:
  - "AWS"
  - "Security and Networking"
tags:
  - "ALB"
  - "S3"
  - "PrivateLink"
  - "URL Rewrite"
  - "Header Rewrite"
  - "SPA"
author: "Yuya Matsumoto"
translator: "日平"
description: "Giới thiệu kiến trúc hosting static website mới nhất sử dụng ALB URL/Host Header Rewrite feature, loại bỏ ràng buộc giữa S3 bucket name và ALB custom domain"
---

# 2025 Edition – Closed Network Static Website Hosting với ALB, S3 và PrivateLink

## Giới thiệu

Năm 2023, chúng tôi đã công bố bài viết "[Hosting Internal HTTPS Static Website với ALB, S3 và PrivateLink](https://aws.amazon.com/jp/blogs/news/hosting-internal-https-static-websites-with-alb-s3-and-privatelink/)" giới thiệu cách hosting static website trong môi trường closed network.

Tuy nhiên, phương pháp này có một ràng buộc: **Tên S3 bucket phải khớp với custom domain name của ALB**.

**Ngày 15 tháng 10 năm 2025, Application Load Balancer đã được bổ sung tính năng "URL and Host Header Rewrite"**. Feature mới này giải quyết ràng buộc trên, cho phép cấu hình linh hoạt hơn.

Bài viết này sẽ giải thích cách hosting closed network static website sử dụng feature mới.

## Feature mới: ALB URL and Host Header Rewrite

### Thông báo chính thức

Ngày 15 tháng 10 năm 2025, AWS đã công bố feature mới của Application Load Balancer:

**[Application Load Balancer supports URL and Host Header Rewrite](https://aws.amazon.com/jp/about-aws/whats-new/2025/10/application-load-balancer-url-header-rewrite/)**

Feature này cho phép thực hiện trong listener rules của ALB:
- URL path rewrite
- Host header rewrite
- Query string rewrite

### Vấn đề được giải quyết

Phương pháp truyền thống yêu cầu **custom domain name của ALB phải khớp với tên S3 bucket** vì S3 sử dụng virtual host-style request (host header) để xác định bucket.

Feature mới cho phép **transform host header động trong ALB**, loại bỏ ràng buộc này.

## Tổng quan Architecture

### Cấu hình cơ bản

Architecture của solution này gần như giống với phương pháp truyền thống:

**Các thành phần chính**:
1. Application Load Balancer (Internal)
2. Amazon S3 (static content)
3. S3 Interface Endpoint (VPC Endpoint)
4. Route53 Private Hosted Zone
5. AWS Certificate Manager

**Điểm mới**:
- Transform host header thành S3 bucket name trong listener rules của ALB
- Không cần yêu cầu S3 bucket name khớp với custom domain name của ALB

### Giải thích Architecture Diagram

```
[User (trong VPC)]
    ↓ HTTPS
[Route53 Private Hosted Zone]
    ↓ DNS resolution
[Application Load Balancer]
    ↓ Host header transform (feature mới)
    ↓ HTTP
[S3 Interface Endpoint]
    ↓
[Amazon S3 Bucket]
```

## Điểm quan trọng trong triển khai

### Điểm 1: Đăng ký IP của S3 Interface Endpoint làm ALB target

Phần này giống với phương pháp truyền thống.

#### Loại S3 VPC Endpoint

S3 có 2 loại VPC Endpoint:

1. **Gateway Endpoint**
   - Dành riêng cho S3 và DynamoDB
   - Sử dụng bằng cách thêm vào route table

2. **Interface Endpoint**
   - Có private IP address
   - Có thể đăng ký làm target của ALB
   - Network interface giữ nguyên IP trong suốt thời gian tồn tại

#### Tạo Interface Endpoint

```bash
# Tạo trong VPC console
Service name: com.amazonaws.{region}.s3 (type: Interface)
VPC: Target VPC
Subnets: Private subnets (khuyến nghị cùng với ALB)
Security groups: Cho phép HTTP access từ ALB
```

#### Cấu hình Health Check

HTTP request đến Interface Endpoint trả về **307 Temporary Redirect**:

```bash
curl -v http://10.0.1.xx
# HTTP/1.1 307 Temporary Redirect
```

Do đó, health check của Target Group cần **chỉ định 307 trong success codes**:

```
Protocol: HTTP
Port: 80
Path: /
Success codes: 307
```

### Điểm 2: Thêm host header transform vào listener rules (feature mới)

**Đây là phần quan trọng để tận dụng feature mới**.

#### Vấn đề truyền thống

S3 sử dụng virtual host-style request để xác định bucket:

```bash
# S3 xác định bucket dựa trên host header
curl -v http://10.0.1.xx/test.txt -H "Host: sample-bucket"
```

Request từ ALB chứa custom domain name của ALB trong host header, nên trước đây **bucket name phải khớp với custom domain name**.

#### Giải quyết bằng feature mới

"Host header rewrite feature" của ALB cho phép transform host header động trong ALB.

**Cách cấu hình**:

1. Tạo listener rule của ALB
2. Action type: **Transform Host Header**
3. Host header sau transform: **S3 bucket name**

Điều này thực hiện:
- Request từ user: `Host: app.example.local`
- ALB gửi đến S3: `Host: my-s3-bucket-name`

#### Ví dụ cấu hình

```
Listener Rule:
  Condition: Path = /*
  Action 1: Transform Host Header
    - Transformed host: my-s3-bucket-name
  Action 2: Forward
    - Target group: s3-interface-endpoint-tg
```

#### Lợi ích

✅ Có thể tách biệt S3 bucket name và custom domain name của ALB
✅ Tăng tính linh hoạt trong vận hành
✅ Linh hoạt hơn trong quản lý certificate
✅ Có thể tham chiếu cùng S3 bucket từ nhiều ALB

## Hỗ trợ cho SPA (Single Page Application)

### Phương thức routing của SPA

SPA chủ yếu có 2 phương thức routing:

1. **Hash-based routing**
   - Ví dụ: React HashRouter
   - URL format: `https://app.example.local/index.html#/about`
   - Phần sau `#` được xử lý ở client side

2. **Path-based routing**
   - Ví dụ: React BrowserRouter
   - URL format: `https://app.example.local/about`
   - Cần routing ở server side

### Vấn đề của path-based routing

S3 trả về XML error khi direct access đến path không tồn tại:

```xml
<!-- Direct access đến https://app.example.local/about -->
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
</Error>
```

### Giải pháp 1: Hash-based routing

Sử dụng HashRouter, tất cả request đều hướng đến `index.html`:

```javascript
// Ví dụ với React
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      {/* Route definitions */}
    </HashRouter>
  );
}
```

**Ví dụ URL**:
- Top: `https://app.example.local/index.html#/`
- About: `https://app.example.local/index.html#/about`

**Hạn chế**:
- Direct access đến URL không tồn tại (ví dụ: `/nonexistent`) vẫn gây lỗi
- URL có chứa `#`, trông không tự nhiên

### Giải pháp 2: Sử dụng URL path transform feature

Sử dụng URL path transform feature của ALB có thể tạo URL tự nhiên hơn:

**Cách cấu hình**:

```
Listener Rule 1:
  Condition: Path = /
  Action 1: Transform URL Path
    - Transformed path: /index.html
  Action 2: Transform Host Header
    - Transformed host: my-s3-bucket-name
  Action 3: Forward
    - Target group: s3-interface-endpoint-tg

Listener Rule 2:
  Condition: Path = /*
  Action 1: Transform Host Header
    - Transformed host: my-s3-bucket-name
  Action 2: Forward
    - Target group: s3-interface-endpoint-tg
```

Kết quả:
- `https://app.example.local/` → Trả về `index.html`
- `https://app.example.local/#/about` → Xử lý bằng HashRouter

**Lợi ích**:
- Root path hiển thị được mà không cần `index.html`
- Kết hợp sử dụng với hash routing
- URL hiển thị clean hơn

## Tóm tắt các bước triển khai

Tham khảo [bài viết truyền thống](https://aws.amazon.com/jp/blogs/news/hosting-internal-https-static-websites-with-alb-s3-and-privatelink/) để biết các bước chi tiết. Điểm khác biệt chính:

### So sánh với phương pháp truyền thống

| Mục | Phương pháp truyền thống | 2025 Edition (sử dụng feature mới) |
|-----|------------------------|-----------------------------------|
| S3 bucket name | Bắt buộc khớp với ALB domain name | Tên tùy ý OK |
| Listener rules | Chỉ path forwarding | Thêm host header transform |
| Tính linh hoạt vận hành | Có ràng buộc | Linh hoạt |
| URL path transform | Không sử dụng được | Có thể sử dụng |

### Điểm thay đổi chính

**Step 5: Cấu hình Listener Rules (đã cập nhật)**

```
Truyền thống:
  Action: Forward → Target Group

Sử dụng feature mới:
  Action 1: Transform Host Header → S3 bucket name
  Action 2: Forward → Target Group
```

## Best Practices

### 1. Đặt tên S3 Bucket

Feature mới cho phép đặt tên bucket tùy ý, nhưng khuyến nghị:

✅ **Khuyến nghị**:
- Bao gồm tên project hoặc mục đích sử dụng
- Ví dụ: `myproject-internal-web-hosting`

❌ **Không khuyến nghị**:
- Không cần khớp với custom domain name
- Nhưng nên đặt tên dễ hiểu

### 2. Security

Áp dụng best practices giống phương pháp truyền thống:

- S3 bucket policy chỉ cho phép access từ VPC Endpoint
- Cấu hình security groups của ALB và Interface Endpoint phù hợp
- Private Hosted Zone chỉ associate với VPC cụ thể

### 3. High Availability

- Tạo Interface Endpoint ở nhiều AZ
- Đăng ký tất cả Endpoint IP vào Target Group
- Triển khai ALB ở nhiều AZ

### 4. Monitoring

- Monitor ALB metrics (request count, latency)
- Monitor Target Group health checks
- Monitor S3 metrics (request count, error rate)

## Troubleshooting

### Vấn đề 1: Host header transform không hoạt động

**Triệu chứng**: Lỗi 403 Forbidden

**Điểm kiểm tra**:
- Thứ tự action trong listener rule có đúng không
  - Host header transform → Forward
- Host name sau transform có khớp với S3 bucket name không
- S3 bucket policy có được cấu hình đúng không

### Vấn đề 2: Routing của SPA không hoạt động

**Triệu chứng**: XML error khi direct access đến path cụ thể

**Giải pháp**:
- Cân nhắc sử dụng HashRouter
- Transform `/` thành `/index.html` bằng URL path transform
- Thêm rule trả về `index.html` cho tất cả paths (`/*`) (không khuyến nghị: ảnh hưởng performance)

### Vấn đề 3: Target Unhealthy

**Triệu chứng**: Target trong Target Group ở trạng thái Unhealthy

**Điểm kiểm tra**:
- Success codes của health check có chứa `307` không
- Security group có cho phép access từ ALB không
- Interface Endpoint có hoạt động bình thường không

## So sánh chi phí

So với phương pháp truyền thống, **hầu như không phát sinh thêm chi phí**:

| Yếu tố chi phí | Phương pháp truyền thống | 2025 Edition |
|----------------|-------------------------|--------------|
| ALB | Giống nhau | Giống nhau |
| S3 Interface Endpoint | Giống nhau | Giống nhau |
| S3 storage | Giống nhau | Giống nhau |
| Data transfer | Giống nhau | Giống nhau |

Sử dụng host header transform feature **không phát sinh phí bổ sung**.

## Tóm tắt

### Lợi ích của feature mới

✅ **Tăng tính linh hoạt**: Có thể tách biệt S3 bucket name và custom domain name của ALB
✅ **Cải thiện vận hành**: Có thể tham chiếu cùng S3 bucket từ nhiều ALB
✅ **Quản lý certificate**: Có thể đặt tên bucket không phụ thuộc domain name
✅ **Không phát sinh chi phí**: Có thể sử dụng miễn phí như một tính năng ALB hiện có

### Scenarios áp dụng

Phương pháp này đặc biệt hiệu quả cho các trường hợp:

- **Internal portal của tổ chức tài chính**: Hosting bảo mật trong môi trường closed network hoàn toàn
- **Hệ thống nghiệp vụ của cơ quan công**: Hệ thống đối tượng chuẩn hóa Government Cloud
- **Enterprise internal app**: Môi trường đáp ứng yêu cầu security cao
- **SPA application**: Frontend hiện đại như React, Vue.js

### Lựa chọn giữa phương pháp truyền thống và mới

| Scenario | Phương pháp khuyến nghị |
|----------|------------------------|
| Xây dựng mới | **2025 Edition (sử dụng feature mới)** |
| Môi trường hiện tại (không vấn đề) | Tiếp tục sử dụng OK |
| Môi trường hiện tại (gặp vấn đề với ràng buộc) | **Chuyển sang 2025 Edition** |

## Tài liệu tham khảo

### AWS Official Documentation

- [Application Load Balancer URL and Host Header Rewrite](https://aws.amazon.com/jp/about-aws/whats-new/2025/10/application-load-balancer-url-header-rewrite/)
- [Phương pháp truyền thống (2023 Edition)](https://aws.amazon.com/jp/blogs/news/hosting-internal-https-static-websites-with-alb-s3-and-privatelink/)
- [Sử dụng serverless architecture trong closed network](https://aws.amazon.com/jp/blogs/news/serverless-spa-in-closed-network/)
- [VPC Endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html)
- [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/)

### Kết luận

Feature mới của ALB được thêm vào tháng 10 năm 2025 đã làm cho static website hosting trong môi trường closed network linh hoạt hơn. Ràng buộc truyền thống được giải quyết, giảm gánh nặng vận hành và quản lý.

Từ ngành tài chính, công đến các môi trường có yêu cầu security cao, hãy cân nhắc architecture này khi sử dụng cloud.

---

**Về tác giả**

Yuya Matsumoto
- AWS Japan - Public Sector
- Solutions Architect
- Chuyên môn: Hỗ trợ kỹ thuật cho cơ quan chính quyền địa phương, Hỗ trợ migration hệ thống chuẩn hóa Government Cloud, Hỗ trợ ứng dụng Generative AI
