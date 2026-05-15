// Entry point. Wires each module to its DOM target.
// Modules are intentionally tiny and side-effect free until init() is called.

import { initTheme }        from './modules/theme.js';
import { initMenu }         from './modules/menu.js';
import { initActiveNav }    from './modules/nav.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initSearch }       from './modules/search.js';

function boot() {
  initActiveNav();
  initTheme();
  initMenu();
  initSmoothScroll();
  initSearch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
