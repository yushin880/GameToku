'use strict';
/* パック4：脳トレ 10本 */

/* 数字パッド（計算ダッシュ・数字記憶で共通） */
const NUMPAD={keys:['7','8','9','4','5','6','1','2','3','けす','0','OK'],
  draw(c,ox,oy,w,h){this.keys.forEach((k,i)=>btn(c,ox+(i%3)*(w+8),oy+Math.floor(i/3)*(h+8),w,h,k,{size:20,fill:k==='OK'?'#eaf3ff':'#fff'}));},
  hit(x,y,ox,oy,w,h){for(let i=0;i<12;i++)if(inR(x,y,ox+(i%3)*(w+8),oy+Math.floor(i/3)*(h+8),w,h))return this.keys[i];return null;},
  fromKey(code){const m=code.match(/^(Digit|Numpad)([0-9])$/);if(m)return m[2];if(code==='Backspace')return'けす';if(code==='Enter'||code==='NumpadEnter')return'OK';return null;}};

/* 簡単な効果音（WebAudio） */
const BEEP={ctx:null,play(freq,dur){try{if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();const o=this.ctx.createOscillator(),g=this.ctx.createGain();
  o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.15,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+dur);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+dur);}catch(e){}}};

addGames(

/* ---------- タイピング ---------- */
{id:'typing',name:'タイピング',emoji:'⌨️',tag:'脳トレ',color:['#c3d5ff','#4a6cf7'],
 desc:'表示された言葉をローマ字で打とう。60秒で何文字打てるかな？',
 help:'キーボードでローマ字入力（お手本どおりに。のばす音は -）',
 w:480,h:320,
 W:[['りんご','ringo'],['さかな','sakana'],['ねこ','neko'],['いぬ','inu'],['でんしゃ','densha'],['ひこうき','hikouki'],['がっこう','gakkou'],['てんき','tenki'],
   ['やきゅう','yakyuu'],['すいか','suika'],['たいよう','taiyou'],['おにぎり','onigiri'],['ともだち','tomodachi'],['こうえん','kouen'],['うみ','umi'],['やま','yama'],
   ['はなび','hanabi'],['ゆきだるま','yukidaruma'],['かみなり','kaminari'],['さくら','sakura'],['ほっかいどう','hokkaidou'],['ぱそこん','pasokon'],['きーぼーど','ki-bo-do'],
   ['らーめん','ra-men'],['すし','sushi'],['てんぷら','tenpura'],['じてんしゃ','jitensha'],['としょかん','toshokan'],['えんぴつ','enpitsu'],['けしごむ','keshigomu'],
   ['ちょこれーと','chokore-to'],['ふうせん','fuusen'],['かぶとむし','kabutomushi'],['ぺんぎん','pengin'],['きりん','kirin'],['ひまわり','himawari'],['おまつり','omatsuri'],
   ['しんかんせん','shinkansen'],['うちゅう','uchuu'],['ろけっと','roketto'],['ゆうえんち','yuuenchi'],['かたつむり','katatsumuri']],
 reset(api){this.api=api;this.time=60;this.words=shuffle(this.W.slice());this.wi=0;this.pos=0;this.miss=0;this.flash=0;this.done=0;},
 cur(){return this.words[this.wi%this.words.length];},
 key(c,d){if(!d)return;let ch=null;const m=c.match(/^Key([A-Z])$/);if(m)ch=m[1].toLowerCase();if(c==='Minus'||c==='NumpadSubtract')ch='-';if(!ch)return;
   const r=this.cur()[1];if(r[this.pos]===ch){this.pos++;this.api.addScore(1);if(this.pos>=r.length){this.wi++;this.pos=0;this.done++;}}else{this.miss++;this.flash=.2;}},
 update(dt){this.time-=dt;this.flash=Math.max(0,this.flash-dt);if(this.time<=0){this.time=0;return this.api.over(`タイムアップ！ ${this.done}語・ミス${this.miss}`);}},
 draw(c){bg(c,480,320,this.flash?'#ffecec':UI.bg);
   box(c,20,20,440*this.time/60,10,5,this.time<10?UI.red:UI.blue);T(c,`${Math.ceil(this.time)}秒`,460,48,14,UI.sub,'right');T(c,`${this.done}語`,20,48,14,UI.sub,'left');
   const[k,r]=this.cur();T(c,k,240,130,44,UI.ink);
   c.font=`bold 28px ui-monospace,Consolas,monospace`;const tw=c.measureText(r).width;let x=240-tw/2;c.textBaseline='middle';c.textAlign='left';
   for(let i=0;i<r.length;i++){c.fillStyle=i<this.pos?UI.blue:i===this.pos?UI.ink:'#bbb';c.fillText(r[i],x,200);if(i===this.pos){c.fillRect(x,216,c.measureText(r[i]).width,3);}x+=c.measureText(r[i]).width;}
   const nx=this.words[(this.wi+1)%this.words.length][0];T(c,'つぎ：'+nx,240,268,16,UI.sub);}},

/* ---------- 計算ダッシュ ---------- */
{id:'calc',name:'計算ダッシュ',emoji:'➗',tag:'脳トレ',color:['#ffd6a5','#f3722c'],
 desc:'たし算・ひき算・かけ算をどんどん解こう。60秒で何問正解できる？',
 help:'答えを数字キー / 画面の数字ボタンで入力（合っていれば自動で次へ）',
 w:800,h:450,
 reset(api){this.api=api;this.time=60;this.inp='';this.flash=0;this.ok=0;this.next();},
 next(){const op=ri(0,2);let a,b;if(op===0){a=ri(2,49);b=ri(2,49);this.ans=a+b;this.q=`${a} ＋ ${b}`;}else if(op===1){a=ri(10,99);b=ri(1,a);this.ans=a-b;this.q=`${a} − ${b}`;}else{a=ri(2,12);b=ri(2,9);this.ans=a*b;this.q=`${a} × ${b}`;}this.inp='';},
 press(k){if(!k)return;if(k==='けす'){this.inp=this.inp.slice(0,-1);return;}if(k==='OK'){if(this.inp)this.check(true);return;}if(this.inp.length<4)this.inp+=k;this.check(false);},
 check(force){const s=String(this.ans);if(this.inp===s){this.api.addScore(1);this.ok=.25;this.next();}else if(force||this.inp.length>=s.length){this.flash=.3;this.inp='';}},
 key(c,d){if(d)this.press(NUMPAD.fromKey(c));},
 pointer(t,x,y){if(t==='down')this.press(NUMPAD.hit(x,y,470,80,90,74));},
 update(dt){this.time-=dt;this.flash=Math.max(0,this.flash-dt);this.ok=Math.max(0,this.ok-dt);if(this.time<=0){this.time=0;return this.api.over(`タイムアップ！ ${score}問正解`);}},
 draw(c){bg(c,800,450,this.flash?'#ffecec':this.ok?'#eafaf0':UI.bg);
   box(c,20,20,760*this.time/60,10,5,this.time<10?UI.red:UI.orange);T(c,`${Math.ceil(this.time)}秒`,780,48,15,UI.sub,'right');T(c,`正解 ${score}`,20,48,15,UI.sub,'left');
   T(c,this.q+' ＝',230,170,46,UI.ink);box(c,130,220,200,72,12,'#fff',UI.line,2);T(c,this.inp||'?',230,257,40,this.inp?UI.blue:'#ccc');
   NUMPAD.draw(c,470,80,90,74);}},

/* ---------- いろ判定 ---------- */
{id:'stroop',name:'いろ判定',emoji:'🎨',tag:'脳トレ',color:['#ffadad','#9b5de5'],
 desc:'文字の「意味」ではなく「文字の色」を答えよう。頭がこんがらがる！ 30秒勝負。',
 help:'文字の色と同じボタンをクリック / タップ（1〜4キーでもOK）',
 w:400,h:440,
 C:[['あか','#e5484d'],['あお','#3d6fd6'],['みどり','#30a46c'],['きいろ','#e6a700']],
 reset(api){this.api=api;this.time=30;this.flash=0;this.ok=0;this.next();},
 next(){this.word=ri(0,3);do{this.ink=ri(0,3);}while(this.ink===this.word&&Math.random()<.8);this.order=shuffle([0,1,2,3]);},
 ans(k){if(k===this.ink){this.api.addScore(1);this.ok=.2;}else{this.time-=2;this.flash=.3;}this.next();},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-4])$/);if(m)this.ans(this.order[+m[2]-1]);},
 pointer(t,x,y){if(t!=='down')return;for(let i=0;i<4;i++)if(inR(x,y,30+(i%2)*175,250+Math.floor(i/2)*80,165,66))this.ans(this.order[i]);},
 update(dt){this.time-=dt;this.flash=Math.max(0,this.flash-dt);this.ok=Math.max(0,this.ok-dt);if(this.time<=0){this.time=0;return this.api.over(`タイムアップ！ ${score}問正解`);}},
 draw(c){bg(c,400,440,this.flash?'#ffecec':UI.bg);box(c,20,20,360*Math.max(0,this.time)/30,10,5,this.time<8?UI.red:UI.purple);
   T(c,`${Math.ceil(this.time)}秒`,380,48,14,UI.sub,'right');T(c,`正解 ${score}`,20,48,14,UI.sub,'left');
   T(c,'この文字の「色」は？',200,90,16,UI.sub);T(c,this.C[this.word][0],200,160,64,this.C[this.ink][1]);
   this.order.forEach((k,i)=>btn(c,30+(i%2)*175,250+Math.floor(i/2)*80,165,66,`${i+1}. ${this.C[k][0]}`,{size:22}));
   T(c,'まちがえると −2秒',200,420,13,UI.sub);}},

/* ---------- 数字タッチ ---------- */
{id:'numtouch',name:'数字タッチ',emoji:'🔟',tag:'脳トレ',color:['#a0e7e5','#2ec4b6'],
 desc:'1から25まで、順番にできるだけ速くタッチしよう。',
 help:'1 → 2 → 3 … の順にクリック / タップ（まちがえると +1秒）',
 w:400,h:460,
 reset(api){this.api=api;this.n=shuffle([...Array(25)].map((_,i)=>i+1));this.next=1;this.time=0;this.pen=0;this.flash=0;this.hit=[];},
 pointer(t,x,y){if(t!=='down')return;const c=cellAt(x,y,25,75,70,5,5);if(!c)return;const i=c.y*5+c.x;
   if(this.n[i]===this.next){this.hit.push(i);this.next++;if(this.next>25){const tt=this.time+this.pen;this.api.setScore(Math.max(10,Math.round(500-tt*10)));this.api.win(`クリア！ ${tt.toFixed(2)}秒`);}}
   else if(!this.hit.includes(i)){this.pen+=1;this.flash=.3;}},
 update(dt){this.time+=dt;this.flash=Math.max(0,this.flash-dt);},
 draw(c){bg(c,400,460,this.flash?'#ffecec':UI.bg);T(c,`つぎ：${Math.min(25,this.next)}`,25,40,20,UI.ink,'left');T(c,`${(this.time+this.pen).toFixed(2)}秒`,375,40,20,UI.ink,'right');
   this.n.forEach((v,i)=>{const x=25+(i%5)*70,y=75+Math.floor(i/5)*70,h=this.hit.includes(i);box(c,x+4,y+4,62,62,12,h?'#e9e8e3':'#fff',h?null:UI.line,1.5);T(c,String(v),x+35,y+36,26,h?'#c9c8c2':UI.ink);});
   T(c,'まちがえると +1秒',200,440,13,UI.sub);}},

/* ---------- 色ちがい探し ---------- */
{id:'oddcolor',name:'色ちがい探し',emoji:'🔍',tag:'脳トレ',color:['#caffbf','#52b788'],
 desc:'1つだけ色がちがうマスを見つけよう。進むほどマスが増えて、ちがいが小さくなる。60秒勝負。',
 help:'色がちがうマスをクリック / タップ（まちがえると −3秒）',
 w:400,h:460,
 reset(api){this.api=api;this.time=60;this.lv=0;this.flash=0;this.make();},
 make(){this.n=Math.min(9,2+Math.floor(this.lv/2));this.odd=ri(0,this.n*this.n-1);const h=ri(0,359),s=ri(45,75),l=ri(45,62),d=Math.max(4,26-this.lv*1.2);
   this.base=`hsl(${h},${s}%,${l}%)`;this.diff=`hsl(${h},${s}%,${l+(Math.random()<.5?d:-d)}%)`;},
 pointer(t,x,y){if(t!=='down')return;const cs=360/this.n,c=cellAt(x,y,20,80,cs,this.n,this.n);if(!c)return;
   if(c.y*this.n+c.x===this.odd){this.lv++;this.api.setScore(this.lv);this.make();}else{this.time-=3;this.flash=.3;}},
 update(dt){this.time-=dt;this.flash=Math.max(0,this.flash-dt);if(this.time<=0){this.time=0;return this.api.over(`タイムアップ！ ${this.lv}問クリア`);}},
 draw(c){bg(c,400,460,this.flash?'#ffecec':UI.bg);box(c,20,20,360*Math.max(0,this.time)/60,10,5,this.time<10?UI.red:UI.green);
   T(c,`${Math.ceil(this.time)}秒`,380,52,14,UI.sub,'right');T(c,`レベル ${this.lv+1}`,20,52,14,UI.sub,'left');
   const cs=360/this.n;for(let i=0;i<this.n*this.n;i++)box(c,20+(i%this.n)*cs+2,80+Math.floor(i/this.n)*cs+2,cs-4,cs-4,Math.min(12,cs*.18),i===this.odd?this.diff:this.base);}},

/* ---------- フラッシュ記憶 ---------- */
{id:'flashmem',name:'フラッシュ記憶',emoji:'⚡',tag:'脳トレ',color:['#fde68a','#d97706'],
 desc:'一瞬光ったマスの位置を覚えて、同じマスをタッチしよう。ミスは3回まで。',
 help:'光ったマスを覚えて、全部クリック / タップ',
 w:400,h:470,
 reset(api){this.api=api;this.lv=1;this.life=3;this.start();},
 start(){this.n=this.lv<3?3:this.lv<6?4:this.lv<10?5:6;const k=Math.min(this.n*this.n-2,2+this.lv);this.lit=new Set(shuffle([...Array(this.n*this.n).keys()]).slice(0,k));
   this.got=new Set();this.wrong=new Set();this.ph='show';this.t=1+k*.12;},
 pointer(t,x,y){if(t!=='down'||this.ph!=='input')return;const cs=360/this.n,c=cellAt(x,y,20,80,cs,this.n,this.n);if(!c)return;const i=c.y*this.n+c.x;if(this.got.has(i)||this.wrong.has(i))return;
   if(this.lit.has(i)){this.got.add(i);if(this.got.size===this.lit.size){this.ph='ok';this.t=.7;this.api.setScore(this.lv);}}
   else{this.wrong.add(i);this.life--;this.ph='bad';this.t=1;}},
 update(dt){if(this.ph==='input')return;this.t-=dt;if(this.t>0)return;
   if(this.ph==='show')this.ph='input';else if(this.ph==='ok'){this.lv++;this.start();}else if(this.ph==='bad'){if(this.life<=0)return this.api.over(`レベル ${this.lv} で終了`);this.start();}},
 draw(c){bg(c,400,470);T(c,`レベル ${this.lv}`,20,40,18,UI.ink,'left');T(c,'♥'.repeat(Math.max(0,this.life))+'♡'.repeat(Math.max(0,3-this.life)),380,40,20,UI.red,'right');
   const cs=360/this.n;for(let i=0;i<this.n*this.n;i++){const x=20+(i%this.n)*cs,y=80+Math.floor(i/this.n)*cs;let f='#e9e8e3';
     if(this.ph==='show'&&this.lit.has(i))f=UI.yellow;if(this.got.has(i))f=UI.green;if(this.wrong.has(i))f=UI.red;if(this.ph==='bad'&&this.lit.has(i)&&!this.got.has(i))f='#ffe08a';
     box(c,x+3,y+3,cs-6,cs-6,10,f);}
   T(c,this.ph==='show'?'覚えて！':this.ph==='input'?`あと ${this.lit.size-this.got.size}マス`:this.ph==='ok'?'正解！':'ざんねん…',200,456,16,UI.sub);}},

/* ---------- 数字記憶 ---------- */
{id:'digits',name:'数字記憶',emoji:'🧠',tag:'脳トレ',color:['#bde0fe','#5390d9'],
 desc:'表示される数字を覚えて、消えたら入力しよう。正解するたびに1桁ずつ増えていく。',
 help:'数字キー / 画面の数字ボタンで入力して OK（Enter）',
 w:800,h:450,
 reset(api){this.api=api;this.len=3;this.start();},
 start(){this.num='';for(let i=0;i<this.len;i++)this.num+=String(i?ri(0,9):ri(1,9));this.inp='';this.ph='show';this.t=1+this.len*.5;this.tmax=this.t;},
 press(k){if(!k||this.ph!=='input')return;if(k==='けす'){this.inp=this.inp.slice(0,-1);return;}
   if(k==='OK'){if(!this.inp)return;if(this.inp===this.num){this.api.setScore(this.len);this.ph='ok';this.t=.8;}else{this.ph='bad';this.t=1.6;}return;}if(this.inp.length<this.len+2)this.inp+=k;},
 key(c,d){if(d)this.press(NUMPAD.fromKey(c));},
 pointer(t,x,y){if(t==='down')this.press(NUMPAD.hit(x,y,470,80,90,74));},
 update(dt){if(this.ph==='input')return;this.t-=dt;if(this.t>0)return;if(this.ph==='show')this.ph='input';else if(this.ph==='ok'){this.len++;this.start();}else if(this.ph==='bad')return this.api.over(`${this.len-1}桁まで記憶できた`);},
 draw(c){bg(c,800,450,this.ph==='bad'?'#ffecec':this.ph==='ok'?'#eafaf0':UI.bg);T(c,`${this.len}桁`,230,70,20,UI.sub);
   if(this.ph==='show'){T(c,this.num,230,190,this.len>12?30:44,UI.ink);box(c,80,250,300*this.t/this.tmax,8,4,UI.blue);}
   else if(this.ph==='bad'){T(c,'正解：'+this.num,230,170,26,UI.ink);T(c,'あなた：'+this.inp,230,225,24,UI.red);}
   else{T(c,'数字は？',230,150,17,UI.sub);box(c,40,180,380,72,12,'#fff',UI.line,2);T(c,this.inp||'',230,217,this.inp.length>12?26:34,UI.blue);}
   NUMPAD.draw(c,470,80,90,74);}},

/* ---------- カラーメモリー ---------- */
{id:'simon',name:'カラーメモリー',emoji:'🔵',tag:'脳トレ',color:['#9bf6ff','#4cc9f0'],
 desc:'光って鳴る順番を覚えて、同じ順にタッチしよう。1回ごとに1つずつ長くなる。',
 help:'光った順にパネルをクリック / タップ（1〜4キーでもOK）',
 w:400,h:440,
 P:[['#e5484d','#ff9b9e',262],['#30a46c','#8fe0b0',330],['#3d6fd6','#a8c2f5',392],['#f5b400','#ffe08a',523]],
 reset(api){this.api=api;this.seq=[ri(0,3)];this.ph='wait';this.t=.8;this.idx=0;this.lit=-1;this.litT=0;},
 press(k){if(this.ph!=='input')return;this.flash(k);if(k===this.seq[this.idx]){this.idx++;if(this.idx===this.seq.length){this.api.setScore(this.seq.length);this.ph='wait';this.t=.9;this.seq.push(ri(0,3));}}
   else{BEEP.play(110,.5);this.ph='bad';this.t=1.2;}},
 flash(k){this.lit=k;this.litT=.3;BEEP.play(this.P[k][2],.28);},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-4])$/);if(m)this.press(+m[2]-1);},
 pointer(t,x,y){if(t!=='down')return;const d=dist(x,y,200,230);if(d<50||d>180)return;const k=(x<200?0:1)+(y<230?0:2);this.press([0,1,2,3][k]);},
 update(dt){this.litT-=dt;if(this.litT<=0)this.lit=-1;
   if(this.ph==='wait'){this.t-=dt;if(this.t<=0){this.ph='show';this.idx=0;this.t=.15;}}
   else if(this.ph==='show'){this.t-=dt;if(this.t<=0){if(this.idx<this.seq.length){this.flash(this.seq[this.idx]);this.idx++;this.t=Math.max(.3,.6-this.seq.length*.02);}else{this.ph='input';this.idx=0;}}}
   else if(this.ph==='bad'){this.t-=dt;if(this.t<=0)return this.api.over(`${this.seq.length-1}個まで覚えた`);}},
 draw(c){bg(c,400,440);T(c,`長さ ${this.seq.length}`,200,30,18,UI.ink);
   for(let k=0;k<4;k++){const a0=[Math.PI,Math.PI*1.5,Math.PI*.5,0][k],on=this.lit===k;c.beginPath();c.arc(200,230,175,a0+.04,a0+Math.PI/2-.04);c.arc(200,230,55,a0+Math.PI/2-.08,a0+.08,true);c.closePath();
     c.fillStyle=on?this.P[k][1]:this.P[k][0];c.globalAlpha=on?1:.75;c.fill();c.globalAlpha=1;}
   circle(c,200,230,48,'#fff');T(c,this.ph==='input'?'どうぞ':this.ph==='bad'?'×':'よく見て',200,231,15,this.ph==='bad'?UI.red:UI.ink);
   T(c,'1:赤 2:緑 3:青 4:黄',200,425,12,UI.sub);}},

/* ---------- 神経衰弱 ---------- */
{id:'concentration',name:'神経衰弱',emoji:'🃏',tag:'脳トレ',color:['#ffc8dd','#ff69a3'],
 desc:'裏返しのカードを2枚ずつめくって、同じ絵をそろえよう。少ない回数で全部そろえられるかな？',
 help:'カードをクリック / タップしてめくる',
 w:800,h:450,
 E:['🍎','🐶','⚽','🌸','🚗','🎈','⭐','🍙','🐟','🎸'],
 reset(api){this.api=api;const e=shuffle(this.E.slice()).slice(0,10);this.cards=shuffle(e.concat(e)).map(v=>({v,up:false,ok:false}));this.open=[];this.tries=0;this.waitT=0;this.time=0;},
 pointer(t,x,y){if(t!=='down'||this.waitT>0)return;const cx=Math.floor((x-150)/100),cy=Math.floor((y-70)/88);if(x<150||y<70||cx>4||cy>3)return;const cd=this.cards[cy*5+cx];if(cd.up||cd.ok)return;cd.up=true;this.open.push(cd);
   if(this.open.length===2){this.tries++;const[a,b]=this.open;if(a.v===b.v){a.ok=b.ok=true;this.open=[];if(this.cards.every(k=>k.ok)){this.api.setScore(Math.max(10,200-(this.tries-10)*8));this.api.win(`全部そろった！ ${this.tries}回`);}}else this.waitT=.8;}},
 update(dt){this.time+=dt;if(this.waitT>0){this.waitT-=dt;if(this.waitT<=0){for(const k of this.open)k.up=false;this.open=[];}}},
 draw(c){bg(c,800,450);T(c,`めくった回数 ${this.tries}`,150,38,18,UI.ink,'left');T(c,`${this.cards.filter(k=>k.ok).length/2} / 10 組`,650,38,16,UI.sub,'right');
   this.cards.forEach((k,i)=>{const x=150+(i%5)*100,y=70+Math.floor(i/5)*88;
     if(k.up||k.ok){box(c,x+6,y+4,88,80,10,k.ok?'#eafaf0':'#fff',k.ok?'#8fd3a8':UI.line,2);T(c,k.v,x+50,y+46,38,UI.ink);}
     else{box(c,x+6,y+4,88,80,10,'#ff8fb8');T(c,'?',x+50,y+45,28,'rgba(255,255,255,.85)');}});}},

/* ---------- 時計よみ ---------- */
{id:'clock',name:'時計よみ',emoji:'🕒',tag:'脳トレ',color:['#e9edc9','#7a9e4e'],
 desc:'アナログ時計の時刻を読んで、正しい答えを選ぼう。全10問。',
 help:'正しい時刻のボタンをクリック / タップ（1〜4キーでもOK）',
 w:800,h:450,
 reset(api){this.api=api;this.q=0;this.ok=0;this.fb=0;this.time=0;this.make();},
 make(){this.h=ri(1,12);this.m=ri(0,11)*5;const f=(h,m)=>`${h}時${m?m+'分':''}`;const set=new Set([f(this.h,this.m)]);
   const opts=[[this.h,this.m]];while(opts.length<4){let h=this.h,m=this.m;const r=ri(0,3);if(r===0)h=(h%12)+1;else if(r===1)m=(m+[15,30,45][ri(0,2)])%60;else if(r===2){h=((this.m/5)||12);m=((this.h%12)*5);}else{h=ri(1,12);m=ri(0,11)*5;}
     if(!set.has(f(h,m))){set.add(f(h,m));opts.push([h,m]);}}
   this.opts=shuffle(opts).map(([h,m])=>({t:f(h,m),ok:h===this.h&&m===this.m}));},
 ans(i){if(this.fb>0)return;const o=this.opts[i];this.res=o.ok;if(o.ok){this.ok++;this.api.setScore(this.ok*10);}this.fb=.8;},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-4])$/);if(m)this.ans(+m[2]-1);},
 pointer(t,x,y){if(t!=='down')return;for(let i=0;i<4;i++)if(inR(x,y,480,90+i*76,280,60))this.ans(i);},
 update(dt){this.time+=dt;if(this.fb>0){this.fb-=dt;if(this.fb<=0){this.q++;if(this.q>=10)return this.ok>=7?this.api.win(`${this.ok} / 10 問正解！`):this.api.over(`${this.ok} / 10 問正解`);this.make();}}},
 draw(c){bg(c,800,450,this.fb>0?(this.res?'#eafaf0':'#ffecec'):UI.bg);T(c,`第${this.q+1}問 / 10`,20,30,17,UI.ink,'left');T(c,`正解 ${this.ok}`,780,30,17,UI.sub,'right');
   const cx=230,cy=240,R=160;circle(c,cx,cy,R,'#fff',UI.ink,5);
   for(let k=0;k<60;k++){const a=k*Math.PI/30,r1=k%5?R-10:R-20;line(c,cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,cx+Math.cos(a)*(R-4),cy+Math.sin(a)*(R-4),UI.ink,k%5?1:3);}
   for(let k=1;k<=12;k++){const a=k*Math.PI/6-Math.PI/2;T(c,String(k),cx+Math.cos(a)*(R-38),cy+Math.sin(a)*(R-38)+1,20,UI.ink);}
   const ha=((this.h%12)+this.m/60)*Math.PI/6-Math.PI/2,ma=this.m*Math.PI/30-Math.PI/2;
   c.lineCap='round';line(c,cx,cy,cx+Math.cos(ha)*R*.5,cy+Math.sin(ha)*R*.5,UI.ink,9);line(c,cx,cy,cx+Math.cos(ma)*R*.78,cy+Math.sin(ma)*R*.78,UI.blue,5);c.lineCap='butt';circle(c,cx,cy,7,UI.ink);
   this.opts.forEach((o,i)=>btn(c,480,90+i*76,280,60,`${i+1}. ${o.t}`,{size:21,fill:this.fb>0&&o.ok?'#d3f5df':'#fff'}));}}
);
