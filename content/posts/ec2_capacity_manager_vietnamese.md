---
title: "Giám sát, phân tích và quản lý việc sử dụng capacity từ một giao diện duy nhất với Amazon EC2 Capacity Manager"
date: 2025-10-19
draft: false
categories: ["AWS"]
tags: ["Amazon-EC2", "Capacity-Manager", "CloudWatch", "AWS-Cost-Management", "Resource-Optimization", "EC2-Instances"]
description: "Khám phá Amazon EC2 Capacity Manager - giải pháp tập trung giúp giám sát, phân tích và quản lý capacity của EC2 instances từ một dashboard thống nhất."
---

**Tác giả:** Esra Kayabali  
**Ngày đăng:** 19/10/2025  
**Nguồn:** https://aws.amazon.com/jp/blogs/news/monitor-analyze-and-manage-capacity-usage-from-a-single-interface-with-amazon-ec2-capacity-manager/

**Danh mục:** Amazon CloudWatch, Amazon EC2, AWS Cost and Usage Report

---

Ngày 16 tháng 10, chúng tôi đã công bố **Amazon EC2 Capacity Manager**. Amazon EC2 Capacity Manager là giải pháp tập trung cho phép bạn giám sát, phân tích và quản lý tình trạng sử dụng capacity của tất cả các tài khoản và AWS Regions từ một giao diện duy nhất. Dịch vụ này tổng hợp thông tin capacity với tốc độ cập nhật hàng giờ và cung cấp các cơ hội tối ưu hóa được ưu tiên. Điều này giúp đơn giản hóa quy trình quản lý capacity mà trước đây cần tự động hóa tùy chỉnh hoặc thu thập dữ liệu thủ công từ nhiều dịch vụ AWS.

Các tổ chức sử dụng [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/ec2/) ở quy mô lớn đang vận hành hàng trăm instance types với On-Demand Instances, Spot Instances và Capacity Reservations trên nhiều Availability Zones và accounts. Do sự phức tạp này, khách hàng hiện đang truy cập dữ liệu capacity thông qua nhiều dịch vụ AWS khác nhau như [AWS Management Console](https://aws.amazon.com/console/), [Cost and Usage Report](https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/), [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) và EC2 `describe` APIs. Phương pháp phân tán này có thể tạo ra overhead vận hành vì cần thu thập dữ liệu thủ công, chuyển đổi ngữ cảnh giữa các công cụ và tự động hóa tùy chỉnh để tổng hợp thông tin nhằm thực hiện phân tích tối ưu hóa capacity.

EC2 Capacity Manager loại bỏ sự phức tạp vận hành này bằng cách tích hợp tất cả dữ liệu capacity vào một dashboard thống nhất. Giờ đây bạn có thể xem các metrics capacity cross-account và cross-region của On-Demand Instances, Spot Instances và Capacity Reservations trên tất cả các commercial AWS Regions tại một nơi. Điều này loại bỏ nhu cầu xây dựng công cụ thu thập dữ liệu tùy chỉnh hoặc di chuyển giữa nhiều dịch vụ AWS.

Khả năng hiển thị tổng hợp này giúp phát hiện cơ hội tiết kiệm chi phí bằng cách làm nổi bật các Capacity Reservations chưa được sử dụng đầy đủ, phân tích các pattern sử dụng giữa các instance types và có được insights về các pattern gián đoạn của Spot Instances. Khi có quyền truy cập vào dữ liệu capacity toàn diện tại một nơi, bạn có thể đưa ra quyết định thông minh hơn về việc sizing phù hợp cho infrastructure và tối ưu hóa chi phí EC2.

Hãy cùng tìm hiểu chi tiết về các tính năng của EC2 Capacity Manager.

## Bắt đầu với EC2 Capacity Manager

Trong AWS Management Console, điều hướng đến Amazon EC2 và chọn **"[Capacity Manager]"** trong navigation pane. Kích hoạt EC2 Capacity Manager thông qua service settings. Dịch vụ sẽ tổng hợp dữ liệu lịch sử 14 ngày trong quá trình thiết lập ban đầu.

![EC2 Capacity Manager Setup](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/12/AN2274-0.png)

**[Dashboard]** chính hiển thị tình trạng sử dụng capacity của tất cả các instance types thông qua phần overview toàn diện cung cấp cái nhìn tổng quan về các metrics chính. Các capacity overview cards **"[Reservations]"**, **"[Usage]"** và **"[Spot]"** hiển thị các trend indicators và tỷ lệ thay đổi, cho phép bạn nhanh chóng xác định các pattern capacity. Bạn có thể áp dụng filtering bằng cách sử dụng date filter controls bao gồm lựa chọn date range, thiết lập timezone và cấu hình interval.

Bạn có thể chọn các đơn vị khác nhau để phân tích dữ liệu theo vCPU, instance count hoặc estimated cost, giúp hiểu rõ các pattern tiêu thụ tài nguyên. Estimated cost dựa trên giá On-Demand đã công bố và không bao gồm Savings Plans hoặc các khoản giảm giá khác. Tham chiếu giá này giúp so sánh tác động tương đối của capacity chưa được sử dụng đầy đủ trên các instance types khác nhau. Ví dụ, 100 vCPU giờ p5 reservation chưa sử dụng có tác động chi phí lớn hơn 100 vCPU giờ t3 reservation chưa sử dụng.

Dashboard bao gồm **"[Usage Metrics]"** chi tiết với cả biểu đồ visualization tổng usage và usage over time graph. Phần total usage hiển thị breakdown của reserved usage, unreserved usage và spot usage. Usage over time graph cho phép visualization các trends capacity theo thời gian, giúp xác định usage patterns và các giai đoạn peak demand.

**"[Reserved Capacity Trends]"** trong **"[Reservation Metrics]"** visualization used và unused reserved capacity cho khoảng thời gian đã chọn, hiển thị tỷ lệ phần trăm vCPU giờ reserved còn lại chưa sử dụng so với thời gian được consume actively. Điều này cho phép bạn theo dõi các pattern hiệu quả reservation và xác định các giai đoạn có utilization thấp nhất quán. Visualization này giúp tiết kiệm chi phí bằng cách xác định các reservations có utilization thấp và cho phép quyết định thông tin về việc điều chỉnh capacity.

Phần **"[Unused Capacity]"** liệt kê các Capacity Reservations chưa được sử dụng đầy đủ theo từng kết hợp instance type và Availability Zone, cho phép bạn xem utilization và instance types cụ thể của các Availability Zones khác nhau. Danh sách được ưu tiên này cung cấp cái nhìn trực tiếp về unused capacity cost, giúp xác định tiềm năng tiết kiệm.

![Dashboard Overview](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/16/AN2274-1f.png)

Tab **"[Usage]"** hiển thị lịch sử trends chi tiết và thống kê sử dụng trên tất cả AWS Regions cho Spot Instances, On-Demand Instances, Capacity Reservations, Reserved Instances và Savings Plans. Không bao gồm Dedicated Hosts usage. **"[Dimension Filters]"** cho phép bạn group và filter dữ liệu capacity theo Account ID, Region, Instance Family, Availability Zone và Instance Type để tạo custom views phát hiện usage patterns trên các accounts và AWS Organizations. Điều này cho phép bạn phân tích các configurations cụ thể và so sánh performance giữa các accounts và regions.

Phần **"[Aggregations]"** hiển thị bảng usage toàn diện của EC2 instances và Spot instances. Bạn có thể chọn các đơn vị khác nhau để phân tích dữ liệu theo vCPU, instance count hoặc estimated cost, giúp hiểu các pattern tiêu thụ tài nguyên. Bảng hiển thị breakdown của instance families bao gồm thống kê total usage, reserved usage, unreserved usage hours và spot usage data. Mỗi row bao gồm action **"[Show Breakdown]"** để phân tích chi tiết.

Phần **"[Capacity usage or estimated cost trend]"** visualization usage trends, reserved usage, unreserved usage và spot usage. Bạn có thể filter dữ liệu hiển thị và điều chỉnh measurement units để xem historical patterns. Các công cụ filtering và analysis này giúp xác định usage trends, so sánh costs qua các dimensions khác nhau và đưa ra quyết định thông tin về capacity planning và optimization.

![Usage Tab](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/16/AN2274-2c.png)

Chọn **"[Show Breakdown]"** từ bảng **"[Aggregations]"** hiển thị **"[Usage Breakdown]"** chi tiết dựa trên các dimension filters đã chọn. Breakdown view này hiển thị usage patterns của các instance types riêng lẻ trong family và Availability Zone combination đã chọn, giúp xác định các cơ hội optimization cụ thể.

![Usage Breakdown](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/16/AN2274-3b.png)

Tab **"[Reservations]"** hiển thị Capacity Reservations utilization. Tính năng phân tích tự động tạo ra danh sách ưu tiên các cơ hội optimization. Tương tự như tab **"[Usage]"**, bạn có thể áp dụng dimension filters theo Account ID, Region, Instance Family, Availability Zone và Instance Type cùng với các tùy chọn bổ sung liên quan đến chi tiết reservations. Mỗi tab cho phép drill down để xem dữ liệu của các items trong mỗi row. Đặc biệt đối với reservations, bạn có thể xem các reservations cụ thể và truy cập thông tin chi tiết về On-Demand Capacity Reservations (ODCR) như utilization history, configuration parameters và current status. Nếu ODCR nằm trong cùng account với Capacity Manager, bạn có thể modify các reservation parameters trực tiếp từ interface này, loại bỏ nhu cầu navigate đến phần EC2 console riêng biệt để quản lý reservation.

Phần **"[Statistics]"** hiển thị các overview metrics như total number of reservations, overall utilization, total reserved capacity, volume của used và unused capacity, average scheduled reservations count và number của accounts, instance families và regions có reservations.

Unified view này giúp hiểu reservation distribution và utilization patterns trên toàn bộ infrastructure của bạn. Ví dụ, nếu development accounts luôn hiển thị 30% reservation utilization trong khi production accounts hiển thị trên 95% reservation utilization, điều này chỉ ra cơ hội để redistribute hoặc modify reservations. Tương tự, nếu bạn thấy utilization thấp ở instance families cụ thể trong regions cụ thể, bạn có thể xem xét các điều chỉnh reservation hoặc workload optimization. Những insights này giúp đưa ra quyết định dựa trên dữ liệu về mua, modify hoặc cancel reservations, cho phép align reserved capacity tốt hơn với actual usage patterns.

![Reservations Tab](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/16/AN2274-3c.png)

Tab **"[Spot]"** tập trung vào Spot instances usage và hiển thị runtime cho đến khi Spot instances bị interrupt. Phân tích các Spot instance usage patterns này giúp xác định các cơ hội optimization cho Spot instance workloads. Sử dụng Spot Placement Score recommendations có thể tăng flexibility cho workloads của bạn.

Đối với các tổ chức cần khả năng data export, Capacity Manager bao gồm data export sang [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) buckets để phân tích capacity. Bạn có thể xem và quản lý data exports trong tab **"[Data Export]"**. Điều này cho phép bạn tạo exports mới, monitor delivery status và configure export schedules để phân tích capacity data ngoài AWS Management Console.

Export data cho phép bạn lưu trữ capacity data vượt quá retention period 90 ngày có sẵn trong console và API, mở rộng khả năng analysis. Long-term storage này cho phép long-term trend analysis và historical capacity planning. Bạn cũng có thể integrate exported data với existing analytics workflows, business intelligence tools hoặc custom reporting systems để incorporate EC2 capacity metrics vào broader infrastructure analysis và decision-making processes.

![Data Export](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/14/AN2274-4a.png)

Phần **"[Settings]"** có các setup options cho AWS Organizations integration, enabling centralized capacity management trên multiple accounts. Organization administrators có thể enable enterprise-wide capacity visibility hoặc delegate access đến specific accounts trong khi duy trì appropriate permissions và access controls.

## Có sẵn ngay bây giờ

EC2 Capacity Manager loại bỏ operational overhead từ việc thu thập và phân tích capacity data từ multiple sources. Dịch vụ này cung cấp automated optimization opportunities, centralized multi-account visibility và direct access đến capacity management tools. Bạn có thể cải thiện capacity utilization trên toàn bộ EC2 infrastructure, optimize costs trong khi giảm manual analysis time.

Amazon EC2 Capacity Manager có sẵn **không có thêm chi phí**. Để bắt đầu sử dụng Amazon EC2 Capacity Manager, truy cập [Amazon EC2 Console](https://console.aws.amazon.com/ec2/) hoặc qua service API. Dịch vụ có sẵn trong **tất cả commercial AWS Regions**.

Để biết thêm chi tiết, xem [EC2 Capacity Manager documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-manager.html).

[– Esra](https://www.linkedin.com/in/esrakayabali/)

Bài gốc [tại đây](https://aws.amazon.com/jp/blogs/aws/monitor-analyze-and-manage-capacity-usage-from-a-single-interface-with-amazon-ec2-capacity-manager/).

---

## Tổng kết

Amazon EC2 Capacity Manager là một công cụ mạnh mẽ mới giúp:

✅ **Tập trung hóa** quản lý capacity từ một dashboard duy nhất  
✅ **Tự động hóa** phát hiện cơ hội tối ưu hóa  
✅ **Tiết kiệm chi phí** bằng cách xác định capacity chưa được sử dụng  
✅ **Đơn giản hóa** quy trình quản lý capacity cross-account và cross-region  
✅ **Miễn phí** - không có chi phí bổ sung  

Dịch vụ này đặc biệt hữu ích cho các tổ chức:
- Vận hành EC2 ở quy mô lớn
- Cần theo dõi capacity trên nhiều accounts và regions
- Muốn tối ưu hóa chi phí Capacity Reservations
- Cần insights về Spot instances usage patterns
- Muốn export data để phân tích dài hạn

Hãy bắt đầu sử dụng EC2 Capacity Manager ngay hôm nay để tối ưu hóa capacity management và giảm chi phí!
