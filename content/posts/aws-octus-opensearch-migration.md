---
title: "Octus Giảm 85% Chi phí Infrastructure với Zero-Downtime Migration sang Amazon OpenSearch Service"
date: 2025-12-04T13:00:00+09:00
categories: ["Cloud", "DevOps and Infrastructure", "Security and Networking"]
tags: ["OpenSearch", "Migration", "Cost Optimization", "Zero Downtime", "Elasticsearch", "Case Study", "Infrastructure", "SRE"]
author: "Harmandeep Sethi, Serhii Shevchenko, Govind Bajaj, Virendra Shinde, Brian Presley, Andre Kurait, Vaibhav Sabharwal"
translator: "日平"
---

# Octus Giảm 85% Chi phí Infrastructure với Zero-Downtime Migration sang Amazon OpenSearch Service

## Giới thiệu về Octus

### Tổng quan Công ty

**Octus** (trước đây là Reorg) được thành lập năm 2013, là nhà cung cấp credit intelligence và data hàng đầu thế giới cho:

- **Buyside firms**: Các công ty đầu tư
- **Investment banks**: Ngân hàng đầu tư
- **Law firms**: Văn phòng luật
- **Advisory firms**: Công ty tư vấn

### Value Proposition

Octus **bổ sung chuyên môn con người vô song** bằng công nghệ, data và AI tools đã được chứng minh, cung cấp **insights mạnh mẽ** thúc đẩy hành động quyết định trong toàn bộ ngành tài chính.

### Thách thức

Khi data volume tăng theo cấp số nhân, áp lực tối ưu hóa chi phí search infrastructure trong khi duy trì **high performance** và **reliability** cho mission-critical workload ngày càng tăng. Nhiều công ty đối mặt với:

- **High cost**: Hệ thống search phức tạp và đắt đỏ
- **Operational overhead**: Gánh nặng vận hành lớn
- **Scaling limitation**: Hạn chế khả năng mở rộng hiệu quả

## Yêu cầu Chiến lược (Strategic Requirements)

Octus xác định các yêu cầu then chốt khi lựa chọn migration sang Amazon OpenSearch Service:

### 1. Cost Efficiency (Hiệu quả Chi phí)

**Pricing model** của OpenSearch Service cho phép tối ưu hóa cloud spending mà không làm giảm performance.

- **Tài liệu**: [OpenSearch Service Pricing](https://aws.amazon.com/opensearch-service/pricing/)

### 2. Rapid Support (Hỗ trợ Nhanh chóng)

AWS cung cấp **high-quality support** đáng tin cậy:

- Tăng tốc problem resolution
- Nâng cao reliability

### 3. Consistent Reliability (Độ tin cậy Nhất quán)

OpenSearch Service cung cấp **SLA lên tới 99.99%**:

- Đảm bảo reliability cần thiết cho mission-critical workload của Octus
- **Tài liệu**: [OpenSearch Service SLA](https://aws.amazon.com/opensearch-service/sla/)

### 4. Seamless Migration without Query Downtime

**Migration Assistant for Amazon OpenSearch Service** cung cấp migration path:

- **Zero downtime**: Không gián đoạn query availability trong suốt quá trình migration
- **Business continuity**: Đảm bảo tính liên tục của business
- **Tài liệu**: [Migration Assistant Solution](https://aws.amazon.com/solutions/implementations/migration-assistant-for-amazon-opensearch-service/)

### 5. Operational Simplification (Đơn giản hóa Vận hành)

Tích hợp với AWS giảm infrastructure complexity trong khi duy trì **high security standards**.

## Tổng quan Giải pháp (Solution Overview)

### Migration Assistant Features

#### 1. Metadata Migration

**Chức năng**:
- Migrate hàng chục index với diverse mappings và settings
- Xử lý backward compatibility issues với **custom JavaScript transformations**

**Ví dụ**:
- Khi phát hiện backward compatibility issue với timestamp metadata
- Custom JavaScript transformation được tích hợp trực tiếp vào Migration Assistant tool
- Tự động điều chỉnh mapping toàn bộ index để đảm bảo compatibility

#### 2. Historical Data Migration (Reindex-from-Snapshot)

**Workflow**:
- Migrate historical documents từ point-in-time snapshot của source cluster
- Snapshot được lưu trên **Amazon S3**
- Scale process mà không ảnh hưởng source cluster

**Optimization**:
- Điều chỉnh sharding scheme trong quá trình migration
- Tối ưu hóa cluster performance tại target

#### 3. Live Traffic Replay

**Quá trình**:
1. Backfill hoàn tất
2. **Traffic Replayer** sử dụng captured live traffic (từ Traffic Capture Proxy)
3. Gửi đến target cluster với request transformation cần thiết để đảm bảo compatibility

**Kết quả**:
- Target cluster chứa documents từ source cluster
- Updates được thực thi real-time

### Kiến trúc Migration (Architecture)

Migration Assistant cung cấp **architecture diagram** với các bước sau:

#### Bước 1: Client Traffic
- Client traffic được gửi đến existing cluster

#### Bước 2: Traffic Capture
- **Application Load Balancer** với Capture Proxy relay traffic đến source
- Đồng thời replicate data đến **Amazon MSK** (Managed Streaming for Apache Kafka)

#### Bước 3: Snapshot và Metadata Migration
- Sử dụng migration console để lấy point-in-time snapshot
- Sau khi snapshot hoàn tất, sử dụng **Metadata Migration Tool**
- Thiết lập index, template, component template, alias trên target cluster
- **Reindex-from-Snapshot** migrate data từ source (trong khi traffic capture liên tục)

#### Bước 4: Traffic Replay
- Sau khi Reindex-from-Snapshot hoàn tất
- Captured traffic từ Amazon MSK được replay bởi **Traffic Replayer** đến target cluster

#### Bước 5: Performance Comparison
- So sánh performance và behavior của traffic được gửi đến source và target cluster
- Xác nhận qua logs và metrics

#### Bước 6: Client Redirection
- Sau khi xác nhận target cluster hoạt động đúng như mong đợi
- Redirect client đến new target

## Hành trình Migration và Optimization đầy đủ

### 1. Pre-Migration Optimization

#### Các hoạt động Cleanup

**Xóa unused indexes**:
- Index tích lũy theo thời gian nhưng không còn sử dụng
- Giảm data volume cần migrate

**Xóa large documents**:
- Documents lớn kéo dài migration period không cần thiết
- Tăng storage transfer cost

#### Kết quả

- **Giảm đáng kể** data volume cần migrate
- **Minimize** overall migration complexity
- Sử dụng **Migration Assistant tools hiệu quả hơn**

### 2. Technical Constraints và Version Considerations

#### Source Environment

- **Source Elasticsearch version**: 7.17
- **Python client constraint**: Bị ràng buộc với Elasticsearch 7.17 compatibility

#### Migration Strategy

**Tool lựa chọn**: **Reindex-from-Snapshot**

**Lý do**:
- Cho phép reindex data từ existing snapshot sang new OpenSearch Service cluster
- Hỗ trợ cross-system migration
- **RFS (Reindex-from-Snapshot)** rewrite cả index được tạo bằng older Lucene versions
- Đơn giản hóa future upgrade sang latest OpenSearch Service versions

#### Target Version Selection

**Target**: **OpenSearch 1.3**

**Lý do lựa chọn**:
- Minimize client-side changes
- Giảm migration complexity
- Dễ dàng upgrade sau này

**Future plan**: Octus plans to upgrade to newer OpenSearch versions khi:
- Application stack evolves
- Client library support matures
- Maintain stability achieved from migration
- Leverage latest features và performance improvements

#### Client Challenges

**R Language (R 4.5.1)**:
- **Issue**: Không có native OpenSearch 1.3 client support
- **Solution**: Develop custom client solution sử dụng **ropensci/elastic** library để integrate với OpenSearch Service domain

**Python Environment**:
- **Constraint**: Elasticsearch 7.17 client limitation
- **Impact**: Cần cân nhắc cẩn thận migration approach

**Migration Assistant advantage**: Hỗ trợ tốt hơn việc quản lý version-specific client interaction trong quá trình migration so với traditional snapshot-based method.

### 3. Application Modernization across Multiple Languages

#### Legacy PHP Systems (PHP 5.6 và Laravel 4.2)

**Changes**:
- Xử lý deprecation của mapping type trong OpenSearch request
- Mapping type specification không còn được support

**Authentication**:
- Tiếp tục sử dụng **elasticsearch connector library** với username/password authentication

#### Modern PHP Applications (PHP 8.1 và Laravel 9)

**Major changes**:
- Replace **elasticsearch/elasticsearch** library với **opensearch-project/opensearch-php** client
- Leverage **IAM authentication** để connect đến cluster

#### Python Environment

**Versions**: Python 3.8, 3.10, 3.11, 3.13  
**Frameworks**: Django 2.1, 3.2, 5.2

**Changes**:
- Replace **elasticsearch** library với **opensearch-py**
- Migrate to **IAM authentication**

#### R Applications (R 4.5.1)

**Custom library**: Sử dụng **ropensci/elastic** để ensure compatibility

### 4. Traffic Routing và Enhanced Monitoring

#### Traffic Routing

Để facilitate migration, Octus:
- Redirect existing client để route request đến source cluster qua **Migration Assistant's Traffic Capture Proxy**
- Migrate data đến target cluster từ live traffic

#### Monitoring Infrastructure Enhancement

**Octus's observability infrastructure** monitor:

**Cluster components**:
- Cluster manager và data node
- Network
- Data storage
- Security và IAM access

**Application performance**:
- Indexing performance
- Search performance

**Observability tool**: **Datadog**

**Benefits**:
- Logs và metrics được gửi trực tiếp đến Datadog
- Loại bỏ nhu cầu separate monitoring cluster
- Significantly improved observability

**Infrastructure-as-Code**:
- Datadog monitors được define using Infrastructure-as-Code
- Seamlessly integrated vào infrastructure framework

### 5. Cutover và Initial Results

#### Execution

**Site Reliability Engineering team** meticulous planning và thực hiện release:

**Achievements**:
- **Zero system application downtime**
- **Zero data loss**
- Successful migration từ Elasticsearch sang OpenSearch Service
- Successful cutover từ Elasticsearch client sang OpenSearch Service client

#### Initial Migration Phase Benefits

**Cost reduction**: **52%** cost savings

**Operational benefits**:
- Full Infrastructure-as-Code implementation cho infrastructure và monitoring
- Enhanced observability

### 6. Post-Migration Optimization

#### Data-Driven Optimization

**Data source**:
- Operational data từ production và other environments
- Provides valuable insights về actual resource consumption

**Approach**:
- Enable informed decision-making về additional cluster resizing
- Analysis của usage metrics và strategic resizing

**Results**:
- Align cluster size chính xác hơn với operational needs
- Minimize spending trong khi facilitate sustained performance

#### Additional Cost Reduction

**Optimization phase**: **Additional 33% cost reduction** so với original Elastic Cloud cost

**Total cost reduction**: **85%** compared to original Elastic Cloud cost

**Performance**: Maintained consistent optimal performance

## Migration Journey Timeline

### Tổng quan Goals

**Core migration work** và **subsequent optimization phases**:

**Goals**:
- Successfully migrate search infrastructure, application và data từ Elastic Cloud sang new OpenSearch Service domain với minimal disruption
- Continuously optimize performance và cost dựa trên actual usage data

### Infrastructure Framework

**Octus's internal custom infrastructure framework** (internal tool for infrastructure automation):

**Capabilities**:
- Build, deploy và monitor target OpenSearch Service 1.3 domain
- Establish solid foundation cho migration

**Benefits**:
- Leverage familiar internal process
- Migrate to fully-managed AWS service

**Security best practices**: [AWS Documentation - OpenSearch Service Security](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/security.html)

## Operational Monitoring

### Monitoring Tool: Datadog

Octus sử dụng **Datadog** để monitor:

**Metrics**:
- **Search latency**
- **Indexing latency**

**Visibility**: Real-time visibility into Amazon OpenSearch Service cluster performance

### Custom Datadog Dashboard

Dashboard cung cấp:

**Upper half**:
- Live view của OpenSearch Service cluster
- Overview và detailed insights về ingestion process
- Giúp hiểu storage và document count

**Lower half**:
- Time-series view của individual node health và performance metrics:
  - **Read latency**
  - **Write latency**
  - **Throughput**
  - **IO operations**

## Migration Observability

### Migration Assistant Dashboards

**Migration Assistant for Amazon OpenSearch Service** cung cấp several dashboards để observe và verify migration progress.

**Capabilities**:
- Track cả backfill progress và live capture/replay progress
- Ensure confidence trước khi switch production workload sang target cluster

### Octus Migration Example

**Data volume**: Approximately **4TB of data**  
**Migration time**: Approximately **12 hours** (05:00 to 17:00)

#### Backfill Progress Tracking

**Metrics tracked**:
- **Disk usage**: Monitor progress qua disk usage
- **Searchable documents**: Monitor progress qua searchable document count

#### Replay Lag Reduction

**Initial lag**: Tại thời điểm backfill hoàn tất (khoảng 17:00):
- Target cluster was approximately **467 minutes behind** source

**Replay process**:
- Process captured traffic với **tốc độ nhanh hơn** so với tốc độ originally ingested tại source
- **Rapidly reduce lag**

**Lag reaches zero**:
- Target cluster **fully synchronized**
- Safe to reroute production traffic

**Observation period**:
- Octus chose to **observe replayed traffic** tại target trong **several days** trước khi final switchover

## Achievements (Kết quả Đạt được)

### 1. Scalability

**Document count increase**:
- Nearly **doubled** số lượng document available cho Q&A trong 3 environments
- Achieved trong **days thay vì weeks**

**Technology**:
- Amazon ECS on AWS Fargate với autoscaling rules và controls
- Enables **elastic scalability** của service trong peak usage hours

### 2. Cost Reduction

**Total reduction**: **85%**

**Breakdown**:
- Initial migration phase: **52%** cost savings
- Post-migration optimization: Additional **33%** cost reduction
- Compared to original Elastic Cloud cost

### 3. Search Performance Improvement

**Consistent response time**: Maintained trong suốt migration

**Performance improvements**:
- **Zero negative impact** on latency
- **20% improvement** trong query throughput và overall search performance

### 4. Zero Downtime

- **Zero downtime** trong suốt migration
- **100% uptime** đạt được across all applications

### 5. Operational Overhead Reduction

**Reduction**: **30%**

**Details**:
- DevOps và SRE team experience **30% reduction** trong maintenance burden và overhead sau migration

**Additional benefit**:
- SOC2 compliance support became **easier** do sử dụng single system

### 6. Shortened Timeline

**Timeline**: Migration completed **ahead of schedule**

**Duration**: **Less than 1 quarter** từ planning đến complete completion

## Testimonial từ CTO

> "Elastic Cloud migration sang Amazon OpenSearch Service là critical component của broader strategy để minimize third-party dependencies và strengthen reliability của Octus's system infrastructure. Migration Assistant for Amazon OpenSearch Service enabled us to execute seamless migration với zero data loss và near-zero downtime for users."
>
> **— Vishal Saxena, CTO, Octus**

## Summary

### Migration Tool

**Migration Assistant for OpenSearch Service** provided comprehensive tool suite:

#### 1. Metadata Migration

- Migrate hàng chục index với diverse mappings và settings
- Handle backward compatibility issue với custom JavaScript transformation

#### 2. Reindex-from-Snapshot

- Migrate historical documents từ point-in-time snapshot
- Không impact source cluster
- Optimize sharding scheme cho performance improvement

#### 3. Live Traffic Replay

- Maintain target cluster synchronized với real-time update trong suốt migration process

### Comprehensive Results

#### Cost

- **85% reduction** trong monthly infrastructure cost

#### Scale

- Nearly **doubled** searchable document count trong 3 environments

#### Performance

- **20% improvement** trong query throughput
- Consistent response time
- Zero negative impact on latency

#### Reliability

- **Zero downtime**
- **100% uptime** across all applications

#### Operations

- **30% reduction** trong maintenance burden và operational overhead cho DevOps và SRE team

#### Timeline

- Completed **ahead of schedule**
- **Less than 1 quarter** từ planning đến complete completion

## Resources

### Migration Assistant

[Migration Assistant for Amazon OpenSearch Service](https://aws.amazon.com/solutions/implementations/migration-assistant-for-amazon-opensearch-service/)

### OpenSearch Service Security

[OpenSearch Service Security Best Practices](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/security.html)

### Octus Company Information

- **Website**: [octus.com](https://octus.com)
- **LinkedIn**: [Octus LinkedIn](https://www.linkedin.com/company/octus-credit1)
- **Twitter/X**: [@OctusCredit](https://x.com/OctusCredit)

### Về các Authors

#### Harmandeep Sethi
- **Role**: SRE Engineering và Infrastructure Framework Lead, Octus
- **Experience**: Approximately 10 years leading high-performance team trong large-scale system implementation
- **Expertise**: Driving best practices trong observability, resilience engineering, và automating operational process qua infrastructure framework

#### Serhii Shevchenko
- **Role**: Site Reliability Engineer, Octus
- **Experience**: Combined 9 years trong software development và Site Reliability Engineering
- **Key contribution**: Lead application-side developer trong company's critical migration từ Elasticsearch Cloud sang AWS OpenSearch
- **Impact**: Planning played critical role trong executing migration với zero client-facing downtime

#### Govind Bajaj
- **Role**: Senior Site Reliability Engineer, Octus
- **Experience**: Over 8 years
- **Expertise**: Designing và implementing scalable infrastructure supporting high-performance engineering team và critical system
- **Focus**: Building secure, observable và resilient platform

#### Virendra Shinde
- **Role**: Platform Lead, Octus
- **Responsibility**: Oversees cloud infrastructure, Site Reliability và core framework supporting Octus product suite
- **Background**: 2 years tại Grayscale Investments (built investor portal và data API from scratch), 8 years tại Blackstone (led multiple development team)
- **Education**: Master's degree in information management từ University of Maryland

#### Brian Presley
- **Role**: Software Development Manager, OpenSearch
- **Responsibility**: Leads team behind OpenSearch Migrations và OpenSearch Serverless
- **Focus**: Building scalable và high-impact search và analytics solution

#### Andre Kurait
- **Role**: Software Development Engineer II, AWS
- **Location**: Austin, Texas
- **Current project**: Working on Migration Assistant for Amazon OpenSearch Service
- **Background**: Previously worked tại Amazon Health Services
- **Interests**: Travel, cooking, playing trong church sports league
- **Education**: Bachelor of Science trong Computer Science và Mathematics từ University of Kansas

#### Vaibhav Sabharwal
- **Role**: Senior Solutions Architect, AWS
- **Location**: New York
- **Passion**: Learning new cloud technology và assisting customer với cloud adoption strategy, designing innovative solution, và driving operational excellence
- **Community**: Member của AWS Financial Services và Storage Technical Field Communities

---

**Translator**: 日平  
**Ngày xuất bản**: 2025-12-04  
**Source**: AWS Big Data Blog
