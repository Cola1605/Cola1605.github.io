---
title: "Amazon SageMaker AI Serverless Customization - Tăng Tốc Model Fine-Tuning"
date: 2025-12-08
draft: false
description: "SageMaker AI ra mắt Serverless Customization - rút ngắn model customization từ tháng xuống ngày, hỗ trợ DPO, RLVR, RLAIF với UI đơn giản và MLflow tích hợp"
tags: ["AWS", "SageMaker AI", "Serverless", "Fine-Tuning", "Model Customization", "DPO", "RLVR", "RLAIF", "MLflow", "Amazon Nova", "AWS re:Invent"]
categories: ["AI and Machine Learning", "DevOps and Infrastructure"]
author: "Channy Yun"
language: "vi"
slug: "aws-sagemaker-serverless-model-customization"
---

# Amazon SageMaker AI Serverless Customization - Tăng Tốc Model Fine-Tuning

## 📋 Tóm Tắt

Ngày 3/12/2025, AWS công bố **Serverless Customization** cho Amazon SageMaker AI - tính năng đột phá giúp:

- ⚡ **Rút ngắn customization từ tháng → ngày**
- 🎯 **Chỉ vài click** để fine-tune model
- 🔧 Hỗ trợ **DPO, RLVR, RLAIF** và supervised fine-tuning
- 🚀 **Hoàn toàn serverless** - không lo infrastructure
- 📊 **MLflow tích hợp** - tự động track experiments
- 💰 **Pay-per-token** - chỉ trả tiền cho tokens đã xử lý

**Models hỗ trợ**: Amazon Nova, DeepSeek, Qwen, Meta Llama

---

## 🎯 Thông Tin Bài Viết

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Tác giả** | Channy Yun (윤석찬) |
| **Ngày xuất bản** | 8/12/2025 |
| **Ngày công bố** | 3/12/2025 (AWS re:Invent) |
| **Regions** | US East, US West, Tokyo, Ireland |

---

## 🌟 Đột Phá Chính

### Từ Tháng → Ngày

**Trước đây**:
- 🔴 Setup infrastructure phức tạp
- 🔴 Viết code training từ đầu
- 🔴 Manage compute resources
- 🔴 Mất vài tháng

**Bây giờ**:
- ✅ Chỉ vài click trên UI
- ✅ Auto-provision resources
- ✅ Hoàn toàn serverless
- ✅ **Hoàn thành trong vài ngày**

---

## 🛠️ 4 Phương Pháp Customization

### 1. Supervised Fine-Tuning
**Truyền thống**, phù hợp khi có labeled data

### 2. DPO - Direct Preference Optimization
**Tối ưu preference trực tiếp**, không cần reward model

### 3. RLVR - RL with Verifiable Rewards
**Objective tasks** với rewards có thể verify (code, math)

### 4. RLAIF - RL from AI Feedback
**Subjective tasks** dùng AI judge

**Chọn method dựa trên**:
- Dataset size và quality
- Customization goals
- Task type (objective vs subjective)

---

## 🎨 2 Cách Sử Dụng

### Option 1: UI Customization (Dễ nhất!)

**9 bước đơn giản**:

```
1. SageMaker Studio → Models
   ↓
2. Chọn model (e.g., Llama 3.1 8B)
   ↓
3. "Customize in UI"
   ↓
4. Chọn method (DPO/RLVR/RLAIF/Supervised)
   ↓
5. Upload training dataset
   ↓
6. Configure hyperparameters
   ↓
7. Submit → Training starts!
   ↓
8. Evaluate vs base model
   ↓
9. Deploy to Bedrock/SageMaker
```

**Features**:
- ✅ Recommended hyperparameters
- ✅ Serverless MLflow tracking
- ✅ Network & storage encryption
- ✅ Auto resource provisioning

### Option 2: Code Customization (Flexible!)

**Cho advanced users**:

```python
# Sample notebook tự động generate
# Có thể edit trong JupyterLab

# Deploy options:
- SageMaker Inference
- SageMaker HyperPod
```

---

## 🚀 Workflow Chi Tiết

### Step 1: Training

```
Select Model → Choose Method → Upload Data → Configure → Train
```

**Auto features**:
- Resource provisioning
- Optimal compute selection
- Progress monitoring

### Step 2: Post-Training Actions

#### Continue Customization
- Adjust hyperparameters
- Try different methods
- Iterative improvement

#### Evaluation
```
Compare:
- Custom model vs Base model
- Different customization methods
- Various hyperparameter settings
```

#### Deployment

**Option A: Amazon Bedrock (Serverless)**
```
Deploy → Bedrock Console → Test inference
```
- ✅ Fully serverless
- ✅ Auto-scaling
- ✅ Pay-per-use

**Option B: SageMaker Endpoint (Control)**
```
Deploy → Configure:
- Instance type
- Instance count
- Endpoint settings
```
- ✅ Resource control
- ✅ Dedicated capacity
- ✅ Predictable performance

### Step 3: Testing

**Playground tab**:
- Single prompt mode
- Chat mode
- Side-by-side comparison

---

## 📊 MLflow Integration

### Serverless MLflow

**Tự động track**:
- Training metrics
- Hyperparameters
- Model versions
- Experiment comparisons

**Visualizations**:
- Loss curves
- Accuracy trends
- Hyperparameter impact
- Model comparison charts

**Zero code changes** required!

---

## 💰 Pricing Model

### Pay-per-Token

| Component | Pricing |
|-----------|---------|
| **Training** | Tokens processed during training |
| **Inference** | Tokens processed during inference |
| **Storage** | Model storage (standard S3 rates) |

**No charges for**:
- Infrastructure management
- Idle time
- Failed experiments

**Details**: [SageMaker AI Pricing](https://aws.amazon.com/sagemaker/ai/pricing/)

---

## 🎯 Use Cases

### 1. Domain-Specific Models

**Scenario**: Legal, Medical, Financial domain

**Solution**:
```
Base Model (Llama 3.1)
    ↓
+ Domain data
    ↓
Supervised Fine-Tuning
    ↓
Domain Expert Model
```

### 2. Instruction Following

**Scenario**: Chatbot cần follow specific guidelines

**Solution**:
```
Base Model
    ↓
+ Preference data
    ↓
DPO/RLAIF
    ↓
Guideline-Compliant Model
```

### 3. Code Generation

**Scenario**: Internal coding standards

**Solution**:
```
Base Model
    ↓
+ Code examples + Test cases
    ↓
RLVR (verifiable rewards)
    ↓
Standards-Compliant Code Generator
```

---

## ✅ Best Practices

### Dataset Preparation

**DO**:
- ✅ Clean, high-quality data
- ✅ Representative samples
- ✅ Proper format (method-specific)
- ✅ Sufficient volume

**DON'T**:
- ❌ Noisy/duplicate data
- ❌ Biased samples
- ❌ Wrong format
- ❌ Too small dataset

### Method Selection

| Task Type | Recommended Method |
|-----------|-------------------|
| **Labeled data available** | Supervised Fine-Tuning |
| **Preference pairs** | DPO |
| **Objective evaluation** | RLVR |
| **Subjective quality** | RLAIF |

### Hyperparameter Tuning

**Start with defaults** → Monitor metrics → Adjust if needed

**Key parameters**:
- Learning rate
- Batch size
- Epochs
- Warmup steps

---

## 🌍 Availability

### Regions

- ✅ US East (Virginia)
- ✅ US West (Oregon)
- ✅ Asia Pacific (Tokyo)
- ✅ Europe (Ireland)

### Model Support

**Launch time**:
- Amazon Nova
- DeepSeek
- Qwen  
- Meta Llama 3.1 8B Instruct

**More models coming soon!**

---

## 📈 Benefits Summary

| Aspect | Improvement |
|--------|-------------|
| **Time to deploy** | Months → Days |
| **Infrastructure** | Complex → Serverless |
| **Expertise needed** | Deep ML → Basic understanding |
| **Cost model** | Fixed → Pay-per-token |
| **Experiment tracking** | Manual → Auto (MLflow) |
| **Deployment** | Complex → Few clicks |

---

## 🔗 Resources

### Documentation
- [SageMaker Developer Guide](https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html)
- [Model Customization Docs](https://aws.amazon.com/sagemaker/ai/model-customization/)

### Consoles
- [SageMaker Studio](https://console.aws.amazon.com/sagemaker)
- [Bedrock Console](https://console.aws.amazon.com/bedrock)

### Support
- [AWS re:Post](https://repost.aws/tags/TAT80swPyVRPKPcA0rsJYPuA/amazon-sagemaker)
- AWS Support

---

## 💡 Kết Luận

Amazon SageMaker AI Serverless Customization **democratizes model fine-tuning**:

✅ **Rút ngắn thời gian** - Từ tháng xuống ngày  
✅ **Đơn giản hóa** - Chỉ vài click  
✅ **Serverless** - Không lo infrastructure  
✅ **Advanced methods** - DPO, RLVR, RLAIF  
✅ **Auto tracking** - MLflow integrated  
✅ **Flexible deployment** - Bedrock hoặc SageMaker  
✅ **Cost-effective** - Pay-per-token  

**Bắt đầu ngay**: [SageMaker Studio Console](https://console.aws.amazon.com/sagemaker)

---

**Chúc bạn fine-tuning thành công!**  
— **Channy Yun**

---

## 🔗 Bài Viết Liên Quan

1. [SageMaker HyperPod Checkpointless Training](https://cola1605.github.io/posts/aws-sagemaker-hyperpod-checkpointless-elastic-training/)
2. [Bedrock Reinforcement Fine-Tuning](https://cola1605.github.io/posts/amazon-bedrock-reinforcement-fine-tuning/)
3. [Amazon Nova Models](https://aws.amazon.com/nova/)
