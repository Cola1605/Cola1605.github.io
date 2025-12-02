---
title: "Xây dựng Data Mesh Bảo mật với AWS và Partner Solutions"
slug: "aws-secure-data-mesh-partner-solutions"
description: "Kiến trúc Data Mesh bảo mật cho tổ chức tài chính với AWS, Databricks và Snowflake. Triển khai 3 yêu cầu: cross-catalog metadata federation, cross-account authentication/authorization, distributed policy reflection. Sử dụng Apache Iceberg, Lake Formation TBAC/ABAC, SageMaker Unified Studio. 2 patterns: AWS là producer/consumer. Unity Catalog, Horizon/Open Catalog integration."
date: 2025-12-01
draft: false
images: ["/images/og-aws-data-mesh.png"]
categories:
  - Cloud Computing
  - Data Management
tags:
  - Data Mesh
  - AWS Lake Formation
  - Apache Iceberg
  - Databricks
  - Snowflake
  - AWS Glue
  - SageMaker Unified Studio
  - Data Governance
  - Financial Services
  - Unity Catalog
  - TBAC
  - ABAC
author: "Shuhei Fukami"
---

Hướng dẫn chi tiết xây dựng kiến trúc Data Mesh bảo mật cho tổ chức tài chính với AWS và partners (Databricks, Snowflake). Sử dụng Apache Iceberg open table format, AWS Lake Formation, Amazon SageMaker Unified Studio để triển khai 3 yêu cầu quan trọng: cross-catalog metadata federation, cross-account authentication/authorization, distributed policy reflection. Trình bày 2 implementation patterns: AWS làm data producer và AWS làm data consumer.

<!--more-->

## Giới thiệu

### Data Mesh là gì?

Data Mesh là paradigm kiến trúc transformative đang cách mạng hóa cách organizations quản lý và chia sẻ data giữa các domains. Bằng cách coi data như products và phân tán ownership cho domain teams, Data Mesh cho phép chia sẻ data scalable, secure và efficient trong khi vẫn duy trì domain autonomy.

### Bối cảnh tổ chức tài chính

Các tổ chức tài chính đang tăng cường áp dụng kiến trúc Data Mesh để tạo comprehensive customer view trên nhiều products đa dạng trong khi vẫn duy trì domain-specific governance. Các organizations này đối mặt với những thách thức độc đáo trong môi trường quy định nơi data truyền thống bị siloed.

### Cách tiếp cận hiện đại

Cách tiếp cận Data Mesh hiện đại cho phép chia sẻ data secure ở storage level trong khi vẫn duy trì strict controls thông qua:

- Entity authentication
- Consistent access controls
- Comprehensive audit trails
- Data lineage tracking

Điều này cho phép teams chọn specialized engines tối ưu cho nhu cầu cụ thể mà không làm tổn hại đến security hoặc compliance requirements.

## 4 nguyên tắc cốt lõi của Data Mesh

### 1. Domain-oriented ownership

Ví dụ, trong tổ chức tài chính, bộ phận thẻ tín dụng sở hữu và quản lý customer transaction data như một product, cung cấp interfaces và access controls được định nghĩa rõ ràng.

### 2. Data as a product

Coi data như products, domain teams chịu trách nhiệm về data họ tạo ra.

### 3. Self-service data infrastructure

Cung cấp infrastructure cho phép teams tự quản lý data products một cách autonomous.

### 4. Federated governance

Federated governance layer điều chỉnh quyền truy cập vào data. Consumers và producers cần chia sẻ data giữa AWS native services và AWS partner platforms.

Xem thêm:
- [What is Data Mesh?](https://aws.amazon.com/jp/what-is/data-mesh/)
- [Let's Architect! Architecting a data mesh](https://aws.amazon.com/blogs/architecture/lets-architect-architecting-a-data-mesh/)

## Công nghệ chính

### Apache Iceberg Open Table Format

Apache Iceberg là open table format quan trọng cho kiến trúc Data Mesh.

#### Cross-platform compatibility

Cho phép consistent data access giữa các query engines đa dạng như:

- Amazon Athena
- Snowflake
- Databricks

Điều này rất cần thiết cho các data mesh environments khác nhau.

#### Tính năng chính

**Schema evolution**
- Cho phép thay đổi schema mà không ảnh hưởng đến consumers

**Time travel**
- Truy cập trạng thái data tại điểm thời gian cụ thể trong quá khứ

**Transactions**
- Duy trì data integrity trong distributed ownership scenarios

Các đặc tính này khiến Iceberg đáng được đánh giá cho teams đang xem xét triển khai data mesh approach.

### AWS Lake Formation

AWS Lake Formation giúp quản lý, bảo vệ và chia sẻ data cho analytics và machine learning một cách tập trung.

#### Data stores được hỗ trợ

Cung cấp fine-grained access controls cho:

- Amazon S3
- Amazon Redshift
- Metadata trong AWS Glue Data Catalog

#### Access control models

**Tag-based Access Control (TBAC)**

LF-Tags là mechanism để group các resources tương tự và grant permissions cho principals trên resource groups đó, cho phép scale permissions.

**Attribute-based Access Control (ABAC)**

Cho phép grant permissions trên resources dựa trên user attributes. Context-driven, cho phép các biện pháp security chính xác như row-level filtering dựa trên attribute values cụ thể.

### Next-generation Amazon SageMaker

#### Lakehouse architecture

Lakehouse architecture của Amazon SageMaker tích hợp data lakes và warehouses thành một open platform duy nhất sử dụng Apache Iceberg.

#### Foundation

Được xây dựng trên foundation là AWS Glue Data Catalog và AWS Lake Formation, tổ chức data thông qua catalog có thể truy cập qua open Apache Iceberg REST API, cung cấp secure data access với consistent fine-grained access controls.

#### Amazon SageMaker Unified Studio

Hoạt động như development environment và orchestration layer cho Amazon lakehouse architecture. Đây là nơi data scientists, analysts và developers tương tác và thao tác data từ cả AWS services và external partner platforms.

Xem chi tiết: [Connect, share, and query where your data sits using Amazon SageMaker Unified Studio](https://aws.amazon.com/blogs/big-data/connect-share-and-query-where-your-data-sits-using-amazon-sagemaker-unified-studio/)

## Quản lý Identity và Access Control

Khi kiến trúc Data Mesh cho cross-engine data sharing phát triển, 2 security requirements quan trọng xuất hiện:

1. **Consistent entity IDs across platforms**
2. **Unified access controls across platforms**

### User và engine identity

Trong multi-query engine environments, cả user và engine identities đều cần thiết:

- **Users**: Cần consistent IDs giữa các services (quản lý qua federated identity providers, IDP servers)
- **Engines**: Cần system IDs khi kết nối với federated data sources thay mặt users

Engines cần thiết lập trust relationships với nhau để duy trì security trong khi cho phép seamless cross-engine operations.

### Access control

Sau khi xác minh identity, access control liên quan đến 2 khía cạnh quan trọng:

1. **Policy definition**: Chỉ định actions được phép giữa AWS và non-AWS engines
2. **Policy reflection**: Implementation ở engine level với periodic synchronization

Cách tiếp cận này đảm bảo consistent security bất kể data được truy cập qua AWS hay partner engines.

### Access control models

Multi-engine data mesh tận dụng 2 complementary access control models:

#### Coarse-grained access

Coarse-grained access sử dụng IAM/S3 policies

#### Fine-grained access control (FGAC)

Fine-grained access control sử dụng Lake Formation. Hỗ trợ nhiều permission models cho quản lý permissions trong FGAC, bao gồm role-based access control với named resources có data filters:

- **Tag-based Access Control (TBAC)**
- **Attribute-based Access Control (ABAC)**

Để triển khai thành công, cần careful policy translation giữa các engines để duy trì consistent security enforcement bất kể access point nào users sử dụng để tương tác với data mesh.

## 3 yêu cầu interoperability trong Data Mesh

Data interoperability là khả năng của systems truy cập, diễn giải và xử lý data một cách secure từ common storage layer mà không duplicate. Blog này tập trung đặc biệt vào interoperability giữa data consumers và producers giữa AWS native services và partner platforms sử dụng AWS-managed storage.

### 1. Cross-catalog metadata federation

Làm cho domain data products có thể discover được across organizational boundaries thông qua federated metadata catalogs

### 2. Cross-account authentication and authorization

Triển khai secure credential management cho phép consumer query engines truy cập producer data với proper permissions

### 3. Distributed policy reflection

Thiết lập consistent governance mechanisms áp dụng producer-defined access policies trên tất cả data consumer points

### Permission granularity

Dựa trên việc systems giả định user ID hay engine ID trong data federation process, có sự khác biệt giữa coarse-grained và fine-grained permissions:

- **Cross-catalog access**: Sử dụng application/system IDs
- **Engines cho user IDs**: Enforce FGAC controls như được định nghĩa trong consumer catalog

## Implementation Pattern 1: AWS làm Data Producer

### Data flow

Data flow từ producers sử dụng AWS native services đến consumers sử dụng cả AWS partners và AWS native services. Cả AWS native compute engines và partner compute engines đều consume data trực tiếp từ AWS-managed data lake.

### 1. Cross-catalog metadata federation

Third-party query engines sử dụng AWS Glue Data Catalog (GDC) để discover và understand data trong AWS data lake được quản lý bởi Lake Formation.

#### Access methods

Catalog federation đến Glue Data Catalog đạt được thông qua một trong hai:

- **AWS Glue API**
- **AWS Glue Iceberg REST endpoints (Glue IRC)**

Cả hai approaches đều hỗ trợ Apache Iceberg tables, nhưng Glue IRC API enables standard REST API sets cho integration, cung cấp authentication và authorization support để simplify framework.

### 2. Cross-account authentication and authorization

Third-party query engines truy cập data được discover trong GDC catalog sử dụng một trong hai:

- **Lake Formation-managed credentials** (recommended approach)
- **IAM principal roles cho direct S3 access**

#### Lake Formation credentials vs IAM principals

| Tính năng | Lake Formation credentials | IAM principals cho S3 |
|-----------|---------------------------|----------------------|
| Mục đích | Data lake access management | AWS resource access control |
| Granularity | Fine-grained (table/column/row) | Coarse-grained (bucket/prefix/object) |
| Quản lý | Centralized trong Lake Formation | IAM và S3 bucket policies |
| IAM/S3 policies | Lake Formation controls apply | Directly control access |
| User experience | Không cần direct S3 permissions management | Cần explicit S3 permissions |
| Integration | AWS và third-party applications | Application/user direct access |

### 3. Distributed policy reflection

Integration với AWS Lake Formation cho phép third-party services truy cập secure vào data trong S3-based data lakes với full table access permissions. Organizations cần complement điều này với manual policy sharing hoặc additional mechanisms để third-party query engines enforce fine-grained access control policies.

## Partner-specific features: Databricks

### 1. Catalog federation

Databricks Lakehouse Federation cho phép organizations query và govern external data systems như Lakehouse extensions. Khi kết nối với GDC, Databricks sử dụng GDC API thay vì Iceberg REST catalog endpoints cho metadata discovery và federation.

### 2. Authentication và authorization

Về data access permissions, Databricks truy cập S3 data sử dụng traditional cross-account IAM role-based access patterns thay vì Lake Formation's credential vending mechanism. Customers phải explicitly register S3 bucket storage trong Unity Catalog cho mỗi table muốn federate.

### 3. Policy reflection

Để replicate Lake Formation's fine-grained access controls trong Databricks, cần synchronization mechanism extract access policies từ Lake Formation và transform chúng thành equivalent Databricks Unity Catalog permissions. Các fine-grained access policies này có thể được replicate manually hoặc qua custom-built solutions đồng bộ cả hai systems.

## Partner-specific features: Snowflake

### 1. Catalog federation

Để implement cross-catalog metadata federation từ AWS Glue Data Catalog đến Snowflake Horizon catalog, Snowflake sử dụng catalog integrations. Để integrate với AWS Glue, Snowflake sử dụng AWS Glue Iceberg REST endpoints hỗ trợ additional Iceberg table features như catalog-provided credentials.

### 2. Authentication và authorization

Integration của Snowflake Horizon catalog với AWS Glue Iceberg REST endpoints hỗ trợ Lake Formation's credential vending capability (hiện tại chỉ coarse-grained).

Xem chi tiết: [Using catalog-provided credentials for Apache Iceberg™ tables](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration-vended-credentials)

### 3. Policy reflection

Để replicate Lake Formation's fine-grained access controls trong Snowflake, cần synchronization mechanism extract access policies từ Lake Formation và transform chúng thành equivalent Snowflake Horizon catalog permissions. Các fine-grained access policies này có thể được replicate manually hoặc qua custom-built solutions đồng bộ cả hai systems.

## Implementation Pattern 2: AWS làm Data Consumer

### Data flow

Data flows đến data consumers sử dụng AWS native analytics services khi sử dụng AWS partner platforms làm data producers. AWS native compute consumes data từ cả AWS-managed data lakes và partner-managed storage.

### 1. Cross-catalog metadata federation

AWS Glue hiện hỗ trợ catalog federation đến remote Icebergs. Tính năng này cho phép cấu hình AWS Glue Data Catalog federation với:

- Databricks Unity Catalog
- Snowflake Polaris catalog
- Snowflake Horizon catalog
- Custom Iceberg REST catalog implementations

Sau integration, AWS Glue tự động quản lý metadata synchronization ở background, đảm bảo query results reflect những table changes mới nhất từ remote catalogs.

Federated tables có thể discover và query bằng các AWS analytics engines:

- Amazon Redshift
- Amazon EMR
- Amazon Athena
- AWS Glue

### 2. Cross-account authentication và authorization

Lake Formation mở rộng data governance đến federated sources sử dụng cùng application integration process mà AWS native services dùng cho data lake access.

#### Access flow

1. Users gửi query đến AWS compute services như Athena
2. AWS native services forward request đến Lake Formation để verify access permissions và obtain credentials
3. Khi authorized, Lake Formation cung cấp credentials cho AWS native services, enabling access đến requested data trong Amazon S3
4. AWS native services áp dụng policy-based filtering lên retrieved data trước khi return results cho users

### 3. Distributed policy reflection

Lake Formation cung cấp comprehensive access controls cho Iceberg catalogs được federated:

- Data owners có thể grant column, row, và cell-level permissions khi share federated tables giữa AWS accounts
- Hỗ trợ tag-based access control (TBAC) cho databases/tables/columns trong federated catalogs
- Organizations có thể streamline governance bằng cách apply tags lên remote catalog objects thay vì manage individual resource policies

Tuy nhiên, organizations cần implement complementary policy sharing hoặc additional mechanisms để sync fine-grained access controls từ third-party platforms đến Lake Formation.

## Databricks làm Data Producer

### 1. Catalog federation

Unity Catalog được xây dựng theo OpenAPI specification, với Apache 2.0 license, cung cấp wide compatibility thông qua multiple API standards. Databricks cung cấp access đến Unity Catalog tables sử dụng Unity REST API và Apache Iceberg REST catalog.

Xem chi tiết:
- [Access Databricks tables from Apache Iceberg clients](https://docs.databricks.com/aws/en/external-access/iceberg)
- [Enable external data access to Unity Catalog](https://docs.databricks.com/aws/en/external-access/admin)

### 2. Authentication và authorization

Unity Catalog's credential vending mechanism cho phép users cấu hình để external clients inherit permissions trên Databricks-managed data. Cả Iceberg và Delta clients đều hỗ trợ leverage credential vending mechanism.

Về data access permissions, Glue Data Catalog truy cập S3 data sử dụng traditional cross-account IAM role-based access patterns thay vì Unity credential vending mechanism. Customers phải explicitly cấu hình permissions cho S3 bucket storage như một phần của federation để Lake Formation có thể quản lý temporary credential vending.

### 3. Policy reflection

Để replicate Unity Catalog's fine-grained controls trong Lake Formation, cần synchronization mechanism extract Unity Catalog policies và transform chúng thành equivalent Lake Formation permissions. Organizations implement điều này thông qua manual policy replication hoặc development của custom solutions duy trì continuous sync giữa cả hai governance systems.

## Snowflake làm Data Producer

### 1. Catalog federation

Snowflake Open Catalog được thiết kế hỗ trợ interoperability với third-party query engines bằng cách expose bất kỳ Iceberg table metadata nào qua open APIs.

- External engines có thể access metadata và query data stored trong Snowflake Open Catalog
- Horizon catalog exposes Apache Iceberg™ REST API cho phép đọc Iceberg tables bằng external query engines
- Open Catalog là managed version của Apache Polaris, nhưng customers cũng có thể self-host Apache Polaris trực tiếp

Xem chi tiết: [Get started with Snowflake Open Catalog](https://other-docs.snowflake.com/en/opencatalog/tutorials/open-catalog-gs)

### 2. Authentication và authorization

#### Open Catalog credential vending

Open Catalog credential vending mechanism centralize access management cho cả Open Catalog metadata và table storage locations. Khi enabled, Open Catalog cung cấp temporary storage credentials cho query engines để access table data, eliminating nhu cầu manage storage access riêng biệt.

#### Horizon catalog

Sử dụng single Horizon catalog endpoint để query Snowflake's Iceberg tables trong new hoặc existing Snowflake accounts, cung cấp temporary storage credentials cho query engines để access table data.

Về data access permissions, GDC truy cập S3 data sử dụng cross-account IAM role-based access patterns thay vì Snowflake credential vending mechanism. Customers phải explicitly cấu hình permissions cho S3 bucket storage như một phần của federation để Lake Formation có thể quản lý temporary credential vending.

### 3. Policy reflection

Để replicate Snowflake's fine-grained access controls vào Lake Formation, cần synchronization mechanism extract access policies từ Snowflake và transform chúng thành equivalent Lake Formation permissions. Các fine-grained access policies này có thể được replicate manually hoặc qua custom-built solutions đồng bộ cả hai systems.

## Kết luận

### 3 yêu cầu interoperability quan trọng

Để Data Mesh architecture thành công, cần address 3 yêu cầu interoperability quan trọng:

1. Cross-catalog metadata federation
2. Cross-account authentication và authorization
3. Distributed policy reflection

### Giá trị của Apache Iceberg

Apache Iceberg cung cấp compelling advantages như table format cho organizations đang xem xét data mesh architecture:

- **Cross-platform compatibility**: Cho phép consistent data access giữa các query engines khác nhau
- **Simplified integration**: Cung cấp efficient integration options
- **Valuable features**: Hỗ trợ schema evolution, time travel, transactions
- **Data integrity**: Giúp maintain data integrity trong distributed ownership scenarios

### Integration với partners

Partners hỗ trợ open table formats như Apache Iceberg cung cấp complementary capabilities cho phép organizations xây dựng flexible, secure và scalable data architectures, nhưng thêm vào đó việc leverage AWS Lake Formation có thể xây dựng robust foundation cho data mesh implementation. Các patterns này được minh họa với Databricks và Snowflake làm representative examples.

### Cross-catalog metadata federation

Leverage AWS và partner capabilities để tạo unified view của distributed data assets, làm cho data discovery seamless trong khi vẫn maintain domain ownership. Balance quan trọng này cho phép financial services organizations break down traditional data silos trong khi maintain cả innovation speed và regulatory compliance.

### Tầm quan trọng của policy standardization

Teams nên establish standardized policy definitions toàn organization trước khi implement data mesh. Bằng cách tạo common framework cho security policies có thể được transform across platforms (AWS Lake Formation, Databricks, Snowflake, etc.), maintain consistent governance trong khi cho phép domain teams tự quản lý data products của họ.

Policy standardization là critical focus area, với nỗ lực đang tiến hành để establish common policy definition formats và improve cross-engine policy translation.

### Hướng tương lai

Khi các technologies này mature, organizations có thể confidently xây dựng secure và scalable data mesh architectures, cho phép domain teams own data products của họ trong khi maintain enterprise-wide governance và interoperability trên toàn bộ data ecosystem.

## Lợi ích

### Maintain domain autonomy

Domain teams có thể chọn specialized engines tối ưu cho specific needs

### Scalable sharing

Secure data sharing ở storage level, không cần duplication

### Strict controls

- Entity authentication
- Consistent access controls
- Comprehensive audit trails
- Data lineage tracking

### Regulatory compliance

Đáp ứng regulatory environment của financial services organizations, maintain security và compliance requirements

### Break down data silos

Thoát khỏi traditionally siloed data, tạo comprehensive customer views

### Flexible architecture

Simultaneously leverage AWS native services và third-party engines (Databricks, Snowflake)

## Use cases

1. **Credit card division của financial institutions**: Own và manage customer transaction data như một product, securely share với other divisions

2. **Distributed data management trong regulatory environments**: Share data giữa domains trong khi maintain governance

3. **Multi-platform integration**: Data sharing giữa AWS native services và third-party platforms (Databricks, Snowflake)

4. **Multi-query engine environments**: User và engine identity management

5. **Federated data sources**: Secure authentication và authorization

## Dịch vụ liên quan

- AWS Lake Formation
- AWS Glue Data Catalog
- Amazon S3
- Amazon Redshift
- Amazon Athena
- Amazon EMR
- Amazon SageMaker Unified Studio
- Apache Iceberg
- Databricks Unity Catalog
- Databricks Lakehouse Federation
- Snowflake Horizon Catalog
- Snowflake Open Catalog
- Apache Polaris

## Tham khảo

- [What is Data Mesh?](https://aws.amazon.com/jp/what-is/data-mesh/)
- [Let's Architect! Architecting a data mesh](https://aws.amazon.com/blogs/architecture/lets-architect-architecting-a-data-mesh/)
- [What is Apache Iceberg?](https://aws.amazon.com/jp/what-is/apache-iceberg)
- [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html)
- [AWS Lake Formation Documentation](https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html)
- [Amazon SageMaker Unified Studio Documentation](https://docs.aws.amazon.com/sagemaker-unified-studio/latest/userguide/what-is-sagemaker-unified-studio.html)
- [Connect, share, and query where your data sits using Amazon SageMaker Unified Studio](https://aws.amazon.com/blogs/big-data/connect-share-and-query-where-your-data-sits-using-amazon-sagemaker-unified-studio/)

---

*Bài viết gốc: [Build Secure Data Mesh with AWS and Partner Solutions](https://aws.amazon.com/blogs/industries/build-secure-data-mesh-with-aws-and-partner-solutions/). Dịch bởi Solutions Architect Fukami Shuhei.*
