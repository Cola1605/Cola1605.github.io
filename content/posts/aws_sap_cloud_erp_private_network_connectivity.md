---
title: "Xây dựng Hybrid Network Connectivity cấp Enterprise cho SAP Cloud ERP Private trên AWS"
date: 2025-11-14
draft: false
categories: ["AWS", "Business and Technology", "Security and Networking", "Development"]
tags: ["SAP Cloud ERP Private", "RISE with SAP", "AWS Direct Connect", "Site-to-Site VPN", "Landing Zone", "Transit Gateway", "Network Architecture"]
author: "AWS SAP Team"
translator: "日平"
description: "Hướng dẫn toàn diện về 3 phương pháp chiến lược để kết nối SAP Cloud ERP Private (cũ RISE with SAP) với on-premises environments sử dụng AWS Direct Connect, VPN và Landing Zone Accelerator"
---

# Xây dựng Hybrid Network Connectivity cấp Enterprise cho SAP Cloud ERP Private trên AWS

**Tác giả**: AWS SAP Team  
**Dịch giả**: Koshi Matsumoto (松本) & 日平  
**Ngày phát hành**: 14/11/2025  
**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/building-enterprise-ready-hybrid-network-connectivity-on-aws-for-sap-cloud-erp-private-formerly-known-as-rise-with-sap/)

---

## Tổng quan

Bài viết giải thích 3 phương pháp chiến lược để kết nối SAP Cloud ERP Private (trước đây là RISE with SAP) với on-premises environments. Đây là hướng dẫn toàn diện để xây dựng hybrid network connectivity cấp enterprise leverage AWS Direct Connect, Site-to-Site VPN, và Landing Zone Accelerator.

## Giới thiệu

SAP Cloud ERP Private (trước đây là RISE with SAP) là một transformational solution cho các tổ chức tìm kiếm managed cloud ERP solutions. Khi mở rộng on-premises infrastructure đến cloud environment do SAP cung cấp, việc thiết lập robust, secure và reliable network connectivity là điều quan trọng.

Bài viết này explore 3 approaches để optimize connectivity với SAP Cloud ERP Private trên AWS, cung cấp architecture patterns, benefits và implementation considerations cho từng approach.

## Shared Responsibility Model

### Phân chia trách nhiệm SAP Cloud ERP Private

```
┌─────────────────────────────────────────────────────┐
│            SAP Cloud ERP Private                    │
│  ┌───────────────────────────────────────────────┐  │
│  │ SAP Cloud ERP Private BTP Infrastructure      │  │
│  │ (SAP quản lý)                                  │  │
│  │ - Application management                      │  │
│  │ - Security patches                            │  │
│  │ - Data backups                                │  │
│  │ - Infrastructure management                   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│            Trách nhiệm của Khách hàng                │
│  ┌───────────────────────────────────────────────┐  │
│  │ - Network connectivity design & implementation│  │
│  │ - On-premises infrastructure management       │  │
│  │ - User access management                      │  │
│  │ - Data governance và compliance               │  │
│  │ - Custom extensions development & maintenance │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Trách nhiệm của SAP:**
- Quản lý và maintain SAP applications
- Security patches và updates
- Data backups và disaster recovery
- Underlying cloud infrastructure

**Trách nhiệm của Khách hàng:**
- Design và implement network connectivity
- Quản lý on-premises infrastructure
- Quản lý user access và permissions
- Data governance và compliance
- Develop và maintain custom extensions

## 3 Connection Approaches

### Option 1: Foundation - AWS Direct Connect Dedicated Connection

**Tổng quan:**  
AWS Direct Connect thiết lập một dedicated private network connection giữa on-premises network và AWS. Nó cung cấp building block cơ bản để establish connectivity với SAP Cloud ERP Private.

#### Architecture

```
┌─────────────────────────────────────────────────────┐
│          On-premises Environment                    │
│  ┌───────────────────────────────────────────────┐  │
│  │ Data Center                                   │  │
│  │ - On-premises servers                         │  │
│  │ - Legacy systems                              │  │
│  └───────────────┬───────────────────────────────┘  │
└──────────────────┼──────────────────────────────────┘
                   │
             ┌─────▼─────┐
             │  Direct   │
             │  Connect  │
             │  Connection│
             └─────┬─────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              AWS Environment                         │
│  ┌───────────────────────────────────────────────┐  │
│  │ Virtual Private Gateway                       │  │
│  │  - VPN connection termination                 │  │
│  │  - Routing management                         │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │ SAP Cloud ERP Private                         │  │
│  │  - SAP S/4HANA                                 │  │
│  │  - SAP BTP Services                            │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### Technical Specifications

**Hosted Connections:**
- Bandwidth: 50Mbps, 100Mbps, 200Mbps, 300Mbps, 400Mbps, 500Mbps, 1Gbps, 2Gbps, 5Gbps, 10Gbps, 25Gbps
- Use case: Small to medium workloads
- Provisioning: Qua AWS Partner Network (APN) partners

**Dedicated Connections:**
- Bandwidth: 1Gbps, 10Gbps, 100Gbps port speeds
- Use case: Large enterprise workloads
- Provisioning: Qua AWS Direct Connect locations

#### Key Benefits

1. **Predictable Network Performance**  
   Cung cấp consistent latency và bandwidth bằng cách bypass internet traffic

2. **Enhanced Security**  
   Private connection giảm exposure đến public internet

3. **Cost Efficiency**  
   Giảm data transfer costs cho high-volume data transfers

4. **Improved Reliability**  
   Dedicated connection cung cấp higher uptime được backed bởi SLA

#### Considerations

- **Lead Time:** Typically mất 6-8 tuần để establish Direct Connect connection
- **Redundancy:** Khuyến nghị multiple connections cho high availability
- **Bandwidth Planning:** Đánh giá current và future data transfer requirements
- **Cost:** Consider port-hour charges và data transfer rates

### Option 2: Integrated - AWS Direct Connect + Site-to-Site VPN Hybrid Approach

**Tổng quan:**  
Approach này kết hợp robustness của AWS Direct Connect với flexibility của AWS Site-to-Site VPN, cung cấp redundancy và disaster recovery capabilities.

#### Architecture

```
┌─────────────────────────────────────────────────────┐
│          On-premises Environment                    │
│  ┌───────────────────────────────────────────────┐  │
│  │ Data Center                                   │  │
│  │ - Primary site                                │  │
│  │ - DR site                                     │  │
│  └───────────┬───────────────┬───────────────────┘  │
└──────────────┼───────────────┼──────────────────────┘
               │               │
       ┌───────▼──────┐ ┌─────▼──────┐
       │  Direct      │ │  VPN       │
       │  Connect     │ │  Connection│
       │  (Primary)   │ │  (Backup)  │
       └───────┬──────┘ └─────┬──────┘
               │               │
┌──────────────▼───────────────▼──────────────────────┐
│              AWS Environment                         │
│  ┌───────────────────────────────────────────────┐  │
│  │ Virtual Private Gateway                       │  │
│  │  - Multi-path redundancy                      │  │
│  │  - Automatic failover                         │  │
│  └───────────────┬───────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────▼───────────────────────────────┐  │
│  │ SAP Cloud ERP Private                         │  │
│  │  - High availability configuration            │  │
│  │  - Continuous business operations             │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### Site-to-Site VPN Features

**Technical Specifications:**
- **Encryption:** Secure tunnels với IPsec encryption
- **Bandwidth:** Up to 1.25 Gbps (higher thông qua multiple tunnels)
- **Redundancy:** 2 tunnels cho mỗi VPN connection (high availability)
- **BGP Support:** Border Gateway Protocol cho dynamic routing
- **Deployment Speed:** Setup có thể hoàn thành trong vài phút

#### Hybrid Approach Benefits

1. **High Availability Architecture**  
   Direct Connect hoạt động như primary path, VPN như failover path

2. **Cost Optimization**  
   Sử dụng high-bandwidth Direct Connect cho normal traffic, low-cost VPN cho failover

3. **Quick Initial Deployment**  
   Sử dụng VPN để start connectivity ngay lập tức trong khi Direct Connect đang được establish

4. **Enhanced Disaster Recovery**  
   Multiple paths possible thông qua secondary VPN connection

5. **Flexibility**  
   Dynamically route traffic dựa trên business needs

#### Implementation Patterns

**Pattern 1: Active/Passive Failover**
- Direct Connect xử lý tất cả normal traffic
- VPN standby và automatically activates khi Direct Connect fails

**Pattern 2: Active/Active Load Balancing**
- Traffic được distribute across cả hai connections (weighted bởi BGP)
- Optimal bandwidth utilization và further redundancy

**Pattern 3: Hybrid Traffic Segregation**
- Mission-critical SAP traffic qua Direct Connect
- Development/test environments qua VPN

#### Considerations

- **Routing Policies:** Configure BGP route preferences cho proper traffic distribution
- **Monitoring:** Track health và performance của cả hai connections
- **Cost Management:** Hiểu pricing models của cả hai connection types
- **VPN Throughput Limits:** Factor in bandwidth limitations của VPN vào planning

### Option 3: Comprehensive - AWS Landing Zone Accelerator + Transit Gateway

**Tổng quan:**  
Đây là comprehensive enterprise-grade solution nhất leverage AWS Landing Zone Accelerator (LZA) và AWS Transit Gateway. Nó cung cấp một centralized network hub spanning multiple VPCs, accounts, và on-premises networks.

#### Enterprise Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   On-premises Environment                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Head Office / Data Center                                │   │
│  │ - SAP integrated systems                                 │   │
│  │ - Legacy applications                                    │   │
│  └──────────────────┬───────────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────────┘
                      │
              ┌───────▼──────┐
              │  Direct      │
              │  Connect /   │
              │  VPN         │
              └───────┬──────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│              AWS Landing Zone (Multi-account)                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          AWS Transit Gateway (Central Hub)               │  │
│  │  - VPC và on-premises routing                            │  │
│  │  - Security policy enforcement                           │  │
│  │  - Traffic inspection                                    │  │
│  └────┬──────────┬──────────┬──────────┬────────────────────┘  │
│       │          │          │          │                        │
│  ┌────▼───┐ ┌───▼────┐ ┌──▼─────┐ ┌──▼─────────┐              │
│  │Production│ │Staging │ │Dev/Test│ │SAP Cloud  │              │
│  │   VPC    │ │  VPC   │ │  VPC   │ │ERP Private│              │
│  │          │ │        │ │        │ │   VPC     │              │
│  │ - SAP    │ │ - UAT  │ │ - Dev  │ │ - S/4HANA │              │
│  │   Apps   │ │   Env  │ │   Env  │ │ - Fiori   │              │
│  │ - DBs    │ │        │ │        │ │ - BTP     │              │
│  └──────────┘ └────────┘ └────────┘ └───────────┘              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Security và Governance Layer                      │  │
│  │  - AWS Control Tower                                     │  │
│  │  - AWS Organizations                                     │  │
│  │  - AWS Config / CloudTrail                               │  │
│  │  - Security groups và NACLs                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### AWS Landing Zone Accelerator (LZA)

**Tổng quan:**  
LZA là một open-source solution để rapidly setup multi-account AWS environment dựa trên AWS Well-Architected Framework.

**Key Components:**

1. **Multi-Account Strategy**
   - Core accounts: Security, log archive, network
   - Workload accounts: Production, staging, development
   - SAP-specific accounts: SAP Cloud ERP Private integration

2. **Network Architecture**
   - Transit Gateway: Central routing hub
   - Network segmentation: Isolation giữa environments
   - Centralized egress: Control outbound internet traffic

3. **Security và Compliance**
   - AWS Control Tower: Governance và organization management
   - AWS Config: Resource configuration và compliance monitoring
   - AWS CloudTrail: Comprehensive audit logging
   - AWS Security Hub: Unified security view

4. **Automation và IaC**
   - Infrastructure as Code (CloudFormation/Terraform)
   - Automated account provisioning
   - Configuration drift detection

#### AWS Transit Gateway

**Tổng quan:**  
Transit Gateway hoạt động như một cloud router kết nối VPCs và on-premises networks. Nó simplifies network architecture và reduces operational complexity.

**Technical Specifications:**

**Scalability:**
- Up to 5,000 VPC attachments
- Up to 50 Gbps burst bandwidth per region
- Multi-region peering support

**Routing Capabilities:**
- Multicast support
- Segmentation qua route table isolation
- BGP route propagation
- Equal-cost multi-path routing (ECMP)

**Security:**
- Network firewall integration
- Traffic inspection points
- Access control tại VPC attachment level

#### Enterprise Benefits

1. **Centralized Network Management**  
   Quản lý multiple VPCs và accounts từ single control plane

2. **Scalable Architecture**  
   Thêm workloads và connections không cần major architectural changes

3. **Security và Compliance**  
   Built-in governance, audit, và compliance frameworks

4. **Cost Optimization**  
   Reduced data transfer costs và optimized resource utilization

5. **Operational Efficiency**  
   Automation, Infrastructure as Code, và centralized management

6. **Well-Architected Foundation**  
   Proven reference architecture dựa trên AWS best practices

#### Implementation Steps

**Phase 1: Landing Zone Foundation**
1. Establish AWS Control Tower environment
2. Tạo core accounts (security, logs, network)
3. Configure guardrails và policies
4. Setup centralized logging và monitoring

**Phase 2: Network Infrastructure**
1. Deploy Transit Gateway trong network account
2. Establish Direct Connect / VPN connections
3. Attach VPCs đến Transit Gateway
4. Configure route tables và segmentation

**Phase 3: SAP Integration**
1. Tạo dedicated VPC cho SAP Cloud ERP Private
2. Connect SAP VPC đến Transit Gateway
3. Test connectivity với on-premises SAP systems
4. Validate traffic flows và security policies

**Phase 4: Security và Compliance**
1. Enable AWS Security Hub
2. Implement AWS Config rules
3. Deploy network firewalls (if needed)
4. Configure traffic inspection

#### Considerations

- **Complexity:** Most comprehensive nhưng cũng most complex setup
- **Skill Requirements:** Cần deep expertise trong AWS networking và security
- **Cost:** Additional AWS services và management overhead
- **Timeline:** Có thể mất vài tuần đến vài tháng cho full implementation
- **Governance:** Cần ongoing management và maintenance

## Combined Strategies cho Enterprise Success

Trong thực tế, nhiều organizations combine multiple approaches để achieve optimal results.

### Recommended Combination Patterns

**Pattern 1: Foundation + Integrated**
- Sử dụng Direct Connect như primary connection
- Sử dụng VPN cho backup và failover
- Ideal cho small to medium organizations

**Pattern 2: Integrated + Comprehensive**
- Start với hybrid connectivity (Direct Connect + VPN)
- Gradually mở rộng đến Landing Zone và Transit Gateway
- Ideal cho growing enterprises

**Pattern 3: Full Comprehensive**
- Integrate tất cả components
- Cho large enterprise environments
- Maximum scalability và security

## Decision Factors

Khi chọn right approach, consider các factors sau:

### 1. Performance Requirements

- **Latency Sensitivity:** Real-time SAP transactions cần low latency
- **Bandwidth Needs:** Data volumes và peak usage patterns
- **Transaction Volume:** Number của concurrent SAP users và processes

### 2. Budget Considerations

- **Initial Investment:** Setup và hardware costs
- **Ongoing Costs:** Monthly và yearly operational expenses
- **ROI:** Long-term value và cost savings

### 3. Timeline

- **Urgency:** Business timelines và constraints
- **Phased Approach:** Balance immediate needs với long-term goals
- **Lead Times:** Provisioning time cho mỗi component

### 4. Growth Plans

- **Scalability:** Future workload và user growth
- **Extensibility:** Thêm additional services và integrations
- **Global Expansion:** Multi-region requirements

### 5. Compliance Requirements

- **Data Residency:** Regulatory constraints về data location
- **Security Standards:** Industry-specific compliance requirements
- **Audit Requirements:** Logging và monitoring needs

## Implementation Planning

### Recommended Approach

1. **Assessment Phase (2-4 tuần)**
   - Assess current environment và business requirements
   - Conduct technical feasibility studies
   - Perform cost analysis cho mỗi option

2. **Design Phase (2-4 tuần)**
   - Tạo detailed network architecture
   - Document security và compliance requirements
   - Develop implementation plan và timeline

3. **Pilot Phase (4-8 tuần)**
   - Implement PoC trong non-production environment
   - Test performance và security
   - Validate traffic patterns và challenges

4. **Production Rollout (6-12 tuần)**
   - Gradually migrate đến production environment
   - Conduct user acceptance testing
   - Establish monitoring và alerting

5. **Optimization Phase (Ongoing)**
   - Monitor performance metrics
   - Optimize costs
   - Adapt to changing business needs

## Support Resources

### AWS Support

- **AWS Enterprise Support:** 24/7 technical support và architecture guidance
- **AWS Professional Services:** Customized implementation assistance
- **AWS Partner Network:** Specialized services từ certified partners

### SAP Support

- **SAP Technical Support:** SAP Cloud ERP Private specific issues
- **SAP Enterprise Support:** Comprehensive SAP ecosystem support
- **SAP Customer Success Partners:** Implementation và best practices guidance

### Documentation và Resources

- [AWS Direct Connect Documentation](https://docs.aws.amazon.com/directconnect/)
- [AWS Site-to-Site VPN Documentation](https://docs.aws.amazon.com/vpn/)
- [AWS Landing Zone Accelerator](https://aws.amazon.com/solutions/landing-zone-accelerator/)
- [AWS Transit Gateway Documentation](https://docs.aws.amazon.com/transit-gateway/)
- [SAP on AWS Resources](https://aws.amazon.com/sap/)

## Tổng kết

Xây dựng enterprise-grade hybrid network connectivity với SAP Cloud ERP Private trên AWS là một strategic decision tính đến cả current business needs và future growth plans.

**Summary của 3 Approaches:**

1. **Foundation (Direct Connect):** Solid foundation với dedicated connection
2. **Integrated (Direct Connect + VPN):** Balance của redundancy và cost optimization
3. **Comprehensive (Landing Zone + Transit Gateway):** Enterprise-grade scalability và security

Right choice phụ thuộc vào organization-specific requirements, resources, và long-term strategic objectives. Nhiều organizations achieve success bằng cách start với basic connectivity đáp ứng immediate needs và gradually mở rộng đến more comprehensive solutions khi business evolves.

Key là establish một robust network foundation hỗ trợ scalability, security, và operational efficiency, enabling organizations realize maximum value từ SAP Cloud ERP Private investment trên AWS.

Để tìm hiểu thêm về SAP workloads trên AWS, visit [AWS for SAP](https://aws.amazon.com/sap/).

## Next Steps

1. **Bắt đầu Assessment:** Evaluate current network infrastructure và requirements
2. **Consult với AWS Team:** Discuss với AWS Solution Architects hoặc partners
3. **Plan PoC:** Design proof-of-concept cho selected approach
4. **Develop Implementation Roadmap:** Tạo phased implementation plan

---

**Từ khóa**: SAP Cloud ERP Private, RISE with SAP, AWS Direct Connect, Site-to-Site VPN, Landing Zone, Transit Gateway, Network Architecture, Hybrid Connectivity, Enterprise Networking
