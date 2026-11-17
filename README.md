# HealMent website

Landing page for the HealMent journaling app. Live at https://healment.cend.in/

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home page |
| `privacy_policy.html` | Privacy Policy |
| `terms_of_service.html` | Terms of Service |
| `contact.html` | Contact |
| `404.html` | Shown when a page is not found |

## Reusing this for other app landing pages

Every mobile app landing page uses the same footer and the same three extra pages:

- Footer: logo, copyright line, links (Features, Privacy Policy, Terms of Service, Contact), then
  "App & website designed and developed by Srikanth Nandiraju · Talk to the digital twin of Srikanth Nandiraju".
- Pages: `privacy_policy.html`, `terms_of_service.html`, `contact.html` (same file names on every site).

To start a new site, copy this folder, then change: the app name, store links, screenshots, the web address
(`healment.cend.in` appears in every page, `sitemap.xml`, `robots.txt`, `llms.txt` and `CNAME`), and re-read the
privacy and terms text so it matches the new app.

## Animations

The moving illustration in the download section is a Lottie file in `assets/lottie/` (from the UI8 "Whoooa!" pack).
It loads only when you scroll near it. To swap it, replace the file and keep the same name.

## Icons

The colourful feature icons in `assets/icons/` come from the UI8 "150 Mental Health Icons" pack (Flat style).

## Updating the app screenshots

Replace the `screen-*.webp` files in `assets/images/` and keep the same sizes. See `SCREENSHOTS_GUIDE.md`.
