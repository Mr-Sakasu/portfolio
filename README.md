# Portfolio

研究、制作物、学習ログ、趣味要素をまとめた多言語ポートフォリオサイトです。Astro で静的に生成しつつ、星空シミュレーション、YouTube Music プレイリスト、ミニゲームなどの操作できるコンテンツも載せています。

- リポジトリ: <https://github.com/Mr-Sakasu/portfolio>
- 公開 URL: <https://portfolio-five-blond-32.vercel.app>
- 種別: 多言語ポートフォリオ / インタラクティブ静的サイト

## レイアウト・配色・背景の設定

`src/config/appearance.ts` の `siteAppearance` で、それぞれ独立して設定します。変更後は再ビルドしてください。訪問者用の切替メニューや URL パラメーターによる上書きはありません。明暗テーマの切替は従来どおりです。

```ts
export const siteAppearance: SiteAppearance = {
  homeLayout: 'journal', // 'journal': 余白と区切り線 / 'bento': カードのグリッド
  palette: 'autumn',     // 'autumn': 茶・琥珀・生成り / 'summer': 青・水色
  background: 'autumn',  // 'autumn': 紅葉・銀杏 / 'fireworks': 花火 / 'none': 静止背景
  intro: true,          // 初回演出。background が none の場合は実行しない
};
```

たとえば `homeLayout: 'bento'` だけを変えると、秋の配色・紅葉の背景を保ったままカード表示になります。`background: 'fireworks'` だけを変えると、縦並びのレイアウト・秋の配色のまま花火になります。夏の組み合わせは `bento / summer / fireworks` です。

- レイアウト: `src/features/home/HomeJournal.astro` / `HomeBento.astro`。制作物・曲・スキル・活動履歴は共通のデータを参照します。
- 配色: `src/styles/tokens.css`（秋の基本色）、`src/styles/palettes/summer.css`（夏）、`src/styles/seasonal-ui.css`（秋の操作部品）。写真・ロゴ・天体やグラフのデータ色は保持します。
- 背景: `src/components/chrome/background-scenes.ts` の登録表から選択。レイアウトへの依存はありません。
- 端末の「視差効果を減らす」設定では背景を静止表示し、初回演出を省略します。
- `summer-fireworks` ブランチには元の夏版（`ea4d819`）を保存しています。`autumn` ブランチで秋版を開発しています。

## 主な機能

- **多言語ページ**: English, Chinese, Japanese の 3 言語に対応
- **Timeline**: 研究、資格、コンテスト、ロボコンなどの活動履歴を、使用技術のタグ付きで表示
- **Skill Stack**: 使用技術と関連ツールを、ドラッグで回せる 3D リングに並べて表示（JS なしでは通常のグリッド）
- **Star Watch**: 東京の夜空を Canvas で描画し、天体位置や観測条件を確認
- **Playlist**: ローカルスクリプトで生成した静的 JSON から YouTube Music プレイリストを表示
- **Bandit Lab**: 多腕バンディット問題を試せる小さなインタラクティブデモ
- **Projects**: 制作物カードにデモ動画プレビューを表示

## 実装で意識したこと

- トップページだけでなく、各コンテンツを個別ページとしても見られる構成にしました。
- UI の密度がセクションごとにばらつかないよう、見出し、余白、区切り線、カード表現を揃えました。
- 星空描画は Canvas の描画状態と UI 状態を分け、画面サイズ変更やテーマ切り替えでも崩れにくいようにしています。
- プレイリストは認証情報を公開ビルドに含めないため、API 取得処理をローカルスクリプトに分離しています。

## Project デモ動画

- Typing Game: `/videos/projects/type-game-demo.mp4`（音声なし軽量MP4、posterあり）
- AI Commerce Agent: `/videos/projects/jd-global-demo.mp4`（音声なし軽量MP4、posterあり）

## 技術スタック

- Astro 7
- TypeScript / JavaScript
- Tailwind CSS 3（PostCSS 経由）
- `astronomy-engine`
- YouTube Music / YouTube Data API
- Python によるプレイリストデータ生成

## 開発

Node.js 24 LTS を推奨します（`.nvmrc` は 24.21.0）。Astro 7 の実行には Node.js 22.12 以上が必要です。nvm を使う場合は、初回に `nvm install`、以降は `nvm use` で切り替えてください。Vercel のビルド環境も Node.js 24.x に揃えます。

```bash
nvm use
npm ci
npm run dev
```

本番ビルドとプレビューは次のコマンドで確認します。

```bash
npm run build
npm run preview
```

ブラウザー互換性データの更新警告が出た場合は、次のコマンドで依存関係とロックファイルを更新します。

```bash
npm install -D baseline-browser-mapping@latest
npx update-browserslist-db@latest
```

## プレイリストデータの更新

プレイリストデータはローカルで生成し、静的 JSON として公開ビルドに含めます。API credential や OAuth token は公開物に含めません。

```bash
npm run playlist:auth
npm run playlist:update
```

公開サイトは `src/data/` 以下の静的データを参照し、表示時にプレイリスト取得用の API へアクセスしません。

英語のプレイリストページは、曲をアーティスト別の折り畳み欄にまとめます。表示名・既知のカバー曲の分類は `src/features/playlist/artists.ts` で管理し、曲数のグラフと各欄に同じ分類を使います。

サイトに追加で載せる曲は `src/data/playlist-additions.ts` にプレイリスト ID ごとに指定できます。動画 ID が生成済みデータと重複する場合は表示情報を上書きし、重複しない曲だけを追加します。この設定はデータの再取得後も残り、YouTube 側のプレイリストには変更を加えません。

## OGP 画像の更新

リンクプレビュー用の `public/og.png` は `public/scenes/profile.webp` から生成しています。絵を差し替えたら再生成してください。

```bash
node scripts/cards/render-og-image.mjs
```

## SEO まわり

- `astro.config.mjs` の `site` を基準に canonical / hreflang / OGP の絶対 URL を出力
- `src/pages/sitemap.xml.ts` が全ページ分の sitemap を生成（`public/robots.txt` から参照）

## ディレクトリ構成

```text
src/
  components/
    chrome/      共通ヘッダー、フッター、背景、イントロ、BGM、言語切替
    shared/      Timeline と Skill Stack のような再利用表示コンポーネント
  features/      home / stars / scenes / bandit / playlist の機能単位の実装
  data/
    generated/   スクリプトが生成するプレイリスト JSON
  i18n/         各言語の UI テキスト、Locale 型、ルート用ヘルパー
  layouts/      ドキュメントシェルと共通テーマ
  pages/         薄い多言語ルートラッパー
public/         静的画像とアイコン
scripts/
  playlist/      YouTube Music データ更新用スクリプト
```

## 関連リンク

- 競技プログラミング: <https://github.com/Mr-Sakasu/abc>
- THU Auto Login: <https://github.com/Mr-Sakasu/THU-auto-login>
