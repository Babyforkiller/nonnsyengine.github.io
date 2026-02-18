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

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') || 'dark';
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ---------- NAVIGATION ----------
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        if (!navLinks || !burger) return;
        navLinks.classList.add('active');
        burger.classList.add('active');
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

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

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

    // ---------- SCROLL ANIMATIONS (улучшенные) ----------
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Задержка для последовательного появления
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animate-in');
                }, index * 50); // Небольшая задержка для эффекта каскада
            }
        });
    }, observerOptions);

    // Observe all cards and sections с улучшенными анимациями
    document.querySelectorAll('.feature-card, .howto-step, .tariff-card, .security-card, .contact-card, .legal-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // ---------- SMOOTH PAGE TRANSITIONS (улучшенные) ----------
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    const updateActiveSection = () => {
        const scrollPosition = window.pageYOffset + 150; // Увеличенный offset для лучшего определения

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    
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

    // Throttled scroll для производительности
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateActiveSection);
    }, { passive: true });
    
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
    // Debounce для scroll events
    let scrollTimeout;
    const handleScroll = () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
            updateActiveSection();
            // Обновление тени навбара
            if (window.pageYOffset > 100) {
                if (navbar) navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                if (navbar) navbar.style.boxShadow = 'none';
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
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
