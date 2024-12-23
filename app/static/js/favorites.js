/**
 * お気に入り管理クラス
 */
class FavoritesManager {
    constructor() {
        this.storageKey = 'restaurantFavorites';
        this.favorites = this.loadFavorites();
        
        // イベントリスナーの設定
        document.addEventListener('DOMContentLoaded', () => {
            this.updateFavoritesList();
            this.updateAllFavoriteButtons();
        });
    }

    // お気に入りの読み込み
    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Failed to load favorites:', error);
            return {};
        }
    }

    // お気に入りの保存
    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    // お気に入りの追加
    addFavorite(shop) {
        this.favorites[shop.id] = {
            id: shop.id,
            name: shop.name,
            photo: shop.photo.pc.m,
            access: shop.access,
            genre: shop.genre.name,
            budget: shop.budget.name,
            savedAt: new Date().toISOString()
        };
        this.saveFavorites();
    }

    // お気に入りの削除
    removeFavorite(shopId) {
        delete this.favorites[shopId];
        this.saveFavorites();
    }

    // お気に入りの状態確認
    isFavorite(shopId) {
        return shopId in this.favorites;
    }

    // お気に入り一覧の取得（日付順）
    getAllFavorites() {
        return Object.values(this.favorites).sort((a, b) => 
            new Date(b.savedAt) - new Date(a.savedAt)
        );
    }

    // お気に入りボタンの表示を更新
    updateFavoriteButton(button, isFavorite) {
        if (!button) return;

        const icon = isFavorite ? `
            <svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>` : `
            <svg class="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>`;

        button.innerHTML = icon;
        button.classList.toggle('favorite-active', isFavorite);
    }

    // 全てのお気に入りボタンの表示を更新
    updateAllFavoriteButtons() {
        document.querySelectorAll('[data-favorite-id]').forEach(button => {
            const shopId = button.dataset.favoriteId;
            this.updateFavoriteButton(button, this.isFavorite(shopId));
        });
    }

    // お気に入り一覧の表示を更新
    updateFavoritesList() {
        const favoritesList = document.getElementById('favoritesList');
        if (!favoritesList) return;

        const favorites = this.getAllFavorites();
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-gray-500 mb-4">お気に入りが登録されていません</div>
                    <a href="/" class="text-blue-600 hover:text-blue-800 font-semibold">
                        レストランを探す
                    </a>
                </div>`;
            return;
        }

        favoritesList.innerHTML = favorites.map(shop => `
            <div class="bg-white shadow rounded-lg overflow-hidden hover-card mb-4 fade-in">
                <div class="md:flex">
                    <div class="md:flex-shrink-0">
                        <img class="h-32 w-full object-cover md:w-48" 
                             src="${shop.photo}" 
                             alt="${shop.name}">
                    </div>
                    <div class="p-4 flex-grow">
                        <div class="flex justify-between items-start">
                            <div>
                                <a href="/restaurant/${shop.id}" 
                                   class="text-lg font-semibold text-blue-600 hover:text-blue-800">
                                    ${shop.name}
                                </a>
                                <p class="text-sm text-gray-600 mt-1">${shop.access}</p>
                            </div>
                            <button onclick="favoritesManager.toggleFavorite('${shop.id}')"
                                    class="focus:outline-none transform hover:scale-110 transition-transform"
                                    data-favorite-id="${shop.id}">
                                <svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="mt-2">
                            <span class="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2">
                                ${shop.genre}
                            </span>
                            <span class="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                ${shop.budget}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // お気に入りの切り替え
    toggleFavorite(shopId, shopData = null) {
        if (this.isFavorite(shopId)) {
            this.removeFavorite(shopId);
        } else if (shopData) {
            this.addFavorite(shopData);
        } else {
            console.error('Shop data is required to add to favorites');
            return;
        }

        // UIの更新
        this.updateAllFavoriteButtons();
        this.updateFavoritesList();

        // アニメーション効果
        const button = document.querySelector(`[data-favorite-id="${shopId}"]`);
        if (button) {
            button.classList.add('animate-pulse');
            setTimeout(() => button.classList.remove('animate-pulse'), 500);
        }
    }
}

// グローバルなインスタンスを作成
const favoritesManager = new FavoritesManager();