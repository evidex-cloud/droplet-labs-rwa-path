export default {
  id: "primary-secondary",
  stage: 9,
  order: 1,
  title: "Primary Issuance vs Secondary Trading: Two Markets, Two Rulebooks",
  difficulty: "systems",
  prereqs: ["token-lifecycle", "transfer-restrictions"],

  oneLiner:
    "RWAs trade in two markets. The primary market is you versus the issuer — subscribe at NAV, redeem at NAV, price computed, not negotiated. The secondary market is holder versus holder — price discovered by supply and demand, on a venue that usually needs a license. As of 2025, the overwhelming majority of RWA volume is primary; secondaries are paper-thin. Understand why, and you understand the true state of RWA liquidity — and the entire body of securities law that sits between 'the token can be transferred' and 'the trade is legal.'",

  intuition: `
In Stage 1.1 you followed an RWA token through its life: originate → issue → trade → redeem. Now zoom in on the "trade" step — and you'll find **two completely different doors** standing there.

The first door leads to the **issuer**. You wire \$100,000 to the fund; the fund mints you tokens at today's net asset value (NAV, Stage 3.3). When you want out, you hand the tokens back to be burned and receive cash at that day's NAV. There is **no haggling anywhere** — the price isn't negotiated, it's **computed** by the fund's administrator.

The second door leads to **another holder**. Bob has tokens to sell, you want to buy, and the two of you have to agree on a number — he asks a bit high, you bid a bit low, and you meet somewhere. That price is **not computed; it's discovered by the market**. It can sit above NAV or below it.

The second door sounds more "free market," right? But the truth as of 2025 is: **almost all RWA volume goes through the first door**. BUIDL manages billions, yet its secondary trades are sparse; for most tokenized treasury products, "trading" means subscriptions and redemptions against the issuer. Why is an asset class that markets itself as "24/7 globally liquid" running a ghost town of a secondary market? It's not a bug — there are four solid structural reasons, and once you see them you'll be more clear-eyed than most people in the industry.

**Here's the map — five parts:**

- **① The primary market: the price is computed, and the door has gates**
- **② The secondary market: the price is discovered, and the venue needs a license**
- **③ The legal dividing line: an offering exemption doesn't cover resale**
- **④ The 2025 reality: why secondaries are thin — four diagnoses**
- **⑤ The implication flips: irrelevant for treasuries, existential for private assets**
`,

  mechanics: `
### ① The primary market: the price is computed, and the door has gates

The **primary market** has exactly one counterparty: **the issuer**. Two actions:

- **Subscribe**: cash in → the fund **mints** new tokens to you at that day's NAV. You pay \$100,000; today's NAV per share is \$1.0842; you receive 92,233.9 shares.
- **Redeem**: tokens back → they are **burned**, and the fund wires you cash at that day's NAV.

Notice there is **no price discovery** here. NAV is computed daily by the fund administrator (Stage 3.3) as "(assets − liabilities) ÷ shares outstanding," then pushed on-chain by an oracle (Stage 8.2). You're not choosing between a 1.09 ask and a 1.08 bid — there is one number; take it or stay out.

But this door has **four gates**:

- **Eligibility gate**: only addresses that have passed KYC and meet investor-eligibility rules (Stage 7.2) may subscribe. BUIDL requires Qualified Purchasers, minimum \$5M.
- **Size gate**: minimum subscription. Institutional products commonly start at \$100k–\$5M.
- **Time gate**: the **cutoff**. Most funds rule that "subscriptions before 15:00 get today's NAV; after that, tomorrow's" — because NAV is computed once a day.
- **Settlement gate**: anywhere from T+0 to T+2. The token can move in seconds, but the fiat leg travels by bank wire (Stage 3.4), so redemption cash often lands T+1. BUIDL compressed this to minutes via a USDC instant-redemption facility — one of its core selling points.

### ② The secondary market: the price is discovered, and the venue needs a license

The **secondary market** is **holder ↔ holder**. The issuer isn't involved, total supply doesn't change — tokens just change hands. Price is set by **supply and demand**: buyers post bids, sellers post asks, and the gap between them is the **spread**.

Secondary trading needs a **venue**, in three common shapes:

- **Order book**: buy and sell orders queue and match — the traditional exchange model (detailed in Stage 9.2).
- **AMM (automated market maker)**: a liquidity pool quotes prices by formula (the star of Stage 9.2).
- **OTC / RFQ (request-for-quote)**: large trades go straight to a market maker for a quote, settled one-on-one — the dominant form of institutional RWA secondary trading.

Here's the crux: if the token is a **restricted security** (most RWAs are, Stage 7.3), then **the venue itself needs credentials**. In the US, a platform that matches securities trades must register as an **ATS (Alternative Trading System)** — Securitize Markets, tZERO, and INX are all licensed ATSs. Matching securities trades without an ATS license makes the platform itself the lawbreaker. The one narrow exception is **pure peer-to-peer transfer**: two verified, eligible holders negotiating directly, with no matching platform in between — and ERC-3643's \`canTransfer\` check (Stage 7.3) enforces the "both parties are on the list" precondition on-chain.

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="primary-secondary-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-line)"/></marker></defs>
  <rect x="230" y="16" width="180" height="56" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="320" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="var(--orange-ink)">Issuer / Fund</text>
  <text x="320" y="58" text-anchor="middle" font-size="10" fill="var(--muted)">Daily NAV · mint &amp; burn</text>
  <rect x="40" y="130" width="150" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="115" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">Investor A</text>
  <text x="115" y="170" text-anchor="middle" font-size="10" fill="var(--muted)">verified · eligible</text>
  <rect x="450" y="130" width="150" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="525" y="152" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">Investor B</text>
  <text x="525" y="170" text-anchor="middle" font-size="10" fill="var(--muted)">verified · eligible</text>
  <path d="M150 130 L268 76" stroke="var(--orange-line)" stroke-width="1.6" marker-end="url(#primary-secondary-arr-en)"/>
  <path d="M372 76 L490 130" stroke="var(--orange-line)" stroke-width="1.6" marker-end="url(#primary-secondary-arr-en)"/>
  <text x="160" y="92" text-anchor="middle" font-size="10" fill="var(--orange-ink)">Primary: subscribe/redeem</text>
  <text x="480" y="92" text-anchor="middle" font-size="10" fill="var(--orange-ink)">price = NAV (computed)</text>
  <path d="M190 156 L450 156" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#primary-secondary-arr-en)" marker-start="url(#primary-secondary-arr-en)"/>
  <text x="320" y="148" text-anchor="middle" font-size="10" fill="var(--muted)">Secondary: holder ↔ holder</text>
  <text x="320" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">price discovered (can drift from NAV)</text>
  <rect x="180" y="216" width="280" height="60" rx="10" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="320" y="238" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">Venue: licensed ATS / eligible P2P</text>
  <text x="320" y="256" text-anchor="middle" font-size="10" fill="var(--muted)">order book · AMM · OTC RFQ — matching securities needs a license</text>
  <path d="M320 216 L320 178" stroke="var(--line)" stroke-width="1.2" stroke-dasharray="3 3"/>
</svg>
</figure>

### ③ The legal dividing line: an offering exemption doesn't cover resale

Why does the law regulate the two markets separately? Because **exemptions attach to the OFFERING, not to RESALE**.

A primary issuance is legal thanks to an **offering exemption**: Reg D 506(c) (accredited investors only), Reg S (offshore persons only) — covered in Stage 7.2. But those exemptions **only cover the issuer selling to you**. When you sell to someone else, that's a **new securities transaction** needing its own lawful path:

- **Rule 144**: private-placement securities can be resold after a 12-month lockup, subject to conditions (the "restricted period" from Stage 7.2 is precisely its product).
- **Trading on a licensed ATS**: the venue's license provides the compliance framework for the trade.
- **Section 4(a)(7)**: a private-resale exemption between accredited investors — demanding conditions, but it exists.

Engrave this sentence: **"the token is technically transferable" and "this trade is legally permitted" are two entirely independent propositions**. Anyone can call ERC-20's \`transfer\`, but if you sell a Reg D token to a non-accredited buyer during the lockup, a successful on-chain transfer won't save you — which is exactly why RWA tokens use permissioned standards like ERC-3643 to write the legal rules into \`canTransfer\` (Stages 6.2, 7.3): so that what is technically impossible coincides with what is legally forbidden.

### ④ The 2025 reality: why secondaries are thin — four diagnoses

Honestly stated: as of 2025, within the \$7–8B of tokenized treasuries, **the overwhelming share of volume is primary subscription and redemption**; secondary prints are often a handful per day. Four structural reasons:

- **Diagnosis one: holder bases are small and homogeneous.** A Reg D tokenized treasury fund might have tens to a few hundred holders, all institutions parking idle cash in T-bills. Markets need **disagreement** to trade — when everyone has the same motive, they all want the same side of the trade at the same time, and nobody finds a counterparty.
- **Diagnosis two: while the subscription/redemption window is open, primary IS the better liquidity.** The issuer is effectively a **market maker who always quotes exactly NAV with near-infinite depth**. Bob asks NAV + 30bp — why buy from Bob when you can subscribe with the issuer at NAV? The secondary market only matters when the primary **closes** — weekends, past the cutoff, or when redemptions are gated (a thread running straight to Stage 9.4).
- **Diagnosis three: transfer restrictions cut away most potential counterparties.** Whoever takes your tokens must already be KYC'd, eligible, and out of lockup (Stage 7.3). The smaller the eligible-counterparty set, the thinner the market — compliance colliding head-on with liquidity.
- **Diagnosis four: market makers can't warehouse the asset cheaply.** Making markets means holding inventory. Inventorying restricted securities eats compliance capacity, carries lockup risk, and usually has no hedging instrument — so making markets is expensive, so quotes are wide, so even fewer people come, and the spiral feeds itself.

The 2018–2019 wave of security-token exchanges died of exactly these four causes stacked together — tZERO's order books were thin enough that a \$50k order could punch through the price. Stage 10.6 performs the autopsies.

### ⑤ The implication flips: irrelevant for treasuries, existential for private assets

Here is a **flip** most people never think through: a thin secondary market **wounds different asset classes completely differently**.

- **For tokenized treasuries / money funds**: it barely matters. The product's pitch is "in and out at NAV, any business day" — **primary subscription/redemption IS the product**. The underlying T-bills are deeply liquid, NAV is computable daily, and the issuer redeems without strain. Thin secondary? Nobody cares.
- **For private credit, real estate, and other private assets** (Stage 3.5): secondary liquidity **is the core value tokenization promised**. "Making illiquid assets liquid" is page one of these pitch decks — but the underlying can't be sold quickly, the issuer **cannot offer at-will redemption**, and all liquidity must come from the secondary market. Which is precisely where it's hardest to build (fewer holders, harder pricing, worse information asymmetry). Where the promise is loudest is exactly where delivery is hardest — Stage 10.4's "liquidity illusion" is the post-mortem of this contradiction.

Venues are evolving too; remember a few directions: **24/7 RFQ desks** (market makers quoting tokenized treasuries around the clock — weekend premia are real); **compliant P2P bulletin boards** (verified holders post orders, the platform displays but doesn't match — a narrow path around the ATS requirement); **cross-platform fund-share transfers** (move your shares from platform A to platform B and trade there — transfer-of-record is easier to keep compliant than matching).

If you take away one sentence: **the primary market sells "in and out at NAV"; the secondary market sells "right now" — and as of 2025, most RWAs only have the former actually open for business, which is harmless for treasuries and a matter of life and death for private assets.**
`,

  demo: "two-markets",

  analogy: `
Think of an RWA token as a **gym membership**. The primary market is the gym's front desk: prices posted on the website, \$300 for an annual pass, sign up anytime (enrolling = subscribing); done with the gym, cancel per the contract and get a refund prorated by remaining months (canceling = redeeming). No negotiation — the price is **computed by formula**. But the front desk has gates: real-name registration (KYC), must be 18+ (eligibility), no transactions after 10 p.m. (the cutoff), refunds land in three business days (T+n settlement).

The secondary market is **membership resale on Craigslist**. Someone's emigrating and dumps an annual pass at half price; in peak season passes are scarce and buyers pay a premium. The price is **negotiated by supply and demand**, above or below list. But resale has rules: the gym requires the buyer to also be registered and 18+ (transfer restrictions), and large transfers must go through a gym-approved broker (the licensed venue) — private handshakes the gym won't honor.

Why is the Craigslist market for memberships **dead quiet**? Because the front desk is right there, open — anyone who wants a membership just buys one; anyone who wants out just cancels. Why haggle with a stranger? Only when **the front desk closes** (you need out at midnight; the gym suspends cancellations) does the Craigslist price suddenly matter — and at that moment, it's usually an ugly one.

But note: if the gym **doesn't allow cancellation at all** (private assets), then Craigslist isn't a backup — it's the **only exit**. Whether that resale market is alive determines whether your membership is an asset or wallpaper.
`,

  misconceptions: [
    "“Tokenized means liquid.” —— Tokenization gives an asset the **technical form** of transferability, but liquidity comes from someone willing to take the other side. As of 2025, most RWA secondaries are razor-thin; the real liquidity is the primary window — and when it closes, liquidity vanishes instantly (Stage 9.4).",
    "“A secondary price away from NAV means the market is broken.” —— The opposite: the deviation is the market **pricing the primary gate itself**. Discount = doubt about the redemption path; premium = capped subscriptions meeting hot demand. It's the price hugging NAV that needs explaining (the answer is Stage 9.4's arbitrage loop).",
    "“A successful on-chain transfer = a legal trade.” —— Two different things. Offering exemptions cover only the offering; resale needs its own path — Rule 144, an ATS, or 4(a)(7). On a plain ERC-20, technically succeeding while legally violating is entirely possible — the very reason permissioned standards exist (Stage 6.2).",
    "“RWA secondaries are thin because the tech is immature; better infrastructure will fix it.” —— The bottleneck isn't technology. Homogeneous holders, competition from the primary window, scarce eligible counterparties, expensive market making — all four causes are structural. A faster matching engine cannot conjure counterparties who want to trade.",
    "“Any platform can list an RWA trading pair.” —— Venues matching restricted securities need a license (US: an ATS). Matching securities trades without one makes the platform itself illegal — which is why the 2018 cohort of 'security token exchanges' either filed for ATS licenses or died.",
    "“Secondary liquidity matters equally for every RWA.” —— For daily-redeemable treasury products, primary IS the product and a thin secondary is harmless; for private assets with no at-will redemption, the secondary is the only exit and thinness is fatal. Evaluating RWA liquidity starts with one question: how often does the primary window open?",
  ],

  quiz: [
    {
      q: "What is the most fundamental difference between the primary and secondary markets?",
      options: [
        "Primary is on-chain, secondary is off-chain",
        "Primary is investor-versus-issuer at a computed NAV (mint/burn); secondary is holder-versus-holder at a price discovered by supply and demand",
        "Primary has high fees, secondary has low fees",
        "You can only buy in primary and only sell in secondary",
      ],
      answer: 1,
      explain: "Primary: counterparty is the issuer, price = computed NAV, total supply changes. Secondary: counterparty is another holder, price is market-discovered, supply unchanged.",
    },
    {
      q: "Why doesn't “the offering was compliant” imply “the resale is compliant”?",
      options: [
        "Because resales need no compliance",
        "Because Reg D/S exemptions only cover the issuer's sale; a resale is a new securities transaction needing its own path — Rule 144, a licensed ATS, or 4(a)(7)",
        "Because secondary prices are higher",
        "Because on-chain transfers can't be regulated",
      ],
      answer: 1,
      explain: "Exemptions attach to the offering. Selling onward is a new transaction that must find its own lawful channel — which is why transfer restrictions are coded into the token contract.",
    },
    {
      q: "As of 2025 most RWA secondaries are extremely thin. Which of these is NOT a structural cause?",
      options: [
        "Holder bases are small and homogeneous, so counterparties are scarce",
        "While open, the primary subscription/redemption window is the superior source of liquidity",
        "Transfer restrictions shrink the eligible-counterparty set",
        "Blockchain throughput is too low and matching is too slow",
      ],
      answer: 3,
      explain: "The bottleneck was never matching technology. Homogeneous holders, competition from the issuer as a 'perfect market maker', compliance limits, and costly market making are all structural.",
    },
    {
      q: "A tokenized treasury fund allows subscription/redemption at NAV before 15:00 on business days. You urgently need to sell 50k shares on a Sunday. What is the realistic cost?",
      options: [
        "Call the fund manager for a special redemption",
        "Take the wide spread in the secondary market — the spread is the price of “right now”",
        "Zero — on-chain assets can always be sold at NAV",
        "Burn the tokens to automatically receive cash",
      ],
      answer: 1,
      explain: "When the primary window is closed, the secondary is the only exit, and a thin market's wide spread is exactly how urgent liquidity gets priced. That is the secondary market's true reason to exist.",
    },
    {
      q: "Why is a thin secondary far more serious for private-asset RWAs than for treasury RWAs?",
      options: [
        "Private-asset tokens use older technology",
        "Treasury products sell at-will primary redemption, so secondary is a backup; private-asset issuers can't redeem at will, so the secondary is the only exit — thinness means the promise fails",
        "Private assets have more holders",
        "Treasury RWAs prohibit secondary trading",
      ],
      answer: 1,
      explain: "“Making the illiquid liquid” is private-asset tokenization's core promise, and it can only be delivered by the hardest market to build — Stage 10.4's liquidity illusion.",
    },
  ],

  further: [
    { label: "Investor.gov: Rule 144 (reselling restricted securities)", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-144-selling-restricted-and-control-securities" },
    { label: "Investor.gov: What an ATS (Alternative Trading System) is", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/alternative-trading-system-ats" },
    { label: "Securitize (flagship licensed transfer agent + ATS)", url: "https://securitize.io" },
    { label: "tZERO (survivor of the 2018 security-token ATS generation)", url: "https://www.tzero.com" },
    { label: "RWA.xyz (tokenized-asset size & holder data dashboard)", url: "https://app.rwa.xyz" },
  ],
};
