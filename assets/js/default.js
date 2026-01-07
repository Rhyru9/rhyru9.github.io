/**
 * Main JavaScript for Portfolio Site
 * Handles: Lenis smooth scroll, scroll-to-top, theme switching, bottom nav
 */

let lenis;

/**
 * Initialize Lenis smooth scrolling
 */
function initLenis() {
    const wrapper = document.querySelector('.scroll-wrapper');
    if (!wrapper) return;

    lenis = new Lenis({
        wrapper,
        content: wrapper.querySelector('.container'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    window.lenis = lenis;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { duration: 1.5 });
                }
            }
        });
    });
}

/**
 * Initialize scroll-to-top button
 */
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    const wrapper = document.querySelector('.scroll-wrapper');
    if (!btn || !wrapper) return;

    const threshold = 300;

    function updateVisibility(scroll) {
        btn.classList.toggle('visible', scroll > threshold);
    }

    // Use Lenis scroll event if available, otherwise fallback to native scroll
    if (window.lenis) {
        lenis.on('scroll', e => updateVisibility(e.scroll));
    } else {
        wrapper.addEventListener('scroll', () => updateVisibility(wrapper.scrollTop), { passive: true });
    }

    // Handle click
    btn.addEventListener('click', e => {
        e.preventDefault();
        if (window.lenis) {
            lenis.scrollTo(0, { duration: 1.2 });
        } else {
            wrapper.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/**
 * Set theme (light/dark mode)
 * @param {string} theme - 'light' or 'dark'
 */
function setTheme(theme) {
    const html = document.documentElement;
    const body = document.body;
    
    // Prevent transitions during theme change
    html.classList.add('theme-changing');
    body.classList.add('theme-changing');
    
    // Force reflow
    void html.offsetHeight;
    
    const isDark = theme === 'dark';
    html.classList.toggle('dark-mode', isDark);
    body.classList.toggle('dark-mode', isDark);
    
    // Update background color
    const bgColor = isDark ? '#1b1b1d' : '#e8e8e9';
    html.style.backgroundColor = bgColor;
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.getElementById('theme-color-meta');
    if (metaTheme) {
        metaTheme.setAttribute('content', bgColor);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Re-enable transitions after theme change
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            html.classList.remove('theme-changing');
            body.classList.remove('theme-changing');
        });
    });
}

/**
 * Prevent overscroll bounce on mobile
 */
function preventOverscroll() {
    const wrapper = document.querySelector('.scroll-wrapper');
    if (!wrapper) return;

    let startY = 0;

    wrapper.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
        // Prevent bounce when scrolled to top and trying to scroll up
        if (wrapper.scrollTop === 0 && e.touches[0].clientY > startY) {
            e.preventDefault();
        }
    }, { passive: false });
}

/**
 * Initialize bottom navigation with animated indicator
 */
function initBottomNav() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    const items = nav.querySelectorAll('.nav-item');

    function updateIndicator(item) {
        const itemRect = item.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        nav.style.setProperty('--indicator-position', `${itemRect.left - navRect.left - 8}px`);
        nav.style.setProperty('--indicator-width', `${itemRect.width}px`);
    }

    // Set initial position based on active item
    const activeItem = nav.querySelector('.nav-item.active');
    if (activeItem) {
        updateIndicator(activeItem);
    }

    // Update on hover
    items.forEach(item => {
        item.addEventListener('mouseenter', () => updateIndicator(item));
        item.addEventListener('touchstart', () => updateIndicator(item), { passive: true });
    });

    // Return to active item when mouse leaves nav
    nav.addEventListener('mouseleave', () => {
        const active = nav.querySelector('.nav-item.active');
        if (active) {
            updateIndicator(active);
        }
    });
}

/**
 * Initialize all features on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Initialize features
    initLenis();
    initScrollToTop();
    preventOverscroll();
    initBottomNav();
});

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (lenis) {
        lenis.destroy();
    }
});

// Export functions for global access (e.g., theme switcher)
window.setTheme = setTheme