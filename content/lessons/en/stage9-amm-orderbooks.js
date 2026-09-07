export default {
  id: "amm-orderbooks",
  stage: 9,
  order: 2,
  title: "AMMs & Order Books: Why RWA Liquidity Is Hard",
  difficulty: "systems",
  prereqs: ["primary-secondary"],

  oneLiner:
    "Secondary markets run on two engines: order books, where market makers post quotes and earn the spread, and AMMs, where an x·y=k curve prices trades automatically. Bolt either onto an RWA and both misfire: an order book with no willing market makers is a ghost town, and an AMM has no idea the NAV drifts upward every day — so arbitrageurs bleed its LPs continuously (a loss called LVR). NAV-anchored curves stop the bleeding at the cost of inheriting oracle risk. The only deeply liquid RWA pools are stablecoin pools — precisely because that asset class carries no transfer restrictions. The exception maps the rule.",

  intuition: `
Stage 9.1 left a question hanging: behind that secondary-market door, **what machine is actually matching the trades**?

Imagine selling 100 shares of some obscure stock. Method one: **pin up a notice** — "selling 100 shares at \$50" — and wait for a taker. That's an **order book**: everyone's notices line up in two columns (bids on one side, asks on the other), and when prices meet, trades happen. The problem: if nobody posts notices, you're staring at a bare wall — nothing to buy, nobody to sell to.

Method two: a **vending machine** at the neighborhood gate holds two kinds of things (say, tokens and USDC) and quotes you a price at any moment by a fixed formula. You can swap anytime, waiting for no one. That's an **AMM (automated market maker)** — one of DeFi's great inventions; Uniswap used it to carry hundreds of billions of dollars in crypto spot volume.

So what happens when you drop an RWA token into these two machines? **Both break** — and in different ways. The order book's failure is "nobody willing to camp there posting quotes." The AMM's failure is sneakier: it's a **dumb machine that doesn't know the underlying asset accrues yield every day**, so arbitrageurs settle on it like mosquitoes, draining the liquidity providers drop by drop — a phenomenon with its own name: **LVR**. Understand these two failures and you understand the technical root of "RWA liquidity is hard" — last lesson was the demand side (nobody wants to trade); this lesson is the supply side (the machines themselves misfire).

**Here's the map — five parts:**

- **① Order books: depth, market makers, and how ghost towns form**
- **② AMMs: walking x·y=k with real numbers**
- **③ Failures one and two: KYC shrinks the pool, drift bleeds the LPs (LVR)**
- **④ Failures three and four: NAV-anchored curves, and an unbeatable opponent**
- **⑤ The exception maps the rule: why stablecoin pools, of all things, succeeded**
`,

  mechanics: `
### ① Order books: depth, market makers, and how ghost towns form

The **order book** mechanism in one sentence: **limit orders queue by price**. Bids rank high to low (the highest is the best bid), asks rank low to high (the lowest is the best ask); where the two sides meet, trades print, and the gap between them is the **spread**.

What actually brings an order book to life is the **market maker**: a professional player who **posts both sides at once** — say bid \$1.0820 / ask \$1.0860. Whenever you show up, someone is there to take your tokens or supply them. What does the market maker earn? The spread: buy low, sell high, 40bp per round trip. What do they bear? **Inventory risk**: they take your tokens and the price drops on their hands.

**Depth** is the core quality metric of a book: how much size is posted near the current price? On a \$5M-deep book, selling \$500k slips a few bp; on a \$50k-deep book, the same order punches straight through three price levels.

The key causal chain: **no market makers → no depth → traders arrive and get mauled by slippage → even fewer come → even less business for market makers**. That death spiral is how a ghost town forms. The 2018 generation of security-token exchanges died of exactly this — tZERO's books were so thin institutions didn't dare place orders (full autopsy in Stage 10.6). Traditional exchanges solve it by **paying market makers** (rebates, market-making agreements); but an RWA market maker also faces the extra cost from Stage 9.1's diagnosis four — restricted securities can't be warehoused cheaply.

### ② AMMs: walking x·y=k with real numbers

The **AMM (Automated Market Maker)** flips the approach: no matching — build a **liquidity pool**. Take the classic **constant-product formula**:

> The pool holds x of token A and y of token B, with one rule: **the product x · y must be the same before and after every trade.**

Walk it with real numbers. Pool: **100,000 TBF × 100,000 USDC**, so k = 100,000 × 100,000 = 10¹⁰. Implied price: 1 TBF ≈ 1 USDC. You want to buy 10,000 TBF:

- After the trade the pool holds TBF = 90,000, so to keep the product constant, USDC must equal 10¹⁰ ÷ 90,000 ≈ **111,111**.
- You pay in 111,111 − 100,000 = **11,111 USDC** and take out 10,000 TBF.
- Your average price = 11,111 ÷ 10,000 ≈ **\$1.111** — 11.1% above the starting price. That's **price impact**: the more you buy, the further the curve pushes the price. The deeper the pool (bigger k), the smaller the impact for the same size.

Where do the pool's tokens come from? **Liquidity providers (LPs)** deposit both assets in the current ratio, receive pool shares, and earn a fee on every trade (e.g. 0.3%). The LP's risk is called **adverse selection**: the people who come to trade tend to know more than the pool — when the price should move, arbitrageurs arrive first and carry off the pool's mispriced tokens. LPs stand permanently on the wrong side of the information. Hold that sentence; in ③ it becomes a knife.

### ③ Failures one and two: KYC shrinks the pool, drift bleeds the LPs

**Failure one: KYC gating.** RWA tokens are restricted securities (Stage 7.3) — **every LP and every trader in the pool must be a verified, eligible holder**, and often the pool contract itself must be whitelisted. Uniswap's depth comes from "anyone can be an LP"; replace "anyone" with "Reg D-verified qualified purchasers" and the LP set shrinks from millions to a few hundred. **Permissioned pools** are entirely feasible technically (ERC-3643-compatible pools have existed for years), but every permissioned pool you build slices the already-scarce liquidity one more time — **fragmentation**.

**Failure two: drift bleed (LVR).** This is the deep flaw only experts point at. An RWA's fair value is not a random walk — **it drifts predictably**: a T-bill fund's NAV rises about 0.013% per day (~4.7% annualized, Stage 8.2). But an x·y=k pool **doesn't know that** — its quote depends only on its balances. So every morning:

- NAV ticked up 0.013%; the pool still quotes yesterday's price → the pool's TBF is **now below fair value**.
- An arbitrageur immediately buys the cheap TBF and pushes the pool price back to fair — **the difference lands in the arbitrageur's pocket, paid out by the LPs**.
- Tomorrow, the same play runs again. Day after day.

That is **LVR (loss-versus-rebalancing)**: LPs systematically **sell the appreciating asset too cheap and buy the depreciating one too dear**. For randomly fluctuating assets, LVR is the cost of volatility; for a yield-bearing asset **whose direction is known and upward every day**, LVR becomes a **steady bleed line** — trading fees often can't cover it. Conclusion: yield-bearing RWAs need **drift-aware curves**; a dumb pool won't do.

### ④ Failures three and four: NAV-anchored curves, and an unbeatable opponent

**Failure three (really, the cost of the cure): oracle-anchored designs.** If the pool is dumb, give it eyes: **pin the curve's center to the NAV feed** (Stage 8.2) and quote only within NAV ± a narrow band. Implementations vary: a Curve-style **stableswap** curve concentrating depth around a *moving* peg, or plain **RFQ** — market makers quoting straight off the latest feed. The drift bleed stops (the curve tracks NAV, so the arbitrage vanishes). But the price appears immediately: **the pool inherits the oracle's entire risk profile** (Stage 8.1). A wrong feed means trading at wrong prices; a slow feed opens a **front-running window** — in the minutes after NAV updates off-chain but before the feed catches up, the informed can empty the pool at the stale price (the stale-price attack from Stage 8.2, now with a cash-value target).

**Failure four: an unbeatable opponent.** The most honest cut of all: for an RWA with an open subscription/redemption window, the AMM is competing with **the issuer** — a "perfect market maker" quoting exactly NAV, with near-infinite depth and zero spread (Stage 9.1, diagnosis two). On weekday business hours, rational traders always choose the primary window; the AMM picks up scraps. The AMM's real niche is **when the primary is closed**: weekends, past cutoff, and trades among non-eligible holders (where compliance permits). Designing an AMM for RWA means designing a **gap-filler market**, not the main market — think that through and a lot of "DEX for RWA" pitch decks shatter on contact.

<figure>
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="amm-orderbooks-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-line)"/></marker></defs>
  <text x="160" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Constant product x·y=k</text>
  <path d="M60 60 Q 90 190 280 210" stroke="var(--orange-line)" stroke-width="2" fill="none"/>
  <line x1="50" y1="40" x2="50" y2="220" stroke="var(--line)" stroke-width="1"/>
  <line x1="50" y1="220" x2="290" y2="220" stroke="var(--line)" stroke-width="1"/>
  <circle cx="118" cy="118" r="5" fill="var(--orange-ink)"/>
  <text x="132" y="112" font-size="10" fill="var(--muted)">depth smeared along the curve</text>
  <text x="132" y="126" font-size="10" fill="var(--muted)">big order → big impact</text>
  <text x="160" y="246" text-anchor="middle" font-size="10" fill="var(--muted)">blind to NAV → arbs collect the drift tax daily</text>
  <text x="480" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">NAV-anchored curve (stableswap-style)</text>
  <path d="M380 56 Q 420 100 445 128 Q 530 148 560 216" stroke="var(--orange-line)" stroke-width="2" fill="none"/>
  <line x1="370" y1="40" x2="370" y2="220" stroke="var(--line)" stroke-width="1"/>
  <line x1="370" y1="220" x2="610" y2="220" stroke="var(--line)" stroke-width="1"/>
  <line x1="490" y1="40" x2="490" y2="220" stroke="var(--orange-line)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="490" y="52" text-anchor="middle" font-size="10" fill="var(--orange-ink)">NAV feed (a peg that drifts)</text>
  <rect x="452" y="120" width="76" height="26" rx="6" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="490" y="137" text-anchor="middle" font-size="9" fill="var(--ink)">depth packed at the peg</text>
  <text x="480" y="246" text-anchor="middle" font-size="10" fill="var(--muted)">drift bleed stops — but oracle risk moves in (slow feed = front-run window)</text>
</svg>
</figure>

### ⑤ The exception maps the rule: why stablecoin pools, of all things, succeeded

Is there any RWA with deep AMM liquidity? Yes — and at enormous scale: **stablecoin pools**. Curve's 3pool (USDC/USDT/DAI) has held hundreds of millions to billions in depth for years, with slippage measured in bp — and stablecoins are precisely the first RWA that worked (Stage 4). Why them? Check each failure off the list:

- **No transfer restrictions**: stablecoins are bearer payment instruments, not restricted securities — anyone can LP, anyone can trade. Failure one gone.
- **A huge, heterogeneous holder base**: tens of millions of addresses with different motives (payments, safe haven, trading, cross-border) — two-way flow around the clock. Stage 9.1's diagnosis one gone.
- **A known, nearly motionless peg**: fair value ≈ \$1.00, so a stableswap curve can confidently pile all its depth at \$1. Failure two gone — and no oracle needed, the peg is baked into the curve. Failure three gone.
- **A gated primary window**: redeeming directly with Circle takes a corporate account and size minimums; for most people the AMM is actually more convenient. Failure four inverted.

See the cause clearly: **stablecoin pools succeeded precisely because that asset stopped being restricted** — it sidesteps every constraint that suffocates the rest of RWA. The exception maps the rule: **the RWA liquidity problem is not an interface problem or a curve problem; it is a "who is allowed to participate" problem**. Every batch of participants a restriction cuts away cuts away a layer of depth — and no matching engine can route around that.

If you take away one sentence: **order books die of nobody posting, dumb AMMs die of not knowing NAV drifts, smart AMMs live in the oracle's shadow — and the only truly liquid RWA pool is the exception whose asset carries no restrictions at all.**
`,

  demo: "amm-pool",

  analogy: `
Think of an AMM as a **coin-change machine** at the neighborhood gate: inside are two bins — one of arcade tokens, one of cash — and it prices swaps automatically by "the product of the two bins never changes." Anyone can swap, and the machine never clocks out. Residents can also **buy shares in the machine** (become LPs): deposit into both bins, share the fees.

Now suppose the arcade tokens are actually **interest-bearing gift cards** — appreciating 0.013% every day, automatically. The machine has no idea; it only sees bin counts. So every morning, some sharp character is **first in line**, swapping out a batch of appreciated cards at yesterday's stale price and flipping them for an instant profit. Day after day, the residents who bought shares discover: yes, the fees trickle in, but **the appreciating cards keep getting hauled off below fair value** — and by year end they'd have done better just keeping the cards in a drawer. That's LVR: the dumber the machine, the fatter the mosquitoes.

The upgrade is to give the machine a **networked screen** showing the cards' official net value in real time, and quote right against it. The mosquitoes lose their target — but a new problem arrives: **what if the screen breaks, or lags?** Official value updates at 10:00, the screen refreshes at 10:30 — and in that half hour, the informed can empty the bins at the old price again. The machine's fate now hangs on the screen.

The most galling part: directly across the street stands **the gift-card issuer's own service counter** — unlimited size at exact net value, zero spread, all business day. The machine's only real trade comes at night and on weekends, when the counter is shut. Before installing the machine, be clear about which market you're building: the main one, or the gap-filler.
`,

  misconceptions: [
    "“AMMs are more advanced than order books, so RWAs just need an AMM to be liquid.” —— An AMM merely writes market-making rules into a formula; it creates no trading demand and waives no compliance. KYC shrinks the LP set, and a dumb curve gets bled by drift — automation cannot conjure depth.",
    "“LPs earn fees for doing nothing.” —— LPs bear adverse selection: arbitrageurs always move first when the price should change. For predictably yield-accruing RWAs this becomes systematic LVR bleeding — which fees often fail to cover. Always benchmark LP returns against simply holding.",
    "“Anchor the curve to the NAV feed and you're done.” —— It stops the drift bleed, but the pool now inherits oracle risk: a wrong feed means wrong-price fills; a slow feed opens a front-running window. You didn't eliminate the risk — you moved it into Stage 8's territory.",
    "“Curve's stablecoin pools prove AMMs work for RWA.” —— The opposite: those pools succeed because the asset has no transfer restrictions, a massive heterogeneous holder base, and a nearly motionless peg — it sidesteps every RWA constraint. Passing off the exception as the rule is this sector's most common fundraising pitch.",
    "“Thin order books mean the exchange's technology is weak.” —— Books are thin because no market maker will camp there: restricted-security inventory is expensive, counterparties are scarce, and no spread is wide enough without volume. Matching-engine speed was never the bottleneck — the 2018-era engines were plenty fast, and the books were ghost towns anyway.",
    "“An AMM can replace the primary subscription/redemption window.” —— While the window is open, the issuer is a perfect market maker quoting exactly NAV with unlimited depth; the AMM can't win. Its niche is the hours the window is shut — a gap-filler market, not the main one.",
  ],

  quiz: [
    {
      q: "A pool holds 100,000 TBF × 100,000 USDC (x·y=k). Roughly how much USDC do you pay to buy 10,000 TBF?",
      options: [
        "10,000 (at 1:1)",
        "About 11,111 — with TBF down to 90,000, USDC must rise to 10¹⁰÷90,000 ≈ 111,111 to keep the product constant",
        "9,000",
        "It depends on the asks in the order book",
      ],
      answer: 1,
      explain: "Constant product: 90,000 × y = 10¹⁰ → y ≈ 111,111; you pay the difference ≈ 11,111 at an average price of $1.111 — that 11.1% shift is price impact.",
    },
    {
      q: "What is LVR (loss-versus-rebalancing)?",
      options: [
        "The loss from LPs forgetting to compound their fees",
        "The pool doesn't know fair value has moved, so arbitrageurs keep carrying off mispriced tokens at stale prices — LPs systematically sell winners cheap and buy losers dear",
        "Losses caused by high gas fees",
        "Another name for impermanent loss that only appears in crashes",
      ],
      answer: 1,
      explain: "For an RWA accruing yield daily, the drift's direction is known — LVR turns from 'the cost of volatility' into a steady bleed line. That's the core reason dumb AMMs misfit yield-bearing assets.",
    },
    {
      q: "Anchoring an AMM curve to the NAV feed (stableswap-style) fixes what, and introduces what?",
      options: [
        "Fixes slippage, introduces higher fees",
        "Fixes the drift bleed (the curve tracks NAV), but the pool inherits oracle risk — a lagging feed opens a front-running window",
        "Fixes the KYC problem, introduces regulatory risk",
        "Fixes nothing — pure marketing",
      ],
      answer: 1,
      explain: "With the anchor moving alongside NAV the arbitrage vanishes, but quote quality now depends on the feed being right and fresh — the risk relocates to Stage 8's territory.",
    },
    {
      q: "Why does an AMM face “an unbeatable opponent” while the subscription/redemption window is open?",
      options: [
        "Because the issuer charges lower fees",
        "Because the issuer is effectively a perfect market maker quoting exactly NAV with near-infinite depth and zero spread — rational traders only need the AMM when the window is closed",
        "Because regulators ban AMMs on weekdays",
        "Because the issuer will sue the AMM",
      ],
      answer: 1,
      explain: "For at-will-redeemable RWAs the AMM is a gap-filler market (weekends, post-cutoff, off-list holders), not the main market — which caps its realistic size.",
    },
    {
      q: "Curve's 3pool holds enormous depth. What is the correct lesson for the rest of RWA?",
      options: [
        "It proves every RWA can get AMM depth",
        "It succeeded precisely because the asset has no transfer restrictions, a huge heterogeneous holder base, and a nearly motionless peg — every RWA restriction cuts a layer of depth; that is the rule",
        "It proves the stableswap curve suits every asset",
        "It proves order books are obsolete",
      ],
      answer: 1,
      explain: "The exception maps the rule: liquidity is not a curve problem but a 'who may participate' problem. More restrictions, thinner depth — no engine routes around it.",
    },
  ],

  further: [
    { label: "Uniswap V2 whitepaper (the constant-product AMM original)", url: "https://uniswap.org/whitepaper.pdf" },
    { label: "Curve StableSwap whitepaper (concentrating depth around a peg)", url: "https://curve.fi/files/stableswap-paper.pdf" },
    { label: "The LVR paper: Automated Market Making and Loss-Versus-Rebalancing", url: "https://arxiv.org/abs/2208.06046" },
    { label: "Uniswap docs (pools, LPs & fee mechanics)", url: "https://docs.uniswap.org" },
    { label: "RWA.xyz (observe real secondary depth of RWA tokens)", url: "https://app.rwa.xyz" },
  ],
};
