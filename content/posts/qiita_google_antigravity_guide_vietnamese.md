---
title: "【Bản lưu trữ】Hướng dẫn toàn diện Google Antigravity - IDE thế hệ mới dạng Agent"
date: 2025-11-20
categories: ["Development"]
tags: ["Google Antigravity", "AI Agent", "IDE", "Gemini", "Claude", "Browser Agent", "MCP", "VS Code", "#Tech_News"]
author: "あきらパパ (@akira_papa_AI)"
description: "Hướng dẫn toàn diện Google Antigravity. IDE Agent-first thế hệ mới với Browser Agent tự động, hỗ trợ nhiều AI model (Gemini 3 Pro, Claude Sonnet 4.5), tích hợp MCP với công cụ bên ngoài."
source: "https://qiita.com/akira_papa_AI/items/0acf2679e4ce9f7fb153"
draft: false
---


**Tác giả**: あきらパパ (@akira_papa_AI)  
**Nguồn**: Qiita  
**Ngày xuất bản**: 2025-11-20  
**Ngày cập nhật**: 2025-11-20  
**Tags**: cursor, Gemini, 生成AI, Windsurf, Antigravity  
**Bài gốc**: https://qiita.com/akira_papa_AI/items/0acf2679e4ce9f7fb153

👍 96 Likes | 📚 73 Stocks

## Tổng quan

Google Antigravity là nền tảng tiến hóa IDE (môi trường phát triển tích hợp) truyền thống vào kỷ nguyên "Agent First". Trong khi có giao diện người dùng quen thuộc dựa trên VS Code, cốt lõi của nó là "Agent (エージェント)". Agent không chỉ viết code đơn thuần, mà còn thực hiện tự chủ các thao tác terminal, kiểm tra trên browser, và thậm chí cả việc lập kế hoạch.

---

## Giới thiệu

Google Antigravity đã được phát hành. Ban đầu nghĩ "Cursor, Windsurf...lại một editor tích hợp AI nữa à", nhưng trong quá trình đọc tài liệu, suy nghĩ đã thay đổi. Google Antigravity không chỉ là "editor có bổ sung AI" đơn thuần, mà là môi trường phát triển với "Agent (AI tự chủ tư duy)" là vai trò chính. Từ thao tác browser đến phát triển đồng thời nhiều repository, đầy ắp các tính năng của tương lai.

## Antigravity là gì?

Google Antigravity là nền tảng tiến hóa IDE truyền thống vào kỷ nguyên "Agent First". Trong khi có giao diện người dùng quen thuộc dựa trên VS Code, cốt lõi của nó là "Agent". Agent không chỉ viết code, mà còn thực hiện thao tác terminal, kiểm tra trên browser, và lập kế hoạch một cách tự chủ. Trước đây các AI editor là kiểu "sửa chỗ này đi", nhưng Antigravity nếu bạn nói "hãy triển khai tính năng này", nó sẽ lập kế hoạch, viết code, và thậm chí kiểm tra hoạt động trên browser.

### Các tính năng cốt lõi chính

• Editor: Editor dựa trên VS Code tích hợp AI
• Agent Manager: Trung tâm điều khiển quản lý tập trung nhiều workspace và agent
• Browser Agent: Agent tự thao tác browser để thực hiện task
• MCP (Model Context Protocol): Giao thức chuẩn kết nối với công cụ và DB bên ngoài

## Cài đặt và chuẩn bị (Cực kỳ quan trọng)

Có một số yêu cầu để bắt đầu sử dụng. Vì nhiều người có thể gặp khó khăn ở đây nên cần kiểm tra kỹ.

### Tải xuống

Google Antigravity Download
URL: Có thể tải từ https://antigravity.google/download

### Yêu cầu hệ thống

**macOS:**
• Phiên bản được hỗ trợ bởi bản cập nhật bảo mật của Apple (thường là phiên bản hiện tại + 2 phiên bản trước)
• Yêu cầu tối thiểu: macOS 12 (Monterey)
• **Lưu ý: Không hỗ trợ X86 (Intel Mac). Bắt buộc phải có Apple Silicon (M1/M2/M3/M4, v.v.)**

**Windows:**
• Windows 10 (64 bit)

**Linux:**
• glibc >= 2.28, glibcxx >= 3.4.25 (Ubuntu 20, Debian 10, Fedora 36, RHEL 8, v.v.)

### Xác thực và khu vực có thể sử dụng

**Tài khoản**: Hiện tại chỉ hỗ trợ tài khoản Google cá nhân (@gmail.com). Tài khoản Workspace (doanh nghiệp, v.v.) không được hỗ trợ ngay cả khi sử dụng cá nhân. Dự đoán nhiều người sẽ gặp trường hợp "Hả?" khi cố đăng nhập bằng email công ty. Vì hiện đang ở giai đoạn public preview nên cần sử dụng Gmail cá nhân.

**Khu vực**: Có thể sử dụng ở nhiều quốc gia bao gồm Nhật Bản (Japan), nhưng không thể sử dụng ở các quốc gia không có trong danh sách. Nhật Bản nằm trong danh sách quốc gia được hỗ trợ.

## Màn hình cơ bản và điều hướng

Antigravity có 2 "khuôn mặt" chính:
• Editor (エディタ): Màn hình quen thuộc để viết code
• Agent Manager (エージェントマネージャー): Màn hình quản lý để chỉ huy agent

### Chuyển đổi màn hình

Phím tắt: Cmd + E (Mac) / Ctrl + E (Windows)
Chuyển đổi giữa editor và manager trong chớp mắt. Chuyển đổi nhanh bằng Cmd + E là thao tác cơ bản theo phong cách Antigravity. Cũng có thể chuyển đổi từ nút ở góc trên bên trái của editor.

## Hiểu về người bạn đồng hành mạnh nhất "Agent"

Trái tim của Antigravity, đó chính là "Agent".

### Các mô hình sử dụng (Models)

Không chỉ mô hình của Google mà còn có thể chọn mô hình của các công ty khác (theo tài liệu). Chọn từ dropdown dưới hộp prompt đối thoại:
• Gemini 3 Pro (High / Low) - Flagship mới nhất của Google
• Claude Sonnet 4.5 (Phiên bản thường / Phiên bản Thinking)
• GPT-OSS

Có thể chuyển đổi mô hình theo từng lượt của người dùng, nên có thể sử dụng phân chia như "suy luận bằng Claude, triển khai bằng Gemini".

### Chế độ Agent (Agent Modes)

Có thể chọn chế độ tùy theo độ nặng của task:

**1. Planning Mode (Chế độ lập kế hoạch)**
• Mục đích sử dụng: Task phức tạp, nghiên cứu sâu, làm việc cộng tác
• Hành vi: Không viết code ngay lập tức, trước tiên tạo "Task Groups" và "Artifacts (kế hoạch)" để suy nghĩ kỹ lưỡng

**2. Fast Mode (Chế độ nhanh)**
• Mục đích sử dụng: Thay đổi tên biến, thực thi lệnh bash đơn giản, v.v.
• Hành vi: Bỏ qua việc lập kế hoạch và thực hiện task ngay lập tức

Cơ bản thì "Planning" có vẻ tốt. Việc agent lập kế hoạch kỹ càng để không mất kiểm soát mang lại cảm giác yên tâm. "Fast" thì có cảm giác sử dụng giống chat AI truyền thống.

### Quyền truy cập file

Mặc định, agent chỉ có thể chạm vào "workspace hiện tại" và "~/.antigravity/ (file cấu hình, v.v.)".

**Cài đặt**: Có thể cho phép truy cập file bên ngoài tại Agent > Non-Workspace File Access, nhưng cần chú ý về mặt bảo mật.

## Tính năng Editor: Tab và Command

Không chỉ agent, tính năng hỗ trợ khi viết code cũng mạnh mẽ.

### Tab (Supercomplete)

"Super complete" vượt xa auto complete thông thường:
• **Supercomplete**: Không chỉ vị trí con trỏ, mà xem toàn bộ file và đề xuất đồng thời như thay đổi tên biến
• **Tab-to-Jump**: Nhảy con trỏ đến vị trí cần chỉnh sửa tiếp theo
• **Tab-to-Import**: Khi sử dụng class chưa được định nghĩa, v.v., tự động đề xuất và thêm câu lệnh import

Chỉ cần nhấn phím Tab, từ việc thêm câu lệnh import đến di chuyển đến vị trí chỉnh sửa tiếp theo đều được thực hiện. Có lẽ tương lai kiểu "công việc kết thúc khi đang liên tục nhấn phím Tab" sẽ đến.

### Command

Tính năng tạo và chỉnh sửa code bằng ngôn ngữ tự nhiên.

**Phím tắt**: Cmd + I (Mac) / Ctrl + I (Win)

**Cách sử dụng:**
• Trên editor: "Hãy tạo component React cho form đăng nhập"
• Trên terminal: "Hãy kill process đang sử dụng port 3000"

## Thành phẩm "Artifacts" và quản lý task

Agent nộp kết quả công việc dưới dạng "Artifacts (アーティファクト)". Đây là một trong những đặc điểm lớn nhất của Antigravity.

### Các loại Artifacts chính

**1. Implementation Plan (Kế hoạch triển khai)**
• Kế hoạch mà agent tạo trước khi thay đổi code
• **Quan trọng**: Người dùng có thể "Review (レビュー)" cái này và đưa ra chỉ thị sửa đổi bằng comment. Nếu OK thì thực hiện bằng "Proceed"

**2. Task List**
• Todo list của nghiên cứu, triển khai, kiểm tra, v.v. Có thể xem tình trạng tiến độ realtime

**3. Walkthrough**
• "Tóm tắt" sau khi hoàn thành công việc. Bao gồm tóm tắt nội dung thay đổi, screenshot, v.v.

**4. Screenshots / Browser Recordings**
• Hình ảnh bằng chứng và video về thao tác browser
• Khi gõ prompt "Hãy xem và xác nhận trên browser" thì sẽ thực sự xác nhận browser

### Thực tế trên mac của tôi không chạy lúc đầu, đã chạy tốt sau khi thực hiện như sau

Sau khi cài đặt Antigravity, thực hiện thủ công:
• Bật Accessibility ON
• Chuyển xác thực người dùng Antigravity từ người dùng Google Workspace sang người dùng cá nhân
• Khởi động lại Mac và mở Antigravity
• Khi gõ prompt "Hãy xem và xác nhận trên browser", nút chấp thuận sẽ xuất hiện
• Cài đặt extension trong browser đã mở Antigravity Browser Extension (https://chromewebstore.google.com/detail/antigravity-browser-exten/eeijfnjmjelapkebgockoeaadonbchdd)

Nhờ đó đã có thể sử dụng được chức năng Browser. Nếu không chạy tốt xin hãy thử.

### Cài đặt chính sách review

Nếu phiền vì agent cứ yêu cầu phép liên tục, có thể thay đổi trong cài đặt:
• **Request Review**: Luôn để con người review (khuyến nghị mặc định)
• **Agent Decides**: Khi agent tự tin thì tự tiến hành
• **Always Proceed**: Tiến hành không kiểm tra (dành cho người dũng cảm)

Lúc đầu nên để "Request Review". Vì đề xuất của agent thường khác với ý định, nên việc có thể điều chỉnh hướng đi bằng comment trước khi triển khai là cực kỳ tiện lợi.

## Tính năng cách mạng: Browser Agent

Tinh hoa của Antigravity, chức năng thao tác browser.

### Có thể làm gì?

• **Thao tác**: Click, scroll, nhập, đọc console log
• **Thị giác**: Screenshot, capture DOM, quay video
• **Độc lập**: Hoạt động bằng "Separate Chrome Profile". Nghĩa là được cách ly với cookie và trạng thái đăng nhập của Chrome sử dụng hàng ngày

Có thể giao task kiểu "Hãy xác nhận hoạt động của app được khởi động trên local server (localhost:3000)". Hơn nữa vì là profile riêng nên không lo session Gmail của mình bị ngắt.

### Browser Subagent

Ngoài agent chính, một mô hình chuyên biệt về thao tác browser (như Gemini 2.5 Pro UI Checkpoint) hoạt động ở hậu trường. Trong khi thao tác, khung màu xanh và nội dung action được hiển thị trên browser, và bị khóa để con người không làm phiền.

### Bảo mật (Allowlist / Denylist)

Có 2 tầng bảo vệ để không tự ý truy cập site đáng ngờ:
1. **Denylist**: "Danh sách URL nguy hiểm" do Google quản lý. Không thể truy cập
2. **Allowlist**: Danh sách URL mà người dùng cho phép
• Khi cố truy cập site không có trong danh sách, popup "Bạn có cho phép không?" sẽ xuất hiện

### Chrome Extension

Extension bắt buộc để Antigravity điều khiển browser. Sẽ được yêu cầu cài đặt lúc khởi động lần đầu.

🔗Antigravity Browser Extension - Chrome Web Store
URL: https://chromewebstore.google.com/detail/antigravity-browser-exten/eeijfnjmjelapkebgockoeaadonbchdd

## Agent Manager: Màn hình quản lý toàn tri toàn năng

Màn hình thứ hai mở bằng Cmd + E.

### Workspaces (ワークスペース)

Có thể quản lý đồng thời nhiều project (folder). Chọn folder từ sidebar và có thể chạy agent khác nhau trong từng workspace. Đây là tính năng tuyệt vời cho senior engineer đi lại giữa nhiều repository. Có thể multitask như trong khi đợi build project A thì chỉ thị cho agent sửa bug của project B...

### Inbox (インボックス)

Trung tâm thông báo của tất cả thread. Các task như "Đợi phép thực thi lệnh terminal" "Đợi phép thao tác browser" được tập trung ở đây.

### Playground (プレイグラウンド)

Nơi thử nghiệm tạm thời không gắn với folder cụ thể. Sử dụng khi "muốn thử code này một chút", nếu thích thì sau có thể lưu vào workspace (Move).

## Tính năng mở rộng: MCP và Knowledge

Các tính năng làm Antigravity thông minh hơn nữa.

### MCP (Model Context Protocol)

Quy cách kết nối editor với công cụ bên ngoài.

**Có thể làm gì?**
• Đọc schema của Postgres và viết SQL
• Tạo ticket của Linear
• Tìm kiếm document của Notion

**Cách triển khai**: Cài đặt từ menu "..." ở phía trên editor > MCP Store

Đây là MCP đang được bàn tán hiện nay. Vì có thể truyền thông tin của công cụ bên ngoài cho AI như context (ngữ cảnh), nên chỉ thị kiểu "Hãy sửa dựa trên nội dung ticket #123 của Linear" sẽ được hiểu.

### Knowledge (ナレッジ)

"Trí nhớ" của Antigravity. Tự động lưu các insight quan trọng, pattern, giải pháp thu được trong cuộc hội thoại như "Knowledge Item". Từ lần sau, agent sẽ tham khảo trí nhớ này và hành động thông minh hơn.

## Cài đặt, Giới hạn, FAQ

Thông số kỹ thuật chi tiết cần biết.

### Gói giá

Hiện tại ngày 2025/11/20 là **No-cost Public Preview (預覧无料)**.

**Rate Limits (制限):**
• Quota (khung sử dụng) được reset mỗi 5 giờ
• Thiết kế không đạt giới hạn trên với sử dụng thông thường, nhưng chú ý không sử dụng quá nhiều

### Cài đặt tiện lợi (Settings)

Mở cài đặt bằng Cmd + ,

**Terminal Command Auto Execution:**
• **Off**: Luôn yêu cầu phép
• **Auto**: Agent tự phán đoán
• **Turbo**: Thực thi mạnh mẽ ngoại trừ lệnh có rủi ro (dành cho người dùng nâng cao)

### Theme

Vì dựa trên VS Code nên có thể sử dụng theme yêu thích.

### Câu hỏi thường gặp (FAQ)

**Q: PC sleep thì sao?**
A: Khi agent đang hoạt động, Antigravity sẽ ngăn PC sleep.

**Q: Extension có thể sử dụng không?**
A: Có thể cài đặt extension tương thích VS Code từ Open VSX marketplace.

**Q: Hỗ trợ?**
A: Trong thời gian preview liên hệ antigravity-support@google.com (khuyến nghị tiếng Anh).

## Tổng kết

Google Antigravity không chỉ là công cụ bổ sung code đơn thuần, mà là công cụ có cảm giác như "đồng nghiệp AI làm việc cùng" cư trú trong PC.

### Điểm tuyệt vời

• **Agent** tự chủ thực hiện từ lập kế hoạch, triển khai đến xác nhận browser
• Vì tiến hành trong khi review thành phẩm bằng **Artifacts** nên yên tâm ngay cả khi giao cho AI
• Có thể tự động hóa đến xác nhận hoạt động của web app bằng **Browser Agent**

Hiện tại vẫn là phiên bản preview, nhưng ẩn chứa khả năng trở thành tiêu chuẩn của phong cách phát triển tương lai. Người dùng Mac (Apple Silicon), hãy tải ngay bây giờ và trải nghiệm phát triển của tương lai.

## Yêu cầu hệ thống

### macOS
- Phiên bản: macOS 12 (Monterey) trở lên
- Bộ xử lý: Bắt buộc Apple Silicon (M1/M2/M3/M4, v.v.)
- Lưu ý: Intel Mac (X86) không được hỗ trợ

### Windows
- Windows 10 (64 bit)

### Linux
- Yêu cầu: glibc >= 2.28, glibcxx >= 3.4.25
- Ví dụ: Ubuntu 20, Debian 10, Fedora 36, RHEL 8, v.v.

### Tài khoản
Chỉ tài khoản Google cá nhân (@gmail.com). Tài khoản Workspace không được hỗ trợ

### Khu vực hỗ trợ
Có thể sử dụng ở nhiều quốc gia bao gồm Nhật Bản

## Phím tắt tiện lợi

- **Chuyển editor/manager**: Cmd + E (Mac) / Ctrl + E (Windows)
- **Command**: Cmd + I (Mac) / Ctrl + I (Windows)
- **Cài đặt**: Cmd + , (Mac)

## Giá

No-cost Public Preview (Xem trước miễn phí)

Giới hạn: Reset quota mỗi 5 giờ. Thiết kế không đạt giới hạn trên với sử dụng thông thường

## Link tham khảo

- [Google Antigravity](https://antigravity.google/)
- [Google Antigravity Download](https://antigravity.google/download)
- [Google Antigravity Documentation](https://antigravity.google/docs/browser)
- [Antigravity Browser Extension - Chrome Web Store](https://chromewebstore.google.com/detail/antigravity-browser-exten/eeijfnjmjelapkebgockoeaadonbchdd)
