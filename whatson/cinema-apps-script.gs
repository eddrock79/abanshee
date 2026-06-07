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
 *********************************************************************/

const MANAGER_PIN = "1234";        // ← change this to your PIN
const SHEET_NAME  = "Cinema";      // tab this script reads/writes

function doGet(e) {
  return json_(listRows_());
}

function doPost(e) {
  var p = {};
  try { p = JSON.parse(e.postData.contents); } catch (err) { p = (e && e.parameter) || {}; }

  if (String(p.pin) !== String(MANAGER_PIN)) return json_({ ok:false, error:"pin" });

  var sh = sheet_();

  if (p.action === "delete") {
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0]) === String(p.id)) sh.deleteRow(i + 1);
    }
    return json_({ ok:true });
  }

  // default: save (update if id matches, else append)
  var id = p.id || Utilities.getUuid();
  var rec = [ id, p.date || "", p.time || "", p.title || "", p.year || "",
              p.cert || "", p.blurb || "", p.by || "", new Date() ];

  var data = sh.getDataRange().getValues();
  var rowToUpdate = -1;
  for (var j = 1; j < data.length; j++) {
    if (String(data[j][0]) === String(id)) { rowToUpdate = j + 1; break; }
  }
  if (rowToUpdate > 0) sh.getRange(rowToUpdate, 1, 1, rec.length).setValues([rec]);
  else sh.appendRow(rec);

  return json_({ ok:true, id:id });
}

/* ---------- helpers ---------- */
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["id","date","time","title","year","cert","blurb","by","updated"]);
  }
  return sh;
}

function listRows_() {
  var sh = sheet_();
  var rows = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[3]) continue; // skip rows with no title
    out.push({
      id:    String(r[0]),
      date:  fmtDate_(r[1]),
      time:  fmtTime_(r[2]),
      title: String(r[3]),
      year:  String(r[4] || ""),
      cert:  String(r[5] || ""),
      blurb: String(r[6] || "")
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
  return String(v || "");
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}
