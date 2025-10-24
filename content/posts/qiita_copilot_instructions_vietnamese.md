---
title: "Tất cả những người đang sử dụng GitHub Copilot hãy tạo file copilot-instructions.md"
date: 2025-10-23
draft: false
categories: ["Development-Tools", "AI", "GitHub"]
tags: ["GitHub-Copilot", "AI-Assistant", "Developer-Tools", "Productivity", "Code-Generation", "Best-Practices"]
description: "Hướng dẫn sử dụng copilot-instructions.md để customize GitHub Copilot cho project của bạn, làm cho Copilot thông minh và tiện lợi hơn."
---

**Tác giả:** @TooMe  
**Tổ chức:** KDDIアジャイル開発センター株式会社 (KDDI Agile Development Center)  
**Ngày đăng:** 23/10/2025  
**Cập nhật:** 23/10/2025  
**Nguồn:** https://qiita.com/TooMe/items/873540da84567733d16b

**Event:** 生成AI開発の珍プレー好プレー大賞！（珍プレー多め）  
**Tags:** #githubcopilot #copilot-instructions.md  
**Likes:** 79 | **Stocks:** 83 | **Comments:** 0

---

## 📢 はじめに - Giới thiệu

Các bạn developers đang sử dụng **GitHub Copilot**, bạn đã tạo file `.github/copilot-instructions.md` chưa?

**Chỉ với 1 file này**, bạn có thể:
- ✅ **Customize Copilot** để phù hợp với project của bạn
- ✅ Làm cho Copilot **thông minh hơn** và **tiện lợi hơn**

Bài viết này sẽ giới thiệu **powerful features** và **cách sử dụng cụ thể** của file này.

---

## 🔍 copilot-instructions.md の紹介 - Giới thiệu về copilot-instructions.md

### 💡 Nói một cách đơn giản

**`copilot-instructions.md` là `CLAUDE.md` version dành cho GitHub Copilot.**

Nói cách khác, đây là **instruction manual (指示書)** bạn cung cấp cho GitHub Copilot.

### 🎯 How It Works

File này hoạt động như **instruction manual mà GitHub Copilot đọc đầu tiên** trước khi process các instructions từ user.

**✨ No special setup required:**
- Chỉ cần đặt file với tên `copilot-instructions.md`
- Trong directory `.github` của project
- → Sẽ được tự động recognized

### 📈 Benefits

Vì Copilot đọc instruction manual này trước khi respond với user instructions:
- ✅ Càng elaborate instruction manual
- ✅ Càng dễ nhận được **ideal answers aligned with project context**

### 🎭 AI Context Quote

Từ [một Speaker Deck](https://speakerdeck.com/jyoshise/aigakodoshu-kisugiwen-ti-nihaaideli-tixiang-kae?slide=26), có đề cập về AI như sau:

> **"AI không được cung cấp context là part-time worker (dù có talent) chỉ đến làm trong ngày đó thôi"**
> 
> **コンテキストを与えられないAIはその日だけタイミーで来たバイト(優秀ではある)**

Bằng cách cung cấp **project context** thoroughly qua `copilot-instructions.md`, bạn có thể transform "talented part-time worker" này thành **"reliable dedicated assistant"** (頼れる専属アシスタント).

---

## 📝 copilot-instructions.md を作成する - Tạo copilot-instructions.md

### 🔧 How to Create

**Super simple:** Chỉ cần tạo `copilot-instructions.md` trong `.github` directory của project code.

### 🎨 Visual Indicators

#### **Method 1: Direct File Creation**

Trong editors như **VS Code**, có thể xuất hiện **dedicated Copilot icon** (tùy thuộc extension settings).

![VS Code Copilot Icon](vscode_copilot_icon_screenshot)

**Screenshot:** VS Code showing copilot-instructions.md với Copilot icon

#### **Method 2: Via GitHub Copilot Chat**

Trong **VS Code**, mở **GitHub Copilot Chat** và sử dụng:
- `New Chat` (hoặc `/` command)

Khi displayed, sẽ thấy link "**指示の生成**" (Generate Instructions):
- Command: `@workspace /new`

![Copilot Chat New](copilot_chat_new_screenshot)

**Screenshot:** Copilot Chat showing "@workspace /new" command

---

## 📋 どんなことを書けばいい？ - Nên viết những gì?

### 🎯 Recommended Approach

Treat như **"instruction manual"** (取扱説明書) của project, recommended cover các items sau:

---

## 🏗️ Content Structure - 7 Recommended Sections

### **1. 前提条件 - Prerequisites/Basic Rules**

#### 📌 Purpose
Define **basic instructions** cho AI.

#### 💬 Examples

**Language preference:**
> "回答は必ず日本語でしてください"
> ("Luôn trả lời bằng tiếng Nhật")

**Change approval process:**
> "大規模な変更（例: 200行以上）を行う前には、まず変更計画を提案してください"
> ("Trước khi thực hiện large-scale changes (ví dụ: 200+ lines), trước tiên hãy propose change plan")

#### ✅ Benefits

1. **Prevent unintended massive code generation**
2. **Avoid sudden English responses** khi throw error messages

---

### **2. アプリの概要 - Application Overview**

#### 📌 Purpose
Briefly explain:
- ✅ **Purpose** của application
- ✅ **Main features**

#### ✅ Benefits

Khi AI understands **overall picture** của project:
1. **Reduces wasteful file exploration**
2. **Derives more accurate answers**

---

### **3. 技術スタック（エコシステム）- Tech Stack (Ecosystem)**

#### 📌 What to Include

Clearly state:
- 💻 **Programming languages**
- 🎯 **Frameworks**
- 📚 **Major libraries**
- 🔢 **Their versions**

#### ✅ Benefits

1. **Prevents Copilot** from arbitrarily:
   - `import`-ing libraries **not used in project**
   - Suggesting **outdated syntax**

---

### **4. ディレクトリ構成 - Directory Structure**

#### 📌 Purpose
Explain:
- 📁 Main directories
- 🎯 **Role** của mỗi directory

#### 💬 Example Description

> "`src/features` chứa code theo từng feature"
> 
> "`src/shared` chứa common components"

#### ✅ Benefit

**Copilot learns** để:
- Create new files **in appropriate locations**
- Suggest proper file placement

---

### **5. アーキテクチャ・設計指針 - Architecture & Design Guidelines**

#### 📌 What to Specify

Document **design guidelines** được adopted trong project:

**Examples:**
- 🏗️ **MVVM** (Model-View-ViewModel)
- ⚛️ **Atomic Design**
- 🎯 **Clean Architecture**

#### ⚠️ Importance

**Nếu không define:**
- AI có thể generate code **inconsistent với existing design**

**📍 Especially critical for team development**

---

### **6. テスト方針 - Testing Policy**

#### 📌 What to Communicate

**Test frameworks being used:**
- ✅ **Vitest**
- ✅ **Jest**
- ✅ **RSpec**

**Test writing policies:**

**Examples:**
> "テストコードは`__tests__`配下に置く"
> ("Place test code trong `__tests__` directory")

> "カバレッジは80%を目指す"
> ("Target coverage là 80%")

#### 💡 Famous Quote

> "レガシーコードとは、単にテストの無いコードだ"
> 
> **"Legacy code is simply code without tests"**

→ **Testing is important**

---

### **7. アンチパターン - Anti-patterns**

#### 📌 Purpose

Không chỉ instructions về **"how to write"**, mà còn cả **"how NOT to write"** rules.

#### 💬 Examples

**Prohibitions:**

1. **Default export ban:**
   > "`default export` は禁止"
   > ("Prohibit `default export`")

2. **Any type restriction:**
   > "`any`型は原則使用しない"
   > ("Không sử dụng `any` type as principle")

#### 🎯 Goal

Clearly state **project-specific prohibitions**.

---

## 📚 例 - Examples

### 🎯 Example Application

Đây là examples sử dụng **fictional task management app** gọi là **"TooMe's Task App"**.

Giới thiệu **2 concrete examples** của `copilot-instructions.md`.

**⚠️ Note:** Các examples này **rất dài** (非常に長い).

---

### **Example 1: ReactでのWebアプリ - React Web App**

**Platform:** Web Application  
**Framework:** React  
**Application:** TooMe's Task App

**📦 Expandable section:**
```
例1: ReactでのWebアプリ (クリックで展開)
Click để xem full example
```

**Content includes:**
- Prerequisites (language, change approval)
- App overview (task management features)
- Tech stack (React, TypeScript, versions)
- Directory structure (src/features, src/shared)
- Architecture (MVVM, Atomic Design)
- Testing policy (Vitest, coverage targets)
- Anti-patterns (no default export, no any type)

---

### **Example 2: KotlinでのAndroidアプリ - Kotlin Android App**

**Platform:** Android Application  
**Language:** Kotlin  
**Application:** TooMe's Task App

**📦 Expandable section:**
```
例2: KotlinでのAndroidアプリ (クリックで展開)
Click để xem full example
```

**Content includes:**
- Prerequisites (Japanese responses, change approval)
- App overview (task management features)
- Tech stack (Kotlin, Android SDK, versions)
- Directory structure (Android project layout)
- Architecture (Clean Architecture, MVVM)
- Testing policy (JUnit, Espresso)
- Anti-patterns (avoid unnecessary nullability)

---

## 🎓 おわりに - Conclusion

### 📊 What This Article Covered

Bài viết này đã giới thiệu về `copilot-instructions.md` để sử dụng **GitHub Copilot more conveniently và smartly**.

### 🌐 Current Trends

Gần đây, **excellent coding AI agents** đang xuất hiện liên tục, bắt đầu với **Claude Code**.

### 🎯 Universal Truth

**Regardless của AI tool bạn sử dụng:**

> **Fact remains unchanged:** Bằng cách provide **project context (instruction manual)**, AI becomes **more excellent agent**.

### 💪 Call to Action

**Please:**
- ✅ Introduce `copilot-instructions.md` vào projects của bạn
- ✅ Transform "talented part-time worker" thành "reliable dedicated assistant"

**Japanese:**
> 皆さんもぜひ、ご自身のプロジェクトに`copilot-instructions.md`を導入して、"優秀なバイト"を"頼れる専属アシスタント"に育ててみてください。

---

## 🎯 Key Takeaways - Những điểm quan trọng

### 📋 Quick Reference

#### **What is copilot-instructions.md?**

| Aspect | Description |
|--------|-------------|
| **Definition** | GitHub Copilot version của CLAUDE.md |
| **Purpose** | Instruction manual cho GitHub Copilot |
| **Location** | `.github/copilot-instructions.md` |
| **Setup** | Không cần special configuration |
| **Recognition** | Automatic (just place file) |

#### **Benefits Summary**

```
Without copilot-instructions.md:
AI = "優秀なバイト" (Talented part-time worker)
     ↓
With copilot-instructions.md:
AI = "頼れる専属アシスタント" (Reliable dedicated assistant)
```

### 🏗️ 7 Recommended Sections

| Section | Purpose | Key Benefit |
|---------|---------|-------------|
| **1. Prerequisites** | Basic rules | Prevent unintended behavior |
| **2. App Overview** | Project purpose | Reduce wasteful exploration |
| **3. Tech Stack** | Technologies & versions | Prevent wrong imports/syntax |
| **4. Directory Structure** | File organization | Proper file placement |
| **5. Architecture** | Design patterns | Consistent code generation |
| **6. Testing Policy** | Test guidelines | Maintain test quality |
| **7. Anti-patterns** | What NOT to do | Enforce project rules |

### 💡 Implementation Best Practices

#### **Creation Methods**

**Method 1: Manual**
```bash
# Navigate to project root
cd your-project

# Create directory if not exists
mkdir -p .github

# Create file
touch .github/copilot-instructions.md
```

**Method 2: Via VS Code Copilot Chat**
```
1. Open GitHub Copilot Chat
2. Use: New Chat hoặc / command
3. Click: "指示の生成" link
4. Run: @workspace /new
```

### 📝 Content Template Structure

```markdown
# Project Instructions for GitHub Copilot

## 1. Prerequisites
- Language: [Japanese/English/etc]
- Change approval: [Rules for large changes]

## 2. Application Overview
- Purpose: [What this app does]
- Main features: [Key functionalities]

## 3. Tech Stack
- Language: [Name + version]
- Framework: [Name + version]
- Major libraries: [List with versions]

## 4. Directory Structure
- /src/features: [Purpose]
- /src/shared: [Purpose]
- /tests: [Purpose]

## 5. Architecture & Design
- Pattern: [MVVM/Clean/etc]
- Guidelines: [Specific rules]

## 6. Testing Policy
- Framework: [Jest/Vitest/etc]
- Location: [Where to place tests]
- Coverage: [Target percentage]

## 7. Anti-patterns
- ❌ [What to avoid]
- ❌ [Prohibited practices]
```

### 🎯 Impact Analysis

#### **Before copilot-instructions.md:**

**Problems:**
- ❌ Inconsistent code style
- ❌ Wrong library imports
- ❌ Files in wrong locations
- ❌ Outdated syntax suggestions
- ❌ English responses (when want Japanese)
- ❌ Large unwanted code generations
- ❌ Architecture violations

#### **After copilot-instructions.md:**

**Benefits:**
- ✅ Consistent với project style
- ✅ Correct library usage
- ✅ Proper file placement
- ✅ Modern syntax
- ✅ Expected language responses
- ✅ Controlled code generation
- ✅ Architecture compliance

### 🔄 Workflow Integration

```mermaid
User Request
    ↓
Copilot reads .github/copilot-instructions.md
    ↓
Understands:
- Project context
- Coding standards
- Architecture patterns
- Tech stack
    ↓
Processes user request
    ↓
Generates context-aware response
    ↓
Output aligned với project
```

### 🌟 Advanced Tips

#### **Keep Instructions Updated:**
```
✅ When adding new libraries
✅ When changing architecture
✅ When updating coding standards
✅ When team agrees on new patterns
```

#### **Team Collaboration:**
```
1. Create initial version
2. Share với team
3. Gather feedback
4. Iterate và improve
5. Document trong README
```

#### **Version Control:**
```bash
# Track changes
git log .github/copilot-instructions.md

# Compare versions
git diff HEAD~1 .github/copilot-instructions.md

# Blame for accountability
git blame .github/copilot-instructions.md
```

### 📊 Example Use Cases

#### **Use Case 1: Consistent Imports**

**Without instructions:**
```javascript
// Copilot might suggest:
import _ from 'lodash'  // Not used in project
```

**With instructions:**
```javascript
// Copilot suggests:
import { map } from './utils'  // Project-specific utility
```

#### **Use Case 2: File Placement**

**Without instructions:**
```
New component suggested at:
src/Component.tsx  // Wrong location
```

**With instructions:**
```
New component suggested at:
src/features/tasks/components/TaskItem.tsx  // Correct
```

#### **Use Case 3: Architecture Compliance**

**Without instructions:**
```typescript
// Direct API call in component
const TaskComponent = () => {
  const data = await fetch('/api/tasks')  // Violates architecture
}
```

**With instructions:**
```typescript
// Using repository pattern
const TaskComponent = () => {
  const { data } = useTaskRepository()  // Follows Clean Architecture
}
```

### 🎓 Learning Path

#### **Beginner Level:**
1. ✅ Create basic file với Prerequisites
2. ✅ Add App Overview
3. ✅ Document Tech Stack

#### **Intermediate Level:**
4. ✅ Define Directory Structure
5. ✅ Specify Architecture patterns
6. ✅ Add Testing policies

#### **Advanced Level:**
7. ✅ Document Anti-patterns
8. ✅ Create detailed examples
9. ✅ Establish team conventions
10. ✅ Regular updates và iterations

### 🔗 Related Concepts

#### **Similar Approaches:**

| Tool | Instruction File | Purpose |
|------|------------------|---------|
| **Claude** | CLAUDE.md | Claude AI instructions |
| **GitHub Copilot** | copilot-instructions.md | Copilot instructions |
| **Cursor** | .cursorrules | Cursor AI rules |
| **Windsurf** | .windsurfrules | Windsurf AI rules |

#### **Context Providers:**

```
1. copilot-instructions.md    ← Project-wide context
2. File comments               ← File-specific context  
3. Inline comments             ← Code-specific context
4. README.md                   ← Documentation context
```

### 💪 Success Metrics

**Measure effectiveness:**

1. **Code Quality:**
   - ✅ Fewer architecture violations
   - ✅ Better test coverage
   - ✅ Consistent style

2. **Developer Productivity:**
   - ✅ Less manual corrections needed
   - ✅ Faster feature development
   - ✅ Reduced context switching

3. **Team Alignment:**
   - ✅ Consistent code across team
   - ✅ Easier code reviews
   - ✅ Better onboarding

### 🚀 Next Steps

**After reading this article:**

1. **✅ Create file:**
   ```bash
   touch .github/copilot-instructions.md
   ```

2. **✅ Start with basics:**
   - Prerequisites
   - App overview
   - Tech stack

3. **✅ Iterate:**
   - Add sections gradually
   - Get team feedback
   - Refine based on usage

4. **✅ Share:**
   - Commit to version control
   - Document in README
   - Train team members

5. **✅ Maintain:**
   - Regular updates
   - Review effectiveness
   - Continuous improvement

---

## 📚 Related Resources

### 🔗 External Links

- **[Speaker Deck về AI Context](https://speakerdeck.com/jyoshise/aigakodoshu-kisugiwen-ti-nihaaideli-tixiang-kae?slide=26)**
- **[GitHub Copilot Documentation](https://docs.github.com/en/copilot)**
- **[VS Code Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)**

### 🎯 Key Concepts

- **コンテキスト (Context):** Critical cho AI effectiveness
- **指示書 (Instruction Manual):** Guide cho AI behavior
- **タイミーで来たバイト:** Part-time worker metaphor
- **専属アシスタント:** Dedicated assistant transformation

### 💡 Inspiration Quote

> **"Context-less AI = Talented part-time worker for a day"**
> 
> → Transform với copilot-instructions.md
> 
> **"Context-aware AI = Reliable dedicated assistant"**

---

## 🎉 Final Thoughts

### ✨ The Power of Context

**Remember:** The difference between:
- 😐 "Good enough" AI assistance
- 🌟 "Excellent" AI partnership

...is **context** (コンテキスト).

### 🚀 Take Action Today

**Start small:**
1. Create `.github/copilot-instructions.md`
2. Add 2-3 basic sections
3. Test với Copilot
4. See immediate improvements
5. Iterate và expand

### 💪 Your Journey

```
Today: 
  ↓
Create copilot-instructions.md
  ↓
Tomorrow:
  ↓
Better Copilot suggestions
  ↓
This week:
  ↓
More productive development
  ↓
This month:
  ↓
Reliable AI assistant
  ↓
Long-term:
  ↓
Excellent development partnership
```

### 🙏 Thank You

Cảm ơn @TooMe và **KDDI Agile Development Center** đã share knowledge quý giá này!

**URL:** https://qiita.com/TooMe/items/873540da84567733d16b

TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
