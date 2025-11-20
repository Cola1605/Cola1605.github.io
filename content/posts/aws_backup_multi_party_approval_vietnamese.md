---
title: "Cải thiện khả năng phục hồi với AWS Backup hỗ trợ Multi-party Approval"
date: 2025-10-24
draft: false
categories: ["AWS", "Storage", "Security"]
tags: ["AWS-Backup", "Multi-party-Approval", "Disaster-Recovery", "AWS-IAM", "AWS-Organizations", "Best-Practices", "Cloud-Security"]
description: "Tìm hiểu AWS Backup Multi-party Approval - tính năng mới tăng cường khả năng phục hồi với immutability, integrity verification và authentication isolation."
---

# Cải thiện khả năng phục hồi với AWS Backup hỗ trợ Multi-party Approval

**Tác giả (Dịch giả):** Takumi Yoshizawa  
**Ngày đăng:** 24/10/2025  
**Bản gốc:** 01/07/2025  
**Nguồn:** https://aws.amazon.com/jp/blogs/news/improve-recovery-resilience-with-aws-backup-support-for-multi-party-approval/

**Bản gốc tiếng Anh:** https://aws.amazon.com/jp/blogs/storage/improve-recovery-resilience-with-aws-backup-support-for-multi-party-approval/

**Categories:** Advanced (300), AWS IAM Identity Center, AWS Organizations, Best Practices, General, Resource Access Manager (RAM), Storage  

---

## 📋 Tóm tắt nội dung

**Bài viết này là bản dịch tiếng Nhật của bài "Improve recovery resilience with AWS Backup support for Multi-party approval" được công bố ngày 01/07/2025.**

Bài viết giới thiệu **AWS Backup Multi-party Approval** - tính năng mới giúp tăng cường **khả năng phục hồi (recovery resilience)** bằng cách:

✅ **3 trụ cột của chiến lược backup hiệu quả:**
1. **Immutability with Isolation** (Bất biến với phân tách): Backup không thể thay đổi, không thể xóa, được tách biệt khỏi production
2. **Integrity Verification** (Xác minh tính toàn vẹn): Đảm bảo backup không bị hỏng và có thể restore
3. **Availability** (Tính khả dụng): Đảm bảo backup có thể truy cập khi cần restore

✅ **Vấn đề của kiến trúc phục hồi truyền thống:**
- **Cascading failure risk:** Production và backup chia sẻ cùng authentication boundary
- **Single point of failure:** Một credential bị compromise → Ảnh hưởng cả production lẫn backup
- **Threat actor scenario:** Mã hóa production data + Block access to recovery mechanisms

✅ **Giải pháp: AWS Backup Multi-party Approval**
- **Independent access path** đến backup
- **Multiple approvers consensus** cho critical operations
- **Không cần AWS Support** trong security incidents → Cải thiện RTO

✅ **2 Use cases chính:**
1. **AWS Account Recovery:** Single account bị compromise
2. **AWS Organizations Recovery:** Entire Organization bị compromise

✅ **Architecture patterns:**
- Cross-account implementation với RAM sharing
- Cross-Organization với separate IdP
- Reference architecture với forensic account

---

## 📌 はじめに - Giới thiệu

Các organizations cần **bảo vệ backup khỏi evolving cyber threats**. Một **comprehensive backup and recovery strategy** cần có **3 fundamental pillars** (3 trụ cột cơ bản):

### 🏗️ 3 Trụ cột cơ bản

#### **1. Immutability with Isolation (分離を伴う不変性)**

**Bất biến kèm theo phân tách:**
- ✅ Backup **không bị thay đổi** (unchanged)
- ✅ Backup **không thể xóa** (undeletable)
- ✅ **Tách biệt khỏi production infrastructure** (separated from production)
- ✅ **Duy trì trạng thái gốc** (maintain original state)

#### **2. Integrity Verification (整合性検証)**

**Xác minh tính toàn vẹn:**
- ✅ **Confirms backup không bị corrupt** (破損していない)
- ✅ **Đảm bảo có thể restore** (復元可能)

#### **3. Availability (可用性)**

**Tính khả dụng:**
- ✅ **Đảm bảo backup có thể access khi cần restore** (復元が必要になった時に確実に利用できる)
- ✅ **Business continuity** trong critical situations

### 🎯 Tổng kết 3 trụ cột

> **"これらの要素が組み合わさることで、組織で最も価値があるといえるデータを多様な脅威から守る堅牢なセキュリティフレームワークが完成します。"**

**Khi 3 elements này kết hợp:**
→ Tạo nên **robust security framework** bảo vệ **most valuable organizational data** khỏi **diverse threats**

---

## 🔧 AWS Backup の基盤 - Nền tảng của AWS Backup

### 💪 AWS Backup Features

**[AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html)** cung cấp **foundation cho robust data resilience strategy:**

#### **1. Multi-AZ Storage với 11 Nines Durability**

**Storage across Multiple Availability Zones:**
- 🎯 **Durability:** `99.999999999%` (11 nines - イレブンナイン)
- 📍 **Method:** Store backup across multiple [Availability Zones (AZ)](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)

#### **2. AWS Backup Vault Lock - Immutability**

**[AWS Backup Vault Lock](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html):**
- 🔒 **Function:** **Prohibit backup tampering** (バックアップの改ざんを禁止)
- ✅ **Ensures immutability** (不変性を確保)

#### **3. AWS Backup Restore Testing - Integrity Verification**

**[AWS Backup 復元テスト](https://aws.amazon.com/blogs/storage/validate-recovery-readiness-with-aws-backup-restore-testing/):**
- ✅ **Verifies backup integrity** (バックアップの整合性を検証)
- 🔍 **Integration với partner solutions** for forensic analysis capabilities
- 📊 **Validates recovery readiness**

#### **4. Logically Air-gapped Vault - Isolation**

**AWS Backup Logically air-gapped vault:**
- 🌐 **Isolation from production**
- 🔐 **Service-owned key encryption**
- 🛡️ **Compliance mode lock**

### 📈 AWS Backup Resilience Guarantee

> **"AWS Backup は、バックアップ対象となる基盤の AWS サービスと少なくとも同等レベルの回復力と耐久性を維持し、データ保護戦略の強固な基盤を提供します。"**

**AWS Backup maintains:**
- ✅ **At least equivalent level** của resilience và durability với underlying AWS services being backed up
- ✅ **Strong foundation** cho data protection strategy

---

## ⚠️ 従来の復旧アーキテクチャにおける連鎖障害のリスク
## Rủi ro Cascading Failure trong kiến trúc phục hồi truyền thống

### 🔴 Critical Consideration - Vấn đề quan trọng

**Existing backup and recovery strategies có một consideration quan trọng:**

> **"保護対象である本番環境と同じ認証境界を共有することが一般的だということです。"**

**Common practice:**
- ❌ Backup và production **chia sẻ cùng authentication boundary** (同じ認証境界を共有)

### ✅ Ideal Approach - Cách tiếp cận lý tưởng

**Data access nên được:**
- ✅ **Managed by properly implemented identity strategy**
- ✅ **Clearly separated** giữa production systems và backup systems
- ✅ **Achieve more robust recovery capabilities**

### 🚨 Reality - Thực tế

> **"しかし、この重要な分離はしばしば見過ごされています。"**

**However:**
- ❌ **Critical separation này often overlooked** (見過ごされている)

### 💥 Cascading Failure Scenario

**Khi backup tightly coupled với source account credentials:**

```
Source Account Compromise
         ↓
Backup also compromised
         ↓
Cascading failure
```

#### **Threat trong AWS Organizations:**

**[AWS Organizations](https://aws.amazon.com/organizations/) context:**
- ⚠️ **Cross-account access**
- ⚠️ **Shared authentication dependencies**
- ⚠️ **Potential to expand security incident impact scope**

### 🎯 Threat Actor Scenario - Kịch bản tấn công

**Consider threat actor có elevated permissions trong production account:**

**Họ có thể:**
1. ❌ **Encrypt production data** (本番データを暗号化)
2. ❌ **Block access to recovery mechanisms** (復旧メカニズムへのアクセスをブロック)

**Kết quả:**
- 💥 **Compromise entire backup and recovery strategy**

### 📊 Impact mở rộng khi Organizations scale

**Challenge becomes MORE critical khi organization expands:**

> **"単一の認証情報の侵害が、複数のアカウントとワークロードにわたってビジネス継続性に影響を与える可能性があるからです。"**

**Vì sao?**
- 🔴 **Single credential compromise** → Impact **business continuity** across:
  - Multiple accounts
  - Multiple workloads

### 🎯 Single Point of Failure

> **"本番アカウントと同じ信頼境界内にバックアップを維持する従来のアプローチは、脅威が悪用できる単一障害点を作り出し、最後の防御線であるべきものを脆弱なターゲットに変えてしまいます。"**

**Traditional approach của maintaining backup:**
- ❌ **Within same trust boundary** as production account
- ❌ **Creates single point of failure** mà threats có thể exploit
- ❌ **Transforms what should be last line of defense** → **Vulnerable target**

---

## 🛡️ AWS セキュリティフレームワーク: データ保護の構成要素
## AWS Security Framework: Building Blocks của Data Protection

### 🏗️ Foundation: AWS Organizations

**[AWS Organizations](https://aws.amazon.com/organizations/):**
- 🎯 **Serves as foundation** cho scalable security
- ✅ **Enables enterprises** to:
  - Deploy multi-layered defense controls
  - Manage across entire organization
  - Build synergistic security posture

### 🔐 Layer 1: Service Control Policies (SCP)

**[Service Control Policies (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html):**
- 🚧 **Function as guardrails** (ガードレール)
- 🎯 **Restrict permissions** across accounts

### 🔐 Layer 2: Resource Control Policies (RCP)

**[Resource Control Policies (RCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html):**
- 🎯 **Provide coarse-grained control** (大まかな制御) cho specific resources
- 📖 Reference: [Effectively implementing resource controls policies](https://aws.amazon.com/blogs/security/effectively-implementing-resource-controls-policies-in-a-multi-account-environment/)

### 🔐 Layer 3: IAM Permissions Boundaries

**[AWS IAM アクセス許可境界](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html):**
- 🎯 **Constrain IAM principal permissions** (IAM プリンシパルのアクセス許可を制約)
- ✅ **Align với least privilege principle**
- ✅ **Prevent exceeding originally intended permissions**

### 🔐 Layer 4: AWS Key Management Service (KMS)

**[AWS Key Management Service (AWS KMS)](https://aws.amazon.com/kms/):**
- 🔒 **Protect data** through encryption with customer managed keys
- 🌐 **Cross-account copy** capabilities:
  - ✅ Ensure physical separation của backup
  - ✅ Improve resilience

### ⚠️ Limitation của traditional framework

> **"しかし、これらのコントロールは強力である一方、従来の単一承認フレームワーク内で動作しており、内部攻撃や認証情報の侵害により、これらの保護を回避される可能性があります。"**

**However:**
- ✅ These controls are **powerful**
- ❌ BUT: Operate within **traditional single-approval framework**
- 🚨 **Vulnerable to:**
  - Internal attacks (内部攻撃)
  - Credential compromise (認証情報の侵害)
  - → May **bypass these protections**

---

## 🆕 AWS Backup の Logically air-gapped vault
## AWS Backup Logically Air-gapped Vault

### 🎯 Addressing the Challenge

**To address this challenge:**

**AWS Backup supports:**
- ✨ **[マルチパーティ承認 for AWS Backup Logically air-gapped vault](https://docs.aws.amazon.com/aws-backup/latest/devguide/multipartyapproval.html)**
- ✅ **Enhances security** WITHOUT compromising operational agility

### 📖 Scenario Setup - Kịch bản thiết lập

**Consider the following scenario:**

**You've created:**
1. ✅ **Immutable backup** protected by AWS Backup Vault Lock
2. ✅ **Isolated** via AWS Backup Logically air-gapped vault
3. ✅ **Encryption** with [service-owned keys](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-owned-cmk)

### 🚨 Ransomware Incident Scenario

**During ransomware incident:**

**Threat actor obtains root access to:**
- ❌ Backup account
- ❌ OR organization management account

**Situation:**
- ✅ **Backup remains securely stored** (バックアップは安全に保存されたまま)
- ❌ BUT: **Need to contact AWS Support** để recover account access

### 💡 Multi-party Approval Solution

> **"マルチパーティ承認は、図 1 に示すように、バックアップへの独立したアクセスパスを作成する仕組みです。"**

**Multi-party approval mechanism (図 1):**

#### **🎯 Definition:**
- **Creates independent access path** to backups (バックアップへの独立したアクセスパス)
- **Requires consensus** từ multiple approvers cho critical operations
- **Prevents unilateral changes** by single person

#### **🔧 How It Works:**

**Using this native AWS feature:**

1. **Associate approval team** với AWS Backup Logically air-gapped vault
   - Team consists of **trusted individuals**

2. **In case of malicious activity** blocking AWS account access:
   - ✅ These approval teams can **approve vault sharing requests**
   - ✅ From **one or multiple recovery accounts**
   - ✅ Including accounts **outside current AWS Organizations**

3. **Benefits:**
   - ✅ **No need for procedures** to contact AWS Support (手続きが不要)
   - ✅ **Improves RTO** ([Recovery Time Objective](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-of-on-premises-applications-to-aws/recovery-objectives.html))
   - ✅ **Access backup** needed for recovery

### 📊 Figure 1: Multi-party Approval Workflow

**図 1: マルチパーティ承認ワークフロー**

```
┌─────────────────────────────────────────────────────────┐
│          Multi-party Approval Workflow                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Backup Owner Account                                │
│     └─> AWS Backup Logically air-gapped vault           │
│         └─> Associated với Approval Team                │
│                                                          │
│  2. Security Incident Occurs                            │
│     └─> Account access blocked                          │
│                                                          │
│  3. Recovery Account                                    │
│     └─> Sends Vault Sharing Request                     │
│                                                          │
│  4. Multi-party Approval Triggered                      │
│     └─> Notifications to Approvers                      │
│                                                          │
│  5. Approvers Review & Approve                          │
│     └─> Required number of approvals                    │
│                                                          │
│  6. Vault Access Granted                                │
│     └─> Recovery operations can proceed                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 ユースケースとデプロイパターン
## Use Cases và Deploy Patterns

### 🏢 Compliance Use Case: Sheltered Harbor

**Integration của Multi-party approval với AWS Backup Logically air-gapped vault:**
- ✅ **Builds robust framework** cho data protection

#### **Compliance Requirements:**

**Organizations complying với [Sheltered Harbor](https://shelteredharbor.org/):**

**Requirements:**
1. ✅ **Backup maintains immutability** (不変性を維持)
2. ✅ **Provides isolation** from production infrastructure (本番インフラストラクチャからの分離)
3. ✅ **Enables integrity verification** (整合性検証を可能)

#### **AWS Backup Logically air-gapped vault addresses these:**

**Through 3 key capabilities:**

**1. Immutability:**
- 🔒 **Maintains backup immutability** using Compliance mode lock

**2. Isolation:**
- 🌐 **Provides isolation** from production infrastructure through Logically air-gapped vault

**3. Verification:**
- ✅ **Enables validation** của backup data through:
  - AWS Backup Restore Testing integration
  - Partner solution integration

#### **Target Organizations:**

**Architecture đặc biệt valuable cho:**
- 🏦 **Financial institutions** (金融機関)
- 🏢 **Other regulated enterprises** (規制対象企業)
- 📋 Organizations cần **maintain backups completely separated** từ original infrastructure

---

## 📚 2 Critical Use Cases - 2 Use case quan trọng

**Following sections explain:**
- How organizations strategically implement this feature
- Across various scenarios

### 🎯 Two Critical Use Cases:

#### **Use Case 1: AWS Account Recovery**

**Scenario:**
- **AWS Account Recovery:** Single AWS account hosting AWS Backup Logically air-gapped vault becomes **inaccessible**

**Solution:**
- ✅ **Multi-party approval enables recovery**
- ✅ **Ensures business continuity** during critical security incidents

#### **Use Case 2: AWS Organizations Recovery**

**Scenario:**
- **AWS Organizations Recovery:** **Entire Organization** is compromised

**Solution:**
- ✅ **Multi-party approval provides recovery lifeline**
- ✅ Validates complex scenario

---

## 🔧 Use Case 1: AWS アカウントの復旧
## AWS Account Recovery

### 📖 Scenario Description

**Consider scenario:**

**AWS account hosting AWS Backup Logically air-gapped vault becomes:**
- ❌ **Completely inaccessible**

**Reasons:**
- Security incident
- Credential compromise

### ⏰ Traditional Recovery Method

**従来の復旧方法:**
- ❌ **Requires contacting AWS Support**
- ❌ **Prolonged business interruption** (ビジネスの中断が長期化)

### ✅ Multi-party Approval Approach

**Using Multi-party approval:**
- ✅ Can **implement predefined recovery strategy**
- ✅ As shown in following diagram

---

## 🛠️ Implementation: Preparation Phase

**このプロセスは、一元管理されたマルチパーティ承認チームの事前設定から始まります:**

### Step 1: Create Multi-party Approval Team

**[Create マルチパーティ承認チーム](https://docs.aws.amazon.com/mpa/latest/userguide/create-team.html):**
- 👥 **Composed of trusted individuals** trong organization (組織内の信頼できる個人)

### Step 2: Share Approval Team

**[Share 承認チーム](https://docs.aws.amazon.com/mpa/latest/userguide/share-team.html):**
- 🔗 Share created approval team

### Step 3: Associate Team with Vault

**[Associate マルチパーティ承認チーム](https://docs.aws.amazon.com/aws-backup/latest/devguide/multipartyapproval-tasks-requester.html) với relevant AWS Backup Logically air-gapped vault:**
- 🔗 Link approval team to vault

---

## 🚨 Implementation: Recovery Phase

**アクセシビリティの侵害が発生した場合:**

**When accessibility breach occurs:**

### Step 1: Share Team to Recovery Accounts

**Using [AWS Resource Access Manager (RAM)](https://docs.aws.amazon.com/mpa/latest/userguide/share-team.html):**
- 🔗 **Share approval team** to:
  - One recovery account
  - OR multiple recovery accounts

### Step 2: Submit Vault Sharing Request

**Recovery team:**
- 📤 **Sends Vault sharing request** from:
  - One recovery account
  - OR multiple recovery accounts

### Step 3: Trigger Multi-party Approval

**Multi-party approval triggered:**
- 🔔 **Notifies approvers** rằng:
  - Access request to Logically air-gapped vault is **pending**

### Step 4: Approvers Respond

**Members trong designated Multi-party approval team:**
- ✅ **[Respond](https://docs.aws.amazon.com/mpa/latest/userguide/respond-request.html) to request**
- ✅ **Approve sharing**

### Step 5: Vault Becomes Accessible

**After receiving required number of approvals từ team:**
- ✅ **Logically air-gapped vault becomes accessible** in recovery account

### Step 6: Execute Recovery Operations

**Now able to:**
- ✅ **Perform recovery operations** using backup trong Logically air-gapped vault
- ✅ **Independent of compromised owner account** (侵害された所有アカウントとは独立)

---

## 💪 Benefits của Account Recovery Pattern

### 🔒 Security Controls

> **"この仕組みにより、単独の個人がバックアップデータに一方的にアクセスすることを防ぎ、堅牢なセキュリティ制御を維持しながらビジネス継続性を確保できます。"**

**Mechanism prevents:**
- ❌ **Single individual** from unilaterally accessing backup data (一方的にアクセス)

**While:**
- ✅ **Maintains robust security controls** (堅牢なセキュリティ制御)
- ✅ **Ensures business continuity** (ビジネス継続性)

### ⚡ Improved RTO

**Throughout entire process:**
- ✅ **Uses AWS native interfaces**
- ✅ **Eliminates dependency** on compromised account authentication system
- ✅ **Significantly reduces RTO** (大幅に短縮)

---

## 📊 Figure 2: Cross-Account Workflow

**図 2: AWS クロスアカウント マルチパーティ承認ワークフロー**

**Sample workflow for cross-account implementation:**

```
┌────────────────────────────────────────────────────────────┐
│     AWS Cross-Account Multi-party Approval Workflow       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Setup Phase:                                              │
│  ┌──────────────────────────────────────────┐             │
│  │ 1. Create Approval Team                  │             │
│  │    └─> Trusted individuals               │             │
│  │                                           │             │
│  │ 2. Share Approval Team (AWS RAM)         │             │
│  │                                           │             │
│  │ 3. Associate Team with Vault             │             │
│  │    └─> Logically air-gapped vault        │             │
│  └──────────────────────────────────────────┘             │
│                                                             │
│  Recovery Phase:                                           │
│  ┌──────────────────────────────────────────┐             │
│  │ Compromise Event                          │             │
│  │    ↓                                      │             │
│  │ 1. Share Team to Recovery Account (RAM)  │             │
│  │    ↓                                      │             │
│  │ 2. Recovery Team sends Vault Share Req   │             │
│  │    ↓                                      │             │
│  │ 3. Multi-party Approval Triggered        │             │
│  │    └─> Notifications sent                │             │
│  │    ↓                                      │             │
│  │ 4. Approvers Respond & Approve           │             │
│  │    └─> Required approvals met            │             │
│  │    ↓                                      │             │
│  │ 5. Vault Access Granted                  │             │
│  │    └─> Recovery account                  │             │
│  │    ↓                                      │             │
│  │ 6. Execute Recovery Operations           │             │
│  │    └─> Independent of owner account      │             │
│  └──────────────────────────────────────────┘             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### 🎯 Architecture Benefits

**By implementing this architecture:**
- ✅ **Create trusted recovery path** operating **independent of potentially compromised infrastructure**
- ✅ **Provides resilient solution** even against most critical security incidents

---

## 🌐 Use Case 2: AWS Organizations の復旧
## AWS Organizations Recovery

### 📖 From Account to Organization

**Previous scenario addressed:**
- ✅ Individual account compromise

**Now need to prepare for:**
- 🌐 **Situation where entire Organization becomes inaccessible**

### 🚨 Organization-level Compromise Scenarios

**This can occur due to:**

1. **大規模な侵害** - Large-scale breach
2. **重大な設定ミス** - Critical misconfiguration
3. **管理アカウントの侵害** - Management account compromise
4. **悪意のある内部関係者** - Malicious insider

### 🎯 Requirements

**In such cases:**
- ✅ **Recovery process requires MORE robust trust model**
- ✅ **Independent trust model** (堅牢で独立した信頼モデル)

---

## 🛠️ Implementation: Organization Recovery Preparation

**このプロセスは、中央管理されたマルチパーティ承認チームの事前設定から始まります。これは図 3 にも示されています:**

**Process starts với centrally managed Multi-party approval team pre-configuration (also shown in Figure 3):**

### Step 1: Create Separate Recovery Organization

**Create recovery Organization:**
- 🏢 **Separate từ primary infrastructure** (プライマリインフラストラクチャとは別)

### Step 2: Setup Independent IdP

**For this Organization:**
- 🔐 **Configure independent Identity Provider (IdP)**
- 🔗 **Associate với Multi-party approval**

### Step 3: Create Approval Team

**Using this independent IdP:**
- 👥 **Create Multi-party approval team**
- 👥 Composed of **trusted individuals** trong organization

### Step 4: Share Team via AWS RAM

**Using AWS RAM:**
- 🔗 **Share this Multi-party approval team**
- 🎯 To accounts using AWS Backup Logically air-gapped vault

### Step 5: Associate Team with Vault

**[Associate マルチパーティ承認チーム](https://docs.aws.amazon.com/aws-backup/latest/devguide/multipartyapproval-tasks-requester.html) to:**
- 🔗 Relevant AWS Backup Logically air-gapped vault

---

## 🚨 Implementation: Organization Recovery Phase

**アクセシビリティの侵害が発生した場合:**

**When accessibility breach occurs:**

### Step 1: Share Team to Recovery Accounts

**Using [AWS RAM](https://docs.aws.amazon.com/mpa/latest/userguide/share-team.html):**
- 🔗 **Share approval team** to:
  - One recovery account
  - OR multiple recovery accounts

### Step 2: Initiate Vault Sharing Request

**Designated recovery team members:**
- 📤 **Initiate Vault sharing request** from:
  - One recovery account
  - OR multiple recovery accounts

### Step 3: Trigger Workflow

**Multi-party approval workflow triggered:**
- 🔔 **Notifies team members** rằng:
  - Access request to Logically air-gapped vault is **pending**

### Step 4: Approvers Respond

**Approvers trong designated Multi-party approval team:**
- ✅ **[Respond](https://docs.aws.amazon.com/mpa/latest/userguide/respond-request.html) to approval request**
- ✅ **Approve sharing**

### Step 5: Vault Becomes Accessible

**After receiving required number of approvals từ approval team:**
- ✅ **Logically air-gapped vault becomes accessible** in recovery account

### Step 6: Proceed with Recovery

**Now able to:**
- ✅ **Proceed với recovery operations** using backup trong Logically air-gapped vault
- ✅ **WITHOUT depending on compromised owner account** (依存することなく)

---

## 📊 Figure 3: Cross-Organization Workflow

**図 3: Organization を横断したマルチパーティ承認ワークフロー**

**Standard cross-Organization workflow:**

```
┌─────────────────────────────────────────────────────────────┐
│   Cross-Organization Multi-party Approval Workflow         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Primary Organization                 Recovery Organization │
│  ┌─────────────────────┐             ┌──────────────────┐  │
│  │ Production Accounts │             │ Independent IdP  │  │
│  │   ↓                 │             │       ↓          │  │
│  │ Backup Accounts     │             │ Approval Team    │  │
│  │   ↓                 │             │                  │  │
│  │ Logically air-      │ ←─ RAM  ────┤ Shared via RAM   │  │
│  │ gapped vault        │   Share     │                  │  │
│  │   + Approval Team   │             │                  │  │
│  └─────────────────────┘             └──────────────────┘  │
│                                                              │
│  Compromise Scenario:                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. Primary Organization Compromised                │    │
│  │    └─> All accounts inaccessible                   │    │
│  │                                                     │    │
│  │ 2. Recovery Organization (Separate)                │    │
│  │    └─> Share Approval Team to Recovery Accounts   │    │
│  │                                                     │    │
│  │ 3. Recovery Team initiates Vault Share Request    │    │
│  │                                                     │    │
│  │ 4. Multi-party Approval Workflow                   │    │
│  │    └─> Approvers (via Independent IdP)            │    │
│  │    └─> Review and Approve                          │    │
│  │                                                     │    │
│  │ 5. Vault Access Granted                            │    │
│  │    └─> Recovery accounts can access backup        │    │
│  │                                                     │    │
│  │ 6. Recovery Operations                             │    │
│  │    └─> Independent of Primary Organization        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 Architecture Resilience

> **"このアーキテクチャは、Organization 全体がアクセス不能になった場合でも、重要なバックアップデータへのアクセスを維持する復旧パスを作成します。"**

**This architecture creates recovery path that:**
- ✅ **Maintains access** to critical backup data
- ✅ **Even when entire Organization becomes inaccessible**

### 💪 Highest Level of Resilience

**By combining:**
- 🔐 **Least privilege principle** (最小権限の原則)
- 🔐 **Independent identity controls** (独立したアイデンティティ制御)

**Provides:**
- ✅ **Highest level of resilience** for:
  - Most stringent compliance scenarios
  - Regulatory requirements
  - Security recovery scenarios

---

## 🏗️ ハイレベル参照アーキテクチャ
## High-level Reference Architecture

### 📊 Comprehensive Protection Layers

**AWS Backup reference architecture includes:**
- 🛡️ **Multiple protection layers**
- ✅ **Validation layers**
- 📈 As shown in following diagram

---

## 🏢 Architecture Components

### **1. Primary Workload Account**

**Production systems:**
- 💾 **Backed up** to local AWS Backup vault

**From there:**
- ↗️ **Copies of these backups** sent to:
  - AWS Backup Logically air-gapped vault
  - In same account
  - Providing **additional isolation layer**

### **2. Forensic Account Sharing**

**To ensure data integrity:**

**This Logically air-gapped vault:**
- 🔗 **Shared** through [AWS RAM](https://aws.amazon.com/ram/)
- 🎯 **To dedicated forensic account**

### **3. Forensic Account Operations**

**In forensic account:**
- ✅ **AWS Backup Restore Testing** conducted
- 🔍 **Alongside third-party solutions**
- 📊 **Validates:**
  - Backup data integrity (整合性)
  - Restorability (復旧可能性)

### **4. Continuous Validation Process**

**This continuous validation process:**
- ✅ **Ensures backup:**
  - Remains uncorrupted (破損せず)
  - Maintains reliability (信頼性を保つ)

---

## 🚀 Recovery Paths

**In recovery scenarios:**
- ✅ **Two paths available**

### **Path 1: Default Sharing (Normal Operations)**

**Through AWS RAM default sharing:**
- 👤 **Authenticated users** trong forensic account can:
  - ✅ **Access backups**
  - ✅ **Validate backups**

**Use cases:**
- ✅ Normal circumstances (通常の状況下)
- ✅ Rapid data loss recovery (迅速なデータ損失復旧)

### **Path 2: Multi-party Approval (Emergency)**

**In situations where:**
- ❌ Primary account becomes inaccessible
- ❌ OR entire Organization becomes inaccessible

**Multi-party approval enables:**
- ✅ **Secure access to backups**

---

## 🎯 Dual Approach Benefits

**This dual approach provides:**

### **Daily Operations:**
- ✅ **Flexibility** cho daily operations (日常的な運用の柔軟性)

### **Crisis Recovery:**
- ✅ **Robust crisis recovery mechanism** (堅牢な危機復旧メカニズム)

### **Overall Guarantee:**
- ✅ **Ensures availability** của critical data (重要なデータへの利用可能性)
- ✅ **Ensures integrity** của critical data (整合性)
- ✅ **Regardless của potential security incident scale** (セキュリティインシデントの規模に関係なく)

---

## 📊 Figure 4: Complete Reference Architecture

**図 4: AWS Backup のリファレンスアーキテクチャ**

**Full multi-Organization architecture:**

```
┌──────────────────────────────────────────────────────────────────────┐
│              AWS Backup Reference Architecture                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Primary Organization                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  Workload Account                                           │   │
│  │  ┌──────────────────────────────────────────┐              │   │
│  │  │ Production Systems                        │              │   │
│  │  │       ↓                                   │              │   │
│  │  │ Local AWS Backup Vault                   │              │   │
│  │  │       ↓                                   │              │   │
│  │  │ AWS Backup Logically air-gapped vault    │              │   │
│  │  │   • Vault Lock (Immutability)            │              │   │
│  │  │   • Service-owned key encryption         │              │   │
│  │  │   • Multi-AZ (11 nines durability)       │              │   │
│  │  │   • Associated with Approval Team        │              │   │
│  │  └──────────────────────────────────────────┘              │   │
│  │                        ↓                                    │   │
│  │                   AWS RAM Sharing                           │   │
│  │                        ↓                                    │   │
│  │  Forensic Account                                           │   │
│  │  ┌──────────────────────────────────────────┐              │   │
│  │  │ Shared Logically air-gapped vault        │              │   │
│  │  │       ↓                                   │              │   │
│  │  │ AWS Backup Restore Testing               │              │   │
│  │  │       +                                   │              │   │
│  │  │ Third-party Solutions                    │              │   │
│  │  │       ↓                                   │              │   │
│  │  │ Integrity Verification                   │              │   │
│  │  │ Forensic Analysis                        │              │   │
│  │  └──────────────────────────────────────────┘              │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Recovery Organization (Separate)                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  Independent IdP                                            │   │
│  │       ↓                                                     │   │
│  │  Multi-party Approval Team                                 │   │
│  │       ↓                                                     │   │
│  │  Recovery Accounts                                          │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Recovery Paths:                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  Path 1: Normal Operations                                  │   │
│  │  └─> AWS RAM default sharing                               │   │
│  │      └─> Forensic account authenticated users              │   │
│  │          └─> Access & validate backups                     │   │
│  │                                                              │   │
│  │  Path 2: Emergency Recovery                                 │   │
│  │  └─> Multi-party Approval                                  │   │
│  │      └─> Approval Team (Independent IdP)                   │   │
│  │          └─> Grant access to Recovery Accounts             │   │
│  │              └─> Secure backup access                      │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Protection Layers Summary:                                         │
│  • Multi-AZ Storage (11 nines durability)                          │
│  • Vault Lock (Immutability)                                        │
│  • Logically air-gapped vault (Isolation)                          │
│  • Restore Testing (Integrity verification)                         │
│  • Multi-party Approval (Emergency availability)                    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 まとめ - Conclusion

### 📋 3 Critical Pillars Recap

**Effective recovery strategy requires 3 critical pillars:**

1. **不変性** (Immutability with isolation)
   - Ensures isolation
   - Prevents tampering

2. **整合性検証** (Integrity verification)
   - Ensures reliability

3. **可用性** (Availability)

### ✅ AWS Backup Delivers All 3 Pillars

**AWS Backup provides these through:**

#### **1. Immutability & Isolation**
- 🔒 **Logically air-gapped vault** with vault lock

#### **2. Integrity Verification**
- ✅ **AWS Backup Restore Testing**

#### **3. Availability**
- 🔐 **Multi-party approval**
- ✅ Ensures **reliable access to backup**
- ✅ Even during **critical security incidents**

---

## 🚀 Multi-party Approval Transformation

> **"マルチパーティ承認は、単一アカウントのインシデントから組織全体のイベントまで、バックアップアクセスを可能にすることで復旧戦略を変革します。"**

**Multi-party approval transforms recovery strategy by:**
- ✅ **Enabling backup access** from:
  - Single account incidents (単一アカウントのインシデント)
  - TO organization-wide events (組織全体のイベント)

### 🎯 Key Mechanisms

**Through:**
1. **最小限の必要な承認ベースの決定フロー**
   - Minimum required approval-based decision flow

2. **独立した ID インフラストラクチャ**
   - Independent ID infrastructure

**Result:**
- ✅ **Makes recovery path available**
- ✅ **Even when traditional authentication methods fail**

---

## 💪 Call to Action - Hành động ngay

### 🎯 Recommendation

> **"今すぐ復旧計画にマルチパーティ承認を使用することを検討し、あらゆるシナリオにおいて組織が重要なバックアップデータへのアクセスを維持できるようにしてください。"**

**Consider using Multi-party approval trong recovery plan ngay bây giờ:**
- ✅ **Ensure organization maintains access** to critical backup data
- ✅ **In ALL scenarios** (あらゆるシナリオ)

### 🏗️ Implementation Benefits

**By implementing recovery patterns with:**
1. **Clear separation of duties** (職務の明確な分離)
2. **Independent identity mechanisms** (独立したアイデンティティメカニズム)

**Organization's ability to recover từ any cyber incident is enhanced:**
- 💪 **Enhanced recovery capability** (強化されます)

---

## 🔑 Final Reminder

> **"常に覚えておいてください。復旧戦略は必要な時に実行できるかが鍵となります。"**

**Always remember:**
- 🎯 **Recovery strategy key:** Ability to **execute when needed**
- ✅ **必要な時に実行できるか** (Can execute when needed)

---

## 📊 Key Takeaways - Những điểm quan trọng

### 🎯 Multi-party Approval Core Benefits

| Benefit | Description |
|---------|-------------|
| **Independent Access Path** | Creates separate authentication path to backups |
| **Multiple Approvers** | Requires consensus, prevents unilateral access |
| **No AWS Support Dependency** | Eliminates need to contact support during incidents |
| **Improved RTO** | Significantly reduces recovery time objective |
| **Business Continuity** | Ensures continuity even during critical incidents |
| **Compliance Support** | Meets stringent regulatory requirements |

### 🏗️ Implementation Patterns

| Pattern | Use Case | Key Features |
|---------|----------|--------------|
| **Cross-Account** | Single account compromise | RAM sharing, approval team association |
| **Cross-Organization** | Organization-wide compromise | Separate recovery org, independent IdP |
| **Reference Architecture** | Complete solution | Forensic account, dual recovery paths |

### 🛡️ Protection Layers

```
┌─────────────────────────────────────────────┐
│     AWS Backup Protection Stack            │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 5: Multi-party Approval              │
│           └─> Emergency availability        │
│                                              │
│  Layer 4: Restore Testing                   │
│           └─> Integrity verification        │
│                                              │
│  Layer 3: Logically air-gapped vault        │
│           └─> Isolation                     │
│                                              │
│  Layer 2: Vault Lock                        │
│           └─> Immutability                  │
│                                              │
│  Layer 1: Multi-AZ Storage                  │
│           └─> 11 nines durability           │
│                                              │
└─────────────────────────────────────────────┘
```

### 📚 Related Resources

**Documentation:**
- [Multi-party approval for AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/multipartyapproval.html)
- [Create approval team](https://docs.aws.amazon.com/mpa/latest/userguide/create-team.html)
- [Share team via RAM](https://docs.aws.amazon.com/mpa/latest/userguide/share-team.html)
- [Respond to approval requests](https://docs.aws.amazon.com/mpa/latest/userguide/respond-request.html)

**Related Services:**
- [AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html)
- [AWS Organizations](https://aws.amazon.com/organizations/)
- [AWS Resource Access Manager](https://aws.amazon.com/ram/)
- [AWS Key Management Service](https://aws.amazon.com/kms/)

**Compliance:**
- [Sheltered Harbor](https://shelteredharbor.org/)
- [Recovery Objectives (RTO/RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-of-on-premises-applications-to-aws/recovery-objectives.html)

### 🎓 Next Steps

**To implement Multi-party approval:**

1. **✅ Assess current recovery strategy**
   - Identify single points of failure
   - Evaluate authentication boundaries

2. **✅ Design approval team structure**
   - Select trusted individuals
   - Define approval requirements

3. **✅ Implement cross-account pattern**
   - Start with single account recovery
   - Test approval workflow

4. **✅ Expand to cross-Organization**
   - Setup separate recovery Organization
   - Configure independent IdP

5. **✅ Establish testing procedures**
   - Regular approval workflow tests
   - Validate recovery paths

6. **✅ Document and train**
   - Create runbooks
   - Train approval team members

---

## 🔗 Part 2 Reference

**For detailed implementation guidance:**

**[パート 2: Implementing Multi-party Approval Workflows](https://aws.amazon.com/jp/blogs/storage/implementing-multi-party-approval-workflows-for-aws-backup-logically-air-gapped-vaults/)**

**Covers:**
- ✅ Best practices
- ✅ Practical examples
- ✅ Configuration guidance
- ✅ Workflow setup trong AWS environment

---

TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/