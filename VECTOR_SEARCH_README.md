# 🔮 Vector Search với AI Embeddings

## ✨ Tính năng

Hệ thống tìm kiếm thông minh sử dụng **AI embeddings** để tìm kiếm theo ngữ nghĩa, không chỉ từ khóa.

### So sánh Keyword vs Vector Search

| Tính năng | Keyword Search | Vector Search (AI) |
|-----------|---------------|-------------------|
| Tìm chính xác từ | ✅ Excellent | ✅ Good |
| Tìm ngữ nghĩa | ❌ Poor | ✅ Excellent |
| Tìm từ đồng nghĩa | ❌ No | ✅ Yes |
| Tốc độ | ⚡ Instant | 🐢 ~500ms |
| File size | 📦 15KB | 📦 435KB |

### Ví dụ

**Query:** "học AI"

**Keyword Search:**
- Chỉ tìm bài có chữ "học" VÀ "AI"
- Bỏ sót: "đào tạo AI", "training machine learning"

**Vector Search (AI):**
- Tìm bài về: học AI, đào tạo AI, training, reskilling
- Hiểu ngữ nghĩa: "học" ≈ "đào tạo" ≈ "training"
- Scoring: Hiển thị % độ phù hợp

## 🚀 Cách sử dụng

### 1. Trên website

1. Vào https://cola1605.github.io
2. Tìm widget "🔍 Tìm kiếm" ở sidebar
3. Tick vào "🔮 Tìm kiếm thông minh (AI)"
4. Nhập query và nhấn Search

**Lần đầu tiên:**
- Sẽ tải AI model (~10-20 giây)
- Các lần sau: instant

### 2. Build locally

```bash
# Install dependencies
npm install

# Generate embeddings
npm run generate-embeddings

# Build Hugo
hugo --gc --minify

# Or use Makefile
make build
```

## 🔧 Technical Details

### Architecture

```
[Build Time]
content/posts/*.md 
  → parse frontmatter + content
  → generate embeddings (all-MiniLM-L6-v2)
  → save to static/data/embeddings.min.json

[Runtime]
User query 
  → load Transformers.js
  → generate query embedding
  → cosine similarity vs all posts
  → return top 10 results (score > 0.3)
```

### Model

- **Model:** `Xenova/all-MiniLM-L6-v2`
- **Dimensions:** 384
- **Type:** Sentence transformers
- **Size:** ~25MB (cached in browser)
- **Language:** Multilingual (Vietnamese supported)

### Files

```
scripts/
  └── generate-embeddings.js    # Build-time generation
static/
  ├── js/
  │   ├── vector-search.js      # Vector search engine
  │   └── search.js             # Enhanced search UI
  └── data/
      ├── embeddings.json       # Formatted (578KB)
      └── embeddings.min.json   # Compressed (435KB)
```

### Performance

| Metric | Value |
|--------|-------|
| Embeddings file | 435 KB |
| Model download | ~25 MB (one-time) |
| First search | ~10-20s |
| Subsequent | ~500ms |
| Posts processed | 52 |
| Embedding dim | 384 |

## 📊 Similarity Scoring

Results are scored 0.0 - 1.0:

- **> 0.8:** Very relevant
- **0.6 - 0.8:** Relevant
- **0.3 - 0.6:** Somewhat relevant
- **< 0.3:** Filtered out

## 🔄 Updating Embeddings

Embeddings are auto-generated on every build:

```bash
# Manual generation
npm run generate-embeddings

# Full build (includes embeddings)
make build

# Incremental build (includes embeddings)
make incremental
```

## 🐛 Troubleshooting

### "AI search gặp lỗi"

**Nguyên nhân:**
- Transformers.js load failed
- Network error
- Browser không support

**Giải pháp:**
- Tự động fallback về keyword search
- Thử browser khác (Chrome/Edge recommended)
- Check console logs

### Tìm kiếm chậm

**Lần đầu:** Bình thường (loading model)

**Lần sau vẫn chậm:**
- Check network speed
- Clear browser cache
- Disable extensions

### Kết quả không chính xác

**Điều chỉnh threshold:**

In `static/js/search.js`:

```javascript
// Line 67
const filteredResults = results.filter(r => r.score > 0.3);
// Change 0.3 to 0.4 for stricter results
// Change to 0.2 for more results
```

## 🎯 Best Practices

### Query Tips

✅ **Good queries:**
- "học AI" → finds training, learning content
- "AWS Lambda serverless" → finds related AWS content
- "tối ưu performance" → finds optimization posts

❌ **Bad queries:**
- "a" → too short
- Very long sentences → may be too specific

### When to use AI search?

**Use AI Search when:**
- 🎯 Tìm theo ý nghĩa, không biết từ khóa chính xác
- 🔍 Tìm bài liên quan về một chủ đề
- 🌏 Query bằng ngôn ngữ khác (multi-lingual)

**Use Keyword Search when:**
- 🎯 Biết chính xác từ khóa
- ⚡ Cần kết quả instant
- 📱 Trên mobile (save bandwidth)

## 📈 Future Enhancements

Potential improvements:

- [ ] Hybrid search (keyword + vector)
- [ ] Filter by date, category, tags
- [ ] Query suggestions
- [ ] Highlight matching phrases
- [ ] Related posts based on similarity
- [ ] Compress embeddings (Float32 → Int8)
- [ ] Server-side search API
- [ ] Search analytics

## 📚 References

- [Transformers.js](https://huggingface.co/docs/transformers.js)
- [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [Sentence Transformers](https://www.sbert.net/)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)

## 🤝 Contributing

Improvements welcome! Areas to contribute:

1. Better Vietnamese language support
2. Query optimization
3. UI/UX improvements
4. Performance optimization
5. Documentation

---

**Built with ❤️ using Transformers.js and Hugo**
