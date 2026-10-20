// Sends the site's MailerLite signup forms in the background and shows the
// result in place, so readers stay on our page. Without JavaScript the form
// still posts to MailerLite on its own.
(function () {
  document.querySelectorAll('form.ml-form').forEach(function (form) {
    var msg = form.querySelector('.ml-message');
    var button = form.querySelector('button[type="submit"]');
    // Optional mailing-list box: ticked posts to the list form, unticked to the one-email form.
    var listBox = form.querySelector('.ml-list-opt');
    var oneEmailAction = form.getAttribute('action');
    if (listBox) listBox.addEventListener('change', function () {
      form.setAttribute('action', listBox.checked ? form.dataset.listAction : oneEmailAction);
    });
    function say(text, ok) {
      msg.textContent = text;
      msg.hidden = false;
      msg.classList.toggle('is-error', !ok);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      button.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.success) {
            form.querySelector('.ml-fields').hidden = true;
            button.hidden = true;
            say(form.dataset.success, true);
            msg.setAttribute('tabindex', '-1');
            msg.focus();
            form.dispatchEvent(new CustomEvent('ml-joined', { bubbles: true }));
          } else {
            say(form.dataset.error, false);
            button.disabled = false;
          }
        })
        .catch(function () { say(form.dataset.error, false); button.disabled = false; });
    });
  });
})();
