/**
 * Head JavaScript - Page Load Optimization
 * Handles font loading detection and body fade-in
 */

/**
 * Font loading detection
 * Adds 'fonts-loaded' class when web fonts are ready
 */
if (document.fonts) {
    document.fonts.ready.then(function() {
        document.body.classList.add('fonts-loaded');
    });
}

/**
 * Mark page as loaded and fade in body
 */
function markPageLoaded() {
    document.body.classList.add('loaded');
}

/**
 * Handle different load states
 */
if (document.readyState === 'complete') {
    markPageLoaded();
} else {
    window.addEventListener('load', markPageLoaded);
}

/**
 * Fallback: Force show after 300ms to prevent stuck invisible page
 */
setTimeout(function() {
    if (!document.body.classList.contains('loaded')) {
        document.body.classList.add('loaded');
    }
}, 300);