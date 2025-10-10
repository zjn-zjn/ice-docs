#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片优化脚本
- 检查并添加图片的alt属性（用于markdown文件）
- 生成WebP格式的图片以提高性能
- 压缩图片大小
"""

import os
import sys
from pathlib import Path
from PIL import Image
import re

# 配置
DOCS_DIR = Path(__file__).parent.parent / 'docs'
PUBLIC_IMAGES_DIR = DOCS_DIR / '.vuepress' / 'public' / 'images'
QUALITY = 85  # WebP质量
MAX_WIDTH = 1920  # 图片最大宽度

def convert_to_webp(image_path):
    """将图片转换为WebP格式"""
    try:
        # 打开图片
        img = Image.open(image_path)
        
        # 如果图片太大，进行缩放
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_height = int(img.height * ratio)
            img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
        
        # 生成WebP文件路径
        webp_path = image_path.with_suffix('.webp')
        
        # 转换为RGB模式（如果是RGBA）
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # 保存为WebP
        img.save(webp_path, 'WEBP', quality=QUALITY, method=6)
        
        # 计算文件大小节省
        original_size = os.path.getsize(image_path)
        webp_size = os.path.getsize(webp_path)
        saved = original_size - webp_size
        percentage = (saved / original_size) * 100 if original_size > 0 else 0
        
        print(f"✓ 转换成功: {image_path.name} -> {webp_path.name}")
        print(f"  文件大小: {original_size/1024:.1f}KB -> {webp_size/1024:.1f}KB (节省 {percentage:.1f}%)")
        
        return True
    except Exception as e:
        print(f"✗ 转换失败: {image_path.name} - {str(e)}")
        return False

def optimize_images():
    """优化所有图片"""
    print(f"开始优化图片...")
    print(f"目标目录: {PUBLIC_IMAGES_DIR}\n")
    
    if not PUBLIC_IMAGES_DIR.exists():
        print(f"错误: 目录不存在 {PUBLIC_IMAGES_DIR}")
        return
    
    # 支持的图片格式
    image_extensions = ['.png', '.jpg', '.jpeg']
    
    # 统计信息
    total_images = 0
    converted_images = 0
    total_saved = 0
    
    # 遍历所有图片
    for ext in image_extensions:
        for image_path in PUBLIC_IMAGES_DIR.rglob(f'*{ext}'):
            total_images += 1
            
            # 检查是否已有WebP版本
            webp_path = image_path.with_suffix('.webp')
            if webp_path.exists():
                print(f"⊙ 跳过(已存在): {image_path.name}")
                continue
            
            # 转换为WebP
            if convert_to_webp(image_path):
                converted_images += 1
            
            print()  # 空行分隔
    
    # 打印统计信息
    print("\n" + "="*60)
    print(f"优化完成!")
    print(f"总图片数: {total_images}")
    print(f"已转换: {converted_images}")
    print(f"已跳过: {total_images - converted_images}")
    print("="*60)

def check_markdown_alt_text():
    """检查Markdown文件中的图片是否有alt文本"""
    print(f"\n检查Markdown文件中的图片alt文本...")
    print(f"目标目录: {DOCS_DIR}\n")
    
    issues = []
    
    # 正则表达式匹配图片
    img_pattern = re.compile(r'!\[(.*?)\]\((.*?)\)')
    
    # 遍历所有markdown文件
    for md_file in DOCS_DIR.rglob('*.md'):
        if '.vuepress' in str(md_file):
            continue
        
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 查找所有图片
        for match in img_pattern.finditer(content):
            alt_text = match.group(1)
            img_src = match.group(2)
            
            if not alt_text or alt_text.strip() == '':
                issues.append({
                    'file': md_file.relative_to(DOCS_DIR),
                    'src': img_src,
                    'line': content[:match.start()].count('\n') + 1
                })
    
    # 打印结果
    if issues:
        print(f"⚠ 发现 {len(issues)} 个图片缺少alt文本:\n")
        for issue in issues:
            print(f"  文件: {issue['file']}")
            print(f"  行号: {issue['line']}")
            print(f"  图片: {issue['src']}")
            print(f"  建议: ![描述性文本]({issue['src']})")
            print()
    else:
        print("✓ 所有图片都有alt文本!")
    
    print("="*60)

def generate_image_report():
    """生成图片使用报告"""
    print(f"\n生成图片使用报告...\n")
    
    # 统计各类型图片
    stats = {
        'png': {'count': 0, 'size': 0},
        'jpg': {'count': 0, 'size': 0},
        'jpeg': {'count': 0, 'size': 0},
        'webp': {'count': 0, 'size': 0},
        'svg': {'count': 0, 'size': 0},
    }
    
    for ext in stats.keys():
        for img_path in PUBLIC_IMAGES_DIR.rglob(f'*.{ext}'):
            stats[ext]['count'] += 1
            stats[ext]['size'] += os.path.getsize(img_path)
    
    # 打印报告
    print("="*60)
    print("图片统计报告")
    print("="*60)
    print(f"{'格式':<10} {'数量':<10} {'总大小':<15}")
    print("-"*60)
    
    total_count = 0
    total_size = 0
    
    for ext, data in stats.items():
        if data['count'] > 0:
            size_mb = data['size'] / (1024 * 1024)
            print(f"{ext.upper():<10} {data['count']:<10} {size_mb:.2f} MB")
            total_count += data['count']
            total_size += data['size']
    
    print("-"*60)
    total_size_mb = total_size / (1024 * 1024)
    print(f"{'总计':<10} {total_count:<10} {total_size_mb:.2f} MB")
    print("="*60)

if __name__ == '__main__':
    print("Ice 文档图片优化工具")
    print("="*60 + "\n")
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == 'convert':
            optimize_images()
        elif command == 'check':
            check_markdown_alt_text()
        elif command == 'report':
            generate_image_report()
        else:
            print(f"未知命令: {command}")
            print("\n使用方法:")
            print("  python optimize_images.py convert  - 转换图片为WebP格式")
            print("  python optimize_images.py check    - 检查图片alt文本")
            print("  python optimize_images.py report   - 生成图片统计报告")
    else:
        # 默认执行所有操作
        optimize_images()
        check_markdown_alt_text()
        generate_image_report()

