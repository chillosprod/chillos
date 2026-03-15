// ===== ChillOS - Main Application =====

(function() {
    'use strict';

    // ===== DISABLE BROWSER DEFAULTS =====
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    document.addEventListener('keydown', e => {
        const allowedCombos = [
            e.ctrlKey && (e.key === 'r' || e.key === 'R'),
            e.key === 'Escape'
        ];
        
        if ((e.ctrlKey || e.altKey || e.metaKey) && !allowedCombos.some(Boolean)) {
            e.preventDefault();
        }
        
        if (e.key.startsWith('F') && e.key !== 'F5') {
            e.preventDefault();
        }
    });

    // ===== CONFIGURATION =====
	const CONFIG = {
    boot: {
        logoDisplayTime: 1500,
        loadingTime: 4000,
        blackScreenTime: 2000
    },
    paths: {
        wallpapers: './assets/wallpapers/',
        icons: './assets/icons/',
        sounds: './chillos/sounds/'
    },
    defaultWallpaper: 'cities/moscowchill.jpg',
    github: 'https://github.com/chillosprod/chillos',
    telegram: 'https://t.me/chillosprod'
};

    // ===== INTERESTING FACTS =====
    const FACTS = [
        "Первый компьютерный вирус был создан в 1986 году и назывался Brain.",
        "JavaScript был создан всего за 10 дней в 1995 году.",
        "Первый веб-сайт всё ещё работает: info.cern.ch",
        "В мире более 1.9 миллиарда веб-сайтов.",
        "Первый смартфон был создан IBM в 1992 году.",
        "Linux используется на 96.3% всех веб-серверов.",
        "Первый программист в истории — женщина, Ада Лавлейс.",
        "Google обрабатывает более 8.5 миллиардов запросов в день.",
        "Первая компьютерная мышь была деревянной.",
        "WiFi не означает 'Wireless Fidelity' — это просто торговая марка."
    ];

    // ===== WALLPAPER DATA =====
    const WALLPAPERS = {
        cities: {
            title: '🏙️ Города',
            items: [
                { file: 'moscowchill.jpg', name: 'Москва, Россия' },
                { file: 'tokyochill.jpg', name: 'Токио, Япония' },
                { file: 'nychill.jpg', name: 'Нью-Йорк, США' },
                { file: 'parischill.jpg', name: 'Париж, Франция' },
                { file: 'seoulchill.jpg', name: 'Сеул, Южная Корея' },
                { file: 'berlinchill.jpg', name: 'Берлин, Германия' }
            ]
        },
        oshinoko: {
            title: '⭐ Oshi No Ko',
            items: [
                { file: 'ai.jpeg', name: 'Ай Хошино' },
                { file: 'ruby.jpeg', name: 'Хошино Руби' },
                { file: 'aqua.png', name: 'Хошино Аква' },
                { file: 'arimakane.png', name: 'Арима Кане' },
                { file: 'akane.png', name: 'Акане Курокава' }
            ]
        },
        aps: {
            title: '👼 Ангел по соседству',
            items: [
                { file: 'mahiroshiina1.png', name: 'Махиро Шиина #1' },
                { file: 'mahiroshiina2.png', name: 'Махиро Шиина #2' }
            ]
        },
        'aharen-san': {
            title: '😶 Непостижимая Ахарен-сан',
            items: [
                { file: 'aharen1.png', name: 'Ахарэн Рейна #1' },
                { file: 'aharen2.png', name: 'Ахарэн Рейна #2' },
                { file: 'aharen3.jpg', name: 'Ахарэн Рейна #3' },
                { file: 'aharen4.jpg', name: 'Ахарэн Рейна #4' }
            ]
        },
        'mahiro-oyama': {
            title: '🎀 Махиро Ояма',
            items: [
                { file: 'mahiro1.webp', name: 'Махиро #1' },
                { file: 'mahiro2.jpg', name: 'Махиро #2' },
                { file: 'mahiro3.webp', name: 'Махиро #3' }
            ]
        },
        senko: {
            title: '🦊 Сенко-сан',
            items: [
                { file: 'senko1.jpg', name: 'Сенко' }
            ]
        },
        waguri: {
            title: '🌸 Вагури Каоруко',
            items: [
                { file: 'waguri.jpg', name: 'Вагури Каоруко' }
            ]
        }
    };

    // ===== SYSTEM APPS =====
    const SYSTEM_APPS = [
        { id: 'settings', name: 'Настройки', icon: './assets/icons/settings.png' },
        { id: 'famelack', name: 'Famelack', icon: 'https://famelack.com/favicon.ico' },
        { id: 'ruby', name: 'Ruby', icon: './assets/icons/ruby.png' }
    ];

    // ===== BOOT MESSAGES =====
    const BOOT_MESSAGES = [
        'Инициализация ядра ChillOS...',
        'Загрузка системных компонентов...',
        'Подключение файловой системы...',
        'Инициализация графической подсистемы...',
        'Загрузка пользовательского интерфейса...',
        'Применение настроек персонализации...',
        'Запуск системных служб...',
        'Проверка целостности данных...',
        'Загрузка профиля пользователя...',
        'Подготовка рабочего окружения...',
        'Финальная инициализация...',
        'Система готова к работе'
    ];

    // ===== STATE =====
    const state = {
        isFirstRun: true,
        currentUser: null,
        currentWallpaper: CONFIG.defaultWallpaper,
        openWindows: [],
        activeWindowId: null,
        windowZIndex: 100,
        isFullscreen: false,
        loginListenersActive: false,
        loginFormShown: false,
        customApps: [],
        rubyWarningShown: false,
        selection: { active: false, startX: 0, startY: 0 },
        clockPopupOpen: false
    };

    // ===== DOM ELEMENTS =====
    let elements = {};

    // ===== INITIALIZATION =====
	function init() {
    cacheElements();
    loadState();
    requestAutoFullscreen();
    startBoot();
	}

    function cacheElements() {
        elements = {
            bootScreen: document.getElementById('boot-screen'),
            lockScreen: document.getElementById('lock-screen'),
            transitionScreen: document.getElementById('transition-screen'),
            desktop: document.getElementById('desktop'),
            bootLogo: document.getElementById('boot-logo'),
            bootSpinner: document.getElementById('boot-spinner'),
            bootStatus: document.getElementById('boot-status'),
            lockVideo: document.getElementById('lock-video'),
            lockBackground: document.getElementById('lock-background'),
            lockOverlay: document.getElementById('lock-overlay'),
            lockBlurOverlay: document.getElementById('lock-blur-overlay'),
            setupWindow: document.getElementById('setup-window'),
            setupContent: document.getElementById('setup-content'),
            setupFooter: document.getElementById('setup-footer'),
            loginScreen: document.getElementById('login-screen'),
            loginHintContainer: document.getElementById('login-hint-container'),
            loginForm: document.getElementById('login-form'),
            displayUsername: document.getElementById('display-username'),
            loginPassword: document.getElementById('login-password'),
            loginSubmit: document.getElementById('login-submit'),
            loginError: document.getElementById('login-error'),
            wallpaper: document.getElementById('wallpaper'),
            selectionBox: document.getElementById('selection-box'),
            desktopIcons: document.getElementById('desktop-icons'),
            windowsContainer: document.getElementById('windows-container'),
            githubButton: document.getElementById('github-button'),
            taskbar: document.getElementById('taskbar'),
            taskbarApps: document.getElementById('taskbar-apps'),
            taskbarTime: document.getElementById('taskbar-time'),
            clockPopup: document.getElementById('clock-popup'),
            startButton: document.getElementById('start-button'),
            startMenu: document.getElementById('start-menu'),
            startMenuApps: document.getElementById('start-menu-apps'),
            startUsername: document.getElementById('start-username'),
            powerButton: document.getElementById('power-button'),
            powerMenu: document.getElementById('power-menu'),
            restartBtn: document.getElementById('restart-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            rubyWarningModal: document.getElementById('ruby-warning-modal'),
            rubyWarningContinue: document.getElementById('ruby-warning-continue'),
            testAppModal: document.getElementById('test-app-modal'),
            testAppContent: document.getElementById('test-app-content'),
            testAppClose: document.getElementById('test-app-close'),
            welcomeSound: document.getElementById('welcome-sound'),
            windowTemplate: document.getElementById('window-template')
        };
    }
	
	function requestAutoFullscreen() {
    const enter = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    enter();

    const onceEvents = ['click', 'mousedown', 'keydown', 'touchstart'];
    onceEvents.forEach(eventName => {
        window.addEventListener(eventName, enter, { once: true });
    });
}

    function loadState() {
        const savedUser = localStorage.getItem('chillos_user');
        const savedWallpaper = localStorage.getItem('chillos_wallpaper');
        const savedApps = localStorage.getItem('chillos_custom_apps');
        const rubyWarning = localStorage.getItem('chillos_ruby_warning');
        
        if (savedUser) {
            try {
                state.currentUser = JSON.parse(savedUser);
                state.isFirstRun = false;
            } catch (e) {
                state.isFirstRun = true;
            }
        }
        
        if (savedWallpaper) state.currentWallpaper = savedWallpaper;
        if (savedApps) {
            try {
                state.customApps = JSON.parse(savedApps);
            } catch (e) {
                state.customApps = [];
            }
        }
        if (rubyWarning) state.rubyWarningShown = true;
    }

    function saveUser(username, password) {
        state.currentUser = { username, password };
        localStorage.setItem('chillos_user', JSON.stringify(state.currentUser));
    }

    function saveWallpaper(path) {
        state.currentWallpaper = path;
        localStorage.setItem('chillos_wallpaper', path);
    }

    function saveCustomApps() {
        localStorage.setItem('chillos_custom_apps', JSON.stringify(state.customApps));
    }

    // ===== BOOT PROCESS =====
    function startBoot() {
        setTimeout(() => {
            elements.bootSpinner.classList.remove('hidden');
            elements.bootStatus.classList.remove('hidden');
            
            let idx = 0;
            const interval = CONFIG.boot.loadingTime / BOOT_MESSAGES.length;
            
            const bootInterval = setInterval(() => {
                if (idx < BOOT_MESSAGES.length) {
                    elements.bootStatus.textContent = BOOT_MESSAGES[idx++];
                } else {
                    clearInterval(bootInterval);
                    finishBoot();
                }
            }, interval);
        }, CONFIG.boot.logoDisplayTime);
    }

    function finishBoot() {
        elements.bootLogo.classList.add('fade-out');
        elements.bootSpinner.classList.add('hidden');
        elements.bootStatus.classList.add('hidden');
        
        setTimeout(() => {
            elements.bootScreen.classList.remove('active');
            elements.lockScreen.classList.add('active');
            elements.welcomeSound.play().catch(() => {});
            startLockScreen();
        }, CONFIG.boot.blackScreenTime);
    }

    // ===== LOCK SCREEN =====
    function startLockScreen() {
        elements.lockVideo.src = './assets/blockscreen/blockscreen.mp4';
        elements.lockVideo.onloadedmetadata = () => {
            elements.lockVideo.play().catch(() => showLockBackground());
        };
        elements.lockVideo.onerror = () => showLockBackground();
        elements.lockVideo.addEventListener('ended', showLockBackground, { once: true });
    }

    function showLockBackground() {
        elements.lockVideo.style.opacity = '0';
        elements.lockBackground.classList.add('visible');
        
        setTimeout(() => {
            elements.lockVideo.style.display = 'none';
            if (state.isFirstRun) {
                showSetupWizard();
            } else {
                showLoginScreen();
            }
        }, 500);
    }

    // ===== SETUP WIZARD =====
    function showSetupWizard() {
        setTimeout(() => {
            elements.lockOverlay.classList.add('dimmed');
            setTimeout(() => {
                elements.setupWindow.classList.remove('hidden');
                void elements.setupWindow.offsetWidth;
                elements.setupWindow.classList.add('visible');
                showSetupStep1();
            }, 500);
        }, 300);
    }

    function showSetupStep1() {
        elements.setupContent.innerHTML = `
            <p>Похоже, вы здесь впервые. Это приятно — значит, начинается ваше первое знакомство с системой.</p>
            <p>Сейчас вы находитесь на экране блокировки. Его легко узнать по фоновому изображению с большим замком и надписью ChillOS.</p>
            <p>Этот экран служит своеобразной «дверью» в систему — прежде чем попасть внутрь, нужно создать пользователя и подготовить пространство для работы.</p>
            <p>ChillOS устроена немного необычно. Формально это не традиционная операционная система, а веб-среда, которая ведёт себя как полноценная оболочка ОС.</p>
        `;
        elements.setupFooter.innerHTML = `<button class="btn btn-primary" id="setup-next-1">Далее</button>`;
        document.getElementById('setup-next-1').onclick = showSetupStep2;
    }

    function showSetupStep2() {
        elements.setupContent.innerHTML = `
            <p>Но перед тем как продолжить, давайте немного всё настроим. Во время начальной настройки вы сможете:</p>
            <ul>
                <li>создать своего пользователя;</li>
                <li>выбрать имя и внешний вид профиля;</li>
                <li>настроить базовые параметры интерфейса;</li>
                <li>подготовить рабочее пространство.</li>
            </ul>
            <p>Это займёт всего несколько минут, и после этого ChillOS будет готова к работе.</p>
        `;
        elements.setupFooter.innerHTML = `
            <button class="btn btn-secondary" id="setup-back-2">Назад</button>
            <button class="btn btn-primary" id="setup-start">Начать настройку</button>
        `;
        document.getElementById('setup-back-2').onclick = showSetupStep1;
        document.getElementById('setup-start').onclick = showSetupStep3;
    }

    function showSetupStep3() {
        elements.setupContent.innerHTML = `
            <p>Перед тем как продолжить, давайте немного познакомимся. Укажите несколько данных о себе.</p>
            <div class="form-group">
                <label for="setup-username">Имя пользователя</label>
                <input type="text" id="setup-username" placeholder="Введите имя" maxlength="30" autocomplete="off">
                <div class="form-error" id="username-error"></div>
            </div>
            <div class="form-group">
                <label for="setup-password">Пароль</label>
                <input type="password" id="setup-password" placeholder="Введите пароль" autocomplete="new-password">
                <div class="form-error" id="password-error"></div>
            </div>
            <div class="form-group">
                <label for="setup-password-confirm">Подтверждение пароля</label>
                <input type="password" id="setup-password-confirm" placeholder="Повторите пароль" autocomplete="new-password">
                <div class="form-error" id="password-confirm-error"></div>
            </div>
        `;
        elements.setupFooter.innerHTML = `
            <button class="btn btn-secondary" id="setup-back-3">Назад</button>
            <button class="btn btn-primary" id="setup-create" disabled>Далее</button>
        `;
        
        const usernameInput = document.getElementById('setup-username');
        const passwordInput = document.getElementById('setup-password');
        const confirmInput = document.getElementById('setup-password-confirm');
        const createBtn = document.getElementById('setup-create');
        
        function validate() {
            const u = usernameInput.value.trim();
            const p = passwordInput.value;
            const c = confirmInput.value;
            let valid = true;
            
            if (!u || !/^[\x20-\x7E]+$/.test(u)) {
                document.getElementById('username-error').textContent = u ? 'Недопустимые символы' : 'Введите имя';
                valid = false;
            } else {
                document.getElementById('username-error').textContent = '';
            }
            
            if (!p || !/^[a-zA-Z0-9]+$/.test(p)) {
                document.getElementById('password-error').textContent = p ? 'Только латиница и цифры' : 'Введите пароль';
                valid = false;
            } else {
                document.getElementById('password-error').textContent = '';
            }
            
            if (p !== c) {
                document.getElementById('password-confirm-error').textContent = 'Пароли не совпадают';
                valid = false;
            } else {
                document.getElementById('password-confirm-error').textContent = '';
            }
            
            createBtn.disabled = !valid;
            return valid;
        }
        
        usernameInput.oninput = passwordInput.oninput = confirmInput.oninput = validate;
        document.getElementById('setup-back-3').onclick = showSetupStep2;
        
        createBtn.onclick = () => {
            if (validate()) {
                elements.setupContent.innerHTML = `<div class="setup-loading"><div class="spinner"></div><span>Загрузка...</span></div>`;
                elements.setupFooter.innerHTML = '';
                
                setTimeout(() => {
                    saveUser(usernameInput.value.trim(), passwordInput.value);
                    state.isFirstRun = false;
                    elements.setupWindow.classList.remove('visible');
                    setTimeout(() => {
                        elements.setupWindow.classList.add('hidden');
                        elements.lockOverlay.classList.remove('dimmed');
                        showLoginScreen();
                    }, 400);
                }, 1500);
            }
        };
    }

    // ===== LOGIN SCREEN =====
    function showLoginScreen() {
        state.loginFormShown = false;
        elements.loginScreen.classList.remove('hidden');
        elements.loginHintContainer.classList.remove('hidden', 'animate-up');
        elements.loginForm.classList.remove('login-form-visible');
        elements.loginForm.classList.add('login-form-hidden');
        elements.lockBlurOverlay.classList.remove('active');
        elements.loginPassword.value = '';
        elements.loginError.classList.add('hidden');
        
        if (!state.loginListenersActive) {
            setupLoginListeners();
            state.loginListenersActive = true;
        }
    }

    function setupLoginListeners() {
        let isDragging = false, startY = 0;
        
        const triggerLogin = () => {
            if (state.loginFormShown || !elements.lockScreen.classList.contains('active') || 
                elements.setupWindow.classList.contains('visible')) return;
            
            state.loginFormShown = true;
            elements.loginHintContainer.classList.add('animate-up');
            
            setTimeout(() => {
                elements.lockBlurOverlay.classList.add('active');
                setTimeout(() => {
                    elements.loginHintContainer.classList.add('hidden');
                    elements.displayUsername.textContent = state.currentUser.username;
                    elements.loginForm.classList.remove('login-form-hidden');
                    elements.loginForm.classList.add('login-form-visible');
                    setTimeout(() => elements.loginPassword.focus(), 100);
                }, 300);
            }, 500);
        };
        
        document.addEventListener('keydown', e => {
            if (elements.lockScreen.classList.contains('active') && 
                !elements.setupWindow.classList.contains('visible') && 
                !state.loginFormShown && (e.code === 'Space' || e.code === 'Enter')) {
                e.preventDefault();
                triggerLogin();
            }
        });
        
        elements.lockScreen.addEventListener('mousedown', e => {
            if (!state.loginFormShown && !elements.setupWindow.classList.contains('visible')) {
                isDragging = true;
                startY = e.clientY;
            }
        });
        
        document.addEventListener('mousemove', e => {
            if (isDragging && !state.loginFormShown && startY - e.clientY > 50) {
                isDragging = false;
                triggerLogin();
            }
        });
        
        document.addEventListener('mouseup', () => isDragging = false);
        
        elements.loginSubmit.onclick = attemptLogin;
        elements.loginPassword.onkeydown = e => { if (e.code === 'Enter') attemptLogin(); };
    }

    function attemptLogin() {
        if (elements.loginPassword.value === state.currentUser.password) {
            elements.loginError.classList.add('hidden');
            enterDesktop();
        } else {
            elements.loginError.classList.remove('hidden');
            elements.loginPassword.value = '';
            elements.loginPassword.focus();
        }
    }

    // ===== DESKTOP TRANSITION =====
    function enterDesktop() {
        elements.transitionScreen.classList.add('active');
        
        setTimeout(() => {
            elements.lockScreen.classList.remove('active');
            elements.desktop.classList.add('active');
            elements.wallpaper.style.backgroundImage = `url('${CONFIG.paths.wallpapers}${state.currentWallpaper}')`;
            
            setTimeout(() => {
                elements.transitionScreen.classList.remove('active');
                setTimeout(() => {
                    elements.desktop.classList.add('visible');
                    setupDesktop();
                    startClock();
                }, 100);
            }, 2000);
        }, 500);
    }

    // ===== DESKTOP =====
    function setupDesktop() {
        elements.startUsername.textContent = state.currentUser.username;
        
        renderDesktopIcons();
        renderStartMenuApps();
        setupDesktopSelection();
        setupDesktopDragDrop();
        setupClockPopup();
        
        elements.githubButton.onclick = () => window.open(CONFIG.github, '_blank');
        elements.startButton.onclick = e => { e.stopPropagation(); toggleStartMenu(); };
        elements.powerButton.onclick = e => { e.stopPropagation(); togglePowerMenu(); };
        elements.restartBtn.onclick = () => location.reload();
        elements.fullscreenBtn.onclick = toggleFullscreen;
        
        elements.rubyWarningContinue.onclick = () => {
            elements.rubyWarningModal.classList.add('hidden');
            localStorage.setItem('chillos_ruby_warning', 'true');
            state.rubyWarningShown = true;
            openRubyApp();
        };
        
        elements.testAppClose.onclick = () => {
            elements.testAppModal.classList.add('hidden');
            elements.testAppContent.innerHTML = '';
        };
        
        document.addEventListener('click', e => {
            if (!elements.startMenu.contains(e.target) && !elements.startButton.contains(e.target)) {
                closeStartMenu();
            }
            if (!elements.powerMenu.contains(e.target) && !elements.powerButton.contains(e.target)) {
                closePowerMenu();
            }
            if (!elements.clockPopup.contains(e.target) && !elements.taskbarTime.contains(e.target)) {
                closeClockPopup();
            }
        });
    }

    function renderDesktopIcons() {
        elements.desktopIcons.innerHTML = '';
        
        SYSTEM_APPS.forEach(app => {
            elements.desktopIcons.appendChild(createDesktopIcon(app.id, app.name, app.icon));
        });
        
        state.customApps.forEach(app => {
            elements.desktopIcons.appendChild(createDesktopIcon(`custom_${app.id}`, app.name, app.icon || './assets/icons/app.png'));
        });
    }

    function createDesktopIcon(id, name, icon) {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.dataset.app = id;
        el.tabIndex = 0;
        el.innerHTML = `
            <div class="desktop-icon-img"><img src="${icon}" alt="${name}" onerror="this.src='./assets/icons/app.png'"></div>
            <span>${name}</span>
        `;
        
        el.ondblclick = () => openApp(id);
        el.onclick = e => {
            if (!e.ctrlKey) document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            el.classList.toggle('selected');
        };
        
        return el;
    }

    function renderStartMenuApps() {
        elements.startMenuApps.innerHTML = '';
        
        SYSTEM_APPS.forEach(app => {
            const el = document.createElement('div');
            el.className = 'start-menu-app';
            el.dataset.app = app.id;
            el.innerHTML = `
                <div class="start-app-icon"><img src="${app.icon}" alt="${app.name}" onerror="this.src='./assets/icons/app.png'"></div>
                <span>${app.name}</span>
            `;
            el.onclick = () => { openApp(app.id); closeStartMenu(); };
            elements.startMenuApps.appendChild(el);
        });
        
        state.customApps.forEach(app => {
            const el = document.createElement('div');
            el.className = 'start-menu-app';
            el.dataset.app = `custom_${app.id}`;
            el.innerHTML = `
                <div class="start-app-icon"><img src="${app.icon || './assets/icons/app.png'}" alt="${app.name}"></div>
                <span>${app.name}</span>
            `;
            el.onclick = () => { openApp(`custom_${app.id}`); closeStartMenu(); };
            elements.startMenuApps.appendChild(el);
        });
    }

    function setupDesktopSelection() {
        const box = elements.selectionBox;
        
        elements.desktop.addEventListener('mousedown', e => {
            if (e.target === elements.wallpaper || e.target === elements.desktop || e.target === elements.desktopIcons) {
                if (e.target.closest('.desktop-icon')) return;
                
                state.selection.active = true;
                state.selection.startX = e.clientX;
                state.selection.startY = e.clientY;
                
                box.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;`;
                box.classList.remove('hidden');
                
                if (!e.ctrlKey) {
                    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
                }
            }
        });
        
        document.addEventListener('mousemove', e => {
            if (!state.selection.active) return;
            
            const left = Math.min(state.selection.startX, e.clientX);
            const top = Math.min(state.selection.startY, e.clientY);
            const width = Math.abs(e.clientX - state.selection.startX);
            const height = Math.abs(e.clientY - state.selection.startY);
            
            box.style.cssText = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;`;
            
            const rect = box.getBoundingClientRect();
            document.querySelectorAll('.desktop-icon').forEach(icon => {
                const ir = icon.getBoundingClientRect();
                const intersects = !(rect.right < ir.left || rect.left > ir.right || rect.bottom < ir.top || rect.top > ir.bottom);
                icon.classList.toggle('selected', intersects || (e.ctrlKey && icon.classList.contains('selected')));
            });
        });
        
        document.addEventListener('mouseup', () => {
            if (state.selection.active) {
                state.selection.active = false;
                box.classList.add('hidden');
            }
        });
    }

    function setupDesktopDragDrop() {
        let dragIcon = null, placeholder = null, startRect = null;
        
        elements.desktopIcons.addEventListener('mousedown', e => {
            const icon = e.target.closest('.desktop-icon');
            if (!icon) return;
            
            e.preventDefault();
            startRect = icon.getBoundingClientRect();
            
            const onMove = ev => {
                if (!dragIcon && (Math.abs(ev.clientX - e.clientX) > 5 || Math.abs(ev.clientY - e.clientY) > 5)) {
                    dragIcon = icon;
                    placeholder = document.createElement('div');
                    placeholder.className = 'desktop-icon drag-placeholder';
                    icon.parentNode.insertBefore(placeholder, icon);
                    
                    icon.classList.add('dragging');
                    icon.style.width = startRect.width + 'px';
                    icon.style.height = startRect.height + 'px';
                }
                
                if (dragIcon) {
                    dragIcon.style.left = (ev.clientX - startRect.width / 2) + 'px';
                    dragIcon.style.top = (ev.clientY - startRect.height / 2) + 'px';
                    
                    const icons = [...elements.desktopIcons.querySelectorAll('.desktop-icon:not(.dragging):not(.drag-placeholder)')];
                    let closest = null, closestDist = Infinity;
                    
                    icons.forEach(ic => {
                        const r = ic.getBoundingClientRect();
                        const dist = Math.hypot(ev.clientX - (r.left + r.width/2), ev.clientY - (r.top + r.height/2));
                        if (dist < closestDist) {
                            closestDist = dist;
                            closest = ic;
                        }
                    });
                    
                    if (closest && closestDist < 80) {
                        const r = closest.getBoundingClientRect();
                        if (ev.clientX < r.left + r.width/2) {
                            closest.parentNode.insertBefore(placeholder, closest);
                        } else {
                            closest.parentNode.insertBefore(placeholder, closest.nextSibling);
                        }
                    }
                }
            };
            
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                
                if (dragIcon) {
                    dragIcon.classList.remove('dragging');
                    dragIcon.style.cssText = '';
                    placeholder.parentNode.insertBefore(dragIcon, placeholder);
                    placeholder.remove();
                    dragIcon = null;
                    placeholder = null;
                }
            };
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    // ===== CLOCK POPUP =====
    function setupClockPopup() {
        elements.taskbarTime.onclick = e => {
            e.stopPropagation();
            toggleClockPopup();
        };
    }

    function toggleClockPopup() {
        if (state.clockPopupOpen) {
            closeClockPopup();
        } else {
            openClockPopup();
        }
    }

    function openClockPopup() {
        state.clockPopupOpen = true;
        updateClockPopup();
        elements.clockPopup.classList.remove('hidden');
        elements.clockPopup.classList.add('visible');
    }

    function closeClockPopup() {
        state.clockPopupOpen = false;
        elements.clockPopup.classList.remove('visible');
        elements.clockPopup.classList.add('hidden');
    }

    function updateClockPopup() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        const dayOfWeek = now.getDay();
        
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        let calendarHTML = '<div class="calendar-grid">';
        dayNames.forEach(d => calendarHTML += `<div class="calendar-day-name">${d}</div>`);
        
        for (let i = firstDay - 1; i >= 0; i--) {
            calendarHTML += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === day;
            calendarHTML += `<div class="calendar-day${isToday ? ' today' : ''}">${i}</div>`;
        }
        
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        const nextDays = totalCells - (firstDay + daysInMonth);
        for (let i = 1; i <= nextDays; i++) {
            calendarHTML += `<div class="calendar-day other-month">${i}</div>`;
        }
        
        calendarHTML += '</div>';
        
        elements.clockPopup.innerHTML = `
            <div class="clock-popup-time">${hours}:${minutes}:${seconds}</div>
            <div class="clock-popup-date">${dayNames[dayOfWeek]}, ${day} ${monthNames[month]} ${year}</div>
            <div class="clock-popup-divider"></div>
            <div class="calendar-header">
                <span class="calendar-month">${monthNames[month]} ${year}</span>
            </div>
            ${calendarHTML}
        `;
    }

    function toggleStartMenu() {
        if (elements.startMenu.classList.contains('visible')) {
            closeStartMenu();
        } else {
            elements.startMenu.classList.remove('hidden');
            requestAnimationFrame(() => elements.startMenu.classList.add('visible'));
            closePowerMenu();
            closeClockPopup();
        }
    }

    function closeStartMenu() {
        elements.startMenu.classList.remove('visible');
        elements.startMenu.classList.add('hidden');
    }

    function togglePowerMenu() {
        elements.powerMenu.classList.toggle('power-menu-visible');
        elements.powerMenu.classList.toggle('power-menu-hidden');
    }

    function closePowerMenu() {
        elements.powerMenu.classList.remove('power-menu-visible');
        elements.powerMenu.classList.add('power-menu-hidden');
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
        closePowerMenu();
    }

    function startClock() {
        const update = () => {
            const now = new Date();
            elements.taskbarTime.innerHTML = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}<br>${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')}.${now.getFullYear()}`;
            
            if (state.clockPopupOpen) {
                updateClockPopup();
            }
        };
        update();
        setInterval(update, 1000);
    }

    // ===== WINDOW MANAGEMENT =====
    function openApp(appId) {
        const existing = state.openWindows.find(w => w.app === appId);
        if (existing) {
            focusWindow(existing.id);
            existing.element.classList.remove('minimized');
            return;
        }
        
        if (appId.startsWith('custom_')) {
            const customId = appId.replace('custom_', '');
            const app = state.customApps.find(a => a.id === customId);
            if (app) runCustomApp(app);
            return;
        }
        
        if (appId === 'ruby' && !state.rubyWarningShown) {
            elements.rubyWarningModal.classList.remove('hidden');
            return;
        }
        
        const config = getAppConfig(appId);
        if (!config) return;
        
        createWindow(appId, config);
    }

    function getAppConfig(appId) {
        const configs = {
            settings: {
                title: 'Настройки',
                icon: './assets/icons/settings.png',
                width: 900,
                height: 600,
                content: () => createSettingsContent()
            },
            famelack: {
                title: 'Famelack',
                icon: 'https://famelack.com/favicon.ico',
                width: 1000,
                height: 700,
                content: () => `<div class="webapp-container"><iframe src="https://famelack.com" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe></div>`
            },
            ruby: {
                title: 'Ruby',
                icon: './assets/icons/ruby.png',
                width: 950,
                height: 650,
                content: () => createRubyContent()
            }
        };
        return configs[appId];
    }

    function createWindow(appId, config) {
        const id = 'window-' + Date.now();
        const template = elements.windowTemplate.content.cloneNode(true);
        const win = template.querySelector('.window');
        
        win.id = id;
        win.style.cssText = `width:${config.width}px;height:${config.height}px;left:${50 + state.openWindows.length * 30}px;top:${50 + state.openWindows.length * 30}px;`;
        win.querySelector('.window-icon').src = config.icon;
        win.querySelector('.window-title-text').textContent = config.title;
        win.querySelector('.window-content').innerHTML = config.content();
        
        elements.windowsContainer.appendChild(win);
        
        state.openWindows.push({ id, app: appId, element: win });
        
        setupWindowControls(win, id);
        addToTaskbar(id, appId, config.icon, config.title);
        
        requestAnimationFrame(() => {
            win.classList.add('visible');
            focusWindow(id);
        });
        
        if (appId === 'settings') initSettingsApp(win);
        if (appId === 'ruby') initRubyApp(win);
    }

    function setupWindowControls(win, id) {
        const header = win.querySelector('.window-header');
        const minimize = win.querySelector('.minimize');
        const maximize = win.querySelector('.maximize');
        const close = win.querySelector('.close');
        
        win.onmousedown = () => focusWindow(id);
        minimize.onclick = () => win.classList.add('minimized');
        maximize.onclick = () => win.classList.toggle('maximized');
        close.onclick = () => closeWindow(id);
        header.ondblclick = e => { if (!e.target.closest('.window-controls')) win.classList.toggle('maximized'); };
        
        let dragging = false, ox = 0, oy = 0;
        header.onmousedown = e => {
            if (e.target.closest('.window-controls') || win.classList.contains('maximized')) return;
            dragging = true;
            ox = e.clientX - win.offsetLeft;
            oy = e.clientY - win.offsetTop;
            
            const move = ev => {
                if (!dragging) return;
                win.style.left = Math.max(0, Math.min(ev.clientX - ox, window.innerWidth - win.offsetWidth)) + 'px';
                win.style.top = Math.max(0, Math.min(ev.clientY - oy, window.innerHeight - 76 - win.offsetHeight)) + 'px';
            };
            const up = () => { dragging = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        };
        
        ['n','s','e','w','ne','nw','se','sw'].forEach(edge => {
            const r = document.createElement('div');
            r.className = 'window-resizer';
            r.style.cssText = getResizeStyle(edge);
            win.appendChild(r);
            
            r.onmousedown = e => {
                if (win.classList.contains('maximized')) return;
                e.preventDefault();
                const sx = e.clientX, sy = e.clientY;
                const sw = win.offsetWidth, sh = win.offsetHeight;
                const sl = win.offsetLeft, st = win.offsetTop;
                
                const move = ev => {
                    const dx = ev.clientX - sx, dy = ev.clientY - sy;
                    if (edge.includes('e')) win.style.width = Math.max(400, sw + dx) + 'px';
                    if (edge.includes('w')) { const nw = Math.max(400, sw - dx); if (nw > 400) { win.style.width = nw + 'px'; win.style.left = sl + dx + 'px'; } }
                    if (edge.includes('s')) win.style.height = Math.max(300, sh + dy) + 'px';
                    if (edge.includes('n')) { const nh = Math.max(300, sh - dy); if (nh > 300) { win.style.height = nh + 'px'; win.style.top = st + dy + 'px'; } }
                };
                const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
            };
        });
    }

    function getResizeStyle(edge) {
        const styles = {
            n: 'top:0;left:8px;right:8px;height:4px;cursor:n-resize;',
            s: 'bottom:0;left:8px;right:8px;height:4px;cursor:s-resize;',
            e: 'right:0;top:8px;bottom:8px;width:4px;cursor:e-resize;',
            w: 'left:0;top:8px;bottom:8px;width:4px;cursor:w-resize;',
            ne: 'top:0;right:0;width:8px;height:8px;cursor:ne-resize;',
            nw: 'top:0;left:0;width:8px;height:8px;cursor:nw-resize;',
            se: 'bottom:0;right:0;width:8px;height:8px;cursor:se-resize;',
            sw: 'bottom:0;left:0;width:8px;height:8px;cursor:sw-resize;'
        };
        return 'position:absolute;z-index:10;' + styles[edge];
    }

    function focusWindow(id) {
        state.openWindows.forEach(w => w.element.classList.remove('focused'));
        const w = state.openWindows.find(w => w.id === id);
        if (w) {
            w.element.style.zIndex = ++state.windowZIndex;
            w.element.classList.add('focused');
            state.activeWindowId = id;
            document.querySelectorAll('.taskbar-app').forEach(a => a.classList.toggle('active', a.dataset.windowId === id));
        }
    }

    function closeWindow(id) {
        const idx = state.openWindows.findIndex(w => w.id === id);
        if (idx !== -1) {
            const w = state.openWindows[idx];
            w.element.classList.remove('visible');
            setTimeout(() => {
                w.element.remove();
                state.openWindows.splice(idx, 1);
                document.querySelector(`.taskbar-app[data-window-id="${id}"]`)?.remove();
            }, 200);
        }
    }

    function addToTaskbar(id, appId, icon, title) {
        const el = document.createElement('div');
        el.className = 'taskbar-icon taskbar-app active';
        el.dataset.windowId = id;
        el.innerHTML = `<img src="${icon}" alt="${title}" onerror="this.src='./assets/icons/app.png'">`;
        el.onclick = () => {
            const w = state.openWindows.find(w => w.id === id);
            if (w) {
                if (w.element.classList.contains('minimized')) {
                    w.element.classList.remove('minimized');
                    focusWindow(id);
                } else if (state.activeWindowId === id) {
                    w.element.classList.add('minimized');
                } else {
                    focusWindow(id);
                }
            }
        };
        elements.taskbarApps.appendChild(el);
    }

    // ===== SETTINGS APP =====
    function createSettingsContent() {
    return `
        <div class="settings-container">
            <div class="settings-sidebar">
                <div class="settings-nav-item active" data-section="appearance">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/>
                    </svg>
                    <span>Оформление</span>
                </div>

                <div class="settings-nav-item" data-section="account">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Пользователь</span>
                </div>

                <div class="settings-nav-item" data-section="about">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 7h2V9h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                    <span>О системе</span>
                </div>
            </div>

            <div class="settings-main">
                <div id="settings-appearance" class="settings-section-content">
                    <h1 class="settings-title">Оформление</h1>
                    <div class="settings-section">
                        <h2 class="settings-section-title">Фоновое изображение</h2>
                        <div id="wallpaper-categories"></div>
                    </div>
                </div>

                <div id="settings-account" class="settings-section-content hidden">
                    <h1 class="settings-title">Пользователь</h1>
                    <div class="settings-section">
                        <div class="form-group">
                            <label>Имя пользователя</label>
                            <input type="text" id="account-username" value="${state.currentUser?.username || ''}">
                            <div class="form-error" id="account-username-error"></div>
                        </div>

                        <div class="form-group">
                            <label>Новый пароль (оставьте пустым, если не хотите менять)</label>
                            <input type="password" id="account-password" placeholder="Новый пароль">
                            <div class="form-error" id="account-password-error"></div>
                        </div>

                        <div class="form-group">
                            <label>Подтверждение пароля</label>
                            <input type="password" id="account-password-confirm" placeholder="Подтвердите пароль">
                        </div>

                        <button class="btn btn-primary" id="account-save">Сохранить</button>
                        <div class="success-message hidden" id="account-success">Данные сохранены!</div>
                    </div>
                </div>

                <div id="settings-about" class="settings-section-content hidden">
                    <h1 class="settings-title">О системе</h1>

                    <div class="system-about-card">
                        <div class="system-about-title">ChillOS</div>
                        <p>
                            ChillOS — это браузерная операционная среда, стилизованная под современную настольную систему.
                            Она сочетает в себе визуальную эстетику, лёгкость веб-технологий и поведение, приближённое к полноценной ОС.
                        </p>
                        <p>
                            Система запускается прямо в браузере, поддерживает экран блокировки, рабочий стол, окна приложений,
                            меню «Пуск», параметры, пользовательские данные, локальное хранение настроек и расширение через внутренние приложения.
                        </p>
                        <p>
                            Проект создаётся как демонстрационная и экспериментальная среда, в которой можно постепенно наращивать экосистему приложений.
                        </p>
                    </div>

                    <div class="system-about-card">
                        <div class="system-about-title">Сведения</div>
                        <div class="system-specs">
                            <div class="system-spec-item">
                                <div class="system-spec-label">Название системы</div>
                                <div class="system-spec-value">ChillOS</div>
                            </div>
                            <div class="system-spec-item">
                                <div class="system-spec-label">Текущий пользователь</div>
                                <div class="system-spec-value">${state.currentUser?.username || 'Неизвестно'}</div>
                            </div>
                            <div class="system-spec-item">
                                <div class="system-spec-label">Платформа</div>
                                <div class="system-spec-value">${navigator.platform || 'Web Platform'}</div>
                            </div>
                            <div class="system-spec-item">
                                <div class="system-spec-label">Язык интерфейса</div>
                                <div class="system-spec-value">${navigator.language || 'ru-RU'}</div>
                            </div>
                            <div class="system-spec-item">
                                <div class="system-spec-label">Разрешение экрана</div>
                                <div class="system-spec-value">${window.screen.width} × ${window.screen.height}</div>
                            </div>
                            <div class="system-spec-item">
                                <div class="system-spec-label">Движок</div>
                                <div class="system-spec-value">Browser Runtime / JavaScript</div>
                            </div>
                        </div>
                    </div>

                    <div class="system-about-card">
                        <div class="system-about-title">Ссылки проекта</div>
                        <div class="system-links">
                            <a class="system-link-btn" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer">
                                <span><img src="./assets/icons/telegram.webp" border="0" height="24px" weight="24px"></span>
                                <span>Telegram-канал</span>
                            </a>
                            <a class="system-link-btn" href="${CONFIG.github}" target="_blank" rel="noopener noreferrer">
                                <span><img src="./assets/icons/github.png" height="24px" weight="24px" border="0"></span>
                                <span>GitHub-репозиторий</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="wallpaper-preview-modal" id="wallpaper-preview-modal">
            <button class="preview-close" id="preview-close">&times;</button>
            <div class="preview-content">
                <img id="preview-image" src="" alt="Preview">
                <div class="preview-actions">
                    <button class="btn btn-secondary" id="preview-cancel">Отмена</button>
                    <button class="btn btn-primary" id="preview-apply">Применить</button>
                </div>
            </div>
        </div>
    `;
}

    function initSettingsApp(win) {
        const navItems = win.querySelectorAll('.settings-nav-item');
        const sections = win.querySelectorAll('.settings-section-content');
        
        navItems.forEach(item => {
            item.onclick = () => {
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                sections.forEach(s => s.classList.add('hidden'));
                win.querySelector(`#settings-${item.dataset.section}`).classList.remove('hidden');
            };
        });
        
        const container = win.querySelector('#wallpaper-categories');
        Object.entries(WALLPAPERS).forEach(([cat, data]) => {
            const div = document.createElement('div');
            div.className = 'collapsible';
            div.innerHTML = `
                <div class="collapsible-header">
                    <span class="collapsible-title">${data.title}</span>
                    <svg class="collapsible-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
                </div>
                <div class="collapsible-content"><div class="collapsible-inner">
                    <div class="wallpaper-grid">
                        ${data.items.map(w => `
                            <div class="wallpaper-item ${state.currentWallpaper === cat+'/'+w.file ? 'selected' : ''}" data-path="${cat}/${w.file}">
                                <img src="${CONFIG.paths.wallpapers}${cat}/${w.file}" alt="${w.name}" loading="lazy">
                                <span class="wallpaper-name">${w.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div></div>
            `;
            div.querySelector('.collapsible-header').onclick = () => div.classList.toggle('open');
            container.appendChild(div);
        });
        
        const modal = win.querySelector('#wallpaper-preview-modal');
        const previewImg = win.querySelector('#preview-image');
        let selectedPath = null;
        
        container.onclick = e => {
            const item = e.target.closest('.wallpaper-item');
            if (item) {
                selectedPath = item.dataset.path;
                previewImg.src = CONFIG.paths.wallpapers + selectedPath;
                modal.classList.add('visible');
            }
        };
        
        const closeModal = () => { modal.classList.remove('visible'); selectedPath = null; };
        win.querySelector('#preview-close').onclick = closeModal;
        win.querySelector('#preview-cancel').onclick = closeModal;
        win.querySelector('#preview-apply').onclick = () => {
            if (selectedPath) {
                elements.wallpaper.style.backgroundImage = `url('${CONFIG.paths.wallpapers}${selectedPath}')`;
                saveWallpaper(selectedPath);
                container.querySelectorAll('.wallpaper-item').forEach(i => i.classList.toggle('selected', i.dataset.path === selectedPath));
                closeModal();
            }
        };
        modal.onclick = e => { if (e.target === modal) closeModal(); };
        
        const usernameInput = win.querySelector('#account-username');
        const passwordInput = win.querySelector('#account-password');
        const confirmInput = win.querySelector('#account-password-confirm');
        const saveBtn = win.querySelector('#account-save');
        const successMsg = win.querySelector('#account-success');
        
        saveBtn.onclick = () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            
            win.querySelector('#account-username-error').textContent = '';
            win.querySelector('#account-password-error').textContent = '';
            successMsg.classList.add('hidden');
            
            if (!username) {
                win.querySelector('#account-username-error').textContent = 'Имя обязательно';
                return;
            }
            
            if (password && !/^[a-zA-Z0-9]+$/.test(password)) {
                win.querySelector('#account-password-error').textContent = 'Только латиница и цифры';
                return;
            }
            
            if (password && password !== confirm) {
                win.querySelector('#account-password-error').textContent = 'Пароли не совпадают';
                return;
            }
            
            state.currentUser.username = username;
            if (password) state.currentUser.password = password;
            localStorage.setItem('chillos_user', JSON.stringify(state.currentUser));
            elements.startUsername.textContent = username;
            
            successMsg.classList.remove('hidden');
            setTimeout(() => successMsg.classList.add('hidden'), 3000);
        };
    }

    // ===== RUBY APP =====
    function openRubyApp() {
        const config = getAppConfig('ruby');
        createWindow('ruby', config);
    }

    function createRubyContent() {
        return `
            <div class="ruby-container">
                <div class="ruby-sidebar">
                    <div class="ruby-nav-item active" data-tab="create">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                        <span>Создать</span>
                    </div>
                    <div class="ruby-nav-item" data-tab="import">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>
                        <span>Импорт</span>
                    </div>
                    <div class="ruby-nav-item" data-tab="manage">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                        <span>Управление</span>
                    </div>
                </div>
                <div class="ruby-main">
                    <div id="ruby-create" class="ruby-tab">
                        <div class="ruby-header"><h2 class="ruby-title">Создать приложение</h2></div>
                        <div class="ruby-content" id="ruby-create-content"></div>
                    </div>
                    <div id="ruby-import" class="ruby-tab hidden">
                        <div class="ruby-header"><h2 class="ruby-title">Импорт приложения</h2></div>
                        <div class="ruby-content" id="ruby-import-content"></div>
                    </div>
                    <div id="ruby-manage" class="ruby-tab hidden">
                        <div class="ruby-header"><h2 class="ruby-title">Управление приложениями</h2></div>
                        <div class="ruby-content" id="ruby-manage-content"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function initRubyApp(win) {
        const navItems = win.querySelectorAll('.ruby-nav-item');
        const tabs = win.querySelectorAll('.ruby-tab');
        
        navItems.forEach(item => {
            item.onclick = () => {
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                tabs.forEach(t => t.classList.add('hidden'));
                win.querySelector(`#ruby-${item.dataset.tab}`).classList.remove('hidden');
            };
        });
        
        initRubyCreate(win);
        initRubyImport(win);
        initRubyManage(win);
    }

    function getExampleCode(appName) {
        const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
        return `// ${appName}
// Пример приложения для ChillOS

function init() {
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:20px;text-align:center;color:white;font-family:Segoe UI,sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);';
    
    const logo = document.createElement('img');
    logo.src = './assets/icons/start.png';
    logo.style.cssText = 'width:100px;height:100px;margin-bottom:20px;';
    container.appendChild(logo);
    
    const title = document.createElement('h1');
    title.textContent = '${appName}';
    title.style.cssText = 'margin:0 0 20px;font-size:28px;';
    container.appendChild(title);
    
    const fact = document.createElement('p');
    fact.textContent = '💡 ${randomFact}';
    fact.style.cssText = 'margin:0 0 30px;padding:15px 20px;background:rgba(255,255,255,0.1);border-radius:10px;max-width:400px;line-height:1.5;';
    container.appendChild(fact);
    
    const button = document.createElement('button');
    button.textContent = '🚀 Нажми меня!';
    button.style.cssText = 'padding:12px 30px;font-size:16px;border:none;border-radius:8px;background:#0078d4;color:white;cursor:pointer;transition:all 0.2s;';
    button.onmouseover = () => button.style.background = '#1a86d9';
    button.onmouseout = () => button.style.background = '#0078d4';
    
    let clickCount = 0;
    button.onclick = () => {
        clickCount++;
        button.textContent = 'Нажато: ' + clickCount + ' раз!';
    };
    container.appendChild(button);
    
    return container;
}

window.appInit = init;`;
    }

    function initRubyCreate(win) {
        const content = win.querySelector('#ruby-create-content');
        let appData = {};
        
        const showStep1 = () => {
            content.innerHTML = `
                <p class="text-muted mb-2">Шаг 1: Информация о приложении</p>
                <div class="form-group">
                    <label>Название приложения</label>
                    <input type="text" id="app-name" value="${appData.name || ''}" placeholder="Моё приложение">
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea id="app-desc" rows="3" placeholder="Краткое описание...">${appData.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Версия</label>
                    <input type="text" id="app-version" value="${appData.version || '1.0.0'}" placeholder="1.0.0">
                </div>
                <div class="form-group">
                    <label>URL иконки (опционально)</label>
                    <input type="text" id="app-icon" value="${appData.icon || ''}" placeholder="https://example.com/icon.png">
                </div>
                <button class="btn btn-primary" id="create-next">Далее</button>
            `;
            
            content.querySelector('#create-next').onclick = () => {
                appData.name = content.querySelector('#app-name').value.trim();
                appData.description = content.querySelector('#app-desc').value.trim();
                appData.version = content.querySelector('#app-version').value.trim() || '1.0.0';
                appData.icon = content.querySelector('#app-icon').value.trim();
                
                if (!appData.name) {
                    alert('Введите название приложения');
                    return;
                }
                
                if (!appData.code) {
                    appData.code = getExampleCode(appData.name);
                }
                
                showStep2();
            };
        };
        
        const showStep2 = () => {
            content.innerHTML = `
                <p class="text-muted mb-2">Шаг 2: Код приложения (rapp.js)</p>
                <div class="editor-toolbar">
                    <button class="btn btn-sm btn-secondary" id="test-app">▶ Тест</button>
                    <button class="btn btn-sm btn-secondary" id="back-step">← Назад</button>
                    <button class="btn btn-sm btn-primary" id="install-app">📦 Установить</button>
                    <button class="btn btn-sm btn-secondary" id="download-app">📥 Скачать ZIP</button>
                </div>
                <div class="code-editor-container" id="code-editor"></div>
            `;
            
            loadMonaco(win.querySelector('#code-editor'), appData.code, code => appData.code = code);
            
            content.querySelector('#back-step').onclick = showStep1;
            content.querySelector('#test-app').onclick = () => testApp(appData);
            content.querySelector('#install-app').onclick = () => installApp(appData, win);
            content.querySelector('#download-app').onclick = () => downloadApp(appData);
        };
        
        showStep1();
    }

    function initRubyImport(win) {
        const content = win.querySelector('#ruby-import-content');
        let aboutFile = null, codeFile = null, aboutData = null, codeText = null;
        
        const render = () => {
            content.innerHTML = `
                <p class="text-muted mb-2">Импортируйте файлы about.json и rapp.js</p>
                
                <div class="file-importer" id="import-about">
                    <div class="file-importer-icon">📄</div>
                    <div class="file-importer-text">about.json</div>
                    <div class="file-importer-hint">Перетащите или нажмите</div>
                    <input type="file" accept=".json">
                </div>
                ${aboutFile ? `<div class="imported-file"><span class="imported-file-icon">✓</span><span class="imported-file-name">${aboutFile.name}</span><span class="imported-file-remove" data-file="about">✕</span></div>` : ''}
                
                <div class="file-importer mt-2" id="import-code">
                    <div class="file-importer-icon">📄</div>
                    <div class="file-importer-text">rapp.js</div>
                    <div class="file-importer-hint">Перетащите или нажмите</div>
                    <input type="file" accept=".js">
                </div>
                ${codeFile ? `<div class="imported-file"><span class="imported-file-icon">✓</span><span class="imported-file-name">${codeFile.name}</span><span class="imported-file-remove" data-file="code">✕</span></div>` : ''}
                
                <button class="btn btn-primary mt-3" id="install-imported-app" ${!aboutFile || !codeFile ? 'disabled' : ''}>Установить</button>
            `;
            
            setupFileImporter(content.querySelector('#import-about'), async file => {
                aboutFile = file;
                try {
                    aboutData = JSON.parse(await file.text());
                } catch (e) {
                    alert('Ошибка парсинга JSON');
                    aboutFile = null;
                }
                render();
            });
            
            setupFileImporter(content.querySelector('#import-code'), async file => {
                codeFile = file;
                codeText = await file.text();
                render();
            });
            
            content.querySelectorAll('.imported-file-remove').forEach(btn => {
                btn.onclick = () => {
                    if (btn.dataset.file === 'about') { aboutFile = null; aboutData = null; }
                    else { codeFile = null; codeText = null; }
                    render();
                };
            });
            
            const installBtn = content.querySelector('#install-imported-app');
            if (installBtn) {
                installBtn.onclick = () => {
                    if (aboutData && codeText) {
                        const app = {
                            id: Date.now().toString(),
                            name: aboutData.name || 'Без названия',
                            description: aboutData.description || '',
                            version: aboutData.version || '1.0.0',
                            icon: aboutData.icon || '',
                            code: codeText
                        };
                        
                        state.customApps.push(app);
                        saveCustomApps();
                        renderDesktopIcons();
                        renderStartMenuApps();
                        
                        alert('Приложение установлено!');
                        aboutFile = null; codeFile = null; aboutData = null; codeText = null;
                        render();
                        initRubyManage(win);
                    }
                };
            }
        };
        
        render();
    }

    function setupFileImporter(el, onFile) {
        const input = el.querySelector('input');
        el.onclick = () => input.click();
        input.onchange = () => { if (input.files[0]) onFile(input.files[0]); };
        el.ondragover = e => { e.preventDefault(); el.classList.add('dragover'); };
        el.ondragleave = () => el.classList.remove('dragover');
        el.ondrop = e => { e.preventDefault(); el.classList.remove('dragover'); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); };
    }

    function initRubyManage(win) {
        const content = win.querySelector('#ruby-manage-content');
        
        if (state.customApps.length === 0) {
            content.innerHTML = '<p class="text-muted">Нет установленных приложений</p>';
            return;
        }
        
        content.innerHTML = `<div class="app-list">${state.customApps.map(app => `
            <div class="app-list-item" data-id="${app.id}">
                <img class="app-list-icon" src="${app.icon || './assets/icons/app.png'}" onerror="this.src='./assets/icons/app.png'">
                <div class="app-list-info">
                    <div class="app-list-name">${app.name}</div>
                    <div class="app-list-version">v${app.version}</div>
                </div>
                <div class="app-list-actions">
                    <button class="btn btn-sm btn-secondary edit-app">Изменить</button>
                    <button class="btn btn-sm btn-danger delete-app">Удалить</button>
                </div>
            </div>
        `).join('')}</div>`;
        
        content.querySelectorAll('.edit-app').forEach(btn => {
            btn.onclick = () => {
                const id = btn.closest('.app-list-item').dataset.id;
                const app = state.customApps.find(a => a.id === id);
                if (app) editAppCode(win, app);
            };
        });
        
        content.querySelectorAll('.delete-app').forEach(btn => {
            btn.onclick = () => {
                const id = btn.closest('.app-list-item').dataset.id;
                if (confirm('Удалить приложение?')) {
                    state.customApps = state.customApps.filter(a => a.id !== id);
                    saveCustomApps();
                    renderDesktopIcons();
                    renderStartMenuApps();
                    initRubyManage(win);
                }
            };
        });
    }

    function editAppCode(win, app) {
        const content = win.querySelector('#ruby-manage-content');
        
        content.innerHTML = `
            <p class="text-muted mb-2">Редактирование: ${app.name}</p>
            <div class="editor-toolbar">
                <button class="btn btn-sm btn-secondary" id="back-manage">← Назад</button>
                <button class="btn btn-sm btn-secondary" id="test-edited">▶ Тест</button>
                <button class="btn btn-sm btn-primary" id="save-code">Сохранить</button>
            </div>
            <div class="code-editor-container" id="edit-code-editor"></div>
        `;
        
        let newCode = app.code;
        loadMonaco(content.querySelector('#edit-code-editor'), app.code, code => newCode = code);
        
        content.querySelector('#back-manage').onclick = () => initRubyManage(win);
        content.querySelector('#test-edited').onclick = () => testApp({ ...app, code: newCode });
        content.querySelector('#save-code').onclick = () => {
            app.code = newCode;
            saveCustomApps();
            alert('Сохранено!');
        };
    }

    function loadMonaco(container, initialCode, onChange) {
        if (typeof require !== 'undefined' && require.config) {
            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
            require(['vs/editor/editor.main'], () => {
                const editor = monaco.editor.create(container, {
                    value: initialCode,
                    language: 'javascript',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on'
                });
                editor.onDidChangeModelContent(() => onChange(editor.getValue()));
            });
        } else {
            container.innerHTML = `<textarea style="width:100%;height:100%;background:#1e1e1e;color:#d4d4d4;border:none;padding:12px;font-family:monospace;font-size:14px;resize:none;">${escapeHtml(initialCode)}</textarea>`;
            container.querySelector('textarea').oninput = e => onChange(e.target.value);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function testApp(appData) {
        elements.testAppContent.innerHTML = '';
        elements.testAppModal.classList.remove('hidden');
        
        try {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width:100%;height:100%;border:none;background:#1a1a2e;';
            iframe.sandbox = 'allow-scripts';
            
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: 'Segoe UI', sans-serif; background: #1a1a2e; }
                    </style>
                </head>
                <body>
                    <div id="app"></div>
                    <script>
                        ${appData.code}
                        if (typeof init === 'function' || typeof window.appInit === 'function') {
                            const initFn = window.appInit || init;
                            const result = initFn();
                            if (result) document.getElementById('app').appendChild(result);
                        }
                    <\/script>
                </body>
                </html>
            `;
            
            iframe.srcdoc = html;
            elements.testAppContent.appendChild(iframe);
        } catch (e) {
            elements.testAppContent.innerHTML = `<div style="color:red;padding:20px;">Ошибка: ${e.message}</div>`;
        }
    }

    function installApp(appData, win) {
        const app = {
            id: Date.now().toString(),
            name: appData.name,
            description: appData.description || '',
            version: appData.version || '1.0.0',
            icon: appData.icon || '',
            code: appData.code
        };
        
        state.customApps.push(app);
        saveCustomApps();
        renderDesktopIcons();
        renderStartMenuApps();
        
        alert(`Приложение "${app.name}" установлено!`);
        initRubyManage(win);
    }

    async function downloadApp(appData) {
        const aboutJson = JSON.stringify({
            name: appData.name,
            description: appData.description,
            version: appData.version,
            icon: appData.icon,
            main: 'rapp.js'
        }, null, 2);

        const { default: JSZip } = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm');
        
        const zip = new JSZip();
        zip.file('about.json', aboutJson);
        zip.file('rapp.js', appData.code);
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${appData.name.replace(/[^a-zA-Z0-9а-яА-Я]/g, '_')}.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function runCustomApp(app) {
        const id = 'window-' + Date.now();
        const template = elements.windowTemplate.content.cloneNode(true);
        const win = template.querySelector('.window');
        
        win.id = id;
        win.style.cssText = 'width:600px;height:450px;left:100px;top:100px;';
        win.querySelector('.window-icon').src = app.icon || './assets/icons/app.png';
        win.querySelector('.window-title-text').textContent = app.name;
        win.querySelector('.window-content').innerHTML = '<div id="custom-app-root" style="width:100%;height:100%;"></div>';
        
        elements.windowsContainer.appendChild(win);
        state.openWindows.push({ id, app: `custom_${app.id}`, element: win });
        
        setupWindowControls(win, id);
        addToTaskbar(id, `custom_${app.id}`, app.icon || './assets/icons/app.png', app.name);
        
        requestAnimationFrame(() => {
            win.classList.add('visible');
            focusWindow(id);
            
            const root = win.querySelector('#custom-app-root');
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width:100%;height:100%;border:none;';
            iframe.sandbox = 'allow-scripts';
            
            iframe.srcdoc = `
                <!DOCTYPE html>
                <html>
                <head><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;}</style></head>
                <body>
                    <div id="app"></div>
                    <script>
                        ${app.code}
                        if (typeof init === 'function' || typeof window.appInit === 'function') {
                            const initFn = window.appInit || init;
                            const result = initFn();
                            if (result) document.getElementById('app').appendChild(result);
                        }
                    <\/script>
                </body>
                </html>
            `;
            
            root.appendChild(iframe);
        });
    }

    // ===== START =====
    document.addEventListener('DOMContentLoaded', init);

})();