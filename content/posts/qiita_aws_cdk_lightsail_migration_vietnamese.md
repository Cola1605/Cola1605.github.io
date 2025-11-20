---
title: "AWS CDK Là Gì? Tôi Ước Biết Điều Này Sớm Hơn - Bài Học Từ Việc Di Chuyển Lightsail Sang EC2 + RDS"
date: 2025-11-04
categories: ["AWS", "DevOps & Infrastructure"]
tags: ["AWS-CDK", "Lightsail", "EC2", "RDS", "IaC", "CloudFormation", "Migration"]
description: "Kinh nghiệm migration từ Lightsail sang EC2 + RDS với AWS CDK. So sánh CDK vs CloudFormation vs SAM, benefits của IaC và lessons learned từ thực tế."
---

# AWS CDK Là Gì? "Tôi Ước Biết Điều Này Sớm Hơn" - Bài Học Từ Việc Di Chuyển Lightsail Sang EC2 + RDS

## Metadata
- **Tiêu đề gốc**: AWS CDKとは？LightsailからEC2 + RDSに移行して気づいた「早く知りたかった」話
- **Tác giả**: kanade3256 (@kanade3256)
- **Ngày xuất bản**: 4 tháng 11, 2025
- **Ngày cập nhật cuối**: 4 tháng 11, 2025
- **Nền tảng**: Qiita
- **URL gốc**: https://qiita.com/kanade3256/items/b81f72601ba162eb99fd
- **Engagement**: 0 Likes, 0 Stocks, 0 Comments
- **Tags**: AWS, CloudFormation, IaC, SAM, CDK, Lightsail, EC2, RDS, Infrastructure
- **Loại bài viết**: Chia sẻ kinh nghiệm + Hướng dẫn
- **Độ khó**: Trung cấp (Intermediate)
- **Thời gian đọc ước tính**: 15-20 phút

---

## Giới Thiệu

### Bối Cảnh

Trong dự án với bạn bè, chúng tôi đã di chuyển từ **Lightsail + MySQL** sang **EC2 + RDS for MySQL**.

Đây là lần đầu tiên xây dựng server và cấu hình database, và tôi đã vật lộn với nhiều khó khăn:

> "VPC và Subnet... tại sao nó phức tạp đến thế này...?" 😓

### Khám Phá AWS CDK

Trong lúc gặp khó khăn, tôi đã tình cờ biết đến **AWS CDK (Cloud Development Kit)**.

Sau khi tìm hiểu, tôi nhận ra:

> "Nếu tôi sử dụng công cụ này ngay từ đầu, việc xây dựng infrastructure có thể đã dễ dàng hơn rất nhiều..." 💡

### Mục Đích Bài Viết

Bài viết này tổng hợp và làm rõ:
- ✅ **Tổng quan về CDK**
- ✅ **Ưu điểm (Merits)**
- ✅ **Nhược điểm (Demerits)**
- ✅ **Sự khác biệt với SAM**

---

## 1. Cấu Hình Trước Đây

### Workflow Hiện Tại

Trước đây, chúng tôi làm việc theo quy trình sau:

1. **AWS Lambda** ➡ Deploy bằng **AWS SAM**
   - `sam build && sam deploy`

2. **EC2** ➡ CI/CD với **GitHub Actions**
   - VSCode ➡ `git push` ➡ GitHub Actions ➡ EC2

---

### ✅ Ưu Điểm

| Ưu điểm | Mô tả |
|---------|-------|
| 🎯 **Trách nhiệm rõ ràng** | Dễ xác định ai chịu trách nhiệm phần nào |
| 📁 **Cấu trúc project dễ nhìn** | Folder project được tổ chức rõ ràng |

---

### ❌ Nhược Điểm

| Nhược điểm | Mô tả |
|-----------|-------|
| 🖱️ **Cần thao tác GUI** | Không thể quản lý tổng hợp, buộc phải dùng GUI |
| ⚠️ **Nguy cơ lỗi con người** | Thao tác GUI dễ dẫn đến sai sót (đặc biệt Security Group) |
| 🕐 **Mất thời gian kiểm tra** | Phải kiểm tra nhiều nơi khác nhau → tốn thời gian |

---

## 2. CDK Thay Đổi Mọi Thứ Như Thế Nào?

### Tổng Quan Về Thay Đổi

> Các thao tác **GUI trước đây** → Giờ có thể viết bằng **Python hoặc TypeScript**! 🚀

**Điểm khác biệt lớn:**

1. **SAM**: Viết theo template có sẵn
2. **CDK**: Viết bằng ngôn ngữ lập trình → **Linh hoạt hơn nhiều** ✨

**Khả năng mở rộng:**

- ❌ **SAM**: Chỉ quản lý được **Lambda**
- ✅ **CDK**: Quản lý được **gần như TẤT CẢ dịch vụ AWS**

**Kết quả:**

> Các cài đặt bảo mật phức tạp giờ có thể quản lý tổng hợp một cách dễ dàng! 🎉

---

## 3. Ưu Điểm Của CDK (9 Điểm Nổi Bật)

### 3.1. Infrastructure as Code (IaC)

**Mô tả:**

Có thể định nghĩa infrastructure bằng **ngôn ngữ lập trình**:
- TypeScript
- Python
- Java
- C#
- Go

**Ưu điểm:**

✅ Điều kiện if/else, vòng lặp, tái sử dụng code dễ dàng

✅ Linh hoạt hơn **hoàn toàn so với YAML của CloudFormation**

---

### 3.2. Tự Động Tạo CloudFormation

**Mô tả:**

CDK cuối cùng sẽ **tự động tạo CloudFormation template** và deploy.

**Ưu điểm:**

✅ Kết hợp được cả **tính ổn định** và **khả năng tái tạo**

---

### 3.3. Trừu Tượng Hóa Cao (L2/L3 Constructs)

**Ví dụ:**

```typescript
new s3.Bucket()
```

Chỉ với 1 dòng code này, bạn đã có:
- ✅ Mã hóa (Encryption)
- ✅ Versioning
- ✅ Deletion Policy

**Thư viện phong phú:**

- 📚 **Official Constructs**: Từ AWS
- 🌐 **Community Constructs**: Từ [Construct Hub](https://constructs.dev)

---

### 3.4. Tự Động Quản Lý Dependency

**Mô tả:**

CDK tự động giải quyết dependency giữa các resource:

```
RDS → Lambda → API Gateway → Route53
```

**Kết quả:**

✅ Deploy theo **đúng thứ tự** tự động

---

### 3.5. Multi-Account & Multi-Region

**Mô tả:**

Với `cdk.App()`, có thể quản lý nhiều môi trường cùng lúc:

- 🔧 **Development**
- 🧪 **Staging**
- 🚀 **Production**

**Ưu điểm:**

✅ Cùng một code có thể xây dựng cho **tất cả môi trường**

---

### 3.6. Diff Deploy (Deploy Chênh Lệch)

**Lệnh:**

```bash
# Xem thay đổi
cdk diff

# Deploy chỉ phần thay đổi
cdk deploy
```

**Ưu điểm:**

✅ Chỉ deploy **những gì thay đổi**

✅ Tiết kiệm thời gian và giảm rủi ro

---

### 3.7. Tích Hợp CI/CD Dễ Dàng

**Hỗ trợ:**

- ✅ **GitHub Actions**
- ✅ **AWS CodePipeline**

**Kết quả:**

→ Tự động hóa deployment hoàn toàn! 🤖

---

### 3.8. Tích Hợp CloudFormation Template Cũ

**Cách thức:**

Sử dụng `CfnInclude` để import template cũ

**Ưu điểm:**

✅ Không cần viết lại từ đầu

✅ Migration dễ dàng hơn

---

### 3.9. Giảm Chi Phí & Tăng Bảo Mật

**Có thể định nghĩa bằng code:**

- ✅ **Deletion Policy** tự động
- ✅ **Secrets Manager** integration
- ✅ Quản lý biến môi trường an toàn

**Kết quả:**

→ Tiết kiệm chi phí + Bảo mật tốt hơn! 💰🔒

---

## 4. Nhược Điểm Của CDK (7 Điểm Cần Lưu Ý)

### 4.1. Bị Ràng Buộc Bởi CloudFormation

**Vấn đề:**

CDK sử dụng CloudFormation nội bộ → Nếu CloudFormation **chưa hỗ trợ** dịch vụ mới → **Không thể deploy**

---

### 4.2. Debug Khó Khăn

**Vấn đề:**

CloudFormation template được tạo ra có thể **rất lớn** → Khó tìm nguyên nhân lỗi stack

---

### 4.3. Phụ Thuộc Version Mạnh

**Vấn đề:**

Khi nâng cấp `v1 → v2`:

- ❌ Constructs có thể không tương thích
- ⚠️ Cần sửa code khi update

---

### 4.4. Khó Xử Lý Sự Khác Biệt Môi Trường

**Vấn đề:**

Phải dùng **điều kiện if/else** để chuyển đổi giữa dev/prod

→ Code dễ **phình to**

---

### 4.5. Type Completion Yếu Ở Một Số Ngôn Ngữ

**So sánh:**

| Ngôn ngữ | Type Support |
|----------|--------------|
| TypeScript | ⭐⭐⭐⭐⭐ Tốt nhất |
| Python | ⭐⭐⭐ Trung bình |
| Java | ⭐⭐⭐ Trung bình |

---

### 4.6. Rủi Ro Khi Xóa Stack

**Cảnh báo:**

```bash
cdk destroy  # ⚠️ NGUY HIỂM!
```

→ Nếu chạy nhầm → **Tất cả resource (bao gồm RDS) sẽ bị XÓA**

**Khuyến nghị:**

🔒 Cần quản lý cẩn thận!

---

### 4.7. Không Tương Thích Với Terraform

**Hạn chế:**

- ❌ AWS CDK: Chỉ cho AWS
- ✅ Terraform: Multi-cloud

**Khi nào không phải vấn đề:**

→ Nếu bạn **chỉ dùng AWS** → Không sao!

---

## 5. So Sánh Với Các Công Cụ Khác

| Công cụ | Đặc điểm chính | Phù hợp với |
|---------|---------------|-------------|
| **AWS CDK** | AWS chính thức, IaC bằng code | Team phát triển AWS-centric, ưu tiên code |
| **AWS SAM** | IaC tập trung serverless, chuyên Lambda | Cấu hình chủ yếu Lambda/API Gateway |
| **Terraform** | Multi-cloud, khai báo declarative | Môi trường dùng nhiều cloud, team infrastructure chuyên nghiệp |
| **Pulumi** | Giống CDK nhưng multi-cloud | Nhiều cloud + ưu tiên code |

---

## 6. Các Câu Hỏi Thường Gặp

### Q1. Phân Tán Trách Nhiệm? Gộp Chung Có Nguy Hiểm Không?

**Câu trả lời:**

> ➡ Kết luận: **Nguy hiểm nếu không thiết kế đúng!** ⚠️

---

#### Tại Sao CDK "Trông Có Vẻ Nguy Hiểm"?

**3 lý do chính:**

1. **CDK tạo CloudFormation** → Có thể deploy nhiều service/resource cùng lúc trong 1 repo

2. **`cdk deploy --all`** → Thay đổi có thể ảnh hưởng phạm vi rộng

3. **Lo lắng:** "1 thay đổi file → Ảnh hưởng S3, VPC, Lambda...?"

**Đánh giá:**

✅ Lo lắng này **ĐÚNG**!

⚠️ Nếu nhồi tất cả vào 1 stack mà không thiết kế → **Phạm vi thiệt hại lớn**

**Giải pháp:**

> "Nếu thiết lập đúng cách → Vận hành an toàn hoàn toàn!" 💯

---

### Q2. Vậy Làm Thế Nào Để "An Toàn"?

**Đây là điểm quan trọng!** 👇

---

#### (1) Phân Chia Stack

**Cách tổ chức:**

```
├── Network Stack (VPC, Subnet, SG)
├── Application Stack (ECS/Lambda/API Gateway)
└── Batch/Analytics Stack
```

**Lợi ích:**

✅ "Deploy chỉ app" mà không động vào network

✅ CDK hỗ trợ **cross-stack reference** → Chia tách dễ dàng

---

#### (2) Phân Chia Account/Environment

**Cấu trúc:**

```
├── Dev Account
├── Staging Account
└── Production Account
```

**Kiểm soát:**

🔒 Giới hạn **ai có thể deploy** vào Production

🔒 Giới hạn **pipeline nào** có quyền

**Kết quả:**

→ Tăng ngưỡng khó để "phá hỏng production" 🛡️

---

#### (3) Không Để Người Dùng Chạy Lệnh Deploy Tùy Tiện

**Quy tắc:**

❌ **KHÔNG** để người dùng chạy `cdk deploy --all` thủ công

✅ Deploy qua **GitHub Actions / CodePipeline** với stack cụ thể

✅ Luôn chạy `cdk diff` trong CI → Fail nếu thay đổi quá nhiều

**Lợi ích:**

→ Giảm thiểu "thay đổi không mong muốn ở nơi không liên quan" 🎯

---

#### (4) Giới Hạn IAM: "Ai Có Thể Làm Gì"

**Cấu hình IAM Role cho CDK:**

Giới hạn chỉ:
- ✅ Account cụ thể
- ✅ CloudFormation stack cụ thể

**Nguyên tắc:**

> "Người dùng CDK ≠ Người có thể phá hủy mọi thứ" 🔐

---

### Q3. Khi Nào Dùng SAM, Khi Nào Dùng CDK?

**Câu trả lời ngắn gọn:**

> Cả hai đều là **IaC (Infrastructure as Code)**, nhưng **mục đích và thế mạnh khác nhau**

---

#### So Sánh Chi Tiết: SAM vs CDK

| **Tiêu chí** | **AWS SAM** | **AWS CDK** |
|--------------|-------------|-------------|
| **Mục đích chính** | Xây dựng serverless (Lambda trung tâm) đơn giản | Xây dựng toàn bộ infrastructure AWS linh hoạt bằng code |
| **Thế mạnh** | Lambda, API Gateway, DynamoDB (serverless) | VPC, EC2, RDS, S3, ECS, Lambda... (TẤT CẢ AWS services) |
| **Định dạng** | YAML (template-based) | TypeScript / Python / Java / C# / Go (ngôn ngữ lập trình) |
| **Mức độ trừu tượng** | Thấp~Trung bình (phải khai báo tường minh) | Cao (class hóa, tái sử dụng, điều kiện) |
| **Quan hệ với CloudFormation** | Viết template trực tiếp | Tự động tạo CloudFormation template |
| **Độ dễ triển khai** | Đơn giản, dùng được ngay | Có learning curve ở setup ban đầu |
| **Tính tái sử dụng** | Thấp (chủ yếu copy-paste) | Cao (module hóa bằng Construct) |
| **Theo dõi thay đổi** | Quản lý thủ công nhiều | `cdk diff` tự động kiểm tra |
| **CI/CD integration** | CodeDeploy / GitHub Actions | Tương tự, nhưng linh hoạt hơn |
| **Trải nghiệm phát triển** | Người mới AWS, tập trung serverless | Thiết kế toàn bộ AWS, team development mạnh |
| **Quy mô phù hợp** | App nhỏ~vừa tập trung Lambda | Project vừa~lớn bao gồm toàn bộ infrastructure |

---

#### Khuyến Nghị Sử Dụng

**Quan trọng:**

> "Sử dụng tùy theo **dự án** và **mục đích**" 🎯

| **Mục đích của bạn** | **Công cụ nên chọn** |
|---------------------|---------------------|
| "Chỉ cần Lambda + API Gateway" | ✅ **SAM** |
| "Quản lý toàn bộ: EC2, RDS, S3..." | ✅ **CDK** |
| "Dùng cả Serverless + EC2" | ✅ **CDK** (hoặc CDK + SAM hybrid) |

---

## 7. "Quản Lý Tất Cả Bằng CDK" Không Phải Là Xấu

### Quan Điểm Đúng

**Thực ra:**

✅ **Code cho thấy rõ** cấu hình ở đâu

✅ **Có tính tái tạo** (Reproducibility)

✅ **Có thể review sự thay đổi** (Diff)

---

### So Với GUI Console

**So sánh:**

| Phương pháp | Trách nhiệm rõ ràng? |
|-------------|---------------------|
| Chỉnh sửa rải rác trên Console | ❌ Khó xác định |
| Quản lý tập trung bằng CDK | ✅ Rõ ràng hơn nhiều! |

---

### Khi Nào Thì Nguy Hiểm?

**Tình huống nguy hiểm:**

> "Nhồi tất cả vào 1 stack, mọi người chạy `cdk deploy` từ local" 😱

**Đánh giá:**

- ❌ **Không phải lỗi của CDK**
- ⚠️ **Lỗi thiết kế vận hành và phân chia**

---

## 8. Tóm Tắt

### AWS CDK Là Gì?

> **AWS CDK** = Công cụ IaC mạnh nhất để quản lý tổng hợp AWS resources bằng code! 💪

---

### So Với SAM

**CDK vượt xa SAM:**

| Công cụ | Khả năng |
|---------|----------|
| SAM | Chỉ quản lý Lambda |
| CDK | VPC • RDS • EC2 • S3 • GẦN NHƯ TẤT CẢ AWS services |

---

### Điều Kiện Thành Công

**Với thiết kế phù hợp:**

1. ✅ **Phân chia stack**
2. ✅ **Kiểm soát quyền**
3. ✅ **CI/CD integration**

**Kết quả:**

→ Vượt trội hơn vận hành GUI về:
- 🔄 **Tính tái tạo**
- 🔒 **Bảo mật**
- 👥 **Hiệu quả team**

---

### Khuyến Nghị

> 💡 **Rất khuyến khích** cho:
> - Người mới bắt đầu nghiêm túc với AWS
> - Team muốn code hóa infrastructure hiện tại

---

## 9. Tài Liệu Tham Khảo

### Official Resources

1. **AWS CDK Official Docs**
   - 📚 https://docs.aws.amazon.com/cdk/latest/guide/home.html

2. **AWS CDK Workshop**
   - 🎓 https://cdkworkshop.com/

3. **Construct Hub** (Thư viện external)
   - 🌐 https://constructs.dev/

---

## 10. Lời Bổ Sung

### Về Bài Viết Này

**Nguồn kinh nghiệm:**

> Bài viết này được tổng hợp từ **trải nghiệm thực tế** khi di chuyển từ **Lightsail → EC2 + RDS**

**Hy vọng:**

Nếu bạn cũng đang nghĩ:

> "Muốn thoát khỏi GUI construction và chuyển sang IaC"

→ Hi vọng bài viết này sẽ hữu ích! 😊

---

## Điểm Nhấn Chính (Key Takeaways)

### 6 Bài Học Quan Trọng

1. ✅ **Kinh nghiệm thực tế** từ migration Lightsail → EC2 + RDS

2. ✅ **Tiêu chí rõ ràng** để phân biệt AWS CDK vs SAM

3. ✅ **9 ưu điểm** và **7 nhược điểm** của CDK

4. ✅ **4 biện pháp cụ thể** cho vận hành CDK an toàn:
   - Stack分割
   - Environment isolation
   - Deploy control
   - IAM restrictions

5. ✅ "Quản lý tất cả bằng CDK" → **An toàn với thiết kế đúng**

6. ✅ **Lời khuyên thực tế** cho người mới chuyển từ GUI sang IaC

---

## Technical Highlights (Điểm Nổi Bật Kỹ Thuật)

### 8 Kỹ Thuật Chính

1. 🔧 **Infrastructure as Code (IaC)** - Phương pháp triển khai thực tế

2. 🔧 **CloudFormation auto-generation** - Ưu điểm tự động hóa

3. 🔧 **L2/L3 Constructs** - Trừu tượng hóa cấp cao

4. 🔧 **Multi-account & Multi-region** - Hỗ trợ môi trường phức tạp

5. 🔧 **cdk diff** - Deploy chỉ phần thay đổi

6. 🔧 **CI/CD integration** - GitHub Actions / CodePipeline

7. 🔧 **Stack separation** - Quản lý rủi ro

8. 🔧 **IAM permission control** - Tăng cường bảo mật

---

## Tags

`#AWS` `#CDK` `#CloudFormation` `#IaC` `#SAM` `#Lightsail` `#EC2` `#RDS` `#Infrastructure` `#DevOps` `#Migration` `#BestPractices`

---

**Nguồn bài viết gốc**: [Qiita - @kanade3256](https://qiita.com/kanade3256/items/b81f72601ba162eb99fd)

**Dịch và biên soạn bởi**: GitHub Copilot AI Assistant

**Ngày dịch**: 2025

---

## Phụ Lục: Quick Reference

### CDK Command Cheat Sheet

```bash
# Xem sự khác biệt
cdk diff

# Deploy stack cụ thể
cdk deploy MyStack

# Deploy tất cả (CẨN THẬN!)
cdk deploy --all

# Xóa stack (NGUY HIỂM!)
cdk destroy
```

---

### Checklist Migration GUI → CDK

- [ ] Xác định scope migration
- [ ] Thiết kế cấu trúc stack (network/app/batch)
- [ ] Setup CI/CD pipeline
- [ ] Cấu hình IAM role phù hợp
- [ ] Test trên dev environment
- [ ] Review với team
- [ ] Deploy lên staging
- [ ] Monitor và điều chỉnh
- [ ] Production deployment

---

**🎉 Chúc bạn thành công với AWS CDK!**
