/* easycro page loader for Dorik.
   In Dorik's Custom code block:
     <div id="ecdl-root" data-page="15-test-ideas"></div>
     <script src="https://jimmylango.github.io/easycro-pages/loader.js"></script>
   It fetches the latest page from GitHub Pages and runs it. Update the page = push to GitHub; no change in Dorik. */
(function () {
  var BASE = 'https://jimmylango.github.io/easycro-pages/';
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
        // scripts inserted with innerHTML don't run: re-create them in place, in order
        root.querySelectorAll('script').forEach(function (old) {
          var s = document.createElement('script');
          for (var i = 0; i < old.attributes.length; i++) s.setAttribute(old.attributes[i].name, old.attributes[i].value);
          s.textContent = old.textContent;
          old.parentNode.replaceChild(s, old);
        });
        root.style.minHeight = '';
      })
      .catch(function () {
        root.innerHTML = '<p style="font:16px/1.5 sans-serif;padding:40px;text-align:center">Something went wrong loading this page. Please refresh, or email jimmy@easycro.com.</p>';
      });
  });
})();
