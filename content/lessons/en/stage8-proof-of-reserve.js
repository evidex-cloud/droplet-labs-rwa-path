export default {
  id: "proof-of-reserve",
  stage: 8,
  order: 3,
  title: "Proof of Reserve: Making 'the Money Is Still There' Machine-Readable",
  difficulty: "systems",
  prereqs: ["reserves-attestation", "oracle-problem"],

  oneLiner:
    "Stage 4.2's monthly attestation report is a PDF for humans; Proof of Reserve (PoR) upgrades it into a continuous feed for contracts — the reserve figure posts on-chain regularly, and anyone can verify 'reserves ≥ token supply' at any moment. The real killer feature isn't seeing, it's enforcing: weld the mint function to the reserve feed, and minting reverts whenever reserves fall short — a PDF can't stop an over-mint; a feed can. But know the boundary: PoR proves the balance exists, not that the balance hasn't been pledged to someone else.",

  intuition: `
Recall the setup from Stage 4.2: a stablecoin issuer hires an accounting firm each month to produce an **attestation report** — "as of such-and-such date, reserves were X dollars." That arrangement has three congenital weaknesses. **It's a snapshot**: the report speaks for month-end day only; where the reserves went mid-month, nobody knows (history really does include "borrow the money back the day before the report date" maneuvers). **It's for humans**: the PDF sits on a website; your smart contract can't read it, and the on-chain world doesn't react to it at all. **It's after the fact**: by the time a report exposes a problem, the over-issuance already happened.

Now flip the design. What if the reserve figure weren't printed on paper monthly, but **signed by the source and written on-chain by an oracle every day (even every hour)**? Two qualitative changes follow.

First, **verification goes from "manual and quarterly" to "mechanical and continuous."** Anyone — any contract — can read the latest reserve figure and the token's total supply at any moment and do grade-school division: reserves ÷ supply ≥ 100%? That question now has a real-time answer.

Second — the real leap — **verification can become enforcement**. Minting is an on-chain function (Stage 4.1), and the reserve figure is now on-chain too, so you can write one line into the mint function: "if supply after minting would exceed reserves, **refuse to execute**." Try to over-issue? The transaction simply reverts. A PDF can never stop a keystroke's worth of over-minting; a feed plus one require can. That's the upgrade from "transparency" to "circuit breaker" — a genuine rung up the trust ladder of Stage 1.3.

But by this point in the course, you should reflexively ask: **whom does this feed itself trust? What exactly does it prove?** The second half of this lesson measures PoR's capability boundary inch by inch — a person who can truly use a tool first knows where the tool fails.

**Here's the map — five parts:**

- **① From monthly PDF to continuous feed: what PoR upgrades**
- **② Architecture and the killer feature: source → attestor → feed → "no reserves, no mint"**
- **③ What it proves and what it can't: an expert-grade comparison table**
- **④ The cross-chain wrinkle: one asset, seven chains — reconciling supply**
- **⑤ Real deployments, and where PoR sits on the trust ladder**
`,

  mechanics: `
### ① From monthly PDF to continuous feed: what PoR upgrades

Definition of **Proof of Reserve (PoR)**: a **continuous, automated, on-chain-readable** mechanism proving that a tokenized asset's reserves satisfy "reserves ≥ liabilities (i.e., token supply)." Compare it line by line with Stage 4.2's attestation report:

- **Frequency**: monthly/quarterly snapshot → daily or even per-heartbeat updates (the heartbeat and deviation machinery of Stage 8.2 is reused directly here).
- **Reader**: humans (investors, regulators) → machines (any smart contract reads the number directly).
- **Reaction speed**: you learn when the report drops → exposure at the next update, with the option of automatic responses.
- **Cheating window**: "window dressing before the report date" enjoys a month of room → high-frequency observation compresses it to hours, and the cost of dressing up spikes.

Note what PoR does not upgrade: **it still depends on the source**. The bank statement an accountant reads can be forged; the balance a bank API returns can be forged just the same — PoR inherits every trust assumption of its data source (Stage 8.1's old refrain: garbage in, garbage out). It compresses the cheating room along the **time** dimension, not the **source** dimension.

### ② Architecture and the killer feature: a four-stage pipeline + one require

The standard PoR pipeline in four stages:

- **Data source**: read from wherever the reserves live. Three shapes — **custodian/bank API** (fiat reserves, e.g., a stablecoin's bank accounts), **fund administrator reports** (Treasury-type reserves, reusing Stage 8.2's NAV pipeline), and **direct observation of on-chain wallets** (cleanest when the reserves are themselves crypto assets: no one needs to declare anything, nodes count for themselves).
- **Attestor**: who reads and who signs. It can be an audit/attestation firm fetching and signing on a schedule, or an oracle network's multiple nodes each pulling from the source and aggregating on-chain (the Chainlink PoR model).
- **On-chain PoR feed**: stores \`(reserve figure, timestamp)\`, readable by any contract — up to here it's still just "transparency."
- **Enforcement logic**: this is the actual innovation. Wire the feed into the token contract's mint path — the industry calls it a **secured mint**:

> \`function mint(to, amount):\`
> \`  (reserves, updatedAt) = porFeed.latestData()\`
> \`  require(now - updatedAt < maxAge)         // feed not stale\`
> \`  require(totalSupply + amount <= reserves) // fully backed after mint\`
> \`  _mint(to, amount)\`

Two requires, and the nature of the thing changes: proof of reserve goes from "news after the fact" to a **gate before the fact**. An insider trying to over-mint, a stolen key minting maliciously, a bridge inflating supply out of thin air — if the reserve figure hasn't kept up, every one of those transactions reverts. The same gate works in the redeem/burn direction: when the reserve ratio drops below a threshold, automatically pause minting and allow only redemptions — the **circuit breaker** pattern.

<figure>
<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs>
    <marker id="proof-of-reserve-arrow-en" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--orange-line)"/></marker>
  </defs>
  <rect x="12" y="24" width="130" height="58" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="77" y="46" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">Data source</text>
  <text x="77" y="62" text-anchor="middle" font-size="9" fill="var(--muted)">custodian API / admin</text>
  <text x="77" y="74" text-anchor="middle" font-size="9" fill="var(--muted)">/ on-chain wallets</text>
  <rect x="182" y="24" width="130" height="58" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="247" y="46" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="700">Attestor</text>
  <text x="247" y="62" text-anchor="middle" font-size="9" fill="var(--orange-ink)">fetch · sign</text>
  <text x="247" y="74" text-anchor="middle" font-size="9" fill="var(--orange-ink)">audit firm / oracle nodes</text>
  <rect x="352" y="24" width="130" height="58" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="417" y="46" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">PoR feed</text>
  <text x="417" y="62" text-anchor="middle" font-size="9" fill="var(--muted)">(reserves $102.3M,</text>
  <text x="417" y="74" text-anchor="middle" font-size="9" fill="var(--muted)">2 hours ago)</text>
  <rect x="522" y="24" width="106" height="58" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="575" y="46" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">Token contract</text>
  <text x="575" y="64" text-anchor="middle" font-size="9" fill="var(--muted)">mint() checks feed first</text>
  <line x1="142" y1="53" x2="180" y2="53" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#proof-of-reserve-arrow-en)"/>
  <line x1="312" y1="53" x2="350" y2="53" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#proof-of-reserve-arrow-en)"/>
  <line x1="482" y1="53" x2="520" y2="53" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#proof-of-reserve-arrow-en)"/>
  <rect x="120" y="120" width="400" height="76" rx="10" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="320" y="144" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">Rogue mint attempt: supply + amount &gt; reserves</text>
  <text x="320" y="166" text-anchor="middle" font-size="12" fill="var(--red)" font-weight="700">✗ REVERT — what the PDF couldn't stop, this line does</text>
  <text x="320" y="184" text-anchor="middle" font-size="9" fill="var(--muted)">secured mint: if reserves haven't kept up, minting cannot execute</text>
  <line x1="575" y1="82" x2="420" y2="118" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#proof-of-reserve-arrow-en)"/>
</svg>
</figure>

### ③ What it proves and what it can't: an expert-grade comparison table

This is the expert section. PoR's capability boundary as a table — every row is worth reading word by word:

<table>
<tr><th>Dimension</th><th>PoR proves ✓</th><th>PoR cannot prove ✗</th></tr>
<tr><td>Existence</td><td>At time T, the observed account/address really held X of the asset</td><td>——</td></tr>
<tr><td>Ratio</td><td>Reserves ÷ token supply, continuously updated</td><td>——</td></tr>
<tr><td>Encumbrance</td><td>——</td><td>Whether those assets are already pledged/collateralized to someone else. The same T-bills can sit serenely in a balance API while being repo-financed elsewhere — double-pledging is invisible to a balance query</td></tr>
<tr><td>Full liabilities</td><td>The token-supply line of the liability side</td><td>The issuer's other debts (bank loans, legal damages, related-party payables). Reserves ≥ token supply ≠ you get your money back in insolvency — other creditors are also in the queue (this is exactly why Stage 5.2's bankruptcy remoteness matters)</td></tr>
<tr><td>Source honesty</td><td>——</td><td>The bank API / custodian statement itself can be wrong or forged. PoR fully inherits its data source's trust assumptions (Stage 8.1)</td></tr>
<tr><td>Claim quality</td><td>——</td><td>Whether token holders have a legally enforceable senior claim on those reserves — that's the question of all of Stage 5, and no feed can answer it</td></tr>
</table>

In one line of trade jargon: **PoR proves a stream of existence snapshots on the asset side — not the full liability side, and never the legal claim.** In the days after FTX collapsed, exchanges rushed to publish "proof of reserves," and the industry immediately pointed out: a PoR showing assets without liabilities is like showing your wallet but hiding your bills — that debate made "the limits of PoR" common knowledge.

### ④ The cross-chain wrinkle: one asset, seven chains — reconciling supply

RWA's reality is multi-chain issuance: BUIDL (Stage 10.1) has expanded to Ethereum, Solana, and **seven-plus chains**; bridge-wrapped assets are multi-chain by construction. That adds a new math problem to PoR: **the "liability side" is no longer one number on one chain — it's the sum of supplies across N chains, and that sum must equal the total on the master register.**

- Each chain has its own supply: \`supply_eth + supply_sol + … = master register total\` — leave that equation unwatched and things go wrong: a bridge gets hacked or one chain gets a rogue mint, and the other chains feel nothing.
- The fix is to run PoR in reverse as well: feed not just "how much reserve exists" but **"how much supply exists on each chain,"** and verify the global equation on every chain. A cross-chain messaging protocol (e.g., Chainlink CCIP) hauls and aggregates the per-chain supplies; any chain that sees global supply exceeding the master register trips its local breaker.
- Keep the shift in view: in the single-chain era, PoR checks "assets ≥ liabilities"; in the multi-chain era it must also check that **the liability's clones summed together don't exceed the original** — supply reconciliation itself becomes a machine problem.

### ⑤ Real deployments, and where PoR sits on the trust ladder

A few real-world samples to feel the spectrum:

- **Chainlink PoR feeds**: the most standardized form, adopted across asset types (e.g., Backed's tokenized securities). TUSD was a well-known user — and at one point its PoR feed showed anomalous reserve data and rattled the market. That awkward moment is the double-edged sword on full display: **the public feed made the problem visible** (in the PDF era nobody would ever have known), while also proving a feed can only relay whatever its source hands it.
- **Ondo USDY** (Stage 10.2): publishes regular collateral reports and plugs into reserve monitoring — a yield-bearing note whose overcollateralization ratio is a checkable number.
- **PAXG's bar list** (Stage 10.5): Paxos publishes every gold bar's serial number, and holders can look up which bar in a London vault their tokens map to — an "artisanal PoR": weak machine-readability, but granularity all the way down to physical metal.
- **BUIDL-class tokenized funds**: administrator NAV feeds (Stage 8.2) + custodian holdings reports — in essence, PoR's equivalent in the securities world.

Finally, place PoR back on Stage 1.3's trust ladder. The upgrade it delivers: from **"trust the quarterly PDF"** up to **"trust the source, but verify continuously"** — the cheating window shrinks from a month to hours, and the verification can be wired straight into an enforcement gate. A real rung — but **not the summit**: source honesty, encumbrance, and legal claim quality remain untouched off-chain, still answered by custody structures, audits, and legal wrappers (Stage 4.2, Stage 5). Hold it against Stage 4.2's five-question checklist: PoR answers "**how often is it checked**" beautifully — and stays completely silent on "**has the reserve been pledged away**."

If you take away one sentence: **PoR shuts down "minting in the dark" — if reserves haven't kept up, the mint cannot execute; it cannot shut down "selling the same bride twice" — and knowing a tool's boundary is what it means to know the tool.**
`,

  demo: "por-monitor",

  analogy: `
Think of a token issuer as a luggage-storage warehouse: you deposit a bag, it hands you a claim ticket, and the number of tickets outstanding should always equal the bags on the shelves.

**Monthly attestation** (Stage 4.2) is hiring a notary to count the bags once a month and post a notice: "as of last month's end, 1,000 bags, 1,000 tickets." Useful — but the notice speaks for month-end only. Whether extra tickets were quietly printed mid-month, or bags were wheeled out and back, the notary doesn't know, and neither do you.

**PoR** is installing a networked inventory scanner in the warehouse that broadcasts the count to a public display every hour, visible to the whole city. Better still, **the ticket printer is wired to the scanner**: with 1,000 bags on the shelves, an attempt to print ticket number 1,001 simply jams the printer — that's the secured mint. Want to issue more tickets? Physically bring more bags in first.

But the scanner has two congenital blind spots. **It can count bags on shelves; it cannot see another party's lien sticker on them** — the owner can pledge 500 bags to a bank for a loan without moving a single one; the scanner's count stays pristine, yet on the day of a run, the bank drags those bags away before you do (encumbrance). **And it trusts its own sensors** — if the owner tampers with them, the display's real-time number is a real-time lie (source honesty). So when you see the public display, be glad — then remember to ask: who checks for lien stickers, and who calibrates the sensors? Those answers live in legal documents and audit reports, not on the screen.
`,

  misconceptions: [
    "“It has PoR = the reserves are safe, buy with confidence.” —— PoR proves only that the observed account held X at time T, plus the reserve/supply ratio. It doesn't prove the assets aren't encumbered, that the issuer has no other liabilities, or that you hold a legally senior claim on the reserves. It's one item on the diligence checklist, not the checklist.",
    "“The PoR feed shows 102%, so I'll surely get paid in full on redemption.” —— Reserves ≥ token supply ≠ you stand first in line in a bankruptcy. If the issuer has other debts, or the reserves are pledged, other creditors share the pie in liquidation. Whether you recover first depends on Stage 5's legal structure (bankruptcy-remote SPV, trust), not on the feed's number.",
    "“PoR is weaker than an audit — just marketing.” —— Backwards; the two don't substitute for each other. Audits/attestations are broad (they can examine liabilities, encumbrance, internal controls) but infrequent; PoR is narrow (balances only) but continuous, machine-readable, and wireable into enforcement gates. Mature products need both: audits for depth, PoR for frequency.",
    "“With a secured mint, over-issuance is absolutely impossible.” —— It blocks minting when the reserve figure hasn't kept up. If the source itself is manipulated (a forged bank API, a lying custodian), the feed faithfully relays the fake number and the gate waves the mint through. PoR inherits its source's trust assumptions — the oracle problem of Stage 8.1, appearing once again.",
    "“In a multi-chain deployment, each chain checking its own reserves is enough.” —— Not enough. The liability side is the sum of all chains' supplies, and it must reconcile against the master register. Otherwise a rogue mint on one chain or a hacked bridge goes unfelt by the others. Multi-chain PoR must feed not just the reserve figure but a global cross-check of per-chain supplies.",
  ],

  quiz: [
    {
      q: "Versus the monthly attestation report (Stage 4.2), what is PoR's most fundamental upgrade?",
      options: [
        "PoR is signed by more prestigious institutions",
        "From a low-frequency snapshot for humans to a continuous machine-readable feed — one that can wire into the mint function as a gate, so minting reverts when reserves fall short",
        "PoR carries more legal force",
        "PoR requires trusting no one",
      ],
      answer: 1,
      explain: "A double upgrade of frequency (month → hours) and reader (human → contract) lets verification become enforcement: a PDF can't stop an over-mint; require(supply + amount <= reserves) can.",
    },
    {
      q: "The issuer repo-finances half the reserve T-bills (pledging them to a counterparty). What does the PoR feed do?",
      options: [
        "Immediately shows reserves halved and trips the breaker",
        "Shows a slight decline",
        "Most likely nothing changes — a balance query can't see encumbrance; the assets are still in the account, they just already belong to someone else's claim",
        "The feed automatically flags those assets",
      ],
      answer: 2,
      explain: "Double-pledging is completely invisible to a balance API — PoR's most important blind spot. Encumbrance is checked through audits, custody agreements, and legal documents, not feeds.",
    },
    {
      q: "What is the core mechanism of the 'secured mint' pattern?",
      options: [
        "Minting requires multi-signature approval",
        "The mint function first reads the PoR feed, requiring the feed to be fresh and post-mint supply ≤ reserves — otherwise the transaction reverts",
        "Only regulators can execute mints",
        "Every mint automatically notifies the auditor",
      ],
      answer: 1,
      explain: "Two requires turn transparency into enforcement: rogue mints, stolen-key mints, and bridge supply inflation all fail whenever the reserve figure hasn't kept up.",
    },
    {
      q: "After FTX, what was the core criticism of exchanges' 'proof of reserves' displays?",
      options: [
        "The update frequency was too low",
        "Showing the asset side without the liability side — showing the wallet while hiding the bills; big reserves don't equal solvency",
        "They used the wrong chain",
        "They didn't hire a Big Four firm",
      ],
      answer: 1,
      explain: "PoR proves asset existence, not the full liability picture. The issuer's/exchange's other debts are invisible to any feed — that debate made PoR's limits common knowledge.",
    },
    {
      q: "An RWA asset is issued on 7 chains. Beyond checking reserves, what must PoR also do?",
      options: [
        "Hire different auditors per chain",
        "Reconcile supply globally: the sum of every chain's supply must equal the master register's total, and any chain detecting excess trips its circuit breaker",
        "Run PoR on Ethereum mainnet only",
        "Ban cross-chain transfers",
      ],
      answer: 1,
      explain: "Multi-chain issuance shatters the liability side into N numbers; supply reconciliation becomes a machine problem — cross-chain messaging (e.g., CCIP) hauls per-chain supplies for the global check.",
    },
  ],

  further: [
    { label: "Chainlink: Proof of Reserve (product page and rationale)", url: "https://chain.link/proof-of-reserve" },
    { label: "Chainlink docs: Proof of Reserve Feeds (integration details)", url: "https://docs.chain.link/data-feeds/proof-of-reserve" },
    { label: "Paxos: PAXG transparency (bar serial lookup — the 'artisanal PoR')", url: "https://paxos.com/paxg/" },
    { label: "Ondo Finance docs (USDY collateralization & reporting)", url: "https://docs.ondo.finance/" },
    { label: "a16z crypto: what Proof of Reserves can and can't do (industry discussion)", url: "https://a16zcrypto.com/posts/article/proof-of-reserves/" },
  ],
};
