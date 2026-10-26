# Purchase check: setup (about 10 minutes, free)

The QR code in each book opens that level's printable-pages page (`/dreams/halloween/e1/print/`, `e2`, `e3`). The page thanks the reader and asks for a short purchase check. The check runs as a small Google Apps Script in Tracy's own Google account:

1. The reader picks Amazon, a store, or a gift, and types the order or receipt number. Store and gift readers can add a photo of the receipt (or gift receipt) instead.
2. The script saves any photo in a private Drive folder ("Maplewing receipt photos") and reads it with Google's free text reader (OCR): store, date and receipt number.
3. Every check becomes one row in the Google Sheet "Purchase checks".
4. The same order or receipt number opens each level's pages **twice**. The third try shows: "This receipt has already been used twice. If you need to download your pages again, please email support@maplewingpress.com and we will help."
5. When the check passes, the page shows the Drive download button and the two book-owner links (Family Set $15, facility license $36).

The Drive links and the book-owner links live only in the script, never on the website.

## What it can and can't do

- Amazon numbers are checked for the right shape (17 numbers) and for reuse. Nobody outside Amazon can confirm that an order is real.
- A blurry or folded receipt photo may not read. The photo is still saved, so you can look at it in the Sheet.
- A gift needs a gift receipt number or photo, like any other receipt. A reader with no gift receipt is asked to email support@maplewingpress.com.
- One Amazon order can include all three books, so each level counts its own two uses.
- Nothing is emailed. The "already used" message shows on the screen.

## Steps

### 1. Make the Sheet
1. Go to sheets.google.com and make a blank spreadsheet. Name it **Maplewing Purchase Checks**.
2. Copy its ID from the address bar: the long part between `/d/` and `/edit`.

### 2. Make the script
1. Go to script.google.com and click **New project**. Name it **Maplewing purchase check**.
2. Delete what's in the editor and paste everything from `Code.gs` (in this folder). Click the save icon.
3. On the left, click **+** next to **Services**, choose **Drive API**, set the version to **v2**, and click **Add**. (This turns on the receipt reader.)

### 3. Add the private links
Click the gear (**Project Settings**), scroll to **Script Properties**, and add these:

| Property | Value |
| --- | --- |
| `SHEET_ID` | the Sheet ID from step 1 |
| `DOWNLOAD_E1` | Easy download link (`https://drive.google.com/uc?export=download&id=1RPBFmLKrkJVkMQ0bo0B97iC4i6QzqO-Q`) |
| `DOWNLOAD_E2` | Easier download link (`https://drive.google.com/uc?export=download&id=1ACxRdAj1AvyTKmRkTwhlGCJR_jmtE1a-`) |
| `DOWNLOAD_E3` | Easiest download link (`https://drive.google.com/uc?export=download&id=1oEVvyiiPNURp5prUTeCampPksvMbNrnH`) |
| `OWNER_FAMILY_SET` | `https://payhip.com/b/i5vnX` |
| `OWNER_FACILITY` | `https://payhip.com/b/s3Ru7` |

If the Payhip thread makes new book-owner PDFs, swap their links in here. No website change is needed.

### 4. Publish it
1. Click **Deploy** › **New deployment**. Click the gear next to "Select type" and choose **Web app**.
2. Description: **Purchase check**. Execute as: **Me**. Who has access: **Anyone**.
3. Click **Deploy**, then **Authorize access**, and pick your Google account. Google warns that the app isn't verified because you wrote it yourself: click **Advanced** › **Go to Maplewing purchase check** › **Allow**.
4. Copy the **Web app URL** (it ends in `/exec`) and send it in the Website thread.

Claude puts that URL in `purchase_check_url` in `_config.yml`, tests each level on a phone, and the QR pages switch from "Coming soon" to the check.

## Later changes
- To change the number of uses, edit `MAX_USES` at the top of the script, then **Deploy** › **Manage deployments** › pencil › Version: **New version** › **Deploy**. The URL stays the same.
- To let someone download again, find their rows in the Sheet and add "-reset" to the end of each Purchase key. Their next check counts from one.
