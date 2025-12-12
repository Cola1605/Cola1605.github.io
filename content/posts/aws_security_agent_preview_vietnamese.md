---
title: "AWS Security Agent: Bảo Vệ Ứng Dụng Chủ Động Từ Thiết Kế Đến Triển Khai (Preview)"
date: 2025-12-12T10:00:00+07:00
slug: "aws-security-agent-preview"
categories: ["Business and Technology", "Development"]
tags: ["AWS", "Security", "DevSecOps", "AI Agent", "Application Security", "Penetration Testing", "SAST", "DAST", "Cloud Security"]
description: "Giới thiệu AWS Security Agent - frontier agent bảo vệ ứng dụng chủ động từ thiết kế đến triển khai với design review, code review tự động và penetration testing theo yêu cầu."
draft: false
---

![AWS Security Agent Setup](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/18/1211213423442380-1.png)

## Giới Thiệu

Vào ngày 2 tháng 12 năm 2025, AWS đã công bố phiên bản preview của **AWS Security Agent** - một frontier agent bảo vệ ứng dụng chủ động trong suốt vòng đời phát triển. Agent này thực hiện các đánh giá bảo mật ứng dụng tự động được tùy chỉnh theo yêu cầu của tổ chức, cung cấp kiểm tra thâm nhập theo bối cảnh theo yêu cầu. Nó đảm bảo bảo mật liên tục cho ứng dụng của bạn từ thiết kế đến triển khai.

## Thách Thức Hiện Tại

### Giới Hạn Của Công Cụ Bảo Mật Truyền Thống

**Công cụ Static Application Security Testing (SAST)** kiểm tra mã nguồn mà không có ngữ cảnh runtime, trong khi **công cụ Dynamic Application Security Testing (DAST)** đánh giá ứng dụng đang chạy mà không có ngữ cảnh cấp độ ứng dụng. Cả hai loại công cụ này đều một chiều vì chúng không hiểu ngữ cảnh của ứng dụng. Chúng không hiểu ứng dụng được thiết kế như thế nào, đối mặt với những mối đe dọa bảo mật nào, hoặc chạy ở đâu và như thế nào.

### Nút Thắt Của Đánh Giá Thủ Công

Điều này buộc các nhóm bảo mật phải xác minh thủ công mọi thứ, gây ra sự chậm trễ. Kiểm tra thâm nhập thậm chí còn tốn thời gian hơn. Bạn phải đợi vài tuần cho đến khi nhà cung cấp bên ngoài hoặc nhóm bảo mật nội bộ tìm được thời gian. Khi mọi ứng dụng đều yêu cầu đánh giá bảo mật thủ công và kiểm tra thâm nhập, backlog tăng nhanh chóng.

### Khoảng Cách Giữa Tần Suất Phát Hành Và Đánh Giá Bảo Mật

Ứng dụng phải đợi hàng tuần hoặc hàng tháng để xác minh bảo mật trước khi khởi chạy. Điều này tạo ra khoảng cách giữa tần suất phát hành phần mềm và tần suất đánh giá bảo mật.

**Số liệu thống kê**:
- **Hơn 60% tổ chức** cập nhật ứng dụng web hàng tuần hoặc thường xuyên hơn
- **Gần 75%** kiểm tra ứng dụng web hàng tháng hoặc ít thường xuyên hơn
- **81% tổ chức** cố ý triển khai mã dễ bị tấn công để đáp ứng deadline (Báo cáo Checkmarx 2025)

Khi bảo mật không được áp dụng cho toàn bộ danh mục ứng dụng, khách hàng bị đặt vào tình huống rủi ro, buộc các tổ chức phải cố ý phát hành mã dễ bị tấn công để đáp ứng deadline.

## Đặc Điểm Của AWS Security Agent

AWS Security Agent nhận thức ngữ cảnh và hiểu toàn bộ ứng dụng. Nó hiểu thiết kế ứng dụng, mã nguồn và các yêu cầu bảo mật cụ thể. Nó tự động quét liên tục các vi phạm bảo mật và thực hiện kiểm tra thâm nhập ngay lập tức theo yêu cầu mà không cần lên lịch.

### Phương Pháp Nhận Thức Ngữ Cảnh

Penetration testing agent tạo kế hoạch tấn công tùy chỉnh dựa trên ngữ cảnh được học từ các yêu cầu bảo mật, tài liệu thiết kế và mã nguồn, đồng thời điều chỉnh động trong runtime dựa trên những gì nó phát hiện - bao gồm endpoints, status codes, error codes, credentials. Điều này cho phép phát hiện các lỗ hổng nghiêm trọng và tinh vi hơn trước khi đưa vào production, đảm bảo ứng dụng của bạn an toàn trước khi khởi chạy mà không gây ra sự chậm trễ hoặc bất ngờ.

### Phản Hồi Từ Khách Hàng

> "SmugMug rất vui mừng được thêm AWS Security Agent vào danh mục bảo mật tự động của chúng tôi. AWS Security Agent biến đổi ROI bảo mật bằng cách cho phép đánh giá kiểm tra thâm nhập hoàn thành trong vài giờ thay vì vài ngày, với chi phí chỉ bằng một phần nhỏ của chi phí kiểm tra thủ công. Việc có thể đánh giá các dịch vụ thường xuyên hơn giúp chúng tôi giảm đáng kể thời gian để xác định và giải quyết các vấn đề sớm hơn trong vòng đời phát triển phần mềm."
> 
> — Erik Giberti, Sr. Director of Product Engineering tại SmugMug

## Ba Tính Năng Chính

### 1. Đánh Giá Bảo Mật Thiết Kế

Tính năng design review phân tích tài liệu kiến trúc và đặc tả sản phẩm để xác định rủi ro bảo mật trước khi viết mã. Nhóm AppSec upload tài liệu thiết kế từ AWS Security Agent console hoặc nhập từ S3 và các dịch vụ được kết nối khác. AWS Security Agent đánh giá tuân thủ với các yêu cầu bảo mật của tổ chức và cung cấp hướng dẫn khắc phục.

![Design Review](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/18/1211213423442380-agent.png)

#### Trạng Thái Tuân Thủ

- **Non-compliant**: Thiết kế vi phạm hoặc không đủ giải quyết yêu cầu bảo mật
- **Insufficient data**: File được upload không chứa đủ thông tin để xác định tuân thủ
- **Compliant**: Thiết kế đáp ứng yêu cầu bảo mật dựa trên tài liệu đã upload
- **Not applicable**: Yêu cầu bảo mật không áp dụng cho thiết kế hệ thống này dựa trên tiêu chí liên quan

![Design Review Findings](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/15/1211213423442380-ssample.png)

### 2. Đánh Giá Bảo Mật Code

Tính năng code review phân tích các pull request trên GitHub để xác định lỗ hổng bảo mật và vi phạm chính sách tổ chức. AWS Security Agent phát hiện các lỗ hổng phổ biến trong **OWASP Top Ten** như SQL injection, cross-site scripting và improper input validation. Nó cũng áp dụng các yêu cầu bảo mật tổ chức giống như được sử dụng trong design review, thực thi tuân thủ code với chính sách của nhóm vượt xa các lỗ hổng phổ biến.

#### Thực Thi Chính Sách Tổ Chức

Khi ứng dụng check in code mới, AWS Security Agent xác minh tuân thủ với các yêu cầu bảo mật của tổ chức vượt xa các lỗ hổng phổ biến. Ví dụ: nếu tổ chức yêu cầu giữ audit logs chỉ trong 90 ngày, AWS Security Agent xác định khi code đặt retention period là 365 ngày và comment vào pull request với vi phạm cụ thể. Điều này cho phép phát hiện các vi phạm chính sách mà các công cụ bảo mật truyền thống bỏ qua vì code hoạt động và an toàn về mặt kỹ thuật.

![Code Review](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/18/1211213423442380-code-review-3.png)

### 3. Kiểm Tra Thâm Nhập Theo Yêu Cầu

Tính năng on-demand penetration testing thực hiện kiểm tra bảo mật toàn diện để phát hiện và xác minh lỗ hổng thông qua các kịch bản tấn công nhiều giai đoạn. AWS Security Agent phát hiện có hệ thống attack surface của ứng dụng thông qua reconnaissance và endpoint enumeration, sau đó triển khai các agent chuyên dụng để thực hiện kiểm tra bảo mật trên **13 loại rủi ro bao gồm authentication, authorization và injection attacks**.

#### Chuỗi Tấn Công Tiên Tiến

Khi được cung cấp mã nguồn, API specifications và business documents, AWS Security Agent xây dựng ngữ cảnh sâu hơn về kiến trúc ứng dụng và business rules, tạo các test case được nhắm mục tiêu hơn. Nó điều chỉnh các bài kiểm tra dựa trên phản hồi của ứng dụng, điều chỉnh chiến lược tấn công khi phát hiện thông tin mới trong quá trình đánh giá.

AWS Security Agent kiểm tra các ứng dụng web và API đối với các loại lỗ hổng OWASP Top Ten, xác định các vấn đề có thể khai thác mà các công cụ phân tích tĩnh bỏ qua. Ví dụ: trong khi các công cụ Dynamic Application Security Testing (DAST) tìm kiếm trực tiếp các payload Server-Side Template Injection (SSTI), AWS Security Agent kết hợp các cuộc tấn công SSTI với error forcing và debug output analysis để thực hiện các exploit phức tạp hơn.

![Penetration Test Results](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/22/1211213423442380-4.png)

## Thiết Lập Và Bắt Đầu

### Thiết Lập Ban Đầu

1. Truy cập [AWS Security Agent console](https://console.aws.amazon.com/securityagent/)
2. Chỉ định tên agent space và tạo agent space đầu tiên của bạn
3. Chọn cách quản lý quyền truy cập người dùng:
   - **IAM Identity Center SSO**: Cho phép truy cập SSO cho toàn bộ nhóm
   - **IAM users**: Chỉ IAM users trong AWS account này có thể truy cập
4. Cấu hình quyền: Tạo IAM role mặc định hoặc chọn role hiện có

### Agent Spaces

Agent space là container tổ chức đại diện cho từng ứng dụng hoặc dự án riêng lẻ mà bạn muốn bảo vệ. Mỗi agent space có test scope, cấu hình bảo mật riêng và một miền ứng dụng web chuyên dụng.

### Thiết Lập Yêu Cầu Bảo Mật

![Security Requirements](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/25/1211213423442380-19.png)

#### AWS Managed Security Requirements

Managed security requirements dựa trên các tiêu chuẩn ngành và best practices. Các yêu cầu này sẵn sàng sử dụng, được quản lý bởi AWS và có thể được kích hoạt ngay lập tức mà không cần cấu hình.

#### Custom Security Requirements

![Custom Security Requirements](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/11/18/1211213423442380-security-requirements-1.png)

Khi tạo custom security requirements, bạn chỉ định tên control và mô tả định nghĩa chính sách. Ví dụ:

- **Network Segmentation Strategy Defined**: Thiết kế xác định phân đoạn mạng rõ ràng để tách các thành phần workload thành các lớp logic dựa trên độ nhạy cảm của dữ liệu
- **Short Session Timeouts for Privileged and PII Access**: Triển khai session timeout ngắn cho quyền truy cập privileged và truy cập thông tin cá nhân

## Có Sẵn Ngay Bây Giờ

### Vùng Cung Cấp

AWS Security Agent hiện có sẵn tại **vùng US East (N. Virginia)**. Các vùng bổ sung sẽ sớm được thêm vào.

### Giá Cả Trong Giai Đoạn Preview

**Trong giai đoạn preview, AWS Security Agent miễn phí**.

### Tài Nguyên

- **Trang sản phẩm**: https://aws.amazon.com/security-agent
- **Tài liệu kỹ thuật**: https://docs.aws.amazon.com/securityagent/latest/userguide/what-is.html
- **Console**: https://console.aws.amazon.com/securityagent/

## Lợi Ích Chính

- Bảo vệ ứng dụng liên tục từ thiết kế đến triển khai
- Tự động hóa đánh giá bảo mật thủ công và kiểm tra thâm nhập
- Phát hiện lỗ hổng chính xác cao thông qua phân tích nhận thức ngữ cảnh
- Giảm sự chậm trễ trong vòng đời phát triển
- Cải thiện ROI bảo mật
- Tối ưu hóa chi phí cho mô hình cấp phép dựa trên vCPU

---

**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/new-aws-security-agent-secures-applications-proactively-from-design-to-deployment-preview/)
