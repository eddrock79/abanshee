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
   '.topbar .bl-date{font-size:12px;color:var(--muted);white-space:nowrap}'+
   '@media(max-width:640px){.topbar .bl-tag{display:none}.topbar .bl-brand img{height:56px}}';
  var fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600&display=swap';document.head.appendChild(fl);
  document.head.appendChild(css);
  function run(){
    var tb=document.querySelector('.topbar'); if(!tb||tb.dataset.blHeader) return;
    tb.dataset.blHeader='1';
    var old=tb.querySelector('.topbar-logo');
    var centre=tb.querySelector('.topbar-centre-logo');
    if(centre) centre.remove();
    var brand=document.createElement('div'); brand.className='bl-brand';
    brand.innerHTML='<img src="'+(window.BL_LOGO||'../logo.jpg')+'" alt="The Banshee Labyrinth"><span class="bl-tag">Scotland’s Most Haunted Pub</span>';
    if(old) old.replaceWith(brand); else tb.insertBefore(brand,tb.firstChild);
    var right=tb.querySelector('.topbar-right');
    if(!right){right=document.createElement('div');right.className='topbar-right';tb.appendChild(right);}
    if(!right.querySelector('#topbar-date')){
      var d=document.createElement('div'); d.className='bl-date';
      d.textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
      right.appendChild(d);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
