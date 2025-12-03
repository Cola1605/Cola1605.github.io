---
title: "Atlantis giúp \"minh bạch hóa\" vận hành Terraform – Chuyển đổi kiến thức cá nhân thành sức mạnh tổ chức"
date: 2025-12-03T11:00:00+09:00
draft: false
categories:
  - DevOps & Infrastructure
  - Development
tags:
  - Atlantis
  - Terraform
  - IaC
  - DevOps
  - GKE
  - Cloud Armor
  - Workload Identity
author: "katayan"
translator: "日平"
description: "Chia sẻ kinh nghiệm chuyển đổi từ Dev Container sang Atlantis để vận hành Terraform, cùng với chiến lược module giúp giảm chi phí quản lý và tăng hiệu suất làm việc nhóm."
---

**Nguồn:** [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/60102/)

---

## Giới thiệu

Tôi là Katayama, kỹ sư backend tại công ty Cổ phần AJA.

Trong vận hành Infrastructure as Code (IaC), Terraform được sử dụng rộng rãi, nhưng phương thức vận hành khác nhau tùy theo tổ chức. Team của chúng tôi ban đầu thực thi Terraform trên Dev Container, nhưng gặp các thách thức trong vận hành. Ngoài ra, do tích cực sử dụng module nên cũng gặp khó khăn với chi phí quản lý tăng cao.

Bài viết này sẽ giới thiệu quá trình chuyển từ vận hành Terraform trên Dev Container sang Atlantis, cùng những lợi ích thu được từ việc xem xét lại chiến lược module.

### Đối tượng độc giả

- Những người vận hành Terraform trên local hoặc Dev Container
- Team gặp thách thức trong vận hành IaC (không rõ ai thay đổi gì khi nào, thao tác phụ thuộc vào cá nhân, v.v.)
- Team cảm thấy chi phí quản lý module là vấn đề

### Điều bạn sẽ học được

- Thách thức của vận hành Dev Container và cách tiếp cận giải quyết
- Ví dụ thực tế về vận hành Terraform dựa trên Pull Request (PR) sử dụng Atlantis
- Phương châm tối thiểu hóa module và lợi ích của nó

---

## Thách thức trong vận hành Dev Container

Trước tiên, hãy tổng hợp các thách thức gặp phải khi vận hành Terraform trên Dev Container.

### ① Không biết ai sửa gì khi nào

Khi thực thi local, lịch sử thực thi không được ghi lại trong PR hoặc comment của GitHub. Do đó, khó theo dõi ai thực hiện thay đổi gì khi nào, và thao tác có xu hướng trở thành kiến thức ngầm.

### ② Thực thi local dễ tạo ra sự khác biệt với plan trước đó

Khi thực thi trên Dev Container, có rủi ro tạo ra sự khác biệt giữa kết quả plan đã được review trước và kết quả thực tế khi apply.

### ③ Ứng phó với thay đổi phá vỡ bị phụ thuộc vào cá nhân

Khi tfstate không khớp và xuất hiện thay đổi phá vỡ, cần công việc điều chỉnh để làm chúng khớp nhau. Tuy nhiên, chỉ những người biết thao tác cũ mới có thể xử lý, điều này cũng làm tăng lead time của toàn bộ team.

---

## Atlantis là gì?

Để giải quyết những thách thức này, chúng tôi quyết định triển khai [Atlantis](https://www.runatlantis.io/). Atlantis là công cụ tự động hóa vận hành Terraform dựa trên PR. Được phát triển như dự án CNCF Sandbox và có nhiều thành tích áp dụng trong doanh nghiệp.

### Các chức năng chính

- **Thao tác Terraform bằng GitHub comment:** Chỉ cần comment vào PR để thực thi `terraform plan` hoặc `terraform apply`
- **Hiển thị kết quả plan/apply:** Tất cả kết quả thực thi được ghi lại trong comment GitHub, có thể review
- **Cấm thực thi cùng thư mục:** Có cơ chế lock nên không có rủi ro thay đổi cùng môi trường đồng thời
- **Cấm apply khi chưa approve:** Có thể tích hợp luồng phê duyệt (cũng hoạt động như rào chắn cho tự động hóa bằng AI)

và nhiều chức năng khác được cung cấp.

---

## Lựa chọn môi trường thực thi

Khi triển khai Atlantis, trước tiên xem xét môi trường thực thi. Đã xem xét 2 lựa chọn GKE và Cloud Run, nhưng cuối cùng chọn GKE vì các lý do sau.

### Lý do không chọn Cloud Run

- Cloud Run là môi trường container stateless nên để lưu trữ vĩnh viễn thông tin lock của Atlantis cần cấu hình bổ sung external storage
- Team có ít kinh nghiệm vận hành Cloud Run nên gánh nặng triển khai và vận hành cao

### Lý do chọn GKE

- Có thể sử dụng PersistentVolume, có thể dùng cấu hình mặc định của Atlantis nguyên vẹn
- Team có kinh nghiệm vận hành GKE, dễ troubleshooting

---

## Kiến trúc

Kiến trúc Atlantis được triển khai trên GKE như sau.

### Các thành phần

- **Atlantis Server:** Nhận Webhook từ GitHub và thực thi lệnh Terraform
- **Google Cloud Resource:** Nhóm resource được quản lý bởi Terraform

### Phương thức xác thực cho từng đường

| Đường | Phương thức xác thực |
|-------|---------------------|
| GitHub → Atlantis (Webhook) | Xác thực HMAC của Webhook Secret |
| Atlantis → Google Cloud (plan/apply) | Workload Identity |
| Atlantis → GitHub (Comment) | Installation Access Token của GitHub App |

Thiết kế này không phát hành quyền vĩnh viễn, giảm thiểu rủi ro bảo mật.

### Kiểm soát truy cập

Atlantis thực thi Terraform nên có quyền mạnh có thể thay đổi resource Google Cloud. Do đó, kiểm soát truy cập phải được thiết kế cẩn thận.

Mặt khác, Atlantis nhận Webhook từ GitHub nên cần public endpoint ra internet. Tuy nhiên, để nguyên như vậy thì Atlantis UI cũng có thể truy cập từ bên ngoài. Nếu dùng Identity-Aware Proxy thì Webhook của GitHub sẽ không đi qua, nên đã triển khai kiểm soát truy cập dựa trên IP bằng Cloud Armor.

#### IP được phép

- IP nguồn gửi Webhook của GitHub (có thể lấy từ [GitHub Meta API](https://docs.github.com/ja/rest/meta/meta?apiVersion=2022-11-28))
- IP mạng nội bộ công ty

Nhờ đó, có thể duy trì nhận Webhook trong khi hạn chế truy cập vào UI.

---

## Cấu trúc repository và chiến lược module

Cho đến đây đã giải thích về thiết kế hạ tầng của Atlantis. Tiếp theo sẽ giới thiệu về phương châm quản lý code Terraform.

### Cấu trúc repository

Cùng với triển khai Atlantis, cũng đã xem xét lại cấu trúc repository và chiến lược module. Trước đây quản lý Terraform trong cùng monorepo với code ứng dụng, nhưng vì các lý do sau đã tách ra repository độc lập.

- Chu kỳ thay đổi của infrastructure và application khác nhau
- Có thể tách merge rule và thể chế review

#### Cấu trúc thư mục

```
├── modules                     # Module chung
│   ├── CLOUD_SERVICE           # Phân biệt thư mục theo Cloud Service
│   │   ├── MODULE_NAME         # Module giả định sử dụng từ phía service
:   :   :
│
├── platform                    # Resource của hệ thống nền tảng
│   ├── CLOUD_SERVICE           # Phân biệt thư mục theo Cloud Service
│   │   ├── SYSTEM_NAME         # Tên hệ thống
│   │   │   ├── ENVIRONMENT     # Tên môi trường hoạt động
:   :   :
│
├── services                    # Resource service mà các team quản lý
│   ├── CLOUD_SERVICE           # Phân biệt thư mục theo Cloud Service
│   │   ├── SERVICE_NAME        # Tên service
│   │   │   ├── ENVIRONMENT     # Tên môi trường hoạt động
```

Không có đáp án duy nhất cho phân chia thư mục Terraform nên đã quyết định trong khi thảo luận với team. Ngoài ra, có quy tắc rõ ràng dễ truyền đạt cho AI cũng hữu ích khi generate code.

### Phương châm module hóa

Trước khi di chuyển repository đã tích cực sử dụng module, nhưng trong quá trình vận hành đã thấy rõ các thách thức.

#### Thách thức

1. **Tăng gánh nặng nhận thức**
   - Tài liệu không theo kịp đặc tả riêng khác với provider
   - Có module nào dễ trở thành kiến thức ngầm

2. **Phức tạp hóa quản lý version**
   - Khi cố theo kịp cập nhật provider thì phạm vi ảnh hưởng rất lớn
   - Nhiều version của cùng chức năng tồn tại song song, không rõ nên dùng cái nào

3. **Vấn đề thiết kế**
   - Kết quả của việc nhồi nhiều use case khác nhau vào 1 module là flag cho xử lý ngoại lệ tăng sinh
   - Nếu chia quá nhỏ thì lợi ích của module hóa giảm

#### Phương châm mới

Dựa trên những điều trên, đã chuyển sang phương châm "**Hạn chế sử dụng module ở mức tối thiểu, sử dụng trực tiếp resource của provider**". Kết quả là có thể phát triển dựa trên tài liệu chính thức, và khả năng tương thích với AI cũng tốt hơn.

---

## Luồng Plan / Apply với Atlantis

Từ đây sẽ giải thích luồng thao tác khi phát triển.

### Luồng Plan

Khi tạo PR (hoặc comment plan) thì tự động thực thi `terraform plan` và kết quả được comment vào PR. Reviewer có thể xác nhận nội dung thay đổi bằng cách xem comment này.

### Luồng Apply

Sau khi hoàn thành review, comment `atlantis apply` để thực thi. Kết quả apply cũng được comment vào PR nên có ghi lại ai apply khi nào.

### Ví dụ hiển thị trong PR thực tế

Trong PR thực tế hiển thị như sau.

![Ví dụ Atlantis Plan](URL_ảnh_screenshot_thực_tế)

---

## Kết quả sau khi chuyển đổi

Những lợi ích thực sự cảm nhận được từ triển khai Atlantis và tối thiểu hóa module như sau:

### 1. Thao tác được ghi lại trong PR

- Tất cả lịch sử thao tác còn lại trên GitHub nên dễ nhìn lại
- Có thể truyền thao tác trong quá khứ cho AI dưới dạng few-shot prompting
- Rõ ràng ai thay đổi gì khi nào
- Điều chỉnh không khớp của tfstate cũng còn lại trên GitHub

### 2. Plan ngay trước luôn còn lại trong comment nên ngăn được thay đổi ngoài ý muốn

- Có thể xác nhận kết quả plan khi review
- Dễ xác nhận cuối cùng trước apply

### 3. Chi phí quản lý module giảm

- Resource mới chỉ cần xem tài liệu chính thức là hiểu
- Triển khai tận dụng AI cũng mượt mà
- Phạm vi ảnh hưởng của cập nhật version bị giới hạn

---

## Kết luận

Nhờ triển khai Atlantis và xem xét lại chiến lược module, đã có thể thoát khỏi sự phụ thuộc cá nhân trong vận hành Terraform. Quyết định hạn chế module hóa ở mức tối thiểu là điểm quan trọng để cân bằng giữa khả năng bảo trì và chi phí học tập. Nhờ triển khai theo đặc tả của provider chính thức, ngay cả member mới cũng dễ hiểu, và đã thực hiện được môi trường dễ tận dụng AI.

Nếu bạn cảm thấy thách thức trong vận hành Terraform hoặc IaC, hãy thử xem xét triển khai Atlantis.

Ngoài ra, lần này đã nhận được sự hợp tác của [jun06t](https://developers.cyberagent.co.jp/blog/archives/author/jun06t/) để cải thiện vận hành Terraform. Đã trao đổi nhiều từ thiết kế đến triển khai, có thể xây dựng thể chế vận hành tốt hơn. Xin gửi lời cảm ơn một lần nữa qua đây.

---

**Tags:** #AJA #Atlantis #Terraform
