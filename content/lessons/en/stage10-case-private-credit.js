export default {
  id: "case-private-credit",
  stage: 10,
  order: 3,
  title: "On-chain Private Credit: Maple, Centrifuge & Goldfinch's Lessons",
  difficulty: "mastery",
  prereqs: ["private-markets", "investor-rights"],

  oneLiner:
    "This is the stage's cautionary masterpiece: credit risk does not evaporate when tokenized. Maple's pools were punctured by a fabricated balance sheet (Orthogonal concealed its insolvency and defaulted on roughly $36M); when Goldfinch's Ugandan motorcycle loans went bad, recovery ran through courtrooms in Kampala; Centrifuge brought proper tranched securitization on-chain and still couldn't dodge stale valuations and originator concentration. The chain settles payments flawlessly and automates the waterfall — but it cannot underwrite, cannot monitor borrowers, and cannot enforce. On-chain credit = traditional credit risk + smart-contract rails. Not a cent more, not a cent less.",

  intuition: `
The last two lessons starred Treasuries — the asset on earth that least requires trusting a borrower. This lesson swings to the other end of the spectrum: **private credit** — lending money to companies and projects and betting they pay it back (Stage 3.5's world of terrible liquidity and worse information).

Around 2021, a wave of protocols promised to "revolutionize credit" with blockchains: transparent pools, on-chain repayment records, allocation rules executed by code. Surely information asymmetry and back-room dealing were about to be cured? Then 2022–2023 graded the exam: **a Maple borrower faked its financials and concealed a bankruptcy**; **Goldfinch's emerging-market loans defaulted one after another, with recovery queued up in foreign courts**; Centrifuge, the steadiest of the three, still had to admit that the chain solves neither valuation nor due diligence.

This lesson is not here to mock failure — the opposite. Each of these three projects represents a **serious design**, and their scars mark out **the boundary of what the chain can do** with surgical precision. Carve that boundary into your head and your judgment about all of RWA levels up.

**Here's the map — five parts:**

- **① Maple — institutional credit pools, and a balance sheet that lied**
- **② Goldfinch — emerging-market loans, and the courts of Kampala**
- **③ Centrifuge — securitization on-chain: DROP/TIN tranches and the waterfall**
- **④ The cross-cutting verdict — what the chain can and can never do**
- **⑤ The rate context — where the 8–12% yields went**
`,

  mechanics: `
### ① Maple: institutional credit pools, and a balance sheet that lied

**Maple Finance** (2021) modeled itself as "an institutional lending desk on-chain": **pool delegates** — professional credit shops — underwrite borrowers and set rates; lenders deposit stablecoins into pools to earn the interest; and the defining choice is that loans are **undercollateralized** — essentially **unsecured credit**. What you trust is not collateral; it's the delegate's judgment.

November 2022: FTX collapses, and the stress test arrives. Market maker **Orthogonal Trading** took massive losses on FTX but **concealed its insolvency from the pool delegate**, kept rolling its debt, and finally defaulted on roughly **$36 million**; another borrower, Auros, went into restructuring. The losses landed on the **pool lenders**. The most uncomfortable finding of the post-mortem: the delegates *did* do diligence — they reviewed the financial statements. **The statements were fake.**

This plugs straight into Stage 8.1's oracle lesson: an oracle can carry real off-chain data onto the chain, **but no oracle can make a fabricated balance sheet true**. Underwriting is only ever as good as its information — an iron law that swapping the ledger for a blockchain does not bend. Maple's response was honest, too: **Maple 2.0 pivoted to overcollateralized/secured lending plus Treasury cash management** — the market voted with its feet, and the vote went to collateral.

### ② Goldfinch: emerging-market loans, and the courts of Kampala

**Goldfinch** aimed higher on idealism: routing DeFi capital to credit businesses in emerging markets (fintech lenders, microfinance shops). Its mechanism is "**trust through consensus**": **backers** stake real money on **specific borrowers** and hold the **junior position** that loses first; the **senior pool** automatically co-invests in every loan that gathers enough backer support, protected by that junior cushion. Structurally, that's tranching — the design was respectable.

Then the defaults arrived for real: **Tugende**, a Ugandan motorcycle-finance company, breached its loan covenants with roughly **$5 million** at risk; positions in Stratos and Lend East were later written down or only partially recovered. The recovery process schooled everyone: **write-downs, restructuring negotiations stretching across years, and off-chain legal action in foreign courts**. Stage 5.4's "cross-border recourse reality" became concrete here — your claim passes through smart contracts, through Delaware structure documents, and finally lands in **enforcement proceedings in Kampala**: **your claim is only as strong as what the local court is willing and able to enforce.**

The lesson in one line: **geographic yield = geographic legal risk**. A few points of that 10% coupon are, in substance, a "Ugandan enforcement risk premium" — know what you're being paid for before you buy.

### ③ Centrifuge: securitization on-chain — DROP/TIN tranches and the waterfall

**Centrifuge** took the most TradFi-native road: proper **asset-backed securitization**, simply relocated on-chain. Real-world assets — invoices, mortgages, royalties — are each minted as an **NFT** (Stage 2.5's per-claim tracing) and fed into a pool; the pool issues two tranche tokens: **DROP (senior)** — fixed rate, paid first, protected; **TIN (junior)** — variable return, **first in line to absorb losses**. Incoming repayments flow through a **waterfall**: DROP's principal and interest first, the residual to TIN — exactly the math Stage 5.4 taught. A large share of MakerDAO's (now Sky's) early RWA collateral came in through Centrifuge pools.

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="pc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <rect x="20" y="30" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="110" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Borrower repayments</text>
  <text x="110" y="70" text-anchor="middle" font-size="10" fill="var(--muted)">invoices / mortgages / royalties (NFTs)</text>
  <rect x="250" y="30" width="150" height="52" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="325" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="var(--orange-ink)">Waterfall</text>
  <text x="325" y="70" text-anchor="middle" font-size="10" fill="var(--muted)">senior first, junior last</text>
  <rect x="450" y="10" width="170" height="52" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="535" y="32" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">DROP · senior</text>
  <text x="535" y="50" text-anchor="middle" font-size="10" fill="var(--muted)">fixed rate · paid first</text>
  <rect x="450" y="90" width="170" height="52" rx="10" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="535" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">TIN · junior</text>
  <text x="535" y="130" text-anchor="middle" font-size="10" fill="var(--muted)">residual return · first-loss</text>
  <line x1="200" y1="56" x2="250" y2="56" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#pc-arr)"/>
  <line x1="400" y1="46" x2="450" y2="34" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#pc-arr)"/>
  <line x1="400" y1="66" x2="450" y2="112" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#pc-arr)"/>
  <rect x="20" y="180" width="600" height="96" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="40" y="204" font-size="11" font-weight="700" fill="var(--ink)">Losses flow the other way: defaults eat TIN first; DROP is touched only after TIN is gone</text>
  <text x="40" y="226" font-size="10.5" fill="var(--muted)">e.g. $10M pool · 80/20 split → DROP unharmed while losses ≤ $2M; TIN wiped at a 20% loss</text>
  <text x="40" y="248" font-size="10.5" fill="var(--muted)">Tranching kills no risk — it prices, in advance, who loses first (Stage 5.4's math)</text>
  <text x="40" y="268" font-size="10.5" fill="var(--orange-ink)">The most honest credit technology on-chain: the loss ordering is code, public and verifiable</text>
</svg>
</figure>

Centrifuge never produced a Maple-style scandal, but its struggles teach just as much: **originator concentration** (a pool often leans on a single asset originator — if it stumbles, the whole pool does); **valuation staleness** (invoices and mortgages have no daily market price, so NAV rests on models and human appraisal — Stage 3.5's old problem, ported on-chain unchanged); and **scale** — next to the trillions in traditional securitization, on-chain pools remain a rounding error.

### ④ The cross-cutting verdict: what the chain can and can never do

Stack the three cases and the boundary line is knife-sharp:

- **What the chain does perfectly**: **settling payments** (repayments hit the pool, split in seconds, reachable globally); **executing the waterfall** (allocation rules live in the contract — no fund manager can quietly jump the queue); **public records** (every loan, every repayment, every tranche balance, inspectable by anyone).
- **The three things the chain cannot do**: **underwrite** — judging whether a borrower will repay is an **information** problem, and statements can be faked (Orthogonal); **monitor** — making sure the borrower doesn't wander off with the money is an **operations** problem that takes humans on the ground; **enforce** — clawing money back after default is a **courts** problem, and it happens in Uganda or Delaware, not on Ethereum (Tugende).
- Hence the formula: **on-chain credit = traditional credit risk + smart-contract rails**. The rails are a genuine upgrade (faster, cheaper, more transparent) — but the cargo riding them hasn't changed.
- Tranching (junior/senior) is this sector's most **honest** technology: it doesn't pretend to destroy risk; it writes "**who loses first**" into code, priced in advance. The real question was never whether someone loses — it's whether the person in the first-loss seat **knew they were sitting in it**.

### ⑤ The rate context: where the 8–12% yields went

One last macro puzzle piece, without which the sector's boom-bust rhythm makes no sense. Around 2021 these pools paid **8–12%** while T-bills paid roughly **0.5%** — an eleven-point spread reflecting real credit demand (crypto institutions and emerging-market lenders genuinely couldn't borrow cheaply). But from 2023, T-bills ran up to **5%**: once the risk-free rate jumped, "take Ugandan enforcement risk for five extra points" lost its charm overnight. The result is what you saw: a **sector shakeout** — Maple pivoting to secured lending and Treasury management, capital flooding into the BUIDLs of the world, unsecured pools shrinking. That's not a technology failure; it's a **repricing of the risk premium** (Stage 12.4 teaches you to decompose any yield this way, systematically).

If you take away one sentence: **the chain can divide the money perfectly, but it cannot decide who deserves a loan, watch what they do with it, or claw it back when they default — every on-chain credit blowup is an unpaid bill from off-chain due diligence.**
`,

  demo: "credit-waterfall",

  analogy: `
Think of an on-chain credit pool as a restaurant with a **fully transparent glass kitchen**.

The glass kitchen is real progress: every dish's preparation is visible end to end, the bill splits itself automatically, and no waiter can quietly alter an order — that's the on-chain repayment record, the waterfall, and the public pool data. Diners conclude: food poisoning is **impossible** here.

But food poisoning never happens in the visible kitchen. It happens **upstream in the supply chain** — a supplier delivers water-injected meat with forged inspection stamps (Orthogonal's fabricated statements). It happens **in the back alley** — nobody watches the cold chain during transport (missing post-loan monitoring). And when you seek damages, you sue **in the supplier's home jurisdiction** (Tugende's proceedings in Kampala). The glass kitchen helps with none of the three.

Centrifuge's tranching is the restaurant's **insurance arrangement**: when something goes wrong, the manager's own deposit pays out first (TIN, junior), and only after it's exhausted do customers' prepaid cards get touched (DROP, senior). That doesn't make the meat any cleaner — but it states, honestly and in advance, **whose money goes first**.

Which is why a connoisseur never picks a restaurant by how shiny the kitchen glass is. They ask: **who supplies the meat? who inspected it? and which court do we go to if it goes wrong?** — three questions that all live outside the glass.
`,

  misconceptions: [
    "“Once loans are on-chain and transparent, there can be no hidden landmines.” —— Maple's pool data was public the whole time, and Orthogonal punctured it anyway — because the fraud lived in off-chain financial statements. The chain makes cash flows transparent, not a borrower's true solvency. Underwriting is only as good as its information.",
    "“Smart contracts execute automatically, so after a default the money comes back automatically.” —— A contract can only divide money that has actually arrived. If the borrower doesn't pay, the contract is helpless — recovery is off-chain legal action, possibly years in foreign courts (Tugende's ~$5M Ugandan proceedings). Stage 5.4: claim strength = local enforcement strength.",
    "“Tranching (senior/junior) eliminates the risk.” —— Tranching eliminates not one cent of risk; it fixes the loss ordering: junior burns first, senior only after junior is gone. It's honest risk-pricing technology — provided the junior holders knew they were in the first-loss seat.",
    "“The 8–12% on-chain credit yields were an efficiency dividend from the technology.” —— Mostly they were premia for credit risk and emerging-market legal risk. When T-bills rose from 0.5% to 5%, the spread collapsed and the sector shook out — proof those yields were the price of risk, not a gift from the rails.",
    "“Maple pivoting to overcollateralization proves unsecured on-chain credit is falsified.” —— More precisely: repriced. Unsecured lending thrives in TradFi — but it's backstopped by off-chain underwriting and enforcement capacity. In a 5% risk-free world, the on-chain unsecured premium stopped being attractive, so the market moved to collateral.",
    "“Centrifuge never blew up, so the asset-backed model is risk-free.” —— Its risks just wear different clothes: originator concentration, stale valuations on illiquid collateral (invoices have no daily price), small scale. Not having blown up ≠ no risk; the risk simply hasn't been stress-tested yet.",
  ],

  quiz: [
    {
      q: "What is the deepest lesson of the Orthogonal Trading episode for on-chain credit?",
      options: ["Maple's smart contracts were hacked", "The pool delegates did no due diligence at all", "Underwriting rested on borrower-provided financials — and the financials were fake; no oracle can make a forged balance sheet true, so underwriting is capped by information quality", "Ethereum congestion blocked the liquidations"],
      answer: 2,
      explain: "No hack, and diligence was done — but the statements lied. It's the credit version of Stage 8.1's oracle boundary: the chain cannot solve the truthfulness of off-chain information.",
    },
    {
      q: "After Tugende's default at Goldfinch, what did recovery mainly depend on?",
      options: ["The smart contract automatically seizing the borrower's wallet", "An insurer paying out in full", "Off-chain legal action: covenant-breach findings, years-long restructuring talks, and enforcement proceedings in foreign jurisdictions such as Uganda", "The Goldfinch foundation buying back the bad debt"],
      answer: 2,
      explain: "Your claim ultimately lands on the local court's enforcement capacity (Stage 5.4) — geographic yield carries geographic legal risk.",
    },
    {
      q: "In Centrifuge's DROP/TIN structure, what happens when a $10M pool (80/20 split) takes a 15% loss?",
      options: ["DROP and TIN each lose 15% pro rata", "The $1.5M loss is absorbed entirely by TIN ($2M) — TIN loses 75%, DROP loses nothing", "DROP loses first because it's bigger", "The protocol pauses and a governance vote allocates the loss"],
      answer: 1,
      explain: "Waterfall math: losses eat upward from the bottom. Junior's $2M is the first cushion; senior is untouched while losses stay ≤ $2M, and TIN is wiped only at 20%.",
    },
    {
      q: "Which of these does the chain genuinely do better than traditional systems in credit?",
      options: ["Judging a borrower's willingness and ability to repay", "Monitoring what the borrower does with the money after the loan", "Instant settlement of repayments, code-executed waterfall allocation, and a fully public record", "Cross-border clawbacks after a default"],
      answer: 2,
      explain: "Settlement, allocation, and records are the chain's home turf; underwriting (information), monitoring (operations), and enforcement (courts) are its blind spots — all three cases confirm the boundary.",
    },
    {
      q: "Why did on-chain private credit shrink and pivot to secured models after 2023?",
      options: ["Regulators banned unsecured lending", "A major smart-contract vulnerability emerged", "T-bill rates rose from ~0.5% to ~5%; with risk-free yield that high, the credit-risk premium lost its appeal — risk was repriced and capital moved to Treasury products", "Every borrower defaulted"],
      answer: 2,
      explain: "8–12% against 0.5% was a seductive spread; against 5% it's thin compensation for real risk. The macro rate reset the sector's economics (Stage 12.4's yield-decomposition lens).",
    },
  ],

  further: [
    { label: "Maple Finance (the product shape after the 2.0 pivot)", url: "https://maple.finance" },
    { label: "Centrifuge (DROP/TIN tranching and pool documentation)", url: "https://centrifuge.io" },
    { label: "Goldfinch (backer/senior-pool mechanism and governance docs)", url: "https://goldfinch.finance" },
    { label: "RWA.xyz: on-chain private credit dashboard", url: "https://app.rwa.xyz" },
  ],
};
