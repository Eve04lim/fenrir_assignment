class LoadingManager {
    constructor() {
        this.createLoadingElement();
    }

    createLoadingElement() {
        // ローディング用のHTML要素を作成
        const loading = document.createElement('div');
        loading.id = 'globalLoading';
        loading.className = 'hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm';
        
        loading.innerHTML = `
            <div class="bg-white/90 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center shadow-2xl">
                <div class="relative w-16 h-16">
                    <!-- スピナーアニメーション -->
                    <div class="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p class="mt-4 text-gray-700 font-medium" id="loadingMessage">読み込み中...</p>
            </div>
        `;

        document.body.appendChild(loading);
        this.loadingElement = loading;
        this.messageElement = loading.querySelector('#loadingMessage');
    }

    show(message = '読み込み中...') {
        this.messageElement.textContent = message;
        this.loadingElement.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.loadingElement.classList.add('hidden');
        document.body.style.overflow = '';
    }

    updateMessage(message) {
        this.messageElement.textContent = message;
    }
}

// グローバルインスタンスを作成
const loadingManager = new LoadingManager();