const NAV_SELECTOR = '.ds-tabs__tab, .drawer__nav a';
const ACTIVE_CLASS = 'ds-tabs__tab--active';
const INACTIVE_CLASS = 'ds-tabs__tab--inactive';

export function initActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll(NAV_SELECTOR).forEach(a => {
    try {
      const link = new URL(a.href);
      const linkPath = link.pathname;
      const isHome = linkPath === '/' || linkPath === '/id/';
      const isBlog = linkPath === '/blog/' || linkPath === '/id/blog/';
      const isActive = isHome
        ? path === linkPath
        : path === linkPath || (isBlog && path.startsWith(linkPath));
      if (a.classList.contains('ds-tabs__tab')) {
        a.classList.toggle(ACTIVE_CLASS, isActive);
        a.classList.toggle(INACTIVE_CLASS, !isActive);
        a.setAttribute('aria-selected', String(isActive));
        a.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      } else {
        a.classList.toggle('is-active', isActive);
      }
    } catch {}
  });
}
