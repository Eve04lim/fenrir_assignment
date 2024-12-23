from flask import render_template, current_app
from werkzeug.exceptions import HTTPException
import traceback
import sys

def register_error_handlers(app):
    """アプリケーションにエラーハンドラーを登録"""
    
    @app.errorhandler(404)
    def not_found_error(error):
        app.logger.warning(f'Page not found: {error}')
        return render_template('error.html',
                             error_code=404,
                             message="ページが見つかりませんでした。"), 404

    @app.errorhandler(500)
    def internal_error(error):
        # エラーの詳細情報を取得
        exc_info = sys.exc_info()
        if exc_info[0] is not None:  # エラーが発生している場合
            # スタックトレースを文字列として取得
            stack_trace = ''.join(traceback.format_exception(*exc_info))
            # エラーをログに記録
            app.logger.error(f'Server Error: {error}\nStack Trace:\n{stack_trace}')
        else:
            app.logger.error(f'Server Error: {error}')

        return render_template('error.html',
                             error_code=500,
                             message="サーバーエラーが発生しました。"), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        # HTTPException以外の予期しないエラーを処理
        if not isinstance(error, HTTPException):
            # エラーの詳細情報を取得してログに記録
            stack_trace = ''.join(traceback.format_exception(*sys.exc_info()))
            app.logger.error(f'Unhandled Exception: {error}\nStack Trace:\n{stack_trace}')
            
            return render_template('error.html',
                                 error_code=500,
                                 message="予期せぬエラーが発生しました。"), 500

        # HTTPExceptionの場合は、対応するステータスコードとメッセージを使用
        app.logger.warning(f'HTTP Exception: {error}')
        return render_template('error.html',
                             error_code=error.code,
                             message=error.description), error.code

    @app.errorhandler(429)
    def ratelimit_handler(error):
        app.logger.warning(f'Rate Limit Exceeded: {error}')
        return render_template('error.html',
                             error_code=429,
                             message="APIリクエスト制限を超えました。しばらく時間をおいて再度お試しください。"), 429