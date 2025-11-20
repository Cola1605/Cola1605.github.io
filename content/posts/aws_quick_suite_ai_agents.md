---
title: "Công bố Amazon Quick Suite - Đồng đội AI thực hiện hành động và trả lời câu hỏi"
date: 2025-11-20
draft: false
categories:
  - "AWS"
  - "AI"
  - "Business Intelligence"
  - "Automation"
tags:
  - "Amazon QuickSight"
  - "Amazon Q"
  - "AI Agents"
  - "Generative AI"
  - "Workflow Automation"
author: "Esra Kayabali, Donnie Prakoso"
translator: "日平"
description: "Amazon Quick Suite là bộ công cụ AI mới giúp trả lời câu hỏi và thực hiện hành động trong công việc. Người dùng có thể tận dụng nghiên cứu, business intelligence và tự động hóa được hỗ trợ bởi AI trong một workspace duy nhất mà không cần chuyển đổi giữa nhiều ứng dụng."
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/reimagine-the-way-you-work-with-ai-agents-in-amazon-quick-suite/)

---

*Bài viết này là bản dịch của "Announcing Amazon Quick Suite - AI-powered teammates that answer questions and take action".*

## Giới thiệu Amazon Quick Suite

Amazon Quick Suite là một bộ công cụ dựa trên AI mới giúp trả lời câu hỏi và thực hiện các hành động trong công việc của bạn. Bộ công cụ này cho phép người dùng tận dụng các tính năng nghiên cứu, business intelligence và tự động hóa được hỗ trợ bởi AI trong một workspace duy nhất mà không cần phải chuyển đổi giữa nhiều ứng dụng.

### Quick Index: Nền tảng cốt lõi

Là thành phần nền tảng của Quick Suite, **Quick Index** hoạt động ở chế độ nền và tích hợp tất cả dữ liệu của bạn - từ cơ sở dữ liệu và data warehouse đến tài liệu và email. Điều này tạo ra một knowledge base thống nhất giúp nâng cao độ chính xác của phản hồi AI và giảm thời gian cần thiết để truy xuất thông tin.

Quick Index tự động lập chỉ mục và chuẩn bị các tệp đã tải lên và dữ liệu phi cấu trúc được thêm vào Quick Suite, cho phép tìm kiếm, sắp xếp và truy cập dữ liệu hiệu quả. Ví dụ, khi tìm kiếm thông tin cập nhật về một dự án cụ thể, Quick Index sẽ ngay lập tức trả về kết quả từ các tài liệu đã tải lên, ghi chú cuộc họp, tệp dự án và tài liệu tham khảo trong một lần tìm kiếm thống nhất - bạn không cần phải kiểm tra các repository hoặc hệ thống tệp khác nhau.

Để biết thêm chi tiết, vui lòng xem [trang tổng quan về Quick Index](https://aws.amazon.com/jp/quicksuite/index/).

### Quick Research: Từ thách thức kinh doanh phức tạp đến hiểu biết cấp chuyên gia

**Quick Research** là một công cụ mạnh mẽ thực hiện nghiên cứu toàn diện về dữ liệu doanh nghiệp nội bộ và các nguồn bên ngoài, cung cấp các thông tin chi tiết có thể hành động và phù hợp với ngữ cảnh trong vài phút đến vài giờ - công việc trước đây thường mất nhiều thời gian hơn.

Quick Research phân tích có hệ thống các câu hỏi phức tạp và tạo ra một kế hoạch nghiên cứu có tổ chức. Bắt đầu từ một prompt đơn giản, nó sẽ tự động tạo ra một khung nghiên cứu chi tiết phác thảo phương pháp tiếp cận và các nguồn dữ liệu cần thiết cho phân tích toàn diện.

Sau khi Quick Research tạo ra kế hoạch, bạn có thể dễ dàng tinh chỉnh nó thông qua cuộc trò chuyện bằng ngôn ngữ tự nhiên. Khi bạn hài lòng với kế hoạch, Quick Research sẽ thu thập thông tin từ nhiều nguồn ở chế độ nền. Nó sử dụng lý luận nâng cao để xác minh các phát hiện nghiên cứu và cung cấp phân tích chi tiết kèm theo trích dẫn.

Quick Research tích hợp với dữ liệu doanh nghiệp được kết nối với Quick Suite. Quick Suite là một knowledge base thống nhất kết nối với dashboard, tài liệu, cơ sở dữ liệu và các nguồn bên ngoài như Amazon S3, Snowflake, Google Drive, Microsoft SharePoint. Quick Research cung cấp các thông tin chi tiết quan trọng dựa trên nguồn gốc và hiển thị lộ trình suy nghĩ rõ ràng, giúp bạn xác minh độ chính xác, hiểu logic đằng sau các khuyến nghị và trình bày kết quả một cách tự tin. Bạn có thể theo dõi kết quả nghiên cứu về nguồn gốc và xác minh kết luận thông qua trích dẫn nguồn. Điều này làm cho nó trở thành công cụ lý tưởng cho các chủ đề phức tạp đòi hỏi phân tích chi tiết.

Để biết thêm chi tiết, vui lòng xem [trang tổng quan về Quick Research](https://aws.amazon.com/jp/quicksuite/research/).

### Quick Sight: Business Intelligence được hỗ trợ bởi AI

**Quick Sight** cung cấp khả năng business intelligence được hỗ trợ bởi AI, chuyển đổi dữ liệu thành các thông tin chi tiết có thể hành động thông qua các truy vấn ngôn ngữ tự nhiên và trực quan hóa tương tác.

Bằng cách sử dụng các prompt dạng hội thoại, bạn có thể tạo dashboard và tóm tắt. Điều này cho phép phân tích nâng cao mà không cần kỹ năng chuyên môn và cũng rút ngắn thời gian phát triển dashboard.

Với Quick Sight, bạn có thể đặt câu hỏi về dữ liệu bằng ngôn ngữ tự nhiên và ngay lập tức nhận được trực quan hóa, tóm tắt và thông tin chi tiết. Tích hợp với generative AI cho phép bạn nhận được câu trả lời từ dashboard và dataset mà không cần chuyên môn kỹ thuật.

Sử dụng tính năng **Scenarios** (Kịch bản), bạn có thể thực hiện phân tích giả định bằng ngôn ngữ tự nhiên theo hướng dẫn từng bước, khám phá các kịch bản kinh doanh phức tạp và tìm ra câu trả lời nhanh hơn bao giờ hết.

Hơn nữa, bạn có thể hành động với một cú nhấp chuột đối với các thông tin chi tiết thu được mà không cần chuyển đổi ứng dụng.

Để biết thêm chi tiết, vui lòng xem [trang tổng quan về Quick Sight](https://aws.amazon.com/jp/quicksuite/quicksight/).

### Quick Flows: Tự động hóa cho mọi người

**Quick Flows** cho phép bất kỳ ai tự động hóa các tác vụ lặp đi lặp lại bằng cách mô tả workflow bằng ngôn ngữ tự nhiên, ngay cả khi không có kiến thức kỹ thuật. Quick Flows truy xuất thông tin từ các nguồn nội bộ và bên ngoài, thực hiện các hành động trong ứng dụng kinh doanh, tạo nội dung và xử lý các yêu cầu cụ thể của quy trình.

Bắt đầu từ một yêu cầu kinh doanh đơn giản, nó tạo ra một flow gồm nhiều bước bao gồm các bước đầu vào để thu thập thông tin, nhóm xử lý để xử lý bằng AI và các bước đầu ra để tạo và hiển thị kết quả.

Sau khi thiết lập flow, bạn có thể chia sẻ nó với đồng nghiệp hoặc các nhóm khác chỉ bằng một cú nhấp chuột. Để chạy flow, người dùng mở nó từ thư viện hoặc gọi nó trong chat, cung cấp đầu vào cần thiết, điều chỉnh đầu ra trong khi trò chuyện với agent và tùy chỉnh thêm kết quả.

Để biết thêm chi tiết, vui lòng xem [trang tổng quan về Quick Flows](https://aws.amazon.com/jp/quicksuite/flows/).

### Quick Automate: Tự động hóa quy trình cấp doanh nghiệp

**Quick Automate** hỗ trợ các nhóm kỹ thuật trong việc xây dựng và triển khai tự động hóa nâng cao cho các quy trình nhiều bước phức tạp trải rộng trên các phòng ban, hệ thống và tích hợp bên thứ ba. Bằng cách sử dụng xử lý ngôn ngữ tự nhiên được hỗ trợ bởi AI, Quick Automate chuyển đổi các quy trình kinh doanh phức tạp thành workflow đa agent. Bạn chỉ cần mô tả những gì bạn muốn tự động hóa hoặc tải lên tài liệu quy trình.

Trong khi Quick Flows xử lý các workflow đơn giản, **Quick Automate** được thiết kế cho các quy trình kinh doanh toàn diện và phức tạp như onboarding khách hàng, tự động hóa mua sắm, thủ tục tuân thủ - những quy trình đòi hỏi nhiều bước phê duyệt, tích hợp hệ thống và phối hợp giữa các phòng ban. Quick Automate cung cấp khả năng kiểm soát tích hợp nâng cao với các tính năng giám sát, debug, quản lý phiên bản và triển khai toàn diện.

Quick Automate tạo ra một kế hoạch tự động hóa toàn diện bao gồm các bước và hành động chi tiết. Nó có thể sử dụng **UI agents** (agent giao diện người dùng) hiểu các chỉ thị bằng ngôn ngữ tự nhiên, điều hướng tự động trên các trang web, hoàn thành nhập form, trích xuất dữ liệu và tạo ra đầu ra có cấu trúc cho các bước tự động hóa tiếp theo.

Hơn nữa, sử dụng môi trường hoạt động trực quan, bạn có thể định nghĩa các custom agent với chỉ thị, kiến thức và công cụ để hoàn thành các tác vụ liên quan đến quy trình cụ thể. Không cần coding.

Quick Automate bao gồm các tính năng cấp doanh nghiệp như quản lý vai trò người dùng và tính năng **human-in-the-loop** (con người trong vòng lặp) - chuyển các tác vụ cụ thể cho người dùng hoặc nhóm để xem xét và phê duyệt bởi con người trước khi tiếp tục workflow. Dịch vụ này cung cấp khả năng quan sát toàn diện với giám sát thời gian thực, theo dõi tỷ lệ thành công và audit trail cho tuân thủ và quản trị.

Để biết thêm chi tiết, vui lòng xem [trang tổng quan về Quick Automate](https://aws.amazon.com/jp/quicksuite/automate/).

## Các tính năng nền tảng bổ sung

Quick Suite bao gồm các tính năng nền tảng khác giúp tổ chức dữ liệu liền mạch trong toàn doanh nghiệp và tương tác với AI theo ngữ cảnh.

### Spaces (Không gian làm việc)

**Spaces** cung cấp một cách đơn giản để tất cả người dùng kinh doanh thêm ngữ cảnh riêng của họ bằng cách tải lên các tệp liên quan đến công việc hoặc mục đích sử dụng cụ thể của họ, hoặc kết nối với các dataset hoặc repository cụ thể. Ví dụ, bạn có thể tạo một Space cho kế hoạch quý bao gồm bảng tính ngân sách, báo cáo nghiên cứu thị trường và tài liệu kế hoạch chiến lược. Bạn cũng có thể thiết lập một Space cho ra mắt sản phẩm kết nối với hệ thống quản lý dự án và cơ sở dữ liệu phản hồi khách hàng. Spaces có thể mở rộng quy mô từ sử dụng cá nhân đến triển khai toàn doanh nghiệp trong khi duy trì quyền truy cập và tích hợp mượt mà với các tính năng của Quick Suite.

### Chat Agents (Agent trò chuyện)

Quick Suite bao gồm các **agent hỗ trợ phân tích** cho phép bạn tương tác với dữ liệu và workflow thông qua ngôn ngữ tự nhiên. Quick Suite bao gồm các agent tích hợp sẵn có thể trả lời câu hỏi về tất cả dữ liệu của bạn, cũng như các custom chat agent có thể được cấu hình với chuyên môn cụ thể hoặc ngữ cảnh kinh doanh. Custom chat agent có thể được tùy chỉnh theo phòng ban hoặc mục đích sử dụng cụ thể. Ví dụ, một agent bán hàng được kết nối với dữ liệu catalog sản phẩm và thông tin giá cả được lưu trữ trong Spaces, hoặc một agent tuân thủ được thiết lập với các yêu cầu quy định và hành động yêu cầu phê duyệt.

## Lưu ý khác

### Dành cho khách hàng Amazon QuickSight hiện tại

Khách hàng Amazon QuickSight sẽ được nâng cấp lên Quick Suite. Quick Suite là một workspace kỹ thuật số tích hợp bao gồm các tính năng business intelligence hiện có của QuickSight (hiện được gọi là "Quick Sight") cùng với các tính năng AI agent mới. Đây là thay đổi về giao diện và tính năng - kết nối dữ liệu, quyền truy cập người dùng, nội dung, kiểm soát bảo mật, quyền người dùng và cài đặt quyền riêng tư vẫn hoàn toàn giữ nguyên. Không có di chuyển, migration hoặc thay đổi dữ liệu nào.

Quick Suite áp dụng mô hình giá theo đăng ký cho mỗi người dùng, với giá theo mức sử dụng cho Quick Index và các tính năng tùy chọn khác. Để biết thêm chi tiết, vui lòng xem [trang giá của Quick Suite](https://aws.amazon.com/jp/quicksuite/pricing/).

## Bắt đầu sử dụng

Amazon Quick Suite cung cấp một nhóm AI assistant giúp bạn tận dụng dữ liệu để có được câu trả lời cần thiết và cho phép bạn hành động ngay lập tức từ những câu trả lời đó, giúp bạn tập trung vào các hoạt động có giá trị cao nhằm cải thiện kết quả kinh doanh và khách hàng.

Truy cập [Hướng dẫn bắt đầu](https://aws.amazon.com/jp/quicksuite/getting-started/) để bắt đầu sử dụng Amazon Quick Suite ngay hôm nay.

Chúc bạn phát triển vui vẻ! — Từ Esra và Donnie

---

### Về các tác giả

**Esra Kayabali** là Senior Solution Architect tại AWS, chuyên về analytics bao gồm data warehouse, data lake, phân tích big data, streaming dữ liệu batch và real-time, và tích hợp dữ liệu. Cô có hơn 10 năm kinh nghiệm trong phát triển phần mềm và kiến trúc giải pháp. Cô đam mê học tập cộng tác với cộng đồng, chia sẻ kiến thức và hướng dẫn cộng đồng trong hành trình công nghệ đám mây.

**[Donnie Prakoso](https://aws.amazon.com/blogs/aws/author/donnie/)** là kỹ sư phần mềm, barista tự xưng và Principal Developer Advocate tại AWS. Anh có hơn 17 năm kinh nghiệm trong ngành công nghệ, từ viễn thông, ngân hàng đến startup. Hiện tại, anh tập trung vào việc giúp các nhà phát triển hiểu các công nghệ khác nhau để biến ý tưởng thành hiện thực. Anh yêu cà phê và thích thảo luận về mọi chủ đề từ microservices đến AI/ML.

---

*Bản dịch do Solution Architect Takebayashi đảm nhận.*

### Các liên kết hữu ích

- [Trung tâm tài nguyên Bắt đầu](https://aws.amazon.com/jp/getting-started?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)
- [Tin tức mới nhất về AWS](https://aws.amazon.com/jp/new?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)
- [Lịch sự kiện AWS](https://aws.amazon.com/jp/events/?sc_ichannel=ha&sc_icampaign=jp-event_awsblogs&sc_icontent=news-resources)
- [builders.flash - Tạp chí web chính thức của AWS](https://aws.amazon.com/jp/builders-flash/?sc_ichannel=ha&sc_icampaign=builders-flash_awsblogsb&sc_icontent=news-resources)
- [Các case study khách hàng tại Nhật Bản](https://aws.amazon.com/jp/solutions/case-studies-jp?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)

### Theo dõi chúng tôi

- [Twitter](https://twitter.com/awscloud_jp)
- [Facebook](https://www.facebook.com/アマゾン-ウェブ-サービス-600986860012140/)
- [LinkedIn](https://www.linkedin.com/company/amazon-web-services)
- [Twitch](https://www.twitch.tv/aws)
- [Email cập nhật mới nhất](https://pages.awscloud.com/jp/communication-preferences?languages=japanese)
- [RSS Feed](https://aws.amazon.com/jp/blogs/news/feed/)
