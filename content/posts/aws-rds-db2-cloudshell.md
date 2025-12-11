# Kết nối đến Amazon RDS for Db2 bằng AWS CloudShell

**Nguồn:** AWS Blog  
**Ngày xuất bản:** 10 tháng 12 năm 2025  
**Ngày xuất bản bản gốc:** 10 tháng 6 năm 2025  
**URL:** https://aws.amazon.com/jp/blogs/news/connect-to-amazon-rds-for-db2-using-aws-cloudshell/

## Tác giả

- **Vikram S Khatri** - Kỹ sư Cơ sở dữ liệu Cấp cao cho Amazon RDS for Db2  
  Hơn 20 năm kinh nghiệm với Db2, thích xây dựng sản phẩm mới từ đầu

- **Sumit Kumar** - Kiến trúc sư Giải pháp Cấp cao tại AWS  
  Yêu thích giải quyết các vấn đề phức tạp và hỗ trợ khách hàng xây dựng, thiết kế các workload trên AWS Cloud

- **Rajib Sarkar** - Kỹ sư Cơ sở dữ liệu Cấp cao cho Amazon RDS for Db2  
  Hơn 20 năm kinh nghiệm với Db2

- **Ashish Saraswat** - Kỹ sư Phát triển Phần mềm Cấp cao cho Amazon RDS for Db2  
  Hơn 10 năm kinh nghiệm phát triển phần mềm

**Người dịch:** Hidehiko Yamane (Kiến trúc sư Giải pháp)

## Tổng quan

Chúng tôi giới thiệu phương pháp mới để kết nối đến Amazon RDS for Db2 bằng môi trường tích hợp VPC của AWS CloudShell. Không cần EC2, không cần cài đặt cục bộ, và có thể kết nối an toàn.

## Giới thiệu

Trước đây, cần phải khởi chạy bastion host trên Amazon EC2 hoặc chạy Db2 client cục bộ. Tuy nhiên, với môi trường tích hợp VPC của AWS CloudShell, có các lợi ích sau:

- Không cần EC2
- Không cần cài đặt cục bộ
- Không có chi phí ngoài Amazon RDS thông thường và AWS networking
- Thực hiện kết nối an toàn

## Tổng quan về giải pháp

### Lợi ích chính

#### 1. Client không tốn chi phí
CloudShell miễn phí, chỉ phát sinh phí mạng tiêu chuẩn và phí Amazon RDS.

#### 2. Cùng subnet
Phiên CloudShell được đặt cùng vị trí với RDS database trong VPC, giảm thiểu độ trễ.

#### 3. Không cần Amazon EC2
Không cần provisioning, patching, và quản lý bastion host.

#### 4. AWS CLI được cài đặt sẵn
AWS CLI được cấu hình mặc định trong CloudShell và hỗ trợ đầy đủ custom VPC networking.

### Các bước triển khai

1. Khởi chạy CloudShell trong VPC
2. Tải xuống và cài đặt IBM Data Server Driver thin client
3. Cấu hình cả kết nối plain text (TCP/IP) và SSL
4. Kiểm tra kết nối bằng Command line processor plus (CLPPlus) của IBM

## Điều kiện tiên quyết

Trước khi bắt đầu triển khai, hãy chuẩn bị:

- RDS for Db2 instance hiện có có thể truy cập trong VPC
- VPC subnet và security group cho phép inbound access đến Db2 port (mặc định TCP 50000+ hoặc SSL 50xxx)
- Quyền truy cập Amazon CloudShell

## Hướng dẫn triển khai

### Bước 1: Khởi chạy CloudShell trong VPC

1. Đăng nhập vào AWS Management Console và chọn **CloudShell** từ thanh menu
2. Trong cửa sổ CloudShell, chọn **Actions**, sau đó chọn **Create VPC Environment**
3. Nhập tên vào **Name** (ví dụ: PRIVATE)
4. Trong **VPC**, chọn VPC đang host RDS for Db2 database
5. Trong **Subnet**, chọn subnet ID của availability zone của Amazon RDS for Db2 instance
6. Trong **Security group(s)**, chọn tối đa 5 security groups bao gồm các rule cho TCP và SSL ports
7. Chọn **Create**

**Lưu ý:** Phiên CloudShell sẽ timeout sau 30 phút không hoạt động. Db2 client là single script install nên có thể tạo lại khi cần.

### Bước 2: Cài đặt Db2 client trong AWS CloudShell

#### Phương pháp 1: Chạy trực tiếp

```bash
curl -sL https://bit.ly/getdb2driver | bash
```

#### Phương pháp 2: Tải xuống và chạy

```bash
curl -sL https://bit.ly/getdb2driver -o db2-driver.sh
chmod +x db2-driver.sh
./db2-driver.sh
```

**Lưu ý:** URL rút gọn trỏ đến `https://aws-blogs-artifacts-public.s3.us-east-1.amazonaws.com/artifacts/DBBLOG-4900/db2-driver.sh`.

#### Các bước hoàn tất cài đặt

Sau khi chạy script, hoàn tất thiết lập theo các bước sau:

1. Chuyển sang user db2inst1:
```bash
sudo su - db2inst1
```

2. Chạy script:
```bash
source db2-driver.sh
```

#### Hoạt động của script

Script này tự động thực hiện các xử lý sau:

- Liệt kê các Amazon RDS for Db2 instance và chọn instance muốn kết nối
- Đăng ký các database được phát hiện trong RDS for Db2 instance vào tệp db2dsdriver.cfg
- Khi SSL được bật, cũng đăng ký kết nối SSL cho mỗi database vào tệp db2dsdriver.cfg

#### Xác nhận kết nối

Sau khi hoàn tất thiết lập, có thể:

- Kết nối đến RDSADMIN database bằng db2 command line processor để thực hiện các tác vụ quản lý
- Kết nối đến user-defined database để thực hiện hoạt động Db2 thông thường

## Khắc phục sự cố

### Vấn đề truy cập Internet

**Triệu chứng:** Chạy lệnh curl để thực thi script trực tiếp nhưng script không xuất ra gì

**Nguyên nhân:** VPC không được cấu hình đúng cho truy cập Internet

**Yêu cầu:**
- Truy cập Internet khả dụng
- Quyền IAM phù hợp
- Sử dụng subnet ID phù hợp
- Security group phù hợp với inbound traffic cho Db2 được bật

### Xác nhận permissions

Có thể xác nhận permissions bằng lệnh sau:

```bash
curl -sL https://bit.ly/getdb2driver | bash -s -- --check-permissions
```

Hoặc

```bash
./db2-driver.sh --check-permissions
```

### Tích hợp với Secrets Manager

Nếu sử dụng master user password trong Amazon Secrets Manager, có thể đặt biến môi trường `MASTER_USER_PASSWORD` bằng hàm `get_master_user_password` có sẵn trong `functions.sh`.

### Trợ giúp kết nối

Tệp `CONN_HELP_README.txt` chứa tên và cú pháp lệnh db2 để sử dụng cho kết nối đến Amazon RDS for Db2 database.

### Khôi phục sau session timeout

Sau timeout không hoạt động 30 phút, vẫn có thể chạy lại script để cài đặt và đăng ký RDS for Db2 database, sau đó kết nối lại.

## Phương pháp thay thế với Amazon EC2

Cũng có thể chạy cùng script trên Amazon EC2 instance để cài đặt Db2 client cho việc kết nối đến Amazon RDS for Db2 instance.

**Lợi ích:** Khác với AWS CloudShell, client được lưu trữ vĩnh viễn.

**Lưu ý:** Trong AWS CloudShell, chỉ thư mục `/home/cloudshell-user` trở xuống được lưu trữ vĩnh viễn, nhưng script này đưa Db2 client vào thư mục `/home/db2inst1` nên sẽ bị xóa sau khi ngắt kết nối phiên.

## Chi tiết kỹ thuật

### Chức năng CloudShell

- Môi trường tích hợp VPC
- Chạy trong private subnet
- Tích hợp security group (tối đa 5)
- AWS CLI được cài đặt sẵn

### Db2 client

- IBM Data Server Driver thin client
- Command line processor plus (CLPPlus)
- Hỗ trợ kết nối TCP/IP và SSL
- Cấu hình db2dsdriver.cfg tự động

### Quản lý phiên

- **Timeout:** 30 phút không hoạt động
- **Lưu trữ vĩnh viễn:** Chỉ thư mục `/home/cloudshell-user` được lưu trữ vĩnh viễn
- **Khôi phục:** Có thể khôi phục bằng cách chạy lại script

## Đóng góp cho cộng đồng

Để cải thiện thêm giải pháp này, chúng tôi hoan nghênh các đóng góp trên GitHub repository.

**GitHub repository:** https://github.com/aws-samples/sample-rds-db2-tools/tree/main/tools/db2client

Có thể đóng góp bằng các cách sau:

- Tạo issue để gửi yêu cầu
- Gửi đề xuất thay đổi bằng pull request

## Kết luận

Chỉ với vài lệnh, đã có thể chạy hoàn toàn Db2 command line processor cho Amazon RDS for Db2 trong CloudShell.

### Lợi ích chính

- Không cần EC2 instance hoặc cài đặt cục bộ
- Thực hiện workflow kiểu serverless sạch sẽ
- Chi phí hiệu quả và dễ quản lý
- Môi trường kết nối bảo mật

Hãy thử giải pháp này cho use case của bạn và cho chúng tôi biết ý kiến của bạn trong phần bình luận.

## Liên kết liên quan

- [Amazon RDS for Db2](https://aws.amazon.com/rds/db2/)
- [AWS CloudShell](https://aws.amazon.com/cloudshell/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Sample RDS Db2 Tools GitHub](https://github.com/aws-samples/sample-rds-db2-tools)

---

**Thẻ:** Amazon RDS, DB2, AWS CloudShell, VPC, Database Management  
**Danh mục:** AWS, Database, Cloud Infrastructure
