---
title: "Hiểu về Phân bổ Tài nguyên và Phân tích Hiệu suất sử dụng AWS DMS Enhanced Monitoring"
date: 2025-10-30
categories: ["AWS", "Data & Analytics", "DevOps & Infrastructure"]
tags: ["AWS-DMS", "Enhanced-Monitoring", "CloudWatch", "Performance-Analysis", "Database-Migration"]
description: "Hướng dẫn sử dụng AWS DMS Enhanced Monitoring Dashboard để phân tích resource allocation và performance. Task view, Replication Instance metrics và troubleshooting."
---

# Hiểu về Phân bổ Tài nguyên và Phân tích Hiệu suất sử dụng AWS DMS Enhanced Monitoring

**Nguồn:** AWS Database Blog (Bản dịch tiếng Nhật)  
**Ngày xuất bản:** 30 tháng 10, 2025  
**Người dịch:** Yoshio Uchiyama  
**Tác giả gốc:** Suchindranath Hegde, Mahesh Kansara, Balaji Baskar  
**Danh mục:** AWS Database Migration Service, Intermediate (200), Technical How-to  
**URL:** https://aws.amazon.com/jp/blogs/news/aws-dms-analyzing-enhanced-monitoring/

---

## Tổng quan

Khi sử dụng AWS Database Migration Service (AWS DMS), bạn có thể gặp phải độ trễ replication, tắc nghẽn task, hoặc các bottleneck về tài nguyên. Do đó, việc xác định nhanh chóng nguyên nhân gốc rễ trở nên quan trọng.

Mặc dù AWS DMS cung cấp các metrics của Amazon CloudWatch, đôi khi bạn cần phải liên kết thông tin qua nhiều task. Không có unified view có thể làm chậm việc giải quyết vấn đề. Đây là lúc **Enhanced Monitoring Dashboard** trở thành một tính năng có giá trị.

Enhanced Monitoring Dashboard là một công cụ monitoring toàn diện giúp visualize các metrics quan trọng của database migration task và replication instance. Nó cung cấp hai **view** chính: Task và Replication Instance, hiển thị các performance metrics, resource utilization, và status information khác nhau thông qua màn hình và widget trực quan.

**Dashboard này có sẵn mà không tốn thêm chi phí.**

Trong bài viết này, chúng tôi sẽ giới thiệu một số use case để giúp bạn hiểu cách sử dụng Enhanced Monitoring Dashboard.

---

## Tổng quan về Enhanced Monitoring Dashboard

Phần này sẽ giải thích về các view khác nhau có sẵn trong Enhanced Monitoring Dashboard.

Trong screenshot sau, bạn có thể thấy số lượng tài nguyên được cấu hình trong AWS Region `us-east-1`, cùng với các phần **CloudWatch Alarms** và **Service Health**.

*(Có screenshot minh họa dashboard với resource count, CloudWatch Alarms, và Service Health)*

Ngoài ra, bạn có thể xem phần Task Status để kiểm tra breakdown của trạng thái task.

*(Có screenshot minh họa Task Status breakdown)*

Hơn nữa, bạn có thể điều tra chi tiết CloudWatch logs bằng cách truy cập log streams như được hiển thị trong screenshot dưới đây.

*(Có screenshot minh họa CloudWatch log streams access)*

Phần tiếp theo sẽ giới thiệu các use case dựa trên tương tác với khách hàng và giải thích cách sử dụng Enhanced Monitoring Dashboard.

---

## Hiểu về Phân tích Phân bổ Tài nguyên

Bạn có thể chạy từng task trên một replication instance riêng biệt, hoặc chạy nhiều AWS DMS task trên một replication instance duy nhất. Hiểu cách các cấu hình và customization khác nhau của task ảnh hưởng đến migration giúp đảm bảo rằng AWS DMS replication được provision phù hợp để xử lý workload. Sử dụng Enhanced Monitoring Dashboard, bạn có thể hiểu memory allocation giữa các AWS DMS task khác nhau và chọn **di chuyển task** sang một replication instance khác để phân tán workload, hoặc modify task để consolidate workload.

Để minh họa điều này, chúng tôi đã khởi chạy một **replication instance** `dms.r6i.large` và **tạo** 3 AWS DMS task với các cấu hình task khác nhau, sử dụng option **"Migrate existing data and replicate ongoing changes" (Lưu ý người dịch: Trong navigation mới gọi là "Migration and replication")**.

Screenshot sau cho thấy task `dmstaskflcdc` tiêu thụ nhiều memory hơn so với hai task còn lại. Dựa trên thông tin này, bạn có thể quyết định di chuyển task `dmstaskflcdc` sang một replication instance riêng biệt, hoặc scale up replication instance cơ bản với giả định rằng bạn sẽ chạy nhiều task hơn trên cùng một instance class.

*(Có screenshot minh họa memory consumption comparison giữa các task, với dmstaskflcdc tiêu thụ nhiều memory nhất)*

---

## Performance Troubleshooting

Khi so sánh CloudWatch metrics, bạn có thể thêm widget để hiểu và troubleshoot các vấn đề trong quá trình migration.

Để minh họa điều này, chúng tôi đã tạo một AWS DMS task từ **Amazon Relational Database Service (Amazon RDS) for SQL Server** đến **Amazon Kinesis** sử dụng option **"Replicate data changes only" (Lưu ý người dịch: Trong navigation mới gọi là "Replication only")**.

Trong khi task đang chạy, chúng tôi đã insert data vào source và thấy message sau trong CloudWatch logs:

```
"2025-04-01T20:45:32 [SORTER ]W: Reading from source is paused temporarily to enhance performance and avoid storage being full on replication instance. Total storage used by swap files exceeded the limit 1048576000 bytes, please consider checking target latency"
```

Cảnh báo này cho thấy target không thể theo kịp tốc độ data ingestion từ source.

Để hiểu rõ hơn về điều này, chúng tôi có thể thêm các widget liên quan đến **task metrics** (`CDCLatencyTarget`, `CDCLatencySource`, `CDCChangesDiskTarget`) để xác nhận rằng các changes đang tích lũy trong underlying storage của AWS DMS replication instance và đang chờ commit.

*(Có screenshot minh họa các task metrics widget: CDCLatencyTarget, CDCLatencySource, và CDCChangesDiskTarget showing changes accumulating)*

Một nguyên nhân có thể là không có đủ shard được provision cho Kinesis Streams. Khi tăng số lượng shard của Kinesis, chúng tôi có thể xác nhận rằng replication đã trở lại gần như real-time.

---

## Performance Benchmarking

Bạn có thể chạy benchmark qua các task khác nhau, so sánh các chỉ số để xem liệu các thay đổi có được phản ánh trong performance hay không. Ví dụ, ví dụ sau đây cho thấy các CloudWatch metrics liên quan đến full load migration khi migrate 60 triệu record từ table của RDS for SQL Server instance sang **Amazon Aurora PostgreSQL-Compatible Edition** cluster.

Chúng tôi đã so sánh hai task: `dmsfullloadtest` với cấu hình mặc định và `dmsfullloadtest-2` với **MaxFullLoadSubTasks** được set thành 16. Điều này cho phép chúng tôi hiểu cài đặt `MaxFullLoadSubTasks` ảnh hưởng như thế nào đến throughput trong quá trình full load.

Screenshot sau cho thấy task `dmsfullloadtest` với cấu hình mặc định đạt được throughput **235,722 rows per second**.

*(Có screenshot minh họa throughput của dmsfullloadtest: 235,722 rows/sec)*

Tuy nhiên, khi tăng số lượng `MaxFullLoadSubTasks` của task `dmsfullloadtest-2` lên 16, throughput đã cải thiện đáng kể lên **515,599 rows/sec**.

*(Có screenshot minh họa throughput của dmsfullloadtest-2: 515,599 rows/sec)*

Bài tập benchmark này cho thấy giá trị của Enhanced Monitoring Dashboard trong việc giúp tối ưu hóa cấu hình AWS DMS để maximize performance trong quá trình migration với full load.

---

## Kết luận

Trong bài viết này, chúng tôi đã giải thích một số use case mà bạn có thể sử dụng Enhanced Monitoring. Sử dụng Enhanced Monitoring, bạn có thể bổ sung cho thiết lập monitoring AWS DMS hiện có, có sự kiểm soát tốt hơn về monitoring, và có được visibility về các metrics quan trọng liên quan đến monitoring của task và replication instance.

Để biết thêm chi tiết, vui lòng tham khảo **Enhanced Monitoring Dashboard** documentation.

---

## Về các tác giả

### Suchindranath Hegde

**Suchindranath** là Senior Data Migration Specialist Solutions Architect tại Amazon Web Services. Ông làm việc với khách hàng để cung cấp guidance và technical assistance về data migration sang AWS sử dụng AWS DMS.

**LinkedIn:** https://www.linkedin.com/in/suchindranath-hegde/

### Mahesh Kansara

**Mahesh** là Database Engineering Manager tại Amazon Web Services. Ông làm việc chặt chẽ với các development team và engineering team để cải thiện migration và replication service. Ngoài ra, ông còn làm việc với khách hàng để cung cấp guidance và technical support về các dự án database và analytics khác nhau, hỗ trợ cải thiện giá trị giải pháp khi sử dụng AWS.

**LinkedIn:** https://www.linkedin.com/in/mahesh-kansara/

### Balaji Baskar

**Balaji** đảm nhiệm vai trò Senior Database Engineer trong AWS DMS team. Trong vai trò này, ông làm việc chặt chẽ với khách hàng để cung cấp expert technical guidance nhằm làm cho việc migrate on-premises workload sang AWS cloud trở nên dễ dàng hơn. Ngoài trách nhiệm với khách hàng, Balaji còn đóng góp đáng kể vào việc cải thiện AWS data migration product, tập trung vào cả quality và feature enhancement.

**LinkedIn:** https://www.linkedin.com/in/balaji-baskar-642944208/

---

## Các điểm chính

1. **Enhanced Monitoring Dashboard không tốn thêm chi phí** - Cung cấp comprehensive visibility qua các task và replication instance
2. **Phân tích memory allocation** - Giúp xác định chiến lược phân bổ task tối ưu (consolidate hoặc distribute)
3. **Performance troubleshooting hiệu quả** - Thêm widget CloudWatch metrics (CDCLatencyTarget, CDCLatencySource, CDCChangesDiskTarget) để troubleshoot
4. **Target capacity bottleneck** - Thiếu shard Kinesis là nguyên nhân phổ biến gây replication lag
5. **MaxFullLoadSubTasks setting quan trọng** - Có thể cải thiện throughput của full load hơn 2 lần (từ 235K lên 515K rows/sec)
6. **Unified view** - Giúp tăng tốc độ xác định root cause và giải quyết vấn đề
7. **Data-driven benchmarking** - Giúp tối ưu hóa cấu hình AWS DMS để đạt performance tối đa
8. **Bổ sung cho monitoring hiện có** - Enhanced Monitoring bổ sung cho thiết lập monitoring hiện tại với kiểm soát và visibility tốt hơn

---

## Tài nguyên liên quan

### Documentation
- Enhanced Monitoring Dashboard: https://docs.aws.amazon.com/dms/latest/userguide/enhanced-monitoring-dashboard.html
- Enhanced Monitoring Dashboard Views: https://docs.aws.amazon.com/dms/latest/userguide/enhanced-monitoring-dashboard.html#enhanced-monitoring-dashboard-views
- Moving AWS DMS Tasks: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.Moving.html
- Replication Instance Types: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Types.html
- Creating AWS DMS Tasks: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.Creating.html
- Task Metrics: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Monitoring.html#CHAP_Monitoring.Metrics.Task
- MaxFullLoadSubTasks Setting: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TaskSettings.FullLoad.html

### Related Services
- Amazon CloudWatch: http://aws.amazon.com/cloudwatch
- AWS Database Migration Service: https://aws.amazon.com/dms/
- Amazon RDS for SQL Server: https://aws.amazon.com/rds/sqlserver/
- Amazon Kinesis: https://aws.amazon.com/kinesis/
- Amazon Aurora PostgreSQL: https://aws.amazon.com/rds/aurora/postgresql-features/

---

**Đối tượng mục tiêu:** Database administrators, DevOps engineers, Cloud architects, Solutions architects  
**Cấp độ:** Intermediate (200) - Giả định có kiến thức cơ bản về AWS DMS và CloudWatch
