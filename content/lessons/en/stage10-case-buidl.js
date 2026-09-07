export default {
  id: "case-buidl",
  stage: 10,
  order: 1,
  title: "BlackRock BUIDL: The Benchmark Tokenized Treasury Fund",
  difficulty: "mastery",
  prereqs: ["token-vs-claim", "redemption-peg"],

  oneLiner:
    "BUIDL is the case study that packs the whole course into one product: the world's largest asset manager moved a money-market-style fund's shareholder register onto a blockchain. All five traditional roles — manager, custodian, administrator, transfer agent, placement agent — are still there. They've just been re-wired: the register became a token, settlement became instant, redemption became 24/7. It proves the institutional pipeline works end to end; it does not prove disintermediation or retail access. Quite the opposite — BUIDL is TradFi wearing chain-native settlement, and that is exactly why it worked first.",

  intuition: `
In March 2024, BlackRock — managing roughly $10 trillion — did something that made the entire industry sit up straight: it launched its first tokenized fund, the **BlackRock USD Institutional Digital Liquidity Fund**, ticker **BUIDL**. It blew past $500 million within months and, as of 2025, sits at roughly $2–3 billion — the **benchmark** for the entire tokenized-treasury category.

You're in a special position right now: across Stages 5 through 9 you learned the full stack — legal wrappers, token standards, the compliance machine, oracles, liquidity mechanics. This lesson teaches no new concepts. It's a **live-fire exercise**: take every tool out of your toolbox and use each one on a real product. Every design decision in BUIDL maps to a specific lesson in this course.

Understand BUIDL and you understand the institutional "standard solution" for RWA. See clearly what it did **not** achieve, and you've truly graduated.

**Here's the map — five parts:**

- **① The cast and the structure — five roles, none missing**
- **② The terms — read through every lens the course gave you**
- **③ The killer feature — the 24/7 USDC redemption facility**
- **④ Growth and usage — how it actually gets used**
- **⑤ The two-sided verdict — what it proves, and what it doesn't**
`,

  mechanics: `
### ① The cast and the structure: five roles, none missing

Start with the publicly known cast list. BUIDL is a fund registered in the **British Virgin Islands (BVI)** — an offshore fund shell, standard practice for professional-investor markets (Stage 5.2 covered why issuers favor such jurisdictions). Around it stands the complete fund crew you met in Stage 3.3:

- **BlackRock**: the fund **manager**, deciding what to hold — cash, short-term US Treasuries, overnight repo — targeting a stable $1-per-share, money-market-fund style.
- **Securitize**: the **tokenization platform + SEC-registered transfer agent + placement agent**. Note those words "transfer agent" — it is the legal keeper of the shareholder register, and the register it maintains **is the on-chain token ledger**. This is the textbook answer to Stage 5.3's "keeping the on-chain record and the legal register in sync" problem: have one licensed entity run both sides, and the two sides become one.
- **BNY Mellon**: **custodian + administrator**. The off-chain assets (Treasuries, cash, repo) sit in its accounts, and the NAV is computed down that line. The token flies around on-chain while the assets sleep inside a 240-year-old custodian bank — Stage 1.2's "the token is on-chain, the asset isn't," made concrete.
- **The chains**: Ethereum first, then bridged via **Wormhole** to Aptos, Arbitrum, Avalanche, Optimism, Polygon, Solana and more. This is the "**distribution over purity**" choice discussed in Stage 2.6: go wherever the clients are — at the cost that multichain supply must reconcile against the master register at all times, which is exactly what Stage 8.3's proof-of-reserve / supply reconciliation is for.

<figure>
<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="buidl-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <rect x="230" y="20" width="180" height="52" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="320" y="42" text-anchor="middle" font-size="12" font-weight="700" fill="var(--orange-ink)">BUIDL Fund (BVI)</text>
  <text x="320" y="60" text-anchor="middle" font-size="10" fill="var(--muted)">target $1/share · T-bills+cash+repo</text>
  <rect x="20" y="120" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="110" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">BlackRock</text>
  <text x="110" y="160" text-anchor="middle" font-size="10" fill="var(--muted)">Manager: picks the assets</text>
  <rect x="230" y="120" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Securitize</text>
  <text x="320" y="160" text-anchor="middle" font-size="10" fill="var(--muted)">Transfer agent: chain=register · KYC</text>
  <rect x="440" y="120" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="530" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">BNY Mellon</text>
  <text x="530" y="160" text-anchor="middle" font-size="10" fill="var(--muted)">Custody+admin: assets & NAV</text>
  <rect x="20" y="240" width="180" height="52" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="110" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Qualified Purchasers</text>
  <text x="110" y="280" text-anchor="middle" font-size="10" fill="var(--muted)">whitelisted addresses · $5M min</text>
  <rect x="230" y="240" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Ethereum + multichain</text>
  <text x="320" y="280" text-anchor="middle" font-size="10" fill="var(--muted)">Wormhole bridge · supply reconciliation</text>
  <rect x="440" y="240" width="180" height="52" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="530" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Circle redemption facility</text>
  <text x="530" y="280" text-anchor="middle" font-size="10" fill="var(--muted)">BUIDL → USDC · 24/7</text>
  <line x1="110" y1="120" x2="255" y2="72" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="320" y1="120" x2="320" y2="72" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="530" y1="120" x2="385" y2="72" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="320" y1="240" x2="320" y2="172" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="110" y1="240" x2="110" y2="172" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="200" y1="266" x2="230" y2="266" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="410" y1="266" x2="440" y2="266" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
</svg>
</figure>

Count them: manager, transfer agent, custodian, administrator, placement agent, bridge, redemption-facility operator. **Not one role got "disintermediated" away** — file that observation; we settle the bill in ⑤.

### ② The terms: read through every lens the course gave you

Walk the publicly known terms one by one, tagging each with the course lesson it maps to — that's what "full-stack dissection" means:

- **Token = fund share**. A BUIDL token is a **share** in this BVI fund — a claim on the fund's assets. A standard Stage 5.1 claim-anatomy exercise: the claim runs against the fund, the fund's assets sit in BNY custody, and bankruptcy remoteness comes from the fund structure itself.
- **Who may buy**: a Reg D 506(c) private placement, restricted to **Qualified Purchasers (QP — generally $5M+ in investable assets, an order of magnitude above "accredited investor")**, with a **$5 million minimum** subscription. This is an extreme corner of Stage 7.2's "compliance geometry": crank the eligibility bar to the max, and the offering process gets maximally smooth.
- **Transfer restrictions**: BUIDL moves only between **whitelisted addresses** — each one a Securitize-KYC'd qualified purchaser (Stage 7.3's transfer checks in production). Note: it runs on Securitize's own DS-style compliance system, **not** ERC-3643 — but the check logic is isomorphic: an identity registry plus verification at transfer time. This is Stage 6.3's rule: **recognize the pattern, not the brand**. Names differ; the skeleton of a permissioned token is the same.
- **How yield is paid**: dividends **accrue daily** and are paid **monthly as new tokens** airdropped to your address — your balance grows while the price holds at $1, the money-market-fund experience (Stage 3.3) implemented via the rebase-style distribution of Stage 8.4. You do nothing; at month-end your wallet simply holds more BUIDL.

None of these pieces is new — **what's new is that a ten-trillion-dollar manager assembled all of them, at once, compliantly, for the first time**.

### ③ The killer feature: the 24/7 USDC redemption facility

Stop at ② and BUIDL would be "just another on-chain fund." What makes it the benchmark is this: Circle provides a **smart-contract redemption facility** — holders can swap BUIDL 1:1 into **USDC at any moment** (midnight, weekends, holidays), settling in minutes, no waiting for the fund's subscription/redemption windows.

In Stage 9.4's language: this is an **arbitrage loop that never closes**. The instant BUIDL trades below $1 anywhere, an arbitrageur buys it and pushes it through the facility for USDC, eating the discount on the spot — which makes BUIDL's peg among the **tightest** in the market. Compare a traditional money market fund: want out on Friday night? Queue the order Monday, get a T+1 wire, with a whole weekend in between.

The facility also unlocks a second layer of value: **only an instantly-liquidatable asset qualifies as margin** (Stage 9.3). Derivatives venues accept BUIDL as collateral precisely because, in a liquidation, it turns into USDC within minutes instead of "waiting for the fund's next redemption day." Yield plus instant liquidity — a combination that doesn't exist in the traditional world.

But see its boundary clearly: the USDC in the facility is a **pre-funded buffer pool**, not magic. The underlying Treasuries still settle only during traditional hours (Stage 3.4); if the whole market rushes the exit at once and the buffer drains, everyone remaining goes back to the traditional redemption process. What's 24/7 is the **window**, not the underlying asset.

### ④ Growth and usage: how it actually gets used

The numbers (Stage 12 discipline: read market figures for magnitude, not false precision): past **$500 million** within months of launch, roughly **$2–3 billion** as of 2025, holding the top spot in tokenized Treasuries (a category of roughly $7–8 billion overall). More informative is **who uses it, and how**:

- **As a reserve asset**: Ethena's stablecoin USDtb parks most of its reserves in BUIDL — a crypto-native stablecoin using BlackRock's tokenized fund as its base layer. Stage 4's stablecoins and Stage 10's tokenized funds click together into one loop here.
- **As margin**: major venues and institutional brokers accept BUIDL as derivatives collateral — idle margin upgraded from "non-yielding stablecoin" to "yield-bearing Treasury shares."
- **As a template**: after BUIDL, Fidelity and other tier-one managers filed for similar products. Its real output isn't $3 billion of AUM — it's **a validated blueprint**.

### ⑤ The two-sided verdict: what it proves, and what it doesn't

Now close like an expert — both columns filled in.

**What BUIDL proves**: the institutional pipeline **works end to end**. All five roles intact, but every wire re-run: the shareholder register is the on-chain ledger (no more reconciliation), settlement is instant (no more T+1), dividends are a contract action (no more mailed checks), redemption is 24/7 (no more windows). No regulator changed a single rule for it — it threaded the full workflow through **existing** law.

**What BUIDL does not prove** happens to be the three most common lines in the marketing:

- **Not "access for everyone"**: Reg D + Qualified Purchasers + $5M minimum is a **narrower** door than a traditional money market fund (which takes a dollar).
- **Not "disintermediation"**: go back to ① and count nodes — BlackRock, Securitize, BNY Mellon, Circle, Wormhole… an ordinary MMF has *fewer* named intermediaries. Tokenization didn't remove the middlemen; it removed the **reconciliation and waiting between them**.
- **Not "on-chain price discovery"**: BUIDL has almost no secondary market. It is a **primary-market machine** (Stage 9.1): subscribe, hold, redeem — the price is pinned by NAV and the redemption facility, not by an order book.

If you take away one sentence: **BUIDL is TradFi wearing chain-native settlement — five roles untouched, only the register and the settlement layer swapped for a chain — and "disrupting no one" is exactly why it was the first to work.**
`,

  demo: "buidl-anatomy",

  analogy: `
Think of BUIDL as a **24-hour self-service pickup window installed by a three-Michelin-star restaurant**.

The kitchen is untouched: same head chef (BlackRock writes the menu), same cold storage (BNY Mellon keeps the ingredients), same health inspectors (audit and administration). The ingredients are still the most conservative on earth — rice, noodles, clear broth (Treasuries, cash, repo). If you expected a revolution in the kitchen, you'll be disappointed.

What changed is the **front of house**. You used to book ahead, queue, and settle the bill during opening hours (subscription windows, T+1 wires). Now there's a tap-and-collect hatch in the wall (the smart contract) — you can pick up at 2 a.m., and you can even refund your meal voucher for cash on the spot, at face value (the USDC redemption facility). A doorman checks IDs at the hatch (Securitize's whitelist) — but once you hold the membership card, everything is instant.

Here's the twist: the membership card **only goes to gourmets with $5 million or more**. So what the restaurant proved isn't "everyone can eat three-star now" — it's "a three-star kitchen can bolt on a 24-hour window without dropping a single standard." The restaurants across the street saw the queue at the hatch, and the next morning they all started installing the same window. That is how it actually changed the industry.
`,

  misconceptions: [
    "“BUIDL means ordinary people can now buy BlackRock's on-chain fund.” —— The opposite. Reg D 506(c) + Qualified Purchasers + a $5M minimum is a far higher bar than a normal money market fund (which takes $1). BUIDL proves the institutional pipeline, not financial inclusion.",
    "“Tokenization = disintermediation; BUIDL cut out the middlemen.” —— Count them: BlackRock, Securitize, BNY Mellon, Circle, Wormhole — more named intermediaries than an ordinary MMF. Tokenization removes the reconciliation and waiting between intermediaries (register = ledger, instant settlement), not the intermediaries themselves.",
    "“BUIDL's $1 price is discovered by market trading.” —— It has almost no secondary market. The price is pinned by NAV plus the 24/7 USDC facility's arbitrage loop (Stage 9.4). It's a primary-market machine, not a price-discovery venue.",
    "“BUIDL uses the ERC-3643 standard.” —— No. Securitize implements the whitelist and transfer checks with its own DS-style compliance system. But the pattern is isomorphic: identity registry + verification at transfer. Remember Stage 6.3: recognize the pattern, not the brand.",
    "“24/7 redemption means the underlying assets are liquid 24/7.” —— The facility is a pre-funded USDC buffer. The underlying Treasuries still settle in traditional hours; in an extreme run, once the buffer drains, remaining redemptions fall back to the traditional process. The window is 24/7 — the asset isn't.",
  ],

  quiz: [
    {
      q: "In the BUIDL structure, what is Securitize's most critical legal role?",
      options: ["Fund manager, deciding the portfolio", "SEC-registered transfer agent — the legal shareholder register it maintains is the on-chain token ledger", "Custodian, safekeeping the underlying Treasuries", "Market maker, supporting the secondary price"],
      answer: 1,
      explain: "The transfer-agent role is what makes 'on-chain ledger = legal register' hold (Stage 5.3): one licensed entity runs both sides, so the two sides are one. The manager is BlackRock; custody is BNY Mellon.",
    },
    {
      q: "Why does BUIDL's killer feature — Circle's USDC redemption facility — make its peg exceptionally tight?",
      options: ["Because BlackRock promises buybacks", "Because it's a 24/7 always-open arbitrage loop: any dip below $1 gets bought and swapped to USDC instantly, eating the discount", "Because regulation requires it to equal $1", "Because BUIDL trades in large volume with deep liquidity"],
      answer: 1,
      explain: "Stage 9.4's mechanism: the redemption window never closes, so arbitrageurs can flatten any discount at any hour. It's also why BUIDL qualifies as derivatives margin — minutes to liquidate.",
    },
    {
      q: "Which of the following did BUIDL actually prove?",
      options: ["Retail investors can access tokenized Treasuries at low minimums", "Tokenization reduces the number of financial intermediaries", "The institutional pipeline works end to end: five traditional roles re-wired — register on-chain, settlement instant, redemption 24/7", "On-chain secondary markets can perform price discovery for fund shares"],
      answer: 2,
      explain: "The other three are exactly what BUIDL did NOT prove: it's QP-only (not retail), has more named intermediaries (not disintermediation), and almost no secondary market (not price discovery).",
    },
    {
      q: "How does BUIDL's monthly dividend mechanism work?",
      options: ["USDC is wired monthly to holders' bank accounts", "The share price rises daily to reflect accrued yield", "Dividends accrue daily and are paid monthly as new BUIDL tokens — balances grow, the price stays $1", "Yield auto-compounds into Ethena's USDtb"],
      answer: 2,
      explain: "Money-market-fund-style stable pricing plus rebase-style distribution (Stage 8.4): the price is pinned at $1 and yield shows up as token count.",
    },
    {
      q: "Why is 'BUIDL is TradFi wearing chain-native settlement — and that's exactly why it succeeded' a fair summary?",
      options: ["Because it quietly sidestepped regulation", "Because it changed no legal roles or structures — only the register and settlement layer — so regulators and institutions had to trust nothing new, letting it be the first to run compliantly", "Because TradFi technology was better all along", "Because it could run without a blockchain anyway"],
      answer: 1,
      explain: "Five roles untouched, all licensed; the innovation is compressed into the wiring. The least disruptive design is often the first one allowed through.",
    },
  ],

  further: [
    { label: "Securitize (BUIDL's transfer agent and tokenization platform)", url: "https://securitize.io" },
    { label: "BlackRock newsroom (search the BUIDL launch announcement)", url: "https://www.blackrock.com/corporate/newsroom" },
    { label: "RWA.xyz: live tokenized-Treasuries dashboard", url: "https://app.rwa.xyz/treasuries" },
    { label: "Circle (USDC and the redemption facility background)", url: "https://www.circle.com" },
    { label: "SEC: overview of exempt offerings (Reg D and friends)", url: "https://www.sec.gov/smallbusiness/exemptofferings" },
  ],
};
