---
title: "Spec-Driven Development Thân Thiện Với Mắt: Hiệu Ứng Blueberry của spec-workflow-mcp"
date: 2025-12-04T20:00:00+09:00
categories: ["Development", "AI and Machine Learning", "DevOps and Infrastructure"]
tags: ["AI", "LLM", "Claude", "SDD", "Spec-Driven Development", "MCP", "spec-workflow-mcp", "Developer Experience"]
author: "su8 (denchu)"
translatedBy: "日平"
description: "Giới thiệu spec-workflow-mcp - công cụ Spec-Driven Development với dashboard trực quan giảm tải review, tăng cường trải nghiệm developer trong kỷ nguyên AI coding"
---

## Giới Thiệu

Xin chào! Tôi là su8 ([@__su888](https://x.com/__su888)), còn được biết đến với nickname "denchu" (電柱 - cột điện). Hiện tại, tôi đang làm Software Engineer tại **バクラク勤怠チーム** (Bakuraku Attendance Team) của LayerX.

Bài viết này là phần đóng góp của tôi cho **LayerX Tech Advent Calendar 2025 - Day 2**. Ngày đầu tiên có hai bài viết tuyệt vời từ [@frkake](https://x.com/frkake) về "OCR技術の変遷と日本語対応モデルの性能検証" và [@izumin5210](https://x.com/izumin5210) về "思考を減らしコードに集中するための tmux, Neovim 設定".

### Về Tác Giả

Tôi có niềm đam mê với... cột điện (thật đấy!) và là một fan cuồng của Clannad (クラナドは人生). Hiện tại trong team của tôi, có một loại blueberry supplement đang rất phổ biến, được đồn đại có khả năng mang lại thị lực phi thường như bộ lạc Maasai (視力 3.0～12.0, thậm chí có người đạt 12.0!).

### Mục Đích của Bài Viết

Trong bài viết này, tôi sẽ giới thiệu về **[spec-workflow-mcp](https://github.com/Pimzino/spec-workflow-mcp)** - một công cụ có thể được xem như "blueberry cho Spec-Driven Development (SDD)". Giống như blueberry giúp mắt khỏe mạnh hơn, spec-workflow-mcp giúp việc review specifications trở nên dễ chịu hơn nhiều cho đôi mắt của developer.

**Cấu trúc bài viết:**
1. **AI Coding時代の「見えない問題」** - Các vấn đề vô hình trong kỷ nguyên AI Coding
2. **仕様駆動開発という回答** - Spec-Driven Development như một giải pháp
3. **spec-workflow-mcpの差別化要素** - Điểm khác biệt của spec-workflow-mcp
4. **実践例** - Ví dụ thực tế với TODO app
5. **ブルーベリー効果** - Hiệu ứng Blueberry giải quyết các vấn đề

**Easter Egg:** Trong bài viết, giữa những "Blueberry" có một "Halle Berry" đang lẩn khuất. Hãy thử tìm xem (đừng dùng chức năng search nhé)!

## AI Coding: Những Vấn Đề "Vô Hình"

### Bối Cảnh: Andrej Karpathy và "Vibe Coding"

Vào **ngày 3 tháng 2 năm 2025**, Andrej Karpathy (đồng sáng lập OpenAI, cựu AI Leader của Tesla) đã tweet về một phong cách coding mới:

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists. It's possible because the LLMs (e.g. Cursor Composer w Sonnet) are getting too good."

**"Vibe Coding"** - phong cách này được định nghĩa là:
- **Hoàn toàn phó mặc cho cảm giác** (fully give in to the vibes)
- **Chấp nhận khả năng mở rộng theo cấp số nhân** (embrace exponentials)
- **Quên luôn sự tồn tại của code** (forget that the code even exists)

Cách tiếp cận:
- Chấp nhận tất cả suggestions của AI
- Copy & paste error messages trực tiếp cho AI để sửa
- Không cần đọc kỹ code được generate

### Sự Đảo Ngược: nanochat Project

Tuy nhiên, chỉ **8 tháng sau (14 tháng 10 năm 2025)**, chính Karpathy đã thừa nhận giới hạn của phương pháp này. Project [nanochat](https://github.com/karpathy/nanochat) của ông được implement **hoàn toàn bằng tay**:

> "Good question, it's basically entirely hand-written (with tab autocomplete). I tried to use claude/codex agents a few times but they just didn't work well enough at all and net unhelpful, possibly the repo is too far off the data distribution."

**Phân tích:**
- "Hoàn toàn viết tay (với tab autocomplete)"
- Đã thử Claude/Codex agents nhiều lần nhưng "không hoạt động tốt và không hữu ích"
- **Nguyên nhân:** Repository này "nằm ngoài data distribution" của LLM

**Technical Limitation được chỉ ra:**
LLM có **bias trong training data**. Với các architecture hoặc domain độc đáo, nằm ngoài data distribution, AI agents không thể hoạt động hiệu quả.

### Ba Vấn Đề Cấu Trúc

Karpathy chỉ ra giới hạn kỹ thuật, nhưng đó chỉ là **"phần nổi của tảng băng"**. Ngay cả khi AI có thể generate code hoàn hảo, vẫn tồn tại **những vấn đề cấu trúc trong development process**.

Ba vấn đề sau đây **không phải do giới hạn kỹ thuật của AI**, mà **nội tại trong Vibe Coding style**:

#### 1. 意図の喪失 (Intent Loss) - Mất Mát Ý Định

**Vấn đề:**
Ngay khi prompt generate code, **developer intent không được ghi lại ở đâu cả**.

**Ví dụ cụ thể:**

```
Prompt ban đầu:
"カート内の在庫切れ商品をユーザーに通知する"
(Notify user về sản phẩm hết hàng trong cart)

↓ AI generates code

Vài ngày sau...

Bug report: "在庫切れ商品の決済エラー" (Payment error với sản phẩm hết hàng)

↓ Investigation

True intent (phát hiện sau khi lục Slack):
"通知して、カート内からの在庫切れ商品の自動削除"
(Notify VÀ tự động xóa sản phẩm hết hàng khỏi cart)
```

**Hậu quả:**
- Prompt gốc không còn tồn tại
- Phải lục Slack messages để tìm lại intent
- Nếu có **explicit specification**, vấn đề này có thể tránh được

#### 2. 進捗の不透明性 (Progress Opacity) - Tiến Độ Mờ Mịt

**Vấn đề:**
Khi giao implementation cho AI, **progress không thể quan sát từ bên ngoài**.

**Tình huống:**

```
PM: "認証機能の進捗は？" (Authentication feature progress?)
Dev: "AIが実装中です" (AI đang implement)
PM: "...具体的には？" (Cụ thể thế nào?)
Dev: "...わかりません" (Không biết)
```

**Hậu quả:**
- Developer không nắm được "hoàn thành tới đâu" và "còn gì cần làm"
- **Traditional tools** (Jira, GitHub Issues) **diverge** khỏi AI agent workflow
- Không ai update tickets vì AI không tích hợp với tools
- Progress becomes **black box**

#### 3. レビューの困難さ (Review Difficulty) - Khó Khăn Khi Review

**Vấn đề:**
Khi review AI-generated code, **không có tiêu chuẩn rõ ràng**.

**Scenario:**

```
Reviewer: "なぜこのタイミングで在庫を確保するのか？"
          (Tại sao lại reserve inventory tại timing này?)

Developer: "AIがそう実装したので..."
           (Vì AI implement thế...)

Reviewer: "...要求仕様は？"
          (Requirement spec ở đâu?)

Developer: "...Slackに散在しています"
           (Rải rác trong Slack)
```

**Hậu quả:**
- Requirements **rải rác trong Slack/口頭** (verbal)
- Reviewer **chỉ có thể đoán** (guess)
- Có thể comment về **variable names**, nhưng không thể verify **business logic validity**
- Review trở thành **形式的** (formality) thay vì **実質的** (substantial)

### Kết Luận về Vấn Đề

Ba vấn đề này không phải do AI chưa đủ giỏi. Ngay cả khi AI hoàn hảo, **development process thiếu structure** vẫn gây ra những vấn đề này.

## Spec-Driven Development: Câu Trả Lời

### Định Nghĩa SDD

**Spec-Driven Development (SDD)** là câu trả lời cho những vấn đề trên:

> **Core Concept:** Viết specification TRƯỚC KHI viết code, và sử dụng spec đó làm **"Single Source of Truth"** cho cả người và AI.

**GitHub's Perspective:**
> "私たちは『コードが真実の源泉』から『意図が真実の源泉』へと移行している"  
> "Chúng ta đang chuyển từ 'code is source of truth' sang 'intent is source of truth'"

**Paradigm Shift:**
- **Cũ:** Developer's job = Viết code
- **Mới:** Developer's job = Làm rõ intent (意図を明確にする)

### Ba Mức Độ Trưởng Thành của SDD

Theo phân tích của **Birgitta Böckeler** trên Martin Fowler's blog, SDD có 3 levels:

| Level | Approach | Spec Handling |
|-------|----------|---------------|
| **Spec-First** | • Tạo spec trước implementation<br>• Sử dụng trong AI workflow | • Edit cả spec và code<br>• **Discard spec sau khi hoàn thành** |
| **Spec-Anchored** | • **Giữ spec sau khi hoàn thành**<br>• Dùng liên tục cho evolution & maintenance | • Spec là **long-term artifact**<br>• Improve spec khi evolve |
| **Spec-as-Source** | • Spec là main source<br>• Con người CHỈ edit spec | • Code là "generated - do not edit"<br>• Hiện chỉ **Tessl Framework** hướng tới |

#### Tại Sao Spec-Anchored Là Lựa Chọn Thực Tế?

**Lý do 1: Spec-First không giải quyết "Intent Loss"**
- Spec bị discard sau khi hoàn thành
- 2 tháng sau nhìn code: "Tại sao implement như này?" → Không có câu trả lời

**Lý do 2: Spec-as-Source chưa mature**
- Constraint "không được edit code" quá strict
- Nhiều team không thể chấp nhận limitation này
- Cần đợi tools mature hơn

**Lý do 3: Spec-Anchored cân bằng tốt nhất**
- **Preserve intent:** Spec được giữ lại → 6 tháng sau vẫn hiểu "why"
- **Flexibility:** Vẫn có thể edit code trực tiếp
- **Evolution-friendly:** Spec được improve theo thời gian
- **Practical:** Phù hợp với workflow hiện tại của hầu hết teams

### SDD ≠ Waterfall: Sự Khác Biệt Cốt Lõi

Câu hỏi phổ biến: **"Có phải quay về Waterfall?"**

**Trả lời: KHÔNG.** Khác biệt cốt lõi nằm ở **positioning và cách update spec**.

#### Bảng So Sánh

| Aspect | Spec-Driven Development | Waterfall |
|--------|------------------------|-----------|
| **基本思想** | • Spec (contract) là source of truth<br>• Implementation/test/docs follow spec | • Complete phases tuần tự<br>• Requirements → Design → Implementation → Test |
| **仕様の扱い** | • **Living artifact**<br>• Designed to change | • Tends to **freeze**<br>• Changes require procedures & cost |
| **進め方** | • **Iteration & parallelism** assumed<br>• Cycle: Spec → Impl → Test → Update Spec | • **Serial** assumed<br>• Quality/progress managed at phase gates |
| **Feedback** | • **Early feedback to spec**<br>• Use mocks/stubs/contract tests | • Working software **comes late**<br>• Feedback delayed |
| **変更耐性** | • **Changes expected**<br>• Compatibility rules built-in | • Changes treated as **exceptions**<br>• Handled as plan changes/rework |
| **Test位置** | • **Continuous verification** with contract tests<br>• Auto-check spec compliance | • Integration/acceptance **come late**<br>• Spec mismatches discovered late |

#### Metaphors (Ẩn Dụ)

**Spec-Driven Development:**
> Spec là **"compass + map được update dần dần"** (漸進的に更新されるコンパス+地図)  
> Development process **circulates** (循環) xung quanh living spec này

**Waterfall:**
> Spec là **frozen blueprint** (凍結された設計図)  
> Development process **flows serially** (直列に進む) qua các phases

#### Key Difference

Waterfall cũng có "requirements definition & basic design" (tương đương spec). Nhưng:

> **"仕様がある ≠ 仕様駆動"**  
> "Having spec ≠ Spec-Driven"

**Spec-Driven essence:**
- **Continuously update** spec
- Đặt spec trong **"形 (form) mà có thể force spec compliance"** qua CI/test/generation

**AI Coding era SDD:**
- AI generates implementation từ spec
- AI compares results với spec
- AI reflects spec changes vào implementation **instantly**
- Cycle này chạy **high-speed**
- Hoàn toàn khác với Waterfall's "implementation starts after design complete" serial process

### Vấn Đề Chung của Existing SDD Tools

#### "レビューつらみて国立公園" (Review Pain & National Parks)

Các tools implement SDD đang tăng nhanh: **AWS Kiro**, **GitHub Spec Kit**, **cc-sdd**, etc.

Nhưng chúng có **common issue**: **Review負荷の増大** (Tăng tải review).

**Analysis từ Birgitta Böckeler (Martin Fowler's blog):**

**Kiro Example:**
> Muốn sửa bug nhỏ → Workflow như "ハンマーでクルミを割る" (crack walnut với hammer)  
> Requirements document biến bug nhỏ thành **4 user stories** + **16 acceptance criteria tổng cộng**

**Spec Kit Example:**
> Large volumes Markdown files được generate  
> Chúng **overlap** lẫn nhau và với existing code  
> Author's candid admission:  
> **"正直なところ、私はこれら全てのMarkdownファイルをレビューするより、コードをレビューしたい"**  
> (Thật lòng, tôi muốn review code hơn là review tất cả các Markdown files này)

#### Core Issue

> SDD philosophy tuyệt vời, nhưng implementation dưới dạng **text-based Markdown files rải rác** làm **review experience tệ đi**.

Developers không trở thành developers để **đọc large volumes documents** (大量の文書を読むため).

**Simple expression:**
> "まあ要するに「目に優しくない」のである"  
> "Nói chung là **không thân thiện với mắt**"

## spec-workflow-mcp: Differentiation Elements

### Core Concept

> **"「目に優しい」- このひとことに尽きる"**  
> **"Thân thiện với mắt" - Câu này nói lên tất cả**

### Key Feature: Real-time Web Dashboard

Thay vì đọc text files, bạn mở **Web browser**, và **dashboard hiển thị visual overview** toàn bộ project.

**Dashboard này chính là core của "Blueberry Effect" mà spec-workflow-mcp mang lại.**

### Dashboard Features Overview

| Feature | Details |
|---------|---------|
| **Project Overview** | • List tất cả specs<br>• Status của mỗi spec<br>• **Real-time updates** |
| **Document Viewer** | • **Structured display** Requirements/Design/Tasks<br>• Access Steering Documents<br>• **Markdown rendering** |
| **Task Progress Tracking** | • **Visual progress bars**<br>• Detailed status (pending/in-progress/completed)<br>• **Dependency visualization** |
| **Implementation Log** | • **Searchable log** của tất cả task implementations<br>• **Code statistics** (lines added/modified/deleted) |
| **Approval Workflow** | • **Review integration**<br>• **Feedback loops** |

Ở giai đoạn này, bạn có thể nghĩ "ほう？" (Hm?). Hãy xem actual dashboards phía dưới để cảm nhận rõ hơn.

## Practical Example: Development Flow với Dashboard

### Scenario

**Base Application:**
- Simple Next.js TODO app (đã hoạt động)
- Basic features đã implement:
  - Add tasks (タスクの追加)
  - Edit (編集)
  - Delete (削除)
  - Complete (完了)
- **Implemented bởi:** Opus 4.5 (戦闘力530000 - power level 530,000!)

**New Feature Request:**
> "各タスクに期限を設定し、期限切れタスクを目立つようにする"  
> Add due dates to tasks và highlight overdue tasks

### Setup

**Version:** Sử dụng `v2.0.9` (vì tool được update thường xuyên)

#### 1. Start Dashboard

**npm:**
```bash
npx -y @pimzino/spec-workflow-mcp@v2.0.9 --dashboard
```

**pnpm:**
```bash
pnpm dlx @pimzino/spec-workflow-mcp@v2.0.9 --dashboard
```

**Port:**
- Default: `5000`
- Custom: `--port [任意のポート番号]`

Terminal sẽ show: `Dashboard started at: http://localhost:5000`

Mở browser → empty dashboard xuất hiện.

#### 2. Register MCP Server

**Add project to spec-workflow-mcp:**

```bash
cd [プロジェクトのパス]
current_path=$(pwd)
claude mcp add spec-workflow npx @pimzino/spec-workflow-mcp@v2.0.9 -- "$current_path"
```

**Lưu ý:** MCP server chưa start → dashboard chưa show project.

**Start MCP server:** Launch Claude Code tại project path → project xuất hiện trong dashboard.

#### 3. Multi-Project Support

Dashboard có **toggle ở header** → có thể select/display multiple projects.

**Workflow:**
1. Register MCP server cho multiple projects
2. Launch Claude Code cho mỗi project
3. **Single dashboard** manages tất cả projects

**Feature history:** Supported từ [PR merged November 2025](https://github.com/Pimzino/spec-workflow-mcp/pull/124). 実に嬉しい機能追加 (Really happy feature addition)!

#### Architecture Diagram

```
┌─────────────────────────────────────┐
│      Dashboard Process (Port 5000)  │
│      - Web UI                       │
│      - WebSocket Server             │
└────────────┬────────────────────────┘
             │ WebSocket
             ↓
┌─────────────────────────────────────┐
│      MCP Server (per project)       │
│      - Spec management              │
│      - Task tracking                │
│      - Approval workflow            │
└────────────┬────────────────────────┘
             │ Tool calls
             ↓
┌─────────────────────────────────────┐
│      Claude Code (AI Agent)         │
│      - User interaction             │
│      - Code generation              │
└─────────────────────────────────────┘
```

### Phase 1: Steering - プロジェクト方針の文書化

**Purpose:** Define **project-wide policies, constraints, và guidelines**.

**Prompt to Claude Code:**
```
このTODOアプリプロジェクトのsteering documentsを作成して
```

**Process:**
1. spec-workflow-mcp tools được invoke
2. Approval requests cho từng document
3. Review trong dashboard

**Documents Created:**
- `product.md` - Product vision
- `tech.md` - Technical standards
- `structure.md` - Code organization

**Location:** `.spec-workflow/steering/`

#### Approval Workflow

**Review Features:**

1. **Text Selection + Comment**
   - Select specific text
   - Add targeted feedback
   - Useful cho specific issues

2. **General Comment**
   - Comment for overall document
   - Useful cho document-wide feedback

**Feedback Options:**

After adding comments, choose:

```bash
# Option 1: Request modification
"レビューしました。コメントに基づき修正を実施してください。"

# Option 2: Discuss approach first
"レビューしました。修正を実施する前に、まずは方針を相談したいです。"
```

**Completion:**
- Click "即時承認" (Instant Approval)
- Inform Claude Code
- Workflow complete

#### Blueberry Effect Already Visible

> ここまでの流れですでに「ブルーベリー」の効果を実感できる  
> Đã có thể cảm nhận "Blueberry" effect từ flow này rồi!

**Why?**
- Editor markdown preview có thể làm
- Nhưng **request modifications là công việc mệt mỏi**
- Dashboard giảm workload này **dramatically**

**Check Raw Data:**
Nếu muốn xem Markdown raw → files ở `.spec-workflow/steering/`:
- `product.md`
- `tech.md`
- `structure.md`

### Phase 2: Requirements - 期限設定機能の要件定義

**Prompt:**
```
期限設定機能のspecを作成してください
```

**Document Created:** `requirements.md`

**Format:** **EARS** (Easy Approach to Requirements Syntax)

#### EARS Background

- **Developer:** Alistair Mavin + team (Rolls-Royce PLC)
- **Year:** 2009
- **Purpose:** Reduce ambiguity/contradictions trong natural language requirements

**EARS Template Structure:**

```
WHEN [condition]
THEN [system behavior]
SHALL [requirement level]
```

#### Example Requirements

**Requirement 1: 期限日時の設定**

**User Story:**
> TODO作成・編集時にユーザーとして、タスクに期限日時を設定したい。そうすることで、いつまでにタスクを完了すべきかを明確にできる。

**Acceptance Criteria:**
```
WHEN ユーザーがTODO作成フォームを開く
THEN システムは期限日時入力フィールドを表示する
SHALL

WHEN ユーザーが期限日時を入力せずにTODOを作成する
THEN システムは期限なしのTODOを作成する
SHALL

WHEN ユーザーが有効な期限日時を入力してTODOを作成する
THEN システムは期限付きのTODOを作成し、ローカルストレージに保存する
SHALL

WHEN ユーザーが既存のTODOを編集する
THEN システムは現在の期限日時を入力フィールドに表示する
SHALL

WHEN ユーザーがTODO編集時に期限日時を変更する
THEN システムは新しい期限日時でTODOを更新する
SHALL

WHEN ユーザーがTODO編集時に期限日時をクリアする
THEN システムは期限なしの状態に更新する
SHALL
```

**Learning Point:**
> 初見では面喰らうような見た目であるが、慣れてしまえば読みやすい  
> Lần đầu nhìn có thể bối rối, nhưng quen rồi thì dễ đọc

**Utility:**
> エンジニアリングの道具箱の一つとして所持しておくと、いつか身を助けるかもしれない  
> Keep trong engineering toolbox → có thể giúp bạn someday

**After Review:** Approve khi ready → proceed to next phase.

### Phase 3: Design - 技術設計

**Prompt:**
```
designフェーズを進めてください
```

**Note:** Depending on session, có thể tự động proceed sau requirements approval.

**Document Created:** `design.md`

**Workflow:** Same approval process như phases trước.

### Phase 4: Tasks - 実装タスクの分解

**Prompt:**
```
タスクを生成してください
```

**Document Created:** `tasks.md`

**Dashboard Display:**
- Click "タスク" menu
- View all tasks list
- Visual progress overview

### Phase 5: Implementation & Progress Tracking

**Key Feature:** Dashboard's **true value** shines here!

#### Task Instruction Method

**From Dashboard:**
1. Click task
2. Copy **auto-generated instruction prompt**
3. Paste vào Claude Code

**Example Generated Prompt:**
```
Implement the task for spec due-date-feature, first run spec-workflow-guide 
to get the workflow guide then implement the task: 
Role: TypeScript Developer specializing in type systems | 
Task: Extend the Todo interface in src/types/todo.ts to add optional dueDate 
field (string in ISO 8601 format) and update TodoInput type to include dueDate, 
following requirement 1 (期限日時の設定) from requirements.md | 
Restrictions: Do not modify existing fields, maintain backward compatibility 
with existing Todo data, dueDate must be optional, follow existing ISO 8601 
pattern used in createdAt and updatedAt | 
Leverage: Existing Todo interface pattern, ISO 8601 date handling utilities
```

#### Status Tracking

Tasks have 3 states:
- **保留中** (Pending)
- **進行中** (In Progress) - Currently working
- **完了** (Completed)

Dashboard shows:
- Current task status
- **Visual progress bar**
- Summary at top

#### Psychological Effect

> この進捗の可視化は、単なる見た目の問題ではない。心理的な効果がある  
> Progress visualization không chỉ là visual - có **psychological effect**

**Why it matters:**
- **無し:** Working mà không thấy gì → anxiety (不安)
- **有り:** Progress bar dần fill → **achievement feeling** (達成感)
- **Result:** **Motivation maintained** (モチベーションが維持される)

#### Batch Implementation

```
Task1 ~ Task8をまとめて実装してください
```
→ Có thể instruct multiple tasks cùng lúc

#### Diff Review Tool Recommendation

**[difit](https://github.com/yoshiko-pg/difit)** - Highly recommended!

```bash
npx difit .
```

**Benefits:**
- **Excellent visibility** (視認性に優れ)
- **Comment aggregation** (コメントをまとめて整理)
- **Very convenient** (とても便利)

**Workflow:**
1. Run difit
2. Review changes
3. Organize feedback
4. Paste vào Claude Code → request fixes

#### Result

After all tasks complete → **期日機能が追加されていた** (due date feature added)!

> ハル・ベリーのように美しい  
> Beautiful like Halle Berry!

(Found it! 🎉)

### Implementation Log

**Menu:** "実装ログ" (Implementation Log)

**Features:**
- Task implementation history
- **Searchable**
- **Code statistics**
- Intuitive UI (self-explanatory)

### Spec Changes Handling

**Real development scenario:** During verification → "こうしたほうがいいかも？" (Maybe better this way?)

**Approach:**
- Instruct MCP server about spec change
- Spec được update
- Design và tasks cũng được update accordingly
- Maintain consistency across all documents

## Blueberry Effect: Solving the Problems

Hãy revisit 3 vấn đề ban đầu và xem spec-workflow-mcp giải quyết như thế nào:

### 1. 意図の喪失 → 意図の永続化 (Intent Loss → Intent Persistence)

**Solution:**
Requirements và Design được save trong `.spec-workflow/`

**Effect:**
- **"なぜこの実装なのか"** được permanentize (永続化)
- 6 tháng sau read spec → **instantly understand** design intent
- No more Slack archaeology

### 2. 進捗の不透明性 → 進捗の可視化 (Progress Opacity → Progress Visualization)

**Solution:**
Real-time dashboard với **task progress bars**

**Effect:**
- **"どこまで進んでいるか"** một mắt nhìn thấy (一目瞭然)
- PM hỏi progress → có thể answer **구체적に** (specifically)
- No more black box development

### 3. レビューの困難さ → レビュー体験の改善 (Review Difficulty → Review Experience Improvement)

**Solution:**
Web dashboard với:
- **Structured preview**
- **Annotation functionality**

**Effect:**
- From "テキストファイルの羅列" (text file mess)
- To "快適な閲覧体験" (comfortable viewing experience)
- Có thể verify **business logic validity** như intended review purpose

### Essence of spec-workflow-mcp

> spec-workflow-mcpの本質は、情報の提示方法が開発体験そのものを変えるという点にある  
> **Essence:** Cách present information **transforms development experience itself**

**Contrast:**
- ❌ **Editor:** Opening `.md` → **義務感** (sense of obligation)
- ✅ **Dashboard:** Viewing spec in browser → **自然な動機** (natural motivation)

**Result:**
> この違いが、SDDを実践可能な手法へと変える  
> Sự khác biệt này biến SDD thành **practical methodology**

### Metaphor

> まさしく、ブルーベリー。King of マサイ族と言えよう  
> Exactly - **Blueberry**. Có thể gọi là **King of Maasai Tribe**!

> 見える、見えるぞ。  
> **Nhìn thấy, nhìn rõ được.**

## MCP Tools Catalog (Reference)

spec-workflow-mcp cung cấp các tool categories (không cần nhớ - MCP server tự quyết định):

| Category | Tool | Description |
|----------|------|-------------|
| **Workflow Guides** | spec-workflow-guide | Full SDD workflow guide |
|  | steering-guide | Steering doc creation & management guide |
| **Document Creation** | create-spec-doc | Create new spec document |
|  | create-steering-doc | Create new steering document |
| **Context Loading** | get-spec-context | Load spec context |
|  | get-steering-context | Load steering context |
|  | get-template-context | Load template context |
| **Status Management** | spec-list | List spec documents |
|  | spec-status | Check spec status |
|  | manage-tasks | Task management & tracking |
| **Approval Workflow** | request-approval | Send approval request |
|  | get-approval-status | Check approval status |
|  | delete-approval | Delete approval request |

## Additional Features

### VSCode Extension

spec-workflow-mcp cũng provides **VSCode extension** ngoài Web dashboard.

→ Nếu interested, hãy thử!

### Comparison với Other Tools

Có comparison articles chi tiết elsewhere.

**Focus của bài này:**
> spec-workflow-mcpの特異性として「ブルーベリー」効果を理解してもらえれば本懐  
> Hiểu "Blueberry" effect như differentiation của spec-workflow-mcp là đủ

## Kết Luận

> おまえもマサイ族にならないか。  
> **Bạn cũng muốn trở thành Maasai tribe member không?**

以上、お読みくださりありがとうございました。

**LayerX Tech Advent Calendar** まだまだ続きます！

Các bài viết tới nay đều tuyệt vời, và các bài sau này cũng rất đáng期待 (đáng mong chờ)!

---

## LayerX Recruitment

すべての経済活動を、デジタル化する。

**Đang tìm kiếm đồng đội cùng thử thách!**

- [LayerX 採用情報](https://jobs.layerx.co.jp/)
- [LayerX OpenDoor - Casual Interview Page](https://jobs.layerx.co.jp/opendoor)

---

**Tác giả:** su8 (denchu) - [@__su888](https://x.com/__su888)  
**Company:** LayerX - バクラク勤怠チーム  
**Tagline:** 渉猟の民 (Hunter-gatherer of information)  
**Interests:** クラナドは人生。電柱が好き。  
**Dịch giả:** 日平  
**Nguồn gốc:** [Zenn - LayerX](https://zenn.dev/layerx/articles/60b46a2e9ac94e)
