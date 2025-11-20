---
title: "Chrome DevTools MCP tự động hóa kiểm tra phát triển Web! Khác gì với Playwright MCP?"
date: 2025-10-02T13:00:00+07:00
draft: false
tags: ["MCP", "Chrome DevTools", "Playwright", "Claude", "Web Development", "Automation"]
categories: ["Business and Technology", "Development"]
author: "とまだ@AI駆動開発"
description: "Tìm hiểu về Chrome DevTools MCP và so sánh với Playwright MCP trong tự động hóa kiểm tra phát triển web"
---

# Chrome DevTools MCP tự động hóa kiểm tra phát triển Web! Khác gì với Playwright MCP?

**Tác giả:** @tomada (とまだ@AI駆動開発)  
**Tổ chức:** Learning Next  
**Ngày đăng:** 2025-09-30  
**Ngày cập nhật:** 2025-10-01  

**Thống kê:** 👍 59 Likes | 📚 41 Stocks | 💬 6 Comments

---

## Giới thiệu

Xin chào, tôi là とまだ.

Việc sao chép từng lỗi console hay chụp screenshot để gửi cho AI trong phát triển frontend khá phiền phức, đúng không?

Thực ra tôi cũng từng lặp đi lặp lại công việc này: mỗi khi có lỗi trong test môi trường local, tôi mở DevTools, copy thông báo lỗi, rồi paste vào Claude Code...

Sau đó [Playwright MCP mà tôi đã giới thiệu trước đây](https://qiita.com/tomada/items/c386d6d173f4af32d0de) đã giúp công việc dễ dàng hơn nhiều, nhưng giờ đây có một công cụ còn tiện lợi hơn nữa.

Kết luận là, nếu chỉ nhắm đến phát triển web cho Chrome, Chrome DevTools MCP có thể giải quyết mọi thứ.

Lần này tôi sẽ giải thích chi tiết về đặc điểm của Chrome DevTools MCP, sự khác biệt với Playwright MCP, và cách sử dụng thực tế!

(Bổ sung: Tôi đã giải thích hoạt động thực tế bằng video. Mời bạn xem nếu có thời gian)

**Video:** [【Chrome DevTools MCP】ブラウザ操作やパフォーマンス確認まで！Playwright MCPとの違いと使い分けを徹底解説](https://www.youtube.com/watch?v=gXwS9dJewrU)

## Tóm tắt cho người bận rộn

- **Chrome DevTools MCP là công cụ tự động hóa browser do Google chính thức cung cấp**
- AI có thể điều khiển Chrome trực tiếp để test và phân tích
- Nhẹ hơn so với Playwright MCP và có 26 công cụ phong phú
- Đặc biệt giỏi phân tích chi tiết đo lường performance
- Lượng sử dụng context (token) gần như tương đương với Playwright MCP
- **Tuy nhiên, vì chỉ dành cho Chrome nên cần kết hợp với Playwright MCP cho test browser khác**

## Chrome DevTools MCP là gì?

### Cơ chế cơ bản của MCP

MCP (Model Context Protocol) giống như một quy tắc chung để kết nối AI với các công cụ bên ngoài.

Ví dụ như nấu ăn, có người nấu ăn theo công thức (AI), và MCP là cơ chế cho phép người đó sử dụng dao thớt, nồi niêu (các công cụ).

Chrome DevTools MCP là "công cụ chuyên dụng cho thao tác browser" trong hộp công cụ đó.

### Tại sao sản phẩm của Google lại tốt?

Điểm mạnh lớn nhất của Chrome DevTools MCP là **được cung cấp bởi chính Google - công ty tạo ra Chrome**.

Nhờ là sản phẩm nội bộ nên có thể tích hợp sâu.

#### 1. Truy cập trực tiếp các chức năng nội bộ của Chrome

Không chỉ sử dụng được toàn bộ chức năng DevTools, mà còn có thể lấy dữ liệu performance chi tiết thường khó lấy được.

Playwright MCP cũng có thể làm được "chạy" hay "không chạy", nhưng Chrome DevTools MCP vượt trội hơn ở việc "tại sao không chạy" và "chỗ nào chậm".

#### 2. Hoạt động ổn định với hỗ trợ chính thức

Khác với sản phẩm bên thứ ba, việc được hỗ trợ ngay lập tức khi Chrome cập nhật cũng là lợi thế lớn.

Đặc biệt trong thời đại thay đổi spec browser thường xuyên như hiện tại, hỗ trợ chính thức là yếu tố an tâm lớn.

## Thực tế có thể làm gì?

Vậy hãy giới thiệu cụ thể Chrome DevTools MCP có thể làm gì qua một số tình huống.

Sau này tôi cũng sẽ giải thích sự khác biệt với Playwright MCP, nhưng trước tiên hãy xem đặc điểm của Chrome DevTools MCP.

### Ứng dụng 1: Tự động phát hiện vấn đề performance

Hãy nhớ lại công việc thủ công truyền thống.

Mở tab Performance của DevTools, bắt đầu ghi, reload trang, phân tích kết quả...

Chuỗi công việc này **khá phiền phức đúng không.**

Tôi cũng đã làm nhiều lần trong công việc thực tế, thành thật mà nói là mất rất nhiều thời gian.

LightHouse tuy tiện lợi nhưng chỉ dừng ở mức chỉ ra tổng quan, nên phân tích bottleneck chi tiết vẫn cần tay người.

Đây là lúc Chrome DevTools MCP phát huy tác dụng.

```
Đo performance của trang này và
cho biết nguyên nhân chậm
```

Chỉ vậy thôi là OK.

### Ứng dụng 2: Điều tra nguyên nhân lỗi

Giả sử có lỗi khi submit form.

Rồi mở console, copy thông báo lỗi, paste vào AI...

**Công việc này không cần thiết nữa.**

Không cần copy-paste thông báo lỗi thủ công nữa.

### Ứng dụng 3: Kiểm tra responsive design

Hiển thị mobile, tablet, PC.

Kiểm tra hiển thị từng cái một khá phiền phức.

Lúc đó cũng giao cho Chrome DevTools MCP.

```
Kiểm tra hiển thị ở 3 kích thước
PC, tablet, smartphone
```

Chỉ vậy thôi, ví dụ sẽ tự động thực hiện các kiểm tra sau:

**Kích thước PC (1920x1080)**
- Kiểm tra hiển thị desktop
- Chụp screenshot
- Phát hiện vấn đề layout

**Kích thước Tablet (768x1024)**
- Kiểm tra hiển thị kích thước iPad
- Phát hiện vấn đề đặc trưng của kích thước trung gian
- Xác nhận khả năng thao tác touch

**Kích thước Smartphone (375x812)**
- Kiểm tra kích thước iPhone X
- Vấn đề hiển thị màn hình dọc
- Check khả năng đọc text

Nếu có layout bị vỡ ở mỗi kích thước, sẽ báo cáo **cụ thể phần tử nào có vấn đề**.

Phát triển Web, đặc biệt là kiểm tra responsive design rất tốn công sức, nhưng sử dụng Chrome DevTools MCP có thể cải thiện hiệu quả đáng kể.

## Phương pháp setup

Ở đây tôi sẽ giải thích phương pháp cài đặt Chrome DevTools MCP trong các AI tool khác nhau.

Về các editor chính thì trên trang chính thức có hướng dẫn cài đặt nên không có gì phải băn khoăn, nhưng tôi vẫn giải thích sơ qua.

### Cài đặt trong Claude Code (đơn giản nhất)

#### Cài đặt bằng một lệnh

```
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

Chỉ vậy thôi. Hoàn thành trong 30 giây.

#### Trường hợp cài đặt thủ công

Tạo `.mcp.json` ở thư mục root của project.

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### Cài đặt các tool khác

#### Trường hợp Cursor

Có nút cài đặt ngay trên GitHub nên click vào đó.

Hoặc thêm JSON sau vào màn hình cài đặt.

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

- Settings → MCP → New MCP Server
- Paste cài đặt JSON ở trên
- Save

#### Trường hợp Codex

**Thêm bằng lệnh (khuyến nghị)**

```
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

**Cài đặt bằng file TOML** Thêm vào `~/.codex/config.toml`

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]
```

#### Trường hợp VS Code (GitHub Copilot)

- **Mở command palette** (Ctrl+Shift+P)
- **Tìm "MCP: Open User Configuration"**
- **Thêm cài đặt vào `mcp.json` đã mở**

Hoặc chạy lệnh sau trong terminal

```
code --add-mcp '{"name":"chrome-devtools","command":"npx","args":["chrome-devtools-mcp@latest"]}'
```

## Khác gì với Playwright MCP?

Đến đây tôi đã giải thích đặc điểm và phương pháp setup của Chrome DevTools MCP.

Vậy so với Playwright MCP mà tôi đã giới thiệu trước đây thì khác gì?

Hãy xem cụ thể sự khác biệt giữa hai bên!

Lần này tôi so sánh theo 3 điểm: **số lượng tool**, **chức năng đặc trưng**, **lượng sử dụng token**.

## Chrome DevTools MCP vs Playwright MCP

Đây là thông tin mới nhất tại thời điểm viết bài này.

| MCP | Số lượng tool | Chức năng đặc trưng |
|-----|---------------|-------------------|
| **Chrome DevTools MCP** | 26 cái | Phong phú về phân tích performance |
| **Playwright MCP** | 21 cái | Hỗ trợ cross-browser |

Thành thật mà nói nhiều tool đều trùng nhau. Ví dụ như mở browser, thao tác bên trong, kiểm tra thông báo lỗi đều giống nhau.

Tuy nhiên, Chrome DevTools MCP có nhiều tool chuyên về phân tích performance.

- `performance_start_trace`: Trace performance chi tiết
- `performance_stop_trace`: Dừng và phân tích trace
- `performance_analyze_insight`: Tự động tạo insight
- `evaluate_script`: Thực thi JavaScript tùy ý

Kết hợp các tool này có thể **phân tích performance sâu hơn**.

Với kinh nghiệm phát triển Web của tôi, đây là phần phiền phức nhất, nên việc có thể giao cho AI qua MCP rất hữu ích.

### Bảng so sánh tool

Tham khảo tài liệu chính thức, tôi tổng hợp số lượng tool và đặc điểm theo từng category.

| Category | ChromeDevTools MCP | Playwright MCP |
|----------|-------------------|----------------|
| **Thao tác browser cơ bản** | ✅ 7 tool<br>• click<br>• fill<br>• drag<br>• hover<br>• fill_form<br>• handle_dialog<br>• upload_file | ✅ Chức năng tương đương<br>• browser_click<br>• browser_type<br>• browser_drag<br>• browser_hover<br>• browser_fill_form<br>• browser_handle_dialog<br>• browser_file_upload |
| **Di chuyển・quản lý trang** | ✅ 7 tool<br>• navigate_page<br>• new_page<br>• close_page<br>• list_pages<br>• select_page<br>• navigate_page_history<br>• wait_for | ✅ Chức năng tương đương<br>• browser_navigate<br>• browser_navigate_back<br>• browser_close<br>• browser_wait_for<br>• browser_tabs |
| **Phân tích Performance** | ⭐ **3 tool (điểm mạnh)**<br>• performance_start_trace<br>• performance_stop_trace<br>• performance_analyze_insight | ❌ Không có<br>(Có thể thêm nhưng hạn chế) |
| **Monitor Network** | ✅ 2 tool<br>• list_network_requests<br>• get_network_request | ✅ 1 tool<br>• browser_network_requests |
| **Chức năng Debug** | ✅ 4 tool<br>• evaluate_script<br>• list_console_messages<br>• take_screenshot<br>• take_snapshot | ✅ Chức năng tương đương<br>• browser_evaluate<br>• browser_console_messages<br>• browser_take_screenshot<br>• browser_snapshot |
| **Emulation** | ⭐ **3 tool (điểm mạnh)**<br>• emulate_cpu<br>• emulate_network<br>• resize_page | ✅ 1 tool<br>• browser_resize |

### So sánh lượng sử dụng token

Tiếp theo, tôi so sánh lượng sử dụng token thực tế.

Prompt đưa ra như sau. Tôi kiểm tra trên site của mình.

```
Site "https://school.learning-next.app/coupons" hiển thị danh sách coupon khóa học Udemy.
Trong đó, hãy cho biết cái nào có tỷ lệ giảm giá cao nhất (số XX % OFF lớn nhất).
Rồi cho biết title khóa học đó và tỷ lệ giảm giá.
Tiếp theo, chuyển đến trang phân phối coupon đó.
Sau đó chuyển đến path "/docs" và kiểm tra có document gì.
Ngoài ra, mỗi lần di chuyển trang hãy check các điểm sau:
- Console có lỗi không
- Nội dung meta description tag
- Design của mỗi trang
```

Ở đây có 3 lần chuyển trang, và chỉ thị kiểm tra lỗi console cũng như chụp screenshot.

Hình ảnh là sau khi phát triển một chức năng nào đó, cho AI thực hiện chuỗi hành động này để kiểm tra có vấn đề gì không.

Rồi thực hiện với Chrome DevTools MCP và Playwright MCP để so sánh lượng sử dụng context.
(Ở đây tôi dùng cùng nghĩa với "lượng sử dụng token")

Kiểm tra bằng lệnh `/context` của Claude Code.

**Kết quả:**

| MCP | Lượng sử dụng context ban đầu | Lượng sử dụng sau thực hiện | Tăng thêm |
|-----|------------------------------|----------------------------|-----------|
| Chrome DevTools MCP | 54% | 68% | +14% |
| Playwright MCP | 52% | 64% | +12% |

※ Đừng quan tâm đến chênh lệch giá trị ban đầu.

Playwright MCP ít hơn một chút, nhưng có thể coi là **gần như tương đương**.

Có thể sẽ có sự khác biệt nếu cho thực hiện thao tác phức tạp hơn, nhưng với việc check như này (check cuối cùng khi phát triển chức năng nhỏ) thì có thể coi là **dùng cái nào cũng không khác biệt nhiều**.

Thực tế, nếu dùng Chrome DevTools thì cũng có thể phân tích performance, nên tôi nghĩ **nên dùng Chrome DevTools MCP làm chính**.

### Tiêu chí phân chia sử dụng

Dựa trên nội dung đến đây, hãy xem xét cách phân chia sử dụng thực tế.

#### Trường hợp phù hợp với Chrome DevTools MCP

Trước tiên, Chrome DevTools MCP giỏi phân tích performance chi tiết.

Ví dụ có thể phân tích chi tiết các chỉ số Web Vitals.

- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

Những chỉ số này cũng quan trọng cho SEO, nên khi coi trọng tối ưu performance thì Chrome DevTools MCP là tối ưu.

Và trong Chrome thì có thể emulation chi tiết hơn Playwright MCP.

Ví dụ có thể cài đặt chi tiết hạn chế tốc độ CPU và network.

Do đó, trong phát triển frontend mức thực tế, **dùng Chrome DevTools MCP làm chính** sẽ hiệu quả.

#### Trường hợp cần Playwright MCP

Mặt khác, điểm mạnh lớn nhất của Playwright MCP là hỗ trợ cross-browser.

Không chỉ Chrome mà còn có thể kiểm tra hoạt động trên Firefox và Safari (WebKit).

Tôi cũng đã trải qua trong phát triển cá nhân, CSS flexbox chỉ bị vỡ trên Safari.

Lúc này Chrome DevTools MCP không thể phát hiện.

Do đó, **khi cần kiểm tra hoạt động trên browser khác thì cần dùng Playwright MCP**.

Phát triển cá nhân thường không quan tâm đến browser, nhưng công việc client thường bắt buộc.
(Đặc biệt, hệ thống doanh nghiệp cung cấp đôi khi vẫn cần hỗ trợ IE...)

Đặc biệt khi dùng chức năng CSS hiện đại, dễ xuất hiện sự khác biệt giữa các browser nên cần chú ý.
Khuyến nghị phân chia sử dụng cả hai.

## Câu hỏi thường gặp và trả lời

Ở đây tôi sẽ trả lời các câu hỏi dự kiến về Chrome DevTools MCP.

### Q: Có thể kế thừa tab Chrome đã mở? Đăng nhập thì sao?

**A: Tiếc là không dùng được. Nhưng không sao.**

Chrome DevTools MCP khởi động Chrome instance mới ở chế độ debug.

Đây là profile khác với browser hiện có.

Vậy với site cần đăng nhập thì làm sao?

Chỉ cần chỉ thị AI thực hiện login flow sau khi khởi động là OK.

Các bước cụ thể:
1. Mở site
2. Chuyển đến trang login
3. Nhập email và password
4. Click nút login
5. Kiểm tra hoạt động ở dashboard

Chuỗi hoạt động này có thể thực hiện **chỉ bằng một lần chỉ thị cho AI**.

Tôi thường viết thủ tục login vào `CLAUDE.md` hay `AGENTS.md` và thực hiện giống nhau mỗi lần.

```
# Thủ tục login
Trong môi trường development đã tạo account kiểm tra, hãy login theo thủ tục sau.

1. Mở https://example.com/login
2. Nhập email "hoge@example.com"
3. Nhập password "P@sSw0rd!"
4. Click nút "ログイン"
5. Thành công nếu hiển thị dashboard
```

Tuy nhiên, **trường hợp cần xác thực 2 bước (2FA) thì phải xử lý thủ công**.

### Q: Browser nào được hỗ trợ?

**A: Mỗi MCP hỗ trợ browser khác nhau.**

#### Chrome DevTools MCP
- **Chỉ Chrome**
- Hỗ trợ từ phiên bản mới nhất đến vài phiên bản trước
- Browser base Chromium (Edge v.v.) là không chính thức

#### Playwright MCP
- **Chrome**: Hỗ trợ đầy đủ
- **Firefox**: Hỗ trợ đầy đủ
- **Safari**: Hỗ trợ phiên bản WebKit
- **Edge**: Hỗ trợ đầy đủ

### Q: Có thể dùng trong môi trường development local?

**A: Tất nhiên là được**

Có thể truy cập trực tiếp local server như localhost:3000, localhost:8080.

Ví dụ như thế này.

**Khi phát triển Next.js**
```
Mở localhost:3000,
kiểm tra hiển thị sau hot reload
```

**Khi phát triển Vite**
```
Kiểm tra kết quả build localhost:5173, đo performance hiển thị ban đầu
```

## Kết luận

Thế nào?

Chrome DevTools MCP là công cụ tự động hóa browser mạnh mẽ do Google chính thức cung cấp.

Đặc biệt trong phát triển frontend mức thực tế, rất hữu ích khi cần phân tích performance và debug chi tiết.

Và phát triển thường thì Chrome DevTools MCP đã đủ, Playwright MCP chỉ dùng khi cần test cross-browser sẽ hiệu quả.

Cài đặt cũng đơn giản, **hãy triển khai ngay và giải thoát khỏi công việc kiểm tra phiền phức**.

## Bài viết liên quan về Claude Code

Tôi cũng viết các bài khác về Claude Code và AI-driven development, mời xem nếu có thời gian.

- [Claude Code vs Codex CLI どっちを選ぶ？両方使ってきた経験から観点別にポイントを解説](https://qiita.com/tomada/items/c369d5f28142a2599a36)
- [SuperClaude とは？Claude Codeのコード品質を30%改善できた神ツールの完全ガイド！](https://qiita.com/tomada/items/2eb1b0623c9f59424235)
- [Claude Code・Codex CLI の機能比較！カスタムコマンドやサブエージェント、Output Stylesまで徹底解説](https://qiita.com/tomada/items/1b7afa4673a9a00c12c0)

## Chút quảng cáo: Tôi đang tạo khóa học Udemy về Claude Code và Codex

Chủ yếu mở khóa học Udemy về AI-driven development, may mắn được **nhiều bestseller**.

Trên site cá nhân cũng phân phối **coupon học với giá thấp nhất** (giảm tối đa 90%), mời ghé thăm nếu có thời gian.

Ý kiến và yêu cầu khóa học mới cũng rất hoan nghênh!

---

**Nguồn:** [Qiita](https://qiita.com/tomada/items/8b22cac69b5247df1c20)
