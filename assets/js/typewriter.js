(function () {
  const logo = document.querySelector('.site-wordmark');
  const textEl = document.getElementById('logo-text');
  if (!logo || !textEl) return;

  const fullText = logo.dataset.text || '';

  // Respect prefers-reduced-motion — show text immediately, no animation
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    textEl.textContent = fullText;
    return;
  }

  const speed = 180; // ms per character
  const pause = 2000; // pause after full text (ms)
  let i = 0;
  let timer = null;

  function type() {
    if (i < fullText.length) {
      textEl.textContent += fullText.charAt(i);
      i++;
      timer = setTimeout(type, speed);
    } else {
      // Loop: reset after pause
      timer = setTimeout(function () {
        textEl.textContent = '';
        i = 0;
        type();
      }, pause);
    }
  }

  // Pause animation when tab is not visible, resume when it comes back
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(timer);
      timer = null;
    } else {
      type();
    }
  });

  type();
})();
