// Purchase check on the printable-pages pages. Sends the order number (and an
// optional receipt photo) to Tracy's Google Apps Script (docs/purchase-check/),
// then shows the download link it sends back, or a friendly message.
(function () {
  var form = document.querySelector('form.purchase-check');
  if (!form) return;
  var result = form.querySelector('.pc-result');
  var fields = form.querySelector('.pc-fields');
  var button = form.querySelector('button[type="submit"]');
  var help = form.querySelector('.pc-help');
  var number = form.querySelector('#pc-number');
  var photo = form.querySelector('#pc-photo');
  var support = 'support@maplewingpress.com';

  var MESSAGES = {
    used: 'This receipt has already been used three times. If you need to download your pages again, please email ' + support + ' and we will help.',
    amazon_format: 'That doesn\'t look like an Amazon order number. It has 17 numbers, like 123-1234567-1234567. You can find it in your Amazon account under Your Orders.',
    need_details: 'Please type your receipt number, or add a photo of your receipt.',
    need_gift: 'Please type the number on your gift receipt, or add a photo of it. No gift receipt? Email ' + support + ' and we will send your pages.',
    error: 'Something went wrong on our side. Please try again in a minute, or email ' + support + ' and we will send your pages.'
  };

  function source() { return form.querySelector('input[name="source"]:checked').value; }

  function showFor(s) {
    help.textContent = help.dataset[s];
    form.querySelectorAll('.pc-store-only').forEach(function (el) { el.hidden = s !== 'store'; });
    form.querySelectorAll('.pc-photo-field').forEach(function (el) { el.hidden = s === 'amazon'; });
  }
  form.querySelectorAll('input[name="source"]').forEach(function (r) {
    r.addEventListener('change', function () { showFor(source()); });
  });

  function show(nodes, ok, quiet) {
    result.innerHTML = '';
    nodes.forEach(function (n) { result.appendChild(n); });
    result.classList.toggle('is-error', !ok);
    result.hidden = false;
    if (!quiet) result.focus();
  }
  function para(text, cls) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    return p;
  }
  function link(href, text, cls) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    if (cls) a.className = cls;
    return a;
  }

  // Shrinks a phone photo to about 1600px so it uploads quickly.
  function readPhoto(file) {
    return new Promise(function (resolve) {
      if (!file) return resolve('');
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var scale = Math.min(1, 1600 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(''); };
      img.src = url;
    });
  }

  // Remembers a passed check on this phone or computer, so a reader who comes
  // back to this page (or its bookmark) gets the download without checking again.
  var saveKey = 'maplewing-pages-' + form.dataset.book + '-' + form.dataset.level;
  function remember(data) {
    try { localStorage.setItem(saveKey, JSON.stringify({ link: data.link, family: data.family, facility: data.facility })); } catch (e) {}
  }
  function remembered() {
    try { var d = JSON.parse(localStorage.getItem(saveKey)); return d && d.link ? d : null; } catch (e) { return null; }
  }

  function success(data, quiet) {
    var nodes = [para('Thank you! Here are your printable pages.', 'pc-ok')];
    var p = document.createElement('p');
    p.appendChild(link(data.link, 'Download my printable pages', 'button'));
    nodes.push(p);
    nodes.push(para('Bookmark this page or add it to your home screen. When you come back on this phone or computer, your download will be right here, with no need to check your receipt again.', 'pc-bookmark'));
    nodes.push(para('Print one side only, on plain or heavier paper. These pages are for your household, or private caregiving for up to four people. Please don\'t share the link or post the files online.', 'small'));
    if (data.family || data.facility) {
      var h = document.createElement('h2');
      h.textContent = 'Because you own this book';
      nodes.push(h);
      var ul = document.createElement('ul');
      [[data.family, form.dataset.familyText], [data.facility, form.dataset.facilityText]].forEach(function (o) {
        if (!o[0]) return;
        var li = document.createElement('li');
        li.appendChild(link(o[0], o[1]));
        ul.appendChild(li);
      });
      nodes.push(ul);
    }
    fields.hidden = true;
    remember(data);
    show(nodes, true, quiet);
  }

  var saved = remembered();
  if (saved) success(saved, true);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = source();
    var typed = number.value.trim();
    var file = s !== 'amazon' && photo.files[0];
    if (s === 'amazon' && !typed) return show([para('Please type your Amazon order number.')], false);
    if (s === 'store' && !typed && !file) return show([para(MESSAGES.need_details)], false);
    if (s === 'gift' && !typed && !file) return show([para(MESSAGES.need_gift)], false);
    button.disabled = true;
    button.textContent = 'Checking…';
    readPhoto(file).then(function (dataUrl) {
      var body = {
        book: form.dataset.book,
        level: form.dataset.level,
        source: s,
        number: typed,
        store: s === 'store' ? form.querySelector('#pc-store-name').value.trim() : '',
        photo: dataUrl
      };
      // Plain text body: Google Apps Script accepts it without a CORS preflight.
      return fetch(form.action, { method: 'POST', body: JSON.stringify(body) });
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.ok && data.link) return success(data);
        show([para(MESSAGES[data && data.reason] || MESSAGES.error)], false);
      })
      .catch(function () { show([para(MESSAGES.error)], false); })
      .then(function () { button.disabled = false; button.textContent = 'Check my purchase'; });
  });
})();
