---
title: "Hiểu về Việc Sử Dụng Không Gian Lưu Trữ của Amazon Aurora MySQL"
date: 2025-12-05T14:00:00+09:00
draft: false
categories: ["AWS", "Data and Analytics"]
tags: ["Amazon Aurora", "Aurora MySQL", "Database", "Storage Management", "MySQL", "InnoDB", "CloudWatch", "Performance Optimization", "AWS Best Practices", "Database Administration"]
author: "Kiyoshi Takeda"
translator: "日平"
description: "Hướng dẫn chi tiết về cách Amazon Aurora MySQL quản lý và sử dụng không gian lưu trữ, bao gồm cluster volume, local storage, tablespaces, temporary tables, binary logs, relay logs, Aurora clones và CloudWatch metrics. Bài viết cung cấp các query SQL và phương pháp giám sát để tối ưu hóa chi phí lưu trữ."
---

# Hiểu về Việc Sử Dụng Không Gian Lưu Trữ của Amazon Aurora MySQL

**Tác giả**: 竹田 清志 (Kiyoshi Takeda)  
**Ngày xuất bản**: 5 tháng 12 năm 2025  
**Danh mục**: Advanced (300), Amazon Aurora, MySQL compatible, Technical How-to  
**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/understanding-amazon-aurora-mysql-storage-space-utilization/)

---

## Giới thiệu

Amazon Aurora là dịch vụ cơ sở dữ liệu quan hệ được quản lý đầy đủ, cung cấp hiệu suất, khả năng mở rộng và tính khả dụng của cơ sở dữ liệu thương mại cao cấp, đồng thời mang lại sự đơn giản và hiệu quả về chi phí của cơ sở dữ liệu nguồn mở.

Bài viết này giải thích về các loại lưu trữ khác nhau có sẵn trong Amazon Aurora MySQL, cách Aurora sử dụng lưu trữ và phương pháp giám sát mức tiêu thụ lưu trữ. Chúng tôi cũng giới thiệu các database query và CloudWatch metrics để ước tính chi phí lưu trữ.

**Quan trọng**: Lưu trữ của Amazon Aurora MySQL được quản lý theo cách khác với cơ sở dữ liệu MySQL truyền thống.

---

## Các Loại Lưu Trữ

### Cluster Volume Storage (Lưu Trữ Cluster Volume)

Amazon Aurora MySQL sử dụng một shared storage layer được phân tán trên 3 Availability Zones trong AWS Region để cung cấp độ bền, khả năng chịu lỗi, tính dự phòng dữ liệu và tính khả dụng cao.

Cluster volume storage bao gồm:

- **Các bảng và index của InnoDB**
- **Metadata của cơ sở dữ liệu**
- **Các stored objects như functions và procedures**
- **Dữ liệu bền vững khác như binary logs và relay logs**

### Local Storage (Lưu Trữ Cục Bộ)

Mỗi instance Aurora MySQL trong cluster được cấp phát một local storage volume dựa trên Amazon EBS.

Công dụng của local storage:

- **Các temporary files không bền vững**
- **Lưu trữ các temporary tables không phải InnoDB**
- **Sắp xếp các dataset lớn**
- **Lưu trữ các engine logs khác nhau như error logs, audit logs, và general logs**

Chi tiết tham khảo: [Temporary storage limits for Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Performance.html#AuroraMySQL.Managing.TempStorage)

---

## User Tables, Indexes và Tablespaces

User tables và indexes chiếm phần lớn không gian lưu trữ bền vững trong hệ thống cơ sở dữ liệu quan hệ.

### InnoDB Storage Engine

Đây là storage engine đa năng mặc định của MySQL. Trong Amazon Aurora MySQL, **chỉ InnoDB storage engine được hỗ trợ** cho các database tables bền vững.

### Khái Niệm Tablespace

- **MySQL truyền thống**: Các bảng sử dụng InnoDB storage engine được lưu trữ trong các data files gọi là tablespaces, được biểu thị bằng phần mở rộng `.ibd`
- **Aurora**: Aurora tuân theo khái niệm tablespace, nhưng chúng tồn tại dưới dạng **objects trong storage volume được thiết kế tùy chỉnh của Aurora**, chứ không phải là files trên block storage devices

Chi tiết: [InnoDB tablespace space management](https://dev.mysql.com/blog-archive/innodb-tablespace-space-management/)

### Tham Số innodb_file_per_table

#### Khi innodb_file_per_table=ON

- Mỗi bảng có tablespace riêng của nó
- Khi tablespace bị xóa (Drop), các database pages được giải phóng sẽ được trả về storage volume và có thể tái sử dụng cho dữ liệu mới
- Aurora thu hồi các free pages này một cách động theo thời gian và thu nhỏ storage volume, giúp tăng dung lượng khả dụng trong volume và giảm chi phí lưu trữ

**Các thao tác giải phóng không gian:**

1. **Drop table hoặc schema**: Xóa tablespace cơ bản
2. **Truncate table**: Thay thế tablespace hiện tại bằng một tablespace rỗng (tương đương Drop và tạo lại)
3. **Optimize table**: Thông qua OPTIMIZE hoặc ALTER, tạo tablespace mới và xóa tablespace cũ

**Tốc độ thu hồi**: Aurora thu hồi không gian trống dần dần ở tốc độ **tối đa 10TB mỗi ngày** trong background.

Chi tiết: [Storage scaling](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html#Aurora.Managing.Performance.StorageScaling)

#### Khi innodb_file_per_table=OFF

- Các bảng không có tablespace riêng biệt, table data được lưu trữ trong **system tablespace**
- Khi Drop, Truncate hoặc Optimize một bảng, các pages liên quan sẽ được giải phóng trong system tablespace nhưng **kích thước system tablespace không giảm**
- Tính năng dynamic volume resizing của Aurora không thể thu hồi không gian mà các pages này chiếm dụng

### Kiểm Tra Kích Thước Tablespace

Bảng `INFORMATION_SCHEMA.FILES` ghi lại metadata của các InnoDB tablespace types, bao gồm tablespaces theo từng bảng, system tablespace, global temporary tablespace và undo tablespaces.

Query sau hoạt động trên cả Amazon Aurora MySQL phiên bản 2 (tương thích MySQL 5.7) và Amazon Aurora MySQL phiên bản 3 (tương thích MySQL 8.0):

```sql
SELECT FILE_NAME, 
       TABLESPACE_NAME, 
       ROUND((TOTAL_EXTENTS * EXTENT_SIZE) / 1024 / 1024 / 1024, 4) AS SIZE_GB
FROM INFORMATION_SCHEMA.FILES
ORDER BY size_gb DESC 
LIMIT 10;
```

### Lưu Ý

- **Các bảng hoặc partitions rỗng** vẫn chiếm một lượng nhỏ storage (vài megabytes) khi `innodb_file_per_table=ON`
- `INFORMATION_SCHEMA.TABLES` chứa **thông tin thống kê được cache** và có thể đã lỗi thời, nên cân nhắc sử dụng `INFORMATION_SCHEMA.FILES`
- Tham số `information_schema_stats_expiry` (áp dụng cho phiên bản 3) định nghĩa khoảng thời gian trước khi cached statistics tự động hết hạn (**mặc định 86,400 giây = 24 giờ**)
- Có thể sử dụng lệnh `ANALYZE TABLE` để cưỡng chế cập nhật cached values cho một bảng cụ thể

---

## Temporary Tables và Temporary Tablespaces

MySQL có 2 loại temporary tables:

### 1. Internal (Implicit) Temporary Tables

Được tạo bởi chính database engine để xử lý các thao tác như sort, aggregate, derived tables, common table expressions (CTEs). Database users không thể kiểm soát trực tiếp các bảng này.

Tham khảo: 
- [MySQL 5.7: Internal Temporary Tables](https://dev.mysql.com/doc/refman/5.7/en/internal-temporary-tables.html)
- [MySQL 8.0: Internal Temporary Tables](https://dev.mysql.com/doc/refman/8.0/en/internal-temporary-tables.html)

### 2. User-Created (Explicit) Temporary Tables

Được tạo bởi database clients sử dụng câu lệnh `CREATE TEMPORARY TABLE`. Explicit temporary tables chỉ hiển thị trong database session tạo ra chúng và tự động bị xóa khi session kết thúc.

**Công dụng**: Tiện lợi khi lưu trữ dữ liệu trung gian trong quá trình thực thi xử lý SQL phức tạp, phù hợp cho việc xử lý dữ liệu không cần lưu trữ vĩnh viễn.

---

### Aurora Phiên Bản 2 (Tương thích MySQL 5.7)

#### Internal Temporary Tables

- **Engine mặc định**: MEMORY
- **Hành vi overflow**: Khi internal temporary tables được tạo trong bộ nhớ trở nên quá lớn, MySQL tự động chuyển đổi chúng thành disk-based tables

#### InnoDB Temporary Tablespace

- **Tên**: `ibtmp1`
- **Mô tả**: Shared temporary tablespace có kích thước tự động mở rộng
- **Tham khảo**: [InnoDB Temporary Tablespace](https://dev.mysql.com/doc/refman/5.7/en/innodb-temporary-tablespace.html)

**Query kiểm tra kích thước:**

```sql
SELECT FILE_NAME, 
       TABLESPACE_NAME, 
       ENGINE, 
       INITIAL_SIZE, 
       TOTAL_EXTENTS*EXTENT_SIZE AS TotalSizeBytes, 
       DATA_FREE, 
       MAXIMUM_SIZE 
FROM INFORMATION_SCHEMA.FILES
WHERE TABLESPACE_NAME = 'innodb_temporary';
```

**Thu hồi dung lượng disk**: Để thu hồi dung lượng disk mà temporary tablespace chiếm dụng, cần **khởi động lại writer instance của Aurora cluster**. Khi khởi động lại writer instance, data file của temporary tablespace sẽ bị xóa và tạo lại.

#### Vị Trí Lưu Trữ

- **Internal temporary tables dạng InnoDB trên disk**: Mặc định được đặt trên **Aurora cluster volume**
- **Temporary tables không phải InnoDB**: Được đặt trên **local storage**

---

### Aurora Phiên Bản 3 (Tương thích MySQL 8.0)

#### Internal Temporary Tables

- **Engine mặc định**: TempTable (mặc định) hoặc MEMORY engine
- **Các tham số liên quan**: 
  - `tmp_table_size`
  - `temptable_max_ram`
  - `temptable_use_mmap`
  - `temptable_max_mmap`

Chi tiết: [Use the TempTable storage engine on Amazon RDS for MySQL and Amazon Aurora MySQL](https://aws.amazon.com/blogs/database/use-the-temptable-storage-engine-on-amazon-rds-for-mysql-and-amazon-aurora-mysql/)

#### Các Loại Temporary Tablespace

##### (1) Session Temporary Tablespaces

- **Công dụng**: Lưu trữ user-created temporary tables và on-disk internal temporary tables khi InnoDB được cấu hình làm storage engine cho on-disk internal temporary tables
- **Hành vi**: Được cấp phát cho session từ một pool temporary tablespaces. Khi session ngắt kết nối, temporary tablespace của session đó được truncate và trả về pool
- **Cải tiến**: Trong các phiên bản trước đây, temporary tables được tạo trong global temporary tablespace (ibtmp1) và dung lượng disk không được trả về cho operating system ngay cả khi temporary tables bị truncate hoặc xóa

##### (2) Global Temporary Tablespace

- **Tên**: `ibtmp1`
- **Công dụng**: Lưu trữ rollback segments cho các thay đổi đối với user-created temporary tables
- **Hành vi**: Data file tự động mở rộng và tăng kích thước khi cần thiết

**Thu hồi dung lượng disk**: Để thu hồi dung lượng disk mà global temporary tablespace's data file chiếm dụng, cần **khởi động lại writer instance của Aurora cluster**.

#### Vị Trí Lưu Trữ

- **On-disk internal temporary tables dạng InnoDB và temporary tablespace files**: Mặc định được đặt trên **Aurora cluster volume**
- **Temporary tables và files không phải InnoDB**: Được đặt trên **local storage**

Tham khảo: [InnoDB Temporary Tablespace](https://dev.mysql.com/doc/refman/8.0/en/innodb-temporary-tablespace.html)

---

## Binary Logs

Binary log (hoặc binlog) chứa các events mô tả các thay đổi của database như table creation operations hoặc table data modifications.

Tham khảo: [The Binary Log](https://dev.mysql.com/doc/refman/8.0/en/binary-log.html)

### Các Use Cases

- **Replication từ Aurora MySQL sang các cơ sở dữ liệu tương thích MySQL khác**
- **Sử dụng các change data capture (CDC) tools như AWS Database Migration Service (AWS DMS)** để replication từ Aurora MySQL sang các cơ sở dữ liệu không phải MySQL
- **Trích xuất CDC records từ Aurora MySQL** cho nhiều mục đích khác nhau, như thiết lập tích hợp giữa Aurora và các message/event-based systems downstream

### Cấu Hình

- **Mặc định**: Binary log bị vô hiệu hóa (`log_bin = OFF`)
- **Kích hoạt**: Đặt `binlog_format` thành Mixed, Statement hoặc Row trong cluster-level parameter group

### Các Yếu Tố Ảnh Hưởng Đến Lưu Trữ

1. **Khoảng thời gian retention được cấu hình cho binary log**
2. **Lượng thay đổi được tạo ra bởi table creation operations và table data modifications**
3. **Vấn đề với các connected binary log replicas**: Ví dụ, khi cross-region read replicas bị chậm trong việc áp dụng binary log, Aurora cần tạm thời lưu trữ nhiều binary logs hơn bình thường ở phía source

Tham khảo: [Using Amazon Aurora MySQL-Based binlog Replication](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Replication.CrossRegion.html)

### Quản Lý Binary Logs

**Kiểm tra cấu hình retention:**

```sql
CALL mysql.rds_show_configuration;
```

**Đặt retention period (ví dụ: 24 giờ):**

```sql
CALL mysql.rds_set_configuration('binlog retention hours', 24);
```

**Hiển thị danh sách binary logs:**

```sql
SHOW BINARY LOGS;
```

Tham khảo: [Configuring MySQL Binary Logging](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/mysql-stored-proc-configuring.html)

### CloudWatch Metrics

- **SumBinaryLogSize**: Tổng kích thước binary logs (đơn vị bytes)
- **NumBinaryLogFiles**: Số lượng binary logs được lưu trữ trong cluster

---

## Relay Logs

Trong MySQL binary log replication, **I/O receiver thread** trên replica server kết nối đến primary server, đọc binary log events từ primary và sao chép chúng vào local log gọi là **relay log**.

Tham khảo: [The Relay Log](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replica-logs-relaylog.html)

### Vai Trò của Relay Log

Relay log hoạt động như một nơi lưu trữ tạm thời cho các binary log events đang chờ được áp dụng vào replica. Khi **SQL thread** xử lý events từ một relay log file cụ thể, file đó trở nên không cần thiết và tự động bị xóa.

### Tình Huống Vấn Đề

Đôi khi relay logs chiếm dụng dung lượng storage mặc dù Aurora cluster không thực sự thực hiện replication. Ví dụ, trong quá khứ Aurora cluster được cấu hình làm replica của một MySQL server khác, nhưng replication bị dừng mà không reset hoàn toàn.

### Kiểm Tra Trạng Thái Replication

```sql
SHOW REPLICA STATUS;  -- Đối với phiên bản 3
SHOW SLAVE STATUS;    -- Đối với phiên bản 2
```

- **Output rỗng**: Nghĩa là replication không được thiết lập và không nên có relay logs trong cluster
- **Có output**: Nếu hiển thị replication configuration và replication status counters, replication đã bị dừng nhưng replication metadata còn lại và relay logs có thể vẫn tồn tại

**Lưu ý**: MySQL không cung cấp metadata chi tiết về relay log files, do đó không thể xác nhận số lượng chính xác hoặc kích thước của relay logs được lưu trữ trong cluster.

### Cleanup Relay Logs

#### Amazon Aurora MySQL Phiên Bản 2

```sql
CALL mysql.rds_reset_external_master;
```

Tham khảo: [mysql.rds_reset_external_master](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/mysql-stored-proc-replicating.html#mysql_rds_reset_external_master)

#### Amazon Aurora MySQL Phiên Bản 3

```sql
CALL mysql.rds_reset_external_source;
```

Tham khảo: [mysql.rds_reset_external_source](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/mysql-stored-proc-replicating.html#mysql_rds_reset_external_source)

---

## Aurora Clones

Aurora clone là phương pháp nhanh chóng và tiết kiệm chi phí để clone dữ liệu của Aurora cluster volume.

Tham khảo: [Cloning Databases in an Aurora DB Cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html)

### Copy-on-Write Protocol

Khi clone được tạo, Aurora thực hiện các bước sau:

1. Tạo một cluster storage volume độc lập mới
2. Không sao chép tất cả original data pages vào volume mới
3. Trừ khi pages bị thay đổi, các cloned pages chỉ đơn giản là **pointers đến original pages**
4. **Khi pages bị thay đổi ở bất kỳ phía nào**, Aurora tạo một bản copy của page đó vào cloned volume

### Đặc Điểm Lưu Trữ

- Clone sử dụng **một lượng nhỏ dung lượng bổ sung** để tạo volume
- Ngoài overhead nhỏ này, additional storage chỉ được cấp phát **khi có thay đổi được thực hiện trên source hoặc cloned cluster**
- Clone độc lập với original cluster và các clones khác về mặt data replication và performance
- Aurora không tự động replicate dữ liệu giữa các entities này

### Hành Vi của VolumeBytesUsed Metric

#### Ngay Sau Khi Tạo Clone

- Cloned cluster storage volume ban đầu chia sẻ phần lớn pages của nó với source volume
- Các pages đó chỉ được bao gồm trong **VolumeBytesUsed metric của source volume**
- Đối với cloned cluster, VolumeBytesUsed metric **ban đầu gần như bằng không**

#### Sau Khi Thay Đổi Dữ Liệu

- VolumeBytesUsed metric của clone volume chỉ bao gồm **các pages mới được cấp phát do data modifications sau khi tạo clone**

#### Khi Xóa Source Cluster

- Nếu source cluster bị xóa, các pages vẫn đang được chia sẻ sẽ **được tính phí cho các active clones còn lại**
- Nghĩa là **VolumeBytesUsed có thể tăng đáng kể** mặc dù cloned cluster không có writes đáng kể

#### Clone Chain

- Khi thêm clones được xóa hoặc tạo trong chain, xảy ra sự phân phối lại pages cho các clones còn lại

### Troubleshooting

Nếu thấy sự chênh lệch lớn giữa VolumeBytesUsed của cluster và kích thước tablespace thực tế, đáng để xác nhận liệu cluster đó có phải là **một phần của clone chain** hay không.

Tham khảo: [How Aurora cloning works](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html#Aurora.Managing.Clone.Protocol)

---

## CloudWatch Metrics

Có thể sử dụng Amazon CloudWatch để giám sát tình trạng sử dụng storage của Aurora MySQL cluster.

### FreeLocalStorage

Có thể giám sát **lượng local storage** được liên kết với mỗi Aurora instance. Dung lượng local storage gắn liền với instance class, do đó nếu cần nhiều local storage hơn, cần sử dụng instance lớn hơn.

### VolumeBytesUsed

Chỉ ra **lượng storage tính phí được sử dụng bởi Aurora DB cluster**. Cluster volume usage bao gồm:

- InnoDB tablespaces
- Binary logs
- Relay logs

**Quan trọng**: Đây là **metric để tính phí** và có thể không nhất thiết phản ánh lượng dữ liệu thực sự tồn tại trong cluster, chẳng hạn như khi sử dụng copy-on-write clones.

### AuroraVolumeBytesLeftTotal

Chỉ ra **dung lượng khả dụng còn lại của cluster volume** trong dung lượng tối đa **128TiB** (Aurora MySQL 3.10 trở lên là **256TiB**).

- Khi cluster volume tăng trưởng, giá trị này giảm
- **Khi đạt đến không, cluster báo cáo lỗi hết dung lượng**
- Metric này bao gồm cả các allocations cho internal housekeeping và các mục khác không ảnh hưởng đến storage billing
- Do đó, giá trị của metric này không khớp chính xác với "**128 TiB trừ đi VolumeBytesUsed**"

Tham khảo: [Amazon CloudWatch metrics for Amazon Aurora](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMonitoring.Metrics.html)

---

## Tổng Kết

Bài viết này đã giải thích:

- **Các lý do phổ biến cho việc sử dụng dung lượng cluster volume của Aurora MySQL**
- **Các queries và cấu hình có thể sử dụng để xác định nguyên nhân gốc rễ của việc sử dụng dung lượng**
- **Phương pháp để hiểu chi phí storage billing của Aurora**

### Các Điểm Chính

1. Aurora có **2 loại storage** (cluster volume, local storage)
2. Khi `innodb_file_per_table=ON`, Aurora có thể thu hồi free pages một cách động và thu nhỏ storage volume (**tối đa 10TB mỗi ngày**)
3. Aurora phiên bản 2 và phiên bản 3 có **cách xử lý temporary tables khác nhau**
4. Binary logs và relay logs có thể chiếm dụng storage của cluster volume
5. Aurora clones hoạt động theo **phương thức copy-on-write** và ảnh hưởng đến VolumeBytesUsed metric
6. Có thể giám sát tình trạng sử dụng storage bằng CloudWatch metrics (**FreeLocalStorage**, **VolumeBytesUsed**, **AuroraVolumeBytesLeftTotal**)

### Tài Liệu Tham Khảo

- [Working with Amazon Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMySQL.html)
- [Introducing the Aurora Storage Engine](https://aws.amazon.com/blogs/database/introducing-the-aurora-storage-engine/)

---

*Bài viết này được dịch từ bản tiếng Anh gốc.*
