/**
 * GIFT DRAW BACKEND — Google Apps Script (free, uses your Gmail)
 * Saves registrations to a Google Sheet and, after the deadline,
 * automatically draws names and emails everyone who registered.
 */

// ===== SETTINGS =====
const CFG = {
  DEADLINE: '2026-11-30T23:59:59+08:00',   // end of Nov 30 (Manila)
  GIFT: '500',
  EVENT_DATE: 'Dec __, 2026',               // CHANGE THIS
  EVENT_TIME: 'TBA',                        // CHANGE THIS
  EVENT_PLACE: 'Vikings Luxury Buffet, SM Mall of Asia, Pasay City',
  ORGANIZER_NAME: 'Organizer',
  SENDER_NAME: 'Gift Draw Carnival 🎄'
};
const SHEET = 'Registrations';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(['Timestamp', 'Name', 'Email', 'Wishlist', 'Drawn']); }
  return sh;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// Called by the website
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== 'register') return json_({ ok: false, error: 'Invalid request' });
  if (new Date() > new Date(CFG.DEADLINE)) return json_({ ok: false, error: 'Registration is closed.' });

  const name = String(p.name || '').trim().slice(0, 60);
  const email = String(p.email || '').trim().toLowerCase().slice(0, 100);
  const wish = String(p.wish || '').trim().slice(0, 200);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json_({ ok: false, error: 'Invalid name or email.' });

  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheet_();
    if (sh.getLastRow() > 1) {
      const emails = sh.getRange(2, 3, sh.getLastRow() - 1, 1).getValues().flat().map(String);
      if (emails.indexOf(email) !== -1) return json_({ ok: false, error: 'This email is already registered.' });
    }
    sh.appendRow([new Date(), name, email, wish, '']);
    return json_({ ok: true });
  } finally { lock.release(); }
}

// ===== BUNUTAN =====
// Random draw where nobody gets themselves (derangement).
function derange_(n) {
  while (true) {
    const a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    if (a.every((v, i) => v !== i)) return a;
  }
}

function runDraw() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('DRAWN') === 'yes') { Logger.log('The draw has already been done.'); return; }
  if (new Date() <= new Date(CFG.DEADLINE)) { Logger.log('The deadline has not passed yet.'); return; }

  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) { notifyOrganizer_('Nobody registered.'); return; }
  const rows = sh.getRange(2, 1, last - 1, 4).getValues().map(r => ({ name: r[1], email: r[2], wish: r[3] }));
  if (rows.length < 3) { notifyOrganizer_('Not enough participants (' + rows.length + '). At least 3 are needed.'); return; }

  const perm = derange_(rows.length);
  let sent = 0;
  rows.forEach((giver, i) => {
    const rec = rows[perm[i]];
    const body =
      'Hi ' + giver.name + '! 🎄\n\n' +
      'The draw is done! The person you are giving a gift to is:\n\n' +
      '   🎁  ' + rec.name.toUpperCase() + '\n' +
      (rec.wish ? '   Wishlist/interests: ' + rec.wish + '\n' : '') + '\n' +
      'Gift value: ₱' + CFG.GIFT + '\n' +
      'Keep it a secret until the exchange day 🤫\n\n' +
      '🎪 DINNER & RIDES\n' +
      'Date: ' + CFG.EVENT_DATE + '\n' +
      'Time: ' + CFG.EVENT_TIME + '\n' +
      'Place: ' + CFG.EVENT_PLACE + '\n' +
      'Please bring your wrapped gift with the recipient\'s name written on it.\n\n' +
      'Merry Christmas and Happy Holidays!\n— ' + CFG.ORGANIZER_NAME;
    try {
      MailApp.sendEmail({ to: giver.email, subject: '🎁 Your Gift Draw Result: who are you giving to?', body: body, name: CFG.SENDER_NAME });
      sent++;
    } catch (err) { Logger.log('Failed: ' + giver.email + ' ' + err); }
  });
  props.setProperty('DRAWN', 'yes');
  sh.getRange(2, 5, rows.length, 1).setValue('✔');
  notifyOrganizer_('Draw complete. Sent: ' + sent + ' / ' + rows.length + '. (The sheet does not record who drew whom, so it stays secret from you too.)');
}

function notifyOrganizer_(msg) {
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Gift draw status', msg);
}

// Run ONCE: schedules the automatic draw for Dec 1, 12:10 AM (Manila)
function setupTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('runDraw').timeBased().at(new Date('2026-12-01T00:10:00+08:00')).create();
}

// Test: sends a sample email to yourself
function testEmail() {
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Gift Draw test', 'Email works! 🎄');
}
