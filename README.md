# Portfolio

研究、制作物、学習ログ、趣味要素をまとめた多言語ポートフォリオサイトです。Astro で静的に生成しつつ、星空シミュレーション、YouTube Music プレイリスト、ミニゲームなどの操作できるコンテンツも載せています。

- リポジトリ: <https://github.com/Mr-Sakasu/portfolio>
- 公開 URL: <https://portfolio-five-blond-32.vercel.app>
- 種別: 多言語ポートフォリオ / インタラクティブ静的サイト

## 主な機能

- **多言語ページ**: English, Chinese, Japanese の 3 言語に対応
- **Timeline**: 研究、資格、コンテスト、ロボコンなどの活動履歴を表示
- **Skill Stack**: 使用技術と関連ツールをコンパクトに整理
- **Star Watch**: 東京の夜空を Canvas で描画し、天体位置や観測条件を確認
- **Playlist**: ローカルスクリプトで生成した静的 JSON から YouTube Music プレイリストを表示
- **Bandit Lab**: 多腕バンディット問題を試せる小さなインタラクティブデモ

## 実装で意識したこと

- トップページだけでなく、各コンテンツを個別ページとしても見られる構成にしました。
- UI の密度がセクションごとにばらつかないよう、見出し、余白、区切り線、カード表現を揃えました。
- 星空描画は Canvas の描画状態と UI 状態を分け、画面サイズ変更やテーマ切り替えでも崩れにくいようにしています。
- プレイリストは認証情報を公開ビルドに含めないため、API 取得処理をローカルスクリプトに分離しています。

## 技術スタック

- Astro 5
- TypeScript / JavaScript
- Tailwind CSS
- `astronomy-engine`
- YouTube Music / YouTube Data API
- Python によるプレイリストデータ生成

## 開発

```bash
npm install
npm run dev
```

本番ビルドとプレビューは次のコマンドで確認します。

```bash
npm run build
npm run preview
```

## プレイリストデータの更新

プレイリストデータはローカルで生成し、静的 JSON として公開ビルドに含めます。API credential や OAuth token は公開物に含めません。

```bash
npm run playlist:auth
npm run playlist:update
```

公開サイトが参照するのは `src/data/` 以下の生成済みデータだけです。

## ディレクトリ構成

```text
src/
  components/   再利用する Astro コンポーネント
  data/         Timeline、projects、skills、生成済みプレイリストデータ
  i18n/         各言語の UI テキスト
  layouts/      共通レイアウト
  pages/        多言語ルーティングと個別ページ
public/         静的画像とアイコン
scripts/        YouTube Music データ更新用スクリプト
```

## 関連リンク

- 競技プログラミング: <https://github.com/Mr-Sakasu/abc>
- THU Auto Login: <https://github.com/Mr-Sakasu/THU-auto-login>
