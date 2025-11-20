---
title: "Học hỏi kinh nghiệm sử dụng AI SCREAM từ 35 Heavy User!"
date: 2025-10-02T12:00:00+07:00
draft: false
tags: ["AI SCREAM", "AI Tools", "Survey", "Heavy Users", "Design", "Productivity"]
categories: ["AI", "Design", "Survey"]
author: "YamadaAyaka (Design Factory)"
description: "Khảo sát chuyên sâu về kinh nghiệm sử dụng AI SCREAM từ 35 heavy user, tiết lộ những tip và tricks thực tế"
---

# Học hỏi kinh nghiệm sử dụng AI SCREAM từ 35 Heavy User!

**Tác giả:** YamadaAyaka (Design Factory)  
**Xuất bản:** 2025/09/25  
**Nguồn:** [Cổng thông tin AI tạo sinh được sản xuất bởi Bộ phận Thúc đẩy IT Tập đoàn](https://git-generative-ai.services.isca.jp/article/designer/de034/)

---

Bài viết này tổng hợp những mẹo sử dụng trong công việc và kỹ thuật tạo prompt từ khảo sát 35 heavy user của AI SCREAM. Hãy sử dụng như một tập hợp gợi ý để ứng dụng AI SCREAM hiệu quả hơn trong công việc.

## Đối tượng mục tiêu của bài viết
- Những người mới bắt đầu sử dụng AI SCREAM
- Những người muốn sử dụng thành thạo AI SCREAM
- Những người muốn tạo hình ảnh an toàn trong công việc

## Mục lục
1. AI SCREAM là gì
2. Các tình huống sử dụng AI SCREAM
3. Số lần thử nghiệm để có được kết quả tạo ảnh thỏa mãn
4. Các kỹ thuật và điểm cần lưu ý để viết prompt dễ thành công
5. Các mô hình thường được sử dụng trong Text to Image
6. Các kỹ thuật ngoài prompt
7. Phạm vi và phương pháp "chỉnh sửa / sửa đổi" hình ảnh được tạo
8. Những điểm tiện lợi của AI SCREAM
9. Ví dụ ứng dụng AI SCREAM
10. Tổng kết

## AI SCREAM là gì

AI SCREAM là nền tảng tích hợp nội bộ cho phép nhân viên CA sử dụng nhiều AI tạo hình ảnh mà không cần thiết lập môi trường phức tạp. Hiện tại có thể sử dụng Text to Image, Image to Image, Text to Video, Image to Video, Text to Audio.

### Danh sách mô hình
Các mô hình có thể sử dụng bao gồm:
- Recraft Image Generation
- Google Imagen3
- FLUX Pro
- Stable Image Ultra
- Stable Image Core
- Beautiful Realistic Asians v7
- Beautiful Realistic Asians v6
- Stable Diffusion XL

Ngoài ra còn có chức năng Gallery cho phép xem hình ảnh và prompt được tạo bởi người dùng, và chức năng Agent có thể thay đổi văn bản trong phạm vi được chỉ định.

## Các tình huống sử dụng AI SCREAM

Theo kết quả khảo sát, nhiều người sử dụng trong các tình huống sau:
- Tạo ý tưởng
- Tạo tài liệu đề xuất
- Sản xuất creative nội bộ
- Sản xuất creative đối ngoại
- Kiểm chứng

Trong các ví dụ cụ thể, "tạo ra chất liệu khi sản xuất creative" và "tạo bản phác thảo để truyền đạt hình ảnh cho illustrator khi đặt hàng illustration" chiếm phần lớn.

### Trích dẫn câu trả lời (một số phần)

**Ví dụ trả lời 1:**
"Tôi thường sử dụng để tạo ra chất liệu cần thiết trong việc sản xuất banner creative. Ngoài ra còn sử dụng nhiều trong việc tạo vector illustration (svg)."

**Ví dụ trả lời 2:**
"Gần đây đặc biệt sử dụng trong đề xuất illustration thời gian ngắn (nhân vật) và background phức tạp sẽ mất rất nhiều thời gian để vẽ. Ngoài ra còn sử dụng generation để tạo pattern quyết định touch của illustration và kết nối với illustrator."

**Ví dụ trả lời 3:**
"Chủ yếu có hai mục đích, sử dụng cho poster nội bộ (báo cáo chuyên môn) và các mục đích nội bộ khác, và hiện tại đang nghiên cứu liệu có thể tạo hình ảnh quảng cáo bằng AI SCREAM hay không. Đang kiểm chứng thử nghiệm với nhiều mô hình và prompt đa dạng."

## Số lần thử nghiệm để có được kết quả tạo ảnh thỏa mãn

Kết quả khảo sát về "số lần thử nghiệm để có được kết quả tạo ảnh thỏa mãn" cho thấy hầu hết mọi người thử 1-5 lần hoặc 5-10 lần. Có một số người thử 10-20 lần.

Cũng có ý kiến "thay đổi số lần thử nghiệm tùy theo kích thước hình ảnh sử dụng". Đối với hình ảnh sử dụng nhỏ, có thể chấp nhận ở mức độ nhất định và dễ sửa chữa nên chỉ thử vài lần rồi dừng. Ngược lại, với hình ảnh sử dụng lớn thì ưu tiên chất lượng và thử nhiều lần hơn - cách phân chia như thế này giúp tối ưu hóa hiệu quả công việc tạo ảnh.

### Trích dẫn câu trả lời (một số phần)

"Khi suôn sẻ thì 1 lần. Khi không suôn sẻ thì có khi thử khoảng 20 lần rồi từ bỏ."

"Tùy thuộc vào hình ảnh tạo ra, nhưng hình ảnh hiển thị nhỏ thì thử trong vòng 5 lần, hình ảnh hiển thị lớn thì thử 10 lần trở lên."

## Các kỹ thuật và điểm cần lưu ý để viết prompt dễ thành công

### ▼ Xác định hình ảnh trước khi viết prompt

Về việc cần làm trước khi viết prompt, có câu trả lời là "xác định rõ hình ảnh hoàn thành của hình ảnh hoặc video muốn tạo". Điều này có vẻ có thể ngăn chặn việc thay đổi phương hướng giữa chừng hoặc bối rối không biết tạo ra cái gì mới đúng.

**Trích dẫn câu trả lời (một số phần):**
"Đến một mức độ nào đó trong đầu đã có hình ảnh như thế này là muốn rồi mới nhờ tạo prompt. Không ném hết cho AI."

### ▼ Nội dung mô tả trong prompt

Khi hỏi về nội dung prompt, về độ chi tiết của prompt thì phần lớn trả lời là "viết chi tiết". Các yếu tố được mô tả trong prompt được nhiều người đề cập như sau:

```
Cơ bản: Chủ đề, motif, hình dạng, kích thước, màu sắc, background, nét nghĩa, 5W1H, style như "phong cách anime Nhật" "deformation"
Nhân vật: Giới tính, tuổi tác, chủng tộc, màu da và tóc, kiểu tóc, trang phục, phụ kiện, makeup, hướng, background
Video: Vị trí và chuyển động camera, vị trí đứng và chuyển động, góc độ, lời thoại, âm thanh, cảnh
```

Nội dung prompt được tạo theo quy trình "trước tiên viết càng chi tiết càng tốt vào prompt, xem kết quả tạo ra rồi bổ sung các yếu tố cần thiết", nhiều người làm theo quy trình này.

Ngược lại, cũng có một số ít ý kiến "tốt hơn là bắt đầu từ prompt đơn giản, không nhồi nhét quá nhiều yêu cầu một lúc".

#### Trích dẫn câu trả lời (một số phần)

**●Nhóm chi tiết**

"Mô tả chi tiết góc độ như thể mình đang chụp ảnh, đồng thời để AI mô tả một phần. Nếu kết quả tạo ra khác với hình ảnh tưởng tượng thì sửa prompt và thử lại."

"Thứ tự là: thứ muốn thể hiện nhất, mô tả chi tiết về nó, background và tình huống, muốn truyền đạt cảm giác như thế nào (kinh dị, vui vẻ, v.v.), rồi đơn giản quyết định và nhờ GPT4 viết prompt! Tuy cần điều chỉnh phù hợp."

"Chỉ thị càng chi tiết càng tốt, dạng liệt kê cũng được."

**●Nhóm tối giản**

"Không nhồi nhét quá nhiều yêu cầu một lúc. Với tiền đề thử nhiều lần, ban đầu hình ảnh tổng quan → trích xuất vài output có triển vọng → dần dần cụ thể hóa để tiến gần đến lý tưởng."

### ▼ Kỹ thuật khi tạo prompt

Vậy thì mọi người tạo prompt chi tiết như thế nào? Trong khảo sát, nhiều người trả lời là "sử dụng ChatGPT (Prompt Mode) ở bên phải màn hình AI SCREAM để tạo prompt". Prompt Mode là chức năng của AI SCREAM để tạo prompt cho generation hình ảnh.

"Nhập thông tin cơ bản sơ bộ vào ChatGPT, tạo prompt chi tiết bằng Prompt Mode. Xác nhận prompt tiếng Anh được tạo và bản dịch tiếng Nhật, xóa bỏ biểu hiện thừa." Nếu tạo prompt theo quy trình này thì có vẻ tiện lợi và có thể tạo prompt hiệu quả dễ dàng.

#### Trích dẫn câu trả lời (một số phần)

"Nhờ ChatGPT được thiết lập cho prompt suy nghĩ thì tỷ lệ thành công cao. Có thể do taste có tỷ lệ thành công cao."

"Dịch lại prompt mà GPT output để kiểm tra xem có chứa niuance thừa không. (Ví dụ như chỉ định hệ cool mà lại có từ 'thanh lịch' thì output sẽ thay đổi)"

"Trường hợp svg thì khó tiếp cận taste chỉ bằng prompt nên sử dụng style reference để đăng tài liệu tham khảo và nhờ tiếp cận taste."

### ▼ Các kỹ thuật khác có thể làm trong prompt

Những điều khác được mô tả trong prompt bao gồm các chỉ định để nâng cao độ chính xác tạo ảnh như "1 nhân vật trong 1 màn hình", và các kỹ thuật để dễ sử dụng hình ảnh đã tạo như "background trắng".

#### Trích dẫn câu trả lời (một số phần)

"Vì thường sử dụng illustration đơn lẻ nên thường chỉ định background trắng toàn."

"Tránh cấu trúc như đặt nhiều nhân vật trong 1 layout."

"Điều cần chú ý là sử dụng với ý thức chi tiết hóa để không bị nhầm lẫn với IP khác."

## Các mô hình thường được sử dụng trong Text to Image

Hiện tại, Text to Image của AI SCREAM có thể sử dụng các mô hình Recraft Image Generation, Google Imagen3, FLUX Pro, Stable Image Ultra, Stable Image Core, Beautiful Realistic Asians v7, Beautiful Realistic Asians v6, Stable Diffusion XL.

Khi hỏi về mô hình nào được sử dụng chủ yếu, với lý do "có thể tạo hình ảnh đẹp không có tính cách đặc thù cho cả illustration và photorealistic, chất lượng cao", phần lớn người sử dụng Google Imagen3. Ngoài ra, nhiều người nói rằng khi Google Imagen3 không tạo ra hình ảnh như mong muốn thì sử dụng FLUX Pro.

### Trích dẫn câu trả lời (một số phần)

**【Hạng 1】 Google Imagen3（Trên 80%）**

"Nhất là illustration và ảnh đều có cảm giác tốt không có tính cách đặc thù. Vì có nhiều cơ hội sử dụng hình ảnh 2D casual nên thường sử dụng Google Imagen3."

"Ít có sự sụp đổ của ngón tay và cảm giác khó chịu về tỷ lệ cơ thể, độ chính xác tạo ảnh ưu việt của Imagen3 nên sử dụng chủ yếu. Đặc biệt hữu ích cho yêu cầu tạo hình ảnh thực tế cần tính chân thực."

"Vì dễ tạo nhân vật tự nhiên, không được làm đẹp quá mức."

**【Hạng 2】 FLUX Pro（15%）**

"Tạo bằng cùng prompt với Google Imagen3 và FLUX Pro, tiến hành tạo với cái nào phù hợp với image."

"Đặc biệt hay sử dụng là Google Imagen3 và FLUX Pro. Lý do là các mô hình khác có xu hướng tạo chất liệu giống nước ngoài, nhưng 2 mô hình này dễ tạo ra thứ dễ phù hợp với creative Nhật Bản."

**【Hạng 3】 Recraft（7%）**

"Vì muốn tạo file svg."

## Các kỹ thuật ngoài prompt

Cũng hỏi về các kỹ thuật ngoài prompt. "Thay đổi mô hình" "Sử dụng mô hình Image to Image để tham chiếu hình ảnh" v.v., việc thay đổi mô hình tương ứng với kết quả tạo ra được đề cập nhiều nhất.

Tiếp theo, các phương pháp cải thiện liên tục dựa trên kết quả tạo ra như "Sửa chữa bằng chức năng Edit" "Đính kèm hình ảnh đã tạo vào ChatGPT, chỉ thị chỗ muốn thay đổi và cập nhật prompt" được đề cập. Ngoài ra, cũng có những người ý thức về việc tối ưu hóa hiệu quả toàn bộ công việc như "Giảm thời gian chờ khi tạo ảnh" và "Không hướng đến việc tạo tất cả hoàn hảo mà nâng cao hiệu quả thời gian với tiền đề sửa chữa sau".

### Trích dẫn câu trả lời (một số phần)

"Khi tạo ra hình ảnh không có ý định, ném 'hình ảnh đã tạo' 'chỗ không có ý định' vào ChatGPT đã tạo prompt, nhờ tạo prompt lại thì có cảm giác tiến gần đến hình ảnh yêu cầu."

"Sử dụng chức năng edit để sửa chữa."

"Vì khó có được như ý chỉ bằng generation nên thoả hiệp ở mức độ nào đó (tuy tạo ra thứ thừa nhưng với ý thức sẽ hiệu chỉnh sau bằng chức năng xóa của Photoshop)."

"Để giảm thời gian chờ generation hình ảnh, trước khi hình ảnh tạo xong thì sử dụng prompt thay đổi cách viết để tạo hình ảnh, hoặc cùng prompt nhưng thay đổi mô hình, thay đổi thread để giảm thời gian chờ."

## Phạm vi và phương pháp "chỉnh sửa / sửa đổi" hình ảnh được tạo

Mọi người chỉnh sửa / sửa đổi hình ảnh đã tạo ở mức độ nào? Khi sử dụng hình ảnh đã tạo làm hình ảnh image cho tài liệu đề xuất hoặc chuyển giao cho designer thì "sử dụng nguyên bản không chỉnh sửa", khi sử dụng hình ảnh đã tạo để sản xuất creative thì hầu hết mọi người "chỉnh sửa / sửa đổi". Phạm vi sửa chữa, 80% người "chỉnh sửa / sửa đổi một phần", 20% người "chỉnh sửa / sửa đổi phạm vi rộng". Phương pháp sửa chữa không chỉ trong AI SCREAM mà còn có người sử dụng Photoshop và Midjourney.

### Trích dẫn câu trả lời (một số phần)

"Trường hợp chữ lạ, ngón tay nhiều quá thì xóa bằng Photoshop. Ngoài ra, để khớp với cut trước sau và phong cách thì có khi chỉnh sửa màu sắc và chi tiết nhỏ."

"Lighting và độ dày đường viền v.v. chỉ định chi tiết có vẻ khó với AI nên thường điều chỉnh bằng Photoshop và Illustrator."

## Những điểm tiện lợi của AI SCREAM

Khi hỏi rộng rãi về những điểm tiện lợi của AI SCREAM, chúng tôi nhận được nhiều câu trả lời. Tóm tắt các điểm chính theo từng category.

**【Sử dụng xuyên suốt nhiều mô hình】**
・Việc chuyển đổi mô hình linh hoạt, dễ so sánh kết quả.
・Có thể tạo cùng prompt với nhiều mô hình, có thể làm việc song song.

**【Không cần thiết lập môi trường, sử dụng ngay】**
・Không cần đưa vào mô hình và thiết lập.
・Không cần kiến thức chuyên môn, có thể tạo hình ảnh ngay.

**【An tâm về mặt security・compliance】**
・Có thể sử dụng an tâm về mặt compliance.
・Có thể biết được có bị học hay không qua danh sách.

**【Tiện lợi có thể tạo prompt trong màn hình】**
・Trong màn hình có khu vực tạo prompt và khu vực tạo hình ảnh đặt song song, việc qua lại smooth.
・ChatGPT được thiết lập cho tạo prompt tiện lợi.

**【Khác】**
・Tần suất update cao, có thể sử dụng tool mới nhất.
・Support đầy đủ.
・Quản lý bằng thread và chức năng Gallery v.v. tiện lợi.

## Ví dụ ứng dụng AI SCREAM

Cuối cùng, giới thiệu các ví dụ thực tế sử dụng hình ảnh tạo bởi AI SCREAM để sản xuất creative. Cảm ơn designer H của công ty cổ phần Qureo và designer Y của AWA đã cung cấp!

(Về hình ảnh ví dụ, được đăng các ví dụ flyer và banner được sản xuất sử dụng hình ảnh tạo bởi AI SCREAM)

## Tổng kết

Bài viết này đã giới thiệu câu trả lời khảo sát thực hiện với heavy user của AI SCREAM. Những người chưa sử dụng hết khả năng AI SCREAM, hãy tham khảo bài viết này và thử tạo bằng AI SCREAM.

Cảm ơn tất cả những người đã hợp tác khảo sát!

Nếu có câu hỏi về nội dung kiểm chứng hoặc có nội dung muốn kiểm chứng, hãy liên hệ từ "Yêu cầu đăng・Liên hệ". Về câu hỏi liên quan đến dịch vụ nội bộ, hãy liên hệ trực tiếp với từng dịch vụ.

---

**Dữ liệu khảo sát:** Câu trả lời từ 35 Heavy User  
**Insights chính:** Google Imagen3 được ủng hộ trên 80%, số lần thử 1-10 lần là chủ lưu, việc sử dụng Prompt Mode hiệu quả

**Lưu ý:** 
※Trước khi sử dụng AI tạo sinh, nhất định phải học "Reskilling hiểu thấu AI tạo sinh" và xác nhận các guideline
※Việc sử dụng AI tool trong công việc, dựa trên đánh giá rủi ro của pháp lý・SSG, là quyết định của từng bộ phận kinh doanh.
※Vì giới hạn nội bộ, tất cả nội dung đăng đều cấm chuyển tải lên SNS v.v.