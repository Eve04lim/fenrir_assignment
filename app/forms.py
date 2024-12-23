from flask_wtf import FlaskForm
from wtforms import (
    StringField, SelectField, HiddenField, SubmitField, 
    SelectMultipleField, BooleanField
)
from wtforms.validators import DataRequired, Optional

class SearchForm(FlaskForm):
    """拡張検索フォーム"""
    
    # 位置情報（必須）
    latitude = HiddenField('緯度', validators=[DataRequired(message='現在地を取得してください')])
    longitude = HiddenField('経度', validators=[DataRequired(message='現在地を取得してください')])
    
    # 検索範囲（必須）
    range = SelectField('検索範囲', 
        choices=[
            ('1', '300m以内'),
            ('2', '500m以内'),
            ('3', '1km以内'),
            ('4', '2km以内'),
            ('5', '3km以内')
        ],
        validators=[DataRequired(message='検索範囲を選択してください')]
    )
    
    # キーワード検索（オプション）
    keyword = StringField('キーワード', validators=[Optional()])
    
    # 予算範囲（オプション）
    budget = SelectField('予算範囲',
        choices=[
            ('', '指定なし'),
            ('B009', '～500円'),
            ('B010', '501～1000円'),
            ('B011', '1001～1500円'),
            ('B001', '1501～2000円'),
            ('B002', '2001～3000円'),
            ('B003', '3001～4000円'),
            ('B008', '4001～5000円'),
            ('B004', '5001～7000円'),
            ('B005', '7001～10000円'),
            ('B006', '10001～15000円'),
            ('B012', '15001～20000円'),
            ('B013', '20001～30000円'),
            ('B014', '30001円～')
        ],
        validators=[Optional()]
    )
    
    # 営業時間（オプション）
    lunch_time = BooleanField('ランチ営業あり')
    late_night = BooleanField('23時以降も営業')
    
    # 店舗の特徴（オプション、複数選択可）
    features = SelectMultipleField('お店の特徴',
        choices=[
            ('parking', '駐車場あり'),
            ('card', 'カード利用可'),
            ('child', '子供連れOK'),
            ('wifi', 'Wi-Fiあり'),
            ('takeout', 'テイクアウトOK'),
            ('delivery', 'デリバリーあり'),
            ('private_room', '個室あり'),
            ('barrier_free', 'バリアフリー'),
            ('pet', 'ペットOK'),
            ('non_smoking', '禁煙'),
        ],
        validators=[Optional()]
    )
    
    # 飲み放題・食べ放題（オプション）
    free_drink = BooleanField('飲み放題あり')
    free_food = BooleanField('食べ放題あり')
    
    # 座席タイプ（オプション、複数選択可）
    seat_types = SelectMultipleField('座席タイプ',
        choices=[
            ('counter', 'カウンター席'),
            ('table', 'テーブル席'),
            ('floor', '座敷'),
            ('terrace', 'テラス席'),
        ],
        validators=[Optional()]
    )
    
    submit = SubmitField('検索')