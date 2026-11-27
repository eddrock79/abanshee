// roll-out waves (26 Nov 2026): wave 2 from Mon 30 Nov, wave 3 from Mon 7 Dec, 6am; preview with ?wave=2 or ?wave=3
function blWaveOn(n){try{var q=(location.search.match(/[?&]wave=(\d)/)||[])[1];if(q)sessionStorage.setItem('bl_wave',q);if(+(sessionStorage.getItem('bl_wave')||0)>=n)return true;}catch(e){}
  var on={2:'2026-11-30T06:00:00',3:'2026-12-07T06:00:00'}[n];return !on||Date.now()>=new Date(on).getTime();}
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
      [['Staff courses','courses'],['Toilets & refusals','refusals'],['Lost property','lost-property']].forEach(function(t){
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
    var fp=document.createElement('a');fp.className='bl-xlink bl-front';fp.href=window.BL_FRONT||('http://100.90.189.89:8114/board/'+(/rose/i.test(((window.BL_CFG||{}).venueKey||'')+location.hostname)?'br-fe73bad2':'bl-1ce6f0ea'));fp.target='_top';fp.textContent='⌂ Staff Hub';
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
(function(){if(document.querySelector('script[data-hpnav]'))return;var x=document.createElement('script');x.src='/hp-nav.js?v=36';x.setAttribute('data-hpnav','1');document.head.appendChild(x);})();
// safety checks due (fire alarm, emergency lights, extinguishers, water): a strip on End of Night and Weekly Jobs so they get done; tap to log on the Compliance page
(function(){
  return;   // replaced by the quick row under the main tabs (hp-nav.js), which shows the same checks on every page
  if(!/\/(end-of-night|weekly-cleaning)\//.test(location.pathname)) return;
  var U='https://script.google.com/macros/s/AKfycbzGitKoipTO-LeDPf3-cK9pkxfSlHqD_dTdcOQLMYlRmSmRmf6wNLBjfhIO_rC-wRPX/exec';
  var R=[['fire_alarm','Weekly fire alarm test',7,'fire'],['em_light_month','Monthly emergency lights test',31,'fire'],['extinguisher_month','Monthly extinguisher check',31,'fire'],
         ['legionella_flush','Weekly flush of little-used taps',7,'water'],['legionella_temp','Monthly water temperatures',31,'water']];
  function go(){
    var pub=/rose/i.test(((window.BL_CFG||{}).venueKey||'')+location.hostname)?'br':'bl';
    fetch(U+'?action=compliance&pub='+pub+'&t='+Date.now()).then(function(r){return r.json();}).then(function(d){
      if(!d||!d.Checks) return;
      var today=new Date(); today.setHours(12,0,0,0); var soon=new Date(today); soon.setDate(soon.getDate()+1);
      var due=R.map(function(k){
        var last=d.Checks.filter(function(c){return c.Type===k[0];}).map(function(c){return String(c.Date);}).sort().pop();
        var nx=last?new Date(last+'T12:00:00'):null; if(nx) nx.setDate(nx.getDate()+k[2]);
        return (!nx||nx<=soon)?{k:k,last:last,over:!nx||nx<today}:null;
      }).filter(Boolean);
      var old=document.getElementById('bl-safety'); if(old) old.remove();
      if(!due.length) return;
      var el=document.createElement('div'); el.id='bl-safety';
      el.style.cssText='max-width:1400px;margin:10px auto 0;padding:10px 14px;border-radius:12px;border:1px solid #ff9f4366;background:rgba(255,159,67,.10);display:flex;flex-wrap:wrap;gap:8px;align-items:center;font:600 14px system-ui,sans-serif;color:#ffd2a6;box-sizing:border-box';
      el.innerHTML='<span style="margin-right:4px">🔥 Safety checks due</span>'+due.map(function(x){
        var when=!x.last?'not done yet':x.over?'overdue':'due';
        return '<a href="../compliance/?tab='+x.k[3]+'" style="text-decoration:none;color:#fff;background:#2a1d12;border:1px solid #ff9f43;border-radius:999px;padding:6px 12px">'+x.k[1]+' · '+when+' ›</a>';
      }).join('');
      var host=document.querySelector('.hpsub')||document.querySelector('.nav-bar');
      if(host&&host.parentNode){var wrap=document.createElement('div');wrap.style.cssText='padding:0 16px';wrap.appendChild(el);host.parentNode.insertBefore(wrap,host.nextSibling);}
    }).catch(function(){});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(go,800);}); else setTimeout(go,800);
})();
// End of Night: "Toilets checked and clear" at close (nobody left in, no rubbish or problems), logged with the other toilet checks
(function(){
  if(!/\/end-of-night\//.test(location.pathname)||/mode=opening/.test(location.search)) return;
  var U='https://script.google.com/macros/s/AKfycbzGitKoipTO-LeDPf3-cK9pkxfSlHqD_dTdcOQLMYlRmSmRmf6wNLBjfhIO_rC-wRPX/exec';
  function pub(){return /rose/i.test(((window.BL_CFG||{}).venueKey||'')+location.hostname)?'br':'bl';}
  function night(){var d=new Date();if(d.getHours()<6)d.setDate(d.getDate()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function me(){try{return typeof nxMe==='function'?nxMe():'';}catch(e){return '';}}
  var box=null,last=null,closeAt=180;
  function nearClose(){if(!blWaveOn(2))return true;var n=new Date(),m=n.getHours()*60+n.getMinutes(),a=(closeAt-60+1440)%1440,b=360;return a<=b?(m>=a&&m<b):(m>=a||m<b);}
  function draw(){
    if(!box){box=document.createElement('div');box.id='bl-toiletclose';box.style.cssText='max-width:1400px;margin:10px auto 0;padding:10px 14px;border-radius:12px;border:1px solid #4fb8a866;background:rgba(79,184,168,.08);display:flex;flex-wrap:wrap;gap:10px;align-items:center;font:600 15px system-ui,sans-serif;color:#cfeee8;box-sizing:border-box';
      var host=document.getElementById('bl-safety')||document.querySelector('.hpsub')||document.querySelector('.nav-bar');
      if(!host||!host.parentNode) return; var wrap=document.createElement('div');wrap.style.cssText='padding:0 16px';wrap.appendChild(box);
      var after=host.id==='bl-safety'?host.parentNode:host;after.parentNode.insertBefore(wrap,after.nextSibling);}
    if(box.parentNode)box.parentNode.style.display=(last||nearClose())?'':'none';
    box.innerHTML=last?'<span>🚻 Toilets checked and clear at close ✓ <span style="opacity:.75;font-weight:500">'+last.time+' by '+last.by.replace(/[<>&]/g,'')+'</span></span>'
      :'<span>🚻 Closing check: toilets checked and clear (nobody left in, no rubbish, nothing broken)</span><button type="button" id="bl-tc-go" style="font:inherit;font-weight:800;padding:9px 16px;border-radius:10px;border:0;background:#4fb8a8;color:#0a0a0b;cursor:pointer">Toilets checked and clear</button>';
    var b=document.getElementById('bl-tc-go'); if(b) b.onclick=save;
  }
  function save(){
    var n=me(); if(!n){n=(prompt('Your name:')||'').trim().slice(0,30); if(!n) return;}
    var b=document.getElementById('bl-tc-go'); b.disabled=true; b.textContent='Saving…';
    fetch(U,{method:'POST',body:JSON.stringify({action:'check',pub:pub(),type:'toilet',date:night(),item:'All toilets (closing check)',result:'Pass',notes:'Checked and clear at close',by:n})})
      .then(function(r){return r.json();}).then(function(j){
        if(!j.ok) throw 0; var d=new Date(); last={time:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'),by:n}; draw();
      }).catch(function(){b.disabled=false;b.textContent='Toilets checked and clear';alert('Couldn’t save. Check the wifi and try again.');});
  }
  function load(){
    fetch(U+'?action=compliance&pub='+pub()+'&t='+Date.now()).then(function(r){return r.json();}).then(function(d){
      var c=(d&&d.Checks||[]).filter(function(x){return x.Type==='toilet'&&x.Item==='All toilets (closing check)'&&String(x.Date).slice(0,10)===night();}).pop();
      var s=(d&&d.Settings||[]).filter(function(x){return x.Key==='toilet_hours';})[0],hm=String(s&&s.Value||'16:00-03:00').match(/-\s*(\d{1,2}):?(\d{2})?/);if(hm)closeAt=(+hm[1]*60+(+hm[2]||0))%1440;
      if(c) last={time:String(c.Time||''),by:String(c.By||'')}; draw();
    }).catch(function(){draw();});
  }
  setInterval(function(){if(box)draw();},5*60000);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(load,1200);}); else setTimeout(load,1200);
})();

// wave 3 (from Mon 7 Dec 2026): a tidier top. Switch Venue and Log Out move to the bottom of the page (they're rarely
// needed), "Staff courses" goes from the second row (it's in the quick row and All pages); the row keeps End of Night,
// Weekly and Monthly Jobs, and disappears on pages that have nothing else in it.
(function(){
  if(!blWaveOn(3)) return;
  function tidy(){
    var nb=document.querySelector('.nav-bar'); if(!nb||nb.dataset.w3) return; nb.dataset.w3='1';
    var foot=document.createElement('div'); foot.id='bl-foot';
    foot.style.cssText='display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:40px auto 24px;padding:0 16px;opacity:.85';
    Array.prototype.slice.call(document.querySelectorAll('button,a')).forEach(function(b){
      var t=(b.textContent||'').trim().toLowerCase();
      if((t==='switch venue'||t==='log out'||t==='logout')&&!b.closest('#bl-foot')&&!b.closest('#bla-chip')&&b.matches('.nav-btn,.bl-mini,.hp-right,.hp-out,#nav-logout')) foot.appendChild(b);
      else if(t==='staff courses'&&b.closest('.nav-bar')) b.style.display='none';
    });
    if(foot.children.length) document.body.appendChild(foot);
    var left=Array.prototype.slice.call(nb.children).filter(function(c){return c.getBoundingClientRect().height>0;});
    if(!left.length) nb.style.display='none';
  }
  window.addEventListener('load',function(){setTimeout(tidy,1500);});
})();

// Banshee only: 2:30am heater check — MQS Room, Gig Room and Top Bar each confirmed separately. Shown on every page from 02:30
// until 06:00 until all three are confirmed. Each is logged with the compliance checks (type "heaters") so every iPad sees it;
// if the sheet can't take it, it is remembered on this iPad. Preview any time with ?heaters=1 (nothing saved).
(function(){
  if(/rose/i.test(((window.BL_CFG||{}).venueKey||'')+location.hostname)) return;
  var U='https://script.google.com/macros/s/AKfycbzGitKoipTO-LeDPf3-cK9pkxfSlHqD_dTdcOQLMYlRmSmRmf6wNLBjfhIO_rC-wRPX/exec';
  var ROOMS=['MQS Room','Gig Room','Top Bar'], box=null, done={}, force=/[?&]heaters=1/.test(location.search), lastName='', lastNameAt=0;
  function night(){var d=new Date();if(d.getHours()<6)d.setDate(d.getDate()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function due(){var d=new Date(),m=d.getHours()*60+d.getMinutes();return force||(m>=150&&m<360);}
  function me(){try{return typeof nxMe==='function'?nxMe():'';}catch(e){return '';}}
  function esc(s){return String(s||'').replace(/[<>&"]/g,'');}
  function localGet(){try{var x=JSON.parse(localStorage.getItem('bl_heaters2')||'null');return x&&x.night===night()?x.rooms||{}:{};}catch(e){return {};}}
  function localPut(room,v){try{var x=JSON.parse(localStorage.getItem('bl_heaters2')||'null');if(!x||x.night!==night())x={night:night(),rooms:{}};x.rooms[room]=v;localStorage.setItem('bl_heaters2',JSON.stringify(x));}catch(e){}}
  function state(room){return done[room]||localGet()[room]||null;}
  function draw(){
    if(!due()){if(box&&box.parentNode)box.parentNode.style.display='none';return;}
    if(!box){box=document.createElement('div');box.id='bl-heaters';
      box.style.cssText='max-width:1400px;margin:10px auto 0;padding:12px 14px;border-radius:12px;font:700 16px system-ui,sans-serif;box-sizing:border-box';
      var host=document.getElementById('bl-toiletclose')||document.getElementById('bl-safety')||document.querySelector('.hpsub')||document.querySelector('.nav-bar');
      if(!host||!host.parentNode) return; var wrap=document.createElement('div');wrap.style.cssText='padding:0 16px';wrap.appendChild(box);
      var after=(host.id==='bl-safety'||host.id==='bl-toiletclose')?host.parentNode:host;after.parentNode.insertBefore(wrap,after.nextSibling);}
    box.parentNode.style.display='';
    var all=ROOMS.every(state);
    box.style.background=all?'rgba(122,211,138,.10)':'rgba(255,195,90,.14)';box.style.border=all?'1px solid #7ad38a66':'2px solid #ffc35a';box.style.color=all?'#cdeed3':'#ffe3b0';
    var h='<div style="margin-bottom:'+(all?'4px':'10px')+'">🔥 '+(all?'Heaters off ✓':'2:30am check: confirm each heater is switched off')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">';
    ROOMS.forEach(function(r,k){var s=state(r);
      h+=s?'<span style="padding:9px 14px;border-radius:10px;background:rgba(122,211,138,.16);color:#cdeed3;font-weight:600">'+r+' off ✓ <span style="opacity:.75;font-weight:500">'+esc(s.time)+' · '+esc(s.by)+(s.local?' (this iPad)':'')+'</span></span>'
          :'<button type="button" data-k="'+k+'" style="font:inherit;font-weight:800;padding:10px 16px;border-radius:10px;border:0;background:#ffc35a;color:#1a1000;cursor:pointer">'+r+' heater is off</button>';});
    box.innerHTML=h+'</div>';
    box.querySelectorAll('button[data-k]').forEach(function(b){b.onclick=function(){save(ROOMS[+b.dataset.k],b);};});
  }
  function who(){
    var n=me(); if(n) return n;
    if(lastName&&Date.now()-lastNameAt<10*60000) return lastName;       // asked a moment ago: don't ask again for the next heater
    n=(prompt('Your name:')||'').trim().slice(0,30); if(n){lastName=n;lastNameAt=Date.now();} return n;
  }
  function save(room,b){
    var n=who(); if(!n) return;
    b.disabled=true; b.textContent='Saving…';
    var d=new Date(),t=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    if(force){done[room]={time:t,by:n};draw();return;}
    fetch(U,{method:'POST',body:JSON.stringify({action:'check',pub:'bl',type:'heaters',date:night(),item:'Heater off: '+room,result:'Done',notes:'Confirmed at the 2:30am check',by:n})})
      .then(function(r){return r.json();}).then(function(j){if(!j.ok) throw 0; done[room]={time:t,by:n}; draw();})
      .catch(function(){localPut(room,{time:t,by:n,local:true}); draw();});
  }
  function load(){
    if(!due()){draw();return;}
    fetch(U+'?action=compliance&pub=bl&t='+Date.now()).then(function(r){return r.json();}).then(function(d){
      (d&&d.Checks||[]).filter(function(x){return x.Type==='heaters'&&String(x.Date).slice(0,10)===night();}).forEach(function(c){
        var v={time:String(c.Time||''),by:String(c.By||'')},it=String(c.Item||'');
        ROOMS.forEach(function(r){if(it.indexOf(r)>=0&&(it.indexOf('Heaters off:')!==0||!done[r]))done[r]=v;});   // the old all-in-one entry counts for all three
      }); draw();
    }).catch(function(){draw();});
  }
  setInterval(load,5*60000);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(load,1500);}); else setTimeout(load,1500);
})();
