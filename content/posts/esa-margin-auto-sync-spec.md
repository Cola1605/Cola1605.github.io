---
title: "Đặc Tả Đồng Bộ Tự Động Margin: Quản Lý 5 Loại Margin Trong ConsultingManager"
date: 2025-12-09
categories:
  - System Architecture
  - Database Design
tags:
  - Margin Management
  - Auto Sync
  - Database
source: esa.io (OPE Tech)
source_url: https://opetech.esa.io/posts/11528
---

## 1. Các Loại Margin và Quy Tắc Vận Hành

### 1-1. Default Margin (Margin Mặc định)

- **Tổng quan**  
  Margin được thỏa thuận thực tế với khách hàng. Nhân viên kinh doanh có thể thay đổi bất cứ lúc nào và được xem xét định kỳ. Có quy tắc vận hành (ngày áp dụng).

- **Đơn vị cấu hình**  
  Cấu hình bắt buộc theo đơn vị Media + Account.

- **Mục đích sử dụng**  
  Dựa trên net cost do media cung cấp, áp dụng default margin để tính toán gross cost.

---

### 1-2. Actual Margin (Margin Thực tế) hoặc Daily Margin

- **Tổng quan**  
  Margin có thể cấu hình tùy chọn theo đơn vị chiến dịch. Được ưu tiên áp dụng hơn default margin.

- **Đơn vị cấu hình**  
  Có thể cấu hình theo đơn vị Media + Account + Campaign.

- **Quy tắc cấu hình**  
  Cấu hình bằng cách chỉ định ngày áp dụng. Sau đó, actual margin đã cấu hình sẽ được ưu tiên áp dụng cho chiến dịch đó.

---

### 1-3. Discount Rate (Tỷ lệ Giảm giá)

- **Tổng quan**  
  Tỷ lệ giảm giá được sử dụng khi tính toán gross cost cho khách hàng. Cấu hình độc lập với default margin.

- **Đơn vị cấu hình**  
  Cấu hình theo đơn vị Media + Account HOẶC Media + Account + Campaign

- **Quy tắc cấu hình**  
  - Cấu hình giá trị "0" khi không có giảm giá, cấu hình giá trị tương ứng khi có giảm giá.
  - Quản lý "ngày áp dụng" vì có thể xảy ra xem xét lại theo từng lần.

---

### 1-4. Contract Margin (Margin Hợp đồng) ※Đã xử lý trong Cube(Opemane) trước DBUP

- **Tổng quan**  
  Margin được quy định khi ký hợp đồng với phía media. Chỉ cấu hình cho các media triển khai với gross cost (chi phí media cung cấp bao gồm thuế và phí). Cấu hình khi đăng ký account media mới.

- **Đơn vị cấu hình**  
  Cấu hình theo đơn vị Media + Account.

- **Quy tắc vận hành**  
  - Quản lý "ngày áp dụng" vì có thể xảy ra xem xét lại khoảng 3 tháng.
  - Contract margin có thể khác với margin thực tế đã thỏa thuận với khách hàng, do đó cần có sự điều chỉnh sử dụng contract margin này khi chuyển đổi về net cost.

---

### 1-5. Special Calculation Rate (Tỷ lệ Tính toán Đặc biệt) ※Đã xử lý trong Cube(Opemane) trước DBUP

- **Tổng quan**  
  Đối với một số media cụ thể, khi chuyển đổi về net cost, có trường hợp nhân hệ số vào công thức tính toán thông thường để điều chỉnh. Hệ số đó được cấu hình là "special calculation rate". Đây là cấu hình khi đăng ký account media mới.

- **Đơn vị cấu hình**  
  Cấu hình theo đơn vị Media + Account.

- **Giá trị cấu hình**  
  Cấu hình theo tỷ lệ phần trăm (ví dụ: 1.00). Media thông thường cấu hình là "1.00".

- **Quy tắc vận hành**  
  Quản lý "ngày áp dụng" vì có thể xảy ra xem xét lại khoảng 3 tháng ~ nửa năm.

---

## 2. Công Thức Tính Toán Chi Phí

### 2-1. Công Thức Chuyển Đổi sang Net Cost ※Đã xử lý trong Cube(Opemane) trước DBUP

（※Áp dụng cho các media upload dữ liệu dưới dạng gross cost từ khi đăng ký trong operation manager）

```
Net Cost = Chi phí Media × (1 − Contract Margin ÷ 100) × Special Calculation Rate
```

**Ghi chú:**
- ※Chi phí media là gross cost.
- ※Khi không cấu hình contract margin thì sử dụng chi phí media (mapkey: media_cost) trực tiếp làm net cost

---

### 2-2. Công Thức Tính Gross Cost

Gross cost có 2 phương pháp tính toán là "Phương pháp Net Margin" và "Phương pháp Fee", áp dụng một trong hai tùy theo giá trị cấu hình của discount rate.

Cấu hình này được thực hiện theo đơn vị Media + Account (+ Campaign) và được xem xét lại khoảng 3 tháng ~ nửa năm.

#### **Phương pháp Net Margin (Nội trừ)** (Hiển thị là "Margin" trên màn hình Conmane)

```
Gross Cost = Net Value ÷ (1 − Margin) × (1 − Discount Rate)
```

#### **Phương pháp Fee (Ngoại trừ)** (Hiển thị là "Fee" trên màn hình Conmane)

```
Gross Cost = Net Value × (1 + Margin) × (1 − Discount Rate)
```

---

## 3. Cấu Trúc Quản Lý Thông Tin Margin

### 3-0. Tiền đề (Đăng ký và Phản ánh Thông tin Margin)

- **Account mới:**  
  Cấu hình margin trong CoreManager.

- **Thay đổi account hiện có:**  
  Chỉnh sửa trong OperationManager sau đó tập trung và lưu trữ trong CoreManager.

- **Phía Consulting Manager:**
  - Để giữ độ trễ phản ánh trong vòng 30 phút, thực hiện đồng bộ dữ liệu chênh lệch từ API của CoreManager mỗi 5 phút.
  - Dữ liệu lấy được được lưu trong Conmane RDS và sử dụng cho các xử lý khác nhau.

- **Phía Opelake:**  
  Đồng bộ với CoreManager mỗi giờ nhưng phản ánh chậm nên lần này không sử dụng.

#### **Sơ đồ Data Flow**

Hình ảnh về data flow và độ trễ giữa OpelationManager / CoreManager / ConsultingManager:

- **Đăng ký media/account mới + cấu hình margin ban đầu** được thực hiện toàn bộ trong CoreManager
- **Thay đổi margin trong vận hành** được thực hiện trong OpelationManager
- **Liên kết OpelationManager → CoreManager** chưa implement nên thời gian trễ chưa rõ
- **CoreManager → ConsultingManager** đồng bộ dữ liệu chênh lệch của 10 phút trước mỗi 5 phút
- **Khi tính toán báo cáo và hiển thị màn hình** luôn sử dụng margin có nguồn gốc từ CoreManager

#### **Thời gian đồng bộ (Đã xác nhận)**

| Liên kết | Khoảng thời gian |
|---------|------------------|
| Cube ⇔ Mother | Khoảng thời gian không rõ nhưng phản ánh ngay lập tức |
| Mother ⇔ CoreManager | Mỗi 5 phút |
| Margin OpelationManager ⇔ CoreManager | Khoảng thời gian không rõ nhưng phản ánh ngay lập tức |
| CoreManager ⇔ ConsultingManager | Mỗi 5 phút |

---

### 3-1. Định Nghĩa Bảng

Trong Consulting Manager, thông tin margin có nguồn gốc từ CoreManager được lưu trữ trong bảng sau đây.

- **`media_account_default_margin`**: Default margin (dùng để tính toán cho khách hàng)

Dữ liệu đồng bộ từ CoreManager được giữ nguyên và sử dụng cho việc tham chiếu và tính toán ở phía ứng dụng.

---

### Bảng media_account_default_margin

**Mục đích:**  
Quản lý "default margin", "discount rate", "phương pháp tính toán" theo từng đơn vị Media × Account (+ tầng dưới như Campaign nếu cần) kèm theo thời gian áp dụng.

**Tên bảng:**
```
media_account_default_margin
```

**Primary Key:**
- `media_id`
- `media_account_id`
- `align_id`
- `apply_start_date`

#### **Định Nghĩa Cột**

| Tên Cột | Kiểu | Not Null | Mô tả |
|---------|------|----------|-------|
| `media_id` | VARCHAR(100) | ✓ | ID của media. Giữ giá trị giống với `media_id` trong CoreManager. |
| `media_account_id` | VARCHAR(100) | ✓ | ID của media account. ID duy nhất để nhận diện account của từng media. |
| `align_id` | VARCHAR(100) | ✓ | ID biểu thị đơn vị áp dụng margin. Khi là `"use account"` thì là đơn vị "Media + Account", khi là chuỗi khác thì được xử lý như ID tầng dưới như campaign ID. |
| `apply_start_date` | DATETIME | ✓ | Thời gian bắt đầu áp dụng cấu hình margin này. Bao gồm trong primary key để quản lý lịch sử. |
| `apply_end_date` | DATETIME | ✓ | Thời gian kết thúc áp dụng cấu hình margin này. Thông thường quản lý bằng ngày tương lai (ví dụ: 2999-12-31), được tự động cập nhật bởi CoreManager khi sửa đổi. |
| `default_margin_rate` | FLOAT | ✓ | Tỷ lệ default margin. 0.25 nghĩa là 25% (số thực từ 0~1). Giữ nguyên `default_margin_rate` từ CoreManager API. |
| `calculation_pattern` | INT | ✓ | Số pattern biểu thị phương pháp tính toán khi tính gross. 1=Net margin (hiển thị "Margin" trên màn hình Conmane), 2=Fee (hiển thị "Fee" trên màn hình Conmane) |
| `discount_rate` | FLOAT | ✓ | Tỷ lệ giảm giá. 0.10 nghĩa là 10% (số thực từ 0~1). Giữ nguyên `discount_rate` từ CoreManager API. |
| `is_deleted` | BOOLEAN | ✓ | Flag xóa logic. 0:Hợp lệ, 1:Đã xóa. Tương ứng với `is_deleted` phía CoreManager. |
| `coremane_created_at` | DATETIME | ✓ | Thời gian tạo record phía CoreManager. Tương ứng với `created_at` của API. |
| `coremane_updated_at` | DATETIME | ✓ | Thời gian cập nhật record phía CoreManager. Tương ứng với `updated_at` của API. |
| `created_at` | TIMESTAMP | ✓ | Thời gian lưu record này phía Consulting Manager. Tự động cấu hình bởi `CURRENT_TIMESTAMP` của DB. |
| `updated_at` | TIMESTAMP | ✓ | Thời gian cập nhật record này phía Consulting Manager. Tự động cập nhật bởi `CURRENT_TIMESTAMP ON UPDATE`. |

---

### 3-2. Quy Tắc Liên Kết

#### **Margin theo đơn vị "Media + Account"**

- Được áp dụng khi cột `align_id` chứa chuỗi `"use account"`.
- Trong trường hợp này, margin được cấu hình theo sự kết hợp của media và account.

#### **Margin theo đơn vị "Media + Account + Campaign"**

- Được áp dụng khi cột `align_id` chứa chuỗi hoặc số khác `"use account"`.
- Trong trường hợp này, margin được ghi đè theo đơn vị campaign cụ thể.

---

### 3-3. Thứ Tự Ưu Tiên

Tham chiếu margin được thực hiện theo thứ tự ưu tiên sau.

1. **Actual Margin (theo đơn vị campaign)**  
   Áp dụng khi `align_id` khác `"use account"`.

2. **Default Margin (theo đơn vị account)**  
   Áp dụng khi `align_id` là `"use account"`.

---

