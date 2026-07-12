// Entry point. Wires each module to its DOM target.

import { initMenu } from "./modules/menu.js";
import { initActiveNav } from "./modules/nav.js";
import { initSmoothScroll } from "./modules/scroll.js";
import { initSearch } from "./modules/search.js";
import { initPagination } from "./modules/pagination.js";

function boot() {
  initActiveNav();
  initMenu();
  initSmoothScroll();
  initSearch();
  initPagination();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
