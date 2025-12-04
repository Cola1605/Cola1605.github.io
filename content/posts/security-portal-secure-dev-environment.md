---
title: "Xây Dựng Môi Trường Phát Triển An Toàn"
date: 2025-12-04T12:00:00+09:00
draft: false
categories:
  - "Security and Networking"
  - "DevOps and Infrastructure"
  - "Development"
tags:
  - "Security"
  - "Supply Chain Attack"
  - "GitHub"
  - "Development Environment"
  - "pnpm"
  - "AI Agent"
  - "Credential Management"
  - "Zero-day Attack"
author: "Security Portal"
translator: "日平"
description: "Hướng dẫn chi tiết về cách xây dựng và duy trì môi trường phát triển an toàn để phòng chống các cuộc tấn công chuỗi cung ứng phần mềm"
---

# Xây Dựng Môi Trường Phát Triển An Toàn

**Ngày công bố:** 3 tháng 12, 2025  
**Danh mục:** Cảnh báo Bảo mật  
**Nguồn:** [Security Portal](https://security-portal.ssg.isca.jp/87244)

---

## Giới Thiệu

Bài viết này tổng hợp các cài đặt và hành động được khuyến nghị để duy trì "môi trường phát triển an toàn" nhằm đối phó với các cuộc tấn công chuỗi cung ứng (supply chain attack) đang gia tăng nhanh chóng trong thời gian gần đây. (Chi tiết về Shai-Hulud xem [tại đây](https://securitylabs.datadoghq.com/articles/shai-hulud-2.0-npm-worm/))

Nếu có biện pháp nào có thể triển khai được trong môi trường của bạn, hãy cân nhắc áp dụng!

---

## Cấu Hình GitHub Organization

Cấu hình GitHub Org cho phép quản lý các biện pháp phòng chống rò rỉ thông tin, ngăn chặn các thao tác bất hợp pháp (giả mạo・phá hoại), và hạn chế mức độ hiển thị của repository.

Việc hạn chế các chức năng sẽ giúp ngăn ngừa sự cố trong trường hợp khẩn cấp, vì vậy hãy cân nhắc phù hợp với cách vận hành của từng Organization.

### Danh Sách Cài Đặt Được Khuyến Nghị

| Danh mục | Hành động được khuyến nghị | Phương pháp cài đặt |
|---------|---------------------------|-------------------|
| **Hạn chế tạo repository Public** | Cài đặt để không thể chọn "Public" khi tạo repository | Bỏ chọn [Member privileges] > Repository creation > Public |
| **Thay đổi khả năng hiển thị repository** | Cấm thay đổi Visibility của repository hiện có thành Public | Bỏ chọn [Member privileges] > Admin permissions > Visibility change |
| **Hạn chế fork** | Hạn chế fork sang tổ chức bên ngoài hoặc repository của người dùng ngoài tổ chức | Chọn [Member privileges] > Repository forking > User accounts and organizations within this enterprise |
| **Công khai Pages** | Cấm thành viên công khai Pages như biện pháp phòng chống rò rỉ thông tin | Bỏ chọn [Member privileges] > Pages creation > Public |
| **Cộng tác viên bên ngoài** | Cấm mời cộng tác viên bên ngoài không được phép | Bỏ chọn [Member privileges] > Allow inviting outside collaborators... |
| **GitHub Apps** | Cấm cài đặt GitHub App không được phép | Bỏ chọn [Member privileges] > GitHub Apps > Allow installation... |
| **Bảo vệ Issue** | Cấm xóa dữ liệu Issue | Bỏ chọn [Member privileges] > Admin permissions > Issue deletion |

---

## Cấu Hình Bảo Mật Cho Môi Trường Phát Triển Local

### Quản Lý Credential (Quan Trọng)

Đã xảy ra các trường hợp credential được lưu trữ trên thiết bị đầu cuối local bị đánh cắp. Hãy chú ý các biện pháp sau đây:

#### 1. Không lưu trữ credential có quyền mạnh như quyền quản trị viên

**Luôn ý thức về quyền hạn tối thiểu cần thiết**

- **Ví dụ: Kiểm soát repository và scope có thể truy cập bằng Fine-grained PAT của GitHub**
  - Classic PAT có phạm vi quyền hạn rộng nên cơ bản không được khuyến nghị. Hãy hạn chế sử dụng.
  
- **Ví dụ: Sử dụng cơ chế an toàn hơn với SSH Agent của Bitwarden**
  - Tham khảo: [CyberAgent Developer Blog - Bitwarden SSH Agent](https://developers.cyberagent.co.jp/blog/archives/60093/)

#### 2. Sử dụng khóa tạm thời cho các credential quan trọng như AWS và Google Cloud

**Tránh các khóa vĩnh viễn như IAM user hoặc service account**

- **Ví dụ: Với AWS, sử dụng perman-aws-vault hoặc lệnh aws login**

**Đồng thời, hãy kiểm tra việc rà soát user và role trong dịp này!**

---

### Sử Dụng Package Manager An Toàn

**pnpm** được khuyến nghị sử dụng từ các quan điểm sau:

#### 1. Vô hiệu hóa Lifecycle Scripts

- Từ pnpm v10 trở đi, lifecycle scripts (`preinstall` / `install` / `postinstall` v.v.) bị vô hiệu hóa theo mặc định

#### 2. Cài đặt minimumReleaseAge

- **Đối phó với tấn công zero-day**: Cài đặt để chặn việc cài đặt các gói vừa mới được phát hành

**Ví dụ: Cài đặt toàn cục để chờ một tuần sau khi phát hành**

```bash
$ pnpm config set minimumReleaseAge 10080 --location global
```

---

## Lưu Ý và Cài Đặt Trong Phát Triển AI Agent

### Sử Dụng Môi Trường Sandbox

Việc thực thi code của AI Agent được khuyến nghị thực hiện trong **sandbox (môi trường cách ly)**.

- Ngay cả khi AI Agent thực thi code có hại, có thể ngăn chặn xâm hại vào môi trường local hoặc tài nguyên production.

**Ví dụ:**
- GitHub Codespaces
- DevContainer

---

### Kiểm Soát Cài Đặt Dependencies

#### Hạn chế npm install

Trong cài đặt AI Agent, đặt các lệnh cài đặt gói như `npm install` vào **danh sách Deny hoặc Ask**.

#### Cố định phiên bản triệt để

Khi thêm dependencies, thay vì tự động lấy phiên bản mới nhất (latest), hãy sử dụng **lockfile** để cố định phiên bản một cách chặt chẽ.

---

### Phân Tách Vai Trò Giữa Môi Trường Kiểm Dịch và Môi Trường Local

Có phương pháp thực hiện việc giải quyết・thêm・cập nhật dependencies (Resolve & Install) không phải ở thiết bị đầu cuối local mà trong "**Môi trường Kiểm dịch (Quarantine Environment)**".

| Môi trường | Được khuyến nghị | Cần chú ý |
|-----------|-----------------|-----------|
| **Môi trường Kiểm dịch** | Giải quyết dependencies và cập nhật Lockfile (ví dụ: `npm install <pkg>`, `pnpm add <pkg>`) | Không đặt thông tin xác thực có quyền truy cập vào môi trường production |
| **Môi trường Local** | Chỉ cho phép cài đặt dựa trên Lockfile đã kiểm dịch (ví dụ: `npm ci`, `pnpm install --frozen-lockfile`) | Thêm mới gói bên ngoài hoặc cập nhật phiên bản |

---

## Tổng Kết

Cùng với sự gia tăng của rủi ro chuỗi cung ứng phần mềm, việc duy trì môi trường phát triển an toàn đang được chú ý.

Việc xây dựng guardrail trong cài đặt GitHub Org cũng quan trọng, nhưng ở môi trường local, đặc biệt là trong vài năm gần đây với sự xuất hiện của phát triển AI Agent, đã xảy ra các trường hợp gói bất hợp pháp vô tình xâm nhập.

Đối với tấn công zero-day, **cài đặt minimumReleaseAge của pnpm** (hạn chế các gói vừa mới được công bố) có khả năng giảm thiểu rủi ro, vì vậy xin hãy cân nhắc.

---

## Tổng Hợp Danh Sách Các Mục Đối Phó

| Danh mục | Hành động cụ thể | Mức độ đóng góp phòng ngừa (Lợi ích) | Độ khó・Tác dụng phụ (Nhược điểm) |
|---------|-----------------|----------------------------------|--------------------------------|
| **1. Cài đặt GitHub** | 【Ngăn chặn công khai nhầm】 Vô hiệu hóa lựa chọn Public khi tạo repository và hạn chế thay đổi khả năng hiển thị | [Cao] Ngăn chặn chắc chắn rò rỉ thông tin | [Thấp] Cản trở collaboration hợp pháp (công khai OSS v.v.) |
|  | 【Ngăn chặn mang ra ngoài】 Cấm fork repository・fork (sao chép) sang tài khoản ngoài tổ chức | [Cao] Ngăn chặn mang tài sản ra ngoài | [Thấp] Hạn chế liên kết với vendor bên ngoài hoặc sử dụng cho công việc phụ |
|  | 【Đối phó lối vào xâm nhập】 Cấm mời cộng tác viên bên ngoài và cài đặt GitHub Apps | [Trung bình] Ngăn chặn xâm nhập từ bên thứ ba | [Thấp] Mỗi lần cài đặt công cụ hoặc mời phải chờ phê duyệt của quản trị viên |
|  | 【Bảo vệ bằng chứng】 Vô hiệu hóa chức năng xóa Issue (ticket vấn đề) | [Thấp] Bảo toàn audit log sau này | [Thấp] Ticket tạo nhầm vẫn còn (cản trở việc sắp xếp) |
| **2. Môi trường Local** | 【Sử dụng khóa một lần】 Loại bỏ khóa vĩnh viễn như quyền quản trị viên và chuyển sang khóa tạm thời (aws-vault v.v.) | [Cao] Giảm thiểu thiệt hại khi bị chiếm quyền | [Trung bình] Phải xác thực lại mỗi khi session hết hạn (ví dụ: 1 giờ) |
|  | 【Giảm thiểu quyền hạn】 Nghiêm ngặt hóa access scope bằng Fine-grained PAT v.v. | [Cao] Giới hạn phạm vi thiệt hại | [Trung bình] Tăng công sức do lỗi thiếu quyền hạn khi cài đặt ban đầu |
| **3. Package** | 【Vô hiệu hóa script】 Dừng tự động thực thi script khi cài đặt (postinstall) bằng pnpm v.v. | [Cao] Chặn lối vào xâm nhập của malware | [Thấp] Dừng xử lý hợp pháp cần thiết cho build (vận hành whitelist) |
|  | 【Cài đặt trì hoãn đưa vào】 Chặn cài đặt gói ngay sau khi phát hành (ví dụ: trong vòng 7 ngày) | [Cao] Tránh tấn công zero-day | [Thấp] Phải chờ phiên bản sửa lỗi khẩn cấp (Hotfix) |
| **4. Cách ly・AI** | 【Sử dụng môi trường kiểm dịch】 Phân tách môi trường vật lý cho quá trình giải quyết dependencies (install) | [Cao] Ngăn chặn xâm nhập vào local | [Cao] Trải nghiệm phát triển (DX) giảm đáng kể do chia tách luồng phát triển |
|  | 【Cách ly AI trong sandbox】 Cách ly phát triển AI trong container (Codespaces v.v.) và hạn chế cài đặt | [Trung bình] Ngăn chặn thiệt hại khi AI mất kiểm soát | [Trung bình] Thời gian chờ khởi động môi trường và cản trở khả năng giải quyết vấn đề tự động của AI |

---

## Tài Liệu Tham Khảo

- [Shai-Hulud 2.0 npm worm - Datadog Security Labs](https://securitylabs.datadoghq.com/articles/shai-hulud-2.0-npm-worm/)
- [pnpm 10.0.0 blocks lifecycle scripts by default - Socket](https://socket.dev/blog/pnpm-10-0-0-blocks-lifecycle-scripts-by-default)
- [Zenn - Supply Chain Security](https://zenn.dev/azu/articles/ad168118524135)
- [DataDog supply-chain-firewall - GitHub](https://github.com/DataDog/supply-chain-firewall)
- [CyberAgent Developer Blog - Bitwarden SSH Agent](https://developers.cyberagent.co.jp/blog/archives/60093/)

---

**Tags:** Bảo mật, Tấn công chuỗi cung ứng, GitHub, Môi trường phát triển, pnpm, AI Agent, Quản lý Credential, Tấn công Zero-day
