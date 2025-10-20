---
title: "Thử nghiệm tự động tạo test với Playwright Agents"
date: 2025-10-17
draft: false
categories: ["Testing", "Automation", "AI"]
tags: ["Playwright", "Test-Automation", "MCP", "Generative-AI", "E2E-Testing", "QA"]
description: "Trải nghiệm Playwright Agents - tính năng mới từ Playwright v1.56 với 3 agents tự động hóa toàn bộ quy trình testing từ khám phá đến tạo test cases."
---

**Tác giả:** reon takano (@resound)  
**Tổ chức:** KDDIアジャイル開発センター株式会社 (KDDI Agile Development Center)  
**Ngày đăng:** 17/10/2025  
**Nguồn:** https://qiita.com/resound/items/24f129a920b34677e7f3

**Tags:** テスト自動化 (Test Automation), MCP, Playwright, 生成AI (Generative AI)  
**Engagement:** 34 Likes, 18 Stocks

---

## Giới thiệu

Xin chào, tôi là Takano.

Từ Playwright v1.56, tính năng mới [**Playwright Agents**](https://playwright.dev/docs/test-agents) đã được bổ sung. Playwright Agents này được cấu thành từ 3 agents chính, và các agents này hoạt động phối hợp với nhau để thực hiện tự động hóa toàn bộ quy trình testing.

Lần này tôi sẽ thực tế trải nghiệm Playwright Agents.

## Playwright Agents là gì?

Đầu tiên, tôi sẽ giải thích Playwright Agents được giới thiệu lần này là gì. Như đã đề cập ở phần mở đầu, Playwright Agents được cấu thành từ 3 agents, và mỗi agent liên kết với nhau để tự động hóa toàn bộ quy trình testing.

### 3 Agents cấu thành Playwright Agents

**🎭 Planner (Người lập kế hoạch)**

**Vai trò:** Tự động khám phá web application và liệt kê các mục cần test, tạo ra test plan dưới dạng Markdown.

**Lợi ích:** Phát hiện các test case mà con người dễ bỏ sót, tạo test plan toàn diện trong thời gian ngắn. Nhờ đó, giảm đáng kể công sức cho việc thiết kế test.

**🎭 Generator (Người tạo mã)**

**Vai trò:** Đọc test plan dạng Markdown do Planner tạo ra, tự động sinh test code có thể thực thi trên Playwright.

**Lợi ích:** Không cần công việc chuyển đổi từ test plan sang code, developer có thể tập trung vào công việc bản chất hơn.

**🎭 Healer (Người sửa chữa)**

**Vai trò:** Khi test thực thi thất bại, AI phân tích nguyên nhân và tự động sửa code. Ví dụ như khi UI thay đổi làm selector của element thay đổi, Healer sẽ xác định selector mới và cập nhật code.

**Lợi ích:** Giảm đáng kể chi phí maintenance test code. Có thể tự động hóa phần lớn công việc debug và sửa lỗi từng được thực hiện thủ công, dẫn đến cải thiện tính ổn định của test.

## Thực tế sử dụng

### Setup

Setup rất đơn giản.

Đầu tiên, cài đặt Playwright bằng command sau. Nếu bạn đã cài đặt rồi, hãy xác nhận version là 1.56 trở lên.

```bash
npm init playwright@latest
```

Bạn sẽ được hỏi có muốn dùng TypeScript hay JavaScript, hãy chọn một trong hai. (Tôi chọn TypeScript)

Sau đó sẽ có nhiều câu hỏi nữa, nhưng nếu không có yêu cầu đặc biệt thì cứ approve hết cũng được. Sau khi approve tất cả, quá trình cài đặt sẽ bắt đầu.

Sau khi cài đặt xong, thêm định nghĩa Playwright Agents vào project. Lần này để liên kết với GitHub Copilot Chat được tích hợp trong VSCode, nhập command sau:

```bash
npx playwright init-agents --loop=vscode
```

Option `--loop=vscode` là để thiết lập Copilot Chat trong VSCode làm đối tượng tương tác.

Vì cũng hỗ trợ Claude Code và OpenCode nên nếu muốn thử với những công cụ đó thì hãy tham khảo [Playwright Official Documentation](https://playwright.dev/docs/test-agents).

Khi cài đặt hoàn tất, các file sẽ được thêm vào như trong hình.

![Setup Complete](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2Fecd26ed5-01cd-4e25-a25d-6d2a1cb55011.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=5d0bc9166854e4aa97cc3ab23df72910)

**Các file được tạo:**

- **planner.chatmode.md**
- **generator.chatmode.md**
- **healer.chatmode.md**

Những file này đóng vai trò chỉ thị cho Copilot về role của từng agent.

- **.vscode/mcp.json**

File cấu hình cho VSCode.

- **tests/seed.spec.ts**

File này trở thành điểm xuất phát khi AI agent tạo test.

Nếu site cần login thì viết xử lý vào file này trước khi ra lệnh cho các agent.

Setup kết thúc tại đây.

### Tạo test cho Website

Sau khi setup hoàn tất, bây giờ thực tế sử dụng Playwright Agents.

Lần này tôi sẽ tạo test cho website của mình được tạo ra cho mục đích học tập.

Đầu tiên, viết `seed.spec.ts`.

Vì site mục tiêu không có tính năng login nên chỉ cần viết xử lý truy cập là xong.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // generate code here.
    await page.goto('URL của site bạn muốn test');
  });
});
```

### Planner

Tiếp theo, chuyển sang mode Planner.

Click vào mode ở góc dưới bên trái, sẽ xuất hiện như hình dưới đây, chọn `planner`.

![Select Planner Mode](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2F2e40e751-20f4-4a21-bf6e-5d00cf0dcc01.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=2eeaf319fb74a9f51576ceddf44a8d1e)

Và thêm `seed.spec.ts` làm context.

Tôi sẽ cố ý đưa ra instruction đơn giản cho Copilot.

![Planner Instruction](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2F1a5f31f3-0124-4765-b86c-5200fe83304c.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=2f8569eec683f4edf7861ab67f8f9a37)

Mặc dù đã đưa ra prompt khá "bạo lực", nhưng nó đã sử dụng Playwright MCP để nắm bắt cấu trúc site và output test case dưới dạng Markdown. File md được output trong folder `tests`.

![Test Plan Output](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2F87c36ade-866c-4634-894c-8bcd00ff51ab.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=583d0e61c4f67ef570cc3f1732a87529)

Dưới đây là một phần của test case thực tế được output. Tổng cộng output 13 test case. Ngoài ra, mặc dù instruction rất đơn giản nhưng không chỉ có normal case mà còn có cả abnormal case được output, điều này thực sự tiện lợi.

```markdown
### 1. グローバルナビ（アンカー遷移とアクティブ状態）
前提: トップページを初期表示。
手順:
1. ヘッダーの「About」ボタンをクリック
   - 期待: About Me セクションがビューポート内にスクロールインし、ナビの「About」がアクティブ表示になる
2. 「プロジェクト」ボタンをクリック
   - 期待: プロジェクト見出しがビューポート内に入り、「プロジェクト」がアクティブ
3. 「経歴」ボタンをクリック
   - 期待: 職歴セクションが表示、「経歴」がアクティブ
4. 「コンタクト」ボタンをクリック
   - 期待: お問い合わせセクションが表示、「コンタクト」がアクティブ
5. 「ホーム」ボタンをクリック
   - 期待: ヒーロー（氏名/肩書）が再び先頭に表示、「ホーム」がアクティブ
成功基準:
- 各クリックで対応セクションが確実に表示され、アクティブ状態が正しく遷移
失敗条件:
- スクロールしない/誤ったセクションに移動/アクティブ表示が変化しない

### 2. ヒーローCTAの挙動
手順:
1. CTA「プロジェクトを見る」をクリック
   - 期待: プロジェクトセクション先頭へスクロール、ナビ「プロジェクト」がアクティブ
2. CTA「お問い合わせ」をクリック
   - 期待: お問い合わせセクションへスクロール、ナビ「コンタクト」がアクティブ
成功基準: CTAが各対応セクションに遷移する
失敗条件: スクロールしない/誤ったセクションに遷移
...
```

### Generator

Tiếp theo, chuyển đổi test case do Planner tạo ra thành code thực tế.

Như trong hình, đổi mode thành `generator`, và thêm title của test case muốn implement làm context.

Prompt cũng đơn giản như trước.

![Generator Instruction](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2F5394a9c1-d515-49c4-ae95-930762936c9a.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=89c3f34c5651a377f4e7b1d6d9fb0378)

Sau đó, `global-nav-anchor-active-state.spec.ts` được output nên thử thực thi.

Bằng cách chỉ định file như dưới đây, có thể chạy chỉ test cụ thể.

```bash
npx playwright test tests/global-nav-anchor-active-state.spec.ts
```

Tương tự như Planner, chỉ đưa ra instruction đơn giản nhưng có thể xác nhận test được generate đã thành công.

![Test Success](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2Fe218083d-8a9c-4911-9bee-c63f8392056d.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=f5a33f72095b797084ebc627f6308cae)

Khi chuyển đổi các test case khác thành code, cuối cùng test đã failed.

Vì site mục tiêu đơn giản nên hầu hết các test được generate đều thành công, nhưng code được generate không phải lúc nào cũng hoạt động hoàn hảo.

![Test Failed](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2Fb6a3b949-e466-4be4-99be-b24e88f945b6.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=b39de9ba84f53ac34d5b61f71b32f498)

Trong trường hợp như này, Healer Agent sẽ phát huy tác dụng nên tôi sẽ thử sử dụng.

### Healer

Tương tự như trước, thử xem liệu có sửa được test từ instruction đơn giản không.

Đổi mode thành `healer`, và thêm file test failed vào context.

![Healer Instruction](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2Fc4378340-b64d-4019-a469-a132c4a865b5.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=e22676b5b53fccaf5871407306c9519e)

Khi đưa ra instruction, nó đã xác định nguyên nhân failed và tự động rewrite code.

![Code Fixed](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F4059351%2F032c5519-3964-429e-9f4f-8638fd9db25e.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=9c936414103ed63ced3754890de214f1)

Test cũng thành công, đã sửa rất dễ dàng.

Tôi có ấn tượng mạnh về việc sửa test code được generate bằng AI rất vất vả, nhưng nó đã sửa rất pinpoint với modification tối thiểu nên cảm thấy cực kỳ tiện lợi.

## Sử dụng xong cảm thấy thế nào

### Tính năng mạnh mẽ được recommend cho cả người đang dùng và người mới

Thực tế sử dụng, tôi cảm thấy Playwright Agents là tính năng cực kỳ mạnh mẽ.

Đối với những người thường xuyên sử dụng Playwright, việc phân chia role rõ ràng của Planner, Generator, Healer, và AI sử dụng Playwright MCP một cách thích hợp nên có thể thu được kết quả độ chính xác cao mà không cần tạo prompt quá chi tiết là điểm hấp dẫn lớn.

Ngoài ra, đối với những người muốn thử Playwright từ bây giờ, tính năng này cũng rất hữu ích. Vì Planner liệt kê các mục cần test nên dễ vượt qua bức tường đầu tiên "nên test gì từ đâu", và ngay cả khi code do Generator generate không hoàn hảo thì Healer cũng giúp sửa, nên có thể hoàn thành test code trong khi lặp lại trial and error.

### Cảm nhận về từng Agent

Đặc biệt **Planner rất xuất sắc**, việc tự động generate test plan cực kỳ tiện lợi.

Code do **Generator** generate có ấn tượng hơi có quirk, có vẻ không phải ai cũng tạo được perfect test ngay một lần. Tuy nhiên, vì **Healer** cover tuyệt vời phần đó nên cảm thấy mục đích tạo test chạy được một cách nhanh chóng đã đạt được đầy đủ.

## Tổng kết

Lần này đã thử Playwright Agents, tính năng mới được giới thiệu từ Playwright v1.56.

Đây là tính năng cực kỳ mạnh mẽ, 3 agents Planner, Generator, Healer liên kết với nhau để có thể tự động hóa hiệu quả từ lập kế hoạch test đến generate code và sửa lỗi.

Mặc dù cố ý thử với prompt đơn giản nhưng vẫn thu được kết quả đầy đủ. Nghĩ rằng có thể thực hiện test automation mạnh mẽ hơn nữa bằng cách sáng tạo prompt hoặc verify với website phức tạp hơn.

Cảm ơn các bạn đã đọc đến cuối!

---

## Tổng hợp

Playwright Agents là một công cụ mạnh mẽ giúp:

✅ **Tự động hóa hoàn toàn** quy trình testing từ planning → coding → healing  
✅ **Giảm công sức** thiết kế test và maintenance  
✅ **Hỗ trợ cả người mới** với Planner giúp xác định test cases  
✅ **Tích hợp VSCode** qua GitHub Copilot Chat seamlessly  
✅ **Phát hiện cả abnormal cases** không chỉ normal cases  
✅ **Tự động sửa lỗi** thông minh với Healer agent  

**Setup đơn giản:**
```bash
npm init playwright@latest
npx playwright init-agents --loop=vscode
```

**Workflow:**
1. **Planner**: Tự động khám phá site và tạo test plan (Markdown)
2. **Generator**: Chuyển đổi test plan thành Playwright code
3. **Healer**: Phân tích và sửa test failed tự động

Đặc biệt phù hợp cho:
- Teams đang sử dụng Playwright muốn tăng productivity
- Developers mới với Playwright cần guidance
- Projects cần test coverage nhanh chóng
- Teams muốn giảm maintenance cost cho test code

URL: https://qiita.com/resound/items/24f129a920b34677e7f3
TỔNG HỢP THÔNG TIN TẠI :https://cola1605.github.io/
