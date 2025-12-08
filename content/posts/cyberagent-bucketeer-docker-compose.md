---
title: "Thiết Kế Môi Trường Development Không Cần K8s trong Bucketeer"
date: 2025-12-06T10:00:00+09:00
draft: false
categories: ["DevOps and Infrastructure", "Development"]
tags: ["Docker Compose", "Kubernetes", "Redis Streams", "Nginx", "gRPC", "Feature Flags", "Golang", "Microservices", "Development Environment", "Open Source"]
author: "黒田 (Kuroda)"
translator: "日平"
description: "Hướng dẫn chi tiết về cách Bucketeer - nền tảng feature flag management và A/B testing OSS của CyberAgent - thiết kế môi trường development dựa trên Docker Compose thay thế Minikube/Kubernetes. Bài viết giải thích giải pháp sử dụng Redis Streams cho event-driven messaging và Nginx routing cho gRPC/gRPC-Web/REST."
---

# Thiết Kế Môi Trường Development Không Cần K8s trong Bucketeer

**Tác giả**: 黒田 ([@knkurokuro7](https://x.com/knkurokuro7))  
**Ngày xuất bản**: 6 tháng 12 năm 2025  
**Danh mục**: Engineer  
**Nguồn**: [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/60317/)  
**Advent Calendar**: CyberAgent Developers Advent Calendar 2025 Day 6

---

## Giới Thiệu

Đây là bài viết ngày thứ 6 của [CyberAgent Developers Advent Calendar 2025](https://adventar.org/calendars/11590)! 🤶

Xin chào! Tôi là Kuroda ([@knkurokuro7](https://x.com/knkurokuro7)) từ CA Dev Platform Bucketeer Team thuộc Technical Policy Division.

[Bucketeer](https://github.com/bucketeer-io/bucketeer) là nền tảng OSS feature flag management và A/B testing được phát triển bởi CyberAgent. Để tìm hiểu về khởi đầu của việc OSS hóa Bucketeer, vui lòng tham khảo [bài viết này](https://www.cyberagent.co.jp/way/list/detail/id=28416).

Trước đây, môi trường development local của Bucketeer được xây dựng dựa trên Minikube (Kubernetes), nhưng gần đây chúng tôi đã thêm môi trường mới sử dụng Docker Compose.

Môi trường Minikube cho phép xác nhận hoạt động gần với production, nhưng đổi lại yêu cầu kiến thức về Kubernetes và tiêu tốn nhiều tài nguyên do khởi động VM, khiến nó hơi nặng nề cho việc xác nhận đơn giản. Hơn nữa, cũng có ý kiến rằng "sẽ tiện lợi hơn nếu có thể khởi động mọi thứ chỉ với một lệnh `docker compose up`", nên chúng tôi quyết định thực hiện tích hợp Docker Compose.

Tuy nhiên, đây không phải là công việc đơn giản chỉ cần sắp xếp các Docker containers và nói "xong!".

Bucketeer áp dụng kiến trúc event-driven sử dụng Google Cloud Pub/Sub, và thách thức là làm thế nào để tái tạo điều này trong môi trường Docker Compose. Ngoài ra, cũng cần xử lý 3 phương thức giao tiếp (gRPC, gRPC-Web, REST) thông qua một entry point duy nhất.

Bài viết này sẽ giới thiệu cách chúng tôi giải quyết hai thách thức này.

---

## So Sánh Kiến Trúc

Đầu tiên, hãy so sánh kiến trúc của cả hai môi trường bằng sơ đồ.

### 1. Môi Trường Minikube (Kubernetes)

**Messaging**: Google Cloud Pub/Sub Emulator  
**Service Discovery**: Kubernetes Service Discovery + Envoy

**Đặc điểm**:
- Có thể xác nhận hoạt động gần với production
- Yêu cầu kiến thức về Kubernetes
- Tiêu tốn nhiều tài nguyên do khởi động VM
- Hơi nặng nề cho việc xác nhận đơn giản

### 2. Môi Trường Docker Compose

**Messaging**: Redis Streams  
**Service Discovery**: Nginx Reverse Proxy

**Đặc điểm**:
- Khởi động mọi thứ chỉ với một lệnh `docker compose up`
- Hiệu quả về tài nguyên
- Tận dụng hạ tầng Redis hiện có
- Chi phí triển khai thấp

### Điểm Khác Biệt Chính

Các điểm khác biệt chính là **phần messaging** và **phần service discovery**. Hãy cùng tìm hiểu chi tiết từng phần.

---

## 1. Messaging với Redis Streams

Bucketeer áp dụng kiến trúc event-driven sử dụng Google Cloud Pub/Sub.

Trong môi trường Minikube, chúng tôi sử dụng Google Cloud Pub/Sub Emulator (hiện tại đã chuyển sang Redis Streams). Mặc dù tiện lợi khi có thể develop với interface giống production, nhưng cho môi trường Docker Compose, chúng tôi đã áp dụng Redis Streams.

Google Cloud Pub/Sub Emulator cũng có thể sử dụng trong môi trường Docker Compose, nhưng cần thêm containers. Ngoài ra, vì hệ thống hiện tại đã sử dụng Redis làm cache, chúng tôi đã chọn Redis Streams do chi phí triển khai thấp và hiệu quả về tài nguyên.

### Phân Tán Messages Bằng FNV Hash

Trong implementation của Redis Streams, chúng tôi sử dụng **16 partitions** và phân tán messages đều đặn bằng **FNV-1a hash**.

Lý do chọn 16 là vì nếu số lượng partitions quá nhiều sẽ phức tạp trong quản lý, và nếu quá ít thì hiệu quả xử lý song song sẽ giảm, nên đây là số cân bằng tốt trong thực tế.

**FNV-1a (Fowler-Noll-Vo 1a)** là hàm hash không mã hóa nhanh và đơn giản. Nó chuyển đổi chuỗi hoặc byte array có độ dài bất kỳ thành giá trị hash có độ dài cố định, và vì phân tán giá trị hash đều đặn nên phù hợp cho việc phân chia partitions.

```go
// pkg/pubsub/redis/stream_publisher.go

// calculatePartition computes the partition index for a given key.
func (p *StreamPublisher) calculatePartition(key string) int {
    hasher := fnv.New32a()
    _, err := hasher.Write([]byte(key))
    if err != nil {
        // Should not normally error.
        p.logger.Error("Error hashing key", zap.Error(err), zap.String("key", key))
        return 0
    }
    return int(hasher.Sum32() % uint32(p.partitionCount))
}
```

Luồng xử lý như sau:

1. Hash message ID bằng `fnv.New32a()`
2. Tính phần dư khi chia giá trị hash cho số partitions (16)
3. Phần dư đó trở thành số partition

Vì cùng một message ID luôn đi đến cùng một partition, nên thứ tự của các messages có cùng key được duy trì trong partition.

### Định Dạng Stream Key

Tạo stream key của Redis cho mỗi partition.

```go
// pkg/pubsub/redis/stream_publisher.go

// getStreamKey returns the partitioned stream name
func (p *StreamPublisher) getStreamKey(id string) string {
    partition := p.calculatePartition(id)
    return fmt.Sprintf("%s-%d{stream}", p.streamBase, partition)
}
```

Ví dụ, nếu topic `domain` và partition 5, key sẽ là `domain-5{stream}`.

Hash tag `{stream}` là để hỗ trợ Redis Cluster. Khi đọc nhiều streams bằng `XReadGroup`, tất cả các keys phải được đặt trên cùng một node, do đó chúng tôi sử dụng hash tag cố định để đặt tất cả partitions trên cùng một node.

### Đọc Messages Bằng Consumer Group

Consumer Group của Redis Streams là cơ chế phân tán messages giữa nhiều consumers. Khái niệm tương tự như consumer group của Kafka, các consumers trong cùng một group sẽ nhận các messages khác nhau.

Puller tạo Consumer Groups cho tất cả partitions khi khởi động.

```go
// pkg/pubsub/redis/stream_puller.go

// Pull reads messages from the stream and calls the handler for each message
func (p *StreamPuller) Pull(ctx context.Context, handler func(context.Context, *puller.Message)) error {
    // ...bỏ qua...

    // Create consumer groups for all partitions
    for partition := 0; partition < p.partitionCount; partition++ {
        streamKey := p.getStreamKey(partition)

        // Check if the consumer group exists before attempting to create it
        groupExists, err := p.consumerGroupExists(ctx, streamKey, p.subscription)
        // ...bỏ qua...

        // Only create the group if it doesn't exist
        if !groupExists {
            err := p.redisClient.XGroupCreateMkStream(streamKey, p.subscription, "0")
            // ...bỏ qua...
        }
    }

    // ...bỏ qua...
}
```

Việc đọc messages được thực hiện bằng lệnh `XREADGROUP`. Lệnh này có thể lấy messages từ nhiều streams trong một lần gọi. Tuy nhiên, trong implementation này, một Puller đọc tất cả partitions với một Goroutine duy nhất và messages được xử lý tuần tự.

Để cải thiện throughput, cần khởi động nhiều Puller instances (processes) để load balancing trong Consumer Group.

```go
// pkg/pubsub/redis/stream_puller.go

// Build streams argument for XREADGROUP
streams := make([]string, 0, p.partitionCount*2)
for partition := 0; partition < p.partitionCount; partition++ {
    streamKey := p.getStreamKey(partition)
    streams = append(streams, streamKey)
}

// Add the IDs matching each stream key (must have same number of IDs as keys)
for partition := 0; partition < p.partitionCount; partition++ {
    streams = append(streams, ">") // ">" means only new messages
}

// Read from all partitions
streamResults, err := p.redisClient.XReadGroup(
    ctx,
    p.subscription,
    p.consumer,
    streams,
    p.batchSize,
    p.blockTime,
)
```

Định dạng arguments của `XREADGROUP` là `[key1, key2, ..., keyN, id1, id2, ..., idN]`. Ví dụ như `["stream-0{stream}", "stream-1{stream}", ">", ">"]`, đầu tiên sắp xếp các stream keys, sau đó sắp xếp các IDs tương ứng. `>` là ID specification dành riêng cho Consumer Group, lấy "messages chưa được gửi đến group này".

### Reclaim Stale Messages

Khi worker crashes, messages đang được xử lý sẽ bị "treo". Chúng ta gọi đây là "stale messages" (messages bị tồn đọng).

Trong Redis Streams, các messages đang được xử lý trong Consumer Group được ghi lại trong "pending entries list". Nếu xử lý hoàn tất bình thường, sẽ gửi acknowledgment bằng `XACK` và xóa khỏi list. Tuy nhiên, nếu worker crashes, acknowledgment không được gửi và messages sẽ tiếp tục tồn tại.

Để giải quyết vấn đề này, chúng tôi đã implement `recoveryLoop` để thu hồi stale messages trong background.

```go
// pkg/pubsub/redis/stream_puller.go

// recoveryLoop periodically checks for stale messages and reclaims them
func (p *StreamPuller) recoveryLoop(ctx context.Context) {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ctx.Done():
            return
        case <-p.done:
            return
        case <-ticker.C:
            // Skip processing if we don't have a handler
            if p.handler == nil {
                continue
            }

            // Check each partition for stale messages
            for partition := 0; partition < p.partitionCount; partition++ {
                streamKey := p.getStreamKey(partition)

                // Retrieve pending messages that have been idle longer than idleTime
                pendingMessages, err := p.redisClient.XPendingExt(
                    ctx,
                    streamKey,
                    p.subscription,
                    "-", // Start
                    "+", // End
                    10,  // Count
                    p.idleTime,
                )
                // ...bỏ qua...

                if len(pendingMessages) == 0 {
                    continue
                }

                // Collect message IDs
                messageIDs := make([]string, len(pendingMessages))
                for i, pm := range pendingMessages {
                    messageIDs[i] = pm.ID
                }

                // Claim the messages for the current consumer
                claimed, err := p.redisClient.XClaim(
                    ctx,
                    streamKey,
                    p.subscription,
                    p.consumer,
                    p.idleTime,
                    messageIDs,
                )
                // ...bỏ qua...

                // Reprocess the claimed messages
                p.reprocessClaimedMessages(ctx, claimed, streamKey)
            }
        }
    }
}
```

Điểm cần chú ý ở đây là check interval và threshold là các cấu hình riêng biệt.

- **Check interval**: 30 giây (`time.NewTicker(30 * time.Second)`)
- **Threshold**: 60 giây (`defaultIdleTime = 60 * time.Second`)

Kiểm tra mỗi 30 giây và thu hồi các messages chưa được xử lý trong hơn 60 giây. Thiết kế này cho phép phân biệt giữa độ trễ tạm thời và messages thực sự bị tồn đọng.

---

## 2. Routing với Nginx

Bucketeer hỗ trợ 3 phương thức giao tiếp sau:

| Phương thức | Mục đích sử dụng | Protocol |
|---------|------|-----------|
| gRPC | Giao tiếp giữa các services, SDK | HTTP/2 |
| gRPC-Web (dự kiến chuyển sang REST) | API calls từ browser | HTTP/1.1 |
| REST | REST API (qua gRPC-Gateway) | HTTP/1.1 |

Trong môi trường Minikube, Envoy xử lý routing cho các phương thức này, nhưng trong môi trường Docker Compose, chúng tôi cần thực hiện bằng Nginx. Vì môi trường Docker Compose không có cơ chế sidecar hoặc service discovery như Kubernetes, chúng tôi sử dụng Nginx như một reverse proxy duy nhất.

Vấn đề ở đây là phương pháp xử lý khác nhau giữa gRPC và gRPC-Web.

- **gRPC**: HTTP/2 proxy với directive `grpc_pass`
- **gRPC-Web**: HTTP/1.1 proxy với directive `proxy_pass`

Cần phân phối các requests đến cùng một URL path (ví dụ: `/bucketeer.account.AccountService`) dựa trên Content-Type.

### Phán Đoán Phương Thức Giao Tiếp Bằng map Directive

Sử dụng `map` directive của Nginx để phán đoán phương thức giao tiếp từ Content-Type của request.

```nginx
# docker-compose/config/nginx/bucketeer.conf

# Map to detect gRPC-Web requests
map $http_content_type $is_grpc_web {
    ~*application/grpc-web 1;
    default 0;
}
```

Với cấu hình này, các requests có `Content-Type: application/grpc-web` sẽ có `$is_grpc_web = 1`, các requests khác sẽ có `$is_grpc_web = 0`.

Kết quả phán đoán được lưu trong biến nên có thể tham chiếu trong các location blocks tiếp theo. Phán đoán chỉ được thực hiện một lần cho mỗi request nên hiệu quả.

### Internal Redirect với 418 Error Page

Directive `if` của Nginx có nhiều hạn chế và không thể chuyển đổi `grpc_pass` hoặc `proxy_pass` bên trong `if`.

Do đó, chúng tôi sử dụng kỹ thuật internal redirect với `error_page`.

```nginx
# docker-compose/config/nginx/bucketeer.conf

# gRPC/gRPC-Web service routes (backend handles both protocols)
location /bucketeer.account.AccountService {
    if ($is_grpc_web = 1) {
        error_page 418 = @grpc_web_account;
        return 418;
    }
    grpc_pass grpcs://web_account_backend;
    grpc_connect_timeout 15s;
    grpc_send_timeout 15s;
    grpc_read_timeout 15s;
}

location @grpc_web_account {
    proxy_pass https://web_account_backend;
}
```

Luồng xử lý như sau:

1. Request đến `/bucketeer.account.AccountService`
2. Nếu `$is_grpc_web = 1`, redirect đến `@grpc_web_account` bằng `error_page 418`
3. Xử lý tại `@grpc_web_account` bằng `proxy_pass` (HTTP/1.1)
4. Nếu `$is_grpc_web = 0`, xử lý bằng `grpc_pass` (HTTP/2)

418 là status code được biết đến như "I'm a teapot". Vì không được sử dụng trong xử lý lỗi thực tế nên chúng tôi tận dụng cho mục đích internal redirect.

Timeout được điều chỉnh theo đặc tính của service, API thông thường được đặt 15 giây, batch processing được đặt 1 giờ (3600 giây).

### Cấu Hình CORS

Vì gRPC-Web được gọi từ browser, cần cấu hình CORS (Cross-Origin Resource Sharing).

```nginx
# docker-compose/config/nginx/bucketeer.conf

# CORS headers for gRPC-Web support
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type, x-grpc-web, authorization, grpc-timeout' always;
add_header 'Access-Control-Allow-Credentials' 'true' always;
add_header 'Access-Control-Expose-Headers' 'Content-Length, Content-Encoding, grpc-message, grpc-status, grpc-status-details-bin' always;

# Handle preflight OPTIONS requests
if ($request_method = 'OPTIONS') {
    return 204;
}
```

3 điểm quan trọng:

1. **Cho phép header `x-grpc-web`**: Header đặc trưng của gRPC-Web
2. **Public hóa gRPC status**: Trả về `grpc-message`, `grpc-status`, v.v. cho browser
3. **Xử lý preflight request**: Trả về 204 cho OPTIONS request mà browser gửi trước

TLS Bridging và kích hoạt HTTP/2 cũng được thực hiện bởi Nginx, kết nối mã hóa đến backend bằng `grpcs://`.

---

## Tổng Kết

Bài viết này đã giới thiệu 2 thiết kế được implement trong việc tích hợp Docker Compose của Bucketeer.

1. **Messaging với Redis Streams**
2. **Routing với Nginx**

Lưu ý rằng thiết kế được giới thiệu trong bài viết này nhằm mục đích tái tạo trong môi trường development local. Nếu áp dụng cấu hình tương tự trong môi trường production, cần xem xét thêm về giới hạn throughput của Redis Streams, cấu hình chi tiết của Nginx, v.v.

Nếu bạn có ý kiến "cách này tốt hơn nhé" hoặc "điều này nghĩa là gì nhỉ", chúng tôi rất mong nhận được issues và PRs! [Bucketeer GitHub Issues](https://github.com/bucketeer-io/bucketeer/issues)

Cảm ơn bạn đã đọc đến cuối!

---

## Tài Liệu Tham Khảo

- [Bucketeer GitHub Repository](https://github.com/bucketeer-io/bucketeer)
- [Khởi đầu OSS hóa Bucketeer](https://www.cyberagent.co.jp/way/list/detail/id=28416)
- [CyberAgent Developers Advent Calendar 2025](https://adventar.org/calendars/11590)

---

**Tags**: #Bucketeer #Golang #kubernetes #Infrastructure #FeatureFlags
