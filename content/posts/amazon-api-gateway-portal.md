---
title: "Amazon API Gateway Portal: Cải thiện khả năng khám phá API với Developer Portal được quản lý hoàn toàn"
date: 2025-12-03T10:00:00+09:00
draft: false
categories: ["Cloud", "DevOps and Infrastructure", "Development"]
tags: ["Amazon API Gateway", "API Portal", "Developer Portal", "API Documentation", "AWS", "Amazon Cognito", "AWS RAM", "CloudWatch"]
author: "AWS Compute Blog"
description: "Amazon API Gateway Portal - giải pháp developer portal được quản lý hoàn toàn cho phép tạo portal API chuyên nghiệp trong vài phút, với tính năng portal product, Try it interactive, cross-account sharing qua AWS RAM, và access control linh hoạt với Amazon Cognito."
---

## Tổng quan

Amazon API Gateway vừa ra mắt **API Gateway Portal** - một tính năng portal được quản lý hoàn toàn (fully managed), giúp API provider không cần sử dụng static website, open-source solution, hoặc third-party product để xây dựng developer portal.

Các phương pháp truyền thống thường dẫn đến:
- API lifecycle management bị phân mảnh
- Chi phí tăng cao
- Khó bảo trì

API Gateway Portal tích hợp với API Gateway service và cung cấp:
- **API Product Organization**: Nhóm API theo business logic
- **Interactive Testing**: Tính năng Try it để test API trực tiếp từ portal
- **Comprehensive Documentation**: API reference tự động sync + supplemental docs
- **Integrated Analytics**: Hiển thị consumer behavior

Solution này xử lý infrastructure, security, và scalability, cho phép API provider tập trung vào việc tạo API có giá trị và developer experience xuất sắc.

## Portal Product là gì?

**Portal Product** là nhóm logic của các REST API, bao gồm documentation được tạo và publish cho consumer.

### Tổ chức theo Business Logic

Bạn có thể trình bày API theo business logic thay vì technical architecture.

**Ví dụ cụ thể**:
Dịch vụ nhận nuôi thú cưng:
- **AdoptAnimals Portal Product**: Endpoints về chó (từ API A) + endpoints về mèo (từ API B)
- **AdoptProcess Portal Product**: Tính năng quản lý user

Bạn có thể nhóm endpoints từ nhiều API và stage thành một product offering nhất quán cho consumer.

### Sử dụng trong Enterprise

Với doanh nghiệp quản lý portfolio API rộng lớn, API Gateway Portal cung cấp centralized catalog của API cho toàn bộ business group, đạt được:

- Giảm duplicate work
- Cải thiện standardization
- Ownership rõ ràng
- Controlled access

## Các tính năng chính

### 1. Customizable Portal Experience

**Branding**:
- Custom logo
- Color scheme

**Domain Setup**:
- Custom domain name với SSL certificate được quản lý bởi AWS Certificate Manager
- Hoặc sử dụng default domain structure do AWS cung cấp

### 2. Flexible Access Control

**Tích hợp Amazon Cognito**:
- Portal có thể public access
- Hoặc yêu cầu authentication

**Enterprise-grade Features**:
- Multi-factor authentication
- Password policy
- User lifecycle management
- Cost-effective, customizable, secure, scalable

**Federation**:
Hỗ trợ federation với SAML và OpenID Connect identity provider cho tổ chức có existing identity system.

### 3. Cross-Account API Organization

**AWS RAM Integration**:
Portal hỗ trợ cross-account portal product sharing sử dụng AWS Resource Access Manager (RAM).

**Governance Benefits**:
- **Unified API Catalog**: Quản lý tập trung toàn tổ chức
- **Maintain Flexibility**: API provider phát triển và maintain API trong own account
- **Retain Control**: Account được share không thể modify property, API provider giữ control

**Enterprise Customer Benefits**:
- Centralized discovery
- Standardization
- Reduce duplication
- Clear ownership
- Controlled access

### 4. Comprehensive Documentation

**Auto-sync**:
API reference documentation được sync từ API definition

**Supplemental Documentation**:
- Guides
- Use cases
- Integration examples

### 5. Search, Discovery, và Interactive API Exploration

**Catalog Search**:
Consumer có thể search toàn bộ catalog

**Intuitive Navigation**:
Customizable organization giúp user tìm endpoint phù hợp với nhu cầu

**Try it Feature**:
- Test API trực tiếp từ portal
- Input request parameter, header
- Xem live response
- Rút ngắn time-to-value cho API integration

**Built-in Limits**:
Có các giới hạn tích hợp cho security và cost management, không ảnh hưởng đến production API performance.

## Access Control và Governance

### Identity và Access Management

Tích hợp Cognito user pool cung cấp:
- Multi-factor authentication
- Password policy
- User lifecycle management
- Enterprise-grade, cost-effective
- Customizable, secure, scalable

### API Authorization

Portal tôn trọng existing authorization mechanism:
- AWS IAM
- Lambda authorizer
- Cognito user pool

Portal access không bypass established security control.

### Cross-Account Governance

Khi share qua AWS RAM:
- **API Owner**: Giữ full control bao gồm authorization strategy, integration setting, stage configuration
- **Portal Owner**: Có thể sử dụng shared portal product nhưng không thể modify underlying API configuration

### Audit và Monitoring

**AWS CloudTrail**:
Tất cả portal management activity được tích hợp với CloudTrail cho comprehensive audit log

**Amazon CloudWatch RUM**:
- Thực hiện real user monitoring
- Thu thập và hiển thị analytics về API consumer gần như real-time

### Resource Limits

**Built-in Quota**:
- Rate limit cho API testing
- Payload size limit
- Integration timeout limit

Các giới hạn này ngăn Try it feature ảnh hưởng đến production API performance.

## Cách bắt đầu

### Bước 1: Tạo Portal Product

1. Vào **API Gateway console**, chọn **Portal Products** từ main navigation
2. Chọn **Create portal product**, chỉ định:
   - Name
   - Description
   - Visibility setting
3. **Chọn endpoint** để include vào portal product:
   - Toàn bộ API stage
   - Specific resource và method
   - Rename endpoint với user-friendly name
4. System tự động **import API documentation**
   - Có thể improve sau với additional context, use case, example
5. **Organize product endpoint** vào custom category
   - Phản ánh business logic chứ không phải technical implementation detail

### Bước 2: Setup Developer Portal

1. Chọn **Developer Portal** từ API Gateway console navigation
2. Chỉ định **portal name, description, domain setting**
3. **Chọn domain**:
   - Thêm prefix vào default AWS domain
   - Setup custom domain name với own SSL certificate
4. **Cấu hình access control**:
   - Internal portal: Yêu cầu Amazon Cognito authentication
   - Public portal: Cho phép anonymous access vào documentation
5. **Branding**:
   - Upload logo
   - Chọn color theme phù hợp với brand identity
6. **Thêm portal product**:
   - Product từ own account
   - Product được share từ account khác qua AWS RAM
   - Cung cấp search và filtering capability

### Bước 3: Preview và Publish

**Preview**:
Trước khi publish portal, sử dụng preview feature để xem consumer experience:
- Navigation
- Documentation
- API testing capability

**Publish**:
Khi hài lòng với configuration, chọn **Publish portal** để consumer có thể access.

**Timing**:
- Publish process thường hoàn thành trong vài phút
- API Gateway cung cấp final portal URL để phân phối cho consumer

## Key Benefits

### Loại bỏ độ phức tạp của custom API documentation site

Không cần build và maintain static site, OSS, hoặc third-party tool.

### Professional Developer Experience

Developer có experience giàu tính năng để discover và test API ngay lập tức.

### Hoàn toàn trong AWS

Mọi thứ stay trong AWS, tích hợp với:
- **CloudWatch**: Comprehensive observability
- **CloudTrail**: Built-in security và audit
- **Simplified Operations**: Không cần quản lý infrastructure

## Kết luận

API Gateway Portal giản hóa API discovery experience:

- ✅ **Fully Managed**: Không cần quản lý infrastructure
- ✅ **Setup trong vài phút**: Không cần build phức tạp
- ✅ **Enterprise-grade**: Security và governance feature tích hợp
- ✅ **Flexible Organization**: Trình bày API theo business logic
- ✅ **Interactive Testing**: Try it feature để test API ngay lập tức
- ✅ **Cross-Account Sharing**: Unified catalog và maintain control
- ✅ **Comprehensive Observability**: Tích hợp CloudWatch và CloudTrail

## Next Steps

Cách bắt đầu:

1. **[API Gateway Console](https://console.aws.amazon.com/apigateway/)** - Tạo portal đầu tiên
2. **[Developer Guide](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-portals.html)** - Follow step-by-step tutorial
3. **[Serverless Land](https://serverlessland.com/api-gateway)** - Học chi tiết về API development

---

**Tác giả**: Yuya Matsumoto (Solutions Architect, AWS)  
**Dịch**: AWS Vietnam Community
