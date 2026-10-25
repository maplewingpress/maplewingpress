# Maplewing Press website

The public website for Maplewing Press (maplewingpress.com), built as a plain static site for GitHub Pages.

## How it works

- GitHub Pages builds this folder with Jekyll automatically. There is nothing to install and no build step.
- Every page shares one look from `_layouts/default.html` (header, nav, footer) and one stylesheet, `assets/css/site.css`.
- Colors and fonts live at the top of `site.css` under `:root`. Change them there and the whole site follows.
- Site-wide settings (emails, the optional MailerLite form link) are in `_config.yml`.

## Page map (stable URLs; QR codes depend on these, so never rename them)

| URL | Page |
| --- | --- |
| `/` | Home |
| `/dreams/` | Maplewing Dreams (coloring stories) |
| `/dreams/coloring-together/` | Tips for coloring together (families and care teams) |
| `/dreams/printing-tips/` | Printing and coloring tips (printers, paper, dry media) |
| `/faq/` | Questions and answers (books, printable pages, mailing list, facilities) |
| `/dreams/halloween/` | Halloween collection |
| `/dreams/halloween/e2/print/` | Printable pages, Halloween Easier |
| `/dreams/halloween/e3/print/` | Printable pages, Halloween Easiest |
| `/dreams/halloween/e1/print/` | Printable pages, Halloween Easy |
| `/dreams/halloween/classic/print/` | Printable pages, Halloween full-detail edition (shelved; "classic" is URL-only, never a book name) |
| `/halloween-e1/`, `/halloween-e2/`, `/halloween-e3/`, `/halloween-classic/` | Short links that forward to the print pages (easy to type from a book) |
| `/print/` | Find your book's printable pages |
| `/facilities/` | Facility licensing |
| `/about/`, `/contact/` | About; Contact and policies |

Older addresses still forward to the pages above, so nothing printed breaks: `/dreams/halloween/eN/bonus/` goes to `/dreams/halloween/eN/print/`, and `/bonuses/` goes to `/print/`.

**Words:** "printable pages" (at `/print/`) are the copies of the book's own pages that come with the book. "Bonus" means only the mailing-list extras: extra pages in all three levels that are not in the book.

## Common edits

- **Turn on the printable pages (purchase check):** set up the Google Apps Script in `docs/purchase-check/` (steps in `SETUP.md`), then paste its web app link into `purchase_check_url` in `_config.yml`. The script, not this repository, holds the Drive download links and the book-owner Payhip links. Each page sends its `level_code` (E1, E2, E3).
- **Mailing list (MailerLite):** the signup forms are the site's own forms (`_includes/ml-form.html`), styled like the site, that post straight to MailerLite. No form design is needed in MailerLite. Each printable-pages page has its own form id in `signup_form_id` (its level group). The facilities page uses `open_notify_form_id` and `collection_notify_form_id`. The general invitation on every other page (a band above the footer and a box that slides in from the side) uses `signup_form_id` in `_config.yml`. A blank id hides that form. The account number is `mailerlite_account`.
- **Add a new book:** copy the `dreams/halloween/` folder, rename it, and change the words.

## Rules for this repository

- This repository is public. Never add paid PDFs, facility files, order numbers, passwords or customer details. Downloads live in Google Drive (later Payhip or Shopify) and are linked from the pages.
- Domain and DNS changes are made only with Tracy's approval. See `docs/PLAN.md`.

## Preview on a computer (optional)

With Ruby and Jekyll installed: `jekyll serve`, then open http://localhost:4000.
