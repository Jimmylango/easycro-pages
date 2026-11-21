/* easycro page loader for Dorik.
   In Dorik's Custom code block:
     <div id="ecdl-root" data-page="15-test-ideas"></div>
     <script src="https://jimmylango.github.io/easycro-pages/loader.js"></script>
   It fetches the latest page from GitHub Pages and runs it. Update the page = push to GitHub; no change in Dorik. */
(function () {
  var BASE = 'https://jimmylango.github.io/easycro-pages/';
  // Dorik wraps custom code in containers with padding (about 20px above and below).
  // Pull the page up and out to the edges of its Dorik section so the background reaches the top.
  function bleed(root) {
    var sec = root.closest('.dorik-section');
    if (!sec) return;
    root.style.marginTop = root.style.marginBottom = '';
    var top = root.getBoundingClientRect().top - sec.getBoundingClientRect().top;
    var bottom = sec.getBoundingClientRect().bottom - root.getBoundingClientRect().bottom;
    if (top > 0 && top < 80) root.style.marginTop = -top + 'px';
    if (bottom > 0 && bottom < 80) root.style.marginBottom = -bottom + 'px';
  }
  var roots = document.querySelectorAll('#ecdl-root, [data-ecdl-page]');
  roots.forEach(function (root) {
    var page = root.getAttribute('data-page') || root.getAttribute('data-ecdl-page');
    if (!page || root.getAttribute('data-loaded')) return;
    root.setAttribute('data-loaded', '1');
    root.style.minHeight = '100vh';
    root.style.background = '#f5f4ef';
    fetch(BASE + page + '.html?v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        root.innerHTML = html;
        root.style.minHeight = '';
        bleed(root);
        // scripts inserted with innerHTML don't run: re-create them in place, strictly in order
        // (external libraries like GSAP must finish loading before the inline code that uses them)
        var list = Array.prototype.slice.call(root.querySelectorAll('script'));
        (function next(i) {
          if (i >= list.length) { document.dispatchEvent(new Event('ecdl:ready')); return; }
          var old = list[i], s = document.createElement('script');
          for (var a = 0; a < old.attributes.length; a++) s.setAttribute(old.attributes[a].name, old.attributes[a].value);
          if (old.src) {
            s.async = false;
            s.onload = s.onerror = function () { next(i + 1); };
            old.parentNode.replaceChild(s, old);
          } else {
            s.textContent = old.textContent;
            old.parentNode.replaceChild(s, old);
            next(i + 1);
          }
        })(0);
      })
      .catch(function () {
        root.innerHTML = '<p style="font:16px/1.5 sans-serif;padding:40px;text-align:center">Something went wrong loading this page. Please refresh, or email jimmy@easycro.com.</p>';
      });
  });
})();
