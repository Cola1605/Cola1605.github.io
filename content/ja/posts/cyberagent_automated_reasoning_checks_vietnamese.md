---
title: "Kiểm soát Hallucination của AI bằng Phương pháp Hình thức: Trải nghiệm AWS Automated Reasoning Checks"
date: 2025-10-02T11:00:00+07:00
draft: false
tags: ["AWS", "Automated Reasoning", "AI Hallucination", "CyberAgent", "ABEMA", "AI Safety"]
categories: ["AI and Machine Learning", "AWS", "Business and Technology"]
author: "Honoka Toda"
description: "Trải nghiệm thực tế sử dụng AWS Automated Reasoning Checks để kiểm soát hallucination của AI tại CyberAgent"
---

## Giới thiệu

Xin chào, tôi là Toda Honoka, kỹ sư tốt nghiệp năm 2025 thuộc nhóm phát triển hệ thống phân phối quảng cáo ABEMA của CyberAgent.

Trong phát triển ứng dụng sử dụng AI tạo sinh, vấn đề gọi là "hallucination" (ảo giác) thường xuyên trở thành thách thức. Đây là hiện tượng AI tạo sinh xuất ra thông tin sai lệch nhưng có vẻ hợp lý một cách đầy tự tin.

Để giải quyết vấn đề này, một dịch vụ mới có tên "Automated Reasoning checks" đã được phát hành chính thức (GA) trên AWS gần đây, áp dụng 技術 xác minh hình thức để kiểm soát sự xuất hiện của hallucination.

Trong 記事 này, chúng tôi sẽ giới thiệu nội dung thực tế khi thử nghiệm "Automated Reasoning checks" cùng với kết quả xác minh.

## Automated Reasoning Checks là gì?

Automated Reasoning checks được cung cấp như một chức năng của Amazon Bedrock Guardrails.

Amazon Bedrock Guardrails là cơ chế để tích hợp các chức năng an toàn vào ứng dụng AI tạo sinh, cung cấp nhiều chức năng khác nhau như ngăn chặn hallucination và lọc nội dung có hại.

Trong số đó, Automated Reasoning checks là chức năng nhằm mục đích xác minh đầu ra của LLM dựa trên phương pháp hình thức và kiểm soát hallucination.

### Phương pháp hình thức là gì?

Phương pháp hình thức là phương pháp mô tả thiết kế và hành vi của hệ thống bằng ngôn ngữ có ký hiệu và cú pháp được quy định chặt chẽ, không có tính mơ hồ (ngôn ngữ hình thức), và xác minh tính đúng đắn của nó.

Về phương pháp hình thức, có giải thích chi tiết trong [記事 này](https://developers.cyberagent.co.jp/blog/archives/58276/) nên những ai quan tâm hãy đọc thử.

Automated Reasoning là một trong những phương pháp hình thức, là lĩnh vực khoa học máy tính nhằm mục đích xác minh hoạt động của hệ thống và chương trình thông qua chứng minh toán học.

Mặc dù phương pháp hình thức rất mạnh mẽ, nhưng nó có thách thức là chi phí học tập cao do yêu cầu kiến thức toán học làm tiền đề, và rào cản triển khai trong thực tế cao.

Automated Reasoning checks được GA lần này là dịch vụ có thể nhận được lợi ích từ phương pháp hình thức mà vẫn tránh được những thách thức như vậy.

### Quy trình sử dụng Automated Reasoning Checks

Trong Automated Reasoning checks, trước tiên bạn tạo policy.

Policy là việc mô tả hình thức các điều kiện mà đối tượng xác minh phải thỏa mãn, được cấu thành bởi nhiều rule.

Rule là logic để xác minh, được biểu diễn như `if <premise>, then <claim>` hoặc `<premise> is true`.

Quy trình thực tế để tạo policy này như sau:

**1. Tạo Policy**

Trước tiên, bạn upload tài liệu chứa business rule làm nguồn để tạo policy.
Policy sẽ được xuất ra dựa trên đó.

**2. Kiểm tra và sửa đổi Policy**

Vì các rule được tạo lần đầu không nhất thiết chính xác, bạn tạo test để xác nhận rule có hoạt động theo ý định hay không.
Khi kết quả test cho thấy rule không phù hợp, bạn có thể thêm annotation vào rule hoặc các biến cấu thành rule đó để sửa đổi rule dựa trên annotation.
Bằng cách lặp lại quy trình này, bạn có thể tạo policy với nội dung như ý định.

## Xác minh

Chúng tôi đã thực tế thử tạo policy bằng Automated Reasoning checks.

Chúng tôi sẽ tạo policy thực tế với kịch bản phân bổ Sev khi xảy ra incident.

### 1. Tạo Policy

Như hình ảnh, bạn có thể tạo policy chỉ bằng cách nhập tài liệu.

Thay vì nhập trực tiếp, bạn cũng có thể upload file.

Tài liệu đã nhập lần này như sau:

**Nội dung nhập vào Source content:**
```
# Hướng dẫn phân loại mức độ nghiêm trọng Incident
Hướng dẫn này định nghĩa tiêu chí để phân loại các incident xảy ra trong dịch vụ đang vận hành theo mức độ nghiêm trọng (Severity).

## Sev-1
Phân loại là Sev-1 khi thuộc một trong những trường hợp sau:
- Toàn bộ dịch vụ không thể sử dụng
- Đã xảy ra rò rỉ dữ liệu

## Sev-2
Không thuộc điều kiện Sev-1 và thuộc một trong những trường hợp sau thì phân loại là Sev-2:
- 30% trở lên tổng số người dùng bị ảnh hưởng
- Một hoặc nhiều chức năng chính đã dừng hoàn toàn

## Sev-3
Không thuộc điều kiện Sev-1, Sev-2 và thuộc một trong những trường hợp sau thì phân loại là Sev-3:
- Có lỗi nhỏ nhưng các chức năng chính vẫn có thể sử dụng
- Người dùng bị ảnh hưởng dưới 5% tổng số
```

**Nội dung nhập vào Describe the source content:**
```
Tài liệu này dùng để phân loại incident xảy ra trong dịch vụ production dựa trên quy tắc mức độ nghiêm trọng. Có 3 loại mức độ nghiêm trọng là Sev-1, Sev-2, Sev-3, mỗi loại có danh sách điều kiện ngắn. Incident bắt buộc phải được phân loại vào chỉ một mức độ nghiêm trọng. Bỏ qua phần giới thiệu, chỉ tham khảo danh sách điều kiện của từng mức độ nghiêm trọng. Dưới đây là ví dụ phân loại:
Incident: Dịch vụ hoàn toàn không thể sử dụng
Phân loại: Sev-1
```

### Các thành phần cấu thành Policy

Như đã giải thích một phần ở trên, policy được tạo bởi Automated Reasoning checks cấu thành từ 3 yếu tố sau:

- **Custom variable types**: Loại biến không phải boolean cũng không phải số
- **Biến**: Khái niệm chính trong tài liệu ngôn ngữ tự nhiên, mỗi biến liên quan đến một hoặc nhiều rule
- **Rule**: Mô tả cách các biến trong policy liên quan với nhau

**Custom variable types:**
Có thể xác nhận rằng loại SeverityLevel đã được định nghĩa.

**Biến:**
Có thể xác nhận rằng các điều kiện được mô tả trong tài liệu như `hasDataLeakOccurred` đã được định nghĩa như biến boolean.

**Rule:**
Ví dụ, một trong những điều kiện Sev-1 "Toàn bộ dịch vụ không thể sử dụng" trong tài liệu đã nhập được bao gồm trong rule có ID XQYEOFGTOZHM trong hình `if isServiceCompletelyUnavailable is true or hasDataLeakOccurred is true, then incidentSeverity is equal to SEV_1`.

### 2. Tạo Test

Chúng tôi thử test policy đã được định nghĩa. Test có thể tạo thủ công hoặc tự động tạo dựa trên tài liệu. Khi nhấn nút generate để tự động tạo, popup như hình đã xuất hiện.

Nhấn nút good để thêm như test scenario.

Ngoài ra, nhấn nút bad để truyền đạt lý do tại sao không tốt.

Chúng tôi đã sửa đổi test tự động tạo như hình.

Như mô tả để được phán đoán Sev-3, chúng tôi đã thêm input "It's a minor issue, but all the major functions are available. Only 1% of users are affected.".

Ngoài ra, vì muốn điều này được phán đoán là hợp lệ, chúng tôi đã đặt Expected Result là Valid.

### 3. Thực hiện Test

Kết quả thực hiện thực tế như sau:

Kết quả không phải `Valid` mà là `Satisfiable`, test đã fail và các Findings được phát hiện bị chia thành hai.

`Satisfiable` có nghĩa là tùy thuộc vào điều kiện tiền đề bổ sung, có trường hợp tuyên bố này thành lập và có trường hợp không thành lập.

### 4. Sửa đổi kết quả chuyển đổi dư thừa

Trước tiên, chúng tôi xác nhận về việc xuất hiện nhiều kết quả chuyển đổi.

Trong chuyển đổi đầu tiên có "numberOfCompletelyStoppedMainFunctions is equal to 0".

Điều này có nghĩa là số lượng chức năng chính bị dừng là 0, và bản thân biến này được cho là tạo ra từ mô tả "Một hoặc nhiều chức năng chính đã dừng hoàn toàn" trong tài liệu.

Ngoài ra, khác với điều này, cũng tồn tại chuyển đổi `hasMinorIssuesButMainFunctionsAvailable`. Điều này được cho là tạo ra từ mô tả "Có lỗi nhỏ nhưng các chức năng chính vẫn có thể sử dụng" trong tài liệu.

Hai biến này có ý nghĩa chồng chéo lên nhau và trở nên dư thừa.

Điều quan trọng trong kịch bản lần này là liệu có tồn tại chức năng chính bị dừng hay không, số lượng không quan trọng.

Do đó, chúng tôi xóa các biến này và thêm hai biến `AllMainFunctionsAvailable` và `hasMinorIssues`, rồi viết lại rule dựa trên chúng.

### 5. Xử lý vấn đề kết quả trở thành Satisfiable

Tiếp theo, chúng tôi xử lý vấn đề kết quả trở thành `Satisfiable`.

Khi đưa cursor vào phần viết `Satisfiable`, giải thích được hiển thị.

Theo đó, do kết quả của `hasDataLeakOccurred` ảnh hưởng nên true/false của kịch bản này thay đổi, nên trở thành `Satisfiable`.

Chúng tôi đã nghĩ ngầm rằng "không có gì khác xảy ra ngoài input đã cho", nhưng có vẻ cần phải nêu rõ.

Do đó, chúng tôi đã sửa đổi input để thể hiện rõ ràng rằng không có gì khác xảy ra.

```
"The only two impacts of this incident are as follows: It is a minor issue, and the major functions remain available. Only 1% of users are affected. There is no data leak or any other major impact. incidentSeverity is equal to SEV_3"
```

Khi thực hiện với điều này, kết quả vẫn là `Satisfiable`.

Khi xem chi tiết, lần này do kết quả của `isServiceCompletelyUnavailable` ảnh hưởng nên true/false của kịch bản này thay đổi, nên trở thành `Satisfiable`.

Vì các chức năng chính không bị ảnh hưởng nên có thể cảm thấy dịch vụ có thể sử dụng được, nhưng điều này cũng cần truyền đạt rõ ràng.

Do đó, chúng tôi đã thêm rule phù hợp.

Khi thực hiện test dựa trên điều này, đã thành công!

Khi thêm một số rule khác, có lẽ do hiệu quả của các sửa đổi đến thời điểm này, tất cả đều pass mà không cần làm gì!

## Kết luận

Lần này, chúng tôi đã xác minh toàn bộ quá trình tạo policy sử dụng Automated Reasoning checks.

Khi thực tế thử nghiệm, tôi nhận ra rằng mình đã vô thức xác minh dựa trên các giả định và rule ngầm.

Không chỉ riêng ứng dụng tích hợp AI tạo sinh, việc phát triển ứng dụng nghĩa là thể hiện business logic ở dạng mà máy có thể xử lý được.

Chức năng có thể tạo rule chính xác từ ngôn ngữ tự nhiên này, tôi cảm thấy có tiềm năng ứng dụng rộng rãi không chỉ dừng lại ở một chức năng của Amazon Bedrock Guardrails.

Mặt khác, business logic thực tế phức tạp hơn, và để rule hóa chúng một cách toàn diện và chính xác cần khối lượng công việc tương ứng.

Khi ứng dụng, có vẻ quan trọng là phân biệt các use case mà xác minh dựa trên rule như thế này có thể hoạt động hiệu quả.

Lần này do hạn chế thời gian nên không thể xác minh đến phần tích hợp, nhưng nếu có thể kiểm soát chặt chẽ đầu ra của AI tạo sinh bằng cơ chế này, tôi cảm thấy phạm vi ứng dụng có thể sử dụng chính AI tạo sinh sẽ mở rộng đáng kể.

Cảm ơn bạn đã đọc đến cuối!

---

## Về tác giả

**Honoka Toda**  
Là backend engineer tốt nghiệp năm 2025!

- **GitHub:** https://github.com/hono0130
- **Twitter:** https://x.com/hono0130__

## Bài viết liên quan

- [Tối ưu hóa chi phí đạt được bằng cách migration từ Amazon EMR sang Snowflake ~ Case study của hệ thống tổng hợp kết quả phân phối quảng cáo tại Dynalyst ~](https://developers.cyberagent.co.jp/blog/archives/57936/)
- [【AI tạo sinh "được sử dụng" là gì?】Không phải ChatGPT cũng không phải Dify. Câu chuyện phát triển Bot "議事録くん" tạo ra 300 biên bản mỗi tuần trên Slack của sinh viên mới tốt nghiệp](https://developers.cyberagent.co.jp/blog/archives/58638/)

---

**Nguồn:** [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/58667/)
