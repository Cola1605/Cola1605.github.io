---
title: "Hiểu Rõ SQL Anti-pattern Từ Gốc Rễ: 5 Truy Vấn NG Khiến \"Database Khóc\" Và Giải Pháp Cải Thiện Từ Thực Tế"
date: 2025-12-06
updated: 2025-12-08
author: "@Shiro_Shihi"
organization: "デジタル創作サークルUniProject"
event: "デジタル創作サークルUniProject Advent Calendar 2025"
event_day: 7
categories:
  - SQL
  - Database
  - Hiệu Suất
tags:
  - SQL
  - Anti-pattern
  - Performance
  - Index
  - N+1 Problem
  - Query Optimization
source: Qiita
source_url: https://qiita.com/Shiro_Shihi/items/b1b582c4528c5dd802f5
engagement:
  likes: 116
  comments: 84
---

## Giới Thiệu

SQL Anti-pattern là **các mẫu truy vấn tuy có vẻ hoạt động được, nhưng gây ra vấn đề nghiêm trọng về hiệu suất và khả năng bảo trì**.

Trong bài viết này, tôi sẽ trình bày **5 anti-pattern** gặp phải thường xuyên trong thực tế, giải thích nguyên lý, mẫu NG, mẫu OK, trade-off, và checklist thực tế một cách có hệ thống.

**Đối tượng độc giả**: Developer thiết kế và vận hành database, kỹ sư làm việc cải thiện hiệu suất

---

## Anti-pattern ① Hàm/Toán Tử Giết Chết Index

### Nguyên Lý

Khi **áp dụng hàm hoặc toán tử lên column** trong mệnh đề WHERE, index của column đó không thể sử dụng được, dẫn đến **full table scan**.

### Mẫu NG

```sql
SELECT * FROM orders 
WHERE YEAR(created_at) = 2024;
```

**Vấn đề**:
- Dù column `created_at` có index, nhưng vì hàm `YEAR()` được áp dụng nên **B-Tree index không thể sử dụng**
- Phải scan toàn bộ các dòng và áp dụng hàm, thời gian xử lý tăng tỷ lệ thuận với số dòng

### Mẫu OK

```sql
SELECT * FROM orders 
WHERE created_at >= '2024-01-01' 
  AND created_at < '2025-01-01';
```

**Lý do cải thiện**:
- Không biến đổi column mà sử dụng **so sánh phạm vi**, index được sử dụng hiệu quả
- Tận dụng đặc tính của B-Tree index để tìm kiếm tốc độ cao

### Các Ví Dụ Khác

| Mẫu NG | Mẫu OK |
|--------|--------|
| `WHERE price * 1.1 > 1000` | `WHERE price > 1000 / 1.1` |
| `WHERE LOWER(email) = 'user@example.com'` | `WHERE email = 'user@example.com'`<br/>(Sử dụng COLLATION không phân biệt chữ hoa thường) |

### Checklist Thực Tế

- ✅ Xác nhận không áp dụng hàm hoặc toán tử lên column trong mệnh đề WHERE
- ✅ Xác nhận không có full scan (Seq Scan / Table Scan) bằng EXPLAIN
- ✅ Xác nhận index có hiệu lực bằng Index Scan / Index Seek

---

## Anti-pattern ② N+1 Problem

### Nguyên Lý

Sau khi lấy dữ liệu cha 1 lần, **lấy dữ liệu con từng dòng cho mỗi dữ liệu cha** sẽ phát sinh "**1 + N lần**" truy vấn, hiệu suất giảm mạnh.

### Mẫu NG

```sql
SELECT * FROM users; -- 1 lần

-- Loop trong application code
FOREACH user:
  SELECT * FROM orders WHERE user_id = ?; -- N lần
```

**Vấn đề**:
- Với 1000 user thì tổng cộng **1001 truy vấn**
- Network round-trip và query execution overhead khổng lồ

### Mẫu OK

```sql
-- Phương pháp 1: Eager Loading (JOIN)
SELECT users.*, orders.* 
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Phương pháp 2: Mệnh đề IN
SELECT * FROM users; -- 1 lần
SELECT * FROM orders WHERE user_id IN (1, 2, ..., 1000); -- 1 lần
```

**Lý do cải thiện**:
- Số lần truy vấn **giảm xuống 2 lần**
- Network overhead giảm đáng kể

### Trade-off

⚠️ **Nhược điểm JOIN**:
- Result set trở nên lớn, có thể tăng memory và lượng data transfer

⚠️ **Nhược điểm mệnh đề IN**:
- Khi chứa nhiều ID, truy vấn trở nên dài

### Checklist Thực Tế

- ✅ Xác nhận không thực thi query trong loop
- ✅ Xác nhận sử dụng Eager Loading (JOIN / includes) của ORM
- ✅ Xác nhận trong slow query log không có nhiều query cùng pattern được ghi lại

---

## Anti-pattern ③ Performance Killer Ẩn Giấu \"SELECT *\"

### Nguyên Lý

`SELECT *` transfer cả **các column không cần thiết** (đặc biệt là kiểu BLOB hoặc TEXT) và **vô hiệu hóa tối ưu hóa covering index**.

### Mẫu NG

```sql
SELECT * FROM products;
```

**Vấn đề**:
- Transfer dữ liệu BLOB lớn và các column không cần thiết, ép băng thông mạng và memory
- Không thể sử dụng covering index

### Mẫu OK

```sql
SELECT id, name, price FROM products;
```

**Lý do cải thiện**:
- **Chỉ lấy các column cần thiết**
- Nếu có covering index `(id, name, price)`, không cần truy cập table (**Index Only Scan**)

### Trade-off

⚠️ Cần sửa câu lệnh SELECT khi thêm column

### Checklist Thực Tế

- ✅ Xác nhận có thực sự cần tất cả column không
- ✅ Xác nhận không SELECT column BLOB / TEXT
- ✅ Xác nhận câu lệnh SELECT có thể tận dụng covering index

---

## Anti-pattern ④ Bẫy Của Tìm Kiếm LIKE

### Nguyên Lý

Tìm kiếm LIKE không phải prefix match (`%pattern%` hoặc `%pattern`) **không thể sử dụng B-Tree index**, xảy ra full scan.

### Mẫu NG

```sql
SELECT * FROM users 
WHERE name LIKE '%田中%';
```

**Vấn đề**:
- B-Tree index **chỉ hỗ trợ prefix match**
- Với middle match và suffix match, index bị vô hiệu hóa, scan toàn bộ dòng

### Mẫu OK

```sql
-- Prefix match thì OK
SELECT * FROM users 
WHERE name LIKE '田中%';

-- Sử dụng full-text search engine
-- Elasticsearch / PGroonga / MySQL FULLTEXT INDEX
```

**Lý do cải thiện**:
- Prefix match thì sử dụng được index
- Full-text search engine cho phép middle match tốc độ cao

### Trade-off

⚠️ **Nhược điểm full-text search engine**:
- Cần chi phí xây dựng và vận hành infrastructure riêng
- Cần maintenance đồng bộ dữ liệu và rebuild index

### Checklist Thực Tế

- ✅ Xác nhận không sử dụng `LIKE '%...%'`
- ✅ Xem xét có thể giải quyết bằng prefix match không
- ✅ Nếu middle match là bắt buộc, xem xét triển khai full-text search engine

---

## Anti-pattern ⑤ Không Hiệu Quả Của INSERT Từng Dòng

### Nguyên Lý

INSERT từng dòng một sẽ phát sinh **network round-trip và transaction overhead** bằng số lượng dòng.

### Mẫu NG

```sql
INSERT INTO products (name, price) VALUES ('商品A', 1000);
INSERT INTO products (name, price) VALUES ('商品B', 2000);
-- Lặp lại 10,000 lần
```

**Vấn đề**:
- Với 10,000 dòng thì phát sinh **10,000 lần network communication + 10,000 lần transaction processing**

### Mẫu OK

```sql
-- Bulk INSERT
INSERT INTO products (name, price) VALUES
  ('商品A', 1000),
  ('商品B', 2000),
  ...
  ('商品Z', 26000);

-- Hoặc sử dụng bulk API
-- PostgreSQL: COPY
-- MySQL: LOAD DATA INFILE
```

**Lý do cải thiện**:
- Hoàn thành bằng **1 lần network communication + 1 lần transaction processing**
- Nhanh hơn hàng chục ~ hàng trăm lần

### Trade-off

⚠️ **Nhược điểm Bulk INSERT lớn**:
- INSERT nhiều dòng cùng lúc làm tăng memory usage
- Lock được giữ lâu, có thể block các transaction khác

**Kích thước batch khuyến nghị**: Chia batch khoảng **100〜10,000 dòng**

### Checklist Thực Tế

- ✅ Xác nhận không thực thi INSERT trong loop
- ✅ Xác nhận sử dụng bulk INSERT / bulk API
- ✅ Xác nhận kích thước batch phù hợp (quá lớn gây vấn đề memory・lock)

---

## Bonus: Sự Khác Biệt Giữa EXISTS và IN

### Hành Vi Của IN

```sql
SELECT * FROM users 
WHERE id IN (1, 2, 3);
```

- Tìm kiếm list bên phải cho mỗi dòng bên trái
- Hiệu quả khi **list bên phải nhỏ và cố định**

### Hành Vi Của EXISTS

```sql
SELECT * FROM users 
WHERE EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.user_id = users.id
);
```

- Kiểm tra có tồn tại ít nhất 1 dòng match không (**có thể kết thúc sớm**)
- Hiệu quả khi **bên phải là subquery lớn**

### Quy Tắc Sử Dụng

| Điều kiện | Khuyến nghị |
|-----------|-------------|
| Bên phải là subquery lớn | **EXISTS** |
| Bên phải là list nhỏ cố định | **IN** |

---

## Xác Nhận Execution Plan Bằng EXPLAIN

### PostgreSQL

```sql
EXPLAIN ANALYZE 
SELECT * FROM users WHERE id = 1;
```

### MySQL

```sql
EXPLAIN 
SELECT * FROM users WHERE id = 1;
```

### Điểm Cần Xác Nhận

- ✅ Xác nhận không có **Seq Scan / Table Scan** (dấu hiệu full scan)
- ✅ Xác nhận có sử dụng **Index Scan / Index Seek**
- ✅ Xác nhận **actual rows và estimated rows** không chênh lệch lớn (có thể thông tin thống kê cũ)

---

## Điểm Thực Hành Trong Môi Trường Production

### 1. Kích Hoạt Slow Query Log

Tự động ghi lại các query chậm trong môi trường production và review định kỳ

### 2. Cập Nhật Thông Tin Thống Kê Định Kỳ

- **PostgreSQL**: `ANALYZE`
- **MySQL**: `ANALYZE TABLE`

### 3. Giám Sát Sự Phình To Của Index

- Xóa các index không cần thiết
- Tối ưu hóa bằng `VACUUM` / `OPTIMIZE TABLE`

---

## Tổng Kết

SQL Anti-pattern **tuy hoạt động được trên bề mặt, nhưng khi scale lên sẽ gây ra vấn đề hiệu suất nghiêm trọng**.

Bằng cách ứng dụng **5 anti-pattern và giải pháp cải thiện** được giới thiệu trong bài viết này vào thực tế, xác minh bằng EXPLAIN, và giám sát trong môi trường production, bạn có thể **cải thiện đáng kể hiệu suất database**.

---

**Nếu bài viết này hữu ích, hãy cho một "like" hoặc comment nhé!** 🎉

*Bài viết này là bài viết ngày thứ 7 của "デジタル創作サークルUniProject Advent Calendar 2025".*
