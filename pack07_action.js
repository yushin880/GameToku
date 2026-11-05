'use strict';
/* パック7：アクション 10本 */
addGames(

/* ---------- ジャンプアップ ---------- */
{id:'jumpup',name:'ジャンプアップ',emoji:'🦘',tag:'アクション',color:['#b9fbc0','#06a77d'],
 desc:'足場をポンポン跳ねてどこまでも上へ！ 動く足場やこわれる足場に注意。',
 help:'←→ / マウス・指を左右に動かして移動（画面のはしは反対側につながる）',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 reset(api){this.api=api;this.p={x:180,y:470,vx:0,vy:-650};this.cam=0;this.top=470;this.pl=[{x:140,y:520,w:80,t:0}];this.genY=520;this.L=this.R=false;this.tx=null;this.gen();},
 gen(){while(this.genY>this.cam-200){const h=470-this.genY,gap=clamp(60+h/80,60,125);this.genY-=rnd(gap*.7,gap);const r=Math.random(),t=h>800&&r<.18?2:h>300&&r<.38?1:0;
   this.pl.push({x:rnd(10,290),y:this.genY,w:60,t,vx:t===1?rnd(60,110)*(Math.random()<.5?1:-1):0,spring:t===0&&Math.random()<.08});}},
 key(c,d){if(c==='ArrowLeft'||c==='KeyA'){this.L=d;this.tx=null;}if(c==='ArrowRight'||c==='KeyD'){this.R=d;this.tx=null;}},
 pointer(t,x){if(t!=='up')this.tx=x;},
 update(dt){const p=this.p;
   if(this.L||this.R)p.vx=((this.R?1:0)-(this.L?1:0))*300;else if(this.tx!=null)p.vx=clamp((this.tx-p.x)*7,-320,320);else p.vx*=.9;
   p.x+=p.vx*dt;if(p.x<-15)p.x+=390;if(p.x>375)p.x-=390;
   const py=p.y;p.vy+=1150*dt;p.y+=p.vy*dt;
   for(const q of this.pl){if(q.t===1){q.x+=q.vx*dt;if(q.x<0||q.x>300)q.vx*=-1;}if(q.broken){q.y+=300*dt;continue;}
     if(p.vy>0&&py+14<=q.y&&p.y+14>=q.y&&p.x>q.x-8&&p.x<q.x+q.w+8){if(q.t===2){q.broken=true;continue;}p.y=q.y-14;p.vy=q.spring?-1050:-650;}}
   if(p.y-this.cam<230)this.cam=p.y-230;this.gen();this.pl=this.pl.filter(q=>q.y<this.cam+620);
   this.top=Math.min(this.top,p.y);this.api.setScore(Math.floor((470-this.top)/10));
   if(p.y-this.cam>600)return this.api.over();},
 draw(c){bg(c,360,560,'#f0fbff');c.strokeStyle='rgba(61,111,214,.08)';c.lineWidth=1;for(let y=(-this.cam)%20;y<560;y+=20){c.beginPath();c.moveTo(0,y);c.lineTo(360,y);c.stroke();}
   c.save();c.translate(0,-this.cam);
   for(const q of this.pl){const col=q.t===1?UI.blue:q.t===2?'#b08968':UI.green;box(c,q.x,q.y,q.w,10,5,q.broken?'rgba(176,137,104,.4)':col);if(q.spring){box(c,q.x+22,q.y-10,16,10,3,'#adb5bd');}}
   const p=this.p;circle(c,p.x,p.y,14,UI.orange);circle(c,p.x-5,p.y-4,3.5,'#fff');circle(c,p.x+5,p.y-4,3.5,'#fff');circle(c,p.x-5+p.vx/150,p.y-4,1.8,'#222');circle(c,p.x+5+p.vx/150,p.y-4,1.8,'#222');
   c.restore();T(c,`${score} m`,180,30,22,UI.ink,'center',0);}},

/* ---------- 光の軌跡バトル ---------- */
{id:'trail',name:'光の軌跡バトル',emoji:'🏍️',tag:'アクション',color:['#90f1ef','#3a0ca3'],
 desc:'走ったあとに光の壁が残るバイクでCPUと対決。相手を自分の軌跡に追いこもう！',
 help:'矢印キー / WASD / スワイプで曲がる',
 w:696,h:390,GW:87,GH:45,CS:8,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']],
 reset(api){this.api=api;this.round();},
 round(){this.g=new Uint8Array(87*45);this.a={x:17,y:22,d:[1,0],q:null};this.b={x:69,y:22,d:[-1,0]};this.g[22*87+17]=1;this.g[22*87+69]=2;this.acc=0;this.spd=.07;this.res=0;this.t=0;this.ready=1;},
 free(x,y){return x>=0&&y>=0&&x<87&&y<45&&!this.g[y*87+x];},
 space(x,y,lim){const seen=new Set([y*87+x]),st=[[x,y]];let n=0;while(st.length&&n<lim){const[a,b]=st.pop();n++;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=b+dy,k=ny*87+nx;if(this.free(nx,ny)&&!seen.has(k)){seen.add(k);st.push([nx,ny]);}}}return n;},
 ai(){const b=this.b,opts=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>!(d[0]===-b.d[0]&&d[1]===-b.d[1])&&this.free(b.x+d[0],b.y+d[1]));if(!opts.length)return;
   let best=-1,bd=b.d;for(const d of opts){let s=this.space(b.x+d[0],b.y+d[1],500);s-=dist(b.x+d[0],b.y+d[1],this.a.x,this.a.y)*.4;if(d[0]===b.d[0]&&d[1]===b.d[1])s+=3;s+=Math.random()*4;if(s>best){best=s;bd=d;}}b.d=bd;},
 turn(m){this.a.q=m;},
 key(c,d){if(!d)return;const m={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1]}[c];if(m)this.turn(m);},
 pointer(t,x,y){if(t==='down'){this.sx=x;this.sy=y;}else if(t==='move'&&this.sx!=null){const dx=x-this.sx,dy=y-this.sy;if(Math.hypot(dx,dy)>20){this.turn(Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)]);this.sx=x;this.sy=y;}}else if(t==='up')this.sx=null;},
 update(dt){if(this.ready>0){this.ready-=dt;return;}
   if(this.res){this.t-=dt;if(this.t<=0){if(this.res===2)return this.api.over(`CPUの勝ち（${score}勝）`);this.round();}return;}
   this.acc+=dt;while(this.acc>=this.spd){this.acc-=this.spd;this.spd=Math.max(.04,this.spd-.0002);const a=this.a,b=this.b;
     if(a.q&&!(a.q[0]===-a.d[0]&&a.q[1]===-a.d[1]))a.d=a.q;a.q=null;this.ai();
     const ax=a.x+a.d[0],ay=a.y+a.d[1],bx=b.x+b.d[0],by=b.y+b.d[1];const ca=!this.free(ax,ay)||(ax===bx&&ay===by),cb=!this.free(bx,by)||(ax===bx&&ay===by);
     if(ca||cb){if(ca&&cb){this.res=3;this.t=1.2;}else if(ca){this.res=2;this.t=1.2;}else{this.res=1;this.t=1.2;this.api.addScore(1);}return;}
     a.x=ax;a.y=ay;b.x=bx;b.y=by;this.g[ay*87+ax]=1;this.g[by*87+bx]=2;}},
 draw(c){bg(c,696,390,'#0d0b1e');const CS=8,OY=30;c.strokeStyle='rgba(120,120,255,.08)';c.lineWidth=1;for(let x=0;x<=87;x+=5){c.beginPath();c.moveTo(x*CS,OY);c.lineTo(x*CS,OY+360);c.stroke();}for(let y=0;y<=45;y+=5){c.beginPath();c.moveTo(0,OY+y*CS);c.lineTo(696,OY+y*CS);c.stroke();}
   for(let i=0;i<87*45;i++){const v=this.g[i];if(v){c.fillStyle=v===1?'#4cc9f0':'#f72585';c.fillRect((i%87)*CS,OY+Math.floor(i/87)*CS,CS,CS);}}
   circle(c,(this.a.x+.5)*CS,OY+(this.a.y+.5)*CS,6,'#fff');circle(c,(this.b.x+.5)*CS,OY+(this.b.y+.5)*CS,6,'#fff');
   T(c,`あなた（青） ${score}勝`,10,15,13,'#4cc9f0','left');T(c,'CPU（ピンク）',686,15,13,'#f72585','right');
   if(this.ready>0)T(c,'READY',348,200,30,'#fff');if(this.res)T(c,this.res===1?'勝ち！':this.res===2?'負け…':'相打ち',348,200,30,'#fff');}},

/* ---------- ぱくぱくセル ---------- */
{id:'cells',name:'ぱくぱくセル',emoji:'🦠',tag:'アクション',color:['#caffbf','#38b000'],
 desc:'小さなエサや自分より小さいセルを食べて大きくなろう。大きいセルには食べられないように！',
 help:'マウス / 指の方向へ進む（矢印キーでもOK）。重さ500で勝利',
 w:800,h:450,WS:1600,
 reset(api){this.api=api;this.p={x:800,y:800,m:12};this.food=[...Array(260)].map(()=>this.newFood());this.ai=[...Array(14)].map(()=>this.newAI());this.tx=null;this.K={};},
 newFood(){return{x:rnd(0,1600),y:rnd(0,1600),c:PAL[ri(0,7)]};},
 newAI(){let x,y;do{x=rnd(0,1600);y=rnd(0,1600);}while(this.p&&dist(x,y,this.p.x,this.p.y)<400);return{x,y,m:rnd(4,Math.max(30,(this.p?this.p.m:12)*1.8)),c:PAL[ri(0,7)],tx:rnd(0,1600),ty:rnd(0,1600)};},
 R(m){return Math.sqrt(m)*4.5;},
 key(c,d){this.K[c]=d;},
 pointer(t,x,y){if(t!=='up')this.tx=[x-400,y-225];},
 mv(o,dx,dy,dt){const L=Math.hypot(dx,dy);if(L<1)return;const sp=230/(1+this.R(o.m)/45);o.x=clamp(o.x+dx/L*sp*dt,0,1600);o.y=clamp(o.y+dy/L*sp*dt,0,1600);},
 update(dt){const p=this.p,K=this.K;let dx=0,dy=0;if(K.ArrowLeft||K.KeyA)dx--;if(K.ArrowRight||K.KeyD)dx++;if(K.ArrowUp||K.KeyW)dy--;if(K.ArrowDown||K.KeyS)dy++;
   if(dx||dy){this.tx=null;this.mv(p,dx,dy,dt);}else if(this.tx)this.mv(p,this.tx[0],this.tx[1],dt);
   const pr=this.R(p.m);
   for(const f of this.food)if(dist(f.x,f.y,p.x,p.y)<pr){p.m+=1;Object.assign(f,this.newFood());}
   for(const a of this.ai){const ar=this.R(a.m),d=dist(a.x,a.y,p.x,p.y);
     if(a.m>p.m*1.15&&d<360)this.mv(a,p.x-a.x,p.y-a.y,dt*.85);else if(p.m>a.m*1.15&&d<260)this.mv(a,a.x-p.x,a.y-p.y,dt*.9);else{if(dist(a.x,a.y,a.tx,a.ty)<20){a.tx=rnd(0,1600);a.ty=rnd(0,1600);}this.mv(a,a.tx-a.x,a.ty-a.y,dt*.7);}
     for(const f of this.food)if(dist(f.x,f.y,a.x,a.y)<ar){a.m+=.5;Object.assign(f,this.newFood());}
     if(p.m>a.m*1.15&&d<pr-ar*.4){p.m+=a.m*.8;Object.assign(a,this.newAI());}
     else if(a.m>p.m*1.15&&d<ar-pr*.4)return this.api.over(`食べられた…（重さ ${Math.floor(p.m)}）`);}
   this.api.setScore(Math.floor(p.m));if(p.m>=500)return this.api.win('いちばん大きくなった！');},
 draw(c){bg(c,800,450,'#f6f8f2');const p=this.p,z=clamp(1.25-this.R(p.m)/160,.45,1.25);c.save();c.translate(400,225);c.scale(z,z);c.translate(-p.x,-p.y);
   c.strokeStyle='rgba(0,0,0,.06)';c.lineWidth=1/z;for(let x=0;x<=1600;x+=50){c.beginPath();c.moveTo(x,0);c.lineTo(x,1600);c.stroke();c.beginPath();c.moveTo(0,x);c.lineTo(1600,x);c.stroke();}
   box(c,0,0,1600,1600,0,null,'#bbb',4);
   for(const f of this.food)circle(c,f.x,f.y,4,f.c);
   for(const a of this.ai){circle(c,a.x,a.y,this.R(a.m),a.c,'rgba(0,0,0,.2)',3);if(a.m>p.m*1.15)T(c,'!',a.x,a.y,this.R(a.m)*.8,'rgba(255,255,255,.8)');}
   circle(c,p.x,p.y,this.R(p.m),UI.blue,'#2c55ad',4);T(c,'あなた',p.x,p.y,Math.max(10,this.R(p.m)*.45),'#fff');
   c.restore();T(c,`重さ ${Math.floor(p.m)} / 500`,12,20,14,UI.ink,'left');}},

/* ---------- 重力反転ラン ---------- */
{id:'gflip',name:'重力反転ラン',emoji:'🔄',tag:'アクション',color:['#ffd6ff','#9d4edd'],
 desc:'床と天井を行き来しながら走り続けよう。トゲや穴は重力を反転させてよける！',
 help:'スペース / クリック / タップで重力を反転（床か天井に着いているときだけ）',
 w:533,h:300,CW:30,
 reset(api){this.api=api;this.y=226;this.vy=0;this.g=1;this.d=0;this.sp=220;this.cols=[];this.side=0;for(let i=0;i<24;i++)this.cols.push({f:0,c:0});this.plan=0;this.addCols(20);this.off=0;this.ground=true;},
 addCols(n){for(let k=0;k<n;k++){if(this.plan>0){this.plan--;this.cols.push({f:0,c:0});continue;}
   const side=Math.random()<.5?'f':'c',len=ri(2,4),kind=Math.random()<.6?1:2;for(let i=0;i<len;i++){const o={f:0,c:0};o[side]=kind;this.cols.push(o);}this.plan=ri(5,8)-Math.min(2,Math.floor(this.d/3000));}},
 flip(){if(this.ground){this.g*=-1;this.ground=false;}},
 key(c,d,rep){if(d&&!rep&&(c==='Space'||c==='ArrowUp'||c==='ArrowDown'))this.flip();},
 pointer(t){if(t==='down')this.flip();},
 update(dt){this.sp=Math.min(460,this.sp+6*dt);this.d+=this.sp*dt;this.off+=this.sp*dt;this.api.setScore(Math.floor(this.d/10));
   while(this.off>=this.CW){this.off-=this.CW;this.cols.shift();if(this.cols.length<30)this.addCols(10);}
   const i=Math.floor((100+this.off)/this.CW),col=this.cols[i]||{f:0,c:0},col2=this.cols[Math.floor((88+this.off)/this.CW)]||col,col3=this.cols[Math.floor((112+this.off)/this.CW)]||col;
   const hole=s=>col2[s]===2&&col3[s]===2,spike=s=>col[s]===1;
   this.vy+=this.g*1600*dt;this.y+=this.vy*dt;this.ground=false;
   if(this.g>0&&this.y>=226&&this.y<246&&!hole('f')){this.y=226;this.vy=0;this.ground=true;if(spike('f'))return this.api.over();}
   if(this.g<0&&this.y<=74&&this.y>54&&!hole('c')){this.y=74;this.vy=0;this.ground=true;if(spike('c'))return this.api.over();}
   if(this.y>330||this.y<-30)return this.api.over();},
 draw(c){bg(c,533,300,'#1b1035');const CW=this.CW;
   for(let i=0;i<this.cols.length;i++){const x=i*CW-this.off,o=this.cols[i];if(x>545)break;
     if(o.f!==2){c.fillStyle='#5a3d8a';c.fillRect(x,240,CW+1,60);if(o.f===1){c.fillStyle='#ff5e9c';c.beginPath();for(let k=0;k<3;k++){c.moveTo(x+k*10,240);c.lineTo(x+k*10+5,224);c.lineTo(x+k*10+10,240);}c.fill();}}
     if(o.c!==2){c.fillStyle='#5a3d8a';c.fillRect(x,0,CW+1,60);if(o.c===1){c.fillStyle='#ff5e9c';c.beginPath();for(let k=0;k<3;k++){c.moveTo(x+k*10,60);c.lineTo(x+k*10+5,76);c.lineTo(x+k*10+10,60);}c.fill();}}}
   const y=this.y;box(c,88,y-14,24,28,6,'#7ef9ff');circle(c,this.g>0?104:104,y+(this.g>0?-4:4),3,'#1b1035');
   T(c,`${score} m`,523,150,14,'rgba(255,255,255,.6)','right');}},

/* ---------- タワーディフェンス ---------- */
{id:'td',name:'タワーディフェンス',emoji:'🏰',tag:'アクション',color:['#d8f3dc','#40916c'],
 desc:'道の横にタワーを建てて、攻めてくる敵をくい止めよう。15ウェーブ守りきれば勝利！',
 help:'空き地をクリック / タップでタワー建設（50G）。タワーをクリックで強化',
 w:760,h:440,TS:40,
 PATH:[[0,2],[4,2],[4,7],[8,7],[8,2],[12,2],[12,7],[16,7],[16,3],[19,3]],
 reset(api){this.api=api;this.money=120;this.lives=10;this.wave=0;this.tw=[];this.en=[];this.sh=[];this.spawn=0;this.waveT=3;this.cells=new Set();
   const P=this.PATH;for(let k=0;k<P.length-1;k++){let[x,y]=P[k];const[tx,ty]=P[k+1];while(x!==tx||y!==ty){this.cells.add(x+','+y);x+=Math.sign(tx-x);y+=Math.sign(ty-y);}this.cells.add(tx+','+ty);}
   this.pts=P.map(([x,y])=>[x*40+20,y*40+20]);},
 pointer(t,x,y){if(t!=='down'||y>=400||x>=760)return;const cx=Math.floor(x/40),cy=Math.floor(y/40),k=cx+','+cy;if(this.cells.has(k))return;const tw=this.tw.find(o=>o.x===cx&&o.y===cy);
   if(tw){const cost=60*tw.lv;if(this.money>=cost&&tw.lv<4){this.money-=cost;tw.lv++;}return;}if(this.money>=50){this.money-=50;this.tw.push({x:cx,y:cy,lv:1,cd:0});}},
 update(dt){
   if(this.spawn<=0&&!this.en.length){this.waveT-=dt;if(this.waveT<=0){this.wave++;if(this.wave>15){return this.api.win('15ウェーブ守りきった！');}this.spawn=6+this.wave*2;this.spT=0;this.waveT=4;}}
   if(this.spawn>0){this.spT-=dt;if(this.spT<=0){this.spT=Math.max(.35,.9-this.wave*.03);this.spawn--;const boss=this.wave%5===0&&this.spawn===0;const hp=(5+this.wave*2.9)*(boss?8:1);this.en.push({seg:0,p:0,x:this.pts[0][0],y:this.pts[0][1],hp,max:hp,sp:(48+this.wave*2.5)*(boss?.6:1),boss});}}
   for(const e of this.en){let m=e.sp*dt;while(m>0&&e.seg<this.pts.length-1){const[ax,ay]=this.pts[e.seg],[bx,by]=this.pts[e.seg+1],L=dist(ax,ay,bx,by),rem=L*(1-e.p);if(m<rem){e.p+=m/L;m=0;}else{m-=rem;e.seg++;e.p=0;}}
     if(e.seg>=this.pts.length-1){e.dead=true;this.lives-=e.boss?3:1;}else{const[ax,ay]=this.pts[e.seg],[bx,by]=this.pts[e.seg+1];e.x=ax+(bx-ax)*e.p;e.y=ay+(by-ay)*e.p;}}
   for(const tw of this.tw){tw.cd-=dt;if(tw.cd>0)continue;const X=tw.x*40+20,Y=tw.y*40+20,rg=80+tw.lv*15;let tgt=null,bp=-1;for(const e of this.en){if(e.dead)continue;const pr=e.seg+e.p;if(dist(X,Y,e.x,e.y)<rg&&pr>bp){bp=pr;tgt=e;}}
     if(tgt){tw.cd=.55;tgt.hp-=1+tw.lv*1.5;this.sh.push({x1:X,y1:Y,x2:tgt.x,y2:tgt.y,t:.1});if(tgt.hp<=0&&!tgt.dead){tgt.dead=true;this.money+=tgt.boss?60:6;this.api.addScore(tgt.boss?100:10);}}}
   this.en=this.en.filter(e=>!e.dead);for(const s of this.sh)s.t-=dt;this.sh=this.sh.filter(s=>s.t>0);
   if(this.lives<=0)return this.api.over(`ウェーブ ${this.wave} で突破された`);},
 draw(c){bg(c,760,440,'#a7d7a0');
   for(const k of this.cells){const[x,y]=k.split(',').map(Number);c.fillStyle='#e6ccb2';c.fillRect(x*40,y*40,40,40);}
   for(let x=0;x<19;x++)for(let y=0;y<10;y++)if(!this.cells.has(x+','+y)){c.strokeStyle='rgba(0,0,0,.04)';c.strokeRect(x*40+.5,y*40+.5,39,39);}
   for(const tw of this.tw){const X=tw.x*40+20,Y=tw.y*40+20;box(c,X-15,Y-15,30,30,6,['','#6c757d','#3d6fd6','#8e4ec6','#e5484d'][tw.lv]);circle(c,X,Y,7,'#fff');T(c,String(tw.lv),X,Y+1,9,UI.ink);}
   for(const s of this.sh)line(c,s.x1,s.y1,s.x2,s.y2,'#ffe066',2);
   for(const e of this.en){const r=e.boss?13:8;circle(c,e.x,e.y,r,e.boss?'#6a040f':'#d00000');box(c,e.x-10,e.y-r-7,20,3,1,'#333');box(c,e.x-10,e.y-r-7,20*Math.max(0,e.hp/e.max),3,1,'#52b788');}
   c.fillStyle='#fff';c.fillRect(0,400,760,40);T(c,`💰 ${this.money}G`,14,420,16,UI.ink,'left');T(c,`❤ ${this.lives}`,160,420,16,UI.red,'left');T(c,`ウェーブ ${this.wave} / 15`,746,420,15,UI.ink,'right');
   if(this.spawn<=0&&!this.en.length&&this.wave<15)T(c,`次のウェーブまで ${Math.ceil(this.waveT)}`,470,420,12,UI.sub);}},

/* ---------- ボム迷路 ---------- */
{id:'bomber',name:'ボム迷路',emoji:'💣',tag:'アクション',color:['#ffd29d','#d62828'],
 desc:'爆弾でブロックをこわしながら、迷路の中のモンスターを全部たおそう。自分の爆風に注意！',
 help:'矢印キー / WASD で移動、スペース / 「爆弾」ボタンで爆弾を置く',
 w:756,h:430,GW:21,GH:11,TS:36,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight'],['爆弾','Space']],
 reset(api){this.api=api;this.st=0;this.load();},
 load(){const W=21,H=11;this.m=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){let v=0;if(x===0||y===0||x===W-1||y===H-1||(x%2===0&&y%2===0))v=1;else if(Math.random()<.45&&x+y>3)v=2;this.m.push(v);}
   this.p={x:1,y:1,mx:1,my:1};this.cd=0;this.K={};this.bombs=[];this.fire=[];this.en=[];const n=4+this.st;
   while(this.en.length<n){const x=ri(1,19),y=ri(1,9);if(this.m[y*21+x]===0&&x+y>8)this.en.push({x,y,mx:x,my:y,cd:rnd(.3,.8),dead:false});}
   this.maxB=1+Math.floor(this.st/2);this.rng=2+Math.floor(this.st/3);this.clearT=0;this.deadT=0;},
 at(x,y){return this.m[y*21+x];},
 walk(x,y,isP){if(this.at(x,y))return false;if(this.bombs.some(b=>b.x===x&&b.y===y&&!(isP&&b.pass)))return false;return true;},
 key(c,d){this.K[c]=d;if(d&&(c==='Space'||c==='Enter'))this.bomb();},
 bomb(){const p=this.p;if(this.deadT||this.bombs.length>=this.maxB||this.bombs.some(b=>b.x===p.x&&b.y===p.y))return;this.bombs.push({x:p.x,y:p.y,t:2,pass:true});},
 explode(b){b.t=-1;const cells=[[b.x,b.y]];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])for(let k=1;k<=this.rng;k++){const x=b.x+dx*k,y=b.y+dy*k,v=this.at(x,y);if(v===1)break;cells.push([x,y]);if(v===2){this.m[y*21+x]=0;this.api.addScore(10);break;}}
   for(const[x,y]of cells){this.fire.push({x,y,t:.45});const o=this.bombs.find(z=>z.x===x&&z.y===y&&z.t>0);if(o)this.explode(o);}},
 update(dt){const p=this.p;
   if(this.deadT){this.deadT-=dt;if(this.deadT<=0)return this.api.over(`ステージ ${this.st+1} で力つきた`);return;}
   if(this.clearT){this.clearT-=dt;if(this.clearT<=0){this.api.addScore(300);this.st++;this.load();}return;}
   this.cd-=dt;p.mx+=(p.x-p.mx)*Math.min(1,dt*18);p.my+=(p.y-p.my)*Math.min(1,dt*18);
   if(this.cd<=0){const K=this.K,dir=K.ArrowLeft||K.KeyA?[-1,0]:K.ArrowRight||K.KeyD?[1,0]:K.ArrowUp||K.KeyW?[0,-1]:K.ArrowDown||K.KeyS?[0,1]:null;
     if(dir&&this.walk(p.x+dir[0],p.y+dir[1],true)){p.x+=dir[0];p.y+=dir[1];this.cd=.16;for(const b of this.bombs)if(b.x!==p.x||b.y!==p.y)b.pass=false;}}
   for(const b of this.bombs){b.t-=dt;if(b.t<=0&&b.t>-1)this.explode(b);}this.bombs=this.bombs.filter(b=>b.t>0);
   for(const f of this.fire)f.t-=dt;this.fire=this.fire.filter(f=>f.t>0);
   for(const e of this.en){if(e.dead)continue;e.mx+=(e.x-e.mx)*Math.min(1,dt*10);e.my+=(e.y-e.my)*Math.min(1,dt*10);e.cd-=dt;
     if(e.cd<=0){e.cd=Math.max(.3,.6-this.st*.03);const opts=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>this.walk(e.x+dx,e.y+dy,false));if(opts.length){const[dx,dy]=e.d&&opts.some(o=>o[0]===e.d[0]&&o[1]===e.d[1])&&Math.random()<.7?e.d:opts[ri(0,opts.length-1)];e.d=[dx,dy];e.x+=dx;e.y+=dy;}}
     if(this.fire.some(f=>f.x===e.x&&f.y===e.y)){e.dead=true;this.api.addScore(100);}
     if(!e.dead&&e.x===p.x&&e.y===p.y)this.deadT=1.2;}
   if(this.fire.some(f=>f.x===p.x&&f.y===p.y))this.deadT=1.2;
   if(this.en.every(e=>e.dead))this.clearT=1.2;},
 draw(c){bg(c,756,430,'#7fb069');const TS=36,OY=34;
   for(let i=0;i<231;i++){const x=(i%21)*TS,y=OY+Math.floor(i/21)*TS,v=this.m[i];if(v===1)box(c,x+1,y+1,TS-2,TS-2,5,'#6c757d');else if(v===2){box(c,x+2,y+2,TS-4,TS-4,4,'#c8915a');c.fillStyle='rgba(0,0,0,.12)';c.fillRect(x+4,y+TS/2,TS-8,2);c.fillRect(x+TS/2,y+4,2,TS/2-4);}}
   for(const f of this.fire){c.fillStyle=`rgba(255,${120+Math.floor(f.t*200)},40,.85)`;c.fillRect(f.x*TS+3,OY+f.y*TS+3,TS-6,TS-6);}
   for(const b of this.bombs){const s=1+Math.sin(b.t*14)*.08;circle(c,(b.x+.5)*TS,OY+(b.y+.5)*TS,12*s,'#222');circle(c,(b.x+.5)*TS-4,OY+(b.y+.5)*TS-4,3,'rgba(255,255,255,.5)');line(c,(b.x+.5)*TS+6,OY+(b.y+.5)*TS-9,(b.x+.5)*TS+10,OY+(b.y+.5)*TS-15,'#ff9f1c',2);}
   for(const e of this.en)if(!e.dead){const X=(e.mx+.5)*TS,Y=OY+(e.my+.5)*TS;circle(c,X,Y,13,'#9d4edd');circle(c,X-5,Y-3,3.5,'#fff');circle(c,X+5,Y-3,3.5,'#fff');circle(c,X-5,Y-3,1.6,'#222');circle(c,X+5,Y-3,1.6,'#222');}
   const p=this.p,X=(p.mx+.5)*TS,Y=OY+(p.my+.5)*TS;if(this.deadT)T(c,'💥',X,Y,30,'#fff');else{circle(c,X,Y,13,'#fff','#3d6fd6',3);circle(c,X-4,Y-2,2.2,'#222');circle(c,X+4,Y-2,2.2,'#222');}
   T(c,`ステージ ${this.st+1}`,10,17,14,'#fff','left');T(c,`のこり ${this.en.filter(e=>!e.dead).length}体`,746,17,14,'#fff','right');if(this.clearT)T(c,'ステージクリア！',378,215,26,'#fff','center',5);}},

/* ---------- 陣取りライン ---------- */
{id:'xonix',name:'陣取りライン',emoji:'🗺️',tag:'アクション',color:['#a2d2ff','#3a86ff'],
 desc:'陣地の外へ線を引いて囲いこもう。線が戻ると、敵のいない側が自分の陣地に！ 75%取ればステージクリア。',
 help:'矢印キー / WASD / スワイプで移動。線を引いている途中に敵に当たるとアウト',
 w:696,h:390,GW:87,GH:45,CS:8,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']],
 reset(api){this.api=api;this.lv=0;this.lives=3;this.load();},
 load(){const W=87,H=45;this.g=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<2||y<2||x>=W-2||y>=H-2)this.g[y*W+x]=1;
   this.p={x:43,y:0,d:null};this.en=[...Array(2+this.lv)].map(()=>({x:rnd(10,77),y:rnd(10,35),vx:(Math.random()<.5?-1:1)*rnd(14,20),vy:(Math.random()<.5?-1:1)*rnd(14,20)}));this.acc=0;this.trail=[];this.K={};this.dieT=0;this.clearT=0;},
 pct(){let n=0;for(let y=2;y<43;y++)for(let x=2;x<85;x++)if(this.g[y*87+x]===1)n++;return n/(83*41);},
 key(c,d){this.K[c]=d;const m={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1]}[c];if(m&&d)this.p.d=m;},
 pointer(t,x,y){if(t==='down'){this.sx=x;this.sy=y;}else if(t==='move'&&this.sx!=null){const dx=x-this.sx,dy=y-this.sy;if(Math.hypot(dx,dy)>18){this.p.d=Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)];this.swipe=true;this.sx=x;this.sy=y;}}else if(t==='up'){this.sx=null;}},
 held(){const K=this.K;return K.ArrowLeft||K.ArrowRight||K.ArrowUp||K.ArrowDown||K.KeyA||K.KeyD||K.KeyW||K.KeyS;},
 fill(){for(const i of this.trail)this.g[i]=1;this.trail=[];const W=87,seen=new Uint8Array(W*45),st=[];
   for(const e of this.en){const i=Math.floor(e.y)*W+Math.floor(e.x);if(!this.g[i]&&!seen[i]){seen[i]=1;st.push(i);}}
   while(st.length){const i=st.pop();for(const d of[1,-1,W,-W]){const j=i+d;if(j>=0&&j<W*45&&!this.g[j]&&!seen[j]){seen[j]=1;st.push(j);}}}
   let gained=0;for(let i=0;i<W*45;i++)if(!this.g[i]&&!seen[i]){this.g[i]=1;gained++;}this.api.addScore(gained);
   if(this.pct()>=.75){this.clearT=1.5;this.api.addScore(1000);}},
 die(){this.lives--;for(const i of this.trail)this.g[i]=0;this.trail=[];this.dieT=1;},
 update(dt){if(this.dieT){this.dieT-=dt;if(this.dieT<=0){this.dieT=0;if(this.lives<=0)return this.api.over();this.p={x:43,y:0,d:null};}return;}
   if(this.clearT){this.clearT-=dt;if(this.clearT<=0){this.lv++;this.load();}return;}
   const W=87;this.acc+=dt;while(this.acc>=.045){this.acc-=.045;const p=this.p;if(!p.d)break;const onLand=this.g[p.y*W+p.x]===1;
     const nx=clamp(p.x+p.d[0],0,86),ny=clamp(p.y+p.d[1],0,44);const v=this.g[ny*W+nx];if(v===2){this.die();return;}
     p.x=nx;p.y=ny;if(v===0){this.g[ny*W+nx]=2;this.trail.push(ny*W+nx);}else if(this.trail.length)this.fill();
     if(this.g[p.y*W+p.x]===1&&!this.held()&&!this.swipe)p.d=null;}
   this.swipe=false;
   for(const e of this.en){for(const ax of['x','y']){const v=ax==='x'?'vx':'vy';const n=e[ax]+e[v]*dt,cx=ax==='x'?Math.floor(n):Math.floor(e.x),cy=ax==='y'?Math.floor(n):Math.floor(e.y),cell=this.g[cy*W+cx];
       if(cell===2)return this.die();if(cell===1)e[v]*=-1;else e[ax]=n;}
     if(Math.floor(e.x)===this.p.x&&Math.floor(e.y)===this.p.y&&this.g[this.p.y*W+this.p.x]!==1)return this.die();}},
 draw(c){bg(c,696,390,'#0f1b2d');const CS=8,OY=30;
   for(let i=0;i<87*45;i++){const v=this.g[i];if(v){c.fillStyle=v===1?'#3a86ff':'#ffbe0b';c.fillRect((i%87)*CS,OY+Math.floor(i/87)*CS,CS,CS);}}
   for(const e of this.en)circle(c,e.x*CS,OY+e.y*CS,6,'#ff006e','#fff',2);
   const p=this.p;box(c,p.x*CS-2,OY+p.y*CS-2,CS+4,CS+4,3,'#fff',this.dieT?UI.red:'#ffbe0b',2);
   T(c,`陣地 ${Math.floor(this.pct()*100)}% / 75%`,10,15,13,'#fff','left');T(c,`ステージ ${this.lv+1}  ${'♥'.repeat(Math.max(0,this.lives))}`,686,15,13,'#ff8fb8','right');
   if(this.clearT)T(c,'ステージクリア！',348,210,26,'#fff','center',5);}},

/* ---------- スカイダイビング ---------- */
{id:'skydive',name:'スカイダイビング',emoji:'🪂',tag:'アクション',color:['#bde0fe','#3a86ff'],
 desc:'空からダイブ！ リングをくぐって得点を稼ぎ、鳥や風船をよけながら地上を目指そう。',
 help:'←→ / マウス・指を左右に動かして移動',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 reset(api){this.api=api;this.x=180;this.alt=3000;this.o=[];this.spT=0;this.lives=3;this.combo=0;this.L=this.R=false;this.tx=null;this.inv=0;this.cl=[...Array(6)].map(()=>({x:rnd(0,360),y:rnd(0,560),s:rnd(.6,1.4)}));this.fx=[];},
 key(c,d){if(c==='ArrowLeft'||c==='KeyA'){this.L=d;this.tx=null;}if(c==='ArrowRight'||c==='KeyD'){this.R=d;this.tx=null;}},
 pointer(t,x){if(t!=='up')this.tx=x;},
 update(dt){const fall=260;this.alt-=50*dt;this.inv-=dt;if(this.alt<=0){this.alt=0;return this.api.win(`着地成功！ スコア ${score}`);}
   if(this.L)this.x-=260*dt;if(this.R)this.x+=260*dt;if(this.tx!=null)this.x+=clamp(this.tx-this.x,-300*dt,300*dt);this.x=clamp(this.x,20,340);
   for(const k of this.cl){k.y-=fall*.4*k.s*dt;if(k.y<-60){k.y=620;k.x=rnd(0,360);}}
   this.spT-=dt;if(this.spT<=0){this.spT=rnd(.5,.9);const r=Math.random();this.o.push(r<.55?{t:'ring',x:rnd(50,310),y:600}:{t:r<.8?'bird':'balloon',x:rnd(30,330),y:600,vx:r<.8?rnd(-60,60):0});}
   for(const o of this.o){o.y-=fall*dt;if(o.vx){o.x+=o.vx*dt;if(o.x<20||o.x>340)o.vx*=-1;}
     if(o.t==='ring'&&!o.done&&o.y<180&&o.y>160-fall*dt){o.done=true;if(Math.abs(o.x-this.x)<34){this.combo++;this.api.addScore(10*this.combo);this.fx.push({x:o.x,y:170,t:.8,s:'+'+10*this.combo});}else this.combo=0;}
     if(o.t!=='ring'&&!o.hit&&this.inv<=0&&dist(o.x,o.y,this.x,180)<26){o.hit=true;this.lives--;this.inv=1.5;this.combo=0;if(this.lives<=0)return this.api.over('墜落…');}}
   this.o=this.o.filter(o=>o.y>-60);for(const f of this.fx){f.t-=dt;f.y-=40*dt;}this.fx=this.fx.filter(f=>f.t>0);},
 draw(c){const g=c.createLinearGradient(0,0,0,560);g.addColorStop(0,'#90caf9');g.addColorStop(1,'#e3f2fd');c.fillStyle=g;c.fillRect(0,0,360,560);
   for(const k of this.cl){c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.ellipse(k.x,k.y,50*k.s,18*k.s,0,0,7);c.fill();}
   for(const o of this.o){if(o.t==='ring'){c.beginPath();c.ellipse(o.x,o.y,36,12,0,0,7);c.strokeStyle=o.done?'rgba(255,255,255,.5)':UI.yellow;c.lineWidth=6;c.stroke();}else T(c,o.t==='bird'?'🐦':'🎈',o.x,o.y,30,UI.ink);}
   if(!(this.inv>0&&Math.floor(this.inv*10)%2)){const X=this.x,Y=180;circle(c,X,Y-14,9,'#ffd6a5');box(c,X-10,Y-6,20,22,6,UI.red);line(c,X-10,Y,X-24,Y-10,UI.red,5);line(c,X+10,Y,X+24,Y-10,UI.red,5);line(c,X-6,Y+16,X-12,Y+28,'#1d3557',5);line(c,X+6,Y+16,X+12,Y+28,'#1d3557',5);}
   for(const f of this.fx){c.globalAlpha=Math.min(1,f.t*2);T(c,f.s,f.x,f.y,22,UI.orange,'center',4);}c.globalAlpha=1;
   T(c,`高度 ${Math.ceil(this.alt)} m`,12,22,15,'#1d3557','left');T(c,'♥'.repeat(Math.max(0,this.lives)),348,22,16,UI.red,'right');if(this.combo>1)T(c,`コンボ ×${this.combo}`,180,50,16,UI.orange);}},

/* ---------- 潜水艦ハンター ---------- */
{id:'subhunt',name:'潜水艦ハンター',emoji:'⚓',tag:'シューティング',color:['#a9def9','#023e8a'],
 desc:'船から爆雷を落として、海の中の潜水艦をしずめよう。深いほど高得点。魚雷に気をつけて！ 90秒勝負。',
 help:'←→ / マウス・指で船を動かし、スペース / 「投下」/ 海をタップで爆雷を落とす',
 w:640,h:360,
 pad:[['←','ArrowLeft'],['投下','Space'],['→','ArrowRight']],
 reset(api){this.api=api;this.x=320;this.time=90;this.ch=[];this.sub=[];this.tor=[];this.fx=[];this.spT=0;this.lives=3;this.L=this.R=false;this.tx=null;this.inv=0;},
 drop(){if(this.ch.length<3)this.ch.push({x:this.x,y:70});},
 key(c,d){if(c==='ArrowLeft'||c==='KeyA'){this.L=d;this.tx=null;}if(c==='ArrowRight'||c==='KeyD'){this.R=d;this.tx=null;}if(d&&c==='Space')this.drop();},
 pointer(t,x,y){if(t==='down'&&y>80)this.drop();if(t!=='up'&&y<=80)this.tx=x;else if(t==='down')this.tx=x;},
 update(dt){this.time-=dt;this.inv-=dt;if(this.time<=0){this.time=0;return this.api.over('タイムアップ！');}
   if(this.L)this.x-=200*dt;if(this.R)this.x+=200*dt;if(this.tx!=null)this.x+=clamp(this.tx-this.x,-220*dt,220*dt);this.x=clamp(this.x,30,610);
   this.spT-=dt;if(this.spT<=0){this.spT=rnd(.6,1.4);const dir=Math.random()<.5?1:-1;this.sub.push({x:dir>0?-40:680,y:rnd(130,330),vx:dir*rnd(40,100),fire:rnd(1,3)});}
   for(const s of this.sub){s.x+=s.vx*dt;s.fire-=dt;if(s.fire<=0){s.fire=rnd(2.5,4.5);this.tor.push({x:s.x,y:s.y-10});}}
   for(const ch of this.ch){ch.y+=95*dt;for(const s of this.sub)if(!s.dead&&Math.abs(ch.x-s.x)<30&&Math.abs(ch.y-s.y)<16){s.dead=true;ch.y=999;const pts=Math.round((s.y-100)/5)*2;this.api.addScore(pts);this.fx.push({x:s.x,y:s.y,t:.8,s:'+'+pts});}}
   for(const t of this.tor){t.y-=70*dt;if(t.y<=72&&!t.done){t.done=true;if(Math.abs(t.x-this.x)<34&&this.inv<=0){this.lives--;this.inv=1.5;this.fx.push({x:this.x,y:60,t:.8,s:'💥'});if(this.lives<=0)return this.api.over('船がしずんだ…');}}}
   this.ch=this.ch.filter(c=>c.y<370);this.sub=this.sub.filter(s=>!s.dead&&s.x>-60&&s.x<700);this.tor=this.tor.filter(t=>!t.done);
   for(const f of this.fx){f.t-=dt;f.y-=30*dt;}this.fx=this.fx.filter(f=>f.t>0);},
 draw(c){bg(c,640,360,'#cfe8ff');const g=c.createLinearGradient(0,80,0,360);g.addColorStop(0,'#4ea8de');g.addColorStop(1,'#03045e');c.fillStyle=g;c.fillRect(0,80,640,280);
   for(const s of this.sub){c.save();c.translate(s.x,s.y);c.scale(s.vx>0?1:-1,1);box(c,-30,-10,60,20,10,'#495057');box(c,-6,-20,16,12,4,'#495057');line(c,4,-20,4,-28,'#495057',3);c.restore();}
   for(const t of this.tor)box(c,t.x-2,t.y-8,4,14,2,'#ffbe0b');
   for(const ch of this.ch){circle(c,ch.x,ch.y,7,'#222');line(c,ch.x-7,ch.y,ch.x+7,ch.y,'#666',2);}
   if(!(this.inv>0&&Math.floor(this.inv*10)%2)){c.fillStyle='#e5484d';c.beginPath();c.moveTo(this.x-36,70);c.lineTo(this.x+36,70);c.lineTo(this.x+26,84);c.lineTo(this.x-26,84);c.fill();box(c,this.x-12,52,26,18,4,'#f8f9fa');}
   for(const f of this.fx){c.globalAlpha=Math.min(1,f.t*2);T(c,f.s,f.x,f.y,18,'#fff','center',4);}c.globalAlpha=1;
   T(c,`${Math.ceil(this.time)}秒`,630,20,15,UI.ink,'right');T(c,'♥'.repeat(Math.max(0,this.lives)),12,20,16,UI.red,'left');T(c,`爆雷 ${3-this.ch.length}`,320,20,13,UI.sub);}},

/* ---------- いろくぐり ---------- */
{id:'colorpass',name:'いろくぐり',emoji:'🟣',tag:'アクション',color:['#ffadad','#7209b7'],
 desc:'タップでボールを跳ね上げ、回る輪の「ボールと同じ色」の部分だけをくぐり抜けよう。',
 help:'スペース / クリック / タップでジャンプ',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 C:['#ff4d6d','#4cc9f0','#ffd166','#80ed99'],
 reset(api){this.api=api;this.y=430;this.vy=0;this.col=0;this.cam=0;this.obs=[];this.nextY=200;this.started=false;for(let i=0;i<4;i++)this.addObs();this.parts=[];},
 addObs(){const y=this.nextY,R=ri(0,1)?80:95;this.obs.push({y,R,rot:rnd(0,7),sp:(Math.random()<.5?-1:1)*rnd(1.2,2)*(1+this.obs.length*.03),star:true,sw:{y:y-150,done:false}});this.nextY-=300;},
 jump(){this.vy=-400;this.started=true;},
 key(c,d,rep){if(d&&!rep&&(c==='Space'||c==='ArrowUp'))this.jump();},
 pointer(t){if(t==='down')this.jump();},
 onStart(){this.jump();},
 segAt(o,ang){const a=((ang-o.rot)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);return Math.floor(a/(Math.PI/2));},
 update(dt){if(this.started){this.vy+=1100*dt;this.y+=this.vy*dt;}
   if(this.y-this.cam<250)this.cam=this.y-250;if(this.y-this.cam>580)return this.api.over(`${score}個くぐった`);
   for(const o of this.obs){o.rot+=o.sp*dt;const d=Math.abs(this.y-o.y);
     if(o.star&&d<14){o.star=false;this.api.addScore(1);}
     if(!o.sw.done&&Math.abs(this.y-o.sw.y)<16){o.sw.done=true;let n;do{n=ri(0,3);}while(n===this.col);this.col=n;}
     for(const ang of[Math.PI/2,-Math.PI/2]){const by=o.y+Math.sin(ang)*o.R;if(Math.abs(this.y-by)<10+9){if(this.segAt(o,ang)!==this.col){for(let k=0;k<20;k++)this.parts.push({x:180,y:this.y,vx:rnd(-200,200),vy:rnd(-300,100),c:this.C[this.col]});return this.api.over(`${score}個くぐった`);}}}}
   if(this.obs[0].y-this.cam>700){this.obs.shift();this.addObs();}},
 draw(c){bg(c,360,560,'#1a1a2e');c.save();c.translate(0,-this.cam);
   for(const o of this.obs){for(let k=0;k<4;k++){c.beginPath();c.arc(180,o.y,o.R,o.rot+k*Math.PI/2+.02,o.rot+(k+1)*Math.PI/2-.02);c.strokeStyle=this.C[k];c.lineWidth=16;c.stroke();}
     if(o.star)T(c,'★',180,o.y,26,'#fff');
     if(!o.sw.done){for(let k=0;k<4;k++){c.beginPath();c.moveTo(180,o.sw.y);c.arc(180,o.sw.y,11,k*Math.PI/2,(k+1)*Math.PI/2);c.fillStyle=this.C[k];c.fill();}}}
   if(state!=='over')circle(c,180,this.y,9,this.C[this.col]);
   c.restore();T(c,String(score),180,40,30,'#fff');
   if(!this.started&&state==='play')T(c,'タップでジャンプ',180,500,16,'rgba(255,255,255,.7)');}}
);
