---
title: "Khoảnh Khắc Bộ Não Kỹ Sư Sụp Đổ ─ Cơ Chế Phức Tạp, Tải Nhận Thức Và Độ Phức Tạp Tính Toán"
date: 2025-11-18
draft: false
categories: ["Software Engineering", "Architecture", "Cognitive Load"]
tags: ["Design", "Architecture", "Engineering", "Cognitive Load", "Complexity"]
description: "Khám phá lý do tại sao độ phức tạp phần mềm dẫn đến sụp đổ từ góc độ độ phức tạp tính toán và tải nhận thức. Hiểu cơ chế và cách kiểm soát độ phức tạp trong kiến trúc phần mềm."
---

**Tác giả**: @Sakai_path  
**Ngày đăng**: 2025-11-18  
**Nguồn**: https://qiita.com/Sakai_path/items/415dc71f3463c0c4471b

> Tại sao độ phức tạp lại dẫn đến sụp đổ?
> Đã suy ngẫm về giới hạn của phần mềm từ góc độ độ phức tạp tính toán và tải nhận thức.

Đây là chủ đề liên quan đến "**quá khớp**" trong thời đại thông tin dư thừa.

Hiểu được cấu trúc này - nơi não bộ của chúng ta bão hòa và điểm mà sự hiểu biết không còn theo kịp - có thể trở thành nền tảng không chỉ cho kỹ thuật mà còn cho tái đào tạo kỹ năng.

## Giới thiệu

Trong phát triển phần mềm, có một niềm tin phổ biến rằng **"độ phức tạp tạo ra vấn đề"**.

- Tại sao khi phức tạp lại dẫn đến sụp đổ
- Từ đâu có thể gọi là phức tạp
- Tại thời điểm nào sự hiểu biết của con người không còn theo kịp
- Tại sao nợ kỹ thuật đột nhiên phình to đến mức "không thể xử lý"

Đã thử giải thích độ phức tạp của phần mềm qua ba góc nhìn:

![0001.png](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F2253716%2F7df1388c-03f3-4b4b-9e68-3fd7e57a5071.png)

Điểm quan trọng là xử lý **"bản chất của chính độ phức tạp"** chứ không phải **"mã nguồn phức tạp"**.

## 1. Độ Phức Tạp Là Hiện Tượng Con Người Không Thể Chịu Đựng "Bùng Nổ Độ Phức Tạp Tính Toán"

Độ phức tạp của phần mềm thường được nói đến như **bùng nổ độ phức tạp tính toán**.

- `O(N)` → Vẫn theo dõi được
- `O(N²)` → Không rõ điều gì đang xảy ra
- `O(2^N)` → Hoàn toàn không thể hiểu

Tuy nhiên, điều tương tự xảy ra với não bộ con người.

Bộ nhớ làm việc của con người chỉ có thể giữ 7±2 mục[1]. Đây là nghiên cứu tâm lý học cổ điển, nhưng đối với kỹ sư, nó có nghĩa là "**giới hạn độ phức tạp tính toán nhận thức**".
※Các nghiên cứu sau đó cho thấy dung lượng hiệu quả là khoảng 4±1 mục (Cowan 2001, v.v.)

Nói cách khác, khi thiết kế mã nguồn

**Vượt quá `O(hiểu)`, con người sẽ sụp đổ.**

> Bộ nhớ làm việc của con người "**chỉ có thể xử lý đồng thời khoảng 5-9 khối**"[2], và thiết kế phức tạp nhanh chóng chạm đến giới hạn này.

## 2. "Độ Phức Tạp Tính Toán Thiết Kế" Không Được Quyết Định Bởi Số Dòng Mã Mà Bởi "Số Lượng Mối Quan Hệ"

Độ phức tạp không được quyết định bởi lượng mã nguồn. Nó được quyết định bởi **số lượng mối quan hệ (phụ thuộc, ràng buộc, luồng)**.

Ví dụ

- A biết về B
- B tham chiếu đến C
- C cập nhật A một cách bất đồng bộ

Để hiểu điều này, con người phải theo dõi **chu trình A-B-C-A**.

Đối với não bộ, đây là tải trọng giống như **DFS (tìm kiếm theo chiều sâu)**.

Khi số lượng mối quan hệ tăng, độ phức tạp tính toán hiểu biết tăng theo cấp số nhân.

> **Mã nguồn tăng tuyến tính, nhưng chi phí hiểu biết tăng theo hàm mũ.**

Vì vậy, thiết kế đột ngột sụp đổ. Sự sụp đổ không diễn ra dần dần. Ngay khi vượt qua ngưỡng nhất định, nó sụp đổ ngay lập tức. Giống như phản ứng hóa học vượt quá "điểm tới hạn".

> Khi số lượng phụ thuộc tăng, "chi phí quản lý phụ thuộc" bùng nổ trước tốc độ phát triển[3].

## 3. Tải Nhận Thức Là Nợ Kỹ Thuật "Vô Hình"

Độ phức tạp sụp đổ không phải vì vấn đề kỹ thuật, mà vì **vượt quá giới hạn lượng thông tin con người có thể xử lý**.

Thiết kế có tải nhận thức cao có các dấu hiệu sau:

- **Đọc một lần vẫn không hiểu**
- **Không rõ sự tương ứng giữa đặc tả và mã nguồn**
- **Không thấy "thay đổi ở đây sẽ ảnh hưởng đến đâu?"**
- **Đánh giá bị mòn**
- **Lỗi xảy ra không phải ở "điểm" mà ở "mặt"**

Tất cả đều là triệu chứng của "**quá tải độ phức tạp tính toán**" và "**vượt quá năng lực**".

Nợ kỹ thuật nên được hiểu là

> **"Hiện tượng tải nhận thức tích tụ như lãi suất"**

> Nợ kỹ thuật không chỉ đơn giản là "**sửa chữa hoãn lại**", mà chính là **tải nhận thức** tích tụ trong đầu nhà phát triển[4].

## 4. Bản Chất Của Kiến Trúc Là "Kiểm Soát Độ Phức Tạp Tính Toán"

Thiết kế không phải là vẽ sơ đồ đẹp.

Bản chất chỉ có một.

**"Đưa độ phức tạp tính toán cần thiết để hiểu gần với `O(1)`"**

Kiến trúc tồn tại vì điều đó.

- **Phân chia theo tầng** → Giữ đối tượng nhận thức ổn định
- **Giới hạn trách nhiệm** → Rút ngắn đường đi tính toán
- **Tạo ranh giới** → Cắt đứt mối quan hệ
- **Thiết kế API** → Trừu tượng hóa nhận thức

Thiết kế đẹp cũng có lý do. Không phải vì nó đẹp, mà vì

**Để giảm thiểu tải trọng lên não bộ**.

> "Các chỉ số độ phức tạp nhận thức đánh giá mã nguồn dựa trên khả năng đọc và tự giải thích của nó." (https://axify.io/blog/code-complexity-explained)

## 5. "Đường Giới Hạn Sụp Đổ Độ Phức Tạp" Phụ Thuộc Vào "Nhóm" Chứ Không Phải Cá Nhân

Tải nhận thức khác nhau giữa các người.

- Người mới bắt đầu ngay lập tức `O(bùng nổ)`
- Người có kinh nghiệm `O(chịu được một chút)`
- Nhà thiết kế `O(có thể trừu tượng hóa nhiễu)`

Nói cách khác, đường giới hạn sụp đổ độ phức tạp là **đặc thù của nhóm**, không thể nói về "đúng sai" phổ quát.

> Kỹ thuật có thể di chuyển, nhưng giới hạn nhận thức không thể di chuyển.

Đây là lý do tại sao thiết kế hoạt động tốt trong một dự án lại sụp đổ hoàn toàn trong nhóm khác.

## 6. Cách Ngăn Chặn "Bùng Nổ Độ Phức Tạp" Trong Thực Tế

Tổng hợp các nguyên tắc kiểm soát độ phức tạp hiệu quả trong thực tế.

### ① Giảm Mối Quan Hệ (Cắt Đứt Phụ Thuộc)

- Sắp xếp phụ thuộc phân tán do hướng sự kiện
- Cấm tham chiếu hai chiều
- Thiết kế "thế giới mà A không biết về B"

> **Ví dụ ngắn**: Chỉ UI → UseCase → Repository, không để UI gọi trực tiếp Repository.

### ② Đưa Cách Đọc Gần Với `O(1)`

- Mã nguồn cần phải hiểu được "ngay từ lần đầu tiên"
- Thiết kế không hiểu được ngay lần đầu là quá phức tạp

> **Ví dụ ngắn**: Làm sao để "hàm này làm gì?" hoàn thành trong một màn hình.

### ③ Giải Thích Bằng "Cấu Trúc" Thay Vì Tài Liệu

- Thiết kế cần bổ sung bằng tài liệu không còn là `O(1)`

> **Ví dụ ngắn**: Làm cho thư mục và trách nhiệm khớp nhau sao cho không cần giải thích "đây là tầng XX".

### ④ Quan Sát "Tải Nhận Thức" Trong Đánh Giá

- Mòn trong đánh giá là mệt mỏi của cấu trúc

> **Ví dụ ngắn**: Nếu bình luận "khó hiểu chỗ này" liên tục xuất hiện trong PR, hãy nghi ngờ mệt mỏi cấu trúc thiết kế.

### ⑤ Nắm Bắt Giới Hạn Nhận Thức Của Nhóm

- Không phải giới hạn của người có kinh nghiệm
- Nên thiết kế ở mức tối thiểu của nhóm

> **Ví dụ ngắn**: Lấy "cấu trúc mà người mới cũng theo dõi được" làm tiêu chuẩn, loại bỏ kiến thức ngầm phụ thuộc người có kinh nghiệm.

## Kết Luận

Vấn đề độ phức tạp có thể giải thích bằng lý thuyết, nhưng hiếm khi được nói đến trong thực tế. Tuy nhiên, phần mềm sụp đổ luôn là khi **"con người không còn hiểu được"**.

> **Giới hạn của phần mềm được quyết định không phải bởi tài nguyên tính toán, mà bởi tài nguyên nhận thức của con người.**

Khi quan điểm này trở nên phổ biến, cách nhìn về thiết kế, đánh giá và kiến trúc sẽ thay đổi.

Điều quan trọng không phải là tránh độ phức tạp, mà là **tìm kiếm hình thức "có thể cùng tồn tại" với độ phức tạp**.

## Tài Liệu Tham Khảo

[1] Con người có thể xử lý hiệu quả không quá bảy đơn vị, hoặc khối, thông tin, cộng trừ hai. George A. Miller, *The Magical Number Seven, Plus or Minus Two* (từ giải thích Britannica)  
https://www.britannica.com/topic/The-Magical-Number-Seven-Plus-or-Minus-Two-Some-Limits-on-Our-Capacity-for-Processing-Information

[2] Bộ nhớ làm việc thường có thể xử lý 5-9 mảnh, hoặc khối, thông tin tại bất kỳ thời điểm nào. *Cognitive Load Theory* hướng dẫn nhanh, Medical College of Wisconsin  
https://www.mcw.edu/-/media/MCW/Education/Academic-Affairs/OEI/Faculty-Quick-Guides/Cognitive-Load-Theory.pdf

[3] Khi chúng ta mở rộng và tăng giao hàng song song, sự tăng trưởng theo cấp số nhân của phụ thuộc có thể trở nên áp đảo. *Slow Product Development? Dependencies are the Cause*  
https://blog.zeroblockers.com/p/slow-product-development-dependencies-are-the-cause

[4] Mã phức tạp, mẫu chống ngôn ngữ, mùi mã nguồn, và những thứ khác chúng ta gộp chung dưới "nợ kỹ thuật" đều làm tăng tải nhận thức. *Cognitive load – Unconscious Agile*  
https://unconsciousagile.com/2024/01/28/cognitive-load.html
