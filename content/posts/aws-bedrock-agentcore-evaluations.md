---
title: "Amazon Bedrock AgentCore bổ sung đánh giá chất lượng và kiểm soát chính sách để triển khai các AI agent đáng tin cậy"
date: 2025-12-11
draft: false
slug: "aws-bedrock-agentcore-evaluations-policy"
description: "Amazon Bedrock AgentCore ra mắt tính năng đánh giá chất lượng, kiểm soát chính sách, episode và streaming hai chiều để triển khai AI agent production-ready."
tags: ["AWS", "Amazon Bedrock", "AgentCore", "AI Agent", "Quality Evaluation", "Policy Controls", "Production AI", "Enterprise AI"]
categories: ["Cloud", "AI and Machine Learning", "DevOps and Infrastructure"]
author: "Danilo Poccia"
---

# Amazon Bedrock AgentCore bổ sung đánh giá chất lượng và kiểm soát chính sách để triển khai các AI agent đáng tin cậy

**Nguồn:** AWS Blog  
**Ngày xuất bản:** 11 tháng 12 năm 2025  
**Ngày công bố:** 2 tháng 12 năm 2025  
**URL:** https://aws.amazon.com/jp/blogs/news/amazon-bedrock-agentcore-adds-quality-evaluations-and-policy-controls-for-deploying-trusted-ai-agents/

## Tác giả

**Danilo Poccia** ([@danilop](https://twitter.com/danilop))

## Tổng quan

Các tính năng mới của Amazon Bedrock AgentCore đã giảm thiểu thêm các rào cản trong việc đưa AI agent vào môi trường production. Đã bổ sung đánh giá chất lượng, kiểm soát chính sách, chức năng episode và streaming hai chiều.

## Giới thiệu

Ngày 2 tháng 12 năm 2025, chúng tôi công bố các tính năng mới của Amazon Bedrock AgentCore nhằm loại bỏ thêm các rào cản ngăn cách AI agent khỏi môi trường production. Amazon Bedrock AgentCore là nền tảng tiên tiến giúp các tổ chức thuộc mọi ngành công nghiệp xây dựng, triển khai và vận hành các agent hiệu suất cao một cách an toàn ở mọi quy mô.

Chỉ 5 tháng sau khi ra preview, AgentCore SDK đã được **tải xuống hơn 2 triệu lần**.

## Câu chuyện thành công của khách hàng

### PGA TOUR

PGA TOUR, một người tiên phong trong thể thao và là nhà lãnh đạo đổi mới, đã xây dựng hệ thống tạo nội dung multi-agent để tạo các bài viết cho nền tảng kỹ thuật số.

**Thành quả:**
- Tăng tốc độ viết nội dung **1.000 phần trăm**
- Giảm chi phí **95%**
- Cung cấp dịch vụ toàn diện cho tất cả các tay chơi trên sân

### Workday

Workday, một nhà cung cấp phần mềm độc lập (ISV), đã tích hợp AgentCore Code Interpreter vào Workday Planning Agent.

**Lợi ích:**
- Bảo vệ dữ liệu an toàn
- Chức năng thiết yếu cho việc khám phá dữ liệu tài chính
- Phân tích dữ liệu tài chính và dữ liệu nghiệp vụ bằng truy vấn ngôn ngữ tự nhiên

**Thành quả:**
- Giảm **30%** thời gian dành cho phân tích lập kế hoạch hàng ngày
- Tiết kiệm khoảng **100 giờ mỗi tháng**

### Grupo Elfa

Grupo Elfa, nhà phân phối và bán lẻ của Brazil, đang tận dụng AgentCore Observability.

**Lợi ích:**
- Truy xuất nguồn gốc kiểm toán hoàn chỉnh của agent
- Số liệu thời gian thực
- Chuyển đổi quy trình phản ứng sau sự cố thành hoạt động chủ động

**Thành quả:**
- Xử lý hàng nghìn báo giá mỗi ngày
- **100% khả năng truy xuất nguồn gốc** các quyết định và tương tác của agent
- Giảm **50%** thời gian giải quyết vấn đề

## Thách thức

Khi các tổ chức mở rộng quy mô triển khai agent, họ đối mặt với thách thức trong việc thiết lập các ranh giới phù hợp và kiểm tra chất lượng để triển khai agent một cách tự tin.

### Rủi ro chính

- Truy cập không phù hợp vào dữ liệu nhạy cảm
- Quyết định không hợp lệ
- Hành vi không mong đợi

## Tính năng mới

### 1. AgentCore Policies (preview)

Xác định ranh giới rõ ràng cho các hành động của agent bằng cách chặn các lời gọi công cụ AgentCore Gateway trước khi thực thi bằng các chính sách có quyền chi tiết.

#### Lợi ích chính

- Kiểm soát các hành động mà agent có thể thực hiện
- Có thể áp dụng bên ngoài vòng lặp suy luận của agent
- Xác thực quyết định trước khi đến công cụ, hệ thống và dữ liệu

#### Ngôn ngữ chính sách

**1. Ngôn ngữ tự nhiên**
- Tạo chính sách bằng ngôn ngữ tự nhiên

**2. Cedar**
- Sử dụng trực tiếp ngôn ngữ chính sách mã nguồn mở với quyền chi tiết
- URL: https://www.cedarpolicy.com/

#### Tích hợp Gateway

Bằng cách tích hợp với AgentCore Gateway, chặn các lời gọi công cụ khi chúng xảy ra và xử lý yêu cầu trong khi duy trì tốc độ vận hành.

#### Ví dụ về chính sách

Ví dụ xác thực quyền truy cập vào công cụ xử lý hoàn tiền:

**Điều kiện:**
- Chỉ người dùng được xác thực có vai trò refund-agent mới có thể truy cập
- Số tiền giới hạn dưới 200 đô la Mỹ

```cedar
permit(
  principal is AgentCore::OAuthUser,
  action == AgentCore::Action::"RefundTool__process_refund",
  resource == AgentCore::Gateway::"<GATEWAY_ARN>"
)
when {
  principal.hasTag("role") &&
  principal.getTag("role") == "refund-agent" &&
  context.input.amount < 200
};
```

#### Chức năng nâng cao

- Khả năng tạo chính sách dựa trên ngôn ngữ tự nhiên
- Xác thực đối chiếu với schema công cụ
- Xác nhận điều kiện an toàn bằng suy luận tự động
- Tạo chính sách đúng cú pháp và đúng ngữ nghĩa theo dự định
- Có thể tạo và xác thực chính sách trực tiếp trong môi trường hỗ trợ coding như MCP server

#### Chế độ hoạt động

**Chế độ áp dụng:** Cho phép hoặc từ chối quyền truy cập vào tool call một cách hiệu quả

**Chế độ log:** Kiểm tra và xác thực chính sách trước khi bật trong môi trường production

### 2. AgentCore Evaluations (preview)

Dịch vụ được quản lý hoàn toàn để giám sát và phân tích liên tục hiệu suất của agent dựa trên hành vi thực tế.

#### Các tiêu chí đánh giá tích hợp sẵn

1. **Độ chính xác (Correctness)**
   - Đánh giá thông tin trong câu trả lời của agent có chính xác dựa trên sự thật hay không

2. **Độ trung thực (Faithfulness)**
   - Đánh giá thông tin trong câu trả lời có được hỗ trợ bởi ngữ cảnh/nguồn được cung cấp hay không

3. **Tính hữu ích (Helpfulness)**
   - Đánh giá mức độ hữu ích và giá trị của phản hồi của agent từ góc độ người dùng

4. **Tính có hại (Harmfulness)**
   - Đánh giá phản hồi có chứa nội dung có hại hay không

5. **Khuôn mẫu (Stereotypes)**
   - Phát hiện nội dung khái quát hóa về cá nhân hoặc nhóm

6. **Lựa chọn công cụ (Tool Selection)**
   - Đánh giá agent có chọn công cụ phù hợp cho tác vụ hay không

7. **Độ chính xác tham số công cụ (Tool Parameter Accuracy)**
   - Đánh giá có trích xuất đúng tham số từ truy vấn người dùng hay không

8. **Tỷ lệ đạt mục tiêu (Goal Achievement)**
   - Đánh giá agent có thể hoàn thành tác vụ hay không

9. **Mức độ liên quan của ngữ cảnh (Context Relevance)**
   - Đánh giá ngữ cảnh được cung cấp có liên quan đến câu hỏi hay không

#### Đánh giá tùy chỉnh

Có thể tạo hệ thống chấm điểm dựa trên mô hình tùy chỉnh được cấu hình với prompt và mô hình đã chọn.

**Các thành phần của đánh giá tùy chỉnh:**
- Lựa chọn mô hình
- Cài đặt nhiệt độ
- Số token đầu ra tối đa
- Prompt tùy chỉnh
- Hướng dẫn đánh giá
- Định nghĩa thang đo (nhãn văn bản số hoặc tùy chỉnh)
- Phạm vi đánh giá (single trace, full session, mỗi lần gọi công cụ)

#### Tích hợp CloudWatch

Kết quả được hiển thị trực quan trong Amazon CloudWatch và có thể giám sát tập trung cùng với các thông tin chi tiết từ AgentCore Observability. Cũng có thể thiết lập cảnh báo và alarm cho điểm đánh giá để giám sát chất lượng agent một cách chủ động.

#### Giai đoạn sử dụng

**Kiểm tra trước khi triển khai:**
- Đối chiếu agent với baseline để đảm bảo các phiên bản có lỗi không đến tay người dùng

**Môi trường production:**
- Sử dụng để cải thiện liên tục agent
- Ví dụ: Nếu mức độ hài lòng của customer service agent giảm trong 8 giờ hoặc điểm lịch sự giảm hơn 10% trong 8 giờ, kích hoạt cảnh báo ngay lập tức

#### Nguồn dữ liệu

- AgentCore agent endpoint
- CloudWatch log group được sử dụng bởi external agent

#### Cài đặt đánh giá

- Lựa chọn tỷ lệ lấy mẫu
- Cài đặt bộ lọc tùy chọn
- IAM service role (tạo mới hoặc sử dụng hiện có)

### 3. AgentCore Memory Episodes

Chiến lược bộ nhớ dài hạn mới cho phép agent học từ kinh nghiệm trong quá khứ và cung cấp hỗ trợ hữu ích hơn trong các cuộc đối thoại tương lai bằng cách áp dụng các bài học đó.

#### Cơ chế

1. **Ghi lại Episode**
   - Ghi lại các episode có cấu trúc ghi lại ngữ cảnh của tương tác với agent, quy trình suy luận, các hành động được thực hiện và kết quả

2. **Phân tích phản chiếu (Reflection)**
   - Reflection agent phân tích các episode để trích xuất các thông tin chi tiết và mẫu rộng hơn

3. **Áp dụng học tập**
   - Khi đối mặt với các tác vụ tương tự, lấy lại những gì đã học để tăng tính nhất quán trong ra quyết định và giảm thời gian xử lý

#### Ví dụ thực tế

**Kịch bản:** Agent đặt chỗ du lịch

**Học tập:** Học từ các mẫu đặt chỗ, chẳng hạn như khi đi công tác cho cuộc họp với khách hàng cần di chuyển chuyến bay sang giờ muộn hơn

**Áp dụng:** Áp dụng mẫu đã học để đề xuất trong lần đặt chỗ tiếp theo

#### Lợi ích

- Chỉ bao gồm trong ngữ cảnh của agent những học tập cụ thể cần thiết để hoàn thành tác vụ thay vì danh sách dài tất cả các đề xuất có thể
- Giảm nhu cầu về hướng dẫn tùy chỉnh

### 4. AgentCore Runtime Bidirectional Streaming

Hỗ trợ streaming hai chiều để dễ dàng triển khai trải nghiệm hội thoại tự nhiên và phản hồi nhanh.

#### Chức năng

- Voice agent nghe và thích ứng trong khi người dùng đang nói
- Người phụ trách có thể ngắt lời agent giữa chừng phản hồi
- Thích ứng ngay lập tức với ngữ cảnh mới mà không cần chờ agent hoàn thành đầu ra hiện tại
- Thay đổi phản hồi động dựa trên lời nói của người dùng

#### Sự khác biệt so với trước đây

Khác với cuộc đối thoại theo lượt truyền thống, tạo ra cuộc trò chuyện tự nhiên trôi chảy.

#### Giá trị

Quản lý cơ sở hạ tầng xử lý luồng giao tiếp đồng thời phức tạp, điều này đòi hỏi nỗ lực kỹ thuật lớn nếu xây dựng từ đầu.

## Các region khả dụng

### AgentCore with Policies

Khả dụng tại các region sau:

- **Hoa Kỳ:** East (Ohio, Virginia Bắc), West (Oregon)
- **Châu Á Thái Bình Dương:** Mumbai, Singapore, Sydney, Tokyo
- **Châu Âu:** Frankfurt, Ireland

### AgentCore Evaluations (preview)

Khả dụng tại các region sau:

- **Hoa Kỳ:** East (Ohio, Virginia Bắc), West (Oregon)
- **Châu Á Thái Bình Dương:** Sydney
- **Châu Âu:** Frankfurt

## Giá cả

- **Mô hình:** Trả theo sử dụng không có nghĩa vụ trả trước
- **Free tier:** Khả dụng như một phần của AWS Free Tier
- **Chi tiết:** https://aws.amazon.com/bedrock/pricing/

## Tương thích

### Framework

AgentCore tương thích với các framework sau:

- CreWAI
- LangGraph
- LlamaIndex
- Strands Agents
- Bất kỳ framework mã nguồn mở nào

### Mô hình

Có thể làm việc với bất kỳ foundation model nào.

### Cách sử dụng

Các dịch vụ AgentCore có thể sử dụng cùng nhau hoặc độc lập.

### MCP Server

Có thể bắt đầu sử dụng môi trường phát triển được hỗ trợ AI yêu thích bằng AgentCore open source MCP server.

**MCP Server URL:** https://awslabs.github.io/mcp/servers/amazon-bedrock-agentcore-mcp-server

## Kiến trúc kỹ thuật

### Policy Engine

Tập hợp các chính sách được đánh giá tại gateway endpoint.

**Chế độ hoạt động:**
- **Chế độ áp dụng:** Cho phép hoặc từ chối quyền truy cập vào tool call một cách hiệu quả
- **Chế độ log:** Kiểm tra và xác thực chính sách trước khi bật trong môi trường production

### Nguồn dữ liệu đánh giá

- AgentCore agent endpoint
- CloudWatch log group được sử dụng bởi external agent

### Cài đặt đánh giá

- Lựa chọn tỷ lệ lấy mẫu
- Cài đặt bộ lọc tùy chọn
- IAM service role (tạo mới hoặc sử dụng hiện có)

## Kết luận

Các tính năng mới của Amazon Bedrock AgentCore cho phép triển khai AI agent vào môi trường production một cách an toàn và hiệu quả.

### Các tính năng bổ sung chính

1. **AgentCore Policies** - Xác định ranh giới rõ ràng cho các hành động của agent
2. **AgentCore Evaluations** - Giám sát hiệu suất dựa trên hành vi thực tế
3. **Memory Episodes** - Chiến lược bộ nhớ dài hạn học từ kinh nghiệm trong quá khứ
4. **Bidirectional Streaming** - Trải nghiệm hội thoại tự nhiên và phản hồi nhanh

### Bước tiếp theo

Hãy tận dụng các tính năng mới này để xây dựng AI agent đáng tin cậy và tối đa hóa giá trị kinh doanh.

Để biết thêm chi tiết, vui lòng xem các liên kết sau:

## Liên kết liên quan

- [Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/)
- [AgentCore Developer Guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)
- [Cedar Policy Language](https://www.cedarpolicy.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [AgentCore MCP Server](https://awslabs.github.io/mcp/servers/amazon-bedrock-agentcore-mcp-server)
- [AWS Builder Capabilities](https://builder.aws.com/capabilities/)
- [Amazon Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- [AWS Free Tier](https://aws.amazon.com/free)

---

**Thẻ:** Amazon Bedrock, AgentCore, AI Agents, Machine Learning, AWS re:Invent  
**Danh mục:** AWS, AI/ML, Amazon Bedrock
