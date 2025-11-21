---
title: "Xây dựng nền tảng phân tích dữ liệu AI-Ready tại WINTICKET"
date: 2025-11-20
categories: ["Data and Analytics"]
tags: ["AI Agent", "BigQuery", "Dataform", "Protocol Buffers", "Dataplex", "Devin", "WINTICKET", "CyberAgent", "Data Platform"]
author: "山田 瑠奈 (Runa Yamada)"
description: "Nghiên cứu điển hình về xây dựng nền tảng phân tích dữ liệu AI-Ready tại WINTICKET. Phát triển hướng schema với Protocol Buffers và Dataform, quản lý chất lượng dữ liệu bằng Dataplex, và tự động hóa phân tích với Devin AI Agent."
source: "https://developers.cyberagent.co.jp/blog/archives/59626/"
draft: false
---


**Tác giả**: 山田 瑠奈 (Runa Yamada) (@___ryamaaa)  
**Công ty**: 株式会社 WinTicket / CyberAgent  
**Ngày xuất bản**: 2025-11-20  
**Bài gốc**: https://developers.cyberagent.co.jp/blog/archives/59626/

## Tổng quan

Nghiên cứu điển hình về xây dựng nền tảng phân tích dữ liệu AI-Ready tại WINTICKET. Giới thiệu về phát triển hướng schema với Protocol Buffers và Dataform, quản lý chất lượng dữ liệu bằng Dataplex, và tự động hóa phân tích thông qua kết nối với Devin AI Agent. Sau 2 tháng triển khai, đã xử lý gần 100 yêu cầu phân tích và giải quyết được nút thắt trong việc tận dụng dữ liệu.

## Những điều học được từ bài viết này

- Tư tưởng thiết kế nền tảng phân tích dữ liệu mà AI Agent có thể phân tích tự chủ
- Phát triển hướng schema bắt đầu từ Protocol Buffers
- Quản lý pipeline với Dataform và đảm bảo chất lượng dữ liệu với Dataplex
- Phương pháp triển khai tự động hóa phân tích sử dụng Devin

## Đối tượng độc giả mục tiêu

- Kỹ sư và Data Analyst quan tâm đến tối ưu hóa công việc phân tích dữ liệu
- Những người đang xem xét ứng dụng thực tế của AI Agent
- Những người tham gia thiết kế và vận hành nền tảng phân tích dữ liệu

---

## Giới thiệu

WINTICKET cung cấp dịch vụ đặt cược trực tuyến cho đua xe đạp và đua xe, và hàng ngày có lượng dữ liệu khổng lồ được tích lũy. Team Data Management đang hoàn thiện nền tảng phân tích dữ liệu AI-Ready, hướng tới mục tiêu tối ưu hóa công việc phân tích dữ liệu bằng AI. Bài viết này sẽ giới thiệu về tư tưởng thiết kế khi xây dựng nền tảng phân tích dữ liệu, cách triển khai AI Agent, và những nỗ lực hiện tại.

## Thách thức trong phân tích dữ liệu

### Vấn đề hiện tại

Tại WINTICKET, việc ra quyết định dựa trên dữ liệu được thực hiện hàng ngày, nhưng kiến thức domain cần thiết cho phân tích bị phụ thuộc vào từng cá nhân, và chỉ có khoảng 3-4 thành viên trong bộ phận kinh doanh có thể hoàn thành phân tích một mình. Có nhiều yêu cầu phân tích dữ liệu được gửi đến, thường mất vài ngày để có câu trả lời, khiến tốc độ tận dụng dữ liệu trở thành điểm nghẽn.

### Nỗ lực: Đào tạo SQL

Vào tháng 3 năm 2025, đã thực hiện khóa đào tạo SQL trong 2 ngày cho bộ phận kinh doanh. Trước đó, các thành viên học cơ bản về SQL trên Progate, trong khóa đào tạo giải thích cách sử dụng BigQuery và cấu trúc data mart. Cũng tạo bộ bài tập dựa trên các vấn đề kinh doanh thực tế, và chuẩn bị tài liệu giải thích về dữ liệu cũng như kinh nghiệm sử dụng SQL.

Qua khóa đào tạo, số thành viên có thể viết SQL đã tăng lên, nhưng số thành viên có thể tự hoàn thành phân tích vẫn còn hạn chế.

【Phản hồi từ người tham gia khóa đào tạo】
- "Đã có thể viết SQL nhưng không biết dữ liệu nào ở đâu"
- "Không biết cột này cụ thể có ý nghĩa gì, nên hỏi ai"
- "Không biết nên JOIN bảng nào, phương pháp tập hợp nào là phù hợp"

Từ những phản hồi này, nhận ra rằng không chỉ học cú pháp SQL mà việc truy cập metadata và kiến thức domain mới là quan trọng.

### Giải pháp: Xây dựng nền tảng phân tích dữ liệu AI-Ready

Để phá vỡ tình trạng này, tập trung vào cách tiếp cận sử dụng AI Agent. Nếu tổng hợp metadata và kiến thức domain dưới dạng dễ hiểu cho AI, và xây dựng môi trường mà AI có thể tự chủ tham khảo thông tin để phân tích, thì AI có thể đảm nhận vai trò của "thành viên am hiểu". Nếu AI có thể tự động thu thập thông tin cần thiết và phân tích, thì Data Scientist và thành viên kinh doanh có thể tập trung vào công việc chiến lược hơn.

## Tổng quan hệ thống nền tảng phân tích dữ liệu

### Cấu trúc data pipeline

Tại WINTICKET, xử lý dữ liệu bằng data pipeline như sau:

Dữ liệu event được gửi từ application và dữ liệu master từ RDB được chuyển đổi và tập hợp theo từng giai đoạn trong cấu trúc 3 tầng Data Lake → Data Warehouse → Data Mart, cuối cùng trở thành dạng có thể tận dụng cho nhiều mục đích khác nhau. Hỗ trợ toàn bộ pipeline này chính là quản lý schema bằng Protocol Buffers.

### Quản lý schema với Protocol Buffers

Tại WINTICKET, định nghĩa event schema bằng Protocol Buffers và quản lý tập trung bằng schema registry. Sử dụng Protocol Buffers như Single Source of Truth để tự động tạo các component sau:

1. **Application code**: Code gửi log (Dart, TypeScript, Go, v.v.)
2. **Xử lý ETL**: Xử lý trích xuất và chuyển đổi dữ liệu master từ RDB
3. **Quy tắc chất lượng Dataplex**: Định nghĩa kiểm tra chất lượng dữ liệu ở tầng Data Lake

Nhờ cơ chế này, tính nhất quán giữa định nghĩa schema, application, data warehouse và quản lý chất lượng dữ liệu được duy trì, loại bỏ việc quản lý định nghĩa kép.

### Quản lý data pipeline với Dataform

Tại WINTICKET, sử dụng Dataform để quản lý data pipeline chuyển đổi dữ liệu theo cấu trúc 3 tầng: tầng Data Lake (dữ liệu thô) → tầng Data Warehouse (xử lý làm sạch và chuyển đổi chung) → tầng Data Mart (cho phân tích).

Repository Dataform được phân tầng:
- datalake/: Định nghĩa chuyển đổi tầng Data Lake
- datawarehouse/: Định nghĩa chuyển đổi tầng Data Warehouse (event/dữ liệu event, master/dữ liệu master)
- datamart/: Định nghĩa tập hợp tầng Data Mart (fact/bảng fact đã tập hợp, dimension/bảng dimension đã tập hợp)
- assert/: Kiểm tra chất lượng dữ liệu

### Quản lý chất lượng dữ liệu với Dataplex

Tự động hóa kiểm tra chất lượng dữ liệu ở tầng Data Lake bằng Dataplex. Lấy ví dụ BetEvent được định nghĩa trong Protocol Buffers, giới thiệu các quy tắc kiểm tra chất lượng được tự động tạo:

**Quy tắc được tự động tạo:**
1. user_id: Kiểm tra non-NULL cho trường bắt buộc (required)
2. bet_amount: Kiểm tra phạm vi kiểu int64 (không cho phép giá trị âm)
3. race_category: Kiểm tra giá trị enum được định nghĩa trong allowed_value

Đã tạo cơ chế thông báo đến Slack khi có vấn đề về chất lượng, giảm thiểu rủi ro phân tích bằng dữ liệu sai.

Các quy tắc kiểm tra chất lượng này được tự động tạo từ định nghĩa Protocol Buffers. Bằng cách phân tích metadata như field_description và allowed_value được định nghĩa trong schema, và tạo quy tắc Dataplex tương ứng, duy trì tính nhất quán giữa định nghĩa schema và quản lý chất lượng dữ liệu.

## Xây dựng nền tảng phân tích dữ liệu AI-Ready

### Làm phong phú metadata để có thể hiểu ý nghĩa dữ liệu

Hoàn thiện metadata trong Protocol Buffers và Dataform để AI có thể nắm bắt chính xác ý nghĩa dữ liệu.

**Định nghĩa schema trong Protocol Buffers:**
Khi định nghĩa event schema trong Protocol Buffers, mô tả field_description cho mỗi trường, và đối với cột kiểu enum, định nghĩa các giá trị có thể có và giải thích của chúng bằng allowed_value.

**Tăng cường metadata trong Dataform:**
Trong Dataform, đã quy định phải thêm description cho tất cả các cột trong config block. Trong mỗi tệp .sqlx, mô tả giải thích về bảng và cột cùng với định nghĩa SQL.

AI Agent tham khảo repository Protocol Buffers và Dataform trên GitHub, nắm bắt được bảng nào được tạo qua xử lý nào và mỗi cột có ý nghĩa gì.

### Làm rõ cấu trúc dữ liệu để có thể chọn bảng phù hợp

Ở tầng Data Warehouse, tồn tại hơn 100 bảng kết hợp dữ liệu master và dữ liệu event. Việc chọn bảng phù hợp cho phân tích từ đó, ngay cả con người cũng thường phân vân.

Tập trung logic xử lý tập hợp chính vào tầng Data Mart, và tổ chức phân chia thành bảng fact (hành vi người dùng: giao dịch như đặt cược, nạp tiền) và bảng dimension (thuộc tính người dùng, thông tin đua xe, v.v.). Thiết kế sao cho phân tích chính có thể hoàn thành trong tầng Data Mart.

**Thứ tự ưu tiên sử dụng bảng:**
Tận dụng cấu trúc phân tầng, định nghĩa phương châm ưu tiên sử dụng tầng Data Mart đã được tập hợp trong phân tích. AI cũng tương tự, trước tiên khám phá các bảng ở tầng Data Mart, và tham khảo tầng Data Warehouse khi cần thiết.

### Hệ thống hóa tài liệu để có thể hiểu ngữ cảnh kinh doanh

Tạo thư mục docs/ trong repository Dataform và hoàn thiện tài liệu một cách hệ thống:

**Cấu trúc tài liệu:**
- architecture/: Tư tưởng thiết kế cấu trúc dữ liệu (overview.md kiến trúc tổng thể, datamart-layer.md phương châm thiết kế tầng Data Mart)
- features/: Thiết kế chi tiết từng bảng (datamart/fact/ tập hợp hành vi người dùng, datamart/dimension/ thuộc tính người dùng, thông tin đua xe)
- business-domain/: Kiến thức domain kinh doanh (thuật ngữ, quy tắc coding, v.v.)
- operations/: Quy trình vận hành

Ghi chép ý định thiết kế từng bảng, logic kinh doanh, điểm lưu ý khi sử dụng, v.v. Đặc biệt trong business-domain/, tích lũy kiến thức domain đặc trưng của WINTICKET như mô hình kinh doanh đua xe đạp và đua xe, các loại cược (3連単, 2車単, v.v.).

AI tham khảo những thông tin này, nắm bắt ngữ cảnh kinh doanh đằng sau dữ liệu. Không chỉ định nghĩa bảng đơn thuần, mà còn có thể đưa ra phán đoán như "tại sao cần tập hợp này" "nên sử dụng trong trường hợp nào".

## Triển khai AI Agent

### Tại sao chọn Devin

Để thực hiện tự động hóa phân tích dữ liệu, đã xem xét một số cách tiếp cận.

**Các cách tiếp cận đã xem xét:**

| Cách tiếp cận | Ưu điểm | Nhược điểm |
|---------------|---------|------------|
| Tự phát triển bằng framework (LangChain, ADK, v.v.) | ・Tự do cao<br>・Có thể đáp ứng yêu cầu riêng | ・Chi phí phát triển và vận hành lớn |
| Hỗ trợ editor (Cursor, v.v.) | ・Hiệu quả cho cá nhân<br>・Dễ triển khai | ・Khó sử dụng cho thành viên kinh doanh<br>・Khó tích lũy case phân tích trong tổ chức |
| Devin | ・Chi phí phát triển và vận hành thấp<br>・Có thể yêu cầu dễ dàng từ Slack<br>・Case phân tích được tích lũy trong tổ chức | ・Tự do tùy chỉnh thấp<br>・Có phí sử dụng dịch vụ |

Vì team Data Management của WINTICKET vận hành với số người ít, đã chọn Devin với trọng tâm vào việc giảm chi phí phát triển và vận hành, thành viên kinh doanh có thể yêu cầu dễ dàng, và case phân tích được tích lũy trong tổ chức. Ngoài ra, việc các team khác đã triển khai Devin và có kiến thức được tích lũy trong WINTICKET cũng là yếu tố quyết định lớn.

### Định nghĩa workflow phân tích bằng Playbook và Knowledge

Trong Devin, sử dụng kết hợp Playbook và Knowledge:

- **Playbook**: Định nghĩa quy trình phân tích và task cần thực hiện ("cần làm gì")
- **Knowledge**: Quản lý thông tin tham khảo như kiến thức domain và best practice ("cần biết gì")

**Quản lý bằng GitHub repository:**
Playbook và Knowledge được quản lý tập trung bằng GitHub repository cho toàn bộ WINTICKET:

```
devin-repository/
├── playbook/
│   └── data_analysis.md  # Định nghĩa quy trình phân tích dữ liệu
├── knowledge/
│   ├── data_datasets.md  # Giải thích về dataset
│   ├── data_domain_knowledge.md  # Kiến thức domain (logic hoàn trả, v.v.)
│   └── data_sql_best_practices.md  # Best practice SQL
```

**Nội dung định nghĩa trong Playbook cho phân tích dữ liệu (data_analysis.md):**
- Vai trò và trách nhiệm của Devin
- Format trả lời phân tích
- Quy tắc vận hành (phỏng vấn, xác nhận trước khi thực hiện, đảm bảo tính kiểm toán, v.v.)
- Chỉ định tệp Knowledge cần tham khảo

**Nội dung quản lý trong tệp Knowledge:**
- data_datasets.md: Bảng khuyến nghị, cấu trúc phân tầng dữ liệu
- data_domain_knowledge.md: Logic kinh doanh đặc trưng của đua xe đạp và đua xe
- data_sql_best_practices.md: Quy ước coding SQL, kinh nghiệm tối ưu performance

Playbook chỉ thị "cần làm gì", Knowledge cung cấp thông tin tham khảo "thực hiện như thế nào", nhờ đó Devin có thể phân tích phù hợp.

Ngoài thông tin được chỉ định trong Knowledge, Devin cũng tham khảo repository Dataform (business-domain/ và định nghĩa từng bảng) qua GitHub. Knowledge chỉ ra phương châm phân tích như "nên ưu tiên bảng nào", và repository Dataform cung cấp "đặc tả chi tiết của từng bảng", cả hai bổ sung cho nhau.

### Cấu trúc hóa yêu cầu bằng Slack Workflow và Macro

Tại WINTICKET, sử dụng Workflow Builder của Slack để nhận yêu cầu phân tích. Khi người dùng nhập "nội dung phân tích" và "khoảng thời gian phân tích" vào form, Devin Macro gửi thông tin đó cùng với đường dẫn Playbook phù hợp đến Devin.

Bằng cách quyết định các mục nhập trong form, thông tin cần thiết như nội dung phân tích và khoảng thời gian được truyền đầy đủ đến Devin, cho phép phân tích với độ chính xác cao.

**Ví dụ yêu cầu:**
"Trong quá khứ, tay đua nào đã đua cùng team với ai và bao nhiêu lần? Có dữ liệu như vậy không? Nếu không có, có phương pháp tập hợp nào để suy đoán điều đó không?"

### Luồng phân tích của Devin

Devin nhận yêu cầu và tự chủ phân tích như sau:

1. **Tham khảo Playbook**: Lấy thông tin cần thiết cho phân tích từ Playbook được chỉ định bởi Macro
2. **Tìm kiếm bảng liên quan**: Tham khảo repository Dataform trên GitHub và định nghĩa schema của Protocol Buffers, xác định các bảng như thông tin tay đua, kết quả đua, thông tin team
3. **Tạo và thực thi SQL**: Dựa trên thông tin thu được từ flow trên, tự động tạo SQL và thực thi trên BigQuery. Nếu có lỗi thì sửa và thực thi lại
4. **Trả lời trên Slack**: Định dạng theo dạng dễ xem và báo cáo kết quả phân tích
5. **Ghi lại case phân tích**: Ghi lại pattern phân tích lần này, tận dụng để nâng cao độ chính xác lần sau

**Ví dụ kết quả phân tích thực tế:**
Devin sau khi xác nhận sự tồn tại của dữ liệu, tổng hợp kết quả dưới dạng dễ hiểu là "Cặp tay đua hay đua cùng team nhất TOP 10", trả lời giải thích về việc có dữ liệu và kết quả phân tích chi tiết bao gồm tên tay đua cụ thể, kỳ, ngày xuất phát.

**Hiệu quả sau triển khai:**
Sau khi triển khai cơ chế tự động hóa phân tích này từ cuối tháng 9 năm 2025, chỉ trong tháng 10 đã xử lý gần 100 yêu cầu phân tích, được sử dụng tích cực ngay sau triển khai.

### Cập nhật liên tục Knowledge

Sau khi hoàn thành phân tích, thực thi macro `!data_update_knowledge` trong cùng thread Slack, Devin sẽ tự động thực hiện:

1. **Ghi lại case phân tích**: Ghi lại SQL đã sử dụng, thời gian thực thi, lượng scan, bảng sử dụng, v.v. vào data_devin_analysis_cases.md
2. **Trích xuất và bổ sung kiến thức**: Bổ sung kiến thức domain mới hoặc best practice thu được từ phân tích vào tệp Knowledge phù hợp
3. **Tự động tạo PR**: Tạo PR tổng hợp nội dung cập nhật và yêu cầu review từ team Data Scientist

Nhờ cơ chế này, Knowledge được tích lũy sau mỗi lần phân tích, độ chính xác của Devin liên tục nâng cao.

## Chu trình tăng trưởng mục tiêu

Bằng cách kết hợp Protocol Buffers, Dataform, Dataplex và Devin, cuối cùng thực hiện cơ chế tăng trưởng liên tục theo chu trình sau:

1. **Thành viên WINTICKET đặt câu hỏi bằng ngôn ngữ tự nhiên**: Ai cũng có thể yêu cầu phân tích dữ liệu dễ dàng
2. **AI phân tích dữ liệu**: Tham khảo metadata, phân tích bằng dữ liệu được đảm bảo chất lượng
3. **Kiến thức được tích lũy**: Thêm pattern phân tích và best practice vào Knowledge
4. **Trực quan hóa phân tích**: Xác định các phân tích được sử dụng thường xuyên
5. **Nền tảng phân tích dữ liệu tiến hóa**: Tự động hóa data mart cho các phân tích có nhu cầu cao

Bằng cách quay vòng chu trình này, hướng tới thế giới mà nền tảng phân tích dữ liệu và AI Agent cùng phát triển.

## Tổng kết

Bài viết này đã giới thiệu về xây dựng nền tảng phân tích dữ liệu AI-Ready tại WINTICKET và nỗ lực tự động hóa phân tích bằng AI Agent.

Điều cảm nhận được khi vận hành Devin thực tế là những nỗ lực được tích lũy kiên trì trong nền tảng phân tích dữ liệu cho đến nay đã trực tiếp nâng cao độ chính xác của AI Agent. Việc định nghĩa schema bằng Protocol Buffers và thêm giải thích cho tất cả bảng và cột trong Dataform. Việc thống nhất định nghĩa tập hợp ở tầng Data Mart. Chính nhờ những tích lũy này mà Devin có thể chọn bảng phù hợp, hiểu logic kinh doanh và tạo SQL.

Việc hoàn thiện nền tảng phân tích dữ liệu có nhiều công việc không nổi bật và khó thấy được hiệu quả, nhưng qua AI Agent, đã cảm nhận được những nỗ lực kiên trì cho đến nay chắc chắn đang phát huy hiệu quả.

Việc xây dựng nền tảng phân tích dữ liệu của WINTICKET vẫn còn dang dở, nhưng đang từng bước tiến tới mục tiêu rõ ràng là "môi trường mà AI dễ tận dụng dữ liệu". Hy vọng có thể làm tham khảo cho các team đang gặp phải vấn đề tương tự.

**Thông tin tuyển dụng:**
WINTICKET đang tích cực tuyển dụng Data Engineer. Chào đón những người quan tâm đến xây dựng nền tảng phân tích dữ liệu và ứng dụng AI để trò chuyện thoải mái qua buổi gặp mặt.
