import os

# 数据库配置
HOSTNAME = "127.0.0.1"  # 本地测试时使用 localhost
PORT = '3306'  # MySQL 默认端口是 3306
DATABASE = 'chinese-chess'
USERNAME = 'root'
PASSWORD = 'root'

DB_URI = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8mb4'

# Flask 配置
SQLALCHEMY_DATABASE_URI = DB_URI
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.urandom(24)  # 生成随机密钥，增强安全性

# 自定义 MIME 类型（用于 MP3 支持）
MIME_TYPES = {'mp3': 'audio/mpeg'}
