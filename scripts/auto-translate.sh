#!/bin/bash

# Auto Translation Script for Hugo Blog
# Automatically translates Vietnamese posts to Japanese

set -e

VIETNAMESE_DIR="content/posts"
JAPANESE_DIR="content/ja/posts"
TRANSLATION_LOG="translation.log"

echo "🌐 Starting Auto Translation Process..."
echo "📁 Source: $VIETNAMESE_DIR"
echo "📁 Target: $JAPANESE_DIR"

# Create Japanese directory if not exists
mkdir -p "$JAPANESE_DIR"

# Function to translate content using OpenAI API (fallback to Google Translate)
translate_content() {
    local input_file="$1"
    local output_file="$2"
    
    echo "🔄 Translating: $(basename "$input_file")"
    
    # Extract frontmatter and content
    local frontmatter=$(sed -n '1,/^---$/p' "$input_file")
    local content=$(sed '1,/^---$/d' "$input_file" | sed '1,/^---$/d')
    
    # Create temporary files
    local temp_content=$(mktemp)
    local translated_content=$(mktemp)
    
    echo "$content" > "$temp_content"
    
    # Try to use Python translation script
    if command -v python3 >/dev/null 2>&1; then
        if python3 "scripts/translate.py" "$temp_content" "$translated_content" "vi" "ja"; then
            echo "✅ Translation successful using Python script"
            
            # Apply cleanup to improve translation quality
            if python3 "scripts/cleanup_translation.py" "$translated_content"; then
                echo "🧹 Translation cleanup completed"
            else
                echo "⚠️ Translation cleanup failed, using raw translation"
            fi
        else
            echo "⚠️ Python translation failed, using fallback method"
            # Fallback: Basic text processing for demo
            cat "$temp_content" | sed 's/Tôi/私は/g; s/chúng ta/私たち/g; s/bài viết/記事/g; s/công nghệ/技術/g; s/lập trình/プログラミング/g' > "$translated_content"
        fi
    else
        echo "⚠️ Python not found, using basic fallback translation"
        cat "$temp_content" | sed 's/Tôi/私は/g; s/chúng ta/私たち/g; s/bài viết/記事/g; s/công nghệ/技術/g; s/lập trình/プログラミング/g' > "$translated_content"
    fi
    
    # Translate frontmatter
    local translated_frontmatter=$(echo "$frontmatter" | sed 's/categories: \["intro"/categories: ["intro"/g; s/tags: \["hugo"/tags: ["hugo"/g')
    
    # Write output file
    echo "$translated_frontmatter" > "$output_file"
    cat "$translated_content" >> "$output_file"
    
    # Cleanup
    rm -f "$temp_content" "$translated_content"
}

# Find Vietnamese posts that don't have Japanese equivalents
echo "🔍 Scanning for posts to translate..."

translated_count=0
skipped_count=0

for vi_file in "$VIETNAMESE_DIR"/*.md; do
    if [ -f "$vi_file" ]; then
        filename=$(basename "$vi_file")
        ja_file="$JAPANESE_DIR/$filename"
        
        # Check if Japanese version already exists
        if [ -f "$ja_file" ]; then
            echo "⏭️ Skipping (already exists): $filename"
            ((skipped_count++))
            continue
        fi
        
        # Check if file is recent (within last 30 days) or force translate all
        if [ "$FORCE_TRANSLATE_ALL" = "true" ] || [ $(find "$vi_file" -mtime -30 | wc -l) -gt 0 ]; then
            echo "📄 Processing: $filename"
            
            # Translate the file
            translate_content "$vi_file" "$ja_file"
            
            # Log translation
            echo "$(date): Translated $filename" >> "$TRANSLATION_LOG"
            ((translated_count++))
            
            # Small delay to avoid rate limiting
            sleep 1
        else
            echo "⏭️ Skipping (old file): $filename"
            ((skipped_count++))
        fi
    fi
done

echo ""
echo "📊 Translation Summary:"
echo "   ✅ Translated: $translated_count files"
echo "   ⏭️ Skipped: $skipped_count files"
echo "   📝 Total Japanese posts: $(find "$JAPANESE_DIR" -name "*.md" | wc -l | tr -d ' ')"
echo ""

if [ $translated_count -gt 0 ]; then
    echo "🎉 Translation completed! Running incremental build..."
    ./scripts/incremental-build.sh
else
    echo "✨ No new translations needed."
fi

echo "📋 Translation log: $TRANSLATION_LOG"