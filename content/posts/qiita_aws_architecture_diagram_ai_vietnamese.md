---
title: "【AWS】Muốn Vẽ Sơ Đồ Kiến Trúc Một Cách Dễ Dàng!"
date: 2025-10-03T08:00:00+07:00
categories: ["AWS", "AI & Machine Learning", "Business & Technology"]
tags: ["AWS", "Architecture Diagram", "AI Tools", "Draw.io", "MCP", "Cloud Architecture"]
description: "Hướng dẫn sử dụng AI để tạo sơ đồ kiến trúc AWS một cách dễ dàng, giúp hiểu rõ cách kết nối các dịch vụ AWS"
---

# 【AWS】Muốn Vẽ Sơ Đồ Kiến Trúc Một Cách Dễ Dàng!

**Tác giả:** @im_yoneda (米田)  
**Ngày:** 2025-09-17  
**Lượt thích:** 72  
**Lượt lưu:** 78  
**URL:** https://qiita.com/im_yoneda/items/f7624a0a25885f68616f

---

## Mục tiêu

Tôi chỉ hiểu được tên các dịch vụ AWS và biết chúng có thể làm gì ở mức độ cơ bản. Tuy nhiên, tôi không hiểu được dịch vụ nào kết nối với dịch vụ nào, và cách kết nối nào là best practice. Mọi thứ đang rất lộn xộn.

Tôi muốn kết nối các dịch vụ trong đầu mình, vì vậy tôi đã nghĩ ra ý tưởng nhờ AI tạo sơ đồ kiến trúc để học một cách dễ dàng!

## Kết luận đơn giản

Tốt cho việc hình dung những gì đang tưởng tượng trong đầu, nhưng có thể khó khăn cho người mới bắt đầu muốn vẽ từ đầu để học tập.

## Chiến lược

- Triển khai MCP của AWS
- Sử dụng MCP để tổng hợp kết nối giữa các dịch vụ
- Dựa trên output của MCP, nhờ copilot tạo sơ đồ kiến trúc

## Thử nghiệm

### 1. Triển khai MCP

Triển khai AWS Knowledge MCP Server vào VSCode.

**Lợi ích:**
- Github Copilot sẽ dạy về các dịch vụ AWS
- Ít hallucination vì tham khảo tài liệu chính thức
- Kết hợp với Agent có thể tổng hợp thành file md

### 2. Sử dụng MCP để tổng hợp kết nối giữa các dịch vụ

Khởi động MCP và đưa prompt sau cho Github Copilot:

- Chế độ Agent
- Model: Claude Sonnet 4

```
#aws___read_documentation tổng hợp về kết nối giữa các dịch vụ aws
```

`#aws___read_documentation` là lệnh MCP, tham khảo tài liệu AWS và tổng hợp thành file md.

### 3. Nhờ copilot tạo sơ đồ kiến trúc

Thêm extension sau vào VSCode để có thể sử dụng draw.io trên editor.

Đưa prompt sau cho Github Copilot:

```
Hãy minh họa kết nối giữa các dịch vụ aws được ghi trong {file md đã tạo} bằng #sample.dio
```

Cuối cùng đã tạo được sơ đồ như này.

Có thể hiểu được kết nối giữa các dịch vụ, nhưng có thể làm tốt hơn nữa.

## Cải thiện hơn một chút

Lần này sẽ thu hẹp pattern thiết kế, tập trung vào trường hợp muốn phát trực tiếp video real-time.

**Prompt:**

```
#aws___read_documentation trong trường hợp muốn phát trực tiếp video real-time, nên xây dựng như thế nào?
```

```
Tham khảo {file md đã tạo}, hãy tạo sơ đồ kiến trúc bằng #sample.dio
```

**Sơ đồ kiến trúc được tạo ra**

...Cảm giác hơi kỳ kỳ

## Kết luận

- Đã có thể tạo được sơ đồ kiến trúc
- Có thể hơi khó nhìn đối với người mới bắt đầu muốn học
- Dễ sử dụng khi muốn xác nhận xem nội dung đang tưởng tượng trong đầu có đúng không
- Có vẻ tốt khi chuyên gia muốn tóm tắt nhanh để giải thích cho người khác
- Tương lai sáng sủa nếu prompt chính xác hơn

---

*Bài viết này được crawl từ [bài viết gốc](https://qiita.com/im_yoneda/items/f7624a0a25885f68616f).*