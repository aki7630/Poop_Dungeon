# 💩 DUNGEON — SPEC

Current specification for **v2.4.0**.

このファイルは「現在のゲームがどう動くべきか」を記述する正本です。
変更履歴は `CHANGELOG.md`、設計理由は `DECISIONS.md` を参照してください。

---

## 1. Product

- Genre: 放置系RPG / ハクスラ
- Platform: Browser
- Runtime: HTML + JavaScript
- Battle: 完全自動
- Canonical branch: `main`
- Current version: **v2.4.0**

プレイヤーはダンジョンを選び、装備を掘り、Affix・Legendary・育成システムを組み合わせてより深い階層へ進む。

---

## 2. Core Loop

1. ダンジョンを選択
2. 自動戦闘
3. 敵を撃破
4. Gold / XP / 装備 / 汚泥などを獲得
5. 装備を比較・自動装備・厳選
6. NORMAL 30F Final Bossを一度倒してCLEARし、次のNORMALとBoss Dungeonを解放
7. FLUSHで一部進行をリセットし、魂・Masteryなどの恒久成長を進める
8. より強い装備・高Tier Affix・固有Legendaryを掘る

---

## 3. Dungeons

### 3.1 Categories

ダンジョン基盤は将来以下のカテゴリを扱う前提。

- **NORMAL** — メイン進行 / 通常装備・EXP・Gold / 安定狩り
- **EX** — 高難度攻略（将来追加）
- **BOSS** — 単体Boss攻略・固有Legendary
- **RESOURCE** — Gold / EXP / 素材などの専用周回（将来追加）

v2.4.0で実装されているのはNORMALと既存5BossのBoss Dungeon。

### 3.2 Dungeon LV

プレイヤーには共通難易度を **ダンジョンLV** と表示する。

NORMALでは:

```
Dungeon LV = baseLv + localFloor - 1
```

| ID | NORMAL | baseLv | 30F | Character |
| --- | --- | ---: | ---: | --- |
| `sewer` | 🚽 地下便所跡 | 1 | LV 30 | 標準 |
| `rot` | ☣️ 腐敗大聖堂 | 31 | LV 60 | 高HP・低速 |
| `machine` | ⚙️ 浄化機関区 | 61 | LV 90 | 低HP・高速 |
| `gold` | 👑 黄金下水宮 | 91 | LV 120 | 少しGold / MF寄り |
| `cosmic` | 🌌 星間下水道 | 121 | LV 150 | NORMAL内の高Tier狙い |

local floorはそのダンジョン内の進行を示し、ダンジョンLVは敵基礎能力・Gold・EXP・Item Lvの共通尺度として使う。

### 3.3 NORMAL progression

各NORMALは共通して:

- 1〜29F: 通常敵 / Elite
- 30F: **Final Boss**
- Final BossはNORMAL内では初回だけ出現
- Final Boss開始時にHPを全回復
- 敗北しても30Fから再挑戦
- 撃破で `normalCleared[id] = true`
- CLEAR時に次のNORMALと対応Boss Dungeonを解放
- CLEAR後は31F以降へ無限に進行可能
- CLEAR済み30Fは以後通常階層として扱う

解放順:

```
地下便所跡
→ 腐敗大聖堂
→ 浄化機関区
→ 黄金下水宮
→ 星間下水道
```

### 3.4 NORMAL farm

NORMALでは攻略進行とは別に、到達済みの任意local floorを固定周回できる。

- `mode = progress`: 階層を進める
- `mode = farm`: `farmFloors[id]` に固定
- 未CLEARダンジョンでは30Fを周回指定できない
- 周回中に死亡しても指定階層へ戻る
- 周回勝利では `runFloor` / `best` を進めない

目的は、死亡による効率低下を避けつつ、プレイヤーが自分で安定する狩場を選べるようにすること。

### 3.5 Boss Dungeon

対応NORMALのFinal Boss撃破で解放。

- 雑魚戦なし
- 既存Bossと連続再戦
- 毎戦開始時HP全回復
- Boss Dungeon勝利で `bossCleared[id]` を記録
- 固有Legendary抽選とPityは **Boss Dungeonだけ**
- NORMAL Final Bossは固有Legendary / Pity対象外

Boss Dungeon LVは対応NORMAL 30Fと同じ。

### 3.6 NORMAL modifiers

NORMAL後半だからという理由だけの総合難易度倍率 `diff` は使用しない。
進行による基礎強度はダンジョンLVが担当し、ダンジョン固有倍率は性格に限定する。

| Dungeon | HP | ATK | Speed | Gold | Dungeon MF | Elite |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 地下便所跡 | ×1.00 | ×1.00 | ×1.00 | ×1.00 | +0% | 8% |
| 腐敗大聖堂 | ×1.20 | ×0.95 | ×0.90 | ×1.00 | +0% | 8% |
| 浄化機関区 | ×0.90 | ×1.00 | ×1.25 | ×1.00 | +0% | 8% |
| 黄金下水宮 | ×1.05 | ×1.05 | ×1.00 | ×1.15 | +2% | 8% |
| 星間下水道 | ×1.10 | ×1.08 | ×1.05 | ×1.00 | +0% | 8% |

Elite率は難易度スケーリングには使わず、NORMAL全域8%。

### 3.7 Tier chance

| Dungeon | Tier I | Tier II | Tier III | Tier IV |
| --- | ---: | ---: | ---: | ---: |
| 地下便所跡 | 50% | 32% | 14% | 4% |
| 腐敗大聖堂 | 44% | 33% | 18% | 5% |
| 浄化機関区 | 36% | 35% | 22% | 7% |
| 黄金下水宮 | 42% | 34% | 19% | 5% |
| 星間下水道 | 27% | 32% | 29% | 12% |

NORMALでTier IVを出しすぎず、将来のEX Dungeonへ高Tier報酬余地を残す。

### 3.8 Provisional Dungeon LV curve

v2.4.0ではプレイヤーLv / Goldアップグレード再設計前のため暫定値。

- Enemy HP: `12 × 1.03^(DungeonLv-1) × (1 + DungeonLv×0.006)` を基礎
- Enemy ATK: `1.8 × 1.018^(DungeonLv-1)` を基礎

次の成長システム再設計後に本調整する。
`深層 I / II / III` は現在、追加倍率ではなく表示上の区分。


---

## 4. Equipment

### 4.1 Slots

5部位。

- `weapon` — ⚔️ 武器
- `head` — 🪖 頭
- `chest` — 🛡️ 胴
- `feet` — 👢 足
- `trinket` — 💍 装具

旧キーは移行時に以下へ変換。

- `armor` → `chest`
- `charm` → `trinket`

### 4.2 Inventory

- 各部位 **16枠**
- 装備中アイテムは16枠に含まない
- 満杯処理は同部位内だけで行う
- ロック品は自動分解・一括分解・満杯時の退避候補から除外
- 旧セーブなどで上限超過している装備は破壊しない

### 4.3 Rarity

| Rarity | Affix count |
| --- | ---: |
| Common | 0 |
| Rare | 1 |
| Epic | 2 |
| Legendary | 3 |
| Mythic | 4 |

固有LegendaryはLegendary rarityとして生成される。

### 4.4 Base Equipment

通常ベース装備は5部位 × 3種 = **15種**。

#### Weapon
- 配管剣 — 攻撃型 / Implicit: 攻撃 +8%
- 浄化ブラシ — 速度型 / Implicit: 攻撃速度 +10%
- 腸圧砲 — 初撃型 / Implicit: 初撃 +18%

#### Head
- 鋼鉄便座兜 — HP型 / Implicit: 最大HP +8%
- 汚染マスク — 会心型 / Implicit: 会心 +4%
- 探索ゴーグル — MF型 / Implicit: Magic Find +4%

#### Chest
- 配管装甲 — 防御型 / Implicit: 被ダメージ軽減 +5%
- 粘膜鎧 — 回復型 / Implicit: 秒間HP回復 +0.5%
- 腐敗外殻 — 反撃型 / Implicit: 反撃 +25%

#### Feet
- 蠕動ブーツ — 速度型 / Implicit: 攻撃速度 +7%
- 重圧長靴 — HP型 / Implicit: 最大HP +6%
- 黄金スリッパ — Gold型 / Implicit: Gold +12%

#### Trinket
- 便座印章 — 会心型 / Implicit: 会心 +3%
- 腸内菌環 — 再生型 / Implicit: 秒間HP回復 +0.4%
- 黄金栓 — MF型 / Implicit: Magic Find +5%

---

## 5. Affixes

通常抽選されるAffix:

| ID | Name | Effect |
| --- | --- | --- |
| `fierce` | 猛攻 | 攻撃力 |
| `quick` | 迅速 | 攻撃速度 |
| `sharp` | 会心 | 会心率 |
| `vital` | 生命 | 最大HP |
| `regen` | 再生 | 秒間HP回復 |
| `greed` | 黄金 | Gold獲得 |
| `finder` | 探索 | Magic Find |
| `critdmg` | 痛撃 | 会心倍率 |
| `first` | 初撃 | 高HP敵への初撃補正 |
| `combo` | 連撃 | 同一敵へのHit蓄積補正 |
| `leech` | 吸収 | 与ダメージ回復 |
| `dr` | 堅牢 | 被ダメージ軽減 |
| `counter` | 反撃 | 被弾時反撃 |
| `healstrike` | 癒撃 | 実回復に応じた追加攻撃 |
| `laststand` | 底力 | HP減少時に火力増加 |

Legacyのみ:

- 討伐 — Boss補正
- 腐食 — Elite補正

### 5.1 Tier ranges

主要レンジ:

- 猛攻: 5–8 / 9–13 / 14–19 / 20–27%
- 迅速: 4–7 / 8–11 / 12–16 / 17–23%
- 会心: 2–3 / 4–5 / 6–8 / 9–12%
- 生命: 6–10 / 11–15 / 16–22 / 23–31%
- 再生: 0.25–0.4 / 0.45–0.7 / 0.75–1.05 / 1.1–1.5%/s
- 黄金: 7–11 / 12–18 / 19–27 / 28–40%
- 探索: 2–3 / 4–6 / 7–9 / 10–13%
- 痛撃: 25–40 / 50–75 / 90–130 / 160–220%
- 初撃: 15–25 / 30–40 / 45–60 / 70–90%
- 連撃: 1.5–2.5 / 2.5–3.5 / 4–5 / 6–8% per Hit
- 吸収: 0.25–0.4 / 0.5–0.7 / 0.8–1.1 / 1.2–1.6%
- 堅牢: 2–3 / 4–6 / 7–9 / 10–13%
- 反撃: 30–45 / 50–70 / 80–110 / 120–160%
- 癒撃: ×1.5–2.5 / ×3–4 / ×4.5–6 / ×8–11
- 底力: 15–25 / 30–45 / 50–70 / 80–110%

Affix再抽選では、選択した1個だけを再抽選する。
固有LegendaryロールはAffix再抽選の対象外。

v2.4.0以降に生成した装備は `sourceDungeon` / `sourceDungeonLv` を記録し、取得元が分かる装備のAffix再抽選は取得元ダンジョンのTier分布を使用する。
Item Lvは原則として取得時ダンジョンLV ±2。

---

## 6. Combat Stats

### 6.1 Caps

- Attack speed cap: **5.0 / sec**
- Crit chance cap: **70%**
- Crit multiplier cap: **×6**
- Damage reduction cap: **55%**
- Magic Find cap: **85%**

### 6.2 Critical

基礎会心倍率:

```
×2.5
```

痛撃により増加し、最大×6。

### 6.3 Damage stacking

同じカテゴリ内は加算、異なるカテゴリは乗算。

概念的には:

```
base
× attack%
× first
× combo
× lastStand
× crit
× boss/elite
```

### 6.4 Combo

- 同一敵へのHit数で蓄積
- 最大10段階
- 1Hit目には連撃倍率を適用しない
- 2Hit目以降、現在Hit数に応じて増加

---

## 7. Proc Safety

副次ダメージから無限連鎖しないことを最優先する。

- 通常直接攻撃は吸収を発動可能
- 吸収回復は癒撃を1回発動可能
- 再生による実回復は癒撃を発動可能
- 反撃ダメージから吸収を発動しない
- 癒撃ダメージから吸収を発動しない
- その他の副次ダメージから吸収を再帰発動しない
- オーバーヒールは癒撃の対象外
- Level up / dungeon reset / death / respawn等の全回復は癒撃を発動しない
- 吸収量は敵の残HPを超えた過剰ダメージではなく、**実際に与えた直接ダメージ**で計算
- 反撃は被弾で生存した場合のみ発動
- 副次ダメージで敵HPが0以下になった場合も通常のkill flowへ接続

---

## 8. Unique Legendary

v2.3.0では新規DROPする固有Legendaryは5種。

| Dungeon | Legendary | Slot | Effect | Roll |
| --- | --- | --- | --- | --- |
| 地下便所跡 | 衛生主任の逆流槍 | weapon | 5攻撃ごとに逆流撃 | 300.0–400.0% |
| 腐敗大聖堂 | 腐敗心核 | chest | 4攻撃ごとに腐敗脈動 + 最大HP5%回復 | 180.0–260.0% |
| 浄化機関区 | 超蠕動ブラシ | weapon | 1攻撃を2Hit化 | 70.0–75.0% / Hit |
| 黄金下水宮 | ミダスの栓 | trinket | DROP時にGOLDEN化 | 10.0–20.0% |
| 星間下水道 | 事象の地平便座 | trinket | Crit後10%でSuper Crit | ×5.0–×7.0 |

### 8.1 Unique roll precision

- %系ロール: 表示上0.1ポイント単位
  - 例: 347.2%, 72.4%, 16.7%
- Super Crit: ×0.1単位
  - 例: ×5.8

### 8.2 Attack action rule

逆流槍・腐敗心核の周期カウンターは**Hit数ではなく通常攻撃アクション数**。

超蠕動ブラシで1回の攻撃が2Hitになっても、周期カウンターは+1だけ。

カウンターは敵を倒しても持ち越す。

### 8.3 Order

通常攻撃1アクション:

1. 通常Hitを処理
2. 超蠕動ブラシなら2Hit目を処理
3. 通常攻撃アクションカウンターを+1
4. 条件到達なら逆流撃 / 腐敗脈動を処理

### 8.4 Special attacks

逆流撃・腐敗脈動:

適用するもの:
- 会心
- 痛撃
- 初撃
- 現在の連撃倍率
- 底力
- Boss / Elite倍率
- 吸収

適用しない/進めないもの:
- Legendary周期カウンター
- Legendary Procの再帰発動
- 追加の連撃スタック

腐敗脈動の最大HP5%回復は通常の実回復として扱い、癒撃を発動可能。

### 8.5 Super Crit

処理順:

```
通常Hit
→ Crit判定
→ Crit成功時のみ10%でSuper Crit判定
```

Super Critは**通常会心ダメージへさらに固有倍率を乗算**する。

### 8.6 GOLDEN

ミダスの栓装備中、装備DROP生成時に固有ロール確率でGOLDEN化。

GOLDEN時:

- Affix Tier I → II
- II → III
- III → IV
- IV → IV

その後、**上昇後Tierの通常レンジから値を再抽選**する。
Tier内のランダム厳選は残す。

---

## 9. Legendary Drop

固有Legendary確率:

```
chance = 1.5% + 0.05% × pity + 0.5% × MF
```

コード上はMFを0〜0.85の小数で保持するため:

```
0.015 + pity * 0.0005 + mf * 0.005
```

- 成功時 Pity = 0
- 失敗時 Pity +1
- 各Boss Dungeonは1種類だけなので、成功時は対応Bossの固有Legendary確定
- この抽選はBoss Dungeonでのみ行い、NORMAL Final Bossでは行わない

目安:
- MF 0%: 平均 約35.63 Boss
- MF 85%: 平均 約31.92 Boss

---

## 10. Legendary Reserve

`legendaryStash`

- 最大 **3枠**
- 通常収納できなかった固有Legendaryだけを一時保管
- 自動分解されない
- UIから「装備 / 保管 / 分解」
- 同名Legendaryが保留箱にある場合、固有ロールの高い方を残す
- 3枠すべて異なるLegendaryで埋まっている場合、4個目は **ポロッ💩**
- ポロッ💩した個体はcollectionへ登録しない
- 保留箱へ正常に入った個体は取得済みとして扱う

---

## 11. Legacy Legendary

新規DROP停止、既存品のみ保持:

- 便座鋼装甲 — 最大HP +30%
- 胞子王外殻 — Eliteダメージ +45%
- 浄化拒絶殻 — 被ダメージ -18%
- 黄金便座鎧 — Gold獲得 +55%
- 星間フラッシャー — 攻撃 +32%、攻撃速度 +15%

旧同名5種:

- 衛生主任の逆流槍
- 腐敗心核
- 超蠕動ブラシ
- ミダスの栓
- 事象の地平便座

はv2.3.0の新仕様へ移行する。

旧腐敗心核は `trinket` → `chest`。
移行先の胴が埋まっている場合は既存品を失わないようInventoryへ退避。

旧データに固有ロールがない場合、各Legendaryのロール範囲中央値を初期値として与える。

---

## 12. Drops

装備DROP基礎率:

- Normal: **8%**
- Elite: **30%**
- Boss: **45%**

Magic Findで加算し、通常装備DROP率は最大75%。

---

## 13. Auto Equip / Evaluation

自動装備・最適装備・比較・オフラインDPSは、通常ステータスだけでなく固有Legendaryの期待値も考慮する。

例:
- 逆流撃の平均追加DPS
- 腐敗脈動の平均追加DPSと期待回復
- 超蠕動ブラシの2Hit倍率
- Super Crit期待値
- ミダスのGOLDEN生成価値

### Equip Best

各部位の候補を事前評価し、上位最大6個に絞って組み合わせ比較する。

最大探索量:

```
6^5 = 7776 combinations
```

固有Legendaryのようなcross-slot synergyが増えた場合、このpruningが真の最適解を落とす可能性があるため、将来的な再設計対象。

---

## 14. Sorting / Item Management

部位別Inventoryのsort:

- rarity
- Item Lv
- score
- max Affix Tier
- newest

NEW:
- 新規取得時 `isNew=true`
- 該当部位Inventoryを表示すると既読化

ロック:
- auto salvageを防止
- bulk salvageを防止
- overflow evictionを防止
- manual salvageも不可

---

## 15. Save

Current:
- Local key: `POOP_DUNGEON_V240`
- Export prefix: `POOPRPG240-`
- Payload version: `240`

v2.1.1以降の対応形式を移行可能。

v2.3.0以前からの移行では、旧ダンジョン解放条件を参照してNORMAL CLEAR状態を推定し、以前アクセスできた主要コンテンツが再ロックされないようにする。

保存対象:
- NORMAL進行 / 最高到達
- `normalCleared`
- NORMAL指定周回階層 `farmFloors`
- Boss Dungeon初回撃破 `bossCleared`
- Boss Legendary Pity
- 装備 / Legendary Reserve / collection / 育成

保存時:
- battle中のenemyは保存しない
- pauseは解除状態として保存
- dead stateは復元時に初期化


---

## 16. Offline

- 最大8時間
- 現在装備・成長・DPSを基に報酬を計算
- Legendary期待DPSも評価値へ含める
- NORMAL攻略 / 指定周回 / Boss Dungeonの現在モードを参照して安定地点を計算
- オフライン生成装備のItem LvはダンジョンLV基準

---

## 17. Versioning

- Patch: 小規模変更 / bug fix / UI polish
  - 例: 2.2.4 → 2.2.5
- Minor: Affix追加 / 新システム / gameplayに影響する中規模変更
  - 例: 2.2.5 → 2.3.0
- Major: 世代が変わる大型変更

バージョン変更時は同時に更新:

- runtime version
- `index.html` title
- save local key
- save export prefix
- payload version
- README
- CHANGELOG
- 必要ならSPEC / DECISIONS

---

## 18. Source Responsibilities

- `index.html` — shell / static UI
- `js/data.js` — definitions, state, migration, stat calculation
- `js/items.js` — enemy/item generation, Dungeon LV scaling, drops, GOLDEN, inventory routing
- `js/combat.js` — combat, procs, kill/death
- `js/progression.js` — item actions, growth, FLUSH
- `js/ui.js` — rendering, comparison, records, offline UI
- `js/main.js` — startup, save/load, event binding, main loop

---

## 19. Release Invariants

リリース前に最低限確認する。

- 全JSがsyntax pass
- startupが例外なく通る
- 全タブがrender可能
- `$$('.tab').forEach` が保たれている
- `$$('.sim-speed').forEach` が保たれている
- `$('.foo').forEach` のような誤った単一selector複数処理がない
- old save migration
- current save round-trip
- v2.3.0 → v2.4.0 NORMAL CLEAR migration
- 30F Final Bossが初回だけ出現し、開始時全回復
- Final Boss撃破で次NORMAL / Boss Dungeonが解放される
- Normal Final BossでLegendary Pityが進まない
- Boss DungeonでのみLegendary Pityが進む
- 指定階層周回でrunFloor / bestが進まない
- Proc再帰がない
- unique Legendary action counterがHit数で増えない
- GOLDENがTier IVを超えない
- Legendary reserveの3枠 / 同名高ロール優先 / 4個目ポロッ💩
- feature branchがmainに対してbehind 0
- mergeはnon-force fast-forward
