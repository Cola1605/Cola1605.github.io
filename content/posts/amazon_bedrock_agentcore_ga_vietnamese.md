---
title: "Amazon Bedrock AgentCore chính thức ra mắt tại Tokyo và các khu vực AWS: Đưa AI Agent vào thế giới thực"
date: 2025-10-15
draft: false
categories: ["AWS", "AI", "Machine Learning"]
tags: ["Amazon-Bedrock", "AgentCore", "AI-agent", "agentic-AI", "machine-learning", "enterprise-AI", "production-AI", "AWS-Tokyo"]
description: "Amazon Bedrock AgentCore chính thức GA - nền tảng enterprise-grade để đưa AI Agent từ prototype vào production với security, scalability và reliability. Hỗ trợ hàng tỷ agents chạy đồng thời."
---

# Amazon Bedrock AgentCore chính thức ra mắt tại Tokyo và các khu vực AWS: Đưa AI Agent vào thế giới thực

**Tác giả:** AWS Japan (Người dịch), Swami Sivasubramanian (Tác giả gốc)  
**Chức vụ:** Phó Chủ tịch AWS Agentic AI  
**Ngày xuất bản:** 15 tháng 10 năm 2025  
**Ngày xuất bản bản gốc:** 13 tháng 10 năm 2025  
**Danh mục:** Amazon Bedrock, Amazon Machine Learning, Announcements, General

---

## Tổng quan

Bài viết này là bản dịch tiếng Nhật của blog có chữ ký của Swami Sivasubramanian, Phó Chủ tịch AWS Agentic AI, được xuất bản vào ngày 13 tháng 10 theo giờ Mỹ "[Make agents a reality with Amazon Bedrock AgentCore: Now generally available](https://aws.amazon.com/jp/blogs/machine-learning/amazon-bedrock-agentcore-is-now-generally-available/)".

**Đưa AI Agent từ nguyên mẫu đến môi trường sản xuất với bảo mật, khả năng mở rộng và độ tin cậy**

---

## Mở đầu: Điểm chuyển đổi của AI Agent

Khi chúng tôi ra mắt AWS vào năm 2006, chúng tôi tin rằng điện toán đám mây sẽ biến đổi cách các tổ chức xây dựng và mở rộng công nghệ của họ. Hiện tại, chúng ta đang đứng tại một điểm chuyển đổi tương tự với AI Agent.

Chúng tôi hình dung một thế giới nơi **hàng tỷ AI Agent cộng tác và biến đổi mọi thứ từ công việc hàng ngày đến các quy trình kinh doanh phức tạp**. Tuy nhiên, để biến điều này thành hiện thực, chúng ta cần nhiều hơn là framework hoặc công cụ phát triển low-code cho nhà phát triển.

AI Agent mà doanh nghiệp có thể tin tưởng làm nền tảng kinh doanh cần **nền tảng vận hành cấp doanh nghiệp**. Nền tảng đó phải được xây dựng an toàn, đáng tin cậy, có khả năng mở rộng và tính đến tính chất không xác định của AI Agent.

AWS tận dụng kinh nghiệm hỗ trợ xây dựng hệ thống quan trọng và cung cấp nền tảng toàn diện để các tổ chức đa dạng có thể tự tin chuyển hệ thống agentic sang môi trường sản xuất thông qua [Amazon Bedrock AgentCore](https://aws.amazon.com/jp/bedrock/agentcore/).

---

## AgentCore: Đưa AI Agent nhanh chóng vào môi trường sản xuất

Với việc AgentCore chính thức ra mắt, **tất cả nhà phát triển có thể nhanh chóng chuyển AI Agent từ môi trường pilot sang môi trường sản xuất quy mô đầy đủ**.

### Tính năng chính

- **Cung cấp nền tảng cần thiết cho xây dựng, triển khai và vận hành**: Dễ dàng tích hợp công cụ, bộ nhớ và dữ liệu để agent xử lý workflow phức tạp
- **Triển khai đơn giản**: Chỉ với vài dòng code, triển khai AI Agent lên một trong những môi trường runtime an toàn và có khả năng mở rộng nhất hiện có
- **Vận hành cấp doanh nghiệp**: Trang bị kiểm soát và quản lý truy cập cần thiết cho triển khai
- **Không cần quản lý hạ tầng**: Thực thi mọi thứ mà không cần quản lý hạ tầng
- **Linh hoạt**: Dễ dàng bắt đầu với bất kỳ model hoặc agent framework nào

### Thành tích áp dụng

AgentCore SDK đã được **tải xuống hơn 1 triệu lần** bởi khách hàng ở mọi quy mô trong nhiều ngành công nghiệp khác nhau.

**Khách hàng ban đầu:**
- Clearwater Analytics (CWAN)
- Cox Automotive
- Druva
- Ericsson
- Experian
- Heroku
- National Australia Bank
- Sony Group
- Thomson Reuters

**Đối tác AWS:**
- Accenture
- Cisco
- Deloitte
- Salesforce

---

## AgentCore: Nền tảng AI Agent toàn diện

Xây dựng AI Agent không đơn giản. Ví dụ, bạn cần hiểu cách tích hợp với nhà cung cấp ID, cách thực hiện bộ nhớ và khả năng quan sát (observability), cách tích hợp với công cụ, v.v.

Nền tảng AI Agent của chúng tôi cung cấp **dịch vụ được quản lý đầy đủ trên toàn bộ vòng đời phát triển AI Agent từ xây dựng đến triển khai và vận hành**. Bạn có thể kết hợp bất kỳ model và framework nào, cung cấp tính linh hoạt tối đa trong khi truy cập vào hạ tầng và công cụ cấp doanh nghiệp.

### 1. Xây dựng AI Agent tự do

Lĩnh vực AI Agent đang phát triển nhanh chóng, với các framework, model và protocol mới xuất hiện gần như hàng tuần.

**Nhóm dịch vụ dạng module của AgentCore:**
- Sử dụng kết hợp theo nhu cầu
- Có thể sử dụng độc lập
- Nhà phát triển xây dựng AI Agent theo cách họ muốn

**Framework được hỗ trợ:**
- CrewAI
- Google ADK
- LangGraph
- LlamaIndex
- OpenAI Agents SDK
- Strands Agents

**Model được hỗ trợ:**
- Model có sẵn trên Amazon Bedrock
- OpenAI
- Gemini
- Các model có sẵn bên ngoài Bedrock

### 2. Nền tảng cho AI Agent tạo ra giá trị

AI Agent tạo ra giá trị bằng cách thực hiện các hành động cụ thể.

**AgentCore Code Interpreter:**
- AI Agent có thể tạo và thực thi code một cách an toàn trong môi trường tách biệt

**AgentCore Browser:**
- AI Agent có thể thao tác ứng dụng web ở quy mô lớn

**AgentCore Gateway:**
- Chuyển đổi API hiện có hoặc hàm AWS Lambda thành công cụ tương thích với agent
- Kết nối với MCP server hiện có
- Tích hợp liền mạch với công cụ và dịch vụ kinh doanh của bên thứ ba (Jira, Asana, Zendesk, v.v.)
- Cho phép tích hợp an toàn trên toàn bộ hệ thống doanh nghiệp

**AgentCore Identity:**
- Xác thực và ủy quyền phù hợp sử dụng chuẩn OAuth
- Agent có thể truy cập và thao tác an toàn trên tất cả các công cụ

### 3. AI Agent nhận biết ngữ cảnh với bộ nhớ thông minh

Để AI Agent thực sự hiệu quả, nó cần **duy trì và học ngữ cảnh từ các tương tác theo thời gian**.

**Ví dụ về AI Agent hỗ trợ bán hàng:**
- Ghi nhớ thông tin từ nhiều cuộc trò chuyện với khách hàng
- Ghi nhớ ngành của khách hàng, hạn chế ngân sách, yêu cầu kỹ thuật
- Tránh lặp lại cùng một câu hỏi
- Cung cấp đề xuất được cá nhân hóa

**Ví dụ về khắc phục sự cố kỹ thuật:**
- Nhớ kết quả của các lần debug trước đó
- Cung cấp giải pháp tập trung hơn

**AgentCore Memory:**
- Xây dựng trải nghiệm nhận biết ngữ cảnh tiên tiến mà không cần quản lý hạ tầng bộ nhớ phức tạp
- Xây dựng và duy trì hiểu biết chi tiết về sở thích của người dùng, tương tác trong quá khứ và ngữ cảnh liên quan

### 4. Khả năng quan sát toàn diện cho agent đáng tin cậy

AI Agent suy luận theo thời gian thực và thực hiện hành động một cách không xác định. Do đó, nhà phát triển cần **khả năng hiển thị hoàn toàn** đối với suy luận và hành động của AI Agent.

**AgentCore Observability:**
- Dashboard thời gian thực
- Audit trail chi tiết
- Theo dõi tất cả hành động
- Debug nhanh chóng các vấn đề
- Tối ưu hóa hiệu suất liên tục

**Tương thích OpenTelemetry (OTEL):**
- Protocol và công cụ chuẩn hóa
- Thu thập và định tuyến dữ liệu telemetry như metric, log, trace

**Tích hợp với công cụ hiện có:**
- Dynatrace
- Datadog
- Arize Phoenix
- LangSmith
- Langfuse

### 5. Độ tin cậy dẫn đầu ngành cho mọi quy mô

Không giống như ứng dụng truyền thống, thời lượng workload của AI Agent về bản chất là không thể dự đoán được.

**AgentCore Runtime:**
- Được thiết kế để đáp ứng sự thay đổi
- Tự động mở rộng từ không đến hàng nghìn session theo nhu cầu
- Cung cấp **runtime 8 giờ dẫn đầu ngành** (cho các tác vụ chạy dài)

### 6. Bảo mật AI Agent cấp doanh nghiệp

AI Agent hành động thay mặt người dùng trong khi truy cập an toàn vào nhiều hệ thống và xử lý dữ liệu nhạy cảm, do đó **không thể thỏa hiệp trong việc thực hiện bảo mật mạnh mẽ và tuân thủ quy định**.

**Tính năng bảo mật của AgentCore:**
- Hỗ trợ môi trường Virtual Private Cloud (VPC)
- Hỗ trợ [AWS PrivateLink](https://aws.amazon.com/jp/privatelink/)
- Giữ lưu lượng mạng riêng tư và an toàn

**Bảo mật của AgentCore Runtime:**
- Cung cấp bảo mật dẫn đầu ngành thông qua **công nghệ microVM**
- Cung cấp môi trường điện toán tách biệt độc đáo cho mỗi session của AI Agent
- Ngăn chặn rò rỉ dữ liệu
- Duy trì tính toàn vẹn của tất cả các tương tác

### 7. Cân bằng tốc độ, quy mô và bảo mật với AgentCore

AgentCore có thể dễ dàng xây dựng AI Agent sẵn sàng cho môi trường sản xuất thông qua MCP server hoạt động trong môi trường phát triển tích hợp (IDE) như [Kiro](https://kiro.dev/) và Cursor AI.

**Thời gian bắt đầu:** Chỉ vài phút

**Đặc điểm:**
- Không phải là công cụ đơn giản hóa, mà là giải pháp sẵn sàng sản xuất đầy đủ tính năng
- Duy trì bảo mật mạnh mẽ
- Mở rộng ngay lập tức từ không đến hàng nghìn session

**Lợi ích:**
Nhóm của bạn có thể **tiến lên từ ý tưởng đến triển khai một cách tự tin và nhanh chóng** với sự hiểu biết rằng AI Agent được xây dựng trên nền tảng đã được chứng minh.

---

## Câu chuyện thành công của khách hàng thực hiện giá trị AI Agent

Từ môi trường y tế được quản lý của Cohere Health, đến hệ thống phức tạp và kỹ thuật của Ericsson, và sự chuyển đổi quy mô toàn cầu của Sony Group, các tổ chức tiên tiến đang tận dụng AgentCore để thúc đẩy đổi mới AI thế hệ tiếp theo xuyên ngành.

### Epsilon: Chuyển đổi chiến dịch marketing

**Công ty:** Epsilon (thuộc Publicis Groupe, công ty quảng cáo lớn nhất thế giới)

**Giải pháp:** Intelligent Campaign Automation

**Nội dung thực hiện:**
- Cá nhân hóa và đổi mới chiến dịch cho các thương hiệu lớn
- Tự động hóa thiết kế chiến dịch trên nhiều kênh
- Tự động hóa target audience
- Tối ưu hóa thời gian thực

**Kết quả:**
- Giảm thời gian thực thi
- Cải thiện độ chính xác target khách hàng ở quy mô lớn

### Amazon Devices: Chuyển đổi ngành sản xuất bằng tự động hóa workflow thông minh

**Tổ chức:** Nhóm Amazon Devices Operations & Supply Chain

**Cách tiếp cận:** Cách tiếp cận sản xuất tận dụng AI Agent

**Workflow:**
1. Một AI Agent đọc yêu cầu sản phẩm và tạo quy trình kiểm tra chi tiết cho kiểm soát chất lượng
2. Agent khác huấn luyện hệ thống tầm nhìn cần thiết cho robot trên dây chuyền sản xuất

**Kết quả:**
- **Tinh chỉnh model phát hiện đối tượng vốn mất vài ngày thời gian kỹ thuật giờ đây hoàn thành trong vòng 1 giờ với độ chính xác cao**

**Tầm nhìn:**
Thử nghiệm này chỉ là khởi đầu của tầm nhìn về sản xuất thông minh nơi AI Agent hợp lý hóa quá trình từ yêu cầu sản phẩm ban đầu đến sản xuất cuối cùng.

### Cohere Health®: Tăng tốc quyết định y tế bằng AI Agent

**Công ty:** Cohere Health® (Công ty trí tuệ lâm sàng)

**Giải pháp:** Cohere Review Resolve™

**Mục đích:**
- Tăng cường sự hợp tác giữa người trả tiền bảo hiểm (Payer) và nhà cung cấp dịch vụ y tế (Provider)
- Cải thiện tốc độ và độ chính xác của quyết định lâm sàng trước và sau chăm sóc

**Chức năng:**
- Phân tích cả dữ liệu có cấu trúc và phi cấu trúc như hồ sơ lâm sàng, ghi chú bệnh nhân, FAX
- Nhanh chóng xác định và hiển thị bằng chứng để xác minh sự cần thiết về mặt y tế của điều trị được yêu cầu
- Cung cấp ngữ cảnh lâm sàng cần thiết cho người đánh giá bảo hiểm y tế để xem xét yêu cầu phê duyệt trước
- Phản hồi thông minh các câu hỏi của người đánh giá

**Tính năng quan trọng của AgentCore:**
- Audit trail toàn diện
- Hỗ trợ session mở rộng
- Khả năng duy trì lịch sử qua workflow phức tạp kéo dài nhiều giờ

**Lợi ích dự kiến:**
- **Giảm 30-40% thời gian xem xét**
- Đáp ứng thời gian xử lý bắt buộc quan trọng
- Tăng tốc quyền truy cập chăm sóc cho bệnh nhân
- Tăng sự tuân thủ điều trị
- Cải thiện kết quả và giảm chi phí
- **Cải thiện khoảng 30% độ chính xác quyết định lâm sàng**
- Đóng góp vào giảm chi phí y tế và cải thiện kết quả bệnh nhân

### Ericsson: AI Agent trong ngành viễn thông – Đơn giản hóa hệ thống phức tạp

**Công ty:** Ericsson (Nhà lãnh đạo toàn cầu trong công nghệ viễn thông)

**Người phụ trách:** Dag Lindbo (Người chịu trách nhiệm về AI và công nghệ tiên tiến trong Business Area Networks)

**Thách thức:**
"Tại Ericsson, các hệ thống 3G/4G/5G/6G của chúng tôi **bao gồm hàng triệu dòng code và trải dài qua hàng nghìn hệ thống con kết nối với nhau**. Điều này thể hiện nhiều thập kỷ đổi mới kỹ thuật trong hạ tầng quan trọng cấp quốc gia."

**Giá trị của AgentCore:**
- Thực hiện sự hợp nhất quan trọng của dữ liệu và thông tin
- Cung cấp AI Agent với khả năng chưa từng có trong R&D thế giới thực
- **Dẫn đến tạo ra giá trị hai chữ số trên toàn bộ hàng chục nghìn nhân viên**
- Có thể sử dụng bất kỳ agent framework nào, điều này rất quan trọng để mở rộng qua nhiều nhóm và use case

### Sony Group: Tận dụng agent trong ngành giải trí

**Công ty:** Sony Group Corporation (Một trong những công ty công nghệ-giải trí hàng đầu thế giới)

**Người phụ trách:** Masahiro Oba (Trưởng phòng D&T Platform AI Acceleration)

**Bình luận:**
"Agentic AI là **công nghệ thiết yếu để thực hiện sự tinh vi hóa và hiệu quả hóa hoạt động ở mức độ chưa từng có**. Mặt khác, cũng là sự thật rằng có nhiều thách thức kỹ thuật trong việc tận dụng agentic AI."

**Nội dung thực hiện:**
- Xây dựng Agentic AI Platform toàn nhóm
- Thực hiện bảo mật, observability và khả năng mở rộng cấp doanh nghiệp
- Thực hiện kết nối liền mạch với tài nguyên AI đa nền tảng

**Kết quả:**
"Bằng cách đặt Amazon Bedrock AgentCore vào trung tâm hệ sinh thái AI của chúng tôi, chúng tôi **có được khả năng quản lý và chia sẻ lượng lớn AI, và có thể tăng tốc chuyển đổi AI với sự tự tin và an toàn**."

---

## Bình luận từ khách hàng Nhật Bản sử dụng Amazon Bedrock AgentCore

### Weathernews Inc.

**Người phụ trách:** Hideaki Dewa (Giám đốc điều hành, Giám đốc công nghệ và sản phẩm)

Tại Weathernews, chúng tôi đã phát hành phiên bản beta của AI Agent trong "Weather Agent" hướng tới BtoC và dịch vụ SaaS hướng tới BtoB, bắt đầu cung cấp dữ liệu và giải pháp liên quan đến thời tiết.

Để nhiều người dùng hơn có thể yên tâm sử dụng sau khi phát hành chính thức, **hiệu suất, bảo mật, quản trị và khả năng mở rộng là không thể thiếu**. Lần này, bằng cách tận dụng dịch vụ được quản lý của Amazon Bedrock AgentCore, chúng tôi tin rằng có thể tiến một bước lớn về phía giải quyết những thách thức này.

Chúng tôi mong muốn mang lại giá trị kinh doanh lớn hơn bao giờ hết cho khách hàng cùng với nhóm dịch vụ được quản lý đầy đủ mới được cung cấp.

### TIS Inc.

**Người phụ trách:** Kuninori Kuroda (Giám đốc kinh doanh hạ tầng CNTT, Bộ phận kinh doanh công nghệ hạ tầng CNTT)

Khách hàng của chúng tôi bao gồm một loạt các đối tượng từ doanh nghiệp cấp doanh nghiệp coi trọng an toàn và quản trị đến các công ty vừa và nhỏ nhắm đến tăng trưởng thông qua tận dụng AI.

**Quản lý danh tính, cách ly session và đảm bảo tính minh bạch vận hành** của Amazon Bedrock AgentCore trở thành nền tảng cho "AI Agent có thể yên tâm giao phó công việc" đối với những khách hàng như vậy.

Khi chất lượng phản hồi, tính nhất quán của đối thoại và tính ổn định hoạt động của dịch vụ được sắp xếp, nó trở thành trải nghiệm dễ sử dụng và thoải mái cho người dùng. Chúng tôi tin rằng trải nghiệm như vậy nuôi dưỡng sự tin tưởng và dẫn đến dịch vụ tiếp tục được lựa chọn.

**Chính vì có Amazon Bedrock AgentCore, TIS tin tưởng rằng có thể tiếp tục đáp ứng kỳ vọng như một nhà cung cấp giải pháp AI Agent đáng tin cậy từ khách hàng**.

### DeNA Co., Ltd.

**Người phụ trách:** Hiroshi Toyama (Kỹ sư ML Ops)

Tại DeNA, chúng tôi sẽ **đẩy mạnh việc tận dụng AI trên toàn công ty với khẩu hiệu AI All-In**. Trong trường hợp đó, thiết kế hệ thống tính đến bảo mật dữ liệu trở nên quan trọng để tận dụng an toàn mô hình ngôn ngữ lớn (LLM) trong kinh doanh.

Tôi cảm thấy rằng Amazon Bedrock AgentCore cung cấp các tính năng để hỗ trợ thiết kế hệ thống như vậy. Tôi mong đợi sự phát triển hơn nữa của các tính năng bảo mật dữ liệu tinh vi trong tương lai.

### Nomura Research Institute, Ltd.

**Người phụ trách:** Takahiko Inaba (Giám đốc điều hành phụ trách AI, Giám đốc trung tâm đổi mới sản xuất)

Amazon Bedrock AgentCore **có tiềm năng thay đổi căn bản chuyển đổi số của doanh nghiệp**.

**Đặc điểm chính:**
- Kết nối linh hoạt với nhiều framework mã nguồn mở đa dạng
- 7 lựa chọn dịch vụ cung cấp chức năng độc đáo
- Chức năng cách ly session hoàn toàn
- Hỗ trợ workload dài tối đa 8 giờ

Điều này cho phép **mong đợi vận hành ổn định trong các nhiệm vụ kinh doanh nâng cao hơn**. Qua xác minh từ phiên bản preview, hiện tại chúng tôi đang thúc đẩy việc tận dụng trong nhiều dự án nội bộ và bên ngoài, và sẽ tiếp tục xác minh để đóng góp vào việc đảm bảo lợi thế cạnh tranh của khách hàng.

---

## Khu vực cung cấp

AgentCore hiện đang **được cung cấp chính thức tại 9 khu vực AWS**, hỗ trợ triển khai quy mô toàn cầu của khách hàng.

**Khu vực có sẵn:**
- Châu Á Thái Bình Dương (Mumbai)
- Châu Á Thái Bình Dương (Singapore)
- Châu Á Thái Bình Dương (Sydney)
- **Châu Á Thái Bình Dương (Tokyo)**
- Châu Âu (Dublin)
- Châu Âu (Frankfurt)
- Mỹ phía Đông (Bắc Virginia)
- Mỹ phía Đông (Ohio)
- Mỹ phía Tây (Oregon)

Cũng có thể tăng tốc thời gian thực hiện giá trị bằng cách tận dụng [AWS Marketplace](https://aws.amazon.com/marketplace/solutions/ai-agents-and-tools?trk=70405219-a2f8-4816-a915-9932f523f1bd&sc_channel=el) cung cấp AI Agent và công cụ được thiết kế và xây dựng trước để hoạt động trên AgentCore.

---

## Kết luận: Xây dựng tương lai

Các tổ chức thành công trong kỷ nguyên AI không phải là những tổ chức dự đoán hoàn hảo tương lai, mà là **những tổ chức xây dựng trên nền tảng đã được chứng minh trong khi duy trì tính linh hoạt để phát triển**.

Bằng cách lấy AgentCore làm nền tảng, bạn có thể có được:

- Quyền truy cập vào dịch vụ chuyên dụng để triển khai và vận hành AI Agent
- Đối tác có **kinh nghiệm khoảng 20 năm** hỗ trợ chuyển đổi doanh nghiệp trong khi đảm bảo bảo mật ở quy mô toàn cầu

**Hãy bắt đầu với AgentCore ngay bây giờ** – Truy cập [aws.amazon.com/bedrock/agentcore/](https://aws.amazon.com/bedrock/agentcore/) và bắt đầu xây dựng tương lai của agent!

---

**Bài viết gốc:** [Make agents a reality with Amazon Bedrock AgentCore: Now generally available](https://aws.amazon.com/jp/blogs/machine-learning/amazon-bedrock-agentcore-is-now-generally-available/)
