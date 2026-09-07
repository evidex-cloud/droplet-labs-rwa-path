export default {
  id: "nav-feeds",
  stage: 8,
  order: 2,
  title: "Feeding NAV On-chain: Sources, Heartbeats & Deviation Thresholds",
  difficulty: "systems",
  prereqs: ["oracle-problem", "funds-nav"],

  oneLiner:
    "A fund administrator computes NAV once a day; the chain produces a block every dozen seconds. Feeding a number that refreshes daily into a world that runs by the second — that is the entire problem of NAV feed engineering. The heartbeat keeps the feed from falling asleep; the deviation threshold catches the truth when it jumps; you need both. And between two updates, the on-chain NAV is only a memory — every contract pricing off it is drifting from the truth. The parameters aren't mysticism: they are the width of the attack window.",

  intuition: `
Last lesson (Stage 8.1) we learned the chain is blind and someone has to read it the news. This lesson switches to the engineer's seat and builds one concrete thing: **how does the NAV of a tokenized Treasury fund travel from the fund administrator's spreadsheet all the way to the number a lending contract reads?**

First, feel the time gap between the two worlds. Stage 3.3 taught that NAV is computed once a day: after the close, the administrator values each holding, subtracts fees, divides by shares, and publishes — usually **that evening or the next morning**. That's traditional finance's cadence, measured in days. The chain's cadence is measured in seconds: Ethereum produces a block roughly every 12 seconds, and the AMM pools (Stage 9.2), lending markets (Stage 9.3), and the \`totalAssets\` of a 4626 vault (Stage 6.4) can be called at any moment — and need a NAV at any moment.

So the on-chain NAV is always **past tense**. At ten this morning, the NAV a lending market reads is the one published at six last night — in the sixteen hours between, rates may have jumped, a holding may have defaulted, and the on-chain number hasn't moved a hair. Every contract that collateralizes with it, prices with it, or computes redemptions with it is **trading against a memory**.

How old can that memory get? How often must it refresh? What events force an immediate refresh? What if the person refreshing it vanishes? — The answers to those four questions are the two core parameters of feed engineering (**heartbeat** and **deviation threshold**) plus a set of consumer-side discipline. Master them and you can read the oracle section of any RWA protocol's docs — and spot at a glance where a misconfigured one will get punched through.

**Here's the map — five parts:**

- **① The full journey of one NAV: from the administrator's spreadsheet to a contract's read**
- **② Heartbeat & deviation threshold: two parameters, each guarding one failure**
- **③ Consumer-side hygiene: the few lines every feed reader must write**
- **④ The cadence mismatch: NAV's calendar vs the chain's stopwatch — drift, sawtooth & front-running**
- **⑤ Who answers for a wrong number: oracles transport, administrators warrant**
`,

  mechanics: `
### ① The full journey of one NAV: from the administrator's spreadsheet to a contract's read

Walk the production pipeline end to end, using a tokenized Treasury fund (think Stage 10.1's BUIDL or Stage 10.2's OUSG):

- **Step one, compute (off-chain)**: the **fund administrator** does the job Stage 3.3 taught, after each trading day's close: value each holding + accrued interest − management fees and other liabilities, divide by total shares, and get today's per-share NAV — say \`$1.000271\`. Timing is typically T+0 evening or T+1 morning.
- **Step two, sign and publish (off-chain)**: the administrator **signs** the figure and publishes it — posts it to a controlled API, or pushes it straight to an oracle network. The signature matters: it turns "who said this number" into a cryptographic fact, so liability is traceable when things go wrong (see ⑤).
- **Step three, transport (off-chain → on-chain)**: an **oracle network** picks it up and writes it in. A large product might use a feed purpose-built for fund values like Chainlink's **SmartData / NAVLink** — multiple nodes fetch the same official figure, aggregate, and post. A smaller issuer might just run **its own signer address** pushing on a schedule (cheap, but the single-point risk of Stage 8.1 ④ returns).
- **Step four, store (on-chain)**: an **aggregator contract** stores the triple \`(answer, updatedAt, roundId)\`. The round id lets you page through history — what round 1024 said, what round 1023 said — which is what audits and disputes live on.
- **Step five, consume (on-chain)**: downstream contracts read it — the 4626 vault for \`totalAssets\` and \`convertToShares\` (Stage 6.4), lending markets to value collateral (Stage 9.3), subscription/redemption contracts to price mints and burns (Stage 9.4).

<figure>
<svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs>
    <marker id="nav-feeds-arrow-en" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--orange-line)"/></marker>
  </defs>
  <rect x="10" y="40" width="118" height="64" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="69" y="62" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">Fund admin</text>
  <text x="69" y="80" text-anchor="middle" font-size="10" fill="var(--muted)">daily NAV calc</text>
  <text x="69" y="94" text-anchor="middle" font-size="10" fill="var(--muted)">$1.000271 + signature</text>
  <rect x="168" y="40" width="118" height="64" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="227" y="62" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="700">Oracle network</text>
  <text x="227" y="80" text-anchor="middle" font-size="10" fill="var(--orange-ink)">fetch · aggregate</text>
  <text x="227" y="94" text-anchor="middle" font-size="10" fill="var(--orange-ink)">heartbeat/deviation decide when</text>
  <rect x="326" y="40" width="118" height="64" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="385" y="62" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">Aggregator</text>
  <text x="385" y="80" text-anchor="middle" font-size="10" fill="var(--muted)">(answer,</text>
  <text x="385" y="94" text-anchor="middle" font-size="10" fill="var(--muted)">updatedAt, roundId)</text>
  <rect x="484" y="14" width="146" height="36" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="557" y="36" text-anchor="middle" font-size="10" fill="var(--muted)">4626 vault totalAssets</text>
  <rect x="484" y="56" width="146" height="36" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="557" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">Lending collateral value</text>
  <rect x="484" y="98" width="146" height="36" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="557" y="120" text-anchor="middle" font-size="10" fill="var(--muted)">Mint/redeem pricing</text>
  <line x1="128" y1="72" x2="166" y2="72" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#nav-feeds-arrow-en)"/>
  <line x1="286" y1="72" x2="324" y2="72" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#nav-feeds-arrow-en)"/>
  <line x1="444" y1="66" x2="482" y2="34" stroke="var(--line)" stroke-width="1.5" marker-end="url(#nav-feeds-arrow-en)"/>
  <line x1="444" y1="72" x2="482" y2="74" stroke="var(--line)" stroke-width="1.5" marker-end="url(#nav-feeds-arrow-en)"/>
  <line x1="444" y1="80" x2="482" y2="114" stroke="var(--line)" stroke-width="1.5" marker-end="url(#nav-feeds-arrow-en)"/>
  <text x="148" y="140" font-size="10" fill="var(--muted)">Off-chain (daily cadence)</text>
  <text x="450" y="140" font-size="10" fill="var(--muted)">On-chain (per-second cadence)</text>
  <line x1="306" y1="130" x2="306" y2="180" stroke="var(--line)" stroke-dasharray="4 3"/>
  <text x="320" y="172" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="700">The seam between the two cadences is this whole lesson</text>
</svg>
</figure>

### ② Heartbeat & deviation threshold: two parameters, each guarding one failure

When should the oracle network push a new value on-chain? Pushing constantly wastes gas; never pushing means the feed is dead. The industry's standard answer is **two trigger rules running in parallel** — push when either fires:

- **Heartbeat**: if more than X hours have passed since the last update, push — **whether or not the value changed**. For a daily NAV, a typical setting is **24 hours**. Its real function is to **turn silence into a signal**: in normal operation the feed moves at least once every 24 hours, so any silence beyond that means the pipeline broke — and consumer contracts can automatically drop into defensive mode. Without a heartbeat, you cannot distinguish "the NAV didn't change" from "the feed died" (the staleness problem of Stage 8.1 ③).
- **Deviation threshold**: if the new value differs from the last posted value by more than Y%, push **immediately, without waiting for the heartbeat**. The threshold depends on the asset's volatility: a Treasury-fund NAV moving 0.05% in a day is big news, so the threshold might be **0.1%** or lower; an equity fund might use 1%. It guards against **jumps between heartbeats** — say a bond in the portfolio defaults and NAV drops 3% overnight; you can't leave the chain in the dark for another 23 hours.

Why must you have both? Run the either/or thought experiment. Heartbeat only: after a jump, the wrong price can hang on-chain for up to a full heartbeat period — a free-lunch window for arbitrageurs. Deviation only: in calm periods the value never moves, so the feed never triggers — three days of silence and you can't tell "steady" from "dead." **Heartbeat guards against falling asleep; deviation guards against jumps** — one covers liveness, the other timeliness, mapping exactly onto the two oracle failure dimensions of Stage 8.1.

One engineering detail worth filing: real feed parameters are public. Every Chainlink feed's documentation page states its heartbeat and deviation — **read those two numbers and you know the worst-case age of that feed**. It's hard diligence information you can check in five minutes.

### ③ Consumer-side hygiene: the few lines every feed reader must write

However good the pipeline, a consumer contract that reads it naked wastes it all. The defenses in pseudo-code — four disciplines:

> \`(answer, updatedAt, roundId) = feed.latestRoundData()\`
> \`require(block.timestamp - updatedAt < 26 hours)\`  — staleness check
> \`require(answer >= minSane && answer <= maxSane)\`  — bounds check
> \`if (stale) { pauseMints(); }\`  — predefined degraded mode

- **Staleness check**: the maximum allowed age should be **slightly more than the heartbeat** (24h heartbeat → 26h check), leaving buffer for push execution and network delay; less than the heartbeat misclassifies normal operation as failure, and far more makes the check decorative.
- **Bounds check**: a Treasury-fund NAV of \`$0.50\` or \`$2.00\` cannot be a market move; it can only be an accident. Reject it — never let an absurd number flow into liquidation logic.
- **Predefine the degraded mode**: what happens when the feed goes stale? Three common choices — **pause subscriptions/mints** (most conservative; the sensible choice for BUIDL-class products: better to stop business than misprice it); **continue on the last known value with a haircut** (common in lending markets: value the stale NAV at 98 cents on the dollar, converting staleness risk into overcollateralization); and the one you must never pick — **carry on as if nothing happened**, which is a re-run of every accident in Stage 8.1.
- **Use roundId against rollbacks**: check that rounds increase monotonically, so nobody can replay an old round's data.

These lines are so cheap there is no excuse to skip them — and most protocols that starred in historical "oracle incidents" were missing exactly these lines.

### ④ The cadence mismatch: NAV's calendar vs the chain's stopwatch — drift, sawtooth & front-running

Now the expert core of this lesson. Even with a perfect pipeline, sane parameters, and full consumer discipline, one structural problem remains — **impossible to eliminate, only to manage**: NAV moves in days, the chain moves in seconds, and between two updates the on-chain price necessarily diverges from the truth.

Three concrete shapes:

- **Intraday drift**: Treasury interest **accrues every second**, market rates **move all day**, but the on-chain NAV jumps once a day. So everything pricing off it — AMM quotes (Stage 9.2), lending collateral values (Stage 9.3) — spends the whole day a small but real distance from true value. In calm times that distance is a few basis points and harmless; in violent times (an FOMC day, a credit event) it can widen into something exploitable.
- **Sawtooth accrual**: in reality interest accumulates continuously; on-chain it arrives in discrete hops, so the NAV curve traces "flat — jump — flat — jump." Long-term holders don't care (over months it's the same line), but for someone trading in and out at high frequency, **buying the moment before a jump and selling the moment after** captures a slice of accrued interest for free — if subscriptions happen to price at the old NAV.
- **Front-running the known update**: the sharpest one. NAV updates are **predictable**: pushed at a fixed time daily, and the content (how much today rose) can often be computed in advance from public market data. The attacker subscribes at the old NAV minutes before a known upward update lands, then redeems at the new NAV right after — risklessly pocketing a day's gain. Look familiar? It's the on-chain replay of the **mutual-fund late-trading scandal** — US regulators dealt with the identical trick in 2003, and the fixes copy straight over: **subscription cutoffs** (orders placed today execute at the *next, not-yet-published* NAV — forward pricing), **post-then-settle windows** (submit the request first, settle after the NAV publishes), and punitive fees on short-round-trips. Every pothole TradFi has hit, RWA will hit too — but the answers are already on the shelf.

The practical test from this section: look at an RWA protocol's subscription/redemption design — **if it allows "instant mint/redeem at the current on-chain NAV" and the NAV update time is predictable, it is paying arbitrageurs a salary**, funded out of long-term holders' pockets.

### ⑤ Who answers for a wrong number: oracles transport, administrators warrant

The last question is often skipped, yet for RWA it's crucial: the on-chain NAV is wrong — whom do you claim against?

Layer the liability. **The oracle network is a carrier, not a guarantor**: it promises "faithful transport of signed data," and its terms of service almost always disclaim any warranty of **the data's content** — Chainlink nodes are not liable for "a NAV the administrator computed wrong," just as a courier isn't liable for the quality of the goods in the parcel. **Content liability sits at the source**: if the fund administrator miscomputes the NAV, recourse runs exactly as in a traditional fund — the indemnification clauses of the administration agreement, the administrator's **errors-and-omissions (E&O) insurance**, and regulatory sanction. This is Stage 8.1 ⑤ made concrete: a licensed administrator who signs a wrong number pays damages and risks its license — that deterrent is the real foundation of a credible NAV.

So when reading an RWA product's documents, read the oracle section together with the legal ones: **who computes (which administrator, what license), who transports (which network, how many nodes), who indemnifies (how the mispricing clause is written)**. Only a product with clear answers to all three "whos" has finished its data layer.

If you take away one sentence: **the heartbeat guards against sleep, the deviation guards against jumps, consumer checks catch the rest — and between updates the on-chain NAV is only a memory, so mint/redeem design must assume someone is watching the gap between that memory and the truth.**
`,

  demo: "nav-feed-sim",

  analogy: `
Think of a NAV feed as a **station clock that only announces the hour**, while real time flows continuously behind it.

The **heartbeat** is the station's rule: "the big clock must move at least once an hour." Even when there's nothing new to report, the clock ticks a notch — so when passengers see it frozen for two hours, they instantly know **the clock is broken** rather than waiting dumbly. The **deviation threshold** is the second rule: "if something like a daylight-saving switch happens, don't wait for the top of the hour — move the hands now." One rule guards against a sleeping clock, the other against jumping time; drop either and passengers get misled in some scenario.

But even with both rules perfectly enforced, **between announcements the clock is still "wrong"** — it shows 3:00 while real time is 3:47. Normally nobody cares about those 47 minutes. But if the station has a rule that "discount tickets are sold by clock time," someone will stand there with a stopwatch, buying precisely at the moment the clock lags most — that's the arbitrageur front-running the NAV update. The station's fix is not a more accurate clock (impossible — announcements are inherently discrete) but a rule change: **discount tickets settle at the *next* announcement's time** — when you buy, you don't yet know which price you got. That is exactly mutual-fund forward pricing, written into US fund rules back in 1968.

Finally, if the clock truly announces the wrong time and you miss your train — whom do you blame? Not the worker who moves the hands (he just follows the official time source), but **the institution that publishes official time**. The oracle is the clock-setter; the administrator is the time authority.
`,

  misconceptions: [
    "“The more frequently a feed updates, the better.” —— Update frequency should match the source's real cadence. A NAV is produced once a day; pushing it ten times an hour just burns gas repeating the same number — it doesn't get fresher. What matters: a heartbeat that covers the source's publication cycle, a deviation threshold matched to the asset's volatility, and staleness checks on the consumer side.",
    "“With a heartbeat you don't need a deviation threshold (or vice versa).” —— They guard different failures. Heartbeat only: a jump between beats leaves a wrong price hanging for a full period. Deviation only: in calm periods the feed never updates, and you can't tell 'value is steady' from 'pipeline is dead.' One covers liveness, the other timeliness; run both.",
    "“The on-chain NAV is the fund's true value right now.” —— It's a snapshot of value as of the last update. Interest accrues every second and rates move all day, while the NAV hops once a day — between updates, every contract pricing off it is trading against a memory. Ask of any protocol: how old can that memory get (the heartbeat), and who eats the spread while it's old.",
    "“A predictable NAV update time is no big deal.” —— Predictable updates + instant mint/redeem at the old price = a salary for arbitrageurs. Subscribing before a known upward update and redeeming after is the on-chain re-run of the 2003 mutual-fund late-trading scandal. The defenses are on the shelf: subscription cutoffs, forward pricing, post-then-settle windows.",
    "“If the NAV is wrong you can claim against the oracle network.” —— The oracle is a carrier, not a guarantor: it only promises 'the on-chain number = what the signed source said,' not that the content is correct. Liability for a miscomputed NAV sits with the fund administrator — indemnification clauses, E&O insurance, regulatory sanction. In diligence, ask all three whos: who computes, who transports, who indemnifies.",
  ],

  quiz: [
    {
      q: "Why must a NAV feed set both a heartbeat and a deviation threshold?",
      options: [
        "To minimize gas costs",
        "The heartbeat makes silence identifiable as failure (a dead feed can't hide), and the deviation gets jumps on-chain immediately (no wrong price hanging between beats) — one covers liveness, the other timeliness",
        "Because Chainlink requires it",
        "Setting both makes the NAV more accurate",
      ],
      answer: 1,
      explain: "Heartbeat only → a jump's wrong price can hang a full period; deviation only → in calm periods you can't tell 'steady' from 'dead.' Each rule guards one failure; you need both.",
    },
    {
      q: "In a consumer contract's staleness check, why set the maximum allowed age to 'heartbeat + buffer' (e.g., 24h heartbeat, 26h check)?",
      options: [
        "Bigger is always safer",
        "It leaves buffer for push execution and network delay: less than the heartbeat misclassifies normal operation as failure, while far more makes the check decorative",
        "It's an Ethereum protocol rule",
        "To save storage",
      ],
      answer: 1,
      explain: "The heartbeat promises a push at least every 24h, but the push itself takes time to land. A 26h grace absorbs normal delay while still catching real failures promptly.",
    },
    {
      q: "An RWA protocol lets users mint/redeem instantly at the current on-chain NAV, which updates at a fixed daily time and whose direction is predictable from public data. What's wrong?",
      options: [
        "Gas costs are too high",
        "Arbitrageurs can subscribe before a known upward update and redeem after it, risklessly extracting a day's gain — the on-chain replay of mutual-fund late trading, paid for by long-term holders",
        "It violates the ERC-4626 standard",
        "Nothing — instant mint/redeem is a feature",
      ],
      answer: 1,
      explain: "Predictable updates + instant execution at the old price = a free lunch. The fixes are TradFi's old ones: subscription cutoffs, forward pricing (execute at the next unpublished NAV), post-then-settle.",
    },
    {
      q: "Why does a Treasury-fund NAV feed use a 0.1% deviation threshold while an equity fund uses 1%?",
      options: [
        "Treasury funds are more important",
        "The threshold should match asset volatility: a Treasury NAV barely moves daily, so 0.1% is already a major event that must post immediately; an equity fund routinely moves 1%, and a lower threshold would spam meaningless pushes",
        "Regulators mandate the different numbers",
        "Equity-fund oracles are cheaper",
      ],
      answer: 1,
      explain: "The deviation threshold encodes 'how big a move counts as news.' It's a function of volatility: too high leaves an attack window, too low burns gas and drowns signal in noise.",
    },
    {
      q: "The on-chain NAV is wrong (the administrator miscomputed it). Who is liable?",
      options: [
        "The oracle network, since it wrote it on-chain",
        "The blockchain's miners/validators",
        "The fund administrator — the oracle only promises faithful transport of signed data (a carrier); content liability runs through the administration agreement's indemnities, E&O insurance, and the regulatory framework",
        "Nobody — on-chain data is at your own risk",
      ],
      answer: 2,
      explain: "Oracles transport; administrators warrant. This is the heart of the RWA oracle trust model: an accountable, licensed signer matters more than the node count (Stage 8.1 ⑤).",
    },
  ],

  further: [
    { label: "Chainlink docs: Data Feeds (every feed's heartbeat/deviation parameters are public)", url: "https://docs.chain.link/data-feeds" },
    { label: "Chainlink docs: SmartData (purpose-built feeds for NAV and fund data)", url: "https://docs.chain.link/data-feeds/smartdata" },
    { label: "ERC-4626 specification (the standard interface for vault share pricing)", url: "https://eips.ethereum.org/EIPS/eip-4626" },
    { label: "SEC: mutual-fund forward pricing & late-trading rules (Rule 22c-1 context)", url: "https://www.sec.gov/rules/final/ia-2204.htm" },
    { label: "Investor.gov: What is NAV (revisit the foundation from Stage 3.3)", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/net-asset-value" },
  ],
};
