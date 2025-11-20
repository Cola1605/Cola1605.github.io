---
title: "Di chuyển và hiện đại hóa VMware workload với AWS Transform for VMware"
date: 2025-10-15
draft: false
categories: ["AWS", "DevOps & Infrastructure"]
tags: ["AWS-Transform", "VMware", "Cloud-Migration", "Modernization", "Generative-AI", "AWS"]
description: "Khám phá AWS Transform for VMware - giải pháp đột phá giúp di chuyển và hiện đại hóa VMware workload lên AWS Cloud một cách đơn giản và hiệu quả."
---

**Tác giả:** Shigetaka Tazawa  
**Ngày xuất bản:** 15 tháng 10, 2025  
**Ngày xuất bản bản gốc:** 8 tháng 7, 2025  
**Danh mục:** AWS for VMware, AWS Transform, Generative AI

---

## Tóm tắt

Bài viết này là bản dịch của "[Migrate and modernize VMware workloads with AWS Transform for VMware](https://aws.amazon.com/jp/blogs/architecture/migrate-and-modernize-vmware-workloads-with-aws-transform-for-vmware/)" được xuất bản trên [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/) vào ngày 8 tháng 7, 2025.

---

## Giới thiệu

Vào ngày 15 tháng 5, 2025, AWS đã công bố một giải pháp đột phá là [AWS Transform for VMware](https://aws.amazon.com/jp/transform/vmware/). Dịch vụ sáng tạo này đối mặt trực tiếp với những thách thức lâu dài trong di chuyển đám mây và mở ra kỷ nguyên mới của việc di chuyển được đơn giản hóa và hiệu quả lên AWS Cloud. Bằng cách giảm đáng kể công việc thủ công và tăng tốc di chuyển các VMware workload quan trọng, AWS Transform for VMware nhằm mục đích cách mạng hóa cách thức các tổ chức tiếp cận đám mây.

Kể từ [thông báo phát hành chính thức](https://aws.amazon.com/jp/blogs/news/new-capabilities-in-aws-transform-for-vmware/), AWS Transform for VMware đã thu hút sự chú ý trên toàn ngành, và các tổ chức muốn tận dụng khả năng của nó để tăng tốc các nỗ lực di chuyển và hiện đại hóa VMware workload. Khi đi sâu vào các chi tiết của công nghệ sáng tạo này, chúng tôi sẽ tiết lộ rằng AWS Transform for VMware không chỉ đơn giản hóa di chuyển mà còn định hình lại thực tế của việc áp dụng đám mây và chuyển đổi số.

---

## Những thách thức trong di chuyển VMware

Di chuyển workload doanh nghiệp lên đám mây không chỉ là một thách thức kỹ thuật. Đó là về chuyển đổi kinh doanh, độ chính xác, tốc độ và sự gián đoạn tối thiểu. Các quy trình vận hành đã được thiết lập qua nhiều năm thường tạo ra môi trường phức tạp với cấu hình được ghi chép kém, thực hành bảo mật thiếu nhất quán và sự phụ thuộc mạnh vào kiến thức ngầm.

Các nhóm kỹ thuật phải nắm bắt các phụ thuộc ứng dụng phức tạp, điều phối giữa nhiều bên liên quan và duy trì tính liên tục của doanh nghiệp trong khi thực hiện các dự án chuyển đổi này. Thiếu tài liệu toàn diện và thiếu hiểu biết rõ ràng về các phụ thuộc giữa các hệ thống dẫn đến kéo dài thời gian di chuyển thường xuyên và gia tăng rủi ro dự án. Hơn nữa, nhu cầu cân bằng giữa vận hành đang diễn ra và hoạt động di chuyển cũng là một thách thức. Đạt được sự chuyển giao kiến thức thích hợp làm tăng thêm sự phức tạp cho những nỗ lực quan trọng này.

### Các thách thức chính

- Cấu hình được ghi chép kém
- Thực hành bảo mật thiếu nhất quán
- Sự phụ thuộc mạnh vào kiến thức ngầm
- Các phụ thuộc ứng dụng phức tạp
- Điều phối giữa nhiều bên liên quan
- Duy trì tính liên tục kinh doanh
- Thiếu hiểu biết rõ ràng về phụ thuộc giữa các hệ thống
- Kéo dài thời gian di chuyển
- Gia tăng rủi ro dự án
- Cân bằng vận hành đang diễn ra và hoạt động di chuyển
- Chuyển giao kiến thức thích hợp

---

## Tổng quan về giải pháp

Hãy xem trong sơ đồ dưới đây về cách AWS Transform for VMware đơn giản hóa discovery ứng dụng, tự động hóa chuyển đổi mạng và điều phối di chuyển phức tạp thông qua kiến trúc toàn diện.

Để hiểu cách các tính năng này hoạt động cùng nhau, hãy xem xét từng thành phần của kiến trúc.

![Component architecture of AWS Transform for VMware](Sơ đồ kiến trúc)

---

## Discovery và Assessment được tối ưu hóa

Hành trình này bắt đầu bằng discovery và assessment triệt để môi trường VMware (1).

### Các phương pháp Discovery

[AWS Transform for VMware](https://aws.amazon.com/jp/transform/vmware/) (4) hỗ trợ nhiều phương pháp discovery.

#### 1. RVTools
Bạn có thể sử dụng [RVTools](https://www.dell.com/en-us/shop/vmware/sl/rvtools) để thu thập VMware inventory.

#### 2. Import/Export for NSX
Đối với khách hàng chạy VMware NSX, có tùy chọn tính năng [import/export](https://aws.amazon.com/jp/blogs/news/exporting-network-configuration-data-with-import-export-for-nsx/).

#### 3. AWS Application Discovery Service
[AWS Application Discovery Service](https://aws.amazon.com/jp/application-discovery/) cung cấp cả hai tùy chọn discovery dựa trên agent và agentless (2) để thu thập dữ liệu và phụ thuộc cho di chuyển.

### Thu thập và lưu trữ dữ liệu

Inventory discovery (5) thu thập dữ liệu quan trọng từ môi trường nguồn và lưu trữ an toàn trong [Amazon Simple Storage Service](https://aws.amazon.com/jp/s3/) (Amazon S3) bucket (12) nằm trong AWS Migration Discovery account (7).

Dữ liệu này trở thành nền tảng cho kế hoạch di chuyển dựa trên thông tin đầy đủ và được xử lý thêm bởi AWS Application Discovery Service (15) trong AWS Migration Planning account.

AWS Transform phối hợp với các dịch vụ này và **cung cấp một nơi duy nhất để theo dõi tiến trình di chuyển và thu thập server inventory và dữ liệu phụ thuộc**. Điều này rất quan trọng cho việc nhóm ứng dụng thích hợp và thành công của wave planning.

---

## Chuyển đổi mạng thông minh và Wave Planning

Với sự hiểu biết toàn diện về môi trường, AWS Transform for VMware chuyển sang giai đoạn quan trọng tiếp theo.

### Chuyển đổi mạng

Khả năng chuyển đổi mạng (19) tự động hóa việc tạo [AWS CloudFormation template](https://aws.amazon.com/jp/cloudformation/) (13, 26) để thiết lập cơ sở hạ tầng mạng đích.

Các template này đảm bảo rằng môi trường đám mây phản ánh chặt chẽ cấu hình nguồn và đơn giản hóa việc thiết lập di chuyển.

### Wave Planning

Mặt khác, khả năng wave planning (6) sử dụng [Graph Neural Network](https://en.wikipedia.org/wiki/Graph_neural_network) tiên tiến để phân tích các phụ thuộc ứng dụng và lập kế hoạch wave di chuyển tối ưu.

Điều này **giảm thiểu phân tích phụ thuộc portfolio và ứng dụng phức tạp, cung cấp wave plan sẵn sàng di chuyển và thực hiện di chuyển mượt mà**.

---

## Bảo mật và tuân thủ được tăng cường

Bảo mật là ưu tiên hàng đầu trong suốt quy trình di chuyển.

### Mã hóa

[AWS Key Management Service](https://aws.amazon.com/jp/kms/) (AWS KMS) (8, 16, 26) cung cấp mã hóa mạnh mẽ cho:

- Dữ liệu được lưu trữ
- Lịch sử hội thoại
- Artifacts

Theo mặc định, AWS managed key được sử dụng và có tùy chọn sử dụng [customer managed key](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/concepts.html) để kiểm soát bổ sung.

### Quản lý và giám sát

#### AWS Organizations
[AWS Organizations](https://aws.amazon.com/jp/organizations/) (9) cho phép quản lý tập trung trên nhiều AWS account.

#### AWS CloudTrail
[AWS CloudTrail](https://aws.amazon.com/jp/cloudtrail/) (14, 26) capture và ghi lại API activity để có audit trail đầy đủ.

#### AWS IAM
Kiểm soát truy cập được quản lý thông qua [AWS Identity and Access Management](https://aws.amazon.com/jp/iam/) (IAM) (26), cung cấp quản lý truy cập tập trung trên tất cả các AWS account.

#### Amazon CloudWatch
[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) (10, 26) liên tục giám sát activity của AWS Transform service, sử dụng tài nguyên và các operational metric trong management account, cung cấp khả năng hiển thị và kiểm soát hoàn toàn trong suốt quy trình di chuyển.

#### AWS Identity Center
[AWS Identity Center](https://aws.amazon.com/jp/iam/identity-center/) (11) tăng cường bảo mật hơn nữa bằng cách cung cấp quản lý truy cập tập trung cho tất cả các AWS account tham gia vào di chuyển.

---

## Thực thi di chuyển có tổ chức

Khi đến lúc thực hiện di chuyển, AWS Transform phối hợp với nhiều AWS tool và service khác nhau (20) để điều phối di chuyển end-to-end.

### AWS Application Migration Service

[AWS Application Migration Service](https://aws.amazon.com/jp/application-migration-service/) (25) sao chép server từ môi trường nguồn đến [Amazon Elastic Compute Cloud](https://aws.amazon.com/jp/ec2/) (Amazon EC2) instance (21) trong AWS Migration Target Account (18) dựa trên wave và grouping được lập kế hoạch cẩn thận.

### Replication và Storage

AWS replication agent (2) phối hợp với AWS Application Migration Service để thực hiện truyền dữ liệu hiệu quả và đáng tin cậy.

[Amazon Elastic Block Store](https://aws.amazon.com/jp/ebs/) (Amazon EBS) (21) cung cấp storage cần thiết cho các virtual machine đã di chuyển, thực hiện hiệu suất và khả năng mở rộng tối ưu.

---

## Cấu hình mạng linh hoạt

AWS Transform for VMware cung cấp hai network model để đáp ứng các yêu cầu khác nhau.

### 1. Hub and Spoke Model

**Tổng quan:**  
[AWS Transit Gateway](https://aws.amazon.com/jp/transit-gateway/) (23) kết nối Amazon Virtual Private Clouds (Amazon VPC) thông qua central hub VPC với shared [NAT gateway](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html).

**Use case:**  
Model này tối ưu cho quản lý tập trung và shared service.

**Lợi ích:**  
NAT gateway tập trung của hub VPC có thể được cung cấp cho nhiều spoke VPC, thực hiện tối ưu hóa chi phí và đơn giản hóa quản lý.

### 2. Isolated Model

**Tổng quan:**  
Mỗi VPC hoạt động độc lập mà không có kết nối được thiết lập.

**Use case:**  
Cách tiếp cận này được thiết kế cho khách hàng có cơ sở hạ tầng mạng AWS hiện có, cho phép kết nối thủ công VPC mới với network topology hiện có.

**Yêu cầu:**  
Cần provision NAT gateway chuyên dụng trong mỗi VPC cần internet access.

### Đặc điểm chung

VPC (22) được tạo bởi AWS Transform khớp với network segment on-premise, cung cấp di chuyển liền mạch.

NAT gateway (24) cung cấp outbound internet access cho private subnet, cho phép kết nối cần thiết trong khi duy trì bảo mật.

⚠️ **Quan trọng:** Trong tất cả các trường hợp, cần cấu hình route table để cho phép egress traffic đi qua NAT gateway.

Để biết các bước thiết lập đầy đủ và yêu cầu, vui lòng tham khảo [AWS Transform User Guide](https://docs.aws.amazon.com/ja_jp/transform/latest/userguide/what-is-service.html).

---

## Các cân nhắc bổ sung

### Khả năng sẵn có toàn cầu

Discovery workspace của AWS Transform for VMware có sẵn trên toàn thế giới (3). Để biết thông tin mới nhất về các region được hỗ trợ, vui lòng tham khảo [AWS Services by Region](https://aws.amazon.com/jp/about-aws/global-infrastructure/regional-product-services/) (17).

### Lưu trữ migration artifact

Trong suốt quy trình di chuyển, các migration artifact chính của cả AWS Migration Discovery account và AWS Migration Target account đều được lưu trữ trong Amazon S3 bucket (12, 26).

**Các artifact được lưu trữ:**

- Inventory data
- Dependency mapping
- Wave plan
- Application grouping
- Infrastructure as Code templates (AWS CloudFormation và AWS Cloud Development Kit)
- Migration plan theo wave

---

## Lợi ích cho khách hàng

AWS Transform for VMware cung cấp các lợi ích quan trọng:

### 1. Giảm công việc thủ công
Tự động hóa giảm thiểu lỗi của con người và giải phóng tài nguyên IT quý giá.

### 2. Tăng độ chính xác
Có thể tận dụng dependency mapping và wave plan được điều khiển bởi AI để thiết lập chiến lược di chuyển tối ưu.

### 3. Tăng cường hợp tác
Quản lý tập trung và tracking cải thiện sự phối hợp giữa các nhóm.

### 4. Tối ưu hóa chi phí
Tận dụng right-sizing instance và mô hình giá linh hoạt của AWS để thực hiện giảm chi phí ngay lập tức và dài hạn.

### 5. Tính năng tương lai
Mở ra cơ hội hiện đại hóa và đổi mới liên tục trên AWS cloud service.

### Bảo mật và tuân thủ

Khi triển khai giải pháp di chuyển, luôn xác nhận và tuân thủ yêu cầu bảo mật của tổ chức, nghĩa vụ tuân thủ và [AWS Security Best Practices](https://aws.amazon.com/jp/architecture/security-identity-compliance/).

Để biết hướng dẫn bảo mật chi tiết, vui lòng tham khảo [AWS Security Documentation](https://docs.aws.amazon.com/ja_jp/security/) và nhóm bảo mật của tổ chức.

---

## Giá cả

AWS Transform tăng tốc các dự án di chuyển và hiện đại hóa cho VMware workload với khả năng agentic AI.

**Hiện tại, chúng tôi cung cấp các tính năng chính bao gồm assessment và transformation miễn phí* cho khách hàng AWS.**

Điều này cho phép bạn tăng tốc hành trình di chuyển và hiện đại hóa mà không có chi phí trả trước.

_*Miễn phí đề cập đến chính AWS Transform service. Phí tiêu chuẩn áp dụng cho các AWS service và tài nguyên được sử dụng trong quá trình di chuyển._

---

## Kết luận và các bước tiếp theo

AWS Transform for VMware trao quyền cho các tổ chức để vượt qua sự phức tạp của di chuyển và hiện đại hóa VMware. Bằng cách cung cấp một cách tiếp cận toàn diện và tự động, nó cho phép di chuyển nhanh hơn và đáng tin cậy hơn lên AWS Cloud.

Dịch vụ mới này cung cấp các công cụ và khả năng cần thiết để tiến lên với tự tin trong môi trường VMware đang thay đổi.

### Các thách thức chính mà kiến trúc giải quyết

Kiến trúc mà chúng ta đã khám phá cho thấy cách AWS Transform for VMware giải quyết các thách thức chính sau:

1. Tối ưu hóa quy trình discovery và assessment
2. Tự động hóa chuyển đổi mạng và intelligent wave planning
3. Điều phối thực thi di chuyển với sự gián đoạn tối thiểu
4. Cải thiện bảo mật và tuân thủ trong suốt di chuyển
5. Cung cấp quản lý và giám sát tập trung
6. Cung cấp các tùy chọn mạng linh hoạt có thể đáp ứng nhiều yêu cầu đa dạng

### Bắt đầu ngay hôm nay

Bạn đã sẵn sàng tăng tốc hành trình di chuyển VMware của mình?

- Truy cập trang sản phẩm [AWS Transform for VMware](https://aws.amazon.com/jp/transform/vmware/) để xem thông tin chi tiết và bắt đầu ngay hôm nay.
- Xem [interactive demo](https://aws.storylane.io/share/qye0se68an9i?utm_source=pdp) của AWS Transform for VMware.
- Nếu xuất cấu hình mạng từ môi trường VMware NSX, vui lòng tham khảo [Exporting network configuration data with Import/Export for NSX](https://aws.amazon.com/jp/blogs/news/exporting-network-configuration-data-with-import-export-for-nsx/).

Nhóm chuyên gia của chúng tôi sẽ hướng dẫn các nỗ lực di chuyển và hiện đại hóa của bạn và giúp bạn tận dụng tối đa tiềm năng của AWS Cloud.

---

## Về các tác giả

### Kiran Reid
**Vị trí:** Senior Generative AI và Machine Learning Specialist  
**Tổ chức:** AWS

Kiran Reid là Senior Generative AI và Machine Learning Specialist của AWS. Với chuyên môn về công nghệ trí tuệ nhân tạo (AI), Kiran phối hợp chặt chẽ với các đối tác và khách hàng của AWS để hỗ trợ di chuyển và hiện đại hóa các workload tận dụng AI.

### Ramu Akula
**Vị trí:** Principal Portfolio Manager và Telco Network Transformation specialist  
**Tổ chức:** AWS

Ramu Akula là Principal Portfolio Manager và Telco Network Transformation specialist của AWS. Tận dụng hơn 24 năm kinh nghiệm trong lĩnh vực IT, ông hỗ trợ khách hàng di chuyển và hiện đại hóa workload lên AWS.

### Patrick Kremer
**Vị trí:** Senior Specialist Solutions Architect  
**Tổ chức:** AWS  
**Gia nhập:** 2022

Patrick Kremer là Senior Specialist Solutions Architect chuyên về di chuyển và hiện đại hóa cơ sở hạ tầng. Patrick gia nhập AWS năm 2022, tận dụng 20 năm kinh nghiệm VMware để hỗ trợ khách hàng di chuyển lên các giải pháp AWS.

Ông là AWS Solutions Architect Professional được chứng nhận với niềm đam mê về giáo dục và hoạt động blog.

### Mark Jaggers
**Vị trí:** Outbound Product Management  
**Tổ chức:** AWS

Mark Jaggers là Outbound Product Management của AWS, chịu trách nhiệm chiến lược go-to-market cho các giải pháp di chuyển đám mây và disaster recovery.

Mark làm việc trong cả hai service team AWS Elastic Disaster Recovery và AWS Application Migration Service, hỗ trợ khách hàng hiện đại hóa cơ sở hạ tầng IT quy mô lớn.

---

**Người dịch:** Solutions Architect Tazawa

**Bài viết gốc:** [Migrate and modernize VMware workloads with AWS Transform for VMware](https://aws.amazon.com/jp/blogs/architecture/migrate-and-modernize-vmware-workloads-with-aws-transform-for-vmware/)
