---
title: "Xác Thực SSH qua ssh-agent Sử Dụng Password Manager"
date: 2025-12-04T18:00:00+09:00
categories: ["Security and Networking", "DevOps and Infrastructure", "Development"]
tags: ["SSH", "ssh-agent", "Password Manager", "Bitwarden", "GitHub", "Security", "Supply Chain Attack", "Dev Container", "Deploy Key", "CI/CD"]
author: "Kanetsuna Masaaya"
translatedBy: "日平"
description: "Chiến lược migration từ Personal Access Token sang SSH authentication với password manager và ssh-agent để tăng cường bảo mật trong bối cảnh tấn công supply chain Shai-Hulud 2.0"
---

## Giới Thiệu

Vào ngày 24 tháng 11 năm 2025, một cuộc tấn công supply chain nghiêm trọng mang tên **Shai-Hulud 2.0** đã xảy ra, nhắm vào hệ sinh thái npm. Cuộc tấn công này đã làm nổi bật những rủi ro nghiêm trọng liên quan đến việc lưu trữ và sử dụng secret information (thông tin bảo mật) trong các quy trình phát triển phần mềm, đặc biệt là Personal Access Token (PAT) trên GitHub.

Bài viết này sẽ phân tích chi tiết về cuộc tấn công Shai-Hulud 2.0, các vấn đề bảo mật của PAT, và đề xuất một chiến lược migration toàn diện từ PAT sang **SSH authentication** sử dụng **password manager** kết hợp với **ssh-agent**. Giải pháp này giúp minimize việc expose secret information và tăng cường bảo mật cho cả môi trường local development, Dev Container, và CI/CD.

## Shai-Hulud 2.0: Cuộc Tấn Công Supply Chain Nghiêm Trọng

### Tổng Quan về Cuộc Tấn Công

**Ngày xảy ra:** 24 tháng 11 năm 2025

Shai-Hulud 2.0 là một cuộc tấn công supply chain tinh vi nhắm vào npm package ecosystem. Đây không phải là một sự cố ngẫu nhiên mà là một chiến dịch có tổ chức với mục tiêu đánh cắp thông tin nhạy cảm từ các dự án sử dụng các package phổ biến.

### Cơ Chế Tấn Công

Cuộc tấn công Shai-Hulud 2.0 diễn ra qua **5 bước** chính:

**Bước 1: Chiếm Quyền Điều Khiển Tài Khoản npm Maintainer**
- Kẻ tấn công sử dụng các phương pháp như phishing, credential stuffing, hoặc khai thác lỗ hổng để chiếm quyền truy cập vào tài khoản của các maintainer (người bảo trì) của các package phổ biến trên npm.

**Bước 2: Trojanize Package Phổ Biến**
- Sau khi có quyền truy cập, kẻ tấn công inject malware vào các package phổ biến, biến chúng thành "Trojan horse" (ngựa thành Troy).
- Malware được chèn một cách tinh vi để tránh bị phát hiện bởi các công cụ kiểm tra tự động.

**Bước 3: Thực Thi Malware qua preinstall Script**
- Malware được cấu hình để chạy tự động thông qua **preinstall script** - một npm lifecycle hook được thực thi trước khi package được cài đặt.
- Điều này có nghĩa là ngay khi developer chạy `npm install`, malware sẽ được kích hoạt mà không cần bất kỳ hành động nào khác.

**Bước 4: Exfiltrate Secret Information**
- Malware quét và thu thập các thông tin nhạy cảm trong môi trường của developer:
  - Environment variables chứa API keys, tokens
  - Các file cấu hình (`.env`, `.npmrc`, etc.)
  - SSH keys và Git credentials
  - Personal Access Tokens (PAT) của GitHub
- Thông tin này sau đó được gửi về các repository mà kẻ tấn công kiểm soát.

**Bước 5: Publish Phiên Bản Malicious**
- Kẻ tấn công publish các phiên bản mới của package đã bị nhiễm malware lên npm registry.
- Các developer không nghi ngờ sẽ tự động cập nhật lên phiên bản này, làm lan rộng cuộc tấn công.

### Sự Cố Được Báo Cáo

Một trong những sự cố nghiêm trọng được báo cáo là việc **đăng ký self-hosted runner** trên GitHub Actions. Điều này cho thấy:

- Kẻ tấn công đã đánh cắp được Personal Access Token (PAT) với quyền cao
- Sử dụng token này để đăng ký self-hosted runner vào các tổ chức/repository
- Một khi self-hosted runner được đăng ký, kẻ tấn công có thể:
  - Chạy arbitrary code trong môi trường CI/CD
  - Đánh cắp thêm secret information từ workflows
  - Inject malicious code vào build artifacts
  - Chiếm quyền điều khiển toàn bộ pipeline deployment

### Nguồn Tham Khảo

Ba tổ chức bảo mật uy tín đã công bố phân tích chi tiết về cuộc tấn công này:

1. **Wiz.io** - [Shai-Hulud 2.0](https://wiz.io/blog/shai-hulud-2-0)
   - Phân tích kỹ thuật về cơ chế tấn công
   - Impact assessment cho cloud infrastructure

2. **Cybelangel** - [Supply Chain Attack Campaign Shai-Hulud Expands](https://cybelangel.com/blog/supply-chain-attack-campaign-shai-hulud-expands/)
   - Theo dõi sự lan rộng của chiến dịch
   - Phân tích về các indicator of compromise (IOC)

3. **Netskope** - [A Deep Dive into the Shai-Hulud 2.0 Supply Chain Attack on NPM](https://netskope.com/blog/a-deep-dive-into-the-shai-hulud-2-0-supply-chain-attack-on-npm)
   - Deep dive vào npm ecosystem impact
   - Khuyến nghị bảo mật chi tiết

## Vấn Đề Bảo Mật của Personal Access Token (PAT)

### Vấn Đề Cốt Lõi

Vấn đề căn bản không phải là việc scope của token có "fine-grained" (chi tiết) hay không, mà là:

> **"Việc process có thể truy cập trực tiếp vào secret information chính là vấn đề cốt lõi"**

Dù GitHub đã cải thiện hệ thống PAT với fine-grained permissions, nhưng miễn là secret token tồn tại dưới dạng plaintext trong process memory, nó vẫn có thể bị đánh cắp bởi malware.

### Các Sai Lầm Phổ Biến

**1. Cấp Quyền Quá Rộng (Excessive Permissions)**
```bash
# Token với quá nhiều quyền không cần thiết
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx  # với quyền: repo, workflow, admin:org, delete_repo
```

- Developer thường có xu hướng cấp "full permissions" để "cho chắc chắn"
- Khi token bị leak, kẻ tấn công có quyền rộng rãi để gây thiệt hại

**2. Lưu Trữ Plaintext trong Environment Variables**
```bash
# .bashrc hoặc .zshrc
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
export NPM_TOKEN="npm_xxxxxxxxxxxxxxxxxxxx"
```

- Environment variables có thể bị leak qua:
  - Process listings (`ps aux | grep TOKEN`)
  - Log files
  - Error messages
  - Memory dumps

**3. Token Residue trong Container Images**
```dockerfile
# ❌ SAI LẦM: Token sẽ nằm trong container layer
RUN git clone https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/user/repo.git

# ❌ SAI LẦM: Token trong build args vẫn bị lưu trong image history
ARG GITHUB_TOKEN
RUN git clone https://${GITHUB_TOKEN}@github.com/user/repo.git
```

- Token bị "burned into" container image layers
- Kể cả khi đã xóa file, token vẫn tồn tại trong image history
- Bất kỳ ai pull image đều có thể extract token từ history

### Paradigm Shift Cần Thiết

Cần thay đổi tư duy từ:

**❌ Cách Suy Nghĩ Cũ:**
> "Chỉ cần set scope token cho phù hợp là an toàn"

**✅ Cách Suy Nghĩ Mới:**
> "Minimize việc expose secret information, và chỉ nhận quyền gián tiếp khi cần thiết"

### Nguyên Tắc Mới

1. **Tránh Direct Access:** Process không nên truy cập trực tiếp vào secret information
2. **Indirect Permission Reception:** Sử dụng delegation mechanisms (như ssh-agent) để nhận quyền gián tiếp
3. **Minimal Exposure:** Secret information chỉ tồn tại ở nơi tối thiểu cần thiết (ví dụ: chỉ trong agent memory)
4. **Short-lived Credentials:** Ưu tiên sử dụng credentials ngắn hạn khi có thể

## Chiến Lược Migration: PAT → SSH Authentication

### Tổng Quan

Migration strategy này tập trung vào **Git operations**, không bao gồm GitHub API usage. Chiến lược được thiết kế để hoạt động hiệu quả trên ba môi trường:

1. **Local Development Environment** (Môi trường phát triển cá nhân)
2. **Dev Container** (Container môi trường phát triển)
3. **CI/CD Environment** (GitHub Actions)

### Nguyên Tắc Cốt Lõi

Hai nguyên tắc chính cần tuân thủ:

**Nguyên Tắc 1: Không Lưu Private Key Trên Disk**
- Private SSH key không được lưu trữ dưới dạng file trên filesystem
- Điều này ngăn chặn malware scan và đánh cắp key từ `~/.ssh` directory

**Nguyên Tắc 2: Process Không Đọc Trực Tiếp Private Key**
- Khi thực hiện Git operations, process không được read raw private key data
- Thay vào đó, sử dụng delegation mechanism để request signature

## Quản Lý SSH Key cho Local và Dev Container

### Solution: Password Manager + ssh-agent

Kết hợp hai công cụ:
- **Password Manager**: Bitwarden, 1Password, etc.
- **ssh-agent**: Unix utility để manage SSH keys

### SSH Agent: Cơ Chế Hoạt Động

#### Kiến Trúc

```
┌─────────────────────┐
│   Git Client        │
│   (Your Process)    │
└──────────┬──────────┘
           │ Request signature
           ↓
┌─────────────────────┐
│   Unix Socket       │
│   $SSH_AUTH_SOCK    │
└──────────┬──────────┘
           │ Forward request
           ↓
┌─────────────────────┐
│   ssh-agent         │
│   (Separate Process)│
│   [Private Key]     │
└──────────┬──────────┘
           │ Return signature
           ↓
   Back to Git Client
```

#### Đặc Điểm Kỹ Thuật

**1. Unix Domain Socket Communication**
- ssh-agent lắng nghe trên Unix domain socket
- Socket path được store trong environment variable `SSH_AUTH_SOCK`
- Client processes giao tiếp với agent qua socket này

**2. Process Separation**
- Private key chỉ tồn tại trong memory của ssh-agent process
- Client process (Git, SSH, etc.) không bao giờ truy cập trực tiếp private key
- Mỗi operation cần signature đều được delegate tới agent

**3. Signature Delegation**
```
Client: "Tôi cần sign data này"
        → Send data to ssh-agent via socket
ssh-agent: "OK, tôi sẽ sign với private key"
        → Sign data with private key in its memory
        → Return signature only
Client: "Nhận signature, gửi tới server"
```

**4. Security Benefit**
- Malware chạy trong client process không thể đọc private key
- Malware phải compromise ssh-agent process (khó hơn nhiều)
- Ngay cả khi compromise được client process, chỉ request được signatures, không lấy được key

### Bitwarden SSH Agent

Bitwarden cung cấp built-in SSH Agent functionality với các đặc điểm:

**1. Key Storage in Memory Only**
```
┌─────────────────────────────┐
│   Bitwarden Vault (Encrypted)│
│   - SSH Key Pairs            │
└──────────────┬───────────────┘
               │ Unlock vault
               ↓
┌─────────────────────────────┐
│   Bitwarden SSH Agent        │
│   (Decrypted keys in memory) │
│   - Never written to disk    │
└──────────────────────────────┘
```

**2. Filesystem Protection**
- Decrypted private keys **chỉ tồn tại trong memory** của Bitwarden SSH Agent
- Không bao giờ được write vào `~/.ssh` directory dưới dạng file
- Malware scan `~/.ssh` sẽ không tìm thấy gì

**3. Malware Resistance**
```bash
# Malware thường làm:
$ ls -la ~/.ssh/
# → Sẽ KHÔNG thấy private key files

$ cat ~/.ssh/id_rsa
# → File KHÔNG tồn tại

$ find ~ -name "id_rsa" -o -name "id_ed25519"
# → Không kết quả
```

### Workflow 5 Bước

**Bước 1: Login và Unlock Vault**
```bash
# Đăng nhập vào password manager
$ bitwarden-cli login
# Hoặc sử dụng GUI application
# Unlock vault để truy cập SSH keys
```

**Bước 2: Generate SSH Key Pair**
- Sử dụng password manager để generate SSH key pair
- Bitwarden: Vault → Add Item → SSH Key
- 1Password: Vault → New Item → SSH Key
- Key được store encrypted trong vault

**Bước 3: Đăng Ký Public Key lên GitHub**
```bash
# Copy public key từ password manager
# Paste vào: GitHub → Settings → SSH and GPG keys → New SSH key
```

Hoặc sử dụng GitHub CLI:
```bash
$ gh ssh-key add ~/.ssh/id_ed25519.pub --title "My Dev Machine"
```

**Bước 4: Enable SSH Agent**

Cho Bitwarden:
```bash
# Set SSH_AUTH_SOCK environment variable
export SSH_AUTH_SOCK="$HOME/.config/Bitwarden CLI/sockets/ssh-agent.sock"

# Hoặc thêm vào ~/.bashrc / ~/.zshrc
echo 'export SSH_AUTH_SOCK="$HOME/.config/Bitwarden CLI/sockets/ssh-agent.sock"' >> ~/.zshrc
```

Cho 1Password:
```bash
export SSH_AUTH_SOCK=~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock
```

Verify ssh-agent hoạt động:
```bash
$ ssh-add -l
# → Sẽ list SSH keys available trong agent
```

**Bước 5: Thực Hiện Git Operations**

Từ giờ, tất cả Git operations qua SSH đều được thực hiện thông qua socket:

```bash
# Clone repository
$ git clone git@github.com:username/repo.git

# Quá trình diễn ra:
# 1. Git client cần authenticate với GitHub
# 2. Git gọi SSH với git@github.com
# 3. SSH client check $SSH_AUTH_SOCK
# 4. SSH client gửi request tới ssh-agent qua socket
# 5. ssh-agent sign challenge với private key trong memory
# 6. ssh-agent return signature
# 7. SSH client gửi signature tới GitHub
# 8. GitHub verify signature với public key đã đăng ký
# 9. Authentication thành công
```

**Key Point:** Process của bạn (Git, SSH client) **không bao giờ touch private key** trực tiếp!

## Cấu Hình Dev Container

### Mục Tiêu

Reproduce ssh-agent workflow trong Dev Container environment để:
- Developers có thể clone/push code từ trong container
- Private key vẫn không tồn tại trong container filesystem
- Sử dụng ssh-agent của host machine

### Cấu Hình File

#### 1. `.devcontainer/devcontainer.json`

```json
{
  "dockerComposeFile": "../docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace"
}
```

**Giải thích:**
- `dockerComposeFile`: Sử dụng Docker Compose để setup container
- `service`: Tên service trong docker-compose.yml
- `workspaceFolder`: Working directory trong container

#### 2. `docker-compose.yml`

```yaml
services:
  app:
    image: mcr.microsoft.com/devcontainers/base:ubuntu
    volumes:
      # Mount host's ssh-agent socket into container
      - ${SSH_AUTH_SOCK}:/ssh-agent:ro
      # Mount workspace
      - .:/workspace:cached
    environment:
      # Point SSH_AUTH_SOCK to the mounted socket
      - SSH_AUTH_SOCK=/ssh-agent
    working_dir: /workspace
```

**Giải thích chi tiết:**

**Volume Mount - SSH Agent Socket:**
```yaml
- ${SSH_AUTH_SOCK}:/ssh-agent:ro
```
- `${SSH_AUTH_SOCK}`: Host machine's socket path (ví dụ: `/tmp/ssh-XXXX/agent.1234`)
- `:/ssh-agent`: Mount vào `/ssh-agent` trong container
- `:ro`: Read-only permission (container không thể modify socket)

**Environment Variable Override:**
```yaml
- SSH_AUTH_SOCK=/ssh-agent
```
- Override `SSH_AUTH_SOCK` trong container để point tới socket đã mount
- SSH client trong container sẽ tự động sử dụng socket này

### Cơ Chế Hoạt Động

```
┌─────────────────────────────────────┐
│          Host Machine               │
│                                      │
│  ┌────────────────────────┐         │
│  │   Bitwarden SSH Agent   │         │
│  │   [Private Key in RAM]  │         │
│  └──────────┬─────────────┘         │
│             │                        │
│             ↓                        │
│    /tmp/ssh-XXX/agent.sock ←──────┐ │
│         (Unix Socket)              │ │
└─────────────────────────────────────┘ │
              │                         │
              │ Mount (read-only)       │
              ↓                         │
┌─────────────────────────────────────┐ │
│       Dev Container                 │ │
│                                      │ │
│  /ssh-agent ←────────────────────────┘ │
│  (Mounted Socket)                    │
│                                      │
│  SSH_AUTH_SOCK=/ssh-agent            │
│                                      │
│  ┌────────────────────────┐         │
│  │   Git Client            │         │
│  │   (Your Development)    │         │
│  └──────────┬─────────────┘         │
│             │                        │
│             ↓                        │
│      Request signature               │
│      via /ssh-agent socket           │
└─────────────────────────────────────┘
```

### Bảo Mật Benefits

**1. Socket-Only Mount**
```yaml
# ✅ ĐÚNG: Mount socket only
- ${SSH_AUTH_SOCK}:/ssh-agent:ro

# ❌ SAI: Mount entire .ssh directory
- ~/.ssh:/root/.ssh  # KHÔNG NÊN LÀM!
```

**2. Private Key Never in Container Filesystem**
```bash
# Trong container:
$ find / -name "id_rsa" -o -name "id_ed25519" 2>/dev/null
# → Không tìm thấy gì

$ ls -la /ssh-agent
# → srwxr-xr-x 1 root root 0 Dec  4 10:00 /ssh-agent
# → Chỉ là socket, không phải file chứa key
```

**3. Read-Only Socket**
- Container chỉ có thể **request signatures** qua socket
- Container **không thể modify** socket hoặc inject malicious commands
- Nếu container bị compromise, không thể steal private key

### Test Cấu Hình

```bash
# 1. Build và start Dev Container
$ code .
# VS Code sẽ prompt để reopen in container

# 2. Trong container, verify ssh-agent
$ echo $SSH_AUTH_SOCK
# → /ssh-agent

$ ssh-add -l
# → 256 SHA256:xxxx... your-email@example.com (ED25519)
# → Keys từ host's ssh-agent

# 3. Test Git operation
$ git clone git@github.com:username/private-repo.git
# → Thành công mà không cần nhập password hoặc token!

# 4. Verify key không tồn tại trong container
$ ls -la ~/.ssh/
# → Directory có thể không tồn tại hoặc empty
```

## CI/CD Environment: GitHub Actions

### Context: Rủi Ro từ Shai-Hulud 2.0

Trong cuộc tấn công Shai-Hulud 2.0:
- Self-hosted runner registration được báo cáo
- Kẻ tấn công đã đánh cắp PAT với quyền cao
- Sử dụng PAT để đăng ký malicious self-hosted runners
- Runners này có thể chạy arbitrary code trong CI/CD environment

### Strategy: Deploy Key + ssh-agent

Thay vì sử dụng PAT, chúng ta sử dụng:
- **Deploy Key**: SSH key specific cho từng repository
- **ssh-agent**: Để manage keys trong workflow

### Implementation với webfactory/ssh-agent

#### GitHub Actions Workflow

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      # 1. Setup ssh-agent với private key
      - name: Setup SSH Agent
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
      
      # 2. Checkout code (sẽ dùng SSH nếu clone URL là git@...)
      - name: Checkout
        uses: actions/checkout@v4
      
      # 3. Build Docker image với git clone qua SSH
      - name: Build Docker Image
        run: |
          docker build -t myapp:latest .
```

**Giải thích:**

**webfactory/ssh-agent@v0.9.0:**
- Action này start một ssh-agent process trong workflow
- Load private key từ GitHub Secrets vào agent memory
- Set `SSH_AUTH_SOCK` environment variable
- Tất cả subsequent steps có thể sử dụng ssh-agent

**secrets.SSH_PRIVATE_KEY:**
- Deploy Key private key được store trong GitHub Secrets
- Settings → Secrets and variables → Actions → New repository secret
- Secret này chỉ tồn tại trong workflow runtime environment
- Không bao giờ logged hoặc exposed

#### Dockerfile với SSH Mount

```dockerfile
FROM node:20-alpine

# Install git và ssh client
RUN apk add --no-cache git openssh-client

# Add GitHub's host key to known_hosts
# Điều này ngăn SSH hỏi "Are you sure you want to continue connecting?"
RUN mkdir -p /etc/ssh && \
    ssh-keyscan github.com >> /etc/ssh/ssh_known_hosts

# Clone private repository sử dụng SSH mount
# --mount=type=ssh cho phép Docker build access ssh-agent của host
RUN --mount=type=ssh git clone git@github.com:username/private-repo.git /app/private-repo

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
```

**Giải thích:**

**`RUN --mount=type=ssh`:**
- Docker BuildKit feature
- Mount ssh-agent socket vào build container
- Private key **không bị copy** vào image layers
- Chỉ có signature communication qua socket

**Build command:**
```bash
# Enable BuildKit và build với SSH agent forwarding
$ DOCKER_BUILDKIT=1 docker build --ssh default .
```

Trong GitHub Actions:
```yaml
- name: Build Docker Image
  env:
    DOCKER_BUILDKIT: 1
  run: |
    docker build --ssh default -t myapp:latest .
```

### Security Principles

#### 1. Key Chỉ Trong Temp Environment và Agent Memory

```
GitHub Actions Workflow Runtime
┌─────────────────────────────────┐
│  secrets.SSH_PRIVATE_KEY        │
│  (Injected into workflow)       │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  webfactory/ssh-agent           │
│  - Start ssh-agent process      │
│  - Load key into agent memory   │
│  - Key NEVER written to disk    │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Docker Build Process           │
│  - Access via socket only       │
│  - Key NOT in image layers      │
└─────────────────────────────────┘
```

**Key Points:**
- Private key chỉ tồn tại trong:
  1. GitHub Secrets (encrypted at rest)
  2. Workflow runtime environment (temporary)
  3. ssh-agent memory (ephemeral)
- Sau khi workflow complete, tất cả environments bị destroy
- Key không bao giờ persist trong container images

#### 2. Tránh Echo Mistakes

```yaml
# ❌ NGUY HIỂM: Không bao giờ echo secrets!
- name: Debug
  run: |
    echo "SSH Key: ${{ secrets.SSH_PRIVATE_KEY }}"  # SẼ BỊ LOG!

# ❌ NGUY HIỂM: Không pass secret qua command line
- name: Bad Practice
  run: |
    ssh-add - <<< "${{ secrets.SSH_PRIVATE_KEY }}"  # Có thể leak via process list

# ✅ AN TOÀN: Sử dụng dedicated actions
- name: Setup SSH
  uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
```

**GitHub Actions tự động mask secrets trong logs, nhưng:**
- Có thể bypass accidentally qua base64 encoding, hex encoding, etc.
- Better safe: Không echo bất kỳ variable nào có thể chứa secrets

#### 3. Repository-Specific Deploy Keys

**Deploy Key vs Personal SSH Key:**

| Aspect | Deploy Key | Personal SSH Key |
|--------|-----------|------------------|
| Scope | Single repository | All accessible repos |
| Permissions | Read or Read+Write per repo | Based on user permissions |
| Revocation | Per repository | All access lost |
| Security | Isolated blast radius | Wide impact if compromised |
| Recommended for CI/CD | ✅ Yes | ❌ No |

**Setup Deploy Key:**

```bash
# 1. Generate key pair cho specific repository
$ ssh-keygen -t ed25519 -C "deploy-key-for-myrepo" -f deploy_key_myrepo
# → deploy_key_myrepo (private)
# → deploy_key_myrepo.pub (public)

# 2. Add public key to repository
# GitHub → Repository → Settings → Deploy keys → Add deploy key
# - Title: CI/CD Deploy Key
# - Key: (paste deploy_key_myrepo.pub content)
# - Allow write access: ☑ (nếu cần push)

# 3. Add private key to GitHub Secrets
# GitHub → Repository → Settings → Secrets → Actions
# - Name: SSH_PRIVATE_KEY
# - Value: (paste deploy_key_myrepo content)

# 4. Xóa local copies
$ shred -u deploy_key_myrepo deploy_key_myrepo.pub
```

#### 4. Deploy Key Permissions: Read-Only by Default

```
┌─────────────────────────────────┐
│      Deploy Key Settings        │
├─────────────────────────────────┤
│ Title: CI Build Key             │
│                                  │
│ Key: ssh-ed25519 AAAAC3...      │
│                                  │
│ ☐ Allow write access            │
│   (Default: Read-only)          │
└─────────────────────────────────┘
```

**Best Practice:**
- **Read-only by default**: Chỉ clone và fetch
- **Enable write** chỉ khi cần thiết:
  - Tự động commit build artifacts
  - Update documentation
  - Create releases

**Multiple Deploy Keys for Different Purposes:**
```yaml
# Repository có thể có multiple deploy keys:
Deploy Keys:
  1. "CI Read-Only Key" → Read-only → Cho build process
  2. "CD Deploy Key" → Read+Write → Cho deployment automation
  3. "Docs Update Key" → Read+Write → Cho documentation bots
```

### Dockerfile Best Practices

```dockerfile
FROM node:20-alpine AS builder

# Install dependencies
RUN apk add --no-cache git openssh-client

# Setup known_hosts
RUN mkdir -p /etc/ssh && \
    ssh-keyscan github.com >> /etc/ssh/ssh_known_hosts

# Clone dependencies (with SSH mount, key not in image)
RUN --mount=type=ssh \
    git clone git@github.com:company/private-lib.git /tmp/private-lib && \
    cd /tmp/private-lib && \
    npm pack && \
    mv *.tgz /app/

# Multi-stage build: Private repo content not in final image
FROM node:20-alpine

WORKDIR /app

# Copy only the packed library, not the git repo
COPY --from=builder /app/*.tgz ./

# Install from local package
RUN npm install ./*.tgz

COPY package*.json ./
RUN npm ci --production

COPY src ./src

CMD ["node", "src/index.js"]
```

**Security Highlights:**
1. **Multi-stage build**: Private repo chỉ tồn tại trong builder stage
2. **SSH mount**: Private key không bao giờ trong image layers
3. **Clean final image**: Chỉ có compiled/packed artifacts, không có git history

## Tóm Tắt

### Git Operations: SSH với Password Manager × ssh-agent

**Môi trường Local và Dev Container:**
- Sử dụng password manager (Bitwarden, 1Password) để store SSH keys
- Enable ssh-agent functionality
- Private keys chỉ tồn tại trong agent memory
- Git operations qua socket delegation
- Malware scanning filesystem sẽ không tìm thấy keys

**Benefits:**
- ✅ No private keys on disk
- ✅ Process không truy cập trực tiếp keys
- ✅ Malware resistance
- ✅ Dev Container support qua socket mounting
- ✅ Seamless Git workflow

### CI/CD: Deploy Key + ssh-agent Baseline

**GitHub Actions Environment:**
- Sử dụng Deploy Keys (repository-specific SSH keys)
- webfactory/ssh-agent để manage keys trong workflow
- Docker build với `--mount=type=ssh` để tránh key leakage
- Keys chỉ trong Secrets, runtime environment, và agent memory

**Security Principles:**
- ✅ Repository-specific keys (isolated blast radius)
- ✅ Read-only by default
- ✅ Keys không trong container images
- ✅ No secret echoing trong logs
- ✅ Ephemeral runtime environment

### Scope và Giới Hạn

**Bài viết này tập trung vào:**
- ✅ Git operations (clone, push, fetch, pull)
- ✅ SSH-based authentication
- ✅ Local, Dev Container, và CI/CD environments

**Ngoài scope:**
- ❌ GitHub API usage (vẫn cần PAT hoặc GitHub Apps)
- ❌ Package registry authentication (npm, PyPI, etc.)
- ❌ Cloud provider credentials (AWS, GCP, Azure)

**Khuyến nghị cho GitHub API:**
Nếu cần GitHub API access trong automation:
- Sử dụng **GitHub Apps** thay vì PAT
- GitHub Apps có fine-grained permissions
- Token có thể expire tự động
- Better audit trail

### Next Steps

1. **Audit hiện tại:**
   - List tất cả PATs đang sử dụng
   - Identify các use cases có thể migrate sang SSH
   - Document các API calls cần PAT

2. **Migration plan:**
   - Phase 1: Local development (password manager + ssh-agent)
   - Phase 2: Dev Container environments
   - Phase 3: CI/CD pipelines (Deploy Keys)

3. **Revoke old PATs:**
   - Sau khi migration complete
   - GitHub → Settings → Developer settings → Personal access tokens
   - Revoke unused tokens

4. **Monitor và audit:**
   - Setup alerts cho unauthorized SSH key additions
   - Regular audit của Deploy Keys
   - Review GitHub Actions logs định kỳ

---

**Tác giả:** Kanetsuna Masaaya (@ma_sa_a_ya)  
**Bộ phận:** AI事業本部 AIオペレーションテクノロジーカンパニー  
**Dịch giả:** 日平  
**Nguồn gốc:** [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/60093/)
