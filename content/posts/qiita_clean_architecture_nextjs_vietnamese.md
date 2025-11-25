---
title: "Series: Cấu trúc Thư mục Frontend (NextJS/ReactJS) trong Thời đại AI - Phần 2: Clean Architecture"
date: 2025-11-24T00:00:00Z
draft: false
categories: ["Development"]
tags: ["AI", "React", "pattern", "Next.js", "Clean Architecture", "TypeScript", "Frontend", "Best Practices"]
author: "TOMOSIA-HieuNT"
source: "Qiita"
source_url: "https://qiita.com/TOMOSIA-HieuNT/items/ae0642e32156ea2d8d36"
---

## Tóm tắt

Bài viết này giải thích chi tiết cách giải quyết vấn đề tổ chức code khi sử dụng AI assistants (Cursor, Claude, GitHub Copilot) trong các dự án Next.js/React quy mô lớn bằng Clean Architecture và file `.cursorrules`. Tiếp cận thực tế trong môi trường có hơn 10 developer, hơn 1000 files, và review hơn 20 PRs mỗi ngày.

---

## 1. Giới thiệu: Vấn đề Thực tế và Giải pháp

### Bối cảnh Dự án

Tôi đang làm việc trong một dự án frontend quy mô lớn:

- **Quy mô team**: Hơn 10 developers
- **Codebase**: Hơn 1000 files
- **Khối lượng công việc**: Review hơn 20 PRs mỗi ngày

![Tổng quan Clean Architecture](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4240966%2F7160f0f2-a78b-4a70-84c0-4b1fd825780c.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=17ec59665cd3be7dbb5e2a3f44142f05)

### Vấn đề: Code Không Đồng bộ khi Sử dụng AI

Toàn bộ thành viên trong team đều sử dụng AI assistants (Cursor, Claude, GitHub Copilot) để tăng tốc độ phát triển. Tuy nhiên, chúng tôi gặp phải vấn đề nghiêm trọng:

- **Code không đồng bộ**: Mỗi developer có cách tổ chức code khác nhau, AI gợi ý code theo các pattern khác nhau
- **Khó bảo trì**: Business logic nằm rải rác, không biết nên đặt code ở đâu
- **Khó mở rộng**: Phải sửa nhiều chỗ để thêm tính năng mới, dễ xảy ra conflict
- **Review chậm**: Không biết code thuộc layer nào, mất nhiều thời gian review

### Giải pháp: Clean Architecture + AI Rules

Chúng tôi đã giải quyết vấn đề bằng sự kết hợp Clean Architecture và file `.cursorrules`:

- ✅ **Code đồng bộ**: Tất cả developers và AI đều tuân theo cùng một architecture pattern
- ✅ **Dễ bảo trì**: Cấu trúc rõ ràng, biết chính xác nên đặt code ở đâu
- ✅ **Dễ mở rộng**: Thêm tính năng mới không ảnh hưởng đến code hiện tại
- ✅ **Review nhanh**: Rõ ràng mỗi file thuộc layer nào, review hiệu quả

### Mục đích Bài viết

Trong bài viết này, tôi sẽ chia sẻ cách áp dụng Clean Architecture vào dự án eCommerce sử dụng Next.js 16 và Stripe. Bao gồm:

- Cấu trúc thư mục và các layer
- Quy tắc code và best practices
- File `.cursorrules` để AI hiểu architecture
- Các pattern và flow thực tế
- Checklist cho code thân thiện với AI

> **Lưu ý**: Bài viết này là phần 1 của series về frontend architecture trong thời đại AI. Các ví dụ code được đơn giản hóa để dễ hiểu nhưng vẫn phản ánh chính xác các nguyên tắc cốt lõi.

---

## 2. Bối cảnh Dự án và Công nghệ Sử dụng

### 2.1. Bối cảnh Dự án

Dự án của chúng tôi là một ứng dụng eCommerce cho phép người dùng:

- **Xem sản phẩm**: Hiển thị danh sách sản phẩm, tìm kiếm, lọc theo danh mục
- **Quản lý giỏ hàng**: Thêm/xóa sản phẩm, cập nhật số lượng
- **Đặt hàng**: Tạo đơn hàng với thông tin giao hàng
- **Thanh toán**: Tích hợp Stripe để xử lý thanh toán an toàn
- **Quản lý đơn hàng**: Xem lịch sử đơn hàng, theo dõi trạng thái

Đây là một dự án phức tạp với nhiều business logic, tích hợp với các dịch vụ bên ngoài (Stripe, email service), và cần đảm bảo bảo mật cao khi xử lý thanh toán.

### 2.2. Công nghệ Sử dụng

#### Framework Core và Ngôn ngữ

- **Next.js 16**: React framework với App Router, Server Components, Server Actions
- **TypeScript 5**: Type safety và developer experience tốt
- **React 18**: UI library với hỗ trợ Server Components

#### UI và Styling

- **Shadcn UI**: Component library dựa trên Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Quản lý form state và validation
- **Zod**: Schema validation cho TypeScript

#### Quản lý State và Data

- **Drizzle ORM**: Type-safe SQL query builder
- **Lucia Auth**: Authentication library
- **Dependency Injection**: Sử dụng `@evyweb/ioctopus` cho IoC container

#### Tích hợp Thanh toán

- **Stripe**: Xử lý thanh toán
- **Stripe Elements**: Secure payment form components

#### Development Tools

- **ESLint**: Code linting với `eslint-plugin-boundaries` để enforce architecture rules
- **Prettier**: Code formatting
- **Knip**: Phát hiện unused code và dependencies
- **Vitest**: Unit testing framework
- **Commitlint**: Enforce conventional commits
- **Husky**: Git hooks

#### Monitoring và Error Tracking

- **Sentry**: Error tracking và performance monitoring

---

## 3. Giải thích và Thiết kế Clean Architecture trong Frontend

### 3.1. Clean Architecture là gì?

Clean Architecture là một phương pháp tổ chức code dựa trên nguyên tắc separation of concerns (tách biệt các mối quan tâm). Architecture này chia ứng dụng thành các layer (tầng) với trách nhiệm rõ ràng và các quy tắc dependency chặt chẽ.

> **Nguồn**: [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

**Mục tiêu chính của Clean Architecture**:

- **Độc lập với framework**: Business logic không phụ thuộc vào React, Next.js, hay bất kỳ framework nào
- **Độc lập với UI**: Thay đổi UI từ Web sang Mobile không ảnh hưởng business logic
- **Độc lập với database**: Chuyển từ SQLite sang PostgreSQL không cần thay đổi use cases
- **Testable**: Business logic có thể test độc lập mà không cần mock UI hay database
- **Độc lập với external services**: Đổi payment provider từ Stripe sang PayPal không ảnh hưởng core logic

### 3.2. Cấu trúc Thư mục Dự án

Trước khi xem chi tiết từng layer, hãy xem cấu trúc thư mục thực tế của dự án:

```
nextjs-16-clean-architecture/
├── app/                                    # Frameworks & Drivers Layer
│   ├── (auth)/                            # Route group cho authentication
│   │   ├── sign-in/
│   │   │   └── page.tsx                   # Trang sign in
│   │   ├── sign-up/
│   │   │   └── page.tsx                   # Trang sign up
│   │   └── actions.ts                     # Server Actions cho auth
│   ├── _components/                       # Shared UI components
│   │   ├── ui/                            # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── theme-provider.tsx
│   │   └── utils.ts                       # Utility functions (cn, etc.)
│   ├── actions.ts                         # Server Actions
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Home page
│   └── globals.css                        # Global styles
│
├── src/                                    # Core application code
│   ├── entities/                          # Entities Layer (Domain)
│   │   ├── models/                        # Domain models
│   │   │   ├── order.ts                   # Order domain model
│   │   │   ├── product.ts                 # Product domain model
│   │   │   ├── user.ts                    # User domain model
│   │   │   └── ...
│   │   └── errors/                        # Custom domain errors
│   │       ├── orders.ts                  # Order-related errors
│   │       ├── payment.ts                # Payment-related errors
│   │       └── common.ts                  # Common errors
│   │
│   ├── application/                       # Application Layer
│   │   ├── use-cases/                    # Business use cases
│   │   │   ├── orders/
│   │   │   │   ├── create-order.use-case.ts
│   │   │   │   ├── cancel-order.use-case.ts
│   │   │   │   └── get-orders-for-user.use-case.ts
│   │   │   ├── payment/
│   │   │   │   ├── process-payment.use-case.ts
│   │   │   │   └── refund-payment.use-case.ts
│   │   │   └── auth/
│   │   │       ├── sign-in.use-case.ts
│   │   │       ├── sign-up.use-case.ts
│   │   │       └── sign-out.use-case.ts
│   │   ├── repositories/                 # Repository interfaces
│   │   │   ├── orders.repository.interface.ts
│   │   │   ├── products.repository.interface.ts
│   │   │   └── users.repository.interface.ts
│   │   └── services/                      # Service interfaces
│   │       ├── payment.service.interface.ts
│   │       ├── authentication.service.interface.ts
│   │       └── instrumentation.service.interface.ts
│   │
│   ├── infrastructure/                    # Infrastructure Layer
│   │   ├── repositories/                 # Repository implementations
│   │   │   ├── orders.repository.ts      # Database operations for orders
│   │   │   ├── orders.repository.mock.ts # Mock for testing
│   │   │   ├── products.repository.ts
│   │   │   └── users.repository.ts
│   │   └── services/                      # Service implementations
│   │       ├── payment.service.ts        # Stripe integration
│   │       ├── payment.service.mock.ts   # Mock for testing
│   │       ├── authentication.service.ts
│   │       └── instrumentation.service.ts
│   │
│   └── interface-adapters/               # Interface Adapters Layer
│       └── controllers/                  # Controllers
│           ├── orders/
│           │   ├── create-order.controller.ts
│           │   ├── cancel-order.controller.ts
│           │   └── get-orders-for-user.controller.ts
│           ├── payment/
│           │   ├── process-payment.controller.ts
│           │   └── refund-payment.controller.ts
│           └── auth/
│               ├── sign-in.controller.ts
│               ├── sign-up.controller.ts
│               └── sign-out.controller.ts
│
├── di/                                     # Dependency Injection
│   ├── container.ts                       # DI container setup
│   ├── types.ts                           # DI symbols/types
│   └── modules/                           # DI modules
│       ├── orders.module.ts              # Orders DI configuration
│       ├── payment.module.ts            # Payment DI configuration
│       ├── authentication.module.ts     # Auth DI configuration
│       └── ...
│
├── drizzle/                               # Database
│   ├── schema.ts                         # Database schema definition
│   ├── index.ts                          # Database client setup
│   └── migrations/                       # Database migrations
│
├── tests/                                 # Unit tests
│   └── unit/
│       ├── application/
│       │   └── use-cases/
│       ├── infrastructure/
│       │   └── repositories/
│       └── interface-adapters/
│           └── controllers/
```

**Các điểm quan trọng về cấu trúc**:

1. `app/`: Chứa tất cả code liên quan đến Next.js (pages, components, Server Actions). Đây là layer ngoài cùng, phụ thuộc vào framework.

2. `src/`: Chứa tất cả business logic, được tổ chức theo các layer của Clean Architecture:
   - `entities/`: Domain models và business rules (không phụ thuộc vào gì)
   - `application/`: Use cases và interfaces (phụ thuộc vào entities)
   - `infrastructure/`: Implementations (phụ thuộc vào application và entities)
   - `interface-adapters/`: Controllers (phụ thuộc vào application và entities)

3. `di/`: Dependency Injection container và modules để kết nối các dependencies.

4. `drizzle/`: Database schema và migrations (infrastructure concerns).

5. `tests/`: Unit tests được tổ chức giống cấu trúc `src/`.

### 3.3. Cấu trúc Layer trong Frontend

![Sơ đồ Cấu trúc Layer](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4240966%2F78e1391e-3e8e-43f5-96df-30c639849755.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=47148be43c2c6b)

Trong dự án của chúng tôi, Clean Architecture được tổ chức thành 4 layer chính:

```
┌─────────────────────────────────────────┐
│   Frameworks & Drivers Layer (app/)      │
│   - Next.js Pages, Components           │
│   - Server Actions, Route Handlers      │
│   - UI Components (Shadcn UI)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Interface Adapters Layer              │
│   (src/interface-adapters/)             │
│   - Controllers                         │
│   - Input Validation                    │
│   - Output Formatting (Presenters)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Application Layer                     │
│   (src/application/)                    │
│   - Use Cases                           │
│   - Repository Interfaces               │
│   - Service Interfaces                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Entities Layer                        │
│   (src/entities/)                       │
│   - Domain Models                       │
│   - Business Rules                      │
│   - Custom Errors                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Infrastructure Layer                  │
│   (src/infrastructure/)                 │
│   - Repository Implementations          │
│   - Service Implementations             │
│   - External API Clients (Stripe)       │
└─────────────────────────────────────────┘
```

#### 3.3.1. Entities Layer (Domain Layer)

**Vị trí**: `src/entities/`

Đây là layer trong cùng, chứa các business entities và business rules cốt lõi. Layer này hoàn toàn độc lập với bất kỳ framework hay library nào.

**Ví dụ trong dự án eCommerce**:

```typescript
// src/entities/models/order.ts
import { z } from 'zod';

export const orderStatusSchema = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(orderItemSchema),
  totalAmount: z.number().positive(),
  status: orderStatusSchema,
  shippingAddress: addressSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;

// Business rule: Tổng tiền đơn hàng phải khớp với tổng các items
export function validateOrderTotal(order: Order): boolean {
  const calculatedTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return Math.abs(calculatedTotal - order.totalAmount) < 0.01;
}
```

**Đặc điểm**:
- Chỉ chứa plain TypeScript/JavaScript, không có external dependencies
- Định nghĩa data structures và validation rules
- Có thể được sử dụng bởi bất kỳ layer nào ở trên

#### 3.3.2. Application Layer

**Vị trí**: `src/application/`

Layer này chứa các use cases (business logic) và các interfaces cho repositories và services. Đây là nơi định nghĩa "ứng dụng có thể làm gì".

**Use Cases**:

Mỗi use case đại diện cho một business operation cụ thể. Ví dụ:

```typescript
// src/application/use-cases/orders/create-order.use-case.ts
export const createOrderUseCase =
  (
    ordersRepository: IOrdersRepository,
    paymentService: IPaymentService,
    inventoryService: IInventoryService
  ) =>
  async (input: {
    userId: string;
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: Address;
  }): Promise<Order> => {
    // 1. Validate inventory
    const inventoryCheck = await inventoryService.checkAvailability(
      input.items
    );
    if (!inventoryCheck.isAvailable) {
      throw new InventoryError('Some items are out of stock');
    }

    // 2. Calculate total
    const totalAmount = await calculateOrderTotal(input.items);

    // 3. Create payment intent với Stripe
    const paymentIntent = await paymentService.createPaymentIntent({
      amount: totalAmount,
      currency: 'usd',
      metadata: { userId: input.userId },
    });

    // 4. Create order
    const order = await ordersRepository.createOrder({
      userId: input.userId,
      items: input.items,
      totalAmount,
      shippingAddress: input.shippingAddress,
      paymentIntentId: paymentIntent.id,
      status: 'pending',
    });

    return order;
  };
```

**Interfaces**:

Layer này định nghĩa các interfaces (contracts) mà các layer bên ngoài phải implement:

```typescript
// src/application/repositories/orders.repository.interface.ts
export interface IOrdersRepository {
  createOrder(order: CreateOrderInput): Promise<Order>;
  getOrderById(orderId: string): Promise<Order | null>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
}

// src/application/services/payment.service.interface.ts
export interface IPaymentService {
  createPaymentIntent(input: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
  }): Promise<PaymentIntent>;

  confirmPayment(paymentIntentId: string): Promise<PaymentResult>;
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>;
}
```

**Đặc điểm**:
- Use cases orchestrate operations, không implement chi tiết
- Sử dụng interfaces, không phải concrete implementations
- Dependency Injection được sử dụng để inject dependencies

#### 3.3.3. Interface Adapters Layer

**Vị trí**: `src/interface-adapters/`

Layer này chứa các controllers (entry points của hệ thống). Controllers có các trách nhiệm:

1. **Input validation**: Validate và parse input từ UI
2. **Authentication/Authorization**: Kiểm tra quyền truy cập
3. **Orchestration**: Gọi use case phù hợp
4. **Output formatting**: Format data trước khi trả về UI

**Ví dụ Controller**:

```typescript
// src/interface-adapters/controllers/orders/create-order.controller.ts
export const createOrderController =
  (
    instrumentationService: IInstrumentationService,
    createOrderUseCase: ICreateOrderUseCase,
    getCurrentUser: () => Promise<{ id: string }>
  ) =>
  async (
    input: Partial<z.infer<typeof createOrderInputSchema>>
  ): Promise<{ order: Order; clientSecret: string }> => {
    return await instrumentationService.startSpan(
      { name: 'createOrder Controller' },
      async () => {
        // 1. Validate input
        const { data, error: parseError } =
          createOrderInputSchema.safeParse(input);
        if (parseError) {
          throw new InputParseError('Invalid order data', {
            cause: parseError,
          });
        }

        // 2. Get authenticated user
        const user = await getCurrentUser();

        // 3. Call use case
        const order = await createOrderUseCase({
          userId: user.id,
          items: data.items,
          shippingAddress: data.shippingAddress,
        });

        // 4. Format output (Presenter pattern)
        return {
          order: {
            id: order.id,
            status: order.status,
            totalAmount: order.totalAmount,
            items: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          clientSecret: order.paymentIntent.clientSecret,
        };
      }
    );
  };
```

**Đặc điểm**:
- Controllers không chứa business logic, chỉ orchestrate
- Xử lý các framework-specific concerns (form data, cookies, etc.)
- Convert data giữa UI format và domain format

### 3.4. Dependency Injection (DI)

Để cho phép các layer sử dụng interfaces thay vì concrete implementations, chúng ta sử dụng Dependency Injection:

```typescript
// di/modules/orders.module.ts
// Register implementations
container.bind('IOrdersRepository', () => new OrdersRepository());
container.bind('IPaymentService', () => new StripePaymentService());

// Register use cases
container.bind('ICreateOrderUseCase', () => {
  const ordersRepo = container.get('IOrdersRepository');
  const paymentService = container.get('IPaymentService');
  const inventoryService = container.get('IInventoryService');

  return createOrderUseCase(ordersRepo, paymentService, inventoryService);
});

// Register controllers
container.bind('ICreateOrderController', () => {
  const instrumentationService = container.get('IInstrumentationService');
  const createOrderUseCase = container.get('ICreateOrderUseCase');

  return createOrderController(
    instrumentationService,
    createOrderUseCase,
    getCurrentUser
  );
});
```

### 3.5. Quy tắc Dependency

Điều quan trọng nhất trong Clean Architecture là quy tắc dependency:

> **Dependencies chỉ chảy từ ngoài vào trong, không bao giờ ngược lại**

```
app/ (Frameworks)
  ↓ uses
interface-adapters/ (Controllers)
  ↓ uses
application/ (Use Cases)
  ↓ uses
entities/ (Models)
  ↑ implements
infrastructure/ (Repositories, Services)
```

Để enforce quy tắc này, chúng ta sử dụng ESLint plugin:

```json
// .eslintrc.json
{
  "plugins": ["boundaries"],
  "rules": {
    "boundaries/element-types": [
      2,
      {
        "default": "disallow",
        "rules": [
          {
            "from": ["app"],
            "allow": ["controllers", "models", "errors"]
          },
          {
            "from": ["src/interface-adapters"],
            "allow": ["use-cases", "models", "errors"]
          },
          {
            "from": ["src/application"],
            "allow": ["models", "errors", "repositories", "services"]
          },
          {
            "from": ["src/infrastructure"],
            "allow": ["models", "errors"]
          }
        ]
      }
    ]
  }
}
```

### 3.6. Flow Xử lý Request Hoàn chỉnh

Hãy xem một request "Tạo đơn hàng" được xử lý qua các layer như thế nào:

```
1. User submits form
   ↓
2. app/orders/create/page.tsx (Component)
   - Thu thập form data
   - Gọi Server Action
   ↓
3. app/orders/actions.ts (Server Action)
   - Parse FormData
   - Lấy controller từ DI container
   - Gọi controller
   ↓
4. src/interface-adapters/controllers/orders/create-order.controller.ts
   - Validate input với Zod
   - Kiểm tra authentication
   - Gọi use case
   - Format output
   ↓
5. src/application/use-cases/orders/create-order.use-case.ts
   - Orchestrate business logic:
     * Kiểm tra inventory
     * Tính tổng tiền
     * Tạo payment intent
     * Tạo order
   - Sử dụng repository và service interfaces
   ↓
6. src/infrastructure/repositories/orders.repository.ts
   - Thực thi database query
   - Map DB format sang domain model
   ↓
7. src/infrastructure/services/payment.service.ts
   - Gọi Stripe API
   - Map Stripe response sang domain format
   ↓
8. Response chảy ngược lại qua các layers
   - Controller format data
   - Server Action xử lý response
   - Component cập nhật UI
```

---

## 4. Ưu điểm và Nhược điểm

### 4.1. Ưu điểm

#### ✅ Tính độc lập và Linh hoạt

- **Độc lập với framework**: Chuyển từ Next.js sang Remix hoặc React Native mà không thay đổi business logic
- **Dễ thay đổi infrastructure**: Đổi từ Stripe sang PayPal, hoặc SQLite sang PostgreSQL chỉ cần thay đổi implementation
- **Testable**: Có thể test từng layer độc lập với mock

#### ✅ Dễ bảo trì

- **Tổ chức code rõ ràng**: Tất cả developers đều biết nên đặt code ở đâu
- **Tách biệt concerns**: Mỗi layer có trách nhiệm rõ ràng, dễ hiểu và bảo trì
- **Khả năng mở rộng**: Dễ thêm tính năng mới mà không ảnh hưởng code hiện tại

#### ✅ Cộng tác Team

- **Phát triển song song**: Nhiều developers có thể làm việc đồng thời trên các layer khác nhau
- **Onboarding**: Developers mới dễ hiểu cấu trúc dự án
- **Code review**: Rõ ràng mỗi file thuộc layer nào, review hiệu quả

#### ✅ Type Safety với TypeScript

- **Interfaces là contracts**: Input/output của mỗi component rõ ràng
- **Compile-time errors**: Phát hiện lỗi trước khi chạy code

### 4.2. Nhược điểm

#### ❌ Đường cong học tập

- **Phức tạp ban đầu**: Developers mới mất thời gian hiểu architecture
- **Over-engineering**: Có thể quá phức tạp cho dự án nhỏ
- **Boilerplate code**: Phải viết nhiều code hơn (interfaces, DI setup, etc.)

#### ❌ Performance Overhead

- **Indirection**: Nhiều layers có thể chậm hơn một chút (thường không đáng kể)
- **Bundle size**: Nhiều abstraction có thể tăng bundle size (có thể optimize)

#### ❌ Tốc độ phát triển

- **Chậm ban đầu**: Mất thời gian setup và viết initial code
- **Cần kỷ luật**: Team phải tuân theo architecture rules, không được "shortcuts"

#### ❌ Không phù hợp với mọi dự án

- **Dự án nhỏ**: Có thể overkill cho MVP hoặc prototypes
- **CRUD apps đơn giản**: Không cần thiết nếu app rất simple

### 4.3. Khi nào nên sử dụng Clean Architecture

**Nên sử dụng khi**:

- ✅ Dự án lớn, phức tạp với nhiều business logic
- ✅ Team lớn, cần collaboration tốt
- ✅ Dự án dài hạn, cần maintain lâu dài
- ✅ Cần tích hợp nhiều external services
- ✅ Cần test coverage cao
- ✅ Có khả năng thay đổi tech stack trong tương lai

**Không nên sử dụng khi**:

- ❌ MVP hoặc prototype cần ra mắt nhanh
- ❌ Dự án nhỏ, đơn giản
- ❌ Team nhỏ, không có kinh nghiệm với architecture patterns
- ❌ Deadline gấp, không có thời gian setup

---

## 5. Quy tắc Code và Best Practices

### 5.1. Checklist Quy tắc Code

#### 📁 Quy tắc Cấu trúc File

**Entities Layer** (`src/entities/`)
- Models: `{entity}.ts` (ví dụ: `order.ts`)
- Errors: `{domain}.ts` (ví dụ: `orders.ts`)
- Không import bất kỳ framework/library nào

**Application Layer** (`src/application/`)
- Use cases: `{action}-{entity}.use-case.ts`
- Interfaces: `{name}.interface.ts`
- Chỉ import từ `entities/`

**Infrastructure Layer** (`src/infrastructure/`)
- Repositories: `{entity}.repository.ts`
- Services: `{purpose}.service.ts`
- Implement interfaces từ `application/`

**Interface Adapters Layer** (`src/interface-adapters/`)
- Controllers: `{action}-{entity}.controller.ts`
- Chỉ gọi use cases, không gọi trực tiếp repositories/services

#### 🎯 Quy tắc Use Cases

**1 use case = 1 business operation**

```typescript
// ✅ Good
createOrderUseCase();
cancelOrderUseCase();

// ❌ Bad
createOrderAndSendEmailUseCase(); // Tách thành 2 use cases
```

**Use cases không gọi use cases khác**

```typescript
// ❌ Bad: Use case gọi use case khác
export const createOrderUseCase = async () => {
  await sendEmailUseCase(); // Không được phép!
};

// ✅ Good: Controller orchestrate
export const createOrderController = async () => {
  const order = await createOrderUseCase();
  await sendEmailUseCase(); // Controller gọi
};
```

**Use cases nhận input đã được validate trước**

```typescript
// ✅ Good: Input đã validate ở controller
export const createOrderUseCase = (input: CreateOrderInput) => { ... };

// ❌ Bad: Validate trong use case
export const createOrderUseCase = (input: unknown) => {
  if (!input.userId) throw Error(); // Không được phép!
};
```

#### 🎮 Quy tắc Controllers

**Controllers chỉ orchestrate, không chứa business logic**

```typescript
// ✅ Good: Orchestrate flow
export const createOrderController = async (input) => {
  validateInput(input);        // ✅ Validation
  const user = getCurrentUser(); // ✅ Authentication
  const order = await createOrderUseCase(input); // ✅ Gọi use case
  return formatOutput(order);   // ✅ Format
};

// ❌ Bad: Business logic trong controller
export const createOrderController = async (input) => {
  const total = input.items.reduce(...); // ❌ Business logic!
};
```

**Sử dụng presenters để format output**

```typescript
// ✅ Good: Format trước khi return
return {
  order: { id, status, totalAmount }, // Chỉ các fields cần thiết
  clientSecret: order.paymentIntent.clientSecret,
};
```

#### ⚠️ Quy tắc Error Handling

**Custom errors cho từng domain**

```typescript
// src/entities/errors/orders.ts
export class OrderNotFoundError extends Error {}
export class InsufficientInventoryError extends Error {}
```

**Xử lý errors ở layer phù hợp**

```typescript
// ✅ Infrastructure: Wrap external errors
try {
  const dbOrder = await db.query.orders.findFirst(...);
  if (!dbOrder) throw new OrderNotFoundError(id);
} catch (error) {
  if (error instanceof OrderNotFoundError) throw error;
  throw new DatabaseError('Failed', { cause: error });
}

// ✅ Controller: Xử lý domain errors
try {
  return await createOrderUseCase(input);
} catch (error) {
  if (error instanceof InsufficientInventoryError) {
    return { error: 'Out of stock' };
  }
  throw error;
}
```

---

## 6. Best Practices thân thiện với AI

> 💡 **Quan trọng**: Clean Architecture không chỉ giúp developers mà còn giúp AI assistants hiểu code và làm việc hiệu quả hơn. Cấu trúc rõ ràng, naming conventions nhất quán, và documentation tốt giúp AI đề xuất code chính xác hơn, refactor an toàn hơn, và generate code phù hợp với architecture.

### 6.0. File Rules cho AI: `.cursorrules`

Tạo file `.cursorrules` ở root của project để AI assistants (Cursor, Claude, GitHub Copilot) hiểu architecture và rules của dự án:

```plaintext
# Clean Architecture Rules for AI Assistants

#### Architecture Overview

This project follows Clean Architecture with 4 layers:

1. Entities Layer (src/entities/) - Domain models
2. Application Layer (src/application/) - Use cases & interfaces
3. Infrastructure Layer (src/infrastructure/) - Implementations
4. Interface Adapters Layer (src/interface-adapters/) - Controllers

#### Dependency Rules

- Dependencies flow INWARD only
- NEVER import from outer layers into inner layers

#### File Naming Conventions

- Use cases: {action}-{entity}.use-case.ts
- Controllers: {action}-{entity}.controller.ts
- Repositories: {entity}.repository.ts

#### Code Rules

- Use cases: One operation, no calling other use cases
- Controllers: Only orchestrate, no business logic
- Always use interfaces, not concrete implementations
```

**Lợi ích của `.cursorrules`**:

- ✅ **AI hiểu context**: AI biết architecture và rules ngay từ đầu
- ✅ **Gợi ý chính xác**: AI gợi ý code đúng layer và đúng pattern
- ✅ **Refactor an toàn**: AI biết dependencies, không vi phạm rules
- ✅ **Code nhất quán**: AI generate code theo conventions của project

### 6.8. Tóm tắt: Checklist cho Code thân thiện với AI

Để có code thân thiện với AI, hãy đảm bảo:

- ✅ File `.cursorrules` ở project root với architecture rules
- ✅ JSDoc comments cho tất cả public functions và interfaces
- ✅ Naming conventions nhất quán theo pattern đã định nghĩa
- ✅ Explicit types - không dùng `any`, luôn có types rõ ràng
- ✅ Small functions - mỗi function làm một việc, AI dễ hiểu
- ✅ Examples trong codebase - AI học từ examples
- ✅ Pure functions khi có thể - behavior dự đoán được
- ✅ Explicit error handling - AI biết error types
- ✅ Documentation files - `ARCHITECTURE.md`, `CONTRIBUTING.md`
- ✅ ESLint rules để enforce patterns mà AI cũng phải follow

**Kết quả**: Với checklist này, AI assistants sẽ:

- ✅ Gợi ý code đúng layer và đúng pattern
- ✅ Refactor an toàn, không vi phạm dependency rules
- ✅ Generate code nhất quán với codebase hiện tại
- ✅ Hiểu context và đề xuất giải pháp phù hợp

---

## 7. Kết luận

Clean Architecture trong frontend không phải là "silver bullet" giải quyết mọi vấn đề, nhưng là công cụ mạnh mẽ để xây dựng ứng dụng frontend phức tạp, dễ maintain và mở rộng.

### Tóm tắt các điểm chính:

1. **Separation of concerns**: Mỗi layer có trách nhiệm rõ ràng, giúp code dễ hiểu và maintain
2. **Dependency Inversion**: Sử dụng interfaces và Dependency Injection giúp code linh hoạt và testable
3. **Testability**: Có thể test từng layer độc lập, đảm bảo chất lượng code
4. **Scalability**: Dễ thêm tính năng mới mà không ảnh hưởng code hiện tại
5. **Team Collaboration**: Tổ chức code rõ ràng giúp team làm việc hiệu quả hơn
6. **AI-friendly**: Documentation tốt và cấu trúc rõ ràng giúp AI assistants hỗ trợ hiệu quả hơn

### Khi nào nên sử dụng:

- ✅ Dự án lớn, phức tạp
- ✅ Team lớn, cần collaboration
- ✅ Dự án dài hạn
- ✅ Cần test coverage cao
- ✅ Có khả năng thay đổi tech stack

### Khi nào không nên sử dụng:

- ❌ MVP hoặc prototypes
- ❌ Dự án nhỏ, đơn giản
- ❌ Deadline gấp
- ❌ Team không có kinh nghiệm

### Tài liệu tham khảo:

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture on Frontend - Alex Bespoyasov](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Tags**: #AI #React #pattern #NextJS #CleanArchitecture #TypeScript #Frontend #Architecture #BestPractices
