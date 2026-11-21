/* Shared Banshee Labyrinth header: logo + "Scotland's Most Haunted Pub" on the left, today's date on the right.
   Keeps every existing element (role chip, status, refresh controls) - only swaps the title/logo and adds the date. */
(function(){
  var css=document.createElement('style');
  css.textContent=
   '.topbar .bl-brand{display:flex;align-items:center;gap:14px;min-width:0}'+
   '.topbar{height:auto!important;min-height:56px;padding-top:10px!important;padding-bottom:10px!important}'+
   '.topbar .bl-brand{align-items:baseline;flex-wrap:wrap}'+
   '.topbar .bl-brand img{height:78px;max-width:100%;width:auto;display:block;mix-blend-mode:screen}'+
   '.topbar .bl-tag{font-family:"Barlow Condensed","Arial Narrow",sans-serif;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#4fb8a8;white-space:nowrap}'+
   '.topbar .bl-date{font-size:15px;color:var(--muted);white-space:nowrap}'+
   '.topbar .bl-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;align-self:flex-start}.topbar .bl-rrow{display:flex;align-items:center;gap:10px}'+
   '@media(max-width:640px){.topbar .bl-tag{display:none}.topbar .bl-brand img{height:56px}}';
  var fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600&display=swap';document.head.appendChild(fl);
  document.head.appendChild(css);
  function run(){
    var tb=document.querySelector('.topbar'); if(!tb||tb.dataset.blHeader) return;
    // Refusals and Lost property get their own tabs, next to Monthly Jobs, on every page
    var nb=document.querySelector('.nav-bar');
    if(nb&&!nb.querySelector('[data-cx]')){
      var after=[].slice.call(nb.querySelectorAll('.nav-btn')).filter(function(x){return /monthly jobs/i.test(x.textContent);})[0];
      [['Refusals','refusals'],['Lost property','lost-property']].forEach(function(t){
        var cur=location.pathname.indexOf('/'+t[1]+'/')>=0, el=document.createElement(cur?'span':'a');
        el.className='nav-btn'+(cur?' current':''); el.textContent=t[0]; el.setAttribute('data-cx','1'); if(!cur) el.href='../'+t[1]+'/';
        if(after&&after.parentNode){after.parentNode.insertBefore(el,after.nextSibling); after=el;} else nb.appendChild(el);
      });
    }
    tb.dataset.blHeader='1';
    var old=tb.querySelector('.topbar-logo');
    var centre=tb.querySelector('.topbar-centre-logo');
    if(centre) centre.remove();
    var brand=document.createElement('div'); brand.className='bl-brand';
    brand.innerHTML='<img src="'+(window.BL_LOGO||'../logo.jpg')+'" alt="The Banshee Labyrinth"><span class="bl-tag">Scotland’s Most Haunted Pub</span>';
    if(old) old.replaceWith(brand); else tb.insertBefore(brand,tb.firstChild);
    var right=tb.querySelector('.topbar-right');
    if(!right){right=document.createElement('div');right.className='topbar-right';tb.appendChild(right);}
    right.classList.add('bl-right');
    var row=document.createElement('div');row.className='bl-rrow';
    while(right.firstChild) row.appendChild(right.firstChild);
    var od=row.querySelector('#topbar-date'); if(od) od.style.display='none';
    var d=document.createElement('div'); d.className='bl-date';
    var dt=new Date(),n=dt.getDate(),v=n%100,sfx=['th','st','nd','rd'][(v-20)%10]||['th','st','nd','rd'][v]||'th';
    d.textContent=dt.toLocaleDateString('en-GB',{weekday:'long'})+' '+n+sfx+' '+dt.toLocaleDateString('en-GB',{month:'long'});
    row.appendChild(d); right.appendChild(row);
    var nl=document.querySelector('.nav-bar a[href*="eddrock79nas"]');
    // Front page: back to this pub's board on the NAS (target _top also leaves the board's viewer)
    var fp=document.createElement('a');fp.className='bl-xlink bl-front';fp.href=window.BL_FRONT||'http://100.90.189.89:8114/board/bl';fp.target='_top';fp.textContent='⌂ Staff Hub';
    var lr=document.createElement('div');lr.className='bl-lrow';lr.appendChild(fp);
    if(nl){nl.className='bl-xlink';nl.removeAttribute('id');nl.textContent='Manager Dashboard';lr.appendChild(nl);}
    right.appendChild(lr);
    // Pub Dashboard stands out on the Home page
    if(nl&&/\/home\/?$/.test(location.pathname)) nl.classList.add('hot');
    // Switch Venue and Log Out move up beside the role chip so the tab row fits on one line
    var acts=document.createElement('div');acts.className='bl-acts';
    Array.prototype.slice.call(document.querySelectorAll('.nav-bar .nav-btn')).forEach(function(b){
      var t=(b.textContent||'').trim().toLowerCase();
      if(t==='switch venue'||t==='log out'||t==='logout'){b.classList.remove('nav-btn');b.classList.add('bl-mini');if(t!=='switch venue')b.classList.add('out');
        b.removeAttribute('style');if(b.id==='nav-logout'){var keep=b;keep.dataset.blMoved='1';}acts.appendChild(b);}
    });
    if(acts.children.length) row.insertBefore(acts,row.firstChild);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
// shared main menu (Staff Hub / Checklists / Orders / Refusals), same on every staff page
(function(){if(document.querySelector('script[data-hpnav]'))return;var x=document.createElement('script');x.src='/hp-nav.js?v=4';x.setAttribute('data-hpnav','1');document.head.appendChild(x);})();
