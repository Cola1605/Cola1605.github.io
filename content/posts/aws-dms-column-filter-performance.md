---
title: "Cải thiện hiệu suất AWS DMS CDC bằng Column Filter để song song hóa bảng lớn"
date: 2025-12-02T11:00:00+09:00
draft: false
categories: ["Data and Analytics", "DevOps and Infrastructure"]
tags: ["AWS DMS", "Database Migration", "CDC", "Oracle", "PostgreSQL", "Performance Optimization", "Parallel Processing"]
author: "AWS Database Blog"
description: "Hướng dẫn chi tiết cách sử dụng Column Filter của AWS DMS để song song hóa CDC task, giảm latency từ 600s xuống hàng chục giây cho bảng dữ liệu lớn trong quá trình migration từ Oracle sang PostgreSQL."
---

## Tổng quan

Trong các AWS DMS Continuous Data Replication (CDC) task, việc capture incremental change có thể gặp phải latency cao. Bài viết này giới thiệu cách giảm đáng kể latency khi sử dụng AWS DMS CDC trong migration từ Oracle sang PostgreSQL.

Với AWS DMS, bạn có thể sử dụng **transformation rule và Column Filter feature** để phân chia logic table data và tạo nhiều CDC task với parallelize filtering rule.

## Vấn đề cơ bản và Approach

### Thách thức

Trong một database migration task từ Oracle sang PostgreSQL, capture latency cao (khoảng 600 giây) và tốc độ capture change chậm. Nguyên nhân là sự mất cân bằng giữa tốc độ đọc CDC event từ log source và tốc độ ghi change vào target.

### Giải pháp

AWS DMS Column Filter kết hợp với immutable column cung cấp solution cho phép partition và xử lý song song data qua nhiều replication task, giảm latency đáng kể.

**Các thành phần**:
- Nhiều CDC replication task sử dụng transformation rule và Column Filter feature
- Immutable column (column không thay đổi sau khi insert) để partition data
- Modulo operation để chia data logic

## Solution Architecture

**Cấu hình single task thông thường**:
```
Oracle DB → AWS DMS (1 task) → PostgreSQL DB
```

**Cấu hình multi-task song song hóa**:
```
Oracle DB → AWS DMS (Task 1: MOD(ID, 3) = 0)
         ↘  AWS DMS (Task 2: MOD(ID, 3) = 1)  → PostgreSQL DB
         ↘  AWS DMS (Task 3: MOD(ID, 3) = 2)
```

Cấu hình này cho phép CDC event được phân bố đều qua 3 task và xử lý song song để tăng tốc.

## Điều kiện tiên quyết

**Môi trường**:
- Source: Oracle Database 12c trở lên (Oracle RDS, Amazon RDS for Oracle, hoặc Oracle on EC2)
- Target: PostgreSQL Database

**AWS DMS Resource**:
- Replication instance (chọn instance class phù hợp)
- Source endpoint (Oracle)
- Target endpoint (PostgreSQL)

**Yêu cầu cấu hình Oracle**:
- Bật Supplemental logging (bắt buộc để capture change từ source)
- Cấu hình supplemental logging cho immutable column

## Các bước triển khai

### Bước 1: Chọn Immutable Column

**Định nghĩa**: Immutable column là column không được update sau khi row được insert. Thường là primary key hoặc sequence-based identifier.

**Tiêu chí chọn**:
- Không thay đổi giá trị sau khi insert
- Không chứa NULL value
- Kiểu numeric (phù hợp cho modulo operation)

**Ví dụ kiểm tra**:
```sql
-- Kiểm tra ID column có phải immutable column tốt không
SELECT COUNT(*) as mutable_updates 
FROM my_table_history 
WHERE operation_type = 'UPDATE' AND id IS DIFFERENT;
-- Nếu kết quả là zero hoặc rất nhỏ → ứng cử viên tốt cho immutable column
```

### Bước 2: Bật Supplemental Logging

Bật supplemental logging để AWS DMS có thể capture tất cả column value cần thiết (bao gồm immutable column).

**Bật ở database level**:
```sql
ALTER DATABASE ADD SUPPLEMENTAL LOG DATA;
```

**Cấu hình cho immutable column**:
```sql
ALTER TABLE schema_name.table_name 
ADD SUPPLEMENTAL LOG DATA (id) COLUMNS;
```

**Xác nhận cấu hình**:
```sql
-- Kiểm tra database level
SELECT supplemental_log_data_min, supplemental_log_data_pk, 
       supplemental_log_data_ui, supplemental_log_data_fk, 
       supplemental_log_data_all 
FROM v$database;

-- Kiểm tra table level
SELECT log_group_name, table_name, log_group_type, decode(always, 'ALWAYS', 'Yes', 'No') as always
FROM dba_log_groups 
WHERE owner = 'SCHEMA_NAME' AND table_name = 'TABLE_NAME';
```

### Bước 3: Data Partitioning bằng Modulo Operation

Sử dụng modulo operation để chia data logic.

**Công thức modulo operation cơ bản**:
```sql
MOD(column_name, number_of_partitions) = partition_number
```

**Ví dụ chia thành 3 partition**:
- Task 1: `MOD(id, 3) = 0`
- Task 2: `MOD(id, 3) = 1`
- Task 3: `MOD(id, 3) = 2`

### Bước 4: Áp dụng Column Filter trong DMS Task Setting

**JSON cấu hình task setting (Task 1)**:

```json
{
  "rules": [
    {
      "rule-type": "selection",
      "rule-id": "1",
      "rule-name": "include-schema",
      "object-locator": {
        "schema-name": "SCHEMA_NAME",
        "table-name": "%"
      },
      "rule-action": "include"
    },
    {
      "rule-type": "transformation",
      "rule-id": "2",
      "rule-name": "filter-by-mod-0",
      "rule-target": "column",
      "object-locator": {
        "schema-name": "SCHEMA_NAME",
        "table-name": "TABLE_NAME"
      },
      "rule-action": "add-column",
      "value": "MOD(id, 3)",
      "expression": "$0",
      "data-type": {
        "type": "int4"
      },
      "column-filter": {
        "filter-type": "source",
        "column-name": "__dms_filter_0__",
        "filter-conditions": [
          {
            "filter-operator": "eq",
            "value": "0"
          }
        ]
      }
    }
  ]
}
```

**Cấu hình Task 2 và Task 3**:
- Task 2: `"value": "1"` (MOD(id, 3) = 1)
- Task 3: `"value": "2"` (MOD(id, 3) = 2)

### Bước 5: Tạo và Start CDC Task

**Tạo task bằng AWS CLI**:
```bash
aws dms create-replication-task \
  --replication-task-identifier my-cdc-task-1 \
  --source-endpoint-arn arn:aws:dms:region:account:endpoint:source-endpoint \
  --target-endpoint-arn arn:aws:dms:region:account:endpoint:target-endpoint \
  --replication-instance-arn arn:aws:dms:region:account:rep:replication-instance \
  --migration-type cdc \
  --table-mappings file://table-mappings-task1.json \
  --replication-task-settings file://task-settings.json
```

**Start task**:
```bash
aws dms start-replication-task \
  --replication-task-arn arn:aws:dms:region:account:task:task-id \
  --start-replication-task-type start-replication
```

### Bước 6: Thực hiện Performance Test

**Thông số môi trường test**:
- Source: Oracle 19c RDS (db.r5.large)
- Target: PostgreSQL 16 RDS (db.r5.large)
- DMS Instance: dms.c5.xlarge
- Table size: Khoảng 5GB production data

**Workload**:
- Khoảng 100,000 INSERT, UPDATE, DELETE event được generate liên tục
- 600 giây baseline latency

**Lệnh kiểm tra kết quả**:
```bash
# Kiểm tra task status
aws dms describe-replication-tasks \
  --filters Name=replication-task-arn,Values=arn:aws:dms:region:account:task:task-id

# Kiểm tra CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DMS \
  --metric-name CDCLatencySource \
  --dimensions Name=ReplicationTaskIdentifier,Value=my-cdc-task-1 \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 300 \
  --statistics Average
```

### Bước 7: Phân tích Performance

**Các metric chính cần monitor**:

1. **CDCLatencySource**: Latency từ source (tốc độ đọc từ log)
2. **CDCLatencyTarget**: Latency đến target (tốc độ ghi)
3. **FullLoadThroughputRowsSource**: Throughput row từ source
4. **FullLoadThroughputRowsTarget**: Throughput row đến target

**Cải thiện mong đợi**:
- Baseline (single task): 600 giây latency
- 3 task song song hóa: Latency giảm đáng kể (thực tế xuống còn vài chục giây)

### Bước 8: Cleanup và Best Practice

**Xóa resource**:
```bash
# Stop task
aws dms stop-replication-task \
  --replication-task-arn arn:aws:dms:region:account:task:task-id

# Xóa task
aws dms delete-replication-task \
  --replication-task-arn arn:aws:dms:region:account:task:task-id

# Xóa endpoint
aws dms delete-endpoint \
  --endpoint-arn arn:aws:dms:region:account:endpoint:endpoint-id

# Xóa replication instance
aws dms delete-replication-instance \
  --replication-instance-arn arn:aws:dms:region:account:rep:instance-id
```

## Các cân nhắc quan trọng

### Yêu cầu về Immutable Column

- **NULL value**: Nếu immutable column có NULL value, modulo operation trả về NULL nên không thể chia đúng
- **Data type constraint**: Nên dùng numeric type column
- **Impact của update**: Nếu immutable column bị update, có thể có task khác nhau xử lý cùng row

### Tối ưu Data Distribution

**Kiểm tra phân bố đều**:
```sql
SELECT MOD(id, 3) as partition, COUNT(*) as row_count 
FROM schema_name.table_name 
GROUP BY MOD(id, 3);
```

Lý tưởng là row_count của mỗi partition gần bằng nhau.

### Performance Tuning

1. **Quyết định số lượng task**:
   - Quá nhiều task → overhead tăng
   - Khuyến nghị: Bắt đầu với 3-5 task, điều chỉnh dần

2. **Điều chỉnh instance size**:
   - Tăng size của replication instance tương ứng với số parallel task
   - Đảm bảo mỗi task có đủ CPU và memory

3. **Network bandwidth**:
   - Cân nhắc tăng network traffic do nhiều task
   - Xem xét dùng VPC peering hoặc Direct Connect

### Alternative Approach: Sử dụng Materialized View

Nếu data chưa được partition sẵn, có thể dùng Materialized View để chia logic data.

**Tạo Materialized View example**:
```sql
CREATE MATERIALIZED VIEW schema_name.table_name_partition_0 AS
SELECT * FROM schema_name.table_name WHERE MOD(id, 3) = 0;

CREATE MATERIALIZED VIEW schema_name.table_name_partition_1 AS
SELECT * FROM schema_name.table_name WHERE MOD(id, 3) = 1;

CREATE MATERIALIZED VIEW schema_name.table_name_partition_2 AS
SELECT * FROM schema_name.table_name WHERE MOD(id, 3) = 2;
```

Tạo CDC task riêng cho từng Materialized View để thực hiện parallel processing.

Tuy nhiên, cần cân nhắc overhead của Materialized View refresh và yêu cầu storage bổ sung.

## Kết luận

Sử dụng AWS DMS Column Filter kết hợp với immutable column cho phép song song hóa CDC replication task và giải quyết hiệu quả vấn đề high latency.

**Các điểm chính**:

1. **Chọn Immutable Column**: Xác định numeric column không bị update
2. **Cấu hình Supplemental Logging**: Bắt buộc bật cho immutable column
3. **Chia bằng Modulo Operation**: Phân bố data đều logic
4. **Parallel Task Execution**: Bắt đầu với 3-5 task, tối ưu dần
5. **Monitor liên tục**: Track latency và throughput bằng CloudWatch metrics

**Hiệu quả mong đợi**:
- Giảm latency đáng kể (từ 600s → vài chục giây)
- Tăng throughput
- Apply change nhanh hơn đến target

**Kịch bản áp dụng**:
- Migration database quy mô lớn
- CDC replication yêu cầu real-time
- Replication trong môi trường high transaction

Approach này không chỉ áp dụng cho migration Oracle sang PostgreSQL mà còn cải thiện CDC performance cho các database engine khác được AWS DMS support.

## Tài nguyên liên quan

Chi tiết thêm:
- [AWS DMS Column Filter Documentation](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TableMapping.SelectionTransformation.Transformations.html)
- [AWS DMS CDC Best Practices](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.html)
- [Oracle Supplemental Logging](https://docs.oracle.com/en/database/oracle/oracle-database/19/sutil/oracle-logminer-utility.html)

---

**Tác giả**: Ganesh Raj (Cloud Infrastructure Architect, AWS Professional Services), Jorge Garcia (Senior Database Consultant, AWS Professional Services)  
**Dịch**: AWS Vietnam Community
