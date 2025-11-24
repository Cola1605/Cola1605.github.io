---
title: "TypeScript: Từ việc học văn phạm đến hiểu rõ hệ thống kiểu"
date: 2025-11-23T00:00:00+07:00
lastmod: 2025-11-24T00:00:00+07:00
draft: false
categories: ["Development", "Web and Frontend"]
tags: ["TypeScript", "Type System", "JavaScript", "Programming"]
description: "Tìm hiểu sâu về hệ thống kiểu của TypeScript - từ structural typing, assignability, type inference (widening/narrowing), distributive conditional types, variance đến satisfies operator. Giải thích tại sao Union type mở rộng, cách ngăn chặn và viết code type-safe hơn."
author: "あさひ"
translator: "日平"
---

# TypeScript: Từ việc học văn phạm đến hiểu rõ hệ thống kiểu

## Giới thiệu

Khi sử dụng TypeScript, ở mức độ nhất định, bạn có thể viết code chỉ bằng cách "học văn phạm". Thêm type annotation, sửa lỗi khi xuất hiện, dùng `as` để ép kiểu... và cuối cùng code chạy được.

Tuy nhiên, khi phát triển trong trạng thái đó, bạn sẽ gặp phải những bức tường như sau:

- Không giải thích được tại sao lỗi kiểu này lại xuất hiện
- Union type cứ lan rộng không kiểm soát được
- Type inference chạy theo hướng khác với ý định
- Type của API response bị vỡ mà không biết
- Không phân biệt đúng cách sử dụng `unknown` và `any`

Bản thân tôi cũng luôn cảm thấy mơ hồ về "cảm giác hộp đen của type". Có cảm giác "viết được nhưng không hiểu bản chất", hay đúng hơn là "bị type điều khiển".

Vì vậy lần này, tôi đã học lại **bên trong của hệ thống kiểu TypeScript** một cách có hệ thống. Sau khi học, tôi thực sự cảm nhận được rằng **"Khi có thể giải thích được tại sao lại thành type đó thì quá trình phát triển sẽ ổn định hơn rất nhiều"**.

Bài viết này sẽ phân tích "bên trong của type" của TypeScript với các chủ đề sau:

- TypeScript áp dụng "structural typing"
- Type checking hoạt động dựa trên "assignability (khả năng gán)"
- Hành vi "mở rộng / cố định" của type inference
- Lý do Union type bị mất kiểm soát và cách phòng tránh
- "Variance (tính biến đổi)" ảnh hưởng đến function type
- `satisfies` giải quyết vấn đề gì

## 1. TypeScript là "structural typing"

TypeScript không phán đoán dựa trên "tên" của type như Java hay C#, mà **phán đoán khả năng tương thích của type dựa trên "cấu trúc" chứ không phải "tên của định nghĩa type"**.

### 1-1. Nếu cùng cấu trúc thì dù tên khác vẫn được coi là "cùng type"

```typescript
type User = { id: number; name: string; };
type Customer = { id: number; name: string; };

const user: User = { id: 1, name: "Alice" };
const customer: Customer = user; // OK: cấu trúc hoàn toàn khớp
```

### 1-2. "Dù có property không cần thiết" vẫn có thể gán

```typescript
type A = { x: number };
type B = { x: number; y: string };

const b: B = { x: 1, y: "hi" };
const a: A = b; // OK: vì có đủ các phần tử A cần
```

### 1-3. Ngược lại thì không. Trường hợp "thiếu thứ cần thiết" là NG

```typescript
const a: A = { x: 1 };
const b: B = a; // Error: không có y mà B cần
```

Tiêu chí phán đoán của structural typing rất đơn giản: **"Có đầy đủ cấu trúc mà bên nhận cần hay không"**.

## 2. Type checking của TypeScript hoạt động bằng "assignability"

Khái niệm quan trọng nhất để hiểu hệ thống kiểu của TypeScript là **"assignability"**.

Type checking thoạt nhìn có vẻ như "type có khớp không?" "có hợp với type annotation không?", nhưng thực tế TS phán đoán đơn giản hơn nhiều.

**"Một giá trị (type) có thể gán cho một type khác hay không"**

Chỉ có vậy thôi. Và phán đoán này liên kết mật thiết với **structural typing** đã giải thích ở chương trước.

### 2-1. Quy tắc cơ bản của assignability

Nếu có đủ property cần thiết thì có thể gán. Thiếu thì error.

```typescript
type A = { x: number };
type B = { x: number; y: string };

const a: A = { x: 1 };
const b: B = { x: 1, y: "hi" };

let v1: A = b;  // OK (cấu trúc chứa A)
let v2: B = a;  // NG (không có y cần thiết)
```

### 2-2. "extends" thực ra chỉ là phán đoán "có gán được không?"

Điểm dễ hiểu lầm của người mới học TS, `T extends U` không phải "kế thừa".

Thực tế: **"Nếu T có thể gán cho U thì true, ngược lại false"** - hoạt động như một biểu thức điều kiện.

```typescript
type IsNumber<T> = T extends number ? "yes" : "no";

type A = IsNumber<number>;  // "yes"
type B = IsNumber<string>;  // "no"
```

## 3. Type inference có 2 loại hành vi "mở rộng / cố định"

Type inference của TypeScript trông rất thông minh, nhưng thực tế hành vi hoạt động theo **2 hướng đơn giản**:

- **Widening (mở rộng)**
- **Narrowing (cố định)**

### 3-1. Inference cơ bản là "mở rộng (widening)"

TypeScript khi suy luận từ literal value sẽ **"tự động" mở rộng thành type rộng hơn**.

```typescript
const a = "hello";  // a: string
```

Không phải literal type `"hello"`, mà **được suy luận thành `string` rộng hơn**.

Nếu muốn giữ nguyên literal type thì cần `as const` sẽ đề cập sau.

### 3-2. as const là "phương pháp mạnh nhất để cố định literal"

Muốn dừng "sự mở rộng" của inference, **dùng `as const` sẽ cố định và giữ nguyên literal type**.

```typescript
const a = "hello" as const;  // a: "hello"
```

Tương tự với object:

```typescript
const config = {
  mode: "dev",
  retry: 3,
} as const;
```

**Giữ nguyên literal type giúp viết code an toàn hơn về mặt type.**

### 3-3. "Narrowing (thu hẹp)" xảy ra trong điều kiện rẽ nhánh

TypeScript tự động thu hẹp type trong điều kiện rẽ nhánh.

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    id.toUpperCase();  // ở đây được suy luận là string
  } else {
    id.toFixed(2);     // ở đây được suy luận là number
  }
}
```

Đây được gọi là **control flow type analysis** - điểm mạnh của TS.

### 3-4. "Sự mở rộng" của inference gây ra "Union type phình to ngoài ý muốn"

Thực tế muốn **chỉ cho phép một số chuỗi cụ thể** như `"approved" | "pending" | "rejected"`.

Nhưng nếu viết như sau:

```typescript
let status = "approved";
status = "pending";
status = "rejected";
```

Thoạt nhìn có vẻ sẽ thành Union type nhưng... được suy luận thành `status: string`.

Lý do đơn giản: inference của TypeScript **không giữ nguyên literal mà mở rộng thành "type rộng" (widening)**.

**Làm thế nào để ngăn chặn?**

1. Dùng `as const`
2. Viết type annotation từ đầu (thực tế nhất)
3. Tạo Union bằng array + as const
4. Dùng `satisfies` để chỉ kiểm tra cấu trúc mà không phá vỡ inference

## 4. Lý do Union type "mất kiểm soát" là "distributive conditional type"

Khi dùng TypeScript, có hiện tượng "Union type tự nhiên phình to và hỗn loạn". Thực ra đây là do **đặc tả conditional type của TypeScript**.

### 4-3. Đây chính là "distributive conditional type"

Theo đặc tả của TypeScript: **Khi T là Union type, `T extends U ? ... : ...` sẽ được phân phối cho từng phần tử của T.**

```typescript
Check<string | number>
→ Check<string> | Check<number>
→ ("yes") | ("no")
```

### 4-5. Cách dừng "sự mất kiểm soát của Union"

**【Phương pháp 1】Bọc bằng tuple để dừng phân phối**

```typescript
type Check<T> = [T] extends [string] ? "yes" : "no";
type R = Check<string | number>;  // "no"
```

## 5. "Variance (tính biến đổi)" ảnh hưởng sâu đến function type

Ví dụ điển hình của "Tại sao cái này error?" "Tại sao cái này OK?" trong hành vi type của TypeScript là phần liên quan đến **gán function**.

### 5-3. Tuy nhiên "tham số của function" lại "ngược chiều" (contravariant)

```typescript
type FnA = (v: string | number) => void;
type FnB = (v: string) => void;

let a: FnA;
let b: FnB;

a = b;  // OK
b = a;  // Error
```

Tuy nhìn tương tự nhưng lại khác, lý do là **"tham số là contravariant"**.

- **FnA là function "có thể nhận string hoặc number"**
- **FnB là function "chỉ nhận string"**

Gán `b` cho `a` (`a = b`) có nghĩa là: **"Truyền function chỉ nhận string" cho "function phải nhận được string | number"**

Điều này an toàn. Nhưng ngược lại? **"Truyền function có thể nhận string | number" cho "function chỉ nhận string"**

Điều này có nguy cơ gây lỗi nên TS báo error.

## 6. Lý do `satisfies` mạnh hơn "type annotation" áp đảo

Từ TypeScript 5.x trở đi, điều được đánh giá cao là **sự xuất hiện của toán tử `satisfies`**.

### 6-1. Khác gì với type annotation (: Type)?

**Type annotation làm mất inference**

```typescript
const config: { mode: "dev" | "prod"; retry: number; } = {
  mode: "dev",
  retry: 3,
};
```

Khi viết type annotation, **type inference của toàn bộ object bị huỷ**.

### 6-2. satisfies "chỉ kiểm tra cấu trúc mà không phá vỡ inference"

```typescript
const config = {
  mode: "dev",
  retry: 3,
} satisfies { mode: "dev" | "prod"; retry: number; };
```

Cách viết này:

- **Cấu trúc được kiểm tra xem có khớp với định nghĩa type không (an toàn)**
- **Nhưng inference của object vẫn được duy trì (tiện lợi)**

Đạt được "cả hai".

Tức là `satisfies`: **"Cái này thỏa mãn type này đúng không?... OK. Nhưng inference cứ tự do."**

### 6-3. Ví dụ thực tế: Ngăn chặn vấn đề "type mở rộng và vỡ" hay gặp

```typescript
const status = "approved" satisfies "approved" | "pending" | "rejected";
```

- → Inference vẫn giữ nguyên `"approved"`
- → Nhưng type được kiểm tra tính nhất quán với Union
- → Nếu thêm `"wtf"` sẽ ngay lập tức error

**Trạng thái chỉ đảm bảo an toàn mà không phá vỡ inference.**

## Kết luận

Cho đến đây, tôi đã tổng hợp tập trung vào "bên trong của type" của TypeScript. Không phải là bài viết về văn phạm hay tips, mà đào sâu vào chính hệ thống kiểu, tôi nghĩ đã có được hiểu biết liên kết trực tiếp với thực tế.

Nếu có ai cảm thấy "TypeScript khó" "type bí ẩn", hãy thử chạm vào dù chỉ một nội dung nào đó trong bài này.

Khi có thể giải thích được "Tại sao lại thành type này?", TS sẽ trở nên dễ dùng hơn rất nhiều.

---

> **Lưu ý về hình ảnh**: Bài viết gốc trên Zenn có nhiều ví dụ code minh họa chi tiết. Để xem đầy đủ các ví dụ và giải thích, vui lòng truy cập [bài viết gốc](https://zenn.dev/ashunar0/articles/9eb5b012777d93).

**Tác giả**: あさひ (Asahi)
**Dịch giả**: 日平
