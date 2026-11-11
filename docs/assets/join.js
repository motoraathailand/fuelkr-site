// 주유소를부탁해 /join — language, 3 progress ticks (remembered on this phone), share, reset, in-app-browser hint. No network calls, no tracking.
(function () {
  'use strict';
  var I = window.JS_ || {}, C = window.JCFG || {}, LANGS = ['ko', 'en', 'th', 'zh', 'hi'], KEY = 'fkr.join.steps', LKEY = 'fkr.site.lang';
  var M = window.Motion, lang = window.__L || 'en';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var done = { 1: false, 2: false, 3: false };
  try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); [1, 2, 3].forEach(function (n) { done[n] = !!s[n]; }); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }
  function t(k) { return (I[lang] && I[lang][k] != null) ? I[lang][k] : ((I.en || {})[k] || ''); }
  function count() { return [1, 2, 3].filter(function (n) { return done[n]; }).length; }
  function paint() {
    $$('[data-t]').forEach(function (e) { var v = t(e.getAttribute('data-t')); if (e.textContent !== v) e.textContent = v; });
    $$('[data-alt]').forEach(function (e) { e.setAttribute('alt', t(e.getAttribute('data-alt'))); });
    $$('[data-alt-label]').forEach(function (e) { e.setAttribute('aria-label', t(e.getAttribute('data-alt-label'))); });
    $$('[data-lnk]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').split('?')[0] + '?lang=' + lang); });
    $('#iabOpen').textContent = t('iabOpen');
    document.title = t('title'); var d = $('meta[name=description]'); if (d) d.setAttribute('content', t('desc'));
    document.documentElement.lang = lang; $('#lang').value = lang; state();
  }
  function state() {
    var n = count();
    $$('.card').forEach(function (c) {
      var k = +c.getAttribute('data-step'); c.classList.toggle('done', done[k]);
      var b = $('.num', c); b.setAttribute('aria-pressed', done[k] ? 'true' : 'false'); b.setAttribute('aria-label', t('step').replace('{n}', k) + ' — ' + t(done[k] ? 'doneLab' : 'todoLab') + ' · ' + t('tick'));
    });
    $('#progTxt').textContent = t('prog').replace('{n}', n);
    $('#barFill').style.transform = 'scaleX(' + (n / 3) + ')';
    $('#all').hidden = n < 3;
  }
  function mark(k, v) { var was = done[k]; done[k] = v; save(); state(); if (v && !was && M) M.pop($('#c' + k + ' .num')); }
  $('#lang').addEventListener('change', function () { if (LANGS.indexOf(this.value) < 0) return; lang = this.value; try { localStorage.setItem(LKEY, lang); } catch (e) {} paint(); if (M) M.langFade($('main')); });
  $$('.num').forEach(function (b) { b.addEventListener('click', function () { var k = +b.getAttribute('data-chk'); mark(k, !done[k]); }); });
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var c = a.closest('.card');
      if (c && c.hasAttribute('data-locked')) { e.preventDefault(); var p = $('#pend'); if (p) { p.classList.remove('nudge'); void p.offsetWidth; p.classList.add('nudge'); if (M) M.scrollTo(p, 'center'); } return; }
      setTimeout(function () { mark(+a.getAttribute('data-go'), true); }, 600);
    });
  });
  $('#reset').addEventListener('click', function () { done = { 1: false, 2: false, 3: false }; save(); state(); if (M) M.scrollTo($('#steps'), 'start'); });
  var url = location.origin + location.pathname.replace(/[^/]*$/, '') + 'join.html', note = $('#shareNote');
  function say(k) { note.textContent = t(k); clearTimeout(say._t); say._t = setTimeout(function () { note.textContent = ''; }, 3500); }
  $('#share').addEventListener('click', function () {
    var data = { title: t('shareTitle'), text: t('shareText'), url: url };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { say('copied'); }, function () { say('copyFail'); });
    else say('copyFail');
  });
  var ua = navigator.userAgent || '', iab = $('#iab');
  if (iab && /Android/i.test(ua) && /FBAN|FBAV|FB_IAB|Instagram|\bLine\/|KAKAOTALK|NAVER\(inapp|MessengerLite|; wv\)/i.test(ua)) {
    var pageUrl = location.href.split('#')[0]; iab.hidden = false;
    $('#iabOpen').setAttribute('href', 'intent://' + pageUrl.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(pageUrl) + ';end');
    $('#iabCopy').addEventListener('click', function () { var n = $('#iabNote'), ok = function () { n.textContent = t('iabOk'); }, bad = function () { n.textContent = t('copyFail'); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pageUrl).then(ok, bad); else bad(); });
  }
  paint();
  document.documentElement.classList.remove('pl');
})();
