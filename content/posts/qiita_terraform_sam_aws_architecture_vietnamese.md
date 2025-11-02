---
title: "Hướng Dẫn Xây Dựng Kiến Trúc AWS Hiện Đại với Terraform và SAM"
date: 2025-10-30
categories: ["AWS", "DevOps", "Infrastructure"]
tags: ["Terraform", "AWS-SAM", "IaC", "Lambda", "Serverless", "Best-Practices"]
description: "Hướng dẫn kết hợp Terraform và AWS SAM để xây dựng kiến trúc AWS. Phân tách trách nhiệm infrastructure và application, least privilege principle, secure IaC operations."
---

# Hướng Dẫn Xây Dựng Kiến Trúc AWS Hiện Đại với Terraform và SAM

**Tác giả:** Keita Higaki (@keitah)  
**Ngày xuất bản:** 30/10/2025  
**Cập nhật lần cuối:** 30/10/2025  
**Nguồn:** [Qiita](https://qiita.com/keitah/items/d41b0888cf7b8b01616d)  
**Tags:** AWS, Terraform, #IaC  
**👍 Lượt thích:** 29 | **📚 Bookmark:** 36

---

## Giới Thiệu

Bằng cách kết hợp Terraform và AWS SAM (Serverless Application Model), chúng ta có thể phân tách rõ ràng trách nhiệm giữa hạ tầng và ứng dụng, đồng thời **thực hiện quản lý quyền phù hợp theo từng team và vận hành IaC an toàn**.

### Lợi Ích Cốt Lõi của Kiến Trúc Này

- **Nhà phát triển ứng dụng**: Triển khai nhanh chóng các hàm Lambda được cập nhật thường xuyên bằng SAM
- **Team hạ tầng**: Quản lý nghiêm ngặt mạng và các tài nguyên quan trọng bằng Terraform
- **Bảo mật**: Giảm thiểu rủi ro với việc phân tách quyền dựa trên nguyên tắc đặc quyền tối thiểu

Bài viết này sẽ giải thích thông qua một dự án mẫu hoàn chỉnh và hoạt động thực tế:

- **Phần cơ bản**: Phân tách trách nhiệm giữa Terraform và SAM, quản lý quyền theo team
- **Phần thực hành**: Triển khai VPC, DynamoDB, hỗ trợ nhiều môi trường
- **Phần vận hành**: Giám sát, khắc phục sự cố, CI/CD
- **Kết quả xác thực**: Triển khai thực tế và xác nhận hoạt động

### Những Gì Bạn Sẽ Học Được

✅ Cách sử dụng phù hợp giữa Terraform và SAM  
✅ Cấu hình bảo mật cho Lambda trong VPC  
✅ Triển khai DynamoDB Single Table Design  
✅ Phương pháp quản lý theo môi trường (dev/staging/prod)  
✅ Thiết lập giám sát và cảnh báo với CloudWatch  
✅ Xây dựng CI/CD sử dụng GitHub Actions  
✅ Các lỗi thực tế xảy ra và cách giải quyết

### Dự Án Mẫu

Mã nguồn đầy đủ được công khai tại:  
🔗 https://github.com/higakikeita/test

**Sơ đồ kiến trúc (có thể chỉnh sửa):**  
https://github.com/higakikeita/test/blob/main/docs/architecture.drawio

---

## Tại Sao Lại Là Terraform + SAM?

### Điểm Mạnh Của Từng Công Cụ

| Công cụ | Điểm mạnh | Điểm yếu |
|---------|-----------|----------|
| **Terraform** | Quản lý toàn bộ hạ tầng, tích hợp với các dịch vụ khác | Build Lambda, kiểm thử local |
| **SAM** | Phát triển và triển khai Lambda, kiểm thử local | Quản lý hạ tầng tổng quát như VPC |

### Nguyên Tắc Phân Tách Trách Nhiệm

```
┌─────────────────────────────────────┐
│     Terraform (Tầng hạ tầng)        │
│     👷 Quản lý bởi team hạ tầng     │
├─────────────────────────────────────┤
│ • VPC / Subnet / Security Group     │
│ • Bảng DynamoDB / IAM Role          │
│ • S3 Bucket / Cấu hình CloudWatch   │
│                                     │
│ Tần suất thay đổi: Thấp (tuần/tháng)│
│ Phạm vi ảnh hưởng: Lớn (bảo mật/mạng)│
└─────────────────────────────────────┘
              ↓ outputs
┌─────────────────────────────────────┐
│     SAM (Tầng ứng dụng)             │
│     👨‍💻 Quản lý bởi dev ứng dụng    │
├─────────────────────────────────────┤
│ • Hàm Lambda / Lambda Layer         │
│ • API Gateway / Event Source        │
│ • Logic ứng dụng                    │
│                                     │
│ Tần suất thay đổi: Cao (ngày/giờ)  │
│ Phạm vi ảnh hưởng: Nhỏ (trong app)  │
└─────────────────────────────────────┘
```

### Quản Lý IaC An Toàn Với Phân Tách Trách Nhiệm Theo Team

Lợi ích lớn nhất của kiến trúc này là có thể thực hiện **phân tách quyền phù hợp theo vai trò của từng team**.

#### 🏗️ Team Hạ Tầng (Terraform)

**Đối tượng quản lý:**
- Cấu hình mạng (VPC, Subnet, Security Group)
- Data store (DynamoDB, RDS, v.v.)
- IAM Role và Policy
- Nền tảng giám sát và log (CloudWatch)

**Đặc điểm:**
- Tần suất thay đổi thấp (tuần hoặc tháng một lần)
- Các thiết lập ảnh hưởng trực tiếp đến bảo mật
- Phạm vi ảnh hưởng lớn đến môi trường production
- Quy trình review nghiêm ngặt

**Quyền hạn:**
```bash
# Chỉ team hạ tầng mới có thể thực thi
terraform apply -var-file=environments/prod.tfvars
```

#### 👨‍💻 Team Phát Triển Ứng Dụng (SAM)

**Đối tượng quản lý:**
- Mã nguồn hàm Lambda
- Cấu hình API Gateway
- Lambda Layer
- Event Source (DynamoDB Streams, EventBridge)

**Đặc điểm:**
- Tần suất thay đổi cao (hàng ngày đến từng giờ)
- Cải thiện logic ứng dụng, sửa lỗi
- Ảnh hưởng tối thiểu đến hạ tầng
- Có thể triển khai nhanh chóng

**Quyền hạn:**
```bash
# Dev ứng dụng có thể tự do thực thi
sam deploy --stack-name my-app-dev
```

#### 🔒 Lợi Ích Của Quản Lý IaC An Toàn

1. **Nguyên tắc đặc quyền tối thiểu**
   - Dev ứng dụng không thể thay đổi VPC hoặc IAM
   - Team hạ tầng không liên quan đến việc triển khai ứng dụng thường xuyên

2. **Phân tách quản lý thay đổi**
   - Thay đổi hạ tầng: Quy trình review và phê duyệt nghiêm ngặt
   - Thay đổi ứng dụng: Pipeline CI/CD nhanh chóng

3. **Giảm thiểu rủi ro bảo mật**
   - Ngăn chặn nâng cấp quyền không cần thiết
   - Ngăn chặn thay đổi không chủ ý vào thiết lập mạng
   - Ngăn chặn thay đổi sai IAM Role

4. **Tăng tốc độ phát triển**
   - Dev ứng dụng tập trung vào phát triển mà không quan tâm hạ tầng
   - Triển khai cập nhật hàm Lambda mà không phải chờ đợi

5. **Đáp ứng kiểm toán và tuân thủ**
   - Rõ ràng ai thay đổi gì
   - Lịch sử thay đổi có thể theo dõi qua Git
   - Dễ dàng quản lý quyền theo môi trường

#### Ví Dụ Triển Khai: Phân Tách Quyền

```yaml
# GitHub Actions - Triển khai hạ tầng (chỉ branch main)
deploy-infrastructure:
  if: github.ref == 'refs/heads/main'
  environment: production  # Chỉ team hạ tầng mới có thể phê duyệt

# GitHub Actions - Triển khai ứng dụng (cả feature branch)
deploy-application:
  if: github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main'
  # Dev ứng dụng có thể tự do triển khai
```

Với cấu hình này, có thể **tối đa hóa tốc độ phát triển trong khi vẫn duy trì bảo mật**.

---

## Tổng Quan Kiến Trúc

Kiến trúc hệ thống chúng ta sẽ xây dựng như sau:

### Sơ Đồ Kiến Trúc Hệ Thống

Sơ đồ kiến trúc được tự động tạo bằng thư viện `diagrams` của Python, sử dụng các icon chính thức của AWS.

#### 📋 Phiên Bản Đơn Giản
Sơ đồ ngắn gọn giúp hiểu luồng dữ liệu cơ bản trong một cái nhìn.

![Tổng quan hệ thống](https://raw.githubusercontent.com/higakikeita/test/main/docs/images/architecture_simple.png)

#### 🏗️ Phiên Bản Chi Tiết
Sơ đồ hiển thị chi tiết tất cả các component và mối quan hệ giữa chúng.

![Kiến trúc Terraform + SAM](https://raw.githubusercontent.com/higakikeita/test/main/docs/images/architecture.png)

#### 🔄 Chi Tiết Luồng Dữ Liệu
Sơ đồ hiển thị luồng dữ liệu từ request đến response theo từng tầng.

![Chi tiết luồng dữ liệu](https://raw.githubusercontent.com/higakikeita/test/main/docs/images/dataflow.png)

### Chi Tiết Các Component Chính

#### 1. **Lambda Functions**

- **API Function** (256MB, ARM64, 30s timeout)
  - REST API endpoint
  - Thao tác CRUD, validation
  - Xử lý lỗi

- **Processor Function** (256MB, ARM64)
  - Xử lý sự kiện DynamoDB Streams
  - Batch size: 10, Window: 5 giây
  - Cấu hình retry, bật DLQ

- **Scheduled Function** (256MB, ARM64, 60s timeout)
  - Task định kỳ (mỗi ngày lúc UTC 00:00)
  - Bảo trì, dọn dẹp dữ liệu

#### 2. **Bảng DynamoDB**

- **Thiết kế**: Single Table Design
- **Keys**: PK (String), SK (String)
- **GSI**: EntityTypeIndex, GSI1
- **Streams**: NEW_AND_OLD_IMAGES
- **Billing**: PAY_PER_REQUEST
- **PITR**: Chỉ bật cho môi trường production

#### 3. **Cấu Hình VPC**

- **CIDR**: Theo môi trường (dev: 10.0.0.0/16)
- **Public Subnets**: Đặt NAT Gateway
- **Private Subnets**: Đặt Lambda
- **VPC Endpoints**: S3, DynamoDB (miễn phí)
- **NAT Gateway**: dev=1 cái, prod=2 cái

#### 4. **Giám Sát và Cảnh Báo**

- **CloudWatch Logs**: Lưu trữ 7-90 ngày
- **Metrics**: Lambda, DynamoDB, API Gateway
- **Alarms**: Phát hiện lỗi, throttling
- **Dashboard**: Giao diện tổng hợp

---

## Cấu Trúc Dự Án

```
terraform-sam-demo/
├── terraform/              # Định nghĩa hạ tầng
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── iam.tf             # IAM Role và Policy
│   ├── vpc.tf             # Cấu hình VPC
│   ├── dynamodb.tf        # Bảng DynamoDB
│   ├── cloudwatch.tf      # Cấu hình giám sát
│   └── environments/      # Cấu hình theo môi trường
│       ├── dev.tfvars
│       ├── staging.tfvars
│       └── prod.tfvars
├── sam/                   # Ứng dụng SAM
│   ├── template.yaml      # Template SAM
│   ├── functions/         # Hàm Lambda
│   │   ├── api/
│   │   │   ├── index.py
│   │   │   └── requirements.txt
│   │   └── processor/
│   │       ├── index.py
│   │       └── requirements.txt
│   ├── layers/            # Lambda Layer
│   │   └── common/
│   └── events/            # Event kiểm thử
├── scripts/               # Scripts
│   ├── deploy.sh          # Script triển khai
│   ├── validate.sh        # Script xác thực
│   └── generate_diagrams.py  # Tạo sơ đồ tự động
├── .github/workflows/     # CI/CD
│   └── deploy.yml
└── docs/                  # Tài liệu
    ├── architecture.md
    ├── TROUBLESHOOTING.md
    ├── BEST_PRACTICES.md
    └── images/            # Sơ đồ kiến trúc
        ├── architecture.png
        ├── architecture_simple.png
        ├── dataflow.png
        └── README.md      # Cách tạo sơ đồ
```

---

## Tự Động Tạo Sơ Đồ Kiến Trúc

Dự án này sử dụng thư viện `diagrams` của Python để tự động tạo sơ đồ kiến trúc với các icon chính thức của AWS.

### Cách Tạo

```bash
# Cài đặt công cụ cần thiết
brew install graphviz
pip3 install diagrams

# Tạo sơ đồ
python3 scripts/generate_diagrams.py
```

Sau khi thực thi, 3 ảnh PNG sau sẽ được tạo trong `docs/images/`:

- **architecture_simple.png** - Sơ đồ tổng quan đơn giản
- **architecture.png** - Sơ đồ cấu hình đầy đủ chi tiết
- **dataflow.png** - Sơ đồ luồng dữ liệu chi tiết

### Đặc Điểm Của Sơ Đồ

**Tối ưu layout:**
```python
graph_attr = {
    "splines": "ortho",    # Đường thẳng góc đẹp
    "nodesep": "0.8",      # Khoảng cách giữa các node
    "ranksep": "1.0",      # Khoảng trống giữa các tầng
}
```

**Trực quan hóa bằng màu sắc:**
```python
# Luồng chính
users >> Edge(color="darkblue", style="bold", label="HTTPS") >> apigw
apigw >> Edge(color="darkgreen", style="bold", label="Invoke") >> lambda_api

# Xử lý Stream
dynamodb >> Edge(color="orange", style="bold", label="Streams") >> lambda_processor

# Logging
lambda_api >> Edge(color="gray", style="dotted") >> cloudwatch
```

**Lợi ích:**
- Có thể quản lý bằng code nên lịch sử thay đổi có thể theo dõi được
- Tự động tạo lại khi có thay đổi cấu hình
- Hoàn thiện chuyên nghiệp với icon chính thức AWS
- Dễ dàng quản lý phiên bản

### Tùy Chỉnh

Có thể dễ dàng tùy chỉnh bằng cách chỉnh sửa `scripts/generate_diagrams.py`:

```python
# Ví dụ thêm dịch vụ AWS mới
from diagrams.aws.network import CloudFront
from diagrams.aws.security import WAF

# Thêm vào sơ đồ
cloudfront = CloudFront("CloudFront")
waf = WAF("WAF")
```

Xem thêm tại [tài liệu chính thức diagrams](https://diagrams.mingrammer.com/).

---

## Triển Khai: Xây Dựng Hạ Tầng Với Terraform

### 1. Cấu Hình VPC (vpc.tf)

Đặt Lambda trong VPC để thực hiện môi trường an toàn.

```hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${local.resource_prefix}-vpc"
  }
}

# Private Subnet (để đặt Lambda)
resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${local.resource_prefix}-private-subnet-${count.index + 1}"
  }
}

# NAT Gateway (để Lambda truy cập API bên ngoài)
resource "aws_nat_gateway" "main" {
  count         = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : length(var.public_subnet_cidrs)) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "${local.resource_prefix}-nat-${count.index + 1}"
  }
}

# VPC Endpoint (giảm chi phí)
resource "aws_vpc_endpoint" "s3" {
  vpc_id          = aws_vpc.main.id
  service_name    = "com.amazonaws.${var.aws_region}.s3"
  route_table_ids = concat(
    [aws_route_table.public.id],
    aws_route_table.private[*].id
  )

  tags = {
    Name = "${local.resource_prefix}-s3-endpoint"
  }
}
```

**Điểm chú ý:**
- NAT Gateway đơn lẻ cho môi trường dev, đặt tại mỗi AZ cho môi trường production
- Truy cập S3/DynamoDB qua VPC Endpoint (miễn phí & nhanh)
- Security Group chỉ cho phép outbound

### 2. Bảng DynamoDB (dynamodb.tf)

Quản lý hiệu quả nhiều entity với thiết kế single table.

```hcl
resource "aws_dynamodb_table" "main" {
  name         = local.dynamodb_table_name
  billing_mode = var.dynamodb_billing_mode
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "EntityType"
    type = "S"
  }

  attribute {
    name = "CreatedAt"
    type = "N"
  }

  # GSI: Để query theo loại entity
  global_secondary_index {
    name            = "EntityTypeIndex"
    hash_key        = "EntityType"
    range_key       = "CreatedAt"
    projection_type = "ALL"
  }

  # DynamoDB Streams (cho Processor Lambda)
  stream_enabled   = var.enable_dynamodb_streams
  stream_view_type = "NEW_AND_OLD_IMAGES"

  # Point-in-Time Recovery (môi trường production)
  point_in_time_recovery {
    enabled = var.enable_dynamodb_point_in_time_recovery
  }

  # Cấu hình TTL
  ttl {
    enabled        = true
    attribute_name = "ExpiresAt"
  }
}
```

**Ví dụ thiết kế single table:**
```
# Entity người dùng
PK: USER#123, SK: METADATA
EntityType: User
Name: "John Doe"

# Đơn hàng của người dùng
PK: USER#123, SK: ORDER#456
EntityType: Order
Amount: 1000
```

### 3. IAM Role (iam.tf)

Tạo IAM Role cho Lambda dựa trên nguyên tắc đặc quyền tối thiểu.

```hcl
# Role cho Lambda API Function
resource "aws_iam_role" "lambda_api" {
  name               = "${local.resource_prefix}-lambda-api-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

# Policy truy cập DynamoDB
data "aws_iam_policy_document" "lambda_dynamodb_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem"
    ]
    resources = [
      aws_dynamodb_table.main.arn,
      "${aws_dynamodb_table.main.arn}/index/*"
    ]
  }
}

resource "aws_iam_role_policy" "lambda_api_dynamodb" {
  role   = aws_iam_role.lambda_api.id
  policy = data.aws_iam_policy_document.lambda_dynamodb_access.json
}
```

**Điểm bảo mật:**
- Chỉ định rõ ràng ARN của tài nguyên (không sử dụng `*`)
- Chỉ cho phép các action tối thiểu cần thiết
- Có thể hạn chế thêm bằng Condition

### 4. Cấu Hình CloudWatch (cloudwatch.tf)

Thiết lập giám sát và cảnh báo.

```hcl
# Log Group
resource "aws_cloudwatch_log_group" "lambda_api" {
  name              = "/aws/lambda/${local.lambda_function_prefix}-api"
  retention_in_days = var.log_retention_days
}

# Cảnh báo lỗi Lambda
resource "aws_cloudwatch_metric_alarm" "lambda_api_errors" {
  alarm_name          = "${local.resource_prefix}-lambda-api-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 5

  dimensions = {
    FunctionName = "${local.lambda_function_prefix}-api"
  }
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${local.resource_prefix}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations"],
            [".", "Errors"],
            [".", "Duration"]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "Lambda Metrics"
        }
      }
    ]
  })
}
```

### 5. Outputs (outputs.tf)

Xuất các giá trị để sử dụng trong SAM.

```hcl
output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "lambda_security_group_id" {
  value = aws_security_group.lambda.id
}

output "lambda_api_role_arn" {
  value = aws_iam_role.lambda_api.arn
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.main.name
}

output "sam_artifacts_bucket" {
  value = aws_s3_bucket.sam_artifacts.id
}

# Tạo lệnh deploy cho SAM
output "sam_deploy_command" {
  value = <<-EOT
    sam deploy \\
      --stack-name ${local.resource_prefix}-app \\
      --s3-bucket ${aws_s3_bucket.sam_artifacts.id} \\
      --parameter-overrides \\
        VpcId=${aws_vpc.main.id} \\
        SubnetIds=${join(",", aws_subnet.private[*].id)}
  EOT
}
```

---

## Triển Khai: Xây Dựng Ứng Dụng Với SAM

### 1. Template SAM (template.yaml)

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

# Tham số được truyền từ Terraform
Parameters:
  Environment:
    Type: String
  VpcId:
    Type: String
  SubnetIds:
    Type: CommaDelimitedList
  SecurityGroupId:
    Type: String
  LambdaApiRoleArn:
    Type: String
  DynamoDBTableName:
    Type: String

# Cấu hình toàn cục
Globals:
  Function:
    Runtime: python3.11
    Timeout: 30
    MemorySize: 256
    Architectures:
      - arm64  # Graviton2 (giảm 20% chi phí)
    Environment:
      Variables:
        ENVIRONMENT: !Ref Environment
        DYNAMODB_TABLE: !Ref DynamoDBTableName
        LOG_LEVEL: INFO
    VpcConfig:
      SecurityGroupIds:
        - !Ref SecurityGroupId
      SubnetIds: !Ref SubnetIds
    Tracing: Active  # Bật X-Ray

Resources:
  # Lambda Layer (thư viện chung)
  CommonLayer:
    Type: AWS::Serverless::LayerVersion
    Properties:
      LayerName: !Sub ${Environment}-common-layer
      ContentUri: layers/common/
      CompatibleRuntimes:
        - python3.11

  # API Lambda Function
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub terraform-sam-demo-${Environment}-api
      CodeUri: functions/api/
      Handler: index.lambda_handler
      Role: !Ref LambdaApiRoleArn
      Layers:
        - !Ref CommonLayer
      Events:
        GetItems:
          Type: Api
          Properties:
            Path: /items
            Method: GET
        CreateItem:
          Type: Api
          Properties:
            Path: /items
            Method: POST
        GetItem:
          Type: Api
          Properties:
            Path: /items/{id}
            Method: GET

  # Processor Lambda Function (DynamoDB Streams)
  ProcessorFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub terraform-sam-demo-${Environment}-processor
      CodeUri: functions/processor/
      Handler: index.lambda_handler
      Role: !Ref LambdaProcessorRoleArn
      Events:
        DynamoDBStream:
          Type: DynamoDB
          Properties:
            Stream: !Ref DynamoDBStreamArn
            StartingPosition: LATEST
            BatchSize: 10

Outputs:
  ApiEndpoint:
    Value: !Sub https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/${Environment}
```

### 2. Hàm API Lambda (functions/api/index.py)

```python
import json
import os
import boto3
from boto3.dynamodb.conditions import Key
import logging

logger = logging.getLogger()
logger.setLevel(os.environ.get('LOG_LEVEL', 'INFO'))

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

def create_response(status_code, body):
    """Tạo response cho API Gateway"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body, default=str)
    }

def get_items(event):
    """GET /items - Lấy danh sách item"""
    try:
        response = table.query(
            IndexName='EntityTypeIndex',
            KeyConditionExpression=Key('EntityType').eq('Item'),
            Limit=20
        )
        items = response.get('Items', [])
        logger.info(f"Retrieved {len(items)} items")
        
        return create_response(200, {
            'items': items,
            'count': len(items)
        })
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return create_response(500, {'error': str(e)})

def create_item(event):
    """POST /items - Tạo item"""
    try:
        body = json.loads(event['body'])
        import uuid
        item_id = str(uuid.uuid4())
        
        item = {
            'PK': f'ITEM#{item_id}',
            'SK': 'METADATA',
            'EntityType': 'Item',
            'ItemId': item_id,
            'Name': body['name'],
            'CreatedAt': int(time.time())
        }
        
        table.put_item(Item=item)
        logger.info(f"Created item: {item_id}")
        
        return create_response(201, {
            'message': 'Item created',
            'item': item
        })
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return create_response(500, {'error': str(e)})

def lambda_handler(event, context):
    """Entry point của Lambda"""
    logger.info(f"Event: {json.dumps(event)}")
    
    method = event['httpMethod']
    path = event['path']
    
    if path == '/items' and method == 'GET':
        return get_items(event)
    elif path == '/items' and method == 'POST':
        return create_item(event)
    else:
        return create_response(404, {'error': 'Not found'})
```

**Điểm triển khai:**
- Khởi tạo boto3 client ở global scope (tái sử dụng connection)
- Structured log để dễ tìm kiếm trong CloudWatch Logs
- Triển khai xử lý lỗi phù hợp

### 3. Hàm Processor Lambda (functions/processor/index.py)

```python
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def process_insert(new_image):
    """Xử lý sự kiện INSERT"""
    logger.info(f"New item created: {new_image.get('ItemId')}")
    # Gửi thông báo, xử lý tổng hợp, v.v.

def process_modify(old_image, new_image):
    """Xử lý sự kiện MODIFY"""
    logger.info(f"Item modified: {new_image.get('ItemId')}")
    # Phân tích nội dung thay đổi, thông báo, v.v.

def lambda_handler(event, context):
    """Xử lý sự kiện DynamoDB Streams"""
    logger.info(f"Processing {len(event['Records'])} records")
    
    for record in event['Records']:
        event_name = record['eventName']
        
        if event_name == 'INSERT':
            new_image = record['dynamodb']['NewImage']
            process_insert(new_image)
        elif event_name == 'MODIFY':
            old_image = record['dynamodb']['OldImage']
            new_image = record['dynamodb']['NewImage']
            process_modify(old_image, new_image)
    
    return {'statusCode': 200}
```

---

## Quy Trình Triển Khai

### 1. Điều Kiện Tiên Quyết

```bash
# Xác nhận cài đặt công cụ cần thiết
terraform --version  # >= 1.5.0
sam --version        # >= 1.100.0
aws --version        # >= 2.0

# Thiết lập thông tin xác thực AWS
aws configure
```

### 2. Xây Dựng Hạ Tầng Với Terraform

```bash
cd terraform

# Khởi tạo
terraform init

# Xác nhận plan
terraform plan -var-file=environments/dev.tfvars

# Áp dụng
terraform apply -var-file=environments/dev.tfvars

# Lưu giá trị output (để sử dụng trong SAM)
terraform output -json > ../sam/terraform-outputs.json
```

**Kết quả thực thi:**
```
Apply complete! Resources: 45 added, 0 changed, 0 destroyed.

Outputs:
vpc_id = "vpc-0123456789abcdef0"
private_subnet_ids = [
  "subnet-0123456789abcdef0",
  "subnet-0123456789abcdef1",
]
dynamodb_table_name = "terraform-sam-demo-dev-data"
sam_artifacts_bucket = "terraform-sam-demo-dev-sam-artifacts-123456789012"
```

### 3. Triển Khai Ứng Dụng Với SAM

```bash
cd ../sam

# Build
sam build

# Kiểm thử local (tùy chọn)
sam local invoke ApiFunction -e events/event.json

# Triển khai
sam deploy \
  --stack-name terraform-sam-demo-dev-app \
  --s3-bucket $(cat terraform-outputs.json | jq -r '.sam_artifacts_bucket.value') \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    Environment=dev \
    VpcId=$(cat terraform-outputs.json | jq -r '.vpc_id.value') \
    SubnetIds=$(cat terraform-outputs.json | jq -r '.private_subnet_ids.value | join(",")') \
    # ...các tham số khác
```

**Kết quả thực thi:**
```
Successfully created/updated stack - terraform-sam-demo-dev-app

Outputs:
Key         ApiEndpoint
Description API Gateway endpoint URL
Value       https://abc123def.execute-api.ap-northeast-1.amazonaws.com/dev
```

### 4. Sử Dụng Script Triển Khai (Khuyến Nghị)

```bash
# Triển khai tất cả
./scripts/deploy.sh dev

# Chỉ Terraform
./scripts/deploy.sh dev --tf-only

# Chỉ SAM
./scripts/deploy.sh dev --sam-only
```

---

## Xác Nhận Hoạt Động

### Kiểm Thử API Endpoint

```bash
# Health check
curl https://abc123def.execute-api.ap-northeast-1.amazonaws.com/dev/health

# Lấy danh sách item
curl https://abc123def.execute-api.ap-northeast-1.amazonaws.com/dev/items

# Tạo item
curl -X POST https://abc123def.execute-api.ap-northeast-1.amazonaws.com/dev/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item"}'
```

**Ví dụ response:**
```json
{
  "message": "Item created",
  "item": {
    "PK": "ITEM#123e4567-e89b-12d3-a456-426614174000",
    "SK": "METADATA",
    "EntityType": "Item",
    "ItemId": "123e4567-e89b-12d3-a456-426614174000",
    "Name": "Test Item",
    "CreatedAt": 1704067200
  }
}
```

### Xác Nhận CloudWatch Logs

```bash
# Xác nhận log real-time
aws logs tail /aws/lambda/terraform-sam-demo-dev-api --follow

# Lọc chỉ error log
aws logs tail /aws/lambda/terraform-sam-demo-dev-api --filter-pattern "ERROR"
```

### Xác Nhận CloudWatch Metrics

```bash
# Số lần thực thi Lambda
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=terraform-sam-demo-dev-api \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

---

## Quản Lý Theo Môi Trường

### Môi Trường Development (dev)

```hcl
# terraform/environments/dev.tfvars
environment = "dev"

# Cấu hình giảm chi phí
enable_nat_gateway   = true
single_nat_gateway   = true  # NAT Gateway đơn lẻ
dynamodb_billing_mode = "PAY_PER_REQUEST"
log_retention_days   = 7
enable_lambda_insights = false
```

### Môi Trường Production (prod)

```hcl
# terraform/environments/prod.tfvars
environment = "prod"

# Cấu hình tính khả dụng cao
enable_nat_gateway                      = true
single_nat_gateway                      = false  # NAT Gateway tại mỗi AZ
dynamodb_billing_mode                   = "PAY_PER_REQUEST"
enable_dynamodb_point_in_time_recovery = true
log_retention_days                      = 90
enable_lambda_insights                  = true
```

### Chuyển Đổi Môi Trường

```bash
# Môi trường dev
./scripts/deploy.sh dev

# Môi trường staging
./scripts/deploy.sh staging

# Môi trường prod
./scripts/deploy.sh prod
```

---

## CI/CD: GitHub Actions

### Cấu Hình Workflow (.github/workflows/deploy.yml)

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: aws-actions/setup-sam@v2

      - name: Terraform Validate
        run: |
          cd terraform
          terraform init -backend=false
          terraform validate

      - name: SAM Validate
        run: |
          cd sam
          sam validate

  deploy-dev:
    needs: validate
    if: github.ref == 'refs/heads/develop'
    environment: dev
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1

      - name: Deploy
        run: ./scripts/deploy.sh dev
```

### Thiết Lập GitHub Secrets

1. GitHub repository → Settings → Secrets and variables → Actions
2. Thêm các mục sau:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

---

## Khắc Phục Sự Cố

### Các Lỗi Thường Gặp Và Cách Giải Quyết

#### 1. Lambda Bị Timeout

**Triệu chứng:**
```
Task timed out after 30.00 seconds
```

**Nguyên nhân và cách giải quyết:**

**Lambda VPC không thể kết nối internet**

```bash
# Xác nhận NAT Gateway có tồn tại không
aws ec2 describe-nat-gateways --filter "Name=vpc-id,Values=<vpc-id>"

# Xác nhận route table của private subnet
aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=<subnet-id>"
```

**Tăng cấu hình timeout**

```yaml
# sam/template.yaml
Globals:
  Function:
    Timeout: 60  # Thay đổi từ 30 → 60
```

#### 2. CloudFormation Stack Ở Trạng Thái ROLLBACK_COMPLETE

**Triệu chứng:**
```
Error: Stack is in ROLLBACK_COMPLETE state
```

**Cách giải quyết:**

```bash
# Xác nhận nguyên nhân lỗi
aws cloudformation describe-stack-events \
  --stack-name terraform-sam-demo-dev-app \
  --max-items 20

# Xóa stack và tạo lại
aws cloudformation delete-stack --stack-name terraform-sam-demo-dev-app
aws cloudformation wait stack-delete-complete --stack-name terraform-sam-demo-dev-app

# Triển khai lại
sam deploy
```

#### 3. Lỗi Quyền Truy Cập DynamoDB

**Triệu chứng:**
```
AccessDeniedException: User is not authorized
```

**Cách giải quyết:**

```hcl
# Xác nhận policy trong terraform/iam.tf
data "aws_iam_policy_document" "lambda_dynamodb_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem"
    ]
    resources = [
      aws_dynamodb_table.main.arn  # Chỉ bảng cụ thể
    ]
  }
}
```

Xem chi tiết tại [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## Ước Tính Chi Phí

### Môi Trường Development (Tháng)

| Tài nguyên | Số lượng | Đơn giá | Tháng |
|-----------|---------|---------|-------|
| NAT Gateway | 1 | $32.40 | $32.40 |
| Lambda (1 triệu lần thực thi) | - | $0.20 | $0.20 |
| API Gateway (1 triệu) | - | $3.50 | $3.50 |
| DynamoDB (ít) | - | - | $1.00 |
| CloudWatch Logs | - | - | $0.50 |
| **Tổng cộng** | | | **$37.60** |

### Các Điểm Giảm Chi Phí

1. **Tận dụng VPC Endpoint**
   - Truy cập S3/DynamoDB qua VPC Endpoint (miễn phí)
   - Giảm lưu lượng NAT Gateway

2. **Kiến trúc ARM64**
   - Giảm 20% chi phí Lambda
   - Hiệu năng cũng được cải thiện

3. **NAT Gateway Đơn Lẻ (Môi Trường Dev)**
   - Giảm một nửa chi phí với cấu hình đơn lẻ trong môi trường dev
   - Đặt tại mỗi AZ cho tính khả dụng cao trong môi trường production

4. **Tối Ưu Thời Gian Lưu Trữ Log**
   - Dev: 7 ngày
   - Staging: 30 ngày
   - Production: 90 ngày

---

## Best Practices

### Bảo Mật

✅ **Tối thiểu hóa quyền IAM**
- Chỉ định rõ ràng ARN của tài nguyên
- Tránh sử dụng `*`
- Thêm hạn chế bằng Condition

✅ **Quản lý Secret**
```python
# Sử dụng AWS Secrets Manager
import boto3
secretsmanager = boto3.client('secretsmanager')
response = secretsmanager.get_secret_value(SecretId='prod/api/key')
api_key = json.loads(response['SecretString'])['api_key']
```

✅ **Bảo mật VPC**
- Đặt Lambda trong Private Subnet
- Security Group chỉ cho phép outbound
- Truy cập dịch vụ AWS qua VPC Endpoint

### Hiệu Năng

✅ **Tái sử dụng connection**
```python
# Khởi tạo ở global scope
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

def lambda_handler(event, context):
    # Tái sử dụng connection
    table.put_item(Item=item)
```

✅ **Thao tác batch**
```python
# Hiệu quả hóa với BatchWriteItem
with table.batch_writer() as batch:
    for item in items:
        batch.put_item(Item=item)
```

### Giám Sát

✅ **Cảnh báo bắt buộc**
- Tỷ lệ lỗi Lambda
- Lỗi 5XX API Gateway
- Throttling DynamoDB
- Timeout Lambda

✅ **X-Ray Tracing**
```yaml
Globals:
  Function:
    Tracing: Active
```

---

## Tổng Kết

Bằng cách kết hợp phù hợp Terraform và AWS SAM, chúng ta đã thực hiện được:

✅ **Phân tách trách nhiệm rõ ràng**
- Terraform: Hạ tầng
- SAM: Logic ứng dụng

✅ **Quản lý theo môi trường**
- Phân tách cấu hình dev/staging/prod
- Cấu hình theo môi trường bằng tệp tfvars

✅ **Cấu hình an toàn**
- Lambda trong VPC
- Đặc quyền tối thiểu IAM
- Quản lý secret

✅ **Tính vận hành**
- Giám sát CloudWatch
- Thiết lập cảnh báo
- Pipeline CI/CD

✅ **Tối ưu chi phí**
- VPC Endpoint
- Kiến trúc ARM64
- Sizing tài nguyên phù hợp

✅ **Tự động hóa tài liệu**
- Tự động tạo sơ đồ kiến trúc với icon chính thức AWS
- Quản lý sơ đồ dưới dạng code (thư viện diagrams)
- Dễ dàng quản lý phiên bản và review

### Các Bước Tiếp Theo

Để mở rộng thêm chức năng:

1. **Xác thực và ủy quyền**
   - Cognito User Pool
   - API Gateway Authorizer

2. **Xử lý bất đồng bộ**
   - SQS Queue
   - Step Functions

3. **Multi-region**
   - DynamoDB Global Tables
   - Route 53 Failover

4. **Tăng cường giám sát**
   - OpenTelemetry
   - Custom metrics

### Repository

Mã nguồn đầy đủ tại đây:  
🔗 https://github.com/higakikeita/test

**Tài liệu:**
- [Tài liệu thiết kế kiến trúc](https://github.com/higakikeita/test/blob/main/docs/architecture.md)
- [Script tự động tạo sơ đồ kiến trúc](https://github.com/higakikeita/test/blob/main/scripts/generate_diagrams.py)
- [Sơ đồ kiến trúc (Draw.io có thể chỉnh sửa)](https://github.com/higakikeita/test/blob/main/docs/architecture.drawio)
- [Cách tạo sơ đồ](https://github.com/higakikeita/test/blob/main/docs/images/README.md)
- [Khắc phục sự cố](https://github.com/higakikeita/test/blob/main/docs/TROUBLESHOOTING.md)
- [Best Practices](https://github.com/higakikeita/test/blob/main/docs/BEST_PRACTICES.md)

---

## Tài Liệu Tham Khảo

**Chính thức AWS:**
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Tài liệu AWS SAM](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Single Table Design](https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/)

**Công cụ:**
- [Diagrams - Diagram as Code](https://diagrams.mingrammer.com/)
- [Graphviz](https://graphviz.org/)
- [AWS Architecture Icons](https://aws.amazon.com/jp/architecture/icons/)

---

Nếu có câu hỏi hoặc phản hồi, hãy thoải mái để lại comment hoặc tạo GitHub Issues!
