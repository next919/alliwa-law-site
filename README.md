# Khalid Al-Liwa Lawyers & Legal Consultants — website (demo)

A bilingual (Arabic RTL / English LTR) one-page website with an employee-login placeholder.
Plain HTML, CSS and JavaScript — no framework, no build step. The `public/` folder is the whole site.

> **Draft status:** all names, bios, photos, the email, licence number, years of experience and
> working hours are placeholders. The site tells search engines not to index it until launch
> (see *Before launch* below).

## Folder structure

```
public/                    ← upload / publish this folder
├── index.html             Home · About · Team · Practice areas · How we work · FAQ · Contact
├── login.html             Employee login placeholder (phase 2)
├── 404.html               "Page not found"
├── _headers               Cloudflare Pages security headers
├── robots.txt
├── favicon.svg
├── css/style.css          All design (colours and fonts are at the top, in :root)
├── js/boot.js             Picks the language before the page is drawn
├── js/i18n.js             Language engine (fills in text, switches RTL/LTR)
├── js/main.js             Menu, cards, stats, scroll effects, demo contact form
├── data/settings.js       Phone, WhatsApp, email, map, years, team order & photos
├── data/ar.js             ALL Arabic text
├── data/en.js             ALL English text
└── images/                Logo, team photos, background pattern
```

## Changing content (no design files involved)

| To change… | Edit |
|---|---|
| Any text (headings, paragraphs, buttons, form labels, footer) | `data/ar.js` and `data/en.js` — same keys in both |
| Phone, WhatsApp, email, map link, years of experience | `data/settings.js` |
| "How we work" steps, FAQ questions, bottom phone bar labels | `process`, `faq`, `mobileBar` in both language files (add or remove items freely) |
| Team members: add, remove or reorder | `data/settings.js` → `team`, then add the text under `team.members` in both language files with the same `id` |
| Team photos | Put the photo in `images/team/` and write its path in `data/settings.js` (e.g. `photo: "images/team/khalid.jpg"`). Portrait, about 800×960 px. Empty `""` shows the placeholder |
| Practice areas | `data/settings.js` → `practiceAreas` (order and icon) + `practice.areas` in both language files |
| Logo | Replace `images/logo.svg` (or set `logo` in `data/settings.js` to a new file, e.g. a PNG) |
| Live Google map | Google Maps → Share → *Embed a map* → copy only the `src="…"` link into `mapEmbed` in `data/settings.js` |
| Default language | `defaultLanguage` in `data/settings.js` (`"ar"` or `"en"`) |
| Colours / fonts | Top of `css/style.css` (`:root`) |

Editing rules for the data files: change only the text inside the quotes `"…"`, and keep every
comma, bracket and key name. If text needs a double quote inside it, use the Arabic/curly quotes
(«» or “ ”) instead. After editing, reload the page; if a section goes blank, a comma or quote is
probably missing in the file you just changed (the browser console shows the line).

Useful links: `?lang=en` or `?lang=ar` at the end of the address opens the site in that language.

## Preview locally

Either double-click `public/index.html` (everything works from the file, fonts need internet), or run
a small local server from this folder:

```
python3 -m http.server 8080 --directory public
```

then open http://localhost:8080

## Hosting (Cloudflare Pages, deploys itself on every push)

This repository is connected to Cloudflare Pages, so publishing = pushing to `main`.
One-time setup in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git** (Import an existing Git repository)
2. Repository: `next919/alliwa-law-site` → **Begin setup**
3. Project name: `alliwa-law` (the link becomes `https://alliwa-law.pages.dev`)
4. Production branch: `main`
5. Framework preset: **None** · Build command: *(empty)* · Build output directory: `public`
6. **Save and Deploy**

**Client's own domain later:** Pages project → **Custom domains → Set up a custom domain** → enter the
domain and follow the DNS step Cloudflare shows. Then update the `og:image` address in `public/index.html`
to the new domain.

## Before launch

- [ ] Replace placeholder text, names, bios, photos, email, licence number, years and hours
- [ ] Real logo in `images/logo.svg`
- [ ] `showDemoBanner: false` in `data/settings.js`
- [ ] Remove the `<meta name="robots" content="noindex, nofollow">` line from `index.html` and `login.html`
- [ ] Remove the `X-Robots-Tag` line from `public/_headers`
- [ ] In `public/robots.txt`, change `Disallow: /` to `Allow: /`
- [ ] Connect the contact form (phase 2)

## Phase 2 (not built yet)

- **Contact form:** currently checks the fields and shows a "demo" message; nothing is sent.
  It can be connected to a Cloudflare Pages Function (email via Cloudflare Email Routing) or a
  form service such as Formspree or Web3Forms — see `setupForm()` in `js/main.js`.
- **Employee login:** `login.html` is a disabled placeholder. A real portal needs a backend
  (e.g. Cloudflare Access for staff sign-in, or Pages Functions with a database).
