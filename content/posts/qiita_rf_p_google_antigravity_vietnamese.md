---
title: "IDE Phát Triển Từ VSCode 'Google Antigravity' Đang Mở Ra Mô Hình Mới Cho Phát Triển Được Dẫn Dắt Bởi AI"
date: 2025-11-19
draft: false
categories: ["AI and Machine Learning", "Development"]
tags: ["Gemini", "AI-driven development", "Antigravity", "VSCode", "Google"]
description: "Khám phá Google Antigravity - IDE mới từ Google với 4 trụ cột: Tin cậy, Tự chủ, Phản hồi và Tự cải thiện. Trải nghiệm phát triển ứng dụng TODO với agent đa nhiệm và UI review tích hợp."
---

**Tác giả**: @rf_p (ryu fukuda)  
**Ngày đăng**: 2025-11-19  
**Nguồn**: https://qiita.com/rf_p/items/60be12914338447543d3

> **📷 Lưu ý về Hình ảnh**: Do hạn chế bảo mật từ Qiita, các hình ảnh trong bài viết này không hiển thị trực tiếp. Vui lòng xem hình ảnh đầy đủ trên [bài viết gốc tại Qiita](https://qiita.com/rf_p/items/60be12914338447543d3).

## Giới thiệu

Hôm nay 2025/11/19, Google đã công bố Gemini 3.0 đồng thời với việc ra mắt một IDE có tên là "Google Antigravity".

https://antigravity.google

Giống như Cursor hay Kiro, đây là một IDE được phát triển dựa trên nền tảng VSCode. Và đúng như phong cách của Google, đây là một IDE cung cấp trải nghiệm phát triển khác biệt so với các công cụ phát triển được dẫn dắt bởi AI hiện tại. Trong bài viết này, tôi sẽ trích dẫn blog chính thức và chia sẻ cảm nhận thực tế khi sử dụng.

## Đặc điểm

Trước tiên, hãy đọc blog chính thức của Google Antigravity.

https://antigravity.google/blog/introducing-google-antigravity

> Antigravity đang tiến hóa IDE hướng tới tương lai ưu tiên agent, với các tính năng điều khiển trình duyệt, mô hình tương tác bất đồng bộ, và form factor sản phẩm ưu tiên agent, cho phép agent tự động lập kế hoạch và thực hiện các tác vụ phần mềm phức tạp từ đầu đến cuối.

### 4 trụ cột

Antigravity được xây dựng dựa trên 4 trụ cột sau:

- **Tin cậy (Trust)**
- **Tự chủ (Autonomy)**
- **Phản hồi (Feedback)**
- **Tự cải thiện (Self-improvement)**

### 1. Tin cậy (Trust)

> Hầu hết các sản phẩm hiện nay đều rơi vào một trong hai cực: hoặc hiển thị mọi hành động và lời gọi công cụ mà agent thực hiện cho người dùng, hoặc chỉ hiển thị thay đổi mã cuối cùng mà không cung cấp ngữ cảnh về cách agent đến được đó và phương pháp xác minh hoạt động. Trong cả hai trường hợp, người dùng không thể tin tưởng vào những gì agent đã thực hiện. Antigravity cung cấp ngữ cảnh về hoạt động của agent ở mức trừu tượng tác vụ tự nhiên hơn, cung cấp các artifact và kết quả xác minh cần thiết và đủ để người dùng có thể tin tưởng. Chúng tôi tập trung vào việc agent không chỉ thực hiện hành động mà còn suy nghĩ kỹ lưỡng về việc xác minh hành động đó.

> Trong cuộc hội thoại với agent của Antigravity, người dùng có thể xem các lời gọi công cụ được nhóm trong các tác vụ và giám sát tổng quan cũng như tiến độ của tác vụ. Khi agent tiến hành công việc, các artifact cụ thể như danh sách tác vụ, kế hoạch triển khai, hướng dẫn chi tiết, ảnh chụp màn hình, bản ghi trình duyệt sẽ được tạo ra ở định dạng dễ xác minh hơn so với các lời gọi công cụ thô. Agent của Antigravity sử dụng các artifact để truyền đạt cho người dùng rằng họ hiểu mình đang làm gì và đang xác minh công việc một cách kỹ lưỡng.

Nói cách khác, không giống như các công cụ dòng lệnh xuất toàn bộ nhật ký, cũng không đơn giản hóa quá mức chỉ xuất sự khác biệt thay đổi, mà xuất các tác vụ, công việc, ảnh chụp màn hình theo cách dễ xác minh cho con người.

Trong video chính thức của Google, màn hình được hiển thị như sau.

![Ảnh chụp màn hình 2025-11-19 8.05.46.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_b8a0636e4771.png)

### 2. Tự chủ (Autonomy)

> Ngày nay, form factor sản phẩm trực quan nhất là hoạt động đồng bộ với agent được nhúng trong các bề mặt (editor, trình duyệt, terminal...). Do đó, "Editor View" chính của Antigravity là trải nghiệm IDE trang bị AI tiên tiến với tính năng hoàn thiện tab, lệnh inline, và agent đầy đủ chức năng trong bảng điều khiển bên.

> Tuy nhiên, với các mô hình như Gemini 3, chúng ta đang chuyển sang thời đại mà agent có thể hoạt động đồng thời và tự chủ trên tất cả các bề mặt này.

> Chúng tôi tin rằng agent cần một form factor có thể thể hiện tốt nhất tính tự chủ này và cho phép người dùng tương tác bất đồng bộ hơn. Do đó, ngoài bề mặt editor giống IDE, chúng tôi giới thiệu bề mặt quản lý ưu tiên agent. Điều này chuyển đổi mô hình từ agent được nhúng trong bề mặt sang bề mặt được nhúng trong agent. Hãy nghĩ về nó như một trung tâm điều khiển nhiệm vụ để tạo, điều phối và giám sát nhiều agent song song trên nhiều không gian làm việc.

> Thay vì nhồi nhét cả trải nghiệm quản lý bất đồng bộ và trải nghiệm editor đồng bộ vào một cửa sổ, chúng tôi đã tối ưu hóa việc chuyển giao tức thời giữa quản lý và editor. Antigravity được thiết kế hướng tới tương lai, chuyển tiếp phát triển sang thời đại bất đồng bộ một cách trực quan khi các mô hình như Gemini ngày càng thông minh hơn.

Nói cách khác, thay vì agent là một phần của giao diện người dùng, thì editor được bao gồm trong giao diện agent, và có thể chạy song song nhiều agent.

Trong video chính thức của Google, bạn có thể thấy nhiều agent được thực thi song song.

![Ảnh chụp màn hình 2025-11-19 8.08.41.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_db2d9efd3daa.png)

### 3. Phản hồi (Feedback)

> Nhược điểm cơ bản của form factor chỉ từ xa là không thể lặp lại agent một cách dễ dàng. Mặc dù trí thông minh của agent đã cải thiện đáng kể, nhưng vẫn chưa hoàn hảo. Mặc dù hữu ích nếu agent có thể hoàn thành 80% công việc, nhưng nếu không thể cung cấp phản hồi dễ dàng, công việc giải quyết 20% còn lại sẽ trở thành gánh nặng hơn là lợi ích. Phản hồi từ người dùng loại bỏ nhu cầu xử lý agent như một hệ thống trắng đen, hoàn hảo hoặc vô dụng. Antigravity bắt đầu từ hoạt động cục bộ và cho phép phản hồi người dùng bất đồng bộ trực quan trên mọi bề mặt và artifact, dù là bình luận dạng Google Docs trên artifact văn bản hay phản hồi bằng cách chọn và bình luận ảnh chụp màn hình. Phản hồi này được tự động tích hợp vào quá trình thực thi của agent mà không làm dừng tiến trình của agent.

Nói cách khác, khi con người đánh giá, dù là dựa trên mã nguồn hay ảnh chụp màn hình, giao diện người dùng/trải nghiệm người dùng trực quan cho phép thực hiện sửa đổi.

Trong video chính thức của Google, việc chọn sự khác biệt hoặc ảnh chụp màn hình và đánh giá sẽ được sửa đổi một cách trực quan được giải thích.

![Ảnh chụp màn hình 2025-11-19 8.13.52.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_ed8fdfe23887.png)

### 4. Tự cải thiện (Self-improvement)

> Antigravity xử lý việc học tập như một nguyên thủy cốt lõi, và các hành động của agent vừa truy xuất từ cơ sở kiến thức vừa đóng góp cho cơ sở kiến thức. Quản lý kiến thức này cho phép agent học hỏi từ công việc trong quá khứ. Điều này có thể là thông tin rõ ràng quan trọng như đoạn mã hữu ích hoặc kiến trúc dẫn xuất, hoặc có thể là thông tin trừu tượng hơn như chuỗi các bước đã thực hiện để hoàn thành thành công một tác vụ phụ cụ thể.

Nói cách khác, có thể gọi lại kiến thức từ các cuộc hội thoại trong quá khứ trong cuộc hội thoại mới, và tăng độ chính xác của các công việc tương tự.

Trong video chính thức của Google, bạn có thể thấy việc lập chỉ thị mới dựa trên kiến thức khi tạo bằng Three.js.

![Ảnh chụp màn hình 2025-11-19 8.16.14.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_b4af1294a53b.png)

## Trải nghiệm thực tế

### Thiết lập ban đầu

Màn hình khởi động lần đầu. Bạn có thể bắt đầu mới hoặc nhập cài đặt từ VSCode hoặc Cursor. Chọn chủ đề.

Có thể chọn 4 chế độ. Tạm thời chọn Recommend.

- Agent-driven development
- Agent-assisted development
- Review-driven development
- Custom configuration

Chọn phím tắt, tiện ích mở rộng, dòng lệnh. Cá nhân tôi, việc có thể dễ dàng chọn Vim trong màn hình thiết lập ban đầu là một điểm đáng mừng.

Đăng nhập bằng tài khoản Google để hoàn tất. Màn hình đồng ý xuất hiện. Nếu bạn không muốn được sử dụng cho việc học tập, hãy bỏ chọn.

![Ảnh chụp màn hình 2025-11-19 7.23.08.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_3975aea6789a.png)

![Ảnh chụp màn hình 2025-11-19 7.23.16.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_5744ff3202cf.png)

![Ảnh chụp màn hình 2025-11-19 7.23.26.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_5c5214e89e32.png)

![Ảnh chụp màn hình 2025-11-19 7.23.48.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_ba867fd37bd0.png)

![Ảnh chụp màn hình 2025-11-19 7.24.19.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_046b1fb717b9.png)

![Ảnh chụp màn hình 2025-11-19 7.24.35.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_9b437cf10f58.png)

![Ảnh chụp màn hình 2025-11-19 7.36.31.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_0cb9bbfefa43.png)

## Tạo ứng dụng TODO đơn giản

### Chuẩn bị kho lưu trữ

Trước tiên, tạo một kho lưu trữ trên GitHub chỉ với README.

![Ảnh chụp màn hình 2025-11-19 8.41.53.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_453f8188962f.png)

### Mở bằng Antigravity

Tải vào Antigravity, hãy thử tạo ứng dụng TODO ngay.

Nhân tiện, các mô hình có thể chọn như sau:

- Gemini 3 Pro(High)
- Gemini 3 Pro(Low)
- Claude Sonnet 4.5
- Claude Sonnet 4.5(Thinking)
- GPT-OSS 120B(Medium)

![Ảnh chụp màn hình 2025-11-19 8.43.15.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_e7d7ced7f76b.png)

Ngoài ra, chọn "Open Agent Manager" ở góc trên bên phải, hoặc Cmd+e, để chuyển đổi màn hình quản lý agent.

![Ảnh chụp màn hình 2025-11-19 8.47.55.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_ef78973f8f5a.png)

### Định nghĩa yêu cầu và thiết kế

```
Tôi muốn tạo một ứng dụng TODO đơn giản bằng React. Tôi muốn tiến hành định nghĩa yêu cầu và thiết kế, vì vậy trước tiên hãy hỏi nhiều câu hỏi.
```

![Ảnh chụp màn hình 2025-11-19 8.51.14.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_ab552a206c30.png)

Danh sách tác vụ hiện tại được hiển thị. Như giải thích ở góc dưới bên phải, bạn cũng có thể chọn một phần văn bản để đưa ra chỉ thị.

```
Vì muốn triển khai MVP, các chức năng bắt buộc chỉ cần những gì đã đề xuất. Dữ liệu hãy dùng localStorage. Ngôn ngữ là TS, framework là Next.js, phong cách là tailwind css, quản lý trạng thái là React tiêu chuẩn. Thiết kế là giao diện bắt mắt và không cần hỗ trợ chế độ tối. Đối tượng là sử dụng cá nhân.
Ngoài ra, hãy trò chuyện bằng tiếng Nhật cho tất cả danh sách tác vụ và giao tiếp.
```

### Giai đoạn triển khai

Triển khai đang tiến hành.

![Ảnh chụp màn hình 2025-11-19 8.55.50.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_c4dfc7f909ad.png)

Nhân tiện, nếu mở editor thay vì quản lý agent, danh sách tác vụ và tài liệu kế hoạch triển khai đã được tạo ra.

![Ảnh chụp màn hình 2025-11-19 9.02.07.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_438652f001c0.png)

Ví dụ, ở đây, hãy thử kéo phần muốn thay đổi. Bạn có thể bình luận, vì vậy có thể thay đổi kế hoạch.

![Ảnh chụp màn hình 2025-11-19 9.04.20.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_5eec2d765ee4.png)

Khi triển khai hoàn tất, hướng dẫn chi tiết được tổng hợp.

- Danh sách tác vụ
- Tài liệu kế hoạch triển khai
- Hướng dẫn chi tiết

được xuất ra như một bộ 3 cơ bản, trải nghiệm người dùng cực kỳ tốt...! Tôi muốn bạn trải nghiệm sự thoải mái này một lần.

![Ảnh chụp màn hình 2025-11-19 9.05.26.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_7f4328eadb0b.png)

### Giai đoạn xác nhận

Đã chạy lệnh và mở bằng trình duyệt. Ứng dụng TODO với giao diện bắt mắt theo chỉ thị đã hoàn thành!

![Ảnh chụp màn hình 2025-11-19 9.09.22.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_9d70d22afe6a.png)

Đã xác nhận nhập văn bản và hoàn thành, cũng như khôi phục từ localStorage khi làm mới màn hình, xác nhận hoạt động đầy đủ.

![Ảnh chụp màn hình 2025-11-19 9.10.20.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_585e5daccbe1.png)

Đánh giá mã cũng có thể thực hiện đánh giá từng dòng như GitHub. Trải nghiệm người dùng ở phần này cũng tuyệt vời.

![Ảnh chụp màn hình 2025-11-19 9.20.07.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_b374d1b4398b.png)

### Phát triển song song

Hãy thử phát triển song song. Ví dụ, trong khi phát triển chính, có thể chỉ thị cập nhật README hoặc thay đổi tên ứng dụng.

![Ảnh chụp màn hình 2025-11-19 9.25.39.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_e38ab429082b.png)

### Đánh giá giao diện người dùng

Trình duyệt cũng được tích hợp là đặc trưng của Antigravity. Nhấn Open Browser ở góc trên bên phải.

![Ảnh chụp màn hình 2025-11-19 9.13.15.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_842948dc3d35.png)

Cài đặt tiện ích mở rộng Chrome.

![Ảnh chụp màn hình 2025-11-19 9.14.08.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_05716dc96a53.png)

Sau đó, khởi động lại Antigravity và Chrome. (Trong trường hợp của tôi, cần khởi động lại thêm Mac mới hoạt động đúng)

Sau khi chỉ thị `Viết lại thành thiết kế thanh lịch`, bằng cách `Cho xem thiết kế`, đã xem trước bằng video.

![Ảnh chụp màn hình 2025-11-19 10.27.47.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_7bc7b070d3ca.png)

Hơn nữa, ảnh chụp màn hình được tự động chụp và dán vào hướng dẫn chi tiết. Mở ảnh chụp màn hình đó, chỉ định vị trí và bình luận, có thể chỉ thị thay đổi giao diện người dùng trực tiếp.

![Ảnh chụp màn hình 2025-11-19 10.32.12.png](/images/qiita_rf_p_google_antigravity_vietnamese/qiita_ab4ca0da58c1.png)

### Ngoài lề

Kiến thức không hoạt động tốt lắm... Không rõ là lỗi hay cách sử dụng sai, sẽ bổ sung nếu biết

## Đánh giá tổng thể

Mặc dù có những phần còn thô sơ về chi tiết, cá nhân tôi cảm thấy trải nghiệm người dùng cực kỳ thoải mái. 4 trụ cột hoạt động đúng chức năng, đây là thành quả khác biệt so với các IDE hiện tại. Đã cải thiện chính xác những điểm bất tiện của Claude Code, Codex CLI, Cursor, và tôi cảm thấy như đã thấy bước tiến mới của phát triển được dẫn dắt bởi AI.

Tôi mong đợi sự phát triển trong tương lai.

## Quảng cáo

Tôi đang hoạt động trên X. Nếu có thể, hãy theo dõi nhé!
