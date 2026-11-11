# 주유소를부탁해 — intro and tester-join pages

Live: https://motoraathailand.github.io/fuelkr-site/ (GitHub Pages, `main` branch, `/docs`).
App: `com.motoraa.fuelkr`. Provider shown on the pages: MOTOR AA.

## Theme
Same theme as nammanthuk-site (owner decision 2026-11-11, fuelkr only).
- `src/index.template.html`, `src/join.template.html`: nammanthuk markup with fuelkr content slots, generated once by `scripts/import-nmt.py` from the nammanthuk-site clone.
- `src/web/`: nammanthuk `landing.css` (plus a 3-line addendum for one Android Auto card), `join.css`, `site.css`, `motion.css/js`, Plex fonts; `landing.js` / `join.js` adapted (storage keys `fkr.site.lang`, `fkr.join.steps`; Korean is the baked default).

## Text
`src/strings.mjs` (intro), `src/join-strings.mjs` (join), `src/policy.mjs` (privacy / delete account). 5 languages: ko, en, th, zh, hi.
Language: `?lang=` > saved choice > phone language > English.
The build fails on any missing key, any ads wording, or any country-restriction wording.

## Build and check
```
node scripts/build.mjs                       # writes docs/
node scripts/verify.mjs [baseUrl] [shotDir]  # 4 pages x 5 languages x 360/390/1280
```
`config/site.json`: `optInLive` stays `false` until the Play closed test is live (steps 2–3 locked, notice shown).
`appStoreUrl` empty = App Store badge shown as "coming soon" (not a link).
