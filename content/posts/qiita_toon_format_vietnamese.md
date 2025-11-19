---
title: "【TOON】Kết Thúc Kỷ Nguyên JSON? Giải Thích Về TOON Đang Gây Chú Ý"
date: 2025-11-17
draft: false
categories: ["AI", "Data Format", "LLM"]
tags: ["JSON", "AI", "TOON", "LLM", "AI-agent", "data-format"]
description: "Giới thiệu về TOON (Token-Oriented Object Notation) - định dạng dữ liệu mới được tối ưu hóa cho LLM, giảm 30-60% token so với JSON, với cú pháp đơn giản hơn và khả năng xử lý hiệu quả hơn."
---

# 【TOON】Kết Thúc Kỷ Nguyên JSON? Giải Thích Về TOON Đang Gây Chú Ý

**Tác giả:** @shanks665  
**Ngày công khai:** 2025-11-17  
**Nguồn:** https://qiita.com/shanks665/items/a5ec31706af9ffffc491  
**Thẻ:** #JSON #AI #Toon #LLM #AIエージェント


## Giới thiệu

Bạn có bao giờ lo lắng về chi phí API của LLM không? Khi truyền lượng lớn dữ liệu vào prompt, số lượng token tăng vọt khiến cả chi phí và thời gian phản hồi đều xấu đi.

Một trong những nguyên nhân là JSON. JSON được thiết kế để con người dễ đọc, nên có nhiều ký hiệu và lặp lại. Đối với LLM, đây là định dạng có nhiều lãng phí.

Đó là lý do xuất hiện "TOON (Token-Oriented Object Notation)". Đây là định dạng dữ liệu được tối ưu hóa chuyên dụng cho LLM, có thể giảm 30~60% token so với JSON.

Trong bài viết này, tôi sẽ giải thích TOON có gì tuyệt vời và cách sử dụng nó thông qua các ví dụ cụ thể.


## Vấn đề của JSON là gì?

Hãy xem ví dụ cụ thể. Khi biểu diễn dữ liệu sản phẩm bằng JSON sẽ như thế này:

```json
{
  "products": [
    { "id": 301, "name": "Mouse", "price": 29.99 },
    { "id": 302, "name": "Keyboard", "price": 89.00 },
    { "id": 303, "name": "Hub", "price": 45.50 }
  ]
}
```

Vấn đề rất rõ ràng. Các tên khóa `"id":`, `"name":`, `"price":` bị lặp lại theo số lượng sản phẩm.

Nếu có 100 sản phẩm, chỉ riêng các tên khóa này đã phải gửi cùng một chuỗi ký tự 300 lần. Đây chính là sự lãng phí token.


## Cách viết TOON

TOON loại bỏ sự lặp lại này. Chỉ khai báo tên trường một lần duy nhất ở đầu, sau đó chỉ liệt kê các giá trị.

Viết cùng dữ liệu bằng TOON sẽ như thế này:

```toon
products{id,name,price}:
301,Mouse,29.99
302,Keyboard,89.00
303,Hub,45.50
```

Chỉ có vậy thôi.

**Điều gì đã xảy ra:**

- Khai báo tên khóa (`"id":`, `"name":`, `"price":`) chỉ 1 lần
- Xóa bỏ lặp lại dấu ngoặc nhọn `{}`
- Giảm thiểu dấu ngoặc kép `"`
- Giảm thiểu dấu phẩy và dấu hai chấm

Kết quả, có thể biểu diễn cùng thông tin với **khoảng 40% ít token hơn**.


## Một ví dụ khác: Danh sách người dùng

Hãy xem ví dụ đơn giản hơn.

**JSON:**

```json
{
  "users": [
    {"id": 1, "name": "Alice", "role": "admin"},
    {"id": 2, "name": "Bob", "role": "user"}
  ]
}
```

**TOON:**

```toon
users{id,name,role}:
1,Alice,admin
2,Bob,user
```

Rõ ràng ngay, TOON ngắn gọn và dễ đọc hơn áp đảo.


## Ưu điểm của TOON

### 1. Giảm token và giảm chi phí

API của LLM tính phí theo số lượng token. TOON giảm bỏ các ký hiệu dư thừa của JSON, cho phép gửi cùng thông tin với 30~60% ít token hơn.

**Ví dụ đo lường thực tế:**

- Dữ liệu kho GitHub (100 mục): JSON 15,145 token → TOON 8,745 token (giảm 42%)
- Dữ liệu phân tích hàng ngày (180 ngày): JSON 10,977 token → TOON 4,507 token (giảm 59%)

**Khi sử dụng GPT-4o:**

- Đầu vào: $5 per 1M tokens
- Đầu ra: $15 per 1M tokens

được tính phí. Nếu hàng ngày truyền 1 triệu token dữ liệu vào LLM, chỉ cần chuyển sang TOON có thể giảm chi phí 75~150$ mỗi tháng. Với hệ thống quy mô lớn, sự chênh lệch có thể lên đến từ hàng trăm nghìn đến hàng triệu yên mỗi năm.

### 2. Tăng tốc phản hồi và tận dụng ngữ cảnh

Khi số lượng token giảm, thời gian xử lý của LLM cũng ngắn lại. Đặc biệt với các ứng dụng sử dụng nhiều cửa sổ ngữ cảnh như RAG hoặc agent, có thể cảm nhận được sự cải thiện về thời gian phản hồi.

Quan trọng hơn nữa là có thể sử dụng hiệu quả hơn cửa sổ ngữ cảnh hạn chế. Ví dụ với cửa sổ 128K token, JSON chỉ truyền được khoảng 200 kết quả tìm kiếm, nhưng TOON có thể truyền khoảng 350 kết quả. Vì có thể sử dụng nhiều thông tin hơn nên độ chính xác câu trả lời của LLM tăng lên.

### 3. Cải thiện độ chính xác suy luận và tìm kiếm

Bằng cách cung cấp dữ liệu có cấu trúc ở dạng sạch hơn cho LLM, chất lượng suy luận cũng được cải thiện. Các ký hiệu dư thừa và lặp lại của JSON trong một số trường hợp trở thành "nhiễu" đối với LLM. TOON giảm thiểu điều này và thể hiện rõ ràng cấu trúc bản chất của dữ liệu. Kết quả là LLM dễ hiểu đúng mối quan hệ của dữ liệu hơn.

Đặc biệt có báo cáo về việc cải thiện độ chính xác tìm kiếm trong hệ thống RAG. Khi truyền kết quả tìm kiếm dưới dạng TOON cho LLM, xác suất trích xuất chính xác thông tin liên quan tăng cao. Với dữ liệu dạng bảng, mối tương ứng giữa tên trường và giá trị trở nên rõ ràng nên giảm dư địa cho LLM hiểu nhầm.

**Hiệu quả thực tế:**

- Trích xuất thông tin liên quan trong RAG: Cũng có trường hợp cải thiện khoảng 15% độ chính xác so với JSON
- Tổng hợp và phân tích dữ liệu dạng bảng: Giảm đáng kể việc nhận dạng sai tên trường
- Tích hợp nhiều nguồn dữ liệu: Tính nhất quán của cấu trúc dễ được duy trì

TOON phát huy sức mạnh đặc biệt với dữ liệu có cấu trúc "các trường giống nhau lặp lại" như kết quả truy vấn cơ sở dữ liệu, kết quả tìm kiếm RAG, dữ liệu dạng bảng như CSV, dữ liệu log, dữ liệu chuỗi thời gian.

### 4. Khả năng tương thích hoàn toàn với JSON

Một trong những đặc điểm quan trọng của TOON là có thể chuyển đổi qua lại hoàn toàn với JSON. Dữ liệu có thể biểu diễn bằng TOON đều có thể chuyển về JSON. Ngược lại cũng tương tự. Nghĩa là không cần phải bỏ đi tài sản JSON hiện có, có thể đi lại giữa TOON và JSON khi cần thiết.

Chuyển đổi TOON ⇔ JSON không làm mất thông tin, thông tin kiểu như số và chuỗi ký tự cũng được giữ lại. Cấu trúc lồng nhau phức tạp cũng có thể chuyển đổi khứ hồi. Với khả năng tương thích này, có thể sử dụng JSON cho API, chỉ xử lý nội bộ dùng TOON.

Việc có thể triển khai từng bước cũng rất lớn. Không cần phải chuyển đổi tất cả cùng một lúc, có thể dần dần chuyển sang TOON từ phần có hiệu quả cao.


## Hiểu qua sơ đồ: Luồng dữ liệu

JSON có nhiều công đoạn chuyển đổi, TOON có thể truyền ở định dạng hiệu quả ngay từ đầu. Sơ đồ đơn giản nhưng sự khác biệt này ảnh hưởng trực tiếp đến độ trễ và chi phí.


## Cách sử dụng thực tế

### Chuyển đổi từ JSON sang TOON

TOON được cung cấp SDK chính thức cho nhiều ngôn ngữ:

- TypeScript/JavaScript: `@toon-format/toon`
- Python: `python-toon`
- .NET: `NIZZOLA.TOON.NET`
- Elixir, R, Gleam, v.v.

**Luồng cơ bản:**

```javascript
import { stringify, parse } from '@toon-format/toon';

// Chuẩn bị dữ liệu JSON
const data = {
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' }
  ]
};

// Chuyển đổi sang TOON
const toonString = stringify(data);

// Truyền cho LLM
const prompt = `Hãy trích xuất quản trị viên từ dữ liệu người dùng sau:\n${toonString}`;

// Chuyển TOON trả về từ LLM về lại ban đầu
const result = parse(llmResponse);
```

### Mô hình triển khai

**Phương pháp triển khai được khuyến nghị:**

1. **Chỉ chuyển đầu vào/đầu ra của LLM sang TOON**
   - Hệ thống hiện có vẫn dùng JSON
   - Chuyển đổi sang TOON ngay trước khi truyền cho LLM
   - Chuyển về JSON ngay sau khi nhận từ LLM
   - Có thể chuyển đổi khứ hồi không mất dữ liệu nên không ảnh hưởng đến hệ thống hiện có

2. **Mở rộng từng bước**
   - Trước tiên thử từ phần tiêu thụ token nhiều nhất
   - Đo lường hiệu quả rồi mới mở rộng phạm vi

3. **Nhất định phải thực hiện kiểm thử A/B**
   - So sánh độ chính xác và chi phí giữa JSON và TOON
   - Đo lường thực tế với dữ liệu của công ty mình


## Phù hợp và không phù hợp cùng điểm cần lưu ý

### Trường hợp phù hợp với TOON

Tiêu chí đánh giá rất đơn giản. Nếu đang truyền lượng lớn dữ liệu dạng bảng cho LLM và chi phí API LLM hàng tháng lên đến hàng chục nghìn yên trở lên, thì đáng để thử. Khi truyền hàng chục đến hàng trăm kết quả tìm kiếm của hệ thống RAG cho LLM, khi để LLM phân tích trực tiếp kết quả truy vấn cơ sở dữ liệu, khi xử lý log hoặc dữ liệu chuỗi thời gian. Với cấu trúc "các trường giống nhau lặp lại" như vậy, hiệu quả của TOON đạt tối đa.

Nếu đang gặp khó khăn với giới hạn cửa sổ ngữ cảnh, đây càng là ứng viên mạnh mẽ. Với cùng kích thước cửa sổ, có thể nhét nhiều thông tin hơn.

### Trường hợp không phù hợp với TOON và điểm cần lưu ý

Mặt khác, TOON không phải vạn năng.

**1. Yếu với cấu trúc lồng nhau phức tạp**

TOON được tối ưu hóa cho dữ liệu dạng bảng. Không phù hợp với dữ liệu lồng nhau sâu hoặc dữ liệu có cấu trúc không đồng đều. Ví dụ với cấu trúc lồng nhau sâu như sơ đồ tổ chức công ty: bộ phận→nhóm→thành viên, JSON hoặc YAML dễ xử lý hơn.

**2. LLM chưa quen với TOON**

LLM đã nhìn thấy lượng lớn JSON trong dữ liệu huấn luyện, nhưng hầu như chưa thấy TOON. Do đó, với tác vụ lấy dữ liệu đơn giản TOON có lợi thế, nhưng với tác vụ suy luận phức tạp JSON có thể có độ chính xác cao hơn. Các benchmark độc lập cũng báo cáo kết quả là với dữ liệu lồng nhau sâu, độ chính xác của TOON thấp hơn JSON hoặc YAML.

**3. Chưa được chuẩn hóa**

TOON là công nghệ tương đối mới, chưa phải tiêu chuẩn ngành. Hệ sinh thái đang phát triển, SDK cho các ngôn ngữ chính đã đầy đủ nhưng chưa trưởng thành như Protobuf hay JSON.

**4. Trường hợp cần thận trọng**

Cần thận trọng với các lĩnh vực ưu tiên độ chính xác cao nhất như y tế hay tài chính. Nếu lượng sử dụng API LLM ít, hoặc chi phí tích hợp vào hệ thống hiện có cao, có khả năng lợi ích không vượt quá chi phí.

### Cách tiến hành được khuyến nghị

Bắt đầu nhỏ. Trước tiên so sánh JSON và TOON bằng kiểm thử quy mô nhỏ. Đo lường thực tế tỷ lệ giảm token và độ chính xác, chỉ chuyển sang TOON ở phần có hiệu quả. Từ đó dần mở rộng phạm vi. Để API và cơ sở dữ liệu hiện có vẫn dùng JSON, chỉ chuyển sang TOON ở ranh giới với LLM là thực tế nhất.


## Tóm tắt

TOON không phải thay thế JSON. Đây là định dạng chuyên dụng để tối ưu hóa dữ liệu truyền cho LLM.

TOON giải quyết các vấn đề thực tiễn như số lượng token và chi phí API LLM, giới hạn cửa sổ ngữ cảnh, cải thiện thời gian phản hồi. Đặc biệt có hiệu quả lớn khi xử lý lượng lớn dữ liệu dạng bảng (kết quả tìm kiếm RAG, kết quả DB, log, v.v.).

Mặt khác, không phù hợp với cấu trúc lồng nhau sâu, tác vụ suy luận phức tạp, hoặc trường hợp ưu tiên độ chính xác cao nhất. Vì LLM đã quen với JSON nhưng chưa quen với TOON.

Kỷ nguyên JSON không kết thúc. TOON sẽ cùng tồn tại với JSON như một công cụ tối ưu hóa sử dụng ở ranh giới với LLM. Triển khai bắt đầu nhỏ, đo lường hiệu quả rồi mới mở rộng. Đây là cách sử dụng thông minh để giảm thiểu rủi ro và tối đa hóa lợi ích.


*Bài viết này được lấy từ [Qiita](https://qiita.com/shanks665/items/a5ec31706af9ffffc491).*
