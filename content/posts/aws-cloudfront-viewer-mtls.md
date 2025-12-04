---
title: "Tin cậy là Con đường Hai chiều: Amazon CloudFront Hỗ trợ Viewer mTLS"
date: 2025-12-04T14:00:00+09:00
categories: ["Cloud", "Security and Networking", "DevOps and Infrastructure"]
tags: ["CloudFront", "mTLS", "Mutual TLS", "Security", "Certificate Authentication", "Zero Trust", "Edge Security", "TLS"]
author: "Yutaka Oka, Tomoya Kudo, Sagar Desarda"
translator: "日平"
---

# Tin cậy là Con đường Hai chiều: Amazon CloudFront Hỗ trợ Viewer mTLS

## Giới thiệu

Hôm nay, **Amazon CloudFront** hỗ trợ **mutual TLS authentication (mTLS)** từ end-user đến CloudFront, tăng cường security cho các ứng dụng highly distributed và sensitive.

### Tại sao cần mTLS?

Trong kiến trúc hiện đại, việc bảo vệ client-server communication cần **nhiều hơn standard TLS**. **mTLS** mở rộng model này bằng cách:

- **Enforcing mutual authentication**: Đảm bảo cả client và server verify lẫn nhau trước khi data exchange
- **Protocol-level access control**: Enforcement ở protocol level với ID verification chi tiết
- **Regulatory compliance**: Streamline audit và compliance trong môi trường regulated

## Lợi ích của mTLS trong CloudFront Applications

### Security Layer bổ sung

**mTLS** yêu cầu cả server và client present và verify digital certificate, achieving mutual authentication.

**Key features**:
- **Cryptographic proof of identity**: Cung cấp chứng minh danh tính qua mã hóa
- **Credential-based attack prevention**: Ngăn chặn tấn công dựa trên credentials
- **Zero-trust enforcement**: Enforce zero-trust principles trong distributed system

### Industry Use Cases

#### 1. Financial Services (Dịch vụ Tài chính)

**Frameworks**: PCI DSS, PSD2

**Yêu cầu**:
- Bảo vệ API transactions với banks, payment gateways, trusted third parties (TTP)

**Example**:
- Financial trading platforms sử dụng mTLS để authenticate brokers và partner institutions trước khi cho phép access đến market data hoặc trade execution endpoints

#### 2. IoT và Connected Devices

**Use case**:
- Connected cars, sensors gửi telemetry data đến cloud

**Protection**:
- Authenticate devices trước khi gửi data
- Bảo vệ khỏi imposter devices và data injection

#### 3. Enterprise Applications

**Scope**:
- Internal microservices communication
- Enterprise systems và SaaS platforms (HR, payroll, analytics)

**Benefits**:
- Enforce authentication và encryption
- Giảm risk của lateral movement và unauthorized data access

#### 4. Healthcare (Y tế)

**Compliance**: HIPAA

**Use case**:
- Authenticate EHR systems, medical devices, APIs exchanging sensitive patient data

**Protection**: Protected Health Information (PHI)

#### 5. Telecom và Media

**Use case**:
- Secure control và content delivery channels giữa edge nodes và origin servers

**Benefit**: Chỉ trusted infrastructure components có thể exchange live hoặc on-demand media traffic

### CloudFront mTLS Features

CloudFront đã support mTLS để đáp ứng các security needs đa dạng và nghiêm ngặt này:

**Capabilities**:
- **Edge authentication**: Authenticate clients (applications, devices, services) trực tiếp tại edge trước khi requests reach origin
- **Scope extension**: Mở rộng mTLS protection từ service-to-service traffic sang user-facing scenarios
- **Global enforcement**: Enforce client certificate validation globally với minimal latency
- **Trust Store integration**: Seamless integration với CloudFront Trust Store

**CA Options**:
- Sử dụng **AWS Private Certificate Authority**
- Hoặc leverage CA riêng của bạn

**Benefits**:
- Implement granular authentication policies
- Automate certificate provisioning
- Achieve compliance without adding operational complexity

## Bắt đầu (Getting Started)

### Prerequisites

Để implement mTLS authentication cho CloudFront distribution:

1. **Setup private certificate authority**
2. **Create client certificates**
3. **Prepare certificates**:
   - Root CA và intermediate CA public key certificates trong PEM file format
4. **Upload to S3**: Upload certificate file đến Amazon S3 bucket (serves as trust store source)

### Certificate Creation Options

#### Option 1: OpenSSL

Tạo private CA và client certificates thủ công với OpenSSL.

#### Option 2: AWS Private CA

Sử dụng **AWS Certificate Manager Private CA** (fully-managed service) để streamline process.

**Documentation**: [AWS Private CA](https://docs.aws.amazon.com/privateca/latest/userguide/PcaPlanning.html)

## Private CA Creation với OpenSSL

### Step 1: Generate Private CA Key và Certificate

```bash
# Generate CA private key
openssl genrsa -out Root_CA.key 4096

# Create CA certificate
openssl req -new -x509 -days 3650 -key Root_CA.key -out Root_CA.pem
```

**Note**: Trong quá trình tạo certificate, bạn sẽ được yêu cầu cung cấp thông tin cho certificate's Distinguished Name (DN) fields.

### Step 1a: Optional - Create Intermediate CA

CloudFront supports **up to 4 levels** của certificate chain including root certificate cho mTLS authentication.

**Combine certificates**:

```bash
# Create CA bundle
cat Root_CA.pem Intermediate_CA.pem > Trust_store_bundle.pem
```

### Step 2: Generate Client Certificate Private Key và CSR

```bash
# Generate client certificate private key
openssl genrsa -out my_client.key 2048

# Create Certificate Signing Request (CSR)
openssl req -new -key my_client.key -out my_client.csr
```

**Input required**:
- Subject name
- Location
- Organization
- Organizational unit properties
- **Note**: Leave optional password challenge empty

### Step 3: Sign Client Certificate với Root CA

```bash
# Sign client CSR with Root CA
openssl x509 -req \
-in my_client.csr \
-CA Root_CA.pem \
-CAkey Root_CA.key \
-set_serial 01 \
-out my_client.pem \
-days 3650 \
-sha256
```

### Step 4: Verify Created Files

Sau khi complete các steps, directory của bạn nên có các files sau:

| File | Description |
|------|-------------|
| `Root_CA.key` | Root CA private key |
| `Root_CA.pem` hoặc `Trust_store_bundle.pem` | CA bundle |
| `my_client.csr` | Client certificate signing request |
| `my_client.key` | Client certificate private key |
| `my_client.pem` | Client certificate |

## Trust Store Configuration

### Prerequisites

Root CA certificate hoặc CA bundle (PEM file) từ certificate authority đã được upload lên S3 bucket.

### Configuration Steps

#### Step 1: Create Trust Store

1. Trong CloudFront console, chọn **Trust Store** under **Security** trong left menu
2. Chọn **Create trust store**

#### Step 2: Specify S3 Bucket Location

1. Trên page này, specify S3 bucket location
2. Press **Create trust store**
3. CA bundle được read và stored trong CloudFront trust store

#### Step 3: Associate to Distribution

1. Sau khi trust store được created, console navigate đến trust store details page
2. Từ page này, press **Associate to distribution** button để associate trust store với distribution

#### Step 4: Select Distribution

Trên page này, bạn có thể select distribution để associate trust store.

**Alternative**: Bạn cũng có thể associate trust store từ distribution settings (next section).

## Distribution Configuration

### Prerequisites

**Required**: Viewer protocol của target CloudFront distribution phải là **HTTPS only**.

### Enable Viewer mTLS Authentication

#### Step 1: Toggle mTLS Setting

1. Navigate đến distribution settings
2. Toggle **Viewer mutual authentication (mTLS)** setting sang **On**

#### Step 2: Select mTLS Parameters

Chọn mTLS parameters phù hợp với use case của bạn:

### Mode

**Required mode**:
- Tất cả clients yêu cầu valid certificate

**Optional mode**:
- Accept cả mTLS clients và non-mTLS clients trên same distribution
- Reject invalid certificates
- Enable mixed authentication simultaneously

### Trust Store

Sau khi enable viewer mTLS authentication, select previously created trust store để associate với distribution.

### Optional Parameters

Cả hai optional parameters này default là **False**:

#### 1. Ignore Certificate Expiration Date

**Default**: False

**When true**:
- CloudFront accepts connection từ viewer ngay cả khi một hoặc nhiều certificates trong client certificate chain fail X509 expiration validation
- Current time trước `NotBefore` hoặc sau `NotAfter`

**Note**: X509 certificate validation của other elements vẫn áp dụng. Client certificate phải signed bởi trusted certificate chain trong CA bundle.

#### 2. Advertise Trust Store CA Names

**Default**: False

**When true**:
- CloudFront advertise list của certificate authority names mà distribution accepts đến viewer
- Đây là list của certificate Distinguished Names (DN) trong trust store

### Connection Function (Optional)

**Description**: Optional extension của viewer mTLS

**Capabilities**:
- Perform custom validation như một phần của mTLS handshake process
- Allow, deny, hoặc log connection dựa trên client và certificate information

## CloudFront Viewer Certificate Headers

CloudFront có thể **extract information** từ client certificate và **add as HTTP headers** đến viewer request.

### Usage

Các headers này có thể:
- Used as **part of cache key**
- **Forwarded to origin server**
- **Read when processing** viewer request với CloudFront Functions hoặc Lambda@Edge

### Available Headers

- **CloudFront-Viewer-Cert-Serial-Number**: Certificate serial number
- **CloudFront-Viewer-Cert-Issuer**: Certificate issuer distinguished name
- **CloudFront-Viewer-Cert-Subject**: Subject distinguished name
- **CloudFront-Viewer-Cert-Validity**: Certificate validity period (start và end dates trong ISO8601 format)
- **CloudFront-Viewer-Cert-PEM**: URL-encoded PEM format leaf certificate
- **CloudFront-Viewer-Cert-Present**: 1 nếu certificate present, 0 nếu absent (always 1 trong Require mode)
- **CloudFront-Viewer-Cert-SHA256**: SHA256 hash của client certificate

**Documentation**: [Viewer mTLS headers for cache policies and forwarded to origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewer-mtls-headers.html)

## Testing mTLS Authentication

### Using curl với Client Certificate

```bash
curl --key my_client.key \
--cert my_client.pem \
https://dxxxxxxxxxxxxx.cloudfront.net
```

**Parameters**:
- `--key`: Specify client private key file
- `--cert`: Specify client certificate file
- `dxxxxxxxxxxxxx.cloudfront.net`: Replace với actual CloudFront distribution domain name với mTLS enabled

### Success Example

Authentication success (with valid client certificate):

```
HTTP/2 200
content-type: text/html; charset=UTF-8
content-length:xxx
date: xxx
...
```

### Rejection Example

Authentication rejection (với invalid hoặc missing certificate):

```
* Request completely sent off
* Closing connection
* Recv failure: Connection reset by peer
* Send failure: Broken pipe
curl: (16) Recv failure: Connection reset by peer
```

## mTLS Authentication Process Overview

Diagram sau minh họa overall process của mTLS authentication trong CloudFront:

### Steps

1. **Upload CA bundle** đến S3 bucket
2. **Create trust store** và provide Amazon S3 path đến CA certificate bundle
3. **Client initiates TLS session** với CloudFront. Trong TLS handshake, client presents TLS certificate
4. **CloudFront validates** client certificate và mTLS session established
   - **Optional 4a**: Có thể execute Connection function triggered bởi TLS handshake. Extract information từ client certificate và reject connections từ clients với invalid certificate dựa trên custom logic
5. **Optional**: Trigger viewer request edge function để execute CloudFront functions. Extract information từ client certificate qua `cloudfront-viewer-cert` headers
6. **Optional**: Nếu enable `cloudfront-viewer-cert` headers trong origin request policy, CloudFront forwards client certificate information đến origin server

### Custom Authentication và Security Controls

CloudFront enables custom authentication và security controls sử dụng:

- **Connection Function**: Executed during TLS handshake
- **Viewer request edge function**: Executed after handshake completion

Để implement certificate-based validation.

**Documentation**: [CloudFront Viewer mTLS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/mtls-authentication.html)

## Monitoring với Connection Logs

### Connection Logs Overview

CloudFront generates **Connection Logs** capturing detailed information về TLS handshakes.

### Use Cases

- **Monitor và troubleshoot** mTLS-enabled distributions
- **Track** successful mTLS handshakes và client certificates
- **Visualize** failed mTLS handshakes

### Custom Log Data

Với Connection Functions, bạn có thể **add custom log data** đến Connection Logs:

**Method**: Sử dụng `logCustomData` helper method available trong connection object của Connection Functions

**Field**: `connectionLogCustomData`

**Limit**: Có thể log up to **800 bytes** của valid UTF-8 string

### Log Delivery

CloudFront delivers Connection Logs qua **CloudWatch vended logs**:

**Destinations**:
- CloudWatch Logs
- Amazon Data Firehose
- Amazon S3

**Output formats**:
- JSON
- w3c
- Parquet (Amazon S3 only)

### Connection ID

**Unique identifier**: Mỗi mTLS connection generates unique identifier `connectionId`

**Logging**: Recorded across CloudFront log types:
- Connection logs
- Standard logs
- Realtime logs

**Usage**: Sử dụng unified identifier này để:
- Investigate và correlate access patterns across Connection logs và access logs
- Trace specific requests với `connectionId`
- More efficient troubleshooting và analysis

**Documentation**: [Observability using connection logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/connection-logs.html)

## Certificate Revocation Validation với Connection Functions và KeyValueStore

### Problem Statement

Trong mTLS authentication, **certificates có thể bị revoked** do theft hoặc compromise ngay cả khi còn trong valid period.

### Solution

Combine **CloudFront Connection Functions** và **CloudFront KeyValueStore** để implement **real-time certificate revocation check**.

## Prepare CloudFront KeyValueStore

### Step 1: Create KeyValueStore

1. Trong CloudFront console, chọn **Functions** trong left menu
2. Open **KeyValueStores** tab ở top
3. Chọn **Create KeyValueStore**

### Step 2: Enter Name

1. Input KeyValueStore name
2. Press **Create**
3. **Optional**: Import data từ Amazon S3 nếu cần

### Step 3: Enter Revoked Certificate Serial Numbers

1. Select created KeyValueStore
2. Chọn edit under key-value pairs
3. Enter serial numbers của revoked certificates

### Step 4: Save Changes

Press **Save changes** để save entries.

## Create Connection Function

### Step 1: Create Function

1. Trong CloudFront console, chọn **Functions** trong left menu
2. Select **Connection Functions** tab ở top
3. Chọn **Create connection function**

### Step 2: Enter Name

1. Input function name
2. Press **Create**

### Step 3: Associate KeyValueStore

1. Under **Associated KeyValueStore**
2. Chọn **Associate existing KeyValueStore**
3. Associate KeyValueStore vừa tạo

### Step 4: Add Function Code

Paste code sau vào **Function Code** và press **Save Change**:

```javascript
import cf from 'cloudfront';

async function connectionHandler(connection) {
    const kvsHandle = cf.kvs();
    
    // Get certificate serial number
    const serialNumber = connection.clientCertificate.certificates.leaf.serialNumber.replace(/:/g, "");
    
    // Check revocation status in KVS
    const isRevoked = await kvsHandle.exists(serialNumber);
    
    if (isRevoked) {
        // Deny connection for revoked certificate
        connection.logCustomData(`Revoked certificate: ${serialNumber}`);
        console.log(`Denying connection for revoked certificate: ${serialNumber}`);
        return connection.deny();
    }
    
    // Allow connection for valid certificate
    connection.logCustomData(`Valid certificate: ${serialNumber}`);
    console.log(`Allowing connection for valid certificate: ${serialNumber}`);
    return connection.allow();
}
```

### Step 5: Test Function

1. Trong **Test** tab, có thể test created function
2. Input certificate information và serial number added đến KeyValueStore
3. Select **Test function** để verify certificate properly revoked

### Step 6: Publish Function

1. Trong **Publish** tab, press **Publish connection function**

### Step 7: Associate Distribution

1. Under **Associated distributions**, chọn **Add association**
2. Select distribution để associate function
3. Press **Associate**

## Test và Verification

### Test với Revoked Certificate

```bash
# Test với revoked certificate (connection nên bị rejected)
# Note: Replace với actual CloudFront distribution domain
curl --key revoked_client.key \
--cert revoked_client.pem \
https://dxxxxxxxxxxxxx.cloudfront.net
```

### Test với Valid Certificate

```bash
# Test với valid certificate (connection nên được allowed)
curl --key valid_client.key \
--cert valid_client.pem \
https://dxxxxxxxxxxxxx.cloudfront.net
```

## Kết luận

Security trên internet luôn dựa trên **trust**. Với **mTLS**, mutual verification được thực hiện trước mỗi connection.

### CloudFront mTLS Benefits

Với viewer mTLS qua Amazon CloudFront:
- **Global deployment**: Deploy và operate ở global scale
- **Precise control**: Accurately determine users hoặc devices có thể communicate với application
- **No speed compromise**: Without slowing down

### Next Steps

Check [AWS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/mtls-authentication.html) để xem cách introduce mTLS authentication tại edge, và utilize mTLS trong CloudFront distribution của bạn!

## Resources

### Documentation

- [CloudFront Viewer mTLS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/mtls-authentication.html)
- [Viewer mTLS headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewer-mtls-headers.html)
- [Connection logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/connection-logs.html)
- [AWS Private CA](https://docs.aws.amazon.com/privateca/latest/userguide/PcaPlanning.html)

---

**Authors**: Yutaka Oka, Tomoya Kudo, Sagar Desarda  
**Translator**: 日平  
**Ngày xuất bản**: 2025-12-04
