const Q=new URLSearchParams(location.search);const TABLE=Q.get('t')||'12';const MODE=Q.get('mode')==='takeaway'?'takeaway':'dine';
const S={cart:[],item:null,sel:{},qty:1,note:'',orders:[],tracking:false,stage:0};
const token=sessionStorage.getItem('tok')||Math.random().toString(36).slice(2,10);sessionStorage.setItem('tok',token);
const $=s=>document.querySelector(s);const app=$('#app');
const cnt=id=>S.cart.filter(l=>l.id===id&&!l.mods.length&&!l.note).reduce((a,l)=>a+l.q,0);
const lineTotal=l=>(l.base+l.mods.reduce((a,m)=>a+m[1],0))*l.q;
const sub=()=>S.cart.reduce((a,l)=>a+lineTotal(l),0);
const svc=s=>MODE==='dine'?Math.round(s*SERVICE/250)*250:0;
const photo0=(it,cls='ph')=>it.img?`<div class="${cls}" style="background-image:url(${IMG(it.img)})"></div>`:`<div class=dk>${ic('cup',26)}</div>`;
const LOGO=`<svg width="34" height="34" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0F5C4D"/><path d="M7 19h18M9 19c0-4 3-7 7-7s7 3 7 7M16 12v-2M6 23h20" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
function tile(it){const q=cnt(it.id);
 const ctl=it.out?`<span class=so>نفد اليوم</span>`:q?`<span class=q><i data-dec="${it.id}">${ic('minus',16,2.4)}</i><b class=num>${ar(q)}</b><i data-inc="${it.id}">${ic('plus',16,2.4)}</i></span>`:`<span class=add data-quick="${it.id}">${ic('plus',18,2.4)}</span>`;
 return `<button class="t ${it.out?'out':''}" data-open="${it.id}"><div class=ph style="background-image:url(${IMG(it.img)})"></div><div class=n>${it.n}</div><div class=d>${it.d}</div><div class=f><span class="p num">${fmt(it.p)} <small>د.ع</small></span>${ctl}</div></button>`}
function render(){
 const n=S.cart.reduce((a,l)=>a+l.q,0);const feat=ITEMS.find(i=>i.big);
 app.innerHTML=`<div class=scr id=scr>
 <header class=top><div class=brand>${LOGO}<div><b>سُفرة</b><small>مطبخ عراقي · الكرادة</small></div></div><div class=tb>${MODE==='dine'?'طاولة '+ar(TABLE):'طلب سفري'}</div></header>
 <button class=feat data-open="${feat.id}"><div class=ph style="background-image:url(${IMG(feat.img)})"></div><div class=fx><small>طبق المطعم</small><b>${feat.n}</b><span class=num>${fmt(feat.p)} د.ع</span></div></button>
 <nav class=cats id=cats>${CATS.map((c,i)=>`<button data-cat="${c.id}" class="${i?'':'on'}">${c.n}</button>`).join('')}</nav>
 ${CATS.map(c=>`<section class=sec id="s-${c.id}"><h2>${c.n}</h2><div class=grid>${ITEMS.filter(i=>i.c===c.id).map(it=>tile(it)).join('')}</div></section>`).join('')}
 <div style="height:${MODE==='dine'?150:100}px"></div></div>
 <div class=dock>${n?`<button class=bar data-cart><span class=cnt>${ar(n)}</span><span>عرض السلة</span><span class=num>${fmt(sub())} د.ع</span></button>`:''}
 ${MODE==='dine'?`<div class=fab><button data-call=captain>${ic('bell',18)}نداء النادل</button><button data-call=bill>${ic('bill',18)}طلب الحساب</button>${S.orders.length?`<button data-track class=tr>${ic('clock',18)}حالة طلبي</button>`:''}</div>`:''}</div>
 <div class=item id=item></div><div class=dim id=dim></div><div class=sh id=sh></div><button class=cta id=cta></button><div class=trk id=trk></div>`;
 spy();}
function spy(){const scr=$('#scr');if(!scr)return;scr.scrollTop=S.scroll||0;scr.onscroll=()=>{S.scroll=scr.scrollTop;let cur=CATS[0].id;for(const c of CATS){const e=$('#s-'+c.id);if(e.offsetTop-80<=scr.scrollTop)cur=c.id}
 document.querySelectorAll('.cats button').forEach(b=>{const on=b.dataset.cat===cur;if(on!==b.classList.contains('on')){b.classList.toggle('on',on);if(on)b.scrollIntoView({inline:'center',block:'nearest'})}})}}
function openItem(id){const it=ITEMS.find(i=>i.id==id);if(it.out)return toast('نفد هذا الصنف اليوم');S.item=it;S.sel={};S.qty=1;S.note='';
 (MODS[it.m]||[]).forEach((g,gi)=>{if(g.req&&g.max===1)S.sel[gi]=[0]});drawItem();requestAnimationFrame(()=>$('#item').classList.add('on'))}
function drawItem(){const it=S.item,G=MODS[it.m]||[];const extra=G.reduce((a,g,gi)=>a+(S.sel[gi]||[]).reduce((b,o)=>b+g.o[o][1],0),0);
 const ok=G.every((g,gi)=>!g.req||(S.sel[gi]||[]).length);
 $('#item').innerHTML=`<div class=hero><div class=ph style="background-image:url(${IMG(it.img)})"></div><button class=rb data-close>${ic('close',20)}</button></div>
 <div class=ib><h2>${it.n}</h2><div class=ds>${it.d}</div><div class="pr num">${fmt(it.p)} د.ع</div></div>
 ${G.map((g,gi)=>`<div class=sx><h3>${g.n}<small class="${g.req?'rq':''}">${g.req?'إلزامي · اختر واحداً':'اختياري'+(g.max>1?' · حتى '+ar(g.max):'')}</small></h3>${g.o.map((o,oi)=>{const on=(S.sel[gi]||[]).includes(oi);return `<button data-g="${gi}" data-o="${oi}" class="opt ${on?'on':''}"><span class="mk ${g.max===1?'r':'c'}">${on&&g.max!==1?ic('check',14,3):''}</span><span class=on2>${o[0]}</span>${o[1]?`<span class=num>+${fmt(o[1])}</span>`:''}</button>`}).join('')}</div>`).join('')}
 <div class=sx><h3>ملاحظة للمطبخ<small>اختياري</small></h3><input class=note id=note placeholder="مثلاً: بدون مخلل" value="${S.note}"></div><div style="height:110px"></div>
 <div class=ibar><span class=stp><button data-q=-1>${ic('minus',18,2.4)}</button><b class=num>${ar(S.qty)}</b><button data-q=1>${ic('plus',18,2.4)}</button></span><button class=go data-addcart ${ok?'':'disabled'}><span>${ok?'أضف إلى السلة':'اختر '+G.find((g,gi)=>g.req&&!(S.sel[gi]||[]).length)?.n}</span><span class=num>${fmt((it.p+extra)*S.qty)} د.ع</span></button></div>`;
 $('#note').oninput=e=>S.note=e.target.value}
function addLine(it,mods,q,note){const key=it.id+'|'+mods.map(m=>m[0]).join(',')+'|'+note;const ex=S.cart.find(l=>l.key===key);if(ex)ex.q+=q;else S.cart.push({key,id:it.id,n:it.n,img:it.img,base:it.p,mods,q,note,st:it.st})}
function openCart(){$('#dim').classList.add('on');const s=sub(),sv=svc(s);const bus=BUS.get();
 $('#sh').innerHTML=`<div class=gr></div><div class=shh><h2>طلبك</h2><span>${MODE==='dine'?'طاولة '+ar(TABLE):'سفري'}</span></div>
 ${S.cart.length?S.cart.map((l,i)=>`<div class=ln><div class=ph style="background-image:url(${IMG(l.img)})"></div><div class=x><b>${l.n}</b>${l.mods.length||l.note?`<small>${[...l.mods.map(m=>m[0]),l.note].filter(Boolean).join('، ')}</small>`:''}<div class=mini><button data-li="${i}" data-d=-1>${ic(l.q>1?'minus':'trash',16,2.2)}</button><b class=num>${ar(l.q)}</b><button data-li="${i}" data-d=1>${ic('plus',16,2.4)}</button></div></div><span class="pp num">${fmt(lineTotal(l))}</span></div>`).join(''):`<div class=empty>السلة فارغة</div>`}
 ${S.cart.length?`<div class=sum><div><span>المجموع</span><span class=num>${fmt(s)}</span></div>${sv?`<div><span>رسوم الخدمة ١٠٪</span><span class=num>${fmt(sv)}</span></div>`:''}<div class=t2><span>الإجمالي</span><span class=num>${fmt(s+sv)} د.ع</span></div></div>`:''}
 ${!bus.online?`<div class=warn>${ic('nowifi',18)}<span>الاتصال بالمطعم منقطع حالياً ولا يمكن إرسال الطلب. نادِ النادل ليسجّل طلبك.</span></div>`:''}
 ${S.orders.length?`<div class="warn ok">${ic('check',18)}<span>تُضاف الأصناف الجديدة إلى حساب الطاولة نفسه وتُرسل إلى المطبخ مباشرة.</span></div>`:''}<div style="height:90px"></div>`;
 $('#sh').classList.add('on');const c=$('#cta');c.classList.toggle('on',!!S.cart.length);
 c.innerHTML=bus.online?`<span>${S.orders.length?'أضف إلى طلبي':'أرسل الطلب'}</span><span class=num>${fmt(s+sv)} د.ع</span>`:`<span>${ic('bell',20)} نداء النادل</span>`;c.dataset.act=bus.online?'send':'captain'}
function closeSheets(){$('#dim').classList.remove('on');$('#sh').classList.remove('on');$('#cta').classList.remove('on');$('#item').classList.remove('on')}
function send(){const b=BUS.get();if(!b.online)return;const add=S.orders.length>0;const id=add?S.orders[0].id:(480+b.qr.length+2);
 const o={id,table:MODE==='dine'?TABLE:null,mode:MODE,token,lines:JSON.parse(JSON.stringify(S.cart)),at:Date.now(),add};
 b.qr.push(o);if(!b.status[id])b.status[id]=add?1:0;else if(add)b.status[id]=Math.min(b.status[id],1);BUS.set(b);
 if(add)S.orders[0].lines.push(...o.lines);else S.orders.push({...o});S.cart=[];closeSheets();S.tracking=true;render();drawTrack();if(!(b.posLive&&Date.now()-b.posLive<5000))sim(id)}
function sim(id){[[3000,1],[6000,2],[16000,3],[24000,4]].forEach(([t,s])=>setTimeout(()=>{const b=BUS.get();if(b.posLive&&Date.now()-b.posLive<5000)return;if((b.status[id]||0)<s){b.status[id]=s;BUS.set(b);drawTrack()}},t))}
const STG=['بانتظار التأكيد','تم الاستلام','قيد التحضير','جاهز','قُدّم'];
function drawTrack(){if(!S.tracking||!S.orders.length)return;const o=S.orders[0],b=BUS.get(),st=b.status[o.id]||0;const t=$('#trk');t.classList.add('on');
 const eta={0:'يراجع النادل طلبك الآن',1:'يدخل المطبخ خلال دقيقة',2:'جاهز خلال ١٢ دقيقة تقريباً',3:'في الطريق إلى طاولتك',4:'بالهناء والعافية'}[st];
 const calls=b.alerts.filter(a=>a.table===TABLE&&a.token===token);const cap=calls.find(a=>a.k==='captain'&&!a.done),bill=calls.find(a=>a.k==='bill');
 t.innerHTML=`<header class=top><button class=rb data-home>${ic('back',20)}</button><b>طلب رقم ${ar(o.id)}</b><div class=tb>${MODE==='dine'?'طاولة '+ar(TABLE):'سفري'}</div></header>
 <div class=big><small>الحالة الآن</small><h1>${STG[st]}</h1><div class=eta>${eta}</div><div class=bars>${STG.slice(1).map((n,i)=>`<i class="${st>i?'on':''}"></i>`).join('')}</div></div>
 <div class=st>${STG.map((n,i)=>`<div class="${st>i?'done':st===i?'now':''}"><span class=mk>${st>i?ic('check',14,3):''}</span><b>${n}</b></div>`).join('')}</div>
 <div class=ord><h3>الأصناف</h3>${o.lines.map(l=>`<div class=r><div class=ph style="background-image:url(${IMG(l.img)})"></div><span>${l.q>1?ar(l.q)+' × ':''}${l.n}</span><small>${STATIONS[l.st]}</small></div>`).join('')}
 <button class=add2 data-home>${ic('plus',16,2.4)}أضف أصنافاً إلى الطلب</button></div>
 ${MODE==='dine'?`<div class=act><button data-call=captain class="${cap?'sent':''}">${ic('bell',22)}<span>${cap?'النادل في الطريق':'نداء النادل'}</span></button><button data-call=bill class="pri ${bill?'sent':''}">${ic('bill',22)}<span>${bill?'الحساب في الطريق':'طلب الحساب'}</span></button></div>`:''}`}
function call(k){const b=BUS.get();if(k==='captain'&&!b.online){toast('الاتصال منقطع، أشِر إلى النادل');return}
 b.alerts.push({k,table:TABLE,token,at:Date.now()});BUS.set(b);toast(k==='captain'?'وصل النداء، النادل في طريقه إليك':'وصل طلب الحساب، يحضره النادل الآن');drawTrack()}
app.addEventListener('click',e=>{const T=e.target.closest('[data-quick],[data-inc],[data-dec],[data-open],[data-close],[data-g],[data-q],[data-addcart],[data-cart],[data-li],[data-cat],[data-call],[data-track],[data-home],#dim,#cta');if(!T)return;const d=T.dataset;
 if(d.quick||d.inc){e.stopPropagation();const it=ITEMS.find(i=>i.id==(d.quick||d.inc));if((MODS[it.m]||[]).some(g=>g.req))return openItem(it.id);addLine(it,[],1,'');render();return}
 if(d.dec){e.stopPropagation();const l=S.cart.find(l=>l.id==d.dec&&!l.mods.length&&!l.note);if(l){l.q--;if(!l.q)S.cart.splice(S.cart.indexOf(l),1)}render();return}
 if(d.open)return openItem(d.open);
 if('close' in d)return $('#item').classList.remove('on');
 if(d.g!==undefined){const g=MODS[S.item.m][d.g],a=S.sel[d.g]||[],o=+d.o;if(g.max===1)S.sel[d.g]=a.includes(o)&&!g.req?[]:[o];else S.sel[d.g]=a.includes(o)?a.filter(x=>x!==o):a.length<g.max?[...a,o]:a;drawItem();return}
 if(d.q){S.qty=Math.max(1,S.qty+ +d.q);drawItem();return}
 if('addcart' in d){const G=MODS[S.item.m]||[];const mods=G.flatMap((g,gi)=>(S.sel[gi]||[]).map(o=>g.o[o]));addLine(S.item,mods,S.qty,S.note.trim());toast('أُضيف إلى السلة');render();return}
 if('cart' in d)return openCart();
 if(d.li){const l=S.cart[d.li];l.q+= +d.d;if(!l.q)S.cart.splice(d.li,1);render();if(S.cart.length)openCart();return}
 if(d.cat){const e2=$('#s-'+d.cat);$('#scr').scrollTo({top:e2.offsetTop-60,behavior:'smooth'});return}
 if(d.call)return call(d.call);
 if('track' in d){S.tracking=true;render();drawTrack();return}
 if('home' in d){S.tracking=false;render();return}
 if(T.id==='dim')return closeSheets();
 if(T.id==='cta')return d.act==='send'?send():call('captain')});
BUS.on(()=>{drawTrack()});setInterval(drawTrack,4000);
render();
