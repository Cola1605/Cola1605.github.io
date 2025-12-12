---
title: "Amazon RDS for Oracle và SQL Server bổ sung tính năng mới để tối ưu chi phí và nâng cao hiệu suất"
date: 2025-12-12
draft: false
slug: "aws-rds-oracle-sqlserver-new-capabilities"
description: "4 tính năng mới của Amazon RDS giúp tối ưu chi phí và mở rộng quy mô: SQL Server Developer Edition, tối ưu CPU trên M7i/R7i (giảm 55% chi phí), mở rộng storage lên 256 TiB."
tags: ["AWS", "Amazon RDS", "RDS for Oracle", "RDS for SQL Server", "Cost Optimization", "Performance", "Storage", "CPU Optimization", "Developer Edition", "M7i", "R7i", "Database"]
categories: ["Cloud", "Data and Analytics", "DevOps and Infrastructure"]
author: "Matheus Guimaraes"
---

# Amazon RDS for SQL Server và Amazon RDS for Oracle bổ sung tính năng mới để tối ưu chi phí và nâng cao khả năng mở rộng

**Tác giả:** Matheus Guimaraes  
**Ngày xuất bản:** 12 tháng 12 năm 2025  
**Danh mục:** Amazon RDS, AWS re:Invent, Database, Launch, RDS for SQL Server  
**URL:** https://aws.amazon.com/jp/blogs/news/amazon-rds-for-oracle-and-rds-for-sql-server-add-new-capabilities-to-enhance-performance-and-optimize-costs/

## Tổng quan

Quản lý môi trường cơ sở dữ liệu đòi hỏi sự cân bằng giữa hiệu quả tài nguyên và khả năng mở rộng. Các tổ chức cần các tùy chọn linh hoạt xuyên suốt vòng đời cơ sở dữ liệu, trải rộng từ khối lượng công việc phát triển, kiểm thử đến sản xuất với các yêu cầu lưu trữ và tính toán đa dạng.

Để đáp ứng những nhu cầu này, chúng tôi công bố 4 tính năng mới của Amazon Relational Database Service (Amazon RDS). Điều này không chỉ giúp khách hàng tối ưu chi phí mà còn nâng cao khả năng mở rộng của Amazon RDS for Oracle và Amazon RDS for SQL Server.

Các tính năng mới bao gồm hỗ trợ SQL Server Developer Edition và mở rộng khả năng lưu trữ cho cả RDS for Oracle và RDS for SQL Server. Hơn nữa, khi sử dụng tùy chọn tối ưu CPU của RDS for SQL Server trên các instance M7i và R7i, giá sẽ thấp hơn so với các instance thế hệ trước và phí bản quyền được tính riêng.

## Các tính năng mới chính

### 1. Hỗ trợ SQL Server Developer Edition

SQL Server Developer Edition hiện đã có sẵn trên RDS for SQL Server. Đây là phiên bản SQL Server bao gồm tất cả các tính năng của Enterprise Edition và được cung cấp miễn phí. Developer Edition được cấp phép riêng cho khối lượng công việc không phải sản xuất, do đó bạn có thể xây dựng và kiểm thử ứng dụng trong môi trường phát triển và kiểm thử mà không phát sinh chi phí bản quyền SQL Server.

**Lợi ích chính:**
- Giảm đáng kể chi phí cho môi trường phát triển và kiểm thử
- Duy trì tính nhất quán với môi trường sản xuất
- Truy cập tất cả các tính năng của Enterprise Edition
- Tận dụng đầy đủ các tính năng của Amazon RDS (sao lưu tự động, cập nhật phần mềm, giám sát, mã hóa)

**Cách sử dụng:**
1. Tải file nhị phân SQL Server lên Amazon S3
2. Tạo instance Developer Edition
3. Di chuyển dữ liệu hiện có bằng cách sử dụng các thao tác sao lưu và khôi phục tích hợp sẵn của SQL Server

### 2. Tối ưu CPU trên các instance M7i/R7i

Amazon RDS for SQL Server hiện có thể sử dụng các instance M7i và R7i, mang lại một số lợi ích chính.

**Giảm chi phí:**
- **Giảm tới 55% chi phí** so với các instance thế hệ trước
- Phí bản quyền và chi phí instance DB của Amazon RDS được tính riêng
- Tăng tính minh bạch của chi phí cơ sở dữ liệu

**Tính năng tối ưu CPU:**
- Có thể tùy chỉnh số lượng vCPU được bao gồm trong bản quyền
- Giảm số lượng vCPU trong khi vẫn duy trì bộ nhớ và IOPS cao
- Tự động vô hiệu hóa hyper-threading
- Hỗ trợ tỷ lệ bộ nhớ trên vCPU cao hơn

**Phương pháp cấu hình:**
1. Chọn loại instance M7i hoặc R7i khi tạo instance cơ sở dữ liệu mới
2. Chọn [Cấu hình số lượng CPU ảo] trong [Tối ưu CPU]
3. Thiết lập số lượng vCPU cần thiết

**Trường hợp sử dụng tối ưu:**
Khối lượng công việc cơ sở dữ liệu cần bộ nhớ và IOPS cao nhưng ít vCPU

### 3. Volume lưu trữ bổ sung (tối đa 256 TiB)

Amazon RDS for Oracle và Amazon RDS for SQL Server hiện hỗ trợ kích thước lưu trữ tối đa 256 TiB. Điều này có nghĩa là kích thước lưu trữ trên mỗi instance cơ sở dữ liệu đã **tăng gấp 4 lần** nhờ việc thêm tối đa 3 volume lưu trữ.

**Quản lý lưu trữ linh hoạt:**
- Có thể sử dụng cả volume io2 và gp3
- Lưu trữ dữ liệu được truy cập thường xuyên trên volume io2 hiệu suất cao
- Lưu trữ dữ liệu lịch sử trên volume gp3 hiệu quả về chi phí
- Cân bằng giữa hiệu suất và chi phí

**Tính linh hoạt vận hành:**
- Thêm và xóa volume lưu trữ mà không có thời gian chết
- Mở rộng nhiều volume cùng lúc
- Tự động sao chép trong triển khai Multi-AZ
- Trong trường hợp cần lưu trữ tạm thời, xóa sau khi sử dụng để giảm chi phí

**Quy ước đặt tên volume:**
- rdsdbdata2
- rdsdbdata3
- rdsdbdata4

**Yêu cầu:**
Đối với instance cơ sở dữ liệu RDS for Oracle, kích thước volume lưu trữ chính phải từ 200 GiB trở lên.

**Ví dụ cấu hình:**

Từ RDS Console:
1. Đi đến trang chi tiết instance cơ sở dữ liệu RDS for Oracle
2. Kiểm tra phần [Volume lưu trữ bổ sung] trong [Cấu hình]
3. Chọn [Thêm volume lưu trữ bổ sung]
4. Chọn tên volume (rdsdbdata2, rdsdbdata3, rdsdbdata4)
5. Thiết lập loại lưu trữ (io2 hoặc gp3), lưu trữ được phân bổ và IOPS được cung cấp

Bạn cũng có thể thêm volume bằng AWS CLI khi tạo hoặc sửa đổi instance cơ sở dữ liệu.

## Điều cần biết

**Tình trạng cung cấp:**
- Tất cả các AWS Region thương mại
- AWS GovCloud (US) Region

**Phương thức truy cập:**
- AWS Management Console
- AWS CLI
- AWS SDK

**Thông tin giá cả:**
- Xem trang bảng giá của Amazon RDS for SQL Server để biết chi tiết về cấu trúc giá không đi kèm cho các instance M7i/R7i

## Tài liệu

Để biết thêm chi tiết, vui lòng xem tài liệu Amazon RDS sau:
- Developer Edition
- Tối ưu CPU
- Volume lưu trữ bổ sung cho RDS for Oracle
- Volume lưu trữ bổ sung cho RDS for SQL Server

## Cách bắt đầu

Để bắt đầu sử dụng bất kỳ tính năng nào trong số này:
- Truy cập Amazon RDS Console
- Kiểm tra chi tiết trong tài liệu Amazon RDS

---

**Bản gốc:** [Amazon RDS for Oracle and RDS for SQL Server Add New Capabilities to Enhance Performance and Optimize Costs](https://aws.amazon.com/jp/blogs/aws/amazon-rds-for-oracle-and-rds-for-sql-server-add-new-capabilities-to-enhance-performance-and-optimize-costs/)
