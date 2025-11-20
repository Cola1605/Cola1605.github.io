---
title: "ChatGPT×Figma Layermate Hiệu Quả Hóa Tạo Portfolio: Từ Review Nửa Kỳ Đến Tự Động Tạo Layout"
date: 2025-10-10
draft: false
categories: ["Web & Frontend", "AI & Machine Learning", "Business & Technology"]
tags: ["ChatGPT", "Figma", "Layermate", "portfolio", "design", "automation", "generative-ai", "UI-UX", "workflow"]
description: "Hướng dẫn sử dụng ChatGPT và Figma Layermate để tự động hóa việc tạo portfolio - từ review dự án đến đề xuất layout, giúp tiết kiệm thời gian và công sức cho designers."
---

# ChatGPT×Figma Layermate Hiệu Quả Hóa Tạo Portfolio: Từ Review Nửa Kỳ Đến Tự Động Tạo Layout

**Danh mục:** Know-how  
**Tác giả:** Nhóm IT Hiệu Quả Hóa, PR Factory, Bộ Phận Thúc Đẩy IT  
**Ngày công bố:** 2025年10月9日  

**Bài viết gốc:** https://git-generative-ai.services.isca.jp/article/designer/de035/

---

## Tổng Quan

Khi tạo portfolio cho buổi họp đánh giá cuối kỳ, việc review lại từ đầu các dự án khác nhau tốn rất nhiều thời gian và công sức. Vì vậy, chúng tôi đã xác minh liệu có thể **hỗ trợ bằng AI tạo sinh từ "review dự án" đến "đề xuất layout" trước giai đoạn bắt tay vào sản xuất** hay không. Nếu bạn muốn hiệu quả hóa việc tạo portfolio, hãy tham khảo nhé!

Xác minh này là một phần trong sáng kiến của "Đội Hiệu Quả Hóa" được thành lập trong PR Factory của Bộ Phận Thúc Đẩy IT, nhân dịp "Cuộc Thi Sử Dụng Triệt Để AI Tạo Sinh".

### Đối Tượng Bài Viết

- Người muốn hiệu quả hóa việc review dự án
- Người muốn thử tạo layout bằng AI
- Người quan tâm đến việc sử dụng plugin "Layermate" của Figma

---

## Thành Viên Thực Hiện Xác Minh

### Yamamoto Saori
**PR Factory > UI/UX Team / Design Factory (kiêm nhiệm)**  
Phụ trách UI/UX cho Web, Portal, System

### Yamada Ayaka
**PR Factory > Design Factory**  
Phụ trách design logo và poster

---

## Tổng Quan Xác Minh

Đây là tóm tắt đơn giản về xác minh lần này. Bài viết sẽ giới thiệu chi tiết từng công đoạn xác minh.

### Quy Trình Xác Minh

1. **Tìm AI tạo sinh có khả năng tạo layout**
   - So sánh xác minh Midjourney, Firefly, ChatGPT, Figma Layermate

2. **Review dự án và đề xuất cấu trúc portfolio**
   - Tạo câu hỏi review và phương án cấu trúc bằng ChatGPT

3. **Tạo layout bằng Layermate**
   - Từ phương án cấu trúc đã chọn, tạo prompt cho Layermate và tự động tạo layout

---

## Giới Thiệu

Để hiệu quả hóa việc tạo portfolio, với mục tiêu "**chuẩn bị trạng thái có thể bắt tay vào sản xuất ngay và tiến hành suôn sẻ**", chúng tôi đã xác minh sử dụng AI tạo sinh cho:

- **Review dự án**
- **Hỗ trợ tạo layout**

### Review Dự Án

Bằng cách điền thông tin cơ bản tối thiểu, AI tạo "gợi ý về điểm mạnh khách quan và điểm cần cải thiện", giúp làm sâu sắc việc review.

### Hỗ trợ Tạo Layout

Dựa trên nội dung review được tạo, AI đề xuất cấu trúc portfolio hiệu quả và chuyển hóa chỉ dẫn layout phù hợp với cấu trúc đó thành prompt. Thực hiện tự động tạo layout image bằng plugin "[Layermate](https://www.layermate.ai/ja)" của Figma.

---

## Tìm AI Tạo Sinh Có Khả Năng Tạo Layout

Đầu tiên, để tìm tool có thể tạo layout theo chỉ định số lượng ảnh và văn bản, chúng tôi đã thử **Midjourney, Firefly, ChatGPT và Figma Layermate**.

So sánh và xác minh mỗi tool về "**chỉ định layout được phản ánh đến đâu**" và "**có thể sử dụng ở mức thực tế không**".

### 1. Midjourney

Với Midjourney, mặc dù đã thử Conversational Mode cho phép đưa ra chỉ thị dạng đối thoại, nhưng **độ phản ánh chỉ thị thấp và không tạo được layout theo điều kiện chỉ định**.

**Ví dụ Prompt:**
```
Portfolio Layout Proposal (for Internal Review Meeting) 
The layout consists of one large image placed at the top, followed by five supplementary images arranged below. 
A text area of approximately 100 characters is provided beneath the large image, 
and another 100-character text area is positioned below the supplementary image area. 
The overall design tone features a clean white background, 
with placeholder images represented by simple, soft gray rectangles.
```

**Kết quả:** ❌ Chưa đạt mức thực tế

---

### 2. Firefly

Firefly đã có thể tạo image gần với layout mong muốn hơn so với trước, nhưng **độ chính xác của các yếu tố bố trí vẫn chưa cao**.

**Ví dụ Prompt:**
```
デザイナーのポートフォリオのレイアウト案。
大きな画像1枚の下に、補足画像5枚が並べられている。
大きな画像の下に100文字ぐらいのテキストエリアがあり、
補足画像のエリアの下にも100文字ぐらいのテキストエリアがある。
全体のデザインのトーンは白背景で、
画像はダミーで淡いシンプルなグレーの長方形。
```

**Kết quả:** △ Có xu hướng cải thiện nhưng độ chính xác còn thiếu

---

### 3. ChatGPT

ChatGPT cũng phản ánh chỉ thị dễ hơn so với trước, nhưng **độ chính xác layout vẫn chưa cao lắm**.

**Ví dụ Prompt:**
```
レイアウト案の画像を生成することはできますか？
画面は16:9で、大きな画像1枚、補足画像5枚です。
大きな画像の下に100文字ぐらいのテキストエリアを配置、
補足画像のエリアの下にも100文字ぐらいのテキストエリアが欲しいです。
全体のデザインのトーンは白背景で、
画像はダミーで淡いグレーの長方形で構いません。
```

**Kết quả:** △ Có xu hướng cải thiện nhưng độ chính xác còn thiếu

---

### 4. Figma Layermate ✅

Với plugin "Layermate" của Figma, **layout phù hợp với điều kiện chỉ định được tạo ra một cách suôn sẻ**. Có thể chỉnh sửa dạng đối thoại và chuyển sang làm việc trên Figma ngay, độ tiện lợi rất cao.

**Ví dụ Prompt:**
```
アスペクト比は16:9の、デザイナーのポートフォリオのレイアウト案。
大きな画像1枚の下に、補足画像5枚が並べられている。
大きな画像の下に100文字ぐらいのテキストエリアがあり、
補足画像のエリアの下にも100文字ぐらいのテキストエリアがある。
全体のデザインのトーンは白背景で、
画像はダミーで淡いシンプルなグレーの長方形。
```

**Kết quả:** ✅ Thực tế nhất

---

### Kết Quả Xác Minh

Sau khi so sánh 4 tool đã xác minh, từ góc độ **độ chính xác tạo layout, dễ chỉnh sửa và tính tương thích với Figma, Layermate được đánh giá là thực tế nhất**.

---

## Review Dự Án Và Đề Xuất Cấu Trúc Portfolio

Tiếp theo là phương pháp review dự án sử dụng AI tạo sinh.

Để tạo review và đề xuất cấu trúc portfolio, chúng tôi đã chuẩn bị prompt như sau.

### Cấu Trúc Prompt

#### Về Phần Template ①

Prompt để việc review dự án diễn ra suôn sẻ. Từ thông tin cơ bản tối thiểu, hỗ trợ mở rộng nội dung review dự án và làm sâu sắc suy nghĩ của bản thân.

Cho AI tạo "câu hỏi để rút ra nhận thức và nghi vấn về dự án" và ví dụ trả lời nhẹ cho các câu hỏi đó, từ đó **có thể nhận được gợi ý về điểm mạnh khách quan và góc nhìn đa chiều, giúp việc tự soi xét của bản thân diễn ra suôn sẻ**.

#### Về Phần Template ②

Prompt để suy nghĩ về phương án cấu trúc. Từ thông tin cơ bản, với mục đích đề xuất cấu trúc phù hợp với nội dung dự án và ý định muốn truyền đạt, tạo phương án cấu trúc làm tài liệu để xem xét cách thể hiện nào hiệu quả.

**Bằng cách nắm được hướng đi về cách truyền đạt thành tựu và sáng kiến, có thể nối tiếp suôn sẻ sang thiết kế layout**.

※Thông tin sử dụng cho việc tạo đã được xác nhận không chứa thông tin mật và nội dung nhạy cảm.

---

### Ví Dụ Điền Prompt

**Thông tin dự án:**

```
【Tên Client】
【Tên Dự án】Future Design Conference 2025
【Tổng quan dự án・Bối cảnh yêu cầu】
"Future Design Conference 2025" là conference lấy design ngành Web làm chủ đề.
Thông qua keynote, panel, workshop, triển lãm, giới thiệu rộng rãi về 
trend design, sử dụng tool mới nhất, sáng kiến về cách làm việc.
Là nơi chia sẻ ý tưởng mới kết nối người và xã hội qua sức mạnh design.

【Status】Hoàn thành
【Thời gian sản xuất】Khoảng 1 tháng
【Category/Type sản xuất】Event set
【Lĩnh vực phụ trách】Sản xuất video BGM và video OP phát tại venue
【Team structure】1 người phụ trách main visual, 1 người phụ trách video
【Tool・Môi trường sản xuất】Adobe After Effects
【Format thành phẩm】
・Video BGM 7 phút sử dụng chức năng repeat
・Video OP 15 giây với 12 cut animation

【Ghi chú khác】
Lần đầu tự mình sản xuất motion graphics cho video BGM và OP từ đầu.
Vật liệu video được tạo bằng AI tạo video, BGM cũng tạo 5 bài bằng Suno AI,
nhận được phản hồi tốt hơn dự tính và 4 bài được chấp nhận.
Video OP dù ngắn nhưng thu hút sự chú ý của người tham gia,
video BGM cũng góp phần nâng cao view thế giới của toàn bộ venue.
```

---

### Kết Quả Tạo

Review và phương án cấu trúc portfolio sẽ được xác minh bằng ChatGPT.

#### Câu Hỏi Review Được Tạo (Trích dẫn một phần)

**＜Hoạt động・Hành động của bản thân＞**

**Q1.** Lần đầu tự mình sản xuất motion graphics, có điều gì lo lắng hoặc thử thách không?  
→ "Vì không thể dựa vào chất lượng vật liệu, đã sáng tạo để thống nhất view thế giới qua diễn xuất"

**Q2.** Trong việc tạo "không khí" của BGM và video, điều gì được ý thức?  
→ "Để người tham gia có thể đắm chìm tự nhiên, đã ý thức cả tempo không quá trầm"

**Q3.** Khi sử dụng vật liệu video・âm nhạc tạo bằng AI, đã sáng tạo như thế nào?  
→ "Đã thử nghiệm cách thống nhất tone phù hợp với scene để không có cảm giác vi lạnh"

#### Phương Án Cấu Trúc Portfolio Được Tạo (3 phương án)

**● Phương án 1: Cấu trúc Storytelling**

**【Mục đích】** Truyền đạt như "câu chuyện" từ bối cảnh dự án đến hoàn thành  
**【Cấu trúc】** 1.Tổng quan dự án → 2.Mục đích・Thách thức → 3.Quy trình sản xuất → 4.Thành tựu・Sáng kiến → 5.Review  
**【Điểm nhấn】** "Video thành phẩm to", "Diễn xuất Before/After", "So sánh tạo vật liệu AI"

**● Phương án 2: Cấu trúc Hướng Thành Phẩm・Tập Trung Visual**

**【Mục đích】** Appeal trực quan về độ hoàn thiện của thành phẩm và tính thống nhất view thế giới  
**【Cấu trúc】** 1.Key visual → 2.Cấu trúc video OP → 3.Cấu trúc BGM → 4.Ý định sản xuất・AI sử dụng → 5.Điểm sáng tạo  
**【Điểm nhấn】** "Still image các cut video OP + bố trí timeline", "Lý do chọn BGM và QR nghe thử"

**● Phương án 3: Cấu trúc Hướng Review・Ghi Chép Phát Triển**

**【Mục đích】** Ngôn ngữ hóa và chia sẻ sự phát triển và thay đổi qua dự án thử thách lần đầu  
**【Cấu trúc】** 1.Mục đích・Bối cảnh → 2.Challenge → 3.Trở ngại và Vượt qua → 4.Phát triển → 5.Ý chí tương lai  
**【Điểm nhấn】** "Thể hiện đối chiếu điểm băn khoăn và phương pháp vượt qua", "Sáng kiến giữa sử dụng AI⇄thao tác thủ công"

---

### Kết Quả

Đã tạo được **10 câu hỏi khách quan và ví dụ trả lời** làm gợi ý cho review dự án, cũng như **3 phương án cấu trúc portfolio**.

Thử cùng một prompt nhiều lần hoặc thay đổi tool AI tạo sinh sử dụng sẽ tạo ra output khác nhau, dễ dàng nhận được gợi ý và nhận thức từ nhiều góc nhìn.

---

## Tạo Layout Bằng Layermate

Từ các phương án cấu trúc portfolio được tạo, chọn 1 phương án tốt và tạo prompt cho Figma "Layermate".

### Tạo Prompt Cho Layermate

**Prompt:**
```
Tôi muốn thử "Phương án 2: Cấu trúc Hướng Thành Phẩm・Tập Trung Visual".
Có thể chuẩn bị ảnh và still image từ video.
Nên layout văn bản và hình vẽ như thế nào? Hãy chỉ rõ chi tiết.

Tài liệu là size ngang 1920×1080(px), muốn bố trí thoáng.
Page có thể nhiều không sao.

Ngoài ra, vì muốn tạo layout đó bằng AI tên Layermate của Figma,
có thể tạo prompt bằng tiếng Nhật không?
```

### Chỉ Dẫn Layout Được Tạo

**Layout trang giới thiệu dự án trên slide ngang (1920×1080px):**

- **Bố trí tổng quan dự án ở trên:**
  - Title: Future Design Conference 2025
  - Tên client, thời gian, nội dung sản xuất, tool sử dụng được ghi chép ngay ngắn bằng text
  - Color là text xám đậm hoặc đen trên nền trắng

- **Bố trí thumbnail 12 cut video OP dạng grid ở trung tâm~2/3 bên trái phía trên:**
  - 12 thumbnail video (dummy image OK) trong grid 4 cột × 3 hàng
  - Thêm caption 1〜2 từ dưới mỗi cut

- **Area QR code và thông tin bổ sung ở góc dưới phải:**
  - QR code xem video OP (dummy OK) ở dưới trái + chú thích "Vui lòng xem có âm thanh"
  - Text giải thích "Ý định cấu trúc" (2〜3 điểm dạng list) ở dưới phải

### Kết Quả Tạo Với Layermate

Tại thời điểm này nếu có phần muốn chỉnh sửa thì chỉnh sửa rồi đưa prompt cho Layermate.

#### Tạo Ban Đầu

Layout phù hợp với điều kiện chỉ định được tạo ra suôn sẻ.

#### Chỉnh Sửa Dựa Trên Đối Thoại

Với Layermate, có thể chỉnh sửa kết quả tạo dựa trên đối thoại.
Đưa ra chỉ thị chỉnh sửa để di chuyển area QR code và list ở bên phải.

#### Thay Đổi Style

Có thể tham chiếu image tham khảo style tự mình tạo để thay đổi style.

**Quy trình:**
1. Giữ layout đã tạo
2. Upload image tham khảo style tự mình sản xuất
3. Tham chiếu style về cách đưa title và text giải thích
4. Cùng layout đó, style của image tham chiếu được phản ánh

Mà không cần prompt văn bản chi tiết, có thể phản ánh style của image tham chiếu trong khi giữ cùng layout.

#### Thay Đổi Yếu Tố

Đưa ra chỉ thị từ Layermate, thay đổi số lượng image bố trí từ **12 cut thành 11 cut**.

#### Tạo Page Khác

Có thể tạo layout của page khác với cùng style.

**Ví dụ Prompt:**
```
Hãy tạo page 2 với style tương tự.

【Page 2】
Title (trên trái・to)："Video BGM tạo 'không khí lưu chuyển' tại venue"

1 still image to bên trái (khoảnh khắc ấn tượng truyền tải không khí venue)
3 ảnh venue bên phải (1 trong 3 ảnh là hướng dọc)

Comment box bố trí ở phần trống của màn hình (phía dưới):
"Hiệu quả hóa sản xuất bằng chức năng repeat, tạo video 7 phút trong thời gian ngắn.
Video BGM góp phần nâng cao view thế giới của toàn venue và tạo cảm giác đồng nhất."
```

---

## Các Chức Năng Chính Của Layermate

1. **Layout phù hợp với điều kiện chỉ định được tạo suôn sẻ**
2. **Có thể chỉnh sửa dạng đối thoại**
3. **Có thể chuyển sang làm việc trên Figma ngay**
4. **Có thể tham chiếu image tham khảo style để thay đổi style**
5. **Có thể thay đổi linh hoạt số lượng yếu tố bố trí**
6. **Có thể tạo nhiều page với cùng style**

---

## Kết Quả Và Triển Vọng Tương Lai

### Thành Quả Tích Cực

Sử dụng review và layout được tạo làm "**bản nháp**", quá trình sản xuất sau đó diễn ra suôn sẻ, **hiệu quả cho cả tốc độ và chất lượng**.

### Thách Thức

Mặt khác, do tốn thời gian cho thao tác tool AI tạo sinh và xác nhận・lựa chọn nội dung đề xuất dạng text, hiệu quả rút ngắn tổng thể chỉ dừng ở **khoảng 25%**.

### Triển Vọng Tương Lai

- Cơ chế output・so sánh hàng loạt nhiều phương án cấu trúc・layout được tạo
- Scoring／tự động lựa chọn phương án bằng AI
- Sáng kiến để hạn chế tối đa sự can thiệp của con người

Portfolio đôi khi lên đến hàng chục trang, nhưng hy vọng có thể hiệu quả hóa bằng AI tạo sinh, sản xuất trong thời gian ngắn hơn và một cách vui vẻ hơn.

---

## Kết Luận

Chúng tôi đã xác minh **liệu có thể hiệu quả hóa review dự án và tạo layout bằng AI tạo sinh** trong việc tạo portfolio cho buổi họp đánh giá cuối kỳ.

Lần này tuy chưa rút ngắn đáng kể, nhưng trong tương lai có thể cải thiện hơn nữa bằng cách skip các công đoạn con người can thiệp.

Nếu có ai biết "Làm thế này thì hiệu quả hơn" hoặc "Biết phương pháp tạo portfolio recommended", hãy trao đổi thông tin nhé. Cùng nhau hướng tới hiệu quả hóa cao hơn nữa!

---

## Thành Viên Xác Minh

**Nhóm Hiệu Quả Hóa, PR Factory, Bộ Phận Thúc Đẩy IT**
- Yamamoto Saori (PR Factory > UI/UX Team / Design Factory)
- Yamada Ayaka (PR Factory > Design Factory)

---

**Thông tin bài viết**  
**Nguồn:** CyberAgent 生成AIポータル  
**URL:** https://git-generative-ai.services.isca.jp/article/designer/de035/  
**Ngày xử lý:** 2025