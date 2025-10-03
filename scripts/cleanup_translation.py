#!/usr/bin/env python3
"""
Advanced Translation Cleanup Script
Improves the quality of auto-translated content
"""

import sys
import os
import re

def clean_mixed_language_content(text):
    """Clean up mixed Vietnamese-Japanese content"""
    
    # Advanced Vietnamese to Japanese mappings
    cleanup_mappings = {
        # Fix mixed phrases
        "記事 này": "この記事",
        "của AI": "のAI",
        "について AI": "AIについて",
        "使用 trong": "で使用",
        "仕事で việc": "仕事",
        "tập hợp ヒント": "ヒント集",
        "ために ứng dụng": "のための活用",
        "việc làm": "作業",
        
        # Complete Vietnamese phrases that weren't translated
        "chuyên sâu về kinh nghiệm": "専門的な経験について",
        "tiết lộ những": "公開する",
        "tip và tricks": "コツとテクニック",
        "thực tế": "実践的",
        "như một": "として",
        "hãy sử dụng": "使用してください",
        "để ứng dụng": "活用するために",
        
        # Fix remaining Vietnamese words
        "này": "この",
        "những": "の",
        "một": "一つの",
        "các": "の",
        "có thể": "できる",
        "được": "される",
        "sẽ": "します",
        "đã": "した",
        "đang": "している",
        "bị": "される",
        
        # Improve sentence structure
        "。 Hãy": "。",
        "。 Những": "。",
        "。 Để": "。",
        ". về": "について",
        ". của": "の",
        ". từ": "から",
        
        # Fix broken titles and headers
        "経験を学ぶ 使用": "AI SCREAM使用経験を学ぶ",
        "対象読者 của": "対象読者の",
        
        # Improve readability
        "AI SCREAM を": "AI SCREAMを",
        "AI を": "AIを",
        "技術 を": "技術を",
        "記事 を": "記事を",
    }
    
    cleaned_text = text
    for vietnamese, japanese in cleanup_mappings.items():
        cleaned_text = cleaned_text.replace(vietnamese, japanese)
    
    # Remove remaining Vietnamese words commonly missed
    vietnamese_words = [
        'và', 'hoặc', 'nhưng', 'vì', 'nên', 'để', 'với', 'trong', 'trên', 'dưới',
        'của', 'từ', 'về', 'cho', 'theo', 'như', 'được', 'sẽ', 'đã', 'đang',
        'là', 'có', 'không', 'rất', 'nhiều', 'ít', 'tất cả', 'một số',
        'bài', 'phần', 'chương', 'mục', 'điểm', 'phương pháp', 'cách',
        'thời gian', 'lúc', 'khi', 'sau', 'trước', 'giữa', 'cuối',
        'đầu', 'giữa', 'cuối', 'hơn', 'nhất', 'rồi', 'xong'
    ]
    
    for word in vietnamese_words:
        # Remove standalone Vietnamese words
        pattern = r'\b' + re.escape(word) + r'\b'
        cleaned_text = re.sub(pattern, '', cleaned_text, flags=re.IGNORECASE)
    
    # Clean up extra spaces and formatting
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)  # Multiple spaces to single
    cleaned_text = re.sub(r'\s*\n\s*', '\n', cleaned_text)  # Clean newlines
    cleaned_text = re.sub(r'\n\n+', '\n\n', cleaned_text)  # Multiple newlines to double
    
    return cleaned_text.strip()

def improve_japanese_structure(text):
    """Improve Japanese sentence structure"""
    
    # Common improvements for Japanese text
    improvements = {
        # Fix particles
        'のの': 'の',
        'をを': 'を',
        'にに': 'に',
        'はは': 'は',
        'がが': 'が',
        
        # Fix sentence endings
        ' です ': 'です',
        ' ます ': 'ます',
        ' である ': 'である',
        
        # Improve readability
        'AI SCREAM使用': 'AI SCREAMの使用',
        'AI技術': 'AI技術',
        'プログラミング言語': 'プログラミング言語',
        
        # Fix spacing around punctuation
        ' 。': '。',
        ' 、': '、',
        ' ？': '？',
        ' ！': '！',
        '( ': '（',
        ' )': '）',
    }
    
    improved_text = text
    for old, new in improvements.items():
        improved_text = improved_text.replace(old, new)
    
    return improved_text

def clean_translation_file(input_file, output_file=None):
    """Clean up a translated markdown file"""
    
    if output_file is None:
        output_file = input_file
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"🧹 Cleaning translation: {input_file}")
        
        # Apply cleaning
        cleaned_content = clean_mixed_language_content(content)
        cleaned_content = improve_japanese_structure(cleaned_content)
        
        # Write output
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        
        print(f"✅ Cleaned translation saved: {output_file}")
        return True
        
    except Exception as e:
        print(f"❌ Cleaning failed: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 cleanup_translation.py <input_file> [output_file]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    success = clean_translation_file(input_file, output_file)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()