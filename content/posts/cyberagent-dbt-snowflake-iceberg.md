---
title: "Triển khai Iceberg Materialization với Multi-Catalog sử dụng dbt × Snowflake 🧊"
date: 2025-12-03T10:00:00+09:00
draft: false
categories:
  - Data & Analytics
  - Cloud
  - DevOps & Infrastructure
tags:
  - dbt
  - Snowflake
  - Iceberg
  - AWS Glue
  - S3 Tables
  - Data Engineering
  - Data Pipeline
  - Lake Formation
author: "Ryuto Yoda"
translator: "日平"
description: "Hướng dẫn chi tiết cách xây dựng kiến trúc multi-catalog cho Iceberg materialization với dbt và Snowflake, kết hợp AWS Glue Catalog và Snowflake Horizon Catalog để xử lý dữ liệu tăng trưởng."
---

**Nguồn:** [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/59727/)

---

## Giới thiệu

Bài viết này là ngày thứ 3 của [CyberAgent Developers Advent Calendar 2025](https://adventar.org/calendars/11590) ⛄️

Xin chào, tôi là Ryuto Yoda thuộc team Data Integration, bộ phận Kỹ thuật Dữ liệu Toàn công ty.

Team của chúng tôi đang thu thập dữ liệu tin nhắn nội bộ từ Amazon Kinesis Data Streams qua Amazon Data Firehose và lưu trữ vào AWS S3 Tables dưới định dạng Iceberg. Cơ chế của Iceberg cho phép xử lý các tệp trên S3 như một bảng nhất quán, điều này rất phù hợp khi làm việc với dữ liệu tin nhắn có lưu lượng lớn. Iceberg cung cấp quản lý schema linh hoạt và đảm bảo tính an toàn của dữ liệu thông qua snapshot, mang lại nhiều lợi ích trong vận hành.

Để chuyển đổi dữ liệu đã thu thập theo các tình huống sử dụng nội bộ, chúng tôi cần một cơ chế quản lý ổn định cho các xử lý chuyển đổi. Vì vậy, chúng tôi sử dụng công cụ chuyển đổi dữ liệu dbt và Snowflake làm nền tảng thực thi. Tuy nhiên, khi xử lý Iceberg từ dbt, các tính năng có thể thực hiện sẽ thay đổi tùy thuộc vào catalog nào được sử dụng.

S3 Tables cơ bản sử dụng Glue Catalog, nhưng trong cấu hình tạo bảng Iceberg từ dbt thông qua AWS Glue Catalog, mặc dù có thể định nghĩa bảng nhưng [incremental models](https://docs.getdbt.com/docs/build/incremental-models) cần thiết cho xử lý tăng trưởng hiện tại chưa được hỗ trợ.

> **Từ tài liệu chính thức dbt:**  
> Starting in dbt Core v1.11, dbt-snowflake supports basic table materialization on Iceberg tables registered in a Glue catalog through a catalog-linked database. Note that incremental materializations are not yet supported.

Do đó, xét đến giới hạn này, chúng tôi đã triển khai cấu hình multi-catalog: tham chiếu S3 Tables hiện có qua Glue Catalog, đồng thời sử dụng Snowflake Horizon Catalog để tạo bảng Iceberg cần xử lý tăng trưởng. Bài viết này sẽ giới thiệu tổng quan về cách triển khai.

---

## Bảng Iceberg là gì?

Trước tiên, hãy cùng xem xét sơ lược cách Iceberg quản lý dữ liệu. Iceberg là một định dạng bảng mở được thiết kế để xử lý các tệp được lưu trên object storage như S3 thành một bảng duy nhất, với đặc điểm là có thể vận hành dữ liệu quy mô lớn trong khi duy trì tính toàn vẹn của transaction. Iceberg linh hoạt trong việc thay đổi schema và có tính năng time travel cho phép quay lại snapshot trong quá khứ, rất phù hợp cho các trường hợp cần chuyển đổi cấu trúc dữ liệu trong quá trình vận hành.

Để hiểu cách Iceberg biểu diễn bảng, hãy xem sơ đồ sau:

### Cấu trúc bảng Iceberg

```
Iceberg Catalog (Catalog)
  ↓
Metadata File (Tệp metadata)
  ├─ Schema bảng
  ├─ Thông tin phân vùng
  └─ Thông tin snapshot
  ↓
Manifest List (Danh sách manifest)
  ↓
Manifest Files (Các tệp manifest)
  ├─ Đường dẫn tệp dữ liệu
  ├─ Kích thước tệp, số lượng record
  └─ Thống kê cột (min, max)
  ↓
Data Files (Tệp Parquet)
```

**Iceberg Catalog** ghi lại con trỏ tới trạng thái mới nhất của bảng, bên dưới có **tệp metadata** chứa thông tin về schema bảng, thông tin phân vùng, và snapshot nào đang có hiệu lực.

Dưới tệp metadata là **manifest list**, từ đó dẫn xuống các **manifest file** quản lý tệp dữ liệu nào được bao gồm trong snapshot nào của bảng.

Ở tầng dưới cùng là các **tệp dữ liệu Parquet**, Iceberg không scan trực tiếp các tệp này mà truy vấn hiệu quả chỉ những tệp cần thiết bằng cách theo dõi manifest.

> **Chi tiết:** [Thông số kỹ thuật bảng Iceberg có thể tham khảo tại tài liệu chính thức](https://iceberg.apache.org/spec/#goals)

---

## Tổng quan cấu hình và kiến trúc

Lần này, chúng tôi đã áp dụng cấu hình kết hợp hai loại catalog sau đây.

### Cấu hình Catalog

1. **Dữ liệu gốc (Quản lý bởi AWS Glue)**  
   Kết nối tới Iceberg Catalog của Glue qua REST API, sử dụng bảng hiện có trên S3 như catalog chỉ đọc.

2. **Dữ liệu chuyển đổi (Quản lý bởi Snowflake Horizon)**  
   Catalog dành cho bảng Iceberg mới được tạo bởi dbt, hỗ trợ xử lý tăng trưởng.

Với cấu hình này, chúng ta có thể tận dụng dữ liệu S3 Tables và AWS Glue Catalog hiện có, đồng thời xây dựng data pipeline chuyển đổi dữ liệu với xử lý tăng trưởng bằng dbt trên Snowflake.

> **Tham khảo:** Chi tiết về iceberg materializations được hỗ trợ bởi dbt-snowflake adapter có thể xem tại [tài liệu chính thức dbt](https://docs.getdbt.com/docs/mesh/iceberg/snowflake-iceberg-support#configure-catalog-integration-for-managed-iceberg-tables)

Từ đây, chúng ta sẽ đi qua từng bước để xây dựng cấu hình multi-catalog này.

---

## Bước 1: Chuẩn bị tài nguyên AWS

### S3 Bucket

Chuẩn bị S3 bucket để lưu trữ dữ liệu Iceberg. Tạo đường dẫn chuyên dụng trong bucket hiện có.

```
s3://example-iceberg-bucket/dbt_iceberg/
```

### Tạo IAM Role

**Tên Role:** `SnowflakeIcebergRole` (ví dụ)

#### Permission Policy (Chính sách quyền)

Policy này bao gồm các quyền sau cần thiết cho toàn bộ hệ thống:

- **Đọc S3 Tables:** Truy cập dữ liệu gốc (bảng Iceberg được quản lý bởi AWS Glue)
- **Đọc Glue:** Tham chiếu metadata của Glue catalog
- **Quyền Lake Formation:** Kiểm soát truy cập vào data catalog
- **Đọc/ghi S3:** Lưu trữ dữ liệu bảng Iceberg được tạo bởi dbt

---

## Bước 2: Cấu hình tham chiếu dữ liệu gốc (Quản lý bởi AWS Glue)

Cho phép Snowflake tham chiếu dữ liệu gốc được lưu trong S3 Tables.

### Tạo Catalog Integration

```sql
CREATE OR REPLACE CATALOG INTEGRATION s3tables_iceberg_rest_integration
  CATALOG_SOURCE = ICEBERG_REST
  TABLE_FORMAT = ICEBERG
  CATALOG_NAMESPACE = 'iceberg_s3_tables_namespace'
  REST_CONFIG = (
    CATALOG_URI = 'https://glue.us-west-2.amazonaws.com/iceberg'
    CATALOG_API_TYPE = AWS_GLUE
    WAREHOUSE = '123456789012:s3tablescatalog/example-bucket'
    ACCESS_DELEGATION_MODE = vended_credentials
  )
  REST_AUTHENTICATION = (
    TYPE = SIGV4
    SIGV4_IAM_ROLE = 'arn:aws:iam::123456789012:role/SnowflakeIcebergRole'
    SIGV4_SIGNING_REGION = 'us-west-2'
  )
  ENABLED = TRUE;
```

#### Giải thích các tham số

- `CATALOG_SOURCE = ICEBERG_REST`: Chỉ định kết nối tới catalog qua Iceberg REST API
- `TABLE_FORMAT = ICEBERG`: Sử dụng định dạng bảng Iceberg
- `CATALOG_NAMESPACE`: Namespace trong Glue catalog (tương đương tên database)
- `CATALOG_URI`: Endpoint REST API của AWS Glue Iceberg
- `CATALOG_API_TYPE = AWS_GLUE`: Chỉ rõ sử dụng AWS Glue Data Catalog
- `WAREHOUSE`: Định danh bucket S3 Tables. Định dạng `{AWS Account ID}:s3tablescatalog/{Tên bucket}`
- `ACCESS_DELEGATION_MODE = vended_credentials`: Phương thức Snowflake phát hành thông tin xác thực tạm thời
- `SIGV4_IAM_ROLE`: ARN của IAM role mà Snowflake sẽ AssumeRole
- `SIGV4_SIGNING_REGION`: Region nơi AWS Glue được đặt

### Tạo External Table (Phương thức Catalog Linked Database)

Để tham chiếu bảng Iceberg của AWS Glue từ Snowflake, sử dụng Catalog Integration để tạo [catalog-linked database](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database) và định nghĩa bảng Iceberg trong đó.

```sql
CREATE DATABASE S3TABLES_LINKED_DB
  LINKED_CATALOG = (
    CATALOG = 'S3TABLES_ICEBERG_REST_INTEGRATION'
  );
```

---

## Bước 3: Tạo External Volume cho dữ liệu chuyển đổi (Quản lý bởi Snowflake Horizon)

Thiết lập External Volume để Snowflake có thể truy cập S3 bucket cho bảng Iceberg được tạo bởi dbt.

**External Volume là gì:** Đây là đối tượng Snowflake định nghĩa vị trí lưu trữ bên ngoài cho dữ liệu và metadata của bảng Iceberg. Khác với stage thông thường, nó có cấu trúc quản lý chuyên dụng cho Iceberg, quản lý cả catalog metadata và data file.

### Tạo Storage Integration

Đầu tiên, tạo Storage Integration cho phép Snowflake truy cập AWS S3 một cách an toàn. Đây là "đối tượng cấu hình kết nối" định nghĩa thông tin kết nối S3 và IAM role, là điều kiện tiên quyết để tạo External Volume.

```sql
CREATE OR REPLACE STORAGE INTEGRATION example_s3_integration
  TYPE = EXTERNAL_STAGE
  STORAGE_PROVIDER = 'S3'
  ENABLED = TRUE
  STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/SnowflakeIcebergRole'
  STORAGE_ALLOWED_LOCATIONS = ('s3://example-iceberg-bucket/dbt_iceberg/');
```

#### Giải thích các tham số

- `TYPE = EXTERNAL_STAGE`: Tạo integration kiểu external stage
- `STORAGE_PROVIDER = 'S3'`: Sử dụng AWS S3
- `STORAGE_AWS_ROLE_ARN`: ARN của IAM role mà Snowflake sẽ AssumeRole
- `STORAGE_ALLOWED_LOCATIONS`: Danh sách đường dẫn S3 mà Snowflake có thể truy cập

### Tạo External Volume

```sql
CREATE OR REPLACE EXTERNAL VOLUME example_external_volume
   STORAGE_LOCATIONS =
      (
         (
            NAME = 'example-s3-location'
            STORAGE_PROVIDER = 'S3'
            STORAGE_BASE_URL = 's3://example-iceberg-bucket/dbt_iceberg/'
            STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/SnowflakeIcebergRole'
         )
      );
```

#### Giải thích các tham số

- `NAME`: Tên định danh storage location này
- `STORAGE_PROVIDER = 'S3'`: Sử dụng AWS S3
- `STORAGE_BASE_URL`: Đường dẫn S3 để lưu dữ liệu và metadata của bảng Iceberg
- `STORAGE_AWS_ROLE_ARN`: ARN của IAM role mà Snowflake sẽ AssumeRole

---

## Bước 4: Cấu hình Trust Policy (Chính sách tin cậy)

Thêm ExternalId do Snowflake phát hành vào IAM role `SnowflakeIcebergRole`, cho phép phía Snowflake có thể an toàn AssumeRole.

### Xác nhận ExternalId

Khi tạo Catalog Integration và External Volume, Snowflake sẽ tự động phát hành ExternalId tương ứng. Kiểm tra giá trị bằng các lệnh sau:

```sql
-- Xác nhận ExternalId của Catalog Integration
DESC CATALOG INTEGRATION s3tables_iceberg_rest_integration;

-- Xác nhận ExternalId của External Volume
DESC EXTERNAL VOLUME example_external_volume;
```

Tham chiếu các cột sau trong output:

- `API_AWS_EXTERNAL_ID` (phía Catalog Integration)
- `STORAGE_AWS_EXTERNAL_ID` (phía External Volume)

Các ExternalId này là định danh duy nhất được phía Snowflake sử dụng khi thực hiện AssumeRole, hoạt động như security token để ngăn chặn việc sử dụng trái phép bởi bên thứ ba.

### Cấu hình Trust Policy

Thêm ExternalId đã xác nhận vào Trust Policy của IAM role `SnowflakeIcebergRole` hiện có. Bằng cách chỉ định cả hai giá trị dưới dạng mảng trong `sts:ExternalId`, cả Catalog Integration và External Volume đều có thể sử dụng cùng role.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::111111111111:user/snowflake-user"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "sts:ExternalId": [
                        "SNOWFLAKE_SFCRole=1_xxxxxxxxxxxxx=",
                        "SNOWFLAKE_SFCRole=2_yyyyyyyyyyyyy="
                    ]
                }
            }
        }
    ]
}
```

### Xác nhận cấu hình

Sau khi cập nhật trust policy, xác nhận phía Snowflake có thể kết nối bình thường.

```sql
SHOW EXTERNAL VOLUMES;
DESC EXTERNAL VOLUME example_external_volume;
```

Nếu các lệnh này không báo lỗi, Snowflake đã có thể AssumeRole `SnowflakeIcebergRole` thành công.

---

## Bước 5: Cấu hình dbt project

### Cấp quyền Snowflake

Cấp quyền cần thiết cho Snowflake role mà dbt sử dụng.

```sql
-- Quyền sử dụng External Volume
GRANT USAGE ON EXTERNAL VOLUME example_external_volume TO ROLE DBT_ROLE;
```

### Cấu trúc project

```
dbt_project/
├── dbt_project.yml
├── catalogs.yml         
├── models/
    └── transformed_messages.sql
    └── sources.yml
```

### catalogs.yml (Tạo ở thư mục root của project)

Tạo catalogs.yml trong thư mục root của dbt project (cùng cấp với `dbt_project.yml`).

```yaml
catalogs:
  - name: catalog_horizon
    active_write_integration: snowflake_write_integration
    write_integrations:
      - name: snowflake_write_integration
        external_volume: example_external_volume
        table_format: iceberg
        catalog_type: built_in
        adapter_properties:
          change_tracking: true
```

#### Giải thích các mục cấu hình

- `name`: Định danh tham chiếu trong dbt model. Giá trị chỉ định trong `catalog_name` của model file
- `active_write_integration`: Chỉ định write_integration đang hoạt động
- `external_volume`: Tên External Volume đã tạo trong Snowflake. Bằng cách chỉ định ở đây, các bảng sử dụng catalog này sẽ dùng cùng External Volume
- `table_format`: Cố định là `iceberg`. Điều này tạo bảng định dạng Iceberg
- `catalog_type: built_in`: Chỉ rõ sử dụng Snowflake Horizon (catalog tích hợp). Đối với catalog bên ngoài, chỉ định `iceberg_rest`
- `change_tracking`: Cho phép sử dụng Change Data Capture (CDC) với Snowflake Streams. Có thể theo dõi các thay đổi (INSERT, UPDATE, DELETE) trên bảng Iceberg

### sources.yml

```yaml
version: 2

sources:
  - name: raw_data
    database: S3TABLES_LINKED_DB
    schema: EXAMPLE_SCHEMA
    tables:
      - name: SLACK_MESSAGES_S3TABLES
        description: "Bảng nguồn của dữ liệu tin nhắn"
```

#### Giải thích cấu hình

- `name`: Tên source tham chiếu trong dbt model. Sử dụng như `source('raw_data', 'SLACK_MESSAGES_S3TABLES')`
- `database`, `schema`: Database và schema nơi đặt bảng nguồn
- `tables`: Danh sách bảng nguồn. Bằng cách định nghĩa ở đây, dbt tự động giải quyết phụ thuộc bảng và theo dõi data lineage

---

## Bước 6: Thực thi dbt model

Lần này, chúng ta sẽ tạo model incremental đơn giản để tổng hợp số lượng tin nhắn theo channel hàng ngày như sau:

```sql
{{
  config(
    materialized = 'incremental',
    incremental_strategy = 'insert_overwrite',
    partitions = ['message_date'],
    catalog_name = 'catalog_horizon'
  )
}}

select
  channel,
  date(event_time) as message_date,
  count(*) as message_count,
  status
from {{ source('raw_data', 'SLACK_MESSAGES_S3TABLES') }}
where channel is not null
  {% if is_incremental() %}
    and event_time >= (
      select coalesce(max(message_date), '1900-01-01')::timestamp
      from {{ this }}
    )
  {% endif %}
group by channel, date(event_time), status
```

### Cấu hình hàm config

- `materialized='incremental'`: Materialize model này thành bảng. Các option khác như `view`, `ephemeral`, nhưng Iceberg hỗ trợ `table`, `incremental`, `dynamic_table`
- `incremental_strategy='insert_overwrite'`: Phương thức cập nhật tăng trưởng thay thế hoàn toàn partition chỉ định bằng dữ liệu mới
- `partitions=['message_date']`: Ở đây partition theo message_date để có thể cập nhật theo đơn vị ngày
- `catalog_name='catalog_horizon'`: Chỉ định `name` đã định nghĩa trong catalogs.yml. Với cấu hình này, dbt tự động tạo như bảng Iceberg

Với cấu hình này, dbt tự động thực hiện:

- Sử dụng External Volume (giá trị chỉ định trong catalogs.yml)
- Tạo tự động BASE_LOCATION (định dạng `_dbt/{SCHEMA}/{MODEL_NAME}`)
- Cấu hình CHANGE_TRACKING (giá trị chỉ định trong catalogs.yml)
- Chỉ định `CATALOG = 'SNOWFLAKE'` (sử dụng Snowflake Horizon)

`database`, `schema` có thể bỏ qua, nếu bỏ qua sẽ sử dụng cấu hình mặc định của dbt (thường là target chỉ định trong dbt_project.yml hoặc profiles.yml).

### Thực thi model

Thực thi model đã tạo.

```bash
dbt run --select transformed_messages
```

Nếu thành công, sẽ hiển thị output như sau:

```
1 of 1 START sql table model EXAMPLE_SCHEMA.transformed_messages ............ [RUN]
1 of 1 OK created sql table model EXAMPLE_SCHEMA.transformed_messages ....... [SUCCESS in 0.31s]
```

---

## Xác nhận bảng

Khi xác nhận bảng đã tạo, có thể thấy từ bảng iceberg quản lý bởi Glue catalog đã tạo được bảng iceberg quản lý bởi snowflake catalog.

---

## Cấu trúc dữ liệu trong S3 Bucket

Bảng Iceberg đã tạo được lưu trữ trong S3 bucket với cấu trúc như sau:

```
s3://example-iceberg-bucket/
└── dbt_iceberg/                                    # STORAGE_BASE_URL
    └── _dbt/                                       # Base prefix của dbt
        └── EXAMPLE_SCHEMA/                         # Tên schema
            └── transformed_messages.ABC123/        # Tên bảng + suffix
                ├── metadata/                       # Metadata Iceberg
                │   ├── 00000-a1b2c3d4.metadata.json
                │   ├── snap-1234567890123.avro
                │   ├── 1234567890123.avro
                └── data/                           # Dữ liệu thực (Parquet)
                    ├── 00000-0-abc123-data.parquet
                    ├── 00001-1-def456-data.parquet
                    └── ...
```

### Chi tiết cấu trúc thư mục

#### Base Path

dbt mặc định áp dụng cấu trúc đường dẫn `_dbt/{SCHEMA_NAME}/{TABLE_NAME}`. Có các lý do sau:

- **Phân tách môi trường:** Prefix `_dbt/` phân biệt rõ ràng bảng do dbt quản lý và các bảng khác
- **Tổ chức theo schema:** Thư mục theo tên schema cho phép nhóm logic
- **Đảm bảo tính duy nhất:** Thêm suffix ngẫu nhiên vào tên bảng (ví dụ: `ABC123`) để tránh xung đột khi tạo lại bảng

#### Thư mục metadata/

Lưu trữ các tệp metadata của Iceberg.

- **metadata.json:** Metadata bảng hoàn chỉnh bao gồm schema bảng (tên cột, kiểu dữ liệu), thông tin partition, lịch sử snapshot, thống kê bảng
- **snap-*.avro:** Manifest list của mỗi snapshot. Ghi lại data file nào được bao gồm trong snapshot đó
- **\*.avro:** Manifest trong snapshot. Giữ danh sách các data file thực tế (Parquet v.v.), ghi lại đường dẫn, kích thước, số lượng record, thống kê cột (min, max) của mỗi tệp

#### Thư mục data/

Lưu trữ dữ liệu thực ở định dạng Apache Parquet.

- **Định dạng hướng cột:** Định dạng nén tối ưu cho truy vấn phân tích, cho phép tìm kiếm nhanh khi chỉ đọc các cột cụ thể
- **Quy tắc đặt tên tệp:** Bao gồm ID data file, thông tin partition, định danh duy nhất, được liên kết với metadata Iceberg
- **Quản lý snapshot:** Thông qua metadata Iceberg, quản lý tệp nào được bao gồm trong snapshot hiện tại, tránh scan tệp không cần thiết
- **Hỗ trợ time travel:** Cả dữ liệu đã xóa và tệp phiên bản cũ được giữ trong khoảng thời gian chỉ định bởi `DATA_RETENTION_TIME_IN_DAYS`, cho phép truy vấn về thời điểm trong quá khứ

---

## Các giới hạn khi sử dụng Iceberg Materialization với Horizon Catalog

Cho đến nay, chúng ta đã tập trung giới thiệu cấu hình và hoạt động của Iceberg Materialization, nhưng khi thử tích hợp vào repository và job thường dùng, đã gặp một số lỗi và giới hạn. Sau đây là những trường hợp đặc biệt ấn tượng.

### Giới hạn về Masking Policy

Trong dbt, gói mở rộng [dbt_snow_mask](https://hub.getdbt.com/entechlog/dbt_snow_mask/latest/) được công bố để quản lý security policy của Snowflake (masking policy và row access control) ở cấp độ model. Lần này, chúng tôi đã thử sử dụng gói này để tự động áp dụng masking policy trên dbt model.

Đầu tiên, định nghĩa một policy đơn giản ẩn các dòng private với vai trò không xác định dựa trên cột `status` bằng macro sau:

```sql
{% macro apply_row_access_policy_status_policy(node_database, node_schema, model_name) %}
CREATE ROW ACCESS POLICY IF NOT EXISTS {{ node_database }}.{{ node_schema }}.status_policy 
AS (status string) RETURNS boolean ->
  CASE
    WHEN CURRENT_ROLE() IN ('ACCOUNTADMIN', 'DEVELOPER') THEN true
    WHEN status = 'public' THEN true
    ELSE false
  END;

ALTER TABLE {{ node_database }}.{{ node_schema }}.{{ model_name }}
  ADD ROW ACCESS POLICY {{ node_database }}.{{ node_schema }}.status_policy
  ON (status);
{% endmacro %}
```

Tuy nhiên, khi thực thi macro này trên model có chỉ định Iceberg Materialization (`catalog_name='catalog_horizon'`), phía Snowflake báo lỗi sau:

```
SQL Compilation error: The table TRANSFORMED_MESSAGES is an Iceberg table.
Iceberg tables should use ALTER ICEBERG TABLE commands.
```

Lỗi này là do bảng Iceberg phải sử dụng `ALTER ICEBERG TABLE` thay vì `ALTER TABLE`, vì vậy lệnh `ALTER TABLE ... ADD ROW ACCESS POLICY` do dbt_snow_mask phát hành nội bộ không thể thực thi trên bảng Iceberg.

Do đó, khi cấu hình masking policy hoặc row-level security, có vẻ cần xuất model bằng materialization thông thường (`materialized='table'` hoặc `view`). Thực tế, khi bỏ chỉ định `catalog_name='catalog_horizon'` và thực thi, policy được áp dụng bình thường như bảng thông thường.

### Lỗi phân nhánh catalog khi thực thi job

Ngoài ra, đối với dbt Cloud job, khi cấu hình build job hoặc test job thông thường và có cấu hình `catalog_name='catalog_horizon'`, không thể tìm thấy catalog thực sự sử dụng và job thông thường báo lỗi như sau:

```
Catalog not found.
Received: CATALOG_HORIZON
Expected one of: INFO_SCHEMA, SNOWFLAKE
```

Do đó, model sử dụng Iceberg Materialization và model xử lý bảng thông thường cần được quản lý riêng biệt theo repository hoặc branch.

Như có thể thấy từ kiểm chứng lần này, Iceberg Materialization có nhiều giới hạn hơn materialization thông thường, và có nhiều chức năng không thể sử dụng, vì vậy khi sử dụng cần kiểm tra trước các tài liệu chính thức và release note ở cả phía Snowflake và dbt để xác nhận chức năng nào có thể sử dụng.

---

## Kết luận

Qua nỗ lực lần này, chúng tôi đã có thể thử nghiệm cơ chế xử lý bảng Iceberg trên Snowflake và xác nhận dbt-snowflake adapter có thể sử dụng thực tế đến mức nào. Mặc dù có thể tạo bảng bình thường với Snowflake Horizon, vẫn còn một số chức năng hỗ trợ hạn chế như masking policy và catalog, cảm thấy cần một chút khéo léo khi triển khai. Hiện tại có nhiều chức năng vẫn ở trạng thái trước GA, nên khi tích hợp vào vận hành thực tế, tốt nhất nên tiến hành trong khi xác nhận tình trạng hỗ trợ ở cả Snowflake và dbt.

Mặt khác, Iceberg vẫn là một định dạng hấp dẫn, và các chức năng cơ bản muốn sử dụng cho data modeling như `dbt_utils.surrogate_key` có thể sử dụng bình thường. Hy vọng rằng qua các cập nhật trong tương lai, cấu hình sẽ trở nên dễ xử lý hơn và dễ lựa chọn hơn trong vận hành thực tế.

---

## Tài liệu tham khảo

- [Tài liệu chính thức Snowflake: Tổng quan bảng Iceberg](https://docs.snowflake.com/ja/user-guide/tables-iceberg)
- [Tài liệu chính thức Snowflake: Về Catalog-Linked Database (CLD)](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database)
- [Tài liệu chính thức dbt: Cấu hình tích hợp Snowflake × Iceberg](https://docs.getdbt.com/docs/mesh/iceberg/snowflake-iceberg-support)

---

**Tags:** #Data Engineering #Data Analytics Platform #Lakehouse Architecture #Enterprise Data Technology Division
