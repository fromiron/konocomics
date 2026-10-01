import type { ExplanationFactorId, ExplanationLexicon } from "@/domain/explanation";

const explanationFactorLabels = {
  action: "アクション",
  fantasy: "ファンタジー",
  historical: "歴史もの",
  scienceFiction: "SF",
  mystery: "ミステリー",
  sports: "スポーツ",
  comedy: "ギャグ・コメディ",
  horror: "ホラー",
  sliceOfLife: "日常",
  romance: "恋愛要素",
  adventure: "冒険",
  combat: "戦闘",
  martialArts: "武術",
  war: "戦争",
  politics: "政治",
  survival: "サバイバル",
  investigation: "捜査・調査",
  dungeon: "ダンジョン攻略",
  crafting: "ものづくり",
  cooking: "料理",
  territoryManagement: "領地運営",
  tournament: "大会・トーナメント",
  revenge: "復讐",
  timeTravel: "タイムトラベル",
  reincarnation: "転生",
  school: "学園",
  workplace: "仕事・職場",
  sportsCompetition: "スポーツ競技",
  foundFamily: "仲間との家族的な絆",
  historicalReconstruction: "歴史再現",
  postApocalypse: "終末世界",
  exploration: "探索",
  progression: "成長・報酬の積み重ね",
  problemSolving: "頭脳で解決する話",
  strategy: "戦略的な展開",
  pacing: "テンポの速さ",
  mysteryReveal: "謎解き・伏線",
  worldBuilding: "世界観の作り込み",
  characterArcWeight: "人物の変化・ドラマ",
  relationshipStructure: "群像劇・関係の広がり",
  darkness: "ダークな世界観",
  mentalStress: "精神的な重さ",
  emotionalWarmth: "あたたかさ・癒やし",
  artRealism: "リアル寄りの絵",
  artDensity: "描き込みの密度",
  visualSoftness: "やわらかい絵柄",
  motionImpact: "迫力・スピード感",
} as const satisfies Readonly<Record<ExplanationFactorId, string>>;

const explanationClusterLabels = {
  tacticalThinking: "頭脳で解決する展開",
  relationshipAppeal: "人物の変化と関係性",
  toneLoad: "物語の重さ",
} as const;

const explanationConfidenceLabels = {
  high: "高い",
  normal: "ふつう",
  low: "低め(データ収集中)",
} as const;

const baselineExplanationTemplates = {
  baselineGenreWithAnchor: "『{anchorTitle}』と「{factorLabel}」が共通しています。",
  baselineGenreWithoutAnchor: "「{factorLabel}」のジャンル一致を順位に反映しています。",
  baselineMarketObserved: "第1巻のレビュー情報を順位に反映しています。",
  baselineMaturity: "刊行の蓄積を順位に反映しています。",
} as const;

/** Product copy for recommendation reasons (02 §6.9). */
export const explanationLexicon = {
  factorLabels: explanationFactorLabels,
  clusterLabels: explanationClusterLabels,
  confidenceLabels: explanationConfidenceLabels,
  templates: {
    positiveWithAnchor: "『{anchorTitle}』と「{factorLabel}」の度合いが近い作品です。",
    positiveGenreWithAnchor: "『{anchorTitle}』と同じ「{factorLabel}」の作品です。",
    positiveThemeWithAnchor: "『{anchorTitle}』と同じく「{factorLabel}」が描かれます。",
    positiveRepeatedAnchor: "「{factorLabel}」も『{anchorTitle}』と共通しています。",
    positiveRepeatedAxisWithAnchor: "「{factorLabel}」の度合いも『{anchorTitle}』と近い作品です。",
    positiveWithoutAnchor: "「{factorLabel}」が好みの作品と共通しています。",
    positiveAxisWithoutAnchor: "「{factorLabel}」の度合いが、好みの作品と近いと判定されています。",
    positiveAxisAdjustment: "DNAで好みに設定した「{factorLabel}」がしっかりある作品です。",
    positiveThemeAdjustment: "DNAで好みに設定した「{factorLabel}」が描かれる作品です。",
    positiveLowerAxisAdjustment: "「{factorLabel}」が控えめな点が、DNAで設定した好みに合います。",
    cautionSimilarityWithAnchor: "ただし「{factorLabel}」の傾向は、『{anchorTitle}』と異なります。",
    cautionSimilarityWithoutAnchor: "ただし「{factorLabel}」の傾向は、好みの作品と異なります。",
    ...baselineExplanationTemplates,
  },
} as const satisfies ExplanationLexicon;

/**
 * The reason copy the G2 study and the Taste-vs-Baseline experiment were run with. Research
 * tooling keeps it so reruns reproduce the recorded texts; the product uses `explanationLexicon`.
 */
export const frozenExperimentExplanationLexicon = {
  factorLabels: explanationFactorLabels,
  clusterLabels: explanationClusterLabels,
  confidenceLabels: explanationConfidenceLabels,
  templates: {
    positiveWithAnchor: "『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。",
    positiveGenreWithAnchor: "『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。",
    positiveThemeWithAnchor: "『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。",
    positiveRepeatedAnchor: "『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。",
    positiveRepeatedAxisWithAnchor:
      "『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。",
    positiveWithoutAnchor: "「{factorLabel}」があなたの好みに合う作品です。",
    positiveAxisWithoutAnchor: "「{factorLabel}」があなたの好みに合う作品です。",
    positiveAxisAdjustment: "「{factorLabel}」があなたの好みに合う作品です。",
    positiveThemeAdjustment: "「{factorLabel}」があなたの好みに合う作品です。",
    positiveLowerAxisAdjustment: "「{factorLabel}」が控えめな点が、あなたの好みに合う作品です。",
    cautionSimilarityWithAnchor:
      "ただし「{factorLabel}」は、『{anchorTitle}』で好きだった傾向と少し異なります。",
    cautionSimilarityWithoutAnchor: "ただし「{factorLabel}」は、あなたの好みと少し異なります。",
    ...baselineExplanationTemplates,
  },
} as const satisfies ExplanationLexicon;

const wantToReadScale = [
  { value: 1, label: "まったく読みたくない" },
  { value: 2, label: "あまり読みたくない" },
  { value: 3, label: "どちらともいえない" },
  { value: 4, label: "読みたい" },
  { value: 5, label: "とても読みたい" },
] as const;

const agreementScale = [
  { value: 1, label: "まったく当てはまらない" },
  { value: 2, label: "あまり当てはまらない" },
  { value: 3, label: "どちらともいえない" },
  { value: 4, label: "当てはまる" },
  { value: 5, label: "とても当てはまる" },
] as const;

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const recommendationPolicyLabels = {
  preferCompleted: "完結作を優先",
  preferHidden: "隠れた作品を優先",
  preferVerified: "評価・実績を重視",
  excludeIncomplete: "刊行情報が不明な作品を除外",
} as const;

export const appName = "konocomics";

export const g2HarnessStrings = {
  metadata: {
    title: "ブラインドテスト | konocomics",
    description: "2つのおすすめ一覧を比較するローカル専用ブラインドテストです。",
  },
  entry: {
    eyebrow: "ローカル専用ブラインドテスト",
    title: "おすすめを、説明の前後で比べます。",
    description:
      "2つのおすすめ一覧を見て、作品ごとの印象と、どちらが自分に合うかを回答します。回答途中の内容は保存も送信もされません。",
    choose: "入口を選んでください",
    humanTitle: "参加者として回答する",
    humanDescription: "人によるブラインドテストの結果を作成します。",
    syntheticPilotTitle: "動作確認を行う",
    syntheticPilotDescription:
      "ブラウザから結果ファイルまでの流れを確認します。人の回答としては集計されません。",
  },
  mode: {
    human: "参加者用",
    syntheticPilot: "動作確認用",
  },
  progress: {
    label: "回答の進み具合",
    input: "入力",
    before: "説明前",
    after: "説明後",
    complete: "完了",
  },
  input: {
    title: "テストを始める",
    description: "事前に用意したプロフィールを、このブラウザ内だけで読み込みます。",
    participantIdLabel: "参加者ID",
    participantIdHint:
      "英小文字・数字・ハイフンだけの匿名IDを入力してください。氏名やメールアドレスは入力しないでください。",
    profileLabel: "プロフィールJSON",
    profileHint: "自分の参加者IDと同じ profileId を持つファイルを選んでください。",
    privacy:
      "ファイルと回答は外部へ送信されません。ページを閉じるか再読み込みすると、入力途中の内容は消えます。",
    submit: "おすすめ一覧を作る",
    loading: "おすすめ一覧を準備しています…",
  },
  before: {
    title: "説明を見る前の回答",
    description:
      "リストA・リストBの順位を確認し、重複を除いた各作品について一度だけ回答してください。",
    sharedResponse:
      "両方のリストにある作品も、ここでは1回だけ回答します。次へ進むと回答は変更できません。",
    sharedAnswerRecorded: "この作品の回答は、先に表示されたリストと共有されています。",
    familiarityQuestion: "この作品を知っていましたか？",
    familiarity: {
      read: "読んだことがある",
      knownUnread: "知っているが未読",
      unknown: "知らなかった",
    },
    wantToReadQuestion: "今、この作品を読みたいですか？",
    wantToReadScale,
    preferenceQuestion: "説明を見る前のおすすめ一覧として、どちらが自分に合っていますか？",
    preference: {
      A: "リストA",
      B: "リストB",
      tie: "同じくらい",
    },
    submit: "説明前の回答を確定する",
    incomplete: "すべての質問に回答すると次へ進めます。",
  },
  after: {
    title: "おすすめ理由を見た後の回答",
    description:
      "順位はそのままです。各おすすめ理由を読み、一覧に現れる作品ごとに回答してください。",
    explanationHeading: "おすすめ理由",
    noExplanation: "説明はありません。",
    wantToReadQuestion: "今、この作品を読みたいですか？",
    wantToReadScale,
    agreementQuestion: "このおすすめ理由は、あなたの好みとの関係を正しく説明していますか？",
    agreementScale,
    submit: "最終回答を確定する",
    incomplete: "すべての質問に回答すると最終回答を確定できます。",
  },
  lists: {
    A: "リストA",
    B: "リストB",
    rankSuffix: "位",
    coverUnavailable: "表紙画像なし",
    creatorPrefix: "作者",
  },
  complete: {
    title: "回答が完了しました",
    description:
      "ここで初めて、各リストの作り方を確認できます。結果JSONをダウンロードし、集計担当者へ渡してください。",
    debriefHeading: "リストの内訳",
    taste: "Taste Engine",
    baseline: "Baseline",
    download: "結果JSONをダウンロード",
    downloaded: "結果JSONをダウンロードしました。",
    restart: "最初からやり直す",
  },
  errors: {
    participantId: "参加者IDは、1〜64文字の英小文字・数字・ハイフンで入力してください。",
    profileRequired: "プロフィールJSONを選んでください。",
    profileTooLarge: "プロフィールJSONは1 MiB以下にしてください。",
    profileEncoding: "プロフィールJSONはBOMなしのUTF-8で保存してください。",
    profileJson: "プロフィールJSONを読み取れませんでした。内容を確認してください。",
    setup:
      "プロフィールを使ってテストを開始できませんでした。参加者IDとプロフィール内容を確認してください。",
    result: "回答結果を作成できませんでした。入力内容を確認してください。",
  },
} as const;

export const coreStrings = {
  appName,
  metadata: {
    description: "マンガの好みを分析し、理由とともに次の一冊を提案します。",
  },
} as const;

export const routeBoundaryStrings = {
  pending: "ページを読み込んでいます…",
  errorTitle: "ページを表示できません",
  errorDescription: "一時的な問題が発生しました。もう一度お試しください。",
  retry: "再試行",
  notFoundTitle: "ページが見つかりません",
  notFoundDescription: "URLを確認するか、ホームから作品を探してください。",
  home: "ホームへ戻る",
} as const;

export const designSystemStrings = {
  close: "閉じる",
} as const;

export const mediaStrings = {
  openDetails: (title: string) => `「${title}」の作品詳細を見る`,
  evidencePlaceholder: "追加の根拠なし",
  previous: (title: string) => `${title}を前へ送る`,
  next: (title: string) => `${title}を次へ送る`,
  rank: (position: number) => `${String(position)}位`,
  editorialRank: (position: number) => `おすすめ${String(position)}位`,
  topTenLabel: "TOP 10",
  topTenBadge: {
    top: "TOP",
    ten: "10",
  },
  catalogMetadata: {
    compact: (genre: string | undefined, remainingGenres: number) =>
      genre === undefined
        ? ""
        : remainingGenres > 0
          ? `${genre} +${String(remainingGenres)}`
          : genre,
    standard: (genre: string | undefined, remainingGenres: number, status: string) =>
      [
        genre === undefined
          ? undefined
          : remainingGenres > 0
            ? `${genre} ほか${String(remainingGenres)}`
            : genre,
        status,
      ]
        .filter((value) => value !== undefined)
        .join(" · "),
    accessible: (genres: readonly string[], status: string) =>
      [genres.length === 0 ? undefined : `ジャンル ${genres.join("、")}`, `刊行状況 ${status}`]
        .filter((value) => value !== undefined)
        .join("。"),
  },
} as const;

export const siteFooterStrings = {
  navigationLabel: "フッターナビゲーション",
  sections: {
    discover: "作品を探す",
    understand: "好みを知る",
    manage: "記録とデータ",
  },
  localFirst: "登録なし。好みと読書記録は、このブラウザの中だけに保存されます。",
  about: "このサイトについて",
  copyright: "© 2026 Konocomics",
} as const;

export const aboutStrings = {
  metadataTitle: "このサイトについて | konocomics",
  title: "このサイトについて",
  lead: "konocomics は、好きなマンガから好みを分析し、次に読む作品を根拠つきでおすすめする無料のウェブアプリです。会員登録は不要です。",
  sections: [
    {
      title: "運営者",
      paragraphs: ["Konocomics"],
    },
    {
      title: "ブラウザに保存されるデータ",
      paragraphs: [
        "読書記録、好み、おすすめの方針は、お使いのブラウザ（IndexedDB）にのみ保存されます。運営者のサーバーには送信・保存されません。",
        "設定の「すべて削除」から、いつでも消去できます。ブラウザのサイトデータを消去した場合も削除されます。",
      ],
    },
    {
      title: "外部に送信される情報",
      paragraphs: [
        "作品の検索や、表紙・価格などの表示のために、検索語や ISBN を当サイトのサーバーを経由して楽天ウェブサービス（楽天ブックス API）へ送信します。読書記録や好みは送信しません。",
        "ホスティング事業者（Vercel）のサーバーには、IP アドレスなどの一般的なアクセスログが記録される場合があります。当サイトはアクセス解析ツールや広告用の Cookie を使用していません。",
      ],
    },
    {
      title: "アフィリエイトについて",
      paragraphs: [
        "楽天ブックスへのリンクには、楽天アフィリエイトの情報が含まれる場合があります。リンク先での購入などにより、運営者が報酬を受け取ることがあります。",
        "リンク先では、楽天グループの規約とプライバシーポリシーが適用されます。",
      ],
    },
    {
      title: "表紙・作品情報",
      paragraphs: [
        "表紙画像・書誌・価格などは楽天ブックス API から取得して表示しており、当サイトでは画像を保存・複製していません。一部の作品紹介は、出版社の公式サイトを出典として表示しています。",
        "各作品の著作権は、それぞれの権利者に帰属します。",
      ],
    },
    {
      title: "免責事項",
      paragraphs: [
        "おすすめと好みの分析は、登録された作品と公開情報をもとに自動で計算した参考情報です。作品情報・価格・在庫の正確性や最新性は保証しません。",
        "当サイトの利用によって生じた損害について、運営者は責任を負いかねます。内容は予告なく変更、または提供を終了する場合があります。",
      ],
    },
  ],
  contact: {
    title: "お問い合わせ",
    description: "ご意見や不具合の報告は、GitHub の Issues で受け付けています。",
    link: "GitHub Issues",
    linkLabel: "GitHub Issues を開く（新しいタブ）",
    href: "https://github.com/fromiron/konocomics/issues",
  },
  enactedAt: "制定日：2026年10月1日",
} as const;

export const landingStrings = {
  metadataTitle: "konocomics | 好みから見つける、次のマンガ。",
  logoCaption: {
    japanese: "好み",
    equation: "kono + mi = このみ",
  },
  tagline: "好みから見つける、次のマンガ。",
  /** Line-break units of the tagline; it never wraps inside a phrase. */
  taglinePhrases: ["好みから見つける、", "次のマンガ。"],
  description: (axisCount: number) =>
    `好きなマンガを5作品選ぶだけ。展開やトーンなど${String(axisCount)}の軸から好みを読み取り、なぜ合うのかまで説明します。`,
  cta: "好きなマンガから始める",
  ctaByVisitor: {
    new: "好きなマンガから始める",
    resume: "選んだ作品の続きから",
    profile: "自分のおすすめを見る",
    recovery: "作品を追加して続ける",
  },
  visitorNote: {
    resume: "途中まで選んだ作品は、この端末に保存されています。",
    profile: "あなたの Manga DNA は、この端末に保存されています。",
    recovery: "おすすめを出すには、好きな作品をもう少し追加してください。",
  },
  sharedEntry: "シェアされた Manga DNA から来た方へ",
  obi: {
    label: "好みからおすすめまで",
    steps: ["好きな5作品", "Manga DNA", "理由つきのおすすめ"],
  },
  hero: {
    trust: (workCount: string) => [
      "登録なし",
      `${workCount}作品から提案`,
      "データはこの端末だけに保存",
    ],
  },
  sample: {
    caption: (titles: readonly string[]) =>
      `例：${titles.map((title) => `『${title}』`).join("")}などが好きな場合`,
    label: "おすすめの一冊",
    detail: (title: string) => `『${title}』の詳細を見る`,
  },
  how: {
    title: "5作品を選ぶと、好みが言葉になる",
    steps: [
      { title: "選ぶ", description: "好きなマンガを5〜10作品選びます。" },
      { title: "好みが見える", description: "選んだ作品の傾向を Manga DNA として可視化します。" },
      {
        title: "理由つきでおすすめ",
        description: "好みのどこに合うのかを添えて、次の一冊を提案します。",
      },
    ],
    dnaTitle: "例：Manga DNA",
    dnaBasis: (title: string, count: number) => `『${title}』ほか${String(count)}作品から`,
  },
  ranking: {
    title: "最初におすすめしたい Top 10",
    description: "はじめての方に読んでほしい10作品です。個人向けの順位ではありません。",
  },
  discovery: {
    title: "まだ知らない一冊へ",
    description: "ジャンルを横断して選んだ作品です。",
  },
  closing: {
    title: "あなたの Manga DNA を見てみよう",
    description: "好きなマンガを5作品選ぶだけ。登録はいりません。",
  },
  footer: {
    credit: "Supported by Rakuten Developers",
  },
} as const;

export const navigationStrings = {
  brandLinkLabel: "konocomics おすすめへ",
  brandParts: {
    kono: "kono",
    co: "co",
    mi: "mi",
    cs: "cs",
  },
  desktopLabel: "メインナビゲーション",
  mobileLabel: "メインタブ",
  skipLink: "本文へ移動",
  profileLoading: "保存した好みを確認しています…",
  items: {
    recommendations: "おすすめ",
    taste: "DNA",
    library: "ライブラリ",
    settings: "設定",
  },
  routeNames: {
    home: "ホーム",
    onboarding: "好みの登録",
    workDetail: "作品詳細",
    sharedDna: "共有された Manga DNA",
    about: "このサイトについて",
  },
  routeAnnouncement: (pageLabel: string) => `${pageLabel}ページに移動しました。`,
} as const;

export const catalogStrings = {
  loading: "おすすめ用のカタログを読み込んでいます…",
  loadError: "カタログを読み込めませんでした",
  retry: "再試行",
} as const;

export const coverStrings = {
  alt: (title: string) => `${title} 表紙`,
  creatorLine: (creators: readonly string[]) =>
    creators.length > 0 ? `作者 ${creators.join("・")}` : "作者不明",
  placeholderLabel: (title: string, creatorLine: string) =>
    `${title}の表紙画像はありません。${creatorLine}`,
} as const;

export const onboardingStrings = {
  metadataTitle: "好きなマンガを選ぶ | konocomics",
  loading: "保存した内容を読み込んでいます…",
  storageWarning:
    "このブラウザではデータを保存できません。このまま続けられますが、再読み込みすると入力内容は失われます。",
  saveError: "入力内容を保存できませんでした。もう一度お試しください。",
  completeError: "好みを保存できませんでした。入力内容を確認して、もう一度お試しください。",
  workConflict: (title: string) =>
    `「${title}」は別の画面ですでに追加されています。最新の内容を読み込みました。選び直してください。`,
  searchResults: (query: string, count: number) =>
    count === 0
      ? `「${query}」の検索結果はありません。`
      : `「${query}」の検索結果は ${String(count)} 作品です。`,
  excludedMatches: {
    heading: "ここでは選べない作品",
    title: (title: string) => `『${title}』`,
    reasons: {
      registered: "ライブラリに登録済みです。感想はライブラリで更新できます。",
      notAnalyzable: "好みの分析にはまだ対応していません。ライブラリには記録できます。",
    },
    openLibrary: "ライブラリで開く",
  },
  welcome: {
    eyebrow: "はじめに",
    title: "あなたの Manga DNA を作りましょう",
    description: "好きなマンガを選ぶだけ。登録なし、データはこのブラウザの中だけに保存されます。",
    stepsLabel: "Manga DNA ができるまで",
    currentStep: "いまここ",
    steps: [
      {
        title: "好きな作品を選ぶ",
        description: "5〜10 作品。特に好きな作品は「大好き」にできます。",
      },
      {
        title: "合わなかった作品",
        optional: "任意",
        description: "0〜3 作品。選ばなくても大丈夫です。",
      },
      {
        title: "Manga DNA とおすすめ",
        description: "好みを読み取り、合う作品を理由といっしょに提案します。",
      },
    ],
  },
  clarity: {
    label: "DNAの鮮明さ",
    levels: {
      empty: "まだ選んでいません",
      low: "ぼんやり",
      normal: "鮮明",
      high: "とても鮮明",
    },
    toNormal: (count: number) => `あと ${String(count)} 作品で鮮明になります`,
    toHigh: (count: number) => `あと ${String(count)} 作品でさらに鮮明になります`,
    withReasons: "具体的な理由を選ぶと、DNA がより鮮明になります",
  },
  selectionPanel: {
    guideTitle: "選び方",
    guideSteps: {
      firstRun: [
        "作品の ＋ を押して選ぶ",
        "特に好きな作品は ☆ で「大好き」に",
        "5 作品から「次へ」に進めます",
      ],
      add: [
        "作品の ＋ を押して選ぶ",
        "特に好きな作品は ☆ で「大好き」に",
        "「追加する」で DNA に反映",
      ],
    },
    continueHint: {
      firstRun: "次に、合わなかった作品を任意で選べます",
      add: "押すと Manga DNA を再計算します",
    },
    clear: "選択をクリア",
    clearedAnnouncement: "選択をクリアしました。",
  },
  addMode: {
    eyebrow: "作品を追加",
    title: "好きなマンガを追加してください",
    description: "1作品から追加できます。5作品以上で DNA が鮮明になります。",
    selectedTray: "追加するマンガ",
    emptySelected: "まだ追加する作品がありません",
    minimum: "1作品以上えらんでください",
    submit: (count: number) => `追加する (${String(count)}/10)`,
    saving: "追加しています…",
    close: "DNAに戻る",
  },
  step1: {
    eyebrow: "STEP 1 / 2",
    title: "好きなマンガを 5〜10 作品えらんでください",
    description: "特に好きな作品は ☆ で「大好き」にすると、より強く反映されます。",
    searchLabel: "好きなマンガを検索",
    searchPlaceholder: "タイトル・作者名を入力",
    noResults: "見つかりませんでした。別の書き方で試してください",
    catalogLater: "カタログにない作品は、あとでライブラリから追加できます。",
    selectedTray: "選んだマンガ",
    selectedCount: (count: number, maximum: number) => `${String(count)} / ${String(maximum)} 作品`,
    emptySelected: "まだ選ばれていません",
    select: "好きに追加",
    remove: "選択を解除",
    selectedAnnouncement: (title: string) => `「${title}」は選択済みです。`,
    removedAnnouncement: (title: string) => `「${title}」の選択を解除しました。`,
    selected: "好き",
    favorite: "大好き",
    markFavorite: "大好きにする",
    markLiked: "好きに戻す",
    maximum: "最大 10 作品までです",
    remaining: (count: number) => `あと ${String(count)} 作品`,
    needMore: (count: number) => `あと ${String(count)} 作品選んでください。`,
    next: (count: number) => `次へ (${String(count)}/10)`,
    genreHeading: "ジャンルから探す",
    allGenres: "すべて",
    genreLabels: {
      action: "アクション",
      fantasy: "ファンタジー",
      historical: "歴史",
      scienceFiction: "SF",
      mystery: "ミステリー",
      sports: "スポーツ",
      comedy: "コメディ",
      horror: "ホラー",
      sliceOfLife: "日常",
      romance: "恋愛",
    },
    featuredHeading: "選びやすい作品",
    noFilteredWorks: "この条件で選べる作品はありません。条件を変えてください。",
    collectionsHeading: "コレクションから探す",
    collectionsDescription: "気分に合う棚を開いて選べます。",
    showMore: "もっと見る",
    collectionVisibleCount: (count: number) => `${String(count)}件表示`,
    collectionEmpty: "このコレクションで選べる作品はありません。",
    collections: {
      momentum: {
        title: "勢いのある物語",
        description: "アクションやスポーツを中心に選びます。",
        action: "この棚を見る",
      },
      worlds: {
        title: "別世界へ入り込む",
        description: "ファンタジーとSFを中心に選びます。",
        action: "この棚を見る",
      },
      mysteries: {
        title: "謎と緊張を楽しむ",
        description: "ミステリー、歴史、ホラーを中心に選びます。",
        action: "この棚を見る",
      },
      everyday: {
        title: "日々と関係を味わう",
        description: "日常、恋愛、コメディを中心に選びます。",
        action: "この棚を見る",
      },
    },
    guidanceHeading: "迷ったときは",
    guidance: {
      firstRun: [
        "最近夢中になった作品から選ぶ",
        "違うジャンルを混ぜて選ぶ",
        "5〜10作品の範囲で、無理に埋めない",
        "選んだ内容はあとから追加・調整できる",
      ],
      add: [
        "最近夢中になった作品から選ぶ",
        "違うジャンルを混ぜて選ぶ",
        "1作品からでOK。無理に埋めない",
        "選んだ内容はあとから追加・調整できる",
      ],
    },
    shelves: {
      action: "アクション",
      fantasy: "ファンタジー",
      historical: "歴史",
      scienceFiction: "SF",
      mystery: "ミステリー",
      other: "その他",
    },
  },
  step2: {
    eyebrow: "STEP 2 / 2",
    title: "合わなかった・途中でやめたマンガはありますか？",
    optional: "任意",
    description: "0〜3作品まで。なくても、そのまま進めます。",
    principle: "選ばないことは、苦手という意味にはなりません。",
    back: "好きな作品を選び直す",
    searchLabel: "合わなかったマンガを検索",
    searchPlaceholder: "タイトル・作者名を入力",
    candidatesHeading: "候補から選ぶ",
    candidatesDescription: "読んだことがあって、合わなかった作品があれば選んでください。",
    showMoreCandidates: "もっと見る",
    selectedHeading: "選んだ作品",
    noResults: "見つかりませんでした。別の書き方で試してください",
    selectedPositive: "好きに選択済み",
    selectedNegative: "追加済み",
    maximum: "最大 3 作品までです",
    disposition: "この作品について",
    disliked: "合わなかった",
    dropped: "途中でやめた",
    reasons: "理由を選ぶ",
    reasonsLegend: {
      disliked: "合わなかった理由（複数選べます）",
      dropped: "やめた理由（複数選べます）",
    },
    reasonGroups: {
      content: "作品の内容",
      circumstance: "作品以外の事情",
      vague: "はっきりしない",
    },
    noReason: "理由なし = 弱くだけ反映されます",
    externalHelper: "この理由はおすすめの計算には使いません。",
    remove: "この作品を外す",
    skip: "選んだ作品を使わずに進む",
    finish: "好みを見る",
    finishHint: "合わなかった作品がなくても、このまま進めます",
    saving: "保存しています…",
    panel: {
      title: "合わなかった作品",
      empty: "なくても大丈夫です。そのまま「好みを見る」で Manga DNA を作れます。",
      effectsTitle: "選ぶとどうなる？",
      effects: [
        "選んだ作品はおすすめに表示されません",
        "理由を選ぶと、似た条件の作品がおすすめに出にくくなります",
      ],
      reasonCount: (count: number) => (count === 0 ? "理由なし" : `理由 ${String(count)}つ`),
    },
    reasonLabels: {
      tooSlow: "展開が遅い",
      tooRepetitiveProgression: "強くなるだけの繰り返し",
      tooDark: "暗すぎる・残酷",
      tooStressful: "精神的にしんどい",
      tooMuchRomance: "恋愛の比重が高い",
      tooMuchComedy: "ギャグが多すぎる",
      notEnoughSeriousness: "軽すぎる・緊張感がない",
      tooComplex: "設定・人間関係が複雑",
      artStyleDislike: "絵が合わない",
      genericStory: "ありきたりな展開",
      powerInflation: "インフレ・強さの破綻",
      externalHiatus: "休載した",
      externalNoTime: "時間がなかった",
      vague: "なんとなく合わなかった",
    },
  },
} as const;

export const tasteStrings = {
  metadataTitle: "あなたの Manga DNA | konocomics",
  loading: "Manga DNA を読み込んでいます…",
  storageWarning:
    "このブラウザでは変更を保存できません。このセッション中だけ好みの調整を反映します。",
  saveError: "おすすめの設定を保存できませんでした。もう一度お試しください。",
  title: "あなたの Manga DNA",
  description: "選んだ作品と読書記録から、物語・雰囲気・作画の好みを整理しました。",
  confidence: "分析の確信度",
  basisCount: (count: number, breakdown: readonly string[]) =>
    breakdown.length === 0
      ? `${String(count)}作品から分析しました`
      : `${String(count)}作品から分析しました（${breakdown.join("・")}）`,
  basisReactionCount: (label: string, count: number) => `${label} ${String(count)}`,
  basisHeading: "分析の基準",
  confidenceLabels: {
    high: "高い",
    normal: "ふつう",
    low: "低め(データ収集中)",
  },
  anchorsHeading: "好みを代表する作品",
  anchorsDescription: (count: number) =>
    `あなたの好みをかたちづくった作品から、${String(count)}作品を紹介します。`,
  axesHeading: "好みの軸",
  axesPending: "確認できる好みの軸を分析しています。",
  wheel: {
    name: "Manga DNA",
    label: "好みの軸のDNAホイール",
    count: (count: number) => `${String(count)}つの軸`,
    description: (count: number) =>
      `${String(count)}つの軸から、あなたのDNAを描きました。軸を選んで強さと根拠を確かめられます。`,
    basis: (count: number) => `${String(count)}作品の好みから見えた、あなたの物語の輪郭です。`,
    axisLabel: (label: string, level: string) => `${label}: ${level}`,
    segmentLabel: (label: string, level: string) => `ホイールの${label}: ${level}`,
    hint: "選んだ軸をもう一度押すと、全体表示に戻ります。",
  },
  topPreferencesHeading: "あなたの上位の好み",
  topPreferenceEvidence: (titles: readonly string[]) =>
    `${titles.map((title) => `『${title}』`).join("")}から`,
  topPreferencePending: "好みの特徴を分析しています。作品を追加すると見つけやすくなります。",
  share: {
    open: "カードで共有",
    title: "Manga DNA を共有",
    description:
      "いまの Manga DNA とおすすめ作品を1つのページにまとめます。リンクを送ると、相手もそのページを見られます。",
    previewHeading: "共有ページに載る内容",
    previewBasis: (count: number) => `${String(count)}作品から分析`,
    previewRecommendations: (titles: readonly string[]) =>
      `おすすめ: ${titles.map((title) => `『${title}』`).join("")}`,
    worksLegend: "ページに載せる作品",
    worksHelp: (count: number) =>
      `外した作品は名前を載せず「ほか○作品」として数だけ載せます。分析した${String(count)}作品の数は変わりません。`,
    copy: "私のDNAページリンクをコピー",
    shareSheet: "ほかのアプリで共有",
    openPage: "ページを開いて確認",
    openPageNewTab: "共有ページを開いて確認(新しいタブ)",
    linkLabel: "DNAページのリンク",
    privacy:
      "リンクには DNA の段階、載せた作品、おすすめ作品が含まれます。サーバーには保存されず、作成時点のスナップショットとして共有されます。",
    empty: "共有できる好みの軸がまだありません。好きな作品を追加すると、Manga DNA が見つかります。",
    addWorks: "好きな作品を追加",
    shareText:
      "好きなマンガから、わたしの好みを分析しました。あなたの Manga DNA も見てみませんか？",
    status: {
      copied: "DNAページのリンクをコピーしました。",
      copyFailed: "コピーできませんでした。リンク欄から選択してコピーしてください。",
      handedOff: "共有先のアプリに渡しました。",
      shareFailed: "共有できませんでした。リンクのコピーをお使いください。",
    },
  },
  groups: {
    theme: "テーマ",
    narrative: "展開",
    tone: "トーン・関係",
    art: "作画",
    genre: "ジャンル",
  },
  workspaceHeading: "おすすめを調整",
  resetAll: "おすすめへの反映をすべて自動に戻す",
  resetGroup: (title: string) => `${title}の反映をすべて自動に戻す`,
  resetAllSaved: "おすすめへの反映をすべて自動に戻しました。",
  resetGroupSaved: (title: string) => `${title}の反映をすべて自動に戻しました。`,
  modeLabel: "Manga DNA の表示モード",
  modes: {
    summary: "まとめ",
    adjust: "調整",
  },
  modeDescriptions: {
    summary: "現在の分析をグループごとに確認できます。",
    adjust: "分析結果はそのままに、おすすめへの反映だけを変えられます。変更はすぐに保存されます。",
  },
  groupFactorSummary: (labels: readonly string[], remaining: number) =>
    remaining > 0 ? `${labels.join("、")} ほか${String(remaining)}項目` : labels.join("、"),
  groupAdjustmentAuto: "すべて自動",
  groupAdjustmentCount: (count: number) => `手動 ${String(count)}項目`,
  groupAdjustmentHelp:
    "各項目のおすすめへの反映を変えられます。自動に戻すと分析結果が使われます。変更はすぐに保存されます。",
  groupAnalysisCount: (count: number) => `分析のみ（${String(count)}項目）`,
  groupAnalysisDetails: "内訳を見る",
  groupAnalysisDetailsLabel: (title: string, open: boolean) =>
    open ? `${title}の分析の内訳を閉じる` : `${title}の分析の内訳を見る`,
  groupDetails: "詳細設定",
  groupClose: "閉じる",
  groupShowAll: (count: number) => `すべて表示（${String(count)}項目）`,
  groupShowFewer: "上位だけ表示",
  groupShowAllLabel: (title: string, count: number, open: boolean) =>
    open ? `${title}を上位だけ表示` : `${title}のすべての項目を表示（${String(count)}項目）`,
  groupDetailsLabel: (title: string, open: boolean) =>
    open ? `${title}の詳細設定を閉じる` : `${title}の詳細設定`,
  unknown: "まだ分析中",
  factorValue: (value: number) => {
    if (value < 0.5) return "ごく控えめ";
    if (value < 1.5) return "控えめ";
    if (value < 2.5) return "ほどほど";
    if (value < 3.5) return "強め";
    return "とても強め";
  },
  analysisColumnHeading: "分析した好み",
  adjustmentColumnHeading: "おすすめへの反映",
  adjustmentGroupLabel: (factorLabel: string) => `「${factorLabel}」のおすすめへの反映を設定`,
  adjustmentLabels: {
    veryLike: "とても好き",
    like: "好き",
    auto: "自動",
    less: "控えめに",
    exclude: "除外",
  },
  adjustmentSaved: (factorLabel: string, optionLabel: string) =>
    `「${factorLabel}」のおすすめへの反映を「${optionLabel}」に変更しました。`,
  previewHeading: "おすすめへの反映を比較",
  previewDescription: "ページを開いたときと現在の設定で、おすすめ上位4作品を比べます。",
  previewBefore: "開いたときの反映設定で",
  previewAfter: "現在の反映設定で",
  previewEmpty: "表示できる候補はありません。",
  previewUnavailable: "おすすめの変化を計算できませんでした。",
  previewWorkUnavailable: "この作品の情報を表示できません。",
  previewUnchanged: "先頭の最大4作品に変化はありません。",
  previewUnchangedHint: "設定を変えて、上位の作品への影響を確かめられます。",
  previewExpand: "比較を見る",
  previewCollapse: "比較を閉じる",
  previewChanged: "先頭の最大4作品の顔ぶれや並びが変わりました。",
  recentFeedbackHeading: "最近の記録",
  openLibrary: "ライブラリで見る",
  feedbackLabels: {
    favorite: "大好き",
    liked: "好き",
    neutral: "ふつう",
    disliked: "合わなかった",
  },
  readingStateLabels: {
    planned: "読みたい",
    completed: "読んだ",
    dropped: "途中でやめた",
    hidden: "興味なし",
  },
  negativeReasonLabels: {
    tooSlow: "展開が遅い",
    tooRepetitiveProgression: "強くなるだけの繰り返し",
    tooDark: "暗すぎる・残酷",
    tooStressful: "精神的にしんどい",
    tooMuchRomance: "恋愛の比重が高い",
    tooMuchComedy: "ギャグが多すぎる",
    notEnoughSeriousness: "軽すぎる・緊張感がない",
    tooComplex: "設定・人間関係が複雑",
    artStyleDislike: "絵が合わない",
    genericStory: "ありきたりな展開",
    powerInflation: "インフレ・強さの破綻",
    vagueDislike: "なんとなく合わなかった",
  },
  addWorks: "作品を追加して精度を上げる",
  recommendations: "おすすめを見る",
  coach: {
    heading: "Manga DNAを、もう少し鮮明に。",
    description: "好きな作品を追加すると、好みの輪郭が深まります。",
    action: "作品を追加",
  },
} as const;

export const dnaSharePageStrings = {
  metadataTitle: "わたしの Manga DNA | konocomics",
  loading: "共有された Manga DNA を読み込んでいます…",
  kicker: "MANGA DNA",
  title: "わたしの Manga DNA",
  basis: (count: number) =>
    `${String(count)}作品から分析しました · このページは共有用に作成されました`,
  wheelLabel: (axes: readonly string[]) => `共有された Manga DNA ホイール。${axes.join("、")}`,
  wheelAxis: (label: string, level: string) => `${label}: ${level}`,
  centerUnit: "作品から分析",
  axesHeading: "好みの軸",
  worksHeading: "分析した作品",
  moreWorks: (count: number) => `ほか${String(count)}作品`,
  recommendationsHeading: "このDNAにおすすめの作品",
  recommendationsDescription:
    "DNAの持ち主へのおすすめ上位作品です。表紙と商品情報は楽天ブックスから表示しています。",
  reasonChip: (label: string) => `「${label}」が近い`,
  cta: {
    heading: "あなたのDNAも、5作品でわかる",
    profileHeading: "あなたの Manga DNA とくらべてみる",
    description: "好きなマンガを選ぶだけ。登録なし、データはあなたのブラウザの中だけに。",
    byVisitor: {
      new: "Manga DNAを作る",
      resume: "選んだ作品の続きから",
      profile: "自分の Manga DNA を見る",
      recovery: "作品を追加して続ける",
    },
  },
  footnote: [
    "このページは共有用に作成されました。好みのデータはURLにのみ含まれ、サーバーには保存されません。",
    "共有されたDNAは作成時点のスナップショットです。",
  ],
  invalid: {
    title: "このリンクは開けません",
    description:
      "リンクが途中で切れているか、形式が正しくありません。共有した人にもう一度リンクを送ってもらってください。",
  },
} as const;

export const recommendationStrings = {
  metadataTitle: "おすすめ | konocomics",
  loading: "おすすめを読み込んでいます…",
  calculating: "おすすめを計算しています…",
  title: "あなたへのおすすめ",
  description: "Manga DNA をもとに、まだ読んでいない作品を順番に並べました。",
  storageWarning:
    "このブラウザでは変更を保存できません。このセッション中だけおすすめを利用できます。",
  policiesHeading: "おすすめの方針",
  policiesUpdating: "並べ直しています…",
  policyLabels: recommendationPolicyLabels,
  update: "更新",
  updating: "更新しています…",
  pendingChanges: "おすすめに未反映の変更があります。",
  criteria: {
    heading: "今回のおすすめ基準",
    description: "保存した読書記録、Manga DNA、おすすめ方針だけを使っています。",
    records: "読書記録",
    basis: (count: number, preferences: string) =>
      `${String(count)}作品の好み（${preferences}）から選んでいます。`,
    basisWithoutPreferences: (count: number) => `${String(count)}作品の記録から選んでいます。`,
    dnaLink: "Manga DNA",
    policies: "適用中の条件",
  },
  filters: {
    heading: "絞り込み",
    genre: "ジャンル",
    allGenres: "すべて",
    rankingScope: "Top 10は全ジャンルの順位です。",
    sort: "並び順",
    recommended: "おすすめ順",
    empty: "この条件で表示できる作品はありません。ジャンルを変えてお試しください。",
  },
  shelves: {
    featured: {
      navigationLabel: "上位",
      title: "あなたのために選んだ作品",
    },
    discovery: {
      navigationLabel: "隠れた候補",
      title: "隠れた候補",
      description: "定番作の外から、好みに近い作品を選んでいます。",
    },
    ranking: {
      navigationLabel: "Top 10",
      title: "あなたの Top 10",
      description: "おすすめ順の上位10作品です。",
    },
  },
  lensShelves: {
    anchor: {
      navigationLabel: (anchorTitle: string) => `『${anchorTitle}』`,
      title: (anchorTitle: string) => `『${anchorTitle}』が好きなら`,
    },
    factor: {
      navigationLabel: (factorLabel: string) => `「${factorLabel}」`,
      title: (factorLabel: string) => `「${factorLabel}」で選ぶ`,
    },
  },
  mood: {
    heading: "今日の気分",
    none: "指定なし",
    labels: {
      lowStress: "気持ちが軽い話",
      warm: "あたたかい話",
      fastPaced: "テンポが速い話",
    },
    basis: (label: string, count: number) =>
      `「${label}」に合う ${String(count)}作品から選んでいます。`,
    limits: {
      lowStress: "精神的な重さが控えめと分析された作品です。暗い場面がないとは限りません。",
      warm: "あたたかさ・癒やしが強めと分析された作品です。",
      fastPaced: "展開のテンポが速めと分析された作品です。短時間で読めるという意味ではありません。",
    },
    matchLine: {
      lowStress: "今日の気分：精神的な重さが控えめ",
      warm: "今日の気分：あたたかさ・癒やしが強め",
      fastPaced: "今日の気分：展開のテンポが速め",
    },
    dismissedCount: (count: number) => `今日は見送った ${String(count)}作品を除いています。`,
    dismiss: "今日はパス",
    dismissLabel: (title: string) => `「${title}」を今日の気分では見送る`,
    dismissed: (title: string) => `「${title}」を今日の気分では見送りました。`,
    rankingDescription: "今日の気分に合う作品の上位10作品です。",
    shortage: (label: string, count: number) =>
      `「${label}」に合う作品は、いまのおすすめ候補の中に ${String(count)}作品あります。`,
    empty: {
      title: "この気分に合う作品が見つかりませんでした",
      description:
        "分析が済んでいない作品は、気分に合うかどうかを判断できないため表示していません。",
    },
    clear: "気分の指定をやめる",
  },
  shelfNavigation: {
    label: "おすすめの棚",
    accessibleLabel: (shortLabel: string, title: string) =>
      title.includes(shortLabel) ? title : `${shortLabel}：${title}`,
  },
  quickPreview: {
    open: (title: string) => `「${title}」をクイック表示`,
    openLabel: "クイック表示",
    description: "おすすめ理由と読書状態を、詳細へ移動せずに確認できます。",
    details: "作品詳細を見る",
  },
  showcase: {
    rank: (position: number) => `おすすめ ${String(position)}位`,
    select: (position: number, title: string) =>
      `おすすめ ${String(position)}位「${title}」の理由を表示`,
    points: "おすすめポイント",
    close: "おすすめ詳細を閉じる",
  },
  feedbackSummary: {
    heading: "読んだ・興味なしの記録",
    completed: (count: number) => `読んだ ${String(count)}作品`,
    hidden: (count: number) => `興味なし ${String(count)}作品`,
    excluded: "は、おすすめから外しています。",
    openLibrary: (label: string) => `ライブラリで「${label}」を見る`,
  },
  reasonHeading: "おすすめ理由",
  openDetails: (title: string) => `「${title}」の作品詳細を見る`,
  reasonUnavailable: "おすすめ理由を表示できません。",
  moreReasons: "理由をもっと見る",
  cautionHeading: "好みと異なる点",
  confidenceHeading: "分析の確信度",
  actions: {
    planned: "読みたい",
    completed: "読んだ",
    hidden: "興味なし",
    plannedConfirmation: "追加済み",
  },
  workStatus: {
    ongoing: "連載中",
    completed: "完結",
    hiatus: "休載中",
    unknown: "刊行状況不明",
  },
  volumeCount: (count: number) => `${String(count)}巻`,
  tasteSummary: {
    heading: "あなたの上位の好み",
    empty: "作品を追加すると、好みの特徴がここに表示されます。",
    link: "好みを見直す",
  },
  shortage: {
    title: "おすすめ候補が少なくなっています",
    description: "候補を増やすには、好きな作品を追加するか、好みの設定を見直してください。",
    addWorks: "好きな作品を追加",
    reviewTaste: "好みを見直す",
  },
  empty: {
    title: "表示できるおすすめがありません",
    description: "好きな作品や Manga DNA を見直すと、新しい候補が見つかることがあります。",
    link: "Manga DNA を見直す",
  },
  errors: {
    calculation: "おすすめを計算できませんでした。",
    retry: "再試行",
    feedback: "記録を保存できませんでした。カードは変更していません。もう一度お試しください。",
    followUp: "感想を保存できませんでした。もう一度お試しください。",
    policies: "おすすめの方針を保存できませんでした。もう一度お試しください。",
  },
  announcements: {
    planned: (title: string) => `「${title}」を読みたいに追加しました。`,
    removedAndBackfilled: "1件を除外し、新しい候補を追加しました",
    removedWithoutBackfill: "1件を除外しました。おすすめ候補が不足しています。",
    updated: "おすすめを更新しました。",
    policiesUpdated: "おすすめの方針を反映しました。",
    recorded: {
      completed: (title: string) => `「${title}」を読んだに記録しました。`,
      hidden: (title: string) => `「${title}」を興味なしにしました。`,
    },
    undo: "元に戻す",
    undone: (title: string) => `「${title}」をおすすめに戻しました。`,
    undoConflict: "ほかの画面で記録が更新されたため、元に戻しませんでした。",
    undoFailed: "元に戻せませんでした。もう一度お試しください。",
  },
  feedbackDialog: {
    completedTitle: "読んだ感想を残しますか？",
    completedDescription: (title: string) => `「${title}」の感想を選んでください。`,
    hiddenTitle: "興味なしの理由を残しますか？",
    hiddenDescription: (title: string) => `「${title}」について、当てはまる理由を選んでください。`,
    reactionLegend: "感想",
    reactionLabels: {
      highest: "最高",
      good: "良かった",
      neutral: "普通",
      poor: "いまいち",
    },
    reasonLegend: "理由",
    reasonLabels: {
      tooSlow: "展開が遅い",
      tooRepetitiveProgression: "強くなるだけの繰り返し",
      tooDark: "暗すぎる・残酷",
      tooStressful: "精神的にしんどい",
      tooMuchRomance: "恋愛の比重が高い",
      tooMuchComedy: "ギャグが多すぎる",
      notEnoughSeriousness: "軽すぎる・緊張感がない",
      tooComplex: "設定・人間関係が複雑",
      artStyleDislike: "絵が合わない",
      genericStory: "ありきたりな展開",
      powerInflation: "インフレ・強さの破綻",
    },
    save: "保存",
    saving: "保存しています…",
    skip: "スキップ",
  },
} as const;

export const workDetailStrings = {
  metadataTitle: "作品詳細 | konocomics",
  workMetadataTitle: (title: string) => `${title} | konocomics`,
  workMetadataDescription: (title: string, creators: readonly string[], publisher: string) =>
    `『${title}』（${[...creators, publisher].filter((part) => part !== "").join("・")}）の作品情報。あなたの好みとの相性や、おすすめの理由を konocomics で確認できます。`,
  loading: "作品情報を読み込んでいます…",
  storageWarning:
    "このブラウザでは変更を保存できません。このセッション中だけ読書状態を利用できます。",
  notFound: {
    title: "作品が見つかりません",
    description: "指定された作品はカタログにありません。",
    recommendations: "おすすめに戻る",
  },
  metadata: {
    creators: "作者",
    publisher: "出版社",
    status: "刊行状況",
    volumes: "巻数",
    unknownPublisher: "出版社不明",
    bookHeading: (volumeNumber?: number) =>
      volumeNumber === undefined ? "書誌情報" : `第${String(volumeNumber)}巻の情報`,
    releaseDate: "発売日",
    imprint: "レーベル",
    pages: "ページ数",
    pageCount: (count: number) => `${String(count)}ページ`,
    publisherSource: "出版社の書誌情報",
    date: (value: string) => value.replace(/^(\d{4})-(\d{2})-(\d{2})$/u, "$1年$2月$3日"),
    sourceOpen: (source: string) => `${source}（新しいタブ）`,
    edition: (volumeNumber?: number) =>
      volumeNumber === undefined ? "掲載版" : `第${String(volumeNumber)}巻`,
  },
  compatibility: {
    heading: "あなたとの相性",
    reasons: "合いそうな理由",
    caution: "好みと異なる点",
    anchors: "根拠になった作品",
    anchorsDescription: "このおすすめの理由になった、あなたのライブラリの作品です。",
    allAnchors: "すべての根拠を見る",
    moreAnchors: (count: number) => `+${count}`,
    anchorCount: (count: number) => `全${count}作品`,
    consensusSupport: "このおすすめを支える、ほかの好みの作品です。",
    primaryAnchor: "主な根拠",
    supportingAnchor: "好みのつながり",
    anchorFactors: "近いポイント",
    confidence: "分析の確信度",
    unavailable: "現在の好みから相性を表示できません。",
  },
  related: {
    heading: "この作品と近い作品",
    description: "テーマや雰囲気が近いカタログ作品です。",
  },
  contrast: {
    heading: "違う味わいの作品",
    description: "確認できた傾向から、この作品との違いを紹介します。",
    differences: {
      pacing: { lower: "テンポ：ゆっくり", higher: "テンポ：速め" },
      comedy: { lower: "ギャグ：控えめ", higher: "ギャグ：多め" },
      darkness: { lower: "暗さ：控えめ", higher: "暗さ：強め" },
      mentalStress: { lower: "心理的圧迫：弱め", higher: "心理的圧迫：強め" },
      romance: { lower: "恋愛要素：控えめ", higher: "恋愛要素：強め" },
    },
    view: "作品を見る",
  },
  sameMood: {
    heading: "同じ雰囲気の作品",
    description: "確認済みの作品ファクターが近いカタログ作品です。",
  },
  sameAuthor: {
    heading: (author: string) => `${author}の作品`,
    othersHeading: "そのほかの作品",
    reviews: (average: number, count: number) =>
      `楽天レビュー ${average.toFixed(1)} · ${String(count)}件`,
    view: "作品を見る",
    open: (title: string) => `「${title}」の作品詳細を見る`,
  },
  synopsis: {
    heading: "あらすじ",
    unavailable: "作品紹介を取得できませんでした。",
    readMore: "続きを読む",
    readLess: "閉じる",
    source: { rakuten: "楽天ブックスの紹介", publisher: "出版社の紹介" },
  },
  factors: {
    heading: "ジャンル・テーマ",
    empty: "ジャンルとテーマはまだ確認できません。",
  },
  traits: {
    heading: "この作品の傾向",
    description: "おすすめで使う物語・雰囲気・作画の軸です。",
    pending: "この作品の傾向はまだ分析中です。",
    groups: {
      narrative: "展開",
      tone: "トーン・関係",
      art: "作画",
    },
    unknown: "未確認",
    notApplicable: "該当なし",
    groupUnknown: "この分類の軸はまだ確認できていません。",
    legendWork: "この作品",
    legendTaste: "あなたの好み",
    tasteReference: (value: string) => `あなたの好み: ${value}`,
  },
  share: {
    action: "共有",
    copied: "リンクをコピーしました。",
    failed: "リンクを共有できませんでした。",
  },
  state: {
    heading: "読書状態",
    loading: "保存した読書状態を確認しています…",
    label: "読書状態を変更",
    prompt: "状態を選ぶ",
    options: {
      planned: "読みたい",
      completed: "読んだ",
      dropped: "途中でやめた",
      hidden: "興味なし",
    },
    plannedAdd: "読みたい",
    plannedRemove: "読みたいから外す",
    ongoingHint: "連載中の作品も、読んだところまでを「読んだ」として記録できます。",
    reactionGroup: "感想",
    reactionSaved: (state: string, label: string) => `「${state}・${label}」を保存しました。`,
    reactionCleared: "感想を外しました。読書状態はそのままです。",
    progressNote: (progress: string) => `${progress}まで読んだ記録があります。`,
    stateSaved: (label: string) => `「${label}」を保存しました。`,
    plannedSaved: "読みたいに追加しました。",
    plannedRemoved: "読みたいから外しました。",
    plannedAlreadyAbsent: "すでに読みたいから外れています。",
    recordCleared: (label: string) => `「${label}」を解除しました。`,
    recordAlreadyCleared: "この作品の記録はすでにありません。",
    recordRestored: "記録を元に戻しました。",
    undo: "元に戻す",
    plannedPreservedConflict:
      "別の画面で更新された記録を残しました。最新の読書状態を表示しています。",
    error: "読書状態を保存できませんでした。もう一度お試しください。",
  },
  provider: {
    heading: "楽天ブックス",
    loading: "価格と在庫を確認しています…",
    unavailable: "価格と在庫を現在表示できません。",
    view: "楽天ブックスで見る",
    search: "楽天ブックスで検索",
    openNewTab: "楽天ブックスを開く(新しいタブ)",
    searchNewTab: "楽天ブックスで検索する(新しいタブ)",
    retry: "もう一度確認",
    affiliate: "このリンクはアフィリエイトリンクです。",
    credit: "Supported by Rakuten Developers",
    priceLabel: "価格",
    availabilityLabel: "在庫・発送",
    ratingLabel: "楽天レビュー",
    reviewCountLabel: "レビュー件数",
    rating: (value: number) => `${value.toFixed(1)} / 5`,
    reviewCount: (value: number) => `${String(value)} 件`,
    price: (value: number) => yenFormatter.format(value),
    availability: {
      1: "在庫あり",
      2: "通常3〜7日程度で発送",
      3: "通常3〜9日程度で発送",
      4: "取り寄せ",
      5: "予約受付中",
      6: "メーカー在庫確認",
    },
  },
} as const;

export const settingsStrings = {
  metadataTitle: "設定 | konocomics",
  title: "設定",
  description: "おすすめの方針と、このブラウザに保存されたデータを管理します。",
  storage: {
    browserOnly: "読書記録と好みのデータは、このブラウザにだけ保存されます。",
    sessionOnly: "このブラウザではデータを保存できません。変更はこのセッション中だけ残ります。",
  },
  policies: {
    title: "おすすめの方針",
    description: "変更はすぐに次のおすすめへ反映されます。",
    legend: "おすすめで優先する条件",
    labels: recommendationPolicyLabels,
    descriptions: {
      preferCompleted: "完結まで読める作品を上位に寄せます。",
      preferHidden: "知名度だけに偏らない候補を優先します。",
      preferVerified: "好みの近さが同程度の作品では、レビュー評価や刊行実績を重視します。",
      excludeIncomplete: "刊行状況を確認できない作品を候補から外します。",
    },
    loading: "保存した方針を読み込んでいます…",
    saving: "方針を保存しています…",
    error: "おすすめの方針を保存できませんでした。変更前の状態に戻しました。",
  },
  sections: {
    label: "設定セクション",
    items: {
      policies: "おすすめの方針",
      dna: "Manga DNA",
      data: "データ",
      danger: "危険な操作",
      app: "このアプリ",
    },
  },
  dna: {
    title: "Manga DNA",
    description: "Manga DNA の分析結果を確認し、おすすめへの反映を設定できます。",
    adjustmentCount: (count: number) =>
      count === 0 ? "手動調整はありません。" : `${String(count)} 項目を手動調整しています。`,
    action: "おすすめを調整",
  },
  storageStatus: {
    title: "保存の状態",
    records: (count: number, external: number) =>
      external === 0
        ? `作品の記録 ${String(count)}件`
        : `作品の記録 ${String(count)}件（カタログ外 ${String(external)}件）`,
    usage: (megabytes: string) => `使用容量 約${megabytes} MB`,
    persisted: "ブラウザの自動削除から保護されています。",
    notPersisted: "空き容量が不足すると、ブラウザが記録を自動で削除する場合があります。",
    denied: "このブラウザでは保護を有効にできませんでした。定期的にエクスポートしてください。",
    protect: "データを保護する",
    protecting: "保護を設定しています…",
  },
  danger: {
    title: "危険な操作",
    description: "取り消せない操作です。実行する前に、エクスポートでバックアップを残してください。",
    exportFirst: "先にエクスポート",
  },
  data: {
    title: "データ",
    description:
      "記録はこのブラウザだけに保存され、外部へ送信されません。書き出し・復元・削除ができます。",
    export: {
      title: "エクスポート",
      description: "読書記録と好みのデータを JSON ファイルに書き出します。",
      action: "エクスポート",
      exporting: "書き出しています…",
    },
    import: {
      title: "インポート",
      description: "konocomics のエクスポートファイルを検証してから復元します。",
      select: "ファイルを選ぶ",
      inspecting: "ファイルを確認しています…",
      verified: (filename: string) => `「${filename}」を確認しました。復元できます。`,
      reviewReplacement: "置き換える内容を確認",
      preview: {
        title: "インポートする内容",
        exportedAtLabel: "エクスポート日時",
        workCountLabel: "作品数",
        workCount: (count: number) => `${String(count)} 作品`,
        catalogMismatch: (saved: string, current: string) =>
          `カタログのバージョンが異なります（ファイル: ${saved} / 現在: ${current}）。作品データは復元され、好みは現在のカタログで再計算されます。`,
      },
      confirm: {
        title: "現在のデータを置き換えますか？",
        description:
          "このブラウザにある現在のデータはすべて、確認したファイルの内容に置き換わります。途中まで適用されることはありません。",
        action: "置き換える",
        replacing: "置き換えています…",
      },
      success: "データを復元しました。おすすめは次に開いたときに再計算されます。",
      successSessionOnly:
        "データをこのセッションに復元しました。再読み込みすると失われます。おすすめは次に開いたときに再計算されます。",
    },
    delete: {
      title: "すべて削除",
      description: "読書記録、好み、おすすめの方針を、このブラウザからすべて削除します。",
      action: "すべて削除",
      keyword: "削除",
      successSessionOnly:
        "このセッションのデータを削除しました。ブラウザを再読み込みすると、以前のデータが戻る場合があります。",
      confirm: {
        title: "すべてのデータを削除しますか？",
        description:
          "読書記録、好み、設定をこのブラウザから削除します。元に戻すには、先にエクスポートしたファイルが必要です。",
        label: "確認のため「削除」と入力してください",
        action: "削除する",
        deleting: "削除しています…",
      },
    },
    errors: {
      invalidJson: "JSONを読み取れませんでした。ファイルの内容を確認してください。",
      invalidFormat: (details: string | null) =>
        details === null
          ? "ファイル形式が正しくありません。必要なデータが不足しているか、値が壊れています。"
          : `ファイル形式が正しくありません（詳細: ${details}）。`,
      unsupportedVersion: (version: number | null) =>
        version === null
          ? "対応していないバージョンです。アプリを更新してから、もう一度お試しください。"
          : `バージョンが新しすぎます(v${String(version)})。アプリを更新してください。`,
      unsupportedExternalIdentity: (version: number | null) =>
        version === null
          ? "カタログ外作品の識別形式に対応していません。アプリを更新してください。"
          : `カタログ外作品の識別形式(v${String(version)})に対応していません。アプリを更新してください。`,
      externalIdentity: (details: string | null) =>
        details === null
          ? "カタログ外作品の識別情報が壊れています。現在のデータは変更していません。"
          : `カタログ外作品の識別情報が壊れています（${details}）。現在のデータは変更していません。`,
      incompatibleProfile: (details: string | null) =>
        details === null
          ? "好みの登録状態を復元できません。ファイルの内容を確認してください。"
          : `好みの登録状態を復元できません（詳細: ${details}）。`,
      indeterminate:
        "処理結果を確認できませんでした。画面を再読み込みして、保存内容を確認してください。",
      unknown: "処理を完了できませんでした。現在のデータは変更していません。",
    },
  },
  dialog: {
    cancel: "キャンセル",
  },
  app: {
    title: "このアプリ",
    versionLabel: "バージョン",
    version: "0.1.0",
    storageLabel: "データの保存先",
    storageValue: "このブラウザのみ",
    storageValueSessionOnly: "このセッションのみ（再読み込みで消えます）",
    providerLabel: "書誌・販売情報",
    providerCredit: "Supported by Rakuten Developers",
    affiliateLabel: "アフィリエイト",
    affiliateRelationship: "楽天ブックスへのリンクにアフィリエイト情報が含まれる場合があります。",
    showIntroduction: "使い方をもう一度見る",
  },
} as const;

export const libraryStrings = {
  metadataTitle: "ライブラリ | konocomics",
  loading: "ライブラリを読み込んでいます…",
  title: "ライブラリ",
  description: "読みたい作品と読書記録を、状態ごとに確認・編集できます。",
  addWork: "作品を追加",
  storageWarning:
    "このブラウザではデータを保存できません。このセッション中だけライブラリを利用できます。",
  tablistLabel: "読書状態で絞り込む",
  tabsAll: "すべて",
  tabs: {
    planned: "読みたい",
    completed: "読んだ",
    dropped: "途中でやめた",
    hidden: "興味なし",
  },
  tabWithCount: (label: string, count: number) => `${label}、${String(count)}作品`,
  listLabel: (state: string) => `${state}作品`,
  summary: {
    heading: "読書状態の件数",
    total: "全作品",
    count: (count: number) => `${String(count)} 作品`,
  },
  toolbar: {
    searchLabel: "ライブラリ内を検索",
    searchPlaceholder: "ライブラリ内の作品・作者を検索",
    favoriteOnly: "お気に入りのみ",
    resultCount: (count: number) => `${String(count)}作品を表示`,
    sortLabel: "並び順",
    sortUpdated: "最近更新",
    sortTitle: "タイトル順",
    sortRating: "評価順",
    viewLabel: "表示方法",
    views: { grid: "グリッド", list: "リスト" },
  },
  pagination: {
    label: "作品一覧のページ",
    previous: "前へ",
    next: "次へ",
    page: (page: number, total: number) => `${String(page)} / ${String(total)}`,
    resultRange: (start: number, end: number, total: number) =>
      `${String(start)}–${String(end)} / ${String(total)}作品`,
  },
  recent: {
    heading: "最近更新した作品",
    description: "保存済みの更新日時が新しい順です。",
  },
  favorites: {
    heading: "お気に入り",
    description: "感想を「最高」にした作品です。",
  },
  tools: {
    heading: "記録のバックアップ",
    description: (count: number) =>
      `${String(count)}作品の記録は、このブラウザにだけ保存されています。`,
    openSettings: "データ設定を開く",
  },
  basis: (total: number, favorites: number) =>
    favorites === 0
      ? `${String(total)}作品を記録`
      : `${String(total)}作品を記録 · お気に入り ${String(favorites)}`,
  progress: (volume: number | undefined, chapter: number | undefined) =>
    [
      volume === undefined ? null : `${String(volume)}巻`,
      chapter === undefined ? null : `${String(chapter)}話`,
    ]
      .filter((value): value is string => value !== null)
      .join("・"),
  openRecord: (title: string) => `「${title}」の記録を編集`,
  filteredEmpty: {
    search: (query: string) => `「${query}」に一致する作品は見つかりませんでした。`,
    favorite: "お気に入りの作品はありません。",
    conditions: (state: string, favoriteOnly: boolean) =>
      `絞り込み：${state}${favoriteOnly ? "・お気に入りのみ" : ""}`,
    clearSearch: "検索をクリア",
    clearFilters: "絞り込みを解除",
    showAll: "すべての作品を見る",
  },
  updatedAt: (date: string) => `更新 ${date}`,
  overallEmpty: {
    title: "まだ作品がありません",
    description: "読んだ作品を記録すると、おすすめから自動的に外れます。",
  },
  tabEmpty: {
    planned: "読みたい作品はまだありません。",
    completed: "読んだ作品はまだありません。",
    dropped: "途中でやめた作品はまだありません。",
    hidden: "興味なしにした作品はまだありません。",
  },
  externalBadge: "カタログ外",
  externalExclusion: "この作品はおすすめ・Manga DNA の計算には使われません。",
  catalogMissing: {
    title: "カタログにない保存済み作品",
    badge: "現在のカタログ外",
    workId: (workId: string) => `作品ID: ${workId}`,
    openRecord: (workId: string) => `カタログにない保存済み作品「${workId}」の記録を編集`,
    dialogLabel: (workId: string) => `保存済み作品「${workId}」の読書記録`,
    coverUnavailable: "表紙情報なし",
    description:
      "この作品は現在のカタログにないため、タイトル・作者・表紙を表示できません。読書記録は保存されています。",
  },
  unknownCreator: "作者不明",
  reactions: {
    none: "感想なし",
    favorite: "最高",
    liked: "良かった",
    neutral: "普通",
    disliked: "いまいち",
  },
  panel: {
    close: "閉じる",
    detailLabel: "読書記録を編集",
    catalogDetail: "作品詳細を見る",
    externalDetail: "カタログ外作品の詳細を見る",
  },
  editor: {
    heading: "読書記録",
    readingState: "読書状態",
    reaction: "感想",
    reactionPrompt: "感想を記録しない",
    progress: "進み具合",
    progressOptional: "進み具合（任意）",
    volume: "巻",
    chapter: "話",
    reasonDisliked: "合わなかった理由",
    reasonDropped: "途中でやめた理由",
    reasonOptional: "当てはまるものだけ選んでください。",
    externalReason: "この理由はおすすめの計算には使いません。",
    save: "変更を保存",
    saving: "保存しています…",
    saved: "読書記録を保存しました。",
    error: "読書記録を保存できませんでした。もう一度お試しください。",
    reasonLabels: {
      tooSlow: "展開が遅い",
      tooRepetitiveProgression: "強くなるだけの繰り返し",
      tooDark: "暗すぎる・残酷",
      tooStressful: "精神的にしんどい",
      tooMuchRomance: "恋愛の比重が高い",
      tooMuchComedy: "ギャグが多すぎる",
      notEnoughSeriousness: "軽すぎる・緊張感がない",
      tooComplex: "設定・人間関係が複雑",
      artStyleDislike: "絵が合わない",
      genericStory: "ありきたりな展開",
      powerInflation: "インフレ・強さの破綻",
      externalHiatus: "休載した",
      externalNoTime: "時間がなかった",
      vague: "なんとなく合わなかった",
    },
  },
  search: {
    heading: "作品を追加",
    label: "タイトル・作者名で検索",
    placeholder: "追加する作品名・作者名",
    prompt: "作品名や作者名を入力してください。",
    localHeading: "カタログの作品",
    localResults: (count: number) => `カタログから ${String(count)} 作品見つかりました。`,
    noLocalResults: "カタログ内では見つかりませんでした。",
    add: "読みたいに追加",
    added: "追加済み",
    adding: "追加しています…",
    addedAnnouncement: (title: string) => `「${title}」を読みたいに追加しました。`,
    alreadyAddedAnnouncement: (title: string) =>
      `「${title}」はすでにライブラリにあります。最新の記録を表示しています。`,
    addError: "作品を追加できませんでした。もう一度お試しください。",
    addUnknown: "保存結果を確認できませんでした。ライブラリを再読み込みしてから確認してください。",
    rakutenExpand: "楽天ブックスで探す",
    rakutenHeading: "楽天ブックスの検索結果",
    rakutenSearching: "楽天ブックスで探しています…",
    rakutenResults: (count: number) =>
      count === 0
        ? "楽天ブックスでも見つかりませんでした。"
        : `楽天ブックスから ${String(count)} 件見つかりました。`,
    providerUnavailable: "今はカタログ内の作品だけ追加できます。",
    catalogMatch: "カタログ作品",
    externalMatch: "カタログ外として追加",
    credit: "Supported by Rakuten Developers",
  },
} as const;

export const popularWorkStrings = {
  source: "楽天ブックスで売れている作品",
  question: "は読んだことがありますか？",
  title: (title: string) => `『${title}』`,
  read: "読んだことがある",
  unread: "まだ読んでいない",
  dismiss: "この案内を閉じる",
  back: "作品の案内に戻る",
  preview: (title: string) => `「${title}」の作品紹介`,
  record: (title: string) => `「${title}」の読書記録`,
  independent: "好みとは別に、楽天ブックスの売上順から紹介しています。",
  recordPrompt: "読書状態と感想を確認して保存してください。",
  listing: (title: string) => `表示している本：${title}`,
  rakuten: "楽天ブックスで見る",
  alreadyAdded: "この作品はすでにライブラリにあります。既存の記録を保ちました。",
} as const;

export const externalDetailStrings = {
  metadataTitle: "カタログ外作品 | konocomics",
  loading: "カタログ外作品を読み込んでいます…",
  title: "カタログ外作品",
  malformed: {
    title: "作品を指定できませんでした",
    description: "ライブラリから作品を選び直してください。",
    library: "ライブラリに戻る",
  },
  missing: {
    title: "作品が見つかりません",
    description: "この作品はライブラリから削除されたか、保存されていません。",
    library: "ライブラリに戻る",
  },
  corrupt: {
    title: "作品情報を表示できません",
    description: "保存された作品情報を確認できませんでした。ライブラリから選び直してください。",
    library: "ライブラリに戻る",
  },
  unavailable: {
    title: "作品情報を確認できません",
    description: "保存した作品情報を今は読み込めません。時間をおいてもう一度お試しください。",
    library: "ライブラリに戻る",
  },
  badge: "カタログ外",
  exclusion: "この作品はおすすめ・Manga DNA の計算には使われません。",
  metadata: {
    creators: "作者",
    isbn: "ISBN",
    unknownCreator: "作者不明",
  },
  state: {
    saved: "読書記録を保存しました。",
    error: "読書記録を保存できませんでした。もう一度お試しください。",
  },
} as const;

export const experimentReportStrings = {
  title: "konocomics Taste vs Baseline レポート",
  headings: {
    profile: "プロフィール",
    profileSummary: "入力サマリー",
    tasteTop: "Taste Engine Top 10",
    baselineTop: "Baseline Top 10",
    diagnostic: "診断サマリー",
  },
  fields: {
    catalogVersion: "カタログバージョン",
    factorDictionaryVersion: "ファクター辞書バージョン",
    baselineVersion: "Baseline バージョン",
    profileCount: "プロフィール数",
    anchors: "好みのアンカー",
    negativeSources: "苦手情報の参照元",
    adjustments: "好みの調整",
    score: "スコア",
    confidence: "確信度",
    bestAnchor: "最も近いアンカー",
    positiveReasons: "おすすめ理由",
    caution: "注意点",
    evidenceAnchors: "根拠アンカー",
    penalties: "適用された減点",
    coverage: "カバレッジ警告",
    ledger: "寄与度上位5件",
    reason: "理由",
    bayesianRating: "ベイズ補正レビュー",
    maturity: "刊行蓄積度",
    tasteCount: "Taste 件数",
    baselineCount: "Baseline 件数",
    shrunkCount: "SHRUNK グループ数",
    partialCount: "PARTIAL グループ数",
    reactionWeight: "反応ウェイト",
  },
  ledgerColumns: {
    rank: "順位",
    delta: "寄与",
    source: "source",
    group: "group",
    factorId: "factorId",
    anchorWorkIds: "anchorWorkIds",
    negativeReasonId: "negativeReasonId",
    explainable: "説明対象",
  },
  values: {
    none: "なし",
    yes: "はい",
    no: "いいえ",
  },
  reactionLabels: {
    favorite: "大好き",
    liked: "好き",
  },
  adjustmentLabels: {
    veryLike: "とても好き",
    like: "好き",
    auto: "自動",
    less: "控えめ",
    exclude: "除外",
  },
  negativeReasonLabels: {
    tooSlow: "展開が遅い",
    tooRepetitiveProgression: "成長展開の繰り返しが多い",
    tooDark: "暗すぎる",
    tooStressful: "精神的に重すぎる",
    tooMuchRomance: "恋愛要素が多すぎる",
    tooMuchComedy: "コメディが多すぎる",
    notEnoughSeriousness: "シリアスさが足りない",
    tooComplex: "複雑すぎる",
    artStyleDislike: "絵柄が合わない",
    genericStory: "物語がありきたり",
    powerInflation: "強さのインフレが気になる",
    vagueDislike: "理由を特定できない苦手",
  },
} as const;
