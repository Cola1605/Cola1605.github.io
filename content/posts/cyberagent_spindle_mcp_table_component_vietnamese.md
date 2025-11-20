---
title: "Phát triển Spindle Component trong thời đại AI với Spindle MCP"
date: 2025-10-27
draft: false
categories: ["Web & Frontend", "AI & Machine Learning"]
tags: ["Spindle", "MCP", "Design-System", "Claude", "Cursor", "AI-Development", "Component-Library", "CyberAgent"]
description: "Câu chuyện phát triển Table component bằng cách kết hợp AI (Claude Code/Cursor) với Spindle MCP để đạt được tốc độ phát triển và chất lượng cao."
---

**Nguồn:** [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/59564/)  
**Tác giả:** yuuumin (湯本航基 / @yu_3in)  
**Ngày đăng:** 27/10/2025  

---

## Giới thiệu

Tôi là Yumoto Koki (@yu_3in), Web Frontend Engineer tại AmebaLIFE Business Division.

Bài viết này chia sẻ câu chuyện phát triển Table component bằng cách kết hợp AI (Claude Code / Cursor) với Spindle MCP - công cụ mà design system Spindle cung cấp. Đặc biệt, tôi sẽ giới thiệu **cách Spindle MCP đóng góp vào việc đồng thời đạt được tốc độ phát triển và chất lượng cao**, kèm theo các ví dụ sử dụng cụ thể.

---

## Về Spindle Table Component

Trước tiên, tôi xin giới thiệu ngắn gọn về Table component đã phát triển lần này.

Hãy thử xem và tương tác trực tiếp từ Storybook: https://ameba-spindle.web.app/?path=/docs/table--docs

### Vấn đề mà Table Component giải quyết

Table thoạt nhìn có vẻ đơn giản, nhưng lại có nhiều điểm vấp ngã khi triển khai:

- Áp dụng border radius
- Kết hợp cell merging với border
- Hành vi khi scroll ngang

Phải đối mặt với những vấn đề này mỗi lần thực sự rất phiền phức.

### Triết lý thiết kế của Spindle Table

Spindle Table component được phát triển với mục tiêu **làm wrapper cho `<table>` chuẩn Web**. Nó cung cấp "design pattern thường được sử dụng trong Ameba" đã giải quyết trước các vấn đề nêu trên.

Khi sử dụng như React component, có thể viết như sau:

```jsx
<Table.Frame borderTypes={['horizontal', 'outlined']} rounded striped>
  <Table.Caption>売上データ（2023年第4四半期）</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>商品名</Table.Head>
      <Table.Head align="right">売上（円）</Table.Head>
      <Table.Head align="center">前年比</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Head scope="row">商品A</Table.Head>
      <Table.Cell align="right">1,200,000</Table.Cell>
      <Table.Cell align="center">+12%</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Head scope="row">商品B</Table.Head>
      <Table.Cell align="right">980,000</Table.Cell>
      <Table.Cell align="center">-3%</Table.Cell>
    </Table.Row>
    {/* ... */}
  </Table.Body>
</Table.Frame>
```

Ví dụ, `<Table.Frame>` có các property như `borderTypes`, `rounded`, `striped`, v.v.

Component này sẽ hiển thị như sau: (xem ảnh minh họa trong bài gốc)

Chúng tôi cũng chuẩn bị nhiều pattern khác, chi tiết xem tại Storybook.

### Thiết kế có tính tùy biến cao

AmebaLIFE Business Division vận hành nhiều service khác nhau như Ameba Blog, Ameba Juku Sagashi (塾探し), Ameba Gakko Sagashi (学校探し), Ameba Choice, Dot Money, v.v. Vì mỗi service có yêu cầu design khác nhau như color set của table, nên chúng tôi thiết kế với **tính tùy biến cao** - điều ít thấy trong các Spindle component trước đây.

Cụ thể, chúng tôi **toàn diện cho phép ghi đè style bằng CSS Variables**. Dưới đây là ví dụ. Cơ bản là giả định tùy chỉnh cho toàn bộ product, nhưng cũng có thể tùy chỉnh từng table riêng lẻ:

```css
/* Tùy chỉnh toàn bộ product */
:root {
  --Table-head-backgroundColor: var(--color-surface-accent-primary);
  --Table-head-color: var(--color-text-high-emphasis-inverse);
}

/* Tùy chỉnh từng table riêng lẻ */
.custom-table {
  --Table-cell-padding: 16px 12px;
  --Table-borderRadius: 8px;
}
```

CSS Variables được phân loại và tổ chức thành 5 nhóm:

- **Surface** – Liên quan đến background
- **Text** – Liên quan đến text
- **Border** – Liên quan đến border
- **Layout** – Liên quan đến layout
- **Caption** – Liên quan đến caption

(Xem ảnh CSS Variables Reference - cho thấy có rất nhiều CSS Variables được chuẩn bị)

Nhờ đó, đã trở thành nền tảng chung giải quyết các điểm vấp ngã khi xử lý Table, đồng thời linh hoạt đáp ứng yêu cầu của từng product.

---

## Thực hành ứng dụng AI

Từ đây là phần chính. Tôi sẽ nói về việc ứng dụng AI và Spindle MCP trong phát triển Table component.

### Tổng quan quy trình phát triển

Phát triển diễn ra theo flow lớn như sau:

1. **Design Doc (thiết kế chi tiết)** (Cursor + Spindle MCP)
2. **Implementation** (Claude Code + Spindle MCP)
3. **Review & Adjustment**

Do có khoảng cách thời gian giữa lúc thiết kế và lúc triển khai, nên công cụ AI sử dụng khác nhau.

Nhờ có Spindle MCP (sẽ nói chi tiết bên dưới), Design Doc đã được hoàn thành trong thời gian ngắn. Chính sự triển khai cũng có độ chính xác sinh code từ Design Doc khá cao, đến mức đã có thể trình bày được thứ chạy được ngay từ giai đoạn review Design Doc.

Tất nhiên, có những phần cần điều chỉnh như chi tiết của `border`, nhưng nhờ AI đảm nhiệm phần nền tảng, tôi có thể tập trung vào xác nhận tính nhất quán với yêu cầu design và xử lý edge case.

### Sức mạnh của Spindle MCP

Spindle MCP là công cụ để giúp AI hiểu design system Spindle.

Về chi tiết, vui lòng xem bài viết: [Spindle MCP で変わるデザインシステムの開発 ~ Figma 連携で実現する超高速開発 ~](https://developers.cyberagent.co.jp/blog/archives/56844/)

#### 1. Ứng dụng trong tạo Design Doc

Khi tạo Design Doc, chủ yếu sử dụng các công cụ Spindle MCP sau:

##### `get_component_design_doc_template`

Lấy template của Design Doc, và nhờ AI tạo bản thảo đầu tiên dựa trên template đó.

##### `get_design_tokens` / `get_design_token`

Sử dụng trong section "CSS Variables Reference" của Design Doc để mapping CSS Variables với Design Token.

AI đã hiểu ý đồ của Design Token với độ chính xác nhất định, đạt được độ chính xác khá cao mà không cần phải giao reference khác thủ công. Nếu làm thủ công thì chắc chắn đã mất khá nhiều thời gian.

##### `get_accessibility_docs`

Trong Design Doc, nhờ AI sinh và review section accessibility tuân thủ Ameba Accessibility Guidelines. Sau khi triển khai, trước khi request review, cũng đã sử dụng công cụ này để kiểm tra accessibility như một phần của self-review.

##### `get_components` / `get_component_info`

Sử dụng khi sinh code ban đầu từ Design Doc. Vì Spindle có cách viết và rule riêng, nên đã chỉ thị tham khảo các component đại diện.

---

## Thách thức và bài học từ việc sử dụng AI

Mặc dù có thể phát triển nhanh chóng nhờ ứng dụng AI, vẫn có những thách thức.

### Độ chính xác sinh DO/DO NOT

Khi tạo Design Doc, section DO/DO NOT không sinh được tốt, phải điều chỉnh thủ công. Nguyên nhân chính khiến không thành công là do thiếu sự hiểu biết chung về "viết gì và ở mức độ chi tiết nào" trong DO/DO NOT.

### Chưa sử dụng Figma MCP

Lần này không sử dụng Figma MCP. Lý do là do có constraint không thể biểu diễn trực tiếp Table component trong Figma, và xét rằng khó sử dụng làm design data.

Đối với component có tính cấu trúc như Table, tôi cảm thấy thiết kế dựa trên text phù hợp hơn Figma.

---

## Tổng kết

Nhờ kết hợp Cursor/Claude Code với Spindle MCP, đã có thể phát triển Table component một cách **dễ dàng, nhanh chóng, và vẫn giữ được chất lượng**.

Đặc biệt, độ chính xác sinh code từ Design Doc rất cao, Storybook cũng tự động sinh được, giảm đáng kể công sức. Thực tế, Storybook có số lượng pattern nhiều đến mức browser bị đơ, nếu làm thủ công chắc đã mất cả ngày.

Khi việc ứng dụng AI tiến triển, tôi có thể dành thời gian cho thiết kế ở mức trừu tượng cao hơn thay vì chi tiết triển khai. Đặc biệt, việc có thể ý thức hơn về góc độ **"cung cấp loại component nào là tốt về lâu dài"** thực sự rất tốt.

Trong tương lai, chúng tôi sẽ tiếp tục theo đuổi trải nghiệm phát triển tốt hơn thông qua cộng tác với AI và MCP.

---

## Các điểm kỹ thuật quan trọng

### 1. Kiến trúc Spindle Design System

Spindle là design system nội bộ của CyberAgent cho hệ sinh thái Ameba, cung cấp UI component chung cho nhiều service:

- Ameba Blog
- Ameba Juku Sagashi (tìm lớp học thêm)
- Ameba Gakko Sagashi (tìm trường học)
- Ameba Choice
- Dot Money

### 2. Thiết kế Web Standards Compliant

Table component được thiết kế làm wrapper cho `<table>` chuẩn HTML, tuân thủ Web standards:
- Tham chiếu: https://html.spec.whatwg.org/multipage/tables.html#the-table-element
- Cấu trúc: Frame → Caption → Header/Body → Row → Head/Cell
- Properties: borderTypes, rounded, striped

### 3. CSS Variables Architecture cho tùy biến

Hệ thống CSS Variables phân loại 5 nhóm cho phép tùy chỉnh linh hoạt:
- **Surface:** Background colors, gradients
- **Text:** Font, color, alignment
- **Border:** Width, color, style, radius
- **Layout:** Padding, spacing, dimensions
- **Caption:** Caption-specific styling

Hai cấp độ tùy chỉnh:
- **Product-wide:** Qua `:root` selector
- **Individual table:** Qua class selector cụ thể

### 4. AI Development Workflow

**Phase 1 - Design Doc (Cursor + Spindle MCP):**
- Template-based generation
- Design Token mapping automation
- Accessibility guidelines compliance check
- Component pattern reference

**Phase 2 - Implementation (Claude Code + Spindle MCP):**
- High-precision code generation from Design Doc
- Auto-generated Storybook with massive patterns
- Working demo ready at review stage

**Phase 3 - Manual Review:**
- Border detail fine-tuning
- Edge case handling
- Design alignment verification

### 5. Spindle MCP Tools chi tiết

**`get_component_design_doc_template`**
- Lấy template Design Doc chuẩn
- AI tạo bản thảo ban đầu từ template

**`get_design_tokens` / `get_design_token`**
- Mapping CSS Variables ↔ Design Tokens
- AI hiểu ý đồ Design Token tự động
- Tiết kiệm thời gian mapping thủ công

**`get_accessibility_docs`**
- Sinh section accessibility tuân thủ Ameba Accessibility Guidelines
- URL: https://a11y-guidelines.ameba.design/
- Sử dụng cho cả Design Doc và self-review

**`get_components` / `get_component_info`**
- Tham chiếu component đại diện
- Học pattern và rule riêng của Spindle
- Sinh code ban đầu chính xác cao

### 6. Kết quả đạt được

**Tốc độ:**
- Design Doc hoàn thành nhanh
- Storybook tự động sinh (nhiều pattern đến mức browser đơ)
- Tiết kiệm đáng kể công sức (nếu thủ công sẽ mất cả ngày)

**Chất lượng:**
- Code generation chính xác cao từ Design Doc
- Working demo sẵn sàng ở giai đoạn review
- Tuân thủ accessibility guidelines
- Web standards compliant

**Tư duy phát triển:**
- Chuyển từ "làm thế nào triển khai" sang "cung cấp component gì tốt nhất"
- Tập trung vào thiết kế mức cao thay vì chi tiết implementation
- Ý thức về chiến lược component dài hạn

### 7. Thách thức gặp phải

**DO/DO NOT Section:**
- AI không sinh tốt phần này
- Cần định nghĩa rõ "viết gì" và "mức độ chi tiết"
- Thiếu common understanding trong team

**Figma MCP:**
- Không phù hợp cho component cấu trúc như Table
- Constraint của Figma trong biểu diễn table
- Text-based design phù hợp hơn cho trường hợp này

---

## Bài học rút ra

1. **Spindle MCP tăng tốc đáng kể việc tạo Design Doc** với độ chính xác cao
2. **AI xử lý nền tảng, developer tập trung vào design thinking** - thay đổi cách làm việc
3. **CSS Variables architecture** cho phép tùy biến linh hoạt mà vẫn giữ nền tảng chung
4. **Text-based design phù hợp hơn Figma** cho component cấu trúc
5. **AI + MCP chuyển focus** từ "how to implement" sang "what to provide"
6. **Storybook auto-generation** tiết kiệm hàng giờ làm việc thủ công
7. **Common understanding vẫn cần thiết** cho một số phần như DO/DO NOT

---

## Tài liệu tham khảo

- **Storybook:** https://ameba-spindle.web.app/?path=/docs/table--docs
- **Spindle MCP GitHub:** https://github.com/openameba/spindle/tree/main/packages/spindle-mcp-server#readme
- **Spindle MCP chi tiết:** https://developers.cyberagent.co.jp/blog/archives/56844/
- **Ameba Accessibility Guidelines:** https://a11y-guidelines.ameba.design/
- **HTML Table Spec:** https://html.spec.whatwg.org/multipage/tables.html#the-table-element

---

## Kết luận

Bài viết trình bày một case study thực tế về việc kết hợp AI tools (Cursor, Claude Code) với Spindle MCP để phát triển Table component cho design system Spindle. Điểm nổi bật là:

**Về công nghệ:**
- CSS Variables architecture cho tính tùy biến cao
- Web standards compliant wrapper design
- MCP tools integration cho AI-assisted development

**Về quy trình:**
- Template-based Design Doc generation
- High-accuracy code generation
- Automatic Storybook creation
- Accessibility compliance automation

**Về tư duy:**
- Chuyển từ implementation details sang design thinking
- Ý thức về chiến lược component dài hạn
- Focus vào "what to provide" thay vì "how to implement"

**Về productivity:**
- Giảm đáng kể thời gian phát triển
- Storybook auto-generation tiết kiệm hàng giờ
- Maintain chất lượng cao trong khi tăng tốc độ

Đây là ví dụ xuất sắc về cách AI và MCP có thể thay đổi quy trình phát triển design system, không chỉ tăng tốc độ mà còn nâng cao chất lượng tư duy thiết kế.
