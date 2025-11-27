---
title: "Các tính năng business metadata mới trong Amazon SageMaker Catalog cải thiện khả năng phát hiện trong toàn tổ chức"
date: 2025-11-27
draft: false
categories: ["Cloud", "AWS", "Data and Analytics"]
tags: ["Amazon SageMaker", "Data Catalog", "Business Metadata", "Data Governance", "Data Discovery"]
author: "Channy Yun"
source: "AWS Blog"
---

# Các tính năng business metadata mới trong Amazon SageMaker Catalog cải thiện khả năng phát hiện trong toàn tổ chức

**Tác giả:** Channy Yun (윤석찬)  
**Ngày xuất bản:** 27 tháng 11, 2025  
**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/new-business-metadata-features-in-amazon-sagemaker-catalog-to-improve-discoverability-across-organizations/)

---

## Giới thiệu

Amazon SageMaker Catalog đã được tích hợp vào Amazon SageMaker. Điều này giúp dễ dàng thu thập và tổ chức dữ liệu, đồng thời nắm bắt business context mà người dùng cần hiểu.

Chỉ với vài cú nhấp chuột, bạn có thể curate các data inventory asset bao gồm business metadata cần thiết bằng cách thêm hoặc cập nhật business name (asset và schema), description (asset và schema), Read me, glossary (asset và schema), và metadata form. Ngoài ra, bạn cũng có thể tạo các đề xuất do AI tạo ra hoặc xem xét và cải thiện description.

Từ ngày 19 tháng 11 năm 2025, bạn có thể sử dụng các tính năng mới của Amazon SageMaker Catalog metadata để cải thiện business metadata và tìm kiếm.

---

## Tổng quan về các tính năng mới

### 1. Metadata form và description phong phú ở cấp độ cột

Có thể tạo custom metadata form để capture thông tin đặc thù cho business trực tiếp vào từng cột riêng lẻ. Các cột cũng hỗ trợ rich text description tương thích Markdown, cho phép tạo documentation dữ liệu toàn diện và business context.

### 2. Áp dụng metadata rule của glossary khi publish asset

Có thể sử dụng metadata enforcement rule cho các glossary term. Điều này có nghĩa là data creator phải sử dụng business vocabulary đã được phê duyệt khi publish asset.

Bằng cách tiêu chuẩn hóa metadata practice, tổ chức có thể đạt được:
- Tăng cường compliance
- Tăng cường chuẩn bị audit
- Hợp lý hóa access workflow để tăng cường hiệu quả và quản lý

Các tính năng metadata mới của SageMaker Catalog này cho phép phân loại dữ liệu nhất quán và dễ tìm thấy hơn trong toàn bộ organization catalog.

---

## Metadata form và description phong phú ở cấp độ cột

Giờ đây có thể sử dụng custom metadata form và rich text description ở cấp độ cột, mở rộng khả năng curation hiện có để tinh chỉnh business name, description và phân loại glossary term.

Custom metadata form field value và rich text content có thể tìm kiếm được, giúp tất cả các team member dễ dàng tìm thấy data asset đúng với thông tin chính xác.

### Cách sử dụng

Để chỉnh sửa metadata ở cấp độ cột:

1. Chọn schema của catalog asset đang được sử dụng trong project
2. Chọn action **[View/Edit]** (Xem/Chỉnh sửa) cho mỗi cột
3. Chọn bất kỳ cột nào với vai trò asset owner
4. Định nghĩa custom key-value metadata form và Markdown description để cung cấp column documentation chi tiết

### Cải thiện tìm kiếm

Data analyst của tổ chức giờ đây có thể tìm kiếm bằng custom form field value và rich text content, ngoài column name, description và glossary hiện có.

---

## Áp dụng metadata rule của glossary khi publish asset

Trong publish workflow, bạn có thể định nghĩa required glossary term requirement cho data asset. Data creator phải phân loại asset bằng business term đã được phê duyệt trong glossary của tổ chức trước khi publish.

Điều này thúc đẩy metadata standard nhất quán và giúp dữ liệu dễ tìm thấy hơn. Enforcement rule thúc đẩy sự hiểu biết chung về asset trên các business và technology stakeholder.

### Cách thiết lập

Để kích hoạt metadata rule mới của glossary:

1. Mở section **[Domain Management]** (Quản lý Domain) trong menu **[Govern]** (Quản trị)
2. Chọn **[Add]** (Thêm) ở cấp độ domain
3. Chọn **metadata form** hoặc **glossary association** làm loại requirement của rule
4. Khi chọn glossary association, có thể chọn tối đa 5 glossary term cần thiết cho mỗi rule

### Áp dụng Rule

Khi cố gắng publish asset mà không thêm glossary cần thiết, sẽ hiển thị error message yêu cầu áp dụng glossary rule.

---

## Lợi ích và Ưu điểm

Bằng cách tiêu chuẩn hóa metadata và căn chỉnh data schema với business language, có thể đạt được những điều sau:

- **Tăng cường data governance**: Metadata practice nhất quán cải thiện compliance và chuẩn bị audit
- **Cải thiện độ liên quan của tìm kiếm**: Metadata phong phú giúp data analyst phát hiện data asset phù hợp nhanh hơn
- **Cải thiện sự hiểu biết của tổ chức**: Tiêu chuẩn hóa với business term thúc đẩy sự hiểu biết chung về published data
- **Tăng độ tin cậy**: Documentation toàn diện tăng sự tin tưởng vào chất lượng và mục đích của data asset

---

## Cách sử dụng

Có thể sử dụng các tính năng này với AWS Command Line Interface (AWS CLI) và AWS SDK.

Để biết chi tiết, vui lòng xem "Amazon SageMaker Unified Studio Data Catalog" trong Amazon SageMaker Unified Studio User Guide.

---

## Có sẵn ngay bây giờ

Các tính năng metadata mới đã có sẵn trong các AWS Region nơi Amazon SageMaker Catalog có sẵn.

Hãy dùng thử và gửi feedback của bạn qua các phương thức sau:
- AWS re:Post for Amazon SageMaker Catalog
- Liên hệ AWS support thông thường

---

– Channy
