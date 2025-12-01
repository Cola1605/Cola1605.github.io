---
title: "Tổng hợp các điểm chú ý khi thiết kế Component (React / Next.js)"
date: 2025-11-28
draft: false
tags: ["#Tech_News", "React", "Next.js", "Component Design", "Frontend", "Architecture"]
categories: ["Development", "Web and Frontend"]
author: "quniquni"
---

# Tổng hợp các điểm chú ý khi thiết kế Component (React / Next.js)

## Thông tin bài viết
- **Tác giả**: quniquni
- **Tổ chức**: 株式会社FUTUREWOODS
- **Ngày xuất bản**: 28/11/2025
- **Tags**: React, Next.js, Component Design, Frontend, Architecture
- **Nguồn**: [Qiita](https://qiita.com/quniquni/items/1e6bafbc6bfce74afe5d)

## Tổng quan

Bài viết hệ thống hoá các nguyên tắc thiết kế component thực tế cho thời đại React 19 / Next.js 15 (App Router). Phương pháp thiết kế dựa trên sự chuyển đổi trạng thái UI, cách phân loại quản lý state, tiêu chí chia component, cách xử lý side effects, tận dụng và hạn chế của Server Component/Actions. Giải thích chi tiết 7 nguyên tắc thiết kế để không lúng túng trong thực tế, bao gồm cả các trường hợp ngoại lệ và bổ sung.

## Các điểm chính

1. Thiết kế dựa trên **"sự thay đổi của UI"** sẽ dễ hơn rất nhiều - Tách biệt UI state và domain state
2. Thiết kế state với **"3 trục + URL state + Global state"** để không bị lạc hướng - Phân loại theo owner, loại, derived state
3. Chia component theo **"trách nhiệm + ranh giới re-render"** - Phiên bản tiến hoá của pattern Presentational/Container
4. Side effects chỉ **"đưa vào Hook khi cần thiết"** - Tránh lạm dụng useEffect
5. Fetch data trong Next.js: **"Server Component trước tiên"** - Nhưng không phải vạn năng
6. Update với **Server Actions rất mạnh** - Nhưng cần hiểu cả hạn chế
7. React 19 tăng cường `<form>` và **Actions (useActionState/useFormStatus)**
8. **Derived State (trạng thái dẫn xuất)** tránh "trùng lặp không mục đích" - Không nên biến thành state nếu tính toán được
9. **Ngôn ngữ hoá trục quyết định** thì không còn lúng túng - Tạo nền tảng chung trong team
10. Năm 2024-2025 là thời kỳ **phân chia vai trò Server/Client**, tối thiểu hoá state, các lựa chọn chiến lược mutate được sắp xếp

## Mở đầu

Khi đã quen với React / Next.js, điều tiếp theo thường lo lắng là phần "tầng thiết kế".

- Component dễ trở nên cồng kềnh
- `useEffect` tăng lên khiến logic bị lạc mất
- Mỗi lần đều phân vân nên đặt state ở đâu
- Không biết nên chia Hooks đến mức nào

Nếu ngôn ngữ hoá được những băn khoăn này trước, thì

- Khả năng đọc code
- "Sự lo lắng" khi thay đổi
- Stress trong phát triển team

sẽ thay đổi khá nhiều.

Bài viết này sẽ sắp xếp **"trục quyết định"** để không lúng túng trong thực tế, dựa trên tư tưởng thiết kế của **React 19 / Next.js 15 (App Router)** tại thời điểm 2024-2025, bao gồm cả ngoại lệ và bổ sung.

> ※ Next.js 15 được khuyến nghị kết hợp với React 19 theo chính thức, nhưng cách suy nghĩ được giới thiệu ở đây cũng có thể áp dụng cho project hiện tại dựa trên React 18.

## 1. Thiết kế ngược từ "sự thay đổi của UI" sẽ dễ hơn rất nhiều

Dễ muốn bắt đầu từ API hay DB schema, nhưng điều user thực sự chạm vào là **sự thay đổi của UI**.

- Input gì
- UI nào
- Thời điểm nào
- Thay đổi như thế nào

Chỉ cần liệt kê **chuyển đổi trạng thái UI** này trước, thì

- `state` cần thiết
- Cách chia component
- Cách cắt Hooks

sẽ quyết định một cách tự nhiên.

### Tuy nhiên, cũng có trường hợp không nên xuất phát từ UI

Ngoại lệ, trong trường hợp sau thì thiết kế **xuất phát từ domain logic** sẽ an toàn hơn:

- EC / UI nghiệp vụ mà tính toán tiền, tồn kho, point ưu tiên tính nhất quán
- Trường hợp business model hay cấu trúc table của hệ thống đã quyết định cứng nhắc
- Có ràng buộc mạnh "không thể phá vỡ tính nhất quán của giá trị này"

Phần này nếu **quyết định trước "ưu tiên UI" hay "ưu tiên Domain" cho mỗi project** thì giảm lệch nhận thức trong team.

### ❌ Ví dụ thường gặp (trộn lẫn UI state và domain state)

Thoạt nhìn đơn giản, nhưng

- `user` là "giá trị đang nhập"?
- Là "giá trị đúng về domain" đã validation?
- Có đang cho API response vào thẳng không?

mơ hồ, dần dần **"state nào để tin cậy?"** không rõ.

### ✅ Tách UI state và input state

Và **chỉ chuyển đổi sang domain type khi submit**.

- Input value giữ bằng **"type dễ xử lý cho UI" (string, etc.)**
- Ngay trước khi truyền cho server **chuyển đổi sang "type hợp lệ về domain"**

Nếu theo flow này, dù form phức tạp cũng khó bị phá vỡ.

### Điểm chú ý khi thiết kế form thời đại React 19

Trong React 19

- `<form>` và Actions (`useActionState` / `useFormStatus`, etc.)
- Native form submission và server action

được tăng cường khá nhiều.

Có nghĩa là, lựa chọn thiết kế đại khái 2 cái này:

- "Giữ toàn bộ bằng state như UI state"
- "Để DOM (form) xử lý, chỉ giữ kết quả action như state"

Khi form tăng lên, chỉ cần dừng lại suy nghĩ **"Cái này giữ bằng React state? / Để DOM xử lý?"** một lần, cũng dễ thoát khỏi form đầy `useState`.

## 2. Thiết kế state với "3 trục + URL state + Global state" để không lạc hướng

Các điểm dễ lạc hướng trong thiết kế state, chia thành **3 bước**:

1. Quyết định **"owner"** của state
2. **Phân loại** theo loại state
3. Không tăng quá nhiều **Derived State (trạng thái dẫn xuất)**

Thêm **URL state** và **Global state** vào đó, thì khá ổn định.

### (1) Quyết định "owner" của state

Trước tiên đơn giản, chỉ nghĩ 2 điểm này:

- Component **xử lý `state` đó tự nhiên nhất** là ở đâu?
- **"Cha chung nhỏ nhất"** của component dùng `state` đó là ở đâu?

Chỉ 2 điểm này cũng có thể ngăn khá nhiều **"phương án chạy trốn"** như:

- "Tạm thời đặt hết ở parent rồi props drill..."
- "Muốn chạm từ đâu cũng được nên để global..."

### (2) Phân loại theo loại state

Đại khái, trong thực tế nếu phân như này thì đầu óc dễ sắp xếp:

| Loại | Ví dụ |
|------|------|
| **UI state** | Modal, tab, loading, toast |
| **Server state** | API data, cache, revalidation |
| **Derived state** | Kết quả filter, tổng hợp, flag đang chọn, etc. |
| **Form state** | Input value, error, validation |
| **URL / Router state** | Điều kiện search, số page, điều kiện sort |
| **Global / Session** | User đăng nhập, quyền hạn, theme |

Với Next.js 15 (App Router), đặc biệt

- `fetch` + cache (`revalidate`)
- Server Components / Server Actions

rất mạnh, nên nếu hiểu **"Server state = không chỉ giá trị DB, mà là 'cửa sổ đọc' bao gồm cache"** thì dễ thiết kế.

### (3) Derived State tránh "trùng lặp không mục đích"

Nếu biến "kết quả filter đơn thuần của data gốc" thành state như này, thì

- Không biết cái nào đúng giữa `users` và `filteredUsers`
- Dễ sinh bug quên update

gây ra vấn đề.

**Nếu tính toán đơn thuần là đủ thì không nên làm state, an toàn hơn**.

Tuy nhiên, trường hợp sau thì làm state thẳng có thể tự nhiên hơn:

- Cost tính toán khá nặng (và muốn cache)
- Muốn đồng bộ mạnh với infinite scroll hay paging
- Về mặt đo metrics, muốn giữ "số item hiển thị hiện tại" như state

Về `useMemo` cũng vậy,

- Không phải "gắn để tăng tốc bằng mọi giá"
- Mà **"chỉ gắn ở nơi muốn đảm bảo tính ổn định reference (thay đổi `===`)"**

Nếu quyết định như này, sẽ không tăng không cần thiết.

## 3. Chia component theo "trách nhiệm + ranh giới re-render"

Cách suy nghĩ **Presentational / Container** từ xưa, bây giờ vẫn khá hiệu quả.

Tuy nhiên "nhất định phải chia View và Container" không phải như vậy. Trong thực tế, phán đoán theo **2 trục** sau sẽ ổn hơn:

### 1. Trách nhiệm

- Muốn tái sử dụng UI → Cắt ra thành component
- Muốn tái sử dụng logic → Cắt ra thành Hook
- Logic riêng page → Đóng trong page
- Business logic → Dồn vào tầng use-case / service, etc.

### 2. Ranh giới re-render

- "Nếu giữ state ở đây, toàn bộ component tree bên dưới re-render hết OK không?"
- "Chỗ này cố tình chia ra, có thể thu hẹp phạm vi re-render nhỉ?"

Nhìn theo **2 trục** này,

- Tăng component một cách mơ hồ
- Ngược lại 1 file 500 dòng **"component làm mọi thứ"**

dễ tránh cả 2 cực đoan.

## 4. Side effects chỉ "đưa vào Hook khi cần thiết"

Phần `useEffect`, dù React 19 vẫn là điểm dễ mắc kẹt.

Đại khái chia như này thì được khuyến nghị:

- **Side effect muốn tái sử dụng** → Cắt ra thành custom Hook
- **Side effect riêng page đó** → Không ép đưa ra ngoài, để trong page OK

Tuy nhiên, **"side effect muốn test kỹ"** sau thì đưa vào Hook sẽ dễ sau này:

- Gửi log, tracking
- Gọi API (polling, Timer, Observer, etc.)
- Subscribe event (`IntersectionObserver` / WebSocket / SSE, etc.)

### ❌ useEffect bị "nơi để mọi thứ"

Trong React 19, rendering model trở nên phong phú hơn, **"tạm làm trong useEffect"** nguy hiểm hơn trước.

Đặc biệt muốn tránh phần này:

- Nhốt tính toán đơn thuần vào `useEffect`
- Dùng `useEffect` để đồng bộ URL (query) sang state khác
- Dùng `useEffect` để chuyển local value của form sang state khác

Những cái này

- `render → effect → update state → render → ...`

dễ tạo vòng lặp, trở thành ổ bug và vấn đề performance.

**Tạo thói quen dừng lại suy nghĩ "Không phải side effect, viết bằng tính toán thuần được không?"**, thì lượt xuất hiện của `useEffect` giảm khá nhiều.

## 5. Fetch data trong Next.js: "Server Component trước tiên" (nhưng không vạn năng)

Trong thế giới quan App Router,

- Fetch data hiển thị ban đầu làm bằng Server Component
- Trên đó, chỉ những gì nhất định muốn giữ ở client mới đưa vào Client Component

flow này là cơ bản.

### Data hiển thị ban đầu thì Server Component mạnh

Merit của data fetching bằng Server Component đại khái:

- Auto cache (kết hợp chiến lược `revalidate`)
- Auto revalidation (Stale-While-Revalidate)
- Cải thiện TTFB (không cần `useEffect` fetch ở client)
- Dễ giảm "nhấp nháy" hiển thị ban đầu

### ⚠ Tuy nhiên, có nhiều trường hợp chỉ Server Component không đủ

Ví dụ trường hợp sau, fetch ở Client phía thẳng có khi tốt hơn:

- UI chia ra nhiều theo authentication / Cookie / quyền hạn
- External API, khó lấy chiến lược cache (payload chỉ một lần, etc.)
- Data riêng user tương tác mạnh trên màn hình (tính realtime cao)

**Không phải "dồn mọi thứ vào Server Component"**,

- **"Tối thiểu cần cho hiển thị ban đầu"** là Server Component
- Interaction nhỏ sau đó và polling để Client xử lý

Ý thức balance khoảng này, thiết kế cũng dễ đọc.

## 6. Update với Server Actions rất mạnh (nhưng cần hiểu cả hạn chế)

Next.js 15 thì Server Actions ổn định, style **"Viết từ form đến DB update thành 1 đường"** khá thực dụng.

### Ưu điểm của Server Actions

- `pending / error / success` dễ xử lý bằng `useActionState` / `useFormStatus`
- Dễ viết Optimistic UI
- mutate dùng cookie và session an toàn
- Tương thích tốt với native form, hoạt động dù JavaScript chưa load (Progressive Enhancement)

### Tuy nhiên, hạn chế cũng khá nhiều

- Action được bao trong server bundle nên nếu phình to quá sẽ ảnh hưởng build size
- Runtime cơ bản là Node.js (dùng ở Edge Runtime có nhiều hạn chế, chú ý)
- Gọi cơ bản được xử lý như image 1 Action = 1 Request
- Nếu muốn share API mạnh với mobile app thì chuẩn bị API riêng dựa BFF hay OpenAPI dễ thiết kế hơn

### Image phân loại đại khái

**Server Actions**
- Form submission trong Web app
- mutate an toàn kết hợp permission check
- Update gắn chặt với màn hình (liền với UI)

**Route Handlers (BFF-like API)**
- Share API với mobile app hay service khác
- Xử lý update muốn gọi từ client ngoài Web
- Cơ chế realtime cao như SSE / WebSocket

**Client fetch (fetch từ client / SWR / TanStack Query, etc.)**
- Muốn control chiến lược cache phía client chi tiết
- Trường hợp tần suất update cao, UI thay đổi interactive

## 7. Ngôn ngữ hoá trục quyết định thì không lúng túng

Tóm tắt nội dung đến đây thành **"Checklist nhớ lại khi lúng túng"**, đại khái như này:

- **Thiết kế từ sự thay đổi UI**
  - Liệt kê "làm gì, UI nào, thay đổi thế nào?" rồi mới quyết định state
- **Quyết định "owner" của state**
  - Ý thức component xử lý state đó tự nhiên nhất, và cha chung nhỏ nhất
- **Phân loại theo loại state (nghĩ cả URL / Global)**
  - UI / Server / Derived / Form / URL / Global
- **Derived State không trùng lặp dễ dãi**
  - Tính toán được thì không làm state
  - Nhưng cho phép "dư thừa có chủ ý" để đo hay performance
- **Component chia theo "trách nhiệm + ranh giới re-render"**
  - UI muốn tái sử dụng → component hoá
  - Logic muốn tái sử dụng → Hook hoá
  - Logic riêng page → đóng trong page
- **Side effect chỉ đưa vào Hook khi cần**
  - Đặc biệt side effect muốn test (log, polling, Observer) cắt ra Hook
- **Data ban đầu xem xét Server Component trước**
  - Chỗ vẫn thiếu mới fetch ở Client
- **mutate chọn phương tiện theo mục đích**
  - Chọn Server Actions / Route Handlers / Client fetch theo "ai gọi" "muốn share đến đâu"
- **Không hoàn thành chỉ bằng thiết kế trên bàn, tái đánh giá bằng "đo lường"**
  - Chỉ số performance như `LCP` / `TTFB` / `INP`
  - Error log, hành động log bằng `Sentry` hay tracking khác

## Kết

Năm 2024-2025, với sự xuất hiện của React 19 và Next.js 15

- Phân chia trách nhiệm UI và logic (phân vai Server / Client)
- "Hiển thị ban đầu chủ đạo server" gần như trở thành default
- state tối thiểu hoá, flow "thu hẹp Source of Truth thành 1"
- Lựa chọn chiến lược mutate (Server Actions / BFF / Client fetch) được sắp xếp

v.v., là thời kỳ tư tưởng thiết kế frontend update khá nhiều.

Mặt khác, **"thiết kế đúng" bản thân khác nhau mỗi project** cũng là sự thật.

Chính vì thế,

- Sắp xếp chuyển đổi state xuất phát từ UI
- Ngôn ngữ hoá owner và loại của state
- Share phân vai Server / Client trong team
- Nhìn kết quả đo lường thực tế và update thiết kế

**"Trục quyết định"** như thế **share trong team**, kết quả là ổn định cấu trúc component và chất lượng code.

Khi ai đó lo lắng về thiết kế,

> "Tạm thời cùng sắp xếp theo checklist này thử xem"

Có thể nói, **nền tảng chung** để tạo ra điều đó, hy vọng được tham khảo.

---

**👍 103 Likes | 💬 1 Comment**
