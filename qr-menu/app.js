const Q=new URLSearchParams(location.search);const TABLE=Q.get('t')||'12';const MODE=Q.get('mode')==='takeaway'?'takeaway':'dine';
const S={cart:[],item:null,sel:{},qty:1,note:'',orders:[],tracking:false,stage:0};
const token=sessionStorage.getItem('tok')||Math.random().toString(36).slice(2,10);sessionStorage.setItem('tok',token);
const $=s=>document.querySelector(s);const app=$('#app');
const cnt=id=>S.cart.filter(l=>l.id===id&&!l.mods.length&&!l.note).reduce((a,l)=>a+l.q,0);
const lineTotal=l=>(l.base+l.mods.reduce((a,m)=>a+m[1],0))*l.q;
const sub=()=>S.cart.reduce((a,l)=>a+lineTotal(l),0);
const svc=s=>MODE==='dine'?Math.round(s*SERVICE/250)*250:0;
const photo=(it,cls='ph')=>it.img?`<div class="${cls}" style="background-image:url(${IMG(it.img)})"></div>`:`<div class=dk>${ic('cup',26)}</div>`;
function tile(it,i,wide){const q=cnt(it.id),c=TILE[i%4],f=TILEFG[i%4];
 const ctl=it.out?`<span class=so>خلص اليوم</span>`:q?`<span class=q><i data-dec="${it.id}">${ic('minus',16,2.6)}</i>${ar(q)}<i data-inc="${it.id}">${ic('plus',16,2.6)}</i></span>`:`<span class=add data-quick="${it.id}">${ic('plus',20,2.6)}</span>`;
 return `<button class="t ${wide?'wide':''} ${it.out?'out':''}" data-open="${it.id}" style="background:${c};color:${f}">${it.img?`<div class="ph" style="background-image:url(${IMG(it.img)})"></div>`:`<span class=cup>${ic('cup',90,1.6)}</span>`}<div class=n>${it.n}</div><div class="p num">${fmt(it.p)} د.ع</div>${ctl}</button>`}
function render(){
 const n=S.cart.reduce((a,l)=>a+l.q,0);
 app.innerHTML=`<div class=scr id=scr>
 <div class=top><div class="logo L">بيت الفحم</div><div class="tb pill">${MODE==='dine'?'طاولة '+ar(TABLE):'طلب سفري'}</div></div>
 <h1 class="hi L">شنو<br><span>تشتهي</span> اليوم؟</h1>
 <nav class=cats id=cats>${CATS.map((c,i)=>`<button data-cat="${c.id}" class="${i?'':'on'}">${c.n}</button>`).join('')}</nav>
 ${CATS.map(c=>`<section class=sec id="s-${c.id}"><h2 class=L>${c.n}</h2><div class=grid>${ITEMS.filter(i=>i.c===c.id).map((it,i)=>tile(it,i+CATS.indexOf(c),it.big)).join('')}</div></section>`).join('')}
 </div>
 ${MODE==='dine'?`<div class=fab><button class=pill data-call=captain>${ic('bell',17)}نادِ الكابتن</button><button class=pill data-call=bill>${ic('bill',17)}اطلب الحساب</button>${S.orders.length?`<button class=pill data-track style="margin-right:auto;background:var(--herb);color:var(--surface)">${ic('clock',17)}طلبك</button>`:''}</div>`:''}
 ${n?`<button class=bar data-cart><span class=num>${n===1?'صنف واحد':ar(n)+' أصناف'} · ${fmt(sub())} د.ع</span><span class="pill go">${ic('bag',18)}السلة</span></button>`:''}
 <div class=item id=item></div><div class=dim id=dim></div><div class=sh id=sh></div><button class="cta pill" id=cta></button><div class=trk id=trk></div>`;
 spy();}
function spy(){const scr=$('#scr');if(!scr)return;scr.scrollTop=S.scroll||0;scr.onscroll=()=>{S.scroll=scr.scrollTop;let cur=CATS[0].id;for(const c of CATS){const e=$('#s-'+c.id);if(e.offsetTop-80<=scr.scrollTop)cur=c.id}
 document.querySelectorAll('.cats button').forEach(b=>{const on=b.dataset.cat===cur;if(on!==b.classList.contains('on')){b.classList.toggle('on',on);if(on)b.scrollIntoView({inline:'center',block:'nearest'})}})}}
function openItem(id){const it=ITEMS.find(i=>i.id==id);if(it.out)return toast('هذا الصنف خلص اليوم');S.item=it;S.sel={};S.qty=1;S.note='';
 (MODS[it.m]||[]).forEach((g,gi)=>{if(g.req&&g.max===1)S.sel[gi]=[0]});drawItem();requestAnimationFrame(()=>$('#item').classList.add('on'))}
function drawItem(){const it=S.item,G=MODS[it.m]||[];const extra=G.reduce((a,g,gi)=>a+(S.sel[gi]||[]).reduce((b,o)=>b+g.o[o][1],0),0);
 const ok=G.every((g,gi)=>!g.req||(S.sel[gi]||[]).length);
 $('#item').innerHTML=`<div class=hero style="background:${it.img?'var(--tomato)':'var(--caramel)'}"><button class=rb data-close>${ic('back',20)}</button>${it.img?`<div class="ph" style="background-image:url(${IMG(it.img)})"></div>`:`<span style="position:absolute;left:30px;top:110px;opacity:.4">${ic('cup',200,1.4)}</span>`}
 <h2 class=L>${it.n}</h2><div class="pr num">${fmt(it.p)} د.ع</div><div class=ds>${it.d}</div></div>
 ${G.map((g,gi)=>`<div class=sx><h3 class=L>${g.n}<small class="${g.req?((S.sel[gi]||[]).length?'ok':''):'op'}">${g.req?'إجباري':'اختياري'}</small></h3><div class=ch>${g.o.map((o,oi)=>{const on=(S.sel[gi]||[]).includes(oi);return `<button data-g="${gi}" data-o="${oi}" class="${on?'on':''} ${on&&!g.req?'x':''}">${on?ic('check',16,3):''}${o[0]}${o[1]?` <span class=num>+${fmt(o[1])}</span>`:''}</button>`}).join('')}</div></div>`).join('')}
 <div class=sx><h3 class=L>ملاحظة للمطبخ</h3><input class=note id=note placeholder="مثلاً: بدون مخلل" value="${S.note}"></div>
 <div class=bar style="position:fixed;max-width:398px;margin:auto;padding:0 10px"><span class="pill stp"><button data-q=1>${ic('plus',16,2.6)}</button><span class=num>${ar(S.qty)}</span><button data-q=-1>${ic('minus',16,2.6)}</button></span><button class="pill go" data-addcart style="flex:1;margin-right:10px" ${ok?'':'disabled'}>${ok?'أضف للسلة':'اختار '+G.find((g,gi)=>g.req&&!(S.sel[gi]||[]).length)?.n} · <span class=num>${fmt((it.p+extra)*S.qty)}</span></button></div>`;
 const bar=$('#item .bar');bar.style.position='sticky';bar.style.marginTop='24px';bar.style.bottom='16px';bar.style.left='0';bar.style.right='0';bar.style.marginInline='16px';
 $('#note').oninput=e=>S.note=e.target.value}
function addLine(it,mods,q,note){const key=it.id+'|'+mods.map(m=>m[0]).join(',')+'|'+note;const ex=S.cart.find(l=>l.key===key);if(ex)ex.q+=q;else S.cart.push({key,id:it.id,n:it.n,img:it.img,base:it.p,mods,q,note,st:it.st})}
function openCart(){$('#dim').classList.add('on');const s=sub(),sv=svc(s);const bus=BUS.get();
 $('#sh').innerHTML=`<div class=gr></div><h2 class=L>سلتك<span>${MODE==='dine'?'طاولة '+ar(TABLE):'سفري'}</span></h2>
 ${S.cart.length?S.cart.map((l,i)=>`<div class=ln>${l.img?`<div class="ph" style="background-image:url(${IMG(l.img)})"></div>`:`<div class=dk>${ic('cup',26)}</div>`}<div class=x><b>${l.n}</b>${l.mods.length||l.note?`<small>${[...l.mods.map(m=>m[0]),l.note].filter(Boolean).join(' · ')}</small>`:''}<div class="pp num">${fmt(lineTotal(l))} د.ع</div></div><div class=mini><button data-li="${i}" data-d=-1>${ic('minus',14,2.6)}</button><span class=num>${ar(l.q)}</span><button data-li="${i}" data-d=1>${ic('plus',14,2.6)}</button></div></div>`).join(''):`<div class=empty>السلة فارغة</div>`}
 ${S.cart.length?`<div class=sum><div><span>المجموع</span><span class=num>${fmt(s)}</span></div>${sv?`<div><span>الخدمة ١٠٪</span><span class=num>${fmt(sv)}</span></div>`:''}<div class=t2><span>الإجمالي</span><span class=num>${fmt(s+sv)} د.ع</span></div></div>`:''}
 ${!bus.online?`<div class=warn>الاتصال بالمطعم منقطع حالياً، الطلب ما يكدر يوصل. نادِ الكابتن وهو ياخذ طلبك.</div>`:''}
 ${S.orders.length?`<div class=warn style="background:var(--herb)">الأصناف الجديدة تنضاف على نفس حساب الطاولة وتروح للمطبخ مباشرة.</div>`:''}`;
 $('#sh').classList.add('on');const c=$('#cta');c.classList.toggle('on',!!S.cart.length);
 c.innerHTML=bus.online?(S.orders.length?'أضف على طلبي':'اطلب هسه'):`${ic('bell',20)}نادِ الكابتن`;c.dataset.act=bus.online?'send':'captain'}
function closeSheets(){$('#dim').classList.remove('on');$('#sh').classList.remove('on');$('#cta').classList.remove('on');$('#item').classList.remove('on')}
function send(){const b=BUS.get();if(!b.online)return;const add=S.orders.length>0;const id=add?S.orders[0].id:(480+b.qr.length+2);
 const o={id,table:MODE==='dine'?TABLE:null,mode:MODE,token,lines:JSON.parse(JSON.stringify(S.cart)),at:Date.now(),add};
 b.qr.push(o);if(!b.status[id])b.status[id]=add?1:0;else if(add)b.status[id]=Math.min(b.status[id],1);BUS.set(b);
 if(add)S.orders[0].lines.push(...o.lines);else S.orders.push({...o});S.cart=[];closeSheets();S.tracking=true;render();drawTrack();if(!(b.posLive&&Date.now()-b.posLive<5000))sim(id)}
function sim(id){[[3000,1],[6000,2],[16000,3],[24000,4]].forEach(([t,s])=>setTimeout(()=>{const b=BUS.get();if(b.posLive&&Date.now()-b.posLive<5000)return;if((b.status[id]||0)<s){b.status[id]=s;BUS.set(b);drawTrack()}},t))}
const STG=['بانتظار التأكيد','استلمنا','يتحضر','جاهز','انقدم'];
function drawTrack(){if(!S.tracking||!S.orders.length)return;const o=S.orders[0],b=BUS.get(),st=b.status[o.id]||0;const t=$('#trk');t.classList.add('on');
 const eta={0:'الكابتن يأكد طلبك هسه',1:'يدخل المطبخ خلال دقيقة',2:'جاهز خلال ١٢ دقيقة تقريباً',3:'دا يجيك هسه',4:'بالعافية عليك'}[st];
 const calls=b.alerts.filter(a=>a.table===TABLE&&a.token===token);const cap=calls.find(a=>a.k==='captain'&&!a.done),bill=calls.find(a=>a.k==='bill');
 t.innerHTML=`<div class=top><button class=rb data-home>${ic('back',20)}</button><div class="tb pill">${MODE==='dine'?'طاولة '+ar(TABLE):'سفري، رقم '+ar(o.id)}</div></div>
 <div class=big><div class=s>طلبك رقم ${ar(o.id)}</div><h1 class=L>${STG[st]}</h1><div class=eta>${eta}</div></div>
 <div class=st>${STG.slice(1).map((n,i)=>`<div class="${st>i+1?'done':st===i+1?'now':''}">${n}</div>`).join('')}</div>
 <div class=ord>${o.lines.map(l=>`<div class=r>${l.img?`<div class="ph" style="background-image:url(${IMG(l.img)})"></div>`:`<div class=dk>${ic('cup',22)}</div>`}<span>${l.q>1?ar(l.q)+'× ':''}${l.n}</span><span class=s2>${STATIONS[l.st]}</span></div>`).join('')}
 <button class="pill add2" data-home>${ic('plus',16,2.6)}أضف على نفس الطلب</button></div>
 ${MODE==='dine'?`<div class=act><button data-call=captain class="${cap?'sent':''}" style="background:var(--saffron)">${ic('bell',28)}<span>نادِ الكابتن${cap?'<br><small>الكابتن جاي</small>':''}</span></button><button data-call=bill class="${bill?'sent':''}" style="background:var(--ink);color:var(--surface)">${ic('bill',28)}<span>اطلب الحساب${bill?'<br><small>الحساب بالطريق</small>':''}</span></button></div>`:''}`}
function call(k){const b=BUS.get();if(k==='captain'&&!b.online){toast('الاتصال منقطع، أشّر للكابتن');return}
 b.alerts.push({k,table:TABLE,token,at:Date.now()});BUS.set(b);toast(k==='captain'?'وصل النداء، الكابتن جاي لطاولتك':'وصل طلب الحساب، الكابتن يجيبه هسه');drawTrack()}
app.addEventListener('click',e=>{const T=e.target.closest('[data-quick],[data-inc],[data-dec],[data-open],[data-close],[data-g],[data-q],[data-addcart],[data-cart],[data-li],[data-cat],[data-call],[data-track],[data-home],#dim,#cta');if(!T)return;const d=T.dataset;
 if(d.quick||d.inc){e.stopPropagation();const it=ITEMS.find(i=>i.id==(d.quick||d.inc));if((MODS[it.m]||[]).some(g=>g.req))return openItem(it.id);addLine(it,[],1,'');render();return}
 if(d.dec){e.stopPropagation();const l=S.cart.find(l=>l.id==d.dec&&!l.mods.length&&!l.note);if(l){l.q--;if(!l.q)S.cart.splice(S.cart.indexOf(l),1)}render();return}
 if(d.open)return openItem(d.open);
 if('close' in d)return $('#item').classList.remove('on');
 if(d.g!==undefined){const g=MODS[S.item.m][d.g],a=S.sel[d.g]||[],o=+d.o;if(g.max===1)S.sel[d.g]=a.includes(o)&&!g.req?[]:[o];else S.sel[d.g]=a.includes(o)?a.filter(x=>x!==o):a.length<g.max?[...a,o]:a;drawItem();return}
 if(d.q){S.qty=Math.max(1,S.qty+ +d.q);drawItem();return}
 if('addcart' in d){const G=MODS[S.item.m]||[];const mods=G.flatMap((g,gi)=>(S.sel[gi]||[]).map(o=>g.o[o]));addLine(S.item,mods,S.qty,S.note.trim());toast('انضاف للسلة');render();return}
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
