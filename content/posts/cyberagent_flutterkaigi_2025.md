---
title: "Tham gia FlutterKaigi 2025"
date: 2025-11-18
draft: false
categories: ["Web and Frontend", "Business and Technology"]
tags: ["Dart", "Flutter", "FlutterKaigi", "Hot Reload", "Impeller"]
author: "原田伶央 (Harada Reo)"
translator: "日平"
description: "Báo cáo tham dự FlutterKaigi 2025 từ kỹ sư Flutter thuộc tổ chức INTECH của CyberAgent. Với vai trò Gold Sponsor, CyberAgent có 8 kỹ sư trình bày về Hot Reload, Impeller, bảo mật, giám sát và nhiều chủ đề khác"
---

# Tham gia FlutterKaigi 2025

**Tác giả**: 原田伶央 (@RunningReo)  
**Ngày xuất bản**: 18 tháng 11, 2025  
**Nền tảng**: CyberAgent Developers Blog  
**Tags**: Dart, Flutter, FlutterKaigi

---

## Giới thiệu

Xin chào, tôi là Harada Reo. Tôi đang làm Flutter engineer tại tổ chức chuyên về kỹ sư nội bộ DX "INTECH".

Sau khi có 2 năm rưỡi kinh nghiệm làm Android engineer phát triển dịch vụ blog "Ameba", tháng trước tôi bắt đầu thử thách với phát triển Flutter tại "INTECH". Mặc dù có kinh nghiệm phát triển Android native, nhưng Flutter tôi vẫn còn đang trong giai đoạn học hỏi. Đối với tôi, việc tham gia FlutterKaigi là cơ hội tuyệt vời để cập nhật xu hướng công nghệ mới nhất và kết nối với cộng đồng.

## Về FlutterKaigi

"FlutterKaigi" là một hội nghị Flutter với kỹ sư là vai trò chính. Được tổ chức bởi ban tổ chức gồm các tình nguyện viên phát triển Flutter, mục đích là chia sẻ thông tin kỹ thuật Flutter và giao tiếp.

## Gian hàng Sponsor của CyberAgent

CyberAgent tham gia lần này với vai trò Gold Sponsor và triển lãm gian hàng sponsor. Chúng tôi đã thiết lập một panel giống như trò phi tiêu để lấy ý kiến khảo sát về các chủ đề mà mọi người quan tâm, chơi chữ giữa Dart (ngôn ngữ được sử dụng trong Flutter) và darts (phi tiêu).

Đồng thời, chúng tôi cũng đặt các panel giới thiệu tình hình phát triển và các sáng kiến của từng sản phẩm, trao đổi kỹ thuật với người tham dự. Lần này có 8 chủ đề sau:

### Các chủ đề khảo sát

- Phiên bản Flutter hiện đang sử dụng
- Công nghệ được khuyến nghị
- Công nghệ muốn tìm hiểu/triển khai
- Những điều muốn cải thiện
- Có $200 cho AI tools, bạn sẽ trả phí cho tool nào?
- Những điều cần lưu ý khi sử dụng AI sinh tạo
- Thay đổi về cơ cấu phát triển
- Quy trình code review

### Kết quả khảo sát

Kết quả khảo sát cho thấy chủ đề được quan tâm nhất là "**Những điều cần lưu ý khi sử dụng AI sinh tạo**".

Trong bối cảnh phong cách phát triển tận dụng AI agent đang trở thành điều bình thường, tôi cảm thấy mọi người quan tâm đến việc làm thế nào để tối đa hóa hiệu quả của nó.

Rất nhiều người tham dự đã đến gian hàng, và tôi nghĩ chúng tôi đã có những trao đổi ý kiến rất ý nghĩa. Cảm ơn tất cả những người đã hợp tác với khảo sát.

### Các sản phẩm được giới thiệu

- Koigram
- ジャンプTOON (Jump TOON)
- WINTICKET
- INTECH

## Các phiên trình bày của kỹ sư nội bộ

Trong FlutterKaigi lần này, có 8 kỹ sư từ CyberAgent đã trình bày. Từ những kỹ sư giàu kinh nghiệm đến kỹ sư trẻ đã tập hợp lại, mỗi người mang theo kiến thức về phát triển Flutter từ góc nhìn của riêng mình.

### Diễn giả và chủ đề phiên

1. **木永風児** - Đối phó gian lận và nâng cao bảo mật đối với binary ứng dụng
2. **河村宇記** - Bản chất của BuildContext và cơ chế InheritedWidget
3. **長田卓馬** - 5 tips giám sát hữu ích trong vận hành ứng dụng Flutter thực tế
4. **渥美孝明** - Phương pháp liên kết native của Flutter 2025
5. **田中宏和** - Học về Gesture từ việc triển khai custom gesture
6. **加藤恵吾** - 5 tips tận dụng Figma Dev Mode MCP trong Flutter
7. **赤星光誓** - Local DB đó có phù hợp với project không? DB tối ưu để thay đổi từ ngày mai
8. **岸本亮太** - Cách tạo ứng dụng Flutter không ngừng hoạt động 24 giờ

Ngoài những cải tiến về triển khai UI như Figma MCP và custom gesture, họ còn đi sâu vào cách xây dựng cấu trúc ứng dụng như quản lý trạng thái và sắp xếp chuyển màn hình dựa trên hiểu biết về BuildContext, lựa chọn local DB. Hơn nữa, các sáng kiến hỗ trợ vận hành liên tục như đối phó bảo mật, giám sát vận hành, và know-how hoạt động 24 giờ cũng được chia sẻ.

Mọi phiên đều rất hữu ích, nhưng từ đây tôi muốn giới thiệu những phiên mà tôi đặc biệt ấn tượng.

### Tại sao Hot reload ngày hôm đó không hoạt động? 〜Cuộc đấu tranh giữa bảo mật OS (W^X) và JIT compiler〜

Mặc dù đã biết về sự cố Hot Reload không hoạt động trên iOS 26 với Flutter 3.32 trở về trước, nhưng thành thật mà nói, những phần như "Tại sao đột nhiên?" "Điều gì đã xảy ra trên OS?" vẫn còn mơ hồ trong hiểu biết của tôi.

Phiên này không chỉ trả lời những câu hỏi đó mà còn giải thích cẩn thận về luồng compile Dart trong Debug mode, các ràng buộc JIT được áp đặt từ phía iOS, và kết quả là những gì đã bị chặn.

#### Điểm chính của phiên

Điều ấn tượng nhất là việc đi sâu vào "lý do sâu xa" đằng sau các giải pháp như **Soft Fallback** và **Dual Mapping**. Không chỉ dừng lại ở bề mặt "Đã hoạt động được nhờ sửa DartVM", mà còn đề cập đến các tầng thấp như xử lý ghi bộ nhớ và quyền thực thi, giúp hiểu biết mơ hồ của tôi trở nên rõ ràng ngay lập tức.

Cuối cùng, tôi lại càng khâm phục năng lực kỹ thuật của Flutter team trong việc hấp thụ sự khác biệt giữa các platform và bảo vệ trải nghiệm phát triển.

### Impeller đã thay đổi điều gì

Đây là phiên sắp xếp lại sự khác biệt giữa Impeller được chuẩn hóa trong Flutter 3.10 và Skia truyền thống.

#### Bối cảnh kỹ thuật

Dựa trên lịch sử của các graphics API như OpenGL, Metal, Vulkan, phiên đã giải thích cẩn thận về cách xử lý cần thiết cho vẽ 2D được pipeline hóa và tối ưu hóa ở đâu.

Điều đặc biệt ấn tượng là cơ chế của GPU áp dụng cùng một xử lý cho tất cả pixel, và khó khăn trong việc tối ưu hóa cho Flutter khi sử dụng Skia - những phần mà tôi thường hiểu một cách mơ hồ đã được sắp xếp thông qua slide.

#### Cải tiến nhờ Impeller

Trên cơ sở đó, những cải tiến sau đây được thực hiện nhờ Impeller:

- **Giới thiệu phương pháp precompile** - Giải quyết shader jank
- **Flutter GPU** - Khả năng vẽ 3D
- **Custom shader** - Biểu hiện như Liquid Glass trở nên khả thi

## Kết luận

Một ngày trải qua tại FlutterKaigi là khoảng thời gian đầy ắp kiến thức từ đầu đến cuối. Tôi ghi chú trong khi gật đầu với lời của các diễn giả, và không biết khi nào thời gian đã trôi qua rất nhanh.

Gian hàng sponsor cũng liên tục có người tham dự đến, và từ những cuộc trò chuyện với các kỹ sư từ các công ty khác nhau, tôi đã cảm nhận được nhiệt huyết của cộng đồng. Kiến thức thu được lần này đã làm tăng mạnh mẽ mong muốn áp dụng vào công việc thực tế và làm phong phú hơn nữa việc phát triển Flutter.

Tôi chân thành cảm ơn đội ngũ tổ chức FlutterKaigi và tất cả những người đã liên quan vì đã nâng cao động lực phát triển Flutter của tôi đến mức này.

---

**Bài viết gốc**: https://developers.cyberagent.co.jp/blog/archives/59748/
