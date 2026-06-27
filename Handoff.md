# Handoff — 堀川家のゲームセンター 引き継ぎドキュメント

新しいセッションで作業を引き継ぐためのスナップショット。
プロジェクト全体仕様・運用ルール・直近の作業ログを1本にまとめた唯一の引き継ぎファイル。

---

## 🚨 絶対ルール（次セッションのClaudeへ）

**変更を加えたら、必ずこの `Handoff.md` も同じコミットで更新すること。**

- 新機能を追加した／設定を変えた／既知バグを直した → 「直近の作業ログ」に1〜2行追記
- 仕様や運用ルールが変わった → 該当セクションを書き換え
- 新たな保留事項・注意点が出た → 「未解決・要注意」に追記
- ファイル構成が変わった → 「ディレクトリ構成」を更新

ユーザーから明示の指示がなくてもこのルールは適用する。コミットを切るたびに「Handoff.md は最新か？」と自問する。

---

## ✅ 完了：過去編27キャラの個別必殺技（Batch 1-6 全完了 2026-05-03）

過去編の味方27キャラ全員に**専用の必殺技（8回攻撃ごと発動）**を実装済。通常攻撃は現行のまま、選択されたデザインに `color` を合わせ、必殺技のみカスタム描画＋挙動。プレビューHTMLは `samurai-wars/{id}-preview.html` に残している（テンプレ参考用）。

### 必殺技攻撃のテンプレ参考（既に実装済の代表例）
- 線形貫通弾 → `slashWaves` + `style:'wind'`/`'water'`/`'eye'`/`'charge_beam'`/`'golden_light'`/`'mega_flame'`/`'tornado'`
- 範囲広域DoT → `blizzards` + `style:'fire'`/`'poison'`
- 範囲AOE+スタン → `quakes` + `style:'sweep'`(前方)/`'kagura'`(放射状)/`'spin'`(高速回転)/`'naginata_spin'`(多段)/`'binding_seal'`(魔法陣)
- 突進系 → `kamikazes` + `style:'leap'`/`'slam'`/`'mecha_charge'`/`'horse_charge'`(貫通)/`'final_crash'`/`'mountain_throw'`
- 多体ターゲット → `cloneStrikes` (`'teleport'` 含む) / `jumpCombos` + `style:'snake'` / `pendingShots`(時間差弾) / `pillars`(雷柱、負timer遅延OK)
- 単発高威力 → `bullets` に `weapon:'fireball'` + `aoe:true` でエフェクト流用
- 自己バフ → `attacker.kishinka = 3.0` のようなタイマーフラグ＋ `attackTarget` 冒頭で再評価

### 注意点
- 通常攻撃は変更しない（ユーザの強い要望）
- 必殺技フロート表示は `addFloat(attacker.x, attacker.y - 60, '⚡ 技名 ⚡', 'color', true)` の形式
- 共有 helmet 描画 (`hood`/`taisho`/`benkei`/`onmyouji_hat`/`jingasa`/`cyber_hood`/`raijin_horns`/`kishin`/`daidara`) は `color` 引数連動済、`color` を変えるだけで頭部デザインも追従

---

## 概要

家族向けの3ゲーム入りWeb arcade。GitHub Pagesで公開。

- 本番URL: https://shintaro101-tech.github.io/horikawa-game-center/
- リポジトリ: `Shintaro101-tech/horikawa-game-center`（main ブランチ = 本番）

### ディレクトリ構成

```
堀川家のゲームセンター/
├── index.html             ← ポータル（4ゲームのカード + 訪問者カウンター）
├── deep-sea/              ← 🌏 世界大冒険（旧「深海大冒険」・Phaser 3。フォルダ名は deep-sea のまま）
│   ├── index.html
│   ├── css/style.css
│   └── js/game.js
├── kanji-race/            ← ⚔️ 漢字侍 聖剣伝説（Three.js r128）
│   ├── index.html
│   └── css/style.css
├── samurai-wars/          ← 🏯 時代大戦争（旧「過去・未来大戦争」・Canvas 2D タワーディフェンス。フォルダ名は samurai-wars のまま）
│   ├── index.html         ← 単一ファイル、~16000行（4編実装済）
│   ├── *-preview.html     ← デザイン選択用プレビュー（過去27 + 現代18 + 未来18 + 城砲5 + indexes）
├── heist/                 ← 🦖 怪獣を盗む（旧「モンスター・ハイスト」・Three.js r128・新規）
│   ├── index.html         ← 単一ファイル。Steal a Brainrot inspire の3D収集ゲーム
│   ├── kaiju-preview.html ← 怪獣デザイン案プレビュー（選定用）
│   ├── bahamut-preview.html ← バハムートのデザイン3案（選定用・本番は仮で案A）
│   └── character-preview.html ← メイン/敵キャラのデザイン3案（選定済：メイン=B/敵=A・B・C 全採用→本番反映済）
├── .claude/launch.json    ← プレビュー用（python3 http.server :8123, name="arcade"）
├── Handoff.md             ← このファイル（唯一の引き継ぎドキュメント）
└── README.md
```

---

## ホーム画面（`index.html`）

- 4ゲームカード（世界大冒険 / 漢字侍 聖剣伝説 / 時代大戦争 / 怪獣を盗む）
- フッター下に **訪問者カウンター**（控えめなシアン、ラベル `TOTAL VISITORS`）
  - サービス: `counterapi.dev`（無料・登録不要）
  - namespace: `horikawa-arcade` / counter key: `home`
  - エンドポイント: `https://api.counterapi.dev/v1/horikawa-arcade/home/up`（増加）／末尾 `/`（取得のみ）
  - 同一セッション中の重複カウントは `sessionStorage['horikawa-arcade-hit']` で抑制
  - API失敗時は要素ごと `remove()` するので、サービス障害時もページは正常表示
  - **リセットしたい場合**: counter key を `home2` などに変えれば実質ゼロから再スタート可能

---

## 各ゲームの現状

### 🦖 怪獣を盗む (`heist/index.html`) — 新規・多機能実装済（活発に開発中）
**Steal a Brainrot（Roblox）inspire** の3D収集ハイストゲーム。Three.js r128・単一HTML。シングルプレイ（AI拠点が相手）。
- **見た目は明るい昼間のカートゥーン調**（ブレインロット寄せ。ネオンではない）: 青空＋雲＋芝生＋砂の広場＋カラフルな砦＋太枠ぷっくりUI。`scene.background=0x8fd4ff` / `HemisphereLight` で屋外光。`--ink=#1f2d3d` の黒枠＋ドロップシャドウがカートゥーンの肝。

- **コアループ**（移植済・全動作確認済）: 放置収入 × 盗む/運ぶ × ショップ購入 × 転生(リバース)
- **3D**: 明るい昼間カートゥーンのフロア（青空＋芝生＋砂広場）、リング配置の拠点6つ（自分1 + AI5、リングは+30°回転でパレード道と非干渉）。三人称追従カメラ。
- **操作**: 画面ジョイスティック（左下）+ アクションボタン（右下、文脈で つかむ/おく/うる/かう が変化）。**スペース=ジャンプ（2連打で飛行ON/OFF＝マイクラ風）、E/左クリック=`actionOrAttack`、F=なぐる、M=ミュート**。飛行中は「うえ/おりる」ボタン表示。物理は `phys{y,vy,grounded,flying}`、`doJumpPress`。
- **盗みの流れ**: AI拠点（ロック解除中）に入る → アクションで台座の怪獣を つかむ（運搬中は移動少し遅・頭上に表示）→ 自分の拠点まで運び 空き台座に おく → 所持化。
- **拠点ロック**: **🔒ロックmini-button**で一定秒ロック（盗まれ防止）。AI拠点もロック/解除を周期で繰り返し、解除中だけが盗めるスキ。ロック中の拠点には侵入できず押し戻される。
- **ショップ＝直線パレード**: 入口(`PARADE_X0=-32`)→出口(`PARADE_X1=32`)の直線道(z=0)を怪獣/悪魔の実が `PARADE_SPEED` で流れ、出口で入口へリサイクル（常時供給。`PARADE_N=6`で間隔を空け誤購入防止）。`buildParade`/`updateParade`/`setParadeItem`/`paradeRandomItem`。頭上にHTML価格ラベル(`.plabel`/`.plabel.fruit`)。近づき「かう」で購入(`buyParade`)。**敵も購入**（`updateAI` がパレードの怪獣を消費して自拠点へ）。
- **戦闘**: `👊なぐる`ボタン/FキーでdoAttack。半径内の敵をノックバック（`knockbackRival`）。装備中の悪魔の実で攻撃が変化。プレイヤーも殴られるとノックバック＋スタン（`knockbackPlayer`、`pkb`/`player.userData.stunUntil/invuln`）。エフェクトは `fx`配列＋`addFx`/`spawnStars`/`attackEffect`。
- **敵プレイヤーAI（ワールド空間ステートマシン）**: `rivals[]`、`base.rivalE`。状態 guard/chase/rob_go/rob_back/return。**盗むと(`doGrab`)その拠点の敵がchaseで追跡→接触でプレイヤーをノックバック＆盗み失敗**。**敵もrob_goで自拠点に侵入→怪獣を奪いrob_back**。窃盗時 `showStealAlert`＋画面端に方向矢印(`updateThiefArrow`/`#thief-arrow`)。**rob_back中の敵を殴ると取り返す**（`knockbackRival`内）。ライバルの帯/バイザー/腰布色＝拠点色で誰か識別可。`RIVAL_NAMES`。
- **キャラデザイン（確定）**: メイン＝**ふわっとマスコット**（`buildPlayer`）。敵＝**3種を拠点ごとに使い分け**（`buildRival(color,style)`：0=ガキ大将/1=ガードロボ/2=ゴブリン、`style=(idx-1)%3`）。案見本 `heist/character-preview.html`。
- **自分の怪獣を売る**: 自拠点の台座の怪獣に近づくと文脈 `sell`（半額還元・`doSell`）。ロックは contextual をやめ **🔒ロックmini-button**（`btn-lock`→`toggleLock`）に分離。
- **悪魔の実 `FRUITS`（9種）**: ビヨンビヨン(stretch)/カミカミ(thunder)/キラキラ(sparkle・遠距離特殊無効passive)/バクハツ(bomb)/ムキムキ(giant)/**ボウボウ(fire・旧メラメラ)**/**カチコチ(ice・旧ヒエヒエ)**/グルグル(spin)/**ハヤハヤ(dash)**。※ワンピース実在名(メラメラ/ヒエヒエ)を回避してリネーム。内部idは `mera`/`hie` のまま。`state.fruit`に1つ装備、HUDにチップ表示。パレードに約22%で出現、購入で装備。`buildFruitMesh`。
- **吹っ飛び/凍結（攻撃の派手化）**: `doAttack`→`knockbackRival(e,from,kb,stun,launchMs,freezeMs)`。`launchMs`中は摩擦を弱め(`pow(0.5,dt)`)遠くまで飛ぶ。**ビヨンビヨン=画面端**(launch1300/kb52)、**バクハツ=中**(launch550/kb30)、**カチコチ=3秒氷漬け**(`freezeRival`が氷ブロック`e.iceMesh`を装着、`frozenUntil`中は静止、`unfreezeRival`で解凍)。
- **ムキムキ＝溜め演出**: `doAttack`は`kind==='giant'`なら`startMukiCharge()`へ分岐（即ノックバックしない）。`mukiSeq{phase}`を`updateMuki(dt)`で進行。charge(0.8s)=巨大拳(`buildBigFist`)が加速回転で振り回し→slam(0.15s)=正面へ強打、着弾で範囲ノックバック(kb56,launch1300)＋大エフェクト。開始時に最寄り敵へ向き直る。`sfx('charge')`。**壁時計(`nowMs`)基準なので同期ループのテストでは進まない点に注意**。
- **図鑑/メニュー中はポーズ**: `animate()`が`isModalOpen()`(dex/rebirth/howto表示中)なら`update`を呼ばず時間停止＝**盗まれない**。復帰時 `lastTick` を戻し収入ジャンプ防止。
- **パレード間隔**: `PARADE_N=6`・X0/X1=±32（gap≈10.7）＋buy判定 `nearD=2.8` で誤購入防止。
- **ダッシュ（ハヤハヤの実）**: **装備している間ずっとダッシュ**＝移動速度×`DASH_MULT`(1.9)。スタミナ/メーター/2連打/ダッシュボタンは廃止。移動中は `spawnDashPuff` でスピード煙。`update`の速度計算で `state.fruit==='haya'` を判定するだけ。
- **運搬中に売って置き換え**: 自拠点が満杯のまま怪獣を運ぶと、文脈が `sell_place`（一番近い台座の怪獣を半額で売却→空いた枠に運搬中を設置、`doSellPlace`）。
- **E / 左クリック = `actionOrAttack`**: 優先順位「配達(drop/sell_place) ＞ 射程内の敵を殴る ＞ つかむ/かう/ロック ＞ 空振り」。＝Eキーでも敵を殴れる。攻撃(`doAttack`)は盗み状態に関係なくいつでも可。
- **飛行中の判定**: 追跡敵は `chase` 時にプレイヤーの高さへ上昇（敵も飛ぶ）。捕獲・パンチは3D距離(`distanceTo`)で判定＝高さが合わないと当たらない。`moveEntityTo`はyを触らず、各stateで高さを設定。
- **運搬速度**: `PLAYER_CARRY_SPEED=7.5`（通常9より少し遅い）。
- **図鑑**: 📖ボタン(右上)→`#dex`。全怪獣のレア度/収入/価格/所持数＋全悪魔の実を一覧（`openDex`/`renderDex`/`CREATURE_COLOR`）。
- **放置収入**: 台座の怪獣がレアリティ別に毎秒お金を生む（×転生倍率）。250msごとに加算。
- **レアリティ**: コモン/レア/エピック/レジェンド/シークレット/**ミシック**の6段階（`RARITY`）。コスト・収入が連動。**ミシック=超激レア**（cost 275000＝シークレット×5、income 3500、weight 1）。
- **怪獣15体**: `CREATURES` = オオムカデ(common) / イルルヤンカシュ(rare) / ヒドラ(epic) / ケルベロス(epic) / 応龍(legendary) / 九頭竜(legendary) / レインボーサーペント(secret) ＋ **追加8体**: イクチ(common) / 海坊主(rare) / 手長足長(epic) / 蜃(epic) / ダイダラボッチ(legendary) / オリオン(legendary) / バロール(legendary) / ゴルィニシチェ(secret) / **バハムート(mythic・竜の王・超巨大)**。`buildCreatureMesh`はバハムートのみ正規化targetを2.6に（他は1.7）して巨大化。バハムートのデザインは案A（金紅の竜王）を仮採用、案見本は `heist/bahamut-preview.html`。`buildCreatureMesh`→`KAIJU_BUILD`(`_kMukade`/`_kIkuchi`/`_kBalor`等)が低ポリ生成→bbox正規化(max1.7・底面合わせ)。ヘルパー: `_snake`/`_dhead`/`_whead`/`_batwing`/`_featherwing`/`_leg`/`_humanoid`(人型)。色は`CREATURE_COLOR`(図鑑用)。怪獣デザイン案見本は `heist/kaiju-preview.html`。
- **悪魔の実にもレア度**: 各 `FRUITS` に `rarity`（カミ・グル=rare / ハヤ・キラ・メラ=epic / バクハツ・ヒエ=legendary / **ビヨン・ムキ=secret**）。図鑑にバッジ表示。
- **転生で陣地が成長**: `MAX_SLOTS=12`。転生ごとに台座枠+1（最大12）→ `buildBaseContents(base,n,isPlayer,R)` が枠数に合わせ platform/grid をリサイズ＆`decorateBase`で塔/旗/バナー/金アーチを段階追加。`playerBaseColor(R)`で色も緑→…→金へ。`baseGrid(n)`がレイアウト算出。AI拠点も idx で枠数(4+i)とtierが変化。
- **BGM/SFX**: WebAudio。`audioInit`/`tone`/`noise`、`sfx(type)`（punch/hit/thunder/explosion/alarm/recover/powerup 等コミカル）。`startBGM`(setInterval 170ms ステップシーケンサ `MEL`/`BASS`)。`🔊`ミュートボタン/Mキーで `toggleMute`（masterGain）。
- **レスポンシブ**: 既定でモバイルファースト（vw/dvh/clamp/env(safe-area)）。`@media` で **≤400px=操作系を縮小**／**横向き(max-height:540px)=コンパクト化**／**≥820px(タブレット)=タッチ操作を拡大**。スマホ縦/横・タブレットで検証済（重なりなし）。
- **保存**: `localStorage['monsterHeistSave']`（money/rebirth/mult/slots/owned/bestMoney/fruit）。load時に未知IDの owned/fruit を除去＆slots を 4..12 にクランプ。
- **操作まとめ**: 移動=ジョイスティック/WASD、ジャンプ=スペース(2連で飛行)、アクション(つかむ/おく/ロック/かう)=E、なぐる=F、ミュート=M。
- **ふりがな**: 全UIに `<ruby>` 済。
- **主要関数**: `buildBases`/`buildBaseContents`/`baseGrid`/`decorateBase` / `getContext`(文脈) / `doGrab`/`doDrop`/`buyParade`/`toggleLock` / `updateAI`/`updateRivals`/`updateParade` / `update`(メインループ) / `doRebirth`。
- **未実装/TODO・要注意**: ①性能 — 怪獣は高ポリ気味（kuzuryu約164/gorynych約153メッシュ）。Three.jsの視錐台カリングで実描画は抑制されるが、**iPhone実機のFPS要確認**。②コンボ/アチーブ、より本格的なBGM、ステージ進行や目標は未実装（今は放置×収集×PvP対AIのサンドボックス）。③`kaiju-preview.html`/`character-preview.html` は選定用。デザイン変更時はそちらで案出し→本番反映の流れ。

### 🌏 世界大冒険 (`deep-sea/`) ※旧「深海大冒険」
- Phaser 3 横スクロールシューティング
- 4ワールド × 5ステージ、Lv1〜8 進化、特殊武器、ボス戦、ボーナスステージ
- すべてキャンバス描画（Phaser のText）。**HTMLには漢字なし**（ひらがなのみ）
- 漢字へのふりがな対応はキャンバスに二段テキストを描画する必要があり、未実施

### ⚔️ 漢字侍 聖剣伝説 (`kanji-race/index.html`)
- 旧 KANJI侍RACING を物語性ありにリブランド
- Three.js でサイバー侍がバイクを駆る漢字学習レース
- 1年生／2年生／エンドレス／復習＋ボス戦＋御札ビジュアル＋精霊解放エフェクト＋精霊図鑑
- **すべてのUI HTML文字列にふりがな済**（コミット e78202a）

### 🏯 時代大戦争 (`samurai-wars/index.html`) ※旧「過去・未来大戦争」
にゃんこ大戦争 inspire の単一HTMLタワーディフェンス。最も活発に開発中。

主要システム:
- **戦士**: 24体（侍8 + ロボ7 + 妖怪3 + 魔法3 + その他3）+ ガチャ秘伝3体
  - 開始6体: ashigaru, bushi, yumi, miko, ninja, robo_basic
  - SAMURAI_DATA は `CHARACTER_ORDER` でソート（左→右上→下の順にアンロックされる）
- **時代（編）構造**: 5編 × 各18ステージ予定（`ERA_DATA`）
  - 超過去編 / 過去編 / 現代編 / 未来編 / 超未来編
  - 現状 **過去編 + 超過去編 + 現代編 + 未来編が available**、超未来編のみ COMING SOON
  - 現代編は **超過去編 全18クリア** で解放、**未来編は 現代編 全18クリア** で解放
  - 出陣ボタン → era-select 画面 → 編を選ぶ → stage-select に遷移
  - 戦勝/敗北画面の「戦場へ」は `selectEra(currentEra)` で同じ編に直帰（一階層スキップ）
  - `currentEraStages()` は `STAGE_DATA` を `(s.era || 'past') === currentEra` でフィルタ
  - 編内通し番号（第1戦〜第18戦）は `stageNumInEra(stage)` で算出（IDは過去 1-18 / 超過去 101-118）
  - 新たに編を実装する時は (1) `ERA_DATA` の該当 `available:true` (2) `STAGE_DATA` に `era:'modern'` などを付けたステージを追加 (3) 必要なら `STAGE_BOSSES` / `STAGE_UNLOCKS` / 専用 `STAGE_THEMES`
- **空中・地上機構** (2026-05-02 追加):
  - ユニット定義に `flying:true` で空中ユニット（地面より90px上）、`antiAir:true` で対空攻撃可
  - `canHitTarget(attacker, target)` で空ユニットへの当たりを判定（攻撃者側に antiAir または flying があれば命中可）
  - `findEnemyInRange` / AOE / 弾の命中 / 弾AOE すべてに対空フィルタ適用
  - 弾には `antiAir` / `fromFlying` フラグをコピーして拡散時も判定
  - 飛行ユニットは描画時に翼パタパタ＋地面に楕円影
  - 対空持ち味方を解放しない限り、空中の敵には触れない（=ステージ1ボスは必ず対空持ち→ティラノサウルス）
- **18ステージ × 4編 = 72ステージ実装済**（過去 1-18 / 超過去 101-118 / 現代 201-218 / 未来 301-318）+ ステージ別解放（`STAGE_UNLOCKS`）
- **ステージごとのボス** (`STAGE_BOSSES`) — 敵城HP **1/3以下** で1度だけ出現
  - 一つ目小僧 / 河童 / ろくろ首 / 猫又 / 鬼 / 雪女 / 雷獣 / 鬼火 / 白狐 / 九尾の狐 / 八岐大蛇 / 蜘蛛の精 / ゴジラ / キングギドラ / メカ怪獣 / ロボット鬼 / サイボーグ大蛇 / 天魔王
  - 全員 scale 1.9〜3.4 で巨大、HP・ATK は最後 +50%/+35% のバフ済
- **テーマ背景** (`STAGE_THEMES`): 草原 / 雪山 / 川辺 / 海岸 / 城下町 / 修羅界 / 魔界 / 黄泉 / 未来都市 / 太古ジャングル / 原始大草原 / 氷河 / 原始火山 / 神々の頂 / 都市 / 繁華街 / 廃校 / ネオン街 / 港湾 / 地下
  - 天候: 海岸/川辺=雨、修羅界=灰、未来都市=ネオン雨
  - 修羅界の赤いチラつきは静的フォグ＋脈動グローに置き換え済
- **自城4段階レベル** — クリア数で進化、編ごとに城デザインが異なる：
  - 過去編: 木造→石造→大城→サイバー
  - 超過去編: 古代砦（石・土・藁、`drawAncientCastle`）
  - 現代編: 一軒家→アパート→タワマン→超高層+ヘリポート+金旗（`drawModernCastle`）
  - 未来編: 浮遊シェルター→反重力タワー→クォンタムシタデル+量子コア+浮遊サブモジュール→軌道エレベーター付き超未来要塞（`drawFutureCastle`、常時sin揺れで浮遊）
- **編ごとの城砲（30秒チャージ）**:
  - 過去/超過去編: **⚡ 龍神レーザー砲** — 1秒タメ → 1.6秒の派手な発射（ビーム＋稲妻＋火花）
  - 現代編: **🛰 サテライト・キャノン砲** — タメスキップで即発射、全画面オービタル・ストライク
  - 未来編: **🛸 AIスワーム召喚 (OMNI SWARM)** — タメスキップで即発射、50機のホーミングドローン群が散る（8機ごとに金縁エリート機、`drawDroneSwarmCannon`）
- **コンボシステム**: 連続キルでボーナス円＋画面表示
- **必殺技ゲージ**: 8回攻撃ごとに2倍ダメ＋AoE
- **ステータス異常**: thunder=スタン / fire=燃焼 / magic=凍結
- **強化道場**: 軍資金で恒久強化（+20%/Lv、最大Lv10）— 永続保存
- **アチーブメント**: 13種類
- **ガチャ**: 500円、3フェーズ演出（宝箱＋スロット → バースト → リビール）。秘伝3体（海賊・風魔・八雲）
  - **全戦士解放後はガチャを引けない**（ボタン無効化＋「全戦士解放済」表示）。判定は `isAllSamuraiUnlocked()` で `SAMURAI_DATA` 全idに対して行う
- **編成**: 上限なし。出陣前画面で確認。戦闘中は変更不可
- **★評価**: 残HP割合で各ステージ★1〜3
- **ステージ別BGM**: 1-6軽快 / 7-12雅楽 / 13-18シンセ / ボス戦
- **巨大魂昇天演出**: 倒されたユニットがゆらゆら昇る
- **城陥落演出**: 揺れ＋3秒の連続爆発＋瓦礫＋炎柱
- **データ初期化ボタン**: タイトルから全消去可能
- **雑魚ステージスケーリング**: HP +18%/stage、ATK +15%/stage（ボスはバフ対象外）
- **レスポンシブ**: ≤600px / ≤380px / 横向き / ≥1100px / ≥1600px の breakpoint で全要素調整

主要データ位置（行番号は変動）:
- `SAMURAI_DATA` — 戦士定義（味方 78体 = 24 + 27過去 + 18現代 + 18未来 + 3ガチャ）
- `ENEMY_DATA` — 雑魚定義（基本5種 + 超過去7種 + 現代6種 + 未来6種）
- `STAGE_DATA` — 72ステージ（過去 1-18 / 超過去 101-118 / 現代 201-218 / 未来 301-318）
- `STAGE_BOSSES` — 72ボス定義（同上）
- `STAGE_THEMES` — 38テーマ（10基本 + 5超過去 + 6現代 + 18未来）
- `STAGE_UNLOCKS` — ステージ→キャラID
- `CHARACTER_ORDER` — 表示順
- `MD_DRAW` / `FU_DRAW` — 現代編/未来編キャラの固有描画テーブル（18+18=36体）
- `WALLET_LEVELS` — 8段階（max が次レベルcost > を保証）
- `ACHIEVEMENTS` — 13勲章

主要関数:
- 編別の城: `drawAncientCastle` / `drawModernCastle` / `drawFutureCastle`
- 編別の背景: `drawModernCityBg` + `drawStageLandmark`(201-218) / `drawFutureCityBg` + `drawFutureLandmark`(301-318)
- メガボス（縦長画面級）: `drawDarkDragon` / `drawZeus` / `drawMechaGod` / `drawSatelliteMega` / `drawOmniasMega` — ディスパッチは `u.data.mega` 中で `fuRender → helmet` 順チェック（OMNIASとサテライト・ゼロが同じ `helmet='md_sat_red'` を共有するため、fuRender が先）
- 城砲: `fireLaser` → `actuallyFireLaser` (era分岐) → 描画は `drawSatelliteCannon` / `drawDroneSwarmCannon` / デフォルト龍神

---

## 開発・運用規約

**デプロイ**: `git push` するだけで GitHub Pages に反映（1〜2分）。`main` ブランチが本番。

**コミットメッセージ**: 英語、imperative。Co-Authored-By Claude のフッタを付ける。

**コード規約**:
- すべて単一ファイル HTML（ビルドステップなし）
- ライブラリは CDN ロード（Phaser, Three.js）
- ES6+。クラスもアロー関数も普通に使う
- localStorage でセーブ（各ゲーム別キー: `samuraiWarsData`, `kanjiSamuraiData`, `kanjiSamuraiStorySeen`, etc.）

**スタイル**:
- ターゲットは小学生の家族 → **すべての漢字に `<ruby>` でふりがな**
- モバイルファースト、タッチ対応
- 文書レベルの `pointerup`/`touchend` で座標判定して確実な発火（samurai-warsのレーザー/財布で採用）
- ネオン＆和風モチーフ（金・赤・シアン・ピンク）

**避けるべきパターン**:
- `Math.random()` を背景描画で毎フレーム使う → チラつきで目が痛い（修羅界で過去にやらかした）
- `pointer-events: none` の祖先内で子に `pointer-events: auto` を付けて期待通りクリック取れない件 → `.hidden` 内すべて `pointer-events: none !important`
- `addFloat` のフォントが小さくて見えない → big フラグでサイズアップ
- `disabled` ボタンは onclick も発火しない → 常時 enabled + 内部でガード

---

## ユーザーの好み・運用パターン

- 日本語で会話。ファイル変更後は GitHub にプッシュまでセットでお願いされることが多い
- スマホ（特にiPhone）で動作確認するので、見た目とタップ判定に厳しい
- 「派手にしてほしい」「ワクワクするように」と要望が来ることが多い → 演出は思い切ってやる
- 学習要素（特に小学生向け漢字）を大事にしている
- にゃんこ大戦争・ゴジラ・ジブリなど和風＋ポップカルチャーミックスが好み

---

## 直近の作業ログ（新しい順）

### 🐉 2026-06-27 超激レア「バハムート」追加＋ミシックレアリティ
- 新レアリティ **ミシック**（`RARITY.mythic`、cost 275000＝シークレット×5、income 3500、weight 1）を `RARITY_ORDER` 末尾に追加。図鑑にも反映。
- **バハムート**（`id:'bahamut'`, rarity mythic）を `CREATURES`/`CREATURE_COLOR`/`KAIJU_BUILD` に追加。`buildCreatureMesh` でバハムートのみ正規化を 2.6 にして他より一回り大きく表示。
- **デザイン3案**を `heist/bahamut-preview.html` に作成（A=金紅の竜王／B=鋼鉄メカ竜／C=星光る古龍）。本番は**仮で案A**。**ユーザー選定待ち→選択案を `_kBahamut` に差し替える**。
- 検証: ミシック275000・収入3500、バハムート78メッシュ・台座で巨大表示、図鑑にミシック表示、エラーなし。**git push 済**。

### 💨 2026-06-27 ハヤハヤの実を「常時ダッシュ」に変更
- スタミナメーター/2連打/ダッシュボタンを**全廃**。ハヤハヤ装備中は常に速度×1.9で走る（`update`の速度計算で `state.fruit==='haya'` 判定）。移動中はスピード煙のみ。`tryDash`/`updateStaminaUI`/`#stamina`/`#btn-dash`/関連CSS削除。検証: 通常4.32→ハヤ8.21（×1.9）、UI要素消滅、エラーなし。**git push 済**。

### 💪 2026-06-27 ムキムキ溜め演出＋実リネーム＋レスポンシブ
- **ムキムキの実=溜め演出**: 巨大拳が加速回転で振り回し→正面へ強打（着弾で範囲ふっとばし・大エフェクト）。`startMukiCharge`/`updateMuki`/`buildBigFist`/`mukiSeq`、`sfx('charge')`。検証で charge→slam→51ユニット吹っ飛び確認。
- **実リネーム**（ワンピ実在名回避）: メラメラ→**ボウボウの実**、ヒエヒエ→**カチコチの実**（id `mera`/`hie` は据え置き、kindも fire/ice のまま、カチコチは3秒氷漬けに統一）。
- **レスポンシブ追加**: `@media` で 小型スマホ縮小／横向きコンパクト／タブレット拡大。375・740x360・768x1024 で重なりなしを確認。**git push 済**。

### ❄️ 2026-06-27 「怪獣を盗む」攻撃演出強化＋パレード間隔＋図鑑ポーズ
- **パレード間隔を拡大**（`PARADE_N`9→6、X0/X1=±32、buy判定2.8）で誤購入防止。
- **ヒエヒエ=3秒氷漬け**（氷ブロックで静止）、**ムキムキ=画面端まで吹っ飛ばし**、**バクハツ=中程度の吹っ飛ばし**（`knockbackRival`に`launchMs`/`freezeMs`、launch中は摩擦弱め）。
- **図鑑/メニュー表示中はゲーム時間停止**（`isModalOpen`→`animate`で`update`スキップ）＝見てる間に盗まれない。復帰時の収入ジャンプも防止。
- **ビヨンビヨンの実をシークレットに**（cost7000）＋攻撃で**画面端まで吹っ飛ばす**（stretchをlaunch対象に追加）。
- 検証: 間隔10.7 / ヒエ2995ms氷塊 / ムキ47.6・ビヨン47.6・バクハツ27.5・通常11ユニット / 図鑑中は敵静止&収入ジャンプ0 / 図鑑にシークレットバッジ。**git push 済**。

### 🎨 2026-06-27 「怪獣を盗む」キャラ確定＋怪獣売却
- メインキャラ＝**ふわっとマスコット**(案B)に変更（`buildPlayer`）。
- 敵キャラ＝**A/B/C 全部使用**（拠点ごとに ガキ大将/ガードロボ/ゴブリン を `(idx-1)%3` で割当、色=拠点色で識別）。`buildRival(color,style)`＋3サブビルダー。
- **自分の怪獣を売る機能**: 台座の怪獣に近づき「うる」で半額還元（`doSell`/`sell`コンテキスト）。これに伴い**ロックを🔒mini-buttonに分離**（contextual lock廃止）。
- 検証: 主人公16メッシュ、敵styles=boss/robot/goblin/boss/robot、売却+750・空き、ロックボタン作動、エラーなし。**git push 済**。

### 🐲 2026-06-27 「怪獣を盗む」実レア度＋怪獣8体追加＋キャラ案
- **悪魔の実にレア度**を設定（`FRUITS` に `rarity`）、図鑑にバッジ表示。
- **怪獣を8体追加**（計7→15）: イクチ/海坊主/手長足長/蜃/ダイダラボッチ/オリオン/バロール/ゴルィニシチェ。デザインは任せ実装。`_humanoid`ヘルパー新設。全ビルド・図鑑・スポーン確認（ゴルィニシチェ153メッシュが最重）。
- **メイン/敵キャラのデザイン3案ずつ**を `heist/character-preview.html` に作成（メイン: 忍者シーフ/マスコット/メカ怪盗、敵: ガキ大将/ガードロボ/ゴブリン）。**ユーザー選定待ち→本番のプレイヤー/ライバル描画(`buildPlayer`/`buildRival`)に反映する**。
- **未デプロイ**（要 git push）。

### 🎮 2026-06-27 「怪獣を盗む」操作改善（ダッシュ方向＋E攻撃）
- **ダッシュ＝進む方向キーの2連打**に変更（同じ方向キーを2回／別キーは不発）。`DASH_DIRS`/`lastDirKey`。
- **Eキー（と左クリック）でも敵を殴れる**ように `actionOrAttack`（配達＞射程内の敵を殴る＞つかむ/かう/ロック＞空振り）。検証: d2連打/←2連打でダッシュ、別キーは不発、E攻撃KB、敵不在時はEで購入も機能。

### ✨ 2026-06-27 「怪獣を盗む」レイアウト調整＋実の技を派手化
- **パレードが拠点を貫通しない様レイアウト調整**: 拠点リングを **+30°回転**（`buildBases` の `ang` に `+Math.PI/6`）→ z=0 のパレード直線道がどの拠点とも重ならない（全拠点の |z|≥13）。プレイヤー初期位置も拠点→広場側へ補正。
- **悪魔の実の技を大幅派手化**: `attackEffect` を全種リッチ化（衝撃波リング`ringFx`／粒子バースト`burstFx`／稲妻`boltFx`／画面シェイク`shake`＋カメラ揺れ／色付き全画面フラッシュ`tintFlash`）。爆発=多重リング＋破片＋オレンジ閃光＋強シェイク、雷=複数稲妻＋黄閃光、巨大拳=ピンク閃光＋大シェイク 等。検証: 全9種＋通常パンチがエラーなく発火・KB適正。

### 🛠 2026-06-27 「怪獣を盗む」QoL＆機能追加（売却・ダッシュ・図鑑・左クリック・飛行判定）
- **運搬中に台座の怪獣を売って置き換え**（満杯時に半額還元→空き枠に設置）`doSellPlace`/`sell_place`コンテキスト。
- **ハヤハヤの実＋スタミナ・ダッシュ**: 満タンで W/↑2連打 or ダッシュボタン。発動→枯渇→満タンまで再発動不可。左下スタミナバー。
- **左クリックで殴る＆おく**（置ける場面は設置、他は攻撃）。攻撃はいつでも可。
- **📖図鑑**（右上ボタン）: 怪獣のレア度/収入/価格/所持数＋悪魔の実一覧。
- **飛行中の被弾を修正**: 敵も飛んで追える＋当たり判定を3D距離に（高さが合わないと殴れない/殴られない）。`moveEntityTo`からy制御を分離。
- **運搬中は少し遅く**（`PLAYER_CARRY_SPEED`=5.8→7.5、追跡敵=6.4）。
- 検証: sell_place(+25還元・設置)、ダッシュ枯渇/再発動不可、空中で敵が上昇し捕獲、飛行中はパンチ届かず、図鑑表示、エラーなし。**git push 済**。

### ⚔️ 2026-06-27 「怪獣を盗む」戦闘・敵AI・悪魔の実・BGM 大型アップデート
- ユーザー要望を全実装＆プレビュー検証済（盗み→敵追跡→殴られ失敗 / 敵窃盗→アラート＋矢印→殴って取り返し / コミカルSFX / 楽しいBGM / パレード直線化＋常時供給 / 敵も購入 / 悪魔の実）。
- **戦闘**: なぐるボタン＋ノックバック物理（双方）＋スタン＋星エフェクト。`doAttack`/`knockbackRival`/`knockbackPlayer`/`fx`系。
- **敵AIをワールド空間ステートマシン化**（`rivals[]`, guard/chase/rob_go/rob_back/return）。盗むと追跡、敵も奪いに来る。`#thief-arrow`方向矢印＋`#alert-banner`で「誰に盗まれたか」を表示。ライバル帯色=拠点色。
- **悪魔の実8種**（`FRUITS`）: 攻撃が雷/爆弾/巨大拳/炎/氷/回転/伸びる腕/キラキラ弾に変化。パレードに出現→購入で装備、HUD表示。
- **パレード直線化**: 入口→出口を直進し出口で入口へリサイクル（常時供給）。敵も流れる怪獣を購入。
- **BGM＋コミカルSFX**: WebAudioチップチューンのループ＋ミュート（🔊/M）。殴る/雷/爆発/アラート/取り返し等の派手な効果音。
- 検証: doGrab→chase、捕獲→steal失敗、パンチ・実攻撃でノックバック、敵窃盗→取り返し、実購入、120フレーム実行でエラーなし・BGM起動 すべて確認。**git push 済**。

### 🐲 2026-06-27 「怪獣を盗む」怪獣7体を本実装＋転生で陣地成長
- ユーザーが7体のデザイン案を決定（イルルヤンカシュ=C / 九頭竜=C / ヒドラ=A / ケルベロス=C / レインボーサーペント=C / オオムカデ=A / 応龍=B）。レアリティは適当に振り分け（common〜secret）。
- `kaiju-preview.html` のビルダーを低ポリ化して `heist/index.html` に移植（`KAIJU_BUILD` + `_snake`/`_dhead` 等ヘルパー）。プレースホルダー(c1〜s1)を全廃。`buildCreatureMesh` は bbox 正規化（max1.7・底面合わせ）で台座に乗せる。
- **転生で陣地が大きく・カッコよく**: `buildBases` を `baseGrid`/`buildBaseContents`/`decorateBase` に再構成。台座枠数(`state.slots`, 最大`MAX_SLOTS=12`)に合わせ platform/grid をリサイズ。tier(=転生Lv)で 塔→4隅塔→旗→バナー→金アーチ＋色 緑→金 と段階進化。転生時 `buildBaseContents` で作り直し。AI拠点も idx で枠数・tier 可変に。
- 旧プレースホルダーIDのセーブは load 時にサニタイズ。プレビューで全7体ビルド成功・転生Lv5で金の大型要塞化を確認。**未デプロイ**。

### 🕹️ 2026-06-27 「怪獣を盗む」操作＆ショップ刷新（ジャンプ/飛行・パレード購入・敵プレイヤー）
- **マイクラ風ジャンプ＆飛行**: スペース/ジャンプボタンでジャンプ、2連打で飛行ON（クリエ風）、もう一度2連打でOFF。重力物理 `phys{y,vy,grounded,flying}`、`doJumpPress()`、定数 `GRAVITY/JUMP_V/FLY_SPEED/DOUBLE_MS/FLY_CEIL`。飛行中は「うえ/おりる」ボタン表示（`updateFlyUI`）、PCはスペース上昇・Shift下降。
- **ショップをパレード式に変更**: オーバーレイ店を廃止。広場を囲む道（半径 `PARADE_R=14`）を怪獣8体が常時周回（`buildParade`/`updateParade`/`spawnParadeSlot`）。各頭上にHTML価格ラベル（`.plabel`）。近づくと文脈アクションが「かう」になり E/アクションで購入（`buyParade`）。購入すると数秒後に別の怪獣がリポップ。`getContext` に `type:'buy'` を追加。
- **敵プレイヤー配置**: 各AI拠点に赤いライバルアバター（`buildRival`/`buildRivals`）を配置、砦前を左右に巡回（`updateRivals`）。`base.rival` に保持。
- キー割当変更: スペース=ジャンプ、E=アクション（旧:スペース=アクション）。`btn-shop`削除→`btn-jump`/`btn-descend`追加。
- プレビューで全機能を実機相当で検証済（購入で100→50・所持反映、ジャンプ上昇、飛行トグル、ライバル表示）。コアの盗む/放置収入/転生は維持。**未デプロイ**。

### 🐉 2026-06-27 「怪獣を盗む」キャラ7体のデザイン3案プレビュー作成
- ユーザー指定の7体（イルルヤンカシュ/九頭竜/ヒドラ/ケルベロス/レインボーサーペント/オオムカデ/応龍）を、各 A/B/C の3案で見比べる `heist/kaiju-preview.html` を作成。
- ゲームと同じ Three.js r128・明るいカートゥーン調。7体それぞれ1 renderer、3案を横並び＋自動回転、下にA/B/C説明。プレビューで全7体エラーなく表示確認済。
- 3Dビルダーは sphere-chain の蛇胴(`snake`)・`dragonHead`/`wolfHead`・翼(`batWing`/`featherWing`)・多足(`legAt`)などの汎用ヘルパー構成。**本実装時はここから選定案を `heist/index.html` の `CREATURES`/`buildCreatureMesh` に移植する**想定。
- **ユーザーの選定待ち**（各キャラどの案か）。色や細部は本番で調整可能。

### 🏷️ 2026-06-27 ゲーム3本リネーム＋「怪獣を盗む」をブレインロット風の見た目に
- リネーム（**フォルダ名・localStorageキーは不変**、表示名のみ変更）:
  - 「深海大冒険」→「**世界大冒険**」（`<title>` と Phaser TitleScene の `'世界大冒険'`、ポータルカード🌏）
  - 「過去・未来大戦争」→「**時代大戦争**」（`<title>`、タイトル h1 を `時代大戦争`、subtitle を `ERA WAR`、ポータルカード）
  - 「モンスター・ハイスト」→「**怪獣を盗む**」（`<title>`、タイトル h1、UI内の「怪物→怪獣(かいじゅう)」一括置換、ポータルカード🦖）
- **「怪獣を盗む」をネオン→明るい昼間カートゥーン調に全面リスキン**（ユーザー要望「ブレインロットと似た見た目」）:
  - CSS: 黒枠(`#1f2d3d`)＋ドロップシャドウのぷっくりUI、白チップ/パネル、青空グラデ背景、太枠ボタン。
  - Three: `scene.background` 青空、`HemisphereLight`＋太陽光、芝生＋砂の広場＋リング小道＋中央の噴水、雲14個(`buildClouds`)、砦は白スカート＋カラフル天板＋屋根ポール、ゲートは半透明フォースフィールド。
  - プレビューで全画面（タイトル/3D世界/砦+台座+怪獣/ショップ/ポータル）確認済。コアループは無変更で動作維持。
- **未デプロイ**（git push はユーザー指示待ち）。

### 🦖 2026-06-27 新ゲーム「怪獣を盗む」（旧モンスター・ハイスト）プロトタイプ作成
- ユーザー要望: Steal a Brainrot 風の新ゲームを **シングルプレイ・3D・別キャラ・コアループ移植・ふりがな/派手演出踏襲** で作る。キャラ詳細は後日。
- まず Steal a Brainrot を分析（放置収入×盗む/盗まれる×レア収集×転生 が面白さの本体）。
- `heist/index.html` を新規作成（Three.js r128 単一HTML）。3Dシーン/プレイヤー操作(ジョイスティック+WASD)/拠点6つ(自分+AI5)/台座/レーザーゲート+ロック/放置収入/盗み運搬/ショップ/転生 を実装。
- プレビュー(`.claude/launch.json` の "arcade" = python http.server :8123)で **コアループ全動作を検証済**: つかむ→運ぶ→おくで所持化&収入増、ロック表示、転生(Lv/倍率/枠/リセット)、ショップ購入。
- ポータル `index.html` に4枚目のカード（🦹 マゼンタ `.heist`）を追加。2×2グリッドで表示確認済。
- **キャラは全て仮**。次セッションで本デザインを詰める。**未デプロイ**（git push はユーザー指示待ち）。

### 🌟 2026-05-24 セッション総まとめ（未来編フル実装デー）
今日1日で **未来編（2098年地球・18ステージ）を本実装からポリッシュまで完走**。
- **設計フェーズ**: 18ボス × (デザイン3案 + 通常攻撃3案 + 必殺技3案) のプレビューHTML 19ファイル + 城砲5案プレビュー = 計20ファイル作成
- **実装フェーズ**: ステージ/ボス/味方/雑魚/テーマ/城/描画/攻撃/解放ゲート/難易度/勝利バナー を全部追加（index.html +~3000行）
- **ポリッシュフェーズ**: 弾命中率改善、AIスワーム召喚（城砲）の派手化、全18ステージに固有背景＋空飛ぶ車/電車/ホログラム、各国ランドマーク強化（タワーブリッジやマーライオン等）、OMNIASバグ修正＋攻撃強化
- 関連コミット（多すぎるので主要のみ）: 未来編プレビュー / 未来編本実装 / AIスワーム召喚改名+派手化 / バレット命中率 / 背景＋ambient / ランドマーク豊富化 / OMNIAS修正
- **状態**: 未来編は完全プレイ可能。デプロイ済 (GitHub Pages 反映済)。次セッションは超未来編 or 既存編のリファイン候補

### 2026-05-24 (OMNIAS 修正＋攻撃強化)
- **未来編ラスボスがサテライト・ゼロとして表示されるバグを修正**（ユーザー報告）
  - 原因: mega ボス描画ディスパッチが `u.data.helmet === 'md_sat_red'` で振り分けていたため、OMNIAS が同じ helmet を共有していて drawSatelliteMega にヒット
  - 修正: ディスパッチに `u.data.fuRender === 'omnias'` チェックを先に追加 → 新関数 `drawOmniasMega` で描画
  - HP バーのアイコンも 🛰 → 🌐 に切り替え
- **OMNIAS 専用メガ描画 `drawOmniasMega` を新設** — 全画面OS UI型（事前選択された案C）
  - 巨顔の代わりに 260x240 の巨大ホロウィンドウ
  - タイトルバー「OMNIAS // GLOBAL SURVEILLANCE AI v2098」+ 閉じる×ボタン
  - 5個のサブ監視画面（CAM 01/CAM 02/DATA/TRACE/TARGET）走査線付き
  - 中央に巨大な赤い目玉（脈動・12方向放射光）
  - 流れるバイナリコード（0/1）4行
  - 警告「// ALERT // ALERT // ALERT //」点滅
  - 4隅のコーナーマーカー
  - 上空に4機のサブAIサテライト（軌道周回）
  - グリッチ効果の横ずれ赤帯
  - 赤紫オーラ脈動＋上下に揺れて浮遊
- **OMNIAS の攻撃を大幅に派手化**（ユーザー要望）
  - N③ ホロ拳: 単一AOE弾 → **3連の巨大ホログラム拳**が時間差で叩きつけ
    - 新スタイル `cloneStrikes style:'fu_holo_fist'` 実装
    - 新ヘルパー `drawHoloFist` — 赤紫の関節付き拳 + 走査線
    - 着地前: 赤い警告サークル（収縮）+ 十字マーカー + 拳が空から降下
    - インパクト: 白フラッシュ + 拳完全表示
    - 着地後: 3重衝撃波（赤紫）+ 8方向火花
    - ダメ: atk×1.3 単発 → atk×1.5 × 3体 = **総ダメ約3.5倍**
  - S③ オムニアス・キャノン（旧 軌道爆撃）: 20発 → **35発のミサイル雨**
    - 各機ダメ atk×0.35 → atk×0.45（強化）
    - バナー2段: 「☢ オムニアス・キャノン ☢」+ 中央上「⚠ OMNIAS OVERRIDE ⚠」
    - 発射前に画面全体に60個の赤紫粒子（赤/紫/白/ピンク）が爆発
    - レーザー音 + 爆発音 同時鳴動

### 2026-05-24 (未来編ランドマーク強化)
- **未来編 全18ステージのランドマークを各国の特徴をより強調するように大幅拡張**（ユーザー要望「ロンドンならビッグベン+タワーブリッジのように」）
- 各ステージに **2-4個の特徴的要素**を追加:
  - 301 🇯🇵 ネオ東京: 富士山+鳥居 → **+スカイツリー+ホロ桜の花びら+漢字ネオン縦看板（未来/東京）**
  - 302 🇺🇸 マンハッタン: 自由の女神+摩天楼 → **+ブルックリン橋（吊り橋ケーブル付き）+半壊エンパイアステートビル+破れた星条旗**
  - 303 🇨🇳 上海: 東方明珠 → **+上海中心ねじれ高層+金茂大廈パゴダ+赤提灯5個（福の字）+漂う龍ホログラム**
  - 304 🇰🇷 ソウル: Nソウルタワー+VRグリッド → **+ロッテワールドタワー+ハングルネオン看板4枚（미래/서울/VR/한국）+ホロKPOPステージ**
  - 305 🇦🇺 シドニー: オペラハウス+月 → **+ハーバーブリッジ（縦柱付きアーチ橋）+海面のホロサメ**
  - 306 🇷🇺 クレムリン: 玉ねぎドーム → **聖ワシリイ大聖堂5ドーム（カラフル+ストライプ）+クレムリン城壁+雪+衛星アンテナ**
  - 307 🇩🇪 ベルリン: 門+試験管 → **+ベルリンの壁ホログラム（FREE/2098の落書き）+テスラコイル2本（稲妻分岐）**
  - 308 🇫🇷 パリ: エッフェル塔+浮遊島 → **+凱旋門+ノートルダム双塔（バラ窓）+ホロモナリザ風絵画+反重力リング**
  - 309 🇮🇳 デリー: 軌道エレベーター → **+タージマハル（白いドーム+4本ミナレット）+発着ロケット+ホロ象（鼻を伸ばす）**
  - 310 🇧🇷 アマゾン: バイオドーム+巨木 → **+コルコバードのキリスト像（光輪付き）+滝（水しぶき）+マコオウム（赤/黄/青の翼パタパタ）**
  - 311 🇪🇬 ピラミッド: ピラミッド+スフィンクス → **スフィンクスにファラオ帽子+漂う太陽船+ホロファラオ（光柱の中に立つ）**
  - 312 🇨🇦 北極: 氷ドーム+オーロラ → **+CNタワー（展望球＋頂点光）+ホロ北極熊+メイプル葉（散る）**
  - 313 🇮🇹 ローマ: コロッセオ → **+ホロ戦車（馬2頭付き）+ホロ剣闘士（剣＋盾）+トレヴィの泉（流れる水）**
  - 314 🇲🇽 カンクン: 軌道砲+ロケット → **+チチェン・イッツァのマヤピラミッド5段（神殿付き）+ククルカン（蛇が階段を下る）+月の神殿**
  - 315 🇸🇬 シンガポール: マリーナベイサンズ+蔦高層 → **+屋上プールの水+マーライオン（口から水）+ガーデンズバイザベイのスーパーツリー（発光花6つ）**
  - 316 🇬🇧 ロンドン: ビッグベン+時空裂け目 → **+タワーブリッジ（2塔+ケーブル）+ロンドンアイ観覧車（12ゴンドラ回転）+テムズ川+二階建てバス（窓6個×2階）**
  - 317 🇦🇪 ドバイ: ブルジュハリファ+砂丘 → **+月（クレーター付き）+ヤシの島型人工島（葉が放射状）+ヤシの木2本+ホロラクダ（2コブ・砂漠を歩く）**
  - 318 🌐 アーク: ステーション+地球 → **地球に雲+大陸3つ+月（クレーター付き）+衛星6機が周回+流星（軌跡付き・時々飛ぶ）**
- すべて時間ベースの決定的アニメ（背景にMath.random()は使わない）

### 2026-05-24 (超過去編 通常/必殺分離)
- **超過去編 13キャラに「通常攻撃 / 必殺技」分離を実装**（5キャラは現状維持）
  - 各キャラのデータに `spSpecial`（必殺技 weapon ID）を追加し、既存の `weapon` フィールドを通常攻撃に置換
  - `spawnBossFromData` で `spSpecial` も伝播
  - `attackTarget` 冒頭の split swap 処理を一般化し、`mdSpecial` と `spSpecial` の両方に対応
  - 通常攻撃 13 種類 (`sp_n_*`) を新規実装:
    - sp_n_tail (T-Rex B) — 尾びれAOE
    - sp_n_water_short (プルスサウルス C) — 短い水鉄砲
    - sp_n_fly_kick (プロコプトドン C) — 跳び蹴り kamikaze leap
    - sp_n_stomp (マンモス C) — 踏みつけ quake AOE
    - sp_n_rock_throw (ゴーレム B) — 岩投げ fireball AOE
    - sp_n_poison_dart (ティタノボア B) — 毒針 bullet
    - sp_n_ram (ヘラクレスオオカブト C) — 体当たり突進 kamikaze
    - sp_n_snake_whip (ナーガ C) — 蛇鞭 bullet
    - sp_n_thunder_orb (サンダーバード B) — 雷光弾 thunder_bolt
    - sp_n_double_slash (ベオウルフ C) — 二段斬り (setTimeoutで2発目)
    - sp_n_rock_throw_balor (バロール C) — 岩投擲 fireball AOE
    - sp_n_long_kick (手長足長 B) — 長い足蹴り bullet
    - sp_n_cold_wave (フロストジャイアント C) — 冷気波 slashWave
  - 現状維持: サンドワーム / 孫悟空 / イルルヤンカシュ / スサノオ / ゼウス
- **通常攻撃 候補プレビュー 18ファイル + 一覧ページ**を追加 (`sp_*-normal.html` + `super-past-normal-index.html`)

### 2026-05-24 (未来編 城砲 派手化＋改名)
- **未来編 城砲を「AIスワーム召喚」に改名＋派手化**（ユーザー要望「もっと派手に。名前も変えて」）
  - HUDボタン: 「🛸 AIスワーム召喚」（過去/超過去=龍神レーザー砲、現代=サテライト・キャノン砲 と差別化）
  - ドローン数 30 → **50機**（48通常 + 8機に1機の **エリート機**）
  - 各機ダメ: 通常95 / エリート220（合計約4500+敵城350 = 4850相当、旧2700から1.8倍に）
  - アニメ時間 2.0秒 → 2.6秒（演出に余裕）
  - 4色パレット（シアン/紫/ピンク/金）でドローンがカラフルに散る
  - **発射演出強化**:
    - 城周辺にカラフル粒子40個爆発
    - 画面全体に青いフラッシュ + 走査線
    - 城屋上の発射ポータルから3本の波紋リング拡散
    - 紫→シアンに脈動する発射ポート + 上に伸びる光柱 + ジグザグ電撃
  - **飛行中演出**:
    - 軌跡: 外側ハロ4px + 内側ライン1.5px の2重描画でカラフル
    - ターゲットレーザービーム（赤）が飛行20%以降ずっと表示（旧70%以降）
    - 着地点に赤いマーカー表示
    - ドローン本体大型化（5x2.5 → エリートは1.8倍）
    - 発光オーラ10px、外周プロペラ
    - エリート機は金縁＋小さな旗付き
  - **着弾演出強化**:
    - 通常: 青12 + 白7粒子
    - エリート: 青24 + 白14 + ピンク8 + 金6 + 60px衝撃波リング
    - 敵不在時の敵城ヒット: 通常22ダメ / エリート50ダメ
  - **HUD演出**:
    - 中央上にアニメバナー「🛸 AIスワーム召喚 🛸」「OMNI SWARM PROTOCOL — 50 DRONES DEPLOYED」
    - スケール小→大→消えるアニメ、シアン発光枠、両端に金の✦
    - 画面端に脈動する青ライン + 4隅にコーナーマーカー（SF的UIフレーム）
  - 新フィールド: `game.cannonLaunchFlash`, `game.cannonBannerT`, `game.cannonPortalRings`, ドローンに `isElite`/`colorIdx`/`wave`

### 2026-05-24 (未来編 背景強化)
- **未来編 全18ステージに固有背景＋空飛ぶ車/電車/ホログラム演出を実装**（ユーザー要望）
  - 新関数 `drawFutureCityBg(c, t, w, h, gy)` — 全テーマ共通の未来都市背景レイヤー
    - テーマ別パレット18種（fu_neo_tokyo / fu_ruined_ny / ... / fu_space_arc）
    - 浮遊型未来高層ビル（台形フォルム、地面との隙間に青ネオン光、屋上発光ライン、縦長スリット窓、屋根の赤ブリンカー）— stageId をシードに配置が決定的
    - **空飛ぶ車4台**（赤/シアン/金/紫）が異なる速度・高さで画面を流れる。流線型車体＋黒スモーク窓＋ヘッドライト＋ジェット噴射＋反重力リング
    - **空飛ぶ電車1編成**（先頭+3両、ゆっくり横断）— 浮遊レール線＋窓＋屋根ライン＋下部の青発光
    - **ホログラム広告3枚**（ピンク/シアン/金）— 走査線＋点滅＋アイコン（円/三角/四角）
    - 上空のホロ文字（NEO / 2098 / AI / ∞ / CYBER）が漂う
    - 反重力リング（地平線近くに3本）
  - 新関数 `drawFutureLandmark(c, stageId, w, h, gy, time)` — 全18ステージに固有ランドマーク:
    - 301 ネオン富士山+サイバー鳥居 / 302 朽ちた自由の女神+半壊摩天楼 / 303 東方明珠TV塔（球体3つ+ネオン漢字「未来」）/ 304 Nソウルタワー+VRグリッド / 305 オペラハウス+月+海面反射 / 306 玉ねぎドーム3つ+オーロラ / 307 ブランデンブルク門+試験管 / 308 エッフェル塔+浮遊する緑の島2つ / 309 軌道エレベーター+赤い要塞+昇降カプセル / 310 巨大バイオドーム+巨木+ホタル / 311 ピラミッド3つ+ホロエッジ+ヒエログリフ+スフィンクス / 312 透明氷ドーム+オーロラ+氷山 / 313 ホロコロッセオ4段+青LED松明 / 314 軌道砲台+発射ロケット / 315 マリーナベイサンズ+緑の蔦が絡む高層 / 316 ビッグベン+動く時計の針+紫の時空裂け目 / 317 ブルジュハリファ+砂丘+発光頂上 / 318 巨大宇宙ステーション「アーク」（回転リング+ソーラーパネル+地球+警告ライン）
  - 背景ディスパッチを `t.id.startsWith('fu_')` で `drawFutureCityBg` に分岐
  - 山の描画（mtFar/mtNear）は未来編もスキップ（ビル/未来建造物が背景）
  - すべて時間ベースのアニメ（点滅・浮遊・動き）— Math.random() は背景に使用せず、stageId シード or sin で決定的

### 2026-05-24 (続々)
- **未来編 城砲を AI戦術ドローン群（案4）に確定** — 5案プレビュー (`samurai-wars/fu_cannon-preview.html`) からユーザー選択
  - 事前チャージは現代編と同じくスキップ（ボタン押下で即発射）
  - 城屋上から30機の青いドローンが弧を描いて敵を個別ホーミング
  - 各機90ダメ（合計2700）、敵がいない時は敵城に18ダメ
  - 0〜0.45秒で順次発射、各機0.55〜0.8秒で飛行→着弾爆発
  - ターゲットが死んでたら最寄り敵に再ターゲット（飛行中に元ターゲット死亡しても画面外の敵を新たに狙う）
  - 新関数: `drawDroneSwarmCannon`、新配列: `game.cannonDrones`
  - `actuallyFireLaser` で era 分岐、ステージ開始時に `game.cannonDrones = null` でリセット
  - HUD に「🛸 AI DRONE SWARM x30」表示
- **未来編 fu_* キャラの弾命中率を改善**（ユーザー報告：「未来編のキャラの攻撃が的にあたっていないことがあります」）
  - 直撃系 magic_circle 弾を「正規化ベクトル × 固定速度」に変更（旧 `(tgtX-bx)/22` は遠距離で遅すぎてスナップショット位置を外していた）
  - `fu_plasma_blade`(zero N) / `fu_laser_pointer`(drone_queen N) / `fu_glitch_bite`(holoshark N) / `fu_nano_shot`(nanocloud N) / `fu_clock_bullet`(chronos N) に `aoe:true` を追加 → 50px 範囲爆発で当たり判定が寛容に
  - 弾速 14〜20 px/frame に統一

### 2026-05-24 (現代編 通常/必殺分離)
- **現代編 17キャラに「通常攻撃 / 必殺技」分離を実装**（過去編・未来編と同じパターン）
  - 各キャラのデータに `mdSpecial`（必殺技 weapon ID）を追加し、既存の `weapon` フィールドを通常攻撃に置換
  - `spawnBossFromData` で `mdSpecial` も伝播
  - `attackTarget` 冒頭で `isSpecial` を判定 → 8回ごとに `attacker.data.weapon` を一時的に `mdSpecial` に swap して既存ロジック流用（try/finally で確実に復元）
  - 既存の attackTarget 本体を `attackTargetBody(attacker, target, atk, isSpecial, kishinkaBuff)` として切り出し
  - 通常攻撃 17 種類 (`md_n_*`) を新規実装:
    - md_n_bottle (暴走族C) — fireball AOE 投擲
    - md_n_cane (怪盗A) — 近接単発
    - md_n_scissors (クチサケB) — quake naginata_spin 3連
    - md_n_dash (テケテケC) — slashWave charge_beam 超高速貫通
    - md_n_circle (メリーC) — quake binding_seal AOE
    - md_n_wail (花子C) — slashWave wind 前方波
    - md_n_sniper (ハッカーC) — kunai 高速単発
    - md_n_bomb (ドローン軍団長C) — fireball AOE 小型爆弾
    - md_n_3shot (スモッグC) — pendingShots 3連 fireball
    - md_n_fist (AI兵器B) — 近接AOEパンチ
    - md_n_throw_rat (ラットキングC) — jumpCombo md_rat 1匹
    - md_n_punch (ブレットマンA) — 近接単発
    - md_n_ball (ザイガスA) — 近接AOE 鉄球
    - md_n_bite (メガロドンA) — 近接単発+血飛沫
    - md_n_abduct (UFO B) — 単発スタン光線
    - md_n_chest_beam (メカMK-III B) — magic_circle 単発ビーム
    - md_n_cash_punch (CEO B) — 近接+札パーティクル
  - 各キャラの `range` / `ranged` / `aoe` / `atkSpeed` を通常攻撃に合わせて再調整（melee 化キャラは range 50-100、ranged 化はそのまま）
  - サテライト・ゼロは通常攻撃と必殺技を分けず現状維持
- **通常攻撃 候補プレビュー 18ファイル + 一覧ページ**を追加 (`md_*-normal.html` + `modern-normal-index.html`)

### 2026-05-24 (続)
- **未来編 18ステージを本実装**（id:301-318）— 現代編クリアで解放、2098年地球
  - 解放ゲート: `isEraAvailable` に `future` 分岐（201-218 全クリアで `available`）
  - 勝利画面で「🌟 未来編 解放！🌟」バナーを表示（現代編全クリア時）
  - 18ステージ: ネオ東京/廃墟マンハッタン/上海雲海都市/ソウルVRアリーナ/シドニー湾/極地クレムリン/ベルリン研究所/パリ空中庭園/ニューデリー宇宙港/アマゾン超ジャングル/ピラミッドサイバー砂漠/北極ドーム/ローマ再建コロッセオ/カンクン軌道砲基地/シンガポール垂直都市/ロンドン時空研究所/ドバイ砂漠スカイタワー/国際宇宙ステーション「アーク」(各国フラグ属性 `country` 付き)
  - 新雑魚6種: `fu_nano`(ナノ兵) / `fu_guard_drone`(警備ドローン群=空対空) / `fu_hover_scoot`(反重力スクーター兵) / `fu_vr_avatar`(VRアバター戦士) / `fu_quantum_sol`(量子戦闘員) / `fu_flying_taxi`(空飛ぶタクシー=空対空遠AOE)
  - 新テーマ18種: fu_neo_tokyo / fu_ruined_ny / fu_sky_city / fu_vr_arena / fu_holo_sea / fu_ice_kremlin / fu_lab_dark / fu_paris_sky / fu_delhi_port / fu_amazon_bio / fu_pyramid / fu_arctic_dome / fu_colosseum / fu_orbit_base / fu_vertical_sg / fu_london_time / fu_dubai_gold / fu_space_arc (enemyStyle:'future')
  - **18体のボス**（`STAGE_BOSSES[301..318]`）：ユーザーが事前にプレビューHTMLで選んだ「デザイン3案」+「通常攻撃3案」+「必殺技3案」の組み合わせを反映
    301 サムライ将軍 ZERO (A 紺紫量子 + N② プラズマ刀投げ + S② 浮遊刀5本)
    302 戦闘用ロボ TITAN-X (A 重装黄黒 + N② アサルト連射 + S① ガトリング7連扇状)
    303 ドローン女王 MIRAI-Q (B 純白セラフ + N① レーザーポインター + S② レーザーグリッド)
    304 空飛ぶ車軍団 AERO-SEOUL (A 真紅スポーツ + N② ヘッドライト黄 + S③ メガビーム)
    305 ホロサメ MEGA-HOLO (B 紫紅グリッチ + N① グリッチ噛みつき + S③ サメの大群12発)
    306 量子スパコン PERMAFROST (C 機械化クレムリン + N③ サーバー光線 + S③ メガ氷柱5本)
    307 ヴォルフ博士 (A 白衣狂気 + N③ 試験管投擲 + S② クリーチャー3体召喚)
    308 ナノクラウド MUTABLE (A 銀の渦巻く雲 + N② ナノ粒子弾 + S① 形態スマッシュ)
    309 軌道守護神 ASURA-9 (A 6本腕青神メカ + N① 剣振り + S③ 軌道弾雨12発)
    310 GENESIS-REX (A 緑機械ジャングル恐竜 + N② 火球吐き + S① バイオブレス毒霧)
    311 ANUBIS-OS (C 砂塵の異形巨人 + N② 紫の死の光線 + S② 砂の大竜巻)
    312 クライオキング (A 青白い氷の王 + N③ 冷気コーン + S② 氷柱5本)
    313 剣闘士 MAXIMUS-3 (A 赤金重装 + N① 剣振り + S① 回転斬りAOE)
    314 ORBIT-LANCER (B 銀の宇宙騎士 + N③ ミサイル単発 + S② 衛星ミサイル雨8発)
    315 GAIA-MIND (A 緑の女神ホログラム + N③ 木の根束縛 + S③ 引力場渦)
    316 CHRONOS (A 黒銀ゴシック王 + N② 飛ぶ時計弾 + S① 時間停止+AOE)
    317 GOLD QUANTUM (A 純金東洋龍 + N① 噛みつき + S① 黄金ブレス)
    318 OMNIAS (C 全画面OS型・メガボス + N③ ホロ拳 + S③ 軌道爆撃20発)
  - 全ボスはクリアで仲間に: `STAGE_UNLOCKS[301..318]` + `fu_*` の 18 味方ユニットを `SAMURAI_DATA` に追加（`CHARACTER_ORDER` も更新）
  - 難易度: 現代編より上 — 雑魚は基本2.8倍（vs 現代2.4倍） / ボスは 6.0倍（vs 現代4.8倍） / ステージスケール +25%HP・+20%ATK per stage
  - 城デザイン: **未来的な反重力タワー** — 新関数 `drawFutureCastle` を新設、`drawCastle` 冒頭で `currentEra==='future'` を分岐
    - 自城4段階進化: 浮遊シェルター(Lv1) → 反重力タワー(Lv2) → クォンタムシタデル+量子コア+浮遊サブモジュール(Lv3) → 軌道エレベーター付き超未来要塞(Lv4)
    - 城本体が浮遊（地面との間にネオン隙間+反重力リング）。常時 sin 揺れ
    - **龍神レーザー砲ポジ = 屋上のパラボラ砲台**（自城）/ 敵城は赤いブリンカー＋OMNIAS ネオン看板
    - HP 50%/25% でガラス割れ・上層崩壊・黒煙・火花
  - **未来編キャラ固有描画**: 新フィールド `fuRender` を `SAMURAI_DATA` と `STAGE_BOSSES` の fu_* 18キャラに付与
    - `spawnBossFromData` でも `fuRender` + `fuSpecial` をボス data に伝播
    - `drawSamuraiCanvas` 冒頭で `u.fuRender` をチェックして `drawFutureUnit` にディスパッチ（侍名簿/編成/ガチャ/出撃カード全部に反映）
    - 18体の固有 Canvas 描画を `FU_DRAW` テーブルで定義
  - **未来編 専用武器ハンドラ**: `attackTarget` に `fuActiveWeapon = isSpecial ? fuSpecial : weapon` で分岐するブロックを追加
    - 通常攻撃(`fu_*` weapon) と 必殺技(`fu_*` fuSpecial)を別々に実装
    - 全アクティブ攻撃に**味方側方向反転**を実装: pillars時間差順序を `kIdx = isP ? (max-k) : k`、missile/rain candidates を `attacker.x` 距離で sort（味方=右側から、敵=左側から）、wave/bullet の vx は `fwdDir` で正負を反転
  - 既存システム流用: slashWaves(wind/eye/golden_light/mega_flame/tornado), blizzards(poison/fire), quakes(naginata_spin/binding_seal/water_vortex), kamikazes(slam), jumpCombos, bullets(magic_circle/fireball), pillars(ice/laser_grid/water/acid)。新スタイル名 `fu_creature`/`ice`/`laser_grid` も style として登録（描画は既存ロジックにフォールバック）
  - 一時フラグ: `game.timeStopFlash` (CHRONOS S①) — 紫の時間停止視覚用（描画側で必要なら拾う）

### 2026-05-24
- **未来編 18ボス デザインプレビュー追加**（2098年地球・18か国）— 本実装前の選択用
  - `samurai-wars/future-preview-index.html` に Phase 1〜4 別の一覧（4色グループ）
  - 18ファイル: `fu_zero/fu_titan/fu_drone_queen/fu_aero/fu_holoshark/fu_supercomp/fu_madsci/fu_nanocloud/fu_asura/fu_biorex/fu_anubis/fu_cryo/fu_maximus/fu_lancer/fu_gaia/fu_chronos/fu_quantum/fu_omnias-preview.html`
  - 各ファイルに **3デザイン案 + 3通常攻撃案 + 3必殺技案**（過去/現代編より1セクション増）。Canvas でアニメ
  - 国/ステージID対応: 301 🇯🇵ネオ東京/302 🇺🇸廃墟マンハッタン/303 🇨🇳上海雲海/304 🇰🇷ソウルVR/305 🇦🇺シドニー湾/306 🇷🇺極地クレムリン/307 🇩🇪ベルリン研究所/308 🇫🇷パリ空中庭園/309 🇮🇳ニューデリー宇宙港/310 🇧🇷アマゾン超ジャングル/311 🇪🇬ピラミッドサイバー砂漠/312 🇨🇦北極ドーム/313 🇮🇹ローマ再建コロッセオ/314 🇲🇽カンクン軌道砲/315 🇸🇬シンガポール垂直都市/316 🇬🇧ロンドン時空研究所/317 🇦🇪ドバイ砂漠スカイタワー/318 🌐 国際宇宙ステーション「アーク」(ラスボス OMNIAS)
  - 仕様予定: 解放条件=現代編全18クリア、難易度=現代編より上（雑魚×2.8/ボス×6.0）、城は未来要塞、空飛ぶ車/電車・VR/AR/ナノ等の演出
  - ユーザーが選択した案（デザイン/通常/必殺）を本実装に反映する流れ（過去/現代編と同じ）

### 2026-05-23 (続)
- **サテライト・ゼロのバランス調整**（ステージ218最終ボス）
  - 基本HP: 100000 → **70000**（実効HP 480000 → 336000、4.8x bossMul 後）
  - 基本攻撃力: 4000 → **3000**（実効攻撃力 19200 → 14400）
  - 位置パターン: 上空固定から **基本は地上近く（gy-120）にいて、たまに浮上（gy-300）** に変更。約13秒周期の sin 波 + `pow(cycle, 5)` で「ほとんどの時間は低位置」を実現。地上ユニットの攻撃が当たるように
- **現代編最終ステージ(218)で敵/城/ユニットが表示されないバグを修正**
  - `drawStageLandmark` 内で `palette` という未定義変数を参照 → ReferenceError が毎フレーム発生 → 城・ユニットの描画が止まっていた
  - `palette ? '#150818' : '#0a0a14'` → 固定の `'#150818'` に変更
- **ネオン都市の浮遊看板 → 飛行船 3 機に置き換え**
  - SALE/OPEN/★24h の文字看板が空中に浮く違和感を解消
  - 紫の Z号 / 青の ★号 / オレンジの M号 が異なる速度で夜空を流れる。本体+尾翼+ゴンドラ+ヘッドライト+赤ブリンカー付き
- **サテライト・キャノン砲（現代編専用）の演出を確定** — 案B: 全画面オービタル・ストライク
  - 事前チャージ(1秒タメ)を**現代編のみスキップ**（`fireLaser()` 内で era 分岐）→ ボタン押すと即発射
  - 描画もチャージフェーズを撤廃し、衛星から **5本の極太レーザーが画面全幅(10/30/50/70/90%)に同時降下**
  - 各インパクトポイントでクレーター+金炎球+赤炎輪+3重衝撃波+火花+斜めの軌跡線
  - 地面に横一線の黄色いショック帯で「全画面攻撃」感を強調
  - 新関数 `drawSatelliteCannon(c, w, h)`、`game.laserAnim > 0 && currentEra === 'modern'` で分岐
- **過去編と超過去編で龍神レーザー砲を統一**
  - HUD ラベル: 超過去編は「巨大弩弓」だったのを「⚡ 龍神レーザー砲」に統一
  - 古代砦の弩弓 → 金縁の龍頭付き龍神砲台に置換（過去編の意匠と一致）
- **現代編 全18ステージの背景を差別化**
  - `drawModernCityBg` がステージIDをシードにビルの数・位置・高さ・窓配色を変化（同じステージは毎回同じ配置）
  - 新関数 `drawStageLandmark(c, stageId, w, h, gy, time)` で各ステージに固有のランドマーク:
    201 スクランブル横断歩道+SHIBUYA ビジョン / 202 歌舞伎町ゲート+縦長ネオン / 203 駅舎+大時計+STATION看板 / 204 廃校時計塔 / 205 地下入口階段 / 206 メガコーポオフィスタワー / 207 高架道路+走る赤い車 / 208 管制塔+飛行機 / 209 5色コンテナ群 / 210 **東京タワー** / 211 地下鉄トンネル+線路 / 212 新幹線 / 213 解体クレーン+鉄球+半壊ビル+安全コーン / 214 工業煙突4本+黒煙 / 215 上空の小型UFO群 / 216 政府庁舎+日の丸 / 217 **東京スカイツリー** / 218 多数の衛星+崩壊する高層ビル
  - 現代編は山(`mtFar`/`mtNear`)の描画をスキップ（ビルが背景）
  - HPバーアイコン: 🐉 → 🛰 for サテライト・ゼロ
- **現代編ボスの強さを2倍に**（bossMul: 2.4 → **4.8**）
- **ステージ218のメガボス描画を修正**: `helmet === 'md_sat_red'` を mega ボス dispatch に追加し `drawSatelliteMega` を呼ぶように（以前は drawDarkDragon にフォールバックしていた）
- **「サタライト」→「サテライト」**に全コード/Handoff/プレビューでリネーム
- **メガロドン/ラットキング**: 描画関数冒頭で `c.scale(-1,1)` を追加し、味方時は正しく左向きに（敵時は反転で右向きに）
- **必殺技ビジュアル不一致を修正**:
  - md_bike → 馬 → **本物のバイク+黒特攻服ライダー+ヘッドライト** (`drawBikeCharge`)
  - md_drill → 馬 → **回転するドリル+銀のサイバー重機+キャタピラ** (`drawDrillCharge`)
  - md_doll_summon → 緑の蛇 → **3体の市松人形ミニ**（赤と黒の市松+黒髪おかっぱ+黄リボン）
  - md_swarm → 緑の蛇 → **茶色の子ネズミ5匹**（尻尾・耳・赤目）
  - md_water_pillar → 雷柱 → **青い水柱** (`drawWaterPillar`)
  - md_acid_rain → 雷柱 → **黄色い酸性雨**+☠マーク (`drawAcidPillar`)
  - md_vortex → 紫の渦 → **青い水渦巻き** (新 quake style `water_vortex`)
- **攻撃の進行方向を味方時は右→左に修正**: md_water_pillar / md_acid_rain / md_killsat（ピラー時間差順序を `kIdx = isP ? (max-k) : k` で反転）/ md_missile_storm（candidates を `attacker.x` 距離で sort）
- **侍名簿/編成/ガチャ/出撃カードでも現代編固有デザインが反映されるよう修正**: `drawSamuraiCanvas` 冒頭で `u.mdRender` をチェックして `drawModernUnit` にディスパッチ

### 2026-05-23
- **現代編 全18キャラに固有デザイン＋固有必殺技を本実装**（プレビューの選択案を反映、ボス・味方共通）
  - 新フィールド `mdRender` を `SAMURAI_DATA` と `STAGE_BOSSES` の md_* 18キャラに付与
  - `spawnBossFromData` でも `mdRender` をボス data に伝播（ボス出現時も同じ見た目に）
  - ユニット描画ループに分岐を追加 → `drawSamuraiCanvas` ではなく `drawModernUnit` を呼ぶ
  - `drawModernUnit(c, x, y, u, dir, swing, scale)` が `MD_DRAW[u.mdRender]` テーブルを引いて 18体の固有 Canvas 描画を行う
    - 非人型（メガロドン=ザメ／UFO=円盤＋グレイ宇宙人／サテライト=赤の戦略衛星／ラットキング=四足ネズミ＋王冠／スモッグ=紫の毒霧悪魔／ザイガス=銀のサイバー解体ロボ＋鉄球／AI兵器=4本足重装ロボ／メカMK-III=黒紫の重装メカ）は全身カスタム
    - 人型（暴走族/怪盗/クチサケ/テケテケ/メリー/花子/ハッカー/ドローン軍団長/ブレットマン/CEO）も全身カスタム（脚・胴・頭・装飾を選択案に合わせて描画）
  - ユーザー選択した攻撃を 16 個の `md_*` weapon で実装（残り 2 個は既存 `magic_circle`/`big_laser` を流用）
    - md_bike → kamikaze horse_charge 流用（貫通）
    - md_cards → 8方向 magic_circle 弾
    - md_curse → slashWaves style:mega_flame
    - md_tp_strike → cloneStrikes 3連
    - md_doll_summon → jumpCombos 3体 style:snake
    - md_water_pillar → 5本ピラー時間差 style:water
    - md_guided → 3発の追尾 fireball 弾
    - md_acid_rain → 全画面に6本ピラー style:acid
    - md_swarm → jumpCombos 5体 style:snake
    - md_sonic → 超高速 slashWaves style:charge_beam
    - md_drill → kamikaze horse_charge 流用（×1.6 ダメ）
    - md_vortex → quakes range:180 style:spin
    - md_beam_burst → 5方向の magic_circle 弾
    - md_missile_storm → 12発のランダム着弾 fireball 弾
    - md_stamp → quakes style:binding_seal（スタン付き）
    - md_killsat → 全画面6本ピラー
  - 攻撃ハンドラは `attackTarget` 内の thunder_pillar の直後に `mdWeapon.startsWith('md_')` でディスパッチする一括ブロック
  - 既存の `teleport:true`（テケテケ・花子さん）の瞬間移動能力は維持
- **現代編 全18キャラのデザイン候補プレビューを追加**（3デザイン+3攻撃のコンパクト版）
  - `samurai-wars/modern-preview-index.html` に一覧（Phase別3グループ）
  - 18ファイル: `md_bouso/md_kaitou/md_kuchisake/md_teketeke/md_merry/md_hanako/md_hacker/md_drone_cmd/md_smog/md_ai_guard/md_rat_king/md_bullet/md_zigas/md_megalodon/md_ufo/md_mecha3/md_ceo/md_satellite-preview.html`
  - ユーザーが選択した案を本実装に反映する流れ（過去編と同じ）
- **テケテケ・トイレの花子さんに瞬間移動能力**（ボス・味方の両方）
  - データに `teleport:true` を付与（`STAGE_BOSSES[204]`/`[206]` + `SAMURAI_DATA` の `md_teketeke`/`md_hanako`）
  - `spawnBossFromData` で `b.teleport` を `data.teleport` に伝播
  - ユニット更新ループで `u.teleportTimer` を 3.5 秒初期化 → 5.5〜7秒間隔で発動
  - 行き先は **中央付近** と **相手城のすぐ手前** を交互（`teleportPhase` で切り替え）
  - 消失/出現で 24/28 個のパーティクル、ワープ時 `addFloat` で「✨瞬間移動✨」/「✨神隠し✨」
  - 出現時 `atkCd=0` で即座に攻撃可能、`snd.coin()` で SE
  - 味方の場合は **敵城すぐ手前にワープして攻撃** = 強力なフィニッシャー
- **現代編 全18ステージを実装**（id:201-218）— 超過去編クリアで解放
  - 解放ゲート: `isEraAvailable` に `modern` 分岐を追加（101-118 全クリアで `available`）
  - 勝利画面で「🌟 現代編 解放！🌟」バナーを表示（超過去編全クリア時のみ）
  - 18ステージ: 渋谷スクランブル/歌舞伎町夜戦/駅前広場/廃校怪談/地下道/オフィス街/高速道路/空港テロ/港湾倉庫街/銀座/地下鉄路線網/新幹線追撃/解体現場/臨海工業/軌道襲来/政府機関/摩天楼/軌道兵器降臨
  - 新雑魚6種: `md_thug`（チンピラ）/ `md_riot`（機動隊員）/ `md_zombie`（ゾンビ会社員）/ `md_cyborg`（サイボーグ兵）/ `md_drone`（警備ドローン=空対空）/ `md_heli`（攻撃ヘリ=空対空遠AOE）
  - 新テーマ6種: city / downtown / school / neon / harbor / sewer（enemyStyle:'modern'）
  - **18体のボス**（`STAGE_BOSSES[201..218]`）:
    1 暴走族頭領 / 2 怪盗ブラックタイガー(分身) / 3 クチサケ女(AOE) / 4 テケテケ(突進)
    5 呪い人形メリー(毒) / 6 トイレの花子さん(放射) / 7 ハッカー帝王(グリッチ)
    8 ドローン軍団長(空対空) / 9 公害怪獣スモッグマン(空毒霧) / 10 AI兵器ガーディアン(ビーム)
    11 ラットキング(召喚) / 12 ブレットマン(超速突進) / 13 解体重機ザイガス(鉄球AOE)
    14 メガロドン(水柱) / 15 UFO円盤王ゼノス(空ビーム) / 16 メカ怪獣MK-III(対空AOE)
    17 暗黒大企業CEOザイバツ(召喚) / 18 サテライト・ゼロ(メガ・軌道レーザー)
  - 全ボスはクリアで仲間に: `STAGE_UNLOCKS[201..218]` + `md_*` の 18 味方ユニットを `SAMURAI_DATA` に追加（`CHARACTER_ORDER` も更新）
  - 難易度: 超過去編より少し上 — 雑魚は基本2.4倍（vs 超過去2.0倍）/ ボスは 2.4倍（vs 2.0倍）/ ステージスケール +22%HP・+18%ATK per stage
  - 城デザイン: **現代的な高層ビル/マンション** — 新関数 `drawModernCastle` を新設、`drawCastle` 冒頭で `currentEra==='modern'` を分岐
    - 自城4段階進化: 一軒家(Lv1) → アパート(Lv2) → タワーマンション(Lv3) → 超高層ビル+ヘリポート+金旗(Lv4)
    - ガラス張りの連続窓（点灯はステージ内で決定的、チラつかない）
    - **龍神レーザー砲ポジ = 屋上の衛星パラボラアンテナ砲台**（自城）/ 敵城は赤いブリンカー付き鉄塔＋ピンクネオン看板
    - HP 50%/25% でガラス割れ・上層崩壊・黒煙・火花

### 2026-05-03
- メガボスも前進するように — `STAGE_BOSSES[18]`（暗黒大龍神）/ `[118]`（ゼウス）/ `STAGE_18_BOSSES`（天空魔機神+暗黒大龍神）の `speed:0.0` を `0.16〜0.20` に変更。画面縦断の超巨大ボスがゆっくり迫ってくる演出に（描画関数は `u.x` 基準なので位置追従は自動）
- 炎魔導士 (kaen) / イルルヤンカシュ (sp_irullu) の `range` を `1100` → `9999` に拡張。**戦場のどこに敵がいても確実に攻撃**できる無限射程に
- 後方支援の砲台ポジ2体を新設 — **炎魔導士 (kaen)** と **イルルヤンカシュ (sp_irullu)** を `speed:0` + `range:1100` に変更。自城前で動かず、画面端まで届く超遠距離アタッカーに（kaen は火球AOE、sp_irullu は炎ブレスAOE+対空+飛行）
- **風魔 (fuma)** の speed を `3.0` → `6.0` に倍化（風神忍の名にふさわしい超高速）
- 超過去編の難易度を引き上げ — `getEnemyStageMult` で `era==='super_past'` の雑魚ベース倍率を **2倍**、`spawnBossFromData` で超過去編のボスHP/ATKを **2倍**（過去編の3倍ボスより緩やかな上げ幅）
- 過去編の難易度を引き上げ — `getEnemyStageMult` で `era==='past'` の場合に雑魚スケーリングのベース倍率を **1.5倍**、`spawnBossFromData` で `era==='past'` のステージはボスHP/ATKを **3倍**（取得Goldも√3倍に追従）
- 超過去編専用の**古代風の砦**デザインを追加（自城・敵城両方） — `drawCastle` 冒頭で `currentEra === 'super_past'` を判定し新関数 `drawAncientCastle` に分岐。下段=粗い石積み（不規則な継ぎ目+苔）、中段=土壁+丸太柵、上段=土と木の小屋（入口に動物頭蓋骨、敵城は松明の揺らめき）、屋根=藁葺き（縦の流線+棟木の縄結び）、Lv3+で藁屋根の物見やぐら、旗は木棒+ボロ布+原始的な×印シンボル。敵城は屋根に動物の角＋串刺し頭蓋骨。自城の龍神レーザー砲は獣頭付きの**巨大弩弓**に置換（チャージ表示は維持）。HP 50%/25% で石ブロックの崩落・藁屋根の焼け焦げ・くすぶる煙が出る
- 強化道場のレベルアップ演出を派手に — 該当カードがバウンス+黄金グロー+シャイン、画面中央に「⚒ LEVEL UP! ⚒」バナー、3重リング波紋、32個の紙吹雪、Lv表示ポップ、新規 `snd.levelup` 音（上昇アルペジオ + 高音キラキラ + 着地ベース）
- `renderUpgradeList` のカードに `data-id` 属性を付け、レベルアップ時はカード内テキストを部分更新→1.1秒後に全リスト再生成（演出を切らずに他カードのコスト/ボタン状態も最終更新）

### 2026-05-03
- **編解放ゲート**: `super_past`（超過去編）を初期 `available:false` に変更し、`isEraAvailable(era)` 関数で動的判定。**過去編全18ステージクリア**で解放されるよう実装。`renderEraList`/`selectEra` を `isEraAvailable()` 経由に切り替え、ロック中は `unlockHint` を表示
- **クリア条件強化**: 敵城HP0でも、ステージ上に敵ユニット（ボス・雑魚含む）が残っていればクリアしない仕様に。`enemyCastleHp <= 0 && !enemiesAlive` でトリガー。さらに敵城HP0で **新規スポーンを停止**（既存ユニットは残るので倒し切る必要あり）
- 勝利画面に「**🌟 超過去編 解放！🌟**」のボーナスメッセージを追加（過去編全クリアで初めて達成したタイミングのみ）
- 過去編: 終盤5キャラに**必殺技（8回ごと）専用攻撃**を実装（通常攻撃はそのまま、Batch 6 完成・27/27達成）
  - **大入道 (onyudo)**: 案A（現行）+ ③妖気の毒霧 — blizzards に `style:'poison'` 再利用、range 320の前方コーン毒霧
  - **大天狗 (daitengu)**: 案A（現行）+ ②葉団扇 大旋風 — slashWaves に `style:'tornado'` 追加、巨大竜巻が前方貫通（speed 11, range 700）。drawSlashWave に渦巻き＋葉っぱ＋流線の演出
  - **海賊 (kaizoku)**: 案B（黒い船長海賊）+ ④大砲ぶっ放し — 体色`#5a2a1a`→`#1a1a1a`、helmet `hood` を `color` 連動化、bullets に巨大 fireball (atk×2.5 AOE)
  - **風魔 (fuma)**: 案D（白の風神忍）+ ②八方手裏剣 — 体色`#3a4a3a`→`#fff`、bullets に8方向放射発射 (各 atk×0.55)
  - **八雲 (yagumo)**: 案A（現行）+ ④八雲立つ 結界霧 — 全画面ヒール+全敵ダメ。味方全員 maxHp×20% 回復、敵全員に atk×0.8、`game.kekkaiKiri = 1.5` で全画面の青白い霧+雲うねり描画
- 新スタイル: `slashWaves.tornado` / `blizzards.poison` 再利用 / 全体ヒール+ダメ パターン（attackTarget 内で `game.units.forEach` で直接処理）
- helmet `hood` を `color` 引数連動化（kaizoku/fuma/ninja に影響）
- 過去編 デザインプレビュー追加（Batch 6: 終盤5体・最終バッチ）— 4案+4案
  - `samurai-wars/onyudo-preview.html`（大入道）— A黒袈裟/B紫闇/C朱赤鬼/D白幽霊 + ①巨大拳/②影分身双頭/③妖気毒霧/④巨腕地面叩きつけ
  - `samurai-wars/daitengu-preview.html`（大天狗）— A朱赤山/B蒼烏/C黒魔/D黄金神 + ①風刃/②葉団扇大旋風/③神通力神隠し/④八咫烏召喚
  - `samurai-wars/kaizoku-preview.html`（海賊）— A茶無頼/B黒船長/C朱女首領/D蒼海神 + ①抜刀/②フリント3連射/③海王渦潮/④大砲ぶっ放し
  - `samurai-wars/fuma-preview.html`（風魔）— A緑/B蒼風影/C黒紫闇/D白風神 + ①クナイ/②八方手裏剣/③風遁疾風斬り/④影縫い鎖鎌
  - `samurai-wars/yagumo-preview.html`（八雲）— A紺神霊/B白銀天霊/C紫禍津/D黄金神武 + ①大太刀/②八雲剣八重斬り/③神威雷光一閃/④八雲立つ結界霧

### 2026-05-02
- 過去編: 後半3キャラに**必殺技（8回ごと）専用攻撃**を実装（通常攻撃はそのまま）
  - **赤鬼侍 (akaoni)**: 案A（現行）+ ④鬼神化 巨大化 — 自己バフ系（attacker.kishinka=3.0秒タイマー）。HP+30%回復、3秒間 atk×2倍 + AOE化（半径140px）+ 描画scale 1.4倍 + 紫オーラ脈動。`attackTarget` 冒頭で `kishinkaBuff` フラグを評価し dmgMult/aoe 半径を上乗せ、必殺技分岐は return せず通常攻撃に合流。`unit update loop` で `u.kishinka -= dt` をデクリメント
  - **超合金鬼神 (kishin)**: 案C（蒼銀のクリスタル）+ ④ファイナルクラッシュ — 体色`#a02050`→`#aaaaaa`、helmet `kishin` を `color` 連動化、kamikazes に `style:'final_crash'`、跳躍→振り下ろし→超AOE 200px爆発（damage atk×2.5）、新関数 `drawFinalCrash`（紫雷+多重爆発）
  - **ダイダラボッチ (daidarabocchi)**: 案D（黄金の天巨神）+ ②山投げ — 体色`#a8946a`→`#ddaa00`、helmet `daidara` を `color` 連動化、kamikazes に `style:'mountain_throw'`、放物線で山が飛び着弾で超AOE 200px大爆発（damage atk×2.5）、新関数 `drawMountainThrow`（雪冠+木付き山+キノコ煙）
- helmet `kishin` / `daidara` を `color` 引数連動化
- `drawKamikazeOrSlam` に `'final_crash'` / `'mountain_throw'` 振り分けを追加
- kamikaze update logic を style 別に拡張: dmgTime と AOE半径を style 依存に、lifeTime も `mountain_throw`/`final_crash` は 1.4秒に延長
- ユニット render 部に kishinka 中の脈動オーラ + scale 1.4倍を追加
- 過去編 デザインプレビュー追加（Batch 5: 後半3体）— 4案+4案
  - `samurai-wars/akaoni-preview.html`（赤鬼侍）— A朱赤/B青鬼変化/C黒鬼魔将/D黄金伝説 + ①金棒振下/②鬼炎大爆裂/③八方鬼乱舞/④鬼神化巨大化
  - `samurai-wars/kishin-preview.html`（超合金鬼神）— A紫紅/B漆黒闇/C蒼銀結晶/D朱赤 + ①メガブレード/②胸部メガビーム/③全弾発射20連/④ファイナルクラッシュ
  - `samurai-wars/daidarabocchi-preview.html`（ダイダラボッチ）— A土色/B緑森神/C岩石/D黄金天 + ①踏みつぶし/②山投げ/③大地震+地割れ/④神息吹（凍結波）
- 過去編: 中後半4キャラに**必殺技（8回ごと）専用攻撃**を実装（通常攻撃はそのまま）
  - **サイボーグ忍者 (cyber_ninja)**: 案D（銀白の高速型）+ ③瞬間移動連撃 — 体色`#0a3a5a`→`#ddccaa`、helmet `cyber_hood` を `color` 連動化、cloneStrikes に `style:'teleport'`、ターゲット周辺5箇所に瞬間出現してクナイ斬り（各 atk×0.5、合計2.5倍）。新関数 `drawCloneStrike`内に teleport 分岐
  - **侍大将 (taisho)**: 案B（紺地金鎧の上杉大将）+ ④騎馬突撃 — 体色`#c01010`→`#1a3a8a`、kamikazes に `style:'horse_charge'`、貫通モード（hitUnits で通過する敵全員に atk×1.5）。新関数 `drawHorseCharge` で愛馬+騎乗大将+突き出る槍を描画
  - **雷神 (raijin)**: 案C（黄金の電雷神）+ ②神鳴 雷雲呼び — 体色`#1060a0`→`#ddaa00`、helmet `raijin_horns` を `color` 連動化（髪が黄金に）、game.pillars に5本の雷柱を負timer 0.13秒間隔で連続発射（各 atk×0.6、AOE 110px+1.6秒スタン）
  - **ミサイル戦車 (missile_tank)**: 案A（現行）+ ④自動追尾ミサイル — 周囲150内の敵を最大3体ロックオン、各 atk×0.7 の rocket弾（aoe true）を発射
- helmet `cyber_hood` / `raijin_horns` を `color` 引数連動化
- `drawKamikazeOrSlam` に `'horse_charge'` を style 追加 → 新関数 `drawHorseCharge`
- `drawCloneStrike` に `'teleport'` style 分岐を追加（既存の孫悟空 style はそのまま）
- kamikaze update logic に `horse_charge` 専用処理を追加（hitUnits で多体貫通、突進中の castle 判定も追加）
- `drawThunderPillar` 冒頭に `if(p.timer < 0) return;` を追加して負timerでの描画スキップ対応（雷神の連続発射用）
- 過去編 デザインプレビュー追加（Batch 4: 中後半4体）— 4案+4案
  - `samurai-wars/cyber_ninja-preview.html`（サイボーグ忍者）— A紺/B朱/C黒紫/D銀緑 + ①プラズマクナイ/②電脳分身/③瞬間移動連撃/④電磁手裏剣
  - `samurai-wars/taisho-preview.html`（侍大将）— A赤備え/B紺金/C黒漆独眼/D黄金 + ①大太刀斬/②兜割り/③軍配鼓舞/④騎馬突撃
  - `samurai-wars/raijin-preview.html`（雷神）— A蒼/B朱赤鬼/C黄金電/D闇紫魔 + ①雷撃/②神鳴雷雲/③太鼓連打/④雷霆連鎖
  - `samurai-wars/missile_tank-preview.html`（ミサイル戦車）— A緑迷彩/B鋼鉄重/C砂漠長砲/D蒼サイバー + ①ミサイル/②斉射6連/③戦略核/④追尾ミサイル
- 過去編: 中盤5キャラに**必殺技（8回ごと）専用攻撃**を実装（通常攻撃はそのまま）
  - **弁慶 (benkei)**: 案C（朱赤の戦闘僧）+ ④立ち往生 回転連撃 — 体色`#3a2050`→`#aa1010`、helmet `benkei` を `color` 連動化、quakes に `style:'naginata_spin'`、3連ヒット (0.3/0.7/1.1秒) で AOE 130px、各 atk×0.7
  - **陰陽師 (onmyouji)**: 案C（紫の闇陰陽師）+ ③結界封印 — 体色`#1a1a40`→`#7a3a8a`、helmet `onmyouji_hat` を `color` 連動化、quakes に `style:'binding_seal'`、ターゲット位置に魔法陣展開、AOE 110px + 1.2秒スタン
  - **僧兵 (sohei)**: 案A（現行）+ ②念仏 黄金光波 — slashWaves に `style:'golden_light'`、画面縦断の黄金光柱（speed 12, range 600）、貫通、漂う梵字
  - **鉄砲足軽 (teppo)**: 案D（黒装束の忍鉄砲）+ ②三段撃ち — 体色`#5a4a3a`→`#1a1a1a`、helmet `jingasa` を `color` 連動化、新配列 `pendingShots` で 0.18秒間隔の3連射 (各 atk×0.55)
  - **炎魔導士 (kaen)**: 案A（現行）+ ④灼熱の極炎 — slashWaves に `style:'mega_flame'`、画面横断の極太炎ビーム（speed 14, range 800、damage atk×1.2）、火粒+渦巻き煙の演出
- helmet `jingasa` / `benkei` / `onmyouji_hat` を固定色から `color` 引数連動に変更（体色変更だけで衣装も自動連動）
- 新配列 `game.pendingShots` を追加（時間差発射用、`game` 初期化に含める）
- `drawQuake` に `'naginata_spin'`（回転薙刀）+ `'binding_seal'`（魔法陣）を style 追加
- `drawSlashWave` に `'golden_light'`（黄金光柱）+ `'mega_flame'`（極炎ビーム）を style 追加
- quake update logic を style 別に拡張: naginata_spin は `hitsApplied` カウンタで多段ヒット、binding_seal は dmgTime 0.3秒+1.2秒スタン、lifeTime も style 別
- 過去編 デザインプレビュー追加（Batch 3: 中盤5体）— 4案+4案
  - `samurai-wars/benkei-preview.html`（弁慶）— A紫頭巾/B黒衣/C朱赤/D金鎧 + ①薙刀振下/②七つ道具乱投/③仁王立ち反撃/④立ち往生回転連撃
  - `samurai-wars/onmyouji-preview.html`（陰陽師）— A黒衣/B白聖/C紫闇/D蒼星詠 + ①五芒星/②式神召喚3体/③結界封印/④御札連投
  - `samurai-wars/sohei-preview.html`（僧兵）— A橙袈裟/B朱戦闘/C紫密教/D黒禅 + ①薙払/②念仏黄金光波/③護摩炎陣/④数珠投げ
  - `samurai-wars/teppo-preview.html`（鉄砲足軽）— A茶具足/B紺狙撃/C朱備え/D黒忍 + ①火縄/②三段撃ち/③大筒/④散弾
  - `samurai-wars/kaen-preview.html`（炎魔導士）— A朱赤/B黒紅炎/C黄金フェニックス/D茶仙人 + ①火球/②火炎放射/③隕石召喚/④灼熱の極炎
- 過去編: スタート5キャラに**必殺技（8回ごと）専用攻撃**を実装（通常攻撃はそのまま）
  - 足軽: A（現行）+ ③ 横薙ぎ払い → quakes に `style:'sweep'` + `dir`、前方アーチAOE 90px、振り抜く槍の金弧
  - 侍: A（現行）+ ④ 飛刀斬り → slashWaves に `style:'wind'`、緑の三日月飛び刃が画面横断420px
  - 忍者: C（紫の風忍）+ ④ 火遁の術 → 体色`#1a1a1a`→`#3a1a4a`、blizzards に `style:'fire'`、前方コーン火炎+burning付与
  - 弓兵: A（現行）+ ③ 火矢 → 通常bullet経由で `weapon:'fireball'` に切り替え、AOE+burning
  - 巫女: A（現行）+ ② 神楽舞い → quakes に `style:'kagura'`、紫の御札8枚の渦巻き、AOE 130px+0.7sスタン
- attackTarget の構造に「キャラID別の必殺技分岐」セクションを追加（`isSpecial` && id チェック）
- drawSlashWave に `'wind'`、drawBlizzard に `'fire'`、drawQuake に `'sweep'` `'kagura'` を style 追加
- quake 更新ロジックを style 別に dmgTime / lifeTime / 方向フィルタ対応
- 過去編 ロボ系5キャラに**必殺技専用攻撃**を実装（通常攻撃はそのまま）
  - **戦闘ロボ (robo_basic)**: 案A（現行）+ ② バルカン乱射 — 5発の laser_arm 弾を扇状（dy=±10px）に発射、各 atk×0.35
  - **ドローン (drone)**: 案D（緑のサポート）+ ③ 上空爆撃 — 体色`#5a7aa0`→`#88dd66`、3発の `fireball` 爆弾が空（y=30）から落下、各 atk×0.6 AOE
  - **メカ侍 (mecha_samurai)**: 案B（赤備え）+ ③ ブースト突進斬り — 体色`#3a5a7a`→`#aa1010`、kamikazes に `style:'mecha_charge'`、新関数 `drawMechaCharge`、damage atk×1.5
  - **レーザー砲台 (laser_turret)**: 案C（緑の対空砲）+ ③ チャージビーム — 体色`#404a5a`→`#3a5a3a`、slashWaves に `style:'charge_beam'`、極太赤レーザー、speed 18, range 700
  - **重装甲ロボ (heavy_robo)**: 案C（黒の鬼ロボ）+ ② ロケットパンチ — 体色`#6a6a72`→`#1a1a1a`、`fireball` bullet（aoe）で atk×1.4
- drawSlashWave に `'charge_beam'` style 追加
- 過去編 デザインプレビュー追加（Batch 2: ロボ系4体 + 戦闘ロボ）— 4案+4案
  - `samurai-wars/robo_basic-preview.html`（戦闘ロボ）
  - `samurai-wars/drone-preview.html`（ドローン）
  - `samurai-wars/mecha_samurai-preview.html`（メカ侍）
  - `samurai-wars/laser_turret-preview.html`（レーザー砲台）
  - `samurai-wars/heavy_robo-preview.html`（重装甲ロボ）
- 過去編 デザインプレビュー追加（Batch 1: スタート時保有5体）— 4案+4案の簡易版
  - `samurai-wars/ashigaru-preview.html`（足軽 4+4）
  - `samurai-wars/bushi-preview.html`（侍 4+4）
  - `samurai-wars/ninja-preview.html`（忍者 4+4）
  - `samurai-wars/yumi-preview.html`（弓兵 4+4）
  - `samurai-wars/miko-preview.html`（巫女 4+4）
- 過去・未来大戦争: 残り4キャラ実装（人型系）
  - **ナーガ**: 案A（王道緑女神）+ 攻撃⑤蛇の召喚。武器`snake_summon`（jumpCombosに `style:'snake'`）。3体の小蛇が3敵に放物線で飛びかかる。各 atk×0.7、合計2.1倍。
  - **ベオウルフ**: 案E（雷の戦士）+ 攻撃⑤跳躍斬り。兜 bone_helm を「銀色+金角+額の稲妻+雷光る目」に書き換え、体色`#5a5a5a`。武器`leap_slash`（kamikazes に `style:'leap'`）。空高くに弧を描いて急降下、着地で衝撃波+稲妻パターン。ダメ atk×1.4、自己ダメージなし。
  - **バロール**: 案C（苔むした古代）+ 攻撃②邪眼の光線。兜 green_giant に苔・葉・古い灰髪、体色`#5a6a5a`、単眼にグロー。武器`evil_eye`（slashWaves に `style:'eye'`）。赤い水平レーザーで貫通、range 360/400。
  - **手長足長**: 案C（闇の妖怪）+ 攻撃⑤渦巻き攻撃。兜 twin_yokai を紫黒+赤目+黒笠に書き換え、体色`#3a1a4a`。武器`spin_attack`（quakes に `style:'spin'`）。攻撃者周囲に360°の紫の渦と二色の腕の高速回転、AOE 140/160px。
- 描画関数の style 対応:
  - `drawSlashWave` に `'eye'`（赤レーザー）追加
  - `drawJumpCombo` に `'snake'`（緑の小蛇）追加
  - `drawKamikazeOrSlam` に `'leap'`（ベオウルフ跳躍）追加 → 新関数 `drawLeapSlash`
  - `drawQuake` に `'spin'`（紫渦）追加
- 過去・未来大戦争: 4キャラ実装
  - **プルスサウルス**: 案A（王道緑茶のまま）+ 攻撃④水鉄砲。武器`water_shot`（slashWavesに `style:'water'` で青い水流の見た目）。range 280に拡張、貫通。
  - **プロコプトドン**: 案A + 攻撃⑤ジャンプ連打。武器`jump_combo`、新配列`game.jumpCombos`。3体までターゲット選定し時間差で跳躍→着地ダメージ（各 atk×0.6、合計1.8倍）。
  - **ティタノボア**: 案B（紫黒の毒蛇）+ 攻撃④毒霧。新ヘルメット`snake_poison`（紫黒+緑の毒目+毒滴の牙）、体色`#3a1a4a`。武器`poison_fog`（blizzards に `style:'poison'`、緑霧+☠マーク+`burning`状態を付与）。
  - **サンドワーム**: 案A + 攻撃⑥巨体ジャンプ叩きつけ。武器`slam_down`（kamikazes に `style:'slam'`、上空への弧→巨大爆発、ダメージ atk×1.6、自分にダメなし）。
- 新関数: `drawSlamDown`, `drawJumpCombo`, `drawKamikazeOrSlam`(振り分け)
- `drawSlashWave` / `drawBlizzard` を `style` 対応にして見た目を分岐
- デザインプレビュー追加（動物系4キャラ）:
  - `samurai-wars/pulrussaurus-preview.html`（プルスサウルス 6+6）
  - `samurai-wars/procoptodon-preview.html`（プロコプトドン 6+6）
  - `samurai-wars/titanoboa-preview.html`（ティタノボア 6+6）
  - `samurai-wars/sandworm-preview.html`（サンドワーム 6+6）
- デザインプレビュー追加（人型系4キャラ）:
  - `samurai-wars/naga-preview.html`（ナーガ 6+6）
  - `samurai-wars/beowulf-preview.html`（ベオウルフ 6+6）
  - `samurai-wars/balor-preview.html`（バロール 6+6）
  - `samurai-wars/tenagaashinaga-preview.html`（手長足長 6+6）
- 過去・未来大戦争: フロストジャイアントを「氷結晶魔法使い + 吹雪」に変更
  - 体色 `#aaccdd`→`#aaeeff`、兜 frost_crown を結晶パターン+大きなジェム角+シアン光目に書き換え
  - 武器 `magic_circle`→`blizzard`、range 240→280/320、atkSpeed 1.8→2.2/2.4
  - 吹雪攻撃: 前方一帯（dir方向に bz.range まで）に1.0秒の吹雪 → 0.25秒ごとに3回ダメージ（各 atk × 0.4）+ 凍結1秒
  - 雪粒・大雪片・水平風線が決定的に流れる視覚（チラつかない）
  - 必殺技時「❄絶対零度❄」演出
- 過去・未来大戦争: マンモスを「王道毛深い + 足踏み地震」に変更
  - 体色 `#5a3a20`→`#aa6644`（明るめのブラウン）、兜 mammoth_tusk に頭頂のふさふさ毛+体表毛皮+鼻シワ+目を追加
  - 武器 `tusk`→`foot_quake`、range 55→200/220、atkSpeed 1.9→2.4/2.5
  - 足踏み地震: 0.3s 足上げ→0.2s 踏みつけフラッシュ→0.45sで AOE ダメージ（範囲内に attacker.atk）+ 0.5秒スタン
  - 同心円の3重衝撃波 + 地面の亀裂 + 跳ねる土の演出
  - 飛行ユニットには当たらない（地面の振動なので）
  - 必殺技時「🌍大地震🌍」演出
- 新配列: `game.blizzards`, `game.quakes`、関数 `drawBlizzard`, `drawQuake` 追加
- デザインプレビュー追加:
  - `samurai-wars/frostgiant-preview.html`（フロストジャイアント デザイン6 + 攻撃6）
  - `samurai-wars/mammoth-preview.html`（マンモス デザイン6 + 攻撃6）
- 過去・未来大戦争: スサノオに「十拳剣の横一閃」攻撃を実装（味方/ボス両方）
  - 武器を `odachi` → `slash_wave`、range を 60→200/240 に拡張
  - 画面縦断の金色斬撃波が travel.dir 方向にスピード9で進む
  - 同じ波は1ユニットにつき1回だけヒット（`hitUnits` で追跡）
  - 城も範囲内なら直撃。射程内のすべての地上ユニットを貫く
  - `game.slashWaves` 配列、`drawSlashWave()` 関数追加
  - 必殺技時は「⚔神剣一閃⚔」演出
- 過去・未来大戦争: ゴーレムを「苔むした古代（案C）+ 自爆突進（案⑥）」に変更
  - 体色 `#5a5a5a`→`#5a6a5a`（グリーンがかった灰）
  - 兜 `stone_block` に苔・葉・体側面の苔を追加、目を緑グロー（古代の魔力）
  - 武器 `fist`→`self_destruct`、range 46→140、atkSpeed 1.7→2.4 に
  - 自爆突進: 0-0.3s チャージ赤光 → 0.3-0.7s 突進ゴースト → 0.7s 大爆発
  - ダメージ: AOE 130px に attacker.atk × 2.0
  - 自分にも `maxHp × 18%` のダメージ（ノックバックなし）
  - `game.kamikazes` 配列、`drawKamikazeRush()` 関数追加
  - 必殺技時は「💥大爆発💥」演出
- デザインプレビュー追加:
  - `samurai-wars/susanoo-attack-preview.html`（スサノオ攻撃6案）
  - `samurai-wars/golem-preview.html`（ゴーレム デザイン6案 + 攻撃6案）
- 過去・未来大戦争: 孫悟空を「七十二変化（分身）+ 分身ラッシュ攻撃」に変更
  - 味方 sp_gokuu と Boss[115] 両方に `clones:2` フラグ + `weapon:'clone_rush'`
  - 描画: `clones` 持ちユニットは本体の左右に半透明の緑分身2体を常時表示
  - 攻撃: `clone_rush` を attackTarget で分岐し、3体の分身ストライクを 0.16秒間隔で `game.cloneStrikes` にスポーン
  - ダメージ: 各分身が attacker.atk * 0.7 を 50px AOE で適用、3体合計 2.1倍
  - 必殺技時は「✨七十二変化✨」フロート表示
  - 描画関数 `drawCloneStrike` 追加: 分身が現れて棒で突く + 着弾フラッシュ + 4方向の電撃線
- 過去・未来大戦争: 味方ゼウスの武器を `thunder_bolt` → `thunder_pillar` に統一（ボスと同じ天雷柱を放つように）
- 過去・未来大戦争: メガボス被弾時の白フラッシュを目に優しく軽減
  - 全画面 fillRect → ボス周辺260pxの縦帯のみ
  - アルファ最大 0.75 → 0.18 にキャップ
- 過去・未来大戦争: **ノックバック演出を全ユニットに追加**
  - `damageUnit()` で `dmg >= max(80, maxHp * 0.18)` の強い攻撃を判定
  - 後方に吹き飛ぶ velocity を `u.knockback = { vx, timer }` に設定
  - mega ボスは無効、通常 boss は 35% の弱め設定
  - ユニット更新ループで knockback 中は前進・攻撃停止し速度減衰
  - レンダー時はユニットを `tilt = vx * 0.05` ラジアン傾けて視覚的フィードバック
  - 着弾時に白いパーティクル8個を噴出
- デザインプレビュー追加: `samurai-wars/wukong-preview.html`（孫悟空6デザイン+6攻撃案）
- 過去・未来大戦争: ゼウス（最終ボス）を「嵐神」デザイン + 「天雷柱攻撃」に変更
  - 体色 `#ffd24a`→`#3a4a8a`（深紺）。`drawZeus` を全面書き換え：紺ローブ + 銀紫鎧 + 薄紫髭 + スパイクの嵐の冠 + 体周りに渦巻く竜巻 + 大量の雨 + 電撃放出する右手
  - 兜 `zeus_crown` も同方向（スパイク冠 + 嵐の髭）に書き換え。プレイヤー側 sp_zeus にも反映
  - 新攻撃 `thunder_pillar`: ターゲット位置にピラーエフェクトをスポーン → 0.4秒で着弾 → AOE 110px ダメージ + スタン1秒 → 余韻で地面の電撃が散る
  - 新配列 `game.pillars` 追加（spawn / update / filter / render）。`drawThunderPillar` を新設
  - 既存のメガボス弾システム（空から3点ランダム発射）はバイパスされ、雷柱だけが使われる
- 過去・未来大戦争: ティラノサウルスを「赤茶リアル恐竜（案B）」に変更 + 顔を進軍方向に
  - 体色 `#3a5a30`→`#aa6644`、兜 `rex_jaw` を赤茶ベース・鼻孔・眉・斑点付きに書き直し
  - **顎を local -x 方向に描画**: dir=1（プレイヤー側）で画面左向き、dir=-1（ボス側）で画面右向き = どちらも進軍方向に向く
- 過去・未来大戦争: イルルヤンカシュを「東洋青龍」デザインに変更
  - 兜 `dragon_head` を緑頭+金角+金ヒゲ+緑鬣+金目に書き換え
  - 体色 `#1a4a6a`→`#3a8a5a`（緑）、`noWings:true` フラグ追加
  - `noWings` の場合は翼描画をスキップし、神秘的な雲のたなびきを足元に表示
  - レンダーと spawnBossFromData を `noWings` 対応に
- デザインプレビュー追加: `samurai-wars/trex-preview.html`（ティラノサウルス6案）
- 過去・未来大戦争: スサノオを「金の神将（仏神風）」デザインに変更
  - 体色 #1a3a5a → #ffd24a、兜 `susanoo_helm` を光輪+金冠+朱中央装飾+翡翠玉に書き換え
- 過去・未来大戦争: **ゼウス（ステージ118ボス）を画面縦断のメガボスに**
  - HP 42,000 → 84,000、ATK 1,700 → 3,400、`mega:true`、`speed:0.0`、range 500
  - 新関数 `drawZeus(c, u)` を追加（drawDarkDragon と同じ形式で画面縦に描画）
  - 月桂冠+白い長髭+雷バトン+金鎧+朱の帯+足元の嵐雲。稲妻は雲から漏れる
  - レンダーディスパッチに `helmet === 'zeus_crown'` 分岐を追加
  - 弾は既存 mega 用ロジック（ランダムな上空3点）から発射 — 雷が空から降る
- デザインプレビュー追加: `samurai-wars/illuyanka-preview.html`（ドラゴン6案）
- 過去・未来大戦争: ヘラクレスオオカブト 兜デザインを「黒銀王道」に refresh（銀ハイライト + オレンジ複眼）
- デザインプレビュー `samurai-wars/susanoo-preview.html` 追加（スサノオ用6案）
- 過去・未来大戦争: 火の鳥 → **サンダーバード**にリネーム + 黄金鳳凰デザインに変更
  - `sp_phoenix` のIDは互換のため維持（セーブデータ保護）
  - 配色: 朱赤→黄金 (`color:#ffd24a`, `wingColor:#ddaa22`)
  - 兜 `phoenix_crest` を「金の頭+朱赤くちばし+長い飾り羽（金+翡翠縁）」に書き換え
  - `STAGE_BOSSES[110]` も同様に更新
- デザイン候補プレビュー `samurai-wars/phoenix-preview.html` を追加（決定後も他キャラ用テンプレとして残置）
- 過去・未来大戦争: **超過去編 全18ステージを実装**（原始時代＋世界神話モチーフ）
  - 空中・対空機構を新設: `flying` / `antiAir` フラグ、`canHitTarget()` で当たり判定
  - ステージ101 (ティラノサウルス) が最初の対空持ち。ここで対空ユーザを獲得して以降の空中敵に対応する流れ
  - 18体のボスを `STAGE_BOSSES` に追加（イルルヤンカシュ / 孫悟空 / ゼウス / フロストジャイアント / マンモス / ティラノサウルス / ヘラクレスオオカブト / スサノオ / 火の鳥 / プルスサウルス / プロコプトドン / ティタノボア / ナーガ / ベオウルフ / サンドワーム / バロール / 手長足長 / ゴーレム）
  - 各ボスは `STAGE_UNLOCKS[101..118]` でクリア時に同名の味方ユニットとして加入（`sp_*` ID, 全18体を `SAMURAI_DATA` に追加）
  - 新雑魚: `sp_savage`（原始人）/ `sp_saber`（剣歯虎）/ `sp_mammothlet`（子マンモス）/ `sp_ptero`（翼竜=空）/ `sp_wyvern`（赤竜=空遠）/ `sp_giant_ape`（大猿）/ `sp_giantbat`（巨大コウモリ=空）
  - 新テーマ: jurassic / savanna / glacier / volcano / mythic を追加。`getTheme` をステージ `theme` フィールド対応に
  - 新ヘルメット17種類 / 新武器5種類を追加（rex_jaw, mammoth_tusk, dragon_head, phoenix_crest, zeus_crown 等 / ruyibo, fire_breath, big_stone, tusk, beetle_horn_attack）
  - 難度: 過去編より高め（castleHp は過去比 ~2倍開始、終盤180,000 / 雑魚スケール +20%/+16% per stage）
  - `getEnemyStageMult` を era 対応に。`stageNumInEra()` で編内通し番号を表示・BGM決定に使用
- 過去・未来大戦争: 5編（超過去/過去/現代/未来/超未来）の時代選択を導入
  - `ERA_DATA` を新設、`era-select` 画面を追加（タイトル → 出陣 → 編選択 → ステージ選択）
  - 既存18ステージは過去編に格納、他4編は COMING SOON で disabled 表示
  - `currentEra` で現在編を保持、`currentEraStages()` で `STAGE_DATA` をフィルタ
  - 戦勝/敗北画面の「戦場へ」は currentEra のステージ一覧へ直帰
  - stage-select に編バナー（色付き）を表示
- 過去・未来大戦争: 全戦士解放後はガチャを引けないように変更
  - `isAllSamuraiUnlocked()` / `refreshGachaButton()` / `openGachaScreen()` を新設
  - タイトルのガチャボタンは `openGachaScreen()` 経由に統一（インラインJSを撤去）
  - ガチャ画面のボタンに `id="gacha-pull-btn"` を付与し、解放完了時は disabled + ラベル差し替え
  - 引いて最後の1体を引き当てたケースもフェーズ3末で `refreshGachaButton()` を呼んで反映
- `PROJECT_STATUS.md` と `Handoff.md` を `Handoff.md` 1本に統合し、旧ファイルを削除
- ホーム画面フッター下に訪問者カウンターを追加（commit `50ffc40`）
  - counterapi.dev の `horikawa-arcade/home` を使用
  - sessionStorage で同一セッションの重複カウント抑制、失敗時は静かに非表示
- カウンターのラベルを `のべ訪問者数` → `TOTAL VISITORS` に変更（commit `d39f381`）

### 旧 PROJECT_STATUS から引き継いだ主要コミット（新しい順）
```
a356ed5 雑魚をステージで強化
e78202a ポータル/漢字侍の漢字に furigana
f898d34 ボス出現を 1/3 castle HP に
1ab0fc3 ボス +50% HP / +35% ATK
e43218b 編成上限撤廃 + 巨大HP位置調整
1e4f47f モバイル UI 詰め直し
66214e7 キャラ表示順を読み順に
848897a アップグレード/勲章/ガチャ/コンボ/ステータス異常/天候/スローモ
93ce16f ボスBGM＋修羅界チラつき修正
0131e95 18ボス導入
5364b73 レスポンシブ
21cc575 過去・未来大戦争 新規追加
```
すべての履歴は `git log --oneline` で。

---

## 未解決・要注意

- **超未来編**: ERA_DATA に登録だけ済（`available:false`、解放ヒント未設定）。実装未着手。同じパターンで進める場合は (1) プレビューHTML生成 → (2) STAGE_DATA/THEMES/BOSSES/UNLOCKS/SAMURAI_DATA 追加 → (3) 描画/攻撃/城/背景 を未来編と同形で。`isEraAvailable` に `super_future` 分岐を追加し、未来編全クリアで解放するのが自然。
- **未来編 helmet 共有問題**: OMNIAS と md_satellite が `helmet='md_sat_red'` を共有していたため mega 描画ディスパッチでバグった（修正済）。今後新規メガボスを足す時は `fuRender`/`mdRender` 等の固有キーでディスパッチを優先するパターンを踏襲すべし。
- **未来編キャラの一部 fu_* 攻撃**: 完全な手動テストはしていない。スマホ実機で各ボス・各味方の通常/必殺がちゃんと当たるか、特殊効果が再生されるかは要確認。
- **counterapi.dev の信頼性**: 無料サービスのため恒久保証はなし。長期で不安なら GoatCounter（要登録）や自前 Cloudflare Worker への移行を検討。今は失敗時フォールバック（要素削除）で十分。
- **訪問者カウントの初期値**: 動作確認のテストヒットが数件入っている。気になるならカウンターキーを差し替える。
- **深海大冒険のキャンバステキストへの furigana 対応**（大規模、未着手）
- **BGM**: もっと曲らしくしたい場合の本格音声処理は未着手

---

## 引き継ぎ時の最初のチェックリスト

1. このファイル（`Handoff.md`）を読む
2. `git log --oneline -20` で直近を把握
3. 変更したい対象ゲームのHTMLを開く（samurai-wars が最も大きい）
4. `grep -n` でキー（関数名・クラス名）を引いて該当箇所へ
5. 変更 → ローカル/プレビューで確認 → コミット & push（GitHub Pages 自動反映）
6. **このファイルを更新してから** コミットを締める
