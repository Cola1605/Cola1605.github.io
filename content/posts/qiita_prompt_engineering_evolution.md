---
title: "Prompt Engineering Vẫn Chưa Thực Sự Bắt Đầu"
date: 2025-11-16
draft: false
categories: ["AI", "LLM", "Prompt Engineering"]
tags: ["ChatGPT", "プロンプト", "Context Engineering", "Cognitive Prompting"]
author: "佐伯 真人 (Makoto Saeki)"
translator: "日平"
description: "Khám phá sự tiến hóa của Prompt Engineering qua 4 giai đoạn từ thời đại magic words đến Context Engineering và Cognitive Prompting"
---

# Prompt Engineering Vẫn Chưa Thực Sự Bắt Đầu

**Tác giả**: 佐伯 真人 (@makotosaekit)  
**Ngày xuất bản**: 16 tháng 11, 2025  
**URL gốc**: https://qiita.com/makotosaekit/items/21990e3703ac721a04d0

## Giới thiệu

Prompt Engineering đã chết? Không, thực tế là Prompt Engineering vẫn chưa thực sự bắt đầu. Bài viết này giải thích sự tiến hóa của Prompt Engineering qua 4 giai đoạn và xem xét vị trí hiện tại cũng như tương lai.

## Chương 1: Cái Chết của Magic Words và Bình Minh của Xác Minh Khoa Học

### Tài liệu chính thức của Google thông báo "Kết thúc Thời đại"

Tài liệu kỹ thuật "Prompt Engineering Whitepaper" được Google công bố vào tháng 1 năm 2025 đã tổng hợp các kỹ thuật như "cài đặt persona" và "tư duy từng bước". Đây là tuyên bố chính thức rằng những kỹ thuật này đã trở thành kiến thức phổ thông.

### Bản chất của ReAct Framework

Bản chất của phương pháp ReAct (Reason + Act) không phải là "hành động mù quáng trong khi suy nghĩ", mà là xoay vòng chu trình rõ ràng giữa tư duy và hành động:

1. Đầu tiên sắp xếp tư duy (Reasoning)
2. Thực hiện theo kế hoạch đó (Acting)
3. Quan sát kết quả thu được và sử dụng làm tài liệu cho tư duy tiếp theo (Observation)

### Phân Tích Khoa Học về Cài Đặt Vai Trò (Role-playing)

#### 【Lưỡi Dao Có Ích】: Vai trò Khởi động Động cơ Tư duy

- **Vai trò nào?** Các nghề chuyên môn có quy trình tư duy được định nghĩa khách quan như "thẩm phán", "lập trình viên"
- **Tại sao hiệu quả?** Khi chỉ thị AI hành động như "chuyên gia", nó tự động suy nghĩ có trật tự (chuỗi tư duy) và tỷ lệ trả lời đúng các vấn đề phức tạp tăng mạnh (arXiv:2308.07702)

#### 【Lưỡi Dao Vô Ích】: Vai trò chỉ Thay đổi Giọng điệu

- **Vai trò nào?** Vai trò thể hiện nhân cách hoặc thái độ chung hơn là chuyên môn như "giáo viên", "mẹ"
- **Tại sao không hiệu quả?** Hầu như không đóng góp vào việc cải thiện hiệu suất của các nhiệm vụ khách quan (arXiv:2311.10054)

#### 【Lưỡi Dao Có Hại】: Vai trò Phá hủy Tư duy

- **Vai trò nào?** Vai trò liên quan đến danh tính cá nhân như chủng tộc, giới tính, tôn giáo
- **Tại sao nguy hiểm?** Khuếch đại định kiến sai lệch trên internet cho AI và giảm hiệu suất suy luận hơn 70% (arXiv:2311.04892)

## Chương 2: Hướng tới Thời đại Context Engineering

### Chuyển hóa Kiến thức Ngầm thành Kiến thức Hiển

Trong đối thoại với AI, phía con người luôn cần chủ động "hiểu" và ngôn ngữ hóa tất cả thông tin cần thiết. Đây là cốt lõi của "Context Engineering".

### 7 Thành phần Cấu thành của Context

1. **Tiền đề (Premise)**: Chính sách cơ bản hoặc nhận thức chung làm nền tảng tư duy
2. **Tình huống (Situation)**: Bối cảnh trực tiếp dẫn đến nhiệm vụ
3. **Mục đích (Purpose)**: Mục tiêu cuối cùng muốn đạt được
4. **Động cơ (Motive)**: Lý do căn bản muốn đạt mục đích
5. **Ràng buộc (Constraint)**: Quy tắc, điều kiện, giới hạn cần tuân thủ
6. **Định dạng (Format)**: Cấu trúc đầu ra mong đợi
7. **Tham chiếu (Reference)**: Nguồn thông tin cần sử dụng làm cơ sở tư duy

### RAG (Thông tin) vs Prompt (Hệ thống Kiến thức)

- **RAG**: Cung cấp "thông tin" (tài liệu này viết như vậy)
- **Prompt**: Cung cấp "hệ thống cách nhìn" (hãy suy nghĩ từ góc nhìn này)

## Chương 3: Cognitive Prompting - Thiết kế Quy trình Tư duy của AI

### 1. Cognitive Prompting (Prompting Nhận thức)

Phương pháp biến quy trình tư duy của con người (thiết lập mục tiêu, phân tách vấn đề, lọc thông tin, v.v.) thành chỉ thị trực tiếp cho AI.

### 2. Metacognitive Prompting (Prompting Siêu nhận thức)

Phương pháp tiếp cận cho phép AI tự đánh giá "quy trình tư duy của mình có phù hợp không?" và tạo cơ hội tự điều chỉnh.

### 3. Systematic Frameworks (Khung hệ thống)

Thiết kế prompt một cách hệ thống theo các thành phần như "vai trò", "mục đích", "ràng buộc", "xử lý ngoại lệ" (5C Framework - arXiv:2507.07045).

### Nguy hiểm của Định kiến Nhận thức

Nghiên cứu (arXiv:2506.12338) chỉ ra rằng khi đưa định kiến nhận thức của con người vào prompt, hiệu suất của AI giảm đáng kể.

## Chương 4: Nguyên tắc Cơ bản để trở thành "Nhà thiết kế Đối thoại"

### Nguyên tắc 1: Trách nhiệm cuối cùng luôn thuộc về con người

AI không thể trở thành chủ thể trách nhiệm. Bất kỳ kết quả nào phát sinh từ đầu ra của AI đều là trách nhiệm của con người sử dụng nó.

### Nguyên tắc 2: Giả định Hallucination và chỉ xử lý sự thật có thể xác minh

Hallucination là "đặc tính" của AI. Bản chất của việc sử dụng AI chính là quá trình con người xây dựng chính xác "tiêu chuẩn xác minh" khách quan.

### Nguyên tắc 3: Theo đuổi nguyên lý (Why) và tính nhất quán của ngữ cảnh, không phải phương pháp (How)

Để không bị cuốn theo thay đổi, điều quan trọng là hiểu nguyên lý (Why) và có "chỉ dẫn riêng" không lay chuyển.

## Tổng kết

Prompt Engineering đã kết thúc thời đại "kỹ thuật viết văn" dựa vào cảm giác cá nhân, đang tiến hóa sang thời đại kỹ thuật đúng nghĩa với "Context Engineering" có tính hệ thống và tái hiện cao hơn, và hơn nữa là "Cognitive Prompting" thiết kế chính quy trình tư duy của AI.

## Tài liệu tham khảo

- Google Prompt Engineering Whitepaper (Tháng 1, 2025)
- arXiv:2308.07702 - Hiệu ứng chuỗi tư duy bởi role-play chuyên gia
- arXiv:2311.10054 - Đo lường hiệu quả của vai trò chỉ thay đổi giọng điệu
- arXiv:2311.04892 - Suy giảm hiệu suất suy luận do vai trò liên quan đến danh tính
- arXiv:2507.07045 - Thiết kế prompt hệ thống bằng 5C Framework
- arXiv:2506.12338 - Ảnh hưởng của định kiến nhận thức lên hiệu suất AI

**Số lượt thích**: 29  
**Cập nhật cuối**: 16 tháng 11, 2025
