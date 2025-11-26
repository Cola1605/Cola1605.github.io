---
title: "Quản lý tập trung thanh toán và chi phí AWS trên nhiều tổ chức với AWS Billing Transfer mới"
date: 2025-11-25
draft: false
description: "AWS Billing Transfer cho phép quản lý và thanh toán hóa đơn tập trung trên nhiều tổ chức AWS, giúp đơn giản hóa quy trình thanh toán và quản lý chi phí hiệu quả hơn."
tags: ["AWS", "Billing", "Cost Management", "Organizations", "FinOps"]
categories: ["AWS"]
author: "Channy Yun"
---

## Giới thiệu

Ngày 19 tháng 11 năm 2025, AWS công bố tính năng **AWS Billing Transfer** chính thức ra mắt. Đây là tính năng mới cho phép quản lý và thanh toán hóa đơn tập trung trên nhiều tổ chức, bằng cách chuyển trách nhiệm thanh toán cho các quản trị viên thanh toán khác như công ty liên kết hoặc đối tác AWS.

AWS Organizations cho phép quản lý thanh toán tập trung cho môi trường đa tài khoản. Tuy nhiên, khi vận hành trong môi trường nhiều tổ chức, các quản trị viên thanh toán cần truy cập riêng lẻ vào từng tài khoản quản lý của mỗi tổ chức để thu thập hóa đơn và thực hiện thanh toán. Cách tiếp cận phân tán này làm phức tạp không cần thiết việc quản lý chi phí và thanh toán hóa đơn cho các doanh nghiệp hoạt động trên nhiều tổ chức AWS. Tính năng này cũng hữu ích khi các đối tác AWS bán lại sản phẩm và giải pháp của AWS, đồng thời chịu trách nhiệm thanh toán cho AWS về mức tiêu thụ của nhiều khách hàng.

## Tổng quan về Billing Transfer

Với Billing Transfer, các khách hàng hoạt động trong môi trường nhiều tổ chức có thể sử dụng **một tài khoản quản lý duy nhất** để quản lý các khía cạnh thanh toán như thu thập hóa đơn, xử lý thanh toán và phân tích chi phí chi tiết. Điều này giúp hoạt động thanh toán trở nên hiệu quả và có khả năng mở rộng hơn, đồng thời các tài khoản quản lý cá nhân vẫn duy trì quyền tự chủ hoàn toàn về bảo mật và quản trị tài khoản.

Billing Transfer được tích hợp với **AWS Billing Conductor**, cho phép tùy chỉnh chế độ xem dữ liệu chi phí của tài khoản đích thanh toán.

### Tính năng chính

- **Quản lý thanh toán tập trung trên nhiều tổ chức**: Quản lý thanh toán cho nhiều tổ chức từ một tài khoản
- **Xử lý thanh toán hiệu quả**: Thu thập và thanh toán hóa đơn tại một nơi
- **Phân tích chi phí chi tiết**: Sử dụng các công cụ như Cost Explorer, Budgets, Cost Anomaly Detection
- **Duy trì bảo mật và quản trị**: Giữ nguyên quyền tự chủ của từng tài khoản quản lý
- **Cài đặt có thể tùy chỉnh**: Điều chỉnh cài đặt thuế và thanh toán bằng đơn vị hóa đơn

## Bắt đầu sử dụng Billing Transfer

Để thiết lập Billing Transfer, tài khoản quản lý bên ngoài sẽ gửi lời mời Billing Transfer đến tài khoản quản lý được gọi là **tài khoản nguồn thanh toán**. Sau khi được chấp nhận, tài khoản bên ngoài trở thành **tài khoản chuyển thanh toán** và sẽ quản lý cũng như thanh toán hóa đơn tổng hợp của tài khoản nguồn thanh toán kể từ ngày được chỉ định trong lời mời.

### Các bước thiết lập

1. Truy cập **Billing and Cost Management console**, chọn "Preferences and Settings" trong thanh điều hướng bên trái, sau đó chọn "Billing transfer"

2. Từ tài khoản quản lý, chọn **"Send invitation"** để quản lý thanh toán trên nhiều tổ chức

3. Nhập **địa chỉ email hoặc ID tài khoản** của tài khoản nguồn thanh toán mà bạn muốn quản lý

4. Chọn **kỳ thanh toán hàng tháng** để bắt đầu thanh toán và **kế hoạch giá** từ AWS Billing Conductor

5. Chọn "Send invitation", lời mời chuyển thanh toán sẽ xuất hiện trong tab "Outbound billing" của tài khoản nguồn thanh toán

6. Tại tài khoản nguồn thanh toán, chọn **"View details"**, xem xét trang lời mời và chọn **"Accept"**

Sau khi chuyển được chấp nhận, tất cả mức sử dụng từ tài khoản nguồn thanh toán sẽ được tính vào tài khoản chuyển thanh toán sử dụng cài đặt thanh toán và thuế của tài khoản nguồn thanh toán, và hóa đơn sẽ không còn được gửi đến tài khoản nguồn thanh toán. Bất kỳ bên nào (tài khoản nguồn thanh toán hoặc tài khoản chuyển thanh toán) đều có thể rút lại việc chuyển bất cứ lúc nào.

## Xem và quản lý hóa đơn

Sau khi bắt đầu chuyển thanh toán, tài khoản chuyển thanh toán sẽ nhận hóa đơn cho mỗi lần chuyển thanh toán vào cuối tháng. Để xem hóa đơn đã chuyển phản ánh tình trạng sử dụng của tài khoản nguồn thanh toán, hãy chọn tab "Invoices" trên trang "Bills".

Hóa đơn đã chuyển có thể được xác định bằng **ID tài khoản nguồn thanh toán**. Thanh toán hóa đơn của tài khoản nguồn thanh toán cũng có thể được xác nhận trong menu "Payments". Chúng chỉ hiển thị cho tài khoản chuyển thanh toán.

## Quản lý chi phí và báo cáo

Tài khoản chuyển thanh toán có thể sử dụng chế độ xem thanh toán để xem và quản lý chi phí của tài khoản nguồn thanh toán trong tất cả các công cụ quản lý chi phí sau:

- **AWS Cost Explorer**: Trực quan hóa chi phí và mức sử dụng
- **AWS Cost and Usage Reports**: Lấy dữ liệu chi phí chi tiết
- **AWS Budgets**: Thiết lập và theo dõi ngân sách
- **AWS Cost Anomaly Detection**: Phát hiện chi phí bất thường

### Thay đổi quan trọng

Các thay đổi sau được áp dụng cho tài khoản nguồn thanh toán:

- **Dữ liệu chi phí trong quá khứ sẽ không còn khả dụng**, do đó cần tải xuống trước khi chấp nhận
- **Cost and Usage Reports cần được cấu hình lại** sau khi chuyển

## Cài đặt thuế và thanh toán

Hóa đơn được chuyển đến tài khoản chuyển thanh toán luôn sử dụng **cài đặt thuế và thanh toán** của tài khoản đích. Do đó, tất cả hóa đơn phản ánh mức sử dụng của tài khoản nguồn thanh toán và các tài khoản thành viên trong AWS Organizations của nó sẽ ghi thuế (nếu có) được tính toán dựa trên cài đặt thuế do tài khoản chuyển thanh toán xác định.

Tương tự, người bán được ghi nhận và cài đặt thanh toán cũng dựa trên cài đặt do tài khoản chuyển thanh toán xác định. Bạn có thể tùy chỉnh cài đặt thuế và thanh toán bằng cách tạo **đơn vị hóa đơn** có sẵn trong tính năng cài đặt hóa đơn.

## Trường hợp sử dụng

Billing Transfer đặc biệt hữu ích trong các tình huống sau:

1. **Doanh nghiệp có nhiều tổ chức AWS**: Quản lý thanh toán tập trung cho nhiều tổ chức bao gồm công ty liên kết và công ty con
2. **Đối tác AWS**: Bán lại mức sử dụng AWS của nhiều khách hàng và quản lý thanh toán tổng hợp
3. **Giữa các công ty liên kết**: Chuyển trách nhiệm thanh toán hiệu quả và tối ưu hóa quản lý tài chính

## Tính khả dụng và tài liệu

**Billing Transfer** hiện đã khả dụng trên **tất cả các AWS Region thương mại**.

Để biết thêm chi tiết, vui lòng tham khảo các tài nguyên sau:

- [Trang sản phẩm dịch vụ quản lý tài chính đám mây AWS](https://aws.amazon.com/aws-cost-management/aws-billing-transfer/)
- [Tài liệu AWS: Billing Transfer](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/orgs_transfer_billing.html)
- [AWS re:Post về AWS Billing](https://repost.aws/tags/TALH1H5PjFQ7ekKQJNEzXLVQ/aws-billing)

Hãy thử Billing Transfer ngay hôm nay và gửi phản hồi của bạn!

---

**Bài viết gốc**: [New AWS Billing Transfer for centrally managing AWS billing and costs across multiple organizations](https://aws.amazon.com/jp/blogs/aws/new-aws-billing-transfer-for-centrally-managing-aws-billing-and-costs-across-multiple-organizations/)
