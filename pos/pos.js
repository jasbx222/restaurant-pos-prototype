const STAFF=[{pin:'1234',n:'أحمد',r:'كاشير'},{pin:'2222',n:'علي',r:'كابتن'},{pin:'9999',n:'سارة',r:'مديرة'}];
const USD=1450;const NOTES=[['بدون بصل',0],['حار',0],['حساسية مكسرات',1],['بدون ثلج',0]];
const ZONES=[['الكرادة',2000],['الجادرية',3000],['المنصور',4000],['زيونة',3000]];
const CUST={'07701234567':{n:'حسين علي',addr:[['الكرادة','شارع ٦٢، قرب جامع الكرادة']]},'07809876543':{n:'زينب كريم',addr:[['المنصور','شارع ١٤ رمضان، عمارة ٣']]}};
const DRIVERS=['مصطفى','حيدر','كرار'];
const VOIDR=['خطأ بالطلب','الزبون غير رأيه','تأخير','جودة'];
const SECS=[{id:'hall',n:'الصالة'},{id:'fam',n:'العائلات'},{id:'roof',n:'السطح'}];
const S={user:null,shift:null,type:'dine',cat:'grill',cur:null,sel:null,view:'menu',sec:'hall',orders:{},tables:[],seq:482,take:17,audit:[],sales:[],moves:[],online:true,transfer:null,mpinCb:null};
for(let i=1;i<=18;i++)S.tables.push({id:i,sec:i<=12?'hall':i<=15?'fam':'roof',seats:i%3?4:6,order:null,bill:false});
// طاولتين مشغولات للواقعية
function seed(){mk('dine',3,4,[[1,2,['خبز تنور']],[8,1,[]],[13,4,[]]],true,52);mk('dine',7,2,[[5,2,['صاج','جبن موزريلا']],[14,2,[]]],true,18);S.tables[6].bill=true}
function mk(type,t,g,ls,sent,mins){const id=++S.seq;S.orders[id]={id,type,table:t,guests:g,lines:ls.map(([iid,q,m])=>{const it=ITEMS.find(x=>x.id===iid);return{iid,n:it.n,p:it.p,q,mods:m.map(x=>[x,x==='جبن موزريلا'?1000:0]),notes:[],sent,st:it.st}}),disc:0,opened:Date.now()-(mins||0)*60000,by:'علي',paid:[]};if(t)S.tables[t-1].order=id;return id}
const $=s=>document.querySelector(s);const pos=$('#pos');
const O=()=>S.orders[S.cur];
const lt=l=>(l.p+l.mods.reduce((a,m)=>a+m[1],0))*l.q;
function totals(o){const sub=o.lines.filter(l=>!l.void).reduce((a,l)=>a+lt(l),0);const disc=o.disc?(o.disc.pct?Math.round(sub*o.disc.v/100):o.disc.v):0;const svc=o.type==='dine'?Math.round((sub-disc)*SERVICE/250)*250:0;const del=o.type==='delivery'?(o.zone?o.zone[1]:0):0;const paid=(o.paid||[]).reduce((a,p)=>a+p.v,0);return{sub,disc,svc,del,tot:sub-disc+svc+del,paid}}
function log(a,b){S.audit.push({a,b,who:S.user?.n,at:new Date().toLocaleTimeString('ar-IQ',{hour:'2-digit',minute:'2-digit'})})}
function fit(){const k=Math.min(innerWidth/1280,innerHeight/800,1);pos.style.transform=`scale(${k})`}addEventListener('resize',fit);
function newOrder(type,extra={}){const id=++S.seq;S.orders[id]={id,type,table:null,guests:0,lines:[],disc:0,opened:Date.now(),by:S.user.n,paid:[],num:type!=='dine'?++S.take:null,...extra};S.cur=id;S.sel=null;return id}
function title(o){if(!o)return'طلب جديد';if(o.type==='dine')return o.table?'طاولة '+ar(o.table):'صالة';if(o.type==='takeaway')return'سفري '+ar(o.num);return'توصيل '+ar(o.num)}
// ---------- render
function render(){if(!S.user)return lock();if(!S.shift)return openShift();
 const o=O(),T=o?totals(o):null,b=BUS.get();const pend=b.qr.filter(q=>!q.handled).length,alerts=b.alerts.filter(a=>!a.done).length;
 pos.innerHTML=`<aside class=tk>${ticket(o,T)}</aside><section class=main>
 <div class=topb><div class=seg>${[['dine','صالة','table'],['takeaway','سفري','bag'],['delivery','توصيل','truck']].map(([k,n,i])=>`<button data-type=${k} class="${S.type===k?'on':''}">${ic(i,20)}${n}</button>`).join('')}</div>
 ${S.type==='dine'?`<button class="tbtn ${S.view==='tables'?'hot':''}" data-view=tables>${ic('grid',20)}الطاولات</button>`:''}
 <button class="tbtn ${pend+alerts?'hot':''}" data-inbox>${ic('bell',20)}المنيو الإلكتروني${pend+alerts?`<span class="badge num">${ar(pend+alerts)}</span>`:''}</button>
 <span style="flex:1"></span><button class="net ${b.online?'':'off'}" data-net title="الاتصال">${ic(b.online?'wifi':'nowifi',26)}</button><button class=net style="color:var(--ink)" data-menu>${ic('menu',26)}</button></div>
 ${S.view==='tables'&&S.type==='dine'?floor():menu(o)}</section><div class=mw id=mw><div class=md id=md></div></div>`;}
function ticket(o,T){if(!o)return`<div class=hd><div><h2>${S.type==='dine'?'اختار طاولة':'طلب جديد'}</h2><div class=s>${S.user.n} · ${S.user.r}</div></div></div><div class=lines style="display:grid;place-items:center;color:var(--mut2);font-size:18px;text-align:center;line-height:1.8">${S.type==='dine'?'اضغط على طاولة<br>أو اختار صنف لطلب صالة بدون طاولة':'اضغط على أي صنف حتى يبدي الطلب'}</div>`;
 const sel=o.lines[S.sel];const unsent=o.lines.some(l=>!l.sent&&!l.void);
 const sub=o.type==='dine'?`طلب ${ar(o.id)} · ${ar(o.guests||0)} ضيوف · ${o.by}`:o.type==='delivery'?(o.cust?`${o.cust.n} · ${o.zone?.[0]||''}${o.driver?' · '+o.driver:''}`:'بدون زبون، اضغط لإضافة'):`طلب ${ar(o.id)} · ينادى برقم ${ar(o.num)}`;
 return `<div class=hd><div><h2>${title(o)}</h2><div class=s ${o.type==='delivery'?'data-cust':''}>${sub}</div></div><div class=hb>${o.type==='dine'&&o.table?`<button class=ib data-transfer title="نقل">${ic('moveT',22)}</button>`:''}<button class=ib data-prebill title="فاتورة مبدئية">${ic('print',22)}</button></div></div>
 <div class=lines>${o.lines.map((l,i)=>`<button class="ln ${S.sel===i?'sel':''} ${l.sent?'sent':''} ${l.void?'void':''}" data-line=${i}><span class="q num">${ar(l.q)}</span><span class=x>${l.n}${l.mods.length?`<small>${l.mods.map(m=>m[0]).join('، ')}</small>`:''}${l.notes.length?`<small class=al>${l.notes.join('، ')}</small>`:''}</span><span class=num>${fmt(lt(l))}</span></button>`).join('')||`<div style="color:var(--mut2);padding:30px 0;text-align:center">الطلب فارغ</div>`}</div>
 ${sel&&!sel.void?`<div class=selbar><button data-qd=-1>${ic('minus',20)}</button><button data-qd=1>${ic('plus',20)}</button><button data-void>${ic('del',20)}${sel.sent?'إلغاء':'حذف'}</button></div>`:''}
 <div class=tot><div class=k>${T.disc?`خصم ${fmt(T.disc)}<br>`:''}${T.svc?`خدمة ١٠٪ ${fmt(T.svc)}<br>`:''}${T.del?`توصيل ${fmt(T.del)}<br>`:''}الإجمالي</div><b class=num>${fmt(T.tot)}</b></div>
 <div class=btns><button data-disc>${ic('tag',22)}خصم</button><button class=send data-send ${unsent?'':'disabled'}>${ic('send',22)}أرسل</button><button class=pay data-pay ${o.lines.some(l=>!l.void)?'':'disabled'}>${ic('cash',24)}ادفع</button></div>`}
function menu(o){const sel=o&&o.lines[S.sel];const it=sel&&!sel.void&&ITEMS.find(i=>i.id===sel.iid);const G=it?MODS[it.m]||[]:[];
 const list=ITEMS.filter(i=>i.c===S.cat);
 return `<div class=cats>${CATS.map(c=>`<button data-cat=${c.id} class="${S.cat===c.id?'on':''}">${c.n}</button>`).join('')}</div>
 <div class=g>${list.map((x,i)=>{const q=o?o.lines.filter(l=>l.iid===x.id&&!l.void).reduce((a,l)=>a+l.q,0):0;const c=TILE[i%4],f=TILEFG[i%4];return`<button class="t ${x.out?'out':''}" data-item=${x.id} style="background:${c};color:${f}">${x.img?`<div class=ph style="background-image:url(${IMG(x.img)})"></div>`:`<span class=cup>${ic('cup',110,1.6)}</span>`}<b>${x.n}</b><span class="p num">${fmt(x.p)}</span>${q?`<span class="q num">${ar(q)}</span>`:''}${x.out?'<span class=so>خلص، ٨٦</span>':''}</button>`}).join('')}</div>
 <div class=mods>${it?`<span class=lb>${it.n}:</span>${G.map((g,gi)=>g.o.map(op=>{const on=sel.mods.some(m=>m[0]===op[0]);const miss=g.req&&!sel.mods.some(m=>g.o.some(x=>x[0]===m[0]));return`<button data-mod="${gi}|${op[0]}" class="${on?'on':''} ${miss?'req':''}">${op[0]}${op[1]?` <span class=num>+${fmt(op[1])}</span>`:''}</button>`}).join('')).join('')}${NOTES.map(([n,a])=>`<button data-note="${n}" class="${sel.notes.includes(n)?(a?'al':'on'):''}">${n}</button>`).join('')}`:`<span class=lb style="color:var(--mut)">اضغط صنف بالفاتورة حتى تطلع إضافاته وملاحظاته هنا</span>`}</div>`}
function floor(){const b=BUS.get();return `<div class=cats>${SECS.map(s=>`<button data-sec=${s.id} class="${S.sec===s.id?'on':''}">${s.n}</button>`).join('')}</div>
 <div class=fl>${S.tables.filter(t=>t.sec===S.sec).map(t=>{const o=t.order&&S.orders[t.order];const qr=b.qr.some(q=>q.table==t.id&&!q.handled);const cls=qr?'qr':t.bill?'bill':o?'busy':'';const m=o?Math.round((Date.now()-o.opened)/60000):0;
 return`<button class="tb ${cls} ${S.transfer===t.id?'sel':''}" data-table=${t.id}><b>${ar(t.id)}</b><span>${o?`${ar(o.guests)} ضيوف · ${ar(m)} د<br><span class=num>${fmt(totals(o).tot)}</span>`:qr?'طلب من المنيو':`فارغة · ${ar(t.seats)} كراسي`}</span></button>`}).join('')}</div>
 <div class=leg>${S.transfer?`<b style="color:var(--tomato)">اختار الطاولة الجديدة حتى تنقل طاولة ${ar(S.transfer)} لها</b> <button class=chip data-canceltr>إلغاء النقل</button>`:`<span><i style="background:var(--soft)"></i>فارغة</span><span><i style="background:var(--saffron)"></i>مشغولة</span><span><i style="background:var(--tomato)"></i>طلبت الحساب</span><span><i style="background:var(--caramel)"></i>طلب من المنيو بانتظار القبول</span>`}</div>`}
// ---------- modal helpers
function modal(h){const mw=$('#mw');$('#md').innerHTML=h;mw.classList.add('on')}
function close(){$('#mw')?.classList.remove('on')}
let NP='';function padHTML(lbl,id='np'){return`<div class="big-in num" id=${id}>${lbl}</div><div class=pad>${['١','٢','٣','٤','٥','٦','٧','٨','٩','٠٠','٠',''].map((k,i)=>`<button data-k="${k?'٠١٢٣٤٥٦٧٨٩'.indexOf(k[0])+(k.length>1?'0':''):'del'}">${k||ic('del',30)}</button>`).join('')}</div>`}
function mpin(why,cb){S.mpinCb=cb;NP='';modal(`<h3>موافقة المدير</h3><p class=s>${why}</p><div style="width:340px">${padHTML('<span style="color:var(--mut)">رمز المدير</span>')}<button class="mb k" data-mpinok style="margin-top:12px">تأكيد</button></div>`);S.padMode='mpin'}
// ---------- screens
function lock(){NP='';S.padMode='login';pos.innerHTML=`<div class=lock><div><h1>بيت <span>الفحم</span></h1><p>فرع الكرادة · الجهاز الرئيسي<br>ادخل رمزك الشخصي</p><p style="margin-top:30px;font-size:15px">للتجربة: أحمد كاشير ١٢٣٤ · علي كابتن ٢٢٢٢ · سارة مديرة ٩٩٩٩</p></div>
 <div class=pw><div class=dots id=dots>${'<i></i>'.repeat(4)}</div><div style="height:20px"></div>${padHTML('','np').replace('class="big-in num"','class="big-in num" style="display:none"')}</div></div><div class=mw id=mw><div class=md id=md></div></div>`}
function openShift(){NP='250000';S.padMode='float';pos.innerHTML=`<div class=lock><div><h1>فتح<br><span>الوردية</span></h1><p>هلا ${S.user.n}. عدّ النقد اللي بالدرج<br>وسجّل الرصيد الافتتاحي.</p></div><div class=pw style="width:380px">${padHTML(fmt(250000))}<button class="mb y" data-openshift style="margin-top:12px">افتح الوردية</button></div></div><div class=mw id=mw><div class=md id=md></div></div>`}
function npShow(){const e=$('#np');if(S.padMode==='login'){document.querySelectorAll('#dots i').forEach((d,i)=>d.classList.toggle('f',i<NP.length));return}
 if(S.padMode==='mpin'){e.textContent='•'.repeat(NP.length)||'رمز المدير';return}if(e)e.textContent=fmt(+NP||0);if(S.padMode==='cash')payDraw(true)}
function kitchenSend(){const o=O();const ls=o.lines.filter(l=>!l.sent&&!l.void);if(!ls.length)return;const by={};ls.forEach(l=>(by[l.st]=by[l.st]||[]).push(l));
 const b=BUS.get();const offline=!b.online;
 const H=(`<h3>انرسل للمطبخ</h3><p class=s>${offline?'النت مقطوع: الإرسال صار على شبكة المحل والطابعات شغالة. الطلب ينرفع للسيرفر أول ما يرجع النت.':'كل صنف انطبع بمحطته.'}</p><div class=papers>${Object.entries(by).map(([st,l])=>`<div class=paper><h4>${STATIONS[st]}</h4><div class=c>${title(o)} · طلب ${ar(o.id)} · ${new Date().toLocaleTimeString('ar-IQ',{hour:'2-digit',minute:'2-digit'})}</div><hr>${l.map(x=>`<div class="r bg"><span>${ar(x.q)}× ${x.n}</span></div>${x.mods.map(m=>`<div class=r>· ${m[0]}</div>`).join('')}${x.notes.map(n=>`<div class="r al">!! ${n}</div>`).join('')}`).join('')}<hr><div class=c>${o.by}</div></div>`).join('')}</div><button class="mb k" data-close style="margin-top:18px">تمام</button>`);
 ls.forEach(l=>l.sent=true);log('إرسال للمطبخ',`طلب ${o.id}`);if(o.qrid){const q=o.qrid,up=v=>{const b2=BUS.get();b2.status[q]=Math.max(b2.status[q]||0,v);BUS.set(b2)};up(2);setTimeout(()=>up(3),15000);setTimeout(()=>up(4),25000)}S.sel=null;render();modal(H)}
let PAY=null;
function payOpen(){const o=O(),T=totals(o);PAY={m:'cash',cur:'IQD',split:1,parts:[],due:T.tot-T.paid};NP='';S.padMode='cash';payDraw()}
function payDraw(only){const o=O(),T=totals(o);const per=Math.ceil(PAY.due/PAY.split/250)*250;const target=Math.min(per,PAY.due);const given=+NP||0;const givenIQD=PAY.cur==='USD'?given*USD:given;
 const quick=PAY.cur==='USD'?[20,50,100]:[...new Set([target,Math.ceil(target/5000)*5000,Math.ceil(target/10000)*10000,Math.ceil(target/25000)*25000])].slice(0,4);
 if(only){const c=$('#chg');if(c)c.innerHTML=changeHTML(target,givenIQD);return}
 modal(`<div class=cols style="width:940px"><div><h3>الدفع · ${title(o)}</h3><p class=s>المتبقي <span class=num>${fmt(PAY.due)}</span> د.ع${PAY.split>1?` · مقسّم على ${ar(PAY.split)}، كل واحد <span class=num>${fmt(per)}</span>`:''}</p>
 <div class=row style="margin-bottom:12px">${[['cash','كاش','cash'],['card','كارت','card']].map(([k,n,i])=>`<button class="chip ${PAY.m===k?'on':''}" data-pm=${k}>${ic(i,20)}${n}</button>`).join('')}${PAY.m==='cash'?['IQD','USD'].map(c=>`<button class="chip ${PAY.cur===c?'on':''}" data-cur=${c}>${c==='IQD'?'دينار':'دولار'}</button>`).join(''):''}</div>
 <div class=row style="margin-bottom:12px"><span style="align-self:center;color:var(--mut)">${ic('split',20)} تقسيم</span>${[1,2,3,4].map(n=>`<button class="chip ${PAY.split===n?'on':''}" data-split=${n}>${n===1?'بدون':ar(n)}</button>`).join('')}</div>
 ${PAY.m==='cash'?`<div class=row>${quick.map(q=>`<button class=chip data-qa=${q}><span class=num>${PAY.cur==='USD'?'$'+ar(q):fmt(q)}</span></button>`).join('')}</div>
 <div id=chg style="margin-top:14px">${changeHTML(target,givenIQD)}</div>`:`<p style="font-size:18px;line-height:1.7;margin-top:8px">مرّر الكارت على جهاز الدفع الخارجي بمبلغ <b class=num>${fmt(target)}</b>، وبعدها أكّد هنا.</p>`}
 ${o.paid?.length?`<div style="margin-top:12px;color:var(--herb)">${o.paid.map(p=>`انضاف ${p.m==='cash'?'كاش':'كارت'} <span class=num>${fmt(p.v)}</span>`).join('<br>')}</div>`:''}</div>
 <div style="max-width:360px">${PAY.m==='cash'?padHTML(fmt(0)):''}<button class="mb y" data-payok style="margin-top:12px">${PAY.m==='cash'?'استلمت':'تمت العملية بالجهاز'}</button><button class="mb s" data-close style="margin-top:8px">رجوع</button></div></div>`);
 if(PAY.m==='cash'){$('#np').textContent=PAY.cur==='USD'?'$'+ar(given):fmt(given)}}
function changeHTML(target,g){if(!g)return`<div class=kv><span>المطلوب</span><span class=num>${fmt(target)}</span></div>`;const ch=g-target;return`<div class=kv><span>استلمت</span><span class=num>${fmt(g)}</span></div>${ch>=0?`<div class="kv t"><span>الباقي للزبون</span><span class=num style="color:var(--herb)">${fmt(ch)}</span></div>`:`<div class="kv t"><span>ناقص، يكمل كارت أو كاش</span><span class=num style="color:var(--tomato)">${fmt(-ch)}</span></div>`}`}
function payOk(){const o=O(),T=totals(o);const per=Math.min(Math.ceil(PAY.due/PAY.split/250)*250,PAY.due);let v;
 if(PAY.m==='cash'){const g=(+NP||0)*(PAY.cur==='USD'?USD:1);if(!g)return toast('دخّل المبلغ المستلم');v=Math.min(g,per)}else v=per;
 o.paid.push({m:PAY.m,v,cur:PAY.cur});S.shift.pay[PAY.m]+=v;if(PAY.m==='cash')S.shift.cash+=v;PAY.due-=v;NP='';
 if(PAY.due>0){if(PAY.split>1)PAY.split--;toast('انسجل، باقي '+fmt(PAY.due));payDraw();return}
 receipt(o);}
function receipt(o){const T=totals(o);S.sales.push({id:o.id,type:o.type,tot:T.tot,disc:T.disc,svc:T.svc,paid:o.paid,lines:o.lines,by:o.by,at:Date.now()});log('دفع',`طلب ${o.id} ${T.tot}`);
 if(o.table){const t=S.tables[o.table-1];t.order=null;t.bill=false}if(o.qrid){const b=BUS.get();b.alerts.forEach(a=>{if(a.table==o.table)a.done=true});BUS.set(b)}
 o.closed=true;const html=`<div class=paper style="width:320px"><h4>بيت الفحم</h4><div class=c>فرع الكرادة · ٠٧٨٠ ٠٠٠ ١١٢٢</div><hr><div class=r><span>${title(o)}</span><span>رقم ${ar(o.id)}</span></div><div class=r><span>${new Date().toLocaleDateString('ar-IQ')}</span><span>${o.by}</span></div><hr>
 ${o.lines.filter(l=>!l.void).map(l=>`<div class=r><span>${ar(l.q)}× ${l.n}</span><span>${fmt(lt(l))}</span></div>${l.mods.length?`<div class=c style="text-align:right">${l.mods.map(m=>m[0]).join('، ')}</div>`:''}`).join('')}<hr>
 <div class=r><span>المجموع</span><span>${fmt(T.sub)}</span></div>${T.disc?`<div class=r><span>خصم</span><span>-${fmt(T.disc)}</span></div>`:''}${T.svc?`<div class=r><span>خدمة ١٠٪</span><span>${fmt(T.svc)}</span></div>`:''}${T.del?`<div class=r><span>توصيل</span><span>${fmt(T.del)}</span></div>`:''}<div class="r bg"><span>الإجمالي</span><span>${fmt(T.tot)} د.ع</span></div><hr>${o.paid.map(p=>`<div class=r><span>${p.m==='cash'?'كاش':'كارت'}</span><span>${fmt(p.v)}</span></div>`).join('')}<hr><div class=c>شكراً لزيارتكم</div></div>`;
 S.cur=null;S.sel=null;render();modal(`<div class=cols style="width:760px;align-items:flex-start"><div><h3 style="color:var(--herb)">تم الدفع</h3><p class=s>انطبع الوصل وانفتح الدرج.</p><button class="mb k" data-close>طلب جديد</button></div>${html}</div>`)}
function prebill(){const o=O();if(!o||!o.lines.length)return;const T=totals(o);log('فاتورة مبدئية',`طلب ${o.id}`);if(o.table)S.tables[o.table-1].bill=true;
 const H=(`<div class=cols style="width:700px;align-items:flex-start"><div><h3>فاتورة مبدئية</h3><p class=s>انطبعت للطاولة قبل الدفع، والطاولة صارت «طلبت الحساب».</p><button class="mb k" data-close>تمام</button></div><div class=paper><h4>بيت الفحم</h4><div class=c>فاتورة مبدئية، غير مدفوعة</div><hr>${o.lines.filter(l=>!l.void).map(l=>`<div class=r><span>${ar(l.q)}× ${l.n}</span><span>${fmt(lt(l))}</span></div>`).join('')}<hr><div class="r bg"><span>الإجمالي</span><span>${fmt(T.tot)}</span></div></div></div>`);render();modal(H)}
function inbox(){const b=BUS.get();const qs=b.qr.filter(q=>!q.handled),al=b.alerts.filter(a=>!a.done);
 modal(`<div style="width:760px"><h3>المنيو الإلكتروني</h3><p class=s>${b.posLive?'الطلبات تنزل هنا مباشرة. اقبل بعد ما تتأكد إن الزبون جالس بالطاولة.':''}</p><div class=lst>
 ${qs.map(q=>`<div class=li><div class=x><b class=L style="font-size:24px">${q.table?'طاولة '+ar(q.table):'سفري'} · ${q.add?'إضافة على الطلب':'طلب جديد'}</b><small>${q.lines.map(l=>ar(l.q)+'× '+l.n+(l.mods.length?' ('+l.mods.map(m=>m[0]).join('، ')+')':'')+(l.note?' · '+l.note:'')).join(' · ')}</small></div><button class="mb s" data-qrno="${q.at}">رفض</button><button class="mb p" data-qrok="${q.at}">قبول وإرسال</button></div>`).join('')}
 ${al.map(a=>`<div class=li><span style="color:var(--tomato)">${ic(a.k==='bill'?'bill':'bell',28)}</span><div class=x><b class=L style="font-size:24px">طاولة ${ar(a.table)}</b><small>${a.k==='bill'?'تطلب الحساب':'تنادي الكابتن'}</small></div><button class="mb k" data-aldone="${a.at}">تم</button></div>`).join('')}
 ${!qs.length&&!al.length?'<div class=li style="color:var(--mut)">ماكو طلبات أو نداءات هسه</div>':''}</div><button class="mb s" data-close style="margin-top:14px">إغلاق</button></div>`)}
function qrAccept(at){const b=BUS.get();const q=b.qr.find(x=>x.at==at);q.handled=true;let o;
 const t=q.table&&S.tables[q.table-1];if(t&&t.order&&!S.orders[t.order].closed)o=S.orders[t.order];else{S.type=q.table?'dine':'takeaway';const id=newOrder(S.type,{table:q.table?+q.table:null,guests:2,by:'المنيو'});o=S.orders[id];if(t)t.order=id}
 o.qrid=q.id;q.lines.forEach(l=>{const it=ITEMS.find(i=>i.id===l.id);o.lines.push({iid:l.id,n:l.n,p:l.base,q:l.q,mods:l.mods,notes:l.note?[l.note]:[],sent:false,st:it.st})});
 b.status[q.id]=Math.max(b.status[q.id]||0,1);BUS.set(b);S.cur=o.id;log('قبول طلب منيو',`طاولة ${q.table}`);kitchenSend()}
function menuPanel(){const o=Object.values(S.orders).filter(o=>!o.closed&&o.lines.length);modal(`<div style="width:620px"><h3>${S.user.n} · ${S.user.r}</h3><p class=s>الوردية مفتوحة من ${S.shift.at}</p><div class=lst>
 <button class=li data-xr>${ic('report',26)}<div class=x><b>تقرير X</b><small>مبيعات الوردية لحد هسه بدون غلق</small></div></button>
 <button class=li data-cashmv>${ic('cash',26)}<div class=x><b>إيداع أو سحب من الدرج</b><small>ويه السبب، يحتاج موافقة المدير</small></div></button>
 <button class=li data-orders>${ic('bill',26)}<div class=x><b>الطلبات المفتوحة والمرتجع</b><small>${ar(o.length)} مفتوحة · ${ar(S.sales.length)} مدفوعة</small></div></button>
 <button class=li data-zr>${ic('power',26)}<div class=x><b>غلق الوردية وتقرير Z</b><small>جرد الكاش بالفئات وحساب الفرق</small></div></button>
 <button class=li data-audit>${ic('clock',26)}<div class=x><b>سجل العمليات</b><small>${ar(S.audit.length)} عملية</small></div></button>
 <button class=li data-lock>${ic('lock',26)}<div class=x><b>قفل الجهاز وتبديل الموظف</b></div></button></div></div>`)}
function report(z){const s=S.sales;const tot=s.reduce((a,x)=>a+x.tot,0),disc=s.reduce((a,x)=>a+x.disc,0),svc=s.reduce((a,x)=>a+x.svc,0);const by={};s.forEach(x=>x.lines.filter(l=>!l.void).forEach(l=>by[l.n]=(by[l.n]||0)+l.q));const top=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,4);
 return`<div class=paper style="width:320px"><h4>تقرير ${z?'Z':'X'}</h4><div class=c>${S.user.n} · ${new Date().toLocaleString('ar-IQ')}</div><hr><div class=r><span>عدد الطلبات</span><span>${ar(s.length)}</span></div><div class=r><span>صافي المبيعات</span><span>${fmt(tot)}</span></div><div class=r><span>كاش</span><span>${fmt(S.shift.pay.cash)}</span></div><div class=r><span>كارت</span><span>${fmt(S.shift.pay.card)}</span></div><div class=r><span>الخصومات</span><span>${fmt(disc)}</span></div><div class=r><span>الخدمة</span><span>${fmt(svc)}</span></div><div class=r><span>متوسط الفاتورة</span><span>${fmt(s.length?tot/s.length:0)}</span></div><hr>${top.map(([n,q])=>`<div class=r><span>${n}</span><span>${ar(q)}</span></div>`).join('')||'<div class=c>ماكو مبيعات بعد</div>'}<hr><div class=r><span>المتوقع بالدرج</span><span>${fmt(S.shift.cash)}</span></div></div>`}
const DEN=[50000,25000,10000,5000,1000,250];
function zDraw(){const counted=DEN.reduce((a,d)=>a+d*(S.den[d]||0),0),diff=counted-S.shift.cash;
 modal(`<div class=cols style="width:960px;align-items:flex-start"><div><h3>غلق الوردية</h3><p class=s>عدّ النقد بالفئات</p>${DEN.map(d=>`<div class=li style="margin-bottom:8px;padding:8px 14px"><b class=num style="width:110px">${fmt(d)}</b><span class=x></span><button class=ib style="background:var(--soft);color:var(--ink)" data-den="${d}|-1">${ic('minus',20)}</button><b class=num style="width:44px;text-align:center">${ar(S.den[d]||0)}</b><button class=ib style="background:var(--ink)" data-den="${d}|1">${ic('plus',20)}</button><span class=num style="width:110px;text-align:left">${fmt(d*(S.den[d]||0))}</span></div>`).join('')}
 <div class="kv t"><span>المعدود</span><span class=num>${fmt(counted)}</span></div><div class=kv><span>الفرق</span><span class=num style="color:${diff?'var(--tomato)':'var(--herb)'}">${diff>0?'+':''}${diff<0?'-':''}${fmt(Math.abs(diff))}</span></div>
 <div class=row style="margin-top:12px"><button class="mb s" data-close style="width:auto;padding:0 30px">رجوع</button><button class="mb p" data-zok style="flex:1">اغلق الوردية واطبع Z</button></div></div>${report(true)}</div>`)}
function cust(){NP='';const o=O();modal(`<div class=cols style="width:900px"><div><h3>زبون التوصيل</h3><p class=s>دخّل رقم الموبايل، الزبون المسجل يطلع وية عناوينه.</p><div class=lst id=cres></div>
 <p class=s style="margin-top:14px">منطقة التوصيل</p><div class=row>${ZONES.map(z=>`<button class="chip ${o.zone?.[0]===z[0]?'on':''}" data-zone="${z[0]}">${z[0]} <span class=num>${fmt(z[1])}</span></button>`).join('')}</div>
 <p class=s style="margin-top:14px">السائق</p><div class=row>${DRIVERS.map(d=>`<button class="chip ${o.driver===d?'on':''}" data-driver="${d}">${d}</button>`).join('')}</div></div>
 <div style="width:340px">${padHTML('<span style="color:var(--mut)">٠٧٧٠...</span>')}<button class="mb k" data-close style="margin-top:12px">تمام</button></div></div>`);S.padMode='phone';custRes()}
function custRes(){const e=$('#cres');if(!e)return;const ph=NP;const c=CUST[ph];const o=O();$('#np').textContent=ph?ar(ph):'٠٧٧٠...';
 e.innerHTML=c?`<div class=li><div class=x><b>${c.n}</b><small>${c.addr.map(a=>a[0]+'، '+a[1]).join(' · ')}</small></div><button class="mb y" data-pick="${ph}">اختار</button></div>`:ph.length===11?`<div class=li><div class=x><b>زبون جديد</b><small>${ar(ph)}</small></div><button class="mb y" data-pick="${ph}">سجّل</button></div>`:`<div class=li style="color:var(--mut)">للتجربة: ٠٧٧٠١٢٣٤٥٦٧</div>`}
// ---------- events
pos.addEventListener('click',e=>{const T=e.target.closest('button,[data-cust]');if(!T)return;const d=T.dataset;
 if(d.k!==undefined){if(d.k==='del')NP=NP.slice(0,-1);else NP=(NP+d.k).slice(0,S.padMode==='phone'?11:S.padMode==='login'||S.padMode==='mpin'?4:9);
  if(S.padMode==='login'){npShow();if(NP.length===4){const u=STAFF.find(s=>s.pin===NP);if(u){S.user=u;log('دخول',u.n);if(!S.shift&&u.r==='كابتن'){S.shift=S.shift}render()}else{toast('الرمز غلط');NP='';npShow()}}return}
  if(S.padMode==='phone')return custRes();if(S.padMode==='guests'){$('#np').textContent=ar(NP||0);return}npShow();return}
 if('openshift' in d){S.shift={float:+NP||0,cash:+NP||0,pay:{cash:0,card:0},at:new Date().toLocaleTimeString('ar-IQ',{hour:'2-digit',minute:'2-digit'})};log('فتح وردية',NP);S.view='tables';render();return}
 if('mpinok' in d){if(STAFF.find(s=>s.pin===NP&&s.r==='مديرة')){const cb=S.mpinCb;close();cb()}else{toast('رمز المدير غلط');NP='';npShow()}return}
 if('close' in d){close();S.padMode=null;render();return}
 if(d.type){S.type=d.type;S.cur=null;S.sel=null;S.view=d.type==='dine'?'tables':'menu';if(d.type==='delivery'){newOrder('delivery');render();cust();return}render();return}
 if(d.view){S.view=S.view==='tables'?'menu':'tables';render();return}
 if(d.sec){S.sec=d.sec;render();return}
 if(d.cat){S.cat=d.cat;S.view='menu';render();return}
 if(d.table){const t=S.tables[d.table-1];
  if(S.transfer){const from=S.tables[S.transfer-1];if(t.order){toast('الطاولة مشغولة، اختار وحدة فارغة');return}t.order=from.order;t.bill=from.bill;from.order=null;from.bill=false;S.orders[t.order].table=t.id;log('نقل طاولة',`${from.id} إلى ${t.id}`);toast(`انتقلت طاولة ${ar(from.id)} إلى ${ar(t.id)}`);S.transfer=null;S.cur=t.order;S.view='menu';render();return}
  if(BUS.get().qr.some(q=>q.table==t.id&&!q.handled)){inbox();return}
  if(t.order){S.cur=t.order;S.sel=null;S.view='menu';render();return}
  NP='';S.padMode='guests';modal(`<h3>طاولة ${ar(t.id)}</h3><p class=s>كم شخص؟</p><div class=row style="margin-bottom:12px">${[1,2,3,4,5,6].map(n=>`<button class=chip style="width:76px;justify-content:center;font-size:24px" data-guests="${t.id}|${n}">${ar(n)}</button>`).join('')}</div><button class="mb s" data-close>رجوع</button>`);return}
 if(d.guests){const[tid,g]=d.guests.split('|').map(Number);close();const id=newOrder('dine',{table:tid,guests:g});S.tables[tid-1].order=id;log('فتح طاولة',tid);S.view='menu';render();return}
 if(d.canceltr){S.transfer=null;render();return}
 if('transfer' in d){S.transfer=O().table;S.view='tables';render();return}
 if(d.item){const it=ITEMS.find(i=>i.id==d.item);if(it.out){toast('الصنف خلصان (٨٦)');return}if(!S.cur){newOrder(S.type);if(S.type==='delivery'){render();cust()}}
  const o=O();const ex=o.lines.findIndex(l=>l.iid===it.id&&!l.sent&&!l.void&&!l.mods.length&&!l.notes.length);
  if(ex>=0&&!(MODS[it.m]||[]).some(g=>g.req)){o.lines[ex].q++;S.sel=ex}else{o.lines.push({iid:it.id,n:it.n,p:it.p,q:1,mods:(MODS[it.m]||[]).filter(g=>g.req).map(g=>g.o[0]).slice(0,1),notes:[],sent:false,st:it.st});S.sel=o.lines.length-1}
  render();return}
 if(d.line!==undefined){S.sel=S.sel==+d.line?null:+d.line;render();return}
 if(d.qd){const l=O().lines[S.sel];if(l.sent&&+d.qd<0){voidLine();return}l.q=Math.max(1,l.q+ +d.qd);render();return}
 if('void' in d){voidLine();return}
 if(d.mod){const o=O(),l=o.lines[S.sel];if(l.sent){toast('الصنف انرسل، أضف صنف جديد للتعديل');return}const[gi,name]=d.mod.split('|');const it=ITEMS.find(i=>i.id===l.iid),g=MODS[it.m][gi];const op=g.o.find(x=>x[0]===name);
  const has=l.mods.some(m=>m[0]===name);if(g.max===1){l.mods=l.mods.filter(m=>!g.o.some(x=>x[0]===m[0]));if(!has||g.req)l.mods.push(op)}else{l.mods=l.mods.filter(m=>m[0]!==name);if(!has)l.mods.push(op)}render();return}
 if(d.note){const l=O().lines[S.sel];l.notes=l.notes.includes(d.note)?l.notes.filter(n=>n!==d.note):[...l.notes,d.note];render();return}
 if('send' in d){const o=O();const miss=o.lines.find(l=>!l.void&&!l.sent&&(MODS[ITEMS.find(i=>i.id===l.iid).m]||[]).some(g=>g.req&&!l.mods.some(m=>g.o.some(x=>x[0]===m[0]))));if(miss){toast('كمّل الإضافات الإجبارية لـ'+miss.n);return}if(o.type==='delivery'&&!o.cust){cust();return}kitchenSend();return}
 if('pay' in d){const o=O();if(o.lines.some(l=>!l.sent&&!l.void)&&o.type!=='takeaway'){toast('أرسل الطلب للمطبخ أول');return}if(o.type==='takeaway'&&o.lines.some(l=>!l.sent&&!l.void))kitchenSend(),close();payOpen();return}
 if(d.pm){PAY.m=d.pm;NP='';payDraw();return}if(d.cur){PAY.cur=d.cur;NP='';payDraw();return}if(d.split){PAY.split=+d.split;payDraw();return}
 if(d.qa){NP=String(d.qa);payDraw();return}
 if('payok' in d){payOk();return}
 if('disc' in d){const o=O();if(!o)return;modal(`<h3>خصم</h3><p class=s>خصم أكثر من ١٠٪ يحتاج موافقة المدير</p><div class=row>${[[5,1],[10,1],[15,1],[20,1],[5000,0],[10000,0]].map(([v,p])=>`<button class=chip data-dv="${v}|${p}">${p?ar(v)+'٪':fmt(v)+' د.ع'}</button>`).join('')}<button class=chip data-dv="0|0">بدون خصم</button></div><button class="mb s" data-close style="margin-top:14px">رجوع</button>`);return}
 if(d.dv){const[v,p]=d.dv.split('|').map(Number);const o=O();const apply=()=>{o.disc=v?{v,pct:p}:0;log('خصم',`طلب ${o.id}: ${v}${p?'%':''}`);close();render()};const T=totals(o);if((p&&v>10)||(!p&&v>T.sub*.1))mpin('خصم '+(p?ar(v)+'٪':fmt(v))+' على '+title(o),apply);else apply();return}
 if('prebill' in d){prebill();return}
 if('inbox' in d){inbox();return}
 if(d.qrok){qrAccept(d.qrok);return}
 if(d.qrno){const b=BUS.get();const q=b.qr.find(x=>x.at==d.qrno);q.handled=true;q.rejected=true;BUS.set(b);log('رفض طلب منيو',q.table);render();inbox();return}
 if(d.aldone){const b=BUS.get();b.alerts.find(a=>a.at==d.aldone).done=true;BUS.set(b);render();inbox();return}
 if('net' in d){const b=BUS.get();b.online=!b.online;BUS.set(b);S.online=b.online;toast(b.online?'رجع النت، انرفعت الطلبات المعلقة للسيرفر':'النت انقطع: البيع والطباعة مستمرين على شبكة المحل');render();return}
 if('menu' in d){menuPanel();return}
 if('xr' in d){modal(`<div class=cols style="width:700px;align-items:flex-start"><div><h3>تقرير X</h3><p class=s>الوردية تبقى مفتوحة</p><button class="mb k" data-close>تمام</button></div>${report(false)}</div>`);return}
 if('zr' in d){const open=S.tables.filter(t=>t.order).map(t=>t.id);if(open.length){modal(`<h3>ما تكدر تغلق</h3><p class=s>أكو طاولات مفتوحة: ${open.map(ar).join('، ')}. سكّرهن أو انقلهن أول.</p><button class="mb k" data-close>تمام</button>`);return}S.den={};zDraw();return}
 if(d.den){const[v,k]=d.den.split('|').map(Number);S.den[v]=Math.max(0,(S.den[v]||0)+k);zDraw();return}
 if('zok' in d){log('غلق وردية','Z');S.shift=null;S.user=null;S.sales=[];close();lock();toast('انغلقت الوردية وانطبع تقرير Z');return}
 if('cashmv' in d){modal(`<h3>حركة نقد</h3><p class=s>اختار النوع والسبب</p><div class=row>${[['in',10000,'إيداع فكة'],['out',15000,'سحب: شراء خبز'],['out',25000,'سحب: غاز']].map(([k,v,n])=>`<button class=chip data-mv="${k}|${v}|${n}">${n} <span class=num>${fmt(v)}</span></button>`).join('')}</div><button class="mb s" data-close style="margin-top:14px">رجوع</button>`);return}
 if(d.mv){const[k,v,n]=d.mv.split('|');mpin(n,()=>{S.shift.cash+=k==='in'?+v:-v;S.moves.push({k,v:+v,n});log('حركة نقد',n+' '+v);toast('انسجلت: '+n);render()});return}
 if('orders' in d){const op=Object.values(S.orders).filter(o=>!o.closed&&o.lines.length);modal(`<div style="width:760px"><h3>الطلبات</h3><div class=lst>${op.map(o=>`<div class=li><div class=x><b>${title(o)}</b><small>${o.by} · <span class=num>${fmt(totals(o).tot)}</span></small></div><button class="mb y" data-goto=${o.id}>افتح</button></div>`).join('')}${S.sales.slice().reverse().map(s=>`<div class=li><div class=x><b>مدفوع · طلب ${ar(s.id)}</b><small><span class=num>${fmt(s.tot)}</span> · ${s.paid.map(p=>p.m==='cash'?'كاش':'كارت').join('، ')}</small></div>${s.refund?'<b style="color:var(--tomato)">مرتجع</b>':`<button class="mb s" data-refund=${s.id}>مرتجع</button>`}</div>`).join('')}</div><button class="mb s" data-close style="margin-top:14px">إغلاق</button></div>`);return}
 if(d.goto){S.cur=+d.goto;const o=O();S.type=o.type;S.view='menu';close();render();return}
 if(d.refund){const s=S.sales.find(x=>x.id==d.refund);mpin('مرتجع طلب '+ar(s.id)+' بنفس طريقة الدفع',()=>{s.refund=true;s.paid.forEach(p=>{S.shift.pay[p.m]-=p.v;if(p.m==='cash')S.shift.cash-=p.v});log('مرتجع',s.id);toast('انرجع المبلغ '+fmt(s.tot));render()});return}
 if('audit' in d){modal(`<div style="width:700px"><h3>سجل العمليات</h3><div class=lst>${S.audit.slice().reverse().map(a=>`<div class=li><div class=x><b>${a.a}</b><small>${a.b} · ${a.who||''}</small></div><span class=num>${a.at}</span></div>`).join('')}</div><button class="mb s" data-close style="margin-top:14px">إغلاق</button></div>`);return}
 if('lock' in d){S.user=null;close();lock();return}
 if('cust' in d){cust();return}
 if(d.pick){const c=CUST[d.pick]||{n:'زبون جديد',addr:[]};const o=O();o.cust={...c,ph:d.pick};if(c.addr[0])o.zone=ZONES.find(z=>z[0]===c.addr[0][0]);toast('انضاف الزبون: '+c.n);cust();return}
 if(d.zone){O().zone=ZONES.find(z=>z[0]===d.zone);cust();return}
 if(d.driver){O().driver=d.driver;log('تعيين سائق',d.driver);cust();return}
});
function voidLine(){const o=O(),l=o.lines[S.sel];if(!l.sent){o.lines.splice(S.sel,1);S.sel=null;render();return}
 modal(`<h3>إلغاء ${l.n}</h3><p class=s>الصنف انرسل للمطبخ، اختار السبب، ويحتاج موافقة المدير</p><div class=row>${VOIDR.map(r=>`<button class=chip data-vr="${r}">${r}</button>`).join('')}</div><button class="mb s" data-close style="margin-top:14px">رجوع</button>`);
 $('#md').onclick=e=>{const b=e.target.closest('[data-vr]');if(!b)return;const r=b.dataset.vr;mpin(`إلغاء ${l.n}: ${r}`,()=>{l.void=r;log('إلغاء صنف',`${l.n} · ${r}`);S.sel=null;$('#md').onclick=null;render();toast('انلغى وانطبع للمطبخ')})}}
// ربط مع المنيو الإلكتروني
setInterval(()=>{const b=BUS.get();b.posLive=Date.now();BUS.set(b)},2000);
BUS.on(b=>{if(!S.user||!S.shift)return;const n=b.qr.filter(q=>!q.handled).length+b.alerts.filter(a=>!a.done).length;if(n>(S.lastN||0))toast('وصل طلب أو نداء من المنيو الإلكتروني');S.lastN=n;if(!$('#mw.on'))render()});
seed();fit();render();
