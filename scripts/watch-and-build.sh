#!/bin/bash

# File Watcher Script for Hugo Blog
# Automatically detects new files and runs incremental build

set -e

WATCH_DIR="content/posts"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_SCRIPT="$SCRIPT_DIR/incremental-build.sh"

echo "👀 Starting file watcher for Hugo blog..."
echo "📁 Watching directory: $WATCH_DIR"
echo "🔧 Build script: $BUILD_SCRIPT"

# Check if fswatch is available (macOS)
if command -v fswatch >/dev/null 2>&1; then
    echo "✅ Using fswatch for file monitoring"
    
    # Initial build check
    echo "🔍 Running initial build check..."
    "$BUILD_SCRIPT"
    
    echo "👁️ Starting file watcher... (Press Ctrl+C to stop)"
    echo "📝 Monitoring for new .md files in $WATCH_DIR"
    
    # Watch for changes in content/posts directory
    fswatch -o "$WATCH_DIR" --event Created --event Updated --event Renamed | while read f; do
        echo "🚨 File change detected in $WATCH_DIR"
        echo "⏰ $(date): Running incremental build..."
        
        if "$BUILD_SCRIPT"; then
            echo "✅ Auto-build completed successfully"
            echo "🎯 Ready for new changes..."
        else
            echo "❌ Auto-build failed"
        fi
        echo "---"
    done

# Fallback for systems without fswatch
else
    echo "⚠️ fswatch not found. Installing fswatch..."
    
    # Try to install fswatch on macOS
    if command -v brew >/dev/null 2>&1; then
        echo "📦 Installing fswatch via Homebrew..."
        brew install fswatch
        
        # Restart script with fswatch
        exec "$0" "$@"
    else
        echo "❌ Cannot install fswatch automatically"
        echo "💡 Please install fswatch manually:"
        echo "   macOS: brew install fswatch"
        echo "   Linux: sudo apt-get install fswatch (or equivalent)"
        echo ""
        echo "🔄 Falling back to manual polling mode..."
        
        # Manual polling fallback
        while true; do
            echo "🔍 Checking for changes... ($(date))"
            "$BUILD_SCRIPT"
            echo "😴 Sleeping for 10 seconds..."
            sleep 10
        done
    fi
fi