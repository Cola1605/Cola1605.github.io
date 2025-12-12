---
title: "Ngăn Chặn CLAUDE.md Phình To! Phương Pháp Tải Rules Động Với .claude/rules/"
date: 2025-12-11
draft: false
slug: "zenn-claude-code-dynamic-rules"
description: "Hướng dẫn sử dụng .claude/rules/ để tải rules động, ngăn chặn CLAUDE.md phình to, tối ưu context và áp dụng nhiều rules đồng thời trong Claude Code."
tags: ["Claude", "Claude Code", "AI-driven Development", "Context Management", "Rules", "Modular Configuration", "Best Practices"]
categories: ["AI and Machine Learning", "Development"]
author: "とまだ (tmasuyama1114)"
---

# Ngăn Chặn CLAUDE.md Phình To! Phương Pháp Tải Rules Động Với .claude/rules/

## Tóm Tắt Cho Người Bận Rộn

4 điểm chính của bài viết này:

• `.claude/rules/` là tính năng modular rule để ngăn chặn CLAUDE.md phình to  
• Rules không có `paths` được load khi khởi động, rules có `paths` được load động khi thao tác file đích  
• Rules đã load một lần không bị load lại (hiệu quả context ◎)  
• Có thể áp dụng đồng thời nhiều rules (TypeScript + API rules, v.v.)

**Tác giả**: とまだ (tmasuyama1114)  
**Ngày công khai**: 11 tháng 12, 2025  
**Tags**: AI, Context, Claude, AI-driven Development, Claude Code

---

## Giới Thiệu Tác Giả

**とまだ@Nhà Giáo Dục AI-driven Development**

- Thực hành viên AI-driven development với Claude Code・Cursor・Codex
- Nghề chính: Freelance engineer, cố vấn triển khai AI-driven development cho doanh nghiệp
- Vận hành cộng đồng [Vibe Coding Studio](https://www.vibecodingstudio.dev/community) nơi mọi người học AI-driven development tập trung
- Triển khai [nhiều khóa học bestseller](https://www.vibecodingstudio.dev/coupons) về AI-driven development trên Udemy
- Diễn thuyết tại [Tokyo AI Festival Pre-event](https://ai-fest-tokyo.connpass.com/event/369543/)
- Kinh nghiệm giảng dạy hơn 100 người với tư cách giảng viên trường lập trình
- Cư trú tại Canada

**SNS**:
- [X (Twitter)](https://x.com/muscle_coding)
- [YouTube](https://www.youtube.com/@vibe-coding-studio)
- [Qiita](https://qiita.com/tomada)
- [Zenn](https://zenn.dev/tmasuyama1114)

---

## Vấn Đề CLAUDE.md Phình To Là Gì

CLAUDE.md là tính năng tiện lợi. Nếu viết các quy tắc và quy ước riêng của project, Claude Code sẽ làm việc dựa trên đó.

Tuy nhiên, nếu cứ viết mọi thứ vì tiện lợi, trước khi biết nó đã phình to.

Quy ước coding, cách viết test, quy tắc thiết kế API, yêu cầu bảo mật... Khi project phát triển, CLAUDE.md cũng phình to theo.

### Bản Chất Vấn Đề

Và vấn đề là, **nội dung CLAUDE.md được đọc toàn bộ vào context khi khởi động**.

Tức là, rules TypeScript, rules Markdown, rules API, tất cả đều chiếm dụng context. Chỉ đang chỉnh sửa README thôi mà rules TypeScript vẫn sử dụng context... Thật lãng phí phải không?

Nếu ví với đầu người, **giống như khi đang chơi game mà việc công ty vẫn ở lại trong đầu**.

### Nhu Cầu Người Dùng

"Chỉ muốn load rules cần thiết vào thời điểm cần thiết"

Tính năng `.claude/rules/` đáp ứng nhu cầu đó.

---

## .claude/rules/ Là Gì

`.claude/rules/` là tính năng modular rule để quản lý CLAUDE.md bằng cách phân chia.

### Cấu Trúc Thư Mục Cơ Bản

Đầu tiên hãy xem cấu trúc folder cơ bản. Dưới đây là ví dụ về cấu trúc file được đặt tại thư mục gốc project.

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # Chỉ thị chính (giữ tối thiểu)
│   └── rules/
│       ├── code-style.md   # Code style
│       ├── testing.md      # Quy ước test
│       └── security.md     # Yêu cầu bảo mật
```

File `.md` đặt dưới `.claude/rules/` tự động được nhận dạng là project memory. Ngay cả khi tạo subdirectory, vẫn được phát hiện đệ quy nên có thể tổ chức bằng folder như `frontend/` hay `backend/`.

Anthropic chính thức cũng đề cập như một trong những best practice.

### Rules Có Điều Kiện Với Chỉ Định paths

Đây là phần chính.

Khi chỉ định `paths` bằng YAML frontmatter trong rule file, **rules chỉ được load khi thao tác file cụ thể**.

```markdown
---
paths: src/api/**/*.ts
---

# Rules Phát Triển API

Viết nội dung như sau trong rule này.

- Tất cả API endpoint bắt buộc có input validation
- Sử dụng định dạng error response chuẩn
```

Với cài đặt này, rule này chỉ được thêm vào context khi chạm vào file TypeScript dưới `src/api/`.

#### Đặc Tả Hoạt Động Quan Trọng

| Chỉ định paths | Timing load | Tiêu thụ context |
|----------------|-------------|------------------|
| **Không có** | Load ngay lập tức khi khởi động | Tiêu thụ luôn |
| **Có** | Load động khi thao tác file đích | Chỉ tiêu thụ khi cần |

Rules không có chỉ định paths được load khi khởi động giống CLAUDE.md truyền thống. Ngược lại, rules có chỉ định paths không được load cho đến khi cần thiết nên tiết kiệm context.

### Cách Viết Glob Pattern

Có thể sử dụng Glob pattern trong field `paths`.

| Pattern | Mô tả |
|---------|-------|
| `**/*.ts` | File TypeScript ở mọi directory |
| `src/**/*` | Mọi file dưới src/ |
| `*.md` | Chỉ file Markdown ở thư mục gốc project |
| `src/components/*.tsx` | React component ở directory cụ thể |

#### Chỉ Định Nhiều Pattern

Khi muốn chỉ định nhiều pattern, có thể dùng brace expansion hoặc phân cách bằng dấu phẩy.

```yaml
---
paths: src/**/*.{ts,tsx}
---
```

```yaml
---
paths: {src,lib}/**/*.ts, tests/**/*.test.ts
---
```

---

## Thực Tế Xác Minh

Chỉ đọc tài liệu chính thức không biết liệu có thực sự load động không nên tôi đã tạo project xác minh để kiểm tra.

### Thiết Lập Môi Trường Xác Minh

Tạo test project với cấu trúc sau.

```
~/Desktop/rules-test/
├── .claude/
│   ├── CLAUDE.md              # Chỉ thị chính
│   └── rules/
│       ├── general.md         # Không chỉ định paths
│       ├── typescript.md      # paths: **/*.ts
│       ├── markdown.md        # paths: **/*.md
│       └── api/
│           └── api-rules.md   # paths: src/api/**/*.ts
├── src/
│   ├── index.ts
│   ├── utils.ts
│   └── api/
│       └── handler.ts
└── docs/
    └── readme.md
```

Để dễ hiểu rules nào được áp dụng, đã viết chỉ thị "thêm emoji ở cuối câu trả lời" trong mỗi rule file. Cụ thể là 4 cái sau.

- `general.md` (không chỉ định paths) → 🌟
- `typescript.md` (paths: **/*.ts) → 🔷TS
- `markdown.md` (paths: **/*.md) → 📝MD
- `api-rules.md` (paths: src/api/**/*.ts) → 🔌API

Với "phương thức dấu hiệu" này có thể biết rules nào đang có hiệu lực trong nháy mắt.

### Xác Minh 1: Xác Nhận Load Khi Khởi Động

Đầu tiên, khởi động Claude Code và thực thi lệnh `/memory`.

```
╭──────────────────────────────────────────────────────────────────╮
│ Select memory to edit:                                           │
│                                                                  │
│    1. User memory                Saved in ~/.claude/CLAUDE.md    │
│    2. .claude/CLAUDE.md                                          │
│  ❯ 3. .claude/rules/general.md                                   │
│    4. Project memory             Saved in ./CLAUDE.md            │
│                                                                  │
╰──────────────────────────────────────────────────────────────────╯
```

**Chỉ hiển thị `general.md` không có chỉ định paths.**

Tức là, `typescript.md` và `api-rules.md` không được load tại thời điểm này. Đây là bằng chứng của "dynamic load".

### Xác Minh 2: Xác Nhận Dynamic Load

Tiếp theo yêu cầu "đọc src/index.ts".

```
> src/index.ts を読んで

⏺ Read(src/index.ts)
  ⎿  Read 5 lines
  ⎿  .claude/rules/typescript.md   ← Dynamic load ở đây!

⏺ src/index.ts の内容です：
  // メインエントリーポイント
  export function main() {
    console.log("Hello, World!");
  }

  🌟🔷TS
```

**Output của Read tool hiển thị `.claude/rules/typescript.md`. Đây là bằng chứng đã load động.**

Và câu trả lời có cả 🌟 (general.md load thường xuyên) và 🔷TS (typescript.md load động).

### Xác Minh 3: Áp Dụng Đồng Thời Nhiều Rules

Vậy nếu đọc `src/api/handler.ts` thì sao? File này match cả `**/*.ts` và `src/api/**/*.ts`.

```
> src/api/handler.ts を読んで

⏺ Read(src/api/handler.ts)
  ⎿  Read 5 lines
  ⎿  .claude/rules/api/api-rules.md
  ⎿  .claude/rules/typescript.md

⏺ src/api/handler.ts の内容：
  // APIハンドラー
  export async function handleRequest(req: Request): Promise<Response> {
    return new Response("OK");
  }

  🔷TS🔌API🌟
```

**Kết quả như dự đoán, cả hai rules đều được load.** Và câu trả lời có cả 3 emoji: 🔷TS, 🔌API, 🌟. Như vậy đã xác nhận nhiều rules được áp dụng đồng thời.

### Xác Minh 4: Ngăn Load Trùng Lặp

Nếu đọc cùng file 2 lần thì sao?

Nếu mỗi lần đều load rules thì context sẽ bị tiêu thụ lãng phí.

```
> src/utils.ts を読んで

⏺ Read(src/utils.ts)
  ⎿  Read 5 lines   ← Không hiển thị load rule file

⏺ src/utils.ts の内容は以下の通りです：
  // ユーティリティ関数
  export function add(a: number, b: number): number {
    return a + b;
  }

  🌟🔷TS
```

**Lần 2 không có hiển thị load rule file.**

Tức là, **rules đã load một lần không bị load lại**. Đây là điểm đáng mừng từ quan điểm hiệu quả context.

Nội dung đã được triển khai trong context (Claude Code đã nhớ) nên không load lại là đương nhiên.

### Xác Minh 5: Trực Quan Hóa Tăng Context

Cuối cùng, xác nhận context tăng bao nhiêu với dynamic load.

Để xác minh, tạo thêm rule file lớn `markdown-large.md` khoảng 200KB và so sánh lượng sử dụng context bằng lệnh `/context`.

**Ngay sau khởi động**:
```
Context Usage
claude-opus-4-5-20251101 · 80k/200k tokens (40%)
```

**Sau khi load Markdown file**:
```
Context Usage
claude-opus-4-5-20251101 · 115k/200k tokens (57%)
```

**Chênh lệch**: 40% → 57% (+17%)

Context thực sự tăng do dynamic load của rule file. Và lần load thứ 2 chỉ +2% (chỉ phần hội thoại). Đây là bằng chứng ngăn load trùng lặp.

---

## Nên Dùng Khi Nào

Dựa trên kết quả xác minh đến đây, giới thiệu các pattern ứng dụng thực tế của `.claude/rules/`.

### Case 1: Phân Chia Rules Cho Frontend Và Backend

Trong project full-stack, thường muốn áp dụng rules khác nhau cho frontend và backend.

```
.claude/rules/
├── frontend/
│   ├── react.md        # paths: src/components/**/*
│   └── styles.md       # paths: **/*.css, **/*.scss
└── backend/
    ├── api.md          # paths: src/api/**/*
    └── database.md     # paths: src/db/**/*
```

Khi đang chỉnh sửa component frontend, rules backend không chiếm dụng context nữa.

### Case 2: Rules Chuyên Dụng Cho Test File

Test thường có rules riêng. Có thể tạo rules chỉ áp dụng khi chạm vào test file.

```markdown
---
paths: **/*.test.ts, **/*.spec.ts
---

# Rules Test

- Cấu trúc hóa bằng describe và it
- Sử dụng pattern AAA (Arrange-Act-Assert)
- Giữ mock ở mức tối thiểu
```

### Case 3: Rules Viết Document

Cũng tiện khi có style guide chỉ muốn áp dụng khi viết tài liệu kỹ thuật.

```markdown
---
paths: docs/**/*.md
---

# Rules Viết Document

- Tiêu đề bắt đầu bằng cụm danh từ
- Code example luôn kèm giải thích
- Hình ảnh phải có thuộc tính alt
```

---

## Lưu Ý Và Best Practices

Cuối cùng, tổng hợp các lưu ý khi sử dụng `.claude/rules/`.

Giới thiệu kết hợp cả những điểm Anthropic chính thức đề cập như best practice.

> **Best practices cho `.claude/rules/`:**
> 
> • Keep rules focused: Mỗi file nên cover một chủ đề (ví dụ: `testing.md`, `api-design.md`)  
> • Use descriptive filenames: Tên file nên chỉ ra nội dung rules  
> • Use conditional rules sparingly: Chỉ thêm `paths` frontmatter khi rules thực sự áp dụng cho loại file cụ thể  
> • Organize with subdirectories: Nhóm các rules liên quan (ví dụ: `frontend/`, `backend/`)

### 1. Một File Một Chủ Đề

`testing.md`, `api-design.md` v.v., **chỉ viết một chủ đề trong một file**. Nếu trộn nhiều chủ đề, lợi ích của dynamic load sẽ giảm.

Ngoài ra, tên file nên chỉ ra nội dung rules được viết trong file đó.

### 2. Chỉ Định paths Một Cách Hạn Chế

Không cần chỉ định paths cho tất cả rules. Bởi vì, **rules cơ bản muốn áp dụng cho toàn project, load khi khởi động không chỉ định paths đơn giản hơn**. Chỉ dùng paths cho rules thực sự chuyên dụng cho file cụ thể.

### 3. Rules Load Động Không Hiển Thị Trong /memory

Như đã xác nhận trong xác minh, rules load động không hiển thị trong danh sách lệnh `/memory`. Tuy nhiên, **có trong context**. Trạng thái "không nhìn thấy nhưng có hiệu lực" nên chú ý để không bị nhầm lẫn.

### 4. Tổ Chức Bằng Subdirectory

Khi rule file tăng lên, hãy tổ chức bằng subdirectory như `frontend/`, `backend/`, `testing/`. Vì được phát hiện đệ quy nên có thể tự do quyết định cấu trúc folder.

---

## Tổng Kết

Bài viết này giải thích về tính năng `.claude/rules/` của Claude Code. Nhìn lại các điểm chính như sau.

• **Vấn đề phình to CLAUDE.md có thể giải quyết bằng `.claude/rules/`**  
• **Tiết kiệm context bằng dynamic load với chỉ định paths**  
• **Xác nhận áp dụng đồng thời nhiều rules, ngăn load trùng lặp**

Khi quy mô project lớn lên và cảm thấy "CLAUDE.md quá dài...", hãy xem xét phân chia sang `.claude/rules/`. Bạn sẽ có thể quản lý rules thông minh với chỉ rules cần thiết được load vào thời điểm cần thiết.

---

## Quảng Cáo Một Chút: Dành Cho Những Ai Muốn Học AI-driven Development Có Hệ Thống

Như đã đề cập ở đầu, tôi đang mở nhiều khóa học AI-driven development trên Udemy và đã nhận được một số bestseller.

Đang phát hành coupon giảm tới 90% nên những ai sắp học hãy tận dụng.

Đang mở giảng nhiều khóa trong nhiều lĩnh vực như Web app, Mobile app, Python!

Ngoài ra, cộng đồng miễn phí Discord nơi những người học AI-driven development tập trung cũng có trao đổi thông tin sôi nổi.

---

**Nguồn**: [Zenn - CLAUDE.mdの肥大化を防ぐ！.claude/rules/で動的にルールを読み込む方法](https://zenn.dev/tmasuyama1114/articles/claude_code_dynamic_rules)

**Tác giả**: [とまだ@AI 駆動開発教育者](https://zenn.dev/tmasuyama1114)

**Tham khảo**: [Tweet của oikon48](https://x.com/oikon48/status/1998710902854660528?s=20)
