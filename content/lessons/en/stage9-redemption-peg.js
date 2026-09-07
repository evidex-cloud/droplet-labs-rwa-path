export default {
  id: "redemption-peg",
  stage: 9,
  order: 4,
  title: "Redemption Windows & Arbitrage: Why Price Hugs NAV",
  difficulty: "systems",
  prereqs: ["primary-secondary", "depeg-anatomy"],

  oneLiner:
    "A secondary price hugs NAV not because anyone promised it and not because of an algorithm, but because an arbitrage loop welds the two markets together: below NAV, buy and redeem; above NAV, subscribe and sell. The peg's tightness equals the total friction of completing that loop (fees + gas + spread + time risk + eligibility cost). Cut the return leg with a redemption gate and the price free-falls to a fear-priced discount — which is why price-versus-NAV is the most sensitive health gauge you can read.",

  intuition: `
Gather the threads from Stages 9.1 through 9.3 and one question remains — the hinge of the whole stage:

**If the secondary price is discovered by supply and demand, why does it always hover near NAV?**

Consider how strange that is. What Bob charges you has, in theory, nothing to do with the net asset value a fund administrator computed this morning — a secondhand price on Craigslist never equals the manufacturer's list price. Yet in practice, tokenized treasuries trade within tens of basis points of NAV, as if held by a magnet.

**The magnet is arbitrage.** Say NAV = \$1.0842 and a panicked seller dumps on the secondary at \$1.05. What do you do? Buy on the secondary, take it to the issuer, redeem at \$1.0842 — **3.42 cents per share, risk-free**. And you keep buying until the price is pushed back near NAV. The reverse works too: price runs to \$1.12? Subscribe at NAV, sell into the secondary, pocket the difference.

That loop welds the two markets together. And read backwards, the sentence is far more powerful: **as long as the loop can be completed, the peg exists; the moment it can't, the peg is gone.** You met the stablecoin peg in Stage 4.1 — that's one special case of this principle. This lesson **generalizes it to every RWA** and hands you a theorem you can actually compute with: **how loose the peg is depends on how expensive one lap is.** Learn to read that deviation and you own a **warning instrument that doesn't wait for announcements**.

**Here's the map — five parts:**

- **① The arbitrage loop: two legs welding two markets together**
- **② The band-width theorem: peg tightness = total friction (with numbers)**
- **③ Same asset, different redemption terms, different band**
- **④ When the band breaks: gates, suspensions, and free-falling discounts**
- **⑤ Reading the deviation as a health gauge: a warning light before the announcement**
`,

  mechanics: `
### ① The arbitrage loop: two legs welding two markets together

The **arbitrage loop** has exactly two legs, running opposite directions:

- **Discount leg (price < NAV)**: **buy** cheap tokens on the secondary → take them to the issuer and **redeem** at NAV → receive cash, keep the gap. Side effect: your buying is **buying pressure**, which **lifts** the secondary price.
- **Premium leg (price > NAV)**: **subscribe** for new tokens with the issuer at NAV → **sell** them into the secondary → keep the gap. Side effect: your selling is **new supply**, which **pushes the price down**.

Two things to notice. First, **what drives price back to NAV is not goodwill but greed** — arbitrageurs only want the money; the peg is a byproduct of their profit-seeking. Second, **both legs must pass through the primary market** — so the peg's true fulcrum isn't the exchange, it's **whether the issuer's door is open** (all four gates from Stage 9.1 reappear here as arbitrage costs).

This also explains Stage 9.1's counterintuitive claim: **a secondary price away from NAV isn't a broken market — it's the market pricing the primary market's gates.**

### ② The band-width theorem: peg tightness = total friction

Here's the most useful ruler in this stage. **Price isn't welded onto NAV; it's clamped inside a band** — and the band's half-width equals the **total friction** of one arbitrage lap:

> **Band ≈ ± (redemption/subscription fee + gas and trading costs + secondary spread + time risk + eligibility cost)**

Item by item (this is the line between the expert and the tourist):

- **Redemption/subscription fees**: commonly 0–25bp. Straight off your profit.
- **Gas and trading costs**: a few dollars to a few tens on-chain — negligible on a \$100k arb, fatal on a \$5,000 one. **So small arbitrageurs simply never show up, and the band is always wider for retail.**
- **Secondary spread**: you have to cross the bid/ask, and on a thin book that alone is 20–50bp (Stage 9.2).
- **Time risk (the most overlooked item)**: T+n settlement means you **wait one to two days after filing a redemption before the cash arrives**, during which NAV moves, stablecoins may wobble, and your capital is tied up. The more volatile the asset and the slower the settlement, the bigger this risk premium — **it is the dominant variable in band width**.
- **Eligibility cost**: only KYC'd, eligible addresses (Stage 7.2) can run the primary leg. A Reg D fund may have only a few dozen institutions legally able to arbitrage it — **fewer arbitrageurs, weaker competition, wider band**. Permissionless stablecoins have the tightest bands precisely because **anyone can arb them** (except when the rails close, Stage 4.3).

**Two worked examples (memorize this pair):**

- **A daily-redeeming tokenized treasury fund**: 10bp redemption fee + negligible gas + 5bp spread + ~5bp of T+1 time risk = **a band of roughly ±15–25bp**. The secondary price is practically glued to NAV.
- **A quarterly-redeeming, gated private-credit token**: the redemption window opens once every 90 days, the credit risk and opportunity cost of waiting are far higher, and eligible arbitrageurs are scarce → **the band can reach ±5–15%**.

**Feel the force of that comparison: the two products' underlying asset quality can be identical, and purely because the redemption terms differ, peg tightness differs by two orders of magnitude.** When you read an RWA's offering documents, the lines covering "redemption frequency, notice period, fees, gate provisions" determine your realistic exit price far more than the line quoting the yield.

<figure>
<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="redemption-peg-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-line)"/></marker></defs>
  <text x="320" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">The band-width theorem: price wanders inside a friction band</text>
  <rect x="60" y="70" width="520" height="60" fill="var(--green-soft)" stroke="none"/>
  <line x1="60" y1="100" x2="580" y2="100" stroke="var(--orange-line)" stroke-width="1.6"/>
  <text x="596" y="104" font-size="10" fill="var(--orange-ink)">NAV</text>
  <line x1="60" y1="70" x2="580" y2="70" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="60" y1="130" x2="580" y2="130" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="596" y="74" font-size="9" fill="var(--muted)">+band</text>
  <text x="596" y="134" font-size="9" fill="var(--muted)">−band</text>
  <path d="M60 108 L110 92 L160 118 L210 88 L260 112 L310 95 L360 120 L410 90 L440 105" stroke="var(--ink)" stroke-width="1.6" fill="none"/>
  <text x="240" y="60" text-anchor="middle" font-size="10" fill="var(--muted)">inside the band: the loop closes → price gets pulled back</text>
  <rect x="440" y="60" width="140" height="150" fill="var(--red-soft)" stroke="none" opacity="0.55"/>
  <path d="M440 105 L470 150 L500 176 L540 196 L570 202" stroke="var(--red)" stroke-width="1.8" fill="none"/>
  <line x1="440" y1="46" x2="440" y2="215" stroke="var(--red)" stroke-width="1.2" stroke-dasharray="3 3"/>
  <text x="510" y="44" text-anchor="middle" font-size="10" fill="var(--red)">redemptions suspended → return leg cut</text>
  <text x="510" y="228" text-anchor="middle" font-size="10" fill="var(--muted)">price free-falls to a fear-priced discount</text>
  <rect x="60" y="240" width="520" height="30" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="259" text-anchor="middle" font-size="10" fill="var(--ink)">band ≈ ±(fee + gas + secondary spread + T+n time risk + eligibility cost)</text>
</svg>
</figure>

### ③ Same asset, different redemption terms, different band

Turn ②'s theorem into a comparable intuition table — keep this spectrum in your head:

- **Permissionless stablecoins (USDC/USDT)**: anyone can arb the secondary, institutions can redeem directly with the issuer, at enormous scale → the band sits at **a few bp** year-round. The tightest peg in the business. But that tightness depends entirely on open rails — over the SVB weekend in March 2023, the redemption channel closed along with the bank (Stage 4.3) and USDC traded down to \$0.87: **the reserves hadn't vanished; the return leg had been cut by the weekend.**
- **Daily subscribe/redeem tokenized treasuries**: **±15–25bp**, tightest during weekday business hours and loosest on weekends (when the primary window is shut, Stage 9.1).
- **Products with lockups**: Ondo's USDY targets non-US persons and carries a **40+ day transfer lock after minting** (Stage 10.2). The lock **pinches the premium leg** directly — when demand is hot, arbitrageurs can't mint new tokens fast enough to sell, so a **persistent premium** can survive. That's a different band asymmetry, manufactured by gated subscription.
- **Quarterly-redeeming, gated private assets**: **±5–15%**, and the discount direction is often one-sided.

One century-old precedent is worth remembering: the **closed-end fund discount**. Traditional closed-end funds offer no redemption (shares only change hands on an exchange), and as a result their prices sit **persistently below NAV** — 10–20% discounts are routine. The cause is identical: **no redemption leg, no force pulling price back to NAV**. Gate-driven discounts in RWA aren't a novel crypto disease but the replay of an old law of financial history — after the UK's 2016 Brexit vote and during the 2019 Woodford episode, several **open-ended property funds suspended redemptions** and promptly traded at enormous discounts, by exactly this mechanism.

### ④ When the band breaks: gates, suspensions, and free-falling discounts

A **redemption gate** is the clause in the fund documents you hope never gets used: when redemption requests exceed some share of the fund (commonly 10% per quarter), the manager may **pro-rate or defer** them; in extremis, impose a full **suspension**.

Once the gate drops, look closely at what happens: **the loop's return leg has been physically severed**. Price \$0.92, NAV \$1.00, and you compute an 8% "profit" — but **you can't redeem**, so those 8 points are unreachable. Consequently no buying interest is drawn in by the discount, and the price **free-falls** until it reaches whatever someone willing to hold until the gate lifts will pay. 20% down? 30%? There's no formula capping it — **what's being priced now isn't asset value, it's the tug-of-war between fear and patience**.

Build the mature reading here: **this is not a market failure — it's the market pricing the gate itself.** The discount is the market's collective quote on "when do I get my money back, and how much of it." When redemption is uncertain, "NAV" degrades into an **accounting number** rather than a price you can realize — and the gap between the two *is* the discount.

The **mirror case of a premium** deserves equal fluency: when **subscription** is restricted (capacity filled, lockup, eligibility hurdles) while demand runs hot and supply can't expand quickly → a **persistent premium**. USDY's premium in certain periods, and the launch-phase premia of sought-after tokenized funds, are this mechanism. Seeing a persistent premium, always ask: **are arbitrageurs unwilling to come, or unable to get in?**

### ⑤ Reading the deviation as a health gauge: a warning light before the announcement

Finally, turn this lesson into an **instrument you can use**. Track any RWA's **secondary price ÷ NAV** and you have a continuously-updating **health gauge**:

- **Hugging (inside the theoretical band)**: the market believes the redemption path is open. Healthy.
- **Band suddenly widening**: liquidity is deteriorating, market makers are stepping back, settlement is slowing — a **rising-friction signal ahead of any announcement**.
- **Discount widening persistently without reverting**: the market **doubts the next redemption window**. This is the single most valuable signal, because it **leads the official announcement** — by the time a fund announces "redemptions suspended," most of the discount has usually already happened. Someone in the secondary market knew earlier, or was more afraid than you, and **their fear is already written into the price**.
- **Persistent premium**: the subscription side is jammed (capacity, lockup, eligibility), not that the asset became more valuable.

Stage 12's diligence dashboard will stitch this metric together with proof of reserve (Stage 8.3), holder concentration, and the gate provisions in the documents — but if you can only watch one number, watch this one: **it's the only indicator voted on with real money, updated in real time, and outside the issuer's PR control.**

If you take away one sentence: **a peg is not a promise and not an algorithm — it is "an arbitrageur can complete one lap at any time." The more that lap costs, the looser the peg; the moment the lap can't be completed, there is no peg, only fear-priced discovery.**
`,

  demo: "peg-arbitrage",

  analogy: `
Think of NAV as a concert ticket's **official face value of \$80**, with the box office both selling tickets and **buying them back at face**. On the resale market, will prices drift away from \$80?

They will — but not far. If resale drops to \$70, someone immediately buys tickets cheap and returns them at the box office for \$80, pocketing \$10 — and as more people do it, the resale price gets pushed back toward \$78. If resale runs to \$90, someone buys at the box office for \$80 and flips at \$90 — supply increases, and the price is pressed back down. **The ticket price is "welded" near \$80 not by the promoter's promise but by this crowd of profit-hunting couriers.**

So why isn't it exactly \$80? Because a round trip has costs: a \$1 return fee, \$1.50 of travel and time, a \$2 resale bid-ask spread, a three-day wait for the refund (during which the show could be canceled), and the hardest one — **the box office only serves registered members** (eligibility). Add those to \$5, and while resale wanders between \$75 and \$85 nobody bothers making the trip. **That's the band.** More friction, wider band.

Now the promoter announces: **returns suspended**. The courier's return leg is severed — no matter how cheaply you buy, you can't return it. Where does resale go? Straight to \$50, \$40, down to whatever a person who genuinely wants to attend and will absorb the risk themselves is willing to pay. The price no longer reflects face value; it reflects **fear and uncertainty**.

And if the promoter instead announces **sales suspended** (gated subscription), the mirror image plays out: resale climbs to \$120, because the couriers **can't get into the box office** and supply can't be replenished. Seeing a persistent premium or discount, always ask first: are the couriers unwilling to come, or **simply unable to get in**?
`,

  misconceptions: [
    "“A stablecoin's or RWA's peg rests on the issuer's promise or some algorithm.” —— It rests on the arbitrage loop staying completable. The promise lives in the documents; the peg happens in the arbitrageurs' ledgers. Cut the return leg (redemption) and no amount of elegant promising stops the free-fall — USDC at $0.87 over the SVB weekend is the proof.",
    "“A price below NAV means the market is wrong and will revert.” —— A discount is usually the market **pricing the redemption gate**, and it's frequently right: widening discounts often lead the official suspension announcement. Treating it as someone else's mistake can mean mistaking a warning signal for a buy signal.",
    "“Between two treasury funds, peg tightness comes down to asset quality.” —— It comes down to **redemption terms**. Daily redemption + low fees + T+1 → a ±15–25bp band; quarterly redemption + gates → up to ±5–15%. The underlying can be identical; only the exit path differs, and realized prices differ by two orders of magnitude.",
    "“A persistent premium means the product is exceptionally good.” —— More likely the **subscription side is jammed**: capacity exhausted, a lockup (USDY's 40+ days), eligibility hurdles. A premium is evidence that arbitrageurs *can't get in*, not that the asset is worth more — buy into a high premium and it evaporates once the lock lifts and supply flows.",
    "“A 20% discount is 20% of free money.” —— It's only profit if you can complete the loop. Under a suspension those 20 points are an unreachable paper number; you may buy in and face a deeper discount and an open-ended wait — which is exactly why closed-end funds can trade at 10–20% discounts for years.",
    "“Gate-driven discounts are a new crypto problem.” —— They're an old law of finance: closed-end fund discounts have existed for a century, and several UK open-ended property funds hit huge discounts after suspending redemptions in 2016 and 2019. No redemption leg, no force pulling price to NAV — the same law on-chain and off.",
  ],

  quiz: [
    {
      q: "What is the fundamental reason a secondary price hugs NAV?",
      options: [
        "The issuer makes markets in the secondary to defend the price",
        "The arbitrage loop: below NAV, buy and redeem; above NAV, subscribe and sell — the arbitrageurs' buying and selling pressure pushes price back to NAV",
        "Regulation forbids secondary prices from deviating from NAV",
        "The oracle forces trades to print at NAV",
      ],
      answer: 1,
      explain: "Greed, not goodwill, drives the peg — and since both legs run through the primary market, the peg's fulcrum is whether the issuer's door is open.",
    },
    {
      q: "According to the band-width theorem, peg tightness equals what?",
      options: [
        "The issuer's capital base",
        "The total friction of one arbitrage lap: redemption fee + gas + secondary spread + T+n time risk + eligibility cost",
        "The underlying asset's credit rating",
        "The number of token holders",
      ],
      answer: 1,
      explain: "More friction means arbitrageurs act later, so the band the price can wander in gets wider. Daily-redeeming treasuries: ±15–25bp; quarterly private credit: up to ±5–15%.",
    },
    {
      q: "A private-credit token suspends redemptions, and the secondary discount to NAV widens rapidly from 3% to 25%. What's the most accurate reading?",
      options: [
        "Irrational market panic — a clear mispricing",
        "The loop's return leg is severed, so nothing pulls price back to NAV — pricing turns into fear about “when do I get my money back”; the market is pricing the gate itself",
        "The underlying assets lost 25% of their value in one day",
        "An oracle failure is displaying the wrong NAV",
      ],
      answer: 1,
      explain: "Without redemption, NAV degrades into an accounting number. Century-old closed-end fund discounts and the UK property funds' post-suspension discounts run on the same mechanism.",
    },
    {
      q: "A tokenized treasury has sustained a 2% premium for months. What's the most likely cause?",
      options: [
        "This fund's Treasuries are worth more than other funds'",
        "The subscription side is restricted (capacity, a lockup such as USDY's 40+ days, eligibility hurdles), so arbitrageurs can't mint and sell fast enough — the premium leg is blocked",
        "Redemption fees are too high",
        "The NAV calculation is wrong",
      ],
      answer: 1,
      explain: "A persistent premium is evidence arbitrageurs can't get in. Ask first whether they're unwilling or unable; premia usually flatten once locks expire and supply flows.",
    },
    {
      q: "Why is “secondary price ÷ NAV” a valuable warning instrument?",
      options: [
        "Because the issuer publishes it daily, so it's authoritative",
        "Because it's voted on with real money, updates in real time, and sits outside the issuer's PR control — a widening discount often leads the official redemption-suspension announcement",
        "Because regulators require the ratio to be disclosed",
        "Because it predicts where underlying Treasury yields are heading",
      ],
      answer: 1,
      explain: "A widening discount means the market began doubting the next redemption window before any announcement. Stage 12's dashboard reads it alongside proof of reserve and the gate provisions.",
    },
  ],

  further: [
    { label: "SEC / Investor.gov: closed-end funds and discounts to NAV (the century-old precedent)", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1" },
    { label: "Circle: USDC reserves and the redemption mechanism (the tightest peg)", url: "https://www.circle.com/usdc" },
    { label: "Ondo Finance docs: USDY minting and the transfer lockup", url: "https://docs.ondo.finance" },
    { label: "FCA: illiquid assets in open-ended funds (redemption suspensions policy)", url: "https://www.fca.org.uk/publications/policy-statements/ps19-24-illiquid-assets-open-ended-funds" },
    { label: "RWA.xyz (track secondary price vs NAV across tokens)", url: "https://app.rwa.xyz" },
  ],
};
