---
title: "Developer Expert Furiya về AI Agent: Phải thay đổi tư duy từ gốc rễ, nếu không sẽ bỏ lại phía sau hoàn toàn"
date: 2025-10-29
categories: ["AI & Machine Learning", "Development", "Business & Technology"]
tags: ["AI-Agent", "CyberAgent", "Developer-Expert", "Flutter", "AI-Driven", "Interview"]
description: "Phỏng vấn Developer Expert Furiya về cách CyberAgent ứng dụng AI Agent, thay đổi tư duy phát triển, và AI Driven Promotion Office. Kinh nghiệm từ lead engineer ABEMA."
---

# Developer Expert Furiya về AI Agent: "Phải thay đổi tư duy từ gốc rễ, nếu không sẽ bỏ lại phía sau hoàn toàn"

**Nguồn:** CyBAR (CyberAgent Internal Blog)  
**Ngày xuất bản:** 29/10/2025  
**Người được phỏng vấn:** 降矢 大地 (Furiya Daichi)  
**Chức vụ:** Engineer tại Appbot SGE Manga Business Division, Developer Expert lĩnh vực Flutter của CyberAgent

---

## Giới thiệu

CyberAgent đang trong quá trình ứng dụng AI Agent ở cấp độ cao nhất với sự lãnh đạo của Furiya, một trong những kỹ sư hàng đầu trong việc tận dụng AI Agent. Để đối phó với sự phát triển và tiến hóa nhanh chóng của AI Agent, công ty đã thành lập "AI Driven Promotion Office" vào tháng 8 để tiến hóa thành tổ chức phát triển đổi mới, nơi kỹ sư và AI Agent cộng tác với nhau.

"AI Driven Promotion Office" tổ chức các "Knowledge Sharing Sessions" với sự tham gia của các kỹ sư được tuyển chọn từ các sản phẩm khác nhau. Khác với các buổi học thông thường, mục đích là đưa kiến thức thu được về sản phẩm của mình và phản hồi lại. Vì vậy, sau 2 tháng, họ phải nộp bắt buộc "Output Report" chi tiết về cách áp dụng vào sản phẩm sau đó, hoặc nếu không thể áp dụng thì rào cản là gì.

---

## Hồ sơ: 降矢 大地 (Furiya Daichi)

**Chức vụ hiện tại:**  
Engineer tại Appbot SGE Manga Business Division  
Developer Expert lĩnh vực Flutter của CyberAgent

**Kinh nghiệm:**
- Gia nhập CyberAgent năm 2012
- Tham gia khởi động ABEMA với vai trò Lead Engineer
- Android Engineer và thành viên Google Developers Expert (GDE) từ năm 2016
- Chuyển sang vị trí hiện tại từ tháng 3/2022

---

## Phần 1: Tình trạng sử dụng AI Agent hiện tại

### Câu hỏi: Hiện tại, bản thân và team "JumpTOON" đang sử dụng AI Agent như thế nào?

**Tỷ lệ tạo code tự động đạt 80%:**

Trong quy trình phát triển hiện tại, tùy thuộc vào kỹ năng người dùng, nhưng khoảng 80% code được AI Agent viết, con người tập trung vào định nghĩa yêu cầu và kiểm tra cuối cùng sản phẩm. Luồng công việc là con người đảm nhiệm 10% đầu tiên, AI Agent 80%, và 10% cuối cùng để tinh chỉnh vi mô và xác nhận. Đây là thay đổi lớn trong năm nay.

**Thách thức với tỷ lệ áp dụng thấp:**

Tuy nhiên, trong công ty vẫn có nhiều kỹ sư chỉ có thể để AI Agent viết chưa đến một nửa số code. Vì vậy, tại Knowledge Sharing Session gần đây, tôi đã nói chi tiết về cách làm thế nào để AI Agent có thể viết gần như toàn bộ code, về prompt engineering và context engineering. AI Agent không phải vạn năng, nên điều quan trọng là con người phải xây dựng quy tắc như thế nào. Nếu bỏ qua điều này, bạn chỉ có thể để AI Agent viết khoảng 20-30% code, hoặc số lần chỉ thị cho AI Agent sẽ tăng lên.

**Khả năng thực tế:**

Hiện tại với AI Agent, việc tạo UI hoàn hảo để có thể sử dụng trong sản phẩm thực tế là khó, nhưng về logic thì gần như có thể phát triển hoàn toàn bằng AI Agent. Nói cách khác, ngoại trừ UI, gần như mọi thứ đều có thể hoàn thành bằng AI Agent. Nếu có người nói "AI Agent vẫn còn nhiều thứ không làm được", thì có khả năng họ chưa sử dụng đúng cách trong công việc coding.

**Tình trạng team:**

Về tình trạng sử dụng của toàn team phát triển "JumpTOON", đối với engineer thì chưa đạt 90%, nhưng tôi nghĩ tỷ lệ sử dụng trong coding cao hơn trung bình của các team khác. Hơn nữa, hiện tại tại Appbot, chúng tôi đang tạo cơ chế kiểm tra mức độ sử dụng AI của từng engineer cá nhân, hiện đang thử nghiệm.

---

## Phần 2: Mindset để đón nhận thay đổi công nghệ lớn

### Câu hỏi: Đối với đổi mới công nghệ lớn như sự xuất hiện của AI Agent, để nhận thức thay đổi một cách tích cực, điều gì bạn chú ý với tư cách là một engineer?

**Xuất phát điểm giống nhau:**

Tôi chỉ bắt đầu sử dụng AI Agent từ năm nay, nên gần như không khác biệt với nhiều engineer khác. Nhưng tôi đã tìm hiểu kỹ lưỡng về AI Agent, suy nghĩ thấu đáo về cách có thể áp dụng vào phát triển của mình cho đến khi thấu hiểu. Không chỉ AI Agent, khi có công nghệ mới xuất hiện, tôi cảm thấy hầu hết mọi người chỉ thử nghiệm sơ sài những gì được cho và không sử dụng tối đa.

**Ví dụ chiếc Ferrari:**

Tuy chỉ là ví dụ, nhưng có nhiều người được cho một công cụ AI hiệu suất cao nhưng không thể khai thác tối đa sức mạnh thực sự của nó. Ví dụ như đang chạy chiếc Ferrari có thể chạy hơn 300 km/h với tốc độ chỉ 40 km/h. Không chỉ giới hạn ở AI Agent, mà tôi nghĩ có nhiều engineer như vậy trong và ngoài công ty. Nếu không sửa đổi căn bản cách suy nghĩ về công nghệ và cơ chế mới, sẽ ngày càng bị bỏ lại phía sau.

**Thay đổi căn bản trong cách làm việc:**

Khác với những đổi mới công nghệ trước đây, sự xuất hiện của AI Agent là thứ thay đổi căn bản cách làm việc. Hơn nữa, trong khi AI Agent đang làm việc, engineer có thể tiến hành song song các task khác, và tốc độ coding cơ bản đã nhanh hơn. Gần đây trong team, chúng tôi đang khuyến khích cách làm việc thực hiện nhiều công việc song song. Ví dụ, trong khi implement chức năng, muốn hướng tới trạng thái có thể tiến hành refactoring và sửa bug song song.

**Thực tế về context switch:**

Tôi cũng nghe có ý kiến rằng context switch khó khăn, nhưng tình hình là trong khi người bị bỏ lại phía sau vẫn tiêu hóa 1 task/người như trước, thì khi nhận ra, xung quanh đang tiến hành 3 cái cùng lúc đã đến gần trước mắt.

---

## Phần 3: Giải quyết lo ngại về hiệu quả

### Lo ngại phổ biến:

Tôi thường nghe lo ngại "không biết có gì ở đầu kia của hiệu quả hóa" hay "công việc mật độ cao sẽ tăng và kiệt sức". Nhưng nếu nói về kinh nghiệm bản thân, thời gian sinh ra từ việc sử dụng AI Agent chắc chắn dẫn đến tăng trưởng của sản phẩm.

**Ví dụ cụ thể:**

Ví dụ, do thời gian coding giảm, có thể dành thời gian cho cải thiện performance, cải thiện sản phẩm, phân tích phản hồi người dùng. Kết quả là chu kỳ phát triển chức năng nhanh hơn, dẫn đến cải thiện độ hài lòng người dùng.

**Mở rộng career:**

Bản thân tôi cũng chưa làm xong việc tích hợp hoàn toàn AI Agent vào quy trình phát triển, nên từ nay về sau còn nhiều việc phải làm như cải thiện tool hoặc nghĩ ra phương pháp mới.

Hơn nữa, bề rộng career của engineer chắc chắn mở rộng. Trước đây chỉ bận rộn với phát triển phần mình phụ trách, nhưng giờ cơ hội giúp đỡ task của các chức năng khác nhiều hơn đã tăng lên. Trong khi AI Agent viết code, có thể nghĩ ý tưởng tiếp theo, hoặc có thể xem xét sâu về lựa chọn công nghệ. Tôi cảm nhận đây chắc chắn dẫn đến nâng cao giá trị thị trường của engineer.

**Triết lý:**

Hiệu quả hóa không phải mục đích, mà là phương tiện để chuyển sang công việc có giá trị cao hơn.

---

## Phần 4: Đối phó với rào cản áp dụng

### Câu hỏi: Tôi hiểu những gì bạn nói rất rõ, nhưng có ý kiến là do bận rộn với công việc trước mắt, hoặc do đặc tính sản phẩm phụ trách mà không thể tận dụng hết AI Agent, vậy điểm này thế nào?

**Giai đoạn chuyển tiếp:**

Hiện tại, AI Agent đang đúng ở giai đoạn chuyển tiếp và giai đoạn vỡ mộng lặp lại. Trong tình huống như vậy, không cần tất cả mọi người đều phải đi đầu để theo kịp thông tin mới nhất hoặc sử dụng triệt để. Nhưng như đã truyền đạt tại Knowledge Sharing Session gần đây, ít nhất những case study thành công chắc chắn ở các sản phẩm khác, tôi muốn mọi người đầu tiên hãy triển khai.

**Vai trò champion:**

Điều hiệu quả nhất là có người đi đầu trong team để thúc đẩy, nhưng nếu không có thì tôi nghĩ mặc dù có nhiều tình huống khác nhau, nhưng nỗ lực thu thập thông tin trong và ngoài công ty là không thể thiếu. Ví dụ, tại "JumpTOON", chúng tôi tận dụng Slack channel chuyên dụng về thông tin liên quan và chia sẻ tích cực kiến thức thu được. Sáng kiến đó đang lan rộng ra toàn team.

**Những bước đầu tiên:**

Đầu tiên thử sử dụng AI Agent từ công việc nhỏ, chia sẻ những nhận biết hàng ngày trong team, những hành động như vậy dẫn đến thay đổi lớn. Hãy bước ra bước đầu tiên theo cách của riêng mình.

---

## Phần 5: Tầm nhìn tương lai

### Câu hỏi: Từ nay về sau, bạn muốn sử dụng AI Agent như thế nào nữa?

**Từ cá nhân đến project:**

Hiện tại, những case study thành công trong việc sử dụng AI Agent còn nhiều ở lĩnh vực cá nhân, nên từ nay muốn tiến hóa sớm lên cấp độ project. Lý tưởng tối cao là trạng thái không cần engineer trong luồng phát triển, con người chỉ thực hiện định nghĩa yêu cầu, còn từ tạo tài liệu đặc tả, coding, testing đều hoàn thành bằng AI Agent.

**Mục tiêu ngắn hạn:**

Đây không phải thứ có thể hướng tới trong 1-2 năm, nhưng team chúng tôi đã đặt mục tiêu kỳ này là đầu tiên tìm ra phương pháp sử dụng tốt hơn AI trong việc tạo và review tài liệu đặc tả. Cũng liên quan đến context engineering, nhưng có tài liệu đặc tả và tài liệu tốt là điều quan trọng nhất trong việc sử dụng AI Agent.

**Thách thức với tool:**

Notion đang sử dụng để tạo tài liệu đặc tả vẫn còn nhiều phần chưa AI-friendly, nên đang chờ đợi tiến hóa hoặc bắt đầu xem xét liệu có thể phát triển tool độc lập của riêng mình để thay thế hay không.

---

## Knowledge Sharing Session

**Ngày diễn ra:** 01/10/2025

**Nội dung:**
- "AI Agent時代の向き合い方" (Cách đối mặt với thời đại AI Agent) - Furiya
- "チームでのAI活用事例" (Case study sử dụng AI trong team) - 國師 誠也 (cũng thuộc JumpTOON)

Tài liệu và video của ngày hôm đó có thể xem tại link được cung cấp.

---

## Liên hệ

**Câu hỏi và tư vấn:**  
AI Driven Promotion Office  
Trưởng phòng: 峰岸 啓人 (Minegishi Keito)

**Hợp tác phỏng vấn:** 降矢 大地 (Furiya Daichi)  
**Public Relations:** 植木 治美, 松村 咲子, 横尾 麻衣

---

## Những câu nói đáng chú ý

> "Nếu không sửa đổi căn bản cách suy nghĩ về công nghệ và cơ chế mới, sẽ ngày càng bị bỏ lại phía sau."

> "Giống như đang chạy chiếc Ferrari có thể chạy hơn 300 km/h với tốc độ chỉ 40 km/h."

> "Ngoại trừ UI, gần như mọi thứ đều có thể hoàn thành bằng AI Agent."

> "Nếu có người nói AI Agent vẫn còn nhiều thứ không làm được, thì có khả năng họ chưa sử dụng đúng cách trong công việc coding."

> "Trong khi implement chức năng, muốn hướng tới trạng thái có thể tiến hành refactoring và sửa bug song song."

> "Trong khi người bị bỏ lại phía sau vẫn tiêu hóa 1 task/người như trước, thì khi nhận ra, xung quanh đang tiến hành 3 cái cùng lúc."

> "Hiệu quả hóa không phải mục đích, mà là phương tiện để chuyển sang công việc có giá trị cao hơn."

> "Đầu tiên thử sử dụng AI Agent từ công việc nhỏ, chia sẻ những nhận biết hàng ngày trong team."

> "Lý tưởng tối cao là trạng thái không cần engineer trong luồng phát triển."

---

## Khuyến nghị thực tiễn

### Cho cá nhân:
1. Nghiên cứu kỹ lưỡng khả năng của AI Agent vượt xa việc thử nghiệm bề mặt
2. Suy nghĩ sâu về cách áp dụng AI Agent vào công việc phát triển cụ thể của bạn
3. Tập trung làm chủ prompt engineering và context engineering
4. Thiết lập quy tắc và context phù hợp cho AI Agent để giảm thiểu lặp lại qua lại
5. Bắt đầu với task nhỏ và từ từ mở rộng việc sử dụng AI Agent

### Cho team:
1. Chỉ định một champion trong team để dẫn đầu việc áp dụng AI nếu có thể
2. Tạo kênh giao tiếp chuyên dụng (ví dụ Slack) để chia sẻ kiến thức AI
3. Ít nhất áp dụng những case study thành công đã được chứng minh từ các sản phẩm khác
4. Chia sẻ insights và bài học hàng ngày trong team
5. Theo dõi mức độ sử dụng AI của từng cá nhân để xác định khu vực cần cải thiện

### Cho tổ chức:
1. Thiết lập các buổi chia sẻ kiến thức với đại diện được chọn từ mỗi sản phẩm
2. Yêu cầu trách nhiệm giải trình thông qua báo cáo output chi tiết về ứng dụng hoặc rào cản
3. Phát triển cơ chế theo dõi mức độ sử dụng AI
4. Đầu tư phát triển tool tài liệu thân thiện với AI nếu tool hiện tại không đủ
5. Đặt mục tiêu ngắn hạn rõ ràng cho việc sử dụng AI Agent ở cấp độ project

---

## Kết luận

Cuộc phỏng vấn với Furiya Daichi cung cấp cái nhìn quý giá về cách một engineer đẳng cấp thế giới đang áp dụng và suy nghĩ về AI Agent. Với tỷ lệ tạo code tự động 80%, workflow 10-80-10, và tầm nhìn về tương lai không cần engineer trong luồng phát triển, Furiya đã chỉ ra rõ ràng rằng AI Agent không chỉ là trend tạm thời mà là cuộc cách mạng căn bản trong cách làm việc của engineer.

Điều quan trọng nhất không phải công nghệ, mà là mindset. Như Furiya đã nói, nếu không thay đổi cách suy nghĩ từ gốc rễ, chúng ta sẽ bị bỏ lại phía sau. Nhưng may mắn là, con đường để bắt kịp không quá khó - chỉ cần bắt đầu từ những task nhỏ, học hỏi từ những case study thành công, và chia sẻ kiến thức trong team.

Hiệu quả hóa không phải là mục đích cuối cùng, mà là phương tiện để chúng ta có thể tập trung vào những công việc có giá trị cao hơn, mở rộng career, và đóng góp nhiều hơn cho sản phẩm và tổ chức. Đây chính là tinh thần đích thực của việc làm việc cùng AI Agent.

---

**Nguồn:** CyBAR - CyberAgent Internal Blog  
**URL:** https://cybar.cag.isca.jp/?p=136484  
**Ngày xuất bản:** 29/10/2025  
**Thể loại:** AI, Technology, Interview
