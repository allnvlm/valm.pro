# valm.pro

Personal site for Allan Valm, AI Augmentation Partner. One static page, no build step, no dependencies.

Live at https://valm.pro

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole site. Inline CSS and JS, no build step. |
| `portrait.jpg` | Portrait shown in the Who I am section, 840px wide. |
| `allan-valm.jpg` | Larger portrait referenced by the structured data. |
| `allan-valm-og.jpg` | Social share card, 1200 x 630. |
| `robots.txt` | Allows Google plus the AI crawlers. Points to the sitemap. |
| `sitemap.xml` | Single URL. Update `lastmod` when the page changes. |
| `CNAME` | Custom domain. Must contain exactly `valm.pro`. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |

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

## Editing

Everything lives in `index.html`. The CSS variables at the top hold the whole design system, so colour and spacing changes happen in one place.

Before changing any copy, read the voice constraints in the accompanying copy and design brief. Two rules matter most. State a fact and let the reader draw the conclusion, because this audience distrusts self-description. And keep the plain-English rule, because most readers use English as a second language.

If the copy changes, update `sitemap.xml` `lastmod` and keep the structured data in step with the visible text.
