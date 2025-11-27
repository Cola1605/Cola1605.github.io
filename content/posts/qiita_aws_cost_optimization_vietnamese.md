---
title: "Phương pháp giảm và tối ưu chi phí AWS cũng như những điểm cần lưu ý trong quản lý chi phí"
date: 2025-11-25
draft: false
categories: ["Cloud", "AWS", "DevOps and Infrastructure"]
tags: ["Cost Optimization", "Cost Management", "FinOps", "AWS Best Practices"]
author: "kiwi-dev"
source: "Qiita"
---

# Phương pháp giảm và tối ưu chi phí AWS cũng như những điểm cần lưu ý trong quản lý chi phí

**Tác giả:** kiwi-dev  
**Ngày xuất bản:** 25 tháng 11, 2025  
**Tags:** AWS, Giảm chi phí, Tối ưu chi phí, Quản lý chi phí  
**Nguồn:** [Qiita](https://qiita.com/kiwi-dev/items/df7e2923e0a723ccc345)

---

## Giới thiệu

Bài viết này ghi lại các phương pháp giảm và tối ưu chi phí AWS mà tôi đã thực hiện, cũng như các vấn đề liên quan đến quản lý chi phí nói chung. Thông tin tại thời điểm viết (tháng 11/2025), vì vậy tùy thuộc vào ngày xem bài viết, có thể có dịch vụ mới hoặc cải tiến chức năng khiến nội dung bài viết không còn phù hợp, xin lưu ý điều này.

---

## Phương pháp điều tra chi phí không cần thiết/dư thừa

Bước đầu tiên của việc giảm chi phí là xác nhận chi phí nào đang phát sinh trong tài khoản AWS mục tiêu. Cần xác định và phân tích xem đó là chi phí đã dự đoán/ước tính trước hay chi phí ngoài kế hoạch, sau đó tiến hành giảm và tối ưu chi phí.

### Xác nhận bằng Cost Explorer

1. Đăng nhập vào AWS Management Console, nhập "Cost" vào ô tìm kiếm ở phía trên bên trái màn hình và chọn [Billing and Cost Management] từ danh sách dịch vụ
2. Chọn [Cost Explorer] từ navigation bên trái
3. Hiển thị Cost Explorer mặc định là chi phí 6 tháng qua theo tháng
4. Để phân tích chi tiết, thu hẹp ngày tháng xuống khoảng 1 tháng và đặt độ chi tiết thành theo ngày
5. Nếu dimension là [None], hãy đổi thành [Service]

Ở phần dưới màn hình sẽ hiển thị phí theo từng dịch vụ theo ngày, xác nhận số tiền hiển thị để trước tiên nắm được chi phí phát sinh ở dịch vụ nào. Vì hiển thị theo ngày nên cũng xác nhận xem có ngày nào chi phí tăng đột biến hay không.

#### Phân tích sâu hơn dịch vụ

Sau khi xác định dịch vụ, tiến hành phân tích sâu hơn. Lọc theo loại sử dụng (usage type) để xác nhận phí phát sinh ở phần nào của dịch vụ.

- **Ví dụ lọc theo loại sử dụng**: APN1-EBS:SnapshotUsage, có thể lọc theo region với định dạng {Region}-{Tên dịch vụ}
- **Lọc theo nhóm loại sử dụng**: EC2: Data Transfer - Inter AZ có thể xác nhận chi phí truyền thông giữa các AZ, phân tích phí phát sinh ở phần nào của phí truyền thông mạng

---

## Về giảm và tối ưu chi phí

Nếu nắm được đại khái dịch vụ nào có chi phí cao bằng quy trình trên, việc giảm và tối ưu chi phí từ dịch vụ có chi phí cao sẽ hiệu quả hơn.

### 1. Tự động dừng EC2, tự động thay đổi kích thước instance

- Sử dụng EventBridge để dừng vào cuối tuần hoặc ban đêm khi không sử dụng
- Sử dụng EventBridge+SSM để giảm kích thước instance của batch server không yêu cầu hiệu năng cao vào ban ngày
- Có thể tự động dừng, thu nhỏ bằng autoscaling

### 2. Tận dụng Spot Instance

- Sử dụng spot instance cho node của EKS cluster trong môi trường stg hoặc dev để giảm chi phí
- Số lượng tối thiểu cần thiết chạy on-demand, node dư thừa sử dụng spot instance
- **Lưu ý**: Không sử dụng spot instance cho môi trường prd vì có rủi ro không thể vận hành

### 3. Áp dụng RI

- EC2 chạy 24/7 không thể dừng, không thể sử dụng spot instance thì sử dụng RI để giảm chi phí
- Chỉ áp dụng cho hệ thống có tiền đề sử dụng ít nhất 1 năm
- **Áp dụng RI một phần cho RDS**: Nếu đã xác định generation và type, có thể mua 25% hoặc 50%, do đó có thể mua RI ở mức kích thước tối thiểu cho instance có khả năng thay đổi kích thước (VD: mua RI r7.large sẽ áp dụng 50% cho r6.xlarge)
- RI hiệu quả nếu muốn đặt trước capacity
- Mở [Reservations]→[Recommendations] trong navigation bên trái của [Billing and Cost Management] sẽ hiển thị số lượng mua khuyến nghị theo instance đang sử dụng

### 4. Áp dụng SP (Savings Plans)

- Áp dụng SP cho ECS và Lambda
- Nếu tài khoản có lựa chọn SP thì cũng có thể áp dụng SP thay vì RI cho EC2
- Cần mua theo cam kết phí hàng giờ, nếu chủ yếu là ECS và Lambda thì cần chú ý xác nhận phí quá khứ để không thấp hơn
- Xác nhận [Savings Plans]→[Recommendations] trong navigation bên trái của [Billing and Cost Management] sẽ hiển thị số tiền cam kết mua khuyến nghị
- Thực thi [Purchase Analyzer] cũng có thể phân tích phí hàng giờ

### 5. Thay đổi loại EBS

#### Thay đổi từ gp2 sang gp3

- Giảm chi phí bằng cách thay đổi loại EBS từ gp2 sang gp3
- EBS được tạo trước khi phát hành gp3 có thể vẫn đang chạy gp2, hãy đổi sang gp3 nếu không yêu cầu giá trị IOPS hoặc throughput
- **So sánh chi phí**: gp3 là USD 0.096/GB, gp2 là USD 0.12/GB

#### Thay đổi sang loại HDD

- Nếu là mục đích lưu trữ log hoặc backup file, hãy đổi sang loại HDD như st1 hoặc sc1
- **Chi phí sc1**: USD 0.018/GB nên giảm khoảng 1/10 so với gp2
- sc1 có IOPS tối đa 250 nhưng throughput là 250MiB nên tốc độ khá nhanh, do đó nếu là disk không đọc ghi thường xuyên thì sc1 cũng đủ
- **Lưu ý**: Không thể sử dụng cho root volume hoặc C drive (boot volume)

### 6. Giải mã EBS snapshot đang copy giữa các region

Mã hóa EBS là trường hợp thường có do yêu cầu bảo mật, nhưng nếu đang copy snapshot sang region khác vì mục đích DR thì cần chú ý. Khi mã hóa EBS, lượng truyền dữ liệu không được nén và trở thành lượng truyền full size của disk. Nếu lượng truyền giữa các region cao, hãy kiểm tra xem có đang replicate snapshot của EBS đã mã hóa hay không.

### 7. Lưu log ở S3 thay vì CloudWatch Logs

- **Lưu trữ log của CloudWatch Logs**: USD 0.76/GB, đắt
- **Trường hợp S3**: USD 0.0047/1,000 requests, rẻ nên ưu tiên lưu trữ S3 nếu yêu cầu về khả năng hiển thị và tìm kiếm không nghiêm ngặt
- Nếu không thể bỏ yêu cầu CloudWatch Logs thì xem xét Infrequent Access (USD 0.38/GB)

### 8. Tự động xóa CloudWatch Logs

- Nếu retention period là [Never expire], có khả năng log được lưu trữ lâu dài
- Mở [CloudWatch]→[Log groups], chọn biểu tượng bánh răng và bật [Bytes stored] để xác nhận dung lượng được lưu trữ
- Nếu phình to, hãy xóa thủ công hoặc rút ngắn retention period để tối ưu hóa

### 9. Chỉ lấy reject của VPC Flow log

- Nếu VPC Flow log phình to do giao tiếp giữa các pod nhiều như EKS, hãy chỉ lấy reject
- Nếu đích lấy là CloudWatch Logs thì đổi sang S3

### 10. Nếu lấy nhiều CloudTrail thì giảm xuống 1 cái

- Nếu cấu hình lấy nhiều trail của CloudTrail, từ trail thứ 2 trở đi sẽ phát sinh phí nên giảm xuống 1 cái
- Nếu có yêu cầu bảo mật cần lấy ở cả tài khoản AWS của mình và tài khoản AWS audit, hãy xem xét quản lý và tổng hợp nhất quán bằng AWS Organizations

### 11. Giảm chi phí đọc CloudWatch metrics

- Nếu [metrics requested using GetMetricDataAPI {Region name}] trong chi tiết hóa đơn tăng cao, có khả năng do dịch vụ observability như Datadog, NewRelic, Splunk ảnh hưởng
- Xác nhận region đang lấy, dịch vụ lấy, tần suất lấy, và điều chỉnh nếu đang lấy dữ liệu metrics dư thừa

### 12. Xóa file không cần thiết ở S3, thay đổi storage class

- Kiểm tra xem có dữ liệu không cần thiết hay không. Mở [Amazon S3]→[Storage Lens] có thể xác nhận dung lượng của từng bucket cùng lúc
- Nếu log không cần lưu trữ lâu dài, hãy cài đặt lifecycle policy để xóa
- Nếu là mục đích lưu trữ backup file, có thể tất cả backup file quá khứ bị giữ lại khi cài đặt versioning, hãy cài đặt versioning phù hợp
- File có tần suất truy cập thấp hãy đổi sang storage class rẻ hơn như Glacier

### 13. Xóa VPC endpoint

- Xóa VPC endpoint và cho phép truy cập qua Nat Gateway
- **Lưu ý**:
  - Xác nhận xem có yêu cầu bảo mật hay không
  - Xác nhận không bị ngắt kết nối khi thay đổi

### 14. Chia sẻ Nat Gateway

- Tạo VPC chung và đặt Nat Gateway chung, kết nối giữa các VPC bằng Transit Gateway, cho nhiều VPC truy cập internet qua Nat Gateway của VPC chung

**Lợi ích**:
- Giảm chi phí Nat Gateway đang tạo ở mỗi VPC
- Dễ quản lý vì truy cập tập trung từ Nat Gateway chung nên từ IP cụ thể
- Cũng có thể cấu trúc kiến trúc tương tự khi muốn kiểm soát traffic tập trung bằng Network Firewall
- Cũng có thể chia sẻ Route53 Resolver

**Cảnh báo**: Nếu lượng truyền thông nhiều, lượng truyền thông của Transit Gateway có thể cao hơn

### 15. Giải phóng EIP

- Hãy giải phóng nếu còn EIP không cần thiết
- Từ tháng 2/2024, EIP đang sử dụng cũng bị tính phí nên hãy không dùng càng nhiều càng tốt, giải phóng EIP không sử dụng

### 16. Giảm phí truyền thông giữa các AZ

Điều ngạc nhiên là phí truyền thông giữa các AZ khá cao. Mất USD 0.01/GB nên nếu là hệ thống có lượng truyền thông nhiều, chi phí sẽ phình to.

**Đối sách**:
- Nếu ghi vào database nhiều như EC2→RDS, hãy căn writer instance vào cùng AZ với EC2
- Nếu đang dùng 3 AZ và không có yêu cầu 3 AZ về tính khả dụng, hãy giảm xuống 2 AZ
- Hệ thống có lượng truyền thông giữa AZ nhiều như EKS, hãy tuning để truyền thông trong cùng AZ bằng istio hoặc AWS Load Balancer Controller

---

## Về quản lý chi phí

Vì không thể dành công sức kiểm tra chi phí phát sinh hàng ngày, hãy cài đặt như sau để phát hiện sớm giá trị bất thường hoặc vượt ngân sách đã chỉ định.

### Cài đặt thông báo chi phí

#### Cost Anomaly Detection

Chọn [Billing and Cost Management]→[Cost Anomaly Detection] và kích hoạt Cost Anomaly Detection, có thể nhận biết khi dịch vụ không thường dùng được sử dụng hoặc chi phí lệch khỏi số tiền trung bình sử dụng trong quá khứ. Có thể cài đặt thông báo theo số tiền định lượng hoặc % biến động nên cần tuning phù hợp.

#### Cài đặt ngân sách

Thực hiện cài đặt ngân sách trong [Billing and Cost Management]→[Budgets], cài đặt alert để thông báo khi đạt 80% chẳng hạn.

Cũng có thể cài đặt alarm bằng thông báo metrics [EstimatedCharges] của CloudWatch để thông báo khi vượt quá phí chỉ định.

### Chuẩn bị cho phân tích chi phí

Khuyến nghị thực hiện các cài đặt sau để phân tích thu chi hoặc phân tích chi phí như hệ thống nào phát sinh bao nhiêu chi phí.

#### Cài đặt cost tag

Hãy cho phép lọc bằng Cost Explorer bằng cách đặt Key là [cost] và Value là [tên app].

#### Phân chia dữ liệu phân bổ chi phí ECS/EKS

Có thể kích hoạt trong [Billing and Cost Management]→[Cost Management Preferences]. Có thể phân tích chi tiết chi phí theo đơn vị container và Pod.

---

## Tổng kết

Khuyến nghị thông báo chi phí trước và quản lý chi phí hàng ngày trước khi nhận ra chi phí không mong muốn phát sinh và không thể ngừng ra mồ hôi lạnh!

**Lưu ý**: Hiển thị trên Cost Explorer mất khoảng 2 ngày sau nên không thể xác nhận tình trạng chi phí real-time, xin lưu ý điều này.
