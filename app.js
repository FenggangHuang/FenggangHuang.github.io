use strict';
const profiles = [
  {id:'age',icon:'🐥',title:'年龄',en:'AGE',desc:'池塘里的小鸭子，藏着时间的秘密。',action:'数数小鸭子',value:'18 岁'},
  {id:'height',icon:'🌱',title:'身高',en:'HEIGHT',desc:'给小树一点阳光，看看它能长多高。',action:'让小树长高',value:'180 cm'},
  {id:'weight',icon:'⚖️',title:'体重',en:'WEIGHT',desc:'拨动天平，找到刚刚好的平衡。',action:'寻找平衡点',value:'140 斤',note:'也就是 70 kg'},
  {id:'hobby',icon:'👟',title:'爱好',en:'PASSION',desc:'迎着风出发，答案就在终点线。',action:'一起跑一小段',value:'跑步',note:'把日常跑成热爱的模样'},
  {id:'fitness',icon:'💪',title:'隐藏实力',en:'POWER',desc:'每一份坚持，都会留下自己的形状。',action:'唤醒运动能量',value:'八块腹肌'},
  {id:'more',icon:'✨',title:'不止于此',en:'MORE',desc:'关于我的更多故事，等你来盖章。',action:'打开成就手账',value:'马拉松全程 2h 内<br>100m 8秒<br>万亿市值公司老总',long:true,note:'个人自述 · 趣味档案，非赛事认证'}
];
const key='personal-garden-peng-v1';
let unlocked=new Set();
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved)) unlocked=new Set(saved.filter(id=>profiles.some(p=>p.id===id)));}catch{}
const cards=document.getElementById('cards');
const dialog=document.getElementById('game-dialog');
const content=document.getElementById('game-content');
let current=null,sound=false,audio,toastTimer;
const lock='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3.5" y="7" width="9" height="7" rx="2"/><path d="M5.5 7V4a2.5 2.5 0 015 0v3"/></svg>';
function render(){
  cards.innerHTML=profiles.map(p=>{const open=unlocked.has(p.id);return `<article class="card ${open?'unlocked':''}"><div class="card-top"><div class="card-icon" aria-hidden="true">${p.icon}</div><span class="card-status">${open?'✧ 已发现':lock+' 待解锁'}</span></div><h3>${p.title}<small>${p.en}</small></h3>${open?`<div class="reveal-value ${p.long?'long':''}">${p.value}</div>${p.note?`<p class="card-desc">${p.note}</p>`:''}`:`<p class="card-desc">${p.desc}</p>`}<button class="card-action" data-id="${p.id}" aria-label="${open?'再次体验':'解锁'+p.title+'：'}${p.action}"><span>${open?'再玩一次':p.action}</span><span>${open?'↺':'↗'}</span></button></article>`;}).join('');
  document.getElementById('progress-count').textContent=unlocked.size;
  document.getElementById('progress-bar').style.width=`${unlocked.size/6*100}%`;
  document.getElementById('bottom-text').textContent=unlocked.size===6?'花园已全部点亮，谢谢你认真认识了我。':'每个人都是一座花园，感谢你愿意慢慢探索。';
}
function tone(success=false){if(!sound)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type='sine';o.frequency.setValueAtTime(success?660:440,audio.currentTime);o.frequency.exponentialRampToValueAtTime(success?990:540,audio.currentTime+.12);g.gain.setValueAtTime(.06,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);o.start();o.stop(audio.currentTime+.22);}catch{}}
function toast(text){clearTimeout(toastTimer);const el=document.getElementById('toast');el.textContent=text;el.classList.add('show');toastTimer=setTimeout(()=>el.classList.remove('show'),2800);}
function shell(title,intro,html){content.innerHTML=`<div class="game-eyebrow">A LITTLE ADVENTURE · ${current.en}</div><h2 class="game-title">${title}</h2><p class="game-intro">${intro}</p>${html}<p id="hint" class="game-hint" role="status" aria-live="polite"></p>`;}
function hint(text,error=false){const h=document.getElementById('hint');h.textContent=text;h.classList.toggle('game-error',error);}
function win(){const p=current;unlocked.add(p.id);let saved=true;try{localStorage.setItem(key,JSON.stringify([...unlocked]));}catch{saved=false;}render();tone(true);content.innerHTML=`<div class="success"><span class="success-flower">🌼</span><div class="game-eyebrow">A NEW SECRET BLOOMS</div><h2>又认识我一点了！</h2><p>好奇心有了回响，这是你发现的小秘密。</p><div class="success-value ${p.long?'long':''}">${p.title} · ${p.value}</div>${p.note?`<p>${p.note}</p>`:''}<button class="primary game-submit" id="back-home">收下答案，回到花园 ↗</button><p>${saved?'已为你保存探索进度，下次来还记得。':'本次进度已解锁，浏览器不支持保存进度。'}</p></div>`;document.getElementById('back-home').onclick=()=>dialog.close();document.getElementById('back-home').focus();}
function openGame(id){current=profiles.find(p=>p.id===id);tone();
if(id==='age'){
 shell('池塘里，有多少只小鸭？','点击小鸭子，数量会自动填入下方，再点击确认。<br>也可以直接输入你数出的答案。',`<div class="game-stage duck-pond">${Array.from({length:18},(_,i)=>`<button class="duck" style="--delay:${i*.13}s" aria-label="小鸭子 ${i+1}，未标记" aria-pressed="false">🦆</button>`).join('')}</div><div id="age-answer-panel"><div class="answer-row"><label for="duck-answer">一共有</label><input id="duck-answer" type="text" placeholder="?" inputmode="numeric" autocomplete="off" aria-describedby="hint"><span>只小鸭子</span></div><button id="confirm-age" class="primary game-submit" type="button">确认我的答案 ↗</button></div>`);
 const selected=new Set();content.querySelectorAll('.duck').forEach((duck,i)=>duck.onclick=()=>{selected.has(i)?selected.delete(i):selected.add(i);let order=0;content.querySelectorAll('.duck').forEach((d,j)=>{const yes=selected.has(j);d.classList.toggle('selected',yes);d.dataset.order=yes?++order:'';d.setAttribute('aria-pressed',String(yes));d.setAttribute('aria-label',`小鸭子 ${j+1}，${yes?'已标记':'未标记'}`);});document.getElementById('duck-answer').value=String(selected.size);tone();hint(`已标记 ${selected.size} 只小鸭子，点击「确认我的答案」提交。`);});
 const confirmAge=()=>{
  const input=document.getElementById('duck-answer');
  const answer=input.value.trim().replace(/[０-９]/g,c=>String(c.charCodeAt(0)-0xFF10));
  if(!answer){hint('请点击小鸭子自动计数，或在输入框填写你数出的数量。',true);input.focus();return;}
  if(!/^\d+$/.test(answer)){hint('请输入整数，例如 18，再点击确认。',true);input.focus();return;}
  Number(answer)===18?win():hint(`你填写了 ${Number(answer)} 只，还差一点点，再数一遍吧！`,true);
 };
 document.getElementById('confirm-age').onclick=confirmAge;
 document.getElementById('duck-answer').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();confirmAge();}};
}else if(id==='height'){
 shell('让小树长到我的高度','拖动阳光滑块，帮小树长高。<br>提示：一米八，换算成厘米是多少呢？',`<div class="game-stage height-stage"><span class="seed" id="tree">🌱</span><label for="height-range">小树的高度</label><div class="metric"><output id="height-output" for="height-range">150</output> cm</div><input id="height-range" type="range" min="140" max="200" value="150" step="1" aria-label="调整小树高度，目标180厘米"></div><button id="check-height" class="primary game-submit">就是这个高度 ↗</button>`);
 document.getElementById('height-range').oninput=e=>{const n=Number(e.target.value);document.getElementById('height-output').value=n;const tree=document.getElementById('tree');tree.textContent=n>=175?'🌳':n>=160?'🌿':'🌱';tree.style.transform=`scale(${.8+(n-140)/65})`;};document.getElementById('check-height').onclick=()=>Number(document.getElementById('height-range').value)===180?win():hint('阳光再调一调，让小树刚好长到 180 cm。',true);
}else if(id==='weight'){
 let weight=0;shell('给生活一个平衡点','把砝码加到天平上，让总重量达到 70 kg。<br>小提示：1 kg = 2 斤。',`<div class="game-stage"><div class="balance"><span>📦</span><span>⚖️</span><span>🪨</span></div><div class="metric" style="text-align:center"><output id="weight-output">0</output> kg</div><div class="chips" style="margin-top:18px"><button class="chip" data-weight="5">+ 5 kg</button><button class="chip" data-weight="10">+ 10 kg</button><button class="chip" data-weight="20">+ 20 kg</button><button class="chip" id="clear-weight">↺ 清空</button></div></div><button id="check-weight" class="primary game-submit">检查天平 ↗</button>`);
 content.querySelectorAll('[data-weight]').forEach(b=>b.onclick=()=>{if(weight+Number(b.dataset.weight)>140){hint('天平快装不下啦，试试清空重来。',true);return;}weight+=Number(b.dataset.weight);document.getElementById('weight-output').textContent=weight;tone();hint(weight===70?'天平平衡了，点击检查揭晓答案！':weight>70?'有点重了，可以清空再试一次。':'继续添加砝码吧。');});document.getElementById('clear-weight').onclick=()=>{weight=0;document.getElementById('weight-output').textContent=0;hint('天平已清空，重新搭配吧。');};document.getElementById('check-weight').onclick=()=>weight===70?win():hint('还没平衡哦，目标是 70 kg。',true);
}else if(id==='hobby'){
 let steps=0;shell('迎着风，跑向小小终点','每一次点击，都是向前的一小步。<br>点击 12 次，陪我跑完这段花园小径。',`<div class="game-stage"><div class="running-track"><span class="running-person" id="runner">🏃</span><span class="finish">🏁</span></div><div class="run-progress"><i id="run-bar"></i></div><div id="run-count" class="game-hint">0 / 12 步</div></div><button id="run" class="primary game-submit">向前跑一步 →</button>`);
 document.getElementById('run').onclick=()=>{steps++;tone();document.getElementById('runner').style.left=`${steps/12*80}%`;document.getElementById('run-bar').style.width=`${steps/12*100}%`;document.getElementById('run-count').textContent=`${steps} / 12 步`;if(steps===12)win();};
}else if(id==='fitness'){
 let pieces=0;shell('唤醒每一块运动能量','点击点亮全部能量块。<br>把坚持拼起来，看看我的隐藏实力。',`<div class="game-stage"><div class="abs-grid">${Array.from({length:8},(_,i)=>`<button class="abs-piece" aria-label="点亮第 ${i+1} 块能量" aria-pressed="false">✧</button>`).join('')}</div></div><button id="check-fitness" class="primary game-submit">揭晓隐藏实力 ↗</button>`);
 content.querySelectorAll('.abs-piece').forEach(b=>b.onclick=()=>{if(b.classList.contains('active'))return;b.classList.add('active');b.setAttribute('aria-pressed','true');b.textContent='✦';pieces++;tone();hint(`能量已点亮 ${pieces} / 8`);});document.getElementById('check-fitness').onclick=()=>pieces===8?win():hint('还有能量没有点亮哦，把 8 块全部唤醒吧！',true);
}else{
 let stamps=0;shell('打开我的成就手账','给三个梦想小站盖上印章，解锁我的夸张履历。<br>这是趣味个人自述，不代表经核实的竞技纪录。',`<div class="game-stage passport"><div style="font-size:38px;margin-bottom:9px">📖</div><div class="stamp-row"><button class="stamp" aria-pressed="false">🏅 耐力站</button><button class="stamp" aria-pressed="false">⚡ 速度站</button><button class="stamp" aria-pressed="false">🏙️ 事业站</button></div></div><button id="check-more" class="primary game-submit">翻开我的故事 ↗</button>`);
 content.querySelectorAll('.stamp').forEach(b=>b.onclick=()=>{if(b.classList.contains('active'))return;b.classList.add('active');b.setAttribute('aria-pressed','true');b.append(' ✓');stamps++;tone();hint(`已收集 ${stamps} / 3 枚印章`);});document.getElementById('check-more').onclick=()=>stamps===3?win():hint('先去三个小站收集印章吧！',true);
}
 if(!dialog.open)dialog.showModal();
}
document.getElementById('start-explore').onclick=e=>{
 e.preventDefault();
 const section=document.getElementById('explore');
 const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 section.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
};
cards.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b)openGame(b.dataset.id);});
document.getElementById('close-modal').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.getElementById('sound').onclick=()=>{sound=!sound;document.querySelector('.sound-off').hidden=sound;document.getElementById('sound').setAttribute('aria-label',sound?'关闭交互音效':'开启交互音效');document.getElementById('sound').title=sound?'关闭交互音效':'开启交互音效';tone();toast(sound?'交互音效已开启 ♪':'已切换为安静模式');};
document.getElementById('reset').onclick=()=>{if(!unlocked.size){toast('花园里的小秘密，正等你探索。');return;}if(confirm('要清空已解锁的资料，重新探索花园吗？')){unlocked.clear();try{localStorage.removeItem(key);}catch{}render();toast('花园已重置，开启新的小冒险吧。');}};
render();
