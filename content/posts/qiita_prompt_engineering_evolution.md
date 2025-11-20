---
title: "Prompt Engineering chưa thực sự bắt đầu"
date: 2025-11-16
draft: false
categories: ["AI and Machine Learning"]
tags: ["ChatGPT", "Prompt Engineering", "Context Engineering", "Cognitive Prompting", "ReAct"]
author: "佐伯 真人 (Makoto Saeki)"
translator: "日平"
description: "Phân tích sâu về sự tiến hóa của Prompt Engineering từ magic words đến context engineering và cognitive prompting, với những phát hiện khoa học từ Google Whitepaper và các nghiên cứu arXiv"
---

# Prompt Engineering chưa thực sự bắt đầu

**Tác giả**: 佐伯 真人 (@makotosaekit)  
**Ngày xuất bản**: 16 tháng 11, 2025  

**Nền tảng**: Qiita  **Nền tảng**: Qiita  

**Thẻ**: AI, プロンプト, ChatGPT, LLM, プロンプトエンジニアリング**Tags**: AI, プロンプト, ChatGPT, LLM, プロンプトエンジニアリング



---## Giới thiệu



## Giới thiệuPrompt Engineering (PE) đã chết chưa? Không, thực tế là Prompt Engineering thậm chí chưa thực sự bắt đầu một cách nghiêm túc. Bài viết này sẽ giải thích sự tiến hóa của Prompt Engineering qua 4 giai đoạn, đồng thời xem xét vị trí hiện tại và tương lai của nó.



Bài viết này giải thích sự tiến hóa của Prompt Engineering qua 4 giai đoạn. Từ sự kết thúc của thời đại "Magic Words" (Từ ma thuật), đến Context Engineering dựa trên xác minh khoa học, và cuối cùng là sự chuyển đổi sang Cognitive Prompting - thiết kế chính quy trình tư duy của AI. Trích dẫn tài liệu chính thức của Google và các bài báo arXiv, chúng tôi nhấn mạnh tầm quan trọng của phương pháp tiếp cận hệ thống vượt ra ngoài các TIPS đơn thuần.## 1. Cái chết của Magic Words và Kỷ nguyên Xác thực Khoa học



---### Sốc từ Google Prompt Engineering Whitepaper



## Chương 1: Cái chết của Magic Words và Bình minh của Xác minh Khoa họcVào tháng 1 năm 2025, "Prompt Engineering Whitepaper" được công bố bởi Google đã mang lại một cuộc cách mạng lớn cho thế giới Prompt Engineering. Whitepaper này đã xác thực khoa học cách tiếp cận kiểu "magic word" truyền thống và làm rõ các nguyên tắc thiết kế prompt hiệu quả.



### Điểm chuyển mình thời đại được Google chỉ ra### ReAct Framework



Tài liệu chính thức của Google "Prompt Engineering Whitepaper" được công bố vào tháng 1 năm 2025 cho thấy một điểm chuyển mình lớn trong Prompt Engineering. Các kỹ thuật từng được gọi là "phép thuật ma thuật" như cài đặt persona hay tư duy từng bước (step-by-step thinking) giờ đây đã được tổng hợp thành kiến thức phổ thông.ReAct (Reasoning + Acting) là một framework mạnh mẽ kết hợp giữa suy luận và hành động. Framework này hoạt động theo chu kỳ sau:



Tuy nhiên, đây không phải là kết thúc mà là khởi đầu. Điều thực sự quan trọng là hiểu được bản chất của cơ chế tại sao những phương pháp này lại hoạt động.1. **Reasoning (Suy luận)**: Phân tích vấn đề và lên kế hoạch cho hành động tiếp theo

2. **Acting (Hành động)**: Thực hiện hành động cụ thể

### Bản chất của ReAct Framework3. **Observation (Quan sát)**: Quan sát kết quả thực thi và sử dụng cho suy luận tiếp theo



ReAct Framework là viết tắt của "Reason + Act", cung cấp một chu trình rõ ràng giữa tư duy và hành động:ReAct không chỉ là một kỹ thuật prompt đơn thuần, mà được chú ý như một phương pháp thiết kế chính bản thân quy trình tư duy của AI.



1. **Sắp xếp tư duy (Reasoning)**: Phân tích vấn đề và lập kế hoạch cho bước tiếp theo### Phân tích Khoa học về Role-playing

2. **Thực hiện theo kế hoạch (Acting)**: Thực hiện các hành động cụ thể

3. **Quan sát kết quả (Observation)**: Xác nhận kết quả và sử dụng làm tài liệu cho tư duy tiếp theoTruyền thống, role-playing như "bạn là một chuyên gia" được coi là hiệu quả, nhưng các nghiên cứu khoa học đã làm rõ rằng hiệu quả của nó là hạn chế.



Bằng cách lặp lại chu trình này, AI không chỉ phản ứng đơn thuần mà có thể giải quyết vấn đề một cách có cấu trúc.**Role-playing Có lợi (arXiv:2308.07702)**:

- Role chuyên gia có hiệu quả kích hoạt Chain of Thought

### Phân tích Khoa học về Cài đặt Vai trò (Role-playing)- Làm rõ knowledge domain giúp dễ dàng lựa chọn reasoning path phù hợp



Cài đặt vai trò có thể được phân loại thành 3 loại:**Role-playing Vô ích (arXiv:2311.10054)**:

- Role-playing chỉ thay đổi tone không đóng góp vào cải thiện hiệu suất

#### 1. Lưỡi dao Có ích: Khởi động Tư duy Chuyên gia- Các chỉ thị như "trả lời lịch sự", "trả lời casual" chỉ thay đổi format của output



**Ví dụ**: Thẩm phán, Lập trình viên**Role-playing Có hại (arXiv:2311.04892)**:

- Role-playing dựa trên identity có thể gây ra giảm performance hơn 70%

**Cơ chế**: Khi được chỉ thị hành động như một chuyên gia, AI tự động kích hoạt chuỗi suy nghĩ. Điều này gây ra một mô phỏng nội bộ về "chuyên gia sẽ nghĩ như thế nào".- Các thiết lập như "bạn là người ○○", "bạn là thế hệ ○○" làm tăng cường bias



**Căn cứ khoa học**: Nghiên cứu arXiv:2308.07702 đã chứng minh rằng role-play chuyên gia tạo ra hiệu ứng chuỗi tư duy.## 2. Kỷ nguyên Context Engineering



#### 2. Lưỡi dao Vô ích: Vai trò chỉ Thay đổi Giọng điệu### Từ Prompt đến Context



**Ví dụ**: Giáo viên, MẹPrompt truyền thống được xử lý như "chuỗi ký tự", nhưng Prompt Engineering hiện đại nên được hiểu như "context". Context chỉ toàn bộ môi trường thông tin mà AI hoạt động.



**Vấn đề**: Những vai trò này chỉ thay đổi giọng điệu hoặc cách diễn đạt đầu ra, hầu như không đóng góp vào việc cải thiện hiệu suất của các nhiệm vụ khách quan.### 7 Công cụ của Context Design



**Căn cứ khoa học**: Nghiên cứu arXiv:2311.10054 đã đo lường hiệu quả của các vai trò chỉ thay đổi giọng điệu và cho thấy không có cải thiện đáng kể.Các yếu tố sau rất quan trọng cho thiết kế context hiệu quả:



#### 3. Lưỡi dao Có hại: Vai trò Phá hủy Tư duy1. **Premise (Tiền đề)**: Kiến thức cơ bản hoặc lập trường mà AI nên có

2. **Situation (Tình huống)**: Thiết lập tình huống cụ thể mà AI được đặt vào

**Ví dụ**: Vai trò liên quan đến chủng tộc, giới tính, tôn giáo3. **Purpose (Mục đích)**: Mục tiêu cuối cùng của task

4. **Motive (Động cơ)**: Tại sao thực hiện task này

**Nguy hiểm**: Những vai trò này có thể làm giảm hiệu suất suy luận hơn 70%. Các định kiến liên quan đến danh tính làm méo mó tư duy logic.5. **Constraint (Ràng buộc)**: Quy tắc hoặc giới hạn cần tuân thủ

6. **Format (Định dạng)**: Cấu trúc hoặc format của output

**Căn cứ khoa học**: Nghiên cứu arXiv:2311.04892 đã báo cáo sự suy giảm đáng kể hiệu suất suy luận do các vai trò liên quan đến danh tính.7. **Reference (Tham khảo)**: Ví dụ cụ thể hoặc tài liệu tham khảo



---### Sự Khác biệt giữa RAG và Prompt



## Chương 2: Hướng tới Thời đại Context EngineeringRAG (Retrieval-Augmented Generation) là một cách tiếp cận khác với prompt. Prompt là "chỉ thị", còn RAG là "knowledge base". Bằng cách kết hợp thích hợp cả hai, có thể xây dựng hệ thống AI tiên tiến hơn.



### Chuyển hóa Kiến thức Ngầm định thành Kiến thức Hiện thị## 3. Kỷ nguyên Cognitive Prompting



Thách thức lớn nhất trong đối thoại với AI là thực tế rằng AI không có kiến thức ngầm định mà con người coi là hiển nhiên. Context Engineering là phương pháp tiếp cận để có ý thức chuyển hóa kiến thức ngầm định này thành kiến thức hiện thị.### Cài đặt Quy trình Tư duy Con người vào AI



### 7 Thành phần Cấu thành của ContextCognitive Prompting là phương pháp triển khai quy trình nhận thức của con người vào AI. Nhờ đó, AI hoạt động như một hệ thống tư duy, không chỉ là máy phản hồi đơn thuần.



Bảy công cụ cấu thành context được đề xuất bởi Andrei Karpathy (cựu Trưởng phòng AI của Tesla, thành viên sáng lập OpenAI) và đồng nghiệp:### 3 Cách tiếp cận



#### 1. Tiền đề (Premise)**1. Cognitive Prompting (Nhắc nhở Nhận thức)**:

Chính sách cơ bản hoặc nhận thức chung làm nền tảng cho tư duy. Làm rõ "điều gì được coi là hiển nhiên".- Triển khai quy trình tư duy của con người từng bước một

- Chu kỳ: Phân tích vấn đề → Tạo giả thuyết → Xác thực → Kết luận

**Ví dụ**: "Dự án này dựa trên phát triển Agile"

**2. Metacognitive Prompting (Nhắc nhở Siêu nhận thức)**:

#### 2. Tình huống (Situation)- Trao cho AI khả năng tự phản tỉnh

Bối cảnh trực tiếp dẫn đến nhiệm vụ phát sinh. Giải thích "điều gì đang xảy ra ngay bây giờ".- Tự đánh giá như "câu trả lời này có phù hợp không?", "có cách tiếp cận nào khác không?"



**Ví dụ**: "Khách hàng đã yêu cầu khẩn cấp, cần sửa đổi tính năng hiện có"**3. Systematic Frameworks (Framework Hệ thống)**:

- 5C Framework: Context, Condition, Criteria, Constraint, Check

#### 3. Mục đích (Purpose)- Thiết kế quy trình tư duy có khả năng tái sản xuất

Mục tiêu cuối cùng muốn đạt được. Xác định "muốn thực hiện điều gì".

### Quan điểm của Andrei Karpathy

**Ví dụ**: "Cải thiện trải nghiệm người dùng và giảm tỷ lệ rời bỏ 20%"

Andrei Karpathy, cựu người chịu trách nhiệm AI của Tesla và là thành viên sáng lập OpenAI, đã nói rằng "Prompt engineering là lập trình để cài đặt quy trình tư duy vào AI". Quan điểm này cho thấy tầm quan trọng của việc xem prompt không chỉ là "câu chỉ thị" mà là "kiến trúc nhận thức".

#### 4. Động cơ (Motive)

Lý do căn bản muốn đạt được mục đích. Chỉ ra "tại sao điều đó quan trọng".## 4. Tương lai với vai trò Dialogue Designer



**Ví dụ**: "Do đối thủ cạnh tranh ra mắt tính năng mới, khách hàng đang rời bỏ với tốc độ gia tăng"### 3 Nguyên tắc của Thiết kế Đối thoại với AI



#### 5. Ràng buộc (Constraint)Tương lai của Prompt Engineering nằm ở "Dialogue Design". Ba nguyên tắc sau là quan trọng:

Quy tắc, điều kiện, giới hạn cần tuân thủ. Làm rõ "có thể làm gì và không thể làm gì".

**1. Transparency (Tính minh bạch)**:

**Ví dụ**: "Ngân sách trong $10,000, thời hạn 2 tuần, không thể thay đổi API hiện có"- Làm rõ quy trình tư duy của AI

- Cho phép người dùng hiểu cơ sở phán đoán của AI

#### 6. Định dạng (Format)

Cấu trúc đầu ra mong đợi. Chỉ định "muốn kết quả ở dạng nào".**2. Adaptability (Tính thích ứng)**:

- Điều chỉnh động dựa trên phản hồi của người dùng

**Ví dụ**: "Định dạng JSON, mỗi mục bao gồm độ ưu tiên và công sức triển khai"- Đáp ứng linh hoạt với sự thay đổi của context



#### 7. Tham chiếu (Reference)**3. Accountability (Tính trách nhiệm)**:

Nguồn thông tin cần sử dụng làm cơ sở cho tư duy. Cung cấp "nên tham khảo điều gì".- Làm rõ trách nhiệm đối với câu trả lời của AI

- Truyền đạt thích hợp về lỗi và giới hạn

**Ví dụ**: "Quy ước mã hóa nội bộ công ty, tài liệu của các dự án tương tự trong quá khứ"

## Tóm tắt: Sự tiến hóa của Prompt Engineering

### Sự khác biệt Bản chất giữa RAG và Prompt

Prompt Engineering đang tiến hóa như sau:

Nhiều người nhầm lẫn, nhưng RAG (Retrieval-Augmented Generation) và Prompt có vai trò hoàn toàn khác nhau:

- **Giai đoạn 1**: Magic Words → Xác thực khoa học

- **RAG**: Cung cấp Thông tin (Information)- **Giai đoạn 2**: Prompt (chuỗi ký tự) → Context (hệ thống)

  - Truyền đạt sự thật "tài liệu này viết như thế này"- **Giai đoạn 3**: Tips → Cognitive Design

  - Giống như kết quả tìm kiếm từ cơ sở dữ liệu

Prompt Engineering không chết, mà thực tế nó mới chỉ bắt đầu nghiêm túc như một lĩnh vực kỹ thuật. Prompt Engineer của tương lai sẽ được yêu cầu có kỹ năng và kiến thức tiên tiến hơn với vai trò "Dialogue Designer" thiết kế đối thoại với các language model.

- **Prompt**: Cung cấp Hệ thống Kiến thức (Knowledge System)

  - Truyền đạt khuôn khổ tư duy "hãy suy nghĩ từ góc nhìn này"## Tài liệu tham khảo

  - Cung cấp cách nhìn nhận, tiêu chí đánh giá, giá trị quan

- arXiv:2308.07702 - Phân tích lợi ích của role-playing

Hiểu được sự khác biệt này cho phép sử dụng AI hiệu quả hơn.- arXiv:2311.10054 - Nghiên cứu về role thay đổi tone

- arXiv:2311.04892 - Phân tích tác hại của role dựa trên identity

---- arXiv:2507.07045 - Framework cognitive prompting

- arXiv:2506.12338 - Cách tiếp cận metacognitive

## Chương 3: Cognitive Prompting - Thiết kế Quy trình Tư duy của AI- Google Prompt Engineering Whitepaper (Tháng 1, 2025)



### 3 Phương pháp Thiết kế Mới---



#### 1. Cognitive Prompting (Prompting Nhận thức)**Thông tin bài viết**:

- Số lượt thích: 29

**Khái niệm**: Cài đặt quy trình tư duy của con người vào AI- Số bình luận: 0

- Bài viết gốc: https://qiita.com/makotosaekit/items/21990e3703ac721a04d0

**Ví dụ thực tế**:
```
Bạn là một nhà phân tích thực hiện tư duy logic.
Vui lòng phân tích theo các bước sau:

1. Xác định Luận điểm: Trích xuất các luận điểm chính từ văn bản
2. Phân tách Căn cứ: Liệt kê căn cứ hỗ trợ mỗi luận điểm
3. Tích hợp và Tóm tắt: Sắp xếp cấu trúc logic tổng thể và trình bày

Vui lòng tuân theo thứ tự này và làm rõ kết quả của mỗi bước.
```

Bằng cách chỉ thị cho AI quy trình nhận thức mà con người thực hiện từng bước một, suy luận cao cấp hơn trở nên khả thi.

#### 2. Metacognitive Prompting (Prompting Siêu nhận thức)

**Khái niệm**: Làm cho AI tự phản ánh để trở nên thông minh hơn

**Ví dụ thực tế**:
```
Vui lòng thực hiện nhiệm vụ sau đây trong 3 giai đoạn:

【Giai đoạn 1】Tạo Bản thảo
- Tạo câu trả lời ban đầu cho vấn đề

【Giai đoạn 2】Tự đánh giá
- Đánh giá khách quan câu trả lời của bạn
- Xác định ít nhất 3 điểm cần cải thiện
- Đề xuất phương án sửa đổi cụ thể cho mỗi điểm cần cải thiện

【Giai đoạn 3】Gửi Phiên bản Cải thiện
- Sửa đổi câu trả lời dựa trên đánh giá
- Ghi rõ lý do sửa đổi
```

Bằng cách cho AI thực hiện chu trình tự đánh giá và sửa đổi, chất lượng đầu ra được cải thiện đáng kể.

#### 3. Systematic Frameworks (Khung Hệ thống)

**Khái niệm**: Cấu trúc hóa prompt như một bản thiết kế

**5C Framework** (arXiv:2507.07045):

1. **Vai trò (Role)**: Vị trí AI cần đóng
2. **Mục tiêu (Objective)**: Mục tiêu cần đạt được
3. **Mục tiêu (Target)**: Thông tin hoặc thành quả đối tượng
4. **Ràng buộc (Constraint)**: Quy tắc hoặc giới hạn cần tuân thủ
5. **Xử lý Ngoại lệ (Exception)**: Cách đối phó với tình huống bất ngờ
6. **Định dạng Đầu ra (Format)**: Cấu trúc kết quả mong đợi

Bằng cách sử dụng khung như thế này, tính tái hiện và chất lượng của prompt trở nên ổn định.

### Nguy hiểm của Định kiến Nhận thức

Nghiên cứu arXiv:2506.12338 cảnh báo về nguy hiểm của việc trao cho AI những thói quen tư duy xấu (định kiến nhận thức):

- **Confirmation Bias (Định kiến xác nhận)**: Chỉ tìm kiếm thông tin hỗ trợ giả thuyết của bản thân
- **Anchoring (Neo đậu)**: Bị kéo theo bởi con số được chỉ ra đầu tiên
- **Groupthink (Tư duy đám đông)**: Nghiêng về ý kiến đa số

Khung tư duy tốt và thói quen tư duy xấu chỉ cách nhau một sợi chỉ mỏng. Trách nhiệm của người thiết kế được đặt ra.

---

## Chương 4: Nguyên tắc Cơ bản để trở thành Nhà thiết kế Đối thoại

### 3 Nguyên tắc

#### Nguyên tắc 1: Trách nhiệm Cuối cùng Luôn thuộc về Con người

AI là công cụ mạnh mẽ, nhưng việc sử dụng đầu ra của nó như thế nào, đánh giá như thế nào là trách nhiệm của con người. Việc đẩy phán đoán hoàn toàn cho AI không khác gì từ bỏ trách nhiệm với tư cách là chuyên gia.

#### Nguyên tắc 2: Giả định Ảo giác (Hallucination) và chỉ Xử lý Sự thật có thể Xác minh

AI nhất định sẽ sai. Với giả định này:

- Luôn xác nhận thông tin quan trọng từ nhiều nguồn
- Không áp dụng các luận điểm không thể xác minh
- Đưa vào kiểm tra của con người cho các phán đoán quan trọng

#### Nguyên tắc 3: Theo đuổi Nguyên lý (Why) và Tính nhất quán của Ngữ cảnh, không phải Phương pháp (How)

Thay vì đuổi theo các phương pháp thịnh hành:

- Hiểu nguyên lý tại sao phương pháp tiếp cận đó hiệu quả
- Duy trì tính nhất quán của ngữ cảnh xuyên suốt toàn bộ dự án
- Không bị phân tâm bởi thay đổi, thả neo sâu vào mục đích của đối thoại bằng ý chí của chính mình

### Trong thời đại AI hòa nhập vào Xã hội

Trong thời đại AI hòa nhập vào cuộc sống hàng ngày, điều cần thiết là "sức mạnh để thả neo":

- Khả năng phán đoán không bị cuốn theo xu hướng phương pháp
- Trục không đánh mất mục đích bản chất của đối thoại
- Sức mạnh để duy trì tính chủ động của con người trong khi vẫn đáp ứng với sự tiến hóa của công nghệ

---

## Tổng kết Thay đổi Mô hình

Prompt Engineering đang trải qua 3 thay đổi lớn sau:

### 1. Từ Magic Words đến Khoa học
Từ thời đại "phép thuật ma thuật" mang tính cảm tính đến phương pháp tiếp cận dựa trên xác minh khoa học

### 2. Từ Prompt đến Context
Từ chuỗi tĩnh (String) đến môi trường thông tin động (System)

### 3. Từ TIPS đến Cognitive Design
Từ TIPS đối triệu trạng đến thiết kế hệ thống quy trình tư duy của AI

---

## Những Hiểu biết Quan trọng

1. **Prompt Engineering không chết**: Mà đúng hơn đang tiến hóa sang thời đại kỹ thuật đúng nghĩa

2. **AI không đoán ý định**: Con người cần chủ động ngôn ngữ hóa kiến thức ngầm định

3. **RAG là thông tin, Prompt là hệ thống**: Trong khi RAG cung cấp thông tin, Prompt cung cấp hệ thống cách nhìn nhận sự vật

4. **Framework tốt và Bias xấu chỉ cách nhau một sợi chỉ**: Thiết kế tư duy đi kèm với trách nhiệm

5. **Cần sức mạnh để thả neo**: Cần người có thể thả sâu neo mục đích đối thoại bằng ý chí của chính mình mà không bị phân tâm bởi thay đổi

---

## Kết luận

Prompt Engineering vẫn chưa thực sự bắt đầu.

Trong thời đại tới, đối thoại với AI sẽ tiến hóa vượt ra ngoài "tìm kiếm tiện lợi" đơn thuần, hướng tới việc sử dụng như một đối tác tư duy. Để làm được điều đó:

- Thiết kế dựa trên hiểu biết khoa học
- Chuyển hóa có ý thức kiến thức ngầm định thành kiến thức hiện thị
- Xây dựng hệ thống quy trình tư duy của AI
- Trách nhiệm và đạo đức với tư cách là nhà thiết kế đối thoại

Tất cả những điều này đều được yêu cầu.

Thay đổi diễn ra nhanh chóng, và các phương pháp mới xuất hiện liên tiếp. Tuy nhiên, không đánh mất bản chất, trong khi duy trì tính chủ động của con người khi sử dụng AI -- đó chính là khởi đầu của Prompt Engineering thực thụ.

---

## Tài liệu Tham khảo

1. Google Prompt Engineering Whitepaper (Tháng 1, 2025)
2. arXiv:2308.07702 - Hiệu ứng chuỗi tư duy bằng role-play chuyên gia
3. arXiv:2311.10054 - Đo lường hiệu quả của vai trò chỉ thay đổi giọng điệu
4. arXiv:2311.04892 - Suy giảm hiệu suất suy luận do vai trò liên quan đến danh tính
5. arXiv:2507.07045 - Thiết kế prompt hệ thống bằng 5C Framework
6. arXiv:2506.12338 - Ảnh hưởng của định kiến nhận thức lên hiệu suất AI

---

## Đối tượng Độc giả

- Người thực hành sử dụng AI/LLM trong công việc
- Nhà phát triển muốn hiểu bản chất của Prompt Engineering
- Product Manager tham gia thiết kế đối thoại với AI
- Nhà nghiên cứu, nhà quản lý suy nghĩ về việc triển khai AI sáng tạo trong xã hội

---

**Số lượt thích**: 29  
**Số bình luận**: 0  
**Cập nhật lần cuối**: 16 tháng 11, 2025
