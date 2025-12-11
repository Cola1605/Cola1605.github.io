# "Xử lý đó có thực sự song song không?" - Cạm bẫy CPU-bound khi dùng Node.js, Python, Ruby, Go

**Tác giả:** ほりしょー (@h0r15h0)  
**Vai trò:** Product Engineer @ Hacobell  
**Kỹ năng:** Go / Typescript / DDD / CQRS / ES / Agile / Scrum  
**GitHub:** @h0r15h0  
**Twitter:** @h0r15h0  

**Xuất bản:** Hacobell Developers Blog (Publication Pro)  
**Công ty:** Hacobell株式会社  
**Sứ mệnh:** Phát minh ra "tương lai" của logistics  

**Ngày đăng:** 8 tháng 12, 2025  
**Ngày cập nhật:** 9 tháng 12, 2025  
**Tags:** #Go, #Node.js, #Python, #Ruby, #並行処理  

**Advent Calendar:** Bài viết này là ngày thứ 8 của [Hacobell Developers Advent Calendar](https://qiita.com/advent-calendar/2025/hacobell).

**Thống kê:** ❤️ 114 likes | 📖 41 bookmarks | 💬 2 comments

---

## Giới thiệu

"Xử lý đồng thời của ngôn ngữ đó cuối cùng hoạt động như thế nào nhỉ?"

Có phải bạn đôi khi dừng lại và tự hỏi điều này khi bận rộn với công việc phát triển hàng ngày? Trong phát triển ứng dụng hiện đại, việc hiểu về xử lý đồng thời là điều thiết yếu để tận dụng tối đa hiệu năng của CPU đa nhân và mang lại trải nghiệm phản hồi tốt cho người dùng.

Tuy nhiên, tùy theo ngôn ngữ bạn sử dụng, cách tiếp cận và hành vi bên trong của chúng khác nhau đến mức đáng kinh ngạc.

Trong bài viết này, chúng tôi sẽ chọn **Node.js, Python, Ruby, Go** và sắp xếp lại sự khác biệt về cách mô hình xử lý đồng thời của từng ngôn ngữ hoạt động với "tác vụ CPU-bound" và "tác vụ I/O-bound" thông qua các ví dụ code cụ thể.

> ⚠️ **Lưu ý**
> Bài viết này giả định môi trường thực thi đa nhân. Trong môi trường đơn nhân, hiệu quả của xử lý đồng thời/song song có thể không đạt được.

---

## Đối tượng độc giả

Bài viết này hướng đến những người như sau:

- **Developer thường xuyên sử dụng nhiều ngôn ngữ**: Những người muốn hiểu sự khác biệt giữa các mô hình xử lý đồng thời của các ngôn ngữ khác nhau
- **Những người đang xem xét performance tuning**: Những người muốn hiểu sự khác biệt giữa tác vụ I/O-bound và CPU-bound để áp dụng vào việc lựa chọn ngôn ngữ và thiết kế kiến trúc

Bài viết này không đi sâu vào giải thích có hệ thống về multithread/multiprocess mà tập trung vào hành vi khi thực thi trong từng ngôn ngữ. Đối với lý thuyết nền tảng chi tiết, vui lòng tham khảo tài liệu chính thức và sách chuyên môn của từng ngôn ngữ.

---

## Node.js: Single-thread và Non-blocking I/O

> ℹ️ **Thông tin phiên bản**
> ※Node.js đã được kiểm tra với phiên bản dưới đây.
> ```bash
> $ node -v
> v22.17.0
> ```

Chìa khóa để hiểu mô hình xử lý đồng thời của Node.js là **single-thread** và **non-blocking I/O**.

### Tác vụ I/O-bound

Node.js phát huy sức mạnh thực sự ở các tác vụ I/O-bound. Khi xảy ra query database hoặc gọi API bên ngoài (như `fetch`), Node.js không block thread.

Nếu sử dụng `Promise.all`, các xử lý I/O này sẽ được thực thi đồng thời một cách hiệu quả.

**Ví dụ về tác vụ I/O-bound:**

```javascript
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const main = async () => {
  console.log("Bắt đầu xử lý");
  const startTime = Date.now();

  await Promise.all([
    fetchData("https://api.example.com/data1"),
    fetchData("https://api.example.com/data2"),
  ]);

  const endTime = Date.now();
  console.log(`Hoàn thành toàn bộ xử lý (${endTime - startTime}ms)`);
};
```

Khi thực thi code này, 2 lời gọi API sẽ bắt đầu gần như cùng lúc, và tổng thời gian xử lý sẽ chỉ bằng khoảng thời gian chờ của 1 lần gọi.

### Tác vụ CPU-bound

Vậy còn với tính toán nặng CPU-bound thay vì I/O thì sao?

Nếu sử dụng `Promise.all` và `async/await`, có vẻ như có thể xử lý đồng thời giống như I/O.

> ℹ️ **Về xử lý CPU-bound**
> Trong các ví dụ code sau đây, để tái hiện xử lý CPU-bound, chúng tôi sử dụng vòng lặp tính toán lớn. Vòng lặp tính toán mất **khoảng 1 giây**.

Ví dụ, hãy thử thực thi 2 lần đồng thời xử lý mất khoảng 1 giây này.

**Ví dụ về tác vụ CPU-bound:**

```javascript
// Xử lý tính toán nặng (tác vụ CPU-bound)
const cpuHeavyTask = async (taskName) => {
  console.log(`${taskName}: Bắt đầu`);
  const startTime = Date.now();

  // Chiếm CPU với vòng lặp rất lớn (khoảng 1 giây)
  for (let i = 0; i < 5_000_000_000; i++) {}

  const endTime = Date.now();
  console.log(`${taskName}: Kết thúc (${endTime - startTime}ms)`);
  return endTime - startTime;
};

const main = async () => {
  console.log("Bắt đầu xử lý");
  const startTime = Date.now();

  await Promise.all([
    cpuHeavyTask("Task A"),
    cpuHeavyTask("Task B"),
  ]);

  const endTime = Date.now();
  console.log(`Hoàn thành toàn bộ xử lý (${endTime - startTime}ms)`);
};

main();
```

Khi thực thi code này thì sao?

Vì đang yêu cầu thực thi đồng thời 2 task với `Promise.all`, nên dù có 2 task mất 1 giây, tổng thời gian xử lý sẽ khoảng 1 giây (＋α) phải không?

**Thực ra... không phải vậy.** Kết quả thực thi thực tế (tùy môi trường) sẽ như sau:

```
Bắt đầu xử lý
Task A: Bắt đầu
Task A: Kết thúc (khoảng 1000ms)
Task B: Bắt đầu
Task B: Kết thúc (khoảng 1000ms)
Hoàn thành toàn bộ xử lý (khoảng 2000ms)
```

Node.js hoạt động trên single-thread. `Promise` và `async/await` phát huy sức mạnh thực sự với xử lý non-blocking như chờ I/O và có thể thực thi xử lý khác trong lúc chờ.

Tuy nhiên, xử lý như `cpuHeavyTask` chiếm CPU nên không trở thành non-blocking. Trong khi "Task A" chiếm CPU với vòng lặp `for`, Node.js không thể tiến tới xử lý khác (bắt đầu "Task B"). Chỉ khi "Task A" hoàn thành, "Task B" tiếp theo mới được thực thi.

Ngay cả khi sử dụng `Promise.all`, **xử lý CPU-bound vẫn được thực thi tuần tự chứ không đồng thời**.

### Worker Threads: Giải pháp cho tác vụ CPU-bound

Vậy có cách nào để thực thi song song tác vụ CPU-bound trong Node.js không?

Thực ra, từ Node.js v10.5.0 trở đi có thể sử dụng **Worker Threads**. Đây là tính năng thực thi code JavaScript trên thread OS riêng biệt và có thể thực thi song song tác vụ CPU-bound.

---

## Python: Multithread và GIL (Global Interpreter Lock)

> ℹ️ **Thông tin phiên bản**
> ※Python đã được kiểm tra với phiên bản dưới đây.
> ```bash
> $ python --version
> Python 3.13.7
> ```

Python (CPython) hỗ trợ multithread. Tuy nhiên, hành vi của nó đi kèm với ràng buộc lớn gọi là **GIL (Global Interpreter Lock)**.

### Tác vụ I/O-bound

Nói trước kết luận, thread của Python có hiệu quả với tác vụ I/O-bound.

Hãy xem ví dụ thực thi tác vụ I/O-bound với multithread sử dụng module `threading` của Python.

**Ví dụ về tác vụ I/O-bound:**

```python
import threading
import time

# Xử lý đi kèm chờ I/O (tác vụ I/O-bound)
def io_heavy_task(task_name, sleep_time):
    time.sleep(sleep_time)  # Mô phỏng chờ I/O

print("Bắt đầu xử lý")
start_total_time = time.time()

# Tạo 2 thread
t1 = threading.Thread(target=io_heavy_task, args=("Task A", 1))
t2 = threading.Thread(target=io_heavy_task, args=("Task B", 1))

# Bắt đầu thread
t1.start()
t2.start()

# Chờ thread kết thúc
t1.join()
t2.join()

end_total_time = time.time()
print(f"Hoàn thành toàn bộ xử lý ({end_total_time - start_total_time:.2f}s)")
```

Khi thực thi code này, 2 xử lý chờ I/O sẽ bắt đầu gần như cùng lúc, và tổng thời gian xử lý sẽ chỉ bằng khoảng thời gian chờ của 1 lần.

### Tác vụ CPU-bound

Vậy hãy thử thực thi tác vụ CPU-bound giống Node.js với module `threading` của Python.

**Ví dụ về tác vụ CPU-bound:**

```python
import threading
import time

# Xử lý tính toán nặng (tác vụ CPU-bound)
def cpu_heavy_task(task_name):
    print(f"{task_name}: Bắt đầu")
    start_time = time.time()

    # Chiếm CPU với vòng lặp rất lớn (khoảng 1 giây)
    for i in range(5_000_000_000):
        pass

    end_time = time.time()
    print(f"{task_name}: Kết thúc ({end_time - start_time:.2f}s)")

print("Bắt đầu xử lý")
start_total_time = time.time()

# Tạo 2 thread
t1 = threading.Thread(target=cpu_heavy_task, args=("Task A",))
t2 = threading.Thread(target=cpu_heavy_task, args=("Task B",))

# Bắt đầu thread
t1.start()
t2.start()

# Chờ thread kết thúc
t1.join()
t2.join()

end_total_time = time.time()
print(f"Hoàn thành toàn bộ xử lý ({end_total_time - start_total_time:.2f}s)")
```

Đã chia xử lý thành 2 thread (`t1`, `t2`). Nếu là môi trường CPU đa nhân, 2 task sẽ được thực thi song song và tổng thời gian xử lý sẽ khoảng 1 giây (1 task) phải không?

**Thực ra... không phải vậy.** Kết quả thực thi thực tế sẽ như sau:

```
Bắt đầu xử lý
Task A: Bắt đầu
Task B: Bắt đầu
Task A: Kết thúc (2.01s)
Task B: Kết thúc (2.02s)
Hoàn thành toàn bộ xử lý (2.03s)  # Mất thời gian của 2 task
```

Kết quả như vậy trong Python là do sự tồn tại của **GIL (Global Interpreter Lock)**.

GIL là một loại exclusive control, ngăn nhiều thread truy cập đồng thời vào Python object. Với tác vụ CPU-bound, mỗi thread lặp lại việc acquire và release GIL này để thực thi, nên về cơ bản sẽ được xử lý tuần tự từng thread một.

Trong Python (khác với Node.js), bản thân thread sẽ bắt đầu ngay lập tức, nhưng do ràng buộc của GIL này, ngay cả trong môi trường đa nhân, tại cùng một thời điểm chỉ có thể thực thi 1 thread. Do đó, **với tác vụ CPU-bound không trở thành xử lý song song**, và do overhead đó có khả năng mất thời gian tương đương hoặc nhiều hơn thực thi tuần tự.

> ℹ️ **Cải thiện từ Python 3.14 trở đi**
> 
> Từ Python 3.14 trở đi, có cung cấp experimental build có thể **vô hiệu hóa GIL** (free-threaded build). Trong môi trường này, ràng buộc của GIL biến mất và tác vụ CPU-bound cũng có thể song song hóa với multithread.
> 
> Tuy nhiên, có khả năng toàn bộ ecosystem chưa hoàn toàn theo kịp việc hỗ trợ free-threaded. Chúng tôi khuyến nghị thực hiện kiểm chứng đầy đủ trước khi áp dụng trong môi trường production.
> 
> Vui lòng tham khảo các link sau để biết chi tiết:
> - https://atmarkit.itmedia.co.jp/ait/articles/2510/09/news014.html
> - https://docs.python.org/ja/3.14/whatsnew/3.14.html#whatsnew314-free-threaded-now-supported

### multiprocessing: Giải pháp cho tác vụ CPU-bound

Cách để thực thi song song tác vụ CPU-bound trong Python là sử dụng module `multiprocessing`. Vì nó khởi động process riêng biệt nên mỗi process có GIL độc lập và có thể thực thi song song.

---

## Ruby: Multithread và GVL (Global VM Lock)

> ℹ️ **Thông tin phiên bản**
> ※Ruby đã được kiểm tra với phiên bản dưới đây.
> ```bash
> $ ruby -v
> ruby 3.4.7 (2025-10-08 revision 7a5688e2a2) +PRISM [arm64-darwin23]
> ```

Ruby (MRI/CRuby) cũng giống Python, hỗ trợ multithread và có **GVL (Global VM Lock)** rất giống với GIL của Python.

### Tác vụ I/O-bound

Ruby cũng giống Python, khi thread vào chờ I/O (blocking I/O) thì release GVL. Do đó, với xử lý I/O-bound, multithread hoạt động hiệu quả.

### Tác vụ CPU-bound

Vậy hãy thử thực thi tác vụ CPU-bound với `Thread` của Ruby.

**Ví dụ về tác vụ CPU-bound:**

```ruby
# Xử lý tính toán nặng (tác vụ CPU-bound)
def cpu_heavy_task(task_name)
  puts "#{task_name}: Bắt đầu"
  start_time = Time.now

  # Chiếm CPU với vòng lặp rất lớn (khoảng 1 giây)
  5_000_000_000.times do |i|
  end

  end_time = Time.now
  puts "#{task_name}: Kết thúc (#{end_time - start_time}s)"
end

puts "Bắt đầu xử lý"
start_total_time = Time.now

# Tạo 2 thread
t1 = Thread.new { cpu_heavy_task("Task A") }
t2 = Thread.new { cpu_heavy_task("Task B") }

# Chờ thread kết thúc
t1.join
t2.join

end_total_time = Time.now
puts "Hoàn thành toàn bộ xử lý (#{end_total_time - start_total_time}s)"
```

Ruby thì sao? Đã chia xử lý thành 2 thread (t1, t2). Thời gian xử lý sẽ giảm một nửa phải không?

Bạn đã hiểu rồi nhỉ. Kết quả thực thi gần giống Python, 2 task không được xử lý song song mà mất thời gian **không khác gì thực thi tuần tự** (hoặc chậm hơn).

```
Bắt đầu xử lý
Task A: Bắt đầu
Task B: Bắt đầu
Task A: Kết thúc (khoảng 2.00s)
Task B: Kết thúc (khoảng 2.01s)
Hoàn thành toàn bộ xử lý (khoảng 2.01s)  # Mất thời gian của 2 task
```

GVL của Ruby cũng đóng vai trò tương tự GIL của Python. Do đó, với tác vụ CPU-bound, nhiều thread không thể thực thi code đồng thời trong VM của Ruby. Kết quả là, giống Python, ngay cả khi sử dụng multithread, xử lý CPU-bound cũng không được song song hóa.

### Ractor: Giải pháp cho tác vụ CPU-bound

Từ Ruby 3.0 trở đi, đã được giới thiệu cơ chế thực thi song song gọi là **Ractor**. Mỗi object `Ractor` có GVL độc lập nên có thể thực thi song song tác vụ CPU-bound.

---

## Go: Goroutine - lightweight thread

> ℹ️ **Thông tin phiên bản**
> ※Go đã được kiểm tra với phiên bản dưới đây.
> ```bash
> $ go version
> go version go1.24.6 darwin/arm64
> ```

Chìa khóa để hiểu mô hình xử lý đồng thời của Go là **Goroutine**. Go khác với Node.js, Python, Ruby, hỗ trợ mạnh mẽ xử lý đồng thời/song song ở cấp độ ngôn ngữ.

### Tác vụ I/O-bound

Go cũng giống Node.js, Python, Ruby, có thể xử lý hiệu quả tác vụ I/O-bound.

Nếu sử dụng Goroutine, có thể thực thi đồng thời nhiều HTTP request hoặc gọi API bên ngoài. Ngay cả khi Goroutine bị block trong lúc chờ I/O, runtime của Go sẽ thực thi Goroutine khác nên tổng thể xử lý tiến triển hiệu quả.

### Tác vụ CPU-bound

Vậy tác vụ CPU-bound không được song song hóa trong Node.js, Python, Ruby thì với Go sao?

Go không tồn tại lock toàn cục như GIL/GVL. Hãy thử cùng một tác vụ CPU-bound bằng cách khởi động xử lý làm Goroutine với keyword `go` và chờ tất cả Goroutine kết thúc với `sync.WaitGroup`.

**Ví dụ về tác vụ CPU-bound:**

```go
package main

import (
	"fmt"
	"runtime"
	"sync"
	"time"
)

// Xử lý tính toán nặng (tác vụ CPU-bound)
func cpuHeavyTask(taskName string, wg *sync.WaitGroup) {
	defer wg.Done() // Thông báo cho WaitGroup khi task hoàn thành

	fmt.Printf("%s: Bắt đầu\n", taskName)
	startTime := time.Now()

	// Chiếm CPU với vòng lặp rất lớn (khoảng 1 giây)
	for i := 0; i < 10_000_000_000; i++ {
	}

	endTime := time.Now()
	fmt.Printf("%s: Kết thúc (%v)\n", taskName, endTime.Sub(startTime))
}

func main() {
	fmt.Println("Bắt đầu xử lý")
	startTime := time.Now()

	var wg sync.WaitGroup // WaitGroup để chờ kết thúc

	// Bắt đầu 2 Goroutine
	wg.Add(2)
	go cpuHeavyTask("Task A", &wg)
	go cpuHeavyTask("Task B", &wg)

	// Chờ tất cả Goroutine kết thúc
	wg.Wait()

	endTime := time.Now()
	fmt.Printf("Hoàn thành toàn bộ xử lý (%v)\n", endTime.Sub(startTime))
}
```

Khi thực thi code này thì sao?

**Thực ra, nó được thực thi song song đúng như kỳ vọng!** Khi thực thi trong môi trường CPU đa nhân, kết quả sẽ như sau:

```
Bắt đầu xử lý
Task B: Bắt đầu
Task A: Bắt đầu
Task A: Kết thúc (khoảng 1.01s)
Task B: Kết thúc (khoảng 1.02s)
Hoàn thành toàn bộ xử lý (khoảng 1.03s)  # Toàn bộ xử lý hoàn thành trong thời gian 1 task
```

Tại sao lại có kết quả như vậy?

Runtime của Go gán Goroutine linh hoạt cho nhiều OS thread (= các CPU core khác nhau) để thực thi.

Không có ràng buộc single-thread như Node.js, cũng không có GIL/GVL như Python/Ruby, nên tác vụ CPU-bound được thực thi song song. Kết quả là, dù có 2 task, tổng thời gian xử lý gần bằng thời gian của 1 task.

> ℹ️ **Về cài đặt GOMAXPROCS**
> 
> Tùy vào cài đặt `GOMAXPROCS()` có thể không song song. Từ Go 1.5 trở đi, mặc định được cài đặt số lượng CPU core khả dụng, nhưng có thể cài đặt rõ ràng với `runtime.GOMAXPROCS(n)` nếu cần.
> 
> ※Từ Go 1.25 trở đi có vẻ logic tính toán giá trị mặc định của `GOMAXPROCS` đã được thay đổi, nhưng vì tác giả không hiểu sâu nên vui lòng tham khảo slide dưới đây để biết chi tiết.
> https://speakerdeck.com/kuro_kurorrr/gomaxprocs-changes-from-go-1-dot-25

---

## Tổng kết

Trong bài viết này, chúng tôi đã thực thi cùng một tác vụ CPU-bound và I/O-bound với 4 ngôn ngữ Node.js, Python, Ruby, Go và xác nhận sự khác biệt về hành vi của chúng.

Mô hình xử lý đồng thời của mỗi ngôn ngữ khác nhau rất lớn tùy theo bối cảnh thời đại ngôn ngữ được thiết kế và vấn đề cần giải quyết. Điều quan trọng không phải là ngôn ngữ nào tốt hơn mà là **hiểu ngôn ngữ nào phù hợp với tác vụ nào**.

Hy vọng bài viết này sẽ giúp các bạn độc giả sắp xếp lại kiến thức hoặc trở thành động lực để học một ngôn ngữ mới.

### Bảng so sánh mô hình xử lý đồng thời của các ngôn ngữ

| Ngôn ngữ | Mô hình xử lý đồng thời | Tác vụ I/O-bound | Tác vụ CPU-bound | Ràng buộc |
|----------|-------------------------|------------------|------------------|-----------|
| **Node.js** | Single-thread<br>Non-blocking I/O | ⭕ Thực thi đồng thời hiệu quả | ❌ Trở thành thực thi tuần tự | Khi block main thread thì xử lý khác cũng dừng |
| **Python** | Multithread<br>GIL | ⭕ Có thể thực thi đồng thời | ❌ Thực thi tuần tự do GIL | GIL ép buộc thực thi từng thread một<br>※Từ Python 3.14 trở đi cải thiện với free-threaded build |
| **Ruby** | Multithread<br>GVL | ⭕ Có thể thực thi đồng thời | ❌ Thực thi tuần tự do GVL | GVL ép buộc thực thi từng thread một |
| **Go** | Lightweight thread<br>Goroutine | ⭕ Thực thi đồng thời hiệu quả | ⭕ Thực thi song song | Có thể tận dụng đa nhân |

---

**Bài gốc:** https://zenn.dev/hacobell_dev/articles/learning-multithreading-in-several-languages

**Link liên quan:**
- [GitHub Source](https://github.com/H0R15H0/zenn-content/blob/main/articles/learning-multithreading-in-several-languages.md)
- [Thông tin tuyển dụng Hacobell株式会社](https://t.hacobell.com//blog/engineer-entrancebook)
