(function () {
  const logo = document.querySelector('.site-wordmark');
  const textEl = document.getElementById('logo-text');
  if (!logo || !textEl) return;

  const fullText = logo.dataset.text || '';
  const speed = 180; // ms per karakter
  const pause = 2000; // jeda setelah selesai (ms)
  let i = 0;

  function type() {
    if (i < fullText.length) {
      textEl.textContent += fullText.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Loop: reset setelah jeda
      setTimeout(function () {
        textEl.textContent = '';
        i = 0;
        type();
      }, pause);
    }
  }

  type();
})();
