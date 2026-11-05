'use strict';
/* パック8：スポーツ 10本 */

/* 円と長方形の衝突（反射）— ミニゴルフなどで共通 */
function bounceRect(b,r,rest){const cx=clamp(b.x,r[0],r[0]+r[2]),cy=clamp(b.y,r[1],r[1]+r[3]),dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy);
  if(d>=b.r||d===0&&!(b.x>r[0]&&b.x<r[0]+r[2]&&b.y>r[1]&&b.y<r[1]+r[3]))return false;
  let nx,ny;if(d>0){nx=dx/d;ny=dy/d;b.x=cx+nx*b.r;b.y=cy+ny*b.r;}else{const l=b.x-r[0],rt=r[0]+r[2]-b.x,t=b.y-r[1],bt=r[1]+r[3]-b.y,m=Math.min(l,rt,t,bt);nx=m===l?-1:m===rt?1:0;ny=m===t?-1:m===bt?1:0;b.x+=nx*(m+b.r);b.y+=ny*(m+b.r);}
  const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=(1+rest)*vn*nx;b.vy-=(1+rest)*vn*ny;}return true;}

addGames(

/* ---------- エアホッケー ---------- */
{id:'airhockey',name:'エアホッケー',emoji:'🏒',tag:'スポーツ',color:['#a0c4ff','#e5484d'],
 desc:'マレットでパックを打ち合い、相手のゴールに入れよう。先に7点でCPUに勝利！',
 help:'マウス / ドラッグでマレットを動かす（矢印キーでもOK）',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 reset(api){this.api=api;this.p={x:180,y:470,vx:0,vy:0};this.c={x:180,y:90,vx:0,vy:0};this.ps=0;this.cs=0;this.tx=180;this.ty=470;this.K={};this.serve(1);},
 serve(dir){this.k={x:180,y:280+dir*40,vx:0,vy:0};this.wait=.8;},
 key(c,d){this.K[c]=d;},
 pointer(t,x,y){if(t!=='up'){this.tx=x;this.ty=y;}},
 hit(m,k){const dx=k.x-m.x,dy=k.y-m.y,d=Math.hypot(dx,dy);if(d>=39||d===0)return;const nx=dx/d,ny=dy/d;k.x=m.x+nx*39;k.y=m.y+ny*39;
   const rvx=k.vx-m.vx,rvy=k.vy-m.vy,vn=rvx*nx+rvy*ny;if(vn<0){k.vx-=2*vn*nx;k.vy-=2*vn*ny;}const sp=Math.hypot(k.vx,k.vy);if(sp>950){k.vx*=950/sp;k.vy*=950/sp;}},
 update(dt){const K=this.K;if(K.ArrowLeft)this.tx-=400*dt;if(K.ArrowRight)this.tx+=400*dt;if(K.ArrowUp)this.ty-=400*dt;if(K.ArrowDown)this.ty+=400*dt;
   const p=this.p,c=this.c,k=this.k;const ox=p.x,oy=p.y;const tx=clamp(this.tx,25,335),ty=clamp(this.ty,305,535);this.tx=tx;this.ty=ty;
   const mv=(m,X,Y,sp)=>{const dx=X-m.x,dy=Y-m.y,d=Math.hypot(dx,dy),s=Math.min(d,sp*dt);if(d>0){m.x+=dx/d*s;m.y+=dy/d*s;}};
   mv(p,tx,ty,1100);p.vx=(p.x-ox)/dt;p.vy=(p.y-oy)/dt;
   const cox=c.x,coy=c.y,lvl=520+this.ps*25;if(k.y<290&&this.wait<=0){mv(c,k.x,Math.max(30,k.y-24),lvl);}else mv(c,180+(k.x-180)*.5,80,lvl*.6);c.x=clamp(c.x,25,335);c.y=clamp(c.y,25,255);c.vx=(c.x-cox)/dt;c.vy=(c.y-coy)/dt;
   if(this.wait>0){this.wait-=dt;return;}
   for(let s=0;s<4;s++){const h=dt/4;k.x+=k.vx*h;k.y+=k.vy*h;
     if(k.x<15){k.x=15;k.vx=Math.abs(k.vx)*.9;}if(k.x>345){k.x=345;k.vx=-Math.abs(k.vx)*.9;}
     const inGoal=k.x>120&&k.x<240;
     if(k.y<15&&!inGoal){k.y=15;k.vy=Math.abs(k.vy)*.9;}if(k.y>545&&!inGoal){k.y=545;k.vy=-Math.abs(k.vy)*.9;}
     this.hit(p,k);this.hit(c,k);}
   const f=Math.pow(.7,dt);k.vx*=f;k.vy*=f;
   if(k.y<-15){this.ps++;this.api.setScore(this.ps);if(this.ps>=7)return this.api.win(`勝利！ ${this.ps} 対 ${this.cs}`);this.serve(-1);}
   if(k.y>575){this.cs++;if(this.cs>=7)return this.api.over(`負け… ${this.ps} 対 ${this.cs}`);this.serve(1);}},
 draw(c){bg(c,360,560,'#eef6ff');box(c,4,4,352,552,24,null,'#9ec5fe',6);line(c,4,280,356,280,'rgba(229,72,77,.4)',3);circle(c,180,280,50,null,'rgba(229,72,77,.4)',3);
   box(c,120,0,120,8,3,'#333');box(c,120,552,120,8,3,'#333');
   T(c,String(this.cs),330,250,30,'rgba(0,0,0,.18)');T(c,String(this.ps),330,312,30,'rgba(0,0,0,.18)');
   const k=this.k;circle(c,k.x,k.y,15,'#222');circle(c,k.x,k.y,9,null,'#555',2);
   for(const[m,col]of[[this.p,UI.blue],[this.c,UI.red]]){circle(c,m.x,m.y+3,24,'rgba(0,0,0,.15)');circle(c,m.x,m.y,24,col);circle(c,m.x,m.y,11,'rgba(255,255,255,.5)');}}},

/* ---------- ミニゴルフ ---------- */
{id:'minigolf',name:'ミニゴルフ',emoji:'⛳',tag:'スポーツ',color:['#b7e4c7','#2d6a4f'],
 desc:'ボールを引っぱって打ち出し、カップに入れよう。全6ホール、少ない打数でまわろう。',
 help:'ボールの近くからドラッグして引っぱり、はなすと打つ（引くほど強い）',
 w:800,h:450,
 C:[{s:[200,450],h:[200,110],par:2,w:[[110,280,180,16]]},
    {s:[80,450],h:[320,110],par:3,w:[[20,310,240,16],[140,190,240,16]]},
    {s:[200,465],h:[200,95],par:3,w:[[60,350,120,16],[220,350,120,16],[140,220,120,16]]},
    {s:[60,460],h:[330,100],par:3,w:[[120,50,16,330],[260,170,16,330]]},
    {s:[200,470],h:[200,250],par:3,w:[[140,310,120,12],[140,190,12,132],[248,190,12,132]]},
    {s:[60,460],h:[340,460],par:3,w:[[190,200,20,300],[90,110,40,40],[270,110,40,40]]}],
 reset(api){this.api=api;this.hole=0;this.total=0;this.par=0;this.load();},
 load(){const C=this.C[this.hole],P=(x,y)=>[85+(500-y)*1.4,50+(x-20)];this.S=P(C.s[0],C.s[1]);this.Hh=P(C.h[0],C.h[1]);
   this.W=C.w.map(r=>[85+(500-(r[1]+r[3]))*1.4,50+(r[0]-20),r[3]*1.4,r[2]]);this.b={x:this.S[0],y:this.S[1],vx:0,vy:0,r:7};this.strokes=0;this.aim=null;this.inT=0;},
 still(){return Math.hypot(this.b.vx,this.b.vy)<1;},
 pointer(t,x,y){if(this.inT||!this.still())return;
   if(t==='down')this.aim={x,y,cx:x,cy:y};else if(t==='move'&&this.aim){this.aim.cx=x;this.aim.cy=y;}
   else if(t==='up'&&this.aim){const dx=this.aim.x-this.aim.cx,dy=this.aim.y-this.aim.cy,L=Math.min(160,Math.hypot(dx,dy));this.aim=null;if(L<8)return;
     const k=L*5.8/Math.hypot(dx,dy);this.b.vx=dx*k;this.b.vy=dy*k;this.strokes++;}},
 update(dt){const b=this.b,C=this.C[this.hole];
   if(this.inT){this.inT-=dt;if(this.inT<=0){this.total+=this.strokes;this.par+=C.par;this.api.setScore(Math.max(0,100+(this.par-this.total)*10));this.hole++;
     if(this.hole>=this.C.length)return this.total<=this.par?this.api.win(`${this.total}打（パー${this.par}）`):this.api.over(`${this.total}打（パー${this.par}）`);this.load();}return;}
   for(let s=0;s<4;s++){const h=dt/4;b.x+=b.vx*h;b.y+=b.vy*h;for(const r of this.W.concat([[60,40,25,380],[715,40,25,380],[60,30,680,20],[60,410,680,20]]))bounceRect(b,r,.75);}
   const sp=Math.hypot(b.vx,b.vy);if(sp>0){const ns=Math.max(0,sp-140*dt)*Math.pow(.6,dt);b.vx*=ns/sp;b.vy*=ns/sp;}
   const d=dist(b.x,b.y,this.Hh[0],this.Hh[1]);if(d<11&&sp<280){this.inT=1;b.vx=b.vy=0;b.x=this.Hh[0];b.y=this.Hh[1];}else if(d<11){b.vx+=(b.x-this.Hh[0])*4;b.vy+=(b.y-this.Hh[1])*4;}},
 draw(c){bg(c,800,450,'#f1f7ee');const C=this.C[this.hole],b=this.b;
   box(c,85,50,630,360,16,'#74c69d');for(let x=97;x<705;x+=24){c.fillStyle='rgba(255,255,255,.06)';c.fillRect(x,50,12,360);}
   for(const r of this.W)box(c,r[0],r[1],r[2],r[3],4,'#8d6e63');
   circle(c,this.Hh[0],this.Hh[1],11,'#1b4332');line(c,this.Hh[0],this.Hh[1],this.Hh[0],this.Hh[1]-42,'#555',2);c.fillStyle=UI.red;c.beginPath();c.moveTo(this.Hh[0],this.Hh[1]-42);c.lineTo(this.Hh[0]+20,this.Hh[1]-35);c.lineTo(this.Hh[0],this.Hh[1]-28);c.fill();
   if(this.aim){const dx=this.aim.x-this.aim.cx,dy=this.aim.y-this.aim.cy,L=Math.min(160,Math.hypot(dx,dy));if(L>4){const ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy);c.setLineDash([6,6]);line(c,b.x,b.y,b.x+ux*L*.9,b.y+uy*L*.9,'#fff',3);c.setLineDash([]);
     box(c,620,14,80,10,5,'#ddd');box(c,620,14,80*L/160,10,5,L>120?UI.red:UI.orange);}}
   if(!this.inT)circle(c,b.x,b.y,7,'#fff','#adb5bd',1.5);
   T(c,`ホール ${this.hole+1} / 6　パー ${C.par}`,20,22,15,UI.ink,'left');T(c,`打数 ${this.strokes}（合計 ${this.total+this.strokes}）`,20,436,13,UI.sub,'left');
   if(this.inT)T(c,this.strokes===1?'ホールインワン！':this.strokes<C.par?'バーディー！':this.strokes===C.par?'パー':'カップイン',400,230,26,'#fff','center',5);}},

/* ---------- シュートチャレンジ ---------- */
{id:'hoops',name:'シュートチャレンジ',emoji:'🏀',tag:'スポーツ',color:['#ffb703','#e85d04'],
 desc:'ボールを上にはじいてゴールに入れよう。リングにかすらず入れるとボーナス！ 60秒勝負。',
 help:'ボールを上向きにドラッグ（フリック）して投げる',
 w:800,h:450,
 reset(api){this.api=api;this.time=60;this.hx=400;this.hv=0;this.newBall();this.fx=[];},
 newBall(){this.b={x:400,y:400,vx:0,vy:0,r:15,fly:false,touched:false,scored:false,above:false};},
 pointer(t,x,y){if(this.b.fly)return;if(t==='down'&&dist(x,y,this.b.x,this.b.y)<60){this.drag={x,y,t:performance.now()};}
   else if(t==='up'&&this.drag){const dx=x-this.drag.x,dy=y-this.drag.y;this.drag=null;if(dy>-30)return;const b=this.b;b.vx=dx*2.4;b.vy=clamp(dy*3.6,-900,-450);b.fly=true;}},
 update(dt){this.time-=dt;if(this.time<=0){this.time=0;return this.api.over(`タイムアップ！ ${score}点`);}
   if(score>=10){this.hv=this.hv||70;this.hx+=this.hv*dt;if(this.hx<120||this.hx>680)this.hv*=-1;}
   const b=this.b;if(b.fly){for(let s=0;s<3;s++){const h=dt/3,py=b.y;b.vy+=980*h;b.x+=b.vx*h;b.y+=b.vy*h;
       if(b.x<15||b.x>785){b.vx*=-.7;b.x=clamp(b.x,15,785);}
       for(const rx of[this.hx-28,this.hx+28]){const dx=b.x-rx,dy=b.y-130,d=Math.hypot(dx,dy);if(d<b.r+4&&d>0){const nx=dx/d,ny=dy/d,vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.7*vn*nx;b.vy-=1.7*vn*ny;}b.x=rx+nx*(b.r+4);b.y=130+ny*(b.r+4);b.touched=true;}}
       if(b.y<110)b.above=true;
       if(!b.scored&&b.above&&py<130&&b.y>=130&&b.vy>0&&Math.abs(b.x-this.hx)<24){b.scored=true;const pts=b.touched?2:3;this.api.addScore(pts);this.fx.push({t:1,s:b.touched?'ナイス！ +2':'スウィッシュ！ +3'});}}
     if(b.y>520)this.newBall();}
   for(const f of this.fx)f.t-=dt;this.fx=this.fx.filter(f=>f.t>0);},
 draw(c){bg(c,800,450,'#fdf0d5');c.fillStyle='#e9c46a';c.fillRect(0,420,800,30);
   const hx=this.hx;box(c,hx-55,30,110,80,6,'#fff','#adb5bd',3);box(c,hx-22,55,44,34,2,null,UI.red,3);
   const b=this.b,front=b.fly&&b.vy>0&&b.y<160;
   const drawBall=()=>{circle(c,b.x,b.y,b.r,'#f77f00','#9c4a00',2);line(c,b.x-b.r,b.y,b.x+b.r,b.y,'#9c4a00',1.5);line(c,b.x,b.y-b.r,b.x,b.y+b.r,'#9c4a00',1.5);};
   if(!front)drawBall();
   c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.5;for(let k=0;k<6;k++){c.beginPath();c.moveTo(hx-26+k*10.4,132);c.lineTo(hx-18+k*7.2,175);c.stroke();}
   line(c,hx-28,130,hx+28,130,UI.red,5);
   if(front)drawBall();
   T(c,`${Math.ceil(this.time)}秒`,788,24,16,UI.ink,'right');T(c,`${score}点`,12,24,18,UI.ink,'left');
   for(const f of this.fx){c.globalAlpha=Math.min(1,f.t*2);T(c,f.s,400,240-(1-f.t)*40,24,UI.orange,'center',4);}c.globalAlpha=1;
   if(!b.fly)T(c,'↑ 上にフリック',400,436,14,'#7a5c00');}},

/* ---------- PK戦 ---------- */
{id:'pk',name:'PK戦',emoji:'⚽',tag:'スポーツ',color:['#95d5b2','#1b4332'],
 desc:'キッカーとキーパーを交互に担当するPK戦。5本ずつ蹴って、多く決めたほうの勝ち！',
 help:'キッカー：ねらう場所をタップ。キーパー：ボールが飛ぶ方向をタップして飛びつく',
 w:400,h:480,
 reset(api){this.api=api;this.n=0;this.me=0;this.cpu=0;this.log=[];this.start();},
 start(){this.kick=this.n%2===0;this.ph='aim';this.ball={x:200,y:420,s:1};this.kp={x:200,tx:200};this.t=0;this.res='';if(!this.kick){this.ph='runup';this.t=rnd(.7,1.3);this.tgt={x:rnd(75,325),y:rnd(135,250)};}},
 shoot(x,y){this.tgt={x:x+rnd(-12,12),y:y+rnd(-10,10)};this.ph='fly';this.t=0;const zone=Math.random();this.kp.tx=zone<.37?110:zone<.74?290:200;},
 pointer(t,x,y){if(t!=='down')return;if(this.kick&&this.ph==='aim'&&y<330)this.shoot(x,y);else if(!this.kick&&(this.ph==='runup'||this.ph==='fly'))this.kp.tx=clamp(x,70,330);},
 update(dt){const kp=this.kp;
   if(this.ph==='runup'){this.t-=dt;if(this.t<=0){this.ph='fly';this.t=0;}return;}
   if(this.ph==='fly'){this.t+=dt/(this.kick?.55:.6);kp.x+=clamp(kp.tx-kp.x,-(this.kick?520:620)*dt,(this.kick?520:620)*dt);const e=Math.min(1,this.t),b=this.ball;b.x=200+(this.tgt.x-200)*e;b.y=420+(this.tgt.y-420)*e;b.s=1-e*.45;
     if(this.t>=1){const g=this.tgt,inGoal=g.x>62&&g.x<338&&g.y>122&&g.y<262,saved=inGoal&&Math.abs(kp.x-g.x)<(g.y<160?34:48);
       const goal=inGoal&&!saved;if(this.kick){if(goal)this.me++;}else if(goal)this.cpu++;this.log.push({k:this.kick,goal});
       this.res=!inGoal?'はずれ！':saved?'セーブ！':'ゴール！';if(!this.kick&&saved)this.api.addScore(10);if(this.kick&&goal)this.api.addScore(10);this.ph='res';this.t=1.3;}return;}
   if(this.ph==='res'){this.t-=dt;if(this.t<=0){this.n++;const mk=Math.ceil(this.n/2),ck=Math.floor(this.n/2);
     if(this.n>=10&&this.n%2===0&&this.me!==this.cpu)return this.me>this.cpu?this.api.win(`勝利！ ${this.me} 対 ${this.cpu}`):this.api.over(`負け… ${this.me} 対 ${this.cpu}`);
     if(this.n<10){const left=5-mk,cleft=5-ck;if(this.me>this.cpu+cleft)return this.api.win(`勝利！ ${this.me} 対 ${this.cpu}`);if(this.cpu>this.me+left)return this.api.over(`負け… ${this.me} 対 ${this.cpu}`);}
     if(this.n>=20)return this.api.over(`引き分け ${this.me} 対 ${this.cpu}`);this.start();}}},
 draw(c){bg(c,400,480,'#bde0a8');c.fillStyle='#a3cf8e';for(let y=280;y<480;y+=40)c.fillRect(0,y,400,20);
   c.fillStyle='rgba(255,255,255,.85)';c.fillRect(60,120,280,144);c.strokeStyle='#ddd';c.lineWidth=1;for(let x=60;x<=340;x+=14){c.beginPath();c.moveTo(x,120);c.lineTo(x,264);c.stroke();}for(let y=120;y<=264;y+=14){c.beginPath();c.moveTo(60,y);c.lineTo(340,y);c.stroke();}
   box(c,54,114,292,8,3,'#fff','#999');box(c,54,114,8,152,3,'#fff','#999');box(c,338,114,8,152,3,'#fff','#999');line(c,0,265,400,265,'#fff',3);
   const kp=this.kp,dive=(kp.x-200)/130;c.save();c.translate(kp.x,232);c.rotate(dive*.6);box(c,-12,-28,24,46,8,'#ffd60a');circle(c,0,-38,10,'#ffcf99');line(c,-12,-20,-34,-34,'#ffd60a',7);line(c,12,-20,34,-34,'#ffd60a',7);c.restore();
   const b=this.ball;circle(c,b.x,b.y,13*b.s,'#fff','#222',2);circle(c,b.x,b.y,5*b.s,'#222');
   T(c,`あなた ${this.me} - ${this.cpu} CPU`,200,24,18,UI.ink);
   const mine=this.log.filter(l=>l.k),cp=this.log.filter(l=>!l.k);for(let i=0;i<Math.max(5,mine.length);i++)circle(c,30+i*16,52,6,mine[i]?(mine[i].goal?UI.green:UI.red):'#fff','#888',1);
   for(let i=0;i<Math.max(5,cp.length);i++)circle(c,370-i*16,52,6,cp[i]?(cp[i].goal?UI.green:UI.red):'#fff','#888',1);
   T(c,this.ph==='res'?this.res:this.kick?'キッカー：ゴールのねらう場所をタップ！':'キーパー：ボールの方向へタップで飛びつけ！',200,90,15,this.ph==='res'?UI.ink:'#1b4332');}},

/* ---------- ボウリング ---------- */
{id:'bowling',name:'ボウリング',emoji:'🎳',tag:'スポーツ',color:['#cdb4db','#5a189a'],
 desc:'タイミングよく位置と角度を決めて投げ、ピンを倒そう。全5フレーム。',
 help:'1回目のタップで投げる位置、2回目で角度を決めて投球',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 reset(api){this.api=api;this.fr=0;this.roll=0;this.sc=[];this.setPins();this.prep();this.api.setScore(0);},
 setPins(){this.pins=[];const rows=[[0],[-1,1],[-2,0,2],[-3,-1,1,3]];rows.forEach((r,i)=>r.forEach(k=>this.pins.push({x:180+k*13,y:110-i*22,vx:0,vy:0,down:false,ox:180+k*13,oy:110-i*22})));},
 prep(){this.ph='pos';this.bx=180;this.bd=1;this.ang=0;this.ad=1;this.ball=null;this.t=0;},
 tap(){if(this.ph==='pos'){this.ph='angle';}else if(this.ph==='angle'){this.ph='roll';this.ball={x:this.bx,y:500,vx:Math.sin(this.ang)*520,vy:-Math.cos(this.ang)*520,r:12};this.t=0;}},
 key(c,d,rep){if(d&&!rep&&(c==='Space'||c==='Enter'))this.tap();},
 pointer(t){if(t==='down')this.tap();},
 update(dt){
   if(this.ph==='msg'){this.t-=dt;if(this.t<=0){if(this.nf){this.fr++;this.roll=0;if(this.fr>=5)return this.api.win(`合計 ${this.total()}点`);this.setPins();}else this.roll=1;this.prep();}return;}
   if(this.ph==='pos'){this.bx+=this.bd*150*dt;if(this.bx<112||this.bx>248)this.bd*=-1;this.bx=clamp(this.bx,112,248);return;}
   if(this.ph==='angle'){this.ang+=this.ad*.6*dt;if(Math.abs(this.ang)>.18)this.ad*=-1;return;}
   if(this.ph==='roll'){this.t+=dt;const b=this.ball,stand=this.pins.filter(p=>!p.gone);
     for(let s=0;s<4;s++){const h=dt/4;if(b){b.x+=b.vx*h;b.y+=b.vy*h;if(b.x<100||b.x>260){b.vx=0;b.x=clamp(b.x,94,266);}}
       for(const p of stand){p.x+=p.vx*h;p.y+=p.vy*h;}
       const bodies=b?[b].concat(stand):stand;for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){const A=bodies[i],B=bodies[j],ra=A.r||7,rb=B.r||7,dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy);
         if(d>0&&d<ra+rb){const nx=dx/d,ny=dy/d,ma=A.r?6:1,mb=B.r?6:1,ov=ra+rb-d;A.x-=nx*ov*mb/(ma+mb);A.y-=ny*ov*mb/(ma+mb);B.x+=nx*ov*ma/(ma+mb);B.y+=ny*ov*ma/(ma+mb);
           const rv=(B.vx-A.vx)*nx+(B.vy-A.vy)*ny;if(rv<0){const j2=-(1.6)*rv/(1/ma+1/mb);A.vx-=j2*nx/ma;A.vy-=j2*ny/ma;B.vx+=j2*nx/mb;B.vy+=j2*ny/mb;}}}}
     for(const p of stand){p.vx*=Math.pow(.25,dt);p.vy*=Math.pow(.25,dt);if(dist(p.x,p.y,p.ox,p.oy)>5)p.down=true;}
     const moving=stand.some(p=>Math.hypot(p.vx,p.vy)>8)||(b&&b.y>-20);if(b&&b.y<-20)this.ball=null;
     if(!moving||this.t>5)this.score();}},
 score(){const down=this.pins.filter(p=>p.down&&!p.gone).length;for(const p of this.pins)if(p.down)p.gone=true;const F=this.sc[this.fr]||(this.sc[this.fr]=[]);F.push(down);
   const tot=F.reduce((a,b)=>a+b,0);let nextFrame=false;if(this.roll===0&&down===10){nextFrame=true;this.msg='ストライク！';}else if(this.roll===1){nextFrame=true;this.msg=tot===10?'スペア！':`${tot}本`;}else this.msg=`${down}本`;
   this.api.setScore(this.total());this.ph='msg';this.t=1.2;this.nf=nextFrame;},
 total(){let s=0;for(const F of this.sc){const t=F.reduce((a,b)=>a+b,0);s+=t;if(F[0]===10)s+=10;else if(F.length===2&&t===10)s+=5;}return s;},
 draw(c){bg(c,360,560,'#2b2d42');c.fillStyle='#e9c46a';c.fillRect(100,0,160,560);c.fillStyle='#6c757d';c.fillRect(84,0,16,560);c.fillRect(260,0,16,560);
   for(let k=0;k<7;k++){c.fillStyle='rgba(0,0,0,.08)';c.fillRect(100+k*23,0,2,560);}c.fillStyle=UI.red;for(let k=0;k<5;k++){c.beginPath();c.moveTo(130+k*25,380);c.lineTo(136+k*25,368);c.lineTo(142+k*25,380);c.fill();}
   for(const p of this.pins)if(!p.gone){c.save();c.translate(p.x,p.y);if(p.down)c.rotate(Math.atan2(p.vy,p.vx)+1.2);circle(c,0,0,7,'#fff','#bbb',1.5);c.fillStyle=UI.red;c.fillRect(-6,-1.5,12,3);c.restore();}
   if(this.ph==='pos'||this.ph==='angle'){circle(c,this.bx,500,12,'#3d6fd6');if(this.ph==='angle'){c.setLineDash([5,5]);line(c,this.bx,500,this.bx+Math.sin(this.ang)*200,500-Math.cos(this.ang)*200,'rgba(255,255,255,.8)',2);c.setLineDash([]);}}
   if(this.ball)circle(c,this.ball.x,this.ball.y,12,'#3d6fd6','#1d3c8c',2);
   T(c,`フレーム ${Math.min(this.fr+1,5)} / 5　${this.roll+1}投目`,12,20,13,'#fff','left');T(c,`${this.total()}点`,348,20,15,'#fff','right');
   this.sc.forEach((F,i)=>{T(c,F.map((v,k)=>k===0&&v===10?'X':k===1&&F[0]+v===10?'/':String(v)).join(' '),40+i*70,544,13,'#fff');});
   if(this.ph==='msg')T(c,this.msg,180,260,28,'#fff','center',5);else if(this.ph==='pos')T(c,'タップで位置を決める',180,440,14,'#2b2d42');else if(this.ph==='angle')T(c,'タップで角度を決めて投げる',180,440,14,'#2b2d42');}},

/* ---------- アーチェリー ---------- */
{id:'archery',name:'アーチェリー',emoji:'🏹',tag:'スポーツ',color:['#ffe5d9','#9d0208'],
 desc:'風を読んで弓を引き、的の中心をねらおう。10本の合計点で勝負。',
 help:'画面をドラッグして弓を引き（後ろに引くほど強い）、はなして射る',
 w:640,h:360,
 reset(api){this.api=api;this.n=0;this.arrows=[];this.next();},
 next(){this.tx=rnd(470,600);this.ty=rnd(130,270);this.wind=rnd(-60,60);this.ar=null;this.aim=null;this.ph='aim';},
 pointer(t,x,y){if(this.ph!=='aim')return;if(t==='down')this.aim={x,y,cx:x,cy:y};else if(t==='move'&&this.aim){this.aim.cx=x;this.aim.cy=y;}
   else if(t==='up'&&this.aim){const dx=this.aim.x-this.aim.cx,dy=this.aim.y-this.aim.cy,L=Math.min(150,Math.hypot(dx,dy));this.aim=null;if(L<15||dx<=0)return;
     const k=L*4.4/Math.hypot(dx,dy);this.ar={x:70,y:250,vx:dx*k,vy:dy*k};this.ph='fly';}},
 update(dt){if(this.ph==='fly'){const a=this.ar;for(let s=0;s<3;s++){const h=dt/3,px=a.x,py=a.y;a.vy+=320*h;a.vx+=this.wind*h*.4;a.vy+=this.wind*0*h;a.x+=a.vx*h;a.y+=a.vy*h;
       if(px<this.tx&&a.x>=this.tx){const yy=py+(a.y-py)*((this.tx-px)/(a.x-px)),off=Math.abs(yy-this.ty);const pts=off<50?Math.max(1,10-Math.floor(off/5)):0;
         this.hit={pts,y:yy};this.api.addScore(pts);this.arrows.push(pts);a.x=this.tx;a.y=yy;this.ph='res';this.t=1.2;return;}
       if(a.y>360||a.x>660){this.hit={pts:0};this.arrows.push(0);this.ph='res';this.t=1;return;}}}
   if(this.ph==='res'){this.t-=dt;if(this.t<=0){this.n++;if(this.n>=10)return this.api.win(`合計 ${score}点（10本）`);this.next();}}},
 draw(c){const g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,'#cde7ff');g.addColorStop(1,'#eaf6e3');c.fillStyle=g;c.fillRect(0,0,640,360);c.fillStyle='#b7d7a8';c.fillRect(0,300,640,60);
   const tx=this.tx,ty=this.ty;box(c,tx-4,ty-52,10,104,3,'#8d6e63');line(c,tx+2,ty+52,tx+2,310,'#8d6e63',4);
   const RC=['#fff','#fff','#222','#222','#3d6fd6','#3d6fd6','#e5484d','#e5484d','#ffd60a','#ffd60a'];for(let k=0;k<10;k++){c.fillStyle=RC[k];c.fillRect(tx-6,ty-50+k*5,8,100-k*10);}
   line(c,60,220,60,280,'#6d4c41',4);c.beginPath();c.arc(40,250,36,-1.1,1.1);c.strokeStyle='#6d4c41';c.lineWidth=4;c.stroke();
   if(this.aim){const dx=this.aim.x-this.aim.cx,dy=this.aim.y-this.aim.cy,L=Math.min(150,Math.hypot(dx,dy));if(L>4&&dx>0){const ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy);c.setLineDash([4,6]);line(c,70,250,70+ux*L*1.2,250+uy*L*1.2,'rgba(0,0,0,.4)',2);c.setLineDash([]);box(c,20,330,100,10,5,'#ddd');box(c,20,330,100*L/150,10,5,UI.orange);}}
   if(this.ar){const a=this.ar,an=Math.atan2(a.vy,a.vx);c.save();c.translate(a.x,a.y);c.rotate(this.ph==='fly'?an:0);line(c,-30,0,0,0,'#5d4037',3);c.fillStyle='#555';c.beginPath();c.moveTo(4,0);c.lineTo(-4,-4);c.lineTo(-4,4);c.fill();c.fillStyle=UI.red;c.fillRect(-30,-4,6,8);c.restore();}
   T(c,`${Math.min(this.n+1,10)} / 10 本`,12,20,14,UI.ink,'left');T(c,`${score}点`,628,20,16,UI.ink,'right');
   const w=this.wind;T(c,`風 ${w>0?'→':'←'} ${Math.abs(Math.round(w/10))}`,320,20,15,Math.abs(w)>40?UI.red:UI.ink);
   if(this.ph==='res')T(c,this.hit.pts?`${this.hit.pts}点！`:'はずれ…',320,80,26,this.hit.pts>=9?UI.orange:UI.ink,'center',4);}},

/* ---------- ダーツ ---------- */
{id:'darts',name:'ダーツ',emoji:'🎯',tag:'スポーツ',color:['#f8ad9d','#2a9d8f'],
 desc:'ゆれる照準をよく見て、タイミングよくダーツを投げよう。9本の合計点で勝負。',
 help:'クリック / タップ / スペースで照準の位置に投げる',
 w:800,h:450,
 NUM:[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5],
 reset(api){this.api=api;this.n=0;this.t=rnd(0,10);this.darts=[];this.last=null;this.lt=0;},
 aim(){const t=this.t;return{x:400+Math.sin(t*1.3)*95+Math.sin(t*3.7)*25,y:225+Math.sin(t*1.7+1)*95+Math.cos(t*2.9)*20};},
 pts(x,y){const dx=x-400,dy=y-225,r=Math.hypot(dx,dy);if(r<8)return 50;if(r<18)return 25;if(r>150)return 0;
   let a=Math.atan2(dy,dx)+Math.PI/2+Math.PI/20;a=((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2);const n=this.NUM[Math.floor(a/(Math.PI/10))];return r>=90&&r<100?n*3:r>=140?n*2:n;},
 throw_(){if(this.n>=9||this.lt>0)return;const a=this.aim(),x=a.x+rnd(-6,6),y=a.y+rnd(-6,6),p=this.pts(x,y);this.darts.push({x,y});this.last=p;this.lt=.8;this.n++;this.api.addScore(p);},
 key(c,d,rep){if(d&&!rep&&c==='Space')this.throw_();},
 pointer(t){if(t==='down')this.throw_();},
 update(dt){this.t+=dt*(1+this.n*.08);if(this.lt>0){this.lt-=dt;if(this.lt<=0&&this.n>=9)return this.api.win(`合計 ${score}点`);}},
 draw(c){bg(c,800,450,'#264653');const R=150;
   for(let i=0;i<20;i++){const a0=-Math.PI/2-Math.PI/20+i*Math.PI/10,a1=a0+Math.PI/10;for(const[r0,r1,col]of[[18,90,i%2?'#f1faee':'#1d1d1d'],[90,100,i%2?UI.green:UI.red],[100,140,i%2?'#f1faee':'#1d1d1d'],[140,150,i%2?UI.green:UI.red]]){c.beginPath();c.arc(400,225,r1,a0,a1);c.arc(400,225,r0,a1,a0,true);c.closePath();c.fillStyle=col;c.fill();}
     T(c,String(this.NUM[i]),400+Math.cos(a0+Math.PI/20)*168,225+Math.sin(a0+Math.PI/20)*168,14,'#fff');}
   circle(c,400,225,18,UI.green);circle(c,400,225,8,UI.red);
   for(const d of this.darts){circle(c,d.x,d.y,4,'#ffd60a','#333',1.5);}
   if(this.n<9){const a=this.aim();circle(c,a.x,a.y,14,null,'#ffd60a',2);line(c,a.x-20,a.y,a.x+20,a.y,'#ffd60a',2);line(c,a.x,a.y-20,a.x,a.y+20,'#ffd60a',2);}
   T(c,`${this.n} / 9 本`,12,22,14,'#fff','left');T(c,`${score}点`,788,22,18,'#fff','right');if(this.lt>0&&this.last!=null)T(c,this.last?`+${this.last}`:'アウト',400,428,26,'#ffd60a','center',4);}},

/* ---------- バッティングセンター ---------- */
{id:'batting',name:'バッティングセンター',emoji:'⚾',tag:'スポーツ',color:['#ade8f4','#023e8a'],
 desc:'ボールがきたらタイミングよくスイング！ 芯でとらえればホームラン。20球勝負。',
 help:'スペース / クリック / タップでスイング',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 reset(api){this.api=api;this.n=0;this.hr=0;this.pitch();this.fx=null;},
 pitch(){this.ph='wait';this.t=rnd(.8,1.6);this.ball=null;this.sw=0;this.res=null;},
 swing(){if(this.sw>0||this.ph==='res')return;this.sw=.2;if(this.ph!=='fly')return;const b=this.ball,q=1-Math.abs(b.y-488)/34;
   if(q>0&&Math.abs(b.x-180)<46){const dist_=Math.round(20+q*q*115+rnd(-8,8));this.res={hit:true,d:dist_,hr:dist_>=100};this.api.addScore(dist_);if(dist_>=100)this.hr++;this.ph='res';this.t=1.5;this.fly={x:b.x,y:b.y,vx:(b.x-180)*4+rnd(-80,80),vy:-300-q*500};}},
 key(c,d,rep){if(d&&!rep&&c==='Space')this.swing();},
 pointer(t){if(t==='down')this.swing();},
 update(dt){this.sw=Math.max(0,this.sw-dt);
   if(this.ph==='wait'){this.t-=dt;if(this.t<=0){const sp=rnd(.55,.95)-Math.min(.2,this.n*.01);this.ball={x:180,y:150,dur:sp,p:0,curve:rnd(-40,40)};this.ph='fly';}}
   else if(this.ph==='fly'){const b=this.ball;b.p+=dt/b.dur;b.y=150+b.p*370;b.x=180+Math.sin(b.p*Math.PI*.5)*b.curve;if(b.p>=1.08){this.res={hit:false};this.ph='res';this.t=1;}}
   else if(this.ph==='res'){this.t-=dt;if(this.fly){this.fly.x+=this.fly.vx*dt;this.fly.y+=this.fly.vy*dt;this.fly.vy+=300*dt;}if(this.t<=0){this.fly=null;this.n++;if(this.n>=20)return this.api.win(`ホームラン ${this.hr}本！`);this.pitch();}}},
 draw(c){const g=c.createLinearGradient(0,0,0,560);g.addColorStop(0,'#1d3557');g.addColorStop(.4,'#457b9d');g.addColorStop(.41,'#2d6a4f');g.addColorStop(1,'#52b788');c.fillStyle=g;c.fillRect(0,0,360,560);
   c.fillStyle='#d4a373';c.beginPath();c.moveTo(160,150);c.lineTo(200,150);c.lineTo(290,560);c.lineTo(70,560);c.fill();
   T(c,'100m',180,40,12,'rgba(255,255,255,.6)');line(c,20,52,340,52,'rgba(255,255,255,.4)',2);
   circle(c,180,135,14,'#e5484d');box(c,170,140,20,26,6,'#e5484d');
   c.fillStyle='#fff';c.beginPath();c.moveTo(160,500);c.lineTo(200,500);c.lineTo(200,510);c.lineTo(180,520);c.lineTo(160,510);c.fill();
   if(this.ball&&this.ph==='fly'){const b=this.ball,s=.5+b.p*.7;circle(c,b.x,b.y,8*s,'#fff','#c00',1);}
   if(this.fly)circle(c,this.fly.x,this.fly.y,7,'#fff');
   const sw=this.sw>0?1-this.sw/.2:0,ang=-2.2+sw*3.2;c.save();c.translate(230,500);c.rotate(ang);box(c,-4,-6,90,12,6,'#c68b59');c.restore();
   T(c,`${Math.min(this.n+1,20)} / 20 球`,12,22,14,'#fff','left');T(c,`HR ${this.hr}本　${score}m`,348,22,14,'#fff','right');
   if(this.ph==='res')T(c,this.res.hit?(this.res.hr?`ホームラン！ ${this.res.d}m`:`ヒット ${this.res.d}m`):'空ぶり…',180,300,26,this.res.hr?'#ffd60a':'#fff','center',5);}},

/* ---------- ぽよバレー ---------- */
{id:'volley',name:'ぽよバレー',emoji:'🏐',tag:'スポーツ',color:['#ffd6a5','#4cc9f0'],
 desc:'ぷにぷにのキャラでボールを打ち返す1対1バレー。相手のコートに落とせば得点、先に7点！',
 help:'←→ で移動、↑ / スペースでジャンプ',
 w:568,h:320,
 pad:[['←','ArrowLeft'],['ジャンプ','ArrowUp'],['→','ArrowRight']],
 reset(api){this.api=api;this.ps=0;this.cs=0;this.K={};this.serve(0);},
 serve(side){this.p={x:130,y:300,vy:0};this.c={x:438,y:300,vy:0};this.b={x:side===0?130:438,y:120,vx:0,vy:0};this.wait=.8;},
 key(c,d){this.K[c]=d;},
 bump(s,b){const dx=b.x-s.x,dy=b.y-s.y,d=Math.hypot(dx,dy);if(d<46&&dy<8&&d>0){const nx=dx/d,ny=dy/d;b.x=s.x+nx*46;b.y=s.y+ny*46;const vn=b.vx*nx+b.vy*ny-(s.vy||0)*ny;if(vn<0){b.vx-=2*vn*nx;b.vy-=2*vn*ny;}b.vx+=nx*60;b.vy=Math.min(b.vy,-260);const sp=Math.hypot(b.vx,b.vy);if(sp>650){b.vx*=650/sp;b.vy*=650/sp;}}},
 move(s,dir,jump,lo,hi,dt){s.x=clamp(s.x+dir*270*dt,lo,hi);if(jump&&s.y>=300)s.vy=-430;s.vy+=1100*dt;s.y+=s.vy*dt;if(s.y>300){s.y=300;s.vy=0;}},
 update(dt){const K=this.K,p=this.p,c=this.c,b=this.b;
   this.move(p,(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0),K.ArrowUp||K.KeyW||K.Space,40,244,dt);
   let tx=b.x+(b.vx>0?20:0)+12;if(b.x<284)tx=438;const dir=Math.abs(tx-c.x)>8?Math.sign(tx-c.x):0;this.move(c,dir*.9,b.x>284&&Math.abs(b.x-c.x)<60&&b.y>140&&b.y<250&&b.vy>0,324,528,dt);
   if(this.wait>0){this.wait-=dt;return;}
   for(let s=0;s<3;s++){const h=dt/3;b.vy+=520*h;b.x+=b.vx*h;b.y+=b.vy*h;
     if(b.x<10){b.x=10;b.vx=Math.abs(b.vx);}if(b.x>558){b.x=558;b.vx=-Math.abs(b.vx);}if(b.y<10){b.y=10;b.vy=Math.abs(b.vy);}
     if(b.y>220&&Math.abs(b.x-284)<14){if(b.y<228&&b.vy>0){b.vy=-Math.abs(b.vy)*.7;b.y=220;}else{b.vx=(b.x<284?-1:1)*Math.abs(b.vx)*.8;b.x=284+(b.x<284?-14:14);}}
     this.bump(p,b);this.bump(c,b);
     if(b.y>300){if(b.x<284){this.cs++;if(this.cs>=7)return this.api.over(`負け… ${this.ps} 対 ${this.cs}`);this.serve(1);}else{this.ps++;this.api.setScore(this.ps);if(this.ps>=7)return this.api.win(`勝利！ ${this.ps} 対 ${this.cs}`);this.serve(0);}return;}}},
 draw(c){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,'#caf0f8');g.addColorStop(1,'#fefae0');c.fillStyle=g;c.fillRect(0,0,568,320);c.fillStyle='#e9c46a';c.fillRect(0,300,568,20);
   box(c,280,220,8,80,2,'#6c757d');
   for(const[s,col]of[[this.p,UI.blue],[this.c,UI.red]]){c.fillStyle=col;c.beginPath();c.arc(s.x,s.y,36,Math.PI,0);c.fill();const ex=s===this.p?12:-12;circle(c,s.x+ex,s.y-20,7,'#fff');circle(c,s.x+ex+(this.b.x>s.x?2:-2),s.y-20+(this.b.y<s.y?-2:1),3,'#222');}
   circle(c,this.b.x,this.b.y,10,'#fff','#f77f00',2.5);
   T(c,`${this.ps}`,142,30,30,UI.blue);T(c,`${this.cs}`,426,30,30,UI.red);}},

/* ---------- おしだし相撲 ---------- */
{id:'sumo',name:'おしだし相撲',emoji:'🤼',tag:'スポーツ',color:['#ffe8d6','#bc6c25'],
 desc:'土俵の上で押し合い勝負！ 相手を円の外に押し出せば勝ち。先に3勝した方が優勝。',
 help:'マウス / 指を押している方向へ進む（矢印キーでもOK）。スペース / 2本指タップで突進',
 w:400,h:420,
 reset(api){this.api=api;this.pw=0;this.cw=0;this.K={};this.bout();},
 bout(){this.a={x:140,y:220,vx:0,vy:0,r:28,dash:0};this.b={x:260,y:220,vx:0,vy:0,r:30,dash:0};this.wait=1;this.res=0;this.tx=null;},
 key(c,d){this.K[c]=d;if(d&&c==='Space')this.dash(this.a);},
 dash(o){if(o.dash>0)return;o.dash=1.4;const sp=Math.hypot(o.vx,o.vy)||1;o.vx+=o.vx/sp*260;o.vy+=o.vy/sp*260;},
 pointer(t,x,y,e){if(t==='down'||t==='move')this.tx=t==='move'&&!this.pdown?this.tx:[x,y];if(t==='down'){this.pdown=true;const now=performance.now();if(this.lastTap&&now-this.lastTap<280)this.dash(this.a);this.lastTap=now;}if(t==='up'){this.pdown=false;this.tx=null;}},
 acc(o,dx,dy,f,dt){const L=Math.hypot(dx,dy);if(L>1){o.vx+=dx/L*f*dt;o.vy+=dy/L*f*dt;}},
 update(dt){const a=this.a,b=this.b,K=this.K;if(this.wait>0){this.wait-=dt;return;}
   if(this.res){this.t-=dt;if(this.t<=0){if(this.pw>=3)return this.api.win(`優勝！ ${this.pw} 対 ${this.cw}`);if(this.cw>=3)return this.api.over(`負け… ${this.pw} 対 ${this.cw}`);this.bout();}return;}
   let dx=(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0),dy=(K.ArrowDown||K.KeyS?1:0)-(K.ArrowUp||K.KeyW?1:0);if(!dx&&!dy&&this.tx){dx=this.tx[0]-a.x;dy=this.tx[1]-a.y;}this.acc(a,dx,dy,520,dt);
   const ex=200+(b.x-200)*.2-a.x,ey=210+(b.y-210)*.2-a.y;const tgx=a.x-(200-a.x)*.25-b.x,tgy=a.y-(210-a.y)*.25-b.y;const danger=dist(b.x,b.y,200,210)>110;
   this.acc(b,danger?200-b.x+tgx*.3:tgx,danger?210-b.y+tgy*.3:tgy,470+this.pw*25,dt);if(b.dash<=0&&dist(a.x,a.y,b.x,b.y)<90&&Math.random()<dt*.8)this.dash(b);
   for(const o of[a,b]){o.dash=Math.max(0,o.dash-dt);const f=Math.pow(.2,dt);o.vx*=f;o.vy*=f;o.x+=o.vx*dt;o.y+=o.vy*dt;}
   const ddx=b.x-a.x,ddy=b.y-a.y,d=Math.hypot(ddx,ddy),R=a.r+b.r;if(d<R&&d>0){const nx=ddx/d,ny=ddy/d,ov=R-d;a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;
     const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const j=-1.3*rv/2;a.vx-=j*nx;a.vy-=j*ny;b.vx+=j*nx;b.vy+=j*ny;}}
   const outA=dist(a.x,a.y,200,210)>160,outB=dist(b.x,b.y,200,210)>160;
   if(outA||outB){if(outB&&!outA){this.pw++;this.api.setScore(this.pw);this.msg='押し出し！ あなたの勝ち';}else{this.cw++;this.msg='押し出され… CPUの勝ち';}this.res=1;this.t=1.5;}},
 draw(c){bg(c,400,420,'#f6e7cb');circle(c,200,210,180,'#d4a373');circle(c,200,210,160,'#e9c89b','#fff',5);line(c,180,200,180,220,'#fff',4);line(c,220,200,220,220,'#fff',4);
   for(const[o,col,lab]of[[this.a,UI.blue,'あ'],[this.b,UI.red,'C']]){circle(c,o.x,o.y+4,o.r,'rgba(0,0,0,.15)');circle(c,o.x,o.y,o.r,col,o.dash>1.1?'#ffd60a':'#fff',3);T(c,lab,o.x,o.y+1,18,'#fff');}
   T(c,`あなた ${this.pw}勝`,14,22,16,UI.blue,'left');T(c,`CPU ${this.cw}勝`,386,22,16,UI.red,'right');
   if(this.wait>0)T(c,'はっけよい…',200,400,18,UI.ink);if(this.res)T(c,this.msg,200,400,18,UI.ink);
   T(c,this.a.dash>0?'突進 充電中':'突進OK（スペース / ダブルタップ）',200,40,12,UI.sub);}}
);
