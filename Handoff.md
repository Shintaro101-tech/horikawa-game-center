# Handoff — 次セッション引き継ぎメモ

このファイルは「直近のセッションで何をしたか／次に作業する人（＝次のClaudeセッション）が最初に知るべきこと」を記録するための軽量メモ。
プロジェクト全体の構造・ゲーム仕様などの重い情報は `PROJECT_STATUS.md` を参照すること。

---

## 🚨 絶対ルール（次セッションのClaudeへ）

**変更を加えたら、必ずこの `Handoff.md` も同じコミットで更新すること。**

- 新機能を追加した／設定を変えた／既知バグを直した → 「直近の作業ログ」に1〜2行追記
- 仕様や運用ルールが変わった → 「現在の状態」セクションを書き換え
- 新たな保留事項・注意点が出た → 「未解決・要注意」に追記
- 大きめの構造変更を入れたら `PROJECT_STATUS.md` 側も併せて更新

ユーザーから明示の指示がなくてもこのルールは適用する。コミットを切るたびに「Handoff.md は最新か？」と自問する。

---

## 現在の状態（最終更新: 2026-05-02）

### 公開URL
- 本番: https://shintaro101-tech.github.io/horikawa-game-center/
- リポジトリ: `Shintaro101-tech/horikawa-game-center`（main = 本番、push で自動デプロイ）

### ホーム（`index.html`）
- 3ゲームカード（深海大冒険 / 漢字侍 聖剣伝説 / 過去・未来大戦争）
- フッター下に **訪問者カウンター**（控えめなシアン、ラベル `TOTAL VISITORS`）
  - サービス: `counterapi.dev`（無料・登録不要）
  - namespace: `horikawa-arcade` / counter key: `home`
  - エンドポイント: `https://api.counterapi.dev/v1/horikawa-arcade/home/up`（増加）／末尾 `/`（取得のみ）
  - 同一セッション中の重複カウントは `sessionStorage['horikawa-arcade-hit']` で抑制
  - API失敗時は要素ごと `remove()` するので、サービス障害時もページは正常表示
  - **リセットしたい場合**: counter key を `home2` などに変えれば実質ゼロから再スタート可能

### 各ゲームの状態
詳細は `PROJECT_STATUS.md` 参照。直近で大きな変更は入っていない。

---

## 直近の作業ログ（新しい順）

### 2026-05-02
- ホーム画面フッター下に訪問者カウンターを追加（commit `50ffc40`）
  - counterapi.dev の `horikawa-arcade/home` を使用
  - sessionStorage で同一セッションの重複カウント抑制、失敗時は静かに非表示
- カウンターのラベルを `のべ訪問者数` → `TOTAL VISITORS` に変更（commit `d39f381`）
  - サブタイトル `THE HORIKAWA FAMILY ARCADE` と揃えて世界観を統一
- この `Handoff.md` を新規作成

---

## 未解決・要注意

- **counterapi.dev の信頼性**: 無料サービスのため恒久保証はなし。長期で不安なら GoatCounter（要登録）や自前 Cloudflare Worker への移行を検討。今は失敗時フォールバック（要素削除）で十分。
- **訪問者カウントの初期値**: 動作確認のテストヒットが数件入っている。気になるならカウンターキーを差し替える。
- `PROJECT_STATUS.md` の「既知の保留事項」も併せて確認（深海ゲームの furigana 対応など）。

---

## 引き継ぎ時の最初のチェックリスト

1. このファイル（`Handoff.md`）を読む
2. `git log --oneline -10` で最新コミットを確認
3. 必要なら `PROJECT_STATUS.md` で全体仕様を復習
4. 作業 → コミット & push（GitHub Pages 自動反映）
5. **このファイルを更新してから** コミットを締める
