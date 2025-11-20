---
title: "So sánh plugin test_decoding và pglogical trong Amazon Aurora PostgreSQL để di chuyển dữ liệu bằng AWS DMS"
date: 2025-11-20
draft: false
categories:
  - "AWS"
  - "Database"
  - "Migration"
tags:
  - "Aurora PostgreSQL"
  - "AWS DMS"
  - "PostgreSQL"
  - "Migration"
  - "Logical Replication"
author: "Viswanatha Shastry Medipalli, Swanand Kshirsagar, Abhilash Sajja"
translator: "日平"
description: "Bài viết so sánh chi tiết giữa plugin test_decoding và pglogical khi sử dụng AWS DMS để di chuyển dữ liệu từ Amazon Aurora PostgreSQL, bao gồm phân tích hiệu suất, theo dõi disk spill và các kịch bản thử nghiệm thực tế."
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/comparison-of-test_decoding-and-pglogical-plugins-in-amazon-aurora-postgresql-for-data-migration-using-aws-dms/)

---

*Bài viết này là bản dịch của "Comparison of test_decoding and pglogical plugins in Amazon Aurora PostgreSQL for data migration using AWS DMS".*

## Điều kiện tiên quyết

Bài viết này nhắm đến các chuyên gia về PostgreSQL và di chuyển cơ sở dữ liệu. Chúng tôi giả định rằng người đọc có các điều kiện tiên quyết sau:

- Kiến thức về AWS DMS
- Hiểu biết về PostgreSQL và sao chép logic (logical replication)
- Kiến thức về các dịch vụ AWS như [Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) và [Amazon Aurora PostgreSQL-Compatible Edition](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraPostgreSQL.html)

## Tổng quan

Trong quá trình thực thi tác vụ di chuyển CDC (tải đầy đủ và CDC, hoặc chỉ CDC), AWS DMS sử dụng khe sao chép logic (logical replication slot) để giữ lại các log WAL cho mục đích sao chép cho đến khi chúng được giải mã. Nó chủ yếu hỗ trợ hai plugin giải mã logic khác nhau:

1. **test_decoding**: Plugin đầu ra được bao gồm trong gói postgresql-contrib.
2. **pglogical**: Tiện ích mở rộng PostgreSQL được phát triển bởi 2nd Quadrant (hiện là EnterpriseDB), dựa trên phương pháp publisher/subscriber.

Một trong những tham số quan trọng ảnh hưởng đến hiệu suất của các hoạt động CDC là tham số PostgreSQL `logical_decoding_work_mem`. Phần đầu tiên của bài viết này sẽ chỉ ra cách điều chỉnh tham số này bằng cách theo dõi disk spill ở cấp độ truy vấn. Disk spill có thể ảnh hưởng đáng kể đến hiệu suất sao chép và hiệu suất tổng thể của công cụ cơ sở dữ liệu.

Phần thứ hai sẽ so sánh chi tiết tác động về hiệu suất giữa các plugin giải mã `test_decoding` và `pglogical`.

## Phần 1: Theo dõi việc ghi tạm thời lên đĩa trong quá trình sao chép logic

Trong các kịch bản liên quan đến các giao dịch chạy lâu (long-running transactions), AWS DMS sẽ chờ đợi cho đến khi giao dịch được commit trước khi xử lý các giao dịch tiếp theo từ khe sao chép. Trong suốt quá trình này, các plugin `test_decoding` và `pglogical` hoạt động tích cực để giải mã tất cả các giao dịch trong Write-Ahead Log (WAL). Khi bộ đệm [logical_decoding_work_mem](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.BestPractices.Tuning-memory-parameters.html) đầy, phần vượt quá sẽ được ghi vào đĩa. Bạn có thể giám sát tác động tích lũy của các lần ghi đĩa này bằng cách sử dụng view `pg_stat_replication_slots`.

Truy vấn sau đây hiển thị chi tiết về các tệp spill như `spill_count` và `spill_bytes`:

```sql
postgres=> select * from pg_stat_replication_slots where slot_name = 'replication_slot';
-[ RECORD 1 ]+-----------------
slot_name     | replication_slot
spill_txns    | 1
spill_count   | 53
spill_bytes   | 3544080818
stream_txns   | 0
stream_count  | 0
stream_bytes  | 0
total_txns    | 1
total_bytes   | 66327798
stats_reset   |
```

Tham số `logical_decoding_work_mem` chỉ định việc phân bổ bộ nhớ cho quá trình giải mã logic và kiểm soát cơ chế giải mã và streaming. Trong quá trình xử lý giải mã logic, các bản ghi WAL được chuyển đổi thành các câu lệnh SQL và gửi đến tác vụ DMS. Điều quan trọng là phải đảm bảo toàn bộ giao dịch nằm gọn trong bộ nhớ được phân bổ bởi `logical_decoding_work_mem`. Việc vượt quá dung lượng bộ nhớ dẫn đến các bản ghi bị spill ra đĩa, điều này cuối cùng làm chậm toàn bộ quá trình, tương tự như tác động của `work_mem` và các tệp tạm thời của giao dịch.

Bằng cách tối ưu hóa và điều chỉnh tham số `logical_decoding_work_mem` để phù hợp với yêu cầu của khối lượng công việc, bạn có thể giảm đáng kể tải do ghi đĩa trong quá trình tải hàng loạt và đạt được quá trình sao chép ổn định và hiệu quả hơn. Hiểu các cơ chế này góp phần tối ưu hóa cấu hình và phân bổ tài nguyên, từ đó cải thiện hiệu suất và khả năng phục hồi của quá trình CDC trong AWS DMS.

Để điều chỉnh tham số `logical_decoding_work_mem` trong các khối lượng công việc chạy lâu, chúng tôi khuyến nghị tham khảo [Hướng dẫn điều chỉnh tham số bộ nhớ Aurora PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.BestPractices.Tuning-memory-parameters.html) trong khi sử dụng hàm [aurora_stat_file()](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.BestPractices.Tuning-memory-parameters.html) để thu thập thông tin về các tệp spill.

Các bước tổng quát để triển khai giải pháp này như sau:

1. Kết nối đến Aurora PostgreSQL nguồn bằng thông tin xác thực cơ sở dữ liệu.
2. Tạo một bảng mới để thu thập thông tin về tệp spill như sau:

```sql
CREATE TABLE spill_file_tracking AS 
SELECT now() AS spill_time,* FROM aurora_stat_file() 
WHERE filename LIKE '%<all_slot_name>%';
```

3. Thu thập tập kết quả từ `aurora_stat_file()`:

```sql
INSERT INTO spill_file_tracking 
SELECT now(),* FROM aurora_stat_file() 
WHERE filename LIKE '%<all_slot_name>%';
```

4. Sử dụng `\watch` để liên tục thu thập thông tin tệp spill dựa trên khoảng thời gian cần thiết. Lệnh sau lặp lại bộ đệm truy vấn hiện tại mỗi 1 giây:

```
\watch 1
```

5. Mở một phiên PostgreSQL khác đến cơ sở dữ liệu và thực thi truy vấn sau để lấy thông tin về việc sử dụng tệp spill:

```sql
SELECT spill_time, 
       split_part(filename, '/', 2) AS slot_name, 
       count(1) AS spills, 
       sum(used_bytes) AS slot_total_bytes, 
       pg_size_pretty(sum(used_bytes)) AS slot_total_size 
FROM spill_file_tracking 
GROUP BY 1,2 
ORDER BY 1;
```

Sau khi xác nhận chi tiết tệp spill, quay lại phiên `\watch 1` và nhấn `Ctrl + C` để dừng giám sát.

Thông tin này cho phép bạn hiểu số lượng và tổng kích thước của disk spill xảy ra trong một slot cụ thể, từ đó bạn có thể tinh chỉnh tham số `logical_decoding_work_mem` để giảm disk spill. Điều này giúp cải thiện quá trình giải mã tại khe sao chép.

## Phần 2: So sánh tác động hiệu suất giữa plugin giải mã test_decoding và pglogical

Trong phần này, chúng ta sẽ xem xét các kịch bản thử nghiệm khác nhau để so sánh ưu và nhược điểm của hai plugin PostgreSQL chủ yếu được sử dụng với AWS DMS.

### Tổng quan giải pháp

Sơ đồ sau đây cho thấy tổng quan kiến trúc của các tài nguyên được tạo để so sánh và thử nghiệm `test_decoding` và `pglogical`:

![Architecture Diagram](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-1.png)

#### Thiết lập

1. [Cung cấp Aurora PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_GettingStartedAurora.CreatingConnecting.AuroraPostgreSQL.html)
2. [Thiết lập AWS DMS với PostgreSQL làm nguồn](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html#CHAP_Source.PostgreSQL.v10)
3. [Thiết lập plugin pglogical cho sao chép logic trong Aurora PostgreSQL bằng AWS DMS](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Appendix.PostgreSQL.CommonDBATasks.pglogical.basic-setup.html)
4. [Tạo khe sao chép bằng plugin đầu ra test_decoding](https://www.postgresql.org/docs/current/logicaldecoding-example.html)

#### Lưu ý:

- Trong so sánh này, chúng tôi sử dụng Aurora PostgreSQL 14.9 trên instance r6g.2xlarge và AWS DMS 3.5.2.
  - Ngoại trừ plugin cho giải mã logic, storage, network và các tham số DB đều giống nhau cho cả hai trường hợp.
- AWS DMS sử dụng plugin `test_decoding` hoặc `pglogical` cho giải mã logic.
  - Nếu plugin `pglogical` có sẵn trong cơ sở dữ liệu PostgreSQL nguồn, DMS sẽ sử dụng `pglogical` để tạo khe sao chép. Nếu không, plugin `test_decoding` sẽ được sử dụng.

Trong các thử nghiệm, chúng tôi sử dụng hai bảng:

- **seat** (ghế ngồi):

```sql
\d seat
Table "dms_sample.seat"
      Column        |         Type          | Collation | Nullable | Default 
--------------------+-----------------------+-----------+----------+---------
 sport_location_id  | double precision      |           | not null | 
 seat_level         | smallint              |           | not null | 
 seat_section       | character varying(15) |           | not null | 
 seat_row           | character varying(10) |           | not null | 
 seat               | character varying(10) |           | not null | 
 seat_type          | character varying(15) |           |          | 
Indexes:
    "seat_sport_location_pk" PRIMARY KEY, btree (sport_location_id)
```

- **ticket_purchase_hist** (lịch sử mua vé):

```sql
\d ticket_purchase_hist
Table "dms_sample.ticket_purchase_hist"
          Column           |              Type              | Collation | Nullable | Default 
---------------------------+--------------------------------+-----------+----------+---------
 sporting_event_ticket_id  | double precision               |           | not null | 
 purchased_by_id           | double precision               |           | not null | 
 transaction_date_time     | timestamp(0) without time zone |           | not null | 
 transferred_from_id       | double precision               |           |          | 
 purchase_price            | numeric(8,2)                   |           | not null | 
Indexes:
    "ticket_purchase_hist_pk" PRIMARY KEY, btree (sporting_event_ticket_id, purchased_by_id, transaction_date_time)
    "tph_purch_by_id" btree (purchased_by_id)
    "tph_trans_from_id" btree (transferred_from_id)
```

**Lưu ý**: Các bảng này được điền dữ liệu và tạo tải DML bằng [pgbench custom scripts](https://access.crunchydata.com/documentation/postgresql10/10.23/pgbench.html) và các hàm PostgreSQL như `random()` và `generate_series()`.

Chúng tôi đã thực hiện hai thử nghiệm với hai plugin giải mã trên các bảng trên:

- **Thử nghiệm 1**: Thực thi giao dịch trên bảng `seat`. Bảng này không được sao chép và không được bao gồm trong tác vụ AWS DMS CDC. Bảng này được gọi là bảng không phải CDC (non-CDC table).
- **Thử nghiệm 2**: Thực thi giao dịch trên bảng `ticket_purchase_hist`. Bảng này được sao chép và là một phần của tác vụ AWS DMS CDC. Bảng này được gọi là bảng CDC.

Đối với mỗi trường hợp thử nghiệm, chúng tôi sẽ quan sát và phân tích hiệu suất của mỗi plugin bằng các metric [Amazon CloudWatch](https://aws.amazon.com/cloudwatch) được chỉ định:

1. **ReplicationSlotDiskUsage**: Metric CloudWatch của [Amazon Relational Database Service (Amazon RDS)](https://aws.amazon.com/rds) cung cấp thông tin về việc sử dụng đĩa bởi khe sao chép trên các instance Amazon RDS và Aurora for PostgreSQL.
2. **TransactionLogsDiskUsage**: Metric CloudWatch của Amazon RDS cung cấp thông tin về việc sử dụng đĩa bởi transaction logs trên các instance Amazon RDS và Aurora.
3. **CDCLatencySource**: Metric CloudWatch của AWS DMS cung cấp thông tin về độ trễ của việc sao chép dữ liệu (CDC) từ cơ sở dữ liệu nguồn đến máy chủ sao chép.
4. **CDCLatencyTarget**: Metric CloudWatch của AWS DMS cung cấp thông tin về độ trễ của việc sao chép dữ liệu (CDC) từ máy chủ sao chép đến cơ sở dữ liệu đích.
5. **CDCThroughputRowsSource**: Metric CloudWatch của tác vụ sao chép AWS DMS cung cấp lượng thay đổi dữ liệu (CDC) được thu thập từ cơ sở dữ liệu nguồn, tính bằng số hàng mỗi giây.
6. **CDCIncomingChanges**: Metric CloudWatch của Amazon RDS cung cấp thông tin về số lượng thay đổi dữ liệu đến (CDC) mà AWS DMS thu thập từ cơ sở dữ liệu nguồn.

### Thử nghiệm 1: Tải vào bảng không phải CDC

Đối với bảng không phải CDC, có hai trường hợp thử nghiệm:

1. Tải vào bảng không phải CDC sử dụng khe sao chép `test_decoding`
2. Tải vào bảng không phải CDC sử dụng khe sao chép `pglogical`

#### Khe sao chép sử dụng test_decoding

Trong Thử nghiệm 1-A, chúng tôi bắt đầu một giao dịch chạy lâu trên bảng `seat` để hiểu tác động đến khe sao chép. Bảng sau đây cho thấy cấu hình được sử dụng cho khe sao chép với `test_decoding`:

**test_decoding: Di chuyển từ database-1 sang database-2**

Hai biểu đồ sau đây hiển thị các metric CloudWatch `ReplicationSlotDiskUsage` và `TransactionLogsDiskUsage` của instance chính trong cụm nguồn:

**Tên metric: ReplicationSlotDiskUsage**

![ReplicationSlotDiskUsage Chart](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-2.png)

Từ biểu đồ trên, chúng ta có thể quan sát thấy khi sử dụng plugin [test_decoding](https://pgpedia.info/t/test_decoding.html), việc sử dụng đĩa của cơ sở dữ liệu phía nguồn tăng lên trong quá trình giao dịch chạy lâu.

**Tên metric: TransactionLogsDiskUsage**

![TransactionLogsDiskUsage Chart](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-3.png)

Dựa trên biểu đồ tiếp theo, chúng ta thấy việc sử dụng đĩa của transaction logs của cơ sở dữ liệu nguồn tăng lên trong quá trình giao dịch chạy lâu.

Các biểu đồ sau đây hiển thị các metric CloudWatch `CDCLatencySource`, `CDCLatencyTarget` và `CDCThroughputRowsSource` của tác vụ AWS DMS (testdecodingOnNonCDCTable):

**Tên metric: CDCLatencySource**

**Tên metric: CDCLatencyTarget**

Từ biểu đồ tiếp theo, chúng ta thấy độ trễ tăng lên cùng với việc tăng sử dụng đĩa của khe sao chép trên đích.

**Tên metric: CDCThroughputRowsSource**

Trong biểu đồ tiếp theo, chúng ta thấy thông lượng là 0 vì giao dịch đang diễn ra trên bảng không phải là đối tượng của CDC.

Các metric CloudWatch của tác vụ AWS DMS xác nhận độ trễ xảy ra do giao dịch chạy lâu đã đề cập trước đó. Nguyên nhân chính của độ trễ là tất cả dữ liệu được giải mã logic đều được gửi đến AWS DMS, nơi nó được lọc dựa trên bộ quy tắc đã định nghĩa. Trong trường hợp này, tải được áp dụng lên bảng không phải CDC. Khi sử dụng plugin [test_decoding](https://pgpedia.info/t/test_decoding.html), bộ lọc bảng CDC không được áp dụng tại khe sao chép mà được áp dụng tại AWS DMS, dẫn đến độ trễ.

#### Khe sao chép sử dụng pglogical

Trong Thử nghiệm 1-B, chúng tôi bắt đầu một giao dịch chạy lâu trên bảng `seat` để hiểu tác động của plugin `pglogical`. Bảng sau đây cho thấy cấu hình được sử dụng cho khe sao chép với `pglogical`:

**pglogical: Di chuyển từ database-3 sang database-4**

Các biểu đồ CloudWatch sau đây hiển thị `ReplicationSlotDiskUsage` và `TransactionLogsDiskUsage` của instance writer trong cụm nguồn:

**Tên metric: ReplicationSlotDiskUsage**

**Tên metric: TransactionLogsDiskUsage**

**Tên metric: CDCLatencySource**

Các biểu đồ sau đây hiển thị các metric `CDCLatencySource`, `CDCLatencyTarget` và `CDCThroughputRowsSource` của tác vụ AWS DMS (pglogicalOnNonCDCTable):

**Tên metric: CDCLatencyTarget**

**Tên metric: CDCThroughputRowsSource**

Đối với cùng một giao dịch chạy lâu khi sử dụng plugin `pglogical` cho sao chép, không có độ trễ nào được quan sát trong các metric của tác vụ AWS DMS. Lý do không có độ trễ là dữ liệu được giải mã logic được lọc cho các bảng không được sao chép (các bảng không phải là một phần của tác vụ CDC) trước khi DMS sử dụng các thay đổi này.

### So sánh test_decoding và pglogical trong Thử nghiệm 1

Biểu đồ sau đây cho thấy so sánh các metric CloudWatch của instance nguồn trong cả hai trường hợp sử dụng:

![Comparison Chart](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-4.png)

Đường màu cam đại diện cho dữ liệu được lấy từ database-1 sử dụng plugin `test_decoding`, và đường màu xanh hiển thị dữ liệu từ database-3 sử dụng plugin `pglogical`. So với đường màu cam gần như phẳng, có một sự giảm mạnh trong đường màu xanh. Hành vi này là do cơ chế lọc mà plugin `pglogical` sử dụng ở cấp độ khe sao chép.

Các giao dịch liên quan đến các bảng không phải là một phần của quá trình CDC được lọc ra, dẫn đến sự giảm mạnh được thấy trong đường màu xanh. Mặt khác, plugin `test_decoding` không lọc các giao dịch dựa trên việc chúng có phải là đối tượng CDC hay không, do đó đường phẳng tiếp tục ngay cả khi các giao dịch đang diễn ra trên các bảng không phải là một phần của quá trình CDC.

#### Quan sát từ Thử nghiệm 1

Sau khi xem xét báo cáo metric so sánh, chúng tôi quan sát thấy khe sao chép PostgreSQL sử dụng plugin `test_decoding` (database-1-instance-1) đang chờ đợi tác vụ DMS tiêu thụ toàn bộ giao dịch sau khi giải mã. Điều tương tự không xảy ra với plugin `pglogical` (database-3-instance-1). Ngoài ra, độ trễ được quan sát trong các metric của tác vụ DMS cho sao chép `test_decoding`, nhưng không có độ trễ như vậy đối với sao chép `pglogical`. Lý do cho cả hai quan sát là khi sử dụng plugin `pglogical`, việc lọc được thực hiện tại khe sao chép cho các bảng không phải CDC. Điều này không xảy ra với plugin `test_decoding`.

Trong quá trình giao dịch chạy lâu, nếu các câu lệnh insert song song bị trễ được thực thi trên các bảng CDC, chúng tôi quan sát thấy sự gia tăng độ trễ trong việc xử lý các câu lệnh insert này bởi `test_decoding`. Điều này là do `test_decoding` không thể lọc các thay đổi tại khe sao chép, nên toàn bộ WAL được giải mã và gửi đến tác vụ AWS DMS để lọc. Để duy trì thứ tự giao dịch, các câu lệnh insert bị trễ được giải mã cùng với giao dịch chạy lâu, nhưng việc lọc chỉ được thực thi và áp dụng sau khi tác vụ AWS DMS đọc các thay đổi từ khe sao chép. Tác vụ DMS đọc các thay đổi này sau khi commit của giao dịch chạy lâu được xác nhận, do đó gây ra độ trễ. Mặt khác, với `pglogical`, việc lọc được thực hiện tại `replication_slot`, do đó hoạt động DML song song trên các bảng CDC được đọc và áp dụng bởi tác vụ AWS DMS. Ngay cả khi giao dịch chạy lâu của bảng không phải CDC đang được giải mã bởi khe sao chép `pglogical`, các hoạt động DML khác trên các bảng CDC không bị cản trở. Lý do chính là giao dịch chạy lâu của bảng không phải CDC hiện đang được giải mã không cần được đọc bởi tác vụ DMS được nhận biết hiện tại tại khe sao chép `pglogical`. Do đó, chỉ thứ tự giao dịch của các bảng CDC được duy trì và các thay đổi được đọc và áp dụng bởi tác vụ DMS.

### Thử nghiệm 2: Tải vào bảng CDC

Trong kịch bản thử nghiệm này, chúng tôi tạo một khe sao chép mới sử dụng plugin `test_decoding` trên database-1 (nguồn), cùng với endpoint AWS DMS mới tương ứng và tác vụ DMS mới. Điều này bao gồm bảng CDC nơi tải được bắt đầu. Chúng tôi cũng tạo một khe sao chép mới sử dụng plugin `pglogical` trên database-3 (nguồn), cùng với endpoint DMS mới tương ứng và tác vụ DMS mới. Điều này bao gồm bảng CDC.

Tương tự như thử nghiệm trước, chúng tôi thử nghiệm hai trường hợp:

1. Tải vào bảng CDC sử dụng khe sao chép `test_decoding`
2. Tải vào bảng CDC sử dụng khe sao chép `pglogical`

#### Khe sao chép sử dụng test_decoding

Trong Thử nghiệm 2-A, chúng tôi bắt đầu một giao dịch chạy lâu trên bảng `ticket_purchase_hist`. Bảng này là đối tượng sao chép (một phần của tác vụ CDC), với mục đích hiểu tác động đến khe sao chép. Bảng sau đây cho thấy cấu hình được sử dụng cho khe sao chép với `test_decoding`:

**test_decoding: Di chuyển từ database-1 sang database-2**

Các biểu đồ sau đây hiển thị các metric CloudWatch `ReplicationSlotDiskUsage` và `TransactionLogsDiskUsage` cho instance writer của cụm nguồn:

**Tên metric: ReplicationSlotDiskUsage**

Như được hiển thị trong biểu đồ sau, khi sử dụng plugin [test_decoding](https://pgpedia.info/t/test_decoding.html), việc sử dụng đĩa của cơ sở dữ liệu nguồn tăng lên trong quá trình giao dịch chạy lâu.

**Tên metric: TransactionLogsDiskUsage**

Như được hiển thị trong biểu đồ sau, việc sử dụng đĩa của transaction logs của cơ sở dữ liệu nguồn tăng lên trong quá trình giao dịch chạy lâu.

Các biểu đồ sau đây hiển thị các metric CloudWatch cho `CDCIncomingChanges`, `CDCLatencySource`, `CDCLatencyTarget` và `CDCThroughputRowsSource` của tác vụ AWS DMS (testdecodingOnCDCTable):

**Tên metric: CDCIncomingChanges**

Như được hiển thị trong biểu đồ sau, vì bảng giao dịch là một phần của CDC, sự gia tăng số lượng thay đổi đến được quan sát cùng với việc tăng sử dụng đĩa tại khe sao chép nguồn.

**Tên metric: CDCLatencySource**

Từ biểu đồ sau, chúng ta thấy độ trễ tăng lên khi việc sử dụng đĩa của khe sao chép nguồn tăng.

**Tên metric: CDCLatencyTarget**

Như được hiển thị trong biểu đồ sau, độ trễ tăng lên khi việc sử dụng đĩa của khe sao chép đích tăng.

**Tên metric: CDCThroughputRowsSource**

Như được hiển thị trong biểu đồ sau, sự gia tăng thông lượng được thấy vì giao dịch đang diễn ra trên bảng đối tượng CDC.

Sau đây là ảnh chụp màn hình từ bảng điều khiển AWS DMS hiển thị thống kê INSERT cho bảng `ticket_purchase_hist`:

![DMS Console Screenshot](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-5.png)

Các metric CloudWatch làm rõ độ trễ của giao dịch chạy lâu liên quan đến tác vụ AWS DMS. Vì chúng tôi đã kết hợp bảng liên quan đến giao dịch vào quá trình CDC, tất cả dữ liệu được giải mã sẽ được gửi đến AWS DMS, bất kể plugin lọc dữ liệu ở cấp độ khe sao chép hay cấp độ AWS DMS. Điều này là do tất cả các giao dịch đang diễn ra trên các bảng đối tượng của quá trình CDC. Kết quả là, độ trễ được dự kiến sẽ được quan sát trong biểu đồ tiếp theo, ngay cả khi sử dụng plugin `pglogical`.

#### Khe sao chép sử dụng pglogical

Trong Thử nghiệm 2-B, chúng tôi nhắm đến việc quan sát độ trễ được tạo ra với cấu hình tương tự sử dụng plugin `pglogical`. Bảng sau đây cho thấy cấu hình được sử dụng cho khe sao chép với `pglogical`:

**Pglogical: Di chuyển từ database-3 sang database-4**

Các biểu đồ sau đây hiển thị các metric CloudWatch cho instance của cụm nguồn:

**Tên metric: ReplicationSlotDiskUsage**

Dựa trên biểu đồ sau, chúng ta có thể xác nhận rằng khi sử dụng plugin `pglogical`, việc sử dụng đĩa của cơ sở dữ liệu nguồn tăng lên trong quá trình giao dịch chạy lâu.

**Tên metric: TransactionLogsDiskUsage**

Dựa trên biểu đồ tiếp theo, chúng ta có thể xác nhận rằng việc sử dụng đĩa của transaction logs của cơ sở dữ liệu nguồn tăng lên trong quá trình giao dịch chạy lâu.

Các biểu đồ sau đây hiển thị các metric CloudWatch cho tác vụ DMS (pglogicalOnCDCTable), bao gồm các metric cho `CDCIncomingChanges`, `CDCLatencySource`, `CDCLatencyTarget` và `CDCThroughputRowsSource`:

**Tên metric: CDCIncomingChanges**

Như được hiển thị trong biểu đồ sau, vì giao dịch đang diễn ra trên bảng đối tượng CDC, sự gia tăng số lượng thay đổi đến được quan sát cùng với việc tăng sử dụng đĩa của khe sao chép nguồn.

**Tên metric: CDCLatencySource**

Như được hiển thị trong biểu đồ sau, vì giao dịch đang diễn ra trên bảng đối tượng CDC, độ trễ tăng lên khi việc sử dụng đĩa của khe sao chép nguồn tăng.

**Tên metric: CDCLatencyTarget**

Như được hiển thị trong biểu đồ sau, vì giao dịch đang diễn ra trên bảng được bao gồm trong CDC, độ trễ tăng lên khi việc sử dụng đĩa của khe sao chép nguồn tăng.

**Tên metric: CDCThroughputRowsSource**

Như được hiển thị trong biểu đồ sau, sự gia tăng thông lượng được quan sát vì giao dịch đang diễn ra trên bảng được giám sát trong CDC.

Ảnh chụp màn hình sau đây hiển thị thống kê INSERT cho bảng `ticket_purchase_hist` từ bảng điều khiển AWS DMS:

![DMS Console Screenshot](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-6.png)

Như mong đợi, các metric CloudWatch cho thấy xu hướng tương tự với plugin [pglogical](https://github.com/2ndQuadrant/pglogical).

### So sánh test_decoding và pglogical trong Thử nghiệm 2

Các biểu đồ metric CloudWatch sau đây hiển thị các mẫu sử dụng tài nguyên cho `ReplicationSlotDiskUsage` và `TranslationLogsDiskUsage` khi sử dụng các plugin `test_decoding` và `pglogical` trong quá trình tác vụ di chuyển dữ liệu. Để ôn lại cấu hình, chúng tôi sử dụng `test_decoding` cho việc di chuyển từ database-1 sang database-2 và `pglogical` cho việc di chuyển từ database-3 sang database-4. Bằng cách phân tích các biểu đồ này, chúng ta có thể so sánh mức tiêu thụ tài nguyên và xác định plugin nào hiệu quả hơn cho các kịch bản di chuyển cụ thể.

Đường màu cam đại diện cho dữ liệu được lấy từ database-1 sử dụng plugin `test_decoding`, và đường màu xanh hiển thị dữ liệu từ database-3 sử dụng plugin `pglogical`. Dựa trên phân tích, các biểu đồ cho `test_decoding` và `pglogical` nên hiển thị các mẫu tương tự. Tuy nhiên, có một sự giảm mạnh trong đường màu xanh. Điều này có thể do có hai bảng trong tác vụ DMS, một bảng là đối tượng CDC và một bảng không phải. Vì `pglogical` lọc dữ liệu ở cấp độ khe sao chép, nên có sự giảm mạnh trong biểu đồ.

#### Quan sát từ Thử nghiệm 2

Trong Thử nghiệm 2, khi chúng tôi bắt đầu tải trên bảng CDC, không có lợi thế đáng kể nào được quan sát khi so sánh `test_decoding` với `pglogical`. Cả hai plugin giải mã đều cho thấy xu hướng tương tự trong các metric CloudWatch khác nhau.

Khi số lượng tác vụ DMS tăng lên, `ReplicationSlotDiskUsage` tăng, dẫn đến disk spill tăng. Điều này là do các giao dịch chạy lâu, có thể dẫn đến các vấn đề về độ trễ.

## Tổng kết

Trong bài viết này, Phần 1 đã giải thích cách thu thập thông tin tệp spill một cách hiệu quả bằng cách sử dụng hàm `aurora_stat_file()` và bảng theo dõi. Điều này giúp điều chỉnh tham số `logical_decoding_work_mem` và cải thiện hiệu suất của quá trình AWS DMS CDC. Trong Phần 2, chúng tôi đã so sánh các plugin `test_decoding` và `pglogical` trong AWS DMS khi sao chép dữ liệu giữa các instance tương thích Amazon Aurora PostgreSQL bằng các khối lượng công việc cụ thể. Dựa trên kết quả xác minh của chúng tôi, mỗi plugin có những lợi thế cụ thể có thể giúp cải thiện hiệu suất AWS DMS CDC trong một số trường hợp sử dụng này.

**[pglogical](https://github.com/2ndQuadrant/pglogical):**

- Nếu AWS DMS gặp phải bottleneck (tác vụ bị dừng, độ trễ cao, v.v.), `pglogical` có lợi thế hơn `test_decoding` bằng cách lọc các bảng không phải CDC tại khe sao chép.
- Vì plugin `pglogical` lọc dữ liệu tại khe sao chép nguồn, nó có thể giảm thông lượng mạng cần thiết một cách hiệu quả hơn, đặc biệt khi cần băng thông mạng cao hơn, chẳng hạn như trong quá trình di chuyển từ on-premises hoặc các public cloud khác.
- Plugin `pglogical` phù hợp với các khối lượng công việc mà không phải tất cả các bảng cần phải là một phần của quá trình CDC, do cách nó lọc các bảng không phải CDC.
- Nếu bottleneck được quan sát tại khe sao chép trong quá trình giải mã, bạn có thể điều chỉnh tham số `logical_decoding_work_mem` để giảm disk spill. Ngoài ra, bạn có thể chia nhỏ các giao dịch chạy lâu để giảm disk spill tại khe sao chép.

**[test_decoding](https://pgpedia.info/t/test_decoding.html):**

- Nếu không cần lọc các bảng trong cơ sở dữ liệu, tức là tất cả các bảng trong cơ sở dữ liệu PostgreSQL nguồn là đối tượng của quá trình CDC, bạn có thể sử dụng `test_decoding`.
- Nếu cần thu thập và chuyển toàn bộ hàng trong các giao dịch update hoặc delete, `test_decoding` được khuyến nghị.
- Nếu hầu hết các bảng được định nghĩa trong cơ sở dữ liệu không có ràng buộc khóa chính, `test_decoding` được khuyến nghị. Điều này là do toàn bộ hàng được di chuyển trong các hoạt động update hoặc delete.

Ngoài việc chọn plugin giải mã logic phù hợp, điều quan trọng là phải tuân theo [các phương pháp hay nhất cho di chuyển](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.html), bao gồm:

1. Chọn kích thước instance phù hợp (instance sao chép AWS DMS, Aurora PostgreSQL)
2. Thiết kế tác vụ di chuyển hiệu quả
3. Chọn các thành phần storage và network phù hợp
4. Thiết lập giám sát với cảnh báo

Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng để lại trong phần bình luận.

### Về các tác giả

**Viswanatha Shastry Medipalli** là Senior Architect trong nhóm AWS ProServe. Ông có kiến thức chuyên môn và kinh nghiệm rộng rãi về di chuyển cơ sở dữ liệu và đã thiết kế và xây dựng nhiều giải pháp cơ sở dữ liệu thành công đáp ứng các yêu cầu kinh doanh phức tạp. Ông có kinh nghiệm xây dựng giải pháp cho báo cáo, ứng dụng business intelligence (BI) và hỗ trợ phát triển bằng cơ sở dữ liệu Oracle, SQL Server và PostgreSQL. Ông cũng có kiến thức phong phú về tự động hóa và điều phối, chuyên về di chuyển đồng nhất và không đồng nhất từ cơ sở dữ liệu on-premises sang Amazon.

**Swanand Kshirsagar** là Architect trong bộ phận Expert Services của AWS Professional Services. Ông chuyên làm việc với khách hàng để thiết kế và triển khai các giải pháp có khả năng mở rộng, mạnh mẽ và tuân thủ bảo mật trên AWS cloud. Chuyên môn chính của ông là điều phối các quá trình di chuyển liền mạch, bao gồm cả di chuyển đồng nhất và không đồng nhất, hỗ trợ di chuyển hiệu quả các cơ sở dữ liệu on-premises sang Amazon RDS và Amazon Aurora PostgreSQL. Swanand đã thực hiện các phiên và tổ chức workshop tại các hội nghị.

**Abhilash Sajja** là Database Consultant trong nhóm Professional Services của AWS. Ông hỗ trợ khách hàng và đối tác di chuyển lên AWS cloud, tập trung vào các chương trình di chuyển và hiện đại hóa cơ sở dữ liệu. Tận dụng kinh nghiệm với nhiều công nghệ cơ sở dữ liệu khác nhau, ông cung cấp hướng dẫn và hỗ trợ kỹ thuật cho khách hàng di chuyển môi trường cơ sở dữ liệu on-premises sang các data store của AWS.

*Bản dịch do Solution Architect Ishimoto đảm nhận. Bài viết gốc tại [đây](https://aws.amazon.com/blogs/database/comparison-of-test_decoding-and-pglogical-plugins-in-am).*

---

**Tags:** [AWS Database Migration Service](https://aws.amazon.com/jp/blogs/news/tag/aws-database-migration-service/), [postgresql](https://aws.amazon.com/jp/blogs/news/tag/postgresql/)

### Các liên kết hữu ích

- [Trung tâm tài nguyên Bắt đầu](https://aws.amazon.com/jp/getting-started?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)
- [Tin tức mới nhất về AWS](https://aws.amazon.com/jp/new?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)
- [Lịch sự kiện AWS](https://aws.amazon.com/jp/events/?sc_ichannel=ha&sc_icampaign=jp-event_awsblogs&sc_icontent=news-resources)
- [builders.flash - Tạp chí web chính thức của AWS](https://aws.amazon.com/jp/builders-flash/?sc_ichannel=ha&sc_icampaign=builders-flash_awsblogsb&sc_icontent=news-resources)
- [Các case study khách hàng tại Nhật Bản](https://aws.amazon.com/jp/solutions/case-studies-jp?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)
