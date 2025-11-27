---
title: "Tối ưu hóa phát triển ứng dụng multi-tenant với chế độ Tenant Isolation trong AWS Lambda"
date: 2025-11-27
draft: false
categories: ["Cloud", "AWS", "DevOps and Infrastructure"]
tags: ["AWS Lambda", "Multi-tenant", "Serverless", "SaaS", "Security"]
author: "Yuya Matsumoto"
source: "AWS Blog"
---

# Tối ưu hóa phát triển ứng dụng multi-tenant với chế độ Tenant Isolation trong AWS Lambda

**Tác giả:** Yuya Matsumoto (Dịch), Donnie Prakoso (Gốc)  
**Ngày xuất bản:** 27 tháng 11, 2025  
**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/streamlined-multi-tenant-application-development-with-tenant-isolation-mode-in-aws-lambda/)

---

## Giới thiệu

Trong các ứng dụng multi-tenant, thường cần có sự cách ly nghiêm ngặt khi xử lý code hoặc dữ liệu đặc thù cho từng tenant. Ví dụ, các nền tảng Software-as-a-Service (SaaS) cho tự động hóa workflow hoặc thực thi code cần đảm bảo môi trường thực thi được sử dụng bởi từng tenant hoặc end user riêng lẻ được cách ly hoàn toàn với nhau.

Trước đây, các developer đã giải quyết những yêu cầu này bằng cách deploy các Lambda function riêng biệt cho mỗi tenant, hoặc triển khai logic cách ly tùy chỉnh trong các function được chia sẻ, điều này làm tăng độ phức tạp về kiến trúc và vận hành.

Hôm nay, AWS Lambda đã giới thiệu chế độ tenant isolation mới, mở rộng khả năng cách ly hiện có của Lambda. Trong khi Lambda đã cung cấp sự cách ly ở cấp độ function, chế độ mới này mở rộng sự cách ly đến cấp độ từng tenant hoặc end user trong một function duy nhất.

---

## Các tính năng chính của Tenant Isolation Mode

### 1. Cách ly môi trường thực thi theo tenant

Khi sử dụng tính năng tenant isolation mới, Lambda liên kết môi trường thực thi của function với tenant identifier do khách hàng chỉ định. Điều này có nghĩa là môi trường thực thi của một tenant cụ thể sẽ không được sử dụng cho các request invoke từ tenant khác gọi cùng một Lambda function.

Vì mỗi lần invoke của từng tenant sử dụng môi trường thực thi riêng biệt, các thứ sau đây được cách ly:
- Dữ liệu đã cache
- Biến global
- File được lưu trong `/tmp`

### 2. Tính năng cách ly tích hợp sẵn

Tính năng tích hợp sẵn này cho phép xử lý invoke của mỗi tenant trong môi trường thực thi riêng biệt, do đó có thể đáp ứng các yêu cầu cách ly nghiêm ngặt mà không cần thêm công việc triển khai để quản lý tài nguyên đặc thù cho tenant trong code function.

### 3. Bảo mật và tuân thủ

Tính năng này đáp ứng các yêu cầu bảo mật nghiêm ngặt của các nhà cung cấp SaaS xử lý dữ liệu nhạy cảm hoặc thực thi code từ tenant không đáng tin cậy. Có thể thực hiện cách ly môi trường thực thi trong khi vẫn duy trì mô hình thanh toán theo mức sử dụng và đặc tính hiệu năng của AWS Lambda.

### 4. Hiệu quả vận hành

Cung cấp lợi ích bảo mật của cơ sở hạ tầng theo từng tenant mà không có overhead vận hành khi quản lý các Lambda function chuyên dụng cho từng tenant riêng lẻ. Khi khách hàng áp dụng ứng dụng, số lượng đối tượng cần quản lý có thể tăng nhanh chóng, nhưng tính năng này giúp đơn giản hóa việc quản lý.

---

## Bắt đầu sử dụng AWS Lambda Tenant Isolation

Hướng dẫn cách thiết lập và sử dụng tenant isolation cho ứng dụng multi-tenant.

### Bước 1: Tạo Lambda function

Đầu tiên, trong trang tạo function của AWS Lambda console, chọn tùy chọn **Tạo từ đầu** (Author from scratch).

### Bước 2: Kích hoạt Tenant Isolation Mode

Tiếp theo, trong **Cấu hình bổ sung** (Additional configurations), chọn **Kích hoạt** (Enable) dưới **Chế độ Tenant Isolation** (Tenant isolation mode).

**Quan trọng:** Lưu ý rằng chế độ tenant isolation chỉ có thể được thiết lập khi tạo function và không thể thay đổi cho các Lambda function hiện có.

### Bước 3: Triển khai code function

Viết code Python để minh họa tính năng này. Có thể truy cập tenant identifier thông qua object `context` trong code function.

Code Python hoàn chỉnh như sau:

```python
import json
import os
from datetime import datetime

def lambda_handler(event, context):
    tenant_id = context.tenant_id
    file_path = '/tmp/tenant_data.json'

    # Đọc dữ liệu hiện có hoặc khởi tạo
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            data = json.load(f)
    else:
        data = {
            'tenant_id': tenant_id,
            'request_count': 0,
            'first_request': datetime.utcnow().isoformat(),
            'requests': []
        }

    # Tăng counter và thêm thông tin request
    data['request_count'] += 1
    data['requests'].append({
        'request_number': data['request_count'],
        'timestamp': datetime.utcnow().isoformat()
    })

    # Ghi dữ liệu đã cập nhật vào file
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

    # Trả về nội dung file để thể hiện sự cách ly
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': f'File contents for {tenant_id} (isolated per tenant)',
            'file_data': data
        })
    }
```

### Bước 4: Test và Deploy

Sau khi hoàn thành, chọn **Deploy**. Tiếp theo, cần chọn **Test** để test tính năng này. Trong panel tạo test event mới, bạn sẽ thấy có một cấu hình mới là **Tenant ID**.

**Quan trọng:** Nếu cố gắng gọi function này mà không có Tenant ID, sẽ hiển thị lỗi "Add a valid tenant ID in your request and try again."

---

## Kết quả Demo

### Test với tenant-A

Khi test function này với tenant ID là `tenant-A`:

- **Lần gọi thứ 1:** Trả về `request_count: 1`
- **Lần gọi thứ 2:** Trả về `request_count: 2`

Các lần gọi của cùng một tenant sẽ tăng counter liên tục vì môi trường thực thi warm được tái sử dụng.

### Test với tenant-B

Tiếp theo, khi test function này với tenant ID là `tenant-B`:

- **Lần gọi thứ 1:** Trả về `request_count: 1`

Đây là do chưa từng gọi function này với `tenant-B` trước đó. Vì mỗi lần invoke của từng tenant sử dụng môi trường thực thi riêng biệt, nên dữ liệu đã cache, biến global và file được lưu trong `/tmp` đều được cách ly.

---

## Thông tin bổ sung cần biết

### Hiệu năng

Các lần invoke của cùng một tenant có thể được hưởng lợi từ việc tái sử dụng môi trường thực thi warm để có hiệu năng tối ưu.

### Chi phí

Khi Lambda tạo môi trường thực thi tenant-aware mới, sẽ tính phí và chi phí khác nhau tùy thuộc vào lượng memory được cấp cho function và kiến trúc CPU được sử dụng. Để biết chi tiết, vui lòng xem [AWS Lambda Pricing](https://aws.amazon.com/jp/lambda/pricing/).

### Các Region khả dụng

Hiện đang khả dụng trong tất cả các AWS Region thương mại ngoại trừ Asia Pacific (New Zealand), AWS GovCloud (US) và các Region Trung Quốc.

---

## Use Cases

Tính năng này thay đổi cách tiếp cận kiến trúc serverless multi-tenant. Tối ưu cho các use case sau:

1. **Nền tảng SaaS tự động hóa workflow**
   - Thực thi workflow của mỗi tenant trong môi trường cách ly hoàn toàn
   - Loại bỏ rủi ro rò rỉ dữ liệu

2. **Nền tảng SaaS thực thi code**
   - Thực thi an toàn code từ tenant không đáng tin cậy
   - Thực hiện sự cách ly nghiêm ngặt

3. **API backend multi-tenant**
   - Không có overhead vận hành khi quản lý function riêng biệt cho từng tenant
   - Cung cấp lợi ích bảo mật của cơ sở hạ tầng theo từng tenant

---

## Tổng kết lợi ích

Thay vì phải vật lộn với các mẫu cách ly phức tạp hoặc quản lý hàng trăm Lambda function đặc thù cho từng tenant, bạn có thể để AWS Lambda tự động xử lý việc cách ly. Điều này đảm bảo dữ liệu của tenant được cách ly giữa các tenant, giúp bạn tự tin về bảo mật và sự cách ly của ứng dụng multi-tenant.

Tính năng này đơn giản hóa việc xây dựng ứng dụng multi-tenant trên AWS Lambda, chẳng hạn như nền tảng SaaS cho tự động hóa workflow hoặc thực thi code.

Để biết chi tiết về cách thiết lập tenant isolation cho multi-tenant Lambda function, vui lòng xem [AWS Lambda Developer Guide](https://docs.aws.amazon.com/ja_jp/lambda/).

Happy building!

---

**Về tác giả**

Donnie Prakoso là software engineer, barista tự xưng và Principal Developer Advocate tại AWS. Với hơn 17 năm kinh nghiệm trong ngành công nghệ bao gồm viễn thông, ngân hàng và startup, hiện ông đang tập trung vào việc hỗ trợ các developer hiểu các công nghệ khác nhau và biến ý tưởng thành hiện thực. Ông rất yêu thích cà phê và thích thảo luận về mọi chủ đề từ microservices đến AI/ML.
