---
title: "Claude Skills - Trang bị kiến thức chuyên môn cho AI để tự động hóa công việc"
date: 2025-11-13
draft: false
categories: ["Business and Technology", "AI and Machine Learning"]
tags: ["Claude", "Skills", "Tự động hóa", "Hiệu suất công việc", "AI", "Chia sẻ kiến thức"]
author: "Lee Jun Ho (李 俊浩)"
translator: "日平"
description: "Tìm hiểu về tính năng mới 'Skills' của Claude - cho phép AI học hỏi kiến thức chuyên môn và tự động hóa các tác vụ lặp đi lặp lại. Chỉ cần tạo file SKILL.md, bất kỳ ai cũng có thể mở rộng khả năng của Claude mà không cần kinh nghiệm lập trình."
---

# Claude Skills - Trang bị kiến thức chuyên môn cho AI để tự động hóa công việc

**Tác giả**: Lee Jun Ho (李 俊浩) - Phòng AI Operation  
**Ngày xuất bản**: 13/11/2025  
**Nguồn**: [Cổng thông tin AI tạo sinh - CyberAgent](https://git-generative-ai.services.isca.jp/article/business/bu034/)

## Tóm tắt 3 dòng

- **Tính năng mới "Skills" của Claude cho phép AI đọc động kiến thức và quy trình cần thiết cho từng tác vụ cụ thể**
- **Có thể "dạy" AI các quy trình công việc thường dùng và kiến thức chuyên môn, tự động hóa các công việc lặp đi lặp lại**
- **Không cần kinh nghiệm phát triển, có thể áp dụng cho cải thiện hiệu suất và chia sẻ kiến thức trong tổ chức**

## Giới thiệu

Bài viết này giới thiệu tính năng mới **"Skills"** của Claude - cho phép "dạy" AI kiến thức chuyên môn một cách động, tự động hóa các tác vụ lặp đi lặp lại và cải thiện hiệu suất công việc đáng kể.

Chỉ cần tạo một file markdown có tên **SKILL.md**, bất kỳ ai cũng có thể dễ dàng mở rộng chức năng của Claude.

Bài viết sẽ giải thích chi tiết từ cơ chế hoạt động của Skills, cách tạo, đến phương pháp ứng dụng trong thực tế, kèm theo các ví dụ code mẫu (máy tính, sắp xếp file, tạo báo cáo, v.v.).

Ngay cả những người không có kinh nghiệm phát triển cũng có thể hiểu được cách áp dụng Skills vào công việc sau khi đọc bài viết này.

## Đối tượng của bài viết

- Người muốn sử dụng Claude để tự động hóa các công việc lặp đi lặp lại
- Người muốn "dạy" AI các quy trình công việc nội bộ công ty
- Lập trình viên muốn mở rộng chức năng của Claude
- Người đang xem xét việc triển khai các công cụ AI

## 1. Skills là gì?

Skills là tính năng mới cho phép Claude thực hiện các tác vụ cụ thể một cách chính xác và hiệu quả hơn. Nó đọc các folder chứa hướng dẫn, script, tài liệu (ví dụ: SKILL.md) khi cần thiết, cho phép Claude sử dụng kiến thức và quy trình tối ưu cho tác vụ đó.

Ví dụ, nó có thể hỗ trợ các xử lý chuyên môn cao như phân tích dữ liệu Excel, tạo báo cáo, hoặc viết văn bản theo guideline nội bộ.

Nói một cách đơn giản, Skills là **"cơ chế cho phép Claude đọc kiến thức chuyên môn và quy trình công việc chỉ khi cần thiết"**. Không cần phải giải thích lại từ đầu mỗi lần, giúp tăng hiệu suất công việc lặp đi lặp lại và chia sẻ kiến thức trong tổ chức.

### ▼ So sánh quy trình hoạt động

#### Quy trình hoạt động của Claude thông thường

(Hình: Cần nhập cùng một giải thích mỗi lần)

#### Quy trình hoạt động của Claude sử dụng Skills

(Hình: Đọc động kiến thức cần thiết từ Skills)

### ▼ 4 lợi ích chính của Skills

| Lợi ích | Mô tả | Ví dụ cụ thể |
|---------|-------|--------------|
| **Tính mô-đun** | Chỉ đọc kiến thức cần thiết | Chỉ đọc calculator skill khi làm tác vụ tính toán |
| **Tính tái sử dụng** | Tạo một lần, sử dụng nhiều lần | Tái sử dụng report generation skill mỗi tuần |
| **Tính mở rộng** | Mở rộng khả năng của Claude vô hạn | Thêm workflow riêng của công ty |
| **Tính chuyên môn** | Kiến thức và công cụ đặc thù theo domain | Brand guideline, API specification, v.v. |

## 2. Các vấn đề mà Skills giải quyết

### ▼ Vấn đề 1: Sự kém hiệu quả của công việc lặp đi lặp lại

**Chi tiết vấn đề**: Phải giải thích và thực hiện cùng một tác vụ từ đầu mỗi lần

#### Không có Skills: Giải thích lại mỗi lần

(Hình: Cần nhập prompt dài mỗi lần)

#### Có Skills: Chỉ cần cài đặt một lần

(Hình: Có thể thực hiện chỉ với lệnh ngắn gọn)

### ▼ Vấn đề 2: Kiến thức bị cá nhân hóa và thất lạc

**Chi tiết vấn đề**: Kiến thức cá nhân không được chia sẻ, bị mất khi nghỉ việc

#### Không có Skills: Kiến thức domain bị thất lạc

(Hình: Kiến thức bị mất khi người phụ trách nghỉ việc)

#### Có Skills: Tài sản kiến thức domain được lưu giữ

(Hình: Được tích lũy trong tổ chức dưới dạng Skills)

### ▼ Vấn đề 3: Lãng phí context

**Chi tiết vấn đề**: Tiêu tốn context quý giá với giải thích dài mỗi lần

#### Không có Skills: Lãng phí context mỗi lần

(Hình: Giải thích dài làm đầy context window)

#### Có Skills: Giảm context với lệnh ngắn gọn

(Hình: Sử dụng hiệu quả chỉ phần cần thiết)

## 3. Cách sử dụng Skills

Skills có thể được sử dụng trên phiên bản Web, nhưng ở đây tôi sẽ giải thích cách sử dụng trên ứng dụng desktop.

※Để sử dụng Skills, cần đăng ký một trong các gói Pro, Max, Team, hoặc Enterprise.

### ▼ 1. Cài đặt ứng dụng Claude

Tải xuống từ trang chính thức: https://www.claude.com/download

(Hình: Trang tải xuống ứng dụng Claude)

### ▼ 2. Cài đặt trên ứng dụng Claude

Ở đây, tôi sẽ giải thích trên ứng dụng Claude cho Mac.

Màn hình cài đặt → Tính năng → Kích hoạt "**artifacts-builder**" từ Skills

(Hình: Màn hình cài đặt ứng dụng Claude)
(Hình: Kích hoạt Skills)

### ▼ 3. Thực thi trong chat

**Prompt**:

```
artifacts-builder skillsを使ったサイバーエージェントの簡単なレポートアプリを作成して
(Tạo một ứng dụng báo cáo đơn giản về CyberAgent sử dụng artifacts-builder skills)
```

(Hình: Màn hình nhập prompt)

### ▼ 4. Xác nhận skill đã sử dụng

**artifacts-builder là gì?**

Đây là skill cho phép phát triển ứng dụng Web dễ dàng mà không cần kiến thức chuyên môn. Nó xây dựng môi trường ứng dụng Web được cấu hình sẵn trong môi trường ảo, chạy ứng dụng trên đó và xuất kết quả.

(Hình: Giải thích về artifacts-builder)

### ▼ 5. Xác nhận kết quả

Ứng dụng báo cáo về CyberAgent đã hoàn thành. Có thể xem tổng quan công ty từ tab Tổng quan.

(Hình: Ứng dụng báo cáo hoàn thiện - Tab tổng quan)

Cũng có thể xem danh sách các công ty con chính từ tab Công ty con!

※Kết quả tạo có thể khác nhau tùy thuộc vào môi trường thực thi và thời điểm. Đây chỉ là một ví dụ tham khảo.

(Hình: Ứng dụng báo cáo hoàn thiện - Tab công ty con chính)

## Kết luận

Skills là tính năng mới cho phép Claude đọc động kiến thức và quy trình cần thiết cho các tác vụ cụ thể, giúp thực hiện công việc chính xác và hiệu quả hơn. Bằng cách tự động hóa công việc lặp đi lặp lại và chia sẻ, tái sử dụng kiến thức của team, có thể biến công việc hàng ngày trở nên hiệu quả hơn.

**Lợi ích chính**:

- **Giảm gánh nặng công việc định kỳ, sử dụng thời gian hiệu quả**
- **Con người và AI phân chia vai trò, tập trung vào công việc bản chất**
- **Tích lũy kiến thức cá nhân thành Skills, biến thành tài sản của toàn tổ chức**

Lần này chúng tôi đã giới thiệu tổng quan và cách sử dụng cơ bản của Skills. Lần tới, chúng tôi sẽ giải thích chi tiết về việc tạo Skills thực tế và cách ứng dụng vào công việc thực tế. Hãy mong chờ nhé!

## Cùng cải thiện công việc với AI Operation Room!

**Chúng tôi bắt đầu tư vấn phát triển hướng AI!**

Bạn có muốn cải thiện quy trình phát triển phần mềm theo hướng AI First không?

- Tốc độ phát triển tăng lên nhờ tự động tạo code dựa trên thiết kế và đặc tả đề xuất theo hướng AI First
- Giảm lỗi con người, nâng cao chất lượng và độ tin cậy bằng cách tự động tạo test case
- Developer giao các công việc định kỳ (tạo tài liệu, test, v.v.) cho AI, con người tập trung vào giải quyết vấn đề phức tạp và sáng tạo hơn

### Bạn có cảm thấy "phiền toái..." với những việc này trong công việc hàng ngày không?

- Tạo báo cáo hàng ngày, mất khá nhiều thời gian...
- Đã thử sử dụng Claude Code nhưng chưa tận dụng được tốt...
- Đọc nhiều kết quả khảo sát thật vất vả...

Những "phiền toái" đó có thể giải quyết được bằng sức mạnh của AI!

Bản thân tôi đã tích lũy được khá nhiều cách sử dụng và kiến thức hữu ích khi thử nghiệm tự động hóa công việc bằng AI và AI coding. Tôi muốn chia sẻ kinh nghiệm này với mọi người và cùng nhau "nhẹ nhàng" hơn.

**Ví dụ, ngay cả từ những câu chuyện như thế này cũng OK!**

- Tôi muốn tự động hóa công việc 〇〇, bạn nghĩ sao?
- Hãy dạy tôi cách sử dụng AI coding tiện lợi!
- 〇〇 AI đang được nhắc đến gần đây thực tế thế nào?

> **AI Operation Room - Lee**  
> Nếu có chút hứng thú, hãy liên hệ với tôi nhé. Trò chuyện trong bữa trưa hoặc tư vấn qua Slack đều rất hoan nghênh! Cùng nhau hack công việc bằng AI nào!

### Liên hệ

- [Liên hệ AI Operation Room](https://cyberagent.enterprise.slack.com/archives/C06A63SPUUQ/p1741159999955789)
- [Tư vấn với Next Expert](https://experts.cyberagent.dev/archives/476)

Nếu có câu hỏi về nội dung kiểm chứng hoặc muốn yêu cầu kiểm chứng nội dung nào đó, vui lòng liên hệ qua ["Yêu cầu đăng tải・Liên hệ"](https://git-generative-ai.services.isca.jp/contact). Đối với câu hỏi về dịch vụ nội bộ, vui lòng liên hệ trực tiếp với từng dịch vụ.

---

## Lưu ý quan trọng

※Trước khi sử dụng AI tạo sinh, nhất định phải tham gia ["Reskilling hiểu thấu AI tạo sinh"](https://cybar.cag.isca.jp/?p=100091) và xác nhận các [Guideline](https://git-generative-ai.services.isca.jp/guideline/)

※Việc sử dụng công cụ AI tạo sinh trong công việc được quyết định bởi từng bộ phận sau khi đánh giá rủi ro bởi phòng pháp lý・SSG. Vui lòng sử dụng sau khi nhận được sự chấp thuận của cấp trên theo [Guideline](https://git-generative-ai.services.isca.jp/guideline/). Liên hệ với phòng pháp lý・SSG qua [Security Portal](https://security-portal.ssg.isca.jp/inquiry)

※Vui lòng cẩn thận khi xử lý văn bản・hình ảnh・video được tạo

※Do nội bộ hạn chế, nghiêm cấm chuyển tải tất cả nội dung lên SNS v.v.

※Nội dung bài viết là của thời điểm đăng tải, các công cụ được đề cập được sử dụng với mục đích kiểm chứng

---

**Tags**: #Kiến thức #Hiệu suất công việc #Claude #Business #AI #Tự động hóa #Chia sẻ kiến thức
