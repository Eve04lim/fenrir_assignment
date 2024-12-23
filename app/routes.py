from flask import Blueprint, render_template, request, jsonify, current_app, abort
from app.forms import SearchForm
from app.hotpepper import HotPepperClient
import os

main = Blueprint('main', __name__)

@main.route('/')
def index():
    """トップページを表示"""
    try:
        form = SearchForm()
        return render_template('index.html', form=form)
    except Exception as e:
        current_app.logger.error(f"Error in index route: {str(e)}")
        return render_template('error.html', message='予期せぬエラーが発生しました'), 500

@main.route('/search')
def search():
    """レストランを検索"""
    try:
        # 基本パラメータの取得と検証
        lat = request.args.get('latitude', type=float)
        lng = request.args.get('longitude', type=float)
        range_val = request.args.get('range', '3', type=str)  # デフォルト値を設定
        
        if not lat or not lng:
            return jsonify({'error': '位置情報が必要です'}), 400

        # 追加パラメータの取得（オプション）
        keyword = request.args.get('keyword', '', type=str)
        page = request.args.get('page', 1, type=int)
        budget = request.args.get('budget', '', type=str)
        features = request.args.get('features', '').split(',') if request.args.get('features') else []
        seat_types = request.args.get('seat_types', '').split(',') if request.args.get('seat_types') else []
        
        # 営業時間関連のパラメータ
        lunch_time = request.args.get('lunch_time') == 'true'
        late_night = request.args.get('late_night') == 'true'
        free_drink = request.args.get('free_drink') == 'true'
        free_food = request.args.get('free_food') == 'true'

        # APIキーの取得と検証
        api_key = current_app.config.get('HOTPEPPER_API_KEY')
        if not api_key:
            return jsonify({'error': 'APIキーが設定されていません'}), 500

        # クライアントの初期化と検索実行
        client = HotPepperClient(api_key)
        results = client.search_restaurants(
            lat=lat,
            lng=lng,
            range=range_val,
            keyword=keyword,
            budget=budget,
            features=features,
            lunch_time=lunch_time,
            late_night=late_night,
            free_drink=free_drink,
            free_food=free_food,
            seat_types=seat_types,
            start=(page - 1) * 10 + 1,
            count=10
        )

        # 検索結果のログ記録
        current_app.logger.info(
            f"Search performed - Found {results['results']['results_available']} restaurants "
            f"(lat: {lat}, lng: {lng}, range: {range_val}, keyword: {keyword})"
        )

        return jsonify(results)

    except Exception as e:
        error_message = str(e)
        current_app.logger.error(f"Search error: {error_message}")
        return jsonify({'error': error_message}), 500

@main.route('/search_results')
def search_results():
    """検索結果ページを表示"""
    try:
        # URLパラメータから検索条件を取得
        lat = request.args.get('latitude', type=float)
        lng = request.args.get('longitude', type=float)
        range_val = request.args.get('range', '3', type=str)
        keyword = request.args.get('keyword', '', type=str)

        # 検索範囲のテキスト変換
        range_text = {
            '1': '300m',
            '2': '500m',
            '3': '1km',
            '4': '2km',
            '5': '3km'
        }.get(range_val, '1km')  # デフォルト値を設定

        return render_template('search_results.html',
                            current_location=bool(lat and lng),
                            range_text=range_text,
                            keyword=keyword)

    except Exception as e:
        current_app.logger.error(f"Error in search results route: {str(e)}")
        return render_template('error.html', message='検索結果の表示中にエラーが発生しました'), 500

@main.route('/restaurant/<shop_id>')
def restaurant_detail(shop_id):
    """レストランの詳細情報を表示"""
    try:
        if not shop_id:
            abort(404)

        api_key = current_app.config.get('HOTPEPPER_API_KEY')
        if not api_key:
            raise ValueError('APIキーが設定されていません')

        client = HotPepperClient(api_key)
        result = client.get_restaurant_detail(shop_id)

        if not result.get('results', {}).get('shop'):
            return render_template('error.html', 
                                message='指定された店舗が見つかりません'), 404

        restaurant = result['results']['shop'][0]
        return render_template('restaurant_detail.html', restaurant=restaurant)

    except ValueError as e:
        current_app.logger.error(f"Configuration error: {str(e)}")
        return render_template('error.html', message=str(e)), 500
    except Exception as e:
        current_app.logger.error(f"Error in restaurant detail route: {str(e)}")
        return render_template('error.html', 
                            message='店舗情報の取得中にエラーが発生しました'), 500

@main.route('/favorites')
def favorites():
    """お気に入りページを表示"""
    try:
        return render_template('favorites.html')
    except Exception as e:
        current_app.logger.error(f"Error in favorites route: {str(e)}")
        return render_template('error.html', message='お気に入りページの表示中にエラーが発生しました'), 500

# エラーハンドラー
@main.app_errorhandler(404)
def not_found_error(error):
    return render_template('error.html', message='ページが見つかりません'), 404

@main.app_errorhandler(500)
def internal_error(error):
    return render_template('error.html', message='サーバーエラーが発生しました'), 500