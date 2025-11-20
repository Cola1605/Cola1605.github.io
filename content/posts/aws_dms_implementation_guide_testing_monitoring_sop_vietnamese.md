---
title: "AWS DMS Implementation Guide: Xây dựng Database Migration có khả năng chống lỗi thông qua Testing, Monitoring và SOP"
date: 2025-10-30
categories: ["AWS", "Data and Analytics", "DevOps and Infrastructure"]
tags: ["AWS-DMS", "Database-Migration", "Testing", "Monitoring", "SOP", "Best-Practices"]
description: "Hướng dẫn triển khai AWS DMS với testing, monitoring và SOP. PoC planning, failure testing, standard procedures và best practices cho database migration đáng tin cậy."
---

# AWS DMS Implementation Guide: Xây dựng Database Migration có khả năng chống lỗi thông qua Testing, Monitoring và SOP

**Nguồn:** AWS Japan Blog  
**Bài gốc:** AWS Database Blog (English)  
**Ngày xuất bản:** 30/10/2025  
**Dịch bởi:** Yoshio Uchiyama  
**Tác giả gốc:** Sushant Deshmukh, Alex Anto Kizhakeyyepunnil Joy, Sanyam Jain

---

## Giới thiệu

AWS Database Migration Service (AWS DMS) đơn giản hóa việc migration và replication database, cung cấp giải pháp managed cho khách hàng. Từ nhiều case study triển khai enterprise, chúng ta biết rằng việc dành thời gian lên kế hoạch migration database trước mang lại lợi ích to lớn. Các tổ chức áp dụng chiến lược setup toàn diện liên tục đạt được kết quả migration tốt hơn với ít lỗi hơn.

Bài viết này giới thiệu các biện pháp phòng ngừa để tối ưu hóa triển khai AWS DMS ngay từ giai đoạn setup ban đầu. Bằng cách tận dụng kế hoạch chiến lược và hiểu biết sâu sắc về kiến trúc, tổ chức có thể cải thiện độ tin cậy của replication, nâng cao performance và tránh những lỗi phổ biến.

---

## Các lĩnh vực chính

Chúng ta sẽ khám phá chiến lược và best practices trong các lĩnh vực sau:

1. **Kế hoạch và thực thi Proof of Concept (PoC)**
2. **Triển khai kiểm thử lỗi có hệ thống**
3. **Tạo Standard Operating Procedures (SOP)**
4. **Monitoring và alerting**
5. **Áp dụng các nguyên tắc AWS Well-Architected Framework**

---

## Phần 1: Kế hoạch và thực thi PoC

### Mục đích

PoC cho phép phát hiện và sửa chữa các vấn đề về môi trường sớm. Ngoài ra còn giúp tạo thông tin để ước tính tổng thời gian migration và nhu cầu tài nguyên.

### Các bước thực hiện PoC thành công

1. **Lên kế hoạch và deploy môi trường test** với replication instance, task và endpoint AWS DMS phù hợp
   - Tham khảo: AWS Database Migration Service Best Practices

2. **Sử dụng workload gần với production**
   - Điều quan trọng là mô phỏng môi trường càng gần production càng tốt để tăng khả năng phát hiện các vấn đề

3. **Thực hiện failure testing** dựa trên các scenario được mô tả trong phần tiếp theo

4. **Theo dõi resource utilization và bottleneck** phát sinh trong PoC

5. **Tài liệu hóa kết quả quan sát** và thực hiện đánh giá migration so với business outcomes
   - Bao gồm đánh giá migration recovery time và application SLA
   - Nếu các yêu cầu migration và vận hành không được đáp ứng, cần xem xét lại giai đoạn planning

---

## Phần 2: Triển khai kiểm thử lỗi có hệ thống

### Tổng quan

Tất cả các hệ thống đều có khả năng gặp lỗi hoặc downtime bất kể độ robust của chúng. Đối với các tổ chức chạy workload quan trọng, việc lập kế hoạch tích cực là thiết yếu để duy trì business continuity và đáp ứng SLA.

### Framework kiểm thử lỗi

Khi triển khai AWS DMS, việc hiểu các điểm lỗi tiềm ẩn là quan trọng để xây dựng hệ thống chống lỗi. Bảng dưới đây tổng hợp các scenario lỗi phổ biến trong hệ thống replication AWS DMS.

**Lưu ý:** Mặc dù đã toàn diện, nhưng khuyến nghị mở rộng các scenario này dựa trên kiến trúc cụ thể, yêu cầu compliance và mục tiêu business của bạn.

---

### Các scenario lỗi chính

#### 1. Lỗi Database (Source và Target)

**1.1. Performance Bottleneck**
- **Scenario:** CPU cao, memory constraint
- **Test:** Sử dụng benchmark tool như sysbench để mô phỏng load cao
- **Mitigation:** 
  - Sử dụng read replica làm source cho các engine được hỗ trợ
  - Scale up database resources
  - Tối ưu database parameters

**1.2. Vấn đề truy cập dữ liệu do thiếu quyền**
- **Scenario:** Insufficient permissions
- **Test:** Sử dụng database user với ít quyền cho AWS DMS
- **Mitigation:** Tạo database user theo nguyên tắc least privilege

**1.3. Database Failover**
- **Scenario:** Failover từ primary sang secondary node
- **Test:** Thực hiện database failover
- **Mitigation:** Hành vi phụ thuộc vào TTL; cần restart task sau khi TTL được cập nhật

**1.4. Database Shutdown hoặc Failure**
- **Scenario:** Database dừng trong khi DMS replication đang chạy
- **Test:** Stop database đang replication
- **Mitigation:** Ghi lại hành vi DMS task để tạo SOP, restart task sau khi sửa database

**1.5. Transaction Log không khả dụng**
- **Scenario:** Purge log có retention ngắn khi task offline hoặc delayed
- **Test:** Purge transaction logs
- **Mitigation:** Restart task sau khi log khả dụng hoặc thực hiện full load mới

**1.6. Thay đổi cấu trúc**
- **Scenario:** DDL statements cho schema, table, index, partition, data type
- **Test:** Thực thi các DDL statement khác nhau
- **Mitigation:** Tham khảo danh sách DDL được support và task settings

---

#### 2. Lỗi Network

**2.1. Network Failure**
- **Scenario:** Vấn đề kết nối bao gồm network, DNS, SSL failure
- **Test:** 
  - Xóa source IP khỏi DMS security group
  - Thay đổi iptables
  - Xóa certificate khỏi DMS endpoint
  - Thay đổi MTU value
- **Mitigation:** Troubleshooting endpoint connectivity failures và RDS connection issues

**2.2. Packet Loss**
- **Scenario:** Mất gói tin
- **Test:** Sử dụng traffic control (tc) command trên Linux hoặc AWS FIS
- **Mitigation:** Sử dụng AWS DMS diagnostic support AMI

---

#### 3. Lỗi AWS DMS

**3.1. Single AZ Replication Instance Restart**
- **Scenario:** Reboot instance
- **Test:** Restart AWS DMS replication instance
- **Mitigation:** DMS tự động resume task sau restart

**3.2. Multi-AZ Instance Restart với Failover**
- **Scenario:** Restart trong khi replication đang chạy
- **Test:** Restart với option "Reboot with planned failover?"
- **Mitigation:** DMS tự động resume task sau Multi-AZ failover

**3.3. EBS Storage Full**
- **Scenario:** Thiếu storage do AWS DMS logs
- **Test:** Enable detailed debug logs cho nhiều log components
- **Mitigation:** 
  - Set alert khi storage capacity đạt 80%
  - Scale up storage volume

**3.4. Maintenance Window Changes**
- **Scenario:** Thay đổi cấu hình có downtime
- **Test:** Thay đổi cấu hình với option "Apply during next scheduled maintenance window"
- **Mitigation:** DMS tự động resume task sau maintenance

**3.5. Resource Contention**
- **Scenario:** High CPU, memory contention, IOPS cao hơn baseline
- **Test:** Tạo nhiều DMS task với MaxFullLoadSubTasks cao trên instance nhỏ
- **Mitigation:** 
  - Set monitoring và alerts cho critical CloudWatch metrics
  - Scale up instance class hoặc move task sang replication instance mới

**3.6. Version Upgrade**
- **Scenario:** Upgrade DMS version (bắt buộc khi old version bị deprecated)
- **Test:** Upgrade DMS replication instance version
- **Mitigation:** 
  - Thực hiện PoC kỹ lưỡng
  - Tạo replication instance mới với latest DMS version
  - Move tất cả task trong low peak time khi CDC lag là 0 hoặc tối thiểu

---

#### 4. Data Issues

**4.1. Data Duplication**
- **Scenario:** Dữ liệu bị duplicate
- **Test:** Chạy full-load only task 2 lần:
  - Lần 1: Stop task giữa chừng
  - Lần 2: Chạy với "Do nothing" target table prep mode
- **Mitigation:** 
  - Sử dụng DMS validation cho các engine được support
  - Tạo full load task hoặc reload tables
  - Sau đó tạo ongoing replication task để backfill

**4.2. Data Loss**
- **Scenario:** Mất dữ liệu
- **Test:** Tạo trigger trên target để delete hoặc truncate random records
- **Mitigation:** 
  - Khuyến nghị sử dụng DMS validation
  - Reload table/task hoặc tạo full load và CDC task mới

**4.3. Table Error**
- **Scenario:** Exclusive lock hoặc unsupported data types
- **Test:** Acquire exclusive access lock trước khi DMS task start
- **Mitigation:** Cần investigate dựa trên exact error

---

#### 5. Latency Issues

**5.1. Swap File Accumulation**
- **Scenario:** Long-running transaction với nhiều thay đổi
- **Test:** Start long-running transaction, monitor CloudWatch metrics
- **Mitigation:** Ghi lại để tạo SOP

---

## Phần 3: Tạo Standard Operating Procedures (SOP)

### Mục đích

Trong failure testing scenarios, cần tài liệu hóa cẩn thận impact của mỗi issue lên replication system. Documentation này là nền tảng để tạo các SOP customized mà team có thể tin cậy khi manage AWS DMS implementation.

### Đặc điểm của SOP

- **Living Documents:** SOP ban đầu xuất hiện trong giai đoạn đầu của PoC testing
- **Cần cập nhật thường xuyên:** Khi tích lũy operational experience và gặp scenario mới
- **Dynamic Nature:** Database migration có tính chất động, nên SOP cũng phải evolve

### Tài nguyên bổ sung

AWS khuyến nghị tham khảo blog series 3 phần về debugging AWS DMS migrations:

1. **Debugging AWS DMS migrations - Part 1:** What to do when things go wrong
2. **Debugging AWS DMS migrations - Part 2:** Advanced troubleshooting
3. **Debugging AWS DMS migrations - Part 3:** Deep dive scenarios

### Lợi ích chính

- Đo lường và validate chính xác khả năng của replication system trong việc đáp ứng SLA
- Xác định potential bottlenecks trong disaster recovery strategy
- Strengthen fault tolerance và reliability của data replication architecture

### Strategic Considerations

- Establish comprehensive contingency plans cho service unavailability và data inconsistencies
- Đánh giá kỹ lưỡng business RTO và RPO
- Phát triển SOP dựa trên RTO/RPO requirements
- Facilitate business continuity
- Provide valuable insights về actual performance metrics trong failure scenarios

---

## Phần 4: Monitoring và Alerting

### Tầm quan trọng

Monitoring và alerting có chiến lược là thiết yếu để duy trì seamless replication operations và data integrity xuyên suốt migration process.

### Lợi ích

1. **Real-time visibility** vào replication tasks
2. **Quick response** đến anomalies
3. **Early warning system** functionality
4. **Maintain health** của database migration infrastructure
5. **Improve operational reliability**
6. **Enable data-driven decision making**

---

### Các khả năng monitoring

#### 4.1. Amazon CloudWatch Metrics

- **Tự động collect** bởi AWS DMS
- **Scope:** Individual task và replication instance level
- **Insight:** Resource usage và related metrics
- **Reference:** AWS Database Migration Service metrics documentation

#### 4.2. AWS DMS CloudWatch Logs và Time Travel Logs

**CloudWatch Logs:**
- Generate error logs
- Collect dựa trên log level settings
- Context logging (enabled mặc định)

**Time Travel Logs:**
- Debug replication tasks
- **Settings:** Time Travel task settings
- **Best Practices:** Time Travel troubleshooting documentation

#### 4.3. Task và Table Status

- **Near real-time dashboard** báo cáo task và table states
- **Task status:** Detailed list documentation
- **Table state:** Table state during tasks documentation

#### 4.4. AWS CloudTrail Logs

- **Tích hợp** với AWS DMS
- **Record:** User, role, hoặc AWS service actions
- **Capture:** Tất cả API calls bao gồm console calls và code API operations
- **Reference:** AWS CloudTrail User Guide

#### 4.5. Enhanced Monitoring Dashboard

- **Comprehensive visibility** của critical metrics
- **Features:**
  - Filter, aggregate, và visualize metrics
  - Direct exposure của existing CloudWatch metrics
  - Monitor performance không thay đổi sampling time
- **Reference:** Enhanced monitoring dashboard overview

---

### Các alert khuyến nghị

#### Host Metrics

**Metrics cần monitor:**
- CPU utilization
- Free memory
- Swap usage
- Free storage space
- Write IOPS
- Read IOPS

**Lý do:**
- Resource contention ảnh hưởng đến DMS task performance

**Action:**
- Upgrade DMS instance class cho CPU/memory contention
- Tăng storage cho low storage hoặc throttled baseline IOPS
- **Reference:** Choosing optimal replication instance size

---

#### Replication Task Metrics

**1. CDC Source Latency**
- **Action:** Set alarm threshold dựa trên SLA requirements
- **Reason:** Latency có thể xảy ra vì nhiều lý do trong DMS
- **Reference:** Troubleshooting AWS Database Migration Service latency issues

**2. CDC Target Latency**
- **Action:** Tương tự CDC source latency

---

#### DMS Events

**Replication Instance Events:**
- Configuration change
- Creation
- Deletion
- Maintenance
- Low storage
- Failover
- Failure

**Replication Task Events:**
- Failure
- State change
- Creation
- Deletion

**Reference:** AWS DMS event categories and event messages for SNS notification

---

### Additional Alerting Capabilities

1. **Amazon EventBridge**
   - Provide notification khi AWS DMS events xảy ra
   - Reference: EventBridge events user guide

2. **Amazon Simple Notification Service (SNS)**
   - Tạo alerts cho critical events
   - Reference: Amazon SNS events user guide

3. **Custom Alerts với Metric Filters**
   - Tạo custom alerts dựa trên AWS DMS CloudWatch error logs
   - Reference: Blog "Send alerts on custom AWS DMS errors from Amazon CloudWatch Logs"

---

## Phần 5: Áp dụng AWS Well-Architected Framework

### Tổng quan

AWS Well-Architected Framework giúp hiểu trade-offs khi đưa ra quyết định về xây dựng hệ thống trên cloud.

### 6 trụ cột

1. **Reliability** - Độ tin cậy
2. **Security** - Bảo mật
3. **Operational Excellence** - Hiệu quả vận hành
4. **Cost Optimization** - Tối ưu chi phí
5. **Performance Efficiency** - Hiệu suất
6. **Sustainability** - Tính bền vững

### AWS Well-Architected Tool

- **Availability:** Free trong AWS Management Console
- **Usage:** Review workload theo best practices bằng cách trả lời câu hỏi cho mỗi pillar
- **Link:** AWS Well-Architected Tool

### Tài nguyên bổ sung

**AWS Architecture Center:**
- Specialized guidance và best practices
- Reference architecture deployments
- Diagrams
- Whitepapers

---

## Kết luận

Bài viết này đã giới thiệu framework toàn diện để xây dựng AWS DMS implementation có khả năng chống lỗi. Hiệu quả của guide này tương quan trực tiếp với độ sâu của implementation và adaptation vào môi trường cụ thể.

### Khuyến nghị chung

Các tổ chức nên:

1. **Review kỹ lưỡng từng phần** của guide này
2. **Customize migration strategy** phù hợp với unique use case
3. **Đánh giá cẩn thận** các recommendations
4. **Tích hợp vào migration planning process**
5. **Phát triển comprehensive approach** để sử dụng AWS DMS

### Lợi ích dài hạn

Bằng cách thực hiện các recommendations này, bạn có thể:

- Facilitate success của long-term data movement strategy
- Xây dựng reliable và comprehensive approach
- Đảm bảo business continuity
- Meet SLAs một cách nhất quán

---

## Tài nguyên bổ sung

**Documentation:**
- AWS DMS Documentation

**Support:**
- AWS Support

---

## Về các tác giả

### Sanyam Jain
**Vai trò:** Database Engineer tại AWS Database Migration Service team  
**Trách nhiệm:** Làm việc chặt chẽ với khách hàng, cung cấp technical guidance cho migration on-premises workloads lên AWS cloud, đóng vai trò quan trọng trong việc cải thiện quality và features của AWS data migration products.

### Sushant Deshmukh
**Vai trò:** Senior Partner Solutions Architect cho Global System Integrators  
**Đam mê:** Thiết kế highly available, scalable, resilient và secure architectures trên AWS  
**Hỗ trợ:** Giúp AWS customers và partners migrate và modernize applications lên AWS cloud thành công  
**Sở thích:** Du lịch khám phá địa điểm và ẩm thực mới, bóng chuyền, dành thời gian chất lượng với gia đình và bạn bè

### Alex Anto
**Vai trò:** Data Migration Specialist Solutions Architect tại Amazon Database Migration Accelerator team  
**Trách nhiệm:** Là Amazon DMA advisor, giúp AWS customers migrate on-premises data sang AWS cloud database solutions

---

## Key Takeaways

### 1. Planning là chìa khóa
- Đầu tư thời gian vào comprehensive planning mang lại returns đáng kể
- Organizations với setup strategy toàn diện đạt better outcomes với fewer failures

### 2. PoC là bắt buộc
- Phát hiện environmental issues sớm
- Tạo thông tin để estimate migration time và resource needs
- Sử dụng production-like workloads

### 3. Systematic Failure Testing
- Hiểu potential failure points
- Test systematically across tất cả categories
- Document carefully cho SOP development

### 4. SOP Evolution
- Treat SOPs như living documents
- Update regularly với operational experience
- Customize dựa trên specific environment

### 5. Proactive Monitoring
- Configure monitoring ngay từ initial setup
- Set CloudWatch alarms cho critical metrics
- Use EventBridge và SNS cho notifications
- Create custom alerts với metric filters

### 6. Well-Architected Principles
- Apply 6 pillars của AWS Well-Architected Framework
- Use Well-Architected Tool cho review
- Leverage AWS Architecture Center

### 7. Comprehensive Approach
- Combine PoC + Failure Testing + SOP + Monitoring + Well-Architected
- Customize theo specific architecture và business goals
- Maintain và evolve strategies theo time

---

**Nguồn:** AWS Japan Blog  
**URL:** https://aws.amazon.com/jp/blogs/news/aws-dms-imp-guide/  
**Ngày xuất bản:** 30/10/2025  
**Cấp độ:** Advanced (300)  
**Thể loại:** AWS Database Migration Service, Best Practices, AWS Well-Architected Framework
