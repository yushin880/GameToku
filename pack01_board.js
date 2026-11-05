'use strict';
/* パック1：ボードゲーム（CPU対戦）10本 */
addGames(

/* ---------- まるばつ ---------- */
{id:'ttt',name:'まるばつ',emoji:'⭕',tag:'ボード',color:['#7aa2ff','#3d6fd6'],
 desc:'CPUと三目ならべ。たて・よこ・ななめに3つ並べたら勝ち。負けるまで何連勝できる？',
 help:'マスをクリック / タップで ○ を置く',
 w:360,h:420,
 L:[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],
 reset(api){this.api=api;this.round=0;this.newRound();},
 newRound(){this.b=Array(9).fill(0);this.turn=this.round%2?2:1;this.round++;this.cpuT=.5;this.res=null;this.resT=0;},
 win(b){for(const l of this.L){const[a,c,d]=l;if(b[a]&&b[a]===b[c]&&b[a]===b[d])return{p:b[a],l};}return b.every(v=>v)?{p:0}:null;},
 mm(b,p){const w=this.win(b);if(w)return w.p===2?10:w.p===1?-10:0;let best=p===2?-99:99;
   for(let i=0;i<9;i++)if(!b[i]){b[i]=p;const s=this.mm(b,3-p);b[i]=0;best=p===2?Math.max(best,s):Math.min(best,s);}return best;},
 cpu(){const e=[];this.b.forEach((v,i)=>{if(!v)e.push(i);});let mv;
   if(e.length===9)mv=[0,2,4,6,8][ri(0,4)];
   else if(Math.random()<.25)mv=e[ri(0,e.length-1)];
   else{let bs=-99;for(const i of shuffle(e.slice())){this.b[i]=2;const s=this.mm(this.b,1);this.b[i]=0;if(s>bs){bs=s;mv=i;}}}
   this.play(mv,2);},
 play(i,p){this.b[i]=p;const w=this.win(this.b);if(w){this.res=w;this.resT=1.3;}else{this.turn=3-p;this.cpuT=.45;}},
 pointer(t,x,y){if(t!=='down'||this.res||this.turn!==1)return;const c=cellAt(x,y,30,80,100,3,3);if(!c)return;const i=c.y*3+c.x;if(!this.b[i])this.play(i,1);},
 update(dt){
   if(this.res){this.resT-=dt;if(this.resT<=0){const p=this.res.p;if(p===2)return this.api.over('CPUの勝ち…');if(p===1)this.api.addScore(1);this.newRound();}return;}
   if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
 },
 draw(c){bg(c,360,420);T(c,'連勝 '+score,180,30,20,UI.ink);
   T(c,this.res?(this.res.p===1?'あなたの勝ち！':this.res.p===2?'CPUの勝ち':'引き分け'):(this.turn===1?'あなたの番（○）':'CPU考え中…'),180,56,15,UI.sub);
   for(let i=1;i<3;i++){line(c,30+i*100,85,30+i*100,375,UI.line,4);line(c,35,80+i*100,325,80+i*100,UI.line,4);}
   this.b.forEach((v,i)=>{const cx=80+(i%3)*100,cy=130+Math.floor(i/3)*100;
     if(v===1)circle(c,cx,cy,30,null,UI.blue,8);
     else if(v===2){line(c,cx-28,cy-28,cx+28,cy+28,UI.red,8);line(c,cx+28,cy-28,cx-28,cy+28,UI.red,8);}});
   if(this.res&&this.res.l){const a=this.res.l[0],b=this.res.l[2];line(c,80+(a%3)*100,130+Math.floor(a/3)*100,80+(b%3)*100,130+Math.floor(b/3)*100,'rgba(42,42,42,.6)',6);}
 }},

/* ---------- よんもく ---------- */
{id:'c4',name:'よんもく',emoji:'🔴',tag:'ボード',color:['#ff8a80','#e5484d'],
 desc:'コマを上から落として、たて・よこ・ななめに4つ並べよう。CPUとの対戦。',
 help:'列をクリック / タップでコマを落とす（←→ と スペースでもOK）',
 w:420,h:440,
 reset(api){this.api=api;this.b=[...Array(6)].map(()=>Array(7).fill(0));this.turn=1;this.cpuT=0;this.sel=3;this.res=null;this.anim=null;this.moves=0;this.fin=false;},
 can(b,col){return b[0][col]===0;},
 put(b,col,p){for(let r=5;r>=0;r--)if(!b[r][col]){b[r][col]=p;return r;}return -1;},
 winAt(b,p){for(let r=0;r<6;r++)for(let c=0;c<7;c++){if(b[r][c]!==p)continue;
   for(const[dr,dc]of[[0,1],[1,0],[1,1],[1,-1]]){let k=1;while(k<4){const r2=r+dr*k,c2=c+dc*k;if(r2<0||r2>=6||c2<0||c2>=7||b[r2][c2]!==p)break;k++;}if(k===4)return[[r,c],[r+dr*3,c+dc*3]];}}return null;},
 evalB(b){let s=0;
   for(let r=0;r<6;r++)for(let c=0;c<7;c++)for(const[dr,dc]of[[0,1],[1,0],[1,1],[1,-1]]){const er=r+dr*3,ec=c+dc*3;if(er<0||er>=6||ec<0||ec>=7)continue;
     let p1=0,p2=0;for(let k=0;k<4;k++){const v=b[r+dr*k][c+dc*k];if(v===1)p1++;else if(v===2)p2++;}
     if(p1&&p2)continue;if(p2===3)s+=5;else if(p2===2)s+=2;if(p1===3)s-=4;else if(p1===2)s-=1;}
   for(let r=0;r<6;r++)if(b[r][3]===2)s+=3;return s;},
 mm(b,d,p,al,be){if(this.winAt(b,2))return 10000+d;if(this.winAt(b,1))return -10000-d;if(d===0)return this.evalB(b);
   const cols=[3,2,4,1,5,0,6].filter(c=>this.can(b,c));if(!cols.length)return 0;
   if(p===2){let v=-1e9;for(const c of cols){const r=this.put(b,c,2);v=Math.max(v,this.mm(b,d-1,1,al,be));b[r][c]=0;al=Math.max(al,v);if(al>=be)break;}return v;}
   let v=1e9;for(const c of cols){const r=this.put(b,c,1);v=Math.min(v,this.mm(b,d-1,2,al,be));b[r][c]=0;be=Math.min(be,v);if(al>=be)break;}return v;},
 cpu(){let best=-1e9,mv=3;for(const c of shuffle([0,1,2,3,4,5,6])){if(!this.can(this.b,c))continue;const r=this.put(this.b,c,2);const v=this.mm(this.b,4,1,-1e9,1e9);this.b[r][c]=0;if(v>best){best=v;mv=c;}}this.move(mv,2);},
 move(col,p){if(!this.can(this.b,col))return;const r=this.put(this.b,col,p);this.anim={col,r,y:-1,p};this.moves++;const w=this.winAt(this.b,p);
   if(w){this.res={p,w};this.resT=1.5;}else if(this.moves===42){this.res={p:0};this.resT=1.5;}else{this.turn=3-p;this.cpuT=.5;}},
 key(c,d){if(!d||this.turn!==1||this.res)return;if(c==='ArrowLeft')this.sel=Math.max(0,this.sel-1);if(c==='ArrowRight')this.sel=Math.min(6,this.sel+1);if(c==='Space'||c==='Enter'||c==='ArrowDown')this.move(this.sel,1);},
 pointer(t,x,y){const col=Math.floor((x-20)/54);if(col<0||col>6)return;this.sel=col;if(t==='down'&&this.turn===1&&!this.res&&!this.anim)this.move(col,1);},
 update(dt){if(this.anim){this.anim.y+=dt*14;if(this.anim.y>=this.anim.r)this.anim=null;}
   if(this.res){if(this.fin)return;this.resT-=dt;if(this.resT<=0){this.fin=true;const p=this.res.p;this.api.setScore(p===1?Math.max(10,100-this.moves):p===0?20:0);
     return p===1?this.api.win('あなたの勝ち！'):p===0?this.api.over('引き分け'):this.api.over('CPUの勝ち…');}return;}
   if(this.turn===2&&!this.anim){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}},
 draw(c){bg(c,420,440);
   T(c,this.res?(this.res.p===1?'あなたの勝ち！':this.res.p===2?'CPUの勝ち':'引き分け'):this.turn===1?'あなたの番（赤）':'CPU考え中…',210,26,17,UI.ink);
   if(this.turn===1&&!this.res)circle(c,20+this.sel*54+27,56,18,'rgba(229,72,77,.5)');
   box(c,16,76,386,332,14,'#3d6fd6');
   for(let r=0;r<6;r++)for(let cc=0;cc<7;cc++){let v=this.b[r][cc];if(this.anim&&this.anim.r===r&&this.anim.col===cc)v=0;circle(c,20+cc*54+27,80+r*54+27,22,v===1?UI.red:v===2?UI.yellow:'#fbfaf7');}
   if(this.anim){const a=this.anim;circle(c,20+a.col*54+27,80+a.y*54+27,22,a.p===1?UI.red:UI.yellow);}
   if(this.res&&this.res.w){const[[r1,c1],[r2,c2]]=this.res.w;line(c,20+c1*54+27,80+r1*54+27,20+c2*54+27,80+r2*54+27,'#fff',6);}
 }},

/* ---------- リバーシ ---------- */
{id:'reversi',name:'リバーシ',emoji:'⚫',tag:'ボード',color:['#5fd39a','#1f7a4d'],
 desc:'相手の石をはさんでひっくり返そう。最後に石が多いほうの勝ち。',
 help:'光っているマスをクリック / タップで石を置く（あなたは黒）',
 w:400,h:460,
 WT:[[100,-20,10,5,5,10,-20,100],[-20,-50,-2,-2,-2,-2,-50,-20],[10,-2,1,1,1,1,-2,10],[5,-2,1,0,0,1,-2,5],[5,-2,1,0,0,1,-2,5],[10,-2,1,1,1,1,-2,10],[-20,-50,-2,-2,-2,-2,-50,-20],[100,-20,10,5,5,10,-20,100]],
 reset(api){this.api=api;this.b=[...Array(8)].map(()=>Array(8).fill(0));this.b[3][3]=this.b[4][4]=2;this.b[3][4]=this.b[4][3]=1;this.turn=1;this.cpuT=0;this.msg='';this.last=null;this.endT=0;},
 flips(b,x,y,p){if(b[y][x])return[];const out=[];
   for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){if(!dx&&!dy)continue;const f=[];let cx=x+dx,cy=y+dy;
     while(cx>=0&&cy>=0&&cx<8&&cy<8&&b[cy][cx]===3-p){f.push([cx,cy]);cx+=dx;cy+=dy;}
     if(f.length&&cx>=0&&cy>=0&&cx<8&&cy<8&&b[cy][cx]===p)out.push(...f);}return out;},
 moves(b,p){const m=[];for(let y=0;y<8;y++)for(let x=0;x<8;x++){const f=this.flips(b,x,y,p);if(f.length)m.push({x,y,f});}return m;},
 apply(b,m,p){b[m.y][m.x]=p;for(const[x,y]of m.f)b[y][x]=p;},
 count(p){let n=0;for(const r of this.b)for(const v of r)if(v===p)n++;return n;},
 place(m,p){this.apply(this.b,m,p);this.last=m;this.next(3-p);},
 next(p){if(this.moves(this.b,p).length){this.turn=p;this.msg='';if(p===2)this.cpuT=.6;return;}
   if(this.moves(this.b,3-p).length){this.turn=3-p;this.msg=(p===1?'あなた':'CPU')+'はパス';if(this.turn===2)this.cpuT=.9;return;}
   this.turn=0;this.endT=1.2;},
 cpu(){const ms=this.moves(this.b,2);let best=-1e9,bm=ms[0];
   for(const m of ms){const b2=this.b.map(r=>r.slice());this.apply(b2,m,2);let v=this.WT[m.y][m.x]+m.f.length*.5;
     const opp=this.moves(b2,1);let worst=0;for(const o of opp)worst=Math.max(worst,this.WT[o.y][o.x]+o.f.length*.5);
     v-=worst*.8+opp.length*.5-Math.random();if(v>best){best=v;bm=m;}}
   this.place(bm,2);},
 pointer(t,x,y){if(t!=='down'||this.turn!==1)return;const c=cellAt(x,y,20,60,45,8,8);if(!c)return;const f=this.flips(this.b,c.x,c.y,1);if(f.length)this.place({x:c.x,y:c.y,f},1);},
 update(dt){if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
   if(this.turn===0){this.endT-=dt;if(this.endT<=0){const a=this.count(1),b=this.count(2);this.api.setScore(a);this.turn=-1;
     return a>b?this.api.win(`勝ち！ ${a} 対 ${b}`):a===b?this.api.over(`引き分け ${a} 対 ${b}`):this.api.over(`負け… ${a} 対 ${b}`);}}},
 draw(c){bg(c,400,460);
   T(c,`● あなた ${this.count(1)}`,24,30,17,UI.ink,'left');T(c,`CPU ${this.count(2)} ○`,376,30,17,UI.ink,'right');
   box(c,16,56,368,368,10,'#2f9e63');
   for(let i=0;i<=8;i++){line(c,20+i*45,60,20+i*45,420,'rgba(0,0,0,.3)',1.5);line(c,20,60+i*45,380,60+i*45,'rgba(0,0,0,.3)',1.5);}
   if(this.turn===1)for(const m of this.moves(this.b,1))circle(c,42.5+m.x*45,82.5+m.y*45,6,'rgba(255,255,255,.5)');
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){const v=this.b[y][x];if(v)circle(c,42.5+x*45,82.5+y*45,18,v===1?'#222':'#fff',v===2?'#bbb':null,1);}
   if(this.last)circle(c,42.5+this.last.x*45,82.5+this.last.y*45,4,UI.red);
   T(c,this.msg||(this.turn===1?'あなたの番':this.turn===2?'CPU考え中…':''),200,442,15,UI.sub);
 }},

/* ---------- 五目ならべ ---------- */
{id:'gomoku',name:'五目ならべ',emoji:'⚪',tag:'ボード',color:['#e8c27a','#b07d2b'],
 desc:'黒と白で交互に石を置き、先に5つ並べたら勝ち。CPUはなかなか手強い。',
 help:'交点をクリック / タップで石を置く（あなたは黒・先手）',
 w:420,h:460,
 reset(api){this.api=api;this.b=[...Array(13)].map(()=>Array(13).fill(0));this.turn=1;this.cpuT=0;this.last=null;this.res=null;this.n=0;this.fin=false;},
 at(x,y){return x<0||y<0||x>=13||y>=13?-1:this.b[y][x];},
 line5(x,y,p){for(const[dx,dy]of[[1,0],[0,1],[1,1],[1,-1]]){let a=1,b=1;while(this.at(x+dx*a,y+dy*a)===p)a++;while(this.at(x-dx*b,y-dy*b)===p)b++;
   if(a+b-1>=5)return[[x-dx*(b-1),y-dy*(b-1)],[x+dx*(a-1),y+dy*(a-1)]];}return null;},
 sc(x,y,p){let s=0;for(const[dx,dy]of[[1,0],[0,1],[1,1],[1,-1]]){let a=1,open=0,k=1;
   while(this.at(x+dx*k,y+dy*k)===p){a++;k++;}if(this.at(x+dx*k,y+dy*k)===0)open++;
   k=1;while(this.at(x-dx*k,y-dy*k)===p){a++;k++;}if(this.at(x-dx*k,y-dy*k)===0)open++;
   if(a>=5)s+=100000;else if(a===4)s+=open===2?10000:open===1?1000:0;else if(a===3)s+=open===2?1000:open===1?100:0;else if(a===2)s+=open===2?100:open===1?10:0;else s+=open;}
   return s;},
 cpu(){let best=-1,mv=null;
   for(let y=0;y<13;y++)for(let x=0;x<13;x++){if(this.b[y][x])continue;let near=false;
     for(let dy=-2;dy<=2&&!near;dy++)for(let dx=-2;dx<=2;dx++)if(this.at(x+dx,y+dy)>0){near=true;break;}
     if(!near)continue;const v=this.sc(x,y,2)*1.1+this.sc(x,y,1)+Math.random();if(v>best){best=v;mv={x,y};}}
   if(!mv)mv={x:6,y:6};this.place(mv.x,mv.y,2);},
 place(x,y,p){this.b[y][x]=p;this.last={x,y};this.n++;const w=this.line5(x,y,p);
   if(w){this.res={p,w};this.resT=1.4;this.turn=0;}else if(this.n>=169){this.res={p:0};this.resT=1;this.turn=0;}else{this.turn=3-p;this.cpuT=.5;}},
 pointer(t,x,y){if(t!=='down'||this.turn!==1)return;const gx=Math.round((x-30)/30),gy=Math.round((y-60)/30);if(gx<0||gy<0||gx>12||gy>12||this.b[gy][gx])return;this.place(gx,gy,1);},
 update(dt){if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
   if(this.res&&!this.fin){this.resT-=dt;if(this.resT<=0){this.fin=true;const p=this.res.p;this.api.setScore(p===1?Math.max(10,200-this.n):0);
     return p===1?this.api.win('あなたの勝ち！'):p===0?this.api.over('引き分け'):this.api.over('CPUの勝ち…');}}},
 draw(c){bg(c,420,460);box(c,10,40,400,400,10,'#e9c98b');
   for(let i=0;i<13;i++){line(c,30+i*30,60,30+i*30,420,'rgba(90,60,20,.55)',1);line(c,30,60+i*30,390,60+i*30,'rgba(90,60,20,.55)',1);}
   for(const[a,b]of[[3,3],[9,3],[6,6],[3,9],[9,9]])circle(c,30+a*30,60+b*30,3.5,'rgba(90,60,20,.8)');
   for(let y=0;y<13;y++)for(let x=0;x<13;x++){const v=this.b[y][x];if(v)circle(c,30+x*30,60+y*30,13,v===1?'#222':'#fff',v===2?'#aaa':null,1);}
   if(this.last)circle(c,30+this.last.x*30,60+this.last.y*30,3.5,UI.red);
   if(this.res&&this.res.w){const[[x1,y1],[x2,y2]]=this.res.w;line(c,30+x1*30,60+y1*30,30+x2*30,60+y2*30,UI.red,4);}
   T(c,this.res?(this.res.p===1?'あなたの勝ち！':this.res.p===2?'CPUの勝ち':'引き分け'):this.turn===1?'あなたの番（黒）':'CPU考え中…',210,20,16,UI.ink);
 }},

/* ---------- ドット＆ボックス ---------- */
{id:'dots',name:'ドット＆ボックス',emoji:'🔲',tag:'ボード',color:['#c4a7ff','#8e4ec6'],
 desc:'点と点の間に線を引き、四角形を閉じたら自分の陣地。閉じたらもう1回引ける。',
 help:'点と点の間をクリック / タップして線を引く',
 w:400,h:440,
 reset(api){this.api=api;this.h=[...Array(5)].map(()=>Array(4).fill(0));this.v=[...Array(4)].map(()=>Array(5).fill(0));this.o=[...Array(4)].map(()=>Array(4).fill(0));
   this.turn=1;this.cpuT=0;this.sc=[0,0,0];this.done=false;this.endT=0;},
 sides(r,c){return(this.h[r][c]?1:0)+(this.h[r+1][c]?1:0)+(this.v[r][c]?1:0)+(this.v[r][c+1]?1:0);},
 all(){const L=[];for(let r=0;r<5;r++)for(let c=0;c<4;c++)if(!this.h[r][c])L.push(['h',r,c]);for(let r=0;r<4;r++)for(let c=0;c<5;c++)if(!this.v[r][c])L.push(['v',r,c]);return L;},
 adj(l){const[t,r,c]=l,B=[];if(t==='h'){if(r>0)B.push([r-1,c]);if(r<4)B.push([r,c]);}else{if(c>0)B.push([r,c-1]);if(c<4)B.push([r,c]);}return B;},
 mark(l,p){const[t,r,c]=l;(t==='h'?this.h:this.v)[r][c]=p;},
 take(l,p){this.mark(l,p);let got=0;for(const[br,bc]of this.adj(l))if(this.sides(br,bc)===4&&!this.o[br][bc]){this.o[br][bc]=p;this.sc[p]++;got++;}
   if(this.sc[1]+this.sc[2]===16){this.turn=0;this.endT=1;return;}
   if(!got)this.turn=3-p;this.cpuT=.45;},
 sim(l){const sv=JSON.stringify([this.h,this.v]);this.mark(l,9);let n=0,go=true;
   while(go){go=false;for(const m of this.all())if(this.adj(m).some(([a,b])=>this.sides(a,b)===3)){this.mark(m,9);n++;go=true;break;}}
   [this.h,this.v]=JSON.parse(sv);return n;},
 cpu(){const L=this.all();let pick=L.find(l=>this.adj(l).some(([r,c])=>this.sides(r,c)===3));
   if(!pick){const safe=L.filter(l=>this.adj(l).every(([r,c])=>this.sides(r,c)<2));if(safe.length)pick=safe[ri(0,safe.length-1)];}
   if(!pick){let best=1e9;for(const l of L){const s=this.sim(l);if(s<best){best=s;pick=l;}}}
   this.take(pick,2);},
 pointer(t,x,y){if(t!=='down'||this.turn!==1)return;let best=26,pick=null;
   for(const l of this.all()){const[t2,r,c]=l;const mx=t2==='h'?95+c*70:60+c*70,my=t2==='h'?90+r*70:125+r*70;const d=dist(x,y,mx,my);if(d<best){best=d;pick=l;}}
   if(pick)this.take(pick,1);},
 update(dt){if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
   if(this.turn===0&&!this.done){this.endT-=dt;if(this.endT<=0){this.done=true;const a=this.sc[1],b=this.sc[2];this.api.setScore(a);
     return a>b?this.api.win(`勝ち！ ${a} 対 ${b}`):a===b?this.api.over(`引き分け ${a} 対 ${b}`):this.api.over(`負け… ${a} 対 ${b}`);}}},
 draw(c){bg(c,400,440);T(c,`あなた ${this.sc[1]}`,40,40,18,UI.blue,'left');T(c,`CPU ${this.sc[2]}`,360,40,18,UI.red,'right');
   for(let r=0;r<4;r++)for(let cc=0;cc<4;cc++){const o=this.o[r][cc];if(o){c.fillStyle=o===1?'rgba(61,111,214,.16)':'rgba(229,72,77,.16)';c.fillRect(60+cc*70,90+r*70,70,70);T(c,o===1?'あ':'C',95+cc*70,125+r*70,22,o===1?UI.blue:UI.red);}}
   for(let r=0;r<5;r++)for(let cc=0;cc<4;cc++){const v=this.h[r][cc];line(c,60+cc*70,90+r*70,130+cc*70,90+r*70,v?(v===1?UI.blue:UI.red):'#ecebe6',v?5:3);}
   for(let r=0;r<4;r++)for(let cc=0;cc<5;cc++){const v=this.v[r][cc];line(c,60+cc*70,90+r*70,60+cc*70,160+r*70,v?(v===1?UI.blue:UI.red):'#ecebe6',v?5:3);}
   for(let r=0;r<5;r++)for(let cc=0;cc<5;cc++)circle(c,60+cc*70,90+r*70,6,UI.ink);
   T(c,this.turn===1?'あなたの番（四角を閉じたらもう1回）':this.turn===2?'CPU考え中…':'',200,412,15,UI.sub);}},

/* ---------- 石取りゲーム ---------- */
{id:'nim',name:'石取りゲーム',emoji:'🪨',tag:'ボード',color:['#c9b79c','#8a7356'],
 desc:'好きな山から好きな数だけ石を取る。最後の1個を取った方の勝ち。何連勝できる？',
 help:'石をクリック / タップすると、その石から右側を全部取る',
 w:400,h:420,
 reset(api){this.api=api;this.newRound(true);},
 newRound(first){this.p=[ri(1,4),ri(2,6),ri(3,7),ri(1,5)].slice(0,first?3:ri(3,4));this.turn=1;this.cpuT=0;this.res=0;this.resT=0;this.hl=null;this.msg='';},
 take(i,n,who){this.p[i]-=n;this.msg=(who===1?'あなた':'CPU')+`が ${String.fromCharCode(65+i)} から ${n}個 取った`;
   if(this.p.every(v=>!v)){this.res=who;this.resT=1.2;this.turn=0;return;}this.turn=3-who;this.cpuT=.9;},
 cpu(){const x=this.p.reduce((a,b)=>a^b,0);let mv=null;
   if(x&&Math.random()>.15){for(let i=0;i<this.p.length;i++){const t=this.p[i]^x;if(t<this.p[i]){mv=[i,this.p[i]-t];break;}}}
   if(!mv){const idx=this.p.map((v,i)=>v?i:-1).filter(i=>i>=0);const i=idx[ri(0,idx.length-1)];mv=[i,ri(1,this.p[i])];}
   this.take(mv[0],mv[1],2);},
 pos(i,k){return{x:70+k*44,y:110+i*70};},
 hit(x,y){for(let i=0;i<this.p.length;i++)for(let k=0;k<this.p[i];k++){const s=this.pos(i,k);if(dist(x,y,s.x,s.y)<21)return[i,k];}return null;},
 pointer(t,x,y){this.hl=this.turn===1?this.hit(x,y):null;if(t==='down'&&this.hl){const[i,k]=this.hl;this.hl=null;this.take(i,this.p[i]-k,1);}},
 update(dt){if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
   if(this.res){this.resT-=dt;if(this.resT<=0){if(this.res===2)return this.api.over('CPUの勝ち…');this.api.addScore(1);this.newRound();}}},
 draw(c){bg(c,400,420);T(c,'連勝 '+score,200,30,20,UI.ink);
   T(c,this.res?(this.res===1?'あなたの勝ち！':'CPUの勝ち'):this.turn===1?'あなたの番':'CPU考え中…',200,58,15,UI.sub);
   this.p.forEach((n,i)=>{T(c,String.fromCharCode(65+i),30,110+i*70,16,UI.sub);
     for(let k=0;k<n;k++){const{x,y}=this.pos(i,k);const sel=this.hl&&this.hl[0]===i&&k>=this.hl[1];
       circle(c,x,y+3,18,'rgba(0,0,0,.08)');circle(c,x,y,18,sel?UI.yellow:'#9c8a72');circle(c,x-5,y-6,5,'rgba(255,255,255,.3)');}});
   T(c,this.msg,200,400,14,UI.sub);}},

/* ---------- マンカラ ---------- */
{id:'mancala',name:'マンカラ',emoji:'🫘',tag:'ボード',color:['#f0b67f','#c46a2f'],
 desc:'穴の豆を反時計回りに1つずつまいていく伝統ゲーム。自分のゴールに多く集めたら勝ち。',
 help:'下の段の穴をクリック / タップ。最後の豆が自分のゴールに入るともう1回！',
 w:480,h:300,
 reset(api){this.api=api;this.b=[4,4,4,4,4,4,0,4,4,4,4,4,4,0];this.turn=1;this.cpuT=0;this.msg='';this.endT=0;this.fin=false;},
 sow(b,i,p){let n=b[i],k=i;b[i]=0;while(n){k=(k+1)%14;if((p===1&&k===13)||(p===2&&k===6))continue;b[k]++;n--;}
   const own=p===1?k<=5:(k>=7&&k<=12),store=p===1?6:13;
   if(own&&b[k]===1&&b[12-k]>0){b[store]+=b[12-k]+1;b[k]=0;b[12-k]=0;}
   return k===store;},
 empty(b){return b.slice(0,6).every(v=>!v)||b.slice(7,13).every(v=>!v);},
 sweep(b){for(let i=0;i<6;i++){b[6]+=b[i];b[i]=0;}for(let i=7;i<13;i++){b[13]+=b[i];b[i]=0;}},
 move(i,p){const again=this.sow(this.b,i,p);
   if(this.empty(this.b)){this.sweep(this.b);this.turn=0;this.endT=1.2;return;}
   if(again)this.msg=(p===1?'あなた':'CPU')+'はもう1回！';else{this.turn=3-p;this.msg='';}this.cpuT=.8;},
 val(b,p,d){if(d===0||this.empty(b))return b[13]-b[6];const pits=p===2?[7,8,9,10,11,12]:[0,1,2,3,4,5];let best=p===2?-1e9:1e9,any=false;
   for(const i of pits){if(!b[i])continue;any=true;const b2=b.slice();const again=this.sow(b2,i,p);const v=this.val(b2,again?p:3-p,d-1);best=p===2?Math.max(best,v):Math.min(best,v);}
   return any?best:b[13]-b[6];},
 cpu(){let best=-1e9,mv=-1;for(let i=7;i<13;i++){if(!this.b[i])continue;const b2=this.b.slice();const again=this.sow(b2,i,2);const v=this.val(b2,again?2:1,3)+Math.random()*.5;if(v>best){best=v;mv=i;}}
   if(mv>=0)this.move(mv,2);},
 px(i){return i<=5?{x:90+i*60,y:205}:i===6?{x:450,y:150}:i<=12?{x:90+(12-i)*60,y:95}:{x:30,y:150};},
 pointer(t,x,y){if(t!=='down'||this.turn!==1)return;for(let i=0;i<6;i++){const p=this.px(i);if(dist(x,y,p.x,p.y)<28&&this.b[i]){this.move(i,1);return;}}},
 update(dt){if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
   if(this.turn===0&&!this.fin){this.endT-=dt;if(this.endT<=0){this.fin=true;const a=this.b[6],b=this.b[13];this.api.setScore(a);
     return a>b?this.api.win(`勝ち！ ${a} 対 ${b}`):a===b?this.api.over(`引き分け ${a} 対 ${b}`):this.api.over(`負け… ${a} 対 ${b}`);}}},
 draw(c){bg(c,480,300);box(c,6,40,468,220,40,'#c8935a');box(c,12,46,456,208,36,'#d9a76d');
   for(let i=0;i<14;i++){const p=this.px(i),st=i===6||i===13;
     if(st)box(c,p.x-22,p.y-70,44,140,22,'#a8743f');else circle(c,p.x,p.y,26,'#a8743f');
     if(this.turn===1&&i<=5&&this.b[i])circle(c,p.x,p.y,28,null,'rgba(61,111,214,.6)',2);
     const n=this.b[i];for(let k=0;k<Math.min(n,16);k++){const a=k*2.4,r=st?Math.min(14,3+k*1.1):Math.min(14,3+k*1.5);circle(c,p.x+Math.cos(a)*r*.75,p.y+Math.sin(a)*r*(st?3:.75),4.5,PAL[k%8]);}
     T(c,String(n),p.x,st?p.y+84:(i<=5?p.y+40:p.y-40),14,UI.ink);}
   T(c,'← CPUのゴール',10,22,12,UI.sub,'left');T(c,'あなたのゴール →',470,22,12,UI.sub,'right');
   T(c,this.msg||(this.turn===1?'あなたの番（下の段）':this.turn===2?'CPU考え中…':''),240,284,15,UI.sub);}},

/* ---------- 海戦ゲーム ---------- */
{id:'ship',name:'海戦ゲーム',emoji:'🚢',tag:'ボード',color:['#7fc8f8','#1f6fb2'],
 desc:'見えない敵の船を砲撃で探し出せ。先に相手の船を全部沈めた方の勝ち。',
 help:'左の海（敵）のマスをクリック / タップして砲撃',
 w:800,h:450,SH:[4,3,3,2,2],
 grid(){const g=[...Array(8)].map(()=>Array(8).fill(0)),ships=[];
   for(const L of this.SH){for(;;){const hz=Math.random()<.5,x=ri(0,hz?8-L:7),y=ri(0,hz?7:8-L),cells=[];for(let k=0;k<L;k++)cells.push(hz?[x+k,y]:[x,y+k]);
     if(cells.every(([a,b])=>!g[b][a])){const id=ships.length+1;cells.forEach(([a,b])=>g[b][a]=id);ships.push({cells,hit:0});break;}}}
   return{g,ships,shot:[...Array(8)].map(()=>Array(8).fill(0))};},
 reset(api){this.api=api;this.me=this.grid();this.en=this.grid();this.turn=1;this.cpuT=0;this.msg='敵の海を砲撃しよう';this.shots=0;this.fin=false;this.endT=0;},
 fire(side,x,y){const s=side.shot;if(s[y][x])return null;const id=side.g[y][x];if(id){s[y][x]=2;const sh=side.ships[id-1];sh.hit++;return sh.hit===sh.cells.length?'sunk':'hit';}s[y][x]=1;return'miss';},
 alive(side){return side.ships.some(s=>s.hit<s.cells.length);},
 cpu(){const s=this.me.shot,cand=[];
   for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(s[y][x]===2){const sh=this.me.ships[this.me.g[y][x]-1];if(sh.hit<sh.cells.length)
     for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<8&&b<8&&!s[b][a])cand.push([a,b]);}}
   let mv;if(cand.length)mv=cand[ri(0,cand.length-1)];
   else{let free=[];for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(!s[y][x]&&(x+y)%2===0)free.push([x,y]);
     if(!free.length)for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(!s[y][x])free.push([x,y]);mv=free[ri(0,free.length-1)];}
   const r=this.fire(this.me,mv[0],mv[1]);this.msg='CPUの砲撃：'+(r==='miss'?'はずれ':r==='hit'?'命中された！':'撃沈された！');
   if(!this.alive(this.me)){this.turn=0;this.won=false;this.endT=1.2;return;}this.turn=1;},
 pointer(t,x,y){if(t!=='down'||this.turn!==1)return;const c=cellAt(x,y,50,70,40,8,8);if(!c)return;const r=this.fire(this.en,c.x,c.y);if(!r)return;this.shots++;
   this.msg='あなたの砲撃：'+(r==='miss'?'はずれ':r==='hit'?'命中！':'撃沈！');
   if(!this.alive(this.en)){this.turn=0;this.won=true;this.endT=1.2;return;}this.turn=2;this.cpuT=.7;},
 update(dt){if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
   if(this.turn===0&&!this.fin){this.endT-=dt;if(this.endT<=0){this.fin=true;
     if(this.won){this.api.setScore(Math.max(10,100-this.shots));return this.api.win(`勝利！ ${this.shots}発で全滅させた`);}return this.api.over('全艦沈没…');}}},
 drawGrid(c,side,ox,oy,cs,showShips){box(c,ox-2,oy-2,cs*8+4,cs*8+4,6,'#d8ecfb');
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){const X=ox+x*cs,Y=oy+y*cs,id=side.g[y][x],s=side.shot[y][x];
     c.strokeStyle='#b5d8f2';c.lineWidth=1;c.strokeRect(X+.5,Y+.5,cs-1,cs-1);
     const sunk=id&&side.ships[id-1].hit===side.ships[id-1].cells.length;
     if(id&&(showShips||sunk))box(c,X+2,Y+2,cs-4,cs-4,4,sunk?'#6b6b75':'#8a94a6');
     if(s===1)circle(c,X+cs/2,Y+cs/2,cs*.12,'#5b8cc7');
     if(s===2){line(c,X+cs*.25,Y+cs*.25,X+cs*.75,Y+cs*.75,UI.red,3);line(c,X+cs*.75,Y+cs*.25,X+cs*.25,Y+cs*.75,UI.red,3);}}},
 draw(c){bg(c,800,450);T(c,'敵の海',210,44,17,UI.ink);this.drawGrid(c,this.en,50,70,40,state==='over');
   T(c,'あなたの海',590,44,17,UI.ink);this.drawGrid(c,this.me,430,70,40,true);
   const left=s=>s.ships.filter(x=>x.hit<x.cells.length).length;T(c,this.msg,400,412,16,UI.sub);T(c,`残り 敵${left(this.en)}隻 / 味方${left(this.me)}隻`,400,436,13,UI.sub);}},

/* ---------- チェッカー ---------- */
{id:'checkers',name:'チェッカー',emoji:'🔴',tag:'ボード',color:['#f2a65a','#b5562b'],
 desc:'ななめに進んで相手のコマを飛び越えて取る。取れるときは必ず取る。一番奥まで行くとキングに。',
 help:'自分のコマ（赤）をクリック → 行き先をクリック',
 w:400,h:460,
 reset(api){this.api=api;this.b=[...Array(8)].map((_,y)=>Array(8).fill(0).map((_,x)=>(x+y)%2===1?(y<3?2:y>4?1:0):0));this.turn=1;this.sel=null;this.cpuT=0;this.last=null;this.endT=0;this.fin=false;},
 own(v,p){return v&&(v%2===1?1:2)===p;},
 dirs(v){return v>2?[[1,1],[-1,1],[1,-1],[-1,-1]]:(v===1?[[1,-1],[-1,-1]]:[[1,1],[-1,1]]);},
 jumps(b,x,y,v,path,out){let any=false;
   for(const[dx,dy]of this.dirs(v)){const mx=x+dx,my=y+dy,tx=x+dx*2,ty=y+dy*2;if(tx<0||ty<0||tx>7||ty>7)continue;const m=b[my][mx];
     if(m&&!this.own(m,v%2===1?1:2)&&b[ty][tx]===0){any=true;const b2=b.map(r=>r.slice());b2[y][x]=0;b2[my][mx]=0;let nv=v;const pro=(nv===1&&ty===0)||(nv===2&&ty===7);if(pro)nv+=2;b2[ty][tx]=nv;
       const p2=path.concat([[tx,ty,mx,my]]);if(pro)out.push(p2);else this.jumps(b2,tx,ty,nv,p2,out);}}
   if(!any&&path.length)out.push(path);},
 moves(b,p){const J=[],S=[];for(let y=0;y<8;y++)for(let x=0;x<8;x++){const v=b[y][x];if(!this.own(v,p))continue;const out=[];this.jumps(b,x,y,v,[],out);
   for(const path of out)J.push({x,y,path});for(const[dx,dy]of this.dirs(v)){const tx=x+dx,ty=y+dy;if(tx>=0&&ty>=0&&tx<8&&ty<8&&!b[ty][tx])S.push({x,y,path:[[tx,ty]]});}}
   return J.length?J:S;},
 apply(b,m){let v=b[m.y][m.x];b[m.y][m.x]=0;let x=m.x,y=m.y;for(const st of m.path){x=st[0];y=st[1];if(st.length>2)b[st[3]][st[2]]=0;}if((v===1&&y===0)||(v===2&&y===7))v+=2;b[y][x]=v;},
 ev(b){let s=0;for(const r of b)for(const v of r){if(!v)continue;const w=v>2?1.6:1;s+=v%2===0?w:-w;}return s;},
 mm(b,d,p){const ms=this.moves(b,p);if(!ms.length)return p===2?-100:100;if(!d)return this.ev(b);let best=p===2?-1e9:1e9;
   for(const m of ms){const b2=b.map(r=>r.slice());this.apply(b2,m);const v=this.mm(b2,d-1,3-p);best=p===2?Math.max(best,v):Math.min(best,v);}return best;},
 after(p){if(!this.moves(this.b,p).length){this.turn=0;this.winner=3-p;this.endT=1.2;return;}this.turn=p;this.cpuT=.6;this.sel=null;},
 cpu(){const ms=this.moves(this.b,2);let best=-1e9,bm=ms[0];
   for(const m of ms){const b2=this.b.map(r=>r.slice());this.apply(b2,m);const v=this.mm(b2,3,1)+Math.random()*.3;if(v>best){best=v;bm=m;}}
   this.apply(this.b,bm);this.last=bm;this.after(1);},
 pointer(t,x,y){if(t!=='down'||this.turn!==1)return;const c=cellAt(x,y,20,60,45,8,8);if(!c)return;const ms=this.moves(this.b,1);
   if(this.sel){const m=ms.find(m=>m.x===this.sel.x&&m.y===this.sel.y&&m.path[m.path.length-1][0]===c.x&&m.path[m.path.length-1][1]===c.y);
     if(m){this.apply(this.b,m);this.last=m;this.after(2);return;}}
   this.sel=ms.some(m=>m.x===c.x&&m.y===c.y)?{x:c.x,y:c.y}:null;},
 update(dt){if(this.turn===2){this.cpuT-=dt;if(this.cpuT<=0)this.cpu();}
   if(this.turn===0&&!this.fin){this.endT-=dt;if(this.endT<=0){this.fin=true;let n=0;for(const r of this.b)for(const v of r)if(this.own(v,1))n++;this.api.setScore(this.winner===1?n*10:n);
     return this.winner===1?this.api.win('あなたの勝ち！'):this.api.over('CPUの勝ち…');}}},
 draw(c){bg(c,400,460);
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){c.fillStyle=(x+y)%2?'#b58863':'#f0d9b5';c.fillRect(20+x*45,60+y*45,45,45);}
   const ms=this.turn===1?this.moves(this.b,1):[];
   if(this.turn===1)for(const m of ms){if(!this.sel)circle(c,42.5+m.x*45,82.5+m.y*45,21,null,'rgba(245,180,0,.8)',2);}
   if(this.sel){box(c,20+this.sel.x*45,60+this.sel.y*45,45,45,0,null,UI.yellow,3);
     for(const m of ms)if(m.x===this.sel.x&&m.y===this.sel.y){const e=m.path[m.path.length-1];circle(c,42.5+e[0]*45,82.5+e[1]*45,8,'rgba(245,180,0,.85)');}}
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){const v=this.b[y][x];if(!v)continue;const cx=42.5+x*45,cy=82.5+y*45;
     circle(c,cx,cy+3,17,'rgba(0,0,0,.25)');circle(c,cx,cy,17,v%2===1?UI.red:'#2a2a2a');circle(c,cx,cy,11,null,'rgba(255,255,255,.3)',2);if(v>2)T(c,'♛',cx,cy+1,16,UI.yellow);}
   T(c,this.turn===1?(ms.length&&ms[0].path[0].length>2?'あなたの番（取れるコマは必ず取る）':'あなたの番'):this.turn===2?'CPU考え中…':'',200,30,15,UI.ink);
 }},

/* ---------- すごろく ---------- */
{id:'sugoroku',name:'すごろく',emoji:'🎲',tag:'ボード',color:['#ffd27a','#e08a00'],
 desc:'サイコロをふってゴールの100を目指す。はしごで上がって、すべり台で下がる。CPUと競争！',
 help:'「サイコロ」ボタン / スペースでサイコロを振る',
 w:800,h:450,
 LAD:{3:22,8:30,21:42,28:55,50:67,71:92,80:99},
 SLD:{27:7,40:19,54:34,66:45,88:68,95:75,98:79},
 reset(api){this.api=api;this.pos=[0,0];this.turn=0;this.dice=1;this.ph='idle';this.msg='サイコロを振ろう';this.turns=0;this.fin=false;},
 xy(n){if(n<=0)return{x:20,y:386};const i=n-1,r=Math.floor(i/10),c=r%2?9-i%10:i%10;return{x:60+c*36,y:62+(9-r)*36};},
 roll(){if(this.ph!=='idle')return;this.ph='rolling';this.rollT=.6;},
 key(c,d){if(d&&c==='Space'&&this.turn===0)this.roll();},
 pointer(t,x,y){if(t==='down'&&this.turn===0&&inR(x,y,530,290,160,56))this.roll();},
 update(dt){
   if(this.ph==='rolling'){this.rollT-=dt;this.dice=ri(1,6);if(this.rollT<=0){this.left=this.dice;this.ph='moving';this.wait=.2;if(this.turn===0)this.turns++;}}
   else if(this.ph==='moving'){this.wait-=dt;if(this.wait>0)return;this.wait=.16;const p=this.turn;
     if(this.left>0){this.pos[p]=Math.min(100,this.pos[p]+1);this.left--;if(this.pos[p]===100)this.left=0;return;}
     const n=this.pos[p],to=this.LAD[n]||this.SLD[n];
     if(to){this.msg=(p?'CPU':'あなた')+(this.LAD[n]?'：はしごで上へ！':'：すべり台で下へ…');this.pos[p]=to;this.wait=.5;return;}
     if(n===100){this.ph='end';this.endT=1;return;}
     this.turn=1-p;this.ph=this.turn?'cpuwait':'idle';this.cpuT=.7;}
   else if(this.ph==='cpuwait'){this.cpuT-=dt;if(this.cpuT<=0){this.ph='idle';this.roll();}}
   else if(this.ph==='end'&&!this.fin){this.endT-=dt;if(this.endT<=0){this.fin=true;
     if(this.turn===0){this.api.setScore(Math.max(10,120-this.turns*4));return this.api.win(`ゴール！ ${this.turns}回でクリア`);}return this.api.over('CPUが先にゴール…');}}
 },
 draw(c){bg(c,800,450);
   for(let n=1;n<=100;n++){const p=this.xy(n);c.fillStyle=(Math.floor((n-1)/10)+n)%2?'#fff7e6':'#ffe9c2';c.fillRect(p.x-18,p.y-18,36,36);T(c,String(n),p.x-15,p.y-11,9,UI.sub,'left');}
   T(c,'GOAL',this.xy(100).x,this.xy(100).y+6,10,UI.red);
   for(const a in this.LAD){const p=this.xy(+a),q=this.xy(this.LAD[a]),dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy),nx=-dy/L*7,ny=dx/L*7;
     line(c,p.x+nx,p.y+ny,q.x+nx,q.y+ny,'#8b5a2b',3);line(c,p.x-nx,p.y-ny,q.x-nx,q.y-ny,'#8b5a2b',3);
     for(let k=.08;k<1;k+=16/L){const x=p.x+dx*k,y=p.y+dy*k;line(c,x+nx,y+ny,x-nx,y-ny,'#8b5a2b',2);}}
   c.lineCap='round';for(const a in this.SLD){const p=this.xy(+a),q=this.xy(this.SLD[a]);c.beginPath();c.moveTo(p.x,p.y);c.quadraticCurveTo((p.x+q.x)/2+40,(p.y+q.y)/2,q.x,q.y);c.strokeStyle='rgba(229,72,77,.5)';c.lineWidth=9;c.stroke();}c.lineCap='butt';
   const same=this.pos[0]===this.pos[1];
   [1,0].forEach(i=>{const p=this.xy(this.pos[i]);const ox=same?(i?8:-8):0;circle(c,p.x+ox,p.y+2,11,i?UI.red:UI.blue,'#fff',2.5);T(c,i?'C':'あ',p.x+ox,p.y+3,11,'#fff');});
   btn(c,530,290,160,56,'サイコロ',{on:this.turn===0&&this.ph==='idle',fill:'#fff',size:19});
   drawDie(c,570,160,80,this.dice);
   T(c,this.turn===0?'あなたの番':'CPUの番',610,70,22,this.turn===0?UI.blue:UI.red);T(c,this.msg,610,110,15,UI.sub);
   T(c,'あ＝あなた　C＝CPU',610,390,13,UI.sub);
 }}
);
