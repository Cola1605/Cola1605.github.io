<<<<<<< HEAD
# Hugo Blog Skeleton (Vietnamese)

Một skeleton **Hugo** tối giản (không phụ thuộc theme ngoài) — chỉ cần copy/paste, viết bài và deploy GitHub Pages.

## 🚀 Chạy local
1. Cài Hugo: https://gohugo.io/installation/
2. Clone/giải nén project này, rồi chạy:
   ```bash
   hugo server -D
   ```
   Truy cập http://localhost:1313 để xem thử.

## ✍️ Viết bài
Tạo bài mới:
```bash
hugo new posts/ten-bai-viet.md
```
Mở file trong `content/posts/`. Đổi `draft: false` để hiển thị.

## 🔧 Cấu hình nhanh
- Sửa `hugo.toml`:
  - `baseURL = "https://YOUR_USERNAME.github.io/"` hoặc domain riêng
  - `title`, `params.author`, `params.description`

## 🌐 Deploy GitHub Pages (gh-pages)
1. Tạo repo mới (public) trên GitHub. Push toàn bộ mã nguồn lên branch `main`:
   ```bash
   git init
   git add .
   git commit -m "init hugo skeleton"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. **Bật GitHub Actions**:
   - Vào repository trên GitHub: `https://github.com/Cola1605/System_News`
   - Click tab **Actions** 
   - Click **"I understand my workflows, go ahead and enable them"** (nếu có)
   - Workflow sẽ tự động chạy khi bạn push code mới
3. **Cấu hình GitHub Pages** - Sau khi workflow chạy xong, vào **Settings → Pages**:
   - **Source**: chọn **GitHub Actions** (nếu có) hoặc **Deploy from a branch**
   - **Branch**: `gh-pages` (root) - nếu chọn deploy from branch
4. Mở `https://cola1605.github.io/System_News/` để xem site.
   - Nếu dùng custom domain, tạo file `static/CNAME` chứa tên miền (VD: `blog.tenban.com`), bật HTTPS trong Pages.

## 🧩 Cấu trúc thư mục
- `content/` — bài viết Markdown
- `layouts/` — template tối giản (base, list, single)
- `assets/css/style.css` — stylesheet
- `static/robots.txt` — robots
- `.github/workflows/hugo.yml` — build & deploy
- `archetypes/default.md` — front matter mặc định

## 🛠️ Tuỳ chỉnh
- Thêm Google Analytics/ Plausible vào `layouts/partials/head.html`
- Tuỳ biến style tại `assets/css/style.css`
- Sửa/ mở rộng layout trong `layouts/`

Chúc bạn viết blog thật vui! ✨
# System_News
=======
# Cola1605.github.io
Personal GitHub Pages Blog
>>>>>>> 708a7c8075c6e7dfb5cbdf81f6c7bbea04f6a622
<- link "役員へ紹介したサイバーエージェントの最先端AI技術を学ぼう！「CA SOTA」" [ref=e357] Force rebuild for pagination fix Fri Oct  3 16:46:31 JST 2025 -->
