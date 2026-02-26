// ============================================================
// NONNSY ENGINE — Main JavaScript
// Smooth animations and interactivity
// ============================================================

(function() {
    'use strict';

    // ---------- THEME TOGGLE (default: dark) ----------
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    const applyTheme = (theme) => {
        const next = theme === 'light' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (_) {}
    };

    // init theme
    try {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') {
            applyTheme(saved);
        } else if (!root.getAttribute('data-theme')) {
            applyTheme('dark');
        }
    } catch (_) {
        if (!root.getAttribute('data-theme')) applyTheme('dark');
    }

    // Обработчик темы с проверкой на существование элемента
    const initThemeToggle = () => {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            // Удаляем старые обработчики если есть
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            newToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const current = root.getAttribute('data-theme') || 'dark';
                const nextTheme = current === 'dark' ? 'light' : 'dark';
                applyTheme(nextTheme);
                console.log('Theme switched to:', nextTheme);
            });
        }
    };
    
    // Инициализируем сразу и после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
    
    // Также пробуем инициализировать через небольшой таймаут (на случай если элемент появится позже)
    setTimeout(initThemeToggle, 100);

    // ---------- NAVIGATION ----------
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        if (!navLinks || !burger) return;
        navLinks.classList.add('active');
        burger.classList.add('active');
        document.body.classList.add('menu-open');
        if (navOverlay) {
            navOverlay.classList.add('active');
            navOverlay.setAttribute('aria-hidden', 'false');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!navLinks || !burger) return;
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        document.body.classList.remove('menu-open');
        if (navOverlay) {
            navOverlay.classList.remove('active');
            navOverlay.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    }

    // Mobile menu: бургер открывает/закрывает выдвижную панель
    if (burger && navLinks) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Закрытие по клику на оверлей
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }

        // Закрытие по клику на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Smooth scroll for anchor links с улучшенной плавностью
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#hero') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const offsetTop = target.offsetTop - navbarHeight;
                
                // Плавный скролл с easing
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Обновляем активную ссылку сразу
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === href) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    const enableScrollReveal = true;
    if (enableScrollReveal && 'IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add a small delay based on index/order if possible, or just let CSS handle it
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.feature-card, .howto-step, .tariff-card, .security-card, .contact-card, .legal-card, .hero-content > *').forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
    }

    // ---------- SMOOTH PAGE TRANSITIONS (улучшенные) ----------
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    let emojiContainers = [];
    let currentPhase = 0;
    
    // Тематические эмодзи для каждой секции
    const sectionThemes = {
        hero:      ['🚀','✨','🤖','🔥'],
        features:  ['⚙️','💎','🧩','🔧'],
        howto:     ['🧭','💡','✅','👉'],
        tariffs:   ['💳','💰','⭐','💎'],
        security:  ['🔒','🛡️','👁️‍🗨️','✨'],
        contacts:  ['💬','📨','✈️','🤝'],
        legal:     ['⚖️','📜','✒️','🏛️'],
        default:   ['✨','🤖','�','�']
    };

    function createContainer(cls) {
        const el = document.createElement('div');
        el.className = cls;
        document.body.appendChild(el);
        return el;
    }

    function createParticle(container, char) {
        const span = document.createElement('span');
        span.className = 'particle';
        span.textContent = char;
        
        // Random positioning and sizing
        const size = 20 + Math.random() * 40; // 20-60px
        const x = Math.random() * 90 + 5; // 5-95%
        const y = Math.random() * 90 + 5; // 5-95%
        const duration = 3 + Math.random() * 4; // 3-7s float duration
        const delay = Math.random() * 2;
        
        span.style.left = `${x}%`;
        span.style.top = `${y}%`;
        span.style.fontSize = `${size}px`;
        span.style.animationDuration = `${duration}s`;
        span.style.animationDelay = `${delay}s`;
        
        container.appendChild(span);
        return span;
    }

    function initParticles() {
        // Create two layers for crossfading
        if (emojiContainers.length === 0) {
            const a = createContainer('emoji-particles layer-a');
            const b = createContainer('emoji-particles layer-b');
            emojiContainers = [a, b];
        }
    }

    function updateParticlesForSection(sectionId) {
        const emojis = sectionThemes[sectionId] || sectionThemes.default;
        const nextPhase = currentPhase ^ 1;
        const activeContainer = emojiContainers[nextPhase];
        const inactiveContainer = emojiContainers[currentPhase];

        // Clear next container
        activeContainer.innerHTML = '';
        
        // Populate next container with new emojis
        const count = window.innerWidth < 768 ? 6 : 12; // Fewer on mobile
        for (let i = 0; i < count; i++) {
            createParticle(activeContainer, emojis[i % emojis.length]);
        }

        // Fade in next, fade out current
        activeContainer.classList.add('visible');
        inactiveContainer.classList.remove('visible');

        currentPhase = nextPhase;
    }

    initParticles();

    const updateActiveSection = () => {
        const scrollPosition = window.pageYOffset + 150; // Увеличенный offset для лучшего определения

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    updateParticlesForSection(currentSection);
                    
                    // Плавное обновление активной ссылки
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    };
    
    updateActiveSection();

    // ---------- BUTTON HOVER EFFECTS (улучшенные) ----------
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });

    // ---------- CARD HOVER EFFECTS ----------
    document.querySelectorAll('.feature-card, .tariff-card, .security-card, .contact-card, .legal-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // ---------- FORM VALIDATION (if needed in future) ----------
    const validateForm = (form) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#DC2626';
            } else {
                input.style.borderColor = '';
            }
        });

        return isValid;
    };

    // ---------- LAZY LOADING IMAGES (if needed) ----------
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ---------- PERFORMANCE OPTIMIZATION (улучшенная) ----------
    // RAF-throttle для scroll events
    let scrollRafId;

    const updateNavbarShadow = () => {
        if (!navbar) return;
        if (window.pageYOffset > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    };

    const handleScroll = () => {
        if (scrollRafId) {
            cancelAnimationFrame(scrollRafId);
        }
        scrollRafId = requestAnimationFrame(() => {
            updateActiveSection();
            updateNavbarShadow();
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Инициализация при загрузке
    updateNavbarShadow();
    
    // Предзагрузка критических ресурсов
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Предзагрузка изображений при простое
            document.querySelectorAll('img[data-src]').forEach(img => {
                if (img.dataset.src) {
                    const imageLoader = new Image();
                    imageLoader.src = img.dataset.src;
                }
            });
        });
    }

    // ---------- CONSOLE MESSAGE ----------
    console.log('%cNONNSY ENGINE', 'color: #DC2626; font-size: 24px; font-weight: bold;');
    console.log('%cДобро пожаловать!', 'color: #666; font-size: 14px;');
    console.log('%cЕсли вы видите это сообщение, значит сайт работает корректно.', 'color: #999; font-size: 12px;');

})();
