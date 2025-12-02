---
title: "Thiết Kế Queue Consumer Không Chết Trong Production"
slug: "cyberagent-queue-consumer-design"
date: 2025-12-02
categories:
  - Development
  - DevOps and Infrastructure
tags:
  - Redis
  - Queue
  - Scalability
  - Message Broker
  - Reliability
  - TypeScript
  - Distributed Systems
description: "Hướng dẫn toàn diện về thiết kế queue consumer cấp production sử dụng Redis Streams, bao gồm các mẫu thiết kế như Fire-and-Forget, concurrency limiting, consumer groups, và các kỹ thuật nâng cao như priority control, graceful shutdown, và exponential backoff với jitter."
---

Bài viết này chia sẻ kiến thức thực tế về việc xây dựng queue consumer đáng tin cậy cho môi trường production, dựa trên kinh nghiệm phát triển hệ thống tại AI Shift (CyberAgent).

## Tại Sao Cần Queue Consumer?

Trong phát triển ứng dụng web, chúng ta thường cần xử lý các tác vụ tốn thời gian mà không muốn block request của người dùng:

**Ví dụ**: Khi người dùng mua hàng trên online shop
- Người dùng nhấn nút mua hàng
- Kiểm tra tồn kho và xử lý thanh toán (đồng bộ)
- Gửi email xác nhận (bất đồng bộ - không cần chờ)

Queue consumer cho phép:
- ✅ Người dùng nhận response ngay lập tức
- ✅ Xử lý tác vụ nặng ở background
- ✅ Cải thiện khả năng phản hồi và độ tin cậy của hệ thống

## Các Pattern Thiết Kế Cốt Lõi

### 1. Fire-and-Forget + Giới Hạn Xử Lý Đồng Thời

**Fire-and-Forget pattern** là pattern cơ bản cho phép producer enqueue message mà không cần chờ xử lý hoàn thành.

```typescript
// Producer: Enqueue message
await redis.xadd('mystream', '*', 'data', JSON.stringify(jobData));

// Consumer: Xử lý message
const messages = await redis.xreadgroup(
  'GROUP', 'mygroup', 'consumer1',
  'BLOCK', 5000,
  'COUNT', 10,
  'STREAMS', 'mystream', '>'
);
```

**Giới hạn xử lý đồng thời** ngăn chặn resource exhaustion:

```typescript
let currentJobs = 0;
const MAX_CONCURRENT_JOBS = 10;

async function processMessage(message) {
  // Chờ nếu đã đạt giới hạn
  while (currentJobs >= MAX_CONCURRENT_JOBS) {
    await sleep(100);
  }
  
  currentJobs++;
  try {
    await doWork(message);
  } finally {
    currentJobs--;
  }
}
```

### 2. Consumer Groups - Xử Lý Phân Tán

Consumer groups cho phép nhiều worker xử lý message một cách phân tán:

```typescript
// Tạo group (chỉ cần 1 lần)
await redis.xgroup('CREATE', 'mystream', 'mygroup', '0', 'MKSTREAM');

// Mỗi consumer có tên riêng
const consumerName = `consumer-${process.pid}`;

const messages = await redis.xreadgroup(
  'GROUP', 'mygroup', consumerName,
  'BLOCK', 5000,
  'COUNT', 10,
  'STREAMS', 'mystream', '>'
);

// Xác nhận message sau khi xử lý xong
await redis.xack('mystream', 'mygroup', messageId);
```

**Lợi ích**:
- Message tự động phân phối cho nhiều consumer
- Khi consumer fail, message được tái phân phối cho consumer khác
- Theo dõi trạng thái xử lý qua PEL (Pending Entries List)

### 3. XAUTOCLAIM - Thu Hồi Message Tự Động

Tự động thu hồi message từ consumer đã fail:

```typescript
// Thu hồi message không được xử lý trong 30 giây
const [nextId, messages] = await redis.xautoclaim(
  'mystream',
  'mygroup',
  consumerName,
  30000, // min-idle-time (milliseconds)
  '0-0'  // start ID
);

for (const [messageId, fields] of messages) {
  await processMessage(fields);
  await redis.xack('mystream', 'mygroup', messageId);
}
```

**Lưu ý**:
- XAUTOCLAIM chỉ thu hồi message cũ nhất
- Cần thực thi định kỳ
- Nên kết hợp với XCLAIM heartbeat

### 4. XCLAIM Heartbeat - Phòng Chống Xử Lý Trùng

Cập nhật idle time định kỳ để báo hiệu đang xử lý message:

```typescript
// Gửi heartbeat trong khi xử lý message
const heartbeatInterval = setInterval(async () => {
  await redis.xclaim(
    'mystream',
    'mygroup',
    consumerName,
    0, // min-idle-time = 0 (reclaim ngay)
    messageId
  );
}, 10000); // Mỗi 10 giây

try {
  await processLongRunningJob(data);
} finally {
  clearInterval(heartbeatInterval);
  await redis.xack('mystream', 'mygroup', messageId);
}
```

**Ưu điểm**:
- Ngăn message bị tái phân phối sớm
- Giảm nguy cơ xử lý trùng lặp
- Kết hợp với XAUTOCLAIM cho recovery mạnh mẽ

### 5. Chiến Lược Retry

#### Consumer-Level Retry

Sử dụng cho các lỗi tạm thời:

```typescript
const MAX_RETRIES = 3;

async function processWithRetry(message, retries = 0) {
  try {
    await doWork(message);
    await redis.xack('mystream', 'mygroup', messageId);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await sleep(1000 * Math.pow(2, retries)); // Exponential backoff
      return processWithRetry(message, retries + 1);
    }
    // Chuyển sang application-level retry
    await redis.xack('mystream', 'mygroup', messageId);
    await redis.xadd('mystream', '*', 'data', message.data);
  }
}
```

#### Application-Level Retry

Thực thi lại job thất bại từ đầu:

```typescript
// Re-enqueue message thất bại
await redis.xack('mystream', 'mygroup', messageId);
await redis.xadd('mystream', '*', 'data', originalData, 'retryCount', retryCount + 1);
```

**Phân biệt sử dụng**:
- **Consumer-level**: Lỗi network, service tạm thời không available
- **Application-level**: Chỉ cho operation idempotent, cần thực thi lại hoàn toàn

## Các Pattern Nâng Cao

### 1. Priority Control với Multiple Queues + Round-Robin

Tạo queue riêng cho mỗi mức độ ưu tiên và xử lý theo vòng lặp:

```typescript
const HIGH_PRIORITY_STREAM = 'high-priority-stream';
const LOW_PRIORITY_STREAM = 'low-priority-stream';

async function consumeWithPriority() {
  while (running) {
    // Xử lý high priority 2 lần
    for (let i = 0; i < 2; i++) {
      await processStream(HIGH_PRIORITY_STREAM);
    }
    // Xử lý low priority 1 lần
    await processStream(LOW_PRIORITY_STREAM);
  }
}
```

**Ưu điểm**:
- Implementation đơn giản
- Hành vi dự đoán được
- Không có queue starvation

### 2. Graceful Shutdown với Timeout

Tắt sạch sẽ để giảm thiểu mất message:

```typescript
let running = true;
const inFlightMessages = new Set();

process.on('SIGTERM', async () => {
  console.log('Nhận tín hiệu shutdown');
  running = false;
  
  const timeout = setTimeout(() => {
    console.log('Timeout shutdown, buộc exit');
    process.exit(1);
  }, 30000); // Timeout 30 giây
  
  // Chờ các message đang xử lý hoàn thành
  while (inFlightMessages.size > 0) {
    await sleep(100);
  }
  
  clearTimeout(timeout);
  console.log('Graceful shutdown hoàn thành');
  process.exit(0);
});

async function processMessage(messageId, data) {
  inFlightMessages.add(messageId);
  try {
    await doWork(data);
    await redis.xack('mystream', 'mygroup', messageId);
  } finally {
    inFlightMessages.delete(messageId);
  }
}
```

### 3. Exponential Backoff + Jitter

Ngăn chặn thundering herd khi service recovery:

```typescript
const BACKOFF_BASE_INTERVAL = 100;  // 100ms
const BACKOFF_MAX_INTERVAL = 10000; // 10 giây
const BACKOFF_JITTER = 1000;        // 1 giây

async function consumeWithBackoff() {
  let retryCount = 0;
  
  while (running) {
    try {
      const messages = await redis.xreadgroup(
        'GROUP', 'mygroup', consumerName,
        'BLOCK', 5000,
        'STREAMS', 'mystream', '>'
      );
      
      if (messages && messages.length > 0) {
        retryCount = 0; // Reset khi thành công
        await processMessages(messages);
      }
    } catch (error) {
      // Tính toán backoff với jitter
      const backoff = Math.min(
        BACKOFF_MAX_INTERVAL,
        BACKOFF_BASE_INTERVAL * Math.pow(2, retryCount)
      );
      const jitter = Math.random() * BACKOFF_JITTER;
      
      await sleep(backoff + jitter);
      retryCount++;
    }
  }
}
```

**Lợi ích**:
- Ngăn nhiều consumer reconnect đồng thời
- Phân tán timing của retry
- Bảo vệ downstream services

## Implementation Hoàn Chỉnh

Consumer production-ready tích hợp tất cả patterns:

```typescript
import Redis from 'ioredis';

const redis = new Redis();
const STREAM_NAME = 'mystream';
const GROUP_NAME = 'mygroup';
const CONSUMER_NAME = `consumer-${process.pid}`;
const MAX_CONCURRENT_JOBS = 10;
const XAUTOCLAIM_MIN_IDLE_TIME = 30000;
const HEARTBEAT_INTERVAL = 10000;
const CONSUMER_RETRY_MAX = 3;
const SHUTDOWN_TIMEOUT = 30000;

let running = true;
let currentJobs = 0;
const inFlightMessages = new Map();

async function init() {
  try {
    await redis.xgroup('CREATE', STREAM_NAME, GROUP_NAME, '0', 'MKSTREAM');
  } catch (error) {
    if (!error.message.includes('BUSYGROUP')) throw error;
  }
}

async function processMessage(messageId: string, fields: any, retries = 0) {
  // Khởi động heartbeat
  const heartbeat = setInterval(async () => {
    await redis.xclaim(STREAM_NAME, GROUP_NAME, CONSUMER_NAME, 0, messageId);
  }, HEARTBEAT_INTERVAL);

  inFlightMessages.set(messageId, heartbeat);

  try {
    // Xử lý thực tế
    await doWork(fields);
    await redis.xack(STREAM_NAME, GROUP_NAME, messageId);
  } catch (error) {
    // Consumer-level retry
    if (retries < CONSUMER_RETRY_MAX) {
      const backoff = 1000 * Math.pow(2, retries);
      await sleep(backoff);
      return processMessage(messageId, fields, retries + 1);
    }
    
    // Application-level retry
    await redis.xack(STREAM_NAME, GROUP_NAME, messageId);
    await redis.xadd(STREAM_NAME, '*', 'data', fields.data, 'retryCount', '1');
  } finally {
    clearInterval(heartbeat);
    inFlightMessages.delete(messageId);
    currentJobs--;
  }
}

async function consumeMessages() {
  while (running) {
    // Giới hạn concurrency
    while (currentJobs >= MAX_CONCURRENT_JOBS && running) {
      await sleep(100);
    }

    if (!running) break;

    try {
      // Đọc message mới
      const messages = await redis.xreadgroup(
        'GROUP', GROUP_NAME, CONSUMER_NAME,
        'BLOCK', 5000,
        'COUNT', 10,
        'STREAMS', STREAM_NAME, '>'
      );

      if (messages && messages.length > 0) {
        for (const [stream, streamMessages] of messages) {
          for (const [messageId, fields] of streamMessages) {
            currentJobs++;
            processMessage(messageId, fields);
          }
        }
      }

      // XAUTOCLAIM để thu hồi message thất bại
      const [nextId, claimedMessages] = await redis.xautoclaim(
        STREAM_NAME,
        GROUP_NAME,
        CONSUMER_NAME,
        XAUTOCLAIM_MIN_IDLE_TIME,
        '0-0',
        'COUNT', 10
      );

      if (claimedMessages && claimedMessages.length > 0) {
        for (const [messageId, fields] of claimedMessages) {
          currentJobs++;
          processMessage(messageId, fields);
        }
      }
    } catch (error) {
      console.error('Lỗi khi consume messages:', error);
      const backoff = Math.min(10000, 100 * Math.pow(2, 0));
      const jitter = Math.random() * 1000;
      await sleep(backoff + jitter);
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Nhận tín hiệu shutdown');
  running = false;

  const timeout = setTimeout(() => {
    console.log('Timeout shutdown, buộc exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  while (inFlightMessages.size > 0) {
    await sleep(100);
  }

  clearTimeout(timeout);
  await redis.quit();
  console.log('Graceful shutdown hoàn thành');
  process.exit(0);
});

async function main() {
  await init();
  await consumeMessages();
}

main().catch(console.error);
```

## Best Practices

1. **Sử dụng XCLAIM heartbeat làm cơ chế chính phòng chống xử lý trùng**
   - XAUTOCLAIM dùng như recovery bổ sung

2. **Implement cả consumer-level và application-level retries**
   - Consumer-level cho lỗi tạm thời
   - Application-level cho operation idempotent

3. **Thêm exponential backoff + jitter để tránh thundering herd**
   - Ngăn nhiều consumer reconnect cùng lúc

4. **Implement graceful shutdown**
   - Giảm thiểu mất message khi deploy

5. **Dùng multiple queues cho priority control**
   - Đơn giản hơn scheduling phức tạp

6. **Monitor PEL size**
   - Phát hiện bottleneck trong xử lý

7. **Đảm bảo idempotency cho application-level retries**

## Điểm Cần Monitor

- **PEL (Pending Entries List) size**: Kiểm tra qua `XPENDING`
- **Message processing latency**: Ghi lại thời gian xử lý mỗi message
- **Retry counts và failure rates**: Theo dõi retry patterns
- **Consumer group member status**: Kiểm tra qua `XINFO GROUPS`
- **Queue depth cho mỗi priority level**: Monitor độ dài mỗi stream

## Kết Luận

Để thiết kế queue consumer production-ready với Redis Streams, cần kết hợp:

1. **Patterns cơ bản**: Fire-and-Forget, concurrency limiting, consumer groups
2. **Reliability features**: XAUTOCLAIM, XCLAIM heartbeat, retry strategies
3. **Advanced patterns**: Priority control, graceful shutdown, exponential backoff

Kết hợp các patterns này giúp xây dựng hệ thống xử lý bất đồng bộ scalable và đáng tin cậy.

## Về Tác Giả

**SUZUKI Aman**  
Engineer tại AI Shift (CyberAgent tân sinh viên 2025). Quan tâm đến distributed systems và reliability engineering, làm việc với việc xây dựng hệ thống robust cho production.

## Thông Tin Tuyển Dụng

AI Shift đang tìm kiếm đồng nghiệp cùng làm việc:
- Backend Engineer
- Frontend Engineer
- SRE
- Data Scientist
- ML Engineer

Chi tiết: https://ai-shift.co.jp/recruit

---

**Nguồn**: [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/59938/)  
**Bài viết gốc**: CyberAgent Developers Advent Calendar 2025 - Day 2