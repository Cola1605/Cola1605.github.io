---
title: "Giới thiệu Amazon MWAA Serverless"
date: 2025-11-21
lastmod: 2025-11-24
draft: false
author: "Kazushi Yamamoto"
translator: "日平"
categories: ["AWS", "DevOps and Infrastructure", "Data and Analytics"]
tags: ["Amazon MWAA", "Apache Airflow", "Serverless", "Workflow Orchestration", "AWS", "Data Engineering"]
description: "Khám phá Amazon MWAA Serverless - tùy chọn triển khai mới giúp loại bỏ chi phí vận hành Apache Airflow và tối ưu chi phí thông qua khả năng mở rộng serverless với kiểm soát bảo mật chi tiết qua IAM."
---

# Giới thiệu Amazon MWAA Serverless

**Tác giả:** Kazushi Yamamoto  
**Ngày xuất bản:** 21/11/2025  
**URL gốc:** [Introducing Amazon MWAA Serverless](https://aws.amazon.com/jp/blogs/news/introducing-amazon-mwaa-serverless/)

## Tổng quan

Hôm nay, AWS công bố cung cấp [Amazon Managed Workflows for Apache Airflow](https://aws.amazon.com/jp/managed-workflows-for-apache-airflow/) (MWAA) Serverless. Đây là tùy chọn triển khai mới của MWAA, giúp loại bỏ chi phí vận hành môi trường [Apache Airflow](https://airflow.apache.org/) đồng thời tối ưu hóa chi phí thông qua khả năng mở rộng serverless. Dịch vụ mới này giải quyết các thách thức chính mà các kỹ sư dữ liệu và nhóm DevOps gặp phải trong việc điều phối workflow: khả năng mở rộng vận hành, tối ưu chi phí và quản lý truy cập.

## Tính năng của MWAA Serverless

[MWAA Serverless](https://docs.aws.amazon.com/ja_jp/mwaa/latest/mwaa-serverless-userguide/get-started.html) cho phép bạn tập trung vào logic workflow thay vì phải giám sát dung lượng đã được cấp phát. Bạn có thể gửi workflow Airflow để thực thi theo lịch hoặc on-demand, và chỉ trả tiền cho thời gian tính toán thực tế mà mỗi task được thực thi. Dịch vụ tự động mở rộng toàn bộ hạ tầng, cho phép workflow thực thi hiệu quả bất kể tải công việc.

Ngoài việc đơn giản hóa vận hành, MWAA Serverless giới thiệu [mô hình bảo mật mới](https://docs.aws.amazon.com/ja_jp/mwaa/latest/mwaa-serverless-userguide/get-started.html) thực hiện kiểm soát truy cập chi tiết thông qua [AWS Identity and Access Management](https://aws.amazon.com/jp/iam/) (IAM). Bạn có thể thiết lập quyền IAM riêng cho từng workflow và thực thi mỗi task trên VPC của riêng bạn, cho phép triển khai kiểm soát bảo mật chính xác mà không cần tạo môi trường Airflow riêng biệt. Cách tiếp cận này giúp tăng cường tư thế bảo mật trong khi giảm đáng kể chi phí quản lý bảo mật.

Bài viết này giới thiệu cách xây dựng và triển khai giải pháp tự động hóa workflow có khả năng mở rộng bằng MWAA Serverless. Chúng tôi sẽ trình bày cách tạo và triển khai workflow, thiết lập giám sát bằng [Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/), và các ví dụ thực tế về chuyển đổi Apache Airflow DAGs (Directed Acyclic Graphs) hiện có sang định dạng serverless. Ngoài ra, chúng tôi sẽ khám phá các best practice để quản lý serverless workflow và giới thiệu cách triển khai giám sát và ghi log.

## Cơ chế hoạt động của MWAA Serverless

![Sơ đồ kiến trúc Amazon MWAA Serverless](/images/posts/aws_mwaa_serverless_architecture.png)

MWAA Serverless xử lý định nghĩa workflow, thực thi hiệu quả trong môi trường Airflow được quản lý bởi dịch vụ, và tự động mở rộng tài nguyên dựa trên nhu cầu của workflow. MWAA Serverless sử dụng [Amazon Elastic Container Service](https://aws.amazon.com/jp/ecs/) (Amazon ECS) executor để thực thi mỗi task riêng lẻ trên container ECS Fargate riêng của nó. Điều này có thể được thực hiện trên VPC của khách hàng hoặc VPC được quản lý bởi dịch vụ. Các container này giao tiếp với Airflow cluster được chỉ định bằng Airflow 3 Task API.

MWAA Serverless sử dụng file cấu hình YAML khai báo dựa trên định dạng [DAG Factory](https://github.com/astronomer/dag-factory) mã nguồn mở phổ biến để tăng cường bảo mật thông qua việc cô lập task. Có hai lựa chọn để tạo các định nghĩa workflow này:

1. Viết trực tiếp workflow sử dụng [AWS Managed Operators](https://airflow.apache.org/docs/apache-airflow-providers-amazon/stable/index.html) của Amazon Provider Package vào YAML
2. Sử dụng thư viện [python-to-yaml-dag-converter-mwaa-serverless](https://pypi.org/project/python-to-yaml-dag-converter-mwaa-serverless/) do AWS cung cấp (có sẵn từ [PyPi](https://pypi.org/)) để chuyển đổi DAG dựa trên Python hiện có sang YAML

Cách tiếp cận khai báo này có hai lợi ích chính. Thứ nhất, vì MWAA Serverless đọc định nghĩa workflow từ YAML, nó có thể xác định lịch trình task mà không cần thực thi code workflow. Thứ hai, MWAA Serverless chỉ có thể cấp quyền thực thi khi task được thực thi, do đó không yêu cầu quyền rộng cho toàn bộ workflow. Kết quả là một môi trường an toàn hơn với phạm vi quyền task được giới hạn chính xác và có giới hạn thời gian.

## Các điểm cần xem xét khi sử dụng MWAA Serverless

MWAA Serverless có các giới hạn sau cần xem xét khi lựa chọn giữa triển khai MWAA serverless và provisioned:

### Hỗ trợ Operator

- MWAA Serverless chỉ hỗ trợ các operator của Amazon Provider Package.
- Để thực thi custom code hoặc script, bạn cần sử dụng các dịch vụ AWS như:
  - [AWS Lambda](https://aws.amazon.com/jp/lambda/) để thực thi code Python.
  - [AWS Batch](https://aws.amazon.com/jp/batch/), [Amazon ECS](https://aws.amazon.com/jp/ecs/), [Amazon EKS](https://aws.amazon.com/jp/eks/) cho các thao tác Bash.
  - [AWS Glue](https://aws.amazon.com/jp/glue/) cho kết nối dữ liệu của bên thứ ba.

### Giao diện người dùng

- MWAA Serverless hoạt động mà không sử dụng Airflow UI.
- Để giám sát và quản lý workflow, dịch vụ cung cấp tích hợp với [Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) và [AWS CloudTrail](https://aws.amazon.com/jp/cloudtrail/).

## Sử dụng MWAA Serverless

Để sử dụng MWAA Serverless, vui lòng hoàn thành các điều kiện tiên quyết và các bước sau.

### Điều kiện tiên quyết

Trước khi bắt đầu, hãy đảm bảo các yêu cầu sau được đáp ứng:

#### Quyền truy cập và phân quyền

- [Tài khoản AWS](https://aws.amazon.com/jp/account/)
- [AWS Command Line Interface](https://aws.amazon.com/jp/cli/) (AWS CLI) phiên bản 2.31.38 trở lên đã được cài đặt
- Quyền thích hợp để tạo và chỉnh sửa IAM role và policy. Điều này bao gồm các quyền IAM sau:
  - `airflow-serverless:CreateWorkflow`
  - `airflow-serverless:DeleteWorkflow`
  - `airflow-serverless:GetTaskInstance`
  - `airflow-serverless:GetWorkflowRun`
  - `airflow-serverless:ListTaskInstances`
  - `airflow-serverless:ListWorkflowRuns`
  - `airflow-serverless:ListWorkflows`
  - `airflow-serverless:StartWorkflowRun`
  - `airflow-serverless:UpdateWorkflow`
  - `iam:CreateRole`
  - `iam:DeleteRole`
  - `iam:DeleteRolePolicy`
  - `iam:GetRole`
  - `iam:PutRolePolicy`
  - `iam:UpdateAssumeRolePolicy`
  - `logs:CreateLogGroup`
  - `logs:CreateLogStream`
  - `logs:PutLogEvents`
  - `airflow:GetEnvironment`
  - `airflow:ListEnvironments`
  - `s3:DeleteObject`
  - `s3:GetObject`
  - `s3:ListBucket`
  - `s3:PutObject`
  - `s3:Sync`
- Quyền truy cập vào [Amazon Virtual Private Cloud](https://aws.amazon.com/jp/vpc/) (VPC) có thể kết nối Internet

#### Dịch vụ AWS cần thiết

Ngoài MWAA Serverless, bạn cần quyền truy cập vào các dịch vụ AWS sau:

- Amazon MWAA để truy cập môi trường Airflow hiện có
- Amazon CloudWatch để xem log
- Amazon S3 để quản lý file DAG và YAML
- AWS IAM để kiểm soát quyền

#### Môi trường phát triển

- [Python 3.12](https://www.python.org/downloads/) trở lên đã được cài đặt
- [Amazon Simple Storage Service](https://aws.amazon.com/jp/s3/) (S3) bucket để lưu trữ định nghĩa workflow
- Text editor hoặc IDE để chỉnh sửa file YAML

#### Yêu cầu khác

- Kiến thức cơ bản về các khái niệm Apache Airflow
- Hiểu biết về cú pháp YAML
- Kiến thức về lệnh AWS CLI

**Lưu ý**: Trong suốt bài viết này, chúng tôi sử dụng các giá trị mẫu mà bạn cần thay thế bằng giá trị của riêng mình:

- Thay thế `amzn-s3-demo-bucket` bằng tên S3 bucket của bạn
- Thay thế `111122223333` bằng số tài khoản AWS của bạn
- Thay thế `us-east-2` bằng AWS Region bạn sử dụng. MWAA Serverless có sẵn tại nhiều AWS Region. Để biết tình trạng cung cấp hiện tại, vui lòng kiểm tra [danh sách dịch vụ AWS theo Region](https://aws.amazon.com/jp/about-aws/global-infrastructure/regional-product-services/).

## Tạo workflow serverless đầu tiên

Đầu tiên, hãy định nghĩa một workflow đơn giản để lấy danh sách các object S3 và ghi danh sách đó vào file trong cùng bucket. Tạo file mới có tên `simple_s3_test.yaml` với nội dung sau:

```yaml
simples3test:
  dag_id: simples3test
  schedule: 0 0 * * *
  tasks:
    list_objects:
      operator: airflow.providers.amazon.aws.operators.s3.S3ListOperator
      bucket: 'amzn-s3-demo-bucket'
      prefix: ''
      retries: 0
    create_object_list:
      operator: airflow.providers.amazon.aws.operators.s3.S3CreateObjectOperator
      data: '{{ ti.xcom_pull(task_ids="list_objects", key="return_value") }}'
      s3_bucket: 'amzn-s3-demo-bucket'
      s3_key: 'filelist.txt'
      dependencies: [list_objects]
```

Để thực thi workflow này, bạn cần tạo execution role có quyền liệt kê và ghi vào bucket trên. Role này cũng cần có khả năng được assume từ MWAA Serverless. Tạo role này và policy liên quan bằng các lệnh AWS CLI sau.

```bash
aws iam create-role \
  --role-name mwaa-serverless-access-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": [
            "airflow-serverless.amazonaws.com"
          ]
        },
        "Action": "sts:AssumeRole"
      },
      {
        "Sid": "AllowAirflowServerlessAssumeRole",
        "Effect": "Allow",
        "Principal": {
          "Service": "airflow-serverless.amazonaws.com"
        },
        "Action": "sts:AssumeRole",
        "Condition": {
          "StringEquals": {
            "aws:SourceAccount": "${aws:PrincipalAccount}"
          },
          "ArnLike": {
            "aws:SourceArn": "arn:aws:*:*:${aws:PrincipalAccount}:workflow/*"
          }
        }
      }
    ]
  }'

aws iam put-role-policy \
  --role-name mwaa-serverless-access-role \
  --policy-name mwaa-serverless-policy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "CloudWatchLogsAccess",
        "Effect": "Allow",
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource": "*"
      },
      {
        "Sid": "S3DataAccess",
        "Effect": "Allow",
        "Action": [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject"
        ],
        "Resource": [
          "arn:aws:s3:::amzn-s3-demo-bucket",
          "arn:aws:s3:::amzn-s3-demo-bucket/*"
        ]
      }
    ]
  }'
```

Sau đó, copy YAML DAG vào cùng S3 bucket và tạo workflow dựa trên ARN có trong kết quả thực thi lệnh AWS CLI trên.

```bash
aws s3 cp "simple_s3_test.yaml" \
  s3://amzn-s3-demo-bucket/yaml/simple_s3_test.yaml

aws mwaa-serverless create-workflow \
  --name simple_s3_test \
  --definition-s3-location '{
    "Bucket": "amzn-s3-demo-bucket",
    "ObjectKey": "yaml/simple_s3_test.yaml"
  }' \
  --role-arn arn:aws:iam::111122223333:role/mwaa-serverless-access-role \
  --region us-east-2
```

Output của lệnh AWS CLI tạo workflow cuối cùng trả về giá trị `WorkflowARN`, sử dụng giá trị này để thực thi workflow:

```bash
aws mwaa-serverless start-workflow-run \
  --workflow-arn arn:aws:airflow-serverless:us-east-2:111122223333:workflow/simple_s3_test-abc1234def \
  --region us-east-2
```

Output trả về giá trị `RunId`, có thể sử dụng giá trị đó để kiểm tra trạng thái thực thi của workflow vừa chạy.

```bash
aws mwaa-serverless get-workflow-run \
  --workflow-arn arn:aws:airflow-serverless:us-east-2:111122223333:workflow/simple_s3_test-abc1234def \
  --run-id ABC123456789def \
  --region us-east-2
```

Nếu bạn cần thay đổi YAML, bạn có thể copy lại vào S3 và chạy lệnh `update-workflow`.

```bash
aws s3 cp "simple_s3_test.yaml" \
  s3://amzn-s3-demo-bucket/yaml/simple_s3_test.yaml

aws mwaa-serverless update-workflow \
  --workflow-arn arn:aws:airflow-serverless:us-east-2:111122223333:workflow/simple_s3_test-abc1234def \
  --definition-s3-location '{
    "Bucket": "amzn-s3-demo-bucket",
    "ObjectKey": "yaml/simple_s3_test.yaml"
  }' \
  --role-arn arn:aws:iam::111122223333:role/mwaa-serverless-access-role \
  --region us-east-2
```

## Chuyển đổi Python DAG sang định dạng YAML

AWS công khai một công cụ chuyển đổi sử dụng Airflow DAG processor mã nguồn mở để serialize Python DAG sang định dạng YAML DAG factory. Để cài đặt, chạy lệnh sau:

```bash
pip3 install python-to-yaml-dag-converter-mwaa-serverless
dag-converter convert source_dag.py --output output_yaml_folder
```

Ví dụ, tạo DAG sau và đặt tên là `create_s3_objects.py`:

```python
from datetime import datetime
from airflow import DAG
from airflow.models.param import Param
from airflow.providers.amazon.aws.operators.s3 import S3CreateObjectOperator

default_args = {
    'start_date': datetime(2024, 1, 1),
    'retries': 0,
}

dag = DAG(
    'create_s3_objects',
    default_args=default_args,
    description='Create multiple S3 objects in a loop',
    schedule=None
)

# Set number of files to create
LOOP_COUNT = 3
s3_bucket = 'md-workflows-mwaa-bucket'
s3_prefix = 'test-files'

# Create multiple S3 objects using loop
last_task=None
for i in range(1, LOOP_COUNT + 1):
    create_object = S3CreateObjectOperator(
        task_id=f'create_object_{i}',
        s3_bucket=s3_bucket,
        s3_key=f'{s3_prefix}/{i}.txt',
        data='{{ ds_nodash }}-{{ ts_nodash | lower }}',
        replace=True,
        dag=dag
    )
    if last_task:
        last_task >> create_object
    last_task = create_object
```

Sau khi cài đặt `python-to-yaml-dag-converter-mwaa-serverless`, chạy lệnh sau:

```bash
dag-converter convert "/path_to/create_s3_objects.py" --output "/path_to/yaml/"
```

Output sẽ như sau:

```
YAML validation successful, no errors found
YAML written to /path_to/yaml/create_s3_objects.yaml
```

YAML kết quả sẽ như sau:

```yaml
create_s3_objects:
  dag_id: create_s3_objects
  params: {}
  default_args:
    start_date: '2024-01-01'
    retries: 0
  schedule: None
  tasks:
    create_object_1:
      operator: airflow.providers.amazon.aws.operators.s3.S3CreateObjectOperator
      aws_conn_id: aws_default
      data: '{{ ds_nodash }}-{{ ts_nodash | lower }}'
      encrypt: false
      outlets: []
      params: {}
      priority_weight: 1
      replace: true
      retries: 0
      retry_delay: 300.0
      retry_exponential_backoff: false
      s3_bucket: md-workflows-mwaa-bucket
      s3_key: test-files/1.txt
      task_id: create_object_1
      trigger_rule: all_success
      wait_for_downstream: false
      dependencies: []
    create_object_2:
      operator: airflow.providers.amazon.aws.operators.s3.S3CreateObjectOperator
      aws_conn_id: aws_default
      data: '{{ ds_nodash }}-{{ ts_nodash | lower }}'
      encrypt: false
      outlets: []
      params: {}
      priority_weight: 1
      replace: true
      retries: 0
      retry_delay: 300.0
      retry_exponential_backoff: false
      s3_bucket: md-workflows-mwaa-bucket
      s3_key: test-files/2.txt
      task_id: create_object_2
      trigger_rule: all_success
      wait_for_downstream: false
      dependencies: [create_object_1]
    create_object_3:
      operator: airflow.providers.amazon.aws.operators.s3.S3CreateObjectOperator
      aws_conn_id: aws_default
      data: '{{ ds_nodash }}-{{ ts_nodash | lower }}'
      encrypt: false
      outlets: []
      params: {}
      priority_weight: 1
      replace: true
      retries: 0
      retry_delay: 300.0
      retry_exponential_backoff: false
      s3_bucket: md-workflows-mwaa-bucket
      s3_key: test-files/3.txt
      task_id: create_object_3
      trigger_rule: all_success
      wait_for_downstream: false
      dependencies: [create_object_2]
  catchup: false
  description: Create multiple S3 objects in a loop
  max_active_runs: 16
  max_active_tasks: 16
  max_consecutive_failed_dag_runs: 0
```

Lưu ý rằng do chuyển đổi YAML được thực hiện sau khi parse DAG, vòng lặp for tạo task trong DAG được thực thi trước, và danh sách tĩnh kết quả gồm ba task được ghi vào tài liệu YAML cùng với các dependency của chúng.

## Di chuyển DAG từ MWAA environment sang MWAA Serverless

Sau khi tận dụng MWAA environment đã được provision để phát triển và test workflow, bạn có thể thực thi chúng một cách hiệu quả và có khả năng mở rộng với serverless. Hơn nữa, nếu MWAA environment sử dụng các operator tương thích với MWAA Serverless, bạn có thể chuyển đổi tất cả DAG của environment đó cùng một lúc. Bước đầu tiên là cho phép MWAA Serverless có thể assume MWAA Execution role thông qua trust relationship. Đây là thao tác một lần cho mỗi MWAA Execution role và có thể được thực hiện thủ công trong IAM console hoặc sử dụng lệnh AWS CLI sau:

```bash
MWAA_ENVIRONMENT_NAME="MyAirflowEnvironment"
MWAA_REGION=us-east-2
MWAA_EXECUTION_ROLE_ARN=$(aws mwaa get-environment --region $MWAA_REGION --name $MWAA_ENVIRONMENT_NAME --query 'Environment.ExecutionRoleArn' --output text )
MWAA_EXECUTION_ROLE_NAME=$(echo $MWAA_EXECUTION_ROLE_ARN | xargs basename)
MWAA_EXECUTION_ROLE_POLICY=$(aws iam get-role --role-name $MWAA_EXECUTION_ROLE_NAME --query 'Role.AssumeRolePolicyDocument' --output json | jq '.Statement[0].Principal.Service += ["airflow-serverless.amazonaws.com"] | .Statement[0].Principal.Service |= unique | .Statement += [{"Sid": "AllowAirflowServerlessAssumeRole", "Effect": "Allow", "Principal": {"Service": "airflow-serverless.amazonaws.com"}, "Action": "sts:AssumeRole", "Condition": {"StringEquals": {"aws:SourceAccount": "${aws:PrincipalAccount}"}, "ArnLike": {"aws:SourceArn": "arn:aws:*:*:${aws:PrincipalAccount}:workflow/*"}}}]')
aws iam update-assume-role-policy --role-name $MWAA_EXECUTION_ROLE_NAME --policy-document "$MWAA_EXECUTION_ROLE_POLICY"
```

Bạn có thể lặp qua từng DAG đã được chuyển đổi thành công và tạo serverless workflow cho mỗi DAG.

```bash
S3_BUCKET=$(aws mwaa get-environment --name $MWAA_ENVIRONMENT_NAME --query 'Environment.SourceBucketArn' --output text --region us-east-2 | cut -d':' -f6)
for file in /tmp/yaml/*.yaml ; do
  MWAA_WORKFLOW_NAME=$(basename "$file" .yaml) ; \
  aws s3 cp "$file" s3://$S3_BUCKET/yaml/$MWAA_WORKFLOW_NAME.yaml --region us-east-2 ; \
  aws mwaa-serverless create-workflow --name $MWAA_WORKFLOW_NAME \
    --definition-s3-location "{\"Bucket\": \"$S3_BUCKET\", \"ObjectKey\": \"yaml/$MWAA_WORKFLOW_NAME.yaml\"}" \
    --role-arn $MWAA_EXECUTION_ROLE_ARN \
    --region us-east-2
done
```

Để hiển thị danh sách các workflow đã tạo, chạy lệnh sau:

```bash
aws mwaa-serverless list-workflows --region us-east-2
```

## Giám sát và trực quan hóa

![Màn hình quản lý workflow trong MWAA Serverless console](/images/posts/aws_mwaa_serverless_console.png)

Trạng thái thực thi workflow của MWAA serverless được trả về bởi API `GetWorkflowRun`. Kết quả bao gồm chi tiết về lần thực thi cụ thể đó. Nếu có lỗi trong định nghĩa workflow, nó sẽ được trả về trong trường `ErrorMessage` của `RunDetail` như ví dụ sau:

```json
{
  "WorkflowVersion": "7bcd36ce4d42f5cf23bfee67a0f816c6",
  "RunId": "d58cxqdClpTVjeN",
  "RunType": "SCHEDULE",
  "RunDetail": {
    "ModifiedAt": "2025-11-03T08:02:47.625851+00:00",
    "ErrorMessage": "expected token ',', got 'create_test_table'",
    "TaskInstances": [],
    "RunState": "FAILED"
  }
}
```

Workflow được định nghĩa đúng nhưng task thất bại sẽ trả về `"ErrorMessage": "Workflow execution failed"`:

```json
{
  "WorkflowVersion": "0ad517eb5e33deca45a2514c0569079d",
  "RunId": "ABC123456789def",
  "RunType": "SCHEDULE",
  "RunDetail": {
    "StartedOn": "2025-11-03T13:12:09.904466+00:00",
    "CompletedOn": "2025-11-03T13:13:57.620605+00:00",
    "ModifiedAt": "2025-11-03T13:16:08.888182+00:00",
    "Duration": 107,
    "ErrorMessage": "Workflow execution failed",
    "TaskInstances": [
      "ex_5496697b-900d-4008-8d6f-5e43767d6e36_create_bucket_1"
    ],
    "RunState": "FAILED"
  }
}
```

Log task của MWAA Serverless được lưu trữ trong CloudWatch log group `/aws/mwaa-serverless/<workflow id>/` (trong đó `/<workflow id>` là cùng chuỗi với unique workflow ID của workflow ARN). Để lấy log stream của một task cụ thể, bạn cần liệt kê các task của workflow đã thực thi và lấy thông tin của từng task. Bạn có thể kết hợp các thao tác này trong một lệnh CLI duy nhất.

```bash
aws mwaa-serverless list-task-instances \
  --workflow-arn arn:aws:airflow-serverless:us-east-2:111122223333:workflow/simple_s3_test-abc1234def \
  --run-id ABC123456789def \
  --region us-east-2 \
  --query 'TaskInstances[].TaskInstanceId' \
  --output text | xargs -n 1 -I {} aws mwaa-serverless get-task-instance \
  --workflow-arn arn:aws:airflow-serverless:us-east-2:111122223333:workflow/simple_s3_test-abc1234def \
  --run-id ABC123456789def \
  --task-instance-id {} \
  --region us-east-2 \
  --query '{Status: Status, StartedAt: StartedAt, LogStream: LogStream}'
```

Kết quả thực thi sẽ như sau:

```json
{
  "Status": "SUCCESS",
  "StartedAt": "2025-10-28T21:21:31.753447+00:00",
  "LogStream": "workflow_id=simple_s3_test-abc1234def/run_id=ABC123456789def/task_id=list_objects/attempt=1.log"
}
{
  "Status": "FAILED",
  "StartedAt": "2025-10-28T21:23:13.446256+00:00",
  "LogStream": "workflow_id=simple_s3_test-abc1234def/run_id=ABC123456789def/task_id=create_object_list/attempt=1.log"
}
```

Tại thời điểm đó, bạn có thể debug workflow bằng output `LogStream` của CloudWatch. Bạn có thể xem và quản lý workflow trong [Amazon MWAA Serverless console](https://ap-northeast-1.console.aws.amazon.com/mwaa/home#serverlessWorkflows).

Để biết ví dụ về cách tạo metric chi tiết và dashboard giám sát sử dụng AWS Lambda, Amazon CloudWatch, [Amazon DynamoDB](https://aws.amazon.com/jp/dynamodb/), và [Amazon EventBridge](https://aws.amazon.com/jp/eventbridge/), vui lòng tham khảo ví dụ trong [GitHub repository này](https://github.com/aws-samples/amazon-mwaa-examples/tree/main/serverless/mwaa_serverless_metrics_dashboard).

## Dọn dẹp tài nguyên

Để xóa tất cả tài nguyên đã tạo trong hướng dẫn này và tránh chi phí liên tục, vui lòng thực hiện các bước sau:

1. **Xóa MWAA Serverless workflow** – Để xóa tất cả workflow, chạy lệnh AWS CLI sau:

```bash
aws mwaa-serverless list-workflows --query 'Workflows[*].WorkflowArn' --output text | while read -r workflow ; do
  aws mwaa-serverless delete-workflow --workflow-arn $workflow
done
```

2. **Xóa IAM role và policy đã tạo trong hướng dẫn này:**

```bash
aws iam delete-role-policy --role-name mwaa-serverless-access-role --policy-name mwaa-serverless-policy
```

3. **Xóa định nghĩa workflow YAML từ S3 bucket:**

```bash
aws s3 rm s3://amzn-s3-demo-bucket/yaml/ --recursive
```

Sau khi hoàn thành các bước này, hãy xác nhận trong AWS Management Console rằng tất cả tài nguyên đã được xóa đúng cách. CloudWatch Logs được giữ lại theo mặc định, vì vậy nếu bạn muốn xóa tất cả dấu vết thực thi workflow, bạn cần xóa riêng.

Nếu gặp lỗi, hãy xác nhận rằng bạn có các quyền cần thiết và tài nguyên tồn tại trước khi thử xóa. Một số tài nguyên có thể có dependency cần được xóa theo thứ tự cụ thể.

## Kết luận

Bài viết này đã giải thích về Amazon MWAA Serverless, một tùy chọn triển khai mới đơn giản hóa quản lý Apache Airflow workflow. Chúng tôi đã trình bày cách tạo workflow bằng định nghĩa YAML, cách chuyển đổi Python DAG hiện có sang định dạng serverless, và cách giám sát workflow.

MWAA Serverless có các lợi ích chính sau:

- Không có chi phí provisioning
- Mô hình trả theo sử dụng
- Tự động mở rộng dựa trên nhu cầu workflow
- Bảo mật được tăng cường với IAM permission chi tiết
- Định nghĩa workflow được đơn giản hóa bằng YAML

Để biết thêm chi tiết về MWAA Serverless, vui lòng tham khảo [tài liệu](https://docs.aws.amazon.com/ja_jp/mwaa/latest/mwaa-serverless-userguide/what-is-mwaa-serverless.html).

---

## Về tác giả

![Principal Product Manager John Jackson](/images/posts/aws_mwaa_serverless_author.jpeg)

**[John](https://www.linkedin.com/in/johnjacksonpm/)** là AWS Principal Product Manager phụ trách Amazon MWAA, với hơn 25 năm kinh nghiệm phần mềm với vai trò developer, system architect, và product manager tại cả startup và doanh nghiệp lớn.

---

**Người dịch:** Cloud Support Engineer Yamamoto
