export default {
  id: "case-failures",
  stage: 10,
  order: 6,
  title: "What the Dead Projects Teach Us",
  difficulty: "mastery",
  prereqs: ["case-real-estate"],

  oneLiner:
    "This lesson is a tour of the morgue: six bodies, five cause-of-death labels, and every label maps precisely onto one layer of this course's stack. Aspen Coin died of no secondary demand, the fake farm tokens of a missing legal wrapper, UST of a reflexive peg, Celsius of regulation and non-segregation together, and tokenized carbon credits of a single decree from a registry. Read that table backwards and you get the shared profile of the 2024–25 survivors (BUIDL, Ondo, PAXG). The autopsy report is one sentence long: **every corpse is the absence of one chapter of this course**.",

  intuition: `
The most useful genre of writing in financial history is the autopsy report.

Living projects tell stories — vision, partnerships, a “trillion-dollar market.” Dead projects tell no stories; they leave behind a **medical chart** you can check line by line: which block was missing from the structure diagram, which promise went unkept, which day the volume went to zero. What you learn from a successful project is usually survivorship bias. What you learn from a corpse is a **necessary condition**.

And these causes of death aren't random. Lay out every major failure in RWA and RWA-adjacent finance since 2017 and you'll find they fall **neatly into five drawers** — and those five drawers happen to be five layers you have already studied: the legal wrapper (Stage 5), the definition of reserves and pegs (Stage 4), distribution and secondary liquidity (Stage 9), regulation and compliance (Stages 7/11), and the least glamorous but most lethal layer of all — off-chain operations (the Detroit lesson of Stage 10.4).

So this lesson is shaped like a mortuary table: you lift each sheet, read the evidence, and **attach the cause-of-death label yourself**. Master that motion and you have the core craft of this course — Stage 12 will forge it into a formal diligence toolkit.

**Here's the map — six parts:**

- **① Cause one: no secondary demand — how the 2017–19 STO wave died together**
- **② Cause two: a missing or fake wrapper — the chain breaks at link one**
- **③ Cause three: a reflexive peg — when the “reserve” is a coin you print**
- **④ Cause four: killed by the regulator — unlicensed yield products**
- **⑤ Cause five: operational collapse — could mint, couldn't manage**
- **⑥ Invert the table: the survivor profile**
`,

  mechanics: `
### ① Cause one: no secondary demand — how the 2017–19 STO wave died together

Around 2018, "security token offerings (STOs)" were proclaimed the next trillion-dollar arena. The core narrative: tokenize illiquid assets — hotels, buildings, artworks — and liquidity will follow. In hindsight, that wave was **almost entirely wiped out**, and the cause of death is remarkably uniform.

**Specimen A: Aspen Coin (2018).** The St. Regis resort in Aspen, Colorado, tokenized part of its equity and raised roughly **$18 million**. Note this: **the issuance succeeded** — compliance done, Reg D followed, money in the door. And then? Then came years of **near-zero trading volume**. Holders owned fractions of a five-star resort's equity and could not find a second person to take them.

**Specimen B: tZERO.** This was the generation's flagship — a security-token exchange (an ATS) incubated by the public company Overstock, expected to become "the Nasdaq of security tokens." The outcome: chronically thin order books, repeated layoffs, and a business that kept contracting and pivoting.

Diagnosis: **they built issuance without distribution**. Slicing an asset into fractions is a **supply-side** move; what a market needs is the **demand side** — a population of eligible, willing, funded buyers, plus the channels that put the asset in front of them (brokers, advisors, institutional allocation processes). Stage 9.1 covered holder-base homogeneity; here is its terminal form: **the buyer count is approximately zero**. Layer on Stage 10.4's **liquidity illusion** — slicing a hotel multiplies holders, not buyers.

The wave's structural error compresses to one line: **they believed "tokenize it and liquidity will come."** Liquidity was never a property of the token; it is a property of **the market**.

### ② Cause two: a missing or fake wrapper — the chain breaks at link one

Stage 5.1 taught the claim-chain audit: start at the token and ask, link by link, "what legal document supports this link?" Run that method and the following class of projects **exposes itself within minutes**.

A textbook case: a platform sells "tokenized real estate" with photos of houses, rent projections, and an APY figure on the landing page. Ask three questions: to whom was the deed transferred? Is there an SPV/LLC? What does the token legally represent? The answers come back — **the deed is still in the founder's name (or the house hasn't been bought), there is no special purpose entity at all, and the token is legally nothing but an unsecured IOU written by a startup**. That isn't "a simple structure"; that is **a chain with no first link**: when things go wrong you are not a property interest holder, you are an ordinary creditor of a bankrupt small company, queued behind payroll and the tax authority.

One notch more extreme: **exit-scam "RWAs"** — agricultural tokens, mining tokens, plantation tokens, where **the token was real (verifiable on-chain) and the farm was not**. In Stage 1.3's framework: the trust bridge had **not a single pillar** — no independent custody, no third-party audit, no legal entity, no verifiable off-chain fact whatsoever. And "verifiable on-chain" verifies only the existence of the token; it **never** verifies the existence of the asset. Which is this whole course's reason for existing: the token is a receipt — the trust lives in the off-chain structure.

The diagnostic mantra: **ask "what is this token in a bankruptcy court" before you ask about the yield**. Reverse that order and you become material for the next autopsy report.

### ③ Cause three: a reflexive peg — when the "reserve" is a coin you print

**Terra UST, May 2022.** Strictly speaking UST was not an RWA, but it was sold to the world as a stable asset, and its manner of death offers RWA students the sharpest definitional line available — so it goes on the table.

The mechanism: UST was an **algorithmic stablecoin**, holding its $1 peg through two-way mint-and-burn with its sibling token **LUNA** — 1 UST could always be swapped for $1 worth of LUNA and vice versa. It looks like a closed arbitrage loop; it is in fact a **reflexive** structure: UST's "reserve" was LUNA, and LUNA's value came from market confidence in the UST system. Confidence falls → LUNA falls → backing weakens → confidence falls further. In one week of May 2022 that feedback loop ran to completion: **north of $40 billion evaporated**, UST to zero, LUNA to zero.

The definitional lesson (carve this one in): **if the "reserve" is endogenous, it is not a reserve**. Stage 4.1's stablecoin taxonomy line stops being a textbook distinction here and becomes a mortality line — the difference between fiat-reserved (real off-chain dollars, real T-bills, a redemption right) and algorithmic is not "two schools of thought," it is **whether an off-chain asset and an enforceable redemption claim exist at all**. RWA's entire value proposition lives on the other side of that line.

Note one side effect too: UST's collapse took down Anchor (that 20% yield), took down a batch of leveraged institutions (the borrower-default chain in Stage 10.3's Maple story starts right here), and incidentally killed Mirror Protocol's synthetic stocks — which we'll meet again in ④.

### ④ Cause four: killed by the regulator — unlicensed yield products

**BlockFi and Celsius**: two companies that sold "crypto interest-bearing accounts" to retail users. The SEC and state regulators found these yield products constituted **unregistered securities offerings** — BlockFi settled in 2022 for a nine-figure sum and eventually went bankrupt; Celsius froze withdrawals in July 2022 and filed for bankruptcy.

Celsius deserves its own dissection because it **died twice**: once from regulation, once from **the absence of segregation** (Stage 5.2). Users believed they were "depositing money"; legally they had transferred ownership of their assets to Celsius — in bankruptcy the court found Earn account assets belonged to the estate, making users **unsecured creditors** who queued for years and recovered only a fraction. That is the segregation lesson in cash form: **"there are 3 BTC in my account" and "Celsius owes me 3 BTC" are two different species in a bankruptcy court** (structurally identical to allocated vs unallocated gold in Stage 10.5).

Two more bodies share the drawer: **tokenized stock experiments** — stock tokens and synthetics from Binance, Robinhood and others were delisted or shut down, while Mirror Protocol's synthetic stocks died **both from Terra's collapse and from the SEC's posture on synthetic securities**; and **European interventions against unlicensed offerings**, such as Germany's BaFin ordering issuance halted and marketing materials withdrawn.

The diagnostic point: regulatory death is **rarely an ambush**. These products stood on all four prongs of the Howey test (Stage 11.1) from day one; the industry simply chose not to look. **A license and distribution eligibility are not a cost line — they are a survival condition.**

### ⑤ Cause five: operational collapse — could mint, couldn't manage

The least glamorous layer, and the one engineers most reliably overlook: **somebody has to do the work.**

Stage 10.4's Detroit case already laid out the prototype: token fine, contract fine, rent zero — because the property manager went dark, the house landed on a municipal enforcement list, and the property taxes went unpaid. Generalize it and you have RWA's operational cause of death: **sponsors are good at minting and bad at collecting rent, filing taxes, chasing arrears, reporting, and handling disputes, year after year**. That isn't technical debt; it's debt in people and process, and it accrues interest daily.

Another body in the same drawer comes from Stage 10.5: **tokenized carbon credits**. Toucan/KlimaDAO bridged large volumes of credits on-chain, after which the underlying registry, **Verra, prohibited** the tokenization of issued credits outright in 2022 — one sentence from an off-chain registry, and the tokens on the bridge became orphans overnight. Which flags a variant of operational collapse: **your operations depend on an off-chain institution you do not control, and it can change the rules whenever it likes**.

<figure><svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><text x="320" y="22" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="bold">Five cause-of-death labels ↔ five layers of the course (one to one)</text><rect x="20" y="40" width="270" height="34" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="34" y="61" font-size="11" fill="var(--ink)">① No secondary demand (Aspen · tZERO)</text><rect x="350" y="40" width="270" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="364" y="61" font-size="11" fill="var(--muted)">Missing: Stage 9 distribution &amp; liquidity</text><rect x="20" y="82" width="270" height="34" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="34" y="103" font-size="11" fill="var(--ink)">② No legal wrapper (fake farm tokens)</text><rect x="350" y="82" width="270" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="364" y="103" font-size="11" fill="var(--muted)">Missing: Stage 5 claim chain &amp; SPVs</text><rect x="20" y="124" width="270" height="34" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="34" y="145" font-size="11" fill="var(--ink)">③ Reflexive peg (UST / LUNA)</text><rect x="350" y="124" width="270" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="364" y="145" font-size="11" fill="var(--muted)">Missing: Stage 4 real reserves &amp; redemption</text><rect x="20" y="166" width="270" height="34" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="34" y="187" font-size="11" fill="var(--ink)">④ Killed by regulator (Celsius · BlockFi)</text><rect x="350" y="166" width="270" height="34" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="364" y="187" font-size="11" fill="var(--muted)">Missing: Stage 7/11 compliance + 5.2 segregation</text><rect x="20" y="208" width="270" height="26" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="34" y="225" font-size="11" fill="var(--ink)">⑤ Ops collapse (Detroit · carbon)</text><rect x="350" y="208" width="270" height="26" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="364" y="225" font-size="11" fill="var(--muted)">Missing: Stage 8/10 servicing &amp; registry reliance</text></svg></figure>

### ⑥ Invert the table: the survivor profile

Now for the most valuable move in the lesson: **take the complement of the list**. If every corpse was missing a layer, then the projects still alive and growing as of 2025 should have **every layer**. Check BUIDL (Stage 10.1), Ondo (Stage 10.2), and PAXG (Stage 10.5):

- **A real, yield-bearing, standardized underlying asset**: Treasuries, money market instruments, London Good Delivery bars — not unique objects requiring on-site maintenance. (Cures ①⑤)
- **A genuine legal wrapper**: a BVI/Cayman fund or Delaware SPV, a New York trust company, explicit bankruptcy remoteness and a redemption claim. (Cures ②)
- **Exogenous, verifiable reserves**: real assets off-chain, with a custodian, attestations, and proof-of-reserve feeds. (Cures ③)
- **Licensed distribution**: a transfer agent, ATS/broker channels, Reg D/S compliance geometry, a KYC'd holder register. (Cures ④)
- **A primary-market liquidity engine**: a mint/redeem window at NAV — the true source of RWA liquidity, rather than hoping a secondary order book deepens (Stage 9.4). (Cures ①)
- **Excruciatingly boring operational excellence**: daily NAV, dividends on time, monthly reports, six years without incident. (Cures ⑤)

See it? **This survivor profile is the negative image of Stage 13's design guide.** Every grave in the yard corresponds to one line on the design checklist.

Finally, the meta-rule for your own diligence: **every dead project failed a question this course has already taught you to ask**. Aspen couldn't answer "who is the second buyer?" The fake farm couldn't answer "what is this token in a bankruptcy court?" UST couldn't answer "is the reserve exogenous?" Celsius couldn't answer "are my assets segregated?" You can now ask all of them. Stage 12 turns them into a formal checklist you can tick line by line.

If you take away one sentence: **the autopsy report reads the same every time — every corpse is the absence of one chapter of this course.**
`,

  demo: "failure-autopsy",

  analogy: `
Picture the archive room of an air accident investigation bureau. Photographs of dozens of wrecked aircraft line the walls, and pinned beneath each one is a card naming the **determined cause**: icing, metal fatigue, fuel exhaustion, instrument misreading, crew communication breakdown.

A layperson looking at those photos sees "planes fall out of the sky, how terrifying." An investigator sees something entirely different: **a manual explaining why planes usually don't**. Each accident pinpointed one system that was missing or failed — and after each one, the checklist grew by a line. Modern aviation's safety record is those cards, stacked one at a time.

The RWA graveyard is the same archive room. Aspen Coin is fuel exhaustion (a beautiful takeoff, with no arithmetic on whether a destination airport existed). The fake farm token never had an engine (an immaculate fuselage with nothing inside). UST tried to use its own wing as a runway. Celsius neither filed a flight plan nor fastened its seatbelt. They are not evidence that "crypto is scary"; they are **five items on a checklist**.

Which means the most important skill for a pilot isn't remembering how gruesome a particular crash was — it's **walking the checklist line by line before every takeoff**. The first eleven stages of this course handed you that checklist; this lesson makes you match each line to a body by hand, so you'll never be tempted to skip one.
`,

  misconceptions: [
    "“These projects died, so RWA is a scam.” —— The opposite: they died from a missing layer of infrastructure, not because tokenization doesn't work. Contemporaries with every layer in place — BUIDL, Ondo, PAXG — are doing fine. The graveyard is the negative image of a design checklist, not a verdict on the industry.",
    "“UST was a failed RWA attempt.” —— UST was never an RWA: no off-chain asset, no redemption claim on any off-chain asset, and a “reserve” consisting of its own LUNA (an endogenous reserve). Its value to you is precisely that it draws the definitional line (Stage 4.1) — an endogenous reserve is not a reserve.",
    "“Celsius users had their money stolen by hackers.” —— No. Users transferred ownership of their assets to Celsius in the terms, and the assets were ruled part of the bankruptcy estate, making users unsecured creditors. That is the consequence of missing segregation (Stage 5.2), unrelated to hacking, and structurally identical to an unallocated gold account.",
    "“Get compliance right and the project survives.” —— Aspen Coin's compliance was perfectly proper and it still died of no secondary demand. Compliance is a necessary condition, not a sufficient one; distribution channels and a primary-market redemption engine are where liquidity comes from (Stage 9).",
    "“If the token is verifiable on-chain, the asset must be real.” —— On-chain verification proves only that the token exists. The fake farm tokens had immaculate on-chain data and no farm. Verifying the asset takes off-chain custody, audits, registries, and legal entities (Stage 1.3's bridge pillars).",
    "“Ops are a detail — get the technology right and you're fine.” —— The Detroit houses and the Verra-banned carbon credits both died at exactly this layer: being able to mint is not being able to collect rent, file taxes, or maintain a relationship with an off-chain registry. Operational collapse is the least glamorous and most common line on the list.",
  ],

  quiz: [
    {
      q: "What cause of death did Aspen Coin and tZERO share?",
      options: [
        "Smart contracts breached by hackers",
        "They built issuance without distribution — the buyer count was near zero and secondary volume stayed near zero for years",
        "Regulators suddenly banned security tokens",
        "The underlying assets did not exist",
      ],
      answer: 1,
      explain: "Both got compliance and issuance right; what was missing was the demand side — eligible, willing, funded buyers and the channels reaching them (Stage 9.1 plus Stage 10.4's liquidity illusion).",
    },
    {
      q: "Why was UST's “reserve” not a reserve at all?",
      options: [
        "Because the reserve sat in an offshore bank",
        "Because the reserve was its own sibling token LUNA (an endogenous asset) — falling confidence hit the token and its backing simultaneously, creating a reflexive death spiral",
        "Because the reserve lacked monthly attestations",
        "Because the reserve was gold rather than dollars",
      ],
      answer: 1,
      explain: "An endogenous reserve is not a reserve. A real one must be an exogenous off-chain asset paired with an enforceable redemption claim (Stage 4.1's taxonomy line).",
    },
    {
      q: "In the Celsius case, why did users end up as unsecured creditors?",
      options: [
        "Because hackers stole the assets",
        "Because the terms transferred asset ownership to Celsius and account assets were ruled part of the bankruptcy estate — what was missing was segregation",
        "Because users had not completed KYC",
        "Because the wrong token standard was used",
      ],
      answer: 1,
      explain: "“There are 3 BTC in my account” and “Celsius owes me 3 BTC” are different species in bankruptcy court — structurally identical to an unallocated gold account (Stages 5.2, 10.5).",
    },
    {
      q: "Inverting the five labels, which item is NOT part of the 2024–25 survivor profile?",
      options: [
        "A real, yield-bearing, standardized underlying asset plus a genuine legal wrapper",
        "Licensed distribution plus a primary-market mint/redeem engine at NAV",
        "Boring but reliable long-run operations",
        "A fixed yield promised far above Treasuries to attract retail",
      ],
      answer: 3,
      explain: "An outsized yield promise is itself a red flag (Stage 12.4). Survivors run on standardized assets, real wrappers, exogenous reserves, licensed distribution, a primary redemption engine, and operational excellence — never on a headline rate.",
    },
    {
      q: "The death of tokenized carbon credits (Toucan/KlimaDAO) belongs to which category?",
      options: [
        "Reflexive peg",
        "Operational collapse / off-chain registry dependence — the underlying registry Verra banned tokenization outright and the bridged tokens were orphaned instantly",
        "No secondary demand",
        "A smart contract bug",
      ],
      answer: 1,
      explain: "A token's force is parasitic on an off-chain registry you do not control; when the registry authority changes the rules, the token dies on the spot (Stage 5.3's register conflict plus Stage 10.5).",
    },
  ],

  further: [
    { label: "SEC: BlockFi unregistered securities settlement (2022 press release)", url: "https://www.sec.gov/news/press-release/2022-26" },
    { label: "SEC v. Terraform Labs — litigation release on the Terra/UST collapse", url: "https://www.sec.gov/litigation/litreleases/lr-25649" },
    { label: "Verra: statement on tokenizing issued carbon credits (2022)", url: "https://verra.org/verra-addresses-crypto-instruments-and-tokens/" },
    { label: "tZERO (the first-generation security-token ATS today)", url: "https://www.tzero.com" },
    { label: "SEC investor education: digital assets and fraud red flags", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/digital-assets" },
  ],
};
