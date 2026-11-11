/* 주유소를부탁해 intro page script — adapted from the nammanthuk-site landing.js (owner 2026-11-11: same theme as nammanthuk).
   Language crossfade, hero entrance, scroll reveal, counters, tilting phone, screenshot carousel, ripple, scroll progress, bottom bar.
   prefers-reduced-motion: no animation, no autoplay. */
(function () {
  'use strict';
  var LS = window.LS || {}, doc = document, root = doc.documentElement;
  var rmq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false }, reduce = rmq.matches;
  if (rmq.addEventListener) rmq.addEventListener('change', function (e) { reduce = e.matches; });
  var $ = function (s, r) { return (r || doc).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var lang = window.__L || 'en', ready = false;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var shotLang = function (l) { return l; };   // real app screenshots exist in all 5 languages
  function start() { root.classList.add('ready'); ready = true; $$('.hero .cnt').forEach(function (c) { runCount(c, 300); }); }
  if (doc.readyState === 'complete') requestAnimationFrame(start); else addEventListener('load', function () { requestAnimationFrame(start); });
  setTimeout(function () { if (!ready) start(); }, 2500);   // never leave the hero hidden if "load" is slow

  /* ---- animated counters: count up once when they first scroll into view (or at once in reduced motion) ---- */
  var nf = new Intl.NumberFormat('en-US');
  function fmt(c, v) { var d = +c.getAttribute('data-dec') || 0; return c.hasAttribute('data-sep') ? nf.format(Math.round(v)) : v.toFixed(d); }
  function runCount(c, delay) {
    if (c.__done) return; c.__done = true;
    var to = +c.getAttribute('data-to'), from = c.hasAttribute('data-from') ? +c.getAttribute('data-from') : 0;
    if (reduce) { c.textContent = fmt(c, to); return; }
    var dur = 1200, t0 = null; c.textContent = fmt(c, from);
    function step(t) { if (t0 === null) t0 = t + (delay || 0); var p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 4); c.textContent = fmt(c, from + (to - from) * e); if (p < 1) requestAnimationFrame(step); else c.textContent = fmt(c, to); }
    requestAnimationFrame(step);
  }
  $$('.cnt').forEach(function (c) { if (!c.closest('.hero')) c.textContent = fmt(c, c.hasAttribute('data-from') ? +c.getAttribute('data-from') : 0); });   // start from the "before" value; the real number is already in the HTML if JS is off

  /* ---- language (crossfade) ---- */
  function setShots(l) { $$('[data-shot]').forEach(function (img) { var src = 'img/' + shotLang(l) + '-' + img.getAttribute('data-shot') + '.webp'; if (img.getAttribute('src') !== src) img.src = src; }); }
  function setBadges(l) { $$('[data-badge]').forEach(function (img) { var k = img.getAttribute('data-badge'), src = k === 'gp' ? 'img/badges/gp-' + l + '.png' : 'img/badges/as-' + (l === 'hi' ? 'en' : l) + '.svg'; if (img.getAttribute('src') !== src) img.src = src; }); }   // official store badges per language (Apple has no Hindi badge: English)
  function setLinks(l) { $$('[data-gp], [data-lnk]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').split('?')[0] + '?lang=' + l); }); }   // join / policy pages open in the same language
  function paintLang(l) {
    var D = LS[l] || LS.en; if (!D) return; lang = l; root.lang = l;
    $$('[data-t]').forEach(function (el) { var k = el.getAttribute('data-t'); if (k in D) el.textContent = D[k]; });
    $$('[data-alt]').forEach(function (el) { var k = el.getAttribute('data-alt'); if (k in D) el.alt = D[k]; });
    $$('[data-alt-label]').forEach(function (el) { var k = el.getAttribute('data-alt-label'); if (k in D) el.setAttribute('aria-label', D[k]); });
    $$('[data-gp]').forEach(function (el) { el.setAttribute('aria-label', D.gpSmall + ' Google Play'); });
    setShots(l); setLinks(l); setBadges(l); doc.title = D.title; var m = $('meta[name=description]'); if (m) m.setAttribute('content', D.desc);
    var chip = function (q) { return '<span class="mq-chip">' + esc(q) + '</span>'; }, a = D.mq.slice(0, Math.ceil(D.mq.length / 2)), b = D.mq.slice(Math.ceil(D.mq.length / 2));
    $('#mq1').innerHTML = a.concat(a).map(chip).join(''); $('#mq2').innerHTML = b.concat(b).map(chip).join('');
    $('#mqList').innerHTML = D.mq.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('');
    $('#lang').value = l;
  }
  function applyLang(l, quick) {
    try { localStorage.setItem('fkr.site.lang', l); } catch (e) {}
    if (reduce || quick) return paintLang(l);
    root.classList.add('lsw'); setTimeout(function () { paintLang(l); requestAnimationFrame(function () { root.classList.remove('lsw'); }); }, 230);   // fade out, swap text, fade in (~450 ms in total)
  }
  $('#lang').addEventListener('change', function () { applyLang(this.value); });

  /* ---- scroll reveal ---- */
  $$('.stg').forEach(function (g) { $$(':scope > .rv', g).forEach(function (el, i) { el.style.setProperty('--d', (Math.min(i, 9) * 0.045).toFixed(3) + 's'); }); });
  var rv = $$('.rv, .feat-vis');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add('in'); $$('.cnt', e.target).forEach(function (c) { runCount(c, 150); }); io.unobserve(e.target); }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); $$('.cnt', el).forEach(function (c) { runCount(c, 0); }); });

  /* ---- progress bar, header shadow, back-to-top, mobile bar, light parallax (one rAF per frame) ---- */
  var hd = $('#hd'), bar = $('#progress'), top = $('#totop'), stick = $('#stick'), tick = false;
  function onScroll() {
    tick = false; var y = window.pageYOffset || root.scrollTop, h = Math.max(1, root.scrollHeight - window.innerHeight);
    bar.style.transform = 'scaleX(' + Math.min(1, y / h).toFixed(4) + ')'; hd.classList.toggle('scrolled', y > 4);
    top.hidden = false; top.classList.toggle('show', y > 700); stick.classList.toggle('show', y > 420);
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true }); addEventListener('resize', onScroll); onScroll();
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---- hero phone: tilts toward the pointer (mouse/pen only) ---- */
  var box = $('#tiltBox'), tilt = $('#tilt');
  box.addEventListener('pointermove', function (e) { if (reduce || e.pointerType === 'touch') return; var r = box.getBoundingClientRect(); tilt.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(2) + 'deg'); tilt.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 12).toFixed(2) + 'deg'); });
  box.addEventListener('pointerleave', function () { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });

  /* ---- hero screenshot carousel: crossfade, dots, pauses off-screen / when the tab is hidden / after a tap ---- */
  var hs = $$('#heroStack > img'), hdots = $$('#heroDots button'), hcur = 0, htouched = false, hvis = true;
  function showHero(i) { hcur = i; hs.forEach(function (im, k) { if (k === i && im.loading === 'lazy') im.loading = 'eager'; im.classList.toggle('on', k === i); }); hdots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); }); }
  hdots.forEach(function (d) { d.addEventListener('click', function () { htouched = true; showHero(+d.getAttribute('data-i')); }); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { hvis = es[0].isIntersecting; }, { threshold: 0.2 }).observe($('.hero-vis'));
  if (!reduce) setInterval(function () { if (!reduce && hvis && !htouched && !doc.hidden) showHero((hcur + 1) % hs.length); }, 3200);
  showHero(0);

  /* ---- press ripple on buttons (skipped in reduced motion) ---- */
  doc.addEventListener('pointerdown', function (e) {
    if (reduce) return; var b = e.target.closest && e.target.closest('.btn:not(.off), .lang, .totop'); if (!b) return;
    var r = b.getBoundingClientRect(), s = doc.createElement('span'); s.className = 'rip'; s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
    if (getComputedStyle(b).position === 'static') b.style.position = 'relative'; b.style.overflow = 'hidden'; b.appendChild(s); s.addEventListener('animationend', function () { s.remove(); }); setTimeout(function () { s.remove(); }, 900);
  }, { passive: true });

  if (lang !== 'ko') paintLang(lang); else { $('#lang').value = 'ko'; setShots('ko'); setLinks('ko'); setBadges('ko'); }
  root.classList.remove('pl');   // text is final: show the page (the CSS also un-hides it after 1.5 s if this script ever fails)
  window.__landing = { setLang: function (l) { applyLang(l, true); }, reduce: function () { return reduce; } };
})();
