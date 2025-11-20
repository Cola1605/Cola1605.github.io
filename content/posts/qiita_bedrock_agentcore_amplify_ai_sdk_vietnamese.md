---
title: "Xây dựng Trợ lý AI với AI SDK + Next.js sử dụng Bedrock AgentCore và Amplify"
date: 2025-10-30
categories: ["AWS", "AI & Machine Learning", "Web & Frontend"]
tags: ["Bedrock-AgentCore", "AI-SDK", "Next.js", "Amplify", "AWS", "AI-Assistant"]
description: "Hướng dẫn xây dựng AI assistant với streaming response và tool integration. Sử dụng AI SDK, Next.js, Bedrock AgentCore và deploy lên Amplify Hosting."
---

# Xây dựng Trợ lý AI với AI SDK + Next.js sử dụng Bedrock AgentCore và Amplify

**Nguồn:** Qiita  
**Tác giả:** @moritalous  
**Ngày xuất bản:** 30 tháng 10, 2025  
**URL:** https://qiita.com/moritalous/items/5a1b16a7d9bc3e8e8c0a

---

## Giới thiệu

Bài viết này hướng dẫn cách lưu trữ trợ lý AI với phản hồi truyền tải và tích hợp công cụ một cách tinh tế sử dụng **AI SDK + Next.js**, và triển khai bằng **Amplify Hosting** mà không cần thiết lập cơ sở hạ tầng.

### Các công nghệ chính được sử dụng

#### **Amazon Bedrock AgentCore**
Dịch vụ AWS cho phép tạo và quản lý trợ lý AI một cách liền mạch. Các tính năng chính:
- Phản hồi truyền tải
- Tích hợp mô hình Claude
- Tạo và quản lý trợ lý

#### **Vercel AI SDK**
Bộ công cụ toàn diện cho xây dựng ứng dụng AI. Các tính năng chính:
- Nhà cung cấp cho nhiều mô hình AI
- Hỗ trợ truyền tải
- Gọi công cụ
- Các móc React
- Tích hợp phía máy chủ

#### **AWS Amplify**
Nền tảng cho lưu trữ ứng dụng Next.js. Các tính năng chính:
- Tích hợp AWS liền mạch
- Triển khai tự động
- Xác thực tích hợp sẵn
- Cơ sở hạ tầng có khả năng mở rộng

### Yêu cầu kỹ thuật

- **Next.js 15.0** (Next.js 14 cũng tương thích)
- **React 19** - Framework cho giao diện người dùng
- **Hỗ trợ App Router** - Cho Server Actions, API Routes
- **Truyền tải SSR**

---

## Tổng quan kiến trúc

### Kiến trúc cấp cao

```
Giao diện người dùng (React) 
    ↓
Tuyến đường API Next.js 
    ↓
Nhà cung cấp AI (Bedrock AgentCore)
    ↓
Truyền tải ← Thực thi công cụ
```

### Các thành phần chính

1. **Giao diện người dùng (Frontend)** - Tích hợp móc useChat, Hiển thị tin nhắn, Cập nhật giao diện truyền tải, Hiển thị gọi công cụ
2. **Backend** - Tuyến đường API Next.js, Khởi tạo máy khách Bedrock, Gọi trợ lý, Xử lý luồng, Định dạng phản hồi
3. **Trợ lý AI** - Thiết lập trợ lý Bedrock, Bao gồm: Cấu hình trợ lý, Lược đồ định nghĩa công cụ, Chọn mô hình, Cấu hình truyền tải

---

## Hướng dẫn triển khai

### Bước 1: Khởi tạo dự án

#### 1.1. Tạo dự án Next.js

```bash
npx create-next-app@latest my-ai-agent
cd my-ai-agent
```

#### 1.2. Cài đặt phụ thuộc

```bash
npm install ai @ai-sdk/amazon-bedrock
npm install @aws-sdk/client-bedrock-agent-runtime
```

#### 1.3. Cấu hình thông tin xác thực AWS

```bash
aws configure
```

Hoặc thiết lập biến môi trường:
```bash
export AWS_ACCESS_KEY_ID="khóa-của-bạn"
export AWS_SECRET_ACCESS_KEY="bí-mật-của-bạn"
export AWS_REGION="us-east-1"
```

---

### Bước 2: Thiết lập trợ lý Bedrock

#### 2.1. Định nghĩa hướng dẫn cho trợ lý

Tạo `src/lib/agent-config.ts`:

```typescript
export const agentInstruction = `
Bạn là một trợ lý AI hữu ích có thể:
1. Cung cấp thông tin về thời tiết
2. Trả lời các câu hỏi chung
3. Thực thi các tác vụ sử dụng các công cụ có sẵn

Luôn thân thiện và chính xác trong phản hồi của bạn.
`;
```

#### 2.2. Cấu hình lược đồ công cụ

Định nghĩa công cụ của bạn trong `src/lib/tools.ts`:

```typescript
export const tools = {
  getWeather: {
    description: 'Lấy thông tin thời tiết hiện tại cho một địa điểm',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'Thành phố và tiểu bang, ví dụ San Francisco, CA',
        },
      },
      required: ['location'],
    },
    execute: async ({ location }: { location: string }) => {
      // Dữ liệu giả lập - thay thế bằng API thật
      return {
        location,
        temperature: 72,
        condition: 'Nắng',
      };
    },
  },
};
```

#### 2.3. Thiết lập cấu hình mô hình

Trong `src/lib/model-config.ts`:

```typescript
import { bedrock } from '@ai-sdk/amazon-bedrock';

export const model = bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0');
```

#### 2.4. Kích hoạt truyền tải

Truyền tải được kích hoạt tự động thông qua AI SDK khi sử dụng `streamText()`.

---

### Bước 3: Triển khai tuyến đường API Next.js

#### 3.1. Tạo điểm cuối API

Tạo `src/app/api/chat/route.ts`:

```typescript
import { streamText } from 'ai';
import { model } from '@/lib/model-config';
import { agentInstruction } from '@/lib/agent-config';
import { tools } from '@/lib/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model,
    system: agentInstruction,
    messages,
    tools,
  });

  return result.toDataStreamResponse();
}
```

#### 3.2. Khởi tạo máy khách Bedrock

AI SDK xử lý khởi tạo máy khách tự động.

#### 3.3. Gọi trợ lý

Hàm `streamText()` xử lý việc gọi trợ lý và truyền tải.

#### 3.4. Xử lý luồng

```typescript
// Luồng được xử lý tự động bởi AI SDK
// Phản hồi được truyền tải đến máy khách khi các mảnh (chunk) có sẵn
```

#### 3.5. Định dạng phản hồi

```typescript
// toDataStreamResponse() định dạng luồng cho máy khách
return result.toDataStreamResponse();
```

---

### Bước 4: Xây dựng giao diện người dùng React

#### 4.1. Tích hợp móc useChat

Tạo `src/app/page.tsx`:

```typescript
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <strong>{m.role === 'user' ? 'Người dùng: ' : 'AI: '}</strong>
              {m.content}
            </div>
            {m.toolInvocations && (
              <pre className="text-sm text-gray-500">
                {JSON.stringify(m.toolInvocations, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Nói điều gì đó..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

#### 4.2. Hiển thị tin nhắn

```typescript
{messages.map(m => (
  <div key={m.id}>
    <strong>{m.role === 'user' ? 'Người dùng: ' : 'AI: '}</strong>
    {m.content}
  </div>
))}
```

#### 4.3. Cập nhật giao diện truyền tải

Móc `useChat` tự động cập nhật giao diện khi nội dung mới được truyền tải.

#### 4.4. Hiển thị gọi công cụ

```typescript
{m.toolInvocations && (
  <pre className="text-sm">
    {JSON.stringify(m.toolInvocations, null, 2)}
  </pre>
)}
```

---

### Bước 5: Triển khai lên Amplify Hosting

#### 5.1. Cấu hình amplify.yml

Tạo `amplify.yml` ở thư mục gốc:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### 5.2. Thiết lập biến môi trường

Trong bảng điều khiển Amplify, thêm:
```
AWS_ACCESS_KEY_ID=khóa-của-bạn
AWS_SECRET_ACCESS_KEY=bí-mật-của-bạn
AWS_REGION=us-east-1
```

#### 5.3. Kết nối với kho lưu trữ

1. Đẩy mã của bạn lên GitHub/GitLab/Bitbucket
2. Mở bảng điều khiển AWS Amplify
3. Chọn "Lưu trữ ứng dụng web"
4. Kết nối kho lưu trữ của bạn
5. Chọn nhánh để triển khai

#### 5.4. Triển khai ứng dụng

Amplify sẽ tự động:
- Cài đặt phụ thuộc
- Xây dựng ứng dụng
- Triển khai lên CDN toàn cầu
- Cung cấp URL HTTPS

---

## Các tính năng nâng cao

### Tích hợp công cụ

#### Công cụ tương thích OpenAPI

```typescript
export const tools = {
  // Công cụ thời tiết
  getWeather: {
    description: 'Lấy thông tin thời tiết',
    parameters: { /* lược đồ */ },
    execute: async (params) => { /* triển khai */ }
  },
  
  // Công cụ truy vấn cơ sở dữ liệu
  queryDatabase: {
    description: 'Truy vấn cơ sở dữ liệu',
    parameters: { /* lược đồ */ },
    execute: async (params) => { /* triển khai */ }
  },
  
  // Tích hợp API bên ngoài
  callExternalAPI: {
    description: 'Gọi API bên ngoài',
    parameters: { /* lược đồ */ },
    execute: async (params) => { /* triển khai */ }
  }
};
```

#### Thực thi công cụ phía máy chủ

```typescript
// Các công cụ được thực thi trên máy chủ trong tuyến đường API
export async function POST(req: Request) {
  const result = streamText({
    model,
    messages,
    tools, // Các công cụ được thực thi ở đây
  });
  
  return result.toDataStreamResponse();
}
```

#### Truyền tải kết quả

Kết quả công cụ được truyền tải tự động đến máy khách.

---

### Triển khai truyền tải

#### Sử dụng tiện ích truyền tải AI SDK

```typescript
import { streamText } from 'ai';

const result = streamText({
  model,
  messages,
  tools,
});

// Tự động xử lý truyền tải
return result.toDataStreamResponse();
```

#### Xử lý sự kiện truyền tải Bedrock

```typescript
// AI SDK xử lý các sự kiện truyền tải Bedrock nội bộ:
// - chunk
// - metadata
// - trace
// - files
```

#### Cập nhật giao diện người dùng dần dần

```typescript
// Móc useChat tự động cập nhật khi nội dung mới đến
const { messages, isLoading } = useChat();

// Hiển thị chỉ báo tải
{isLoading && <div>AI đang suy nghĩ...</div>}
```

#### Xử lý thực thi công cụ trong quá trình truyền tải

```typescript
// Các lời gọi công cụ có sẵn trong đối tượng tin nhắn
{m.toolInvocations?.map(tool => (
  <div key={tool.toolCallId}>
    <strong>Công cụ:</strong> {tool.toolName}
    <pre>{JSON.stringify(tool.args, null, 2)}</pre>
    {tool.result && (
      <pre>{JSON.stringify(tool.result, null, 2)}</pre>
    )}
  </div>
))}
```

---

## Lợi ích

### Trải nghiệm người dùng tốt hơn
- **Độ trễ cảm nhận giảm** - Người dùng thấy phản hồi ngay lập tức
- **Hiển thị nội dung dần dần** - Văn bản xuất hiện khi được tạo
- **Phản hồi thực thi công cụ theo thời gian thực** - Người dùng thấy công cụ nào đang được sử dụng

### Hiệu suất kỹ thuật
- **Truyền tải** - Phản hồi nhanh hơn cho người dùng
- **Thực thi công cụ hiệu quả** - Thực thi song song khi có thể
- **Xử lý lỗi mạnh mẽ** - Quản lý lỗi duyên dáng

### Hiệu quả phát triển
- **Mã hóa tối thiểu** - AI SDK xử lý hầu hết sự phức tạp
- **Mô hình hóa kiểu mạnh** - Hỗ trợ TypeScript đầy đủ
- **Dễ dàng kiểm thử** - Các thành phần được cách ly

---

## Khắc phục sự cố

### Vấn đề thường gặp

#### 1. Lỗi xác thực AWS
```
Giải pháp: Kiểm tra thông tin xác thực AWS của bạn và quyền IAM
Yêu cầu: bedrock:InvokeModel, bedrock:InvokeModelWithResponseStream
```

#### 2. Truyền tải không hoạt động
```
Giải pháp: Đảm bảo bạn đang sử dụng streamText() không phải generateText()
Kiểm tra phiên bản Next.js >= 14
```

#### 3. Công cụ không thực thi
```
Giải pháp: Xác minh lược đồ công cụ của bạn khớp với định dạng OpenAPI
Kiểm tra chức năng execute được định nghĩa đúng
```

#### 4. Vấn đề triển khai Amplify
```
Giải pháo: Xác minh biến môi trường được thiết lập
Kiểm tra amplify.yml cấu hình đúng
Xem lại log xây dựng cho lỗi
```

---

## Mã nguồn hoàn chỉnh

### Cấu trúc dự án

```
my-ai-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── lib/
│       ├── agent-config.ts
│       ├── model-config.ts
│       └── tools.ts
├── amplify.yml
├── package.json
├── tsconfig.json
└── next.config.js
```

### Các tệp cấu hình chính

#### `package.json`
```json
{
  "name": "my-ai-agent",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "ai": "^4.0.0",
    "@ai-sdk/amazon-bedrock": "^1.0.0",
    "@aws-sdk/client-bedrock-agent-runtime": "^3.0.0",
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

#### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Các bước tiếp theo

### Cải tiến được đề xuất

1. **Thêm xác thực** - Tích hợp Amplify Auth
2. **Triển khai lưu trữ lịch sử trò chuyện** - Sử dụng DynamoDB
3. **Thêm nhiều công cụ hơn** - Mở rộng chức năng trợ lý
4. **Cải thiện xử lý lỗi** - Thêm thử lại và dự phòng
5. **Giám sát** - Thiết lập CloudWatch cho log
6. **Tối ưu hóa hiệu suất** - Triển khai bộ nhớ đệm

### Tài nguyên học tập

- Tài liệu AI SDK: https://sdk.vercel.ai/docs
- Tài liệu Bedrock: https://docs.aws.amazon.com/bedrock/
- Tài liệu Next.js: https://nextjs.org/docs
- Tài liệu Amplify: https://docs.amplify.aws/

---

## Kết luận

Hướng dẫn này đã trình bày cách xây dựng một ứng dụng trợ lý AI đầy đủ tính năng với:
- ✅ Phản hồi truyền tải theo thời gian thực
- ✅ Tích hợp công cụ
- ✅ Triển khai sản xuất trên Amplify
- ✅ Mã hóa TypeScript hiện đại
- ✅ Trải nghiệm người dùng tuyệt vời

Sự kết hợp của **Bedrock AgentCore**, **AI SDK**, và **Amplify** cung cấp một nền tảng mạnh mẽ cho xây dựng ứng dụng AI có khả năng mở rộng và sẵn sàng sản xuất.

---

## Các điểm chính

### Kiến trúc và thiết kế
1. **Kiến trúc 3 tầng** - Giao diện (React) → API (Next.js) → AI (Bedrock)
2. **Kiến trúc truyền tải đầu tiên** - Xây dựng xung quanh khả năng truyền tải cho UX tốt nhất
3. **Thực thi công cụ phía máy chủ** - Bảo mật và kiểm soát tốt hơn
4. **Quản lý trạng thái** - Móc useChat xử lý mọi phức tạp

### Ngăn xếp công nghệ
5. **Next.js 15 + React 19** - Framework hiện đại với App Router
6. **AI SDK từ Vercel** - Trừu tượng hóa các nhà cung cấp AI, xử lý truyền tải
7. **Bedrock AgentCore** - Quản lý trợ lý AWS được quản lý
8. **Amplify Hosting** - Triển khai không cấu hình, tích hợp CI/CD

### Các tính năng chính
9. **Phản hồi truyền tải** - Độ trễ cảm nhận giảm, cập nhật dần dần
10. **Khung công cụ** - Định nghĩa tương thích OpenAPI
11. **Hỗ trợ TypeScript** - An toàn kiểu đầy đầu
12. **Xử lý lỗi** - Quản lý lỗi duyên dáng tích hợp

### Triển khai
13. **Tệp amplify.yml** - Cấu hình xây dựng cho Amplify
14. **Quản lý biến môi trường** - Xác thực AWS an toàn
15. **Triển khai tự động** - Đẩy lên git = triển khai sản xuất
16. **Mở rộng tự động** - Amplify xử lý giao thông

### Phương pháp hay
17. **Thiết kế nguyên tử** - Xây dựng các thành phần có thể tái sử dụng nhỏ
18. **Hướng dẫn qua ngữ cảnh hệ thống** - Hành vi trợ lý được kiểm soát
19. **Hiển thị gọi công cụ** - Minh bạch cho người dùng
20. **Kích thước vùng đệm tin nhắn** - Cấu hình cho tin nhắn lớn (2MB)

### Cân nhắc hiệu suất
21. **Bộ nhớ đệm** - Node modules và bộ nhớ đệm Next.js
22. **Thời lượng tối đa API** - Thiết lập 30 giây cho các cuộc trò chuyện dài
23. **Truyền tải SSR** - Nội dung truyền tải từ máy chủ
24. **CDN toàn cầu** - Phân phối qua Amplify

### Bảo mật
25. **Thông tin xác thực AWS** - Không bao giờ gửi lên kho lưu trữ, sử dụng biến môi trường
26. **Quyền IAM** - Quyền tối thiểu cần thiết
27. **Giới hạn tốc độ API** - Xem xét thêm cho sản xuất
28. **Xác thực** - Tích hợp Amplify Auth cho các ứng dụng sản xuất

### Cải tiến tương lai
29. **Lịch sử trò chuyện** - Lưu trữ cuộc trò chuyện trong DynamoDB
30. **Công cụ nâng cao** - API thời tiết thật, truy vấn cơ sở dữ liệu, v.v.
31. **Giám sát** - CloudWatch cho log và số liệu
32. **Cơ sở dữ liệu vector** - Cho RAG (Tạo Tăng cường Truy xuất)

---

**Đối tượng mục tiêu:** Lập trình viên Full-stack, Kỹ sư AI/ML, Nhà phát triển AWS  
**Cấp độ:** Trung cấp đến Nâng cao  
**Thời gian triển khai ước tính:** 2-4 giờ  
**Trường hợp sử dụng:** Chatbot AI, Trợ lý ảo, Ứng dụng tương tác AI, Công cụ sản xuất
