---
title: "Tái Xem Xét Phương Pháp Phát Triển Thời Đại AI Coding: Waterfall Phù Hợp Hơn Scrum?"
date: 2025-10-14
draft: false
categories: ["Agile", "AI", "Development"]
tags: ["agile", "scrum", "waterfall", "AI-driven-development", "project-management", "AI-coding", "vibe-coding", "methodology"]
description: "Tái đánh giá phương pháp phát triển trong thời đại AI coding - liệu Water-Scrum-Fast có phải là giải pháp tốt hơn Scrum truyền thống cho AI-driven development? Phân tích chi tiết và đề xuất hybrid approach."
---

# Tái Xem Xét Phương Pháp Phát Triển Thời Đại AI Coding: Waterfall Phù Hợp Hơn Scrum?

**Danh mục:** Phát triển Agile  
**Tác giả:** @nogataka  
**Ngày công bố:** 2025年10月12日  
**Tags:** #アジャイル #プロジェクト管理 #AI #AI駆動開発 #VibeCoding  
**Likes:** 18 | **Stocks:** 14 | **Comments:** 0

**Bài viết gốc:** https://qiita.com/nogataka/items/b64870d8fd6b6c225d0c

---

> **「Trong thời đại AI viết code, liệu Scrum có thực sự là giải pháp tối ưu?」**
> 
> Bạn có thể trả lời câu hỏi này ngay không?

---

## Cuộc Cách Mạng Im Lặng Đang Diễn Ra Tại Hiện Trường Phát Triển

Giờ đây khi AI coding trở nên phổ biến, đã đến lúc cần xem xét lại chính cách tiến hành phát triển phần mềm.

Nhiều team đang áp dụng Scrum, nhưng câu hỏi nảy sinh: **Trong phát triển do AI chủ đạo (AI-driven development), liệu Waterfall có hợp lý hơn không?**

Tuy nhiên -- tốc độ ngang bằng sprint truyền thống. Nghĩa là không phải "Waterfall chậm chạp", mà là **"Water-Scrum-Fast" - một hình thức mới là giải pháp thực tế**.

---

## Lý Do Scrum Không Phù Hợp Với AI-Driven Development

Triển khai bằng AI tiến hành theo chu kỳ như sau:

```
1. Thử nghiệm dạng spike
2. Sinh code
3. Sửa・Sinh lại
```

Chu kỳ này **cực kỳ ngắn**, và code AI sinh ra **nhạy cảm với "spec mơ hồ"**. Vì vậy, **nếu không định nghĩa rõ ràng requirements và non-functional requirements, AI sẽ mất kiểm soát**.

Approach "vừa chạy vừa nghĩ" như Scrum có thể trở thành rủi ro trong phát triển AI. Việc thiết lập tối thiểu "fixed point (guard rail)" từ đầu là chìa khóa thành công.

---

## Lý Do Full Waterfall Cũng Nguy Hiểm

Mặt khác, "Waterfall như cũ" cố định mọi thứ từ đầu cũng không phù hợp.

AI có khả năng đề xuất phương án thiết kế tốt hơn hoặc implementation thay thế trong quá trình phát triển. Nếu cố định hoàn toàn spec sẽ **phong ấn sức mạnh khám phá của AI**.

---

## Giải Pháp Tối Ưu: Mô Hình "Water-Scrum-Fast"

Upstream process phân chia bằng gate rõ ràng như Waterfall, implementation process tiến hành với chu kỳ lặp AI ngắn hơn Scrum -- đó chính là "**Water-Scrum-Fast**".

### Cấu Trúc Phase

#### 🚪 Gate 0: Mission / Scope Cố Định (1〜2 ngày)

- **Thành quả:** Định nghĩa scope, chỉ số thành công, ràng buộc pháp lý・bảo mật
- **Mục tiêu:** Làm rõ mục đích, tạo trục để AI không lệch hướng

#### 🏗️ Gate 1: Thiết Kế Architecture・Thỏa Thuận Non-functional (2〜5 ngày)

- **Thành quả:** Biểu đồ archi, ADR, requirements về performance・availability・security
- **Mục tiêu:** Chuẩn bị tiêu chuẩn đánh giá output của AI

#### ⚡ Build Phase: AI Sprint (đơn vị 1〜3 ngày)

- Chu kỳ tốc độ cao **Plan → Generate → Review → Test → Deploy**
- Khuyến nghị PR nhỏ, contract test ưu tiên, phát triển Trunk-Based

#### ✅ Gate 2: Hardening / Release

- **Thành quả:** Evidence chất lượng, Runbook vận hành, vấn đề còn tồn

---

## Quality Gate Bắt Buộc Cho AI Development (Definition of Done)

Trong AI coding, phải định nghĩa rõ ràng "hoàn thành". Hãy đưa các mục kiểm tra sau vào DoD:

| Hạng mục | Tiêu chuẩn đánh giá |
|----------|---------------------|
| **Tỷ lệ phù hợp spec** | Tỷ lệ pass test requirements |
| **Phát hiện hallucination** | Đối chiếu dependency/API bằng phân tích tĩnh |
| **Ổn định tái sinh** | Output khác biệt không vượt ngưỡng với cùng prompt |
| **Kiểm tra security** | Khả năng chống Secrets・License・Prompt Injection |
| **Kiểm tra performance** | Tiêu chuẩn throughput/latency |
| **Observability** | Bao phủ log/trace/metrics |

---

## Cấu Trúc Team Và Vai Trò

| Vai trò | Trách nhiệm chính |
|---------|-------------------|
| **PO / PM** | Quyết định Gate0/1, quản lý ưu tiên |
| **Tech Lead / Architect** | Xây dựng ADR/NFR, định nghĩa policy review |
| **AI Wrangler** | Thiết kế prompt, quản lý chất lượng sinh code |
| **Developer** | Tích hợp code AI sinh và tăng cường test |
| **QA / SRE** | Test tự động・tải・kiểm tra security |

---

## Mẫu Vận Hành 1 Tuần

| Ngày | Nội dung |
|------|----------|
| **Thứ Hai** | Gate0: Định nghĩa scope, template test requirements |
| **Thứ Ba** | Gate1: Thiết kế archi, benchmark PoC |
| **Thứ Tư〜Năm** | Sprint 1〜2 ngày ×2 (AI sinh→Review→Auto test) |
| **Thứ Sáu** | Hardening・Test tải/security・Quyết định Gate2 |

---

## Chỉ Số Trực Quan Hóa Thành Quả

- **Lead Time / MTTR / Change Failure Rate** (Chỉ số DORA)
- **Tỷ lệ áp dụng AI sinh** (Số dòng chấp nhận ÷ Số dòng đề xuất)
- **Tỷ lệ khuyết tật phù hợp spec** (Tỷ lệ fail test requirements)
- **Tỷ lệ ổn định tái sinh** (Ổn định sự khác biệt output)
- **Tỷ lệ đạt SLO security・performance**

---

## Tips Thực Hành Tại Hiện Trường

### Upstream chỉ thỏa thuận fixed point tối thiểu, cho phép thay đổi linh hoạt

Không nhắm đến hoàn hảo. Chỉ làm rõ trục cần giữ, còn lại giao cho AI và developer.

### Code AI sinh xử lý bằng PR nhỏ, con người quyết định cuối cùng

Giữ 1 PR nhỏ, ở mức độ dễ review. Quyết định tích hợp cuối cùng do con người thực hiện.

### Contract test ưu tiên để chỉ rõ phạm vi output của AI

Định nghĩa trước contract của API và module, làm rõ phạm vi và tiêu chuẩn chất lượng code AI nên sinh.

### Chính thức hóa thay đổi bằng ADR, biến học tập thành tài sản team

Sử dụng Architecture Decision Records, ghi lại quyết định thiết kế thu được từ đối thoại với AI. Điều này trở thành knowledge base của team.

### Vận hành trunk + branch ngắn hạn để tối thiểu hóa conflict

Phát triển Trunk-Based tăng tần suất tích hợp, tối thiểu hóa merge conflict. Tận dụng tốc độ cao của AI.

**Phương pháp thực hành cụ thể:**

**Nguyên tắc cơ bản Trunk-Based Development**

1. **main branch luôn có thể deploy**
   - Mọi commit đã pass CI/CD pipeline
   - Test đều pass
   - Code review hoàn thành

2. **Feature branch ngắn hạn (< 1 ngày)**
   - Tuổi thọ branch tối đa 24 giờ
   - Merge vào main nhiều lần trong ngày
   - Không tạo branch dài hạn

3. **Feature Flag ẩn chức năng chưa hoàn thiện**
   - Code merge vào main nhưng chức năng bị vô hiệu hóa
   - Release từng bước có thể
   - Rollback dễ dàng

**Cách giảm thiểu merge conflict**

- Commit nhỏ, tích hợp thường xuyên
- Pull từ main 2〜3 giờ một lần
- Cho AI sinh đơn vị nhỏ
- 1 lần sinh 1 file hoặc 1 function
- Sử dụng công cụ auto-merge (Renovate, Dependabot)

---

## Bẫy Thường Gặp Trong AI-Driven Development Và Biện Pháp

### Bẫy 1: Tin tưởng quá mức vào AI dẫn đến chất lượng giảm

**Triệu chứng:**
- Merge code AI sinh mà không review
- Deploy production với coverage test thấp
- Bỏ sót lỗ hổng security

**Biện pháp:**
- **Nhất định con người phải review**: AI là người đề xuất, con người là người quyết định
- **Viết auto test trước (TDD)**: Cho AI viết test rồi mới implement
- **Bắt buộc công cụ phân tích tĩnh**: Tích hợp vào CI/CD, code không đạt chuẩn không merge được
- **Audit security định kỳ**: Penetration test hàng tuần hoặc hàng tháng

### Bẫy 2: Fixed point upstream mơ hồ, hướng đi bị lệch

**Triệu chứng:**
- Architecture thay đổi mỗi sprint
- Non-functional requirements thêm sau, phát sinh refactoring quy mô lớn
- Mỗi member hiểu khác nhau

**Biện pháp:**
- **Không bỏ qua Gate 0/1**: Dành thời gian để hình thành đồng thuận
- **Tài liệu hóa quyết định bằng ADR**: Thỏa thuận miệng không đủ
- **Retrospective định kỳ**: Hàng tuần xác nhận "Có giữ được phương châm cơ bản không"
- **Ủy quyền rõ ràng cho Tech Lead**: Quyết định người có thể ra quyết định cuối cùng với phán đoán mơ hồ

### Bẫy 3: Tốc độ sinh của AI khiến review của con người không theo kịp

**Triệu chứng:**
- PR tích tụ với số lượng lớn
- Chờ review trở thành bottleneck
- Review hình thức (duyệt chéo)

**Biện pháp:**
- **Pair programming／Mob programming**: Review đồng thời với sinh
- **Dành thời gian review**: 30% thời gian trong ngày dành cho review
- **Rotation reviewer**: Tránh tập trung vào người cụ thể
- **Sử dụng công cụ auto-review**: Check cơ học với SonarQube, CodeClimate

### Bẫy 4: Document không theo kịp, trở nên cá nhân hóa

**Triệu chứng:**
- Không ai biết "Tại sao implement như vậy"
- Onboarding member mới mất thời gian
- Sau 6 tháng không hiểu code của chính mình

**Biện pháp:**
- **Cho AI sinh cả document**: Tạo README, comment, ADR cùng lúc với code
- **Version control prompt**: Quản lý bằng Git, làm có thể tái tạo
- **Họp chia sẻ kiến thức hàng tuần**: Chia sẻ những gì học được trong tuần
- **Live coding session**: Công khai cách đối thoại với AI

### Bẫy 5: Feature Flag tăng sinh, không quản lý được

**Triệu chứng:**
- Feature Flag không bao giờ bị xóa
- Không rõ Flag nào ảnh hưởng chức năng nào
- Nhánh điều kiện phức tạp trở thành nguồn bug

**Biện pháp:**
- **Thiết lập lifecycle cho Feature Flag**: Tự động xóa sau 3 tháng kể từ tạo
- **Triển khai công cụ quản lý Flag**: Sử dụng LaunchDarkly, Unleash
- **Kiểm kê định kỳ**: Hàng tháng review Flag, xóa cái không cần
- **Quy tắc đặt tên Flag**: `feature_`, `experiment_`, `ops_` v.v. prefix làm rõ mục đích

---

## Water-Scrum-Fast Là Gì?

※「Water-Scrum-Fast」không phải tên chính thức của phương pháp phát triển, mà là thuật ngữ được tạo ra bắt đầu được sử dụng giữa các practitioner. Dựa trên「Water-Scrum-Fall」mà Forrester đề xuất, "Fast" hóa để phù hợp với thời đại AI.

### 1. Khái niệm gốc:「Water-Scrum-Fall」

#### Nguồn gốc・Bối cảnh

Từ cuối thập niên 2000 đến đầu thập niên 2010, thuật ngữ **"Water-Scrum-Fall"** được **nhà phân tích Dave West của Forrester Research** đề xuất.

- Upstream (định nghĩa requirements) và downstream (quản lý release) theo kiểu Waterfall
- Chỉ phần phát triển ở giữa là Scrum
- Tức là "cấu hình thể hiện thực tế không thể hoàn toàn Agile do ràng buộc tổ chức"

**Ví dụ điển hình về nguồn gốc:**

> Dave West, Tom Grant, *"Water-Scrum-Fall Is The Reality Of Agile For Most Organizations Today"*, Forrester Research, 2011.

---

### 2.「Water-Scrum-Fast」là phát triển (tên phổ thông) của nó

Trong khi「Water-Scrum-Fall」là hybrid "thực tế nhưng chậm", thì「Water-Scrum-Fast」là **hình thái phát triển theo hướng ngược lại "đẩy tốc độ lên giới hạn bằng AI và tự động hóa"**.

Không phải từ xuất phát từ paper học thuật hoặc guide chính thức, mà là **cụm từ không chính thức bắt đầu được sử dụng trong bối cảnh practitioner・Agile coach・phát triển AI**.

---

### Định vị khái niệm

| Phase | Water-Scrum-Fall | Water-Scrum-Fast |
|-------|------------------|------------------|
| **Upstream** | Cố định (yêu cầu・kế hoạch) | Cố định (nhưng nhanh chóng hóa với hỗ trợ AI) |
| **Midstream** | Lặp Scrum | Super-short sprint／Lặp auto sinh |
| **Downstream** | Test thủ công／Phê duyệt | CI/CD tự động・Quality gate driven |
| **Đặc điểm** | Thực tế nhưng chậm | Giữ cấu trúc nhưng tốc độ cực nhanh |
| **Bối cảnh điển hình** | Giai đoạn triển khai Agile ở doanh nghiệp lớn | AI coding／DevOps／Phát triển AI tạo sinh |

---

### Tóm tắt

- 「Water-Scrum-Fast」**không phải thuật ngữ học thuật nhưng là từ khóa thực tiễn từ hiện trường**
- Nguồn gốc là「Water-Scrum-Fall」của Forrester
- Ý nghĩa là「**Cấu trúc Waterfall có gate × Lặp tốc độ cao ngang bằng sprint**」
- Đặc biệt được chú ý như model thiết kế project thực tế cho các team tiến hành AI coding hoặc phát triển tự động sinh

---

## Câu Hỏi Thường Gặp (FAQ)

### Q1: Chuyển từ Scrum truyền thống sang Water-Scrum-Fast có khó không?

**A:** Có thể chuyển từng bước. Đầu tiên theo các bước sau:

- **Week 1-2**: Triển khai Gate 0/1 (tích hợp vào kế hoạch sprint hiện có)
- **Week 3-4**: Thử nghiệm AI tool (thử nghiệm với 1 team)
- **Week 5-6**: Rút ngắn thời gian sprint (2 tuần→1 tuần)
- **Week 7-8**: Chuyển sang thể chế Water-Scrum-Fast hoàn toàn

Quan trọng là sự đồng thuận và training của toàn team.

### Q2: Bản quyền của code AI sinh ra như thế nào?

**A:** Về mặt pháp lý là vùng xám, nhưng khuyến nghị các biện pháp sau:

- Ngay cả code AI sinh, nếu con người sửa đổi lớn thì được coi là phát sinh bản quyền
- Sử dụng công cụ phát hiện vi phạm license (WhiteSource, Black Duck)
- Ghi rõ "Sử dụng code AI sinh" trong hợp đồng
- Xác nhận tính nhất quán với open source license

### Q3: Chi phí AI tool là bao nhiêu? ROI?

**A:** Ví dụ ước tính chi phí và ROI:

**Chi phí (1 team 5 người, tháng):**
- GitHub Copilot Business: $19/người × 5 = $95
- Claude Pro / ChatGPT Plus: $20/người × 5 = $100
- Tổng: Khoảng $200/tháng (khoảng 3 vạn yên)

**ROI:**
- Giả sử tốc độ phát triển tăng gấp 2
- Lương 1 engineer 50 vạn yên/tháng, 5 người = 250 vạn yên
- Năng suất gấp 2 = Tương đương với tuyển thêm 5 người = Giá trị 250 vạn yên/tháng
- **ROI = 250 vạn yên / 3 vạn yên = Khoảng 83 lần**

---

## Case Study: Ví Dụ Triển Khai Thực Tế

### Case 1: Startup (20 nhân viên, 8 engineer)

**Kết quả:**
- **Thời gian phát triển: 3 tháng → 6 tuần** (rút ngắn 50%)
- **Chất lượng code: Đạt coverage 85%**
- **Sự hài lòng team: Cao** (4.5/5 điểm trong khảo sát)

### Case 2: Bộ phận kinh doanh mới của doanh nghiệp lớn (100 nhân viên, 30 engineer)

**Kết quả:**
- **Tần suất deploy: 2 lần/tháng → 3 lần/tuần**
- **Lead Time: 2 tuần → 3 ngày**
- **Change Failure Rate: 18% → 8%** (chất lượng cũng cải thiện)

### Case 3: Công ty SI (Dự án phát triển gia công)

**Kết quả:**
- **Thời gian giao hàng: 6 tháng → 4 tháng** (rút ngắn 33%)
- **Ngân sách: Không vượt** (thực ra giảm 10%)
- **Mức độ hài lòng khách hàng: Rất cao** (có được dự án lặp lại)

---

## Tóm Tắt Và Bước Tiếp Theo

### Cốt lõi của Water-Scrum-Fast

**3 Nguyên tắc:**

1. **Làm rõ điều cần cố định (guard rail)**
   - Phương châm cơ bản architecture
   - Non-functional requirements
   - Security・Compliance requirements

2. **Để lại điều có thể thay đổi linh hoạt (vùng khám phá)**
   - Phương pháp implement chi tiết
   - Approach tối ưu performance
   - Chi tiết UI

3. **Tận dụng tối đa tốc độ cao của AI**
   - Super-short sprint 1〜3 ngày
   - PR nhỏ, tích hợp thường xuyên
   - Quality gate tự động hóa

### Điều có thể bắt đầu từ ngày mai trong team của bạn

**Bước 1: Đánh giá và kế hoạch (Week 1)**
- Liệt kê vấn đề của quy trình phát triển hiện tại
- Thảo luận với member về Water-Scrum-Fast
- Chọn pilot project

**Bước 2: Training (Week 2)**
- Triển khai và training AI tool
- Học cơ bản prompt engineering
- Tạo template Gate 0/1

**Bước 3: Thử nghiệm triển khai (Week 3-6)**
- Thực hành với project nhỏ
- Retrospective hàng tuần
- Liệt kê điểm cải thiện

**Bước 4: Triển khai chính thức (Week 7 trở đi)**
- Triển khai toàn team
- Cải thiện liên tục
- Đo lường và chia sẻ thành quả

### Resource và Tool

**AI tool khuyến nghị:**
- **Hỗ trợ coding**: GitHub Copilot, Cursor, Codeium
- **Code review**: CodeRabbit, Codacy
- **Sinh test**: Tabnine, Amazon CodeWhisperer
- **Sinh document**: Mintlify, Readme.so

**Sách tham khảo:**
- 「Team Topologies」- Matthew Skelton, Manuel Pais
- 「Accelerate」- Nicole Forsgren, Jez Humble, Gene Kim
- 「The DevOps Handbook」- Gene Kim, Jez Humble, Patrick Debois, John Willis

---

## Kết Luận: Hướng Tới "Mô Hình Phát Triển" Mới

Trong thời đại AI viết code, đối lập nhị phân "Scrum vs Waterfall" không còn ý nghĩa.

Điều quan trọng là **cố định chỗ nào và quay nhanh chỗ nào**.

Tính kế hoạch của Waterfall, sự nhanh nhẹn của Scrum, và tốc độ cao của AI. "Water-Scrum-Fast" kết hợp 3 yếu tố này là approach thực tế tận dụng tốc độ AI trong khi cân bằng chất lượng và compliance.

Thiết lập gate ở upstream, quay cực nhanh ở downstream. Đây chính là **"mô hình phát triển" mới của thời đại AI coding**.

### Cuối cùng: Không nhắm hoàn hảo, hãy bắt đầu từ nhỏ

Water-Scrum-Fast không phải phương pháp hoàn hảo. Cần customize cho phù hợp với team, project, tổ chức của bạn.

Điều quan trọng là **bước đi từ hôm nay**.

- Thử thiết lập Gate 0 trong 1 project
- Thử rút ngắn 1 sprint xuống 1 tuần
- Thử implement 1 chức năng bằng cộng tác với AI

Một bước nhỏ có tiềm năng thay đổi đột phá việc phát triển của team.

**Phát triển thời đại AI đã bắt đầu. Bạn cũng sẽ trở thành một phần của nó chứ?**

---

**Thông tin bài viết**  
**Nguồn:** Qiita  
**URL:** https://qiita.com/nogataka/items/b64870d8fd6b6c225d0c  
**Ngày xử lý:** 2025年10月14日
