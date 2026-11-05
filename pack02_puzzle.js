'use strict';
/* パック2：パズル 10本 */
addGames(

/* ---------- ライトアウト ---------- */
{id:'lights',name:'ライトアウト',emoji:'💡',tag:'パズル',color:['#ffe17a','#f5b400'],
 desc:'押したマスと上下左右のライトが切り替わる。全部のライトを消したらクリア！',
 help:'マスをクリック / タップ',
 w:400,h:460,
 reset(api){this.api=api;this.g=Array(25).fill(0);for(let k=0;k<10;k++)this.press(ri(0,24),true);if(this.g.every(v=>!v))this.press(12,true);this.moves=0;this.fin=false;this.endT=0;},
 press(i,silent){const x=i%5,y=Math.floor(i/5);for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<5&&b<5)this.g[b*5+a]^=1;}if(!silent)this.moves++;},
 pointer(t,x,y){if(t!=='down'||this.fin)return;const c=cellAt(x,y,30,80,68,5,5);if(!c)return;this.press(c.y*5+c.x);if(this.g.every(v=>!v)){this.fin=true;this.endT=.6;}},
 update(dt){if(this.fin&&this.endT>0){this.endT-=dt;if(this.endT<=0){this.api.setScore(Math.max(10,100-this.moves*2));this.api.win(`クリア！ ${this.moves}手`);}}},
 draw(c){bg(c,400,460);T(c,`手数 ${this.moves}`,200,40,20,UI.ink);
   for(let i=0;i<25;i++){const x=30+(i%5)*68,y=80+Math.floor(i/5)*68,on=this.g[i];
     box(c,x+4,y+4,60,60,12,on?'#ffd23f':'#e9e8e3',on?'#f5b400':null,2);if(on)circle(c,x+34,y+34,10,'rgba(255,255,255,.65)');}
   T(c,'ライトを全部消そう',200,440,14,UI.sub);}},

/* ---------- スライドパズル ---------- */
{id:'fifteen',name:'スライドパズル',emoji:'🧩',tag:'パズル',color:['#9fd8ff','#3d8fd6'],
 desc:'数字のタイルをすべらせて 1〜15 の順に並べよう。',
 help:'タイルをクリック / タップ、または矢印キーで動かす',
 w:400,h:460,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']],
 reset(api){this.api=api;this.t=[...Array(15)].map((_,i)=>i+1).concat(0);let e=15,prev=-1;
   for(let k=0;k<300;k++){const n=this.nb(e).filter(v=>v!==prev);const m=n[ri(0,n.length-1)];this.t[e]=this.t[m];this.t[m]=0;prev=e;e=m;}
   this.moves=0;this.time=0;this.fin=false;},
 nb(i){const x=i%4,y=Math.floor(i/4),o=[];if(x>0)o.push(i-1);if(x<3)o.push(i+1);if(y>0)o.push(i-4);if(y<3)o.push(i+4);return o;},
 slide(i){if(this.fin)return;const e=this.t.indexOf(0),ex=e%4,ey=Math.floor(e/4),x=i%4,y=Math.floor(i/4);if((x!==ex&&y!==ey)||i===e)return;
   const step=x===ex?(y<ey?-4:4):(x<ex?-1:1);let k=e;while(k!==i){this.t[k]=this.t[k+step];k+=step;}this.t[i]=0;this.moves++;
   if(this.t.every((v,j)=>j===15?v===0:v===j+1)){this.fin=true;this.api.setScore(Math.max(10,300-this.moves-Math.floor(this.time)));this.api.win(`完成！ ${this.moves}手 / ${Math.floor(this.time)}秒`);}},
 key(c,d){if(!d)return;const e=this.t.indexOf(0),x=e%4,y=Math.floor(e/4);const m={ArrowLeft:[1,0],ArrowRight:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[c];if(!m)return;
   const a=x+m[0],b=y+m[1];if(a>=0&&b>=0&&a<4&&b<4)this.slide(b*4+a);},
 pointer(t,x,y){if(t!=='down')return;const c=cellAt(x,y,20,70,90,4,4);if(c)this.slide(c.y*4+c.x);},
 update(dt){this.time+=dt;},
 draw(c){bg(c,400,460);T(c,`手数 ${this.moves}`,24,36,17,UI.ink,'left');T(c,`${Math.floor(this.time)}秒`,376,36,17,UI.ink,'right');
   box(c,16,66,368,368,14,'#e9e8e3');
   this.t.forEach((v,i)=>{if(!v)return;const x=20+(i%4)*90,y=70+Math.floor(i/4)*90,ok=v===i+1;
     box(c,x+4,y+4,82,82,12,ok?'#eaf3ff':'#fff',ok?'#9fc2f5':UI.line,2);T(c,String(v),x+45,y+47,32,ok?UI.blue:UI.ink);});}},

/* ---------- にもつ押し ---------- */
{id:'soko',name:'にもつ押し',emoji:'📦',tag:'パズル',color:['#d9a46a','#9a6633'],
 desc:'荷物を押して、全部を ● の場所へ運ぼう。押せるけど引っぱれない。全7ステージ。',
 help:'矢印キー / WASD / スワイプ / タップで移動、Z で1手戻す、R でやり直し',
 w:420,h:480,
 pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight'],['戻す','KeyZ'],['最初から','KeyR']],
 LV:[
  ['#######','#.  $@#','#######'],
  ['#######','#     #','# .$. #','#  $  #','#  @  #','#######'],
  ['########','#  .   #','# $$#  #','#  @ . #','########'],
  [' ######',' #    #','##$## #','#  .  #','# $@.##','#   ## ','#####  '],
  ['#######','#. $  #','# ### #','#  $ .#','#  @  #','#######'],
  ['  #######','###  .  #','#  $ #$ #','# .  @  #','#  ## $ #','##.     #',' ########'],
  ['#########','#   #   #','# $ . $ #','#   @   #','# . $ . #','#   $ . #','#########']],
 reset(api){this.api=api;this.lv=0;this.load();},
 load(){const L=this.LV[this.lv];this.H=L.length;this.W=Math.max(...L.map(r=>r.length));this.wall=new Set();this.goal=new Set();this.box=new Set();
   for(let y=0;y<this.H;y++)for(let x=0;x<this.W;x++){const ch=L[y][x]||' ',k=y*this.W+x;if(ch==='#')this.wall.add(k);if('.*+'.includes(ch))this.goal.add(k);if('$*'.includes(ch))this.box.add(k);if('@+'.includes(ch))this.p=k;}
   this.floor=new Set([this.p]);const st=[this.p];
   while(st.length){const k=st.pop();for(const d of[1,-1,this.W,-this.W]){const n=k+d;if(n<0||n>=this.W*this.H||this.wall.has(n)||this.floor.has(n))continue;if(Math.abs((n%this.W)-(k%this.W))>1)continue;this.floor.add(n);st.push(n);}}
   this.hist=[];this.moves=0;this.clearT=0;},
 move(dx,dy){if(this.clearT)return;const d=dy*this.W+dx,n=this.p+d;if(this.wall.has(n)||!this.floor.has(n))return;
   if(this.box.has(n)){const n2=n+d;if(this.wall.has(n2)||this.box.has(n2))return;this.hist.push([this.p,[...this.box]]);this.box.delete(n);this.box.add(n2);}
   else this.hist.push([this.p,[...this.box]]);
   this.p=n;this.moves++;if([...this.box].every(b=>this.goal.has(b)))this.clearT=1;},
 key(c,d){if(!d)return;const m={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1]}[c];if(m)this.move(m[0],m[1]);
   if(c==='KeyZ'&&this.hist.length&&!this.clearT){const[p,b]=this.hist.pop();this.p=p;this.box=new Set(b);this.moves++;}
   if(c==='KeyR'&&!this.clearT)this.load();},
 geo(){const cs=Math.min(48,Math.floor(400/this.W),Math.floor(380/this.H));return{cs,ox:(420-cs*this.W)/2,oy:70+(380-cs*this.H)/2};},
 pointer(t,x,y){if(t==='down'){this.sx=x;this.sy=y;return;}if(t!=='up'||this.sx==null)return;const dx=x-this.sx,dy=y-this.sy;this.sx=null;
   if(Math.hypot(dx,dy)>24){Math.abs(dx)>Math.abs(dy)?this.move(Math.sign(dx),0):this.move(0,Math.sign(dy));return;}
   const g=this.geo(),px=g.ox+(this.p%this.W+.5)*g.cs,py=g.oy+(Math.floor(this.p/this.W)+.5)*g.cs,ex=x-px,ey=y-py;
   if(Math.hypot(ex,ey)>g.cs*.5)Math.abs(ex)>Math.abs(ey)?this.move(Math.sign(ex),0):this.move(0,Math.sign(ey));},
 update(dt){if(this.clearT){this.clearT-=dt;if(this.clearT<=0){this.clearT=0;this.api.addScore(Math.max(10,100-this.moves));this.lv++;if(this.lv>=this.LV.length)return this.api.win('全ステージクリア！');this.load();}}},
 draw(c){bg(c,420,480);T(c,`ステージ ${this.lv+1} / ${this.LV.length}`,20,28,17,UI.ink,'left');T(c,`手数 ${this.moves}`,400,28,15,UI.sub,'right');
   const{cs,ox,oy}=this.geo();
   for(let y=0;y<this.H;y++)for(let x=0;x<this.W;x++){const k=y*this.W+x,X=ox+x*cs,Y=oy+y*cs;
     if(this.wall.has(k))box(c,X+1,Y+1,cs-2,cs-2,6,'#9b978c');
     else if(this.floor.has(k)){c.fillStyle='#f1ece0';c.fillRect(X,Y,cs,cs);}
     if(this.goal.has(k))circle(c,X+cs/2,Y+cs/2,cs*.17,'rgba(229,72,77,.75)');}
   for(const b of this.box){const X=ox+(b%this.W)*cs,Y=oy+Math.floor(b/this.W)*cs,on=this.goal.has(b),lc=on?'#2f8a57':'#9a6633';
     box(c,X+4,Y+4,cs-8,cs-8,6,on?'#7ccf9b':'#e2b27a',lc,2);line(c,X+8,Y+8,X+cs-8,Y+cs-8,lc,2);line(c,X+cs-8,Y+8,X+8,Y+cs-8,lc,2);}
   const PX=ox+(this.p%this.W+.5)*cs,PY=oy+(Math.floor(this.p/this.W)+.5)*cs;circle(c,PX,PY,cs*.34,UI.blue);circle(c,PX-cs*.1,PY-cs*.06,cs*.06,'#fff');circle(c,PX+cs*.1,PY-cs*.06,cs*.06,'#fff');
   if(this.clearT)T(c,'ステージクリア！',210,462,20,UI.green);}},

/* ---------- ジュエルスワップ ---------- */
{id:'jewel',name:'ジュエルスワップ',emoji:'💎',tag:'パズル',color:['#ff9ad5','#c23b8a'],
 desc:'となりの宝石を入れかえて、同じ色を3つ以上そろえて消そう。連鎖でボーナス！ 手数は30回。',
 help:'宝石をドラッグ、または2つを順にクリック / タップして入れかえ',
 w:400,h:470,CS:46,OX:16,OY:70,
 reset(api){this.api=api;this.moves=30;this.sel=null;this.combo=0;this.pending=false;this.fx=[];this.endT=0;this.shake=0;this.fill();},
 fill(){do{this.g=[];for(let i=0;i<64;i++){let v;do{v=ri(0,5);}while((i%8>=2&&this.g[i-1]===v&&this.g[i-2]===v)||(i>=16&&this.g[i-8]===v&&this.g[i-16]===v));this.g.push(v);}}while(!this.hasMove());this.oy=Array(64).fill(0);},
 find(){const m=new Set();
   for(let y=0;y<8;y++){let s=0;for(let x=1;x<=8;x++){if(x<8&&this.g[y*8+x]===this.g[y*8+s])continue;if(x-s>=3)for(let k=s;k<x;k++)m.add(y*8+k);s=x;}}
   for(let x=0;x<8;x++){let s=0;for(let y=1;y<=8;y++){if(y<8&&this.g[y*8+x]===this.g[s*8+x])continue;if(y-s>=3)for(let k=s;k<y;k++)m.add(k*8+x);s=y;}}
   return m;},
 sw(a,b){[this.g[a],this.g[b]]=[this.g[b],this.g[a]];},
 hasMove(){for(let i=0;i<64;i++)for(const j of[i+1,i+8]){if(j>=64||(j===i+1&&i%8===7))continue;this.sw(i,j);const ok=this.find().size>0;this.sw(i,j);if(ok)return true;}return false;},
 busy(){return this.pending||this.oy.some(v=>v!==0)||this.endT>0;},
 trySwap(a,b){if(this.busy()||this.moves<=0)return;const ax=a%8,ay=Math.floor(a/8),bx=b%8,by=Math.floor(b/8);if(Math.abs(ax-bx)+Math.abs(ay-by)!==1)return;
   this.sw(a,b);if(!this.find().size){this.sw(a,b);this.shake=.25;return;}this.moves--;this.combo=0;this.resolve();},
 resolve(){const m=this.find();if(!m.size){this.pending=false;if(!this.hasMove())this.fill();if(this.moves<=0)this.endT=.8;return;}
   this.combo++;this.api.addScore(m.size*10*this.combo);
   for(const i of m)this.fx.push({x:this.OX+(i%8+.5)*this.CS,y:this.OY+(Math.floor(i/8)+.5)*this.CS,t:.4,c:PAL[this.g[i]]});
   if(this.combo>1)this.fx.push({x:200,y:300,t:.8,txt:this.combo+'連鎖！'});
   for(const i of m)this.g[i]=-1;
   for(let x=0;x<8;x++){let w=7;for(let y=7;y>=0;y--){const v=this.g[y*8+x];if(v>=0){if(w!==y){this.g[w*8+x]=v;this.oy[w*8+x]=(y-w)*this.CS;}w--;}}
     for(let y=w,k=1;y>=0;y--,k++){this.g[y*8+x]=ri(0,5);this.oy[y*8+x]=-(w+1)*this.CS-k*4;}}
   this.pending=true;},
 pointer(t,x,y){const c=cellAt(x,y,this.OX,this.OY,this.CS,8,8);
   if(t==='down'){if(!c){this.sel=null;return;}const i=c.y*8+c.x;if(this.sel!=null&&this.sel!==i){const a=this.sel;this.sel=null;this.trySwap(a,i);return;}this.sel=i;this.dx=x;this.dy=y;this.drag=true;}
   else if(t==='move'&&this.drag&&this.sel!=null){const ex=x-this.dx,ey=y-this.dy;if(Math.hypot(ex,ey)>this.CS*.45){const a=this.sel;
     const b=Math.abs(ex)>Math.abs(ey)?(ex>0&&a%8<7?a+1:ex<0&&a%8>0?a-1:a):(ey>0&&a<56?a+8:ey<0&&a>=8?a-8:a);this.drag=false;this.sel=null;if(b!==a)this.trySwap(a,b);}}
   else if(t==='up')this.drag=false;},
 update(dt){let any=false;for(let i=0;i<64;i++){const v=this.oy[i];if(v){any=true;const s=900*dt;this.oy[i]=Math.abs(v)<=s?0:v-Math.sign(v)*s;}}
   if(!any&&this.pending)this.resolve();
   for(const f of this.fx)f.t-=dt;this.fx=this.fx.filter(f=>f.t>0);this.shake=Math.max(0,this.shake-dt);
   if(this.endT>0){this.endT-=dt;if(this.endT<=0)return this.api.over('手数終了！');}},
 gem(c,x,y,v){const r=this.CS*.36;c.save();c.translate(x,y);c.fillStyle=PAL[v];c.beginPath();
   const n=[3,4,5,6,8,4][v],rot=v===1?Math.PI/4:-Math.PI/2;for(let k=0;k<n;k++){const a=rot+k*Math.PI*2/n;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();
   c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(-r*.25,-r*.3,r*.28,0,7);c.fill();c.restore();},
 draw(c){bg(c,400,470);T(c,`残り手数 ${this.moves}`,20,36,18,UI.ink,'left');T(c,`スコア ${score}`,380,36,18,UI.ink,'right');
   const sh=this.shake?Math.sin(this.shake*60)*3:0;
   box(c,this.OX-4,this.OY-4,8*this.CS+8,8*this.CS+8,12,'#efeaf6');
   c.save();c.beginPath();c.rect(this.OX,this.OY,8*this.CS,8*this.CS);c.clip();
   for(let i=0;i<64;i++){const cx=this.OX+(i%8)*this.CS,cy=this.OY+Math.floor(i/8)*this.CS;
     if((i%8+Math.floor(i/8))%2){c.fillStyle='rgba(0,0,0,.035)';c.fillRect(cx,cy,this.CS,this.CS);}
     if(this.sel===i)box(c,cx+2,cy+2,this.CS-4,this.CS-4,8,null,UI.ink,2);
     if(this.g[i]>=0)this.gem(c,cx+this.CS/2+sh,cy+this.CS/2-this.oy[i],this.g[i]);}
   c.restore();
   for(const f of this.fx){if(f.txt){c.globalAlpha=Math.min(1,f.t*2);T(c,f.txt,f.x,f.y-(.8-f.t)*40,30,UI.pink,'center',5);c.globalAlpha=1;}else circle(c,f.x,f.y,(.4-f.t)*60,null,f.c,3);}}},

/* ---------- まとめて消し ---------- */
{id:'same',name:'まとめて消し',emoji:'🟩',tag:'パズル',color:['#8be0a4','#2f9e63'],
 desc:'同じ色が2つ以上つながったブロックをまとめて消す。一度にたくさん消すほど高得点！',
 help:'ブロックをクリック / タップで、つながった同じ色をまとめて消す',
 w:400,h:470,C:10,R:11,CS:36,
 reset(api){this.api=api;this.g=[...Array(this.C)].map(()=>[...Array(this.R)].map(()=>ri(0,3)));this.hl=[];this.fin=false;this.endT=0;this.won=false;},
 group(cx,cy){const col=this.g[cx]&&this.g[cx][cy];if(col==null)return[];const seen=new Set([cx+','+cy]),st=[[cx,cy]],out=[];
   while(st.length){const[x,y]=st.pop();out.push([x,y]);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,k=a+','+b;if(seen.has(k)||!this.g[a]||this.g[a][b]!==col)continue;seen.add(k);st.push([a,b]);}}return out;},
 at(x,y){const cx=Math.floor((x-20)/this.CS),cy=Math.floor((430-y)/this.CS);return cx>=0&&cy>=0&&cx<this.C&&cy<this.R?[cx,cy]:null;},
 anyMove(){for(let a=0;a<this.g.length;a++)for(let b=0;b<this.g[a].length;b++)if((this.g[a+1]&&this.g[a+1][b]===this.g[a][b])||this.g[a][b+1]===this.g[a][b])return true;return false;},
 pointer(t,x,y){if(this.fin)return;const p=this.at(x,y);this.hl=p?this.group(p[0],p[1]):[];if(this.hl.length<2)this.hl=[];
   if(t==='down'&&this.hl.length>=2){const n=this.hl.length;for(const[a,b]of this.hl)this.g[a][b]=null;
     for(let a=0;a<this.g.length;a++)this.g[a]=this.g[a].filter(v=>v!=null);this.g=this.g.filter(col=>col.length);
     this.api.addScore((n-2)*(n-2));this.hl=[];
     if(!this.g.length){this.api.addScore(1000);this.fin=true;this.endT=.6;this.won=true;}
     else if(!this.anyMove()){this.fin=true;this.endT=.8;}}},
 update(dt){if(this.fin&&this.endT>0){this.endT-=dt;if(this.endT<=0){let left=0;for(const col of this.g)left+=col.length;return this.won?this.api.win('全部消えた！ +1000'):this.api.over(`もう消せない（残り${left}個）`);}}},
 draw(c){bg(c,400,470);T(c,`スコア ${score}`,20,30,18,UI.ink,'left');if(this.hl.length)T(c,`${this.hl.length}個 → +${(this.hl.length-2)**2}`,380,30,16,UI.sub,'right');
   const cols=['#ff6b6b','#4dabf7','#51cf66','#fcc419'],hs=new Set(this.hl.map(([a,b])=>a+','+b));
   for(let a=0;a<this.g.length;a++)for(let b=0;b<this.g[a].length;b++){const x=20+a*this.CS,y=430-(b+1)*this.CS,h=hs.has(a+','+b);
     box(c,x+2,y+2,this.CS-4,this.CS-4,8,cols[this.g[a][b]],h?UI.ink:null,2.5);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(x+6,y+5,this.CS-12,4);}
   line(c,16,432,384,432,UI.line,2);}},

/* ---------- ナンプレ ---------- */
{id:'sudoku',name:'ナンプレ',emoji:'9️⃣',tag:'パズル',color:['#a5b4fc','#5a67d8'],
 desc:'たて・よこ・3×3のブロックに 1〜9 が1つずつ入るように数字を埋めよう。',
 help:'マスを選んで、右の数字ボタン / キーボードの数字で入力。Backspace で消す',
 w:800,h:450,
 reset(api){this.api=api;this.sol=this.gen();this.g=this.sol.slice();
   for(const i of shuffle([...Array(81).keys()]).slice(0,46))this.g[i]=0;this.giv=this.g.map(v=>v>0);
   this.sel=null;this.miss=0;this.time=0;this.fin=false;},
 ok(g,i,v){const r=Math.floor(i/9),c=i%9,br=r-r%3,bc=c-c%3;
   for(let k=0;k<9;k++){if(g[r*9+k]===v&&r*9+k!==i)return false;if(g[k*9+c]===v&&k*9+c!==i)return false;const bi=(br+Math.floor(k/3))*9+bc+k%3;if(g[bi]===v&&bi!==i)return false;}return true;},
 gen(){const g=Array(81).fill(0);const fill=i=>{if(i===81)return true;for(const v of shuffle([1,2,3,4,5,6,7,8,9])){if(this.ok(g,i,v)){g[i]=v;if(fill(i+1))return true;g[i]=0;}}return false;};fill(0);return g;},
 input(v){if(this.sel==null||this.giv[this.sel]||this.fin)return;this.g[this.sel]=v;
   if(v&&!this.ok(this.g,this.sel,v))this.miss++;
   if(this.g.every((x,i)=>x&&this.ok(this.g,i,x))){this.fin=true;this.api.setScore(Math.max(10,600-Math.floor(this.time)-this.miss*20));this.api.win(`完成！ ${Math.floor(this.time)}秒`);}},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([0-9])$/);if(m)this.input(+m[2]);if(c==='Backspace'||c==='Delete')this.input(0);
   const mv={ArrowLeft:-1,ArrowRight:1,ArrowUp:-9,ArrowDown:9}[c];if(mv){if(this.sel==null)this.sel=40;else{const n=this.sel+mv;if(n>=0&&n<81&&!(mv===1&&n%9===0)&&!(mv===-1&&n%9===8))this.sel=n;}}},
 pointer(t,x,y){if(t!=='down')return;const c=cellAt(x,y,40,45,40,9,9);if(c){this.sel=c.y*9+c.x;return;}
   for(let k=0;k<10;k++){const b=this.nb(k);if(inR(x,y,b[0],b[1],b[2],b[3])){this.input(k===9?0:k+1);return;}}},
 nb(k){return k===9?[470,350,260,60]:[470+(k%3)*90,110+Math.floor(k/3)*80,80,70];},
 update(dt){this.time+=dt;},
 draw(c){bg(c,800,450);T(c,`${Math.floor(this.time)}秒`,470,64,18,UI.ink,'left');T(c,`ミス ${this.miss}`,730,64,18,this.miss?UI.red:UI.sub,'right');
   const sv=this.sel!=null?this.g[this.sel]:0;
   for(let i=0;i<81;i++){const x=40+(i%9)*40,y=45+Math.floor(i/9)*40,v=this.g[i];let f='#fff';
     if(this.sel!=null){const sr=Math.floor(this.sel/9),sc=this.sel%9,r=Math.floor(i/9),cc=i%9;
       if(r===sr||cc===sc||(Math.floor(r/3)===Math.floor(sr/3)&&Math.floor(cc/3)===Math.floor(sc/3)))f='#f2f5fd';if(v&&v===sv)f='#dbe5fb';if(i===this.sel)f='#bfd1f7';}
     c.fillStyle=f;c.fillRect(x,y,40,40);
     if(v)T(c,String(v),x+20,y+21,22,this.giv[i]?UI.ink:(this.ok(this.g,i,v)?UI.blue:UI.red));}
   for(let k=0;k<=9;k++){const w=k%3===0?2.5:1,col=k%3===0?UI.ink:'#d4d3cd';line(c,40+k*40,45,40+k*40,405,col,w);line(c,40,45+k*40,400,45+k*40,col,w);}
   for(let k=0;k<10;k++){const b=this.nb(k);btn(c,b[0],b[1],b[2],b[3],k===9?'消す':String(k+1),{size:24,r:10});}
   T(c,'マスを選んで数字を入力',600,432,13,UI.sub);}},

/* ---------- お絵かきロジック ---------- */
{id:'nono',name:'お絵かきロジック',emoji:'🖼️',tag:'パズル',color:['#ffc58a','#e0782b'],
 desc:'数字のヒントは、その列で連続して塗るマスの数。ヒントどおりに塗ると完成！',
 help:'クリック / タップで塗る（ドラッグで連続）。「×モード」や右クリックで×印',
 w:380,h:470,N:8,CS:32,OX:100,OY:110,
 reset(api){this.api=api;const N=this.N;this.ans=[...Array(N*N)].map(()=>Math.random()<.58?1:0);
   this.rc=[...Array(N)].map((_,y)=>this.runs([...Array(N)].map((_,x)=>this.ans[y*N+x])));
   this.cc=[...Array(N)].map((_,x)=>this.runs([...Array(N)].map((_,y)=>this.ans[y*N+x])));
   this.g=Array(N*N).fill(0);this.mode=1;this.fin=false;this.time=0;this.paint=null;this.dragging=false;},
 runs(a){const r=[];let n=0;for(const v of a.concat(0)){if(v)n++;else if(n){r.push(n);n=0;}}return r.length?r:[0];},
 solved(){const N=this.N,f=this.g.map(v=>v===1?1:0);for(let y=0;y<N;y++)if(this.runs(f.slice(y*N,y*N+N)).join()!==this.rc[y].join())return false;
   for(let x=0;x<N;x++)if(this.runs([...Array(N)].map((_,y)=>f[y*N+x])).join()!==this.cc[x].join())return false;return true;},
 setCell(i,mode){if(this.paint==null)this.paint=this.g[i]===mode?0:mode;this.g[i]=this.paint;},
 pointer(t,x,y,e){if(this.fin)return;
   if(t==='down'&&inR(x,y,250,425,110,36)){this.mode=this.mode===1?2:1;return;}
   const c=cellAt(x,y,this.OX,this.OY,this.CS,this.N,this.N);
   if(t==='down'){if(!c)return;this.paint=null;this.curMode=(e&&e.button===2)?(this.mode===1?2:1):this.mode;this.setCell(c.y*this.N+c.x,this.curMode);this.dragging=true;}
   else if(t==='move'&&this.dragging&&c)this.setCell(c.y*this.N+c.x,this.curMode);
   else if(t==='up'&&this.dragging){this.dragging=false;this.paint=null;if(this.solved()){this.fin=true;this.api.setScore(Math.max(10,400-Math.floor(this.time)));this.api.win(`完成！ ${Math.floor(this.time)}秒`);}}},
 update(dt){this.time+=dt;},
 draw(c){bg(c,380,470);const N=this.N,CS=this.CS,OX=this.OX,OY=this.OY;
   T(c,`${Math.floor(this.time)}秒`,20,24,15,UI.sub,'left');
   for(let y=0;y<N;y++){c.fillStyle=y%2?'#f4f2ec':'#faf8f3';c.fillRect(6,OY+y*CS,OX-8,CS);T(c,this.rc[y].join(' '),OX-8,OY+y*CS+CS/2+1,14,UI.ink,'right');}
   for(let x=0;x<N;x++){c.fillStyle=x%2?'#f4f2ec':'#faf8f3';c.fillRect(OX+x*CS,40,CS,OY-42);this.cc[x].forEach((v,k,a)=>T(c,String(v),OX+x*CS+CS/2,OY-12-(a.length-1-k)*16,14,UI.ink));}
   for(let i=0;i<N*N;i++){const x=OX+(i%N)*CS,y=OY+Math.floor(i/N)*CS,v=this.g[i];c.fillStyle=v===1?'#3b3b3b':'#fff';c.fillRect(x,y,CS,CS);
     if(v===2){line(c,x+9,y+9,x+CS-9,y+CS-9,UI.red,2);line(c,x+CS-9,y+9,x+9,y+CS-9,UI.red,2);}}
   for(let k=0;k<=N;k++){const b=k%4===0;line(c,OX+k*CS,OY,OX+k*CS,OY+N*CS,b?UI.ink:'#cfcec8',b?2:1);line(c,OX,OY+k*CS,OX+N*CS,OY+k*CS,b?UI.ink:'#cfcec8',b?2:1);}
   btn(c,250,425,110,36,this.mode===1?'■ 塗るモード':'× モード',{size:14,fill:this.mode===2?'#ffe8e8':'#fff'});}},

/* ---------- ハノイの塔 ---------- */
{id:'hanoi',name:'ハノイの塔',emoji:'🗼',tag:'パズル',color:['#b5e48c','#52b69a'],
 desc:'円盤を全部、右の棒へ移そう。一度に動かせるのは1枚だけ。小さい円盤の上に大きい円盤は置けない。',
 help:'動かしたい棒をクリック → 置きたい棒をクリック（1・2・3 キーでもOK）',
 w:480,h:340,
 reset(api){this.api=api;this.n=5;this.p=[[5,4,3,2,1],[],[]];this.sel=-1;this.moves=0;this.fin=false;this.bad=0;},
 pick(i){if(this.fin)return;if(this.sel<0){if(this.p[i].length)this.sel=i;return;}if(i===this.sel){this.sel=-1;return;}
   const a=this.p[this.sel],b=this.p[i],d=a[a.length-1];if(!b.length||b[b.length-1]>d){b.push(a.pop());this.moves++;}else this.bad=.8;this.sel=-1;
   if(this.p[2].length===this.n){this.fin=true;const min=2**this.n-1;this.api.setScore(Math.max(10,200-(this.moves-min)*5));this.api.win(`完成！ ${this.moves}手（最少 ${min}手）`);}},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-3])$/);if(m)this.pick(+m[2]-1);},
 pointer(t,x){if(t==='down')this.pick(clamp(Math.floor(x/160),0,2));},
 update(dt){this.bad=Math.max(0,this.bad-dt);},
 draw(c){bg(c,480,340);T(c,`手数 ${this.moves}`,20,26,17,UI.ink,'left');T(c,`最少 ${2**this.n-1}手`,460,26,14,UI.sub,'right');
   box(c,20,290,440,14,6,'#c9b79c');
   for(let i=0;i<3;i++){const x=80+i*160;box(c,x-5,90,10,200,5,this.sel===i?UI.blue:'#b39b7d');T(c,String(i+1),x,322,14,UI.sub);
     this.p[i].forEach((d,k)=>{const w=30+d*22,y=290-(k+1)*26,lift=this.sel===i&&k===this.p[i].length-1?-30:0;box(c,x-w/2,y+lift,w,24,10,PAL[d-1]);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(x-w/2+8,y+lift+4,w-16,4);});}
   if(this.bad)T(c,'小さい円盤の上には置けない！',240,60,16,UI.red);}},

/* ---------- ペグソリティア ---------- */
{id:'peg',name:'ペグソリティア',emoji:'📍',tag:'パズル',color:['#ffd6a5','#e07a2b'],
 desc:'ペグでとなりのペグを飛び越えると、飛び越されたペグが取れる。最後の1本まで減らせるかな？',
 help:'動かすペグをクリック → 2つ先の空き穴をクリック',
 w:400,h:440,
 reset(api){this.api=api;this.b={};for(let y=0;y<7;y++)for(let x=0;x<7;x++)if((x>=2&&x<=4)||(y>=2&&y<=4))this.b[x+','+y]=1;this.b['3,3']=0;this.sel=null;this.fin=false;this.endT=0;},
 left(){return Object.values(this.b).filter(v=>v).length;},
 can(x,y,dx,dy){return this.b[x+','+y]&&this.b[(x+dx)+','+(y+dy)]&&this.b[(x+2*dx)+','+(y+2*dy)]===0;},
 any(){for(const k in this.b){if(!this.b[k])continue;const[x,y]=k.split(',').map(Number);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(this.can(x,y,dx,dy))return true;}return false;},
 pointer(t,x,y){if(t!=='down'||this.fin)return;const gx=Math.round((x-80)/40),gy=Math.round((y-90)/40),k=gx+','+gy;if(!(k in this.b))return;
   if(this.b[k]){this.sel=[gx,gy];return;}
   if(!this.sel)return;const[sx,sy]=this.sel,dx=(gx-sx)/2,dy=(gy-sy)/2;
   if(((Math.abs(dx)===1&&dy===0)||(Math.abs(dy)===1&&dx===0))&&this.can(sx,sy,dx,dy)){this.b[sx+','+sy]=0;this.b[(sx+dx)+','+(sy+dy)]=0;this.b[k]=1;this.sel=null;
     this.api.setScore(33-this.left());if(!this.any()){this.fin=true;this.endT=.8;}}},
 update(dt){if(this.fin&&this.endT>0){this.endT-=dt;if(this.endT<=0){const n=this.left();this.api.setScore(n===1?(this.b['3,3']?200:100):33-n);
   return n===1?this.api.win(this.b['3,3']?'完璧！ 真ん中に1本！':'クリア！ 残り1本'):this.api.over(`もう動かせない（残り${n}本）`);}}},
 draw(c){bg(c,400,440);T(c,`残り ${this.left()}本`,200,30,18,UI.ink);
   circle(c,200,210,165,'#efe1c6');
   for(const k in this.b){const[x,y]=k.split(',').map(Number),X=80+x*40,Y=90+y*40;circle(c,X,Y,9,'#cdb38c');
     if(this.b[k]){const s=this.sel&&this.sel[0]===x&&this.sel[1]===y;circle(c,X,Y+2,14,'rgba(0,0,0,.15)');circle(c,X,Y,14,s?UI.yellow:UI.orange);circle(c,X-4,Y-4,4,'rgba(255,255,255,.5)');}}
   if(this.sel){const[sx,sy]=this.sel;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(this.can(sx,sy,dx,dy))circle(c,80+(sx+2*dx)*40,90+(sy+2*dy)*40,14,null,UI.blue,2.5);}}},

/* ---------- パイプつなぎ ---------- */
{id:'pipes',name:'パイプつなぎ',emoji:'🚰',tag:'パズル',color:['#7fd1e8','#1c8bb0'],
 desc:'パイプを回して、左の蛇口から右の出口まで水を通そう。',
 help:'パイプをクリック / タップすると90°回転',
 w:400,h:460,N:6,CS:56,OX:32,OY:70,
 rot(m){return((m<<1)|(m>>3))&15;},
 reset(api){this.api=api;const N=this.N;
   for(;;){this.sr=ri(0,N-1);this.er=ri(0,N-1);const p=this.walk();if(p){this.path=p;break;}}
   this.g=Array(N*N).fill(0);const B={'0,-1':1,'1,0':2,'0,1':4,'-1,0':8},P=this.path;
   for(let k=0;k<P.length;k++){const[x,y]=P[k],prev=k?P[k-1]:[-1,this.sr],next=k<P.length-1?P[k+1]:[N,this.er];this.g[y*N+x]=B[(prev[0]-x)+','+(prev[1]-y)]|B[(next[0]-x)+','+(next[1]-y)];}
   for(let i=0;i<N*N;i++)if(!this.g[i])this.g[i]=[5,3,7,6,13,11][ri(0,5)];
   for(let i=0;i<N*N;i++)for(let k=ri(1,3);k>0;k--)this.g[i]=this.rot(this.g[i]);
   this.moves=0;this.fin=false;this.endT=0;if(this.flow())this.g[this.sr*N]=this.rot(this.g[this.sr*N]);this.flow();},
 walk(){const N=this.N,seen=new Set(),path=[];
   const go=(x,y)=>{seen.add(x+','+y);path.push([x,y]);if(x===N-1&&y===this.er)return true;
     for(const[dx,dy]of shuffle([[1,0],[0,1],[0,-1],[1,0],[-1,0]])){const a=x+dx,b=y+dy;if(a<0||b<0||a>=N||b>=N||seen.has(a+','+b))continue;if(go(a,b))return true;}path.pop();return false;};
   return go(0,this.sr)&&path.length>=N+2?path:null;},
 flow(){const N=this.N,w=new Set();this.wet=w;if(!(this.g[this.sr*N]&8))return false;const st=[[0,this.sr]];w.add('0,'+this.sr);let out=false;
   while(st.length){const[x,y]=st.pop(),m=this.g[y*N+x];if(x===N-1&&y===this.er&&(m&2))out=true;
     for(const[bit,dx,dy,opp]of[[1,0,-1,4],[2,1,0,8],[4,0,1,1],[8,-1,0,2]]){if(!(m&bit))continue;const a=x+dx,b=y+dy;if(a<0||b<0||a>=N||b>=N||w.has(a+','+b))continue;if(this.g[b*N+a]&opp){w.add(a+','+b);st.push([a,b]);}}}
   return out;},
 pointer(t,x,y){if(t!=='down'||this.fin)return;const c=cellAt(x,y,this.OX,this.OY,this.CS,this.N,this.N);if(!c)return;const i=c.y*this.N+c.x;this.g[i]=this.rot(this.g[i]);this.moves++;
   if(this.flow()){this.fin=true;this.endT=.9;}},
 update(dt){if(this.fin&&this.endT>0){this.endT-=dt;if(this.endT<=0){this.api.setScore(Math.max(10,150-this.moves*2));this.api.win(`水が通った！ ${this.moves}回転`);}}},
 draw(c){bg(c,400,460);const N=this.N,CS=this.CS,OX=this.OX,OY=this.OY;T(c,`回転 ${this.moves}`,200,36,17,UI.ink);
   box(c,OX-4,OY-4,N*CS+8,N*CS+8,10,'#e9e8e3');
   box(c,OX-28,OY+this.sr*CS+CS/2-10,26,20,4,'#3da5f4');box(c,OX+N*CS+2,OY+this.er*CS+CS/2-10,26,20,4,this.fin?'#3da5f4':'#9aa5b1');
   for(let i=0;i<N*N;i++){const x=OX+(i%N)*CS,y=OY+Math.floor(i/N)*CS,m=this.g[i],cx=x+CS/2,cy=y+CS/2,wet=this.wet.has((i%N)+','+Math.floor(i/N));
     box(c,x+2,y+2,CS-4,CS-4,8,'#fff');const col=wet?'#3da5f4':'#a3a39d';
     for(const[bit,dx,dy]of[[1,0,-1],[2,1,0],[4,0,1],[8,-1,0]])if(m&bit)line(c,cx,cy,cx+dx*CS/2,cy+dy*CS/2,col,12);circle(c,cx,cy,6,col);}
   T(c,'左の青い蛇口から右の出口へ水を通そう',200,440,13,UI.sub);}}
);
