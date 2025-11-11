---
title: "[Phỏng Vấn] Khi Độ Chính Xác AI Tăng 1%, Giá Trị Khách Hàng Là Bao Nhiêu? - freee và Chuyển Đổi AI Native"
date: 2025-11-11
draft: false
categories:
  - "AWS"
  - "AI/ML"
  - "Case Study"
tags:
  - "AI"
  - "Amazon Bedrock"
  - "LLM"
  - "Generative AI"
  - "freee"
  - "AI Native"
  - "Machine Learning"
author: "Keisuke Kisamori, Kensuke Fukumoto"
translator: "日平"
description: "Phỏng vấn freee về chuyển đổi AI Native: Framework 'Tiêu Chí Thành Công', tách biệt chi phí xác nhận và sửa chữa, cam kết ban lãnh đạo và ứng dụng Amazon Bedrock"
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/freee-ai-native-transformation/)

---

## Tổng Quan

Với sứ mệnh "Biến Doanh Nghiệp Nhỏ Thành Nhân Vật Chính của Thế Giới", freee Inc. đã vẽ ra tầm nhìn "AI CFO" ngay từ khi thành lập. Với sự xuất hiện của LLM (Large Language Models - Mô hình Ngôn ngữ Lớn), công ty đã bắt đầu chuyển đổi toàn diện sang tổ chức AI native sử dụng AI sinh tạo. Bằng cách lựa chọn công nghệ, xây dựng cấu trúc tổ chức và đặc biệt là thiết lập framework độc đáo "Tiêu Chí Thành Công", freee đã thúc đẩy việc ứng dụng AI trong toàn công ty. Công ty đã đạt được những thành tựu vững chắc như cải thiện tỷ lệ giải quyết hỗ trợ chat khoảng 50%, cải thiện hiệu suất bán hàng đáng kể, và cải cách cấu trúc trong dịch vụ BPaaS (Business Process as a Service). Chúng tôi đã phỏng vấn ông Kisamori, AI Product Manager, về toàn bộ quá trình chuyển đổi này.

---

## Xây Dựng Tổ Chức và Các Hoạt Động Để Thực Hiện "AI Native"

### Tầm Nhìn về Nền Tảng Quản Lý Kinh Doanh Tích Hợp

**──Đầu tiên, vui lòng cho biết tổng quan về doanh nghiệp freee và vị trí của việc ứng dụng AI.**

**Ông Kisamori:** freee hoạt động với sứ mệnh "Biến Doanh Nghiệp Nhỏ Thành Nhân Vật Chính của Thế Giới" và cung cấp nền tảng quản lý kinh doanh tích hợp. Không chỉ là phần mềm kế toán đơn thuần, chúng tôi tích hợp toàn bộ công việc văn phòng back-office và hỗ trợ quản lý kinh doanh.

Thực ra, tên công ty tiền thân của freee trong 1 năm là "CFO Inc.". Đây không phải là "Chief Financial Officer" mà là "Cloud Finance Officer", thể hiện mong muốn tạo ra dịch vụ có thể trở thành CFO cho mọi doanh nghiệp từ cloud. Người sáng lập Sasaki đã vẽ ra tầm nhìn tương lai với khái niệm "AI CFO", và đây chính là nguồn gốc của chiến lược AI hiện tại.

Tầm nhìn "tự động hóa" từ khi thành lập đã phát triển mạnh mẽ với sự xuất hiện của LLM. Từ năm nay, chúng tôi đã bắt đầu chính thức chuyển đổi sang "AI Native Company". Đối với chúng tôi, AI sinh tạo, đặc biệt là AI agent, được định vị là công cụ để lấp đầy khoảng cách cuối cùng nhằm thực hiện "tự động hóa" mà chúng tôi đã mong ước từ khi thành lập. Bằng cách giải quyết các vấn đề về giao tiếp và triển khai-sử dụng mà trước đây khó có thể hệ thống hóa, doanh nghiệp nhỏ có thể tự động hóa công việc một cách tự nhiên và mượt mà mà không cần ý thức về kỹ năng đặc biệt. Chúng tôi đang tăng tốc các hoạt động trong toàn công ty hướng tới việc thực hiện thế giới đó.

### Cấu Trúc Tổ Chức AI Lab: Nhóm Chuyên Gia Hỗ Trợ Xuyên Suốt

**──freee thúc đẩy việc ứng dụng AI với cấu trúc tổ chức như thế nào?**

**Ông Kisamori:** Chúng tôi thúc đẩy bằng tổ chức cross-functional có tên AI Lab. Các thành viên có chuyên môn về ML (Machine Learning - học máy) tập hợp lại, đến làm việc với các team sản phẩm theo chiều dọc và cùng nhau triển khai tính năng AI.

Trước khi LLM xuất hiện, chúng tôi tập trung vào ML cổ điển như OCR (Optical Character Recognition - nhận dạng ký tự quang học) và dự đoán mục kế toán bằng cách huấn luyện mô hình. Tuy nhiên, sau khi LLM xuất hiện, vai trò đã thay đổi lớn. Phạm vi hoạt động đã mở rộng bao gồm phát triển xung quanh RAG (Retrieval-Augmented Generation - sinh tạo tăng cường truy xuất), "hoạt động enablement" cho các sản phẩm, và xây dựng nền tảng LLM.

Từ đầu năm nay, SLM (Small Language Models - mô hình ngôn ngữ nhỏ) bắt đầu được chú ý và tầm quan trọng của fine-tuning được nhận thức lại, giá trị của chuyên môn ML được xác nhận lại. Đối với các tính năng cốt lõi của freee như đọc biên lai, fine-tuning SLM chuyên biệt cho task cho độ chính xác cao hơn mô hình tổng quát. Khi thực tế thử nghiệm, ngoài cải thiện độ chính xác, response còn nhanh hơn rất nhiều và chi phí cũng rẻ hơn. Chúng tôi chú trọng việc sử dụng mô hình tối ưu phù hợp với từng trường hợp.

**──Nghe xong tôi hiểu rằng freee có thể thực hiện fine-tuning có độ khó cao về mặt kỹ thuật và chuyên môn là nhờ có team chuyên gia học máy từ trước và có nền tảng đó.**

### Kết Nối Kỹ Thuật và Kinh Doanh: Vai Trò của AI Product Manager

**──Vui lòng cho biết bản thân ông Kisamori đảm nhận vai trò gì tại freee.**

**Ông Kisamori:** Tôi thuộc AI Lab và hoạt động với vai trò "AI Product Manager". Đây là vai trò thúc đẩy tạo giá trị cho người dùng thông qua việc ứng dụng AI, trên cơ sở hiểu biết cả hai mặt kỹ thuật và kinh doanh.

Background của tôi là sau khi lấy bằng tiến sĩ vật lý, tôi chuyển sang nghiên cứu thuật toán học máy và nghiên cứu tại doanh nghiệp. Sau đó, tôi cũng có kinh nghiệm khởi nghiệp để thương mại hóa thuật toán mình phát triển. Sự hiểu biết về kỹ thuật và kinh nghiệm kinh doanh này đang phát huy trong vai trò hiện tại.

Vai trò cụ thể có 3 phần lớn. Thứ nhất, hợp tác chặt chẽ với ban lãnh đạo để xác định "vấn đề cần giải quyết". Xác định lĩnh vực có tác động lớn đến kinh doanh trong khi đánh giá tính khả thi về mặt kỹ thuật. Thứ hai, với tư cách là người thực hiện, tạo ra từ zero đến một cho dự án mới trong lĩnh vực đã xác định. Thực hiện nhanh từ lập kế hoạch đến prototyping ban đầu để chứng minh khả năng, và hoàn thành đến khi release. Thứ ba, tham gia với vai trò reviewer vào các dự án ứng dụng AI mà các team sản phẩm bắt đầu từ bottom-up, hỗ trợ xây dựng tiêu chí thành công và tư vấn phương pháp đánh giá.

**──Ông hỗ trợ các hoạt động của từng team như thế nào?**

**Ông Kisamori:** Chúng tôi vận hành song song nhiều cơ chế.

Đầu tiên, chúng tôi tạo ra một nơi gọi là "AI Salon". So với vài năm trước, ý thức đã thay đổi khá nhiều, nhưng có những người phụ trách sản phẩm nghĩ đến AI như một phương tiện cho vấn đề muốn giải quyết nhưng không biết phương pháp cụ thể hoặc cách tiến hành. Chúng tôi vận hành với thái độ "Chào mừng brainstorm, tôi sẽ chia sẻ kiến thức cho bạn".

Ngoài ra, chúng tôi đã tổ chức các buổi học và hackathon cho các team sản phẩm. Cũng có những buổi học và hands-on nhận được sự hợp tác từ AWS.

Hơn nữa, để tránh việc phụ thuộc vào cá nhân, tôi cẩn thận viết ra những gì mình nghĩ và học được, và tạo thành tài liệu. Trong nội bộ, chúng tôi xây dựng ứng dụng LLM cho tài liệu đó ăn vào, để ai cũng có thể dễ dàng truy cập kiến thức. Việc cơ chế hóa như vậy là không thể thiếu để mở rộng quy mô know-how của AI Lab và nâng cao khả năng AI literacy của toàn tổ chức.

### Kết Quả Cụ Thể từ Việc Ứng Dụng AI

**──Những kết quả nào đã đạt được từ việc ứng dụng AI cho đến nay?**

**Ông Kisamori:** Có một số ví dụ tiêu biểu.

Đầu tiên, trong việc ứng dụng LLM cho hỗ trợ chat, chúng tôi đã cải thiện tỷ lệ giải quyết câu hỏi khoảng 50%. Đây là kết quả từ các nỗ lực từ giai đoạn đầu năm 2023.

Trong hỗ trợ bán hàng, chúng tôi đã xây dựng hệ thống AI "Tsubame AUTO" tự động tóm tắt nội dung cuộc họp nội bộ và bên ngoài và nhập thông tin vào CRM. Với hệ thống này, chúng tôi đã giảm 45.2% thời gian xử lý sau đàm phán và 56.2% thời gian xử lý sau cuộc gọi. Nhờ đó, hiệu suất bán hàng đã cải thiện đáng kể và vào mùa hè năm nay, chúng tôi đã nhận được đánh giá từ bên ngoài của Forbes*.

*Forbes JAPAN NEW SALES OF THE YEAR2025 "Giải thưởng AI Transformation"

Ngoài ra, còn có tính năng "AI Quick Explanation" mà chúng tôi đã báo cáo kết quả trong chương trình thúc đẩy triển khai thực tế AI sinh tạo của AWS. Đây là tính năng hỗ trợ phân tích dữ liệu tài chính, giúp giảm gánh nặng công việc hàng tháng từ vài giờ trở lên cho junior staff và vài giờ cho senior staff.

Chúng tôi đã làm việc trên nhiều sáng kiến khác nhau. Hiện tại, chúng tôi đang tập trung nhất vào công nghệ liên quan đến OCR sử dụng AI agent tập trung vào dịch vụ BPaaS.

---

## Các Yếu Tố Hỗ Trợ Thành Công

### Yếu Tố Lớn Nhất: Sự Hiểu Biết Sâu Sắc và Cam Kết của Ban Lãnh Đạo

**──Ông nghĩ yếu tố nào đã tạo ra những kết quả này?**

**Ông Kisamori:** Tôi có thể trả lời ngay mà không do dự. Đó là "sự hiểu biết và cam kết mạnh mẽ của ban lãnh đạo cao nhất về AI".

Ban lãnh đạo freee, bất kể có background kỹ thuật hay không, không chỉ tự sử dụng AI mà còn tự mình gọi API và thử triển khai bằng công cụ AI coding. Tôi cũng từng được CEO Sasaki gọi đến và hỏi "Tôi đã tạo cái này bằng Cline (công cụ AI coding) nhưng độ chính xác không tăng, tôi nên làm gì?" (cười).

Chính nhờ có sự hiểu biết này, chúng tôi có nhận thức chung rằng việc sử dụng AI là điều tất yếu, hoặc đúng hơn là phải tiến hành với ý thức nguy cơ.

**──Chúng tôi cũng cảm nhận rõ nhiệt huyết của ban lãnh đạo công ty. Vui lòng cho biết bối cảnh dẫn đến sự hiểu biết sâu sắc như vậy của ban lãnh đạo.**

**Ông Kisamori:** Đó là khoảng cách với toàn cầu. Khi theo dõi các công ty mà freee benchmark, thấy họ đầu tư bao nhiêu vào AI, điều đó đã dẫn đến ý thức nguy cơ. Đó là cơ hội để ban lãnh đạo dành thời gian tự mình làm việc.

**──Thật tuyệt vời khi ban lãnh đạo có sự hiểu biết sâu sắc. Ngoài sự hiểu biết của ban lãnh đạo, từ góc độ mở rộng việc ứng dụng AI ở hiện trường ra toàn tổ chức thì sao?**

**Ông Kisamori:** Đúng như bạn nói. Không chỉ ban lãnh đạo, mà trước hết, việc văn hóa thách thức ăn sâu vào toàn doanh nghiệp là quan trọng. Tại freee có tư duy "Maji-chi" (giá trị thực sự), trong đó có phương châm gọi là "Output→Thinking". Đây là phương châm 'Trước tiên, tạo output. Sau đó suy nghĩ và cải thiện.' Thất bại không bị trách móc, mà dám làm/thách thức được khuyến khích. Ngoài văn hóa này, cơ chế tổ chức để thúc đẩy việc ứng dụng AI là quan trọng.

※Maji-chi: Làm điều có thể tự tin nói là có giá trị bản chất cho người dùng

**──Tại AWS cũng có Leadership Principle "Customer Obsession (ám ảnh khách hàng)", trân trọng văn hóa thách thức vì khách hàng và học hỏi từ thất bại. Cũng có tư duy "Bias for Action (chú trọng hành động)" đánh giá việc chấp nhận rủi ro có tính toán. Tôi cảm nhận lại rằng chính nhờ có nền tảng văn hóa như vậy, việc thách thức công nghệ mới như AI mới lan rộng ra toàn tổ chức.**

### Thiết Lập Framework "Tiêu Chí Thành Công"

**──Những sáng kiến nào đã được thực hiện để thấm nhuần việc ứng dụng AI vào toàn tổ chức?**

**Ông Kisamori:** Gần đây, điều tôi đặc biệt chú trọng là xây dựng và thấm nhuần "tiêu chí thành công". Có thể đây là điều thường được nói đến, nhưng sau một vòng, tôi tin chắc rằng việc triệt để điều này ở trạng thái đã được cải tiến vào tổ chức là quan trọng nhất.

Tiêu chí thành công là chỉ số kết nối rõ ràng giữa chỉ số chất lượng như độ chính xác với giá trị khách hàng và tác động kinh doanh. Cụ thể là định lượng hóa các yếu tố kỹ thuật như chi phí, độ chính xác, latency, chất lượng tạo ra bao nhiêu giá trị người dùng.

**──Cụ thể là định lượng hóa như thế nào?**

**Ông Kisamori:** Tôi hỏi team phụ trách "Khi độ chính xác tăng 1%, giá trị của người dùng tăng bao nhiêu?". Hãy suy nghĩ về điều này.

Câu hỏi này không dễ trả lời. Nhưng chỉ khi có đủ cả hai mặt là hiểu biết đầy đủ về khách hàng và hiểu biết đầy đủ về kỹ thuật thì mới có thể trả lời. Việc xác định trước điều này là quan trọng.

Anti-pattern thường gặp là team phụ trách nói "Chúng tôi nhắm đến độ chính xác 90%!". Tôi nhất định hỏi lại. "Đo chỉ số gì như thế nào mà ra 90%? Khi đạt 90% thì giá trị người dùng nào sẽ xuất hiện?" (cười).

**──Vì kiến thức về business và tech nằm rải rác qua các tổ chức nên thật khó để căn chỉnh câu trả lời này đúng không.**

**Ông Kisamori:** Chính xác. Chính vì vậy mà tổ chức cross-functional như AI Lab mới phát huy tác dụng. Trong thời đại tới, tôi nghĩ sẽ ngày càng cần nhiều hơn những nhân tài có thể hiểu cả business và kỹ thuật, mô hình hóa nghiệp vụ của user một cách data-driven, đặt milestone và quản lý dự án.

### Kiến Thức Thực Tiễn về Tiêu Chí Thành Công: Tách Biệt "Chi Phí Xác Nhận" và "Chi Phí Sửa Chữa"

**──Có điểm nào dễ bị bỏ qua khi thiết lập tiêu chí thành công không?**

**Ông Kisamori:** Một điều quan trọng là phải phân tách rõ ràng "chi phí xác nhận" và "chi phí sửa chữa". Điều này thường bị bỏ qua.

Ví dụ, hãy xem xét trường hợp xử lý 100 biên lai. Dù độ chính xác AI là 80% hay 90%, cuối cùng vẫn phải xác nhận cả 100 tờ đúng không. Tức là chi phí xác nhận không thay đổi. Ngay cả khi độ chính xác tăng, chỉ có thời gian sửa 20 hoặc 10 tờ sai giảm đi, còn thời gian xác nhận xem 100 tờ thì không thay đổi.

Điều rắc rối hơn nữa là trường hợp "Tưởng như tiện lợi hơn nhờ AI nhưng thực ra chi phí xác nhận lại tăng". Việc xác nhận những gì AI đã làm tốn công sức nhưng lại không nhận ra điều đó. Đây cũng là góc nhìn quan trọng cho tiêu chí rút lui.

Tiêu chí rút lui nên được quyết định trước cùng với tiêu chí thành công. "Trở nên tệ hơn so với hiện tại" là tiêu chí rút lui rõ ràng, nhưng lại thường bị bỏ qua. Vì ai cũng không giỏi trả sunk cost nên việc quyết định trước là quan trọng.

Tư duy này quan trọng không chỉ với OCR mà trong nhiều tình huống ứng dụng AI khác. Ví dụ, kiểm tra văn bản do AI sinh ra, xác nhận kết quả phân loại của AI, v.v., giá trị thay đổi lớn tùy theo sự khác biệt "có cần xem tất cả hay không" hay "chỉ cần sửa những cái sai". Để đánh giá đúng ROI của việc triển khai AI, việc hiểu sâu cấu trúc chi phí của toàn bộ quy trình nghiệp vụ này là không thể thiếu.

Để đánh giá đúng ROI của việc triển khai AI và dẫn dắt dự án đến thành công, việc thiết kế lại "toàn bộ quy trình nghiệp vụ" sau khi tích hợp AI và đánh giá bằng tổng chi phí là không thể thiếu. Và việc đưa phân tích cấu trúc chi phí này vào "tiêu chí thành công" và "tiêu chí rút lui" được xác định ở giai đoạn đầu dự án một cách rõ ràng. Đây chính là chìa khóa quan trọng để không kết thúc dự án AI ở PoC mà kết nối đến việc tạo ra giá trị thực sự.

---

## Thực Tiễn và Phát Triển Tiêu Chí Thành Công với AIデータ化β

### Thay Đổi Cấu Trúc Chi Phí của Công Việc Ghi Sổ: Thách Thức của AIデータ化β

※AIデータ化β: Cơ chế nhiều AI agent phối hợp để xác minh và cải thiện độ chính xác đọc OCR

**Ông Kisamori:** Đây không chỉ là cải thiện độ chính xác đơn thuần, mà là dự án thay đổi từ gốc rễ cấu trúc chi phí của toàn bộ công việc ghi sổ tại văn phòng thuế/văn phòng kế toán bằng cách giải quyết vấn đề "chi phí xác nhận" đã nói ở trên.

Vì vậy, điều chúng tôi đã triển khai là đánh giá "độ tin cậy" về độ chính xác đọc và tính năng cảnh báo dựa trên đó. Có chứng từ điển hình dễ đọc, cũng có chứng từ phức tạp khó phán đoán ngay cả với người. AI đánh giá khách quan "Kết quả này, có thực sự tin cậy không?". Nhờ đó, chúng tôi có thể phân tách "cái cần xác nhận" và "cái có thể để qua". Chỉ cần xác nhận 20% có cảnh báo, chi phí xác nhận giảm 80%. Điểm mấu chốt là đã tách biệt "thời gian xác nhận" và "thời gian sửa chữa".

**──Đây là cách nghĩ phát huy ý nghĩa thực sự của việc ứng dụng LLM.**

**Ông Kisamori:** Điều quan trọng ở đây là "phân biệt mạnh yếu rõ ràng". Không tạo vùng xám. Ví dụ, nếu đặt ngưỡng đưa ra cảnh báo ở vị trí nửa vời, cuộc thảo luận "Như vậy có thực sự ổn không?" sẽ kéo dài mãi.

Ban đầu, chúng tôi đã phân biệt mạnh yếu rõ ràng "80% có thể xem bằng tay, còn 20% còn lại hãy tạo thứ thực sự đảm bảo được 99% độ chính xác". Không phải nửa vời mà quyết định rõ, như thế này. Làm vậy, sau này khi sửa tiêu chí thành công cũng dễ quyết định hơn.

Hơn nữa, chúng tôi thay đổi tiêu chuẩn độ chính xác theo từng mục, như ngày tháng và số tiền tuyệt đối không được lệch, còn cột ghi chú chỉ cần hiểu nghĩa là được. Quyết định "bỏ qua chỗ nào" cũng quan trọng. Nếu cố gắng làm mọi thứ hoàn hảo, release sẽ bị chậm.

### Phát Triển Tiêu Chí Thành Công: Chu Trình Xác Minh Giả Thuyết

**──Tiêu chí thành công một khi đã quyết định thì cố định phải không?**

**Ông Kisamori:** Không, không phải vậy. Chúng tôi phát triển sản phẩm với tinh thần làm việc cùng người dùng. Tiêu chí thành công là giả thuyết, và là thứ được sửa chữa bằng cách thử prototyping với người dùng thực tế ở giai đoạn sớm. Không nên quá cầu toàn cũng quan trọng.

Ví dụ trong nỗ lực với AIデータ化β, chúng tôi đã phát hiện độ chính xác đọc số và độ chính xác đọc text hoàn toàn khác nhau. Vậy thì hãy đánh giá riêng, chúng tôi đã phân tách tiêu chuẩn. Dựa trên những phát hiện như "À, chỗ này khác rồi" "Chỗ này có thể đào sâu hơn", chúng tôi cũng phát triển tiêu chí thành công.

Chúng tôi tạo bảng tiêu chí thành công đưa nội dung để tạo tiêu chí thành công vào đó, giao "Hãy điền vào này", để thiết lập cơ chế có thể tự chủ tạo tiêu chí thành công.

Tuy nhiên, cuối cùng có nhiều phần không biết được nếu không cho dùng thử, nên chúng tôi cũng chuẩn bị prompt để tạo tiêu chí thành công. Khi đưa prompt này vào LLM, bản nháp tiêu chí thành công sẽ ra. Bản thân tôi cũng dùng cái này để sắp xếp.

**──Việc ứng dụng LLM để tạo tiêu chí thành công là cách tiếp cận thú vị.**

**Ông Kisamori:** Khi tự tạo tiêu chí thành công một hai lần, sẽ nắm được cảm giác "À, nên tạo như thế này", nhưng chúng tôi công bố cảm giác đó được đưa vào prompt dưới dạng ứng dụng LLM nội bộ. Tuy nhiên, ứng dụng LLM này cũng hoạt động ở một mức độ nhất định, nhưng cuối cùng vẫn muốn hỏi người đúng không (cười). Vì vậy, hiện tại chúng tôi đang thử nghiệm tạo thứ agenticic hơn thay vì chỉ là prompt đơn thuần. Nhắm đến "thực chất là Kisamori" (cười).

Thông qua các cơ chế như vậy, chúng tôi muốn tạo ra thể chế mà không chỉ AI Lab hay tôi, mà ai cũng có thể mang lại giá trị người dùng bằng AI.

---

## Hợp Tác với AWS và Triển Vọng Tương Lai

### Hợp Tác với AWS

**──Vui lòng cho biết về sự hợp tác với AWS một lần nữa.**

**Ông Kisamori:** Chúng tôi nhận được hỗ trợ đa chiều từ team chuyên môn của AWS trong các lĩnh vực kỹ thuật, kinh doanh và vận hành, rất hữu ích.

Về mặt kỹ thuật, từ giai đoạn khởi động dự án có hỗ trợ tư vấn, thậm chí còn hợp tác hands-on, có thể tư vấn ngay khi gặp khó khăn. Về mặt kinh doanh, thông qua chương trình thúc đẩy ứng dụng AI sinh tạo, nhận được hỗ trợ hướng tới việc tạo giá trị kinh doanh không chỉ cung cấp kỹ thuật. Về mặt vận hành, điều chỉnh quota và tối ưu hóa chi phí v.v., các điều chỉnh tỉ mỉ hướng tới vận hành thực tế được đáp ứng nhanh chóng.

AWS cũng đề cao "Customer Obsession", nhưng tôi cảm thấy lần hỗ trợ này chính là hiểu đa diện về vấn đề của chúng tôi và đồng hành từ từng khía cạnh. Lúc nào cũng đưa ra yêu cầu vô lý hàng tuần mà vẫn được đáp ứng, cảm ơn rất nhiều (cười).

**──Vui lòng cho biết chi tiết hơn về lý do chọn Amazon Bedrock làm nền tảng kỹ thuật.**

**Ông Kisamori:** Thẳng thắn mà nói, tiền đề lớn là infrastructure sản phẩm được xây dựng trên AWS. Tuy nhiên, ngoài ra còn có lý do quan trọng khác.

Đầu tiên là bảo mật và tuân thủ. Vì xử lý thông tin quan trọng của khách hàng, nên những điểm như dữ liệu không được lưu tự tiện, không được dùng cho học tập là điều kiện bắt buộc. Ngoài ra, việc có thể lấy option kết nối vùng kín bằng PrivateLink cũng quan trọng.

Tiếp theo là tốc độ đáp ứng. Ví dụ, ngay sau khi Anthropic phát hành Claude Sonnet 3.5, thì Claude Sonnet 3.5 đã có thể dùng được trên Amazon Bedrock. Tôi nghĩ sẽ còn ra nhiều model mới nữa, nhưng khi có model mới, tôi nói trong công ty "Hãy đánh giá trong 1 ngày và release trong 1 tuần", nhưng tốc độ đáp ứng của AWS đã làm điều này trở nên khả thi.

Và là capacity dồi dào. Bằng cách sử dụng Amazon Bedrock của AWS, có thể xây dựng hệ thống có tính khả dụng và độ tin cậy.

**──Cảm ơn. Việc được tham gia vào các nỗ lực đầy thách thức của freee với cả team là điều rất có ý nghĩa với chúng tôi và nhận được nhiều bài học. Chúng tôi sẽ tiếp tục hỗ trợ hết mình.**

### Lời Khuyên cho Các Công Ty Khác

**──Xin cho lời khuyên đối với các công ty sắp bắt đầu ứng dụng AI hoặc chưa thành công.**

**Ông Kisamori:** Tôi nghĩ giai đoạn "cứ thử làm xem" đã kết thúc. Bây giờ là giai đoạn làm thế nào để tạo ra điều thực sự có giá trị khách hàng và tác động.

Tóm lại có 3 điểm.

**Thứ nhất, hãy làm việc nơi có tác động lớn đến kinh doanh.** Ứng dụng AI cho vấn đề nhỏ sẽ không dẫn đến bước tiếp theo. Cần kéo ban lãnh đạo vào và làm việc thực sự có giá trị.

**Thứ hai, hãy quyết định chắc chắn tiêu chí thành công ở giai đoạn đầu dự án.** Làm rõ chỉ số chất lượng như độ chính xác kết nối với giá trị khách hàng như thế nào. Và hiển thị ROI.

**Thứ ba, phân tích gap ở từng giai đoạn, chọn lựa chiến lược cái gì bỏ cái gì phát triển.** Bằng cách đặt ngưỡng phân biệt mạnh yếu rõ ràng chứ không phải vùng xám, sau này sửa tiêu chí thành công dễ dàng hơn.

Đây không phải là điều dễ dàng. Nhưng để thực sự tạo ra giá trị, không có cách nào khác ngoài việc chân thành làm việc với những điều này.

### Triển Vọng Tương Lai

**──Vui lòng cho biết triển vọng tương lai.**

**Ông Kisamori:** Đầu tiên, tôi muốn tạo ra tổ chức mà từng team sản phẩm có thể tự chủ ứng dụng AI. Hiện nay có nhiều dự án bắt đầu từ bottom-up, nhưng chúng tôi sẽ nâng cao chất lượng của chúng trên toàn tổ chức. Sử dụng ngôn ngữ chung là tiêu chí thành công, tạo tổ chức mà ai cũng có thể mang lại giá trị người dùng.

Về mặt kỹ thuật, chúng tôi sẽ phát triển hơn nữa training SLM, tối ưu hóa từng task bằng cách tiếp cận agentic. Nói về xu hướng gần đây, tính có thể tái tạo và độ tin cậy của agent đã trở nên bottleneck hơn là hiệu năng model rồi đúng không. Chúng tôi sẽ nâng cao tính tái tạo và độ tin cậy của agent bằng việc thu nhỏ, routing, tối ưu hóa vận hành.

Và hơn hết, hướng tới việc thực hiện tầm nhìn "AI CFO", chúng tôi sẽ sản xuất hàng loạt AI thực sự tạo ra giá trị khách hàng. Đây không chỉ là AI Lab mà là điều toàn tổ chức cùng làm.

**──Cảm ơn những chia sẻ quý báu hôm nay.**

**Ông Kisamori:** Cảm ơn. Tôi mong rằng nhiều công ty có thể đạt được kết quả với việc ứng dụng AI.

---

## Tổng Kết

Chuyển đổi của freee sang AI native không chỉ là kỹ thuật, mà được tiến hành với sự kết hợp của văn hóa tổ chức, framework và cam kết của ban lãnh đạo. Đặc biệt, framework độc đáo "Tiêu Chí Thành Công" và kiến thức thực tiễn tách biệt "Chi Phí Xác Nhận" và "Chi Phí Sửa Chữa" sẽ là cách tiếp cận tham khảo cho nhiều công ty.

Đối với các công ty vượt qua giai đoạn "cứ thử làm xem" và hướng tới việc tạo giá trị khách hàng thực sự, các nỗ lực của freee đầy gợi ý.

**Về tác giả:**
- Từ trái: Ông Kisamori của freee, AWS Solutions Architect Fukumoto, Account Manager Hattori, Technical Account Manager Funabashi
- Bài blog này được viết bởi Solutions Architect Kensuke Fukumoto, chụp ảnh bởi Solutions Architect Takeru Ito

**Tags:** AI, AI/ML, Generative AI, Amazon Bedrock, Case Study, Customer Solutions, SaaS
