---
title: "GTR (Git Worktree Runner): Công cụ tuyệt vời cho code review không cần stash hay switch branch"
date: 2025-12-03T11:00:00+09:00
draft: false
categories: ["Development", "DevOps and Infrastructure"]
tags: ["Git", "GitHub", "Code Review", "git worktree", "gtr", "VS Code", "Cursor", "AI Agent", "Development Tools"]
author: "Qiita - Nozomuts"
description: "GTR (Git Worktree Runner) - tool đơn giản hóa git worktree cho code review. Tạo review environment độc lập trong vài giây, tự động setup editor và AI agent, không cần stash hay npm install lại. Workflow mượt mà cho parallel development."
---

## Giới thiệu

GitHub update liên tục và code review trên GitHub ngày càng dễ dàng hơn! Tuy nhiên, đôi khi bạn vẫn muốn chạy code trên editor local để kiểm tra kỹ hơn.

Nhưng để làm điều đó, bạn phải:
- `stash` công việc hiện tại
- Switch branch
- `npm install` lại
- Rồi mới bắt đầu review...

Thật sự **rất phiền**! 😫

Đó là lý do **[gtr (Git Worktree Runner)](https://github.com/coderabbitai/git-worktree-runner)** ra đời để giải quyết vấn đề này!

## Tại sao lại là gtr?

Git standard có `git worktree` cho phép expand branch theo folder. Nhưng command dài và khó nhớ. `gtr` wrap nó lại đơn giản hơn và thêm nhiều tính năng tiện lợi.

### Command đơn giản

```bash
git gtr new <branch>
```

Chỉ thế thôi, xong!

### Hỗ trợ nhiều editor

VS Code, Cursor, Zed - specify và mở ngay lập tức.

### Tích hợp AI Agent

Claude Code hay Codex có thể chạy độc lập trên từng branch. Rất mạnh khi làm việc song song.

### Tự động hóa environment setup

Tự động chạy `npm install` hoặc copy file `.env`. "Mở là chạy được luôn"!

## Cài đặt

Yêu cầu Git 2.5 trở lên 🙏

### Installation

Clone repo và add vào PATH:

```bash
# Clone repository
git clone https://github.com/coderabbitai/git-worktree-runner.git
cd git-worktree-runner

# Tạo symbolic link
sudo ln -s "$(pwd)/bin/git-gtr" /usr/local/bin/git-gtr
```

### Tab Completion Setup (Zsh example)

```bash
# 1. Tạo completion directory và copy file
mkdir -p ~/.zsh/completions
cp /path/to/git-worktree-runner/completions/_git-gtr ~/.zsh/completions/

# 2. Thêm setting vào .zshrc
cat >> ~/.zshrc <<'EOF'
fpath=(~/.zsh/completions $fpath)
autoload -Uz compinit && compinit
source ~/.zsh/completions/_git-gtr
EOF

# 3. Clear cache và reload
rm -f ~/.zcompdump*
source ~/.zshrc
```

## Cách sử dụng cơ bản

Cực kỳ đơn giản:

```bash
# 1. Tạo worktree cho review branch
git gtr new feature/new-ui

# 2. Mở bằng editor đã config
git gtr editor feature/new-ui

# 3. Mở với AI coding agent (optional)
git gtr ai feature/new-ui

# --- Sau khi review xong ---

# 4. Xóa nhanh
git gtr rm feature/new-ui
```

Vậy là xong! Main working environment hoàn toàn không bị ảnh hưởng. Tạo và xóa review environment siêu nhanh. Dùng cho development thông thường cũng rất tiện.

## Cấu hình nâng cao

`gtr` có thể config linh hoạt cho từng repository.

### 1. Editor và AI Tool Setting

Set default tool bạn thích. Đặc biệt việc chạy AI tool độc lập trên từng branch rất mạnh khi làm việc song song.

```bash
# Editor (code, cursor, zed, etc.)
git gtr config set gtr.editor.default code

# AI Tool (claude, aider, copilot, etc.)
git gtr config set gtr.ai.default claude
```

### 2. Tự động hóa setup (Hooks)

Tự động chạy command sau khi tạo worktree. "Mở là chạy được ngay" - setting cực kỳ cần thiết!

```bash
git gtr config add gtr.hook.postCreate "npm install"
```

### 3. Auto File Copy

Tự động copy `.env.example` vào worktree mới:

```bash
git gtr config add gtr.copy.include "**/.env.example"
```

## Tips để dễ dàng hơn

Nếu dùng thường xuyên, thêm function này vào `.zshrc` hoặc `.bashrc`:

```bash
gtr() {
  git gtr new "$1" && git gtr editor "$1"
}
```

Giờ chỉ cần `gtr feature/branch-name` là xong!

## Use Case thực tế

### Scenario Code Review

1. **Nhận PR notification**
2. **Tạo review environment**: `gtr feature/new-feature`
3. **Editor tự động mở** (nếu đã config function)
4. **npm install tự động chạy** (nếu đã config Hook)
5. **.env file tự động copy** (nếu đã config)
6. **Kiểm tra code & chạy test**
7. **Sau khi review xong**: `git gtr rm feature/new-feature`

Mọi thứ seamless!

### Scenario Parallel Work

Review nhiều PR cùng lúc:

```bash
# Review environment cho PR 1
git gtr new feature/pr-1
git gtr editor feature/pr-1
git gtr ai feature/pr-1  # AI Agent 1

# Review environment cho PR 2
git gtr new feature/pr-2
git gtr editor feature/pr-2
git gtr ai feature/pr-2  # AI Agent 2 (chạy độc lập)
```

Mỗi branch có AI agent độc lập, context không bị lẫn!

## So sánh với git worktree

### Standard git worktree

```bash
# Command dài
git worktree add ../feature-branch feature-branch
cd ../feature-branch
npm install
code .
```

### Dùng gtr

```bash
# Đơn giản
gtr feature-branch  # Nếu đã config function
```

Mọi thứ tự động!

## Kết luận

**Ưu điểm của gtr**:
- ✅ Không cần interrupt công việc (không cần stash)
- ✅ Không lo conflict
- ✅ Command đơn giản
- ✅ Editor tự động mở
- ✅ Tích hợp AI tool
- ✅ Tự động hóa environment setup
- ✅ Hỗ trợ Tab completion

Cảm ơn bạn đã đọc! Làm việc mà không lo interrupt hay conflict, review thoải mái! Hãy thử nhé!

## Tài liệu tham khảo

- [Git Worktree Runner (gtr) - GitHub](https://github.com/coderabbitai/git-worktree-runner)
- [Git Worktree Official Documentation](https://git-scm.com/docs/git-worktree)

---

**Nguồn**: Qiita - CodeRabbit Advent Calendar 2025 Day 3  
**Tác giả**: Nozomuts  
**Dịch**: Tech Crawling Community
