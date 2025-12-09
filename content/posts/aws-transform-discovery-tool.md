---
title: "Giới Thiệu Công Cụ Khám Phá AWS Transform Discovery Tool"
date: 2025-12-09
categories:
  - Di Chuyển AWS
  - VMware
  - Công Cụ Khám Phá
tags:
  - AWS Transform
  - Migration
  - VMware vCenter
  - Khám Phá Agentless
  - Phân Tích TCO
authors:
  - Patrick Kremer
  - Pedro Calixto
source: AWS Blog Japan
source_url: https://aws.amazon.com/jp/blogs/news/introducing-the-aws-transform-discovery-tool/
---

AWS Transform discovery tool là một **Open Virtual Appliance (OVA)** được triển khai vào cơ sở hạ tầng VMware. Công cụ này thay thế Application Discovery Service Agentless Collector và hoạt động như một **ứng dụng độc lập** có thể triển khai tại chỗ **không cần kết nối cloud hay phụ thuộc bên ngoài**.

Công cụ này thu thập dữ liệu hiệu suất và kết nối mạng theo phương pháp agentless, và có thể xuất dữ liệu theo định dạng AWS Migration Portfolio Assessment (MPA). Dữ liệu được lưu trữ cục bộ và việc gửi lên AWS là tùy chọn.

## Tính Năng Chính

- **Không cần kết nối cloud** – Ứng dụng độc lập
- **Agentless** – Không cần cài đặt phần mềm
- **Thu thập toàn diện** – Dữ liệu hiệu suất, mạng, và database instance
- **Lưu trữ dữ liệu cục bộ** – Gửi lên AWS là tùy chọn
- **Tích hợp AWS Transform** – Upload trực tiếp để tạo assessment

## Yêu Cầu Trước Khi Triển Khai

Trước khi triển khai AWS Transform discovery tool, hãy đảm bảo đáp ứng các yêu cầu sau:

### Yêu Cầu Appliance
- **vCPU**: 4
- **RAM**: 16GB
- **Ổ cứng**: 35GB
- **Quyền**: Quyền triển khai OVA vào VMware vCenter

### Yêu Cầu Truy Cập Mạng

Cần có **kết nối inbound** từ appliance đến các máy được khám phá:

- **Linux**: SSH – TCP/22
- **Windows**: WinRM – TCP/5985 (HTTP), TCP/5986 (HTTPS)
- **SNMP**: UDP/161

### Yêu Cầu Theo Hệ Điều Hành

#### Hệ Thống Linux
- Tài khoản người dùng có thể kết nối SSH
- Có thể thực thi lệnh `ss` hoặc `netstat` với quyền `sudo`

#### Hệ Thống Windows
Xem chi tiết trong [tài liệu sản phẩm](https://docs.aws.amazon.com/transform/latest/userguide/discovery-tool-requirements.html#discovery-tool-requirements-windows)

## Triển Khai

### Bước 1: Tải Xuống Appliance

Tải xuống appliance từ trang [AWS Transform discovery tool](https://aws.amazon.com/transform/discovery-tool/).

### Bước 2: Triển Khai OVA

Sử dụng quy trình triển khai OVA tiêu chuẩn để triển khai appliance vào VMware vCenter.

![Triển khai AWS Transform discovery tool appliance](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT001.png)

## Thiết Lập Ban Đầu

### Bước 1: Truy Cập Giao Diện Quản Lý

Giao diện quản lý của appliance chạy trên cổng **5000**.

Ví dụ: `https://10.250.1.20:5000`

### Bước 2: Tạo Mật Khẩu

Khi truy cập lần đầu, bạn sẽ tạo mật khẩu quản trị viên.

![Tạo mật khẩu khi đăng nhập lần đầu](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT002.png)

### Bước 3: Kết Nối Đến vCenter Server

Chọn **Set up access** và nhập FQDN hoặc địa chỉ IP của vCenter, tên người dùng và mật khẩu.

![Thiết lập kết nối vCenter](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT003.png)

### Bước 4: Xác Nhận Kết Nối

Trạng thái sẽ chuyển sang **Connected** và **Last collection** sẽ hiển thị ngày và giờ.

![Xác nhận kết nối vCenter](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT004.png)

### Bước 5: Xác Nhận Inventory

Bạn có thể xác nhận inventory được khám phá từ trang **Discovered inventory**.

![Inventory được khám phá](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT005.png)

Việc thu thập khám phá được thực hiện **mỗi 1 giờ**.

## Cấu Hình Truy Cập OS

### Bước 1: Mở Thiết Lập Truy Cập OS

Chọn nút **Set up OS access** hoặc **Edit OS access**.

![Thiết lập truy cập OS](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT006.png)

### Bước 2: Nhập Thông Tin Xác Thực

Nhập thông tin xác thực SSH, WinRM, SNMP.

![Nhập thông tin xác thực](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT007.png)

**Lưu ý quan trọng**:

- **Thông tin xác thực Windows**: Điều tra và thu thập môi trường SQL Server qua WinRM
- **Người dùng Kerberos**: Định dạng `USERNAME@DOMAIN.TLD` (tên người dùng viết thường, domain viết hoa)
- **Auto-connect**: Khi được chọn, tự động áp dụng thông tin xác thực cho tất cả VM

### Bước 3: Gán Thông Tin Xác Thực Thủ Công

Từ màn hình **Discovered inventory**, nhập bộ lọc, chọn VM và chọn **Manage access credential**.

![Chọn VM](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT008.png)

### Bước 4: Chọn Thông Tin Xác Thực và Thực Hiện Thu Thập

Chọn thông tin xác thực và thực thi **Save and collect**.

![Chọn thông tin xác thực và thực hiện thu thập](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT009.png)

### Bước 5: Xác Nhận Thành Công

Cột **Network status** sẽ hiển thị **Success**.

![Xác nhận thu thập thành công](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT010.png)

Khi VM Windows chạy SQL Server instance, cột **Database status** cũng sẽ chuyển sang **Success**.

![Khám phá database thành công](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT011.png)

## Tải Xuống

### Tải Xuống Inventory

Nhấn nút **Download inventory** để tải xuống inventory dưới định dạng CSV.

![Tải xuống inventory](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT012.png)

**Ví dụ dữ liệu CSV** (Web server với backend MySQL):

![Ví dụ dữ liệu CSV](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT013.png)

Đầu ra bao gồm các dữ liệu sau:
- IP nguồn
- IP đích
- Cổng
- Giao thức
- Phụ thuộc mạng

### Tải Xuống Log

Để khắc phục sự cố, bạn có thể tải xuống log bằng nút **Download logs**.

![Tải xuống log](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2025/11/21/TDT014.png)

## Dọn Dẹp

1. Xóa appliance khỏi inventory vCenter
2. Vô hiệu hóa thông tin xác thực nếu bạn đã tạo thông tin xác thực OS cụ thể

## Tổng Kết

Sử dụng AWS Transform discovery tool cho phép bạn:

✅ **Khám phá tự động** – Inventory server, database instance, phụ thuộc mạng  
✅ **Tập trung bảo mật** – Ứng dụng độc lập không cần kết nối cloud  
✅ **Khả năng hiển thị toàn diện** – Định kích thước và tính toán chi phí chính xác  
✅ **Xác định phụ thuộc** – Phụ thuộc ứng dụng ảnh hưởng đến kế hoạch di chuyển  
✅ **Phân tích dựa trên dữ liệu** – Phân tích TCO và tạo business case  
✅ **Quyết định có căn cứ** – Chiến lược di chuyển và ưu tiên

Đầu ra có thể được upload lên **AWS Transform assessment**, cho phép phân tích TCO chi tiết và tạo business case.

## Các Bước Tiếp Theo

1. Upload trực tiếp file đầu ra lên **AWS Transform assessment**
2. Xem chi tiết về tạo assessment trong [tài liệu sản phẩm](https://docs.aws.amazon.com/transform/latest/userguide/working-with-assessments.html)

---

**Về Tác Giả**

**Patrick Kremer** – Senior Specialist Solutions Architect  
Tập trung vào di chuyển và hiện đại hóa cơ sở hạ tầng. Có 20 năm kinh nghiệm VMware, tham gia AWS vào năm 2022. Chứng chỉ AWS Certified Solutions Architect Professional.

**Pedro Calixto** – Senior Solutions Architect  
Chuyên môn về di chuyển và hiện đại hóa workload, tập trung vào việc giúp doanh nghiệp mở rộng, di chuyển và bảo vệ môi trường on-premises trong AWS.

**Người dịch**: Shigetaka Tazawa (Solutions Architect)
