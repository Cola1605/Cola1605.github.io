---
title: "Tăng tốc thông lượng Amazon S3 với AWS Common Runtime"
date: 2025-10-09
draft: false
categories: ["AWS", "Technology", "Performance"]
tags: ["AWS", "S3", "common-runtime", "throughput", "performance", "CLI", "boto3", "machine-learning"]
description: "AWS CLI và Boto3 được tích hợp với AWS Common Runtime (CRT) S3 client để tự động tăng tốc truyền dữ liệu với Amazon S3, đặc biệt hiệu quả cho các pipeline machine learning trên EC2 instances."
---

# Tăng tốc thông lượng Amazon S3 với AWS Common Runtime

**Tác giả:** Naomichi Sakakibara  
**Ngày xuất bản:** 8 tháng 10, 2025  
**Tác giả gốc:** James Bornholt, Abhinav Goyal, Jonathan Henson, Andrew Kutsy  
**Ngày xuất bản gốc:** 27 tháng 11, 2023  
**Nguồn:** [AWS Japan Official Blog](https://aws.amazon.com/jp/blogs/news/improving-amazon-s3-throughput-for-the-aws-cli-and-boto3-with-the-aws-common-runtime/)

## Tổng quan

Bài blog này là bản tiếng Nhật của nội dung được viết bởi James Bornholt, Abhinav Goyal, Jonathan Henson, Andrew Kutsy vào ngày 27 tháng 11, 2023. Vui lòng tham khảo [bài viết gốc](https://aws.amazon.com/jp/blogs/storage/improving-amazon-s3-throughput-for-the-aws-cli-and-boto3-with-the-aws-common-runtime/).

Dữ liệu là trung tâm của mọi pipeline machine learning. Để đảm bảo tài nguyên tính toán luôn hoạt động và thực hiện công việc hữu ích ở mọi giai đoạn của vòng đời machine learning - từ việc pre-training các foundation model (FM), fine-tuning FM với dữ liệu cụ thể của doanh nghiệp, đến thực thi các truy vấn suy luận - cần có lưu trữ dữ liệu hiệu suất cao và chi phí thấp. Khách hàng được khuyến nghị sử dụng [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/jp/s3/) để lưu trữ dữ liệu training và model checkpoint. Lý do là tính đàn hồi, hiệu suất mở rộng lên nhiều terabit/giây, và các storage class như S3 Intelligent-Tiering có thể tự động tiết kiệm chi phí lưu trữ khi pattern truy cập thay đổi.

Chúng tôi đã công bố bản cập nhật mới cho [AWS Command Line Interface (AWS CLI)](https://aws.amazon.com/jp/cli/) và [AWS SDK for Python (Boto3)](https://aws.amazon.com/jp/sdk-for-python/) nhằm tự động tăng tốc truyền dữ liệu với Amazon S3 và củng cố thêm nền tảng cho các pipeline machine learning. AWS CLI và Boto3 đã được tích hợp với AWS Common Runtime (CRT) S3 client, được thiết kế và xây dựng đặc biệt để cung cấp truyền dữ liệu thông lượng cao với Amazon S3. Sự tích hợp này hiện đã được kích hoạt mặc định trên các instance type Amazon EC2 [Trn1](https://aws.amazon.com/jp/ec2/instance-types/trn1/), [P4d](https://aws.amazon.com/jp/ec2/instance-types/p4/), [P5](https://aws.amazon.com/jp/ec2/instance-types/p5/), và có thể được kích hoạt opt-in trên các instance type khác.

## AWS Common Runtime là gì

Amazon S3 với REST API đơn giản có thể truy cập từ bất kỳ HTTP client nào đã nhận được đánh giá tích cực từ khách hàng. Tuy nhiên, để đạt được hiệu suất tối ưu với các ứng dụng xử lý khối lượng lớn dữ liệu, cần triển khai các [best practice về hiệu suất](https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html) như song song hóa request, timeout, retry, và backoff. Cách đây vài năm, chúng tôi nhận ra rằng các pattern này đang được tái triển khai trong mỗi AWS SDK, và khách hàng cũng phải triển khai các pattern này trong ứng dụng của riêng họ. Chúng tôi muốn có thể dễ dàng truy cập hiệu suất mở rộng của S3 từ bất kỳ ứng dụng nào mà không cần tái triển khai các design pattern phổ biến này.

Để hiện thực hóa hiệu suất portable này, chúng tôi đã xây dựng [AWS Common Runtime (CRT)](https://docs.aws.amazon.com/sdkref/latest/guide/common-runtime.html). CRT là tập hợp các thư viện mã nguồn mở được viết bằng C, triển khai các chức năng chung để tương tác với AWS service, bao gồm HTTP client hiệu suất cao và thư viện mã hóa. Các thư viện CRT phối hợp với nhau để cung cấp trải nghiệm client nhanh và đáng tin cậy cho AWS service. Trong trường hợp Amazon S3, CRT bao gồm native S3 client triển khai song song hóa request tự động, timeout và retry request, tái sử dụng và quản lý kết nối để tránh quá tải network interface. Ví dụ, khi download một object lớn từ S3, CRT client sẽ tự động download song song nhiều byte range, do đó cải thiện thông lượng và sử dụng hiệu quả network interface.

CRT đã sẵn sàng cho production trong nhiều AWS SDK bao gồm [Java](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/crt-based-s3-client.html) và [C++](https://docs.aws.amazon.com/sdk-for-cpp/v1/developer-guide/examples-s3-crt.html), và trước đây được cung cấp như một tùy chọn thử nghiệm trong AWS CLI. Nó cũng là nền tảng của [Mountpoint for Amazon S3](https://aws.amazon.com/jp/s3/features/mountpoint/), một open source file client. Chúng tôi bắt đầu cung cấp CRT trong AWS CLI và Boto3 cho các instance type EC2 Trn1, P4d, P5. Các instance type này có CPU và network interface lớn, có thể hưởng lợi nhiều nhất từ những design pattern hiệu suất này. Đối với các instance type khác, việc chọn sử dụng CRT trong ứng dụng AWS CLI hoặc Boto3 thường sẽ mang lại cải thiện hiệu suất tự động.

## Cải thiện hiệu suất ML pipeline

Để chứng minh khả năng cải thiện hiệu suất có thể đạt được với AWS Common Runtime, chúng tôi đã thu thập 4 bộ dữ liệu benchmark đại diện cho từng bước của vòng đời ML:

### Bộ dữ liệu Benchmark

1. **Caltech-256**: [Bộ dữ liệu hình ảnh](https://data.caltech.edu/records/nyy15-4j048) chứa 30,607 file hình ảnh nhỏ với kích thước trung bình 40 kB, tổng kích thước bộ dữ liệu là 1.1 GB.

2. **Caltech-256-WebDataset**: Cùng bộ dữ liệu hình ảnh Caltech 256 nhưng được lưu trữ bằng định dạng WebDataset, kết hợp nhiều hình ảnh thành các shard object 100 MB. Bộ dữ liệu được chia shard thường có thể đạt hiệu suất cao hơn khi sử dụng Amazon S3 cho ML training.

3. **C4-en**: Tập con tiếng Anh của bộ dữ liệu C4 dựa trên [Common Crawl corpus](https://commoncrawl.org/), chứa 1,024 file có kích thước 320 MB.

4. **Checkpoint**: File checkpoint PyTorch đơn lẻ có kích thước 7.6 GB, đại diện cho checkpoint được chia shard của các ML model quy mô lớn.

### Kết quả hiệu suất

Chúng tôi đã sử dụng AWS CLI để upload và download từng bộ dữ liệu này từ EC2 instance trn1n.32xlarge. Cả trong trường hợp AWS CRT không được kích hoạt và khi được kích hoạt.

CRT đạt được **cải thiện hiệu suất từ 2 đến 6 lần** trên tất cả các benchmark này mà không cần thêm công việc nào ngoài việc cập nhật lên bản phát hành mới nhất của AWS CLI. Ứng dụng Python sử dụng Boto3 với CRT được kích hoạt cũng thấy cải thiện hiệu suất tương tự.

## Bắt đầu sử dụng CRT trong ứng dụng

### Sử dụng với AWS CLI

Để sử dụng CRT với AWS CLI, trước tiên hãy [cài đặt phiên bản mới nhất của AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). Nếu chưa [cập nhật lên AWS CLI phiên bản 2](https://docs.aws.amazon.com/cli/latest/userguide/cliv2-migration.html) thì đây là cơ hội tuyệt vời. Tích hợp CRT chỉ có sẵn trong phiên bản 2.

Nếu đang chạy trên **EC2 instance Trn1, P4d, hoặc P5** thì chỉ cần như vậy là đã sẵn sàng — CRT sẽ được kích hoạt mặc định khi sử dụng các lệnh CLI như `aws s3 sync`.

Đối với **các instance type khác**, có thể chạy lệnh sau để kích hoạt CRT:

```bash
aws configure set s3.preferred_transfer_client crt
```

### Sử dụng với Boto3

Để sử dụng CRT với Boto3, trước tiên hãy đảm bảo đã cài đặt Boto3 với tính năng crt bổ sung. Ví dụ, khi cài đặt bằng pip, hãy chạy:

```bash
pip install boto3[crt]
```

Trên các instance Trn1, P4d, và P5, khi Boto3 được cài đặt với tính năng crt, CRT sẽ tự động được sử dụng cho các lệnh gọi `upload_file` và `download_file`. Ví dụ, để upload file lên S3 bằng CRT, hãy chạy:

```python
import boto3
s3 = boto3.client('s3')
s3.upload_file('/tmp/hello.txt', 'doc-example-bucket', 'hello.txt')
```

Ngoài ra, có thể truy cập CRT trong Boto3 bằng package s3transfer, nhưng package này vẫn chưa được phát hành công khai và có thể thay đổi trong tương lai.

## Điều chỉnh hiệu suất

CRT tự động tối ưu hóa hiệu suất của ứng dụng sử dụng S3. Cài đặt mặc định cải thiện tốc độ trong nhiều tình huống. Với những cài đặt mặc định này, CRT tự động cấu hình dựa trên thông số kỹ thuật của instance type đang chạy, bao gồm CPU topology, lượng memory, số lượng và bố cục của [Elastic Network Adapter (ENA)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking-ena.html) interface. Dựa trên những chi tiết này, CRT chọn chiến lược song song hóa S3 request (số kết nối song song, kích thước mỗi request, số request per S3 IP address, v.v.).

Trong một số tình huống, có thể muốn ghi đè những cài đặt mặc định này, chẳng hạn như muốn giới hạn lượng network bandwidth được sử dụng bởi CRT transfer. Khi sử dụng CRT với AWS CLI, có thể ghi đè cài đặt mặc định bằng cách thiết lập tham số `target_bandwidth`. Ví dụ, để giới hạn transfer ở 5 gigabit/giây, hãy chạy:

```bash
aws configure set s3.target_bandwidth 5Gb/s
```

## Lưu ý và Opt-out

Bản phát hành CRT cho CLI và Boto3 lần này cải thiện hiệu suất của nhiều ứng dụng ML, nhưng có 3 điểm cần lưu ý.

### Thực thi đa tiến trình

CRT thực hiện truyền dữ liệu thông lượng cao bằng cách thực hiện S3 request song song trên nhiều thread. Điều này lý tưởng cho ứng dụng chỉ sử dụng một S3 client tại một thời điểm, vì những thread này có thể phân tán trên các vCPU của instance. Tuy nhiên, khi sử dụng nhiều tiến trình mà mỗi tiến trình tạo S3 client riêng, những thread này có thể cạnh tranh với nhau và làm giảm hiệu suất S3. Ngoài ra, nhiều client này có thể cạnh tranh network bandwidth, gây tắc nghẽn và giảm hiệu suất.

Tích hợp CRT của AWS CLI và Boto3 tự động phát hiện khi nhiều tiến trình đang tạo CRT-based S3 client và trong trường hợp này sẽ fallback về non-CRT-based S3 client. Fallback này giảm nguy cơ cạnh tranh trên hệ thống bằng cách đảm bảo chỉ có một CRT client tồn tại, nhưng kết quả có thể làm giảm hiệu suất của các client khác. Hạn chế này chỉ ảnh hưởng đến nhiều S3 client. Có thể chia sẻ một S3 client trên nhiều thread trong cùng tiến trình, hoặc chia sẻ cho nhiều S3 transfer trong cùng lần gọi AWS CLI.

Có hai pattern chính khiến ứng dụng tạo S3 client riêng trong nhiều tiến trình. Thứ nhất, khi chạy nhiều lệnh gọi AWS CLI đồng thời, mỗi CLI process sẽ có S3 client riêng. Ví dụ, nếu trước đây đã sử dụng AWS CLI với utility parallel hoặc xargs -P để cải thiện hiệu suất, bạn đang sử dụng nhiều AWS CLI process, mỗi process có S3 client riêng. Với tích hợp CRT mới, chúng tôi khuyến nghị chỉ sử dụng một CLI process và để CLI xử lý song song transfer. Thứ hai, khi sử dụng Boto3 với ML framework như [PyTorch](https://pytorch.org/), sẽ sử dụng nhiều worker process để load dữ liệu (ví dụ, tham số num_workers của [DataLoader](https://docs.pytorch.org/docs/stable/data.html) của PyTorch).

### Truy cập đa vùng và cross-region

Tích hợp CRT của AWS CLI và Boto3 hiện không hỗ trợ tự động phát hiện region của S3 bucket. Có nghĩa là khi ứng dụng truy cập S3 bucket ở region khác với region mà instance đang chạy, cần chỉ định target region thủ công. Để làm điều này, sử dụng tham số `--region` của AWS CLI hoặc thiết lập biến môi trường `AWS_REGION` cho cả AWS CLI và Boto3. Với Boto3, vì region được thiết lập khi tạo client, hạn chế này cũng có nghĩa là một S3 client chỉ có thể truy cập bucket của một region. Nếu cần truy cập bucket của nhiều region, cần tạo nhiều client.

### Cấu hình Transfer

Tích hợp CRT của Boto3 không hỗ trợ [TransferConfig](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/customizations/s3.html#boto3.s3.transfer.TransferConfig) API để cấu hình client cho từng transfer. Thay vào đó, CRT tự động cấu hình client để tối đa hóa network bandwidth và chia sẻ bandwidth đó cho tất cả S3 request chạy đồng thời trong cùng tiến trình.

### Opt-out khỏi CRT

Nếu cần tránh bất kỳ hạn chế nào trong số này, có thể opt-out khỏi CRT. Để vô hiệu hóa tích hợp CRT của AWS CLI, hãy chạy:

```bash
aws configure set s3.preferred_transfer_client classic
```

Tương tự, để vô hiệu hóa tích hợp CRT S3 của Boto3, hãy thiết lập `preferred_transfer_client` của `TransferConfig` thành `classic` khi sử dụng trong boto3 transfer call.

```python
from boto3.s3.transfer import TransferConfig
config = TransferConfig(preferred_transfer_client='classic')
client = boto3.client('s3', region_name='us-west-2')
client.upload_file('/tmp/file', Bucket='doc-example-bucket', Key='test_file', Config=config)
```

## Tóm tắt và cải tiến trong tương lai

Amazon S3 có tính đàn hồi và hiệu suất cao, lý tưởng để lưu trữ dữ liệu ML training và model checkpoint. Với những cải tiến của AWS CLI và Boto3, giờ đây có thể dễ dàng tối ưu hóa hiệu suất hơn khi truy cập S3 trong ML pipeline, giúp hoàn thành công việc nhanh hơn và giảm chi phí.

Trong tương lai, chúng tôi dự định kích hoạt AWS Common Runtime mặc định trên nhiều instance type hơn và công khai các tính năng điều chỉnh chi tiết hơn để có thể tối ưu hóa hiệu suất workload thêm nữa.

[AWS CLI](https://github.com/aws/aws-cli/tree/v2), [Boto3](https://github.com/boto/boto3), [AWS Common Runtime](https://github.com/awslabs/aws-c-s3) đều là các dự án mã nguồn mở, và chúng tôi mong nhận được feedback trên GitHub repository tương ứng của từng dự án.

## Về các tác giả

### James Bornholt
Làm việc về automated reasoning cho Amazon S3.

### Abhinav Goyal
Engineering Manager của team SDK và Tools tại AWS, phụ trách Common Runtime Tools, AWS Rust SDK, AWS C++ SDK. Trước khi gia nhập AWS, ông có hơn 20 năm kinh nghiệm technical leadership trong việc xây dựng hệ thống phân tán quy mô lớn cho các ứng dụng ngân hàng khác nhau. Trong thời gian rảnh rỗi, Abhinav thích đọc sách, chơi bóng bàn và đi bộ đường dài. Ông tốt nghiệp cử nhân tại Indian Institute of Technology Delhi (Ấn Độ).

### Jonathan Henson
Principal Software Engineer tại AWS, chuyên về runtime và architecture của AWS SDK.

### Andrew Kutsy
Product Manager của Amazon S3. Ông gia nhập Amazon năm 2016 và thích nói chuyện với người dùng để tìm hiểu những cách sáng tạo mà họ sử dụng AWS. Ông đam mê cà phê, thích du lịch và hiện đang tìm kiếm chiếc croissant ngon nhất thế giới.

---

**Thẻ:** Amazon Simple Storage Service (Amazon S3), AWS Cloud Storage, AWS Open Source, AWS re:Invent, machine learning