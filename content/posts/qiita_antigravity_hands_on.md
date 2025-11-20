---
title: "Trải nghiệm Antigravity - Trình soạn thảo AI của Google: Từ chỉ thị đến triển khai và kiểm tra"
date: 2025-11-19
draft: false
categories:
  - "AI"
  - "Development Tools"
tags:
  - "Gemini"
  - "AI Agent"
  - "Antigravity"
  - "Google"
author: "Yokko"
translator: "日平"
description: "Trải nghiệm thực tế với Antigravity, trình soạn thảo AI mới của Google, từ việc đưa ra chỉ thị, triển khai đến kiểm tra hoạt động, bao gồm cả demo sửa UI bằng tiện ích mở rộng Chrome."
---

**Nguồn:** [Qiita](https://qiita.com/yokko_mystery/items/bb5615ebcd385a597c41)

---

## Giới thiệu

Google đã công bố trình soạn thảo AI "**Antigravity**" vào ngày 18/11/2025 (giờ Mỹ). Tôi đã thử sử dụng nó để phát triển một "ứng dụng chat AI" thực tế.

Bài viết này tổng hợp ngắn gọn trải nghiệm của tôi, bao gồm cả việc sử dụng tiện ích mở rộng **Antigravity Browser Extension**.

### Video demo sửa UI bằng tiện ích mở rộng Chrome

[Demo video sẽ được nhúng tại đây]

## Antigravity là gì?

**Antigravity** là nền tảng phát triển ưu tiên AI Agent (Agent-First) mà Google công bố vào ngày 18/11/2025 (giờ Mỹ).

### Đặc điểm chính

**Trải nghiệm phát triển ưu tiên Agent**: Khi nhà phát triển đưa ra "chỉ thị" cấp cao, AI Agent sẽ tự động lập kế hoạch, viết mã, thực thi và xác minh hoạt động. Đặc điểm nổi bật là khả năng thực hiện tác vụ xuyên suốt trình soạn thảo, terminal và trình duyệt.

**Manager View và Editor View**: Có thể chuyển đổi giữa "Manager View" để quản lý nhiều workspace và nhiều agent, và "Editor View" như màn hình phát triển thông thường.

**Trực quan hóa công việc**: Tự động tạo ra "danh sách tác vụ", "kế hoạch triển khai", "ảnh chụp màn hình/video ghi hình (Artifacts)" như sản phẩm đầu ra, giúp trực quan hóa công việc của agent. Ghi lại lịch sử công việc và ảnh chụp màn hình từng bước, tổng hợp kết quả công việc một cách gọn gàng.

Chi tiết xem tại "[Antigravity](https://antigravity.dev)".

## Thực hành

### 1. Cài đặt/Khởi động

Antigravity có thể tải xuống từ [trang web chính thức](https://antigravity.dev). Sau khi thiết lập các cấu hình và khởi động, giao diện trông quen thuộc vì nó là một fork của VSCode.

**Model** có thể chọn từ các tùy chọn sau. Tất nhiên, Gemini 3 cũng có sẵn.

Trong **Conversation Mode**, có thể chuyển đổi giữa 2 chế độ sau:

- **Planning**: Dành cho tác vụ phức tạp, nghiên cứu, hoặc cộng tác. Lập kế hoạch trước khi thực thi.
- **Fast**: Dành cho tác vụ đơn giản. Thực thi trực tiếp và hoàn thành nhanh chóng.

### 2. Khởi động "Agent Manager" từ "Open Agent Manager"

Antigravity có "Agent Manager" cho phép quản lý tập trung nhiều agent và nhiều workspace.

Từ đây có thể bắt đầu dự án mới hoặc xem danh sách trạng thái tác vụ của các workspace khác.

### 3. Nhập chỉ thị

Tôi chỉ nhập một câu duy nhất cho agent:

**"Tạo một ứng dụng chat có thể trò chuyện với AI Hamster."**

Agent đã thực hiện các bước sau:

- Khởi tạo dự án
- Tạo cấu hình Next.js + Tailwind CSS
- Tạo layout màn hình
- Xây dựng component Chat UI
- Tạo logic chat đơn giản qua API Route
- Khởi động server phát triển cục bộ

Ngoài ra, bên trái có thể xem theo thời gian thực **"nội dung agent đang thực thi"**, và bên phải trong **Task panel** hiển thị **phân tách tác vụ** mà agent tự động tạo ra dưới dạng checklist.

Có thể thấy ngay đang thực hiện công đoạn nào.

### 4. Sau khi triển khai hoàn tất, ứng dụng khởi động trên Chrome

Lúc này tôi đã cài đặt tiện ích mở rộng Chrome **Antigravity Browser Extension**.

Về phản hồi trực quan và các trường hợp sử dụng, vui lòng tham khảo trang chính thức sau:
[Why frontend developers choose Google Antigravity](https://antigravity.dev/frontend)

Khi thử chat thực tế, phản hồi được trả về đúng cách.

### 5. Nhập chỉ thị bổ sung

**"Đổi tên nhân vật AI thành Ham-jiro. Ghi lại quá trình bằng screenshot."**

Ứng dụng khởi động trên Chrome và có thể xem theo thời gian thực quá trình sửa đổi.

Ngoài ra, khi thấy hiển thị "Playback available", tôi nhấp vào "View" và có thể xem ở bên phải quá trình test thực tế mà AI đang thực hiện.

Sau khi triển khai bổ sung hoàn tất, Walkthrough được tạo ra và lưu cả ảnh chụp như đã chỉ thị.

### 6. Yêu cầu sửa UI từ Artifact

**Cập nhật 2025/11/19 19:58**

Các Artifact đã tạo có thể hiển thị dạng danh sách ở bên phải màn hình.

Nếu có phần UI muốn sửa, chọn ảnh chụp màn hình của Artifact đó, kéo chọn phần muốn thay đổi và comment, yêu cầu sẽ được phản ánh. (Thật ngạc nhiên!)

#### ① Kéo chọn phần muốn thay đổi

#### ② Comment nội dung muốn thay đổi

Comment về vị trí hiển thị emoji

Cũng muốn đổi màu bong bóng chat nên comment

#### ③ Triển khai đúng theo nội dung comment!

**Cập nhật 2025/11/19 23:50**

Phương pháp kéo chọn để sửa UI cũng có thể sử dụng cho một hình ảnh đơn lẻ đã tạo, và sửa rất đẹp.

Chọn phần cupcake, nhập comment và yêu cầu sửa đổi

### 7. Về nơi lưu Task và Walkthrough

Trong Antigravity, các tác vụ mà agent thực hiện và Walkthrough được tạo ra sẽ tự động lưu trong thư mục ẩn `.gemini` dưới thư mục home của người dùng.

Cụ thể, tôi đã xác nhận được lưu tại đường dẫn sau:

**Vị trí lưu**: `~/.gemini/antigravity/brain/<session_id>/`

- `task.md`: Danh sách tác vụ và tiến độ
- `walkthrough.md`: Ghi chép công việc (bao gồm link đến screenshot và video)
- `implementation_plan.md`: Tài liệu kế hoạch triển khai

Các tệp này được lưu dưới định dạng Markdown nên có thể xem như văn bản ngay cả ngoài trình soạn thảo, hoặc quản lý bằng Git.

Các ảnh chụp nằm tại `~/.gemini/antigravity/browser_recordings/<session_id>/`.

Tất nhiên, cũng có thể xem và quản lý chúng một cách trực quan từ **Task panel** hoặc **Agent Manager** trên Antigravity.

## Nhận xét và điểm tốt

**Trực quan hóa tác vụ mượt mà**: Tiến độ của agent rõ ràng ngay từ cái nhìn đầu tiên. Task panel hiển thị phân tách tác vụ theo thời gian thực, rõ ràng đang thực hiện công đoạn nào.

**Quy trình làm việc tự động hóa**: Các công đoạn thường phức tạp khi làm thủ công như thao tác trình duyệt, chụp ảnh màn hình, tạo Walkthrough được hỗ trợ. Agent tự động thực hiện cả test và xác minh.

**Lưu lịch sử công việc**: Task và Walkthrough tự động được lưu và có thể xem lại sau. Có thể quản lý tập trung nhiều dự án và workspace qua Agent Manager.

**Hoàn thành bằng chỉ thị đơn giản**: Chỉ với một câu chỉ thị, từ khởi tạo dự án đến khởi động server phát triển đều tự động thực hiện. Chỉ cần truyền đạt điều muốn làm mà không cần quan tâm chi tiết kỹ thuật.

## Kết luận

Tôi cảm thấy việc xác nhận AI Agent đang làm gì đã trở nên dễ hiểu hơn rất nhiều.

Việc phân tách tác vụ và trạng thái tiến độ được phản ánh theo thời gian thực thật thú vị khi theo dõi.

Trong phát triển frontend, các công đoạn quan trọng về phản hồi trực quan như thao tác trình duyệt và chụp ảnh màn hình được tự động hóa, nên tôi cảm thấy có khả năng cải thiện hiệu suất phát triển.

Vẫn còn nhiều tính năng chưa sử dụng hết, nên tôi sẽ tiếp tục dùng thử và so sánh với Cursor mà tôi đang dùng hàng ngày.

Mọi người cũng hãy thử **Antigravity** một lần và kiểm chứng xem nó phù hợp với quy trình phát triển của bạn như thế nào.

## Tài liệu tham khảo

- [Antigravity - Trang web chính thức](https://antigravity.dev) - Nền tảng phát triển ưu tiên AI Agent của Google
- [Why frontend developers choose Google Antigravity](https://antigravity.dev/frontend) - Các trường hợp sử dụng cho nhà phát triển frontend
- [A new era of intelligence with Gemini 3 – Google Blog](https://blog.google/technology/ai/gemini-3-announcement/) - Công bố Gemini 3 và giới thiệu Antigravity
- [Google Antigravity introduces agent-first architecture for asynchronous, verifiable coding workflows – VentureBeat](https://venturebeat.com/ai/google-antigravity-agent-first-architecture/) - Giải thích về kiến trúc của Antigravity
- [Antigravity Is Google's New Agentic Development Platform – The New Stack](https://thenewstack.io/antigravity-google-agentic-development-platform/) - Chi tiết về Antigravity như một nền tảng
