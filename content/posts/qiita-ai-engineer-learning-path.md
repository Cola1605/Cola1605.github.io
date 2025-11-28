---
title: "Từ Zero đến Hero: Con đường trở thành kỹ sư thực chiến chỉ trong 1 năm với AI"
date: 2025-11-26
draft: false
tags: ["#Tech_News", "AI", "Learning", "DevOps", "API", "Cloud"]
categories: ["AI and Machine Learning", "Development"]
author: "tomoya11"
description: "Lộ trình học lập trình hiệu quả từ zero đến thực chiến trong 1 năm, kết hợp AI và các công cụ hiện đại như Docker, Git, CI/CD, Apidog, AWS và Terraform"
---

## Thông tin bài viết
- **Tác giả**: tomoya11
- **Ngày xuất bản**: 26/11/2025
- **Tags**: #Tech_News, AI, Learning, DevOps, API, Cloud
- **Nguồn**: [Qiita](https://qiita.com/tomoya11/items/0309c38c6c61781b1e9a)

## Tóm tắt

Lộ trình học lập trình từ hoàn toàn không biết gì đến thực chiến chỉ trong 1 năm. Bài viết chia sẻ phương pháp học tập hiệu quả kết hợp AI với Linux, Python, Docker, Git, CI/CD, API development, Cloud và IaC - tất cả đều hướng đến thực chiến ngay lập tức.

## 10 điểm chính

1. **AI là turbo chứ không phải người thay thế** - Nền tảng mới là quan trọng nhất
2. **Linux**: Ưu tiên lệnh cơ bản, quản lý quyền, networking, service management
3. **Bash/Python**: Bắt đầu từ automation nhỏ, hiểu "biến thao tác thủ công thành code"
4. **Docker**: Thoát khỏi "chạy ở local nhưng không chạy ở production"
5. **Git**: Branch strategy, PR, conflict resolution, git history là must-have
6. **CI/CD**: GitHub Actions đưa bạn từ "người viết code" thành "người deliver software"
7. **API development**: Apidog gom design-test-doc-mock vào một công cụ duy nhất
8. **Cloud**: Chọn 1 (khuyên dùng AWS), bắt đầu với EC2 và S3
9. **IaC**: Terraform giúp infrastructure as code và deploy có tính tái tạo
10. **AI utilization**: Code gen, Dockerfile optimization, error explanation, test case generation

## Lời mở đầu

Cùng thời điểm năm ngoái, tôi hoàn toàn không biết gì về lập trình. Mở terminal cũng sợ.

Nhưng đến giờ này năm 2025, tôi đang làm việc như một kỹ sư ở mức thực chiến. Điều gì đã thay đổi? Đó là việc **tích lũy nền tảng theo đúng thứ tự, có sự trợ giúp của AI**.

AI có thể tăng hiệu suất học tập lên 5-10 lần. Điều này là thật. Nhưng AI không phải phép màu. Nó không thể biến một người không có nền tảng thành kỹ sư trong chớp mắt.

> **AI là turbo booster, không phải dịch vụ thay thế.**

Lần này tôi sẽ công khai toàn bộ lộ trình học tập mà tôi đã đi qua. Khó thất bại, trực tiếp hướng đến thực chiến.

## Linux — Ban đầu sợ, bây giờ không thể rời

Lần đầu động vào Linux, thành thật mà nói tôi chẳng hiểu gì cả. "Sao không có GUI?" "Command là cái gì?"

Nhưng Linux là nền tảng của server, container, cloud - tất cả mọi thứ. Không cần nhớ hoàn hảo. Chỉ cần hiểu những thứ sau là đủ:

- **Lệnh cơ bản**: ls, cd, cat, grep
- **Quản lý quyền và user**: chmod, chown
- **Nền tảng networking**: IP, Port, DNS, SSH
- **Khái niệm service**: systemctl, quản lý process

Chỉ cần chạm vào một chút, bạn đã thấy được cấu trúc toàn bộ IT. Ban đầu sợ, nhưng quen rồi sẽ nghĩ "sao mình không học sớm hơn".

## Bash / Python — Bước đầu tiên của automation

Khi viết được script, thế giới thay đổi.

Ban đầu tôi bắt đầu từ những thứ đơn giản:

- Rename hàng loạt file
- Extract những dòng cụ thể từ log
- Lấy data từ API và format

Khi có thể tự động hóa những công việc này, công việc mất 30 phút của con người có thể xong trong vài giây. Đây chính là bản chất của engineer.

**"Biến thao tác thủ công của con người thành code"**

Nắm được cảm giác này thì sau đó chỉ cần ứng dụng. Điều kiện, loop, function, xử lý file — ban đầu khó nhưng thực hành ngay sẽ quen nhanh. Python hay Bash gì cũng được, hãy bắt đầu từ automation nhỏ.

## Docker — Thoát khỏi "chạy ở local nhưng không chạy production"

**"Chạy ở local nhưng không chạy ở production"**

Docker giải thoát tôi khỏi ác mộng này.

Ban đầu khái niệm khó hiểu:

- Image là gì?
- Container là gì?
- Dockerfile viết gì?

Nhưng thử Docker hóa một app nhỏ (Node.js hoặc Python) thì hiểu ngay.

**Tái tạo cùng một môi trường ở bất kỳ đâu.** Stress về environment setup bay hết. Cảm giác được giải thoát khỏi "chạy ở local nhưng không chạy production" thực sự tuyệt vời.

Xem tutorial, container hóa một app có sẵn là được. Thực hành trước, lý thuyết sau — hiểu nhanh hơn.

## Git — Skill bắt buộc để được gọi là engineer

Git không chỉ là tool. Nó là văn hóa team development.

Ban đầu tôi không biết khác nhau giữa "commit", "push", "pull". Nhưng khi tham gia team development, tầm quan trọng của nó thấm vào xương.

### Phải học:

- **Branch strategy**: feature, develop, main
- **Pull Request**: Văn hóa review
- **Conflict resolution**: Ban đầu sợ nhưng quen dần
- **History management**: git log, git blame

Có AI thì giải thích conflict, tự động generate commit message, tóm tắt PR đều dễ dàng. Engineer không dùng thành thạo Git không còn tồn tại nữa.

## CI/CD — Từ "người viết code" đến "người deliver software"

Lần đầu động vào GitHub Actions, tôi bị shock.

**"Chỉ cần push code, test tự chạy, build tự chạy, deploy tự chạy"**

Đây là sức mạnh của automation.

### Ban đầu bắt đầu từ workflow đơn giản:

- **Test automation**: pytest, jest
- **Build automation**: Tạo Docker image
- **Deploy automation**: Vercel, AWS

Làm được điều này thì thấy được big picture của development. Không chỉ "viết code" mà còn hiểu cả phần "deliver software".

Ban đầu copy template có sẵn cũng được. Xem cơ chế chạy, rồi từ từ customize thì hiểu sâu hơn.

## API Development & Testing — Chọn đúng tool, hiệu quả học tăng vọt

Hầu như tất cả application hiện đại đều dựa vào API.

Ban đầu tôi dùng Postman. Nhưng nhanh chóng phát hiện vấn đề:

- Design doc quản lý riêng ở Swagger
- Test case quản lý riêng ở script
- Document quản lý riêng ở Notion

Rời rạc quá, quản lý khó khăn.

### Apidog — Giải quyết hết phiền toái của API development

Và tôi gặp [Apidog](https://apidog.com/jp/).

Điểm tốt của Apidog:

- **Design-Test-Doc-Mock hoàn thành trong một tool duy nhất**
- Setting đơn giản, người mới cũng dễ dùng
- Design, test, doc tự động sync với nhau
- Mock cho phép frontend dev mà không cần backend
- AI generate test case và document rất tiện

### Cách dùng thực tế:

1. Import OpenAPI spec
2. AI tự động generate test case
3. Share trực tiếp cho team

Không phải qua lại giữa Postman và Swagger nữa. Tool lý tưởng giúp người mới tiếp cận API dễ dàng hơn rất nhiều.

## Cloud (AWS/GCP/Azure) — Đầu tiên chọn 1 thôi

Ba cloud lớn như "tam vị nhất thể".

Ban đầu tôi nghĩ "phải học hết". Nhưng đó là sai lầm. **Đầu tiên chọn 1, chạm vào thật kỹ - đó là con đường nhanh nhất.**

### Tôi chọn AWS. Lý do:

- Tài liệu, case study, job posting nhiều nhất
- Document tiếng Nhật đầy đủ
- Community sôi động

Ban đầu chỉ động vào EC2 và S3 thôi. Chỉ vậy cũng đã gần với mức thực chiến. Dùng free tier, deploy một web app nhỏ là được rồi.

## IaC — Bậc thang lên mid-level engineer

Dùng Terraform hoặc CloudFormation để:

- **Code hóa infrastructure**
- **Deploy có tính tái tạo**
- **Quản lý lịch sử thay đổi**

Làm được điều này thì có skill vận hành infrastructure ở mức thực chiến.

Bắt đầu từ Terraform dễ học hơn. Quản lý bằng code hiệu quả hơn nhiều so với click chuột ở AWS console. Lịch sử thay đổi quản lý bằng Git, toàn team share được trạng thái infrastructure.

Ban đầu nên bắt đầu từ đọc template có sẵn. Đọc trước, viết sau. Đây là con đường hiểu nhanh nhất.

## AI Utilization — Tại sao "nền tảng" quan trọng hơn trước?

AI đã tăng tốc quá trình học của tôi một cách đáng kinh ngạc.

### Ví dụ sử dụng thực tế:

- **Code generation**: Tạo skeleton của function
- **Dockerfile optimization**: Đề xuất best practice
- **API doc auto-generation**: Tương thích Apidog
- **Error message explanation**: Không sợ lỗi tiếng Anh nữa
- **SQL generation**: Query phức tạp cũng tạo trong nháy mắt
- **Git history analysis**: Hỗ trợ code review
- **Test case generation**: Thiết kế test bao quát

Chỉ cần dùng AI, người mới cũng tiến gần đến tốc độ thực chiến. Nhưng đừng quên:

> **AI không phải người thay thế bạn, mà là partner tăng năng lực của bạn.**

Không có nền tảng thì không thể đánh giá output của AI có đúng không. Vì vậy, học nền tảng tuyệt đối không được bỏ qua.

## Kết luận: Thứ tự đúng × Tool đúng × AI utilization = Con đường nhanh nhất

1 năm trước tôi không biết bắt đầu từ đâu. Nhưng giờ tôi nói rõ ràng được.

**Cần không phải tài năng. Mà là thứ tự, kiên trì, và chọn tool đúng.**

Với lộ trình học đúng, tool tốt, và sức mạnh của AI, người mới cũng chắc chắn trở thành engineer được.

Giống như tôi vậy.

---

**Lộ trình học của bạn thế nào? Share ở comment nhé!**
