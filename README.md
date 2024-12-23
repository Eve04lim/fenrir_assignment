# レストラン検索アプリ

現在地周辺のレストランを簡単に検索できるウェブアプリケーションです。ホットペッパーグルメサーチAPIを利用して、位置情報ベースの検索や詳細な条件指定による飲食店の検索が可能です。

## 主な機能

- **位置情報ベース検索**
  - 現在地を使用した周辺レストランの検索
  - 検索範囲の指定（300m～3km）
  - 位置情報の自動取得

- **詳細検索オプション**
  - キーワード検索（店名、料理名など）
  - 予算範囲の指定
  - 営業時間による絞り込み（ランチ、夜間営業など）
  - 設備・サービスによる絞り込み

- **便利な機能**
  - レスポンシブデザイン対応（PC、タブレット、スマートフォン）
  - お気に入り店舗の保存機能
  - ページネーション機能
  - 詳細な店舗情報の表示

## 技術スタック

### バックエンド
- Python 3.8+
- Flask 2.0+
- Flask-WTF（フォームハンドリング）
- python-dotenv（環境変数管理）
- requests（API通信）

### フロントエンド
- Tailwind CSS 2.2+（スタイリング）
- Vanilla JavaScript（インタラクション）
- AOS（スクロールアニメーション）

### API / 外部サービス
- ホットペッパーグルメサーチAPI
- HTML5 Geolocation API

## セットアップ手順

### 1. 前提条件
- Python 3.8以上がインストールされていること
- pipがインストールされていること
- ホットペッパーグルメサーチAPIのAPIキーを取得していること

### 2. プロジェクトのセットアップ
```bash
# リポジトリのクローン
git clone <repository-url>
cd restaurant-finder

# 仮想環境の作成と有効化
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate

# 依存パッケージのインストール
pip install -r requirements.txt
```

### 3. 環境変数の設定
プロジェクトのルートディレクトリに`.env`ファイルを作成し、以下の内容を設定：

```env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key-here
HOTPEPPER_API_KEY=your-api-key-here
```

### 4. アプリケーションの起動
```bash
flask run
```
アプリケーションは http://localhost:5000 で起動します。

## プロジェクト構造

```
restaurant-finder/
├── app/
│   ├── __init__.py
│   ├── forms.py
│   ├── models.py
│   ├── routes.py
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   └── templates/
├── instance/
├── tests/
├── .env
├── .gitignore
├── requirements.txt
├── run.py
└── README.md
```

## 開発ガイドライン

### コードスタイル
- PEP 8ガイドラインに従うこと
- Flake8を使用して静的コード解析を行うこと
- コメントは日本語で記述すること

### コミットメッセージ
以下のプレフィックスを使用してコミットメッセージを記述：
- feat: 新機能
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの意味に影響を与えない変更
- refactor: バグ修正や機能追加ではないコードの変更
- test: テストコードの追加・修正
- chore: ビルドプロセスやツールの変更

## トラブルシューティング

### 位置情報の取得について
- HTTPSまたはlocalhost環境でのみ動作します
- ブラウザの位置情報アクセスを許可する必要があります

### API制限について
- ホットペッパーグルメサーチAPIの利用制限に注意してください
- 1日あたりのリクエスト数に制限があります

## デプロイ

### 本番環境の準備
1. 本番用の環境変数を設定
2. デバッグモードを無効化
3. 適切なWSGIサーバー（Gunicorn等）の使用

### デプロイ手順
```bash
# 本番用の依存関係をインストール
pip install -r requirements.prod.txt

# Gunicornでの起動例
gunicorn "app:create_app()" --bind 0.0.0.0:8000
```

## API仕様

### エンドポイント
- GET `/`: メインページ
- GET `/search`: レストラン検索
- GET `/restaurant/<id>`: レストラン詳細
- GET `/favorites`: お気に入りリスト

### レスポンス例
```json
{
  "results": {
    "shop": [
      {
        "id": "J001234567",
        "name": "レストラン名",
        "address": "東京都...",
        // ... 他のフィールド
      }
    ]
  }
}
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献について

1. このリポジトリをフォーク
2. 機能開発用のブランチを作成
3. 変更をコミット
4. プルリクエストを作成

## 謝辞

- ホットペッパーグルメサーチAPI
- オープンソースコミュニティ

## 作者
木脇　優太