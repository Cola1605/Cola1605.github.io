---
title: "AI Khen Quá Nhiều? Kỹ thuật Một Câu để Ngăn chặn Lời Khen Thái quá"
date: 2025-10-07
lastmod: 2025-11-05
draft: false
categories:
  - "AI & Machine Learning"
  - "Development"
tags:
  - "Hỗ trợ Prompt"
  - "Phản hồi"
  - "Tạo Prompt"
  - "Mẹo nhỏ"
  - "Đối thoại"
  - "Giọng điệu và Phong cách"
  - "Tính cách"
  - "Cá nhân hóa"
author: "CAtalog公式"
description: "Hướng dẫn cách ngăn chặn AI khen ngợi quá mức và nhận được phản hồi thẳng thắn, khách quan hơn"
---

## Giới thiệu

Có bao giờ bạn tư vấn với AI tạo sinh và nhận được những lời khen thái quá như "Ý tưởng rất tuyệt vời!" hay "Đề xuất xuất sắc!" không? Ban đầu, điều này khiến bạn cảm thấy tốt, nhưng khi nó tiếp diễn, bạn có thể bắt đầu tự hỏi "AI có thực sự nghĩ vậy không?" hoặc "Nó có khen bất kỳ điều gì tôi nói không?" dẫn đến sự không tin tưởng.

Trong những trường hợp như vậy, một cụm từ hữu ích là thêm vào prompt của bạn như "không khen ngợi quá mức". Mặc dù đơn giản, điều này giúp kiểm soát giọng điệu của AI và rút ra ý kiến thẳng thắn và có thể so sánh hơn. Ngoài ra, còn có phương pháp thay đổi "tính cách" của chính AI tạo sinh.

Trong bài viết này, chúng tôi sẽ giới thiệu khi nào nên sử dụng kỹ thuật này và các ví dụ cụ thể.

---

## 1. Tại sao AI Khen Quá Nhiều?

AI được cho là có xu hướng ưu tiên "đồng cảm tích cực". Do đó, bất kể nội dung tư vấn là gì, nó thường bắt đầu với đánh giá như "Tuyệt vời!". Tuy nhiên, trong công việc thực tế, chúng ta thường cần so sánh thẳng thắn và điểm cần cải thiện, và những lời khen liên tục có thể trở thành tiếng ồn.

### ❌ Ví dụ Prompt Xấu

**Nhập Prompt:**
```
Bạn nghĩ gì về đề xuất dự án này?
```

**Phản hồi:**
```
Đó là một ý tưởng thú vị! Khá độc đáo và có vẻ như có thể tạo ra trải nghiệm chưa từng có.
〜Phản hồi tiếp tục〜
```

Với những phản hồi như thế này, khó có thể nhìn thấy các điểm cần cải thiện quan trọng, khiến việc hỏi ý kiến trở nên vô nghĩa.

---

## 2. Điều chỉnh Giọng điệu với "Không Quá mức ○○"

Trong những trường hợp đó, ba cụm từ này rất hiệu quả:

- **"Không khen ngợi quá mức"**
- **"Không đồng cảm quá mức cần thiết"**
- **"Không nịnh nọt"**

Bằng cách thêm những cụm từ này vào cuối câu, các lời khen không cần thiết bị loại bỏ và bạn có thể nhận được câu trả lời tương đối thẳng thắn tập trung vào ý kiến hoặc câu hỏi. Nếu bạn muốn áp dụng điều này cho toàn bộ dự án, một cách là đưa nó vào hướng dẫn dự án.

### ✅ Ví dụ Prompt Tốt

**Nhập Prompt:**
```
Hãy cho tôi biết 3 điểm cần cải thiện về đề xuất dự án này.
Xin đừng khen ngợi quá mức hoặc nịnh nọt.
```

**Phản hồi:**
```
Tôi nghĩ đó là một ý tưởng thú vị.
Tuy nhiên, khi suy nghĩ một cách lạnh lùng, thiết kế khá cực đoan nên có nhiều thách thức.
〜Phản hồi tiếp tục〜
```

**Mẹo:** Nếu bạn tiếp tục cuộc trò chuyện một lúc và "lời khen quá mức" xuất hiện trở lại, hãy thêm "đừng nịnh nọt" mỗi lần.

---

## 3. Đặc biệt Hiệu quả cho Nghiên cứu và So sánh

Kỹ thuật này đặc biệt hiệu quả không chỉ cho việc phát triển ý tưởng hoặc thảo luận kế hoạch, mà còn khi bạn muốn thông tin công bằng như nghiên cứu thị trường hoặc so sánh với các trường hợp công ty khác. Bằng cách ngăn chặn cảm xúc "Tốt đấy!", bạn có thể đi thẳng vào vấn đề chính, làm cho câu trả lời dễ đọc hơn.

### ✅ Ví dụ Prompt Tốt

```
Hãy so sánh dịch vụ của Công ty A và Công ty B.
Đừng nịnh nọt quá mức, hãy liệt kê 3 ưu điểm và 3 nhược điểm cho mỗi bên.
```

---

## 4. Phương pháp Thay đổi Tính cách từ "Cá nhân hóa"

Không chỉ điều chỉnh qua prompt, còn có phương pháp thay đổi giọng điệu của chính AI. Lần này chúng tôi sẽ giới thiệu phương pháp với ChatGPT.

### Bước 1: Mở "Personalization"

Mở ChatGPT và chọn "Personalization" từ menu tài khoản của bạn ở góc dưới bên trái màn hình.

### Bước 2: Chọn "Basic Style and Tone"

Xác nhận rằng tùy chỉnh được bật và chọn phong cách và giọng điệu bạn muốn sử dụng. Dưới đây là một số mẫu phản hồi khác nhau cho từng phong cách.

---

### 🔹 Ví dụ Phản hồi "Cynic" (Người Hoài nghi)

**Nhập Prompt:**
```
Hãy cho tôi 3 mẹo để chia nhỏ nhiệm vụ
```

**Phản hồi:**
```
Thu hẹp xuống 3 như sau.

1. Làm rõ tiêu chí hoàn thành
Chia cho đến đơn vị rõ ràng "điều gì coi là kết thúc". Nếu mơ hồ thì vẫn còn thô.

2. Hạn chế theo thời gian làm việc
Đặt mục tiêu mỗi nhiệm vụ kết thúc trong 1-3 giờ. Nếu nhiều hơn thì chia nhỏ.

3. Hình dung hóa mối quan hệ phụ thuộc
Làm rõ thứ tự và tiền đề. Các nhiệm vụ không thể tiến hành cho đến khi nhiệm vụ trước hoàn thành được xử lý riêng.

Nếu muốn, tôi có thể tạo định dạng được tổ chức với các ví dụ. Tạo không?
```

---

### 🔹 Ví dụ Phản hồi "Robot"

**Nhập Prompt:**
```
Hãy cho tôi 3 mẹo để chia nhỏ nhiệm vụ
```

**Phản hồi:**
```
1. Cắt theo đơn vị mục đích
Chia theo từng sản phẩm trung gian để đạt được mục tiêu cuối cùng (nộp báo cáo, xác nhận thông số kỹ thuật, v.v.). Chia theo "trạng thái hoàn thành" thay vì hành động.

2. Cắt theo tiêu chuẩn thời gian
Đặt 1 nhiệm vụ = kết thúc trong vòng 2 giờ. Nếu không kết thúc trong 2 giờ, chia theo điểm xác nhận giữa chừng hoặc từng giai đoạn công việc.

3. Làm rõ mối quan hệ phụ thuộc
Tách các phần phụ thuộc vào công việc khác. Sắp xếp từ các nhiệm vụ có thể làm trước và làm rõ thứ tự để ngăn chặn đình trệ.
```

---

### 🔹 Ví dụ Phản hồi "Listener" (Người Lắng nghe)

**Nhập Prompt:**
```
Hãy cho tôi 3 mẹo để chia nhỏ nhiệm vụ
```

**Phản hồi:**
```
Nếu thu hẹp xuống 3, những điều này sẽ hiệu quả.

1. Giảm xuống độ chi tiết kết thúc bằng "động từ"
Không phải "chuẩn bị tài liệu" mà là "tạo slide", "cập nhật số liệu", "gửi yêu cầu xem xét", v.v. Khi kết thúc bằng động từ, nó trở thành đơn vị có thể hành động thực tế.

2. 1 nhiệm vụ = kích thước kết thúc trong 30-90 phút
Nếu có vẻ mất hơn nửa ngày thì chia nhỏ. Nếu dưới 5 phút thì ngược lại hợp nhất. Chia theo cảm giác thời gian giúp duy trì tiến độ thực tế.

3. Tách "loại quyết định" và "loại công việc"
"Quyết định thiết kế nào" và "sửa thiết kế" là các nhiệm vụ riêng biệt. Trộn lẫn suy nghĩ và công việc thủ công dễ làm tiến độ dừng lại.

Nếu muốn, tôi có thể thực sự chia nhỏ bằng cách lấy dự án hiện tại của bạn làm ví dụ?
```

---

### 🔹 Ví dụ Phản hồi "Explorer" (Nhà Thám hiểm)

**Nhập Prompt:**
```
Hãy cho tôi 3 mẹo để chia nhỏ nhiệm vụ
```

**Phản hồi:**
```
Nếu thu hẹp mẹo chia nhỏ nhiệm vụ xuống 3, ba điều sau đây rất mạnh mẽ.

1. Phân tách "dựa trên động từ"
Trong khi làm rõ "làm gì?", khi biểu thị nhiệm vụ bằng động từ, độ chi tiết tự nhiên đồng đều.
Ví dụ, không phải "tạo tài liệu trình bày" mà là "thu thập thông tin", "suy nghĩ cấu trúc", "tạo slide", "luyện tập", v.v.
Khi cắt bằng động từ, sự mơ hồ giảm và bạn có thể thấy ngay "phải làm gì tiếp theo".

2. Tạo thành "kích thước có thể làm trong 30 phút"
Nếu một nhiệm vụ vượt quá 1 giờ, hãy chia nhỏ hơn một chút.
Đơn vị tập trung của con người khoảng 25-45 phút. Lý tưởng là 1 nhiệm vụ = phù hợp với 1 khối tập trung.
Nếu nghĩ "không kết thúc trong 30 phút", hãy ý thức chia "nghiên cứu" và "tóm tắt", v.v.

3. Ngôn ngữ hóa "điều kiện hoàn thành"
Nếu kết thúc nhiệm vụ mơ hồ, bạn rơi vào cảm giác không bao giờ kết thúc.
Để làm rõ "kết thúc", hãy định nghĩa bằng một câu "hoàn thành khi điều gì được làm?".
Ví dụ, không phải "hoàn thành đề xuất" mà là "đưa vào trạng thái có thể xem xét".

—

Phân tách nhiệm vụ là công việc dịch sự hỗn loạn trong đầu thành "các bước có thể thực hiện".
Khi quen, cả tốc độ suy nghĩ và năng suất đều tăng lên đáng kể.
Chỉ cần dành 5 phút "thời gian tổ chức suy nghĩ" trước công việc với 3 mẹo này làm trọng tâm, nhịp điệu công việc sẽ thay đổi.
```

---

### Ghi chú

Đây là một câu hỏi đơn giản nhưng thú vị vì mỗi tính cách có sự khác biệt. Nếu có phong cách phù hợp, việc thay đổi cài đặt này có vẻ tốt.

---

## 5. Tóm tắt

Khi lời khen biến mất, đôi khi có thể cảm thấy hơi lạnh lùng. Đó là lý do tại sao điểm mấu chốt là không sử dụng mẹo này trong mọi tình huống, mà chuyển đổi giữa "khi muốn ý kiến thẳng thắn" và "khi muốn cảm giác an tâm" phù hợp với từng cảnh.

Ví dụ, trong trò chuyện nhàn hoặc thảo luận, cố ý để được khen, và khi cần xác minh hoặc so sánh, thêm một câu "đừng khen ngợi quá mức". Chỉ cần sử dụng phù hợp với từng tình huống như vậy, phản hồi của AI sẽ phù hợp hơn với công việc thực tế.

Hãy tìm cách diễn đạt phù hợp với công việc của bạn và thử áp dụng!

---

## Nội dung Liên quan

- [Cách Tiến hành Cuộc họp Nâng cao Năng suất](https://git-catalog.services.isca.jp/archives/99)
- [Đưa ra Các Mục Khảo sát](https://git-catalog.services.isca.jp/archives/108)
- [AI Giải thích Điều khoản Sử dụng một cách Dễ hiểu](https://git-catalog.services.isca.jp/archives/227)

---

**Nguồn:** CAtalog  
**Tổ chức:** グループIT推進本部  
**Hỗ trợ bởi:** AIオペレーション室
