---
title: "Nguyên nhân và cách khắc phục tình trạng ALTER TABLE ADD COLUMN bị treo trong PostgreSQL"
date: 2025-10-14
draft: false
categories: ["Data and Analytics", "DevOps and Infrastructure"]
tags: ["PostgreSQL", "SQL", "DDL", "ALTER-TABLE", "Database-Management", "RDBMS"]
description: "Tìm hiểu nguyên nhân khiến lệnh ALTER TABLE ADD COLUMN bị treo trong PostgreSQL và các phương pháp khắc phục hiệu quả khi deploy database."
---

**Tác giả:** 依田 健人 (@take-yoda)  
**Tổ chức:** BrainPad Inc.  
**Ngày đăng:** 2025-10-14  
**Nguồn:** https://qiita.com/take-yoda/items/8229d1b6b070ee690dd5


---

## Giới thiệu

Bạn đã bao giờ gặp tình huống khi cố gắng thêm cột vào bảng trong database, lệnh DDL bị treo (hang) khiến việc deploy bị trì hoãn chưa?

Tôi đã gặp phải vấn đề này khi phát hiện quá trình deploy trong CD pipeline kéo dài bất thường. Trong bài viết này, tôi sẽ tái tạo hiện tượng bằng code, giải thích nguyên nhân, và giới thiệu các biện pháp khắc phục cơ bản.

## Thông tin môi trường

| Hạng mục | Phiên bản |
|----------|-----------|
| OS | macOS Sequoia 15.6.1 |
| PostgreSQL | 18.0 |
| MySQL | 9.4.0 |
| Oracle Database | 23ai Free 23.0.0.0.0 |

## Tái tạo hiện tượng

Các bước thực tế để làm cho DDL bị treo như sau:

### Chuẩn bị

Tạo bảng và dữ liệu mẫu để tái tạo tình trạng treo khi sử dụng `ALTER TABLE ADD COLUMN`.

```sql
-- Tạo bảng thử nghiệm
CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    data TEXT
);

-- Chèn dữ liệu mẫu
INSERT INTO test_table (data)
SELECT 'sample' || generate_series(1, 1000);
```

### Session 1 (Transaction A: SELECT dài hạn)

Mô phỏng tình huống khi query của ứng dụng đan xen vào quá trình thực thi DDL trong CD pipeline, gây treo.

Trong trường hợp của tôi, trước khi CD pipeline chạy, có một batch process tham chiếu đến bảng mục tiêu của DDL đang chạy. Tôi sẽ tái tạo session đó bằng query sau:

```sql
BEGIN; -- Bắt đầu transaction
SELECT * FROM test_table WHERE id > 0;
-- Hiển thị kết quả ở đây và để yên (đã lấy AccessShareLock)
-- Không COMMIT, chỉ đợi (mô phỏng query song song trong CD pipeline)
```

### Session 2 (ALTER TABLE: Thực thi DDL)

Tiếp theo, truy cập PostgreSQL từ một session khác và thực thi `ALTER TABLE`.

```sql
ALTER TABLE test_table ADD COLUMN new_column INTEGER;
-- Bị treo ở đây (đợi AccessExclusiveLock)
```

Khi thực thi từ command line, con trỏ sẽ nhấp nháy như hình dưới đây và ở trạng thái treo.

![movie.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3551450/db9aab17-7a88-4df8-9fd3-07dfede837c9.gif)

### Session 3 (Transaction B: SELECT khác)

Điều thực sự đáng sợ không chỉ là DDL bị treo, mà là hiện tượng xảy ra sau đó. Ví dụ, khi thực hiện deploy không có downtime, có khả năng gặp phải hiện tượng được mô tả dưới đây.

Các bước rất đơn giản: kết nối PostgreSQL từ một session mới và thực thi query sau:

```sql
SELECT id FROM test_table;
-- Bị treo ở đây (hiệu ứng dây chuyền)
```

Kết quả là **câu lệnh SELECT cũng bị treo**.

![movie-2.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3551450/c971f686-3ae8-445d-91c2-eaf3d7844a63.gif)

Nếu điều này xảy ra trong API của ứng dụng web, sẽ gây ra sự cố nghiêm trọng.

### Hoàn thành Session 1

Khi `commit` hoặc `rollback` Session 1 (Transaction A) để kết thúc transaction, DDL ở Session 2 sẽ hoàn thành và ngay lập tức Session 3 cũng trả về kết quả.

![movie-3.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3551450/161214f2-a7ec-4c8c-b127-5348da205c87.gif)

Hình trên cho thấy trạng thái sau khi `ALTER TABLE ADD COLUMN` hoàn thành. Sau câu lệnh `ALTER`, thông báo `ALTER TABLE` được hiển thị và console có thể nhập lệnh tiếp theo.

## Nguyên nhân DDL và DML bị treo

Nguyên nhân của hiện tượng này nằm ở cơ chế xử lý khóa (lock) của PostgreSQL.

Trong PostgreSQL, khi thực thi câu lệnh SELECT, một `AccessShareLock` (shared lock) được đặt lên bảng. Đây là loại khóa nhẹ nhất trong PostgreSQL và nhiều session có thể lấy đồng thời.

Tuy nhiên, khóa này xung đột với các thao tác độc quyền (ví dụ: `AccessExclusiveLock` của `ALTER TABLE`) và sẽ chuyển sang trạng thái chờ.

PostgreSQL áp dụng cơ chế MVCC (Multi-Version Concurrency Control), tạo snapshot của phiên bản dữ liệu trong khi đọc (SELECT) để đảm bảo tính nhất quán. Tuy nhiên, khi thay đổi cấu trúc bảng (DDL), snapshot đó **có thể** bị vô hiệu hóa, do đó `AccessShareLock` được sử dụng để bảo vệ quá trình đọc và chặn thao tác thay đổi.

Điều này đảm bảo các thuộc tính ACID của database (Atomicity, Consistency, Isolation, Durability), đặc biệt là **Consistency (tính nhất quán) và Isolation (tính cô lập)**, nhưng đồng thời cũng trở thành nguyên nhân khiến DDL bị treo khi có transaction dài hạn đang chạy.

Hơn nữa, khi có SELECT mới đến, hàng đợi khóa sẽ tích tụ, gây ra hiệu ứng dây chuyền treo.

### Luồng tổng thể

Sơ đồ mô tả toàn bộ luồng trong ví dụ này như sau:

![diagram](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3551450%2F...)

### FYI: Theo dõi trạng thái khóa

Đây là ví dụ về query được sử dụng khi kiểm tra tình trạng khóa của bảng trong PostgreSQL.

Đầu tiên, query để hiển thị tình trạng khóa như sau (có thể xác nhận việc lấy nhiều `AccessShareLock`):

```sql
SELECT * FROM pg_locks WHERE relation = 'test_table'::regclass;
```

**Ví dụ đầu ra:**

```
locktype | database | relation | page | tuple | virtualxid | transactionid | classid | objid | objsubid | virtualtransaction | pid | mode                 | granted | fastpath | waitstart
---------+----------+----------+------+-------+------------+---------------+---------+-------+----------+--------------------+-----+---------------------+---------+----------+------------------------------
relation | 5        | 16388    |      |       |            |               |         |       |          | 5/6                | 183 | AccessExclusiveLock | f       | f        | 2025-10-12 07:38:43.520741+00
relation | 5        | 16388    |      |       |            |               |         |       |          | 7/3                | 222 | AccessShareLock     | f       | f        | 2025-10-12 07:38:48.707213+00
relation | 5        | 16388    |      |       |            |               |         |       |          | 3/9                | 152 | AccessShareLock     | t       | f        |
(3 rows)
```

Tiếp theo, query để xác nhận các query đang chờ như sau:

```sql
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

**Ví dụ đầu ra:**

```
datid | datname  | pid | leader_pid | usesysid | usename  | application_name | client_addr | client_hostname | client_port | backend_start                 | xact_start                    | query_start                   | state_change                  | wait_event_type | wait_event | state  | backend_xid | backend_xmin | query_id | query                                                  | backend_type
------+----------+-----+------------+----------+----------+------------------+-------------+-----------------+-------------+-------------------------------+-------------------------------+-------------------------------+-------------------------------+-----------------+------------+--------+-------------+--------------+----------+--------------------------------------------------------+--------------
5     | postgres | 315 |            | 10       | postgres | psql             | 172.17.0.1  |                 | 48696       | 2025-10-12 07:39:08.712211+00 | 2025-10-12 07:43:35.621448+00 | 2025-10-12 07:43:35.621448+00 | 2025-10-12 07:43:35.621471+00 |                 |            | active |             | 768          |          | SELECT * FROM pg_stat_activity WHERE state = 'active'; | client backend
5     | postgres | 222 |            | 10       | postgres | psql             | 172.17.0.1  |                 | 39596       | 2025-10-12 06:50:51.150299+00 | 2025-10-12 07:38:48.703999+00 | 2025-10-12 07:38:48.703999+00 | 2025-10-12 07:38:48.704043+00 | Lock            | relation   | active |             | 768          |          | SELECT id FROM test_table;                             | client backend
5     | postgres | 183 |            | 10       | postgres | psql             | 172.17.0.1  |                 | 41728       | 2025-10-12 06:32:16.164868+00 | 2025-10-12 07:38:43.520006+00 | 2025-10-12 07:38:43.520006+00 | 2025-10-12 07:38:43.520038+00 | Lock            | relation   | active | 768         | 768          |          | ALTER TABLE test_table ADD COLUMN new_column INTEGER;  | client backend
(3 rows)
```

### FYI: Các RDBMS khác

Tôi đã kiểm tra xem hiện tượng tương tự có xảy ra trong các RDBMS khác ngoài PostgreSQL không.

#### MySQL

Trong MySQL, hiện tượng DDL bị treo và tiếp theo là SELECT bị treo cũng được tái tạo.

Mặc dù "Instant ADD COLUMN" đã được giới thiệu cho phép thêm cột chỉ bằng cách thay đổi metadata trong một số điều kiện cụ thể, nhưng nó không có hiệu quả trong ví dụ transaction này.

#### OracleDB

Trong Oracle, DDL không bị treo do câu lệnh SELECT thông thường. Tuy nhiên, khi áp dụng khóa hàng bằng `FOR UPDATE`, DDL sẽ bị treo.

Ngoài ra, khi DDL đang bị treo và thực thi câu lệnh SELECT từ Transaction B, Transaction B không bị treo và trả về kết quả query.

## Biện pháp khắc phục

Không có nhiều biện pháp phòng ngừa DDL bị treo.

Để đạt được zero downtime, cần có chiến lược migration nâng cao (ví dụ: Blue/Green deploy sử dụng logical replication hoặc công cụ migration online chuyên dụng), điều mà các biện pháp cơ bản được giới thiệu trong bài viết này không thể đáp ứng.

### Biện pháp chống chờ khóa của DDL

Đây là biện pháp phòng ngừa thời gian dài do chờ giải phóng `AccessShareLock` bằng cách thiết lập giá trị timeout khi thực thi DDL.

```sql
SET lock_timeout = '5s';
ALTER TABLE test_table ADD COLUMN new_column INTEGER;
```

Bằng cách thiết lập `lock_timeout`, khi việc chờ giải phóng khóa kéo dài, lỗi như hình dưới sẽ xảy ra.

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3551450/2bd71ea0-cf7f-4ad4-94e7-6cc875bf58ab.png)

### Kết thúc cưỡng bức session đang chờ

Đây là biện pháp kết thúc cưỡng bức các session đang chờ trước khi thực thi DDL.

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()
  AND datname = current_database();
```

> ⚠️ **Cảnh báo quan trọng**
> 
> Query trên có thể ngắt các xử lý quan trọng. Không nên sử dụng trong môi trường production, và ngay cả trong môi trường phát triển cũng nên thận trọng. Hãy coi đây là **phương án cuối cùng** khi không còn cách nào khác.

### Các phương pháp khác

Có công cụ như [pgroll](https://pgroll.com/) (zero downtime migration) để giảm thiểu khóa, nhưng ngay cả khi sử dụng công cụ này, xung đột giữa `AccessShareLock` và DDL **vẫn không thể tránh được**.

Một số AI tạo sinh đã trả lời rằng có thể giải quyết bằng cách sử dụng công cụ này[^1], nhưng tính đến phiên bản `0.14.3`, nó không thể được áp dụng như một biện pháp trực tiếp.

[^1]: Tính đến ngày 2025/10/12

### FYI: Có thể khắc phục bằng phân tán không?

Một số người có thể nghĩ đến kiến trúc "thực thi DDL trên một node trong khi tiếp tục đọc trên node khác". Tuy nhiên, trong PostgreSQL **không tồn tại cơ chế hỗ trợ cấu hình multi-primary (multi-write) một cách native**.

Các lựa chọn có thể xem xét bao gồm:

1. **Cấu hình read replica sử dụng replication**
   - Với streaming replication thông thường, DDL được thực thi trên primary và lan truyền đến replica. Replica có thể tiếp tục đọc với cài đặt như `hot_standby_feedback`, nhưng có khả năng xảy ra stall tạm thời tại thời điểm áp dụng DDL.

2. **Extension multi-primary từ bên thứ ba**
   - Ví dụ như [Bucardo](https://bucardo.org/) hoặc [pglogical](https://github.com/2ndQuadrant/pglogical) - các cơ chế logical replication có thể thực hiện cấu hình "multi-write", nhưng việc lan truyền DDL không được hỗ trợ hoặc có nhiều hạn chế, do đó **không phải là giải pháp trong ngữ cảnh áp dụng DDL không có downtime**.

3. **Commercial distribution (ví dụ: Postgres-BDR)**
   - Một số commercial distribution thực hiện multi-primary, nhưng cũng có ràng buộc trong việc phản ánh DDL ngay lập tức.

Nhìn chung, không có đảm bảo rằng "multi-primary cho phép thực hiện DDL không có downtime", và **việc xử lý DDL cần được thiết kế nghiêm ngặt trong bất kỳ cấu hình nào**.

## Kết luận

Trong bài viết này, tôi đã tái tạo hiện tượng `ALTER TABLE ADD COLUMN` bị treo và giải thích cơ chế xung đột khóa gây ra nguyên nhân.

Tóm tắt như sau:

- `ALTER TABLE` của PostgreSQL yêu cầu `AccessExclusiveLock` và xung đột với `AccessShareLock` của SELECT
- Khi có transaction dài hạn, DDL phải chờ và các SELECT mới cũng bị treo theo chuỗi
- Biện pháp khắc phục bị hạn chế:
  - Về mặt vận hành: "Thực thi DDL vào thời điểm ít ảnh hưởng đến dịch vụ"
  - Thiết lập `lock_timeout` để ngăn việc kéo dài thời gian

So sánh với các RDBMS khác, việc thực thi DDL không có downtime vẫn là thách thức khó khăn. Do đó, có thể nói **"Cách xử lý DDL trong production chính là nơi thể hiện năng lực của DB Engineer và Backend Engineer"**.

Hy vọng bài viết này sẽ là gợi ý hữu ích cho vận hành và thiết kế của các bạn.

---

**Thống kê bài viết:**
- 14 Likes
- 6 Stocks
- 0 Comments
