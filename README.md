# 💩 DUNGEON

放置系RPGハクスラ **💩 DUNGEON** の開発リポジトリです。

## Baseline

- Version: **v2.2.4**
- Origin: ChatGPT Visualize prototype
- Goal: 既存ソースを正本として差分更新し、回帰バグを避けながら育てる

## Current core systems

- 完全自動戦闘
- 複数ダンジョン選択
- 5部位装備（武器 / 頭 / 胴 / 足 / 装具）
- 15種のベース装備 + Implicit
- Affix / Legendary / Mythic
- Affix Tierはダンジョンごとの固定確率で抽選
- 新Affix：痛撃 / 初撃 / 連撃 / 吸収 / 堅牢 / 反撃 / 癒撃 / 底力
- 旧Boss/Elite特攻AffixはLegacy品として既存装備のみ保持
- Elite / Nemesis / Boss周回
- 装備自動評価・自動装備・Common〜Mythicまで選択可能な自動分解
- 部位別16枠倉庫 + 武器/頭/胴/足/装具タブ
- 装備ソート / ロック / NEW表示 / 一括分解 / 固定比較パネル
- Affix図鑑（記録タブ）+ 最高ロール記録
- 汚泥による装備強化・Affix再抽選
- 特性 / FLUSH / 魂ツリー / Mastery
- FLUSHゲージ / 魂チェックポイント / FLUSH後開始地点
- 装備・汚泥などのFLUSH越し恒久保持
- ローカル自動セーブ / 旧セーブ移行 / セーブコード
- 最大8時間のオフライン報酬
- ステータス詳細 / DROP履歴

## v2.2.3 equipment migration

旧3枠セーブは自動移行します。

- `weapon` → 武器
- `armor` → 胴
- `charm` → 装具
- 頭 / 足は空き枠から開始
- 既存装備の数値と旧Affixは保持され、Legacy装備として扱われます
- 新規ドロップだけがベース装備 / Implicit / 新Affix体系を使用します

## v2.2.4 equipment management

- 倉庫は5部位それぞれ16枠。満杯時の整理も同じ部位内だけで行います
- 自動分解は OFF / Common / Rare / Epic / Legendary / Mythic 以下から選択できます
- Legendary / Mythicも自動・手動分解可能。ロック品だけは常に保護されます
- 部位タブごとにレア度 / Item Lv / 評価 / Affix Tier / 新着でソートできます
- 高レアの手動分解と「未ロックを全分解」は確認を挟みます
- Affix再抽選は対象Affixを選択できます
- 「最適装備」は各部位の有力候補を絞って組み合わせ比較し、16枠化後も計算量を抑えます
- Affix図鑑は記録タブへ移動し、自己最高ロールを保存します

## Source layout

- `index.html`: ゲーム画面のシェル
- `js/data.js`: データ・状態・装備ベース・Affix・最終ステータス計算
- `js/items.js`: 敵生成・装備生成・ドロップ処理
- `js/combat.js`: 戦闘・Affix Proc・撃破・死亡処理
- `js/progression.js`: 装備操作・育成・FLUSH
- `js/ui.js`: 表示・オフライン報酬
- `js/main.js`: 起動・セーブ・メインループ

`main` ブランチをプレイ可能な正式版として管理します。
