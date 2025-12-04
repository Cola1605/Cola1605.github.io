---
title: "TypeScript Compiler Có Phải Là Linter? Phân Tích So Sánh"
date: 2025-12-04T19:00:00+09:00
categories: ["Development", "Web and Frontend"]
tags: ["TypeScript", "Compiler", "Linter", "ESLint", "AST", "Static Analysis", "tsc", "compilerOptions"]
author: "Hirai (did0es)"
translatedBy: "日平"
description: "Phân tích chi tiết TypeScript Compiler từ góc độ Linter - So sánh compilerOptions, cấu trúc AST, và khả năng của tsc với ESLint"
---

## Giới Thiệu

Xin chào! Tôi là Hirai, thuộc đội Next Experts (TypeScript) tại CyberAgent group Infrastructure Unit (CIU). Bài viết này là phần đóng góp của tôi cho **CyberAgent Developers Advent Calendar 2025 - Day 4**.

Trong công việc hàng ngày, tôi tham gia phát triển Web frontend cho các service của CIU, đồng thời với vai trò TypeScript Next Expert, tôi tập trung vào hoạt động information sharing (chia sẻ thông tin) và technical support (hỗ trợ kỹ thuật) cho các team nội bộ.

### Mục Tiêu của Bài Viết

Bài viết này sẽ:

1. **Review các compilerOptions liên quan đến code style** trong TypeScript Compiler (tsc)
2. **So sánh functionality và structure** giữa tsc và ESLint
3. **Phân tích liệu tsc có thể được sử dụng như một Linter** hay không

Mục đích là giúp các developer hiểu sâu hơn về TypeScript Compiler, không chỉ như một transpiler mà còn như một công cụ static analysis, và vị trí của nó trong TypeScript ecosystem.

## tsc = Linter?

### Vai Trò của TypeScript Compiler

**Primary Function: Transpilation**

TypeScript Compiler (tsc) có vai trò chính là:
```
TypeScript Source Code  →  [tsc]  →  JavaScript Code
```

Quá trình này:
- Strip away type information (loại bỏ thông tin type)
- Transform TypeScript-specific syntax sang JavaScript chuẩn
- Produce executable JavaScript code

**Static Analysis Role**

Tuy nhiên, tsc không chỉ đơn giản transpile. Trong quá trình compile, tsc còn:
- Perform **static type checking** (kiểm tra type tĩnh)
- Detect type errors và logical issues
- **Report errors** với detailed messages
- Provide suggestions để fix issues

### Similarity với Linter

Hành vi "inspect code và report errors" này rất giống với Linter:

```
┌─────────────────────────────────────┐
│         Linter Behavior             │
├─────────────────────────────────────┤
│ 1. Analyze source code              │
│ 2. Check against rules/patterns     │
│ 3. Detect violations                │
│ 4. Report errors with locations     │
│ 5. (Optional) Auto-fix issues       │
└─────────────────────────────────────┘
         ↕ Very Similar!
┌─────────────────────────────────────┐
│       tsc Behavior                  │
├─────────────────────────────────────┤
│ 1. Analyze TypeScript code          │
│ 2. Check against type rules         │
│ 3. Detect type errors               │
│ 4. Report errors with locations     │
│ 5. (No auto-fix)                    │
└─────────────────────────────────────┘
```

### Code Style Options trong compilerOptions

Điều thú vị là tsconfig.json's `compilerOptions` **có các properties liên quan đến code style**, không chỉ type checking:

```json
{
  "compilerOptions": {
    // Type checking options
    "strict": true,
    "noImplicitAny": true,
    
    // CODE STYLE options! 🎯
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

Điều này cho thấy tsc **quan tâm đến code style**, không chỉ type correctness!

## Catalog các Code Style Options theo Version

Hãy cùng review các compiler options liên quan đến code style, được giới thiệu qua các version của TypeScript.

### TypeScript 1.x+

#### 1. `noImplicitReturns`

**Mô tả:** Error khi function không có return statement trong một số code paths.

```typescript
// ❌ Error với noImplicitReturns
function getStatus(code: number) {
  if (code === 200) {
    return "OK";
  }
  // Error: Not all code paths return a value
}

// ✅ OK
function getStatus(code: number): string {
  if (code === 200) {
    return "OK";
  }
  return "Error";  // Explicit return
}
```

**Use case:** Đảm bảo function luôn return value như expected.

#### 2. `noFallthroughCasesInSwitch`

**Mô tả:** Error khi switch case không có return hoặc break.

```typescript
// ❌ Error với noFallthroughCasesInSwitch
function processCommand(cmd: string) {
  switch (cmd) {
    case "start":
      console.log("Starting...");
      // Error: Fallthrough case in switch
    case "stop":
      console.log("Stopping...");
      break;
  }
}

// ✅ OK
function processCommand(cmd: string) {
  switch (cmd) {
    case "start":
      console.log("Starting...");
      break;  // Explicit break
    case "stop":
      console.log("Stopping...");
      break;
  }
}
```

**Use case:** Prevent accidental fallthrough bugs trong switch statements.

#### 3. `allowUnreachableCode`

**Mô tả:** Disable errors về unreachable code (default: enabled errors).

```typescript
function example() {
  return "done";
  console.log("This will never run");  // Unreachable code
  // Warning (if allowUnreachableCode = undefined)
  // No warning (if allowUnreachableCode = true)
  // Error (if allowUnreachableCode = false)
}
```

**Use case:** Strict mode để catch dead code.

#### 4. `allowUnusedLabels`

**Mô tả:** Disable errors về unused labels (default: enabled errors).

```typescript
function example() {
  myLabel: {  // Unused label
    console.log("Hello");
  }
  // Warning nếu allowUnusedLabels = undefined
}
```

**Use case:** Cleanup code với unused labels.

#### 5. `forceConsistentCasingInFileNames`

**Mô tả:** Import paths phải match exactly với actual file names về casing.

```typescript
// File: UserModel.ts

// ❌ Error với forceConsistentCasingInFileNames
import { User } from "./usermodel";  // Wrong casing

// ✅ OK
import { User } from "./UserModel";  // Correct casing
```

**Use case:** Prevent cross-platform issues (macOS case-insensitive vs Linux case-sensitive).

#### 6. `noImplicitAny`

**Mô tả:** Error khi có implicit `any` type.

```typescript
// ❌ Error với noImplicitAny
function add(a, b) {  // 'a' và 'b' implicitly have 'any' type
  return a + b;
}

// ✅ OK
function add(a: number, b: number): number {
  return a + b;
}
```

**Use case:** Force explicit type annotations, tăng type safety.

### TypeScript 2.x+

#### 7. `alwaysStrict`

**Mô tả:** Emit `"use strict";` trong generated JS và type-check trong strict mode.

```typescript
// Input TypeScript:
function example() {
  x = 10;  // Error in strict mode: Cannot find name 'x'
}

// Output JavaScript (with alwaysStrict):
"use strict";
function example() {
  x = 10;
}
```

**Use case:** Ensure strict mode cho tất cả generated code.

#### 8. `noUnusedParameters`

**Mô tả:** Error khi function parameters không được sử dụng.

```typescript
// ❌ Error với noUnusedParameters
function greet(name: string, age: number) {
  console.log(`Hello ${name}`);
  // Error: 'age' is declared but never used
}

// ✅ OK: Prefix với underscore để indicate intentional
function greet(name: string, _age: number) {
  console.log(`Hello ${name}`);
}
```

**Use case:** Cleanup unused parameters, improve code clarity.

#### 9. `noUnusedLocals`

**Mô tả:** Error khi local variables không được sử dụng.

```typescript
// ❌ Error với noUnusedLocals
function calculate() {
  const result = 42;  // Error: 'result' is declared but never used
  const temp = 10;
  return temp * 2;
}

// ✅ OK
function calculate() {
  const temp = 10;
  return temp * 2;
}
```

**Use case:** Detect và remove unused variables.

#### 10. `noImplicitThis`

**Mô tả:** Error khi `this` có type `any`.

```typescript
// ❌ Error với noImplicitThis
const obj = {
  name: "Object",
  greet: function() {
    function inner() {
      console.log(this.name);  // Error: 'this' implicitly has type 'any'
    }
    inner();
  }
};

// ✅ OK: Explicit this parameter
const obj = {
  name: "Object",
  greet: function(this: { name: string }) {
    const inner = () => {  // Arrow function preserves 'this'
      console.log(this.name);
    };
    inner();
  }
};
```

**Use case:** Prevent `this` binding errors.

#### 11. `strictNullChecks`

**Mô tả:** Strictly check `null` và `undefined`.

```typescript
// ❌ Error với strictNullChecks
let name: string = null;  // Error: Type 'null' is not assignable to type 'string'

// ✅ OK
let name: string | null = null;  // Explicit union type
```

**Use case:** Catch null/undefined errors at compile time.

#### 12. `strictFunctionTypes`

**Mô tả:** Disable function parameter bivariance, enforce contravariance.

```typescript
// Với strictFunctionTypes
type Logger = (msg: string | number) => void;
type StringLogger = (msg: string) => void;

// ❌ Error
const logger: Logger = (msg: string) => console.log(msg);
// StringLogger không assignable cho Logger (contravariance)
```

**Use case:** Stricter function type checking.

#### 13. `strictPropertyInitialization`

**Mô tả:** Error nếu class properties không được initialize.

```typescript
// ❌ Error với strictPropertyInitialization
class User {
  name: string;  // Error: Property 'name' has no initializer
  age: number;
}

// ✅ OK: Initialize trong constructor
class User {
  name: string;
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

**Use case:** Ensure proper class initialization.

#### 14. `strictBindCallApply`

**Mô tả:** Strictly check `bind`, `call`, và `apply` arguments.

```typescript
function greet(name: string, age: number) {
  console.log(`${name} is ${age} years old`);
}

// ❌ Error với strictBindCallApply
greet.call(undefined, "Alice", "30");  // Error: Argument of type 'string' is not assignable to parameter of type 'number'

// ✅ OK
greet.call(undefined, "Alice", 30);
```

**Use case:** Type-safe function method calls.

#### 15. `useUnknownInCatchVariables`

**Mô tả:** `catch` clause variables có type `unknown` thay vì `any`.

```typescript
// Với useUnknownInCatchVariables
try {
  throw new Error("Oops");
} catch (error) {  // error: unknown
  // ❌ Error: Object is of type 'unknown'
  console.log(error.message);
  
  // ✅ OK: Type guard
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

**Use case:** Force type checking trong error handling.

### TypeScript 4.x+

#### 16. `noPropertyAccessFromIndexSignature`

**Mô tả:** Force bracket notation cho index signature objects.

```typescript
interface Options {
  [key: string]: string;
}

const opts: Options = { color: "red" };

// ❌ Error với noPropertyAccessFromIndexSignature
console.log(opts.color);  // Error: Use bracket notation

// ✅ OK
console.log(opts["color"]);
```

**Use case:** Explicit distinction giữa declared properties và index signatures.

#### 17. `exactOptionalPropertyTypes`

**Mô tả:** Distinguish giữa optional và `undefined` value.

```typescript
interface User {
  name: string;
  age?: number;  // Optional property
}

// ❌ Error với exactOptionalPropertyTypes
const user: User = {
  name: "Alice",
  age: undefined  // Error: Cannot assign 'undefined' to optional property
};

// ✅ OK
const user1: User = { name: "Alice" };  // Omit optional property
const user2: User = { name: "Alice", age: 30 };  // Provide value
```

**Use case:** Strict optional property handling.

#### 18. `noUncheckedIndexedAccess`

**Mô tả:** Add `| undefined` to indexed access types.

```typescript
const arr: number[] = [1, 2, 3];

// Với noUncheckedIndexedAccess
const item = arr[10];  // Type: number | undefined (not just number)

// Force null check
if (item !== undefined) {
  console.log(item.toFixed(2));
}
```

**Use case:** Prevent out-of-bounds access errors.

#### 19. `noImplicitOverride`

**Mô tả:** Require `override` keyword khi override parent methods.

```typescript
class Base {
  greet() {
    console.log("Hello");
  }
}

// ❌ Error với noImplicitOverride
class Derived extends Base {
  greet() {  // Error: Must use 'override' keyword
    console.log("Hi");
  }
}

// ✅ OK
class Derived extends Base {
  override greet() {
    console.log("Hi");
  }
}
```

**Use case:** Explicit override intent, prevent accidental shadowing.

## Erasable Syntax Only: Type-Level Code Style

TypeScript có nhiều syntax chỉ tồn tại ở compile time và bị "erased" (xóa bỏ) khi transpile sang JavaScript. Những syntax này không ảnh hưởng đến runtime behavior nhưng đóng vai trò quan trọng trong **ensuring code health** (đảm bảo sức khỏe code).

### `isolatedDeclarations` và `erasableSyntaxOnly`

Khi enable `isolatedDeclarations` option (proposed), có thể set `erasableSyntaxOnly: true` để chỉ allow các syntax mà không ảnh hưởng đến generated JavaScript.

### 9 Loại Erasable Syntax

#### 1. **Ty

pe Annotations (型注釈)**

```typescript
// TypeScript
const foo: number = 42;

// JavaScript (erased)
const foo = 42;
```

**Vai trò:** Explicit type declaration cho type checking.

#### 2. **Type Aliases (型エイリアス)**

```typescript
// TypeScript
type User = {
  name: string;
  age: number;
};

// JavaScript (completely erased)
// (no output)
```

**Vai trò:** Define reusable type definitions.

#### 3. **Interfaces (インターフェース)**

```typescript
// TypeScript
interface Animal {
  name: string;
  makeSound(): void;
}

// JavaScript (completely erased)
// (no output)
```

**Vai trò:** Define object shapes và contracts.

#### 4. **Generics (ジェネリクス)**

```typescript
// TypeScript
function identity<T>(arg: T): T {
  return arg;
}

// JavaScript (type parameter erased)
function identity(arg) {
  return arg;
}
```

**Vai trò:** Type-safe reusable components.

#### 5. **Type Assertions (型アサーション)**

```typescript
// TypeScript
const foo = someValue as string;

// JavaScript (assertion erased)
const foo = someValue;
```

**Vai trò:** Override type inference khi cần.

#### 6. **Non-null Assertions (非nullアサーション)**

```typescript
// TypeScript
const length = value!.length;

// JavaScript (assertion erased)
const length = value.length;
```

**Vai trò:** Assert value is not null/undefined.

#### 7. **Type Utilities (型ユーティリティ)**

**Mapped Types:**
```typescript
// TypeScript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// JavaScript (completely erased)
// (no output)
```

**Conditional Types:**
```typescript
// TypeScript
type IsString<T> = T extends string ? true : false;

// JavaScript (completely erased)
// (no output)
```

**Vai trò:** Advanced type manipulation.

#### 8. **Ambient Declarations (アンビエント宣言)**

```typescript
// TypeScript
declare const API_KEY: string;
declare function externalLib(): void;

// JavaScript (completely erased)
// (no output - declarations only for type checking)
```

**Vai trò:** Declare types cho external code (libraries, globals).

#### 9. **Type-Only Import/Export (Type Only import/export)**

```typescript
// TypeScript
import type { User } from "./types";
export type { Config };

// JavaScript (imports erased)
// (no import statement generated)
```

**Vai trò:** Import types without runtime overhead.

### Linter Perspective

Các erasable syntax này có thể được xem như **"type-level linting"**:
- Enforce constraints tại compile time
- Không impact runtime performance
- Ensure code correctness before execution
- Function as compile-time assertions

Đây là một form của "static analysis" giống như Linter, nhưng focused on type system thay vì code style.

## So Sánh Cấu Trúc: tsc vs ESLint

Bây giờ, hãy so sánh **internal structure** (cấu trúc nội bộ) của tsc và ESLint để xem chúng hoạt động như thế nào.

### Processing Flow Comparison

#### **tsc Processing Flow**

```
┌─────────────────────┐
│  TypeScript Source  │
│  + tsconfig.json    │
└──────────┬──────────┘
           │
           ↓
     ┌─────────┐
     │   tsc   │
     └────┬────┘
          │
          ├─→ Transpile TypeScript → JavaScript
          │
          └─→ Static Analysis → Type Errors
                                  ↓
                    ┌─────────────────────┐
                    │  Output:            │
                    │  1. JavaScript code │
                    │  2. Error reports   │
                    └─────────────────────┘
```

#### **ESLint Processing Flow**

```
┌─────────────────────┐
│   Source Code       │
│  + eslint.config.js │
└──────────┬──────────┘
           │
           ↓
     ┌─────────┐
     │ ESLint  │
     └────┬────┘
          │
          ├─→ Static Analysis → Rule Violations
          │
          └─→ (Optional) Auto-fix
                                  ↓
                    ┌─────────────────────────┐
                    │  Output:                │
                    │  1. Error reports       │
                    │  2. Fixed source (--fix)│
                    └─────────────────────────┘
```

#### **Commonality**

Cả hai đều:
- Accept **user-selected options** (tsconfig.json / eslint.config.js)
- Perform **processing** based on options
- **Output results** (errors, warnings, fixed code)

### Abstract Syntax Tree (AST) Based Analysis

Cả tsc và ESLint đều sử dụng **AST-based static analysis**.

#### **Static Analysis Là Gì?**

> **Static Analysis (静的解析):** Phân tích code behavior **without executing** (không thực thi) code.

Khác với dynamic analysis (chạy code và observe), static analysis examine source code structure để detect potential issues.

#### **Abstract Syntax Tree (AST) Là Gì?**

> **AST:** Tree representation của source code, làm intermediate format để efficiently traverse và analyze.

**Example:**

```typescript
// Source Code
const x = 1 + 2;

// AST Representation (simplified)
{
  type: "VariableDeclaration",
  kind: "const",
  declarations: [{
    type: "VariableDeclarator",
    id: { type: "Identifier", name: "x" },
    init: {
      type: "BinaryExpression",
      operator: "+",
      left: { type: "Literal", value: 1 },
      right: { type: "Literal", value: 2 }
    }
  }]
}
```

AST transform source code thành **objects** mà tools có thể programmatically traverse và analyze.

#### **AST Format Variations**

JavaScript/TypeScript AST **không được standardized** (chuẩn hóa), nhưng có các formats phổ biến:
- **Acorn** format
- **Esprima** format
- **ESTree** specification (de facto standard)

Tools khác nhau có thể dùng proprietary formats hoặc fork existing formats.

### tsc: TypeScript AST

**Format:** Proprietary TypeScript AST

**Process:**

```
Source Code
    ↓
[Parser]
    ↓
TypeScript AST
    ↓
[Binder] - Create symbol table
    ↓
[Checker] - Type checking (recursive traversal)
    ↓
[Emitter] - Generate JavaScript
```

**Traversal Method:** Recursive traversal

**Documentation:** [TypeScript Compiler Notes](https://github.com/microsoft/TypeScript-Compiler-Notes)

**Example TypeScript AST Node:**

```typescript
// Source: function greet(name: string) { }

// TypeScript AST (simplified)
{
  kind: SyntaxKind.FunctionDeclaration,
  name: { kind: SyntaxKind.Identifier, text: "greet" },
  parameters: [{
    kind: SyntaxKind.Parameter,
    name: { kind: SyntaxKind.Identifier, text: "name" },
    type: { kind: SyntaxKind.StringKeyword }
  }],
  // ...
}
```

### ESLint: Espree AST

**Format:** Espree (ESTree-compatible)

**Process:**

```
Source Code
    ↓
[espree.parse()]
    ↓
Espree AST
    ↓
[Traversal] - Recursive + Event-driven
    ↓
[Rule Execution] - Check violations
    ↓
[Fixer] - Apply fixes (if --fix)
```

**Traversal Method:** Recursive + Event-driven

Để hiểu sâu hơn về ESLint internals, tác giả recommend bài viết của mình:
**["ESLintとPrettierのコードリーディングでASTベースの静的解析を理解する"](https://thinkit.co.jp/article/38641#toc-9)** (ThinkIT)

**Example Espree AST Node:**

```typescript
// Source: const x = 1;

// Espree AST (simplified)
{
  type: "VariableDeclaration",
  kind: "const",
  declarations: [{
    type: "VariableDeclarator",
    id: { type: "Identifier", name: "x" },
    init: { type: "Literal", value: 1 }
  }]
}
```

### Commonality trong Processing

Dù AST format và traversal methods khác nhau, cả tsc và ESLint đều:

1. **Convert source code → intermediate representation (AST)**
2. **Recursively traverse** AST nodes
3. **Apply checks/rules** tại mỗi node
4. **Collect và output results** (errors, warnings)

### Key Differences: Input/Output Behavior

#### **tsc**

**Error Reporting:**
- Check code against `compilerOptions` và TypeScript rules
- Report type errors với file locations và error codes
- Errors được display trong terminal và IDE

**Error Fixing:**
- **Không tự động fix errors**
- Developer phải manually fix issues

**Output:**
- Generate **JavaScript code** theo CLI options
- Output có thể include source maps, declaration files, etc.

**Example:**
```bash
$ tsc
# Output:
# src/index.ts:10:5 - error TS2322: Type 'string' is not assignable to type 'number'.
# + index.js (transpiled JavaScript)
```

#### **ESLint**

**Error Reporting:**
- Check code against rules trong config
- Report rule violations với severity (error/warning)
- Errors displayed trong terminal và IDE

**Error Fixing:**
- **Auto-fix với `--fix` flag**
- Một số rules có auto-fix capability

**Output:**
- Report errors/warnings
- Với `--fix`: output **fixed source code**

**Example:**
```bash
$ eslint src/
# Output:
# src/index.js
#   10:5  error  'x' is assigned a value but never used  no-unused-vars

$ eslint src/ --fix
# → Auto-fix issues và update source files
```

### Capability Comparison Matrix

| Capability | tsc | ESLint |
|------------|-----|--------|
| **Code Inspection** | △ (Limited compared to ESLint, nhưng có compilerOptions và syntax checking) | ◯ (Extensive rules) |
| **Code Fixing** | ✗ (No auto-fix) | ◯ (Auto-fix với `--fix`) |
| **Editor Error Visualization** | ◯ (VS Code, etc.) | ◯ (VS Code, etc.) |
| **Plugin Implementation** | ◯ (Compiler plugins, transformers) | ◯ (Custom rules, plugins) |

## Kết Luận: TypeScript Compiler Có Phải Là Linter?

### Functional và Structural Proximity

Từ analysis trên, chúng ta có thể kết luận:

> **TypeScript Compiler (tsc) về mặt functional (chức năng) và structural (cấu trúc) rất gần với Linter.**

**Evidence:**

1. **Code Style Options:** tsc có nhiều `compilerOptions` focused on code style (19+ options)
2. **Static Analysis:** Sử dụng AST-based analysis giống ESLint
3. **Error Reporting:** Inspect code và report violations
4. **Inspection Scope:** Không chỉ type errors mà còn logical issues (unreachable code, unused variables, etc.)

### Limitations: Cannot Fulfill Linter Role Alone

Tuy nhiên, tsc **không thể replace Linter hoàn toàn**:

**Missing Capabilities:**
- ❌ **No auto-fix functionality**
- ❌ **Limited code style rules** compared to ESLint (thousands of rules)
- ❌ **No formatting capabilities** (like Prettier)
- ❌ **Less customizable** rule configurations

**Why ESLint is Still Needed:**

```
┌─────────────────────────────────┐
│    TypeScript Ecosystem         │
├─────────────────────────────────┤
│  tsc:                           │
│  - Type checking                │
│  - Basic code style checking    │
│  - Transpilation                │
│                                  │
│  ESLint:                        │
│  - Comprehensive style rules    │
│  - Auto-fixing                  │
│  - Custom rules                 │
│                                  │
│  Prettier:                      │
│  - Code formatting              │
│  - Consistent style             │
└─────────────────────────────────┘
        ↓
   Used Together!
```

### Common Practice: tsc + ESLint

Trong thực tế, teams thường combine:

```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint src/ --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "check": "npm run lint && npm run type-check"
  }
}
```

- **tsc:** Type checking + transpilation
- **ESLint:** Code style + best practices enforcement

### Future Development: TypeScript 7.x+

**Go Reimplementation:**

TypeScript team đang work on **Go-based reimplementation** ([typescript-go](https://github.com/microsoft/typescript-go)):

**Focus Areas:**
- ✅ **Performance improvements** (faster compilation)
- ✅ **Better developer experience**
- ❌ **NOT expanding Linter features**

**Implication:**
- TypeScript development **không hướng tới** trở thành full Linter
- Focus vẫn là **type checking và transpilation performance**
- Linter role sẽ continue được fulfill bởi specialized tools (ESLint)

### Message tới Developers

Qua bài viết này, tôi hy vọng các bạn có thể:

1. **Hiểu sâu hơn về tsc:** Không chỉ là transpiler mà còn là static analysis tool
2. **Appreciate TypeScript ecosystem:** Sự kết hợp của tsc, ESLint, Prettier tạo nên development experience mạnh mẽ
3. **Recognize tool roles:** Mỗi tool có strengths riêng, và combining them tạo best results
4. **Stay curious:** TypeScript ecosystem đang evolve với improvements như Go reimplementation

Nếu bài viết này giúp bạn có **interest** (quan tâm) hơn đến tsc và TypeScript ecosystem, tôi rất vui! 🎉

---

## Về Tác Giả

**did0es (平井)**

- **Join:** 2022年新卒入社 (Tốt nghiệp 2022)
- **Department:** グループIT推進本部 CyberAgent group Infrastructure Unit (CIU)
- **Role:** Software Engineer, Next Experts (TypeScript)

**Community Activities:**
- Lead organizer cho **FrontEnd Conference Tokyo**
- Organizer cho **Meguro.es** (TypeScript/JavaScript meetup)
- Organizer cho **FrontEnd Conference Nagoya**

**Social:**
- GitHub: [github.com/shuta13](https://github.com/shuta13)
- X (Twitter): [@did0es](https://twitter.com/did0es)

---

**Dịch giả:** 日平  
**Nguồn gốc:** [CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/59821/)  
**Advent Calendar:** CyberAgent Developers Advent Calendar 2025 - Day 4
