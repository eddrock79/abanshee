/* Staff Hub v2 (preview): rearranges the existing Staff Hub. Nothing here changes what the page loads or saves.
   Order: To do now (needs attention + from the office) > Tonight > Closing jobs > Shift alerts > Last night (compact)
          > Hero of the week > New reviews > Snags > Staff folder > Outside > Headlines > Search. */
(function () {
  if (window.__hub2) return; window.__hub2 = 1;
  var $ = function (id) { return document.getElementById(id); };
  var openPubs = {}, openMsgs = {};
  function section(id, title) {
    var s = $(id); if (s) return s;
    s = document.createElement('section'); s.id = id;
    s.innerHTML = '<h2 class="sec-h">' + title + '</h2>'; return s;
  }
  // staff pages pulled onto the Staff Hub (they come off the Checklists and Dashboard rows in the preview)
  // iPad (touch screen) or a narrow window gets the new layout; a desktop with a mouse keeps the classic one
  var IPAD = false;
  try { IPAD = window.matchMedia('(hover:none) and (pointer:coarse)').matches || window.innerWidth < 1100; } catch (e) {}
  function pagesList() {
    var V = (window.BOARD && BOARD.venue) || 'bl', site = V === 'br' ? 'https://blackrose.hauntedpubs.co.uk' : 'https://banshee.hauntedpubs.co.uk';
    var nas = 'http://' + (/^(192\.168\.1\.40|100\.90\.189\.89|eddrock79nas)/i.test(location.hostname) ? location.hostname : '100.90.189.89') + ':' + (V === 'br' ? '8102' : '8101');
    var q = function (u) { return u; };
    return [
      ['Lost property', 'Log an item or hand one back', q(site + '/lost-property/')],
      ['Cocktails', 'Recipes and what you can make', q(site + '/cocktails/')],
      V === 'bl' ? ['Drinks menu', 'The customer menu, no 2-hour timer', 'https://menu.hauntedpubs.co.uk/?bansheestaff='] : ['Drinks menu', 'The customer menu', 'https://menubr.hauntedpubs.co.uk/?menu_access=active'],
      V === 'bl' ? ['Calendar', 'Gigs, DJs and bookings', q(nas + '/events.html')] : null,
      V === 'bl' ? ['Rotas', "Who's working when", q(site + '/rotas/')] : null,
      V === 'bl' ? ['Holidays', 'Book or check time off', q(site + '/holidays/')] : null,
      ['Questions', 'Ask instead of messaging the group', q(nas + '/questions.html')],
      ['Ideas', 'Post an idea for the pub', q(nas + '/ideas.html')],
      ['Trello board', "Today's on-shift jobs", V === 'br' ? 'https://trello.com/b/54a2a08e20dbba377fdd5498' : 'https://trello.com/b/54a2a0781d8c930f0225a1ca'],
      ['Lighting', 'Venue lights', q(nas + '/lights.html')],
      V === 'br' ? ['QLC+', 'Lighting desk', q(nas + '/qlc.html')] : null,
      ['Sound desk', 'Venue wifi only', 'http://192.168.0.24']
    ].filter(Boolean);
  }
  // desktop: classic layout, with the staff pages listed in the sidebar instead of the old duplicate links
  function desktopSidebar() {
    if ($('h2-sidenav')) return;
    var main = $('nav-main'); if (!main) return;
    var keep = [['End of night checklist', 0], ['Sunday count', 0]].map(function (k) {
      var a = [].slice.call(main.querySelectorAll('a')).filter(function (x) { return x.textContent.trim() === k[0]; })[0];
      return a ? [k[0], '', a.getAttribute('href')] : null;
    }).filter(Boolean);
    var block = document.createElement('div'); block.id = 'h2-sidenav';
    block.innerHTML = '<p class="navh">Staff pages</p><nav class="nav">' + keep.concat(pagesList()).map(function (x) {
      return '<a href="' + x[2] + '"' + (/trello\.com|192\.168\.0\./.test(x[2]) ? ' target="_blank" rel="noopener"' : '') + '>' + x[0] + '</a>';
    }).join('') + '</nav>' + (((window.BOARD && BOARD.venue) || 'bl') === 'bl'
      ? '<p class="navh">Managers</p><nav class="nav"><a href="https://banshee.hauntedpubs.co.uk/whatson/">What&#8217;s On boards</a></nav>' : '');
    main.parentNode.style.display = 'none';
    main.parentNode.parentNode.insertBefore(block, main.parentNode.nextSibling);
    document.body.classList.add('hub2-desk');
  }
  function pagesSection() {
    var s = $('sec-pages'); if (s) return s;
    var P = pagesList();
    s = document.createElement('section'); s.id = 'sec-pages';
    s.innerHTML = '<h2 class="sec-h">Staff pages</h2><div class="h2tiles">' + P.map(function (x) {
      var ext = /trello\.com|192\.168\.0\./.test(x[2]);
      return '<a class="h2tile" data-hpfull="1" href="' + x[2] + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '><b>' + x[0] + '</b><span>' + x[1] + '</span></a>';
    }).join('') + '</div>';
    return s;
  }
  function arrange() {
    var stack = document.querySelector('.cols > .stack'); if (!stack || !$('attn') || !$('office')) return false;
    document.body.classList.add('hub2');
    var pages = pagesSection();
    // 1. To do now
    var todo = section('sec-todo', 'To do now');
    if (!todo.contains($('attn'))) { todo.appendChild($('attn')); todo.appendChild($('office')); }
    var dl = $('rota-names'); if (dl && dl.parentNode !== todo) todo.appendChild(dl);
    var note = document.querySelector('#sec-office > p.note'); if (note) todo.appendChild(note);
    // staff folder moves out of the sidebar
    var fold = section('sec-folders', 'Staff folder');
    if ($('folders') && $('folders').parentNode !== fold) {
      fold.appendChild($('folders'));
      var fn = document.querySelector('#c-folders > p.note'); if (fn) fold.appendChild(fn);
    }
    if (!$('folders') || !$('folders').children.length) fold.style.display = 'none'; else fold.style.display = '';
    var h = $('h-report'); if (h && !/^Last night/.test(h.textContent)) h.textContent = 'Last night · both pubs';
    var order = ['sec-todo', 'sec-pages', 'sec-tonight', 'sec-eon', 'sec-shift', 'sec-report', 'sec-heroes', 'sec-reviews', 'sec-snags', 'sec-folders', 'sec-wx', 'sec-news'];
    var prev = null;
    order.forEach(function (id) {
      var el = id === 'sec-todo' ? todo : id === 'sec-folders' ? fold : id === 'sec-pages' ? pages : $(id); if (!el) return;
      var want = prev ? prev.nextSibling : stack.firstChild;
      if (el.parentNode !== stack || el !== want) stack.insertBefore(el, want);
      prev = el;
    });
    var mh = document.querySelector('.masthead'); if (mh && prev && mh.previousSibling !== prev) stack.insertBefore(mh, prev.nextSibling);
    return true;
  }
  // last night: compact cards, tap to open (kept open across the page's own refreshes)
  function compactReport() {
    [].slice.call(document.querySelectorAll('#report .pub')).forEach(function (p, i) {
      var key = (p.className.match(/pub-(bl|br)/) || [])[1] || String(i);
      p.dataset.h2 = key;
      if (openPubs[key]) p.classList.add('h2open'); else p.classList.remove('h2open');
      [].slice.call(p.querySelectorAll('.pr')).forEach(function (r) {
        var t = (r.firstElementChild && r.firstElementChild.textContent || '').trim();
        if (/^(Signed off|Incidents)$/i.test(t)) r.classList.add('h2keep');
      });
      if (!p.querySelector('.h2tap')) { var tp = document.createElement('div'); tp.className = 'h2tap'; tp.textContent = 'Tap for staff, events, closing jobs and notes'; p.appendChild(tp); }
    });
  }
  // office messages: two lines each, tap to read it all
  function compactMsgs() {
    [].slice.call(document.querySelectorAll('#sec-todo .msg')).forEach(function (m) {
      if (openMsgs[m.id]) m.classList.add('h2open'); else m.classList.remove('h2open');
    });
    var off = $('office'), at = $('attn');
    var empty = off && !off.querySelector('.msg') && at && !at.querySelector('a.al:not(.todo)');
    var e = $('h2empty');
    if (empty && !e) { e = document.createElement('div'); e.id = 'h2empty'; e.className = 'h2empty'; e.textContent = 'Nothing to do right now.'; $('sec-todo').insertBefore(e, at); }
    if (!empty && e) e.remove();
  }
  document.addEventListener('click', function (ev) {
    if (!document.body.classList.contains('hub2')) return;
    if (ev.target.closest('button, a, input, textarea, select, label')) return;
    var p = ev.target.closest('#report .pub');
    if (p) { var k = p.dataset.h2; openPubs[k] = !openPubs[k]; p.classList.toggle('h2open', !!openPubs[k]); return; }
    var m = ev.target.closest('#sec-todo .msg');
    if (m) { openMsgs[m.id] = !openMsgs[m.id]; m.classList.toggle('h2open', !!openMsgs[m.id]); }
  });
  // the "Office · N actions" jump row now points at the list right below it
  // ── compliance reminders (fire alarm, emergency lighting, legionella, fire risk actions) from the Compliance page's sheet ──
  var COMPL_URL = 'https://script.google.com/macros/s/AKfycbzGitKoipTO-LeDPf3-cK9pkxfSlHqD_dTdcOQLMYlRmSmRmf6wNLBjfhIO_rC-wRPX/exec';
  var COMPL_RULES = { fire_alarm: ['Weekly fire alarm test', 7], em_light_month: ['Monthly emergency lighting test', 31], em_light_annual: ['Annual 3-hour emergency lighting test', 365],
    extinguisher_month: ['Monthly extinguisher check', 31], extinguisher_service: ['Annual extinguisher service', 365], alarm_service: ['Fire alarm service', 183],
    fire_drill: ['Fire drill', 183], legionella_flush: ['Weekly flush of little-used taps', 7], legionella_temp: ['Monthly water temperatures', 31],
    showerhead: ['Quarterly showerhead clean', 92], legionella_review: ['Annual legionella review', 365], fra_review: ['Annual fire risk assessment review', 365] };
  var compl = null, complAt = 0;
  function complLoad() {
    if (Date.now() - complAt < 30 * 60000) return; complAt = Date.now();
    var V = (window.BOARD && BOARD.venue) || 'bl';
    fetch(COMPL_URL + '?action=compliance&pub=' + V + '&t=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) { compl = d && d.Checks ? d : null; complDraw(); }).catch(function () {});
  }
  function complDraw() {
    var host = document.body.classList.contains('hub2') ? $('sec-todo') : $('sec-attn'); if (!host || !$('attn')) return;
    var box = $('h2-compl');
    if (!compl) { if (box) box.remove(); return; }
    var today = new Date(); today.setHours(12, 0, 0, 0);
    var items = [];
    Object.keys(COMPL_RULES).forEach(function (k) {
      var last = compl.Checks.filter(function (c) { return c.Type === k; }).map(function (c) { return String(c.Date); }).sort().pop();
      var due = last ? new Date(last + 'T12:00:00') : null; if (due) due.setDate(due.getDate() + COMPL_RULES[k][1]);
      if (!due || due < today) items.push([COMPL_RULES[k][0], last ? 'overdue' : 'not done yet']);
    });
    (compl.Actions || []).forEach(function (a) { if (a.Status !== 'Done' && a.Due && new Date(String(a.Due) + 'T12:00:00') < today) items.push(['Fire risk action: ' + (a.Action || a.Finding), 'overdue']); });
    (compl.Documents || []).forEach(function (d) {
      var months = Number(d['Check months']) || 6, last = String(d['Last checked'] || '').slice(0, 10);
      var next = last ? new Date(last + 'T12:00:00') : null; if (next) next.setDate(next.getDate() + Math.round(months * 30.44));
      var exp = d.Expires ? new Date(String(d.Expires) + 'T12:00:00') : null;
      if (exp && exp < today) items.push([d.Name + ' (expired)', 'overdue']);
      else if (!next || next < today) items.push([d.Name + ' (check due)', 'overdue']);
    });
    var V = (window.BOARD && BOARD.venue) || 'bl', site = V === 'br' ? 'https://blackrose.hauntedpubs.co.uk' : 'https://banshee.hauntedpubs.co.uk';
    if (!items.length) { if (box) box.remove(); return; }
    var html = '<a class="al todo h2-compl-head" data-hpfull="1" href="' + site + '/compliance/"><i>Compliance</i><div>' + items.length + ' check' + (items.length === 1 ? '' : 's') + ' due: ' +
      items.slice(0, 4).map(function (x) { return x[0]; }).join(', ') + (items.length > 4 ? ' and ' + (items.length - 4) + ' more' : '') + '</div><span class="jump">Open ›</span></a>';
    if (!box) { box = document.createElement('div'); box.id = 'h2-compl'; box.className = 'sa'; }
    if (box.innerHTML !== html) box.innerHTML = html;
    var at = $('attn'); if (box.parentNode !== at.parentNode || box.previousSibling !== at) at.parentNode.insertBefore(box, at.nextSibling);
  }
  function tick() {
    complLoad();
    if (!IPAD) { desktopSidebar(); complDraw(); return; }
    if (arrange()) { compactReport(); compactMsgs(); complDraw(); }
  }
  var busy = false;
  function soon() { if (busy) return; busy = true; setTimeout(function () { busy = false; tick(); }, 60); }
  function go() { tick(); new MutationObserver(soon).observe(document.querySelector('.main') || document.body, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
