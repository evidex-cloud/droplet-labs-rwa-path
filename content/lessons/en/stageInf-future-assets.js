export default {
  id: "future-assets",
  stage: "∞",
  order: 1,
  title: "The Next Wave: Deposit Tokens, Tokenized Equities & Markets for Everything",
  difficulty: "infinity",
  prereqs: ["case-buidl", "sandboxes-pilots"],

  oneLiner:
    "Predicting what tokenizes next isn't about chasing hot topics — it's about running an instrument distilled from this entire course: the feasibility stack. Legal clarity, custody & bridge, valuation & data, real buyers — an asset class only truly goes on-chain when all four pillars stand at once. Score the candidates: deposit tokens are closest to production scale; tokenized US equities will arrive through exchange plumbing upgrades, not startups; treasuries and bonds are the boring extrapolation; and each long-tail asset is missing one or two pillars. The endgame isn't “crypto absorbs finance” either — it's finance's settlement layer quietly swapping to shared programmable ledgers over ten to twenty years. Tokens commoditize; trust doesn't.",

  intuition: `
You've now taken the whole RWA machine apart: legal wrappers (Stage 5), token standards (Stage 6), the compliance machine (Stage 7), oracles and data (Stage 8), liquidity (Stage 9), real cases (Stage 10), global regulation (Stage 11), risk and diligence (Stage 12), designing by hand (Stage 13). What comes next is the question everyone will ask you: **“So what's next?”**

The industry's standard answer is hot-topic relay: “stocks on-chain” today, “carbon credits” tomorrow, “GPU compute” the day after. What these predictions share is the **absence of a method** — they treat “people are talking about it on Twitter” as “it will happen.” The course you just finished hands you something nobody else has: a **prediction instrument**.

Think back to every case in this course that actually worked: stablecoins (Stage 4), BUIDL (Stage 10.1), PAXG (Stage 10.5). The reason they succeeded is strikingly consistent — not flashy tech, but **four things in place at once**. Now think of every project that died (Stage 10.6): the cause of death is equally consistent — **at least one of the four was missing**. Make that pattern explicit and you have this lesson's method. Prediction stops being guessing and becomes asking, asset class by asset class: which pillars stand, which are missing, and **what event would raise the missing one**.

**Here's the map — six parts:**

- **① The feasibility stack — the whole course compressed into a prediction instrument**
- **② Deposit tokens — the banks' answer to stablecoins**
- **③ Tokenized equities — three models, only one of them real**
- **④ Treasuries and bonds go mainstream — the boring but certain extrapolation**
- **⑤ “Markets for everything” — running the long tail through the instrument**
- **⑥ The endgame — what gets swapped is the settlement layer; what gets sold is trust**
`,

  mechanics: `
### ① The feasibility stack: the whole course compressed into a prediction instrument

Let's state the method plainly. Whether an asset class truly tokenizes (meaning production scale, not a press release) depends on **four pillars standing at the same time**:

- **① Legal clarity**: a **legal wrapper** and regulatory regime exist that can hold it — the token holder's claim survives a courtroom (Stage 5), and issuance and trading follow explicit rules (Stage 11).
- **② Custody & bridge**: the off-chain asset has mature **custody standards** and a credible bridge continuously proving to the chain that “the asset is really there” (Stage 1.3) — custodian, transfer agent, attestor all in their seats.
- **③ Valuation & data**: a **price/NAV machine** exists — someone can compute what it's worth by an accepted method and feed that number reliably on-chain (Stage 8). Treasuries have one; a painting doesn't.
- **④ Real buyers**: someone **specifically wants it on-chain** — not “you could also buy it on-chain,” but the on-chain form solves a problem the off-chain form can't (Stage 9.1's primary-market lesson: without real subscriptions, everything else is theater).

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <rect x="60" y="20" width="520" height="44" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="320" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="var(--orange-ink)">Asset class truly goes on-chain (production scale)</text>
  <text x="320" y="56" text-anchor="middle" font-size="10" fill="var(--muted)">The roof only holds when all four pillars stand</text>
  <rect x="60" y="96" width="112" height="140" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="116" y="122" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">① Legal</text>
  <text x="116" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">wrapper exists</text>
  <text x="116" y="156" text-anchor="middle" font-size="10" fill="var(--muted)">regime is clear</text>
  <text x="116" y="176" text-anchor="middle" font-size="9" fill="var(--muted)">Stage 5 / 11</text>
  <rect x="196" y="96" width="112" height="140" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="252" y="122" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">② Custody</text>
  <text x="252" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">asset held safely</text>
  <text x="252" y="156" text-anchor="middle" font-size="10" fill="var(--muted)">proof reaches chain</text>
  <text x="252" y="176" text-anchor="middle" font-size="9" fill="var(--muted)">Stage 1.3</text>
  <rect x="332" y="96" width="112" height="140" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="388" y="122" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">③ Valuation</text>
  <text x="388" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">NAV/price machine</text>
  <text x="388" y="156" text-anchor="middle" font-size="10" fill="var(--muted)">fed on-chain reliably</text>
  <text x="388" y="176" text-anchor="middle" font-size="9" fill="var(--muted)">Stage 8</text>
  <rect x="468" y="96" width="112" height="140" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="524" y="122" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">④ Buyers</text>
  <text x="524" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">on-chain form</text>
  <text x="524" y="156" text-anchor="middle" font-size="10" fill="var(--muted)">solves a real problem</text>
  <text x="524" y="176" text-anchor="middle" font-size="9" fill="var(--muted)">Stage 9.1</text>
  <rect x="60" y="256" width="520" height="30" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="320" y="275" text-anchor="middle" font-size="11" fill="var(--ink)">Prediction = per asset class: which pillar is missing? What event would raise it?</text>
</svg>
</figure>

Calibrate the instrument against history: stablecoins scored full marks on all four (dollar law is clear, banks custody the reserves, 1:1 valuation is trivially easy, the buyer was the entire crypto market), so they worked first. The 2017–19 STO wave died on ④ — issuable, but nobody wanted them (Stage 10.6). RealT got stuck on the “messy asset” side of ①② (Stage 10.4). BUIDL is what it looks like when a ten-trillion-dollar asset manager raises all four pillars at once (Stage 10.1). An instrument that gets all of history right has earned the right to be pointed at the future.

### ② Deposit tokens: the banks' answer to stablecoins

The first candidate — and the one closest to production scale: **tokenized deposits (deposit tokens)** — commercial banks issuing their own **deposit liabilities** directly on-chain, with JPMorgan's **Kinexys** (formerly Onyx; JPMD-style products) as the flagship. The difference from stablecoins fits in one sentence: a stablecoin is a payment instrument issued by a **non-bank** against full reserves (Stage 4.1); a deposit token **is the bank deposit itself**, just in a new ledger format — so it automatically inherits **deposit insurance, banking regulation, and the ability to pay interest**, three things stablecoins can't offer. The price: it's **permissioned and bank-by-bank** — only that bank's customers can hold it, on a permissioned chain or a permissioned slice of a public one.

This is the banks' head-on answer to the world of Stage 4: the stablecoin business model is essentially a raid on the banks' **float** (customer money becomes Circle's reserves instead of bank deposits), and banks were never going to just watch. Run the instrument: **legal ✓** (banking law extends directly — no new regime needed); **custody ✓** (the bank is its own custodian); **data ✓** (1 deposit token = 1 dollar of deposit, valuation is trivial); **buyers ✓** (institutional treasurers want 24/7 settlement — a real need; Stage 3.4 covered what nights-and-weekends closure costs). All four pillars stand, so the prediction is unambiguous: **deposit tokens will reach production scale**, with institutional settlement volume leading.

But bring back the **cash-leg** finding from Stage 11.4: JPMorgan's deposit token and Citi's deposit token **don't clear against each other** — they're liabilities of different banks, and without shared rails you're back in the correspondent-banking era. So the key indicator for deposit tokens isn't which bank issued one — it's when an **interbank shared settlement layer** (a shared ledger or a wholesale-CBDC bridge) appears. That's the watershed between “an in-house tool” and “an industry rail.”

### ③ Tokenized equities: three models, only one of them real

The asset everyone most wants to ask about. Shine Stage 5.1's **claim discipline** (what exactly do you hold, and against whom) on the market's “stock tokens,” and they split instantly into three models of very different honesty:

- **Derivative wrappers** (Robinhood's EU “stock tokens,” xStocks and kin): you hold **not shares** but a **tracking contract against the issuer** — the price follows Tesla, but you have no votes, you're not on the shareholder register, and your counterparty risk is the issuer. Non-US persons only. It's legal — but calling it “owning stock” is marketing.
- **Transfer-agent-native tokenized shares**: **actual shares**, where the on-chain token is (or syncs with) the legal shareholder register — this requires **issuer cooperation plus the SEC's blessing**; it's Stage 5.3's register question scaled up to NYSE size. The directional signal events: Nasdaq's 2025 tokenized-settlement filing with the SEC, and exchanges openly discussing 24/7 trading.
- **Synthetic/mirror**: hold no real stock, “mirror” the price via algorithms or overcollateralization — that road died with Terra (Stage 10.6) and needs no further discussion.

Run the instrument: **buyers ✓✓** (global retail demand for US equities is the strongest of any RWA); **custody ✓ data ✓** (equities already have mature DTCC custody and real-time prices); what's missing is **① legal** — putting real shares on-chain touches the core institutions of securities settlement. So the prediction has to be a little counterintuitive: **tokenized equities for US retail won't come from startups — they'll come from exchange plumbing upgrades**. Once Nasdaq/DTCC swap the settlement layer, “stocks simply are tokens” will happen quietly as an infrastructure change, the way T+1 did (May 2024). The startups' derivative wrappers are a transitional product serving a real but different market: non-US users who can't easily buy US stocks.

### ④ Treasuries and bonds go mainstream: the boring but certain extrapolation

The least sexy, most certain wave. Tokenized treasuries stood at roughly $7–8B as of late 2025, with all four pillars long since standing (which is exactly why they worked first — Stage 3.2). What comes next requires no new event, only extrapolation: **every major asset manager ships its own BUIDL-alike** — Fidelity and others are already en route, and the blueprint is public (Stage 10.1's validated drawing).

One step further: **corporate bonds**. They add a layer of credit analysis, but the pillars are in nearly as good shape: mature custody, accepted valuation curves, real institutional buyers. The entry point is the door from Stage 11.2: European institutional bonds are routinely issued in **€100,000+ denominations** to qualify for retail-prospectus exemptions — and tokenization serves precisely that **institutional door** first, where regulatory friction is lowest. Prediction: corporate bonds follow treasuries by two or three years, growing quietly from the institutional side.

### ⑤ “Markets for everything”: running the long tail through the instrument

Now point the instrument at the long tail. For each class, ask the same pair of questions: which pillar is missing? **What event would raise it** (Stage 11.4's watchlist thinking)?

- **Trade invoices / trade finance — strong.** Paper is highly standardized (invoices, bills of lading), cash flows are short-dated and measurable (③✓), buyers are real (private credit funds are perpetually short of standardized assets, Stage 3.5). The missing pillar used to be ①: negotiable documents like bills of lading legally had to be paper. The UK's **Electronic Trade Documents Act 2023 (ETDA)** raised that pillar (Stage 11.4) — the watch event has already fired; what remains is the assembly line.
- **Music/IP royalties — medium.** Cash flows are real (streaming payouts land quarterly), but ③ is hard (how do you value a song's next ten years of streams? who sets the discount rate?) and ④ is narrow (buyers are niche alternatives players). Trigger event: an accepted royalty-valuation data vendor emerges.
- **Carbon credits — wounded but structurally sensible.** On-chain carbon ran hot, then had its trust destroyed when the registry pulled the plug (Stage 10.5's lesson: one off-chain registry announcement that “these credits are invalid” turns on-chain tokens into souvenirs). Pillar ②'s bridge is broken. Trigger event: a mainstream registry (Verra-class) officially supporting tokenized issuance rather than passively tolerating it.
- **GPU time / compute — novel, but see through it.** It sounds like “tokenized compute,” but unpack it and it's **prepayment contracts** (claims on future services). ④ is doubtful: compute buyers want the compute itself — how real is on-chain transferability demand? ③ is hard too: compute prices swing violently.
- **Litigation finance, art — weak.** Missing both ③ and ④: valuation is expert guesswork, buyers are tiny niches. Prime territory for Stage 10.6's “liquidity illusion” — fractionalization doesn't manufacture demand; it just slices the unwanted thing thinner.

Notice what this exercise produces: not conclusions, but a **watchlist** — next to each class, one line saying “event to watch,” and when the event fires, you update the score. That beats any “the market will reach $X trillion by 2030” report — and you now know how to audit those numbers anyway (Stage 12.2).

### ⑥ The endgame: what gets swapped is the settlement layer; what gets sold is trust

Finally, pull the camera back and state this course's view of the endgame — **carefully**.

The endgame is very probably **not** “crypto absorbs finance”: not every asset migrating to public chains and floating freely, not intermediaries vanishing. Every case in this course that worked points in a different direction: **finance's settlement layer** — the plumbing you saw in Stage 3.4, stitched together with reconciliation and T+1 — **quietly swapping to shared programmable ledgers over ten to twenty years**. Users won't see the swap, just as nobody noticed T+2 becoming T+1. BUIDL kept all five roles (Stage 10.1) and only rewired them; in deposit tokens, the bank is still a bank — only the bookkeeping changed.

Meanwhile, everything this course taught you — legal wrappers, the compliance machine, data pipelines, regulatory relationships — is **not scaffolding in the endgame; it is the product**. Tokens will commoditize: the marginal cost of deploying another ERC-3643 approaches zero. But the craft that makes the claim behind a token **enforceable and verifiable** — the architecture of trust — does not commoditize. It's licensed, moated, and billed annually. That's why Securitize, BNY, and Chainlink show up in every single case study.

If you take away one sentence: **predicting the next wave isn't guessing which hot topic pops first — it's watching each asset class's four pillars to see which rises next; and whatever tokenizes, what ultimately gets sold isn't the token — it's the trust.**
`,

  demo: "future-radar",

  analogy: `
Think of “which asset will tokenize” as **judging which plot of land can support a building**. Developers (industry hype) will point at any plot and declare “a new city rises here” — seaside, hilltop, swamp, the pitch is equally stirring.

But a structural engineer (you) checks four things only: **can a foundation be poured** (legal clarity — is the land title clean), **do water and power reach it** (custody & bridge — can the municipal grid connect), **can the building be appraised** (valuation & data — are there comparable sales nearby), and **does anyone want to live there** (real buyers — don't build a ghost town). Pass all four and someone will certainly build — no urging required; fail any one and the prettiest rendering stays a rendering.

There's one more difference between the engineer and the developer: the developer asks “where's hot,” while the engineer asks “**which plot's missing utility just got connected**.” The swamp got drained (ETDA legalized electronic bills of lading); the grid got hooked up (a registry officially onboarded) — **events** like these are the buy signal.

So the expert's forecast isn't a list of assets; it's a **watchlist of events**: don't bet on which tower rises first — watch the one pillar still lying on the ground at each site. The day it stands, you'll know a building is coming six months before the market does.
`,

  misconceptions: [
    "“You can tell what tokenizes next from how much the community talks about it.” —— Volume measures attention, not feasibility. The 2017–19 STO wave had maximum buzz and three missing pillars, and died collectively (Stage 10.6). Deposit tokens, meanwhile, get little chatter and have all four pillars standing. Score with the feasibility stack, not with decibels.",
    "“Deposit tokens are just a bank-flavored stablecoin — nothing new.” —— The legal nature is entirely different: a stablecoin is a non-bank's fully-reserved liability (Stage 4.1); a deposit token is the bank deposit itself — deposit insurance, banking regulation, and interest included, in exchange for being permissioned and non-interoperable across banks. One is a new species; the other is an old species with new bookkeeping. The risk profiles are worlds apart.",
    "“A stock token on Robinhood means you own the stock.” —— Stage 5.1's claim discipline exposes it instantly: that's a derivative tracking contract against the issuer — you're not on the shareholder register, you have no votes, and you carry issuer counterparty risk. Real tokenized shares need transfer-agent-native design plus issuer cooperation plus regulatory blessing — that road is being walked, but by exchanges, not apps.",
    "“Everything will tokenize eventually — it's just a matter of time.” —— Technically yes; economically no. Litigation finance and art lack both a valuation machine and real buyers, and fractionalization doesn't manufacture demand (Stage 10.4's liquidity illusion). Some assets will stay forever in “possible but pointless.”",
    "“The endgame is crypto replacing traditional finance and intermediaries disappearing.” —— Every working case in this course refutes it: BUIDL kept all five intermediaries (Stage 10.1). What gets replaced is the reconciliation and waiting in the settlement layer; what gets kept — and becomes more valuable — is the trust architecture: wrappers, compliance, data, law. Tokens commoditize; trust doesn't.",
  ],

  quiz: [
    {
      q: "Under the “feasibility stack,” what predicts that an asset class will truly tokenize?",
      options: [
        "Whether a token can technically be issued",
        "Legal clarity, custody & bridge, valuation & data, and real buyers — all four pillars standing at once",
        "A major institution announcing it's entering the space",
        "Sufficiently loud community discussion",
      ],
      answer: 1,
      explain: "All four are necessary: the STO wave died missing buyers, on-chain carbon died on a broken bridge — every historical failure lacked at least one pillar.",
    },
    {
      q: "What is the most essential difference between a deposit token and a stablecoin?",
      options: [
        "Deposit tokens use more advanced technology",
        "A deposit token is the commercial bank deposit itself on-chain — with deposit insurance, banking regulation, and interest, but permissioned and non-interoperable across banks; a stablecoin is a non-bank's fully-reserved liability",
        "Deposit tokens are unregulated",
        "There is no difference besides the name",
      ],
      answer: 1,
      explain: "One is a bank liability in a new ledger format; the other is a new kind of non-bank liability. Hence the key bottleneck: an interbank shared settlement layer — JPMD and a CitiToken don't naturally clear against each other.",
    },
    {
      q: "Why are tokenized equities for US retail more likely to come from “exchange plumbing upgrades” than from startups?",
      options: [
        "Because startups lack the technical skill",
        "Because the missing pillar is legal clarity — real shares on-chain touch the core institutions of securities settlement, which only Nasdaq/DTCC-scale filings and infrastructure changes can address, landing the way T+1 did",
        "Because retail doesn't want tokenized stocks",
        "Because exchanges charge lower fees",
      ],
      answer: 1,
      explain: "Buyers, custody, and data all stand; only the legal pillar needs a regime-level change — and regime-level changes historically arrive via incumbent infrastructure (Nasdaq's 2025 tokenized-settlement filing is the signal). Startups' derivative wrappers serve a different market: non-US users.",
    },
    {
      q: "Trade invoices score strongest in the long tail. What was the key “pillar-raising event”?",
      options: [
        "Bitcoin reaching a new all-time high",
        "The UK's Electronic Trade Documents Act 2023 giving legal force to electronic bills of lading and other negotiable documents — raising the legal pillar",
        "An exchange listing an invoice token",
        "AI being able to generate invoices automatically",
      ],
      answer: 1,
      explain: "Invoices are standardized, cash flows measurable, buyers real; the only missing piece was the law requiring negotiable documents to be paper — which ETDA removed. That's watchlist thinking: track events, not hype.",
    },
    {
      q: "What is this course's view of the endgame?",
      options: [
        "All assets migrate to public chains and intermediaries disappear",
        "RWA will be proven a bubble",
        "Finance's settlement layer quietly swaps to shared programmable ledgers over ten to twenty years, while the trust architecture (wrappers, compliance, data, law) remains the actual product — tokens commoditize, trust doesn't",
        "Only treasuries will ever tokenize",
      ],
      answer: 2,
      explain: "The evidence is every working case in the course: BUIDL rewired the roles without removing them; deposit tokens changed the bookkeeping, not the bank. What sells is enforceable, verifiable trust — never the token itself.",
    },
  ],

  further: [
    { label: "Kinexys by J.P. Morgan (the flagship of deposit tokens and bank on-chain settlement)", url: "https://www.jpmorgan.com/kinexys" },
    { label: "BIS Annual Economic Report 2023, Chapter III: the unified-ledger blueprint (the central-bank version of the settlement-layer swap)", url: "https://www.bis.org/publ/arpdf/ar2023e3.htm" },
    { label: "UK Electronic Trade Documents Act 2023, full text (trade finance's pillar-raising event)", url: "https://www.legislation.gov.uk/ukpga/2023/38" },
    { label: "rwa.xyz (the data dashboard tracking tokenization scale by asset class)", url: "https://app.rwa.xyz" },
  ],
};
