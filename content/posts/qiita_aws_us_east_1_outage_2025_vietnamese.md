---
title: "Nhìn lại sự cố AWS quy mô lớn ngày 20/10/2025 - Chuyện gì đã xảy ra?"
date: 2025-10-25
draft: false
categories: ["AWS", "Incident-Analysis", "DevOps"]
tags: ["AWS-Outage", "DynamoDB", "DNS", "Incident-Response", "US-EAST-1", "High-Availability", "Post-Mortem"]
description: "Phân tích chi tiết sự cố AWS quy mô lớn tại US-EAST-1 ngày 20/10/2025 - từ DNS resolution failure đến DynamoDB outage và ảnh hưởng domino."
---

**Tác giả:** @zhang_hang  
**Công ty:** 株式会社ヴァリューズ (Values Inc.)  
**Ngày đăng:** 25/10/2025  
**Cập nhật:** 26/10/2025  
**Nguồn:** https://qiita.com/zhang_hang/items/e63468ec53a95bb605a3

**Tags:** #AWS  
**Likes:** 20 | **Stocks:** 6 | **Comments:** 0

---

## 📋 Tóm tắt

Bài viết phân tích **chi tiết sự cố AWS quy mô lớn** tại region **US-EAST-1** ngày **20/10/2025** - nguyên nhân từ **DNS resolution failure** gây **DynamoDB outage** và **ảnh hưởng domino** đến toàn bộ hệ sinh thái AWS.

**Điểm nổi bật:**
- ✅ **Nguyên nhân gốc:** DNS resolution failure cho DynamoDB endpoints
- ✅ **Tác động:** DynamoDB và các dịch vụ phụ thuộc (EC2, Lambda, NLB) gặp sự cố
- ✅ **Timeline:** Từ 15:48 đến 19:35 (khắc phục ban đầu ~3h)
- ✅ **Root cause:** "Hidden race condition pattern" trong DNS auto-update system
- ✅ **Bài học:** Ngay cả high availability design cũng có thể có điểm mù
- ✅ **Quan điểm:** Multi-cloud khó thực hiện, dependency vào cloud vendor không thể tránh

---

## 🎬 Lời mở đầu

Kể từ khi trở thành kỹ sư làm việc với AWS, đây là thứ Hai "đậm đà" nhất mà tôi từng trải qua.

Công ty của chúng tôi là công ty Nhật Bản, nên không đặt nhiều workload nặng tại region US-EAST-1 (Northern Virginia), nhưng tình trạng không thể tạo support ticket, Management Console cũng không hoạt động bình thường, đối với tôi cảm thấy như một loại "phi thường".

(Cá nhân tôi thấy Perplexity bị down là điều đau đớn nhất)

![AWS Status Dashboard](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3824949%2Fb85135b8-3ba6-4912-8db2-d86b8027a0ee.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=f41adf66a2005353f8db69c7a6ede21a)

*Khi nhìn thấy cái này, thật sự đổ mồ hôi lạnh*

Về vụ việc này, khá nhiều người thắc mắc "AWS không phải là high availability sao?"

Tôi rất hiểu ý các bạn muốn nói. Tuy nhiên, bất kỳ dịch vụ quy mô lớn nào cũng được xây dựng từ con số không đến hình dáng hiện tại, nên (ở khá gần phần lõi) tồn tại những component tuy là legacy nhưng khó có thể động đến. Theo quan điểm cá nhân, sự cố lần này có thể quy cho nguyên nhân đó.

Bây giờ mọi thứ đã ổn định, tôi muốn tự mình hiểu xem chuyện gì đã xảy ra và để lại bài viết này như một bản ghi nhớ.

Tôi chỉ có kiến thức tối thiểu về network, nên nếu tôi nói gì sai xin vui lòng chỉ giáo.

---

## 💥 Chuyện gì đã xảy ra?

Đã rõ ràng ngay trong ngày xảy ra sự cố, nhưng tóm gọn lại trong một câu:

**DNS phụ trách giải quyết endpoint của DynamoDB tại region US-EAST-1 đột nhiên ngừng hoạt động, trả về record rỗng, khiến DynamoDB và các dịch vụ phụ thuộc DynamoDB liên tiếp đổ dốc.**

Tất nhiên chỉ vậy thôi thì chưa đủ. [Bài viết chính thức nhìn lại sự cố](https://aws.amazon.com/message/101925/) đã được công bố, hãy cùng đọc qua.

---

## ⏰ Dòng thời gian

| Thời gian JST | Trạng thái | Mô tả |
|---------------|------------|-------|
| **10/20 15:48** | Sự cố phát sinh | Lỗi truy cập và độ trễ tại US-EAST-1 region tăng đột biến |
| **10/20 17:26** | Đang xác định nguyên nhân | Xác nhận lỗi hàng loạt DynamoDB và ảnh hưởng đến các service khác |
| **10/20 18:01** | Xác định nguyên nhân gốc | Phát hiện nguyên nhân là DNS resolution của DynamoDB, bắt đầu khắc phục |
| **10/20 18:27** | Dấu hiệu phục hồi | Thấy dấu hiệu phục hồi, request mới bắt đầu thành công |
| **10/20 19:35** | Giải quyết ban đầu | Còn backlog chưa xử lý nhưng hầu hết service đã phục hồi. Vẫn thấy lỗi EC2 instance launch |
| **10/21 07:53** | Giải quyết hoàn toàn | Tất cả issues đã được giải quyết |

Từ xác định nguyên nhân gốc đến phục hồi sớm nhanh hơn tôi nghĩ. Có thể suy đoán đây là vấn đề trong vận hành hoặc lỗi hệ thống hơn là tấn công từ bên ngoài.

---

## 🔧 Cơ chế DNS - Tại sao lần này lại hỏng?

Trước tiên, các dịch vụ AWS bao gồm DynamoDB đảm bảo scalability bằng DNS. Để cung cấp capacity xử lý khổng lồ ẩn phía sau cho người dùng (cả nội bộ và bên ngoài) thông qua endpoint đơn giản, tồn tại một hệ thống nội bộ xử lý việc cập nhật DNS record của DynamoDB. Hệ thống này được triển khai tự động hóa cao độ, không chỉ update DNS record mà còn có thể tự phục hồi và xử lý sự cố, được thiết kế để không đổ với sự cố thông thường.

---

## 🏗️ Hệ thống tự động cập nhật DNS

### 📋 Tổng quan

Hệ thống này bao gồm hai component chính:

### 🎯 DNS Planner

**Vai trò:** Tạo DNS plan

**Chức năng:**
- 🔍 **Giám sát health và capacity** của load balancer, tạo DNS plan mới theo định kỳ
- 🌐 **Quản lý nhiều endpoint:** Ngoài public region endpoint `dynamodb.us-east-1.amazonaws.com`, còn có IPv6 endpoint và account-specific endpoints
- ⚖️ **DNS plan:** Cấu hình cho tất cả endpoint, kết nối đến load balancer nào với weight bao nhiêu
- 🔗 **Chia sẻ tài nguyên** giữa các endpoint khác nhau để tăng fault tolerance

### 🚀 DNS Enactor

**Vai trò:** Áp dụng DNS plan

**Thiết kế quan trọng:** ⭐ **3 instances hoàn toàn độc lập ở 3 AZ** (Điểm này rất quan trọng!)

**Chức năng:**
- 📥 **Kiểm tra plan mới** định kỳ, lấy plan khả dụng và áp dụng vào Route 53
- ✅ **Kiểm tra trước khi áp dụng:** So sánh với plan hiện tại, đảm bảo là plan mới nhất trước khi cho phép áp dụng (⭐ Điểm này cũng rất quan trọng!)
- 🗑️ **Cleanup sau khi áp dụng:** Xóa các plan cũ hơn đáng kể so với plan đã áp dụng (⭐⭐ Điểm này cực kỳ quan trọng!)

![DNS Auto Update System Diagram](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3824949%2Fd633da15-331c-46a8-902a-3d6a899722eb.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=defe6ab9b080f0403d11da2da396f7ad)

---

## 🤔 Thiết kế này có vấn đề?

Đến đây, ngay cả architect junior level cũng sẽ cảm thấy vi diệu. Gửi cùng một DNS plan đến ba instance, để chúng thực hiện check và apply ba lần, quả thực dư thừa phải không? Tại sao không dùng pattern event-driven thay vì định kỳ pull, đặt message queue trước instance để kiểm soát?

Tất nhiên có lý do. Thêm giải thích của bản thân vào quan điểm chính thức:

### 🎯 Lý do thiết kế

**1. High Availability:**
- Tách biệt hoàn toàn từng instance để đảm bảo high availability
- Dù là load balancer hay message queue, failover đều tốn thời gian
- Ném event mà không cần kiểm soát, "không quan tâm chuyện sau" - cách nhanh nhất
- Hệ thống ở layer rất thấp, càng ít dependency càng tốt

**2. Tránh complexity:**
- Thêm restore mechanism (đặc biệt DynamoDB) hoặc lock mechanism vào apply process sẽ tăng complexity và risk
- Nếu apply process đủ ngắn (thực tế đã từng như vậy), khả năng conflict rất thấp
- Với Route 53 Transaction đảm bảo atomicity khi update record của tất cả endpoint, ngay cả khi hai instance đồng thời apply, chỉ có một plan được áp dụng

### 🔍 Đánh giá

Nhìn như vậy, có vẻ là solution không tệ, nhưng thực ra đang tiềm ẩn rủi ro.

---

## ✅ Race condition được dự kiến

![Expected Race Condition](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3824949%2Fb855624c-98f4-4565-8a2d-088b753081c3.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=4abc4db93ce7b6e07d80a97d907d9972)

Trước tiên là pattern theo dự kiến. Như sơ đồ trên, thỉnh thoảng có trường hợp hai Enactor đồng thời apply DNS plan. Được trigger bởi plan mới hơn plan hiện tại, gần như cùng lúc nhận go signal để apply, hai instance bắt đầu apply process và xung đột. Conflict xảy ra ở endpoint bị retry, sau khi retry xong thì plan được áp dụng. Có thể apply hai lần nhưng cả hai đều là plan mới, Transaction đảm bảo atomicity, nên tuy dư thừa nhưng không có hại.

Tuy nhiên, điều xảy ra lần này là **race condition "hidden pattern"**.

---

## 😱 Race condition "Hidden Pattern"

![Hidden Race Condition Pattern](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F3824949%2F8b603b9f-9de1-402c-94ae-72bcc13559f8.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=befce271ab8b44026cfc68398193c9ff)

### 🔴 Bánh răng đầu tiên bị lệch

Trong conflict thông thường ở trên, retry vốn kết thúc trong thời gian ngắn nhưng đã trở nên **bất thường dài** (instance có retry dài này gọi là `EnactorA`). Trong thời gian đó, nhiều plan mới được tạo ra và được `EnactorB` liên tục áp dụng.

Khi retry của `EnactorA` kết thúc, plan đã **trở nên khá cũ**, nhưng vì **go signal đã được đưa ra từ đầu**, plan cũ này vẫn được áp dụng thành công.

### 💣 Vấn đề thật sự: Cleanup Process

Đến đây vẫn chỉ là chuyện plan cũ được áp dụng, nhưng điều phiền phức là **cleanup process sau khi áp dụng**.

Không may, khi plan của `EnactorB` liên tục được áp dụng, plan cũ của `EnactorA` ghi đè lên, và gần như đồng thời cleanup process của `EnactorB` bắt đầu hoạt động. Ngay sau khi ghi đè, cleanup process của `EnactorB` xác định rằng nên xóa plan cũ của `EnactorA` (plan DNS hiện tại) và đã xóa nó. Kết quả, trên Route 53 tạo ra **"chân không" hoàn toàn không tồn tại DNS record** của DynamoDB endpoint.

---

## 🔍 Phân tích vấn đề

Như trực giác đã biết, dù sao cleanup cũng đáng ngờ nhất. Việc cleanup process của nơi khác xóa plan hiện tại do conflict là pattern dễ tưởng tượng. Vì vậy chắc chắn tồn tại logic xác định xóa hay không xóa.

Theo tài liệu chính thức, **"xóa các plan cũ hơn đáng kể so với plan đã áp dụng"**, nhưng tiêu chí xác định cụ thể không được công bố.

Ít nhất, nếu có kiểm soát đảm bảo không để plan khả dụng trên Route 53 về 0, hoặc nếu có kiểm tra go signal không chỉ lúc đầu mà cả lúc cuối, câu chuyện có thể khác.

Không nên chỉ đạo kiểu "từ bên ngoài lên mặt thầy", nên dừng lại ở đây. Kiến trúc phần mềm được hình thành qua vô số quyết định, với kẻ ngoài cuộc không đồng hành qua sóng gió, có những điều không thể hiểu được.

---

## 🌊 Các dịch vụ bị ảnh hưởng

DynamoDB tất nhiên rồi, các core service như EC2, NLB, Lambda cũng bị ảnh hưởng theo nhiều hình thức khác nhau.

### 🖥️ EC2

EC2 quản lý instance launch bằng hệ thống **DropletWorkflow Manager (DWFM)**. DWFM định kỳ thực hiện status check qua DynamoDB, nắm bắt xem state change của EC2 instance có được thực hiện đúng không.

Khi status check không thể thực hiện, instance hiện có không bị ảnh hưởng nhiều lắm nhưng **không thể launch instance mới**.

### ⚖️ NLB

NLB hầu hết chạy trên EC2 instance, nên bị ảnh hưởng gián tiếp từ sự cố EC2.

### ⚡ Lambda

Lambda function metadata retrieval cũng phụ thuộc DynamoDB. Tương tự EC2, Lambda không thể tạo mới hoặc update. Thêm nữa, hệ thống polling event từ SQS cũng sử dụng DynamoDB, nên xảy ra delay trong event processing.

Và nhiều service khác mà chúng ta từng nghe đều bị ảnh hưởng, sự cố ở mức chưa từng có (?) như thế. Tôi xin phép lược bớt ở đây.

---

## 📝 Cảm nghĩ cá nhân

*(Đây là quan điểm cá nhân của tác giả, không đại diện cho quan điểm chính thức của tổ chức)*

### 🛤️ Chúng ta có thể đang đi trên con đường một chiều. Nhưng điều đó cũng không tệ.

Như thể hiện qua giá cổ phiếu, về vụ việc lần này, ý kiến từ thị trường và nhà đầu tư lại bất ngờ nhiều quan điểm tích cực. AWS vốn bị nói là bị GCP và Azure cướp thị phần, bị bỏ lại trong thời đại AI, nhưng đã thể hiện sức ảnh hưởng kinh khủng theo hình thức tồi tệ nhất. Đây là ví dụ rõ rệt nhất cho thấy Internet thời nay không thể hoạt động mà không có các vendor khổng lồ bao gồm AWS.

Trong lúc này, có luận điệu muốn lấy lại thời kỳ tốt đẹp xưa như quay về on-premise, nhưng tôi dám khẳng định - **Điều đó khó. Và ngay cả khi quay về cũng không tốt đến thế.**

### ☁️ Tại sao Cloud vẫn tốt hơn

Việc vendor khổng lồ chịu trách nhiệm vận hành là cơ chế thực sự xuất sắc. Công ty ở bất kỳ quy mô nào cũng có thể xây dựng service có high availability, DR (disaster recovery plan) cũng chỉ cần click click là xong.

Hơn hết, hệ thống chia sẻ trách nhiệm mỏng và rộng, phân bổ trong toàn xã hội, cá nhân có thể nhẹ nhõm - một hệ thống gần gũi với bản chất con người đã được hoàn thiện. User ký SLA/OLA với công ty SaaS, công ty SaaS ký với AWS, mỗi bên trong khoảng xác định. Các cá nhân và doanh nghiệp tham gia vào toàn bộ quá trình chỉ phải chịu trách nhiệm trong phạm vi đã định, không bị phạt quá mức.

Giả sử triển khai service trên server của công ty mình, nếu có sự cố như lần này, đối với doanh nghiệp hoặc cá nhân cụ thể sẽ trở thành tình huống không thể cười được hơn bây giờ. Chỉ đánh giá quá cao "năng lực chịu trách nhiệm" của mình không dẫn đến giải quyết vấn đề, chỉ khiến doanh nghiệp và cá nhân yếu kém bất hạnh mà thôi.

### 👨‍💻 Với tư cách developer, có thể làm gì?

Tất nhiên, cần có hành động nâng cao năng lực architect hàng ngày như backup plan phù hợp, thiết kế kiến trúc high availability, nhưng nói thẳng, cuối cùng thì cũng không có cách nào đúng không.

Có ý kiến "Làm multi-cloud là được!" nhưng ngay cả với tỷ suất lợi nhuận của IT service đang hoạt động khá ổn, chi phí infra tăng gấp 2, gấp 3 hoàn toàn không thể chấp nhận được. Ngay cả khi phân tán vendor (ngoài AWS), upstream của nơi phân tán có thể vẫn đang host service gì đó trên AWS. Cuối cùng, có bao nhiêu doanh nghiệp sẵn sàng bỏ ra số tiền lớn cho 0.01% availability cao hơn ở đỉnh pyramid?

Không chỉ vậy. Chọn AWS/GCP/Azure/vendor khổng lồ khác không chỉ là nhận hóa đơn hàng tháng từ họ. Còn phải xây dựng tuyển dụng, tổ chức, tech stack xoay quanh vendor đó. Đồng thời, chuyển sang vendor khác trở nên cực kỳ khó khăn. Cuối cùng, toàn là vấn đề CTO phải ôm đầu suy nghĩ.

Với tư cách một developer, chỉ có thể tin tưởng con đường đã chọn và tiến lên thôi.

(À! Việc tích cực dùng [US-WEST-2 thay vì US-EAST-1](https://x.com/supabase/status/1825554080061620373?s=46) là điều có thể làm ngay từ bây giờ!)

---

## 🎯 Những điểm quan trọng

### 📊 Timeline tóm tắt

**Tổng thời gian phục hồi:** ~16 giờ (15:48 JST → 07:53 JST ngày hôm sau)  
**Phục hồi ban đầu:** ~4 giờ (15:48 → 19:35)  
**Xác định root cause:** ~2h (15:48 → 18:01)

### 🔧 Root Cause Analysis

**Nguyên nhân trực tiếp:**
- DNS resolution failure cho DynamoDB endpoints
- Route 53 trả về empty record

**Nguyên nhân gốc:**
- "Hidden race condition pattern" trong DNS auto-update system
- Cleanup process xóa nhầm plan đang active
- Thiếu safeguard đảm bảo ít nhất 1 plan luôn tồn tại

### 🏗️ Thiết kế DNS Auto-Update System

**DNS Planner:**
- Tạo DNS plan định kỳ
- Monitor load balancer health/capacity
- Quản lý multiple endpoints

**DNS Enactor (3 instances độc lập):**
- Pull DNS plan định kỳ
- Check plan mới nhất trước khi apply
- Cleanup plan cũ sau khi apply

### ⚠️ Vulnerability Points

**Thiết kế dự kiến:**
- ✅ 3 instances độc lập → high availability
- ✅ Không dùng lock mechanism → tránh complexity
- ✅ Route 53 Transaction → atomic updates
- ❌ Race condition được chấp nhận vì apply nhanh

**Hidden race condition:**
1. ❌ Retry bất thường dài ở EnactorA
2. ❌ EnactorB liên tục apply plan mới
3. ❌ EnactorA apply plan cũ sau khi retry xong
4. ❌ Cleanup của EnactorB xóa plan cũ (đang active!)
5. ❌ Route 53 không còn DNS record nào → "chân không"

### 🌊 Ảnh hưởng cascading

**Directly affected:**
- DynamoDB: Complete outage

**Indirectly affected:**
- EC2: Không thể launch instance mới
- Lambda: Không thể create/update, delay event processing
- NLB: Ảnh hưởng qua EC2
- Và hầu hết AWS services

### 💭 Bài học và quan điểm

**Về high availability:**
- Legacy component gần core system khó động đến
- Ngay cả thiết kế tốt cũng có blind spot
- Cleanup logic cần safeguard chặt chẽ

**Về cloud dependency:**
- Internet hiện đại không thể tách khỏi cloud vendor
- Multi-cloud lý thuyết tốt nhưng thực tế khó (chi phí, lock-in)
- Responsibility distribution model giúp tránh penalty quá mức
- On-premise comeback không thực tế

**Với developer:**
- Cuối cùng không có cách nào tuyệt đối
- Tin tưởng con đường đã chọn
- Actionable: Dùng US-WEST-2 thay vì US-EAST-1

### 📚 Technical Terms

| Term | Giải thích |
|------|-----------|
| **DNS Planner** | Component tạo DNS plan |
| **DNS Enactor** | Component áp dụng DNS plan |
| **DWFM** | DropletWorkflow Manager - quản lý EC2 launch |
| **Route 53 Transaction** | Mechanism đảm bảo atomic DNS update |
| **真空状態 (Chân không)** | Trạng thái không có DNS record nào |
| **Hidden race condition** | Race condition do retry bất thường dài |

### 🔗 Tài liệu tham khảo

**Official:**
- [AWS Post-Mortem](https://aws.amazon.com/message/101925/)
- [Supabase về US-WEST-2](https://x.com/supabase/status/1825554080061620373)

---

## 💡 Kết luận

Sự cố AWS lần này là bài học quý giá về:

1. **Complexity trong distributed systems:** Ngay cả thiết kế xuất sắc cũng có thể có điểm mù
2. **Trade-offs:** High availability vs Complexity vs Cost
3. **Cloud dependency:** Không thể tránh khỏi và đó là điều hợp lý
4. **Developer mindset:** Tin tưởng và tiến lên, không có giải pháp hoàn hảo

Với tư cách kỹ sư, điều quan trọng là hiểu rõ hệ thống, chuẩn bị tốt, nhưng cũng chấp nhận rằng một số rủi ro nằm ngoài tầm kiểm soát.

---

TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
