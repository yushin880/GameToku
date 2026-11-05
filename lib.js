'use strict';
/* 追加ゲーム共通ヘルパー（index.html の rr / T / rnd / ri / clamp / api / state / score を使う） */
const UI={bg:'#fbfaf7',ink:'#2a2a2a',sub:'#8b8b86',line:'#e5e4df',soft:'#f1f0eb',
  red:'#e5484d',green:'#30a46c',blue:'#3d6fd6',yellow:'#f5b400',purple:'#8e4ec6',orange:'#f76b15',teal:'#12a594',pink:'#e93d82'};
const PAL=[UI.red,UI.blue,UI.green,UI.yellow,UI.purple,UI.orange,UI.teal,UI.pink];
function addGames(...gs){GAMES.push(...gs);}
function inR(px,py,x,y,w,h){return px>=x&&px<=x+w&&py>=y&&py<=y+h;}
function dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by);}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
function bg(c,w,h,col){c.fillStyle=col||UI.bg;c.fillRect(0,0,w,h);}
function circle(c,x,y,r,fill,stroke,lw){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||2;c.stroke();}}
function box(c,x,y,w,h,r,fill,stroke,lw){rr(c,x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||1.5;c.stroke();}}
function line(c,x1,y1,x2,y2,col,lw){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=col;c.lineWidth=lw||2;c.stroke();}
/* ボタン：o.on=押せる状態 / o.fill 背景色 */
function btn(c,x,y,w,h,label,o){o=o||{};const off=o.on===false;
  box(c,x,y,w,h,o.r==null?10:o.r,off?UI.soft:(o.fill||'#fff'),o.stroke||UI.line,1.5);
  T(c,label,x+w/2,y+h/2+1,o.size||17,off?'#bbb':(o.color||UI.ink));}
/* 画面下などのメッセージ帯 */
function banner(c,w,y,text,col){T(c,text,w/2,y,16,col||UI.sub);}
/* トランプ：rank 1-13, suit 0-3 (♠♥♦♣) */
const SUITS=['♠','♥','♦','♣'],RANKS=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function newDeck(){const d=[];for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({r,s});return shuffle(d);}
function drawCard(c,x,y,w,h,cd,faceUp,hi){
  if(!faceUp){box(c,x,y,w,h,8,'#3d6fd6','#2c55ad',2);c.save();rr(c,x+4,y+4,w-8,h-8,5);c.clip();c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=1.5;
    for(let i=-h;i<w;i+=8){c.beginPath();c.moveTo(x+i,y);c.lineTo(x+i+h,y+h);c.stroke();}c.restore();return;}
  box(c,x,y,w,h,8,'#fff',hi?UI.blue:'#cfcec8',hi?3:1.5);
  const red=cd.s===1||cd.s===2,col=red?UI.red:UI.ink;
  T(c,RANKS[cd.r],x+8,y+14,Math.min(18,w*.28),col,'left');
  T(c,SUITS[cd.s],x+w/2,y+h/2+4,Math.min(34,w*.5),col);
}
/* サイコロ */
function drawDie(c,x,y,s,v,o){o=o||{};box(c,x,y,s,s,s*.18,o.fill||'#fff',o.hold?UI.blue:'#cfcec8',o.hold?3:1.5);
  const p=s/4,d=[[],[[2,2]],[[1,1],[3,3]],[[1,1],[2,2],[3,3]],[[1,1],[3,1],[1,3],[3,3]],[[1,1],[3,1],[2,2],[1,3],[3,3]],[[1,1],[3,1],[1,2],[3,2],[1,3],[3,3]]][v]||[];
  for(const[a,b]of d)circle(c,x+a*p,y+b*p,s*.09,v===1?UI.red:UI.ink);}
/* 絵文字を一度だけ画像化して使い回す（回転させて何度も描くとき用） */
const _spr={};
function emojiSprite(e,size){const k=e+size;if(_spr[k])return _spr[k];const cv=document.createElement('canvas'),s=Math.ceil(size*1.4),d=2;cv.width=cv.height=s*d;const x=cv.getContext('2d');x.scale(d,d);
  x.font=`${size}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(e,s/2,s/2+size*.05);return _spr[k]={cv,s};}
function drawEmoji(c,e,x,y,size,rot,alpha){const sp=emojiSprite(e,size);c.save();c.translate(x,y);if(rot)c.rotate(rot);if(alpha!=null)c.globalAlpha=alpha;c.drawImage(sp.cv,-sp.s/2,-sp.s/2,sp.s,sp.s);c.restore();}
/* 格子盤の座標変換ヘルパー */
function cellAt(x,y,ox,oy,cs,cols,rows){const cx=Math.floor((x-ox)/cs),cy=Math.floor((y-oy)/cs);return(cx>=0&&cy>=0&&cx<cols&&cy<rows)?{x:cx,y:cy}:null;}
