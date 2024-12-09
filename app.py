import os
import math
import requests
from flask import Flask, request, render_template

app = Flask(__name__)

# HotPepper API Key - 実際のAPIキーを設定してください
API_KEY = "YOUR_API_KEY"
HOTPEPPER_API_URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search")
def search():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    radius = request.args.get("radius", "3")
    start = request.args.get("start", "1")

    # 新たに追加した検索オプション
    wifi = request.args.get("wifi", "0")  # チェックされていれば1、なければ0
    private_room = request.args.get("private_room", "0")
    free_drink = request.args.get("free_drink", "0")

    params = {
        "key": API_KEY,
        "lat": lat,
        "lng": lng,
        "range": radius,
        "format": "json",
        "count": 10,
        "start": start,
        # 追加検索パラメータ
        "wifi": wifi,
        "private_room": private_room,
        "free_drink": free_drink,
        # 特集やクレジットカード情報をレスポンスに含めたい場合はtypeに指定
        # "type": "special+credit_card",   # 必要に応じて
    }

    resp = requests.get(HOTPEPPER_API_URL, params=params)
    data = resp.json()

    if "results" not in data or "shop" not in data["results"]:
        shops = []
        total_hit_count = 0
    else:
        shops = data["results"]["shop"]
        total_hit_count = int(data["results"]["results_available"])

    current_start = int(start)
    count_per_page = 10
    total_pages = math.ceil(total_hit_count / count_per_page)
    current_page = (current_start // count_per_page) + (1 if current_start % count_per_page != 0 else 0)

    return render_template(
        "results.html",
        shops=shops,
        lat=lat,
        lng=lng,
        radius=radius,
        current_page=current_page,
        total_pages=total_pages,
        total_hit_count=total_hit_count,
        wifi=wifi,
        private_room=private_room,
        free_drink=free_drink
    )

@app.route("/detail/<shop_id>")
def detail(shop_id):
    params = {
        "key": API_KEY,
        "id": shop_id,
        "format": "json",
        # 詳細表示の際に特集情報やクレジットカード情報を付加したい場合など
        # "type": "special+credit_card",
    }
    resp = requests.get(HOTPEPPER_API_URL, params=params)
    data = resp.json()
    if "results" in data and "shop" in data["results"] and len(data["results"]["shop"]) > 0:
        shop = data["results"]["shop"][0]
    else:
        shop = None

    return render_template("detail.html", shop=shop)
