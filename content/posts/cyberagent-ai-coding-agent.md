---
title: "Môi trường phát triển để đối xử AI Coding Agent như \"cấp dưới\" chứ không phải \"công cụ\""
date: 2025-12-08
author: "近藤 (Kondo - tomokon)"
organization: "CyberAgent"
affiliation: "CIU (CyberAgent group Infrastructure Unit)"
event: "CyberAgent Developers Advent Calendar 2025"
event_day: 8
categories:
  - AI
  - Development Tools
tags:
  - AI
  - Claude Code
  - Development Environment
  - git-worktree
  - tmux
  - Neovim
  - dotfiles
source: CyberAgent Developers Blog
source_url: https://developers.cyberagent.co.jp/blog/archives/60265/
---

Đây là bài viết ngày thứ 8 trong [CyberAgent Developers Advent Calendar 2025](https://adventar.org/calendars/11590).

## 1. Giới thiệu

Xin chào!

Tôi là Kondo thuộc CIU (CyberAgent group Infrastructure Unit), bộ phận Computing & Web Service. Công việc hàng ngày của tôi là phát triển và vận hành nền tảng IaaS của "Cycloud" - private cloud của CyberAgent.

Khi nhắc đến nền tảng IaaS, có thể nhiều người nghĩ đó là công việc tập trung vào vận hành hạ tầng, xa rời khỏi phát triển phần mềm hiện đại. Tuy nhiên, tại Cycloud, chính nền tảng hạ tầng cũng được xây dựng bằng các dự án OSS quy mô lớn như Kubernetes và OpenStack, đồng thời chúng tôi cũng thường xuyên phát triển các hệ thống độc quyền và công cụ hỗ trợ bằng Go, Python, v.v. - hoạt động phát triển phần mềm rất sôi động.

Hơn nữa, gần đây toàn bộ tổ chức đã thúc đẩy việc sử dụng AI Coding Agent (sau đây gọi là AI), không chỉ triển khai code một phần mà còn giao toàn bộ quy trình phát triển như test, lint, review cho AI, đang tăng cường cả tốc độ phát triển lẫn chất lượng.

Vì vậy, trong bài viết này, với chủ đề **"Xây dựng môi trường phát triển để đối xử AI không phải như 'công cụ hỗ trợ' mà như 'cấp dưới' có thể được giao toàn bộ quy trình phát triển"**, tôi sẽ giới thiệu:

• Quy trình phát triển sử dụng AI Coding Agent  
• Cách xây dựng môi trường phát triển hỗ trợ quy trình đó  

Tôi sẽ trình bày kèm theo các ví dụ cụ thể.

### Danh sách các công cụ phát triển chính

• Claude Code  
• git-worktree-runner  
• Zsh  
• Neovim  
• tmux  
• dotfiles  

## 2. Sử dụng Claude Code như "Console chuyên dụng cho AI"

### 2-1. Phong cách phát triển dựa trên CLI

Tôi chủ yếu sử dụng Claude Code như AI Coding Agent, khởi động nó trên terminal CLI như một **"console chuyên dụng cho AI"**. Trên thị trường có một số sản phẩm AI tích hợp sẵn vào editor GUI, nhưng lý do chính tôi ưa thích AI dựa trên CLI là:

• Tập trung môi trường phát triển chỉ trên terminal  
• Thực hiện cùng trải nghiệm phát triển trên nhiều môi trường khác nhau  
• Giảm thiểu vendor lock-in  

Tôi thường sử dụng tmux và Neovim trong phát triển hàng ngày, có độ tương thích cao với AI dựa trên CLI. Tôi đã thử editor tích hợp AI dựa trên GUI, nhưng với cách sử dụng của mình, khả năng sử dụng của chính editor không phù hợp và tôi cảm thấy năng suất giảm sút, nên đã chọn phong cách kết hợp AI dựa trên CLI hoàn thành trên terminal với Neovim.

Ngoài ra, lợi ích của phong cách hoàn thành trên terminal là có thể dễ dàng thiết lập môi trường phát triển giống nhau trên PC mới hoặc môi trường remote như local, và vì dựa trên CLI nên có thể tương đối dễ dàng chuyển đổi sang AI khác, giảm thiểu được vendor lock-in.

### 2-2. tmux + Neovim + Claude Code

Trong phát triển hàng ngày, tôi sử dụng tmux để quản lý session theo project, window theo task, và hiển thị Neovim với Claude Code chia màn hình.

![Phong cách phát triển tmux + Neovim + Claude Code](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-16.32.25-2048x1289.jpg)

Trong tmux, tôi cấu hình các keybinding như sau để có thể di chuyển giữa editor và AI console theo thói quen giống như di chuyển buffer trong vim.

**Cấu hình keybinding phía tmux (trích xuất):**

```bash
# Thay đổi prefix key thành C-q
set -g prefix C-q

# Di chuyển pane theo phong cách Vim
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
```

Tùy môi trường, khi chia màn hình thì không đủ không gian và khó nhìn, hoặc khi con người muốn tập trung vào editor để chỉnh sửa chi tiết. Trong những trường hợp đó, sử dụng keybinding `Ctrl-z` của tmux có thể tạm thời hiển thị toàn màn hình pane đã chọn, rất tiện lợi nên tôi hay dùng.

## 3. Giao nhiệm vụ dài hạn cho AI

Từ đây, tôi sẽ giới thiệu cách thực tế sử dụng AI trong phát triển và các kỹ thuật cải thiện năng suất mà tôi áp dụng.

### 3-1. Thoát khỏi "địa ngục review output của AI quá thường xuyên"

Không chỉ với AI, chúng ta không nên tin tưởng hoàn toàn output của người khác mà không kiểm tra. Cần có quy trình review do một người có trách nhiệm thực hiện. Tuy nhiên, nếu con người phải kiểm tra tất cả output thường xuyên và lớn lượng của AI, chạy test mỗi lần và xem log thực thi, viết feedback cho AI để sửa lại... thì năng suất sẽ không tăng và con người không thể tập trung vào công việc khác.

Nếu con người không thể làm công việc khác và phải dính chặt vào việc review AI, nhiều người có kinh nghiệm nghĩ rằng tự mình viết từ đầu còn nhanh hơn.

Vì vậy, tôi đã áp dụng các kỹ thuật sau để cho AI dù mất nhiều thời gian cũng phải output chất lượng cao, giảm tần suất và khối lượng con người phải review output của AI:

1. Tự động cho AI thực hiện Lint / Test / Review  
2. Nếu có lỗi nào đó xuất hiện, tự động xác định nguyên nhân và sửa  
3. Lặp lại các bước trên cho đến khi không còn lỗi  

### 3-2. Biến "kiểm tra chất lượng tối thiểu" thành command bằng Makefile

Không nhất thiết phải là Makefile, nhưng chuẩn bị command "nếu pass được thì có thể gửi đi review" cho mỗi project.

**Ví dụ Makefile:**

```makefile
.PHONY: lint
lint: ## Chạy linters (golangci-lint và staticcheck).
	golangci-lint run
	staticcheck ./...

.PHONY: test
test: ## Chạy tất cả tests.
	go test -cover ./...
```

Bằng cách hướng dẫn AI luôn thực hiện các command này sau khi chỉnh sửa code, có thể đảm bảo output cuối cùng mà AI gửi đi đáp ứng tiêu chuẩn tối thiểu đã định trước.

**Ví dụ hướng dẫn trong AGENTS.md (trích xuất):**

```markdown
## Coding Style

### Go Code Style

...

**Formatting & Linting**: Sau mỗi thay đổi Go code, chạy các lệnh sau.

```bash
make fmt          # Format Go code với gofmt và goimports.
make lint         # Chạy linters (golangci-lint và staticcheck).
```

## Testing Guidelines

Mọi thay đổi phải pass `make test`.

```bash
make test         # Chạy tất cả tests.
```
```

### 3-3. Cài đặt permissions của Claude Code

Để AI có thể tự quay vòng feedback loop, cần cho phép AI tự động sử dụng các công cụ cần thiết giống như con người. Nếu phải phê duyệt thủ công mỗi khi AI sử dụng công cụ, năng suất sẽ không tăng.

Tuy nhiên, đương nhiên không được phép cho AI thực hiện bất kỳ command tùy ý nào. Đặc biệt cần chú ý với các thao tác xóa và công cụ CLI thao tác với hệ thống bên ngoài.

Để giải quyết vấn đề này, Claude Code cho phép kiểm soát rõ ràng command nào được phép thực thi mà không cần phê duyệt và command nào tuyệt đối không được thực thi thông qua file cấu hình (`.claude/settings.json`).

Tham khảo: [Tài liệu cấu hình CLI](https://code.claude.com/docs/en/settings)

Các thao tác read không phụ thuộc project được phép trong `~/.claude/settings.json`, còn các command như make cần cấu hình theo project thì được phép trong `<PROJECT_ROOT>/.claude/settings.json`.

**Cấu hình global (trích xuất):**

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

**Cấu hình project (trích xuất):**

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

Nhờ đó, AI không chỉ đọc và chỉnh sửa code cơ bản mà còn tự động thực hiện các công việc như Lint / Test mà không cần con người can thiệp, thực hiện được phát triển tự chủ dài hạn và cải thiện chất lượng output.

## 4. Xử lý ngắt quãng bằng hooks và thông báo desktop

Claude Code có tính năng hooks, cho phép thực thi command tùy ý tùy theo trạng thái session.

Tham khảo: [Claude Code Hooks reference](https://code.claude.com/docs/en/hooks)

**Ví dụ cấu hình (trích xuất từ `settings.json`):**

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

Ở đây, khi AI yêu cầu chỉ thị hoặc phê duyệt từ con người (Notification), hoặc khi task hoàn thành (Stop), script sẽ được gọi.

**Script thực tế đang chạy:**

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

Command được định nghĩa trong hooks nhận chuỗi định dạng json chứa metadata của session qua standard input.

Từ đó trích xuất `transcript_path` - đường dẫn file chứa thông tin chi tiết của session. Nội dung file đó cũng là nhiều chuỗi json, nên xử lý để lấy path project và message cuối cùng, hiển thị dưới dạng thông báo desktop (có cả âm thanh).

![Thông báo desktop Claude Code](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-17.15.26.png)

Nhờ đó, trong khi giao task dài hạn cho AI, con người có thể làm công việc khác, và khi có thông báo thì quay lại session AI - thực hiện được quy trình phát triển ít gánh nặng cho con người.

## 5. Chạy song song nhiều task với git worktree × Claude Code

### 5-1. Phong cách phát triển sử dụng git worktree

Có nhiều tình huống muốn tiến hành song song nhiều task trong cùng một repository:

• Phát triển 0 → 1 với nhiều component đồng thời dựa trên tài liệu thiết kế  
• Thêm tính năng đồng thời refactoring  

Trong các trường hợp như vậy, nếu tiến hành nhiều công việc trên cùng branch, độ phân tán PR sẽ lớn làm tăng gánh nặng review, hoặc context mà AI nắm bắt bị ô nhiễm làm giảm chất lượng output.

Vì vậy, tôi sử dụng git worktree để phân tách branch và directory theo task, cho AI thực thi song song nhiều task.

Sử dụng git worktree cho phép:

• Tạo directory độc lập cho mỗi branch  
• Khởi động session Claude Code độc lập cho mỗi worktree  

Tách biệt AI session theo đơn vị task như vậy.

### 5-2. Tận dụng git-worktree-runner

git worktree có thể sử dụng chỉ với tính năng chuẩn, nhưng việc quản lý directory cho worktree và di chuyển liền mạch đến AI session rất tốn công sức.

Vì vậy tôi tận dụng git-worktree-runner mà người từ team thúc đẩy AI của CIU đã dạy.

**Các tính năng chính:**

• Tạo và xóa worktree  
• Quản lý directory cho worktree  
• Thực thi AI Agent trên worktree  

Tham khảo: [git-worktree-runner](https://github.com/coderabbitai/git-worktree-runner)

Bằng cách giới thiệu công cụ này:

• `git gtr new <branch>` để tạo worktree  
• `git gtr ai <branch>` để khởi động session Claude Code tương ứng với worktree đó  

Các thao tác như vậy có thể thực hiện bằng một command, dễ dàng liên kết giữa task, worktree và AI session.

### 5-3. Wrapper bằng shell function

git-worktree-runner đơn độc cũng đã đủ tiện, nhưng thực tế việc gõ nhiều subcommand mỗi lần hơi phiền.

Vì vậy, tôi định nghĩa các use case thường gặp như shell function wrapper để thực hiện dễ dàng.

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

# Tạo worktree + khởi động Claude Code
function gai {
    local branch="$1"

    if [[ "$branch" == "main" ]]; then
        echo "Không thể dùng 'main' làm worktree branch. Chỉ định feature branch." >&2
        return 1
    fi

    if ! git gtr list | grep -Eq "^$branch"; then
        echo "Worktree '$branch' không tồn tại. Đang tạo worktree mới." >&2
        git gtr new "$branch"
    fi

    git gtr ai "$branch"
}
```

Ví dụ chỉ cần gõ `gai feature/new-api`:

1. Tạo worktree  
2. Khởi động session Claude Code tương ứng  

Thực hiện liền một mạch, hoặc `gcd feature/new-api` để di chuyển đến worktree đã tạo, hoặc `gcd main` để dễ dàng quay về branch main gốc.

**Ví dụ sử dụng lệnh gai:**

![Lệnh gai (phần 1)](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-17.02.51-2048x1141.png)

![Lệnh gai (phần 2)](https://developers.cyberagent.co.jp/blog/wp-content/uploads/2025/12/Screenshot-2025-12-03-at-17.04.54-1536x716.png)

## 6. Quản lý tập trung cấu hình và setup bằng dotfiles

Đã giới thiệu nhiều cấu hình và script, nhưng việc xây dựng lại tất cả các cấu hình này từ đầu mỗi lần trên PC mới hoặc môi trường remote server thực sự rất tốn công sức. Chỉ việc đó thôi cũng hết cả ngày.

Vì vậy, tôi sử dụng "dotfiles" để quản lý và setup chúng.

Tham khảo: [Chào mừng đến thế giới dotfiles](https://qiita.com/yutkat/items/c6c7584d9795799ee164)

**Cấu trúc dotfiles (trích xuất):**

```
.
├── bin
│   ├── claude_notify.sh    # Script thông báo desktop
│   ├── git-gtr             # git-worktree-runner
├── claude
│   ├── agents              # Quản lý subagents
│   ├── assets              # Tài liệu tham khảo cho AI
│   ├── commands            # Custom slash command
│   ├── skills              # Quản lý skill
│   ├── CLAUDE.md           # Instruction global
│   └── settings.json       # Cấu hình global
├── tmux                    # Cấu hình tmux
└── setup.sh                # Script setup môi trường
```

Ngay cả môi trường mới, chỉ cần clone repository dotfiles và chạy setup script là có thể dễ dàng thực hiện môi trường phát triển giống như thường ngày. Dưới đây là ví dụ xử lý tạo symbolic link để các file cấu hình và script có thể sử dụng trong môi trường.

**`~/dotfiles/setup.sh` (trích xuất):**

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
        echo "'$TARGET_PATH' đã tồn tại. Bỏ qua."
        continue
    fi

    TARGET_DIR="$(dirname "$TARGET_PATH")"
    mkdir -p "$TARGET_DIR"

    ln -s "$SOURCE_PATH" "$TARGET_PATH"
    echo "Đã tạo symbolic link: $TARGET_PATH -> $SOURCE_PATH"
done
```

Như vậy, bằng cách tập trung tất cả cấu hình và script liên quan đến môi trường phát triển vào dotfiles, có thể tái tạo cùng trải nghiệm phát triển trong thời gian ngắn trên bất kỳ máy nào, mang theo "quy trình phát triển theo phong cách riêng" bao gồm cả AI Coding Agent với tính tái tạo cao.

## 7. Kết luận

Trong bài viết này, tôi đã giới thiệu môi trường phát triển và các kỹ thuật cải thiện năng suất nhằm đối xử AI Coding Agent không phải như "công cụ hỗ trợ" mà như "cấp dưới" có thể giao task dài hạn.

• Cho AI **tự động thực thi "vòng lặp Lint, Test, CI check"** để hạn chế output chất lượng thấp và giảm công sức con người phải review thường xuyên  
• Xây dựng cơ chế thông báo desktop bằng tính năng hooks, con người không phải polling mà phát hiện bằng ngắt quãng khi AI hoàn thành task dài hạn hoặc chờ input  
• Kết hợp git-worktree-runner và shell function để thực hiện song song nhiều task một cách liền mạch bằng AI  
• Tập trung các cấu hình và script này vào dotfiles, tái tạo nhanh chóng cùng trải nghiệm phát triển ngay cả trên máy mới hoặc môi trường remote  

Đã giới thiệu nhiều kỹ thuật, nhưng điểm quan trọng là **luôn cải tiến môi trường phát triển để có thể đối xử AI như "cấp dưới" tự chủ hoàn thành tiêu chuẩn chất lượng nhất định và quy trình phát triển**. Môi trường lý tưởng cho mỗi cá nhân không thể tạo ra trong một sớm một chiều. Ý thức về việc liên tục nuôi dưỡng là quan trọng.

Trong tương lai, ngoài việc tiếp tục chỉnh sửa môi trường phát triển cá nhân, tôi muốn tiếp tục xây dựng nền tảng quy trình phát triển AI ở cấp độ tổ chức và đưa AI vào vận hành (gọi là AIOps).

Tôi hy vọng nội dung bài viết này sẽ là bước đầu tiên cho độc giả trong phát triển sử dụng AI Coding Agent. Cảm ơn bạn đã đọc đến cuối!

---

**Về tác giả**

Kondo (tomokon)  
Kỹ sư mới tốt nghiệp năm 2024, thuộc CIU, đảm nhiệm phát triển và vận hành nền tảng IaaS của private cloud. Ngoài vận hành nền tảng hạ tầng như OpenStack, Kubernetes, cũng thích phát triển phần mềm bằng Go và Python. Phát biểu tại Cloud Operator Days 2025 Closing Event.

[Blog](https://blog.tomokon.net) | [Twitter (@tomokon_0314)](https://x.com/tomokon_0314) | [GitHub](https://github.com/TOMOFUMI-KONDO)
