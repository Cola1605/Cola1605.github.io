---
title: "Giới thiệu Catalog Federation cho bảng Apache Iceberg trong AWS Glue Data Catalog"
date: 2025-12-09
original_date: 2025-11-26
authors:
  - name: "Debika D"
    role: "Senior Product Marketing Manager, Amazon SageMaker"
  - name: "Srividya Parthasarathy"
    role: "Senior Big Data Architect, AWS Lake Formation"
  - name: "Pratik Das"
    role: "Senior Product Manager, AWS Lake Formation"
translator: "松岡勝也 (Katsuya Matsuoka)"
categories:
  - AWS
  - Data Analytics
  - Cloud
tags:
  - AWS Glue
  - Apache Iceberg
  - AWS Lake Formation
  - Data Catalog
  - Catalog Federation
  - Amazon S3
  - Amazon Athena
  - Amazon Redshift
  - Amazon EMR
level: "Nâng cao (300)"
source: "AWS Blog"
source_url: "https://aws.amazon.com/jp/blogs/news/introducing-catalog-federation-for-apache-iceberg-tables-in-the-aws-glue-data-catalog/"
---

Apache Iceberg đã trở thành lựa chọn tiêu chuẩn về định dạng bảng mở (open table format) cho các tổ chức tìm kiếm phân tích quy mô lớn, mạnh mẽ và đáng tin cậy. Tuy nhiên, các doanh nghiệp đang ngày càng phải xử lý nhiều môi trường đa nhà cung cấp phức tạp với các hệ thống catalog khác nhau. Đối với các tổ chức hoạt động trong môi trường đa nhà cung cấp, việc quản lý dữ liệu giữa các hệ thống này trở thành một thách thức lớn. Sự phân mảnh này làm tăng đáng kể độ phức tạp trong vận hành, đặc biệt là liên quan đến kiểm soát truy cập và quản trị dữ liệu.

Khách hàng đang phân tích các bảng Iceberg bằng các công cụ phân tích AWS như Amazon Redshift, Amazon EMR, Amazon Athena mong muốn có được hiệu suất giá-chất lượng tương tự cho các workload từ catalog từ xa (remote catalog). Việc đơn giản di chuyển hoặc thay thế các remote catalog này là không thực tế, và các nhóm phải triển khai và duy trì các quy trình đồng bộ hóa liên tục sao chép metadata giữa các hệ thống, dẫn đến tăng chi phí vận hành, tăng chi phí và rủi ro về sự không nhất quán của dữ liệu.

**AWS Glue hiện đã hỗ trợ catalog federation cho các bảng Iceberg từ xa trong Data Catalog.** Sử dụng catalog federation, bạn có thể truy vấn các bảng Iceberg từ xa được lưu trữ trong Amazon S3 và được catalog hóa trong remote Iceberg catalog bằng các công cụ phân tích AWS mà không cần di chuyển hoặc sao chép bảng.

Khi remote catalog được tích hợp, AWS Glue luôn lấy metadata mới nhất ở chế độ nền, do đó bạn luôn có quyền truy cập vào metadata Iceberg thông qua dịch vụ phân tích AWS ưa thích của mình. Tính năng này hỗ trợ cả kiểm soát truy cập ở mức độ thô (coarse-grained) và quyền chi tiết (fine-grained) thông qua AWS Lake Formation, cho phép bạn linh hoạt lựa chọn cách thức và thời điểm chia sẻ các bảng Iceberg từ xa với người tiêu dùng dữ liệu.

Với khả năng tích hợp Snowflake Polaris Catalog, Databricks Unity Catalog và các custom catalog khác hỗ trợ đặc tả Iceberg REST, bạn có thể federate đến remote catalog, khám phá cơ sở dữ liệu và bảng, thiết lập quyền truy cập và bắt đầu truy vấn dữ liệu Iceberg từ xa.

Bài viết này sẽ hướng dẫn bạn cách bắt đầu với catalog federation cho các bảng Iceberg trong Data Catalog.

## Tổng quan giải pháp

Catalog federation sử dụng Data Catalog để giao tiếp với các hệ thống remote catalog, khám phá các đối tượng catalog và sử dụng Lake Formation để ủy quyền truy cập vào dữ liệu trong Amazon S3. Khi bạn truy vấn một bảng Iceberg từ xa, Data Catalog sẽ khám phá thông tin bảng mới nhất trong remote catalog tại thời điểm thực thi truy vấn và lấy vị trí S3 của bảng, schema hiện tại và thông tin phân vùng.

Công cụ phân tích (Athena, Amazon EMR hoặc Amazon Redshift) sử dụng thông tin này để truy cập trực tiếp các file dữ liệu Iceberg từ Amazon S3. Lake Formation quản lý quyền truy cập vào bảng bằng cách cấp phát các credentials có phạm vi (scoped credentials) đến dữ liệu bảng được lưu trữ trong Amazon S3, cho phép công cụ áp dụng quyền chi tiết cho federated table.

Cách tiếp cận này cung cấp quyền truy cập thời gian thực vào các bảng Iceberg từ xa thông qua công cụ phân tích AWS ưa thích của bạn, đồng thời tránh việc trùng lặp metadata và dữ liệu.

### Chi tiết kiến trúc

Data Catalog tạo điều kiện thuận lợi cho việc kết nối với các hệ thống remote catalog hỗ trợ Apache Iceberg bằng cách thiết lập kết nối AWS Glue với remote catalog endpoint. Bạn có thể kết nối Data Catalog với remote Iceberg REST catalog bằng cách sử dụng cơ chế xác thực OAuth2 hoặc xác thực tùy chỉnh (custom authentication) với access token.

Trong quá trình tích hợp, quản trị viên thiết lập một principal (service account hoặc identity) với quyền thích hợp để truy cập tài nguyên trong remote catalog. Đối tượng AWS Glue connection sử dụng credentials của principal đã cấu hình này để xác thực và truy cập metadata trong remote catalog server.

Bạn cũng có thể kết nối Data Catalog với remote catalog sử dụng private link hoặc proxy để cô lập và hạn chế quyền truy cập mạng. Sau khi kết nối, tích hợp này sử dụng đặc tả Iceberg REST API được chuẩn hóa để lấy thông tin table metadata mới nhất từ các remote catalog này.

AWS Glue onboard các remote catalog này như federated catalog trong cơ sở hạ tầng catalog riêng của mình, cho phép truy cập metadata thống nhất trên nhiều hệ thống catalog.

Lake Formation hoạt động như một lớp ủy quyền tập trung để quản lý quyền truy cập của người dùng vào các tài nguyên federated catalog. Khi người dùng cố gắng truy cập bảng hoặc cơ sở dữ liệu trong federated catalog, Lake Formation sẽ đánh giá quyền và áp dụng các chính sách kiểm soát truy cập chi tiết.

Ngoài việc ủy quyền metadata, catalog federation còn quản lý quyền truy cập an toàn vào các file dữ liệu nền tảng thực tế. Điều này được thực hiện thông qua cơ chế cấp phát credentials (credential vending mechanism) cấp phát các credentials tạm thời có phạm vi giới hạn.

AWS Glue federated catalog hoạt động với các công cụ phân tích AWS và dịch vụ truy vấn ưa thích của bạn, cung cấp quyền truy cập metadata nhất quán và quản trị dữ liệu thống nhất trên toàn bộ workload phân tích.

### Quy trình thiết lập

Các phần sau sẽ mô tả các bước để tích hợp Data Catalog với remote catalog server.

1. **Thiết lập integration principal trong remote catalog** và cấp cho principal này các quyền truy cập cần thiết đến tài nguyên catalog. Kích hoạt xác thực dựa trên OAuth cho integration principal.

2. **Tạo federated catalog trong Data Catalog bằng AWS Glue connection**. Tạo AWS Glue connection kết nối đến Iceberg REST endpoint của remote catalog bằng credentials của integration principal (bước 1). Thiết lập IAM role có quyền truy cập vào vị trí S3 nơi dữ liệu bảng từ xa tồn tại. Trong kịch bản cross-account, đảm bảo bucket policy cấp quyền truy cập cần thiết cho IAM role này. Federated catalog này sẽ phản chiếu các đối tượng catalog trong remote catalog server.

3. **Khám phá các bảng Iceberg trong federated catalog bằng Lake Formation hoặc AWS Glue API**. Truy vấn các bảng Iceberg bằng công cụ phân tích AWS. Trong quá trình truy vấn, Lake Formation quản lý quyền chi tiết cho các tài nguyên federated và cấp phát credentials đến dữ liệu nền tảng cho người dùng cuối.

## Điều kiện tiên quyết

Trước khi bắt đầu, đảm bảo các thiết lập sau đã hoàn thành trong AWS:

• Tài khoản AWS  
• AWS CLI phiên bản 2.31.38 trở lên đã được cài đặt và cấu hình  
• IAM administrator role hoặc user có quyền thích hợp cho các dịch vụ sau:  
  ◦ IAM  
  ◦ AWS Glue Data Catalog  
  ◦ Amazon S3  
  ◦ AWS Lake Formation  
  ◦ AWS Secrets Manager  
  ◦ Amazon Athena  
• Tạo data lake administrator. Xem hướng dẫn tại [Tạo data lake administrator](https://docs.aws.amazon.com/ja_jp/lake-formation/latest/dg/initial-lf-config.html#create-data-lake-admin).

## Thiết lập credentials trong Remote Iceberg Catalog

Catalog federation đến remote Iceberg catalog sử dụng credentials xác thực OAuth2 của principal được cấu hình cho quyền truy cập metadata. Cơ chế xác thực này cho phép AWS Glue Data Catalog truy cập metadata của các đối tượng khác nhau (cơ sở dữ liệu, bảng, v.v.) trong remote catalog dựa trên quyền được liên kết với principal.

Để hỗ trợ chức năng phù hợp, bạn cần cấp cho principal các quyền cần thiết để đọc metadata của các đối tượng này. Để kích hoạt xác thực dựa trên OAuth cho integration principal, hãy tạo `CLIENT_ID` và `CLIENT_SECRET`.

## Tạo AWS Glue Catalog Federation với kết nối đến Remote Iceberg Catalog

Tạo federated catalog trong Data Catalog để phản chiếu các đối tượng catalog trong remote Iceberg catalog server. Đây là thứ mà dịch vụ AWS Glue sử dụng để federate các metadata query như `ListDatabases`, `ListTables`, `GetTable` đến remote catalog.

Với vai trò data lake administrator, bạn có thể tạo federated catalog trong Data Catalog bằng đối tượng AWS Glue connection đã đăng ký với AWS Lake Formation.

### Thiết lập kết nối nguồn dữ liệu cho AWS Glue connection

Catalog federation sử dụng AWS Glue connection để truy cập metadata khi cung cấp xác thực và cấu hình Iceberg REST API endpoint trong remote catalog. AWS Glue connection hỗ trợ OAuth2 hoặc custom làm phương thức xác thực.

#### Kết nối sử dụng xác thực OAuth2

Với phương thức xác thực OAuth2, bạn có thể cung cấp client secret trực tiếp làm đầu vào hoặc lưu trữ trong AWS Secrets Manager để sử dụng trong đối tượng AWS Glue connection khi xác thực. AWS Glue quản lý nội bộ việc làm mới token khi hết hạn.

Để lưu trữ client secret trong Secrets Manager, hoàn thành các bước sau:

1. Trong Secrets Manager console, chọn Secrets trong navigation pane.
2. Chọn Store a new secret.
3. Chọn Other type of secret, chỉ định key name là `USER_MANAGED_CLIENT_APPLICATION_CLIENT_SECRET` và nhập giá trị client secret.
4. Chọn Next và chỉ định tên cho secret.
5. Chọn Next và chọn Store để lưu secret.

#### Kết nối sử dụng xác thực tùy chỉnh

Với custom authentication, Secrets Manager được sử dụng để lưu trữ và truy xuất access token. Access token này được tạo, cập nhật và quản lý bởi ứng dụng hoặc hệ thống của bạn, cho phép bạn kiểm soát và quản lý quy trình xác thực một cách thích hợp.

Để lưu trữ access token trong Secrets Manager, hoàn thành các bước sau:

1. Trong Secrets Manager console, chọn Secrets trong navigation pane.
2. Chọn Store a new secret.
3. Chọn Other type of secret, chỉ định key name là `BEARER_TOKEN` và nhập access token của integration principal làm giá trị.
4. Chọn Next và chỉ định tên cho secret.
5. Chọn Next và chọn Store để lưu secret.

### Đăng ký AWS Glue connection với Lake Formation

Tạo IAM role mà Lake Formation có thể sử dụng để cấp phát credentials, và gắn quyền truy cập vào S3 bucket prefix nơi các bảng Iceberg được lưu trữ. Tùy chọn, nếu bạn sử dụng Secrets Manager để lưu trữ client secret hoặc sử dụng cấu hình mạng, bạn có thể thêm quyền truy cập các dịch vụ này vào role.

Để đăng ký connection, hoàn thành các bước sau:

1. Trong Lake Formation console, chọn Catalogs trong navigation pane.
2. Chọn Create catalog và chọn data source.
3. Nhập chi tiết federated catalog:
   a. Tên federated catalog  
   b. Tên catalog trong remote catalog server (phải khớp chính xác với tên catalog trong remote catalog)
4. Nhập chi tiết AWS Glue connection. Để tái sử dụng connection hiện có, chọn Select existing connection và chọn connection muốn tái sử dụng. Đối với thiết lập lần đầu, chọn Input new connection configuration và nhập thông tin sau:
   a. Nhập tên AWS Glue connection  
   b. Nhập Iceberg REST API endpoint của remote catalog  
   c. Chỉ định loại chữ hoa/chữ thường của catalog object. Connection có thể hỗ trợ object chữ hoa hoặc chữ thường trong toàn bộ object hierarchy  
   d. Thiết lập authentication parameters:  
      i. Đối với OAuth2: Nhập trực tiếp client ID và client secret, hoặc chọn secret nơi lưu trữ client secret, token authorization URL và scope được map với credentials  
      ii. Đối với Custom: Chỉ định secret được quản lý bởi Secrets Manager nơi lưu trữ access token  
      iii. Network settings: Nếu có cấu hình mạng hoặc proxy, bạn có thể nhập thông tin này. Nếu không, giữ nguyên phần này ở mặc định
5. Đăng ký connection với Lake Formation bằng IAM role có quyền truy cập vào bucket nơi lưu trữ metadata và dữ liệu của remote table.
6. Chọn Run test để xác minh connection.
7. Nếu test thành công, tạo catalog.

Bây giờ bạn có thể khám phá các remote object dưới federated catalog. Bạn có thể tái sử dụng connection hiện có đã được cấu hình cho cùng một external catalog instance để onboard các remote catalog khác.

## Truy vấn đối tượng Federated Catalog bằng công cụ phân tích AWS

Với vai trò data lake administrator, giờ bạn có thể sử dụng AWS Lake Formation để quản lý kiểm soát truy cập cho cơ sở dữ liệu và bảng trong federated catalog. Bạn cũng có thể sử dụng tag-based access control để scale mô hình quyền bằng cách gắn tag vào tài nguyên dựa trên cơ chế kiểm soát truy cập.

Khi quyền được cấp, IAM principal hoặc IAM user có thể truy cập federated table bằng các dịch vụ phân tích AWS như Athena, Amazon Redshift, Amazon EMR, Amazon SageMaker. Như ví dụ dưới đây, sử dụng Athena để truy vấn federated Iceberg table.

## Dọn dẹp

Để tránh phát sinh chi phí liên tục, hoàn thành các bước sau để dọn dẹp các tài nguyên đã tạo trong hướng dẫn này.

1. Xóa federated catalog trong Data Catalog.
```bash
aws glue delete-catalog \
    --name <your-federated-catalog-name>
```

2. Hủy đăng ký AWS Glue connection khỏi Lake Formation.
```bash
aws lakeformation deregister-resource \
    --resource-arn <your-glue-connector-arn>
```

3. Thu hồi quyền Lake Formation (nếu đã cấp).
```bash
# Đầu tiên liệt kê các quyền hiện có
aws lakeformation list-permissions \
    --catalog-id <your-account-id> \
    --resource '{"Catalog": {}}'

# Thu hồi quyền nếu cần
aws lakeformation revoke-permissions \
    --principal '{"DataLakePrincipalIdentifier": "<principal-arn>"}' \
    --resource '{"Database": {"CatalogId": "<catalog-id>", "Name": "<database-name>"}}' \
    --permissions ["SELECT", "DESCRIBE"]
```

4. Xóa AWS Glue connection.
```bash
aws glue delete-connection \
    --connection-name <your-glue-connection-name>
```

5. Xóa IAM role và policy liên kết với Lake Formation và AWS Glue connection.
```bash
# Detach policy khỏi role
aws iam detach-role-policy \
    --role-name <your-lakeformation-role-name> \
    --policy-arn <your-lakeformation-policy-arn>

# Xóa custom policy
aws iam delete-policy \
    --policy-arn <your-lakeformation-policy-arn>

# Xóa role
aws iam delete-role \
    --role-name <your-lakeformation-role-name>
```

6. Xóa secret trong Secrets Manager.
```bash
# Lên lịch xóa secret (7-30 ngày)
aws secretsmanager delete-secret \
    --secret-id <your-secret-name>
```

Hướng dẫn dọn dẹp này không ảnh hưởng đến metadata thực tế trong remote catalog server hoặc dữ liệu trong S3 bucket. Nó chỉ ảnh hưởng đến cấu hình federation của Data Catalog và Lake Formation. Các service principal và cấu hình tương ứng trong remote catalog server cần được xử lý riêng.

Để tránh xung đột phụ thuộc, hãy tuân theo các bước dọn dẹp theo thứ tự đã chỉ định. Ví dụ, bạn không thể xóa đối tượng AWS Glue connection nếu có đối tượng AWS Glue catalog liên kết với nó.

Ngoài ra, hãy đảm bảo bạn có quyền cần thiết để xóa các tài nguyên này.

## Tổng kết

Bài viết này đã khám phá cách catalog federation giải quyết thách thức ngày càng tăng trong việc quản lý các bảng Iceberg trên toàn bộ môi trường catalog đa nhà cung cấp. Chúng tôi đã mô tả kiến trúc nơi Data Catalog giao tiếp với các hệ thống remote catalog bao gồm Snowflake Polaris Catalog, Databricks Unity Catalog và custom catalog tuân thủ Iceberg REST, thực hiện ủy quyền tập trung và cấp phát credentials cho quyền truy cập dữ liệu an toàn.

Chúng tôi đã giải thích quy trình thiết lập từ cấu hình authentication principal, tạo federated catalog bằng AWS Glue connection, đến triển khai kiểm soát truy cập chi tiết và truy vấn trực tiếp các bảng Iceberg từ xa từ công cụ phân tích AWS.

### Lợi ích của Catalog Federation

• **Duy trì lợi ích của dịch vụ phân tích AWS**: Có thể truy vấn dữ liệu Iceberg tại nơi chúng tồn tại trong khi vẫn duy trì lợi ích về bảo mật, quản trị và hiệu suất giá-chất lượng  
• **Giảm chi phí vận hành**: Giảm chi phí vận hành và chi phí để duy trì quy trình đồng bộ hóa  
• **Tránh trùng lặp và không nhất quán dữ liệu**: Tránh được việc trùng lặp và không nhất quán dữ liệu  
• **Truy cập thời gian thực**: Truy cập thời gian thực vào schema bảng mới nhất mà không cần di chuyển hoặc thay thế catalog hiện có

Để biết thêm chi tiết, vui lòng tham khảo [Catalog Federation đến Remote Iceberg Catalog](https://docs.aws.amazon.com/ja_jp/lake-formation/latest/dg/catalog-federation.html).

---

**Về các tác giả**

**Debika D** là Senior Product Marketing Manager cho Amazon SageMaker, chuyên về messaging và chiến lược go-to-market cho kiến trúc lakehouse. Cô có niềm đam mê với mọi thứ liên quan đến dữ liệu và AI.

**Srividya Parthasarathy** là Senior Big Data Architect trong nhóm AWS Lake Formation. Cô hợp tác với nhóm sản phẩm và khách hàng để xây dựng các tính năng và giải pháp mạnh mẽ cho nền tảng dữ liệu phân tích. Cô thích xây dựng các giải pháp data mesh và chia sẻ với cộng đồng.

**Pratik Das** là Senior Product Manager cho AWS Lake Formation. Anh có niềm đam mê với mọi thứ liên quan đến dữ liệu, hợp tác với khách hàng để hiểu yêu cầu và xây dựng trải nghiệm tuyệt vời. Anh có nền tảng về xây dựng giải pháp data-driven và hệ thống machine learning.

Bài viết này được Kiro phụ trách dịch thuật và solution architect Katsuya Matsuoka review.
