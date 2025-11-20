---
title: "Bắt đầu sử dụng Codex CLI - Trợ lý lập trình AI - Từ hôm nay!"
date: 2025-10-16
draft: false
categories: ["AI", "Development", "Tools"]
tags: ["Codex-CLI", "OpenAI", "AI-assistant", "code-review", "programming", "productivity", "AI-agent", "developer-tools"]
description: "Hướng dẫn chi tiết sử dụng Codex CLI - trợ lý lập trình AI từ OpenAI. Từ thiết lập môi trường, cấu hình AGENTS.md đến các use case thực tế giúp tăng tốc công việc developer."
---

# Bắt đầu sử dụng Codex CLI - Trợ lý lập trình AI - Từ hôm nay!

**Evangelist JUN: Kiểm chứng triệt để - Liệu AI tạo sinh có thực hiện công việc siêu tốc không?**

**Tác giả:** 李 俊浩 (Lee Jun Ho)  
**Tổ chức:** Phòng Vận hành AI - CyberAgent  
**Ngày đăng:** 2025-10-16  
**Nguồn:** https://git-generative-ai.services.isca.jp/article/engineer/en021/


---

## Mục lục

1. [Codex CLI có thể làm gì?](#codex-cli-la-gi)
2. [Thiết lập môi trường (Cài đặt và xác thực)](#thiet-lap-moi-truong)
3. [Dạy quy tắc dự án bằng AGENTS.md](#agents-md)
4. [Thực hành! Giới thiệu các use case](#use-case)
5. [Tổng kết](#tong-ket)
6. [Cùng cải thiện công việc với Phòng AI Operations](#ai-operations)

---

## Giới thiệu

"Biểu thức chính quy này nghĩa là gì nhỉ...?"  
"Viết test code cho component này hơi phiền phức..."

Đây là những lo lắng mà bất kỳ engineer nào cũng từng trải qua ít nhất một lần. Một công cụ đáng tin cậy để giải quyết những vấn đề như vậy đã ra đời. Đó là **Codex CLI** do OpenAI phát triển.

Codex CLI là một **"AI coding agent"** hoạt động trên terminal của PC local. Không chỉ dừng lại ở vai trò công cụ bổ sung code, nó còn có khả năng tự động thực hiện các tác vụ như tạo code, refactoring, tạo test, sửa bug theo hình thức đối thoại.

Trong bài viết này, từ cách sử dụng cơ bản của Codex CLI đến kỹ thuật ứng dụng để tùy chỉnh phản hồi AI theo dự án, tôi sẽ giới thiệu cả cách tạo cụ thể.

Hãy thử sử dụng nó như một lựa chọn để tăng hiệu quả công việc phát triển hàng ngày.

### Đối tượng của bài viết này

- Software engineer quen thuộc với thao tác terminal
- Người muốn tăng hiệu quả công việc coding hàng ngày hơn nữa
- Người muốn tự động hóa các công việc định hình như tạo test code, refactoring
- Người quan tâm đến phong cách phát triển mới như pair programming với AI
- Người muốn ứng dụng AI vào tự động hóa DevOps và CI/CD pipeline

---

## Codex CLI có thể làm gì? {#codex-cli-la-gi}

Codex CLI là một **AI coding agent mã nguồn mở** được phát triển bởi OpenAI. Đặc điểm lớn nhất là nó hoạt động locally trên terminal của PC và có thể tiến hành phát triển trong khi đối thoại.

Nếu GitHub Copilot là "navigator xuất sắc", thì có thể nói Codex CLI là **"support agent thực hiện cả công việc theo chỉ thị"**.

### So sánh với Code Completion Tool

**Code completion tool:**  
Đọc ngữ cảnh và đề xuất đoạn code (thủ động - passive)

**Codex CLI (Agent):**  
Khi được giao task, tự lập kế hoạch, đọc/ghi file, thực thi command, đánh giá kết quả và hoàn thành task (chủ động - active)

Nếu bạn nhờ "Viết và chạy test code cho chức năng này", nó sẽ phân tích file, viết test code, chạy `npm test`, và báo cáo kết quả. Đây chính là đặc điểm của Codex CLI.

---

## Thiết lập môi trường (Cài đặt và xác thực) {#thiet-lap-moi-truong}

Thiết lập môi trường tương đối đơn giản để bắt đầu.

### ▼ Cài đặt (macOS / Linux)

Hãy thực thi lệnh sau bằng package manager bạn đang sử dụng.

```bash
# Nếu dùng Homebrew
brew install codex

# Nếu dùng npm
npm install -g @openai/codex
```

### ▼ Xác thực bằng tài khoản ChatGPT

Sau khi cài đặt, nhập `codex` trong terminal.

Khi khởi động lần đầu, bạn sẽ được yêu cầu xác thực. Chọn "Sign in with ChatGPT" và đăng nhập theo hướng dẫn hiển thị trên trình duyệt.

Nếu bạn đã đăng ký các gói trả phí như ChatGPT Plus, Pro, Business (trước đây là Team), hoặc Enterprise, bạn có thể sử dụng Codex CLI trong hạn mức sử dụng của gói đó.

### ▼ Cách sử dụng cơ bản

Sau khi hoàn tất xác thực, hãy thử sử dụng thực tế.

#### Thử nói chuyện trong chế độ đối thoại

Khi thực thi lệnh `codex`, giao diện tương tác sẽ khởi động. Hãy thử nói chuyện bằng ngôn ngữ tự nhiên như ChatGPT.

Vì nó hoạt động dựa trên thông tin của thư mục hiện tại, nếu khởi động ở thư mục root của dự án, nó sẽ hoạt động phù hợp hơn.

```bash
# Di chuyển đến root của dự án
cd /path/to/your-project

# Khởi động chế độ đối thoại
codex

# Hoặc có thể truyền prompt đầu tiên qua tham số
codex "Hãy cho tôi biết tổng quan về dự án này"
```

#### Ví dụ prompt tiện lợi

```
・Refactor Dashboard.js sử dụng React Hooks
・Viết unit test cho utils/date.ts
・Giải thích ý nghĩa của regex này: ^(?=.*[A-Z]).{8,}$
・Thực thi lệnh "Đổi tên file có đuôi .jpeg thành .jpg và git mv"
```

---

## Dạy quy tắc dự án bằng AGENTS.md {#agents-md}

Viết cùng một chỉ thị vào prompt mỗi lần thì phiền phức phải không?  
Bằng cách sử dụng file `AGENTS.md`, bạn có thể truyền đạt quy tắc và tư tưởng thiết kế riêng của dự án cho AI, bỏ qua chỉ thị lặp lại và tăng hiệu quả công việc.

### ▼ AGENTS.md là gì? Tại sao nó quan trọng?

`AGENTS.md` là file có vai trò như `README.md` dành cho AI agent.

Bằng cách viết vào file này các phương châm và quy ước như "Dự án này phát triển theo quy tắc như thế này", Codex CLI sẽ tham khảo nội dung đó và dễ dàng tạo ra output phù hợp với ý định.

Nhờ đó, bạn có thể chuyển từ **"prompt engineering (chỉ thị mỗi lần)"** sang **"agent programming"** - định nghĩa quy tắc trước và vận hành. Một khi đã định nghĩa quy tắc, việc tương tác chỉ cần chỉ thị ngắn gọn, và tính nhất quán của output cũng dễ nâng cao hơn.

### ▼ Cách viết AGENTS.md hiệu quả (Kèm template)

`AGENTS.md` được đặt ở thư mục root của dự án. Hãy tham khảo template dưới đây và tùy chỉnh theo dự án của bạn.

```markdown
# Sample AGENTS.md file

## Dev environment tips
- Use `pnpm dlx turbo run where <project_name>` to jump to a package instead of scanning with `ls`.
- Run `pnpm install --filter <project_name>` to add the package to your workspace so Vite, ESLint, and TypeScript can see it.
- Use `pnpm create vite@latest <project_name> -- --template react-ts` to spin up a new React + Vite package with TypeScript checks ready.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.

## Testing instructions
- Find the CI plan in the .github/workflows folder.
- Run `pnpm turbo run test --filter <project_name>` to run every check defined for that package.
- From the package root you can just call `pnpm test`. The commit should pass all tests before you merge.
- To focus on one step, add the Vitest pattern: `pnpm vitest run -t \"<test name>\"`.
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run `pnpm lint --filter <project_name>` to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.

## PR instructions
- Title format: [<project_name>] <Title>
- Always run `pnpm lint` and `pnpm test` before committing.
```

Bằng cách định nghĩa quy tắc chi tiết như thế này, bạn có thể đưa phản hồi của AI về gần với hình thức phù hợp với ý định, giúp ích cho việc tái tạo công việc và duy trì chất lượng.

---

## Thực hành! Giới thiệu các use case {#use-case}

Sau khi chuẩn bị `AGENTS.md`, hãy xem các cách sử dụng thực tế hơn.

### ▼ Case 1: Tự động tạo unit test cho code hiện có

Tạo test code rất quan trọng nhưng tốn thời gian đúng không? Hãy giao cho Codex CLI.

```bash
codex "Tạo unit test cho src/my_module.py bằng pytest và chạy nó"
```

Codex CLI sẽ phân tích nội dung file, tạo test code xem xét các pattern bình thường và bất thường, thực thi lệnh thực tế và báo cáo kết quả.

### ▼ Case 2: Giải thích và tạo biểu thức chính quy phức tạp

Với Codex CLI, bạn có thể yêu cầu giải thích ý nghĩa hoặc tạo các regex khó hiểu xuất hiện trong code review.

```bash
codex "Tạo regex để validate địa chỉ email. Tuy nhiên không cần tuân thủ RFC quá mức, chỉ cần cover định dạng phổ biến"
```

### ▼ Case 3: Xây dựng API server Go theo chỉ thị kiến trúc

Với `AGENTS.md` đã tạo trước đó, hãy thử đưa ra chỉ thị ở mức cao như sau:

```bash
codex "Tạo Pulse service. Implement hexagonal layout, CRUD, SSE, signed webhook, và swaggo document"
```

Codex CLI sẽ dựa trên các quy tắc được mô tả trong `AGENTS.md` (hexagonal architecture, sử dụng GORM, v.v.) và tự động tiến hành từ tạo cấu trúc thư mục đến implementation code theo đó.

Có thể thực hiện quy trình phát triển với sự phân công vai trò rõ ràng: con người lập chiến lược như một kiến trúc sư, còn AI xử lý implementation chiến thuật với tốc độ cao.

---

## Tổng kết {#tong-ket}

OpenAI Codex CLI không chỉ là công cụ nâng cao năng suất, mà còn là **"AI coding agent"** có thể ảnh hưởng đến cách thức của quy trình phát triển.

### Các điểm chính

**Tăng hiệu quả công việc đơn giản:**  
Ủy thác công việc implementation lặp đi lặp lại cho AI agent, con người dễ dàng tập trung vào các task sáng tạo và chiến lược hơn.

**Hình thức hóa tri thức:**  
Thông qua `AGENTS.md`, có thể minh văn hóa các quy tắc và kiến trúc của dự án vốn là tri thức ngầm, và sắp xếp thành hình thức có thể chia sẻ.

**Hình thức hợp tác mới:**  
Sinh ra phong cách phát triển mới, coi AI không chỉ là "công cụ" mà là "teammate" hiểu rõ specification của dự án.

Mặc dù vẫn là công cụ đang phát triển, nhưng đã được áp dụng trong nhiều công việc khác nhau, và kỳ vọng sẽ có nhiều use case hơn nữa trong tương lai.

Trước tiên, hãy thử Codex CLI trong môi trường của bạn và khám phá xem nó có thể hữu ích trong tình huống nào nhé.

---

## Cùng cải thiện công việc với Phòng AI Operations! {#ai-operations}

Bạn có đang cảm thấy những điều "phiền phức..." như thế này trong công việc hàng ngày không?

- Tạo báo cáo hàng ngày, mất thời gian một cách tinh tế...
- Đã thử dùng Claude Code nhưng chưa thể sử dụng thành thạo...
- Đọc kết quả khảo sát số lượng lớn thì khó khăn...

Những điều "phiền phức" đó có thể được giải quyết bằng sức mạnh của AI!

Bản thân tôi trong quá trình thử nghiệm tự động hóa công việc bằng AI và AI coding, đã tích lũy được khá nhiều cách sử dụng tiện lợi và kiến thức. Tôi muốn chia sẻ kinh nghiệm này với mọi người và cùng nhau "thoải mái" hơn.

**Ví dụ, những cuộc tán gẫu như thế này cũng OK!**

- Tôi muốn tự động hóa công việc 〇〇, bạn nghĩ sao?
- Hãy dạy tôi cách sử dụng tiện lợi của AI coding!
- 〇〇AI đang được nói đến gần đây, thực tế thế nào?

**AIオペ室 李さん より:**  
Nếu bạn có chút hứng thú, hãy liên hệ với tôi nhé.  
Dù chỉ là tán gẫu trong lúc ăn trưa hay tư vấn qua Slack đều rất hoan nghênh!  
Cùng hack công việc bằng AI nào!

📮 [Liên hệ Phòng AI Operations](https://cyberagent.enterprise.slack.com/archives/C06A63SPUUQ/p1741159999955789)  
📮 [Tư vấn với Next Expert](https://experts.cyberagent.dev/archives/476)

---

**Lưu ý quan trọng:**

- Nếu có câu hỏi về nội dung kiểm chứng hoặc muốn đề nghị kiểm chứng nội dung nào, vui lòng liên hệ qua ["Yêu cầu đăng tải・Liên hệ"](https://git-generative-ai.services.isca.jp/contact)
- Câu hỏi về dịch vụ nội bộ, vui lòng liên hệ trực tiếp với từng dịch vụ
- ※ Trước khi sử dụng AI tạo sinh, vui lòng hoàn thành khóa học ["生成AI徹底理解リスキリング"](https://cybar.cag.isca.jp/?p=100091) và xác nhận các [Guidelines](https://git-generative-ai.services.isca.jp/guideline/)
- ※ Việc sử dụng công cụ AI tạo sinh trong công việc là quyết định của từng bộ phận, dựa trên đánh giá rủi ro của Legal・SSG. Vui lòng sử dụng theo [Guidelines](https://git-generative-ai.services.isca.jp/guideline/) và có sự chấp thuận của cấp trên. Để liên hệ Legal・SSG, vui lòng qua [Security Portal](https://security-portal.ssg.isca.jp/inquiry)
- ※ Vui lòng cẩn thận khi xử lý text・hình ảnh・video được tạo bởi AI
- ※ Do nội bộ công ty, tất cả nội dung đăng tải cấm chuyển tải lên SNS, v.v.
- ※ Nội dung bài viết là tại thời điểm đăng tải, các công cụ được sử dụng với mục đích kiểm chứng

---

**Thống kê bài viết:**
- Votes: Hữu ích cho công việc (1), Có học hỏi (1), Dễ hiểu (1), Thú vị (1)
