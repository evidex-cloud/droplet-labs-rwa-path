export default {
  id: "cheat-sheet",
  stage: 13,
  order: 4,
  title: "Appendix: Key Terms & Numbers Cheat Sheet",
  difficulty: "mastery",
  prereqs: [],

  oneLiner:
    "This lesson teaches nothing new; it compresses the whole course into one page you can flip open: each stage in a single line, the numbers experts have memorized, and four ready-to-use cards (the six-layer risk map, the yield decomposition formula, the seven document questions, the red-flag list). It isn't meant to be read front to back — it's meant to be opened at the moment you have to evaluate something real. The mark of an expert isn't memorizing this page; it's being able to teach the lesson behind every cell.",

  intuition: `
Across thirteen stages you've come a long way: from “ownership is only a record” to “design a tokenization platform by hand.” But knowledge has a cruel property — **knowledge without an index is knowledge you don't have**. Three months from now somebody drops an offering document on your desk; you won't reread the whole course, you'll need one page that gets you to the answer in two minutes.

This lesson is that page. Its shape is unlike every lesson before it: **almost no narrative, maximum density**. Because a reference's value isn't in reading pleasantly, it's in looking up fast.

There are three ways to use it. **Look things up**: forgot the accredited-investor threshold, the Rule 144 lock, when MiCA applied — go straight to ②. **Self-test**: cover the right half, say the definition out loud from the term alone; whichever cell you can't say is the lesson to reread (every number is tagged with its stage). **Use it as a working template**: take cards ③④⑤⑥ to a real product and fill them in, cell by cell.

One more thing this page must include: **how to keep it from going stale**. RWA changes quarterly; numbers drift and rules update. So the final section ⑧ gives you a “stay current” routine — a twenty-minute monthly habit worth more than memorizing any single figure.

**Here's the map — eight parts (they are the eight sections of the sheet itself):**

- **① One line per stage**
- **② The key numbers table**
- **③ The six-layer risk map card**
- **④ The yield decomposition card**
- **⑤ The seven document questions card**
- **⑥ The top-10 red flags card**
- **⑦ The stack causal-chain card**
- **⑧ Staying current: sources and the monthly routine**
`,

  mechanics: `
### ① One line per stage

The whole course replayed in fifteen lines. Each is the one thing that stage insists you carry out.

- **Stage 0 · Why tokenize**: an RWA is real-world ownership turned into an on-chain token; ownership was always just a record, so tokenization swaps the bookkeeping system, not the asset.
- **Stage 1 · Life of a token**: originate → issue → trade → redeem; the token is on-chain while the asset isn't, and the bridge between them (who tells the chain the asset is real) is the industry's core problem.
- **Stage 2 · Blockchain foundations**: a chain is a ledger nobody can unilaterally edit; ERC-20's \`transfer\` checks only the balance — which is the entire reason a security doesn't fit in a plain ERC-20.
- **Stage 3 · TradFi foundations**: a security is a claim on future cash flows; NAV = (assets − liabilities) ÷ shares; custodians, transfer agents, and clearinghouses each have a job, and T+1 is what their cooperation produces.
- **Stage 4 · Stablecoins**: the first RWA that truly worked; its risk was never in the code but in which bank holds the reserves (USDC's 48 hours at $0.87 is the best textbook there is).
- **Stage 5 · The legal wrapper**: you don't own the asset, you own a claim on it; SPVs and trusts provide bankruptcy remoteness, and whether the token *is* the legal register depends on jurisdiction.
- **Stage 6 · Token standards**: ERC-3643 bakes eligibility into transfers, ERC-4626 standardizes yield-bearing shares; the issuer's freeze/pause/forcedTransfer are compliance necessities and attack surfaces at the same time.
- **Stage 7 · The compliance machine**: three gates (KYC/AML/sanctions) plus investor eligibility plus transfer restrictions; a compliance system's value lives 100% in the transfers it refuses.
- **Stage 8 · Oracles and data**: the chain is blind, so every number on it was fed by someone; PoR proves “X was there at a moment,” never “X isn't simultaneously owed.”
- **Stage 9 · Liquidity and markets**: primary and secondary are two markets with two rulebooks; the liquidity illusion is RWA's most expensive illusion, and price hugs NAV because of the redemption channel, not trading volume.
- **Stage 10 · Case studies**: BUIDL is the benchmark, Ondo is the dual track, private credit teaches default, RealT teaches operations, PAXG teaches allocated, and the graveyard teaches demand-first.
- **Stage 11 · The regulatory map**: the US runs on Howey + Reg D/S/A+ + ATSs, the EU on MiCA + the DLT Pilot Regime, Asia on MAS/SFC pilots and licenses; jurisdiction shapes the product.
- **Stage 12 · Risk and diligence**: six risk layers in series, the weakest decides; ask seven questions of the documents, and any yield must decompose into its sources.
- **Stage 13 · Design it yourself**: six components + a 12-step pipeline + the selection causal chain; law sets the shape, technology fills it in.
- **Stage ∞ · Where it goes**: deposit tokens and tokenized equities are the next wave; the institutional chessboard is already in play; your opportunity sits at every point where an off-chain promise can be made verifiable.

### ② The key numbers table

The figures that live permanently in an expert's head. All are magnitudes, benchmarked to 2025 unless noted.

**Market size**

- Total stablecoin supply: about **$250–300B** (USDT ≈ $170B+, USDC ≈ $65B+) | Stage 4.1
- Tokenized US treasuries: about **$7–8B** (late 2025) | Stages 3.2, 10.1
- On-chain private credit: **$10B+** | Stage 10.3
- For scale: the US Treasury market is about **$28T**, TradFi private credit about **$1.7T** — tokenization is a rounding error of a rounding error | Stage 0.4

**Legal thresholds**

- Accredited investor: **$1M** net worth (excluding primary residence) or **$200k** income ($300k joint) | Stage 7.2
- Qualified purchaser (QP): **$5M** in investments | Stages 7.2, 10.1
- Section 12(g) registration trigger: **2,000** holders of record (or 500 non-accredited) | Stage 11.1
- Rule 144 resale lock: **6 months** for reporting companies, **12 months** for non-reporting | Stage 11.1
- Reg A+ cap: **$75M** per 12 months | Stage 11.1
- EU prospectus threshold: **€8M** (member states may vary) | Stage 11.2
- MiCA: fully applicable **2024** (stablecoin provisions from June 2024) | Stages 4.4, 11.2
- US GENIUS Act (federal payment-stablecoin law): signed **July 2025** | Stage 4.4
- US equities settle **T+1** since **May 2024** (previously T+2) | Stage 3.4

**Operating parameters**

- Short-term T-bill yield: roughly **4–5%** through 2023–25, easing toward ~4% by late 2025 | Stage 3.2
- Tokenized treasury fund fees: about **15–50 bps**; compare GLD at about **40 bps** | Stage 12.4
- KYC cost: about **$10–100 per investor** | Stages 7.1, 13.2
- ERC-3643 ecosystem's claimed tokenized assets: **$28B+** | Stage 6.2
- BUIDL: about **$2–3B** in size, **$5M** minimum, Reg D qualified purchasers, BNY Mellon custodian, daily dividends minted as new tokens | Stage 10.1
- Ondo USDY: a **40–50 day** transfer lock after mint, Reg S non-US persons | Stage 10.2
- Cautionary figures: UST's collapse erased about **$40B** (2022); USDC fell to **$0.87** because **$3.3B** was stuck at Silicon Valley Bank (March 2023) | Stage 4.3

### ③ The six-layer risk map card (Stage 12.1)

Counting from the real asset up to the chain, six layers **in series** — break any one and the whole receipt chain breaks:

- **① Asset layer**: credit · market · duration — can the underlying itself go bad
- **② Issuer layer**: solvency · fraud · key person · operational capability
- **③ Legal/structural layer**: true sale · register regime · enforceability · jurisdiction
- **④ Custody layer**: is the asset still there? Segregated? Pledged to someone else?
- **⑤ Data/oracle layer**: NAV freshness · PoR blind spots · can the feed be manipulated
- **⑥ Contract/chain layer**: bugs · admin keys · upgrade governance · bridges

Plus a **liquidity amplifier** ring around all six: it creates no losses, it only decides how many options you have left when bad news arrives. Three iron rules: **series, not parallel** (real risk = the weakest layer); **under stress the layers collapse together** (stress-test them jointly); **risk isn't the problem — unpriced risk is**.

### ④ The yield decomposition card (Stage 12.4)

Any RWA's yield must decompose into this expression; whatever won't decompose is the risk you haven't seen:

**Net yield = underlying asset yield − fee stack ± leverage effect ± term/credit premium − undisclosed risk discount**

How to use it: find the **benchmark** first (the same-tenor treasury yield); the product's yield minus the benchmark is the **risk premium**; then interrogate that premium item by item — credit descent? Longer duration? Liquidity lockup? Leverage? If none of the four explains it, what you're being paid for is **the layer of risk you can't see**. Rule of thumb: any product calling itself “safe” while paying far above the treasury band (say 15%+) is carrying risk in some layer you haven't located yet.

### ⑤ The seven document questions card (Stage 12.2)

With a PPM or offering document in hand, ask these seven in order; the one you can't answer is where the risk is:

- **① What exactly is the underlying asset** — down to issuer, tenor, rating, concentration
- **② What is my claim** — equity? Debt? Synthetic exposure? Behind whom in line?
- **③ Who custodies, and is the asset segregated** — named? Any “may pledge” language?
- **④ Does the audit cover the deployed address** — version, address, auditor, date
- **⑤ How does redemption work** — notice period? Gates? Suspension rights? Fees? Worst-case time to cash?
- **⑥ The full fee picture** — management + performance + redemption + hidden spread
- **⑦ Where do I sue** — jurisdiction, dispute resolution, liquidation priority

### ⑥ The top-10 red flags card (Stage 12.3)

See any of these and stop until it's explained:

- **①** An unnamed custodian (“we partner with leading institutions”)
- **②** A legal entity you can't find in any registry
- **③** An audit report pointing at something other than the deployed contract address
- **④** “Redeem anytime” promised over an obviously illiquid underlying
- **⑤** Website language inconsistent with the PPM's terms
- **⑥** A yield far above comparable products with no explained source
- **⑦** An anonymous team, or key-person risk concentrated in one individual
- **⑧** Admin keys held by a single externally owned account, no multisig, no timelock
- **⑨** A reserve “attestation” that's a self-made PDF, not an independent firm's report
- **⑩** Secondary “liquidity” consisting solely of the issuer's own market maker

### ⑦ The stack causal-chain card (Stage 13.3)

**Pick buyers → buyers pick the law → law picks the structure → structure picks the technology.**

- Buyers' custody capability → the chain
- Transfer topology + integration targets → the token standard
- Asset class → the custodian (cash custody must be plural)
- Who consumes the data → admin feed vs oracle network
- Target jurisdictions → KYC vendor coverage
- Whether secondary is real → venue and DeFi adapters (the latter needs a legal opinion)

Projects that run it backwards — technology first — all die in Stage 10.6.

### ⑧ Staying current: sources and the monthly routine

**Primary sources** (always above secondary commentary): rwa.xyz for the data dashboard; SEC / ESMA / MAS release pages for rule changes; issuers' own transparency pages for actual reserves and NAV; plus the quarterly watchlist from Stage 11.4 (sandboxes, pilots, license progress).

**The 20-minute monthly routine** (worth more than memorizing any number):

- **10 minutes**: run Stage 12.3's Phase-4 monitoring — the five metrics — across every product you hold (size change, NAV updating on schedule, redemptions functioning normally, admin actions, attestations arriving on time).
- **5 minutes**: scan one regulator's news page — rotate them: SEC this month, MiCA/ESMA next, MAS or the SFC after that.
- **5 minutes**: reread one section of one PPM (say, the redemption terms). You'll be startled how differently the same paragraph reads once you know more.

If you take away one sentence: **the mark of an expert isn't memorizing this page — it's being able to teach the lesson behind every cell; and the page's real use is getting you, in two minutes, to the question you need to ask at the moment you must decide.**
`,

  demo: "rwa-cheat-sheet",

  analogy: `
Think of this cheat sheet as **a chef's handwritten notebook**.

A novice cook's notebook is full of complete recipes — because they still need to follow each step. A chef ten years in has a notebook down to **a few numbers and a few checklists**: core temperatures for each doneness, the ratios for a handful of mother sauces, four things to check when buying fish at the market. Anyone else opening that notebook would find it suspiciously thin; only the chef knows that **every line has hundreds of repetitions compressed behind it**.

This page is that kind of notebook. “Accredited investor: $1M” is one line, but you know Stage 7.2 sits behind it — why regulators use wealth as a proxy for risk tolerance, and how that line carved out a grey zone of compliance arbitrage. **You can read the shorthand because you walked the road.**

And section ⑧, staying current, is the chef's weekly trip to the market. Recipes don't expire, but **what's fresh today** does. RWA's frameworks (six risk layers, seven questions, the causal chain) will hold for years, while the numbers drift each quarter — so the right way to use this page isn't to memorize it, but to **spend twenty minutes a month recalibrating it against reality**.
`,

  misconceptions: [
    "“A cheat sheet is for people who can't remember.” —— The opposite: it's for people who already understand. The same line, “qualified purchaser: $5M,” is a number to a novice and the full logic of Stages 7.2 and 10.1 to you. The table compresses understanding; it doesn't substitute for it.",
    "“Memorize the numbers and you're an expert.” —— The numbers drift quarterly; the frameworks don't. What's stable is the six-layer risk map, the seven questions, the yield decomposition, and the selection causal chain. Make those four cards instinctive; look the numbers up whenever you need them.",
    "“Market-size numbers show tokenization is already mature.” —— Tokenized treasuries are ~$7–8B against a ~$28T Treasury market — a rounding error of a rounding error. The correct posture toward RWA today is “early,” not “mainstream.”",
    "“Stablecoins are the biggest, so stablecoins are the safest.” —— Size has nothing to do with safety. When USDC fell to $0.87 in March 2023 it was already the world's second-largest stablecoin; the risk wasn't in the code, it was in which bank held the reserves (Stage 4.3).",
    "“Secondary commentary saves time.” —— What primary sources (SEC/ESMA/MAS pages, issuer transparency pages, rwa.xyz) save you isn't time, it's the risk of inheriting someone else's frame. Of the 20-minute monthly routine, 15 minutes go to primary sources.",
  ],

  quiz: [
    {
      q: "What are the thresholds for an accredited investor versus a qualified purchaser?",
      options: ["Both $1M", "Accredited: $1M net worth or $200k income; qualified purchaser: $5M in investments", "Accredited $5M, QP $1M", "They're the same concept"],
      answer: 1,
      explain: "BUIDL's $5M minimum mirrors the QP threshold exactly — it targets qualified purchasers, not merely accredited investors (Stages 7.2, 10.1).",
    },
    {
      q: "Put tokenized treasuries (about $7–8B) on the right scale — how big is the traditional market they sit inside?",
      options: ["About $10B, so they already dominate it", "The US Treasury market is about $28T — tokenization is a rounding error of a rounding error", "About $500B", "The two are comparable"],
      answer: 1,
      explain: "That ratio is how you judge “mature” versus “early”: RWA is still extremely early, and no “already mainstream” claim survives these numbers.",
    },
    {
      q: "How do you use the yield decomposition formula?",
      options: ["Just compute the annualized return", "Benchmark against the same-tenor treasury, take the product's yield minus the benchmark as the risk premium, then interrogate what that premium pays for; whatever won't decompose is the risk you haven't seen", "Just look at the historical yield curve", "Compare fee levels across products"],
      answer: 1,
      explain: "A product calling itself “safe” while paying far above the treasury band is carrying risk in some layer you haven't located yet (Stage 12.4).",
    },
    {
      q: "Which audit-related red flag is the easiest to miss?",
      options: ["There is no audit report", "The audit report points at something other than the deployed contract address (auditing v1.2 and deploying v1.3 equals no audit)", "The auditor isn't famous enough", "The report is in English"],
      answer: 1,
      explain: "Stage 12.2's question ④: version, address, firm, and date must all line up. An audit whose address doesn't match offers no protection whatsoever.",
    },
    {
      q: "What three things make up the 20-minute monthly “stay current” routine?",
      options: ["Read three research reports", "Run the five monitoring metrics across your holdings, scan one regulator's news page, and reread one section of one PPM", "Scroll Twitter, check prices, join a group chat", "Reread the whole course"],
      answer: 1,
      explain: "Frameworks don't expire; numbers drift. The routine's value is recalibrating your sheet against primary sources, not relearning the material.",
    },
  ],

  further: [
    { label: "rwa.xyz: tokenized asset dashboard (first stop for recalibrating numbers)", url: "https://app.rwa.xyz/" },
    { label: "SEC EDGAR full-text search (read issuers' actual filings)", url: "https://www.sec.gov/edgar/search/" },
    { label: "Chainlink Proof of Reserve docs (the data layer's powers and limits)", url: "https://docs.chain.link/data-feeds/proof-of-reserve" },
    { label: "ERC-3643 official site (the standard's spec)", url: "https://www.erc3643.org/" },
    { label: "EUR-Lex: the MiCA regulation text (primary source for EU rules)", url: "https://eur-lex.europa.eu/eli/reg/2023/1114/oj" },
  ],
};
