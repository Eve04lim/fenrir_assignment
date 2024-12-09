import os
import math
import requests
from flask import Flask, request, render_template, redirect, url_for
from dotenv import load_dotenv

load_dotenv()  # .envファイルから環境変数を読み込む

app = Flask(__name__)

API_KEY = os.environ.get("API_KEY")
HOTPEPPER_API_URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/"

@app.route("/")
def index():
    # 検索条件入力画面: 緯度・経度での検索と、ヒットしやすいエリアコード検索の2パターンを用意
    return render_template("index.html")

@app.route("/search")
def search():
    # 検索パラメータ取得
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    radius = request.args.get("radius", "3")
    start = request.args.get("start", "1")
    count_per_page = 10
    large_area = request.args.get("large_area")

    # デフォルト値（もしlat/lngが未取得なら東京駅周辺をデフォルトに）
    if not lat or not lng:
        lat = "35.681236"
        lng = "139.767125"
        radius = "5"  # 広めの範囲

    params = {
        "key": API_KEY,
        "lat": lat,
        "lng": lng,
        "range": radius,
        "format": "json",
        "count": count_per_page,
        "start": start
    }

    # large_areaが指定されていればエリアコードで検索
    if large_area:
        params["large_area"] = large_area
    else:
        # 緯度経度検索
        params["lat"] = lat
        params["lng"] = lng
        params["range"] = radius

    resp = requests.get(HOTPEPPER_API_URL, params=params)
    data = resp.json()

    # エラーチェック
    if "error" in data:
        error_messages = [err["message"] for err in data["error"] if "message" in err]
        return render_template("results.html", shops=None, error=error_messages, total_hit_count=0)

    if "results" in data and "shop" in data["results"]:
        shops = data["results"]["shop"]
        total_hit_count = int(data["results"]["results_available"])
    else:
        shops = []
        total_hit_count = 0

    current_start = int(start)
    count_per_page = 10
    total_pages = max(math.ceil(total_hit_count / count_per_page), 1)
    current_page = (current_start - 1) // count_per_page + 1

    return render_template(
        "results.html",
        shops=shops,
        lat=lat,
        lng=lng,
        radius=radius,
        large_area=large_area,
        current_page=current_page,
        total_pages=total_pages,
        total_hit_count=total_hit_count,
        error=None
    )

@app.route("/detail/<shop_id>")
def detail(shop_id):
    params = {
        "key": API_KEY,
        "id": shop_id,
        "format": "json",
    }
    resp = requests.get(HOTPEPPER_API_URL, params=params)
    data = resp.json()

    if "error" in data:
        error_messages = [err["message"] for err in data["error"] if "message" in err]
        return render_template("detail.html", shop=None, error=error_messages)

    if "results" in data and "shop" in data["results"] and len(data["results"]["shop"]) > 0:
        shop = data["results"]["shop"][0]
    else:
        shop = None
        error_messages = ["店舗情報が取得できませんでした。"]
        return render_template("detail.html", shop=shop, error=error_messages)

    return render_template("detail.html", shop=shop, error=None)
