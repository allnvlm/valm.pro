# valm.pro

Personal site for Allan Valm, AI Augmentation Partner. One static page, no build step, no dependencies.

Live at https://valm.pro

## Files

| File | Purpose |
|---|---|
| `index.html` | The main page. Inline CSS and JS, no build step. |
| `privacy.html` | Privacy notice. Reuses the same head and stylesheet as `index.html`. |
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

Seven events are sent through `gtag`, so Consent Mode governs them. With consent denied they travel as cookieless pings and set nothing on the device.

| Event | Parameters | What it answers |
|---|---|---|
| `section_view` | `section` | How far people read. Fires once per section: `patterns`, `what_you_get`, `honest_part`, `how_it_starts`, `track_record`, `first_session`, `contact` |
| `cta_click` | `location` (`nav`, `hero`) | Which call to action moved them |
| `contact_start` | none | Someone put the cursor in the form |
| `contact_error` | `fields` | Which fields failed validation, so friction is visible |
| `generate_lead` | `method` (`contact_form`, `email_fallback`) | The conversion. A GA4 recommended event name, so it appears in standard reports |
| `contact_send_failed` | none | The provider rejected a submission. Watch this one, because it means a lost lead |
| `contact_link_click` | `method` (`email`, `phone`, `linkedin`) | People who skip the form |

**The question this is built to answer.** Pair `section_view` with `generate_lead` in an exploration. If visitors who reach `track_record` convert at a higher rate than those who do not, the evidence is doing work and more of it is worth adding. If the rate is flat, the page converts on the offer alone. That is a real strategic question rather than a vanity metric.

**Mark `generate_lead` as a key event** in GA4 under Admin, Events, so it appears as a conversion.

**Two things to avoid.** GA4 enhanced measurement already tracks outbound clicks and 90 percent scroll, so no custom events duplicate those. It can also track form interactions automatically, which would double-count against `contact_start` and `generate_lead`. If form interaction tracking is enabled in the data stream, turn it off. And since GTM is present alongside gtag, do not rebuild these events as GTM tags for the same property.

## Contact form

Every call to action scrolls to the form in the closing panel. The form collects a name, an email address, an optional organisation and sector, and the decision the visitor is weighing. That last field is deliberate. It keeps the qualification step that the old prefilled email created.

The form needs a backend, because GitHub Pages serves static files only. One line controls this, near the bottom of `index.html`:

```js
var ENDPOINT = '';
```

While it is empty the form validates the input and then opens a prefilled email, so the button is never dead. Set it to the provider's endpoint and the form posts JSON instead:

```json
{ "name": "...", "email": "...", "organisation": "...", "decision": "..." }
```

**Choosing a provider.** The only criteria that matter here are EU data residency and a signed data processing agreement, because the site's whole argument is about handling regulated data properly. Verify both on the provider's own legal pages rather than in a comparison article, since most of those are written by the vendors being compared. Self-hosting the handler is the other option if full control is wanted.

Spam is handled without a CAPTCHA: a hidden honeypot field and a check that the form was not submitted within three seconds of loading. No third-party bot service, and no extra processor.

Once a provider is chosen, name it in `privacy.html` under "The contact form", where a placeholder sentence is waiting.

## Privacy notice

`privacy.html` is a draft written for review by someone qualified, not legal advice. Three things in it need confirming against reality before relying on it:

1. **GA4 retention.** The text says the data is deleted after the retention period set in the property. Check that period in GA4 under Admin, Data collection and modification, Data retention, then state the actual figure.
2. **Postal address.** Only a city, an email and a phone number are given. A full postal address is the usual expectation for a data controller, so decide whether to add one.
3. **Accuracy over time.** If any tag, tool or host changes, the notice changes with it, along with the date at the top.

## Editing

Everything lives in `index.html`. The CSS variables at the top hold the whole design system, so colour and spacing changes happen in one place.

Before changing any copy, read the voice constraints in the accompanying copy and design brief. Two rules matter most. State a fact and let the reader draw the conclusion, because this audience distrusts self-description. And keep the plain-English rule, because most readers use English as a second language.

If the copy changes, update `sitemap.xml` `lastmod` and keep the structured data in step with the visible text.
