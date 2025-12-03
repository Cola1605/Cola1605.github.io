---
title: "Amazon Route 53 Global Resolver: Giải pháp DNS Anycast Toàn cầu An toàn (Preview)"
date: 2025-12-03T12:00:00+09:00
draft: false
categories: ["Cloud", "Security and Networking"]
tags: ["Route 53", "Global Resolver", "DNS", "Anycast", "DoH", "DoT", "DNSSEC", "DNS Firewall", "Hybrid Cloud", "AWS"]
author: "Esra Kayabali"
translator: "日平"
---

# Amazon Route 53 Global Resolver: Giải pháp DNS Anycast Toàn cầu An toàn (Preview)

**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/introducing-amazon-route-53-global-resolver-for-secure-anycast-dns-resolution-preview/)  
**Tác giả**: Esra Kayabali  
**Ngày**: 3 tháng 12, 2025

---

## Giới thiệu

Ngày 30 tháng 11 năm 2025, AWS đã công bố **Amazon Route 53 Global Resolver** – một dịch vụ Amazon Route 53 mới cung cấp khả năng phân giải DNS an toàn và đáng tin cậy trên toàn cầu cho các truy vấn từ bất kỳ đâu (hiện đang ở giai đoạn Preview). Với Global Resolver, bạn có thể phân giải các truy vấn DNS đến:

- **Domain công khai trên Internet**
- **Domain riêng tư** liên kết với Private Hosted Zone của Route 53

Route 53 Global Resolver cung cấp cho các quản trị viên mạng một **giải pháp thống nhất** để phân giải truy vấn từ các client và nguồn đã được xác thực tại data center on-premise, văn phòng chi nhánh, và các địa điểm từ xa thông qua **địa chỉ IP Anycast phân tán trên toàn thế giới**. Dịch vụ này tích hợp sẵn các tính năng bảo mật như:

- **Lọc traffic DNS**
- **Hỗ trợ truy vấn được mã hóa**
- **Quản lý log tập trung**

Những tính năng này giúp tổ chức giảm tải vận hành đồng thời duy trì các yêu cầu bảo mật.

---

## Các Thách thức được Giải quyết

### Độ phức tạp vận hành trong môi trường hybrid

Các tổ chức triển khai trong **môi trường hybrid** thường gặp phải độ phức tạp vận hành khi quản lý phân giải DNS trên toàn bộ môi trường phân tán. Để phân giải cả domain công khai trên Internet và domain ứng dụng riêng tư, thường cần phải duy trì **cơ sở hạ tầng split DNS**, điều này làm tăng chi phí và gánh nặng quản lý, đặc biệt khi sao chép đến nhiều địa điểm.

Các quản trị viên mạng cần thực hiện:

- **Cấu hình giải pháp forwarding tùy chỉnh**
- **Triển khai Route 53 Resolver endpoint** cho phân giải domain riêng tư
- **Triển khai các biện pháp kiểm soát bảo mật riêng biệt** cho từng địa điểm

### Thách thức Multi-Region Failover

Hơn nữa, các quản trị viên mạng cần:

- Cấu hình và duy trì **chiến lược failover multi-region** cho Route 53 Resolver endpoint
- Áp dụng **chính sách bảo mật nhất quán trên tất cả các region**
- Thực hiện kiểm thử các kịch bản failover

---

## Các Tính năng Chính

### 1. Phân giải DNS Thống nhất

Route 53 Global Resolver có các tính năng chính để giải quyết những thách thức trên. Dịch vụ này có thể **phân giải cả domain công khai trên Internet và Private Hosted Zone của Route 53**, do đó không cần thiết lập split DNS forwarding riêng biệt.

### 2. Hỗ trợ Nhiều Protocol

Global Resolver cung cấp phân giải DNS thông qua nhiều protocol:

- **Do53** (DNS over UDP)
- **DoH** (DNS over HTTPS)
- **DoT** (DNS over TLS)

### 3. Kiến trúc Anycast

Mỗi deployment cung cấp **một bộ địa chỉ IP Anycast IPv4 và IPv6 chung**, định tuyến truy vấn đến **AWS Region gần nhất**, từ đó giảm độ trễ trong môi trường client phân tán.

### 4. Tính năng Bảo mật Tích hợp

Route 53 Global Resolver cung cấp các tính năng bảo mật tích hợp tương đương với **Route 53 Resolver DNS Firewall**.

#### AWS Managed Domain Lists

Quản trị viên có thể thiết lập các quy tắc lọc bằng cách sử dụng **AWS Managed Domain List**, cho phép kiểm soát linh hoạt với các danh sách được phân loại theo:

**DNS Threats (Mối đe dọa DNS):**
- Malware
- Spam
- Phishing

**Nội dung web không phù hợp với công việc:**
- Adult sites
- Gambling
- Social networking

Ngoài ra, bạn cũng có thể **tạo custom domain list** bằng cách import domain từ file.

#### Advanced Threat Protection

Bảo vệ chống mối đe dọa nâng cao có khả năng **phát hiện và chặn**:

- **Domain Generation Algorithm (DGA) patterns**
- **DNS tunneling attempts**

#### Encrypted DNS Traffic

Đối với traffic DNS được mã hóa, Route 53 Global Resolver hỗ trợ **protocol DoH và DoT**, bảo vệ truy vấn đang truyền khỏi truy cập trái phép.

### 5. Authentication và Access Control

Route 53 Global Resolver chỉ chấp nhận traffic từ các client đã biết mà yêu cầu xác thực tại resolver.

#### IP-based Authentication

Đối với kết nối Do53, DoT, DoH, quản trị viên có thể thiết lập **allowlist địa chỉ IP và CIDR**.

#### Token-based Authentication

Đối với kết nối DoH và DoT, **xác thực dựa trên token** cung cấp kiểm soát truy cập chi tiết với:

- **Thời gian hiệu lực có thể tùy chỉnh**
- **Tính năng thu hồi (revocation)**
- Khả năng phân bổ token cho các nhóm client cụ thể hoặc thiết bị riêng lẻ theo yêu cầu của tổ chức

### 6. DNSSEC Validation

Route 53 Global Resolver **hỗ trợ DNSSEC validation**, xác nhận tính xác thực và toàn vẹn của DNS response từ public name server.

### 7. EDNS Client Subnet

Dịch vụ cũng hỗ trợ **EDNS Client Subnet**, cho phép chuyển tiếp thông tin subnet của client để **Content Delivery Network (CDN)** có thể cung cấp DNS response chính xác hơn dựa trên thông tin địa lý.

---

## Hướng dẫn Bắt đầu với Route 53 Global Resolver

Phần này sẽ hướng dẫn cách cấu hình Route 53 Global Resolver cho một tổ chức có văn phòng ở **bờ Đông và bờ Tây Hoa Kỳ**, cần phân giải cả ứng dụng riêng tư được host trong Private Hosted Zone của Route 53 và domain công khai.

### Bước 1: Tạo Global Resolver

Để cấu hình Route 53 Global Resolver:

1. Truy cập **AWS Management Console**
2. Chọn **Global Resolver** từ navigation pane
3. Click **Create Global Resolver**

#### Cấu hình Resolver Details

**Resolver name**: Nhập tên như `corporate-dns-resolver`  
**Description** (tùy chọn): Nhập mô tả như "DNS resolver cho văn phòng doanh nghiệp và remote client"

#### Chọn Regions

Chọn các AWS Region muốn chạy resolver. Ví dụ:
- **US East (N. Virginia)**
- **US West (Oregon)**

**Lưu ý**: Nhờ kiến trúc Anycast, các truy vấn DNS từ client sẽ được định tuyến đến **Region gần nhất** được chọn.

#### Kết quả

Sau khi tạo resolver, console sẽ hiển thị chi tiết resolver, bao gồm **địa chỉ Anycast IPv4 và IPv6** để sử dụng trong các truy vấn DNS. Bạn có thể chọn **Create DNS View** để tiếp tục cấu hình xác thực client và phân giải DNS query.

### Bước 2: Tạo DNS View

#### Cấu hình DNS View Details

**DNS View name**: Nhập tên như `primary-view`  
**Description** (tùy chọn): Nhập mô tả như "DNS view cho văn phòng doanh nghiệp"

**DNS View** giúp phân chia client hoặc source thành các nhóm logic khác nhau, xác định phương thức phân giải DNS cho từng nhóm. Điều này cho phép duy trì các quy tắc lọc DNS và chính sách phân giải Private Hosted Zone khác nhau cho các client khác nhau trong tổ chức.

#### DNSSEC Validation

Chọn **Enable** để xác nhận tính xác thực của DNS response từ public DNS server.

#### Firewall Rule Fail-Open Behavior

Chọn **Disable** để **chặn DNS query** khi không thể đánh giá firewall rule, đảm bảo thêm một lớp bảo mật.

#### EDNS Client Subnet

Giữ **Enable** để chuyển tiếp thông tin vị trí của client đến public name server. Điều này cho phép Content Delivery Network cung cấp response chính xác hơn dựa trên thông tin địa lý.

**Lưu ý**: DNS View có thể mất vài phút để trở nên hoạt động.

### Bước 3: Tạo DNS Firewall Rule

Sau khi DNS View được tạo và hoạt động, chọn **Create Rule** để cấu hình DNS firewall rule lọc network traffic.

#### Cấu hình Rule

**Rule name**: Nhập tên như `block-malware-domains`  
**Description** (tùy chọn): Thêm mô tả

#### Rule Setting Type

Chọn một trong các tùy chọn:
- **Customer Managed Domain List**
- **AWS Managed Domain List** (do AWS cung cấp)
- **DNS Response IP Address**

Trong hướng dẫn này, chọn **AWS Managed Domain List**.

#### Domain List

Từ dropdown, chọn một hoặc nhiều AWS managed list như **Threat - Malware** để chặn các domain độc hại đã biết.

#### Query Type

- Để trống để áp dụng rule cho **tất cả các loại DNS query**
- Hoặc chọn **A** để chỉ áp dụng rule cho IPv4 address query

#### Action

Chọn **BLOCK** để chặn truy cập đến các domain khớp.

### Bước 4: Cấu hình Access Source

Bước tiếp theo là cấu hình access source để chỉ định địa chỉ IP hoặc CIDR block có thể gửi DNS query đến resolver.

1. Chuyển đến tab **Access Sources** của DNS View
2. Chọn **Create Access Source**

#### Cấu hình Access Source Details

**Rule name**: Nhập tên như `office-networks` để xác định access source  
**CIDR Block**: Nhập dải địa chỉ IP của văn phòng để cho phép query từ mạng đó

#### Protocol

- **Do53**: Cho standard DNS query qua UDP
- **DoH** hoặc **DoT**: Nếu muốn yêu cầu kết nối DNS được mã hóa từ client

### Bước 5: Tạo Access Token

1. Chuyển đến tab **Access Tokens** của DNS View
2. Chọn **Create Access Token**

#### Cấu hình Access Token Details

**Token name**: Nhập tên như "Remote Client Token"  
**Token Expiration**: Chọn thời gian hiệu lực từ dropdown list dựa trên yêu cầu bảo mật

Ví dụ, nếu muốn yêu cầu client làm mới token mỗi 90 ngày, chọn **90 days**.

### Bước 6: Liên kết Private Hosted Zone

Sau khi tạo access token:

1. Chuyển đến tab **Private Hosted Zones** của DNS View
2. Liên kết Route 53 Private Hosted Zone với DNS View

Điều này cho phép resolver phân giải các query đến domain của ứng dụng riêng tư.

#### Thực hiện Liên kết

1. Chọn **Associate Private Hosted Zone**
2. Từ list, chọn Private Hosted Zone muốn resolver xử lý
3. Chọn **Associate** để hoàn tất

### Hoàn tất Cấu hình

Sau khi hoàn thành:
- Cấu hình DNS View
- Tạo firewall rule
- Định nghĩa access source và token
- Liên kết Private Hosted Zone

**Route 53 Global Resolver đã sẵn sàng xử lý DNS query từ các client đã được cấu hình.**

---

## Cấu hình Client

Sau khi tạo Route 53 Global Resolver, bạn cần cấu hình DNS client để gửi query đến **địa chỉ IP Anycast của resolver**. Phương thức cấu hình phụ thuộc vào access control được thiết lập trong DNS View.

### 1. IP-based Access Source (CIDR Block)

Cấu hình source client để hướng DNS traffic đến **địa chỉ IP Anycast của Route 53 Global Resolver** hiển thị trong resolver details.

- Global Resolver chỉ cho phép truy cập từ **IP đã đăng ký trong allowlist** được chỉ định làm access source
- Có thể liên kết access source với các DNS View khác nhau để cung cấp DNS resolution view chi tiết hơn cho từng nhóm IP

### 2. Access Token-based Authentication

- **Deploy token** cho client để xác thực kết nối DoH và DoT với Route 53 Global Resolver
- Cấu hình client để hướng DNS traffic đến **địa chỉ IP Anycast của Route 53 Global Resolver** hiển thị trong resolver details

Để biết hướng dẫn cấu hình chi tiết cho hệ điều hành hoặc protocol cụ thể, tham khảo [technical documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/gr-platform-configuration-examples.html).

---

## Thông tin Bổ sung

### Đổi tên Route 53 Resolver

AWS đổi tên **Route 53 Resolver** hiện tại thành **Route 53 VPC Resolver**. Việc đổi tên này làm rõ sự khác biệt về kiến trúc giữa hai dịch vụ.

#### Route 53 VPC Resolver

- Hoạt động **trong VPC** ở cấp độ region
- Cung cấp phân giải DNS cho tài nguyên trong môi trường Amazon VPC
- Tiếp tục hỗ trợ **inbound và outbound resolver endpoint** cho kiến trúc hybrid DNS trong AWS Region cụ thể

#### Route 53 Global Resolver

- Cung cấp phân giải DNS toàn cầu và riêng tư **có thể truy cập từ Internet** cho on-premise hoặc remote client
- **Không yêu cầu VPC placement hoặc private connection**
- **Bổ sung** cho Route 53 VPC Resolver

#### Tác động đến Cấu hình Hiện tại

- Cấu hình VPC Resolver hiện tại **không thay đổi** và tiếp tục hoạt động như đã thiết lập
- Việc đổi tên ảnh hưởng đến tên dịch vụ trên AWS Management Console và documentation, nhưng **tên API operation không thay đổi**
- Nếu kiến trúc của bạn yêu cầu phân giải DNS cho tài nguyên trong VPC, tiếp tục sử dụng **VPC Resolver**

---

## Tham gia Preview

Route 53 Global Resolver **giảm tải vận hành** bằng cách cung cấp phân giải DNS thống nhất cho domain công khai và riêng tư thông qua một dịch vụ quản lý duy nhất. Kiến trúc Anycast toàn cầu **cải thiện độ tin cậy** và **giảm độ trễ** cho các client phân tán. Với các biện pháp kiểm soát bảo mật tích hợp và quản lý log tập trung, tổ chức có thể:

- Duy trì **chính sách bảo mật nhất quán** trên tất cả các địa điểm
- Đáp ứng **yêu cầu compliance**

### Tài liệu Tham khảo

Để tìm hiểu thêm về Amazon Route 53 Global Resolver, xem [Amazon Route 53 Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/gr-what-is-global-resolver.html).

### Các Region Khả dụng

Bạn có thể bắt đầu sử dụng Route 53 Global Resolver từ AWS Management Console trong các region sau:

- **US East (N. Virginia)**
- **US East (Ohio)**
- **US West (N. California)**
- **US West (Oregon)**
- **Europe (Frankfurt)**
- **Europe (Ireland)**
- **Europe (London)**
- **Asia Pacific (Mumbai)**
- **Asia Pacific (Singapore)**
- **Asia Pacific (Tokyo)**
- **Asia Pacific (Sydney)**

---

**– Esra**

**Bài viết gốc**: [AWS Blog - Introducing Amazon Route 53 Global Resolver](https://aws.amazon.com/jp/blogs/aws/introducing-amazon-route-53-global-resolver-for-secure-anycast-dns-resolution-preview/)
