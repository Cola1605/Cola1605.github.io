---
title: "Build Java/Maven Chỉ Trong 1 Giây! Giảm 98% Thời Gian Với Docker Multi-stage Build + BuildKit"
date: 2025-10-28
draft: false
categories: ["DevOps", "Docker", "Java"]
tags: ["Docker", "BuildKit", "Maven", "Java", "Multi-stage-Build", "Performance-Optimization", "Cache-Optimization"]
description: "Tối ưu hóa thời gian build Docker cho Java/Maven từ 39 giây xuống 1 giây (cải thiện 98%) với Docker Multi-stage Build 3 tầng và BuildKit cache mount."
---

**Tác giả:** ntaka329 (永田) - GMOコネクト株式会社  
**Ngày xuất bản:** 2025-10-28  
**Tags:** Java, Maven, devops, Docker, BuildKit

---

## Tổng Quan

Bài viết chia sẻ quá trình tối ưu hóa thời gian build Docker cho ứng dụng Java/Maven, **giảm từ 39 giây xuống còn 1 giây (cải thiện 98%)** thông qua việc áp dụng Docker Multi-stage Build 3 tầng kết hợp với BuildKit cache mount.

### Kết Quả Đạt Được

| Giai Đoạn | Thời Gian Build | Mức Cải Thiện | Giải Pháp Chính |
|-----------|----------------|---------------|-----------------|
| **Trạng thái ban đầu** | ~39 giây | - | 2-stage build cơ bản |
| **Giai đoạn 1** | ~24 giây | 38% | Tái cấu trúc thành 3 stage để tối ưu layer cache |
| **Giai đoạn 2** | **~1 giây** | 96% | BuildKit cache mount cho Maven repository |

**Kết quả cuối cùng:**
- Build lần đầu: ~68 giây (tải đầy đủ dependencies)
- **Build từ lần 2 trở đi: ~1 giây** ✨

---

## Giới Thiệu

Trong quá trình phát triển, việc phải đợi "docker compose build" mất hàng chục giây mỗi khi thay đổi code nhỏ gây ra nhiều stress. Bài viết này sẽ giải thích từng bước quá trình tối ưu hóa để đạt được thời gian build gần như tức thì, giúp môi trường phát triển Docker của bạn trở nên thoải mái hơn!

---

## Môi Trường Kiểm Chứng

- **Hệ điều hành:** macOS (MacBook Pro)
- **Docker Desktop:** 4.40.2
- **Docker Compose:** v2.40.2
- **Stack ứng dụng:**
  - Build: Maven 3.9 + Eclipse Temurin JDK 21
  - Runtime: Tomcat 9.0.111 + Amazon Corretto 8
  - Database: MariaDB 10.11

---

## Trạng Thái Ban Đầu: 2-Stage Multi-stage Build

### Dockerfile Phiên Bản Đầu Tiên

Khởi đầu với cấu trúc 2-stage build cơ bản:

```dockerfile
# ============================================================================
# Stage 1: Build stage (Maven + JDK 21)
# ============================================================================
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml .
COPY app ./app

# Thực thi Maven build
RUN mvn clean package -DskipTests
RUN ls -lh /build/target/app.war

# ============================================================================
# Stage 2: Runtime stage (Tomcat + Corretto 8)
# ============================================================================
FROM tomcat:9.0.111-jdk8-corretto-al2

# Cài đặt các package cần thiết
RUN yum update -y && \\
    yum install -y curl unzip && \\
    yum clean all

# Thiết lập ban đầu cho Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*
RUN mkdir -p /var/log/app && \\
    chmod 755 /var/log/app

# Copy WAR file từ build stage
COPY --from=builder /build/target/app.war /usr/local/tomcat/webapps/app.war

# Copy script khởi động và cấp quyền thực thi
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
```

### Vấn Đề Gặp Phải

Dockerfile này có các hạn chế sau:

1. **yum install chạy mỗi lần build**: Package installation ở runtime stage không được cache hiệu quả
2. **Toàn bộ code rebuild khi thay đổi source**: Layer cache không được tận dụng tối đa
3. **Maven dependencies tải lại mỗi lần**: Thư mục ~/.m2 không được cache, phải tải lại dependencies mỗi lần

**Thời gian thực tế: ~39 giây**

---

## Giai Đoạn 1: Tối Ưu Hóa Với 3-Stage Build

### Chiến Lược Tối Ưu

Tái thiết kế Dockerfile thành cấu trúc 3 stage để tận dụng tối đa layer cache:

- **Stage 1 (runtime-base)**: Tách riêng các xử lý tốn thời gian nhưng ít thay đổi (như yum install)
- **Stage 2 (builder)**: Maven build process
- **Stage 3 (final)**: Sử dụng runtime-base làm base, chỉ copy build artifacts

### Dockerfile Phiên Bản 3-Stage

```dockerfile
# ============================================================================
# Stage 1: Chuẩn bị runtime base
# ============================================================================
FROM tomcat:9.0.111-jdk8-corretto-al2 AS runtime-base

# Cài đặt packages (xử lý này hầu như không thay đổi trong quá trình develop)
RUN yum update -y && \\
    yum install -y curl unzip && \\
    yum clean all

# Thiết lập ban đầu cho Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*
RUN mkdir -p /var/log/app && \\
    chmod 755 /var/log/app

# ============================================================================
# Stage 2: Build stage (Maven + JDK 21)
# ============================================================================
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

# Chỉ copy pom.xml trước (dependencies không thay đổi thường xuyên)
COPY pom.xml .
COPY app ./app

# Maven build
RUN mvn clean package -DskipTests
RUN ls -lh /build/target/app.war

# ============================================================================
# Stage 3: Final image
# ============================================================================
FROM runtime-base

# Copy WAR file từ build stage
COPY --from=builder /build/target/app.war /usr/local/tomcat/webapps/app.war

# Copy script khởi động và cấp quyền
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
```

### Hiệu Quả Đạt Được

Sau khi Stage 1 (runtime-base) được build một lần, xử lý yum install (~5 giây) sẽ được cache. Kể cả khi thay đổi source code, quá trình này không cần chạy lại.

**Thời gian thực tế: ~24 giây (cải thiện 38%)**

---

## Giai Đoạn 2: Tăng Tốc Đột Phá Với BuildKit Cache Mount

### BuildKit Là Gì?

BuildKit là công nghệ build engine mới được giới thiệu từ Docker 18.09 trở đi, với các tính năng:

- Tối ưu hóa parallel build
- Cache mount (`--mount=type=cache`) cho phép cache persistent
- Layer cache hiệu quả hơn
- **Được bật mặc định trong Docker Compose v2**

### Dockerfile Phiên Bản Cuối Cùng (Hỗ Trợ BuildKit Cache Mount)

```dockerfile
# ============================================================================
# Stage 1: Chuẩn bị runtime base
# ============================================================================
FROM tomcat:9.0.111-jdk8-corretto-al2 AS runtime-base

# Cài đặt packages cần thiết
RUN yum update -y && \\
    yum install -y curl unzip && \\
    yum clean all

# Thiết lập Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*
RUN mkdir -p /var/log/app && \\
    chmod 755 /var/log/app

# ============================================================================
# Stage 2: Build stage (Maven + JDK 21)
# ============================================================================
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

# Copy pom.xml trước và tải dependencies
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 \\
    mvn dependency:go-offline -B

# Sau đó mới copy source code
COPY app ./app
RUN --mount=type=cache,target=/root/.m2 \\
    mvn clean package -DskipTests

RUN ls -lh /build/target/app.war

# ============================================================================
# Stage 3: Final image
# ============================================================================
FROM runtime-base

# Copy WAR file từ build stage
COPY --from=builder /build/target/app.war /usr/local/tomcat/webapps/app.war

# Copy script khởi động
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
```

### Điểm Quan Trọng Của Tối Ưu Hóa

#### 1. Sử Dụng Cache Mount

```dockerfile
RUN --mount=type=cache,target=/root/.m2 \
    mvn dependency:go-offline -B
```

Cú pháp `--mount=type=cache,target=/root/.m2` giúp Maven Local Repository (~/.m2) được lưu trữ persistent giữa các lần build. Nhờ đó, dependencies chỉ cần tải về một lần duy nhất.

#### 2. Tách Biệt pom.xml Và Source Code

```dockerfile
# 1. Chỉ copy pom.xml → tải dependencies
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 \\
    mvn dependency:go-offline -B

# 2. Sau đó copy source code → build
COPY app ./app
RUN --mount=type=cache,target=/root/.m2 \\
    mvn clean package -DskipTests
```

Nhờ việc tách biệt này:
- **Khi pom.xml thay đổi**: Chỉ tải lại dependencies
- **Khi source code thay đổi**: Chỉ build lại (dependencies dùng cache)

#### 3. Tận Dụng dependency:go-offline

```bash
mvn dependency:go-offline -B
```

Lệnh này tải trước toàn bộ dependencies và lưu vào cache. Flag `-B` (batch mode) giúp chạy ở chế độ non-interactive.

### Cấu Hình Trong docker-compose.yml

BuildKit được bật mặc định trong Docker Compose v2, nhưng nếu muốn bật tường minh:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: app
    # ... các cấu hình khác
```

Khi chạy build command:

```bash
# Bật BuildKit tường minh (v2 đã bật mặc định)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Thực thi build
docker compose build app
```

### Kết Quả Ấn Tượng

- **Build lần đầu**: ~68 giây (tải đầy đủ dependencies)
- **Build từ lần 2 trở đi**: **~1 giây (cải thiện 96%!)**

```bash
$ time docker compose build app

[+] Building 0.9s (22/22) FINISHED
 => CACHED [runtime-base 2/4] RUN yum update -y && ...
 => CACHED [builder 4/7] RUN --mount=type=cache,target=/root/.m2 ...
 => CACHED [builder 6/7] RUN --mount=type=cache,target=/root/.m2 ...
...

docker compose build app  0.12s user 0.08s system 19% cpu 1.053 total
```

Tất cả các stage đều hiển thị **CACHED**, layer cache hoạt động hoàn hảo! 🎉

---

## Xác Nhận Hoạt Động

Kiểm tra môi trường sau khi tối ưu:

```bash
# Khởi động container
$ docker compose up -d
[+] Running 2/2
 ✔ Container app-db    Healthy
 ✔ Container app       Started

# Kiểm tra log ứng dụng
$ docker compose logs app | tail -5
app  | Server startup in [727] milliseconds

# Kiểm tra API
$ curl -s "http://localhost:8080/api/health" | jq '.'
{
  "status": "OK",
  "uptime": "00:01:23"
}
```

Hoạt động hoàn hảo! ✅

---

## Tổng Hợp Best Practices

### 1. Cấu Trúc Multi-stage Build

```
Xử lý ít thay đổi (runtime-base)
    ↓
Xử lý build (builder)
    ↓
Final image (final)
```

**Nguyên tắc**: Tách riêng các xử lý tốn thời gian nhưng ít thay đổi vào stage độc lập để tối đa hóa hiệu quả cache.

### 2. Áp Dụng BuildKit Cache Mount Cho Các Ngôn Ngữ Khác

```dockerfile
# Maven
RUN --mount=type=cache,target=/root/.m2 \\
    mvn dependency:go-offline -B

# npm
RUN --mount=type=cache,target=/root/.npm \\
    npm ci

# pip
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt
```

Cache thư mục của package manager để giảm đáng kể thời gian tải dependencies.

### 3. Tối Ưu Thứ Tự Layer

```dockerfile
# ✅ Tốt: Sắp xếp theo tần suất thay đổi (thấp → cao)
COPY pom.xml .              # Dependency definition (ít thay đổi)
RUN mvn dependency:go-offline
COPY app ./app              # Source code (thay đổi thường xuyên)
RUN mvn clean package

# ❌ Không tốt: Copy tất cả cùng lúc
COPY . .                    # Copy mọi thứ
RUN mvn clean package       # Source thay đổi → dependencies cũng tải lại
```

**Nguyên tắc**: Copy các file ít thay đổi trước để tăng cache hit rate.

### 4. Sử Dụng .dockerignore

```
# .dockerignore
target/
*.log
.git/
.DS_Store
node_modules/
```

Loại trừ các file không cần thiết khỏi build context để giảm thời gian transfer.

---

## Troubleshooting

### BuildKit Không Hoạt Động

Nếu đang dùng Docker Compose v1:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

Hoặc thêm vào `~/.docker/config.json`:

```json
{
  "features": {
    "buildkit": true
  }
}
```

### Xóa Cache Khi Cần

```bash
# Xóa build cache
docker builder prune

# Xóa tất cả cache bao gồm cache mount
docker builder prune --all
```

### Cache Mount Không Hoạt Động

Kiểm tra:
- Phiên bản Docker Desktop (cần 18.09 trở lên)
- Phiên bản Docker Compose (khuyến nghị v2)
- BuildKit đã được bật (kiểm tra với `docker version`)

```bash
docker version
# Nếu thấy "BuildKit:" là OK
```

---

## Bảng So Sánh Hiệu Năng

| Tình Huống | Trạng Thái Ban Đầu | 3-Stage Build | BuildKit Cache Mount |
|------------|--------------------:|-------------:|-----------------:|
| **Build lần đầu** | 39s | 39s | 68s※ |
| **Build lần 2** | 39s | 24s | **1s** |
| **Sau khi đổi source code** | 39s | 24s | **1s** |
| **Sau khi đổi pom.xml** | 39s | 24s | ~10s |
| **Sau khi clean hoàn toàn** | 39s | 39s | 68s※ |

※ Lần đầu cần tải đầy đủ dependencies, nhưng các lần sau rất nhanh

---

## Tóm Tắt

### Ba Yếu Tố Quan Trọng

1. **Multi-stage Build 3 tầng** → Cải thiện layer cache 38%
2. **BuildKit cache mount** → Giảm thời gian tải dependencies về gần như 0
3. **Kết quả**: **Thời gian build từ ~39 giây → 1 giây (cải thiện 98%)**

### Khả Năng Áp Dụng

Phương pháp này có thể áp dụng cho nhiều build tools khác nhau:
- Java: Maven, Gradle
- JavaScript: npm, yarn, pnpm
- Python: pip, poetry
- Go: Go modules
- Ruby: bundler
- PHP: composer
- Rust: cargo

### Lợi Ích Cho Team

**Giả sử:**
- Tiết kiệm: 38 giây/build
- Số lần build/ngày: 20-50 lần
- **Tiết kiệm mỗi developer**: 12-32 phút/ngày
- **Team 5 người**: 5-13 giờ/tháng

Ngoài thời gian, còn có:
- Feedback loop nhanh hơn → Phát triển linh hoạt hơn
- Giảm context switching → Tập trung tốt hơn
- Trải nghiệm developer cải thiện → Giảm frustration

---

## Thư Mục Cache Cho Các Công Nghệ Khác

| Công nghệ | Thư mục cache |
|-----------|--------------|
| Maven | `/root/.m2` |
| Gradle | `/root/.gradle` |
| npm | `/root/.npm` |
| pip | `/root/.cache/pip` |
| Go modules | `/go/pkg/mod` |
| bundler | `/usr/local/bundle` |
| composer | `/tmp/composer-cache` |
| cargo | `/usr/local/cargo/registry` |

---

## Lời Kết

Phương pháp tối ưu hóa này không chỉ áp dụng cho Maven mà còn cho hầu hết các build tool khác (Gradle, npm, pip, v.v.). Hãy thử áp dụng vào dự án của bạn!

GMOコネクト cung cấp dịch vụ hỗ trợ phát triển và tư vấn kỹ thuật. Nếu có bất kỳ nhu cầu nào, vui lòng liên hệ:  
**Liên hệ**: https://gmo-connect.jp/contactus/

---

## Tài Liệu Tham Khảo

- **Docker BuildKit Documentation**: https://docs.docker.com/build/buildkit/
- **Docker Multi-stage builds**: https://docs.docker.com/build/building/multi-stage/
- **BuildKit Cache Mounts**: https://docs.docker.com/build/guide/mounts/

---

**Số liệu thống kê:**
- 👍 18 Likes
- 📚 6 Stocks
- 💬 0 Comments

**Nguồn**: https://qiita.com/ntaka329/items/882e90d61671bdbd024f
