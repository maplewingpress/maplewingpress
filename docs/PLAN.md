# Website plan (Stage 1 proposal, Oct 8 2026)

## Visual direction
Boutique storybook press: warm paper background, walnut-ink text, maple russet for links and buttons, dry-samara gold for small accents only. Maplewing Dreams uses twilight blue as its series color. Fraunces for headings, Atkinson Hyperlegible for body text (designed for low-vision readers). Body text is 20px, buttons are at least 56px tall, and every text color passes WCAG AA (most pass AAA). No animation, no pop-ups, no stock imagery. Palette and fonts are placeholders from logo round one and change in one place (`assets/css/site.css`, `:root`).

## Navigation
Top bar: Coloring Stories (Dreams) · For Facilities · Book Bonuses · About. Maplewing Lane is a future concept and stays off the site until Tracy says otherwise (Oct 8). Footer: Contact & policies, printable pages, email. Plain words over brand names in the nav, so a first-time visitor knows where to click.

## Homepage wireframe
1. Header with samara mark and nav.
2. Hero: one sentence on what Maplewing makes, two buttons ("See the coloring stories", "I have a book"), cover image on the right.
3. Maplewing Dreams series card. Maplewing Press itself stays general, since other kinds of books may follow.
4. "One story, three ways to color": Easy, Easier, Easiest.
5. Two short paths: facilities, and book owners looking for printable pages.
6. Optional mailing-list box (hidden until the Kit form exists).
7. Footer.

## Implementation
- GitHub Pages builds the repo with Jekyll; no build tools for Tracy to run.
- Shared layout and one stylesheet; each page is a short file of words.
- Bonus pages share one template. Each has a `form_url` to fill in when the Google Form is ready; until then it shows a friendly "coming soon" note.
- The full-detail adult edition uses `/dreams/halloween/classic/print/` (short link `/halloween-classic/`). "Classic" appears only in the address, never as a book name.
- Short links (`/halloween-e1/` etc.) forward to the stable print URLs, for printing under the QR code.
- Nothing paid or private is ever committed.
- Oct 10: book download pages moved from `/eN/bonus/` to `/eN/print/` (Tracy). "Bonus" is reserved for the mailing-list extras. The old `/bonus/` addresses forward to the new ones.

## Stages
1. Foundation (this PR): layout, design tokens, home, nav, all Stage 1 pages, Halloween bonus pages.
2. Halloween launch: real cover art, Amazon links, Google Form per level, Kit signup, QR codes, then the custom domain (with approval).
3. Direct sales: Payhip checkout, facility license pages and protected delivery.
4. Catalog expansion: Monarch's Journey, Christmas, and other titles.

## Turning on GitHub Pages (Tracy approves first)
In the repo: Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`. With the `CNAME` file in place, the site appears at https://maplewingpress.com once DNS has spread.

## Connecting maplewingpress.com (Tracy approves first; not done yet)
1. GitHub org settings → Pages → "Add a verified domain": `maplewingpress.com`. GitHub shows one TXT record to add at Namecheap. This stops anyone else from claiming the domain on GitHub.
2. Namecheap → Domain List → Manage → Advanced DNS. Remove the default parking records (the `@` URL Redirect and `www` CNAME to parkingpage). Keep any Zoho mail (MX, SPF, DKIM) records. Add:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | maplewingpress.github.io. |
| TXT | (from step 1) | (from step 1) |

3. Repo Settings → Pages → Custom domain: `maplewingpress.com`, then tick "Enforce HTTPS" once it is offered.
4. Done in the repo (Tracy approved Oct 8): the `CNAME` file holds `maplewingpress.com`, and `_config.yml` uses `url: "https://maplewingpress.com"` with `baseurl: ""`.
