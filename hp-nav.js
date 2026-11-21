/* Haunted Pubs — the same top on every staff page:
   [pub logo] Staff Hub / Checklists / Orders / Refusals / Dashboard, then that page's own links, then the page.
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
    ['hub', '⌂', 'Staff Hub', NAS + ':8114/board/' + P],
    ['check', '✓', 'Checklists', site + '/home/'],
    ['orders', '🛒', 'Orders', NAS + ':' + dashPort + '/orders.html'],
    ['refusals', '🚫', 'Refusals', site + '/refusals/'],
    ['dash', '📊', 'Dashboard', NAS + ':' + dashPort + '/']
  ];
  var cur = port === '8114' || /start-b[lr]\.html/.test(path) ? 'hub'
    : /orders/.test(path) ? 'orders'
    : /\/refusals\//.test(path) ? 'refusals'
    : /hauntedpubs\.co\.uk$/.test(h) ? 'check'
    : (port === '8101' || port === '8102') ? 'dash' : '';
  var acc = P === 'br' ? '#e9b23f' : '#c6e03c';
  var F = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  var CSS =
    /* the page's own headers make way for the shared one */
    'body>.topbar,.topbar.hp-old,header.top.hp-old,.mbar,.side .logo,.bl-front{display:none!important}' +
    'header.hptop{display:block!important;box-sizing:border-box!important;background:#0b0b10!important;border-bottom:3px solid ' + acc + '!important;padding:10px 16px!important;margin:0!important;position:relative!important;z-index:20!important;font-family:' + F + '!important}' +
    '.hptop-in{display:flex!important;align-items:center!important;gap:16px!important;max-width:1400px!important;margin:0 auto!important}' +
    '.hptop-in>a.hplogo{flex:0 0 auto!important;display:block!important;line-height:0!important;padding:0!important;border:0!important;background:none!important}' +
    '.hptop-in>a.hplogo img{height:54px!important;width:auto!important;max-width:170px!important;border-radius:6px!important;display:block!important}' +
    'nav.hpnav{flex:1 1 auto!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important;margin:0!important;padding:0!important;box-sizing:border-box!important}' +
    'nav.hpnav a{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;height:52px!important;padding:0 8px!important;box-sizing:border-box!important;margin:0!important;' +
    'border-radius:12px!important;border:1px solid rgba(255,255,255,.2)!important;background:#1b1b22!important;color:#fff!important;' +
    'font:700 16px/1 ' + F + '!important;letter-spacing:0!important;text-transform:none!important;text-decoration:none!important;text-align:center!important;white-space:nowrap!important;box-shadow:none!important}' +
    'nav.hpnav a:hover{border-color:' + acc + '!important}' +
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
    '@media(max-width:700px){.hptop-in{flex-direction:column!important;align-items:stretch!important;gap:8px!important}.hptop-in>a.hplogo{align-self:center!important}.hptop-in>a.hplogo img{height:40px!important}' +
    'nav.hpnav{gap:5px!important}nav.hpnav a{flex-direction:column!important;gap:4px!important;height:56px!important;font-size:12px!important;padding:0 2px!important}' +
    'html body .hpsub>*>a,html body .hpsub>*>span,html body .hpsub>*>button{height:34px!important;padding:0 10px!important;font-size:13px!important}html body .hpsub>*>.hp-right{margin-left:0!important}}' +
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
        }).join('') + '</nav></div>';
      document.body.insertBefore(top, document.body.firstChild);
      // pages that pad the body (the dashboards) still get the bar edge to edge
      var bs = getComputedStyle(document.body);
      ['Left', 'Right', 'Top'].forEach(function (s) { var v = parseFloat(bs['padding' + s]) || 0; if (v) top.style.setProperty('margin-' + s.toLowerCase(), (-v) + 'px', 'important'); });
    }
    var wrap = document.querySelector('html body .hpsub');
    if (!wrap) {
      wrap = document.createElement('div'); wrap.className = 'hpsub'; top.parentNode.insertBefore(wrap, top.nextSibling);
      var bs2 = getComputedStyle(document.body);
      ['Left', 'Right'].forEach(function (k) { var v = parseFloat(bs2['padding' + k]) || 0; if (v) wrap.style.setProperty('margin-' + k.toLowerCase(), (-v) + 'px', 'important'); });
    }
    var s = sub();
    if (s && s.parentNode !== wrap) wrap.appendChild(s);
    tidy(); return true;
  }
  function hideEl(a) { a.style.setProperty('display', 'none', 'important'); }
  function tidy() {
    // old headers
    [].slice.call(document.querySelectorAll('.topbar, header.top')).forEach(function (x) { if (!x.classList.contains('hp-old')) x.classList.add('hp-old'); });
    var s = sub(); if (!s) return;
    // Checklists: Switch Venue / Log Out lived in the old header; bring them into the links row
    [].slice.call(document.querySelectorAll('.topbar .bl-mini, .topbar .bl-acts > button')).forEach(function (b) {
      var t = (b.textContent || '').trim().toLowerCase(); b.classList.add('hp-right'); if (t !== 'switch venue') b.classList.add('hp-out'); s.appendChild(b);
    });
    // links the main menu already gives
    var drop = /^(refusals|staff hub|⌂ staff hub|order list|orders|checklists|checklists ↗|home|main board|manager dashboard|pub dashboard)$/i;
    [].slice.call(s.children).forEach(function (a) {
      var t = (a.textContent || '').replace(/\s+/g, ' ').replace(/\d+$/, '').trim();
      if (drop.test(t) && a.style.display !== 'none') hideEl(a);
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
