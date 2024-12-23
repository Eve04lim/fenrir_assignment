// 検索処理の状態管理
let isSearching = false;
let currentPage = 1;

// DOM要素の取得
const form = document.getElementById('searchForm');
const getLocationBtn = document.getElementById('getLocation');
const locationStatus = document.getElementById('locationStatus');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const searchResults = document.getElementById('searchResults');
const pagination = document.getElementById('pagination');

// 位置情報取得処理
async function getCurrentLocation() {
    if (!navigator.geolocation) {
        showLocationStatus('error', 'お使いのブラウザは位置情報の取得に対応していません');
        return;
    }

    try {
        showLocationStatus('info', '位置情報を取得中...');
        
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });

        latitudeInput.value = position.coords.latitude;
        longitudeInput.value = position.coords.longitude;
        showLocationStatus('success', '位置情報を取得しました！');
        
        // 位置情報取得ボタンのスタイルを更新
        updateLocationButton(true);
    } catch (error) {
        let message;
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = '位置情報の取得が許可されていません';
                break;
            case error.POSITION_UNAVAILABLE:
                message = '位置情報を取得できませんでした';
                break;
            case error.TIMEOUT:
                message = '位置情報の取得がタイムアウトしました';
                break;
            default:
                message = '位置情報の取得中にエラーが発生しました';
        }
        showLocationStatus('error', message);
        updateLocationButton(false);
    }
}

// 位置情報取得ボタンの状態更新
function updateLocationButton(success) {
    const button = document.getElementById('getLocation');
    if (success) {
        button.classList.remove('bg-blue-500', 'hover:bg-blue-700');
        button.classList.add('bg-green-500', 'hover:bg-green-700');
    } else {
        button.classList.remove('bg-green-500', 'hover:bg-green-700');
        button.classList.add('bg-blue-500', 'hover:bg-blue-700');
    }
}

// 位置情報状態表示の更新
function showLocationStatus(type, message) {
    locationStatus.className = `mb-4 p-4 rounded text-center fade-in ${
        type === 'error' ? 'bg-red-100 text-red-700' : 
        type === 'success' ? 'bg-green-100 text-green-700' : 
        'bg-blue-100 text-blue-700'
    }`;
    locationStatus.textContent = message;
    locationStatus.classList.remove('hidden');
}

// フォームデータの収集
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    // 基本パラメータ
    data.latitude = formData.get('latitude');
    data.longitude = formData.get('longitude');
    data.range = formData.get('range');
    data.keyword = formData.get('keyword');
    data.budget = formData.get('budget');

    // チェックボックス系の処理
    data.lunch_time = form.querySelector('#lunch_time')?.checked || false;
    data.late_night = form.querySelector('#late_night')?.checked || false;
    data.free_drink = form.querySelector('#free_drink')?.checked || false;
    data.free_food = form.querySelector('#free_food')?.checked || false;

    // 複数選択の処理
    data.features = Array.from(form.querySelectorAll('input[name="features"]:checked'))
        .map(input => input.value);
    data.seat_types = Array.from(form.querySelectorAll('input[name="seat_types"]:checked'))
        .map(input => input.value);

    return data;
}

// 検索処理
async function searchRestaurants(page = 1) {
    if (isSearching) return;
    isSearching = true;
    currentPage = page;

    try {
        // 検索中の表示
        searchResults.innerHTML = '<div class="loading"></div>';
        pagination.innerHTML = '';

        // フォームデータの取得
        const formData = getFormData(form);
        
        // URLパラメータの構築
        const params = new URLSearchParams({
            ...formData,
            page: page,
            features: formData.features.join(','),
            seat_types: formData.seat_types.join(',')
        });

        // APIリクエスト
        const response = await fetch(`/search?${params.toString()}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // 結果の表示
        displayResults(data);
        updatePagination(data);
    } catch (error) {
        searchResults.innerHTML = `
            <div class="bg-red-100 text-red-700 p-4 rounded fade-in">
                エラーが発生しました: ${error.message}
            </div>
        `;
    } finally {
        isSearching = false;
    }
}

// 検索結果の表示
function displayResults(data) {
    const shops = data.results.shop;

    if (shops.length === 0) {
        searchResults.innerHTML = `
            <div class="bg-yellow-100 text-yellow-700 p-4 rounded fade-in">
                検索条件に一致するレストランが見つかりませんでした。
            </div>
        `;
        return;
    }

    searchResults.innerHTML = shops.map(shop => {
        // JSONデータのエスケープ処理
        const shopData = JSON.stringify(shop).replace(/'/g, '\\\'').replace(/"/g, '&quot;');
        
        return `
        <div class="bg-white shadow-md rounded-lg overflow-hidden hover-card fade-in">
            <div class="md:flex">
                <div class="md:flex-shrink-0">
                    <img class="h-48 w-full object-cover md:w-48" 
                         src="${shop.photo.pc.m}" 
                         alt="${shop.name}"
                         loading="lazy">
                </div>
                <div class="p-6 flex-grow">
                    <div class="flex justify-between items-start">
                        <div>
                            <a href="/restaurant/${shop.id}" 
                               class="text-xl font-semibold text-blue-600 hover:text-blue-800">
                                ${shop.name}
                            </a>
                            <p class="text-sm text-gray-600 mt-1">${shop.access}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="favoritesManager.toggleFavorite('${shop.id}', ${shopData})"
                                    class="focus:outline-none transform hover:scale-110 transition-transform"
                                    data-favorite-id="${shop.id}">
                                <svg class="w-6 h-6 ${favoritesManager.isFavorite(shop.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}" 
                                     fill="${favoritesManager.isFavorite(shop.id) ? 'currentColor' : 'none'}"
                                     stroke="currentColor" 
                                     viewBox="0 0 24 24">
                                    <path stroke-linecap="round" 
                                          stroke-linejoin="round" 
                                          stroke-width="2" 
                                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">${shop.budget.name}
                            </span>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <div class="flex flex-wrap gap-2">
                            <span class="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-700">
                                ${shop.genre.name}
                            </span>
                            ${shop.card === '利用可' ? `
                                <span class="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-700">
                                    カード利用可
                                </span>
                            ` : ''}
                            ${shop.non_smoking === '全面禁煙' ? `
                                <span class="inline-block bg-purple-100 rounded-full px-3 py-1 text-sm font-semibold text-purple-700">
                                    禁煙
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-sm text-gray-600">
                            <span class="font-semibold">営業時間:</span> ${shop.open}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');

    // お気に入りボタンの状態を更新
    document.querySelectorAll('[data-favorite-id]').forEach(button => {
        const shopId = button.dataset.favoriteId;
        updateFavoriteButton(button, favoritesManager.isFavorite(shopId));
    });
}

// ページネーションの更新
function updatePagination(data) {
    const totalPages = Math.ceil(data.results.results_available / 10);
    const currentPage = Math.floor(data.results.start / 10) + 1;
    
    let paginationHTML = '<div class="flex items-center justify-center space-x-2">';
    
    // 前のページボタン
    if (currentPage > 1) {
        paginationHTML += `
            <button onclick="searchRestaurants(${currentPage - 1})" 
                    class="px-3 py-2 bg-white text-blue-500 rounded hover:bg-blue-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>
        `;
    }
    
    // ページ番号
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        if (i === currentPage) {
            paginationHTML += `
                <span class="px-4 py-2 bg-blue-500 text-white rounded">
                    ${i}
                </span>
            `;
        } else {
            paginationHTML += `
                <button onclick="searchRestaurants(${i})" 
                        class="px-4 py-2 bg-white text-blue-500 rounded hover:bg-blue-100">
                    ${i}
                </button>
            `;
        }
    }
    
    // 次のページボタン
    if (currentPage < totalPages) {
        paginationHTML += `
            <button onclick="searchRestaurants(${currentPage + 1})" 
                    class="px-3 py-2 bg-white text-blue-500 rounded hover:bg-blue-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        `;
    }
    
    paginationHTML += '</div>';
    pagination.innerHTML = paginationHTML;
}

// お気に入りボタンの状態を更新する関数
function updateFavoriteButton(button, isFavorite) {
    if (!button) return;

    const icon = button.querySelector('svg');
    if (isFavorite) {
        icon.classList.add('text-red-500', 'fill-current');
        icon.classList.remove('text-gray-400');
        icon.setAttribute('fill', 'currentColor');
    } else {
        icon.classList.remove('text-red-500', 'fill-current');
        icon.classList.add('text-gray-400');
        icon.setAttribute('fill', 'none');
    }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    // 位置情報取得ボタン
    getLocationBtn?.addEventListener('click', getCurrentLocation);

    // フォーム送信
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!latitudeInput.value || !longitudeInput.value) {
            showLocationStatus('error', '現在地を取得してください');
            return;
        }

        await searchRestaurants(1);
    });

    // 詳細検索の開閉
    const toggleBtn = document.getElementById('toggleAdvanced');
    const advancedSearch = document.getElementById('advancedSearch');
    const toggleText = document.getElementById('toggleText');
    const toggleIcon = document.getElementById('toggleIcon');

    toggleBtn?.addEventListener('click', () => {
        advancedSearch.classList.toggle('hidden');
        const isHidden = advancedSearch.classList.contains('hidden');
        toggleText.textContent = isHidden ? '詳細条件を表示' : '詳細条件を非表示';
        toggleIcon.classList.toggle('rotate-180');
    });
});