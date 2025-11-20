---
title: "Sự Tiến Hóa Của AI Agent Trong Software Engineering: Hành Trình 4 Năm Từ Gợi Ý Code Đến Tự Chủ Phát Triển"
date: 2025-10-27
categories: ["AI and Machine Learning", "Development"]
tags: ["cursor", "ClaudeCode", "AI-Agent", "GitHub-Copilot", "AI-Coding", "Development"]
description: "Nhìn lại 4 năm tiến hóa của AI trong Software Engineering: từ GitHub Copilot đến AI Agent tự chủ. Phân tích 8 giai đoạn phát triển và tương lai của AI coding."
---

# Sự Tiến Hóa Của AI Agent Trong Software Engineering: Hành Trình 4 Năm Từ "Gợi Ý Code" Đến "Tự Chủ Phát Triển"

**Tác giả:** @hummer (Yuji Yamamoto)  
**Ngày xuất bản:** 2025-10-27  

---

## Tổng Quan

Đã gần 4 năm kể từ khi GitHub Copilot (tháng 6/2021) được công bố. Trong khoảng thời gian ngắn ngủi này, mối quan hệ giữa AI và phát triển phần mềm đã thay đổi một cách đáng kể.

Bản thân tác giả, trong khi sử dụng công cụ AI hàng ngày cho công việc phát triển, liên tục bị ngạc nhiên bởi tốc độ tiến hóa này. Thứ từng chỉ là "công cụ gợi ý code" giờ đây đã biến thành "đối tác có thể giao phó từ thiết kế đến triển khai".

Bài viết này sẽ xem xét lại sự tiến hóa của AI agent trong software engineering, phân tích cách thức làm việc của developer đã thay đổi như thế nào, và sẽ đi về đâu trong tương lai.

---

## 8 Giai Đoạn Tiến Hóa

### Giai Đoạn 1: Code Completion Theo Từng Dòng (2021~)

#### Cú Sốc Mang Tên GitHub Copilot (Tháng 6/2021)

Sự ra đời của GitHub Copilot vào tháng 6/2021 là một cú sốc. Các tính năng completion của IDE trước đó chỉ đưa ra gợi ý tên biến hay tên method, nhưng Copilot hiểu ngữ cảnh và đề xuất "dòng code tiếp theo cần viết".

```python
def fibonacci(n):
    # Chỉ cần viết đến đây, dòng tiếp theo sẽ tự động được đề xuất
```

**Đặc điểm giai đoạn này:**

- Developer nắm hoàn toàn quyền chủ động
- AI chỉ tập trung vào "dự đoán" và "gợi ý"
- Chỉ có hai lựa chọn: nhấn Tab để chấp nhận hoặc bỏ qua
- Năng suất tăng lên nhưng quy trình phát triển vẫn như cũ

Vai trò của developer không có sự thay đổi lớn. Chỉ là lượng typing giảm đi, thời gian viết boilerplate code được rút ngắn.

---

### Giai Đoạn 2: Multi-line Suggestion Dựa Trên Comment (2022~)

#### Trải Nghiệm "Viết Ý Định, Sinh Ra Triển Khai"

Khi Copilot tiến hóa và có thể đề xuất triển khai nhiều dòng, phong cách phát triển bắt đầu thay đổi.

```python
# Đọc file CSV, lọc theo tuổi,
# sắp xếp theo tên, và trả về kết quả dưới dạng JSON
def process_users(file_path, min_age):
    # → Triển khai hơn 10 dòng được đề xuất
```

**Thay đổi ở giai đoạn này:**

- Cách viết comment trở nên quan trọng
- Yêu cầu làm rõ "muốn làm gì" hơn là "làm thế nào để triển khai"
- Chỉ dẫn mơ hồ không cho kết quả mong đợi

Lần đầu tiên, **"khả năng đặt câu hỏi cho AI"** nổi lên như một kỹ năng của developer.

---

### Giai Đoạn 3: Khả Năng Sử Dụng Công Cụ - Function Calling (Đầu 2023~)

#### Bước Ngoặt: AI Có Thể "Thực Thi"

Sau khi ChatGPT (tháng 11/2022) ra đời, với việc bổ sung **OpenAI Function Calling (tháng 6/2023)** và **Code Interpreter (tháng 7/2023)**, AI không chỉ viết code mà còn có thể thực thi.

**Những việc có thể làm được:**

- Đọc/ghi file
- Thực thi bash command
- Cài đặt package
- Visualize dữ liệu
- Chạy test và phân tích lỗi

Đây là bước ngoặt lớn. Developer có thể chỉ thị "hãy thử code này", AI thực thi và trả về kết quả. Nếu có lỗi, AI xem và đưa ra phương án sửa.

**Thay đổi trong quy trình phát triển:**

- **Truyền thống:** Sinh code → Thực thi thủ công → Xác nhận lỗi → Sửa thủ công
- **Mới:** Chỉ thị → AI thực thi → AI tự sửa → Xác nhận kết quả

AI tiến hóa từ "người quan sát" thành "người thực thi".

---

### Giai Đoạn 4: Chỉ Thị Bằng Ngôn Ngữ Tự Nhiên - Vibe-Driven Development (Cuối 2023~)

#### "Phát Triển Theo Cảm Giác" Thời GPT-4 (Tháng 3/2023)

Với sự ra đời của GPT-4 và Claude 2 (tháng 7/2023), ngay cả với chỉ thị mơ hồ, code cũng được sinh ra khá ổn.

Ví dụ:
- "Tạo chức năng đăng nhập"
- "Làm UI giống trang quản trị"
- "Xử lý lỗi cho cẩn thận nhé"

Ngay cả những chỉ thị lỏng lẻo như vậy, AI vẫn trả về một triển khai nào đó.

**Sự ra đời của Vibe-Driven Development:**

- Không cần chi tiết hóa spec, vẫn có thứ chạy được
- Nghĩ "không phải vậy" thì đổi prompt và sinh lại
- Quay gacha cho đến khi "trúng"

Thoạt nhìn có vẻ năng suất tăng lên. Tuy nhiên, vấn đề cũng xuất hiện.

**Vấn đề của Vibe-Driven Development:**

- Không hiểu lý do của code được sinh ra
- Không có tính tái hiện (cùng chỉ thị nhưng kết quả khác nhau)
- Debug khó khăn
- Không thể chia sẻ kiến thức trong team
- Chất lượng code không ổn định

Ở giai đoạn này, **"tầm quan trọng của khả năng đặt câu hỏi phù hợp"** được nhận thức lại. Chỉ thị mơ hồ chỉ cho kết quả mơ hồ. Định nghĩa yêu cầu rõ ràng mới là chìa khóa sinh ra code tốt.

---

### Giai Đoạn 5: Hiểu Toàn Bộ Codebase - Quản Lý Context Tiến Hóa (Đầu 2024~)

#### Kỷ Nguyên Long Context

Với sự ra đời của **Claude 3 (tháng 3/2024)** (context window 200K tokens), **GPT-4 Turbo (tháng 11/2023)** (128K tokens), và việc thực dụng hóa công nghệ RAG (Retrieval-Augmented Generation), AI có thể hiểu toàn bộ project thay vì chỉ một file.

**Những việc có thể làm được:**

- Tuân thủ architecture pattern hiện có
- Thích nghi với quy ước đặt tên riêng của project
- Triển khai đảm bảo tính nhất quán với các file khác
- Hiểu và sửa đổi legacy codebase

**Sự ra đời của Cursor (2023), Windsurf (2024), Cline (2024):**

Các công cụ này index toàn bộ project và tự động tham chiếu code liên quan khi đưa ra đề xuất.

```
"Thêm input check vào update method của UserController,
theo validation pattern hiện có"
```

Với chỉ thị như vậy, công cụ có thể tham chiếu các controller khác trong project và sinh ra triển khai thống nhất.

**Vai trò của developer:**

- Suy nghĩ về tính nhất quán với toàn bộ hệ thống, không chỉ một chức năng
- Cung cấp context phù hợp cho AI
- Xác nhận xem code được sinh có tuân thủ pattern hiện có không

---

### Giai Đoạn 6: Lặp Lại Dựa Trên Verification Và SWE Chatbot (Giữa 2024~)

#### Từ "Gacha" Đến "Đối Thoại"

Ở giai đoạn này, cách tiếp cận phát triển thay đổi căn bản. Thay vì nhắm đến triển khai hoàn hảo một phát, là phong cách tinh chỉnh dần qua đối thoại với AI.

**Luồng đối thoại điển hình:**

1. **Làm rõ yêu cầu qua đối thoại**
   - Developer: "Muốn tạo chức năng đăng ký user"
   - AI: "Cần xác thực email không? OAuth integration thế nào?"

2. **Sinh triển khai ban đầu**
   - AI đề xuất triển khai cơ bản

3. **Sinh và chạy test**
   - AI sinh test code
   - Chạy và phát hiện lỗi

4. **Feedback loop**
   - Cho AI xem lỗi
   - AI đưa phương án sửa
   - Test lại

5. **Refactoring và tối ưu**
   - Cải thiện performance
   - Xử lý edge case

Trong thời kỳ này, **SWE-bench (tháng 10/2023)** đánh giá task software engineering trong thế giới thực cũng ra đời, đo lường năng lực thực tiễn của AI agent.

**Nhận thức quan trọng ở giai đoạn này:**

Không phải "gacha" dựa vào may rủi, mà thông qua đối thoại có cấu trúc và feedback, có thể tiến gần đến code mục tiêu một cách chắc chắn. **Thiết kế câu hỏi cho AI** càng trở nên quan trọng.

---

### Giai Đoạn 7: Spec-Driven Development - Spec Mới Là Thành Quả (Cuối 2024~)

#### Paradigm Shift: Từ Người Triển Khai Sang Người Thiết Kế Spec

Với sự ra đời của V0.dev (tháng 10/2023), Bolt.new (tháng 6/2024), Lovable (tháng 8/2024), Replit Agent (tháng 9/2024), paradigm phát triển thay đổi.

**Quy trình phát triển truyền thống:**

```
Yêu cầu → Thiết kế → Triển khai → Test → Deploy
```

**Quy trình phát triển mới:**

```
Định nghĩa spec chi tiết → AI triển khai → Verification → Trau chuốt spec
```

Đặc biệt **Claude 3.5 Sonnet (tháng 6/2024, update tháng 10/2024)** có năng lực coding cải thiện đáng kể, có thể sinh triển khai chất lượng cao ngay cả với project phức tạp.

#### Công Cụ Hỗ Trợ Spec-Driven Development

Ở giai đoạn này, các công cụ hỗ trợ spec-driven development cũng xuất hiện:

- **SpecKit (2024)**: Công cụ cấu trúc hóa spec và chuyển đổi sang format dễ triển khai cho AI
- **cc-sdd (2024)**: Framework mô tả spec được tối ưu cho Claude. Phát hiện sự mơ hồ của spec, xác định vấn đề trước khi triển khai

Các công cụ này hỗ trợ hành vi "viết spec tốt". Đối với spec developer viết:

- Chỉ ra biểu hiện mơ hồ
- Đặt câu hỏi về yêu cầu thiếu sót
- Phát hiện edge case bị bỏ sót
- Cấu trúc hóa sang format AI dễ hiểu

**Ví dụ cụ thể:**

Với V0.dev, nếu mô tả spec chi tiết (hành vi component, quản lý state, API endpoint, xử lý lỗi), từ frontend đến backend đều được triển khai một lượt.

**Thay đổi vai trò developer:**

- Người viết code → Người viết spec
- Suy nghĩ chi tiết triển khai → Định nghĩa hành vi hệ thống
- Debug → Loại bỏ sự mơ hồ của spec

Điều trở nên rõ ràng ở đây là **"khả năng viết spec tốt" trở thành kỹ năng cốt lõi của developer**. Và để viết spec tốt cần:

- Khả năng dự đoán edge case
- Khả năng cấu trúc hóa sự mơ hồ
- Khả năng ngôn ngữ hóa yêu cầu rõ ràng

Nói cách khác, chính **"khả năng đặt câu hỏi phù hợp cho AI"** được yêu cầu.

---

### Giai Đoạn 8: Thiết Kế Triển Khai Tự Chủ Với Multimodal AI + MCP (2025~)

#### Kỷ Nguyên AI Thực Hiện Quyết Định Thiết Kế

Ở giai đoạn mới nhất, AI không chỉ triển khai mà còn có thể thực hiện quyết định thiết kế.

**Thực dụng hóa năng lực multimodal:**

- Hiểu UI spec từ screenshot
- Diễn giải wireframe viết tay
- Sinh triển khai từ sơ đồ database
- Debug từ screenshot màn hình lỗi

**Claude Computer Use (tháng 10/2024)** cho phép AI xem màn hình, thao tác UI, và phát triển trong khi xác nhận kết quả.

#### MCP (Model Context Protocol) - Liên Kết Ecosystem (Tháng 11/2024)

MCP là protocol cho phép AI liên kết với công cụ và dịch vụ bên ngoài:

- Tích hợp GitHub, GitLab, Linear, Jira
- Liên kết CI/CD pipeline
- Feedback từ công cụ phân tích log
- Kết nối monitoring system
- Giao tiếp trực tiếp với database và API

#### Sự Ra Đời Của Claude Code (Tháng 1/2025)

Đặc biệt đáng chú ý là sự ra đời của **Claude Code**. Đây là công cụ cho phép ủy thác coding task trực tiếp cho Claude từ command line, nhận được sự ủng hộ tuyệt đối từ cộng đồng developer.

```bash
# Chỉ thị trực tiếp từ command line
claude code "Triển khai chức năng xác thực user, phù hợp với DB schema hiện có"

# Giải quyết issue cụ thể
claude code --issue 123 "Sửa bug này"

# Triển khai kèm test
claude code --with-tests "Thêm payment processing module"
```

**Đặc điểm của Claude Code:**

- Tiếp tục development flow mà không rời khỏi terminal
- Tự động hiểu context của project
- Thực thi nhất quán từ Git operation đến test execution
- Tự động thử sửa khi có lỗi

#### Claude Opus 4.1 (Tháng 8/2025)

Với sự ra đời của **Claude Opus 4.1**, năng lực phát triển của AI còn bay nhảy hơn nữa:

- Context window dài hơn (tối đa 500K tokens)
- Độ chính xác quyết định architecture phức tạp cải thiện
- Tính nhất quán khi edit nhiều file cải thiện đáng kể
- Độ chính xác đề xuất tối ưu performance tăng lên

#### Chu Kỳ Phát Triển Tự Chủ

1. **Phân tích yêu cầu**: Đọc issue và document
2. **Thiết kế architecture**: Đề xuất cấu trúc tối ưu trong khi tuân thủ pattern hiện có
3. **Sinh triển khai**: Triển khai trải dài nhiều file
4. **Sinh và chạy test**: Unit test, integration test
5. **Deploy**: Trigger CI/CD pipeline
6. **Monitoring**: Xác nhận hoạt động môi trường production
7. **Tự sửa**: Tự tạo PR sửa nếu có vấn đề

**Ví dụ thực tế:** Devin (tháng 3/2024), Replit Agent (tháng 9/2024), Claude Computer Use (tháng 10/2024), Claude Code (tháng 1/2025)

Các công cụ này có thể thực thi từ issue đến deploy với sự can thiệp tối thiểu của con người.

**Tuy nhiên, tự chủ hoàn toàn cũng có giới hạn:**

- Quyết định business cần con người
- Ưu tiên trade-off
- Quyết định cuối cùng về security và compliance
- Đánh giá bản chất trải nghiệm người dùng

---

## Thay Đổi Năng Lực Developer Cần Có

### Từ Kỹ Năng Kỹ Thuật Sang Kỹ Năng Siêu Nhận Thức

Nhìn tổng quan 8 giai đoạn tiến hóa, có thể thấy năng lực developer cần có đã thay đổi đáng kể.

**Kỹ năng quan trọng ở giai đoạn 1-2:**

- Kiến thức cú pháp ngôn ngữ lập trình
- Hiểu biết về algorithm và data structure
- Kỹ thuật debug
- Cách viết code hiệu quả

**Kỹ năng quan trọng ở giai đoạn 7-8:**

- Sức nhìn thấu bản chất vấn đề
- Khả năng cấu trúc hóa yêu cầu mơ hồ
- Góc nhìn tổng quan toàn bộ hệ thống
- Sức phán đoán trade-off
- **Khả năng đặt câu hỏi phù hợp cho AI** ← Quan trọng nhất

Đặc biệt là "khả năng đặt câu hỏi phù hợp cho AI" - tầm quan trọng của nó tăng lên qua tất cả các giai đoạn.

---

## "Khả Năng Đặt Câu Hỏi" Là Gì?

### Hiểu Lầm Phổ Biến

Nhiều người hiểu lầm rằng "khả năng đặt câu hỏi" = "khả năng đưa ra chỉ thị chi tiết". Tuy nhiên, điều thực sự quan trọng là **quá trình làm rõ yêu cầu mơ hồ cùng nhau thông qua đối thoại với AI**.

Hãy so sánh qua các ví dụ cụ thể.

### Ví Dụ 1: Triển Khai Chức Năng Xác Thực

#### ❌ Ví Dụ Chỉ Là Chỉ Thị

```
Developer: "Tạo chức năng đăng nhập"
AI: (Triển khai trong khi vẫn mơ hồ. Session management và password hashing được làm tùy tiện)
Developer: "À, không phải vậy. Tôi muốn dùng JWT"
AI: (Triển khai lại)
Developer: "Thêm lock khi login fail nữa"
AI: (Lại triển khai lại)
```

#### ⭕ Ví Dụ Dẫn Xuất Qua Đối Thoại

```
Developer: "Muốn triển khai chức năng login. Những điểm cần xem xét trong thiết kế này là gì?"

AI: "Những điểm sau cần xem xét:
- Phương thức xác thực (email+password, OAuth, multi-factor authentication, v.v.)
- Phương thức quản lý session (JWT, server-side session, v.v.)
- Biện pháp security (password hashing, brute-force protection, v.v.)
- Thiết lập thời hạn token
Bạn dự định yêu cầu như thế nào?"

Developer: "Đầu tiên muốn bắt đầu đơn giản với email+password. OAuth để phase sau. 
Muốn dùng JWT, thời hạn token thường là bao lâu?"

AI: "Phổ biến là:
- Access token: 15 phút ~ 1 giờ (ngắn, secure)
- Refresh token: 7 ngày ~ 30 ngày (cân bằng UX)
Quyết định dựa trên cân bằng security và tiện lợi."

Developer: "Access token 1 giờ, refresh 7 ngày. Thiết kế security này có vấn đề gì không?"

AI: "Về cơ bản là thiết kế tốt, nhưng hãy xem xét thêm:
- Password hashing: khuyến nghị bcrypt (cost factor 10 trở lên)
- Giới hạn số lần login: ví dụ lock tạm thời sau 5 lần fail
- Rotation của refresh token: để tăng cường security
Triển khai đến đâu?"

Developer: "Dùng bcrypt nhé. Thử 5 lần fail thì lock 10 phút. 
Token rotation nằm ngoài scope lần này"

AI: "Hiểu rồi. Tóm lại:
- Xác thực email+password
- JWT (access 1h, refresh 7d)
- Hashing bằng bcrypt
- 5 lần fail thì lock 10 phút
Sẽ triển khai theo spec này."
```

**Lợi ích:**

- Hoàn thành trong một lần triển khai
- Phát hiện điểm bỏ sót trước
- Áp dụng security best practice
- Spec được làm rõ

---

### Ví Dụ 2: Tối Ưu Performance

#### ❌ Ví Dụ Chỉ Là Chỉ Thị

```
Developer: "Tối ưu function này"
AI: (Tối ưu sai hướng do thiếu context)
Developer: "Không phải vậy, muốn nhanh hơn"
AI: (Tiếp tục triển khai sai hướng)
```

#### ⭕ Ví Dụ Dẫn Xuất Qua Đối Thoại

```
Developer: "Performance của function này đang có vấn đề. Muốn tư vấn cách tiếp cận"

AI: "Để lập phương hướng tối ưu, cho tôi biết:
- Tần suất gọi và thời gian xử lý hiện tại
- Thời gian xử lý mục tiêu
- Ràng buộc về memory hay thread-safe"

Developer: "Được gọi 100,000 lần/giây, hiện tại 50ms. Muốn trong vòng 10ms. 
Memory dùng nhiều cũng được, thread-safe là bắt buộc"

AI: "50ms→10ms là cải thiện lớn. Về đặc tính input data, 
nguyên nhân vấn đề performance bạn nghĩ là gì?"

Developer: "Thật ra không rõ lắm. Chỉ biết input là mảng khoảng 100 phần tử, 
và khoảng 80% input tương tự nhau trùng lặp"

AI: "Nếu trùng lặp 80% thì cache rất hiệu quả. 
Dùng memoization thì sao? 
Có thể triển khai thread-safe bằng LRU cache."

Developer: "Hay đấy. Chiến lược cache này có vấn đề gì không?"

AI: "Điểm cần xem xét:
- Cache size (cân bằng memory usage và hit rate)
- Timing vô hiệu hóa cache (nếu data được update)
- Monitoring cache hit rate (đo lường hiệu quả)
Data có được update không?"

Developer: "Gần như là static data. Update khoảng 1 lần/ngày"

AI: "Vậy thì phương hướng này:
- LRU cache (size 1000, TTL 24h)
- Triển khai thread-safe bằng RWLock
- Output log hit rate
Nên đạt được trong 10ms."
```

---

### Ví Dụ 3: Thiết Kế Chức Năng Mới

#### ❌ Ví Dụ Chỉ Là Chỉ Thị

```
Developer: "Thêm chức năng recommend"
AI: (Đề xuất triển khai phức tạp dùng machine learning model)
Developer: "Không, không cần phức tạp đến vậy..."
```

#### ⭕ Ví Dụ Dẫn Xuất Qua Đối Thoại

```
Developer: "Muốn thêm chức năng recommend sản phẩm. 
Yêu cầu 『Dựa trên lịch sử xem, recommend 5 sản phẩm』 này đủ chưa?"

AI: "Hướng cơ bản đã hiểu, nhưng những điểm sau chưa rõ:
- Yêu cầu độ chính xác recommend (rule-based đơn giản? machine learning cao cấp?)
- Ràng buộc response time
- Tính real-time (phản ánh ngay? batch processing?)
- Ràng buộc cost và infrastructure
Bạn cần độ chính xác đến mức nào?"

Developer: "Đầu tiên muốn bắt đầu từ triển khai đơn giản. Muốn trả về trong 100ms"

AI: "Yêu cầu đơn giản + nhanh thì approach sau thế nào:
1. Cùng category với sản phẩm đã xem
2. Cùng price range
3. Sort theo độ phổ biến
Cache bằng Redis có thể đạt được dưới 100ms. 
Thiết kế này có vấn đề hay điểm cải thiện gì không?"

Developer: "Hay đấy. Trường hợp muốn tăng độ chính xác sau này thì sao?"

AI: "Sẽ thiết kế để dễ mở rộng:
- Interface hóa recommend logic
- Có thể thay thế bằng collaborative filtering hay machine learning sau
- Cơ chế chuyển đổi cho A/B test
Tiến hành theo phương hướng này chứ?"

Developer: "Hoàn hảo. Nhờ vậy"
```

---

### Ví Dụ 4: Cải Thiện Error Handling

#### ❌ Ví Dụ Chỉ Là Chỉ Thị

```
Developer: "Làm error handling cho đàng hoàng"
AI: (Chỉ thêm một đống try-catch)
Developer: "Còn cần notification lỗi và logging..."
```

#### ⭕ Ví Dụ Dẫn Xuất Qua Đối Thoại

```
Developer: "Error handling của API này có vấn đề gì không?"

AI: "Xem triển khai hiện tại, những điểm sau còn thiếu:
- Không có retry processing khi external API fail
- Error log chưa được cấu trúc hóa
- Chi tiết kỹ thuật bị lộ trong error message cho user
- Không có cơ chế thông báo cho developer
Đặc biệt có dự định xử lý external API failure không?"

Developer: "Đúng, lo nhất là external API failure. Nên xử lý thế nào?"

AI: "Đề xuất approach sau:
- Retry processing (exponential backoff)
- Circuit breaker pattern (tạm dừng khi fail liên tục)
- Fallback processing (trả cache data chẳng hạn)
Chiến lược nào phù hợp?"

Developer: "Retry tối đa 3 lần, dùng exponential backoff. 
Circuit breaker nằm ngoài scope lần này. 
Thiết kế error notification 『Gửi Slack』 này thế nào?"

AI: "Về thiết kế notification muốn xác nhận:
- Notify tất cả error? (có thể noise nhiều)
- Phân chia mức độ khẩn cấp notification (critical, warning, v.v.)
- Rate limit notification (ngăn notify hàng loạt trong thời gian ngắn)
Tổ chức thế nào?"

Developer: "Chỉ notify Slack với error 500. Còn lại chỉ log"

AI: "Về trải nghiệm user, error message này thế nào?
『Đã xảy ra lỗi tạm thời. Vui lòng thử lại sau. (Error ID: xxxxx)』
Gắn Error ID thì có thể trace khi contact support."

Developer: "Ý tưởng Error ID hay đấy. Nhờ vậy"

AI: "Vậy sẽ triển khai theo spec này:
- Retry 3 lần (exponential backoff)
- Error 500 notify Slack
- Structured log + gắn Error ID
- Message chung cho user + Error ID"
```

---

## Ba Giá Trị Của Đối Thoại

Như các ví dụ cho thấy, dẫn xuất spec qua đối thoại có 3 giá trị:

### 1. Phát Hiện Điểm Bỏ Sót

Developer hỏi "XX này có vấn đề gì không?", AI chỉ ra vấn đề tiềm ẩn (security, performance, error case, v.v.).

### 2. Làm Rõ Trade-off

Có thể chọn lựa có ý thức các trade-off như "độ chính xác vs đơn giản", "performance vs memory usage" trong đối thoại. Hỏi AI "Vấn đề của thiết kế này là gì?" có thể nhận ra trade-off đã bỏ sót.

### 3. Hình Thành Hiểu Biết Chung

Qua đối thoại, hiểu biết chung được tạo ra giữa developer và AI. Nhờ đó, sửa đổi và mở rộng sau này trở nên mượt mà.

---

## **Bản Chất Của "Khả Năng Đặt Câu Hỏi"**

Nói cách khác, "khả năng đặt câu hỏi" không phải là **khả năng đưa ra chỉ thị hoàn hảo ngay từ đầu**, mà là **khả năng rút ra vấn đề và phương án cải thiện từ AI thông qua câu hỏi phù hợp, cùng nhau dẫn xuất spec tối ưu**.

Và quá trình đối thoại này chính là điểm khác biệt lớn nhất với Vibe-driven development. Không phải quay gacha, mà tiến về đích một cách chắc chắn bằng đối thoại có cấu trúc.

---

## Các Công Nghệ Chính Hỗ Trợ Từng Giai Đoạn

### Giai đoạn 1 (2021):
- GitHub Copilot (2021/6)

### Giai đoạn 2-3 (2022 - Đầu 2023):
- ChatGPT (2022/11)
- GPT-4 (2023/3)
- OpenAI Function Calling (2023/6)
- Code Interpreter (2023/7)

### Giai đoạn 4-5 (Cuối 2023):
- Claude 2 (2023/7)
- V0.dev (2023/10)
- SWE-bench (2023/10)
- GPT-4 Turbo (2023/11)

### Giai đoạn 6 (Đầu - Giữa 2024):
- Claude 3 (2024/3)
- Devin (2024/3)
- Cursor chính thức hóa
- Claude 3.5 Sonnet (2024/6)

### Giai đoạn 7 (Cuối 2024):
- Bolt.new (2024/6)
- Lovable (2024/8)
- Replit Agent (2024/9)
- Claude 3.5 Sonnet update (2024/10)
- Claude Computer Use (2024/10)
- SpecKit (2024)
- cc-sdd (2024)

### Giai đoạn 8 (2025~):
- MCP (2024/11)
- Claude Code (2025/1)
- Claude Opus 4.1 (2025/8)
- Windsurf triển khai chính thức

---

## Triển Vọng Tương Lai - Vai Trò Developer Sẽ Thế Nào?

### Kỷ Nguyên "Developer Không Viết Code"?

AI agent tiên tiến nhất có thể phát triển gần như tự chủ. Vậy công việc của developer sẽ biến mất?

Tác giả không nghĩ vậy. Đúng hơn, vai trò developer sẽ chuyển dịch như sau:

#### 1. Đưa Ra Product Vision

- Nên tạo cái gì
- Tại sao cần nó
- Sinh ra giá trị gì

#### 2. Quyết Định Architecture

- Phán đoán trade-off
- Lý do chọn công nghệ
- Phương hướng scalability

#### 3. Đảm Bảo Chất Lượng Và Security

- Xác minh quyết định của AI có phù hợp không
- Đánh giá security risk
- Định nghĩa yêu cầu performance

#### 4. Cầu Nối Domain Knowledge

- Chuyển đổi yêu cầu business thành yêu cầu kỹ thuật
- Điều phối với stakeholder
- Duy trì góc nhìn user

#### 5. Thiết Kế Câu Hỏi Cho AI

- Đưa ra điều kiện ràng buộc phù hợp
- Làm rõ điều kiện thành công
- Tổ chức context

**Paradigm shift:** Từ "How (làm thế nào triển khai)" sang "Why (tại sao cần)" và "What (tạo cái gì)".

Developer sẽ đảm nhận vai trò chiến lược hơn.

---

## Sự Cần Thiết Của Học Tập Liên Tục

Tuy nhiên, điều này **không có nghĩa là không cần học kỹ thuật**.

Để đặt câu hỏi phù hợp cho AI cần:

- Biết cái gì khả thi về mặt kỹ thuật, cái gì khó
- Hiểu lựa chọn architecture và trade-off
- Nắm vững cơ bản về security và performance

Nói cách khác, **chỉ khi có hiểu biết sâu về kỹ thuật mới có thể đặt ra câu hỏi phù hợp**.

---

## Kết Luận

Đã xem lại 4 năm biến chuyển của AI agent trong software engineering:

1. **Code completion từng dòng** (2021): Hiệu quả hóa typing
2. **Multi-line suggestion dựa comment** (2022): Ngôn ngữ hóa ý định
3. **Tool usage ability** (Đầu 2023): AI có thể thực thi
4. **Vibe-driven development** (Cuối 2023): Công và tội của chỉ thị mơ hồ
5. **Context understanding evolution** (Đầu 2024): Nắm bắt toàn bộ project
6. **Verification-based iteration** (Giữa 2024): Phát triển qua đối thoại
7. **Spec-Driven Development** (Cuối 2024): Spec trở thành thành quả
8. **Autonomous design implementation** (2025~): AI trở thành đối tác chiến lược

Điểm nhất quán qua sự biến chuyển này là **"tầm quan trọng của khả năng đặt câu hỏi phù hợp cho AI" liên tục tăng lên**.

AI càng tiến hóa, chúng ta con người càng có thể tập trung vào câu hỏi bản chất. Cấu trúc hóa sự mơ hồ, làm rõ yêu cầu, tổ chức điều kiện ràng buộc - đây là năng lực chỉ con người mới có, AI không thể thay thế.

Công nghệ sẽ tiếp tục tiến hóa. Tuy nhiên, dù AI có thông minh đến đâu, những câu hỏi căn nguyên **"Tạo ra vì mục đích gì"**, **"Sinh ra giá trị cho ai"** chỉ có con người mới đặt ra được.

---

## Câu Hỏi Dành Cho Bạn

**Bạn đang cộng tác với AI ở giai đoạn nào? Câu hỏi tiếp theo bạn sẽ hỏi AI là gì?**

---

**Số liệu thống kê:**
- 👍 15 Likes
- 📚 4 Stocks
- 💬 0 Comments

**Nguồn**: https://qiita.com/hummer/items/06d5797e0c4ddcddfff5
