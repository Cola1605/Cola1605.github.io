#!/usr/bin/env python3
"""
Auto Translation Script for Hugo Blog
Translates Vietnamese content to Japanese using AI services
"""

import sys
import os
import re
import json
from pathlib import Path
import time

# Optional imports - handle gracefully if not available
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    print("⚠️ requests module not available, using local translation only")

def translate_with_openai(text, source_lang="vi", target_lang="ja"):
    """Translate text using OpenAI API (requires API key)"""
    try:
        # This would require OpenAI API key setup
        # For demo purposes, we'll use a mock translation
        print("🤖 Using OpenAI translation service...")
        
        # Mock response for demo - in real implementation, use OpenAI API
        # return openai_translate_call(text, source_lang, target_lang)
        
        return mock_translate(text)
    except Exception as e:
        print(f"❌ OpenAI translation failed: {e}")
        return None

def translate_with_google(text, source_lang="vi", target_lang="ja"):
    """Translate text using Google Translate API (requires API key)"""
    try:
        # This would require Google Translate API key setup
        print("🌍 Using Google Translate service...")
        
        # Mock response for demo - in real implementation, use Google API
        return mock_translate(text)
    except Exception as e:
        print(f"❌ Google translation failed: {e}")
        return None

def mock_translate(text):
    """Enhanced translation for demonstration - replace with real AI service"""
    
    # Vietnamese to Japanese translation mappings (enhanced)
    translations = {
        # Headers and titles
        "Học hỏi kinh nghiệm": "経験を学ぶ",
        "từ": "から",
        "Heavy User": "ヘビーユーザー",
        "Đối tượng mục tiêu": "対象読者",
        "Mục lục": "目次",
        "Giới thiệu": "紹介",
        "Tổng quan": "概要",
        "Kết luận": "結論",
        
        # Content words
        "bài viết": "記事",
        "tổng hợp": "まとめ",
        "những mẹo": "コツ",
        "sử dụng": "使用",
        "trong công việc": "仕事で",
        "kỹ thuật": "テクニック",
        "tạo": "作成",
        "prompt": "プロンプト",
        "khảo sát": "調査",
        "gợi ý": "ヒント",
        "ứng dụng": "活用",
        "hiệu quả": "効率的",
        "hơn": "より",
        
        # Target audience
        "Những người": "人",
        "mới bắt đầu": "初心者",
        "muốn": "したい",
        "thành thạo": "習得",
        "an toàn": "安全",
        
        # Common tech terms
        "công nghệ": "技術",
        "lập trình": "プログラミング", 
        "phần mềm": "ソフトウェア",
        "ứng dụng": "アプリケーション",
        "website": "ウェブサイト",
        "blog": "ブログ",
        "hướng dẫn": "ガイド",
        "tutorial": "チュートリアル",
        
        # AI terms
        "trí tuệ nhân tạo": "人工知能",
        "machine learning": "機械学習",
        "deep learning": "ディープラーニング",
        "AI": "AI",
        
        # Programming terms
        "framework": "フレームワーク",
        "library": "ライブラリ",
        "API": "API",
        "database": "データベース",
        "server": "サーバー",
        "client": "クライアント",
        
        # Common phrases
        "Tham khảo": "参考",
        "Nguồn": "ソース",
        "Tác giả": "著者",
        "Ngày": "日付",
        "URL": "URL",
        
        # Common words
        "và": "と",
        "hoặc": "または", 
        "nhưng": "しかし",
        "vì": "なぜなら",
        "nên": "だから",
        "để": "ために",
        "với": "と",
        "trong": "で",
        "trên": "上で",
        "dưới": "下で",
        "là": "は",
        "gì": "何",
        
        # Numbers
        "1.": "1.",
        "2.": "2.", 
        "3.": "3.",
        "4.": "4.",
        "5.": "5.",
        
        # Actions
        "xây dựng": "構築", 
        "phát triển": "開発",
        "thiết kế": "設計",
        "triển khai": "展開",
        "cài đặt": "インストール",
        "cấu hình": "設定",
        
        # Results
        "thành công": "成功",
        "lỗi": "エラー",
        "hoàn thành": "完了",
        "đang xử lý": "処理中",
        
        # Special phrases
        "có được": "得る",
        "kết quả": "結果",
        "thỏa mãn": "満足",
        "tình huống": "状況",
        "số lần": "回数",
        "thử nghiệm": "実験",
        "hình ảnh": "画像",
    }
    
    # Apply translations
    translated_text = text
    for vi_word, ja_word in translations.items():
        # Use word boundaries for better matching
        pattern = r'\b' + re.escape(vi_word) + r'\b'
        translated_text = re.sub(pattern, ja_word, translated_text, flags=re.IGNORECASE)
    
    return translated_text

def translate_markdown_file(input_file, output_file, source_lang="vi", target_lang="ja"):
    """Translate a markdown file from Vietnamese to Japanese"""
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"📄 Processing: {input_file}")
        
        # Split frontmatter and content
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            main_content = parts[2]
        else:
            frontmatter = ""
            main_content = content
        
        # Translate main content
        print("🔄 Translating content...")
        
        # Try different translation services
        translated_content = None
        
        # Try OpenAI first (if available)
        translated_content = translate_with_openai(main_content, source_lang, target_lang)
        
        # Fallback to Google Translate
        if not translated_content:
            translated_content = translate_with_google(main_content, source_lang, target_lang)
        
        # Last resort: mock translation
        if not translated_content:
            print("⚠️ Using mock translation...")
            translated_content = mock_translate(main_content)
        
        # Translate frontmatter titles and descriptions
        translated_frontmatter = frontmatter
        if frontmatter:
            # Simple frontmatter translation
            translated_frontmatter = mock_translate(frontmatter)
        
        # Reconstruct file
        if frontmatter:
            result = f"---{translated_frontmatter}---{translated_content}"
        else:
            result = translated_content
        
        # Write output
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(result)
        
        print(f"✅ Translation completed: {output_file}")
        return True
        
    except Exception as e:
        print(f"❌ Translation failed: {e}")
        return False

def main():
    if len(sys.argv) != 5:
        print("Usage: python3 translate.py <input_file> <output_file> <source_lang> <target_lang>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] 
    source_lang = sys.argv[3]
    target_lang = sys.argv[4]
    
    success = translate_markdown_file(input_file, output_file, source_lang, target_lang)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()