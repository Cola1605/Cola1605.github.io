---
title: "Giám sát hiệu năng mạng và traffic trên các EKS cluster với Container Network Observability"
date: 2025-11-25T00:00:00Z
draft: false
categories: ["AWS"]
tags: ["Amazon EKS", "Container Network Observability", "CloudWatch", "Network Flow Monitor", "Kubernetes", "DevOps", "Monitoring"]
author: "Donnie Prakoso"
source: "AWS Blog"
source_url: "https://aws.amazon.com/jp/blogs/news/monitor-network-performance-and-traffic-across-your-eks-clusters-with-container-network-observability/"
---

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Container Network Observability cho EKS là gì](#container-network-observability-cho-eks-là-gì)
- [Bắt đầu sử dụng](#bắt-đầu-sử-dụng)
- [Các tính năng observability toàn diện](#các-tính-năng-observability-toàn-diện)
- [Thông tin bổ sung](#thông-tin-bổ-sung)
- [Tổng kết](#tổng-kết)

---

## Giới thiệu

Các tổ chức đang **mở rộng Kubernetes footprint** ngày càng nhiều khi triển khai microservices để đổi mới dần dần và cung cấp giá trị kinh doanh nhanh hơn. Sự tăng trưởng này làm tăng sự phụ thuộc vào mạng, tạo ra **các thách thức phức tạp theo cấp số nhân** cho platform team trong việc giám sát hiệu năng mạng và traffic pattern của EKS.

Kết quả là, các tổ chức **gặp khó khăn trong việc duy trì hiệu quả vận hành** khi môi trường container mở rộng, thường dẫn đến việc chậm trễ trong việc phát hành ứng dụng và tăng chi phí vận hành.

Ngày 19 tháng 11 năm 2025, chúng tôi vui mừng công bố **Container Network Observability cho Amazon Elastic Kubernetes Service (Amazon EKS)**. Bộ tính năng network observability toàn diện của Amazon EKS cho phép bạn đo lường hiệu năng mạng trong hệ thống chính xác hơn và hiển thị động trạng thái cũng như hành vi của network traffic trong EKS.

---

## Container Network Observability cho EKS là gì

**Container Network Observability** cho EKS giải quyết các thách thức về observability bằng cách **tăng khả năng hiển thị workload traffic**.

Tính năng này cung cấp insight về hiệu năng của:

- **Network flow trong cluster**
- **Network flow có đích đến bên ngoài cluster**

Điều này giúp môi trường mạng EKS cluster **dễ quan sát hơn** đồng thời cung cấp **các tính năng tích hợp để troubleshoot và điều tra chính xác hơn**.

---

## Bắt đầu sử dụng

Tính năng mới này có thể được bật trên **EKS cluster mới hoặc hiện có**.

### Đối với EKS cluster mới

1. Trong quá trình thiết lập **[Configure observability] (Cấu hình observability)**, đi đến phần **[Configure network observability] (Cấu hình network observability)**
2. Chọn **[Edit container network observability] (Chỉnh sửa container network observability)**
3. Ở trang tiếp theo, **cài đặt AWS Network Flow Monitor Agent**

### Cách sử dụng sau khi bật

1. Đi đến EKS cluster
2. Chọn **[Monitor cluster] (Giám sát cluster)**
3. Di chuyển đến observability dashboard của cluster
4. Chọn tab **[Network] (Mạng)**

---

## Các tính năng observability toàn diện

Container Network Observability cho EKS bao gồm các tính năng chính sau:

- **Performance metrics**
- **Service map**
- **Flow table** (3 view: AWS service view, cluster view, external view)

### Performance Metrics

Performance metrics cho phép bạn **scrape các system metrics liên quan đến mạng của pod và worker node** trực tiếp từ Network Flow Monitor agent và gửi đến bất kỳ đích giám sát nào.

#### Metrics có sẵn

- Số lượng flow đầu vào/đầu ra
- Số lượng packet
- Số byte đã truyền
- Băng thông
- Số packet mỗi giây
- Các counter vượt ngưỡng khác nhau liên quan đến giới hạn connection tracking

Bạn có thể visualize performance metrics được scrape bởi Prometheus bằng **Amazon Managed Grafana**.

---

### Service Map

**Tính năng Service Map** cho phép bạn **visualize động communication giữa các workload trong cluster**, giúp dễ dàng hiểu topology của ứng dụng chỉ trong một cái nhìn.

#### Các metrics chính mà Service Map làm nổi bật

- Retransmission (truyền lại)
- Retransmission timeout
- Dữ liệu được truyền trong network flow giữa các pod đang communication

Các metrics này giúp **xác định các vấn đề về hiệu năng**.

---

### Ví dụ thực tế về Service Map: Ứng dụng e-commerce

Hãy xem cách hoạt động của Service Map với ứng dụng e-commerce mẫu.

#### Tổng quan kiến trúc

Service Map hiển thị cả **tổng quan và chi tiết của kiến trúc microservices**.

Trong ví dụ e-commerce này, có **3 microservice cốt lõi** hoạt động cùng nhau:

1. **GraphQL service**: Hoạt động như API gateway, điều phối request giữa frontend service và backend service
2. **Product service**: Quản lý catalog data, pricing và inventory
3. **Order service**: Chịu trách nhiệm xử lý và quản lý đơn hàng

#### Luồng hoạt động

Khi khách hàng duyệt sản phẩm hoặc đặt hàng, GraphQL service **điều phối communication với cả product service và order service**. Kiến trúc này cho phép **scale từng service độc lập** trong khi phân tách rõ ràng các mối quan tâm.

#### Troubleshooting chi tiết

Để troubleshoot chi tiết hơn, bạn có thể **mở rộng view để hiển thị các pod instance riêng lẻ và pattern communication của chúng**.

Khi xem chi tiết, bạn có thể thấy sự phức tạp của microservice communication:

- Nhiều pod instance của mỗi service
- Mạng kết nối giữa chúng

#### Tầm quan trọng của khả năng hiển thị chi tiết

Khả năng hiển thị chi tiết như vậy rất quan trọng để xác định các vấn đề như:

- Load balancing không đồng đều
- Bottleneck communication giữa các pod
- Trường hợp latency cao hơn xảy ra ở pod instance cụ thể

**Ví dụ**: Nếu một GraphQL pod thực hiện quá nhiều call đến một product pod cụ thể một cách không cân xứng, bạn có thể nhanh chóng tìm thấy pattern này và điều tra nguyên nhân tiềm ẩn.

---

### Flow Table

**Flow Table** cho phép giám sát **top talker của Kubernetes workload trong cluster** từ **3 góc nhìn khác nhau**.

#### 3 View

##### 1. AWS Service View

Hiển thị workload có traffic nhiều nhất đến các AWS service như **Amazon DynamoDB** và **Amazon S3**.

**Lợi ích**:
- Tối ưu hóa data access pattern
- Xác định cơ hội tối ưu hóa chi phí tiềm năng

##### 2. Cluster View

Hiển thị **communicator có tải cao nhất trong cluster (east-west traffic)**.

**Lợi ích**:
- Tìm các microservice có nhiều interaction có thể hưởng lợi từ chiến lược optimization hoặc colocation

##### 3. External View

Xác định workload có traffic nhiều nhất đến **đích đến ngoài AWS (internet hoặc on-premise)**.

**Lợi ích**:
- Giám sát security
- Quản lý băng thông

---

### Phân tích chi tiết Flow Table

Flow Table hiển thị **metrics chi tiết và tính năng filtering để phân tích network traffic pattern**.

#### Ví dụ thực tế: Traffic giữa các e-commerce service

Flow table hiển thị cluster view traffic giữa các e-commerce service cho thấy:

- **Order pod** communication với nhiều **product pod**
- Truyền lượng data lớn
- Pattern này cho thấy order service thường xuyên search product trong quá trình xử lý đơn hàng

#### Tính năng Filtering

Tính năng filtering **hữu ích cho troubleshooting**.

**Ví dụ**: Khi muốn tập trung vào traffic từ một order pod cụ thể

Filtering chi tiết này cho phép bạn **nhanh chóng tách biệt communication pattern** khi điều tra các vấn đề về hiệu năng.

**Ví dụ thực tế**: Nếu thời gian checkout của khách hàng chậm, bạn có thể kiểm tra xem có quá nhiều call từ order service đến product service hay không.

---

## Thông tin bổ sung

**Các điểm chính** về Container Network Observability cho EKS:

### Giá cả

Network monitoring sẽ tính phí theo **giá tiêu chuẩn của Amazon CloudWatch Network Flow Monitor**.

### Tính sẵn có

Container Network Observability cho EKS có sẵn tại **tất cả các AWS Region thương mại nơi có Amazon CloudWatch Network Flow Monitor**.

### Export metrics đến bất kỳ monitoring solution nào

Metrics có sẵn ở **định dạng OpenMetrics tương thích với Prometheus và Grafana**.

Để biết chi tiết về cấu hình, vui lòng xem [tài liệu Network Flow Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html).

---

## Tổng kết

Hãy bắt đầu sử dụng [Container Network Observability cho Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/network-observability.html) ngay hôm nay để **cải thiện network observability của cluster**.

### Lợi ích chính

- **Hiển thị network flow trong và ngoài cluster**
- **Performance metrics, service map, flow table** - bộ tính năng toàn diện
- **3 view** (AWS service, cluster, external) để phân tích traffic pattern
- **Định dạng OpenMetrics** tương thích với Prometheus và Grafana
- **Dễ dàng bật** trên EKS cluster mới hoặc hiện có

Chúc bạn xây dựng thành công!

---

**Danh mục**: AWS, EKS, CloudWatch, DevOps  
**Tags**: #AmazonEKS #ContainerNetworkObservability #CloudWatch #NetworkFlowMonitor #Kubernetes #DevOps #Monitoring
