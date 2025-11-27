---
title: "Tăng tốc phát triển workflow với tính năng test local được cải tiến trong AWS Step Functions"
date: 2025-11-27
draft: false
categories: ["Cloud", "AWS", "DevOps and Infrastructure"]
tags: ["AWS Step Functions", "Local Testing", "TestState API", "Workflow Development", "Serverless"]
author: "Donnie Prakoso"
source: "AWS Blog"
---

# Tăng tốc phát triển workflow với tính năng test local được cải tiến trong AWS Step Functions

**Tác giả:** Donnie Prakoso  
**Ngày xuất bản:** 27 tháng 11, 2025  
**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/accelerate-workflow-development-with-enhanced-local-testing-in-aws-step-functions/)

---

## Giới thiệu

Ngày 19 tháng 11 năm 2025, chúng tôi xin thông báo về các cải tiến tính năng test local của AWS Step Functions. Các cải tiến này có sẵn thông qua TestState API, cho phép bạn xác thực định nghĩa workflow locally trên máy phát triển của mình bằng bất kỳ test framework nào, và xây dựng test suite tự động để test các pattern xử lý lỗi, chuyển đổi dữ liệu và mock integration của service.

Với bản phát hành này giới thiệu phương pháp dựa trên API cho unit testing local, bạn có thể truy cập tính năng test toàn diện theo chương trình mà không cần deploy lên Amazon Web Services (AWS).

---

## Các tính năng chính của TestState API được cải tiến

TestState API được cải tiến giới thiệu 3 tính năng chính sau:

### 1. Hỗ trợ Mock

Có thể mock output và error của state mà không cần gọi các service downstream, cho phép unit testing thực sự logic của state machine.

**Các chế độ validation:**
- **STRICT (mặc định)**: Xác thực tất cả các trường bắt buộc
- **PRESENT**: Xác thực kiểu và tên của trường
- **NONE**: Không xác thực

TestState thực hiện testing với độ trung thực cao bằng cách xác thực mock response đối chiếu với AWS API model bằng các chế độ validation này.

### 2. Hỗ trợ tất cả các loại State

Giờ đây có thể test tất cả các loại state bao gồm:
- Map state (inline và distributed)
- Parallel state
- Task state dựa trên Activity
- Pattern tích hợp service `.sync`
- Pattern tích hợp service `.waitForTaskToken`

Điều này có nghĩa là bạn có thể sử dụng TestState API trong toàn bộ định nghĩa workflow và tạo unit test để xác thực logic control flow như chuyển đổi state, xử lý lỗi, chuyển đổi dữ liệu.

### 3. Test các State riêng lẻ

Test các state cụ thể trong định nghĩa state machine hoàn chỉnh bằng cách sử dụng tham số `StateName` mới. Chỉ cần cung cấp định nghĩa state machine hoàn chỉnh một lần, bạn có thể test từng state riêng lẻ theo tên. Có thể kiểm soát execution context để test các lần retry cụ thể, thứ tự iteration của Map, và các scenario lỗi.

---

## Bắt đầu sử dụng TestState được cải tiến

Hãy cùng xem qua các tính năng mới của TestState được cải tiến theo từng bước.

### Scenario 1: Mock kết quả thành công

Tính năng đầu tiên là hỗ trợ mock. Sử dụng tính năng này, bạn có thể test logic workflow mà không cần gọi các AWS service thực tế hoặc thậm chí các HTTP request bên ngoài. Có thể mock service response để thực hiện unit testing nhanh chóng, hoặc test với AWS service thực tế cho integration testing. Không cần quyền AWS Identity and Access Management (IAM) khi sử dụng mock response.

Dưới đây là cách mock response thành công của AWS Lambda function:

```bash
aws stepfunctions test-state --region us-east-1 \
--definition '{
  "Type": "Task",
  "Resource": "arn:aws:states:::lambda:invoke",
  "Parameters": {"FunctionName": "process-order"},
  "End": true
}' \
--mock '{"result":"{\"orderId\":\"12345\",\"status\":\"processed\"}"}' \
--inspection-level DEBUG
```

Lệnh này test Lambda invoke state mà không thực sự gọi function. TestState xác thực mock response đối chiếu với Lambda service API model để đảm bảo test data khớp với những gì service thực sự trả về.

**Ví dụ Response:**

```json
{
    "output": "{\"orderId\":\"12345\",\"status\":\"processed\"}",
    "inspectionData": {
        "input": "{}",
        "afterInputPath": "{}",
        "afterParameters": "{\"FunctionName\":\"process-order\"}",
        "result": "{\"orderId\":\"12345\",\"status\":\"processed\"}",
        "afterResultSelector": "{\"orderId\":\"12345\",\"status\":\"processed\"}",
        "afterResultPath": "{\"orderId\":\"12345\",\"status\":\"processed\"}"
    },
    "status": "SUCCEEDED"
}
```

Khi chỉ định mock response, TestState xác thực response đó đối chiếu với API model của AWS service và đảm bảo dữ liệu mock tuân theo schema mong đợi, do đó có thể duy trì testing với độ trung thực cao mà không cần AWS service call thực tế.

### Scenario 2: Mock trạng thái lỗi

Cũng có thể mock trạng thái lỗi để test logic xử lý lỗi:

```bash
aws stepfunctions test-state --region us-east-1 \
--definition '{
  "Type": "Task",
  "Resource": "arn:aws:states:::lambda:invoke",
  "Parameters": {"FunctionName": "process-order"},
  "End": true
}' \
--mock '{"errorOutput":{"error":"Lambda.ServiceException","cause":"Function failed"}}' \
--inspection-level DEBUG
```

Lệnh này mô phỏng Lambda service exception, do đó có thể xác thực cách state machine xử lý failure mà không cần thực sự tạo ra lỗi trong môi trường AWS.

**Ví dụ Error Response:**

```json
{
    "error": "Lambda.ServiceException",
    "cause": "Function failed",
    "inspectionData": {
        "input": "{}",
        "afterInputPath": "{}",
        "afterParameters": "{\"FunctionName\":\"process-order\"}"
    },
    "status": "FAILED"
}
```

### Scenario 3: Test Map State

Tính năng thứ hai bổ sung hỗ trợ cho các loại state chưa được hỗ trợ trước đây. Dưới đây là cách test Distributed Map state:

```bash
aws stepfunctions test-state --region us-east-1 \
--definition '{
  "Type": "Map",
  "ItemProcessor": {
    "ProcessorConfig": {"Mode": "DISTRIBUTED", "ExecutionType": "STANDARD"},
    "StartAt": "ProcessItem",
    "States": {
      "ProcessItem": {
        "Type": "Task",
        "Resource": "arn:aws:states:::lambda:invoke",
        "Parameters": {"FunctionName": "process-item"},
        "End": true
      }
    }
  },
  "End": true
}' \
--input '[{"itemId":1},{"itemId":2}]' \
--mock '{"result":"[{\"itemId\":1,\"status\":\"processed\"},{\"itemId\":2,\"status\":\"processed\"}]"}' \
--inspection-level DEBUG
```

Mock result thể hiện output hoàn chỉnh từ việc xử lý nhiều item. Trong trường hợp này, mock array cần khớp với format output mong đợi của Map state.

### Scenario 4: Test Parallel State

Cũng có thể test Parallel state thực thi nhiều branch đồng thời tương tự:

```bash
aws stepfunctions test-state --region us-east-1 \
--definition '{
  "Type": "Parallel",
  "Branches": [
    {"StartAt": "Branch1", "States": {"Branch1": {"Type": "Pass", "End": true}}},
    {"StartAt": "Branch2", "States": {"Branch2": {"Type": "Pass", "End": true}}}
  ],
  "End": true
}' \
--mock '{"result":"[{\"branch1\":\"data1\"},{\"branch2\":\"data2\"}]"}' \
--inspection-level DEBUG
```

Mock result phải là một array với một phần tử cho mỗi branch. Bằng cách sử dụng TestState, bạn có thể biết rằng cấu trúc mock data khớp với những gì được tạo ra trong Parallel state execution thực tế.

### Scenario 5: Test các State riêng lẻ trong Workflow hoàn chỉnh

Có thể test các state cụ thể trong định nghĩa state machine hoàn chỉnh bằng tham số `StateName`:

```bash
aws stepfunctions test-state --region us-east-1 \
--definition '{
  "Type": "Task",
  "Resource": "arn:aws:states:::lambda:invoke",
  "Parameters": {"FunctionName": "validate-order"},
  "End": true
}' \
--input '{"orderId":"12345","amount":99.99}' \
--mock '{"result":"{\"orderId\":\"12345\",\"validated\":true}"}' \
--inspection-level DEBUG
```

Lệnh này test Lambda invoke state với input data cụ thể, cho thấy TestState xử lý input đó như thế nào và chuyển đổi nó thông qua state execution.

---

## Lợi ích và Ưu điểm

Các cải tiến này mang trải nghiệm phát triển local quen thuộc vào Step Functions workflow, do đó có thể nhận được feedback ngay lập tức về các thay đổi trước khi deploy chúng lên AWS account.

Có thể tạo test suite tự động và xác thực tất cả các tính năng Step Functions với cùng mức độ tin cậy như cloud execution, mang lại sự tự tin rằng workflow sẽ hoạt động như mong đợi khi deploy.

---

## Những điều cần biết

Các lưu ý như sau:

- **Tính khả dụng**: Tính năng TestState được cải tiến có sẵn trong tất cả các AWS Region mà Step Functions hỗ trợ
- **Chi phí**: TestState API call được bao gồm trong AWS Step Functions và không có chi phí bổ sung
- **Tương thích Framework**: TestState hoạt động với tất cả các test framework có thể thực hiện HTTP request (Jest, pytest, JUnit, v.v.). Có thể tạo test suite tự động xác thực workflow trong continuous integration và continuous delivery (CI/CD) pipeline trước khi deploy
- **Hỗ trợ tính năng**: TestState được cải tiến hỗ trợ tất cả các tính năng Step Functions bao gồm Distributed Map state, Parallel state, xử lý lỗi, biểu thức JSONATA
- **Tài liệu**: Xem tài liệu TestState để biết chi tiết về các tùy chọn cho các cấu hình khác nhau, và API reference để biết request và response model đã được cập nhật

---

Hãy tích hợp TestState vào development workflow của bạn và bắt đầu local testing được cải tiến ngay hôm nay.

Happy building! – Donnie
