---
title: "Nâng cao User Experience và Security của Application Load Balancer cho SAP trên AWS"
date: 2025-11-14
draft: false
categories: ["AWS", "Business & Technology", "Security & Networking"]
tags: ["SAP on AWS", "Application Load Balancer", "mTLS", "Principal Propagation", "SSO", "Authentication", "RISE with SAP"]
author: "Derek Ewell, Sreenath Middhi, Rajendra Narikimelli, Joachim Aumman, Arne Knoeller, Adam Hill"
translator: "日平"
description: "Hướng dẫn triển khai mTLS authentication và principal propagation với Application Load Balancer để thực hiện Single Sign-On (SSO) từ cloud-native extensions đến SAP ERP systems trên AWS"
---

# Nâng cao User Experience và Security của Application Load Balancer cho SAP trên AWS

**Tác giả**: Derek Ewell, Sreenath Middhi, Rajendra Narikimelli, Joachim Aumman, Arne Knoeller, Adam Hill  
**Dịch giả**: Koshi Matsumoto (松本) & 日平  
**Ngày phát hành**: 14/11/2025  
**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/building-enterprise-ready-hybrid-network-connectivity-on-aws-for-sap-cloud-erp-private-formerly-known-as-rise-with-sap-2/)

---

## Tổng quan

Bài viết giải thích cách triển khai mTLS (Mutual Transport Layer Security) authentication và principal propagation với Application Load Balancer (ALB) trên SAP workloads ở AWS. Đây là hướng dẫn toàn diện để thực hiện Single Sign-On (SSO) từ cloud-native extensions đến SAP ERP systems, nâng cao security và user experience.

## Giới thiệu

Hàng nghìn khách hàng đang chạy SAP workloads trên AWS và mong muốn tăng tốc chuyển đổi quy trình kinh doanh bằng cách xây dựng các cloud-native application extensions trên AWS. Khách hàng tận dụng hơn 200 AWS services để duy trì clean core của ERP system và hợp lý hóa các nâng cấp.

Bài viết này tập trung vào cách tính năng authentication và Mutual TLS (mTLS) của Application Load Balancer (ALB) cho phép trải nghiệm Single Sign-On (SSO) cho SAP users truy cập các SAP resources của mission-critical SAP ERP systems từ cloud-native extensions được host trên AWS.

## Principal Propagation là gì?

**Principal Propagation** là khả năng truyền tải verified identity từ authentication point đến backend systems như SAP mà không cần re-authentication. Điều này cho phép SAP resources tin tưởng identity đã được ALB xác minh và đảm bảo least-privilege access thông qua user authorization.

### Principal Propagation cho phép users chỉ cần sign in một lần

Principal Propagation cho phép users chỉ cần sign in một lần để truy cập nhiều systems một cách an toàn, loại bỏ nhu cầu đăng nhập nhiều lần. Điều này có nghĩa là một khi user được authenticate (ví dụ: qua client certificate tại ALB), identity của họ sẽ được nhận diện và tin tưởng một cách nhất quán bởi các downstream systems như SAP.

## Lợi ích chính của Principal Propagation

### 1. User Experience tốt hơn với Single Sign-On (SSO)

Users chỉ cần authenticate một lần để truy cập nhiều systems và applications, loại bỏ sự bất tiện của các login prompts lặp đi lặp lại và duy trì năng suất trên các platforms khác nhau.

### 2. Tăng cường Security

Bằng cách loại bỏ nhu cầu lưu trữ nhiều credentials và giảm authentication touchpoints, principal propagation tăng cường security posture. Nó cung cấp một security context thống nhất duy trì audit trail rõ ràng và thực thi consistent security policies trên các integrated systems.

### 3. Compliance và Governance

Các tổ chức có thể duy trì compliance tốt hơn với các regulatory requirements thông qua comprehensive user activity tracking và accountability. Principal propagation đảm bảo user actions được ghi nhận và log properly trên tất cả systems.

### 4. Administrative Efficiency

IT teams có thể quản lý user access, permissions và credentials từ một control point duy nhất, đơn giản hóa user lifecycle management và streamline các routine administrative tasks.

### 5. System Integration

Principal propagation hoạt động như một bridge giữa các systems và platforms khác nhau, duy trì user context và authorization nhất quán qua các system boundaries. Integration này rất quan trọng trong các hybrid environments hiện đại nơi applications span multiple platforms và cloud services.

### 6. Giảm chi phí

Các tổ chức hưởng lợi từ việc giảm helpdesk tickets, đơn giản hóa security implementations, và sử dụng resources hiệu quả hơn thông qua centralized management.

## mTLS Authentication hỗ trợ Principal Propagation như thế nào?

Mutual Transport Layer Security (mTLS) authentication thiết lập một secure, two-way encrypted connection giữa client và server. Không giống standard TLS - nơi chỉ server cung cấp certificate - mTLS yêu cầu cả hai parties phải trình bày digital certificates. Cơ chế này cho phép users trải nghiệm seamless authentication với better security posture giữa client và server.

### mTLS Authentication Flow

```
┌──────────┐                           ┌──────────┐
│ Client   │                           │ Server   │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │ 1. Yêu cầu kết nối                   │
     │─────────────────────────────────────>│
     │                                      │
     │ 2. Server trình bày certificate      │
     │<─────────────────────────────────────│
     │                                      │
     │ 3. Client xác minh server cert       │
     │                                      │
     │ 4. Client trình bày certificate      │
     │─────────────────────────────────────>│
     │                                      │
     │ 5. Kết nối an toàn được thiết lập    │
     │<════════════════════════════════════>│
```

Trong mTLS authentication scenario, bạn cần provision cả client và server certificates sử dụng Certificate Authority (CA) để đảm bảo cả hai đều được trusted.

**Authentication Process:**
1. Client yêu cầu kết nối đến server
2. Server trình bày certificate của nó
3. Client xác minh server's certificate
4. Client trình bày certificate của nó để server verify và authenticate
5. Secure connection được thiết lập giữa client và server

## mTLS Client Authentication với Application Load Balancer

ALB hỗ trợ mTLS authentication và cung cấp hai modes: passthrough mode và verify mode.

### mTLS Passthrough Mode

Trong mTLS passthrough mode, ALB forwards toàn bộ client's certificate chain đến backend targets. Điều này được thực hiện thông qua HTTP header có tên `X-Amzn-Mtls-Clientcert`.

**Đặc điểm:**
- Chain bao gồm leaf certificate được gửi trong URL-encoded PEM format sử dụng +, =, / làm safe characters
- Nếu client certificate không có, ALB không thêm header (backend xử lý)
- Backend target chịu trách nhiệm cho client authentication và error handling
- Với HTTPS listeners, ALB terminates client-to-ALB TLS và initiates new ALB-to-backend TLS sử dụng certificate installed trên target
- TLS termination của ALB cho phép sử dụng bất kỳ routing algorithm nào của ALB cho load balancing

### mTLS Verify Mode

Để enable mTLS verify mode, bạn tạo một trust store chứa CA certificate bundle. Điều này có thể đạt được thông qua AWS Certificate Manager (ACM), AWS Private CA, hoặc import your own certificates.

**Tính năng:**
- Quản lý revoked certificates sử dụng Certificate Revocation List (CRL) được lưu trữ trong Amazon S3 và linked đến trust store
- ALB xử lý client certificate validation against trust store, effectively blocking unauthorized requests
- Offload mTLS processing từ backend targets
- Có thể implement logic bổ sung trên backend targets dựa trên certificate details
- Server giữ lại original "host header" information ngay cả khi originated từ non-SAP sources như AWS load balancers terminate SSL connections

### Khuyến nghị

**Chúng tôi khuyến nghị implement mTLS verify mode cho SAP workload deployments trên AWS** vì nó cho phép offload verification và authentication càng sớm càng tốt (tại ALB layer). mTLS verify mode cũng được hỗ trợ trong RISE with SAP on AWS.

**Quan trọng:** Để đảm bảo secure data flow, tất cả SSL (Secure Socket Layer) hoặc TLS certificates được sử dụng trong toàn bộ infrastructure - bao gồm ALB, SAP Web Dispatcher, và S/4HANA system - **phải được issued từ một single trusted Root Certificate Authority** để facilitate việc implement và maintain các certificates này.

## Architecture Pattern cho mTLS Verify Mode

### Tổng quan Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Internet                           │
└────────────────────┬────────────────────────────────┘
                     │
              ┌──────▼──────┐
              │   Client    │
              │  (X.509 cert)│
              └──────┬──────┘
                     │ mTLS
              ┌──────▼──────────────────────┐
              │  Application Load Balancer  │
              │  - mTLS verification        │
              │  - Trust store (S3)         │
              └──────┬──────────────────────┘
                     │ HTTPS
              ┌──────▼──────────────────┐
              │  SAP Web Dispatcher     │
              │  - Certificate verify    │
              └──────┬──────────────────┘
                     │ HTTPS
              ┌──────▼──────────────┐
              │  SAP S/4HANA        │
              │  - Final auth        │
              └─────────────────────┘
```

### Architecture Flow

1. **User Preparation**  
   User cài đặt X.509 certificate trên client device (laptop và/hoặc mobile).

2. **ALB Connection**  
   Client device initiates connection đến ALB và share respective certificates để cả hai có thể verify lẫn nhau. ALB verification leverage Amazon S3 làm trust store.

3. **Web Dispatcher Forward**  
   Sau khi verification hoàn tất, ALB forwards connection đến SAP Web Dispatcher để verify và authenticate.

4. **SAP Final Authentication**  
   SAP Web Dispatcher forwards connection đến SAP instance (S/4HANA, ABAP stack, etc.) để verify và authenticate.

## Các bước Implementation

### 1. Setup Trust Store sử dụng Amazon S3

- Tạo Amazon S3 bucket để lưu trữ private Certificate Authority (CA) và intermediate certificates
- Setup trust store thông qua EC2 console và link đến S3 bucket
- Implement Certificate Revocation List (CRL) để có thêm security controls đối với network connections

### 2. Configure Application Load Balancer (ALB)

- Request SSL public certificate cho ALB sử dụng AWS Certificate Manager
- Tạo HTTPS listener enable mTLS bằng cách associate với requested SSL public certificate
- Tạo dedicated security group cho SAP Web Dispatcher với inbound rules chỉ allow traffic từ ALB
- Tạo target group cho SAP Web Dispatcher và map đến ALB

### 3. Configure SAP Web Dispatcher

- Import root và intermediate certificates vào SAP Web Dispatcher sử dụng `sapgenpse` commands
- Generate SSL public certificate cho SAP Web Dispatcher (từ cùng private CA) và install sử dụng `sapgenpse` commands
- Implement SAP parameter:
  ```
  icm/HTTPS/client_certificate_header_name = x-amzn-mtls-clientcert
  ```

### 4. Configure SAP S/4HANA

- Import root và intermediate certificates vào STRUST transaction của SAP S/4HANA
- Implement SAP parameter với SSL certificate details được assign cho SAP Web Dispatcher:
  ```
  icm/trusted_reverse_proxy
  ```

## Security Considerations

### Tách biệt Inbound Authentication và Target Authentication

- **Inbound Authentication**: Authentication khi agents truy cập Gateway (Cognito JWT)
- **Target Authentication**: Authentication khi Gateway truy cập MCP servers (OAuth 2.0)

Sự tách biệt này cho phép fine-grained access control.

### IAM Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeListeners",
        "elasticloadbalancing:DescribeTrustStores"
      ],
      "Resource": "*"
    }
  ]
}
```

## Chi phí

Thông tin chi tiết về Application Load Balancer pricing có thể được tìm thấy [tại đây](https://aws.amazon.com/elasticloadbalancing/pricing/).

### Pricing Example

**Giả định:**
- S/4HANA application nhận trung bình 1 new connection mỗi giây
- Mỗi connection kéo dài 2 phút
- Clients gửi trung bình 5 requests mỗi giây
- Tổng request và response processed bytes là 300 KB mỗi giây
- 1 rule được configure
- 1 trust store được associate cho Mutual TLS scenario
- US East (N. Virginia) region pricing

**Tính toán:**
- **New connections**: 0.04 LCU
- **Active connections**: 0.04 LCU
- **Processed bytes**: 1.08 LCU (highest)
- **Rule evaluations**: 0 LCU (10 free rules)

**Monthly Cost:**
- ALB-hour charge: $16.20
- LCU charge: $6.22
- Trust store charge: $4.03
- **Tổng cộng**: Khoảng $26.45/tháng

## Use Cases

1. **SSO Implementation trong Mission-Critical SAP Environments**  
   Unified access đến nhiều SAP systems

2. **Integration của Cloud-Native Extensions với SAP ERP**  
   Seamless access từ extension applications trên AWS đến SAP ERP

3. **Unified Authentication trên Multiple Systems**  
   Consistent identity management trên toàn enterprise

4. **Compliance với Enterprise Security Requirements**  
   Tuân thủ regulatory compliance và security policies

## Lợi ích chính

1. **mTLS support của ALB đơn giản hóa principal propagation implementation**
2. **Integration với SAP Web Dispatcher đảm bảo proper mapping của authentication credentials**
3. **AWS managed services giảm operational overhead**
4. **Tăng cường security thông qua certificate-based authentication**
5. **Cải thiện employee productivity và security posture của SAP applications**

## Tổng kết

mTLS support của Application Load Balancer cung cấp một foundation vững chắc để implement principal propagation trong SAP landscapes. Integration này cho phép một SSO solution an toàn, có khả năng scale và maintainable trong khi leverage các AWS managed services.

Bằng cách implement mTLS authentication sử dụng ALB, các tổ chức có thể cải thiện security posture của SAP applications trong khi cung cấp better user experience cho employees. Solution này được khuyến nghị cho tất cả các tổ chức chạy SAP workloads trên AWS cần duy trì secure và efficient authentication mechanisms trên toàn bộ application landscape.

Để đọc thêm về cách tận dụng nhiều value hơn từ SAP investment của bạn, vui lòng xem thêm chi tiết tại [AWS for SAP blog](https://aws.amazon.com/blogs/awsforsap/).

## Tham gia SAP on AWS Discussion

Ngoài account team và AWS support channels của bạn, chúng tôi gần đây đã launch [re:Post](https://repost.aws/) – một rebuilt Q&A experience cho AWS community. AWS for SAP Solutions Architecture team thường xuyên monitor các AWS for SAP topics cho các discussions và questions mà họ có thể trả lời để hỗ trợ customers và partners.

## Tài liệu tham khảo

- [Mutual Authentication for Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/mutual-authentication.html)
- [AWS for SAP Blog](https://aws.amazon.com/blogs/awsforsap/)
- [AWS re:Post - SAP Topics](https://repost.aws/)
- [Application Load Balancer Pricing](https://aws.amazon.com/elasticloadbalancing/pricing/)

---

**Từ khóa**: SAP on AWS, Application Load Balancer, mTLS, Principal Propagation, SSO, RISE with SAP, Authentication, Security, Enterprise Architecture
