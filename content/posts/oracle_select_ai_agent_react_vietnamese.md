---
title: "Thử triển khai Autonomous Workflow với AI Agent sử dụng ReAct chỉ bằng chức năng Oracle DB (26ai Select AI Agent)"
date: 2025-10-20
draft: false
categories: ["Data and Analytics", "AI and Machine Learning"]
tags: ["Oracle-Database", "AI-Agent", "ReAct", "26ai", "Autonomous-Database", "LLM", "MCP"]
description: "Khám phá Select AI Agent trong Oracle Autonomous AI Database 26ai - triển khai autonomous workflow processing với ReAct và MCP trực tiếp trên database."
---

**Tác giả:** Shinjiro Fujita (@ssfujita)  
**Tổ chức:** 日本オラクル株式会社 (Oracle Japan)  
**Ngày đăng:** 20/10/2025  
**Ngày cập nhật:** 20/10/2025  
**Nguồn:** https://qiita.com/ssfujita/items/80454001845fa1493495

**Engagement:** 12 Likes, 6 Stocks

---

## 📢 Giới thiệu

Cùng với sự kiện **Oracle AI World** vừa qua, một tính năng mới có tên **"Select AI Agent"** đã được thêm vào **Autonomous AI Database 26ai** (trước đây là Autonomous Database 23ai).

Chi tiết vui lòng tham khảo announcement dưới đây:

🔗 **[Oracle announces Oracle AI Database 26ai](https://blogs.oracle.com/database/post/oracle-announces-oracle-ai-database-26ai)**

Và manual tại đây:

📚 **[Oracle Autonomous AI Database Serverless の使用](https://docs.oracle.com/ja-jp/iaas/autonomous-database-serverless/doc/select-ai-agent.html)**

Với tính năng này, chúng ta có thể **implement AI agents trên Autonomous AI Database**. Nói cách khác, có thể thực hiện **autonomous workflow processing** bằng ReAct hay MCP trên Autonomous AI Database.

---

## 🎯 Khái niệm SELECT AI Agent

### ReAct Framework

**SELECT AI Agent** cung cấp chức năng để dễ dàng implement **ReAct (Reasoning and Acting)** trên Oracle DB.

**ReAct** là framework mà đối với câu hỏi từ user, thực hiện:
1. **Reasoning (追論)** - Suy luận về việc nên làm gì
2. **Acting (行動)** - Thực hiện hành động cụ thể

Lặp lại reasoning và acting cho đến khi đạt được câu trả lời cuối cùng.

Ví dụ về implementation nổi tiếng là sử dụng **LangGraph**.

Chi tiết tham khảo bài viết: **[MCPで変わるAIエージェント開発 - ReActエージェントとMCP](https://qiita.com/ksonoda/items/1c681a563a95a93975ff#react%E3%82%A8%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%88%E3%81%A8mcp)**

### 4 Objects chính

SELECT AI Agent sử dụng 4 objects chính sau để thực hiện ReAct:

#### 1️⃣ **Agent Team**
- **Vai trò:** Gom nhiều Agent lại để tạo thành một workflow

#### 2️⃣ **Agent**  
- **Vai trò:** 
  - Lựa chọn tool để thực thi task cụ thể và lý do
  - Thực thi steps
  - Đánh giá kết quả
  - Generate response

#### 3️⃣ **Task**
- **Vai trò:**
  - Lựa chọn tool để thực thi task cụ thể
  - Cài đặt parameters cho tool
  - Định nghĩa execution policy
  - Kiểm tra kết quả

#### 4️⃣ **Tool**
- **Vai trò:**
  - Thực thi actions như:
    - Update data
    - Lấy documents
    - Gọi external services

Chi tiết hơn tham khảo manual: **[SELECT AI Agents Concepts](https://docs.oracle.com/ja-jp/iaas/autonomous-database-serverless/doc/select-ai-agents-concepts.html)**

### 🔗 Mối quan hệ giữa các Objects

Mối quan hệ giữa 4 objects như diagram dưới đây:

```
Agent Team
├─ Agents 0
│  ├─ Agent
│  ├─ Task
│  └─ Tool
└─ Agents 1
   ├─ Agent
   ├─ Task
   └─ Tool
```

**Agent Team** có thể liên kết nhiều **Agent** với dependencies, cho phép implement workflow: **"xử lý step tiếp theo dựa trên kết quả của step trước"**.

### 🛠️ Available Tools

Select AI Agent cung cấp các tools sau, kết hợp chúng để tạo AI agent:

1. **SQL** - NL2SQL bằng SELECT AI
2. **RAG** - RAG sử dụng AI Vector Search qua SELECT AI RAG
3. **Web Search** - Sử dụng model hỗ trợ Web search của OpenAI
4. **Notification** - Thông báo qua email hoặc Slack
5. **PL/SQL Function** - Xử lý tùy ý được implement bằng PL/SQL function

Với những tool này, có thể thực hiện **autonomous processing bằng AI agent** cho hầu hết mọi workflow.

---

## 💼 Use Case thử nghiệm

Lần này tôi sẽ thử nghiệm với use case sau:

> **Đối với sản phẩm dự kiến giao hàng, AI agent sẽ kiểm tra thông tin giao thông tại location đích và sử dụng làm input cho delivery route planning.**

---

## 🧪 Môi trường kiểm chứng

- **Region:** OCI Osaka
- **Database:** Autonomous AI Database `26ai`
- **Tool:** Database Actions
- **LLM Model:** gpt-4o (OpenAI)

---

## 📝 Các bước triển khai

### 1️⃣ Tạo DB User (Thực thi với ADMIN user)

Tạo DB user cho testing và cấp quyền cần thiết:

```sql
GRANT DB_DEVELOPER_ROLE TO adb_agent identified by <your password>;
GRANT DWROLE to adb_agent;
GRANT EXECUTE on DBMS_CLOUD_AI_AGENT to adb_agent;
GRANT EXECUTE on DBMS_CLOUD_AI to adb_agent;
GRANT EXECUTE on DBMS_CLOUD_PIPELINE to adb_agent;
```

### 2️⃣ Cấu hình ACL trên Autonomous AI Database (ADMIN user)

Cấu hình ACL để sử dụng external API. Dưới đây là setting cho phép thực thi OpenAI API:

```sql
BEGIN
  DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
    host => 'api.openai.com',
    ace => xs$ace_type(
      privilege_list => xs$name_list('http'),
      principal_name => 'adb_agent',
      principal_type => xs_acl.ptype_db
    )
  );
END;
/
```

### 3️⃣ Tạo Credential

Tạo credential để sử dụng LLM. Lần này sử dụng OpenAI LLM nên tạo credential cần thiết cho OpenAI API:

```sql
BEGIN
  DBMS_CLOUD.CREATE_CREDENTIAL(
    credential_name => 'OPENAI_CRED',
    username => 'OPENAI',
    password => 'your api key'
  );
END;
/
```

### 4️⃣ Tạo AI Profile

Tạo AI profile cần thiết cho Agent và các tools như SELECT AI. Model sử dụng là **gpt-4o**:

```sql
BEGIN
  DBMS_CLOUD_AI.CREATE_PROFILE(
    profile_name =>'OPENAI',
    attributes =>'{ 
      "provider" : "openai",
      "model" : "gpt-4o",
      "credential_name" : "OPENAI_CRED",
      "comments" : "TRUE",
      "conversation" : "TRUE",
      "object_list" : [
        {"owner": "adb_agent", "name": "orders"}
      ]
    }'
  );
END;
/
```

Từ đây sẽ tạo các objects của Select AI Agent. Lần này tạo Agent, Task, và Tool cho 2 xử lý sau:

1. **Tìm kiếm sản phẩm chưa ship** trong order data với destination được chỉ định
2. **Tìm kiếm thông tin giao thông** tại destination location được chỉ định

Về order data, trong testing này sử dụng sample table **ORDERS** chứa khoảng 5,000 rows.

---

### 5️⃣ Tạo Agent, Task, Tool cho tìm kiếm Order Data

#### Tạo Agent

Tạo Agent để search table **ORDERS**. Chỉ định `profile_name` là AI profile sử dụng **gpt-4o** vừa tạo. Nhờ đó **gpt-4o** được dùng cho **Reasoning**:

```sql
BEGIN
  DBMS_CLOUD_AI_AGENT.CREATE_AGENT(
    agent_name => 'ORDERS_ANALYST',
    attributes => '{
      "profile_name": "OPENAI",
      "role": "あなたは受発注履歴であるORDERS表から指示された情報を抽出する役割を担っています。"
    }'
  );
END;
/
```

#### Tạo Tool

Tạo tool để search table **ORDERS**. Thực thể là **SELECT AI (NL2SQL)**. Cũng chỉ định `profile_name` sử dụng **gpt-4o**. Nhờ đó **gpt-4o** được dùng cho **NL2SQL** (generate SQL từ natural language):

```sql
BEGIN
  DBMS_CLOUD_AI_AGENT.CREATE_TOOL(
    tool_name => 'ORDERS_QUERY',
    attributes => '{
      "instruction": "ORDERS表を検索する際にこのツールを使います。",
      "tool_type": "SQL",
      "tool_params": {"profile_name": "OPENAI"}
    }'
  );
END;
/
```

#### Tạo Task

Tạo task để search table **ORDERS**. Task này liên kết tool vừa tạo qua setting `tools`:

```sql
BEGIN
  DBMS_CLOUD_AI_AGENT.CREATE_TASK(
    task_name => 'ORDERS_ANALYZE',
    attributes =>'{
      "instruction": "ORDERS表に対するデータ検索を支援してください。ユーザからの質問: {query}' ||
                     'ORDERS表を参照する際には ORDERS_QUERY ツールを利用してください。",
      "tools": ["ORDERS_QUERY"],
      "enable_human_tool" : "False"
    }'
  );
END;
/
```

---

### 6️⃣ Tạo Agent, Task, Tool cho Web Search

#### Tạo Agent

Tạo Agent cho Web search. Chỉ định `profile_name` sử dụng **gpt-4o** vừa tạo. Nhờ đó **gpt-4o** được dùng cho **Reasoning**:

```sql
BEGIN
  DBMS_CLOUD_AI_AGENT.CREATE_AGENT(
    agent_name => 'WEBSEARCHER',
    attributes => '{
      "profile_name": "OPENAI",
      "role": "あなたは指示された情報をWeb検索によって取得する役割を担っています。"
    }'
  );
END;
/
```

#### Tạo Tool

Tạo tool cho Web search. Chỉ định credential **OPENAI_CRED** cho OpenAI API access trong `credential_name`. Nhờ đó có thể sử dụng **gpt-4o-search-preview** (dự đoán), cho phép Web search các thông tin mới nhất:

```sql
BEGIN
  DBMS_CLOUD_AI_AGENT.CREATE_TOOL(
    tool_name => 'WEBSEARCH_TOOL',
    attributes => '{
      "instruction": "天気や災害情報、交通情報をWeb検索して調べる際にこのツールを使います。",
      "tool_type": "WEBSEARCH",
      "tool_params": {"credential_name": "OPENAI_CRED"}
    }'
  );
END;
/
```

#### Tạo Task

Tạo task cho Web search. Task này liên kết tool vừa tạo qua setting `tools`. Ngoài ra chỉ định task search ORDERS `ORDERS_ANALYZE` trong parameter `input`. Nhờ đó có thể định nghĩa **dependency giữa các tasks**: "search ORDERS table trước, sau đó Web search":

```sql
BEGIN
  DBMS_CLOUD_AI_AGENT.CREATE_TASK(
    task_name => 'WEB_ANALYZE',
    attributes => '{
      "instruction": "ORDERS表の検索結果をもとに、天気や災害情報、交通情報に関するユーザからの質問に回答します。ユーザからの質問: {query}。' ||
                     '回答する際にツールとして WEBSEARCH_TOOL を利用し、Web検索して情報を取得してください。",
      "tools": ["WEBSEARCH_TOOL"],
      "enable_human_tool" : "False",
      "input" : "ORDERS_ANALYZE"
    }'
  );
END;
/
```

---

### 7️⃣ Tạo Agent Team

Cuối cùng tạo Agent Team để có thể execute Agents, Tasks, và Tools đã tạo. Trong parameter `attributes`, setting liên kết Agents `ORDERS_ANALYST` và `WEBSEARCHER`, và mapping các Agents với Tasks tương ứng:

```sql
BEGIN
  DBMS_CLOUD_AI_AGENT.CREATE_TEAM(
    team_name => 'SC_AGENT_TEAM',
    attributes => '{
      "agents": [
        {"name":"ORDERS_ANALYST","task":"ORDERS_ANALYZE"},
        {"name":"WEBSEARCHER","task":"WEB_ANALYZE"}
      ],
      "process": "sequential"
    }'
  );
END;
/
```

---

### 8️⃣ Thực thi Agent Team

Đã hoàn thành setting, bây giờ thực thi Agent Team để xác nhận ReAct hoạt động như mong đợi.

#### Scenario Test

Prompt input giả định scenario sau:

1. Kiểm tra xem có sản phẩm nào chưa ship với destination là Nagoya không
2. Nếu có, kiểm tra thông tin giao thông trong Nagoya để làm tham khảo khi quyết định delivery route

**Prompt:**
```
ORDERS表のORDER_STATUS列が3-Shipped以外の商品のうち、City列がNagoyaのものはいくつありますか？
もし1件以上ある場合、該当するデータ件数と名古屋の2025/10/18の天気、交通情報をWeb検索し、日付とともに日本語で教えてください。
```

#### Cách thực thi

Có 2 cách:

**1. sqlplus / SQLcl:**
```sql
select ai agent <prompt>
```

**2. APEX / Database Actions / Applications:**
```sql
DBMS_CLOUD_AI_AGENT.RUN_TEAM
```

Lần này thực thi từ Database Actions nên sử dụng function. Cần `conversation_id` khi execute nên code dưới đây tạo `conversation_id` mới bằng `DBMS_CLOUD_AI.CREATE_CONVERSATION`:

```sql
DECLARE
  l_conversation_id VARCHAR2(50);
  l_final_answer VARCHAR2(4000);
BEGIN
  SELECT DBMS_CLOUD_AI.CREATE_CONVERSATION INTO l_conversation_id;
  
  l_final_answer := DBMS_CLOUD_AI_AGENT.RUN_TEAM(
    team_name => 'SC_AGENT_TEAM',
    user_prompt => 'ORDERS表のORDER_STATUS列が3-Shipped以外の商品のうち、City列がNagoyaのものはいくつありますか？もし1件以上ある場合、該当するデータ件数と名古屋の2025/10/18の天気、交通情報をWeb検索し、日付とともに日本語で教えてください。',
    params => '{"conversation_id": "' || l_conversation_id || '"}'
  );
  
  DBMS_OUTPUT.PUT_LINE(l_final_answer);
END;
/
```

#### ✅ Kết quả Test Case 1 (Nagoya)

```
名古屋で3-Shipped以外の注文は9件あります。
2025年10月18日の名古屋の天気は曇り時々雨で、降水確率は50％、最高気温は25℃、最低気温は19℃です。
また、同日は「第71回 名古屋まつり」が開催されるため、市内中心部で交通規制が実施されます。
特に、名古屋駅前と空港を結ぶバス路線の一部が運休や終点変更となる予定です。
お出かけの際は、最新の天気予報と交通情報をご確認ください。
```

**✅ Kết quả chính xác:**
- Số sản phẩm chưa ship khớp
- Web search trả về "第71回 名古屋まつり" (lễ hội Nagoya lần thứ 71)

#### ✅ Kết quả Test Case 2 (Hiroshima - 0 items)

Thử modify prompt để test trường hợp 0 sản phẩm chưa ship:

```sql
ORDERS表のORDER_STATUS列が3-Shipped以外の商品のうち、City列がHiroshimaのものはいくつありますか？
もし1件以上ある場合、該当するデータ件数と広島の2025/10/20の天気、交通情報をWeb検索し、日付とともに日本語で教えてください。
```

**Kết quả:**
```
ORDERS表のORDER_STATUS列が3-Shipped以外で、City列がHiroshimaのものは0件です。
したがって、2025/10/20の広島の天気や交通情報を検索する必要はありません。
```

**✅ Logic hoạt động đúng:** Không thực hiện Web search khi không có sản phẩm chưa ship!

---

## 📊 Xác nhận Execution History (ReAct history)

Internal operation có thể xác nhận qua dictionary views mới được chuẩn bị cho Select AI Agent.

### 1️⃣ Agent Team History

**Views:** `DBA_AI_AGENT_TEAM_HISTORY` / `USER_AI_AGENT_TEAM_HISTORY`

Xem được Agent Team nào được execute khi nào, nhưng không thể xác nhận internal operation của ReAct.

```sql
SQL> SELECT * FROM USER_AI_AGENT_TEAM_HISTORY 
     WHERE TRUNC(START_DATE) = TRUNC(SYSDATE);

TEAM_EXEC_ID                         TEAM_NAME      STATE      START_DATE                        END_DATE
------------------------------------ -------------- ---------- --------------------------------- ---------------------------------
4181621B-01C2-3D2E-E063-EE17000A80DE SC_AGENT_TEAM2 SUCCEEDED  19-OCT-25 10.25.17.851059000 AM  19-OCT-25 10.25.47.648971000 AM
```

### 2️⃣ Task History

**Views:** `DBA_AI_AGENT_TASK_HISTORY` / `USER_AI_AGENT_TASK_HISTORY`

Có thể xác nhận:
- Agent và Task nào trong Agent Team được execute theo thứ tự nào
- Kết quả của mỗi Task

Từ kết quả dưới đây, có thể thấy **search ORDERS table trước, sau đó Web search dựa trên kết quả**:

```sql
TASK_ORDER  AGENT_NAME      TASK_NAME       RESULT
----------  --------------  --------------  --------------------------------------------------
0           ORDERS_ANALYST  ORDERS_ANALYZE  名古屋の該当するデータ件数は9件です...
1           WEBSEARCHER     WEB_ANALYZE2    名古屋の該当するデータ件数は9件です。
                                            2025年10月18日の名古屋の天気は曇り一時雨...
```

### 3️⃣ Tool History

**Views:** `DBA_AI_AGENT_TOOL_HISTORY` / `USER_AI_AGENT_TOOL_HISTORY`

Có thể xác nhận thêm:
- **Input và output thực tế** cho mỗi tool
- Trong trường hợp này:
  - SQL nào được generate từ natural language bởi `ORDERS_QUERY` tool
  - Search keywords và search results nào được lấy bởi `WEBSEARCH_TOOL`

```sql
TOOL_NAME        INPUT                                              OUTPUT
---------------  -------------------------------------------------  --------------------------------------------------
ORDERS_QUERY     {"QUERY":"SELECT COUNT(*) FROM ORDERS..."}        {"status": "success", "result": '9'}
WEBSEARCH_TOOL   {"QUERY":"名古屋 2025年10月18日 天気 交通情報"}    {"status": "success", "result": '名古屋まつり開催...'}
```

---

## 🎯 Tổng kết

Đây là implementation ReAct bằng Select AI Agent.

Thông thường khi implement ReAct, nhiều trường hợp sử dụng Python để cấu thành **LangGraph**, **MCP Server**, và **MCP Client**.

Với **Select AI Agent**, có thể thực hiện điều tương tự **trên Oracle DB**.

Tuy có một số "お作法" (cách làm) đặc trưng của tính năng này, nhưng nếu quen thuộc, có thể khá dễ dàng implement **autonomous workflow bằng AI agent**.

---

## 📚 Tài liệu tham khảo

1. **DBMS_CLOUD_AI_AGENT Package Reference**
2. **Select AI Agent - Various Usage Examples (Oracle Documentation)**
3. **[Oracle Autonomous AI Database Serverless の使用 - Concepts](https://docs.oracle.com/ja-jp/iaas/autonomous-database-serverless/doc/select-ai-agents-concepts.html)**
4. **[MCPで変わるAIエージェント開発 - ReActエージェントとMCP](https://qiita.com/ksonoda/items/1c681a563a95a93975ff#react%E3%82%A8%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%88%E3%81%A8mcp)**

---

## 💡 Key Takeaways

### ✨ Ưu điểm của Select AI Agent

1. ✅ **Oracle DB-only solution** - Không cần Python, LangGraph, MCP Server/Client
2. ✅ **Data governance tích hợp** - Quản lý security và governance trong DB
3. ✅ **Enterprise-ready** - Dễ deploy trong môi trường enterprise
4. ✅ **Workflow phức tạp** - Có thể implement bất kỳ workflow nào
5. ✅ **Full observability** - Dictionary views cho complete execution history
6. ✅ **Tận dụng DB assets** - Sử dụng data và PL/SQL hiện có

### 🔧 Technical Features

- **4 Objects:** Agent Team → Agent → Task → Tool
- **Sequential processing** với task dependencies
- **5 Tool types:** SQL (NL2SQL), RAG, Web Search, Notification, PL/SQL
- **Conversation management** với conversation_id
- **LLM integration:** OpenAI gpt-4o, gpt-4o-search-preview
- **Full audit trail:** Team, Task, và Tool history views

### 🎯 Use Cases phù hợp

- **Enterprise data workflows** cần data governance
- **Hybrid AI + Database operations** 
- **Autonomous business processes**
- **Internal tools** không muốn maintain separate Python infrastructure
- **Teams quen thuộc với Oracle DB** hơn Python ecosystem

---

## 🚀 Kết luận

**Select AI Agent** mở ra khả năng mới cho việc **implement AI agents directly trong Oracle Database**, loại bỏ nhu cầu về separate Python infrastructure trong nhiều use cases.

Đây là một **breakthrough feature** cho organizations muốn:
- Tận dụng existing Oracle investments
- Maintain data và AI logic trong cùng platform
- Simplify architecture và reduce operational complexity

**Perfect cho:** Enterprise environments với strong Oracle footprint và data governance requirements! 🎯

URL: https://qiita.com/ssfujita/items/80454001845fa1493495
TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
