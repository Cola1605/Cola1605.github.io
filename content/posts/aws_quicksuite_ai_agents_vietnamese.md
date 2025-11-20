---
title: "Giới thiệu Amazon Quick Suite: Đồng đội AI thông minh giúp trả lời câu hỏi và thực hiện hành động"
date: 2025-11-20
tags: ["Amazon QuickSight", "AI", "Generative AI", "Business Intelligence", "AWS"]
categories: ["AWS", "AI & Machine Learning"]
description: "Amazon Quick Suite tập hợp các chức năng nghiên cứu, business intelligence và tự động hóa được hỗ trợ bởi AI vào một môi trường làm việc duy nhất"
---

**Bài viết gốc**: [Announcing Amazon Quick Suite: your agentic teammate for answering questions and taking action](https://aws.amazon.com/jp/blogs/aws/reimagine-the-way-you-work-with-ai-agents-in-amazon-quick-suite/)  
**Ngày công bố**: 9 tháng 10 năm 2025 (Bản dịch: 20 tháng 11 năm 2025)  
**Tác giả**: Satoshi Takebayashi (Dịch thuật), Esra Kayabali, Donnie Prakoso

---

## Giới thiệu

Bài viết này là bản dịch của [Announcing Amazon Quick Suite: your agentic teammate for answering questions and taking action](https://aws.amazon.com/jp/blogs/aws/reimagine-the-way-you-work-with-ai-agents-in-amazon-quick-suite/) được công bố ngày 9 tháng 10 năm 2025. Bản dịch tiếng Nhật được thực hiện bởi Technical Account Manager Satoshi Takebayashi.

Hôm nay, chúng tôi xin giới thiệu **Amazon Quick Suite**. Đây là trợ lý AI mới giúp trả lời nhanh chóng các câu hỏi trong công việc và chuyển đổi những hiểu biết đó thành hành động. Thay vì phải chuyển đổi giữa nhiều ứng dụng để thu thập dữ liệu, tìm kiếm các dấu hiệu và xu hướng quan trọng, và hoàn thành các tác vụ thủ công, Quick Suite tập hợp các chức năng nghiên cứu, business intelligence và tự động hóa được hỗ trợ bởi AI vào một môi trường làm việc duy nhất. Bạn có thể phân tích dữ liệu thông qua truy vấn bằng ngôn ngữ tự nhiên, tìm thông tin quan trọng từ các nguồn nội bộ và bên ngoài doanh nghiệp trong vài phút, và tự động hóa quy trình từ các tác vụ đơn giản đến các workflow phức tạp trải rộng trên nhiều phòng ban.

![Tổng quan Amazon Quick Suite](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_1.png)

---

## Tổng quan về Quick Suite

Người dùng doanh nghiệp thường phải thu thập dữ liệu từ nhiều ứng dụng khác nhau như lấy thông tin chi tiết khách hàng, kiểm tra chỉ số hiệu suất, xác nhận thông tin sản phẩm nội bộ, và phân tích đối thủ cạnh tranh. Quy trình phân mảnh như vậy thường đòi hỏi phải tham khảo ý kiến từ các nhóm chuyên môn để phân tích các tập dữ liệu phức tạp, và trong một số trường hợp cần phải thực hiện định kỳ. Điều này làm giảm hiệu quả và dẫn đến việc không có đủ kiến thức cần thiết cho việc ra quyết định.

Quick Suite giúp khắc phục những thách thức này bằng cách tập hợp các trợ lý hỗ trợ AI cho nghiên cứu, business intelligence và tự động hóa vào một không gian làm việc kỹ thuật số tích hợp.

---

## Các chức năng tích hợp nâng cao năng suất

Quick Suite bao gồm các chức năng tích hợp sau:

### Nghiên cứu – Quick Research

Quick Research tăng tốc nghiên cứu phức tạp và có được phân tích toàn diện hơn bằng cách kết hợp kiến thức doanh nghiệp, dữ liệu bên thứ ba cao cấp và dữ liệu internet.

### Business Intelligence – Quick Sight

Quick Sight cung cấp chức năng business intelligence được hỗ trợ bởi AI, chuyển đổi dữ liệu thành thông tin có thể hành động thông qua truy vấn ngôn ngữ tự nhiên và hiển thị trực quan tương tác, cho phép mọi người đạt được quyết định nhanh chóng và kết quả kinh doanh tốt hơn.

### Tự động hóa – Quick Flows và Quick Automate

Quick Flows và Quick Automate cung cấp cho người dùng và nhóm kỹ thuật khả năng tự động hóa mọi quy trình kinh doanh từ các tác vụ định kỳ đơn giản đến các workflow phức tạp xuyên phòng ban, tăng tốc thực hiện trong toàn tổ chức và giảm công việc thủ công.

---

## Quick Index: Cơ sở tri thức tích hợp

Quick Index tạo ra một kho lưu trữ an toàn, có thể tìm kiếm, tích hợp tài liệu, tệp và dữ liệu ứng dụng để thực hiện các phản hồi và hiểu biết sâu sắc được hỗ trợ bởi AI trong toàn tổ chức.

Là thành phần nền tảng của Quick Suite, Quick Index hoạt động ở chế độ nền và tích hợp tất cả dữ liệu từ cơ sở dữ liệu và kho dữ liệu đến tài liệu và email. Điều này tạo ra một cơ sở tri thức tích hợp giúp nâng cao độ chính xác của phản hồi AI và rút ngắn thời gian truy xuất thông tin.

Quick Index tự động lập chỉ mục và chuẩn bị các tệp tải lên và dữ liệu phi cấu trúc được thêm vào Quick Suite, cho phép tìm kiếm, sắp xếp và truy cập dữ liệu hiệu quả. Ví dụ, khi tìm kiếm thông tin cập nhật về một dự án cụ thể, Quick Index ngay lập tức trả về kết quả từ tài liệu đã tải lên, ghi chú cuộc họp, tệp dự án và tài liệu tham khảo trong một tìm kiếm tích hợp duy nhất - không cần kiểm tra các kho lưu trữ hoặc hệ thống tệp khác nhau.

Chi tiết xem tại [trang tổng quan Quick Index](https://aws.amazon.com/jp/quicksuite/index/).

---

## Quick Research: Từ thách thức kinh doanh phức tạp đến hiểu biết cấp độ chuyên gia

Quick Research là công cụ mạnh mẽ điều tra toàn diện dữ liệu nội bộ doanh nghiệp và nguồn bên ngoài, cung cấp hiểu biết sâu sắc thực tế phù hợp với ngữ cảnh trong vài phút đến vài giờ. Đây là công việc mà trước đây sẽ mất nhiều thời gian hơn.

### Các chức năng chính

Quick Research phân tách có hệ thống các câu hỏi phức tạp và tạo ra kế hoạch nghiên cứu có tổ chức. Bắt đầu từ một prompt đơn giản, nó tự động tạo ra một khung nghiên cứu chi tiết phác thảo phương pháp tiếp cận và nguồn dữ liệu cần thiết cho phân tích toàn diện.

![Quick Research tạo kế hoạch nghiên cứu](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_research_1-1.png)

Sau khi Quick Research tạo ra kế hoạch, bạn có thể dễ dàng tinh chỉnh nó thông qua cuộc trò chuyện bằng ngôn ngữ tự nhiên.

![Tinh chỉnh kế hoạch nghiên cứu](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_research_1-2.png) Khi hài lòng với kế hoạch, Quick Research thu thập thông tin từ nhiều nguồn ở chế độ nền. Nó sử dụng lý luận nâng cao để xác minh kết quả nghiên cứu và cung cấp phân tích chi tiết kèm trích dẫn.

![Quick Research thực hiện nghiên cứu](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_research_1-3-1.png)

Quick Research tích hợp với dữ liệu doanh nghiệp được kết nối với Quick Suite.

![Trích dẫn nguồn từ Quick Research](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_research_5.png) Quick Suite là cơ sở tri thức tích hợp kết nối với dashboard, tài liệu, cơ sở dữ liệu và các nguồn bên ngoài như Amazon S3, Snowflake, Google Drive, Microsoft SharePoint. Quick Research cung cấp hiểu biết quan trọng dựa trên nguồn gốc và cho thấy lộ trình suy nghĩ rõ ràng, hỗ trợ xác minh độ chính xác, hiểu logic đằng sau khuyến nghị và trình bày kết quả với tự tin. Bạn có thể theo dõi kết quả nghiên cứu về nguồn gốc và xác minh kết luận thông qua trích dẫn nguồn. Điều này làm cho nó trở thành công cụ lý tưởng cho các chủ đề phức tạp đòi hỏi phân tích chi tiết.

Chi tiết xem tại [trang tổng quan Quick Research](https://aws.amazon.com/jp/quicksuite/research/).

---

## Quick Sight: Business Intelligence được hỗ trợ bởi AI

Quick Sight cung cấp chức năng business intelligence được hỗ trợ bởi AI, chuyển đổi dữ liệu thành hiểu biết dẫn đến hành động thông qua truy vấn ngôn ngữ tự nhiên và trực quan hóa tương tác.

### Các chức năng chính

Bằng cách sử dụng prompt dạng đối thoại, bạn có thể tạo dashboard và tóm tắt. Điều này cho phép phân tích nâng cao mà không cần kỹ năng chuyên môn và cũng rút ngắn thời gian phát triển dashboard.

![Quick Sight dashboard](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_quicksight-1.png)

Với Quick Sight, bạn có thể đặt câu hỏi về dữ liệu bằng ngôn ngữ tự nhiên và ngay lập tức nhận được trực quan hóa, tóm tắt và hiểu biết.

![Tạo trực quan hóa bằng ngôn ngữ tự nhiên](/images/posts/aws_quicksuite_ai_agents/2025_quicksuite_quicksight_0.gif) Thông qua tích hợp với generative AI, bạn có thể nhận câu trả lời từ dashboard và bộ dữ liệu mà không cần chuyên môn kỹ thuật.

![Tương tác với dữ liệu bằng AI](/images/posts/aws_quicksuite_ai_agents/2025_quicksuite_quicksight_1-1.gif)

Bằng cách sử dụng chức năng kịch bản, bạn có thể thực hiện phân tích giả thuyết bằng ngôn ngữ tự nhiên theo hướng dẫn từng bước, khám phá các tình huống kinh doanh phức tạp và tìm câu trả lời nhanh hơn bao giờ hết.

![Phân tích kịch bản what-if](/images/posts/aws_quicksuite_ai_agents/2025_quicksuite_quicksight_2-1.gif)

Hơn nữa, bạn có thể phản hồi với một cú nhấp chuột đối với những hiểu biết thu được mà không cần chuyển đổi ứng dụng.

![Hành động một cú nhấp chuột](/images/posts/aws_quicksuite_ai_agents/2025_quicksuite_quicksight_3-1.gif)

Chi tiết xem tại [trang tổng quan Quick Sight](https://aws.amazon.com/jp/quicksuite/quicksight/).

---

## Quick Flows: Tự động hóa dành cho mọi người

Với Quick Flows, bất kỳ ai cũng có thể tự động hóa các tác vụ lặp đi lặp lại mà không cần kiến thức kỹ thuật, chỉ bằng cách mô tả workflow bằng ngôn ngữ tự nhiên. Quick Flows lấy thông tin từ các nguồn nội bộ và bên ngoài, thực hiện hành động trong các ứng dụng kinh doanh, tạo nội dung và xử lý các yêu cầu đặc thù của quy trình.

### Các chức năng chính

Bắt đầu từ yêu cầu kinh doanh đơn giản, nó tạo ra flow gồm nhiều bước bao gồm bước đầu vào để thu thập thông tin, nhóm xử lý cho xử lý AI và bước đầu ra để tạo và hiển thị kết quả.

![Quick Flows tạo workflow](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_flows_3.png)

![Cấu hình flow nhiều bước](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_flows_4.png)

Sau khi thiết lập flow, bạn có thể chia sẻ với đồng nghiệp hoặc nhóm khác chỉ bằng một cú nhấp chuột.

![Thực thi và chia sẻ flow](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_flows_5.png) Để chạy flow, người dùng mở từ thư viện hoặc gọi trong chat, cung cấp đầu vào cần thiết, điều chỉnh đầu ra trong khi trò chuyện với agent và tùy chỉnh thêm kết quả.

Chi tiết xem tại [trang tổng quan Quick Flows](https://aws.amazon.com/jp/quicksuite/flows/).

---

## Quick Automate: Tự động hóa quy trình cấp độ doanh nghiệp

Quick Automate hỗ trợ nhóm kỹ thuật trong việc xây dựng và triển khai tự động hóa nâng cao cho các quy trình phức tạp nhiều giai đoạn trải rộng qua các phòng ban, hệ thống và tích hợp bên thứ ba. Bằng cách sử dụng xử lý ngôn ngữ tự nhiên được hỗ trợ bởi AI, Quick Automate chuyển đổi các quy trình kinh doanh phức tạp thành workflow đa agent. Điều này có thể được tạo chỉ bằng cách mô tả nội dung bạn muốn tự động hóa hoặc tải lên tài liệu quy trình.

### Sự khác biệt với Quick Flows

Trong khi Quick Flows xử lý các workflow đơn giản, Quick Automate được thiết kế cho các quy trình kinh doanh toàn diện và phức tạp đòi hỏi nhiều bước phê duyệt, tích hợp hệ thống và phối hợp xuyên phòng ban như giới thiệu khách hàng, tự động hóa mua sắm, quy trình tuân thủ. Quick Automate cung cấp khả năng kiểm soát tích hợp nâng cao với chức năng giám sát, gỡ lỗi, quản lý phiên bản và triển khai rộng rãi.

### Các chức năng chính

Quick Automate tạo ra kế hoạch tự động hóa toàn diện bao gồm các bước và hành động chi tiết. Nó có thể sử dụng UI agent hiểu hướng dẫn ngôn ngữ tự nhiên, điều hướng tự động trang web, hoàn thành đầu vào form, trích xuất dữ liệu và tạo đầu ra có cấu trúc cho các bước tự động hóa tiếp theo.

![Quick Automate kế hoạch tự động hóa](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_automate_1.png)

![UI agent tự động điều hướng](/images/posts/aws_quicksuite_ai_agents/2025_quicksuite_quickautomate-1-1.gif)

Hơn nữa, bằng cách sử dụng môi trường vận hành trực quan, bạn có thể định nghĩa các agent tùy chỉnh với hướng dẫn, kiến thức và công cụ để hoàn thành các tác vụ liên quan đến quy trình cụ thể.

![Tạo agent tùy chỉnh](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_automate_4.png) Không cần viết code.

Quick Automate bao gồm các chức năng cấp độ doanh nghiệp như quản lý vai trò người dùng và chức năng human-in-the-loop để chuyển các tác vụ cụ thể cho người dùng hoặc nhóm để xem xét và phê duyệt của con người trước khi tiếp tục workflow. Dịch vụ này cung cấp khả năng quan sát toàn diện với giám sát thời gian thực, theo dõi tỷ lệ thành công và nhật ký kiểm toán cho tuân thủ và quản trị.

Chi tiết xem tại [trang tổng quan Quick Automate](https://aws.amazon.com/jp/quicksuite/automate/).

---

## Các chức năng nền tảng bổ sung

Quick Suite bao gồm các chức năng nền tảng khác thực hiện tổ chức dữ liệu liền mạch và tương tác với AI phù hợp ngữ cảnh trong toàn doanh nghiệp.

### Spaces

Spaces cung cấp cách dễ dàng cho tất cả người dùng doanh nghiệp thêm ngữ cảnh riêng bằng cách tải lên các tệp liên quan đến công việc hoặc mục đích sử dụng cụ thể của họ, hoặc kết nối với các bộ dữ liệu hoặc kho lưu trữ cụ thể.

Ví dụ, bạn có thể tạo Space cho kế hoạch quý bao gồm bảng tính ngân sách, báo cáo nghiên cứu thị trường và tài liệu kế hoạch chiến lược. Bạn cũng có thể thiết lập Space cho ra mắt sản phẩm kết nối với hệ thống quản lý dự án và cơ sở dữ liệu phản hồi khách hàng. Spaces có thể mở rộng từ sử dụng cá nhân đến triển khai toàn doanh nghiệp trong khi duy trì quyền truy cập và tích hợp trơn tru với các chức năng của Quick Suite.

![Spaces tổ chức dữ liệu theo ngữ cảnh](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_space-1.png)

### Chat Agent

Quick Suite bao gồm các agent hỗ trợ phân tích có thể tương tác với dữ liệu và workflow thông qua ngôn ngữ tự nhiên. Quick Suite bao gồm agent tích hợp có thể trả lời câu hỏi về tất cả dữ liệu và các agent chat tùy chỉnh có thể được cấu hình với chuyên môn cụ thể và ngữ cảnh kinh doanh.

![Chat Agent tùy chỉnh](/images/posts/aws_quicksuite_ai_agents/2025_quick-suite_chat-agent-2.png)

Các agent chat tùy chỉnh có thể được tùy chỉnh theo phòng ban hoặc mục đích sử dụng cụ thể. Ví dụ, agent bán hàng được kết nối với dữ liệu catalog sản phẩm và thông tin giá được lưu trữ trong Spaces, hoặc agent tuân thủ được thiết lập với các yêu cầu quy định và hành động yêu cầu phê duyệt.

---

## Các lưu ý khác

### Dành cho khách hàng hiện tại của Amazon QuickSight

Khách hàng của Amazon QuickSight sẽ được nâng cấp lên Quick Suite. Quick Suite là không gian làm việc kỹ thuật số tích hợp, bao gồm các chức năng business intelligence hiện có của QuickSight (hiện được gọi là "Quick Sight") cùng với các chức năng AI agent mới. Đây là thay đổi giao diện và chức năng, kết nối dữ liệu, truy cập người dùng, nội dung, kiểm soát bảo mật, quyền người dùng và cài đặt riêng tư vẫn hoàn toàn như cũ. Hoàn toàn không có di chuyển, di cư hoặc thay đổi dữ liệu.

### Giá cả

Quick Suite áp dụng mô hình giá đăng ký theo người dùng, với tính phí theo mức sử dụng cho Quick Index và các chức năng tùy chọn khác. Chi tiết xem tại [trang giá Quick Suite](https://aws.amazon.com/jp/quicksuite/pricing/).

---

## Bắt đầu sử dụng

Amazon Quick Suite cung cấp đội ngũ trợ lý AI giúp bạn tận dụng dữ liệu để có được câu trả lời cần thiết và có thể hành động ngay lập tức từ câu trả lời đó, cho phép bạn tập trung vào các hoạt động giá trị cao cải thiện kết quả kinh doanh và khách hàng.

Truy cập [Hướng dẫn bắt đầu](https://aws.amazon.com/jp/quicksuite/getting-started/) để bắt đầu sử dụng Amazon Quick Suite ngay bây giờ.

Chúc các bạn phát triển tốt đẹp!  
— Từ Esra và Donnie

---

## Về tác giả

![Esra Kayabali](/images/posts/aws_quicksuite_ai_agents/esrakayabali11-400x400-1.jpg)

**Esra Kayabali** là Senior Solutions Architect tại AWS, chuyên về analytics bao gồm data warehouse, data lake, phân tích big data, streaming dữ liệu batch và real-time, tích hợp dữ liệu. Có hơn 10 năm kinh nghiệm trong phát triển phần mềm và kiến trúc giải pháp. Đam mê học tập cộng tác với cộng đồng, chia sẻ kiến thức và hướng dẫn cộng đồng trong hành trình công nghệ đám mây.

![Donnie Prakoso](/images/posts/aws_quicksuite_ai_agents/donnie_profile_400x400.jpeg)

**Donnie Prakoso** là kỹ sư phần mềm, barista tự xưng và Principal Developer Advocate tại AWS. Có hơn 17 năm kinh nghiệm trong ngành công nghệ từ viễn thông, ngân hàng đến startup. Hiện tại tập trung vào việc hỗ trợ các nhà phát triển hiểu các công nghệ khác nhau để biến ý tưởng thành thực tế. Yêu thích cà phê và thích thảo luận về mọi chủ đề từ microservices đến AI/ML.

---

## Liên kết liên quan

- [Amazon Quick Suite](https://aws.amazon.com/quicksuite/)
- [Tổng quan Quick Index](https://aws.amazon.com/jp/quicksuite/index/)
- [Tổng quan Quick Research](https://aws.amazon.com/jp/quicksuite/research/)
- [Tổng quan Quick Sight](https://aws.amazon.com/jp/quicksuite/quicksight/)
- [Tổng quan Quick Flows](https://aws.amazon.com/jp/quicksuite/flows/)
- [Tổng quan Quick Automate](https://aws.amazon.com/jp/quicksuite/automate/)
- [Giá cả](https://aws.amazon.com/jp/quicksuite/pricing/)
- [Hướng dẫn bắt đầu](https://aws.amazon.com/jp/quicksuite/getting-started/)
