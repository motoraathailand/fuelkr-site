# 주유소를부탁해 — intro, tester join and policy pages

GitHub Pages site (`docs/` on `main`) for the Korea-only fuel-price app **주유소를부탁해** (Android package `com.motoraa.fuelkr`). Provider shown on the pages: **MOTOR AA**.

- Intro: https://motoraathailand.github.io/fuelkr-site/
- Tester join: https://motoraathailand.github.io/fuelkr-site/join.html (`/join/` and `/test/` redirect here, `?lang=` kept)
- Privacy: https://motoraathailand.github.io/fuelkr-site/privacy.html
- Account and data deletion: https://motoraathailand.github.io/fuelkr-site/delete-account.html

## What is shared with other AA intro pages
Only the four common parts from `/workspace/shared/AA-common-rules.md` (hero with app name, one line, short intro, Google Play + App Store badges with status chips; fixed top bar with logo + language and fixed bottom bar with two equal store badges + back to top; closing section with icon, title, text, badges, chips and "모든 앱 보기"; footer with email, privacy / deletion cards, provider, data source, trademarks). Theme, colours (navy `#0d1b3e` + signal amber `#f5a524`) and all other sections are this app's own.

## Facts and sources
- App name, package, features, fuel codes, Opinet source, Android Auto, login use: the app's own 1.0.5 build (`app-config.js`, `i18n.js`, bundled `site/privacy.html`).
- Screenshots `docs/img/shots/<lang>-{fuel,tut,menu}.webp`: captured from that build's web UI in Chrome (360×640, DPR 2), no prices invented. The Android Auto picture is a self-made abstract drawing, labelled as an explanation.
- Badges: official Google Play / App Store badges (App Store SVG padded to 565:168 so both boxes are identical). Hindi uses the English App Store badge.
- Fonts: self-hosted copies (OFL, `docs/fonts/LICENSES`). Motion: shared AA motion v1 (`docs/assets/motion.css/js`, byte-identical copies).

## Edit, build, verify
```sh
# all links/facts: config/site.json · copy: src/strings.mjs, src/join-strings.mjs, src/policy.mjs
node scripts/build.mjs                       # writes docs/ (checks all 5 languages and bans ads wording)
node scripts/verify.mjs http://127.0.0.1:PORT/   # or no arg = live site; optional 2nd arg = screenshot folder
```
Rules: no ads wording on any page (build + verify fail on it). Language = `?lang=` > saved choice (`fkr.site.lang`) > device language > English.

## When the Play closed test opens
Set `"optInLive": true` in `config/site.json`, rebuild, push. Steps 2–3 on the join page become live links (Play opt-in `https://play.google.com/apps/testing/com.motoraa.fuelkr`, install `https://play.google.com/store/apps/details?id=com.motoraa.fuelkr`).
When the iOS app is live, put its URL in `appStoreUrl`.
