export default {
  id: "eu-mica",
  stage: 11,
  order: 2,
  title: "The EU: MiCA, the DLT Pilot Regime & Prospectus Rules",
  difficulty: "mastery",
  prereqs: ["stablecoin-regulation"],

  oneLiner:
    "The EU is the codifier: draw every box first, then let people build. MiCA gives crypto assets a complete written rulebook, the DLT Pilot Regime opens a capped experiment zone for on-chain securities, and the Prospectus Regulation governs public offers. But the single most-fumbled point is the boundary itself: if a token is a \"financial instrument\" under MiFID II, MiCA doesn't touch it at all — most RWA security tokens walk the traditional securities-law road. And one license passported across 27 countries is the biggest candy the EU offers the compliant.",

  intuition: `
Picture two city planners. The American one (Stage 11.1) lets everyone build first, then takes a 1946 precedent to court whenever something goes wrong, accumulating a map of case law over eighty years. The European planner does the opposite: **draw the whole city's zoning grid first, put up a sign on every block, and only then allow construction**. Drawing is slow — MiCA took roughly five years from proposal to full application — but once drawn, every operator knows exactly which block they stand on and which license it requires.

This codifier style delivers one enormous practical benefit: **certainty you can write into a business plan**. Circle obtained an e-money license in France, and USDC became legal to offer to 450 million people across 27 countries; conversely, non-compliant USDT was delisted from EU venues through 2024–25. Clear rules mean the rewards AND the penalties actually get paid out.

But precisely because the grid is finely drawn, **the classic beginner's error** is standing on the wrong block. You'd naturally assume "MiCA = the EU's crypto law, covering all tokens" — wrong. MiCA's very first move is **exclusion**: any token that qualifies as a traditional "financial instrument" (tokenized shares, bonds, fund units — i.e. most RWA) gets not one word from MiCA; the full traditional securities rulebook applies instead. MiCA governs what securities law **doesn't** reach: stablecoins and miscellaneous crypto assets.

In this lesson we stack the EU's four building blocks: the classification decision tree (stand on the right block), the passport (one license, whole market), the DLT Pilot Regime (the sandbox for on-chain securities), and prospectus rules (why Europe's digital bonds are nearly all institutional-only). You'll leave with an expert skill: **for the same product, which door it takes in the US system and which in the EU's**.

**Here's the map — six parts:**

- **① The classification decision tree: financial instrument or MiCA? — the lesson's spine**
- **② The passport superpower: one license, 27 countries**
- **③ The DLT Pilot Regime: a capped sandbox for on-chain securities**
- **④ The Prospectus Regulation: why European digital bonds start at €100k**
- **⑤ Member-state substrate & the ECB's settlement trials**
- **⑥ US vs EU: choosing between two philosophies**
`,

  mechanics: `
### ① The classification decision tree: financial instrument or MiCA?

The EU's first question for any token isn't "what chain do you use" but: **are you a financial instrument under MiFID II** — a transferable security (share, bond), a fund unit, a derivative?

- **Yes, a financial instrument** → **MiCA has nothing to do with you**. The full traditional securities stack applies: public offers need a **prospectus** (see ④), trading happens on MiFID venues (regulated markets, MTFs), settlement follows **CSDR** (the central-securities-depository rulebook — the "there must be a CSD" plumbing from Stage 3.4). **Most RWA security tokens live here** — a tokenized bond or fund share is legally a bond or fund share; the chain is just recording technology.
- **No** → you land in one of **MiCA's three boxes**:
- **EMT (e-money token)**: a stablecoin pegged to a **single fiat currency** (the USDC type, Stage 4.4). The issuer must be a licensed e-money institution or credit institution: 1:1 reserves, redemption at par on demand, and large ones get upgraded to "significant EMT" status with extra supervision.
- **ART (asset-referenced token)**: pegged to a **basket** (multiple currencies, commodities, crypto mixes). Stricter than EMT — the EU's wariness of "private synthetic money" is the psychological scar Libra/Diem left behind.
- **Other crypto-assets**: utility tokens and the rest. Lightest touch: publish a **whitepaper**, bear liability for misleading statements, no prior approval needed.

The intermediaries serving all of these — exchanges, custodians, brokers — carry one unified label: **CASP (crypto-asset service provider)**, licensed, with conduct rules (conflicts of interest, client-asset segregation, market abuse) lifted wholesale from traditional finance's skeleton.

<figure><svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="eumica-en-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--orange-line)"/></marker></defs><rect x="230" y="12" width="180" height="46" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="31" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">A token</text><text x="320" y="47" font-size="10" fill="var(--muted)" text-anchor="middle">First question: financial instrument?</text><path d="M270 58 L150 96" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#eumica-en-arr)"/><path d="M370 58 L490 96" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#eumica-en-arr)"/><text x="170" y="80" font-size="10" fill="var(--orange-ink)">yes (MiFID II)</text><text x="430" y="80" font-size="10" fill="var(--orange-ink)">no</text><rect x="30" y="100" width="240" height="88" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="150" y="122" font-size="12" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">Traditional securities law (NOT MiCA!)</text><text x="150" y="140" font-size="10" fill="var(--muted)" text-anchor="middle">Prospectus Reg · MiFID venues · CSDR</text><text x="150" y="156" font-size="10" fill="var(--muted)" text-anchor="middle">tokenized bonds / fund units / shares</text><text x="150" y="174" font-size="10" fill="var(--ink)" text-anchor="middle" font-weight="600">← most RWA security tokens live here</text><rect x="360" y="100" width="260" height="180" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="490" y="122" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">MiCA's three boxes</text><rect x="376" y="134" width="228" height="38" rx="8" fill="var(--green-soft)" stroke="var(--line)"/><text x="490" y="150" font-size="11" fill="var(--ink)" text-anchor="middle" font-weight="600">EMT: single-fiat stablecoin</text><text x="490" y="164" font-size="9" fill="var(--muted)" text-anchor="middle">e-money license · 1:1 reserves · par redemption</text><rect x="376" y="180" width="228" height="38" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="490" y="196" font-size="11" fill="var(--ink)" text-anchor="middle" font-weight="600">ART: basket-referenced token</text><text x="490" y="210" font-size="9" fill="var(--muted)" text-anchor="middle">strictest — Libra's scar tissue</text><rect x="376" y="226" width="228" height="38" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="490" y="242" font-size="11" fill="var(--ink)" text-anchor="middle" font-weight="600">Other crypto-assets (utility etc.)</text><text x="490" y="256" font-size="9" fill="var(--muted)" text-anchor="middle">whitepaper + liability, no prior approval</text><text x="320" y="295" font-size="10" fill="var(--muted)" text-anchor="middle">Intermediaries hold one CASP license · passported across 27 states</text></svg><figcaption>The EU decision tree: first ask "is it a financial instrument?" Yes → traditional securities law (MiCA stays out); no → one of MiCA's three boxes.</figcaption></figure>

**The misconception to kill**: "MiCA regulates all tokens" — no. MiCA is **complement regulation**: it governs precisely what securities law doesn't. Filing a MiCA whitepaper for a tokenized bond is like presenting a driver's license at the passport office — wrong window entirely.

### ② The passport superpower: one license, 27 countries

The EU single market's old magic, inherited intact by MiCA: **an authorization in any one member state (EMT issuance, a CASP license) automatically passports across all 27**. Compare the American pain: to run a money-transfer business nationwide you apply state by state for money-transmitter licenses — 50 applications, 50 supervisors, years of work.

That difference rewrote stablecoin geography: **Circle took a French e-money institution (EMI) license in 2024**, becoming the first major MiCA-compliant stablecoin issuer — one French license, and USDC plus EURC legally cover the entire EU. It was among the first big GENIUS-vs-MiCA arbitrage decisions: where to comply, and where first, became competitive strategy. The cautionary mirror image is equally real: **USDT did not comply with MiCA, and through 2024–25 EU-licensed venues delisted it** — Coinbase, Kraken and others removed it for EU users. The flip side of clear rules is that the cost of non-compliance is equally clear.

### ③ The DLT Pilot Regime: a capped sandbox for on-chain securities

Back to the left-hand box: security tokens fall under traditional securities law — but that law's **plumbing rules** (CSDR, MiFID venue rules) were written around the assumption that a CSD necessarily exists and that trading and settlement are separate layers (Stage 3.4). On-chain settlement wants to merge exactly those layers — the rules blocked the innovation by construction.

The EU's answer, live since March 2023, is the **DLT Pilot Regime**: a sandbox **written directly into law** — licensed institutions may apply for exemptions from specific plumbing rules to operate three kinds of DLT market infrastructure:

- **DLT MTF**: an on-chain multilateral trading facility (the trading layer).
- **DLT SS**: an on-chain settlement system (the settlement layer).
- **DLT TSS**: a **combined trading-and-settlement system** — the radical one, packing "exchange" and "CSD" into a single smart-contract stack, a merger traditional rules force apart.

The price is **caps**: thresholds per asset and in aggregate (on the order of ~€6B total, with an exit mechanism triggered around €9B) keep the experiment in a cage. The honest report card: **few applicants** — the caps are too low to make the economics work for large institutions, banks chose to wait, and most players prefer "permissioned-chain bookkeeping inside traditional legal wrappers." That's the **pilot paradox**: make the cage too small and the lions won't enter; make it too big and it's no longer a pilot. The EU is reviewing whether to raise the caps — Stage 11.4 puts this model into the global comparison.

### ④ The Prospectus Regulation: why European digital bonds start at €100k

Offer a security token **to the public** and you hit the **Prospectus Regulation**: a public securities offer requires an approved prospectus — hundreds of pages, legal fees starting in six figures. Unless you thread an exemption:

- sell only to **qualified investors**;
- a private placement of **fewer than 150 persons** per member state;
- **denominations of ≥€100,000** per unit;
- totals **under €8M** in 12 months (varies slightly by state).

Understand the third route and you understand the shape of Europe's digital bond market: **set each bond's denomination above €100k, retail can't afford a single unit, and the prospectus obligation evaporates**. That's why on-chain bonds from the European Investment Bank and peers are uniformly institutional-only — not because the technology can't fractionalize (it can slice to €1, Stage 0.3) but because **the exemption structure economically punishes fractionalization**. Want retail? Write the prospectus, or wait for the rules to change.

### ⑤ Member-state substrate & the ECB's settlement trials

Beneath the EU regulations, member states supply their own bricks (Stage 5.3, one-paragraph refresher): **Germany's eWpG** electronic-securities act — bonds may abandon paper certificates entirely, with a "crypto securities register" maintained by a licensed registrar so the on-chain record IS the legal record; **Luxembourg's** run of blockchain laws underpins Europe's fund-tokenization home base (the world's second-largest fund domicile); **France's DEEP regime** allows distributed-ledger registration of unlisted securities. The regulations (MiCA, the Pilot) unify the market; member-state law supplies the "token = legal security" property-rights foundation — neither layer works without the other.

One block remains: **the cash leg of settlement**. The bond is on-chain — what money settles the payment leg? In 2024 the **ECB ran wholesale DLT settlement trials**: real transactions in the tens of billions of euros, settled in **central bank money** linked to DLT platforms (several central-bank solutions tested in parallel), with preparations from 2025 for a longer-term facility — Europe's move in the institutional chess game of Stage ∞.2. The retail-side **digital euro** is a separate, politically slower track with little RWA relevance; what RWA needs is the **wholesale side**: without a central-bank-money cash leg, DvP (delivery versus payment) is forever missing half of itself.

### ⑥ US vs EU: choosing between two philosophies

Put the two lessons side by side (Stage 11.1 + this one) — a decision-maker's comparison:

- **EU**: clarity first. Written rules, passporting, predictable paths; the price is speed (legislative cycles start at five years), caps that squeeze innovation (the Pilot's cage), and slow fixes when a box was drawn wrong. **Friendliest to banks and licensed institutions** — "bankable" (survives a risk and compliance committee) is the EU's keyword.
- **US**: market first. The world's deepest capital pool and fastest product iteration; the price is rules historically assembled from case law (rapidly codifying since 2025), a state+federal double layer, and genuine litigation risk.
- **A builder's logic** (Stage 13.3 turns this into a full selection framework): **issuing a stablecoin** → the MiCA path is clearest (EMI license + passport), and post-GENIUS the US path has taken shape too; **issuing a security token** → both sides run through traditional securities law, just through different doors — the US via Reg D/S + an ATS, Europe via prospectus exemptions + (optionally) a DLT Pilot venue or member-state register law. **Same product, two maps, two compliance routes** — holding both maps open in your head at once is the expert skill this stage trains.

If you take away one sentence: **the EU draws the boxes first and opens the gates second — and the line that matters most is this: a token that qualifies as a financial instrument is none of MiCA's business; it walks the traditional securities-law road, with the DLT Pilot as its sandbox.**
`,

  demo: "mica-mapper",

  analogy: `
Think of EU regulation as a **strictly zoned old European city**. City hall (Brussels) spends five years drawing the district map first: this street is the "financial instruments quarter" — century-old rules (prospectus, MiFID, CSDR) apply unchanged, though you may now swap paper deeds for electronic ones. Those streets over there are the new MiCA quarter: stablecoin shops (EMT), basket shops (ART), general stores (other crypto-assets) — which license each shop hangs and what leaflet must sit in its window (the whitepaper) is all written on the wall.

The **passport** is this city's magic ticket: get your business license in any one district and all 27 districts honor it — unlike the city across the Atlantic, where every neighborhood demands its own application. So the shrewd shopkeeper (Circle) picked the smoothest district office (France) and opened city-wide overnight; the unlicensed street vendor (USDT) was politely but firmly escorted out of district after district.

In the old town center they've also fenced off a **construction site (the DLT Pilot Regime)**: want to try building the trading hall and the title-registry office as one building? Fine — enter the site, wear a hard hat, but no tower above six stories (the caps). The site is a bit quiet — big developers say six stories can't recoup costs, so they watch from outside the fence. City hall is debating whether to raise the height limit.

The virtue of this city: **you always know which district you're in and which permit you need**. The vice: if your business appears on no district map, you wait for the next five-year plan. Clarity and flexibility are an eternal trade.
`,

  misconceptions: [
    "\"MiCA is the EU's crypto law and covers all tokens.\" —— The reverse: MiCA is complement regulation. Tokens qualifying as MiFID II financial instruments (tokenized bonds, shares, fund units — most RWA) are entirely outside MiCA; the full traditional securities stack applies. MiCA covers what securities law doesn't reach: stablecoins and miscellaneous crypto assets.",
    "\"A tokenized bond needs a MiCA whitepaper in the EU.\" —— No — it needs a prospectus (or an exemption: qualified investors / <150 persons / ≥€100k denominations / <€8M total). Taking a security token to the MiCA window is the wrong window.",
    "\"The DLT Pilot Regime failed because almost nobody applied.\" —— The quiet uptake is real, but read it correctly: caps too low for big institutions' economics + banks waiting is a cage-size problem, not a direction problem. It proved combined trading-and-settlement (DLT TSS) is legally possible — that precedent is itself the output, and the caps are under review.",
    "\"A license in one country only lets you operate in that country.\" —— The passport works the other way: a MiCA authorization in any member state travels to all 27. That is the entire point of Circle's French EMI license and the EU's biggest candy for the compliant — versus applying for money-transmitter licenses in 50 US states one by one.",
    "\"European digital bonds start at €100k because the tech can't slice smaller.\" —— The tech slices to €1 (Stage 0.3). €100k denominations are the economics of a prospectus exemption: price a unit above retail reach and the prospectus duty disappears. The legal structure punishes fractionalization; the chain doesn't.",
    "\"US vs EU is just strict vs lenient.\" —— It's a difference of philosophy: the EU codifies first (slow but certain — bankable), the US built on case law and is codifying fast since 2025 (fast, deep markets). A stablecoin and a security token take entirely different doors on each side — the expert skill is holding both maps open, not scoring one side over the other.",
  ],

  quiz: [
    {
      q: "Which rulebook applies to a tokenized corporate bond in the EU?",
      options: [
        "MiCA's ART rules",
        "MiCA's \"other crypto-assets\" rules — just publish a whitepaper",
        "Not MiCA at all — it's a MiFID II financial instrument, so the Prospectus Regulation, MiFID venues, CSDR and the rest of traditional securities law apply",
        "None — it's a regulatory gap",
      ],
      answer: 2,
      explain: "The decision tree's first question: is it a financial instrument? A bond is → MiCA doesn't apply at all. This is the lesson's most important boundary line.",
    },
    {
      q: "What distinguishes an EMT from an ART under MiCA?",
      options: [
        "EMT is a utility token, ART is a security",
        "An EMT pegs to a single fiat currency (the USDC type); an ART references a basket — and gets the stricter rulebook",
        "EMTs are supervised by member states, ARTs by Brussels",
        "EMTs need a prospectus, ARTs don't",
      ],
      answer: 1,
      explain: "Single fiat → EMT (e-money logic: 1:1 reserves, par redemption); basket → ART, the strictest box — Libra's scar tissue.",
    },
    {
      q: "What does \"passporting\" mean?",
      options: [
        "A technical standard for moving crypto assets across chains",
        "An authorization obtained in any one member state automatically covers all 27 — versus the US pain of state-by-state licensing",
        "EU citizens must register a passport to buy crypto",
        "A privilege reserved for banks",
      ],
      answer: 1,
      explain: "One license for the whole single market is the EU's old magic. Circle's French EMI license legally covering all of the EU with USDC is the passport's real-world power.",
    },
    {
      q: "What makes DLT TSS the \"radical\" category in the DLT Pilot Regime?",
      options: [
        "It permits anonymous trading",
        "It merges the traditionally force-separated \"trading venue\" and \"CSD settlement\" into one system",
        "It waives all capital requirements",
        "It allows unlimited issuance size",
      ],
      answer: 1,
      explain: "Traditional plumbing rules assume trading and settlement are separate and a CSD exists (Stage 3.4); a DLT TSS gets exemptions to merge the layers — legal recognition that one smart-contract stack can be exchange and registry-settlement at once.",
    },
    {
      q: "Why are Europe's on-chain bonds almost all institutional-only products starting at €100k?",
      options: [
        "Blockchains can't support small denominations",
        "Denominations of ≥€100k exempt the offer from the prospectus — the exemption structure economically punishes fractionalization",
        "EU law bans retail from holding any bond",
        "Banks refuse to serve retail",
      ],
      answer: 1,
      explain: "The tech slices to €1; it's the prospectus-exemption threshold that makes \"denomination above retail reach\" the cheapest compliance path.",
    },
    {
      q: "For a team issuing a single-currency USD stablecoin, the correct summary of the EU path is?",
      options: [
        "File a MiCA whitepaper — no license needed",
        "As an EMT: an e-money/credit institution license, 1:1 reserves and par redemption, then passporting across 27 states once approved in one",
        "Apply as an ART, since the dollar isn't the euro",
        "Stablecoins are banned in the EU",
      ],
      answer: 1,
      explain: "Single-fiat peg → the EMT box: EMI license + reserve and redemption duties + the passport. Circle's route; non-compliant USDT got delisted from EU venues instead.",
    },
  ],

  further: [
    { label: "MiCA, full text (EUR-Lex, Regulation 2023/1114)", url: "https://eur-lex.europa.eu/eli/reg/2023/1114/oj" },
    { label: "DLT Pilot Regime (EUR-Lex, Regulation 2022/858)", url: "https://eur-lex.europa.eu/eli/reg/2022/858/oj" },
    { label: "ESMA: MiCA page (technical standards and guidance)", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" },
    { label: "Prospectus Regulation (EUR-Lex, Regulation 2017/1129)", url: "https://eur-lex.europa.eu/eli/reg/2017/1129/oj" },
    { label: "ECB: distributed ledger technology & wholesale settlement trials", url: "https://www.ecb.europa.eu/paym/integration/distributed/html/index.en.html" },
  ],
};
