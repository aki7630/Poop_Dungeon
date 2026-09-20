# 💩 DUNGEON

放置系RPGハクスラ **💩 DUNGEON** の開発リポジトリです。

## Baseline

- Version: **v2.4.0**
- Origin: ChatGPT Visualize prototype
- Goal: 既存ソースを正本として差分更新し、回帰バグを避けながら育てる

## Project documents

- `README.md` — プロジェクト入口と現在の概要
- `CHANGELOG.md` — バージョンごとのパッチノート
- `SPEC.md` — 現在のゲーム仕様
- `DECISIONS.md` — 設計判断・理由・既知の注意点

## Current core systems

- 完全自動戦闘 / NORMAL攻略・指定階層周回 / Boss Dungeon / 最大8時間のオフライン報酬
- 5 NORMALダンジョン（各30FでCLEAR、31F以降は無限深層）/ 共通ダンジョンLV / 5部位装備
- 15種のベース装備 + Implicit
- Affix / Tier I〜IV / Legendary / Mythic
- 新Affix：痛撃 / 初撃 / 連撃 / 吸収 / 堅牢 / 反撃 / 癒撃 / 底力
- 部位別16枠倉庫、ソート、ロック、NEW、一括分解、固定比較
- 汚泥による装備強化・対象Affix再抽選
- 自動装備 / 最適装備 / Common〜Mythicの自動分解
- 特性 / FLUSH / 魂ツリー / Mastery / 魂チェックポイント
- ローカル自動セーブ / v2.1.1以降のセーブコード移行
- Affix図鑑・最高ロール記録 / Legendary図鑑

## v2.4.0 Dungeon Structure

ダンジョン進行を「攻略」「安定周回」「Boss周回」に分離しました。

- プレイヤー向け共通難易度指標 **ダンジョンLV** を導入
- 5つの既存ダンジョンをすべて **NORMAL** として整理
- NORMALは **1〜29F通常戦 → 30F Final Boss → CLEAR → 31F以降無限深層**
- Final BossはNORMAL内では初回だけ出現し、戦闘開始時にHP全回復
- Final Boss撃破で次のNORMALと対応する **Boss Dungeon** を解放
- CLEAR済みNORMALは任意の到達済み階層に固定して周回可能
- 固有Legendary / PityはNormal Final Bossから外し、Boss Dungeonへ移管
- Boss Dungeonは毎戦HP全回復で連続再戦
- Normal Elite率は全域8%へ統一
- Item Lv・敵基礎能力・Gold・EXPの基準をlocal floorからダンジョンLVへ移行
- 新規装備に取得元ダンジョン / 取得時ダンジョンLVを記録し、Affix再抽選は取得元Tier分布を参照
- v2.3.0以前の進行状況からNORMAL CLEAR状態を自動移行

現在の敵HP/攻撃のダンジョンLV成長係数は暫定値です。次のLv / Goldアップグレード再設計と合わせて本調整します。

## v2.3.0 Legendary Overhaul

各ステージの新規固有Legendaryを1個に整理しました。

| Dungeon | Legendary | Slot | Unique effect |
| --- | --- | --- | --- |
| 地下便所跡 | 衛生主任の逆流槍 | 武器 | 5回攻撃ごとに300.0〜400.0%の逆流撃 |
| 腐敗大聖堂 | 腐敗心核 | 胴 | 4回攻撃ごとに180.0〜260.0%の腐敗脈動 + 最大HP5%回復 |
| 浄化機関区 | 超蠕動ブラシ | 武器 | 通常攻撃を2Hit化。各Hit 70.0〜75.0% |
| 黄金下水宮 | ミダスの栓 | 装具 | DROP時10.0〜20.0%でGOLDEN化し、全Affix Tier +1 |
| 星間下水道 | 事象の地平便座 | 装具 | 会心時10%で超会心。通常会心ダメージ×5.0〜×7.0 |

- 固有ロールは0.1刻みで生成し、最高値を記録
- 逆流撃 / 腐敗脈動のカウントはHit数ではなく通常攻撃アクション数
- カウンターは敵をまたいで持ち越し
- 特殊攻撃は会心・痛撃・初撃・連撃倍率・底力・Boss/Elite倍率・吸収を受ける
- 特殊攻撃は連撃スタックやLegendary発動カウンターを進めない
- 腐敗脈動の5%回復は癒撃を発動可能
- GOLDENはTier IVを上限に各Affixを1段階引き上げ、値は上昇後Tier内で再抽選
- Legendary抽選率は **1.5% + Pity×0.05% + MF×0.5%**
- 平均入手間隔はMF 0%で約35.63 Boss、MF 85%で約31.92 Boss
- 固有Legendaryが倉庫に入らない場合は3枠のLegendary保留箱へ退避
- 保留箱の同名品は高い固有ロールを優先。3枠すべて別品で満杯なら4個目はポロッ💩

### Legacy Legendary

旧10種のうち以下5種は新規DROPを停止し、既存品のみ旧効果のまま保持します。

- 便座鋼装甲
- 胞子王外殻
- 浄化拒絶殻
- 黄金便座鎧
- 星間フラッシャー

旧「腐敗心核」はv2.3.0で装具から胴へ移行します。胴が埋まっている旧セーブでは既存装備を失わないよう倉庫へ退避します。

## Equipment management

- 倉庫は5部位それぞれ16枠
- 自動分解は OFF / Common / Rare / Epic / Legendary / Mythic 以下
- ロック品は自動分解・一括分解・満杯時整理の対象外
- 部位ごとにレア度 / Item Lv / 評価 / Affix Tier / 新着でソート
- 「最適装備」は各部位の有力候補を絞って組み合わせ比較
- 固定比較パネルは実際に変化するステータスだけ表示

## Source layout

- `index.html`: ゲーム画面のシェル
- `js/data.js`: データ・状態・装備・Affix・Legendary・最終ステータス計算
- `js/items.js`: 敵生成・装備生成・DROP・GOLDEN・保留箱振り分け
- `js/combat.js`: 戦闘・Affix / Legendary Proc・撃破・死亡処理
- `js/progression.js`: 装備操作・保留箱操作・育成・FLUSH
- `js/ui.js`: 表示・比較・図鑑・オフライン報酬
- `js/main.js`: 起動・セーブ・メインループ

`main` ブランチをプレイ可能な正式版として管理します。
