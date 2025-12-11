---
title: "Hướng dẫn thực hành tập trung thiết kế vào OpenAPI để quản lý tài liệu thống nhất"
date: 2025-12-09
authors: ["@Mr_hana"]
translator: "Matsuoka"
categories: ["Development", "DevOps and Infrastructure"]
tags: ["OpenAPI", "Mermaid", "API Design", "Documentation", "Redocly"]
source_url: "https://qiita.com/Mr_hana/items/432d83cf2df584c2e651"
level: "intermediate"
---

# Hướng dẫn thực hành tập trung thiết kế vào OpenAPI để quản lý tài liệu thống nhất

## Giới thiệu

Khi phát triển API-first với OpenAPI, bạn nhận được nhiều lợi ích như mock server, tự động generate code, tự động hóa testing. Dần dần, bạn sẽ có mong muốn tập trung tài liệu thiết kế vào một nơi duy nhất.

### Các điểm khó chịu

- **Tài liệu bị phân tách**: Khi thay đổi implementation, dễ quên cập nhật OpenAPI hoặc tài liệu thiết kế
- **Thông tin phân tán**: Khi specification API không đủ để hiểu chi tiết, phải di chuyển qua nhiều tài liệu
- **Chi phí maintenance tăng cao**: Khối lượng công việc để đồng bộ nhiều tài liệu tăng lên

Để giải quyết những vấn đề này, bằng cách ghi thông tin thiết kế vào OpenAPI, bạn có thể đạt được các hiệu quả sau:

- Được hưởng lợi từ version control và review của Git
- Có thể xem với format đẹp bằng các công cụ hiện có mà không cần đấu tranh với việc format tài liệu thiết kế
- Tài liệu được quản lý tập trung, chỉ cần nói với team member "Hãy xem OpenAPI"

Bài viết này sẽ ghi thiết kế bằng Markdown vào field `description` của `paths` trong OpenAPI để tập trung cả thông tin thiết kế vào OpenAPI. Chúng ta hướng tới Single Source of Truth.

### Kiến thức tiên quyết

- Kiến thức cơ bản về OpenAPI Specification 3.0 trở lên
- Kiến thức cơ bản về REST API
- Cú pháp cơ bản của Markdown

### Nội dung bài viết

- Nên viết gì vào field description của OpenAPI
- Biểu diễn phong phú với Mermaid

### Bài viết này không phù hợp với

OpenAPI có chứa thiết kế nên **không phù hợp với phát triển API công khai**. Cách tiếp cận này dành cho team phát triển API nội bộ. Ngoài ra, bài viết không đề cập đến các vấn đề của phát triển API-first.

## Nên viết đến mức nào?

Theo [trang chính thức](https://swagger.io/docs/specification/v3_0/paths-and-operations/#paths), bạn có thể sử dụng CommonMark trong description.

> Paths may have an optional short summary and a longer description for documentation purposes. This information is supposed to be relevant to all operations in this path. description can be multi-line and supports Markdown (CommonMark) for rich text representation.

Hãy tổng hợp thiết kế theo từng endpoint (paths). Tiếp theo, nên viết thiết kế đến mức nào? Tôi đã chuẩn bị các template theo từng cấp độ, hãy chọn phù hợp với trạng thái project và độ phức tạp của implementation.

- **Level 1**: Mô tả chức năng cơ bản
- **Level 2**: Luồng xử lý + Data mapping của response
- **Level 3**: Thiết kế chi tiết với sơ đồ

### Level 1: Mô tả chức năng cơ bản

Truyền đạt nội dung chức năng tối thiểu hoặc CRUD đơn giản.

**Template**

```yaml
get:
  summary: [Tên chức năng]
  description: |

    ## Tổng quan chức năng
    - [Tổng quan 1]
    - [Tổng quan 2]
    - [Tổng quan 3]    

    ## Lưu ý
    - [Lưu ý 1]
    - [Lưu ý 2]
```

**Ví dụ**

```yaml
get:
  summary: Lấy danh sách user
  description: |

    ## Tổng quan chức năng
    - Lấy danh sách user có hỗ trợ pagination.
    - Có thể lọc theo tên user bằng từ khóa tìm kiếm.

    ## Lưu ý
    - Mặc định lấy 20 item mỗi lần
    - Số lượng tối đa là 100 item
```

### Level 2: Luồng xử lý + Data mapping của response

Làm rõ INPUT/OUTPUT của data và cung cấp thông tin bao gồm business logic.

**Template**

```yaml
get:
  summary: [Tên chức năng]
  description: |

    ## Tổng quan chức năng
    - [Tổng quan 1]
    - [Tổng quan 2]
    - [Tổng quan 3]

    ## Luồng xử lý
    1. [Bước 1]
    2. [Bước 2]
    3. [Bước 3]

    ## SQL lấy dữ liệu (nếu có)
    ```sql
    SELECT
      [Cột 1],
      [Cột 2]
    FROM [Tên bảng]
    WHERE [Điều kiện]
    LIMIT $1 OFFSET $2;
    ```

    ## Specification mapping (nếu có)
    | Cột DB | Field Response | Quy tắc chuyển đổi |
    |---------|-------------------|-----------|
    | [column_name] | [fieldName] | [Phương pháp chuyển đổi] |

    ## Error case
    - [Error scenario 1]: [HTTP Status]
    - [Error scenario 2]: [HTTP Status]
```

**Ví dụ**

```yaml
get:
  summary: Lấy danh sách user
  description: |

    ## Tổng quan chức năng
    Lấy danh sách user.
    - Hỗ trợ pagination.
    - Có thể lọc theo tên user bằng từ khóa tìm kiếm.

    ## Luồng xử lý
    1. Validation parameter (page, limit, keyword)
    2. Kiểm tra cache (Redis)
    3. Lấy dữ liệu (hỗ trợ pagination)
    4. Lấy tổng số record (tính toán thông tin pagination)
    5. Format response
    6. Lưu cache (TTL: 5 phút)

    ## SQL lấy dữ liệu
    ```sql
    SELECT
      u.user_id,
      u.username,
      u.email,
      u.display_name,
      u.created_at
    FROM users u
    WHERE u.deleted_at IS NULL
      AND (u.username LIKE $1 OR $1 IS NULL)
    ORDER BY u.created_at DESC
    LIMIT $2 OFFSET $3;
    ```

    ## Specification mapping
    | Cột DB | Field Response | Quy tắc chuyển đổi |
    |---------|-------------------|-----------|
    | user_id | userId | |
    | username | username | |
    | email | email | |
    | display_name | displayName | Chuyển sang camelCase |
    | created_at | createdAt | Format ISO 8601 |

    ## Error case
    - page hoặc limit ngoài phạm vi: 400 Bad Request
    - Lỗi kết nối database: 500 Internal Server Error
```

### Level 3: Thiết kế chi tiết với sơ đồ

Sử dụng Mermaid để visualize business logic phức tạp. Để sử dụng Mermaid cần một số hack, vui lòng tham khảo phần "Vấn đề thường gặp và giải pháp" bên dưới.

**Template**

```yaml
get:
  summary: [Tên chức năng]
  description: |

    ## Tổng quan chức năng
    - [Tổng quan 1]
    - [Tổng quan 2]
    - [Tổng quan 3]  

    <details>
      <summary>Chi tiết xử lý</summary>
      ## Luồng xử lý
      1. [Bước 1]
      2. [Bước 2]
      3. [Bước 3]
  
      ## Sơ đồ luồng xử lý
      <pre class='mermaid'>
      sequenceDiagram
          participant Client
          participant API
          participant Cache
          participant DB
  
          Client->>API: [Request]
          API->>Cache: [Xử lý 1]
  
          alt [Điều kiện 1]
              Cache-->>API: [Kết quả A]
              API-->>Client: [Response A]
          else [Điều kiện 2]
              API->>DB: [Xử lý 2]
              DB-->>API: [Kết quả B]
              API-->>Client: [Response B]
          end
      </pre>
  
      ## Data model
      <pre class='mermaid'>
      erDiagram
          [TABLE1] ||--o{ [TABLE2] : has
          [TABLE2] }o--|| [TABLE3] : "related to"
  
          [TABLE1] {
              uuid id PK
              string name
          }
  
          [TABLE2] {
              uuid id PK
              uuid table1_id FK
          }
      </pre>
  
      ## Error case
      - [Error scenario 1]: [HTTP Status]
    </details>
```

**Ví dụ**

```yaml
get:
  summary: Lấy danh sách comment
  description: |

    ## Tổng quan chức năng
    Lấy danh sách comment liên kết với bài post cụ thể.
    - Kiểm tra sự tồn tại của post.
    - Lấy data comment theo thứ tự thời gian tạo.

    <details>
      <summary>Chi tiết xử lý</summary>
      ## Luồng xử lý
      1. Validation path parameter (postId)
      2. Kiểm tra sự tồn tại của post (sử dụng Redis cache)
      3. Kiểm tra cache (data comment)
      4. Nếu không có cache, thực thi DB query
      5. Lấy thông tin người tạo bằng JOIN (tránh N+1 problem)
      6. Lưu cache (TTL: 3 phút)
      7. Trả về response

      ## Sơ đồ luồng xử lý
      <pre class='mermaid'>
      sequenceDiagram
          participant Client
          participant API
          participant Cache
          participant DB

          Client->>API: GET /posts/{postId}/comments
          API->>Cache: Kiểm tra post tồn tại

          alt Post không tồn tại
              Cache-->>API: Không tồn tại
              API-->>Client: 404 Not Found
          else Post tồn tại
              API->>Cache: Kiểm tra cache comment

              alt Cache hit
                  Cache-->>API: Data cache
                  API-->>Client: 200 OK
              else Cache miss
                  API->>DB: Lấy comment (JOIN)
                  DB-->>API: Data
                  API->>Cache: Lưu cache
                  API-->>Client: 200 OK
              end
          end
      </pre>

      ## Data model
      <pre class='mermaid'>
      erDiagram
          POSTS ||--o{ COMMENTS : has
          COMMENTS }o--|| USERS : "authored by"

          POSTS {
              uuid post_id PK
              string title
              text content
          }

          COMMENTS {
              uuid comment_id PK
              uuid post_id FK
              uuid user_id FK
              text content
          }
      </pre>

      ## Tránh N+1 problem
      Kết hợp bảng comments và bảng users bằng INNER JOIN, lấy thông tin comment và thông tin người tạo trong 1 query.

      ```sql
      SELECT
          c.comment_id,
          c.content,
          u.username,
          u.display_name,
          c.created_at
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      WHERE c.post_id = $1
        AND c.deleted_at IS NULL
      ORDER BY c.created_at ASC
      LIMIT $2 OFFSET $3;
      ```

      ## Yêu cầu performance
      | Scenario | Thời gian mục tiêu |
      |---------|----------|
      | Cache hit | Dưới 10ms |
      | Query thông thường | Dưới 80ms |
      | Comment lớn | Dưới 150ms |
    </details>
```

### Vấn đề thường gặp và giải pháp

#### 1. File size lớn

Vì ghi cả tài liệu thiết kế nên file OpenAPI trở nên lớn, có thể làm editor hoạt động chậm. Hãy tách file bằng `$ref`. ([Tài liệu chính thức](https://swagger.io/docs/specification/v3_0/using-ref/))

```yaml
# openapi.yaml (entry point)
paths:
  /users:
    $ref: './paths/users/index.yaml'
```

```yaml
# paths/users/index.yaml
get:
  summary: Lấy danh sách user
  description: |
    ## Tổng quan chức năng
    Lấy danh sách comment liên kết với bài post cụ thể.

    <details>
      <summary>Xem thiết kế</summary>

      ## Sơ đồ luồng xử lý
      <pre class='mermaid'>
      sequenceDiagram
          participant Client
          participant API
          ...
      </pre>

      ## Data model
      ...
    </details>
```

#### 2. description quá dài cần scroll đến request/response

Khi lượng mô tả thiết kế tăng lên, lượng scroll để xem request/response cũng tăng. Vì không tìm được cách đơn giản để thay đổi thứ tự hiển thị bằng tool, nên sử dụng tag `<details>` để có thể thu gọn.

```yaml
description: |
  ## Tổng quan chức năng
  Lấy danh sách comment liên kết với bài post cụ thể.

  <details>
    <summary>Xem thiết kế</summary>

    ## Sơ đồ luồng xử lý
    <pre class='mermaid'>
    sequenceDiagram
        participant Client
        participant API
        ...
    </pre>

    ## Data model
    ...
  </details>
```

#### 3. Mermaid không được chuyển đổi

Swagger UI chuẩn không chuyển đổi Mermaid để hiển thị. Giải pháp là sử dụng Redocly CLI với custom template. Dùng custom template có tích hợp Mermaid.js để render Mermaid thành sơ đồ khi output HTML. Do đó khi viết mermaid cần bọc trong `<pre class='mermaid'></pre>`. Xin lưu ý rằng không thể viết hoàn toàn bằng Markdown thuần túy.

```yaml
# openapi.yaml (entry point)
paths:
  /users:
    get:
      summary: Lấy danh sách user
      description: |

        ## Sơ đồ luồng xử lý
        <pre class='mermaid'>
        sequenceDiagram
            participant Client
            participant API
            ...
        </pre>
```

**Tạo custom template**

```html
<!-- custom-template.hbs -->
<html>
<head>
  <meta charset='utf8' />
  <title>{{title}}</title>
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <style>
    body { padding: 0; margin: 0; }
    /* Thay đổi màu nền vì mặc định là đen, khó nhìn */
    * pre.mermaid { background-color: #fafafa !important; }
  </style>
    {{{redocHead}}}
    {{#unless disableGoogleFont}}
    <link href='https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700' rel='stylesheet' />
    {{/unless}}
</head>
<body>
  {{{redocHTML}}}
  <script type="module">
    // Import Mermaid library (ref: https://mermaid.js.org/intro/getting-started.html#requirements-for-the-mermaid-api)
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'forest' });
  </script>
</body>
</html>
```

**Lệnh build:**

```bash
npx @redocly/cli build-docs openapi.yaml \
  -o openapi.html \
  -t custom-template.hbs
```

## externalDocs có thể sử dụng được không?

Không phù hợp với mục đích tập trung lần này.

Paths có field [externalDocs](https://swagger.io/docs/specification/v3_0/paths-and-operations/#operations).

> externalDocs – used to reference an external resource that contains additional documentation.

External Documentation Object được định nghĩa với target là URL, giả định quản lý riêng biệt với OpenAPI. Có thể chỉ định relative path nhưng khi output HTML sẽ được xử lý như link nên không thể tích hợp thành tài liệu đơn.

## Hướng dẫn thực hành

Hãy thực sự bắt tay vào làm để triển khai. Có thể bắt đầu ngay với 4 bước sau.

### Bước 1: Copy template

Chọn template phù hợp với project từ level 1~3 ở trên.

1. Chọn template phù hợp với project
2. Paste vào field `description` của file OpenAPI hiện có
3. Thay thế phần `[...]` bằng thông tin API thực tế

**Ví dụ**

```yaml
# openapi.yaml
paths:
  /users:
    get:
      summary: Lấy danh sách user
      description: |
        ## Tổng quan chức năng
        Lấy danh sách user có hỗ trợ pagination.

        ## Luồng xử lý
        1. Validation parameter
        2. Thực thi database query
        3. Format response
```

### Bước 2: Thử với 1 API

Hãy thử viết thiết kế cho 1 API endpoint thực tế. Khuyến nghị bắt đầu từ GET API đơn giản.

1. Viết tổng quan chức năng: Mô tả mục đích API trong 2~3 dòng
2. Viết luồng xử lý: Liệt kê các bước xử lý chính
3. Viết error case: Liệt kê các error scenario dự kiến

**Ví dụ tối thiểu**

```yaml
get:
  summary: Lấy chi tiết user
  description: |
    ## Tổng quan chức năng
    Lấy thông tin user với userId được chỉ định.

    ## Luồng xử lý
    1. Validation UUID của path parameter (userId)
    2. Kiểm tra cache (Redis)
    3. Khi cache miss, lấy thông tin user từ DB
    4. Nếu không tìm thấy thì trả 404 error
    5. Lưu cache (TTL: 10 phút)

    ## Error case
    - userId không đúng format UUID: 400 Bad Request
    - User không tồn tại: 404 Not Found
```

### Bước 3: Kiểm tra bằng HTML generation

Hãy kiểm tra xem thiết kế đã viết có hiển thị đúng không.

#### Khi không dùng Mermaid

Có thể dễ dàng preview bằng VSCode extension hoặc redocly.

**Cách 1: Dùng VSCode extension**

```bash
# Cài extension "Swagger Viewer" trong VSCode
# Mở openapi.yaml và click nút preview ở góc phải trên
```

**Cách 2: Generate HTML bằng redocly**

```bash
npx @redocly/cli build-docs openapi.yaml -o openapi.html
open openapi.html
```

#### Khi dùng Mermaid

**Tạo custom template**

```html
<!-- custom-template.hbs -->
<html>
<head>
  <meta charset='utf8' />
  <title>{{title}}</title>
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <style>
    body { padding: 0; margin: 0; }
    * pre.mermaid { background-color: #fafafa !important; }
  </style>
  {{{redocHead}}}
  {{#unless disableGoogleFont}}
  <link href='https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700' rel='stylesheet' />
  {{/unless}}
</head>
<body>
  {{{redocHTML}}}
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'forest' });
  </script>
</body>
</html>
```

**Generate HTML**

```bash
npx @redocly/cli build-docs openapi.yaml \
  --template custom-template.hbs \
  -o openapi.html

open openapi.html
```

### Bước 4: Chia sẻ và chuẩn hóa trong team

Hãy chuẩn hóa trong team.

1. **Tạo pull request**: Chia sẻ kết quả thử nghiệm với 1 API
2. **Thu thập feedback**: Xác nhận mức độ mô tả có phù hợp không
3. **Chuẩn hóa template**: Tạo template chuẩn cho team
4. **Tích hợp vào review process**: Thêm vào PR checklist

**Ví dụ checklist**

```markdown
## Checklist review OpenAPI description

- [ ] Tổng quan chức năng có được viết trong 2~3 dòng không
- [ ] Luồng xử lý có ít nhất 3 bước không
- [ ] Các error case chính có được liệt kê không
- [ ] SQL có được ghi không (trường hợp lấy dữ liệu)
```

Về chuẩn hóa, hãy tìm cách như dùng GitHub Actions để validate tự động.

## Tổng kết

Lần này tôi đã giới thiệu cách tập trung thiết kế vào OpenAPI. Cuối cùng, hãy tổng hợp các hiệu quả đạt được bằng cách tiếp cận này.

### Hiệu quả đạt được

- **OpenAPI definition làm single source of truth**: API specification và thiết kế được tích hợp trong 1 file, khó xảy ra inconsistency thông tin.
- **Hiển thị đầy đủ khi output HTML**: Generate HTML bằng Swagger UI hoặc redocly không bị thiếu thông tin, không lo link bị broken.
- **Tương thích với version control**: Dễ track lịch sử thay đổi bằng Git, có thể review đồng thời specification và thiết kế trong PR.
- **Hỗ trợ đầy đủ Mermaid**: Có thể hiển thị sơ đồ đẹp bằng custom template của redocly.

---

**Tác giả**: @Mr_hana (Công ty Cổ phần System I)  
**Nguồn**: [Qiita - Hướng dẫn thực hành tập trung thiết kế vào OpenAPI để quản lý tài liệu thống nhất](https://qiita.com/Mr_hana/items/432d83cf2df584c2e651)  
**Dịch giả**: Matsuoka
