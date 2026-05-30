# Portfolio

自分の研究・制作物・学習ログをまとめる多言語ポートフォリオサイトです。トップページだけでなく、星空シミュレーション、音楽プレイリスト、ミニゲームを実際に操作できるようにしています。

- GitHub: https://github.com/Mr-Sakasu/portfolio
- 公開URL: https://portfolio-five-blond-32.vercel.app
- 種別: ポートフォリオサイト、インタラクティブ UI、静的サイト

## 作成物の説明

Astro を使い、研究活動、開発プロジェクト、趣味要素を 1 つのサイトにまとめました。Timeline、Star Watch、Playlist、Bandit Lab などを個別ページとトップページの両方で見せられる構成にしています。

## 担当した役割

- サイト設計、UI 実装、レスポンシブ対応を担当
- Astro のルーティングと多言語表示の実装を担当
- Star Watch の空の描画、Playlist の静的 JSON 生成、Bandit Lab のインタラクションを実装
- GitHub Pages/Vercel 向けの静的ビルド前提で、認証情報を含めないデータ更新フローを整備

## 直面した課題と解決方法

- 星空の描画では、画面サイズ変更やテーマ切り替えでレイアウトが崩れやすかったため、Canvas の再初期化と描画状態の分離で安定化しました。
- Playlist では OAuth トークンや client secret を公開しない必要があったため、取得処理をローカルスクリプトに分離し、公開物には生成済み JSON だけを含める構成にしました。
- セクションごとに UI の密度が変わりすぎる問題に対して、見出しサイズ、余白、区切り線、カード使用量を揃えました。

## 技術情報

- Astro 5
- Tailwind CSS
- TypeScript / JavaScript
- `astronomy-engine` による天体位置計算
- YouTube Music / YouTube Data API 用の Python 更新スクリプト
- 静的 JSON を使ったプレイリスト表示

## 関連リポジトリ・研究URL

- 競技プログラミング: https://github.com/Mr-Sakasu/abc
- THU Auto Login: https://github.com/Mr-Sakasu/THU-auto-login
- EEG/fNIRS emotion recognition: https://github.com/Mr-Sakasu/gnn-cl
- CLISA paper: https://arxiv.org/abs/2109.09559
- FACED paper: https://www.nature.com/articles/s41597-023-02650-w
- SEED dataset: https://bcmi.sjtu.edu.cn/home/seed/

## Commands

```bash
npm install
npm run dev
npm run build
```
