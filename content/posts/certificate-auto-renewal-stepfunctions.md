# Khuyến Nghị Tự Động Gia Hạn Chứng Chỉ − Đạt Được Zero Operations Với Step Functions × DigiCert API

## Giới Thiệu

Bạn có biết rằng thời hạn hiệu lực của chứng chỉ SSL/TLS server đang ngày càng rút ngắn không?

### Diễn Biến Thời Hạn Hiệu Lực Chứng Chỉ

| Khoảng thời gian | Thời hạn hiệu lực |
|------------------|-------------------|
| 2025-12-11 ~ 2026-03-14 | **397 ngày** |
| 2026-03-15 ~ | **200 ngày** |
| 2027-03-15 ~ | **100 ngày** |
| 2029-03-15 ~ | **47 ngày** |

> Tham khảo: [DigiCert Blog - TLS Certificate Lifetimes Will Officially Reduce to 47 Days](https://www.digicert.com/jp/blog/tls-certificate-lifetimes-will-officially-reduce-to-47-days)

Khi bước vào thời đại gia hạn 47 ngày, "người phụ trách gia hạn thủ công" sẽ không còn khả thi nữa.

Bài viết này giới thiệu phương pháp **xây dựng nền tảng tự động gia hạn chứng chỉ "zero operations" kết hợp AWS và DigiCert CertCentral API**.

**Tác giả**: @chotone  
**Tổ chức**: 株式会社VISIONARY JAPAN  
**Ngày công khai**: 10 tháng 12, 2025  
**Advent Calendar**: Day 11 株式会社VISIONARY JAPAN Advent Calendar 2025  
**Tags**: AWS, 設計, Lambda, 証明書, StepFunctions

---

## Mục Tiêu: Tự Động Hóa Từ Kiểm Tra Hạn Sử Dụng Đến Gia Hạn, Đăng Ký ACM Và Xác Nhận Kết Nối HTTPS

Hệ thống này tự động hóa các quy trình sau:

### Các Quy Trình Được Tự Động Hóa

✅ **Kiểm tra hạn sử dụng chứng chỉ**  
✅ **Tạo CSR / private key**  
✅ **Request phát hành chứng chỉ đến DigiCert**  
✅ **Xác nhận trạng thái (polling)**  
✅ **Lấy/lưu trữ chứng chỉ**  
✅ **Quy trình phê duyệt (thông báo email + API Gateway)**  
✅ **Import vào ACM**  
✅ **Xác nhận kết nối HTTPS (CloudWatch Synthetics Canary)**

**Sự can thiệp của con người chỉ là "khi click link phê duyệt"**.

---

## Kiến Trúc Tổng Thể

![Sơ đồ kiến trúc tổng thể](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3944833%2Fd88c4226-f9a8-4840-8c97-73462ee59f8f.png)

### Dịch Vụ AWS Sử Dụng

- **EventBridge**: Trigger thực thi định kỳ
- **Lambda**: Thực thi từng bước xử lý
- **Step Functions**: Orchestration quy trình công việc
- **Secrets Manager**: Quản lý an toàn private key và API Key
- **S3**: Lưu trữ CSR và chứng chỉ
- **API Gateway**: Endpoint cho quy trình phê duyệt
- **SNS**: Thông báo email
- **ACM (AWS Certificate Manager)**: Import và quản lý chứng chỉ
- **CloudWatch Synthetics**: Xác nhận kết nối HTTPS

### Dịch Vụ Bên Ngoài

- **DigiCert CertCentral API**: Phát hành và quản lý chứng chỉ

---

## Chi Tiết Quy Trình Hệ Thống

### Bước 1: Kiểm Tra Hạn Sử Dụng Chứng Chỉ

**Trigger**: Được thực thi định kỳ bởi EventBridge

**Nội dung xử lý**:
- Lấy danh sách chứng chỉ từ ACM
- Kiểm tra hạn sử dụng của từng chứng chỉ
- Khi vượt qua hạn gia hạn (ví dụ: 30 ngày trước), khởi động **Step Functions①**

**Ví dụ triển khai (Python)**:

```python
import boto3
from datetime import datetime, timedelta

acm = boto3.client('acm')
sfn = boto3.client('stepfunctions')

def lambda_handler(event, context):
    # Lấy danh sách chứng chỉ
    certificates = acm.list_certificates()
    
    for cert in certificates['CertificateSummaryList']:
        cert_arn = cert['CertificateArn']
        details = acm.describe_certificate(CertificateArn=cert_arn)
        
        # Kiểm tra hạn sử dụng
        not_after = details['Certificate']['NotAfter']
        days_until_expiry = (not_after - datetime.now()).days
        
        if days_until_expiry <= 30:
            # Khởi động Step Functions
            sfn.start_execution(
                stateMachineArn='arn:aws:states:...',
                input=json.dumps({'certificate_arn': cert_arn})
            )
```

---

### Bước 2: Tạo CSR Và Private Key → Lưu Trữ Vào Secrets Manager / S3

**Thư viện sử dụng**: `cryptography` của Python

**Nơi lưu trữ**:

| Dữ liệu | Nơi lưu trữ | Lý do |
|---------|-------------|-------|
| **Private key** | Secrets Manager | Bảo vệ KMS・Lấy lịch sử giải mã |
| **CSR / Public key** | S3 | Lưu trữ file |

**Ví dụ triển khai (Python)**:

```python
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography import x509
from cryptography.x509.oid import NameOID
import boto3

def generate_csr_and_key(common_name):
    # Tạo RSA private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    
    # Tạo CSR
    csr = x509.CertificateSigningRequestBuilder().subject_name(x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, common_name),
    ])).sign(private_key, hashes.SHA256())
    
    # Lưu private key vào Secrets Manager
    secrets_client = boto3.client('secretsmanager')
    secrets_client.create_secret(
        Name=f'cert-private-key-{common_name}',
        SecretString=private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode()
    )
    
    # Lưu CSR vào S3
    s3_client = boto3.client('s3')
    s3_client.put_object(
        Bucket='my-cert-bucket',
        Key=f'csr/{common_name}.csr',
        Body=csr.public_bytes(serialization.Encoding.PEM)
    )
```

---

### Bước 3: Request Phát Hành Qua DigiCert CertCentral API

**API Endpoint**:
```
POST https://www.digicert.com/services/v2/order/certificate/ssl
```

**API Reference**: [DigiCert CertCentral APIs](https://dev.digicert.com/en/certcentral-apis.html)

**Bảo mật**: API Key được lưu trong Secrets Manager

**Ví dụ request payload**:

```python
import requests
import boto3

def request_certificate(csr_data, common_name):
    # Lấy API Key từ Secrets Manager
    secrets_client = boto3.client('secretsmanager')
    api_key = secrets_client.get_secret_value(
        SecretId='digicert-api-key'
    )['SecretString']
    
    # Request đến DigiCert API
    headers = {
        'X-DC-DEVKEY': api_key,
        'Content-Type': 'application/json'
    }
    
    payload = {
        'certificate': {
            'csr': csr_data,
            'common_name': common_name
        },
        'validity': {
            'valid_days': 398
        },
        'payment_method': 'balance'
    }
    
    response = requests.post(
        'https://www.digicert.com/services/v2/order/certificate/ssl',
        headers=headers,
        json=payload
    )
    
    return response.json()
```

---

### Bước 4: Xác Nhận Trạng Thái (Polling)

**Phương pháp**: Vòng lặp **Wait → Lambda → Choice → Wait** của Step Functions

**Trạng thái mục tiêu**: Trạng thái `"issued"` của DigiCert

**Best practice**:
> Polling bằng Lambda đơn lẻ có vấn đề về timeout và tăng chi phí, nên **sử dụng Step Functions**

**Ví dụ định nghĩa Step Functions**:

```json
{
  "Comment": "Polling trạng thái phát hành chứng chỉ",
  "StartAt": "Wait",
  "States": {
    "Wait": {
      "Type": "Wait",
      "Seconds": 60,
      "Next": "CheckStatus"
    },
    "CheckStatus": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:function:CheckCertStatus",
      "Next": "IsIssued"
    },
    "IsIssued": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.status",
          "StringEquals": "issued",
          "Next": "DownloadCertificate"
        }
      ],
      "Default": "Wait"
    },
    "DownloadCertificate": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:function:DownloadCert",
      "End": true
    }
  }
}
```

---

### Bước 5: Lấy Chứng Chỉ (Lưu Trữ Vào S3)

**API Endpoint**:
```
GET /services/v2/order/certificate/{order_id}/download/platform/aws
```

**Nơi lưu trữ**: S3

**Cân nhắc**: Đảm bảo **tính idempotent** để không có vấn đề khi thực thi lại

---

### Bước 6: Tạo Link Phê Duyệt → Thông Báo SNS

**Mục đích**: Phê duyệt cuối cùng bởi bộ phận vận hành

**Cơ chế**:
1. Gửi email với URL của API Gateway kèm **one-time token (TaskToken)**
2. Khi người phê duyệt click, Lambda được thực thi
3. Lambda trả TaskToken cho **Step Functions②** và tiếp tục

**Ví dụ URL format**:
```
https://xxxx.execute-api.ap-northeast-1.amazonaws.com/prod/approve?token=XYZ
```

**Ví dụ triển khai Lambda (xử lý phê duyệt)**:

```python
import boto3

def lambda_handler(event, context):
    task_token = event['queryStringParameters']['token']
    
    sfn = boto3.client('stepfunctions')
    sfn.send_task_success(
        taskToken=task_token,
        output=json.dumps({'approved': True})
    )
    
    return {
        'statusCode': 200,
        'body': 'Phê duyệt đã hoàn tất'
    }
```

---

### Bước 7: Import Vào ACM → Xác Minh

**Hành động**: Đăng ký private key・chứng chỉ・chứng chỉ trung gian vào ACM

**Xác minh**: Sau khi đăng ký, xác nhận hạn sử dụng và trạng thái có hợp lệ không

**Ví dụ triển khai (Python)**:

```python
import boto3

def import_certificate_to_acm(cert_arn, certificate, private_key, chain):
    acm = boto3.client('acm')
    
    response = acm.import_certificate(
        CertificateArn=cert_arn,
        Certificate=certificate,
        PrivateKey=private_key,
        CertificateChain=chain
    )
    
    # Xác minh
    details = acm.describe_certificate(CertificateArn=cert_arn)
    print(f"Hạn sử dụng: {details['Certificate']['NotAfter']}")
    print(f"Trạng thái: {details['Certificate']['Status']}")
    
    return response
```

---

### Bước 8: Xác Nhận Kết Nối HTTPS Bằng CloudWatch Synthetics Canary

**Mục đích**: Thực thi TLS handshake và xác nhận thành công/thất bại

**Triển khai**: Thiết kế Canary cho "kiểm tra hạn sử dụng chứng chỉ"

**Alert**: Nếu kết quả là `"Failed"`, thông báo alert qua SNS

**Ví dụ script Canary (Node.js)**:

```javascript
const https = require('https');

exports.handler = async () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'example.com',
            port: 443,
            method: 'GET',
            rejectUnauthorized: true
        };
        
        const req = https.request(options, (res) => {
            if (res.socket.authorized) {
                console.log('TLS handshake thành công');
                resolve('PASS');
            } else {
                console.error('Lỗi xác minh chứng chỉ:', res.socket.authorizationError);
                reject('FAIL');
            }
        });
        
        req.on('error', (e) => {
            console.error('Lỗi request:', e);
            reject('FAIL');
        });
        
        req.end();
    });
};
```

**Ví dụ thực thi Canary (Python)**:

```python
import boto3

def start_canary(canary_name):
    synthetics = boto3.client('synthetics')
    
    response = synthetics.start_canary(Name=canary_name)
    print(f"Đã khởi động Canary {canary_name}")
    
    return response
```

---

## Điểm Chính Về Thiết Kế

| Khía cạnh | Công nghệ áp dụng | Lý do |
|-----------|-------------------|-------|
| **Quản lý private key** | Secrets Manager | Bảo vệ KMS・Lấy lịch sử giải mã |
| **Kiểm soát chờ thời gian dài** | Step Functions | Tránh timeout Lambda |
| **Xác nhận tình trạng phát hành** | Step Functions Wait | Best practice cho polling |
| **Quy trình phê duyệt** | API Gateway + SNS | Đơn giản và bảo mật |
| **Xác nhận kết nối HTTPS** | Synthetics Canary | Xác nhận đến tận TLS handshake |

---

## Tổng Kết

Do việc rút ngắn thời hạn hiệu lực chứng chỉ, **gia hạn thủ công chắc chắn sẽ đạt đến giới hạn trong tương lai**.

Với hệ thống được giới thiệu trong bài viết này, tất cả những điều sau có thể được tự động hóa:

✅ Kiểm tra hạn sử dụng chứng chỉ  
✅ Tạo CSR / private key  
✅ Request phát hành chứng chỉ đến DigiCert  
✅ Xác nhận trạng thái  
✅ Lấy/lưu trữ chứng chỉ  
✅ Quy trình phê duyệt  
✅ Import vào ACM  
✅ Xác nhận kết nối HTTPS

Hãy tham khảo để **hướng đến quản lý chứng chỉ zero operations**.

---

## Stack Công Nghệ

### Dịch Vụ AWS

- AWS Lambda
- AWS Step Functions
- AWS Secrets Manager
- Amazon S3
- Amazon EventBridge
- AWS Certificate Manager (ACM)
- Amazon API Gateway
- Amazon SNS
- Amazon CloudWatch Synthetics

### Dịch Vụ Bên Ngoài

- DigiCert CertCentral API

### Thư Viện

- Python `cryptography`
- Python `boto3`
- Python `requests`

---

## Cân Nhắc Về Bảo Mật

- **API Key**: DigiCert API Key được lưu trong Secrets Manager
- **Private key**: Được bảo vệ KMS trong Secrets Manager
- **Audit**: Có thể lấy lịch sử giải mã
- **Quy trình phê duyệt**: Quy trình phê duyệt bảo mật với API Gateway + one-time token

---

**Nguồn**: [Qiita - 証明書の自動更新のすすめ − Step Functions × DigiCert API で運用ゼロを実現](https://qiita.com/chotone/items/a560ae8eab9ec6403e10)

**Tác giả**: [@chotone](https://qiita.com/chotone)  
**Tổ chức**: 株式会社VISIONARY JAPAN  
**Advent Calendar**: [株式会社VISIONARY JAPAN Advent Calendar 2025](https://qiita.com/advent-calendar/2025/visionary-japan)
