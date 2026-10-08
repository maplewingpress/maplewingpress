# Maplewing Press website

The public website for Maplewing Press (maplewingpress.com), built as a plain static site for GitHub Pages.

## How it works

- GitHub Pages builds this folder with Jekyll automatically. There is nothing to install and no build step.
- Every page shares one look from `_layouts/default.html` (header, nav, footer) and one stylesheet, `assets/css/site.css`.
- Colors and fonts live at the top of `site.css` under `:root`. Change them there and the whole site follows.
- Site-wide settings (emails, the optional Kit form link) are in `_config.yml`.

## Page map (stable URLs; QR codes depend on these, so never rename them)

| URL | Page |
| --- | --- |
| `/` | Home |
| `/dreams/` | Maplewing Dreams (coloring stories) |
| `/dreams/halloween/` | Halloween collection |
| `/dreams/halloween/classic/bonus/` | Printable pages, Halloween full-detail edition ("classic" is URL-only, never a book name) |
| `/dreams/halloween/e1/bonus/` | Printable pages, Halloween Easy |
| `/dreams/halloween/e2/bonus/` | Printable pages, Halloween Easier |
| `/dreams/halloween/e3/bonus/` | Printable pages, Halloween Easiest |
| `/halloween-classic/`, `/halloween-e1/`, `/halloween-e2/`, `/halloween-e3/` | Short links that forward to the bonus pages (easy to type from a book) |
| `/facilities/` | Facility licensing |
| `/bonuses/` | Find your book's printable pages |
| `/about/`, `/contact/` | About; Contact and policies |

## Common edits

- **Turn on a bonus download:** open `dreams/halloween/e1/bonus/index.html` and paste the Google Form link into `form_url: ""`.
- **Turn on the mailing list box:** paste the Kit form link into `kit_form_url` in `_config.yml`.
- **Add a new book:** copy the `dreams/halloween/` folder, rename it, and change the words.

## Rules for this repository

- This repository is public. Never add paid PDFs, facility files, order numbers, passwords or customer details. Downloads live in Google Drive (later Payhip or Shopify) and are linked from the pages.
- Domain and DNS changes are made only with Tracy's approval. See `docs/PLAN.md`.

## Preview on a computer (optional)

With Ruby and Jekyll installed: `jekyll serve`, then open http://localhost:4000.
