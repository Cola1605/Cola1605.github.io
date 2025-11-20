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
author: "Viswanatha Shastry Medipalli, Swanand Kshirsagar, Abhilash Sajja"
translator: "日平"
description: "Bài viết so sánh chi tiết giữa plugin test_decoding và pglogical khi sử dụng AWS DMS để di chuyển dữ liệu từ Amazon Aurora PostgreSQL, giúp bạn chọn giải pháp phù hợp nhất cho nhu cầu của mình."
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/comparison-of-test_decoding-and-pglogical-plugins-in-amazon-aurora-postgresql-for-data-migration-using-aws-dms/)

---

*Bài viết này là bản dịch của "Comparison of test_decoding and pglogical plugins in Amazon Aurora PostgreSQL for data migration using AWS DMS".*

Các tổ chức thường di chuyển cơ sở dữ liệu sang [Amazon Web Services (AWS)](https://aws.amazon.com/) để tận dụng khả năng mở rộng, độ tin cậy và hiệu quả chi phí của đám mây. [Amazon Aurora PostgreSQL-Compatible Edition](https://aws.amazon.com/rds/aurora/postgresql-features/) là một lựa chọn phổ biến cho việc di chuyển này vì nó cung cấp hiệu suất và tính khả dụng của các cơ sở dữ liệu thương mại cao cấp với sự đơn giản và hiệu quả chi phí của cơ sở dữ liệu mã nguồn mở.

[AWS Database Migration Service (AWS DMS)](https://aws.amazon.com/dms/) là một dịch vụ được quản lý giúp đơn giản hóa quá trình di chuyển cơ sở dữ liệu. Khi sử dụng AWS DMS với PostgreSQL làm nguồn, bạn có hai tùy chọn chính để sao chép logic (logical replication): plugin `test_decoding` mặc định và plugin `pglogical`. Việc chọn plugin phù hợp là rất quan trọng để tối ưu hóa hiệu suất di chuyển và giảm thiểu độ trễ.

Trong bài viết này, chúng tôi sẽ so sánh các plugin `test_decoding` và `pglogical` trong bối cảnh di chuyển dữ liệu Aurora PostgreSQL bằng AWS DMS. Chúng tôi sẽ đi sâu vào kiến trúc, sự khác biệt về hiệu suất và các trường hợp sử dụng tốt nhất cho từng plugin để giúp bạn đưa ra quyết định sáng suốt cho chiến lược di chuyển cơ sở dữ liệu của mình.

## Tổng quan về Sao chép Logic trong PostgreSQL

Sao chép logic trong PostgreSQL là một phương pháp sao chép các đối tượng dữ liệu và các thay đổi của chúng, dựa trên định danh sao chép của chúng (thường là khóa chính). Chúng tôi sử dụng thuật ngữ *sao chép logic* để phân biệt với *sao chép vật lý* (physical replication), sử dụng các khối dữ liệu chính xác và sao chép từng byte.

PostgreSQL sử dụng kiến trúc giải mã logic (logical decoding) để trích xuất các thay đổi đã cam kết từ Write-Ahead Log (WAL) và xử lý chúng theo cách thân thiện với người dùng bằng cách sử dụng plugin đầu ra (output plugin). Plugin đầu ra chịu trách nhiệm định dạng dữ liệu thay đổi thành định dạng cụ thể mà người tiêu dùng (trong trường hợp này là AWS DMS) có thể hiểu được.

### Plugin test_decoding

`test_decoding` là plugin giải mã logic mặc định được cung cấp cùng với PostgreSQL. Nó chuyển đổi các thay đổi WAL thành định dạng văn bản đơn giản. AWS DMS sử dụng plugin này theo mặc định khi kết nối với nguồn PostgreSQL.

**Ưu điểm:**
*   Được tích hợp sẵn trong PostgreSQL, không cần cài đặt thêm.
*   Đơn giản và dễ sử dụng.

**Nhược điểm:**
*   Có thể có hiệu suất thấp hơn so với các plugin chuyên dụng cho khối lượng giao dịch lớn.
*   Không hỗ trợ một số tính năng nâng cao như lọc phía nguồn.

### Plugin pglogical

`pglogical` là một hệ thống sao chép logic được triển khai hoàn toàn dưới dạng tiện ích mở rộng PostgreSQL. Nó cung cấp khả năng sao chép logic linh hoạt và hiệu quả hơn so với các phương pháp truyền thống.

**Ưu điểm:**
*   Hiệu suất cao hơn, đặc biệt là cho các giao dịch lớn.
*   Hỗ trợ sao chép chọn lọc (lọc theo bảng, hàng, cột).
*   Hỗ trợ giải quyết xung đột cơ bản.

**Nhược điểm:**
*   Cần cài đặt và cấu hình thêm trên cơ sở dữ liệu nguồn.

## Kiến trúc Di chuyển với AWS DMS

Khi sử dụng AWS DMS để di chuyển từ Aurora PostgreSQL, kiến trúc thường bao gồm:

1.  **Nguồn (Source):** Cụm Aurora PostgreSQL.
2.  **Tác nhân sao chép (Replication Instance):** Máy chủ AWS DMS thực hiện công việc di chuyển.
3.  **Đích (Target):** Cơ sở dữ liệu đích (ví dụ: Amazon RDS, Amazon Redshift, hoặc một Aurora PostgreSQL khác).

![Architecture Diagram](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-1.png)

AWS DMS kết nối với nguồn PostgreSQL, tạo một khe sao chép (replication slot), và sử dụng plugin đầu ra (`test_decoding` hoặc `pglogical`) để đọc các thay đổi từ WAL.

## So sánh Hiệu suất: test_decoding vs. pglogical

Để so sánh hiệu suất, chúng tôi đã thiết lập một môi trường thử nghiệm với khối lượng công việc giao dịch cao. Chúng tôi đo lường độ trễ sao chép (replication latency) và thông lượng (throughput) cho cả hai plugin.

### Kịch bản Thử nghiệm

*   **Nguồn:** Aurora PostgreSQL db.r5.2xlarge
*   **Đích:** Amazon S3 (để cô lập hiệu suất đọc nguồn)
*   **DMS Instance:** dms.c5.2xlarge
*   **Khối lượng công việc:** Chèn, cập nhật và xóa liên tục trên nhiều bảng.

### Kết quả

**1. Độ trễ (Latency):**

Trong các thử nghiệm của chúng tôi, `pglogical` thể hiện độ trễ thấp hơn đáng kể so với `test_decoding`, đặc biệt là khi xử lý các giao dịch lớn (LOBs) hoặc khối lượng thay đổi cao.

![Latency Comparison Chart](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-2.png)

*Biểu đồ cho thấy độ trễ của pglogical (đường màu xanh) thấp hơn và ổn định hơn so với test_decoding (đường màu cam).*

**2. Thông lượng (Throughput):**

`pglogical` cũng đạt được thông lượng cao hơn, cho phép AWS DMS xử lý nhiều thay đổi hơn mỗi giây. Điều này giúp giảm thời gian cần thiết để đồng bộ hóa dữ liệu trong giai đoạn sao chép liên tục (CDC).

![Throughput Comparison Chart](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-3.png)

### Tại sao pglogical nhanh hơn?

*   **Định dạng nhị phân:** `pglogical` gửi dữ liệu ở định dạng nhị phân hiệu quả hơn, trong khi `test_decoding` sử dụng định dạng văn bản dài dòng hơn.
*   **Xử lý LOB tốt hơn:** `pglogical` xử lý các đối tượng lớn (Large Objects) hiệu quả hơn, giảm chi phí truyền tải.
*   **Giảm thiểu I/O:** Cơ chế đọc WAL của `pglogical` được tối ưu hóa để giảm thiểu tác động I/O lên cơ sở dữ liệu nguồn.

## Cấu hình AWS DMS để sử dụng pglogical

Để sử dụng `pglogical` với AWS DMS, bạn cần thực hiện các bước sau:

1.  **Cài đặt tiện ích mở rộng:** Đảm bảo `pglogical` được cài đặt và tải trong Aurora PostgreSQL.
    ```sql
    CREATE EXTENSION pglogical;
    ```
2.  **Cấu hình Endpoint nguồn DMS:** Trong cài đặt Endpoint của AWS DMS, thêm thuộc tính kết nối bổ sung (Extra Connection Attributes):
    ```
    PluginName=pglogical;
    ```
3.  **Tạo Slot sao chép:** DMS sẽ tự động tạo slot sao chép sử dụng plugin `pglogical`.

![DMS Endpoint Configuration](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a791004203017460/2024/05/23/DBBLOG-3689-4.png)

## Khi nào nên sử dụng cái nào?

| Tính năng / Yêu cầu | test_decoding | pglogical |
| :--- | :--- | :--- |
| **Cài đặt** | Có sẵn mặc định | Cần cài đặt extension |
| **Hiệu suất (Tải thấp/trung bình)** | Tốt | Tốt |
| **Hiệu suất (Tải cao/LOBs)** | Trung bình | **Xuất sắc** |
| **Độ phức tạp cấu hình** | Thấp | Trung bình |
| **Hỗ trợ phiên bản PostgreSQL** | Hầu hết các phiên bản | Các phiên bản được hỗ trợ |

**Khuyến nghị:**

*   Sử dụng **`pglogical`** nếu bạn có khối lượng giao dịch cao, nhiều bảng có LOBs, hoặc yêu cầu độ trễ sao chép thấp nhất có thể. Đây là lựa chọn ưu tiên cho các hệ thống sản xuất quan trọng.
*   Sử dụng **`test_decoding`** cho các môi trường phát triển/kiểm thử, hoặc các khối lượng công việc nhỏ đến trung bình nơi sự đơn giản là ưu tiên và hiệu suất không phải là nút thắt cổ chai.

## Kết luận

Việc lựa chọn plugin giải mã logic phù hợp có thể tác động đáng kể đến hiệu suất di chuyển dữ liệu PostgreSQL của bạn. Trong khi `test_decoding` cung cấp sự đơn giản ngay lập tức, `pglogical` mang lại lợi thế hiệu suất rõ rệt cho các khối lượng công việc đòi hỏi khắt khe trên Amazon Aurora PostgreSQL.

Bằng cách hiểu rõ sự khác biệt và cấu hình AWS DMS để sử dụng `pglogical` khi cần thiết, bạn có thể đảm bảo quá trình di chuyển dữ liệu mượt mà, nhanh chóng và hiệu quả hơn lên đám mây AWS.

---
*Dịch giả: Nhật Bình*
*Bài viết gốc: [AWS Blog](https://aws.amazon.com/jp/blogs/news/comparison-of-test_decoding-and-pglogical-plugins-in-amazon-aurora-postgresql-for-data-migration-using-aws-dms/)*
