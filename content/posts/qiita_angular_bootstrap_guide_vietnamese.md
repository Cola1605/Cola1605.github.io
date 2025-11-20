---
title: "Tích hợp Bootstrap vào Angular để tạo trang web với thiết kế chuyên nghiệp một cách dễ dàng"
date: 2025-10-30
categories: ["Web and Frontend", "Development"]
tags: ["Angular", "Bootstrap", "CSS", "HTML", "Web-Design", "Tutorial"]
description: "Hướng dẫn tích hợp Bootstrap vào Angular project. Setup, responsive design, components và best practices cho người mới bắt đầu."
---

# Tích hợp Bootstrap vào Angular để tạo trang web với thiết kế chuyên nghiệp một cách dễ dàng

**Tác giả:** Tsurukawauchi_Jin  
**Tổ chức:** Công ty TNHH Cleaveware (株式会社クリーブウェア)  
**Ngày xuất bản:** 30 tháng 10, 2025  
**Ngày cập nhật:** 30 tháng 10, 2025  
**Thẻ:** HTML, CSS, Bootstrap, Angular, Dành cho người mới bắt đầu  
**Nguồn:** [Qiita](https://qiita.com/Tsurukawauchi_Jin/items/d96b3e9e0bf0a332112b)

---

## Bootstrap là gì?

Bootstrap là framework mã nguồn mở được phát triển bởi các kỹ sư của công ty Twitter cũ, bao gồm HTML, CSS và JavaScript, giúp phát triển website một cách hiệu quả.

Các tính năng chính bao gồm 3 điểm sau:

1. **Bố cục thiết kế responsive**
2. **Các lớp tiện ích cho phép điều chỉnh style chi tiết**
3. **Các thành phần UI phong phú như nút, form**

Bài viết này sẽ giới thiệu về 3 tính năng này thông qua các ví dụ đơn giản.

---

## Điều kiện tiên quyết

- npm đã được cài đặt
- Angular CLI đã được cài đặt

---

## Hướng dẫn tích hợp

### 1. Tạo dự án Angular

Đầu tiên, tạo dự án Angular và di chuyển vào thư mục dự án.

```bash
ng new my-bootstrap-app
cd my-bootstrap-app
```

### 2. Cài đặt Bootstrap

Tiếp theo, cài đặt Bootstrap.

```bash
npm install bootstrap
```

### 3. Cấu hình để tải Bootstrap

Có **2 phương pháp**.

#### Phương pháp 1: Ghi vào angular.json

Thêm nội dung sau vào `"styles"` và `"scripts"` trong tệp `angular.json`:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

#### Phương pháp 2: Tải trực tiếp vào tệp SCSS (có thể thực hiện khi chọn SCSS cho style)

Thêm nội dung sau vào `src/styles.scss`:

```scss
@import "bootstrap/scss/bootstrap";
```

### 4. Xác nhận Bootstrap hoạt động

Thêm nội dung sau vào bất kỳ tệp html nào.

```html
<div class="text-white bg-success">Bootstrap</div>
```

Tiếp theo khởi động ứng dụng:

```bash
ng serve
```

Mở `http://localhost:4200` trong trình duyệt, nếu thấy chữ "Bootstrap" màu trắng trên nền xanh lá là OK.

---

## Bố cục (Layout)

### Cấu trúc cơ bản

Bootstrap sử dụng `container`, `row`, `col` làm cấu trúc cơ bản. Ý nghĩa của từng thành phần như sau:

| Lớp | Vai trò |
|-----|---------|
| `container` | "Khung" của toàn bộ trang |
| `row` | Hàng ngang (Row) |
| `col` | Cột dọc (Column) |

#### Ví dụ:

```html
<div class="container">
  <div class="row">
    <div class="col bg-primary text-white">Cột trái</div>
    <div class="col bg-success text-white">Cột phải</div>
  </div>
</div>
```

Khi viết nội dung như trên, bố cục 2 cột với khoảng cách hai bên sẽ được hiển thị.

Nhân tiện, có khoảng cách hai bên là do `class="container"` có thiết lập căn giữa + khoảng cách hai bên. Nếu sử dụng `container-fluid`, khoảng cách hai bên sẽ biến mất và trở thành toàn bộ chiều rộng.

### Hệ thống lưới (Grid System)

Hệ thống lưới là cơ chế **chia màn hình thành các cột nhất định để tạo bố cục**.

Bố cục của Bootstrap được cấu tạo từ 12 phần bằng nhau. Nghĩa là, 1 hàng có tối đa "12 cột".

| Lớp | Tỷ lệ chiều rộng | Mô tả |
|-----|------------------|-------|
| `col-12` | 100% | Toàn bộ chiều rộng |
| `col-6` | 50% | Một nửa |
| `col-4` | 1/3 | Chia thành 3 cột |
| `col-3` | 1/4 | Chia thành 4 cột |

#### Ví dụ:

```html
<div class="container mt-3">
  <div class="row">
    <div class="col-4 bg-primary text-white">Trái</div>
    <div class="col-4 bg-secondary text-white">Giữa</div>
    <div class="col-4 bg-success text-white">Phải</div>
  </div>
</div>
```

Bố cục được chia đều thành 3 cột sẽ được hiển thị như bên dưới.

### Hỗ trợ Responsive

Với Bootstrap, bạn có thể **tự động thay đổi bố cục theo kích thước màn hình**.

| Kích thước | Ví dụ lớp | Ví dụ |
|------------|-----------|-------|
| `col-` | Luôn áp dụng | Tất cả kích thước màn hình |
| `col-sm-` | 576px trở lên | Màn hình nhỏ (điện thoại ngang) |
| `col-md-` | 768px trở lên | Máy tính bảng |
| `col-lg-` | 992px trở lên | Laptop |
| `col-xl-` | 1200px trở lên | Máy tính để bàn |

Nếu viết theo ví dụ trong bảng trên:

```html
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">A</div>
  <div class="col-12 col-md-6 col-lg-4">B</div>
  <div class="col-12 col-md-6 col-lg-4">C</div>
</div>
```

Trên điện thoại (`col-12`) sẽ xếp dọc thành 1 cột, trên máy tính bảng (`col-md-6`) sẽ hiển thị 2 cột, trên laptop sẽ hiển thị 3 cột.

---

## Các lớp tiện ích (Utility Classes)

Bootstrap có sẵn các lớp tiện ích - **các lớp tiện lợi để áp dụng CSS một cách dễ dàng** với số lượng lớn.

### margin/padding

margin biểu thị **khoảng cách bên ngoài**, padding biểu thị **khoảng cách bên trong**.

Chỉ định bằng tiền tố biểu thị margin hoặc padding (`m/p`), hậu tố biểu thị trên dưới trái phải và số (0〜5) biểu thị kích thước khoảng cách.

Ví dụ: `mt-3` (khoảng cách phía trên 16px)

#### Chỉ định hướng

| Hậu tố | Ý nghĩa | Chỉ định hướng | Phạm vi đối tượng |
|--------|---------|----------------|-------------------|
| `t` | top | `mt-*` / `pt-*` | Chỉ phía trên |
| `b` | bottom | `mb-*` / `pb-*` | Chỉ phía dưới |
| `l` | left (※Đến Bootstrap 4) | `ml-*` / `pl-*` | Chỉ bên trái |
| `r` | right (※Đến Bootstrap 4) | `mr-*` / `pr-*` | Chỉ bên phải |
| `x` | left & right | `mx-*` / `px-*` | Cả trái và phải |
| `y` | top & bottom | `my-*` / `py-*` | Cả trên và dưới |

#### Chỉ định kích thước

| Số | Kích thước khoảng cách |
|----|------------------------|
| `0` | `0` |
| `1` | `0.25rem` (khoảng 4px) |
| `2` | `0.5rem` (khoảng 8px) |
| `3` | `1rem` (khoảng 16px) |
| `4` | `1.5rem` (khoảng 24px) |
| `5` | `3rem` (khoảng 48px) |
| `auto` | Tự động (chỉ margin) |

#### Ví dụ:

```html
<div class="mt-3 mb-2 p-2">Điều chỉnh khoảng cách</div>
```

Có thể thấy khoảng trống được tạo ra ở trên và dưới văn bản.

### Màu sắc/Nền

`text-primary` và `text-success` (màu chữ), `bg-light` (màu nền), v.v., màu chữ và màu nền được định nghĩa tùy theo mục đích sử dụng.

#### Ví dụ:

```html
<div class="text-white bg-dark">Màu chữ (trắng) Màu nền (đen)</div>
```

---

## Thành phần UI (UI Components)

**Thành phần UI** là các bộ phận tập hợp các yếu tố mà người dùng tương tác như nút, form, modal.

### Sự khác biệt với lớp tiện ích

- **Lớp tiện ích:** Vai trò "tinh chỉnh" thiết kế
- **Thành phần UI:** Vai trò tạo các yếu tố hoàn chỉnh như nút, form, modal

Thành phần UI có thể tạo các bộ phận như nút hoặc modal **chỉ bằng cách viết "tên lớp đã định sẵn"** như `btn` (nút) hoặc `modal` (modal) vào thuộc tính class.

#### Ví dụ:

```html
<button class="btn btn-primary">Gửi</button>
<button class="btn btn-success">OK</button>
<button class="btn btn-outline-danger">Xóa</button>
```

Các nút có giao diện đẹp mắt có thể được tạo một cách dễ dàng.

---

## Tóm tắt

- **Bootstrap là gì:** Framework CSS giúp sắp xếp thiết kế trang web một cách dễ dàng
- **Hệ thống lưới:** Có thể cấu tạo bố cục linh hoạt bằng cách sử dụng container, row, col
- **Lớp tiện ích:** Các lớp tiện lợi như m-3, p-2 giúp điều chỉnh khoảng cách, màu chữ, màu nền một cách dễ dàng
- **Thành phần UI:** Các bộ phận có giao diện sẵn như nút, thanh điều hướng, modal có thể sử dụng ngay lập tức

---

## Kết thúc

Ngoài những gì được giới thiệu trong bài viết này, Bootstrap còn cung cấp nhiều lớp và chức năng khác nhau để thiết kế trang web.

Có thể có ấn tượng khó vì có nhiều tên lớp, nhưng thực tế khi thử nghiệm thì lại khá đơn giản.

Nếu nắm vững những kiến thức cơ bản lần này, bạn sẽ dễ hiểu hơn khi làm việc với các thành phần và điều chỉnh thiết kế khác.

---

**Tham khảo:**
- [Tài liệu chính thức của Bootstrap](https://getbootstrap.com/)
