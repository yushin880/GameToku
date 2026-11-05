'use strict';
/* パック5：カード・サイコロ・運だめし 10本 */
addGames(

/* ---------- ハイ＆ロー ---------- */
{id:'highlow',name:'ハイ＆ロー',emoji:'🂠',tag:'テーブル',color:['#b8c0ff','#5e60ce'],
 desc:'次のカードが今のカードより「大きい」か「小さい」かを当てよう。何連続で当てられる？',
 help:'「ハイ」「ロー」をクリック / タップ（↑ ↓ キーでもOK）。同じ数字は当たり',
 w:400,h:440,
 reset(api){this.api=api;this.deck=newDeck();this.cur=this.deck.pop();this.nx=null;this.fb=0;},
 guess(hi){if(this.fb>0)return;if(this.deck.length<2)this.deck=newDeck();this.nx=this.deck.pop();const ok=this.nx.r===this.cur.r||(hi?this.nx.r>this.cur.r:this.nx.r<this.cur.r);this.res=ok;this.fb=1;if(ok)this.api.addScore(1);},
 key(c,d){if(!d)return;if(c==='ArrowUp')this.guess(true);if(c==='ArrowDown')this.guess(false);},
 pointer(t,x,y){if(t!=='down')return;if(inR(x,y,40,340,150,60))this.guess(true);if(inR(x,y,210,340,150,60))this.guess(false);},
 update(dt){if(this.fb>0){this.fb-=dt;if(this.fb<=0){if(!this.res)return this.api.over(`はずれ！ ${score}連続正解`);this.cur=this.nx;this.nx=null;}}},
 draw(c){bg(c,400,440,'#f3f6f1');T(c,`連続正解 ${score}`,200,36,20,UI.ink);
   drawCard(c,60,90,120,170,this.cur,true);if(this.nx)drawCard(c,220,90,120,170,this.nx,true,true);else drawCard(c,220,90,120,170,null,false);
   if(this.fb>0)T(c,this.res?'当たり！':'はずれ…',200,300,24,this.res?UI.green:UI.red);else T(c,'次のカードは？',200,300,16,UI.sub);
   btn(c,40,340,150,60,'▲ ハイ',{size:22,on:this.fb<=0});btn(c,210,340,150,60,'▼ ロー',{size:22,on:this.fb<=0});}},

/* ---------- ブラックジャック ---------- */
{id:'blackjack',name:'ブラックジャック',emoji:'🎰',tag:'テーブル',color:['#80ed99','#2d6a4f'],
 desc:'カードの合計を21に近づけてディーラーと勝負。21をこえたら負け。10回勝負でチップを増やそう。',
 help:'賭け金を選んで、ヒット（もう1枚）/ スタンド（勝負）/ ダブル（賭け2倍で1枚だけ）',
 w:800,h:450,
 reset(api){this.api=api;this.chips=100;this.hand=0;this.ph='bet';this.msg='賭け金を選ぼう';this.api.setScore(this.chips);},
 val(h){let s=0,a=0;for(const c of h){s+=c.r>=10?10:c.r===1?11:c.r;if(c.r===1)a++;}while(s>21&&a){s-=10;a--;}return s;},
 deal(bet){if(this.chips<bet)return;this.bet=bet;this.chips-=bet;this.deck=newDeck();this.p=[this.deck.pop(),this.deck.pop()];this.d=[this.deck.pop(),this.deck.pop()];this.ph='play';this.msg='';
   if(this.val(this.p)===21)this.finish();},
 hit(){if(this.ph!=='play')return;this.p.push(this.deck.pop());if(this.val(this.p)>21)this.end('バースト… 負け',0);else if(this.val(this.p)===21)this.finish();},
 dbl(){if(this.ph!=='play'||this.p.length!==2||this.chips<this.bet)return;this.chips-=this.bet;this.bet*=2;this.p.push(this.deck.pop());if(this.val(this.p)>21)this.end('バースト… 負け',0);else this.finish();},
 finish(){this.ph='dealer';this.t=.6;},
 end(msg,pay){this.chips+=pay;this.msg=msg;this.ph='result';this.hand++;this.api.setScore(this.chips);},
 pointer(t,x,y){if(t!=='down')return;
   if(this.ph==='bet'){[10,20,50].forEach((b,i)=>{if(inR(x,y,160+i*170,372,150,56))this.deal(b);});}
   else if(this.ph==='play'){if(inR(x,y,160,372,150,56))this.hit();if(inR(x,y,330,372,150,56))this.finish();if(inR(x,y,500,372,150,56))this.dbl();}
   else if(this.ph==='result'&&inR(x,y,315,372,170,56))this.next();},
 key(c,d){if(!d)return;if(this.ph==='play'){if(c==='KeyH'||c==='ArrowUp')this.hit();if(c==='KeyS'||c==='ArrowDown')this.finish();}if(this.ph==='result'&&(c==='Enter'||c==='Space'))this.next();},
 next(){if(this.hand>=10||this.chips<10){return this.chips>100?this.api.win(`チップ ${this.chips}枚！`):this.api.over(`チップ ${this.chips}枚`);}this.ph='bet';this.msg='賭け金を選ぼう';},
 update(dt){if(this.ph!=='dealer')return;this.t-=dt;if(this.t>0)return;
   const dv=this.val(this.d),pv=this.val(this.p);if(dv<17){this.d.push(this.deck.pop());this.t=.6;return;}
   const bj=pv===21&&this.p.length===2;
   if(dv>21)this.end('ディーラーがバースト！ 勝ち',this.bet*2);else if(pv>dv)this.end(bj?'ブラックジャック！ 勝ち':'勝ち！',bj?Math.floor(this.bet*2.5):this.bet*2);else if(pv===dv)this.end('引き分け',this.bet);else this.end('負け…',0);},
 draw(c){bg(c,800,450,'#2d6a4f');c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.ellipse(400,200,380,190,0,0,7);c.fill();
   T(c,`チップ ${this.chips}`,20,28,18,'#fff','left');T(c,`${Math.min(this.hand+1,10)} / 10 回目`,780,28,15,'rgba(255,255,255,.7)','right');
   if(this.ph!=='bet'){const hide=this.ph==='play';T(c,'ディーラー'+(hide?'':' '+this.val(this.d)),400,60,16,'#fff');
     this.d.forEach((cd,i)=>drawCard(c,400-this.d.length*36+i*72+4,76,64,92,cd,!(hide&&i===1)));
     T(c,'あなた '+this.val(this.p)+(this.bet?`（賭け ${this.bet}）`:''),400,196,16,'#fff');this.p.forEach((cd,i)=>drawCard(c,400-this.p.length*36+i*72+4,212,64,92,cd,true));}
   T(c,this.msg,400,336,21,'#ffe08a');
   if(this.ph==='bet')[10,20,50].forEach((b,i)=>btn(c,160+i*170,372,150,56,`${b}枚 賭ける`,{size:16,on:this.chips>=b}));
   if(this.ph==='play'){btn(c,160,372,150,56,'ヒット',{size:19});btn(c,330,372,150,56,'スタンド',{size:19});btn(c,500,372,150,56,'ダブル',{size:19,on:this.p.length===2&&this.chips>=this.bet});}
   if(this.ph==='result')btn(c,315,372,170,56,this.hand>=10||this.chips<10?'結果を見る':'次の勝負へ',{size:18});}},

/* ---------- ビデオポーカー ---------- */
{id:'poker',name:'ビデオポーカー',emoji:'♠️',tag:'テーブル',color:['#ffb4a2','#b5179e'],
 desc:'5枚のカードから残したいカードを選んで1回だけ交換。強い役ほど配当アップ。15回勝負。',
 help:'カードをクリックで「残す」、配る / 交換 ボタン（スペース）で進める',
 w:800,h:450,
 PAY:[['ロイヤルストレートフラッシュ',250],['ストレートフラッシュ',50],['フォーカード',25],['フルハウス',9],['フラッシュ',6],['ストレート',4],['スリーカード',3],['ツーペア',2],['ジャックス以上のワンペア',1]],
 reset(api){this.api=api;this.cred=100;this.hand=0;this.ph='deal';this.cards=[];this.hold=[];this.res='';this.api.setScore(this.cred);},
 rank(h){const r=h.map(c=>c.r===1?14:c.r).sort((a,b)=>a-b),fl=h.every(c=>c.s===h[0].s),cnt={};r.forEach(v=>cnt[v]=(cnt[v]||0)+1);const n=Object.values(cnt).sort((a,b)=>b-a);
   let st=r.every((v,i)=>!i||v===r[i-1]+1);if(!st&&r.join()==='2,3,4,5,14')st=true;
   if(st&&fl)return r[0]===10?0:1;if(n[0]===4)return 2;if(n[0]===3&&n[1]===2)return 3;if(fl)return 4;if(st)return 5;if(n[0]===3)return 6;if(n[0]===2&&n[1]===2)return 7;
   if(n[0]===2){const p=+Object.keys(cnt).find(k=>cnt[k]===2);if(p>=11)return 8;}return -1;},
 act(){if(this.ph==='deal'){if(this.cred<5)return;this.cred-=5;this.deck=newDeck();this.cards=[0,1,2,3,4].map(()=>this.deck.pop());this.hold=[false,false,false,false,false];this.ph='draw';this.res='';this.api.setScore(this.cred);}
   else if(this.ph==='draw'){this.cards=this.cards.map((c,i)=>this.hold[i]?c:this.deck.pop());const k=this.rank(this.cards);const win=k>=0?this.PAY[k][1]*5:0;this.cred+=win;this.res=k>=0?`${this.PAY[k][0]}！ +${win}`:'役なし';
     this.hand++;this.api.setScore(this.cred);this.ph=this.hand>=15||this.cred<5?'end':'deal';if(this.ph==='end')this.endT=1.5;}},
 key(c,d){if(!d)return;if(c==='Space'||c==='Enter')this.act();const m=c.match(/^(Digit|Numpad)([1-5])$/);if(m&&this.ph==='draw')this.hold[+m[2]-1]=!this.hold[+m[2]-1];},
 pointer(t,x,y){if(t!=='down')return;if(this.ph==='draw')for(let i=0;i<5;i++)if(inR(x,y,20+i*100,140,90,130))this.hold[i]=!this.hold[i];if(inR(x,y,180,340,160,56))this.act();},
 update(dt){if(this.ph==='end'){this.endT-=dt;if(this.endT<=0){this.ph='x';return this.cred>100?this.api.win(`クレジット ${this.cred}`):this.api.over(`クレジット ${this.cred}`);}}},
 draw(c){bg(c,800,450,'#1d3557');T(c,`クレジット ${this.cred}`,20,26,17,'#fff','left');T(c,`${Math.min(this.hand+1,15)} / 15 回目（1回 5枚）`,780,26,14,'rgba(255,255,255,.7)','right');
   box(c,540,56,244,300,12,'rgba(255,255,255,.07)');T(c,'配当表',662,78,13,'rgba(255,255,255,.6)');
   this.PAY.forEach(([n,p],i)=>{const y=106+i*28;T(c,n,554,y,12,'rgba(255,255,255,.8)','left');T(c,'×'+p,770,y,13,'#ffe08a','right');});
   for(let i=0;i<5;i++){const x=20+i*100;if(this.cards[i])drawCard(c,x,140,90,130,this.cards[i],true,this.hold[i]);else drawCard(c,x,140,90,130,null,false);if(this.hold[i])T(c,'残す',x+45,288,15,'#ffe08a');}
   T(c,this.res,260,104,21,'#ffe08a');
   btn(c,180,340,160,56,this.ph==='draw'?'交換する':'配る（5枚）',{size:17,on:this.ph==='draw'||(this.ph==='deal'&&this.cred>=5)});}},

/* ---------- スロット ---------- */
{id:'slot',name:'スロット',emoji:'🍒',tag:'テーブル',color:['#ffd6e0','#ef476f'],
 desc:'回るリールを1つずつ止めて、同じ絵柄をそろえよう。目押しで7をねらえ！ 30回勝負。',
 help:'スタート（スペース）でリールが回る。もう一度押すたびに左から順に止まる',
 w:420,h:440,
 S:['🍒','🍋','🔔','🍇','⭐','💎','7️⃣'],PAY:[5,8,10,12,20,40,100],
 reset(api){this.api=api;this.coin=50;this.spins=0;this.r=[0,0,0].map(()=>({pos:ri(0,6)*1,spd:0,stop:true}));this.ph='idle';this.msg='';this.api.setScore(this.coin);},
 press(){if(this.ph==='idle'){if(this.coin<3)return;this.coin-=3;this.api.setScore(this.coin);this.r.forEach((r,i)=>{r.spd=10+i*1.5;r.stop=false;r.target=null;});this.ph='spin';this.k=0;this.msg='';}
   else if(this.ph==='spin'&&this.k<3){const r=this.r[this.k];r.target=Math.ceil(r.pos+.15);this.k++;}},
 key(c,d){if(d&&(c==='Space'||c==='Enter'))this.press();},
 pointer(t,x,y){if(t==='down'&&inR(x,y,120,340,180,60))this.press();},
 update(dt){if(this.ph==='end'){this.endT-=dt;if(this.endT<=0){this.ph='x';return this.coin>50?this.api.win(`コイン ${this.coin}枚！`):this.api.over(`コイン ${this.coin}枚`);}return;}
   if(this.ph!=='spin')return;for(const r of this.r){if(r.stop)continue;if(r.target!=null){r.pos=Math.min(r.target,r.pos+r.spd*dt*.6);if(r.pos>=r.target){r.pos=r.target;r.stop=true;}}else r.pos+=r.spd*dt;}
   if(this.r.every(r=>r.stop)){const s=this.r.map(r=>((Math.round(r.pos)%7)+7)%7);let win=0;
     if(s[0]===s[1]&&s[1]===s[2]){win=this.PAY[s[0]];this.msg=`${this.S[s[0]]} そろった！ +${win}`;}else if(s.filter(v=>v===0).length===2){win=3;this.msg='🍒 2つ +3';}else this.msg='はずれ';
     this.coin+=win;this.spins++;this.api.setScore(this.coin);this.ph='idle';if(this.spins>=30||this.coin<3){this.ph='end';this.endT=1.2;}}},
 draw(c){bg(c,420,440,'#3a0ca3');
   T(c,`コイン ${this.coin}`,20,28,17,'#fff','left');T(c,`${Math.min(this.spins+1,30)} / 30 回（1回 3枚）`,400,28,13,'rgba(255,255,255,.7)','right');
   box(c,40,70,340,200,20,'#fff');
   for(let i=0;i<3;i++){const r=this.r[i],x=50+i*110;c.save();c.beginPath();c.rect(x,80,100,180);c.clip();box(c,x,80,100,180,10,'#f7f3ff');
     const base=Math.floor(r.pos),fr=r.pos-base;for(let k=-2;k<=2;k++){const idx=(((base+k)%7)+7)%7,y=170+(k-fr)*70;T(c,this.S[idx],x+50,y,44,UI.ink);}c.restore();
     if(r.stop&&this.ph!=='spin')box(c,x,135,100,70,8,null,'#ffd166',3);}
   line(c,40,170,380,170,'rgba(239,71,111,.5)',2);
   T(c,this.msg,210,305,20,'#ffd166');
   btn(c,120,340,180,60,this.ph==='spin'?(this.k<3?`ストップ ${this.k+1}`:'…'):'スタート',{size:20,on:this.ph==='spin'||this.coin>=3});
   T(c,'7️⃣×3=100 💎×3=40 ⭐×3=20 🍇×3=12 🔔×3=10 🍋×3=8 🍒×3=5',210,422,10,'rgba(255,255,255,.75)');}},

/* ---------- ダイスチャレンジ ---------- */
{id:'yacht',name:'ダイスチャレンジ',emoji:'🎲',tag:'テーブル',color:['#ffe5b4','#e76f51'],
 desc:'5つのサイコロを最大3回ふって、12の役にうまく割りふろう。合計点の高さを競うダイスゲーム。',
 help:'サイコロをクリックで固定、「ふる」で振り直し。役の行をクリックで得点を記入',
 w:800,h:450,
 CAT:['1の目','2の目','3の目','4の目','5の目','6の目','チョイス','フォーダイス','フルハウス','Sストレート','Lストレート','ヨット'],
 reset(api){this.api=api;this.d=[1,1,1,1,1];this.hold=[false,false,false,false,false];this.rolls=0;this.sc=Array(12).fill(null);this.anim=0;},
 calc(k,d){const cnt=[0,0,0,0,0,0,0];d.forEach(v=>cnt[v]++);const sum=d.reduce((a,b)=>a+b,0);
   if(k<6)return cnt[k+1]*(k+1);if(k===6)return sum;if(k===7)return cnt.some(v=>v>=4)?sum:0;
   if(k===8)return(cnt.includes(3)&&cnt.includes(2))||cnt.includes(5)?sum:0;
   const has=s=>s.every(v=>cnt[v]>0);if(k===9)return has([1,2,3,4])||has([2,3,4,5])||has([3,4,5,6])?15:0;if(k===10)return has([1,2,3,4,5])||has([2,3,4,5,6])?30:0;return cnt.includes(5)?50:0;},
 bonus(){const u=this.sc.slice(0,6).reduce((a,b)=>a+(b||0),0);return u>=63?35:0;},
 total(){return this.sc.reduce((a,b)=>a+(b||0),0)+this.bonus();},
 roll(){if(this.rolls>=3||this.anim>0)return;this.rolls++;this.anim=.5;},
 key(c,d){if(!d)return;if(c==='Space')this.roll();const m=c.match(/^(Digit|Numpad)([1-5])$/);if(m&&this.rolls)this.hold[+m[2]-1]=!this.hold[+m[2]-1];},
 pointer(t,x,y){if(t!=='down'||this.anim>0)return;
   for(let i=0;i<5;i++)if(this.rolls&&inR(x,y,20+i*74,100,64,64))this.hold[i]=!this.hold[i];
   if(inR(x,y,100,200,200,52))this.roll();
   for(let k=0;k<12;k++)if(this.rolls&&this.sc[k]==null&&inR(x,y,420,24+k*34,360,30)){this.sc[k]=this.calc(k,this.d);this.rolls=0;this.hold=[false,false,false,false,false];this.api.setScore(this.total());
     if(this.sc.every(v=>v!=null))this.api.win(`合計 ${this.total()}点`);}},
 update(dt){if(this.anim>0){this.anim-=dt;this.d=this.d.map((v,i)=>this.hold[i]?v:ri(1,6));}},
 draw(c){bg(c,800,450);T(c,`合計 ${this.total()}点`,200,50,24,UI.ink);
   for(let i=0;i<5;i++)drawDie(c,20+i*74,100,64,this.d[i],{hold:this.hold[i]});
   btn(c,100,200,200,52,this.rolls>=3?'役を選ぼう':`ふる（あと${3-this.rolls}回）`,{size:16,on:this.rolls<3});
   for(let k=0;k<12;k++){const y=24+k*34,v=this.sc[k],pre=this.rolls&&v==null?this.calc(k,this.d):null;box(c,420,y,360,30,6,v!=null?'#f1f0eb':pre!=null?'#eef3ff':'#fff',UI.line,1);
     T(c,this.CAT[k],434,y+16,14,UI.ink,'left');T(c,v!=null?String(v):pre!=null?String(pre):'-',766,y+16,15,v!=null?UI.ink:pre?UI.blue:'#ccc','right');}
   const u=this.sc.slice(0,6).reduce((a,b)=>a+(b||0),0);T(c,'上段ボーナス（63点以上で+35）',200,300,13,UI.sub);T(c,`${u} / 63 ${this.bonus()?'達成！':''}`,200,324,15,this.bonus()?UI.green:UI.ink);
   T(c,'サイコロをクリックで固定',200,390,12,UI.sub);}},

/* ---------- じゃんけん勝負 ---------- */
{id:'janken',name:'じゃんけん勝負',emoji:'✊',tag:'テーブル',color:['#ffcad4','#f4845f'],
 desc:'クセを読んでくるCPUとじゃんけん勝負。先に5勝したほうの勝ち！',
 help:'グー・チョキ・パーをクリック / タップ（1・2・3キーでもOK）',
 w:400,h:440,
 H:['✊','✌️','✋'],N:['グー','チョキ','パー'],
 reset(api){this.api=api;this.w=0;this.l=0;this.hist=[];this.tr={};this.res=null;this.t=0;},
 cpu(){const last=this.hist[this.hist.length-1];const tab=last!=null&&this.tr[last];let pred=null;
   if(tab&&Math.random()<.7){let b=-1;for(let k=0;k<3;k++)if((tab[k]||0)>b){b=tab[k]||0;pred=k;}}
   return pred==null?ri(0,2):(pred+2)%3;},
 play(p){if(this.t>0)return;const c=this.cpu(),last=this.hist[this.hist.length-1];if(last!=null){this.tr[last]=this.tr[last]||{};this.tr[last][p]=(this.tr[last][p]||0)+1;}this.hist.push(p);
   const r=(p-c+3)%3;this.res={p,c,r};if(r===2)this.w++;else if(r===1)this.l++;this.api.setScore(this.w);this.t=1;},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-3])$/);if(m)this.play(+m[2]-1);},
 pointer(t,x,y){if(t!=='down')return;for(let k=0;k<3;k++)if(inR(x,y,30+k*120,330,100,90))this.play(k);},
 update(dt){if(this.t>0){this.t-=dt;if(this.t<=0){if(this.w>=5)return this.api.win(`勝利！ ${this.w} 対 ${this.l}`);if(this.l>=5)return this.api.over(`負け… ${this.w} 対 ${this.l}`);}}},
 draw(c){bg(c,400,440);T(c,`あなた ${this.w}勝`,30,30,18,UI.blue,'left');T(c,`CPU ${this.l}勝`,370,30,18,UI.red,'right');
   if(this.res){T(c,this.H[this.res.c],200,110,80,UI.ink);T(c,'CPU',200,170,13,UI.sub);T(c,this.H[this.res.p],200,250,80,UI.ink);
     T(c,['あいこ','負け…','勝ち！'][this.res.r],320,180,22,[UI.sub,UI.red,UI.green][this.res.r]);}
   else T(c,'じゃんけん…',200,180,28,UI.ink);
   for(let k=0;k<3;k++){btn(c,30+k*120,330,100,90,'',{});T(c,this.H[k],80+k*120,365,40,UI.ink);T(c,this.N[k],80+k*120,405,13,UI.sub);}}},

/* ---------- カップシャッフル ---------- */
{id:'cups',name:'カップシャッフル',emoji:'🥤',tag:'テーブル',color:['#ffe066','#f08c00'],
 desc:'ボールが入ったカップを目で追いかけよう。当てるたびにシャッフルが速くなる！',
 help:'シャッフルが終わったら、ボールが入っていると思うカップをクリック / タップ',
 w:420,h:380,
 reset(api){this.api=api;this.round=0;this.newRound();},
 sx(s){return 90+s*120;},
 newRound(){this.cups=[0,1,2];this.ball=ri(0,2);this.ph='show';this.t=1.2;this.swaps=[];const n=4+this.round*2;for(let i=0;i<n;i++){const a=ri(0,2);let b;do{b=ri(0,2);}while(b===a);this.swaps.push([a,b]);}
   this.dur=Math.max(.16,.5-this.round*.04);this.cur=null;this.pick=-1;},
 pointer(t,x,y){if(t!=='down'||this.ph!=='pick')return;for(let s=0;s<3;s++)if(Math.abs(x-this.sx(s))<50&&y>140&&y<300){const cup=this.cups.indexOf(s);this.pick=cup;this.ph='reveal';this.t=1.2;this.ok=cup===this.ball;if(this.ok)this.api.addScore(1);}},
 update(dt){this.t-=dt;
   if(this.ph==='show'&&this.t<=0){this.ph='shuffle';this.t=0;}
   if(this.ph==='shuffle'){if(!this.cur){if(!this.swaps.length){this.ph='pick';return;}const[a,b]=this.swaps.shift();this.cur={a,b,p:0};}
     this.cur.p+=dt/this.dur;if(this.cur.p>=1){const{a,b}=this.cur;this.cups=this.cups.map(s=>s===a?b:s===b?a:s);this.cur=null;}}
   if(this.ph==='reveal'&&this.t<=0){if(!this.ok)return this.api.over(`はずれ！ ${score}回クリア`);this.round++;this.newRound();}},
 draw(c){bg(c,420,380);T(c,`クリア ${score}`,20,30,18,UI.ink,'left');T(c,this.ph==='pick'?'どれに入ってる？':this.ph==='shuffle'?'シャッフル中…':this.ph==='show'?'ボールはここ！':this.ok?'当たり！':'はずれ…',400,30,16,UI.sub,'right');
   box(c,20,290,380,14,6,'#d8c8a8');
   for(let i=0;i<3;i++){let x=this.sx(this.cups[i]),y=290,lift=0;
     if(this.cur){const{a,b,p}=this.cur;const e=p<.5?2*p*p:1-2*(1-p)*(1-p);if(this.cups[i]===a){x=this.sx(a)+(this.sx(b)-this.sx(a))*e;y-=Math.sin(e*Math.PI)*40;}else if(this.cups[i]===b){x=this.sx(b)+(this.sx(a)-this.sx(b))*e;y+=Math.sin(e*Math.PI)*16;}}
     const show=(this.ph==='show'&&this.t<1.0&&this.t>.25)||(this.ph==='reveal'&&(i===this.pick||i===this.ball));if(show)lift=60;
     if(i===this.ball&&show)circle(c,x,282,16,UI.red);
     c.fillStyle=UI.orange;c.beginPath();c.moveTo(x-46,y-lift);c.lineTo(x-34,y-120-lift);c.lineTo(x+34,y-120-lift);c.lineTo(x+46,y-lift);c.closePath();c.fill();
     c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x-26,y-110-lift,10,100);box(c,x-48,y-10-lift,96,12,6,'#d9480f');}}},

/* ---------- シャットザボックス ---------- */
{id:'shutbox',name:'シャットザボックス',emoji:'📦',tag:'テーブル',color:['#e0c3fc','#8338ec'],
 desc:'サイコロの合計と同じになるように数字の板を倒していく。全部倒せたら完全勝利！',
 help:'「ふる」でサイコロ。合計が出目と同じになるように板をクリックして倒す',
 w:440,h:420,
 reset(api){this.api=api;this.open=[1,2,3,4,5,6,7,8,9].map(()=>true);this.ph='roll';this.d=[1,1];this.sel=[];this.anim=0;this.api.setScore(0);},
 sumOpen(){return this.open.reduce((a,o,i)=>a+(o?i+1:0),0);},
 can(n){const v=this.open.map((o,i)=>o?i+1:0).filter(Boolean);const f=(i,s)=>s===0||(i<v.length&&s>0&&(f(i+1,s-v[i])||f(i+1,s)));return f(0,n);},
 roll(){if(this.ph!=='roll')return;this.one=this.open.slice(6).every(o=>!o);this.anim=.5;this.ph='rolling';},
 total(){return this.one?this.d[0]:this.d[0]+this.d[1];},
 key(c,d){if(d&&(c==='Space'||c==='Enter'))this.roll();},
 pointer(t,x,y){if(t!=='down')return;if(this.ph==='roll'&&inR(x,y,150,330,140,54))return this.roll();if(this.ph!=='pick')return;
   for(let i=0;i<9;i++)if(this.open[i]&&inR(x,y,22+i*44,60,40,110)){const k=this.sel.indexOf(i);if(k>=0)this.sel.splice(k,1);else this.sel.push(i);
     const s=this.sel.reduce((a,j)=>a+j+1,0);if(s===this.total()){for(const j of this.sel)this.open[j]=false;this.sel=[];this.api.setScore(45-this.sumOpen());
       if(this.open.every(o=>!o)){this.api.setScore(100);return this.api.win('全部倒した！ 完全勝利');}this.ph='roll';}
     else if(s>this.total())this.sel=[];}},
 update(dt){if(this.ph==='rolling'){this.anim-=dt;this.d=[ri(1,6),ri(1,6)];if(this.anim<=0){this.ph=this.can(this.total())?'pick':'stuck';this.t=1.5;}}
   if(this.ph==='stuck'){this.t-=dt;if(this.t<=0){this.ph='x';this.api.setScore(45-this.sumOpen());return this.api.over(`もう倒せない（残り合計 ${this.sumOpen()}）`);}}},
 draw(c){bg(c,440,420,'#f5efe6');box(c,12,46,416,140,10,'#8d6e4f');
   for(let i=0;i<9;i++){const x=22+i*44,sel=this.sel.includes(i);if(this.open[i])box(c,x,60-(sel?8:0),40,110,6,sel?'#ffe08a':'#fdf6e3','#c9a96e',2);else box(c,x,150,40,20,4,'#6d4c33');
     if(this.open[i])T(c,String(i+1),x+20,115-(sel?8:0),24,UI.ink);}
   T(c,'スコア '+score,20,24,15,UI.ink,'left');
   drawDie(c,this.one?190:150,220,60,this.d[0]);if(!this.one)drawDie(c,230,220,60,this.d[1]);
   T(c,this.ph==='pick'?`出目 ${this.total()}：合計が ${this.total()} になるよう倒そう`:this.ph==='stuck'?`出目 ${this.total()}…倒せる組み合わせがない`:this.one?'7〜9が倒れたのでサイコロ1個':'サイコロをふろう',220,302,15,this.ph==='stuck'?UI.red:UI.ink);
   btn(c,150,330,140,54,'ふる',{size:20,on:this.ph==='roll'});}},

/* ---------- ビンゴ ---------- */
{id:'bingo',name:'ビンゴ',emoji:'🅱️',tag:'テーブル',color:['#caf0f8','#0096c7'],
 desc:'読み上げられた数字をカードで見つけてマーク。たて・よこ・ななめが1列そろえばビンゴ！ 40回以内に。',
 help:'呼ばれた数字（過去の数字もOK）がカードにあればクリック / タップでマーク',
 w:800,h:450,
 reset(api){this.api=api;this.card=[];for(let c=0;c<5;c++){const col=shuffle([...Array(15)].map((_,i)=>c*15+i+1)).slice(0,5);for(let r=0;r<5;r++)this.card[r*5+c]=col[r];}
   this.card[12]=0;this.mark=Array(25).fill(false);this.mark[12]=true;this.pool=shuffle([...Array(75)].map((_,i)=>i+1));this.called=[];this.t=1;this.fin=false;},
 lines(){const L=[];for(let i=0;i<5;i++){L.push([0,1,2,3,4].map(k=>i*5+k));L.push([0,1,2,3,4].map(k=>k*5+i));}L.push([0,6,12,18,24],[4,8,12,16,20]);return L;},
 pointer(t,x,y){if(t!=='down'||this.fin)return;const c=cellAt(x,y,430,80,66,5,5);if(!c)return;const i=c.y*5+c.x;if(this.called.includes(this.card[i]))this.mark[i]=true;
   if(this.lines().some(l=>l.every(k=>this.mark[k]))){this.fin=true;this.api.setScore(Math.max(10,130-this.called.length*3));this.api.win(`ビンゴ！ ${this.called.length}回目`);}},
 update(dt){if(this.fin)return;this.t-=dt;if(this.t<=0){if(this.called.length>=40){this.fin=true;return this.api.over('40回でビンゴならず…');}this.called.push(this.pool.pop());this.t=2.2;}},
 draw(c){bg(c,800,450);const last=this.called[this.called.length-1];
   T(c,`${this.called.length} / 40 回`,200,40,16,UI.sub);circle(c,200,150,74,'#fff',UI.blue,5);T(c,last?'BINGO'[Math.floor((last-1)/15)]+' '+last:'…',200,153,40,UI.ink);
   T(c,'これまで',200,250,12,UI.sub);T(c,this.called.slice(-9,-1).reverse().join('  '),200,276,15,UI.sub);
   'BINGO'.split('').forEach((ch,k)=>T(c,ch,463+k*66,62,20,UI.blue));
   for(let i=0;i<25;i++){const x=430+(i%5)*66,y=80+Math.floor(i/5)*66,m=this.mark[i],can=!m&&this.called.includes(this.card[i]);
     box(c,x+3,y+3,60,60,10,m?'#ffd6e0':'#fff',can?UI.yellow:UI.line,can?3:1.5);T(c,i===12?'FREE':String(this.card[i]),x+33,y+34,i===12?14:22,UI.ink);if(m&&i!==12)circle(c,x+33,y+33,22,null,UI.red,4);}
   const reach=this.lines().filter(l=>l.filter(k=>this.mark[k]).length===4).length;if(reach)T(c,`リーチ ×${reach}`,200,340,22,UI.red);
   T(c,'黄色の枠は呼ばれた数字。タップしてマーク！',200,410,13,UI.sub);}},

/* ---------- いくつある？ ---------- */
{id:'count',name:'いくつある？',emoji:'🍎',tag:'脳トレ',color:['#ffb3c1','#ff4d6d'],
 desc:'一瞬だけ表示される絵の中から、りんごの数を数えよう。全10問。',
 help:'表示が消えたら、りんごの数をボタンから選ぶ（1〜4キーでもOK）',
 w:800,h:450,
 reset(api){this.api=api;this.q=0;this.ok=0;this.make();},
 make(){const n=ri(3,6+this.q),d=ri(3,6+this.q),pts=[];const F=['🍊','🍋','🍇','🍐'];
   for(let i=0;i<n+d;i++){let p,t=0;do{p={x:rnd(50,510),y:rnd(84,406)};t++;}while(t<80&&pts.some(o=>dist(o.x,o.y,p.x,p.y)<44));p.e=i<n?'🍎':F[ri(0,3)];pts.push(p);}
   this.pts=pts;this.ans=n;const o=new Set([n]);while(o.size<4){const v=n+ri(-3,3);if(v>0)o.add(v);}this.opts=shuffle([...o]);this.ph='show';this.t=Math.max(.8,1.6-this.q*.07);},
 pick(i){if(this.ph!=='ask')return;this.res=this.opts[i]===this.ans;if(this.res){this.ok++;this.api.setScore(this.ok*10);}this.ph='fb';this.t=1;},
 key(c,d){if(!d)return;const m=c.match(/^(Digit|Numpad)([1-4])$/);if(m)this.pick(+m[2]-1);},
 pointer(t,x,y){if(t!=='down')return;for(let i=0;i<4;i++)if(inR(x,y,580,70+i*90,190,72))this.pick(i);},
 update(dt){if(this.ph==='ask')return;this.t-=dt;if(this.t>0)return;if(this.ph==='show')this.ph='ask';else{this.q++;if(this.q>=10)return this.ok>=7?this.api.win(`${this.ok} / 10 問正解！`):this.api.over(`${this.ok} / 10 問正解`);this.make();}},
 draw(c){bg(c,800,450,this.ph==='fb'?(this.res?'#eafaf0':'#ffecec'):UI.bg);T(c,`第${this.q+1}問 / 10`,20,28,17,UI.ink,'left');T(c,`正解 ${this.ok}`,780,28,17,UI.sub,'right');
   box(c,20,56,520,380,14,'#fff',UI.line,1.5);
   if(this.ph==='show'||this.ph==='fb')for(const p of this.pts)T(c,p.e,p.x,p.y,34,UI.ink);else T(c,'🍎 はいくつあった？',280,246,24,UI.ink);
   if(this.ph==='fb')T(c,`正解は ${this.ans}個`,400,28,16,this.res?UI.green:UI.red);
   this.opts.forEach((v,i)=>btn(c,580,70+i*90,190,72,String(v),{size:28,on:this.ph==='ask'}));}}
);
