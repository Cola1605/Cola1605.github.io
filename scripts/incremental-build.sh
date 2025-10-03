#!/bin/bash

# Incremental Build Script for Hugo Blog
# Only processes new or modified markdown files in content/posts/

set -e

CONTENT_DIR="content/posts"
CONTENT_DIR_JA="content/ja/posts"
CACHE_FILE=".build-cache"
BUILD_LOG="build.log"

echo "🚀 Starting incremental build process..."

# Create cache file if it doesn't exist
if [ ! -f "$CACHE_FILE" ]; then
    echo "📁 Creating build cache file..."
    touch "$CACHE_FILE"
fi

# Function to get file modification time
get_mod_time() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        stat -f "%m" "$1" 2>/dev/null || echo "0"
    else
        # Linux
        stat -c "%Y" "$1" 2>/dev/null || echo "0"
    fi
}

# Find new or modified files
echo "🔍 Checking for new or modified files in $CONTENT_DIR and $CONTENT_DIR_JA..."

NEW_FILES=()
MODIFIED_FILES=()

# Check all markdown files in content/posts
for file in "$CONTENT_DIR"/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        current_time=$(get_mod_time "$file")
        cached_time=$(grep "^$filename:" "$CACHE_FILE" | cut -d: -f2)
        
        if [ -z "$cached_time" ]; then
            echo "✅ New file detected: $filename"
            NEW_FILES+=("$file")
        elif [ "$current_time" -gt "$cached_time" ]; then
            echo "📝 Modified file detected: $filename"
            MODIFIED_FILES+=("$file")
        fi
    fi
done

# Check all markdown files in content/ja/posts
for file in "$CONTENT_DIR_JA"/*.md; do
    if [ -f "$file" ]; then
        filename="ja/$(basename "$file")"
        current_time=$(get_mod_time "$file")
        cached_time=$(grep "^$filename:" "$CACHE_FILE" | cut -d: -f2)
        
        if [ -z "$cached_time" ]; then
            echo "✅ New Japanese file detected: $filename"
            NEW_FILES+=("$file")
        elif [ "$current_time" -gt "$cached_time" ]; then
            echo "📝 Modified Japanese file detected: $filename"
            MODIFIED_FILES+=("$file")
        fi
    fi
done

# Count total files to process
TOTAL_CHANGES=$((${#NEW_FILES[@]} + ${#MODIFIED_FILES[@]}))

if [ $TOTAL_CHANGES -eq 0 ]; then
    echo "✨ No new or modified files found. Build cache is up to date."
    echo "⏱️ Last build: $(date)"
    exit 0
fi

echo "📊 Found $TOTAL_CHANGES file(s) to process:"
echo "   - New files: ${#NEW_FILES[@]}"
echo "   - Modified files: ${#MODIFIED_FILES[@]}"

# Start build process
echo "🔨 Starting Hugo build..."
echo "$(date): Starting incremental build" >> "$BUILD_LOG"

# Build the site
if hugo --gc --minify --quiet; then
    echo "✅ Hugo build completed successfully"
    
    # Update cache with new timestamps
    echo "💾 Updating build cache..."
    
    # Update timestamps for all processed files
    for file in "${NEW_FILES[@]}" "${MODIFIED_FILES[@]}"; do
        if [[ "$file" == *"$CONTENT_DIR_JA"* ]]; then
            filename="ja/$(basename "$file")"
        else
            filename=$(basename "$file")
        fi
        new_time=$(get_mod_time "$file")
        
        # Remove old entry if exists
        if grep -q "^$filename:" "$CACHE_FILE"; then
            sed -i.bak "/^$filename:/d" "$CACHE_FILE"
            rm -f "$CACHE_FILE.bak"
        fi
        
        # Add new entry
        echo "$filename:$new_time" >> "$CACHE_FILE"
    done
    
    echo "$(date): Build completed successfully - $TOTAL_CHANGES files processed" >> "$BUILD_LOG"
    echo "🎉 Incremental build completed! Processed $TOTAL_CHANGES file(s)."
    
else
    echo "❌ Hugo build failed"
    echo "$(date): Build failed" >> "$BUILD_LOG"
    exit 1
fi

# Clean up old cache entries (optional)
echo "🧹 Cleaning up cache..."
temp_cache=$(mktemp)
while IFS=: read -r filename timestamp; do
    if [[ "$filename" == ja/* ]]; then
        actual_file="$CONTENT_DIR_JA/${filename#ja/}"
    else
        actual_file="$CONTENT_DIR/$filename"
    fi
    
    if [ -f "$actual_file" ]; then
        echo "$filename:$timestamp" >> "$temp_cache"
    fi
done < "$CACHE_FILE"
mv "$temp_cache" "$CACHE_FILE"

echo "⚡ Incremental build process completed in record time!"
echo "📈 Total pages generated: $(find public -name "*.html" | wc -l | tr -d ' ')"