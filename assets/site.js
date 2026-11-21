(function(){
'use strict';
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search), test=params.get('jl_test')==='1';
const production=location.hostname==='zosql.github.io'&&location.pathname.replace(/index\.html$/,'').replace(/\/$/,'')==='/reverse-recruiting-services';
const key='sirat_analytics_consent_v1';let consent='unset',loaded=false;
try{consent=localStorage.getItem(key)||'unset'}catch(e){}
const allowedCampaigns=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
function safeCampaign(k){const v=params.get(k)||'';return /^[A-Za-z0-9_.-]{1,64}$/.test(v)?v:''}
const acquisition=Object.fromEntries(allowedCampaigns.map(k=>[k,safeCampaign(k)]).filter(([,v])=>v));
const source='SS-WEB';let handoff='';
function ref(){if(!handoff)handoff=crypto.randomUUID?crypto.randomUUID().replaceAll('-','').slice(0,12):Math.random().toString(36).slice(2,14);return handoff}
function pageLocation(){const url=new URL(location.origin+location.pathname);if(acquisition.utm_source)url.searchParams.set('utm_source',acquisition.utm_source);if(acquisition.utm_medium)url.searchParams.set('utm_medium',acquisition.utm_medium);if(acquisition.utm_campaign)url.searchParams.set('utm_campaign',acquisition.utm_campaign);return url.toString()}
function enable(){
 if(loaded||!production||test||consent!=='allow')return;
 loaded=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};
 window.gtag('js',new Date());
 window.gtag('config','G-JBKMR3W9M5',{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:pageLocation(),page_referrer:document.referrer?new URL(document.referrer).origin:'',page_title:document.title});
 window.gtag('event','page_view',{page_location:pageLocation(),page_id:'sirat_services',source_code:source,event_schema_version:'1',test_mode:'normal'});
 const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-JBKMR3W9M5';document.head.append(s);
}
const events=[];
function emit(name,data={}){
 const payload={page_id:'sirat_services',source_code:source,event_schema_version:'1',content_version:'preview_v1',test_mode:test?'test':'normal',...data};
 if(test||!production){events.push({event:name,...payload});return}
 if(consent==='allow'&&loaded&&typeof window.gtag==='function')window.gtag('event',name,payload);
}
if(test||!production)window.siratPreviewEvents=events;
function choose(value){consent=value;try{localStorage.setItem(key,value)}catch(e){}$('consent-banner').hidden=true;if(value==='allow'){window['ga-disable-G-JBKMR3W9M5']=false;enable()}else{window['ga-disable-G-JBKMR3W9M5']=true}}
$('consent-yes').onclick=()=>choose('allow');$('consent-no').onclick=()=>choose('deny');
$('privacy-settings').onclick=()=>{$('consent-banner').hidden=false;$('consent-no').focus()};
$('consent-banner').hidden=consent!=='unset';if(consent==='allow')enable();
const nav=$('site-navigation'), toggle=$('nav-toggle');
toggle.onclick=()=>{const show=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(show));nav.setAttribute('aria-hidden',String(!show))};
nav.addEventListener('click',e=>{if(e.target.closest('a')&&matchMedia('(max-width:800px)').matches){toggle.setAttribute('aria-expanded','false');nav.setAttribute('aria-hidden','true')}});
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{
 const card=a.closest('article[id^="service-"]');
 if(!a.dataset.event)a.dataset.event='service_enquiry_clicked';
 if(!a.dataset.service)a.dataset.service=card?card.id.replace('service-','svc_'):'general';
 if(!a.dataset.placement)a.dataset.placement=card?'service_card':a.closest('footer')?'footer':a.closest('#contact')?'closing':'header';
});
document.querySelectorAll('footer a[href*="linkedin.com/in/"]').forEach(a=>{a.dataset.event='linkedin_profile_clicked';a.dataset.placement='footer'});
function decorateWa(a){
 const u=new URL(a.href);const code=a.dataset.service||'general';const text=u.searchParams.get('text')||'Hello, I would like to discuss your job-search services.';
 // Short opaque reference and surface/service code. No analytics identifier, contact information or raw UTM.
 u.searchParams.set('text',text+'\nSource: '+source+' / '+code+'\nReference: '+ref());a.href=u.href;
}
document.addEventListener('click',e=>{
 const a=e.target.closest('a[data-event]');if(!a)return;
 const d=a.dataset,detail={cta_placement:d.placement||'unknown'};
 if(d.tool){detail.tool_version=d.tool;if(d.tool!=='looker'){const u=new URL(a.href);u.searchParams.set('jl_origin','sirat_services');if(test||!production)u.searchParams.set('jl_test','1');a.href=u.href}}
 if(d.video)detail.video_id=d.video;if(d.product)detail.product_code=d.product;if(d.format)detail.format=d.format;
 if(d.service)detail.service_code=d.service;if(d.method)detail.payment_method=d.method;
 if(d.event==='service_enquiry_clicked'){decorateWa(a);detail.destination='whatsapp';detail.handoff_ref=ref()}
 emit(d.event,detail);
});
function observe(id,name,data){const node=$(id);if(!node||!('IntersectionObserver'in window))return;const io=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){emit(name,data);io.disconnect()}},{threshold:0.15});io.observe(node)}
observe('free-tools','free_tools_section_viewed',{section_id:'free_tools'});
observe('support-qr','donation_qr_viewed',{payment_method:'upi_qr',cta_placement:'support'});
let briefStarted=false;const form=$('brief-form');
form.addEventListener('input',()=>{if(!briefStarted){briefStarted=true;emit('search_brief_started',{form_id:'brief_whatsapp'})}});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
 const message=['Hello, I would like personalised job-search support.','Target roles: '+$('brief-role').value.trim(),'Target markets: '+$('brief-market').value.trim(),'Support: '+$('brief-support').value,'Context: '+$('brief-notes').value.trim(),'Source: SS-WEB / brief','Reference: '+ref()].join('\n');
 if(!confirm('Open a WhatsApp draft with the information you entered? You can review it before sending.'))return;
 const u=new URL('https://wa.me/919321234719');u.searchParams.set('text',message);
 emit('service_enquiry_clicked',{cta_placement:'search_brief',service_code:'brief',destination:'whatsapp',handoff_ref:ref()});
 $('brief-status').textContent='WhatsApp draft opened. Nothing has been submitted to Sirat Search yet.';
 window.open(u.href,'_blank','noopener,noreferrer');
});
let videoOpened=false,started=false,completed=false;
$('video-open').onclick=()=>{
 if(videoOpened)return;videoOpened=true;emit('video_embed_opened',{video_id:'xQvsrq1Fp90',cta_placement:'tutorial'});
 const f=document.createElement('iframe');f.id='ss-yt-player';f.title='JibikaLinks V1 tutorial';f.allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';f.allowFullscreen=true;
 const u=new URL('https://www.youtube-nocookie.com/embed/xQvsrq1Fp90');u.searchParams.set('enablejsapi','1');if(location.protocol==='http:'||location.protocol==='https:')u.searchParams.set('origin',location.origin);f.src=u.href;
 $('video-stage').replaceChildren(f);
 const connect=()=>{try{new YT.Player(f.id,{events:{onStateChange:e=>{
 if(e.data===YT.PlayerState.PLAYING&&!started){started=true;emit('video_started',{video_id:'xQvsrq1Fp90',player_type:'youtube_iframe'})}
 if(e.data===YT.PlayerState.ENDED&&!completed&&started){completed=true;emit('video_completed',{video_id:'xQvsrq1Fp90',player_type:'youtube_iframe'})}
 }}})}catch(e){}};
 if(window.YT&&YT.Player)connect();else{window.onYouTubeIframeAPIReady=connect;const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;document.head.append(script)}
};
const qr=$('support-qr'),upi=$('upi-link'),custom=$('custom-amount');let amount='250';
function donation(choice){
 amount=String(choice);document.querySelectorAll('.ss-amount').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.amount===amount)));
 $('custom-wrap').hidden=amount!=='custom';
 const raw=amount==='custom'?Number(custom.value):Number(amount),valid=Number.isInteger(raw)&&raw>0&&raw<=100000;
 const image=window.SIRAT_PRESET_QR?.[amount];if(image){qr.src=image;qr.hidden=false}else{qr.removeAttribute('src');qr.hidden=true}
 $('qr-title').textContent=valid?'₹'+raw.toLocaleString('en-IN')+' voluntary contribution':'Choose your contribution';
 $('qr-note').textContent=image?'Scan the preset QR or use your UPI app.':'Use your UPI app or copy the UPI ID to enter your own amount.';
 const q=new URLSearchParams({pa:'ammajaanpay@apl',pn:'ZOYEB KAMRAN BATLIWALA',cu:'INR'});if(valid)q.set('am',String(raw));upi.href='upi://pay?'+q.toString();upi.setAttribute('aria-disabled',String(amount==='custom'&&!valid));upi.style.opacity=amount==='custom'&&!valid?'.55':'1';
}
document.querySelectorAll('.ss-amount').forEach(b=>b.onclick=()=>donation(b.dataset.amount));custom.addEventListener('input',()=>donation('custom'));
upi.addEventListener('click',e=>{if(upi.getAttribute('aria-disabled')==='true'){e.preventDefault();e.stopPropagation();$('upi-status').textContent='Enter a whole rupee amount between 1 and 100,000.'}});
$('copy-upi').onclick=async()=>{try{await navigator.clipboard.writeText($('upi-id').textContent);$('upi-status').textContent='UPI ID copied. Verify recipient before paying.';emit('donation_intent_clicked',{payment_method:'upi_copy',cta_placement:'support'})}catch(e){$('upi-status').textContent='Copy the UPI ID shown above manually.'}};
donation('250');
})();
