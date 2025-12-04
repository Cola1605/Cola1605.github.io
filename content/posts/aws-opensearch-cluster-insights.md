---
title: "Cluster Insights: Dashboard Monitoring Thống nhất cho Amazon OpenSearch Service"
date: 2025-12-04T11:00:00+09:00
draft: false
categories: ["Cloud", "Data and Analytics", "DevOps and Infrastructure"]
tags: ["OpenSearch", "Cluster Insights", "Monitoring", "Dashboard", "Performance", "Query Insights", "Observability", "AWS"]
author: "Siddhant Gupta, Varunsrivathsa Venkatesha, Gagandeep Juneja, Jinhwan Hyon"
translator: "日平"
---

# Cluster Insights: Dashboard Monitoring Thống nhất cho Amazon OpenSearch Service

**Nguồn**: [AWS Big Data Blog](https://aws.amazon.com/jp/blogs/big-data/introducing-cluster-insights-unified-monitoring-dashboard-for-amazon-opensearch-service-clusters/)  
**Tác giả**: Siddhant Gupta, Varunsrivathsa Venkatesha, Gagandeep Juneja, Jinhwan Hyon  
**Ngày gốc**: 21 tháng 11, 2025  
**Translator**: 榎本 貴之

---

## Giới thiệu

### Background

**Amazon OpenSearch Service cluster** cung cấp metrics vận hành phong phú, có thể truy cập qua:
- CloudWatch
- Amazon OpenSearch Service console

Các metrics này hỗ trợ **performance monitoring** và **alerting** hiệu quả.

### Thách thức

Tuy nhiên, việc **xác định vấn đề về resilience và performance** trong cluster có thể khó khăn:
- ❌ Quá trình xác định query tiêu tốn nhiều tài nguyên **tốn thời gian**
- ❌ Khó **nắm bắt xu hướng** performance degradation

### Giải pháp: Cluster Insights

Để giải quyết những thách thức này, AWS ra mắt **Cluster Insights** - một **unified dashboard** cung cấp:

✅ **Curated insights** với các bước giảm thiểu có thể thực hiện  
✅ **Detailed metrics** ở cấp độ node, index, shard  
✅ **Best practice recommendations** cho security và resilience  
✅ Duy trì **resilience và availability** tốt nhất

---

## Bắt đầu với Cluster Insights

### Yêu cầu

**Version**: OpenSearch 2.17 trở lên  
**Cost**: ✅ **Miễn phí** (không phí bổ sung)  
**Permissions**: Cần quyền **admin-level** cho OpenSearch domain  
**Access**: Chỉ có sẵn qua **OpenSearch UI**

### OpenSearch UI

**OpenSearch UI** cung cấp:
- Hỗ trợ **multiple data source**
- **Zero-downtime upgrade** cho dashboard experience
- **Curated workspace** cho team collaboration hiệu quả

**Prerequisites**: Cần liên kết **data source (cluster)** với OpenSearch UI application.

📚 **Hướng dẫn chi tiết**: [User Guide - Data Source Association](https://docs.aws.amazon.com/ja_jp/opensearch-service/latest/developerguide/application-data-sources-and-vpc.html#application-data-source-association)

### Các bước truy cập Cluster Insights

**Bước 1**: Trong Amazon OpenSearch Service console
- Chuyển đến **OpenSearch UI (Dashboards)**
- Chọn **Application URL** để truy cập OpenSearch UI application

**Bước 2**: Trong OpenSearch UI application
- Chọn **settings icon** ở góc dưới bên trái
- Chọn **Data administration**

**Bước 3**: Truy cập Cluster Insights
- Trong **Data administration overview** page
- Hoặc trong navigation bên trái, dưới **Manage data**, chọn **Cluster insights**

---

## Overview Page: Tổng quan về Cluster

### Mục đích

Landing page hiển thị **health và insights** của tất cả OpenSearch domain được kết nối.

### 5 Section Chính

#### 1. Current Cluster Status
- Hiển thị **cluster health status** (Green, Yellow, Red) trong donut chart

#### 2. Insights Trend
- Theo dõi **pattern vấn đề trong 30 ngày qua**
- Giúp xác định vấn đề mới và theo dõi tiến độ giải quyết
- **Đặc biệt có giá trị** khi:
  - Monitoring tác động của operational change
  - Troubleshooting vấn đề lặp lại

#### 3. Current Open Insights
- Hiển thị số lượng và **severity breakdown** của insights đang active trên toàn bộ cluster

#### 4. OpenSearch Service Clusters
- List tất cả domain với **key statistics**:
  - Health status
  - Insight count
  - Node
  - Shard
  - Active query

#### 5. Top Insights by Severity
- **Ưu tiên hóa** các vấn đề cần xử lý ngay lập tức
- Mỗi insight đi kèm:
  - Mô tả rõ ràng
  - Recommendations cụ thể
- Chuyển đổi **complex monitoring data** thành **actionable task**
- Focus vào vấn đề quan trọng trước:
  - Shard size issue
  - Disk space problem
  - Performance bottleneck

### Lợi ích

Cung cấp **comprehensive view** của OpenSearch Service infrastructure, cho phép:
- ✅ Đánh giá cluster health
- ✅ Xác định xu hướng
- ✅ Xử lý vấn đề quan trọng
- ✅ Tất cả từ **single dashboard**

---

## Cluster Health: Chi tiết từng Cluster

### Overview Section

Chọn một cluster cụ thể từ Overview page sẽ hiển thị:

**Key Metrics:**
- Shard count
- Node count
- Index count
- Total document size

**Health Status:**
- Active insights
- Performance metrics

**Best Practices:**
- Configuration best practices được domain tuân theo
- Bao gồm các lĩnh vực: **resilience** và **security**

### Insights Table

**Mô tả**: Table với **actionable insights** trình bày detailed view của vấn đề hiện tại

**Focus**: Chuyên biệt hóa cho vấn đề ảnh hưởng đến cluster được chọn

**Severity Levels:**
- 🔴 **High severity**: Disk space issue, shard count problem
- 🟡 **Medium severity**: Vấn đề có thể ảnh hưởng cluster performance

**Interactivity:**
- Mỗi insight entry là **interactive element**
- Click vào vấn đề → Hiển thị **detailed analysis**:
  - Root cause identification
  - Specific remediation steps

**Metadata:**
- Generation timestamp
- Severity level
- Number of recommendations
- Current status

**Benefit**: User có thể **prioritize và address** vấn đề hiệu quả.

---

## Insight Details: Phân tích Sâu

### Overview

Tất cả insight cung cấp:
- **Detailed analysis**
- **Actionable recommendations**

### Ví dụ: Shard Count Insight

**Problem**: OpenSearch cluster vượt quá số lượng shard được phép trên node (dựa trên JVM heap size)

**Details**: Danh sách chi tiết các resource bị ảnh hưởng

### Resource Map

**Chức năng**: Xác định chính xác từng node và index bị ảnh hưởng

**Thông tin hiển thị:**
- Node ID
- Shard count
- Index gây ra vấn đề

### Recommendations Structure

#### 1. Cluster-level Recommendations
Giải quyết **overall architecture improvement**:
- **Scaling cluster**
- **Điều chỉnh global shard allocation setting**

#### 2. Index-level Recommendations
Cung cấp **specific action** cho từng index:

**Ví dụ**: Đề xuất chuyển idle shard sang **UltraWarm storage**
- Idle shard: Không có search hoặc indexing operation trong 10 ngày qua
- Tồn tại ít nhất 5 ngày
- **Ideal candidate** để chuyển sang warm storage, giảm active shard count

### Accessibility

✅ Tất cả guidance có sẵn **trực tiếp trong Cluster Insights interface**  
✅ **Không cần** chuyển đổi giữa các tool hoặc console khác nhau

---

## Detailed Views: Node, Index, Shard, Query

### 1. Node View

**Comprehensive view** của individual node performance trên toàn cluster.

**Key Metrics:**
- **Heat score**: Chỉ số overall node health
- **Resource utilization**: CPU, memory, disk
- **Search & indexing**: Latency và rate
- **Quick link**: Top N shard và query đang chạy trên mỗi node

**Use Case:**
- Xác định node có resource utilization cao
- Xác định node có performance suy giảm

**Drill-down:**
- Click **Node ID** → Xem detailed time-based metrics
- Hiển thị xu hướng resource usage theo thời gian

**Navigation:**
- Click **Top N shard link** → Tự động filter Shard View
- Chỉ hiển thị shard đang chạy trên node được chọn
- Xác định **specific shard gây ra performance issue**

### 2. Index View

**Hiển thị**: Performance metrics được aggregate ở **index level**

**Metrics cho mỗi index:**
- Document count và storage size
- Search latency và rate
- Indexing latency và rate
- Access đến **top N query** ảnh hưởng index

**Use Case:**
- Hiểu index nào gây ra cluster load
- Xác định cơ hội tối ưu hóa ở **index setting level**

### 3. Shard View

**Most granular view** của cluster performance, hiển thị metrics của từng shard.

**Metrics cho mỗi row:**
- Shard ID và assigned node
- Index association
- Resource pressure metrics (CPU, memory)
- Search và indexing latency per shard

**Use Case:**
- Xác định **specific shard** gây performance issue
- Nhận diện **shard placement imbalance**
- Thực hiện **targeted remediation action**

### 4. Query View

**Live dashboard** phân tích:
- Execution statistics của tất cả query
- CPU và memory usage
- Completion progress

**Features:**
- Monitor query gây ra **maximum resource consumption** (top N query)
- **Intuitive donut chart** và scoreboard hiển thị distribution theo:
  - Node
  - Index
  - User

**Benefit:**
- Operator **nhanh chóng xác định**:
  - Performance bottleneck
  - Heavy workload
- Hỗ trợ **targeted optimization**
- Quyết định scaling **tự tin**

---

## Query Insights: Chi tiết Query

Ngoài Cluster Insights, sử dụng **Query Insights** để xem:
- **Exact query** đang chạy
- **Latency** trong các phase: Expand, Query, Fetch

**Benefit**: Cung cấp **valuable insight** cho search developer để **fine-tune query** thêm.

---

## Tổng kết

### Transformation

Cluster Insights **biến đổi** OpenSearch Service cluster management:
- ❌ **Từ**: Reactive troubleshooting
- ✅ **Sang**: Proactive optimization

### Unified Dashboard

Cung cấp:
- **Heat score**
- **Best practices** trên các pillar:
  - Stability
  - Resilience
  - Security
- **Visibility** của search infrastructure ở **account level**

### Actionable Guidance

**Recommendations có thể thực hiện** + **Step-by-step remediation guidance** giúp:
- ✅ User ở **mọi experience level** có thể giải quyết hiệu quả các vấn đề phức tạp như:
  - Shard imbalance
  - Resource bottleneck

### Query Insights Integration

**Real-time visibility** của resource consumption pattern:
- Team có thể **identify và optimize** performance-critical query
- Thông qua **detailed profiling** và **latency analysis**

---

## Tài liệu Tham khảo

📚 **AWS OpenSearch Service User Guide**: [Cluster Insights Documentation](https://docs.aws.amazon.com/ja_jp/opensearch-service/latest/developerguide/cluster-insights.html)

🔗 **Announcement**: [Amazon OpenSearch Service - Cluster Insights](https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-opensearch-service-cluster-insights/)

📖 **Bài viết gốc**: [AWS Big Data Blog](https://aws.amazon.com/jp/blogs/big-data/introducing-cluster-insights-unified-monitoring-dashboard-for-amazon-opensearch-service-clusters/)
