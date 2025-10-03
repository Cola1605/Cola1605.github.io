# 🚀 Hugo Incremental Build System

Hệ thống build thông minh cho Hugo blog, chỉ xử lý file mới và đã thay đổi để tiết kiệm thời gian.

## ✨ Tính năng chính

- **⚡ Incremental Build**: Chỉ build file mới hoặc đã thay đổi
- **👀 File Watcher**: Tự động detect và build khi có file mới
- **💾 Build Cache**: Lưu cache để tracking file changes
- **🎯 Smart Detection**: Detect chính xác file nào cần rebuild
- **📊 Build Statistics**: Báo cáo chi tiết về quá trình build

## 🛠️ Cách sử dụng

### Lệnh cơ bản (Makefile)

```bash
# Xem tất cả lệnh available
make help

# Build incremental (chỉ file mới/đã thay đổi)
make incremental

# Build full (tất cả file)
make build

# Tạo blog post mới
make new TITLE="Tiêu đề bài viết"

# Xem trạng thái blog
make status

# Start file watcher (tự động build khi có thay đổi)
make watch

# Clean cache và rebuild toàn bộ
make clean

# Deploy lên GitHub Pages
make deploy
```

### Lệnh trực tiếp

```bash
# Chạy incremental build
./scripts/incremental-build.sh

# Start file watcher
./scripts/watch-and-build.sh
```

## 📁 Cấu trúc files

```
scripts/
├── incremental-build.sh    # Script build incremental
├── watch-and-build.sh      # Script file watcher  
└── build.config           # File cấu hình

.build-cache               # Cache file tracking changes
build.log                  # Log file build history
Makefile                   # Lệnh make tiện lợi
```

## 🔧 Workflow thực tế

### 1. Thêm bài viết mới

```bash
# Tạo bài viết mới
make new TITLE="Tên bài viết"

# Chỉnh sửa file vừa tạo
# File sẽ ở: content/posts/ten_bai_viet_YYYYMMDD.md

# Build chỉ file mới (nhanh)
make incremental
```

### 2. Chế độ development

```bash
# Start file watcher (build tự động khi save file)
make watch

# Hoặc dùng Hugo dev server
make serve
```

### 3. Deploy production

```bash
# Build và deploy lên GitHub Pages
make deploy
```

## 📊 Ví dụ output

### Incremental Build (có file mới)
```
🚀 Starting incremental build process...
🔍 Checking for new or modified files in content/posts...
✅ New file detected: new_article.md
📊 Found 1 file(s) to process:
   - New files: 1
   - Modified files: 0
🔨 Starting Hugo build...
✅ Hugo build completed successfully
🎉 Incremental build completed! Processed 1 file(s).
```

### Incremental Build (không có thay đổi)
```
🚀 Starting incremental build process...
🔍 Checking for new or modified files in content/posts...
✨ No new or modified files found. Build cache is up to date.
⏱️ Last build: Fri Oct  3 17:27:55 JST 2025
```

### Status Report
```
📊 Blog Status Report
====================
📝 Markdown files: 17
🌐 Generated pages: 237
💾 Cache entries: 17
📅 Last build: Fri Oct  3 17:27:49 JST 2025
💽 Public directory size: 4.4M
```

## ⚙️ Cấu hình

Chỉnh sửa `scripts/build.config` để tùy chỉnh:

```bash
# Thư mục theo dõi
WATCH_DIRS=content/posts,content/about,static,layouts

# File extensions theo dõi
WATCH_EXTENSIONS=.md,.html,.css,.js,.json

# Hugo build options
HUGO_ARGS=--gc --minify --quiet

# Auto-deployment
AUTO_DEPLOY=false
```

## 🎯 Lợi ích

- **⚡ Tốc độ**: Build chỉ file thay đổi thay vì toàn bộ site
- **💾 Tiết kiệm**: Không waste thời gian rebuild file cũ
- **🤖 Tự động**: File watcher detect và build automatic
- **📊 Thông minh**: Cache system tracking chính xác changes
- **🔧 Tiện lợi**: Makefile commands dễ nhớ và sử dụng

## 🚨 Lưu ý

- Lần đầu chạy sẽ build tất cả file (tạo cache)
- File cache `.build-cache` không nên xóa trừ khi muốn rebuild all
- File watcher cần `fswatch` trên macOS (`brew install fswatch`)
- Script tự động cài `fswatch` nếu chưa có

## 🎉 Kết quả

Với system này, thời gian build từ ~77ms (full build) xuống còn ~20ms (incremental) cho 1 file mới - **tăng tốc hơn 3 lần**!