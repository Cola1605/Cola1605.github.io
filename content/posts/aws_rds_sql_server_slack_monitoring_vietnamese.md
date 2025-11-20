---
title: "Thiết lập Giám sát Chủ động cho Amazon RDS SQL Server với Thông báo Slack Thời gian Thực"
date: 2025-11-07
categories: ["AWS", "Data & Analytics", "DevOps & Infrastructure"]
tags: ["Amazon-RDS", "SQL-Server", "Slack", "Real-time-Monitoring", "EventBridge", "Lambda", "Serverless"]
description: "Hướng dẫn xây dựng hệ thống giám sát serverless cho RDS SQL Server với thông báo Slack real-time sử dụng EventBridge và Lambda..."
---

# Thiết lập Giám sát Chủ động cho Amazon RDS SQL Server với Thông báo Slack Thời gian Thực

**Tác giả:** Sandip Samanta, Kanchan Bhattacharyya  
**Người dịch:** Yoshinori Sawada (Solution Architect)  
**Ngày xuất bản:** 07 Tháng 11, 2025  
**Cấp độ:** Nâng cao (300)  
**Danh mục:** Amazon RDS, RDS for SQL Server, Technical How-to

---

## Giới thiệu

Giám sát cơ sở dữ liệu là khía cạnh quan trọng để duy trì các ứng dụng mạnh mẽ và đáng tin cậy. Giám sát hiệu quả các phiên bản Amazon RDS for SQL Server cho phép các nhóm duy trì hiệu suất cơ sở dữ liệu tối ưu và đảm bảo vận hành liền mạch. Các giải pháp giám sát hiện đại cho phép quản trị viên cơ sở dữ liệu, nhà phát triển và nhóm vận hành theo dõi sức khỏe cơ sở dữ liệu một cách hiệu quả và giải quyết vấn đề trước khi chúng leo thang.

Trong bài viết này, chúng tôi trình bày cách xây dựng hệ thống giám sát serverless hiệu quả cho Amazon RDS for SQL Server bằng cách sử dụng các dịch vụ AWS gốc và tích hợp Slack.

---

## Tổng quan Giải pháp

Giải pháp này tích hợp Amazon RDS for SQL Server, Amazon CloudWatch, AWS Lambda và dịch vụ Slack để cung cấp phương pháp serverless hiệu quả cho giám sát cơ sở dữ liệu. Bằng cách sử dụng các dịch vụ AWS và nền tảng truyền thông Slack, chúng ta xây dựng hệ thống thông báo hợp lý hóa tự động cảnh báo nhóm về các vấn đề cơ sở dữ liệu. Kiến trúc này loại bỏ nhu cầu giám sát thủ công và cung cấp khả năng hiển thị thời gian thực về sức khỏe cơ sở dữ liệu.

### Cách thức Hoạt động

Để xử lý lỗi, chúng ta triển khai hàm Lambda tự động kích hoạt khi phát hiện lỗi. Hàm Lambda được cấu hình với các quyền và phụ thuộc cần thiết để giải mã dữ liệu nhật ký và định dạng thành các thông báo dễ đọc. Các thông báo này đầu tiên được lưu trữ trong bảng Amazon DynamoDB, sau đó được phân phối đến kênh Slack được chỉ định thông qua tích hợp Webhook an toàn, cho phép thông báo ngay lập tức cho quản trị viên cơ sở dữ liệu và nhóm hỗ trợ.

Kiến trúc serverless này cung cấp giải pháp có khả năng mở rộng, hiệu quả về chi phí cho giám sát cơ sở dữ liệu thời gian thực với bảo trì tối thiểu trong khi thông báo nhanh chóng về các vấn đề tiềm ẩn. Toàn bộ quy trình từ khi xảy ra lỗi đến thông báo Slack thường hoàn thành trong vài giây, cho phép phản ứng nhanh với các vấn đề cơ sở dữ liệu và cải thiện độ tin cậy của hệ thống.

Sơ đồ dưới đây minh họa kiến trúc của giải pháp.

### Tính năng Chính

- **Tự động Xóa DynamoDB:** Các mục trong DynamoDB tự động bị xóa sau 48 giờ (có thể cấu hình), giảm chi phí lưu trữ để tối ưu hóa chi phí, giữ bảng nhẹ để cải thiện hiệu suất truy vấn, và cung cấp quản lý dữ liệu tốt hơn thông qua dọn dẹp tự động dữ liệu cũ.

- **Ngăn chặn Thông báo Trùng lặp:** Nếu cùng một thông báo lỗi xảy ra nhiều lần trong cửa sổ 15 phút (có thể cấu hình), chỉ có phiên bản đầu tiên được gửi đến Slack. Điều này giúp ngăn chặn thư rác thông báo và duy trì sự rõ ràng trong vận hành.

### Quy trình Thông báo

Quy trình thông báo bắt đầu khi Amazon RDS for SQL Server tạo nhật ký lỗi và xuất bản vào nhóm nhật ký CloudWatch. Khi nhật ký mới đến, bộ lọc đăng ký CloudWatch liên tục giám sát các mục này và so sánh với các mẫu lỗi được xác định trước. Khi khớp, nó kích hoạt hàm Lambda.

Hàm Lambda trước tiên giải mã và giải nén dữ liệu từ CloudWatch để xử lý các mục nhật ký. Nó trích xuất thông tin quan trọng như dấu thời gian, chi tiết nhóm nhật ký và thông báo lỗi thực tế, và lưu trữ trong DynamoDB. Sau khi xử lý, hàm Lambda định dạng thông tin này thành thông báo dễ đọc và gửi đến kênh Slack được chỉ định thông qua URL Webhook an toàn. Các thành viên nhóm nhận được các thông báo này trong vài giây sau khi lỗi ban đầu xảy ra trên phiên bản RDS.

Phương pháp hợp lý hóa này cho phép quản trị viên cơ sở dữ liệu và nhóm hỗ trợ nhanh chóng xác định và phản ứng với các vấn đề tiềm ẩn, duy trì hiệu suất và độ tin cậy cơ sở dữ liệu tối ưu.

### Các Bước Triển khai Chính

Các bước chính để triển khai giải pháp này có thể được tóm tắt như sau:

1. Xuất bản nhật ký lỗi RDS for SQL Server vào nhóm nhật ký CloudWatch
2. Tạo và cấu hình hàm Lambda để xử lý nhật ký CloudWatch
3. Thiết lập bộ lọc đăng ký Lambda để giám sát lỗi
4. Tạo kênh Slack và cấu hình Webhook đến
5. Cấu hình môi trường Lambda với URL Webhook cho thông báo Slack

---

## Yêu cầu Tiên quyết

Để triển khai giải pháp này, bạn cần tài khoản AWS đang hoạt động với phiên bản RDS for SQL Server đã được thiết lập và đang chạy. Bạn phải có quyền đầy đủ để truy cập và cấu hình các dịch vụ AWS bao gồm CloudWatch, Lambda và AWS Identity and Access Management (IAM). Điều này bao gồm khả năng tạo và sửa đổi hàm Lambda, quản lý nhóm nhật ký CloudWatch, tạo vai trò và chính sách IAM, và sửa đổi cấu hình phiên bản RDS.

Đối với tích hợp Slack, bạn cần quyền truy cập quản trị viên vào không gian làm việc Slack nơi bạn có thể tạo kênh và cấu hình tích hợp Webhook. Các quyền này rất quan trọng để cấu hình Webhook đến và thiết lập kênh thông báo cho nhóm của bạn.

### Cân nhắc về Chi phí

Lưu ý rằng lựa chọn loại triển khai RDS (Đơn AZ hoặc Đa AZ) có thể là yếu tố chi phí lớn nhất trong giải pháp này. Trước khi tiếp tục, chúng tôi khuyến nghị xem xét các trang định giá cho Amazon RDS, CloudWatch và AWS Lambda để hiểu tác động chi phí của việc triển khai giải pháp này.

---

## Cấu hình Xuất Nhật ký RDS vào CloudWatch

Đầu tiên, bạn cần cấu hình phiên bản RDS for SQL Server để xuất nhật ký lỗi vào CloudWatch. Cấu hình này cho phép lưu trữ nhật ký tập trung và xây dựng nền tảng cho hệ thống thông báo. Để xuất bản nhật ký lỗi RDS for SQL Server vào CloudWatch, bạn cần sửa đổi phiên bản DB. Hoàn thành các bước sau:

1. Trong bảng điều khiển Amazon RDS, chọn **Databases** trong ngăn điều hướng
2. Chọn phiên bản DB bạn muốn sửa đổi
3. Chọn **Modify**
4. Trong phần **Log exports**, chọn các nhật ký bạn muốn bắt đầu xuất bản vào CloudWatch. Trong bài viết này, chúng tôi chọn **Error log** và nhấp **Continue**
5. Trên trang xác nhận, xem xét các thay đổi. Để áp dụng thay đổi ngay lập tức, chọn **Apply immediately**. Để lưu thay đổi, chọn **Modify DB instance**. Hoặc để sửa đổi thay đổi, chọn **Back**, và để hủy thay đổi, chọn **Cancel**

Bây giờ bạn đã sẵn sàng để thiết lập quy trình xử lý nhật ký CloudWatch với thông báo Slack thời gian thực.

---

## Tạo Webhook Đến cho Kênh Slack

Bước tiếp theo trong hệ thống thông báo là cấu hình đích để gửi cảnh báo. Chúng ta tạo Slack webhook cung cấp điểm cuối URL an toàn cho phép hàm Lambda gửi các thông báo đã định dạng. Điều này cho phép đăng tự động thông báo lỗi vào kênh Slack được chỉ định, cho phép các thành viên nhóm giám sát và phản ứng với các vấn đề. Hoàn thành các bước sau:

1. Mở không gian làm việc Slack của bạn
2. Điều hướng đến cấu hình không gian làm việc
3. Chọn Apps and integrations
4. Tìm kiếm Incoming Webhooks
5. Chọn Add to Slack
6. Chọn kênh cho thông báo
7. Sao chép URL Webhook – bạn sẽ cần nó trong bước tiếp theo

---

## Tạo Hàm Lambda và Cấu hình Tài nguyên Liên quan

Trong bước này, chúng ta tạo hàm Lambda serverless cốt lõi để xử lý nhật ký CloudWatch. Hàm Lambda được viết bằng Python và chứa logic để giải mã dữ liệu nhật ký CloudWatch, trích xuất thông tin lỗi liên quan và định dạng cho thông báo Slack. Hàm này hoạt động như đơn vị xử lý trung tâm của giải pháp giám sát. Để tạo hàm Lambda, hoàn thành các bước sau:

1. Sao chép hoặc tải xuống kho lưu trữ dự án từ GitHub vào máy cục bộ của bạn: [https://github.com/aws-samples/sample-rds-sql-server-proactive-monitoring](https://github.com/aws-samples/sample-rds-sql-server-proactive-monitoring)
2. Điều hướng đến thư mục gốc của dự án trong terminal
3. Xác nhận các yêu cầu tiên quyết được đáp ứng:
   - a. AWS CLI được cài đặt và cấu hình với quyền thích hợp
   - b. Python 3.12 được cài đặt cục bộ (script triển khai tạo môi trường ảo độc lập). Tham khảo README.md để biết cách cài đặt Python 3.12 trên hệ thống của bạn
   - c. Tiện ích zip có sẵn
   - d. Quyền AWS thích hợp cho IAM, Lambda, DynamoDB (xem phần yêu cầu tiên quyết trong tệp README.md)
4. Chạy script triển khai tự động: `./scripts/deploy.sh`
5. Khi được yêu cầu, nhập URL Slack Webhook bạn đã tạo ở bước trước
6. Script sẽ tự động thực hiện những điều sau:
   - a. Xác nhận Python 3.12 được cài đặt trên hệ thống
   - b. Tạo môi trường ảo Python 3.12 cô lập
   - c. Kích hoạt môi trường ảo để cô lập phụ thuộc
   - d. Cài đặt urllib3 vào môi trường cô lập
   - e. Tạo chính sách IAM với quyền truy cập DynamoDB (SlackNotifierLambdaPolicy)
   - f. Tạo vai trò IAM với quan hệ tin cậy thích hợp (SlackNotifierLambdaRole)
   - g. Xây dựng và xuất bản lớp Lambda urllib3 sử dụng Python 3.12
   - h. Đóng gói và triển khai hàm Lambda (SlackNotifier)
   - i. Cấu hình biến môi trường bao gồm URL Slack Webhook
   - j. Đính kèm lớp urllib3 vào hàm
   - k. Dọn dẹp các tệp tạm thời
   - l. Vô hiệu hóa môi trường ảo

### Lưu ý Bảo mật

**Tuyên bố từ chối:** Chính sách IAM được tạo trong quá trình này (SlackNotifierLambdaPolicy) chỉ hoạt động như hướng dẫn chung. Bạn phải xem xét, tùy chỉnh và xác thực tất cả các biện pháp bảo mật theo yêu cầu cụ thể và tiêu chuẩn tuân thủ của bạn. Các phương pháp hay nhất của AWS đề xuất mạnh mẽ việc triển khai nguyên tắc đặc quyền tối thiểu chỉ cấp cho người dùng quyền tối thiểu cần thiết để thực hiện nhiệm vụ. Khái niệm bảo mật cốt lõi này, được chi tiết trong Tài liệu AWS IAM, giúp giảm thiểu rủi ro bảo mật tiềm ẩn.

---

## Tạo Bộ lọc Đăng ký Lambda cho Nhóm Nhật ký CloudWatch

Bộ lọc đăng ký hoạt động như cơ chế kích hoạt, xác định các mục nhật ký nào nên được gửi đến hàm Lambda. Nó được cấu hình để giám sát các mẫu lỗi cụ thể trong nhóm nhật ký CloudWatch, đảm bảo chỉ các nhật ký liên quan được xử lý và tránh các lời gọi hàm không cần thiết. Để tạo bộ lọc đăng ký Lambda sử dụng hàm Lambda đã tạo trước đó, hoàn thành các bước sau:

1. Trong bảng điều khiển CloudWatch, chọn **Log groups** trong ngăn điều hướng
2. Chọn nhóm nhật ký SQL Server
3. Trong menu **Actions**, chọn **Subscription filters**, sau đó chọn **Create Lambda subscription filter**
4. Trong phần Choose destination, chọn hàm Lambda (SlackNotifier) từ menu thả xuống
5. Dưới Configure log format and filters, nhập Subscription filter pattern sau:

```
?ERROR ?EXCEPTION ?FAILURE ?CRITICAL? FATAL ?error ?exception ?fail ?severity ?deadlock ?timeout ?terminated ?violation ?denied ?insufficient ?overflow ?syntax ?invalid ?unable ?cannot ?failed ?corrupt ?inconsistent "Error: 18456" "Error: 17806" "Error: 233" "Error: 1205" "Error: 3041" "Error: 8152" ?error ?Error ?Failed ?failed ?Severity ?severity
```

6. Đặt tên cho bộ lọc đăng ký. Trong bài viết này, chúng tôi sử dụng **Error Subscription Filter**
7. (Tùy chọn) Bạn có thể kiểm tra cấu hình này trong phần Test pattern. Chọn cơ sở dữ liệu từ menu thả xuống "Select log data to test" và nhấp "Test pattern". Bạn sẽ thấy các nhật ký khớp với mẫu bộ lọc trong phần Results
8. Nhấp **Start streaming**

Bây giờ tất cả nhật ký lỗi cơ sở dữ liệu sẽ được xử lý và có thể truy cập thông qua luồng nhật ký CloudWatch.

Bước cuối cùng này hoàn thành việc triển khai giải pháp giám sát tự động cho Amazon RDS for SQL Server. Bây giờ hệ thống đã sẵn sàng để bắt lỗi SQL Server và gửi thông báo đến kênh Slack. Hàm Lambda sử dụng URL Webhook để kết nối an toàn với Slack và gửi thông báo ngay lập tức cho nhóm khi xảy ra lỗi cơ sở dữ liệu. Các thông báo này bao gồm thông tin quan trọng như thông báo lỗi, dấu thời gian và chi tiết ngữ cảnh, cho phép nhóm nhanh chóng đánh giá và phản ứng với các vấn đề tiềm ẩn. Hệ thống hoạt động liên tục ở chế độ nền và không cần can thiệp thủ công để giám sát nhật ký cơ sở dữ liệu.

---

## Xác thực Giải pháp

Để xác nhận rằng việc triển khai hoạt động như dự định, bạn có thể thực hiện kiểm tra xác thực đơn giản:

1. Kết nối đến phiên bản RDS for SQL Server bằng SQL Server Management Studio (SSMS). Sử dụng cơ sở dữ liệu `SlackNotifications` như được hiển thị trong ảnh chụp màn hình tiếp theo.

2. Vì mục đích trình diễn, tạo thông báo lỗi bằng RAISERROR với tùy chọn WITH LOG:

```sql
RAISERROR('This error has been raised using RAISERROR', 16, 1) WITH LOG;
```

3. Xác nhận nhật ký lỗi SQL Server cho lỗi đã đề cập:

```sql
EXEC rdsadmin.dbo.rds_read_error_log @index = 0, @type = 1, @search_str1= 'This error has been raised using RAISERROR';
```

Vì chúng ta đã xuất bản nhật ký lỗi RDS for SQL Server vào CloudWatch, bước tiếp theo là xác nhận xem lỗi có được xuất vào CloudWatch không.

4. Trong bảng điều khiển CloudWatch, chọn **Log groups** dưới **Logs** trong ngăn điều hướng
5. Chọn nhật ký lỗi RDS for SQL Server của phiên bản DB (trong bài viết này, `/aws/rds/instance/<<your db instance>>/error`)
6. Trong tab **Log streams**, chọn nút hoạt động nơi cơ sở dữ liệu đang chạy (điều này có thể khác nhau tùy thuộc vào môi trường cụ thể của bạn)

Bạn có thể xác nhận thông báo lỗi cùng với dấu thời gian.

Trong vài giây, bạn sẽ thấy lỗi kiểm tra này xuất hiện như một thông báo trong kênh Slack đã cấu hình. Nó sẽ trông giống như thế này:

Bạn cũng có thể xác thực hoạt động của hệ thống bằng cách kiểm tra CloudWatch Logs để xác nhận nhật ký RDS được xuất thành công và hàm Lambda đang xử lý các nhật ký này một cách chính xác.

---

## Cân nhắc

Khi triển khai giải pháp này, điều quan trọng là phải chú ý đến một số điểm chính để đạt được hiệu suất và hiệu quả chi phí tối ưu:

- **Bảo vệ Dữ liệu Nhạy cảm:** Trước khi xuất bản nhật ký lỗi RDS for SQL Server vào CloudWatch, hãy triển khai logic che dấu tùy chỉnh để bảo vệ thông tin nhạy cảm. Vì các nhật ký này có thể chứa dữ liệu nhạy cảm, hãy đánh giá phương pháp này dựa trên yêu cầu kinh doanh cụ thể của bạn.

- **Thời gian Lưu trữ CloudWatch Logs:** Thiết lập thời gian lưu trữ CloudWatch Logs dựa trên yêu cầu của bạn vì cài đặt mặc định "no expiration" có thể tăng chi phí lưu trữ.

- **Bảo mật IAM:** Để bảo mật, đảm bảo vai trò thực thi Lambda tuân theo nguyên tắc đặc quyền tối thiểu, và nếu bạn không muốn hiển thị thông tin nhạy cảm như URL Webhook của Slack trong biến môi trường Lambda, hãy lưu trữ chúng trong AWS Systems Manager Parameter Store hoặc Secrets Manager.

- **Giám sát Lambda:** Giám sát thường xuyên hiệu suất và lỗi của hàm Lambda thông qua các chỉ số CloudWatch.

- **Xử lý Lỗi:** Đây là triển khai mẫu, nhưng hãy đảm bảo thêm xử lý lỗi thích hợp vào hàm Lambda để đảm bảo độ tin cậy trong môi trường sản xuất.

- **Phương pháp Hay nhất AWS:** Triển khai này tuân theo các phương pháp hay nhất của AWS cho bảo mật và khả năng mở rộng, sử dụng vai trò IAM với đặc quyền tối thiểu, biến môi trường cho thông tin nhạy cảm, và các lớp Lambda cho quản lý phụ thuộc. Phương pháp này không chỉ cung cấp giám sát đáng tin cậy mà còn duy trì hiệu quả chi phí bằng cách sử dụng các thành phần serverless tự động mở rộng theo nhu cầu của bạn.

- **Tùy chỉnh và Mở rộng:** Giải pháp này có thể được điều chỉnh để giám sát nhiều phiên bản cơ sở dữ liệu hoặc được sửa đổi để bao gồm các mẫu lỗi và định dạng thông báo bổ sung.

---

## Dọn dẹp

Để tránh phí không cần thiết và giữ môi trường AWS của bạn sạch sẽ, hãy làm theo các bước sau để xóa các tài nguyên được tạo bằng giải pháp này:

1. **Xóa Phiên bản DB:** Xóa phiên bản cơ sở dữ liệu
2. **Xóa Tài nguyên Lambda:**
   - a. Chạy script hủy triển khai tự động: `./scripts/undeploy.sh`
3. **Xóa Tài nguyên CloudWatch:**
   - a. Xóa bộ lọc đăng ký khỏi nhóm nhật ký CloudWatch
   - b. Vô hiệu hóa xuất nhật ký lỗi RDS vào CloudWatch nếu không còn cần thiết
   - c. Cân nhắc xóa các nhật ký được lưu trữ trong nhóm nhật ký CloudWatch nếu không còn cần thiết
4. **Dọn dẹp Slack:**
   - a. Xóa tích hợp Incoming Webhook khỏi kênh Slack
   - b. Nếu có kênh thông báo chuyên dụng được tạo cho mục đích này, hãy lưu trữ hoặc xóa nó

---

## Kết luận

Trong bài viết này, chúng tôi đã trình bày cách xây dựng hệ thống giám sát thời gian thực hiệu quả và serverless cho Amazon RDS for SQL Server bằng cách sử dụng các dịch vụ AWS gốc và tích hợp Slack. Bằng cách tự động hóa quy trình thông báo lỗi, các nhóm có thể giảm đáng kể thời gian phản ứng đối với các vấn đề cơ sở dữ liệu và giảm thiểu tác động tiềm ẩn đến ứng dụng.

Quan trọng nhất, hệ thống thông báo tự động này biến đổi phương pháp giám sát cơ sở dữ liệu truyền thống từ phản ứng sang chủ động. Các nhóm không còn cần kiểm tra nhật ký thủ công hoặc lo lắng về việc bỏ lỡ lỗi cơ sở dữ liệu quan trọng. Với thông báo Slack thời gian thực, các nhóm có thể tập trung vào việc giải quyết vấn đề thay vì phát hiện chúng, cuối cùng dẫn đến cải thiện độ tin cậy cơ sở dữ liệu và giảm chi phí vận hành.

---

## Về các Tác giả

### Sandip Samanta

Sandip là Technical Account Manager tại AWS Ấn Độ, hỗ trợ khách hàng doanh nghiệp tăng tốc hành trình AWS Cloud của họ. Với kinh nghiệm phong phú về kiến trúc cloud và thiết kế giải pháp, ông tập trung vào việc giúp khách hàng tối đa hóa khoản đầu tư AWS của họ thông qua hướng dẫn kỹ thuật và các phương pháp hay nhất về kiến trúc.

**LinkedIn:** [https://www.linkedin.com/in/sandipsam/](https://www.linkedin.com/in/sandipsam/)

### Kanchan Bhattacharyya

Kanchan là Senior Technical Account Manager tại AWS. Ông chuyên về tối ưu hóa hoạt động cơ sở dữ liệu doanh nghiệp. Tận dụng chuyên môn sâu rộng trên các nền tảng Amazon RDS bao gồm SQL Server, PostgreSQL, MySQL và Amazon Aurora, ông cung cấp hướng dẫn chiến lược giúp tổ chức tối đa hóa khoản đầu tư cloud của họ.

**LinkedIn:** [https://www.linkedin.com/in/kanchan-bhattacharyya/](https://www.linkedin.com/in/kanchan-bhattacharyya/)

---

## Tài nguyên Liên quan

- [Amazon RDS Pricing](https://aws.amazon.com/rds/sqlserver/pricing/)
- [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)
- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)
- [CloudWatch Log Groups](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)
- [CloudWatch Subscription Filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Subscriptions.html)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Lambda Monitoring Metrics](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html)
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [GitHub Repository](https://github.com/aws-samples/sample-rds-sql-server-proactive-monitoring)

---

**Bài viết gốc:** [Set Up Proactive Monitoring for Amazon RDS for SQL Server with Real-Time Slack Notifications](https://aws.amazon.com/blogs/database/set-up-proactive-monitoring-for-amazon-rds-for-sql-server-with-real-time-slack-notifications/)

**Người dịch:** Yoshinori Sawada (Solution Architect)
