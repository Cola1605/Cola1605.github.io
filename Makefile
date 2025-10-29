# Hugo Blog Makefile
# Convenient commands for managing the blog

.PHONY: help build incremental watch clean deploy status new

# Default target
help:
	@echo "🚀 Hugo Blog Management Commands"
	@echo "================================"
	@echo "📦 build        - Full Hugo build (all files)"
	@echo "⚡ incremental  - Smart incremental build (only new/modified files)"
	@echo "👀 watch        - Start file watcher for auto-building"
	@echo "🧹 clean        - Clean public directory and cache"
	@echo "🚀 deploy       - Build and deploy to GitHub Pages"
	@echo "📊 status       - Show build status and file counts"
	@echo "📝 new          - Create new blog post (usage: make new TITLE='Post Title')"
	@echo "💡 help         - Show this help message"

# Full build
build:
	@echo "🔨 Running full Hugo build..."
	@echo "📊 Generating embeddings..."
	npm run generate-embeddings
	./scripts/generate-archives.sh
	hugo --gc --minify
	@echo "✅ Full build completed"

# Incremental build
incremental:
	@echo "⚡ Running incremental build..."
	@echo "📊 Generating embeddings..."
	npm run generate-embeddings
	./scripts/generate-archives.sh
	./scripts/incremental-build.sh

# Watch for changes
watch:
	@echo "👀 Starting file watcher..."
	./scripts/watch-and-build.sh

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf public/
	rm -f .build-cache
	rm -f build.log
	@echo "✅ Clean completed"

# Deploy to GitHub Pages
deploy:
	@echo "🚀 Building and deploying to GitHub Pages..."
	./scripts/incremental-build.sh
	git add .
	git commit -m "Auto-deploy: $(shell date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
	git push origin main
	@echo "✅ Deployment completed"

# Show status
status:
	@echo "📊 Blog Status Report"
	@echo "===================="
	@echo "📝 Markdown files: $(shell find content/posts -name '*.md' | wc -l | tr -d ' ')"
	@echo "🌐 Generated pages: $(shell find public -name '*.html' 2>/dev/null | wc -l | tr -d ' ')"
	@echo "💾 Cache entries: $(shell wc -l .build-cache 2>/dev/null | awk '{print $$1}' || echo '0')"
	@echo "📅 Last build: $(shell tail -1 build.log 2>/dev/null || echo 'Never')"
	@echo "💽 Public directory size: $(shell du -sh public 2>/dev/null | cut -f1 || echo 'N/A')"

# Create new blog post
new:
	@if [ -z "$(TITLE)" ]; then \
		echo "❌ Please provide a title: make new TITLE='Your Post Title'"; \
		exit 1; \
	fi
	@echo "📝 Creating new blog post: $(TITLE)"
	@SLUG=$$(echo "$(TITLE)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_\|_$$//g'); \
	FILENAME="content/posts/$${SLUG}_$(shell date +%Y%m%d).md"; \
	echo "---" > $$FILENAME; \
	echo "title: \"$(TITLE)\"" >> $$FILENAME; \
	echo "date: $(shell date +%Y-%m-%d)" >> $$FILENAME; \
	echo "draft: false" >> $$FILENAME; \
	echo "categories: []" >> $$FILENAME; \
	echo "tags: []" >> $$FILENAME; \
	echo "description: \"\"" >> $$FILENAME; \
	echo "---" >> $$FILENAME; \
	echo "" >> $$FILENAME; \
	echo "# $(TITLE)" >> $$FILENAME; \
	echo "" >> $$FILENAME; \
	echo "Nội dung bài viết..." >> $$FILENAME; \
	echo "✅ Created: $$FILENAME"

# Development server with auto-reload
serve:
	@echo "🌐 Starting Hugo development server..."
	hugo server --bind 0.0.0.0 --port 1313 --buildDrafts --watch

# Quick stats
stats:
	@echo "📈 Quick Stats:"
	@echo "Posts: $(shell find content/posts -name '*.md' | wc -l | tr -d ' ')"
	@echo "Words: $(shell find content/posts -name '*.md' -exec wc -w {} + 2>/dev/null | tail -1 | awk '{print $$1}' || echo '0')"
	@echo "Size: $(shell du -sh content/posts 2>/dev/null | cut -f1 || echo 'N/A')"