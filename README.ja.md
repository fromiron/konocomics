<p align="center">
  <a href="https://konocomics.vercel.app">
    <img src="./docs/assets/readme/banner.webp" alt="konocomics — 好みから見つける、次のマンガ。" width="100%" />
  </a>
</p>

<p align="center">
  <strong>好みを知って、次の一冊を理由とともに。</strong><br />
  好きなマンガから17軸の <em>Manga DNA</em> をつくり、おすすめの理由まで示すローカルファーストの Web アプリです。
</p>

<p align="center">
  <a href="https://konocomics.vercel.app"><img alt="アプリを開く" src="https://img.shields.io/badge/%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E9%96%8B%E3%81%8F-konocomics.vercel.app-DCA55E?style=for-the-badge&labelColor=0B1018" /></a>
</p>

<p align="center">
  <img alt="TanStack Start" src="https://img.shields.io/badge/TanStack_Start-0B1018?style=flat-square&logo=reactquery&logoColor=DCA55E" />
  <img alt="React 19" src="https://img.shields.io/badge/React_19-0B1018?style=flat-square&logo=react&logoColor=DCA55E" />
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript_strict-0B1018?style=flat-square&logo=typescript&logoColor=DCA55E" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS_4-0B1018?style=flat-square&logo=tailwindcss&logoColor=DCA55E" />
  <img alt="Local-first IndexedDB" src="https://img.shields.io/badge/Local--first-IndexedDB-0B1018?style=flat-square&labelColor=0B1018&color=1B232D" />
  <img alt="Node 24" src="https://img.shields.io/badge/Node-24-0B1018?style=flat-square&logo=nodedotjs&logoColor=DCA55E" />
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.ko.md">한국어</a> · <strong>日本語</strong>
  <br />
  <a href="#仕組み">仕組み</a> ·
  <a href="#おすすめエンジン">エンジン</a> ·
  <a href="#アーキテクチャ">アーキテクチャ</a> ·
  <a href="#ローカルで動かす">ローカルで動かす</a>
</p>

<br />

<p align="center">
  <img src="./docs/assets/readme/showcase.webp" alt="デスクトップの Manga DNA とモバイルのおすすめ画面" width="100%" />
</p>

> [!NOTE]
> <strong>kono</strong> + <strong>mi</strong> = このみ（好み）。名前の中にプロダクトのテーマが隠れています。

## konocomics ならではの特徴

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>🧬 ジャンルの先まで見る</h3>
      Manga DNA は物語、テンポ、関係性、雰囲気、心の負担を<strong>17の観察軸</strong>で読み取ります。表示は点数ではなく段階だけです。
    </td>
    <td width="33%" valign="top">
      <h3>🔎 根拠までたどれる理由</h3>
      おすすめの文章はすべて、スコアエンジンが返すファクター寄与度からだけつくります。実行時の LLM が順位を決めたり理由を書いたりはしません。
    </td>
    <td width="33%" valign="top">
      <h3>🔒 はじめからローカル</h3>
      プロフィール、読書記録、フィードバック、設定はブラウザの <strong>IndexedDB</strong> にだけ保存します。アカウントもサーバー側のDBもありません。
    </td>
  </tr>
</table>

## 仕組み

```mermaid
flowchart LR
    A["📚 好きなマンガを<br/>5〜10作品選ぶ"] --> B["🙅 任意：合わなかった<br/>作品を3つまで＋理由"]
    B --> C["🧬 Manga DNA<br/>17軸 · 0〜4段階"]
    C --> D["✨ おすすめ10作品<br/>それぞれに理由"]
    D -- "読んだ · 保存 · 興味なし" --> C

    classDef accent fill:#DCA55E,stroke:#DCA55E,color:#2B1F12,font-weight:bold
    classDef base fill:#1B232D,stroke:#3A4450,color:#E6EAF0
    class A,B base
    class C,D accent
```

<table>
  <tr>
    <td width="33%" align="center"><img src="./docs/assets/readme/step-1-pick.webp" alt="ステップ1：好きなマンガを選ぶ" /></td>
    <td width="33%" align="center"><img src="./docs/assets/readme/step-2-dna.webp" alt="ステップ2：Manga DNA を見る" /></td>
    <td width="33%" align="center"><img src="./docs/assets/readme/step-3-recommendations.webp" alt="ステップ3：おすすめを見る" /></td>
  </tr>
  <tr>
    <td valign="top"><strong>1 · 選ぶ</strong><br />検索するか棚から選びます。☆で「大好き」にすると、より強く反映されます。</td>
    <td valign="top"><strong>2 · DNA を読む</strong><br />強く表れた好み、その根拠になった作品、各ファクターが順位にどう効くかを確かめます。</td>
    <td valign="top"><strong>3 · 探す</strong><br />理由を開き、気分やジャンルで絞り込み、ライブラリに保存するか、合わなかった点をエンジンに伝えます。</td>
  </tr>
</table>

<details>
<summary><strong>DNA をリンクで共有する</strong></summary>
<br />
<img src="./docs/assets/readme/share-link.webp" alt="Manga DNA の共有ダイアログ" width="100%" />

共有ページは完全に静的です。DNA の段階、選んだ作品、おすすめ作品は URL クエリに入り、サーバーには何も保存しません。
</details>

## おすすめエンジン

順位のルールは、隠れたヒューリスティックではなく明示したプロダクト契約です。[製品仕様 §6](./docs/planning/02-product-spec.md) が唯一の正です。

```mermaid
flowchart TB
    subgraph INP["① 入力"]
      direction LR
      L["好き・大好きな作品"]:::base
      N["合わなかった作品＋理由"]:::base
      P["ポリシー · 気分 · フィードバック"]:::base
      L ~~~ N ~~~ P
    end
    subgraph SCORE["② 好みスコア"]
      direction LR
      F["読んだ · 非表示 ·<br/>対象外の作品を除外"]:::base --> S["グループ別の類似度<br/>Genre · Theme · Narrative · Tone · Art"]:::accent
      S --> C["カバレッジ不足 → 0.5へ縮約<br/><i>重みは再配分しない</i>"]:::base
      C --> A["Best Positive Anchor<br/>+ consensus bonus"]:::accent
      A --> J["明示的な補正<br/>理由別の減点"]:::base
    end
    subgraph OUT["③ 出力"]
      direction LR
      R["僅差 →<br/>市場シグナルで順位調整"]:::base --> T["上位10作品<br/>＋寄与度台帳"]:::accent
      T --> E["理由 · 注意点<br/>台帳からだけ生成"]:::accent
    end
    INP --> SCORE --> OUT

    classDef accent fill:#DCA55E,stroke:#DCA55E,color:#2B1F12,font-weight:bold
    classDef base fill:#1B232D,stroke:#3A4450,color:#E6EAF0
    style INP fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
    style SCORE fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
    style OUT fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
```

- **不明は苦手ではありません。** `unknown` のファクターを苦手として計算しません。カバレッジの低いグループだけを中立値 `0.5` へ縮約し、余った重みをほかのグループへ再配分しません。
- **複数の好みを分けて保ちます。** Best Positive Anchor により、好きな作品すべてを一つの平均ベクトルへ押し込みません。
- **好みが順位を決めます。** 固定したファクターグループの重みで適合度を求め、市場シグナルは近いスコアの順位調整にだけ使います。
- **理由は根拠からだけつくります。** 説明と注意点は、選ばれた作品の寄与度台帳と根拠作品だけから組み立てます。
- **同じ入力には同じ結果を返します。** ドメイン層は純粋かつ決定論的で、時刻、乱数、I/O、実行時のモデル呼び出しを使いません。

### ファクター語彙

| グループ               | 数  | 例                                                         |
| ---------------------- | :-: | ---------------------------------------------------------- |
| Genre                  | 10  | アクション、ファンタジー、ミステリー、恋愛 …               |
| Theme / Mechanic       | 22  | 捜査・調査、疑似家族、サバイバル …                         |
| Narrative 軸           |  6  | 成長・報酬、戦略、テンポ、謎解き・伏線、世界観 …           |
| Tone / Relationship 軸 |  7  | 人物の変化、コメディ、ダークさ、精神的な重さ、あたたかさ … |
| Art 軸                 |  4  | リアル寄り、描き込み、やわらかさ、迫力・スピード感         |

各値は `known`、`unknown`、`notApplicable` を区別します。定義は[ファクター辞書](./docs/factors/factor-dictionary.md)にあります。

## アーキテクチャ

```mermaid
flowchart LR
    subgraph BUILD["🛠 ビルド時"]
      direction TB
      DB[("catalog.sqlite<br/>追跡対象の権限ソース")]:::base --> V["検証"]:::base --> J["静的 JSON"]:::accent
    end
    subgraph BROWSER["🌐 あなたのブラウザ"]
      direction TB
      UI["TanStack Start アプリ"]:::accent
      DOM["純粋なドメインエンジン<br/>DNA · 順位 · 理由"]:::accent
      IDB[("IndexedDB<br/>プロフィール · ライブラリ · フィードバック")]:::base
      UI <--> DOM
      UI <--> IDB
    end
    SRV["☁️ サーバー route<br/>/api/rakuten/search<br/>/api/rakuten/item"]:::base
    RK["Rakuten Books API"]:::base
    BUILD --> BROWSER
    UI -- "表紙 · 書誌" --> SRV --> RK

    classDef accent fill:#DCA55E,stroke:#DCA55E,color:#2B1F12,font-weight:bold
    classDef base fill:#1B232D,stroke:#3A4450,color:#E6EAF0
    style BUILD fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
    style BROWSER fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
```

- 追跡対象の SQLite Catalog は**ビルド時の権限ソース**で、ユーザーデータを置く実行時DBではありません。
- 個人データはすべてブラウザが持ちます。
- サーバーコードは Rakuten Books のレスポンス（表紙・書誌）を検証して縮小する2本の route だけで、認証情報はサーバー内に保ちます。

現在生成される Catalog は **3,309作品**です。おすすめ対象が **2,495作品**、Library 専用が **814作品**です。適格性を分けることで、Library にあるだけの作品が検証なしに好みの分析へ入ることを防ぎます。

<details>
<summary><strong>主な契約文書</strong></summary>

- [製品仕様](./docs/planning/02-product-spec.md)
- [ファクター辞書](./docs/factors/factor-dictionary.md)
- [アーキテクチャ](./docs/planning/05-architecture.md)
- [Catalog authoring の権限](./docs/planning/09-catalog-authoring-authority.md)
- [UX画面契約](./docs/planning/03-ux-screen-contracts.md)

</details>

## ローカルで動かす

**Node.js 24** と **pnpm 10** が必要です。

```bash
pnpm install
pnpm dev
```

同梱 Catalog、Manga DNA、おすすめ、ローカル Library は、リモートDBなしで動きます。Rakuten の検索・作品取得・表紙画像を有効にするには、`.env.example` を `.env.local` へコピーし、サーバー専用の値を設定してください。

<details>
<summary><strong>品質ゲート</strong></summary>

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm catalog:authority:verify
pnpm catalog:validate
```

</details>

## 技術スタック

TanStack Start · TanStack Router · React 19 · TypeScript · Tailwind CSS 4 · Base UI · Motion · Dexie · Zod · Fuse.js · Vitest · Playwright

<br />

<p align="center">
  <sub>表紙画像と書誌情報は<a href="https://books.rakuten.co.jp/">楽天ブックス</a> API から提供されています。</sub>
</p>
