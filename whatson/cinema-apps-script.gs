/**********************************************************************
 * BANSHEE LABYRINTH — CINEMA LISTINGS  (Google Apps Script web app)
 *
 * Stores the films the manager enters on cinema-edit.html, and serves
 * them to the Cinema board (board.html?mode=cinema).
 *
 * ── SETUP ───────────────────────────────────────────────────────────
 * 1. Open a Google Sheet (any sheet — a fresh blank one is fine).
 * 2. Extensions ▸ Apps Script. Delete the sample code, paste this in.
 * 3. Set MANAGER_PIN below to your chosen PIN.
 * 4. Deploy ▸ New deployment ▸ type "Web app".
 *      - Description: Cinema listings
 *      - Execute as:  Me
 *      - Who has access:  Anyone
 *    Click Deploy, authorise, and COPY the Web app URL (ends in /exec).
 * 5. Paste that /exec URL into:
 *      - board.html        →  CONFIG.CINEMA_API
 *      - cinema-edit.html  →  CINEMA_API
 * 6. Re-deploy after any edit (Deploy ▸ Manage deployments ▸ edit ▸ Deploy)
 *    or it'll keep serving the old version.
 *
 * ── CHANGELOG ───────────────────────────────────────────────────────
 * cinema-url-support-v1:
 *   • Added "url" column — returned in every listing
 *   • ?action=debug endpoint to confirm deployment
 *   • Tolerant column-name matching (url/link/event url/etc.)
 *   • fmtTime_ now also handles string time values
 *********************************************************************/

const MANAGER_PIN = "1234";        // ← change this to your PIN
const SHEET_NAME  = "Cinema";      // tab this script reads/writes

/* ── Column-name aliases for tolerant matching ── */
var URL_ALIASES_ = ["url","link","event url","event link","booking url"];
var IMG_ALIASES_ = ["image","image url","poster","poster url","drive link"];

function doGet(e) {
  var params = (e && e.parameter) || {};

  /* ── debug endpoint: proves the new deployment is live ── */
  if (String(params.action) === "debug") {
    var sh = sheet_();
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
                    .map(function(h){ return String(h).trim(); });
    return json_({
      apiVersion: "cinema-url-support-v1",
      columns: headers,
      rowCount: Math.max(0, sh.getLastRow() - 1),
      timestamp: new Date().toISOString()
    });
  }

  return json_(listRows_());
}

function doPost(e) {
  var p = {};
  try { p = JSON.parse(e.postData.contents); } catch (err) { p = (e && e.parameter) || {}; }

  if (String(p.pin) !== String(MANAGER_PIN)) return json_({ ok:false, error:"pin" });

  var sh = sheet_();
  var cm = colMap_(sh);

  if (p.action === "delete") {
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][cm.id]) === String(p.id)) sh.deleteRow(i + 1);
    }
    return json_({ ok:true });
  }

  // default: save (update if id matches, else append)
  var id = p.id || Utilities.getUuid();

  // Build a row array sized to the sheet's column count
  var rec = [];
  for (var c = 0; c < cm.totalCols; c++) rec.push("");

  rec[cm.id]      = id;
  rec[cm.date]    = p.date || "";
  rec[cm.time]    = p.time || "";
  rec[cm.title]   = p.title || "";
  rec[cm.year]    = p.year || "";
  rec[cm.cert]    = p.cert || "";
  rec[cm.blurb]   = p.blurb || "";
  rec[cm.by]      = p.by || "";
  rec[cm.updated] = new Date();
  if (cm.image >= 0) rec[cm.image] = p.image || "";
  if (cm.url   >= 0) rec[cm.url]   = p.url || p.link || "";

  var data = sh.getDataRange().getValues();
  var rowToUpdate = -1;
  for (var j = 1; j < data.length; j++) {
    if (String(data[j][cm.id]) === String(id)) { rowToUpdate = j + 1; break; }
  }
  if (rowToUpdate > 0) sh.getRange(rowToUpdate, 1, 1, rec.length).setValues([rec]);
  else sh.appendRow(rec);

  return json_({ ok:true, id:id });
}

/* ================================================================
   HELPERS
   ================================================================ */

/** Get or create the Cinema sheet, ensuring url column exists. */
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["id","date","time","title","year","cert","blurb","by","updated","image","url"]);
    return sh;
  }
  // Safely add "url" column if it's missing on an existing sheet
  ensureCol_(sh, "url", URL_ALIASES_);
  return sh;
}

/** Add a column header if no alias of it already exists. */
function ensureCol_(sh, name, aliases) {
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i]).trim().toLowerCase().replace(/[_\-]/g, " ");
    for (var j = 0; j < aliases.length; j++) {
      if (h === aliases[j]) return; // already exists under this alias
    }
  }
  // None found — add it after the last column
  sh.getRange(1, headers.length + 1).setValue(name);
}

/** Build a map of logical field names → column indices, tolerant of aliases. */
function colMap_(sh) {
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var lc = {};
  for (var i = 0; i < headers.length; i++) {
    lc[String(headers[i]).trim().toLowerCase().replace(/[_\-]/g, " ")] = i;
  }

  function find(aliases, fallback) {
    for (var j = 0; j < aliases.length; j++) {
      if (lc[aliases[j]] !== undefined) return lc[aliases[j]];
    }
    return fallback;
  }

  return {
    totalCols: headers.length,
    id:      lc["id"]      !== undefined ? lc["id"]      : 0,
    date:    lc["date"]    !== undefined ? lc["date"]    : 1,
    time:    lc["time"]    !== undefined ? lc["time"]    : 2,
    title:   lc["title"]   !== undefined ? lc["title"]   : 3,
    year:    lc["year"]    !== undefined ? lc["year"]    : 4,
    cert:    lc["cert"]    !== undefined ? lc["cert"]    : 5,
    blurb:   lc["blurb"]   !== undefined ? lc["blurb"]   : 6,
    by:      lc["by"]      !== undefined ? lc["by"]      : 7,
    updated: lc["updated"] !== undefined ? lc["updated"] : 8,
    image:   find(IMG_ALIASES_, 9),
    url:     find(URL_ALIASES_, -1)
  };
}

/** Return all listings as JSON, including url + link fields. */
function listRows_() {
  var sh = sheet_();
  var cm = colMap_(sh);
  var rows = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[cm.title]) continue; // skip rows with no title
    var urlVal = cm.url >= 0 ? String(r[cm.url] || "") : "";
    out.push({
      id:    String(r[cm.id]),
      date:  fmtDate_(r[cm.date]),
      time:  fmtTime_(r[cm.time]),
      title: String(r[cm.title]),
      year:  String(r[cm.year] || ""),
      cert:  String(r[cm.cert] || ""),
      blurb: String(r[cm.blurb] || ""),
      image: cm.image >= 0 ? String(r[cm.image] || "") : "",
      url:   urlVal,
      link:  urlVal          // alias so board.html can use either name
    });
  }
  return out;
}

function fmtDate_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  return String(v || "");
}
function fmtTime_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), "HH:mm");
  // Fallback: extract HH:MM from a string like "20:00" or "20:00:00"
  var s = String(v || "").trim();
  var m = s.match(/(\d{1,2}):(\d{2})/);
  if (m) return ("0" + m[1]).slice(-2) + ":" + m[2];
  return s;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}
