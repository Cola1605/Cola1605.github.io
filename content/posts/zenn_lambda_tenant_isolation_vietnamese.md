---
title: "Lambda Tenant Isolation Mode (Chế độ phân tách Tenant)"
date: 2025-11-23T00:00:00+07:00
lastmod: 2025-11-24T00:00:00+07:00
draft: false
categories: ["AWS", "Cloud", "DevOps and Infrastructure"]
tags: ["AWS Lambda", "Serverless", "SaaS", "Multi-tenant", "AWS"]
description: "Tìm hiểu tính năng mới Lambda Tenant Isolation Mode của AWS - cho phép phân tách hoàn toàn môi trường thực thi cho từng tenant trong ứng dụng SaaS đa tenant với một Lambda function duy nhất. Hướng dẫn cấu hình, use case và các lưu ý quan trọng."
author: "かとりょー"
translator: "日平"
---

# Lambda Tenant Isolation Mode (Chế độ phân tách Tenant)

## Giới thiệu

Xin chào, tôi là かとりょー.

Ngày 19 tháng 11 năm 2025, AWS Lambda đã ra mắt tính năng mới có tên "Tenant Isolation Mode (Chế độ phân tách Tenant)". Đây là tính năng dành cho các ứng dụng SaaS đa tenant, cho phép chia sẻ một Lambda function duy nhất giữa nhiều tenant, đồng thời phân tách hoàn toàn môi trường thực thi cho từng tenant bằng cách chỉ định tenant ID khi thực thi.

Bài viết này sẽ giải thích tổng quan, cách sử dụng và các hạn chế của tính năng mới này.

## Tóm tắt nhanh (tl;dr)

Các điểm quan trọng của Lambda Tenant Isolation Mode:

1. **Bất biến (Immutable)**: Chỉ có thể chỉ định khi tạo function, không thể thay đổi sau khi tạo
2. **Hạn chế trigger**: Chỉ hỗ trợ API Gateway (REST) và gọi trực tiếp (direct invocation)
3. **Phí bổ sung**: Phát sinh chi phí thêm khi cold start, tùy thuộc vào kiến trúc CPU và kích thước bộ nhớ
4. **Không giới hạn số tenant**: Không giới hạn số lượng tenant và không cần định nghĩa trước
5. **context.tenantId**: Có thể lấy tenant ID từ context.tenantId trong Lambda function
6. **IAM Role chung**: IAM Role được chia sẻ giữa tất cả các tenant, không thể phân tách theo tenant
7. **Giới hạn đồng thời**: Giới hạn số lượng thực thi đồng thời được chia sẻ giữa các tenant
8. **Phân tách hoàn toàn**: Ngăn chặn truy cập chéo không mong muốn vào bộ nhớ và storage (/tmp)

## Thực hành

### Tạo function bằng Management Console

Khi tạo Lambda function, chọn "Tenant Isolation Mode" trong phần "Security and governance" từ mục "Additional configurations".

Ví dụ code function:

```javascript
export const handler = async (event, context) => {
    console.log('Tenant ID:', context.tenantId);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            tenantId: context.tenantId
        }),
    };
    return response;
};
```

Khi chỉ định tenant ID trong test event và thực thi, bạn có thể xác nhận rằng tenant ID có thể được lấy từ `context.tenantId`.

Ví dụ test event:

```json
{
  "tenantId": "tenant-001"
}
```

## Các phương pháp tạo khác

### AWS CLI

```bash
aws lambda create-function \
  --function-name my-tenant-isolated-function \
  --runtime nodejs20.x \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --tenancy-config TenantIsolationMode=PER_TENANT
```

### CloudFormation/SAM

```yaml
Resources:
  MyFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: my-tenant-isolated-function
      Runtime: nodejs20.x
      Handler: index.handler
      Role: !GetAtt LambdaRole.Arn
      Code:
        ZipFile: |
          exports.handler = async (event, context) => {
              return {
                  statusCode: 200,
                  body: JSON.stringify({ tenantId: context.tenantId })
              };
          };
      TenancyConfig:
        TenantIsolationMode: PER_TENANT
```

### CDK

```typescript
import * as lambda from 'aws-cdk-lib/aws-lambda';

const fn = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset('lambda'),
  tenancyConfig: lambda.TenancyConfig.PER_TENANT,
});
```

## Xác nhận phân tách môi trường thực thi

Để xác nhận môi trường thực thi có thực sự được phân tách hay không, chúng ta sẽ kiểm chứng bằng code sau:

```javascript
let counter = 0;

export const handler = async (event, context) => {
    counter++;
    console.log('Tenant ID:', context.tenantId);
    console.log('Counter:', counter);
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            tenantId: context.tenantId,
            counter: counter
        }),
    };
};
```

Khi thực thi nhiều lần với cùng tenant ID, counter sẽ tăng dần (môi trường thực thi được chia sẻ). Ngược lại, khi thực thi với tenant ID khác nhau, counter sẽ bắt đầu từ 1 (môi trường thực thi được phân tách).

## Tích hợp với API Gateway (REST)

Khi tích hợp API Gateway với Lambda Tenant Isolation Mode, client gửi tenant ID qua header `x-tenant-id`, và API Gateway chuyển đổi thành header `X-Amz-Tenant-Id` để truyền cho Lambda.

### Các bước cấu hình

1. Thêm cấu hình nhận header `x-tenant-id` trong **Method Request**
2. Map `x-tenant-id` thành `X-Amz-Tenant-Id` trong **Integration Request**

Ví dụ cấu hình Method Request:

```
HTTP Header: x-tenant-id
```

Header mapping trong Integration Request:

```
Tên: X-Amz-Tenant-Id
Map từ: method.request.header.x-tenant-id
```

Ví dụ request từ client:

```bash
curl -X GET https://your-api-id.execute-api.region.amazonaws.com/prod/hello \
  -H "x-tenant-id: tenant-001"
```

## Phân tích khía cạnh chức năng

Nhìn ở mức thấp, Tenant Isolation Mode có thể được hiểu là "tính năng yêu cầu một định danh tùy ý và phân tách môi trường thực thi trừ khi các định danh khớp nhau".

### Use case

1. **Bắt buộc cold start**: Sử dụng định danh ngẫu nhiên để bắt buộc cold start mỗi lần
2. **Bỏ qua khôi phục memory/file**: Giữ nguyên định danh để bỏ qua việc khôi phục trạng thái memory hoặc file system trong điều kiện cụ thể

Tuy nhiên, tài liệu chính thức nêu rõ "dự định sử dụng làm tenant ID", nên cần lưu ý khi sử dụng ngoài mục đích ban đầu.

## Tổng kết

AWS Lambda Tenant Isolation Mode là tính năng mạnh mẽ cho phép phân tách hoàn toàn môi trường thực thi cho từng tenant trong ứng dụng SaaS đa tenant với một Lambda function duy nhất.

### Ưu điểm

- Môi trường thực thi được phân tách hoàn toàn theo từng tenant
- Có thể duy trì DB connection pool riêng cho từng tenant
- Không giới hạn số lượng tenant và không cần định nghĩa trước

### Lưu ý

- IAM Role được chia sẻ giữa tất cả các tenant, nên nếu muốn phân tách IAM Role theo tenant, cần áp dụng nguyên tắc least privilege và có chiến lược lấy temporary credentials động khi cần thiết
- Chỉ hỗ trợ API Gateway (REST) và direct invocation
- Phát sinh chi phí bổ sung khi cold start

Tính năng này vừa mới ra mắt, kỳ vọng sẽ có nhiều cập nhật và mở rộng phạm vi hỗ trợ trong tương lai.

## Tài liệu tham khảo

- [AWS Lambda now supports Tenant Isolation Mode](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-lambda-tenant-isolation-mode/)
- [AWS Lambda Developer Guide - Tenant Isolation](https://docs.aws.amazon.com/lambda/latest/dg/tenant-isolation.html)

---

> **Lưu ý về hình ảnh**: Bài viết gốc trên Zenn có 5 screenshots minh họa (cấu hình console, test event, kết quả phân tách môi trường, cấu hình API Gateway). Để xem các hình ảnh chi tiết, vui lòng truy cập [bài viết gốc](https://zenn.dev/aws_japan/articles/lambda-tenant-isolation).

**Tác giả**: かとりょー (AppMod Specialist Solutions Architect tại AWS Japan)
**GitHub**: [@intercept6](https://github.com/intercept6)
**Twitter**: [@r_karotou](https://twitter.com/r_karotou)
**Dịch giả**: 日平
