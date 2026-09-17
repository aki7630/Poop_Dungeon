# 💩 DUNGEON

放置系RPGハクスラ **💩 DUNGEON** の開発リポジトリです。

## Baseline

- Version: **v2.2.2**
- Origin: ChatGPT Visualize prototype
- Goal: 既存ソースを正本として差分更新し、回帰バグを避けながら育てる

## Current core systems

- 完全自動戦闘
- 複数ダンジョン選択
- 装備 / Affix / Legendary / Mythic
- Elite / Nemesis / Boss周回
- 装備自動評価・自動装備・自動分解
- 装備DROP抑制（通常8% / Elite30% / Boss45% + MF補正）
- Item Level由来の基礎性能成長を緩和し、良品の寿命を延長
- 汚泥による装備強化・Affix再抽選
- 特性 / FLUSH / 魂ツリー / Mastery
- FLUSHゲージ / 魂チェックポイント / FLUSH後開始地点
- 装備・汚泥などのFLUSH越し恒久保持
- ローカル自動セーブ / 旧セーブ移行 / セーブコード
- 最大8時間のオフライン報酬
- ステータス詳細 / DROP履歴

## Source layout

- `index.html`: ゲーム画面のシェル
- `js/data.js`: データ・状態・最終ステータス計算
- `js/items.js`: 敵生成・装備生成・ドロップ処理
- `js/combat.js`: 戦闘・撃破・死亡処理
- `js/progression.js`: 装備操作・育成・FLUSH
- `js/ui.js`: 表示・オフライン報酬
- `js/main.js`: 起動・セーブ・メインループ

`main` ブランチをプレイ可能な正式版として管理します。
