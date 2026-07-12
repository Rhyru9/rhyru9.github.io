function initPaginationList(id) {
  var container = document.getElementById(id);
  if (!container) return;

  var prefix = id.replace("-pagination", "");
  var items = document.querySelectorAll("." + prefix + "-page-item");
  var totalPages = parseInt(container.dataset.total, 10);
  var prevBtn = container.querySelector(".pagination__prev");
  var nextBtn = container.querySelector(".pagination__next");
  var pageBtns = container.querySelectorAll(".pagination__page");
  var current = 1;

  function show(page) {
    current = page;
    items.forEach(function (el) {
      el.style.display = parseInt(el.dataset.page, 10) === page ? "" : "none";
    });
    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= totalPages;
    pageBtns.forEach(function (btn) {
      var p = parseInt(btn.dataset.page, 10);
      btn.classList.toggle("is-active", p === page);
      btn.setAttribute("aria-current", p === page ? "page" : "false");
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { if (current > 1) show(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { if (current < totalPages) show(current + 1); });
  pageBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { show(parseInt(btn.dataset.page, 10)); });
  });

  show(1);
}

export function initPagination() {
  initPaginationList("awards-pagination");
  initPaginationList("posts-pagination");
}
