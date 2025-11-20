---
title: "Tự động cài đặt AWS Systems Manager Agent trên các Amazon EC2 Node không được quản lý"
date: 2025-10-16
draft: false
categories: ["AWS", "DevOps and Infrastructure"]
tags: ["AWS-Systems-Manager", "SSM-agent", "EC2", "CloudFormation", "AWS-Organizations", "automation", "fleet-management", "centralized-management"]
description: "Hướng dẫn tự động cài đặt AWS Systems Manager agent trên EC2 instances không được quản lý sử dụng CloudFormation và AWS Organizations để quản lý fleet tài nguyên quy mô lớn."
---

# Tự động cài đặt AWS Systems Manager Agent trên các Amazon EC2 Node không được quản lý

**Tác giả:** Atsushi Fukui (PSSA)  
**Ngày xuất bản:** 15 tháng 10, 2025  
**Ngày xuất bản bản gốc:** 17 tháng 7, 2025  
**Danh mục:** AWS CloudFormation, AWS Organizations, AWS Systems Manager, Centralized operations management, Integration & Automation, Management & Governance, Management Tools

---

## Tóm tắt

Bài viết này là bản dịch của "[Automate installing AWS Systems Manager agent on unmanaged Amazon EC2 nodes](https://aws.amazon.com/jp/blogs/mt/automate-installing-ssm-agent-on-unmanaged-ec2-instances-in-an-aws-organization/)" được xuất bản vào ngày 17 tháng 7, 2025.

---

## Giới thiệu

Quản lý một fleet (tập hợp instance) tài nguyên AWS lớn là một thách thức phức tạp. Các tổ chức phụ thuộc vào nhiều giải pháp khác nhau để tự động hóa các tác vụ, thu thập inventory, vá lỗi instance và duy trì tuân thủ bảo mật. Đôi khi bạn muốn truy cập vào instance mà không cần mở các port inbound hoặc quản lý SSH key.

[AWS Systems Manager (SSM)](https://aws.amazon.com/systems-manager/) đơn giản hóa sự phức tạp này bằng cách hoạt động như một giải pháp quản lý tập trung, hỗ trợ tất cả các nhu cầu trên ở quy mô lớn.

### 3 yêu cầu để sử dụng tính năng của Systems Manager

1. Instance đã cài đặt Systems Manager agent ([SSM agent](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html))
2. [Quyền truy cập instance cho Systems Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/setup-instance-permissions.html) đã được thiết lập
3. Có kết nối mạng đến [AWS Systems Manager endpoint](https://docs.aws.amazon.com/ja_jp/general/latest/gr/ssm.html)

### Công cụ quản lý hiện có

Sử dụng [Systems Manager Unified Console](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-unified-console.html), bạn có thể cấu hình và cấp quyền truy cập instance cho tất cả các node trong tổ chức.

Tính năng [Diagnose and Remediate](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/diagnose-and-remediate.html) giúp xác định các AWS node không được quản lý và giải quyết các vấn đề liên quan đến mạng. Các vấn đề này bao gồm cấu hình sai security group hoặc vô hiệu hóa [Amazon Virtual Private Cloud (Amazon VPC)](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/what-is-amazon-vpc.html) DNS.

### Thách thức

Mặc dù nhiều Amazon Machine Image (AMI) do AWS cung cấp [đã cài đặt sẵn Systems Manager agent](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ami-preinstalled-agent.html), nhưng các custom AMI hoặc [AMI](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/AMIs.html) cũ có thể cần cài đặt agent.

Đối với các tổ chức quản lý fleet lớn, **việc cài đặt SSM agent thủ công trên nhiều server và account sẽ tạo ra gánh nặng vận hành.**

### Giải pháp

Bài blog này giới thiệu một giải pháp tự động hóa để cài đặt SSM agent trên các instance [Amazon EC2](https://aws.amazon.com/ec2/) hiện có. Giải pháp này được thiết kế để **đơn giản hóa việc cài đặt SSM agent cho fleet node phân tán trên nhiều account và region**, cho phép bạn triển khai nhanh chóng khả năng quản lý của Systems Manager trên toàn bộ AWS Organization.

---

## Điều kiện tiên quyết

Node phải đáp ứng các điều kiện tiên quyết sau:

### Hệ điều hành được hỗ trợ

- Windows Server 2016-2025
- Amazon Linux 2/2023
- RHEL/CentOS 7.x-10.x
- Ubuntu 18.04-24.04
- SUSE Linux Enterprise 15.x

### Agent bắt buộc

- **Cho Windows node:** [EC2Launch v2](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2launch-v2.html) agent
- **Cho Linux node:** [Cloud-init](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/user-data.html#user-data-cloud-init)

### Yêu cầu mạng

Cần có kết nối mạng đến [Amazon S3](https://aws.amazon.com/s3/) (s3.amazonaws.com) để tải xuống tệp cài đặt SSM agent và tải lên log thực thi sau khi cài đặt.

Phương thức kết nối:
- [Internet Gateway](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Internet_Gateway.html)
- [NAT Gateway](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html)
- Đối với private subnet, sử dụng [S3 Gateway Endpoint](https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/vpc-endpoints-s3.html)

### Package Linux

Đối với các node dựa trên Linux, các package sau là bắt buộc để tải xuống phần mềm SSM agent và tải lên log:
- unzip
- curl
- awscli

Nếu không có các package này, hệ thống sẽ tự động cố gắng cài đặt từ repository package của hệ thống. Trong trường hợp này, cần có quyền truy cập Internet trong quá trình cài đặt.

### Yêu cầu về Account

- Nếu đã thiết lập unified console, hãy sử dụng account [Systems Manager delegated administrator](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-setting-up-organizations.html) đã đăng ký khi thiết lập.
- Nếu chưa thiết lập unified console, hãy sử dụng management account của organization hoặc account [CloudFormation StackSets delegated administrator](https://aws.amazon.com/jp/blogs/mt/cloudformation-stacksets-delegated-administration/).

---

## Lưu ý quan trọng

⚠️ **Giải pháp này sử dụng user data để cài đặt SSM agent và yêu cầu dừng và khởi động node trong quá trình thực hiện.**

Điều này sẽ dẫn đến:
- [Temporary storage](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/InstanceStorage.html) bị xóa
- [Non-Elastic IP address](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-instance-addressing.html#concepts-public-addresses) bị thay đổi

**Tất cả ứng dụng đang chạy trên các node này sẽ bị gián đoạn.**

Để tránh gián đoạn không mong muốn, **khuyến nghị thực hiện công việc này trong khoảng thời gian bảo trì đã lên lịch.**

### Instance Profile tạm thời

Trong quá trình thực thi, giải pháp này tạm thời gắn một instance profile để cho phép instance tải log lên S3. **Sau khi hoàn tất, profile tạm thời này sẽ bị xóa và instance quay về trạng thái ban đầu.**

---

## Tổng quan về giải pháp

Giải pháp này sử dụng triển khai tự động với [AWS CloudFormation](https://aws.amazon.com/cloudformation/) để provision tất cả các tài nguyên cần thiết.

### Tài nguyên được provision

- S3 bucket
- Systems Manager Automation runbook
- [IAM role](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles.html)
- [Permission policy](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies.html)
- [Instance profile](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)

Sau khi triển khai, bạn có thể chạy [Systems Manager Automation](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-automation.html) runbook on-demand để cài đặt SSM agent.

**Việc cài đặt có thể nhắm mục tiêu toàn bộ EC2 fleet hoặc các node cụ thể bằng cách sử dụng tag.**

---

## Kiến trúc

![Sơ đồ kiến trúc của workflow triển khai cài đặt SSM agent](Hình 1)

Workflow triển khai bao gồm **3 Systems Manager Automation runbook liên kết** hoạt động cùng nhau.

### 1. SSMAgentInstall-Orchestrator (Orchestrator)

**Vai trò:** Điều phối trung tâm

**Chức năng:**
- Xác thực tất cả input parameter
- Gọi SSMAgentInstall-Primary runbook cho mỗi target account được chỉ định

### 2. SSMAgentInstall-Primary (Primary)

**Vai trò:** Thực thi ở cấp độ region

**Chức năng:**
- Thực thi đối với các node được chỉ định trong input ở target region
- Sử dụng tag hoặc output của Diagnose and Remediate
- Gọi SSMAgentInstall-Secondary runbook cho mỗi target node
- Kiểm tra xem node đã được quản lý bởi SSM hay chưa

### 3. SSMAgentInstall-Secondary (Secondary)

**Vai trò:** Thực thi cài đặt ở cấp độ node

**Chức năng:**

Nếu node không được quản lý, Secondary runbook tiến hành quá trình cài đặt một cách cẩn thận theo các bước có thứ tự:

1. **Xác thực tính đủ điều kiện của node:**
   - Thành viên của Auto Scaling group
   - Loại root volume
   - Trạng thái node

2. **Thực hiện chu kỳ stop và start:**
   - Inject script cài đặt SSM agent thông qua user data
   - Tạm thời gắn các IAM permission cần thiết
   - Xác nhận agent đã được cài đặt thành công

### Log và Report

Trong suốt quá trình này:
- Execution log được thu thập và lưu trữ trong S3 bucket ở Central Account
- Orchestrator runbook tổng hợp tất cả kết quả để tạo báo cáo CSV toàn diện
- Hiển thị trực quan thành công hay thất bại của mỗi lần cài đặt trên toàn bộ organization

---

## Về IAM Permission

Sau khi cài đặt, SSM agent đăng ký node với AWS Systems Manager. Do đó, **đảm bảo rằng node có thể kết nối với Systems Manager endpoint và có [IAM permission](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/setup-instance-permissions.html) cần thiết.**

📝 **Lưu ý:** Nếu bạn đang sử dụng unified console, IAM permission cần thiết sẽ được thiết lập tự động.

---

## Hướng dẫn triển khai

Để triển khai giải pháp này, hãy sử dụng account [CloudFormation StackSets delegated administrator](https://aws.amazon.com/blogs/mt/cloudformation-stacksets-delegated-administration/).

### Bước 1: Triển khai tài nguyên bằng CloudFormation template

1. Tải xuống [CloudFormation template](https://github.com/aws-samples/sample_automate_installing_SSM_agent_on_unmanaged_EC2_instances/blob/main/Templates/CloudFormation/SSMAgentMultiAccountInstallation.yaml).

2. Đăng nhập vào AWS account thích hợp. Nếu được bật, chuyển sang home region của unified console.

3. Đi đến AWS CloudFormation console, click **Stacks** trong navigation pane, sau đó chọn **Create stack** ở góc trên bên phải của trang stacks và chọn **With new resources (standard)**.

4. Trong **Prerequisites – Prepare template**, chọn **Choose an existing template**.

5. Trong **Template source**, chọn **Upload a template file**, chọn **Choose file** và chọn template đã tải xuống ở bước 1.

6. Chọn **Next**.

7. Nhập tên stack (ví dụ: SSMAgentMultiAccountInstallation).

8. Trong **Parameters section**, chỉ định giá trị cho các parameter:
   - **DeploymentTargetsOUs:** Chỉ định ID của organizational unit (OU) nơi target instance tồn tại. CloudFormation sẽ cố gắng tạo tài nguyên trong các account và region này bằng Stacksets.
   - **OrganizationId:** Nhập [organization ID của Organizations](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_view_org.html#orgs_view_org)
   - **TargetRegions:** Nhập các region nơi target instance tồn tại trong organization

9. Trong trang **Configure stack options**, áp dụng tag nếu cần.

10. Trong phần capabilities, chọn **I acknowledge that AWS CloudFormation might create IAM resources with custom names** và chọn **Next**.

11. Trong **Review and create page**, chọn **Submit**.

![Cài đặt parameter của CloudFormation stack](Hình 2)

---

### Bước 2: Thực thi Automation runbook

1. Sau khi hoàn tất triển khai CloudFormation template, mở Systems Manager console trong cùng region.

2. Chọn **Automation** trong change management tools category ở navigation pane và chọn **Execute runbook**.

3. Trong tab **Owned by me**, chọn **SSMAgentInstall-Orchestrator** và chọn **Next**.

4. Trong phần **Input parameters**, chỉ định các input cần thiết:
   - **AutomationAssumeRole:** Chọn SSMAgentInstall-MAMR-AutomationAdministrationRole
   - **UploadLogsToS3Bucket:** Chọn S3 bucket cho log **ssm-agent-install-automation-logs-<AccountID>**

5. **Nếu nhắm mục tiêu instance bằng tag:**
   - **TargetAccounts** – Nhập account ID hoặc OU nơi unmanaged instance đang chạy
   - **TargetRegions** – Nhập region chứa unmanaged instance
   - **TargetTagKey** – Nhập target tag key dưới dạng tag: (sử dụng InstanceIds để nhắm mục tiêu tất cả instance)
   - **TargetTagValue** – Nhập target tag value (sử dụng * cùng với InstanceIds để nhắm mục tiêu tất cả instance)

6. **Hoặc, nếu bạn đã chạy diagnosis trước đó trong Systems Manager unified console:**
   - Bạn có thể sử dụng output của [Diagnose and Remediate](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/running-diagnosis-execution-ec2.html) để lấy unmanaged instance từ CSV
   - Chọn **Diagnose and remediate** trong navigation pane
   - Chọn **View executions**
   - Chọn một execution và mở rộng phần **Output**
   - Sao chép S3 path từ **AggregateOutput.ExportObjectUri**

7. Chọn **Execute**.

8. Sau khi hoàn tất, một tệp CSV báo cáo tổng hợp sẽ được tạo trong S3 bucket và đường dẫn tệp sẽ được hiển thị trong output summary.

![AWS Systems Manager – Automation Output](Hình 3)

---

## Báo cáo Output

Tệp CSV báo cáo chứa chi tiết và execution log cho mỗi instance:

![Báo cáo CSV chi tiết instance](Hình 4)

Giải pháp này sử dụng CloudFormation StackSets để triển khai các tài nguyên cần thiết đến nhiều AWS account, sau đó chạy Systems Manager Automation runbook để cài đặt SSM agent.

Sau khi hoàn tất, **nó tạo một báo cáo CSV toàn diện chứa chi tiết cấp độ instance và execution log trong S3, hiển thị trực quan tình trạng triển khai trên toàn bộ organization**.

Nếu SSM agent không được cài đặt sau khi sử dụng Automation runbook trên, bạn có thể sử dụng một trong các [phương pháp được giới thiệu như best practice](https://aws-samples.github.io/cloud-operations-best-practices/docs/guides/centralized-operations-management/node-management/managing-ssm-agent) hoặc chuyển sang [cài đặt thủ công](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/manually-install-ssm-agent-linux.html).

---

## Dọn dẹp

Nếu không cần giải pháp nữa, hãy nhớ xóa các tài nguyên AWS đã provision. Điều này giúp tránh các chi phí liên tục.

**Các bước dọn dẹp:**

1. Đi đến AWS CloudFormation console
2. Chọn stack đã tạo cho giải pháp này
3. Chọn **Delete** và click delete khi màn hình xác nhận hiển thị

Quá trình xóa sẽ xóa tất cả tài nguyên được tạo bởi cả CloudFormation template và Automation runbook (bao gồm S3 bucket, tệp log, các IAM role và policy liên quan, và các tài nguyên phụ thuộc khác).

---

## Kết luận

Giải pháp tự động hóa cài đặt agent của AWS Systems Manager này nhằm mục đích **chuyển đổi quy trình thủ công phức tạp thành vận hành hiệu quả**.

Được thiết kế để giảm bớt gánh nặng cài đặt agent thủ công, cho phép các tổ chức tận dụng tối đa tiềm năng của Systems Manager. Các tổ chức có thể tối ưu hóa vận hành cơ sở hạ tầng AWS, đảm bảo tuân thủ bảo mật và thực hiện quản lý tự động.

### Các bước tiếp theo: Tận dụng các tính năng của Systems Manager

Sau khi cài đặt SSM agent trên EC2 instance, hãy tận dụng sâu các tính năng của AWS Systems Manager.

#### 1. [Triển khai tự động vá lỗi](https://aws.amazon.com/awstv/watch/5c64c6a2a17/)
Sử dụng Patch Manager để thiết lập lịch trình vá lỗi tự động định kỳ cho EC2 instance, giữ hệ thống luôn cập nhật và an toàn.

#### 2. [Tăng cường bảo mật với Session Manager](https://www.youtube.com/watch?v=O9DNLecCi90)
Thay thế SSH access bằng Session Manager để thực hiện truy cập instance an toàn và có thể audit mà không cần mở inbound port.

#### 3. [Tối ưu hóa cấu hình với Parameter Store](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/parameter-store-working-with.html)
Lưu trữ an toàn configuration data, secret và các operation parameter khác trong Parameter Store.

### Tận dụng thêm

Đừng dừng lại ở đây, hãy tận dụng [các tính năng đa dạng của AWS Systems Manager](https://aws.amazon.com/systems-manager/features/).

Từ quản lý vá lỗi tự động đến truy cập từ xa an toàn, từ parameter store đến maintenance window, Systems Manager có nhiều tính năng. Bằng cách tận dụng những tính năng này, **bạn có thể tối ưu hóa quản lý cơ sở hạ tầng AWS và nâng cao hiệu quả vận hành.**

---

## Về các tác giả

### Ali Alzand
**Vị trí:** Microsoft Specialist Solutions Architect  
**Tổ chức:** Amazon Web Services

Ali hỗ trợ khách hàng toàn cầu di chuyển, hiện đại hóa và tối ưu hóa workload Microsoft lên cloud. Ali chuyên về vận hành cloud sử dụng các dịch vụ AWS như Systems Manager, Amazon EC2 Windows và EC2 Image Builder.

Ngoài công việc, anh ấy thích khám phá thiên nhiên, thưởng thức BBQ với bạn bè vào cuối tuần và thưởng thức các món ăn đa dạng.

### Justin Thomas
**Vị trí:** Senior Cloud Support Engineer  
**Tổ chức:** AWS Premium Support

Justin Thomas đặc biệt thành thạo về AWS Systems Manager, Linux và shell scripting, với sự quan tâm mạnh mẽ đến việc cung cấp hướng dẫn kỹ thuật cho khách hàng về di chuyển, tối ưu hóa và điều hướng cơ sở hạ tầng cloud.

Ngoài công việc, anh ấy trân trọng thời gian với bạn bè và gia đình, thích thử các món ăn mới và xem phim.

---

**Người dịch:** Partner Sales Solutions Architect Fukui Atsushi

**Bài viết gốc:** [Automate installing AWS Systems Manager agent on unmanaged Amazon EC2 nodes](https://aws.amazon.com/jp/blogs/mt/automate-installing-ssm-agent-on-unmanaged-ec2-instances-in-an-aws-organization/)
