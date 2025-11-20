---
title: "Ngừng Lặp Lại: Lớp Context AI Bạn Đã Bỏ Lỡ - Global Steering"
date: 2025-11-11
draft: false
categories:
  - "AWS"
  - "Development"
tags:
  - "AWS"
  - "Amazon Q Developer"
  - "AI"
  - "Kiro"
  - "Global Steering"
  - "Productivity"
  - "Developer Experience"
author: "稲田大陸"
description: "Giới thiệu Kiro Global Steering - giải pháp context AI toàn cục giúp developer không phải lặp lại cùng một instruction trên mọi project"
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/stop-repeating-yourself/)  
**Bài gốc:** [Kiro Blog - Stop Repeating Yourself](https://kiro.dev/blog/stop-repeating-yourself/)

---

## Vấn đề: Lặp đi lặp lại cùng một điều

Bạn đã nói với AI assistant 47 lần rằng bạn muốn React component kiểu functional. 23 lần về việc sử dụng Prettier với semicolon. Và ít nhất 15 lần về việc test file phải đặt trong thư mục `__tests__`, không đặt cạnh source code. Nghe quen không?

Đây không chỉ là vấn đề gây khó chịu - nó đang làm giảm năng suất của bạn. Mỗi khi setup project mới, bạn tốn 10-15 phút để giải thích lại những prompt bạn đã nói hàng chục lần. Đối với developer làm việc với 20 project mỗi năm, đó là hơn 5 giờ chỉ để lặp lại. Với team 50 người? Đó là 250 giờ mỗi năm để copy & paste cùng một standard qua các workspace.

Và còn tệ hơn nữa: khi context không nhất quán, code cũng không nhất quán. Một project có security standard. Project khác thiếu nó vì bạn quên paste file đó. Test coverage thay đổi liên tục. Code style trôi dần. Sự không nhất quán tích tụ thành technical debt.

Nếu bạn đang code với AI (và thành thật mà nói, ai trong năm 2025 lại không?), bạn đã đụng phải vấn đề này. Mỗi project mới đều bắt đầu từ con số không. AI không nhớ preference của bạn, convention của team hay standard của công ty. Bạn chỉ có thể copy & paste cùng một instruction vào mọi workspace, hoặc tệ hơn - gõ lại thủ công mỗi lần.

Đây chính là vấn đề mà **Kiro Global Steering** giải quyết.

---

## Giới thiệu: Global Steering là gì?

Kiro Global Steering giống như `.bashrc` cá nhân của bạn cho AI context - một configuration đi theo bạn mọi nơi, sẵn sàng khi bạn cần. Viết preference một lần, nó trở thành nền tảng cho mọi project bạn làm. Không copy, không quên, không inconsistency.

**Ảnh hưởng?**
- Developer tiết kiệm vài giờ mỗi tháng
- Team đạt consistency tự động
- Tổ chức áp dụng standard theo quy mô
- Quan trọng nhất: AI assistant hiểu bạn ngay từ ngày đầu tiên, mọi lúc

---

## Steering là gì?

Trước khi đi vào Global Steering, hãy làm rõ Steering thực sự làm gì.

**Steering là persistent AI context.** Đó là một tập hợp các file Markdown nói cho AI agent về preference, standard và quyết định của bạn trước khi nó bắt đầu làm việc. Thay vì giải thích cùng một điều trong mọi conversation, bạn viết nó một lần trong steering file, và AI sẽ tự động đọc khi nhận request làm việc.

### Hiện tại: Workspace Steering

Hiện tại, Kiro sử dụng workspace-specific steering, được lưu tại:

```
<project>/.kiro/steering/
```

Phương pháp này hoạt động tốt khi bạn cần chỉ định configuration cho mỗi project.

**Nhưng có vấn đề:** Hầu hết những gì bạn nói với AI không phải là project-specific.

Preference coding style của bạn giống nhau trên mọi project. Test philosophy nên nhất quán ở khắp mọi nơi. Bạn cần universal security standard. Tại sao phải lặp lại nó trên mọi workspace?

---

## Global Steering: Lớp AI Configuration cá nhân

Global Steering tồn tại trong home directory của bạn:

```
~/.kiro/steering/
```

Các steering file này **persistent, universal** và đi theo bạn khắp mọi nơi.

Bất kỳ Markdown file nào bạn đặt ở đây đều có sẵn cho Kiro trên mọi project, trừ khi được override rõ ràng ở workspace level.

### Nên đặt gì vào Global Steering?

Hãy nghĩ về những gì nhất quán trong toàn bộ công việc của bạn, bất kể project:

#### 1. Personal Coding Style `~/.kiro/style.md` (Global)

```markdown
# style.md

## Code Formatting

- Luôn sử dụng Prettier với semicolon
- 2 space indent cho JS/TS, 4 space cho Python
- Trailing comma cho multi-line array/object

## React Preference

- Chỉ function component (không dùng class component)
- Custom hook cho reusable logic
- Destructure props ở đầu component

## Naming Convention

- Function và variable: camelCase
- Component và class: PascalCase
- Constant: SCREAMING_SNAKE_CASE
- Tên mô tả hơn là ngắn gọn
```

#### 2. Testing Rules `~/.kiro/testing.md` (Global)

```markdown
# testing.md

## Test Standard

- Minimum 80% coverage cho business logic
- Test file trong thư mục `__tests__/`
- Sử dụng Jest + React Testing Library
- Mock external dependency
- Integration test cho critical path

## Test Structure

- Arrange-Act-Assert pattern
- Descriptive test name (it should...)
- 1 assertion mỗi test khi có thể
```

#### 3. Security Requirement `~/.kiro/security.md` (Global)

```markdown
# security.md

## Security Basic

- Tuyệt đối không commit secret (sử dụng environment variable)
- Validate mọi user input
- Sanitize data trước SQL/HTML rendering
- Sử dụng parameterized query, cấm string concatenation
- Implement rate limiting cho API
- Chỉ HTTPS, cấm mixed content
```

#### 4. Documentation Standard `~/.kiro/docs.md` (Global)

```markdown
# docs.md

## Code Documentation

- JSDoc cho tất cả public function
- Inline comment chỉ cho complex logic
- README với setup instruction cho mọi project
- API documentation sử dụng OpenAPI/Swagger
- Changelog theo "Keep a Changelog"
```

#### 5. Architecture Principle `~/.kiro/architecture.md` (Global)

```markdown
# architecture.md

## Design Principle

- Separation of concerns
- DRY nhưng không hy sinh clarity
- Composition hơn inheritance
- Fail early với descriptive error
- Single responsibility principle

## Code Organization

- Feature-based folder structure
- Collocate related file
- Barrel export cho clean import
```

Pattern này định nghĩa **cách bạn làm việc**, không phải **cái gì bạn xây dựng**.

---

## Kịch bản thực tế: Individual Developer

### Case Study: Jane Doe

Jane là freelance full-stack developer làm việc với customer project sử dụng React và Node, đóng góp open source và personal side project. Mọi project có business logic khác nhau, nhưng standard của cô ấy giữ nguyên.

#### Jane's Global Steering Setup

Jane's `~/.kiro/steering/` folder:

```
~/.kiro/steering/
├── style.md              # Coding style preference
├── testing.md            # Testing approach
├── security.md           # Security baseline
├── docs.md               # Documentation standard
├── git.md                # Commit message format
└── accessibility.md      # Accessibility requirement
```

**Key file:**

`~/.kiro/git.md` (Global):

```markdown
# Git Convention

## Commit Message

Theo Conventional Commits:

- feat: tính năng mới
- fix: bug fix
- docs: thay đổi documentation
- refactor: code restructure
- test: thêm/thay đổi test

Format: `type(scope): description`

Ví dụ: `feat(auth): add OAuth2 support`

## Branch Strategy

- `main` - production ready
- `develop` - integration branch
- `feature/xxx` - tính năng mới
- `fix/xxx` - bug fix
```

`~/.kiro/accessibility.md` (Global):

```markdown
# Accessibility Standard

## Requirement

- Minimum WCAG 2.1 AA compliance
- Semantic HTML element
- Proper heading hierarchy (h1 → h2 → h3)
- Alt attribute cho tất cả image
- Hỗ trợ keyboard navigation
- Visible focus indicator
- Color contrast ratio minimum 4.5:1

## Testing

- Test chỉ với keyboard
- Sử dụng screen reader (NVDA/JAWS)
- Chạy axe DevTools trước commit
```

#### Workspace-Specific Steering

Khi Jane bắt đầu develop client project mới - một e-commerce platform, project-specific steering file của cô ấy được đặt trong `<project>/.kiro/steering/`:

```
<project>/.kiro/steering/
├── product.md       # E-commerce business requirement
├── tech.md          # Next.js, Stripe, PostgreSQL choice
└── structure.md     # Folder layout của project này
```

`<project>/.kiro/product.md` (Workspace):

```markdown
# E-commerce Platform

## Core Feature

- Product catalog với search
- Shopping cart persistent
- Stripe payment integration
- Order history và tracking
- Email notification

## User Role

- Guest: browse và purchase
- Customer: saved address, order history
- Admin: product management, order processing
```

`<project>/.kiro/tech.md` (Workspace):

```markdown
# Tech Stack

## Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand cho state management

## Backend

- Next.js API route
- PostgreSQL via Prisma
- Stripe cho payment
- SendGrid cho email

## Infrastructure

- Deploy trên Vercel
- Supabase cho database
- Amazon S3 cho image
```

#### Cách chúng hoạt động cùng nhau

Khi Jane yêu cầu Kiro "tạo ProductCard component mới", Kiro đọc:

**1. Global Steering (`~/.kiro/steering/`):**
- `style.md` → Function component, Prettier config
- `accessibility.md` → Semantic HTML, alt attribute requirement
- `testing.md` → Test file placement và coverage

**2. Workspace Steering (`<project>/.kiro/steering/`):**
- `tech.md` → Sử dụng Next.js, TypeScript, Tailwind
- `product.md` → Product data structure và feature
- `structure.md` → Component trong `src/components/`

**Kết quả:** Kiro tự động generate:
- Function React component với TypeScript sử dụng Tailwind CSS class
- Semantic HTML và accessibility attribute phù hợp
- Corresponding test file cùng thư mục chính xác
- Match coding style của Jane

Tất cả mà không cần Jane lặp lại preference setting.

---

## Team Scenario: Organization-wide Standard

### Case Study: AnyCompany

AnyCompany có 8 development team, quản lý 30+ active repository trên mixed tech stack (React, Vue, Python, Go), với strict security và compliance requirement.

**Thách thức:** Tất cả developer cần tuân theo company standard, nhưng làm việc trên các project khác nhau với công nghệ khác nhau.

#### AnyCompany's Global Steering Strategy

**Deployment Approach:**

Tổ chức có flexibility trong cách phân phối global steering file cho team. Constraint quan trọng là Kiro chỉ đọc global steering file từ `~/.kiro/steering/` directory, nhưng bản thân file có thể ở bất kỳ đâu thông qua copy hoặc symbolic link.

**Option 1: Version Control với Git**

AnyCompany maintain shared repository chứa company-wide steering file bao gồm:
- Security policy
- SOC2 và GDPR compliance requirement
- Code review standard
- On-call procedure
- Accessibility requirement
- UI/UX branding guideline

Developer clone repository này trong onboarding và copy file trực tiếp vào `~/.kiro/steering/` hoặc tạo symbolic link tự động phản ánh thay đổi từ central repository.

**setup-kiro.sh:**

```bash
#!/bin/bash
# setup-kiro.sh

echo "Setting up AnyCompany Kiro Global Steering..."

# Clone company steering
git clone <team-global-steering-file-URL> ~/.kiro/company-steering

# Symbolic link to global steering (update auto-sync)
ln -s ~/.kiro/company-steering/* ~/.kiro/steering/

echo "Global steering setup complete!"
```

**Option 2: MDM (Mobile Device Management)**

Với công ty sử dụng MDM tool như Jamf hoặc Intune, deployment có thể hoàn toàn tự động. MDM script có thể populate `~/.kiro/steering/` trực tiếp bằng cách download file từ internal server, thiết lập proper permission và enforce file cần thiết tồn tại tiếp tục.

```bash
#!/bin/bash
# Deploy AnyCompany Kiro Global Steering via MDM

USER_HOME="/Users/$USER"
STEERING_DIR="$USER_HOME/.kiro/steering"
COMPANY_NAME="your-company-name"

mkdir -p "$STEERING_DIR"

# Download company steering file từ internal server
curl -o "$STEERING_DIR/security.md" "https://internal.$COMPANY_NAME.com/kiro/security.md"
curl -o "$STEERING_DIR/compliance.md" "https://internal.$COMPANY_NAME.com/kiro/compliance.md"
curl -o "$STEERING_DIR/code-review.md" "https://internal.$COMPANY_NAME.com/kiro/code-review.md"

chown -R $USER "$STEERING_DIR"
chmod 755 "$STEERING_DIR"

echo "AnyCompany Kiro Global Steering deployed successfully"
```

#### Real Team Example: Frontend Team

**Team Shared Steering Repository (Frontend):**

```
frontend-steering/
├── react-patterns.md    # Team React convention
├── component-api.md     # Props pattern
├── state-management.md  # Khi nào dùng Zustand và Context
└── performance.md       # Bundle size, lazy load rule
```

**Individual Developer: John Doe**

John là frontend developer tại AnyCompany.

**John's Complete Steering Setup:**

```
# Team-specific và company-wide (trong global steering)
~/.kiro/steering/
├── security.md          # ✅ Company security (symlink từ central location)
├── compliance.md        # ✅ SOC2/GDPR (symlink từ central location)
├── code-review.md       # ✅ PR standard (symlink từ central location)
├── react-patterns.md    # ✅ Frontend team React convention
├── component-api.md     # ✅ Team Props pattern
├── style.md             # ✅ John's personal style preference
└── shortcuts.md         # ✅ John's custom snippet

# Project-specific (workspace hiện tại)
<project>/.kiro/steering/
├── product.md           # ✅ Product requirement này
├── tech.md              # ✅ Project stack này
└── structure.md         # ✅ Codebase layout này
```

Khi John yêu cầu Kiro build gì đó, Kiro đọc file với **workspace steering ưu tiên hơn global steering**:

- **Workspace steering** ưu tiên khi có conflict
- **Global steering** bao gồm personal preference của John, team convention và company standard - được sử dụng khi không có workspace override tồn tại

**Kết quả:** John nhận được:
- Company security compliance tự động áp dụng
- Frontend team standard được share trên project
- Personal workflow preference của anh ấy
- Project-specific context từ workspace hiện tại

Tất cả layer này hoạt động seamlessly cùng nhau.

---

## Polyglot Developer Scenario

Developer làm việc với nhiều tech stack:
- React và TypeScript - frontend development
- Python và FastAPI - backend service
- React Native - mobile application
- Terraform - infrastructure

Mỗi ecosystem có convention khác nhau, dễ rơi vào inconsistent practice trên codebase.

**Solution:** Chỉ định standard với language-appropriate implementation.

**Example: `~/.kiro/testing.md` (Global)**

```markdown
# Testing Standard (Tất cả language)

## Coverage

- Minimum 80% cho business logic
- 100% cho payment/security code

## Test Structure

- Arrange-Act-Assert pattern
- Descriptive name
- 1 assertion mỗi test

## Language-Specific

### TypeScript/JavaScript

- Jest + Testing Library
- Test trong `__tests__/` directory

### Python

- pytest
- Test trong `tests/` directory
- Sử dụng fixture cho setup

### Go

- Standard `testing` package
- Table-driven test
- `_test.go` suffix
```

**Example: `~/.kiro/naming.md` (Global)**

```markdown
# Naming Convention (Tất cả language)

## Universal Rule

- Descriptive hơn clever
- Full word, không dùng abbreviation (trừ standard)
- Boolean variable: `is`, `has`, `should` prefix
- Array/list: plural noun
- Tránh negative trong boolean name

## Language-Specific

### TypeScript/JavaScript

- Variable/function: camelCase
- Class/component: PascalCase
- Constant: SCREAMING_SNAKE

### Python

- Variable/function: snake_case
- Class: PascalCase
- Constant: SCREAMING_SNAKE

### Go

- Exported name: PascalCase
- Unexported name: camelCase
```

---

## General Steering Guideline

### KHÔNG nên đặt trong Steering

- API key hoặc secret
- Database credential
- Internal URL hoặc endpoint
- Customer data hoặc PII
- Proprietary algorithm (nếu bạn dự định share steering file)

**Lý do:** Global steering file là plaintext Markdown, thường được share hoặc sync và không encrypted by default.

### An toàn để đặt trong Steering

- General security practice
- Code pattern và preference
- Testing approach
- Documentation standard
- Public API design principle
- Framework và library choice

---

## Bắt đầu: Global Steering File đầu tiên

### Bước 1: Tạo file đầu tiên

Chọn cái bạn lặp lại thường xuyên nhất. Với hầu hết developer, đó là coding style:

```bash
nano ~/.kiro/steering/style.md
```

### Bước 2: Test

Mở project mới trong Kiro và yêu cầu "tạo component mới". Kiro nên follow style preference từ `~/.kiro/steering/style.md` mà bạn không cần đề cập.

### Bước 3: Mở rộng dần dần

Phát hiện repetitive pattern, thêm file. Build organically:

```bash
# Tuần sau, thêm testing standard
nano ~/.kiro/steering/testing.md

# Tuần tiếp theo, thêm security baseline
nano ~/.kiro/steering/security.md
```

---

## Kết luận

Bây giờ bạn có cách làm việc hiệu quả hơn sử dụng [Global Steering](https://kiro.dev/docs/steering/) của Kiro để AI hiểu toàn bộ style và preference của bạn. Thách thức duy nhất còn lại là viết gì trong global steering file để tiết kiệm hàng giờ và instruction lặp lại.

Hãy tạo global steering file đầu tiên của bạn hôm nay. Trải nghiệm không bao giờ phải lặp lại nữa.

**Bạn sẽ đặt gì trong Global Steering?**

Chia sẻ setup của bạn với hashtag **#codewithkiro** hoặc tag @kirodotdev trên:
- [X (Twitter)](https://x.com/kirodotdev)
- [LinkedIn](https://www.linkedin.com/showcase/kirodotdev)
- [Instagram](https://www.instagram.com/kirodotdev)
- [Bluesky](https://bsky.app/profile/kiro.dev): @kiro.dev

---

## Lợi ích chính

✅ **Tiết kiệm thời gian:** Developer tiết kiệm hàng giờ mỗi tháng  
✅ **Consistency tự động:** Team đạt standard nhất quán trên mọi project  
✅ **Scale dễ dàng:** Tổ chức áp dụng standard theo quy mô  
✅ **AI hiểu bạn:** Assistant AI hiểu preference từ ngày đầu  
✅ **Không lặp lại:** Setup một lần, sử dụng mọi nơi  
✅ **Giảm technical debt:** Code nhất quán, security standard thống nhất

---


**Bài viết gốc:** [Stop Repeating Yourself - Kiro Blog](https://kiro.dev/blog/stop-repeating-yourself/)  
**Dịch bởi:** 稲田大陸
