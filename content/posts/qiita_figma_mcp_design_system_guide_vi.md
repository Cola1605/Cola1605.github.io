---
title: "Lý do tại sao nên sử dụng components Design System để thiết kế Figma trong thời đại có Figma MCP"
date: 2025-10-03T07:00:00+07:00
categories: ["Design", "Development Tools", "Technology"]
tags: ["Figma", "MCP", "Design System", "Next.js", "UI/UX", "Components"]
description: "Khám phá cách sử dụng components Design System với Figma MCP để tối ưu hóa quy trình thiết kế và phát triển"
---

# Lý do tại sao nên sử dụng components Design System để thiết kế Figma trong thời đại có Figma MCP

**Tác giả:** @itohisahideki (jp たろう)  
**Xuất bản:** 2025-04-11  
**Nguồn:** [Qiita](https://qiita.com/itohisahideki/items/10d88cfba173daae72dd)  
**Likes:** 5 | **Stocks:** 1

---

## Mở đầu

Gần đây, Model Context Protocol (MCP) đang được thảo luận sôi nổi và đã có hơn 2000 dịch vụ xây dựng MCP server. MCP là một giao thức cho phép các LLM như Claude truy cập trực tiếp vào các dịch vụ bên ngoài như Notion, Figma. Để hiểu chi tiết về MCP, có thể tham khảo các bài viết sau:

- Model Context Protocol (MCP) là gì
- Nhập môn Model Context Protocol

Trong số đó, đặc biệt chú ý đến việc hỗ trợ Figma. Trong việc implement UI sử dụng LLM truyền thống, người ta thường sử dụng phương pháp truyền screenshot UI cho LLM, nhưng với sự xuất hiện của MCP, LLM có thể truy cập trực tiếp vào Figma để kiểm tra design. Đây là một tiến bộ lớn về mặt context, giúp tái hiện chính xác hơn cấu trúc phân cấp và gap/padding/margin.

Gần đây, bài viết sau đây đang thu hút sự chú ý:

Trong bài viết này, họ báo cáo rằng khả năng coding sử dụng design system của công ty bởi LLM đã được cải thiện đáng kể khi cung cấp context về design system của công ty cho LLM.

## MCP × Figma có hiệu quả với developer cá nhân không?

Một câu hỏi đã nảy sinh. Bản chất của bài viết này là "có thể xác định component tương ứng giữa component được sử dụng trong Figma và component của design system, và xác định props truyền vào component đó".

Hầu hết các developer cá nhân không có design system riêng mà thường sử dụng các thư viện như Material UI (MUI) hoặc Chakra UI. Liệu những developer như vậy có thể nhận được lợi ích tương tự không?

Tôi nghĩ là có thể. Các design system phổ biến như MUI có công khai file Figma của các component:

Do đó, tôi nghĩ rằng nếu design bằng Figma component của MUI và cung cấp design đó cho LLM thông qua MCP, có thể đạt được hiệu quả tương tự như các trường hợp của doanh nghiệp, nên đã tiến hành thí nghiệm.

## Phương pháp thí nghiệm

Tôi đã tiến hành thí nghiệm so sánh với hai cách tiếp cận sau:

1. Sử dụng screenshot của Figma để tái hiện UI
2. Sử dụng Figma MCP để tái hiện UI

Cả hai đều sử dụng design Figma được xây dựng bằng component của MUI.

Cũng nên thí nghiệm với figma được xây dựng không sử dụng component của MUI, nhưng do hạn chế về thời gian nên lần này không bao gồm. Dự định sẽ tiến hành thí nghiệm bổ sung và cập nhật bài viết sau.

## Kết quả

### Quy trình thí nghiệm

Đầu tiên, tạo project Next.js cơ bản:

Tiếp theo, đưa MUI vào:

### Kết quả implementation dựa trên screenshot

Kết quả được tạo ra khi truyền hình ảnh cho Cursor:

Mặc dù có ảnh hưởng từ cách truyền hình ảnh, nhưng đã xuất hiện nhiều sự khác biệt ở các chi tiết. Có thể thấy các ví dụ về việc sử dụng component khác với ý định hoặc không sử dụng component mà lẽ ra nên sử dụng. Ví dụ, design của label bắt buộc và phần upload file khác nhau:

### Kết quả implementation sử dụng Figma MCP

Tiếp theo, đã tạo bằng cách cho Cursor đọc trực tiếp Figma:

Đã thấy cải thiện đáng kể. Điểm đáng chú ý là component giống hệt với MUI component được sử dụng trong Figma đã được sử dụng một cách chính xác.

Các component phức hợp được tạo bằng cách kết hợp nhiều component trong Figma cũng có thể được implement bằng cách kết hợp component một cách chính xác (mặc dù text đã được nhật bản hóa nhưng về mặt chức năng không có vấn đề):

Design upload file cũng được tái hiện chính xác:

## Vấn đề về chỉ định Props

Mặc dù component được chọn đúng, nhưng vẫn còn vấn đề là props được truyền vào có phần khác biệt (ví dụ: size="small" hoặc variant của Typography). Do đó, tôi đã thử đưa ra chỉ dẫn bổ sung:

Đã được sửa chữa đúng ở một mức độ nào đó, nhưng vẫn còn chỗ cần cải thiện. Đặc biệt là việc sử dụng sx property nổi bật. Trong MUI, ở chỗ nên sử dụng standard props như size="small", lại thấy implementation như chỉ định trực tiếp fontSize bằng sx. Để duy trì tính thống nhất của design, muốn tránh việc sử dụng sx không cần thiết.

Trong component MUI chính thức của Figma, có thể sửa đổi design với cảm giác thao tác như truyền props như hình ảnh sau:

## Điều tra dữ liệu được inject bởi MCP

Đã điều tra xem dữ liệu nào được inject bởi Figma MCP:

Trong trường hợp MUI, phần name của hierarchy trở thành tên component. Điều này có vẻ như cho phép sử dụng component đúng.

Tuy nhiên, setting được truyền như props trên Figma được đặt như biến textStyle: style_0KBETQ, và nó được định nghĩa như global_values trong JSON:

## Thử cải thiện

Chỉ đưa ra gợi ý không sử dụng sx và thử challenge lại trong chat mới:

Kết quả:

Đã cải thiện một phần. Đặc biệt, variant như body1 truyền cho Typography đã được áp dụng đúng. Tuy nhiên, props như size="small" đưa cho SelectBox vẫn chưa được áp dụng:

## Kết luận và xem xét

Kết quả thí nghiệm đã xác nhận rằng việc đọc design Figma được xây dựng bằng Figma component của MUI có thể xây dựng UI sử dụng MUI với độ chính xác khá cao. Đặc biệt trong việc lựa chọn component đã cho thấy độ chính xác rất cao.

Tuy nhiên, việc tái hiện hoàn toàn props vẫn còn chỗ cần cải thiện. Nếu có thể làm cho dữ liệu được inject bao gồm cả tên props, sẽ có thể tái hiện UI hoàn hảo hơn.

Đây là một khám phá lớn đối với developer như tôi, người không dành thời gian cho việc tạo design chi tiết trong Figma. Có thể nói rằng việc tạo design trong Figma đã trở thành tạo ra giá trị gần như tương đương với coding.

Từ quy trình phát triển truyền thống mà xây dựng UI là bottleneck, có thể tập trung nhiều hơn vào implementation logic phía sau, từ đó kỳ vọng cải thiện hiệu quả phát triển. Ngoài ra, nếu có MCP server có thể truyền thông tin theme của MUI v.v. hiệu quả hơn, trải nghiệm phát triển sẽ được cải thiện hơn nữa.

## Vấn đề còn lại: Component cấp Organism

Vẫn còn vấn đề quan trọng. Component được cung cấp bởi thư viện như MUI hầu hết là cấp nguyên tử (Atom) hoặc phân tử (Molecule). Trong các project quy mô lớn hoặc hệ thống chuyên biệt cho lĩnh vực cụ thể, thường tạo và sử dụng component cấp sinh vật (Organism) riêng cần kiến thức domain bằng cách kết hợp các component cơ bản này.

Trong trường hợp như vậy, mặc dù có thể xác định component cơ bản, có khả năng không thể sử dụng component Organism cụ thể của project một cách thích hợp.

Một trong những giải pháp được xem xét là làm cho tên component Organism được tạo bằng MUI component trong Figma khớp với tên component Organism trong thư mục project thực tế. Bằng cách chỉ dẫn rule của Cursor "Khi tìm thấy component trong Figma, nếu có component cùng tên do project cung cấp thì sử dụng nó", có khả năng có thể tìm ra và sử dụng component Organism đúng.

Về phương pháp này cũng dự định tiến hành thí nghiệm trong tương lai.

## Triển vọng tương lai

Như bước tiếp theo, đang xem xét các nỗ lực sau:

### Tạo MCP server cho design system riêng

Khác với MUI, design system riêng không có context cho LLM, nên muốn tạo MCP server tham khảo bài viết của Ubie. Trong trường hợp của tôi đang xây dựng design system sử dụng Storybook, nên sẽ khám phá khả năng của MCP server sử dụng Storybook.

### Mở rộng MCP server cho MUI

Phát triển MCP server để truyền thông tin props và theme của MUI một cách hiệu quả.

### Giải quyết vấn đề component Organism

Thực tế xác minh vấn đề về component Organism đã nêu ở trên.

### Xây dựng Figma component hiệu quả

Hướng tới việc tạo Figma component có thể tái hiện MUI hiệu quả. Đặc biệt xem xét việc xây dựng Figma component sao cho tên props được bao gồm trực tiếp trong dữ liệu inject.

Thông qua các nỗ lực trên, sẽ khám phá khả năng mới của phát triển UI sử dụng MCP và Figma, hướng tới cải thiện hiệu quả phát triển hơn nữa.