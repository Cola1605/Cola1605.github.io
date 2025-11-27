---
title: "Tìm nguyên nhân gốc rễ vượt xa mối tương quan: Sử dụng Network Digital Twin Graph và Agentic AI"
date: 2025-11-27
draft: false
categories: ["Cloud", "AWS", "AI and Machine Learning"]
tags: ["Network Digital Twin", "Agentic AI", "RCA", "Neptune", "Graph Database", "NTT DOCOMO"]
author: "Dr. Imen Grida Ben Yahya, Brad Bebee, Naveen Kumar, Yuki Miyazaki, Kazuo Maejima, Satoru Imai"
translator: "Yuki Miyazaki (Solutions Architect)"
---

# Tìm nguyên nhân gốc rễ vượt xa mối tương quan: Sử dụng Network Digital Twin Graph và Agentic AI

**Tác giả:** Dr. Imen Grida Ben Yahya, Brad Bebee, Naveen Kumar H M, Yuki Miyazaki, Kazuo Maejima, Satoru Imai  
**Người dịch:** Yuki Miyazaki (Solutions Architect)  
**Ngày xuất bản:** 27 tháng 11, 2025  
**Danh mục:** Database, Amazon Neptune, Telecommunications, AI/ML  
**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/beyond-correlation-finding-root-causes-using-a-network-digital-twin-graph-and-agentic-ai/)

---

## Giới thiệu

Khi xảy ra sự cố mạng phức tạp, cần phải xem xét nhiều cảnh báo có mối tương quan với nhau, nhưng những cảnh báo này thường chỉ cho thấy triệu chứng chứ không phải vấn đề thực sự của sự cố, và việc xác định nguyên nhân gốc rễ có thể mất nhiều giờ điều tra.

Các hệ thống phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA) truyền thống thường dựa trên các quy tắc được định nghĩa, ngưỡng tĩnh và các mẫu được xác định trước, không thể xử lý tất cả các trường hợp. Khi khắc phục sự cố ở cấp độ mạng hoặc suy giảm ở cấp độ dịch vụ, những bộ quy tắc nghiêm ngặt này không thể thích ứng với các sự cố dây chuyền hoặc sự phụ thuộc phức tạp.

## Thách thức trong phân tích nguyên nhân gốc rễ (RCA)

Trong lĩnh vực viễn thông, RCA được 3GPP định nghĩa là "quy trình có hệ thống để xác định sự cố gây ra nhiều lỗi", và GSMA định nghĩa là "phương pháp có cấu trúc để xác định và xử lý nguyên nhân gốc rễ thay vì chỉ xử lý triệu chứng".

RCA trong lĩnh vực viễn thông đã được thực hiện trong nhiều thập kỷ, chủ yếu bằng cách rút ra mối quan hệ giữa các cảnh báo, chỉ số hiệu suất chính (KPI), log và các telemetry khác, sau đó đưa các đặc trưng thu được vào pipeline machine learning (ML) và deep learning (DL).

Trong thực tế ngày nay, quá trình xác định sự cố mất nhiều thời gian, và thời gian trung bình để xác định nguyên nhân gốc rễ thường là vài giờ, không đủ cho hoạt động mạng hiện đại. RCA sai dẫn đến việc phân bổ nhân lực để xử lý các phần không phải là nguyên nhân gốc rễ thực sự, đây là một trong những yếu tố do sự can thiệp của người vận hành hiện trường.

## Từ tương quan đến nhân quả

Thông qua hợp tác với NTT DOCOMO về RCA trong mạng truy cập vô tuyến (RAN) và mạng truyền tải, cũng như hợp tác với khách hàng và đối tác trên toàn thế giới, chúng tôi đã xem xét lại nỗ lực phân tích nguyên nhân gốc rễ và tập trung vào việc nắm bắt mối quan hệ nhân quả thực sự thay vì chỉ là tương quan.

Cách tiếp cận của chúng tôi dựa trên nguyên tắc thống kê đã biết rằng "tương quan không hàm ý nhân quả". Tương quan đo lường mức độ liên kết chặt chẽ của hai biến, trong khi nhân quả cho biết sự thay đổi của một biến ảnh hưởng đến sự thay đổi của biến khác như thế nào.

### Network Digital Twin là gì

Network Digital Twin được cấu trúc thành đồ thị là gì? Hãy coi nó như một bản sao thời gian thực của mạng, tức là một mô phỏng không chỉ hiển thị trạng thái hiện tại mà còn dự đoán điều gì sẽ xảy ra tiếp theo.

Bằng cách nắm bắt mối quan hệ nhân quả của mạng thông qua Network Digital Twin, bạn có thể dự đoán và mô phỏng hành vi tương lai của mạng. Điều này được thực hiện thông qua phát hiện bất thường, dự đoán dựa trên đồ thị và generative AI, được thực thi thông qua luồng hoạt động của Agentic AI để hiểu hành vi mạng.

### Cách hoạt động

1. Thu thập và phân tích các phụ thuộc mạng (mối quan hệ giữa các node), cảnh báo đang xảy ra và KPI (như dữ liệu lưu lượng) từ nhiều nguồn dữ liệu trên tất cả các phân đoạn và lớp mạng.

2. Chuyển đổi chúng thành cấu trúc dữ liệu đồ thị có xem xét topology, được gọi là Network Knowledge Layer.

3. Tại Agentic AI Layer, dữ liệu mạng đầu vào được phân tích bằng cách kết hợp các thuật toán phân tích đồ thị và deep learning trên đồ thị, khởi động một hoặc nhiều RCA Runbook chuyên dụng dựa trên dữ liệu.

## Kiến trúc giải pháp

### Network Knowledge Layer

Network Knowledge Layer tích hợp tất cả dữ liệu và thông tin liên quan đến mạng, chuyển đổi chúng thành định dạng có cấu trúc có thể truy vấn, tạo thành nền tảng dữ liệu tích hợp cho phân tích, machine learning, deep learning và ra quyết định tại agent layer.

### Agentic AI Layer

Network Knowledge là nền tảng mà Amazon Neptune lưu giữ topology mạng thay đổi động, được tăng cường bởi dữ liệu thời gian thực từ cảnh báo, KPI, lịch sử sự cố và luồng telemetry.

Giải pháp này hoạt động với các agent chính sau:

- **RCA operator**: Phát hiện từng trigger, chọn Runbook tương ứng và chỉ định agent khởi động
- **Known-incident matcher**: Phân tích các sự cố khớp từ Incident Knowledge Base
- **Dependency graph builder**: Trích xuất subgraph của node phát sinh cảnh báo
- **Root-cause finder**: Xếp hạng các node mạng bằng thuật toán phân tích đồ thị của Neptune Analytics
- **Anomaly correlator**: Gọi endpoint phát hiện bất thường của Amazon SageMaker và đánh dấu giá trị bất thường
- **Forecast-drift monitor**: Truy vấn endpoint dự đoán ST-GNN và phát hiện độ lệch so với giá trị dự đoán
- **Recent-events collector**: Lấy cảnh báo hoặc KPI trong T phút cuối của node nghi vấn
- **MoP analyzer**: Phát hiện loại thiết bị, nhà cung cấp, phiên bản phần mềm và xuất lệnh phân tích
- **Incident-report builder**: Kết hợp node nghi vấn, timeline và MoP để tạo log sự cố có cấu trúc
- **Ticket manager**: Tạo hoặc cập nhật ticket sự cố
- **Operator feedback recorder**: Ghi lại phản hồi từ NOC
- **Guardrails policy advisor**: Áp dụng guardrails như PII, firmware được phê duyệt, thời gian thực thi

### 4 mẫu thiết kế Runbook

#### Runbook 1: Baseline - Phân tích đồ thị và Agentic AI

Khi cảnh báo xảy ra, hàm AWS Lambda chuyên dụng được xây dựng cho phân tích nguyên nhân gốc rễ sẽ được kích hoạt. Các bước cụ thể và có thể thực thi của thuật toán Neptune Analytics bao gồm:

- Phân tách đồ thị bằng WCC (Weakly Connected Component) hoặc SCC (Strongly Connected Component)
- Phân cụm đồ thị bằng label propagation
- Xếp hạng node mạng bằng thuật toán centrality

Trong Runbook này, cảnh báo là trigger cơ bản, vùng sự cố được xác định bằng phân tích đồ thị - một phương pháp xác định, và điểm số ban đầu được cập nhật thành bản ghi sự cố hữu ích thông qua vòng lặp phản hồi liên tục bởi Agentic AI.

#### Runbook 2: Pattern matching cảnh báo đã biết bởi Agent

Sử dụng phương thức trigger dựa trên chức năng cảnh báo như phát hiện đỉnh hoặc mẫu bất thường trong luồng nhận. Điều này bao gồm giám sát số lượng cảnh báo, độ lệch Z-score từ baseline, phân cụm mức độ nghiêm trọng của cảnh báo và các trường hợp sự cố dây chuyền.

Bước đầu tiên là Incident Knowledge Base. Nếu mẫu hoặc chuỗi cảnh báo nhận được khớp với sự cố trong quá khứ với xác suất cao, agent sẽ cập nhật hoặc mở ticket và cung cấp phương pháp xử lý đã được định nghĩa.

#### Runbook 3: RCA phát hiện bất thường kết hợp nhiều tín hiệu (Phát hiện tín hiệu yếu)

Cảnh báo vẫn là tín hiệu chính, nhưng điểm số phát hiện bất thường dựa trên KPI thời gian thực cho phép phát hiện bất thường mạng tốt hơn.

Agentic AI workflow được kích hoạt bởi sự kết hợp của node phát sinh cảnh báo và node cho thấy bất thường. Phương pháp kết hợp này cho phép NOC phát hiện bất thường ngay cả với những dấu hiệu không rõ ràng (tín hiệu yếu) trước khi phát hiện bằng cảnh báo.

#### Runbook 4: RCA phát hiện độ lệch từ dự đoán (Phát hiện chủ động)

Cảnh báo hoạt động như tín hiệu cơ bản, nhưng cờ cho biết độ lệch so với giá trị dự đoán KPI được cung cấp từ Attention-based Spatio-Temporal Graph Neural Network (AST-GNN) dạng rolling.

Mô hình này học tích hợp topology và mẫu thời gian cho từng thiết bị mạng, tạo ra dự đoán bao gồm khoảng tin cậy cho mỗi KPI. Khi KPI thực tế nằm ngoài khoảng dự đoán, hệ thống sẽ đặt cờ độ lệch ngay cả khi giá trị tuyệt đối là bình thường.

Phương pháp dự đoán này cho phép NOC phát hiện bất thường trước khi vấn đề tiềm ẩn trở nên rõ ràng.

## Network Digital Twin sử dụng Graph Data của NTT DOCOMO

NTT DOCOMO vận hành mạng viễn thông phục vụ hơn 89 triệu thuê bao trên toàn Nhật Bản. Mạng này là một phần của cơ sở hạ tầng quan trọng quốc gia, vận chuyển dữ liệu thanh toán, logistics và các dữ liệu nhạy cảm về thời gian khác, đòi hỏi giải quyết nhanh chóng khi xảy ra sự cố.

### Triển khai

NTT DOCOMO đã bắt đầu chuyển đổi quy trình RCA, nhắm vào mạng truyền tải và 4G / 5G RAN. Dữ liệu được đưa vào AWS bao gồm dữ liệu hiệu suất mạng 5 phút một lần và cảnh báo dựa trên sự kiện bao phủ toàn bộ đường dẫn từ mạng truyền tải đến trạm gốc vô tuyến.

MVP của NTT DOCOMO tuân thủ Runbook 1. MVP này hiện đang được mở rộng để Agentic AI vượt ra khỏi khung agent tĩnh và tích hợp chức năng phát hiện bất thường, hướng tới Runbook 3.

### Data Pipeline

1. Dữ liệu Performance Management (PM) và dữ liệu Fault Management (FM) được thu thập từ mạng truyền tải và RAN 5 phút một lần vào AWS và lưu trữ trong bucket Amazon S3.

2. AWS Lambda kích hoạt job Amazon Glue.

3. Job Amazon Glue phân tích dữ liệu thô và chuyển đổi sang định dạng cần thiết để load dữ liệu vào Amazon Neptune. Các file đã chuyển đổi được lưu trong bucket S3.

4. Một AWS Lambda khác gọi API Neptune bulk loader và tự động import dữ liệu đồ thị mới. Không cần can thiệp thủ công.

### Kết quả

NTT DOCOMO bắt đầu với thực thi on-demand làm trigger cho RCA. Với trigger là số lượng cảnh báo nghiêm trọng cao đạt đến số lượng bất thường, RCA pipeline khởi động, load các cảnh báo đó vào Digital Twin (Graph DB) và thực thi thuật toán phân tích đồ thị.

Các node nghi vấn được làm nổi bật bằng mã màu trên topology mạng, đạt được **Thời gian trung bình xác định nghi vấn (MTTD) là 15 giây**.

Network Digital Twin sử dụng graph data của NTT DOCOMO mang lại lợi ích cho nhóm NOC:

1. Khám phá và tìm kiếm topology mạng được đồ thị hóa được duy trì như data pipeline
2. Hiển thị thời gian thực trạng thái mạng động bằng KPI và cảnh báo (knowledge graph thay đổi theo thời gian)
3. Trích xuất node nghi vấn dựa trên phân tích đồ thị

## Quan điểm khoa học trong lĩnh vực RCA và sự nổi lên của Graph Data

Phân tích nguyên nhân gốc rễ (RCA) của mạng di động và mạng phần mềm đã trải qua 4 giai đoạn tập trung vào graph data:

### Giai đoạn 1: Kỷ nguyên tương quan cảnh báo (2011 - 2014)

Đồ thị dữ liệu cảnh báo phân cấp đã tổng hợp hàng chục nghìn cảnh báo thô thành một chuỗi nhân quả duy nhất trong vài phút.

### Giai đoạn 2: Kỷ nguyên tự mô hình hóa (2015 - 2017)

Đồ thị biểu diễn phụ thuộc được tạo thời gian thực từ controller Software-Defined Network (SDN) hoặc Network Function Virtualization (NFV) cho phép xác định sự cố trong vòng dưới 30 giây với độ chính xác 95%.

### Giai đoạn 3: Kỷ nguyên log mining và ML có thể giải thích (2020)

Cấu trúc Directed Interval Graph - Directed Acyclic Graph (DIG-DAG) đã streaming cảnh báo 4G và 5G thành subgraph biểu diễn quan hệ nhân quả có thể truy vấn.

### Giai đoạn 4: Kỷ nguyên Deep Graph Learning (2022 - 2024)

Graph Neural Network (GNN) học cấu trúc đồ thị đã ước tính các liên kết giữa các cell ẩn, cải thiện F1 score 15% khi thiếu metrics.

## Triển vọng tương lai

Bài viết này giới thiệu giải pháp Network Digital Twin sử dụng graph data và Agentic AI. Chúng tôi cũng đã giải thích về data foundation layer của Amazon Neptune lưu trữ topology mạng thời gian thực, cảnh báo và KPI.

Giải pháp này cung cấp 4 Runbook từ phân tích tương quan cảnh báo cơ bản đến dự đoán KPI, mỗi Runbook thực thi RCA bởi Agentic AI chuyên biệt.

### Kế hoạch tương lai

- **Cập nhật blog kỹ thuật chi tiết hơn**: Sắp công bố 4 blog mô tả phương pháp triển khai. Mỗi blog sẽ đề cập đến 1 Runbook bao gồm kịch bản mạng và mẫu code, giới thiệu phương pháp triển khai thực tế.

- **Triển khai vào vận hành thương mại tại NTT DOCOMO**: Tiếp tục hợp tác với nhóm vận hành, thêm tính năng mới và mở rộng sang các domain mạng khác và service layer.

- **Mở rộng partnership**: Hiện đang hợp tác với nhiều khách hàng và đối tác để phát triển giải pháp phân tích nguyên nhân gốc rễ.

---

## Về các tác giả

**Dr. Imen Grida Ben Yahya** là Principal AI/ML Specialist tại AWS. Tham gia thiết kế và xây dựng pipeline machine learning/deep learning/generative AI cloud-native áp dụng cho mạng (khả năng quan sát, phân tích nguyên nhân gốc rễ, hệ thống khuyến nghị, hệ thống vòng kín), đã viết hơn 60 bài báo khoa học về machine learning/deep learning.

**Brad Bebee** là Director tại AWS, cũng là General Manager của Amazon Neptune (managed graph database) và Timestream (managed time series database).

**Naveen Kumar H M** là DevOps Consultant chuyên về container solutions và cloud-native architecture.

**Yuki Miyazaki (宮崎 友貴)** là Solutions Architect tại AWS Japan. Hỗ trợ các nhà khai thác viễn thông xây dựng giải pháp sáng tạo tái định nghĩa ngành viễn thông bằng cách tận dụng AWS.

**Kazuo Maejima (前島 一夫)** là người chịu trách nhiệm về tự động hóa và hiển thị vận hành mạng viễn thông tại NTT DOCOMO.

**Satoru Imai (今井 識)** là Manager kiêm Technical Lead của nhóm DevOps phụ trách giám sát và khả năng quan sát dịch vụ mạng viễn thông tại NTT DOCOMO.

Bài dịch được thực hiện bởi Solutions Architect Yuki Miyazaki.
