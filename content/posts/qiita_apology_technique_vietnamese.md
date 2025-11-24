# Kỹ Thuật "Không Xin Lỗi Quá Nhiều"

**Tác giả:** y_o_28  
**Ngày xuất bản:** 21/11/2025  
**Ngày cập nhật:** 22/11/2025  
**URL gốc:** [「謝罪」しすぎない技術](https://qiita.com/y_o_28/items/4f3bd30f1f0a8fe4c21e)

## 1. Mở đầu: Tại sao kỹ sư lại "xin lỗi" quá nhiều?

Ở hiện trường phát triển, câu "xin lỗi" (sumimasen) thường thoát ra vô thức như một thói quen nói.  
Bạn có cảm thấy quen thuộc không? Tôi thì có... haha

Khi nộp tài liệu chậm một chút, khi bắt đầu cuộc họp, khi nhận phản hồi từ đối phương, hoặc khi nhờ vả các team khác.  
**"Lời xin lỗi phản xạ"** này, liệu có thực sự xuất phát từ sự khiêm tốn?  
Hay nó đã trở thành một công cụ tiện lợi để tự bảo vệ mình?

Những kỹ sư nghiêm túc và có trách nhiệm càng dễ rơi vào tình trạng "lời xin lỗi như công cụ" này, và nó không chỉ dừng lại ở vấn đề giao tiếp đơn thuần.

Việc xin lỗi quá mức khiến:

- **Không thể từ chối yêu cầu quá mức**, trở thành người luôn nuốt mọi yêu cầu.
- Bị nhìn nhận là "người hay xin lỗi", **ý kiến từ góc độ chuyên môn kỹ sư bị xem nhẹ** (phát ngôn với tư cách chuyên gia suy giảm, bị cuốn theo).

Kết quả, không chỉ làm tổn hại niềm tin của bản thân, mà còn làm giảm độ tin cậy của team (công ty), gánh vác khối lượng công việc không hợp lý, dẫn đến vận hành dự án không lành mạnh.

Trong bài viết này, tôi sẽ đào sâu vào **tác hại** của việc xin lỗi quá mức và **các vấn đề cụ thể ở hiện trường**.  
Đồng thời viết về giá trị mà "kỹ thuật không xin lỗi quá mức" mang lại để giành được lòng tin với tư cách là một kỹ thuật viên (bất kể lĩnh vực phụ trách).

※Tôi chỉ đề cập đến "lời xin lỗi quá mức", tôi hoàn toàn hiểu rằng lời xin lỗi chân thành trong tình huống thích hợp cũng là trách nhiệm và là điều cần thiết. Mong bạn đọc bài viết với quan điểm này.

## 2. "Chi phí của lời xin lỗi": Sự suy giảm tự đánh giá và lòng tin

Lời xin lỗi thiếu thận trọng sẽ vô thức làm giảm đánh giá của bản thân về chính mình và đánh giá từ người khác.

### 2-1. Vấn đề nội tại: Sự suy giảm "tự hiệu lực" (self-efficacy) của bản thân với tư cách kỹ sư

**Tự hiệu lực** là sự tự tin rằng "tôi có khả năng đạt được mục tiêu", gắn liền với năng lực giải quyết vấn đề khi đối mặt thử thách.

Tuy nhiên, nếu lặp đi lặp lại "lời xin lỗi" đối với các sự kiện không liên quan đến năng lực kỹ thuật hay phán đoán của mình (nói cách khác, khi bản thân không phải nguyên nhân vấn đề), ví dụ như "thay đổi yêu cầu đột ngột" hay "thay đổi specification", não bộ dần học một cách sai lầm rằng **"nguyên nhân vấn đề = chính mình"**.

Quá trình học này dẫn đến **sự suy giảm mãn tính trong tự đánh giá**, làm giảm động lực thử thách của bản thân.  
Nền tảng tâm lý gây ra **hội chứng kiệt sức mãn tính** được hoàn thiện, và bản thân tự thu hẹp phạm vi sự nghiệp.

ref: https://studyhacker.net/albert-bandura

### 2-2. Vấn đề bên ngoài: "Quy kết nguyên nhân gốc" của người khác và mất ảnh hưởng

Theo **lý thuyết quy kết** trong giao tiếp, người khác có xu hướng tìm nguyên nhân sự việc ở "nội nhân (năng lực, nỗ lực cá nhân)" hoặc "ngoại nhân (môi trường, vận may, độ khó)".

Hành động xin lỗi một cách hời hợt khiến đối phương có nguy cơ quy nguyên nhân vấn đề về **"nội nhân (thiếu năng lực từ góc nhìn của đối phương)"**.

Ngay cả khi vấn đề xuất phát từ hạn chế kỹ thuật hay sự mơ hồ của specification, ý kiến của bạn sẽ bị coi là "lời biện minh từ người kém năng lực".  
Kết quả, **ý kiến với tư cách kỹ sư chuyên nghiệp bị xem nhẹ**, và **"điều muốn truyền đạt"** như "về mặt kỹ thuật khó nên đề xuất phương án tiếp theo" hay "nên chấp nhận ràng buộc này" không được nghe theo.  
Và khi không thể tiếp cận vấn đề ban đầu muốn giải quyết, dù nói điều đúng cũng bị xem là yếu tố cản trở tiến độ dự án với câu "người này không giải quyết được gì".

ref: https://daredemotukaeru.web.2nt.com/51.html

## 3. Các vấn đề cụ thể trong team do xin lỗi quá mức

Chi phí tâm lý biểu hiện thành nợ cụ thể ở hiện trường phát triển.  
Điều này dẫn đến kiệt sức của bản thân với tư cách người thực thi và sự bất lực trong quản lý dự án.

### 3-1. Nghe theo yêu cầu quá mức: Phát sinh Scope Creep

Lời xin lỗi vô thức gửi thông điệp "tôi ở vị trí yếu" và "tôi sẽ chấp nhận mọi yêu cầu của bạn" đến đối phương.  
Thái độ này tạo ra **kỳ vọng và thiên kiến nhận thức** từ phía khách hàng rằng "người này sẽ không từ chối".  
Đồng thời, vì không tự tin, bạn cũng tự áp thiên kiến "điều đối phương nói có lẽ đúng hơn".

Ở hiện trường, khi được hỏi "có thể thêm tính năng này không?" ngay trước deadline, nếu trả lời "**xin lỗi**, khó đấy", đối phương sẽ hiểu là "dù nói khó nhưng vì họ xin lỗi nên sẽ chấp nhận, lỗi thuộc về họ nên họ phải chấp nhận".

Điều này dẫn đến **mở rộng phạm vi, cuối cùng gây kiệt sức cho thành viên team và thất bại dự án**.  
Để vận hành dự án và team lành mạnh, cần và có trách nhiệm nói "No" với tư cách chuyên gia.

Nếu gượng ép trả lời "YES" mà kết quả không thực hiện được, bạn không đem lại giá trị cho khách hàng như mong muốn ban đầu, mà chỉ làm kiệt sức thành viên team, tạo ra tình huống không ai được lợi.

### 3-2. "Tự bảo vệ" qua lời xin lỗi làm chậm Next Action

Khi vấn đề lộ ra trong cuộc họp, lời xin lỗi có thể trở thành **phương tiện tự vệ, bảo vệ bản thân** để "giảm căng thẳng tại chỗ và tránh bị truy cứu".  
Bằng cách xin lỗi để xoa dịu cảm xúc bản thân, tình huống **từ bỏ thảo luận bản chất** xuất hiện.

Ví dụ, công việc của bạn bị chậm tiến độ.  
Lý do chậm là do thay đổi yêu cầu đột ngột hoặc tốc độ ra quyết định chậm của stakeholder.  
Tuy nhiên, nếu kết thúc cuộc trò chuyện bằng "**xin lỗi**, chúng tôi bị chậm tiến độ, thực sự xin lỗi...", thì **nguyên nhân gốc rễ của sự chậm trễ** là khác, nhưng thảo luận về **"Why (tại sao?)"** liên quan đến vấn đề thực (thay đổi yêu cầu đột ngột hoặc tốc độ quyết định chậm) sẽ không được đề cập.

Kết quả, kết luận cuộc họp chỉ còn lại những **Next Action** không có kết luận như "sẽ kiểm tra sau" hay "sẽ xem xét lại".  
Giải quyết căn bản vấn đề trở nên xa vời, dẫn đến tình thế **cuối cùng chẳng tiến triển gì**.

Lời xin lỗi để tự bảo vệ không chỉ trì hoãn vấn đề, mà kết quả là bản thân trở thành một phần nguyên nhân gây chậm tiến độ dù ban đầu không phải là nguyên nhân.

### 3-3. Không thể thảo luận bản chất: Che giấu rủi ro và ràng buộc

Trách nhiệm của chuyên gia là tiết lộ rõ ràng các ràng buộc kỹ thuật và rủi ro, đồng thời đưa ra giải pháp.  
Tuy nhiên, người có thói quen xin lỗi thường bắt đầu bằng lời xin lỗi khi truyền đạt thông tin tiêu cực.

Khi lời xin lỗi đi trước, thông tin quan trọng về **ràng buộc và rủi ro** muốn truyền đạt chỉ bị coi là **"lý do không thể làm"** đơn thuần, và không được xem xét nghiêm túc.

So với "**xin lỗi**, thiết kế này có rủi ro bảo mật cao", câu "nếu áp dụng thiết kế này, rủi ro bảo mật sẽ tăng. Tôi khuyến nghị phương án thay thế A" sẽ tăng **trọng lượng thông tin**.  
Lời xin lỗi có thể trở thành một trong những yếu tố xóa tan trọng lượng của chủ trương kỹ thuật.

### 3-4. Trở thành "sám hối" thay vì báo cáo: Bóp méo và chậm trễ thông tin

Việc lặp đi lặp lại lời xin lỗi làm tăng rào cản tâm lý khi báo cáo vấn đề, và báo cáo bản thân trở thành hành vi tiêu cực là "sự kiện để bị khiển trách (sám hối)".

Từ động cơ "không muốn bị mắng", kỹ sư sẽ **trì hoãn báo cáo cho đến khi tình hình nghiêm trọng**, hoặc **bóp méo** nội dung báo cáo theo hướng có lợi cho mình.  
Như vậy, stakeholder không thể nắm bắt chính xác tình hình, mất thời điểm **ra quyết định** thích hợp, và vấn đề phát triển thành tổn thương chí mạng.

## 4. Thay đổi từ hôm nay!: Kỹ thuật thay "lời xin lỗi" bằng "đồng cảm, sự thật, đề xuất"

Đối thoại chuyên nghiệp không nên xây dựng trên lời xin lỗi cảm tính, mà trên **đồng cảm**, **sự thật (bằng chứng)** và **hành động (đề xuất)**.  
Hãy xây dựng mối quan hệ bình đẳng bằng framework ba trong một này.

| Tình huống muốn tránh xin lỗi | Ví dụ xấu (xin lỗi cảm tính) | Ví dụ tốt (đồng cảm, sự thật, đề xuất) | Mục đích |
|---|---|---|---|
| **Rủi ro chậm deadline** | "**Xin lỗi chân thành**, chúng tôi bị chậm hơn dự định" | **Đồng cảm:** "Rất tiếc không đáp ứng kỳ vọng,"<br>**Sự thật:** "Hiện tại, phát hiện độ phức tạp ngoài dự kiến trong thiết kế khi triển khai tính năng 〇〇."<br>**Đề xuất:** "Xin hãy quyết định giữa phương án B (cắt giảm tính năng) để đảm bảo deadline, hoặc phương án A (duy trì chất lượng) để gia hạn X ngày." | **Nắm quyền chủ động với tư cách chuyên gia**: Thúc đẩy thảo luận dựa trên sự thật và đề xuất (lựa chọn) thay vì cảm xúc.<br>Không chỉ nói rằng mình (team) có lỗi rồi kết thúc, mà trình bày sự thật khách quan. |
| **Từ chối yêu cầu khó** | "**Xin lỗi**, điều đó khó..." | **Đồng cảm:** "Tôi hiểu bối cảnh yêu cầu của bạn."<br>**Sự thật:** "Khi liên kết với tính năng hiện tại, việc triển khai tính năng này sẽ thay đổi toàn bộ yêu cầu gốc."<br>**Đề xuất:** "Vì yêu cầu đã thay đổi so với ban đầu, tôi muốn sắp xếp lại yêu cầu rồi mới thảo luận về khả năng thực hiện." | **Chủ trương chuyên môn**: Không chỉ từ chối đơn thuần mà đưa ra phương án thay thế (hoặc tiếp cận để đưa ra), phát biểu hướng giải quyết vấn đề để xác lập vị trí chuyên gia. |
| **Chậm trễ do lỗi người khác** | "**Xin lỗi**, liên kết bị chậm" | **Sự thật:** "Liên kết từ bộ phận XX bị chậm trễ."<br>**Đề xuất:** "Để phòng tránh tái phát, đề xuất đặt deadline liên kết vào **ngày 〇〇**." | **Mối quan hệ bình đẳng và phòng tránh tái phát**: Không gánh trách nhiệm quá mức, tập trung vào biện pháp cải thiện mang tính xây dựng.<br>※Tuy nhiên, nếu đối phương là khách hàng, tình hình nội bộ không liên quan nên cần xin lỗi chân thành.<br>Không phải xin lỗi bản thân là xấu, mà nếu xin lỗi rồi kết thúc thì không sinh ra gì. |

## 5. Kết luận: "Trách nhiệm" của chuyên gia không phải là xin lỗi mà là "giải quyết vấn đề"

Trách nhiệm của kỹ sư chuyên nghiệp không phải là hoàn hảo, mà là **đưa ra giải pháp nhanh nhất, hiệu quả nhất và phòng tránh tái phát** đối với vấn đề phát sinh.

Hãy bỏ thói quen xin lỗi quá mức và thay bằng lời nói có kèm hành động.

- **"Xin lỗi"** (tài liệu bị chậm) → **"Xin lỗi đã để bạn đợi tài liệu, đây ạ"**
- **"Xin lỗi"** (tôi sẽ kiểm tra) → **"Tôi hiểu rồi, tôi sẽ kiểm tra trước 〇〇"**

Tôi cảm thấy rằng chuyển sang **đối thoại mang tính xây dựng** dựa trên kiến thức tâm lý sẽ đồng thời nâng cao **ảnh hưởng với tư cách chuyên gia** của bản thân và **năng suất của team**.  
Đừng quên rằng niềm tin không sinh ra từ lời xin lỗi mà từ năng lực giải quyết vấn đề, và bản thân tôi cũng sẽ cố gắng tinh thần để ứng xử như một chuyên gia.

※Thật ra, bản thân tôi còn nhiều điều chưa làm được dù đã viết ra, nên tôi muốn ghi khắc như một lời răn.

※Cuối cùng, không phải việc xin lỗi bản thân là xấu.  
Như đã nói ở đầu, khi rõ ràng có lỗi thì nên xin lỗi với thành ý,  
Và trong phát triển hệ thống khi trách nhiệm phân tán giữa nhiều người, nếu việc mình xin lỗi giúp công việc dễ dàng hơn thì đó cũng là một phương tiện.  
Tuy nhiên, theo quan điểm cá nhân của tôi, điều nên thảo luận thông qua phát triển là "điều muốn đạt được" và "tạo ra giá trị".  
Trong những lúc như vậy, tôi nghĩ "lời xin lỗi quá mức" khiến lệch khỏi điều nên làm thì thật lãng phí.

---

**Người dịch:** GitHub Copilot
