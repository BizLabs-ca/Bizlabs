/* BizLabs site JS: mobile nav, scroll reveal, contact form */
(function(){
  "use strict";

  /* mobile menu */
  var head = document.querySelector('.site-head');
  var burger = document.querySelector('.hamburger');
  if (burger && head) {
    burger.addEventListener('click', function(){
      var open = head.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    head.querySelectorAll('nav a').forEach(function(a){
      a.addEventListener('click', function(){ head.classList.remove('open'); });
    });
  }

  /* scroll reveal */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: .12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* contact form -> automation flow */
  var AUTOREPLY = "Thanks for reaching out to BizLabs — we've got your message.\n\n" +
    "A human reads every inquiry within one business day. Next you'll get our honest take on whether your busywork is automatable, and what it would take.\n\n" +
    "— The BizLabs team · bizlabs.ca";

  var form = document.getElementById('contact-form');
  if (!form) return;
  var errBox = document.getElementById('form-error');

  function showError(msg){
    if (!errBox) return;
    errBox.textContent = msg;
    errBox.classList.add('show');
    errBox.scrollIntoView({behavior:'smooth', block:'center'});
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    if (errBox) errBox.classList.remove('show');
    var els = form.elements;
    if (els._honey && els._honey.value) return; /* bot */

    var name = (els.name.value || '').trim();
    var email = (els.email.value || '').trim();
    var company = (els.company.value || '').trim();
    var pain = els.pain ? els.pain.value : '';
    var message = (els.message.value || '').trim();

    if (!name || !/.+@.+\..+/.test(email) || !message) {
      showError('Please fill in your name, a valid email, and a few words about what eats your week.');
      return;
    }

    var btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Routing…';

    fetch('https://formsubmit.co/ajax/kelsey@bizlabs.ca', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        name: name, email: email, company: company,
        'busywork-level': pain, message: message,
        _subject: 'New BizLabs inquiry from ' + name,
        _template: 'table',
        _autoresponse: AUTOREPLY
      })
    }).then(function(res){ return res.json(); }).then(function(data){
      if (data && (data.success === true || data.success === 'true')) {
        form.hidden = true;
        var ok = document.getElementById('form-success');
        if (ok) { ok.hidden = false; ok.scrollIntoView({behavior:'smooth', block:'center'}); }
      } else {
        throw new Error((data && data.message) || 'send failed');
      }
    }).catch(function(){
      showError("Hmm — that didn't send. Email us directly at kelsey@bizlabs.ca and we'll take it from there.");
      btn.disabled = false;
      btn.textContent = 'Send it →';
    });
  });
})();
