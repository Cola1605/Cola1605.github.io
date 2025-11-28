---
title: "Amazon Route 53 ra mắt Accelerated Recovery cho quản lý public DNS records"
date: 2025-11-28
draft: false
tags: ["AWS", "Route53", "DNS", "High Availability", "Disaster Recovery", "RTO"]
categories: ["AWS", "DevOps and Infrastructure"]
author: "Micah Walter"
description: "Route 53 Accelerated Recovery đạt RTO 60 phút khi US East (N. Virginia) region gặp sự cố, duy trì DNS API operations mà không cần học API mới"
---

## Thông tin bài viết
- **Tác giả**: Micah Walter
- **Ngày xuất bản**: 28/11/2025
- **Tags**: Route53, DNS, High Availability, Disaster Recovery, RTO
- **Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/amazon-route-53-launches-accelerated-recovery-for-managing-public-dns-records/)

## Tóm tắt

Ngày 26/11/2025, Amazon Route 53 công bố tính năng Accelerated Recovery đạt RTO (Recovery Time Objective) 60 phút khi US East (N. Virginia) region gặp service interruption. Tương thích hoàn toàn với existing Route 53 API, không cần học thêm, tăng cường DNS resilience cho mission-critical application.

## 10 điểm chính

1. **RTO 60 phút** (Recovery Time Objective) - tính năng business continuity mới cho DNS
2. Hỗ trợ khi **US East (N. Virginia) region** gặp service interruption
3. **Duy trì key API**: ChangeResourceRecordSets, GetChange, ListHostedZones, ListResourceRecordSets
4. **Seamless integration** với existing Route 53 setup, không cần học API mới
5. Đáp ứng **business continuity requirement** của banking, fintech, SaaS
6. Có thể **tiếp tục DNS change và infrastructure provisioning** khi regional failure
7. Enable từ **AWS Console, CLI, SDK, CloudFormation, CDK**
8. **Existing hosted zone cũng enable được sau**
9. **Enable hoàn tất trong vài phút**, có thể disable bất kỳ lúc nào
10. **Seamless experience** cho cả normal operation và failover scenario

## Giới thiệu

Ngày 26/11/2025, công bố Accelerated Recovery của [Amazon Route 53](https://aws.amazon.com/route53/) để quản lý public DNS records.

Đây là DNS business continuity feature mới được thiết kế để **đạt RTO (Recovery Time Objective) 60 phút** khi [AWS region](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/) US East (N. Virginia) gặp service interruption.

Enhancement này cho phép customer tiếp tục DNS change và infrastructure provisioning ngay cả khi regional failure, tăng **predictability và fault tolerance của mission-critical application**.

## Customer needs

### Background

Từ customer chạy application cần business continuity, AWS đã nghe rằng **cần thêm DNS resilience feature để đáp ứng business continuity requirement và regulatory compliance obligation**.

### AWS availability

AWS duy trì excellent availability trên toàn bộ global infrastructure, nhưng **organization trong regulated industry như banking, fintech, SaaS** muốn assurance rằng có thể thực hiện sau khi có unexpected regional disruption:

- **Rapidly provision standby cloud resource**
- **Redirect traffic**

## Solution overview

### RTO target

Accelerated Recovery cho quản lý public DNS record đáp ứng need này bằng cách target DNS change mà customer có thể thực hiện **trong vòng 60 phút sau khi US East (N. Virginia) region service interruption**.

### Seamless integration

Feature này seamless integration với existing Route 53 setup, có thể tiếp tục sử dụng **key Route 53 API endpoint** sau trong failover scenario:

- [ChangeResourceRecordSets](https://docs.aws.amazon.com/Route53/latest/APIReference/API_ChangeResourceRecordSets.html)
- [GetChange](https://docs.aws.amazon.com/Route53/latest/APIReference/API_GetChange.html)
- [ListHostedZones](https://docs.aws.amazon.com/Route53/latest/APIReference/API_ListHostedZones.html)
- [ListResourceRecordSets](https://docs.aws.amazon.com/Route53/latest/APIReference/API_ListResourceRecordSets.html)

## Getting started

### Setup đơn giản

Setting Route53 hosted zone để sử dụng Accelerated Recovery rất đơn giản.

### Step by step

#### 1. Tạo hosted zone

Ở đây đang tạo hosted zone mới cho website mới đang build.

#### 2. Kiểm tra Accelerated Recovery tab

Khi tạo hosted zone, tab mới **labeled [Accelerated Recovery]** xuất hiện. Ở đây có thể thấy Accelerated Recovery **disabled by default**.

#### 3. Enable

Để enable, chỉ cần **click button [Enable]** và confirm selection ở modal hiển thị.

#### 4. Đợi hoàn tất

Enable Accelerated Recovery **mất vài phút** để hoàn tất. Khi enable, **status [Enabled] màu xanh** sẽ hiển thị.

### Flexibility

- Có thể **disable bất kỳ lúc nào** từ cùng area của [AWS Management Console](https://aws.amazon.com/console/)
- Cũng có thể **enable Accelerated Recovery cho existing hosted zone** đã tạo trước đó

## Enhanced DNS business continuity

### Key capability

Khi enable Accelerated Recovery, customer có thể sử dụng một số important capability khi service interruption.

### Maintained access

Feature này **duy trì access đến necessary Route 53 API operation**, nên có thể tiếp tục sử dụng DNS management khi cần nhất.

### Operational flexibility

Organization có thể tiếp tục thực hiện sau mà không cần đợi full service recovery:

- **Critical DNS change**
- **Provisioning new infrastructure**
- **Traffic flow redirect**

### Simplicity và reliability

Implementation này được thiết kế với **focus vào simplicity và reliability**:

- Customer **không cần học new API**
- **Không cần modify existing automation script**
- Cùng Route 53 endpoint và API call tiếp tục hoạt động
- **Seamless experience** cho cả normal operation và failover scenario

## Available now

### Bắt đầu sử dụng

Accelerated Recovery của Amazon Route 53 public hosted zone **đã available**.

### Phương thức enable

Feature này có thể enable từ:

- **AWS Management Console**
- [AWS CLI](https://aws.amazon.com/cli/) (AWS Command Line Interface)
- [AWS SDK](https://builder.aws.com/build/tools) (AWS Software Development Kit)
- Infrastructure as Code Tools:
  - [AWS CloudFormation](https://aws.amazon.com/cloudformation/)
  - [AWS CDK](https://aws.amazon.com/cdk/) (AWS Cloud Development Kit)

### Documentation

Để biết chi tiết và cách sử dụng Accelerated Recovery, xem [documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/accelerated-recovery.html).

## Kết luận

Feature mới này là một phần trong **AWS's ongoing commitment** cung cấp DNS resilience mà customer cần để build và operate mission-critical application trên cloud.

Với Accelerated Recovery, organization có thể:

- Đáp ứng regulatory requirement
- Duy trì business continuity ngay cả khi regional failure
- Rapid recovery với RTO 60 phút
- Seamless integration mà không modify existing workflow

---

**[Bài viết gốc tại đây](https://aws.amazon.com/jp/blogs/aws/amazon-route-53-launches-accelerated-recovery-for-managing-public-dns-records/)**
