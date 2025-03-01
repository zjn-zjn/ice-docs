from PIL import Image
import io
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def convert_svg_to_png(svg_path, png_path, width=3024, height=3024):
    # 读取SVG文件
    with open(svg_path, 'r') as f:
        svg_content = f.read()
    
    # 设置Chrome选项
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # 无界面模式
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    
    # 创建一个临时HTML文件来显示SVG
    html = f'''
    <html>
    <body style="margin: 0; padding: 0;">
        <img src="data:image/svg+xml;base64,{base64.b64encode(svg_content.encode()).decode()}"
             style="width: {width}px; height: {height}px;">
    </body>
    </html>
    '''
    
    # 启动Chrome
    driver = webdriver.Chrome(options=chrome_options)
    driver.set_window_size(width, height)
    
    # 将HTML内容写入临时文件
    with open('temp.html', 'w') as f:
        f.write(html)
    
    # 加载HTML并截图
    driver.get('file://' + os.path.abspath('temp.html'))
    driver.save_screenshot(png_path)
    
    # 清理
    driver.quit()
    os.remove('temp.html')

if __name__ == '__main__':
    import os
    svg_path = 'docs/.vuepress/public/images/hero.svg'
    png_path = 'docs/.vuepress/public/images/hero.png'
    convert_svg_to_png(svg_path, png_path)
