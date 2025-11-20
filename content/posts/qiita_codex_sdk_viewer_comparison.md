---
title: "So sánh Codex SDK(TS) và codex-viewer - Phương thức thực thi"
date: 2025-10-19
draft: false
categories: ["AI and Machine Learning", "Development"]
tags: ["Codex", "AI駆動開発", "Technical Comparison", "SDK", "TypeScript"]
author: "nogataka"
translator: "日平"
description: "So sánh chi tiết giữa Codex TypeScript SDK và codex-viewer về cách gọi Codex binary, từ binary location, command args, input/output methods đến session management"
---

# So sánh Codex SDK(TS) và codex-viewer - Phương thức thực thi 🔧

**Tác giả**: nogataka  
**Ngày đăng**: 19 tháng 10, 2025  
**Nguồn**: [Qiita](https://qiita.com/nogataka/items/c673389a80901f83909d)

---

## Giới thiệu

Trong quá trình phát triển ứng dụng với Codex, bạn có bao giờ tự hỏi: **"Nên gọi Codex binary như thế nào?"**

Thực ra, có nhiều cách tiếp cận khác nhau để gọi Codex binary, và mỗi cách đều có triết lý thiết kế và use case riêng.

### Bối cảnh ra đời của tài liệu này

Trong quá trình phát triển codex-viewer, tôi đã nghiên cứu implementation của Codex TypeScript SDK và phát hiện ra những điểm thú vị:

**Codex TypeScript SDK:**
- SDK nhúng binary riêng (khoảng 198MB)
- Nhưng vẫn chia sẻ file config (`~/.codex/config.toml`)
- Input qua stdin
- Output streaming trực tiếp từ stdout

**codex-viewer:**
- Sử dụng lệnh codex của hệ thống
- Input qua command line arguments
- Output qua filesystem
- Quản lý multiple requests bằng task queue

> **Lưu ý**: Triết lý thiết kế này cũng được kế thừa trong [Coding Agent Viewer SDK](https://github.com/nogataka/coding-agent-viewer), áp dụng cho nhiều AI Agent khác (Claude Code, Cursor, Gemini, OpenCode).

Sự khác biệt này là kết quả của những quyết định thiết kế tối ưu cho từng use case.

### Mục đích của tài liệu

Tài liệu này sẽ làm rõ:

1. **Tại sao có sự khác biệt**
   - Lý do Codex TypeScript SDK nhúng binary và lợi ích của nó
   - Lý do codex-viewer sử dụng system command

2. **Chi tiết implementation**
   - Binary location, command args, input/output methods
   - Session management, error handling, data retrieval

3. **Nên chọn cái nào**
   - Use case của từng approach
   - Tiêu chí lựa chọn cụ thể

### Dành cho ai

- 🔧 Developers muốn hiểu implementation bên trong của Codex
- 🏗️ Những người muốn xây dựng ứng dụng với Codex
- 🤔 Người đang phân vân giữa "dùng SDK" hay "gọi binary trực tiếp"
- 📚 Ai muốn hiểu sâu về Codex ecosystem

Sau khi đọc tài liệu này, bạn sẽ có thể chọn được approach tối ưu cho project của mình.

---

## codex-viewer là gì

codex-viewer là một full-stack web application để visualize và quản lý Codex sessions trên browser.

Nó monitor realtime `~/.codex/sessions/` và `~/.codex/history.jsonl`, cung cấp:

- 📊 **Project list**: Quản lý tập trung nhiều workspace
- 🔍 **Session details**: Log viewer với syntax highlighting
- ⚡ **Realtime sync**: Live update qua SSE (Server-Sent Events)
- 📱 **Access anywhere**: Kiểm tra từ smartphone, tablet, PC khác

**Chi tiết:**
- 🔗 [GitHub Repository](https://github.com/nogataka/codex-viewer)
- 📝 [Qiita: 2 công cụ thần thánh thay đổi Codex Life](https://qiita.com/nogataka/items/a5a0074b06c57555a850)
- 📘 [Qiita: Codex Viewer Guide - Tăng tốc quản lý project](https://qiita.com/nogataka/items/28d04db421663a4a46fd)

### Coding Agent Viewer SDK

Mở rộng approach của codex-viewer cho nhiều AI Agent khác - đó là [Coding Agent Viewer SDK](https://github.com/nogataka/coding-agent-viewer).

**Agents được hỗ trợ:**
- 🤖 Codex
- 🧠 Claude Code
- 💬 Cursor
- 💎 Gemini
- 🔓 OpenCode

**Đặc điểm:**
- **Unified API**: Điều khiển nhiều AI Agent bằng cùng interface
- **4 usage levels**: Direct library, REST API, Complete web app, Custom chat UI
- **System command approach**: Sử dụng agent command đã cài đặt (giống codex-viewer)
- **File-based sync**: Monitor `~/.{agent}/sessions/` để thu thập logs

**Chi tiết:**
- 🔗 [GitHub Repository](https://github.com/nogataka/coding-agent-viewer)
- 📝 [Qiita: Chỉ 3 dòng code để quản lý AI Agent!](https://qiita.com/nogataka/items/5e48f85795a0ace124ba)
- 📦 [npm: @nogataka/coding-agent-viewer-sdk](https://www.npmjs.com/package/@nogataka/coding-agent-viewer-sdk)

---

## Tổng quan

### Codex TypeScript SDK

**Mục đích**: Làm library đa năng, cho phép sử dụng Codex từ bất kỳ Node.js application nào

**Đặc điểm:**
- Phân phối dưới dạng npm package
- Nhúng binary cho từng platform
- Synchronous API (Promise/AsyncGenerator)
- Thực thi 1-turn completion

### codex-viewer

**Mục đích**: Là web-based viewer app để quản lý và visualize nhiều Codex sessions

**Link**: [GitHub](https://github.com/nogataka/codex-viewer) | [README (日本語)](https://github.com/nogataka/codex-viewer/blob/main/README.ja.md)

**Đặc điểm:**
- Next.js application
- Sử dụng lệnh `codex` đã cài trong hệ thống
- Communication qua asynchronous event bus
- Hỗ trợ long-running, multi-turn
- Realtime file monitoring (SSE)
- Điều khiển Codex session trực tiếp từ browser

---

## So sánh Architecture

### Architecture của Codex TypeScript SDK

**Đặc điểm:**
- Synchronous flow
- Binary được nhúng
- Caller nhận trực tiếp kết quả

### Architecture của codex-viewer

**Đặc điểm:**
- Asynchronous event-driven
- Sử dụng system command
- Thông báo tới frontend qua EventBus
- Quản lý multiple requests bằng task queue

---

## So sánh Implementation

### 1. Binary Location

#### Tại sao Codex TypeScript SDK nhúng binary riêng?

**Q: Tại sao không dùng lệnh `codex` của hệ thống?**

Lý do SDK nhúng binary là vì **reliability và user experience**:

| Khía cạnh | Nhúng binary | Phụ thuộc system command |
|----------|--------------|--------------------------|
| **Installation** | Chỉ cần `npm install` ✅ | Phải cài codex riêng ❌ |
| **Version consistency** | SDK và binary version đồng bộ ✅ | Có thể version mismatch ❌ |
| **Production** | Quản lý qua package.json ✅ | Sysadmin phải cài riêng ❌ |
| **CI/CD** | `npm ci` tự động cài ✅ | Phải thêm install step ❌ |
| **Cross-platform** | Tự động detect OS và dùng binary phù hợp ✅ | Phải cài riêng trên từng OS ❌ |
| **Distribution** | Hoàn chỉnh với npm package ✅ | Phức tạp khi hướng dẫn end-user ❌ |

**Ví dụ 1: Version mismatch problem**

```bash
# Scenario có vấn đề (phụ thuộc system command)
$ codex --version
0.40.0  # Version cũ đã cài

$ npm install @openai/hypothetical-sdk@1.5.0
# SDK này yêu cầu codex 0.46.0+,
# nhưng hệ thống chỉ có 0.40.0
# → Runtime error ❌
```

```bash
# Với Codex TypeScript SDK (nhúng binary)
$ npm install @openai/codex-sdk@1.5.0
# Binary codex 0.46.0 được tự động include
# → Hoạt động ngay ✅
```

**Tradeoff:**

| Nhược điểm | Impact | Giải pháp |
|-----------|--------|----------|
| Package size lớn | 197MB (6 platforms) | Tăng thời gian download |
| Disk usage | 197MB mỗi project | npm dedupe có thể share |
| Theo kịp latest version | Phải đợi SDK release | Dùng codexPathOverride để bypass |

**Kết luận:**

SDK nhúng binary để cung cấp trải nghiệm **"chỉ cần npm install là chạy được"**. Điều này đặc biệt quan trọng với:

- 🏢 **Enterprise**: Install phức tạp sẽ là rào cản khi triển khai internal tools
- 🚀 **SaaS products**: Không thể yêu cầu end-users "hãy cài Codex"
- 🔄 **CI/CD**: Pipeline đơn giản hơn, dễ troubleshoot
- 📦 **Reproducibility**: `package-lock.json` cũng fix binary version

Nói cách khác: **Trả 197MB disk space để mua developer experience và reliability**.

#### Thực tế về embedded binary

**Installed location:**

```bash
# npm install @openai/codex-sdk sẽ đặt binary tại
node_modules/@openai/codex-sdk/vendor/
├── aarch64-apple-darwin/codex/codex          # macOS Apple Silicon (27MB)
├── x86_64-apple-darwin/codex/codex           # macOS Intel (30MB)
├── aarch64-unknown-linux-musl/codex/codex    # Linux ARM64 (33MB)
├── x86_64-unknown-linux-musl/codex/codex     # Linux x86_64 (39MB)
├── aarch64-pc-windows-msvc/codex/codex.exe   # Windows ARM64 (32MB)
└── x86_64-pc-windows-msvc/codex/codex.exe    # Windows x86_64 (37MB)
                                               # Total: ~198MB
```

#### Codex TypeScript SDK

```typescript
// sdk/typescript/src/exec.ts:142-198
function findCodexPath() {
  const { platform, arch } = process;
  
  // Xác định target triple từ platform và architecture
  let targetTriple = null;
  switch (platform) {
    case "darwin":
      targetTriple = arch === "arm64" 
        ? "aarch64-apple-darwin" 
        : "x86_64-apple-darwin";
      break;
    // ...
  }
  
  // Xây dựng binary path trong package
  const vendorRoot = path.join(scriptDirName, "..", "vendor");
  const binaryPath = path.join(vendorRoot, targetTriple, "codex", "codex");
  
  return binaryPath;
}
```

**Binary được thực thi:**
```
node_modules/@openai/codex-sdk/vendor/aarch64-apple-darwin/codex/codex
```

**Config file:**
```
~/.codex/config.toml  # ⭐ Dùng cùng location với codex thông thường
```

> **Quan trọng**: Codex TypeScript SDK không có config file riêng. Binary nhúng cũng đọc `~/.codex/config.toml` giống như codex cài trong hệ thống. Có thể share config giữa SDK và CLI.

#### codex-viewer

```typescript
// src/server/service/codex/CodexTaskController.ts:228
const child = spawn("codex", args, {
  cwd: options.cwd,
  env: childEnv,
  stdio: ["ignore", "pipe", "pipe"],
});
```

**Binary được thực thi:**
```
/usr/local/bin/codex  # codex trong PATH của hệ thống
```

**Config file:**
```
~/.codex/config.toml  # SDK, CLI, codex-viewer đều share cùng config
```

### 2. Command Arguments

#### Codex TypeScript SDK

```typescript
// sdk/typescript/src/exec.ts:36-60
const commandArgs: string[] = ["exec", "--experimental-json"];

if (args.model) {
  commandArgs.push("--model", args.model);
}

if (args.sandboxMode) {
  commandArgs.push("--sandbox", args.sandboxMode);
}

if (args.workingDirectory) {
  commandArgs.push("--cd", args.workingDirectory);
}

if (args.threadId) {
  commandArgs.push("resume", args.threadId);
}
```

**Ví dụ thực thi:**
```bash
codex exec --experimental-json --model gpt-5 --sandbox read-only
```

**Đặc điểm:**
- Dùng `--experimental-json` (JSON output chi tiết hơn)
- Arguments tối thiểu
- Chỉ có options do user chỉ định

#### codex-viewer

```typescript
// src/server/service/codex/CodexTaskController.ts:188-219
const jsonFlag = (() => {
  const useExperimental = process.env.CODEX_USE_EXPERIMENTAL_JSON;
  if (useExperimental && ["1", "true", "yes"].includes(useExperimental.toLowerCase())) {
    return "--experimental-json";
  }
  return "--json";
})();

const args = [
  "exec",
  jsonFlag,  // --json hoặc --experimental-json
  "--sandbox",
  "workspace-write",
  "-c",
  'sandbox_workspace_write={network_access=true,writable_roots=["~/.cache","~/.uv"]}',
  "-c",
  "mcp_servers.serena.startup_timeout_sec=30",
  "--cd",
  options.cwd,
];

if (options.sessionUuid) {
  args.push("resume", options.sessionUuid, options.message);
} else {
  args.push(options.message);
}
```

**Ví dụ thực thi:**
```bash
codex exec \
  --json \
  --sandbox workspace-write \
  -c 'sandbox_workspace_write={network_access=true,writable_roots=["~/.cache","~/.uv"]}' \
  -c 'mcp_servers.serena.startup_timeout_sec=30' \
  --cd /path/to/project \
  "Execute task"
```

**Đặc điểm:**
- Mặc định `--json` (có thể chuyển sang `--experimental-json` qua env var)
- Bao gồm config dành riêng cho viewer
  - Enable network access
  - Cho phép ghi vào `~/.cache`, `~/.uv`
  - MCP server timeout settings
- Message được truyền trực tiếp dưới dạng argument

---

## Tổng kết

### Sự khác biệt chính

| Khía cạnh | Codex TypeScript SDK | codex-viewer |
|----------|---------------------|--------------|
| **Mục đích** | Thư viện đa năng | Web viewer app |
| **Binary** | Nhúng (197MB) | System command |
| **Config file** | ~/.codex/config.toml (share) | ~/.codex/config.toml (share) |
| **Input** | stdin | Command arguments |
| **Output** | stdout stream | File + EventBus |
| **Session mgmt** | Không (1-turn) | Task queue |
| **Data retrieval** | Realtime (stdout) | File-based |
| **Use case** | Node.js apps | Web apps |
| **Distribution** | npm package | Next.js app |

> **Quan trọng**: Cả SDK và codex-viewer đều dùng cùng `~/.codex` directory. Config, credentials, session history đều được share.

### Hướng dẫn lựa chọn

**Nên dùng Codex TypeScript SDK khi:**
- ✅ Muốn nhúng vào Node.js application
- ✅ Cần programmatic control
- ✅ Muốn fix binary version
- ✅ Task 1-turn completion

**Nên tham khảo codex-viewer khi:**
- ✅ Muốn xây web-based interface
- ✅ Quản lý nhiều sessions
- ✅ Xử lý long-running tasks
- ✅ Cần file-based persistence

---

## Tài liệu tham khảo

### Codex TypeScript SDK
- [Codex TypeScript SDK Reference](https://qiita.com/nogataka/items/sdk-reference-ja.md)

### codex-viewer
- [codex-viewer GitHub](https://github.com/nogataka/codex-viewer)
- [codex-viewer README (日本語)](https://github.com/nogataka/codex-viewer/blob/main/README.ja.md)
- [Qiita: Codex Viewer Guide](https://qiita.com/nogataka/items/28d04db421663a4a46fd)

### Coding Agent Viewer SDK
- [Coding Agent Viewer GitHub](https://github.com/nogataka/coding-agent-viewer)
- [npm: @nogataka/coding-agent-viewer-sdk](https://www.npmjs.com/package/@nogataka/coding-agent-viewer-sdk)
- [Qiita: Chỉ 3 dòng code để quản lý AI Agent!](https://qiita.com/nogataka/items/5e48f85795a0ace124ba)

---

## Kết luận

Codex TypeScript SDK và codex-viewer là kết quả của những quyết định thiết kế khác nhau cho cùng một bài toán: **"Làm thế nào để gọi Codex binary?"**

- Codex TypeScript SDK ưu tiên developer experience "chỉ cần npm install là chạy", đạt được reliability và reproducibility bằng cách nhúng binary.
- codex-viewer ưu tiên "realtime management nhiều sessions", đảm bảo flexibility và extensibility bằng system command và file-based sync.

Quan trọng là chọn approach phù hợp với use case của bạn.

Hy vọng tài liệu này giúp bạn hiểu sâu hơn về Codex và chọn được approach tối ưu cho project.

---

**Tags**: #AI #codex #AI駆動開発 #CodexCLI #codex-viewer
