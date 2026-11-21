/* Haunted Pubs — the same main menu on every staff page: Staff Hub / Checklists / Orders / Refusals.
   The page's own links sit directly underneath. One file, copied unchanged to:
   both Checklists sites (/hp-nav.js), the NAS boards (pub-report/hp-nav.js) and the Manager Dashboards (venue-bl, venue-br). */
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
  function build() {
    if (document.querySelector('nav.hpnav')) return true;
    var P = pub(), site = P === 'br' ? 'https://blackrose.hauntedpubs.co.uk' : 'https://banshee.hauntedpubs.co.uk';
    var L = [
      ['hub', '⌂', 'Staff Hub', NAS + ':8114/board/' + P],
      ['check', '✓', 'Checklists', site + '/home/'],
      ['orders', '🛒', 'Orders', NAS + ':' + (P === 'br' ? '8102' : '8101') + '/orders.html'],
      ['refusals', '🚫', 'Refusals', site + '/refusals/']
    ];
    var cur = port === '8114' || /start-b[lr]\.html/.test(path) ? 'hub'
      : /orders/.test(path) ? 'orders'
      : /\/refusals\//.test(path) ? 'refusals'
      : /hauntedpubs\.co\.uk$/.test(h) ? 'check' : '';
    var acc = P === 'br' ? '#e9b23f' : '#c6e03c';
    if (!document.getElementById('hpnav-css')) {
      var st = document.createElement('style'); st.id = 'hpnav-css';
      st.textContent =
        'nav.hpnav{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;margin:0 0 10px!important;padding:0!important;box-sizing:border-box!important;width:100%!important}' +
        'nav.hpnav a{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-height:50px!important;padding:8px 10px!important;box-sizing:border-box!important;' +
        'border-radius:12px!important;border:1px solid rgba(255,255,255,.18)!important;background:rgba(255,255,255,.06)!important;color:#fff!important;' +
        'font:700 16px/1.15 system-ui,-apple-system,"Segoe UI",sans-serif!important;letter-spacing:0!important;text-transform:none!important;text-decoration:none!important;text-align:center!important;white-space:nowrap!important}' +
        'nav.hpnav a:hover{border-color:' + acc + '!important}' +
        'nav.hpnav a[aria-current=page]{background:' + acc + '!important;border-color:' + acc + '!important;color:#111!important}' +
        'nav.hpnav a i{font-style:normal!important;font-size:18px!important;line-height:1!important}' +
        '@media(max-width:600px){nav.hpnav{gap:5px!important}nav.hpnav a{flex-direction:column!important;gap:3px!important;min-height:54px!important;font-size:13px!important;padding:6px 4px!important}}' +
        'body>nav.hpnav{width:auto!important;margin:14px 16px 10px!important}' +
        '@media print{nav.hpnav{display:none!important}}';
      document.head.appendChild(st);
    }
    var nav = document.createElement('nav'); nav.className = 'hpnav'; nav.setAttribute('aria-label', 'Main menu');
    nav.innerHTML = L.map(function (x) {
      return '<a href="' + x[3] + '" target="_top"' + (x[0] === cur ? ' aria-current="page"' : '') + '><i aria-hidden="true">' + x[1] + '</i>' + x[2] + '</a>';
    }).join('');
    // sits directly above the page's own links
    var sub = document.querySelector('#quick3, nav.otop, .nav-bar');
    if (sub && sub.parentNode) sub.parentNode.insertBefore(nav, sub);
    else if (document.body) document.body.insertBefore(nav, document.body.firstChild);
    else return false;
    tidy(); return true;
  }
  // links now in the main menu come out of the page's own rows
  function tidy() {
    var drop = /^(refusals|staff hub|⌂ staff hub|order list|checklists ↗|home)$/i;
    [].slice.call(document.querySelectorAll('.nav-bar .nav-btn, nav.otop a, .bl-xlink, #quick3 a')).forEach(function (a) {
      if (drop.test((a.textContent || '').replace(/\s+/g, ' ').trim())) a.style.setProperty('display', 'none', 'important');
    });
  }
  function go() { if (build()) { tidy(); new MutationObserver(function () { if (!document.querySelector('nav.hpnav')) build(); else tidy(); }).observe(document.body, { childList: true, subtree: true }); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
