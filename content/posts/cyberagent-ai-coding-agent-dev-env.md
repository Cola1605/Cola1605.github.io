---
title: "Môi Trường Development để Đối Xử với AI Coding Agent như 'Cấp Dưới' Thay Vì 'Công Cụ'"
date: 2025-12-08T10:00:00+09:00
draft: false
categories: ["AI and Machine Learning", "Development"]
tags: ["AI", "Claude Code", "Development Environment", "CLI Tools", "tmux", "Neovim", "git worktree", "dotfiles", "Automation", "Developer Productivity"]
author: "近藤 (Kondo / tomokon)"
translator: "日平"
description: "Hướng dẫn chi tiết về cách xây dựng môi trường development để đối xử với AI Coding Agent không chỉ là công cụ hỗ trợ mà là 'cấp dưới' có thể giao phó toàn bộ quy trình phát triển. Bài viết giới thiệu cách sử dụng Claude Code với CLI, tmux, Neovim, git worktree, hooks để tự động hóa lint/test, desktop notifications, và dotfiles để quản lý cấu hình tập trung."
---

# Môi Trường Development để Đối Xử với AI Coding Agent như "Cấp Dưới" Thay Vì "Công Cụ"

**Tác giả**: 近藤 (Kondo / tomokon) ([@tomokon_0314](https://x.com/tomokon_0314))  
**Ngày xuất bản**: 8 tháng 12 năm 2025  
**Thuộc**: CIU (CyberAgent group Infrastructure Unit) Computing & Web Service  
**Vai trò**: Phát triển và vận hành nền tảng IaaS của private cloud "Cycloud"  
**Nguồn**: [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/60265/)

---

## 1. Giới Thiệu

Xin chào!

Tôi là Kondo từ CIU (CyberAgent group Infrastructure Unit) Computing & Web Service. Công việc hàng ngày của tôi là phát triển và vận hành nền tảng IaaS của private cloud "Cycloud" của CyberAgent.

Khi nghe đến nền tảng IaaS, có thể có người nghĩ rằng đây là công việc tập trung vào vận hành infrastructure và cách xa với phát triển phần mềm hiện đại. Tuy nhiên, tại Cycloud, chính nền tảng infrastructure cũng được xây dựng sử dụng các OSS quy mô lớn như Kubernetes / OpenStack, và cũng thường xuyên phát triển các hệ thống và công cụ độc đáo bằng Go / Python, nên phát triển phần mềm cũng được thực hiện rất sôi động.

Hơn nữa, gần đây tổ chức đã thúc đẩy việc sử dụng AI Coding Agent (sau đây gọi là AI), không chỉ implement code một phần mà còn có xu hướng giao toàn bộ quy trình phát triển như Test, Lint, Review cho AI, nhằm đạt được cả tốc độ phát triển và chất lượng.

Do đó, trong bài viết này, với chủ đề **"Xây dựng môi trường development để đối xử với AI không chỉ là 'công cụ hỗ trợ' mà là 'cấp dưới' có thể giao phó toàn bộ quy trình phát triển"** - một chủ đề mà tôi cá nhân đang theo đuổi, tôi sẽ giới thiệu:

- Quy trình development sử dụng AI Coding Agent
- Cách xây dựng môi trường development hỗ trợ điều đó

Với các ví dụ cụ thể.

### Danh Sách Các Công Cụ Development Chính

- Claude Code
- git-worktree-runner
- Zsh
- Neovim
- tmux
- dotfiles

---

## 2. Sử Dụng Claude Code như "AI Console Chuyên Dụng"

### 2-1. Phong Cách Development Dựa Trên CLI

Tôi chủ yếu sử dụng Claude Code như AI Coding Agent và khởi chạy nó trên terminal CLI như một **"AI console chuyên dụng"**. Trên thị trường có một số sản phẩm AI được tích hợp vào editor GUI, nhưng lý do chính tôi thích AI dựa trên CLI là:

- **Tập trung môi trường development chỉ trên terminal**
- **Thực hiện trải nghiệm development giống nhau trong các môi trường khác nhau**
- **Giảm vendor lock-in**

Tôi sử dụng tmux / Neovim cho development hàng ngày, có độ tương thích cao với AI dựa trên CLI. Tôi cũng đã thử các editor tích hợp AI dựa trên GUI, nhưng với cách sử dụng của mình, tính tiện dụng của editor không phù hợp và tôi cảm nhận được năng suất giảm, nên đã lựa chọn phong cách kết hợp AI dựa trên CLI hoàn thành trên terminal với Neovim.

Ngoài ra, với lợi ích của phong cách hoàn thành trên terminal, tôi cũng cảm thấy các ưu điểm như có thể nhanh chóng thiết lập môi trường development giống như local trên PC mới hoặc môi trường remote, và với CLI có thể tương đối dễ dàng chuyển đổi sang AI khác, giảm được một phần vendor lock-in.

### 2-2. tmux + Neovim + Claude Code

Development hàng ngày của tôi sử dụng tmux để quản lý session theo project, window theo task, và hiển thị Neovim và Claude Code bằng cách chia màn hình.

![Phong cách development tmux + Neovim + Claude Code](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-16.32.25-2048x1289.jpg)

Trong tmux, tôi đã cấu hình keybindings như sau để có thể di chuyển giữa editor và AI console với cảm giác giống như di chuyển buffer trong vim theo thói quen.

**Cấu hình keybindings của tmux (trích):**

```bash
# Thay đổi prefix key thành C-q
set -g prefix C-q

# Di chuyển pane theo phong cách Vim
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
```

Tùy theo môi trường, khi chia màn hình có thể không đủ không gian và khó nhìn, hoặc khi muốn tập trung vào editor để chỉnh sửa chi tiết ở phía con người. Trong những trường hợp như vậy, tôi thường sử dụng keybinding `Ctrl-z` của tmux để tạm thời hiển thị pane được chọn toàn màn hình, rất tiện lợi.

---

## 3. Giao Nhiệm Vụ Dài Hạn Cho AI

Từ đây, tôi sẽ giới thiệu cách tôi thực sự sử dụng AI trong development và các kỹ thuật để cải thiện năng suất được thực hành trong đó.

### 3-1. Thoát Khỏi "Địa Ngục Review Output của AI Quá Thường Xuyên"

Không chỉ với AI, nhưng không được tin tưởng output của người khác mà không kiểm tra. Cần có process để người khác chịu trách nhiệm review. Tuy nhiên, nếu con người phải kiểm tra tất cả output thường xuyên và lớn mà AI đưa ra, hoặc thực hiện test mỗi lần và nhìn log execution, viết feedback cho AI để sửa... thì năng suất sẽ không tăng và con người cũng không thể tập trung vào công việc khác.

Nếu con người không thể làm công việc khác và phải dán mắt vào review AI, thì nhiều người đã trải nghiệm rằng thà viết từ đầu còn nhanh hơn.

Do đó, tôi đã thực hiện các kỹ thuật sau để cho AI output chất lượng cao dù mất thời gian, giảm tần suất và lượng mà con người phải review output của AI.

1. Cho AI tự động thực hiện Lint / Test / Review
2. Nếu có bất kỳ lỗi nào, tự động xác định nguyên nhân và sửa
3. Lặp lại các bước trên cho đến khi không còn lỗi

### 3-2. Command Hóa "Quality Check Tối Thiểu" Bằng Makefile

Không nhất thiết phải là Makefile, nhưng chuẩn bị command cho mỗi project như "tối thiểu nếu pass những cái này thì có thể đưa ra review".

**Ví dụ Makefile:**

```makefile
.PHONY: lint
lint: ## Run linters (golangci-lint and staticcheck).
	golangci-lint run
	staticcheck ./...

.PHONY: test
test: ## Run all tests.
	go test -cover ./...
```

Bằng cách chỉ thị thực hiện những commands này sau mỗi lần chỉnh sửa code, có thể đảm bảo output mà AI cuối cùng đệ trình đáp ứng tiêu chuẩn tối thiểu đã định trước.

**Ví dụ chỉ thị trong AGENTS.md (trích):**

```markdown
## Coding Style

### Go Code Style

...

**Formatting & Linting**: After every Go code change, run the following commands.

```bash
make fmt          # Format Go code with gofmt and goimports.
make lint         # Run linters (golangci-lint and staticcheck).
```

## Testing Guidelines

Every change must pass `make test`.

```bash
make test # Run all tests.
```
```

### 3-3. Cấu Hình Permissions của Claude Code

Để AI có thể tự chạy feedback loop, cần cho phép AI tự động sử dụng các công cụ cần thiết giống như con người. Nếu phải phê duyệt thủ công mỗi khi AI sử dụng công cụ thì năng suất sẽ không tăng.

Tuy nhiên, đương nhiên không được cho phép AI thực hiện bất kỳ command tùy ý nào. Đặc biệt cần chú ý với các thao tác xóa và CLI tools thao tác với hệ thống bên ngoài.

Để giải quyết vấn đề này, Claude Code cho phép kiểm soát rõ ràng trong file cấu hình (`.claude/settings.json`) các commands được phép thực hiện mà không cần phê duyệt hoặc các commands tuyệt đối không được thực hiện.

**Tham khảo:** [CLI Settings Documentation](https://code.claude.com/docs/en/settings)

Các thao tác read không phụ thuộc vào project được cho phép trong `~/.claude/settings.json`, và các commands muốn cấu hình theo từng project như make command được cho phép trong `<PROJECT_ROOT>/.claude/settings.json`.

**Cấu hình global (trích):**

```json
{
  "permissions": {
    "allow": [
      "Bash(mkdir:*)",
      "Bash(ls:*)",
      "Bash(tree:*)",
      "Bash(grep:*)",
      "Bash(sort:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(gh repo list:*)",
      "Bash(gh repo view:*)",
      "mcp__context7",
      "mcp__serena"
    ],
    "deny": [
      "Bash(sudo:*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

**Cấu hình project (trích):**

```json
{
  "permissions": {
    "allow": [
      "Bash(make help)",
      "Bash(make fmt)",
      "Bash(make lint)",
      "Bash(make build)",
      "Bash(make test)",
      "Bash(make proto)",
      "Bash(make proto-fmt)",
      "Bash(make proto-lint)",
      "Bash(make sql-generate)",
      "Bash(make sql-fmt)",
      "Bash(make sql-lint)"
    ]
  }
}
```

Nhờ đó, AI không chỉ có thể đọc code cơ bản và chỉnh sửa, mà còn có thể thực hiện một loạt công việc như Lint / Test được chỉ thị tự động thực hiện mà không cần sự can thiệp của con người, thực hiện development tự chủ dài hạn của AI và cải thiện chất lượng output.

---

## 4. Xử Lý Interrupt Bằng Hooks và Desktop Notifications

Claude Code có tính năng hooks, cho phép thực thi commands tùy ý tùy theo trạng thái của session.

**Tham khảo:** [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks)

**Ví dụ cấu hình (`settings.json` trích):**

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c \"~/bin/claude_notify.sh Notification\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c \"~/bin/claude_notify.sh Stop\""
          }
        ]
      }
    ]
  }
}
```

Ở đây, gọi script khi AI yêu cầu chỉ thị hoặc phê duyệt từ con người (Notification), hoặc khi task hoàn thành (Stop).

Script thực tế được thực thi như sau:

```bash
#!/bin/bash
# ~/bin/claude_notify.sh

TYPE="$1"
INPUT="$(cat -)"

# Thư mục làm việc
WORKDIR=$(echo "$INPUT" | jq -r '.cwd')

# Lấy message assistant cuối cùng từ transcript
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path')

MSG=""
if [[ -n "$TRANSCRIPT_PATH" && "$TRANSCRIPT_PATH" != "null" ]]; then
    JSON="$(tac "$TRANSCRIPT_PATH" | jq -rn '
        inputs
        | select(.message?.role? == "assistant")
        | select(.message?.content?[0]?.text != null)
        | (., halt)
    ')"
    if [[ -n "$JSON" && "$JSON" != "null" ]]; then
        MSG="$(echo "$JSON" | jq -r '.message.content[0].text')"
    fi
fi

osascript -e "display notification \"$MSG\" \\
    with title \"Claude Code ($TYPE)\" subtitle \"$WORKDIR\""
```

String JSON chứa metadata của session được truyền vào standard input cho command được định nghĩa trong hooks. Từ đó trích xuất `transcript_path` chứa file path của thông tin chi tiết session. Nội dung file đó cũng là nhiều JSON strings, nên xử lý nội dung để lấy path của project và message cuối cùng, hiển thị dưới dạng desktop notification (kèm âm thanh).

![Claude Code desktop notification](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-17.15.26.png)

Nhờ đó, có thể thực hiện quy trình development với ít gánh nặng cho phía con người: làm công việc khác trong khi giao task dài hạn cho AI, quay lại AI session khi có thông báo đến.

---

## 5. Chạy Nhiều Tasks Song Song với git worktree × Claude Code

### 5-1. Phong Cách Development Sử Dụng git worktree

Có nhiều trường hợp muốn tiến hành nhiều tasks song song trong cùng một repository.

- Development từ 0 → 1 để đồng thời develop nhiều components dựa trên thiết kế
- Thực hiện refactoring trong khi thêm tính năng

Trong những trường hợp như vậy, nếu tiến hành nhiều công việc trên cùng một branch, PR sẽ có độ chi tiết lớn làm tăng gánh nặng review, hoặc context mà AI nắm bắt bị bẩn làm chất lượng output giảm.

Do đó, tôi sử dụng git worktree để phân chia branch và directory theo từng task, áp dụng quy trình development cho AI thực hiện nhiều tasks song song.

Sử dụng git worktree, có thể:

- Tạo directory độc lập cho mỗi branch
- Khởi động Claude Code session độc lập trên mỗi worktree

Để phân tách AI session theo đơn vị task.

### 5-2. Tận Dụng git-worktree-runner

git worktree có thể sử dụng chỉ với tính năng tiêu chuẩn, nhưng việc quản lý directory cho worktree và di chuyển seamless đến AI session khá tốn công.

Do đó, tôi tận dụng git-worktree-runner được giới thiệu bởi AI Promotion Team của CIU.

**Tính năng chính:**

- Tạo/xóa worktree
- Quản lý directory cho worktree
- Thực thi AI Agent trên worktree

**Tham khảo:** [git-worktree-runner](https://github.com/coderabbitai/git-worktree-runner)

Bằng cách triển khai này:

- `git gtr new <branch>` để tạo worktree
- `git gtr ai <branch>` để khởi động Claude Code session tương ứng với worktree đó

Có thể thực hiện các thao tác trong một command, dễ dàng thực thi liên kết giữa task・worktree・AI session.

### 5-3. Wrapper Bằng Shell Functions

git-worktree-runner đã đủ tiện lợi, nhưng thành thật mà nói việc gõ nhiều subcommands hơi phiền.

Do đó, tôi định nghĩa các use cases thường gặp như shell functions wrapper để dễ dàng thực thi.

```bash
# Danh sách worktree
function gls {
    local branch="$1"
    git gtr list "$branch"
}

# Di chuyển đến worktree
function gcd {
    local branch="$1"
    if [[ "$branch" == main || "$branch" == "" ]]; then
        cd "$(git worktree list | grep -E '\\[main\\]$' | awk '{print $1}')"
    else
        cd "$(git gtr go "$branch" 2>&1 | tail -n1)"
    fi
}

# Tạo worktree + Khởi động Claude Code
function gai {
    local branch="$1"

    if [[ "$branch" == "main" ]]; then
        echo "Cannot use 'main' as worktree branch. Specify a feature branch." >&2
        return 1
    fi

    if ! git gtr list | grep -Eq "^$branch"; then
        echo "Worktree '$branch' does not exist. Creating new worktree." >&2
        git gtr new "$branch"
    fi

    git gtr ai "$branch"
}
```

Ví dụ, chỉ cần gõ `gai feature/new-api`:

1. Tạo worktree
2. Khởi động Claude Code session tương ứng

Có thể thực hiện tất cả trong một lần, hoặc `gcd feature/new-api` để di chuyển đến worktree đã tạo, `gcd main` để dễ dàng di chuyển về main branch gốc.

**Ví dụ sử dụng gai command:**

![Ví dụ gai command](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-17.02.51-2048x1141.png)

![gai command khởi động Claude Code](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-17.04.54-1536x716.png)

---

## 6. Quản Lý Tập Trung Cấu Hình và Setup Bằng dotfiles

Cho đến giờ đã giới thiệu nhiều cấu hình và scripts, nhưng thành thật mà nói việc xây dựng tất cả các cấu hình này từ đầu mỗi lần trên PC mới hoặc môi trường remote server khá tốn công. Chỉ việc đó thôi cũng hết một ngày.

Do đó, tôi sử dụng "dotfiles" để quản lý và setup chúng.

**Tham khảo:** [Chào mừng đến với thế giới dotfiles](https://qiita.com/yutkat/items/c6c7584d9795799ee164)

**Cấu trúc dotfiles (trích):**

```
.
├── bin
│   ├── claude_notify.sh    # Desktop notification script
│   ├── git-gtr             # git-worktree-runner
├── claude
│   ├── agents              # Quản lý subagents
│   ├── assets              # References cho AI
│   ├── commands            # Custom slash command
│   ├── skills              # Quản lý skills
│   ├── CLAUDE.md           # Instructions global
│   └── settings.json       # Cấu hình global
├── tmux                    # Cấu hình tmux
└── setup.sh                # Script setup môi trường
```

Ngay cả trong môi trường mới, chỉ cần clone repository dotfiles và chạy setup script là có thể nhanh chóng thực hiện môi trường development giống như thường ngày. Dưới đây là ví dụ xử lý tạo symbolic links để các file cấu hình và scripts có thể sử dụng trong môi trường.

**`~/dotfiles/setup.sh` (trích):**

```bash
#!/bin/bash

PAIRS=(
    "$PWD/bin:$HOME/bin"
    "$PWD/claude/settings.json:$HOME/.claude/settings.json"
    "$PWD/claude/CLAUDE.md:$HOME/.claude/CLAUDE.md"
    "$PWD/claude/commands:$HOME/.claude/commands"
    "$PWD/claude/agents:$HOME/.claude/agents"
    "$PWD/claude/skills:$HOME/.claude/skills"
    "$PWD/zsh/.zshrc:$HOME/.zshrc"
    "$PWD/zsh/.zsh_aliases:$HOME/.zsh_aliases"
    "$PWD/zsh/.zsh_functions:$HOME/.zsh_functions"
    "$PWD/tmux/.tmux.conf:$HOME/.tmux.conf"
)

for PAIR in "${PAIRS[@]}"; do
    SOURCE_PATH="${PAIR%%:*}"
    TARGET_PATH="${PAIR##*:}"

    if [ -e "$TARGET_PATH" ]; then
        echo "'$TARGET_PATH' already exists. Skip."
        continue
    fi

    TARGET_DIR="$(dirname "$TARGET_PATH")"
    mkdir -p "$TARGET_DIR"

    ln -s "$SOURCE_PATH" "$TARGET_PATH"
    echo "Created symbolic link: $TARGET_PATH -> $SOURCE_PATH"
done
```

Bằng cách tập trung tất cả cấu hình và scripts liên quan đến môi trường development vào dotfiles như vậy, có thể tái tạo trải nghiệm development giống nhau trong thời gian ngắn trên bất kỳ máy nào, mang theo "quy trình development theo cách của mình" bao gồm cả AI Coding Agent với tính tái tạo cao.

---

## 7. Tổng Kết

Bài viết này đã giới thiệu môi trường development và các kỹ thuật cải thiện năng suất nhằm đối xử với AI Coding Agent không chỉ là "công cụ hỗ trợ" mà là "cấp dưới" có thể giao phó tasks dài hạn.

- **Cho AI tự động thực hiện "Lint・Test・CI check loop"** để ức chế output chất lượng thấp của AI và giảm công sức con người phải review thường xuyên.
- **Thiết lập cơ chế desktop notifications bằng hooks** để phát hiện việc hoàn thành task dài hạn hoặc chờ input của AI bằng interrupt thay vì polling của con người.
- **Kết hợp git-worktree-runner và shell functions** để thực hiện seamless execution nhiều tasks song song của AI.
- **Tập trung các cấu hình và scripts này vào dotfiles** để nhanh chóng tái tạo trải nghiệm development giống nhau trên máy mới hoặc môi trường remote.

Đã giới thiệu nhiều kỹ thuật, nhưng điểm quan trọng là **luôn brush-up môi trường development để có thể đối xử với AI như "cấp dưới" tự chủ xử lý tiêu chuẩn chất lượng và quy trình development nhất định**. Môi trường lý tưởng cho mỗi cá nhân không thể tạo ra trong một sớm một chiều. Ý thức nuôi dưỡng liên tục là quan trọng.

Trong tương lai, ngoài việc tiếp tục chỉnh sửa môi trường development cá nhân, tôi cũng muốn tiếp tục thực hiện việc xây dựng nền tảng quy trình development AI như một tổ chức và việc đưa AI vào operations (cái gọi là AIOps).

Rất mong nội dung bài viết này trở thành bước đầu tiên trong development sử dụng AI Coding Agent của bạn đọc. Cảm ơn bạn đã đọc đến cuối!

---

## Tài Liệu Tham Khảo

- [Claude Code CLI Settings Documentation](https://code.claude.com/docs/en/settings)
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks)
- [git-worktree-runner](https://github.com/coderabbitai/git-worktree-runner)
- [Chào mừng đến với thế giới dotfiles](https://qiita.com/yutkat/items/c6c7584d9795799ee164)

---

**Tags**: #AI #ClaudeCode #dotfiles #DevelopmentEnvironment
