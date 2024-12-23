import logging
from logging.handlers import RotatingFileHandler
import os
from datetime import datetime

def setup_logger(app):
    """アプリケーションのロガーを設定する"""
    
    # ログディレクトリの作成
    log_dir = os.path.join(app.root_path, '..', 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # ログファイルのパス
    log_file = os.path.join(log_dir, f'app_{datetime.now().strftime("%Y%m")}.log')
    
    # ログフォーマットの設定
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )
    
    # ファイルハンドラの設定（最大10MB、バックアップ5つ）
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10 * 1024 * 1024,
        backupCount=5
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)
    
    # アプリケーションロガーの設定
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    
    # キャッシュ関連のログも記録
    cache_logger = logging.getLogger('cache')
    cache_logger.addHandler(file_handler)
    cache_logger.setLevel(logging.INFO)
    
    return app