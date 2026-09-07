export default {
  id: "token-vs-claim",
  stage: 5,
  order: 1,
  title: "You Don't Own the Asset — You Own a Claim on It",
  difficulty: "systems",
  prereqs: ["token-lifecycle"],

  oneLiner:
    "When you buy an RWA token, you almost never buy the asset itself — you buy the top link of a chain of claims: your token → an instrument issued by some legal entity (a fund share / LLC unit / promissory note) → and it's that entity that actually holds the asset. Every arrow in the chain is a legal document, and every document has terms. The one habit that separates an expert from a beginner: given any RWA, trace the chain all the way down to the real asset, and see how many layers sit in between and what each one legally is — because how much you recover in a bankruptcy, whether the yield is yours, and whether you can redeem are all written into those layers.",

  intuition: `
Start with a small experiment. Suppose you hold 1 BUIDL (BlackRock's tokenized Treasury fund token) and 1 PAXG (Paxos's gold token), and someone asks: “what exactly do you **own**?”

Most people would answer “Treasuries” and “gold.” Both answers are wrong — and wrong in different ways. Holding BUIDL, you are a **shareholder of a BVI fund**, and it's the fund that holds the Treasuries; holding PAXG, you really do hold **title to a number of fine troy ounces** on a specific bar in a London vault. Both are called “RWA tokens,” yet one is **equity** and the other is **property title** — and your treatment in bankruptcy, your right to the yield, and your right to redeem are all different.

This is the opening move of this stage, and the pivot point of the whole course. From Stages 0–4 you already know: **the token is a receipt — the trust lives in the off-chain structure** (Stage 1.2 showed the token is on-chain while the asset isn't). Starting with this lesson, we flip that receipt over and read the fine print on the back, word by word: what exactly does this receipt **entitle you to demand**, from **whom**, under **which document**? The ability to read that fine print is an RWA expert's first hard skill.

There is only one method, but it must become muscle memory: **trace the chain of claims, layer by layer, until you hit the real asset**. At every layer, ask three questions — what is this layer? Which document creates it? Where can it break?

**Here's the map — 5 parts:**

- **① The chain of claims: the universal anatomy of every RWA token**
- **② Four real products, four different chains: BUIDL, USDY, PAXG, RealT**
- **③ The day the differences cash out: bankruptcy, yield, redemption & liquidation**
- **④ The answer always lives in the same place: “What you are purchasing”**
- **⑤ Why issuers each pick a different wrapper**
`,

  mechanics: `
### ① The chain of claims: the universal anatomy of every RWA token

Whatever the marketing page says, every RWA product's legal structure can be drawn as the same layered diagram, starting from you and ending at the asset:

- **Layer 1 · You**: a holder who has passed KYC (Stage 7.1).
- **Layer 2 · The token**: a balance entry on a chain (Stage 2.4). By itself it *is* nothing; it only **represents** the layer below.
- **Layer 3 · The legal instrument**: the **legal nature** of what the token represents — a fund share (you're a shareholder), a promissory note (you're a creditor), a trust interest or direct title (you're an owner), or LLC membership units (you're a member). This layer is created by the **offering documents**: subscription agreement, fund constitution, note terms, trust deed.
- **Layer 4 · The issuing entity**: the legal person that actually “holds the asset” — a fund, an SPV, a trust (Stage 5.2 is all about building one that can't collapse).
- **Layer 5 · The asset itself**: Treasuries, gold bars, a house, loans.
- **Layer 6 · The custody location**: where the asset physically / administratively sits — a custodian bank, a vault, a land registry (Stage 3.4).

<figure><svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="tvc-arrow-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-line)"/></marker></defs><rect x="180" y="12" width="280" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="34" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">You (KYC-passed holder)</text><rect x="180" y="60" width="280" height="34" rx="8" fill="var(--green-soft)" stroke="var(--line)"/><text x="320" y="82" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">Token (a balance entry on-chain)</text><rect x="180" y="108" width="280" height="34" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="320" y="130" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">Instrument: share? note? title? units?</text><rect x="180" y="156" width="280" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="178" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">Issuing entity (fund / SPV / trust)</text><rect x="180" y="204" width="280" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="226" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">Asset (Treasuries / gold / house / loans)</text><rect x="180" y="252" width="280" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="274" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">Custody (custodian / vault / registry)</text><line x1="320" y1="46" x2="320" y2="58" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tvc-arrow-en)"/><line x1="320" y1="94" x2="320" y2="106" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tvc-arrow-en)"/><line x1="320" y1="142" x2="320" y2="154" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tvc-arrow-en)"/><line x1="320" y1="190" x2="320" y2="202" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tvc-arrow-en)"/><line x1="320" y1="238" x2="320" y2="250" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tvc-arrow-en)"/><text x="490" y="82" font-size="10" fill="var(--muted)">↑ every arrow =</text><text x="490" y="96" font-size="10" fill="var(--muted)">one legal document</text><text x="490" y="130" font-size="10" fill="var(--orange-ink)" font-weight="700">← the key layer</text><text x="30" y="130" font-size="10" fill="var(--muted)">subscription agreement /</text><text x="30" y="144" font-size="10" fill="var(--muted)">constitution / note terms / trust deed</text></svg></figure>

See one thing clearly: **every arrow is a legal document, and every document has terms**. The “token → instrument” arrow is written in the offering documents; the “entity → asset” arrow is written in purchase contracts and custody agreements. Wherever a document leaves a gap, that's where the chain can break. Layer 3 is the crux of this lesson: **for the very same token, a different instrument type gives you a completely different legal identity**.

### ② Four real products, four different chains

Take four real products (structures from public offering documents, simplified here) and walk each chain.

**BUIDL — you are a shareholder.** The BlackRock USD Institutional Digital Liquidity Fund, a fund **incorporated in the British Virgin Islands (BVI)** (launched March 2024, roughly $2–3B by 2025). The chain: your BUIDL token → a **fund share** (you're on the register — a shareholder of this fund) → the fund holds cash, short-term Treasuries and repos → custodied at BNY Mellon. The most distinctive feature: Securitize, as **transfer agent**, has **tokenized the shareholder register itself** — on-chain holdings are synchronized with the legal share register (the legal weight of that move is Stage 5.3's topic). Entry bar: Qualified Purchasers, Reg D private placement, $5M minimum (Stage 7.2, Stage 10.1).

**USDY — you are a creditor.** Ondo's USDY is not a fund share but a **secured promissory note**: the issuer is Ondo USDY LLC, and you are **lending money** to that company, which hands you an interest-bearing IOU — tokenized. The collateral is short-term Treasuries and bank deposits, with an **independent collateral agent (Ankura Trust)** holding a first-priority security interest on behalf of all holders — empowered to seize and liquidate the collateral for you if the issuer defaults (the process lives in Stage 5.4). Offered to non-US persons (Reg S), with a 40-plus-day transfer lock after minting (Stage 10.2). Remember your identity: **creditor, not owner** — the assets aren't yours; you merely stand near the front of the secured queue.

**PAXG — you come close to direct title.** Paxos Gold is issued by a trust company **regulated by the New York Department of Financial Services (NYDFS)**: 1 PAXG = 1 fine troy ounce of **allocated** physical gold on a London Good Delivery bar. You hold **title** to a specific part of a specific bar — you can look up the serial number and redeem the metal. This is the rare “ultra-short chain” in RWA: token → title → bar, with no “issuer balance sheet” layer in between — the gold is not a Paxos asset, so in a Paxos bankruptcy it should in principle sit outside the estate (Stage 10.5 goes deeper).

**RealT — you are an LLC member.** A Detroit rental house → placed into a **series LLC dedicated to that one house** (Stage 5.2) → token = **membership units** of that LLC. The house belongs to the LLC; you are a member of the LLC, and rent is distributed to members (fractions around $50, weekly rent in USDC). Note: LLC membership units carry the **fewest built-in protections** of the four — no collateral agent, no fund regulatory framework; your rights are whatever the LLC operating agreement says (Stage 10.4 covers the potholes it hit).

### ③ The day the differences cash out: bankruptcy, yield, redemption & liquidation

On ordinary days the four tokens look identical: they transfer on-chain, hold a stable price, pay a yield. The differences cash out on the **bad day** —

- **When the issuer goes bankrupt**: BUIDL holders are fund shareholders — the fund's assets are segregated from BlackRock's and Securitize's own balance sheets, and a fallen manager can be replaced; USDY holders are **secured creditors**, ahead of unsecured ones, paid from collateral liquidated by Ankura — but through a creditor process measured in months; PAXG holders assert **title** — in principle they take back their own gold and never join the bankruptcy distribution; RealT holders' fate depends on **who exactly failed** — the LLC still owns the house, but if the operator RealT-the-company fails, who manages the property and sends the rent becomes the open question (exactly the “service-provider failure” of Stage 5.2).
- **Who gets the yield**: BUIDL pays daily dividends as newly minted tokens (a shareholder distribution); USDY's yield shows up as a **daily-rising redemption price** (interest rolled into the note); PAXG has no yield — gold bears no interest, you earn the gold price; RealT distributes **rent minus expenses** — a vacancy or a new roof directly shrinks your “yield.”
- **Redemption rights**: BUIDL redeems against the fund at NAV; USDY is repaid by the issuer per the note terms; PAXG is redeemable for physical bars (minimums and fees apply); RealT has essentially **no redemption** — you can only find a buyer on a secondary market (the liquidity problem of Stage 9.2).
- **What 1 token is worth in liquidation**: BUIDL ≈ fund net assets ÷ shares (Stage 3.3's NAV formula); USDY ≈ collateral liquidation value ÷ principal-plus-interest — full if sufficient, pro-rata if not; PAXG ≈ the market price of your share of the bar; RealT ≈ that one house's auction price minus liquidation costs ÷ units.

One line to compress the four chains: **BUIDL = shareholder, USDY = creditor, PAXG = title holder, RealT = LLC member**. Four words, four entirely different legal treatments.

### ④ The answer always lives in the same place: “What you are purchasing”

The good news: issuers are **obligated to put all of the above in writing**. The offering memorandum / private placement memorandum almost always has a section titled something like **“What you are purchasing”** or “The Offering.” In a sentence or two of legal language, it answers the Layer-3 question precisely — e.g. “each token represents one share of the Fund” or “the token is a secured debt obligation of the Issuer.”

When reading, watch for three words: **share → you're a shareholder; note / debt → you're a creditor; title / allocated → you hold property rights**; plus one more, **membership interest → you're an LLC member**. The full craft of reading offering documents is trained in Stage 12.2; for now, build the reflex: **facing any RWA, your first move is to open that section** — not to look at the yield.

### ⑤ Why issuers each pick a different wrapper

One last puzzle piece: these structures aren't random — they're computed by the issuer under three constraints: **regulation, audience, and asset type**. The fund wrapper (BUIDL) is heavy and expensive, but regulators and institutional investors **know it in their sleep** — an institutional treasury must clear internal compliance, and a proper fund with a manager, administrator, custodian, and auditor clears committee most easily. The note wrapper (USDY) is far more flexible: no registered fund needed, can reach non-US retail (Reg S), and the yield rolls straight into the redemption price — the cost is that holders are only creditors, so credit must be propped up with collateral plus a collateral agent. The trust-plus-title wrapper (PAXG) suits **commodities**: gold has a century-old tradition of allocated custody, and an NYDFS trust charter is exactly what makes “token = title to the bar” stick. The series LLC (RealT) is the **poor man's SPV** — a house worth a few tens of thousands of dollars can't carry a fund's cost structure, while a new series opens for a few hundred dollars (expanded in Stage 5.2).

If you take away one sentence: **given any RWA token, trace the chain of claims down to the real asset — whether you're a shareholder, a creditor, a title holder, or an LLC member decides which queue you stand in on the bad day.**
`,

  demo: "claim-chain",

  analogy: `
Think of RWA tokens as four kinds of **coat-check tickets**. You check the same coat at four different venues and receive four nearly identical slips — but the fine print on the back differs completely.

The first venue is a **grand theater's cloakroom** (BUIDL): the ticket says “redeemable for the garment you deposited,” the cloakroom has staff, a register, and insurance, and if the theater goes under, the cloakroom's contents aren't part of the theater's estate. The second is a **pawnshop** (USDY): you've actually *lent* your coat to the shop in exchange for an interest-bearing pawn ticket — the coat is temporarily the shop's, and you are its creditor; fortunately there's collateral behind the ticket, and a notary watches the warehouse on behalf of all ticket holders.

The third is a **numbered self-service locker** (PAXG): the coat sits in locker 37, your ticket maps to that locker's key, and even if the mall goes bankrupt nobody can touch what's in your locker — that's title. The fourth is a **small coat-check shop co-bought by a few friends** (RealT): your “ticket” is actually shares in the shop; the coats belong to the shop and you split its profits — if the shopkeeper vanishes, the coats are still there, but who unlocks the door tomorrow is anyone's guess.

All four slips feel identical in your hand; **the difference is entirely in the fine print and the structure behind the counter**. What an RWA expert does is simple: every time they're handed a slip, they flip it over and read the back first.
`,

  misconceptions: [
    "“I bought a tokenized Treasury token, so I hold US Treasuries.” —— Almost never. You typically hold shares in, or claims against, the entity that holds the Treasuries. The bonds are registered to the fund / SPV, not to you. The difference only shows on bankruptcy day — and that day is too late to learn it.",
    "“BUIDL and USDY are both tokenized Treasury products, so legally they're the same thing.” —— Entirely different. BUIDL holders are shareholders of a BVI fund; USDY holders are secured creditors of Ondo USDY LLC. One is equity, one is debt — different bankruptcy priority, yield mechanics, and regulatory frame.",
    "“More layers in the chain means more safety, because the structure is 'more complete.'” —— Layer count is not safety; each layer can be a firewall or a break point. PAXG's ultra-short chain is what delivers near-direct title. Don't count layers — ask what document creates each one and where it can break.",
    "“The token is in my wallet, so I control the asset.” —— You control the receipt, not the asset. The asset sits with a custodian / vault / LLC, and whether you can reach it depends on the Layer-3 instrument's rights and the Layer-4 entity's survival. This is the literal meaning of 'the token is a receipt.'",
    "“Which legal wrapper the issuer picks is a technical detail investors can ignore.” —— The wrapper is precisely what sets your legal identity. Fund = familiar regulated frame; note = flexible but you're only a creditor; trust = title; LLC = fewest protections. The issuer did the math before choosing — you should too.",
  ],

  quiz: [
    {
      q: "Holding USDY, what is your legal identity?",
      options: ["A shareholder of an Ondo fund", "A direct owner of US Treasuries", "A secured creditor of Ondo USDY LLC — holding a tokenized promissory note collateralized by Treasuries and deposits", "A creditor of the US Treasury Department"],
      answer: 2,
      explain: "USDY is a secured promissory note: you lend to Ondo USDY LLC, collateralized by Treasuries and bank deposits, with Ankura as collateral agent holding the security interest for holders. You are a creditor, not an owner.",
    },
    {
      q: "Of the four products, whose holder comes closest to direct property title over the asset?",
      options: ["BUIDL — BlackRock has the best reputation", "PAXG — 1 token maps to title over 1 fine troy ounce of allocated gold on a specific bar", "USDY — it has a collateral agent", "RealT — you can physically see the house"],
      answer: 1,
      explain: "PAXG uses an NYDFS-regulated trust structure with allocated bars: you hold title to a specific part of a specific bar, can check the serial number, and can redeem metal. The other three all have an entity in between: a fund, an LLC, a series LLC.",
    },
    {
      q: "In 'trace the chain of claims to the asset,' what is each arrow, fundamentally?",
      options: ["An on-chain transfer", "A legal document with terms — a subscription agreement, constitution, note terms, trust deed, or custody agreement", "A smart-contract call", "A regulatory approval"],
      answer: 1,
      explain: "Token→instrument, instrument→entity, entity→asset: each arrow is created and bounded by a document. Where the terms leave a gap, the chain can break — which is why experts read documents, not whitepapers.",
    },
    {
      q: "To confirm what an RWA token legally IS, where is the primary source?",
      options: ["The project's Twitter and landing page", "Comments in the token contract", "The offering documents' “What you are purchasing / The Offering” section", "The CoinGecko product blurb"],
      answer: 2,
      explain: "The offering memorandum almost always has a section defining precisely what the token represents. Watch the keywords: share = shareholder, note = creditor, title/allocated = property rights, membership interest = LLC member. Stage 12.2 trains the full reading craft.",
    },
    {
      q: "On the day the issuer fails, which statement about the four instrument types is correct?",
      options: ["All four kinds of holders are treated alike, pro-rata by holdings", "Shareholders (BUIDL) always get paid first", "Title holders (PAXG) in principle take back their own gold outside the bankruptcy; creditors (USDY) go through a collateral process measured in months", "LLC members (RealT) have the highest priority"],
      answer: 2,
      explain: "Title means 'the thing is yours and not part of the estate'; secured creditors rank ahead of unsecured but must run the process; fund shareholders rely on asset segregation; LLC members depend most on the operating agreement. Identity decides your queue.",
    },
  ],

  further: [
    { label: "Securitize: BlackRock BUIDL fund page (structure & document access)", url: "https://securitize.io/BUIDL" },
    { label: "Ondo Finance: USDY official docs (note structure, collateral & eligibility)", url: "https://docs.ondo.finance/" },
    { label: "Paxos: PAXG official page (NYDFS trust, allocated bars & redemption)", url: "https://www.paxos.com/paxg" },
    { label: "RealT: How It Works (series LLC & membership-unit structure)", url: "https://realt.co/how-it-works/" },
    { label: "SEC: Framework for 'Investment Contract' Analysis of Digital Assets", url: "https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets" },
  ],
};
