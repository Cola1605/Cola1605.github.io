---
title: "Amazon S3 Vectors Chính Thức Ra Mắt với Quy Mô và Hiệu Suất Được Cải Thiện"
date: 2025-12-04T11:50:00+09:00
draft: false
categories: ["AWS", "AI and Machine Learning", "Cloud"]
tags: ["Amazon S3", "S3 Vectors", "Vector Database", "Amazon Bedrock", "RAG", "Generative AI", "re:Invent 2025"]
author: "Sébastien Stormacq"
translator: "日平"
---

# Amazon S3 Vectors Chính Thức Ra Mắt với Quy Mô và Hiệu Suất Được Cải Thiện

> **Bản dịch từ bài viết AWS Blog ngày 2 tháng 12, 2025**

Amazon S3 Vectors hiện đã **chính thức ra mắt (GA)** với khả năng mở rộng quy mô và hiệu suất được cải thiện đáng kể. S3 Vectors là **dịch vụ lưu trữ đối tượng đám mây đầu tiên** hỗ trợ native việc lưu trữ và truy vấn dữ liệu vector. So với các giải pháp vector database chuyên dụng, S3 Vectors có thể **giảm tổng chi phí lưu trữ và truy vấn vector lên đến 90%**.

## Thống Kê Ấn Tượng Từ Giai Đoạn Preview

Kể từ khi [công bố preview vào tháng 7 năm 2025](https://aws.amazon.com/blogs/aws/introducing-amazon-s3-vectors-first-cloud-storage-with-native-vector-support-at-scale/), AWS rất ấn tượng với tốc độ mà khách hàng áp dụng tính năng mới này. Chỉ trong **hơn 4 tháng** (tính đến ngày 28/11/2025):

- **250,000+** vector index được tạo
- **40 tỷ+** vector được nhập vào
- **1 tỷ+** truy vấn được thực thi

## Cải Tiến Quy Mô Vượt Trội

### Tăng 40 Lần Dung Lượng Index

Hiện tại, bạn có thể lưu trữ và tìm kiếm **tối đa 2 tỷ vector** trong một index duy nhất - tăng **40 lần** so với giới hạn 50 triệu vector/index trong giai đoạn preview. Mỗi vector bucket có thể chứa tối đa **20 nghìn tỷ vector**.

**Lợi ích:** Bạn có thể hợp nhất toàn bộ dataset vector vào một index duy nhất mà không cần sharding thành nhiều index nhỏ hay triển khai logic truy vấn federation phức tạp.

## Hiệu Suất Truy Vấn Được Tối Ưu

### Latency Thấp Cho Ứng Dụng Tương Tác

- **Truy vấn tần suất thấp:** Vẫn trả về kết quả trong **< 1 giây**
- **Truy vấn tần suất cao:** Đạt latency **~100 milliseconds**
- **Top-K results:** Tăng từ 30 lên **100 kết quả** mỗi truy vấn

**Ứng dụng phù hợp:**
- AI đàm thoại (Conversational AI)
- Multi-agent workflows
- RAG (Retrieval-Augmented Generation) applications với context toàn diện hơn

## Hiệu Suất Ghi Cải Thiện Đáng Kể

### Throughput Cao Cho Real-time Workloads

- **1,000 PUT transactions/giây** khi streaming single vector updates
- **Throughput ghi cao** với batch size nhỏ

**Lợi ích:**
- Hỗ trợ workload cần dữ liệu mới có thể tìm kiếm ngay lập tức
- Nhập nhanh corpus dữ liệu nhỏ
- Xử lý nhiều nguồn song song ghi đồng thời vào cùng index

## Kiến Trúc Serverless Hoàn Toàn

- **Không cần setup infrastructure**
- **Không cần provisioning resources**
- **Chỉ trả tiền cho những gì sử dụng:** Lưu trữ vector + truy vấn

S3 Vectors hỗ trợ toàn bộ vòng đời phát triển AI - từ thử nghiệm ban đầu, prototyping đến triển khai production quy mô lớn.

## Tích Hợp Sản Xuất Chính Thức (GA)

### 1. Amazon Bedrock Knowledge Bases

**Status:** GA (General Availability)

Sử dụng S3 Vectors làm **vector storage engine** cho Amazon Bedrock Knowledge Bases, đặc biệt để xây dựng RAG applications với quy mô và hiệu suất production-grade.

📖 [Tài liệu](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-bedrock-kb.html)

### 2. Amazon OpenSearch

**Status:** GA

Tích hợp S3 Vectors với Amazon OpenSearch để kết hợp khả năng tìm kiếm full-text và vector search.

📖 [Tài liệu](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-opensearch.html)

### 3. Các Tích Hợp Mới

- **AWS CloudFormation:** Deploy và quản lý vector resources
- **AWS PrivateLink:** Kết nối mạng riêng tư
- **Resource Tagging:** Phân bổ chi phí và kiểm soát truy cập

## Mở Rộng Địa Lý

S3 Vectors hiện có sẵn tại **14 AWS Regions** (tăng từ 5 regions trong preview):

**Preview regions (5):**
- US East (Ohio, N. Virginia)
- US West (Oregon)
- Asia Pacific (Sydney)
- Europe (Frankfurt)

**Regions mới (9):**
- Asia Pacific (Mumbai, Seoul, Singapore, **Tokyo**)
- Canada (Central)
- Europe (Ireland, London, Paris, Stockholm)

## Chi Tiết Kỹ Thuật

### Metadata Management

- **Tối đa 50 metadata keys** mỗi vector
- **Tối đa 10 non-filterable keys**

**Filterable metadata:** Lọc kết quả truy vấn dựa trên thuộc tính cụ thể  
**Non-filterable metadata:** Lưu trữ thông tin context lớn hơn

### Distance Metrics

S3 Vectors hỗ trợ:
- **Cosine similarity**
- **Euclidean distance**

### Encryption

- **Default:** Bucket-level encryption
- **Custom:** Override bằng AWS KMS key ở index-level

## Demo Thực Tế: Tìm Kiếm AWS Style Guide

Hãy cùng xem cách sử dụng S3 Vectors với ví dụ tìm kiếm trong **AWS Style Guide** (tài liệu 800 trang về cách viết bài đăng, tài liệu kỹ thuật AWS).

### Bước 1: Tạo Vector Bucket và Index

```bash
# Tạo vector bucket
aws s3vectors create-vector-bucket \
    --vector-bucket-name "$BUCKET_NAME"

# Tạo vector index
aws s3vectors create-index \
    --vector-bucket-name "$BUCKET_NAME" \
    --index-name "$INDEX_NAME" \
    --data-type "float32" \
    --dimension "$DIMENSIONS" \
    --distance-metric "$DISTANCE_METRIC" \
    --metadata-configuration "nonFilterableMetadataKeys=AMAZON_BEDROCK_TEXT,AMAZON_BEDROCK_METADATA"
```

**Lưu ý:**
- **Dimension:** Phải khớp với model dùng để tính vector
- **Distance metric:** Thuật toán tính khoảng cách giữa các vector

Bạn cũng có thể tạo qua **AWS Console** với các tính năng:
- Thiết lập encryption parameters
- Thêm tags cho cost allocation
- Quản lý properties và permissions trực tiếp

### Bước 2: Tạo và Lưu Embeddings

Sử dụng **Amazon Bedrock Knowledge Bases** để nhập tài liệu PDF:

1. **Đọc PDF** từ S3 bucket thông thường
2. **Chia thành chunks** (đoạn nhỏ)
3. **Tính embedding** bằng Amazon Titan Text Embeddings model
4. **Lưu vectors và metadata** vào vector bucket

**Công cụ thay thế:**
- **S3 Vectors Embed CLI:** Tool dòng lệnh từ AWS Labs  
  GitHub: [awslabs/s3vectors-embed-cli](https://github.com/awslabs/s3vectors-embed-cli)
- **OpenSearch:** Sử dụng S3 Vectors làm vector storage engine

### Bước 3: Truy Vấn Vector Index

**Câu hỏi:** "Tôi nên viết 'open source' hay 'open-source'?"

```bash
# 1. Tạo embedding request
echo '{"inputText":"Should I write open source or open-source"}' \
  | base64 | tr -d '\n' > body_encoded.txt

# 2. Tính embedding với Amazon Titan
aws bedrock-runtime invoke-model \
  --model-id amazon.titan-embed-text-v2:0 \
  --body "$(cat body_encoded.txt)" \
  embedding.json

# 3. Tìm kiếm trong S3 Vectors index
vector_array=$(cat embedding.json | jq '.embedding') && \
aws s3vectors query-vectors \
  --index-arn "$S3_VECTOR_INDEX_ARN" \
  --query-vector "{ \"float32 \": $vector_array}" \
  --top-k 3 \
  --return-metadata \
  --return-distance
```

**Kết quả:**

```json
{
    "key": "348e0113-4521-4982-aecd-0ee786fa4d1d",
    "metadata": {
        "x-amz-bedrock-kb-source-uri": "s3://sst-aws-docs/awsstyleguide.pdf",
        "AMAZON_BEDROCK_TEXT": "open source (adj., n.) Two words. Use open source as an adjective (for example, open source software), or as a noun (for example, the code throughout this tutorial is open source). Don't use open-source, opensource, or OpenSource.",
        "x-amz-bedrock-kb-document-page-number": 98.0
    },
    "distance": 0.63120436668396
}
```

**Câu trả lời:** Viết **"open source"** (2 từ, không dấu gạch nối), có thể dùng làm tính từ hoặc danh từ. Kèm theo số trang 98 để tra cứu tài liệu gốc.

## Mô Hình Giá

S3 Vectors có **3 thành phần giá:**

### 1. PUT Charges (Phí Tải Lên)

- **Tính toán:** Dựa trên logical GB của vector tải lên
- **Bao gồm:** Vector data + metadata + key

### 2. Storage Costs (Chi Phí Lưu Trữ)

- **Tính toán:** Tổng logical storage của toàn bộ index

### 3. Query Charges (Phí Truy Vấn)

- **API charge:** Phí theo mỗi API call
- **Scan charge:** $/TB dựa trên index size (loại trừ non-filterable metadata)
- **Tier benefit:** $/TB giảm khi vượt 100 triệu vector

📖 Chi tiết: [Amazon S3 Pricing](https://aws.amazon.com/s3/pricing/)

## Use Cases Phù Hợp

S3 Vectors phù hợp cho các ứng dụng:

- 🤖 **AI Agents:** Agents với khả năng tra cứu kiến thức
- 🧠 **Inference Applications:** Ứng dụng suy luận AI
- 🔍 **Semantic Search:** Tìm kiếm theo ngữ nghĩa
- 📚 **RAG Applications:** Retrieval-Augmented Generation
- 💬 **Conversational AI:** Chatbots thông minh
- 🔄 **Multi-Agent Workflows:** Hệ thống multi-agent phức tạp

## So Sánh Chi Phí

**Giảm đến 90%** so với vector database chuyên dụng:

| Vector Database Chuyên Dụng | Amazon S3 Vectors |
|------------------------------|-------------------|
| Phải provisioning resources | Serverless hoàn toàn |
| Chi phí cố định cao | Pay-per-use |
| Phức tạp quản lý infrastructure | Không cần quản lý |
| Giới hạn scale | Gần như unlimited |

## Bắt Đầu Ngay

1. **Truy cập console:** [Amazon S3 Console - Vector Buckets](https://console.aws.amazon.com/s3/vector-buckets)
2. **Tạo vector index**
3. **Lưu trữ embeddings**
4. **Xây dựng AI applications có khả năng mở rộng**

## Tài Liệu Tham Khảo

- 📘 [Amazon S3 User Guide - S3 Vectors](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html)
- 💻 [AWS CLI Reference - s3vectors](https://docs.aws.amazon.com/cli/latest/reference/s3vectors/)
- 🛠️ [S3 Vectors Embed CLI (GitHub)](https://github.com/awslabs/s3vectors-embed-cli)
- 💬 [AWS re:Post](https://repost.aws/) - Hỏi đáp cộng đồng
- 📞 [AWS Support](https://aws.amazon.com/contact-us/)

## Về Tác Giả

**Sébastien Stormacq (Seb)**  
Principal Developer Advocate tại AWS

Seb đã viết code từ giữa những năm 1980 với Commodore 64. Với sự kết hợp độc đáo giữa đam mê, nhiệt huyết, bảo vệ khách hàng, tò mò và sáng tạo, ông truyền cảm hứng cho các builders khai thác giá trị từ AWS Cloud.

**Quan tâm:** Software architecture, developer tools, mobile computing  
**Motto:** "Nếu muốn bán gì đó cho tôi, hãy chắc chắn nó có API"

**Social:** [@sebsto](https://linktr.ee/sebsto) trên Bluesky, X, Mastodon

---

**Reviewer:** 榎本 貴之 (Takayuki Enomoto) - Solutions Architect  
**Translator (Kiro):** Bản dịch tiếng Nhật  
**Translator (日平):** Bản dịch tiếng Việt  
**Nguồn:** https://aws.amazon.com/jp/blogs/news/amazon-s3-vectors-now-generally-available-with-increased-scale-and-performance/
