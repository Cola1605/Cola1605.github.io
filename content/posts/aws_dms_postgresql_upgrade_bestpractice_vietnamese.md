---
title: "Best Practices để xử lý AWS DMS Tasks trong quá trình nâng cấp PostgreSQL"
date: 2025-10-21
draft: false
categories: ["AWS", "Data and Analytics", "DevOps and Infrastructure"]
tags: ["AWS-DMS", "PostgreSQL", "Database-Migration", "Database-Upgrade", "Replication", "CDC", "Best-Practices"]
description: "Hướng dẫn chi tiết các best practices để xử lý AWS DMS tasks khi nâng cấp minor version hoặc major version của PostgreSQL database."
---

**Tác giả:** Yoshio Uchiyama  
**Tác giả gốc:** Veeramani A và Manoj Ponnurangam  
**Xuất bản:** Amazon Web Services ブログ (AWS Blog - Japanese Edition)  
**Ngày đăng:** 21/10/2025  
**Nguồn:** https://aws.amazon.com/jp/blogs/news/aws-dms-upgrade-bestpractice/  
**Bài gốc:** https://aws.amazon.com/jp/blogs/database/best-practices-to-handle-aws-dms-tasks-during-postgresql-upgrades/

**Categories:** Advanced (300), AWS Database Migration Service, Best Practices  

---

## 📢 Tổng quan

**AWS Database Migration Service (AWS DMS)** cung cấp giải pháp managed để migrate và replicate database lên Amazon Web Services (AWS) đồng thời đảm bảo bảo mật và tính toàn vẹn của dữ liệu. AWS DMS hỗ trợ cả **homogeneous migration** (source và target database sử dụng cùng engine) và **heterogeneous migration** (giữa các môi trường database khác nhau).

AWS DMS giúp dễ dàng migrate dữ liệu từ PostgreSQL database sang các **supported targets**, cũng như migrate từ các **supported sources** sang PostgreSQL database. Điều này cung cấp con đường vững chắc cho doanh nghiệp chuyển infrastructure dữ liệu lên cloud.

Bài viết này giải thích **best practices** về cách xử lý DMS tasks khi thực hiện nâng cấp **minor version** hoặc **major version** của PostgreSQL.

---

## ✅ Yêu cầu (Prerequisites)

Để test giải pháp trong bài viết này, bạn cần các resource sau:

1. 📌 **AWS DMS Replication Instance**
2. 🐘 **RDS for PostgreSQL** hoặc PostgreSQL chạy trên Amazon EC2 hoặc on-premises
3. 🔗 **Source và Target Endpoints**
4. ⚙️ **AWS DMS Task** với PostgreSQL được chỉ định làm source hoặc target

---

## 📚 Hiểu về Version Upgrades của PostgreSQL

Trước khi đi sâu vào cách upgrade PostgreSQL ảnh hưởng đến AWS DMS tasks, hãy hiểu rõ về **major version** và **minor version upgrades** trong PostgreSQL.

### 🔹 Minor Version Upgrade

**Minor version** sửa các lỗ hổng bảo mật, fix bugs, và thường **không thêm tính năng mới**.

**Đặc điểm:**
- ✅ **Không thay đổi** internal storage format
- ✅ **Luôn tương thích** với minor releases trước và sau có cùng major version number
- ✅ **Ví dụ:** Version 14.10 tương thích với version 14.9 và 14.16

**Downtime:** Minor version upgrade gây downtime nên cần thực hiện trong maintenance window phù hợp.

### 🔸 Major Version Upgrade

**Major release** của PostgreSQL có thể thay đổi:
- System tables
- Data files  
- Internal data storage format

**Phương pháp nâng cấp:**
RDS for PostgreSQL sử dụng native **`pg_upgrade`** utility để upgrade instance lên major version mới.

📖 **Chi tiết:** [Amazon RDS の PostgreSQL DB エンジンのアップグレード](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html)

**Downtime:** Major version upgrade gây downtime nên cần thực hiện trong maintenance window phù hợp.

### 💡 Khuyến nghị

Nên lên kế hoạch **scheduled maintenance window** vào thời điểm có **ít queries nhất** đến database cho công việc upgrade này.

---

## 🔄 Cách AWS DMS tương tác với PostgreSQL

Hãy xem xét trường hợp sử dụng AWS DMS để migrate dữ liệu từ **PostgreSQL source** sang **PostgreSQL target**.

### 📥 Full Load Phase

**Tại Source:**
1. AWS DMS kết nối đến source PostgreSQL database
2. Thực thi `select *` trên các tables được định nghĩa trong table mappings để unload data

**Tại Replication Instance:**
- Data lấy từ source được ghi vào **CSV files** trên replication instance hướng đến PostgreSQL target

**Tại Target:**
- AWS DMS sử dụng lệnh **`COPY`** để load data từ CSV files vào target PostgreSQL tables

### 📤 CDC (Change Data Capture) Phase

Để capture các thay đổi liên tục trong quá trình migration, AWS DMS tạo **logical replication slot** trên source PostgreSQL database.

**Replication Slot:**
- 🔹 Đại diện cho **stream of changes**
- 🔹 Có thể replay lại cho client theo đúng thứ tự thực thi trên source PostgreSQL database

**Logical Decoding Plugins:**

AWS DMS sử dụng một trong hai plugins để logical decoding các thay đổi từ replication slot:
1. **`test_decoding`**
2. **`pglogical`**

**Quy tắc lựa chọn:**
- Nếu `pglogical` plugin có sẵn trên source PostgreSQL database → DMS sử dụng `pglogical`
- Nếu không → Sử dụng `test_decoding`

**Sorter Component:**

Changes đọc từ source được chuyển đến **sorter component** trên replication instance:
- Sort transactions theo commit order
- Apply changes này vào target database theo chế độ sequential hoặc batch mode dựa trên DMS task settings

### ⚠️ VAI TRÒ QUAN TRỌNG CỦA REPLICATION SLOT

Replication slot đóng vai trò **quan trọng** trong:
- **Full Load + CDC tasks**
- **CDC only tasks**

**Chức năng:**
- 📌 Giữ lại các **WAL (Write-Ahead Logging) files** cần thiết trên source PostgreSQL database
- 📌 Nếu replication slot bị xóa trên source database → **DMS không thể xử lý continuous changes từ source database**

---

## 🎯 Ảnh hưởng của PostgreSQL Upgrade đến AWS DMS Tasks

### 1️⃣ Khi Upgrade Source PostgreSQL Database

#### 📦 Full Load Only Tasks

**Tác động:** ✅ **Không ảnh hưởng**

**Recommendation:**
- Full Load only DMS tasks được thiết kế cho **one-time data migration**
- Có thể **safely resume** sau khi minor hoặc major version upgrade hoàn tất

#### 🔄 Full Load + CDC và CDC Only Tasks

Các tasks này **continuously replicate** ongoing changes đến target database. Cần tuân theo best practices dưới đây:

---

### 🔹 MINOR VERSION UPGRADE

**Các bước thực hiện:**

1. **Stop** các running AWS DMS replication tasks trước khi thực hiện minor version upgrade
2. Hoàn tất minor version upgrade
3. **Resume** DMS tasks

---

### 🔸 MAJOR VERSION UPGRADE

**Kiểm tra tương thích:**

Tại thời điểm viết bài, DMS hỗ trợ PostgreSQL versions:
- 9.4 trở lên (9.x versions)
- 10.x, 11.x, 12.x, 13.x, 14.x, 15.x, 16.x

⚠️ **Quan trọng:** Đảm bảo replication instance **hỗ trợ PostgreSQL version mới** trước khi thực hiện major version upgrade.

#### ❗ VẤN ĐỀ VỚI REPLICATION SLOTS

**Constraint của `pg_upgrade`:**

Để tiến hành major version upgrade sử dụng `pg_upgrade`, **cần phải xóa replication slots** trên source PostgreSQL database.

**Hậu quả:**
- ❌ Không xóa slots → Upgrade process bị ảnh hưởng
- ❌ Thử upgrade mà không xóa slots → Lỗi trong `pg_upgrade_precheck.log`: "Không thể upgrade instance do bị block bởi một hoặc nhiều logical replication slots"
- ❌ Xóa replication slots → AWS DMS tasks bị **invalidated** và không thể resume ongoing replication tasks

---

## 🛠️ GIẢI PHÁP: Các bước xử lý Major Version Upgrade

### ✅ STEP 1: Stop Application Connections

Dừng tất cả kết nối ứng dụng đến PostgreSQL database.

**Monitor active connections:**
```sql
select * from pg_stat_activity where datname = 'database_name';
```

**Terminate remaining connections nếu cần:**
```sql
select pg_terminate_backend(pid) 
from pg_stat_activity 
where datname = 'database_name' 
and pid <> pg_backend_pid();
```

---

### ✅ STEP 2: Monitor DMS Task Metrics

Monitor AWS DMS task metrics để đảm bảo:
- ✅ **`CDCLatencySource`** gần về **zero**
- ✅ **`CDCLatencyTarget`** gần về **zero**

Điều này xác nhận DMS task đang replicate changes **không có latency**.

**Alternative method:**
Sử dụng `awsdms_txn_state` trên target để lấy task status (cần enable task setting `TaskRecoveryTableEnabled = True`).

**CloudWatch Metrics:**

Hình ảnh sau hiển thị CloudWatch metrics cho `CDCLatencySource` và `CDCLatencyTarget`.

---

### ✅ STEP 3: Stop DMS Tasks

Khi latency gần zero, **stop tất cả active replication DMS tasks**.

---

### ✅ STEP 4: Drop Replication Slots

Xóa existing replication slots từ source PostgreSQL database.

**Kiểm tra slots hiện tại:**
```sql
postgres=> select * from pg_replication_slots;

 slot_name | plugin | slot_type | datoid | database | temporary | active | active_pid | xmin | catalog_xmin | restart_lsn | confirmed_flush_lsn | wal_status | safe_wal_size 
-----------+--------+-----------+--------+----------+-----------+--------+------------+------+--------------+-------------+---------------------+------------+---------------
bb6jw1f3enambi4z_00014405_e3972613_00e2_4960_ae4c_fe267b1cfcde | test_decoding | logical | 14405 | postgres | f | f | | | 898 | 0/5936F798 | 0/5F1A3440 | reserved |
(1 row)
```

**Drop slot:**
```sql
postgres=> SELECT pg_drop_replication_slot('bb6jw1f3enambi4z_00014405_e3972613_00e2_4960_ae4c_fe267b1cfcde');

 pg_drop_replication_slot
--------------------------
 
(1 row)
```

---

### ✅ STEP 5: Verify No Replication Slots

Xác nhận không còn replication slot nào:

```sql
postgres=> select * from pg_replication_slots;

 slot_name | plugin | slot_type | datoid | database | temporary | active | active_pid | xmin | catalog_xmin | restart_lsn | confirmed_flush_lsn | wal_status | safe_wal_size
-----------+--------+-----------+--------+----------+-----------+--------+------------+------+--------------+-------------+---------------------+------------+---------------
(0 rows)
```

---

### ✅ STEP 6: Complete In-Place Upgrade

Hoàn tất **in-place upgrade** của PostgreSQL database.

---

### ✅ STEP 7: Verify Upgrade Success

Xác nhận upgrade process đã hoàn thành thành công:
- ✅ Thực hiện **database-level validation checks**
- ✅ Đảm bảo database hoạt động như mong đợi sau upgrade

**Trước khi start applications:** Xử lý DMS tasks theo **STEP 8** hoặc **STEP 9**.

---

### ✅ STEP 8: Option A - Tạo CDC Only Task mới

**Cách thực hiện:**

1. Tạo **CDC only task mới**
2. Trong task settings, chọn **"Disable Custom CDC Start Mode"** trong **"CDC start mode for source transactions"**
3. Định nghĩa các task settings và table mappings khác tương tự old task

**Khi task được tạo:**
- Start CDC only task
- Tạo **new replication slot** trên source PostgreSQL database
- Bắt đầu migrate changes **từ thời điểm replication slot được tạo**

---

### ✅ STEP 9: Option B - Sử dụng LSN cụ thể

**Cách thực hiện:**

Có thể manually tạo replication slot trên source PostgreSQL database và sử dụng DMS CDC only task bắt đầu từ **specified Log Sequence Number (LSN)**.

#### 📌 9a. Tạo Replication Slot và ghi nhận confirmed_flush_lsn

**`confirmed_flush_lsn`** đại diện cho:
- LSN cuối cùng mà consumer của logical slot đã **confirm với PostgreSQL engine** là đã receive data
- Data tương ứng với transactions committed **trước LSN này** không còn available nữa

#### 📌 9b. Modify Source Endpoint Settings

Thay đổi source endpoint configuration và thêm desired slot đã tạo trên source PostgreSQL database làm **`SlotName`**.

#### 📌 9c. Modify Task Settings

Thay đổi task settings:
- ✅ Chọn **"Enable Custom CDC Start Mode"**
- ✅ Chọn **"Specify Log Sequence Number"** (hoặc "Native CDC Start Point" trong new DMS console navigation)
- ✅ Nhập LSN từ `confirmed_flush_lsn`

---

### ✅ STEP 10: Start DMS Task

Start DMS task và verify rằng changes đang được migrated đến target database **without issues**.

---

### ✅ STEP 11: Start Applications

Launch applications và monitor DMS CDC replication.

---

## 2️⃣ Khi Upgrade Target PostgreSQL Database

### 🔹 Minor Version Upgrade

**Tác động:** ✅ AWS DMS CDC **không bị ảnh hưởng** bởi minor version upgrade của target PostgreSQL database.

**Recommendation:**
- Stop DMS tasks trước khi upgrade
- Resume sau khi minor version upgrade thành công

---

### 🔸 Major Version Upgrade

**Kiểm tra compatibility:**

#### Scenario 1: Engine version mới được hỗ trợ

Nếu current replication instance engine version **hỗ trợ PostgreSQL version mới**:
1. Stop AWS DMS tasks
2. Hoàn tất major version upgrade
3. Resume DMS tasks

#### Scenario 2: Engine version mới KHÔNG được hỗ trợ

Nếu engine version mới **không được hỗ trợ** bởi current replication instance version:
1. Stop DMS tasks
2. Hoàn tất major version upgrade trên target PostgreSQL database
3. **Upgrade replication instance** lên version hỗ trợ current version của target PostgreSQL database
4. Sau khi cả target và source databases đều updated lên compatible major versions → Resume DMS tasks

---

## 🧹 Cleanup

Xóa các resources đã tạo để revert changes và tránh phát sinh chi phí liên tục:

1. 🗑️ Xóa **RDS for PostgreSQL instances** và **EC2 instances** đã tạo cho testing
2. 🗑️ Xóa **AWS DMS tasks** đã tạo cho testing
3. 🗑️ Xóa **AWS DMS source và target endpoints**
4. 🗑️ Xóa **AWS DMS replication instance**

---

## 📊 Tổng kết

Bài viết này đã giải thích cách xử lý DMS tasks khi upgrade PostgreSQL database được configure làm **source** hoặc **target** của AWS DMS.

### 🔑 Key Takeaways

#### 📌 Full Load Only Tasks
- ✅ Không ảnh hưởng bởi upgrades
- ✅ Có thể safely resume sau upgrade

#### 📌 Full Load + CDC và CDC Only Tasks

**Minor Version Upgrade:**
- Stop tasks → Upgrade → Resume tasks

**Major Version Upgrade (Source):**
- Cần xóa replication slots (constraint của pg_upgrade)
- 2 options sau upgrade:
  - **Option A:** Tạo CDC only task mới (disable custom CDC start mode)
  - **Option B:** Manual tạo replication slot + specify LSN

**Major Version Upgrade (Target):**
- Đảm bảo replication instance hỗ trợ version mới
- Có thể cần upgrade replication instance

### ⚠️ Critical Points

1. **Replication slot** là yếu tố quan trọng cho CDC replication
2. Xóa replication slot → Không thể resume ongoing replication
3. `pg_upgrade` **yêu cầu** xóa replication slots
4. Monitor **CDCLatencySource** và **CDCLatencyTarget** trước khi upgrade
5. Stop application connections trước khi upgrade
6. Verify upgrade success trước khi resume operations

### 🎯 Best Practices Summary

✅ Plan maintenance window vào thời điểm low query activity  
✅ Monitor latency metrics cho đến zero trước khi stop tasks  
✅ Terminate application connections trước upgrade  
✅ Document `confirmed_flush_lsn` nếu dùng Option B  
✅ Verify database functionality sau upgrade  
✅ Test DMS replication trước khi start applications  
✅ Keep replication instance version updated  

---

## 👥 Về tác giả

### Veeramani A
**Amazon Web Services - Cloud Database Engineer**
- SME (Subject Matter Expert) cho AWS Database Migration Service và Amazon RDS for PostgreSQL
- Hơn 15 năm kinh nghiệm với đa dạng database technologies
- Cung cấp strategic guidance và technical expertise cho customers migrate databases lên AWS

### Manoj Ponnurangam
**Amazon Web Services - Cloud Database Engineer**
- SME (Subject Matter Expert) cho Amazon RDS for Oracle, Amazon RDS for PostgreSQL, AWS DMS
- 15 năm kinh nghiệm với relational databases
- Hợp tác với customers để cung cấp guidance và technical assistance cho various database và migration projects

---

## 📚 Tài liệu tham khảo

1. **[AWS Database Migration Service](https://aws.amazon.com/dms/)**
2. **[Homogeneous Data Migrations](https://docs.aws.amazon.com/dms/latest/userguide/dm-migrating-data-postgresql.html)**
3. **[Heterogeneous Migrations](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html)**
4. **[PostgreSQL Versioning](https://www.postgresql.org/support/versioning/)**
5. **[pg_upgrade Utility](https://www.postgresql.org/docs/current/pgupgrade.html)**
6. **[Upgrading PostgreSQL DB Engine in Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.PostgreSQL.html)**
7. **[Comparison of test_decoding and pglogical Plugins](https://aws.amazon.com/blogs/database/comparison-of-test_decoding-and-pglogical-plugins-in-amazon-aurora-postgresql-for-data-migration-using-aws-dms/)**

---

## 💬 Kết luận

Việc upgrade PostgreSQL database đang được sử dụng trong AWS DMS replication yêu cầu **careful planning** và **proper handling** của DMS tasks để đảm bảo continuous data replication không bị gián đoạn.

**Key Success Factors:**
- 🎯 Hiểu rõ sự khác biệt giữa minor và major version upgrades
- 🎯 Nắm vững vai trò của replication slots
- 🎯 Follow đúng sequence of steps
- 🎯 Monitor metrics carefully
- 🎯 Test thoroughly trước khi resume production

Hãy thử giải pháp này và chia sẻ feedback hoặc câu hỏi trong comments! 🚀

URL: https://aws.amazon.com/jp/blogs/news/aws-dms-upgrade-bestpractice/
TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
