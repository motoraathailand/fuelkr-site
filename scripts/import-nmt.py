# One-off: derive fuelkr templates from the live nammanthuk-site markup (owner 2026-11-11: unify fuelkr theme with nammanthuk).
# Keeps nammanthuk's markup/classes/SVGs; swaps in fuelkr content slots. Text is filled by scripts/build.mjs from src/*.mjs.
import re, sys
N = '/workspace/nammanthuk-site-clone/'
s = open(N + 'index.html').read()
body = s[s.index('<svg width="0"'):s.index('<script src="strings.js')]
def sub(p, r, cnt=1, fl=re.S):
    global body
    new, n = re.subn(p, r, body, count=cnt, flags=fl)
    if n == 0: sys.exit('no match: ' + p[:60])
    body = new
sub(r'aria-label="น้ำมันถูก"><svg class="logo-drop" aria-hidden="true"><use href="#drop"/></svg><span>น้ำมันถูก</span>', 'aria-label="주유소를부탁해"><svg class="logo-drop" aria-hidden="true"><use href="#drop"/></svg><span>주유소를부탁해</span>')
sub(r'<span class="grad">น้ำมันถูก</span>', '<span class="grad">주유소를부탁해</span>')
# hero carousel: 3 real fuelkr screens
sub(r'<div class="phone-screen stack" id="heroStack">.*?</div></div>', '<div class="phone-screen stack" id="heroStack">\n'
    '            <img data-shot="fuel" src="img/ko-fuel.webp" data-alt="altFuel" alt="" width="540" height="960" fetchpriority="high" decoding="async" class="on">\n'
    '            <img data-shot="tut" src="img/ko-tut.webp" data-alt="altTut" alt="" width="540" height="960" decoding="async" loading="lazy">\n'
    '            <img data-shot="menu" src="img/ko-menu.webp" data-alt="altMenu" alt="" width="540" height="960" decoding="async" loading="lazy">\n'
    '          </div></div>')
sub(r'(<div class="dots" id="heroDots" role="tablist">).*?(</div>)', r'\1<button type="button" class="on" data-i="0" aria-label="1"></button><button type="button" data-i="1" aria-label="2"></button><button type="button" data-i="2" aria-label="3"></button>\2')
# hero callouts: facts only, no sample numbers
sub(r'<span class="big"><span class="cnt" data-to="41.54" data-dec="2">41.54</span></span> ', '')
sub(r'<span class="big"><span class="cnt" data-to="780" data-dec="0">780</span></span> ', '')
sub(r'<small data-t="fl1s">', '<small data-t="fl1s">')
# stats
sub(r'<div class="wrap stats-in stg">.*?</div>\n</section>', '<div class="wrap stats-in stg">\n'
    '    <div class="stat rv"><b><span class="cnt" data-to="5">5</span></b><span data-t="st1"></span></div>\n'
    '    <div class="stat rv"><b><span class="cnt" data-to="5">5</span></b><span data-t="st2"></span></div>\n'
    '    <div class="stat rv"><b><span class="cnt" data-to="5">5</span></b><span data-t="st3"></span></div>\n'
    '    <div class="stat rv"><b><span class="cnt" data-to="2">2</span></b><span data-t="st4"></span></div>\n'
    '  </div>\n</section>')
# drop the "free" section
sub(r'<section class="free".*?</section>\n\n', '')
# marquee chips are rebuilt by build/JS
sub(r'<div class="mq-track" id="mq1">.*?</div>', '<div class="mq-track" id="mq1">{{mq1}}</div>')
sub(r'<div class="mq-track" id="mq2">.*?</div>', '<div class="mq-track" id="mq2">{{mq2}}</div>')
sub(r'<ul class="sr" id="mqList">.*?</ul>', '<ul class="sr" id="mqList">{{mqList}}</ul>')
# feature screenshots
sub(r'data-shot="board" src="img/th-board.webp" data-alt="altBoard"[^>]*>', 'data-shot="fuel" src="img/ko-fuel.webp" data-alt="altFuel" alt="" width="540" height="960" loading="lazy" decoding="async">')
sub(r'data-shot="map" src="img/th-map.webp" data-alt="altMap"[^>]*>', 'data-shot="tut" src="img/ko-tut.webp" data-alt="altTut" alt="" width="540" height="960" loading="lazy" decoding="async">')
sub(r'<div class="gauge-card">.*?</div>\n      </div>\n      <div class="phone-wrap sm sm2">', '<div class="phone-wrap sm">')
sub(r'data-shot="report" src="img/th-report.webp" data-alt="altReport"[^>]*>', 'data-shot="menu" src="img/ko-menu.webp" data-alt="altMenu" alt="" width="540" height="960" loading="lazy" decoding="async">')
# Android Auto: one card with a self-made explanatory drawing (no CarPlay card)
sub(r'<div class="cars stg">.*?</div>\n    <ul class="check auto-list', '<div class="cars one stg">\n      <article class="carcard rv">\n'
    '        <header class="cc-h"><span class="cc-name">Android Auto</span><span class="cc-st ok" data-t="ccOk"></span></header>\n'
    '        <figure class="car">\n          <div class="car-frame"><div class="car-screen" id="carStack">{{carSvg}}</div></div>\n'
    '          <figcaption class="car-cap" data-t="autoCap"></figcaption>\n        </figure>\n      </article>\n    </div>\n    <ul class="check auto-list')
sub(r'<p class="auto-free rv"[^\n]*</p>\n', '')
# drop the 3-step tabs section
sub(r'<section class="steps" id="how">.*?</section>\n\n', '')
sub(r'mailto:motoraathailand@gmail\.com\?subject=[^"]*', 'mailto:motoraathailand@gmail.com?subject=%EC%A3%BC%EC%9C%A0%EC%86%8C%EB%A5%BC%EB%B6%80%ED%83%81%ED%95%B4')
sub(r'href="privacy.html"', 'href="privacy.html" data-lnk', 0)
sub(r'href="delete-account.html"', 'href="delete-account.html" data-lnk', 0)
sub(r'(<a class="logo" href=")\./(")', r'\1index.html\2')
# card icons: same nammanthuk icon set, matched to the fuelkr card topics
def icons(cls):
    return re.findall(r'<article class="%s rv"><span class="ti">(<svg.*?</svg>)</span>' % cls, body, flags=re.S)
MI, TI = icons('mcard'), icons('tcard')
Q = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.6c0 1.700-2.500 2.200-2.500 3.800" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.300" fill="currentColor"/></svg>'
NOGUESS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 20.500V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14.500M5 20.500h13M16 9h1.500a1.500 1.500 0 0 1 1.500 1.500V16a1.500 1.500 0 0 0 3 0V9l-2.500-2.500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 4l15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
newM, newT = [TI[1], MI[0], MI[1], MI[2], MI[4], Q], [TI[1], NOGUESS, TI[0], TI[2]]
for cls, new in (('mcard', newM), ('tcard', newT)):
    it = iter(new)
    body = re.sub(r'(<article class="%s rv"><span class="ti">)<svg.*?</svg>(</span>)' % cls, lambda m: m.group(1) + next(it) + m.group(2), body, flags=re.S)
# owner 2026-11-11 (pt494u): no "see all apps" button anywhere on this site
sub(r'\n\s*<a class="btn ghost lg apps"[^\n]*?</a>(?=\n\s*</div>)', '')   # hero: keep the one remaining button
sub(r'<div class="cta2">(\s*<a class="btn ghost lg" href="#s1">)', r'<div class="cta2 one">\1')
sub(r'\n\s*<div class="cta2 one center rv"[^\n]*?data-apps[^\n]*', '')    # closing section
# all baked Thai text out: build fills ko from strings
body = re.sub(r'(<(\w+)[^>]*\sdata-t="\w+"[^>]*>)[^<]*(</\2>)', r'\1\3', body)
body = re.sub(r'(data-alt-label="\w+"[^>]*?)aria-label="[^"]*"', r'\1', body)
body = re.sub(r'aria-label="[^"]*"(\s[^>]*data-alt-label=)', r'\1', body)
body = re.sub(r'aria-label="Google Play[^"]*"', '', body)
body = re.sub(r'src="img/badges/gp-th.png"', 'src="img/badges/gp-ko.png"', body)
body = re.sub(r'src="img/badges/as-th.svg"', 'src="img/badges/as-ko.svg"', body)
body = re.sub(r'(<select id="lang"[^>]*>).*?(</select>)', lambda m: m.group(1)+'<option value="ko" selected>한국어</option><option value="en">English</option><option value="th">ไทย</option><option value="zh">简体中文</option><option value="hi">हिन्दी</option>'+m.group(2), body, flags=re.S)
if re.search(r'[\u0E00-\u0E7F]', body): print('WARN thai left:', set(re.findall(r'[^<>"]{0,30}[\u0E00-\u0E7F]+[^<>"]{0,20}', body)))
open('src/index.template.html', 'w').write(body)

j = open(N + 'join.html').read()
jb = j[j.index('<body'):j.index('<script src="motion.js')]
def jsub(p, r, cnt=1):
    global jb
    new, n = re.subn(p, r, jb, count=cnt, flags=re.S)
    if n == 0: sys.exit('join no match: ' + p[:60])
    jb = new
jsub(r'aria-label="น้ำมันถูก"', 'aria-label="주유소를부탁해"')
jsub(r'<span>น้ำมันถูก</span>', '<span>주유소를부탁해</span>')
jsub(r'(<a class="logo" href=")\./(")', r'\1index.html\2')
jsub(r'https://play.google.com/apps/testing/com.nammanthuk.app', '{{optInUrl}}')
jsub(r'https://play.google.com/store/apps/details\?id=com.nammanthuk.app', '{{installUrl}}')
jsub(r'https://groups.google.com/g/motoraa-testers', '{{groupUrl}}')
jsub(r'<li class="card" id="c2" data-step="2">', '<li class="card" id="c2" data-step="2"{{lock}}>')
jsub(r'<li class="card" id="c3" data-step="3">', '<li class="card" id="c3" data-step="3"{{lock}}>')
jsub(r'(data-go="2" href="\{\{optInUrl\}\}")', r'\1{{lockA}}')
jsub(r'(data-go="3" href="\{\{installUrl\}\}")', r'\1{{lockA}}')
jsub(r'<p class="pend" id="pend" data-t="pend" hidden>', '<p class="pend" id="pend" data-t="pend"{{pendHidden}}>')
jsub(r'\n<details name="faq"><summary data-t="q5">.*?</details>', '')   # nammanthuk's country question: not used for fuelkr
jsub(r'href="mailto:motoraathailand@gmail.com"', 'href="mailto:{{contact}}"')
jsub(r'src="join-qr.svg"', 'src="img/join-qr.svg"')
jsub(r'<a href="\./" data-t="back">', '<a href="index.html" data-lnk data-t="back">')
jsub(r'<a href="privacy.html" data-t="privacy">', '<a href="privacy.html" data-lnk data-t="privacy">')
jsub(r'\n\s*<a class="btn ghost apps"[^\n]*?data-apps[^\n]*', '')   # owner pt494u: no all-apps button
jsub(r'(<a href="privacy.html" data-lnk data-t="privacy">[^<]*</a>)', r'\1<span aria-hidden="true">·</span><span><span data-t="ftOp"></span>: MOTOR AA</span>')   # provider name, as on the intro footer
jb = re.sub(r'(<(\w+)[^>]*\sdata-t="\w+"[^>]*>)[^<]*(</\2>)', r'\1\3', jb)
jb = re.sub(r'(<select id="lang") aria-label="[^"]*"', r'\1', jb)
jb = re.sub(r'(<img [^>]*)alt="[^"]*"([^>]*data-alt=)', r'\1alt=""\2', jb)
jb = jb.replace('<option value="th" selected>', '<option value="th">').replace('<option value="ko">', '<option value="ko" selected>')
jb = re.sub(r'(<select id="lang"[^>]*>).*?(</select>)', lambda m: m.group(1)+'<option value="ko" selected>한국어</option><option value="en">English</option><option value="th">ไทย</option><option value="zh">简体中文</option><option value="hi">हिन्दी</option>'+m.group(2), jb, flags=re.S)
if re.search(r'[\u0E00-\u0E7F]', jb): print('WARN join thai left:', set(re.findall(r'[^<>"]{0,30}[\u0E00-\u0E7F]+[^<>"]{0,20}', jb)))
open('src/join.template.html', 'w').write(jb)
print('ok')
