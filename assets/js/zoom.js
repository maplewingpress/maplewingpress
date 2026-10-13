// Tap-to-enlarge for links marked .zoom: opens the large image in a dialog.
// Without JavaScript the link still opens the image on its own.
(function () {
  var links = document.querySelectorAll('a.zoom');
  if (!links.length || typeof HTMLDialogElement !== 'function') return;
  var dlg = document.createElement('dialog');
  dlg.className = 'zoom-dialog';
  dlg.innerHTML = '<button type="button" class="zoom-close" aria-label="Close">Close ✕</button><img alt=""><p class="zoom-caption"></p>';
  document.body.appendChild(dlg);
  var img = dlg.querySelector('img'), cap = dlg.querySelector('.zoom-caption');
  dlg.querySelector('.zoom-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var thumb = a.querySelector('img');
      img.src = a.href;
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = a.getAttribute('data-caption') || '';
      dlg.showModal();
    });
  });
})();
