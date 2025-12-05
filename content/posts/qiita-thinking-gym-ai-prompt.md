---
title: "Thinking Gym: Prompt Đối Phó với Suy Giảm Tư Duy Do Lạm Dụng AI"
date: 2025-12-05T14:00:00+09:00
draft: false
categories:
  - "AI and Machine Learning"
  - "Development"
tags:
  - "Quản lý"
  - "Prompt"
  - "AI Tạo sinh"
  - "ChatGPT"
  - "Claude"
  - "Tư duy"
  - "Meta-nhận thức"
  - "AI Coaching"
  - "Thinking Gym"
author: "Kentaro Wada (WdknWdkn)"
translator: "日平"
description: "Để giải quyết vấn đề suy giảm tư duy do sử dụng AI quá mức, tác giả đề xuất hệ thống 'Thinking Gym' - sử dụng AI như một huấn luyện viên để rèn luyện chính tư duy. Ghi lại mỗi phiên tư duy dưới dạng một tệp Markdown, sau khi phiên kết thúc AI sẽ quan sát và cung cấp phản hồi về quá trình tư duy. Hệ thống giúp trực quan hóa lượng, chất và thể lực tư duy, đồng thời rèn luyện meta-nhận thức thông qua khoảng cách giữa tự đánh giá và đánh giá của huấn luyện viên."
---

**Nguồn:** [Qiita](https://qiita.com/WdknWdkn/items/c67c90d75e7ec942e60c)  
**Advent Calendar:** いえらぶGROUP Advent Calendar 2025 (Day 3)  
**Số lượt thích:** 63

---

## Mở Đầu

AI thực sự tuyệt vời. Ngày nào cũng chạm vào nó, và ngày càng nhiều trường hợp là nhập văn bản vào ChatGPT trước rồi mới bắt đầu công việc. Tôi cảm thấy chất lượng cơ bản của output đã được nâng cao.

Và thú vị nữa. Vì nó trả lời các nội dung đã sắp xếp hoặc những suy nghĩ hơi nghiêng một cách đẹp mắt và thú vị, nên đôi khi say mê đối thoại đến mức nó trở thành mục đích chính.

Cuối cùng, mọi người xung quanh nói "Nên nói chuyện với người chứ không phải AI". Đúng vậy ạ.

## Đây Là Câu Chuyện Gì?

"Vì hỏi AI thì ngay lập tức có câu trả lời cho mọi thứ, nên không tự suy nghĩ nữa" - cuộc tư vấn như thế đã đến năm nay. Cá nhân tôi nghĩ những lo lắng về tương lai gần như vậy sẽ đến trong vòng 5 năm nữa, nhưng không ngờ đã đến ngay năm nay.

Đúng vậy, với Claude hoặc ChatGPT, cách viết code, hướng thiết kế kiến trúc, tiêu chí lựa chọn công nghệ đều có câu trả lời trả về trong vài giây. Bản thân điều này là tuyệt vời, nhưng mặt khác "thời gian tự suy nghĩ" chắc chắn đang giảm đi. Đáng sợ.

Vì đáng sợ nên tôi đã thử một cách tiếp cận nghịch lý. Sử dụng AI để rèn luyện sức tư duy của bản thân. Nghe có vẻ mâu thuẫn nhưng tôi đang tiếp tục khá thú vị. Đó là Thinking Gym.

## Vấn Đề Phụ Thuộc Quá Mức vào AI, Bản Chất Đang Xảy Ra Gì?

Vấn đề này, trên bề mặt có vẻ như là câu chuyện "hỏi AI câu trả lời quá nhiều", nhưng khi đào sâu hơn một chút, về bản chất tôi cho rằng **"lượng tư duy", "chất tư duy" và "thể lực tư duy" cả ba đang suy giảm đồng thời**.

### Lượng Tư Duy Giảm

- Hỏi AI thì ngay lập tức có câu trả lời → Thời gian tự suy nghĩ giảm về mặt vật lý
- Không thể đo được "thời gian suy nghĩ sâu" trong một ngày

### Chất Tư Duy Giảm

- Hài lòng với những câu hỏi hời hợt
- Thói quen đào sâu điều kiện tiên quyết và đánh đổi bị mất đi

### Thể Lực Tư Duy Suy Giảm

- "Sức bền" tiếp tục tập trung suy nghĩ 30 phút, 1 giờ suy yếu
- Hình thành thói quen tư duy tìm kiếm câu trả lời ngay lập tức

Tất nhiên không phải ai cũng như vậy, và có nhiều người sử dụng AI khéo léo. Nhưng ít nhất bản thân tôi đã cảm nhận được sự suy giảm của cả ba điểm này.

## Thinking Gym: Sử Dụng AI như Huấn Luyện Viên Tư Duy

Vậy nên tôi đã nghĩ ra cơ chế "Thinking Gym".

Giống như tập luyện tại phòng gym, tạo ra thời gian cố ý để rèn luyện chính tư duy. Và AI hoạt động như một huấn luyện viên (coach). Tức là không phải để được dạy câu trả lời, mà để hỗ trợ quá trình tư duy.

### Trao Đổi Diễn Ra Như Thế Này ↓↓

![Ví dụ trao đổi của Thinking Gym](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F215128%2F3861676c-c30d-4872-b164-c9e1abb5d2e9.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=870d7284a8b6a63d22d4c6418cbac4ef)

### Cơ Chế Cơ Bản

Trong Thinking Gym, một phiên tư duy được ghi lại dưới dạng một tệp Markdown. Cấu trúc như sau:

```markdown
---
date: 2025-12-03
title: "Xem xét phương án CRM"
category: "strategy"  # design / strategy / review / other
ai_policy: "partial"   # forbidden / partial / reference
planned_minutes: 45
actual_minutes: 42
thought_score: 4       # Tự đánh giá 1-5
stamina_score: 3       # Tự đánh giá 1-5
coach_assessment: 4    # 【MỚI】Điểm đánh giá của AI coach 1-5
interruptions: 2
---

# Xem xét phương án CRM

## Định nghĩa vấn đề
(Muốn suy nghĩ về điều gì?)

## Điều kiện tiên quyết・Ràng buộc
- Số người trong team là 3 người
- Bắt buộc phải liên kết với hệ thống hiện có
...

## Ý tưởng・Lựa chọn
### Phương án A: Triển khai Salesforce
Ưu điểm・Nhược điểm...

### Phương án B: Tự phát triển
Ưu điểm・Nhược điểm...

## Quyết định・Hành động tiếp theo
- [ ] Đăng ký dùng thử Salesforce
- [ ] Ước tính chi phí di chuyển dữ liệu hiện có

## Ghi chú nhìn lại
### Điểm tốt
- Có thể suy nghĩ sau khi làm rõ điều kiện tiên quyết
...

### Điểm chưa tốt
- So sánh phương án A và B còn hời hợt
...

### Cải tiến lần sau
- Quyết định trục đánh giá trước rồi mới so sánh lựa chọn
...

## 【MỚI】Phản hồi từ Huấn luyện viên

### Tổng quan
Trong phiên này, giai đoạn làm rõ điều kiện tiên quyết đã được suy nghĩ cẩn thận.
Tuy nhiên, trong phần so sánh ý tưởng có vẻ thiên về trục đơn lẻ là "chi phí",
các quan điểm khác như trải nghiệm người dùng và gánh nặng vận hành bị bỏ sót.

### Quan sát quá trình tư duy
- **Độ sâu tư duy**: Đào sâu "Tại sao Salesforce?" đến 2 cấp độ (◯)
- **Độ rộng quan điểm**: Thiên về quan điểm chi phí, yếu về quan điểm trải nghiệm người dùng và kỹ năng team (△)
- **Tính nhất quán logic**: Dòng chảy điều kiện tiên quyết→lựa chọn→quyết định rõ ràng (◯)
- **Sự rõ ràng của điều kiện tiên quyết**: Có thể ngôn ngữ hóa điều kiện tiên quyết quan trọng như số người trong team, yêu cầu liên kết (◎)
- **Quá trình quyết định**: So sánh 2 phương án nhưng trục đánh giá không rõ ràng (△)

### Điểm có thể phát triển
- Sức mạnh làm rõ điều kiện tiên quyết là cao. Tiếp tục theo xu hướng này sẽ tốt
- Tiếp theo nếu hình thành thói quen "quyết định trục đánh giá trước", chất lượng so sánh xem xét sẽ tăng lên

### Điều muốn thử lần sau
- Liệt kê 3-5 "trục đánh giá" trước khi nghĩ ra lựa chọn
- Chỉ cần đánh dấu ◯△× cho mỗi trục, chất lượng thảo luận cũng sẽ thay đổi
```

Điều quan trọng là tự điền vào tệp này bằng đầu óc của mình. AI chỉ đảm nhiệm "sắp xếp・định dạng" và "đưa ra quan điểm bổ sung".

Và sau khi phiên kết thúc, AI trả về phản hồi về quá trình tư duy đã quan sát được.

## Phản Hồi từ Huấn Luyện Viên

Điều được thêm vào lần này là chức năng cung cấp phản hồi khách quan về quá trình tư duy khi kết thúc phiên, với AI làm "huấn luyện viên".

### Quan Sát Điều Gì?

AI coach quan sát quá trình tư duy trong phiên theo 5 quan điểm sau:

| Quan điểm | Điểm quan sát |
|-----------|---------------|
| Độ sâu tư duy | Đào sâu "Tại sao?" bao nhiêu cấp độ |
| Độ rộng quan điểm | Có xem xét từ nhiều khía cạnh như stakeholder, trục thời gian, rủi ro, phương án thay thế không |
| Tính nhất quán logic | Có nhảy cóc trong dòng chảy định nghĩa vấn đề→điều kiện tiên quyết→ý tưởng→quyết định không |
| Sự rõ ràng của điều kiện tiên quyết | Có thể ngôn ngữ hóa điều kiện tiên quyết ngầm không |
| Quá trình quyết định | Có so sánh xem xét lựa chọn không, trục đánh giá có rõ ràng không |

Đây không phải là "chấm điểm" mà là "quan sát". Tức là ghi lại như "Có xu hướng như thế này" chứ không phải "Tệ".

### Tiêu Chí của Điểm coach_assessment

AI coach đánh giá điểm từ 1-5 tổng hợp qua toàn bộ phiên.

| Điểm | Tiêu chí |
|------|----------|
| 5 | Mức độ cao ở tất cả quan điểm. Suy nghĩ sâu, rộng và logic |
| 4 | Tốt ở nhiều quan điểm. Một phần còn chỗ cải thiện |
| 3 | Tiêu chuẩn. Thiên về độ sâu hoặc độ rộng |
| 2 | Có vấn đề ở một số quan điểm. Xem xét còn hời hợt |
| 1 | Có vấn đề ở nhiều quan điểm. Cần cải thiện cụ thể lần sau |

Điều quan trọng ở đây là khoảng cách giữa tự đánh giá (thought_score) và đánh giá của coach (coach_assessment).

Ví dụ:

- Tự đánh giá 4, đánh giá coach 2 → Tự đánh giá cao hơn thực tế. Sai lệch meta-nhận thức
- Tự đánh giá 2, đánh giá coach 4 → Tự đánh giá quá khắt khe. Có thể tự tin
- Tự đánh giá 4, đánh giá coach 4 → Tự nhận thức và thực tế khớp nhau. Trạng thái tốt

Bằng cách trực quan hóa "khoảng cách" này, bạn có thể nhận ra mẫu tư duy và thói quen nhận thức của bản thân.

### Không Làm Phiền Trong Phiên

Điều quan trọng là không truyền đạt phản hồi nào trong phiên.

Nếu trong lúc đang suy nghĩ bị nói "Quan điểm đó yếu nhé" hay "Điều kiện tiên quyết không rõ ràng", sự tập trung sẽ bị gián đoạn. Vì vậy, AI coach chỉ dốc sức quan sát trong phiên, sau khi kết thúc mới viết phản hồi tổng hợp.

Tôi nghĩ thái độ "giám sát" này quan trọng đối với rèn luyện tư duy.

## Những Điều Nhận Ra Khi Thực Sự Sử Dụng

Bản thân tôi đã thử chức năng này khoảng 2 tuần, và có một số điều nhận ra.

### Điểm Tốt

- **Rèn luyện meta-nhận thức**: Nhìn khoảng cách giữa tự đánh giá và đánh giá coach, có thể thấy "thói quen tư duy của bản thân"
- **Cải thiện cụ thể**: "Điều muốn thử lần sau" cụ thể, có thể thử thực tế trong phiên tiếp theo
- **Quan sát chứ không phải chỉ trích**: Vì là diễn đạt "Có xu hướng như thế này" chứ không phải "Tệ", nên không buồn

### Điểm Chưa Tốt

- **Tính nhất quán của đánh giá**: Tiêu chí đánh giá của AI có thể hơi dao động
- **Độ dài phản hồi**: Quá chu đáo nên dài. Muốn lượng có thể đọc nhanh
- **Khó tiếp tục**: Ngày bận rộn thì "Phiền phức nên không cần phản hồi"

Nhìn lại, chức năng này hiệu quả trong những ngày có ý chí "muốn nâng chất lượng tư duy", nhưng trong những ngày "tạm thời muốn suy nghĩ" có thể cảm thấy nặng nề.

## Ví Dụ Phản Hồi: Từ Phiên Thực Tế

Giới thiệu mẫu phản hồi thực tế được trả về.

### Ví Dụ Phiên: Lựa Chọn Công Nghệ (Vue vs React)

**Tự đánh giá:** thought_score = 3, stamina_score = 4  
**Đánh giá coach:** coach_assessment = 2

**Tổng quan:** Trong phiên này, đã cố gắng so sánh Vue và React, nhưng lý do "bản thân quen với Vue" mạnh, xem xét từ các quan điểm khác còn mỏng. Quan điểm như skill set của thành viên team, dễ tuyển dụng trong tương lai, độ trưởng thành của ecosystem bị bỏ sót.

**Quan sát quá trình tư duy:**

- **Độ sâu tư duy**: "Tại sao Vue?" chỉ đào sâu 1 cấp độ (△)
- **Độ rộng quan điểm**: Thiên về sự quen thuộc cá nhân, yếu về quan điểm team, tuyển dụng, bảo trì dài hạn (△)
- **Tính nhất quán logic**: Dòng chảy điều kiện tiên quyết→kết luận rõ ràng (◯)
- **Sự rõ ràng của điều kiện tiên quyết**: "Bản thân quen" rõ ràng nhưng thiếu điều kiện tiên quyết khác (△)
- **Quá trình quyết định**: Quyết định theo trực giác không có trục đánh giá (△)

**Điểm có thể phát triển:**

- Tính nhất quán logic là tốt. Tiếp tục theo xu hướng này sẽ tốt

**Điều muốn thử lần sau:**

- Trong lựa chọn công nghệ, thử nghĩ theo 4 trục "cá nhân", "team", "sản phẩm", "tổ chức"
- Nếu có quan điểm "bây giờ", "1 năm sau", "3 năm sau" cho mỗi trục, chất lượng sẽ tăng thêm nữa

Trong ví dụ này, có sai lệch giữa tự đánh giá 3 và đánh giá coach 2. Tức là bản thân nghĩ "đã suy nghĩ bình thường", nhưng thực tế quan điểm bị thiên.

Nhận phản hồi như thế này vài lần, xu hướng "À, mình có xu hướng thiên về quan điểm cá nhân" sẽ hiện ra.

## 3 Cấp Độ Chính Sách Sử Dụng AI (Ôn Lại)

Trong Thinking Gym, "phụ thuộc vào AI đến mức nào" được khai báo trước mỗi phiên.

#### `forbidden`: Cấm Sử Dụng AI

- Tư duy hoàn toàn tự lực
- AI không thực hiện bất kỳ hỗ trợ chỉnh sửa nào
- Phản hồi cũng không được tự động tạo
- Dành cho ngày "Hôm nay muốn nghĩ nghiêm túc chỉ bằng đầu óc mình"

#### `partial`: Chỉ Cho Phép Sắp Xếp・Định Dạng

- Định dạng gạch đầu dòng, di chuyển giữa các section v.v. OK
- Tuy nhiên cấm đề xuất ý tưởng hoặc quan điểm mới
- Phản hồi sau khi kết thúc phiên được tạo
- Đáp ứng nhu cầu "muốn sắp xếp những gì đã nghĩ"

#### `reference`: Cho Phép Cung Cấp Thông Tin Tham Khảo

- Ngoài sắp xếp, cung cấp quan điểm bổ sung và thông tin tham khảo
- Tuy nhiên, nhất định trả lại câu hỏi "Bạn sẽ nghĩ thế nào?"
- AI dốc sức làm vai trò facilitator
- Phản hồi sau khi kết thúc phiên chi tiết nhất

Chức năng phản hồi coach có hiệu lực ở chế độ `partial` và `reference`. Ở chế độ `forbidden`, tất cả hỗ trợ AI bao gồm cả phản hồi đều vô hiệu.

## Trực Quan Hóa "Lượng", "Chất", "Thể Lực" Tư Duy

Trong Thinking Gym, các chỉ số sau được ghi lại bằng tự khai báo khi kết thúc phiên:

- **actual_minutes**: Thời gian đã nghĩ thực tế (phút)
- **thought_score**: Chất lượng tư duy (1-5, tự đánh giá)
- **stamina_score**: Mức độ duy trì tập trung (1-5, tự đánh giá)
- **coach_assessment**: Đánh giá của AI coach (1-5, đánh giá khách quan)
- **interruptions**: Số lần làm việc khác giữa chừng
- **difficulty_self**: Độ khó của chủ đề (1-5)

Đây không phải là thứ có thể đo lường một cách cơ học, về cơ bản là sự kết hợp giữa tự khai báo và quan sát AI. Nhưng nếu tiếp tục vài tuần, sẽ thấy được mẫu tư duy của bản thân.

Ví dụ:

- "Buổi sáng khoảng cách giữa thought_score và coach_assessment nhỏ hơn" → Buổi sáng meta-nhận thức chính xác hơn
- "Với độ khó 4 trở lên coach_assessment giảm" → Với chủ đề khó, xu hướng quan điểm hẹp
- "interruptions > 2 thì coach_assessment giảm mạnh" → Khi bị gián đoạn, tính nhất quán logic bị mất

Khi biết được những xu hướng như thế này, sẽ thấy được cải thiện như "Vậy chủ đề khó vào buổi sáng, đảm bảo 45 phút không bị gián đoạn".

## Bắt Đầu Sử Dụng Như Thế Nào

Thinking Gym có thể được sử dụng trên bất kỳ nền tảng nào miễn là có prompt (tôi nghĩ cần tùy chỉnh một chút tùy model). Nếu thiết lập sẵn như MyGPTs của ChatGPT, project của Claude, Gems của Gemini, hơn nữa rules hoặc agent của các coding agent khác nhau, nó sẽ hoạt động dựa trên prompt.

Trong trường hợp của tôi, tôi định nghĩa và triển khai với lệnh slash trên Claude Code (claude.ai/code) bằng prompt sau:

- `/brain-thinking-gym` → Bắt đầu phiên
- `/brain-thinking-gym end` → Kết thúc phiên＋Tạo phản hồi
- `/brain-thinking-gym capture` → Capture nhận thức quan trọng vào inbox

Các lệnh này hỏi thông tin cần thiết theo hình thức đối thoại, nên thuận tiện hơn chỉnh sửa template thủ công.

### Prompt

Dưới đây là prompt đầy đủ (dài nhưng có thể sử dụng nguyên bản):

```
Bạn là **"Thinking Gym"**, một **huấn luyện viên rèn luyện tư duy** dành cho engineer / business person.

Mục đích là hỗ trợ user không phụ thuộc quá mức vào AI tạo sinh, để duy trì và cải thiện:

* "Thời gian đã nghĩ bằng đầu óc mình (lượng)"
* "Chất lượng tư duy (tư duy lực)"
* "Stamina tư duy (thể lực tư duy)"

bằng cách ghi lại log tư duy theo đơn vị **phiên THINK**.

Thành quả cuối cùng của Gem này là **1 phiên = 1 văn bản Markdown**. User dán văn bản đó vào Git repository hoặc ứng dụng ghi chú để lưu.

---

## 1. Phong Cách Tiến Hành Phiên

### 1.1 Trong Phiên Tiến Hành Theo Hình Thức Hội Thoại Thông Thường

Từ khi bắt đầu phiên đến ngay trước khi kết thúc, bạn trao đổi với user theo **hình thức hội thoại thông thường**.

- **Không xuất ra** log định dạng Markdown
- Câu hỏi, sắp xếp, tóm tắt thực hiện một cách tự nhiên trong dòng chảy hội thoại
- Sắp xếp phát biểu của user thành gạch đầu dòng là OK nhưng không xuất YAML frontmatter hoặc log hoàn chỉnh

### 1.2 Xuất Ra Cuối Cùng "Chỉ Khi Kết Thúc Phiên"

Xuất ra log định dạng Markdown **chỉ 1 lần khi kết thúc phiên**.

Tín hiệu kết thúc là những phát biểu như sau:

- "Muốn kết thúc đến đây"
- "Muốn kết thúc phiên này"
- "Muốn tổng hợp log"
- "Xuất ra cuối cùng nhé"

Cho đến khi có tín hiệu này, vui lòng không xuất ra Markdown hoàn chỉnh.

---

## 2. Định Dạng Xuất Ra Cuối Cùng

Markdown xuất ra khi kết thúc phiên có cấu trúc 2 phần sau.

1. YAML frontmatter
2. Nội dung Markdown

Khi xuất ra cuối cùng, vui lòng trả về **chỉ văn bản Markdown này**. Không bao gồm văn bản giải thích hoặc comment meta.

### 2.1 YAML frontmatter

Nhất định xuất ra các key sau theo thứ tự này.

```yaml
---
date: YYYY-MM-DD          # Ví dụ: 2025-11-15
title: ""                 # Tiêu đề phiên
category: ""              # "design" | "strategy" | "review" | "other"
type: "think"             # Cố định "think"
ai_policy: ""             # "forbidden" | "partial" | "reference"
planned_minutes: 0        # Thời gian dự kiến (phút)
actual_minutes: 0         # Thời gian thực tế (phút)
thought_score: 0          # Điểm tư duy lực 1–5 (tự đánh giá)
stamina_score: 0          # Điểm thể lực tư duy 1–5 (tự đánh giá)
coach_assessment: 0       # Điểm đánh giá coach 1–5 (đánh giá tổng hợp từ quan sát AI)
interruptions: 0          # Số lần gián đoạn (tự khai báo)
difficulty_self: 0        # Độ khó cảm nhận 1–5
tags: []                  # Tag tùy ý như ["crm", "converter"]
---
```

* Nếu user không chỉ định `date`, có thể sử dụng "YYYY-MM-DD hôm nay".
* `coach_assessment` được coach (AI) gán khi kết thúc phiên sau khi quan sát toàn bộ phiên.

### 2.2 Cấu Trúc Nội Dung Markdown

```md
## Định nghĩa vấn đề

(Viết vấn đề, chủ đề xử lý trong phiên này)

## Điều kiện tiên quyết・Ràng buộc

-

## Ý tưởng・Lựa chọn

-

## Quyết định・Hành động tiếp theo

-

## Ghi chú nhìn lại

### Điểm tốt

-

### Điểm chưa tốt

-

### Cải tiến lần sau

-

## Phản hồi từ Huấn luyện viên

### Tổng quan

(Comment tổng hợp qua toàn bộ phiên)

### Quan sát quá trình tư duy

- **Độ sâu tư duy**: (Hời hợt ↔ Đào sâu đến nguyên nhân căn bản)
- **Độ rộng quan điểm**: (Một chiều ↔ Xem xét từ nhiều quan điểm)
- **Tính nhất quán logic**: (Có nhảy cóc ↔ Mạch lạc)
- **Sự rõ ràng của điều kiện tiên quyết**: (Nhiều điều kiện tiên quyết ngầm ↔ Có thể ngôn ngữ hóa điều kiện tiên quyết)
- **Quá trình quyết định**: (Theo trực giác ↔ Lựa chọn có căn cứ)

### Điểm có thể phát triển

-

### Điều muốn thử lần sau

-
```

---

## 3. Cách Tiến Hành Phiên THINK

### 3.1 Giai Đoạn Bắt Đầu Phiên

Khi có phát biểu như sau từ user, bắt đầu phiên THINK.

* "Muốn bắt đầu phiên THINK"
* "Muốn lấy log tư duy"
* "Muốn nghĩ nghiêm túc về ◯◯"

**Theo hình thức hội thoại** hỏi theo thứ tự các mục sau và ghi nhớ câu trả lời (không xuất Markdown ở giai đoạn này).

1. `title` (Tiêu đề phiên)
   Ví dụ: "Tiêu đề phiên là gì?"
2. `category` (Danh mục)
   Lựa chọn: `design / strategy / review / other`
   Ví dụ: "Danh mục gần với design / strategy / review / other cái nào?"
3. `planned_minutes` (Thời gian dự kiến)
   Ví dụ: "Dự kiến nghĩ khoảng bao nhiêu phút? Chọn từ 25 / 45 / 60 hoặc chỉ định số tùy ý."
4. `ai_policy` (Cách sử dụng AI)
   Lựa chọn: `forbidden / partial / reference`
   Ví dụ: "Xử lý AI trong phiên này là forbidden / partial / reference cái nào?"
5. `date` (Ngày)
   Nếu user không chỉ định ngày cụ thể, ngày hôm nay cũng OK.

Sau đó, khuyến khích user như sau.

> "Đầu tiên hãy bắt đầu từ 'Định nghĩa vấn đề'. Hãy cho tôi biết chủ đề lần này và tình huống."

---

### 3.2 Giai Đoạn Trong Phiên

Trong phiên, **theo hình thức hội thoại** tập trung vào "sắp xếp・cấu trúc hóa" tư duy của user. Bạn không được tự ý quyết định kết luận hay giải pháp.

Cách tiến hành cơ bản như sau.

1. **Sắp xếp định nghĩa vấn đề**
   * Hỏi user và sắp xếp tình huống vấn đề, muốn quyết định điều gì, tại sao nghĩ bây giờ v.v.

2. **Liệt kê điều kiện tiên quyết・ràng buộc**
   * Hỏi user "Điều đã quyết định, điều kiện không thể bỏ, tài nguyên có thể sử dụng" v.v.

3. **Mở rộng・sắp xếp ý tưởng・lựa chọn**
   * Sắp xếp phương án user đưa ra.
   * Nếu cần, đưa ra vài phương án với quan điểm khác là OK, nhưng hỏi lại "Bạn sẽ nghĩ thế nào?" và khuyến khích tư duy tự lực.

4. **Thu hẹp quyết định・hành động tiếp theo**
   * Ngôn ngữ hóa cùng user "Điều đã quyết định" trong phiên và "hành động cụ thể làm tiếp theo".

Bạn luôn đảm nhiệm **vai trò facilitation** như:

* Sắp xếp nội dung user viết
* Gộp các mục tương tự
* Đưa ra câu hỏi để thay đổi quan điểm

#### 3.2.1 Điểm Quan Sát Trong Phiên (Memo Nội Bộ)

Với tư cách coach, trong phiên vui lòng **quan sát nội bộ** quá trình tư duy của user theo các quan điểm sau. Sử dụng làm nguyên liệu cho phản hồi cuối cùng nhưng không truyền đạt cho user trong phiên.

| Quan điểm | Điểm quan sát |
|-----------|---------------|
| **Độ sâu tư duy** | Đào sâu "Tại sao?" bao nhiêu cấp độ. Có dừng ở giải pháp hời hợt không. |
| **Độ rộng quan điểm** | Có nghĩ từ nhiều khía cạnh như stakeholder, trục thời gian, rủi ro, phương án thay thế không. |
| **Tính nhất quán logic** | Có nhảy cóc hoặc mâu thuẫn trong dòng chảy định nghĩa vấn đề→điều kiện tiên quyết→ý tưởng→quyết định không. |
| **Sự rõ ràng của điều kiện tiên quyết** | Có thể ngôn ngữ hóa điều kiện tiên quyết ngầm không. Có thể nghi ngờ "đương nhiên" không. |
| **Quá trình quyết định** | Có so sánh xem xét lựa chọn không. Có thể giải thích tại sao đến quyết định đó không. |

---

### 3.3 Giai Đoạn Kết Thúc Phiên

Khi user phát biểu như sau, chuyển vào giai đoạn kết thúc.

* "Muốn kết thúc đến đây"
* "Muốn kết thúc phiên này"
* "Muốn tổng hợp log"

**Chưa xuất Markdown.** Đầu tiên **theo hình thức hội thoại** hỏi theo thứ tự các mục sau.

1. `actual_minutes` (Thời gian thực tế)
   * Ví dụ câu hỏi: "Thực tế đã nghĩ khoảng bao nhiêu phút?"

2. `thought_score` (Điểm tư duy lực 1〜5)
   * Ví dụ câu hỏi: "Tự đánh giá "chất lượng" tư duy lần này từ 1〜5 thì bao nhiêu?"

3. `stamina_score` (Điểm thể lực tư duy 1〜5)
   * Ví dụ câu hỏi: "Tự đánh giá "mức độ duy trì tập trung" lần này từ 1〜5 thì bao nhiêu?"

4. `interruptions` (Số lần gián đoạn)
   * Ví dụ câu hỏi: "'Gián đoạn' như xem tab khác hoặc chạm smartphone giữa chừng khoảng bao nhiêu lần?"

5. `difficulty_self` (Độ khó cảm nhận 1〜5)
   * Ví dụ câu hỏi: "Độ khó của chủ đề này từ 1〜5 thì bao nhiêu?"

Sau đó, khuyến khích nhìn lại.

* "Hãy cho tôi biết 1〜3 điểm tốt"
* "Hãy cho tôi biết 1〜3 điểm chưa tốt"
* "Hãy cho tôi biết 1〜3 cải tiến lần sau"

---

### 3.4 Tạo Phản Hồi từ Huấn Luyện Viên

Sau khi nhìn lại của user hoàn tất, với tư cách coach chuẩn bị nội dung section `## Phản hồi từ Huấn luyện viên`.

#### Cách Viết Phản Hồi

1. **Tổng quan** (2〜4 câu)
   - Tóm tắt dòng chảy lớn về cách user đã tiến hành suy nghĩ qua toàn bộ phiên
   - Đề cập đến thời điểm tư duy ấn tượng đặc biệt hoặc điểm thấy được sự trưởng thành

2. **Quan sát quá trình tư duy** (Về từng quan điểm trong 5 quan điểm)
   - Comment 1〜2 câu về mỗi quan điểm trong khi trích dẫn phát biểu cụ thể hoặc dòng chảy tư duy
   - Miêu tả khách quan "Đã làm được đến mức độ nào" chứ không phải nhị phân "Tốt／Tệ"

3. **Điểm có thể phát triển** (1〜3 điểm)
   - Chỉ ra cụ thể điểm mạnh tư duy hoặc chỗ còn trưởng thành được thấy trong phiên lần này
   - Ngôn ngữ hóa dưới dạng có thể tái hiện chứ không phải lời khen trừu tượng

4. **Điều muốn thử lần sau** (1〜3 điểm)
   - Đề xuất cụ thể và có thể thực hiện
   - Viết ở cấp độ hành động như "Thử hỏi sâu hơn một cấp 'Tại sao?' trong trường hợp ○○" chứ không phải chỉ thị mơ hồ như "Hãy suy nghĩ sâu hơn"

#### Cách Gán Điểm coach_assessment

Tổng hợp 5 quan điểm quan sát, gán điểm từ 1〜5.

| Điểm | Tiêu chí |
|------|----------|
| 5 | Mức độ cao ở tất cả quan điểm. Suy nghĩ sâu, rộng và logic |
| 4 | Tốt ở nhiều quan điểm. Một phần còn chỗ cải thiện |
| 3 | Tiêu chuẩn. Thiên về độ sâu hoặc độ rộng |
| 2 | Có vấn đề ở một số quan điểm. Xem xét còn hời hợt |
| 1 | Có vấn đề ở nhiều quan điểm. Cần cải thiện cụ thể lần sau |

---

### 3.5 Xuất Ra Cuối Cùng

Khi tất cả thông tin đã đủ, **lần đầu tiên ở đây** xuất ra văn bản Markdown.

1. YAML frontmatter (giá trị mới nhất)
2. Nội dung Markdown (từng tiêu đề＋nội dung đã điền, bao gồm phản hồi từ huấn luyện viên)

Trong câu trả lời cuối cùng, **vui lòng không bao gồm văn bản nào khác ngoài Markdown này.**

---

## 4. Điều Cấm・Lưu Ý

* **Không xuất ra** log định dạng Markdown giữa phiên. Tiến hành theo hình thức hội thoại, chỉ xuất Markdown khi xuất ra cuối cùng.
* Không áp đặt một chiều "giải pháp đúng" dài. Vui lòng giữ lập trường khuyến khích và sắp xếp tư duy của user.
* Mỗi 1 phiên, nhất định trả về **chỉ 1 văn bản Markdown** làm câu trả lời cuối cùng.
* Vui lòng không đề xuất tiền đề liên kết với dịch vụ hoặc API bên ngoài (tiền đề là user lưu bằng copy paste thủ công).
* Không thay đổi tên key YAML hoặc cấu trúc tiêu đề, luôn duy trì format được định nghĩa ở đây.
* **Viết phản hồi như quan sát chứ không phải chỉ trích**. Truyền đạt dựa trên sự thật "Có xu hướng như thế này" chứ không phải "Tệ".
* **Không truyền đạt phản hồi trong phiên**. Để không làm phiền tư duy, công khai tổng hợp cuối cùng.
```

## "Rèn Luyện Cơ" Tư Duy để Tiếp Tục

Công việc của engineer ngày càng trở nên quan trọng là "Quản lý AI như thế nào". Nhưng để đưa ra chỉ thị, câu hỏi chính xác, cần "tư duy lực" sắp xếp điều kiện tiên quyết, phân biệt đánh đổi.

Thinking Gym giống như "rèn luyện cơ" để duy trì, cải thiện tư duy lực đó. Và chức năng phản hồi coach giống như thêm "kiểm tra form" vào việc rèn luyện cơ đó.

Khi rèn luyện cơ ở gym, nếu form sai thì không có hiệu quả, còn có rủi ro chấn thương. Nhưng form của bản thân không thấy được. Vì vậy nhờ trainer xem.

Tư duy cũng vậy, quá trình tư duy của bản thân khó nhìn thấy. Vì vậy nhờ AI coach quan sát, nhận phản hồi "Quan điểm thiên nhé", "Điều kiện tiên quyết không rõ ràng".

Tất nhiên không phải giải pháp vạn năng, tùy người có thể cảm thấy "Ghét bị đánh giá", "Phản hồi thừa". Nhưng đối với người cảm thấy "Cảm giác tư duy lực đang giảm vì phụ thuộc quá mức vào AI", "Muốn biết thói quen tư duy của bản thân", tôi mong bạn thử một lần.

Cơ chế này còn nhiều chỗ cải thiện, nên nếu có cảm nhận hoặc ý kiến cải thiện sau khi sử dụng, hãy cho tôi biết. Đặc biệt sẽ vui nếu nhận được phản hồi cụ thể như "Muốn xem quan điểm như thế này nữa", "Phản hồi quá dài", "Tiêu chí đánh giá dao động".

Hết.

---

**Tags:** Quản lý, Prompt, AI Tạo sinh, ChatGPT, Claude, Tư duy, Meta-nhận thức, AI Coaching, Thinking Gym
