---
title: "Bảo mật EKS Clusters với AWS Backup hỗ trợ Amazon EKS"
date: 2025-11-14
draft: false
categories: ["AWS", "DevOps & Infrastructure"]
tags: ["Amazon EKS", "AWS Backup", "Kubernetes", "Backup", "Disaster Recovery", "Container Security", "Data Protection"]
author: "Veliswa Boya"
translator: "日平"
description: "AWS Backup ra mắt native support cho Amazon EKS, cho phép backup và restore Kubernetes clusters và applications thông qua centralized managed platform, loại bỏ custom scripts và third-party tools"
---

# Bảo mật EKS Clusters với AWS Backup hỗ trợ Amazon EKS

**Tác giả**: Veliswa Boya  
**Dịch giả**: 日平  
**Ngày phát hành**: 14/11/2025  
**Ngày công bố**: 10/11/2025  
**Nguồn**: [AWS Blog](https://aws.amazon.com/jp/blogs/news/secure-eks-clusters-with-the-new-support-for-amazon-eks-in-aws-backup/)

---

## Tổng quan

Vào ngày 10/11/2025, AWS Backup ra mắt native support cho Amazon Elastic Kubernetes Service (EKS). Tính năng mới này cho phép backup và restore Kubernetes applications và data thông qua một centralized managed platform, loại bỏ nhu cầu custom scripts hoặc third-party tools.

## Giới thiệu

Amazon EKS cung cấp một powerful platform để chạy containerized applications ở quy mô lớn, nhưng việc đảm bảo robust backup và restore capabilities cho data protection và disaster recovery là điều quan trọng. Trước đây, customers phải rely on custom solutions hoặc third-party tools để protect EKS workloads.

Với Amazon EKS support mới trong AWS Backup, customers giờ có thể protect Kubernetes clusters và applications sử dụng một centralized solution integrates seamlessly với existing AWS services.

## Công bố quan trọng

**Công bố ngày 10/11/2025:**
- AWS Backup native support cho Amazon EKS
- Comprehensive backup của EKS clusters, workloads, và persistent data
- Policy-based automation cho multi-cluster management
- Available trong tất cả AWS commercial regions và AWS GovCloud (US) regions

## EKS Resources được AWS Backup hỗ trợ

AWS Backup hỗ trợ comprehensive backup của Amazon EKS clusters, bao gồm:

### Cluster Configuration

- **Kubernetes API Objects**
  - Deployments, Services, ConfigMaps, Secrets
  - StatefulSets, DaemonSets, Jobs, CronJobs
  - Namespaces, Roles, RoleBindings
  - Custom Resource Definitions (CRDs)

### Stateful Data

- **Amazon EBS (Elastic Block Store) Volumes**  
  Backup của persistent block storage volumes

- **Amazon EFS (Elastic File System) File Systems**  
  Backup của shared file system storage

- **Amazon S3 Buckets**  
  Backup của object storage data

**Lưu ý:** AWS Backup không support backup của external storage connected đến EKS clusters. Chỉ Amazon EBS, EFS, và S3 được support.

## Key Features và Benefits

### 1. Centralized Backup Management

AWS Backup cung cấp một unified console để manage backups across multiple EKS clusters, regions, và accounts.

**Benefits:**
- Manage tất cả EKS backups từ single interface
- Loại bỏ nhu cầu multiple tools hoặc scripts
- Giảm operational complexity

### 2. Policy-Based Automation

Bạn có thể define backup policies và automatically apply chúng across multiple EKS clusters.

**Features:**
- Schedule-based backups (daily, weekly, monthly)
- Retention policy automation
- Lifecycle management (transition to cold storage)
- Tag-based resource selection

### 3. Immutable Backups

AWS Backup tạo immutable backups để protect against malicious hoặc accidental changes.

**Security Benefits:**
- Protection từ ransomware attacks
- Prevention của accidental deletion hoặc modification
- Compliance với regulatory requirements
- Audit trails và change tracking

### 4. Flexible Restore Options

Bạn có thể restore từ backups đến existing clusters hoặc create new clusters.

**Restore Scenarios:**
- **Restore to Existing Cluster:** Selectively restore specific resources
- **Create New Cluster:** Restore entire cluster đến new environment
- **Partial Restore:** Restore individual namespaces hoặc resources
- **Point-in-Time Recovery:** Select specific restore point

### 5. Cross-Region và Cross-Account Backups

Bạn có thể copy backups đến other regions hoặc accounts cho disaster recovery và compliance.

**Use Cases:**
- Protection từ geographic disasters
- Multi-region recovery strategies
- Regulatory compliance (data residency)
- Development/test environment isolation

### 6. Non-Destructive Restore

AWS Backup supports differential restore, chỉ restore specific objects không impact existing resources.

**Benefits:**
- Minimize downtime
- Selective recovery
- No impact đến existing workloads

## Backup Workflow

### Step 1: Enable Amazon EKS Support

Trong AWS Backup console, navigate đến settings page và verify opt-in status cho Amazon EKS.

**Activation Steps:**
1. Open AWS Backup console
2. Select "Settings" trong left navigation
3. Find Amazon EKS trong "Resource type opt-in" section
4. Enable Amazon EKS

### Step 2: Create On-Demand Backup

#### Prerequisites

Trước khi create backup, ensure rằng IAM role sau exists:

**AWSBackupServiceRolePolicyForS3Backup**

Role này allows AWS Backup backup data từ EKS clusters đến S3 buckets.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::aws-backup-*/*",
        "arn:aws:s3:::aws-backup-*"
      ]
    }
  ]
}
```

#### Backup Creation Steps

1. **Access AWS Backup Console**
   - Select "Protected resources" trong left navigation
   - Click "Create on-demand backup"

2. **Select Resource Type**
   - Chọn "EKS" như resource type
   - Select EKS cluster bạn muốn backup

3. **Configure Backup Window**
   - "Create backup now" (immediate)
   - Hoặc "Custom backup window" (scheduled)

4. **Select Backup Vault**
   - Chọn existing backup vault
   - Hoặc create new backup vault

5. **Select IAM Role**
   - Sử dụng default role
   - Hoặc select custom IAM role

6. **Create Backup**
   - Click "Create on-demand backup"

### Step 3: Verify Backup Job

Sau khi backup job completes, bạn có thể verify recovery point trong backup vault.

**Verification Steps:**
1. Navigate đến "Backup vaults" trong AWS Backup console
2. Select vault nơi bạn saved backup
3. Verify new EKS recovery point trong "Recovery points" tab
4. Validate recovery point details (creation time, size, status)

## Restore Workflow

### Step 1: Select Recovery Point

Trong AWS Backup console, select backup recovery point bạn muốn restore.

**Selection Steps:**
1. Navigate đến "Backup vaults" trong AWS Backup console
2. Select vault chứa recovery point
3. Find EKS backup bạn muốn restore trong "Recovery points" tab
4. Select recovery point và click "Restore"

### Step 2: Configure Restore Settings

Chọn những gì restore và restore đến đâu.

#### Option 1: Restore to Existing Cluster

**Use Cases:**
- Specific resources bị deleted hoặc corrupted
- Namespace-level restoration
- Selective resource recovery

**Configuration:**
1. Select "Existing cluster" như restore destination
2. Chọn target EKS cluster
3. Select resources để restore (all hoặc specific namespaces)
4. Set conflict resolution policy
   - Skip existing resources
   - Overwrite existing resources

#### Option 2: Create New Cluster

**Use Cases:**
- Disaster recovery scenarios
- Entire cluster migration
- Development/test environment creation

**Configuration:**
1. Select "New cluster" như restore destination
2. Specify new cluster configuration
   - Cluster name
   - Kubernetes version
   - VPC configuration
   - Subnets
   - Security groups
3. Node group configuration (optional)
4. IAM role

### Step 3: Initiate Restore

Review configuration và start restore job.

**Execution Steps:**
1. Review restore configuration
2. Click "Restore"
3. Note restore job ID
4. Monitor progress trong "Jobs" section của AWS Backup console

### Restore Verification

Sau khi restore completes, verify:

**Verification Checklist:**
- Tất cả expected resources đã restored
- Applications functioning normally
- Persistent volumes mounted correctly
- Network connectivity normal
- ConfigMaps và Secrets exist
- Service endpoints accessible

## Backup Vault và Access Control

### Backup Vault Overview

Backup vault là một logical container để organize và protect recovery points.

**Features:**
- Encryption của recovery points (AWS KMS)
- Access policies cho permission management
- Cross-account access qua resource-based policies
- Event notifications (AWS EventBridge)

### Access Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": [
        "backup:DeleteRecoveryPoint",
        "backup:UpdateRecoveryPointLifecycle"
      ],
      "Resource": "*"
    }
  ]
}
```

Policy này prevents tất cả users từ deleting hoặc modifying recovery points (immutable backups).

## Partial Failure Handling

Trong restore process, một số resources có thể fail (ví dụ: missing dependencies, permission issues).

### Cách handle Partial Failures

1. **Review Restore Job Details**
   - Select failed job trong AWS Backup console
   - Review error messages và failed resources

2. **Restore Failed Resources Individually**
   - Start restore lại từ cùng recovery point
   - Chỉ select failed resources
   - Fix root cause (IAM permissions, resource conflicts, etc.)

3. **Post-Restore Validation**
   - Verify cluster state sử dụng `kubectl`
   - Check application logs
   - Ensure tất cả dependencies đã satisfied

## Availability

Amazon EKS support trong AWS Backup available trong:

### Commercial Regions

- US East (N. Virginia, Ohio)
- US West (Oregon, N. California)
- Canada (Central)
- Europe (Ireland, Frankfurt, London, Paris, Stockholm, Milan)
- Asia Pacific (Tokyo, Seoul, Singapore, Sydney, Mumbai, Hong Kong, Jakarta)
- South America (São Paulo)
- Middle East (Bahrain, UAE)
- Africa (Cape Town)

**Excluded:**
- China regions (Beijing, Ningxia) hiện không được support

### AWS GovCloud Regions

- AWS GovCloud (US-East)
- AWS GovCloud (US-West)

## Customer Testimonial

> "The introduction của Amazon EKS support trong AWS Backup brings us một managed solution chúng tôi đã chờ đợi từ lâu. Bây giờ chúng tôi có thể protect Kubernetes clusters và applications mà không maintain custom scripts. Centralized backup management và policy-based automation đã significantly giảm operational complexity và enhanced data protection posture của chúng tôi."
> 
> **— Srikanth Rajan, Salesforce**

## Security Best Practices

### 1. Implement Encryption

- **Encryption at Rest:** Encrypt backups sử dụng AWS KMS
- **Encryption in Transit:** Sử dụng TLS cho tất cả backup transfers
- **Key Management:** Sử dụng CMK (Customer Managed Keys) để control encryption keys

### 2. Access Control

- **Least Privilege Principle:** Grant chỉ necessary permissions
- **IAM Role Separation:** Sử dụng different roles cho backup và restore
- **Cross-Account Access:** Control sử dụng resource-based policies

### 3. Audit và Compliance

- **AWS CloudTrail:** Log tất cả backup activities
- **AWS Config:** Monitor resource configuration và compliance
- **Tagging Strategy:** Sử dụng tags cho cost tracking và resource management

### 4. Disaster Recovery Planning

- **Cross-Region Backups:** Ensure geographic redundancy
- **Regular Testing:** Regularly test restore procedures
- **RTO/RPO Definition:** Clearly define và document recovery objectives

## Pricing

Amazon EKS support pricing trong AWS Backup based on:

### Pricing Components

1. **Backup Storage**
   - Charge per GB-month của storage used cho backups
   - Rates vary theo region

2. **Restore Requests**
   - Charge per GB của data restored
   - Based on restore complexity

3. **Cross-Region Copy**
   - Charge per GB của data transferred
   - Based on source và destination regions

4. **Cold Storage**
   - Lower charge per GB-month cho cold storage tier
   - Optimal cho long-term retention

**Detailed Pricing Information:** Visit [AWS Backup pricing page](https://aws.amazon.com/backup/pricing/)

## Troubleshooting

### Common Issues và Solutions

#### Issue 1: Backup Job Fails

**Causes:**
- Missing IAM permissions
- Resource access issues
- Service quota exceeded

**Solutions:**
1. Verify IAM role có required permissions
2. Ensure EKS cluster accessible
3. Check AWS service quotas

#### Issue 2: Recovery Point Not Showing

**Causes:**
- Backup job vẫn in progress
- Checking wrong backup vault
- Region mismatch

**Solutions:**
1. Check backup job status trong "Jobs" section
2. Select correct backup vault và region
3. Wait cho backup job complete

#### Issue 3: Restore Partially Fails

**Causes:**
- Missing resource dependencies
- Namespace conflicts
- Resource quota exceeded

**Solutions:**
1. Identify failed resources trong error logs
2. Ensure dependencies satisfied
3. Delete hoặc rename conflicting resources
4. Retry failed resources individually

## Tổng kết

Amazon EKS support trong AWS Backup cung cấp một managed solution để protect Kubernetes applications và data. Integration này loại bỏ nhu cầu custom scripts và third-party tools, cho phép organizations protect EKS workloads sử dụng một centralized platform integrates seamlessly với existing AWS services.

### Key Highlights

1. **Native Integration:** Backup và restore EKS clusters directly từ AWS Backup console
2. **Comprehensive Protection:** Backup cả cluster configuration và stateful data (EBS, EFS, S3)
3. **Policy-Based Automation:** Automate backups across multiple clusters
4. **Immutable Backups:** Protect từ ransomware và accidental changes
5. **Flexible Restore:** Restore đến existing clusters hoặc create new clusters
6. **Global Availability:** Available trong tất cả AWS commercial regions và GovCloud

### Next Steps

1. **Enable Amazon EKS support trong AWS Backup**
2. **Create backup policies và apply đến EKS clusters**
3. **Run on-demand backup để test setup**
4. **Practice restore procedures để ensure disaster recovery readiness**
5. **Optimize backup strategy cho long-term success**

Để tìm hiểu thêm về AWS Backup, visit [AWS Backup documentation](https://docs.aws.amazon.com/backup/).

## Tài liệu tham khảo

- [AWS Backup Documentation](https://docs.aws.amazon.com/backup/)
- [Amazon EKS Documentation](https://docs.aws.amazon.com/eks/)
- [AWS Backup Pricing](https://aws.amazon.com/backup/pricing/)
- [AWS Backup Best Practices](https://docs.aws.amazon.com/backup/latest/devguide/best-practices.html)
- [Amazon EKS Security Best Practices](https://docs.aws.amazon.com/eks/latest/userguide/best-practices-security.html)

---

**Từ khóa**: Amazon EKS, AWS Backup, Kubernetes, Backup, Disaster Recovery, Container Security, Data Protection, Cloud Native, Kubernetes Backup, EKS Clusters
