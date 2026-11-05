'use strict';
/* パック9：タイミング・カジュアル 10本 */
addGames(

/* ---------- ナイフ投げ ---------- */
{id:'knife',name:'ナイフ投げ',emoji:'🔪',tag:'カジュアル',color:['#e9c46a','#6d4c41'],
 desc:'回る丸太にナイフを投げて刺そう。刺さっているナイフに当てたらアウト！ ステージごとに回転が変わる。',
 help:'スペース / クリック / タップでナイフを投げる',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,CX:180,CY:190,R:70,
 reset(api){this.api=api;this.st=0;this.load();},
 load(){this.ang=0;this.k=[];this.left=6+Math.min(4,this.st);this.fly=null;this.t=0;this.clearT=0;this.apples=[];const n=this.st%2?1:ri(0,2);for(let i=0;i<n;i++)this.apples.push(rnd(0,Math.PI*2));
   const pre=Math.min(3,Math.floor(this.st/2));for(let i=0;i<pre;i++)this.k.push(rnd(0,Math.PI*2));},
 spd(){const s=this.st,t=this.t;if(s%3===0)return 2+s*.15;if(s%3===1)return Math.sin(t*1.3)*3.2;return(Math.floor(t/1.5)%2?-1:1)*(2.6+s*.1);},
 throw_(){if(this.fly||this.clearT||this.left<=0)return;this.fly={y:500};},
 key(c,d,rep){if(d&&!rep&&c==='Space')this.throw_();},
 pointer(t){if(t==='down')this.throw_();},
 update(dt){this.t+=dt;this.ang+=this.spd()*dt;
   if(this.clearT){this.clearT-=dt;if(this.clearT<=0){this.st++;this.load();}return;}
   if(this.fly){this.fly.y-=1600*dt;if(this.fly.y<=this.CY+this.R){const hitA=(Math.PI/2-this.ang)%(Math.PI*2);
       if(this.k.some(a=>{const d=Math.abs((((hitA-a)%(Math.PI*2))+Math.PI*3)%(Math.PI*2)-Math.PI);return d<.2;}))return this.api.over(`ステージ ${this.st+1} でナイフが当たった`);
       this.k.push(hitA);this.left--;this.api.addScore(1);
       this.apples=this.apples.filter(a=>{const d=Math.abs((((hitA-a)%(Math.PI*2))+Math.PI*3)%(Math.PI*2)-Math.PI);if(d<.3){this.api.addScore(5);return false;}return true;});
       this.fly=null;if(this.left<=0){this.clearT=1;this.api.addScore(10);}}}},
 knife(c,x,y,rot){c.save();c.translate(x,y);c.rotate(rot);box(c,-4,0,8,40,2,'#dee2e6');c.fillStyle='#adb5bd';c.beginPath();c.moveTo(-4,0);c.lineTo(0,-10);c.lineTo(4,0);c.fill();box(c,-5,40,10,26,3,'#6d4c41');c.restore();},
 draw(c){bg(c,360,560,'#2b2d42');const{CX,CY,R}=this;
   for(const a of this.k){const A=a+this.ang;this.knife(c,CX+Math.cos(A)*(R-4),CY+Math.sin(A)*(R-4),A-Math.PI/2);}
   for(const a of this.apples){const A=a+this.ang;T(c,'🍎',CX+Math.cos(A)*(R+12),CY+Math.sin(A)*(R+12),22,UI.ink);}
   c.save();c.translate(CX,CY);c.rotate(this.ang);circle(c,0,0,R,'#b08968','#7f5539',6);for(let r=20;r<R;r+=16)circle(c,0,0,r,null,'rgba(127,85,57,.4)',2);c.restore();
   if(this.fly)this.knife(c,CX,this.fly.y,0);else if(!this.clearT&&this.left>0)this.knife(c,CX,480,0);
   for(let i=0;i<this.left;i++)box(c,20,530-i*18,8,14,2,'#dee2e6');
   T(c,`ステージ ${this.st+1}`,180,30,16,'#fff');T(c,String(score),330,30,20,'#ffd166','right');if(this.clearT)T(c,'ステージクリア！',180,330,24,'#ffd166');}},

/* ---------- のびる棒 ---------- */
{id:'stick',name:'のびる棒',emoji:'🪵',tag:'カジュアル',color:['#ffcdb2','#e5989b'],
 desc:'押している間だけ棒がのびる。ちょうどいい長さで次の足場に橋をかけよう。真ん中ならボーナス！',
 help:'スペース / クリック / タップを押している間、棒がのびる。はなすと倒れる',
 w:800,h:450,TOP:300,
 reset(api){this.api=api;this.cam=0;this.pl=[{x:0,w:90}];this.addPl();this.addPl();this.addPl();this.hx=70;this.st='idle';this.len=0;this.rot=0;this.fx=null;},
 addPl(){const last=this.pl[this.pl.length-1],gap=rnd(50,170),w=rnd(28,80);this.pl.push({x:last.x+last.w+gap,w});},
 down(){if(this.st==='idle'){this.st='grow';this.len=0;}},
 up(){if(this.st==='grow'){this.st='fall';this.rot=0;}},
 key(c,d,rep){if(c==='Space'&&!rep)d?this.down():this.up();},
 pointer(t){if(t==='down')this.down();if(t==='up')this.up();},
 update(dt){const cur=this.pl[0],nx=this.pl[1],base=cur.x+cur.w;
   if(this.st==='grow'){this.len=Math.min(420,this.len+330*dt);}
   else if(this.st==='fall'){this.rot=Math.min(Math.PI/2,this.rot+5*dt);if(this.rot>=Math.PI/2){const tip=base+this.len;this.ok=tip>=nx.x&&tip<=nx.x+nx.w;this.target=this.ok?nx.x+nx.w-20:tip+10;this.st='walk';
       if(this.ok){const mid=nx.x+nx.w/2;if(Math.abs(tip-mid)<5){this.api.addScore(2);this.fx={t:1,s:'PERFECT +2'};}else this.api.addScore(1);}}}
   else if(this.st==='walk'){this.hx=Math.min(this.target,this.hx+260*dt);if(this.hx>=this.target){if(!this.ok){this.st='dead';this.fallY=0;}else{this.st='shift';}}}
   else if(this.st==='shift'){const want=nx.x-30;this.cam+=(want-this.cam)*Math.min(1,dt*8);if(Math.abs(want-this.cam)<1){this.cam=want;this.pl.shift();this.addPl();this.st='idle';this.len=0;this.rot=0;}}
   else if(this.st==='dead'){this.fallY+=500*dt;if(this.fallY>200)return this.api.over(`${score}本わたった`);}
   if(this.fx){this.fx.t-=dt;if(this.fx.t<=0)this.fx=null;}},
 draw(c){const g=c.createLinearGradient(0,0,0,450);g.addColorStop(0,'#ffe5ec');g.addColorStop(1,'#ffc2d1');c.fillStyle=g;c.fillRect(0,0,800,450);
   c.save();c.translate(-this.cam,0);const TOP=this.TOP;
   for(const p of this.pl){c.fillStyle='#2b2d42';c.fillRect(p.x,TOP,p.w,200);circle(c,p.x+p.w/2,TOP+3,3,UI.red);}
   const cur=this.pl[0],base=cur.x+cur.w;c.save();c.translate(base,TOP);c.rotate(this.st==='grow'||this.st==='idle'?0:this.rot);c.fillStyle='#6d4c41';c.fillRect(-2,-this.len,4,this.len);c.restore();
   const hy=TOP-20+(this.st==='dead'?this.fallY:0);box(c,this.hx-10,hy-6,20,26,6,'#3d405b');box(c,this.hx-12,hy-8,24,6,2,UI.red);circle(c,this.hx+4,hy+2,2.5,'#fff');
   c.restore();T(c,String(score),400,70,40,'#fff','center',5);if(this.fx)T(c,this.fx.s,400,120,20,UI.purple);
   if(this.st==='idle'&&score===0)T(c,'押してる間、棒がのびる',400,190,16,UI.sub);}},

/* ---------- ジグザグ ---------- */
{id:'zigzag',name:'ジグザグ',emoji:'↗️',tag:'カジュアル',color:['#bde0fe','#ff6f91'],
 desc:'ボールは自動で進む。タップで向きを左右に切りかえて、ジグザグの道から落ちないように！',
 help:'スペース / クリック / タップで進む向きを切りかえ',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,W:46,
 reset(api){this.api=api;this.pts=[[180,520],[180,470]];this.dir=-1;for(let i=0;i<30;i++)this.addSeg();this.b={x:180,y:480};this.d=0;this.cam=0;this.seg=0;this.fall=0;this.gems=[];this.genGems();this.sp=150;},
 addSeg(){const[x,y]=this.pts[this.pts.length-1];const prevDir=this.pts.length%2?1:-1;let len=rnd(40,150);let nx=x+prevDir*len*.7;if(nx<60||nx>300){len=Math.min(len,Math.abs((prevDir>0?300:60)-x)/.7);nx=x+prevDir*len*.7;}this.pts.push([nx,y-len*.7]);},
 genGems(){for(let i=this.gems.length?this.pts.length-6:2;i<this.pts.length-1;i++)if(Math.random()<.3){const[a,b]=[this.pts[i],this.pts[i+1]],t=rnd(.3,.7);this.gems.push({x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t});}},
 tap(){if(!this.fall)this.dir*=-1;},
 key(c,d,rep){if(d&&!rep&&c==='Space')this.tap();},
 pointer(t){if(t==='down')this.tap();},
 onPath(x,y){for(let i=0;i<this.pts.length-1;i++){const[a,b]=[this.pts[i],this.pts[i+1]],dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy,t=clamp(((x-a[0])*dx+(y-a[1])*dy)/L2,0,1);if(dist(x,y,a[0]+dx*t,a[1]+dy*t)<this.W/2)return true;}return false;},
 update(dt){if(this.fall){this.fall+=dt;if(this.fall>.8)return this.api.over(`${score}点`);return;}
   this.sp=Math.min(300,this.sp+4*dt);const v=this.sp*dt;this.b.x+=this.dir*v*.7;this.b.y-=v*.7;this.d+=v;
   if(!this.onPath(this.b.x,this.b.y)){this.fall=.01;return;}
   this.api.setScore(Math.floor(this.d/30)+(this.gemN||0)*5);
   for(const g of this.gems)if(!g.got&&dist(g.x,g.y,this.b.x,this.b.y)<16){g.got=true;this.gemN=(this.gemN||0)+1;}
   if(this.b.y-this.cam<300)this.cam=this.b.y-300;
   while(this.pts[1][1]>this.cam+700){this.pts.shift();}
   while(this.pts[this.pts.length-1][1]>this.cam-200){this.addSeg();if(Math.random()<.4)this.genGems();}
   this.gems=this.gems.filter(g=>g.y<this.cam+700);},
 draw(c){bg(c,360,560,'#e0f2fe');c.save();c.translate(0,-this.cam);c.lineCap='square';c.lineJoin='miter';
   c.beginPath();this.pts.forEach(([x,y],i)=>i?c.lineTo(x,y+8):c.moveTo(x,y+8));c.strokeStyle='#9b5de5';c.lineWidth=this.W;c.stroke();
   c.beginPath();this.pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle='#c8b6ff';c.lineWidth=this.W;c.stroke();c.lineCap='butt';
   for(const g of this.gems)if(!g.got){c.fillStyle='#ff6f91';c.beginPath();c.moveTo(g.x,g.y-8);c.lineTo(g.x+7,g.y);c.lineTo(g.x,g.y+8);c.lineTo(g.x-7,g.y);c.fill();}
   const s=this.fall?Math.max(.2,1-this.fall):1;circle(c,this.b.x,this.b.y+(this.fall?this.fall*80:0),10*s,'#ff6f91','#fff',2);c.restore();
   T(c,String(score),180,40,30,'#7b2cbf','center');}},

/* ---------- フルーツスライス ---------- */
{id:'slice',name:'フルーツスライス',emoji:'🍉',tag:'カジュアル',color:['#b7efc5','#e63946'],
 desc:'飛び上がるフルーツを指でスパッと切ろう！ 爆弾を切ったら終わり。フルーツを3つ落としてもアウト。',
 help:'ドラッグ（スワイプ）でフルーツを切る',
 w:800,h:450,
 F:['🍉','🍊','🍎','🍍','🥝','🍑','🍋'],
 reset(api){this.api=api;this.o=[];this.spT=.5;this.miss=0;this.trail=[];this.down=false;this.halves=[];this.t=0;this.combo=0;this.fx=[];},
 pointer(t,x,y){if(t==='down'){this.down=true;this.trail=[{x,y,t:0}];}else if(t==='move'&&this.down){this.trail.push({x,y,t:0});this.cut(x,y);}else if(t==='up')this.down=false;},
 cut(x,y){const tr=this.trail;if(tr.length<2)return;const a=tr[tr.length-2];let n=0;
   for(const o of this.o){if(o.cut)continue;const dx=x-a.x,dy=y-a.y,L2=dx*dx+dy*dy||1,t=clamp(((o.x-a.x)*dx+(o.y-a.y)*dy)/L2,0,1);if(dist(o.x,o.y,a.x+dx*t,a.y+dy*t)<28){o.cut=true;
     if(o.bomb)return this.api.over('爆弾を切った！');n++;this.halves.push({e:o.e,x:o.x-8,y:o.y,vx:o.vx-80,vy:o.vy,r:0},{e:o.e,x:o.x+8,y:o.y,vx:o.vx+80,vy:o.vy,r:0});}}
   if(n){this.api.addScore(n*(n>1?2:1));if(n>1)this.fx.push({x,y,t:.8,s:`${n}コンボ！`});}},
 update(dt){this.t+=dt;this.spT-=dt;if(this.spT<=0){this.spT=Math.max(.45,1.3-this.t*.01);const n=ri(1,Math.min(4,1+Math.floor(this.t/15)));for(let i=0;i<n;i++){const x=rnd(100,700);this.o.push({x,y:470,vx:(400-x)*rnd(.3,.8),vy:-rnd(560,700),e:this.F[ri(0,6)],bomb:Math.random()<.13+Math.min(.1,this.t*.002),rot:0});}}
   for(const o of this.o){o.vy+=600*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.rot+=dt*3;if(o.y>490&&!o.cut&&!o.gone){o.gone=true;if(!o.bomb){this.miss++;if(this.miss>=3)return this.api.over('フルーツを3つ落とした');}}}
   this.o=this.o.filter(o=>!o.cut&&!o.gone);for(const h of this.halves){h.vy+=700*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.r+=dt*4;}this.halves=this.halves.filter(h=>h.y<500);
   for(const p of this.trail)p.t+=dt;this.trail=this.trail.filter(p=>p.t<.15);for(const f of this.fx){f.t-=dt;f.y-=40*dt;}this.fx=this.fx.filter(f=>f.t>0);},
 draw(c){bg(c,800,450,'#5c3d2e');c.fillStyle='rgba(255,255,255,.04)';for(let y=0;y<450;y+=40)c.fillRect(0,y,800,2);
   for(const o of this.o)drawEmoji(c,o.bomb?'💣':o.e,o.x,o.y,46,o.rot);
   for(const h of this.halves)drawEmoji(c,h.e,h.x,h.y,40,h.r,.7);
   if(this.trail.length>1){c.beginPath();this.trail.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=5;c.lineCap='round';c.stroke();c.lineCap='butt';}
   for(const f of this.fx){c.globalAlpha=Math.min(1,f.t*2);T(c,f.s,f.x,f.y,20,'#ffd166','center',4);}c.globalAlpha=1;
   T(c,String(score),20,30,26,'#ffd166','left');T(c,'✕'.repeat(this.miss)+'・'.repeat(3-this.miss),780,30,20,UI.red,'right');}},

/* ---------- リズムタップ ---------- */
{id:'rhythm',name:'リズムタップ',emoji:'🎵',tag:'カジュアル',color:['#cdb4db','#ff006e'],
 desc:'4つのレーンを流れてくるノーツが判定ラインに重なった瞬間にタップ！ 60秒でコンボをつなごう。',
 help:'D・F・J・K キー、またはレーンをタップ',
 w:400,h:560,keep:true /* 縦長がちょうどいいゲーム */,LY:470,
 reset(api){this.api=api;this.t=-1.5;this.notes=[];const bpm=120,beat=60/bpm;let t=0;while(t<58){const r=Math.random();if(r<.75){const l=ri(0,3);this.notes.push({t,l});if(Math.random()<.15&&t>8){let l2;do{l2=ri(0,3);}while(l2===l);this.notes.push({t,l:l2});}}t+=beat*(Math.random()<.3&&t>15?.5:1);}
   this.combo=0;this.maxC=0;this.judge=null;this.flash=[0,0,0,0];this.stats={p:0,g:0,m:0};},
 hit(l){this.flash[l]=.12;let best=null,bd=1;for(const n of this.notes){if(n.done||n.l!==l)continue;const d=Math.abs(n.t-this.t);if(d<bd){bd=d;best=n;}}
   if(best&&bd<.16){best.done=true;const p=bd<.06;this.combo++;this.maxC=Math.max(this.maxC,this.combo);this.api.addScore((p?100:50)+Math.min(50,this.combo*2));this.judge={s:p?'PERFECT':'GOOD',t:.4,c:p?'#ffd166':'#4cc9f0'};this.stats[p?'p':'g']++;BEEP.play([523,587,659,784][l],.12);}},
 key(c,d,rep){if(!d||rep)return;const l={KeyD:0,KeyF:1,KeyJ:2,KeyK:3}[c];if(l!=null)this.hit(l);},
 pointer(t,x){if(t==='down')this.hit(clamp(Math.floor((x-40)/80),0,3));},
 update(dt){this.t+=dt;for(let i=0;i<4;i++)this.flash[i]=Math.max(0,this.flash[i]-dt);if(this.judge){this.judge.t-=dt;if(this.judge.t<=0)this.judge=null;}
   for(const n of this.notes)if(!n.done&&this.t-n.t>.16){n.done=true;n.miss=true;this.combo=0;this.stats.m++;this.judge={s:'MISS',t:.4,c:'#ff5e5e'};}
   if(this.t>60)return this.api.win(`最大${this.maxC}コンボ（P${this.stats.p} G${this.stats.g} M${this.stats.m}）`);},
 draw(c){bg(c,400,560,'#10002b');const sp=380;
   for(let l=0;l<4;l++){c.fillStyle=this.flash[l]?'rgba(255,255,255,.15)':(l%2?'rgba(255,255,255,.03)':'rgba(255,255,255,.06)');c.fillRect(40+l*80,0,80,560);}
   line(c,40,this.LY,360,this.LY,'#ff006e',4);
   const cols=['#ff595e','#ffca3a','#8ac926','#1982c4'];
   for(const n of this.notes){if(n.done)continue;const y=this.LY-(n.t-this.t)*sp;if(y<-20||y>580)continue;box(c,46+n.l*80,y-10,68,20,8,cols[n.l]);}
   ['D','F','J','K'].forEach((k,l)=>{circle(c,80+l*80,this.LY+40,22,this.flash[l]?cols[l]:'rgba(255,255,255,.08)','rgba(255,255,255,.3)',2);T(c,k,80+l*80,this.LY+41,16,'#fff');});
   if(this.judge)T(c,this.judge.s,200,380,28,this.judge.c,'center',4);if(this.combo>2)T(c,`${this.combo} COMBO`,200,330,20,'#fff');
   T(c,String(score),390,24,18,'#fff','right');box(c,10,10,180*clamp(this.t/60,0,1),6,3,'#ff006e');if(this.t<0)T(c,'READY…',200,250,28,'#fff');}},

/* ---------- つりゲーム ---------- */
{id:'fishing',name:'つりゲーム',emoji:'🎣',tag:'カジュアル',color:['#90e0ef','#0077b6'],
 desc:'針をおろして魚をかけたら、ゲージの中に魚をとらえ続けて釣り上げよう。90秒でたくさん釣れ！',
 help:'押している間、針が沈む（リール中は押すと緑のバーが上がる）',
 w:400,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 FISH:[['🐟',10,1],['🐠',20,1.4],['🐡',30,1.8],['🦑',40,2.2],['🐙',60,2.6],['🦈',100,3.2]],
 reset(api){this.api=api;this.time=90;this.hook=110;this.hold=false;this.ph='cast';this.fish=[];for(let i=0;i<8;i++)this.fish.push(this.newFish());this.caught=[];this.msg='';this.msgT=0;},
 newFish(){const depth=rnd(170,520),lv=clamp(Math.floor((depth-170)/70+rnd(-.6,.6)),0,5);return{x:rnd(20,380),y:depth,vx:(Math.random()<.5?-1:1)*rnd(25,55),k:lv};},
 key(c,d){if(c==='Space'||c==='ArrowDown'||c==='ArrowUp')this.hold=d;},
 pointer(t){if(t==='down')this.hold=true;if(t==='up')this.hold=false;},
 update(dt){this.time-=dt;this.msgT-=dt;if(this.time<=0){this.time=0;return this.api.over(`タイムアップ！ ${this.caught.length}匹`);}
   for(const f of this.fish){if(f===this.on)continue;f.x+=f.vx*dt;if(f.x<15||f.x>385)f.vx*=-1;}
   if(this.ph==='cast'){this.hook=clamp(this.hook+(this.hold?160:-120)*dt,110,540);
     for(const f of this.fish)if(dist(f.x,f.y,200,this.hook)<26&&Math.random()<dt*3){this.on=f;this.ph='reel';this.zone=.5;this.zv=0;this.fp=.5;this.fv=0;this.prog=.35;break;}}
   else if(this.ph==='reel'){const f=this.on,diff=this.FISH[f.k][2];this.zv+=(this.hold?2.6:-2.2)*dt;this.zv*=Math.pow(.3,dt);this.zone=clamp(this.zone+this.zv*dt*2,0,1);if(this.zone<=0||this.zone>=1)this.zv=0;
     this.fv+=rnd(-1,1)*diff*dt*6;this.fv*=Math.pow(.4,dt);this.fp=clamp(this.fp+this.fv*dt,0,1);if(this.fp<=0||this.fp>=1)this.fv*=-1;
     const zw=.24-f.k*.015,inz=Math.abs(this.fp-this.zone)<zw/2;this.prog=clamp(this.prog+(inz?.32:-.24)/(1+f.k*.15)*dt,0,1);f.x+=(200-f.x)*dt;f.y+=(this.hook-f.y)*dt;
     if(this.prog>=1){const F=this.FISH[f.k];this.api.addScore(F[1]);this.caught.push(F[0]);this.msg=`${F[0]} 釣れた！ +${F[1]}`;this.msgT=1.5;Object.assign(f,this.newFish());this.on=null;this.ph='cast';this.hook=110;}
     else if(this.prog<=0){this.msg='にげられた…';this.msgT=1.2;Object.assign(f,this.newFish());this.on=null;this.ph='cast';}}},
 draw(c){bg(c,400,560,'#caf0f8');const g=c.createLinearGradient(0,110,0,560);g.addColorStop(0,'#48cae4');g.addColorStop(1,'#03045e');c.fillStyle=g;c.fillRect(0,110,400,450);
   box(c,140,84,120,30,10,'#bc6c25');T(c,'🧑',200,70,30,UI.ink);line(c,215,60,200,30,'#6d4c41',3);line(c,200,30,200,this.hook,'rgba(255,255,255,.8)',1);
   c.strokeStyle='#ddd';c.lineWidth=2;c.beginPath();c.arc(196,this.hook,5,0,Math.PI);c.stroke();
   for(const f of this.fish){c.save();c.translate(f.x,f.y);if(f.vx>0&&f!==this.on)c.scale(-1,1);T(c,this.FISH[f.k][0],0,0,26+f.k*3,UI.ink);c.restore();}
   if(this.ph==='reel'){const f=this.on,zw=.24-f.k*.015,X=340,Y0=150,H=320;box(c,X,Y0,26,H,8,'rgba(0,0,0,.35)');
     box(c,X+2,Y0+H*(1-this.zone-zw/2),22,H*zw,6,'rgba(128,237,153,.85)');T(c,this.FISH[f.k][0],X+13,Y0+H*(1-this.fp),20,UI.ink);
     box(c,X-14,Y0,8,H,4,'#333');box(c,X-14,Y0+H*(1-this.prog),8,H*this.prog,4,'#ffd166');T(c,'押して緑をキープ！',200,540,15,'#fff');}
   T(c,`${Math.ceil(this.time)}秒`,388,24,15,UI.ink,'right');T(c,`${score}点`,12,24,16,UI.ink,'left');T(c,this.caught.slice(-8).join(''),200,140,16,UI.ink);
   if(this.msgT>0)T(c,this.msg,200,300,22,'#fff','center',4);}},

/* ---------- 射的 ---------- */
{id:'shootgallery',name:'射的',emoji:'🔫',tag:'シューティング',color:['#ffd6a5','#bc4749'],
 desc:'お祭りの射的！ 流れていく的を撃ち落とそう。弾は6発ずつ、なくなったらリロード。45秒勝負。',
 help:'的をクリック / タップで撃つ。弾切れのときは右下の「リロード」（R キー）',
 w:746,h:420,
 T_:[['🎯',10],['🧸',20],['🥫',15],['⭐',50],['🎁',30]],
 reset(api){this.api=api;this.time=45;this.ammo=6;this.rel=0;this.rows=[0,1,2].map(i=>({y:110+i*90,sp:(i%2?-1:1)*(70+i*30),items:[]}));for(const r of this.rows)for(let x=0;x<800;x+=ri(90,140))r.items.push(this.mk(x));this.fx=[];this.shots=[];},
 mk(x){const k=Math.random()<.08?3:ri(0,4)===3?0:ri(0,4);return{x,k:k===3&&Math.random()<.5?0:k,down:0};},
 shoot(x,y){if(this.rel>0)return;if(this.ammo<=0){this.fx.push({x,y,t:.5,s:'弾切れ！'});return;}this.ammo--;this.shots.push({x,y,t:.25});
   for(const r of this.rows)for(const it of r.items){if(it.down)continue;if(Math.abs(x-it.x)<24&&Math.abs(y-(r.y-10))<28){it.down=.01;const p=this.T_[it.k][1];this.api.addScore(p);this.fx.push({x:it.x,y:r.y-40,t:.8,s:'+'+p});return;}}},
 reload(){if(this.rel<=0&&this.ammo<6)this.rel=1.1;},
 key(c,d){if(d&&c==='KeyR')this.reload();},
 pointer(t,x,y){if(t!=='down')return;if(inR(x,y,636,370,100,40))return this.reload();this.shoot(x,y);},
 update(dt){this.time-=dt;if(this.time<=0){this.time=0;return this.api.over('タイムアップ！');}
   if(this.rel>0){this.rel-=dt;if(this.rel<=0)this.ammo=6;}
   for(const r of this.rows){for(const it of r.items){it.x+=r.sp*dt;if(it.down)it.down+=dt;}
     for(const it of r.items){if(r.sp>0&&it.x>786){it.x-=830;Object.assign(it,this.mk(it.x));}if(r.sp<0&&it.x<-40){it.x+=830;Object.assign(it,this.mk(it.x));}}}
   for(const f of this.fx){f.t-=dt;f.y-=30*dt;}this.fx=this.fx.filter(f=>f.t>0);for(const s of this.shots)s.t-=dt;this.shots=this.shots.filter(s=>s.t>0);},
 draw(c){bg(c,746,420,'#3d0c11');c.fillStyle='#e63946';for(let x=0;x<746;x+=60){c.beginPath();c.moveTo(x,0);c.lineTo(x+60,0);c.lineTo(x+30,40);c.fill();}
   for(const r of this.rows){box(c,0,r.y+14,746,10,0,'#bc6c25');for(const it of r.items){if(it.down>.5)continue;c.save();c.translate(it.x,r.y-10);if(it.down)c.rotate(it.down*4);T(c,this.T_[it.k][0],0,0,38,UI.ink);c.restore();}}
   for(const s of this.shots)circle(c,s.x,s.y,12*(1-s.t*2),null,'#ffd166',2);
   for(const f of this.fx){c.globalAlpha=Math.min(1,f.t*2);T(c,f.s,f.x,f.y,20,'#ffd166','center',4);}c.globalAlpha=1;
   for(let i=0;i<6;i++)box(c,14+i*16,384,10,24,4,i<this.ammo?'#ffd166':'rgba(255,255,255,.2)');
   btn(c,636,370,100,40,this.rel>0?'…':'リロード',{size:15,on:this.rel<=0&&this.ammo<6});
   T(c,`${Math.ceil(this.time)}秒`,734,56,16,'#fff','right');T(c,`${score}点`,12,56,18,'#fff','left');}},

/* ---------- 早撃ちガンマン ---------- */
{id:'quickdraw',name:'早撃ちガンマン',emoji:'🤠',tag:'カジュアル',color:['#f4a261','#6f1d1b'],
 desc:'「撃て！」の合図が出たら、相手より早くタップ！ 合図の前に撃つと反則負け。相手はだんだん速くなる。',
 help:'「撃て！」が出たら、すぐにクリック / タップ / スペース',
 w:640,h:360,
 reset(api){this.api=api;this.round=0;this.best=null;this.next();},
 next(){this.ph='wait';this.t=rnd(1.5,4);this.cpu=Math.max(.2,.42-this.round*.025)+rnd(0,.06);this.res=null;this.rt=0;},
 fire(){if(this.ph==='wait'){this.ph='res';this.res='反則！ 早すぎ';this.win=false;this.t=1.6;return;}
   if(this.ph==='go'){const rt=this.rt;this.best=this.best==null?rt:Math.min(this.best,rt);this.ph='res';this.win=true;this.res=`勝ち！ ${(rt*1000).toFixed(0)}ms`;this.api.addScore(1);this.t=1.4;}},
 key(c,d,rep){if(d&&!rep&&(c==='Space'||c==='Enter'))this.fire();},
 pointer(t){if(t==='down')this.fire();},
 update(dt){if(this.ph==='wait'){this.t-=dt;if(this.t<=0){this.ph='go';this.rt=0;}}
   else if(this.ph==='go'){this.rt+=dt;if(this.rt>=this.cpu){this.ph='res';this.win=false;this.res=`負け… 相手 ${(this.cpu*1000).toFixed(0)}ms`;this.t=1.6;}}
   else if(this.ph==='res'){this.t-=dt;if(this.t<=0){if(!this.win)return this.api.over(`${this.round}連勝${this.best!=null?` / 最速 ${(this.best*1000).toFixed(0)}ms`:''}`);this.round++;this.next();}}},
 draw(c){const g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,this.ph==='go'?'#ffb703':'#f4a261');g.addColorStop(1,'#e76f51');c.fillStyle=g;c.fillRect(0,0,640,360);
   c.fillStyle='#9c6644';c.fillRect(0,280,640,80);circle(c,320,120,40,'rgba(255,255,255,.5)');
   const man=(x,flip,col,dead)=>{c.save();c.translate(x,240);if(flip)c.scale(-1,1);if(dead)c.rotate(-1.2);box(c,-14,-40,28,50,8,col);circle(c,0,-54,13,'#ffcf99');box(c,-20,-70,40,8,3,'#4a2c1a');box(c,-12,-82,24,14,4,'#4a2c1a');line(c,-8,10,-10,40,'#333',7);line(c,8,10,10,40,'#333',7);
     if(this.ph==='res'&&!dead||this.ph==='go'&&!flip)line(c,14,-28,40,-34,'#222',5);c.restore();};
   man(150,false,UI.blue,this.ph==='res'&&!this.win);man(490,true,'#6f1d1b',this.ph==='res'&&this.win);
   T(c,this.ph==='wait'?'…':this.ph==='go'?'撃て！':this.res,320,60,this.ph==='go'?48:24,this.ph==='go'?'#d00000':'#fff','center',this.ph==='go'?0:4);
   T(c,`${this.round}連勝`,14,24,16,'#fff','left');if(this.best!=null)T(c,`最速 ${(this.best*1000).toFixed(0)}ms`,626,24,14,'#fff','right');}},

/* ---------- ストップウォッチ10秒 ---------- */
{id:'tensec',name:'ぴったり10秒',emoji:'⏱️',tag:'カジュアル',color:['#e9edc9','#606c38'],
 desc:'ストップウォッチを「ぴったり10.00秒」で止めよう。表示は途中で消えるので体内時計がたより。5回勝負。',
 help:'スタートしたら、10秒だと思ったところでクリック / タップ / スペース',
 w:400,h:440,
 reset(api){this.api=api;this.n=0;this.res=[];this.ph='ready';this.t=0;},
 press(){if(this.ph==='ready'){this.ph='run';this.t=0;}else if(this.ph==='run'){this.ph='show';const d=Math.abs(this.t-10);const pts=Math.max(0,Math.round(100-d*100));this.res.push({t:this.t,pts});this.api.addScore(pts);this.st=1.6;}},
 key(c,d,rep){if(d&&!rep&&(c==='Space'||c==='Enter'))this.press();},
 pointer(t){if(t==='down')this.press();},
 update(dt){if(this.ph==='run'){this.t+=dt;if(this.t>20)this.press();}else if(this.ph==='show'){this.st-=dt;if(this.st<=0){this.n++;if(this.n>=5)return this.api.win(`合計 ${score}点`);this.ph='ready';}}},
 draw(c){bg(c,400,440);circle(c,200,190,120,'#fff',UI.ink,6);box(c,188,52,24,22,4,UI.ink);
   const hide=this.ph==='run'&&this.t>3;const v=this.ph==='show'?this.res[this.res.length-1].t:this.t;
   T(c,hide?'?.??':v.toFixed(2),200,192,48,hide?'#bbb':UI.ink);
   if(this.ph==='run'){const a=(this.t%1)*Math.PI*2-Math.PI/2;if(!hide)line(c,200,190,200+Math.cos(a)*95,190+Math.sin(a)*95,UI.red,3);}
   T(c,this.ph==='ready'?'タップでスタート':this.ph==='run'?'10秒だと思ったらタップ！':`${(this.res[this.res.length-1].t-10>=0?'+':'')}${(this.res[this.res.length-1].t-10).toFixed(2)}秒  →  ${this.res[this.res.length-1].pts}点`,200,350,17,this.ph==='show'?UI.blue:UI.ink);
   this.res.forEach((r,i)=>T(c,`${i+1}回目 ${r.t.toFixed(2)}`,40+i*80,410,12,UI.sub));T(c,`${Math.min(this.n+1,5)} / 5`,380,24,14,UI.sub,'right');}},

/* ---------- リフティング ---------- */
{id:'keepup',name:'リフティング',emoji:'🎈',tag:'カジュアル',color:['#ffafcc','#cdb4db'],
 desc:'落ちてくるボールをタップして空中に打ち上げ続けよう。ボールの端をタップすると横に飛ぶ。',
 help:'ボールをクリック / タップして打ち上げる',
 w:800,h:450,
 reset(api){this.api=api;this.b={x:400,y:160,vx:0,vy:0,r:34,rot:0};this.started=false;this.fx=[];},
 pointer(t,x,y){if(t!=='down')return;const b=this.b,d=dist(x,y,b.x,b.y);if(d>b.r+18)return;this.started=true;const off=(b.x-x)/b.r;b.vy=-560-Math.min(150,score*6);b.vx=clamp(b.vx*.4+off*260,-320,320);this.api.addScore(1);this.fx.push({x,y,t:.4});},
 update(dt){if(!this.started)return;const b=this.b;b.vy+=(950+Math.min(400,score*12))*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.rot+=b.vx*dt*.02;
   if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.8;}if(b.x>800-b.r){b.x=800-b.r;b.vx=-Math.abs(b.vx)*.8;}if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*.5;}
   if(b.y>450-b.r)return this.api.over(`${score}回`);for(const f of this.fx)f.t-=dt;this.fx=this.fx.filter(f=>f.t>0);},
 draw(c){bg(c,800,450,'#fff0f6');c.fillStyle='#bde0a8';c.fillRect(0,420,800,30);const b=this.b;
   c.save();c.translate(b.x,b.y);c.rotate(b.rot);circle(c,0,0,b.r,'#fff','#222',3);for(let k=0;k<5;k++){const a=k*Math.PI*2/5;circle(c,Math.cos(a)*b.r*.62,Math.sin(a)*b.r*.62,b.r*.2,'#222');}circle(c,0,0,b.r*.24,'#222');c.restore();
   circle(c,b.x,435,b.r*(.6+Math.min(.4,b.y/1400)),'rgba(0,0,0,.08)');
   for(const f of this.fx)circle(c,f.x,f.y,(.4-f.t)*70,null,`rgba(255,111,145,${f.t*2})`,3);
   T(c,String(score),400,80,60,'#ff6f91','center');if(!this.started)T(c,'ボールをタップ！',400,250,18,UI.sub);}}
);
