// Mobile drawer menu — hamburger toggles open/close.
// Closes on outside click and on nav-link click.

const BURGER_ID = 'js-burger';
const DRAWER_ID = 'js-drawer';
const OPEN_CLASS = 'is-open';

export function initMenu() {
  const burger = document.getElementById(BURGER_ID);
  const drawer = document.getElementById(DRAWER_ID);
  if (!burger || !drawer) return;

  const setOpen = (open) => {
    drawer.classList.toggle(OPEN_CLASS, open);
    burger.classList.toggle(OPEN_CLASS, open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => {
    setOpen(!drawer.classList.contains(OPEN_CLASS));
  });

  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !drawer.contains(e.target)) setOpen(false);
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });
}
