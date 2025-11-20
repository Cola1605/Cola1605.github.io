---
title: "Kiểm chứng khả năng di chuyển container sản phẩm tự phát triển (HULFT10) từ ECS on EC2 sang ECS Managed Instance"
date: 2025-10-10
draft: false
categories: ["AWS", "DevOps and Infrastructure"]
tags: ["AWS", "ECS", "HULFT", "HULFT10", "container", "migration", "managed-instance", "CloudFormation"]
description: "Kiểm chứng khả năng migration HULFT10 container từ ECS on EC2 sang ECS Managed Instances mới của AWS, giảm overhead quản lý hạ tầng trong khi vẫn truy cập được các tính năng EC2."
---

# Kiểm chứng khả năng di chuyển container sản phẩm tự phát triển (HULFT10) từ ECS on EC2 sang ECS Managed Instance

**Tác giả:** @Akifumi_Nakamura (Nakamura Akifumi)  
**Tổ chức:** Saison Technology Co., Ltd.  
**Ngày đăng:** 2 tháng 10, 2025  
**Cập nhật cuối:** 6 tháng 10, 2025  
**Nguồn:** [Qiita](https://qiita.com/Akifumi_Nakamura/items/5262340348eb20ba58a4)

**Thẻ:** AWS, ECS, HULFT, HULFT10

## Giới thiệu

Gần đây AWS đã có thông báo sau đây:

[Announcing Amazon ECS Managed Instances](https://aws.amazon.com/jp/about-aws/whats-new/2025/09/amazon-ecs-managed-instances/)

※Trích dẫn kết quả dịch Google

> AWS hôm nay thông báo việc ra mắt Amazon Elastic Container Service (Amazon ECS) managed instances. Đây là một tùy chọn tính toán được quản lý hoàn toàn mới, được thiết kế để cho phép truy cập vào tất cả các tính năng của Amazon EC2 trong khi giảm overhead quản lý hạ tầng. Bằng cách off-load các hoạt động hạ tầng cho AWS, ECS managed instances giúp khởi động và mở rộng workload nhanh chóng, cải thiện hiệu suất và giảm tổng chi phí sở hữu.

Tôi nghĩ đây là một thông báo có tác động khá lớn đối với những người đang sử dụng ECS, bởi vì số lượng launch type của ECS đã tăng lên.  
Với tư cách là người đang bán sản phẩm HULFT10 for Container Services - một sản phẩm container hoạt động trên ECS - trên Marketplace, tôi đang băn khoăn về cách tiếp cận tính năng này trong tương lai.

HULFT for Container Services là sản phẩm sử dụng CloudFormation để triển khai HULFT container vào ECS của môi trường người dùng.  
Khi triển khai, có thể lựa chọn chạy trên ECS on EC2 hoặc ECS on Fargate.

Ban đầu, tôi muốn tạo ra cơ chế hoạt động sử dụng hạ tầng được AWS quản lý hoàn toàn nên dự định chỉ cung cấp phiên bản Fargate, nhưng do những lý do sẽ đề cập sau, có những tính năng chỉ có thể thực hiện được với phiên bản EC2, nên đã quyết định cung cấp cả phiên bản EC2.  
Lần này với việc cung cấp ECS managed instances, tôi nghĩ có thể cung cấp các tính năng chỉ có thể thực hiện được với phiên bản EC2 theo cách được quản lý hoàn toàn, nên đã điều tra xem liệu có thể thực hiện được hay không.

## Nội dung kiểm chứng

Đã tiến hành kiểm chứng hai điều sau đây:

1. Có thể chỉ định khởi động EC2 instance sử dụng user data input hay không
2. Có thể di chuyển môi trường ECS on EC2 được triển khai bằng CloudFormation sang môi trường ECS managed instance hay không

### Có thể chỉ định khởi động EC2 instance sử dụng user data input hay không

Trong HULFT10 for Container Services, do tình hình triển khai ECS vào VPC mới, để truy cập EFS của hệ thống hiện có, cần phải mount EFS trên EC2 chứ không phải mount trong ECS task.  
Để thực hiện điều này, đã sử dụng user data input để thực hiện mount EFS khi khởi động EC2 instance.

Lần này đã kiểm chứng xem có thể mount EFS bằng user data trong managed instance được hỗ trợ hay không.

### Có thể di chuyển môi trường ECS on EC2 được triển khai bằng CloudFormation sang môi trường ECS managed instance hay không

Đã kiểm chứng xem người dùng đã triển khai HULFT10 for Container Services bằng CloudFormation có thể chuyển đổi sang cấu hình khởi động sử dụng managed instance hay không (có thể cấu hình theo cách không xung đột với cài đặt CloudFormation hay không).

## Kết quả kiểm chứng

### Có thể chỉ định khởi động EC2 instance sử dụng user data input hay không

Khi tạo capacity provider có thể cài đặt thuộc tính managed instance, nhưng không có cài đặt user data input. Cũng không tìm thấy trong [tài liệu tham khảo CloudFormation](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/APIReference/API_InstanceRequirementsRequest.html).

Ngoài ra, vì OS được sử dụng được mô tả là [Bottlerocket](https://bottlerocket.dev/en/os/) - một OS chuyên dụng cho container hosting, nên ngay cả khi có thể sử dụng user data input thì việc mount EFS cũng có vẻ khó khăn.

### Có thể di chuyển môi trường ECS on EC2 được triển khai bằng CloudFormation sang môi trường ECS managed instance hay không

Việc sử dụng managed instance không phải là chỉ định bằng option mà là lựa chọn như launchType. Do đó, có vẻ cần phải sửa [launchType](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/APIReference/API_CreateService.html#API_CreateService_RequestSyntax) trong template hiện có thành `MANAGED_INSTANCES`.

Thực tế khi thao tác trên console, sau khi triển khai managed instance, tiến hành cập nhật stack bằng CloudFormation template gốc để xác nhận, thì mặc dù task definition được cập nhật và service được khởi động lại, tình trạng hoạt động trên managed instance vẫn được duy trì.

"Application environment" của task definition đã trở về `EC2`, nhưng do cài đặt "Capacity provider strategy" ở phía service vẫn còn, nên có vẻ đã có hành vi này.

Cài đặt của task definition và service đã trở nên không nhất quán và không phải là tình huống tốt, hơn nữa trong container instance sẽ có các EC2 không được sử dụng đang chờ do cài đặt Auto Scaling group khởi động. Có vẻ cần CloudFormation template chuyên dụng cho việc di chuyển chính thức.

## Chi tiết kiểm chứng

Sau đây là nội dung thao tác thực tế để thực hiện kiểm chứng trên.

Cluster thay đổi cài đặt là cluster được triển khai [HULFT10 for Container Services](https://aws.amazon.com/marketplace/pp/prodview-46o6kapgcvvey) bằng "Deployment to ECS on EC2".

### Tạo capacity provider

Tạo capacity provider cho managed instance từ "Infrastructure" của cluster đích.

Managed instance đã được thêm mới vào scaling type.

Việc tạo managed instance cần tạo "Infrastructure role" chuyên dụng. Đã tạo từ nút "Create new infrastructure role".

Mở với usecase đích đã được chọn.

IAM Policy cũng đã được chọn sẵn

> Sau khi tạo IAM role, đã thêm `iam:PassRole` vào role bằng inline policy.  
> Nếu không thêm quyền này, sẽ xảy ra lỗi sau khi deploy:
> 
> ```
> "service ecs-control-hulft-XXXX-ap-northeast-1-01 was unable to place a task. Reason: ResourceInitializationError: Unable to launch instance(s) for capacity provider test-managed. UnauthorizedOperation: You are not authorized to perform this operation. User: arn:aws:sts::XXXX:assumed-role/ecsInfrastructureRole/ECSFargateManagedInstances is not authorized to perform: iam:PassRole on resource: arn:aws:iam::XXXX:role/ecsInstancerole-hulft-XXXX because no identity-based policy allows the iam:PassRole action. RequestId: XXXX."
> ```
> 
> Đã được giải thích trong [trang này](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/getting-started-managed-instances.html).

Cài đặt role đã tạo.

Vì có dịp nên thử custom lựa chọn instance.

> Memory được chỉ định bằng MiB chứ không phải GiB

Cũng đã xác nhận option thêm thuộc tính instance, nhưng rất tiếc không có "User data input" mà muốn sử dụng.

Cài đặt network giống như đã cài đặt cho EC2.

Khi thực hiện tạo với các cài đặt trên, managed instance đã tạo đã hiển thị trên capacity provider.

### Launch template

Sau khi tạo capacity provider, launch template cho managed instance đã được tạo.  
Có vẻ giống như template được sử dụng cho Auto Scaling group, nên có thể từ đây có thể cài đặt user data input (mặc dù hy vọng mong manh...)

### Cập nhật task definition

Thay đổi "Launch type" của task definition từ `Amazon EC2 Instance` sang `Managed Instance`.

Phần bind mount của volume - lý do sử dụng EC2 - có vẻ được xử lý giống như Fargate launch type.

### Cập nhật service

Trong cập nhật service, cập nhật "Task definition revision" và mở "Compute configuration (- Advanced)".

Chọn "Capacity provider strategy", chọn capacity provider đã tạo trước đó và thực hiện cập nhật.

### Xác nhận khởi động

Sau một lúc, instance được khởi động bởi capacity provider đã được đăng ký vào container instance (Auto Scaling group đã được dừng trước đó).

Từ thông tin task đã khởi động cũng có thể xác nhận rằng launch type là managed instance.

Cảm ơn bạn đã vất vả.

## Kết luận

Cảm ơn bạn đã đọc đến đây.  
Lần này tôi muốn tạm hoãn việc hỗ trợ managed instance như launch type của HULFT, nhưng sẽ tiếp tục thu thập thông tin với kỳ vọng vào các cập nhật trong tương lai.

---

## Tóm tắt kỹ thuật

### Đặc điểm của ECS Managed Instance
- **Ngày thông báo:** Tháng 9, 2025
- **OS:** Bottlerocket (OS chuyên dụng cho container hosting)
- **Launch type:** `MANAGED_INSTANCES`
- **Ưu điểm:** Giảm overhead quản lý hạ tầng, truy cập đầy đủ tính năng EC2, được quản lý hoàn toàn

### Yêu cầu và hạn chế của HULFT10
- **Yêu cầu EFS:** Cần mount EFS trên EC2 để truy cập EFS hệ thống hiện có
- **User data:** Cần thiết cho xử lý mount EFS khi khởi động EC2
- **Hạn chế VPC:** Do triển khai ECS trong VPC mới, không thể mount ECS task

### Thách thức di chuyển
1. User data input không được hỗ trợ
2. Hạn chế mount EFS do Bottlerocket OS
3. Cài đặt CloudFormation template không nhất quán
4. Tài nguyên Auto Scaling group chờ vô ích

**Kết luận:** Hiện tại khó có thể hỗ trợ ECS managed instance trong HULFT10 for Container Services

---

**Số lượt thích:** 10 | **Số lượt stock:** 2