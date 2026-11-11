// Verify the site (local or live). Usage: node scripts/verify.mjs [baseUrl] [shotDir]
// Needs playwright-core + system Chrome (box: /workspace/nammanthuk/node_modules). Exit 1 on any failure.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(process.env.PW_FROM || '/workspace/nammanthuk/package.json');
const { chromium } = require('playwright-core');
const cfg = JSON.parse(fs.readFileSync(new URL('../config/site.json', import.meta.url)));
const base = (process.argv[2] || cfg.siteUrl).replace(/\/?$/, '/');
const shots = process.argv[3];
const LANGS = ['ko', 'en'];   // owner 2026-11-11: Korean and English only
const AD = /광고|\bads?\b|advert|admob|โฆษณา|广告|廣告|विज्ञापन/i;
// country-restriction wording (owner 2026-11-11: remove all of it)
const ONLY = /한국 전용|한국에서만|한국 Google Play|Korea[- ]only|\bin Korea\b|\bfor Korea\b|เกาหลีเท่านั้น|สำหรับเกาหลี|ในเกาหลี|面向韩国|仅.{0,12}韩国|韩国的 Google|केवल कोरिया|कोरिया के लिए|कोरिया में/i;
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); };
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const host = new URL(base).host;
for (const page of ['index.html', 'join.html', 'privacy.html', 'delete-account.html']) {
  for (const l of LANGS) for (const w of [360, 390, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, locale: l });
    const p = await ctx.newPage(); const errs = []; const ext = [];
    p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('request', (r) => { const u = new URL(r.url()); if (u.host !== host && !u.protocol.startsWith('data')) ext.push(u.host); });
    const res = await p.goto(base + page + '?lang=' + l, { waitUntil: 'networkidle' });
    const tag = `${page} ${l} ${w}`;
    ok(res && res.status() === 200, `${tag}: HTTP ${res && res.status()}`);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({
      lang: document.documentElement.lang, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      text: document.body.innerText, html: document.documentElement.outerHTML,
      empty: [...document.querySelectorAll('[data-t]')].filter((e) => !e.textContent.trim() && !/^s\de$/.test(e.getAttribute('data-t'))).map((e) => e.getAttribute('data-t')),
      broken: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      gp: [...document.querySelectorAll('[data-gp]')].map((a) => a.getAttribute('href')),
      asLinks: [...document.querySelectorAll('a')].filter((a) => /apps\.apple\.com/.test(a.href)).length,
      apps: [...document.querySelectorAll('a[data-apps]')].map((a) => a.href),
      hub: [...document.querySelectorAll('a')].filter((a) => a.href.replace(/\/$/, '') === 'https://motoraathailand.github.io').length,
      badges: [...document.querySelectorAll('.stores')].map((g) => [...g.querySelectorAll('.badge')].map((e) => { const q = e.getBoundingClientRect(); return [Math.round(q.width * 10) / 10, Math.round(q.height * 10) / 10]; })),
      fixed: (document.querySelector('.hd') || document.querySelector('header')) && getComputedStyle(document.querySelector('.hd') || document.querySelector('header')).position,
      langSel: !!document.querySelector('#lang, #langs'),
      langOpts: [...document.querySelectorAll('#lang option, #langs button')].map((o) => o.value || o.getAttribute('data-l')).join(','),
      otherLang: [...document.querySelectorAll('[lang]')].map((e) => e.getAttribute('lang')).filter((x) => /^(th|zh|hi)/.test(x)).length,
      steps: [...document.querySelectorAll('.card [data-go]')].map((a) => a.getAttribute('href')),
      priv: [...document.querySelectorAll('a')].filter((a) => /privacy\.html|delete-account\.html/.test(a.href)).length,
    }));
    ok(r.lang === l, `${tag}: lang ${r.lang}`);
    ok(r.sw <= r.cw, `${tag}: horizontal overflow ${r.sw}>${r.cw}`);
    const noScript = r.html.replace(/<script[\s\S]*?<\/script>/g, '');
    ok(!AD.test(r.text) && !AD.test(noScript), `${tag}: ads wording`);
    ok(!ONLY.test(r.text) && !ONLY.test(noScript), `${tag}: country-restriction wording ${(r.text.match(ONLY) || noScript.match(ONLY) || [''])[0]}`);
    ok(!r.empty.length, `${tag}: empty text ${r.empty}`);
    ok(!r.broken.length, `${tag}: broken images ${r.broken}`);
    ok(r.langOpts === 'ko,en' && !r.otherLang, `${tag}: language options must be ko,en only (${r.langOpts}, other-lang blocks ${r.otherLang})`);
    // owner pt497u: no kerosene, butane is LPG; no Ultra Kazen / premium diesel; navigation is TMAP / Kakao / Naver (Google Play badge text is fine)
    { const O = /실내등유|등유|kerosene|부탄|butane|울트라카젠|카젠|고급경유|Kazen|premium diesel|Waze|Google 지도|Google Maps/i; ok(!O.test(r.text) && !O.test(noScript), `${tag}: outdated app wording ${(r.text.match(O) || noScript.match(O) || [''])[0]}`); }
    // owner pt494u: no all-apps button or hub link on any page
    ok(!r.apps.length && !r.hub && !/모든 앱 보기|See all apps|ดูแอปทั้งหมด|查看全部应用|सभी ऐप देखें/i.test(r.text), `${tag}: all-apps button still present`);
    ok(!errs.length, `${tag}: console ${errs.join(' | ')}`);
    ok(!ext.length, `${tag}: external requests ${[...new Set(ext)]}`);
    ok(r.langSel && /fixed|sticky/.test(r.fixed), `${tag}: fixed header with language switch (${r.fixed})`);
    ok(r.asLinks === (cfg.appStoreUrl ? r.asLinks : 0), `${tag}: App Store must not be a link yet`);
    if (page === 'index.html') {
      ok(r.text.includes('MOTOR AA'), `${tag}: MOTOR AA missing`);
      ok(!/Pornnarai/i.test(r.text), `${tag}: personal name shown`);
      ok(r.gp.length === 4 && r.gp.every((h) => h === 'join.html?lang=' + l), `${tag}: Play buttons ${r.gp}`);
      
      ok(r.badges.length === 2 && r.badges.every((g) => g.length === 2 && g[0][0] === g[1][0] && g[0][1] === g[1][1]), `${tag}: Play / App Store badges not the same size ${JSON.stringify(r.badges)}`);
      ok(r.priv >= 2, `${tag}: privacy/delete links`);
      ok(r.text.includes('Android Auto'), `${tag}: Android Auto section`);
      // bottom bar: two stores half/half + back-to-top button
      await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(900);
      const bar = await p.evaluate(() => { const s = document.querySelector('#stick'); const d = [...s.querySelectorAll('.dlb')].map((e) => { const q = e.getBoundingClientRect(); return [Math.round(q.width), Math.round(q.height), Math.round(q.top)]; }); const t = document.querySelector('#totop'); return { show: s.classList.contains('show'), d, top: !!t && !t.hidden }; });
      ok(bar.show && bar.top && bar.d.length === 2 && bar.d[0][0] === bar.d[1][0] && bar.d[0][2] === bar.d[1][2], `${tag}: bottom bar ${JSON.stringify(bar)}`);
      if (shots && (l === 'ko' || l === 'en') && w !== 360) await p.screenshot({ path: `${shots}/intro-${l}-${w}-bar.png` });
    }
    if (page === 'join.html') {
      ok(r.text.includes('MOTOR AA'), `${tag}: MOTOR AA missing`);
      ok(JSON.stringify(r.steps) === JSON.stringify([cfg.groupUrl, cfg.optInUrl, cfg.installUrl]), `${tag}: step links ${r.steps}`);
      
      ok(!cfg.optInLive === (await p.evaluate(() => !!document.querySelector('#c2[data-locked]') && !document.querySelector('#pend').hidden)), `${tag}: optInLive lock state`);
      ok(r.html.includes(cfg.groupEmail) || r.text.includes('Gmail'), `${tag}: gmail note`);
      if (w === 390) { const fold = await p.evaluate(() => { const c = document.querySelector('#c3').getBoundingClientRect(); return c.bottom; }); ok(fold <= 844, `${tag}: step 3 below the fold (${fold})`); }
    }
    if (shots && (l === 'ko' || l === 'en') && w !== 360 && (page === 'index.html' || page === 'join.html')) {
      const n = page.replace('.html', '').replace('index', 'intro');
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
      await p.screenshot({ path: `${shots}/${n}-${l}-${w}-top.png` });
      await p.evaluate(async () => { document.querySelectorAll('.rv, .feat-vis, .check, [data-reveal]').forEach((e) => e.classList.add('in')); const im = [...document.querySelectorAll('img')]; im.forEach((i) => { i.loading = 'eager'; }); await Promise.all(im.map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 3000); }))); }); await p.waitForTimeout(900);
      await p.screenshot({ path: `${shots}/${n}-${l}-${w}-full.png`, fullPage: true });
      await p.evaluate(() => scrollTo(0, 0));
    }
    await ctx.close();
  }
}
// language rules
{
  const t = async (locale, url, stor) => { const c = await b.newContext({ locale }); const p = await c.newPage(); if (stor) { await p.goto(base + 'index.html'); await p.evaluate((s) => localStorage.setItem('fkr.site.lang', s), stor); } await p.goto(base + url); const l = await p.evaluate(() => document.documentElement.lang); await c.close(); return l; };
  ok(await t('zh-TW', 'index.html') === 'en', 'zh-TW device -> en');
  ok(await t('th-TH', 'join.html') === 'en', 'th device -> en');
  ok(await t('fr-FR', 'index.html') === 'en', 'fr -> en fallback');
  ok(await t('ko-KR', 'index.html') === 'ko', 'ko-KR -> ko');
  ok(await t('ko-KR', 'index.html', 'en') === 'en', 'saved choice wins');
  ok(await t('en-US', 'join.html?lang=ko', 'en') === 'ko', '?lang= wins');
  for (const old of ['th', 'zh', 'hi']) for (const pg of ['index.html', 'join.html', 'privacy.html', 'delete-account.html']) ok(await t('ko-KR', pg + '?lang=' + old) === 'en', `old ?lang=${old} on ${pg} -> en`);
  ok(await t('ko-KR', 'index.html', 'th') === 'ko', 'old saved th ignored -> device ko');
}
await b.close();
if (fails.length) { console.log('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log('verify OK: ' + base);
