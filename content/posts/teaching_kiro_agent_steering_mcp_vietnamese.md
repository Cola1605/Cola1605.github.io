---
title: "Cách dạy Kiro kỹ năng mới với Steering và MCP"
date: 2025-10-30
categories: ["AI and Machine Learning", "AWS", "Development"]
tags: ["Amazon-Q", "Kiro", "Agent-Steering", "MCP", "AI-Developer", "Custom-Tools"]
description: "Hướng dẫn training Kiro AI agent với custom libraries và DSL. Sử dụng Agent Steering và Model Context Protocol (MCP) để mở rộng khả năng của AI coding assistant."
---

# Cách dạy Kiro kỹ năng mới với Steering và MCP

**Nguồn:** Kiro.dev Blog (Bản dịch tiếng Nhật)  
**Ngày xuất bản:** 30 tháng 10, 2025  
**Ngày xuất bản gốc:** 23 tháng 10, 2025  
**Người dịch:** Hiroaki Yoshimura  
**Tác giả gốc:** Brian Beach  
**Danh mục:** Amazon Q, Amazon Q Developer, Developer Tools, General  
**URL gốc:** https://kiro.dev/blog/teaching-kiro-new-tricks-with-agent-steering-and-mcp/  
**URL:** https://aws.amazon.com/jp/blogs/news/teaching-kiro-new-tricks-with-agent-steering-and-mcp/

---

## Giới thiệu

Trong 3 năm qua, tôi đã hỗ trợ hàng trăm khách hàng áp dụng công cụ AI cho phát triển phần mềm. Nhiều khách hàng trong số này đang phát triển thư viện tùy chỉnh, công cụ, và thậm chí cả ngôn ngữ dành riêng cho miền (DSL) của họ. Ngôn ngữ tự động hóa quy trình làm việc, cú pháp cấu hình, công cụ xử lý quy tắc - những tùy chỉnh này trở thành nền tảng cho hoạt động kinh doanh. Nhưng nếu bạn muốn trợ lý lập trình AI hiểu và làm việc với những thư viện độc quyền này thì sao?

Trong bài viết này, chúng ta sẽ khám phá cách dạy **Kiro** - một trợ lý AI và môi trường phát triển - hiểu được một thư viện có tên MathJSON. MathJSON là một thư viện giả định được tạo ra cho minh họa này, nhưng nó đóng vai trò như đại diện cho ngôn ngữ quy trình làm việc, hệ thống cấu hình, và ký hiệu chuyên biệt mà các doanh nghiệp sử dụng hàng ngày. Xuyên suốt bài viết này, chúng ta sẽ giải thích về **Steering** (Điều hướng) và **Model Context Protocol (MCP)** (Giao thức Ngữ cảnh Mô hình), và cách kết hợp chúng để dạy Kiro những kỹ năng mới.

*(Có ảnh chụp màn hình minh họa giao diện Kiro)*

---

## Làm quen với MathJSON

Trong bài viết này, chúng ta sử dụng MathJSON - một ngôn ngữ biểu thức toán học dựa trên JSON sử dụng thuật ngữ toán học chính xác. Lưu ý rằng MathJSON được tạo ra cho bài viết này và không được khuyến nghị sử dụng trong ứng dụng thực tế. Dưới đây là những điểm thú vị:

### Tính năng chính

- **Cú pháp dựa trên JSON** cho biểu thức toán học có cấu trúc
- **Thuật ngữ toán học chính xác** (số hạng, số bị trừ, số nhân, v.v.)
- **Biểu thức lồng nhau** cho tính toán phức tạp
- **Thư viện hàm phong phú** (lượng giác, logarit, hằng số)
- **Phần mở rộng tệp**: `.math`

### Ví dụ về biểu thức

```json
{
  "multiplication": {
    "multiplicand": {"pi": {}},
    "multiplier": {
      "pow": {
        "base": {"variable": "env:RADIUS"},
        "exponent": 2
      }
    }
  }
}
```

Ví dụ này tính diện tích hình tròn với bán kính được truyền vào như biến môi trường: `pi * radius^2`

---

## Hướng dẫn Kiro với tệp Steering

Steering cung cấp kiến thức lâu dài về dự án cho Kiro thông qua tệp markdown. Những tệp này được lưu trong `.kiro/steering/` và cung cấp ngữ cảnh và hướng dẫn cho tất cả các tương tác trong không gian làm việc. Tệp Steering bao gồm tiêu chuẩn lập trình, cấu trúc dự án, v.v.

Điều đầu tiên bạn có thể nghĩ đến là thêm tài liệu của MathJSON vào thư mục steering. Tôi đã làm chính xác điều đó và thêm tệp `function_reference.md` vào thư mục steering. Đây là một khởi đầu tốt, nhưng có một số vấn đề:

1. **Tài liệu được viết cho con người** - Kết quả là dài dòng và lặp lại nhiều
2. **Thiếu phương pháp hay cụ thể** mà Kiro nên tuân theo
3. **Tài liệu được sao chép vào thư mục dự án** sẽ không tránh khỏi bị lỗi thời

Hãy cùng xem những vấn đề này và cách giải quyết chúng.

---

## Tinh chỉnh tệp Steering

Vấn đề đầu tiên chúng ta muốn vượt qua là **sự dư thừa của tài liệu**. *Tất nhiên, điều này giả định rằng tài liệu thích hợp đã tồn tại. Nếu không, Kiro có thể giúp bạn tạo ra.*

Tài liệu được tạo cho con người thường quá dài dòng để đưa vào tệp steering. MathJSON là một dự án đơn giản tôi tạo cho bài viết này, nhưng nó vẫn có hơn **3,500 dòng tài liệu** trải rộng qua 6 tệp markdown. Đây là quá nhiều thông tin để thêm vào mọi cuộc trò chuyện với Kiro.

Rất may, Kiro có thể tinh chỉnh tệp steering cho chúng ta. Chỉ cần mở tệp steering trong Kiro và chọn nút **Refine** (Tinh chỉnh). Kiro sẽ đọc tệp và tối ưu hóa nó.

*(Có ảnh chụp màn hình minh họa nút Refine trong Kiro)*

Hãy xem một trong những thay đổi Kiro đã thực hiện. Trong tài liệu gốc, phép cộng được mô tả như sau:

```markdown
## Phép toán số học

### Phép cộng
Thực hiện phép cộng hai số sử dụng thuật ngữ toán học chính xác.

**Cú pháp:**
```json
{
  "addition": {
    "addend1": <số|biểu_thức>,
    "addend2": <số|biểu_thức>
  }
}
```

**Tham số:**
- `addend1` (số|biểu_thức): Số đầu tiên để cộng
- `addend2` (số|biểu_thức): Số thứ hai để cộng

**Trả về:** Tổng của hai số hạng

**Công thức:** addend1 + addend2 = tổng

**Ví dụ:**
```json
// Phép cộng đơn giản
{
  "addition": {
    "addend1": 15,
    "addend2": 25
  }
}
// Kết quả: 40

// Phép cộng với biểu thức lồng nhau
{
  "addition": {
    "addend1": {
      "multiplication": {
        "multiplicand": 3,
        "multiplier": 4
      }
    },
    "addend2": 8
  }
}
// Kết quả: 20 (12 + 8)
```
```

Kiro đã tinh chỉnh nó và thay thế bằng **1 dòng duy nhất**. Chi tiết như biểu thức lồng nhau được đề cập một lần trong tệp đã tinh chỉnh và không lặp lại trong ví dụ của từng phép toán. Do đó, không cần lặp lại ở đây.

```markdown
### Phép toán số học
- `addition`: `{addend1, addend2}` - Phép cộng cơ bản
```

Nhìn chung, đây là một khởi đầu tuyệt vời. Tệp Steering đã được giảm từ **3,500 dòng xuống 102 dòng**. Ngay cả khi bạn không làm gì khác, hãy sử dụng tùy chọn tinh chỉnh để tối ưu tệp steering của bạn. Tuy nhiên, chúng ta có thể tiếp tục cải thiện hơn nữa.

---

## Định nghĩa phương pháp hay

Vấn đề tiếp theo chúng ta muốn vượt qua là **tính cụ thể của tài liệu**. Tài liệu người dùng có xu hướng rộng - tập trung vào việc bao quát tất cả các cách có thể sử dụng thư viện hoặc ngôn ngữ. Nhưng tệp steering nên có **hướng dẫn cụ thể**. Chúng ta không muốn nói cho Kiro biết **nó CÓ THỂ sử dụng MathJSON như thế nào**, mà muốn nói chính xác **nó NÊN sử dụng như thế nào**.

Kiro đã bắt đầu định nghĩa phương pháp hay khi tinh chỉnh tài liệu ở phần trước. Nhưng chúng ta sẽ thêm quy tắc bổ sung. Cụ thể, chúng ta muốn Kiro kiểm tra và thử nghiệm tất cả mã mà nó viết. Vì vậy, chúng ta thêm một số phương pháp hay mới:

```markdown
5. **Hằng số thay vì giá trị trực tiếp**: Sử dụng `{"pi": {}}` thay vì `3.14159` để có độ chính xác
6. **Kiểm tra mã**: Giả định `mathjson` đã được cài đặt cục bộ. Khi tạo hoặc chỉnh sửa tệp `*.math`, hãy kiểm tra lỗi và thử nghiệm chúng.
```

Lưu ý rằng tệp steering đã có hướng dẫn về cách sử dụng công cụ dòng lệnh. Thay vì lặp lại điều đó, chúng ta đang chỉ dẫn cho Kiro biết **khi nào** sử dụng nó. Tệp steering đang bắt đầu có hình dạng, nhưng làm thế nào để giữ nó cập nhật theo thời gian?

---

## Giữ cho kiến thức luôn cập nhật

Vấn đề đầu tiên chúng ta muốn vượt qua là **độ mới của tài liệu**. Theo thời gian, MathJSON sẽ phát triển và thay đổi. Ví dụ, gần đây chúng ta đã thêm hỗ trợ hàm lượng giác. Chúng ta muốn Kiro có thể truy cập tài liệu gốc, không phải bản sao mà chúng ta phải duy trì. Đây là lúc **Model Context Protocol (MCP)** (Giao thức Ngữ cảnh Mô hình) xuất hiện.

Đối với MathJSON, kho lưu trữ GitHub là nguồn chính thức. Do đó, chúng ta đã thiết lập máy chủ MCP cho GitHub. Giờ đây, Kiro có thể đọc tài liệu mới nhất khi cần. Lưu ý rằng GitHub chỉ là một ví dụ. Nếu bạn lưu tài liệu trong GitLab, Confluence, v.v., chúng cũng có thể có máy chủ MCP.

Bây giờ Kiro có thể truy cập tài liệu trên GitHub trực tiếp, bạn có thể nghĩ về việc xóa tệp steering. Nhưng thực tế, chúng ta thấy rằng **cả hai đều cần thiết**. Giả sử tôi yêu cầu Kiro `tạo một hàm để cộng 2 số`. Không có gì trong yêu cầu đó cho biết sử dụng MathJSON hoặc tài liệu của MathJSON được lưu trên GitHub. Kiro rất có thể sẽ viết hàm bằng Python. Tệp steering giúp Kiro **kết nối các mảnh ghép lại với nhau**.

Trong ví dụ sau, bạn có thể thấy chúng ta đã cập nhật tệp steering để nói cho Kiro biết rằng chúng ta đang sử dụng MathJSON và tài liệu có sẵn trên GitHub. Hơn nữa, chúng ta đã chỉ dẫn Kiro sử dụng máy chủ MCP của GitHub để truy cập tài liệu.

```markdown
# Tổng quan về DSL MathJSON

Dự án này sử dụng MathJSON, một ngôn ngữ dành riêng cho miền cho các biểu thức toán học. MathJSON cung cấp một cách có cấu trúc để biểu diễn và xử lý công thức toán học sử dụng cú pháp JSON.

## Tài liệu tham khảo chính

Tài liệu MathJSON đầy đủ có sẵn trong kho lưu trữ YOUR_ORG_NAME/mathjson. Sử dụng máy chủ MCP của GitHub để truy cập các tệp này:

- **Tài liệu chính**: Sử dụng `mcp_github_get_file_contents` với owner="sampleorg", repo="mathjson", path="README.md"
- **Tài liệu tham khảo hàm**: Sử dụng `mcp_github_get_file_contents` với owner="sampleorg", repo="mathjson", path="function_reference.md"
- **Tài liệu tham khảo cú pháp**: Sử dụng `mcp_github_get_file_contents` với owner="sampleorg", repo="mathjson", path="syntax_reference.md"
- **Ví dụ**: Sử dụng `mcp_github_get_file_contents` với owner="sampleorg", repo="mathjson", path="examples.md"
- **Biến môi trường**: Sử dụng `mcp_github_get_file_contents` với owner="sampleorg", repo="mathjson", path="ENVIRONMENT_VARIABLES.md"
- **Khắc phục sự cố**: Sử dụng `mcp_github_get_file_contents` với owner="sampleorg", repo="mathjson", path="TROUBLESHOOTING_VARIABLES.md"
```

Lưu ý rằng chúng ta đang cung cấp tham chiếu đến tệp cụ thể. Đây là **tối ưu hóa hiệu suất**. Nếu chỉ cung cấp tham chiếu đến kho lưu trữ, Kiro sẽ mất quá nhiều thời gian để khám phá kho lưu trữ và đọc tệp.

Tôi cũng muốn chỉ ra rằng GitHub không phải là kho lưu trữ tài liệu lý tưởng. Kiro sẽ được hưởng lợi từ việc tài liệu được chia nhỏ theo chủ đề và lưu những phần đó trong cơ sở dữ liệu vector. Điều này sẽ cho phép Kiro chỉ truy cập những phần tài liệu cần thiết. Tuy nhiên, bài viết này đang trở nên hơi dài, vì vậy tôi sẽ để chủ đề đó cho một bài viết khác.

---

## Yêu cầu Kiro cập nhật kiến thức

Tại thời điểm này, tệp steering của tôi chủ yếu đóng vai trò như **con trỏ đến tài liệu**. Tuy nhiên, vẫn có một số tài liệu tổng quan trong tệp steering, cùng với phần phương pháp hay. Quan trọng hơn, tôi đang **thường xuyên yêu cầu Kiro cập nhật tệp steering**.

Mỗi khi Kiro mắc lỗi hoặc gặp vấn đề, tôi yêu cầu nó thực hiện cập nhật trong khi vấn đề vẫn còn trong ngữ cảnh.

Trong ví dụ sau, bạn có thể thấy Kiro đang giải quyết vấn đề về định dạng của biến môi trường. Khi công cụ kiểm tra lỗi xác định vấn đề, Kiro sử dụng máy chủ MCP để đọc tài liệu và sửa lỗi.

*(Có ảnh chụp màn hình minh họa Kiro sửa lỗi định dạng biến môi trường)*

Khi Kiro giải quyết những vấn đề này, nó học được **kỹ năng mới**. Tuy nhiên, kiến thức mới đó chỉ được giữ lại trong suốt cuộc trò chuyện. Do đó, Kiro có thể mắc cùng một lỗi trong phiên tương lai. Đây là cơ hội tuyệt vời để yêu cầu Kiro cập nhật tệp steering.

*(Có ảnh chụp màn hình minh họa Kiro cập nhật tệp steering)*

Sau khi học về cú pháp biến môi trường của MathJSON, Kiro đã thêm phần sau vào tệp steering:

```markdown
## Phương pháp hay cho biến môi trường

### Cú pháp biến
- Sử dụng cú pháp `{"variable": "env:TÊN_BIẾN"}` cho biến môi trường
- Tên biến phải bắt đầu bằng chữ cái hoặc dấu gạch dưới và chỉ chứa ký tự chữ và số và dấu gạch dưới
- Sử dụng tên mô tả như `PRINCIPAL`, `ANNUAL_RATE`, `LOAN_TERM_YEARS`
```

Theo thời gian, Kiro sẽ tiếp tục tinh chỉnh hướng dẫn, mở rộng kiến thức về DSL của tôi, và cải thiện mã mà nó viết.

---

## Kết hợp tất cả lại

Sau một vài lần lặp, Kiro đã sẵn sàng tạo MathJSON. Tôi yêu cầu Kiro tạo một hàm để mô hình hóa việc trả nợ thế chấp trước hạn.

```
Tạo một hàm để mô hình hóa việc trả nợ thế chấp trước hạn, nhận số tiền gốc, lãi suất, và số tiền trả trước hạn làm đầu vào, và trả về số tiền tiết kiệm được trong suốt thời gian vay.
```

Kiro đã sẵn sàng tạo MathJSON cho tôi. Dưới đây là MathJSON mà Kiro đã tạo cho tính toán trả nợ thế chấp trước hạn:

```json
{
  "multiplication": {
    "multiplicand": {"variable": "env:OVERPAYMENT_AMOUNT"},
    "multiplier": {
      "subtraction": {
        "minuend": {
          "multiplication": {
            "multiplicand": {"variable": "env:LOAN_TERM_YEARS"},
            "multiplier": 12
          }
        },
        "subtrahend": {
          "division": {
            "dividend": {
              "log": {
                "value": {
                  "subtraction": {
                    "minuend": 1,
                    "subtrahend": {
                      "division": {
                        "dividend": {
                          "multiplication": {
                            "multiplicand": {"variable": "env:OVERPAYMENT_AMOUNT"},
                            "multiplier": {
                              "division": {
                                "dividend": {"variable": "env:ANNUAL_RATE"},
                                "divisor": 12
                              }
                            }
                          }
                        },
                        "divisor": {"variable": "env:PRINCIPAL"}
                      }
                    }
                  }
                },
                "base": {
                  "addition": {
                    "addend1": 1,
                    "addend2": {
                      "division": {
                        "dividend": {"variable": "env:ANNUAL_RATE"},
                        "divisor": 12
                      }
                    }
                  }
                }
              }
            },
            "divisor": {
              "log": {
                "value": {
                  "addition": {
                    "addend1": 1,
                    "addend2": {
                      "division": {
                        "dividend": {"variable": "env:ANNUAL_RATE"},
                        "divisor": 12
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

Và tất nhiên, Kiro tuân theo phương pháp hay được định nghĩa trong tệp steering, **kiểm tra lỗi và thử nghiệm mã** mà nó viết, xác minh rằng mã đúng về mặt cú pháp.

---

## Kết luận

Việc dạy Kiro hiểu và làm việc với thư viện tùy chỉnh như MathJSON cho thấy sức mạnh của việc kết hợp tệp steering và Model Context Protocol. Bằng cách tuân theo phương pháp được trình bày trong bài viết này - **tinh chỉnh tài liệu, thiết lập phương pháp hay rõ ràng, tận dụng MCP cho kiến thức cập nhật** - bạn có thể dạy Kiro làm việc với thư viện tùy chỉnh, ngôn ngữ, và công cụ của mình.

**Hãy bắt đầu với Kiro**: https://kiro.dev/downloads/

---

## Các điểm chính

### Về Kiro và Công cụ
1. **Kiro** - Trợ lý AI và môi trường phát triển với hỗ trợ tệp steering và MCP
2. **Tệp Steering** - Tệp Markdown trong `.kiro/steering/` cung cấp kiến thức dự án lâu dài
3. **Model Context Protocol (MCP)** - Giao thức để truy cập nguồn dữ liệu bên ngoài và tài liệu
4. **Tính năng tinh chỉnh** - Kiro có thể tối ưu tài liệu dài dòng (3,500 → 102 dòng)

### Về MathJSON (DSL mẫu)
5. **MathJSON** - Ngôn ngữ biểu thức toán học giả định dựa trên JSON
6. **Thuật ngữ toán học chính xác** - số hạng, số bị trừ, số nhân, v.v.
7. **Phần mở rộng tệp** `.math` - Biểu thức lồng nhau, hỗ trợ biến môi trường

### Phương pháp và thực hành tốt
8. **Giai đoạn 1** - Bắt đầu với tài liệu nhưng nó dài dòng và lặp lại
9. **Giai đoạn 2** - Sử dụng Refine để giảm 3,500 dòng xuống 102 dòng
10. **Giai đoạn 3** - Thêm phương pháp hay quy định (NÊN làm gì, không chỉ CÓ THỂ làm gì)
11. **Giai đoạn 4** - Sử dụng MCP để truy cập tài liệu cập nhật từ GitHub
12. **Giai đoạn 5** - Kết hợp tệp steering (ngữ cảnh) và MCP (tài liệu chi tiết)
13. **Giai đoạn 6** - Thường xuyên yêu cầu Kiro cập nhật tệp steering sau khi giải quyết vấn đề

### Hiểu biết quan trọng
14. **Cần cả tệp steering VÀ MCP** - Steering cung cấp ngữ cảnh để biết KHI NÀO dùng MCP
15. **Tham chiếu tệp cụ thể** - Tối ưu hóa hiệu suất thay vì tham chiếu kho lưu trữ chung
16. **Kiến thức bền vững** - Cập nhật tệp steering để bài học học được tồn tại qua các phiên
17. **Hướng dẫn quy định** - Nói cho Kiro biết NÊN sử dụng thế nào (không chỉ CÓ THỂ làm gì)
18. **Kiểm tra tự động** - Xây dựng kiểm tra lỗi và thử nghiệm vào phương pháp hay
19. **Phát triển theo thời gian** - Tệp steering tinh chỉnh hướng dẫn dựa trên sử dụng thực tế

### Ứng dụng
20. **Áp dụng được cho** - Ngôn ngữ quy trình làm việc, cú pháp cấu hình, công cụ xử lý quy tắc, DSL, thư viện tùy chỉnh
21. **Bất kỳ doanh nghiệp nào** có công cụ nội bộ tùy chỉnh đều có thể hưởng lợi
22. **Tương lai với cơ sở dữ liệu vector** - Chia nhỏ tài liệu theo chủ đề để truy cập tối ưu

---

## Tài nguyên liên quan

### Tài nguyên Kiro
- Trang web Kiro: https://kiro.dev/
- Tài liệu Steering: https://kiro.dev/docs/steering/
- Tài liệu MCP: https://kiro.dev/docs/mcp/
- Tải Kiro: https://kiro.dev/downloads/

### Bài viết gốc
- Bài đăng blog gốc: https://kiro.dev/blog/teaching-kiro-new-tricks-with-agent-steering-and-mcp/

---

**Đối tượng mục tiêu:** Lập trình viên, kỹ sư DevOps, đội ngũ có thư viện/DSL tùy chỉnh  
**Cấp độ:** Trung cấp - Giả định có kiến thức về trợ lý lập trình AI và phát triển công cụ tùy chỉnh  
**Trường hợp sử dụng:** Dạy trợ lý AI làm việc với thư viện độc quyền, ngôn ngữ quy trình làm việc, hệ thống cấu hình, công cụ xử lý quy tắc
