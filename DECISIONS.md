# 💩 DUNGEON — DECISIONS

重要な設計判断と、その理由を記録する。
「現在の仕様」は `SPEC.md`、「変更履歴」は `CHANGELOG.md` を参照。

---

## D001 — GitHubを唯一の正本にする

**Status:** Accepted

### Decision

コード・README・CHANGELOG・SPEC・DECISIONSを含め、更新されるプロジェクト情報はGitHubをcanonical sourceとする。

### Why

- Chat内で大きなゲームを直接再構成した際、過去に巻き戻しが発生した
- チャットの生成物は版管理に向かない
- Git commit単位で差分・原因・復旧点を追える
- GitHub Pagesと同じsourceから動作版を配信できる

### Consequence

- 既存sourceを読み、差分更新する
- 原則として「ゼロから再生成」しない
- `main` は常にプレイ可能な正式版
- 複数ファイルやリスクのある変更はfeature branchで行う

---

## D002 — ドキュメントを役割分離する

**Status:** Accepted

### Decision

- `README.md`: プロジェクト入口と現在の概要
- `CHANGELOG.md`: バージョンごとの変更履歴
- `SPEC.md`: 現在の動作仕様
- `DECISIONS.md`: 設計判断と理由

### Why

同じ情報を1ファイルへ詰めると、「現仕様」「過去との差分」「設計理由」が混ざるため。

---

## D003 — バージョン番号は変更規模に合わせる

**Status:** Accepted

### Decision

- patch: bug fix / UI / 小変更
- minor: Affix / 新システム / gameplay変更
- major: 世代が変わる大型変更

### Examples

- UI polish: v2.2.4 → v2.2.5
- Legendary overhaul: v2.2.x → v2.3.0

### Consequence

コード、title、save prefix、README、CHANGELOGを同時に更新する。

---

## D004 — 装備を5部位へ固定する

**Status:** Accepted

### Decision

weapon / head / chest / feet / trinket の5部位。

### Why

- 3部位ではbuild variationが不足
- 各部位へ異なるImplicit役割を持たせられる
- Legendaryのslot competitionを設計できる
- 全部位をLegendaryで埋めない構造を作れる

---

## D005 — Affix TierとRarityを分離する

**Status:** Accepted

### Decision

RarityはAffix個数、Tierは個々のAffixの強さを決める。

### Why

「Mythicだから必ず高Tier」では厳選が単調になる。
レア装備でもRollが悪い、低rarityでも良Rollというハクスラらしい幅を残す。

---

## D006 — Tier確率はダンジョンで決める

**Status:** Accepted

### Decision

Affix Tier I〜IVの確率は現在のダンジョンごとの固定分布。

### Why

ステージごとに「何を掘りに行くか」という目的を持たせるため。
特にCosmicは高Tier狙いの終盤狩場。

---

## D007 — 同カテゴリ加算、別カテゴリ乗算

**Status:** Accepted

### Decision

同じ種類のdamage bonusは加算し、first / combo / lastStand / crit / bossなど別カテゴリは乗算。

### Why

- build間の相乗効果を残す
- 単一statだけ積むより複数カテゴリを組み合わせる意味が生まれる
- Legendaryが既存Affixと自然にsynergyを作れる

---

## D008 — Procは強く相互作用させるが、再帰させない

**Status:** Accepted

### Decision

通常攻撃→吸収→癒撃のような1段階の相互作用は許可する。
副次ダメージから吸収やLegendaryを再帰発動させない。

### Why

Proc同士のsynergyは面白いが、無限chainや指数的Procはbalanceとperformanceを壊す。

### Invariant

「面白い連携は許す、自己再帰は許さない」。

---

## D009 — Legendaryは単なる大きい数値ではなく、ルールを変える

**Status:** Accepted

### Decision

固有Legendaryは以下のような新現象を発生させる。

- 周期必殺
- 周期攻撃 + 回復
- 2Hit化
- DROP生成変換
- Super Crit

### Why

単純な「攻撃+35%」はMythicの延長にしかならず、入手時の体験が弱い。
Legendaryはbuildの動きそのものを変える装備にする。

---

## D010 — 固有Legendaryは1ステージ1種

**Status:** Accepted

### Decision

新規DROPする固有Legendaryは5ステージ × 1種 = 5種。

### Why

- 希少性を上げられる
- 1個ごとに固有mechanicを濃くできる
- Stage identityが強くなる
- 新ステージ追加時に新Legendaryを1つ足す構造が自然

---

## D011 — Legendaryを5部位すべてには配置しない

**Status:** Accepted

### Decision

v2.3.0:

- weapon ×2
- chest ×1
- trinket ×2
- head ×0
- feet ×0

### Why

各部位に1つずつLegendaryを置くと「5個全部装備」がほぼ正解になり、Mythicが死ぬ。

### Intended choice

- 逆流槍 vs 超蠕動ブラシ
- ミダスの栓 vs 事象の地平便座
- head / feetは強いMythicを狙う

最大3つ程度の固有Legendary装備に留める。

---

## D012 — Legendary周期判定はHitではなくAttack Action

**Status:** Accepted

### Decision

逆流槍「5回」、腐敗心核「4回」は通常攻撃アクション数で数える。

### Why

超蠕動ブラシの2Hitが周期Legendaryを2倍速で回すと、synergyが過剰になるため。

### Consequence

1 action → 2 Hitでもcounter +1。

---

## D013 — Legendary周期counterは敵をまたいで持ち越す

**Status:** Accepted

### Why

敵ごとにリセットすると、雑魚が1〜2Hitで死ぬ終盤ほど周期Legendaryが発動しなくなる。

### Consequence

雑魚戦でも「あと1回で必殺」という状態が次の敵へ残る。

---

## D014 — 特殊攻撃は通常build補正を受ける

**Status:** Accepted

### Decision

逆流撃・腐敗脈動はcrit / crit damage / first / combo current multiplier / lastStand / boss / elite / leechを利用する。

一方で:
- combo stackを追加しない
- Legendary counterを進めない
- Legendary Procを再帰発動しない

### Why

既存Affixとのsynergyを残しつつ、無限chainを防ぐため。

---

## D015 — 逆流槍は「5回目が高倍率」ではなく、周期特殊攻撃として扱う実装にする

**Status:** Accepted in implementation

### Decision

v2.3.0実装では通常攻撃アクション後に逆流撃を追加処理する。

### Note

初期balance議論では「5回目の攻撃が300〜400%になる」モデルでも試算した。
現実装の期待DPSは追加特殊攻撃として評価されるため、balance変更時はこの差を意識すること。

---

## D016 — 腐敗心核はDoTではなく周期Attack + Heal

**Status:** Accepted

### Why

DoTは雑魚が早く死ぬ環境では価値を失い、既存Affixとのsynergyも弱い。

周期脈動なら:
- speedで発動回数増
- HPで5%回復の絶対量増
- 癒撃とsynergy
- crit buildともsynergy

になる。

---

## D017 — 超蠕動ブラシは2Hit、それぞれ独立判定

**Status:** Accepted

### Decision

1 action = 2 Hit。
各Hitはcrit / Super Crit / combo / leech等を独立処理。

### Why

「二連撃」という固有感を明確にし、既存Hit-based Affixとのbuild synergyを作る。

---

## D018 — Super CritはCrit成功後にだけ判定

**Status:** Accepted

### Decision

```
Hit
→ Crit
→ Crit成功時10%でSuper Crit
```

Super Crit倍率は通常Critダメージへさらに乗算。

### Why

Crit buildで強く伸びる一方、Critを積んでいないbuildでも完全に無意味にはならない。

---

## D019 — MidasはTier内最大値化ではなくTier +1

**Status:** Accepted

### Rejected

「発動時、そのAffix Tierの最大値へ固定」。

### Why rejected

- 効果を見ただけでは価値が分かりにくい
- Tier内Roll厳選を消してしまう
- 「高Tierが出やすくなる」というMidasの期待と少し違う

### Accepted

発動時:
- 全Affix Tier +1
- Tier IV cap
- 上昇後Tier内で値を通常再抽選

### Why

- 一行で説明できる
- Tier厳選もTier内Roll厳選も残る
- GOLDEN品を見た瞬間に価値が分かる

---

## D020 — Legendary固有ロールは1個だけ

**Status:** Accepted

### Decision

各Legendaryの可変値は原則1つ。

例:
- reverse damage
- pulse damage
- double-hit damage
- GOLDEN chance
- Super Crit multiplier

5% healや10% Super Crit chanceは固定。

### Why

2〜3軸の固有Rollを持たせると厳選が複雑になりすぎる。
「高Rollを見つけた」ことを直感的にしたい。

---

## D021 — 固有ロールは強化・Affix rerollで変えない

**Status:** Accepted

### Why

Legendaryそのものを掘り直す意味を残すため。

---

## D022 — Legendaryは非常にrareでよい

**Status:** Accepted

### Decision

平均30 Boss以上を許容する。

### Why

ゲームが放置前提であり、Legendaryを日常DROPではなく長期目標にするため。

v2.3.0式:

```
1.5% + pity×0.05% + MF×0.5%
```

---

## D023 — 倉庫満杯でrare Legendaryを即消滅させない

**Status:** Accepted

### Decision

3枠のLegendary Reserveを設置。

### Why

平均30Boss以上のDROPを、倉庫満杯だけで自動破棄すると放置ゲームとの相性が悪い。

### Full rule

- 同名なら高Rollを残す
- 3枠すべて別名で満杯なら4個目はポロッ💩

### Why not infinite

倉庫制限そのものを無意味にしないため。

---

## D024 — 初回Legendary自動ロック案は採用しない

**Status:** Superseded

初期案:
- 初取得だけ自動lock

最終案:
- Reserveで安全確保
- 固有Legendaryそのものをauto salvageしない
- Reserve満杯時だけポロッ💩

### Why

ロック状態を勝手に増やすより、overflow専用機構の方がルールが明快。

---

## D025 — 旧Legendaryを削除しない

**Status:** Accepted

### Decision

新規DROPから外す5種はLegacy Legendaryとして既存品を保持。

### Why

save破壊を避ける。
プレイヤーが過去に取得したアイテムを突然消さない。

---

## D026 — 自動装備はLegendary mechanicを理解する

**Status:** Accepted

### Decision

自動装備 / Equip Best / Compare / Offline DPSはLegendaryの期待値を評価する。

### Why

stat欄に現れない固有能力を無視すると、ゲーム側が強いLegendaryを「弱い」と判断して勝手に脱ぐため。

---

## D027 — Equip Bestは候補を最大6個/slotへprune

**Status:** Accepted with known limitation

### Why

16^5の全探索は重すぎる。

最大:

```
6^5 = 7776
```

へ抑える。

### Known risk

cross-slot synergyが増えると、単体評価で候補から落ちた装備が全体最適だったケースを取り逃す可能性がある。

Legendary synergyがさらに増えたら見直す。

---

## D028 — Inventoryは部位別16枠

**Status:** Accepted

### Why

- 全装備を1プールにすると特定slotが他slotを圧迫する
- slotごとに厳選量を読みやすくする
- UIタブと一致する

---

## D029 — Lockだけが絶対保護

**Status:** Accepted for normal items

### Decision

normal itemではrarityではなくlockを保護条件にする。

### Why

Legendary/Mythicだから絶対保護すると倉庫整理が硬直する。
プレイヤーが残したい物を明示する方が分かりやすい。

Unique Legendaryはv2.3.0で別途Reserve保護ルールを持つ。

---

## D030 — 比較UIは変わる値だけ表示

**Status:** Accepted

### Why

全statを並べるとノイズが多く、実際に何が変わるか分かりにくい。

---

## D031 — Git patchでは `$$` replacementに注意する

**Status:** Accepted engineering invariant

### Incident

JS `String.replace(search, replacementString)` のreplacement stringでは `$$` が特殊処理される。

過去に:

```js
$$('.tab').forEach(...)
$$('.sim-speed').forEach(...)
```

が自動patchで:

```js
$('.tab').forEach(...)
$('.sim-speed').forEach(...)
```

へ崩れ、startupが途中で例外終了。
heroもenemyも停止した。

### Rule

literal `$$` を含むreplacementはfunction replacementを使う。

```js
s.replace(old, () => "$$('.tab').forEach")
```

### Mandatory QA

- `$$('.tab').forEach`
- `$$('.sim-speed').forEach`
- suspicious `$('.foo').forEach` absence

構文checkだけではこのbugを検出できない。

---

## D032 — リリースQAはsyntaxだけでは不足

**Status:** Accepted

### Decision

最低でも:
- syntax check
- mocked startup
- all-tab render
- save migration
- semantic selector scan
- deterministic proc tests
- branch divergence check

を行う。

### Why

過去のselector regressionはsyntax-validだったため。

---

## D033 — mainへの反映はnon-force fast-forward

**Status:** Accepted

### Workflow

1. current `main`確認
2. feature branch
3. small commits
4. compare feature vs main
5. `behind_by = 0` 確認
6. QA
7. non-force fast-forward

### Why

知らない更新を上書きせず、rollback原因を追えるようにするため。

---

## D034 — Existing five dungeons are NORMAL

**Status:** Accepted

The current five dungeons form the NORMAL progression line. Future EX / BOSS / RESOURCE content must not force NORMAL to carry every reward specialty.

NORMAL is the main progression backbone and a general-purpose farming space.

---

## D035 — NORMAL uses 30F CLEAR structure

**Status:** Accepted

Each Normal has one Final Boss at 30F.

- 1–29F: normal / Elite encounters
- 30F: one-time Final Boss
- defeat = CLEAR
- 31F+: endless deep progression

### Why

20F felt too short for an area-clear arc. 30F allows early / middle / deep sections while keeping the boss as a single graduation test.

---

## D036 — Final Boss appears only once in NORMAL

**Status:** Accepted

After CLEAR, the 30F boss never reappears in Normal, including fixed-floor farming.

### Why

Repeated bosses interfere with stable farming and make Elite RNG before every boss feel punitive. A one-time gate preserves the achievement without repeatedly disrupting efficiency farming.

---

## D037 — Final Boss starts at full HP

**Status:** Accepted

Entering the Normal 30F Final Boss restores player HP to maximum.

### Why

The boss should test the build against the boss, not whether Floor 29 happened to roll a dangerous Elite.

---

## D038 — Boss Dungeon owns repeatable boss farming

**Status:** Accepted

Defeating a Normal Final Boss unlocks:
1. the next Normal dungeon
2. the defeated boss's Boss Dungeon

Boss Dungeon:
- boss only
- repeatable
- full HP every fight
- unique Legendary / Pity live here

### Why

This cleanly separates main progression, safe farming, and boss-specific loot.

---

## D039 — Dungeon LV is the shared difficulty scale

**Status:** Accepted

Player-facing name: **ダンジョンLV**.

```
Dungeon LV = dungeon.baseLv + localFloor - 1
```

It becomes the common baseline for enemy stats, Gold, EXP and Item Lv across future NORMAL / EX / BOSS / RESOURCE categories.

### Why

Local floors can remain readable while all content shares one comparable difficulty scale.

---

## D040 — Dungeon multipliers represent identity, not progression

**Status:** Accepted

Later Normal dungeons do not receive generic `diff` multipliers simply because they are later.

Dungeon LV handles progression. Dungeon HP / ATK / Speed multipliers only express character, such as:
- Rot = tougher and slower
- Machine = lower HP and faster
- Gold = slightly richer
- Cosmic = tougher all-round

---

## D041 — NORMAL Elite rate is fixed at 8%

**Status:** Accepted

Elite frequency is not a difficulty-scaling mechanism.

### Why

Increasing Elite rate with depth creates large variance in survival and farming efficiency. Future Elite difficulty should come from enemy mechanics rather than increasingly frequent stat spikes.

---

## D042 — Deep labels are descriptive

**Status:** Accepted

深層 I / II / III remain UI/world labels but no longer add hidden HP / damage / reward / Elite multipliers.

Dungeon LV itself supplies the continuous difficulty curve.

---

## D043 — NORMAL does not monopolize resource specialties

**Status:** Accepted

Golden Sewer keeps only a mild Gold/MF flavor; Cosmic keeps a high-Tier flavor.

Dedicated future RESOURCE dungeons should be the true destination for Gold / EXP / materials.

### Why

If Normal already contains the best Gold, EXP, rarity and Tier farms, future specialized dungeon categories have no meaningful role.

---

## D044 — Stable farming is player-selected

**Status:** Accepted

Normal allows fixed-floor farming on any reached floor.

The game does not automatically lower the selected floor after deaths.

### Why

Choosing the highest floor that can be farmed safely is part of the idle-game decision layer. The system may later show safety information, but the final choice remains with the player.

---

## D045 — New gear records source dungeon

**Status:** Accepted

New items store source dungeon and source Dungeon LV. Affix rerolls use the source dungeon's Tier distribution.

### Why

Moving an item to Cosmic before rerolling should not convert a low-quality source item into Cosmic Tier odds.

Pre-v2.4 items lack reliable source information and therefore retain legacy-compatible fallback behavior.

---

## D046 — Equipment family set bonuses are not used

**Status:** Accepted

同じ装備系統を2〜3部位揃えることで発動するセットボーナスは追加しない。

### Why

- 所属タグが個々の装備性能より強くなりやすい
- Affix / Tier / Implicit / Legendaryの自由な組み合わせを阻害する
- 「セット完成」が事実上の正解になりやすい

装備の個性は個別Implicit・Affix・Legendary mechanic側で作る。

---

## Open / Watch Items

### O002 — Equip Best pruning

Legendary synergy増加時にtop-6 pruningの最適性を再検討。

### O003 — Legendary balance

v2.3.0はmechanic導入初版。
実プレイで:
- reverse
- pulse
- double
- Super Crit
- GOLDEN

の実効価値を観測し、必要ならpatch/minorで調整する。
