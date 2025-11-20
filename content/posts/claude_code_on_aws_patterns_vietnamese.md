---
title: "Giải thích các Pattern Claude Code trên AWS – Amazon Bedrock / AWS Marketplace"
date: 2025-11-20
tags: ["Amazon Bedrock", "AI", "AWS Marketplace", "Generative AI", "Claude Code"]
categories: ["AWS", "AI"]
description: "Giải thích 2 pattern chính để sử dụng Claude Code trên AWS - Amazon Bedrock và AWS Marketplace"
---

**Ngày công bố**: 20 tháng 11 năm 2025  
**Tác giả**: Kazuki Motohashi

---

## Giới thiệu

Dành cho những ai đang xem xét triển khai công cụ phát triển được hỗ trợ bởi AI, hoặc hiện đang sử dụng Claude Code nhưng gặp khó khăn về quản trị và quản lý chi phí, bài viết này sẽ giải thích 2 pattern chính để sử dụng Claude Code trên AWS.

Bài viết này nhắm đến các quản trị viên và người ra quyết định muốn triển khai công cụ phát triển được hỗ trợ AI trong tổ chức, những người đang sử dụng Claude Code Max plan và cảm thấy có vấn đề về mặt quản trị, hoặc những người muốn thống nhất thanh toán AWS và giấy phép phần mềm. Bài viết tập trung vào các pattern triển khai trong môi trường enterprise và tiêu chí lựa chọn, chứ không phải cách sử dụng hoặc Tips về Claude Code.

---

## Hợp tác chiến lược giữa AWS và Anthropic

AWS và Anthropic đã thiết lập quan hệ hợp tác chiến lược sâu rộng. Tính đến tháng 11 năm 2024, Amazon đã thực hiện khoản đầu tư lớn tổng cộng 8 tỷ đô la Mỹ, tương đương hơn 1 nghìn tỷ yên Nhật vào Anthropic. Không chỉ đầu tư, việc tích hợp ở cấp độ sản phẩm và dịch vụ thực tế cũng đang tiến triển vững chắc.

![Quan hệ hợp tác AWS và Anthropic](/images/posts/claude_code_on_aws_patterns/6faad8479450-20251031.png)

Trong Amazon Bedrock - dịch vụ AI tạo sinh của AWS, các mô hình Claude của Anthropic được cung cấp và tích hợp với các chức năng của Amazon Bedrock như fine-tuning, knowledge base, agent và guardrails. Mặc dù Claude là mô hình bên thứ ba, nhưng cơ chế sử dụng an toàn đã được thiết lập. Dữ liệu suy luận và dữ liệu huấn luyện của khách hàng sẽ không được lưu trữ trong AWS trừ khi được thiết lập rõ ràng, và vì mô hình Claude được host trên AWS nên Anthropic không thể xem dữ liệu khách hàng. Thông tin liên lạc được xử lý trong môi trường an toàn thông qua AWS backbone.

Hơn nữa, các mô hình Claude được triển khai trên cơ sở hạ tầng toàn cầu của AWS và có thể sử dụng ở các region trên toàn thế giới bao gồm cả Tokyo và Osaka. Ngoài suy luận thời gian thực, còn hỗ trợ suy luận batch và có thể đặt trước throughput với hình thức trả trước. Claude được tối ưu hóa cho AWS Trainium - accelerator do AWS phát triển, có thể sử dụng với capacity cao và latency thấp.

Repository **anthropic-on-aws** cũng được công bố, tập hợp các code sample và notebook tham khảo khi sử dụng mô hình Anthropic trên AWS. Ví dụ, có sample "Claude Code on Amazon Bedrock AgentCore".

![Claude Code on Amazon Bedrock AgentCore](/images/posts/claude_code_on_aws_patterns/619102ebbfef-20251031.png)

Đây là cơ chế deploy Claude Code lên Amazon Bedrock AgentCore Runtime và vận hành ở chế độ headless. Khi gửi request, mô hình Claude của Amazon Bedrock được gọi ở phía sau và lưu kết quả công việc vào Amazon S3, thực hiện cấu hình giống như Claude Code serverless.

Ngoài ra, "Claude Code Advanced Patterns – Complete Implementation Package" bao gồm các sample về sub-agent có thể sử dụng trong Claude Code và slash command, "Claude Sonnet 4.5 Memory Features Demo" giới thiệu cách liên kết tính năng memory của Claude 4.5 với AgentCore Memory. Như vậy, AWS đang tích cực phát thông tin về cách liên kết hiệu quả Anthropic Claude trên AWS.

---

## Claude Code là gì

Claude Code là công cụ command-line cho Agentic coding do Anthropic phát triển. Gần đây, UI cũng được cung cấp dưới dạng VS Code extension, và phiên bản web "Claude Code on the web" chạy trên trình duyệt cũng đã được phát hành.

Claude Code có đặc điểm là tính minh bạch về những gì đang được thực hiện trong quá trình xử lý và có thể kiểm soát chi tiết action nào được cho phép. Hơn nữa, vì được Anthropic phát triển nên được tối ưu hóa để phát huy tối đa khả năng của mô hình Claude, đây là điểm mạnh lớn nhất.

Claude Code có thể tận dụng các cơ chế như MCP (Model Context Protocol) và Agent Skills do Anthropic đề xuất. MCP là protocol chuẩn hóa liên kết với nguồn dữ liệu và công cụ bên ngoài, Skills cung cấp extension chức năng chuyên biệt cho các task cụ thể như xử lý document hoặc xử lý dữ liệu. Bằng cách kết hợp chúng, có thể xử lý nhiều loại coding task và tăng tốc đáng kể task phát triển.

---

## Pattern 1 Claude Code trên AWS: Liên kết với Amazon Bedrock

### Phương pháp liên kết cơ bản

Claude Code có thiết kế linh hoạt cho phép chuyển đổi provider của mô hình Claude được gọi ở phía sau. Khi có AWS credentials và quyền truy cập mô hình Amazon Bedrock, bằng cách chỉ định biến môi trường có thể thiết lập Claude Code sử dụng mô hình của Amazon Bedrock.

**Thiết lập bằng biến môi trường**

```bash
# Kích hoạt Amazon Bedrock
export CLAUDE_CODE_USE_BEDROCK=1

# Chỉ định AWS region
export AWS_REGION=ap-northeast-1

# Chỉ định model ID sử dụng
export ANTHROPIC_MODEL=global.anthropic.claude-sonnet-4-5-20250929-v1:0
```

**Chia sẻ thiết lập cho toàn team (.claude/settings.json)**

Nếu muốn team sử dụng cùng thiết lập, có thể mô tả trong `settings.json` dưới thư mục `.claude` để chia sẻ thiết lập cho toàn team.

```json
{
  "env": {
    "CLAUDE_CODE_USE_BEDROCK": "1",
    "AWS_REGION": "ap-northeast-1",
    "ANTHROPIC_MODEL": "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
  }
}
```

![Thiết lập Claude Code với Bedrock](/images/posts/claude_code_on_aws_patterns/aaf5fb6dfe3f-20251031.png)

Với thiết lập này, phần API provider sẽ tự động chuyển sang AWS Bedrock khi khởi động Claude Code.

### Các mô hình có sẵn

Trên Amazon Bedrock, các mô hình Claude mới nhất có sẵn. Vì mỗi mô hình có đặc tính khác nhau nên việc sử dụng phù hợp theo use case là quan trọng.

![So sánh mô hình Claude](/images/posts/claude_code_on_aws_patterns/fa28543fa4e9-20251031.png)

Trên Amazon Bedrock, các mô hình Claude mới nhất có sẵn. Vì mỗi mô hình có đặc tính khác nhau nên việc sử dụng phù hợp theo use case là quan trọng.

**Claude Sonnet 4.5 (Tối ưu cho agent phức tạp và coding)**

- Tối ưu cho suy luận phức tạp, coding task nâng cao và ứng dụng dạng agent
- Context window 200K token (phiên bản beta 1 triệu token cũng có sẵn)
- Giá: $3/M Tokens (đầu vào), $15/M Tokens (đầu ra)
- Đạt độ chính xác cao nhất trong SWE-bench Verified - benchmark phát triển phần mềm

**Claude Haiku 4.5 (Mô hình tốc độ cao với trí thông minh gần tiên tiến nhất)**

- Hiệu suất cao hơn Sonnet 4 thế hệ trước trong khi thực thi nhanh hơn gấp 2 lần
- Context window 200K token
- Giá: $1/M Tokens (đầu vào), $5/M Tokens (đầu ra)
- Phù hợp cho trường hợp cần đầu ra chất lượng cao trong khi chú trọng hiệu quả chi phí

Cả hai mô hình đều hỗ trợ đầu vào text và hình ảnh, chức năng vision, hỗ trợ đa ngôn ngữ và Extended thinking.

### Suy luận cross-region trong nước Nhật

![Suy luận cross-region trong nước Nhật](/images/posts/claude_code_on_aws_patterns/45c9c53a3a23-20251031.png)

Claude Sonnet/Haiku 4.5 cũng hỗ trợ suy luận cross-region giữa Tokyo và Osaka - các region trong nước Nhật. Mặc dù có thêm 10% phí premium so với tùy chọn suy luận phân tán toàn cầu, nhưng đây là chức năng được yêu cầu rất nhiều đặc biệt trong các ngành được quản lý.

Về hình ảnh hoạt động, ví dụ khi gọi mô hình Claude Sonnet 4.5 đến Tokyo region, cơ bản sẽ được xử lý tại Tokyo region. Nếu region bận thì sẽ tự động routing đến Osaka region. Lúc này thông tin liên lạc luôn đi qua AWS backbone, an toàn và không ra ngoài Nhật Bản nên yên tâm. Sử dụng chức năng này, Claude Code cũng có thể được sử dụng trong hình thức đóng trong nước Nhật.

### Kiến trúc tham khảo cho triển khai tổ chức

Kiến trúc tham khảo để dễ dàng triển khai trong tổ chức hình thức sử dụng Claude Code liên kết với Amazon Bedrock cũng được cung cấp

![Kiến trúc SSO với Bedrock](/images/posts/claude_code_on_aws_patterns/c87388388daf-20251031.png). Cụ thể là giải pháp để cấp phát thông tin xác thực tạm thời ở hình thức tích hợp với cơ chế SSO nội bộ, liên kết với các OIDC provider nội bộ như Okta, Microsoft Entra ID (cũ là Azure AD), Auth0.

Khi người dùng muốn sử dụng Claude Code, đầu tiên xác thực với OIDC provider như Entra ID, truyền ID token cho Amazon Cognito. Nhận AWS credentials tạm thời từ Cognito và gọi mô hình Claude của Amazon Bedrock. Có thể xác nhận chi tiết từ trang "Guidance for Claude Code with Amazon Bedrock" và có thể deploy ngay bằng CloudFormation template.

Về phía quản trị viên IT, liên kết với AWS account team để đảm bảo quota cần thiết (TPM/RPM) dựa trên team size, theo hướng dẫn đã được document hóa để cung cấp quyền truy cập an toàn và tập trung sử dụng enterprise ID provider hiện có. Quy trình là xác minh, test và phân phối gói cài đặt cho end user.

Về phía developer, chỉ cần triển khai gói được phân phối lên máy local là có thể sử dụng. Hỗ trợ macOS, Linux, Windows và không cần quyền truy cập AWS account. Xác thực với ID provider của tổ chức, nhận credentials tạm thời và truy cập Claude Code.

### Dashboard giám sát tình hình sử dụng

Không chỉ cơ chế SSO, còn có thể chuẩn bị dashboard để giám sát tình hình sử dụng

![Dashboard giám sát](/images/posts/claude_code_on_aws_patterns/4e95986615e9-20251031.png). Ở đây có thể xác nhận một cách tổng quan insight về hiệu quả triển khai Claude Code on AWS và quản lý quota.

Trong dashboard, có thể xem các metric như lượng sử dụng token, số người dùng active, số API call, hiệu quả cache. Xem dữ liệu chuỗi thời gian như xu hướng số người dùng active, xu hướng số dòng chỉnh sửa, tổng lượng sử dụng token và giá trị theo từng mô hình để xác nhận khi nào, cái gì được sử dụng bao nhiêu.

Ngoài ra còn có mục xem ai là heavy user, mô hình nào được sử dụng, code gì được tạo ra. Là chỉ số để đo mức độ cải thiện năng suất phát triển, có thể xác nhận số dòng tạo ra, số commit, số lần accept (số lần chấp nhận đề xuất của Claude Code), thời gian sử dụng. Hơn nữa, xem API error và số lần xảy ra throttling, có thể sử dụng làm tài liệu để đánh giá xem đã đến lúc phải nới lỏng giới hạn quota của Amazon Bedrock chưa.

### Ưu điểm của pattern Claude Code với Amazon Bedrock

Ưu điểm khi kết hợp Claude Code và Amazon Bedrock rất đa dạng.

![Ưu điểm Bedrock Pattern](/images/posts/claude_code_on_aws_patterns/969ee24dc8ca-20251031.png)

**Mặt chi phí**

- Tính phí theo lượng sử dụng token, có thể small start
- Có thể scale bằng cách nới lỏng dần giới hạn quota theo tình hình sử dụng
- Thanh toán theo lượng sử dụng, tối ưu cho team có biến động về tần suất sử dụng

**Mặt bảo mật và tuân thủ**

- Thông tin liên lạc đóng trong AWS, dữ liệu không ra ngoài
- Suy luận cross-region trong nước Nhật có thể đáp ứng yêu cầu data residency
- Thực hiện capacity cao và latency thấp

**Mặt quản trị và quản lý**

- Được cung cấp giải pháp tích hợp với SSO nội bộ
- Có thể dễ dàng xây dựng dashboard giám sát tình hình sử dụng
- Có thể tận dụng các chức năng bảo mật AWS hiện có như IAM và VPC
- Có thể sử dụng dưới service level của AWS

**Mặt triển khai và vận hành**

- Nếu đã sử dụng Amazon Bedrock, có thể triển khai chỉ với thiết lập bổ sung
- Không cần hợp đồng mới với Anthropic, có thể sử dụng trong phạm vi hợp đồng AWS hiện có
- Có thể deploy nhanh chóng bằng CloudFormation template

---

## Pattern 2: Mua trên AWS Marketplace

### Claude for Enterprise Plan

![Claude for Enterprise Plan](/images/posts/claude_code_on_aws_patterns/95bb605ba3ee-20251031.png)

Khi sử dụng Claude như SaaS của Anthropic, có các plan cá nhân Free, Pro, Max và các plan cho team và doanh nghiệp là Team plan và Enterprise plan. Với Enterprise plan này, nếu mua premium seat cho mỗi user thì Claude Code cũng có thể sử dụng được. Claude for Enterprise có thể subscribe trên AWS Marketplace - platform cho phép mua bán phần mềm.

Trong Enterprise plan, ngoài chức năng có thể sử dụng trong plan cá nhân, còn được cung cấp các chức năng hướng đến team như quản lý tập trung user và thống nhất thanh toán. Hơn nữa, còn có thể sử dụng tích hợp với SSO công ty, đơn giản hóa quản lý account bằng SCIM (System for Cross-domain Identity Management), quản lý quyền hạn, chức năng audit log.

Trong Enterprise plan, có thể phân bổ standard seat và premium seat cho mỗi user. User có premium seat có thể sử dụng Claude Code với giá cố định. Enterprise plan này có thể subscribe qua AWS Marketplace.

### Claude như ứng dụng GUI

Phiên bản SaaS và desktop (claude.ai) của Claude cung cấp chat UI phong phú. Không chỉ hiệu quả hóa phát triển code và test xung quanh bằng Claude Code, còn có thể hiệu quả hóa toàn bộ vòng đời phát triển phần mềm bằng cách sử dụng ứng dụng GUI.

Ví dụ, điều tra về library và framework, hoạt động như đối tác tư vấn tương tác. Việc được trả lời ngay lập tức các câu hỏi kỹ thuật là trợ giúp lớn trong phát triển hàng ngày. Sử dụng chức năng Artifact có thể thực hiện trực quan hóa dữ liệu và tạo mock UI. Rất tiện lợi khi có thể tạo prototype tương tác trong khi xem preview realtime. Ngoài ra, có thể kết nối với nguồn knowledge như Notion và Google Docs để đọc tình hình project, hoặc đăng ký như task vào Asana và quản lý tiến độ bằng kanban board.

Nhìn toàn bộ vòng đời phát triển, ở định nghĩa yêu cầu sắp xếp yêu cầu trong khi tham khảo document bên ngoài, ở thiết kế tạo sơ đồ thiết kế và mock bằng Artifact, ở triển khai coding bằng Claude Code, ở review tư vấn tính hợp lý của triển khai bằng chat UI, ở test thực hiện tạo và chạy test code, ở document nhận hỗ trợ tạo document kỹ thuật, ở deploy thực hiện tạo và chạy deploy script - có thể hiệu quả hóa chuỗi quy trình này.

### Ưu điểm của pattern Claude Code via AWS Marketplace

Có nhiều ưu điểm khi mua Claude for Enterprise trên AWS Marketplace.

![Ưu điểm AWS Marketplace Pattern](/images/posts/claude_code_on_aws_patterns/831972ac4cfb-20251031.png)

**Mặt chi phí và quản lý ngân sách**

- Giá cố định với tính phí theo số user, dễ quản lý ngân sách
- Có thể thống nhất thanh toán của từng user
- Có thể thống nhất thanh toán với chi phí infrastructure AWS

**Mặt chức năng và tiện lợi**

- Có thể sử dụng Claude như ứng dụng GUI (chat UI, chức năng Artifact, v.v.)
- SSO, SCIM, audit log, role-based access được builtin
- Liên kết công cụ bên ngoài như Notion và Google Docs
- Context window mở rộng

**Mặt mua sắm và quản lý**

- Quy trình mua và quản lý license hoàn tất trên AWS Marketplace
- Quy trình mua sắm phần mềm được đơn giản hóa
- Công việc tích hợp bổ sung tối thiểu
- Khi sử dụng quy mô lớn có thể tư vấn riêng bằng private offer

**Lưu ý**

- Có trường hợp có sự khác biệt chức năng nhỏ với bán trực tiếp
- Có hạn chế như số lượng seat tối thiểu và chỉ hợp đồng hàng năm
- Vui lòng tư vấn với bộ phận kinh doanh AWS / Anthropic về nội dung hợp đồng chi tiết

---

## Tiêu chí lựa chọn

Đã nói về việc sử dụng Claude Code trên AWS có 2 pattern lớn. Bây giờ sẽ sắp xếp từng pattern phù hợp với trường hợp nào.

![So sánh tiêu chí lựa chọn](/images/posts/claude_code_on_aws_patterns/30bf7656d44d-20251031.png)

### Trường hợp phù hợp với pattern Amazon Bedrock

Pattern liên kết với Amazon Bedrock là tính phí theo lượng sử dụng nên có thể small start. Tối ưu cho trường hợp muốn bắt đầu từ quy mô nhỏ để giảm đầu tư ban đầu, hoặc đầu tiên triển khai thử nghiệm và mở rộng trong khi xem tình hình sử dụng. Ngay cả trường hợp tần suất sử dụng Claude Code trong team có biến động và không phải toàn bộ là heavy user, hình thức thanh toán theo lượng sử dụng cũng hợp lý. Trường hợp dự kiến triển khai toàn công ty và số user tăng lên, pattern này với tính phí theo lượng sử dụng dựa trên số token sẽ phù hợp.

Ngay cả khi có hạn chế về bảo mật và kiểm soát dữ liệu, có thể giữ dữ liệu trong AWS. Đặc biệt trong ngành được quản lý cần giữ dữ liệu trong nước Nhật, suy luận cross-region trong nước Nhật có giá trị lớn. Cũng phù hợp khi muốn tận dụng các chức năng bảo mật AWS hiện có như VPC và IAM.

Ngoài ra, trường hợp muốn tận dụng môi trường Amazon Bedrock đang sử dụng, hoặc có rào cản trong thủ tục hợp đồng mới với Anthropic, xin hãy xem xét liên kết Amazon Bedrock. Việc có thể sử dụng trong phạm vi hợp đồng AWS hiện có là ưu điểm lớn về mặt đơn giản hóa quy trình mua sắm.

### Trường hợp phù hợp với pattern AWS Marketplace

Mặt khác, khi subscribe phiên bản enterprise trên AWS Marketplace thì đi kèm Claude như ứng dụng GUI. Trường hợp muốn hiệu quả hóa không chỉ coding mà cả thiết kế, review, tạo document, pattern này phù hợp. Vì có thể tận dụng chat UI, Artifact, liên kết công cụ bên ngoài nên có thể cover toàn bộ vòng đời phát triển.

Ngoài ra, vì là plan giá cố định nên trường hợp dự kiến có số lượng người sử dụng nhất định và muốn dễ quản lý ngân sách xin hãy chọn pattern này. Trường hợp dự kiến toàn team sử dụng thường xuyên và có nhiều heavy user, giá cố định có thể tránh biến động do tính phí theo lượng sử dụng, dễ lập kế hoạch ngân sách hơn.

Vì các chức năng cần thiết được chuẩn bị builtin nên có thể giảm công sức setup. Phù hợp khi muốn bắt đầu sử dụng ngay mà không có công việc tích hợp phức tạp, hoặc muốn giảm tải vận hành. Cũng tối ưu khi muốn quản lý bằng cùng hóa đơn với chi phí infrastructure AWS, hoặc quy trình mua sắm nội bộ khuyến nghị qua AWS Marketplace.

### Ví dụ tính toán chi phí

Khi xem xét triển khai thực tế, ước tính chi phí là tài liệu quan trọng để đánh giá. Ở đây giới thiệu ví dụ tính toán cho use case điển hình.

**Tính toán với pattern Amazon Bedrock (Sử dụng hàng tháng team 10 người)**

Điều kiện tiên quyết:
- Team member 10 người
- Sử dụng trung bình mỗi người: 20 ngày/tháng, 4 giờ/ngày
- Số session mỗi ngày: 8 session (trao đổi khoảng 1 lần/30 phút)
- Tiêu thụ token trung bình mỗi session:
  - Đầu vào: 500K token (context dự án + lịch sử hội thoại)
  - Đầu ra: 100K token
- Tỷ lệ cache hit: 70%
- Mô hình sử dụng: Claude Sonnet 4.5

```
Tổng số token hàng tháng:
- Tổng số session: 10 người × 20 ngày × 8 session = 1,600 session
- Tổng lượng token đầu vào: 1,600 × 500K = 800M token
- Tổng lượng token đầu ra: 1,600 × 100K = 160M token

Chi tiết token đầu vào (xem xét cache):
- Cache write (30%): 240M token → $900
- Cache read (70%): 560M token → $168

Chi phí token đầu ra:
- 160M × $15/MTok = $2,400

Tổng cộng: $3,468/tháng (khoảng 520,200 yên/tháng, 1 đô la = 150 yên)
```

Nếu sử dụng Claude Haiku 4.5 thì chi phí khoảng 1/3 (khoảng 173,000 yên/tháng).

**Tính toán với pattern AWS Marketplace (Team 10 người)**

Điều kiện tiên quyết:
- Team member 10 người
- Phân bổ premium seat cho tất cả (có thể sử dụng Claude Code)
- Đơn giá premium seat: $200/tháng/user

```
Chi phí hàng tháng:
10 người: $200 × 10 người = $2,000/tháng (khoảng 300,000 yên/tháng)
```

Vì giá cố định nên ngân sách được xác định bất kể lượng sử dụng.

---

## Tài liệu tham khảo

Giới thiệu các tài liệu hữu ích khi xem xét triển khai Claude Code on AWS.

Đầu tiên, trong [tài liệu chính thức](https://docs.claude.com/en/docs/claude-code) của Claude Code có bài Getting Started nên tốt nhất là bắt đầu từ đó. Code sample do AWS chuẩn bị có [aws-samples/anthropic-on-aws](https://github.com/aws-samples/anthropic-on-aws), công bố nhiều sample code để sử dụng mô hình Anthropic trên AWS.

Workshop thực hành cũng có cho user và quản trị viên. Cho user có [Claude Code in Action on AWS](https://catalog.us-east-1.prod.workshops.aws/workshops/claude-code-in-action) - workshop thực hành học cách sử dụng cơ bản Claude Code. Cho quản trị viên có [Supercharge your development with Claude Code on Amazon Bedrock](https://catalog.us-east-1.prod.workshops.aws/workshops/claude-code-bedrock), xử lý thiết lập OpenTelemetry, tạo dashboard quản lý, thiết lập governance, quản lý quota.

Kiến trúc tham khảo và CloudFormation template có thể lấy từ [Guidance for Claude Code with Amazon Bedrock](https://aws.amazon.com/solutions/guidance/claude-code-with-amazon-bedrock/). Về kế hoạch triển khai cụ thể và ước tính, xin vui lòng tư vấn với bộ phận kinh doanh AWS.

---

## Kết luận

Bài viết này đã giải thích 2 pattern sử dụng chính của Claude Code on AWS.

Pattern liên kết với Amazon Bedrock phù hợp khi small start bằng tính phí theo lượng sử dụng, hoặc có yêu cầu nghiêm ngặt về bảo mật và data residency. Dễ dàng tích hợp với môi trường AWS hiện có và có thể giám sát chi tiết tình hình sử dụng.

Pattern mua trên AWS Marketplace phù hợp khi tận dụng tổng hợp bao gồm ứng dụng GUI, hoặc yêu cầu đơn giản hóa quản lý ngân sách bằng giá cố định. Vì các chức năng hướng đến enterprise được cung cấp builtin nên có thể giảm đáng kể công sức setup.

Cả hai pattern đều có thể thực hiện môi trường phát triển được hỗ trợ AI an toàn và chất lượng cao nhờ hợp tác chiến lược giữa AWS và Anthropic. Phía AWS cũng đang nỗ lực hỗ trợ Claude, chuẩn bị nhiều document và workshop. Khi xem xét triển khai Claude Code, xin vui lòng tư vấn với bộ phận kinh doanh AWS. Lựa chọn tối ưu cho nhu cầu của bạn dựa trên ưu nhược điểm của cả hai pattern là bước đầu tiên để thành công trong phát triển được hỗ trợ AI.
