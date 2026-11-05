'use strict';
/* パック6：アクション 10本 */
addGames(

/* ---------- 隕石ブラスター ---------- */
{id:'rocks',name:'隕石ブラスター',emoji:'☄️',tag:'シューティング',color:['#9aa5ff','#3a3f8f'],
 desc:'宇宙船を回転・噴射させて隕石を撃ちくだけ。大きい隕石は割れて小さくなる。',
 help:'←→ で回転、↑ で噴射、スペースで発射（画面のはしは反対側につながる）',
 w:800,h:450,
 pad:[['↺','ArrowLeft'],['噴射','ArrowUp'],['↻','ArrowRight'],['発射','Space']],
 reset(api){this.api=api;this.s={x:400,y:225,vx:0,vy:0,a:-Math.PI/2};this.b=[];this.r=[];this.lives=3;this.inv=2;this.wave=0;this.K={};this.cd=0;this.parts=[];this.next();},
 next(){this.wave++;for(let i=0;i<3+this.wave;i++){let x,y;do{x=rnd(0,800);y=rnd(0,450);}while(dist(x,y,this.s.x,this.s.y)<140);this.rock(x,y,3);}},
 rock(x,y,sz){const a=rnd(0,7),sp=rnd(30,70)*(4-sz)*.6+20;const pts=[...Array(10)].map(()=>rnd(.75,1.15));this.r.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,sz,R:sz*14,pts,rot:rnd(-1,1),ang:0});},
 key(c,d){this.K[c]=d;},
 wrap(o){o.x=(o.x+800)%800;o.y=(o.y+450)%450;},
 boom(x,y,n,col){for(let i=0;i<n;i++){const a=rnd(0,7),s=rnd(40,160);this.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.3,.7),c:col});}},
 update(dt){const s=this.s,K=this.K;
   if(K.ArrowLeft||K.KeyA)s.a-=4*dt;if(K.ArrowRight||K.KeyD)s.a+=4*dt;
   this.th=K.ArrowUp||K.KeyW;if(this.th){s.vx+=Math.cos(s.a)*260*dt;s.vy+=Math.sin(s.a)*260*dt;}
   s.vx*=Math.pow(.6,dt);s.vy*=Math.pow(.6,dt);s.x+=s.vx*dt;s.y+=s.vy*dt;this.wrap(s);this.inv-=dt;
   this.cd-=dt;if((K.Space||K.KeyJ)&&this.cd<=0&&this.b.length<6){this.cd=.22;this.b.push({x:s.x+Math.cos(s.a)*14,y:s.y+Math.sin(s.a)*14,vx:Math.cos(s.a)*420+s.vx,vy:Math.sin(s.a)*420+s.vy,t:1.1});}
   for(const b of this.b){b.x+=b.vx*dt;b.y+=b.vy*dt;b.t-=dt;this.wrap(b);}
   for(const r of this.r){r.x+=r.vx*dt;r.y+=r.vy*dt;r.ang+=r.rot*dt;this.wrap(r);}
   for(const p of this.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.t-=dt;}this.parts=this.parts.filter(p=>p.t>0);
   for(const b of this.b)for(const r of this.r){if(r.dead||b.t<=0)continue;if(dist(b.x,b.y,r.x,r.y)<r.R){r.dead=true;b.t=0;this.api.addScore([0,100,50,20][r.sz]);this.boom(r.x,r.y,8,'#c9c3b8');if(r.sz>1){this.rock(r.x,r.y,r.sz-1);this.rock(r.x,r.y,r.sz-1);}}}
   this.b=this.b.filter(b=>b.t>0);this.r=this.r.filter(r=>!r.dead);
   if(this.inv<=0)for(const r of this.r)if(dist(s.x,s.y,r.x,r.y)<r.R+8){this.lives--;this.boom(s.x,s.y,20,'#7ef9ff');if(this.lives<=0)return this.api.over();Object.assign(s,{x:400,y:225,vx:0,vy:0});this.inv=2.5;break;}
   if(!this.r.length)this.next();},
 draw(c){bg(c,800,450,'#0b0d1f');for(let i=0;i<80;i++){c.fillStyle='rgba(255,255,255,.4)';c.fillRect((i*97)%800,(i*61)%450,1.5,1.5);}
   for(const r of this.r){c.save();c.translate(r.x,r.y);c.rotate(r.ang);c.beginPath();r.pts.forEach((k,i)=>{const a=i/r.pts.length*Math.PI*2;c.lineTo(Math.cos(a)*r.R*k,Math.sin(a)*r.R*k);});c.closePath();c.fillStyle='#4a4a5c';c.fill();c.strokeStyle='#a8a3b8';c.lineWidth=2;c.stroke();c.restore();}
   c.fillStyle='#ffe08a';for(const b of this.b){c.beginPath();c.arc(b.x,b.y,2.5,0,7);c.fill();}
   for(const p of this.parts){c.globalAlpha=Math.min(1,p.t*2);c.fillStyle=p.c;c.fillRect(p.x-1.5,p.y-1.5,3,3);}c.globalAlpha=1;
   const s=this.s;if(!(this.inv>0&&Math.floor(this.inv*8)%2)){c.save();c.translate(s.x,s.y);c.rotate(s.a);
     if(this.th&&state==='play'){c.fillStyle=Math.random()<.5?'#ff9f43':'#ff5e5e';c.beginPath();c.moveTo(-8,-5);c.lineTo(-18-rnd(0,6),0);c.lineTo(-8,5);c.fill();}
     c.beginPath();c.moveTo(14,0);c.lineTo(-10,-9);c.lineTo(-6,0);c.lineTo(-10,9);c.closePath();c.fillStyle='#7ef9ff';c.fill();c.restore();}
   T(c,'▲'.repeat(Math.max(0,this.lives)),12,20,14,'#7ef9ff','left');T(c,'WAVE '+this.wave,788,20,14,'#a9acd6','right');}},

/* ---------- 道路わたり ---------- */
{id:'cross',name:'道路わたり',emoji:'🐸',tag:'アクション',color:['#a7f3a0','#2b9348'],
 desc:'車をよけて道路をわたり、丸太に乗って川をこえよう。向こう岸に着くたびにスピードアップ！',
 help:'矢印キー / WASD / スワイプ / タップで1マスずつジャンプ',
 w:920,h:520,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']],
 reset(api){this.api=api;this.lv=0;this.lives=3;this.build();this.spawn();},
 build(){const sp=1+this.lv*.18;this.L=[];
   for(let i=0;i<5;i++){const dir=i%2?1:-1,speed=(50+i*14)*sp*dir,objs=[],w=i===2?90:ri(40,60),gap=ri(120,180);for(let x=0;x<1040;x+=w+gap+rnd(0,60))objs.push({x,w});this.L.push({y:11-i,type:'car',speed,objs,col:PAL[(i*2+1)%8]});}
   for(let i=0;i<5;i++){const dir=i%2?-1:1,speed=(40+i*10)*sp*dir,objs=[],w=ri(90,150),gap=ri(70,110);for(let x=0;x<1100;x+=w+gap)objs.push({x,w});this.L.push({y:5-i,type:'log',speed,objs});}},
 spawn(){this.p={x:11,y:12,fx:11*40+20};this.time=30;this.dead=0;this.best=12;},
 lane(y){return this.L.find(l=>l.y===y);},
 hop(dx,dy){if(this.dead)return;const nx=clamp(Math.round(this.p.fx/40-.5)+dx,0,22),ny=clamp(this.p.y+dy,0,12);this.p.y=ny;this.p.fx=nx*40+20;
   if(ny<this.best){this.best=ny;this.api.addScore(10);}
   if(ny===0){this.api.addScore(100+Math.floor(this.time)*5);this.lv++;this.build();this.spawn();}},
 key(c,d){if(!d)return;const m={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1]}[c];if(m)this.hop(m[0],m[1]);},
 pointer(t,x,y){if(t==='down'){this.sx=x;this.sy=y;}else if(t==='up'&&this.sx!=null){const dx=x-this.sx,dy=y-this.sy;this.sx=null;
   if(Math.hypot(dx,dy)>20)Math.abs(dx)>Math.abs(dy)?this.hop(Math.sign(dx),0):this.hop(0,Math.sign(dy));else{const px=this.p.fx,py=this.p.y*40+20;const ex=x-px,ey=y-py;Math.abs(ex)>Math.abs(ey)?this.hop(Math.sign(ex),0):this.hop(0,Math.sign(ey));}}},
 die(){this.dead=1;this.lives--;},
 update(dt){for(const l of this.L)for(const o of l.objs){o.x+=l.speed*dt;const span=l.type==='log'?1100:1040;if(l.speed>0&&o.x>920)o.x-=span;if(l.speed<0&&o.x+o.w<0)o.x+=span;}
   if(this.dead){this.dead+=dt;if(this.dead>1.2){if(this.lives<=0)return this.api.over();this.spawn();}return;}
   this.time-=dt;if(this.time<=0)return this.die();
   const l=this.lane(this.p.y),px=this.p.fx;
   if(l&&l.type==='car'){for(const o of l.objs)if(px+12>o.x&&px-12<o.x+o.w)return this.die();}
   if(l&&l.type==='log'){const on=l.objs.find(o=>px>o.x+4&&px<o.x+o.w-4);if(!on)return this.die();this.p.fx+=l.speed*dt;if(this.p.fx<10||this.p.fx>910)return this.die();}},
 draw(c){bg(c,920,520);
   for(let y=0;y<13;y++){const l=this.lane(y);c.fillStyle=y===0?'#9be38f':y===6||y===12?'#c7e9b0':l&&l.type==='car'?'#4a4e57':'#4da3d9';c.fillRect(0,y*40,920,40);
     if(l&&l.type==='car'&&y!==7){c.fillStyle='rgba(255,255,255,.4)';for(let x=0;x<920;x+=40)c.fillRect(x+10,y*40-1,20,2);}}
   T(c,'ゴール',460,20,14,'#2b6a2e');
   for(const l of this.L)for(const o of l.objs){const y=l.y*40;if(l.type==='log'){box(c,o.x,y+6,o.w,28,12,'#9c6b3c');c.fillStyle='rgba(0,0,0,.15)';for(let k=12;k<o.w-6;k+=24)c.fillRect(o.x+k,y+12,3,16);}
     else{box(c,o.x,y+7,o.w,26,7,l.col);c.fillStyle='rgba(255,255,255,.55)';const fr=l.speed>0?o.x+o.w-14:o.x+4;c.fillRect(fr,y+11,10,18);}}
   const P=this.p,X=P.fx,Y=P.y*40+20;if(this.dead){T(c,'💥',X,Y,30,UI.red);}else{circle(c,X,Y,14,'#3fbf4a');circle(c,X-6,Y-9,5,'#fff');circle(c,X+6,Y-9,5,'#fff');circle(c,X-6,Y-9,2.4,'#222');circle(c,X+6,Y-9,2.4,'#222');}
   T(c,'♥'.repeat(Math.max(0,this.lives)),10,500,16,UI.red,'left');T(c,`${Math.ceil(this.time)}秒`,910,500,15,'#2b6a2e','right');T(c,`ステージ ${this.lv+1}`,460,500,14,'#2b6a2e');}},

/* ---------- ドットイーター迷路 ---------- */
{id:'doteater',name:'ドットイーター',emoji:'🟡',tag:'アクション',color:['#ffe066','#4361ee'],
 desc:'迷路のドットを全部食べよう。おばけに捕まらないように！ 大きいドットを食べるとおばけを食べられる。',
 help:'矢印キー / WASD / スワイプで方向を変える',
 w:420,h:470,N:15,TS:28,OY:44,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']],
 reset(api){this.api=api;this.lv=0;this.lives=3;this.newLevel();},
 newLevel(){const N=this.N;this.w=[...Array(N*N)].fill(1);const seen=new Set(),st=[[1,1]];seen.add('1,1');this.w[N+1]=0;
   while(st.length){const[x,y]=st[st.length-1];const nb=[[2,0],[-2,0],[0,2],[0,-2]].filter(([dx,dy])=>{const a=x+dx,b=y+dy;return a>0&&b>0&&a<N-1&&b<N-1&&!seen.has(a+','+b);});
     if(!nb.length){st.pop();continue;}const[dx,dy]=nb[ri(0,nb.length-1)];this.w[(y+dy/2)*N+x+dx/2]=0;this.w[(y+dy)*N+x+dx]=0;seen.add((x+dx)+','+(y+dy));st.push([x+dx,y+dy]);}
   for(let k=0;k<40;k++){const x=ri(1,N-2),y=ri(1,N-2);if(this.w[y*N+x]&&((x%2===1&&y%2===0)||(x%2===0&&y%2===1)))this.w[y*N+x]=0;}
   for(const[x,y]of[[6,7],[7,7],[8,7],[7,6],[7,8]])this.w[y*N+x]=0;
   this.dot=new Map();for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!this.w[y*N+x]&&!(Math.abs(x-7)<=1&&Math.abs(y-7)<=1))this.dot.set(x+','+y,1);
   for(const k of['1,1','13,1','1,13','13,13'])if(this.dot.has(k))this.dot.set(k,2);
   this.dot.delete('1,13');this.fr=0;this.resetPos();},
 resetPos(){this.pl={x:1,y:13,d:null,q:null};this.gh=[0,1,2].map(i=>({x:7,y:7,d:null,home:i*1.5,eaten:false}));this.dead=0;},
 wall(x,y){return x<0||y<0||x>=this.N||y>=this.N||this.w[y*this.N+x]===1;},
 step(e,dist,choose){let guard=0;while(dist>1e-6&&guard++<10){const cx=Math.round(e.x),cy=Math.round(e.y),atC=Math.abs(e.x-cx)<1e-6&&Math.abs(e.y-cy)<1e-6;
     if(atC){e.x=cx;e.y=cy;choose(e);if(!e.d||this.wall(cx+e.d[0],cy+e.d[1])){e.d=null;return;}}
     const tx=e.d[0]>0?Math.floor(e.x+1e-6)+1:e.d[0]<0?Math.ceil(e.x-1e-6)-1:e.x,ty=e.d[1]>0?Math.floor(e.y+1e-6)+1:e.d[1]<0?Math.ceil(e.y-1e-6)-1:e.y;
     const rem=Math.abs(tx-e.x)+Math.abs(ty-e.y),m=Math.min(rem,dist);e.x+=e.d[0]*m;e.y+=e.d[1]*m;dist-=m;}},
 key(c,d){if(!d)return;const m={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1]}[c];if(m)this.turn(m);},
 turn(m){this.pl.q=m;const d=this.pl.d;if(d&&d[0]===-m[0]&&d[1]===-m[1])this.pl.d=m;},
 pointer(t,x,y){if(t==='down'){this.sx=x;this.sy=y;}else if(t==='move'&&this.sx!=null){const dx=x-this.sx,dy=y-this.sy;if(Math.hypot(dx,dy)>18){this.turn(Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)]);this.sx=x;this.sy=y;}}else if(t==='up')this.sx=null;},
 update(dt){if(this.dead){this.dead+=dt;if(this.dead>1.5){if(this.lives<=0)return this.api.over();this.resetPos();}return;}
   const p=this.pl;this.step(p,(4.6+this.lv*.2)*dt,e=>{if(e.q&&!this.wall(e.x+e.q[0],e.y+e.q[1]))e.d=e.q;});
   const k=Math.round(p.x)+','+Math.round(p.y),v=this.dot.get(k);if(v&&Math.abs(p.x-Math.round(p.x))+Math.abs(p.y-Math.round(p.y))<.3){this.dot.delete(k);this.api.addScore(v===2?50:10);if(v===2){this.fr=7;this.gh.forEach(g=>g.eaten=false);this.chain=0;}}
   if(!this.dot.size){this.api.addScore(500);this.lv++;this.newLevel();return;}
   this.fr=Math.max(0,this.fr-dt);
   this.gh.forEach((g,i)=>{if(g.home>0){g.home-=dt;return;}const fright=this.fr>0&&!g.eaten;
     this.step(g,(fright?2.6:3.6+this.lv*.25+i*.15)*dt,e=>{const opts=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>!this.wall(e.x+d[0],e.y+d[1])&&!(e.d&&d[0]===-e.d[0]&&d[1]===-e.d[1]));const o=opts.length?opts:[[-(e.d||[1,0])[0],-(e.d||[1,0])[1]]];
       if(fright||Math.random()<.25+i*.1){e.d=o[ri(0,o.length-1)];return;}const tx=p.x+(i===1&&p.d?p.d[0]*3:0),ty=p.y+(i===1&&p.d?p.d[1]*3:0);
       e.d=o.reduce((b,d)=>dist(e.x+d[0],e.y+d[1],tx,ty)<dist(e.x+b[0],e.y+b[1],tx,ty)?d:b,o[0]);});
     if(dist(g.x,g.y,p.x,p.y)<.65){if(fright){g.eaten=true;g.x=7;g.y=7;g.d=null;g.home=2;this.chain=(this.chain||0)+1;this.api.addScore(200*this.chain);}else{this.lives--;this.dead=.01;}}});},
 draw(c){bg(c,420,470,'#10132b');const{N,TS,OY}=this;
   for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(this.w[y*N+x])box(c,x*TS+2,OY+y*TS+2,TS-4,TS-4,6,'#2e3a8c');
   for(const[k,v]of this.dot){const[x,y]=k.split(',').map(Number);circle(c,(x+.5)*TS,OY+(y+.5)*TS,v===2?7+Math.sin(performance.now()/150)*1.5:3,'#ffd6a5');}
   const gc=['#ff5e7e','#5ec8ff','#ffb84d'];
   this.gh.forEach((g,i)=>{const X=(g.x+.5)*TS,Y=OY+(g.y+.5)*TS,fr=this.fr>0&&!g.eaten;c.fillStyle=fr?(this.fr<2&&Math.floor(this.fr*6)%2?'#fff':'#4361ee'):gc[i];
     c.beginPath();c.arc(X,Y-2,11,Math.PI,0);c.lineTo(X+11,Y+10);for(let k=0;k<4;k++)c.lineTo(X+11-k*7.3-3.6,Y+(k%2?10:6));c.lineTo(X-11,Y+10);c.fill();
     circle(c,X-4,Y-3,3.5,'#fff');circle(c,X+4,Y-3,3.5,'#fff');circle(c,X-4+(g.d?g.d[0]:0)*1.5,Y-3+(g.d?g.d[1]:0)*1.5,1.8,'#222');circle(c,X+4+(g.d?g.d[0]:0)*1.5,Y-3+(g.d?g.d[1]:0)*1.5,1.8,'#222');});
   const p=this.pl,X=(p.x+.5)*TS,Y=OY+(p.y+.5)*TS,ang=p.d?Math.atan2(p.d[1],p.d[0]):0,mo=this.dead?Math.min(Math.PI,this.dead*3):.1+Math.abs(Math.sin(performance.now()/90))*.5;
   c.fillStyle='#ffe066';c.beginPath();c.moveTo(X,Y);c.arc(X,Y,12,ang+mo,ang+Math.PI*2-mo);c.closePath();c.fill();
   T(c,`ステージ ${this.lv+1}`,12,22,15,'#fff','left');T(c,'●'.repeat(Math.max(0,this.lives)),408,22,14,'#ffe066','right');}},

/* ---------- ミサイル防衛 ---------- */
{id:'defense',name:'ミサイル防衛',emoji:'🎯',tag:'シューティング',color:['#ffadad','#c1121f'],
 desc:'空から降ってくるミサイルを、迎撃ミサイルの爆発で撃ち落として町を守ろう。',
 help:'ねらった場所をクリック / タップすると迎撃ミサイルが飛ぶ',
 w:746,h:420,
 reset(api){this.api=api;this.city=[80,180,280,466,566,666].map(x=>({x,alive:true}));this.wave=0;this.ex=[];this.my=[];this.en=[];this.nextWave();},
 nextWave(){this.wave++;this.toSpawn=6+this.wave*3;this.spT=1;this.ammo=10+this.wave*3;this.sp=28+this.wave*6;this.waveT=0;},
 pointer(t,x,y){if(t!=='down'||this.ammo<=0||y>360)return;this.ammo--;const d=dist(373,370,x,y);this.my.push({x:373,y:370,tx:x,ty:y,vx:(x-373)/d*420,vy:(y-370)/d*420});},
 update(dt){
   if(this.toSpawn>0){this.spT-=dt;if(this.spT<=0){this.spT=rnd(.4,1.4)*Math.max(.4,1-this.wave*.06);this.toSpawn--;const alive=this.city.filter(c=>c.alive);const tgt=alive.length&&Math.random()<.8?alive[ri(0,alive.length-1)].x:rnd(20,726);
     const sx=rnd(10,736);this.en.push({sx,sy:0,x:sx,y:0,tx:tgt,ty:380,split:this.wave>2&&Math.random()<.2});}}
   for(const m of this.my){m.x+=m.vx*dt;m.y+=m.vy*dt;if((m.vy<0&&m.y<=m.ty)||dist(m.x,m.y,m.tx,m.ty)<8){m.done=true;this.ex.push({x:m.tx,y:m.ty,r:0,t:0});}}this.my=this.my.filter(m=>!m.done);
   for(const e of this.ex){e.t+=dt;e.r=e.t<.5?e.t*80:Math.max(0,40-(e.t-.5)*60);}this.ex=this.ex.filter(e=>e.t<1.2);
   for(const e of this.en){const d=dist(e.sx,e.sy,e.tx,e.ty);e.x+=(e.tx-e.sx)/d*this.sp*dt;e.y+=(e.ty-e.sy)/d*this.sp*dt;
     if(e.split&&e.y>140){e.split=false;for(let k=0;k<2;k++){const alive=this.city.filter(c=>c.alive);this.en.push({sx:e.x,sy:e.y,x:e.x,y:e.y,tx:alive.length?alive[ri(0,alive.length-1)].x:rnd(20,726),ty:380});}}
     for(const x of this.ex)if(dist(e.x,e.y,x.x,x.y)<x.r){e.dead=true;this.api.addScore(25);}
     if(e.y>=378){e.dead=true;this.ex.push({x:e.x,y:375,r:0,t:.2,bad:true});for(const ci of this.city)if(ci.alive&&Math.abs(ci.x-e.x)<26)ci.alive=false;}}
   this.en=this.en.filter(e=>!e.dead);
   if(!this.city.some(c=>c.alive))return this.api.over('町が全滅…');
   if(this.toSpawn<=0&&!this.en.length){this.waveT+=dt;if(this.waveT>1.2){this.api.addScore(this.city.filter(c=>c.alive).length*100+this.ammo*5);this.nextWave();}}},
 draw(c){const g=c.createLinearGradient(0,0,0,420);g.addColorStop(0,'#0d1b3d');g.addColorStop(1,'#33415c');c.fillStyle=g;c.fillRect(0,0,746,420);
   c.fillStyle='#6b705c';c.fillRect(0,380,746,40);
   for(const ci of this.city){if(ci.alive){c.fillStyle='#8ecae6';c.fillRect(ci.x-18,362,10,18);c.fillRect(ci.x-6,352,12,28);c.fillRect(ci.x+8,366,10,14);}else{c.fillStyle='#3d3d3d';c.fillRect(ci.x-16,374,32,6);}}
   c.fillStyle='#ffd166';c.beginPath();c.moveTo(353,380);c.lineTo(373,356);c.lineTo(393,380);c.fill();
   for(const e of this.en){line(c,e.sx,e.sy,e.x,e.y,'rgba(255,94,94,.6)',1.5);circle(c,e.x,e.y,2.5,'#ff5e5e');}
   for(const m of this.my){line(c,373,370,m.x,m.y,'rgba(126,249,255,.5)',1.5);circle(c,m.tx,m.ty,3,null,'#7ef9ff',1);}
   for(const e of this.ex)circle(c,e.x,e.y,e.r,e.bad?'rgba(255,120,60,.7)':'rgba(255,240,170,.75)');
   T(c,`WAVE ${this.wave}`,12,20,14,'#fff','left');T(c,`弾 ${this.ammo}`,734,20,14,this.ammo<4?'#ff8080':'#fff','right');}},

/* ---------- 洞窟フライト ---------- */
{id:'cave',name:'洞窟フライト',emoji:'🚁',tag:'アクション',color:['#c9ada7','#4a4e69'],
 desc:'押している間は上昇、はなすと下降。せまくなっていく洞窟をどこまで進めるか！',
 help:'スペース / クリック / タップを押している間だけ上昇',
 w:569,h:320,
 reset(api){this.api=api;this.y=160;this.vy=0;this.hold=false;this.d=0;this.off=0;this.seg=[];this.cx=160;this.cv=0;this.gap=210;for(let i=0;i<=60;i++)this.addSeg(true);this.ob=[];this.obT=2.5;this.smoke=[];},
 addSeg(flat){if(!flat){this.cv=clamp(this.cv+rnd(-2.5,2.5),-9,9);this.cx+=this.cv;}const lo=this.gap/2+10,hi=320-this.gap/2-10;if(this.cx<lo||this.cx>hi){this.cx=clamp(this.cx,lo,hi);this.cv*=-.5;}
   this.seg.push({top:this.cx-this.gap/2,bot:this.cx+this.gap/2});if(!flat)this.gap=Math.max(120,this.gap-.25);},
 key(c,d){if(c==='Space'||c==='ArrowUp')this.hold=d;},
 pointer(t){if(t==='down')this.hold=true;if(t==='up')this.hold=false;},
 onStart(){this.hold=false;},
 update(dt){const sp=170+this.d/60;this.vy+=(this.hold?-500:420)*dt;this.vy=clamp(this.vy,-230,250);this.y+=this.vy*dt;this.d+=sp*dt;this.api.setScore(Math.floor(this.d/10));
   this.off=(this.off||0)+sp*dt;while(this.off>=10){this.off-=10;this.seg.shift();this.addSeg();for(const o of this.ob)o.x-=10;}
   this.obT-=dt;if(this.obT<=0){this.obT=rnd(1.8,3);const s=this.seg[59],g=s.bot-s.top;if(g>=150){const h=40,free=g-h-75;this.ob.push({x:590,y:Math.random()<.5?s.top+rnd(0,free):s.bot-h-rnd(0,free),h});}}
   this.ob=this.ob.filter(o=>o.x>-30);
   this.smoke.push({x:100,y:this.y,t:.6});for(const s of this.smoke){s.t-=dt;s.x-=sp*dt;}this.smoke=this.smoke.filter(s=>s.t>0);
   const i=Math.floor((100+(this.off||0))/10),s=this.seg[i]||this.seg[0];if(this.y-8<s.top||this.y+8>s.bot)return this.api.over();
   for(const o of this.ob)if(100+12>o.x-(this.off||0)&&100-12<o.x-(this.off||0)+18&&this.y+7>o.y&&this.y-7<o.y+o.h)return this.api.over();},
 draw(c){bg(c,569,320,'#22223b');const off=this.off||0;
   c.fillStyle='#9a8c98';c.beginPath();c.moveTo(0,0);this.seg.forEach((s,i)=>c.lineTo(i*10-off,s.top));c.lineTo(620,0);c.fill();
   c.beginPath();c.moveTo(0,320);this.seg.forEach((s,i)=>c.lineTo(i*10-off,s.bot));c.lineTo(620,320);c.fill();
   for(const o of this.ob)box(c,o.x-off,o.y,18,o.h,5,'#c9ada7');
   for(const s of this.smoke)circle(c,s.x,s.y,4+(.6-s.t)*10,`rgba(255,255,255,${s.t*.3})`);
   c.save();c.translate(100,this.y);c.rotate(clamp(this.vy/600,-.35,.35));box(c,-16,-9,32,18,8,UI.yellow);box(c,4,-6,9,8,3,'#8ecae6');line(c,-22,-14,22,-14,'#ddd',3);line(c,0,-14,0,-9,'#ddd',2);line(c,-16,0,-26,-4,UI.yellow,4);c.restore();
   T(c,`${score} m`,559,18,15,'#fff','right');}},

/* ---------- タワースタック ---------- */
{id:'stack',name:'タワースタック',emoji:'🏗️',tag:'アクション',color:['#ffc6ff','#7209b7'],
 desc:'左右に動くブロックをタイミングよく落として積み上げよう。はみ出た部分は切り落とされる。',
 help:'スペース / クリック / タップでブロックを落とす',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 reset(api){this.api=api;this.tw=[{x:80,w:200}];this.mv={x:0,w:200,dir:1};this.spd=170;this.cam=0;this.falls=[];this.perf=0;},
 drop(){const top=this.tw[this.tw.length-1],m=this.mv;let l=Math.max(top.x,m.x),r=Math.min(top.x+top.w,m.x+m.w);
   if(r<=l){this.falls.push({x:m.x,w:m.w,y:this.yOf(this.tw.length),vy:0});return this.api.over(`${this.tw.length-1}段 積み上げた`);}
   if(Math.abs(m.x-top.x)<5){l=top.x;r=top.x+top.w;this.perf=.6;this.api.addScore(2);}else{const cutX=m.x<top.x?m.x:r,cutW=m.w-(r-l);this.falls.push({x:cutX,w:cutW,y:this.yOf(this.tw.length),vy:0});this.api.addScore(1);}
   this.tw.push({x:l,w:r-l});const nd=-this.mv.dir;this.mv={w:r-l,dir:nd,x:nd>0?-(r-l):360};this.spd=Math.min(420,this.spd+8);},
 yOf(i){return 500-i*28;},
 key(c,d,rep){if(d&&!rep&&(c==='Space'||c==='Enter'))this.drop();},
 pointer(t){if(t==='down')this.drop();},
 update(dt){const m=this.mv;m.x+=m.dir*this.spd*dt;if(m.x>360-m.w*.2&&m.dir>0)m.dir=-1;if(m.x<-m.w*.8&&m.dir<0)m.dir=1;
   const want=Math.max(0,(this.tw.length-12)*28);this.cam+=(want-this.cam)*Math.min(1,dt*5);
   for(const f of this.falls){f.vy+=900*dt;f.y+=f.vy*dt;}this.falls=this.falls.filter(f=>f.y<700+this.cam);this.perf=Math.max(0,this.perf-dt);},
 draw(c){const g=c.createLinearGradient(0,0,0,560);const h=(this.tw.length*7)%360;g.addColorStop(0,`hsl(${h},70%,92%)`);g.addColorStop(1,`hsl(${(h+40)%360},60%,82%)`);c.fillStyle=g;c.fillRect(0,0,360,560);
   c.save();c.translate(0,this.cam);
   this.tw.forEach((b,i)=>box(c,b.x,this.yOf(i),b.w,26,4,`hsl(${(i*12)%360},65%,60%)`));
   if(state!=='over')box(c,this.mv.x,this.yOf(this.tw.length),this.mv.w,26,4,`hsl(${(this.tw.length*12)%360},65%,60%)`);
   for(const f of this.falls)box(c,f.x,f.y,f.w,26,4,'rgba(120,120,120,.6)');c.restore();
   T(c,String(this.tw.length-1),180,60,48,'#fff','center',6);if(this.perf)T(c,'PERFECT!',180,110,22,UI.purple);}},

/* ---------- フルーツキャッチ ---------- */
{id:'catch',name:'フルーツキャッチ',emoji:'🧺',tag:'カジュアル',color:['#ffd6a5','#fb8500'],
 desc:'落ちてくるフルーツをカゴでキャッチ！ 爆弾はよけよう。60秒勝負。',
 help:'マウス / ドラッグ / ←→ でカゴを動かす',
 w:800,h:450,
 F:[['🍎',10],['🍊',10],['🍇',20],['🍌',15],['🍓',25],['⭐',50]],
 reset(api){this.api=api;this.x=400;this.time=60;this.it=[];this.spT=0;this.lives=3;this.L=this.R=false;this.fx=[];},
 key(c,d){if(c==='ArrowLeft'||c==='KeyA')this.L=d;if(c==='ArrowRight'||c==='KeyD')this.R=d;},
 pointer(t,x){if(t!=='up')this.x=clamp(x,40,760);},
 update(dt){this.time-=dt;if(this.time<=0){this.time=0;return this.api.over('タイムアップ！');}
   if(this.L)this.x-=380*dt;if(this.R)this.x+=520*dt;this.x=clamp(this.x,40,760);
   this.spT-=dt;if(this.spT<=0){this.spT=rnd(.22,.5)*(.5+this.time/120);const bomb=Math.random()<.18;const f=bomb?['💣',0]:this.F[Math.random()<.05?5:ri(0,4)];this.it.push({x:rnd(20,780),y:-20,vy:rnd(140,220)+(60-this.time)*3,e:f[0],p:f[1],bomb});}
   for(const o of this.it){o.y+=o.vy*dt;if(o.y>380&&o.y<410&&Math.abs(o.x-this.x)<42&&!o.got){o.got=true;if(o.bomb){this.lives--;this.fx.push({x:o.x,y:370,t:.8,s:'💥'});if(this.lives<=0)return this.api.over('爆弾にやられた…');}else{this.api.addScore(o.p);this.fx.push({x:o.x,y:370,t:.8,s:'+'+o.p});}}}
   this.it=this.it.filter(o=>!o.got&&o.y<470);for(const f of this.fx){f.t-=dt;f.y-=50*dt;}this.fx=this.fx.filter(f=>f.t>0);},
 draw(c){bg(c,800,450,'#e8f6ff');c.fillStyle='#bde0a8';c.fillRect(0,420,800,30);
   box(c,20,14,760*this.time/60,8,4,this.time<10?UI.red:UI.orange);T(c,'♥'.repeat(Math.max(0,this.lives)),20,40,16,UI.red,'left');T(c,`${Math.ceil(this.time)}秒`,780,40,15,UI.sub,'right');
   for(const o of this.it)T(c,o.e,o.x,o.y,32,UI.ink);
   c.fillStyle='#b5651d';c.beginPath();c.moveTo(this.x-44,382);c.lineTo(this.x+44,382);c.lineTo(this.x+34,418);c.lineTo(this.x-34,418);c.fill();c.strokeStyle='#7f4510';c.lineWidth=2;for(let k=-30;k<=30;k+=12)line(c,this.x+k,386,this.x+k*.8,416,'#8b5a2b',2);
   for(const f of this.fx){c.globalAlpha=Math.min(1,f.t*2);T(c,f.s,f.x,f.y,22,UI.orange,'center',4);}c.globalAlpha=1;}},

/* ---------- 弾幕サバイバル ---------- */
{id:'bullet',name:'弾幕サバイバル',emoji:'💫',tag:'シューティング',color:['#f4acb7','#6d597a'],
 desc:'中央から放たれる弾幕を、小さな当たり判定でひたすらよけ続けよう。何秒生き残れる？',
 help:'ドラッグ（指をずらして操作）/ 矢印キー で移動。Shift で低速移動',
 w:800,h:450,
 reset(api){this.api=api;this.p={x:400,y:380};this.b=[];this.t=0;this.pat=0;this.patT=0;this.emA=0;this.K={};this.drag=null;},
 key(c,d){this.K[c]=d;},
 pointer(t,x,y){if(t==='down')this.drag={x,y,px:this.p.x,py:this.p.y};else if(t==='move'&&this.drag){this.p.x=clamp(this.drag.px+(x-this.drag.x),8,792);this.p.y=clamp(this.drag.py+(y-this.drag.y),8,442);}else if(t==='up')this.drag=null;},
 shoot(a,s,col){this.b.push({x:400,y:130,vx:Math.cos(a)*s,vy:Math.sin(a)*s,c:col||'#ff5e9c'});},
 update(dt){this.t+=dt;this.api.setScore(Math.floor(this.t*10));const K=this.K,sp=(K.ShiftLeft||K.ShiftRight?110:240)*dt;
   if(K.ArrowLeft||K.KeyA)this.p.x-=sp;if(K.ArrowRight||K.KeyD)this.p.x+=sp;if(K.ArrowUp||K.KeyW)this.p.y-=sp;if(K.ArrowDown||K.KeyS)this.p.y+=sp;this.p.x=clamp(this.p.x,8,792);this.p.y=clamp(this.p.y,8,442);
   const lv=1+this.t/20;this.patT-=dt;if(this.patT<=0){this.pat=(this.pat+1)%4;this.patT=5;}this.emA+=dt;
   this.cd=(this.cd||0)-dt;if(this.cd<=0){
     if(this.pat===0){this.cd=.09/lv;this.shoot(this.t*3,110*lv);this.shoot(this.t*3+Math.PI,110*lv);}
     else if(this.pat===1){this.cd=.8/lv;const n=14+Math.floor(lv*4),o=rnd(0,1);for(let k=0;k<n;k++)this.shoot(o+k/n*Math.PI*2,95*lv,'#5ec8ff');}
     else if(this.pat===2){this.cd=.35/lv;const a=Math.atan2(this.p.y-130,this.p.x-400);for(let k=-2;k<=2;k++)this.shoot(a+k*.18,150*lv,'#ffb84d');}
     else{this.cd=.12/lv;this.shoot(Math.sin(this.t*2)*1.2+Math.PI/2,130*lv,'#9b5de5');this.shoot(-Math.sin(this.t*2)*1.2+Math.PI/2,130*lv,'#9b5de5');}}
   for(const b of this.b){b.x+=b.vx*dt;b.y+=b.vy*dt;if(dist(b.x,b.y,this.p.x,this.p.y)<6)return this.api.over(`${this.t.toFixed(1)}秒 生き残った`);}
   this.b=this.b.filter(b=>b.x>-10&&b.x<810&&b.y>-10&&b.y<460);},
 draw(c){bg(c,800,450,'#14121f');circle(c,400,130,18+Math.sin(this.t*6)*3,'#3a2f55');circle(c,400,130,10,'#c8b6ff');
   for(const b of this.b){circle(c,b.x,b.y,5,b.c);circle(c,b.x,b.y,2.5,'#fff');}
   circle(c,this.p.x,this.p.y,9,'rgba(126,249,255,.25)');circle(c,this.p.x,this.p.y,3.5,'#7ef9ff');
   T(c,`${this.t.toFixed(1)}秒`,788,20,16,'#fff','right');}},

/* ---------- レーンレーサー ---------- */
{id:'lane',name:'レーンレーサー',emoji:'🏎️',tag:'アクション',color:['#90e0ef','#0077b6'],
 desc:'3車線の道路を走り、前の車をよけながらコインを集めよう。どんどん速くなる！',
 help:'←→ / 画面の左右をタップで車線変更',
 w:360,h:560,keep:true /* 縦長がちょうどいいゲーム */,
 pad:[['←','ArrowLeft'],['→','ArrowRight']],
 reset(api){this.api=api;this.lane=1;this.x=180;this.sp=300;this.d=0;this.o=[];this.spT=1;this.coins=0;this.road=0;},
 lx(l){return 70+l*110;},
 key(c,d){if(!d)return;if(c==='ArrowLeft'||c==='KeyA')this.lane=Math.max(0,this.lane-1);if(c==='ArrowRight'||c==='KeyD')this.lane=Math.min(2,this.lane+1);},
 pointer(t,x){if(t!=='down')return;if(x<180)this.lane=Math.max(0,this.lane-1);else this.lane=Math.min(2,this.lane+1);},
 update(dt){this.sp=Math.min(800,this.sp+10*dt);this.d+=this.sp*dt;this.road=(this.road+this.sp*dt)%60;this.x+=(this.lx(this.lane)-this.x)*Math.min(1,dt*14);
   this.api.setScore(Math.floor(this.d/50)+this.coins*10);
   this.spT-=dt;if(this.spT<=0){this.spT=rnd(.45,.9)*(300/this.sp)*1.6;const free=[0,1,2];const block=ri(0,2);this.o.push({l:block,y:-80,coin:false,col:PAL[ri(1,7)]});
     if(Math.random()<.35){const l=free.filter(v=>v!==block)[ri(0,1)];this.o.push({l,y:-80,coin:true});}}
   for(const o of this.o){o.y+=this.sp*(o.coin?1:.55)*dt;if(o.y>440&&o.y<520&&Math.abs(this.lx(o.l)-this.x)<40){if(o.coin){o.got=true;this.coins++;}else return this.api.over();}}
   this.o=this.o.filter(o=>!o.got&&o.y<620);},
 car(c,x,y,col,me){box(c,x-24,y-38,48,76,12,col);box(c,x-18,y+(me?-24:6),36,20,6,'rgba(30,40,60,.75)');c.fillStyle=me?'#fff8b0':'#ff5e5e';c.fillRect(x-20,y+(me?-38:32),10,5);c.fillRect(x+10,y+(me?-38:32),10,5);},
 draw(c){bg(c,360,560,'#3d4250');c.fillStyle='#5aa469';c.fillRect(0,0,14,560);c.fillRect(346,0,14,560);
   for(let k=1;k<3;k++)for(let y=-60+this.road;y<560;y+=60){c.fillStyle='rgba(255,255,255,.7)';c.fillRect(15+k*110-3,y,6,30);}
   for(const o of this.o){if(o.coin){circle(c,this.lx(o.l),o.y,14,UI.yellow,'#c98a00',3);T(c,'¥',this.lx(o.l),o.y+1,14,'#a86f00');}else this.car(c,this.lx(o.l),o.y,o.col,false);}
   this.car(c,this.x,470,UI.red,true);
   T(c,`${Math.floor(this.sp/3)} km/h`,20,22,14,'#fff','left');T(c,`🪙${this.coins}`,340,22,15,'#fff','right');}},

/* ---------- 月面着陸 ---------- */
{id:'lander',name:'月面着陸',emoji:'🚀',tag:'アクション',color:['#d9d9d9','#495057'],
 desc:'燃料に気をつけながら逆噴射で速度を落とし、光る着陸地点にそっと降りよう。',
 help:'↑ で噴射、←→ で傾ける。ゆっくり・まっすぐ着陸地点へ',
 w:746,h:420,
 pad:[['↺','ArrowLeft'],['噴射','ArrowUp'],['↻','ArrowRight']],
 reset(api){this.api=api;this.lv=0;this.newLevel();},
 newLevel(){this.s={x:rnd(80,666),y:40,vx:rnd(-30,30),vy:0,a:0};this.fuel=100;this.K=this.K||{};this.res=null;this.t=0;this.padY=null;
   const pw=Math.max(50,110-this.lv*15);this.padX=rnd(40,706-pw);this.padW=pw;this.ground=[];let y=rnd(320,380);
   for(let x=0;x<=752;x+=16){if(x>=this.padX&&x<=this.padX+pw)y=this.padY=this.padY||y;else{y=clamp(y+rnd(-26,26),260,400);}this.ground.push({x,y:(x>=this.padX&&x<=this.padX+pw)?this.padY:y});}
   const py=this.ground.find(g=>g.x>=this.padX).y;this.padY=py;this.ground.forEach(g=>{if(g.x>=this.padX-1&&g.x<=this.padX+pw+1)g.y=py;});},
 gy(x){const i=clamp(Math.floor(x/16),0,this.ground.length-2),a=this.ground[i],b=this.ground[i+1];return a.y+(b.y-a.y)*((x-a.x)/16);},
 key(c,d){this.K[c]=d;},
 update(dt){const s=this.s,K=this.K;if(this.res){this.t-=dt;if(this.t<=0){if(this.res==='ok'){this.lv++;this.newLevel();}else return this.api.over('墜落…');}return;}
   if(K.ArrowLeft||K.KeyA)s.a-=2*dt;if(K.ArrowRight||K.KeyD)s.a+=2*dt;s.a=clamp(s.a,-1.2,1.2);
   this.th=(K.ArrowUp||K.KeyW||K.Space)&&this.fuel>0;if(this.th){s.vx+=Math.sin(s.a)*80*dt;s.vy-=Math.cos(s.a)*80*dt;this.fuel=Math.max(0,this.fuel-8*dt);}
   s.vy+=32*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.y<10){s.y=10;s.vy=Math.max(0,s.vy);}if(s.x<0||s.x>746)s.vx*=-.5,s.x=clamp(s.x,0,746);
   if(s.y+14>=this.gy(s.x)){const onPad=s.x-10>=this.padX&&s.x+10<=this.padX+this.padW,soft=s.vy<45&&Math.abs(s.vx)<25&&Math.abs(s.a)<.25;
     if(onPad&&soft){this.res='ok';this.t=1.5;this.api.addScore(100+Math.floor(this.fuel)*2+this.lv*50);s.y=this.padY-14;}else{this.res='crash';this.t=1.5;}}},
 draw(c){bg(c,746,420,'#0b0b18');for(let i=0;i<90;i++){c.fillStyle='rgba(255,255,255,.5)';c.fillRect((i*131)%746,(i*71)%260,1.5,1.5);}
   c.fillStyle='#8d8d93';c.beginPath();c.moveTo(0,420);this.ground.forEach(g=>c.lineTo(g.x,g.y));c.lineTo(752,420);c.fill();
   line(c,this.padX,this.padY,this.padX+this.padW,this.padY,'#5dff9d',4);
   const s=this.s;c.save();c.translate(s.x,s.y);c.rotate(s.a);
   if(this.th&&!this.res&&state==='play'){c.fillStyle=Math.random()<.5?'#ffb84d':'#ff5e5e';c.beginPath();c.moveTo(-6,10);c.lineTo(0,22+rnd(0,10));c.lineTo(6,10);c.fill();}
   if(this.res==='crash')T(c,'💥',0,0,40,'#fff');else{box(c,-10,-12,20,20,8,'#e9ecef');box(c,-5,-8,10,8,3,'#4dabf7');line(c,-10,6,-15,14,'#ccc',2);line(c,10,6,15,14,'#ccc',2);}c.restore();
   T(c,`燃料`,14,20,13,'#fff','left');box(c,52,13,120,12,6,'#333');box(c,52,13,120*this.fuel/100,12,6,this.fuel<25?UI.red:UI.green);
   const ok=v=>v?'#5dff9d':'#ff8080';T(c,`縦 ${Math.round(s.vy)}`,200,20,13,ok(s.vy<45),'left');T(c,`横 ${Math.round(s.vx)}`,280,20,13,ok(Math.abs(s.vx)<25),'left');T(c,`角度 ${Math.round(s.a*57)}°`,350,20,13,ok(Math.abs(s.a)<.25),'left');
   T(c,`ステージ ${this.lv+1}`,373,46,13,'#aaa');if(this.res==='ok')T(c,'着陸成功！',373,140,26,'#5dff9d');}}
);
