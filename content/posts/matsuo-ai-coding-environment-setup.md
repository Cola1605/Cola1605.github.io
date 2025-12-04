---
title: "Cách Xây Dựng Môi Trường Thực Hành AI Coding【Tháng 12 năm 2025】"
date: 2025-12-04T11:45:00+09:00
draft: false
categories: ["Development", "AI and Machine Learning", "DevOps and Infrastructure"]
tags: ["LLM", "SDD", "Claude Code", "AI Coding", "Development Tools", "MCP", "GitHub CLI"]
author: "からあげ (karaage0703)"
translator: "日平"
---

# Cách Xây Dựng Môi Trường Thực Hành AI Coding【Tháng 12 năm 2025】

> Bài viết này là một phần của **Matsuo Institute Advent Calendar 2025**. Từ bài viết này, bạn sẽ hiểu cách xây dựng môi trường để thực hành AI coding. Các điểm cụ thể như sau:

## Tổng Quan

Bài viết này cung cấp hướng dẫn toàn diện về:

- **Quy trình xây dựng môi trường AI coding với Claude Code làm trung tâm** tính đến tháng 12 năm 2025
- **Tổng quan, phương pháp thiết lập và cách sử dụng các công cụ** cần thiết cho AI coding
- **Quy trình phát triển phần mềm theo spec-driven development** và phương pháp thực hành cụ thể

### Kiến Thức và Kinh Nghiệm Cần Thiết

- Có kiến thức lập trình cơ bản
- Hiểu cách sử dụng GitHub ở mức cơ bản
- Đã sử dụng generative AI (như ChatGPT)

## Tình Hình Hiện Tại của Công Cụ AI Coding

[Tôi đã viết một bài blog về công cụ AI coding vào tháng 3 năm nay (2025)](https://zenn.dev/mkj/articles/cf8536923d9cd7). Vào thời điểm đó, tôi đang sử dụng Cline - một công cụ đang có động lực tốt, nhưng chỉ trong vòng nửa năm, các công cụ coding tôi sử dụng đã thay đổi sang các công cụ dựa trên CLI như **Claude Code**, **Gemini CLI**, **Codex CLI**, cùng với các cơ chế tiện lợi như **MCP** (Model Context Protocol) kết nối với LLM để thực hiện nhiều chức năng khác nhau. Tình hình best practices đang thay đổi hàng ngày.

### Nguyên Tắc Cơ Bản Không Thay Đổi

Tuy nhiên, mặc dù bản thân các công cụ đang thay đổi lớn, tôi nghĩ vẫn có những **suy nghĩ cơ bản không thay đổi nhiều**. Cụ thể như sau:

1. **Tầm quan trọng của tài liệu** (Spec-driven development - 仕様駆動開発)
2. **Tự động hóa dựa trên quy tắc** (Cấu hình Lint/Format, v.v.)
3. **Sử dụng linh hoạt nhiều công cụ khác nhau** (Không bị lock-in)
4. **Học bằng cách làm hơn là học lý thuyết** (Trước tiên hãy thử làm)

Bài viết này sẽ tóm tắt về **cách xây dựng môi trường và quy trình thực hành để thực hiện AI coding hiệu quả** tính đến tháng 12 năm 2025, tuân theo các suy nghĩ trên và cố gắng không phụ thuộc vào công cụ cụ thể nào.

### Hình Ảnh Quy Trình Cụ Thể

*(Bài viết gốc có sơ đồ quy trình trực quan)*

LLM và công cụ tối ưu sẽ tiếp tục thay đổi trong tương lai, nhưng nếu bạn thực hành với ý thức về cách suy nghĩ cơ bản, tôi nghĩ việc đối ứng trong tương lai sẽ dễ dàng hơn. Vui lòng tham khảo nếu bạn quan tâm.

---

## Công Cụ AI Coding

### Lựa Chọn Công Cụ

Về công cụ AI coding, do có sự cạnh tranh phát triển LLM giữa các doanh nghiệp, **hiệu suất ưu việt của chúng thay đổi hàng tháng**.

Bài viết này sẽ giải thích với tiền đề sử dụng **Claude Code** - công cụ có khả năng coding ổn định cao và tồn tại gói định mức (Max plan). Claude Code có các tính năng tiện lợi đặc thù, nhưng tuân theo nguyên tắc **"使用 linh hoạt nhiều công cụ khác nhau (không bị lock-in)"**, tôi sẽ giới thiệu tập trung vào các tính năng và phương pháp phát triển có thể áp dụng cho **Codex CLI**, **Cursor**, **GitHub Copilot**, v.v. Những người đang sử dụng công cụ coding khác cũng có thể đọc và tham khảo một cách linh hoạt.

### Cách Sử Dụng Cơ Bản của Công Cụ

Về cách sử dụng cơ bản của công cụ, **hướng dẫn của TIS株式会社** viết chi tiết và cẩn thận từ thiết lập đến phương pháp sử dụng cho Claude Code và GitHub Copilot - những công cụ coding có lẽ được sử dụng nhiều trong doanh nghiệp. Tôi khuyên bạn nên đọc một lần trước.

Tuy nhiên, trong bài viết này, tôi sẽ viết để có thể hoàn thành thiết lập tối thiểu ngay cả khi không đọc hướng dẫn trên.

---

## Thiết Lập Các Công Cụ Cần Thiết

Giải thích về thiết lập các công cụ cần thiết. Tiền đề là Mac, nhưng với Linux hoặc Windows (tiền đề là WSL2), về cơ bản có thể thiết lập bằng cách tương tự. Vui lòng điều chỉnh một số phần phù hợp với môi trường của bạn.

Thiết lập sẽ được thực hiện bằng cách thực thi lệnh trong terminal.

### Công Cụ AI Coding

#### Thiết Lập npm/nvm

Trước tiên, hãy thiết lập **npm**. Tôi sử dụng một công cụ gọi là **nvm** để thiết lập. Các lệnh như sau:

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
$ nvm install --lts
```

Nếu muốn biết chi tiết về nvm, vui lòng tham khảo [npm(nvm)をセットアップする方法](https://zenn.dev/karaage0703/articles/ecf24124c1a535).

#### Cài Đặt Claude Code

Thiết lập Claude Code rất đơn giản nếu npm đã được cài đặt, chỉ cần thực thi lệnh sau:

```bash
$ npm install -g @anthropic-ai/claude-code
```

#### Các Công Cụ Thay Thế

Để tham khảo, thiết lập Codex CLI và Gemini CLI như sau:

```bash
$ npm install -g @openai/codex
```

```bash
$ npm install -g @google/gemini-cli
```

### Trình Soạn Thảo Code

Về trình soạn thảo code, tiền đề là thiết lập **VS Code**. Nếu bạn sử dụng công cụ coding tích hợp trình soạn thảo như Cursor, vui lòng cài đặt công cụ tương ứng.

Vui lòng tải xuống từ [trang tải xuống VS Code](https://code.visualstudio.com/download). Để biết chi tiết hơn về phương pháp cài đặt VS Code và cách sử dụng cơ bản, xin tham khảo cuốn sách Zenn sau đây của tôi.

*(Tác giả có cuốn sách Zenn về VS Code)*

### Cấu Hình Linter/Formatter

Đây là chi tiết nhỏ, nhưng tôi khuyên bạn nên thiết lập Linter/Formatter trong VS Code.

Đối với Python, tôi khuyến nghị sử dụng **Ruff**. Tôi khuyên bạn nên tham khảo bài viết sau để thiết lập tự động kiểm tra Lint và Format khi lưu file.

*(Bài viết tham khảo về Ruff)*

**Lý do:** AI coding đôi khi có khoảng trắng không cần thiết, và sau khi coding, AI tự kiểm tra Lint/Format, nhưng đó là lãng phí AI. Nên giao cho công cụ chuyên dụng sẽ tốt hơn. Điều này giống như khi con người coding.

### GitHub CLI (lệnh gh)

Cài đặt **lệnh gh** để truy cập và thao tác CLI trên GitHub. Khi chuẩn bị lệnh gh, AI có thể thực hiện tất cả các thao tác cần thiết cho phát triển phần mềm trên GitHub kết hợp với lệnh git. Ví dụ, không chỉ commit git mà còn có thể để AI thực hiện Pull Request và code review.

#### Cài Đặt

Với Mac, có thể cài đặt bằng lệnh sau:

```bash
$ brew install gh
```

Với Linux, Windows (WSL2), lệnh như sau:

```bash
$ sudo apt install gh
```

#### Xác Thực

Sau khi cài đặt gh, thực thi lệnh sau để thực hiện xác thực GitHub:

```bash
$ gh auth login
```

Sau khi hoàn thành xác thực, bạn có thể thực hiện nhiều thao tác GitHub khác nhau bằng lệnh gh.

Về cơ bản có thể giao cho AI, nhưng tốt nhất nên biết các lệnh cơ bản.

### MCP Server

Đây **không phải là bắt buộc mà là thiết lập được khuyến nghị**. Là context engineering, để nhập dữ liệu phù hợp cho LLM, sử dụng MCP có thể nâng cao chất lượng AI coding.

Để biết chi tiết về MCP, vui lòng tham khảo cuốn sách **"PythonではじめるMCP開発入門"** do 3 thành viên Matsuo Institute bao gồm tôi viết.

Trong bài viết này, tôi chỉ giải thích phương pháp thiết lập và mô tả đơn giản về MCP server.

#### Thiết Lập MCP Server

Phương pháp thiết lập MCP server khác nhau tùy theo công cụ AI coding sử dụng. Ở đây, tôi sẽ sử dụng công cụ OSS **[mmcp](https://github.com/koki-develop/mmcp)** - có thể thiết lập MCP server cho nhiều công cụ AI coding bằng phương pháp chung.

##### Cài Đặt mmcp

Cài đặt mmcp chỉ cần thực thi lệnh sau:

```bash
$ npm install -g mmcp
```

##### Đăng Ký Công Cụ AI

Thực thi lệnh sau để có thể thiết lập công cụ AI coding mà bạn sử dụng:

```bash
mmcp agents add claude-code codex-cli gemini-cli
```

Sau đó, chỉ cần thêm MCP server, nó sẽ được thiết lập cho tất cả công cụ AI coding đã đăng ký.

Dưới đây tôi sẽ giới thiệu tổng quan về MCP server và phương pháp thiết lập bằng mmcp.

##### Context7

Là MCP server cung cấp tài liệu specification mới nhất. Giảm tình trạng bực mình khi công cụ AI coding viết code theo specification cũ.

Chỉ cần viết **"Context7を使って"** ở cuối prompt là nó sẽ tham chiếu specification mới nhất.

**Lệnh thiết lập với mmcp:**

```bash
$ mmcp add context7 -- npx -y @upstash/context7-mcp
$ mmcp apply
```

##### playwright

Có thể thao tác browser bằng LLM. Có thể sử dụng khi muốn để LLM thực hiện test trên browser. Bạn có thể xác nhận hoạt động bằng cách yêu cầu LLM **"playwrightでYahoo Japanを開いて"**.

**Lệnh thiết lập với mmcp:**

```bash
$ mmcp add playwright -- npx -y @playwright/mcp@latest
$ mmcp apply
```

**Tham khảo:** [Claude Codeとplaywright mcpを連携させると開発体験が向上するのでみんなやろう](https://zenn.dev/sesere/articles/4c0b55102dcc84)

##### Các MCP Server Khác

Có nhiều MCP server tiện lợi khác. Nếu là Claude Code, bạn có thể tham khảo bài viết sau để thiết lập dễ dàng chỉ với một lệnh.

*(Bài viết tham khảo khác)*

**Lưu ý quan trọng:** Nếu đăng ký quá nhiều MCP server, sẽ sử dụng context một cách lãng phí và có thể gây hiệu quả ngược. Hãy thiết lập để không sử dụng MCP server không cần thiết cho project.

Với Claude Code, có thể bật/tắt MCP server theo từng project bằng lệnh `/mcp`.

---

## Quy Trình Phát Triển Phần Mềm

Trong phát triển phần mềm, **tài liệu cũng quan trọng như code** (không giới hạn cho AI coding). Bằng cách sử dụng AI để tạo không chỉ code mà cả tài liệu, có thể phát triển phần mềm dễ hiểu với con người và dễ bảo trì.

Xu hướng xem xét lại tầm quan trọng của tài liệu này gần đây được gọi là **spec-driven development (仕様駆動開発)**, và các công cụ để tạo tài liệu cần thiết cho phát triển bằng AI đang phong phú, nên có thể tạo tài liệu một cách hiệu quả bằng AI với những công cụ đó.

### Công Cụ Spec-Driven Development

Về công cụ spec-driven development, có nhiều công cụ như:

- **[Kiro](https://aws.amazon.com/jp/blogs/news/introducing-kiro-cli/)** của Amazon
- **[Spec Kit](https://github.com/github/spec-kit)** của GitHub
- **[cc-sdd](https://github.com/gotalab/cc-sdd)** OSS

Spec Kit do GitHub phát triển nên kỳ vọng cao, nhưng vì hướng đến enterprise, phù hợp với phát triển quy mô lớn và chi phí học tập cao, lần này tôi sẽ lấy ví dụ **`cc-sdd`** - một OSS Nhật Bản tương thích với Kiro và có thể sử dụng dễ dàng với nhiều công cụ AI coding khác nhau.

**Lưu ý quan trọng:** Ưu thế của những công cụ này có thể thay đổi trong tương lai, nhưng tài liệu được tạo bởi công cụ là file text dạng markdown, nên có thể sử dụng ngay cả khi công cụ thay đổi.

**Điều quan trọng** là tạo và quản lý tài liệu tương ứng với code.

### Thiết Lập cc-sdd

Trong thư mục phát triển project đích, thực thi lệnh sau để cài đặt `cc-sdd`. Dưới đây là ví dụ với Claude Code:

```bash
$ npx cc-sdd@latest --claude --lang ja 
```

Nếu muốn sử dụng AI agent khác ngoài Claude Code, hoặc muốn biết các option khác, hãy tham khảo [hướng dẫn chính thức](https://github.com/gotalab/cc-sdd/blob/main/tools/cc-sdd/README_ja.md).

### Tạo Tài Liệu Ban Đầu

Khởi động công cụ AI coding và thực thi lệnh trên công cụ. Tôi sẽ đưa ví dụ với Claude Code, nhưng với các AI agent khác về cơ bản cũng có thể thao tác tương tự.

#### Chuẩn Bị Project Mới

Trước tiên, hãy chuẩn bị project mới. Nếu có template mà công ty hoặc cá nhân đang sử dụng, nên sử dụng nó. Trong trường hợp Matsuo Institute, có template cookiecutter nên trong nhiều trường hợp sẽ sử dụng nó.

#### Trường Hợp Có Template hoặc File Đang Phát Triển

Nếu có template hoặc file đang phát triển chưa có tài liệu, trước tiên hãy thực thi lệnh slash sau. Nó sẽ đọc file và tạo tài liệu cần thiết. Nếu phát triển hoàn toàn từ số 0, có thể bỏ qua ở đây.

```
/kiro:steering
```

#### Khởi Tạo Specification

Tiếp theo, với phát triển mới, nhập nội dung phát triển; với tiếp tục phát triển hiện có, nhập nội dung muốn phát triển mới (tính năng mới, v.v.) như sau:

```
/kiro:spec-init シンプルなチャットアプリ
```

Các lệnh sau đó như được viết trong [hướng dẫn chính thức](https://github.com/gotalab/cc-sdd/blob/main/tools/cc-sdd/README_ja.md), nhưng về cơ bản AI sẽ hướng dẫn các lệnh tiếp theo, nên chỉ cần nhớ thực thi bước đầu tiên là OK.

#### Sau Khi Hoàn Thành Tạo Task

Sau khi hoàn thành tạo task, việc tạo tài liệu đã hoàn tất. Tài liệu nằm dưới `.kiro/steering`. Ở giai đoạn này hãy push lên GitHub. `.claude` và `.kiro/settings` cũng có file được tạo, nhưng đây là file cấu hình của bản thân kiro nên tốt hơn là không đưa vào quản lý Git, nên nên thêm vào `.gitignore`.

#### Push Lên GitHub

Có thể push bằng lệnh lên GitHub, nhưng vì đã thiết lập lệnh gh, hãy thử nhờ LLM. Với trường hợp tạo mới, sau khi tạo repository trên GUI của GitHub, hãy yêu cầu với prompt như sau:

```
git initして、comitしてGitHubにghを使ってpushしてください。リポジトリのURLは以下です。
https://github.com/xxxx/xxxxxx
```

Với trường hợp tiếp tục phát triển project hiện có (phát triển tính năng mới, v.v.), có thể tạo Pull Request với prompt như sau:

```
新たにブランチを切って、commitしてpushしてghを使ってPull Requestを作成してください。

Pull Requestのテンプレートは以下を使用してください。
.github/pull_request_template.md
```

Như vậy file cần thiết sẽ được push lên repository.

#### Giải Phóng Context

Sau khi hoàn thành đến đây, hãy giải phóng context một lần. Phương pháp giải phóng context khác nhau tùy công cụ AI coding. Với Claude Code, thực thi `/clear` là OK. Với bất kỳ công cụ nào, nếu thoát application thì chắc chắn context sẽ được giải phóng.

**Best practice:** Sau công việc này, mỗi khi làm điều gì mới, nên định kỳ thực hiện `/clear`. Vì có tài liệu, ngay cả khi `/clear`, AI sẽ xác nhận tài liệu trước và nắm bắt tình hình hiện tại rồi làm việc.

### Liên Kết GitHub Project

Đây là Tips khi phát triển nhóm, giới thiệu cách sử dụng công cụ AI coding để liên kết với GitHub (nếu không cần có thể bỏ qua).

Vì giả định sử dụng GitHub Project để quản lý task, trước tiên thực thi lệnh sau để thiết lập quyền truy cập GitHub Project từ GitHub CLI (gh):

```bash
$ gh auth refresh -s project
```

#### Đăng Ký Task Lên GitHub Issues

Tiếp theo, đăng ký task đã tạo trong tài liệu lên issues của GitHub. Chỉ dẫn với công cụ AI coding bằng prompt như sau:

```
@tasks.md をGitHubのissueにghコマンドで登録してください。
```

Task sẽ được đăng ký lên issues của GitHub nhanh chóng.

#### Tạo GitHub Project

Tiếp theo, tạo GitHub Project trên GitHub. Thiết lập Project, ở đây chọn Roadmap (có thể thay đổi giao diện sau).

#### Liên Kết Repository với Project

Liên kết repository của project với Project.

#### Thiết Lập Lịch Trình

Sau đó có thể thiết lập lịch trình với prompt như sau. URL của project, vui lòng thay bằng của bạn:

```
すべてのgithub issuesにStart dateとTarget dateを設定してください
1ヶ月で終わるように、タスクの難易度に応じてスケジュールを設定してください
GitHub Projectsのカスタムフィールドとして設定してください。プロジェクトは以下です。
https://github.com/users/karaage0703/projects/xxx/
```

Biểu đồ Gantt của project sẽ được vẽ trong chốc lát.

**Ưu điểm:** Quản lý task tất nhiên có thể sử dụng công cụ khác, nhưng GitHub Project vì có thể quản lý bằng lệnh gh, nên tôi cảm thấy tương thích với công cụ AI coding khá tốt.

### Triển Khai

Tiếp theo, triển khai task. Dưới đây là ví dụ prompt. Tất nhiên, chỉ định cụ thể bằng số task cũng OK:

```
/kiro:spec-impl task.mdをもとに続きから順に実装してください。タスクはGitHub issueとも対応しているので、そちらも合わせて対処してください
```

Sau khi hoàn thành triển khai, hãy tạo Pull Request. LLM sẽ tạo Pull Request với prompt như sau:

```
commitしてpushしてghでPull Requestしてください
```

Nên giải phóng context theo từng task.

### Code Review

Trong việc sử dụng AI coding, do tốc độ tạo code tăng cao, **review để đảm bảo chất lượng của nó có ý nghĩa quan trọng hơn**.

Review cũng có hiệu quả khi sử dụng AI, nhưng ít nhất ở giai đoạn hiện tại, không nên giao hoàn toàn cho AI mà nên sử dụng với ý thức **hỗ trợ - thêm reviewer để ngăn chặn sơ suất của con người**.

#### GitHub Copilot

Dễ sử dụng nhất tôi nghĩ là **GitHub Copilot**. Tốt nhất là sử dụng nó để ngăn chặn sót review. Phương pháp sử dụng và thiết lập, hướng dẫn chính thức sau đây có thể tham khảo.

*(Link hướng dẫn chính thức GitHub Copilot)*

#### Sử Dụng Công Cụ AI Coding

Tất nhiên, review bằng công cụ AI coding cũng có thể. Đơn giản nhất là có thể review như sau:

```
以下のPull Requestをレビューしてください
<PRのURL>
```

#### Plugin Tùy Chỉnh của Tác Giả

Tôi cá nhân đang tạo plugin trên Claude Code để tham chiếu template Pull Request trong khi tư vấn với Codex theo kiểu multi-agent để review.

Chỉ hỗ trợ Claude Code, nhưng nếu bạn quan tâm, vui lòng thử.

**Thiết lập trên Claude Code:**

```
/plugin marketplace add https://github.com/karaage0703/claude-coding-assistant
/plugin install coding-assistant@karaage0703/claude-coding-assistant
```

#### Chiến Lược Multi-AI

Ngoài con người, **sử dụng nhiều AI để kiểm tra code từ nhiều góc độ khác nhau** sẽ tốt.

---

## Kết Luận

Tôi đã giới thiệu phương pháp xây dựng môi trường thực hành AI coding và quy trình phát triển phần mềm sử dụng công cụ AI coding. Có thể xác nhận rằng **cách suy nghĩ cơ bản về coding sử dụng AI bản thân không thay đổi nhiều mặc dù sự thay đổi của công cụ rất nhanh**.

### Matsuo Institute và AI Coding

Matsuo Institute đang chú ý đến công cụ AI coding như **phương tiện cải thiện năng suất bằng việc sử dụng AI** và đang tiến hành xem xét sử dụng. Chúng tôi cũng đã bắt đầu chế độ hỗ trợ về chi phí cho việc sử dụng công cụ AI coding. Về chi tiết, mặc dù không công khai, nhưng như đã ghi ở đầu bài viết, do tình hình nhiều công cụ cạnh tranh về hiệu suất và thay đổi nhanh, để có thể đối ứng linh hoạt với sự thay đổi đó, chúng tôi đang **sử dụng nhiều công cụ có triển vọng**.

### Nội Dung Tương Lai

Trên tech blog của Matsuo Institute, chúng tôi sẽ tiếp tục phát hành về việc sử dụng AI bao gồm sử dụng công cụ AI coding trong tương lai. Nếu bạn quan tâm, vui lòng ủng hộ và follow!

### Tuyển Dụng

**Matsuo Institute đang tuyển đồng nghiệp làm việc cùng nhau!**

- [Trang chủ Matsuo Institute](https://matsuo-institute.com/)
- [Trang tuyển dụng](https://matsuo-institute.com/recruit/)
- [Bài phỏng vấn thành viên](https://matsuo-institute.com/recruit-news/)
- [Tư vấn phát triển AI tại đây](https://matsuo-institute.com/contact/)

---

**Tác giả:** からあげ (karaage0703) - [@karaage0703](https://x.com/@karaage0703)  
**Vai trò:** Engineer làm việc về AI  
**GitHub:** [@karaage0703](https://github.com/karaage0703)  
**Blog:** karaage.hatenadiary.jp  
**Publication:** 松尾研究所テックブログ - 株式会社松尾研究所  
**Publication GitHub:** [@matsuoinstitute](https://github.com/matsuoinstitute)  
**Publication Twitter:** [@matsuoinstitute](https://x.com/@matsuoinstitute)

**Người dịch:** 日平  
**Nguồn:** https://zenn.dev/mkj/articles/bf59c4c86d98a8
