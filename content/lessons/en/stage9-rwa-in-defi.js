export default {
  id: "rwa-in-defi",
  stage: 9,
  order: 3,
  title: "RWA Inside DeFi: Collateral, Money Markets & Sky/Maker",
  difficulty: "systems",
  prereqs: ["erc4626-vaults", "amm-orderbooks"],

  oneLiner:
    "The biggest strategic prize for RWA isn't being bought — it's being used, as collateral inside the DeFi machine. MakerDAO/Sky rotated billions of reserves into T-bills and at one point earned most of its protocol revenue from RWA, passing the yield back to DAI holders. But there's a trap in paradise: DeFi liquidates in minutes while RWA redeems in days — a crypto-speed crash against tradfi-speed collateral, and the gap between the two clocks is bad debt. Low LTVs and instant-redemption facilities aren't conservatism; they are the entire margin of safety.",

  intuition: `
The last two lessons ended somewhere bleak: RWA secondary markets are paper-thin and AMMs misfit them. So what is an RWA even doing on-chain? The answer hides in one shift of perspective: **stop selling RWA as a product and start installing it as a component.**

An analogy. You hold a \$1M certificate of deposit, sitting in a drawer earning interest. One day the bank says: this CD can be **pledged** — borrow against it, post it as trading margin, even sell off its "future interest" separately. Same CD, but it graduates from *asset* to **programmable collateral** — one pot of value doing three jobs.

That is what RWA entering **DeFi (decentralized finance)** means. Stage 6.4 showed how ERC-4626 vaults standardize yield-bearing shares and make them composable; now those shares are genuinely being composed into machinery: **deposit tokenized treasuries → borrow stablecoins → the collateral keeps accruing → the borrowed money goes to work**. Holding and using stop being mutually exclusive — a privilege that in traditional finance only large institutions get, through repo markets, and which DeFi turned into a public interface.

The headline character in this story is **MakerDAO (now Sky)**: an on-chain protocol that moved billions of reserves into T-bills, at one point earned **the majority of its revenue from RWA**, and used it to pay DAI holders something like Treasury interest. But the second half of this lesson is a bucket of ice water: DeFi's liquidation machine runs in **minutes**, RWA redemption runs in **days** — push a day-speed asset into a minute-speed machine and the seam between them is where bad debt breeds. Understand this speed mismatch and you understand the entire risk core of RWA × DeFi.

**Here's the map — five parts:**

- **① The perspective shift: RWA isn't for buying, it's for pledging**
- **② The flagship case: how MakerDAO/Sky turned itself around on T-bills**
- **③ The pattern menu: money markets, yield-bearing margin, yield stripping**
- **④ The speed mismatch: minute-scale liquidation meets day-scale redemption**
- **⑤ Cushion engineering: low LTVs, redemption rails, and legally wrapped risk**
`,

  mechanics: `
### ① The perspective shift: RWA isn't for buying, it's for pledging

First, the skeleton of DeFi lending in one minute: **overcollateralized borrowing**. You deposit \$100 of collateral and the protocol lets you borrow up to, say, \$77 of stablecoins — that 77% is the **LTV (loan-to-value)**. The protocol continuously watches a **health factor**: collateral value × liquidation threshold ÷ debt. When it drops below 1, anyone can trigger a **liquidation** — your collateral is auctioned to repay the debt, done in minutes.

Why are tokenized treasuries **dream collateral**? Compare to ETH: ETH can fall 20% in a day, so LTV rarely exceeds ~70% and needs a fat liquidation penalty; a T-bill fund's NAV **rises about 0.013% a day and essentially never draws down** (Stage 3.2). Low volatility → higher LTV is safe on price grounds; built-in yield → your collateral **appreciates while it sits pledged**. Hence one of DeFi's sexiest loops — the **carry loop**: deposit tokenized treasuries yielding 4.5%, borrow stablecoins at 3%, pocket the 1.5-point spread; buy more treasuries with the borrowed money, pledge, repeat. There is a reflexive limit, of course: as more people do it, borrow rates get pushed up and the spread compresses to zero — the market arbitrages itself flat (you'll meet this again when Stage 12.4 dissects yields).

**Composability (Stage 6.4) pays off here**: the same token is a fund share (legally, Stage 5), collateral (inside the protocol), and a yield source (accruing daily) — three jobs, one asset.

### ② The flagship case: how MakerDAO/Sky turned itself around on T-bills

Worth telling properly, because it's the textbook case of RWA × DeFi. **MakerDAO** (rebranded to **Sky** in 2024) issues the decentralized stablecoin **DAI** (with USDS added after the rebrand): users deposit collateral and mint DAI pegged to \$1. From 2020 to 2022 the collateral was almost entirely crypto (ETH, WBTC) plus a large pile of USDC — the protocol earned a spread, but the USDC reserves earned **nothing**, while off-chain the Fed was pushing rates toward 5%.

Hence the famous pivot: governance voted to **allocate billions of reserves into T-bills and tokenized treasuries**. The execution path is itself a law lesson (living material for Stage 5): a decentralized protocol **has no legal personality** and cannot open a brokerage account — so it had to land through **structured vaults**: the Monetalis/Clydesdale and BlockTower arrangements, using **Delaware trusts / SPVs** to hold the bonds, with the DAO controlling those entities through on-chain votes plus off-chain legal agreements; later it allocated directly into tokenized treasury products. **A DAO grew a legal body** — the frontier experiment in grafting DeFi onto the legal system.

The result: during the high-rate period, RWA at times generated **the bulk of protocol revenue (roughly 60–80% at the 2023 peak)**. Where did that money go? Into the **DSR (Dai Savings Rate)** — DAI holders deposit into the DSR contract and share the Treasury yield. Taste that for a moment: Stage 3.2 showed that a centralized stablecoin's business model is "**your money buys Treasuries, the issuer keeps the interest**." Maker inverted the arbitrage — **holders take the interest themselves**. It was the first time "decentralized" made a difference at the level of business model, not just ideology.

### ③ The pattern menu: money markets, yield-bearing margin, yield stripping

Beyond Maker, RWA × DeFi has grown a menu of patterns. Remember three:

- **Pattern one: money markets listing tokenized treasuries as collateral.** Lending markets like Morpho and Spark have onboarded sUSDS, USDY, and BUIDL-family assets as collateral: deposit the treasury token → borrow stablecoins. Essentially it opens ①'s carry loop to every eligible holder — while plugging RWA redemption risk into DeFi's liquidation machine for the first time (foreshadowing ④).
- **Pattern two: yield-bearing margin — the institutional killer app.** Exchanges and derivatives venues have begun accepting **tokenized money-market funds as margin**. In the traditional world, margin parked at an exchange is dead money; now BUIDL sits as margin and **the position stays open while the margin earns yield**. Ethena's USDtb (largely backed by BUIDL) is the scaled example of this idea. For institutions with hundreds of millions tied up in margin year-round, "margin that earns" isn't a nicety — it's a line item on the income statement.
- **Pattern three: yield stripping.** Pendle-style protocols **split a yield-bearing token in half**: the **PT (principal token)** — redeemable at face value at maturity, no yield attached; and the **YT (yield token)** — only the yield stream over that period. Want to lock a fixed rate? Buy PT (a zero-coupon bond in new clothes — an old friend from Stage 3.2). Want to bet on rates rising? Buy YT. RWA cash flows now have an on-chain **yield curve**, and the full traditional fixed-income playbook (duration, spread trades) starts replaying on-chain.

### ④ The speed mismatch: minute-scale liquidation meets day-scale redemption

Now the ice water. DeFi's liquidation machine assumes **collateral can be sold within minutes**. ETH crashed? The liquidator buys the collateral at auction and flips it on Uniswap, done in a few blocks. That assumption **does not hold** for RWA:

- Sell to whom? The secondary market is paper-thin (Stage 9.1).
- Redeem with the issuer? You wait for **the next NAV window** (once a day), and cash settles T+1 (Stage 9.1) — and in extremis you may run into a **redemption gate** (Stage 9.4).

Walk the incident script: Friday night, crypto crashes, stablecoin borrow rates spike, a vault's borrower goes underwater, health factor drops below 1. Liquidation fires — but the collateral is a tokenized treasury: the liquidator takes it and **can only file for redemption Monday at 15:00, with cash landing Tuesday**. Across those three days, debt interest compounds, markets move, stablecoins may depeg. If the LTV had been set at 90%, three days of drift is enough to make the collateral's realized value less than the debt — **bad debt**, absorbed by the protocol and socialized across depositors. The essence of the speed mismatch: **the liquidation machine's clock and the collateral's clock are out of sync, and every minute in between is exposure.**

<figure>
<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="rwa-in-defi-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-line)"/></marker></defs>
  <text x="320" y="22" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Speed mismatch: liquidation clock vs collateral clock</text>
  <line x1="60" y1="70" x2="600" y2="70" stroke="var(--line)" stroke-width="1.4" marker-end="url(#rwa-in-defi-arr-en)"/>
  <rect x="60" y="46" width="150" height="18" rx="4" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="135" y="59" text-anchor="middle" font-size="10" fill="var(--ink)">ETH collateral: minutes</text>
  <circle cx="80" cy="70" r="4" fill="var(--red)"/>
  <text x="80" y="90" text-anchor="middle" font-size="9" fill="var(--muted)">crash</text>
  <circle cx="140" cy="70" r="4" fill="var(--green)"/>
  <text x="146" y="90" text-anchor="middle" font-size="9" fill="var(--muted)">auctioned + sold</text>
  <line x1="60" y1="150" x2="600" y2="150" stroke="var(--line)" stroke-width="1.4" marker-end="url(#rwa-in-defi-arr-en)"/>
  <rect x="60" y="126" width="165" height="18" rx="4" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="142" y="139" text-anchor="middle" font-size="10" fill="var(--orange-ink)">RWA collateral: days</text>
  <circle cx="80" cy="150" r="4" fill="var(--red)"/>
  <text x="80" y="170" text-anchor="middle" font-size="9" fill="var(--muted)">Friday crash</text>
  <circle cx="330" cy="150" r="4" fill="var(--orange-ink)"/>
  <text x="330" y="170" text-anchor="middle" font-size="9" fill="var(--muted)">Monday NAV window</text>
  <circle cx="480" cy="150" r="4" fill="var(--green)"/>
  <text x="480" y="170" text-anchor="middle" font-size="9" fill="var(--muted)">Tuesday T+1 cash</text>
  <rect x="120" y="196" width="400" height="26" rx="6" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="320" y="213" text-anchor="middle" font-size="10" fill="var(--ink)">Those 3 days: interest compounds, markets move — exposure = bad debt</text>
</svg>
</figure>

### ⑤ Cushion engineering: low LTVs, redemption rails, and legally wrapped risk

The mismatch can't be removed, only cushioned. Four items from the engineering handbook:

- **Conservative LTVs**: give RWA collateral 75–80%, not the 95% its volatility alone would allow. The extra cushion isn't protection against price swings — it's protection against **settlement delay**. You're buying three days.
- **Redemption-aware liquidation design**: stop assuming instant sale; model the real path ("file redemption → T+n cash"), and size penalties and discounts to cover the time risk.
- **Instant-liquidity facilities**: BUIDL ships a **USDC instant-redemption facility** (supported by Circle) — effectively an **emergency lane** built for the liquidation machine, compressing "days" back to "minutes." Whether such a rail exists is the first question to ask about any RWA collateral's quality.
- **Circuit breakers**: in extreme conditions, pause new borrowing and freeze the liquidation queue — better to halt than to stampede.

Two more layers get overlooked. **Legally wrapped risk**: depositing a permissioned token (Stage 7.3) into a permissionless pool — the pool contract itself must be a whitelisted holder, or the depositor may already be breaching transfer restrictions, and in the extreme the issuer can \`forcedTransfer\` the collateral straight out (the switches from Stage 6.5 do get pressed) — a protocol's collateral can legally vanish. **Compounding oracle dependence**: the numerator of the health factor is the NAV feed (Stage 8.2) — if the feed stalls or errs, the liquidation machine is pricing a hallucination, and a stale NAV leaves the liquidatable un-liquidated while liquidating the sound.

To close, return to Stage 3.4's frame: traditional finance is **net settlement, business hours, a central counterparty**; on-chain is **gross settlement, 24/7, code as finality**. RWA × DeFi is the first time those two settlement philosophies **share one balance sheet** — and every seam at the interface (time zones, clocks, law, feeds) is an address where risk lives. If you take away one sentence: **push a day-speed asset into a minute-speed protocol, and the cushion (low LTV + a redemption rail) is not the conservative option — it is the entire margin of safety.**
`,

  demo: "collateral-vault",

  analogy: `
Picture a DeFi lending protocol as a **pawnshop** whose counter is fully automated: hand over something valuable, walk out with cash immediately, interest ticking by the second until you redeem it. The house rules are brutally strict: if the pledged item's market value falls below the warning line, the machine has it **on the auction block within minutes** — which is why it dares accept a volatile gold watch (ETH), just at a harsh haircut: pledge 100, borrow 70.

One day someone pledges a **large bank certificate of deposit** (a tokenized treasury): barely moves in price, earns interest daily. The pawnshop is delighted and loosens the haircut to 77 or higher. But the clerk missed a detail: the gold watch can be sold on the spot, while **the CD can only be redeemed through the bank's process** — business hours only, cash next day, closed on weekends.

Late Friday, the market breaks and a batch of borrowers blow up. The machine auctions the watches in minutes and the books clear; then it reaches the CDs — the bank opens Monday, money arrives Tuesday. **Across those three days, interest compounds and the market keeps falling.** If the haircut was set too loose, the redeemed cash may no longer cover the debt — and the shortfall is the pawnshop's own bad debt, ultimately socialized across all its depositors.

A smart pawnshop does two things: **deliberately keep the CD's haircut tight** (not from distrust of the CD, but as insurance on "redemption takes three days"), and negotiate a **fast lane** with the bank (BUIDL's USDC instant redemption) so a CD can be cashed on the spot in an emergency. The haircut and the fast lane are the entire rent a day-speed asset pays to live inside a minute-speed machine.
`,

  misconceptions: [
    "“T-bills are nearly risk-free, so tokenized treasuries are risk-free collateral.” —— Low asset risk ≠ low collateral risk. Collateral quality = value stability × speed of realization. T-bill value is stable, but realizing it runs through a NAV window plus T+n settlement — and “only cashable in three days” is itself a large risk in a crash.",
    "“A higher LTV means a more advanced, capital-efficient protocol.” —— For RWA collateral, a high LTV usually means no cushion was left for settlement delay. A 90% LTV vault produces bad debt under the combination of a flash crash and T+1 redemption; 75–80% isn't conservatism, it's pricing in time risk.",
    "“Maker/Sky buying T-bills means DeFi surrendered to TradFi.” —— The opposite: it inverted the centralized-stablecoin arbitrage of “your money buys Treasuries, the issuer keeps the interest” — the yield goes to holders via the DSR. It was decentralization's first differentiation at the level of business model rather than slogan.",
    "“A DAO is a purely on-chain organization, can't sign legal contracts, and therefore can't touch real assets.” —— Maker grew a “legal body” through Delaware trusts / SPVs plus off-chain agreements, controlled by on-chain governance. That graft is an advanced application of Stage 5's legal wrappers — and a new risk surface (trustees, legal text, enforcement chains).",
    "“I can deposit RWA tokens into any DeFi pool — the contract won't stop me.” —— Transfer restrictions travel with a permissioned token (Stage 7.3): the pool contract itself must be an eligible holder, or the deposit is a breach, and the issuer can even forcedTransfer the collateral back. Compliance risk doesn't disappear because you wrapped it in DeFi — it got wrapped in.",
    "“The carry loop (borrow at 3%, hold 4.5%) is a free lunch.” —— Reflexivity eats the spread: more participants → higher borrow rates → the positive spread compresses to zero. And looping leverage amplifies liquidation risk — the day rates invert, the most levered die first (Stage 12.4).",
  ],

  quiz: [
    {
      q: "What is the “strategic perspective shift” of RWA entering DeFi?",
      options: [
        "Selling RWA to more retail investors",
        "RWA's greatest value isn't being bought as a product but being installed as collateral in the DeFi machine — the same asset accrues yield, secures a loan, and supports lending at once; composability paying off",
        "Registering DeFi protocols as banks",
        "Replacing all crypto collateral with RWA",
      ],
      answer: 1,
      explain: "From product to component: deposit tokenized treasuries → borrow stablecoins → the collateral keeps accruing. Holding and using stop being mutually exclusive.",
    },
    {
      q: "Which best describes MakerDAO/Sky's RWA pivot?",
      options: [
        "It changed DAI to be backed 1:1 by dollar cash",
        "It allocated billions of reserves into T-bills through structures like Delaware trusts/SPVs; at the peak RWA generated roughly 60–80% of protocol revenue, and the yield reached DAI holders via the DSR",
        "It acquired a bank",
        "It abandoned stablecoins to become an exchange",
      ],
      answer: 1,
      explain: "The DAO grew a “legal body” through legal entities to sign agreements and hold bonds — and inverted the stablecoin model from “interest to the issuer” to “interest to holders.”",
    },
    {
      q: "What is the “speed mismatch”?",
      options: [
        "Blockchains produce blocks faster than bank transfers",
        "DeFi liquidates in minutes while RWA collateral is realized through a NAV window plus T+n settlement, in days — and the gap between the clocks is bad-debt exposure",
        "Oracles update slower than trades",
        "US equity T+1 is slower than on-chain",
      ],
      answer: 1,
      explain: "The liquidation machine assumes a sale within minutes; RWA can't. A Friday crash means redemption cash on Tuesday, with debt compounding and markets moving in between.",
    },
    {
      q: "Which of these is NOT an effective cushion against the speed mismatch?",
      options: [
        "Holding LTV at 75–80% to leave room for settlement delay",
        "Wiring in a BUIDL-style USDC instant-redemption facility",
        "Designing liquidation around the real “file redemption → T+n cash” path",
        "Raising LTV to 95% to improve capital efficiency",
      ],
      answer: 3,
      explain: "A high LTV is the recipe for bad debt: the cushion isn't for price volatility, it buys realization time. Low LTV + a redemption rail + circuit breakers is the actual engineering.",
    },
    {
      q: "What is the hidden compliance risk of depositing a permissioned RWA token into a permissionless DeFi pool?",
      options: [
        "Higher gas fees",
        "If the pool contract isn't a whitelisted eligible holder, the deposit itself breaches transfer restrictions — and the issuer can even forcedTransfer the collateral back, so the protocol's collateral isn't legally secure",
        "The yield drops",
        "No risk — DeFi isn't bound by law",
      ],
      answer: 1,
      explain: "Transfer restrictions travel with the token (Stage 7.3) and the issuer's switches are real (Stage 6.5). The compliance risk was wrapped into the protocol, not removed.",
    },
  ],

  further: [
    { label: "Sky (formerly MakerDAO): USDS and the Sky Savings Rate", url: "https://sky.money" },
    { label: "MakerDAO technical docs (vaults, liquidations & the DSR)", url: "https://docs.makerdao.com" },
    { label: "Morpho: on-chain money markets (a flagship venue for RWA collateral)", url: "https://morpho.org" },
    { label: "Pendle docs: splitting yield-bearing assets into PT / YT", url: "https://docs.pendle.finance" },
    { label: "Securitize × BlackRock BUIDL (including the USDC instant-redemption facility)", url: "https://securitize.io/blackrock/BUIDL" },
  ],
};
