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
| `/dreams/halloween/e2/print/` | Printable pages, Halloween Easier |
| `/dreams/halloween/e3/print/` | Printable pages, Halloween Easiest |
| `/dreams/halloween/e1/print/` | Printable pages, Halloween Easy (book on hold; page kept) |
| `/dreams/halloween/classic/print/` | Printable pages, Halloween full-detail edition (shelved; "classic" is URL-only, never a book name) |
| `/halloween-e1/`, `/halloween-e2/`, `/halloween-e3/`, `/halloween-classic/` | Short links that forward to the print pages (easy to type from a book) |
| `/print/` | Find your book's printable pages |
| `/dreams/halloween/bonus/` | Mailing-list bonus: extra Halloween pages in all three levels, not in the book (no level in the address) |
| `/facilities/` | Facility licensing |
| `/about/`, `/contact/` | About; Contact and policies |

Older addresses still forward to the pages above, so nothing printed breaks: `/dreams/halloween/eN/bonus/` goes to `/dreams/halloween/eN/print/`, and `/bonuses/` goes to `/print/`.

**Words:** "printable pages" (at `/print/`) are the copies of the book's own pages that come with the book. "Bonus" means only the mailing-list extras: extra pages in all three levels that are not in the book.

## Common edits

- **Turn on a book's printable pages:** open `dreams/halloween/e2/print/index.html` (or e3, e1) and paste the Google Form link into `form_url: ""`.
- **Turn on the mailing list box:** paste the Kit form link into `kit_form_url` in `_config.yml`.
- **Add a new book:** copy the `dreams/halloween/` folder, rename it, and change the words.

## Rules for this repository

- This repository is public. Never add paid PDFs, facility files, order numbers, passwords or customer details. Downloads live in Google Drive (later Payhip or Shopify) and are linked from the pages.
- Domain and DNS changes are made only with Tracy's approval. See `docs/PLAN.md`.

## Preview on a computer (optional)

With Ruby and Jekyll installed: `jekyll serve`, then open http://localhost:4000.
