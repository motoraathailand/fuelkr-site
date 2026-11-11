// Verify the site (local or live). Usage: node scripts/verify.mjs [baseUrl] [shotDir]
// Needs playwright-core + system Chrome (box: /workspace/nammanthuk/node_modules). Exit 1 on any failure.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(process.env.PW_FROM || '/workspace/nammanthuk/package.json');
const { chromium } = require('playwright-core');
const cfg = JSON.parse(fs.readFileSync(new URL('../config/site.json', import.meta.url)));
const base = (process.argv[2] || cfg.siteUrl).replace(/\/?$/, '/');
const shots = process.argv[3];
const LANGS = ['ko', 'en', 'th', 'zh', 'hi'];
const AD = /광고|\bads?\b|advert|admob|โฆษณา|广告|廣告|विज्ञापन/i;
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
      empty: [...document.querySelectorAll('[data-t]')].filter((e) => !e.textContent.trim()).map((e) => e.getAttribute('data-t')),
      broken: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      gp: [...document.querySelectorAll('[data-gp]')].map((a) => a.getAttribute('href')),
      asLinks: [...document.querySelectorAll('a')].filter((a) => /apps\.apple\.com/.test(a.href)).length,
      apps: [...document.querySelectorAll('a[data-apps]')].map((a) => a.href),
      badges: [...document.querySelectorAll('.stores .badge')].map((e) => { const q = e.getBoundingClientRect(); return [Math.round(q.width * 10) / 10, Math.round(q.height * 10) / 10]; }),
      fixed: !!document.querySelector('.hd') && getComputedStyle(document.querySelector('.hd')).position,
      langSel: !!document.querySelector('#lang'),
      steps: [...document.querySelectorAll('.card [data-go]')].map((a) => a.getAttribute('href')),
      priv: [...document.querySelectorAll('a')].filter((a) => /privacy\.html|delete-account\.html/.test(a.href)).length,
    }));
    ok(r.lang === l, `${tag}: lang ${r.lang}`);
    ok(r.sw <= r.cw, `${tag}: horizontal overflow ${r.sw}>${r.cw}`);
    ok(!AD.test(r.text) && !AD.test(r.html.replace(/<script[\s\S]*?<\/script>/g, '')), `${tag}: ads wording`);
    ok(!r.empty.length, `${tag}: empty text ${r.empty}`);
    ok(!r.broken.length, `${tag}: broken images ${r.broken}`);
    ok(!errs.length, `${tag}: console ${errs.join(' | ')}`);
    ok(!ext.length, `${tag}: external requests ${[...new Set(ext)]}`);
    ok(r.langSel && r.fixed === 'fixed', `${tag}: fixed header with language switch`);
    ok(r.asLinks === (cfg.appStoreUrl ? r.asLinks : 0), `${tag}: App Store must not be a link yet`);
    if (page === 'index.html') {
      ok(r.text.includes('MOTOR AA'), `${tag}: MOTOR AA missing`);
      ok(!/Pornnarai/i.test(r.text), `${tag}: personal name shown`);
      ok(r.gp.length === 3 && r.gp.every((h) => h === 'join.html?lang=' + l), `${tag}: Play buttons ${r.gp}`);
      ok(r.apps.length === 1 && r.apps[0] === cfg.hubUrl, `${tag}: all-apps button ${r.apps}`);
      ok(r.badges.length === 4 && r.badges.every((x) => x[0] === r.badges[0][0] && x[1] === r.badges[0][1]), `${tag}: badge sizes ${JSON.stringify(r.badges)}`);
      ok(r.priv >= 2, `${tag}: privacy/delete links`);
      // bottom bar: two stores half/half + back to top
      await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(700);
      const bar = await p.evaluate(() => { const s = document.querySelector('#stick'); const d = [...s.querySelectorAll('.dlb')].map((e) => { const q = e.getBoundingClientRect(); return [Math.round(q.width), Math.round(q.height), Math.round(q.top)]; }); return { show: s.classList.contains('show'), d, top: !!s.querySelector('#totop') }; });
      ok(bar.show && bar.top && bar.d.length === 2 && bar.d[0][0] === bar.d[1][0] && bar.d[0][2] === bar.d[1][2], `${tag}: bottom bar ${JSON.stringify(bar)}`);
      if (shots && (l === 'ko' || l === 'en') && w !== 360) await p.screenshot({ path: `${shots}/intro-${l}-${w}-bar.png` });
    }
    if (page === 'join.html') {
      ok(r.text.includes('MOTOR AA'), `${tag}: MOTOR AA missing`);
      ok(JSON.stringify(r.steps) === JSON.stringify([cfg.groupUrl, cfg.optInUrl, cfg.installUrl]), `${tag}: step links ${r.steps}`);
      ok(r.apps.length === 1 && r.apps[0] === cfg.hubUrl, `${tag}: all-apps button`);
      ok(r.html.includes(cfg.groupEmail) || r.text.includes('Gmail'), `${tag}: gmail note`);
      if (w === 390) { const fold = await p.evaluate(() => { const c = document.querySelector('#c3').getBoundingClientRect(); return c.bottom; }); ok(fold <= 844, `${tag}: step 3 below the fold (${fold})`); }
    }
    if (shots && (l === 'ko' || l === 'en') && w !== 360 && (page === 'index.html' || page === 'join.html')) {
      const n = page.replace('.html', '').replace('index', 'intro');
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
      await p.screenshot({ path: `${shots}/${n}-${l}-${w}-top.png` });
      await p.screenshot({ path: `${shots}/${n}-${l}-${w}-full.png`, fullPage: true });
    }
    await ctx.close();
  }
}
// language rules
{
  const t = async (locale, url, stor) => { const c = await b.newContext({ locale }); const p = await c.newPage(); if (stor) { await p.goto(base + 'index.html'); await p.evaluate((s) => localStorage.setItem('fkr.site.lang', s), stor); } await p.goto(base + url); const l = await p.evaluate(() => document.documentElement.lang); await c.close(); return l; };
  ok(await t('zh-TW', 'index.html') === 'zh', 'zh-TW -> zh');
  ok(await t('fr-FR', 'index.html') === 'en', 'fr -> en fallback');
  ok(await t('ko-KR', 'index.html') === 'ko', 'ko-KR -> ko');
  ok(await t('ko-KR', 'index.html', 'th') === 'th', 'saved choice wins');
  ok(await t('ko-KR', 'join.html?lang=hi', 'th') === 'hi', '?lang= wins');
}
await b.close();
if (fails.length) { console.log('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log('verify OK: ' + base);
