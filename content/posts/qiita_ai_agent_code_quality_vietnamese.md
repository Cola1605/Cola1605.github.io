---
title: "【Copy-Paste OK】Viết Code Chất Lượng với AI Agent! Hướng Dẫn Cài Đặt Quy Tắc Cải Thiện Chất Lượng Cho Mọi Người"
date: 2025-10-10
draft: false
categories: ["AI & Machine Learning", "Development"]
tags: ["cursor", "codex", "AI-agent", "claude-code", "code-quality", "best-practices", "development-tools"]
description: "Hướng dẫn cài đặt quy tắc coding cho AI Agent như Claude Code, Codex, Cursor để tự động cải thiện chất lượng code. Chỉ cần setup 1 lần, áp dụng cho tất cả dự án trong 5 phút."
---

# 【Copy-Paste OK】Viết Code Chất Lượng với AI Agent! Hướng Dẫn Cài Đặt Quy Tắc Cải Thiện Chất Lượng Cho Mọi Người

**Tác giả:** @tomada (とまだ@AI駆動開発)  
**Tổ chức:** Learning Next  
**Ngày đăng:** 2025-10-09  
**Phản ứng:** 👍 15 | 📚 6

**Bài viết gốc:** https://qiita.com/tomada/items/df5d3e0f611860bc2740

---

## Tóm Tắt

**Vấn đề:** AI Agent có thể tạo code chạy được, nhưng chất lượng còn đáng lo ngại

**Giải pháp:** Thiết lập file quy tắc chung để dạy AI tiêu chuẩn "code tốt"

**Lợi ích:**
- Chỉ cần cài đặt một lần, tự động áp dụng cho tất cả dự án
- AI luôn chú ý đến chất lượng code
- Cài đặt hoàn tất trong 5 phút

**Công cụ hỗ trợ:** Claude Code, Codex, Cursor

---

## Tại Sao AI Cần Quy Tắc?

### Chất Lượng Lập Trình Rất Sâu Rộng

"Code tốt" trong lập trình rất sâu rộng. Không chỉ chạy được, mà còn cần tính dễ đọc, dễ sửa đổi, xử lý lỗi, tốc độ xử lý và nhiều tiêu chí chất lượng khác.

### Giới Hạn Của AI

AI không biết "nên ưu tiên gì trong dự án này". Prototype thì ưu tiên tốc độ, production thì chất lượng và bảo mật là quan trọng nhất - AI không hiểu được ngữ cảnh này.

---

## File Quy Tắc Chung Là Gì?

Là tài liệu viết "phương châm phát triển" cho AI. Giống như có một senior engineer giỏi luôn bên cạnh tư vấn cho bạn.

### Ưu Điểm

Chỉ cần cài đặt một lần, không cần thiết lập lại mỗi khi bắt đầu dự án mới. Các quy tắc chất lượng cơ bản có thể tái sử dụng chung.

---

## Hướng Dẫn Cài Đặt

### Cài Đặt Claude Code

#### Bước 1: Tạo thư mục và file cài đặt

**Mac/Linux:**
```bash
mkdir -p ~/.claude && touch ~/.claude/CLAUDE.md
```

**Windows:**
```powershell
New-Item -Path "$HOME\.claude" -ItemType Directory -Force && New-Item -Path "$HOME\.claude\CLAUDE.md" -ItemType File -Force
```

#### Bước 2: Mở file và dán quy tắc vào

```bash
code ~/.claude/CLAUDE.md
```

※ Trong VS Code, nhấn Command+Shift+P (Mac) hoặc Ctrl+Shift+P (Windows), chọn "Shell Command: Install 'code' command in PATH".

### Cài Đặt Codex

```bash
mkdir -p ~/.codex && touch ~/.codex/AGENTS.md && code ~/.codex/AGENTS.md
```

### Cài Đặt Cursor

1. Mở Cursor
2. Mở màn hình cài đặt (biểu tượng bánh răng)
3. Chọn "Rules & Memories"
4. Click nút "Add Rule" trong "User Rules"
5. Dán quy tắc vào và lưu

---

## Triết Lý Phát Triển

- Không chỉ viết code chạy được, mà luôn chú ý đến chất lượng, tính bảo trì và an toàn
- Cân bằng phù hợp theo giai đoạn của dự án
- Khi phát hiện vấn đề, không bỏ qua mà phải xử lý hoặc ghi chép rõ ràng
- **Boy Scout Rule:** Để lại code tốt hơn khi bạn tìm thấy nó

---

## 8 Điểm Kiểm Tra Chất Lượng

### 1. Error Handling (Xử Lý Lỗi)

**Mô tả:** Xử lý khi chương trình gặp lỗi. Thông báo phù hợp cho người dùng, tiếp tục xử lý an toàn hoặc dừng lại.

**Nguyên tắc:**
- Giải quyết mọi lỗi ngay cả khi có vẻ không liên quan
- Sửa nguyên nhân gốc rễ, không chỉ che giấu lỗi
- Phát hiện lỗi sớm và cung cấp thông báo rõ ràng
- Test cases phải cover cả trường hợp lỗi
- Luôn xem xét khả năng thất bại của external API và network communication

### 2. Security (Bảo Mật)

**Mô tả:** Giống như khóa cửa nhà, chương trình cũng cần biện pháp bảo mật.

**Biện pháp:**
- Không hiển thị mật khẩu trên màn hình
- Mã hóa thông tin cá nhân
- Chặn input độc hại
- Ẩn API key
- Xác thực tất cả input từ bên ngoài
- Hoạt động với quyền tối thiểu cần thiết

### 3. Maintainability (Tính Bảo Trì)

**Mô tả:** Code không chỉ viết một lần rồi xong. Sau này cần thêm tính năng và sửa bug.

**Đặc điểm:**
- Tên biến dễ hiểu
- File được chia theo từng chức năng
- Comment giải thích ý định
- Không có code trùng lặp
- **DRY Principle:** Tránh trùng lặp, duy trì single source of truth

### 4. Testability (Khả Năng Test)

**Mô tả:** Quan trọng là có cấu trúc cho phép kiểm tra hoạt động (test) đầy đủ.

**Đặc điểm:**
- Chức năng được chia nhỏ
- Không phụ thuộc quá nhiều vào service bên ngoài
- Input và output rõ ràng
- Hành vi có thể dự đoán
- Test behavior chứ không phải implementation details

### 5. Performance (Hiệu Suất)

**Mô tả:** Tốc độ xử lý của chương trình. Quan trọng là chọn phương pháp xử lý hiệu quả.

**Thực hành:**
- Tránh xử lý không cần thiết
- Tối thiểu hóa truy cập database
- Chỉ thực thi xử lý nặng khi cần
- Tận dụng cache (lưu tạm thời)
- Optimize dựa trên đo lường, không phải đoán
- Tránh N+1 problem và over-fetching

### 6. Reliability (Độ Tin Cậy)

**Mô tả:** Cần có phương án thay thế khi gặp vấn đề.

**Phương pháp:**
- Tự động retry khi gặp lỗi
- Sử dụng service khác khi service dừng
- Backup dữ liệu
- Gửi alert khi phát hiện bất thường
- Thiết lập timeout processing phù hợp
- Áp dụng circuit breaker pattern

### 7. Observability (Khả Năng Quan Sát)

**Mô tả:** Quan trọng là có thể nắm được "trạng thái hiện tại" của chương trình.

**Biện pháp:**
- Lưu log (ghi chép)
- Ghi lại thông tin chi tiết lỗi
- Đo lường thời gian xử lý
- Theo dõi hành vi người dùng (chú ý privacy)
- Đảm bảo observability với log và metrics phù hợp

### 8. Scalability (Khả Năng Mở Rộng)

**Mô tả:** Quan trọng là có cấu trúc có thể đáp ứng khi người dùng tăng.

**Cách tiếp cận:**
- Thiết kế database khéo léo
- Cấu hình cho phép tăng server
- Có thể song song hóa xử lý
- Thiết kế cho phép thêm chức năng không cần thiết sau này
- Cân nhắc tính mở rộng từ giai đoạn đầu

---

## Các Lĩnh Vực Quan Trọng Khác

### Git Operations

- Sử dụng conventional commit format (feat:, fix:, docs:, test:, refactor:, chore:)
- Commit atomic, tập trung vào single change
- Message commit rõ ràng và mô tả bằng tiếng Anh
- Tránh commit trực tiếp vào main/master branch

### Dependency Management

- Chỉ thêm dependency thực sự cần thiết
- Luôn commit lock file như package-lock.json
- Kiểm tra license, size, maintenance status trước khi thêm dependency mới
- Cập nhật định kỳ cho security patch và bug fix

### Documentation

- Ghi rõ tổng quan dự án, setup, cách sử dụng trong README
- Cập nhật document đồng bộ với code
- Ưu tiên đưa ra ví dụ thực tế
- Ghi lại quyết định thiết kế quan trọng trong ADR (Architecture Decision Records)

---

## Câu Hỏi Thường Gặp

### Q1: Người mới học lập trình có thể sử dụng không?

Có, thậm chí đặc biệt khuyên dùng cho người mới. Với file quy tắc chung, AI sẽ viết code đồng thời giải thích "tại sao implementation này tốt". Bạn có thể học cách viết code tốt một cách tự nhiên thông qua thực hành.

### Q2: Dùng cùng quy tắc cho tất cả dự án có ổn không?

Quy tắc cơ bản có thể dùng chung. Có thể customize theo từng dự án. Ví dụ dự án React thì thêm quy tắc về component layout, hoặc coding rule cho type definition trong TypeScript.

### Q3: Quá nhiều quy tắc có làm AI bị rối không?

Với mức độ quy tắc giới thiệu lần này thì không vấn đề. File quy tắc có chứa chỉ thị "cân bằng phù hợp theo giai đoạn dự án", nên AI sẽ đánh giá theo tình huống. Nếu dài quá, có thể nhờ ChatGPT "nén nội dung".

### Q4: Làm sao để xác nhận quy tắc đã cài đặt?

Hỏi AI "cho tôi biết quy tắc hiện tại đang cài đặt" là có thể xác nhận. Khi generate code, hỏi "tại sao lại implementation như này?" thì AI sẽ giải thích đã xem xét quy tắc nào.

---

## Các Khái Niệm Quan Trọng

- **Boy Scout Rule:** Để lại code tốt hơn khi bạn tìm thấy nó
- **DRY Principle:** Tránh trùng lặp, duy trì single source of truth
- **Broken Windows Theory:** Không bỏ qua vấn đề nhỏ, sửa ngay khi phát hiện
- **Minimum Privilege Principle:** Hoạt động với quyền tối thiểu cần thiết
- **Circuit Breaker Pattern:** Phương án thay thế khi service dừng
- **ADR:** Architecture Decision Records - ghi lại quyết định thiết kế quan trọng

---

## Công Cụ Được Đề Cập

- Claude Code
- Codex
- Cursor
- VS Code
- ChatGPT

---

## Tài Liệu Tham Khảo

- [同じ5行のコードが全く違って見える12の瞬間、なぜ私たちは学ぶのか？](https://zenn.dev/coconala/articles/reasons-for-continuing-to-learn) - Zenn

---

## Thông Tin Tác Giả

**Twitter:** https://x.com/muscle_coding  
**Discord:** Nơi hỏi đáp, tư vấn, giao lưu cho những người mới bắt đầu AI-driven development

---

## Kết Luận

Trong AI-driven development, AI Agent là đối tác mạnh mẽ. Bằng cách truyền đạt kỳ vọng rõ ràng thông qua file quy tắc chung, AI sẽ viết code luôn chú ý đến chất lượng.

Cài đặt chỉ mất 5 phút. Từ "code chạy được" đến "code tốt".

---

**Thông tin bài viết**  
**Nguồn:** Qiita  
**URL:** https://qiita.com/tomada/items/df5d3e0f611860bc2740  
**Ngày xử lý:** 2025