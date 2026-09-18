const renderStatsV222=renderStats;renderStats=function(){renderStatsV222();let s=stats(),cards=$('#stats-grid')?.children;if(cards&&cards[4]){let v=cards[4].querySelector('.font-semibold');if(v)v.textContent='×'+s.critMult.toFixed(2)}};
$$('.tab').forEach(b=>b.onclick=()=>tab(b.dataset.tab));$$('.sim-speed').forEach(b=>b.onclick=()=>{G.simSpeed=Number(b.dataset.speed);renderFast();touch()});$('#auto-equip').onchange=e=>{G.autoEquip=e.target.checked;touch()};$('#auto-salvage').onchange=e=>{G.autoSalvage=Number(e.target.value);touch()};$('#equip-focus').onchange=e=>{G.equipFocus=e.target.value;touch()};$('#equip-best').onclick=equipBest;$('#salvage-threshold').onclick=()=>salvageThreshold();$('#salvage-unlocked').onclick=()=>salvageUnlockedSlot();$('#inventory-sort').onchange=e=>{G.gearSort[G.gearTab]=e.target.value;touch()};$('#flush-btn').onclick=flush;$('#offline-claim').onclick=claimOffline;$('#pause-btn').onclick=()=>{G.paused=!G.paused;touch()};

const LOCAL_KEY='POOP_DUNGEON_V224',LEGACY_KEYS=['POOP_DUNGEON_V223','POOP_DUNGEON_V220','POOP_DUNGEON_V213'];
document.title='💩 DUNGEON v2.2.4';$('#load-code').placeholder='POOPRPG224-... / POOPRPG223-...';
let saveHeading=$('#save-status').closest('section')?.querySelector('.font-semibold');if(saveHeading?.nextElementSibling)saveHeading.nextElementSibling.textContent='v2.1.1〜v2.2.4のコードを移行できます。自動セーブ対応。最大8時間の放置報酬。';
function hash(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
function enc(s){let a=new TextEncoder().encode(s),b='';for(const x of a)b+=String.fromCharCode(x);return btoa(b)}
function dec(s){let b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new TextDecoder().decode(a)}
function snapshotState(){let snap=JSON.parse(JSON.stringify(G));snap.paused=false;snap.enemy=null;snap.deadUntil=0;return snap}
function payloadNow(){return{v:224,t:Date.now(),g:snapshotState()}}
function saveLocal(){try{localStorage.setItem(LOCAL_KEY,JSON.stringify(payloadNow()));for(const k of LEGACY_KEYS)localStorage.removeItem(k);return true}catch(e){return false}}
function loadLocalPayload(){try{let raw=localStorage.getItem(LOCAL_KEY);if(!raw){for(const k of LEGACY_KEYS){raw=localStorage.getItem(k);if(raw)break}}if(!raw)return null;let p=JSON.parse(raw);if(!p||typeof p!=='object'||!p.g)throw Error('自動セーブ形式が不正');return p}catch(e){return null}}
function applyPayload(p){let candidate=normalize(p?.g);candidate.paused=false;candidate.deadUntil=0;candidate.enemy=null;G=candidate;ensureV22State();G.hp=stats().hp;spawn();let elapsed=Math.max(0,(Date.now()-num(p?.t,Date.now()))/1000);offlineRewards(elapsed);return elapsed}

$('#save-btn').onclick=()=>{let body=JSON.stringify(payloadNow());$('#save-code').value='POOPRPG224-'+enc(JSON.stringify({body,sig:hash(body)}));$('#save-status').textContent='保存コード生成完了。自動セーブも有効です。'};
$('#load-btn').onclick=()=>{try{let c=$('#load-code').value.trim(),prefix=['POOPRPG224-','POOPRPG223-','POOPRPG220-','POOPRPG213-','POOPRPG212-','POOPRPG211-'].find(p=>c.startsWith(p));if(!prefix)throw Error('対応コードではありません');let env=JSON.parse(dec(c.slice(prefix.length)));if(!env||typeof env.body!=='string'||hash(env.body)!==env.sig)throw Error('コード破損');let p=JSON.parse(env.body),candidate=normalize(p.g),elapsed=Math.max(0,(Date.now()-num(p.t,Date.now()))/1000);candidate.paused=false;candidate.deadUntil=0;candidate.enemy=null;G=candidate;ensureV22State();G.hp=stats().hp;spawn();offlineRewards(elapsed);saveLocal();$('#save-status').textContent=prefix==='POOPRPG224-'?'ロード成功。':'旧バージョンからv2.2.4へ移行してロード成功。';touch()}catch(e){$('#save-status').textContent='ロード失敗：'+e.message}};
$('#reset-btn').onclick=()=>{if(typeof confirm==='function'&&!confirm('本当に全初期化しますか？'))return;try{localStorage.removeItem(LOCAL_KEY);for(const k of LEGACY_KEYS)localStorage.removeItem(k)}catch{}G=fresh();ensureV22State();G.hp=stats().hp;spawn();$('#save-code').value='';$('#load-code').value='';$('#save-status').textContent='初期化しました。';touch()};

let autoLoaded=false,startupElapsed=0,startup=loadLocalPayload();if(startup){try{startupElapsed=applyPayload(startup);autoLoaded=true;saveLocal()}catch(e){G=fresh()}}
if(!autoLoaded){ensureV22State();G.hp=stats().hp;spawn()}
renderFast();renderStatic();if(autoLoaded)$('#save-status').textContent='自動セーブを復元しました'+(startupElapsed>=60?' / 放置報酬を計算済み':'')+'。';

let saveT=0,hiddenAt=0;
function loop(now){let raw=Math.min(.25,(now-last)/1000||0);last=now;if(!G.paused){if(G.deadUntil<=Date.now()){if(!G.enemy)spawn();let dt=raw*G.simSpeed,s=stats();healHero(s.hp*s.regen*dt,true);if(G.enemy){ht+=dt;et+=dt;let guard=0;while(G.enemy&&ht>=1/s.sp&&guard++<20){ht-=1/s.sp;heroHit();s=stats()}guard=0;while(G.enemy&&et>=((G.enemy.boss?1.5:G.enemy.elite?1.85:2.35)/G.enemy.enemySpeed)&&guard++<20){let iv=(G.enemy.boss?1.5:G.enemy.elite?1.85:2.35)/G.enemy.enemySpeed;et-=iv;enemyHit();if(G.deadUntil>Date.now())break}}}}uiT+=raw;saveT+=raw;if(uiT>.16){uiT=0;if(G.deadUntil&&G.deadUntil<=Date.now()&&!G.enemy){G.hp=stats().hp;spawn();log('💩 再出撃。')}renderFast();if(staticDirty)renderStatic()}if(saveT>=5){saveT=0;saveLocal()}requestAnimationFrame(loop)}
document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenAt=Date.now();saveLocal()}else if(hiddenAt){let sec=(Date.now()-hiddenAt)/1000;hiddenAt=0;last=performance.now();if(sec>=60)offlineRewards(sec);saveLocal();renderFast();staticDirty=true}});
window.addEventListener('pagehide',saveLocal);
requestAnimationFrame(loop);
