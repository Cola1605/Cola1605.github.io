---
title: "Câu chuyện tạo cơ hội học tập cho 1000 nhân viên để đào tạo Engineers có thể sử dụng thành thạo AI | Generative AI Thorough Understanding Reskilling dành cho Engineers"
date: 2025-10-21
draft: false
categories: ["AI & Machine Learning", "Business & Technology"]
tags: ["Generative-AI", "Reskilling", "AI-Training", "CyberAgent", "Engineer-Education", "AI-Agent", "Professional-Development"]
description: "Câu chuyện về chương trình Generative AI Thorough Understanding Reskilling của CyberAgent - đào tạo 1000 engineers sử dụng thành thạo AI."
---

**Tác giả:** kataoka (片岡)  
**Tổ chức:** 株式会社サイバーエージェント 経営推進本部 (CyberAgent Inc. - Management Promotion Division)  
**Ngày đăng:** 21/10/2025  
**Nguồn:** https://developers.cyberagent.co.jp/blog/archives/59240/

**Category:** エンジニア  
**Hatena Bookmarks:** 2

---

## 📢 Giới thiệu về tác giả

Xin chào. Tôi là Kataoka thuộc phòng ban 経営推進本部 (Management Promotion Division) của công ty CyberAgent.

Tôi gia nhập công ty vào năm 2005 như một mid-career hire, và trong khoảng 3 năm gần đây, tôi đã dành phần lớn thời gian cho việc xây dựng các initiatives đào tạo nhân viên engineers trong một sáng kiến toàn công ty được gọi là **"リスキリングセンター" (Reskilling Center)**.

---

## 🔄 Ôn lại bài viết trước và hành trình sau đó

### Giới thiệu lại "生成AI徹底理解リスキリング" là gì?

Nếu bạn chưa biết "生成AI徹底理解リスキリング" (Generative AI Thorough Understanding Reskilling) là gì, tôi khuyến nghị bạn đọc press release của công ty chúng tôi trước:

🔗 **[サイバーエージェント、全社的なAI人材育成に向けて「生成AI徹底理解リスキリング」をスタート](https://www.cyberagent.co.jp/news/detail/id=29485)**

### Từ bài viết trước đến nay

Đã 1 năm kể từ [bài viết trước](https://developers.cyberagent.co.jp/blog/archives/50117/).

Trích dẫn từ bài viết đó:

> Chúng tôi đã quyết định triển khai rộng rãi đợt thứ hai "for Developers" để các engineer nhân viên của CyberAgent Group có thể sử dụng AI một cách thành thạo và ứng dụng vào phát triển sản phẩm.
> 
> Ngay cả trong khi viết bài này, chúng tôi vẫn đang tích cực cải tiến curriculum.
> 
> (...)
> 
> **Khi đạt đến một milestone, tôi hy vọng sẽ có thể báo cáo lại tại đây.**

Sau đó, sau khi kết thúc **round thứ 5** của "生成AI徹底理解リスキリング for Developers", sau 1 năm, cuối cùng chúng tôi đã đạt được một milestone. Hành trình sau đó được thể hiện trong sơ đồ dưới đây:

**Sơ đồ: Hành trình của initiative**

![施策の歩み](journey_diagram)

Bài viết này sẽ nói về việc **lặp lại thực hiện đào tạo nội bộ quy mô lớn dành cho IT Engineers**. Hy vọng rằng những ai đọc bài này có thể tham khảo điều gì đó cho công việc mà họ sẽ thực hiện.

---

## 🎯 "for Developers" được thực hiện nhiều lần vs các initiatives chỉ thực hiện 1 lần

Sự khác biệt giữa 3 loại initiatives được thực hiện dưới tên "生成AI徹底理解リスキリング" như bảng dưới đây:

**Bảng: Sự khác biệt giữa 3 initiatives**

| Initiative | Đối tượng | Mục tiêu | Số lần thực hiện |
|------------|-----------|----------|-----------------|
| **for Everyone** | 全職種・全社員<br>(Tất cả chức danh, toàn công ty) | Có thể tạo ý tưởng ứng dụng dựa trên kiến thức (prompt engineering, xu hướng LLM, security) | **1 lần** |
| **for Developers** | エンジニア職<br>(Engineer - phát triển sản phẩm) | Có thể tích hợp LLM vào sản phẩm (LangChain, LlamaIndex, CALM) | **5 lần** (～約1000名) |
| **for ML/DS** | 機械学習エンジニア・データサイエンティスト<br>(ML Engineers, Data Scientists) | Có thể thúc đẩy một cycle nhất định trong việc sử dụng LLM (model building, selection, tuning, training) | **1 lần** |

Ba initiatives được thực hiện theo thứ tự từ chuyên môn nông nhất: **"for Everyone" → "for Developers" → "for ML/DS"**.

Sau khi hoàn thành 1 vòng, chúng tôi lặp lại **"for Developers"** (dành cho engineers phát triển sản phẩm) đến **lần thứ 5**, nhưng **"for Everyone"** (toàn công ty) và **"for ML/DS"** (ML engineers và data scientists) chỉ thực hiện **1 lần rồi kết thúc**.

### ❓ Tại sao có sự khác biệt này?

Lý do có thể tóm gọn trong 2 điểm:

1. **Nhu cầu (Needs)**
2. **Hiệu quả chi phí (Cost-effectiveness)**

#### 📌 "for Everyone"

Là initiative hướng đến **tất cả nhân viên bất kể chức danh**.

Để thấm nhuần ý chí mạnh mẽ của top management **"Mục tiêu trở thành leading company ngay cả trong kỷ nguyên AI"** đến toàn thể nhân viên, và tạo ra bầu không khí mà việc sử dụng generative AI trở nên bình thường, chúng tôi đã thực hiện **chỉ 1 lần**.

Sau đó:
- ✅ Các case study về AI utilization liên tục được thêm vào portal site nội bộ
- ✅ Các study sessions nội bộ phù hợp với nhu cầu của từng chức danh/business được tổ chức ở nhiều departments
- ✅ Thế giới bên ngoài tràn ngập content và services phù hợp với đa dạng nhu cầu học tập
- ✅ Môi trường mà ai có động lực đều có thể học ở bất cứ đâu đã được thiết lập

→ Vì vậy, chúng tôi đánh giá **không cần round 2** cho việc triển khai toàn công ty "for Everyone".

#### 📌 "for ML/DS"

Nhu cầu cho curriculum tập trung vào **model building và tuning của LLM đang giảm**, nên chỉ thực hiện **1 lần rồi kết thúc**.

#### 📌 "for Developers"

Ban đầu chúng tôi **không có kế hoạch cụ thể** cho round 2 trở đi, nhưng nhận được yêu cầu từ **ABEMA** (một trong những business trọng điểm), nên đã quyết định thực hiện round 2.

**Trigger:** Direct message trong internal chat:

> "Những thành viên đã tham gia nói rằng initiative này rất tốt, tôi muốn cho tất cả engineers của chúng tôi tham gia, liệu điều này có khả thi không..."

→ Nghĩa là trong 3 initiatives, **chỉ "for Developers" có nhu cầu thực hiện từ round 2 trở đi**, và là initiative có thể mong đợi **cost-effectiveness khi thực hiện lặp lại**.

---

## 🔧 Giữ nguyên biển hiệu nhưng xây dựng lại nội dung

### Round 2: Thiết kế lại cho ABEMA

**Đối tượng Round 2:** Hơn 100 engineers thuộc ABEMA (toàn bộ)

Sau reflection của round 1 và dựa trên insights thu được khi thực hiện ["for ML/DS"](https://developers.cyberagent.co.jp/blog/archives/50117/), chúng tôi đã **thiết kế lại** để tăng effectiveness.

**Vai trò của Reskilling Center:** Chỉ **1 thành viên** xử lý design, preparation và operation. Phần lớn công việc được thực hiện bởi **operation members được chọn từ tổ chức tham gia**.

### 🎯 3 điểm cần lưu ý khi thiết kế lại

1. ✅ **Ownership của operation và learning** (自分ごと化)
2. ✅ **Curriculum và schedule phù hợp với available time của learners**
3. ✅ **Material creation phù hợp với needs**

**Kết quả:** Tất cả hơn 100 learners của round 2 đều **hoàn thành curriculum mà không dropout** giữa chừng.

### 📊 Bảng: Redesign cho "Round 2 for Developers"

| Aspect | Round 1 | Round 2 |
|--------|---------|---------|
| **Curriculum Structure** | eラーニング + 1Day開発イベント | eラーニング + 1Day開発イベント (giữ nguyên "hộp") |
| **Overall Design** | Initial design | Thiết kế lại toàn bộ |
| **Materials** | External (Udemy) | Adjusted/revised theo needs |
| **Operation** | Reskilling Center | Operation members từ target org |
| **Ownership** | Low | High (自分ごと化) |

---

## 🔄 Agile Development của Curriculum và Materials

### Continuous Improvement Approach

Về cấu trúc curriculum và materials, chúng tôi đã **liên tục revise** sau mỗi lần thực hiện, giống như **agile development**, với ý thức:
- ✅ Nâng cao **chất lượng học tập**
- ✅ Thu hẹp **số lượng** và tăng **độ đậm đặc**

### 📥 Input Sources cho Revision

**1. Post-completion Survey của learners:**
- 📊 Quantitative/qualitative feedback về learning effectiveness
- ⏱️ Quantitative/qualitative feedback về training time
- 🎯 Quantitative/qualitative feedback về operation methods

**2. Opinions từ Operation Members:**
- 🌐 Thay đổi technology trends của thế giới
- 🏢 Thay đổi needs nội bộ

### 🏗️ In-house Materials từ Round 3

Để đảm bảo **flexibility và speed** của revision, từ **round 3 trở đi**, chúng tôi đã chuyển **toàn bộ main materials sang in-house production**.

**Lý do in-house:**
- ⚡ Revision nhanh chóng
- 🎯 Phù hợp với nhu cầu cụ thể
- 💰 Xem xét workload của learners (phần lớn "cost" của training)
- 📚 Materials đậm đặc với kiến thức cần thiết tối thiểu trong thời gian ngắn

### 📊 Bảng: Evolution của Curriculum và Materials

| Round | Target Org | Participants | Curriculum |
|-------|-----------|--------------|------------|
| **Round 1** | メディア&IP事業 一部 | Vài chục người | eラーニング(Udemy) + 1Day開発イベント |
| **Round 2** | ABEMA | 100+ người | eラーニング(Udemy) + 1Day開発イベント |
| **Round 3** | メディア&IP & ゲーム事業 | - | **内製eラーニング** + 1Day開発イベント |
| **Round 4** | メディア&IP & ゲーム事業 | - | 内製eラーニング + **オンラインハンズオン(Cursor)** + 1Day開発イベント |
| **Round 5** | 広告事業 & バックオフィス | - | 内製eラーニング + **オンラインハンズオン(MCP)** + 1Day開発イベント |
| **25新卒Tech** | 新卒エンジニア入社研修 | - | Round 3 materials |

### 🔧 Technologies Used

- **Udemy:** Dịch vụ học video online lớn nhất thế giới
- **Google Colab:** Service cho phép viết và chạy Python code trên browser
- **MCP (Model Context Protocol):** Quy tắc chung hoặc service cung cấp quy tắc để kết nối applications và AI models
- **Cursor:** Coding Agent
- **1Day開発イベント:** Challenge Camp (xem [bài viết round 1](https://developers.cyberagent.co.jp/blog/archives/46702/))

### 📋 Round 5 Curriculum Structure

**Final Form:**
1. 📚 **eラーニング** (In-house): OpenAI API basics
2. 💻 **オンラインハンズオン** (MCP): Coding agent experience
3. 🏆 **1Day開発イベント**: Design & implementation với research problems

---

## 🎯 Quyết định thứ tự thực hiện bằng cách giải thích Target và Effectiveness

### Approach sau Round 2

Sau khi xác nhận có **nhu cầu nhất định** trong công ty qua round 2, để thực hiện từ round 3 trở đi, chúng tôi đã:

1. 📋 Pick up các organizations chính mà engineers thuộc về
2. 🗣️ Giải thích tuần tự cho các candidates được cho là training managers về:
   - Mục đích của initiative
   - Thành tích và hiệu quả đến thời điểm đó
   - Main target của training
   - Schedule, curriculum, và materials
   - Chi phí và human resources cần thiết từ phía target organization

### 🎯 Main Target

**"Engineers phát triển sản phẩm mà việc catch-up technology chưa tiến triển"**

- Mục tiêu: Bottom-up skills của toàn công ty về sử dụng LLM
- Phổ cập kỹ năng sử dụng LLM

### 📊 Kết quả

Dự định chỉ thực hiện training cho các organizations:
- ✅ Có nhu cầu tham gia
- ✅ Có thể đảm nhận human resource burden cho operation members

**Nhưng:** Nhận được requests từ **hầu hết tất cả** các organizations được giải thích → Tiếp tục training **không ngừng** cho đến "round 5 for Developers" cuối cùng.

### 🤔 Tại sao không thực hiện đồng loạt?

Mặc dù nhận được requests từ hầu hết organizations, có thể chọn phương án thực hiện đồng loạt cho tất cả như "for Everyone", nhưng chúng tôi đã **chia nhỏ theo business** vì 2 lý do:

1. ⚠️ **All targets cùng lúc dành thời gian cho training = Công việc của all targets dừng cùng lúc**
2. 📅 **Mỗi business/org có busy season khác nhau** → Nhiều cơ hội tham gia dễ học hơn

### 📋 Thứ tự thực hiện

**Factors được xem xét:**
- 🔥 Mức độ mạnh mẽ của implementation needs từ training manager
- 📈 Organization cần bottom-up nhiều nhân viên hơn
- 🏢 Business department hay back-office department

**Implementation Order:**
1. **Trước:** Media & IP Business và Game Business
2. **Sau:** Back-office (All-company functions) và Advertising Business (đã vận hành nhiều sản phẩm sử dụng AI)

---

## 👥 Khiến nhiều learners trở thành "Người học" (学習者)

### 4 loại participants trong training

Nói chung, có 4 loại participants trong training:

1. 📚 **学習者 (Learner)** - Người học thực sự
2. 🤝 **社交家 (Socializer)** - Người giao tiếp
3. 😴 **休暇中の人 (Vacationer)** - Người nghỉ ngơi
4. ⛓️ **囚人 (Prisoner)** - Người bị giam

Khi cung cấp training cho nhân viên công ty, đương nhiên chúng ta muốn **nhiều nhân viên tham gia với tư cách "Learner"** nhất có thể.

### 💪 Executive Commitment

Tháng 10/2024, tại tech conference của công ty, Chuyên vụ giám đốc điều hành phụ trách kỹ thuật Nagase đã công bố:

🎯 **Slogan:** 『AIの発展を会社の競争力とする』("Biến sự phát triển của AI thành sức cạnh tranh của công ty")

📊 **Quantitative Goal:** [Mục tiêu định lượng về đào tạo engineers có thể sử dụng thành thạo AI](https://d1kdu080g8vme4.cloudfront.net/files/topics/30952_ext_24_16.png)

![AI Competition](ai_competition_diagram)

### 📢 Messaging Strategy

Chúng tôi đã kết hợp:
- 💪 **Strong message** từ top management về tập trung vào "Đào tạo engineers có thể sử dụng thành thạo AI"
- 🎯 **High goal** "牽引業界" (Lead the industry) của "生成AI徹底理解リスキリング"

→ Truyền đạt ngầm cho learners về "cách họ nên hành xử", khiến họ dành thời gian cho training trong khoảng 1.5 tháng.

![Purpose Diagram](purpose_diagram)

### 🔄 4 cơ hội truyền đạt message

Để nhiều nhân viên tham gia training với tư cách "Learner", chúng tôi đã **lặp lại truyền đạt** message trên tại 4 thời điểm từ trước khi bắt đầu:

1. 📋 **研修開始前の説明会** - Briefing trước training
2. 💻 **オンラインハンズオン当日の前説時間** - Introduction tại online hands-on
3. 🏆 **1Day開発イベントの事前説明会** - Briefing trước 1-day event
4. 🎯 **1Day開発イベント当日の前説時間** - Introduction tại 1-day event

![Schedule](schedule_diagram)

### ✅ Hiệu quả

Từ các comments trong post-completion survey (tùy chọn), chúng tôi đánh giá rằng hiệu quả của việc **lặp lại truyền đạt** đã đạt được **một mức độ nhất định**.

---

## 🚀 Sự tiến bộ của thế giới và sự thay đổi nhu cầu nội bộ

### ⏱️ Thời gian: 1.5 năm

Trong khoảng hơn 1.5 năm thực hiện engineer training "生成AI徹底理解リスキリング":
- ✅ Công nghệ AI đã tiến bộ
- ✅ Tình trạng implementation xã hội thay đổi lớn

**Impact lớn nhất cho engineers:** Sự tiến hóa và phổ biến của **AI Agents**

### 🔄 Response của curriculum

Trong quá trình lặp lại "for Developers":
- ✅ Đưa curriculum về AI Agents vào
- ✅ Update materials mỗi lần

### 📊 Assessment sau Round 5

Sau khi kết thúc round 5, chúng tôi đánh giá:

> Thời điểm "vàng" để cung cấp cơ hội học tập với curriculum và materials được chuẩn bị sẵn dưới phương thức "training" nhằm mục đích **bottom-up skills toàn công ty** đã qua, và đã chuyển sang **giai đoạn tiếp theo**.

### 📝 Tổng đánh giá (từ tài liệu reflection cho operation members)

> **"生成AI徹底理解リスキリング for Developers"** nhằm mục đích giúp learners có thể đảm nhận design và implementation các features tích hợp LLM, với **main target** là những engineer nhân viên phát triển sản phẩm mà **technology catch-up chưa tiến triển**, nhằm mục tiêu **bottom-up và phổ cập skills sử dụng LLM toàn công ty**.
>
> Từ round 1 đến round 5, chúng tôi đã brush up materials mỗi lần theo sự tiến bộ của technology thế giới và needs nội bộ, từ cấu trúc curriculum 2 giai đoạn ban đầu: "Technology input (eラーニング)" và "Output để củng cố (1Day開発イベント)", sang cấu trúc 3 giai đoạn từ round 4 với "Work process update (Online hands-on về coding agents)" ở giữa, và đã **cung cấp cơ hội training cho gần như toàn bộ khoảng 1000 engineers cần support về technology catch-up**.
>
> Từ khi thực hiện round 1 vào Q2 năm 24 cho đến khi kết thúc round 5 lần này, đã qua hơn 1.5 năm, cả thế giới và nội bộ công ty đều tiến triển trong việc sử dụng AI vào products, và việc sử dụng coding agents để nâng cao production efficiency cũng đã vượt qua "chasm" và bước vào giai đoạn phổ biến.

### 🔄 Nhu cầu đã thay đổi như thế nào?

#### 📚 eラーニング: Học API basics để sử dụng OpenAI AI models

**Trước:**
- ❓ "API có thể làm gì?"
- 📖 Học kiến thức cơ bản

**Bây giờ:**
- ✅ Đã có một số người có experience sử dụng API
- ✅ Có experience với APIs của Google và các công ty khác
- 🎯 **Nhu cầu shift sang: Học cách apply**

#### 💻 オンラインハンズオン: Experience implementation với coding agents

**Trước:**
- 📖 Hiểu general use cases

**Bây giờ:**
- ✅ Đa số đã từng sử dụng coding agent ít nhất 1 lần
- ✅ Số người sử dụng hàng ngày tăng lên
- 🎯 **Cần triển khai know-how cụ thể, practical, và phù hợp với tình hình nội bộ**

#### 🏆 1Day開発イベント: Design và implementation với research problems

**Trước:**
- 📚 Company-prepared training với standard problems

**Bây giờ:**
- ✅ Với coding agents, có thể implement minimum viable trong 1 giờ
- ✅ YouTube có nhiều video free rất hữu ích
- 🎯 **Hiệu quả hơn khi dành thời gian tackle problems của actual products ngay lập tức, sau khi tự chuẩn bị theo judgment cá nhân**

### ✅ Kết luận

Vì hai lý do:
1. ✅ **Đối tượng đã được training một vòng**
2. ✅ **Nhu cầu đã thay đổi do tiến bộ và phổ biến của technology**

→ **"生成AI徹底理解リスキリング for Developers" đã hoàn thành vai trò của mình.**

### 🔮 Hướng đi tiếp theo

Nếu tiếp tục initiatives thúc đẩy sử dụng AI models và AI tools:

🎯 **Cần nội dung practical hơn, phù hợp với tình hình nội bộ hơn để đáp ứng needs**

---

## 📊 Tự đánh giá "生成AI徹底理解リスキリング" dành cho Engineers

### 📋 Survey Method

Learners được yêu cầu:
- 📝 **Pre-training survey:** Trả lời goal của mình
- 📊 **Post-training survey:** Tự đánh giá achievement degree (5-point scale)

**Hình: Goal Achievement Degree của Round 5**

![Achievement Survey](achievement_survey_diagram)

### 🌟 Tự đánh giá của initiative

Giống như learners đã trả lời, tôi muốn tự đánh giá kết quả của engineer initiative "生成AI徹底理解リスキリング" trên **5-point scale**.

### ⭐⭐⭐⭐⭐ Tự đánh giá: "5"

### 🏆 Căn cứ cho tự đánh giá

Mặc dù đây là những điều **đương nhiên phải làm** trong công việc, nhưng là những điều **đa số người bao gồm cả tôi không thể làm được triệt để**, trong hơn 1.5 năm, cùng với operation members của mỗi round, chúng tôi đã:

1. ✅ **Tiếp tục cải thiện mà không ngừng suy nghĩ, quay vòng PDCA**
2. ✅ **Linh hoạt thay đổi theo xu hướng thời đại (時流) và xu hướng công ty (社流)**
3. ✅ **Hiển thị và truyền đạt kết quả và thành quả**

→ Tạo ra **visible results** và có thể đề xuất **những điều cần thực hiện tiếp theo** dựa trên kết quả đó.

### 🎯 Alignment với Corporate Vision

Đối với vision **"Thực hiện môi trường mà nhân viên có năng lực có thể làm việc lâu dài"** trong [Mission Statement](https://www.cyberagent.co.jp/corporate/vision/) của công ty chúng tôi, chúng tôi đã có thể thực hiện action cụ thể: **Cung cấp cơ hội học tập cần thiết**.

---

## 💭 Vậy đã trở thành "Trạng thái dẫn đầu ngành với Generative AI" chưa?

### 📅 Timeline

"生成AI徹底理解リスキリング" đã thực hiện khoảng **2 năm** kể từ "for Everyone" cho toàn công ty.

Trong thời gian đó:
- ✅ Tổ chức **"あした会議"** và **"技術者版あした会議"** 2 lần
- ✅ Nhiều initiatives toàn công ty khác liên quan đến AI được approve và thúc đẩy
- ✅ Từ **"AIドリブン"** (AI-driven) được sử dụng thường xuyên
- ✅ [Tổ chức chuyên môn thúc đẩy sử dụng AI cho engineers được thành lập](https://www.cyberagent.co.jp/news/detail/id=32271)

### 🎯 Goal: "生成AIで業界を牽引する" (Lead the industry với Generative AI)

Chúng tôi đã thực hiện initiatives cho engineers với goal này.

**Vậy đã đạt được bao nhiêu phần trăm goal?**

### 🤔 Không tự đánh giá

Giống như corporate vision **"Tạo ra công ty đại diện cho thế kỷ 21"**, đây không phải là điều có thể tự đo lường được.

Vì vậy, về việc có **"dẫn đầu ngành với Generative AI"** hay không, tôi sẽ **không tự đánh giá**.

Nếu có cơ hội gặp mặt đâu đó, tôi rất mong nhận được **đánh giá khách quan** từ những người đọc bài viết này.

### 🙏 Lời cảm ơn

Cảm ơn bạn đã đọc đến cuối cùng.

> **Khi "những điều cần thực hiện tiếp theo" được hiện thực hóa và đạt đến một milestone, tôi hy vọng sẽ báo cáo lại tại đây.**

---

## 📚 Tài liệu tham khảo (Related Articles)

1. **[2024/02/07] 【完全解説】サイバーエージェントの生成AI戦略**
2. **[2024/10/31] AIの発展をサイバーエージェントの競争力とするために**
3. **[2024/12/20] 2025年末には全エンジニアの半数がAIを駆使できる開発組織に**
4. **[2023/11/06] サイバーエージェント、全社的なAI人材育成に向けて「生成AI徹底理解リスキリング」をスタート**
5. **[2023/12/23] 全社員・役員が受講！「生成AI徹底理解リスキリング」 – 6300名、99.6%完了の裏側**
6. **[2024/03/27] 約1カ月の研修期間でエンジニア社員がLLMを組み込んだ機能を大量に実装出来た理由**
7. **[2024/10/21] 3か月の研修の間に1人も離脱することなくオリジナルの研修カリキュラムを受講した社員がLLM活用のプロフェッショナルとしての成長が出来た話**
8. **[2025/08/01] 生成AI最前線企業が設計する、AIネイティブ時代の新卒エンジニア研修**

---

## 🎯 Key Takeaways

### ✨ Những điểm quan trọng từ 1.5 năm thực hiện

#### 📊 Numbers

- 🎓 **~1000 engineers** được training
- 🔄 **5 rounds** của "for Developers"
- ⏱️ **1.5+ năm** thực hiện liên tục
- 💯 **100%** completion rate (Round 2 - ABEMA)
- 🎯 **0%** dropout rate khi thiết kế đúng

#### 🏆 Success Factors

1. **Ownership Strategy**
   - Operation members từ target organization
   - Self-driven learning mindset
   - Strong executive messaging

2. **Agile Approach**
   - Continuous revision after each round
   - Input từ surveys và operation members
   - In-house materials từ Round 3

3. **Curriculum Evolution**
   - Round 1-2: eラーニング + 1Day Event
   - Round 4-5: eラーニング + Online Hands-on + 1Day Event
   - Thêm AI Agents training

4. **Timing & Flexibility**
   - Chia nhỏ theo business units
   - Tránh all-at-once approach
   - Xem xét busy seasons

#### 🔄 Evolution of Needs

| Phase | Focus | Status |
|-------|-------|--------|
| **Early** | API basics | ✅ Hoàn thành |
| **Middle** | LLM integration | ✅ Đạt scale |
| **Current** | Practical know-how | 🎯 Next phase |
| **Future** | Product-specific solutions | 🚀 Upcoming |

#### 💡 Lessons Learned

**When to Continue:**
- ✅ Strong needs từ multiple organizations
- ✅ Cost-effectiveness được verify
- ✅ Clear target audience
- ✅ Measurable outcomes

**When to Stop:**
- ⏹️ Target audience completed one round
- ⏹️ External learning resources abundant
- ⏹️ Needs shifted to more practical/specific
- ⏹️ "旬" (prime time) đã qua

#### 🎓 Training Design Principles

1. **Make it Relevant**
   - Phù hợp với actual work
   - Consider available time
   - Match internal situations

2. **Ensure Ownership**
   - Operation members từ target org
   - Self-driven participation
   - Clear goals and metrics

3. **Stay Agile**
   - Revise continuously
   - Listen to feedback
   - Adapt to tech evolution

4. **Communicate Repeatedly**
   - 4+ touchpoints với learners
   - Strong executive messaging
   - Clear purpose và goals

### 🚀 Looking Forward

**Next Phase Requirements:**
- 🎯 More **practical** content
- 🏢 Better fit với **internal situations**
- 🔧 **Product-specific** solutions
- 👥 **Self-driven** learning support

---

## 💬 Kết luận

Đây là câu chuyện về việc CyberAgent đã tạo ra cơ hội học tập cho **~1000 engineers** trong **1.5+ năm** với initiative "生成AI徹底理解リスキリング for Developers".

**Key Messages:**

1. ✅ **Agile approach** cho training design works
2. ✅ **Ownership** từ target organization là critical
3. ✅ **Continuous evolution** theo tech và needs là necessary
4. ✅ **Knowing when to stop** là important như knowing when to start
5. ✅ **Strong executive commitment** tạo environment cho success

**Corporate Alignment:**

Initiative này đã contribute vào vision **"Môi trường mà nhân viên có năng lực có thể làm việc lâu dài"** bằng cách cung cấp **cơ hội học tập cần thiết** trong kỷ nguyên AI.

**Self-Assessment: ⭐⭐⭐⭐⭐**

Vì đã có thể:
- Quay vòng PDCA không ngừng
- Thay đổi linh hoạt theo thời đại
- Hiển thị results và đề xuất next steps

Hẹn gặp lại trong bài viết tiếp theo khi "next phase" được realize! 🚀

URL: https://developers.cyberagent.co.jp/blog/archives/59240/
TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
