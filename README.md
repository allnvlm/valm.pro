# valm.pro

Personal site for Allan Valm, AI Augmentation Partner. One static page, no build step, no dependencies.

Live at https://valm.pro

## Files

| File | Purpose |
|---|---|
| `index.html` | The main page. |
| `privacy.html` | Privacy notice. |
| `404.html` | Not-found page. GitHub Pages serves this automatically. |
| `site.css` | The whole design system. Every page links it. Edit styles here only. |
| `site.js` | Shared runtime: consent banner, sticky nav, scroll reveal, analytics events. Edit behaviour here only. |
| `portrait.jpg` | Portrait shown in the Who I am section, 840px wide. |
| `allan-valm.jpg` | Larger portrait referenced by the structured data. |
| `allan-valm-og.jpg` | Social share card, 1200 x 630. |
| `robots.txt` | Allows Google plus the AI crawlers. Points to the sitemap. |
| `sitemap.xml` | Single URL. Update `lastmod` when the page changes. |
| `CNAME` | Custom domain. Must contain exactly `valm.pro`. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |
| `fonts/` | Inter, self-hosted as two variable woff2 files, plus the SIL Open Font License. |

## Publishing

1. Create a public repository. Any name works, since the custom domain sits in front of it.
2. Upload every file in this folder to the repository root, including the dotfile `.nojekyll`.
3. In the repository, open **Settings**, then **Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Under **Custom domain**, enter `valm.pro` and save.
6. Wait for the certificate to be issued, then tick **Enforce HTTPS**.

## DNS

At the registrar for `valm.pro`, create four A records for the apex domain, all with host `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optionally add four AAAA records for IPv6:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

To make `www.valm.pro` work as well, add a CNAME record with host `www` pointing to `USERNAME.github.io`.

Remove any default record the registrar created for the apex domain first. Do not use wildcard records such as `*.valm.pro`, because they expose the domain to takeover. DNS changes can take up to 24 hours to propagate.

## After it is live

1. Verify the domain in Google Search Console and submit `https://valm.pro/sitemap.xml`.
2. In Search Console, open **Settings**, then **Search generative AI**, and confirm the property is set to include. Inclusion is an eligibility requirement for AI Overviews and AI Mode.
3. Run the Rich Results Test on `https://valm.pro/` to confirm the structured data parses.
4. Run LinkedIn's Post Inspector once so the share card is cached.

## Analytics and consent

Google Tag Manager (`GTM-WCNXPKK9`) and GA4 (`G-BVV1R9P01P`) are installed in the head.

Consent Mode runs ahead of both. Every storage type is denied by default, so no analytics cookie is set until the visitor accepts. A small banner offers Accept or Only necessary, the choice is stored in `localStorage` under `vp-consent`, and the banner does not return once a choice exists. Accepting grants `analytics_storage` only. Advertising consent stays denied, because the site runs no advertising tags.

Both pages carry a **Cookies** link in the footer that clears the stored choice and reopens the banner. The GDPR requires withdrawing consent to be as easy as giving it, so that link must not be removed.

Two things to keep in mind. GA4 is loaded directly through gtag.js while GTM is also present, so do not add a second GA4 configuration tag inside GTM for the same property or every pageview counts twice. And if advertising tags are ever added, the consent update call in the banner script needs the advertising types granted as well.

Fonts are self-hosted, so the page makes no third-party request for typography and no visitor IP address reaches Google for that purpose. Inter is used under the SIL Open Font License 1.1, included at `fonts/OFL.txt`.

## Analytics events

Five events are sent through `gtag`, so Consent Mode governs them. With consent denied they travel as cookieless pings and set nothing on the device.

| Event | Parameters | What it answers |
|---|---|---|
| `section_view` | `section` | How far people read. Fires once per section: `patterns`, `what_you_get`, `honest_part`, `how_it_starts`, `track_record`, `first_session`, `contact` |
| `cta_click` | `location` (`nav`, `hero`) | Intent. Someone moved toward the contact section |
| `generate_lead` | `method` (`email`, `phone`, `linkedin`), `location` (`contact`, `footer`) | The conversion, and which route they chose. A GA4 recommended event name, so it appears in standard reports |

**The question this is built to answer.** Pair `section_view` with `generate_lead` in an exploration. If visitors who reach `track_record` convert at a higher rate than those who do not, the evidence is doing work and more of it is worth adding. If the rate is flat, the page converts on the offer alone. That is a real strategic question rather than a vanity metric.

**Mark `generate_lead` as a key event** in GA4 under Admin, Events, so it appears as a conversion.

**An honest caveat on `generate_lead`.** This measures the click on a route, not a delivered message. Nobody can tell whether the email was sent or the call connected, so treat it as strong intent and compare it against what actually reaches you. The gap between `cta_click` and `generate_lead` is the more useful number: it shows how many reach the contact section and then choose nothing.

**Two things to avoid.** GA4 enhanced measurement already tracks outbound clicks and 90 percent scroll, so no custom events duplicate those. And since GTM is present alongside gtag, do not rebuild these events as GTM tags for the same property.

## Contact

Contact happens in the closing section, which lists three routes and lets the visitor choose: email, phone and LinkedIn. The buttons in the nav and the hero are navigation only. They scroll to `#contact` rather than triggering anything.

Both email links carry the subject `AI Augmentation Partner`, set by the `SUBJECT` constant in `index.html`, so one mail rule catches every route.

Each route link carries a `data-route` attribute, which is what the analytics use to tell email, phone and LinkedIn apart. Keep it on any route added later.

A contact form was built and then removed on purpose. GitHub Pages serves static files only, so a form needs a third-party processor. Until one is wired the form has to fall back to opening an email, which means it validates what someone types and then discards it. That is worse than a plain email link, and it is unfamiliar behaviour for the visitor. The subject line is set in one place, the `SUBJECT` constant in the analytics block of `index.html`.

If a form is ever reinstated, the requirement is a provider with EU data residency and a signed data processing agreement, verified on the provider's own legal pages rather than in a comparison article. The provider then has to be named in `privacy.html`.

## Privacy notice

`privacy.html` is a draft written for review by someone qualified, not legal advice. Three things in it need confirming against reality before relying on it:

1. **GA4 retention.** The text says the data is deleted after the retention period set in the property. Check that period in GA4 under Admin, Data collection and modification, Data retention, then state the actual figure.
2. **Postal address.** Only a city, an email and a phone number are given. A full postal address is the usual expectation for a data controller, so decide whether to add one.
3. **Accuracy over time.** If any tag, tool or host changes, the notice changes with it, along with the date at the top.

## Architecture

Three HTML pages share one stylesheet and one runtime. Nothing is duplicated between pages, which is deliberate: an earlier version inlined both into every page and the two pages had drifted apart within a week.

- **Styles** live in `site.css` only. The CSS variables at the top hold the whole design system, so colour and spacing changes happen in one place.
- **Behaviour** lives in `site.js` only. It loads with `defer` and every block guards on the elements it needs, so the same file is safe on all three pages.
- **Asset paths are root-relative** (`/site.css`, `/site.js`, `/fonts/...`). This matters for `404.html`, which GitHub Pages serves at whatever URL was requested, so relative paths would break at any depth.
- **Three small scripts stay inline in the head** and must remain there, in this order: the `js` class, the Consent Mode defaults, then the Google tags. Consent has to be set before any Google script loads, so moving these into `site.js` would break consent.

### The GTM noscript iframe was removed on purpose

The standard GTM snippet includes a `<noscript>` iframe for visitors with JavaScript disabled. It was removed, because with JavaScript off the Consent Mode defaults never run, so any tag firing through that iframe would fire with no consent state at all. GA4 cannot work without JavaScript anyway, so the iframe cost nothing to drop and closed a compliance gap.

If GTM is ever used to fire real tags, set the default consent state inside the GTM container as well, under container settings, rather than relying only on the page script. Then the iframe can be restored safely.

## Editing

Before changing any copy, read the voice constraints in the accompanying copy and design brief. Two rules matter most. State a fact and let the reader draw the conclusion, because this audience distrusts self-description. And keep the plain-English rule, because most readers use English as a second language.

If the copy changes, update `sitemap.xml` `lastmod` and keep the structured data in step with the visible text.
