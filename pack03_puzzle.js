'use strict';
/* パック3：パズル 10本 */
addGames(

/* ---------- ウォーターソート ---------- */
{id:'water',name:'ウォーターソート',emoji:'🧪',tag:'パズル',color:['#8fd3ff','#7b61ff'],
 desc:'試験管の色水をほかの試験管に注いで、1本に1色ずつそろえよう。',
 help:'注ぐ試験管をクリック → 注ぎ先をクリック。上の色が同じか空なら注げる',
 w:420,h:420,CAP:4,
 COL:['#ff6b6b','#4dabf7','#51cf66','#fcc419','#cc5de8'],
 reset(api){this.api=api;const n=5,u=[];for(let c=0;c<n;c++)for(let k=0;k<4;k++)u.push(c);
   for(;;){shuffle(u);this.t=[];for(let i=0;i<n;i++)this.t.push(u.slice(i*4,i*4+4));this.t.push([],[]);if(!this.done())break;}
   this.sel=-1;this.moves=0;this.hist=[];this.fin=false;this.endT=0;},
 done(){return this.t.every(a=>!a.length||(a.length===4&&a.every(v=>v===a[0])));},
 pour(a,b){const A=this.t[a],B=this.t[b];if(!A.length||B.length>=4)return false;const top=A[A.length-1];if(B.length&&B[B.length-1]!==top)return false;
   this.hist.push(this.t.map(x=>x.slice()));while(A.length&&A[A.length-1]===top&&B.length<4)B.push(A.pop());this.moves++;return true;},
 tx(i){return 30+i*56;},
 pointer(t,x,y){if(t!=='down'||this.fin)return;
   if(inR(x,y,30,350,110,40)){if(this.hist.length){this.t=this.hist.pop();this.moves++;}this.sel=-1;return;}
   if(inR(x,y,280,350,110,40)){this.reset(this.api);return;}
   for(let i=0;i<this.t.length;i++)if(inR(x,y,this.tx(i),70,44,220)){
     if(this.sel<0){if(this.t[i].length)this.sel=i;}else if(this.sel===i)this.sel=-1;else{this.pour(this.sel,i);this.sel=-1;if(this.done()){this.fin=true;this.endT=.7;}}return;}
   this.sel=-1;},
 update(dt){if(this.fin&&this.endT>0){this.endT-=dt;if(this.endT<=0){this.api.setScore(Math.max(10,200-this.moves*3));this.api.win(`そろった！ ${this.moves}手`);}}},
 draw(c){bg(c,420,420);T(c,`手数 ${this.moves}`,210,34,18,UI.ink);
   this.t.forEach((a,i)=>{const x=this.tx(i),lift=this.sel===i?-16:0,y=80+lift;
     c.save();rr(c,x,y,44,200,20);c.clip();c.fillStyle='#f4f8fb';c.fillRect(x,y,44,200);
     a.forEach((v,k)=>{c.fillStyle=this.COL[v];c.fillRect(x,y+200-(k+1)*46-4,44,46);});c.restore();
     box(c,x,y,44,200,20,null,this.sel===i?UI.blue:'#a9b4c0',2.5);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x+7,y+10,5,170);
     const full=a.length===4&&a.every(v=>v===a[0]);if(full)T(c,'✓',x+22,y+222,16,UI.green);});
   btn(c,30,350,110,40,'1手もどす',{on:this.hist.length>0,size:15});btn(c,280,350,110,40,'新しい問題',{size:15});}},

/* ---------- アイススライド ---------- */
{id:'ice',name:'アイススライド',emoji:'🧊',tag:'パズル',color:['#b3ecff','#3aa0d8'],
 desc:'氷の上はすべって止まれない！ 岩にぶつかって止まりながら、旗のマスにぴったり止まろう。全5ステージ。',
 help:'矢印キー / WASD / スワイプですべる',
 w:400,h:470,N:9,CS:40,OX:20,OY:70,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']],
 reset(api){this.api=api;this.st=0;this.gen();},
 slideTo(rock,p,dx,dy){let x=p%9,y=Math.floor(p/9);for(;;){const a=x+dx,b=y+dy;if(a<0||b<0||a>=9||b>=9||rock.has(b*9+a))break;x=a;y=b;}return y*9+x;},
 gen(){for(;;){const rock=new Set(),nr=10+this.st*2;while(rock.size<nr)rock.add(ri(0,80));let s;do{s=ri(0,80);}while(rock.has(s));
   const d=new Map([[s,0]]),q=[s];while(q.length){const p=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const e=this.slideTo(rock,p,dx,dy);if(e!==p&&!d.has(e)){d.set(e,d.get(p)+1);q.push(e);}}}
   let far=s,fd=0;for(const[k,v]of d)if(v>fd){fd=v;far=k;}
   if(fd>=3+Math.min(this.st,3)){this.rock=rock;this.p=s;this.goal=far;this.min=fd;this.moves=0;this.anim=null;this.clearT=0;return;}}},
 move(dx,dy){if(this.anim||this.clearT)return;const e=this.slideTo(this.rock,this.p,dx,dy);if(e===this.p)return;this.moves++;this.anim={a:this.p,b:e,t:0,len:Math.abs(e%9-this.p%9)+Math.abs(Math.floor(e/9)-Math.floor(this.p/9))};},
 key(c,d){if(!d)return;const m={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1]}[c];if(m)this.move(m[0],m[1]);},
 pointer(t,x,y){if(t==='down'){this.sx=x;this.sy=y;}else if(t==='up'&&this.sx!=null){const dx=x-this.sx,dy=y-this.sy;this.sx=null;if(Math.hypot(dx,dy)>20)Math.abs(dx)>Math.abs(dy)?this.move(Math.sign(dx),0):this.move(0,Math.sign(dy));}},
 update(dt){if(this.anim){this.anim.t+=dt*16/this.anim.len;if(this.anim.t>=1){this.p=this.anim.b;this.anim=null;if(this.p===this.goal)this.clearT=.9;}}
   if(this.clearT){this.clearT-=dt;if(this.clearT<=0){this.clearT=0;this.api.addScore(Math.max(5,30-(this.moves-this.min)*3));this.st++;if(this.st>=5)return this.api.win('全ステージクリア！');this.gen();}}},
 draw(c){bg(c,400,470);const{CS,OX,OY}=this;T(c,`ステージ ${this.st+1} / 5`,20,30,17,UI.ink,'left');T(c,`手数 ${this.moves}（最短 ${this.min}）`,380,30,14,UI.sub,'right');
   box(c,OX-4,OY-4,9*CS+8,9*CS+8,10,'#d6effa');
   for(let i=0;i<81;i++){const x=OX+(i%9)*CS,y=OY+Math.floor(i/9)*CS;c.fillStyle=(i%9+Math.floor(i/9))%2?'#e9f7fd':'#f3fbfe';c.fillRect(x,y,CS,CS);
     if(this.rock.has(i)){circle(c,x+CS/2,y+CS/2+2,CS*.42,'#7d7a73');circle(c,x+CS/2-4,y+CS/2-3,CS*.38,'#a19d94');}
     if(i===this.goal){line(c,x+14,y+8,x+14,y+34,UI.ink,2.5);c.fillStyle=UI.red;c.beginPath();c.moveTo(x+15,y+8);c.lineTo(x+32,y+14);c.lineTo(x+15,y+21);c.fill();}}
   let px=this.p%9,py=Math.floor(this.p/9);if(this.anim){const a=this.anim,t=Math.min(1,a.t);px=a.a%9+(a.b%9-a.a%9)*t;py=Math.floor(a.a/9)+(Math.floor(a.b/9)-Math.floor(a.a/9))*t;}
   const X=OX+(px+.5)*CS,Y=OY+(py+.5)*CS;circle(c,X,Y,CS*.36,UI.blue);circle(c,X-5,Y-4,3,'#fff');circle(c,X+5,Y-4,3,'#fff');
   if(this.clearT)T(c,'ゴール！',200,452,20,UI.green);}},

/* ---------- レーザーミラー ---------- */
{id:'laser',name:'レーザーミラー',emoji:'🔦',tag:'パズル',color:['#ff8fa3','#c9184a'],
 desc:'鏡の向きを変えて、レーザーを的に当てよう。全5ステージ。',
 help:'鏡をクリック / タップで向きを切りかえ（／ ⇔ ＼）',
 w:420,h:480,N:7,CS:52,OX:46,OY:70,
 reset(api){this.api=api;this.st=0;this.gen();},
 gen(){const N=this.N;
   for(;;){const mir=new Map(),pc=new Set();let x=0,y=ri(0,N-1),dx=1,dy=0,ok=true;const sr=y;pc.add(x+','+y);const nm=2+Math.min(this.st,3)+ri(0,1);
     for(let m=0;m<nm&&ok;m++){const steps=ri(m===0?0:1,3);for(let s=0;s<steps;s++){x+=dx;y+=dy;if(x<0||y<0||x>=N||y>=N||mir.has(x+','+y)){ok=false;break;}pc.add(x+','+y);}
       if(!ok||mir.has(x+','+y))break;const nd=Math.random()<.5?[dy,dx]:[-dy,-dx];mir.set(x+','+y,(-dy===nd[0]&&-dx===nd[1])?'/':'\\');dx=nd[0];dy=nd[1];}
     if(!ok||mir.size<nm)continue;let tx=x,ty=y,good=true;for(let s=ri(1,3);s>0;s--){tx+=dx;ty+=dy;if(tx<0||ty<0||tx>=N||ty>=N||mir.has(tx+','+ty)){good=false;break;}}
     if(!good)continue;
     this.sr=sr;this.tx=tx;this.ty=ty;this.mir=mir;
     for(let k=0;k<2+this.st;k++){const a=ri(0,N-1),b=ri(0,N-1),key=a+','+b;if(!pc.has(key)&&!mir.has(key)&&!(a===tx&&b===ty))mir.set(key,Math.random()<.5?'/':'\\');}
     for(const k of mir.keys())if(Math.random()<.7)mir.set(k,mir.get(k)==='/'?'\\':'/');
     if(this.trace().hit)continue;this.moves=0;this.clearT=0;return;}},
 trace(){const N=this.N;let x=0,y=this.sr,dx=1,dy=0;const pts=[];for(let s=0;s<120;s++){if(x<0||y<0||x>=N||y>=N)return{pts,hit:false,dx,dy};pts.push([x,y]);
   if(x===this.tx&&y===this.ty)return{pts,hit:true};const m=this.mir.get(x+','+y);if(m)[dx,dy]=m==='/'?[-dy,-dx]:[dy,dx];x+=dx;y+=dy;}return{pts,hit:false,dx,dy};},
 pointer(t,x,y){if(t!=='down'||this.clearT)return;const c=cellAt(x,y,this.OX,this.OY,this.CS,this.N,this.N);if(!c)return;const k=c.x+','+c.y;if(!this.mir.has(k))return;
   this.mir.set(k,this.mir.get(k)==='/'?'\\':'/');this.moves++;if(this.trace().hit)this.clearT=1;},
 update(dt){if(this.clearT){this.clearT-=dt;if(this.clearT<=0){this.clearT=0;this.api.addScore(Math.max(5,40-this.moves*2));this.st++;if(this.st>=5)return this.api.win('全ステージクリア！');this.gen();}}},
 draw(c){bg(c,420,480);const{N,CS,OX,OY}=this;T(c,`ステージ ${this.st+1} / 5`,20,30,17,UI.ink,'left');T(c,`切りかえ ${this.moves}回`,400,30,14,UI.sub,'right');
   box(c,OX-4,OY-4,N*CS+8,N*CS+8,10,'#22252f');
   for(let i=0;i<N*N;i++){const x=OX+(i%N)*CS,y=OY+Math.floor(i/N)*CS;c.fillStyle=(i%N+Math.floor(i/N))%2?'#2b2f3b':'#30343f';c.fillRect(x,y,CS,CS);}
   const cx=a=>OX+(a+.5)*CS,cy=b=>OY+(b+.5)*CS;
   box(c,OX-30,cy(this.sr)-12,24,24,5,'#ff4d6d');
   circle(c,cx(this.tx),cy(this.ty),CS*.34,'#fff');circle(c,cx(this.tx),cy(this.ty),CS*.24,'#ff4d6d');circle(c,cx(this.tx),cy(this.ty),CS*.12,'#fff');
   const tr=this.trace();c.beginPath();c.moveTo(OX-8,cy(this.sr));for(const[a,b]of tr.pts)c.lineTo(cx(a),cy(b));
   if(!tr.hit&&tr.pts.length){const[a,b]=tr.pts[tr.pts.length-1];c.lineTo(cx(a)+tr.dx*CS*.6,cy(b)+tr.dy*CS*.6);}
   c.strokeStyle=tr.hit?'#5dff9d':'#ff4d6d';c.lineWidth=4;c.shadowColor=c.strokeStyle;c.shadowBlur=10;c.stroke();c.shadowBlur=0;
   for(const[k,m]of this.mir){const[a,b]=k.split(',').map(Number),X=cx(a),Y=cy(b),r=CS*.36;line(c,m==='/'?X-r:X-r,m==='/'?Y+r:Y-r,X+r,m==='/'?Y-r:Y+r,'#cfe8ff',6);}
   if(this.clearT)T(c,'命中！',210,452,22,UI.green);}},

/* ---------- 車脱出パズル ---------- */
{id:'parking',name:'車脱出パズル',emoji:'🚗',tag:'パズル',color:['#ffb3b3','#d63c3c'],
 desc:'ほかの車をずらして道をあけ、赤い車を右の出口から脱出させよう。',
 help:'車をドラッグして前後に動かす',
 w:400,h:470,CS:56,OX:32,OY:80,
 reset(api){this.api=api;let best=null;
   for(let tr=0;tr<300;tr++){if(best&&(best.m>=7||tr>=40))break;const v=[{x:ri(0,1),y:2,len:2,hz:true,red:true}];
     for(let k=0;k<40&&v.length<11;k++){const hz=Math.random()<.5,len=Math.random()<.25?3:2,x=ri(0,hz?6-len:5),y=ri(0,hz?5:6-len);if(hz&&y===2)continue;
       const cells=[];for(let i=0;i<len;i++)cells.push(hz?[x+i,y]:[x,y+i]);const occ=this.occ(v);if(cells.some(([a,b])=>occ[b*6+a]))continue;v.push({x,y,len,hz});}
     const m=this.solve(v);if(m>0&&(!best||m>best.m))best={v,m};}
   this.v=best.v;this.min=best.m;this.moves=0;this.drag=null;this.clearT=0;this.exitX=0;},
 occ(v,skip){const o=Array(36).fill(0);v.forEach((c,i)=>{if(i===skip)return;for(let k=0;k<c.len;k++)o[(c.hz?c.y:c.y+k)*6+(c.hz?c.x+k:c.x)]=i+1;});return o;},
 /* 幅優先探索で最短手数を求める（状態＝各車の可動軸上の位置） */
 solve(v0){const n=v0.length,L=v0.map(c=>c.len),H=v0.map(c=>c.hz),F=v0.map(c=>c.hz?c.y:c.x),start=v0.map(c=>c.hz?c.x:c.y);
   const seen=new Set([start.join()]);let q=[start],d=0;
   while(q.length&&seen.size<8000){const nq=[];for(const s of q){if(s[0]===4)return d;const o=new Int8Array(36);
       for(let i=0;i<n;i++)for(let k=0;k<L[i];k++)o[H[i]?F[i]*6+s[i]+k:(s[i]+k)*6+F[i]]=i+1;
       for(let i=0;i<n;i++)for(const dir of[-1,1])for(let k=1;;k++){const np=s[i]+dir*k,lead=dir>0?np+L[i]-1:np;if(lead<0||lead>5)break;
         const cell=H[i]?F[i]*6+lead:lead*6+F[i];if(o[cell]&&o[cell]!==i+1)break;const ns=s.slice();ns[i]=np;const key=ns.join();if(!seen.has(key)){seen.add(key);nq.push(ns);}}}
     q=nq;d++;}return -1;},
 range(i){const c=this.v[i],o=this.occ(this.v,i);let lo=0,hi=0;
   if(c.hz){while(c.x+lo-1>=0&&!o[c.y*6+c.x+lo-1])lo--;while(c.x+c.len+hi<=5&&!o[c.y*6+c.x+c.len+hi])hi++;}
   else{while(c.y+lo-1>=0&&!o[(c.y+lo-1)*6+c.x])lo--;while(c.y+c.len+hi<=5&&!o[(c.y+c.len+hi)*6+c.x])hi++;}return[lo,hi];},
 pointer(t,x,y){if(this.clearT)return;const{CS,OX,OY}=this;
   if(t==='down'){const cl=cellAt(x,y,OX,OY,CS,6,6);if(!cl)return;const o=this.occ(this.v);const id=o[cl.y*6+cl.x];if(!id)return;const r=this.range(id-1);this.drag={i:id-1,sx:x,sy:y,lo:r[0],hi:r[1],off:0};}
   else if(t==='move'&&this.drag){const d=this.drag,c=this.v[d.i];d.off=clamp((c.hz?x-d.sx:y-d.sy)/CS,d.lo,d.hi);}
   else if(t==='up'&&this.drag){const d=this.drag,c=this.v[d.i],s=Math.round(d.off);if(s){if(c.hz)c.x+=s;else c.y+=s;this.moves++;}this.drag=null;if(this.v[0].x===4)this.clearT=1.2;}},
 update(dt){if(this.clearT){this.clearT-=dt;this.exitX+=dt*400;if(this.clearT<=0){this.api.setScore(Math.max(10,100-(this.moves-this.min)*5));this.api.win(`脱出成功！ ${this.moves}手（最短 ${this.min}手）`);}}},
 draw(c){bg(c,400,470);const{CS,OX,OY}=this;T(c,`手数 ${this.moves}`,24,36,17,UI.ink,'left');T(c,`最短 ${this.min}手`,376,36,14,UI.sub,'right');
   box(c,OX-8,OY-8,6*CS+16,6*CS+16,14,'#8d8a80');box(c,OX,OY,6*CS,6*CS,6,'#dcd8cc');c.fillStyle='#dcd8cc';c.fillRect(OX+6*CS,OY+2*CS+4,10,CS-8);
   for(let i=1;i<6;i++){line(c,OX+i*CS,OY,OX+i*CS,OY+6*CS,'rgba(0,0,0,.06)',1);line(c,OX,OY+i*CS,OX+6*CS,OY+i*CS,'rgba(0,0,0,.06)',1);}
   T(c,'出口 →',OX+6*CS-4,OY+2*CS-10,12,UI.red,'right');
   this.v.forEach((v,i)=>{let x=OX+v.x*CS,y=OY+v.y*CS;if(this.drag&&this.drag.i===i){if(v.hz)x+=this.drag.off*CS;else y+=this.drag.off*CS;}if(v.red&&this.clearT)x+=this.exitX;
     const w=v.hz?v.len*CS:CS,h=v.hz?CS:v.len*CS,col=v.red?UI.red:PAL[1+i%7];
     box(c,x+4,y+4,w-8,h-8,10,col);c.fillStyle='rgba(255,255,255,.4)';if(v.hz)c.fillRect(x+w-24,y+12,8,h-24);else c.fillRect(x+12,y+h-24,w-24,8);});}},

/* ---------- カラーフラッド ---------- */
{id:'flood',name:'カラーフラッド',emoji:'🌈',tag:'パズル',color:['#ffd166','#06d6a0'],
 desc:'左上から色をぬり広げて、22手以内に全部を1色にしよう。',
 help:'右の色ボタンをクリック / タップ（1〜6キーでもOK）',
 w:800,h:450,N:12,CS:30,
 COL:['#ef476f','#ffd166','#06d6a0','#118ab2','#9b5de5','#f78c6b'],
 reset(api){this.api=api;this.g=[...Array(144)].map(()=>ri(0,5));this.moves=0;this.lim=22;this.fin=false;this.endT=0;},
 region(){const N=this.N,col=this.g[0],s=new Set([0]),st=[0];while(st.length){const i=st.pop(),x=i%N,y=Math.floor(i/N);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,j=b*N+a;if(a<0||b<0||a>=N||b>=N||s.has(j)||this.g[j]!==col)continue;s.add(j);st.push(j);}}return s;},
 pick(k){if(this.fin||k===this.g[0])return;for(const i of this.region())this.g[i]=k;this.moves++;
   if(this.g.every(v=>v===this.g[0])){this.fin=true;this.win=true;this.endT=.6;}else if(this.moves>=this.lim){this.fin=true;this.win=false;this.endT=.6;}},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-6])$/);if(m)this.pick(+m[2]-1);},
 pointer(t,x,y){if(t!=='down')return;for(let k=0;k<6;k++){const p=this.bp(k);if(dist(x,y,p[0],p[1])<38)this.pick(k);}},
 bp(k){return[540+(k%2)*120,170+Math.floor(k/2)*90];},
 update(dt){if(this.fin&&this.endT>0){this.endT-=dt;if(this.endT<=0){if(this.win){this.api.setScore((this.lim-this.moves+1)*20);return this.api.win(`全部ぬれた！ ${this.moves}手`);}
   this.api.setScore(this.region().size);return this.api.over('手数オーバー…');}}},
 draw(c){bg(c,800,450);T(c,`${this.moves} / ${this.lim} 手`,600,80,26,this.lim-this.moves<=3?UI.red:UI.ink);
   for(let i=0;i<144;i++){c.fillStyle=this.COL[this.g[i]];c.fillRect(50+(i%12)*this.CS,45+Math.floor(i/12)*this.CS,this.CS,this.CS);}
   box(c,50,45,360,360,0,null,'#fff',2);
   for(let k=0;k<6;k++){const[x,y]=this.bp(k);circle(c,x,y,34,this.COL[k],k===this.g[0]?UI.ink:'#fff',3);T(c,String(k+1),x,y+1,17,'rgba(255,255,255,.9)');}
   T(c,'左上のマスから色が広がる',600,420,13,UI.sub);}},

/* ---------- ひとふで書き ---------- */
{id:'onestroke',name:'ひとふで書き',emoji:'✏️',tag:'パズル',color:['#cdb4db','#7b4fa0'],
 desc:'★のマスから指でなぞって、すべての白いマスを1回ずつ通ろう。全5ステージ。',
 help:'★からドラッグしてなぞる。戻るとやり直せる',
 w:400,h:480,
 reset(api){this.api=api;this.st=0;this.gen();},
 gen(){const sizes=[[4,4],[5,5],[5,6],[6,6],[6,7]],[W,H]=sizes[this.st];this.W=W;this.H=H;this.CS=Math.floor(Math.min(360/W,360/H));this.OX=(400-W*this.CS)/2;this.OY=70+(360-H*this.CS)/2;
   let best=[];for(let t=0;t<200;t++){const s=[ri(0,W-1),ri(0,H-1)],seen=new Set([s+'']),path=[s];
     for(;;){const[x,y]=path[path.length-1];const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[x+dx,y+dy]).filter(([a,b])=>a>=0&&b>=0&&a<W&&b<H&&!seen.has(a+','+b));
       if(!nb.length)break;const deg=p=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>{const a=p[0]+dx,b=p[1]+dy;return a>=0&&b>=0&&a<W&&b<H&&!seen.has(a+','+b);}).length;
       nb.sort((p,q)=>deg(p)-deg(q)+(Math.random()-.5)*1.2);const n=nb[0];seen.add(n+'');path.push(n);}
     if(path.length>best.length)best=path;if(best.length>=W*H*.85)break;}
   this.open=new Set(best.map(p=>p+''));this.start=best[0];this.path=[this.start];this.drag=false;this.clearT=0;},
 pointer(t,x,y){if(this.clearT)return;const cl=cellAt(x,y,this.OX,this.OY,this.CS,this.W,this.H);
   if(t==='down'){if(cl){const last=this.path[this.path.length-1];if(cl.x===last[0]&&cl.y===last[1])this.drag=true;else if(cl.x===this.start[0]&&cl.y===this.start[1]){this.path=[this.start];this.drag=true;}}return;}
   if(t==='up'){this.drag=false;return;}
   if(!this.drag||!cl)return;const k=cl.x+','+cl.y;if(!this.open.has(k))return;const P=this.path,last=P[P.length-1];
   if(P.length>1&&P[P.length-2][0]===cl.x&&P[P.length-2][1]===cl.y){P.pop();return;}
   if(Math.abs(cl.x-last[0])+Math.abs(cl.y-last[1])!==1||P.some(p=>p[0]===cl.x&&p[1]===cl.y))return;P.push([cl.x,cl.y]);
   if(P.length===this.open.size)this.clearT=1;},
 update(dt){if(this.clearT){this.clearT-=dt;if(this.clearT<=0){this.clearT=0;this.api.addScore(20*(this.st+1));this.st++;if(this.st>=5)return this.api.win('全ステージクリア！');this.gen();}}},
 draw(c){bg(c,400,480);const{W,H,CS,OX,OY}=this;T(c,`ステージ ${this.st+1} / 5`,20,30,17,UI.ink,'left');T(c,`${this.path.length} / ${this.open.size}`,380,30,15,UI.sub,'right');
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=OX+x*CS,Y=OY+y*CS;if(this.open.has(x+','+y))box(c,X+3,Y+3,CS-6,CS-6,8,'#fff','#d9d3e3',1.5);else box(c,X+3,Y+3,CS-6,CS-6,8,'#5c5470');}
   const P=this.path;c.lineCap='round';c.lineJoin='round';c.beginPath();P.forEach(([x,y],i)=>{const X=OX+(x+.5)*CS,Y=OY+(y+.5)*CS;i?c.lineTo(X,Y):c.moveTo(X,Y);});c.strokeStyle='rgba(142,78,198,.75)';c.lineWidth=CS*.36;c.stroke();c.lineCap='butt';
   T(c,'★',OX+(this.start[0]+.5)*CS,OY+(this.start[1]+.5)*CS+1,CS*.5,UI.yellow,'center',3);
   const l=P[P.length-1];if(P.length>1)circle(c,OX+(l[0]+.5)*CS,OY+(l[1]+.5)*CS,CS*.2,'#fff',UI.purple,3);
   if(this.clearT)T(c,'クリア！',200,456,20,UI.green);}},

/* ---------- 8クイーン ---------- */
{id:'queens',name:'8クイーン',emoji:'👑',tag:'パズル',color:['#ffe08a','#c99a2e'],
 desc:'たて・よこ・ななめに一直線で取り合わないように、8個のクイーンをチェス盤に置こう。',
 help:'マスをクリック / タップでクイーンを置く・取る',
 w:400,h:460,
 reset(api){this.api=api;this.q=new Set();this.time=0;this.fin=false;},
 bad(k){const[x,y]=k.split(',').map(Number);for(const o of this.q){if(o===k)continue;const[a,b]=o.split(',').map(Number);if(a===x||b===y||Math.abs(a-x)===Math.abs(b-y))return true;}return false;},
 pointer(t,x,y){if(t!=='down'||this.fin)return;const c=cellAt(x,y,20,60,45,8,8);if(!c)return;const k=c.x+','+c.y;if(this.q.has(k))this.q.delete(k);else this.q.add(k);
   if(this.q.size===8&&![...this.q].some(k=>this.bad(k))){this.fin=true;this.api.setScore(Math.max(10,300-Math.floor(this.time)));this.api.win(`完成！ ${Math.floor(this.time)}秒`);}},
 update(dt){this.time+=dt;},
 draw(c){bg(c,400,460);T(c,`クイーン ${this.q.size} / 8`,24,30,17,UI.ink,'left');T(c,`${Math.floor(this.time)}秒`,376,30,15,UI.sub,'right');
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){c.fillStyle=(x+y)%2?'#c8a97e':'#f3e6cf';c.fillRect(20+x*45,60+y*45,45,45);}
   for(const k of this.q){const[x,y]=k.split(',').map(Number),b=this.bad(k);if(b){c.fillStyle='rgba(229,72,77,.35)';c.fillRect(20+x*45,60+y*45,45,45);}T(c,'♛',42.5+x*45,84+y*45,32,b?UI.red:'#2a2a2a');}
   T(c,'赤いクイーンは他のクイーンに取られる位置',200,440,13,UI.sub);}},

/* ---------- ナイトツアー ---------- */
{id:'knight',name:'ナイトツアー',emoji:'♞',tag:'パズル',color:['#a0c4ff','#4361ee'],
 desc:'チェスのナイト（桂馬のような動き）で、6×6の全マスを1回ずつ回ろう。',
 help:'最初のマスを選んだら、光っているマスをクリック / タップして進む',
 w:400,h:470,
 reset(api){this.api=api;this.path=[];this.fin=false;},
 J:[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],
 nexts(){if(!this.path.length)return null;const[x,y]=this.path[this.path.length-1];return this.J.map(([dx,dy])=>[x+dx,y+dy]).filter(([a,b])=>a>=0&&b>=0&&a<6&&b<6&&!this.path.some(p=>p[0]===a&&p[1]===b));},
 pointer(t,x,y){if(t!=='down'||this.fin)return;if(inR(x,y,145,422,110,36)&&this.path.length){this.path.pop();return;}
   const c=cellAt(x,y,32,64,56,6,6);if(!c)return;const n=this.nexts();
   if(!n){this.path.push([c.x,c.y]);return;}if(!n.some(p=>p[0]===c.x&&p[1]===c.y))return;this.path.push([c.x,c.y]);this.api.setScore(this.path.length);
   if(this.path.length===36){this.fin=true;this.api.setScore(100);this.api.win('全マス制覇！');}
   else if(!this.nexts().length){this.fin=true;this.api.over(`行き止まり（${this.path.length}マス）`);}},
 draw(c){bg(c,400,470);T(c,`${this.path.length} / 36 マス`,200,32,18,UI.ink);
   const n=this.nexts()||[];
   for(let y=0;y<6;y++)for(let x=0;x<6;x++){const X=32+x*56,Y=64+y*56,k=this.path.findIndex(p=>p[0]===x&&p[1]===y);c.fillStyle=(x+y)%2?'#dfe7fd':'#f5f7ff';c.fillRect(X,Y,56,56);
     if(k>=0){c.fillStyle='rgba(67,97,238,.18)';c.fillRect(X,Y,56,56);T(c,String(k+1),X+28,Y+29,16,UI.blue);}
     if(n.some(p=>p[0]===x&&p[1]===y))circle(c,X+28,Y+28,14,'rgba(245,180,0,.6)');}
   if(this.path.length){const[x,y]=this.path[this.path.length-1];circle(c,60+x*56,92+y*56,22,UI.ink);T(c,'♞',60+x*56,93+y*56,28,'#fff');}
   else T(c,'好きなマスから始めよう',200,440,14,UI.sub);
   if(this.path.length)btn(c,145,422,110,36,'1手もどす',{size:14});}},

/* ---------- 迷路脱出 ---------- */
{id:'maze',name:'迷路脱出',emoji:'🌀',tag:'パズル',color:['#b9fbc0','#38a3a5'],
 desc:'毎回ちがう迷路を抜けてゴールを目指そう。3つの迷路をクリアするタイムを競う。',
 help:'矢印キー / WASD / スワイプ / 下のボタンで移動',
 w:400,h:440,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']],
 reset(api){this.api=api;this.st=0;this.time=0;this.gen();},
 gen(){const n=[9,13,17][this.st];this.n=n;this.cs=Math.floor(380/n);this.ox=(400-n*this.cs)/2;this.oy=50;
   this.wall=[...Array(n*n)].map(()=>[1,1,1,1]);const seen=new Set([0]),st=[0];
   while(st.length){const i=st[st.length-1],x=i%n,y=Math.floor(i/n);const nb=[[0,-1,0,2],[1,0,1,3],[0,1,2,0],[-1,0,3,1]].filter(([dx,dy])=>{const a=x+dx,b=y+dy;return a>=0&&b>=0&&a<n&&b<n&&!seen.has(b*n+a);});
     if(!nb.length){st.pop();continue;}const[dx,dy,w,o]=nb[ri(0,nb.length-1)],j=(y+dy)*n+x+dx;this.wall[i][w]=0;this.wall[j][o]=0;seen.add(j);st.push(j);}
   this.p=0;this.trail=new Set([0]);this.clearT=0;},
 move(d){if(this.clearT)return;const n=this.n,x=this.p%n,y=Math.floor(this.p/n);if(this.wall[this.p][d])return;const[dx,dy]=[[0,-1],[1,0],[0,1],[-1,0]][d];this.p=(y+dy)*n+x+dx;this.trail.add(this.p);
   if(this.p===n*n-1)this.clearT=.7;},
 key(c,d){if(!d)return;const m={ArrowUp:0,KeyW:0,ArrowRight:1,KeyD:1,ArrowDown:2,KeyS:2,ArrowLeft:3,KeyA:3}[c];if(m!=null)this.move(m);},
 pointer(t,x,y){if(t==='down'){this.sx=x;this.sy=y;}else if(t==='move'&&this.sx!=null){const dx=x-this.sx,dy=y-this.sy;if(Math.hypot(dx,dy)>this.cs*.8){this.move(Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?2:0));this.sx=x;this.sy=y;}}else if(t==='up')this.sx=null;},
 update(dt){if(!this.clearT)this.time+=dt;else{this.clearT-=dt;if(this.clearT<=0){this.clearT=0;this.st++;if(this.st>=3){this.api.setScore(Math.max(10,600-Math.floor(this.time*3)));return this.api.win(`脱出成功！ ${this.time.toFixed(1)}秒`);}this.gen();}}},
 draw(c){bg(c,400,440);const{n,cs,ox,oy}=this;T(c,`迷路 ${this.st+1} / 3`,20,24,16,UI.ink,'left');T(c,`${this.time.toFixed(1)}秒`,380,24,16,UI.ink,'right');
   for(const i of this.trail){c.fillStyle='rgba(56,163,165,.15)';c.fillRect(ox+(i%n)*cs,oy+Math.floor(i/n)*cs,cs,cs);}
   c.fillStyle='rgba(48,164,108,.35)';c.fillRect(ox+(n-1)*cs,oy+(n-1)*cs,cs,cs);T(c,'G',ox+(n-.5)*cs,oy+(n-.5)*cs+1,cs*.6,UI.green);
   c.strokeStyle=UI.ink;c.lineWidth=2.5;c.lineCap='round';c.beginPath();
   for(let i=0;i<n*n;i++){const x=ox+(i%n)*cs,y=oy+Math.floor(i/n)*cs,w=this.wall[i];if(w[0]){c.moveTo(x,y);c.lineTo(x+cs,y);}if(w[3]){c.moveTo(x,y);c.lineTo(x,y+cs);}if(w[1]&&i%n===n-1){c.moveTo(x+cs,y);c.lineTo(x+cs,y+cs);}if(w[2]&&Math.floor(i/n)===n-1){c.moveTo(x,y+cs);c.lineTo(x+cs,y+cs);}}
   c.stroke();c.lineCap='butt';
   circle(c,ox+(this.p%n+.5)*cs,oy+(Math.floor(this.p/n)+.5)*cs,cs*.32,UI.red);}},

/* ---------- コードブレイカー ---------- */
{id:'code',name:'コードブレイカー',emoji:'🔐',tag:'パズル',color:['#9be7c4','#1b9e77'],
 desc:'隠された4色の並びを10回以内に当てよう。●は色も場所も正解、○は色だけ正解。',
 help:'右の色をクリック（1〜6キー）して4つ並べ、OK（Enter）で答える',
 w:800,h:450,
 COL:['#ef476f','#ffd166','#06d6a0','#118ab2','#9b5de5','#f78c6b'],
 reset(api){this.api=api;this.code=[0,0,0,0].map(()=>ri(0,5));this.rows=[];this.cur=[];this.fin=false;},
 judge(g){let b=0,w=0;const a=this.code.slice(),gg=g.slice();for(let i=0;i<4;i++)if(gg[i]===a[i]){b++;a[i]=gg[i]=-1;}
   for(let i=0;i<4;i++)if(gg[i]>=0){const j=a.indexOf(gg[i]);if(j>=0){w++;a[j]=-1;}}return[b,w];},
 add(k){if(!this.fin&&this.cur.length<4)this.cur.push(k);},
 del(){if(!this.fin)this.cur.pop();},
 ok(){if(this.fin||this.cur.length<4)return;const r=this.judge(this.cur);this.rows.push({g:this.cur,r});this.cur=[];
   if(r[0]===4){this.fin=true;this.api.setScore((11-this.rows.length)*20);this.api.win(`解読成功！ ${this.rows.length}回目`);}
   else if(this.rows.length>=10){this.fin=true;this.api.over('解読失敗…');}},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-6])$/);if(m)this.add(+m[2]-1);if(c==='Backspace')this.del();if(c==='Enter'||c==='Space')this.ok();},
 cp(k){return[520+(k%3)*80,170+Math.floor(k/3)*80];},
 pointer(t,x,y){if(t!=='down')return;for(let k=0;k<6;k++){const p=this.cp(k);if(dist(x,y,p[0],p[1])<32)return this.add(k);}
   if(inR(x,y,470,320,120,52))return this.del();if(inR(x,y,610,320,120,52))return this.ok();},
 draw(c){bg(c,800,450);const X=50;if(state!=='over')T(c,'答え ？？？？',600,70,18,UI.sub);
   for(let i=0;i<10;i++){const y=45+i*40,row=this.rows[i],cur=i===this.rows.length;box(c,X,y-17,332,34,8,cur?'#eef3ff':'#f6f5f1');T(c,String(i+1),X+16,y+1,12,UI.sub);
     const g=row?row.g:cur?this.cur:[];for(let k=0;k<4;k++){if(g[k]!=null)circle(c,X+56+k*42,y,13,this.COL[g[k]]);else circle(c,X+56+k*42,y,6,'#dcdad3');}
     if(row){let n=0;for(let k=0;k<row.r[0];k++,n++)circle(c,X+256+(n%2)*16,y-7+Math.floor(n/2)*14,5,UI.ink);for(let k=0;k<row.r[1];k++,n++)circle(c,X+256+(n%2)*16,y-7+Math.floor(n/2)*14,5,'#fff',UI.ink,1.5);}}
   for(let k=0;k<6;k++){const[x,y]=this.cp(k);circle(c,x,y,28,this.COL[k],'#fff',3);T(c,String(k+1),x,y+1,15,'rgba(255,255,255,.9)');}
   btn(c,470,320,120,52,'けす',{size:17});btn(c,610,320,120,52,'OK',{size:19,on:this.cur.length===4});
   T(c,'● 色も場所も正解　○ 色だけ正解',600,410,13,UI.sub);
   if(state==='over'){T(c,'答え',520,70,16,UI.sub);for(let k=0;k<4;k++)circle(c,570+k*36,70,13,this.COL[this.code[k]]);}}}
);
