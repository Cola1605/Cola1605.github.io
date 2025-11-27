---
title: "Tăng tốc di chuyển VMware lên AWS với Amazon Elastic VMware Service và VMware HCX"
date: 2025-11-27
draft: false
categories: ["Cloud", "AWS", "DevOps and Infrastructure"]
tags: ["VMware", "HCX", "EVS", "Direct Connect", "VPN", "Cloud Migration"]
author: "James Selwood, Allan Scott"
translator: "Furuya (Solutions Architect)"
---

# Tăng tốc di chuyển VMware lên AWS với Amazon Elastic VMware Service và VMware HCX

**Tác giả:** James Selwood, Allan Scott  
**Người dịch:** Furuya (Solutions Architect)  
**Ngày xuất bản:** 27 tháng 11, 2025  
**Danh mục:** Migration, Amazon Elastic VMware Service, AWS for VMware, Best Practices  
**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/accelerate-your-vmware-migration-to-aws-leveraging-amazon-elastic-vmware-service-and-hcx/)

---

## Giới thiệu

Khi các tổ chức di chuyển khối lượng công việc VMware lên cloud, họ thường đối mặt với nhiều thách thức. Sự phức tạp của việc di chuyển - bao gồm cách duy trì các phụ thuộc ứng dụng và địa chỉ IP, quản lý thời gian ngừng hoạt động và hiệu suất - có thể làm chậm các nỗ lực áp dụng cloud. Thêm vào đó là các yêu cầu về cấu hình lại mạng, kiểm tra ứng dụng, và duy trì tính liên tục kinh doanh trong suốt quá trình di chuyển làm cho các nhiệm vụ mà đội ngũ IT cần giải quyết trở nên phức tạp hơn.

## Tổng quan giải pháp

[Amazon Elastic VMware Service](https://aws.amazon.com/jp/evs/) (EVS) là một giải pháp hấp dẫn cho các tổ chức muốn tận dụng AWS trong khi vẫn sử dụng các tài sản VMware hiện có và chuyên môn của họ. EVS chạy trực tiếp [VMware Cloud Foundation](https://www.vmware.com/products/cloud-infrastructure/vmware-cloud-foundation) (VCF) trong [Amazon VPC](https://aws.amazon.com/jp/vpc/), duy trì trải nghiệm vận hành quen thuộc.

Một trong những lợi ích của EVS là khả năng tích hợp với [VMware HCX](https://www.vmware.com/products/cloud-infrastructure/hcx), một bộ công cụ di chuyển mạnh mẽ do VMware by Broadcom cung cấp. HCX cho phép di chuyển khối lượng công việc một cách liền mạch giữa môi trường on-premises và cloud trong khi vẫn duy trì địa chỉ IP và cấu hình mạng, giảm thiểu sự phức tạp trong quá trình di chuyển.

Bài viết blog này sẽ giải thích các tùy chọn kết nối, cân nhắc thiết kế và best practices khi di chuyển khối lượng công việc lên AWS sử dụng EVS và HCX.

## Điều kiện tiên quyết

- Đã hoàn thành kiểm tra danh sách điều kiện tiên quyết của EVS
- Phiên bản vSphere on-premises là 8.0 trở lên
- Phiên bản HCX on-premises là 4.11.3
- Phiên bản HCX của EVS là 4.11.3
- Có giấy phép VCF cần thiết để triển khai EVS (tối thiểu 256 cores và 110 TiB dung lượng vSAN cho 4 EC2 instances i4i.metal)

## Kết nối mạng riêng tư

### Tùy chọn 1: Direct Connect

[Direct Connect](https://aws.amazon.com/jp/directconnect/) là dịch vụ kết nối trực tiếp môi trường on-premises với AWS thông qua mạng vật lý chuyên dụng. Bạn có thể thiết lập kết nối riêng tư và tốc độ cao giữa data center và AWS mà không cần qua internet công cộng.

**Đặc điểm chính:**
- Băng thông linh hoạt từ 1 Gbps đến 400 Gbps cho kết nối chuyên dụng, 50 Mbps đến 25 Gbps cho kết nối được host
- Độ trễ thấp, thông lượng cao hơn
- Tối ưu cho việc di chuyển khối lượng công việc lớn

**Cấu hình cần thiết:**
1. Cung cấp Direct Connect
2. Tạo Transit VIF
3. Liên kết Direct Connect Gateway với Transit Gateway
4. Gắn TGW vào EVS VPC sử dụng VPC attachment
5. Cấu hình BGP và routing

**Cân nhắc chi phí:**
- Miễn phí nhận dữ liệu vào AWS
- Phí xử lý dữ liệu Transit Gateway (0.02 USD mỗi GB)
- Phí sử dụng port Direct Connect và phí gửi dữ liệu

### Tùy chọn 2: Site-to-Site VPN

[Site-to-Site VPN](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) cung cấp kết nối riêng tư mở rộng mạng on-premises của bạn lên AWS một cách an toàn qua internet công cộng. Sử dụng tunnel được xác thực và mã hóa bởi IPSec để đạt được kết nối mạng an toàn.

**Đặc điểm chính:**
- Kết nối nhanh chóng và hiệu quả về chi phí
- Dễ cấu hình và triển khai nhanh
- Không cần cấu hình routing BGP phức tạp

**Tùy chọn băng thông:**
- Tiêu chuẩn: 1.25 Gbps mỗi tunnel
- Dung lượng lớn: 5 Gbps mỗi tunnel
- Thông lượng tối đa 20 Gbps với ECMP routing

**Cân nhắc chi phí:**
- Miễn phí nhận dữ liệu vào AWS
- Phí gửi dữ liệu (miễn phí 100 GB đầu tiên mỗi tháng, sau đó 0.09 USD mỗi GB)
- Phí kết nối VPN theo giờ
- Phí xử lý dữ liệu Transit Gateway (0.02 USD mỗi GB)

## Kết nối Internet công cộng

Bằng cách tận dụng internet công cộng, bạn có thể sử dụng kết nối trực tiếp qua internet khi di chuyển khối lượng công việc VMware lên EVS. Điều này cho phép xử lý linh hoạt khi khó có thể đảm bảo kết nối riêng tư do các lý do như chậm trễ trong việc mua sắm Direct Connect, thiếu thiết bị đầu cuối VPN, hoặc yêu cầu routing BGP phức tạp, hoặc khi cần triển khai nhanh chóng mà không cần cấu hình mạng quy mô lớn.

Hiện tại EVS hỗ trợ di chuyển HCX qua internet công cộng từ vSphere on-premises đến khối lượng công việc bằng cách gán trực tiếp public IP cho các appliance HCX được triển khai trong EVS.

**Cân nhắc:**
- Quan trọng là phải đánh giá kỹ lưỡng thông số kỹ thuật của ISP
- Đánh giá băng thông internet khả dụng
- Xác nhận chính sách về giới hạn truyền dữ liệu và hạn chế băng thông
- Khả năng xảy ra chậm trễ không mong muốn hoặc chi phí bổ sung trong di chuyển quy mô lớn

## Tổng kết

Khách hàng di chuyển khối lượng công việc VMware lên EVS sử dụng HCX có nhiều tùy chọn kết nối, mỗi tùy chọn phù hợp với các yêu cầu và hạn chế khác nhau.

**Direct Connect** là giải pháp đáng tin cậy nhất và hiệu suất cao, tối ưu cho di chuyển quy mô lớn hoặc vận hành hybrid liên tục, nhưng cần thời gian cho việc lập kế hoạch và mua sắm.

**Site-to-Site VPN** là phương tiện có thể triển khai nhanh chóng, cung cấp bảo mật tốt và băng thông phù hợp. Tối ưu cho di chuyển quy mô nhỏ hoặc khi cần triển khai nhanh.

**Kết nối Internet công cộng** đơn giản hóa việc triển khai bằng cách loại bỏ các yêu cầu mạng phức tạp. Hữu ích cho các tổ chức thiếu chuyên gia mạng hoặc có hạn chế về thời gian.

Dù chọn đường nào, chìa khóa thành công là đánh giá cẩn thận các yêu cầu di chuyển như lượng dữ liệu, timeline, băng thông khả dụng và chi phí. Bằng cách hiểu những lựa chọn này và sự đánh đổi của chúng, các tổ chức có thể áp dụng chiến lược kết nối phù hợp nhất cho việc di chuyển lên EVS.

---

## Về các tác giả

**James Selwood** là Senior Specialist Solutions Architect trong nhóm Infrastructure Migration and Modernization, phát huy 19 năm kinh nghiệm chuyên môn trong ngành tại AWS.

**Allan Scott** là Senior Specialist Solutions Architect tại AWS, đam mê hỗ trợ hành trình chuyển đổi cloud của các doanh nghiệp lớn.

Bài dịch được thực hiện bởi Solutions Architect Furuya.
