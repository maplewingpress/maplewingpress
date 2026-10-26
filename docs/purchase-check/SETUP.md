# Purchase check: setup

Three things to copy and paste, and one link to send back. No IDs to look up.

The QR code in each book opens that level's printable-pages page (`/dreams/halloween/e1/print/`, `e2`, `e3`). The page thanks the reader and asks for a short purchase check. The check runs as a small Google Apps Script in Tracy's own Google account:

1. The reader picks Amazon, a store, or a gift, and types the order or receipt number. Store and gift readers can add a photo of the receipt (or gift receipt) instead.
2. The script saves any photo in a private Drive folder ("Maplewing receipt photos") and reads it with Google's free text reader (OCR): store, date and receipt number.
3. Every check becomes one row in the sheet.
4. The same order or receipt number opens a book's pages **three times**. The fourth try shows: "This receipt has already been used three times. If you need to download your pages again, please email support@maplewingpress.com and we will help."
5. When the check passes, the page shows the Drive download button and the two book-owner links (Family Set $15, facility license $36), with a note to bookmark the page. The page remembers the check on that phone or computer, so coming back to the bookmark opens the download straight away and doesn't use up a check.

The download links and the book-owner links live only in this script, never on the website.

## The steps

### 1. Open the sheet
Open **Maplewing Purchase Checks** in Drive › MapleWing › Website. Claude made it on Oct 26 with the right headings, so there is nothing to set up in it. (If you made another sheet of your own, you can delete it. You never need a sheet ID: the script lives inside this sheet and writes to it by itself.)

One sheet holds every book. Each row names the book and the level, so you can sort or filter by book.

### 2. Paste in the script
1. In that sheet, choose **Extensions** › **Apps Script**. A code window opens in a new tab.
2. Where it says the project name (top left, probably "Untitled project"), type **Maplewing purchase check**.
3. Select everything in the code box and delete it. Paste in all of `Code.gs` (the file beside this one). Click the save icon.
4. Click the **+** next to **Files** (top left) › **Script**. Name it **Links** and press enter.
5. Delete what's in that new box, and paste in all of `Links.gs` (in the same folder as these steps, and in Drive). That file holds your private links, so it is never in the website's code. Click save.
6. On the left, click **+** next to **Services**, choose **Drive API**, set the version to **v2**, and click **Add**. (This turns on the receipt reader.)

### 3. Publish it
1. Click **Deploy** (top right) › **New deployment**. Click the gear next to "Select type" and choose **Web app**.
2. Description: **Purchase check**. Execute as: **Me**. Who has access: **Anyone**.
3. Click **Deploy**, then **Authorize access**, and pick your Google account. Google warns that the app isn't verified, because you wrote it yourself: click **Advanced** › **Go to Maplewing purchase check (unsafe)** › **Allow**.
4. Copy the **Web app URL** (it ends in `/exec`) and send it in the Website thread.

That's everything. Claude puts the link in the website, tests all three levels on a phone, and the QR pages switch from "Coming soon" to the check.

## What it can and can't do

- Amazon numbers are checked for the right shape (17 numbers) and for reuse. Nobody outside Amazon can confirm that an order is real.
- A blurry or folded receipt photo may not read. The photo is still saved, so you can look at it from the sheet.
- A gift needs a gift receipt number or photo, like any other receipt. A reader with no gift receipt is asked to email support@maplewingpress.com.
- One Amazon order can include all three books, so each book and level counts its own three uses.
- The page only remembers a reader on the same phone or computer and browser. On a new device, or after clearing the browser, they check again, and that counts as a use.
- Nothing is emailed. The "already used" message shows on the screen.

## Adding the next book (Christmas and after)
1. In `Code.gs`, add a line to `BOOKS`, for example `CHRISTMAS: 'Christmas Coloring Story'`.
2. In `Links.gs`, add that book's three download links: `DOWNLOAD_CHRISTMAS_E1`, `_E2`, `_E3`.
3. Redeploy (below). Claude sets `book_code: christmas` on the new book's pages.

Nothing else changes: the same sheet, the same web app link, the same QR pages.

## Later changes
- To change a link, or the number of uses (`MAX_USES` at the top of `Code.gs`), edit and save, then **Deploy** › **Manage deployments** › pencil › Version: **New version** › **Deploy**. The web app link stays the same.
- To let someone download again, find their rows in the sheet and add "-reset" to the end of each Purchase key. Their next check counts from one.
