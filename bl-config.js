/* BANSHEE LABYRINTH — bl-config.js  (Bakes the REAL Banshee values + TEST pins, so the clone runs immediately.)
   window.BL_CFG = this venue's sheet IDs / script URLs / PINs.
   Sourced from the central Google "config" sheet at runtime; baked defaults are
   a fallback so apps never hard-break. Storage is namespaced to "banshee".
   The ONLY hard-coded value to set later is CONFIG_SHEET_ID. Master edit-rights
   on that sheet are enforced by Google sharing, not by the app. */
(function(){
  var VENUE="banshee";
  try{ var P="bl:"+VENUE+":",ls=window.localStorage,_g=ls.getItem.bind(ls),_s=ls.setItem.bind(ls),_r=ls.removeItem.bind(ls);
    ls.getItem=function(k){return _g(P+k);};ls.setItem=function(k,x){return _s(P+k,x);};ls.removeItem=function(k){return _r(P+k);}; }catch(e){}
  var CONFIG_SHEET_ID="PUT_CENTRAL_CONFIG_SHEET_ID_HERE",CACHE_KEY="bl_cfg_cache",FETCH_MS=7000;
  var DEFAULTS={venueKey:VENUE,venueName:"Banshee Labyrinth",
    weeklyJobs:"1n_k9VpZmqWhFuj95k0JJFewh8Vi1maYJscPASE09zwg",endOfNight:"1YDUyDlkj_Z5FeTVPFQWsiy_TOKcVEw4uLanvhiGOq8c",cocktails:"1ujPg9uvHjsUhOKkhSX7LN2f-z6vuHsp9ZVWyDIkXK7k",
    notesScript:"https://script.google.com/macros/s/AKfycbwmPEJGfKL26fZn9aso1W_AyskBNzCdbHeTJ-uEAC1aX3X57ND6qk_7CEJqSuHftaKB/exec",sharedScript:"https://script.google.com/macros/s/AKfycbwcC6rFou4PFhuqDejOhEVgPD-GBFKm3fGlKiFx2HN3YyUDI8d6u1v63L2jJwUalnwj/exec",cleaningScript:"https://script.google.com/macros/s/AKfycbwmPEJGfKL26fZn9aso1W_AyskBNzCdbHeTJ-uEAC1aX3X57ND6qk_7CEJqSuHftaKB/exec",eonScript:"https://script.google.com/macros/s/AKfycbyx4KQRQbMx97EJFWMzxNaPE2SkPunBcT31Cm7blohX6blLhUj6i3FvEN2pB4If6wwR/exec",
    staffPin:"1234",managerPin:"1111",masterPin:"8350"};
  var cached={}; try{cached=JSON.parse(localStorage.getItem(CACHE_KEY)||"{}");}catch(e){}
  window.BL_CFG=Object.assign({},DEFAULTS,cached);
  function pc(l){var o=[],c="",q=false;for(var i=0;i<l.length;i++){var ch=l[i];if(ch==='"')q=!q;else if(ch===','&&!q){o.push(c);c="";}else c+=ch;}o.push(c);return o;}
  function cl(s){return (s||"").replace(/^"|"$/g,"").trim();}
  async function refresh(){
    if(!CONFIG_SHEET_ID||CONFIG_SHEET_ID.indexOf("PUT_")===0)return;
    var url="https://docs.google.com/spreadsheets/d/"+CONFIG_SHEET_ID+"/gviz/tq?tqx=out:csv&sheet=config";
    var ctrl=new AbortController(),t=setTimeout(function(){ctrl.abort();},FETCH_MS);
    try{var res=await fetch(url,{signal:ctrl.signal});clearTimeout(t);if(!res.ok)throw 0;
      var rows=(await res.text()).split("\n").filter(function(l){return l.trim();}).map(pc);
      if(rows.length<2)return; var head=rows[0].map(cl),out={};
      for(var r=1;r<rows.length;r++){var row=rows[r].map(cl),rec={};head.forEach(function(h,i){rec[h]=row[i]||"";});
        if(rec.venue_key===VENUE){out={venueKey:VENUE,venueName:rec.venue_name||DEFAULTS.venueName,
          weeklyJobs:rec.weekly_jobs_sheet_id,endOfNight:rec.end_of_night_sheet_id,cocktails:rec.cocktails_sheet_id,
          notesScript:rec.notes_script_url,cleaningScript:rec.cleaning_script_url,eonScript:rec.eon_script_url,
          staffPin:rec.staff_pin,managerPin:rec.manager_pin,masterPin:rec.master_pin};break;} }
      Object.keys(out).forEach(function(k){if(!out[k])delete out[k];});
      var m=Object.assign({},DEFAULTS,out);localStorage.setItem(CACHE_KEY,JSON.stringify(m));
      window.BL_CFG=Object.assign(window.BL_CFG,m);
    }catch(e){clearTimeout(t);}
  }
  refresh(); window.BLConfig={get:function(){return window.BL_CFG;},refresh:refresh};
})();
