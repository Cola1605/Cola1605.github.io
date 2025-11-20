---
title: "Hướng Dẫn Xử Lý Lỗi Toàn Diện cho Kiến Trúc CloudFront + WAF + ALB + EC2/ECS/EKS"
date: 2025-10-02T06:00:00+07:00
categories: ["AWS", "Business and Technology", "DevOps and Infrastructure"]
tags: ["AWS", "CloudFront", "WAF", "ALB", "EC2", "ECS", "EKS", "Error Handling"]
description: "Hướng dẫn toàn diện về xử lý lỗi trong kiến trúc AWS CloudFront + WAF + ALB"
---

## Tổng Quan

Giải thích toàn diện về các thông báo lỗi xảy ra trong kiến trúc CloudFront + WAF + ALB + EC2/ECS/EKS. Giới thiệu các phương pháp xác định nguyên nhân và giải pháp cho các vấn đề thường gặp trong vận hành thực tế như lỗi 403 do WAF block, lỗi 502/504 tại ALB, lỗi 503 từ backend services kèm theo ví dụ cụ thể.

## Mục Lục

- Giới thiệu
- Phương pháp xác định điểm xảy ra lỗi
- Thông báo lỗi và đối策 theo từng layer
- Vấn đề đặc thù theo từng kiến trúc
- Quy trình troubleshooting hiệu quả
- Biện pháp phòng ngừa và Best Practices
- Kết luận
- Tài liệu tham khảo

## Giới Thiệu

Trong các ứng dụng web hiện đại, kiến trúc đa tầng kết hợp CloudFront (CDN), WAF (Web Application Firewall), ALB (Application Load Balancer) và EC2/ECS/EKS (Compute Services) đã trở nên phổ biến. Mặc dù kiến trúc này cung cấp tính khả dụng cao và bảo mật, nhưng có thể xảy ra lỗi tại mỗi layer.

Hướng dẫn này sẽ giải thích một cách có hệ thống các thông báo lỗi điển hình gặp phải trong vận hành thực tế, từ phương pháp xác định nguyên nhân đến các bước giải quyết cụ thể.

## Phương Pháp Xác Định Điểm Xảy Ra Lỗi

### Phân Loại và Nhận Diện Lỗi

Trong kiến trúc này, lỗi có thể xảy ra tại 4 layer sau:

| Layer | Nguyên nhân lỗi chính | Log cần kiểm tra |
|-------|----------------------|------------------|
| CloudFront | Cấu hình cache, kết nối origin | CloudFront access logs |
| WAF | Rule match, Rate limiting | AWS WAF logs |
| ALB | Target không healthy, timeout | ALB access logs |
| Backend | Application, thiếu tài nguyên | Application logs |

### Quy Trình Phân Tích Cơ Bản

**Kiểm tra HTTP Status Code**
- 4xx: Vấn đề phía client (WAF, authentication, v.v.)
- 5xx: Vấn đề phía server (ALB, backend)

**Sử dụng X-Amz-Cf-Id**

```bash
# Tìm kiếm log bằng CloudFront Request ID
aws logs filter-log-events \
  --log-group-name /aws/cloudfront/distribution \
  --filter-pattern "Request-ID" \
  --region us-east-1
```

**Liên kết theo Timestamp**  
Sắp xếp log của từng layer theo thời gian để xác định thứ tự xảy ra lỗi.

## Thông Báo Lỗi và Đối Sách Theo Từng Layer

### 3.1 Lỗi Do WAF

#### 403 Forbidden (WAF Block)

**Triệu chứng:**
- User nhận về lỗi 403
- Chỉ request từ IP hoặc pattern cụ thể gặp lỗi

**Phương pháp xác định nguyên nhân:**

Kiểm tra WAF logs:

```bash
# Kiểm tra WAF logs
aws logs filter-log-events \
  --log-group-name /aws/wafv2/webacl \
  --filter-pattern "BLOCK" \
  --region ap-northeast-1
```

Ví dụ WAF log:

```json
{
  "timestamp": 1706123456789,
  "action": "BLOCK",
  "terminatingRuleId": "rate-limit-rule",
  "httpRequest": {
    "clientIp": "192.0.2.1",
    "uri": "/api/login"
  }
}
```

**Nguyên nhân chính và đối sách:**

1. **Block do Rate Limiting**
   - Nguyên nhân: Quá nhiều request trong thời gian ngắn
   - Đối sách: Điều chỉnh threshold, thiết lập exclude cho traffic hợp lệ

2. **Hạn chế địa lý**
   - Nguyên nhân: Truy cập từ quốc gia bị hạn chế
   - Đối sách: Xem xét lại danh sách quốc gia được phép

3. **Phát hiện SQL Injection**
   - Nguyên nhân: Query parameter có pattern đáng ngờ
   - Đối sách: Thêm rule exclude cho false positive pattern

**Ví dụ đối sách:**

```bash
# Thay đổi threshold của rate limit rule
aws wafv2 update-rule-group \
  --scope CLOUDFRONT \
  --id rule-group-id \
  --rules file://updated-rules.json \
  --region us-east-1
```

### 3.2 Lỗi Giữa CloudFront-ALB

#### 502 Bad Gateway (ALB không phản hồi)

**Triệu chứng:**
- Kết nối từ CloudFront đến ALB thất bại
- Lỗi xảy ra không liên tục

**Phương pháp xác định nguyên nhân:**

Kiểm tra origin status trong CloudFront logs:

```bash
# Ví dụ CloudFront access log
2024-01-25 12:00:00 SEA19-C1 192.0.2.1 GET /api/health 502 - Mozilla/5.0...
```

**Nguyên nhân chính và đối sách:**

1. **Cấu hình Security Group của ALB**
   - Nguyên nhân: Từ chối kết nối từ IP range của CloudFront
   - Đối sách: Cho phép IP range của CloudFront trong security group

```bash
# Kiểm tra IP range của CloudFront
curl -s https://ip-ranges.amazonaws.com/ip-ranges.json | \
  jq '.prefixes[] | select(.service=="CLOUDFRONT")'
```

2. **Cấu hình Listener của ALB**
   - Nguyên nhân: HTTPS listener chưa được thiết lập đúng
   - Đối sách: Kiểm tra cấu hình certificate và listener

#### 504 Gateway Timeout (Timeout giữa CloudFront→ALB)

**Nguyên nhân và đối sách:**

1. **Cấu hình Origin Timeout của CloudFront**

```bash
# Kiểm tra cấu hình origin timeout
aws cloudfront get-distribution-config \
  --id DISTRIBUTION_ID \
  --region us-east-1
```

2. **Cải thiện thời gian phản hồi của ALB**
   - Điều chỉnh interval health check của target group
   - Cải thiện performance của backend server

### 3.3 Lỗi Giữa ALB-Backend

#### 502 Bad Gateway (Phản hồi không hợp lệ từ backend)

**Triệu chứng:**
- ALB không thể nhận phản hồi bình thường từ backend
- Lỗi application hoặc process bị dừng

**Phương pháp xác định nguyên nhân:**

Kiểm tra ALB access logs:

```bash
# Ví dụ ALB access log
2024-01-25T12:00:00.000000Z app/my-alb/1234567890123456 192.0.2.1:12345 10.0.1.100:80 0.001 0.002 0.000 502 200 0 257 "GET http://example.com:80/api/health HTTP/1.1"
```

**Nguyên nhân chính và đối sách:**

1. **Process application bị dừng**
   - EC2: `systemctl status application`
   - ECS: Kiểm tra trạng thái task
   - EKS: `kubectl get pods`

2. **Thiếu memory hoặc CPU quá tải**

```bash
# Kiểm tra tài nguyên trên EC2
top
free -h
df -h
```

3. **Cấu hình port không khớp**
   - Application không listen trên port mong đợi
   - Port bị đóng trong security group

#### 503 Service Unavailable (Target không healthy)

**Phương pháp xác định nguyên nhân:**

Kiểm tra trạng thái target group:

```bash
# Kiểm tra tình trạng healthy của target
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/my-targets/1234567890123456 \
  --region ap-northeast-1
```

**Nguyên nhân chính và đối sách:**

1. **Health check thất bại**
   - Xem xét lại health check path
   - Điều chỉnh giá trị timeout

```bash
# Thay đổi cấu hình health check
aws elbv2 modify-target-group \
  --target-group-arn TARGET_GROUP_ARN \
  --health-check-interval-seconds 10 \
  --health-check-timeout-seconds 5 \
  --region ap-northeast-1
```

2. **Tất cả target đều không healthy**
   - Sự cố quy mô lớn của application
   - Vấn đề cấp độ infrastructure

## Vấn Đề Đặc Thù Theo Từng Kiến Trúc

### Lưu Ý với Kiến Trúc EC2

**Vấn đề thường gặp:**
- Instance bị stop/restart
- Hết dung lượng disk
- Service bị dừng do security update

**Đối sách:**

```bash
# Kiểm tra trạng thái EC2 instance
aws ec2 describe-instances \
  --instance-ids i-1234567890abcdef0 \
  --region ap-northeast-1 \
  --query 'Reservations[].Instances[].State.Name'
```

### Lưu Ý với Kiến Trúc ECS

**Vấn đề thường gặp:**
- Task definition có vấn đề
- Deploy service thất bại
- Task bị dừng do thiếu tài nguyên

**Đối sách:**

```bash
# Kiểm tra trạng thái ECS service
aws ecs describe-services \
  --cluster my-cluster \
  --services my-service \
  --region ap-northeast-1
```

### Lưu Ý với Kiến Trúc EKS

**Vấn đề thường gặp:**
- Pod không thể start
- Cấu hình Service có vấn đề
- Vấn đề với Ingress controller

**Đối sách:**

```bash
# Kiểm tra trạng thái Pod
kubectl get pods -o wide
kubectl describe pod POD_NAME

# Kiểm tra Service
kubectl get svc
kubectl describe svc SERVICE_NAME
```

## Quy Trình Troubleshooting Hiệu Quả

### Phương Pháp Tiệm Cận Từng Bước

1. **Kiểm tra error code và timestamp**
2. **Kiểm tra CloudFront logs**
3. **Kiểm tra WAF logs (với lỗi 403)**
4. **Kiểm tra ALB logs và metrics**
5. **Kiểm tra trạng thái backend service**

### Ví Dụ Script Phân Tích Log Tổng Hợp

```bash
#!/bin/bash

# Chỉ định thời gian xảy ra lỗi
ERROR_TIME="2024-01-25 12:00:00"
CLOUDFRONT_ID="X-Amz-Cf-Id-Value"

echo "=== CloudFront Log ==="
aws logs filter-log-events \
  --log-group-name /aws/cloudfront/distribution \
  --filter-pattern "$CLOUDFRONT_ID" \
  --region us-east-1

echo "=== WAF Log ==="
aws logs filter-log-events \
  --log-group-name /aws/wafv2/webacl \
  --start-time $(date -d "$ERROR_TIME -1 min" +%s)000 \
  --end-time $(date -d "$ERROR_TIME +1 min" +%s)000 \
  --region ap-northeast-1

echo "=== ALB Metrics ==="
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --start-time "$ERROR_TIME" \
  --end-time "$(date -d "$ERROR_TIME +5 min" --iso-8601)" \
  --period 60 \
  --statistics Sum \
  --region ap-northeast-1
```

## Biện Pháp Phòng Ngừa và Best Practices

### Cấu Hình Timeout Phù Hợp

Giá trị timeout của từng layer cần duy trì mối quan hệ sau:

```
CloudFront Timeout > ALB Timeout > Backend Timeout
```

**Giá trị khuyến nghị:**

| Layer | Mục cấu hình | Giá trị khuyến nghị |
|-------|-------------|---------------------|
| CloudFront | Origin Request Timeout | 60 giây |
| CloudFront | Origin Response Timeout | 30 giây |
| ALB | Idle Timeout | 60 giây |
| ALB | Target Response Timeout | 5 giây |

### Best Practices cho WAF Rule

1. **Triển khai từng bước**

```bash
# Đầu tiên kiểm tra hoạt động ở chế độ COUNT
aws wafv2 update-web-acl \
  --scope CLOUDFRONT \
  --id WEB_ACL_ID \
  --default-action '{"Allow":{}}' \
  --region us-east-1
```

2. **Sử dụng Whitelist**
   - Exclude IP address của admin
   - Exclude client API hợp lệ

3. **Giám sát log liên tục**

```bash
# Kiểm tra số lượng block hàng ngày
aws logs filter-log-events \
  --log-group-name /aws/wafv2/webacl \
  --filter-pattern "BLOCK" \
  --start-time $(date -d "yesterday" +%s)000 \
  --region ap-northeast-1 | jq '.events | length'
```

### Cấu Hình Monitoring・Alert

**Ví dụ cấu hình CloudWatch Alarm:**

```bash
# Alarm cho tỷ lệ lỗi 5xx của ALB
aws cloudwatch put-metric-alarm \
  --alarm-name "ALB-High-5xx-Rate" \
  --alarm-description "ALB 5xx error rate is high" \
  --metric-name HTTPCode_ELB_5XX_Count \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --region ap-northeast-1
```

**Giám sát số lượng WAF block:**

```bash
# Alarm cho số lượng WAF block
aws cloudwatch put-metric-alarm \
  --alarm-name "WAF-High-Block-Rate" \
  --alarm-description "WAF is blocking too many requests" \
  --metric-name BlockedRequests \
  --namespace AWS/WAFV2 \
  --statistic Sum \
  --period 300 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --region ap-northeast-1
```

## Kết Luận

Kiến trúc CloudFront + WAF + ALB + EC2/ECS/EKS là một architecture mạnh mẽ giúp đạt được tính khả dụng cao và bảo mật, nhưng do cấu trúc đa tầng nên troubleshooting có thể trở nên phức tạp.

Các điểm quan trọng để xử lý lỗi hiệu quả:

- **Kiểm tra log của từng layer một cách có hệ thống**
- **Xây dựng cấu hình timeout phù hợp và hệ thống giám sát**
- **Triển khai WAF rule từng bước và điều chỉnh liên tục**
- **Thiết lập giám sát và alert phòng ngừa để phát hiện sớm**

Bằng cách sử dụng những kiến thức và phương pháp này, có thể vận hành ứng dụng web một cách ổn định hơn.

### Bước Tiếp Theo

- Sử dụng AWS X-Ray để tracing request chi tiết
- Giám sát đặc thù application bằng custom metrics
- Tự động hóa quản lý cấu hình bằng Infrastructure as Code (CloudFormation/Terraform)

## Tài Liệu Tham Khảo

- 「Amazon CloudFront Developer Guide」AWS Documentation, https://docs.aws.amazon.com/cloudfront/latest/DeveloperGuide/
- 「AWS WAF Developer Guide」AWS Documentation, https://docs.aws.amazon.com/waf/latest/developerguide/
- 「Application Load Balancer User Guide」AWS Documentation, https://docs.aws.amazon.com/elasticloadbalancing/latest/application/
- 「Amazon EC2 User Guide」AWS Documentation, https://docs.aws.amazon.com/ec2/latest/userguide/
- 「Amazon ECS Developer Guide」AWS Documentation, https://docs.aws.amazon.com/ecs/latest/developerguide/
- 「Amazon EKS User Guide」AWS Documentation, https://docs.aws.amazon.com/eks/latest/userguide/
- 「CloudWatch Logs User Guide」AWS Documentation, https://docs.aws.amazon.com/logs/latest/userguide/
- 「AWS CLI Command Reference」AWS Documentation, https://docs.aws.amazon.com/cli/latest/reference/

---

*Bài viết này được crawl từ [bài gốc](https://qiita.com/mkydk/items/afd4e2e91dbdb556aca5).*
