---
title: "Giới Thiệu Fully Managed Amazon EKS MCP Server (Preview)"
slug: aws-eks-mcp-server-preview
date: 2025-12-02
categories:
  - Cloud Computing
  - Development
tags:
  - Amazon EKS
  - MCP Server
  - Model Context Protocol
  - Kubernetes
  - AI
  - Conversational AI
  - Amazon Q
  - Kiro CLI
  - ChatOps
description: "AWS ra mắt fully managed Amazon EKS MCP Server (preview). Quản lý EKS cluster thông qua natural language, không cần kubectl command phức tạp. Tích hợp IAM, CloudTrail, Amazon Q và troubleshooting knowledge base từ kinh nghiệm vận hành hàng triệu Kubernetes cluster."
---

Thay vì sử dụng kubectl command phức tạp hay chuyên môn sâu về Kubernetes, hãy học cách quản lý Amazon Elastic Kubernetes Service (Amazon EKS) cluster thông qua simple conversation. Bài viết này giới thiệu fully managed EKS Model Context Protocol (MCP) Server (preview) mới, cho phép deploy ứng dụng, troubleshoot vấn đề và upgrade cluster bằng natural language mà không cần chuyên môn sâu về Kubernetes.

## Bối Cảnh và Thách Thức

### Độ Phức Tạp Của Kubernetes Management

Team quản lý Kubernetes workload cần chuyên môn về container orchestration, infrastructure, networking và security. Large language model (LLM) giúp developer viết code và quản lý workload, nhưng bị giới hạn nếu không có real-time cluster access. Các recommendation chung dựa trên training data cũ không đáp ứng nhu cầu thực tế.

### Vai Trò Của Model Context Protocol (MCP)

Model Context Protocol (MCP) là open-source standard cho phép AI model access an toàn external tool và data source để có context tốt hơn. MCP cung cấp standardized interface để enhance AI application với real-time, contextual knowledge của EKS cluster, cho phép guidance chính xác và customized hơn xuyên suốt application lifecycle từ development đến operation.

### Sáng Kiến Tiên Phong Của AWS

Đầu năm nay, AWS là một trong những managed Kubernetes service provider đầu tiên announce MCP server chỉ vài tháng sau khi MCP protocol ra mắt. Khách hàng có thể install MCP Server trên máy. Phiên bản local installable ban đầu này của EKS MCP Server cho phép chúng tôi validate approach nhanh chóng và thu thập feedback quý báu từ khách hàng, dẫn đến announcement hôm nay.

## Announcement Fully Managed Amazon EKS MCP Server

Feedback nhất quán nhất chúng tôi nhận được là nhu cầu về cloud-hosted, fully managed EKS MCP Server. Hôm nay, AWS ra mắt fully managed Amazon EKS MCP Server (preview).

### Cải Tiến Từ Phiên Bản Local

Hosted EKS MCP Server mới cải thiện phiên bản trước với các tính năng essential cho production.

#### 1. Loại Bỏ Installation và Maintenance

- Không cần quản lý version update hay troubleshoot local server issue
- Cấu hình AI assistant kết nối với hosted EKS MCP Server endpoint thông qua lightweight proxy
- Tự động nhận tool, feature và bug fix mới

#### 2. Centralized Access Management

- **Deep Integration với AWS Identity and Access Management (IAM)**
- Cung cấp centralized, secure method để control access đến server
- Tất cả request được sign bằng AWS Signature Version 4 (SigV4)
- Seamless integration với existing AWS credential và IAM policy

#### 3. Enhanced Troubleshooting

- Access knowledge base được xây dựng từ operational experience quản lý hàng triệu Kubernetes cluster ở quy mô lớn
- Leverage proven operational knowledge của AWS

#### 4. Enhanced Monitoring và Visibility

- **AWS CloudTrail Integration**
- Capture tất cả tool invocation thực hiện thông qua hosted service
- Cho phép detailed audit trail và compliance reporting của AI-assisted operation

## Amazon EKS MCP Server Tools

EKS MCP Server cung cấp specialized tool để diagnose vấn đề và control cả EKS cluster và Kubernetes component. Các tool được phân loại thành các category sau.

### Tool Category

1. **Cluster Management Tool**
   - Tạo và quản lý EKS cluster

2. **Kubernetes Resource Management**
   - Operate và manage Kubernetes resource trong EKS cluster mà không phụ thuộc Kubernetes command

3. **Application Deployment**
   - Generate Kubernetes manifest để deploy ứng dụng

4. **Troubleshooting**
   - Cung cấp troubleshooting guide thu được từ operational knowledge của AWS chạy Kubernetes cluster ở quy mô lớn

5. **Documentation và Knowledge Base**
   - Search AWS documentation và knowledge base để có thông tin mới nhất và best practice

### Triết Lý Thiết Kế Tool

Mỗi tool được thiết kế để replace specific `aws eks` hoặc `kubectl` CLI command, cung cấp integrated experience hơn để manage EKS thông qua MCP protocol.

Để có danh sách đầy đủ các tool, xem [EKS MCP Server User Guide](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-mcp-tool-configurations.html).

## Bắt Đầu Với Amazon EKS MCP Server

### Điều Kiện Tiên Quyết

#### AWS Configuration

- **Bắt buộc**: AWS CLI phải được install và configure trên máy
- Configure profile sử dụng trong MCP configuration (tham khảo document: [Configuration and credential file settings in the AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/v1/userguide/cli-configure-files.html))
- Trong scenario của blog post này, AWS profile cần được configure với access đến us-west-2 region

#### MCP Client

- Có thể sử dụng một trong nhiều agent tool hỗ trợ MCP
- Blog post này sử dụng [Kiro CLI](http://kiro.dev/cli/) làm client
- Setup MCP client configuration của Kiro CLI theo [MCP configuration file specification](https://kiro.dev/docs/cli/mcp/#configuration-file)

#### Python Environment

- **Bắt buộc**: Python [uv package manager phải được install](https://docs.astral.sh/uv/getting-started/installation/)
- Package manager tự động download và chạy mcp-proxy-for-aws package, không cần install riêng
- MCP proxy cho phép client kết nối với remote AWS-hosted MCP server sử dụng AWS SigV4 authentication

#### AWS Identity and Access Management (IAM) Permission

**Basic Permission**:

- AWS profile cần EKS-related IAM permission để read EKS cluster, access CloudWatch log và view Kubernetes resource
- Khi grant access đến AWS profile, tuân theo least privilege principle

**Permission Cần Thiết Để Kết Nối MCP Server**:

- `eks-mcp:InvokeMcp`: Cần thiết để initialization và get thông tin về available tool
- `eks-mcp:CallReadOnlyTool`: Cần thiết để sử dụng read-only tool
- `eks-mcp:CallPrivilegedTool`: Cần thiết để sử dụng full access (write) tool

### Configuration

#### Architecture

Fully managed EKS MCP Server architecture kết nối MCP client an toàn với AWS service sử dụng AWS SigV4 authentication.

**Communication Flow**:

1. AI client (như Kiro CLI)
2. MCP proxy (mcp-proxy-for-aws)
3. AWS SigV4 authentication
4. EKS MCP Server (AWS hosted)
5. EKS cluster / CloudWatch / Knowledge Base

#### Ví Dụ Cấu Hình Kiro CLI

```json
{
  "mcpServers": {
    "eks-mcp": {
      "disabled": false,
      "type": "stdio",
      "command": "uvx",
      "args": [
        "mcp-proxy-for-aws@latest",
        "https://eks-mcp.us-west-2.api.aws/mcp",
        "--service",
        "eks-mcp",
        "--profile",
        "default",
        "--region",
        "us-west-2"
      ]
    }
  }
}
```

**Chi Tiết Configuration**:

- **Endpoint URL**: `https://eks-mcp.{AWS_REGION}.api.aws/mcp` (lưu ý us-west-2 region, đây là region nơi MCP Server được host)
- **--profile flag**: Reference local AWS profile được sử dụng để kết nối MCP Server (optional, có thể dùng environment variable `AWS_PROFILE`)
- **--region flag**: Reference region để scope EKS cluster làm việc

### Tool Access Level

EKS MCP Server hỗ trợ 2 access level.

#### Read-Only Mode

- **Flag**: `--read-only`
- **Access**: Cung cấp access đến tất cả read operation và documentation tool

#### Full Access Mode

- **Mô tả**: Full access mode
- **Access**: Ngoài tất cả read-only tool, còn bao gồm write operation như tạo cluster, resource management, thay đổi policy

## Scenario 1: EKS Cluster Upgrade Với Conversational AI

Khả năng của EKS MCP Server đánh giá cluster upgrade readiness sử dụng EKS insights là tính năng quan trọng. Section này demo cách check xem EKS cluster đã sẵn sàng upgrade Kubernetes version chưa.

### Check Upgrade Readiness

#### Ví Dụ Prompt

```
Assess my EKS Auto cluster's upgrade readiness, including support status, 
upgrade timeline, and any blocking issues

(Dịch: Đánh giá upgrade readiness của my EKS Auto cluster, bao gồm support status,
upgrade timeline và mọi blocking issue)
```

Process bao gồm 3 bước đơn giản:

1. List available cluster để identify cluster cần check
2. Get upgrade readiness insight để đánh giá compatibility
3. Search EKS documentation để identify timeline

#### 1. List EKS Cluster

- **Tool sử dụng**: `list_eks_resources`
- **Chức năng**: Discover available cluster
- **Bước tiếp theo**: Get configuration thông qua `describe_eks_resource`

**Kết quả**: Chỉ ra có 1 cluster tên "my-auto-cluster" available để đánh giá

#### 2. Check Upgrade Readiness Insight

- **Tool sử dụng**: `get_eks_insights`
- **Category**: `UPGRADE_READINESS`
- **Chức năng**: Đánh giá cluster upgrade readiness

#### 3. Search EKS Documentation

- **Tool sử dụng**: EKS documentation search
- **Nội dung search**: Timeline và pricing của upgrade

### Upgrade Readiness Report

Dựa trên insight analysis, comprehensive upgrade readiness report được generate.

#### Nội Dung Report

- **Cluster name**: my-auto-cluster
- **Upgrade target**: Kubernetes 1.33
- **Status**: Hoàn toàn sẵn sàng upgrade
- **Compatibility check**: Tất cả critical compatibility check đều pass
- **Blocking issue**: Không identify được issue nào có thể block upgrade

### Key Benefit Của Việc Sử Dụng EKS MCP Cho Upgrade

1. **Automatic Assessment**
   - Không cần manually check nhiều component

2. **Comprehensive Coverage**
   - Đánh giá addon, node compatibility và cluster health

3. **Clear Guidance**
   - Cung cấp lý do cụ thể cho mỗi kết quả check

4. **Proactive Warning**
   - Identify potential issue trước khi chúng trở thành blocker

5. **EKS Auto Mode Awareness**
   - Hiểu latest EKS deployment pattern

**Hiệu quả**: Tự động check compatibility trước upgrade, giảm thời gian preparation và giảm deployment failure.

## Scenario 2: Application Deployment Bằng Natural Language

EKS MCP Server cho phép high-level workflow thông qua natural language prompt.

### Ví Dụ Prompt

```
I want to deploy a simple web app to my EKS cluster named my-auto-cluster 
that shows 'Hello EKS!' on the page. Use the image from 
public.ecr.aws/docker/library/httpd:2 as the base, customize it with my message, 
push it to ECR as linux amd64, and make it accessible from the internet using 
a load balancer

(Dịch: Tôi muốn deploy simple web app đến EKS cluster tên my-auto-cluster 
hiển thị 'Hello EKS!' trên page. Sử dụng image từ public.ecr.aws/docker/library/httpd:2
làm base, customize với message của tôi, push đến ECR dưới dạng linux amd64, 
và làm cho nó accessible từ internet sử dụng load balancer)
```

Agent (Kiro CLI) orchestrate nhiều EKS MCP tool để hoàn thành workflow này.

### Key EKS MCP Tool Operation

#### 1. Generate Application Manifest

- **Tool sử dụng**: `generate_app_manifest`
- **Chức năng**: Tạo production-ready Kubernetes manifest với minimal input
- **Auto-configuration**: Tự động configure deployment, service và load balancer

#### 2. Streamlined Deployment

- **Tool sử dụng**: `apply_yaml`
- **Chức năng**: Replace complex kubectl workflow
- **Execution**: Deploy multi-resource YAML configuration trong single operation

#### 3. Resource Discovery và Status

- **Tool sử dụng**: Combination của `list_k8s_resources` và `read_k8s_resource`
- **Chức năng**: Discover deployed resource với intelligent filtering
- **Get detail**: Retrieve detailed configuration

#### 4. Application Log và Event

- **Tool sử dụng**: Combination của `get_pod_logs` và `get_k8s_events`
- **Chức năng**: Hiển thị cả container log và Kubernetes event
- **Debug**: Cung cấp comprehensive debugging capability

#### 5. CloudWatch Observability

- **Tool sử dụng**: Combination của `get_eks_metrics_guidance`, `get_cloudwatch_metrics`, `get_cloudwatch_logs`
- **Chức năng**: Cung cấp complete observability setup và monitoring

### Deployment Summary

Complete deployment workflow demo sức mạnh của EKS MCP tool seamlessly work cùng nhau.

**Đặc Điểm Workflow**:

- Chuyển đổi multi-step deployment thành single conversational request
- Cung cấp thông tin ở mỗi giai đoạn
- Tự động xử lý orchestration, error và monitoring

**Kết quả**: Complete web application accessible thông qua AWS Network Load Balancer

Bạn có thể thấy EKS MCP server simplify complex deployment workflow thành simple conversational request như thế nào.

## Scenario 3: Infrastructure Issue Troubleshooting

Khi issue span Kubernetes và AWS infrastructure boundary, EKS MCP Server diagnose hiệu quả.

### Ví Dụ Prompt

```
My LoadBalancer service hello-eks-app in the default namespace on my EKS cluster 
my-auto-cluster is stuck in pending state and not getting an external IP. 
Can you help me troubleshoot what's wrong and fix it?

(Dịch: LoadBalancer service hello-eks-app trong default namespace trên EKS cluster 
my-auto-cluster stuck ở pending state và không nhận được external IP. 
Bạn có thể giúp troubleshoot vấn đề và fix không?)
```

Agent orchestrate nhiều EKS MCP tool để diagnose và resolve vấn đề.

### Key EKS MCP Tool Operation

#### 1. Service Status Analysis

- **Tool sử dụng**: `read_k8s_resource`
- **Chức năng**: Retrieve LoadBalancer service configuration và status
- **Discovery**: Service đã được tạo nhưng không được assign external IP

#### 2. Event Investigation

- **Tool sử dụng**: `get_k8s_events`
- **Chức năng**: Investigate Kubernetes event của service
- **Critical Discovery**: Phát hiện error message chỉ ra subnet thiếu required `kubernetes.io/role/elb` tag

#### 3. Troubleshooting Knowledge Base

- **Tool sử dụng**: `search_eks_troubleshooting_guide`
- **Chức năng**: Search specialized EKS troubleshooting knowledge base
- **Nội dung search**: Guidance về LoadBalancer service issue và subnet tag requirement

#### 4. Infrastructure Analysis

- **Tool sử dụng**: `get_eks_vpc_config`
- **Chức năng**: Retrieve comprehensive VPC và subnet configuration detail
- **Identify**: Identify specific public subnet cần missing tag

### Troubleshooting Summary

Complete troubleshooting workflow demo cách EKS MCP tool bridge Kubernetes và AWS domain.

**Sức Mạnh Integration**:

- EKS MCP Server cho phép comprehensive troubleshooting thường require chuyên môn về cả Kubernetes và AWS infrastructure
- Integrate complex diagnostic workflow vào single conversational interface

## Amazon Q Console Integration Enhanced EKS Experience

Amazon EKS mang agent experience trực tiếp vào console vượt ra ngoài CLI và IDE thông qua Amazon Q integration.

### Integrated AI Assistance

Button "Inspect with Amazon Q" được đặt strategically xuyên suốt nhiều console section.

#### Cluster Health Issue

- **Chức năng**: Khi detect health issue, click "Inspect"
- **Thông tin cung cấp**: Nhận AI-powered analysis và remediation suggestion cho issue như disabled KMS key hoặc configuration problem

#### Upgrade Insight

- **Chức năng**: Cho upgrade readiness check
- **Thông tin cung cấp**: Inspection feature cung cấp detailed explanation về compatibility issue, version skew problem và recommended action

#### Node Health Monitoring

- **Chức năng**: Phân tích individual node issue
- **Correlation**: Correlate node status với underlying infrastructure issue

#### Observability Data

- **Đối tượng**: Broken webhook, HTTP error pattern, API server issue, v.v.
- **Chức năng**: Complex observability data trở nên accessible hơn thông qua AI-powered explanation

### Contextual Intelligence

Inspection feature leverage Amazon Q capability và present insight trực tiếp trong console context.

**Lợi Ích**:

- Không cần switch tool hoặc manually correlate thông tin giữa different AWS service
- Seamless transition từ visual dashboard đến conversational troubleshooting
- EKS management trở nên intuitive hơn cho team với various level Kubernetes expertise

## Tổng Kết

Preview của Amazon EKS MCP Server transform cách team interact với Kubernetes bằng cách làm complex operation accessible thông qua natural language.

### Điểm Chính

- **Natural Language Interface**: Quản lý EKS thông qua conversation thay vì complex kubectl command
- **Fully Managed**: Không cần installation/maintenance, auto update
- **Centralized Access Management**: Secure access control thông qua IAM integration
- **Enhanced Troubleshooting**: Knowledge base được xây dựng từ AWS experience vận hành hàng triệu cluster
- **Audit và Compliance**: CloudTrail integration record tất cả operation
- **Amazon Q Integration**: Cung cấp AI assistance trực tiếp trong console

### Tính Khả Dụng

Preview EKS MCP Server available trong tất cả AWS commercial region trừ AWS GovCloud (US) region và China region.

### Bước Tiếp Theo

Sẵn sàng experience conversational EKS management?

1. Sử dụng setup instruction trong article này để configure EKS MCP Server trong environment
2. Bắt đầu với read-only operation để explore cluster insight
3. Dần dần expand sang full management capability khi team familiar với conversational interface

Thay vì require deep expertise across multiple domain, team giờ có thể manage EKS cluster thông qua conversational interface seamlessly bridge Kubernetes và AWS service.

### Thông Tin Thêm

- [Amazon EKS User Guide](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eks-mcp-tool-configurations.html)
- [MCP Protocol Specification](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Kiro CLI Documentation](https://kiro.dev/docs/cli/mcp/)

---

**Dịch bởi**: Ichikawa (Senior Partner Solutions Architect)  
**Ngày xuất bản**: 02/12/2025  
**Bài gốc**: [Introducing the fully managed Amazon EKS MCP Server (preview)](https://aws.amazon.com/blogs/containers/introducing-the-fully-managed-amazon-eks-mcp-server-preview/) (Xuất bản ngày 21/11/2025)
