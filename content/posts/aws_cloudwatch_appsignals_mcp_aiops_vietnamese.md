---
title: "Tăng cường AIOps – Giới thiệu Amazon CloudWatch và Application Signals MCP Servers"
date: 2025-11-07
draft: false
categories:
  - "Business & Technology"
  - "DevOps & Infrastructure"
tags:
  - "AWS"
  - "CloudWatch"
  - "AIOps"
  - "MCP"
  - "Application Signals"
  - "Observability"
  - "AI"
  - "Technical How-to"
author: "Raviteja Sunkavalli, Joe Alioto, Matheus Arrais"
translator: "日平 (Hibira)"
description: "Hướng dẫn sử dụng Amazon CloudWatch và Application Signals MCP Servers để tăng cường khả năng AIOps và troubleshooting với AI"
---

**Tác giả bản gốc:**  
- Raviteja Sunkavalli - Senior Worldwide Specialist Solutions Architect (AIOps & Generative AI Observability)
- Joe Alioto - Senior Specialist Solutions Architect (Cloud Operations)
- Matheus Arrais - WW Tech Leader (Cloud Operations)

**Dịch giả:** 日平 (Hibira) - Technical Account Manager  
**Nguồn:** AWS Blog (Japan)

---

## Tổng quan

Trong các kiến trúc hiện đại, lượng dữ liệu observability khổng lồ được tạo ra trên các metrics, logs và traces. Khi vấn đề xảy ra, các team phải mất hàng giờ, thậm chí hàng ngày để liên kết thông tin thủ công trên nhiều dashboard nhằm xác định nguyên nhân gốc rễ, điều này ảnh hưởng trực tiếp đến thời gian sửa chữa trung bình (MTTR) và năng suất.

Kết hợp AI tạo sinh với bộ công cụ mạnh mẽ này cho phép xác định nguyên nhân gốc rễ nhanh hơn nữa. Đây là lúc **Model Context Protocol (MCP)** của Anthropic xuất hiện - một giao thức nguồn mở chuẩn hóa cách ứng dụng cung cấp ngữ cảnh cho các mô hình ngôn ngữ lớn (LLM).

MCP biến đổi việc troubleshooting các hệ thống phức tạp bằng cách kết nối trực tiếp dữ liệu observability với các mô hình AI, cho phép phân tích thông minh và nhận biết ngữ cảnh, giảm đáng kể thời gian điều tra.

---

## Thông báo chính

**Ngày phát hành:** 8 tháng 7 năm 2025

AWS đã phát hành **2 MCP server mới** cho Amazon CloudWatch và Application Signals. Các MCP server này tích hợp liền mạch với nhiều AI assistant khác nhau như:
- **Amazon Q Developer CLI**
- **Claude Code**
- **GitHub Copilot**
- Và các AI assistant khác

Cho phép tương tác với dữ liệu observability bằng **ngôn ngữ tự nhiên**.

**Link thông báo:** [https://aws.amazon.com/jp/about-aws/whats-new/2025/07/amazon-cloudwatch-application-signals-mcp-servers-for-ai-assisted-troubleshooting/](https://aws.amazon.com/jp/about-aws/whats-new/2025/07/amazon-cloudwatch-application-signals-mcp-servers-for-ai-assisted-troubleshooting/)

---

## Giới thiệu về các MCP Server

### 1. Amazon CloudWatch MCP Server

**Chức năng:**
- Nền tảng tích hợp để tương tác với bộ công cụ giám sát và observability mạnh mẽ của CloudWatch
- Phản ứng sự cố dựa trên alarm
- Đề xuất alarm
- Phân tích metrics và logs
- Phát hiện log pattern

**GitHub Repository:** [https://github.com/awslabs/mcp/tree/main/src/cloudwatch-mcp-server](https://github.com/awslabs/mcp/tree/main/src/cloudwatch-mcp-server)

### 2. Application Signals MCP Server

**Chức năng bổ sung cho CloudWatch MCP Server:**
- Giám sát sức khỏe dịch vụ
- Phân tích metrics hiệu suất
- Theo dõi tuân thủ Service Level Objectives (SLO)
- Điều tra vấn đề sử dụng distributed tracing

**GitHub Repository:** [https://github.com/awslabs/mcp/tree/main/src/cloudwatch-appsignals-mcp-server](https://github.com/awslabs/mcp/tree/main/src/cloudwatch-appsignals-mcp-server)

---

## Model Context Protocol (MCP) là gì?

**Nhà phát triển:** Anthropic  
**Loại:** Giao thức nguồn mở

**Mô tả:**
- Chuẩn hóa cách ứng dụng cung cấp ngữ cảnh cho Large Language Models (LLM)
- Kết nối trực tiếp dữ liệu observability với các mô hình AI
- Biến đổi troubleshooting của hệ thống phức tạp
- Cho phép phân tích thông minh và nhận biết ngữ cảnh
- Giảm đáng kể thời gian điều tra

**Link:** [https://modelcontextprotocol.io/docs/getting-started/intro](https://modelcontextprotocol.io/docs/getting-started/intro)

---

## Yêu cầu trước khi bắt đầu

### 1. Tài khoản AWS với ứng dụng đã tích hợp CloudWatch
Chuẩn bị tài khoản AWS có ứng dụng thu thập telemetry (metrics, traces, logs) vào Amazon CloudWatch.

**Tài liệu:** [What Is Amazon CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)

### 2. Kích hoạt Application Signals
Kích hoạt Application Signals cho ứng dụng của bạn.

**Tài liệu:** [CloudWatch Application Monitoring](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)

### 3. Thiết lập AWS Credentials với quyền tối thiểu

**Nguyên tắc:**
- Tuân theo nguyên tắc **least privilege** (quyền tối thiểu)
- Chỉ cấp quyền cần thiết để MCP server truy cập dữ liệu CloudWatch metrics
- Đảm bảo CloudWatch và Application Signals MCP server có thể truy cập và vận hành AWS resources một cách an toàn

**Tài liệu quyền IAM:**
- CloudWatch MCP Server: [Required IAM Permissions](https://github.com/awslabs/mcp/tree/main/src/cloudwatch-mcp-server#required-iam-permissions)
- Application Signals MCP Server: [Required AWS Permissions](https://github.com/awslabs/mcp/tree/main/src/cloudwatch-appsignals-mcp-server#required-aws-permissions)

**Tài liệu AWS Credentials:** [Configuring the AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/v1/userguide/cli-configure-files.html)

---

## Thiết lập môi trường

### Best Practices trước khi bắt đầu

Trước khi bắt đầu thiết lập, việc cấu hình observability phù hợp rất quan trọng. Hãy tuân theo các best practice sau:

#### 1. Kích hoạt CloudWatch Alarms
**Lý do:** Để Amazon Q CLI có thể hiểu và phản hồi queries hiệu quả.

**Cách tạo CloudWatch Alarm:**  
[CloudWatch Alarms Documentation](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)

#### 2. Định nghĩa SLO trong Application Signals
**Lý do:** Sau khi kích hoạt Application Signals, định nghĩa Service Level Objectives (SLO) để có được insight sâu hơn về hiệu suất và hành vi của ứng dụng.

**Tài liệu:**  
[How to monitor application health using SLOs with Amazon CloudWatch Application Signals](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)

#### 3. Gửi CloudTrail events đến CloudWatch Log Groups
**Lý do:** Tích hợp CloudTrail và CloudWatch Log Groups cho phép Amazon Q CLI truy cập góc nhìn toàn diện về infrastructure, cung cấp phản hồi chính xác hơn và phù hợp với ngữ cảnh.

**Tài liệu:**  
[Sending Events to CloudWatch Logs](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)

**Kết quả:** Tuân theo các best practice này đảm bảo Amazon Q Developer CLI có thể truy cập dữ liệu telemetry cần thiết và cung cấp phản hồi chính xác, nhận biết ngữ cảnh khi troubleshooting và phân tích AWS resources.

---

## Bước 1: Thiết lập Amazon Q Developer CLI

### 1.1. Cài đặt Amazon Q Developer CLI
Cài đặt Amazon Q Developer CLI vào hệ thống của bạn.

**Tài liệu:** [Installing Amazon Q Developer CLI](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/command-line-installing.html)

### 1.2. Cài đặt uv utility
Cài đặt uv utility từ Astral hoặc GitHub README.

**Nguồn:**
- Astral: [https://docs.astral.sh/uv/getting-started/installation/](https://docs.astral.sh/uv/getting-started/installation/)
- GitHub: [https://github.com/astral-sh/uv#installation](https://github.com/astral-sh/uv#installation)

### 1.3. Cài đặt Python 3.10
Sử dụng uv utility để cài đặt Python phiên bản 3.10.

```bash
uv python install 3.10
```

---

## Bước 2: Cấu hình MCP Servers

### 2.1. Chọn cấp độ cấu hình MCP

Amazon Q Developer CLI hỗ trợ 2 cấp độ cấu hình MCP:

#### Option 1: Cấu hình Global
- **Đường dẫn:** `~/.aws/amazonq/mcp.json`
- **Phạm vi:** Áp dụng cho tất cả workspace

#### Option 2: Cấu hình Workspace
- **Đường dẫn:** `.amazonq/mcp.json`
- **Phạm vi:** Riêng cho workspace hiện tại

### 2.2. Thêm cấu hình vào file mcp.json

Chọn cấp độ cấu hình ưa thích và thêm cấu hình CloudWatch và Application Signals MCP server sau vào file `mcp.json` tương ứng.

**Lưu ý quan trọng:** Thay thế placeholder `AWS_PROFILE` và `AWS_REGION` bằng AWS profile và region cụ thể của bạn.

```json
{
  "mcpServers": {
    "awslabs.cloudwatch-mcp-server": {
      "autoApprove": [],
      "disabled": false,
      "command": "uvx",
      "args": [
        "awslabs.cloudwatch-mcp-server@latest"
      ],
      "env": {
        "AWS_PROFILE": "Add your AWS Profile",
        "AWS_REGION": "Add your AWS Region",
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "transportType": "stdio"
    },
    "awslabs.cloudwatch-appsignals-mcp-server": {
      "autoApprove": [],
      "disabled": false,
      "command": "uvx",
      "args": [
        "awslabs.cloudwatch-appsignals-mcp-server@latest"
      ],
      "env": {
        "AWS_PROFILE": "Add your AWS Profile",
        "AWS_REGION": "Add your AWS Region",
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "transportType": "stdio"
    }
  }
}
```

**Hoàn thành thiết lập!**  
Sau khi hoàn tất cài đặt Amazon Q CLI, cấu hình AWS credentials và thiết lập MCP server, bạn có thể bắt đầu troubleshooting và phân tích AWS resources thông qua queries bằng ngôn ngữ tự nhiên với CloudWatch và Application Signals MCP servers.

---

## Bước 3: Tương tác với Amazon Q CLI

### 3.1. Bắt đầu tương tác

Khởi động tương tác với lệnh `q chat`:

```bash
q chat
```

### 3.2. Xác nhận cấu hình MCP server

#### Kiểm tra MCP server đã được tải
Chạy lệnh `/mcp` để xác nhận MCP server được tải đúng cách như hình 1.

```
/mcp
```

**Hình 1. Xác nhận MCP server đã được tải**

#### Kiểm tra công cụ có sẵn
Sử dụng lệnh `/tools` để xác nhận các công cụ và chức năng có sẵn như hình 2.

```
/tools
```

**Hình 2. Danh sách các công cụ có sẵn**

### 3.3. Khám phá khả năng

Hỏi "What questions can I ask about CloudWatch or Application Signals MCP Servers?" để hiểu toàn bộ phạm vi chức năng có sẵn và các queries có thể thực hiện như hình 3.

```
What questions can I ask about CloudWatch or Application Signals MCP Servers?
```

**Hình 3. Khám phá khả năng của CloudWatch và Application Signals MCP servers**

---

## Ví dụ thực tế – Xác định và giải quyết vấn đề quyền truy cập

### Kịch bản

Team DevOps nhận được cảnh báo về nhiều lỗi xảy ra trong dịch vụ đặt hàng quan trọng, có thể gây ra gián đoạn cho hoạt động kinh doanh. Team cần nhanh chóng:

1. **Xác định nguyên nhân gốc rễ** của lỗi
2. **Xác định thời điểm** vấn đề bắt đầu
3. **Xác định người** thực hiện thay đổi gây ra vấn đề
4. **Thực hiện sửa chữa** cần thiết

---

### Cách tiếp cận truyền thống

Troubleshooting vấn đề quyền truy cập thường đòi hỏi:
- **Phân tích log tốn thời gian**
- **Thử và sai (trial-and-error testing)**
- **Điều tra chi tiết IAM policy**

Ngay cả khi hiểu rõ kiến trúc ứng dụng, công việc này **tốn thời gian và gây bực bội**.

---

### Troubleshooting thông minh với Amazon Q CLI

#### Bước 1: Xác định nguyên nhân gốc rễ

**Query:**
```
review my ordering-service and provide remediation steps and an RCA for the cause of the faults
```
_(dịch: xem xét dịch vụ đặt hàng của tôi và cung cấp các bước khắc phục cũng như RCA cho nguyên nhân của các lỗi)_

**Hoạt động của Amazon Q CLI:**

Amazon Q CLI tận dụng Application Signals MCP server để cung cấp khả năng troubleshooting toàn diện thông qua cách tiếp cận thông minh và tự động hóa như hình 4.

**Hệ thống thực hiện:**
1. Phân tích real-time metrics sức khỏe dịch vụ
2. Điều tra failure patterns và error messages
3. Xác định chính xác lỗi liên quan đến quyền

**Hình 4. Yêu cầu Amazon Q CLI xác định nguyên nhân của vấn đề**

**Kết quả được cung cấp (hình 5):**
- ✅ **Các bước khắc phục chi tiết**
- ✅ **Root Cause Analysis (RCA) kỹ lưỡng** giải thích khoảng trống quyền
- ✅ **Đánh giá đầy đủ tác động vận hành**

**Hình 5. Đầu ra của Q CLI hiển thị RCA và các bước khắc phục**

**Lợi ích:**
Phương pháp luận được điều khiển bởi AI tiên tiến này không chỉ giảm đáng kể thời gian giải quyết mà còn cung cấp cho team những insight quý giá để ngăn ngừa các vấn đề tương tự xảy ra trong tương lai, trở thành công cụ không thể thiếu trong môi trường DevOps hiện đại.

---

#### Bước 2: Theo dõi thay đổi

Tiếp theo, xác định thời gian chính xác và người thực hiện thay đổi.

**Query:**
```
identify when and who changed the permissions on the role
```
_(dịch: xác định ai và khi nào đã thay đổi quyền trên role)_

**Hoạt động của Amazon Q CLI:**

Thông qua khả năng ra quyết định thông minh, Amazon Q CLI chọn lựa công cụ hiệu quả nhất có sẵn cho mỗi task. Trong trường hợp này, như hình 6, Amazon Q CLI tận dụng **built-in use_aws tool** để:

1. **Tự động phân tích CloudTrail events**
2. **Tạo timeline chi tiết** về thay đổi role
3. **Xác định chính xác các thay đổi cụ thể**
4. **Xác định người chịu trách nhiệm** cho các thay đổi đó cùng với timestamp chính xác

**Kết quả:**
Phân tích tự động này tạo ra **audit trail toàn diện** về thay đổi quyền, cho phép team nhanh chóng xác định nguyên nhân gốc rễ của vấn đề liên quan đến quyền mà không cần điều tra log thủ công.

**Hình 6. Yêu cầu Amazon Q CLI xác định ai và khi nào đã thay đổi quyền**

---

#### Bước 3: Thực hiện sửa chữa

Đã xác định được nguyên nhân, thời điểm và người thực hiện, bây giờ cần giải quyết thay đổi quyền.

**Thách thức với cách thủ công:**
Cập nhật IAM policy thủ công đòi hỏi:
- Hiểu sâu về cú pháp
- Nắm vững nguyên tắc least privilege
- Rủi ro tạo ra lỗ hổng mới nếu không thực hiện đúng

**Query:**
```
Fix the permissions issue
```
_(dịch: Sửa vấn đề quyền)_

**Hoạt động của Amazon Q CLI:**

Amazon Q CLI sẽ:
1. **Thêm quyền bị thiếu** vào service role
2. **Khôi phục dịch vụ đặt hàng** về trạng thái trước đó

**Quy trình sửa chữa có hướng dẫn:**
- ✅ Tích hợp sẵn tính năng bảo vệ bảo mật
- ✅ Quy trình xác thực
- ✅ Đảm bảo triển khai hiệu quả trong khi duy trì best practices bảo mật
- ✅ Giảm thiểu rủi ro lỗi thủ công

**Hình 7. Yêu cầu Amazon Q CLI sửa vấn đề quyền**

---

### Video demo đầy đủ

Video sau đây minh họa toàn bộ workflow từ điều tra đến giải quyết.

**Hình 8. Điều tra và khắc phục hoàn chỉnh sử dụng Amazon Q CLI với CloudWatch và Application Signals MCP servers**

---

## Mẫu Queries phổ biến cho điều tra

Dưới đây là các ví dụ query bạn có thể sử dụng với Amazon Q CLI để tận dụng CloudWatch và Application Signals MCP servers:

### 1. Phân tích SLO nâng cao
```
支払いサービスのSLOが違反しています。どの特定の操作が失敗しているか、ログのエラーパターンは何か、実行可能な改善手順を含む完全な根本原因分析を実行してください。
```
_(SLO của dịch vụ thanh toán đang bị vi phạm. Hãy thực hiện phân tích nguyên nhân gốc rễ đầy đủ bao gồm các thao tác cụ thể đang thất bại, error patterns trong log và các bước khắc phục có thể thực hiện.)_

### 2. Phụ thuộc dịch vụ
```
ユーザーチェックアウトトランザクションの完全なリクエストフローをマッピングし、全サービスにわたるボトルネックを特定し、チェーン内で最も高いレイテンシーが発生している箇所を示してください。
```
_(Hãy ánh xạ toàn bộ request flow của transaction checkout người dùng, xác định bottleneck trên tất cả dịch vụ và chỉ ra vị trí có latency cao nhất trong chuỗi.)_

### 3. Tối ưu hóa hiệu suất
```
AI/MLサービスのトークン使用パターンがレイテンシースパイクとどのように相関しているかを示し、最もパフォーマンスの問題を引き起こしているモデルを特定してください。
```
_(Hãy chỉ ra cách token usage pattern của dịch vụ AI/ML tương quan với latency spike và xác định model nào gây ra vấn đề hiệu suất nhiều nhất.)_

### 4. Điều tra lỗi
```
過去24時間のマイクロサービス全体での分散トランザクション障害をすべて検索し、根本原因でグループ化し、各障害タイプの顧客への影響を示してください。
```
_(Hãy tìm kiếm tất cả lỗi distributed transaction trên toàn bộ microservices trong 24 giờ qua, nhóm theo nguyên nhân gốc rễ và chỉ ra tác động đến khách hàng của mỗi loại lỗi.)_

### 5. Phân tích dự đoán
```
過去3ヶ月のサービスパフォーマンスの季節的パターンを分析し、容量制限に達する時期を予測し、スケーリング戦略を推奨してください。
```
_(Hãy phân tích seasonal patterns của hiệu suất dịch vụ trong 3 tháng qua, dự đoán thời điểm đạt đến giới hạn capacity và đề xuất chiến lược scaling.)_

### 6. Phân tích bảo mật
```
異常なレイテンシーシグネチャを持つトレースを分析し、セキュリティログと相関させ、潜在的な攻撃ベクトルを特定することで、不審なトラフィックパターンを調査してください。
```
_(Hãy điều tra traffic pattern đáng ngờ bằng cách phân tích traces có latency signature bất thường, tương quan với security log và xác định attack vector tiềm ẩn.)_

---

**Ý nghĩa:**
Các prompt này minh họa cách Amazon Q CLI có thể giúp điều tra các kịch bản vận hành phức tạp, phân tích performance patterns và thu thập insights có thể thực hiện về AWS resources.

---

## 4 lợi ích chính

### 1. Tìm kiếm nhận biết ngữ cảnh (Context-aware Search)
AI hiểu ngữ cảnh của dữ liệu observability để tìm kiếm.

### 2. Queries bằng ngôn ngữ tự nhiên (Natural Language Queries)
Không cần ngôn ngữ query phức tạp hoặc điều hướng dashboard.

### 3. Workflow troubleshooting tương tác (Interactive Troubleshooting Workflows)
Điều tra vấn đề chuyên sâu theo định dạng hội thoại.

### 4. Trải nghiệm nhà phát triển hiệu quả (Efficient Developer Experience)
Không cần chuyển đổi giữa nhiều công cụ.

---

## Kết luận

Bài viết này đã giới thiệu cách Amazon CloudWatch và Application Signals MCP servers tăng cường workflow vận hành thông qua 4 lợi ích chính:
1. ✅ Tìm kiếm nhận biết ngữ cảnh
2. ✅ Queries bằng ngôn ngữ tự nhiên
3. ✅ Workflow troubleshooting tương tác
4. ✅ Trải nghiệm nhà phát triển hiệu quả

Khi các tính năng này hoạt động cùng nhau, chúng cho phép:
- 🚀 **Xác định vấn đề nhanh hơn**
- ⏱️ **Giảm thời gian cho công việc định kỳ**
- 📉 **Rút ngắn thời gian giải quyết sự cố**
- 📈 **Cải thiện hiệu quả vận hành**

---

## Tìm hiểu thêm

Để khám phá sâu hơn về các tính năng này, hãy xem GitHub repositories:

- **Amazon CloudWatch MCP Server:**  
  [https://github.com/awslabs/mcp/tree/main/src/cloudwatch-mcp-server](https://github.com/awslabs/mcp/tree/main/src/cloudwatch-mcp-server)

- **Application Signals MCP Server:**  
  [https://github.com/awslabs/mcp/tree/main/src/cloudwatch-appsignals-mcp-server](https://github.com/awslabs/mcp/tree/main/src/cloudwatch-appsignals-mcp-server)

**Về triển khai MCP servers trên AWS, xem:**
- [Amazon Bedrock Agents で MCP サーバーを活用する](https://aws.amazon.com/jp/blogs/news/harness-the-power-of-mcp-servers-with-amazon-bedrock-agents/)
- Unlocking the power of Model Context Protocol (MCP) on AWS

---

## Về các tác giả

### Raviteja Sunkavalli
**Vị trí:** Senior Worldwide Specialist Solutions Architect, Amazon Web Services  
**Chuyên môn:** AIOps và Generative AI Observability

Raviteja hỗ trợ khách hàng trên toàn thế giới triển khai giải pháp observability và quản lý sự cố trên các môi trường cloud phức tạp, phân tán. Ngoài công việc, anh ấy thích chơi cricket và khám phá công thức nấu ăn mới.

### Joe Alioto
**Vị trí:** Senior Specialist Solutions Architect, Cloud Operations tại AWS  
**Chuyên môn:** Observability, Governance, và Centralized Operations Management

Joe có hơn 20 năm kinh nghiệm thực tế về operations engineering và architecture. Ngoài thời gian làm việc, anh ấy dành thời gian với gia đình, học công nghệ mới và chơi PC game.

### Matheus Arrais
**Vị trí:** WW Tech Leader, Cloud Operations tại AWS

Matheus chịu trách nhiệm định hướng toàn cầu cho cộng đồng nội bộ gồm hàng trăm chuyên gia AWS tập trung vào operational capabilities của AWS. Matheus hợp tác chặt chẽ với các team dịch vụ AWS để thiết kế giải pháp quy mô lớn giúp khách hàng triển khai và hỗ trợ infrastructure cloud phức tạp.

**LinkedIn:** [https://www.linkedin.com/in/matheusarrais/](https://www.linkedin.com/in/matheusarrais/)

---

## Thông tin bổ sung

**Bài gốc:** [Enhance your AIOps: Introducing Amazon CloudWatch and Application Signals MCP servers](https://aws.amazon.com/jp/blogs/mt/enhance-your-aiops-introducing-amazon-cloudwatch-and-application-signals-mcp-servers/)

**Dịch giả:** Technical Account Manager 日平 (Hibira)


---

## Liên kết hữu ích

- [Getting Started Resource Center](https://aws.amazon.com/jp/getting-started?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)
- [AWS Latest Updates](https://aws.amazon.com/jp/new?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)
- [AWS Event Schedule](https://aws.amazon.com/jp/events/?sc_ichannel=ha&sc_icampaign=jp-event_awsblogs&sc_icontent=news-resources)
- [builders.flash - AWS Official Web Magazine](https://aws.amazon.com/jp/builders-flash/?sc_ichannel=ha&sc_icampaign=builders-flash_awsblogsb&sc_icontent=news-resources)
- [Customer Case Studies in Japan](https://aws.amazon.com/jp/solutions/case-studies-jp?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=news-resources)

---

## Theo dõi chúng tôi

- [Twitter](https://twitter.com/awscloud_jp)
- [Facebook](https://www.facebook.com/アマゾン-ウェブ-サービス-600986860012140/)
- [LinkedIn](https://www.linkedin.com/company/amazon-web-services)
- [Twitch](https://www.twitch.tv/aws)
- [Latest Updates Email](https://pages.awscloud.com/jp/communication-preferences?languages=japanese)
- [RSS Feed](https://aws.amazon.com/jp/blogs/news/feed)

---

**© 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.**
