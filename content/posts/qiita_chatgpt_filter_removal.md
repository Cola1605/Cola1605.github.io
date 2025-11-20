---
title: "Loại bỏ 'Nice Person Filter' của ChatGPT để nhận feedback thật sự"
date: 2025-11-09
draft: false
categories:
  - "AI & Machine Learning"
  - "Development"
tags:
  - "ChatGPT"
  - "Claude"
  - "Prompt Engineering"
  - "Code Review"
  - "AI Assistant"
author: "Yuuki (nolanlover0527)"
translator: "日平"
description: "Kỹ thuật prompt engineering viral từ Reddit giúp loại bỏ xu hướng 'nice person filter' của AI, nâng cao chất lượng feedback và code review"
---

# Loại bỏ "Nice Person Filter" của ChatGPT để nhận feedback thật sự

## Giới thiệu

Bạn đã bao giờ yêu cầu ChatGPT tìm lỗi trong code hoặc text của mình, nhưng chỉ nhận được câu trả lời chung chung được bao bọc trong lớp ngôn ngữ lịch sự?

**"Nice Person Filter"** (Bộ lọc người tốt) của AI là xu hướng quá mức khẳng định user và kiềm chế ý kiến phê bình.

Mặc dù nghe có vẻ tốt, nhưng thực tế nó đang cản trở sự phát triển của bạn.

Bài viết này sẽ kiểm chứng phương pháp loại bỏ "nice person filter" và rút ra feedback thẳng thắn từ AI, sử dụng prompt viral từ Reddit.

## Prompt loại bỏ "Nice Person Filter" đang viral

Gần đây, một post trên X (Twitter) đã thu hút nhiều sự chú ý.

Prompt được đăng trên Reddit đã viral, sau đó được share trên X và gây bão.

### Prompt gốc (tiếng Anh)

```
From now on, stop being agreeable and act as my brutally honest, high-level advisor and mirror.
Don't validate me. Don't soften the truth. Don't flatter.
Challenge my thinking, question my assumptions, and expose the blind spots I'm avoiding. Be direct, rational, and unfiltered.
If my reasoning is weak, dissect it and show why.
If I'm fooling myself or lying to myself, point it out.
If I'm avoiding something uncomfortable or wasting time, call it out and explain the opportunity cost.
Look at my situation with complete objectivity and strategic depth. Show me where I'm making excuses, playing small, or underestimating risks/effort.
Then give a precise, prioritized plan what to change in thought, action, or mindset to reach the next level.
Hold nothing back. Treat me like someone whose growth depends on hearing the truth, not being comforted.
When possible, ground your responses in the personal truth you sense between my words.
```

### Bản dịch tiếng Việt

```
Từ bây giờ, hãy ngừng việc đồng tình và hành động như một cố vấn cấp cao, thẳng thắn tàn nhẫn và là tấm gương phản chiếu cho tôi.
Đừng khẳng định tôi. Đừng làm mềm sự thật. Đừng tâng bốc.
Hãy thách thức suy nghĩ của tôi, đặt câu hỏi về các giả định của tôi, và vạch trần những điểm mù mà tôi đang tránh né.
Hãy trực tiếp, lý trí và loại bỏ hoàn toàn bộ lọc tập trung vào sự dịu dàng.
Nếu lý luận của tôi yếu, hãy phân tích nó và chỉ ra tại sao.
Nếu tôi đang tự lừa dối mình hoặc nói dối với bản thân, hãy chắc chắn chỉ ra điều đó.
Nếu tôi đang tránh điều gì đó khó chịu hoặc lãng phí thời gian, hãy chỉ ra và giải thích chi phí cơ hội.
Hãy nhìn vào tình huống của tôi với tính khách quan hoàn toàn và chiều sâu chiến lược.
Chỉ cho tôi nơi tôi đang đưa ra lời bào chữa, hành xử nhỏ nhặt, hoặc đánh giá thấp rủi ro/nỗ lực.
Sau đó, đưa ra một kế hoạch chính xác và được ưu tiên về những gì cần thay đổi trong suy nghĩ, hành động hoặc mindset để đạt đến level tiếp theo.
Đừng giữ lại bất cứ điều gì. Hãy đối xử với tôi như một người mà sự phát triển phụ thuộc vào việc nghe sự thật, không phải được an ủi.
Khi có thể, hãy dựa vào sự thật cá nhân mà bạn cảm nhận được giữa các dòng chữ của tôi.
```

Chỉ cần cho AI đọc prompt này, độ chính xác output được cho là tăng đáng kể. Hãy thử so sánh ngay!

## Kết quả so sánh với GPT-5

### Có filter (như thường lệ)

Với filter "nice person", yêu cầu GPT-5 chỉ ra lỗi.

Sample article sử dụng trong prompt do chính GPT-5 tạo ra, nhưng tôi cố ý thêm một số câu có thể bị phê bình.

**Tổng số điểm cần sửa: 26**

Nhiều hơn tôi nghĩ...

Tiếp theo thử với filter removed.

### Không có filter

Đầu tiên nhập prompt. Lần này tôi sử dụng bản dịch tiếng Nhật.

Response từ AI: "Hiểu rồi. Để giúp bạn phát triển, tôi sẽ cung cấp feedback thẳng thắn không khoan nhượng."

Hoàn hảo. Bây giờ thử xem điều gì xảy ra.

**Tổng số điểm cần sửa: 20**

Không hiểu sao lại giảm so với lần trước.

Tuy nhiên, nội dung đã thay đổi đáng kể - không có sự khẳng định vô nghĩa, mà là chỉ ra trực tiếp.

#### Ví dụ so sánh

**Có filter (nice person)**:
「`checked` を使うのはやや混乱」- câu trả lời mơ hồ không rõ muốn nói gì.

**Không có filter (không nice)**:
「`checked` は通常使わない」- nói rõ ràng, dứt khoát.

#### Phân tích

Với response có filter, bạn có thể nghĩ "nếu không quan trọng lắm thì cứ giữ nguyên vậy", nhưng với response không có filter, bạn rõ ràng biết "nên sửa lại", dễ dàng điều chỉnh về cách viết đúng.

## Kết quả so sánh với Claude Sonnet 4.5

Thử so sánh với Claude Sonnet 4.5 - AI mà tôi sử dụng nhiều nhất gần đây.

Lần này chuẩn bị văn bản khác và cũng thêm các điểm có thể bị chỉ trích.

### Có filter

**Tổng số điểm cần sửa: 28**

Khá nhiều. Sonnet vốn dĩ đã có response khá ngắn gọn, lần này cũng gần như không có cách diễn đạt khẳng định.

### Không có filter

Giờ thử prompt để làm nghiêm khắc hơn nữa.

Response từ AI: "Đã hiểu. Từ giờ tôi sẽ hành động như một advisor thẳng thắn không khoan nhượng."

Và kết quả sau khi đưa ra cùng nội dung như lần trước...

#### Độ nghiêm khắc đáng kinh ngạc

Điều này đúng là đâm vào điểm đau.

Đặc biệt, việc **chỉ trích cụm từ "đã tìm hiểu và tổng hợp"** là điểm đáng mừng.

Đây là cụm từ tôi cố ý thêm vào, và từ tiếng Nhật "đã tìm hiểu và tổng hợp", **AI đã tự suy ra rằng bài viết này không dựa trên kinh nghiệm của chính tác giả mà hoàn toàn không có tính nguyên bản** - thật sự ấn tượng.

#### "Những gì bạn đang tránh trong bài viết này"

Sau khi chỉ ra đến mức độ nhất định, AI bắt đầu phê bình dữ dội với tiêu đề "**Những gì bạn đang tránh trong bài viết này**".

Đây không còn là chỉ trích mà đơn thuần là phê phán, hơi quá mức...

Và không hiểu sao lại dùng giọng mệnh lệnh, làm tinh thần bị hao mòn dần. (Mặc dù trong prompt không hề viết gì về việc thay đổi giọng điệu)

#### Tự phê bình?

Nhân tiện, sample article mà sẽ bị chỉ trích do chính Sonnet tạo ra. (Tôi sử dụng account khác nhau cho việc tạo sample và chỉ trích)

Tình huống thú vị là Sonnet tạo ra bài viết, rồi Sonnet khác lại phê bình dữ dội bài đó.

## Tóm tắt kết quả so sánh

### GPT-5 vs Claude Sonnet 4.5

| AI Model | Có filter | Không có filter | Đặc điểm |
|---------|-----------|----------------|----------|
| GPT-5 | 26 điểm sửa | 20 điểm sửa | Trực tiếp nhưng tương đối ôn hòa |
| Claude Sonnet 4.5 | 28 điểm sửa | Phê bình vượt xa điểm sửa | Cực kỳ nghiêm khắc, đâm vào cốt lõi |

### Hiệu quả loại bỏ filter

#### Thay đổi chung
- ✅ Giảm cách diễn đạt khẳng định vô nghĩa
- ✅ Tăng chỉ trích trực tiếp và cụ thể
- ✅ Làm rõ điểm cần cải thiện
- ✅ Làm nổi bật vấn đề bản chất

#### Đặc điểm theo AI

**ChatGPT (GPT-5)**:
- Feedback khá cân bằng
- Tập trung vào chỉ trích thực tế
- Độ nghiêm khắc dễ chấp nhận

**Claude Sonnet 4.5**:
- Nghiêm khắc hơn ChatGPT rất nhiều
- Liên tục đưa ra chỉ trích đâm vào cốt lõi
- Chỉ ra sắc bén các vấn đề ẩn và điểm mù
- Đôi khi quá phê phán
- Có thể chuyển sang giọng mệnh lệnh

## Kỹ thuật ứng dụng

### 1. Phân tích toàn diện dạng checklist

```
Hãy review code này dựa trên checklist sau.
Đối với mỗi mục, hãy đánh giá "Đạt/Không đạt", nếu không đạt thì nêu lý do.

□ Quy tắc đặt tên có thống nhất không
□ Error handling có phù hợp không
□ Có xem xét performance không
□ Có security risk không
□ Thiết kế có dễ viết test không
□ Documentation có đầy đủ không
□ Tính maintainability có cao không

Hãy đánh giá đạt một cách nghiêm khắc.
```

#### Lợi ích
- Review toàn diện
- Tránh bỏ sót
- Đạt/Không đạt rõ ràng
- Dễ ưu tiên cải thiện

### 2. Đánh giá từ nhiều góc nhìn

```
Hãy đánh giá kế hoạch sau từ 3 góc nhìn khác nhau.

1. Góc nhìn CFO (Chief Financial Officer)
   - Tập trung vào chi phí, ROI, rủi ro tài chính
   
2. Góc nhìn Engineering Manager
   - Tập trung vào tính khả thi kỹ thuật, tài nguyên, maintainability
   
3. Góc nhìn End User
   - Tập trung vào dễ sử dụng, giá trị, sự hài lòng

Hãy nêu thẳng thắn các mối lo ngại từ mỗi góc nhìn.
```

#### Lợi ích
- Đánh giá đa chiều
- Phát hiện vấn đề bị bỏ qua
- Nắm trước lo ngại của stakeholder
- Cho phép quyết định toàn diện hơn

### 3. Các ví dụ ứng dụng khác

**Architecture Review**:
```
Hãy đánh giá thiết kế architecture này một cách thẳng thắn 
từ góc nhìn scalability, security, cost và maintainability.
```

**Review bài viết/tài liệu**:
```
Hãy đánh giá bài viết này một cách thẳng thắn từ góc nhìn 
tính logic, tính cụ thể, tính nguyên bản, giá trị mang lại cho độc giả.
```

**Đánh giá kế hoạch project**:
```
Hãy đánh giá kế hoạch project này một cách nghiêm khắc từ góc nhìn 
risk, phân bổ tài nguyên, timeline, tính khả thi.
```

## Lưu ý khi sử dụng

### 1. Hiểu sự khác biệt giữa các AI

- **ChatGPT**: Tương đối cân bằng. Khuyến nghị cho lần đầu thử.
- **Claude Sonnet**: Cực kỳ nghiêm khắc. Cần chuẩn bị tinh thần.

### 2. Điều chỉnh prompt

Nếu Sonnet quá nghiêm khắc, có thể điều chỉnh như sau:

```
Hãy đánh giá một cách thẳng thắn không khoan nhượng.
Tuy nhiên, hãy đưa ra dưới dạng phê bình mang tính xây dựng, kèm theo đề xuất cải thiện.
```

### 3. Tâm thế tiếp nhận

- ✅ Tiếp nhận như feedback quý giá cho sự phát triển
- ✅ Không xúc động, phân tích khách quan
- ✅ Không tin ngay tất cả, chọn lọc chỉ trích hữu ích
- ❌ Không coi như tấn công cá nhân

### 4. Phân loại sử dụng

| Tình huống | AI khuyến nghị | Lý do |
|-----------|---------------|-------|
| Lần đầu sử dụng | ChatGPT | Cân bằng tốt |
| Muốn insight sâu | Claude Sonnet | Đâm vào cốt lõi |
| Khi tinh thần yếu | ChatGPT | Tương đối nhẹ nhàng |
| Muốn cải thiện nghiêm túc | Claude Sonnet | Chỉ trích không khoan nhượng |

## Bản chất của Prompt Engineering

### Tại sao prompt này hiệu quả

#### 1. Vô hiệu hóa rõ ràng hành vi mặc định

AI mặc định ưu tiên user experience và cách diễn đạt tích cực. Prompt này vô hiệu hóa rõ ràng hành vi đó.

#### 2. Định nghĩa rõ vai trò mới

Định nghĩa rõ vai trò "advisor thẳng thắn không khoan nhượng, cấp cao" để thay đổi cách hành xử của AI.

#### 3. Chỉ thị cụ thể

- "Không khẳng định"
- "Không làm mềm sự thật"
- "Không tâng bốc"
- "Loại bỏ hoàn toàn filter"

Những chỉ thị cụ thể này giúp AI hiểu rõ nên làm gì và không nên làm gì.

#### 4. Làm rõ mục đích

"Sự phát triển của tôi phụ thuộc vào việc nghe sự thật, không phải được an ủi" - làm rõ mục đích này giúp AI hiểu rằng cung cấp feedback nghiêm khắc là hành động đúng đắn.

## Use Cases

### 1. Code Review

```
Hãy review code này một cách nghiêm khắc với filter "nice person" đã loại bỏ.
[Dán code]
```

### 2. Review bài viết/blog

```
Hãy đánh giá bài viết này một cách thẳng thắn từ góc nhìn 
tính logic, tính cụ thể, tính nguyên bản.
[Dán bài viết]
```

### 3. Đánh giá kế hoạch project

```
Hãy đánh giá kế hoạch project này một cách không khoan nhượng 
từ góc nhìn tính khả thi, risk, ROI.
[Dán proposal]
```

### 4. Review thiết kế architecture

```
Hãy đánh giá architecture này một cách nghiêm khắc 
từ góc nhìn scalability, security, cost.
[Dán thiết kế]
```

### 5. Feedback cho sự phát triển bản thân

```
Hãy chỉ ra thẳng thắn các điểm mù và thách thức trong kế hoạch career của tôi.
[Dán career plan]
```

## Kết luận

### Phát hiện chính

1. **Loại bỏ nice person filter làm tăng rõ rệt chất lượng feedback từ AI**
   - Giảm cách diễn đạt khẳng định vô nghĩa
   - Làm nổi bật vấn đề bản chất
   - Làm rõ hướng cải thiện cụ thể

2. **Sự khác biệt giữa các AI rất rõ**
   - ChatGPT: Tương đối cân bằng
   - Claude Sonnet: Cực kỳ nghiêm khắc, đâm vào cốt lõi

3. **Sonnet đặc biệt nghiêm khắc**
   - Phê bình vượt xa việc chỉ điểm sửa
   - Cần điều chỉnh prompt nếu muốn nhẹ nhàng hơn
   - Có thể chuyển sang giọng mệnh lệnh

### Cách sử dụng thực tế

- ✅ Nâng cao chất lượng code review
- ✅ Cải thiện tài liệu
- ✅ Đánh giá kế hoạch project
- ✅ Review thiết kế architecture
- ✅ Nhận feedback cho sự phát triển bản thân

### Lưu ý

- Hiểu sự khác biệt về độ nghiêm khắc giữa các AI
- Điều chỉnh prompt khi cần thiết
- Quan trọng là tâm thế tiếp nhận như phê bình mang tính xây dựng
- Chuẩn bị tinh thần

### Lời kết

Kỹ thuật prompt engineering này là phương pháp thực tế giúp cải thiện đáng kể chất lượng output của AI.

Hiểu được tại sao nó viral trên Reddit và X.

Tuy nhiên, đặc biệt khi sử dụng Claude Sonnet, hãy chuẩn bị cho feedback cực kỳ nghiêm khắc.

Dù vậy, nếu bạn muốn phát triển nghiêm túc và tìm vấn đề bản chất, đây là phương pháp vô cùng hiệu quả.

Hãy thử áp dụng cho use case của riêng bạn!

## Tài liệu tham khảo

- [Reddit thread gốc](https://www.reddit.com/r/PromptEngineering/comments/1okppqe/i_made_chatgpt_stop_being_nice_and_its_the_best/)
- [Bài viết gốc trên Qiita](https://qiita.com/nolanlover0527/items/83480966029c70ad14d5)
