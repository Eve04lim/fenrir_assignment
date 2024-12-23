import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    """アプリケーションの設定クラス"""
    # 基本設定
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev'
    HOTPEPPER_API_KEY = os.environ.get('HOTPEPPER_API_KEY')
    
    # ロギング設定
    LOG_DIR = os.path.join(basedir, 'logs')
    LOG_FILE = os.path.join(LOG_DIR, 'app.log')
    LOG_MAX_SIZE = 10 * 1024 * 1024  # 10MB
    LOG_BACKUP_COUNT = 5
    
    # APIリクエスト制限
    API_RATE_LIMIT = 60  # 1分あたりのリクエスト数
    
    @staticmethod
    def init_app(app):
        # ログディレクトリの作成
        os.makedirs(Config.LOG_DIR, exist_ok=True)