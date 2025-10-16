---
title: "Bắt đầu xây dựng môi trường Cloud với Terraform"
date: 2025-10-15
draft: false
categories: ["Cloud", "Infrastructure", "DevOps"]
tags: ["Terraform", "AWS", "GCP", "IaC", "Infrastructure-as-Code", "Cloud-Infrastructure"]
description: "Hướng dẫn chi tiết cho người mới bắt đầu sử dụng Terraform để xây dựng và quản lý môi trường cloud infrastructure trên AWS và GCP."
---

**Tác giả:** @Natsuhi-aruku (Natsuhi Aruku)  
**Tổ chức:** GMOコネクト株式会社  
**Ngày đăng:** 15 tháng 10, 2025  
**Tags:** AWS, Cloud, 初心者向け, Terraform  
**Nguồn:** https://qiita.com/Natsuhi-aruku/items/ab32e4bd91c02f0e8e16

---

## Giới thiệu

Do nhu cầu xây dựng môi trường cloud trong công việc, tôi đã nghiên cứu về **Terraform**, một công cụ Infrastructure as Code (IaC). Có thể đây là bài viết thứ N về chủ đề này, nhưng tôi đã tổng hợp lại phương pháp xây dựng môi trường cơ bản trên AWS và GCP sao cho người mới bắt đầu sử dụng Terraform cũng có thể hiểu được.

### Đối tượng của bài viết này

- Muốn tự động hóa việc xây dựng cloud infrastructure
- Muốn thoát khỏi việc quản lý tài nguyên bằng thủ công
- Muốn biết cách xây dựng trên cả AWS và GCP

Tôi sẽ chia sẻ nội dung đã nghiên cứu thực tế cho những người phù hợp với các điều kiện trên.

---

## Terraform là gì?

Terraform là công cụ IaC mã nguồn mở được phát triển bởi HashiCorp, cho phép định nghĩa và quản lý infrastructure bằng **code**.

**IaC là gì?**  
Là viết tắt của Infrastructure as Code (Infrastructure dưới dạng code), là phương pháp mô tả và quản lý các cấu hình infrastructure như server và network bằng code. Giúp bạn thoát khỏi các thao tác thủ công click chuột.

### Tại sao chọn Terraform?

Có các đối thủ cạnh tranh như AWS CDK (chuyên dụng cho AWS) và Pulumi (hỗ trợ nhiều ngôn ngữ), nhưng vì công ty chúng tôi không chỉ sử dụng AWS mà còn có các dự án sử dụng GCP, nên chúng tôi đã chọn Terraform vì **có thể đối ứng với multi-cloud**.

| Đặc điểm | Lợi ích |
|----------|---------|
| **Hỗ trợ Multi-cloud** | Quản lý thống nhất nhiều cloud như AWS, GCP, Azure |
| **Mô tả declarative** | Chỉ cần mô tả "muốn tạo cái gì", Terraform sẽ tự động xử lý "cách tạo" |
| **Quản lý trạng thái** | Tự động theo dõi trạng thái hiện tại của infrastructure và phát hiện sự khác biệt khi thay đổi |
| **Hiển thị thay đổi** | Có thể xem trước nội dung thay đổi trước khi áp dụng, ngăn chặn sự cố |
| **Tính tái tạo** | Có thể tạo cùng môi trường nhiều lần từ cùng một code |

---

## Chuẩn bị trước

### 1. Cài đặt Terraform

#### macOS

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform --version
```

#### Windows

1. Tải xuống từ [Terraform官方サイト](https://www.terraform.io/downloads)
2. Giải nén ZIP và thêm vào PATH
3. Xác nhận trong Command Prompt hoặc PowerShell:

```bash
terraform --version
```

**Ví dụ kết quả thực thi:**

```
Terraform v1.13.3
```

Nếu hiển thị như vậy thì cài đặt thành công.

### 2. Chuẩn bị Editor

Khi sử dụng VS Code, khuyến nghị các extension sau:

- **HashiCorp Terraform** (extension chính thức)
  - **Intellisense**: Tính năng hoàn thành code
  - **Syntax highlighting**: Tô màu để dễ đọc
  - **Code navigation**: Có thể jump đến định nghĩa gốc

---

## Xây dựng môi trường AWS

Chúng ta sẽ xây dựng cấu trúc sau:

- **VPC**: Môi trường network độc lập (network ảo chuyên dụng cho công ty)
- **Public Subnet**: Vùng có thể truy cập từ Internet
- **EC2 Instance**: Máy ảo cho web server
- **Security Group**: Cấu hình firewall (quy tắc cho phép/từ chối giao tiếp)

### 1. Thiết lập AWS CLI

**AWS CLI là gì?**  
Là công cụ để vận hành AWS từ command line. Cần thiết khi Terraform giao tiếp với AWS ở phía sau.

```bash
# Cài đặt (macOS)
brew install awscli

# Cấu hình xác thực
aws configure
```

**Các mục cấu hình:**

| Mục | Mô tả | Ví dụ |
|-----|-------|-------|
| Access Key ID | Access key của AWS account (giống như username) | AKIAIOSFODNN7EXAMPLE |
| Secret Access Key | Secret key (giống như password) | (Ẩn vì là thông tin bí mật) |
| Default region | Region sử dụng mặc định (vị trí data center) | ap-northeast-1 (Tokyo) |
| Default output format | Định dạng output của kết quả command | json |

**Cách lấy Access Key:**

1. Đăng nhập vào AWS Management Console
2. Click vào tên user ở góc trên bên phải → "Security credentials"
3. Trong phần "Access keys", chọn "Create access key"
4. Ghi chép key hiển thị (không thể hiển thị lại nên chú ý!)

> ⚠️ **Chú ý bảo mật**: Vui lòng quản lý Access Key một cách nghiêm ngặt. Nếu bị rò rỉ, có các rủi ro sau:
> - Bị tính phí cao do sử dụng trái phép (có trường hợp thiệt hại hàng triệu yên)
> - Truy cập trái phép vào tài nguyên
> - Rò rỉ dữ liệu

### 2. Cấu trúc thư mục

**Tại sao phân chia file?**  
Bằng cách chia code theo vai trò, dễ quản lý hơn và tính bảo trì được cải thiện.

```
terraform-aws/
├── main.tf           # Định nghĩa resource (mô tả cấu hình VPC, EC2, v.v.)
├── variables.tf      # Định nghĩa biến (định nghĩa các giá trị sử dụng lặp lại dưới dạng biến)
├── outputs.tf        # Định nghĩa giá trị output (hiển thị IP address của resource đã tạo, v.v.)
└── terraform.tfvars  # Giá trị biến (mô tả giá trị thực tế, khuyến nghị .gitignore vì chứa thông tin bí mật)
```

### 3. Ví dụ code

#### main.tf

**HCL (HashiCorp Configuration Language) là gì?**  
Là ngôn ngữ cấu hình chuyên dụng sử dụng trong Terraform. Đặc trưng là cú pháp dễ đọc giống JSON.

```hcl
# Chỉ định version Terraform và provider
# Provider: Plugin để giao tiếp với cloud service như AWS, GCP
terraform {
  required_version = ">= 1.5.0"  # Chỉ định version của Terraform
  required_providers {
    aws = {
      source  = "hashicorp/aws"  # Nguồn cung cấp provider
      version = "~> 5.0"         # Version của provider (sử dụng series 5.x)
    }
  }
}

# Cấu hình AWS provider
provider "aws" {
  region = var.aws_region  # Tham chiếu biến đã định nghĩa trong variables.tf
}

# VPC (Virtual Private Cloud)
# Không gian network ảo trong AWS account
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"  # Phạm vi IP address (65,536 địa chỉ IP)
  enable_dns_hostnames = true           # Bật DNS hostname
  enable_dns_support   = true           # Bật DNS resolution

  tags = {
    Name = "terraform-vpc"  # Tag để quản lý (tên)
  }
}

# Public Subnet
# Một phần vùng trong VPC, là network có thể truy cập từ Internet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id             # Tham chiếu ID của VPC đã tạo ở trên
  cidr_block              = "10.0.1.0/24"               # 256 địa chỉ IP
  availability_zone       = "${var.aws_region}a"        # Availability Zone (data center vật lý)
  map_public_ip_on_launch = true                        # Tự động gán public IP khi khởi động instance

  tags = {
    Name = "terraform-public-subnet"
  }
}

# Internet Gateway
# Gate kết nối VPC với Internet
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "terraform-igw"
  }
}

# Route Table
# Định nghĩa đường dẫn của network traffic
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"                    # Tất cả đích (toàn bộ Internet)
    gateway_id = aws_internet_gateway.main.id   # Giao tiếp qua Internet Gateway
  }

  tags = {
    Name = "terraform-public-rt"
  }
}

# Liên kết Route Table và Subnet
# Áp dụng Route Table vào Subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
# Định nghĩa rule firewall (cho phép giao tiếp từ port nào)
resource "aws_security_group" "web" {
  name        = "terraform-web-sg"
  description = "Security group for web server"
  vpc_id      = aws_vpc.main.id

  # Inbound rule (giao tiếp từ bên ngoài): HTTP
  ingress {
    from_port   = 80           # Port bắt đầu
    to_port     = 80           # Port kết thúc
    protocol    = "tcp"        # Protocol
    cidr_blocks = ["0.0.0.0/0"]  # Cho phép từ tất cả địa chỉ IP
    description = "Allow HTTP"
  }

  # Inbound rule: SSH (để remote connect vào server)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Khuyến nghị giới hạn chỉ IP công ty trong môi trường production
    description = "Allow SSH"
  }

  # Outbound rule (giao tiếp từ server ra ngoài)
  egress {
    from_port   = 0            # Tất cả port
    to_port     = 0
    protocol    = "-1"         # Tất cả protocol
    cidr_blocks = ["0.0.0.0/0"]  # Cho phép đến tất cả đích
  }

  tags = {
    Name = "terraform-web-sg"
  }
}

# EC2 Instance (virtual server)
resource "aws_instance" "web" {
  ami                    = var.ami_id           # Amazon Machine Image (template của OS)
  instance_type          = "t2.micro"           # Instance type (spec của CPU・memory)
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  tags = {
    Name = "terraform-web-server"
  }
}
```

#### variables.tf

**Lợi ích của việc sử dụng biến:**
- Khi sử dụng cùng giá trị ở nhiều nơi, chỉ cần thay đổi một chỗ thì sẽ phản ánh toàn bộ
- Dễ dàng chuyển đổi giá trị theo môi trường (development/production)

```hcl
variable "aws_region" {
  description = "AWS region"  # Mô tả biến
  type        = string        # Kiểu dữ liệu (string)
  default     = "ap-northeast-1"  # Giá trị mặc định (Tokyo region)
}

variable "ami_id" {
  description = "AMI ID for EC2"
  type        = string
  default     = "ami-0d52744d6551d851e"  # Amazon Linux 2023 (cho Tokyo region)
}
```

**Region là gì?**  
Là vị trí địa lý của data center AWS. Tại Nhật Bản có Tokyo (ap-northeast-1) và Osaka (ap-northeast-3).

> 📌 **Điểm quan trọng**: AMI ID khác nhau theo region.  
> Vui lòng xác nhận AMI ID mới nhất tại [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html) hoặc [AWS公式ドキュメント](https://aws.amazon.com/amazon-linux-ami/).

#### outputs.tf

**Output value là gì?**  
Là thông tin hiển thị sau khi thực thi terraform apply. Output các thông tin cần thiết sau này như địa chỉ IP của resource đã tạo.

```hcl
output "instance_public_ip" {
  description = "Public IP của EC2"
  value       = aws_instance.web.public_ip
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}
```

### 4. Các bước thực thi

**Thực thi Terraform gồm 3 bước:**
1. `init` (khởi tạo)
2. `plan` (xác nhận kế hoạch thực thi)
3. `apply` (thực sự tạo)

```bash
# Bước 1: Khởi tạo (chỉ thực thi 1 lần đầu tiên)
terraform init
```

**Điều gì xảy ra?**
- Thư mục `.terraform` được tạo
- Provider cần thiết (AWS plugin) được download
- Chuẩn bị quản lý trạng thái

```bash
# Bước 2: Xác nhận execution plan (bắt buộc!)
terraform plan
```

**Điều gì được hiển thị?**
- `+`: Resource được tạo mới
- `-`: Resource bị xóa
- `~`: Resource được thay đổi

**Ví dụ thực thi:**

```
Terraform will perform the following actions:

  # aws_vpc.main will be created
  + resource "aws_vpc" "main" {
      + cidr_block = "10.0.0.0/16"
      ...
    }

Plan: 7 to add, 0 to change, 0 to destroy.
```

**Nhất định phải xác nhận** output này trước khi tiến hành bước tiếp theo. Có thể ngăn chặn sự cố resource không mong muốn bị xóa.

```bash
# Bước 3: Tạo resource
terraform apply
```

Confirmation prompt sẽ hiển thị:

```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

Xác nhận nội dung và nhập `yes` (chỉ `y` thôi thì không được).

**Tạo mất vài phút**. Nếu hiển thị như sau thì thành công:

```
Apply complete! Resources: 7 added, 0 changed, 0 destroyed.

Outputs:

instance_public_ip = "54.XXX.XXX.XXX"
vpc_id = "vpc-0a1b2c3d4e5f6g7h8"
```

```bash
# Bước 4: Xác nhận trạng thái
terraform show
```

Thông tin chi tiết của resource đã tạo sẽ được hiển thị.

**Hãy thử xác nhận bằng browser:**
1. Đăng nhập vào AWS Management Console
2. Mở EC2 dashboard
3. Xác nhận `terraform-web-server` hiển thị trong "Instances"
4. Mở public IP đã output trong browser để xác nhận truy cập

```bash
# Bước 5: Xóa resource (nhất định phải thực thi để giảm chi phí)
terraform destroy
```

Nhập `yes` tại confirmation prompt thì tất cả resource đã tạo sẽ bị xóa.

> ⚠️ **Quan trọng**: Nhất định phải destroy sau khi kiểm chứng. Nếu để quên sẽ bị tính phí liên tục.

---

## Xây dựng môi trường GCP

Cách suy nghĩ cơ bản giống AWS, nhưng tên service và cấu hình khác nhau.

### 1. Bật billing là bắt buộc

```
Trên GCP, ngay cả trong free trial, cũng cần bật billing để sử dụng hầu hết các resource (Compute Engine, VPC, v.v.). 
Nếu không bật billing, sẽ xảy ra lỗi sau:
```

```
Error: Error creating instance: googleapi: Error 403: Compute Engine API has not been used in project [PROJECT_ID] before or it is disabled.
```

#### Các bước bật billing

1. Truy cập Google Cloud Console
2. Chọn "Billing" từ navigation menu ở góc trên bên trái
3. Click "Link billing account"
4. Đăng ký thông tin credit card (trong free trial, các service đủ điều kiện sẽ không tự động tính phí)

### 2. Sử dụng Free Trial

- $300 credit được cấp khi đăng ký lần đầu
- Có hiệu lực 90 ngày
- Không tự động tính phí sau khi hết credit

### 3. Free tier (Always Free)

Sau khi kết thúc trial, các resource sau có thể sử dụng miễn phí vĩnh viễn:
- 1 e2-micro instance (Compute Engine)
- 5GB/tháng Standard Storage (Cloud Storage)
- 1TB query processing (BigQuery)
- v.v.

Xem chi tiết tại [Google Cloudの無料トライアルと無料枠付きのプロダクトについて（Google公式）](https://cloud.google.com/free?hl=ja)

---

Dưới đây là các bước cụ thể.

### 1. Thiết lập Google Cloud SDK

**Google Cloud SDK là gì?**  
Là bộ công cụ để vận hành GCP từ command line.

```bash
# Cài đặt (macOS)
brew install --cask google-cloud-sdk

# Khởi tạo (browser mở và xác thực bằng Google account)
gcloud init

# Cài đặt application default authentication
gcloud auth application-default login
```

### 2. Chuẩn bị Project

**Project của GCP là gì?**  
Là đơn vị logic để quản lý resource. Tương đương AWS account.

```bash
# Tạo project
# your-project-id cần là duy nhất (không trùng toàn thế giới)
gcloud projects create your-project-id --name="My Terraform Project"

# Cài đặt để sử dụng project đã tạo
gcloud config set project your-project-id

# Bật API cần thiết
# Compute Engine API: Cần thiết để tạo virtual machine
gcloud services enable compute.googleapis.com

# Resource Manager API: Cần thiết để quản lý project
gcloud services enable cloudresourcemanager.googleapis.com
```

> 💡 **Bật API là gì?**  
> Trên GCP, cần bật API trước khi sử dụng mỗi service. Chỉ cần thực thi lần đầu là OK.

### 3. Tạo Service Account

**Service Account là gì?**  
Là account chuyên dụng để application (lần này là Terraform) vận hành GCP. Khác với Google account dành cho con người.

```bash
# Tạo service account
gcloud iam service-accounts create terraform \
  --display-name="Terraform Service Account"

# Cấp quyền (trong môi trường production, giới hạn quyền tối thiểu)
# roles/editor: Có thể tạo・thay đổi・xóa hầu hết resource trong project
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:terraform@your-project-id.iam.gserviceaccount.com" \
  --role="roles/editor"

# Tạo authentication key (download dưới dạng file JSON)
gcloud iam service-accounts keys create terraform-key.json \
  --iam-account=terraform@your-project-id.iam.gserviceaccount.com
```

**Xác nhận sau khi thực thi:**  
`terraform-key.json` được tạo trong thư mục hiện tại. Đọc file này từ Terraform.

> ⚠️ **Chú ý bảo mật**: Thêm `terraform-key.json` vào `.gitignore` và tuyệt đối không push lên GitHub.

### 4. Ví dụ code

#### main.tf (GCP version)

```hcl
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  credentials = file("terraform-key.json")  # Đọc service account key
  project     = var.project_id
  region      = var.region
}

# VPC network
resource "google_compute_network" "vpc" {
  name                    = "terraform-vpc"
  auto_create_subnetworks = false  # Tạo subnet thủ công
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "terraform-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
  private_ip_google_access = true  # Cho phép kết nối private đến Google API
}

# Firewall rule: SSH
resource "google_compute_firewall" "ssh" {
  name    = "terraform-allow-ssh"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]  # Khuyến nghị giới hạn trong môi trường production
  target_tags   = ["ssh"]         # Áp dụng cho instance có tag này
}

# Firewall rule: HTTP/HTTPS
resource "google_compute_firewall" "http" {
  name    = "terraform-allow-http"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http"]
}

# GCE instance (virtual machine)
resource "google_compute_instance" "web" {
  name         = "terraform-web-server"
  machine_type = "e2-micro"  # Machine type trong free tier
  zone         = "${var.region}-a"  # Zone (data center vật lý trong region)

  # Cấu hình boot disk
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"  # Debian 11 OS image
      size  = 10                        # Disk size (GB)
      type  = "pd-standard"             # Standard persistent disk
    }
  }

  # Cấu hình network interface
  network_interface {
    subnetwork = google_compute_subnetwork.subnet.id
    
    # Gán external IP address
    access_config {
      // Block rỗng để tự động gán (ephemeral IP)
    }
  }

  # Network tag (sử dụng trong firewall rule)
  tags = ["ssh", "http"]

  # Script thực thi khi khởi động (cài đặt Nginx)
  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
    echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
  EOF

  # Cấu hình service account
  service_account {
    scopes = ["cloud-platform"]  # Quyền truy cập tất cả Google Cloud API
  }
}
```

#### variables.tf (GCP version)

```hcl
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-northeast1"  # Tokyo region
}
```

**Danh sách GCP region:**
- `asia-northeast1`: Tokyo
- `asia-northeast2`: Osaka
- `us-central1`: Iowa (America)

#### outputs.tf (GCP version)

**⚠️ Sửa lỗi: Cách viết đúng**

```hcl
output "instance_external_ip" {
  description = "External IP của GCE"
  # Cách viết đúng (truy cập array)
  value = google_compute_instance.web.network_interface[0].access_config[0].nat_ip
}

output "vpc_name" {
  description = "VPC name"
  value = google_compute_network.vpc.name
}

output "ssh_command" {
  description = "SSH connection command"
  value = "gcloud compute ssh ${google_compute_instance.web.name} --zone=${google_compute_instance.web.zone}"
}
```

**Lỗi trong mô tả gốc:**

```hcl
# ❌ Sai (không thể truy cập array bằng dot notation)
value = google_compute_instance.web.network_interface.0.access_config.0.nat_ip

# ✅ Đúng (cần chỉ định array index)
value = google_compute_instance.web.network_interface[0].access_config[0].nat_ip
```

#### terraform.tfvars

```hcl
project_id = "your-project-id"  # Thay thế bằng project ID thực tế
region     = "asia-northeast1"
```

### 5. Các bước thực thi

Cùng luồng với AWS:

```bash
terraform init
terraform plan  # Nhất định phải xác nhận!
terraform apply  # Nhập yes
terraform show   # Xác nhận resource đã tạo
terraform destroy  # Xóa
```

**Xác nhận trên GCP console:**
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project
3. Xác nhận tại "Compute Engine" → "VM instances"
4. Mở external IP trong browser và xác nhận "Hello from Terraform!" hiển thị

---

## Best Practices

### Security

#### 1. Quản lý thông tin xác thực

**Nhất định phải thêm vào .gitignore:**

```gitignore
# Terraform variable file (có thể chứa thông tin bí mật)
*.tfvars

# Terraform state file (chứa resource ID, v.v.)
*.tfstate
*.tfstate.backup

# Terraform plugin directory
.terraform/

# GCP service account key
terraform-key.json

# AWS key pair
*.pem
```

**Tại sao thêm vào .gitignore?**  
Các file này chứa thông tin bí mật sau:
- AWS access key
- GCP service account key
- Resource ID và internal IP
- Database password

Nếu vô tình push lên GitHub, có khả năng bị tự động scan và lạm dụng trong vài phút.

#### 2. Nguyên tắc quyền tối thiểu

Trong môi trường production, chỉ cấp quyền tối thiểu cần thiết. Quan trọng như đối sách sự cố rò rỉ và sai sót cấu hình.

**Tại sao quyền tối thiểu quan trọng?**
- Ngay cả khi key bị rò rỉ, giảm thiểu thiệt hại
- Ngăn chặn xóa resource quan trọng do thao tác sai
- Tránh chỉ trích trong security audit

**Ví dụ AWS IAM policy (chỉ có thể vận hành EC2 và VPC):**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "ec2:*",
      "vpc:*"
    ],
    "Resource": "*"
  }]
}
```

**❌ Ví dụ nên tránh:**

```json
{
  "Effect": "Allow",
  "Action": "*",      # Cho phép tất cả thao tác (nguy hiểm!)
  "Resource": "*"
}
```

#### 3. Nghiêm ngặt hóa Firewall

**Môi trường development**: `0.0.0.0/0` (có thể kết nối từ tất cả IP) cũng OK  
**Môi trường production**: Bắt buộc phải giới hạn IP cụ thể

```hcl
# Ví dụ security group cho môi trường production
ingress {
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["203.0.113.0/24"]  # Chỉ IP office công ty, v.v.
  description = "SSH from office only"
}
```

**Cách chỉ định phạm vi IP address:**
- `203.0.113.10/32`: Địa chỉ IP đơn lẻ
- `203.0.113.0/24`: 256 địa chỉ IP (203.0.113.0～203.0.113.255)
- `0.0.0.0/0`: Tất cả địa chỉ IP (toàn thế giới)

### Quản lý Code

#### 1. Module hóa

**Module là gì?**  
Là tập hợp code Terraform có thể tái sử dụng. Image giống như function.

```
terraform-project/
├── modules/              # Module có thể tái sử dụng
│   ├── vpc/              # VPC creation module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── ec2/              # EC2 creation module
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── environments/         # Cấu hình theo môi trường
    ├── dev/              # Development environment
    │   └── main.tf
    └── prod/             # Production environment
        └── main.tf
```

**Lợi ích:**
- Tái sử dụng cùng code ở nhiều môi trường
- Thay đổi đủ một chỗ
- Dễ dàng chia sẻ code trong team

#### 2. Quản lý biến theo môi trường

**Tại sao phân chia môi trường?**  
Để thay đổi cấu hình theo môi trường, như sử dụng instance nhỏ trong môi trường development, instance lớn trong môi trường production.

```hcl
# dev.tfvars (Development environment)
environment   = "development"
instance_type = "t2.micro"    # Instance nhỏ
db_size       = 20            # Disk nhỏ

# prod.tfvars (Production environment)
environment   = "production"
instance_type = "t3.medium"   # Instance lớn
db_size       = 100           # Disk lớn
```

**Cách thực thi:**

```bash
# Áp dụng cho môi trường development
terraform apply -var-file="dev.tfvars"

# Áp dụng cho môi trường production
terraform apply -var-file="prod.tfvars"
```

#### 3. Quản lý remote state file

**State file là gì?**  
Là file ghi lại trạng thái hiện tại của resource mà Terraform đang quản lý. Mặc định được lưu local dưới dạng `terraform.tfstate`.

**Tại sao cần quản lý remote?**
- **Team development**: Khi nhiều người quản lý cùng infrastructure, cần chia sẻ trạng thái
- **Backup**: Nếu file local mất thì không thể quản lý infrastructure
- **Lock function**: Ngăn chặn thực thi đồng thời, tránh conflict

**Ví dụ AWS S3 backend:**

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"    # S3 bucket name
    key            = "prod/terraform.tfstate"  # File path
    region         = "ap-northeast-1"
    encrypt        = true                    # Bật mã hóa
    dynamodb_table = "terraform-lock"        # Table quản lý lock
  }
}
```

**Chuẩn bị trước:**
- Tạo S3 bucket `my-terraform-state`
- Tạo DynamoDB table `terraform-lock` (primary key: `LockID`)

**Ví dụ GCS backend:**

```hcl
terraform {
  backend "gcs" {
    bucket = "my-terraform-state"  # GCS bucket name
    prefix = "prod"                # Prefix
  }
}
```

**Chuẩn bị trước:**
- Tạo GCS bucket `my-terraform-state`

---

## Troubleshooting

Tổng hợp các lỗi dễ gặp và cách giải quyết.

### 1. Lock state file

**Error message:**

```
Error: Error locking state: Error acquiring the state lock
```

**Nguyên nhân:**  
`terraform apply` lần trước đã kết thúc bất thường (như ngắt bằng Ctrl+C), lock file còn sót lại.

**Cách giải quyết:**

```bash
# Copy Lock ID hiển thị trong error message
terraform force-unlock <LOCK_ID>

# Ví dụ
terraform force-unlock a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Chú ý:** Xác nhận không có người khác đang thực thi trước khi chạy.

### 2. Lỗi cấu hình Provider

**Error message:**

```
Error: Provider configuration not present
```

**Nguyên nhân:**  
Cấu hình provider không được khởi tạo đúng, hoặc thư mục `.terraform` bị hỏng.

**Cách giải quyết:**

```bash
# Khởi tạo lại provider
terraform init -reconfigure
```

Option `-reconfigure` sẽ bỏ qua cấu hình hiện có và khởi tạo lại.

### 3. Lỗi xác thực AWS

**Error message:**

```
Error: error configuring Terraform AWS Provider: no valid credential sources
```

**Nguyên nhân:**  
Thông tin xác thực AWS không được cài đặt hoặc đã hết hạn.

**Cách xác nhận:**

```bash
# Xác nhận thông tin xác thực hiện tại
aws sts get-caller-identity
```

**Ví dụ output khi bình thường:**

```json
{
  "UserId": "AIDAI...",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/terraform-user"
}
```

**Cách giải quyết:**

```bash
# Cài đặt lại thông tin xác thực
aws configure
```

Vui lòng nhập lại Access Key ID và Secret Access Key.

### 4. Lỗi xác thực GCP

**Error message:**

```
Error: google: could not find default credentials
```

**Nguyên nhân:**  
Thông tin xác thực GCP không được cài đặt, hoặc path của service account key sai.

**Cách giải quyết:**

```bash
# Phương pháp 1: Cài đặt lại application default authentication
gcloud auth application-default login

# Phương pháp 2: Chỉ định path của service account key bằng environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./terraform-key.json"

# Xác nhận path có đúng không
ls -l terraform-key.json
```

**Vị trí terraform-key.json:**  
Vui lòng đặt trong cùng thư mục với main.tf.

### 5. Lỗi xóa Resource

**Error message:**

```
Error: Error deleting VPC: DependencyViolation: The vpc 'vpc-xxx' has dependencies and cannot be deleted
```

**Nguyên nhân:**  
Đang cố xóa VPC nhưng còn dependency resource như subnet hoặc EC2 instance trong VPC.

**Tại sao xảy ra?**
- Có resource đã thêm thủ công
- terraform destroy đã bị ngắt giữa chừng
- Tồn tại resource không được quản lý bởi Terraform

**Cách giải quyết 1:** Thực thi lại destroy

```bash
# Giải quyết dependency và xóa
terraform destroy -auto-approve
```

**Cách giải quyết 2:** Xóa thủ công

```bash
# Xác nhận resource gắn với VPC
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=terraform-vpc"

# Xóa thủ công từ AWS console
# 1. Xóa EC2 instance
# 2. Xóa subnet
# 3. Xóa VPC
```

**Trường hợp GCP:**

```bash
# Xác nhận tất cả resource trong project
gcloud compute instances list
gcloud compute networks list

# Xóa thủ công nếu cần
gcloud compute instances delete terraform-web-server --zone=asia-northeast1-a
```

---

## Tổng kết

### Kiến thức thu được từ nghiên cứu

1. **Terraform có giá trị xứng đáng với chi phí học tập**  
   Ban đầu có nhiều điều cần ghi nhớ, nhưng một khi đã thành thạo thì:
   - Có thể tái tạo cùng môi trường nhiều lần
   - Giảm human error
   - Có thể quản lý lịch sử thay đổi bằng Git

2. **Hỗ trợ multi-cloud là thực tế**  
   Vì có thể sử dụng cùng công cụ và cùng cách suy nghĩ trên AWS・GCP nên:
   - Dễ dàng mở rộng skill theo chiều ngang
   - Tránh cloud vendor lock-in
   - Có thể quản lý thống nhất nhiều cloud

3. **Có thể code review**  
   Giống như application, infrastructure cũng:
   - Review bằng Pull Request
   - Hiển thị nội dung thay đổi
   - Cải thiện chất lượng toàn team

4. **Tầm quan trọng của quản lý trạng thái**  
   Trong môi trường production:
   - Nhất định sử dụng remote backend (S3/GCS)
   - Backup state file
   - Ngăn chặn thực thi đồng thời bằng lock function

### Tài liệu tham khảo

- [Terraform公式ドキュメント](https://www.terraform.io/docs)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Google Cloud Provider Documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

---

## Kết thúc

Từ nhu cầu xây dựng môi trường cloud, tôi đã bắt đầu nghiên cứu Terraform và thực sự cảm nhận được giá trị của Infrastructure as Code.

> ⚠️ **Lưu ý quan trọng:**
> 
> - **Nhất định phải xóa resource sau khi kiểm chứng**
>   ```bash
>   terraform destroy
>   ```
>   Nếu để quên sẽ bị tính phí liên tục.
> 
> - **Quản lý thông tin xác thực triệt để**
>   - Thêm vào `.gitignore`
>   - Tuyệt đối không push lên GitHub
>   - Rotation định kỳ
> 
> - **Thận trọng trong môi trường production**
>   - Nhất định xác nhận bằng `terraform plan`
>   - Cài đặt `prevent_destroy` cho resource quan trọng
>   - Backup trước khi thực thi

Hy vọng bài viết này sẽ hữu ích cho những người có cùng vấn đề.

Nếu có câu hỏi hoặc điểm cần cải thiện, hãy thoải mái thông báo trong phần comment!
