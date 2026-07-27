# valm.pro

Personal site for Allan Valm, AI Augmentation Partner. Three static pages, no build step, no dependencies.

Live at https://valm.pro

## Files

| File | Purpose |
|---|---|
| `index.html` | Home page. |
| `privacy.html` | Privacy notice. |
| `404.html` | Not-found page. GitHub Pages serves it automatically. |
| `site.css` | The whole design system. Every page links it. |
| `site.js` | Shared runtime: consent banner, sticky nav, scroll reveal, analytics events. |
| `fonts/` | Inter, two variable woff2 files, plus the SIL Open Font License. |
| `portrait.jpg` | Portrait in the Who I am section. |
| `allan-valm.jpg` | Larger portrait referenced by the structured data. |
| `allan-valm-og.jpg` | Social share card, 1200 x 630. |
| `robots.txt` | Allows Google and the AI crawlers. Points to the sitemap. |
| `sitemap.xml` | Two URLs. Update `lastmod` when a page changes. |
| `CNAME` | Custom domain. Must contain exactly `valm.pro`. |
| `.nojekyll` | Serves the files as they are. |

## Architecture

Three HTML pages share one stylesheet and one runtime. Nothing is duplicated between pages.

- **Styles** live in `site.css` only. The CSS variables at the top hold the design system, so colour and spacing changes happen in one place.
- **Behaviour** lives in `site.js` only. It loads with `defer` and every block guards on the elements it needs, so the same file is safe on all three pages.
- **Asset paths are root-relative** (`/site.css`, `/site.js`, `/fonts/...`). GitHub Pages serves `404.html` at whatever URL was requested, so relative paths would break at depth.
- **Three small scripts stay inline in the head**, in this order: the `js` class, the Consent Mode defaults, then the Google tags. Consent must be set before any Google script loads.

## Publishing

1. Upload every file to the repository root, including the dotfile `.nojekyll`.
2. Settings → Pages → Build and deployment → Deploy from a branch, `main`, `/ (root)`.
3. Custom domain: `valm.pro`. Save.
4. Wait for the certificate, then tick **Enforce HTTPS**.

### DNS

Four A records on the apex, host `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optional IPv6:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

For `www`, add a CNAME record pointing to `USERNAME.github.io`.

Remove any default apex record the registrar created. Do not use wildcard records. Changes can take up to 24 hours.

## Contact

Contact happens in the closing section, which lists three routes: email, phone and LinkedIn. The buttons in the nav and hero are navigation only, scrolling to `#contact`.

Both email links carry the subject `AI Augmentation Partner`, set by the `SUBJECT` constant in `index.html`, so one mail rule catches every route.

Each route link carries a `data-route` attribute. The analytics use it to tell the routes apart. Keep it on any route added later.

## Analytics and consent

Google Tag Manager (`GTM-WCNXPKK9`) and GA4 (`G-BVV1R9P01P`) load from the head.

Consent Mode runs ahead of both. Every storage type is denied by default, so no analytics cookie is set until the visitor accepts. Accepting grants `analytics_storage` only; advertising consent stays denied because the site runs no advertising tags. The choice is stored in `localStorage` under `vp-consent`.

Every page carries a **Cookies** link in the footer that clears the stored choice and reopens the banner. Withdrawing consent has to be as easy as giving it, so that link must not be removed.

There is no GTM `noscript` iframe. With JavaScript off the Consent Mode defaults never run, so anything firing through it would fire with no consent state. If GTM is ever used to fire real tags, set the default consent state inside the GTM container as well, then the iframe can be restored.

### Events

| Event | Parameters | Meaning |
|---|---|---|
| `section_view` | `section` | How far people read. Once per section: `patterns`, `what_you_get`, `honest_part`, `how_it_starts`, `track_record`, `first_session`, `contact` |
| `cta_click` | `location` (`nav`, `hero`) | Someone moved toward the contact section |
| `generate_lead` | `method` (`email`, `phone`, `linkedin`), `location` (`contact`, `footer`) | Which route they chose |
| `consent_choice` | `choice` (`granted`, `denied`) | Acceptance rate |

Mark `generate_lead` as a key event in GA4 under Admin → Events.

`generate_lead` measures the click on a route, not a delivered message. Treat it as intent and compare it against what reaches you. The gap between `cta_click` and `generate_lead` shows how many reach the contact section and then choose nothing.

GA4 enhanced measurement already tracks outbound clicks and 90 percent scroll, so no custom event duplicates those. Do not rebuild these events as GTM tags for the same property.

## Privacy notice

`privacy.html` is a draft for review by someone qualified, not legal advice. Three things to confirm:

1. **GA4 retention.** The text says at most fourteen months. Check the property setting under Admin → Data collection and modification → Data retention.
2. **Postal address.** Only a city, an email and a phone number are given.
3. **Accuracy.** If any tag, tool or host changes, update the notice and the date at the top.

## Editing

Copy is specified in the accompanying copy and design brief, including the voice rules. Two matter most: state a fact and let the reader draw the conclusion, and keep the plain-English rule, because most readers use English as a second language.

Fonts are self-hosted, so no third-party request is made for typography. Inter is used under the SIL Open Font License 1.1, included at `fonts/OFL.txt`.

If copy changes, update `sitemap.xml` `lastmod` and keep the structured data in step with the visible text.
