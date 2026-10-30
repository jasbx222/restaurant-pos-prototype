// بيانات مشتركة: المنيو، الإضافات، الطاولات، الموظفين، والتخزين المشترك بين المنيو والكاشير
const IMG=n=>`../assets/img/${n}.jpg`;
const fmt=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'٬').replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const ar=s=>String(s).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const ICON={
plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',bill:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
back:'<path d="M9 5l7 7-7 7"/>',check:'<path d="M5 12l5 5 9-10"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
send:'<path d="M4 12l16-8-6 16-3-7z"/>',print:'<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
del:'<path d="M20 6H9l-6 6 6 6h11z"/><path d="M12 10l4 4M16 10l-4 4"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
cup:'<path d="M6 4h12l-1.5 16h-9z"/><path d="M6.5 9h11"/>',wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/>',
nowifi:'<path d="M3 3l18 18M8.5 16a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 5-2.6M14.5 10a10 10 0 0 1 4.5 2.5M2 9a15 15 0 0 1 4.5-2.8M11 5.1A15 15 0 0 1 22 9"/>',
table:'<rect x="3" y="7" width="18" height="6" rx="1"/><path d="M6 13v6M18 13v6"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',split:'<path d="M12 3v18M5 8l-3 4 3 4M19 8l3 4-3 4"/>',
tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',truck:'<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
moveT:'<path d="M4 12h14M13 6l6 6-6 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',report:'<path d="M5 3h14v18H5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
power:'<path d="M12 3v9"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>',undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'};
const ic=(n,s=22,w=2.2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>`;
const STATIONS={grill:'المشويات',cold:'المطبخ البارد',oven:'الفرن',juice:'العصائر'};
const CATS=[{id:'grill',n:'المشويات'},{id:'sand',n:'السندويشات'},{id:'salad',n:'السلطات'},{id:'oven',n:'المعجنات'},{id:'sweet',n:'الحلويات'},{id:'drink',n:'المشروبات'}];
const MODS={
 kebab:[{n:'الخبز',req:1,max:1,o:[['خبز تنور',0],['صمون حجري',0],['بدون خبز',0]]},{n:'إضافات',req:0,max:4,o:[['رز بسمتي',2000],['طماطة مشوية',1000],['بصل سماق',500],['حار',0]]}],
 sand:[{n:'الخبز',req:1,max:1,o:[['صاج',0],['صمون حجري',0],['تنور',0]]},{n:'إضافات',req:0,max:4,o:[['جبن موزريلا',1000],['ثومية زيادة',500],['بطاطا',1500],['حار',0]]}],
 plate:[{n:'الجانبي',req:1,max:1,o:[['رز',0],['بطاطا',0],['برغل',0]]},{n:'إضافات',req:0,max:3,o:[['ثومية زيادة',500],['مخلل زيادة',500],['حار',0]]}],
 salad:[{n:'إضافات',req:0,max:3,o:[['دجاج مشوي',3000],['جبن حلوم',2000],['بدون بصل',0]]}],
 pizza:[{n:'الحجم',req:1,max:1,o:[['وسط',0],['كبير',4000]]},{n:'إضافات',req:0,max:3,o:[['جبن زيادة',1500],['زيتون',500],['فلفل حار',0]]}],
 drink:[{n:'الحجم',req:1,max:1,o:[['عادي',0],['كبير',1000]]},{n:'الثلج',req:0,max:1,o:[['بدون ثلج',0]]}],
 none:[]};
const ITEMS=[
 {id:1,c:'grill',n:'كباب عراقي',d:'لحم غنم مفروم على الفحم، طماطة مشوية وخبز تنور',p:14000,img:'kebab',m:'kebab',st:'grill',big:1},
 {id:2,c:'grill',n:'ضلوع مشوية',d:'ضلوع عجل مدخّنة ست ساعات بصوص الدبس',p:22000,img:'ribs',m:'plate',st:'grill'},
 {id:3,c:'grill',n:'مشكّل الفحم',d:'كباب، تكة، دجاج وخضار مشوية لشخصين',p:26000,img:'skewers',m:'kebab',st:'grill'},
 {id:4,c:'grill',n:'سمك مسگوف',d:'شبوط على الحطب، يكفي شخصين، حسب الوزن',p:18000,img:'fish',m:'plate',st:'grill',out:1},
 {id:5,c:'sand',n:'شاورما صاج',d:'دجاج متبّل على الفحم، ثومية، مخلل، خبز صاج',p:7500,img:'shawarma2',m:'sand',st:'grill'},
 {id:6,c:'sand',n:'صحن شاورما',d:'شاورما دجاج، خبز، سلطة، مخلل وثومية',p:9000,img:'shawarma',m:'plate',st:'grill'},
 {id:7,c:'sand',n:'فلافل',d:'ست أقراص فلافل، حمص، مخلل وخبز',p:4000,img:'falafel',m:'none',st:'cold'},
 {id:8,c:'salad',n:'فتوش',d:'خضار، خبز محمص، سماق ودبس رمان',p:5000,img:'fattoush',m:'salad',st:'cold'},
 {id:9,c:'salad',n:'سلطة الموسم',d:'خضار ورقية، رمان، جوز ودبس رمان',p:5000,img:'salad',m:'salad',st:'cold'},
 {id:10,c:'salad',n:'بول الخضار',d:'حمص، أفوكادو، بطاطا حلوة وخضار طازجة',p:6500,img:'bowl',m:'salad',st:'cold'},
 {id:11,c:'oven',n:'بيتزا الحطب',d:'عجينة مخمّرة ٤٨ ساعة، جبن عكاوي وزعتر',p:13000,img:'pizza',m:'pizza',st:'oven'},
 {id:12,c:'sweet',n:'كنافة',d:'كنافة نابلسية بالجبن والفستق',p:6000,img:'kunafa',m:'none',st:'oven'},
 {id:13,c:'drink',img:'ayran',n:'لبن عيران',d:'لبن بارد بالنعناع',p:1500,m:'drink',st:'juice'},
 {id:14,c:'drink',img:'lemon',n:'ليمون نعناع',d:'ليمون طازج مع نعناع',p:3000,m:'drink',st:'juice'},
 {id:15,c:'drink',img:'orange',n:'عصير برتقال',d:'برتقال معصور طازج',p:3500,m:'drink',st:'juice'},
 {id:16,c:'drink',img:'tea',n:'شاي عراقي',d:'شاي مهيّل بالاستكان',p:1000,m:'none',st:'juice'}];
const TILE=['#F2A71B','#D8412F','#F3D9B1','#C47A3A'],TILEFG=['#3A2418','#FFF8EE','#3A2418','#FFF8EE'];
const SERVICE=.10;
// خزن مشترك بين المنيو والكاشير (نفس المتصفح) يحاكي السيرفر
const BUS={
 get(){try{return JSON.parse(localStorage.getItem('fahm_bus')||'{"qr":[],"alerts":[],"status":{},"online":true}')}catch(e){return{qr:[],alerts:[],status:{},online:true}}},
 set(v){localStorage.setItem('fahm_bus',JSON.stringify(v))},
 push(k,x){const b=this.get();b[k].push(x);this.set(b)},
 on(f){addEventListener('storage',e=>{if(e.key==='fahm_bus')f(this.get())})}};
function toast(t){let e=document.querySelector('.toast-msg');if(!e){e=document.createElement('div');e.className='toast-msg';document.body.append(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2200)}
