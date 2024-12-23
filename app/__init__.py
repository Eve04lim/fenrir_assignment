from flask import Flask
from config import Config
from app.utils.logging import setup_logger
from app.utils.error_handlers import register_error_handlers

def create_app():
    """Flaskアプリケーションを作成する"""
    app = Flask(__name__)
    
    # 設定を読み込む
    app.config.from_object(Config)
    Config.init_app(app)
    
    # ロギングの設定
    setup_logger(app)
    
    # エラーハンドラーの登録
    register_error_handlers(app)
    
    # Blueprintを登録
    with app.app_context():
        from app.routes import main
        app.register_blueprint(main)
        
        # 起動ログ
        app.logger.info('Application started')
    
    return app