---
title: "Tạm biệt review mệt mỏi! Tùy chỉnh Copilot Agent với copilot-instructions.md"
date: 2025-11-10
draft: false
categories: ["Development", "Productivity"]
tags: ["GitHub Copilot", "生成AI", "Development Efficiency", "VS Code", "Code Review"]
author: "ntaka329 (永田) - GMOコネクト"
translator: "日平"
description: "Hướng dẫn sử dụng copilot-instructions.md để custom output của GitHub Copilot Agent, giảm review time từ 430 dòng xuống 150 dòng, từ 1400 dòng xuống 370 dòng"
---

# Tạm biệt review mệt mỏi! Tùy chỉnh Copilot Agent với copilot-instructions.md

**Tác giả**: ntaka329 (永田) - GMOコネクト株式会社  
**Ngày đăng**: 10 tháng 11, 2025  
**Nguồn**: [Qiita](https://qiita.com/ntaka329/items/480c60d3ccf68034471d)

---

## Giới thiệu

Các bạn có bao giờ nghĩ "Đây không phải output mình cần..." khi dùng GitHub Copilot Agent để generate code không?

Ví dụ:
- Nhờ thiết kế API thì được **430 dòng** OpenAPI schema khổng lồ kèm theo cả curl và Python implementation
- Hỏi về process flow thì nhận **1400 dòng** code + ASCII art diagram + một đống sample code

"Muốn ngắn gọn hơn", "Muốn dùng Mermaid cho diagram", "Không cần implementation example"... Phải comment lặp đi lặp lại những điều này thật mệt mỏi phải không?

**`copilot-instructions.md` chính là giải pháp cho vấn đề đó.**

Chỉ cần đặt file này vào repository, bạn có thể **customize output style của Copilot Agent cho toàn bộ project**.

### Bạn sẽ học được gì

- copilot-instructions.md là gì
- Before/After cụ thể (No1: API design, No2: Process flow)
- Cách áp dụng trong thực tế và tips

**Đối tượng:**
- Đang dùng GitHub Copilot Agent (VS Code extension)
- Muốn output của AI "theo ý mình hơn"
- Muốn unify output style trong team development

Bắt đầu thôi!

---

## copilot-instructions.md là gì

### Thông tin cơ bản

`copilot-instructions.md` là config file để customize behavior của GitHub Copilot Agent (VS Code extension).

**Vị trí:**
```
.github/copilot-instructions.md
```

**Hoạt động:**
- Khi Copilot Agent generate response, nó đọc nội dung file này như một phần của prompt
- Có thể viết rules, style guide, prohibitions riêng cho project

**Official docs:**
- [Copilot Workspace Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot#about-custom-instructions-for-github-copilot)

### Vấn đề trước đây

Copilot Agent rất xuất sắc, nhưng default thì output có xu hướng "chi tiết và lịch sự quá":

| Vấn đề | Impact |
|--------|--------|
| **Output dài dòng** | Scroll mỏi tay, tốn thời gian review |
| **Thông tin không cần** | curl command, implementation... những thứ không yêu cầu cũng generate |
| **Format diagram** | ASCII art khó đọc, Mermaid sẽ tốt hơn |
| **Comment lặp lại** | "Ngắn gọn hơn", "Cái này không cần" - phải nói đi nói lại |

### Giải quyết bằng copilot-instructions.md

```markdown
<!-- .github/copilot-instructions.md -->

# Về API design

- Chỉ viết OpenAPI schema
- Không cần curl command, Python implementation

# Về diagram

- Dùng Mermaid notation thay vì ASCII art

# Về code

- Ưu tiên giải thích algorithm thay vì sample code
```

Chỉ viết như vậy, **output style sẽ consistent trong toàn bộ project**.

### Lợi ích

| Lợi ích | Giải thích |
|---------|-----------|
| **Giảm review time** | Bớt thông tin không cần, tập trung vào bản chất |
| **Consistency** | Toàn team nhận output cùng style |
| **Learning effect** | Không cần phải comment lặp lại |
| **Tăng productivity** | Output ngay theo format mong muốn từ đầu |

---

## No1: Cải thiện output API design đáng kể

### Vấn đề: Nhờ thiết kế API thì được... 430 dòng masterpiece

**Yêu cầu:**
> "Tạo OpenAPI schema cho Product Search API"

**Before (không có copilot-instructions.md):**

Copilot Agent generate:

1. **OpenAPI 3.0 schema** (250 dòng)
2. **curl command usage examples** (30 dòng)
3. **Python implementation example** (150 dòng)
   - Request processing
   - Error handling
   - Sample response

**Tổng: ~430 dòng**

**Vấn đề:**
- Chỉ cần OpenAPI schema nhưng lại generate cả đống implementation
- Scroll mỏi tay
- Tốn thời gian review

### Giải pháp: Chỉ lấy schema bằng copilot-instructions.md

**Thêm vào copilot-instructions.md:**

```markdown
# Về API design

## Quy tắc viết OpenAPI schema

- Chỉ viết OpenAPI schema
- Không cần curl command, Python implementation
- Có thể thêm comment tổng quan về schema nếu cần
```

**After (có copilot-instructions.md):**

Với câu hỏi tương tự, Copilot Agent chỉ generate:

1. **OpenAPI 3.0 schema only** (150 dòng)
   - Có comment ngắn gọn
   - Không có curl hay Python code

**Tổng: ~150 dòng**

### Kết quả

| Chỉ số | Before | After | Cải thiện |
|--------|--------|-------|----------|
| **Số dòng** | 430 dòng | 150 dòng | **Giảm 65%** |
| **Review time** | ~15 phút | ~5 phút | **Tiết kiệm 67%** |
| **Thông tin thừa** | Có (curl, implementation) | Không | **Loại bỏ hoàn toàn** |

---

## No2: Sắp xếp Process flow dễ đọc hơn

### Vấn đề: Process flow thành... 1400 dòng code

**Yêu cầu:**
> "Giải thích flow đăng ký user"

**Before (không có copilot-instructions.md):**

Copilot Agent generate:

1. **Text-based flow explanation** (100 dòng)
2. **ASCII art diagram** (200 dòng)
   - Khó đọc, không copy được
3. **Sample code mỗi step** (1100 dòng)
   - Validation processing
   - DB save processing
   - Email sending
   - Error handling

**Tổng: ~1400 dòng**

**Vấn đề:**
- ASCII art khó đọc (Mermaid sẽ tốt hơn)
- Sample code quá nhiều, không nhìn được big picture
- Chi tiết code có thể nghĩ sau khi implement

### Giải pháp: Sắp xếp diagram và explanation bằng copilot-instructions.md

**Thêm vào copilot-instructions.md:**

```markdown
# Về Process flow và diagram

## Quy tắc viết diagram

- Dùng Mermaid notation thay vì ASCII art
- Flowchart, sequence diagram... tất cả đều dùng Mermaid

## Quy tắc viết code

- Ưu tiên giải thích algorithm thay vì sample code
- Viết bullet points tổng quan về processing cần thiết
- Chi tiết implementation do user tự quyết định nên không cần
```

**After (có copilot-instructions.md):**

Với câu hỏi tương tự, Copilot Agent generate:

1. **Mermaid flowchart** (30 dòng)
   - Dễ đọc, có thể copy
2. **Tổng quan mỗi step** (200 dòng)
   - Chỉ giải thích algorithm
   - Không có sample code
3. **Lưu ý và considerations** (140 dòng)

**Tổng: ~370 dòng**

### Kết quả

| Chỉ số | Before | After | Cải thiện |
|--------|--------|-------|----------|
| **Số dòng** | 1400 dòng | 370 dòng | **Giảm 74%** |
| **Độ dễ đọc diagram** | ASCII art (khó) | Mermaid (dễ) | **Cải thiện lớn** |
| **Hiểu flow** | Chìm trong code | Overview rõ ràng | **Dễ hiểu hơn** |

---

## Cách sử dụng copilot-instructions.md

### 1. Cách dùng cơ bản

**Step 1: Tạo file**

```bash
mkdir -p .github
touch .github/copilot-instructions.md
```

**Step 2: Viết rules của project**

```markdown
# Tên Project

Đây là repository để phát triển 〇〇.

## Coding conventions

- Indent: 2 spaces
- Không bỏ semicolon
- Comment bằng tiếng Nhật

## API design

- Chỉ viết OpenAPI schema
- Không cần curl command, implementation example

## Diagram

- Dùng Mermaid notation thay vì ASCII art
```

**Step 3: Dùng Copilot Agent**

VS Code → `Cmd+Shift+P` → "GitHub Copilot: Open Chat", hỏi như bình thường.

### 2. Khi nào nên thêm vào copilot-instructions.md

**Rule của tôi:**
> "Viết cùng comment 3 lần → thêm vào copilot-instructions.md"

**Ví dụ:**

Lần 1: "Không cần curl command"
Lần 2: "Không cần curl command"
Lần 3: "Không cần curl command" ← Lúc này thêm vào copilot-instructions.md

**Lý do:**
- Lần 1 có thể là tình cờ
- Lần 2 thấy xu hướng
- Lần 3 chắc chắn là pattern

### 3. Sử dụng trong team development

**Scenario:**

- Khi team member tăng, Copilot output style mỗi người mỗi kiểu
- Include copilot-instructions.md vào repository → Toàn team làm việc với cùng style

**Best practices:**

1. **Tạo khi kickoff project**
   - Setup copilot-instructions.md cùng với coding conventions
   
2. **Update khi review**
   - "Muốn unify style này" → Ngay lập tức thêm vào copilot-instructions.md
   
3. **Review định kỳ**
   - Project tiến triển → Xóa rules không cần nữa

### 4. Tips để giữ lightweight

**Bad example:**

```markdown
<!-- 5000 dòng rules chi tiết -->
## Cách viết TypeScript
- Variable name: camelCase
- Function name: bắt đầu bằng động từ
- Interface name: không bắt đầu bằng I
...（tiếp tục mãi）
```

**Good example:**

```markdown
<!-- Chỉ essential rules -->
## Output style
- Chỉ viết OpenAPI schema (không cần curl)
- Diagram dùng Mermaid notation
- Ưu tiên giải thích algorithm thay vì sample code
```

**Điểm quan trọng:**
- Được include vào prompt mỗi lần → cần lightweight
- Coding conventions chi tiết để Linter/Prettier lo
- Chỉ focus vào "muốn thay đổi output của Copilot"

### 5. Lưu ý khi vận hành thực tế

| Lưu ý | Giải pháp |
|-------|-----------|
| **Prompt quá dài** | Chỉ giữ essential rules (mục tiêu: dưới 200 dòng) |
| **Rules mâu thuẫn** | Review định kỳ, xóa rules không cần |
| **Khó thấy effect** | Record before/after bằng screenshot |

---

## Tổng kết

### Tại sao nên dùng copilot-instructions.md

1. **Review time giảm drastically**
   - Bớt thông tin thừa, focus vào bản chất
   - No1 (API design): 430 dòng → 150 dòng (giảm 65%)
   - No2 (Process flow): 1400 dòng → 370 dòng (giảm 74%)

2. **Output consistent**
   - Toàn team làm việc với cùng style
   - Không phải comment "ngắn gọn hơn" nhiều lần

3. **Lightweight và dễ đưa vào**
   - Chỉ cần tạo `.github/copilot-instructions.md`
   - Viết rules bằng ngôn ngữ tự nhiên

### Bắt đầu từ hôm nay

**Step 1: Tạo file**
```bash
mkdir -p .github
touch .github/copilot-instructions.md
```

**Step 2: Viết rule đầu tiên**
```markdown
# Output style

- Chỉ viết OpenAPI schema (không cần curl, implementation)
- Diagram dùng Mermaid notation
- Ưu tiên giải thích algorithm thay vì sample code
```

**Step 3: Dùng Copilot Agent**

VS Code → `Cmd+Shift+P` → "GitHub Copilot: Open Chat"

### Tài liệu tham khảo

- [Official docs: Copilot Workspace Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot#about-custom-instructions-for-github-copilot)
- [GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/overview)

---

## Kết luận

copilot-instructions.md là công cụ mạnh mẽ để customize output của GitHub Copilot Agent theo ý bạn.

**"Viết cùng comment 3 lần → thêm vào copilot-instructions.md"**

Chỉ với rule đơn giản này, bạn sẽ thoát khỏi sự mệt mỏi của review và productivity tăng đáng kể.

Hãy thử áp dụng vào project của bạn từ hôm nay!

---

**Tags**: #GitHubCopilot #生成AI #copilot-agent #vscode #開発効率化
