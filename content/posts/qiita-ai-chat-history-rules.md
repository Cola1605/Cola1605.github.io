---
title: "Prompt/Rules để chuyển lịch sử chat với AI Agent (Claude Code/Codex/Cursor) thành tài sản tài liệu của tổ chức"
date: 2025-12-10
authors: ["Kentaro Wada (@WdknWdkn)"]
translator: "Matsuoka"
categories: ["AI and Machine Learning", "Development", "Business and Technology"]
tags: ["Cursor", "AI Agent", "Claude Code", "Documentation", "Prompt Engineering", "Knowledge Management"]
source_url: "https://qiita.com/WdknWdkn/items/cac488d84a4e767cae12"
level: "intermediate"
---

# Prompt/Rules để chuyển lịch sử chat với AI Agent (Claude Code/Codex/Cursor) thành tài sản tài liệu của tổ chức

## Giới thiệu

Tôi là Wada từ ielove GROUP, đang giữ vai trò giám đốc điều hành.

Trong phát triển team và hướng dẫn junior, bạn có gặp tình huống "Mẫu này, tôi đã giải thích lần nữa rồi" hoặc "Cách tiếp cận lần trước hiệu quả, mong muốn member khác cũng biết" không?

Ngoài ra, lịch sử chat với AI thường biến mất chỉ trong phút chốc. Dù đã dành 30 phút thử nghiệm và giải quyết vấn đề, member tiếp theo lại phải bắt đầu đối thoại từ đầu với cùng vấn đề. Có lẽ điều này cũng xảy ra nhỉ. Thật sự lãng phí.

Do đó, tôi đã tạo ra cơ chế chuyển đổi chính lịch sử đối thoại với AI thành "quy tắc của project". Hôm nay tôi sẽ chia sẻ prompt thực tế và ví dụ output.

### Quảng cáo "Đang chạy self-marathon Qiita Advent Calendar"

Hiện tại tháng 12/2025, đang thực hiện self-marathon trên Qiita Advent Calendar.

## Tại sao tạo rules từ "lịch sử chat"

Tất nhiên, lý tưởng là tự tay duy trì tài liệu. Nhưng thực tế, bận rộn với phát triển hàng ngày nên "viết sau" không bao giờ đến.

Mặt khác, lịch sử chat của Cursor (hoặc AI agent khác) chứa đầy **kiến thức thực tế "vấn đề → thử nghiệm → giải quyết → xác định phương hướng"**. Nếu có thể cấu trúc hóa điều này:

- **Tính tái hiện cao**: Vì là vấn đề thực tế gặp phải và giải pháp, không phải lý thuyết trên giấy tờ
- **Context được bảo tồn**: Tại sao đưa ra quyết định đó, cả background cũng được lưu lại
- **Có thể rules hóa ngay lập tức**: Document hóa ngay sau đối thoại, độ tươi của kiến thức cao
- **Chất lượng đề xuất của AI cải thiện**: Từ lần sau, AI sẽ đề xuất phù hợp trong trường hợp tương tự

Nói cách khác, có thể tạo **trạng thái "rules phát triển cùng với development"**.

## Các vấn đề mà prompt này giải quyết

**Vấn đề truyền thống:**

- Kiến thức thu được từ đối thoại với AI bị giam trong cá nhân
- Phát sinh công sức phải giải thích cùng vấn đề nhiều lần
- Quy tắc riêng của project trở thành kiến thức ngầm
- Việc duy trì .cursor/rules (hoặc tài liệu khác) bị trì hoãn

**Giải pháp bằng prompt này:**

- Tự động generate tài liệu rules có hệ thống từ lịch sử đối thoại
- Thu thập đầy đủ thông tin cần thiết bằng format phỏng vấn
- Output với chất lượng có thể commit ngay
- Kiến thức team được cấu trúc hóa, độ chính xác đề xuất của AI cũng cải thiện

## Điểm khéo léo trong thiết kế prompt

### 1. Thiết kế phỏng vấn theo giai đoạn

Nếu đột ngột nói "hãy tạo rules", thông tin không đủ và tài liệu không sử dụng được. Do đó, thu thập thông tin có hệ thống bằng **7 câu hỏi** sau:

1. **Phạm vi áp dụng**: Áp dụng cho directory/module nào (VD: `/application/modules/ec/js`, `/api/` v.v.)
2. **Sắp xếp background**: Vấn đề căn bản đã giải quyết là gì (VD: Phân tích nguyên nhân ES6 import error, phương hướng dùng chung với legacy jQuery v.v.)
3. **Phương hướng implementation**: Format implementation chuẩn được khuyến nghị cho trường hợp tương tự là gì (VD: Dùng `type="module"`, cấm CommonJS, sử dụng cú pháp export class v.v.)
4. **Xử lý exception**: Có pattern exception nào được phép vì lý do code hiện có hoặc dependency không (VD: Tương thích plugin cũ, public window, HTML viết trực tiếp v.v.)
5. **Phương hướng đề xuất của Cursor agent**: Khi AI nhận được lỗi hoặc tư vấn tương tự, muốn đề xuất theo hướng nào (VD: "Ưu tiên ESM hóa", "Duy trì cú pháp cũ nhưng để lại comment cảnh báo" v.v.)
6. **Góc nhìn review/quality control**: Điểm nào con người cần kiểm tra đặc biệt khi review (VD: "Có thêm format tương thích mới không", "Có làm ô nhiễm window scope không" v.v.)
7. **Tên file rules**: Tên file output là gì (VD: `frontend_environment_rules.mdc`)

Thiết kế câu hỏi này là điểm mấu chốt, có thể loại bỏ sự mơ hồ như "Ủa, cái này áp dụng ở đâu nhỉ?".

### 2. Cấm suy đoán và t상imagine

Để không để AI tự ý diễn giải, đã tích hợp các guardrail sau:

- Tuyệt đối không output trước khi hoàn thành phỏng vấn
- Chỉ trích xuất sự thật từ lịch sử chat
- Cấm suy đoán và t상imagine, bổ sung điểm chưa rõ bằng câu hỏi

### 3. Format output có thể commit ngay

Output dạng `.cursor/rules/*.mdc` với các yếu tố sau để thành file hoàn chỉnh:

- Frontmatter metadata (description, globs, alwaysApply)
- Ghi rõ phạm vi áp dụng và background
- Sắp xếp phương hướng implementation dạng bảng
- Ví dụ code cụ thể
- Checklist khi review
- Memo áp dụng và thông tin nguồn generation

## Implementation: Toàn bộ prompt

Đây là prompt có thể dùng ngay. Copy paste vào chat của Cursor là chạy được.

```
# === Mục đích ===
Tham khảo lịch sử chat giữa user và AI trên Cursor (= đối thoại phát triển của AI và user),
dựa trên kiến thức, judgment, phương hướng thu được từ lịch sử đó, tiến hành phỏng vấn bổ sung với user,
và cuối cùng generate tài liệu có thể thêm vào `.cursor/rules/*.mdc`.

File .mdc được generate phải tự động insert block đầu sau:

---
description: (Giải thích rules)
globs: (Phạm vi ghi rules)
alwaysApply: true/false
---

Khi tham chiếu file này, hãy nói "Đã đọc (tên rules)！！！！！！".

---

# === Luồng xử lý ===

## Step 0. Input tiền đề
Nhận thông tin sau làm input:
- 【A】Lịch sử chat trên Cursor (VD: `identify_console_error_causes.md`)
- 【B】Câu trả lời user (thu thập qua phỏng vấn sau)

Dựa trên 2 điều này, generate tài liệu quy tắc project có tính tái hiện.

---

## Step 1. Phỏng vấn (đối thoại user)

Sau khi đọc tiền đề từ lịch sử, đặt 7 câu hỏi sau **theo thứ tự** cho user.
(Phải hoàn thành phase này trước khi tự động generate)

1. **Phạm vi áp dụng**
　Hãy cho biết project/directory/module muốn áp dụng rules này.
　(VD: `/application/modules/ec/js`, `/api/` v.v.)

2. **Sắp xếp background lịch sử**
　"Vấn đề căn bản" hoặc "yếu tố quyết định phương hướng" đã thảo luận với AI trong lịch sử chat này là gì?
　(VD: Phân tích nguyên nhân ES6 import error, phương hướng dùng chung với legacy jQuery v.v.)

3. **Phương hướng implementation (chuẩn)**
　Hãy cho biết "format implementation chuẩn" muốn khuyến nghị cho trường hợp tương tự trong tương lai.
　(VD: Dùng `type="module"`, cấm CommonJS, sử dụng cú pháp export class v.v.)

4. **Exception/Xử lý tạm thời**
　Có pattern nào được phép exception vì lý do code hiện có hoặc dependency không?
　(VD: Tương thích plugin cũ, public window, HTML viết trực tiếp v.v.)

5. **Phương hướng đề xuất Cursor agent**
　Khi AI nhận được error hoặc tư vấn tương tự, muốn AI đề xuất theo hướng nào?
　(VD: "Ưu tiên ESM hóa", "Duy trì cú pháp cũ nhưng để lại comment cảnh báo" v.v.)

6. **Góc nhìn review/quality control**
　Điểm nào muốn kiểm tra đặc biệt khi con người review?
　(VD: "Có thêm format tương thích mới không", "Có làm ô nhiễm window scope không" v.v.)

7. **Tên file rules và title**
　Cho biết tên file output (VD: `frontend_environment_rules.mdc`) và
　title heading (VD: "Phương hướng implementation JavaScript dưới module ENTRY").

---

## Step 2. Logic generation rules

Tích hợp câu trả lời phỏng vấn trên và nội dung lịch sử chat,
generate file `.cursor/rules/*.mdc` với cấu trúc Markdown sau:

(Cấu trúc markdown bỏ qua - tham khảo ví dụ output thực tế)

---

## Step 3. Điều kiện hành động

* Tuyệt đối không output Markdown cho đến khi hoàn thành phỏng vấn Step1.
* Tự động generate rules bằng cách kết hợp câu trả lời user + thông tin lịch sử.
* Output là **file hoàn chỉnh có thể commit ngay**.
* AI có thể tóm tắt và insert "context trích xuất từ lịch sử" trong văn bản, nhưng cấm suy đoán/tưởng tượng.

---

## Step 4. Tone/Format

* Cách viết theo format sách quy tắc nội bộ (ngắn gọn, trung lập, coi trọng tính tái hiện)
* Xóa lời cảm ơn và giải thích background không cần thiết
* Đạt mức engineer có thể sử dụng ngay (VD: checklist/ví dụ code)
* Tự động ghi tên file, ngày tháng
* Thêm "Tài liệu này được tự động generate dựa trên lịch sử chat Cursor và câu trả lời user." ở cuối

---

## Step 5. Chế độ output

Chế độ output là format `.mdc` (Markdown with Cursor metadata),
khi hoàn thành generation ghi 1 dòng cuối:

> Tài liệu này được tự động generate dựa trên lịch sử chat với AI trên Cursor và câu trả lời user.
```

## Cách sử dụng: Hoàn thành trong 5 bước

### 1. Chuẩn bị prompt

Copy & paste prompt trên vào chat Cursor

### 2. Đọc lịch sử chat

Cung cấp lịch sử chat quá khứ mục tiêu cho AI (dùng chức năng export nếu có, không thì copy trực tiếp)

### 3. Trả lời phỏng vấn

AI sẽ đặt 7 câu hỏi theo thứ tự, hãy trả lời từng câu.

### 4. Hoàn thành tự động generate

Khi hoàn thành tất cả câu trả lời, `.cursor/rules/〇〇.mdc` sẽ được tự động generate.

### 5. Review và commit

Xác nhận file đã generate, nếu không có vấn đề thì commit ngay.

## Ví dụ output: ES6 Module Implementation Guideline

Đây là ví dụ output khi giải quyết vấn đề dùng chung jQuery trong môi trường ES6 module:

```markdown
---
description: Guideline implementation ES6 module dưới module ENTRY. Bao gồm xử lý dynamic import trong môi trường Ajax.
globs: application/modules/entry/**/*.js,application/modules/entry/**/*.phtml,public_html/js/entry/**/*.js
alwaysApply: true
---

Khi tham chiếu file này, hãy nói "Đã đọc guideline implementation js của ENTRY！！！！！！".

# Phương hướng implementation JavaScript dưới module ENTRY

## Phạm vi áp dụng
Toàn bộ implementation JavaScript dưới `/application/modules/entry/`

## Background/Mục đích
Khi load động ES6 module trong môi trường Ajax, các vấn đề sau đã xảy ra:
- Error câu lệnh `import` khi chỉ định `type="module"`
- Vấn đề tương thích với jQuery 1.7.1
- Dependency window scope của plugin hiện có

Giải quyết những vấn đề này đồng thời chuẩn hóa ESM (ES Modules) cho implementation mới.

## Phương hướng implementation

### Implementation mới (khuyến nghị)
| Hạng mục | Format implementation | Ví dụ |
|------|---------|-----|
| Format module | ESM | `export class EntryForm {}` |
| Load HTML | `type="module"` | `<script type="module" src="...">` |
| Sử dụng jQuery | Qua import | `import $ from 'jquery';` |

### Sửa đổi hiện có (duy trì tương thích)
| Hạng mục | Format implementation | Ví dụ |
|------|---------|-----|
| Format module | Hybrid (ESM + public window) | `export class X {}; window.X = X;` |
| Bắt buộc comment | Notation `@env` | `// @env jQuery 1.7.1 + ESM Hybrid` |
| Load HTML | `type="module"` | `<script type="module" src="...">` |

## Exception/Xử lý tương thích
Cho phép public window scope trong các trường hợp sau:
- Plugin hiện có (datepicker v.v.) tham chiếu `window.jQuery`
- Cần gọi class từ `onclick` v.v. viết trực tiếp HTML

**Điều kiện bắt buộc**: Ghi rõ lý do bằng comment

## Policy đề xuất Cursor agent
Khi xảy ra import error tương tự:
1. **Lựa chọn thứ nhất**: Đề xuất ESM hóa (cú pháp `export` + `type="module"`)
2. **Khi cần tương thích**: Đề xuất format Hybrid, khuyến khích thêm comment
3. **Nguyên tắc cấm public window mới**: Exception chỉ khi có dependency hiện có

## Quy ước coding (trích xuất từ lịch sử)

### Notation comment
/**
 * @env jQuery 1.7.1 + ESM Hybrid
 * @compat public window: Vì tham chiếu từ plugin datepicker hiện có
 */

### Cách xử lý export / jQuery
// Khuyến nghị: Format ESM
export class EntryForm {
  constructor() {
    import('jquery').then($ => {
      // Xử lý jQuery
    });
  }
}

// Tương thích: Format Hybrid
export class LegacyPlugin {
  // ...
}
window.LegacyPlugin = LegacyPlugin; // Bắt buộc comment lý do

### Ví dụ mô tả HTML khi áp dụng type="module"
<!-- Khuyến nghị -->
<script type="module" src="/js/entry/form.js"></script>

<!-- Không khuyến nghị: Không có attribute type (chỉ cho phép trong môi trường cũ) -->
<script src="/js/entry/legacy.js"></script>

## Quy tắc review/vận hành
Khi review PR, check các điểm sau:
- [ ] Có public `window` mới không (nếu exception, có comment lý do không)
- [ ] `type="module"` đã được áp dụng chưa
- [ ] Comment `@env` đã được thêm chưa (trường hợp format Hybrid)
- [ ] Nếu có dependency jQuery, đã qua import chưa

## Memo áp dụng
- Tên file: `.cursor/rules/frontend_environment_rules.mdc`
- Ngày tạo: 2025-05-01
- Lịch sử chat gốc: `identify_console_error_causes.md`
- Phương pháp generation: "Tích hợp tự động lịch sử chat + phỏng vấn"

---

> Tài liệu này được tự động generate dựa trên lịch sử chat với AI trên Cursor và câu trả lời user.
```

## Giá trị đạt được bằng cơ chế này

### 1. Cấu trúc hóa và chia sẻ kiến thức

Đối thoại giữa cá nhân và AI trở thành chuẩn của toàn team. Giảm "Không biết nếu không hỏi người đó".

### 2. Chất lượng đề xuất AI cải thiện liên tục

Bằng cách tích lũy rules trong `.cursor/rules/*.mdc`, từ lần sau AI sẽ đề xuất thích hợp "Trong project này nên implement như thế này".

### 3. Giảm chi phí review

Góc nhìn review được thống nhất bằng rules và checklist rõ ràng. Giảm "Cái này có được phép không nhỉ?".

### 4. Tài liệu có tính tái hiện cao

Vì ghi lại đúng quy trình giải quyết vấn đề thực tế, context "tại sao lại như thế" được bảo tồn.

## Tổng kết

Thật lãng phí nếu để đối thoại với AI kết thúc chỉ trong khoảnh khắc đó. Bằng cách rules hóa đúng quy trình giải quyết vấn đề thực tế:

- Tài liệu phát triển cùng với development
- Kiến thức team được cấu trúc hóa
- Chất lượng đề xuất AI cải thiện liên tục

Có thể tạo ra chu kỳ như vậy.

Prompt có thể dùng ngay, nên hãy thử một lần xem sao. Nếu chạy tốt, hãy customize cho phù hợp với project của bạn. Nếu có ý kiến gì, rất mong được tiếp nhận.

---

**Tác giả**: Kentaro Wada (@WdknWdkn) - ielove GROUP, Giám đốc điều hành  
**Nguồn**: [Qiita - Prompt/Rules để chuyển lịch sử chat với AI Agent thành tài sản tài liệu tổ chức](https://qiita.com/WdknWdkn/items/cac488d84a4e767cae12)  
**Dịch giả**: Matsuoka
