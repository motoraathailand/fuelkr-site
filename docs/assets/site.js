// 주유소를부탁해 intro — language (saved only when picked), store badge/screenshot per language, top progress, bottom bar, back to top. No network calls, no tracking.
(function () {
  'use strict';
  var S = window.LS || {}, LANGS = ['ko', 'en', 'th', 'zh', 'hi'], LKEY = 'fkr.site.lang', M = window.Motion;
  var lang = window.__L || 'en';
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function t(k) { return (S[lang] && S[lang][k] != null) ? S[lang][k] : ((S.en || {})[k] || ''); }
  function paint() {
    $$('[data-t]').forEach(function (e) { var v = t(e.getAttribute('data-t')); if (e.textContent !== v) e.textContent = v; });
    $$('[data-alt]').forEach(function (e) { e.setAttribute('alt', t(e.getAttribute('data-alt'))); });
    $$('[data-alt-label]').forEach(function (e) { e.setAttribute('aria-label', t(e.getAttribute('data-alt-label'))); });
    $$('img[data-badge=gp]').forEach(function (i) { i.src = 'img/badges/gp-' + lang + '.png'; });
    $$('img[data-badge=as]').forEach(function (i) { i.src = 'img/badges/as-' + (lang === 'hi' ? 'en' : lang) + '.svg'; });
    $$('img[data-shot]').forEach(function (i) { i.src = 'img/shots/' + lang + '-' + i.getAttribute('data-shot') + '.webp'; });
    $$('[data-gp]').forEach(function (a) { a.setAttribute('href', 'join.html?lang=' + lang); });
    $$('[data-lnk]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').split('?')[0] + '?lang=' + lang); });
    document.title = t('title');
    var d = $('meta[name=description]'); if (d) d.setAttribute('content', t('desc'));
    document.documentElement.lang = lang; $('#lang').value = lang;
  }
  $('#lang').addEventListener('change', function () {
    if (LANGS.indexOf(this.value) < 0) return; lang = this.value;
    try { localStorage.setItem(LKEY, lang); } catch (e) {}
    paint(); if (M) M.langFade($('main'));
  });
  var bar = $('#stick'), prog = $('#progress'), top = $('#totop'), ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0, h = document.documentElement.scrollHeight - innerHeight;
    var on = y > 420; bar.classList.toggle('show', on); bar.setAttribute('aria-hidden', on ? 'false' : 'true');
    $$('#stick a, #stick button').forEach(function (e) { e.tabIndex = on ? 0 : -1; });
    document.body.style.setProperty('--bar', on ? (bar.offsetHeight + 'px') : '0px');
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  top.addEventListener('click', function () { var r = M && M.reduced && M.reduced(); window.scrollTo({ top: 0, behavior: r ? 'auto' : 'smooth' }); });
  paint(); onScroll();
  document.documentElement.classList.remove('pl');
})();
