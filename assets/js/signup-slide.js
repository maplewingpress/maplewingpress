// Gentle mailing-list box that slides in from the side once a visitor has
// read part of the page. Shown at most once every 30 days, and never again
// after someone closes it or joins the list.
(function () {
  var box = document.getElementById('signup-slide');
  if (!box) return;
  var KEY = 'mw-signup-slide', DAYS = 30;
  function get() { try { return Number(localStorage.getItem(KEY)) || 0; } catch (e) { return 0; } }
  function set(v) { try { localStorage.setItem(KEY, String(v)); } catch (e) {} }
  var last = get();
  if (last === -1 || (last && Date.now() - last < DAYS * 864e5)) return;

  function show() {
    window.removeEventListener('scroll', onScroll);
    clearTimeout(timer);
    box.hidden = false;
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    set(Date.now());
  }
  function hide() {
    box.classList.remove('is-open');
    setTimeout(function () { box.hidden = true; }, 400);
  }
  function onScroll() {
    var h = document.documentElement;
    if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.4) show();
  }
  var timer = setTimeout(show, 30000);
  window.addEventListener('scroll', onScroll, { passive: true });
  box.querySelector('.signup-slide-close').addEventListener('click', function () { hide(); set(Date.now()); });
  box.addEventListener('ml-joined', function () { set(-1); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) hide(); });
})();
