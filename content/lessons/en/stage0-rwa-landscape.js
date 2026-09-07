export default {
  id: "rwa-landscape",
  stage: 0,
  order: 4,
  title: "The RWA Landscape: Treasuries · Credit · Real Estate · Commodities · Funds · Stablecoins",
  difficulty: "intro",
  prereqs: ["what-is-rwa"],

  oneLiner:
    "The RWA market of 2025 is wildly lopsided: stablecoins at roughly $250–300 billion dwarf everything, tokenized Treasuries at $7–8 billion grow fastest, private credit quietly runs past $10 billion, gold sits at $1–2 billion, and real estate plus equities together are a rounding error. This is not random — **which assets tokenize first follows a predictable rule**: the more standardized, higher-quality, yield-bearing, legally simple, and already-electronic an asset is, the sooner it goes on-chain. Learn the rule and you can forecast the next wave yourself.",

  intuition: `
If you only read headlines, your mental image of the RWA market is probably: tokenization everywhere — houses, stocks, art, carbon credits, a hundred flowers blooming.

The real map looks nothing like that. It looks like a **wildly unbalanced report card**: one subject (stablecoins) is so far ahead that it beats all the others combined more than tenfold; one subject (Treasuries) has a modest score but terrifying momentum; a few subjects (credit, gold) quietly pass; and a pile of subjects (real estate, equities, art) — perennial stars of conference slides — have market sizes comparable to the valuation of one mid-sized shopping mall.

Why? The lazy answer is “it's early.” The expert answer is far more interesting: **the order in which assets get tokenized is not random — it follows a strict rule.** Understand the rule and the lopsided map suddenly becomes tidy: every sector's size and rank is what the rule computes. Better still, you can use it to **predict** which assets come on-chain over the next five years — and which sectors' marketing to discount.

In this lesson we tour the 2025 map sector by sector, asking four things of each: **what exactly got tokenized, who buys it, what the token legally is, and how mature it is.** Then we extract the rule and run one forecast with it.

**Here's the map — five parts:**

- **① The scale bar first: a map sorted by size**
- **② The big three: stablecoins, tokenized Treasuries, private credit**
- **③ The rest: gold, bonds, real estate, equities**
- **④ The rule: what tokenizes first (five factors)**
- **⑤ Forecasting with the rule: the next five years, in order**
`,

  mechanics: `
### ① The scale bar first: a map sorted by size

Orders of magnitude as of 2025 (remember magnitudes, not decimals — the market moves every quarter):

- **Stablecoins: roughly $250–300 billion.** USDT above $170B, USDC above $65B.
- **Tokenized Treasuries and money funds: roughly $7–8 billion.** BUIDL, BENJI, Ondo and peers — in early 2023 this figure was under $500 million: **more than tenfold in two years.**
- **Private credit: over $10 billion of on-chain loan balances.** Figure alone accounts for most of it.
- **Gold and commodities: roughly $1–2 billion.** PAXG and XAUT dominate (with gold's 2025 rally, PAXG alone passed $1B).
- **Tokenized bonds**: mostly institutional pilots, hundreds of millions per issuance (EIB, Hong Kong green bonds).
- **Tokenized equities, real estate, other alternatives**: a few hundred million combined — the map's rounding error.

Lesson one already said it: the stablecoin is the giant hiding in plain sight. Many people exclude stablecoins when discussing RWA and count only “yield-bearing RWA” — fine, but know what you're excluding: **a tokenized claim on dollars is an RWA** (the Stage 0.1 definition), and it validated the entire template — off-chain reserves + on-chain token + redemption promise — at hundreds-of-billions scale. Every other sector is copying that template with “dollars” swapped for something else.

<figure><svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><text x="320" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">The 2025 RWA map (log scale — linear wouldn't fit)</text><rect x="120" y="38" width="480" height="24" rx="5" fill="var(--orange-soft)" stroke="var(--orange-line)" stroke-width="1.5"/><text x="126" y="54" font-size="10" font-weight="700" fill="var(--orange-ink)">Stablecoins ≈ $250–300B</text><rect x="120" y="70" width="300" height="24" rx="5" fill="var(--green-soft)" stroke="var(--line)" stroke-width="1.5"/><text x="126" y="86" font-size="10" font-weight="600" fill="var(--ink)">Private credit ≈ $10B+</text><rect x="120" y="102" width="285" height="24" rx="5" fill="var(--green-soft)" stroke="var(--line)" stroke-width="1.5"/><text x="126" y="118" font-size="10" font-weight="600" fill="var(--ink)">Tokenized Treasuries ≈ $7–8B (fastest growth)</text><rect x="120" y="134" width="215" height="24" rx="5" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1.5"/><text x="126" y="150" font-size="10" fill="var(--ink)">Gold/commodities ≈ $1–2B</text><rect x="120" y="166" width="150" height="24" rx="5" fill="var(--surface-2)" stroke="var(--line)" stroke-width="1.5"/><text x="126" y="182" font-size="10" fill="var(--ink)">Bond pilots · $100M+/issue</text><rect x="120" y="198" width="105" height="24" rx="5" fill="var(--red-soft)" stroke="var(--line)" stroke-width="1.5"/><text x="126" y="214" font-size="10" fill="var(--ink)">RE + equities: crumbs</text><text x="612" y="214" text-anchor="end" font-size="9" fill="var(--muted)">as of 2025, magnitudes only</text></svg></figure>

### ② The big three: stablecoins, tokenized Treasuries, private credit

**Stablecoins (~$250–300B).** What's tokenized: **a dollar claim against the issuer**, reserved with bank deposits and short-term Treasuries. Who buys: everyone on Earth who needs “dollars that never close” — traders, cross-border remitters, savers in high-inflation countries. Legal identity: long murky, clarifying since 2025 — the US GENIUS Act defines regulated “payment stablecoins”; the EU's MiCA classes them as e-money tokens (EMTs). Maturity: **five stars — product-market fit beyond dispute.** All of Stage 4 dissects them.

**Tokenized Treasuries and money funds (~$7–8B).** What's tokenized: **fund shares** — the fund holds short-term Treasuries, with a daily NAV. Who buys: crypto-institution treasuries (exchanges, market makers, DAO reserves) — their money already lives on-chain, and parking it in BUIDL earns 4–5% without off-ramping. Flagships: BUIDL (BlackRock×Securitize, $5M minimum, Reg D Qualified Purchasers, daily dividends, BNY Mellon custody), BENJI (Franklin Templeton, **the first US-registered fund to keep its official shareholder register on a public chain**), and Ondo's OUSG/USDY pair (Stage 10.2). Legal identity: unambiguous securities. Maturity: **four stars — the flagship institutional category, fastest growth on the board.**

**Private credit ($10B+).** What's tokenized: **interests in loans** — home-equity lines (HELOCs), business loans, emerging-market credit. The contrast in this sector is stark: the loudest names, Maple and Goldfinch, paid brutal tuition in defaults (Orthogonal's collapse after FTX; emerging-market borrower defaults — the autopsy is Stage 10.3); meanwhile the true giant, **Figure, barely issues press releases** — it moved HELOC origination, packaging, and transfer onto its own chain, and its balances make up most of the category. Who buys: yield-hunting institutions and accredited investors. Legal identity: securities (notes or fund interests). Maturity: **three stars — the model works, risk management varies wildly; picking the platform matters more than picking the category.**

### ③ The rest: gold, bonds, real estate, equities

**Gold and commodities ($1–2B).** What's tokenized: **title to specific bars** — each PAXG maps to one fine troy ounce of a numbered bar in a London vault, under NYDFS trust regulation, redeemable in metal; XAUT (Tether's) is similar with lighter oversight. Who buys: crypto users who want gold without vault logistics. Maturity: **three and a half stars — a sound, stable product that looks small next to ETFs** (GLD holds tens of billions): on-chain gold doesn't yet solve a problem most people can't solve elsewhere (Stage 10.5).

**Tokenized bonds (pilots).** What's tokenized: **the bond itself** — issuance directly on-chain, no fund wrapper. Milestones: the European Investment Bank has issued digital bonds since 2021; Hong Kong sold an HK$800M tokenized green bond in 2023 and scaled to a multi-currency, multi-billion-HK$ issue in 2024 — governments personally testing the pipes. Who buys: invited institutions. Meaning exceeds size: **this is a live test of a bond market that needs no central securities depository (CSD)** (Stages 11.3, 11.4). Maturity: two and a half stars — pipes proven, awaiting routine use.

**Real estate (crumbs).** What's tokenized is usually **equity in an SPV that owns the property** (Stage 5.2), not the deed — land registries don't recognize tokens. The RealT model — $50 fractions, weekly rent — sounds lovely, but Stage 0.3 covered fractions ≠ liquidity, and the Detroit litigation proved “token fine, asset messy” is the norm. Maturity: **two stars — the most intuitive use case, in practice the hardest category.**

**Equities (pilots).** The 2025 crop — Robinhood's European “stock tokens,” xStocks and peers — are mostly, in law, **price-tracking derivatives or certificates**, not shares: no votes, no place on the shareholder register. Native tokenized equity waits on corporate-law and registry reform (Stage ∞.1). Maturity: one and a half stars.

Touring the sectors, you should notice one recurring sentence: “what's actually tokenized is a **claim / share / interest in X**, not X itself.” That is the through-line — **the token is a receipt** — incarnated sector by sector.

### ④ The rule: what tokenizes first (five factors)

Now flip the map over and read the algorithm on the back. Whether a category breaks out first depends on five factors:

- **Standardization**: one dollar equals any other dollar (fungible); one house differs from every other house. Only fungible assets can pool deep liquidity.
- **Asset quality**: the first movers are all top-credit assets (dollars, Treasuries, investment grade). A young market can't survive “the asset itself blew up” stacked on “people already doubt the model.”
- **Yield**: 4–5% Treasury yield gives you a reason to hold the token (Stage 3.2). Non-yielding assets struggle to cold-start (gold excepted — it has a millennia-old brand).
- **Legal simplicity**: transferring fund shares is legally assembly-lined; conveying real property is bespoke surgery every time.
- **Already electronic**: Treasuries and fund shares are database records already (Stage 0.2) — “swap the ledger” suffices; physical assets first need “does off-chain match on-chain” verification solved.

Apply the yardstick: **T-bills score five for five** — fungible, sovereign credit, yielding, mature fund law, purely electronic — so tokenized Treasuries being the growth champion is zero surprise. **Residential real estate scores nearly zero for five** — non-standard, high variance, thin and troublesome rent yield, heaviest law, registries on paper or local systems — so it's hardest. Stablecoins are the exception that proves the rule: dollars don't yield, but the functional value of “dollars that never close” is strong enough to cover the missing factor.

### ⑤ Forecasting with the rule: the next five years, in order

The five factors don't just explain the present — they rank the future. Sorting categories by factor score:

- **Money funds and Treasuries (already erupting)** → keep swelling, spreading from crypto treasuries to conventional corporate cash management.
- **Bonds (pipes under test)** → governments and large issuers normalize digital bonds: highly standardized, yielding, legally mature — only registry reform is missing (the EU DLT Pilot, Hong Kong, and Switzerland are paving it).
- **Private credit (growing)** → keeps compounding quietly — its whole trade is standardizing and packaging non-standard assets, and the chain is just a faster securitization pipeline.
- **Deposit tokens (banks step in)** → commercial banks tokenize **bank deposits themselves** (JPMorgan and peers have piloted) — five high factor scores, waiting only on regulatory settling (Stage ∞.1).
- **Equities** → wait for corporate law to recognize on-chain shareholder registers (Delaware and Wyoming have cracked the door, Stage 5.3); slower than people expect.
- **Real estate and alternatives (last)** → here for the long run, but mostly as “fund-share wrappers,” not “buy a slice of one building.”

Copy that ordering into your notebook: **next time you see a “tokenizing asset X” headline, run the five factors and you'll know whether it's riding the current or swimming against it.** If you take away one sentence: **the RWA map is not a hundred flowers blooming — it's one rule developing like a photograph: standardized, high-quality, yielding, legally simple, already-electronic assets go first; stablecoins proved the template, Treasuries are copying it, and houses and stocks must wait for the world to finish its homework.**
`,

  demo: "landscape-map",

  analogy: `
Think of “which assets tokenize first” as **the history of e-commerce**. Why did Amazon start with **books** in 1995? Not because books were the most profitable, but because books were the perfect cold-start product: **standardized** (an ISBN pins each one down; your copy equals mine), **durable** (low quality variance), **easy to ship** (simple logistics), and **already catalogued digitally** (book databases existed).

The sequence that followed was entirely predictable: books → CDs/DVDs → electronics → clothing (sizing and returns to solve) → groceries (cold chain — hardest) → cars and houses (still mostly browse-online, close-offline today). Each step up, the goods get less standard and demand more trust, and e-commerce had to build another layer of infrastructure: review systems, return logistics, refrigerated warehouses.

RWA is replaying that curve: **stablecoins are the books** (standard, simple, rigid demand), **Treasury funds are the CDs** (standard and yielding, scaling now), **private credit is the clothing** (variance and returns — defaults — to manage), **real estate is groceries plus cars** (non-standard, law-heavy, highest trust bar). So don't mock “it's 2025 and nobody has tokenized a skyscraper successfully” — nobody could sell houses online in 1999 either. And don't flip to the opposite error of “real-estate tokenization will never work” — grocery e-commerce got there eventually; it just needed ten times the infrastructure that books did (the cold chain = Stage 5's legal wrappers + Stage 8's data pipelines).
`,

  misconceptions: [
    "“The RWA market is blooming evenly across categories.” —— The map is wildly lopsided: stablecoins alone, at ~$250–300B, are more than ten times everything else combined; real estate plus equities are crumbs. Separating “conference-slide buzz” from “balance-sheet size” is beginner lesson one.",
    "“Stablecoins shouldn't count when sizing RWA.” —— You may exclude them, but know what you're excluding: stablecoins fit the RWA definition exactly (off-chain reserves + on-chain token + redemption promise) and are the only category validated at hundreds of billions. Calling RWA “still tiny” after excluding them is like calling the computing-device market tiny after excluding smartphones.",
    "“Real estate is the biggest asset class, so it will tokenize at scale first.” —— The opposite. Off-chain market size has almost nothing to do with on-chain order; the five factors do: property is non-standard, law-heavy, and not electronic — failing on nearly every count. The biggest cake is the hardest to carry to the table.",
    "“Buying a tokenized stock makes me a shareholder.” —— Most 2025 “stock tokens” (Robinhood's EU product, xStocks and the like) are legally price-tracking derivatives or certificates: no vote, no entry on the register. One question settles it: are you on the issuer's shareholder register? If not, you hold price exposure, not equity.",
    "“Private credit is quiet, so it must be doing badly.” —— Inverted. In this sector volume of noise and volume of assets are negatively correlated: Maple and Goldfinch, who paid dearly in defaults, made the most headlines, while Figure — holding most of the category's balances with its on-chain HELOC pipeline — barely advertises (Stage 10.3).",
  ],

  quiz: [
    {
      q: "As of 2025, the largest RWA category is?",
      options: [
        "Tokenized real estate",
        "Stablecoins — roughly $250–300 billion, more than ten times all other categories combined",
        "Tokenized equities",
        "Carbon credits",
      ],
      answer: 1,
      explain: "The giant hiding in plain sight: a tokenized dollar claim fits the RWA definition exactly, and it's the only category validated at hundreds-of-billions scale.",
    },
    {
      q: "Who are the main buyers of tokenized Treasury funds (BUIDL and peers)?",
      options: [
        "Ordinary retail investors",
        "Crypto-institution treasuries — exchanges, market makers, DAOs: their money already lives on-chain, and parking it there earns 4–5% without off-ramping",
        "Central banks",
        "Real-estate developers",
      ],
      answer: 1,
      explain: "The demand logic: idle on-chain stablecoins earn nothing; tokenized Treasuries let that money earn Treasury yield without leaving the chain — hence the fastest growth on the board.",
    },
    {
      q: "In the five-factor framework, why is the T-bill the “perfect tokenization asset”?",
      options: [
        "Because its price swings make it good for speculation",
        "Because it scores five for five: fungible, sovereign credit, 4–5% yield, mature fund law, already a purely electronic record",
        "Because it is unregulated",
        "Because it is a physical asset",
      ],
      answer: 1,
      explain: "Standardized, high-quality, yielding, legally simple, already electronic — full marks on every factor, which is why tokenized Treasuries lead the institutional wave; property fails every factor, which is why it's hardest.",
    },
    {
      q: "What is the legal substance of most 2025 “tokenized stocks” (e.g. Robinhood's European product)?",
      options: [
        "Actual shares — buying one makes you a shareholder",
        "Price-tracking derivatives or certificates — holders get price exposure, with no vote and no entry on the shareholder register",
        "Corporate bonds",
        "Fund shares",
      ],
      answer: 1,
      explain: "Native tokenized equity waits for corporate law to recognize on-chain registers (Delaware and Wyoming have cracked the door, Stage 5.3). The test: are you on the issuer's register?",
    },
    {
      q: "Using the five-factor rule, which category is likeliest to scale on-chain next?",
      options: [
        "Direct fractions of individual luxury homes",
        "Fine art",
        "Bonds and bank-deposit tokens — highly standardized, yielding, legally mature, waiting only on registry reform and regulatory settling",
        "In-game items",
      ],
      answer: 2,
      explain: "The rough order: funds/Treasuries (erupting) → bonds (pipes testing) → credit → deposit tokens → equities → real estate and exotics. Higher factor score, earlier in line.",
    },
  ],

  further: [
    { label: "rwa.xyz: live sizes for every category (the dynamic version of this lesson's map)", url: "https://app.rwa.xyz" },
    { label: "European Investment Bank: first digital bond on a public blockchain (the bond sector's milestone)", url: "https://www.eib.org/en/press/all/2021-141-european-investment-bank-eib-issues-its-first-ever-digital-bond-on-a-public-blockchain" },
    { label: "Hong Kong Monetary Authority: tokenized green bond announcement", url: "https://www.hkma.gov.hk/eng/news-and-media/press-releases/2023/02/20230216-3/" },
    { label: "Paxos: the PAXG gold token (the commodities flagship)", url: "https://paxos.com/paxg" },
    { label: "Centrifuge: pioneer of on-chain asset pools (private credit)", url: "https://centrifuge.io" },
  ],
};
