export default {
  id: "risk-map",
  stage: 12,
  order: 1,
  title: "The RWA Risk Map: Six Layers on One Chart",
  difficulty: "mastery",
  prereqs: ["trust-bridge", "case-failures"],

  oneLiner:
    "An expert never asks “is this RWA safe?” They break every product into six risk layers — asset, issuer, legal, custody, data, contract — plus a “liquidity” amplifier ring around them, and draw its shape. Your real risk is not the average of the six layers but the **weakest one**: a AAA Treasury sitting behind a fraudulent issuer is a fraud, not a AAA. This lesson compresses everything from the previous twelve stages into one chart you'll use in every evaluation from now on.",

  intuition: `
You've come through eleven stages: dissected stablecoin reserves (Stage 4), looked inside legal wrappers (Stage 5), traced the transfer checks of permissioned tokens (Stage 6), lived through the Silicon Valley Bank weekend alongside USDC (Stage 4.3), and counted the dead projects in the graveyard (Stage 10.6). Now someone shows you a new product and asks: “Is this safe?”

If “safe” or “unsafe” pops out of your mouth, the previous eleven stages were wasted. **The question itself is wrong.** It's like a patient asking a doctor, “Am I healthy?” A good doctor doesn't answer “healthy” — she runs a panel: blood pressure, blood sugar, an ECG… then hands you a report and points at the abnormal line: “Everything else is fine. Watch this one.”

The RWA “check-up sheet” is what this lesson gives you: **every RWA product is the same stack of six risk layers** — can the underlying asset go bad, can the issuer run or fail, is the legal structure real, is the custodied asset actually there, is the on-chain data fresh, does the contract itself have holes. Plus one thing that isn't a layer yet amplifies every layer: **liquidity** — it decides how fast you can get out when something breaks.

Each of the six layers comes with a textbook disaster, all drawn from the Stage 10 cases you've already studied. So this lesson has no new knowledge — it takes what you already know and **puts it in battle formation**. Once you're done, any RWA product you look at will conjure a hexagon shape in your head, not a “safe/dangerous” label.

**Here's the map — five parts:**

- **① The frame: every RWA is a six-layer stack**
- **② The bottom three: asset, issuer, legal structure**
- **③ The top three: custody, data, contract & chain**
- **④ The liquidity ring, and three iron laws**
- **⑤ Four portraits: drawing real products into shapes**
`,

  mechanics: `
### ① The frame: every RWA is a six-layer stack

Return to the course's throughline: **the token is a receipt — the trust lives in the off-chain structure** (Stage 1.3). For a receipt to be honored, it must traverse an entire chain: an asset exists in the real world → some issuer holds it → wrapped in some legal structure → parked with some custodian → reported on-chain through some data pipeline → and finally lands in a smart contract as the token in your wallet. **Every link in that chain is a layer of risk.**

- **Layer 1 · Asset**: can the thing behind the receipt itself fall or default?
- **Layer 2 · Issuer**: can the party writing the receipt go broke or lie?
- **Layer 3 · Legal/structure**: does the receipt actually count, in law?
- **Layer 4 · Custody**: is the thing really in the vault — and unpledged?
- **Layer 5 · Data/oracle**: are the numbers you see on-chain true and fresh?
- **Layer 6 · Contract/chain**: does the software holding the receipt have holes?

<figure><svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="riskmap-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--orange-line)"/></marker></defs><rect x="120" y="20" width="300" height="40" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="270" y="45" text-anchor="middle" font-size="12" fill="var(--ink)">⑥ Contract/chain: bugs · admin keys · bridges</text><rect x="120" y="66" width="300" height="40" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="270" y="91" text-anchor="middle" font-size="12" fill="var(--ink)">⑤ Data/oracle: NAV freshness · PoR blind spots</text><rect x="120" y="112" width="300" height="40" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="270" y="137" text-anchor="middle" font-size="12" fill="var(--ink)">④ Custody: still there? pledged to anyone?</text><rect x="120" y="158" width="300" height="40" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="270" y="183" text-anchor="middle" font-size="12" fill="var(--ink)">③ Legal/structure: true sale · register · enforceable</text><rect x="120" y="204" width="300" height="40" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="270" y="229" text-anchor="middle" font-size="12" fill="var(--ink)">② Issuer: solvency · fraud · key person</text><rect x="120" y="250" width="300" height="40" rx="8" fill="var(--green-soft)" stroke="var(--line)"/><text x="270" y="275" text-anchor="middle" font-size="12" fill="var(--ink)">① Asset: credit · market · duration</text><path d="M450 30 C 500 30 500 280 450 280" fill="none" stroke="var(--orange-line)" stroke-dasharray="5 4" stroke-width="2"/><text x="530" y="140" text-anchor="middle" font-size="12" fill="var(--orange-ink)">Liquidity</text><text x="530" y="158" text-anchor="middle" font-size="10" fill="var(--muted)">not a layer —</text><text x="530" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">an amplifier</text><path d="M60 285 L60 35" stroke="var(--line)" stroke-width="2" marker-end="url(#riskmap-arr)"/><text x="40" y="160" text-anchor="middle" font-size="10" fill="var(--muted)" transform="rotate(-90 40 160)">farther from the real asset →</text><text x="270" y="316" text-anchor="middle" font-size="11" fill="var(--muted)">The six layers are in SERIES: if any one snaps, the whole receipt chain snaps</text></svg></figure>

The word “stack” carries a physical meaning: these six layers are wired **in series**, like six links in one chain. Perfect asset, perfect custody, perfect contract — if the issuer is a fraud, you still go to zero. So let's nail the most important conclusion here, and ④ will formalize it: **your real risk is determined by the weakest layer, not the average of six**.

### ② The bottom three: asset, issuer, legal structure

**Layer 1 · Asset.** The thing behind the receipt can go bad in three ways: **credit risk** (the borrower defaults), **market risk** (the price falls), **duration risk** (rates move, long-dated assets fall first — Stage 3.2's bond math). The questions to ask: what exactly is the underlying? Who owes the money, and how rated? What maturity? What's the historical default rate? Put the two extremes side by side and you have a yardstick — on one end, 3-month US Treasury bills (defaults in history: zero); on the other, loans to Ugandan motorcycle-finance companies inside Goldfinch pools (Stage 10.3): real emerging-market credit where several pools defaulted in 2022-23 and investors recovered far less than principal. Note: **both can be honest products** — the difference is the asset layer's inherent risk, which must show up in the yield (Stage 12.4 does that arithmetic).

**Layer 2 · Issuer/counterparty.** The institution writing the receipt can itself break: **solvency** (if it fails, where does your claim rank?), **fraud** (it was lying from day one), **key-person risk** (the whole operation hangs on one or two people), **operational capacity** (rent collection, loan servicing, tax filings — can it actually do the grunt work?). Two textbook disasters: Celsius — a yield platform advertising “bank-grade security” that went bankrupt in 2022 owing users roughly $4.7 billion, at which point users discovered they were mere unsecured creditors; and the other face of RealT (Stage 10.4) — the tokens and dividend plumbing worked fine, but Detroit property management fell behind, houses fell into disrepair and the city sued: **the token didn't break, the people doing the work did**. Ask: who is the issuer? How many years old? Is the team publicly identified? If it fails, does my asset get swept into its bankruptcy estate?

**Layer 3 · Legal/structure.** This is all of Stage 5 compressed into one layer: is the **claim** the token represents legally real and enforceable? **Wrapper quality** (paid-in equity in an SPV, or just a sentence saying “we promise”), **true sale** (was the asset genuinely transferred to the SPV, or is it still titled to the issuer?), **register regime** (is the token itself the legal register — Stage 5.3's Wyoming/Liechtenstein question), **jurisdiction** (when things break, which country's court, suing whom?). In Stage 10.6's graveyard, the ugliest deaths were the **fake wrappers**: an SPV drawn in the whitepaper that no registry has heard of; or an SPV that exists but into which the assets were never transferred. Ask: what is the entity called, where is it registered? Can I find it in an official registry? Do the transfer documents exist?

### ③ The top three: custody, data, contract & chain

**Layer 4 · Custody.** The law says the asset is yours — but **physically**, whose hands is it in, and in what condition? Two classic questions. One: **is it still there** — that March 2023 weekend (Stage 4.3), Circle's legal structure was spotless, yet $3.3 billion in cash sat unreachable inside a failed Silicon Valley Bank and USDC fell to $0.87 anyway: when the custody layer alone snaps, the whole chain snaps. Two: **is it clean** — the same “gold bar in a vault” can be allocated (numbered bars legally owned by the holder, like PAXG) or unallocated — a mere claim on an institution (Stage 10.5); the same word “reserves” can mean segregated safekeeping, or “already pledged out as loan collateral.” Ask: what is the custodian's name? Is it independent? Are assets segregated? Does the language include the words “may pledge” (Stage 12.2 shows you where to look)?

**Layer 5 · Data/oracle.** The chain is blind (Stage 8.1); every number you see on-chain was **fed in by someone**. Three risk flavors: **stale NAV** (the underlying moves daily, the on-chain number updates weekly — the gap is an arbitrageur's lunch, Stage 8.2), **proof-of-reserve blind spots** (PoR can prove “the wallet held X at time T”; it cannot prove “nobody else is owed that same X,” Stage 8.3), **feed manipulation** (a single, bribable source). Ask: how often is NAV updated, and who computes it? Is PoR a live feed or a quarterly PDF? How many sources feed the number?

**Layer 6 · Contract/chain.** Finally, the software holding the receipt: **contract bugs** (reentrancy, precision, logic errors — audits reduce but never eliminate), **admin keys** (Stage 6.5 taught you: freeze, pause, \`forcedTransfer\` — those switches are required for compliance, but every switch is also an attack surface: steal or abuse the key and the switch points at you), **upgrade governance** (upgradeable contract = the logic can be swapped anytime — who holds that power?), **bridges** (BUIDL deployed across 7 chains, Stage 10.1 — every extra chain and every bridge adds surface; bridges are among the most-robbed infrastructure categories in crypto history). Ask: audited — and does the audit cover **the deployed address**? Is the admin key a single externally-owned account (EOA), a multisig, or timelocked? How many chains?

### ④ The liquidity ring, and three iron laws

**Liquidity is not a seventh layer — it's an amplifier wrapped around all six.** It creates no losses by itself, but it decides **how fast bad news from any layer reaches your exit**. Watch two parameters: **redemption terms** (redeem anytime? T+2? 90-day notice? gates?) and **secondary depth** (are there real buyers off the primary window, and at what discount — Stage 9.4's discount spiral). The same custody failure plays out very differently: USDC holders got an FDIC backstop by Monday because the redemption channel reopened within 48 hours; a quarterly-redemption real-estate token hit by the same event leaves you hugging a falling receipt for three months.

Frame in place — three iron laws, each worth memorizing:

- **Law 1 · Series, not parallel**: real risk = the weakest layer, not the average. Mathematically it behaves like **multiplication**, not addition: five layers at 99% reliability × one at 50% ≈ 48%. A AAA Treasury behind a fraudulent issuer makes the product a fraud, not a AAA — when FTX misappropriated user assets, the users' assets were mostly “good assets.”
- **Law 2 · Under stress, layers fail together**: in calm times the six look independent; in a crisis they correlate hard. The SVB weekend hit custody (cash stuck), assets (bond losses), and payment rails (Fedwire shut for the weekend) **simultaneously**; a crypto crash degrades contracts (liquidation cascades), liquidity (bids vanish), and oracles (feeds whipsaw) together (Stage 9.3's chain reaction). Stress-test **jointly**, never layer by layer.
- **Law 3 · Risk isn't bad — unpriced risk is**: this map's purpose is not to find a “zero-risk product” (none exists — even Treasuries carry duration and a custody layer) but to **price risk**: one notch deeper on the asset layer should mean several extra points of yield. Whether you're actually being paid enough, and for the layer you think — that's Stage 12.4's arithmetic.

### ⑤ Four portraits: drawing real products into shapes

Score each layer 0–5 (0 = barely a concern, 5 = a crater) and a product becomes six numbers plus a liquidity grade. Draw it, and the shape speaks for itself:

- **BlackRock BUIDL** (Stage 10.1): asset 1 (short-dated Treasuries) · issuer 1 (BlackRock + Securitize) · legal 1 (BVI fund, proper Reg D offering) · custody 1 (BNY Mellon) · data 2 (NAV computed daily by the administrator) · contract 3 (multichain deployment + a permissioned contract's admin switches). Liquidity: primary redemption excellent (an instant USDC facility), secondary razor-thin (transfers only within the qualified-purchaser whitelist). Shape: **a flat pancake with one bump at “contract/chain”** — the standard shape of tokenized-Treasury products.
- **Ondo USDY** (Stage 10.2): asset 1 · issuer 2 (Ondo is far younger than BlackRock) · legal 2 (a yield-bearing note structure, not a registered fund) · custody 2 · data 2 · contract 2. Liquidity: a 40-plus-day transfer lock after mint, freely transferable on-chain afterwards. Shape: a slightly taller pancake all around — **a bit more structural risk traded for much wider access**.
- **A Goldfinch-style emerging-market credit pool** (Stage 10.3): asset 4 (unsecured EM fintech loans) · issuer 3 (dependent on borrower operations) · legal 3 (cross-border recourse; post-default litigation happens in Ugandan/Kenyan courts) · custody 2 (credit has nothing physical to custody; this layer partly degenerates into contract management) · data 3 (NAV relies on borrower-reported numbers) · contract 3. Liquidity: poor, near-frozen after a default. Shape: **twin spikes at asset and issuer** — not automatically “don't buy,” but the 10%-plus yield had better truly be paying for those two spikes.
- **A fictional “15% stable yield” product**: the landing page says “stable, safe, bank-grade.” One drawing exposes it: legal 5 (no findable entity) · custody 5 (a nameless “partner custodian”) · data 4 (no attestations) — **craters at legal and custody**. Scams share an eerily consistent shape: they don't cheat you at the asset layer (they'll even buy some real T-bills as props); they dig the hole in the structural layers you can't see.

Put the four portraits side by side and you'll find the shape more useful than the score: Treasuries = flat pancake with a chain bump; credit = twin asset/issuer spikes; scams = structural collapse. If you take away one sentence: **never ask “is it safe” — draw its hexagon, point at the deepest dent, and start asking questions there.**
`,

  demo: "risk-radar",

  analogy: `
Think of evaluating an RWA as **buying a second-hand house**. A novice asks one question: “Is this a good house?” A pro checks six things — and knows that **any single failure flips the whole table**.

The **house itself** is the asset layer — layout, age, does the roof leak. The **seller** is the issuer layer — is he really the owner? Why the rush to sell? The **deed and title registration** are the legal layer — is the deed genuine? Any co-owners, any liens? The **keys and mortgage status** are the custody layer — the title may be clean while the house is already mortgaged to a bank and a tenant still holds the keys. The **appraisal report** is the data layer — was that “worth 5 million” appraisal done last week, or three years ago at the market top? The **smart lock** is the contract layer — does the lock vendor keep a master key, does the firmware have holes?

And **how easily the neighborhood resells** is the liquidity ring: with the same problem discovered, in a hot district you eat a spread and get out; in a far suburb where listings sit for two years, you're stuck holding a problem house — **liquidity doesn't decide whether the house is good, it decides how many options you have left when the bad news arrives**.

The difference between the pro and the novice isn't courage — it's that the pro **works down a checklist item by item**, and at the end knows how much to knock off the price (risk pricing) or which single item is a dealbreaker (the weakest-layer law). Gorgeous house, but the seller can't produce a deed? The pro walks — because he knows **he was never buying the house; he was buying the entire chain from the house to his own name**.
`,

  misconceptions: [
    "“The underlying is AAA Treasuries, so the product is AAA-safe.” —— The asset layer is one of six. Treasuries behind a fraudulent issuer or a fake wrapper make the product a fraud. Inside FTX, users' assets were mostly “good assets” too — they still couldn't get them back. In a series structure, the weakest layer decides.",
    "“Four layers are great and two are so-so, so on average it's fine.” —— Risk doesn't take arithmetic averages; it multiplies. Five layers at 99% × one at 50% ≈ 48%. The right move is to interrogate the deepest crater, not admire the high scores.",
    "“A product with risk shouldn't be touched at all.” —— The map's purpose is pricing, not elimination. Even Treasuries carry duration risk and a custody layer. The danger isn't risk — it's unpriced, undisclosed risk. One notch deeper on a layer should buy you extra yield; whether it actually does is the question (Stage 12.4).",
    "“The layers are independent, so evaluate them one at a time.” —— Independent in calm, tightly correlated in crisis. The SVB weekend hit custody + assets + payment rails at once; a crypto crash degrades contracts + liquidity + oracles together. Stress tests must be joint.",
    "“Good liquidity means low risk.” —— Liquidity is not a layer; it's an amplifier. It lowers no layer's failure probability — it only sets how fast you can run afterwards. Celsius deposits and withdrawals felt perfectly “liquid” in 2021, right up until the day the gate dropped.",
  ],

  quiz: [
    {
      q: "A product holds US Treasuries (asset layer near-perfect), but the issuing entity can't be found in any registry. Its true risk level is?",
      options: ["Close to Treasuries, because the underlying decides everything", "Take the average: medium risk", "Close to the weakest layer — a legal/issuer crater, i.e. high danger", "Impossible to say"],
      answer: 2,
      explain: "The six layers are in series: real risk equals the weakest layer. An unfindable entity means the claim may not exist at all — the Treasuries are just props.",
    },
    {
      q: "USDC falling to $0.87 in March 2023 is the textbook case of which single layer snapping?",
      options: ["Asset — the reserve assets defaulted", "Custody — the reserves were fine, but $3.3B sat unreachable in a failed Silicon Valley Bank", "Contract — the USDC contract was hacked", "Data — a bad price feed"],
      answer: 1,
      explain: "The reserve assets were sound and the legal structure spotless, but the custodian bank failed and weekend payment rails were shut — one broken custody layer broke the whole receipt chain (Stage 4.3).",
    },
    {
      q: "Where does “liquidity” correctly sit on the risk map?",
      options: ["A seventh layer alongside the other six", "Not a layer — an amplifier: it decides how fast any layer's failure reaches your exit", "It only operates inside the asset layer", "Unrelated to risk; it only affects returns"],
      answer: 1,
      explain: "Liquidity creates no losses itself, but the same custody failure leaves an instantly-redeemable product and a quarterly-redemption product with completely different options.",
    },
    {
      q: "Why must stress tests treat multiple layers jointly?",
      options: ["Because testing separately takes too long", "Because layers correlate hard in a crisis and degrade together — like custody + assets + rails on the SVB weekend", "Because regulators require it", "They don't — layers are always independent"],
      answer: 1,
      explain: "Layers that look independent in calm are often struck simultaneously by the same crisis source. Single-layer tests systematically underestimate tail risk.",
    },
    {
      q: "When drawing risk portraits, what does the typical “scam shape” look like?",
      options: ["Craters on all six layers", "One spike at the asset layer, flat elsewhere", "Collapse at legal/custody (no findable entity, nameless custodian) while the asset layer may look fine", "Perfectly flat with no bumps at all"],
      answer: 2,
      explain: "Scams often buy some genuinely good assets as props; the hole is dug in the structural layers you can't see — no entity, nameless custody, no attestations. The asset layer's “goodness” is the bait.",
    },
  ],

  further: [
    { label: "SEC Investor.gov: Researching Investments (official diligence primer)", url: "https://www.investor.gov/introduction-investing/getting-started/researching-investments" },
    { label: "Chainlink Proof of Reserve (a data-layer tool — and its limits)", url: "https://chain.link/proof-of-reserve" },
    { label: "rwa.xyz: tokenized-asset data dashboard (compare real product portraits)", url: "https://app.rwa.xyz/" },
    { label: "Investopedia: Credit Risk (asset-layer fundamentals)", url: "https://www.investopedia.com/terms/c/creditrisk.asp" },
  ],
};
