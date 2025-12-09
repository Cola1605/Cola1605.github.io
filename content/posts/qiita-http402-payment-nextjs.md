---
title: "Xây dựng nền kinh tế trích dẫn trong kỷ nguyên AI! Thử nghiệm HTTP 402 với Next.js"
date: 2025-12-06
author: "@Rasukarusan"
author_name: "なおとぅ (Naoto)"
organization: "any株式会社 (Công ty Cổ phần any)"
event: "any Product Team Advent Calendar 2025"
event_day: 7
categories:
  - Web Development
  - Blockchain
tags:
  - Next.js
  - HTTP 402
  - AI
  - Blockchain
  - Web3
  - x402
source: Qiita
source_url: https://qiita.com/Rasukarusan/items/5f074fa3d7216982fbdd
engagement:
  likes: 27
  comments: 7
---

Đây là bài viết ngày thứ 7 trong [any Product Team Advent Calendar 2025](https://qiita.com/advent-calendar/2025/any-product).

## AI時代の検索 (Tìm kiếm trong kỷ nguyên AI)

Chào mừng đến với "**Đại kỷ nguyên AI**" năm 2025.

Việc tìm kiếm thông tin của mọi người đang dần chuyển từ Google sang sử dụng GPT để tìm kiếm. Tuy nhiên, có một vấn đề lớn. Đó là dù các website bị AI trích dẫn bao nhiêu lần, chủ sở hữu trang web không nhận được bất kỳ lợi ích nào.

Chẳng phải lẽ nào có cách nào để người tạo nội dung nhận được phần thưởng phù hợp với việc nội dung của họ được AI trích dẫn không?

Đó là lúc HTTP 402 xuất hiện.

Bằng cách triển khai HTTP 402, khi AI truy cập nội dung, người dùng có thể trả phí truy cập. Và phí đó sẽ được trả cho chủ sở hữu website được trích dẫn. Nếu điều này trở thành quy chuẩn, có thể chúng ta sẽ thực hiện được "**nền kinh tế trích dẫn cho kỷ nguyên AI**".

Tuy HTTP 402 chưa được chuẩn hóa, nhưng hiện tại Coinbase đang tích cực thúc đẩy việc chuẩn hóa. Trong bài viết này, tôi sẽ giới thiệu về nỗ lực chuẩn hóa HTTP 402 đang diễn ra và thử nghiệm triển khai thực tế bằng Next.js.

## HTTP 402の再来 (Sự tái sinh của HTTP 402)

### HTTP 402 là gì?

HTTP 402 là status code có tên "Payment Required" trong các HTTP status code, được dự trữ cho tương lai từ hơn 30 năm trước.

![HTTP 402 Payment Required](https://qiita-user-contents.imgix.net/https%3A%2F%2Fcdn.qiita.com%2Fassets%2Fpublic%2Farticle-ogp-background-9f5428127621718a910c8b63951390ad.png?ixlib=rb-4.0.0&w=1200&mark64=aHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZ3PTkxNiZ0eHQ9SEJUUCUyMDQwMiUzQSUyMCVFNiU5NCVBRiVFNiU4OSU5NSVFMyU4MSU4NCVFNSVCRiU4NSVFOCVBMSU4QyZmaWxsPXdoaXRlJnR4dC1zaXplPTU2JnR4dC1mb250PUhpcmFnaW5vJTIwU2FucyUyMFc2JnR4dC1hbGlnbj1sZWZ0JTJDdG9wJnR4dC1zaGFkPTI=&mark-align=center%2Cmiddle&blend64=aHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZ3PTYxNiZ0eHQ9JTQwUmFzdWthcnVzYW4mdHh0LWNvbG9yPXJnYmEoMjU1JTJDMjU1JTJDMjU1JTJDMC42KSZ0eHQtc2l6ZT0zNiZ0eHQtZm9udD1IaXJhZ2lubyUyMFNhbnMlMjBXNiZ0eHQtYWxpZ249bGVmdCUyQ3RvcCZmaWxsPXdoaXRl&blend-align=center%2Cmiddle&blend-mode=normal&s=30f7a6f8f8e2d3f9c8b7d6e5f4a3b2c1)

Ban đầu, status code này được dự định sử dụng khi "cần thanh toán để truy cập vào website", nhưng vì nhiều lý do khác nhau mà 30 năm qua, nó chưa bao giờ được sử dụng đúng mục đích ban đầu.

### Tại sao 30 năm vẫn chưa được sử dụng?

Lý do chính là:

• **Không có phương thức thanh toán phổ quát**: Không có cách thanh toán chung nào như thẻ tín dụng quốc tế trên web  
• **Mô hình quảng cáo mạnh mẽ**: Các website kiếm tiền từ quảng cáo thay vì tính phí truy cập, nên không cần HTTP 402

Nhưng bây giờ tình hình đã thay đổi.

• **Sự phổ biến của AI**: AI có thể gọi API và duyệt web như một player trong nền kinh tế web  
• **Blockchain phổ biến**: Với blockchain, AI có thể dễ dàng sở hữu ví điện tử và thực hiện thanh toán

Hai yếu tố này kết hợp lại đã khiến HTTP 402 trở nên có ý nghĩa. Hiện tại, Coinbase đang tích cực thúc đẩy việc chuẩn hóa HTTP 402.

## HTTP 402の仕組み (Cơ chế hoạt động của HTTP 402)

Chi tiết về HTTP 402 được mô tả trong [tài liệu của Coinbase](https://docs.cdp.coinbase.com/402-payment-required/docs/welcome/).

Tóm tắt quy trình:

1. Client (người dùng hoặc AI) gửi request không có header `x-payment` tới server  
2. Server phát hiện không có `x-payment` và trả về status code 402 kèm theo thông tin thanh toán  
3. Client nhận thông số thanh toán và thực hiện thanh toán qua blockchain  
4. Client nhận token xác minh thanh toán và gửi lại request với header `x-payment`  
5. Server xác thực token và trả về nội dung được bảo vệ  

**Điểm thú vị nhất của HTTP 402**:  
AI có thể tự động hoàn thành toàn bộ quy trình thanh toán này. Chỉ cần AI có ví và được phép thực hiện thanh toán, nó có thể tự động trả tiền và truy cập nội dung.

### Tạo ví điện tử rất đơn giản

Để tạo ví blockchain, chỉ cần tạo cặp khóa công khai/khóa riêng. Có thể coi nó như việc tạo thẻ ghi nợ vậy - rất dễ dàng. AI có thể dễ dàng sở hữu ví của riêng mình.

## Next.jsで実装してみる (Triển khai với Next.js)

Bây giờ hãy thử triển khai HTTP 402 thực tế bằng Next.js. Coinbase cung cấp thư viện `x402-next` giúp việc triển khai trở nên đơn giản hơn rất nhiều.

### Bước 1: Tạo trang nội dung cần tính phí

Đầu tiên, tạo một trang hiển thị nội dung được bảo vệ (ví dụ: hình ảnh con mèo).

**`app/protected_content/page.tsx`:**

```typescript
export default function ProtectedContent() {
  return (
    <div>
      <h1>Nội dung được bảo vệ</h1>
      <img 
        src="https://example.com/cat.jpg" 
        alt="Hình ảnh con mèo siêu đáng yêu" 
      />
      <p>Chỉ những người đã thanh toán mới có thể xem được hình ảnh này!</p>
    </div>
  );
}
```

![Hình ảnh con mèo](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F107514%2F9f5c3e5d-6f8b-4e5a-8a5c-7e8f9d0a1b2c.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=abc123)

### Bước 2: Triển khai phía server

Tiếp theo, triển khai middleware xử lý thanh toán phía server.

**`app/protected_content/proxy.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Kiểm tra xem có token thanh toán không
  const paymentToken = request.headers.get('x-payment');
  
  if (!paymentToken) {
    // Không có token -> trả về 402 với thông số thanh toán
    return new NextResponse(JSON.stringify({
      paymentRequirements: {
        currency: 'USDC',
        chain: 'Solana',
        amount: '0.50',
        recipient: 'wallet_address_here'
      }
    }), {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'X-Payment-Required': 'true'
      }
    });
  }
  
  // Có token -> xác thực token qua API
  const verification = await fetch('https://payment-verification-api.com/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: paymentToken })
  });
  
  if (verification.ok) {
    // Thanh toán hợp lệ -> cho phép truy cập
    return NextResponse.next();
  } else {
    // Token không hợp lệ
    return new NextResponse('Thanh toán không hợp lệ', { status: 403 });
  }
}

export const config = {
  matcher: '/protected_content/:path*'
};
```

![HTTP 402 Response](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F107514%2Fabc-def-ghi.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=def456)

**Thông số thanh toán trả về:**

• `currency`: Loại tiền tệ (ví dụ: USDC)  
• `chain`: Blockchain sử dụng (ví dụ: Solana Devnet)  
• `amount`: Số tiền (ví dụ: $0.50)  
• `recipient`: Địa chỉ ví nhận tiền

### Bước 3: Triển khai phía client với x402-next

Cuối cùng, sử dụng thư viện `x402-next` để xử lý thanh toán phía client.

**Cài đặt:**

```bash
npm install x402-next
```

**Cấu hình `proxy.ts`:**

```typescript
import { paymentMiddleware } from 'x402-next';

export default paymentMiddleware({
  verificationEndpoint: 'https://payment-verification-api.com/verify',
  paymentSessionPath: '/api/payment_session'
});
```

Khi người dùng truy cập trang được bảo vệ, thư viện `x402-next` sẽ tự động:

1. Phát hiện response 402  
2. Hiển thị giao diện thanh toán  
3. Yêu cầu kết nối ví điện tử  
4. Thực hiện thanh toán  
5. Nhận JWT token xác minh  
6. Tự động gửi lại request với header `x-payment`  

![Màn hình thanh toán](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F107514%2Fpayment-screen.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=ghi789)

![Chọn ví](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F107514%2Fwallet-selection.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=jkl012)

![Thanh toán](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F107514%2Fpayment-process.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=mno345)

![Thanh toán hoàn tất](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F107514%2Fpayment-complete.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=pqr678)

### AI Agent truy cập không cần giao diện

Điểm thú vị là khi AI Agent truy cập, nó không cần giao diện người dùng. AI sẽ nhận được thông số thanh toán dưới dạng JSON:

```bash
$ curl https://your-site.com/protected_content

{
  "paymentRequirements": {
    "currency": "USDC",
    "chain": "Solana",
    "amount": "0.50",
    "recipient": "wallet_address_here"
  }
}
```

AI có thể tự động đọc thông tin này, thực hiện thanh toán qua ví của mình, và gửi lại request với token xác minh - tất cả diễn ra tự động.

## 補足: x402-nextは何をしているのか (Bổ sung: x402-next làm gì?)

Thư viện `x402-next` là SDK cho Next.js giúp đơn giản hóa việc triển khai HTTP 402. Nó thực hiện các công việc sau:

• **Giao diện kết nối ví**: Tự động hiển thị UI để người dùng kết nối ví Metamask, Coinbase Wallet, v.v.  
• **Quy trình thanh toán**: Yêu cầu người dùng thực hiện thanh toán khi nhận được response 402  
• **Tạo payment session**: Tạo trang xác nhận thanh toán  
• **Nhận JWT token**: Sau khi thanh toán thành công, nhận token xác minh từ server  
• **Tự động thêm header**: Tự động thêm header `x-payment` vào các request tiếp theo  

**Điểm tôi đặc biệt đánh giá cao**: Nhờ có x402-next, tôi không cần phải tự viết phần UI thanh toán phức tạp. Chỉ cần cài đặt thư viện và cấu hình, mọi thứ hoạt động ngay lập tức.

## 標準化が待ち遠しい (Mong chờ sự chuẩn hóa)

### Tình trạng hiện tại

Hiện tại HTTP 402 vẫn chưa được chuẩn hóa chính thức. Tuy nhiên, Coinbase đang tích cực thúc đẩy việc chuẩn hóa và đã công bố [ví dụ triển khai với MCP (Model Context Protocol)](https://docs.cdp.coinbase.com/mcp/docs/welcome/).

Bằng cách cung cấp các công cụ và tài liệu như vậy, người cung cấp nội dung có thể dễ dàng hỗ trợ HTTP 402 và bắt đầu nhận doanh thu từ việc AI trích dẫn nội dung của họ.

### Tương lai

Cá nhân tôi mong đợi HTTP 402 không chỉ được triển khai ở cấp độ cá nhân mà còn được hỗ trợ bởi các tầng cao hơn. Ví dụ, nếu Cloudflare tiến hành chuẩn hóa, có thể chỉ cần bật tính năng trong cài đặt là website của bạn trở thành đối tượng tính phí được.

Tôi rất mong chờ xem specification protocol nào sẽ trở thành chuẩn cuối cùng!

## 終わりに (Kết luận)

Trong bài viết này, tôi đã giới thiệu về sự tái sinh của HTTP 402 - status code đã bị bỏ quên trong 30 năm.

Với sự phổ biến của AI và blockchain, HTTP 402 cuối cùng cũng có ý nghĩa thực sự. Nếu nó được chuẩn hóa, có thể mỗi lần AI trích dẫn nội dung, người tạo nội dung sẽ nhận được phần thưởng tương xứng.

Đây có thể là mô hình kiếm tiền mới không phụ thuộc vào quảng cáo. Tôi rất mong chờ tương lai khi số lần AI trích dẫn tăng lên và mang lại doanh thu lớn!

Mã nguồn đầy đủ của ví dụ trong bài viết này có sẵn trên GitHub. Bạn có thể thử nghiệm trên Solana Devnet miễn phí.

---

**Về any株式会社**

Chúng tôi đang phát triển [Qast](https://qast.jp/) - nền tảng chia sẻ kiến thức dành cho doanh nghiệp. Hiện đang tuyển dụng kỹ sư! Nếu quan tâm, hãy liên hệ với chúng tôi.

**Liên kết:**
- [any株式会社 Careers](https://www.wantedly.com/companies/anyinc)
- [Qast - Nền tảng chia sẻ kiến thức](https://qast.jp/)
