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

    const enableScrollReveal = false;
    if (enableScrollReveal && 'IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -80px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('animate-in');
                    }, index * 50);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.feature-card, .howto-step, .tariff-card, .security-card, .contact-card, .legal-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            observer.observe(el);
        });
    }

    // ---------- SMOOTH PAGE TRANSITIONS (улучшенные) ----------
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    let emojiContainers = [];
    let shapeContainers = [];
    let emojiParticlesLayers = [[], []];
    let shapeParticlesLayers = [[], []];
    let currentPhase = 0;
    const sectionThemes = {
        hero:      { emojis: ['🚀','✨','🤖','⚙️'],          shapes: ['◆','◇','△','◯','✦'] },
        features:  { emojis: ['⚙️','✨','🧩','🔧'],          shapes: ['◆','◯','△','✦','⬣'] },
        howto:     { emojis: ['🧭','🪄','✅','👉'],          shapes: ['◆','◯','▢','✦'] },
        tariffs:   { emojis: ['💳','💰','⭐','🏷️','₽'],      shapes: ['◆','◯','△','✦'] },
        security:  { emojis: ['🔒','🛡️','✅','✨'],          shapes: ['◆','◯','⬣','✦'] },
        contacts:  { emojis: ['💬','📨','📞','✨'],           shapes: ['◆','◯','△','✦'] },
        legal:     { emojis: ['⚖️','📜','✅','✨'],          shapes: ['◆','◯','△','✦'] },
        default:   { emojis: ['✨','⚙️','📨','🔒','🤖'],      shapes: ['◆','◇','△','◯','✦'] }
    };
    function createContainer(cls) {
        const el = document.createElement('div');
        el.className = cls;
        document.body.appendChild(el);
        return el;
    }
    function createParticles(container, count) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            const span = document.createElement('span');
            span.className = 'particle';
            container.appendChild(span);
            arr.push(span);
        }
        return arr;
    }
    function initParticles() {
        if (emojiContainers.length === 0) {
            const a = createContainer('emoji-particles layer-a');
            const b = createContainer('emoji-particles layer-b');
            emojiContainers = [a, b];
            emojiParticlesLayers[0] = createParticles(a, 6);
            emojiParticlesLayers[1] = createParticles(b, 6);
        }
        if (shapeContainers.length === 0) {
            const a = createContainer('shape-particles layer-a');
            const b = createContainer('shape-particles layer-b');
            shapeContainers = [a, b];
            shapeParticlesLayers[0] = createParticles(a, 6);
            shapeParticlesLayers[1] = createParticles(b, 6);
        }
    }
    function positionParticles(particles, items, sizeMin, sizeMax) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const marginX = 12; // проценты — держим вдали от краёв
        const marginY = 14;
        particles.forEach((p, i) => {
            const item = items[i % items.length];
            p.textContent = item;
            const x = marginX + Math.random() * (100 - marginX * 2);
            const y = marginY + Math.random() * (100 - marginY * 2);
            const fs = sizeMin + Math.random() * (sizeMax - sizeMin);
            const delay = Math.random() * 0.5 + (i % 4) * 0.05;
            p.style.left = x + 'vw';
            p.style.top = y + 'vh';
            p.style.fontSize = fs + 'px';
            p.style.transitionDelay = delay + 's';
        });
    }
    function crossfadeToPhase(nextPhase) {
        const prevPhase = currentPhase;
        // Плавно показать новую фазу
        emojiContainers[nextPhase].classList.add('visible');
        shapeContainers[nextPhase].classList.add('visible');
        // Небольшое перекрытие, затем скрываем старую
        clearTimeout(crossfadeToPhase._hideTimer);
        crossfadeToPhase._hideTimer = setTimeout(() => {
            emojiContainers[prevPhase].classList.remove('visible');
            shapeContainers[prevPhase].classList.remove('visible');
        }, 600); // перекрытие ~0.6s
        currentPhase = nextPhase;
    }
    function updateParticlesForSection(sectionId) {
        const theme = sectionThemes[sectionId] || sectionThemes.default;
        const nextPhase = currentPhase ^ 1;
        // Позиционируем невидимую фазу заранее
        positionParticles(emojiParticlesLayers[nextPhase], theme.emojis, 36, 80);
        positionParticles(shapeParticlesLayers[nextPhase], theme.shapes, 64, 140);
        crossfadeToPhase(nextPhase);
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
