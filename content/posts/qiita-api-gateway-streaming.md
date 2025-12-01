---
title: "Thử nghiệm tính năng Streaming của API Gateway"
date: 2025-11-29
draft: false
tags: ["#Tech_News", "AWS", "API Gateway", "Bedrock", "Streaming", "Lambda"]
categories: ["AWS", "DevOps and Infrastructure"]
author: "yakumo_09"
---

# Thử nghiệm tính năng Streaming của API Gateway

## Thông tin bài viết
- **Tác giả**: yakumo_09
- **Ngày xuất bản**: 29/11/2025
- **Tags**: AWS, API Gateway, Bedrock, Streaming, Lambda
- **Nguồn**: [Qiita](https://qiita.com/yakumo_09/items/db2d2df88863136483e7)

## Tổng quan

Bài viết xác minh tính năng streaming response mới được thêm vào Amazon API Gateway. Từ phương thức buffer truyền thống chuyển sang tính năng Response Streaming cho phép gửi data được backend tạo ra tuần tự đến client. Tương thích tốt với model "xuất output dần dần theo đơn vị token" như Bedrock. Triển khai xử lý streaming với cấu trúc API Gateway + Lambda + Bedrock và xác nhận hiệu quả cải thiện UX.

## Các điểm chính

1. API Gateway hỗ trợ **Response Streaming (Phát streaming phản hồi)**
2. Phương thức buffer truyền thống có vấn đề **thời gian chờ lâu đến response đầu tiên**
3. Còn bị ảnh hưởng bởi **giới hạn response size 10MB** và **timeout 29 giây**
4. Có thể **gửi data backend tạo ra tuần tự đến client** ngay lập tức
5. Tương thích tốt với **model xuất theo đơn vị token** như Bedrock, có thể xem ký tự đầu tiên ngay
6. Tốc độ cảm nhận (UX) của **chatbot và API tạo văn bản** được cải thiện đáng kể
7. Xác minh với cấu trúc API Gateway + Lambda (**Node.js**) + Bedrock
8. Tính năng streaming của Lambda function **hiện chỉ hỗ trợ Node.js**
9. Trong integration request của API Gateway **thiết lập response transfer mode là "stream"**
10. Sử dụng **Claude 4.5 Haiku (Inference Profile)** để gọi ConverseStream

## Mở đầu

Amazon API Gateway đã có update hỗ trợ stream response.

Bỗng nhiên, dưới đây là so sánh streaming và non-streaming. Nhìn dễ hơn rất nhiều nhỉ.

Lần này tôi muốn giới thiệu update này như thế nào trong khi xác minh hoạt động.

## Đã thay đổi gì?

API Gateway cho đến nay, cơ bản là **"phương thức buffer"** trả về sau khi backend tạo xong toàn bộ response. Vì thế, với API xử lý nặng hay xử lý tạo sinh (ví dụ: API tạo văn bản bằng Bedrock) có vấn đề **thời gian chờ lâu đến khi response đầu tiên trả về**. Ngoài ra, do việc trả về toàn bộ response một lúc, còn bị ảnh hưởng bởi **giới hạn response size 10MB** và **timeout 29 giây**, với output lớn hay xử lý dài cần kỹ thuật.

**"Response Streaming (Phát streaming phản hồi)"** được thêm lần này, là tính năng mới **có thể gửi data backend tạo ra tuần tự đến client** ngay lập tức.

Với model **"xuất output dần dần theo đơn vị token"** như Bedrock rất tương thích, user có thể **nhìn thấy "ký tự đầu tiên" ngay lập tức**. Nhờ đó, **tốc độ cảm nhận (UX) của chatbot và API tạo văn bản được cải thiện đáng kể**.

## Tạo thử

Bài viết này sẽ xác minh tính năng streaming mới với **cấu trúc dùng Amazon Bedrock làm backend**.

- API Gateway
- Lambda
- Bedrock

Chuẩn bị cấu trúc như trên,

- Khác gì so với phương thức buffer truyền thống
- Output của Bedrock được streaming như thế nào
- Phía UI data đến vào thời điểm nào

tóm tắt trong khi xác nhận.

### Sơ đồ cấu trúc

Mượn sơ đồ cấu trúc từ blog chính thức AWS, lần này xác minh với cấu trúc sau.

```
Client → API Gateway → Lambda (Node.js) → Bedrock
                ↓
         Streaming Response
                ↓
              Client
```

### Lambda function

Về streaming function của Lambda, có vẻ **hiện chỉ hỗ trợ Node.js** 😭 Nên lần này thực hiện bằng Node.js.

Code như sau! Ngoài ra, timeout time của Lambda cũng đặt khoảng 30 giây.

```javascript
import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Lambda Response Streaming
export const handler = awslambda.streamifyResponse(
  async (event, responseStream, _ctx) => {
    // ---------------------------
    // 1. Metadata cho API Gateway
    // ---------------------------
    const httpStream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-api-gw-streaming": "true",
      },
    });

    try {
      // ---------------------------
      // 2. Lấy input (POST body)
      // ---------------------------
      let userPrompt = "あなたのAWSの推しサービスを教えて";

      if (event?.body) {
        try {
          const body = JSON.parse(event.body);
          userPrompt = body.message ?? body.prompt ?? userPrompt;
        } catch (_) {
          /* malformed JSON → tiến hành với default */
        }
      }

      // ---------------------------
      // 3. Bedrock client
      // ---------------------------
      const client = new BedrockRuntimeClient({
        region: process.env.BEDROCK_REGION ?? "us-west-2",
      });

      // Claude 4.5 Haiku (Inference Profile)
      const modelId =
        "global.anthropic.claude-haiku-4-5-20251001-v1:0";

      // ---------------------------
      // 4. Gọi ConverseStream
      // ---------------------------
      const command = new ConverseStreamCommand({
        modelId,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
            ],
          },
        ],
      });

      const response = await client.send(command);

      // ---------------------------
      // 5. Xử lý chunk của Bedrock tuần tự → Chảy đến API Gateway
      // ---------------------------
      for await (const item of response.stream) {
        if (!item?.contentBlockDelta) continue;

        const delta = item.contentBlockDelta.delta;
        const text = delta?.text;

        if (text) {
          httpStream.write(text);
        }
      }

      // ---------------------------
      // 6. Hoàn thành
      // ---------------------------
      httpStream.end();
    } catch (e) {
      // ---------------------------
      // 7. Khi error cũng đóng stream
      // ---------------------------
      console.error("Lambda Error:", e);

      httpStream.write("\n[ERROR]\n");
      httpStream.write(String(e));
      httpStream.end();
    }
  }
);
```

**Đừng quên gắn policy Bedrock vào execution role của Lambda function!**

### API Gateway

API Gateway làm trigger cho Lambda có thể thêm từ mục setting.

Chỗ này chọn **"REST API"**.

Thiết lập **integration request** của API Gateway.

Ở **response transfer mode** chọn **"stream"**.

Sau đó chỉ cần deploy API.

## Xác nhận hoạt động

Mở tree của stage, copy URL.

Có thể thực thi command sau từ terminal:

```bash
curl --no-buffer {URL}
```

Khi thực thi có image như sau! Xử lý được streaming thật tốt.

```
AWS Lambda は、サーバー管理なしでコードを実行できる素晴らしいサービスです...
(Text hiển thị dần dần)
```

## Cuối cùng

Lần này đã thử xử lý streaming của API Gateway. Lần này là gọi model đơn giản, nhưng nếu kết hợp với **AgentCore hay Strands** có vẻ thú vị hơn. Nếu có cơ hội sẽ thử.

---

## Điểm kỹ thuật

### Merit của Streaming

1. **Cải thiện thời gian response ban đầu**
   - Trả ngay theo đơn vị token
   - Cải thiện đáng kể trải nghiệm người dùng

2. **Giải quyết vấn đề timeout**
   - Tránh giới hạn timeout 29 giây
   - Có thể xử lý dài hơn

3. **Nới lỏng giới hạn response size**
   - Không cần lo giới hạn 10MB
   - Có thể xử lý output lớn

### Chú ý khi triển khai

- **Giới hạn Node.js**: Hiện tại chỉ Node.js hỗ trợ streaming
- **Setting header**: `x-api-gw-streaming: true` bắt buộc
- **Error handling**: Stream nhất định phải đóng bằng `end()`
- **IAM permission**: Cần quyền gọi Bedrock ở Lambda execution role

### Tình huống áp dụng

- Chatbot
- API tạo văn bản
- Output log realtime
- Trả dần data lớn

---

**👍 15 Likes | 💬 0 Comment**
