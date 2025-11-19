---
title: "Deep Dive: Cấp phát và Tối ưu hóa Amazon ECS Managed Instances"
date: 2025-11-19
draft: false
categories: ["AWS", "Container", "ECS", "Cloud Computing"]
tags: ["ECS", "managed-instances", "EC2", "container", "cost-optimization", "high-availability", "aws"]
description: "Tìm hiểu chi tiết về cách Amazon ECS Managed Instances tự động cấp phát và tối ưu hóa EC2 instances, cân bằng giữa tính khả dụng cao và hiệu quả chi phí cho workload container."
---

# Deep Dive: Cấp phát và Tối ưu hóa Amazon ECS Managed Instances

**Tác giả:** Hiroaki Kaji  
**Ngày công bố:** 19 tháng 11 năm 2025  
**Ngày công bố bài gốc:** 4 tháng 11 năm 2025  
**URL bài gốc:** https://aws.amazon.com/jp/blogs/containers/deep-dive-amazon-ecs-managed-instances-provisioning-and-optimization/

Bài viết này được dịch từ Deep Dive: Amazon ECS Managed Instances provisioning and optimization (ngày công bố: 4 tháng 11 năm 2025).

## Giới thiệu

Amazon Elastic Container Service (Amazon ECS) Managed Instances là lựa chọn compute được quản lý hoàn toàn, loại bỏ gánh nặng quản lý hạ tầng đồng thời vẫn có thể truy cập các tính năng đa dạng của Amazon Elastic Compute Cloud (Amazon EC2). Điều này bao gồm tính linh hoạt như lựa chọn loại instance, truy cập Reserved Capacity, tận dụng cấu hình bảo mật và giám sát nâng cao. ECS Managed Instances hỗ trợ khách hàng bắt đầu nhanh chóng bằng cách ủy thác vận hành cho Amazon Web Services (AWS). Giảm tổng chi phí sở hữu và cho phép đội ngũ tập trung xây dựng ứng dụng mang lại đổi mới.

Bài viết này giải thích chi tiết về cách ECS Managed Instances tự động cấp phát và tối ưu hóa EC2 instances, cân bằng giữa tính khả dụng cao và hiệu quả chi phí của workload.

## Amazon ECS Managed Instances Capacity Provider

"Capacity Provider" của Amazon ECS là giao diện định nghĩa khả năng tính toán cho workload. ECS cluster tự động bao gồm các capacity provider FARGATE và FARGATE_SPOT được AWS quản lý để khởi chạy workload bằng serverless computing. Bạn cũng có thể tạo capacity provider EC2 Auto Scaling group (ASG) riêng để chạy workload trên EC2 instances.

Amazon ECS Managed Instances là capacity provider mới kết hợp trải nghiệm được quản lý hoàn toàn của AWS Fargate với tính linh hoạt của Amazon EC2, mang lại ưu điểm của cả hai. ECS nhanh chóng cấp phát và mở rộng EC2 instances được quản lý hoàn toàn trong tài khoản AWS của bạn theo yêu cầu của workload.

ECS Managed Instances capacity provider tự động chọn instances tổng quát được tối ưu hóa chi phí. Bạn có thể tùy chỉnh yêu cầu instance bằng cách chỉ định vCPU và bộ nhớ tối thiểu/tối đa, loại instance mong muốn, nhà sản xuất CPU, loại accelerator và các thông số kỹ thuật khác của instance.

## Quy trình Cấp phát

ECS Managed Instances giám sát workload liên tục và khởi chạy EC2 instances mới kịp thời dựa trên yêu cầu của workload. Tăng tính khả dụng của ứng dụng bằng cách tự động phân phối các task giữa các Availability Zone (AZ) trong subnet đã cấu hình.

Khi khởi chạy instances mới, ECS đầu tiên đảm bảo phân phối AZ phù hợp, sau đó thực hiện bin packing các task trong mỗi instance để tối ưu hóa chi phí. Điều này cân bằng giữa tính khả dụng cao và hiệu quả chi phí.

Hơn nữa, bằng cách đặt nhiều task trên cùng một instance, ECS Managed Instances không chỉ tối ưu hóa chi phí hạ tầng mà còn tăng tốc khởi chạy task vì các task tiếp theo tránh được thời gian chờ cấp phát instance và được hưởng lợi từ container image cache trên instance.

### Lựa chọn Instances Hiện có

ECS thực hiện quản lý tài nguyên chính xác cho từng instance, theo dõi CPU, bộ nhớ và các tài nguyên khác theo thời gian thực. Khi instance được đăng ký với ECS, dung lượng khả dụng là tổng tài nguyên của EC2 instance trừ đi bộ nhớ dành riêng cho ECS agent.

ECS ước tính lượng tài nguyên mà agent tiêu thụ dựa trên dữ liệu thực tế cho từng loại instance khi đăng ký, đảm bảo đủ tài nguyên cho nhiều task đồng thời. Khi task khởi chạy và dừng, ECS cập nhật động dung lượng tài nguyên khả dụng của instance.

Khi đặt task mới, ECS đầu tiên kiểm tra xem instances hiện có có đủ tài nguyên hay không. Nếu có nhiều instances phù hợp, ECS ưu tiên phân phối task giữa các AZ để đạt khả năng phục hồi tối đa, đồng thời kiểm soát phân phối AZ thông qua subnet được cấu hình trong managed instances capacity provider.

### Đăng ký Instances Mới

Khi ECS Managed Instances không thể đặt task mới vào instances hiện có, task đó chuyển sang trạng thái PROVISIONING trong khi chờ dung lượng mới. ECS xử lý hàng loạt một cách thông minh các task được yêu cầu khởi chạy từ nhiều ứng dụng thay vì cấp phát từng instance riêng lẻ.

Điều này cân bằng giữa khả năng phản hồi và cơ hội tối ưu hóa. ECS phân tích yêu cầu tài nguyên toàn diện, chọn loại instance tối ưu đồng thời phân phối task giữa các AZ.

Việc đặt các task có yêu cầu CPU, bộ nhớ và lưu trữ khác nhau vào hàng trăm loại instance khả dụng là bài toán bin packing đa chiều NP-complete. ECS áp dụng thuật toán First Fit Decreasing (FFD), ưu tiên khả năng phản hồi của hệ thống hơn tính hoàn hảo toán học, duy trì tỷ lệ sử dụng tài nguyên hiệu quả và cung cấp kết quả gần tối ưu trong thời gian đa thức.

## Tối ưu hóa Hạ tầng

ECS Managed Instances khởi chạy EC2 instances có kích thước phù hợp dựa trên cấu hình capacity provider và yêu cầu workload. Theo thời gian, do thay đổi mẫu traffic hoặc dynamic scaling, EC2 instances có thể không còn phù hợp với yêu cầu workload.

ECS Managed Instances liên tục tối ưu hóa hạ tầng, drain các instances có tỷ lệ sử dụng thấp và di chuyển task sang các instances hiện có có tài nguyên khả dụng hoặc sang instances mới được cấp phát với kích thước phù hợp.

ECS Managed Instances tự động xóa các instances ở trạng thái idle không có task đang chạy, do đó bạn chỉ trả cho các tài nguyên đang hoạt động.

## Tính khả dụng

ECS Managed Instances cải thiện tính khả dụng của ứng dụng bằng cách tự động phân phối các task của ECS service giữa các AZ đối với subnet đã cấu hình trước. Khi khởi chạy instances mới, ECS đầu tiên phân phối instances vào tất cả AZ đã cấu hình trước, sau đó đặt task lên các instances đó để tối đa hóa tính khả dụng.

Sau nhiều thao tác scaling, nếu ECS service đạt trạng thái task không được cân bằng hoàn toàn giữa các AZ, tính năng điều chỉnh ECS service giữa các AZ sẽ giúp phân phối lại task giữa các instances. Điều này có thể yêu cầu scale in/out instances.

Lợi ích cuối cùng là ECS giữ các service task chủ yếu ở trạng thái cân bằng giữa các AZ, sau đó thực hiện bin packing hiệu quả trên instances, tối ưu hóa sự cân bằng giữa tính khả dụng và tối ưu hóa chi phí.

## Hướng dẫn Demo

Trong hướng dẫn này, chúng ta sẽ tạo demo thực tế về ECS Managed Instances bằng cách triển khai Amazon ECS cluster được cấu hình với managed instances capacity provider. Thiết lập này bao gồm 2 ECS services riêng biệt có yêu cầu CPU và bộ nhớ khác nhau.

Để cấp phát tài nguyên ECS, chúng ta cũng cấp phát Amazon Virtual Private Cloud (Amazon VPC), IAM và tài nguyên EC2. Sử dụng AWS CLI và cấp phát tập hợp tài nguyên ban đầu thông qua AWS CloudFormation. Sau đó, sử dụng các lệnh AWS CLI đối với ECS API để cập nhật số lượng ECS task trong service và quan sát cách ECS quản lý EC2 instances nội bộ.

Hoàn thành toàn bộ demo này mất khoảng 40 phút.

### Điều kiện tiên quyết

- Người dùng có quyền vận hành CloudFormation, ECS, EC2
- AWS CLI

### Các bước thực hiện

**Bước 1:** Tải xuống CloudFormation templates từ GitHub repository

Templates bao gồm: `vpc-stack.json`, `ecs-stack.json`, `nested-stack-coordinator.json`

```bash
git clone https://github.com/aws-samples/sample-amazon-ecs-managed-instances
cd sample-amazon-ecs-managed-instances/cfn-templates
```

**Bước 2:** Tạo S3 bucket để lưu trữ CloudFormation templates

```bash
export AWS_REGION=us-west-2
export BUCKET_NAME=ecs-managed-instances-templates-$(date +%s%N | sha256sum | head -c 6)
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION
```

**Bước 3:** Tải templates lên S3 bucket

```bash
aws s3 cp vpc-stack.json s3://$BUCKET_NAME
aws s3 cp ecs-stack.json s3://$BUCKET_NAME
aws s3 cp nested-stack-coordinator.json s3://$BUCKET_NAME
```

**Bước 4:** Tạo CloudFormation stack bằng template `nested-stack-coordinator.json`

Lệnh này sẽ tạo 3 CloudFormation stacks trong tài khoản của bạn (Coordinator Stack, VPC Stack và ECS Stack). Coordinator Stack tạo VPC Stack và ECS Stack. VPC Stack chứa tài nguyên VPC, ECS Stack chứa tài nguyên ECS.

```bash
aws cloudformation create-stack \
  --stack-name managed-instances-coordinator \
  --template-body file://nested-stack-coordinator.json \
  --parameters \
    ParameterKey=VpcStackTemplateUrl,ParameterValue=https://$BUCKET_NAME.s3.amazonaws.com/vpc-stack.json \
    ParameterKey=EcsStackTemplateUrl,ParameterValue=https://$BUCKET_NAME.s3.amazonaws.com/ecs-stack.json \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $AWS_REGION
```

**Bước 5:** CloudFormation sẽ tạo các tài nguyên sau:

- 1 ECS cluster với managed instances capacity provider
- 2 ECS services:
  - **ManagedInstancesService1**: 1 vCPU, 5.5GB bộ nhớ mỗi task
  - **ManagedInstancesService2**: 1 vCPU, 9.5GB bộ nhớ mỗi task
- Tổng 4 tasks phân phối giữa các AZ (2 tasks mỗi service)
- 2 managed instances trong managed instances capacity provider

### ECS Cluster và ECS Services

**Hình 4:** 1 cluster với 2 ECS services, mỗi service chạy 2 tasks

### ECS Tasks

Ứng dụng chạy 4 ECS tasks phân phối trên 2 AZ (us-west-2a và us-west-2b) để đạt high availability. Nếu 1 AZ gặp vấn đề, ứng dụng vẫn tiếp tục chạy từ AZ khác, loại bỏ single point of failure và đảm bảo tính khả dụng nhất quán của service.

**Hình 5:** 4 ECS tasks cho 2 ECS services với cấu hình tài nguyên task khác nhau cho mỗi service

### Amazon ECS Managed Instances Capacity Provider

**Hình 6:** Managed instances capacity provider chạy trên 2 instances trải dài 2 AZ. Việc sử dụng tài nguyên được tối ưu hóa

Managed instances capacity provider đã phân tích yêu cầu tài nguyên chính xác. Cần tổng 15GB bộ nhớ (9.5GB + 5.5GB) và 2 vCPU cho mỗi instance. ECS đã cấp phát 2 r5a.large instances tối ưu (2 vCPU, 16GB bộ nhớ) trong 2 AZ, đảm bảo high availability đồng thời tối đa hóa hiệu quả tài nguyên.

Trên mỗi instance, cả 2 service tasks đều chạy hiệu quả. 15GB trong số 16GB bộ nhớ được sử dụng, và cả 2 vCPU đều được sử dụng tích cực. Kết quả là quản lý dung lượng thông minh loại bỏ công việc đoán mò thủ công, giảm chi phí thông qua phân bổ tài nguyên hiệu quả đồng thời duy trì hiệu năng cần thiết cho ứng dụng.

**Bước 6:** Tiếp theo, chúng ta sẽ demo quản lý tài nguyên thông minh của ECS Managed Instances bằng cách đặt số lượng desired tasks của ManagedInstancesService1 về 0. Thao tác này sẽ dừng 2 tasks đang chạy trên 2 r5a.large instances (mỗi task 9.5GB bộ nhớ, 1 vCPU).

Khi tasks của ManagedInstancesService1 bị xóa, mỗi instance chỉ chạy task còn lại của ManagedInstancesService2 (mỗi task 5.5GB bộ nhớ, 1 vCPU). Điều này tạo ra tình trạng sử dụng tài nguyên không hiệu quả: r5a.large instances (16GB, 2 vCPU) chạy 1 task 5.5GB duy nhất, dẫn đến dung lượng chưa sử dụng.

```bash
aws ecs update-service \
  --cluster $(aws cloudformation describe-stacks \
    --stack-name managed-instances-coordinator \
    --query 'Stacks[0].Outputs[?OutputKey==`EcsClusterId`].OutputValue' \
    --output text) \
  --service ManagedInstancesService1 \
  --desired-count 0 \
  --region $AWS_REGION
```

**Hình 7:** Khi dừng ECS tasks, các instances trong managed instances capacity provider trở nên underutilized

ECS Managed Instances capacity provider nhanh chóng phát hiện sự không hiệu quả tài nguyên này và xử lý bằng cách drain 1 trong các instances có tỷ lệ sử dụng thấp. Cả 2 instances đều không còn tối ưu cho workload hiện tại, nhưng hệ thống không drain đồng thời vì có rủi ro ảnh hưởng đến tính khả dụng của service. Thay vào đó, ECS áp dụng cách tiếp cận ưu tiên tính khả dụng, drain instances theo từng giai đoạn. Bằng cách duy trì đủ dung lượng hoạt động trong quá trình tối ưu hóa, luôn có dung lượng sẵn sàng cho việc đặt task mới hoặc các sự kiện scaling không mong đợi.

**Hình 8:** Managed instances capacity provider drain các instances có tỷ lệ sử dụng thấp

Khi quá trình drain hoàn tất, tasks bị loại bỏ sẽ chuyển sang instance còn lại ở us-west-2a. Instance này còn đủ tài nguyên. ECS Managed Instances ưu tiên dung lượng hiện có hơn là cấp phát mới để nhanh chóng ổn định service. Cả 2 tasks ManagedInstancesService2 chạy trên 1 instance duy nhất để tối đa hóa tận dụng tài nguyên. Trong khi đó, instance đã drain trở nên rỗng. ECS tự động hủy đăng ký instance rỗng này và terminate nó. Điều này làm hạ tầng co lại từ 2 instances xuống 1. Đây là minh chứng cho việc điều chỉnh liên tục dựa trên nhu cầu thực tế. ECS xử lý phân phối AZ trong các bước tối ưu hóa sau, cân bằng giữa hiệu quả và high availability.

**Hình 9:** Managed instances capacity provider hủy đăng ký các instances ở trạng thái idle không có tasks

Sau khi ECS cluster ổn định, ECS tự động phân phối lại workload giữa các AZ bằng cách bắt đầu thay thế task trong AZ mới đồng thời dừng tasks hiện có. Điều này cấp phát r7a.medium instance có kích thước phù hợp (1 vCPU, 8GB) trong AZ thứ 2 cho task 5.5GB, trong khi r5a.large instance ban đầu trở nên có tài nguyên quá mức để chạy 1 task. ECS Managed Instances capacity provider phát hiện sự không hiệu quả này và drain instance underutilized, đạt được tối ưu hóa liên tục cân bằng giữa high availability và cost-effectiveness giữa các AZ.

**Hình 10:** AZ rebalancing và tối ưu hóa liên tục của managed instances capacity provider

Cuối cùng, managed instances capacity provider đạt trạng thái tối ưu: chạy 2 r7a.medium instances (1 vCPU, 8GB) trải dài 2 AZ, mỗi instance chạy 1 task (1 vCPU, 5.5GB).

**Hình 11:** Managed instances capacity provider chạy với dung lượng tối ưu sau khi tối ưu hóa hạ tầng

## Workload Chạy Dài hạn

**Hình 12:** Test chạy dài hạn với scaling ECS tasks có thể dự đoán

**Hình 13:** Metrics của capacity provider với mẫu scaling theo chu kỳ

ECS Managed Instances capacity provider khớp tài nguyên với nhu cầu thực tế. Trong một kịch bản test khác (Hình 12), 2 ECS services lặp lại thay đổi workload mỗi 30 phút, scaling từ tổng 100 tasks xuống 70 tasks, sau đó xuống 2 tasks. Điều này được thực hiện trong 2 giờ và lấy dữ liệu theo chu kỳ 1 phút, cho phép xác nhận chi tiết cách capacity provider phản ứng với những thay đổi workload này.

Insight quan trọng ở đây là ECS Managed Instances duy trì sự phù hợp mạnh mẽ giữa phân bổ tài nguyên và nhu cầu thực tế, với các metrics sử dụng vCPU và bộ nhớ phản ánh chính xác mẫu chu kỳ của ECS tasks.

Metric `DrainingContainerInstances` cho thấy tối ưu hóa liên tục đang diễn ra ở background. Thay vì chờ can thiệp thủ công, ECS Managed Instances liên tục giám sát hiệu quả tài nguyên trên toàn bộ cluster. Khi tasks scale down, hệ thống ngay lập tức drain các instances chưa được tận dụng và di chuyển workload còn lại một cách thích hợp để tối ưu hóa mật độ ECS cluster. Quy trình tự động này đảm bảo tài nguyên không ở trạng thái idle lâu hơn mức cần thiết.

## Dọn dẹp

Sau khi hoàn thành hướng dẫn này, bạn cần dọn dẹp tất cả tài nguyên đã triển khai để ngăn việc tính phí liên tục và duy trì môi trường AWS sạch sẽ. Bước này giúp ngăn chặn các khoản phí không mong đợi và giữ môi trường AWS của bạn gọn gàng bằng cách xóa các tài nguyên không sử dụng.

**Bước 1:** Xóa CloudFormation stack

```bash
aws cloudformation delete-stack \
  --stack-name managed-instances-coordinator \
  --region $AWS_REGION
```

**Bước 2:** Xóa CloudFormation templates và S3 bucket

```bash
aws s3 rb s3://$BUCKET_NAME --region $AWS_REGION --force
```

## Tổng kết

Bài viết này đã giải thích về cấp phát hạ tầng và tối ưu hóa workflow của Amazon ECS Managed Instances. Trong phiên bản phát hành đầu tiên, các best practices vận hành AWS được triển khai để cân bằng giữa tính khả dụng và hiệu quả chi phí, nhưng chúng tôi hiểu rằng các workload khác nhau yêu cầu những đánh đổi khác nhau về chi phí, hiệu năng và tính khả dụng.

Trong tương lai, chúng tôi dự định tăng cường provisioning và optimization workflow, giới thiệu khả năng kiểm soát của khách hàng như thời gian cấu hình được cho optimization workflow, capacity headroom và target utilization level, custom placement strategy, Disruption Budgets.

Để biết các cập nhật trong tương lai, vui lòng tham khảo ECS roadmap trên GitHub. Chúng tôi mong nhận được phản hồi của bạn để giúp định hình tương lai của Amazon ECS.

Bản dịch được thực hiện bởi Solution Architect Kaji.
