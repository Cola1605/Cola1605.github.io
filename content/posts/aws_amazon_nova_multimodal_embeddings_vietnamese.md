---
title: "Amazon Nova Multimodal Embeddings: Mô hình embedding đa phương thức tối ưu cho RAG đại lý và tìm kiếm ngữ nghĩa"
date: 2025-11-04
categories: ["AWS", "AI", "Machine-Learning"]
tags: ["Amazon-Nova", "Embeddings", "Bedrock", "RAG", "Multimodal", "Semantic-Search"]
description: "Amazon Nova Multimodal Embeddings trên Bedrock - mô hình embedding thống nhất hỗ trợ text, image, video, audio. Agentic RAG và semantic search với độ chính xác cao."
---

# Amazon Nova Multimodal Embeddings: Mô hình embedding đa phương thức tối ưu cho RAG đại lý và tìm kiếm ngữ nghĩa

**Tác giả:** Danilo Poccia  
**Ngày xuất bản:** 04/11/2025  
**Nguồn:** [AWS Blog](https://aws.amazon.com/jp/blogs/news/amazon-nova-multimodal-embeddings-now-available-in-amazon-bedrock/)

---

## Tóm tắt

Ngày 28 tháng 10, Amazon đã giới thiệu **Amazon Nova Multimodal Embeddings** - mô hình embedding đa phương thức tiên tiến dành cho các ứng dụng tạo sinh tăng cường truy xuất đại lý (Agentic RAG) và tìm kiếm ngữ nghĩa. Mô hình này hiện có sẵn trên **Amazon Bedrock**. Đây là mô hình embedding thống nhất đầu tiên hỗ trợ văn bản, tài liệu, hình ảnh, video và âm thanh thông qua một mô hình duy nhất, cho phép tìm kiếm đa phương thức với độ chính xác cực cao.

---

## Phần 1: Giới thiệu về Amazon Nova Multimodal Embeddings

### 1.1. Embedding là gì?

**Mô hình embedding** chuyển đổi các đầu vào như văn bản, hình ảnh và âm thanh thành các biểu diễn số được gọi là **"embeddings"**. Những embedding này nắm bắt ý nghĩa ngữ nghĩa của đầu vào, cho phép hệ thống AI có thể so sánh, tìm kiếm và phân tích, từ đó tăng cường các trường hợp sử dụng như tìm kiếm ngữ nghĩa và RAG.

### 1.2. Đặc điểm nổi bật của Nova Multimodal Embeddings

**Amazon Nova Multimodal Embeddings** là mô hình embedding đa phương thức tiên tiến với các đặc điểm sau:

- **Hỗ trợ đa phương thức:** Văn bản, tài liệu, hình ảnh, video, âm thanh
- **Mô hình thống nhất:** Một mô hình duy nhất xử lý tất cả các loại nội dung
- **Độ chính xác cao:** Tìm kiếm đa phương thức với độ chính xác cực cao
- **Không gian ngữ nghĩa thống nhất:** Tất cả các phương thức được biểu diễn trong cùng một không gian vector

---

## Phần 2: Bối cảnh và Thách thức

### 2.1. Nhu cầu của tổ chức

Các tổ chức ngày càng tìm kiếm các giải pháp để trích xuất thông tin từ dữ liệu phi cấu trúc đang tăng trưởng liên tục, bao gồm:

- **Hình ảnh sản phẩm**
- **Tài liệu chứa infographic và văn bản**
- **Video clip do người dùng tải lên**
- **File âm thanh và podcast**

### 2.2. Hạn chế của các mô hình truyền thống

Mô hình embedding truyền thống có thể trích xuất giá trị từ dữ liệu phi cấu trúc, nhưng thường **chuyên biệt hóa cho một loại nội dung duy nhất**. Điều này dẫn đến các hạn chế:

#### ❌ Hạn chế chính:

1. **Phải xây dựng giải pháp embedding đa phương thức phức tạp**
2. **Bị giới hạn vào các trường hợp sử dụng chuyên biệt cho một loại nội dung**
3. **Khó nắm bắt quan hệ đa phương thức hiệu quả** trong:
   - Tài liệu có văn bản và hình ảnh xen kẽ
   - Video chứa các yếu tố hình ảnh, âm thanh và văn bản

### 2.3. Giải pháp của Nova Multimodal Embeddings

**Nova Multimodal Embeddings** hỗ trợ không gian ngữ nghĩa thống nhất cho văn bản, tài liệu, hình ảnh, video và âm thanh trong các trường hợp sử dụng như:

✅ **Tìm kiếm đa phương thức giữa các nội dung hỗn hợp**  
✅ **Tìm kiếm bằng hình ảnh tham chiếu**  
✅ **Truy xuất tài liệu trực quan**  
✅ **Phân tích nội dung đa phương thức**

---

## Phần 3: Hiệu suất và Đánh giá

### 3.1. Kết quả Benchmark

Qua đánh giá trên nhiều benchmark khác nhau, mô hình đã đạt được **độ chính xác vượt trội** có thể sử dụng ngay lập tức.

![Amazon Nova Embeddings のベンチマーク](https://d2908q01vomqb2.cloudfront.net/da4b9237bacccdf19c0760cab7aec4a8359010b0/2025/10/28/nova-multimodal-embeddings-benchmarks-with-notes-1024x642.png)

*Bảng kết quả benchmark của Amazon Nova Embeddings*

### 3.2. Các tính năng chính

#### 📊 Độ dài ngữ cảnh:
- **Văn bản:** Tối đa 8K tokens
- **Video/Âm thanh:** Tối đa 30 giây mỗi segment

#### 🌍 Hỗ trợ ngôn ngữ:
- Tối đa **200 ngôn ngữ**

#### 🔄 API:
- **API đồng bộ:** Cho ứng dụng real-time
- **API bất đồng bộ:** Cho xử lý nội dung lớn

#### ✂️ Segmentation (Chunking):
- Phân chia văn bản dài, video, và âm thanh thành các segment dễ quản lý
- Tạo embedding cho từng phần

#### 📐 Các kích thước đầu ra:
- **3,072 dimensions** - Biểu diễn chi tiết nhất
- **1,024 dimensions** - Cân bằng giữa độ chính xác và hiệu quả
- **384 dimensions** - Hiệu suất tìm kiếm tốt
- **256 dimensions** - Sử dụng tài nguyên tối thiểu

Các kích thước này được huấn luyện bằng **Matryoshka Representation Learning (MRL)**, cho phép tìm kiếm end-to-end với độ trễ thấp trong khi giảm thiểu sự biến động về độ chính xác.

---

## Phần 4: Hướng dẫn Sử dụng

### 4.1. Bắt đầu với Text Embedding

Nova Multimodal Embeddings tuân theo cùng mẫu như các mô hình khác trên Amazon Bedrock. Mô hình nhận đầu vào là văn bản, tài liệu, hình ảnh, video hoặc âm thanh, và trả về các embedding số có thể sử dụng cho tìm kiếm ngữ nghĩa, so sánh độ tương tự hoặc RAG.

#### Ví dụ với AWS SDK for Python (Boto3):

```python
import json
import boto3

MODEL_ID = "amazon.nova-2-multimodal-embeddings-v1:0"
EMBEDDING_DIMENSION = 3072

# Khởi tạo Amazon Bedrock runtime client
bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")

print(f"Generating text embedding with {MODEL_ID}...")

# Văn bản cần embedding
text = "Amazon Nova is a multimodal foundation model"

# Tạo embedding
request_body = {
    "taskType": "SINGLE_EMBEDDING",
    "singleEmbeddingParams": {
        "embeddingPurpose": "GENERIC_INDEX",
        "embeddingDimension": EMBEDDING_DIMENSION,
        "text": {"truncationMode": "END", "value": text},
    },
}

response = bedrock_runtime.invoke_model(
    body=json.dumps(request_body),
    modelId=MODEL_ID,
    contentType="application/json",
)

# Trích xuất embedding
response_body = json.loads(response["body"].read())
embedding = response_body["embeddings"][0]["embedding"]

print(f"Generated embedding with {len(embedding)} dimensions")
```

#### 💾 Lưu trữ và truy xuất:

Để lưu trữ và truy xuất embedding hiệu quả, bạn có thể sử dụng **Amazon S3 Vectors** - lưu trữ tối ưu chi phí hỗ trợ lưu trữ và truy vấn vector ở mọi quy mô.

---

### 4.2. Image Embedding

Nova Multimodal Embeddings có thể nắm bắt cả ngữ cảnh văn bản và hình ảnh vào một embedding duy nhất, cho phép hiểu tài liệu sâu hơn.

#### Cách sử dụng `embeddingPurpose`:

- **Khi tạo index:** Đặt `GENERIC_INDEX`
- **Khi truy vấn:** Đặt theo loại mục cần truy xuất
  - Ví dụ: `DOCUMENT_RETRIEVAL` cho truy xuất tài liệu

#### Ví dụ embedding hình ảnh:

```python
import base64

print(f"Generating image embedding with {MODEL_ID}...")

# Đọc và encode hình ảnh
with open("photo.jpg", "rb") as f:
    image_bytes = base64.b64encode(f.read()).decode("utf-8")

# Tạo embedding
request_body = {
    "taskType": "SINGLE_EMBEDDING",
    "singleEmbeddingParams": {
        "embeddingPurpose": "GENERIC_INDEX",
        "embeddingDimension": EMBEDDING_DIMENSION,
        "image": {
            "format": "jpeg",
            "source": {"bytes": image_bytes}
        },
    },
}

response = bedrock_runtime.invoke_model(
    body=json.dumps(request_body),
    modelId=MODEL_ID,
    contentType="application/json",
)

# Trích xuất embedding
response_body = json.loads(response["body"].read())
embedding = response_body["embeddings"][0]["embedding"]

print(f"Generated embedding with {len(embedding)} dimensions")
```

---

### 4.3. Video Embedding (API bất đồng bộ)

Xử lý nội dung video sử dụng **API bất đồng bộ**, đây là yêu cầu cho video lớn hơn 25 MB khi được encode bằng Base64.

#### Quy trình:

1. **Upload video lên S3 bucket** trong cùng AWS Region
2. **Tạo job embedding bất đồng bộ**
3. **Polling cho đến khi job hoàn thành**
4. **Lấy kết quả embedding từ S3**

#### Upload video lên S3:

```bash
aws s3 cp presentation.mp4 s3://my-video-bucket/videos/
```

#### Tạo job embedding video:

Ví dụ này cho thấy cách trích xuất thông tin embedding từ cả thành phần hình ảnh và âm thanh của file video. Tính năng segmentation cho phép chia video dài thành các chunk dễ quản lý, cho phép tìm kiếm hiệu quả nội dung video kéo dài nhiều giờ.

```python
# Khởi tạo Amazon S3 client
s3 = boto3.client("s3", region_name="us-east-1")

print(f"Generating video embedding with {MODEL_ID}...")

# Amazon S3 URI
S3_VIDEO_URI = "s3://my-video-bucket/videos/presentation.mp4"
S3_EMBEDDING_DESTINATION_URI = "s3://my-embedding-destination-bucket/embeddings-output/"

# Tạo job embedding bất đồng bộ cho video có âm thanh
model_input = {
    "taskType": "SEGMENTED_EMBEDDING",
    "segmentedEmbeddingParams": {
        "embeddingPurpose": "GENERIC_INDEX",
        "embeddingDimension": EMBEDDING_DIMENSION,
        "video": {
            "format": "mp4",
            "embeddingMode": "AUDIO_VIDEO_COMBINED",
            "source": {
                "s3Location": {"uri": S3_VIDEO_URI}
            },
            "segmentationConfig": {
                "durationSeconds": 15  # Chia thành các chunk 15 giây
            },
        },
    },
}

response = bedrock_runtime.start_async_invoke(
    modelId=MODEL_ID,
    modelInput=model_input,
    outputDataConfig={
        "s3OutputDataConfig": {
            "s3Uri": S3_EMBEDDING_DESTINATION_URI
        }
    },
)

invocation_arn = response["invocationArn"]
print(f"Async job started: {invocation_arn}")

# Polling cho đến khi job hoàn thành
print("\nPolling for job completion...")
while True:
    job = bedrock_runtime.get_async_invoke(invocationArn=invocation_arn)
    status = job["status"]
    print(f"Status: {status}")
    
    if status != "InProgress":
        break
    
    time.sleep(15)

# Kiểm tra xem job có hoàn thành thành công không
if status == "Completed":
    output_s3_uri = job["outputDataConfig"]["s3OutputDataConfig"]["s3Uri"]
    print(f"\nSuccess! Embeddings at: {output_s3_uri}")
    
    # Parse S3 URI để lấy bucket và prefix
    s3_uri_parts = output_s3_uri[5:].split("/", 1)  # Loại bỏ prefix "s3://"
    bucket = s3_uri_parts[0]
    prefix = s3_uri_parts[1] if len(s3_uri_parts) > 1 else ""
    
    # Mode AUDIO_VIDEO_COMBINED xuất ra embedding-audio-video.jsonl
    embeddings_key = f"{prefix}/embedding-audio-video.jsonl".lstrip("/")
    print(f"Reading embeddings from: s3://{bucket}/{embeddings_key}")
    
    # Đọc và parse file JSONL
    response = s3.get_object(Bucket=bucket, Key=embeddings_key)
    content = response['Body'].read().decode('utf-8')
    
    embeddings = []
    for line in content.strip().split('\n'):
        if line:
            embeddings.append(json.loads(line))
    
    print(f"\nFound {len(embeddings)} video segments:")
    for i, segment in enumerate(embeddings):
        print(f"  Segment {i}: {segment.get('startTime', 0):.1f}s - {segment.get('endTime', 0):.1f}s")
        print(f"    Embedding dimension: {len(segment.get('embedding', []))}")
else:
    print(f"\nJob failed: {job.get('failureMessage', 'Unknown error')}")
```

---

### 4.4. Thiết lập Vector Store với Amazon S3 Vectors

Sau khi tạo embedding, bạn cần một nơi để lưu trữ và truy xuất chúng hiệu quả. Amazon S3 Vectors cung cấp cơ sở hạ tầng cần thiết cho tìm kiếm độ tương tự quy mô lớn.

#### Các tính năng chính:

✅ **Nội dung tương tự về ngữ nghĩa được cluster tự nhiên**  
✅ **Tạo index có thể tìm kiếm**  
✅ **Sử dụng metadata để chỉ định định dạng gốc và nội dung cần tạo index**

#### Ví dụ thiết lập vector store:

```python
# Khởi tạo Amazon S3 Vectors client
s3vectors = boto3.client("s3vectors", region_name="us-east-1")

# Cấu hình
VECTOR_BUCKET = "my-vector-store"
INDEX_NAME = "embeddings"

# Tạo vector bucket và index (nếu chưa tồn tại)
try:
    s3vectors.get_vector_bucket(vectorBucketName=VECTOR_BUCKET)
    print(f"Vector bucket {VECTOR_BUCKET} already exists")
except s3vectors.exceptions.NotFoundException:
    s3vectors.create_vector_bucket(vectorBucketName=VECTOR_BUCKET)
    print(f"Created vector bucket: {VECTOR_BUCKET}")

try:
    s3vectors.get_index(vectorBucketName=VECTOR_BUCKET, indexName=INDEX_NAME)
    print(f"Vector index {INDEX_NAME} already exists")
except s3vectors.exceptions.NotFoundException:
    s3vectors.create_index(
        vectorBucketName=VECTOR_BUCKET,
        indexName=INDEX_NAME,
        dimension=EMBEDDING_DIMENSION,
        dataType="float32",
        distanceMetric="cosine"
    )
    print(f"Created index: {INDEX_NAME}")

# Danh sách văn bản mẫu
texts = [
    "Machine learning on AWS",
    "Amazon Bedrock provides foundation models",
    "S3 Vectors enables semantic search"
]

print(f"\nGenerating embeddings for {len(texts)} texts...")

# Tạo embedding cho mỗi văn bản bằng Amazon Nova
vectors = []
for text in texts:
    response = bedrock_runtime.invoke_model(
        body=json.dumps({
            "taskType": "SINGLE_EMBEDDING",
            "singleEmbeddingParams": {
                "embeddingDimension": EMBEDDING_DIMENSION,
                "text": {"truncationMode": "END", "value": text}
            }
        }),
        modelId=MODEL_ID,
        accept="application/json",
        contentType="application/json"
    )
    
    response_body = json.loads(response["body"].read())
    embedding = response_body["embeddings"][0]["embedding"]
    
    vectors.append({
        "key": f"text:{text[:50]}",  # Định danh duy nhất
        "data": {"float32": embedding},
        "metadata": {"type": "text", "content": text}
    })
    
    print(f"  ✓ Generated embedding for: {text}")

# Thêm tất cả các vector cần lưu trong một lần gọi
s3vectors.put_vectors(
    vectorBucketName=VECTOR_BUCKET,
    indexName=INDEX_NAME,
    vectors=vectors
)

print(f"\nSuccessfully added {len(vectors)} vectors to the store in one put_vectors call!")
```

---

### 4.5. Cross-Modal Search (Tìm kiếm đa phương thức)

**Cross-modal search** là một trong những lợi ích quan trọng nhất của multimodal embeddings. Bạn có thể tìm kiếm nhiều loại nội dung khác nhau bằng một truy vấn duy nhất và tìm nội dung tương tự nhất, bất kể nó được tạo từ văn bản, hình ảnh, video hay âm thanh.

#### Các trường hợp sử dụng:

✅ **Truy vấn bằng văn bản để tìm hình ảnh liên quan**  
✅ **Tìm kiếm video bằng mô tả văn bản**  
✅ **Tìm audio clip phù hợp với chủ đề cụ thể**  
✅ **Phát hiện tài liệu dựa trên nội dung hình ảnh và văn bản**

#### Ví dụ tìm kiếm:

```python
# Văn bản truy vấn
query_text = "foundation models"

print(f"\nGenerating embeddings for query '{query_text}' ...")

# Tạo embedding cho truy vấn
response = bedrock_runtime.invoke_model(
    body=json.dumps({
        "taskType": "SINGLE_EMBEDDING",
        "singleEmbeddingParams": {
            "embeddingPurpose": "GENERIC_RETRIEVAL",
            "embeddingDimension": EMBEDDING_DIMENSION,
            "text": {"truncationMode": "END", "value": query_text}
        }
    }),
    modelId=MODEL_ID,
    accept="application/json",
    contentType="application/json"
)

response_body = json.loads(response["body"].read())
query_embedding = response_body["embeddings"][0]["embedding"]

print(f"Searching for similar embeddings...\n")

# Tìm kiếm 5 vector tương tự nhất
response = s3vectors.query_vectors(
    vectorBucketName=VECTOR_BUCKET,
    indexName=INDEX_NAME,
    queryVector={"float32": query_embedding},
    topK=5,
    returnDistance=True,
    returnMetadata=True
)

# Hiển thị kết quả
print(f"Found {len(response['vectors'])} results:\n")

for i, result in enumerate(response["vectors"], 1):
    print(f"{i}. {result['key']}")
    print(f"  Distance: {result['distance']:.4f}")
    if result.get("metadata"):
        print(f"  Metadata: {result['metadata']}")
    print()
```

**Distance score** giúp bạn hiểu mức độ liên quan của kết quả với truy vấn gốc.

---

### 4.6. Script hoàn chỉnh

Dưới đây là script hoàn chỉnh tổng hợp tất cả các ví dụ trên:

```python
import json
import base64
import time
import boto3

MODEL_ID = "amazon.nova-2-multimodal-embeddings-v1:0"
EMBEDDING_DIMENSION = 3072

# Khởi tạo Amazon Bedrock runtime client
bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")

# ===== TEXT EMBEDDING =====
print(f"Generating text embedding with {MODEL_ID}...")

text = "Amazon Nova is a multimodal foundation model"

request_body = {
    "taskType": "SINGLE_EMBEDDING",
    "singleEmbeddingParams": {
        "embeddingPurpose": "GENERIC_INDEX",
        "embeddingDimension": EMBEDDING_DIMENSION,
        "text": {"truncationMode": "END", "value": text},
    },
}

response = bedrock_runtime.invoke_model(
    body=json.dumps(request_body),
    modelId=MODEL_ID,
    contentType="application/json",
)

response_body = json.loads(response["body"].read())
embedding = response_body["embeddings"][0]["embedding"]
print(f"Generated embedding with {len(embedding)} dimensions")

# ===== IMAGE EMBEDDING =====
print(f"Generating image embedding with {MODEL_ID}...")

with open("photo.jpg", "rb") as f:
    image_bytes = base64.b64encode(f.read()).decode("utf-8")

request_body = {
    "taskType": "SINGLE_EMBEDDING",
    "singleEmbeddingParams": {
        "embeddingPurpose": "GENERIC_INDEX",
        "embeddingDimension": EMBEDDING_DIMENSION,
        "image": {
            "format": "jpeg",
            "source": {"bytes": image_bytes}
        },
    },
}

response = bedrock_runtime.invoke_model(
    body=json.dumps(request_body),
    modelId=MODEL_ID,
    contentType="application/json",
)

response_body = json.loads(response["body"].read())
embedding = response_body["embeddings"][0]["embedding"]
print(f"Generated embedding with {len(embedding)} dimensions")

# ===== VIDEO EMBEDDING (ASYNC) =====
s3 = boto3.client("s3", region_name="us-east-1")

print(f"Generating video embedding with {MODEL_ID}...")

S3_VIDEO_URI = "s3://my-video-bucket/videos/presentation.mp4"
S3_EMBEDDING_DESTINATION_URI = "s3://my-video-bucket/embeddings-output/"

model_input = {
    "taskType": "SEGMENTED_EMBEDDING",
    "segmentedEmbeddingParams": {
        "embeddingPurpose": "GENERIC_INDEX",
        "embeddingDimension": EMBEDDING_DIMENSION,
        "video": {
            "format": "mp4",
            "embeddingMode": "AUDIO_VIDEO_COMBINED",
            "source": {
                "s3Location": {"uri": S3_VIDEO_URI}
            },
            "segmentationConfig": {
                "durationSeconds": 15
            },
        },
    },
}

response = bedrock_runtime.start_async_invoke(
    modelId=MODEL_ID,
    modelInput=model_input,
    outputDataConfig={
        "s3OutputDataConfig": {
            "s3Uri": S3_EMBEDDING_DESTINATION_URI
        }
    },
)

invocation_arn = response["invocationArn"]
print(f"Async job started: {invocation_arn}")

print("\nPolling for job completion...")
while True:
    job = bedrock_runtime.get_async_invoke(invocationArn=invocation_arn)
    status = job["status"]
    print(f"Status: {status}")
    
    if status != "InProgress":
        break
    
    time.sleep(15)

if status == "Completed":
    output_s3_uri = job["outputDataConfig"]["s3OutputDataConfig"]["s3Uri"]
    print(f"\nSuccess! Embeddings at: {output_s3_uri}")
    
    s3_uri_parts = output_s3_uri[5:].split("/", 1)
    bucket = s3_uri_parts[0]
    prefix = s3_uri_parts[1] if len(s3_uri_parts) > 1 else ""
    
    embeddings_key = f"{prefix}/embedding-audio-video.jsonl".lstrip("/")
    print(f"Reading embeddings from: s3://{bucket}/{embeddings_key}")
    
    response = s3.get_object(Bucket=bucket, Key=embeddings_key)
    content = response['Body'].read().decode('utf-8')
    
    embeddings = []
    for line in content.strip().split('\n'):
        if line:
            embeddings.append(json.loads(line))
    
    print(f"\nFound {len(embeddings)} video segments:")
    for i, segment in enumerate(embeddings):
        print(f"  Segment {i}: {segment.get('startTime', 0):.1f}s - {segment.get('endTime', 0):.1f}s")
        print(f"    Embedding dimension: {len(segment.get('embedding', []))}")
else:
    print(f"\nJob failed: {job.get('failureMessage', 'Unknown error')}")

# ===== VECTOR STORE SETUP (S3 VECTORS) =====
s3vectors = boto3.client("s3vectors", region_name="us-east-1")

VECTOR_BUCKET = "my-vector-store"
INDEX_NAME = "embeddings"

try:
    s3vectors.get_vector_bucket(vectorBucketName=VECTOR_BUCKET)
    print(f"Vector bucket {VECTOR_BUCKET} already exists")
except s3vectors.exceptions.NotFoundException:
    s3vectors.create_vector_bucket(vectorBucketName=VECTOR_BUCKET)
    print(f"Created vector bucket: {VECTOR_BUCKET}")

try:
    s3vectors.get_index(vectorBucketName=VECTOR_BUCKET, indexName=INDEX_NAME)
    print(f"Vector index {INDEX_NAME} already exists")
except s3vectors.exceptions.NotFoundException:
    s3vectors.create_index(
        vectorBucketName=VECTOR_BUCKET,
        indexName=INDEX_NAME,
        dimension=EMBEDDING_DIMENSION,
        dataType="float32",
        distanceMetric="cosine"
    )
    print(f"Created index: {INDEX_NAME}")

texts = [
    "Machine learning on AWS",
    "Amazon Bedrock provides foundation models",
    "S3 Vectors enables semantic search"
]

print(f"\nGenerating embeddings for {len(texts)} texts...")

vectors = []
for text in texts:
    response = bedrock_runtime.invoke_model(
        body=json.dumps({
            "taskType": "SINGLE_EMBEDDING",
            "singleEmbeddingParams": {
                "embeddingPurpose": "GENERIC_INDEX",
                "embeddingDimension": EMBEDDING_DIMENSION,
                "text": {"truncationMode": "END", "value": text}
            }
        }),
        modelId=MODEL_ID,
        accept="application/json",
        contentType="application/json"
    )
    
    response_body = json.loads(response["body"].read())
    embedding = response_body["embeddings"][0]["embedding"]
    
    vectors.append({
        "key": f"text:{text[:50]}",
        "data": {"float32": embedding},
        "metadata": {"type": "text", "content": text}
    })
    
    print(f"  ✓ Generated embedding for: {text}")

s3vectors.put_vectors(
    vectorBucketName=VECTOR_BUCKET,
    indexName=INDEX_NAME,
    vectors=vectors
)

print(f"\nSuccessfully added {len(vectors)} vectors to the store in one put_vectors call!")

# ===== CROSS-MODAL SEARCH =====
query_text = "foundation models"

print(f"\nGenerating embeddings for query '{query_text}' ...")

response = bedrock_runtime.invoke_model(
    body=json.dumps({
        "taskType": "SINGLE_EMBEDDING",
        "singleEmbeddingParams": {
            "embeddingPurpose": "GENERIC_RETRIEVAL",
            "embeddingDimension": EMBEDDING_DIMENSION,
            "text": {"truncationMode": "END", "value": query_text}
        }
    }),
    modelId=MODEL_ID,
    accept="application/json",
    contentType="application/json"
)

response_body = json.loads(response["body"].read())
query_embedding = response_body["embeddings"][0]["embedding"]

print(f"Searching for similar embeddings...\n")

response = s3vectors.query_vectors(
    vectorBucketName=VECTOR_BUCKET,
    indexName=INDEX_NAME,
    queryVector={"float32": query_embedding},
    topK=5,
    returnDistance=True,
    returnMetadata=True
)

print(f"Found {len(response['vectors'])} results:\n")

for i, result in enumerate(response["vectors"], 1):
    print(f"{i}. {result['key']}")
    print(f"  Distance: {result['distance']:.4f}")
    if result.get("metadata"):
        print(f"  Metadata: {result['metadata']}")
    print()
```

---

## Phần 5: Những điều cần biết

### 5.1. Các tùy chọn Dimension đầu ra

Nova Multimodal Embeddings cung cấp 4 tùy chọn dimension đầu ra:

| Dimension | Đặc điểm | Use case |
|-----------|----------|----------|
| **3,072** | Biểu diễn chi tiết nhất, cần nhiều lưu trữ và tính toán | Ứng dụng yêu cầu độ chính xác cao nhất |
| **1,024** | Cân bằng giữa độ chính xác và hiệu quả | Hầu hết các ứng dụng sản xuất |
| **384** | Hiệu suất tìm kiếm và hiệu quả tài nguyên thực tế | Ứng dụng cần tối ưu hiệu suất |
| **256** | Sử dụng tài nguyên tối thiểu | Ứng dụng có giới hạn tài nguyên |

Tính linh hoạt này giúp bạn tối ưu hóa cho các yêu cầu ứng dụng và chi phí cụ thể.

### 5.2. Hỗ trợ độ dài ngữ cảnh

Mô hình có thể xử lý ngữ cảnh khá dài:

#### Văn bản:
- Tối đa **8,192 tokens** mỗi lần

#### Video và Âm thanh:
- Tối đa **30 giây** mỗi segment
- Mô hình có thể phân đoạn các file dài hơn

#### Tính năng Segmentation:
- Đặc biệt hữu ích khi xử lý file media lớn
- Chia file thành các phần dễ quản lý
- Tạo embedding cho mỗi segment
- Cho phép tìm kiếm hiệu quả nội dung kéo dài nhiều giờ

### 5.3. Các tính năng Responsible AI

Mô hình bao gồm các tính năng Responsible AI được tích hợp trong Amazon Bedrock:

✅ **Content Safety Filter:** Nội dung gửi để embedding đi qua bộ lọc an toàn nội dung của Amazon Bedrock  
✅ **Fairness Measures:** Các biện pháp công bằng để giảm thiểu bias

### 5.4. API đồng bộ và bất đồng bộ

#### API đồng bộ:
- **Sử dụng cho:** Ứng dụng real-time cần phản hồi ngay lập tức
- **Ví dụ:** Xử lý truy vấn người dùng trong giao diện tìm kiếm

#### API bất đồng bộ:
- **Sử dụng cho:** Xử lý nội dung lớn với ít ảnh hưởng về độ trễ
- **Ví dụ:** Xử lý video và các workload khác

---

## Phần 6: Tích hợp trong Môi trường Production

### 6.1. Các tùy chọn lưu trữ Vector Database

Trong ứng dụng production, embedding có thể được lưu trữ trong bất kỳ vector database nào.

#### Các tùy chọn được khuyến nghị:

##### 1. Amazon OpenSearch Service
- **Tích hợp native** với Nova Multimodal Embeddings tại thời điểm ra mắt
- Xây dựng ứng dụng tìm kiếm có khả năng mở rộng dễ dàng
- Phù hợp cho: Ứng dụng tìm kiếm quy mô lớn

##### 2. Amazon S3 Vectors
- Lưu trữ và truy vấn embedding dễ dàng bằng dữ liệu ứng dụng
- Tối ưu chi phí
- Phù hợp cho: Hầu hết các use case, đặc biệt với chi phí quan trọng

##### 3. Các Vector Database khác
- OpenSearch
- Pinecone
- Weaviate
- Milvus
- Qdrant
- Và nhiều hơn nữa...

### 6.2. Architecture Pattern

```
[Ứng dụng] 
    ↓
[Amazon Bedrock - Nova Multimodal Embeddings]
    ↓
[Vector Store: S3 Vectors / OpenSearch Service]
    ↓
[Tìm kiếm & Truy xuất]
```

---

## Phần 7: Tính khả dụng và Giá cả

### 7.1. Tính khả dụng theo vùng

**Amazon Nova Multimodal Embeddings** hiện có sẵn trên Amazon Bedrock tại:

- **Region:** US East (N. Virginia) - `us-east-1`
- **Ngày ra mắt:** 28 tháng 10, 2025

### 7.2. Giá cả

Để biết thông tin chi tiết về giá, vui lòng truy cập:
- 🔗 [Amazon Bedrock Pricing Page](https://aws.amazon.com/bedrock/pricing/)

---

## Phần 8: Tài nguyên tham khảo

### 8.1. Tài liệu và Code Examples

#### Tài liệu chính thức:
- 📘 [Amazon Nova User Guide](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) - Tài liệu toàn diện
- 💻 [Amazon Nova Model Cookbook trên GitHub](https://github.com/aws-samples/amazon-nova-samples) - Ví dụ code thực tế

### 8.2. Công cụ hỗ trợ cho AI Assistants

Nếu bạn đang sử dụng AI assistants như **Amazon Q Developer** hoặc **Kiro** cho phát triển phần mềm, bạn có thể thiết lập:

#### AWS API MCP Server:
- Giúp AI assistant tương tác với các dịch vụ và tài nguyên AWS
- 🔗 [AWS API MCP Server Documentation](https://awslabs.github.io/mcp/servers/aws-api-mcp-server)

#### AWS Knowledge MCP Server:
- Cung cấp kiến thức về tài liệu mới nhất, code samples, AWS API và CloudFormation resources
- Thông tin về tính khả dụng theo region
- 🔗 [AWS Knowledge MCP Server Documentation](https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server)

### 8.3. Hỗ trợ và Phản hồi

#### Nhận hỗ trợ:
- 💬 [AWS re:Post for Amazon Bedrock](https://repost.aws/tags/TAQeKlaPaNRQ2tWB6P7KrMag/amazon-bedrock)
- 📧 Liên hệ hỗ trợ AWS thông thường

#### Gửi phản hồi:
Bắt đầu sử dụng Nova Multimodal Embeddings ngay hôm nay để xây dựng ứng dụng sử dụng multimodal AI và gửi phản hồi của bạn!

---

## Phần 9: Tổng kết

### 9.1. Các điểm nổi bật chính

✅ **Mô hình thống nhất đầu tiên:** Hỗ trợ text, document, image, video, audio  
✅ **Độ chính xác cao:** Kết quả benchmark vượt trội  
✅ **Linh hoạt:** 4 dimension options (3072, 1024, 384, 256)  
✅ **Đa ngôn ngữ:** Hỗ trợ tối đa 200 ngôn ngữ  
✅ **Segmentation:** Xử lý nội dung dài hiệu quả  
✅ **Cross-modal search:** Tìm kiếm đa phương thức mạnh mẽ  
✅ **Responsible AI:** Content safety và fairness measures  

### 9.2. Use Cases chính

1. **Agentic RAG (Retrieval-Augmented Generation)**
2. **Semantic Search**
3. **Cross-modal Search** (Tìm kiếm bằng text cho image, v.v.)
4. **Reference Image Search**
5. **Visual Document Retrieval**
6. **Video Content Search**
7. **Audio Clip Search**
8. **Mixed-modal Content Analysis**

### 9.3. Lợi ích kinh doanh

💰 **Giảm chi phí:** Một mô hình thay vì nhiều mô hình chuyên biệt  
⚡ **Tăng tốc phát triển:** API đơn giản, dễ tích hợp  
🎯 **Độ chính xác cao:** Kết quả tìm kiếm tốt hơn  
🔄 **Linh hoạt:** Tối ưu chi phí với nhiều dimension options  
📈 **Mở rộng dễ dàng:** Tích hợp với AWS ecosystem  

### 9.4. Bắt đầu ngay hôm nay

1. **Truy cập Amazon Bedrock Console** trong US East (N. Virginia)
2. **Chọn Nova Multimodal Embeddings model**
3. **Thử nghiệm với text, image, video hoặc audio**
4. **Tích hợp vào ứng dụng của bạn**
5. **Triển khai production với S3 Vectors hoặc OpenSearch Service**

---

## Thông tin liên hệ

**Tác giả bài viết gốc:** [Danilo Poccia](https://twitter.com/danilop)

**Bài viết gốc (Tiếng Anh):** [Amazon Nova Multimodal Embeddings now available in Amazon Bedrock](https://aws.amazon.com/jp/blogs/aws/amazon-nova-multimodal-embeddings-now-available-in-amazon-bedrock/)

**Bài viết tiếng Nhật:** [Amazon Nova Multimodal Embeddings - AWS Blog JP](https://aws.amazon.com/jp/blogs/news/amazon-nova-multimodal-embeddings-now-available-in-amazon-bedrock/)

---

*Tài liệu này được dịch từ bài viết gốc trên AWS Blog. Mọi thông tin kỹ thuật và code examples đều được giữ nguyên từ nguồn chính thức.*

**© 2025 Amazon Web Services, Inc. hoặc các công ty liên kết. Mọi quyền được bảo lưu.**
