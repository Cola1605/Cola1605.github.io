---
title: "Trực quan hóa dữ liệu không cần code! Tạo Dashboard với Claude Skills"
date: 2025-12-11
draft: false
description: "Hướng dẫn chi tiết cách sử dụng tính năng Skills của Claude để tạo dashboard trực quan hóa dữ liệu từ CSV, Excel, JSON mà không cần lập trình. Sử dụng skill-creator để xây dựng workflow tự động hóa công việc lặp lại."
tags: ["Claude", "AI", "Data Visualization", "Dashboard", "No-Code", "Workflow", "Automation", "Skills", "Business Intelligence"]
categories: ["AI and Machine Learning", "Data and Analytics", "Development"]
author: "Jun Lee (李 俊浩)"
series: ["Claude Skills Series"]
---

## Tóm tắt 3 điểm chính

- Tính năng **Skills** của Claude cho phép AI ghi nhớ quy trình làm việc như trực quan hóa dữ liệu
- Chỉ cần upload dữ liệu CSV, có thể tự động tạo dashboard với nhiều biểu đồ cần thiết
- Có thể **workflow hóa** quy trình làm việc, tối ưu hóa công việc trực quan hóa lặp đi lặp lại

## Giới thiệu

Bài viết này sẽ hướng dẫn cách tạo công cụ trực quan hóa dữ liệu và quy trình sử dụng bằng tính năng **"Skills"** của Claude để tạo dashboard từ nhiều loại dữ liệu như CSV, Excel, JSON. Cụ thể, chúng ta sẽ sử dụng [dữ liệu CSV "Dân số theo giới tính - Toàn quốc, Tỉnh thành (Đại Chính năm 9 ~ Bình Thành năm 27)"](https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&toukei=00200521&tstat=000001011777&cycle=0&tclass1=000001094741&tclass2val=0) làm dữ liệu tham khảo để giới thiệu cách dễ dàng tạo và sử dụng nhiều loại biểu đồ trong dashboard.

Về tổng quan và cách sử dụng cơ bản của Skills, vui lòng xem phần trước "[Trang bị kiến thức chuyên môn cho Claude! Giải thích cơ chế và cách sử dụng Skills](https://git-generative-ai.services.isca.jp/article/business/bu034)".

> **Lưu ý**: Để sử dụng Skills, cần đăng ký một trong các gói Pro, Max, Team hoặc Enterprise.

## Đối tượng đọc giả

- Người muốn tự động hóa công việc lặp lại bằng Claude
- Người muốn cho AI học quy trình làm việc của công ty
- Developer muốn mở rộng chức năng của Claude
- Người đang xem xét triển khai công cụ AI

## Meta-skill "skill-creator" để tạo Skills

Trong bài viết này, chúng ta sẽ sử dụng **"skill-creator"** - một meta-skill (skill để tạo skill) dùng để tạo Skills. Trước tiên, hãy cùng tìm hiểu về skill-creator.

### skill-creator là gì?

Đây là "meta-skill" dùng để thiết kế và tạo các "skill" riêng lẻ cho tính năng "Skills" của Claude một cách tương tác.

Skill có cấu trúc thư mục với **SKILL.md (quy trình và metadata)** làm trung tâm, kèm theo **script** và **tài liệu tham khảo** nếu cần. Claude sẽ đọc nội dung trong thư mục này tùy theo tình huống và **thực thi các xử lý hoặc workflow đã chỉ định**.

Khi kích hoạt skill-creator từ "Cài đặt" và truyền đạt nội dung muốn tạo (yêu cầu) qua hội thoại, Claude sẽ soạn thảo và chuẩn bị khung sườn của skill (quy trình, tài nguyên cần thiết, có thể cả code thực thi).

> **Bài viết này sẽ giải thích cách thao tác trên ứng dụng desktop.**

![Claude Desktop với skill-creator được kích hoạt](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_01.jpg)

## Sử dụng skill-creator

### (1) Truyền đạt yêu cầu

```
Prompt: Tạo Claude Skills để xử lý và trực quan hóa dữ liệu (tổng hợp, tạo dashboard, v.v.)
```

Chỉ cần truyền đạt yêu cầu trên trong chat của Claude, mô hình AI của Claude sẽ tạo skill đáp ứng yêu cầu.

![Kết quả tạo skill từ prompt](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_02.jpg)

### (2) Xác nhận cấu trúc và chức năng của skill

Khi hoàn thành tạo skill, cấu trúc skill, loại dữ liệu được hỗ trợ, chức năng, v.v. sẽ được hiển thị. Tại đây, xác nhận xem có đáp ứng yêu cầu không, nếu thiếu sót thì tiến hành điều chỉnh thông qua hội thoại.

![Xác nhận cấu trúc skill](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_03.jpg)

### (3) Áp dụng skill

1. Tải skill từ phần khung đỏ
2. Tìm **data-visualization.skill** (skill đã tạo). *(Lưu ý: Tên skill có thể thay đổi tùy theo yêu cầu)*

![Download skill](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_04.jpg)

3. Upload **data-visualization.skill** (skill đã tạo) bằng chức năng upload skill của Claude Desktop
4. Kích hoạt **data-visualization** (tên skill đã tạo)

![Upload và kích hoạt skill](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_05.jpg)

## Tạo dashboard bằng skill đã tạo

Hãy thử tạo dashboard thực tế bằng skill "data-visualization" đã kích hoạt. Lần này chúng ta sẽ sử dụng [dữ liệu CSV "Dân số theo giới tính - Toàn quốc, Tỉnh thành (Đại Chính năm 9 ~ Bình Thành năm 27)"](https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&toukei=00200521&tstat=000001011777&cycle=0&tclass1=000001094741&tclass2val=0).

```
Prompt: Sử dụng [tên skill đã kích hoạt] để tạo một ứng dụng báo cáo đơn giản
```

![Tạo dashboard với prompt](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_06.jpg)

### Kết quả output

Dashboard được tự động tạo với các loại biểu đồ như:

- Biểu đồ xu hướng dân số
- So sánh dân số theo tỉnh thành
- Phân bố dân số theo giới tính
- Các thông tin thống kê khác

![Kết quả dashboard - Biểu đồ 1](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_07.jpg)

![Kết quả dashboard - Biểu đồ 2](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_08.jpg)

![Kết quả dashboard - Biểu đồ 3](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_09.jpg)

![Kết quả dashboard - Biểu đồ 4](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_10.jpg)

> **Lưu ý quan trọng**:
> - Nếu biểu đồ không hiển thị hoặc có lỗi, vui lòng đưa ra chỉ thị sửa đổi bổ sung
> - Nếu biểu đồ không hiển thị trên preview của ứng dụng desktop, hãy thử hiển thị trên trình duyệt
> - Preview có thể mất thời gian để hiển thị

## Bổ sung thêm chức năng và chuyển đổi thành skill dạng workflow

### (1) Bổ sung yêu cầu chức năng

Thêm chức năng như sau:

```
Prompt: Vui lòng thêm TOP 5 tỉnh có tỷ lệ dân số nam cao
```

![Thêm chức năng TOP 5](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_11.jpg)

### Kết quả output

Biểu đồ và kết quả phân tích bổ sung sẽ được tự động tích hợp vào dashboard.

![Kết quả sau khi thêm chức năng](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_12.jpg)

### (2) Chuyển đổi thành skill dạng workflow

Bây giờ hãy chuyển "skill trực quan hóa đa năng" đã tạo thành **"skill dạng workflow"** có thể tự động tạo cùng dashboard chỉ bằng cách upload dữ liệu có cùng định dạng.

Bằng cách sử dụng skill dạng workflow này, sau này có thể dễ dàng sử dụng dashboard có cùng định dạng. Không cần phải giải thích yêu cầu và nội dung biểu đồ muốn hiển thị mỗi lần.

```
Prompt: Vui lòng tạo Claude Skill cho [tên dashboard đã tạo]
```

### Kết quả output

![Workflow skill được tạo - 1](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_13.jpg)

![Workflow skill được tạo - 2](https://git-generative-ai.services.isca.jp/wp-content/uploads/bu_035_14.jpg)

Skill dạng workflow cho định dạng dữ liệu cụ thể (ví dụ: "Dashboard xu hướng dân số Nhật Bản") đã được tạo thành công.

## Tổng kết

Trong bài viết này, chúng tôi đã giới thiệu quy trình từ việc tạo skill xử lý và trực quan hóa dữ liệu bằng meta-skill "skill-creator" của Claude đến việc thực tế sử dụng.

### Các điểm chính

**1. Tạo skill đa năng qua đối thoại**
- Chỉ cần truyền đạt yêu cầu cho "skill-creator", có thể thiết kế và tạo skill đa năng cho trực quan hóa dữ liệu thông qua hội thoại

**2. Tạo dashboard dễ dàng từ dữ liệu CSV**
- Sử dụng skill "data-visualization" đã tạo, đã chứng minh có thể dễ dàng tạo dashboard bao gồm nhiều loại biểu đồ từ dữ liệu CSV

**3. Workflow hóa cho định dạng dữ liệu cụ thể**
- Dựa trên skill đa năng đã tạo một lần, bằng cách tạo skill dạng workflow cho định dạng dữ liệu cụ thể (ví dụ: "Dashboard xu hướng dân số Nhật Bản"), có thể tái tạo cùng dashboard mỗi khi upload dữ liệu có cùng định dạng mà không cần giải thích yêu cầu

### Lợi ích khi sử dụng Claude Skills

Bằng cách tận dụng tính năng "Skills" của Claude, có thể xây dựng công cụ trực quan hóa dữ liệu và workflow mà **không cần lập trình**, giảm gánh nặng công việc lặp lại. Đây sẽ là một lựa chọn hiệu quả cho những ai đang xem xét triển khai công cụ AI và cải thiện hiệu quả công việc.

## Cải thiện nghiệp vụ cùng AI Operations Room?

### AI-driven Development Consulting đã ra mắt!

Bạn có muốn cải thiện quy trình phát triển phần mềm theo hướng AI-first không?

**Dịch vụ chúng tôi cung cấp**:

- **Tăng tốc độ phát triển**: Tự động tạo code từ thiết kế và đặc tả được đề xuất theo hướng AI-first
- **Nâng cao chất lượng**: Tự động tạo test case, giảm lỗi con người, nâng cao độ tin cậy
- **Tập trung vào sáng tạo**: Developer giao công việc định kỳ (tạo tài liệu, test, v.v.) cho AI, con người tập trung vào giải quyết vấn đề phức tạp và sáng tạo

### Bạn có cảm thấy "phiền phức..." trong công việc hàng ngày không?

> **Những vấn đề thường gặp**:
> - Tạo báo cáo hàng ngày, tốn khá nhiều thời gian...
> - Đã thử Claude Code nhưng chưa dùng thành thạo...
> - Đọc kết quả khảo sát số lượng lớn rất vất vả...

**Những "phiền phức" đó có thể được giải quyết bằng sức mạnh của AI!**

Trong quá trình thử nghiệm tự động hóa nghiệp vụ bằng AI và AI coding, tôi đã tích lũy được khá nhiều cách sử dụng tiện lợi và kiến thức. Tôi muốn chia sẻ kinh nghiệm này với mọi người và cùng nhau "tận hưởng sự tiện lợi".

### Ví dụ, chỉ cần trao đổi nhẹ nhàng như thế này cũng OK!

- Tôi muốn tự động hóa công việc 〇〇, bạn nghĩ sao?
- Hãy dạy tôi cách sử dụng AI coding tiện lợi!
- AI 〇〇 đang được bàn tán gần đây, thực tế thế nào?

> **Lời kết từ AI Operations Room**:
> 
> Nếu bạn cảm thấy hứng thú dù chỉ một chút, hãy liên hệ với chúng tôi. Trao đổi nhẹ nhàng trong bữa trưa hay tư vấn qua Slack đều được chào đón! Hãy cùng nhau hack nghiệp vụ bằng AI nhé!

### Liên hệ

- **AI Operations Room**: [Liên hệ qua Slack](https://cyberagent.enterprise.slack.com/archives/C06A63SPUUQ/p1741159999955789)
- **Next Expert**: [Tư vấn](https://experts.cyberagent.dev/archives/476)

---

## Thông tin bổ sung

### Liên hệ và góp ý

Nếu có câu hỏi về nội dung xác minh hoặc muốn yêu cầu xác minh nội dung nào đó, vui lòng liên hệ qua "[Yêu cầu đăng tải/Liên hệ](https://git-generative-ai.services.isca.jp/contact)".

Đối với câu hỏi về dịch vụ nội bộ, vui lòng liên hệ trực tiếp với dịch vụ tương ứng.

### Lưu ý quan trọng

> **Quy định và hướng dẫn**:
> - Trước khi sử dụng AI tạo sinh, vui lòng hoàn thành khóa "[Reskilling hiểu thấu đáo AI tạo sinh](https://cybar.cag.isca.jp/?p=100091)" và xác nhận các [Hướng dẫn](https://git-generative-ai.services.isca.jp/guideline/)
> - Việc sử dụng công cụ AI tạo sinh trong nghiệp vụ cần được đánh giá rủi ro bởi Pháp chế và SSG, và quyết định thuộc về các bộ phận kinh doanh
> - Vui lòng tuân theo [Hướng dẫn](https://git-generative-ai.services.isca.jp/guideline/) và có sự chấp thuận của cấp trên trước khi sử dụng
> - Để liên hệ Pháp chế và SSG, vui lòng truy cập [Security Portal](https://security-portal.ssg.isca.jp/inquiry)
> - Vui lòng cẩn thận khi xử lý text, hình ảnh, video được tạo
> - Do giới hạn nội bộ, toàn bộ nội dung đăng tải đều cấm chuyển tải lên SNS, v.v.
> - Nội dung bài viết là tại thời điểm đăng tải, công cụ được đề cập sử dụng cho mục đích xác minh

### Metadata

**Tác giả**: Jun Lee (李 俊浩) - AI Operations Room  
**Ngày xuất bản**: 11 tháng 12, 2025  
**Nguồn**: [ISCA Generative AI Portal - CyberAgent](https://git-generative-ai.services.isca.jp/article/business/bu035/)  
**Series**: [Evangelist JUN's AI Verification Series](https://git-generative-ai.services.isca.jp/author/a13973/)

**Tags**: `#Claude` `#Skills` `#DataVisualization` `#NoCode` `#Dashboard` `#Workflow` `#Automation` `#AI` `#Business` `#ProductivityTools`

---

*Bài viết được dịch và biên tập từ nguồn tiếng Nhật gốc. Mọi thông tin về dịch vụ, liên kết nội bộ và quy định tuân theo tổ chức CyberAgent.*
