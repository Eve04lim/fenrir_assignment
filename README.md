# 簡易仕様書

### 作者
木脇　優太
### アプリ名
HotPepper Gourmet Finder

#### コンセプト
- 緯度・経度から現在地周辺の飲食店を高速検索
- 検索条件（半径、ジャンル、予算など）を豊富に選択可能
- 視覚的に分かりやすいカードレイアウトでの一覧表示
- デザイン性を重視し、UI/UXにこだわった店舗詳細ページ

#### こだわったポイント
飲食店の検索条件を豊富に選択できるようにしました。

### 該当プロジェクトのリポジトリ URL（GitHub,GitLab など Git ホスティングサービスを利用されている場合）
https://github.com/Eve04lim/fenrir_assignment.git

## 開発環境
### 開発環境
Visual Studio Code
Windows 10 上でのローカル開発

### 開発言語
Python 3.9 以降

## 動作対象端末・OS
### 動作対象OS
- Windows 10 環境での開発
- ブラウザ：Google Chrome 最新版、Firefox 最新版、Microsoft Edge 最新版で動作確認
  ※ Geolocation API利用のためHTTPS環境推奨

## 開発期間
7日間

## アプリケーション機能

### 機能一覧
- レストラン検索：ホットペッパーグルメサーチAPIを用い、現在地周辺または指定エリアの飲食店を検索可能。
- 詳細情報取得：選択した店舗の詳細情報（住所、営業時間、定休日、WiFi・個室有無、予算、飲み放題情報など）を取得し表示。
- ページネーション：検索結果が多い場合、ページを切り替えてすべての結果を閲覧可能。
- 公式ページ/地図リンク連携：店舗の公式HotPepperページへのリンクや、マップアプリとの連携（店舗位置情報）。

### 画面一覧
- 検索画面
  現在地取得ボタンや半径・ジャンル・予算指定フォームを備えた検索条件入力画面。
- 一覧画面：
  カード型レイアウトで検索結果を一覧表示。サムネイル画像、店舗名、ジャンル、アクセスなどを即時確認でき、ページネーション対応。
- 詳細画面：
  大きな店舗画像、ジャンル、アクセス、営業時間、個室・飲み放題などの特徴情報、公式ページリンクを含むリッチなUIで店舗情報を表示。

### 使用しているAPI,SDK,ライブラリなど
- ホットペッパーグルメサーチAPI：飲食店情報の取得
- Geolocation API(ブラウザ機能)：現在地取得

### アドバイスして欲しいポイント
- 飲食店一覧リストや詳細画面のUI/UX改善案
- 大規模トラフィック時のパフォーマンス向上（キャッシュ戦略、フロントエンドフレームワーク利用など）