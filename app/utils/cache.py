from functools import wraps
import json
from datetime import datetime, timedelta
import hashlib

class Cache:
    """シンプルなインメモリキャッシュの実装"""
    
    def __init__(self, expiration_minutes=5):
        self.cache = {}
        self.expiration = timedelta(minutes=expiration_minutes)

    def _generate_key(self, *args, **kwargs):
        """引数からキャッシュキーを生成する"""
        # 引数を文字列に変換してハッシュ化
        key_parts = [str(arg) for arg in args]
        key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
        key_string = "|".join(key_parts)
        return hashlib.md5(key_string.encode()).hexdigest()

    def get(self, key):
        """キャッシュから値を取得"""
        if key not in self.cache:
            return None
            
        value, timestamp = self.cache[key]
        if datetime.now() - timestamp > self.expiration:
            del self.cache[key]
            return None
            
        return value

    def set(self, key, value):
        """キャッシュに値を設定"""
        self.cache[key] = (value, datetime.now())

    def clear(self):
        """キャッシュをクリア"""
        self.cache.clear()

def cache_response(cache_instance):
    """APIレスポンスをキャッシュするデコレータ"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # キャッシュキーの生成
            cache_key = cache_instance._generate_key(*args, **kwargs)
            
            # キャッシュから値を取得
            cached_value = cache_instance.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # 関数を実行してキャッシュに保存
            result = func(*args, **kwargs)
            cache_instance.set(cache_key, result)
            return result
            
        return wrapper
    return decorator