---
title: "Cách Tùy Chỉnh Chính Sách Lưu Trữ Bản Ghi Cuộc Gọi Trong Amazon Connect"
date: 2025-11-21
categories: ["AWS", "AI and Machine Learning"]
tags: ["Amazon Connect", "AWS Lambda", "Amazon S3", "Contact Center", "Compliance", "Data Retention", "CloudFormation", "Kinesis", "AWS"]
author: "Mo Miah, Jack Tilson"
translator: "Koki Takahashi"
description: "Hướng dẫn chi tiết cách triển khai nhiều chính sách lưu trữ bản ghi cuộc gọi khác nhau cho các bộ phận kinh doanh trong Amazon Connect bằng S3 Lifecycle, Lambda và Contact Attributes"
draft: false
---

📷 **Lưu ý về Hình ảnh**: Bài viết gốc có **21 hình ảnh** minh họa chi tiết về:
- Sơ đồ kiến trúc tổng quan
- Giao diện CloudFormation template
- Các bước cấu hình trong Amazon Connect Console
- Cấu hình Lambda function và Contact Flow
- Xác thực object tags trong Amazon S3

Vui lòng xem hình ảnh đầy đủ tại bài viết gốc: https://aws.amazon.com/jp/blogs/news/customize-retention-policies-for-contact-recordings-in-amazon-connect/

---

## Giới Thiệu

Các trung tâm liên hệ (contact center), đặc biệt là các công ty thuê ngoài quy trình kinh doanh (BPO), thường vận hành nhiều bộ phận kinh doanh (LOB - Line of Business) khác nhau, mỗi bộ phận có các yêu cầu quy định và hợp đồng riêng biệt về việc lưu trữ bản ghi cuộc gọi.

Nếu không tuân thủ các quy định ngành và nghĩa vụ hợp đồng, tổ chức có thể phải đối mặt với các khoản phạt, tranh chấp pháp lý và thiệt hại về uy tín. Hơn nữa, việc lưu trữ bản ghi cuộc gọi vượt quá thời gian cần thiết có thể dẫn đến chi phí lưu trữ không cần thiết và các vấn đề tiềm ẩn về quyền riêng tư dữ liệu. Do đó, các tổ chức cần đáp ứng nghĩa vụ tuân thủ trong khi tối ưu hóa chi phí vận hành.

Bài viết này sẽ giải thích cách áp dụng nhiều chính sách lưu trữ khác nhau cho bản ghi cuộc gọi trên các bộ phận kinh doanh trong một Amazon Connect instance duy nhất.

## Tổng Quan Giải Pháp

Amazon Connect cung cấp tính năng ghi âm cuộc gọi gốc (native) để ghi lại các cuộc trò chuyện giữa agent và khách hàng một cách an toàn. Các bản ghi này được lưu trữ trong bucket Amazon S3 được tạo riêng cho instance của bạn. Bằng cách cấu hình Amazon S3 Lifecycle, bạn có thể quản lý vòng đời của các bản ghi này. Cụ thể, cấu hình này cho phép bạn định nghĩa các quy tắc hết hạn đối tượng để tự động xóa các bản ghi đã hết hạn trong Amazon S3.

Trong giải pháp này, chúng ta sẽ chỉ định thời gian lưu trữ mong muốn cho mỗi contact thông qua contact attribute tùy chỉnh trong flow của Amazon Connect. Contact attribute này được stream đến Amazon Kinesis cùng với phần còn lại của contact record, và sẽ kích hoạt hàm AWS Lambda. Hàm Lambda sử dụng tính năng object tagging của Amazon S3 để gắn tag cho đối tượng ghi âm dựa trên giá trị contact attribute được chỉ định. Kết quả là, các đối tượng ghi âm sẽ được thiết lập thời gian hết hạn tương ứng với tag của chúng, tuân theo các S3 Lifecycle rules đã được định nghĩa trước trong bucket.

Với phương pháp này, bạn có thể triển khai chính sách lưu trữ bản ghi cuộc gọi tùy chỉnh, đảm bảo tuân thủ các quy định về lưu trữ dữ liệu, giảm thiểu chi phí lưu trữ và tối ưu hóa sử dụng tài nguyên.

### Tổng Quan Kiến Trúc

**Hình 1 – Sơ đồ kiến trúc** (Xem tại bài viết gốc)

### Luồng Xử Lý Chi Tiết

1. Contact tương ứng với một bộ phận kinh doanh (LOB) cụ thể đến Amazon Connect
2. Contact attribute về thời gian lưu trữ được gắn vào contact trong flow, và giá trị attribute (ngắn hạn, dài hạn) được gán tùy theo LOB
3. Amazon Kinesis stream contact record đến Amazon S3
4. Hàm AWS Lambda được kích hoạt cùng với việc chuyển dữ liệu đến Amazon S3. Hàm này cập nhật Amazon S3 Lifecycle policy của đối tượng (sử dụng object tagging) dựa trên contact attribute thời gian lưu trữ (ngắn hạn, dài hạn) trong contact record
5. Mỗi bản ghi trong Amazon S3 được thiết lập để hết hạn dựa trên lifecycle policy tương ứng

Blog này sẽ deploy các thành phần sau:

- **Amazon Kinesis Data Firehose**: Kích hoạt hàm Lambda để xử lý contact record trong luồng (in-flight)
- **AWS Lambda**: Xử lý contact attribute, định dạng dữ liệu và quản lý object tag
- **Amazon S3**: Lưu trữ contact record đã được xử lý cùng với lifecycle policy
- **IAM roles và policies**: Kiểm soát quyền truy cập AWS
- **AWS CloudFormation**: Tự động hóa việc triển khai tất cả các thành phần

## Yêu Cầu Trước Khi Triển Khai

Trước khi triển khai giải pháp này, hãy đảm bảo rằng:

- Bạn có một Amazon Connect instance đang hoạt động với Data streaming và Call recording được bật
- Bạn có quyền truy cập AWS với các quyền cần thiết để tạo các tài nguyên được liệt kê trong phần Giải pháp

## Hướng Dẫn Triển Khai

### Bước 1: Triển Khai CloudFormation Template

AWS CloudFormation là dịch vụ hỗ trợ việc đơn giản hóa việc quản lý các tài nguyên AWS. CloudFormation template cung cấp một cách dễ dàng để tạo các tài nguyên cần thiết cho giải pháp trong bài viết này.

**Hình 2 – Giao diện CloudFormation template** (Xem tại bài viết gốc)

1. Đăng nhập vào AWS Management Console, truy cập dịch vụ AWS CloudFormation và tải CloudFormation template
2. Chọn **Create stack** và upload template đã tải
3. Nhập tên cho stack (ví dụ: `AmazonConnectRetentionSolution`)
4. Nhập các tham số sau:
   - **S3BucketName**: Tên của bucket Amazon S3 hiện có nơi contact record sẽ được lưu trữ (nơi Kinesis Data Firehose sẽ ghi dữ liệu vào)
   - **ShortTermRetentionDays**: Số ngày cho chính sách lưu trữ ngắn hạn (ví dụ: 90)
   - **LongTermRetentionDays**: Số ngày cho chính sách lưu trữ dài hạn (ví dụ: 2555 = khoảng 7 năm)
5. Xem lại chi tiết stack và xác nhận tùy chọn **I acknowledge that AWS CloudFormation might create IAM resources**
6. Chọn **Create stack**

CloudFormation stack sẽ được triển khai và các tài nguyên sau sẽ được tạo:

- Amazon Kinesis Data Firehose delivery stream
- Hàm AWS Lambda để xử lý contact record và cập nhật object tag
- IAM role và policy cho Lambda function
- Amazon S3 Lifecycle rules cho bucket đã chỉ định

### Bước 2: Kích Hoạt Data Streaming Trong Amazon Connect

Bạn cần kích hoạt Data streaming trong Amazon Connect instance để stream contact record đến Amazon Kinesis Data Firehose.

**Hình 3 – Cấu hình Data streaming** (Xem tại bài viết gốc)

1. Truy cập vào Amazon Connect console
2. Chọn instance của bạn
3. Trong menu bên trái, chọn **Data streaming**
4. Trong phần **Contact records**, chọn **Enable data streaming**
5. Chọn **Kinesis Firehose** và chọn delivery stream đã được tạo bởi CloudFormation stack (tên sẽ có dạng: `AmazonConnectRetentionSolution-DeliveryStream-XXXX`)
6. Chọn **Save**

### Bước 3: Tạo Contact Flow Mẫu

Bây giờ hãy tạo một contact flow mẫu để kiểm tra giải pháp. Flow này sẽ gán contact attribute về thời gian lưu trữ dựa trên input từ khách hàng.

**Hình 4 – Contact flow mẫu** (Xem tại bài viết gốc)

1. Trong Amazon Connect console, chọn **Routing** → **Contact flows**
2. Chọn **Create contact flow**
3. Đặt tên cho flow (ví dụ: `RetentionPolicyTestFlow`)
4. Thêm các block sau vào flow:

#### Block 1: Set contact attributes (Đặt thuộc tính contact)

**Hình 5 – Cấu hình Set contact attributes** (Xem tại bài viết gốc)

- Type: **User-defined**
- Destination key: `RetentionPolicy`
- Value: `short-term` (hoặc `long-term` tùy theo yêu cầu)

#### Block 2: Store customer input (Lưu trữ input từ khách hàng)

**Hình 6 – Cấu hình Store customer input** (Xem tại bài viết gốc)

Cấu hình block này để nhận input từ khách hàng (ví dụ: số điện thoại để nhập chữ số 1 cho ngắn hạn, 2 cho dài hạn)

#### Block 3: Check contact attributes (Kiểm tra thuộc tính contact)

**Hình 7 – Cấu hình Check contact attributes** (Xem tại bài viết gốc)

Kiểm tra giá trị của `RetentionPolicy` attribute và phân nhánh dựa trên giá trị đó

#### Block 4-5: Set recording behavior (Thiết lập hành vi ghi âm)

**Hình 8-9 – Cấu hình Set recording behavior** (Xem tại bài viết gốc)

Cấu hình để bật call recording cho cả agent và customer

5. Kết nối các block theo luồng logic và **Save** + **Publish** flow

### Bước 4: Liên Kết Contact Flow Với Số Điện Thoại

**Hình 10 – Liên kết flow với số điện thoại** (Xem tại bài viết gốc)

1. Trong Amazon Connect console, chọn **Routing** → **Phone numbers**
2. Chọn số điện thoại bạn muốn sử dụng để kiểm tra
3. Trong phần **Contact flow / IVR**, chọn contact flow mà bạn vừa tạo
4. Chọn **Save**

## Kiểm Tra Giải Pháp

Bây giờ hãy kiểm tra giải pháp bằng cách thực hiện cuộc gọi test.

### Bước 1: Thực Hiện Cuộc Gọi Test

**Hình 11 – Test call flow** (Xem tại bài viết gốc)

1. Gọi đến số điện thoại đã được cấu hình
2. Khi được nhắc, nhập chữ số tương ứng với chính sách lưu trữ (1 cho ngắn hạn, 2 cho dài hạn)
3. Tiến hành cuộc gọi thông thường và kết thúc cuộc gọi

### Bước 2: Xác Thực Object Tags Trong S3

**Hình 12-15 – Xác thực tags trong S3** (Xem tại bài viết gốc)

Sau khi cuộc gọi kết thúc và contact record được stream đến S3:

1. Truy cập Amazon S3 console
2. Mở bucket Call Recordings của Amazon Connect instance (thường có tên dạng: `amazon-connect-xxxxx/CallRecordings/`)
3. Tìm file ghi âm tương ứng với cuộc gọi test (có thể tìm theo timestamp)
4. Chọn file, chọn tab **Properties**
5. Scroll xuống phần **Tags**
6. Xác nhận rằng tag `RetentionPolicy` đã được gán với giá trị tương ứng (`short-term` hoặc `long-term`)

**Hình 16 – Xác nhận object tag** (Xem tại bài viết gốc)

### Bước 3: Xác Thực Lifecycle Policy

**Hình 17-18 – Xác thực Lifecycle policy** (Xem tại bài viết gốc)

1. Trong S3 console, chọn bucket Call Recordings
2. Chọn tab **Management**
3. Trong phần **Lifecycle rules**, xác nhận rằng các rule sau đã được tạo:
   - `ShortTermRetentionRule`: Xóa object sau N ngày (theo cấu hình)
   - `LongTermRetentionRule`: Xóa object sau M ngày (theo cấu hình)
4. Xác nhận rằng các rule này lọc object dựa trên tag `RetentionPolicy`

**Hình 19 – Lifecycle rules được cấu hình** (Xem tại bài viết gốc)

## Chi Tiết Kỹ Thuật

### Lambda Function Code

Lambda function thực hiện các nhiệm vụ sau:

**Hình 20 – Lambda function code overview** (Xem tại bài viết gốc)

1. **Nhận contact record từ Kinesis Data Firehose**
2. **Giải mã và parse dữ liệu JSON**
3. **Trích xuất contact attribute `RetentionPolicy`**
4. **Lấy S3 object key của call recording từ contact record**
5. **Gắn tag cho S3 object** bằng cách sử dụng AWS SDK (boto3)
6. **Trả về kết quả cho Kinesis Data Firehose**

Đây là đoạn code Python mẫu (simplified):

```python
import boto3
import json
import base64

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    output = []
    
    for record in event['records']:
        # Decode data
        payload = base64.b64decode(record['data'])
        contact_record = json.loads(payload)
        
        # Extract retention policy attribute
        attributes = contact_record.get('Attributes', {})
        retention_policy = attributes.get('RetentionPolicy', 'default')
        
        # Get recording location
        recording = contact_record.get('Recording', {})
        location = recording.get('Location', '')
        
        if location:
            # Parse S3 bucket and key
            bucket = # Extract from location
            key = # Extract from location
            
            # Tag the object
            s3_client.put_object_tagging(
                Bucket=bucket,
                Key=key,
                Tagging={
                    'TagSet': [
                        {
                            'Key': 'RetentionPolicy',
                            'Value': retention_policy
                        }
                    ]
                }
            )
        
        output.append({
            'recordId': record['recordId'],
            'result': 'Ok',
            'data': record['data']
        })
    
    return {'records': output}
```

### S3 Lifecycle Rules

CloudFormation template tạo hai lifecycle rules:

**Hình 21 – S3 Lifecycle configuration** (Xem tại bài viết gốc)

1. **ShortTermRetentionRule**:
   - Filter: Tag `RetentionPolicy` = `short-term`
   - Action: Delete object sau N ngày (ví dụ: 90 ngày)

2. **LongTermRetentionRule**:
   - Filter: Tag `RetentionPolicy` = `long-term`
   - Action: Delete object sau M ngày (ví dụ: 2555 ngày ~ 7 năm)

```yaml
LifecycleConfiguration:
  Rules:
    - Id: ShortTermRetentionRule
      Status: Enabled
      TagFilters:
        - Key: RetentionPolicy
          Value: short-term
      ExpirationInDays: !Ref ShortTermRetentionDays
    - Id: LongTermRetentionRule
      Status: Enabled
      TagFilters:
        - Key: RetentionPolicy
          Value: long-term
      ExpirationInDays: !Ref LongTermRetentionDays
```

## Cân Nhắc Về Chi Phí

Giải pháp này sử dụng các dịch vụ AWS sau và sẽ phát sinh chi phí tương ứng:

- **Amazon S3**: Chi phí lưu trữ cho call recordings và contact records
- **Amazon Kinesis Data Firehose**: Chi phí cho data ingestion (theo GB)
- **AWS Lambda**: Chi phí theo số lượng invocation và thời gian thực thi
- **Amazon Connect**: Chi phí cho usage (không thay đổi so với trước)

Để tối ưu hóa chi phí:
- Xem xét sử dụng S3 Intelligent-Tiering cho call recordings
- Cân nhắc transition sang S3 Glacier cho dữ liệu archive lâu dài
- Theo dõi Lambda execution metrics để tối ưu hóa function

## Best Practices

1. **Testing**: Test kỹ lưỡng flow và lifecycle policies trước khi deploy production
2. **Monitoring**: Thiết lập CloudWatch alarms cho Lambda errors và Kinesis throttling
3. **Backup**: Cân nhắc backup cho call recordings quan trọng trước khi expiration
4. **Compliance**: Xác nhận rằng retention policies tuân thủ các yêu cầu quy định của tổ chức
5. **Documentation**: Ghi chép rõ ràng các retention policies cho mỗi LOB
6. **Security**: Sử dụng S3 bucket encryption và IAM policies để bảo vệ dữ liệu nhạy cảm

## Mở Rộng Giải Pháp

Giải pháp này có thể được mở rộng để:

- **Hỗ trợ nhiều hơn 2 retention policies**: Thêm nhiều giá trị cho `RetentionPolicy` attribute
- **Dynamic policy assignment**: Sử dụng Lambda để tự động gán policy dựa trên queue, routing profile, hoặc customer segment
- **Cross-region replication**: Replicate call recordings sang region khác cho disaster recovery
- **Metadata enrichment**: Thêm metadata bổ sung vào S3 object tags để tracking và reporting
- **Integration với compliance tools**: Kết nối với các công cụ compliance để automated auditing

## Dọn Dẹp Tài Nguyên

Để tránh phát sinh chi phí không cần thiết sau khi test:

1. Truy cập AWS CloudFormation console
2. Chọn stack `AmazonConnectRetentionSolution`
3. Chọn **Delete**
4. Xác nhận deletion

**Lưu ý**: Việc xóa stack sẽ không xóa S3 bucket và các object đã có. Bạn cần xóa thủ công nếu muốn.

## Kết Luận

Bài viết này đã trình bày cách triển khai giải pháp để áp dụng nhiều chính sách lưu trữ bản ghi cuộc gọi khác nhau cho các bộ phận kinh doanh khác nhau trong một Amazon Connect instance duy nhất. Bằng cách sử dụng contact attributes, Amazon Kinesis Data Firehose, AWS Lambda và Amazon S3 Lifecycle policies, bạn có thể tự động hóa việc quản lý retention policies một cách linh hoạt và hiệu quả về chi phí.

Giải pháp này giúp các tổ chức:
- Đáp ứng các yêu cầu tuân thủ khác nhau
- Tối ưu hóa chi phí lưu trữ
- Tự động hóa quản lý vòng đời dữ liệu
- Duy trì tính linh hoạt cho các thay đổi trong tương lai

## Tài Nguyên Bổ Sung

- [Amazon Connect Documentation](https://docs.aws.amazon.com/connect/)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [Amazon S3 Lifecycle Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [Amazon Kinesis Data Firehose Documentation](https://docs.aws.amazon.com/firehose/)
- [AWS CloudFormation User Guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/)

---

**Bài viết gốc**: [Customize retention policies for contact recordings in Amazon Connect](https://aws.amazon.com/jp/blogs/news/customize-retention-policies-for-contact-recordings-in-amazon-connect/)  
**Tác giả gốc**: Mo Miah, Jack Tilson  
**Dịch thuật**: Koki Takahashi (AWS Japan)  
**Người chuyển ngữ sang tiếng Việt**: 日平
