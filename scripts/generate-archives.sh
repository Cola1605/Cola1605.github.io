#!/bin/bash

# Script để tự động tạo archive pages cho từng tháng

cd "$(dirname "$0")/.."

# Tạo thư mục archive nếu chưa có
mkdir -p content/archive

# Xóa các file archive cũ
rm -f content/archive/*.md

# Lấy danh sách tất cả các tháng từ posts
months=$(find content/posts -name "*.md" -type f -exec grep -h "^date:" {} \; | \
  sed 's/date: //' | \
  sed 's/T.*//' | \
  cut -d'-' -f1,2 | \
  sort -u -r)

# Tạo file archive cho từng tháng
for month in $months; do
  year=$(echo $month | cut -d'-' -f1)
  month_num=$(echo $month | cut -d'-' -f2)
  
  # Tạo file archive
  cat > "content/archive/${month}.md" <<EOF
---
title: "Archive ${month}"
month: "${month}"
type: archive
layout: single
url: "/archive/${month}/"
---
EOF
  
  echo "✅ Created archive page for ${month}"
done

echo "🎉 Archive pages generation completed!"
echo "📊 Total months: $(echo "$months" | wc -l)"
