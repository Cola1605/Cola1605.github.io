---
title: "Hướng dẫn nhập môn StrandsAgents"
date: 2025-10-02T08:00:00+07:00
categories: ["AWS", "AI and Machine Learning", "Development"]
tags: ["StrandsAgents", "AWS", "Bedrock", "VSCode", "AI", "Development"]
description: "Hướng dẫn nhập môn StrandsAgents - công cụ AI mạnh mẽ trên AWS Bedrock"
---

# Hướng dẫn nhập môn StrandsAgents

**Tác giả:** @yakumo_09 (やくも)  
**Xuất bản:** 2025-09-27  
**Nguồn:** [Qiita](https://qiita.com/yakumo_09/items/f85a8a0634e30b0d756c)  
**Likes:** 17 | **Stocks:** 13

---

## Mở đầu

Gần đây, có rất nhiều framework dành cho agent được ra mắt, và trong số đó tôi bắt đầu thấy tên "StrandsAgents" xuất hiện và cảm thấy tò mò nên quyết định thử nghiệm. StrandsAgents là một lightweight framework cho phép định nghĩa agent với cấu trúc khá đơn giản. Trong bài viết này, tôi sẽ giới thiệu đầy đủ từ việc thiết lập môi trường cơ bản để bắt đầu sử dụng StrandsAgents, cách gọi model, đến cách tích hợp các tool (hàm bên ngoài).

Bài viết này được viết dành cho những ai có thắc mắc "Gần đây agent có vẻ đang thịnh hành nhưng cuối cùng thì nên bắt đầu như thế nào?" và tôi sẽ cố gắng tổng hợp một cách chi tiết nhất có thể.

## StrandsAgents là gì

StrandsAgents là SDK dành cho AI agent sử dụng phương pháp tiếp cận model-driven do bộ phận open source của AWS phát hành. "Strands" có vẻ như ám chỉ đến cấu trúc xo螺旋 của DNA, là một framework giúp kết hợp model và tool một cách chặt chẽ để trở nên dễ sử dụng hơn.

## Các bước thiết lập môi trường

Lần này tôi sẽ thực hiện trên VS Code. Tại thời điểm viết bài, tôi đang thực hiện trên Mac, nhưng trên Windows cũng có thể thực hiện theo các bước tương tự.

Tôi tạo folder "Strands" trên desktop và làm việc trong đó.

Đầu tiên, cài đặt uv và tạo môi trường ảo.

```bash
brew install uv
uv venv
```

Tiếp theo, kích hoạt môi trường ảo và import các thành phần của strands.

```bash
source .venv/bin/activate
uv pip install strands-agents strands-agents-tools strands-agents-builder
```

Cuối cùng, tạo file thực thi. Mặc dù StrandsAgent cần thiết lập môi trường, nhưng code tối thiểu chỉ cần như thế này để có thể chạy được.

```python
from strands import Agent
agent = Agent()
response = agent("Japan AWS Jr.Championsについて教えて")
```

Đến đây là đã hoàn thành chuẩn bị. Hãy thử chạy ngay! Ngoài ra, StrandsAgent có cơ chế gọi Claude 4 Sonnet làm mặc định. Hãy nhập lệnh sau vào terminal và kiểm tra kết quả thực thi.

```bash
uv run strands_1.py
```

## Thử gọi model yêu thích

Một trong những đặc điểm của Strands là có thể gọi nhiều LLM model khác nhau. Lần này tôi sẽ thử sử dụng Amazon Nova.

```python
from strands import Agent
from strands.models import BedrockModel

bedrock_model = BedrockModel(
    model_id="us.amazon.nova-premier-v1:0",
    temperature=0.3,
    top_p=0.8,
)

agent = Agent(model=bedrock_model)

response = agent("Amazon Bedrockについて教えて")
```

Hãy thực thi bằng lệnh sau!

```bash
uv run strands_2.py
```

Những ai muốn thử với các model khác, hãy tham khảo danh sách model dưới đây và thử nghiệm nhiều cách khác nhau.

Ngoài ra, khi sử dụng các model hỗ trợ cross-region inference như Amazon Nova, nếu chỉ chỉ định model ID thôi có thể sẽ gặp lỗi. Trong trường hợp đó cần phải mô tả theo định dạng được chỉ định gọi là inference profile.

## Thử trang bị tool

StrandsAgent khi được decorate bằng "tool", AI sẽ tự động nhận định đây là tool có thể sử dụng và sẽ có thể dùng được. Lần này tôi sẽ implement:

• Tool cho biết thời tiết (dummy chỉ trả về sunny)
• Tool tìm kiếm web

### Tool dự báo thời tiết

```python
from dotenv import load_dotenv
from strands import Agent, tool

load_dotenv()

# Dummy luôn trả về sunny
@tool
def weather():
    """ Get weather """
    return "sunny"

# Tạo agent
agent = Agent(
    model="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
     tools=[weather]
)

# Gọi agent
agent("今日の天気は？")
```

Hãy thực thi bằng lệnh sau!

```bash
uv run strands_3.py
```

### Tool tìm kiếm web

Đầu tiên, import tool tìm kiếm web bằng lệnh dưới đây, lần này sử dụng DuckDuckGO!

```bash
uv pip install ddgs
```

Code như sau! Sẽ tìm kiếm tin tức mới nhất và tóm tắt!

```python
# Import Agent and tools
import logging

from ddgs import DDGS
from ddgs.exceptions import DDGSException, RatelimitException
from strands import Agent, tool

# Configure logging
logging.getLogger("strands").setLevel(logging.INFO)

# Define a websearch tool
@tool
def websearch(keywords: str, region: str = "jp-ja", max_results: int | None = None) -> str:
    """Tìm kiếm tin tức web tiếng Nhật bằng DuckDuckGo. """
    try:
        results = DDGS().text(keywords, region=region, max_results=max_results)
        return results if results else "結果が見つかりませんでした。"
    except RatelimitException:
        return "レート制限に達しました。しばらく待ってから再試行してください。"
    except DDGSException as d:
        return f"DuckDuckGo検索でエラーが発生しました: {d}"
    except Exception as e:
        return f"不明なエラーが発生しました: {e}"
        
recipe_agent = Agent(
   system_prompt=(
        "あなたは親切なニュースアシスタントです。"
        "ユーザーが関心を示した話題について、最新のニュース記事を検索し、簡潔に要約してください。"
        "必要に応じてwebsearchツールを使用し、記事のタイトルとURLをまとめてください。"
        "返答は必ず日本語で行ってください。"
    ),
    tools=[websearch], 
)

response = recipe_agent("最近のAIに関する重要なニュースを教えてください")

print(f"メトリクス : {response.metrics}")
```

Hãy thực thi bằng lệnh dưới đây!

```bash
uv run strands_4.py
```

## Kết nối với MCP server

StrandsAgent cũng rất giỏi trong việc liên kết với MCP đang được chú ý gần đây. Lần này tôi sẽ sử dụng MCP server tài liệu giải thích về AWS documents.

```python
from mcp import stdio_client, StdioServerParameters
from strands import Agent
from strands.tools.mcp import MCPClient

mcp = MCPClient(lambda: stdio_client(
    StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )
))

with mcp:
    tools = mcp.list_tools_sync()

    agent = Agent(tools=tools)
    agent("Amazon Bedrock AgentCoreについて教えて下さい")
```

Hãy thực thi bằng lệnh dưới đây!

```bash
uv run strands_5.py
```

## Thử multi-agent

Trong StrandsAgents, không chỉ sử dụng một agent được trang bị tool mà còn hỗ trợ "cấu hình multi-agent" cho phép nhiều agent liên kết với nhau.

Ở đây, tôi sẽ giới thiệu ví dụ thực tế về cấu hình mà "nhiều agent có vai trò khác nhau hợp tác để thực hiện một task".

### Swarm tool

Strands có sẵn cơ chế Swarm như một tool tiện lợi để gọi nhiều agent cùng lúc. Điều này rất tiện lợi trong các tình huống như "đưa cùng một câu hỏi cho nhiều agent và nhận câu trả lời từ góc nhìn của từng agent". Có thể định nghĩa các agent tổng hợp và gọi chúng cùng lúc như sau. Trong quá trình thực thi, có thể xác nhận "đã chuyển giao xử lý cho 〇〇 agent", đó là vì AI tự động đánh giá và chuyển giao xử lý.

```python
from strands import Agent
from strands_tools import swarm
from strands.multiagent import Swarm

# Khởi tạo agent
agent = Agent(model="us.anthropic.claude-3-7-sonnet-20250219-v1:0", tools=[swarm])

# Gọi bằng ngôn ngữ tự nhiên
result = str(agent(
    "生成AIベースのエージェントに関する現在の市場動向を、4体のエージェント群で分析してください。"
))

print(result)

# Tạo các agent có chuyên môn khác nhau
research_agent = Agent(system_prompt=("""Bạn là một research agent chuyên về thu thập và phân tích thông tin.
Vai trò của bạn là cung cấp thông tin và kết quả điều tra dựa trên sự thật trong swarm.
Hãy tập trung vào việc cung cấp dữ liệu chính xác và xác định các khía cạnh chính của vấn đề.
Khi nhận thông tin từ các agent khác, hãy đánh giá xem nó có phù hợp với nghiên cứu của bạn không.
"""),
name="research_agent", model="us.anthropic.claude-3-7-sonnet-20250219-v1:0")

creative_agent = Agent(system_prompt=("""Bạn là một creative agent chuyên tạo ra các giải pháp đổi mới.
Vai trò của bạn là đề xuất cách tiếp cận sáng tạo từ góc nhìn độc đáo trong swarm.
Hãy sử dụng thông tin từ các agent khác đồng thời thêm vào sức sáng tạo của chính bạn.
Hãy tập trung vào những cách tiếp cận mới mà các agent khác không thể nghĩ ra.
"""),
name="creative_agent", model="us.anthropic.claude-3-7-sonnet-20250219-v1:0")

critical_agent = Agent(system_prompt=("""Bạn là một critical agent chuyên phân tích các ý tưởng được đề xuất và tìm ra khuyết điểm.
Vai trò của bạn là đánh giá các giải pháp được đề xuất bởi các agent khác và chỉ ra các vấn đề tiềm ẩn.
Hãy xem xét cẩn thận các giải pháp được đề xuất, tìm ra điểm yếu và sự thiếu sót, đề xuất các điểm cải thiện.
Hãy đóng góp một cách phê phán nhưng mang tính xây dựng để giải pháp cuối cùng trở nên vững chắc hơn.
"""),
name="critical_agent", model="us.anthropic.claude-3-7-sonnet-20250219-v1:0")

summarizer_agent = Agent(system_prompt=("""Bạn là một summarizer agent chuyên về tích hợp thông tin.
Vai trò của bạn là tích hợp những hiểu biết từ tất cả các agent và tạo ra giải pháp toàn diện cuối cùng.
Hãy kết hợp những ý tưởng xuất sắc nhất, đối phó với các chỉ trích và tạo ra bản tóm tắt rõ ràng, khả thi trả lời chính xác câu hỏi ban đầu.
"""),
name="summarizer_agent", model="us.anthropic.claude-3-7-sonnet-20250219-v1:0")

# Tạo swarm tổng hợp các agent trên
swarm = Swarm(
    [research_agent, creative_agent, critical_agent, summarizer_agent],
    max_handoffs=20,
    max_iterations=20,
    execution_timeout=900.0,  # Thời gian thực thi tối đa: 15 phút
    node_timeout=300.0,       # Thời gian thực thi của mỗi agent: 5 phút
    repetitive_handoff_detection_window=8,  # Cần có 3 agent khác nhau trở lên trong 8 lần handoff gần nhất
    repetitive_handoff_min_unique_agents=3
)

# Cho swarm thực thi task
result = swarm("Tạo bài viết blog về Agentic AI và xuất ra tóm tắt cho SNS.")

# Truy cập kết quả cuối cùng
print(f"Status: {result.status}")

# Xác nhận agent nào đã tham gia
for node in result.node_history:
    print(f"Agent: {node.node_id}")

# Lấy kết quả của node cụ thể
research_result = result.results["research_agent"].result
print(f"Kết quả research: {research_result}")

# Lấy thông tin performance khi thực thi
print(f"Tổng số iteration: {result.execution_count}")
print(f"Thời gian thực thi: {result.execution_time}ms")
print(f"Lượng token sử dụng: {result.accumulated_usage}")
```

Hãy thực thi bằng lệnh dưới đây!

```bash
uv run strands_6.py
```

## Kết thúc

Thấy thế nào? Bản thân tôi cũng có cảm giác hơi muộn một chút nhưng khi học thì thấy rất thú vị. Không ngờ việc phát triển AI agent lại trở nên đơn giản đến vậy... StrandsAgent còn nhiều phần tôi chưa viết hết trong lần này nên tôi sẽ tiếp tục thử nghiệm. Hy vọng bài viết này sẽ giúp ích cho những ai đang nghĩ "có lẽ mình sẽ thử StrandsAgent...".