<p align="center">
  <a href="https://konocomics.vercel.app">
    <img src="./docs/assets/readme/konocomics-hero.webp" alt="konocomics を開く — Manga DNA とおすすめ理由の画面" width="1600" />
  </a>
</p>

<h1 align="center">konocomics</h1>

<p align="center"><strong>好みを知る。次のマンガを、理由とともに見つける。</strong></p>

<p align="center">
  好きなマンガから17軸の Manga DNA をつくり、理由のあるおすすめを返すローカルファーストのWebアプリです。
</p>

<p align="center">
  <a href="https://konocomics.vercel.app"><strong>アプリを開く</strong></a>
  · <a href="#仕組み">仕組み</a>
  · <a href="#ローカルで動かす">ローカルで動かす</a>
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.ko.md">한국어</a> · <strong>日本語</strong>
</p>

<p align="center"><sub><strong>kono</strong> + <strong>mi</strong> = konomi（好み）。名前の中に、プロダクトの主題が隠れています。</sub></p>

## konocomics ならではの特徴

### ジャンルの先まで見る

Manga DNA は、物語、テンポ、関係性、トーン、精神的な重さ、作画傾向を**17の観測軸**で表します。

### 根拠までたどれる理由

おすすめ文はすべて、スコアリングエンジンが返したファクター寄与度から生成します。実行時の LLM が順位を決めたり、理由を書いたりすることはありません。

### はじめからローカル

プロフィール、読書記録、フィードバック、設定は **IndexedDB** に保存します。アカウントも、サーバー側のプロダクトDBもありません。

## 仕組み

1. **好きなマンガを5〜10作品選びます。** 必要なら、合わなかった作品や途中でやめた作品を理由とともに3作品まで追加できます。
2. **Manga DNA を確認し、調整します。** 強く表れた好み、その根拠となった作品、各ファクターをおすすめへどう反映するかを確認できます。
3. **順位が付いた10作品を見ていきます。** おすすめ理由を開き、ライブラリへ保存するか、合わなかった点をエンジンへ伝えます。

プロダクトのUIは現在、日本語です。README は英語、韓国語、日本語で読めます。

## おすすめエンジンの契約

順位のルールは、隠れたヒューリスティックではなく明示したプロダクト契約です。

- **不明は苦手ではありません。** `unknown` のファクターを苦手として計算しません。カバレッジの低いグループだけを中立値 `0.5` へ縮約し、余った重みをほかのグループへ再配分しません。
- **複数の好みを分けて保ちます。** Best Positive Anchor により、好きな作品すべてを一つの平均ベクトルへ押し込みません。
- **好みが順位を決めます。** 固定したファクターグループの重みで好みとの適合度を求め、市場シグナルは近いスコアの同順位調整にだけ使います。
- **理由は根拠からだけつくります。** 説明と注意点は、選ばれた作品の寄与度台帳と根拠作品だけから組み立てます。
- **同じ入力には同じ結果を返します。** おすすめと説明のコードは純粋かつ決定論的です。ドメイン層では、時刻、乱数、I/O、実行時のモデル呼び出しを使いません。

ファクター語彙は **Genre 10種、Theme 22種、Axis 17種**。各値は `known`、`unknown`、`notApplicable` を区別します。

## Catalog とアーキテクチャ

現在生成される Catalog は **1,614作品**です。内訳は、おすすめ対象が **1,441作品**、Library 専用が **173作品**です。適格性を分けることで、Library にあるだけの作品が検証なしに好みの分析へ入ることを防ぎます。

```text
data/source/catalog.sqlite → 検証 → 静的 JSON → ブラウザ
ブラウザの IndexedDB → プロフィール、Library、フィードバック、設定
Rakuten Books API → /api/rakuten/search | /api/rakuten/item → ブラウザ
```

追跡対象の SQLite Catalog は**ビルド時の権限ソース**であり、ユーザーデータを置く実行時DBではありません。個人データはブラウザが持ちます。実行時のサーバー境界は Rakuten Books の検索・作品レスポンスを検証して縮小する2本の route だけで、プロバイダーの認証情報はサーバー内に保ちます。

主な契約文書：

- [製品仕様](./docs/planning/02-product-spec.md)
- [ファクター辞書](./docs/factors/factor-dictionary.md)
- [アーキテクチャ](./docs/planning/05-architecture.md)
- [Catalog authoring の権限](./docs/planning/09-catalog-authoring-authority.md)
- [UX画面契約](./docs/planning/03-ux-screen-contracts.md)

## ローカルで動かす

**Node.js 24** と **pnpm 10** が必要です。

```bash
pnpm install
pnpm dev
```

同梱 Catalog、Manga DNA、おすすめ、ローカル Library は、リモートDBなしで動きます。Rakuten の検索と作品取得を有効にするには、`.env.example` を `.env.local` へコピーし、記載されているサーバー専用の値を設定してください。

### 品質ゲート

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm catalog:authority:verify
pnpm catalog:validate
```

## 技術スタック

TanStack Start · TanStack Router · React 19 · TypeScript · Tailwind CSS 4 · Base UI · Motion · Dexie · Zod · Fuse.js · Vitest · Playwright
