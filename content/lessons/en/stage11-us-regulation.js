export default {
  id: "us-regulation",
  stage: 11,
  order: 1,
  title: "The US: Howey, Reg D/S/A+ & ATSs",
  difficulty: "mastery",
  prereqs: ["investor-eligibility", "stablecoin-regulation"],

  oneLiner:
    "The core of US RWA regulation isn't some \"crypto law\" — it's a court case from 1946: the Howey test, which looks only at economic substance, never at technical form. Answer four questions and a token is either a security (enter the SEC's compliance menu: registration, Reg D, Reg S, Reg A+) or it isn't (report to the CFTC or the GENIUS Act instead). And RWA's coming-of-age moment is precisely this: most RWA tokens are securities on purpose — the game isn't dodging Howey, it's complying efficiently.",

  intuition: `
Florida, 1946. A company called **W.J. Howey** had a bright idea: carve its orange groves into small plots and sell them to tourists — you buy a few rows of orange trees, then conveniently sign a "service contract" under which the Howey company plants, harvests, and sells for you, mailing you a share of the profits at year's end. Most buyers were hotel guests on vacation who had never touched a hoe in their lives.

The SEC took Howey to court: this isn't selling land — it's **selling an investment** that was never registered as a security. The case went all the way to the Supreme Court. Howey's defense sounds familiar: "We sell land and service contracts — ordinary commercial contracts, not securities." In today's language: "We sell tokens. It's software, not a security."

The Supreme Court's answer defined the next eighty years: **look at economic substance, not the contract's costume** (substance over form). Call it a deed, an orange tree, or a token — if buyers put in money, count on someone else to do the work, and wait for their share of the profits, it's an **investment contract**, hence a security, hence governed by securities law. Those four conditions became the **Howey test**, still the first yardstick US regulators hold up to any crypto asset.

For you, arriving at Stage 11, this lesson's job is to assemble scattered pieces into one picture: Stage 4.4 covered the GENIUS stablecoin act, Stage 7.2 covered Reg D/S buyer eligibility, Stage 5.3 covered register laws — now we sit in the **issuer's and regulator's** chairs and walk the whole American machine. (The customary reminder: this stage is an educational tour, not legal advice — if you're actually issuing, hire a real lawyer.)

**Here's the map — five parts:**

- **① The Howey test: four questions, six assets on trial**
- **② The compliance menu: registration and exemptions from the issuer's chair**
- **③ The trading & intermediary layer: broker-dealers, ATSs, transfer agents, custody**
- **④ From regulation-by-enforcement to regulation-by-framework: the 2017–2025 arc**
- **⑤ The state layer: New York, Wyoming, Delaware**
`,

  mechanics: `
### ① The Howey test: four questions, six assets on trial

An **investment contract** — one species of security — has four elements: **(1) an investment of money**; **(2) in a common enterprise** (everyone's money pooled, fates tied together); **(3) with an expectation of profit**; **(4) derived primarily from the efforts of others** (there's a promoter doing the work). All **four** must be satisfied to make a security; miss any one and it isn't.

<figure><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="usreg-en-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--orange-line)"/></marker></defs><rect x="20" y="95" width="110" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="75" y="117" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">Any transaction</text><text x="75" y="134" font-size="9" fill="var(--muted)" text-anchor="middle">token / deed / orange trees</text><g><rect x="160" y="20" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="38" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">① Money invested?</text><text x="235" y="54" font-size="9" fill="var(--muted)" text-anchor="middle">fiat or crypto both count</text><rect x="160" y="76" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="94" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">② Common enterprise?</text><text x="235" y="110" font-size="9" fill="var(--muted)" text-anchor="middle">pooled funds · tied fates</text><rect x="160" y="132" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="150" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">③ Profit expected?</text><text x="235" y="166" font-size="9" fill="var(--muted)" text-anchor="middle">did you buy it to make money</text><rect x="160" y="188" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="206" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">④ Others' efforts?</text><text x="235" y="222" font-size="9" fill="var(--muted)" text-anchor="middle">a promoter doing the work</text></g><path d="M130 121 L156 121" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#usreg-en-arr)"/><path d="M310 126 L360 126" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#usreg-en-arr)"/><rect x="364" y="40" width="250" height="72" rx="10" fill="var(--red-soft)" stroke="var(--line)"/><text x="489" y="64" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">All four hit → security</text><text x="489" y="82" font-size="10" fill="var(--muted)" text-anchor="middle">SEC's turf · register or find an exemption</text><text x="489" y="98" font-size="10" fill="var(--muted)" text-anchor="middle">(Reg D / Reg S / Reg A+ …)</text><rect x="364" y="132" width="250" height="72" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="489" y="156" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">Miss any one → not a security</text><text x="489" y="174" font-size="10" fill="var(--muted)" text-anchor="middle">commodity → CFTC · payment stablecoin → GENIUS</text><text x="489" y="190" font-size="10" fill="var(--muted)" text-anchor="middle">(other laws may still apply)</text></svg><figcaption>The Howey test: four gates; pass all of them and you're a security. It reads economic substance, not the contract's name.</figcaption></figure>

Now march six assets you already know through the gauntlet — this is the muscle the demo trains:

- **A tokenized fund share (e.g. BUIDL, Stage 10.1)**: money in ✓; funds pooled in one vehicle ✓; you buy it for the 4–5% Treasury yield ✓; the yield comes from BlackRock's team managing the fund ✓. **All four hit — a textbook security** — which is why BUIDL went Reg D from day one, sold only to Qualified Purchasers.
- **BTC**: money in ✓; but **no common enterprise and no promoter** — there is no "Bitcoin Inc." working on your behalf; the network is decentralized. SEC leadership across administrations has conceded BTC is not a security; it's treated as a **commodity**, with spot markets under the CFTC's anti-fraud jurisdiction.
- **A memecoin**: money in ✓; profit expectation ✓ (why else buy it); but "common enterprise" and "efforts of others" are **contested** — if no team is running anything and it's pure community froth, prong 4 may fail. A 2025 SEC staff statement leaned toward most memecoins not being securities — but add a team hyping a roadmap at launch and the analysis flips. The honest answer: **case by case, and real lawyers genuinely argue about it**.
- **USDC**: money in ✓; but **no expectation of profit** — 1 USDC always redeems for $1; you hold it to pay and to park, not to appreciate. Prong 3 fails → not a security → which is precisely the legal logic that lands it in the **payment instrument** bucket, governed by the GENIUS Act (Stage 4.4).
- **PAXG (Stage 10.5)**: money in ✓; profit expected (a bet on gold) ✓; but the profit comes from the **gold price**, not from Paxos's entrepreneurial efforts — Paxos merely vaults the bars. Prong 4 most likely fails → commodity analysis, like owning the bar itself.
- **A yield-bearing note (e.g. USDY)**: careful — this one doesn't go through Howey at all. It calls itself a **note**, and notes have their own case law: the **family resemblance test from Reves v. Ernst & Young (1990)**, which presumes a note is a security unless it resembles an exempt family like commercial paper. USDY ends up in the same place by a different road: it's a security, which is why it's sold only under Reg S to non-US persons (Stage 10.2). This footnote is a genuine expert's watershed: **knowing that Howey isn't the only test**.

**The RWA punchline**: the 2017 ICO game was "costume the token so it doesn't look like a security" (the utility-token script), and the graveyard is well stocked. Mature RWA plays the **opposite** game: BUIDL, OUSG, tokenized private credit… they **deliberately admit to being securities**, then pick the most efficient route on the compliance menu. Dodging Howey was the 2017 move; **efficient compliance** is the 2025 move.

### ② The compliance menu: registration and exemptions from the issuer's chair

In Stage 7.2 you sat in the buyer's chair and learned who may buy; now switch to the **issuer's** chair: once you've conceded it's a security, five doors open —

- **Full registration (S-1)**: file a registration statement like an IPO, then **report forever** (10-K annuals, 10-Q quarterlies). Anyone can buy, tokens transfer freely — but legal, audit, and ongoing compliance costs run into the millions. Franklin Templeton's BENJI took the registered-fund route (a 1940 Act fund), which is why retail can buy it.
- **Reg D 506(b)**: no registration, no public advertising, sell to unlimited **accredited investors** ($1M net worth excluding the home, or $200k/$300k income) plus up to 35 sophisticated non-accredited buyers. The workhorse private door.
- **Reg D 506(c)**: you MAY **advertise publicly**, but you must **verify** (not self-certify) that every buyer is accredited. RWA platforms love it, because the website itself is a solicitation.
- **Reg S**: sell only to **non-US persons**, offshore. USDY's door. Often paired with Reg D: one pool, two legs — US accredited investors through D, offshore buyers through S.
- **Reg A+**: the "mini-IPO," two tiers, up to **$75M** per 12 months, retail allowed, SEC-reviewed offering circular (Form 1-A) plus ongoing semi-annual reports. Sounds lovely, but review takes months and costs real money — real-estate tokenizations have tried it; few have scaled. **Reg CF** (crowdfunding, ≤$5M) is smaller still.

The price list: exemptions skip registration but bring **resale lockups** (Rule 144: a 12-month lock on private-placement securities — a big reason RWA secondary markets are hard, Stage 9.1) and **different disclosure liability** (private deals run on a PPM, and anti-fraud rules still apply: you may disclose less, you may not lie). Plus one hidden tripwire: **Exchange Act Section 12(g)** — cross **2,000 holders** (or 500 non-accredited) with $10M+ in assets and you're forced to become a public reporting company. That is the legal root of the holder caps you met in Stage 6.1: the holder cap inside \`canTransfer\` is that tripwire, compiled into code.

### ③ The trading & intermediary layer: broker-dealers, ATSs, transfer agents, custody

Issuing is only the start; **where it trades and who matches orders** is a separate stack of licenses:

- **Broker-dealer**: buying and selling securities for others requires broker-dealer registration under FINRA oversight. Digital-asset securities even have a dedicated custody regime (the special purpose broker-dealer).
- **ATS (Alternative Trading System)**: the **licensed venue category** for security tokens. Not an "exchange" (that's NYSE-tier registration) but a matching system operating under a broker-dealer license. **Securitize Markets, tZERO, INX** from Stage 9.1 are all ATSs. Liquidity is thin, but it's legal — that is the current reality of security-token secondary markets.
- **Transfer agent**: the registered intermediary that keeps the shareholder register (Stage 3.4). Securitize's clever move (Stage 10.1): **register as a transfer agent**, then assert "the on-chain token ledger IS the official register I maintain" — sliding the blockchain into a crack in the existing legal framework.
- **Custody**: who may lawfully hold customers' digital-asset securities? The "qualified custodian" debate ran for years. Accounting added a famous roadblock: **SAB 121** (2022) made custodians put customer crypto on their own balance sheets — banks ran the capital math and walked away. In early 2025 SAB 121 was **rescinded** (SAB 122), reopening the door for banks to custody crypto — one of the quiet accelerants behind 2025's institutional RWA buildout.

### ④ From regulation-by-enforcement to regulation-by-framework: the 2017–2025 arc

Compress eight years into one timeline and the direction becomes visible —

- **2017 · The DAO Report**: the SEC's investigative report: "DAO tokens are securities; **existing law applies**; no new law needed." The declaration of war on the ICO era.
- **2018–2019 · The ICO enforcement wave**: hundreds of projects fined, refunded, shuttered.
- **2020 · Telegram/TON**: Telegram raised $1.7B from accredited investors to launch Grams, arguing the tokens would no longer be securities on delivery. The court disagreed; the project was blocked and the money returned — lesson: **a two-step structure cannot outrun economic-substance analysis**.
- **2023 · Ripple's split decision**: the court held XRP's **direct institutional sales** were securities offerings (those buyers relied on Ripple's efforts) but **programmatic exchange sales** were not (anonymous buyers didn't know whom they were paying). Same token, different sales contexts, different outcomes — recasting "is the token a security" as "is **this transaction** a securities transaction."
- **2023 · Coinbase / Kraken sued**: the SEC charged the major exchanges with operating unregistered securities exchanges — the apex of **regulation by enforcement**: write no rules, draw lines with cases.
- **2025 · The turn**: new SEC leadership; most crypto suits **dropped or settled** (Coinbase included); a **Crypto Task Force** (chaired by Hester Peirce) building rules systematically; officials publicly floating an "**innovation exemption**" for tokenization; the **GENIUS Act** signed (Stage 4.4) giving payment stablecoins a federal framework; **CLARITY-style market-structure bills** advancing in Congress — the core being the SEC/CFTC boundary (securities vs commodity spot). Direction of travel: **from drawing lines with lawsuits to building frames with rules**.

The honest coda — two unresolved blocks: **tokenized equities for retail** (brokers are experimenting; the SEC hasn't settled its position, Stage ∞.1) and **DeFi's legal status** (how do you regulate a market with no issuer). The direction changed; the map isn't finished.

### ⑤ The state layer: one paragraph

Beneath the federal layer sit fifty states. Remember three: **New York's NYDFS** — BitLicense plus trust charters; Paxos's PAXG and its stablecoins ride on a New York trust charter (Stage 10.5), and NYDFS is de facto the strictest and most credible state regulator; **Wyoming** — SPDI special-purpose depository institutions (Kraken once held one) and America's first **DAO LLC** law (a limited-liability shell for DAOs); **Delaware** — its 2017 corporate-law amendment allowing **blockchain share registers** (Stage 5.3), and since more than half of large US companies incorporate there, that one amendment opened the door to "token = legal share record." State and federal stack: a compliant RWA offering typically walks a federal exemption and state money-transmitter/trust rules at the same time.

If you take away one sentence: **America governs 2025's tokens with a 1946 orange-grove case — economic substance over technical form — and the mark of mature RWA is that it stops dodging that yardstick and starts using it to pick the most efficient route to compliance.**
`,

  demo: "howey-test",

  analogy: `
Picture US securities regulation as an **airport security system**. The Howey test is the **first sorting gate**: four sensors sweep in turn — money in? pooled with others? hoping for profit? relying on someone else's work? All four lights on, and you're routed to the Securities Terminal; any light off, and you fly from a different terminal (the commodities terminal is CFTC's; the payments terminal is GENIUS's). The gate doesn't care what you're wearing ("I'm a utility token!") — it scans the economic substance in your pockets.

Inside the Securities Terminal you face **five screening lanes**: full registration is "international departures" — the fullest search, any passenger may board, but the longest queue and the highest fees; Reg D is the "priority lane" — fast, accredited passengers only; Reg S is "international transit" — fine, as long as you never enter US territory; Reg A+ is the "group lane" — medium size, medium scrutiny. There is no skip-security lane, only different ways to queue.

Past screening, you're still not done: **gates have gate rules**. You can't wander the tarmac and board any plane — security tokens dock only at licensed gates (ATSs), and luggage goes through licensed handlers (transfer agents, custodians). The 2017 ICO cohort was a crowd hopping the fence and sprinting for the runway; you saw how that ended in Stage 10.6.

And the change from 2017 to 2025 is airport management shifting from "**fine whoever we catch**" (enforcement) to "**put up clear signage**" (rulemaking). Same runways, same screening standards — what changed is that now you can find out, in advance, how each queue works.
`,

  misconceptions: [
    "\"Tokens are software, not securities.\" —— Howey reads economic substance, not the medium. Orange trees, deeds, and tokens can all be \"investment contracts.\" In 1946 Howey said \"we sell land and service contracts\"; the Supreme Court's answer hasn't changed in eighty years: it's the economic relationship you sell, not the name you give it.",
    "\"All crypto tokens are securities (or none are).\" —— Case by case. BTC lacks a common enterprise and a promoter (not a security); USDC lacks profit expectation (not a security — a payment instrument); BUIDL hits all four prongs (a security); PAXG's profit comes from the gold price, not entrepreneurial effort (commodity analysis). Both flavors of the blanket claim are wrong.",
    "\"An RWA project's goal is to engineer the token to 'not look like a security' and slip past the SEC.\" —— The opposite. Mature RWA projects deliberately concede they are securities, then comply efficiently via Reg D/S. Dodging Howey was 2017's ICO move — the graveyard is Stage 10.6; 2025's move is ordering off the menu.",
    "\"Once you're under a Reg D exemption you're done with the SEC forever.\" —— The exemption waives registration, not anti-fraud liability (lie and you'll still be sued), and it comes with Rule 144's 12-month resale lock and Section 12(g)'s 2,000-holder tripwire — cross it and you become a public reporting company. An exemption swaps one set of constraints for another; it doesn't remove them.",
    "\"The Ripple case ruled XRP is not a security.\" —— The ruling is far finer: direct institutional sales WERE securities offerings; programmatic exchange sales were not. It rewrote the question from \"what is the token\" to \"what is this transaction\" — the same token gets different answers in different contexts.",
    "\"The 2025 regulatory turn = America stopped regulating.\" —— It's a turn from drawing lines with lawsuits to building frames with rules: GENIUS framed stablecoins, market-structure bills are drawing the SEC/CFTC boundary, the custody accounting roadblock (SAB 121) was cleared. Clearer rules usually mean more systematic regulation, not less.",
  ],

  quiz: [
    {
      q: "What are the four elements of an \"investment contract\" under the Howey test?",
      options: [
        "Uses a blockchain, issues a token, has a whitepaper, sells publicly",
        "Investment of money, common enterprise, expectation of profit, profit derived mainly from the efforts of others",
        "Incorporates a company, hires lawyers, gets audited, appoints a custodian",
        "Price volatility, a secondary market, market makers, an exchange listing",
      ],
      answer: 1,
      explain: "All four must hit to make a security; technical form (chain or no chain, token or not) appears nowhere in the test — it reads economic substance.",
    },
    {
      q: "USDC is generally not treated as a security. Which prong does it fail?",
      options: [
        "No investment of money",
        "No common enterprise",
        "No expectation of profit — 1 USDC always redeems for $1; you hold it to pay, not to appreciate",
        "Circle is not a US company",
      ],
      answer: 2,
      explain: "A stablecoin doesn't appreciate and (for compliant issuers) may not pay interest; prong 3 fails → payment-instrument territory, governed by the GENIUS Act (Stage 4.4).",
    },
    {
      q: "Choosing Reg D 506(c) over 506(b) buys the issuer what, at what price?",
      options: [
        "The right to sell to any retail buyer",
        "The right to advertise publicly (website, ads), at the price of substantively verifying every buyer's accredited status",
        "Freedom from anti-fraud rules",
        "Immediately free-trading tokens",
      ],
      answer: 1,
      explain: "506(b) bans general solicitation but allows self-certification; 506(c) flips it: advertise freely, but verify. Rule 144's resale lock applies either way.",
    },
    {
      q: "Exchange Act Section 12(g)'s \"2,000-holder tripwire\" explains which RWA token design feature?",
      options: [
        "Why tokens need oracle price feeds",
        "Why permissioned tokens carry a holder cap in their compliance contract",
        "Why tokens pay daily dividends",
        "Why tokens deploy on multiple chains",
      ],
      answer: 1,
      explain: "Cross 2,000 holders (or 500 non-accredited) plus the asset threshold and you're forced into public reporting. The holder cap in an ERC-3643-style compliance module (Stage 6.1) is that tripwire, compiled into code.",
    },
    {
      q: "What was the fine-grained point of the Ripple (2023) decision?",
      options: [
        "It declared no crypto token is a security",
        "Same token: direct institutional sales constituted securities offerings while programmatic exchange sales did not — turning \"what is the token\" into \"what is this transaction\"",
        "It declared XRP a commodity under CFTC jurisdiction",
        "It ruled the SEC has no authority over crypto",
      ],
      answer: 1,
      explain: "Institutional buyers knowingly paid Ripple and relied on its efforts (prong 4 satisfied); anonymous exchange buyers didn't know their counterparty — same asset, different sales context, different outcome.",
    },
    {
      q: "The most accurate summary of the 2025 US regulatory \"turn\" is?",
      options: [
        "The SEC disbanded and crypto is unregulated",
        "A shift from regulation-by-enforcement to regulation-by-framework: dropped/settled suits, a rulemaking Crypto Task Force, the GENIUS stablecoin law, market-structure bills drawing the SEC/CFTC line",
        "All tokens were declared securities",
        "All authority was handed to the states",
      ],
      answer: 1,
      explain: "The direction is swapping \"draw lines with cases\" for \"build frames with rules\"; still unresolved: retail tokenized equities and DeFi's status — the map isn't finished.",
    },
  ],

  further: [
    { label: "SEC v. W.J. Howey Co. (1946), full opinion", url: "https://supreme.justia.com/cases/federal/us/328/293/" },
    { label: "SEC: Framework for 'Investment Contract' Analysis of Digital Assets (2019)", url: "https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets" },
    { label: "SEC: The DAO Report (2017 — the origin of 'existing law applies')", url: "https://www.sec.gov/litigation/investreport/34-81207.pdf" },
    { label: "SEC Crypto Task Force (the official face of the 2025 turn)", url: "https://www.sec.gov/about/crypto-task-force" },
    { label: "Investor.gov: Accredited investor definition", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/accredited-investors" },
  ],
};
