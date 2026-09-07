export default {
  id: "case-ondo",
  stage: 10,
  order: 2,
  title: "Ondo OUSG & USDY: Two Wrappers, Two Audiences",
  difficulty: "mastery",
  prereqs: ["case-buidl", "investor-eligibility"],

  oneLiner:
    "Ondo turned the punchline of Stage 7.2's 'compliance geometry' into a company: from one underlying yield (US Treasury interest) it built two products with opposite legal designs — OUSG goes through Reg D to US institutions, its token a fund share; USDY goes through Reg S to non-US persons only, its token a secured note that, after a 40-plus-day lock, transfers freely and lives inside DeFi. The asset is identical; every difference lives in the step called 'who are you selling to.' Understand this pair and you understand an RWA issuer's real moat: not the ability to pick assets, but the ability to manufacture compliance-shaped wrappers.",

  intuition: `
Last lesson's BUIDL was "one product for one kind of customer." This lesson's Ondo Finance goes a step further and solves the same problem **twice**. Its only raw material is **interest on US Treasuries** — the most boring, most commoditized yield on earth. But it has two customer types: **US institutions** that want a compliant fund share, and **non-US users** who want "a dollar token that earns yield, transfers freely, and plugs into DeFi."

One asset, two audiences — what do you do? A normal company builds one product and picks a side. Ondo's answer: **build two completely different legal wrappers**. OUSG and USDY sit on nearly the same pile of Treasuries, yet one is a fund and the other a note; one is locked inside a whitelist forever, the other flies free after a lockup; one is for US qualified buyers only, the other **forbids** US persons entirely.

It is the most elegant live demonstration of "compliance geometry" in this course: **the degrees of freedom in product design live on the audience side, not the asset side.** Today we take both designs apart down to the screws.

**Here's the map — five parts:**

- **① One yield, two wrappers — Ondo's product philosophy**
- **② OUSG — a fund share for US institutions (with BUIDL inside)**
- **③ USDY — the inverted geometry: a secured note for non-US persons**
- **④ USDY vs rUSDY — same economics, two renderings**
- **⑤ The strategic reading and the honest risks — what the moat really is**
`,

  mechanics: `
### ① One yield, two wrappers: Ondo's product philosophy

First, recall Stage 7.2's core conclusion: there is no "globally valid" way to offer a security — only a **geometric map of exemptions**. Reg D faces US accredited/qualified investors (you may sell to Americans, but the bar is high and transfers restricted); Reg S faces offshore markets (the bar can be low, but US persons **must** be kept out). Most issuers pick **one** spot on the map and stand there.

Ondo's insight: since the underlying yield is a **commodity** (anyone's T-bill interest is the same), competition can't happen on the asset side — **it happens on the wrapper side**. So it occupied two points on the map at once:

- **OUSG**: the Reg D corner — US institutions, high minimums, tight restrictions, a fund share.
- **USDY**: the Reg S corner — non-US persons, lower bar, free transfer after a lockup, a secured note.

The two products share research, brand, and most of the back office, but their legal documents, token behavior, and target users are **entirely different**. Let's dissect them separately.

### ② OUSG: a fund share for US institutions (with BUIDL inside)

**OUSG** is positioned as "on-chain short-term Treasury exposure for institutions." Structurally it's a familiar exercise:

- **Legal shape**: a Reg D private placement for US institutional investors at accredited/qualified-purchaser level; the token = a **fund interest** (Stage 5.1's standard claim chain: token → fund share → fund assets).
- **The most interesting part is the underlying**: a substantial share of OUSG's assets sits in **tokenized Treasury funds** — including a **large BUIDL allocation**. Yes, you read that right: **a tokenized fund holding another tokenized fund**. This is the wrapper-stacking pattern — the upside is inheriting BUIDL's instant subscription/redemption liquidity; the cost is that **every layer charges a fee** (Ondo's management fee stacked on BlackRock's — exactly the arithmetic Stage 12.4 teaches you to run).
- **Price behavior**: **accumulating NAV** — no payouts; yield rolls into net asset value and the OUSG price climbs over time (the "price-appreciation" rendering from Stage 6.4).
- **Liquidity**: riding the underlying's (BUIDL's, among others) instant channels, OUSG offers **minute-level mint and redeem** against dollar stablecoins — wholesaling BUIDL's killer feature to its own clients.

One sentence for OUSG: **it is a "redistribution + enhancement layer" on BUIDL** — a somewhat lower entry ticket and smoother UX, at the price of one more fee layer and one more counterparty.

### ③ USDY: the inverted geometry — a secured note for non-US persons

**USDY** is the main course, because every design choice runs **opposite** to OUSG:

- **Who may buy**: **non-US persons only** (the Reg S offshore exemption, Stage 7.2). Americans can't buy — and more than that, the whole structure's validity rests on Americans genuinely being excluded.
- **What the token is**: not a fund share but a **secured note** — you are a **creditor** of the issuing entity **Ondo USDY LLC** (a bankruptcy-remote special-purpose entity, Stage 5.2). We walked this claim chain in Stage 5.1; here are the load-bearing parts again: a **collateral agent, Ankura Trust**, holds a **first-priority security interest** on behalf of all holders; the collateral is **short-term Treasuries + bank demand deposits**; the structure is **overcollateralized** — Ondo itself posts roughly a 3% first-loss equity cushion; a **collateral report** is published monthly.
- **The masterstroke — the 40–50 day lock**: freshly minted USDY carries a **transfer lock** of 40-plus days. Why? Reg S imposes a "distribution compliance period" to stop offshore-issued securities from flowing straight back into the US. Ondo wrote that legal clock **directly into the token contract** (Stage 7.3's "rules into code"). Once the lock expires, USDY transfers **freely** among non-US persons — no per-transfer whitelist.
- **The reward for that freedom**: precisely because it flows freely after the lock, USDY can do what OUSG and BUIDL cannot: **list on DEXes, enter lending protocols, serve as DeFi collateral** (Stage 9.3). For its audience it behaves less like a fund and more like a **yield-bearing stablecoin**.

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="ondo-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <text x="160" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="var(--orange-ink)">OUSG (Reg D · US institutions)</text>
  <rect x="40" y="40" width="240" height="44" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="160" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Investor = fund shareholder</text>
  <text x="160" y="74" text-anchor="middle" font-size="9.5" fill="var(--muted)">whitelisted transfers · accumulating NAV</text>
  <rect x="40" y="112" width="240" height="44" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="160" y="130" text-anchor="middle" font-size="11" font-weight="700" fill="var(--orange-ink)">OUSG fund</text>
  <text x="160" y="146" text-anchor="middle" font-size="9.5" fill="var(--muted)">equity-style claim (Stage 5.1)</text>
  <rect x="40" y="184" width="240" height="44" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="160" y="202" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Tokenized Treasuries (incl. BUIDL)</text>
  <text x="160" y="218" text-anchor="middle" font-size="9.5" fill="var(--muted)">fund-of-fund · fees stack on fees</text>
  <line x1="160" y1="84" x2="160" y2="112" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <line x1="160" y1="156" x2="160" y2="184" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <text x="480" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="var(--orange-ink)">USDY (Reg S · non-US only)</text>
  <rect x="360" y="40" width="240" height="44" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="480" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Investor = note creditor</text>
  <text x="480" y="74" text-anchor="middle" font-size="9.5" fill="var(--muted)">40+ day lock → free transfer · DeFi-usable</text>
  <rect x="360" y="112" width="240" height="44" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="480" y="130" text-anchor="middle" font-size="11" font-weight="700" fill="var(--orange-ink)">Ondo USDY LLC (bankruptcy-remote)</text>
  <text x="480" y="146" text-anchor="middle" font-size="9.5" fill="var(--muted)">debt-style claim · ~3% first-loss cushion</text>
  <rect x="360" y="184" width="240" height="44" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="480" y="202" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Collateral: Treasuries + bank deposits</text>
  <text x="480" y="218" text-anchor="middle" font-size="9.5" fill="var(--muted)">Ankura as collateral agent · first-priority · monthly reports</text>
  <line x1="480" y1="84" x2="480" y2="112" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <line x1="480" y1="156" x2="480" y2="184" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <text x="320" y="270" text-anchor="middle" font-size="11" fill="var(--muted)">One Treasury yield → two entirely different claim chains</text>
</svg>
</figure>

### ④ USDY vs rUSDY: same economics, two renderings

Stage 6.4 taught that whether yield shows up as "price going up" or "balance going up" is purely a **rendering choice** — the economics are identical. Ondo shipped that lesson as an actual product pair:

- **USDY**: accumulating — the price starts at $1 and climbs with yield; your balance never changes. Suits a **store-of-value** use: accounting and taxes stay simple.
- **rUSDY**: rebasing — the price is pinned at $1 and **your balance grows daily**. Suits a **payment/unit-of-account** use: contracts that assume "1 rUSDY = $1" need no special handling.

The two **convert into each other**; behind both sits the same note. One team shipping both skins is an official admission: **this is a front-end rendering choice, not financial engineering.**

### ⑤ The strategic reading and the honest risks: what the moat really is

Zoom out. Ondo's asset-selection skill is worth nothing scarce — buying T-bills takes no genius. Its real business is **distribution**: manufacturing the same commoditized yield into different compliance shapes, each fitted precisely to an audience the law has walled off. The moat = licenses + the compliance machine + an integration network of exchanges, wallets, and DeFi protocols — not investment skill. Its next move confirms the reading: Ondo is pushing tokenized **equities** for non-US users (the Global Markets / Ondo Chain ambitions) — the same Reg S geometry, translated from Treasuries to stocks (a trailer for Stage ∞.1).

The honest risk list, one product at a time:

- **OUSG**: **wrappers stacked on wrappers** — Ondo's fee sits on top of the underlying funds' fees, so the yield gets skimmed twice (Stage 12.4); and its liquidity is **borrowed** — if the underlying fund gates redemptions, OUSG jams with it.
- **USDY**: don't let "backed by Treasuries" lull you — legally you are a **creditor of a young company's issuing entity**, not a Treasury holder. The cushions are real (collateral agent + overcollateralization + monthly reports — read the documents! Stage 12.2), but a claim is a claim: if things break, you're in an enforcement process (Stage 5.4). And one cold fact: **US persons who sneak in are outside the architecture's protection** — Reg S's validity presumes their exclusion, so a smuggled-in US buyer may lack even the standing to assert rights.

If you take away one sentence: **Ondo doesn't sell Treasury yield — it sells compliance shapes: the same commoditized interest, poured into a fund shell for US institutions and a note shell for the rest of the world, with the whole moat built into the wrapping machine.**
`,

  demo: "ondo-compare",

  analogy: `
Picture a brewery that makes exactly one drink: **the plainest rice wine on earth** (Treasury interest). On paper there's no way to differentiate this business — until it hires a genius packaging designer.

For the **licensed private clubs** (US institutions), it pours the wine into **sealed crystal decanters**: each bottle registered in a ledger, transferable only between members with papers, never opened, its value rising as the wine ages (OUSG: whitelist + accumulating NAV). The clubs want precisely this "everything on file" format — their compliance officers accept no other bottle.

For the **street food stalls overseas** (non-US retail), it cans the very same vat into **pull-tab cans**: fresh cans rest in a bonded warehouse for 40 days first (the Reg S lock), and after that they can be sold, resold, and put on any restaurant's menu (DEXes and DeFi). Fine print on the bottom of the can: this drink is backed by a collateral cellar watched by a notary, and the brewery has posted a 3% deposit of its own (Ankura + overcollateralization).

The wine is one and the same vat, start to finish. **All the profit comes from the packaging lines** — and from the license that lets both packages leave the factory legally. Any brewery can make the same wine; almost none can build these two packaging lines. That's the moat.
`,

  misconceptions: [
    "“OUSG and USDY are two different assets.” —— The underlying is nearly identical: short-term US Treasury yield. What differs is the legal wrapper (fund share vs secured note) and the audience (US institutions vs non-US persons). All the difference is on the wrapper side, none on the asset side.",
    "“USDY holders own Treasuries.” —— No. You are a creditor of Ondo USDY LLC holding a secured note; the Treasuries are collateral, controlled by the collateral agent Ankura on holders' behalf. Debt + collateral ≠ direct ownership — if things break you go through enforcement (Stage 5.4).",
    "“USDY's 40-day lock is Ondo's anti-bank-run design.” —— It's a legal requirement: Reg S's distribution compliance period, preventing offshore issues from flowing straight back into the US. Ondo simply wrote the regulatory clock into the token contract (Stage 7.3). Free transfer after expiry is exactly why USDY can live in DeFi.",
    "“A US person sneaking into USDY just takes the same risk as everyone else.” —— Worse. The entire Reg S architecture's validity rests on excluding US persons; a smuggled-in US buyer may sit outside the protective structure altogether, possibly without even the standing to assert rights.",
    "“OUSG holds BUIDL, so it inherits BlackRock's safety for free.” —— It inherits the liquidity, and also the fees: Ondo's management fee stacks on BlackRock's — two wrappers, two tolls (Stage 12.4). And OUSG's instant mint/redeem depends on the underlying channels — if they gate, OUSG jams too.",
    "“rUSDY yields more, since the balance grows every day.” —— The yield is identical. USDY renders it as price appreciation, rUSDY as balance growth — two renderings of the same note (Stage 6.4), mutually convertible. The choice is purely about accounting and integration habits.",
  ],

  quiz: [
    {
      q: "What is the most fundamental difference between OUSG and USDY?",
      options: ["OUSG holds Treasuries, USDY holds corporate bonds", "Same underlying yield, opposite legal wrappers: OUSG is a Reg D fund share for US institutions; USDY is a Reg S secured note for non-US persons only", "OUSG lives on Ethereum, USDY on other chains", "OUSG yields more"],
      answer: 1,
      explain: "This is compliance geometry in production: one asset, two compliance shapes manufactured per audience. The difference is in the wrapper, not the asset.",
    },
    {
      q: "What is a USDY holder's legal position?",
      options: ["Direct owner of Treasuries", "Shareholder of the OUSG fund", "Creditor of Ondo USDY LLC — holding a secured note backed by overcollateralization, with collateral agent Ankura holding a first-priority security interest", "Shareholder of Ondo the company"],
      answer: 2,
      explain: "Stage 5.1's debt chain: your claim runs against a bankruptcy-remote issuer; Treasuries and bank deposits are collateral; Ankura controls the security interest for all holders.",
    },
    {
      q: "Where does USDY's 40–50 day transfer lock on new tokens come from?",
      options: ["Ondo's anti-run risk control", "The legal requirement of Reg S's distribution compliance period — preventing immediate flow-back into the US — written directly into the token contract", "Ethereum network congestion", "The collateral agent's processing time"],
      answer: 1,
      explain: "A textbook case of 'regulation into code' (Stage 7.3): the lock enforces a legal clock on-chain. After expiry, free transfer — which is what lets USDY onto DEXes and into DeFi.",
    },
    {
      q: "What is the relationship between USDY and rUSDY?",
      options: ["Two different funds", "Two renderings of the same note: USDY's price climbs with a fixed balance; rUSDY pins $1 while balances grow daily — identical yield, mutually convertible", "rUSDY is a leveraged version of USDY", "rUSDY is for US persons"],
      answer: 1,
      explain: "Stage 6.4's 'same economics, two renderings' shipped as an actual product pair — the choice is purely accounting and integration preference.",
    },
    {
      q: "Why is Ondo essentially a distribution company?",
      options: ["Because its investment skill is the strongest", "Because the underlying yield is a commodity (T-bill interest); its moat is licenses, compliance machinery, and integrations — manufacturing one yield into different compliance shapes for legally separated audiences", "Because it holds no assets", "Because it only does marketing"],
      answer: 1,
      explain: "Buying T-bills takes no genius; legally delivering that yield to both US institutions and global non-US users does. Translating the same geometry to equities (Global Markets) confirms the reading.",
    },
  ],

  further: [
    { label: "Ondo Finance (OUSG and USDY product pages)", url: "https://ondo.finance" },
    { label: "Ondo docs (structure, collateral, and monthly report entry points)", url: "https://docs.ondo.finance" },
    { label: "SEC: overview of exempt offerings (official entry for Reg D / Reg S)", url: "https://www.sec.gov/smallbusiness/exemptofferings" },
    { label: "RWA.xyz: tokenized Treasuries data (compare OUSG/USDY/BUIDL sizes)", url: "https://app.rwa.xyz/treasuries" },
  ],
};
