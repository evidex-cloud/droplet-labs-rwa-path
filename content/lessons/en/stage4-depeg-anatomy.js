export default {
  id: "depeg-anatomy",
  stage: 4,
  order: 3,
  title: "When the Peg Breaks: USDC & SVB, 48 Hours in 2023",
  difficulty: "core",
  prereqs: ["stablecoin-anatomy"],

  oneLiner:
    "One weekend in March 2023, USDC — the most transparent stablecoin in the industry — traded at $0.87. Not because of a code bug, and not because the reserves were fake, but because $3.3 billion of cash sat inside a failed bank, and the redemption channel that repairs the peg runs on bank wires — and banks close on weekends. The 24/7 chain collided with the Monday-to-Friday pipes. It is the best natural experiment in RWA history: it demonstrated, with real money, that “the peg is the health of the redemption path, priced in real time.”",

  intuition: `
Last lesson you learned to pick apart reserve reports, and you saw that USDC is the industry's transparency benchmark: 80% Treasuries, 20% bank cash, monthly Deloitte attestations. By rights, it should have been the least likely coin to depeg.

Then on Saturday, March 11, 2023, you open an exchange and USDC is quoting **$0.88**.

What happened? Were the reserves fake? No. Was the contract hacked? No. The answer hides in a detail everyone had ignored: of that 20% “cash,” $3.3 billion was deposited at **Silicon Valley Bank (SVB)** — and SVB was seized by regulators on Friday morning. Worse: even if the panic was overblown, the arbitrage loop that pulls the price back to $1 (buy low → redeem → receive dollars) **couldn't run**. Redemption payouts ride bank wires, and banks **don't work weekends**.

These 48 hours deserve an hour-by-hour replay more than any case in this course: how a bank run (off-chain, textbook) ignited a stablecoin run (on-chain, priced in real time), how panic **spread contagiously** through DeFi's lego bricks into DAI, and why the knot was finally cut not by any code, but by a statement out of Washington on Sunday night. Understand this weekend, and you truly understand the sentence this course keeps repeating: **RWA risk lives on the off-chain half.**

**Here's the map — five parts:**

- **① The root cause: how the seesaw crushed a bank**
- **② The timeline: Wednesday to Friday night, a 48-hour fall**
- **③ The deadlock: a 24/7 chain meets nine-to-five plumbing**
- **④ Contagion: DAI drops in sympathy and the Curve pool tilts**
- **⑤ Sunday's backstop, Monday's repair, and five expert-grade lessons**
`,

  mechanics: `
### ① The root cause: how the seesaw crushed a bank

Start with how SVB itself died — this is the price↔yield seesaw from Stage 3.2 making its first appearance with a body count.

- **2020–2021 deposit explosion**: SVB was the bank of the Silicon Valley venture world. In the zero-rate era, startup funding rounds poured in as deposits, which roughly **tripled** to nearly $200 billion.
- **The mismatch**: unable to lend that much out, SVB parked the bulk in **long-duration** Treasuries and agency MBS, locking in yields around 1.5%. Note: the assets weren't unsafe (all government-grade credit) — the **duration** was the mistake.
- **The seesaw moves**: in 2022–2023 the Fed took rates from 0 to 5%. You did this math in Stage 3.2: when rates rise, existing low-coupon bonds fall in price, and the longer the duration the harder the fall. SVB's unrealized losses snowballed to roughly **$15 billion** — about the size of its entire equity.
- **One match needed**: unrealized losses stay unrealized only if you never sell. But when depositors withdraw, you must sell — and turn paper losses into real ones.

On Wednesday, March 8, the match was struck: SVB announced it had sold $21 billion of bonds at a loss and would raise equity to plug the hole. That was a broadcast to every depositor on earth: “our assets cannot survive all of you withdrawing.”

### ② The timeline: Wednesday to Friday night, a 48-hour fall

- **Wednesday (Mar 8), evening**: SVB discloses a $1.8B loss on bond sales plus a share offering. Silicon Valley VC group chats light up.
- **Thursday (Mar 9)**: a textbook bank run at light speed — VCs tell their portfolio companies to get out, and **$42 billion** of withdrawal requests hit SVB in a single day. The stock drops 60%. In the mobile-banking era, a run needs no queue outside the branch.
- **Friday (Mar 10), morning**: California regulators close SVB and the **FDIC takes over** — the second-largest bank failure in US history (at the time). Deposits above the $250k insurance cap — over 90% of SVB's deposits — are in limbo.
- **Friday, intraday**: the market starts asking: whose money is inside SVB? Circle's reserves are ~$40 billion, with the cash slice spread across several banks — how much is at SVB?
- **Friday (Mar 10), late night**: Circle discloses on Twitter: **$3.3 billion** of reserve cash remains at SVB — about **8%** of reserves. Honest, prompt — and the market votes with its feet immediately.
- **The weekend**: panic at full speed. USDC prints as low as **$0.87–0.88** on secondary markets. Coinbase suspends weekend USDC↔USD conversions (it, too, depends on banking rails), amplifying the fear.

Pause for arithmetic: even if the $3.3B at SVB went **entirely to zero** (an extreme assumption), USDC's reserves still covered about 92 cents per token — a market price of $0.88 was pricing things *worse than the worst case*. Why? Because over the weekend **no mechanism existed to turn 92 cents of theoretical value into dollars in hand**. That's ③.

### ③ The deadlock: a 24/7 chain meets nine-to-five plumbing

Stage 4.1's peg engine is the arbitrage loop: **price below $1 → buy → redeem with Circle → receive a dollar wire → repeat**. Over the weekend, the loop broke at its final link:

- Buy on-chain: ✅ anytime — DEXes never close.
- Submit the redemption to Circle: ✅ can be submitted.
- **Receive dollars**: ❌ payouts ride **Fedwire/bank wires**, and banks and Fedwire are **closed on weekends**. Money arrives Monday at the earliest — and only if Circle's operating accounts at other banks aren't frozen in a chain reaction.

<figure>
<svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
<defs><marker id="dp-ah-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--orange-line)"/></marker></defs>
<rect x="16" y="24" width="608" height="60" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
<text x="30" y="46" font-size="11" fill="var(--ink)" font-weight="600">On-chain: 7 × 24 × 365</text>
<text x="30" y="66" font-size="10" fill="var(--muted)">buy ✅ · transfer ✅ · submit redemption ✅ · panic pricing ✅ — all fully operational at 3 a.m. Saturday</text>
<rect x="16" y="120" width="608" height="60" rx="10" fill="var(--red-soft)" stroke="var(--line)"/>
<text x="30" y="142" font-size="11" fill="var(--ink)" font-weight="600">Off-chain: Monday–Friday, 9:00–17:00</text>
<text x="30" y="162" font-size="10" fill="var(--muted)">Fedwire ❌ closed weekends · banks ❌ closed · redemption payout ❌ stuck — the arb loop breaks at its last link</text>
<line x1="320" y1="84" x2="320" y2="120" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#dp-ah-en)"/>
<text x="332" y="106" font-size="10" fill="var(--orange-ink)" font-weight="600">the peg engine stalls here</text>
</svg>
</figure>

The result was a scene no textbook had: **arbitrageurs staring at a known 12-cent profit they could not take**. Institutions with direct redemption access queued for Monday; retail without access trampled each other around $0.90. The price stopped reflecting reserve value and started reflecting **“the uncertainty between now and Monday, times your level of panic.”** Keep this definition-grade conclusion: **the peg's price = the market's real-time pricing of the redemption path's health.** Reserves are necessary; but when the path is blocked, no quantity of reserves holds the price up.

### ④ Contagion: DAI drops in sympathy and the Curve pool tilts

DeFi's composability (lego bricks, freely stackable) is efficiency in calm times and a **contagion channel** under stress:

- **DAI in sympathy**: at the time, **more than half** of DAI's collateral (Stage 4.1's crypto-collateralized flagship) was USDC. When USDC hit $0.90, DAI's “collateral” shrank with it, and DAI depegged to around $0.89 in lockstep. Peak irony: the stablecoin that set out to be decentralized got beaten up alongside the centralized stablecoin filling its vaults.
- **The Curve 3pool tilt**: Curve's 3pool is the giant USDC/USDT/DAI swap pool, normally about one-third each. All weekend, everyone frantically swapped USDC and DAI into USDT (the market suddenly trusted Tether more — its reserves sit *outside* the US banking system), until the pool was stuffed with USDC/DAI and nearly drained of USDT. **The pool's imbalance became a live panic gauge** — something unique to the on-chain world: the run happened faster, and in full public view.

This plants a flag for later in the course: once RWAs are deeply embedded in DeFi (Stage 9.3), any off-chain failure **propagates instantly along the collateral chain**.

### ⑤ Sunday's backstop, Monday's repair, and five expert-grade lessons

- **Sunday (Mar 12), evening**: the Treasury, Federal Reserve, and FDIC jointly invoke the **systemic risk exception**: **all** SVB deposits — including those above the insurance cap — are **fully guaranteed**, accessible Monday. (Signature Bank was seized and guaranteed the same night.)
- **Monday (Mar 13)**: banks open, wires flow, Circle announces any shortfall would be covered from corporate resources, redemptions proceed. The arbitrage loop reconnects: buy USDC at $0.95 → redeem at $1 — free money. The price climbs back above $0.99 within days and fully repegs within about a week. Afterward, Circle moved its cash to larger systemically important banks and pushed more reserves into the Treasury fund.

Five lessons — each one belongs in your due-diligence checklist:

- **A “cash” bucket is only as good as the bank it sits in.** Reserve concentration risk isn't about the asset-class label; it's about the **counterparty**. The $3.3B lesson: diversified custody is not optional.
- **Operating-hours mismatch is structural risk.** The chain prices 24/7; fiat pipes settle nine-to-five. Every weekend is a small stress-test window. This is why the industry pushes 24/7 settlement networks and tokenized money funds (Stage 10).
- **Transparency cuts both ways**: Circle's Friday-night disclosure both **triggered** the panic selling and gave the market a basis to **price accurately** (0.87, not 0.50), paving the way for Monday's rapid repair. The control group is Tether — opacity spared it this kind of instant run, at the cost of a permanent trust discount.
- **The ultimate backstop is the state**: the knot was cut by a Treasury statement, not a smart contract. A fiat stablecoin's final guarantor is the fiat system itself — which leads straight to Stage 4.4: if the state is effectively the backstop, the state will write the rules.
- **The peg = the redemption path's health, priced in real time.** For any RWA product you ever evaluate: first draw its redemption path, then ask — which segment of this path has a “weekend”?

If you take away one sentence: **USDC's peg wasn't broken by panic — it was broken by banks being closed on the weekend. The panic merely made everyone discover that at the same time.**
`,

  demo: "depeg-sim",

  analogy: `
Imagine a casino open 24 hours a day, whose chips are redeemed by a highly reputable custody company outside: at any hour you can bet with chips or trade them with other players, but converting chips back to cash means visiting the custodian's counter — which **only opens on weekdays**.

On Friday after closing, news breaks: one of the custodian's vaults — holding 8% of the cash — is in a building that caught fire, losses unknown. The casino floor erupts. But it's Friday night — **the counter is locked until Monday**. Nobody can verify redemption, so chips start changing hands privately inside the casino at 88 cents.

Notice the absurdity: even if the money in that vault **burned entirely**, every chip is still backed by 92 cents. The extra discount below 92 isn't pricing the loss — it's pricing **the agony of “nothing can be done between now and Monday.”** Some players dump at 88 cents just to sleep; others load up, betting the counter opens on schedule.

On Sunday night, city hall announces: everything in the burned building will be compensated in full by the government. Monday morning the counter opens, and the buyers who paid 88 cents redeem at a full dollar. **The chips' face value never changed — what changed was the opening hours of the road that leads to it.** That was USDC's weekend — and it's why, for every RWA you ever buy, you must read the redemption terms word by word: when, where, and how fast can you get your money back.
`,

  misconceptions: [
    "“The depeg proves USDC's reserves were bad.” —— The opposite: 92% of reserves (the Treasuries) were untouched, and the $3.3B ultimately lost nothing. The depeg priced a broken redemption path plus uncertainty, not an asset hole. The peg tracks the redemption path, not just the balance sheet.",
    "“If the code has no bugs, an on-chain system can't have this kind of failure.” —— The chain worked flawlessly through the entire event. What broke was off-chain plumbing: a failed bank, halted wires, mismatched operating hours. RWA risk lives on the off-chain half — the very reason this course exists.",
    "“Circle's Friday-night disclosure was a blunder; they should have kept quiet.” —— Disclosure did trigger the selling, but it also let the market price accurately (0.87 instead of bottomless guessing), gave arbitrageurs the confidence to step in Monday, and avoided the legal and trust catastrophe of concealment. The cost of opacity doesn't disappear — it just gets paid later, with interest.",
    "“DAI is decentralized, so USDC's trouble shouldn't affect it.” —— Over half of DAI's collateral was USDC at the time, so DAI followed it down to $0.89. Composability transmits risk instantly along the collateral chain — always look through to the underlying collateral.",
    "“The Monday repeg proves the system is resilient — stablecoins passed the test.” —— The repeg happened because Treasury/Fed/FDIC invoked the systemic risk exception and guaranteed all deposits. The state saved the bank and, incidentally, the stablecoin. Reading “bailed out” as “stress-tested” is a lesson you'd otherwise pay for in the next crisis that has no bailout.",
  ],

  quiz: [
    {
      q: "What was the most direct mechanism behind USDC printing $0.87 that weekend?",
      options: [
        "The reserves had been misappropriated",
        "The smart contract was exploited",
        "Redemption payouts ride bank wires, and banks were closed for the weekend — the arb loop broke, so panic could only exit through the price",
        "The Federal Reserve halted trading",
      ],
      answer: 2,
      explain: "The chain priced 24/7 while the fiat pipes were shut. Arbitrageurs could see the profit but couldn't complete the “redeem for dollars” link — the peg's engine stalled.",
    },
    {
      q: "What was the root cause of SVB's own failure?",
      options: [
        "Lending to startups that couldn't repay",
        "Buying junk bonds",
        "After deposits tripled, it loaded up on long-duration low-coupon bonds; rates rising from 0 to 5% created ~$15B of unrealized losses, and the run forced them to become real",
        "Executive embezzlement",
      ],
      answer: 2,
      explain: "The assets were government-grade credit; the duration was the mistake. A textbook autopsy for Stage 3.2's price↔yield seesaw.",
    },
    {
      q: "Even if all $3.3B at SVB were lost, USDC was worth ~$0.92 — why did the market trade below that?",
      options: [
        "Markets can't do arithmetic",
        "Price reflects not just asset value but the uncertainty of a severed path between the weekend and Monday — the peg is real-time pricing of redemption-path health",
        "Tether was shorting it",
        "The oracle reported wrong prices",
      ],
      answer: 1,
      explain: "Reserves are necessary but not sufficient: when the road to them is closed, the price reflects agony and uncertainty — the key to understanding every RWA discount.",
    },
    {
      q: "What did DAI's simultaneous depeg expose?",
      options: [
        "A bug in DAI's code",
        "Over half of DAI's collateral was USDC at the time — composability transmits off-chain risk instantly along the collateral chain",
        "MakerDAO misappropriated reserves",
        "Pure coincidence",
      ],
      answer: 1,
      explain: "Lego bricks are efficiency in calm and contagion under stress. Looking through to underlying collateral is mandatory for any DeFi/RWA asset.",
    },
    {
      q: "What decisively re-pegged USDC?",
      options: [
        "Circle upgraded the contract",
        "Arbitrage bots improved",
        "Treasury/Fed/FDIC invoked the systemic risk exception guaranteeing all SVB deposits; wires resumed Monday and the arb loop reconnected",
        "Coinbase funded a buyback",
      ],
      answer: 2,
      explain: "The knot was cut by a statement from Washington, not by code. A fiat stablecoin's final backstop is the fiat system — which is why the state writes the rules (Stage 4.4).",
    },
  ],

  further: [
    { label: "Joint Treasury/Fed/FDIC statement (2023-03-12, all SVB deposits protected)", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20230312b.htm" },
    { label: "FDIC: Silicon Valley Bank resolution page", url: "https://www.fdic.gov/resources/resolutions/bank-failures/failed-bank-list/silicon-valley.html" },
    { label: "Circle: official update on USDC and Silicon Valley Bank", url: "https://www.circle.com/blog/an-update-on-usdc-and-silicon-valley-bank" },
    { label: "The collapse of Silicon Valley Bank (background)", url: "https://en.wikipedia.org/wiki/Collapse_of_Silicon_Valley_Bank" },
  ],
};
