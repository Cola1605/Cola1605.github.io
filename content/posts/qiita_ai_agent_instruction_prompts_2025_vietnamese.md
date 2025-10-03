---
title: "Prompt Giáo Dục Nâng Cao Trình Độ 'Hướng Dẫn' Cho AI Agent (Cursor/Claude Code và các công cụ khác)"
date: 2025-10-03T09:00:00+07:00
categories: ["AI", "Development Tools", "Productivity"]
tags: ["AI Agent", "Prompt Engineering", "Cursor", "Claude Code", "AI Programming", "Development"]
description: "Framework đánh giá và cải thiện prompt cho AI Agent, từ hướng dẫn mơ hồ đến chỉ dẫn chính xác giúp tăng hiệu quả lập trình"
---

# Prompt Giáo Dục Nâng Cao Trình Độ "Hướng Dẫn" Cho AI Agent (Cursor/Claude Code và các công cụ khác)

**Tác giả**: @WdknWdkn (Kentaro Wada)  
**Ngày xuất bản**: 16 tháng 9, 2025  
**Ngày cập nhật**: 16 tháng 9, 2025  
**URL**: https://qiita.com/WdknWdkn/items/762e9020c9f4e84e3c51  
**Tương tác**: 👍 126 | 📚 116 | 💬 0  
**Tags**: Quản lý, Prompt, Cursor, AI Sinh tạo, ClaudeCode

---

## Giới Thiệu

### Tại Sao Chúng Ta Cần Framework Đánh Giá Prompt?

Ngày nay, việc lập trình cặp (pair programming) với AI agent đã trở thành điều bình thường, và chất lượng kết quả phụ thuộc rất lớn vào "cách chúng ta đưa ra hướng dẫn". Tuy nhiên, thực tế cho thấy hầu hết các team (trừ một số ngoại lệ) đều viết prompt một cách "mơ hồ".

Bản thân tôi, trong giai đoạn đầu sử dụng Cursor, cũng đưa ra những hướng dẫn mơ hồ như "sửa bug" hay "thêm chức năng đăng nhập". Kết quả đúng như dự đoán - AI thực hiện những sửa đổi sai hướng và thậm chí còn tốn thời gian hơn. Câu "Không biết sử dụng AI như thế nào" chắc chắn sẽ được nêu ra.

Ngược lại, những engineer và manager có kinh nghiệm lại có thể điều khiển AI theo ý muốn và đạt được kết quả tốt hơn bao giờ hết.
Để giải quyết sự khác biệt này, tôi thường xuyên cùng các engineer mới xem lại lịch sử tương tác với Cursor và đưa ra feedback.

Trong quá trình đó, tôi đột nhiên nhận ra rằng việc review này cũng có thể được hệ thống hóa.
Nếu tạo ra một framework để đánh giá chất lượng hướng dẫn một cách khách quan và làm rõ các điểm cần cải thiện, liệu có thể nâng cao năng suất tổng thể hơn nữa không?

Thực tế, tôi cũng đã cảm nhận được hiệu quả như một điểm khởi đầu để thực hiện feedback, nên quyết định tổng hợp và công khai dưới dạng prompt.

Cách sử dụng được đề xuất là sau khi hoàn thành một loạt tương tác với Cursor, hãy thử ném prompt dưới đây vào cuối cùng. Nói cách khác, đây là "prompt được sử dụng cùng với lịch sử Cursor", vì vậy mong các bạn linh hoạt áp dụng theo timing phù hợp.

## Framework Đánh Giá Prompt Cursor

```
Bạn là chuyên gia reviewer trong lĩnh vực "Đánh giá hợp tác với AI Coding Agent". Dựa trên lịch sử chat dưới đây, hãy đánh giá chất lượng "hướng dẫn mà người dùng (con người) đưa ra cho Cursor AI Agent" và đưa ra đề xuất cải thiện. Đối tượng đánh giá là **hướng dẫn của người dùng**, không bị ảnh hưởng bởi chất lượng output của agent.

## Nguyên Tắc Đánh Giá
- Hướng mục tiêu (Định nghĩa Done rõ ràng)
- Làm rõ ràng buộc (Kỹ thuật/Kinh doanh)
- Chia sẻ ngữ cảnh (File, ví dụ input/output, log, v.v.)
- Tận dụng tính năng đặc trưng của Cursor (@file, YOLO, TDD, .cursorrules, đồng bộ Index)
- Tiến hành từng giai đoạn
- Quy trình debug (Tận dụng log)
- Biện pháp bảo vệ refactor
- Xác minh/Test
- Cân nhắc bảo mật/Quyền riêng tư
- Phân chia Planner/Executor
- Quản lý context (Ngăn chặn scope drift)

## Đặc Tả Output (Chỉ báo cáo Markdown)
Hãy báo cáo theo format và heading sau đây.

# Tổng Quan
- Ấn tượng tổng thể và điểm cải thiện quan trọng nhất (1-3 dòng)

## Mức Độ Trưởng Thành
- **L1~L5** (Lý do trong 1-2 câu)

## Bảng Điểm
| Chỉ số | Điểm | Căn cứ |
|---|---:|---|
| Hướng mục tiêu | x | |
| Tính cụ thể của ràng buộc | x | |
| Chia sẻ ngữ cảnh | x | |
| Tận dụng tính năng Cursor | x | |
| Tiến hành từng giai đoạn | x | |
| Lặp lại debug | x | |
| Bảo vệ refactor | x | |
| Xác minh/Test | x | |
| Bảo mật/Quyền riêng tư | x | |
| Phân chia Planner/Executor | x | |
| Quản lý scope | x | |

## Điểm Mạnh
- Liệt kê 3-5 điểm dưới dạng bullet point

## Điểm Cần Cải Thiện (Set Comment và Đề xuất cải thiện)
Hãy liệt kê nhiều mục theo format sau:
- **Comment của người dùng (trích xuất):** "#17: Tạo chức năng đăng nhập"
- **Vấn đề:** Định nghĩa Done và ràng buộc không rõ ràng
- **Đề xuất cải thiện:** "#17: Triển khai chức năng đăng nhập nhằm mục đích xác thực người dùng. Sử dụng OAuth2 với API route của Next.js. Điều kiện Done: Phát hành JWT khi đăng nhập thành công."

- **Comment của người dùng (trích xuất):** "#23: Sửa bug"
- **Vấn đề:** Phạm vi đích và điều kiện tái hiện không rõ
- **Đề xuất cải thiện:** "#23: Trong hàm loginHandler của @file(auth.ts), hãy phân tích log tái hiện lỗi 'invalid token' và đưa ra nguyên nhân cùng đề xuất sửa chữa."

(Lặp lại format này)

## Giải Pháp Tức Thì
- 3-5 prompt sửa đổi cụ thể

## Biện Pháp Tác Động Cao (Cải thiện liên tục)
- 3-5 điểm như đưa .cursorrules vào sử dụng, tận dụng TDD, quy tắc hóa đồng bộ Index

## Prompt Sẵn Sàng Sử Dụng Cho Lần Tiếp Theo

Mục đích:
- <TARGET_GOAL>
- Định nghĩa Done: <DONE_CRITERIA> (Xác minh: <TEST_CMD>)

Tiền đề và ràng buộc:
- <HARD_CONSTRAINTS>
- Chất lượng/hiệu năng: <QA_POLICY>, <PERF_BUDGET>
- Phạm vi ảnh hưởng: <AFFECTED_FILES> (<PROTECTED_REGION_COMMENT> cấm thay đổi)

Context:
- Đối tượng: @file(<PATH>) / @folder(<dir>) / @Symbols(<symbol>)
- Ví dụ input/output: <INPUT_EXAMPLE> → <OUTPUT_EXAMPLE>
- Môi trường thực thi: <RUNTIME_ENV>

Cách tiến hành:
1) Đưa ra đề xuất thiết kế (có phương án thay thế)
2) Triển khai (commit nhỏ/comment lý do)
3) Tạo và sửa test → cho đến khi <TEST_CMD> Pass (có thể dùng YOLO nếu cần)
4) Review phạm vi ảnh hưởng và refactor nhẹ (không chạm vào vùng bảo vệ)

Xác minh/báo cáo:
- Thay đổi, lý do, rủi ro còn lại, điểm chưa rõ
- Kết quả test, tóm tắt log, TODO tiếp theo
```

## Giải Thích Chi Tiết Các Tiêu Chí Đánh Giá

### 1. Hướng Mục Tiêu (Định nghĩa Done rõ ràng)

Đây là trục đánh giá quan trọng nhất. Nếu "điều gì hoàn thành thì kết thúc" không rõ ràng, AI cũng sẽ mất hướng mục tiêu.

**Ví dụ xấu:**
```
Triển khai xác thực người dùng
```

**Ví dụ tốt:**
```
Triển khai chức năng xác thực người dùng
- Định nghĩa Done: Có thể đăng nhập bằng email và password
- Khi thành công: Phát hành JWT token và redirect đến /dashboard
- Khi thất bại: Hiển thị thông báo lỗi phù hợp
- Test: `npm run test:auth` phải pass
```

### 2. Làm Rõ Ràng Buộc (Kỹ thuật/Kinh doanh)

Bằng cách làm rõ điều kiện ràng buộc, có thể thu hẹp không gian tìm kiếm của AI một cách phù hợp và ngăn chặn việc triển khai không mong muốn.

**Ví dụ thực tế:**
```
# Ràng buộc kỹ thuật
- Thư viện sử dụng: NextAuth.js v4 (không dùng v5)
- Database: Không thay đổi schema PostgreSQL hiện có
- Response time: Xử lý xác thực trong vòng 500ms

# Ràng buộc kinh doanh
- Tuân thủ GDPR: Cấm output log dữ liệu người dùng
- Xác thực đa yếu tố: Thiết kế có cân nhắc mở rộng trong tương lai
```

### 3. Chia Sẻ Ngữ Cảnh (File, ví dụ input/output, log, v.v.)

Việc truyền đạt chính xác "hiện tại đang ở đâu" cho AI là rất quan trọng. Hãy tận dụng tính năng `@` của Cursor.

**Chia sẻ ngữ cảnh hiệu quả:**
```
Tình trạng lỗi hiện tại:
Xác nhận 50 dòng mới nhất của @file(logs/error.log)
TypeError xảy ra tại dòng 42 của @file(src/auth/login.ts)
Input mong đợi: { email: "test@example.com", password: "secure123" }
Lỗi thực tế: Cannot read property 'id' of undefined
```

### 4. Tận Dụng Tính Năng Đặc Trưng Của Cursor

Cursor có những tính năng mạnh mẽ. Không tận dụng chúng thì thật phí.

- **@file/@folder**: Bao gồm file hoặc folder cụ thể vào ngữ cảnh
- **@Symbols**: Tham chiếu định nghĩa hàm hoặc class
- **YOLO Mode**: Thực thi liên tục không cần xác nhận (sử dụng cẩn thận)
- **.cursorrules**: Định nghĩa quy tắc riêng cho project
- **Đồng bộ Index**: Làm sâu sắc hiểu biết về toàn bộ codebase

### 5. Tiến Hành Từng Giai Đoạn

Các task phức tạp nhất định phải tiến hành từng giai đoạn. Cố gắng làm tất cả một lúc sẽ thất bại.

**Ví dụ về cách tiếp cận từng giai đoạn:**
```
Step 1: Hãy đưa ra 3 đề xuất thiết kế flow xác thực
Step 2: Triển khai skeleton code với thiết kế đã chọn
Step 3: Triển khai logic xác thực cơ bản
Step 4: Thêm xử lý lỗi
Step 5: Tạo test case và xác nhận tất cả đều pass
```

## Con Đường Trưởng Thành Từ L1 Đến L5

### L1: Trình Độ Người Mới Bắt Đầu
- Hướng dẫn mơ hồ như "sửa bug", "thêm chức năng"
- Hầu như không có thông tin ngữ cảnh
- Phương pháp xác minh không rõ

### L2: Trình Độ Cơ Bản
- Có thể truyền đạt yêu cầu cơ bản
- Chỉ định một số file bằng `@`
- Bao gồm điều kiện test đơn giản

### L3: Trình Độ Trung Cấp
- Định nghĩa Done rõ ràng
- Làm rõ ràng buộc kỹ thuật
- Ý thức về tiến hành từng giai đoạn

### L4: Trình Độ Cao Cấp
- Chia sẻ ngữ cảnh toàn diện
- Tận dụng hiệu quả tính năng Cursor
- Cân nhắc bảo mật và hiệu năng

### L5: Trình Độ Chuyên Gia
- Điểm cao trên tất cả trục đánh giá
- Hướng dẫn nhìn toàn cảnh project
- Prompt làm gương cho các thành viên khác

## Ví Dụ Báo Cáo Đánh Giá Thực Tế

Dưới đây là báo cáo đánh giá một prompt thực tế:

### Tổng Quan

Chia sẻ ngữ cảnh và tận dụng tính năng Cursor là tốt, nhưng định nghĩa Done mơ hồ và thiếu tiến hành từng giai đoạn. Cân nhắc bảo mật cũng còn chỗ để cải thiện.

#### Mức Độ Trưởng Thành
- **L2** (Bao gồm các yếu tố cơ bản nhưng còn nhiều chỗ để nâng cao chất lượng)

#### Bảng Điểm
| Chỉ số | Điểm | Căn cứ |
|---|---:|---|
| Hướng mục tiêu | 3 | Mục đích đại khái được chỉ ra nhưng điều kiện hoàn thành không rõ |
| Tính cụ thể của ràng buộc | 4 | Công nghệ sử dụng được làm rõ nhưng không có yêu cầu hiệu năng |
| Chia sẻ ngữ cảnh | 7 | Sử dụng @file hiệu quả, chỉ định file liên quan phù hợp |
| Tận dụng tính năng Cursor | 6 | Tận dụng @file tốt, chưa sử dụng .cursorrules hay đồng bộ Index |
| Tiến hành từng giai đoạn | 2 | Yêu cầu triển khai toàn bộ một lúc, không có cách tiếp cận từng giai đoạn |
| Lặp lại debug | 3 | Phương pháp xử lý khi có lỗi không rõ ràng |
| Bảo vệ refactor | 5 | Có cân nhắc ảnh hưởng đến code hiện có nhưng phạm vi bảo vệ mơ hồ |
| Xác minh/Test | 4 | Có ý thức về sự tồn tại của test nhưng không có quy trình xác minh cụ thể |
| Bảo mật/Quyền riêng tư | 3 | Bao gồm xác thực nhưng không cân nhắc bảo mật khác |
| Phân chia Planner/Executor | 2 | Không tách biệt thiết kế và triển khai |
| Quản lý scope | 5 | Chức năng đích rõ ràng nhưng thiếu cân nhắc mở rộng tương lai |

#### Điểm Mạnh
- Tham chiếu file chính xác bằng @file
- Làm rõ framework sử dụng (Next.js)
- Mô tả yêu cầu chức năng cơ bản
- Ý thức về tính nhất quán với code hiện có

#### Điểm Cần Cải Thiện (Set Comment và Đề xuất cải thiện)

- **Comment của người dùng (trích xuất):** "Hãy tạo màn hình quản lý người dùng"
- **Vấn đề:** Yêu cầu cụ thể của màn hình, tiêu chuẩn hoàn thành không rõ
- **Đề xuất cải thiện:** "Triển khai màn hình quản lý người dùng (chức năng CRUD). Định nghĩa Done: Hiển thị danh sách, tạo mới, chỉnh sửa, xóa hoạt động và @file(tests/admin/users.test.ts) pass"

- **Comment của người dùng (trích xuất):** "Triển khai với App Router của Next.js"
- **Vấn đề:** Cấu trúc routing, cấu tạo page không rõ ràng
- **Đề xuất cải thiện:** "Tạo page.tsx (danh sách), [id]/page.tsx (chi tiết), new/page.tsx (mới) dưới /admin/users/. Kế thừa layout của @file(app/layout.tsx)"

- **Comment của người dùng (trích xuất):** "Cũng xử lý lỗi phù hợp"
- **Vấn đề:** Tiêu chuẩn "phù hợp" mơ hồ
- **Đề xuất cải thiện:** "Xử lý lỗi: 400 series hiển thị thông báo hướng người dùng, 500 series chuyển màn hình lỗi. Tất cả lỗi được ghi log bằng @file(utils/logger.ts)"

#### Giải Pháp Tức Thì
- Thêm định nghĩa Done: "Quản trị viên có thể bật/tắt trạng thái người dùng"
- Làm rõ lệnh test: `npm run test:admin && npm run e2e:admin`
- Chia giai đoạn: "Step1: Tạo UI component → Step2: Triển khai API → Step3: Tích hợp"
- Tiêu chuẩn hiệu năng: "Danh sách người dùng hiển thị đến 1000 mục trong vòng 1 giây"

#### Biện Pháp Tác Động Cao (Cải thiện liên tục)
- Định nghĩa pattern UI chung cho màn hình quản lý trong .cursorrules
- Tạo test utility chung cho màn hình quản lý
- Thêm security checklist vào project
- Cân nhắc đưa vào component library (shadcn/ui, v.v.)

#### Prompt Sẵn Sàng Sử Dụng Cho Lần Tiếp Theo

```
Mục đích:
- Triển khai màn hình quản lý người dùng (chức năng CRUD)
- Định nghĩa Done: Tất cả các chức năng sau đều hoạt động
  - Hiển thị danh sách người dùng (có pagination)
  - Hiển thị chi tiết người dùng
  - Tạo/chỉnh sửa người dùng (có validation)
  - Xóa người dùng (có dialog xác nhận)
  - Xác minh: npm run test:admin:users pass

Tiền đề và ràng buộc:
- Tech stack: Next.js 14 App Router, Prisma, TailwindCSS
- Chất lượng/hiệu năng: Hiển thị danh sách đến 1000 mục trong 1 giây, tỷ lệ lỗi dưới 1%
- Phạm vi ảnh hưởng: Hoàn thành trong @folder(app/admin/users/) (@file(app/layout.tsx) cấm thay đổi)

Context:
- Đối tượng: Tạo mới @folder(app/admin/users/)
- Triển khai tham khảo: Theo cấu trúc của @folder(app/admin/products/)
- Data model: Sử dụng User model của @file(prisma/schema.prisma)
- Ví dụ input/output: 
  - GET /api/admin/users → [{id, email, name, role, createdAt}...]
  - POST /api/admin/users → {id, email, name, role}

Cách tiến hành:
1) Đưa ra đề xuất thiết kế UI component (table vs card format)
2) Triển khai CRUD API cơ bản (@folder(app/api/admin/users/))
3) Triển khai frontend (ưu tiên React Server Components)
4) Triển khai xử lý lỗi và trạng thái loading
5) Tạo E2E test (sử dụng Playwright)

Xác minh/báo cáo:
- Danh sách file đã triển khai và vai trò của chúng
- Điểm cân nhắc bảo mật (ủy quyền, validation, log)
- Kết quả performance test
- Điểm mở rộng trong tương lai (quản lý role, thao tác hàng loạt, v.v.)
```

## Tóm Tắt và Mẹo Cá Nhân

**Đề xuất triển khai từng giai đoạn:**
Mặc dù đã công khai dưới dạng prompt khá "trịnh trọng", nhưng thực tế không nên hướng đến sự hoàn hảo ngay từ đầu, mà hãy bắt đầu từ "hướng mục tiêu" và "chia sẻ ngữ cảnh".
Chỉ riêng 2 điểm này thôi cũng có thể cải thiện chất lượng output của AI một cách đáng kể.

**Hình thành thói quen đánh giá:**
Tôi khuyên nên tạo thời gian định kỳ để cùng nhau nhìn lại prompt (nội dung hướng dẫn). Đặc biệt là phân tích các case thất bại có thể giúp cải thiện nhanh chóng.
Ngoài ra, prompt của tôi cũng hoàn toàn không hoàn hảo (chỉ muốn nói vậy thôi), vì vậy mong các bạn "hãy thêm quan điểm này vào giáo dục" để tăng cường và tinh chỉnh.

Cuối cùng, hãy customize trục đánh giá theo mức độ trưởng thành của team và đặc tính của project. Điều quan trọng là tạo ra văn hóa viết prompt "có chủ ý" thay vì "mơ hồ".

Hợp tác với AI không còn là kỹ năng đặc biệt mà đang trở thành kỹ năng cơ bản của engineer. Hy vọng framework này sẽ giúp việc AI pair programming của các bạn trở nên hiệu quả và thú vị hơn.

## ierabu Đang Tuyển Dụng Những Đồng Đội Cùng Phát Triển Dịch Vụ Với Tốc Độ Nhanh Nhất

Việc tận dụng tối đa AI về cơ bản là nhằm mục đích cung cấp nhiều sản phẩm hơn và nhanh hơn cho ngành. Chúng tôi rộng rãi tuyển dụng những người đồng cảm với điều này.

### Hãy Cùng Phỏng Vấn Thân Mật

Luôn chào đón DM bất cứ lúc nào. Không chỉ về tuyển dụng, tôi muốn trò chuyện về bất cứ điều gì, từ AI đến quản lý.

### Trang Tuyển Dụng Sinh Viên Mới Tốt Nghiệp

[Thông tin tuyển dụng sinh viên mới tốt nghiệp tại đây]

### Trang Tuyển Dụng Thực Tập Sinh "ierabu AI Bootcamp" Dành Cho Sinh Viên Đại Học

[Thông tin thực tập sinh tại đây]

---

**Giá trị của bài viết:**
- Cung cấp framework đánh giá và cải thiện chất lượng hướng dẫn trong hợp tác với AI agent một cách hệ thống
- Hệ thống giáo dục và đánh giá để đưa ra hướng dẫn hiệu quả hơn cho các AI development tool như Cursor và Claude Code
- Góp phần nâng cao năng suất toàn team, chuẩn hóa trình độ tận dụng AI

**Đối tượng đọc giả:**
Engineer sử dụng AI coding agent, team manager, tổ chức muốn hệ thống hóa việc tận dụng AI