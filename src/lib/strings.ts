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

export const explanationLexicon = {
  factorLabels: explanationFactorLabels,
  clusterLabels: {
    tacticalThinking: "頭脳で解決する展開",
    relationshipAppeal: "人物の変化と関係性",
    toneLoad: "物語の重さ",
  },
  confidenceLabels: {
    high: "高い",
    normal: "ふつう",
    low: "低め(データ収集中)",
  },
  templates: {
    positiveWithAnchor: "『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。",
    positiveWithoutAnchor: "「{factorLabel}」があなたの好みに合う作品です。",
    positiveLowerAxisAdjustment: "「{factorLabel}」が控えめな点が、あなたの好みに合う作品です。",
    cautionSimilarityWithAnchor:
      "ただし「{factorLabel}」は、『{anchorTitle}』で好きだった傾向と少し異なります。",
    cautionSimilarityWithoutAnchor: "ただし「{factorLabel}」は、あなたの好みと少し異なります。",
    baselineGenreWithAnchor: "『{anchorTitle}』と「{factorLabel}」が共通しています。",
    baselineGenreWithoutAnchor: "「{factorLabel}」のジャンル一致を順位に反映しています。",
    baselineMarketObserved: "第1巻のレビュー情報を順位に反映しています。",
    baselineMaturity: "刊行の蓄積を順位に反映しています。",
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
  preferVerified: "検証済み作品を優先",
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
} as const;

export const designSystemStrings = {
  close: "閉じる",
} as const;

export const mediaStrings = {
  openDetails: (title: string) => `「${title}」の作品詳細を見る`,
  previous: (title: string) => `${title}を前へ送る`,
  next: (title: string) => `${title}を次へ送る`,
  rank: (position: number) => `${String(position)}位`,
  topTenLabel: "TOP 10",
  topTenBadge: {
    top: "TOP",
    ten: "10",
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
} as const;

export const landingStrings = {
  metadataTitle: "konocomics | 好みから見つける、次のマンガ。",
  logoCaption: {
    japanese: "好み",
    equation: "kono + mi = このみ",
  },
  tagline: "好みから見つける、次のマンガ。",
  description: [
    "マンガの好みを分析し、理由とともに次の一冊を提案します。",
    "好きな作品を選ぶと、Manga DNA と理由つきのおすすめがわかります。",
  ],
  cta: "好きなマンガから始める",
  hero: {
    eyebrow: "理由がわかるマンガ推薦",
    trust: ["登録なしですぐ始める", "データはこの端末だけに保存", "推薦理由を根拠から表示"],
  },
  showcase: {
    title: "まず出会いたい作品",
    description: "カタログから幅広い作品を紹介しています。個人向けの順位ではありません。",
  },
  ranking: {
    title: "カタログ Top 10",
    description: "作品を探し始めるための中立なカタログ順です。人気順位ではありません。",
  },
  discovery: {
    title: "まだ知らない一冊へ",
    description: "ジャンルを横断して、好みを登録する前に作品を眺められます。",
  },
  stepsHeading: "konocomics でできること",
  steps: [
    {
      title: "選ぶ",
      description: "好きなマンガを 5〜10 作品選びます。",
    },
    {
      title: "好みが見える",
      description: "選んだ作品から Manga DNA を分析します。",
    },
    {
      title: "理由つきでおすすめ",
      description: "好みに合う理由とともに、次の作品を提案します。",
    },
  ],
  illustration: {
    dna: "Manga DNA",
    reason: "おすすめ理由",
  },
  footer: {
    credit: "Supported by Rakuten Developers",
    storage: "データはこのブラウザにだけ保存されます。",
    settings: "設定・データ管理",
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
  stepProgress: {
    label: "好み登録の進み具合",
    selection: "作品を選ぶ",
    dna: "DNAを確認",
    recommendations: "おすすめへ",
  },
  addMode: {
    eyebrow: "作品を追加",
    title: "好きなマンガを追加してください",
    description:
      "新しく選んだ作品を Manga DNA と次のおすすめに反映します。1〜10作品まで追加できます。",
    selectedTray: "追加するマンガ",
    emptySelected: "まだ追加する作品がありません",
    minimum: "1作品以上えらんでください",
    submit: (count: number) => `追加する (${String(count)}/10)`,
    saving: "追加しています…",
    close: "DNAに戻る",
    discard: "入力内容を破棄",
    discardError: "入力内容を破棄できませんでした。もう一度お試しください。",
  },
  step1: {
    eyebrow: "STEP 1 / 2",
    title: "好きなマンガを 5〜10 作品えらんでください",
    description: "選んだ作品から、物語や雰囲気の好みを読み取ります。",
    benefits: [
      { title: "好みが伝わる", description: "作品の共通点から傾向を見つけます。" },
      { title: "根拠がわかる", description: "選んだ作品をおすすめ理由につなげます。" },
      { title: "あとから調整", description: "Manga DNA はいつでも見直せます。" },
    ],
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
    guidance: [
      "最近夢中になった作品から選ぶ",
      "違うジャンルを混ぜて選ぶ",
      "5〜10作品の範囲で、無理に埋めない",
      "選んだ内容はあとから追加・調整できる",
    ],
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
    description: "0〜3作品まで。選ばないことは、苦手という意味にはなりません。",
    searchLabel: "合わなかったマンガを検索",
    searchPlaceholder: "タイトル・作者名を入力",
    emptySearch: "作品名を入力すると候補が表示されます。",
    noResults: "見つかりませんでした。別の書き方で試してください",
    selectedPositive: "好きに選択済み",
    selectedNegative: "追加済み",
    maximum: "最大 3 作品までです",
    disposition: "この作品について",
    disliked: "合わなかった",
    dropped: "途中でやめた",
    reasons: "理由を選ぶ",
    noReason: "理由なし = 弱くだけ反映されます",
    externalHelper: "この理由はおすすめの計算には使いません。",
    remove: "この作品を外す",
    skip: "スキップ",
    finish: "好みを見る",
    saving: "保存しています…",
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
  eyebrow: "MANGA DNA",
  title: "あなたの Manga DNA",
  description: "選んだ作品と読書記録から、物語・雰囲気・作画の好みを整理しました。",
  confidence: "分析の確信度",
  confidenceLabels: {
    high: "高い",
    normal: "ふつう",
    low: "低め(データ収集中)",
  },
  anchorsHeading: "選んだマンガ",
  radarHeading: "好みの分布",
  radarPending: "確認できる好みの軸を分析しています。",
  radarAxisSummary: (label: string, value: string) => `${label}：${value}`,
  topPreferencesHeading: "あなたの上位の好み",
  topPreferenceEvidence: (titles: readonly string[]) =>
    `${titles.map((title) => `『${title}』`).join("")}から`,
  topPreferencePending: "好みの特徴を分析しています。作品を追加すると見つけやすくなります。",
  groups: {
    theme: "テーマ",
    narrative: "展開",
    tone: "トーン・関係",
    art: "作画",
    genre: "ジャンル",
  },
  workspaceHeading: "おすすめを調整",
  modeLabel: "Manga DNA の表示モード",
  modes: {
    summary: "まとめ",
    adjust: "調整",
  },
  modeDescriptions: {
    summary: "現在の分析をグループごとに確認できます。",
    adjust:
      "分析結果は変わりません。設定は自動保存され、次のおすすめにだけ反映されます。「自動」は分析結果に合わせます。",
  },
  groupFactorSummary: (labels: readonly string[], remaining: number) =>
    remaining > 0 ? `${labels.join("、")} ほか${String(remaining)}項目` : labels.join("、"),
  groupAdjustmentAuto: "すべて自動",
  groupAdjustmentCount: (count: number) => `${String(count)}項目を調整中`,
  groupAnalysisCount: (count: number) => `${String(count)}項目を分析`,
  groupDetails: "詳細設定",
  groupClose: "閉じる",
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
  previewHeading: "好み調整後のおすすめ変化",
  previewDescription: "同じおすすめ計算で、ページを開いた時と現在の work ID を比較します。",
  previewBefore: "ページを開いた時",
  previewAfter: "現在の調整",
  previewEmpty: "表示できる候補はありません。",
  previewUnavailable: "おすすめの変化を計算できませんでした。",
  previewUnchanged: "おすすめ順に変化はありません。",
  previewChanged: "おすすめ順に変化があります。",
  recentFeedbackHeading: "最近の記録",
  feedbackLabels: {
    favorite: "大好き",
    liked: "好き",
    neutral: "ふつう",
    disliked: "合わなかった",
  },
  readingStateLabels: {
    planned: "読みたい",
    reading: "読んでいる",
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
  feedbackWithReason: (status: string, reason: string) => `${status} · ${reason}`,
  addWorks: "作品を追加して精度を上げる",
  recommendations: "おすすめを見る",
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
  policyLabels: recommendationPolicyLabels,
  update: "更新",
  updating: "更新しています…",
  pendingChanges: "おすすめに未反映の変更があります。",
  criteria: {
    heading: "今回のおすすめ基準",
    description: "保存した読書記録、Manga DNA、おすすめ方針だけを使っています。",
    records: "読書記録",
    recordCount: (count: number) => `${String(count)}作品を反映`,
    preferences: "上位の好み",
    policies: "適用中の条件",
    policyCount: (count: number) => (count === 0 ? "標準の並び順" : `${String(count)}件を反映`),
  },
  filters: {
    genre: "ジャンル",
    allGenres: "すべて",
    shelf: "表示位置",
    allShelves: "すべての棚",
    sort: "並び順",
    recommended: "おすすめ順",
    empty: "この条件で表示できる作品はありません。ジャンルを変えてお試しください。",
  },
  shelves: {
    featured: {
      title: "あなたのために選んだ作品",
      description: "推薦結果の順番を変えず、理由と読書アクションをまとめています。",
    },
    anchor: {
      title: "好きな作品から広げる",
      description: "推薦プランの順番を保ったまま、根拠作品から次の候補を探せます。",
    },
    discovery: {
      title: "隠れた候補",
      description: "推薦エンジンが discovery とした候補だけを表示しています。",
    },
    completed: {
      title: "完結作から選ぶ",
      description: "推薦プラン内の完結作品です。順位の再計算はしていません。",
    },
    ranking: {
      title: "あなたの Top 10",
      description: "現在の推薦結果をそのまま1位から並べています。",
    },
  },
  quickPreview: {
    open: (title: string) => `「${title}」をクイック表示`,
    description: "おすすめ理由と読書状態を、詳細へ移動せずに確認できます。",
    details: "作品詳細を見る",
  },
  feedbackSummary: {
    heading: "記録した内容を反映しています",
    description: "読了と興味なしの記録は、次回のおすすめ更新に使われます。",
    count: (count: number) => `${String(count)}作品`,
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
    link: "Manga DNA を見る",
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
  },
  compatibility: {
    heading: "あなたとの相性",
    reasons: "合いそうな理由",
    caution: "好みと異なる点",
    anchors: "根拠になった作品",
    confidence: "分析の確信度",
    unavailable: "現在の好みから相性を表示できません。",
  },
  related: {
    heading: "似た作品",
    description: "主要テーマが重なるカタログ作品です。",
  },
  sameMood: {
    heading: "同じ雰囲気の作品",
    description: "確認済みの作品ファクターが近いカタログ作品です。",
  },
  synopsis: {
    heading: "作品紹介",
    unavailable: "作品紹介を取得できませんでした。",
  },
  factors: {
    heading: "この作品の主要ファクター",
    empty: "主要ファクターはまだ確認できません。",
  },
  state: {
    heading: "読書状態",
    loading: "保存した読書状態を確認しています…",
    label: "読書状態を変更",
    prompt: "状態を選ぶ",
    options: {
      planned: "読みたい",
      reading: "読んでいる",
      completed: "読んだ",
      dropped: "途中でやめた",
      hidden: "興味なし",
    },
    plannedAdd: "読みたい",
    plannedRemove: "読みたいから外す",
    managedByState: "現在の記録は読書状態から変更できます。",
    saving: "保存しています…",
    saved: "読書状態を保存しました。",
    plannedSaved: "読みたいに追加しました。",
    plannedRemoved: "読みたいから外しました。",
    plannedAlreadyAbsent: "すでに読みたいから外れています。",
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
      preferVerified: "ファクター確認済みの作品を優先します。",
      excludeIncomplete: "刊行状況を確認できない作品を候補から外します。",
    },
    loading: "保存した方針を読み込んでいます…",
    saving: "方針を保存しています…",
    error: "おすすめの方針を保存できませんでした。変更前の状態に戻しました。",
  },
  sections: {
    label: "設定セクション",
    items: {
      policies: "おすすめ",
      data: "データ",
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
  localData: {
    title: "ローカルデータとプライバシー",
    privacy: "データを外部へ送信せず、この端末のブラウザ内で処理します。",
  },
  data: {
    title: "データ",
    description: "このブラウザに保存したデータを、書き出し・復元・削除できます。",
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
      description: "このブラウザに保存した konocomics のデータをすべて削除します。",
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
    providerLabel: "書誌・販売情報",
    providerCredit: "Supported by Rakuten Developers",
    affiliateLabel: "アフィリエイト",
    affiliateRelationship:
      "アフィリエイトIDが設定されている場合、楽天ブックスへのリンクにアフィリエイト情報が含まれます。",
    licenseLabel: "ライセンス",
    licenseUnset: "未設定",
    showIntroduction: "紹介をもう一度見る",
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
    reading: "読んでる",
    completed: "読んだ",
    dropped: "途中でやめた",
    hidden: "非表示",
  },
  listLabel: (state: string) => `${state}作品`,
  summary: {
    heading: "読書状態の件数",
    total: "全作品",
    count: (count: number) => `${String(count)} 作品`,
  },
  toolbar: {
    searchLabel: "ライブラリ内を検索",
    searchPlaceholder: "タイトル・作者で検索",
    sortLabel: "並び順",
    sortUpdated: "最近更新",
    sortTitle: "タイトル順",
    viewLabel: "表示方法",
    views: { grid: "グリッド", list: "リスト" },
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
    heading: "ライブラリ管理",
    description: "エクスポート、インポート、全削除は設定で管理します。",
    openSettings: "データ設定を開く",
  },
  progress: (volume: number | undefined, chapter: number | undefined) =>
    [
      volume === undefined ? null : `${String(volume)}巻`,
      chapter === undefined ? null : `${String(chapter)}話`,
    ]
      .filter((value): value is string => value !== null)
      .join("・"),
  openRecord: (title: string) => `「${title}」の記録を編集`,
  updatedAt: (date: string) => `更新 ${date}`,
  overallEmpty: {
    title: "まだ作品がありません",
    description: "読んだ作品を記録すると、おすすめから自動的に外れます。",
  },
  tabEmpty: {
    planned: "読みたい作品はまだありません。",
    reading: "読んでいる作品はまだありません。",
    completed: "読んだ作品はまだありません。",
    dropped: "途中でやめた作品はまだありません。",
    hidden: "非表示にした作品はまだありません。",
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
    placeholder: "作品名または作者名",
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
