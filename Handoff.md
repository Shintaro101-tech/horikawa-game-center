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

## 📍 現在進行中：過去編キャラ デザイン+必殺技プレビュー作成（Batch 3 から再開）

**新セッションで再開する場合、ここから続けて**

過去編の味方27キャラに対し、**デザイン4案 + 攻撃4案** のプレビューHTMLを順次作成中。
デザイン+攻撃を選択してもらい、**通常攻撃は現行のまま、必殺技（8回ごと）のみ新攻撃**として実装する流れ。

### 進捗（10/27 完了 / プレビュー 15/27）
- ✅ Batch 1（5体）: 足軽 / 侍 / 忍者 / 弓兵 / 巫女 — プレビュー作成 + 必殺技実装済
  - 足軽: A+③横薙ぎ払い / 侍: A+④飛刀斬り / 忍者: C紫装束+④火遁の術 / 弓兵: A+③火矢 / 巫女: A+②神楽舞い
- ✅ Batch 2（5体）: 戦闘ロボ / ドローン / メカ侍 / レーザー砲台 / 重装甲ロボ — プレビュー作成 + 必殺技実装済
  - 戦闘ロボ: A+②バルカン乱射 / ドローン: D緑+③上空爆撃 / メカ侍: B赤備え+③ブースト突進斬り / レーザー砲台: C緑+③チャージビーム / 重装甲ロボ: C黒+②ロケットパンチ
- 🟡 Batch 3（5体）: 弁慶 / 陰陽師 / 僧兵 / 鉄砲足軽 / 炎魔導士 — **プレビュー作成済、選択待ち**

### 残り（17/27 未着手）
- 🟡 **Batch 3: 中盤5体** — `benkei`（弁慶）/ `onmyouji`（陰陽師）/ `sohei`（僧兵）/ `teppo`（鉄砲足軽）/ `kaen`（炎魔導士）— プレビュー作成済、ユーザの選択待ち
- ⏳ **Batch 4: 中後半4体** — `cyber_ninja`（サイボーグ忍者）/ `taisho`（侍大将）/ `raijin`（雷神）/ `missile_tank`（ミサイル戦車）
- ⏳ **Batch 5: 後半3体** — `akaoni`（赤鬼侍）/ `kishin`（超合金鬼神）/ `daidarabocchi`（ダイダラボッチ）
- ⏳ **Batch 6: 終盤5体** — `onyudo`（大入道）/ `daitengu`（大天狗）/ `kaizoku`（海賊）/ `fuma`（風魔）/ `yagumo`（八雲）

### 各バッチの作業フロー
1. **プレビュー作成**: バッチ内の各キャラに対し `samurai-wars/{id}-preview.html` を作成（デザイン4案 + 攻撃4案、4×4の8カード）
2. **コミット & プッシュ**: 1バッチ分まとめて push、ユーザに URL を提示
3. **ユーザの選択を待つ**（例: 「弁慶: B+②」のように指定）
4. **必殺技を実装**:
   - SAMURAI_DATA の該当キャラの `color` を選んだデザインに合わせて変更（必要なら `helmet` も）
   - `attackTarget` 内の `if(isSpecial)` ブロックに `if(aid === '<id>') { ... return; }` を追加
   - 通常攻撃は触らない。必殺技のみカスタム
   - 視覚効果は基本的に既存の `slashWaves` / `blizzards` / `quakes` / `kamikazes` / `bullets` 配列に `style` フラグで分岐させて再利用
   - 描画関数（`drawSlashWave` / `drawBlizzard` / `drawQuake` / `drawKamikazeOrSlam`）に新 style の分岐を追加
5. **コミット & プッシュ**

### 必殺技攻撃のテンプレ参考（既に実装済の代表例）
- 線形貫通弾 → `slashWaves` + `style:'wind'`/`'water'`/`'eye'`/`'charge_beam'`
- 範囲広域DoT → `blizzards` + `style:'fire'`/`'poison'`
- 範囲AOE+スタン → `quakes` + `style:'sweep'`(前方)/`'kagura'`(放射状)/`'spin'`(高速回転)
- 突進系 → `kamikazes` + `style:'leap'`/`'slam'`/`'mecha_charge'`
- 多体ターゲット → `jumpCombos` + `style:'snake'`(蛇召喚) など
- 単発高威力 → `bullets` に `weapon:'fireball'` + `aoe:true` でエフェクト流用

### 注意点
- 通常攻撃は変更しない（ユーザの強い要望）
- 必殺技フロート表示は `addFloat(attacker.x, attacker.y - 60, '⚡ 技名 ⚡', 'color', true)` の形式
- 全キャラ実装完了後にこの「現在進行中」セクションを削除する

---

## 概要

家族向けの3ゲーム入りWeb arcade。GitHub Pagesで公開。

- 本番URL: https://shintaro101-tech.github.io/horikawa-game-center/
- リポジトリ: `Shintaro101-tech/horikawa-game-center`（main ブランチ = 本番）

### ディレクトリ構成

```
堀川家のゲームセンター/
├── index.html             ← ポータル（3ゲームのカード + 訪問者カウンター）
├── deep-sea/              ← 🛥 深海大冒険（Phaser 3）
│   ├── index.html
│   ├── css/style.css
│   └── js/game.js
├── kanji-race/            ← ⚔️ 漢字侍 聖剣伝説（Three.js r128）
│   ├── index.html
│   └── css/style.css
├── samurai-wars/          ← 🏯 過去・未来大戦争（Canvas 2D タワーディフェンス）
│   └── index.html         ← 単一ファイル、~3500行
├── Handoff.md             ← このファイル（唯一の引き継ぎドキュメント）
└── README.md
```

---

## ホーム画面（`index.html`）

- 3ゲームカード（深海大冒険 / 漢字侍 聖剣伝説 / 過去・未来大戦争）
- フッター下に **訪問者カウンター**（控えめなシアン、ラベル `TOTAL VISITORS`）
  - サービス: `counterapi.dev`（無料・登録不要）
  - namespace: `horikawa-arcade` / counter key: `home`
  - エンドポイント: `https://api.counterapi.dev/v1/horikawa-arcade/home/up`（増加）／末尾 `/`（取得のみ）
  - 同一セッション中の重複カウントは `sessionStorage['horikawa-arcade-hit']` で抑制
  - API失敗時は要素ごと `remove()` するので、サービス障害時もページは正常表示
  - **リセットしたい場合**: counter key を `home2` などに変えれば実質ゼロから再スタート可能

---

## 各ゲームの現状

### 🛥 深海大冒険 (`deep-sea/`)
- Phaser 3 横スクロールシューティング
- 4ワールド × 5ステージ、Lv1〜8 進化、特殊武器、ボス戦、ボーナスステージ
- すべてキャンバス描画（Phaser のText）。**HTMLには漢字なし**（ひらがなのみ）
- 漢字へのふりがな対応はキャンバスに二段テキストを描画する必要があり、未実施

### ⚔️ 漢字侍 聖剣伝説 (`kanji-race/index.html`)
- 旧 KANJI侍RACING を物語性ありにリブランド
- Three.js でサイバー侍がバイクを駆る漢字学習レース
- 1年生／2年生／エンドレス／復習＋ボス戦＋御札ビジュアル＋精霊解放エフェクト＋精霊図鑑
- **すべてのUI HTML文字列にふりがな済**（コミット e78202a）

### 🏯 過去・未来大戦争 (`samurai-wars/index.html`)
にゃんこ大戦争 inspire の単一HTMLタワーディフェンス。最も活発に開発中。

主要システム:
- **戦士**: 24体（侍8 + ロボ7 + 妖怪3 + 魔法3 + その他3）+ ガチャ秘伝3体
  - 開始6体: ashigaru, bushi, yumi, miko, ninja, robo_basic
  - SAMURAI_DATA は `CHARACTER_ORDER` でソート（左→右上→下の順にアンロックされる）
- **時代（編）構造**: 5編 × 各18ステージ予定（`ERA_DATA`）
  - 超過去編 / 過去編 / 現代編 / 未来編 / 超未来編
  - 現状 **過去編 + 超過去編が available**、現代/未来/超未来は COMING SOON
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
- **18ステージ × 2編 = 36ステージ実装済**（過去 1-18 / 超過去 101-118）+ ステージ別解放（`STAGE_UNLOCKS`）
- **ステージごとのボス** (`STAGE_BOSSES`) — 敵城HP **1/3以下** で1度だけ出現
  - 一つ目小僧 / 河童 / ろくろ首 / 猫又 / 鬼 / 雪女 / 雷獣 / 鬼火 / 白狐 / 九尾の狐 / 八岐大蛇 / 蜘蛛の精 / ゴジラ / キングギドラ / メカ怪獣 / ロボット鬼 / サイボーグ大蛇 / 天魔王
  - 全員 scale 1.9〜3.4 で巨大、HP・ATK は最後 +50%/+35% のバフ済
- **9テーマの背景** (`STAGE_THEMES`): 草原 / 雪山 / 川辺 / 海岸 / 城下町 / 修羅界 / 魔界 / 黄泉 / 未来都市
  - 天候: 海岸/川辺=雨、修羅界=灰、未来都市=ネオン雨
  - 修羅界の赤いチラつきは静的フォグ＋脈動グローに置き換え済
- **自城4段階レベル** — クリア数で進化（木造→石造→大城→サイバー）。龍神レーザー砲を搭載
- **龍神レーザー砲**: 30秒チャージ → ボタンタップ → **1秒タメ** → 1.6秒の派手な発射（ビーム＋稲妻＋火花）
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
- `SAMURAI_DATA` — 戦士定義
- `ENEMY_DATA` — 雑魚定義（5種）
- `STAGE_DATA` — 18ステージのスポーン定義
- `STAGE_BOSSES` — 18ボス定義
- `STAGE_THEMES` — 9テーマ
- `STAGE_UNLOCKS` — ステージ→キャラID
- `CHARACTER_ORDER` — 表示順
- `WALLET_LEVELS` — 8段階（max が次レベルcost > を保証）
- `ACHIEVEMENTS` — 13勲章

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

### 2026-05-02
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
