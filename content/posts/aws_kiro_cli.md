---
title: "Giới thiệu Kiro CLI: Đưa Kiro Agent đến Terminal của bạn"
date: 2025-11-18
draft: false
categories:
  - "AWS"
  - "AI & Machine Learning"
  - "Development"
tags:
  - "Kiro CLI"
  - "AI Agent"
  - "Terminal"
  - "MCP"
  - "Amazon Q Developer"
  - "Custom Agents"
author: "稲田大陸 (Inada Tairiku)"
translator: "日平"
description: "Kiro CLI mang AI agent trực tiếp vào terminal, cho phép bạn sử dụng custom agent, MCP và tích hợp với Kiro IDE mà không cần rời khỏi command line."
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/introducing-kiro-cli/)

---

## Giới thiệu

2 giờ sáng, bạn đang kết nối với máy chủ production để debug lỗi. Trong suốt tuần qua, bạn đã sử dụng AI agent trong IDE để phát triển hiệu quả, và trong tình huống này, bạn chắc chắn muốn nhờ sức mạnh của AI. Tuy nhiên, khi chuyển đổi context, phiên terminal bị ngắt, kết nối SSH cũng mất, và luồng công việc bị gián đoạn. Cuối cùng, bạn phải kiểm tra log thủ công, tìm kiếm cú pháp và tự mình giải quyết. Làm việc trong IDE có hỗ trợ AI, hay làm việc trong terminal thực tế nhưng không có hỗ trợ AI? Thực ra, bạn không cần phải lựa chọn như vậy.

Lần này, chúng tôi đã giải quyết khoảng cách đó. Với Kiro CLI, bạn có thể sử dụng AI agent trực tiếp trong terminal. Cùng một agent, cùng các tính năng, bất kể bạn đang code ở đâu.

## Kiro CLI là gì?

Kiro CLI là công cụ dựa trên các tính năng agent nâng cao của Amazon Q Developer CLI (bao gồm chế độ agent, MCP, steering và custom agent), với việc bổ sung thêm đăng nhập mạng xã hội, Haiku 4.5, và Auto agent tự động cân bằng giữa hiệu suất, hiệu quả và chất lượng đầu ra. Bạn có thể xây dựng dự án, debug vấn đề trong môi trường production, tạo infrastructure code, tất cả mà không cần rời khỏi shell. Chỉ cần giải thích điều bạn cần bằng ngôn ngữ tự nhiên.

Bí mật của sức mạnh này nằm ở tính chuyên môn hóa. Bạn có thể tạo custom agent phù hợp với codebase của mình. Backend specialist thành thạo các API pattern, frontend expert hiểu rõ về component, DevOps agent nắm vững infrastructure. Mỗi agent tập trung context window vào thông tin liên quan đến workflow mà nó phụ trách.

Bạn đã sử dụng Kiro IDE? Cấu hình thư mục `.kiro` của bạn hoạt động trong cả hai môi trường. Kiro CLI có thể sử dụng cùng steering file (các quy tắc kiểm soát hành vi AI trong toàn dự án) và cùng MCP server. Thiết lập một lần, sử dụng ở mọi nơi.

## Tại sao nên dùng Kiro CLI?

**Không cần rời khỏi terminal** – Tiết kiệm công sức chuyển đổi context hay tra cứu cú pháp

**Hệ thống hóa workflow AI** – Chuyển đổi tức thì giữa các môi trường được tối ưu hóa cho các tác vụ khác nhau với custom agent

**Thiết lập một lần cho cả hai môi trường** – MCP server, quy tắc cấu hình và tài liệu dự án có thể sử dụng trong cả Kiro IDE và Kiro CLI

**Phù hợp với phong cách làm việc thực tế** – Tạo và chia sẻ agent cho các workflow cụ thể như quản lý infrastructure, code review, debugging

**Thực hiện tự động hóa nhanh chóng** – Xử lý code formatting, chạy test, quản lý log bằng các lệnh shell tự động hóa

## Bắt đầu

### Cài đặt

[Kiro CLI](https://kiro.dev/cli/) có sẵn trên macOS và Linux. [Cài đặt](https://kiro.dev/docs/cli/installation/) rất đơn giản.

```bash
curl -fsSL https://cli.kiro.dev/install | bash
```

### Các bước đầu tiên

#### 1. Xác thực: Đăng nhập bằng thông tin đăng nhập của bạn

```bash
kiro-cli
```

#### 2. Khám phá các lệnh: Nhận trợ giúp bất cứ lúc nào

```bash
/help
```

## Các tính năng chính

### 1. Custom Agent: Cấu trúc hóa AI coding trong terminal

Custom agent mang lại cấu trúc cho workflow terminal tận dụng AI bằng cách cho phép bạn định nghĩa chính xác cách AI nên hoạt động với các tác vụ khác nhau.

- **Công cụ được phê duyệt trước** – Có thể tự động thực thi các công cụ đáng tin cậy mà không cần xin phép mỗi lần
- **Context lâu dài** – Tự động tải các tệp dự án, tài liệu và cấu hình tiêu chuẩn
- **Kiểm soát truy cập** – Hạn chế các công cụ có sẵn để tập trung và đảm bảo an toàn
- **Cấu hình theo workflow cụ thể** – Các agent khác nhau tùy theo mục đích: cho AWS operations, cho code review, cho debug session, v.v.

Ví dụ về cấu hình agent:

```json
{
  "name": "backend-specialist",
  "description": "Expert in building Express.js APIs with MongoDB",
  "prompt": "You are a backend developer specializing in Node.js and Express. You write secure, well-tested APIs with proper error handling, input validation, and RESTful design.",
  "tools": ["fs_read", "fs_write", "execute_bash"],
  "toolsSettings": {
    "fs_write": {
      "allowedPaths": ["src/api/**", "tests/api/**", "server.js", "package.json"]
    }
  },
  "resources": [
    "file://.kiro/steering/backend-standards.md"
  ]
}
```

Cách tiếp cận có cấu trúc này giúp bạn không cần phải liên tục chuyển đổi context hay giải thích lại cấu hình dự án. AI hiểu những gì cần thiết, và bạn duy trì được luồng công việc.

Agent trong ví dụ này là chuyên gia chuyên về phát triển backend. Nó không lãng phí thời gian hay năng lượng tinh thần vào các chủ đề không liên quan như frontend hay DevOps. Nhờ hạn chế đường dẫn tệp, nó chỉ có thể xử lý các tệp backend (`src/api/**`, `server.js`, v.v.), ngăn chặn việc vô tình làm hỏng các tệp frontend hoặc cấu hình. Vì nó tự động tải tệp md về tiêu chuẩn backend, bạn không cần phải nhắc nhở mỗi lần về các quy tắc của team về async/await, xử lý lỗi, thiết kế API. Kết quả là, bạn nhận được câu trả lời nhanh hơn, chính xác hơn và luôn tuân thủ tiêu chuẩn vì agent không bị phân tâm bởi thông tin không liên quan.

Ngoài việc hạn chế công cụ cá nhân, Kiro CLI còn hỗ trợ nhiều pattern phân quyền để tăng thêm tính linh hoạt.

Bằng cách sử dụng namespace `@builtin`, bạn có thể phê duyệt trước tất cả các công cụ tích hợp sẵn cùng lúc, hoặc chỉ định từng công cụ riêng lẻ để kiểm soát chính xác.

```json
{
  "allowedTools": ["@builtin", "my_custom_tool"]
}
```

### 2. Quản lý context thông minh với các chỉ báo trực quan

Kiro CLI cung cấp context với 3 cách tiếp cận linh hoạt.

- **Agent Resources**: Context lâu dài giữa các phiên làm việc cho các tệp dự án quan trọng
- **Session Context**: Các tệp tạm thời cho thử nghiệm nhanh
- **Knowledge Base**: Tìm kiếm ngữ nghĩa trên codebase lớn (cũng hỗ trợ PDF!) mà không tiêu tốn không gian context window

**Tỷ lệ sử dụng context**: Khi đang mở kiro-cli chat, nhập `/context` sẽ hiển thị chỉ báo trực quan. Điều này giúp bạn nhận thức được mức tiêu thụ context và quản lý tích cực trong các cuộc hội thoại dài.

### 3. Các tùy chọn xác thực linh hoạt

Kiro CLI hỗ trợ nhiều phương thức xác thực phù hợp với workflow của bạn.

- **GitHub**: Tích hợp liền mạch với tài khoản GitHub
- **Google**: Đăng nhập bằng thông tin đăng nhập Google
- **AWS Builder ID**: Thiết lập nhanh chóng cho AWS developer
- **AWS IAM Identity Center**: Xác thực cấp doanh nghiệp với quản lý tập trung

Với các team sử dụng IAM Identity Center, quản trị viên có thể quản lý mọi thứ từ AWS Management Console. Ví dụ, phân bổ subscription tier, cấu hình MCP server, theo dõi chi tiêu, tích hợp thanh toán toàn tổ chức. Hỗ trợ thêm các identity provider sẽ sớm được cung cấp.

### 4. Tích hợp với Kiro IDE

Bạn đã sử dụng Kiro IDE? Cấu hình hiện tại của bạn hoạt động nguyên vẹn. Không cần thiết lập lại mọi thứ từ đầu. Cấu hình của Kiro IDE được áp dụng liền mạch cho Kiro CLI.

- MCP server: Copy `.kiro/settings/mcp.json` và các công cụ MCP đã sẵn sàng
- Steering rules: Các tệp `.kiro/steering/*.md` hoạt động trong Kiro CLI với cùng tiêu chuẩn dự án, cùng context
- Tài liệu dự án: Tất cả tài liệu và cấu hình `.kiro` được kế thừa

Điều này có nghĩa là bạn có thể di chuyển qua lại giữa IDE và terminal mà không mất context hay phải cấu hình lại AI assistant. Trải nghiệm Kiro giống nhau, có sẵn trong các môi trường khác nhau.

### 5. Các tính năng khác được kỳ vọng trong trải nghiệm CLI agent hiện đại

#### Chat AI tương tác trong terminal

Bạn có thể bắt đầu cuộc trò chuyện với Kiro trực tiếp từ command line.

```bash
kiro-cli
```

Xây dựng dự án mới từ đầu, viết infrastructure as code, thêm tính năng vào codebase hiện có. Tất cả mà không cần rời khỏi terminal. Kiro hiểu context của dự án và có thể thực hiện các thay đổi có ý nghĩa trên nhiều tệp.

```bash
> Tạo dự án FastAPI mới với PostgreSQL, Redis caching và Docker setup
> Thêm authentication middleware vào Express app của tôi sử dụng JWT
> Tạo cấu hình Terraform cho kiến trúc AWS 3 tầng sử dụng RDS và ElastiCache
```

Cần tạo prompt dài và chi tiết hơn? Bạn có thể sử dụng `/editor` để mở trình soạn thảo văn bản yêu thích và viết hướng dẫn chi tiết trên nhiều dòng.

#### Đầu vào đa phương thức: Tham chiếu hình ảnh trực tiếp

Cần chia sẻ screenshot, sơ đồ hoặc thông báo lỗi? Kiro CLI tự động xử lý. Bạn có thể truyền hình ảnh để debug vấn đề UI, chia sẻ sơ đồ kiến trúc, hoặc nhận trợ giúp với nội dung trực quan.

#### Hỗ trợ Model Context Protocol (MCP)

Kiro CLI hỗ trợ Model Context Protocol (MCP), cho phép mở rộng tính năng với các công cụ và dịch vụ bên ngoài. Điểm tốt nhất? Nếu bạn đã sử dụng MCP server trong Kiro IDE, chúng hoạt động liền mạch trong Kiro CLI. Để tìm hiểu thêm về MCP, xem "[Giới thiệu Remote MCP Server cho Kiro](https://aws.amazon.com/jp/blogs/news/introducing-remote-mcp/)".

#### Lượng credit sử dụng

Giống như IDE, Kiro hiển thị số lượng credit đã sử dụng tương ứng với mức độ sử dụng, giúp bạn theo dõi.

#### Auto Agent

Kiro CLI bao gồm cùng Auto agent thông minh đang nâng cao Kiro IDE. Auto tự động chọn model tối ưu cho mỗi tác vụ, cân bằng tốc độ, chi phí và chất lượng. Kết quả là hiệu quả vượt trội—một tác vụ tốn X credit khi sử dụng chế độ Auto, nhưng sẽ tốn 1.3X credit nếu chọn thủ công Sonnet 4 hoặc Sonnet 4.5. Đừng nghĩ về việc sử dụng model nào, hãy để Auto xử lý để có kết quả tốt hơn với giá tốt hơn.

Auto được bật mặc định, và bạn cũng có thể sử dụng lệnh `/model` trong Kiro CLI để chọn model.

## Use case thực tế

Nhớ ví dụ `backend-specialist` ở trên? Đây là cách bạn tận dụng nó với Kiro. Sau khi triển khai cấu hình agent, bạn đã sẵn sàng sử dụng. Ví dụ dưới đây cho thấy cách gọi agent này và các prompt mẫu để tận dụng nó trong thực tế.

```bash
kiro-cli chat --agent backend-specialist

> Thêm endpoint mới /api/users/profile để cho phép người dùng đã xác thực cập nhật thông tin hồ sơ. Bao gồm validation định dạng email và độ mạnh mật khẩu, xử lý lỗi phù hợp cho lỗi database, và unit test.

> Tạo schema MongoDB mới cho thông báo người dùng với các trường: message, trạng thái đã đọc, timestamp. Thêm CRUD endpoint theo quy ước RESTful và bao gồm index phù hợp cho hiệu suất.

> Endpoint /api/orders đang gặp lỗi 500 không liên tục. Giúp tôi thêm error log tốt hơn và xác định các race condition tiềm năng trong logic xử lý đơn hàng.
```

Bạn có thể tạo agent chuyên biệt cho bất kỳ workflow nào. Ví dụ như code review agent với các công cụ lint và style guide của team, DevOps agent với quyền truy cập infrastructure và deployment script, hoặc debugging agent được tải sẵn các log utility và quy trình khắc phục sự cố phổ biến. Mỗi agent tập trung context vào những gì liên quan đến tác vụ cụ thể của nó, làm cho tương tác với AI nhanh hơn và liên quan hơn.

## Tham gia cộng đồng Kiro

Chúng tôi rất muốn nghe ý kiến của bạn! Chúng tôi mong chờ việc chia sẻ feedback, trao đổi cấu hình agent và giao lưu với các người dùng Kiro khác. Tham gia [Kiro Discord Community](https://discord.com/invite/kirodotdev) để giao lưu với các thành viên trong team và các developer khác.

## Bắt đầu ngay bây giờ

Bạn đã sẵn sàng cài đặt Kiro vào terminal của mình? [Cài đặt Kiro CLI](https://kiro.dev/docs/cli/installation/) và trải nghiệm workflow command-line tận dụng AI thực sự dễ sử dụng.

```bash
curl -fsSL https://cli.kiro.dev/install | bash
```

Dù bạn là người dùng Kiro IDE hiện tại hay mới làm quen với Kiro, bạn có thể làm việc trong terminal với sự hỗ trợ của AI.

---

**Danh mục:** Amazon Q Developer, Announcements, General  
