/**
 * Maplewing Press purchase check (Google Apps Script web app).
 *
 * The printable-pages pages (/dreams/halloween/eN/print) send this the buyer's
 * order number or a photo of their receipt. It reads the receipt with Google's
 * free OCR, logs the purchase in the "Purchase checks" sheet, counts how many
 * times that order or receipt has been used, and answers with the download link
 * (first three uses) or a "this receipt has been used" message (fourth use on).
 *
 * Nothing private lives in the website: the Drive download links and the hidden
 * book-owner Payhip links are kept in this script's Script Properties.
 *
 * Setup: see docs/purchase-check/SETUP.md.
 */

var MAX_USES = 3;            // a receipt or order number unlocks the pages this many times
var SHEET_NAME = 'Purchase checks';
var RECEIPT_FOLDER = 'Maplewing receipt photos';
var LEVELS = { E1: 'Easy', E2: 'Easier', E3: 'Easiest' };
// Every book the check knows, by the book_code on its printable-pages pages. Add a line
// for each new book, then add its DOWNLOAD_<BOOK>_<LEVEL> links in Script Properties.
var BOOKS = { HALLOWEEN: 'Halloween Coloring Story' };

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return json_(check_(data));
  } catch (err) {
    console.error(err);
    return json_({ ok: false, reason: 'error' });
  }
}

function check_(data) {
  var level = String(data.level || '').toUpperCase();
  var book = String(data.book || '').toUpperCase();
  if (!LEVELS[level] || !BOOKS[book]) return { ok: false, reason: 'error' };

  var source = String(data.source || '').slice(0, 20);      // amazon | store | gift
  var typed = clean_(data.number);
  var store = clean_(data.store);
  var date = clean_(data.date);
  var ocrText = '';
  var photoUrl = '';

  var photoHash = '';
  if (data.photo) {
    var saved = savePhoto_(data.photo, book + '-' + level);
    photoUrl = saved.url;
    photoHash = saved.hash;
    ocrText = saved.text;
    var found = readReceipt_(ocrText);
    if (!typed) typed = found.number;
    if (!store) store = found.store;
    if (!date) date = found.date;
  }

  // Amazon numbers count the same with or without dashes or spaces.
  var a = typed.match(/(?:^|\D)(\d{3})[\s-]?(\d{7})[\s-]?(\d{7})(?:\D|$)/);
  var amazon = a ? a[1] + '-' + a[2] + '-' + a[3] : '';
  if (amazon) source = 'amazon';

  if (source === 'amazon' && !amazon) return { ok: false, reason: 'amazon_format' };
  if (source === 'store' && !typed && !photoUrl) return { ok: false, reason: 'need_details' };
  // Tracy, Oct 26: gifts need a gift receipt number or photo too.
  if (source === 'gift' && !typed && !photoUrl) return { ok: false, reason: 'need_gift' };

  // The purchase key is what the use limit counts: the book and level plus the order
  // or receipt number, or (when a photo has no readable number) the photo itself. One
  // Amazon order can hold several books, so each book and level counts on its own.
  var id = amazon || (typed ? normalize_(typed) : (photoHash ? 'PHOTO-' + photoHash : ''));
  var key = id ? book + ' ' + level + ' ' + id : '';

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = sheet_();
    var uses = key ? countUses_(sheet, key) : 0;
    var allowed = uses < MAX_USES;
    sheet.appendRow([new Date(), BOOKS[book], LEVELS[level], source, key, typed, store, date,
      uses + 1, allowed ? 'download shown' : 'blocked', photoUrl, ocrText.slice(0, 500)]);
  } finally {
    lock.releaseLock();
  }

  if (!allowed) return { ok: false, reason: 'used' };

  var p = PropertiesService.getScriptProperties();
  return {
    ok: true,
    link: p.getProperty('DOWNLOAD_' + book + '_' + level),
    family: p.getProperty('OWNER_FAMILY_SET'),
    facility: p.getProperty('OWNER_FACILITY')
  };
}

/** Saves the receipt photo privately in Drive and returns its OCR text. */
function savePhoto_(dataUrl, tag) {
  var m = String(dataUrl).match(/^data:(image\/[a-z+]+);base64,(.+)$/);
  if (!m) return { url: '', text: '', hash: '' };
  var bytes = Utilities.base64Decode(m[2]);
  var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, bytes)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('').slice(0, 16);
  var blob = Utilities.newBlob(bytes, m[1], tag + '-receipt-' + new Date().getTime() + '.jpg');
  var folders = DriveApp.getFoldersByName(RECEIPT_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(RECEIPT_FOLDER);
  var file = folder.createFile(blob);
  var text = '';
  try {
    // Drive's built-in OCR (Drive API v2 advanced service): copy the image as a Google Doc,
    // read its text, then delete the Doc. The photo itself stays in the private folder.
    var doc = Drive.Files.copy({ title: 'ocr-tmp', mimeType: MimeType.GOOGLE_DOCS }, file.getId(), { ocr: true });
    text = DocumentApp.openById(doc.id).getBody().getText();
    Drive.Files.remove(doc.id);
  } catch (err) {
    console.error('OCR failed: ' + err);
  }
  return { url: file.getUrl(), text: text, hash: hash };
}

/** Picks the store name, purchase date and order/receipt number out of receipt text. */
function readReceipt_(text) {
  var lines = text.split('\n').map(function (l) { return l.trim(); }).filter(String);
  var amazon = text.match(/\d{3}-\d{7}-\d{7}/);
  var labelled = text.match(/(?:order|receipt|trans(?:action)?|invoice|ref)\s*(?:#|no\.?|number|id)?\s*[:#]?\s*([A-Z0-9-]{4,})/i);
  var date = text.match(/\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|[A-Z][a-z]{2,8}\.? \d{1,2},? \d{4})\b/);
  return {
    number: amazon ? amazon[0] : (labelled ? labelled[1] : ''),
    store: amazon ? 'Amazon' : (lines[0] || ''),
    date: date ? date[1] : ''
  };
}

function countUses_(sheet, key) {
  var rows = sheet.getDataRange().getValues();
  var n = 0;
  for (var i = 1; i < rows.length; i++) if (String(rows[i][4]) === key) n++;
  return n;
}

function sheet_() {
  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['When', 'Book', 'Level', 'Bought from', 'Purchase key', 'Number given', 'Store',
      'Purchase date', 'Use number', 'Result', 'Receipt photo', 'Receipt text (start)']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(v) { return String(v || '').trim().slice(0, 120); }
function normalize_(v) { return v.toUpperCase().replace(/[^A-Z0-9]/g, ''); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
