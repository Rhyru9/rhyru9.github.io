// ===================================
// PORTFOLIO — MAIN SCRIPT
// ===================================
(function () {
  'use strict';

  // ===================================
  // MOBILE MENU
  // ===================================
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      const open = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===================================
  // ACTIVE NAV
  // ===================================
  function setActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(function (a) {
      try {
        const lp = new URL(a.href).pathname;
        const active = path === lp || (lp !== '/' && path.startsWith(lp));
        a.classList.toggle('active', active);
      } catch (_) {}
    });
  }

  // ===================================
  // SMOOTH SCROLL
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ===================================
  // SEARCH (blog page)
  // ===================================
  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let index = [];
  let timer;

  if (searchInput && searchResults) {
    fetch('/search.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) { index = data; })
      .catch(function () {});

    searchInput.addEventListener('input', function (e) {
      clearTimeout(timer);
      timer = setTimeout(function () { runSearch(e.target.value); }, 250);
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { searchResults.classList.remove('active'); searchInput.blur(); }
    });

    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });
  }

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function hl(text, q) {
    return q ? text.replace(new RegExp('(' + esc(q) + ')', 'gi'), '<mark>$1</mark>') : text;
  }

  function runSearch(q) {
    if (!q || q.length < 2) { searchResults.classList.remove('active'); return; }
    const lq = q.toLowerCase();
    const hits = index.filter(function (item) {
      return item.title.toLowerCase().includes(lq) ||
             (item.content && item.content.toLowerCase().includes(lq)) ||
             (item.tags && item.tags.some(function (t) { return t.toLowerCase().includes(lq); }));
    }).slice(0, 6);

    if (!hits.length) {
      searchResults.innerHTML = '<div class="search-result-item"><span class="res-meta" style="font-style:italic;">No results found</span></div>';
    } else {
      searchResults.innerHTML = hits.map(function (h) {
        return '<a href="' + h.url + '" class="search-result-item">' +
               '<div class="res-title">' + hl(h.title, q) + '</div>' +
               '<div class="res-meta">' + (h.date || '') + (h.tags ? ' &middot; ' + h.tags.join(', ') : '') + '</div>' +
               '</a>';
      }).join('');
    }
    searchResults.classList.add('active');
  }

  // ===================================
  // INIT
  // ===================================
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
  });

})();
