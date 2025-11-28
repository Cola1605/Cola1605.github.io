---
title: "AWS VPC Encryption Controls: Bắt buộc mã hóa traffic trong và giữa các VPC"
date: 2025-11-27
draft: false
tags: ["AWS", "VPC", "Security", "Encryption", "Nitro", "Compliance"]
categories: ["AWS", "Security and Networking"]
author: "Sébastien Stormacq"
description: "Tính năng VPC Encryption Controls mới của AWS cho phép audit và enforce mã hóa traffic in-transit trong VPC, hỗ trợ compliance với HIPAA, PCI DSS, FedRAMP"
---

## Thông tin bài viết
- **Tác giả**: Sébastien Stormacq
- **Ngày xuất bản**: 27/11/2025
- **Tags**: AWS, VPC, Security, Encryption, Compliance
- **Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/introducing-vpc-encryption-controls-enforce-encryption-in-transit-within-and-across-vpcs-in-a-region/)

## Tóm tắt

AWS công bố tính năng VPC Encryption Controls vào 21/11/2025, cho phép audit và enforce mã hóa traffic in-transit trong và giữa các VPC trong cùng region. Hỗ trợ 2 chế độ: monitoring (quan sát) và enforcement (bắt buộc), tự động hóa mã hóa bằng Nitro hardware, hỗ trợ compliance với HIPAA, PCI DSS, FedRAMP.

## 10 điểm chính

1. **VPC Encryption Controls** cho phép audit và enforce mã hóa traffic in-transit
2. **Monitoring mode** hiển thị trạng thái mã hóa, xác định plaintext traffic
3. **Enforcement mode** tự động drop traffic không được mã hóa
4. **AWS Nitro-based instances** tự động mã hóa ở hardware level
5. **VPC Flow Logs** thêm field encryption status mới
6. Hỗ trợ **HIPAA, PCI DSS, FedRAMP** compliance
7. **NLB, ALB, Fargate tasks** tự động migrate
8. EC2 instance thế hệ cũ **cần migrate lên Nitro-based instances**
9. **Internet Gateway, NAT Gateway** bắt buộc phải tuân thủ mã hóa
10. **Miễn phí đến 01/03/2026**, có sẵn ở nhiều AWS region

## Giới thiệu

Ngày 21/11/2025, AWS công bố VPC Encryption Controls - tính năng mới của Amazon Virtual Private Cloud (Amazon VPC). Tính năng này cho phép audit và enforce mã hóa cho tất cả traffic in-transit trong và giữa các VPC trong cùng region.

Các tổ chức trong lĩnh vực tài chính, y tế, chính phủ, bán lẻ đang gặp khó khăn rất lớn trong việc duy trì encryption compliance trên toàn bộ cloud infrastructure.

## Các thách thức trước đây

### Vấn đề của phương pháp truyền thống

Phương pháp truyền thống yêu cầu track mã hóa thủ công bằng spreadsheet qua nhiều network path, đồng thời quản lý nhiều solution, VPN, encryption protocol, public key infrastructure (PKI). Quy trình này dễ xảy ra lỗi con người và càng ngày càng khó khăn khi infrastructure scale lên.

### Mã hóa tự động của Nitro System

AWS Nitro-based instances tự động mã hóa traffic ở hardware layer mà không ảnh hưởng performance, nhưng tổ chức cần cơ chế đơn giản để mở rộng khả năng này ra toàn bộ VPC infrastructure.

### Yêu cầu compliance

Điều này đặc biệt quan trọng khi cần chứng minh tuân thủ các regulatory framework yêu cầu end-to-end encryption như HIPAA (Health Insurance Portability and Accountability Act), PCI DSS (Payment Card Industry Data Security Standard), FedRAMP (Federal Risk and Authorization Management Program).

Tổ chức cần khả năng tập trung hiển thị và kiểm soát trạng thái mã hóa mà không phải quản lý performance tradeoff hay key management system phức tạp.

## Tổng quan giải pháp

VPC Encryption Controls giải quyết các thách thức này bằng cách cung cấp **2 chế độ vận hành: monitoring (quan sát) và enforcement (bắt buộc)**.

### Monitoring Mode

Ở monitoring mode, bạn có thể audit trạng thái mã hóa của traffic flow và xác định các resource cho phép plaintext traffic. Tính năng này thêm encryption status field mới vào VPC Flow Logs, cho phép hiển thị traffic được mã hóa bằng Nitro hardware encryption, application layer encryption (TLS), hoặc cả hai.

Sau khi xác định các resource cần thay đổi, bạn có thể thực hiện các biện pháp để implement mã hóa. Các AWS service như Network Load Balancer, Application Load Balancer, AWS Fargate task tự động và trong suốt migrate infrastructure cơ sở lên Nitro hardware. Không cần action từ user, không có service interruption.

Đối với các resource khác như Amazon EC2 instance thế hệ cũ, cần migrate lên Nitro-based instance type hiện đại.

### Enforcement Mode

Sau khi tất cả resource migrate lên encryption-compliant infrastructure, bạn có thể chuyển sang enforcement mode. Việc migrate lên encryption-compliant hardware và communication protocol là điều kiện tiên quyết để enable enforcement mode. Internet Gateway, NAT Gateway và các resource khác phải tuân thủ mã hóa và không thể loại trừ.

Sau khi activate, ở enforcement mode, tất cả resource trong tương lai chỉ được tạo trên compatible Nitro instance, và traffic không được mã hóa sẽ bị drop nếu phát hiện protocol hoặc port sai.

## Hướng dẫn bắt đầu

### Setup môi trường demo

Demo này khởi động 3 EC2 instance:

- **Web server**: Cài Nginx trên port 80, xử lý HTML page cleartext
- **Client 1 (m7g.medium)**: Sử dụng Nitro System hardware cơ sở để tự động mã hóa traffic in-transit giữa các instance
- **Client 2 (t4g.medium)**: Network traffic không được mã hóa ở hardware level

### Enable Monitoring Mode

#### Thao tác trên Console

1. Chọn **[Your VPC]** ở navigation pane bên trái của AWS Management Console
2. Chuyển sang tab **[VPC encryption controls]**
3. Chọn **[Create encryption control]** và chọn VPC muốn tạo control

Mỗi VPC chỉ có thể associate với 1 VPC encryption control duy nhất, tạo **mối quan hệ 1-1** giữa VPC ID và VPC encryption control ID.

Khi tạo VPC encryption control, bạn có thể thêm tag giúp tổ chức và quản lý resource. Cũng có thể enable VPC encryption control khi tạo VPC mới.

#### Thao tác qua CLI

```bash
aws ec2 create-vpc-encryption-control --vpc-id vpc-123456789
```

### Audit trạng thái mã hóa

#### Thiết lập VPC Flow Logs

```bash
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids vpc-123456789 \
  --traffic-type ALL \
  --log-destination-type s3 \
  --log-destination arn:aws:s3:::vpc-flow-logs-012345678901/vpc-flow-logs/ \
  --log-format '${flow-direction} ${traffic-path} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${encryption-status}'
```

#### Giá trị của encryption status field

- **0**: Traffic là cleartext
- **1**: Traffic được mã hóa bởi Nitro system ở network layer (level 3)
- **2**: Traffic được mã hóa ở application layer (level 7, TCP port 443, TLS/SSL)
- **3**: Traffic được mã hóa ở cả application layer (TLS) và network layer (Nitro)
- **"-"**: VPC encryption control không được enable hoặc AWS Flow Logs không có status info

#### Kiểm tra trên Console

Sử dụng console để xác định các resource cần thay đổi. Report này sẽ báo cáo 2 resource không được mã hóa (Internet Gateway và Elastic Network Interface (ENI) của instance không phải Nitro-based).

#### Kiểm tra qua CLI

```bash
aws ec2 get-vpc-resources-blocking-encryption-enforcement --vpc-id vpc-123456789
```

### Chuyển sang Enforcement Mode

Sau khi update resource để hỗ trợ mã hóa, bạn có thể chuyển sang enforcement mode qua console hoặc CLI.

#### Thao tác trên Console

1. Chọn VPC encryption control
2. Chọn **[Actions]** → **[Switch mode]**

#### Thao tác qua CLI

```bash
aws ec2 modify-vpc-encryption-control --vpc-id vpc-123456789 --mode enforce
```

## Cách thay đổi resource

### Resource tự động tuân thủ

Tất cả VPC resource phải hỗ trợ mã hóa traffic ở hardware layer hoặc application layer. Đối với hầu hết resource, không cần làm gì cả.

#### AWS service tự động tuân thủ

AWS service được truy cập qua AWS PrivateLink và gateway endpoint tự động apply mã hóa ở application layer. Các service này chỉ chấp nhận traffic được mã hóa bằng TLS. AWS tự động drop traffic không được mã hóa ở application layer.

#### Service tự động migrate

Khi enable monitoring mode, các service sau tự động và dần dần migrate lên hardware hỗ trợ mã hóa:

- Network Load Balancer
- Application Load Balancer
- AWS Fargate cluster
- Amazon EKS cluster

Migration này **diễn ra trong suốt mà không cần thao tác từ user**.

### Resource cần migrate thủ công

Một số VPC resource cần chọn underlying instance hỗ trợ Nitro hardware layer encryption mới nhất:

- EC2 instance
- Auto Scaling group
- Amazon RDS database (bao gồm Amazon DocumentDB)
- Amazon ElastiCache node-based cluster
- Amazon Redshift provisioned cluster

Nếu sử dụng instance thế hệ mới, các instance type gần đây đều hỗ trợ mã hóa nên có thể infrastructure đã sẵn sàng tuân thủ mã hóa. Đối với instance thế hệ cũ không hỗ trợ encryption in-transit, cần upgrade lên supported instance type.

## Lưu ý khi sử dụng AWS Transit Gateway

Khi tạo Transit Gateway qua AWS CloudFormation với VPC encryption enabled, cần thêm 2 IAM permission: **`ec2:ModifyTransitGateway`** và **`ec2:ModifyTransitGatewayOptions`**.

CloudFormation sử dụng quy trình 2 bước để tạo Transit Gateway nên cần các permission này:

1. Đầu tiên tạo Transit Gateway với basic setting
2. Sau đó gọi `ModifyTransitGateway` để enable encryption support

Nếu không có các permission này, CloudFormation stack sẽ fail khi tạo khi cố apply encryption setting, ngay cả khi chỉ thực hiện operation trông giống như create operation.

## Giá và region khả dụng

### Region khả dụng

VPC Encryption Controls hiện có sẵn ở các AWS region sau:

- **Mỹ**: East (Ohio, N. Virginia), West (N. California, Oregon)
- **Châu Phi**: Cape Town
- **Châu Á Thái Bình Dương**: Hong Kong, Hyderabad, Jakarta, Melbourne, Mumbai, Osaka, Singapore, Sydney, Tokyo
- **Canada**: Central, West (Calgary)
- **Châu Âu**: Frankfurt, Ireland, London, Milan, Paris, Stockholm, Zurich
- **Trung Đông**: Bahrain, UAE
- **Nam Mỹ**: São Paulo

### Giá

VPC Encryption Controls **miễn phí đến 01/03/2026**. Trang pricing của VPC sẽ được cập nhật với thông tin chi tiết khi gần đến ngày kết thúc free period.

## Kết luận

Để biết thêm chi tiết, tham khảo [VPC Encryption Controls documentation](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-encryption-controls.html) hoặc thử nghiệm trên AWS account của bạn. AWS mong được nghe về việc tính năng này giúp tăng cường security posture và đáp ứng compliance standard như thế nào.

---

**[Bài viết gốc tại đây](https://aws.amazon.com/jp/blogs/aws/introducing-vpc-encryption-controls-enforce-encryption-in-transit-within-and-across-vpcs-in-a-region/)**
