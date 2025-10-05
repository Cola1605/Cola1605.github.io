# Bắt đầu xây dựng AI Agent trên AWS! Triển khai Strands lên AgentCore

**Tác giả:** minorun365  
**Ngày xuất bản:** 2025-10-04  
**Nguồn:** [Qiita](https://qiita.com/minorun365/items/deb10c8e7a6b1219e595)  
**Tags:** Python, AWS, AI, StrandsAgents, BedrockAgentCore

## Tóm tắt

Hướng dẫn thực hành xây dựng và triển khai AI Agent bằng framework Strands và AWS AgentCore. Từ việc tạo AI agent đơn giản 3 dòng code, đến tích hợp công cụ, sử dụng MCP server, cấu trúc multi-agent, và cuối cùng là triển khai trên môi trường serverless.

---

Bài viết này được viết hoàn toàn bằng tay.

Đây là tài liệu hướng dẫn cho sự kiện, nhưng bất kỳ ai cũng có thể thử nghiệm chỉ trong khoảng 1 giờ khi đọc bài viết này!

Số lượng người "sử dụng" AI Agent như Claude Code đã tăng lên đáng kể.

Giờ đây, việc sử dụng AI đã trở thành điều hiển nhiên đối với tất cả mọi người. Hãy tiến thêm một bước và cùng bắt đầu "tạo ra" AI Agent. Điều này sẽ thú vị gấp 100 lần! 🙌

## Chuẩn bị trước ngày diễn ra

### Tạo tài khoản AWS

Khuyến nghị tạo mới. Nếu sử dụng tài khoản hiện có, vui lòng tự chịu trách nhiệm.

※ Gần đây có các gói miễn phí hoàn toàn với chức năng hạn chế, nhưng vui lòng chọn "Paid" (Có phí).

Chi phí dự kiến cho lần này khoảng vài chục yên. (Không thể đảm bảo 100%, vui lòng tự chịu trách nhiệm)

### Tạo tài khoản GitHub

Những ai đã có tài khoản có thể sử dụng tài khoản hiện có.

## Giới thiệu

Việc sử dụng dịch vụ cloud rất tiện lợi cho việc xây dựng AI Agent.

Với Strands, bạn có thể dễ dàng viết AI Agent bằng Python.

AI Agent đã phát triển có thể được triển khai rẻ và serverless bằng AgentCore.

## 0. Cài đặt môi trường

### 0-1. Thiết lập môi trường phát triển

#### Tạo repository GitHub

• Sau khi đăng nhập, tạo repository mới từ "New" ở góc trên bên trái của trang chủ
  ◦ Repository name: `tokyo-ai2025`
  ◦ Choose visibility: Private
  ◦ Add README: On

#### Khởi động GitHub Codespaces

• Sau khi tạo repository, nhấp vào nút màu xanh "Code > Create codespace on main" ở góc trên bên phải

#### Tạo các file cần thiết

• Chạy lệnh sau trong terminal ở phần dưới màn hình codespace

```bash
touch .env
```

• Ghi nội dung sau vào file đã tạo

```bash
# Thông tin xác thực AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-west-2
```

Trong codespace, file sẽ được tự động lưu ngay khi bạn nhập. Giá trị của dòng 1 và 2 sẽ được điền trong bước tiếp theo.

### 0-2. Thiết lập tài khoản AWS

#### Tạo IAM user

• Đăng nhập vào AWS Management Console (https://console.aws.amazon.com/)

Hands-on này được thực hiện hoàn toàn trong region US West (Oregon). Hãy chuyển region ở góc trên bên phải màn hình trước.

• Tìm kiếm và truy cập "IAM"
• Từ sidebar "Users", tạo user mới
  ◦ Bước 1
   ■ User name: `codespaces`
  ◦ Bước 2
   ■ Permission options: Attach policies directly
   ■ Permission policies: Chọn `AdministratorAccess`
  ◦ Tiếp tục các bước còn lại

#### Tạo IAM access key

• Sau khi tạo IAM user, nhấp vào tên user đã tạo để mở
• Từ phần Overview, chọn "Create access key"
  ◦ Bước 1
   ■ Use case: Local code
   ■ Tích vào "I understand the above recommendation and want to proceed to create an access key."
  ◦ Tiếp tục các bước còn lại
• Sau khi tạo, dán access key vào dòng 1 và secret access key vào dòng 2 của file `.env` trong codespace

```bash
# Thông tin xác thực AWS
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE #Ví dụ
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY #Ví dụ
AWS_DEFAULT_REGION=us-west-2
```

Thông tin xác thực này có quyền administrator nên hãy xử lý cẩn thận.

Nếu vô tình push lên public GitHub repository, kẻ xấu có thể phát hiện trong vài giây và lạm dụng tài khoản AWS của bạn.

#### Kích hoạt model Bedrock

※ AWS đã thông báo rằng bước này có thể không cần thiết từ ngày 8/10/2025 trở đi.

• Tìm kiếm và truy cập "Amazon Bedrock" trong AWS Management Console
• Từ sidebar "Model access", chọn "Modify model access"
  ◦ Bước 1: Tích vào các model sau
   ■ Claude Sonnet 4
   ■ Claude 3.7 Sonnet
  ◦ Bước 2: Thêm chi tiết use case cho Anthropic
   ■ Who are the target users?: Internal employees
   ■ Enter use case details: `hands-on`
  ◦ Tiếp tục các bước còn lại

## 1. Giới thiệu Strands Agents

• Tạo directory mới và di chuyển vào đó

```bash
mkdir 1_strands
cd 1_strands
```

### 1-1. AI Agent 3 dòng code

• Tạo file mới

```bash
touch 1_agent.py
```

• Dán code sau vào file

```python
# Import các thư viện cần thiết
from dotenv import load_dotenv
from strands import Agent

# Load biến môi trường từ file .env
load_dotenv()

# Tạo và khởi động agent
agent = Agent()
agent("東京AI祭って何？")
```

Xin lỗi, tôi đã phóng đại. Nếu không có `.env` thì chỉ 3 dòng thôi.

Nếu không chỉ định model, mặc định sẽ sử dụng Claude Sonnet 4 của Bedrock.

• Cài đặt các module cần thiết và chạy bằng lệnh sau

```bash
pip install strands-agents python-dotenv
python 1_agent.py
```

AI sẽ trả lời nhưng có vẻ không biết về Tokyo AI Festival.

Tham khảo: Tất nhiên có thể gọi các model khác của Bedrock, cũng như các model của OpenAI!

### 1-2. Thêm công cụ cho AI

Hãy thêm chức năng tìm kiếm web như một "tool" để AI có thể trả lời thông tin mới nhất.

Trước tiên, hãy đăng ký (tạo tài khoản) dịch vụ tìm kiếm web Tavily. Nếu liên kết với tài khoản GitHub thì chỉ mất vài giây.

Copy API key hiển thị và thêm vào file `.env`.

```bash
# Thông tin xác thực AWS
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE #Đây là ví dụ
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY #Đây là ví dụ
AWS_DEFAULT_REGION=us-west-2

# Thông tin xác thực Tavily
TAVILY_API_KEY=tvly-oWHrOGmzokwl123drrXNlFBHL2EXAMPLE #Đây là ví dụ
```

• Tạo file mới

```bash
touch 2_tool.py
```

• Dán code sau vào file

```python
# Import các thư viện cần thiết
import os
from dotenv import load_dotenv
from strands import Agent, tool
from tavily import TavilyClient

# Load biến môi trường từ file .env
load_dotenv()

# Định nghĩa hàm tìm kiếm web như một tool
@tool
def search(query):
    tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    return tavily.search(query)

# Tạo agent với tool đã cấu hình
agent = Agent(tools=[search])

# Khởi động agent
agent("東京AI祭って何？")
```

• Chạy bằng lệnh sau

```bash
pip install tavily-python
python 2_tool.py
```

AI sẽ sử dụng tool tìm kiếm để trả lời.

Nếu phản hồi của AI Agent dừng giữa chừng, có thể do đã đạt quota giới hạn gọi model Claude của Bedrock và Strands đang retry ở background. Trong trường hợp đó, hãy thử chuyển sang model khác.

(Các model ID thay thế)
• us.anthropic.claude-3-7-sonnet-20250219-v1:0
• us.amazon.nova-premier-v1:0 ※Cần kích hoạt model access

### 1-3. Sử dụng tool từ MCP server do người khác tạo

Hãy thử sử dụng "AWS Knowledge MCP Server" có thể tìm kiếm tài liệu AWS.

• Tạo file mới

```bash
touch 3_mcp.py
```

• Dán code sau vào file

```python
# Import các thư viện cần thiết
from dotenv import load_dotenv
from strands import Agent
from strands.tools.mcp import MCPClient
from mcp.client.streamable_http import streamablehttp_client

# Load biến môi trường từ file .env
load_dotenv()

# Tạo MCP client
mcp = MCPClient(
    lambda: streamablehttp_client("https://knowledge-mcp.global.api.aws")
)

# Khởi động MCP client và tạo & gọi agent
with mcp:
    agent = Agent(
        model="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        tools=mcp.list_tools_sync()
    )
    agent("Bedrock Agentcoreのランタイムってどんな機能？一言で説明して。")
```

Do tìm kiếm tài liệu AWS làm tăng số lần suy luận, nên sử dụng Sonnet 3.7 có quota ban đầu của Bedrock khá rộng.

• Chạy bằng lệnh sau

```bash
pip install uv strands-agents-tools
python 3_mcp.py
```

### 1-4. Tạo Multi-agent

Sử dụng pattern "Agent-as-Tools" trong đó supervisor gọi sub-agent như các tool. (Phương pháp phổ biến nhất và dễ implement nhất)

• Tạo file mới

```bash
touch 4_multi_agent.py
```

• Dán code sau vào file

```python
# Import các thư viện cần thiết
from dotenv import load_dotenv
from strands import Agent, tool
from strands_tools import calculator

# Load biến môi trường từ file .env
load_dotenv()

# Định nghĩa sub-agent 1
@tool
def math_agent(query: str):
    agent = Agent(
        model="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        system_prompt="Vui lòng thực hiện tính toán bằng tool",
        tools=[calculator]
    )
    return str(agent(query))

# Định nghĩa sub-agent 2
@tool
def haiku_agent(query: str):
    agent = Agent(
        model="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        system_prompt="Vui lòng sáng tác haiku 5-7-5 với chủ đề đã cho"
    )
    return str(agent(query))

# Tạo và chạy orchestrator agent
orchestrator = Agent(
    model="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    system_prompt="Vui lòng tính toán bài toán đã cho và sáng tác thành haiku",
    tools=[math_agent, haiku_agent]
)

orchestrator("Taro có 10 yên, được cho thêm 20 yên. Giờ có bao nhiêu?")
```

• Chạy bằng lệnh sau

```bash
pip install strands-agents-tools
python 4_multi_agent.py
```

Multi-agent sẽ cộng tác để trả lời.

## 2. Giới thiệu AgentCore

• Tạo directory mới và di chuyển vào đó

```bash
cd /workspaces/tokyo-ai2025

mkdir 2_agentcore
cd 2_agentcore
```

### 2-1. Kích hoạt tracing

Hands-on này được thực hiện hoàn toàn trong Oregon region. Hãy chuyển region ở góc trên bên phải màn hình trước.

• Tìm kiếm và truy cập "CloudWatch" trong AWS Management Console
• Từ sidebar "Transaction Search", nhấp "Enable Transaction Search"
• Tích vào "Check this option to ingest spans as structured logs" và nhấn "Save"

### 2-2. Gắn AgentCore SDK vào code

Wrap agent viết bằng Strands bằng SDK của AgentCore để tạo thành API server.

Tạo directory cho AgentCore build và tạo file mới trong đó

```bash
mkdir backend
cd backend

touch tavily_agent.py
```

• Dán code sau vào file

```python
# Import các thư viện cần thiết
from strands import Agent
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client
from bedrock_agentcore.runtime import BedrockAgentCoreApp

# Tạo API server cho AgentCore runtime
app = BedrockAgentCoreApp()

# Đặt hàm gọi agent làm entry point của API server
@app.entrypoint
async def invoke_agent(payload, context):

    # Lấy prompt và API key được nhập từ frontend
    prompt = payload.get("prompt")
    tavily_api_key = payload.get("tavily_api_key")

    ### Đây là code Strands thông thường ----------------------------------
    # Cấu hình Tavily MCP server
    mcp = MCPClient(lambda: streamablehttp_client(
        f"https://mcp.tavily.com/mcp/?tavilyApiKey={tavily_api_key}"
    ))

    # Gọi agent trong khi MCP client đang chạy
    with mcp:
        agent = Agent(
            model="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
            tools=mcp.list_tools_sync()
        )

        # Lấy phản hồi agent dưới dạng streaming
        stream = agent.stream_async(prompt)
        async for event in stream:
            yield event
    ### ------------------------------------------------------------

# Khởi động API server
app.run()
```

### 2-3. Deploy lên AgentCore runtime

Sử dụng "starter toolkit" để dễ dàng deploy AI Agent lên AgentCore runtime.

• Tạo file mới

```bash
touch requirements.txt
```

• Ghi nội dung sau

```txt
strands-agents
bedrock-agentcore
```

• Chạy các lệnh sau

```bash
# Đặt nội dung .env làm biến môi trường của terminal
export $(cat /workspaces/tokyo-ai2025/.env | grep -v ^# | xargs)

# Cài đặt starter toolkit của AgentCore
pip install bedrock-agentcore-starter-toolkit

# Chuẩn bị deploy
agentcore configure --entrypoint tavily_agent.py
```

• Nhấn `Enter` cho tất cả trong wizard

• Thực hiện deploy

```bash
# Deploy
agentcore launch
```

Chờ khoảng 1 phút, AI Agent của bạn sẽ được deploy lên AgentCore runtime.

Rất tiện lợi vì IAM role, ECR repository... đều được tạo tự động! Chỉ với thế này, AI Agent đã được host trên nền tảng serverless.

Sau khi deploy hoàn tất, hãy copy giá trị `Agent ARN` hiển thị vào notepad.

### 2-4. Kiểm tra hoạt động

Tạo giao diện frontend bằng thư viện Python "Streamlit" trên PC local và gọi Strands Agents trên AgentCore.

• Tạo file mới

```bash
cd /workspaces/tokyo-ai2025/2_agentcore
touch frontend.py
```

• Dán code sau vào file

```python
# Import các thư viện cần thiết
import os, boto3, json
import streamlit as st
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv(override=True)

# Nhập cài đặt trong sidebar
with st.sidebar:
    agent_runtime_arn = st.text_input("ARN của AgentCore runtime")
    tavily_api_key = st.text_input("Tavily API key", type="password")

# Vẽ title
st.title("Agent tìm kiếm mọi thứ")
st.write("Strands Agents sử dụng MCP server để thu thập thông tin!")

# Vẽ chat box
if prompt := st.chat_input("Hãy nhập tin nhắn"):
    # Hiển thị prompt của user
    with st.chat_message("user"):
        st.markdown(prompt)

    # Hiển thị câu trả lời của agent
    with st.chat_message("assistant"):
        # Gọi AgentCore runtime
        agentcore = boto3.client('bedrock-agentcore')
        payload = json.dumps({
            "prompt": prompt,
            "tavily_api_key": tavily_api_key
        })
        response = agentcore.invoke_agent_runtime(
            agentRuntimeArn=agent_runtime_arn,
            payload=payload.encode()
        )

        # Xử lý streaming response
        container = st.container()
        text_holder = container.empty()
        buffer = ""

        # Kiểm tra response từng dòng
        for line in response["response"].iter_lines():
            if line and line.decode("utf-8").startswith("data: "):
                data = line.decode("utf-8")[6:]

                # Bỏ qua nếu là string content
                if data.startswith('"') or data.startswith("'"):
                    continue

                # Chuyển dòng đã đọc thành JSON
                event = json.loads(data)

                # Phát hiện việc sử dụng tool
                if "event" in event and "contentBlockStart" in event["event"]:
                    if "toolUse" in event["event"]["contentBlockStart"].get("start", {}):
                        # Xác định text hiện tại
                        if buffer:
                            text_holder.markdown(buffer)
                            buffer = ""
                        # Hiển thị status tool
                        container.info("🔍 Đang sử dụng Tavily search tool")
                        text_holder = container.empty()

                # Phát hiện text content
                if "data" in event and isinstance(event["data"], str):
                    buffer += event["data"]
                    text_holder.markdown(buffer)
                elif "event" in event and "contentBlockDelta" in event["event"]:
                    buffer += event["event"]["contentBlockDelta"]["delta"].get("text", "")
                    text_holder.markdown(buffer)

        # Hiển thị text còn lại cuối cùng
        text_holder.markdown(buffer)
```

• Khởi động bằng lệnh sau

```bash
pip install streamlit
streamlit run frontend.py
```

• Nhấp vào nút "Mở trong trình duyệt" trong popup góc dưới bên phải
  ◦ Nếu đã đóng, hãy nhấp vào `http://localhost:8501` trong terminal

Nhập ARN đã memo trước đó và Tavily API key (có thể copy từ `.env`) vào sidebar, rồi thử đặt câu hỏi.

### 2-5. Giám sát vận hành

Rất tiện lợi vì có sẵn chức năng tương tự Langfuse (giống như Datadog version LLM).

#### Kiểm tra trace bằng AgentCore observability

• Tìm kiếm "Bedrock AgentCore" trong Management Console, từ sidebar "Agent runtimes" nhấp vào `tavily_agent`
• Mở rộng "Agent details" ở phía trên và nhấp "View observability"
• Từ tab "Traces view", nhấp vào trace ID để drill down lịch sử hoạt động của agent

#### Kiểm tra CloudWatch logs

Khi không khởi động được và không thể xem trace, hãy xem server log.

• Tìm kiếm và truy cập "CloudWatch" trong Management Console
• Từ sidebar "Log groups", nhấp vào `/aws/bedrock-agentcore/runtimes/tavily_agent-<chuỗi ngẫu nhiên>-DEFAULT`
• Từ "Search all log streams", có thể kiểm tra server log gần đây nhất

### Bước tiếp theo: Deploy frontend

Lần này đã chạy frontend trên PC local, nhưng có thể host miễn phí và public cho người khác bằng Streamlit Community Cloud. Những ai có thời gian hãy thử.

App được public có thể được truy cập bởi bất kỳ ai biết URL, nên có thể làm tăng chi phí sử dụng AWS của bạn. Hãy chú ý về cost và security.

Trước đây khi muốn deploy agent đã tạo, luôn có những lo lắng nhỏ như infrastructure nên dùng Lambda hay ECS, authentication và streaming thì sao, rồi monitoring... nhưng AgentCore chính là vị cứu tinh giải quyết tất cả những điều này!

Cũng cung cấp các SDK và CLI tool tiện lợi.

## Dọn dẹp

Sau khi tham gia, nhất định phải trả lời survey!

Khuyến nghị vận hành tài khoản AWS dùng một lần. Sau khi kết thúc hands-on, hãy hủy tài khoản AWS không cần thiết. (Sau khi hủy không thể sử dụng cùng địa chỉ email, nên nếu không phải email dùng một lần thì hãy đổi email trước khi hủy)

Tham khảo, các resource được tạo lần này như sau:

• Resource tính phí theo sử dụng
  ◦ AgentCore runtime
• Resource hầu như không tính phí
  ◦ IAM user
  ◦ IAM role
  ◦ ECR repository
  ◦ CodeBuild project

## Bonus

Đã xuất bản sách nhập môn học cách xây dựng AI Agent như lần này với hình minh họa màu đầy đủ và dễ hiểu trong tuần này!

Ngoài Strands, có thể học được toàn bộ các framework chính thống như LangGraph phổ biến, Mastra có thể viết agent bằng TypeScript!

Giới thiệu phương pháp phát triển frontend bằng Next.js và deploy lên AWS bằng Amplify Gen2. Cũng giải thích về LLMOps sử dụng Langfuse và Ragas.