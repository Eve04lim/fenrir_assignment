import requests
from typing import Dict, Any, Optional, List
from app.utils.cache import Cache, cache_response

class HotPepperClient:
    """拡張版ホットペッパーAPIクライアント"""
    
    BASE_URL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.cache = Cache(expiration_minutes=5)

    @cache_response(Cache())
    def search_restaurants(
        self,
        lat: float,
        lng: float,
        range: str,
        keyword: Optional[str] = None,
        budget: Optional[str] = None,
        features: Optional[List[str]] = None,
        lunch_time: bool = False,
        late_night: bool = False,
        free_drink: bool = False,
        free_food: bool = False,
        seat_types: Optional[List[str]] = None,
        start: int = 1,
        count: int = 10
    ) -> Dict[str, Any]:
        """
        拡張版レストラン検索機能

        Args:
            lat (float): 緯度
            lng (float): 経度
            range (str): 検索範囲（1: 300m, 2: 500m, 3: 1000m, 4: 2000m, 5: 3000m）
            keyword (str, optional): 検索キーワード
            budget (str, optional): 予算コード
            features (List[str], optional): 店舗の特徴リスト
            lunch_time (bool): ランチ営業あり
            late_night (bool): 23時以降も営業
            free_drink (bool): 飲み放題あり
            free_food (bool): 食べ放題あり
            seat_types (List[str], optional): 座席タイプリスト
            start (int): 検索開始位置
            count (int): 取得件数

        Returns:
            Dict[str, Any]: レストラン情報
        """
        # 基本パラメータ
        params = {
            'key': self.api_key,
            'lat': lat,
            'lng': lng,
            'range': range,
            'start': start,
            'count': count,
            'format': 'json'
        }
        
        # オプションパラメータの追加
        if keyword:
            params['keyword'] = keyword
            
        if budget:
            params['budget'] = budget
            
        # 営業時間条件
        if lunch_time:
            params['lunch'] = 1
            
        if late_night:
            params['midnight'] = 1
            
        # 特徴条件の追加
        if features:
            for feature in features:
                params[feature] = 1
                
        # 飲み放題・食べ放題
        if free_drink:
            params['free_drink'] = 1
            
        if free_food:
            params['free_food'] = 1
            
        # 座席タイプ
        if seat_types:
            for seat_type in seat_types:
                params[seat_type] = 1
        
        # APIリクエスト
        response = requests.get(self.BASE_URL, params=params)
        response.raise_for_status()
        
        return response.json()

    @cache_response(Cache())
    def get_restaurant_detail(self, shop_id: str) -> Dict[str, Any]:
        """店舗の詳細情報を取得"""
        params = {
            'key': self.api_key,
            'id': shop_id,
            'format': 'json'
        }
        
        response = requests.get(self.BASE_URL, params=params)
        response.raise_for_status()
        
        return response.json()

    def clear_cache(self):
        """キャッシュをクリア"""
        self.cache.clear()