---
title: "Hiểu Hoàn Toàn Prompt Caching để Giảm Chi Phí LLM Cực Mạnh"
date: 2025-12-05T15:00:00+09:00
draft: false
categories:
  - "AI and Machine Learning"
  - "Development"
tags:
  - "AI"
  - "LangChain"
  - "LLM"
  - "Prompt Caching"
  - "Cost Optimization"
  - "OpenAI"
  - "Gemini"
  - "Claude"
  - "Performance"
author: "Yuku Kotani"
translator: "日平"
description: "Bài viết giới thiệu chi tiết về Prompt Caching - kỹ thuật tối ưu hóa chi phí LLM có thể giảm tới 50-90% chi phí. Phân tích cách thiết kế context hiệu quả, so sánh cách triển khai trên OpenAI, Gemini, Claude với code examples cụ thể."
---

**Nguồn:** [Zenn - Ubie テックブログ](https://zenn.dev/ubie_dev/articles/ade17afebabaa9)  
**Advent Calendar:** [Ubie Tech Advent Calendar 2025](https://adventar.org/calendars/12070) - Ngày 1

---

## Mở Đầu

Ứng dụng di động của Ubie ([iOS](https://apps.apple.com/jp/app/%E3%83%A6%E3%83%93%E3%83%BCai%E5%8F%97%E8%A8%BA%E7%9B%B8%E8%AB%87-%E7%97%87%E7%8A%B6%E3%81%8B%E3%82%89%E7%97%85%E6%B0%97%E3%82%84%E7%97%85%E9%99%A2%E6%A4%9C%E7%B4%A2/id1573213207)/[Android](https://play.google.com/store/apps/details?id=app.ubie&hl=ja&gl=US)) cung cấp trợ lý AI y tế để tư vấn các vấn đề sức khỏe. Khi cung cấp sản phẩm LLM cho người dùng cuối (toC), tối ưu hóa chi phí trở thành thách thức quan trọng.

Bài viết này giới thiệu thực tiễn về Prompt Caching - một trong những công nghệ cốt lõi cho việc tối ưu hóa này. Nếu bạn chưa thử Prompt Caching, có thể đang có **dư địa cắt giảm chi phí tới 50%** đang ẩn trong hệ thống của bạn.

## Prompt Caching Là Gì

Prompt Caching (hay Context Caching) là cơ chế cho phép cache và tái sử dụng các phần prompt đầu vào giống nhau khi gửi lặp lại, giúp giảm chi phí và độ trễ.

Nhiều nhà cung cấp LLM cung cấp tính năng này, và khi cache hit xảy ra, có thể **giảm khoảng 90% chi phí token đầu vào**.

- [Gemini](https://ai.google.dev/gemini-api/docs/caching)
- [Claude](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI](https://platform.openai.com/docs/guides/prompt-caching)

Điểm dễ hiểu nhầm ở đây là Prompt Caching **chỉ cache token đầu vào**, không liên quan gì đến đầu ra. Tức là, nó không hoạt động theo kiểu "nhập prompt A thì luôn xuất ra B". Đơn giản chỉ là "tái sử dụng prompt A sẽ rẻ hơn và nhanh hơn". Điều này khác với mô hình tư duy về cache trong các ứng dụng thông thường nên cần lưu ý.

## Thiết Kế Context để Tận Dụng Prompt Caching

Prompt Caching hoạt động dựa trên **khớp tiền tố (prefix matching) của đầu vào**. Hãy xem các ví dụ tốt và ví dụ xấu cụ thể.

### Ví Dụ Tốt: System Prompt Cố Định

Đầu tiên là trường hợp đơn giản: system prompt cố định + user prompt thay đổi mỗi lần. Request đầu tiên cache không có hiệu lực.

Request tiếp theo chỉ thay đổi user prompt. Ở đây, vì system prompt ở đầu khớp với lần trước, cache sẽ có hiệu lực.

Như vậy, nguyên tắc là **đặt các prompt ít thay đổi ở đầu**.

### Ví Dụ Tốt: Hội Thoại Đa Lượt (Multi-turn)

Tiếp theo, xem xét trường hợp hội thoại đa lượt có lưu giữ lịch sử. Request đầu tiên cache không có hiệu lực.

Từ lượt thứ 2 trở đi, vì phần đầu vào trước đó (= lịch sử hội thoại) khớp tiền tố nên cache có hiệu lực.

Tương tự ở lượt tiếp theo, cache hit với lịch sử cho đến lượt trước đó.

Trong hội thoại đa lượt, đầu vào tăng theo lịch sử mỗi lượt, làm chi phí tăng phi tuyến. Sử dụng cache như thế này có thể nén đáng kể chi phí đó.

Điều này không chỉ hữu ích cho hội thoại đa lượt, mà còn cho tất cả các kịch bản nhập lại đầu vào/đầu ra LLM một cách đệ quy. Ví dụ, trường hợp phản hồi kết quả đánh giá bằng LLM-as-a-Judge cho đầu ra LLM và retry.

### Ví Dụ Xấu: System Prompt Động

Phát triển hội thoại đa lượt, thử nhúng thời gian hiện tại vào system prompt.

Tiếp tục nhập user prompt tiếp theo. Ở đây cũng cập nhật thời gian hiện tại trong system prompt. Khi đó, prefix matching của system prompt bị phá vỡ, nên phần lịch sử hội thoại sau đó không được cache.

Như vậy, trong hội thoại đa lượt, quan trọng là **không thay đổi system prompt trong suốt session**.

### Ví Dụ Tốt: Đầu Vào Động Dùng Tool Use

Khi muốn nhúng giá trị động, thay vì đưa vào system prompt, phù hợp hơn là **dùng tool để LLM lấy thông tin động**.

Bằng cách truyền kết quả thực thi tool, LLM có thể lấy được giá trị động cần thiết (như thời gian real-time).

Khi hỏi lại về thời gian, tool call tương tự được thực hiện và trả lời thời gian mới nhất. Ở đây, vì prompt vẫn chồng lên như cũ, có thể thực hiện đầu vào động trong khi vẫn giữ cache cho lịch sử hội thoại.

Như vậy, quan điểm **"làm sao để không phá hủy lịch sử quá khứ"** khi chồng lên sẽ giúp cache hoạt động tốt hơn.

## Ví Dụ Triển Khai và Chi Phí

Tiếp theo, giới thiệu cách sử dụng cache và ảnh hưởng đến chi phí trên từng model OpenAI, Gemini, Claude.

### OpenAI

Với model OpenAI, mặc định sẽ tự động trích xuất và cache phần đầu vào khớp ở đầu.

Tức là, chỉ cần gửi prompt như bình thường, phần cố định ở đầu là system prompt sẽ được cache.

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-5-mini",
});

const response = await model.invoke([
  new SystemMessage({
    content: [
      {
        type: "text",
        text: "あなたはプロのマナー講師です",
      },
      {
        type: "text",
        text: "与えられたメッセージを丁寧語にしてください",
      },
    ],
  }),
  new HumanMessage(RANDOM_MESSAGE_FROM_USER),
]);
```

Tuy nhiên, nếu prompt đối tượng cache **dưới 1024 token thì không thể cache** (tức là code mẫu trên không được cache).

Ghi cache không có chi phí thêm ngoài chi phí token đầu vào tiêu chuẩn. Và khi cache hit, chi phí token đầu vào **giảm 90%**[^1]. Tức là, nếu thiết kế context đúng như đã nói, có thể nói là tự động rẻ hơn.

[^1]: Với họ gpt-5. Chi tiết xem [tài liệu](https://platform.openai.com/docs/pricing)

### Gemini

Gemini tương tự, có bật [implicit caching](https://ai.google.dev/gemini-api/docs/caching#implicit-caching) tự động cache.

Tuy nhiên, có thể do multi-region, đôi khi phải gửi request nhiều lần mới được cache. Chiến lược cache là black box bên trong Google và không thể can thiệp.

Dù vậy, với nhiều người thì implicit caching đã đủ, nhưng nếu muốn tune chi tiết, có thể dùng [explicit caching](https://ai.google.dev/gemini-api/docs/caching#explicit-caching) để tạo cache trước và sử dụng cache đó một cách rõ ràng khi request.

Với implicit caching, giống OpenAI, ghi không có chi phí thêm, khi cache hit thì chi phí token đầu vào **giảm 90%**[^2]. Mặt khác, explicit caching có chi phí lưu trữ tùy thời gian giữ cache.

Chi tiết xem [tài liệu](https://ai.google.dev/gemini-api/docs/caching).

[^2]: Với họ Gemini 2.5. Chi tiết xem [tài liệu](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview#implicit-caching)

### Claude

Với Claude, không có tính năng tự động cache như OpenAI hay Gemini. Thay vào đó, có thể kích hoạt cache rõ ràng bằng option `cache_control`.

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5@20250929",
});

const response = await model.invoke([
  new SystemMessage({
    content: [
      {
        type: "text",
        text: "あなたはプロのマナー講師です",
      },
      {
        type: "text",
        text: "与えられたメッセージを丁寧語にしてください",
        cache_control: { type: "ephemeral" }, // Thêm dòng này
      },
    ],
  }),
  new HumanMessage(RANDOM_MESSAGE_FROM_USER),
]);
```

Prompt nằm trước block có đặt `cache_control` sẽ trở thành đối tượng prefix matching của cache. Tức là trong ví dụ trên, toàn bộ system prompt là đối tượng cache và được cache mặc định **5 phút** (nếu cài đặt thì 1 giờ).

Với Claude, khi ghi cache mất chi phí **1.25 lần** bình thường, khi đọc mất **0.1 lần**. Tức là nếu cache bừa bãi có thể làm chi phí tăng.

Chi tiết xem [tài liệu](https://platform.claude.com/docs/ja/build-with-claude/prompt-caching).

Ngoài ra, sự thay đổi chi phí khi áp dụng Prompt Caching trong hội thoại đa lượt có thể được mô phỏng như sau với việc xem xét TTL:

Bảng log hội thoại thực tế đã tích lũy:

```sql
CREATE TABLE messages (
  session_id UUID NOT NULL,        -- ID session hội thoại đa lượt
  input_token_size INTEGER,         -- Độ dài token nhập vào LLM
  output_token_size INTEGER,        -- Độ dài token LLM xuất ra
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Thời điểm thực thi LLM
)
```

Nếu đã có log thì có thể ước tính nhanh, hãy thử xem. Sẽ giảm hơn bạn nghĩ.

## Kết Luận

Đã giới thiệu cơ chế và thực tiễn về Prompt Caching. Ngay cả chỉ từ system prompt ở đầu, hãy thử áp dụng xem.

Ngoài ra, **Ubie Tech Advent Calendar 2025** còn nhiều bài viết thú vị tiếp theo. Hãy theo dõi nhé.

---

**Tags:** AI, LangChain, LLM, tech, Prompt Caching, Tối ưu hóa chi phí
