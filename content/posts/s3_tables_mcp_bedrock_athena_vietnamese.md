---
title: "Xây dựng MCP Server query S3 Tables (Iceberg) bằng ngôn ngữ tự nhiên với AWS Lambda + Bedrock + Athena"
date: 2025-10-14
draft: false
categories: ["AWS", "Data-Engineering", "AI"]
tags: ["S3-Tables", "Iceberg", "MCP", "Bedrock", "Athena", "Lambda", "Data-Analysis", "Natural-Language-Query"]
description: "Hướng dẫn xây dựng MCP Server cho phép query S3 Tables (Iceberg) bằng ngôn ngữ tự nhiên, tự động sinh SQL và trả về kết quả qua Claude."
---

**Tác giả:** Ryuto Yoda (與田龍人)  
**Bộ phận:** 全社データ技術局 データインテグレーションチーム (Data Integration Team)  
**Ngày đăng:** 14/10/2025  
**Nguồn:** https://developers.cyberagent.co.jp/blog/archives/59292/

**Category:** エンジニア (Engineer)  
**Tags:** #MCP #データ分析 #データ基盤 #全社データ技術局 #生成AI  
**Hatena Bookmarks:** 4

---

## 📋 Giới thiệu

Tôi là Ryuto Yoda (與田龍人), thuộc **Data Integration Team** trong **Corporate Data Technology Division**.

Khi sử dụng **Amazon S3 Tables** để quản lý data dưới dạng **Iceberg**, bạn có thể thực hiện tự động compaction cho Iceberg tables và kiểm soát quyền ở level table. Nhờ đó, việc cân bằng giữa **query performance** và **data governance** trở nên dễ dàng hơn so với vận hành S3 bucket truyền thống.

Lần này, tôi sẽ xây dựng một cơ chế: **gửi câu hỏi bằng ngôn ngữ tự nhiên từ Claude**, hệ thống sẽ **tự động sinh SQL query tương ứng**, **Athena thực thi query đó** và **trả về kết quả dưới dạng JSON kèm summary**.

Lambda function hoạt động như **MCP (Model Context Protocol) server**, thông qua Bedrock Guardrails và audit logs, cho phép gọi các tools như `test_connection`, `text_to_sql`, `execute_query`, `fetch_query_results` từ **Claude (browser version)**.

---

## 🏗️ Architecture và Mục đích

### Workflow cụ thể

Hệ thống hoạt động theo flow sau:

#### 1️⃣ **Gửi câu hỏi từ Claude**
- Nhận câu hỏi bằng ngôn ngữ tự nhiên (tiếng Nhật) qua Bedrock

#### 2️⃣ **Tự động sinh SQL query**
- Claude của Bedrock tự động generate SQL tương ứng với câu hỏi

#### 3️⃣ **Thực thi query trên Athena**
- Athena thực thi SQL đã generate và lấy kết quả dưới dạng JSON

#### 4️⃣ **Trả về kết quả và summary**
- Lambda (MCP server) trả về JSON result và summary cho Claude

### 🎯 Lợi ích của Architecture

Lambda hoạt động như **MCP server**, thông qua **Bedrock Guardrails** và **audit logs**, cho phép:

✅ Thao tác Iceberg tables mà không cần viết SQL trực tiếp  
✅ Câu hỏi, generated SQL, và execution results đều được ghi vào audit log  
✅ Hỗ trợ **data governance** và **performance improvement**  
✅ Kết hợp query performance với data governance  

![Architecture Diagram](https://developers.cyberagent.co.jp/blog/archives/59292/)

---

## 🛠️ Các bước xây dựng

### 📌 Điều kiện tiên quyết

#### **Amazon S3 Tables / Iceberg Tables**

- Iceberg tables dạng S3 Tables đã được tạo sẵn
- Trong ví dụ này, sử dụng table `analytics_namespace.slack_messages`
- **Bật tích hợp Amazon S3 Tables với AWS analytics services**

![AWS Analytics Services Integration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integration-overview.html)

**Tham khảo:** [Amazon S3 Tables integration with AWS analytics services overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integration-overview.html)

#### **Amazon Athena**

- Có thể query Iceberg tables của S3 Tables từ Athena
- Athena catalog (ví dụ: `AwsDataCatalog`) và workgroup (ví dụ: `primary`) đã được config

#### **AWS Account / Permissions**

- Có IAM permissions để tạo và thực thi Lambda
- Có quyền truy cập Bedrock

---

### 🔐 Tạo IAM Role

Tạo execution role để Lambda có thể gọi Bedrock và Athena.

Đầu tiên, tạo role với trust policy:

```bash
aws iam create-role \
  --role-name text2sql-lambda-execution-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'
```

Trong môi trường test, tôi attach các managed policies với full access như **AmazonAthena**, **AmazonS3**, **AWSGlueServiceRole**. **⚠️ Trong production, nên giảm xuống minimum permissions.**

```bash
aws iam attach-role-policy \
  --role-name text2sql-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonAthenaFullAccess

aws iam attach-role-policy \
  --role-name text2sql-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name text2sql-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole

aws iam attach-role-policy \
  --role-name text2sql-lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

Quyền truy cập **Bedrock** và **Lake Formation** được cấp qua **custom policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lakeformation:GetDataAccess"
      ],
      "Resource": "*"
    }
  ]
}
```

```bash
aws iam put-role-policy \
  --role-name text2sql-lambda-execution-role \
  --policy-name LambdaBedrock-S3TablesPolicy \
  --policy-document file://lambda-custom-policy.json
```

---

### 🔑 Cấp quyền Iceberg trong Lake Formation

Iceberg tables không thể truy cập chỉ với IAM, cần cấp quyền **DESCRIBE** / **SELECT** trong **Lake Formation**:

```bash
# Grant DESCRIBE on database
aws lakeformation grant-permissions \
  --principal DataLakePrincipalIdentifier=arn:aws:iam::123456789012:role/text2sql-lambda-execution-role \
  --permissions "DESCRIBE" \
  --resource '{"Database": {"CatalogId": "123456789012", "Name": "data_catalog_link"}}'

# Grant DESCRIBE on S3 Tables catalog
aws lakeformation grant-permissions \
  --principal DataLakePrincipalIdentifier=arn:aws:iam::123456789012:role/text2sql-lambda-execution-role \
  --permissions "DESCRIBE" \
  --resource '{"Database": {"CatalogId": "123456789012:s3tablescatalog/demo-bucket", "Name": "analytics_namespace"}}'

# Grant SELECT and DESCRIBE on table
aws lakeformation grant-permissions \
  --principal DataLakePrincipalIdentifier=arn:aws:iam::123456789012:role/text2sql-lambda-execution-role \
  --permissions "SELECT" "DESCRIBE" \
  --resource '{"Table": {"CatalogId": "123456789012:s3tablescatalog/demo-bucket", "DatabaseName": "analytics_namespace", "Name": "slack_messages"}}'
```

---

### 📊 Thêm test data vào table

Trong ví dụ này, giả định data message từ Slack, thêm 1 record về deadline **20/10** vào Iceberg table:

```sql
INSERT INTO "AwsDataCatalog"."MCP_DEMO_DB"."slack_messages"
VALUES (
  'MSG-20251008-001',
  '20251008103015999',
  'message_posted',
  'C1234567890',
  'official-announcements',
  'U000BOSS001',
  '各位、S3Tables MCP の初回リリースは 10月20日 が締切です。遅延厳禁でお願いします。',
  'T1234567890',
  'EVT-20251008-001',
  current_timestamp,
  date(current_timestamp)
);
```

**Nội dung message:** "Các vị, deadline initial release của S3Tables MCP là **20/10**. Không được chậm trễ."

---

### 💻 Lambda Code

Trong `lambda_function.py`, viết code sau. Chi tiết được ghi trong code. Sử dụng `MCPLambdaHandler`, nên sau này cần bundle dependencies vào zip để upload.

#### **Key Components trong Code:**

**1. Global Clients** (để tái sử dụng kết nối khi warm start):
```python
bedrock_runtime = boto3.client("bedrock-runtime", region_name=AWS_REGION)
athena_client = boto3.client("athena", region_name=AWS_REGION)
s3_client = boto3.client("s3", region_name=AWS_REGION)
```

**2. Environment Variables:**
- `DATABASE_NAME` (default: MCP_DEMO_DB)
- `TABLE_NAME` (default: MCP_DEMO_TABLE)
- `ATHENA_CATALOG` (default: AwsDataCatalog)
- `ATHENA_WORKGROUP` (default: primary)
- `ATHENA_OUTPUT_LOCATION` (S3 path)
- `BEDROCK_MODEL_ID` (default: anthropic.claude-3-5-sonnet-20240620-v1:0)

**3. MCP Tools Implemented:**

#### 🔧 `test_connection()`
```python
@mcp.tool()
def test_connection() -> str:
    """Trả về thông tin môi trường và lưu ý khi thực thi query"""
    return environment_info_and_query_tips
```

**Output:** Configuration info (CATALOG, DATABASE, TABLE, WORKGROUP, etc.) + Query tips

#### 🔧 `text_to_sql()`
```python
@mcp.tool()
def text_to_sql(
    natural_language_query: str,
    catalog: Optional[str] = None,
    database: Optional[str] = None,
    table: Optional[str] = None,
) -> str:
    """Chuyển đổi ngôn ngữ tự nhiên thành Athena SQL và trả về JSON"""
```

**Flow:**
1. Build prompt cho Bedrock Claude
2. Gọi Bedrock để generate SQL
3. Clean up Markdown formatting (```sql```)
4. Return SQL dưới dạng JSON

#### 🔧 `execute_query()`
```python
@mcp.tool()
def execute_query(
    natural_language_query: Optional[str] = None,
    sql_query: Optional[str] = None,
    catalog: Optional[str] = None,
    database: Optional[str] = None,
    table: Optional[str] = None,
) -> str:
    """Nhận ngôn ngữ tự nhiên hoặc SQL, thực thi Athena, và tạo summary"""
```

**Flow:**
1. Generate SQL (nếu có natural_language_query)
2. Start Athena query execution
3. Poll cho đến khi query complete
4. Collect all result rows
5. Summarize results với Bedrock
6. Return JSON với: sql, query_execution_id, row_count, rows, summary

#### 🔧 `fetch_query_results()`
```python
@mcp.tool()
def fetch_query_results(query_execution_id: str) -> str:
    """Lấy lại kết quả thực thi Athena đã chạy trước đó"""
```

**4. Helper Functions:**

- `_build_prompt()` - Tạo prompt cho text-to-SQL
- `_invoke_bedrock()` - Gọi Bedrock Claude và clean output
- `_start_athena_query()` - Start Athena query execution
- `_wait_for_query()` - Poll query status với timeout
- `_collect_athena_rows()` - Lấy toàn bộ result set
- `_summarise_results()` - Tóm tắt kết quả bằng Bedrock

**5. Lambda Handler:**
```python
def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """MCP JSON-RPC request routing entry point"""
    return mcp.handle_request(event, context)
```

---

### 📦 Bundle dependencies vào zip và upload

Cần `awslabs.mcp_lambda_handler`, nên install dependencies vào directory và upload cùng với `lambda_function.py`:

```bash
mkdir -p package
cp lambda_function.py package/

python3 -m pip install awslabs-mcp-lambda-handler -t package/
python3 -m pip freeze > package/requirements.txt

(cd package && zip -r ../lambda-function-mcp.zip .)
```

**Lưu ý:** Lần này dependencies nhẹ nên không dùng Lambda Layers, bundle trực tiếp vào zip.

---

### 🌐 Bật Function URL

Để kết nối từ MCP, tạo **Function URL**.

⚠️ **Security Note:** Lần này implement **API Key authentication** trong Lambda, nhưng trong production environment khuyến nghị sử dụng:
- **AWS IAM authentication**
- **API Gateway + Authorizer** (Cognito / OIDC, etc.)

#### Tạo Function URL

Cấu hình auth-type là `NONE`, nhưng implement API Key authentication bên trong Lambda:

```bash
aws lambda create-function-url-config \
  --function-name bedrock-athena-s3tables \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["POST"],"AllowHeaders":["content-type"]}' \
  --region us-west-2
```

#### Thêm public access permission

```bash
aws lambda add-permission \
  --function-name bedrock-athena-s3tables \
  --statement-id function-url-public-access \
  --action lambda:InvokeFunctionUrl \
  --principal '*' \
  --function-url-auth-type NONE \
  --region us-west-2
```

---

### 🔒 Implement API Key Authentication (trong Lambda)

Trong Lambda function, implement API Key authentication như sau:

```python
def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    # API Key authentication
    query_params = event.get("queryStringParameters", {}) or {}
    api_key = query_params.get("key") or query_params.get("api_key")
    
    expected_key = os.environ.get("MCP_API_KEY")
    if not expected_key or api_key != expected_key:
        return {
            "statusCode": 401,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Invalid or missing API key"})
        }
    
    # Continue with MCP request handling...
```

#### Set environment variable `MCP_API_KEY`

```bash
aws lambda update-function-configuration \
  --function-name bedrock-athena-s3tables \
  --environment Variables='{"MCP_API_KEY":"your-secure-api-key-here"}' \
  --region us-west-2
```

---

### ✅ Kiểm tra hoạt động

Sau khi Function URL được issue, test với API Key xem có trả về status 200 không:

**✅ Với API Key (hoạt động bình thường - 200):**

```bash
curl -s -X POST \
  "https://xxxx.lambda-url.us-west-2.on.aws/?api_key=your-secure-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"health","method":"initialize","params":{}}'
```

---

## 🎭 Thử nghiệm tools trên Claude

### Cấu hình Claude UI

1. Click vào **icon góc dưới bên trái** trong Claude UI
2. **Cài đặt** → **コネクタ** → **カスタムコネクタを追加**
3. Nhập thông tin:

**Connector Name:**
```
s3tables-lambda-mcp
```

**Remote MCP Server URL:**
```
https://xxxx.lambda-url.us-west-2.on.aws/?api_key=your-secure-api-key-here
```

### Kiểm tra

Trong chat settings, `s3tables-lambda-mcp` sẽ xuất hiện.

### Test Query

**Câu hỏi test:**
```
s3tablesに関するMCPプロジェクトの締切がいつまでか分かりますか？
(Bạn có biết deadline của MCP project liên quan đến s3tables là khi nào không?)
```

**Kết quả:**
Claude tự động:
1. Gọi `text_to_sql` để generate SQL
2. Gọi `execute_query` để thực thi trên Athena
3. Phân tích message và summarize: **"初回リリースは10月20日"** (Initial release là 20/10)

✅ **Thành công!** Claude đã tự động pick up message và trả lời chính xác!

---

## 🎯 Tổng kết

Đã hoàn thành xây dựng **serverless MCP environment** cho phép:

✅ Truy cập S3 Tables bằng **ngôn ngữ tự nhiên** từ Claude  
✅ Thông qua **Athena**  
✅ Tự động **generate SQL** và **summarize results**  
✅ Ghi **audit logs** đầy đủ  

Nhờ MCP server, có thể truy cập data bằng ngôn ngữ tự nhiên, giúp trả lời nhanh các câu hỏi nội bộ đơn giản như **"締切いつ？"** (Deadline khi nào?).

---

## 🚀 Hướng phát triển tiếp theo

### Cải thiện bảo mật
- ✅ Thêm **query validation** vào `execute_query`
- ✅ Tích hợp **SSO** và **permission management**
- ✅ Kiểm soát access đến Lambda và S3 Tables nghiêm ngặt hơn

### Use cases mở rộng
- 📊 Hệ thống tìm kiếm ngôn ngữ tự nhiên cho internal/external
- 🔍 Data utilization platform
- 💬 Chatbot truy vấn data
- 📈 Self-service analytics

---

## 📚 Tài liệu tham khảo

1. **[AWS MCP Lambda Handler GitHub](https://github.com/awslabs/mcp/tree/8d90be5c403af4829a45d8f03093f830ffed6285/src/mcp-lambda-handler)**

2. **[Amazon S3 Tables とテーブルバケットの使用](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/s3-tables.html)**

3. **[Amazon S3 Tables integration with AWS analytics services](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integration-overview.html)**

---

## 👤 Về tác giả

**Ryuto Yoda (與田龍人)**
- **Vai trò:** 大規模データエンジニア (Large-scale Data Engineer)
- **Team:** グループIT推進本部 全社データ技術局 データインテグレーションチーム
- **Công việc:** 
  - Phát triển nền tảng phân tích (分析基盤)
  - Phát triển liên quan đến AI Agent
  - Các công việc development liên quan đến data utilization
- **GitHub:** [RyutoYoda](https://github.com/RyutoYoda)
- **X (Twitter):** [@ooolong29](https://x.com/ooolong29?s=21)

---

## 💡 Key Takeaways

### 🎯 Architecture Highlights

1. **MCP Server với Lambda**
   - Serverless, auto-scaling
   - Cost-effective
   - Easy deployment

2. **Bedrock Claude Integration**
   - Text-to-SQL generation
   - Result summarization
   - Natural language interface

3. **S3 Tables (Iceberg)**
   - Auto-compaction
   - Table-level permissions
   - Query performance optimization

4. **Security & Governance**
   - API Key authentication
   - Audit logging
   - Lake Formation permissions
   - Bedrock Guardrails

### 📊 Benefits Summary

✅ **User-Friendly:** Ngôn ngữ tự nhiên thay vì SQL  
✅ **Fast Response:** Serverless architecture  
✅ **Secure:** Multi-layer security (IAM, Lake Formation, API Key)  
✅ **Auditable:** Full query and result logging  
✅ **Scalable:** Lambda auto-scaling  
✅ **Cost-Effective:** Pay-per-use model  

### 🔧 Technical Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Claude Browser | Natural language interface |
| **Protocol** | MCP | Claude ↔ Lambda communication |
| **Compute** | AWS Lambda | MCP Server execution |
| **AI** | Amazon Bedrock (Claude 3.5 Sonnet) | Text-to-SQL + Summarization |
| **Query Engine** | Amazon Athena | SQL execution |
| **Storage** | S3 Tables (Iceberg) | Data lake storage |
| **Security** | IAM + Lake Formation | Permission management |
| **Monitoring** | CloudWatch Logs | Audit trail |

---

## 🎉 Kết luận

Bài viết này đã trình bày cách xây dựng một **MCP Server hoàn chỉnh** cho phép query **S3 Tables (Iceberg)** bằng **ngôn ngữ tự nhiên** thông qua:

- **AWS Lambda** (Serverless MCP Server)
- **Amazon Bedrock** (AI-powered text-to-SQL)
- **Amazon Athena** (Query execution)
- **S3 Tables** (Iceberg data storage)

Architecture này kết hợp hoàn hảo giữa:
- 🤖 **AI capabilities** (natural language understanding)
- 🔒 **Security** (multi-layer authentication & authorization)
- 📊 **Performance** (Iceberg optimization)
- 🛡️ **Governance** (audit logging & permissions)

Đây là một **reference architecture tuyệt vời** cho các use cases:
- Internal data access democratization
- Self-service analytics
- Natural language data exploration
- Rapid prototyping of data-driven applications

URL: https://developers.cyberagent.co.jp/blog/archives/59292/
TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
