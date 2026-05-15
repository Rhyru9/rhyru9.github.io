// Mark the currently active nav link based on window.location.pathname.
// Applies to both the desktop sidebar nav and the mobile drawer.

const NAV_SELECTOR = '.sidebar__nav a, .drawer__nav a';
const ACTIVE_CLASS = 'is-active';

export function initActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll(NAV_SELECTOR).forEach(a => {
    try {
      const linkPath = new URL(a.href).pathname;
      const isActive = path === linkPath || (linkPath !== '/' && path.startsWith(linkPath));
      a.classList.toggle(ACTIVE_CLASS, isActive);
    } catch { /* ignore malformed urls */ }
  });
}
