// Client-side blog search — fetches /search.json and filters by title/content/tags.
// Activates only when #search-input and #search-results are both present on the page.

const INPUT_ID = 'search-input';
const RESULTS_ID = 'search-results';
const ACTIVE_CLASS = 'is-active';
const DEBOUNCE_MS = 250;
const MAX_HITS = 6;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text, query) {
  if (!query) return text;
  return text.replace(new RegExp(`(${escapeRegex(query)})`, 'gi'), '<mark>$1</mark>');
}

function renderHits(hits, query, noResultsLabel) {
  if (!hits.length) {
    return `<div class="search-result-item"><span class="res-meta">${noResultsLabel}</span></div>`;
  }
  return hits.map(h => `
    <a href="${h.url}" class="search-result-item">
      <div class="res-title">${highlight(h.title, query)}</div>
      <div class="res-meta">${h.date || ''}${h.tags ? ` · ${h.tags.join(', ')}` : ''}</div>
    </a>
  `).join('');
}

export function initSearch() {
  const input = document.getElementById(INPUT_ID);
  const results = document.getElementById(RESULTS_ID);
  if (!input || !results) return;

  const noResultsLabel = input.dataset.noResults || 'No results found';
  const lang = input.dataset.lang || 'en';
  let index = [];
  let timer;

  fetch('/search.json')
    .then(r => (r.ok ? r.json() : []))
    .then(data => { index = data; })
    .catch(() => { /* ignore */ });

  const run = (q) => {
    if (!q || q.length < 2) {
      results.classList.remove(ACTIVE_CLASS);
      return;
    }
    const lq = q.toLowerCase();
    const hits = index.filter(item =>
      (!item.lang || item.lang === lang) && (
      item.title.toLowerCase().includes(lq) ||
      (item.content && item.content.toLowerCase().includes(lq)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(lq)))
      )
    ).slice(0, MAX_HITS);
    results.innerHTML = renderHits(hits, q, noResultsLabel);
    results.classList.add(ACTIVE_CLASS);
  };

  input.addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => run(e.target.value), DEBOUNCE_MS);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      results.classList.remove(ACTIVE_CLASS);
      input.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove(ACTIVE_CLASS);
    }
  });
}
