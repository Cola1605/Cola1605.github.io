---
title: "Chuẩn bị chuyển đổi từ Amazon Q Developer IDE Plugin sang Kiro"
date: 2025-11-20
draft: false
categories:
  - "AWS"
  - "Business & Technology"
  - "Development"
tags:
  - "Amazon Q Developer"
  - "Migration"
  - "AI Coding"
author: "Sugawara"
translator: "日平"
description: "Hướng dẫn chi tiết về việc chuyển đổi từ Amazon Q Developer IDE Plugin sang Kiro IDE, bao gồm các tính năng mới và quy trình di chuyển."
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/kiroweeeeeeek-in-japan-day-2-q-dev-ide-to-kiro/)

---

Xin chào! Tôi là Sugawara, Solution Architect tại AWS.

Bài viết này là ngày thứ 2 của chuỗi **Kiroweeeeeeek** (X: #kiroweeeeeeek). Bài viết hôm qua là của Inariku với nội dung "Hướng dẫn giới thiệu Kiro: Tất cả những điều cần biết trước khi bắt đầu".

Trong bài viết này, tôi sẽ chia sẻ về những điểm cải tiến trong Kiro và phương pháp chuyển đổi dành cho những ai đã từng sử dụng Amazon Q Developer IDE Plugin. Để có thông tin tổng quan về việc phát hành rộng rãi Kiro, vui lòng đọc bài viết "Kiro bắt đầu phát hành rộng rãi: Phát triển cùng đội ngũ trên IDE và Terminal".

## Tổng quan về Amazon Q Developer IDE Plugin và Kiro

Amazon Q Developer IDE Plugin là một agent lập trình AI tạo sinh được cung cấp dưới dạng tiện ích mở rộng của IDE, ra mắt vào năm 2023. Nó được nhiều khách hàng sử dụng như một agent lập trình có thể hoạt động trên mọi hệ điều hành. Sau khi được cung cấp dưới dạng tiện ích mở rộng cho Visual Studio Code, nó đã dần hỗ trợ nhiều trình biên tập mã khác nhau.

Kiro, vừa được phát hành rộng rãi lần này, được xây dựng trên nền tảng mã nguồn mở của Visual Studio Code. Bản thân nó được cung cấp như một IDE và được tối ưu hóa để thực hiện phương pháp phát triển gọi là **Phát triển dựa trên đặc tả (Spec-driven Development)**. Với Kiro, các nhà phát triển có thể chuyển đổi từ nguyên mẫu sang môi trường sản xuất thông qua việc phát triển sử dụng AI. Khác với Amazon Q Developer IDE Plugin, Kiro là một IDE độc lập chứ không phải là một tiện ích mở rộng.

## Chuyển đổi từ Visual Studio Code

Nhiều người có thể đã cài đặt và sử dụng Amazon Q Developer IDE Plugin trên Visual Studio Code. Kiro mang đến trải nghiệm chuyển đổi mượt mà cho những khách hàng như vậy. Kiro lựa chọn các bản phát hành chú trọng đến sự ổn định, đồng bộ với chu kỳ phát triển của Visual Studio Code.

Việc chuyển đổi từ Visual Studio Code sang Kiro rất trơn tru nhờ vào nền tảng mã nguồn mở chung. Kiro cung cấp môi trường phát triển được tăng cường các tính năng AI trong khi vẫn giữ nguyên giao diện quen thuộc của Visual Studio Code. Tính năng chuyển đổi hồ sơ (profile) cho phép bạn di chuyển nguyên vẹn môi trường Visual Studio Code hiện có, bao gồm các tiện ích mở rộng, chủ đề, cài đặt và phím tắt. Tính năng xuất/nhập hồ sơ thủ công cũng giúp việc di chuyển cài đặt giữa các máy trở nên dễ dàng.

Để biết chi tiết về quy trình chuyển đổi và cách sử dụng cụ thể của từng tính năng, vui lòng tham khảo "Migrating from VSCode". Chương này được dịch và trích dẫn từ chương tương ứng.

### Chuyển đổi hồ sơ (Profile Migration)

Sử dụng tính năng xuất/nhập hồ sơ gốc của Visual Studio Code để chuyển đổi giữa các máy hoặc kiểm soát chi tiết các cài đặt.

**Xuất hồ sơ từ Visual Studio Code:**

1. Khởi động **Command Palette** trong Visual Studio Code (`Cmd` / `Ctrl` + `Shift` + `P`).
2. Nhập và chọn "Preferences: Open Profiles (UI)" trong Command Palette.
3. Tìm hồ sơ mong muốn ở thanh bên (sidebar).
4. Truy cập menu 3 chấm và chọn **Export**.
5. Lưu cục bộ hoặc công khai lên GitHub Gist.

**Nhập hồ sơ vào Kiro:**

1. Truy cập **Command Palette** của Kiro (`Cmd` / `Ctrl` + `Shift` + `P`).
2. Nhập và chọn "Preferences: Open Profiles (UI)" trong Command Palette.
3. Mở menu thả xuống bên cạnh **New Profile** và chọn **Import Profile**.
4. Cung cấp URL GitHub Gist hoặc tham chiếu đến tệp xuất cục bộ.
5. Chọn **Import** để lưu cài đặt và xác nhận.
6. Chọn hồ sơ ở thanh bên và chọn dấu tích để kích hoạt hồ sơ.

**Hồ sơ được nhập bao gồm:**

- Chủ đề màu sắc và cài đặt giao diện người dùng (UI)
- Cài đặt trình biên tập và không gian làm việc
- Phím tắt tùy chỉnh và gán phím (keybindings)

### Khả năng tương thích tiện ích mở rộng

Kiro sử dụng sổ đăng ký tiện ích mở rộng OpenVSX và đảm bảo khả năng tương thích với các tiện ích mở rộng mã nguồn mở. Các tiện ích mở rộng có sẵn trên OpenVSX được chuyển đổi liền mạch và nhiều tiện ích trong số đó có được các chức năng nâng cao nhờ tích hợp AI của Kiro:

- **Tiện ích mở rộng ngôn ngữ**: Giữ nguyên đầy đủ chức năng của các tiện ích mở rộng có sẵn trên OpenVSX.
- **Tiện ích mở rộng chủ đề**: Tương thích trực quan hoàn toàn với các chủ đề OpenVSX.
- **Tiện ích mở rộng gỡ lỗi**: Quy trình gỡ lỗi không gián đoạn với các tiện ích mở rộng tương thích.
- **Tiện ích mở rộng Git**: Được tăng cường với khả năng tạo commit thông minh và đánh giá mã tự động.

## Chuyển đổi từng tính năng

Kiro giúp bạn sử dụng các tính năng đã từng dùng trên Amazon Q Developer IDE Plugin một cách thuận tiện hơn. Chương này sẽ hướng dẫn cách sử dụng các tính năng quen thuộc khi chuyển sang Kiro.

### Các mô hình khả dụng

Kiro hỗ trợ các mô hình mới nhất giống như Amazon Q Developer IDE Plugin hiện tại. Ngoài Claude Sonnet 4.0, bạn còn có thể sử dụng Claude Sonnet 4.5 tiên tiến hơn.

Đặc điểm lớn nhất của Kiro là chế độ "Auto" - bộ định tuyến mô hình thông minh. Chế độ này kết hợp nhiều mô hình tiên tiến và sử dụng các kỹ thuật tối ưu hóa cao cấp để tự động chọn mô hình tốt nhất cho từng tác vụ. Nhà phát triển không cần phải chuyển đổi mô hình thủ công tùy theo loại tác vụ, mà luôn được hưởng sự cân bằng tối ưu giữa hiệu suất và chi phí. Điều này cho phép tận dụng giới hạn sử dụng hiệu quả hơn và thực hiện nhiều công việc hơn trong cùng một gói.

### Rules trở thành Steering tiện lợi hơn

Nếu đã sử dụng Amazon Q Developer IDE Plugin, bạn có thể biết đến tính năng Rules. Đây là tính năng định nghĩa các quy ước lập trình hoặc thực tiễn tốt nhất (best practices) của nhóm trong tệp markdown, và AI sẽ tự động sử dụng chúng làm ngữ cảnh. Trong Kiro, khái niệm này được phát triển thêm thành tính năng gọi là **Steering**. Để biết thêm chi tiết về Steering, vui lòng xem "Cách dạy kỹ năng mới cho Kiro bằng Agent Steering và MCP".

Các tệp Steering được đặt trong thư mục `.kiro/steering/` và định nghĩa các tiêu chuẩn phát triển cho toàn bộ dự án. Giống như Rules của Amazon Q Developer IDE Plugin, bạn có thể mô tả quy ước lập trình, yêu cầu kiểm thử, giao thức bảo mật, quy tắc tài liệu, nhưng Steering của Kiro cho phép kiểm soát linh hoạt hơn. Ví dụ, bằng cách chỉ định `inclusion: fileMatch` và `fileMatchPattern` trong phần front matter, bạn có thể áp dụng quy tắc chỉ khi khớp với mẫu tệp cụ thể. Ví dụ dưới đây mô tả nội dung chỉ áp dụng cho các tệp tsx trong thư mục `components`.

```yaml
---
inclusion: fileMatch
fileMatchPattern: "components/**/*.tsx"
---
```

Trong Amazon Q Developer IDE Plugin, bạn có thể phải tạo Rules từ đầu khi chỉnh sửa dự án hiện có. Với Kiro, khi mở dự án, bạn có thể sử dụng tính năng "Generate Steering Docs" để tự động phân tích mục đích sản phẩm, ngăn xếp công nghệ (tech stack), cấu trúc dự án, v.v., và tạo tài liệu Steering ban đầu.

![Tính năng "Generate Steering Docs" sử dụng để tạo quy tắc từ kho lưu trữ hiện có](/images/aws_kiro_week_day2/steering_docs.png)

### MCP vẫn tiếp tục được sử dụng

Đối với những người đang sử dụng Model Context Protocol (MCP) trên Amazon Q Developer IDE Plugin, có một tin vui. Kiro cũng hỗ trợ hoàn toàn MCP và bạn có thể tận dụng nguyên vẹn các cài đặt máy chủ MCP hiện có. Về tính năng MCP của Kiro, vui lòng xem "Kiro: Giới thiệu máy chủ MCP từ xa".

Khi chuyển từ Amazon Q Developer IDE Plugin, bạn có thể bắt đầu sử dụng ngay bằng cách sao chép cài đặt MCP hiện có vào tệp cấu hình của Kiro. Các máy chủ MCP đã sử dụng trong Amazon Q Developer IDE Plugin như GitLab hay các dịch vụ AWS sẽ hoạt động tương tự trên Kiro.

![Tab máy chủ MCP chuyên dụng](/images/aws_kiro_week_day2/mcp_tab.png)

### Context và phân tích hình ảnh vẫn giữ nguyên sự tiện lợi

Các tính năng tiện lợi quen thuộc trên Amazon Q Developer IDE Plugin vẫn có thể sử dụng trên Kiro. Đặc biệt, tính năng quản lý ngữ cảnh và phân tích hình ảnh là những công cụ không thể thiếu trong công việc phát triển hàng ngày.

Bằng cách sử dụng `#File` hoặc `#Folder` trong cuộc trò chuyện, bạn có thể thêm các tệp hoặc thư mục cụ thể làm ngữ cảnh. Ngoài ra, sử dụng `#Problems` để đưa các vấn đề của tệp hiện tại, `#Terminal` cho đầu ra của terminal, và `#Git Diff` cho sự khác biệt Git vào ngữ cảnh. Hơn nữa, nếu sử dụng `#Codebase`, bạn có thể tìm kiếm trên toàn bộ cơ sở mã đã được lập chỉ mục. Bạn có thể sử dụng nội dung phát triển hơn so với việc chỉ định ngữ cảnh bằng `@` trong Amazon Q Developer IDE Plugin trước đây.

Tính năng phân tích hình ảnh cũng có thể được sử dụng tương tự như Amazon Q Developer IDE Plugin. Bằng cách kéo và thả bản mô phỏng thiết kế Figma hoặc ảnh chụp màn hình giao diện người dùng (UI) vào cuộc trò chuyện, Kiro sẽ phân tích và tạo mã tương ứng. Việc chuyển đổi từ thiết kế sang triển khai trở nên mượt mà hơn và việc hợp tác với nhà thiết kế cũng hiệu quả hơn.

### Tính năng quét bảo mật mã

Amazon Q Developer IDE Plugin có tính năng đánh giá các lỗ hổng bảo mật và vấn đề chất lượng mã. Tính đến ngày 20 tháng 11 năm 2025, tính năng đánh giá chưa được triển khai trên Kiro. Để thực hiện đánh giá tự động, vui lòng cân nhắc tính năng đánh giá mã bởi **Amazon Inspector Code Security**. Những ai muốn thực hiện đánh giá bảo mật trên trình biên tập có thể tiếp tục sử dụng Amazon Q Developer IDE Plugin.

## Quyền riêng tư và Bảo mật

Phần này dựa trên thông tin tại thời điểm viết bài (20/11/2025). Vui lòng kiểm tra tài liệu chính thức để có thông tin mới nhất. Ngoài ra, chi tiết tổng thể không chỉ giới hạn ở Kiro IDE sẽ được tổng hợp sau Day 3.

### Cải thiện dịch vụ

Trong gói Pro của Amazon Q Developer IDE Plugin, AWS không thu thập dữ liệu người dùng để cải thiện dịch vụ. Ngoài ra, ngay cả trong gói Free, bạn cũng có thể chọn không tham gia (opt-out) việc thu thập dữ liệu bằng cách cài đặt. Chi tiết vui lòng đọc "Cải thiện dịch vụ Amazon Q Developer".

Trong Kiro, nội dung từ người dùng Kiro for enterprise sẽ không được sử dụng. Nội dung từ người dùng gói Free hoặc hợp đồng cá nhân có thể được loại trừ khỏi việc thu thập dữ liệu bằng cách chọn không tham gia. Chi tiết vui lòng đọc "Service improvement".

### Tham chiếu mã (Code References)

Amazon Q Developer IDE Plugin có tính năng hiển thị tham chiếu đến các đề xuất mã tương tự với mã công khai khi đầu ra giống với mã nguồn mở hiện có. Ngoài ra, quản trị viên có thể thực hiện opt-out để ngăn chặn các đề xuất mã nguồn chứa tham chiếu này. Chi tiết vui lòng đọc "Sử dụng tham chiếu mã".

Kiro cũng được trang bị tính năng hiển thị tham chiếu mã tương tự. Hơn nữa, quản trị viên Kiro for enterprise có thể thực hiện cài đặt opt-out cho tất cả người dùng trong tổ chức. Điều này được kiểm soát bởi quản trị viên và người dùng không thể thay đổi. Chi tiết vui lòng đọc "Code references".

## Các tính năng mới của Kiro

Kế thừa các tính năng của Amazon Q Developer IDE Plugin, Kiro mang đến trải nghiệm phát triển tiến thêm một bước. Dưới đây là các tính năng độc đáo của Kiro IDE mà Amazon Q Developer IDE Plugin không có.

### Trang bị chế độ Đặc tả (Spec Mode)

Đặc điểm lớn nhất của Kiro là lần đầu tiên đưa **Phát triển dựa trên đặc tả (Spec-driven Development)** vào công cụ lập trình AI. Các trợ lý lập trình AI truyền thống sẽ tạo mã ngay lập tức khi nhập lời nhắc (prompt), nhưng không rõ liệu mã đó có thực sự đáp ứng yêu cầu hay không và những quyết định thiết kế nào đã được đưa ra.

Tính năng Spec của Kiro giải quyết vấn đề này. Từ một lời nhắc duy nhất, nó thực hiện quy trình phát triển có cấu trúc qua 3 giai đoạn: Yêu cầu (Requirements), Thiết kế (Design) và Tác vụ (Tasks). Trong giai đoạn yêu cầu, các tiêu chí chấp nhận sử dụng ký pháp EARS được tạo ra; trong giai đoạn thiết kế, sơ đồ luồng dữ liệu và đặc tả API được tài liệu hóa. Và ở giai đoạn tác vụ cuối cùng, các tác vụ được chia thành các đơn vị có thể thực hiện và được tạo ra để thực thi từng cái một.

Cách tiếp cận có cấu trúc này đặc biệt phát huy sức mạnh trong việc chuyển đổi từ nguyên mẫu sang môi trường sản xuất. Vì tài liệu đặc tả được cập nhật đồng bộ với việc triển khai, nên không lo tài liệu bị lỗi thời. Chi tiết được giải thích trong bài viết "Từ trò chuyện đến đặc tả: Tìm hiểu sâu về phát triển hỗ trợ bởi AI với Kiro".

### Tự động hóa với Agent Hooks

Một tính năng đột phá khác là **Agent Hooks**. Đây là tính năng mà agent AI tự động thực hiện các tác vụ với sự kiện kích hoạt là lưu, tạo hoặc xóa tệp. Ví dụ: khi tài liệu tiếng Nhật được lưu hoặc cập nhật, nó có thể cập nhật tài liệu tiếng Anh, cho phép thực hiện các tác vụ linh hoạt sử dụng LLM.

Hooks được lưu trong thư mục `.kiro/hooks/` và có thể chia sẻ với toàn nhóm bằng cách commit lên Git. Nhờ đó, quy ước lập trình và kiểm tra bảo mật được áp dụng tự động cho tất cả thành viên, giữ cho chất lượng mã đồng nhất. Các kiểm tra chất lượng và cập nhật tài liệu mà trước đây phải làm thủ công trên Amazon Q Developer IDE Plugin nay được tự động hóa trên Kiro, giúp nhà phát triển tập trung vào việc giải quyết các vấn đề cốt lõi. Chi tiết vui lòng xem "Tự động hóa quy trình phát triển với Kiro AI Agent Hooks".

## Tóm tắt

Kể từ khi công bố bản xem trước, Kiro đã được nhiều khách hàng yêu thích. AWS dự định sẽ tiếp tục tập trung đầu tư phát triển cho Kiro. Những ai đang sử dụng Amazon Q Developer IDE Plugin cũng hãy tải xuống Kiro và bắt đầu từ chế độ Vibe. Chắc chắn bạn sẽ ngạc nhiên với sự dễ sử dụng quen thuộc cùng các tính năng đã được cải tiến.

Hãy tải xuống Kiro và tham khảo tài liệu tại https://kiro.dev/. Trước tiên hãy cài đặt và dùng thử nhé!
