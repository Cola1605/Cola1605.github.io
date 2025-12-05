---
title: "Xây Dựng API Phản Hồi Nhanh với Streaming Response của Amazon API Gateway"
date: 2025-12-05T12:00:00+09:00
draft: false
categories:
  - "AWS"
  - "DevOps and Infrastructure"
tags:
  - "Amazon API Gateway"
  - "AWS Lambda"
  - "Response Streaming"
  - "API Design"
  - "Serverless"
  - "Amazon Bedrock"
  - "AI Applications"
  - "Performance Optimization"
  - "TTFB"
  - "HTTP Streaming"
author: "Yuya Matsumoto"
translator: "日平"
description: "AWS công bố tính năng response streaming cho Amazon API Gateway, cho phép streaming response payload theo từng đợt đến client, cải thiện đáng kể trải nghiệm người dùng cho ứng dụng LLM-driven, giảm TTFB, và hỗ trợ payload lớn hơn 10 MB với request timeout lên đến 15 phút."
---

**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/building-responsive-apis-with-amazon-api-gateway-response-streaming/)

---

Bài viết này là bản dịch của "Building responsive APIs with Amazon API Gateway response streaming" được công bố ngày 19 tháng 11 năm 2025.

Hôm nay, AWS công bố hỗ trợ response streaming trên Amazon API Gateway. Tính năng này cho phép cải thiện đáng kể khả năng phản hồi của REST API bằng cách streaming response payload theo từng đợt đến client. Với tính năng mới này, bạn có thể sử dụng streaming response để cải thiện trải nghiệm người dùng khi xây dựng ứng dụng LLM-driven (như AI agent và chatbot), cải thiện hiệu suất time-to-first-byte (TTFB) của ứng dụng web và mobile, streaming file lớn, hoặc thực hiện các tác vụ chạy lâu với báo cáo tiến độ theo từng bước sử dụng giao thức như server-sent events (SSE).

Bài viết này sẽ giải thích về tính năng mới, các thách thức mà nó giải quyết, và cách sử dụng response streaming để cải thiện khả năng phản hồi của ứng dụng.

## Tổng Quan

Hãy xem xét kịch bản sau. Giả sử bạn đang chạy một ứng dụng agent do AI điều khiển sử dụng foundation model của Amazon Bedrock. Người dùng tương tác với ứng dụng thông qua API và đặt những câu hỏi phức tạp cần câu trả lời chi tiết. Trước khi có response streaming, người dùng phải gửi prompt và đợi cho đến khi cuối cùng nhận được response từ ứng dụng, đôi khi mất đến vài chục giây. Khoảng ngắt không tự nhiên này giữa câu hỏi và câu trả lời tạo ra trải nghiệm bị ngắt quãng và không tự nhiên.

Với tính năng response streaming mới của API Gateway, tương tác thông qua API trở nên mượt mà và tự nhiên hơn nhiều. Ngay khi ứng dụng bắt đầu xử lý response của model, bạn có thể sử dụng API Gateway để streaming trở lại cho người dùng.

![So sánh trải nghiệm người dùng khi trả về response từ foundation model của Bedrock trước khi kích hoạt response streaming của API Gateway (bên trái) và sau khi kích hoạt (bên phải)](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2025/11/06/compute-2459-apigw-streaming-compar.gif)

Người dùng giờ đây có thể thấy response của AI hiển thị theo thời gian thực từng từ một, giống như xem ai đó đang gõ. Phản hồi tức thì này làm cho ứng dụng cảm thấy phản hồi nhanh và hấp dẫn hơn, duy trì kết nối với người dùng trong suốt cuộc đối thoại. Hơn nữa, bạn không cần lo lắng về giới hạn kích thước response hoặc triển khai các giải pháp phức tạp. Streaming diễn ra tự động và hiệu quả, cho phép bạn tập trung vào xây dựng trải nghiệm người dùng xuất sắc thay vì quản lý các ràng buộc về cơ sở hạ tầng.

## Hiểu Về Response Streaming

Trong mô hình request-response truyền thống, response phải được tính toán hoàn toàn trước khi gửi đến client. Điều này có thể ảnh hưởng tiêu cực đến trải nghiệm người dùng. Client phải đợi cho đến khi response hoàn chỉnh được tạo ra ở phía server và được gửi qua mạng. Điều này đặc biệt rõ ràng trong các ứng dụng cloud tương tác và nhạy cảm với độ trễ như AI agent, chatbot, trợ lý ảo, và trình tạo nhạc.

![Mô hình request-response truyền thống](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2025/11/06/compute-2459-pic1.png)

Một kịch bản quan trọng khác là trả về response payload lớn như hình ảnh, tài liệu lớn, dataset. Trong một số trường hợp, các payload này có thể vượt quá giới hạn kích thước response 10 MB của API Gateway hoặc giới hạn timeout tích hợp mặc định là 29 giây. Trước khi bắt đầu response streaming, các developer phải vượt qua những giới hạn này bằng cách sử dụng URL S3 có chữ ký để tải xuống response lớn, hoặc chấp nhận RPS thấp đổi lại với việc tăng timeout. Mặc dù có chức năng, nhưng những giải pháp này mang lại độ trễ bổ sung và độ phức tạp về kiến trúc.

Với hỗ trợ response streaming, bạn có thể giải quyết những thách thức này. Bạn có thể cập nhật REST API để trả về streaming response, cải thiện đáng kể trải nghiệm người dùng, cải thiện hiệu suất TTFB, hỗ trợ kích thước response payload vượt quá 10 MB, và xử lý request mất đến 15 phút.

![Mô hình response streaming](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2025/11/06/compute-2459-pic2.png)

Tính năng response streaming đã mang lại hiệu suất lớn cho các tổ chức.

> "Việc hợp tác chặt chẽ với đội ngũ AWS để kích hoạt response streaming là quan trọng trong việc thúc đẩy lộ trình của chúng tôi để cung cấp trải nghiệm storefront hiệu suất cao nhất cho khách hàng lớn nhất trên Salesforce Commerce Cloud. Sự hợp tác của chúng tôi đã vượt qua mục tiêu Core Web Vital. Chỉ số Total Blocking Time giảm hơn 98%, giúp khách hàng thúc đẩy doanh thu và tỷ lệ chuyển đổi cao hơn."
> 
> — Drew Lau, Senior Director of Product Management tại Salesforce

Response streaming được hỗ trợ trên bất kỳ HTTP proxy integration nào, hàm AWS Lambda (sử dụng proxy integration mode), và private integration. Để bắt đầu, như được giải thích trong phần tiếp theo, hãy cấu hình integration để streaming response từ backend và triển khai lại API để kích hoạt thay đổi.

## Bắt Đầu với Response Streaming

Để kích hoạt response streaming cho REST API, hãy cập nhật cấu hình integration và đặt response transfer mode thành `STREAM`. Điều này cho phép API Gateway bắt đầu streaming response đến client ngay khi response byte khả dụng. Khi sử dụng response streaming, bạn có thể đặt request timeout lên đến 15 phút. Để tối ưu hóa thời gian đến byte đầu tiên, AWS khuyến nghị mạnh mẽ rằng backend integration cũng triển khai response streaming.

Như được hiển thị trong các snippet sau, bạn có thể kích hoạt response streaming theo nhiều cách khác nhau.

### Sử Dụng API Gateway Console

Khi tạo method integration, chọn "Stream" trong response transfer mode.

![Kích hoạt response streaming trong API Gateway console](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2025/11/06/compute-2459-pic3.png)

### Sử Dụng OpenAPI Specification

```yaml
paths:
  /products:
    get:
      x-amazon-apigateway-integration:
        httpMethod: "GET"
        uri: "https://example.com"
        type: "http_proxy"
        timeoutInMillis: 300000
        responseTransferMode: "STREAM"
```

### Sử Dụng AWS CloudFormation

Lưu ý Uri fragment `/response-streaming-invocations`. Điều này hướng dẫn API Gateway sử dụng endpoint Lambda InvokeWithResponseStreaming.

```yaml
MyProxyResourceMethod:
  Type: 'AWS::ApiGateway::Method'
  Properties:
    RestApiId: !Ref LambdaSimpleProxy
    ResourceId: !Ref ProxyResource
    HttpMethod: ANY
    Integration:
      Type: AWS_PROXY
      IntegrationHttpMethod: POST
      ResponseTransferMode: STREAM
      Uri: !Sub arn:aws:apigateway:${APIGW_REGION}:lambda:path/2021-11-15/functions/${FN_ARN}/response-streaming-invocations
```

### Sử Dụng AWS CLI

```bash
aws apigw update-integration \
   --rest-api-id a1b2c2 \
   --resource-id aaa111 \
   --http-method GET \
   --patch-operations "op='replace',path='/responseTransferMode',value=STREAM" \
   --region us-west-2
```

## Sử Dụng Response Streaming với Hàm Lambda

Khi sử dụng hàm Lambda làm downstream integration endpoint, hàm Lambda phải được kích hoạt streaming. Như được hiển thị trong sơ đồ sau, API Gateway gọi hàm bằng API InvokeWithResponseStreaming và yêu cầu Lambda proxy integration.

![Sử dụng response streaming của API Gateway với hàm Lambda cho ứng dụng AI tương tác](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2025/11/06/compute-2459-pic4.png)

Khi sử dụng response streaming với hàm Lambda, API Gateway mong đợi handler response stream chứa các thành phần sau (theo thứ tự):

1. **JSON response metadata** – Phải là đối tượng JSON hợp lệ và chỉ có thể bao gồm các trường statusCode, headers, multiValueHeaders, và cookies (tất cả đều tùy chọn). Metadata không thể là chuỗi rỗng. Phải ít nhất là đối tượng JSON rỗng.

2. **8-byte null delimiter** – Như được hiển thị dưới đây, khi sử dụng phương thức tích hợp `awslambda.HttpResponseStream.from()`, Lambda tự động thêm delimiter này. Nếu không sử dụng phương thức này, bạn phải tự thêm delimiter.

3. **Response payload** – Có thể để trống.

Snippet code sau đây cho thấy cách trả về streaming response từ hàm Lambda để tương thích với response streaming của API Gateway.

```javascript
export const handler = awslambda.streamifyResponse(
   async (event, responseStream, context) => {
      const httpResponseMetadata = {
         statusCode: 200,
         headers: {
            'Content-Type': 'text/plain',
            'X-Custom-Header': 'some-value'
         }
      };

      responseStream = awslambda.HttpResponseStream.from(
         responseStream,
         httpResponseMetadata
      );

      responseStream.write('hello');
      await new Promise(r => setTimeout(r, 1000));
      responseStream.write(' world');
      await new Promise(r => setTimeout(r, 1000));
      responseStream.write('!!!');
      responseStream.end();
   }
);
```

## Sử Dụng Response Streaming với HTTP Proxy Integration

Bạn có thể streaming HTTP response từ ứng dụng được sử dụng làm downstream integration endpoint (ví dụ: web server chạy trên Amazon ECS hoặc Amazon EKS). Trong trường hợp này, bạn phải sử dụng `HTTP_PROXY` integration và chỉ định response transfer mode là `STREAM`.

![Sử dụng response streaming của API Gateway với ứng dụng HTTP server](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2025/11/06/compute-2459-pic5.png)

Khi API Gateway nhận streaming response từ ứng dụng, nó đợi cho đến khi việc truyền HTTP header block hoàn tất. Sau đó, nó gửi HTTP response status code và header đến client, sau đó gửi nội dung từ ứng dụng mà dịch vụ API Gateway nhận được. Nó tiếp tục streaming response từ ứng dụng đến client cho đến khi stream kết thúc (tối đa 15 phút).

Nhiều framework phát triển API và ứng dụng web phổ biến cung cấp abstraction cho response streaming. Snippet code sau đây cho thấy cách triển khai HTTP response streaming bằng FastAPI.

```python
app = FastAPI()

async def stream_response():
   yield b"Hello "
   await asyncio.sleep(1)
   yield b"World "
   await asyncio.sleep(1)
   yield b"!"

@app.get("/")
async def main():
   return StreamingResponse(stream_response(), media_type="text/plain")
```

## Thêm Real-time Response Streaming vào HTTP Client

HTTP client xử lý streaming response fragment đến theo các cách khác nhau. Snippet code sau đây cho thấy cách xử lý streaming response trong ứng dụng Node.js.

```javascript
const request = http.request(options, (response)=>{
   response.on('data', (chunk) => {
      console.log(chunk);
   });

   response.on('end', () => {
      console.log('Response complete');
   });
});

request.end();
```

Khi sử dụng CURL, bạn có thể sử dụng argument `--no-buffer` để xuất streaming response fragment khi chúng đến.

```bash
curl --no-buffer {URL}
```

## Code Mẫu

Clone dự án mẫu này từ GitHub để xác nhận hoạt động của response streaming của API Gateway:

https://github.com/aws-samples/serverless-samples/tree/main/apigw-response-streaming

Làm theo hướng dẫn trong README.md để provision dự án mẫu vào tài khoản AWS của bạn.

## Các Điểm Cần Xem Xét

Trước khi kích hoạt response streaming, hãy xem xét các điểm sau:

- Response streaming khả dụng trên REST API và có thể được sử dụng với HTTP_PROXY integration, Lambda integration (proxy mode), và private integration.
- Response streaming của API Gateway có thể được sử dụng với bất kỳ endpoint type nào như regional, private, edge-optimized, với hoặc không có custom domain name.
- Khi sử dụng response streaming, bạn có thể đặt response timeout lên đến 15 phút tùy thuộc vào yêu cầu của kịch bản.
- Tất cả streaming response từ regional hoặc private endpoint có idle timeout 5 phút. Tất cả streaming response từ edge-optimized endpoint có idle timeout 30 giây.
- Trong mỗi streaming response, 10 MB đầu tiên của response payload không có giới hạn băng thông. Response payload data vượt quá 10 MB bị giới hạn ở 2 MB/giây.
- Response streaming tương thích với các tính năng bảo mật và governance hiện có như authorizer, WAF, access control, TLS/mTLS, request throttling.
- Khi xử lý streaming response, các tính năng sau không được hỗ trợ: response transformation bằng VTL, integration response caching, và content encoding.
- Hãy luôn bảo vệ API của bạn khỏi truy cập trái phép và các mối đe dọa bảo mật tiềm ẩn khác bằng cách triển khai authorization phù hợp với Lambda authorizer hoặc Amazon Cognito user pool.

## Khả Năng Quan Sát

Bạn có thể tiếp tục sử dụng các tính năng observability hiện có như execution log, access log, AWS X-Ray integration, và Amazon CloudWatch metrics với response streaming của API Gateway.

Ngoài các access log variable hiện có, các variable mới sau đây khả dụng:

| Variable | Mô tả |
|----------|-------|
| `$content.integration.responseTransferMode` | Response transfer mode của integration. BUFFERED hoặc STREAMED |
| `$context.integration.timeToAllHeaders` | Thời gian từ khi API Gateway thiết lập integration connection đến khi nhận tất cả integration response header từ client |
| `$context.integration.timeToFirstContent` | Thời gian từ khi API Gateway thiết lập integration connection đến khi nhận content byte đầu tiên |

## Giá Cả

Với tính năng mới này, bạn tiếp tục trả cùng phí API call cho streaming response. Mỗi 10 MB response data được làm tròn lên 10 MB gần nhất và được tính như một request. Để biết chi tiết, vui lòng tham khảo trang giá API Gateway.

## Tổng Kết

Tính năng response streaming mới của Amazon API Gateway nâng cao cách bạn xây dựng và cung cấp API phản hồi nhanh trên cloud. Bằng cách streaming response data ngay khi nó khả dụng, bạn có thể cải thiện đáng kể hiệu suất thời gian đến byte đầu tiên và vượt qua giới hạn payload size và timeout truyền thống. Điều này đặc biệt có giá trị cho ứng dụng do AI điều khiển cần khả năng phản hồi thời gian thực, truyền file, và trải nghiệm web tương tác.

Để biết thêm chi tiết về response streaming của API Gateway, vui lòng tham khảo tài liệu dịch vụ. Để biết thêm về xây dựng kiến trúc serverless, vui lòng tham khảo Serverless Land.

---

**Tags:** Amazon API Gateway, AWS Lambda, Response Streaming, API Design, Serverless, Amazon Bedrock, AI Applications, Performance Optimization, TTFB, HTTP Streaming
