# Khalid Allewa Lawyers and Consultants (خالد اللواء محامون ومستشارون) — website (demo)

A bilingual (Arabic RTL / English LTR) one-page website with an employee-login placeholder.
Plain HTML, CSS and JavaScript — no framework, no build step. The `public/` folder is the whole site.

> **Draft status:** the logo, colours, fonts, team names, office photos, phone and email are the firm's own.
> Still placeholders: the licence and registration numbers, client logos, bios, years of experience, working hours,
> some About text, and the policies page (a draft for the firm to approve). The site tells search engines not to
> index it until launch (see *Before launch* below).
>
> The site calls the firm a **company (شركة)**. That is only correct if it is registered with the Ministry of Commerce
> as a professional company; otherwise switch the wording back to **office (مكتب)** before launch.

## Folder structure

```
public/                    ← upload / publish this folder
├── index.html             Home · About · Team · Practice areas · How we work · Clients · Licences · FAQ · Contact
├── legal.html             Privacy policy · Terms of use · Disclaimer (draft, bilingual)
├── login.html             Employee login placeholder (phase 2)
├── 404.html               "Page not found"
├── _headers               Cloudflare Pages security headers
├── robots.txt
├── favicon.svg
├── css/style.css          All design (colours and fonts are at the top, in :root)
├── js/boot.js             Picks the language and display options before the page is drawn
├── js/i18n.js             Language engine (fills in text, switches RTL/LTR)
├── js/main.js             Menu, cards, stats, scroll effects, demo contact form
├── data/settings.js       Phone, WhatsApp, email, map, years, team, licence numbers, client logos
├── data/ar.js             ALL Arabic text
├── data/en.js             ALL English text
└── images/                Official logo (SVG), team photos, background pattern, link-preview image
```

## Changing content (no design files involved)

| To change… | Edit |
|---|---|
| Any text (headings, paragraphs, buttons, form labels, footer) | `data/ar.js` and `data/en.js` — same keys in both |
| Phone, WhatsApp, email, map link, years of experience | `data/settings.js` |
| "How we work" steps, FAQ questions, bottom phone bar labels | `process`, `faq`, `mobileBar` in both language files (add or remove items freely) |
| Team members: add, remove or reorder | `data/settings.js` → `team`, then add the text under `team.members` in both language files with the same `id` |
| Team photos | Put the photo in `images/team/` and write its path in `data/settings.js` (e.g. `photo: "images/team/khalid.jpg"`). Portrait, about 700×900 px. Empty `""`: a Leadership card shows a placeholder, a team card shows the person's initial (`initial` in the language files) |
| Office photos | `images/office/`: the hero photo (`hero-office.jpg`), the About photo and the two photos beside the map are set in `index.html` (search for `images/office/`) |
| Licence and registration numbers | `data/settings.js` → `licence`: fill `number` for each (Ministry of Justice licence, SBA membership, SBA legal-establishment record, unified national number / CR, VAT). Empty shows "to be added". `link` is the official page the "verify" button opens. The cards' wording is under `licence` in both language files; the footer repeats the licence and unified numbers |
| Client / partner logos | Put the logo in `images/clients/` (transparent PNG or SVG) and set `logo` and `name` in `data/settings.js` → `clients`. Empty `logo` shows a placeholder shape. Show an organisation only with its written consent (Code of Professional Conduct) |
| Privacy policy, terms, disclaimer | `legalPage` in both language files (`legal.html`). Text in `[ ]` is for the firm to complete; the firm should review the whole text before launch |
| Practice areas | `data/settings.js` → `practiceAreas` (order and icon) + `practice.areas` in both language files |
| Logo | `images/logo-ar.svg` / `logo-en.svg` (white, header and footer; in the Arabic one the emblem sits on the right), `logo-mark.svg` (silver emblem, spare), `logo-mark-dark.svg` (404 page), `favicon.svg`. All drawn from the official Arabic_Logos.pdf / English_Logos.pdf. File names are set under `logos` in `data/settings.js` |
| Live Google map | Google Maps → Share → *Embed a map* → copy only the `src="…"` link into `mapEmbed` in `data/settings.js` |
| Default language | `defaultLanguage` in `data/settings.js` (`"ar"` or `"en"`) |
| Colours / fonts | Top of `css/style.css` (`:root`). Brand palette: Charcoal Gray `#36454F`, Brushed Silver `#C0C0C0`, Pure White `#FFFFFF`. Fonts (chosen by the client): IBM Plex Sans Arabic for Arabic, Inter for English, loaded from Google Fonts in each page `<head>` |

Editing rules for the data files: change only the text inside the quotes `"…"`, and keep every
comma, bracket and key name. If text needs a double quote inside it, use the Arabic/curly quotes
(«» or “ ”) instead. After editing, reload the page; if a section goes blank, a comma or quote is
probably missing in the file you just changed (the browser console shows the line).

Useful links: `?lang=en` or `?lang=ar` at the end of the address opens the site in that language.

## Display options (demo)

The **Display options** button in the grey strip at the top opens a panel with: light / dark mode, three colour
schemes (Official charcoal & silver, Navy & gold, Green & bronze) and three shapes (Soft, Sharp, Round).
Choices apply at once and are remembered on that device. A link can open a given look directly, e.g.
`?accent=navy&theme=dark&shape=sharp` (values: `theme` light/dark, `accent` official/navy/green, `shape` soft/sharp/round).

All of it is CSS custom properties: the defaults in `:root` and the variations in section 1b of `css/style.css`.
To make one choice the permanent look, copy its values into `:root` (or keep the panel and only remove the strip).
The panel lives in the demo strip, so `showDemoBanner: false` removes it.

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

- [ ] Confirm the legal form: "شركة" (professional company) or "مكتب" (office), and adjust the wording
- [ ] Fill the licence / registration numbers and the firm's own SBA directory link in `data/settings.js` → `licence`
- [ ] Real client logos (with each client's written consent), or remove the section (set `clients: []`)
- [ ] The firm reviews and approves the policies page (`legalPage` in both language files) and fills the `[ ]` parts
- [ ] Replace the remaining placeholders: bios, years, hours and the About text marked as temporary
- [ ] Choose the final display option (or keep official) and decide whether to keep the panel
- [ ] `showDemoBanner: false` in `data/settings.js`
- [ ] Remove the `<meta name="robots" content="noindex, nofollow">` line from `index.html`, `legal.html` and `login.html`
- [ ] Remove the `X-Robots-Tag` line from `public/_headers`
- [ ] In `public/robots.txt`, change `Disallow: /` to `Allow: /`
- [ ] Connect the contact form (phase 2)

## Phase 2 (not built yet)

- **Contact form:** currently checks the fields and shows a "demo" message; nothing is sent.
  It can be connected to a Cloudflare Pages Function (email via Cloudflare Email Routing) or a
  form service such as Formspree or Web3Forms — see `setupForm()` in `js/main.js`.
- **Employee login:** `login.html` is a disabled placeholder. A real portal needs a backend
  (e.g. Cloudflare Access for staff sign-in, or Pages Functions with a database).
