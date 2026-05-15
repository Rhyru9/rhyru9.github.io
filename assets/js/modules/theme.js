// Theme switcher.
// Persists choice to localStorage, applies on every page load, syncs swatch UI.

const THEMES = ['light', 'dark', 'gruvbox-light', 'gruvbox-dim', 'gruvbox-dark'];
const STORAGE_KEY = 'theme';
const SWATCH_SELECTOR = '.theme-switcher__swatch';

function read() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function write(theme) {
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
}

function apply(theme) {
  const next = THEMES.includes(theme) ? theme : 'light';
  document.documentElement.setAttribute('data-theme', next);
  write(next);
  document.querySelectorAll(SWATCH_SELECTOR).forEach(el => {
    const active = el.dataset.theme === next;
    el.classList.toggle('is-active', active);
    el.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

export function initTheme() {
  document.querySelectorAll(SWATCH_SELECTOR).forEach(el => {
    el.addEventListener('click', () => apply(el.dataset.theme));
  });
  apply(read() || 'light');
  // Enable smooth transitions only after first paint to avoid FOUC flash.
  requestAnimationFrame(() => document.body.classList.add('theme-ready'));
}
