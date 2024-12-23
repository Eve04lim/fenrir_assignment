class NotificationManager {
    constructor() {
        this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'fixed top-4 right-4 z-50 space-y-4 min-w-[320px] max-w-md';
        document.body.appendChild(container);
        this.container = container;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `
            transform translate-x-full opacity-0 transition-all duration-300
            p-4 rounded-lg shadow-lg backdrop-blur-md
            ${this.getTypeStyles(type)}
        `;

        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                ${this.getTypeIcon(type)}
                <div class="flex-grow">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <button class="text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="absolute bottom-0 left-0 h-1 bg-white/20 progress-bar" style="width: 100%"></div>
        `;

        // 閉じるボタンのイベントリスナー
        const closeButton = notification.querySelector('button');
        closeButton.addEventListener('click', () => this.hide(notification));

        this.container.appendChild(notification);

        // アニメーション用のタイミング調整
        requestAnimationFrame(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
        });

        // プログレスバーのアニメーション
        const progressBar = notification.querySelector('.progress-bar');
        progressBar.style.transition = `width ${duration}ms linear`;
        requestAnimationFrame(() => {
            progressBar.style.width = '0%';
        });

        // 自動的に非表示
        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }

        return notification;
    }

    hide(notification) {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }

    getTypeStyles(type) {
        const styles = {
            success: 'bg-green-500/90 text-white',
            error: 'bg-red-500/90 text-white',
            warning: 'bg-yellow-500/90 text-white',
            info: 'bg-blue-500/90 text-white'
        };
        return styles[type] || styles.info;
    }

    getTypeIcon(type) {
        const icons = {
            success: `
                <div class="flex-shrink-0 w-6 h-6">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
            `,
            error: `
                <div class="flex-shrink-0 w-6 h-6">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
            `,
            warning: `
                <div class="flex-shrink-0 w-6 h-6">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
            `,
            info: `
                <div class="flex-shrink-0 w-6 h-6">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
            `
        };
        return icons[type] || icons.info;
    }
}

// グローバルインスタンスを作成
const notificationManager = new NotificationManager();