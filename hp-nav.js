/* Haunted Pubs — the same top on every staff page:
   [pub logo] Staff Hub / Checklists / Stock / Toilets & refusals / Dashboard, then that page's own links, then the page.
   One file, copied unchanged to both Checklists sites (/hp-nav.js), the NAS boards (pub-report/hp-nav.js)
   and the Manager Dashboards (venue-bl, venue-br). Each page's old header is hidden. */
(function () {
  if (window.__hpnav) return; window.__hpnav = 1;
  var h = location.hostname, port = location.port, path = location.pathname;
  var onNas = /^(192\.168\.1\.40|100\.90\.189\.89|eddrock79nas(\.local)?)$/i.test(h);
  var NAS = 'http://' + (onNas ? h : '100.90.189.89');
  function pub() {
    if (window.HP_PUB) return window.HP_PUB;
    if (/blackrose/i.test(h) || port === '8102' || port === '8103') return 'br';
    if (/\/board\/br|start-br/.test(path)) return 'br';
    if (/\/board\/bl|start-bl/.test(path) || port === '8101' || port === '8100') return 'bl';
    var c = window.BL_CFG && (BL_CFG.venueKey || BL_CFG.venueName || '');
    return /rose/i.test(c || '') ? 'br' : 'bl';
  }
  var P = pub(), site = P === 'br' ? 'https://blackrose.hauntedpubs.co.uk' : 'https://banshee.hauntedpubs.co.uk';
  var dashPort = P === 'br' ? '8102' : '8101';
  var L = [
    ['hub', '⌂', 'Staff Hub', NAS + ':8114/board/' + P + '-' + (P === 'br' ? 'fe73bad2' : '1ce6f0ea')],
    ['check', '✓', 'Checklists', site + '/home/'],
    ['orders', '🛒', 'Stock', NAS + ':' + dashPort + '/orders.html'],
    ['refusals', '🚫', 'Toilets & refusals', site + '/refusals/'],
    ['dash', '📊', 'Dashboard', NAS + ':' + dashPort + '/']
  ];
  var DASH = NAS + ':' + dashPort;
  var MORE = [
    ['Rotas', site + '/rotas/'], ['Staff courses', site + '/courses/'], ['Compliance', site + '/compliance/'],
    P === 'br' ? ['Kitchen', DASH + '/kitchen.html'] : ['Fridge temperatures', DASH + '/temps-record.html'],
    ['Health and safety', DASH + '/hs.html'], ['Lost property', site + '/lost-property/'], ['Cocktails', site + '/cocktails/'],
    P === 'br' ? ['Drinks menu', 'https://menubr.hauntedpubs.co.uk/?menu_access=active'] : ['Drinks menu', 'https://menu.hauntedpubs.co.uk/?bansheestaff='],
    P === 'bl' ? ['Calendar', DASH + '/events.html'] : null, P === 'bl' ? ['Holidays', site + '/holidays/'] : null,
    ['Questions', DASH + '/questions.html'], ['Ideas', DASH + '/ideas.html'], ['Lighting', DASH + '/lights.html'],
    P === 'br' ? ['QLC+', DASH + '/qlc.html'] : null, P === 'br' ? ['Sound desk', 'http://192.168.0.24'] : null,
    ['Trello board', P === 'br' ? 'https://trello.com/b/54a2a08e20dbba377fdd5498' : 'https://trello.com/b/54a2a0781d8c930f0225a1ca']
  ].filter(Boolean);
  var cur = port === '8114' || /start-b[lr]\.html/.test(path) ? 'hub'
    : /orders/.test(path) ? 'orders'
    : /\/refusals\//.test(path) ? 'refusals'
    : /hauntedpubs\.co\.uk$/.test(h) ? 'check'
    : (port === '8101' || port === '8102') ? 'dash' : '';
  // ── Staff Hub v2: live for everyone since 21 Nov 2026 (the old ?hpv= preview switch is no longer needed) ──
  var PREVIEW = true;
  // staff pages that now live on the Staff Hub light up Staff Hub
  var MOVED = /\/(lost-property|cocktails|rotas|holidays)\/|\/(ideas|questions|events|lights|qlc|sound|hs)\.html/.test(path);
  if (MOVED) cur = 'hub';
  if (cur === 'hub' && !MOVED) {
    try { if (window.matchMedia('(hover:none) and (pointer:coarse)').matches) window.CHAT_WIDE = '(min-width:1400px)'; } catch (e) {}   // iPad: chat is a button; desktop keeps its column
    var FB = 'https://banshee.hauntedpubs.co.uk/';     // fallback copy if the board service can't hand the file out
    var hl = document.createElement('link'); hl.rel = 'stylesheet'; hl.href = 'start-hub2.css?v=16';
    hl.onerror = function () { hl.onerror = null; hl.href = FB + 'start-hub2.css?v=16'; }; document.head.appendChild(hl);
    var hs = document.createElement('script'); hs.src = 'start-hub2.js?v=16';
    hs.onerror = function () { var y = document.createElement('script'); y.src = FB + 'start-hub2.js?v=16'; document.head.appendChild(y); }; document.head.appendChild(hs);
  }
  // ── Dashboard layout (main board and sales only) ──
  // live for everyone since 21 Nov 2026
  var DASHPREV = cur === 'dash' && (port === '8101' || port === '8102') && /^\/(index\.html)?$/.test(path);
  var TOOLS = P === 'br'
    ? [['Menu editor', 'https://menubr.hauntedpubs.co.uk/?menu_access=active'], ['Food menu admin', 'https://demo.blackrosetavern.com/wp-admin/admin.php?page=food-menu'], ['Report site', 'https://sites.google.com/thebansheelabyrinth.com/blackrose/report?authuser=0']]
    : [["What's On boards", 'https://banshee.hauntedpubs.co.uk/whatson/'], ['Menu editor', 'https://menu.hauntedpubs.co.uk/?bansheestaff='], ['Report site', 'https://sites.google.com/thebansheelabyrinth.com/bansheelabyrinth/report?authuser=0']];
  var acc = P === 'br' ? '#e9b23f' : '#c6e03c';
  var F = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  var CSS =
    /* the page's own headers make way for the shared one */
    'body>.topbar,.topbar.hp-old,header.top.hp-old,.mbar,.side .logo,.bl-front{display:none!important}' +
    'header.hptop{display:block!important;box-sizing:border-box!important;background:#0b0b10!important;border-bottom:3px solid ' + acc + '!important;padding:10px 16px!important;margin:0!important;position:relative!important;z-index:20!important;font-family:' + F + '!important}' +
    '.hptop-in{display:flex!important;align-items:center!important;gap:16px!important;max-width:1400px!important;margin:0 auto!important}' +
    '.hptop-in>a.hplogo{flex:0 0 auto!important;display:block!important;line-height:0!important;padding:0!important;border:0!important;background:none!important}' +
    /* tap the logo: every other staff page as big tiles */
    '.hptop-in>a.hplogo{position:relative!important}.hptop-in>a.hplogo::after{content:"\\25BE";position:absolute;right:-4px;bottom:-4px;width:20px;height:20px;border-radius:50%;background:' + acc + ';color:#111;font:700 12px/20px system-ui,sans-serif;text-align:center}' +
    /* the row under the main tabs: All pages, plus what is outstanding right now */
    '.hpquick{display:flex!important;flex-wrap:wrap!important;gap:8px!important;align-items:center!important;max-width:1400px!important;margin:10px auto 0!important;padding:0 16px!important;box-sizing:border-box!important;font-family:' + F + '!important}' +
    '.hpquick a,.hpquick button{display:inline-flex!important;align-items:center!important;gap:6px!important;height:40px!important;padding:0 14px!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.2)!important;background:#15151b!important;color:#fff!important;font:700 15px/1 ' + F + '!important;text-decoration:none!important;cursor:pointer!important;white-space:nowrap!important}' +
    '.hpquick .hpq-all{background:' + acc + '!important;color:#111!important;border-color:' + acc + '!important}' +
    '.hpquick .hpq-due{border-color:#ff9f43!important;color:#ffd2a6!important}' +
    '.hpmore{position:fixed;left:0;right:0;bottom:0;z-index:99990;background:rgba(0,0,0,.6);display:none;overflow:auto}.hpmore.open{display:block}' +
    '.hpmore-in{max-width:1100px;margin:0 auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;background:#101016;border-bottom:2px solid ' + acc + '}' +
    '.hpmore-in a,.hpmore-in button{display:flex;align-items:center;justify-content:center;text-align:center;min-height:68px;padding:8px 10px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:#1b1b22;color:#fff;font:700 17px/1.2 ' + F + ';text-decoration:none;cursor:pointer}' +
    '.hpmore-in a:active{background:' + acc + ';color:#111}.hpmore-in button{background:none;color:#bbb}' +
    '.hptop-in>a.hplogo img{height:54px!important;width:auto!important;max-width:170px!important;border-radius:6px!important;display:block!important}' +
    'nav.hpnav{flex:1 1 auto!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important;margin:0!important;padding:0!important;box-sizing:border-box!important}' +
    'nav.hpnav a{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;height:52px!important;padding:0 8px!important;box-sizing:border-box!important;margin:0!important;' +
    'border-radius:12px!important;border:1px solid rgba(255,255,255,.2)!important;background:#1b1b22!important;color:#fff!important;' +
    'font:700 16px/1 ' + F + '!important;letter-spacing:0!important;text-transform:none!important;text-decoration:none!important;text-align:center!important;white-space:nowrap!important;box-shadow:none!important}' +
    'nav.hpnav a:hover{border-color:' + acc + '!important}' +
    /* tablet portrait: long labels (Toilets & refusals) wrap onto two lines inside their button instead of spilling out */
    '@media(max-width:1000px){nav.hpnav a{white-space:normal!important;line-height:1.1!important;font-size:15px!important;overflow:hidden!important;min-width:0!important}}' +
    'nav.hpnav a[aria-current=page]{background:' + acc + '!important;border-color:' + acc + '!important;color:#111!important}' +
    'nav.hpnav a i{font-style:normal!important;font-size:18px!important;line-height:1!important}' +
    /* that page's own links, one row, same look on every page */
    'html body .hpsub{box-sizing:border-box!important;padding:10px 16px 0!important;margin:0!important;font-family:' + F + '!important}' +
    'html body .hpsub>*{display:flex!important;flex-wrap:wrap!important;gap:6px!important;max-width:1400px!important;width:auto!important;margin:0 auto!important;padding:0!important;border:0!important;background:none!important;position:static!important;box-shadow:none!important;order:0!important}' +
    'html body .hpsub>*>a,html body .hpsub>*>span,html body .hpsub>*>button{display:inline-flex;align-items:center!important;height:38px!important;padding:0 14px!important;margin:0!important;box-sizing:border-box!important;border-radius:9px!important;border:1px solid rgba(255,255,255,.18)!important;' +
    'background:#15151b!important;color:#e8e8ee!important;font:600 14px/1 ' + F + '!important;letter-spacing:0!important;text-transform:none!important;text-decoration:none!important;white-space:nowrap!important;cursor:pointer!important;box-shadow:none!important;min-height:0!important;flex-direction:row!important}' +
    'html body .hpsub>*>a small{display:none!important}' +
    'html body .hpsub>*>.current,html body .hpsub>*>[aria-current=page]{border-color:' + acc + '!important;color:' + acc + '!important;background:#15151b!important}' +
    'html body .hpsub>*>.hp-out{color:#ff7a93!important;border-color:#ff7a9366!important}' +
    'html body .hpsub>*>.hp-right{margin-left:auto!important}' +
    /* manager-only buttons (Checklist dashboard, What's On): the page turns them on with display:inline-block and a purple style; keep them like the rest */
    'html body .hpsub>*>a[style*="inline-block"],html body .hpsub>*>a[style*="display: block"]{display:inline-flex!important}' +
    'html body .hpsub>*>a.mgr{background:#15151b!important;color:#e8e8ee!important;border-color:rgba(255,255,255,.18)!important}' +
    '@media(max-width:700px){.hptop-in{flex-direction:column!important;align-items:stretch!important;gap:8px!important}.hptop-in>a.hplogo{align-self:center!important}.hptop-in>a.hplogo img{height:40px!important}' +
    'nav.hpnav{gap:5px!important}nav.hpnav a{flex-direction:column!important;gap:4px!important;height:56px!important;font-size:12px!important;padding:0 2px!important}' +
    'html body .hpsub>*>a,html body .hpsub>*>span,html body .hpsub>*>button{height:34px!important;padding:0 10px!important;font-size:13px!important}html body .hpsub>*>.hp-right{margin-left:0!important}}' +
    /* Checklists on a desktop (mouse, wide screen): use the width; touch screens keep their layout */
    '@media (hover:hover) and (pointer:fine) and (min-width:1100px){' +
      'html body #app>.page{max-width:1400px!important}' +
      'html body #app>.tabbar{padding-left:max(16px,calc((100% - 1400px) / 2 + 20px))!important;padding-right:max(16px,calc((100% - 1400px) / 2 + 20px))!important}' +
      'html body .nx-board{grid-template-columns:minmax(0,1fr) 290px!important;gap:18px!important}' +
      'html body .nx-cols2{gap:14px!important}' +
      'html body .nx-job{min-height:0!important;padding:9px 12px!important;align-items:center!important}' +
      'html body .nx-job>span{font-size:15px!important;line-height:1.3!important}' +
      'html body .nx-jrow{margin-bottom:6px!important}' +
      'html body .nx-people .nx-col:has(.nx-empty)>.nx-list{display:none!important}' +
      'html body .nx-people .nx-col:has(.nx-empty){margin-bottom:6px!important;opacity:.8}' +
    '}' +
    /* preview extras */
    '.hpclock{flex:0 0 auto!important;display:flex!important;flex-direction:column!important;align-items:flex-end!important;line-height:1.1!important;color:#fff!important;font-family:' + F + '!important}' +
    '.hpclock b{font:800 26px/1 ' + F + '!important;color:' + acc + '!important;font-variant-numeric:tabular-nums}.hpclock span{font:600 12px/1.3 ' + F + '!important;color:#b9b9c4!important;white-space:nowrap}' +
    'html body .hpsub.hp-norow{display:none!important}' +
    'html body .hpsub.hp-btnonly>*>a,html body .hpsub.hp-btnonly>*>span{display:none!important}' +
    'html body .hpsub>.hptools{margin-top:8px!important}' +
    'html body .hpsub>.hptools>.hp-lbl{border:0!important;background:none!important;color:#9a9aa6!important;padding:0 4px 0 0!important;cursor:default!important;font-weight:700!important;text-transform:uppercase!important;font-size:11px!important;letter-spacing:.08em!important}' +
    '@media(max-width:700px){.hpclock{display:none!important}}' +
    /* Staff Hub with a page open inside it: the Hub's own links row makes way for that page's links */
    'html body.viewing>.hpsub{display:none!important}' +
    '@media print{header.hptop,html body .hpsub{display:none!important}}';
  // which main button to light up for a given address
  function keyOf(u) {
    return /\/refusals\//.test(u) ? 'refusals' : /orders/.test(u) ? 'orders' : /hauntedpubs\.co\.uk/.test(u) ? 'check'
      : /:810[0-3]\b/.test(u) ? 'dash' : /:8114\b|start-b[lr]\.html/.test(u) ? 'hub' : '';
  }
  function mark() {
    var k = cur;
    if (document.body.classList.contains('viewing')) { var m = /view=([^&]+)/.exec(location.hash); if (m) { try { k = keyOf(decodeURIComponent(m[1])) || cur; } catch (e) {} } }
    [].slice.call(document.querySelectorAll('nav.hpnav a')).forEach(function (a, i) {
      var on = L[i] && L[i][0] === k;
      if (on && a.getAttribute('aria-current') !== 'page') a.setAttribute('aria-current', 'page');
      if (!on && a.hasAttribute('aria-current')) a.removeAttribute('aria-current');
    });
  }
  var FRAMED = false; try { FRAMED = window.self !== window.top; } catch (e) { FRAMED = true; }
  function sub() { return document.querySelector('#quick3, nav.otop, .nav-bar'); }
  function build() {
    if (!document.body) return false;
    if (!document.getElementById('hpnav-css')) { var st = document.createElement('style'); st.id = 'hpnav-css'; st.textContent = CSS; document.head.appendChild(st); }
    var top = document.querySelector('header.hptop');
    // opened inside another staff page (the Staff Hub viewer): that page already shows the top, so don't repeat it
    if (!top && FRAMED) {
      var w0 = document.querySelector('html body .hpsub');
      if (!w0) { w0 = document.createElement('div'); w0.className = 'hpsub'; document.body.insertBefore(w0, document.body.firstChild); }
      var s0 = sub(); if (s0 && s0.parentNode !== w0) w0.appendChild(s0);
      tidy(); return true;
    }
    if (!top) {
      top = document.createElement('header'); top.className = 'hptop';
      top.innerHTML = '<div class="hptop-in"><a class="hplogo" href="' + L[0][3] + '" target="_top" aria-label="Staff Hub"><img src="' + site + '/logo.jpg" alt="' + (P === 'br' ? 'The Black Rose Tavern' : 'The Banshee Labyrinth') + '"></a>' +
        '<nav class="hpnav" aria-label="Main menu">' + L.map(function (x) {
          return '<a href="' + x[3] + '" target="_top"' + (x[0] === cur ? ' aria-current="page"' : '') + '>' + x[2] + '</a>';
        }).join('') + '</nav>' + (PREVIEW ? '<div class="hpclock" aria-label="Time"><b></b><span></span></div>' : '') + '</div>';
      document.body.insertBefore(top, document.body.firstChild);
      var lg = top.querySelector('a.hplogo');
      if (lg) lg.addEventListener('click', function (e) { e.preventDefault(); toggleMore(top); });
      // pages that pad the body (the dashboards) still get the bar edge to edge
      var bs = getComputedStyle(document.body);
      ['Left', 'Right', 'Top'].forEach(function (s) { var v = parseFloat(bs['padding' + s]) || 0; if (v) top.style.setProperty('margin-' + s.toLowerCase(), (-v) + 'px', 'important'); });
    }
    quickRow(top);
    var wrap = document.querySelector('html body .hpsub');
    if (!wrap) {
      wrap = document.createElement('div'); wrap.className = 'hpsub'; var qr = document.getElementById('hpquick'); top.parentNode.insertBefore(wrap, (qr || top).nextSibling);
      var bs2 = getComputedStyle(document.body);
      ['Left', 'Right'].forEach(function (k) { var v = parseFloat(bs2['padding' + k]) || 0; if (v) wrap.style.setProperty('margin-' + k.toLowerCase(), (-v) + 'px', 'important'); });
    }
    var s = sub();
    if (s && s.parentNode !== wrap) wrap.appendChild(s);
    if (PREVIEW) preview(wrap);
    tidy(); return true;
  }
  // quick row: what's outstanding, from the Compliance sheet (works on every page, on and off the pub network); refreshed every 10 minutes
  var CU = 'https://script.google.com/macros/s/AKfycbzGitKoipTO-LeDPf3-cK9pkxfSlHqD_dTdcOQLMYlRmSmRmf6wNLBjfhIO_rC-wRPX/exec';
  function quickCalc(d) {
    var out = [], today = new Date(); today.setHours(12, 0, 0, 0);
    var set = {}; (d.Settings || []).forEach(function (x) { set[x.Key] = String(x.Value || ''); });
    var areas = (set.toilet_areas || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); if (!areas.length) areas = ['Ladies', 'Gents', 'Accessible'];
    var every = parseInt(set.toilet_every || '60', 10); if (!(every >= 15)) every = 60;
    var hm = String(set.toilet_hours || '16:00-03:00').match(/(\d{1,2}):?(\d{2})?\s*-\s*(\d{1,2}):?(\d{2})?/), h0 = hm ? +hm[1] * 60 + (+hm[2] || 0) : 960, h1 = hm ? +hm[3] * 60 + (+hm[4] || 0) : 180;
    var n = new Date(), tm = n.getHours() * 60 + n.getMinutes(), open = h0 <= h1 ? (tm >= h0 && tm < h1) : (tm >= h0 || tm < h1);
    if (open) {
      var late = areas.filter(function (ar) {
        var last = (d.Checks || []).filter(function (c) { return c.Type === 'toilet' && c.Item === ar; }).map(function (c) { return c['Logged at'] ? new Date(c['Logged at']).getTime() : 0; }).sort().pop();
        return !last || (Date.now() - last) / 60000 > every + 15;
      });
      if (late.length) out.push(['🚻 Toilet check: ' + late.length + ' due', site + '/refusals/']);
    }
    [['fire_alarm', 'Fire alarm test', 7, 'fire'], ['em_light_month', 'Emergency lights', 31, 'fire'], ['extinguisher_month', 'Extinguishers', 31, 'fire'],
     ['legionella_flush', 'Tap flush', 7, 'water'], ['legionella_temp', 'Water temperatures', 31, 'water']].forEach(function (k) {
      var last = (d.Checks || []).filter(function (c) { return c.Type === k[0]; }).map(function (c) { return String(c.Date); }).sort().pop();
      var nx = last ? new Date(last + 'T12:00:00') : null; if (nx) nx.setDate(nx.getDate() + k[2]);
      if (!nx || nx <= today) out.push(['🔥 ' + k[1] + ' due', site + '/compliance/?tab=' + k[3]]);
    });
    return out;
  }
  function quickDraw(row, items) {
    var fire = items.filter(function (x) { return x[0].indexOf('🔥') === 0; });
    if (fire.length > 2) items = items.filter(function (x) { return x[0].indexOf('🔥') !== 0; }).concat([['🔥 ' + fire.length + ' safety checks due', site + '/compliance/?tab=fire']]);
    row.innerHTML = '<button type="button" class="hpq-all">☰ All pages ▾</button>' + items.slice(0, 5).map(function (x) {
      return '<a class="hpq-due" href="' + x[1] + '" target="_top">' + x[0] + ' ›</a>'; }).join('') +
      (items.length > 5 ? '<a class="hpq-due" href="' + site + '/compliance/" target="_top">+' + (items.length - 5) + ' more ›</a>' : '') +
      '<a href="' + site + '/courses/" target="_top">🎓 Do a course +10</a>';
    row.querySelector('.hpq-all').onclick = function () { var t = document.querySelector('header.hptop'); if (t) toggleMore(t); };
  }
  function quickRow(top) {
    var row = document.getElementById('hpquick');
    if (!row) { row = document.createElement('div'); row.id = 'hpquick'; row.className = 'hpquick'; top.parentNode.insertBefore(row, top.nextSibling); }
    var key = 'hpq_' + P, c = null;
    try { c = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) {}
    quickDraw(row, c && c.d || []);
    if (c && Date.now() - c.t < 600000) return;
    fetch(CU + '?action=compliance&pub=' + P + '&t=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.Checks) return; var x = quickCalc(d);
      try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: x })); } catch (e) {}
      quickDraw(row, x);
    }).catch(function () {});
  }
  // the logo's drop-down: all the other staff pages; tap the logo again, the dimmed page or Close to shut it
  function toggleMore(top) {
    var m = document.getElementById('hpmore');
    if (!m) {
      m = document.createElement('div'); m.id = 'hpmore'; m.className = 'hpmore';
      // lighting desks refuse to be shown inside the Staff Hub viewer, so those open as a full page (data-hpfull)
      m.innerHTML = '<div class="hpmore-in">' + MORE.map(function (x) { return '<a href="' + x[1] + '" target="_top"' + (/trello\.com|192\.168\.0\./.test(x[1]) ? ' rel="noopener"' : '') + (/lights\.html|qlc\.html|192\.168\.0\./.test(x[1]) ? ' data-hpfull="1"' : '') + '>' + x[0] + '</a>'; }).join('') + '<button type="button">✕ Close</button></div>';
      m.addEventListener('click', function (e) { if (e.target === m || e.target.tagName === 'BUTTON' || e.target.closest('a')) m.classList.remove('open'); });
      document.body.appendChild(m);
    }
    m.style.top = Math.max(0, top.getBoundingClientRect().bottom) + 'px';
    m.classList.toggle('open');
  }
  // preview extras: links row only inside its own section; manager tools on the Dashboard; clock in the top bar
  function preview(wrap) {
    var onSite = /hauntedpubs\.co\.uk$/.test(h);
    if (cur === 'orders' || (cur === 'hub' && !onSite)) wrap.classList.add('hp-norow');
    if (cur === 'refusals' || (cur === 'hub' && onSite)) wrap.classList.add('hp-btnonly');
    if (DASHPREV) dashPreview(wrap);
    if (cur === 'dash' && !DASHPREV && !wrap.querySelector('.hptools')) {
      var t = document.createElement('div'); t.className = 'hptools';
      t.innerHTML = '<span class="hp-lbl">Manager tools</span>' + TOOLS.map(function (x) { return '<a href="' + x[1] + '" target="_blank" rel="noopener">' + x[0] + '</a>'; }).join('');
      wrap.appendChild(t);
    }
    if (!window.__hpclock) {
      window.__hpclock = 1;
      var tickc = function () {
        var c = document.querySelector('.hpclock'); if (!c) return; var d = new Date();
        c.firstChild.textContent = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        c.lastChild.textContent = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      };
      tickc(); setInterval(tickc, 15000);
    }
  }
  // Dashboard preview: one row (Overview / Sales, manager tools on the right), plain info line, lined up with the top bar, pub colours
  function dashPreview(wrap) {
    if (!wrap.querySelector('.hpdashrow')) {
      document.body.classList.add('dashprev');
      var sales = /[?&]p=sales/.test(location.search);
      var r = document.createElement('div'); r.className = 'hpdashrow';
      r.innerHTML = '<a href="./"' + (sales ? '' : ' aria-current="page"') + '>Overview</a><a href="./?p=sales"' + (sales ? ' aria-current="page"' : '') + '>Sales</a>' +
        '<span class="hp-lbl hp-tools-lbl">Manager tools</span>' + TOOLS.map(function (x) { return '<a href="' + x[1] + '" target="_blank" rel="noopener">' + x[0] + '</a>'; }).join('');
      wrap.insertBefore(r, wrap.firstChild);
    }
    if (document.getElementById('hp-dashprev-css')) return;
    var fl = document.createElement('link'); fl.rel = 'stylesheet';
    fl.href = P === 'br' ? 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Outfit:wght@400;500;600;700&display=swap' : 'https://fonts.googleapis.com/css2?family=Bevan&family=Signika:wght@400;500;600;700&display=swap';
    document.head.appendChild(fl);
    var theme = P === 'br'
      ? '--bg:#0a0a0b;--panel:#111113;--panel2:#1b1b1e;--line:#2a2a2e;--grid:#222226;--text:#f1f1f3;--muted:#a9a9b2;--accent:#e8a93a;--accent-soft:rgba(232,169,58,.14);--display:"Alfa Slab One",Georgia,serif;--body:"Outfit",system-ui,sans-serif;background:radial-gradient(900px 420px at 85% -5%,#8b1d3855 0,transparent 65%),#0a0a0b!important'
      : '--bg:#04102c;--panel:#0b1533;--panel2:#141d40;--line:#26305a;--grid:#1d2752;--text:#fff;--muted:#a9b0cc;--accent:#b7dc35;--accent-soft:rgba(183,220,53,.14);--display:"Bevan",Georgia,serif;--body:"Signika",system-ui,sans-serif;background:radial-gradient(900px 420px at 85% -5%,#5c2e9155 0,transparent 65%),#04102c!important';
    var st = document.createElement('style'); st.id = 'hp-dashprev-css';
    st.textContent =
      'html body.dashprev{' + theme + ';background-attachment:fixed!important}' +
      'html body.dashprev nav.otop{display:none!important}' +
      /* big numbers in the plain text font, lighter; card titles keep the heading font */
      'html body.dashprev .kpi .big,html body.dashprev .tiles3 b,html body.dashprev .mini3 b,html body.dashprev .tile b,html body.dashprev .wxbig{font-family:var(--body)!important;font-weight:600!important;letter-spacing:0!important}' +
      'html body.dashprev .wrap{max-width:1400px!important}' +
      'html body .hpsub>.hpdashrow{align-items:center!important}' +
      'html body .hpsub>.hpdashrow>.hp-tools-lbl{margin-left:auto!important;border:0!important;background:none!important;color:#9a9aa6!important;cursor:default!important;font-size:11px!important;font-weight:700!important;letter-spacing:.08em!important;text-transform:uppercase!important;padding:0 2px 0 0!important}' +
      'html body.dashprev .meta,html body.dashprev .meta-under{display:flex!important;flex-wrap:wrap!important;justify-content:flex-start!important;gap:4px 18px!important;margin:10px auto 2px!important;width:100%!important;max-width:1400px!important;padding:0!important;border:0!important;background:none!important}' +
      'html body.dashprev .meta>*,html body.dashprev .meta-under>*{border:0!important;background:none!important;height:auto!important;min-height:0!important;padding:0!important;box-shadow:none!important;color:#b4b8c8!important;font:500 13px/1.4 ' + F + '!important}' +
      '@media(max-width:700px){html body .hpsub>.hpdashrow>.hp-tools-lbl{margin-left:0!important;flex-basis:100%!important}}';
    document.head.appendChild(st);
  }
  function hideEl(a) { a.style.setProperty('display', 'none', 'important'); }
  function tidy() {
    // Checklists: managers see What's On on every page, not just Home, so the row doesn't change as you move between pages
    var nd = document.getElementById('nav-dash'), nw = document.getElementById('nav-whatson');
    if (nd && nw && getComputedStyle(nd).display !== 'none' && nw.style.display === 'none') nw.style.display = '';
    // old headers
    [].slice.call(document.querySelectorAll('.topbar, header.top')).forEach(function (x) { if (!x.classList.contains('hp-old')) x.classList.add('hp-old'); });
    var s = sub(); if (!s) return;
    // Checklists: Switch Venue / Log Out lived in the old header; bring them into the links row
    [].slice.call(document.querySelectorAll('.topbar .bl-mini, .topbar .bl-acts > button')).forEach(function (b) {
      var t = (b.textContent || '').trim().toLowerCase(); b.classList.add('hp-right'); if (t !== 'switch venue') b.classList.add('hp-out'); s.appendChild(b);
    });
    // links the main menu already gives
    var drop = /^(refusals|toilets & refusals|staff hub|⌂ staff hub|order list|orders|stock|checklists|checklists ↗|home|main board|manager dashboard|pub dashboard)$/i;
    [].slice.call(s.children).forEach(function (a) {
      var t = (a.textContent || '').replace(/\s+/g, ' ').replace(/\d+$/, '').trim();
      if (drop.test(t) && a.style.display !== 'none') hideEl(a);
      // preview: these now live on the Staff Hub (hidden only, never renamed: the dashboards redraw renamed tabs)
      if (PREVIEW && /^(lost property|cocktails|rotas|holidays|ideas|questions|events|lighting|qlc\+|sound desk.*)$/i.test(t) && a.style.display !== 'none') hideEl(a);
      // the Checklists site's own manager page is a different thing from the Manager Dashboard
      if (t === 'Dashboard' && /\/dashboard\/?$/.test(a.getAttribute('href') || '')) a.textContent = 'Checklist dashboard';
      // plain words only: no symbols on any link in the row
      // our own pages open in the same window (not a new tab), like the main buttons
      if (a.tagName === 'A' && a.target === '_blank' && /^https?:\/\/([a-z]+\.hauntedpubs\.co\.uk|100\.90\.189\.89|192\.168\.1\.40|eddrock79nas)/i.test(a.href)) { a.target = '_top'; a.removeAttribute('rel'); }
      // (never in the dashboards' tab row: that page redraws its tabs if their words change, which would loop)
      if (!a.children.length && !s.matches('nav.otop')) {
        var o = a.textContent, c = o.replace(/[←-⇿⌀-➿⬀-⯿\u{1F000}-\u{1FAFF}️]/gu, '').replace(/^[\s＋]+|[\s＋]+$/g, '').replace(/\s{2,}/g, ' ');
        if (c && c !== o) a.textContent = c;
      }
    });
    [].slice.call(document.querySelectorAll('.bl-xlink')).forEach(function (a) { if (a.style.display !== 'none') hideEl(a); });
    // only the first leftover button in the row gets pushed right
    var r = [].slice.call(s.querySelectorAll('.hp-right'));
    r.forEach(function (b, i) { if (i) b.classList.remove('hp-right'); });
  }
  function go() {
    if (!build()) return;
    new MutationObserver(function () {
      if ((!FRAMED && !document.querySelector('header.hptop')) || (sub() && sub().parentNode !== document.querySelector('html body .hpsub'))) build(); else tidy();
      mark();
    }).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(mark).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('hashchange', mark); mark();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
