export default {
  id: "case-gold",
  stage: 10,
  order: 5,
  title: "Gold & Commodities: How PAXG Slices Bars into Grams",
  difficulty: "mastery",
  prereqs: ["token-vs-claim", "proof-of-reserve"],

  oneLiner:
    "PAXG has the cleanest claim structure in the entire RWA world: 1 token = 1 fine troy ounce of a specific bar in a London vault — held as **title itself**, not an IOU, not a fund share. It can be that clean thanks to two things: a limited purpose trust company supervised by the New York Department of Financial Services, and the LBMA's century-old bar standards and custody chain. This lesson uses it to consolidate all of Stage 5: **the one-word gap between “allocated” and “unallocated” is the chasm between property and debt**. Gold also happens to explain why it was the earliest, smoothest commodity to tokenize — the older and harder the trust bridge, the more tokenization feels like just plugging in.",

  intuition: `
Say you want to buy 100 grams of gold. Every option in front of you is awkward: bars from a dealer carry a 3–8% premium, keeping them at home invites theft, a bank safe-deposit box charges yearly rent; a gold ETF (like GLD) is convenient but quietly clips 0.40% a year in fees, and you can never swap shares for metal; futures come with leverage and roll costs; the bank's “paper gold” account is easiest of all — until a 2008-style moment when you suddenly discover the “gold” in your account is just a number the bank owes you.

Now there's a fifth option: spend two minutes, buy 3.2 PAXG on-chain, and you **own** 100 grams of a specific numbered bar in the Brink's vault in London — not “a certificate worth roughly 100 grams,” but a pro-rata share of **title** to that particular bar. Enter your wallet address and the official site tells you which bar, its weight, its fineness. No annual fee. Transferable 24/7, divisible to 18 decimal places.

Sounds too smooth, right? That's exactly the point of this lesson: gold is the **lowest-friction** tokenization case in all of RWA — not because the technology is advanced, but because the custody, assay, and standardization of gold bars have been polished by humanity for over a century. We'll take PAXG apart, use it to consolidate Stage 5's lesson on claims, then answer a pattern question: why did gold go this smoothly while other commodities struggle?

**Here's the map — six parts:**

- **① The issuer — what a “limited purpose trust company” means**
- **② 1 token = 1 ounce of WHICH bar — LBMA and London Good Delivery**
- **③ Allocated vs unallocated — the legal heart of this lesson**
- **④ Serial lookup, attestations & redemption — artisanal proof of reserve**
- **⑤ The holding-cost race — PAXG vs GLD vs coins vs futures vs paper gold**
- **⑥ Why gold went first and smoothest — and how other commodities fared**
`,

  mechanics: `
### ① The issuer: what a “limited purpose trust company” means

PAXG is issued by **Paxos Trust Company** — note the suffix: not Inc., but **Trust Company**. It holds a **limited purpose trust charter** from the New York Department of Financial Services (NYDFS), one of the most demanding custody regimes in US state-level regulation (the “trust” flavor of the state-charter route from Stage 11.1). That charter means three things with direct consequences for you:

- **Custodied assets are legally segregated from proprietary assets**: customers' gold is **not** an asset on Paxos's balance sheet. If Paxos goes bankrupt, customer gold does not enter the bankruptcy estate — Stage 5.2's segregation principle, enforced here not by a contractual promise but by **trust law and the regulatory charter, doubly**.
- **A regulator continuously watches the custody**: NYDFS has examination powers, enforcement powers, and capital requirements. That is a different species from a random Cayman-incorporated company issuing a “gold token.”
- **Redemption is part of the charter's obligations**, not a marketing slogan.

Anchor this against Stage 4.2's conclusion on reserve transparency — **issuer quality is itself part of the asset** — which applies here verbatim.

### ② 1 token = 1 ounce of WHICH bar: LBMA and London Good Delivery

PAXG's peg object is as precise as precision gets: **1 PAXG = 1 fine troy ounce of a London Good Delivery gold bar**, stored in approved London vaults (chiefly Brink's). “London Good Delivery” is the **LBMA** (London Bullion Market Association) standard — the lingua franca of the global wholesale gold market:

- Each bar weighs roughly **400 ounces** (350–430 oz allowed), fineness ≥ 99.5%;
- Each bar carries a **unique serial number, refiner's mark, year, and assayed weight**;
- Only bars from LBMA-accredited refiners count, and a bar must maintain an unbroken **chain of custody** between approved vaults and approved carriers — once a bar leaves the system, re-entry requires re-assay.

This machinery has been running since the era of the 1919 London gold fix. In other words: **Stage 1.3's “trust bridge” is, in gold's case, a stone bridge more than a century old** — custody standards, assay standards, serial registries, chain of custody, all poured long before tokenization existed. What Paxos did, in essence, was run one cable from that bridge's ownership ledger to Ethereum.

### ③ Allocated vs unallocated: the legal heart of this lesson

Now for the most important pair of concepts in the lesson. “Bank gold” comes in two account types — one word apart, a world apart:

- **Allocated**: specific bars (serial, weight, fineness) are earmarked to your name; the bank/vault is merely a **bailee**. The gold is **your property** — if the custodian fails, you point at the serial numbers and take your bars; creditors cannot touch them.
- **Unallocated**: your account holds nothing but a gram figure; the bank promises “we owe you this much gold,” and usually doesn't even hold full physical backing. You are the bank's **unsecured creditor** — if it fails, you queue up with the other creditors for a pro-rata scrap.

Stage 5.1 taught that the vast majority of RWA tokens are “claims on assets,” with the issuer's credit in between. **PAXG is the rare exception: a near-direct property claim** — token holders enjoy beneficial ownership of allocated gold, and Paxos is a regulated custodian, not your debtor. That is why PAXG has the cleanest claim structure in RWA: the chain reads “you → token → title to allocated bars,” **with no “the issuer owes you” link at all**.

<figure><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><text x="320" y="24" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="bold">Same “100 g of gold at an institution” — two endings on bankruptcy day</text><rect x="20" y="46" width="290" height="150" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="165" y="70" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">Allocated (the PAXG model)</text><text x="165" y="92" text-anchor="middle" font-size="10" fill="var(--muted)">numbered bars in your name · institution = bailee</text><rect x="45" y="106" width="240" height="30" rx="6" fill="var(--surface-2)" stroke="var(--line)"/><text x="165" y="125" text-anchor="middle" font-size="10" fill="var(--ink)">Bar PX-4471 · 402.35 oz · your 100 g</text><text x="165" y="160" text-anchor="middle" font-size="11" fill="var(--green)" font-weight="bold">Bankruptcy day: point at the serial, take the gold ✅</text><text x="165" y="178" text-anchor="middle" font-size="9" fill="var(--muted)">Your property — never enters the estate</text><rect x="330" y="46" width="290" height="150" rx="10" fill="var(--red-soft)" stroke="var(--line)"/><text x="475" y="70" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">Unallocated (paper gold account)</text><text x="475" y="92" text-anchor="middle" font-size="10" fill="var(--muted)">just a number in an account · institution = debtor</text><rect x="355" y="106" width="240" height="30" rx="6" fill="var(--surface-2)" stroke="var(--line)"/><text x="475" y="125" text-anchor="middle" font-size="10" fill="var(--ink)">“We owe you 100 g” (metal may not be there)</text><text x="475" y="160" text-anchor="middle" font-size="11" fill="var(--red)" font-weight="bold">Bankruptcy day: join the unsecured queue ⛔</text><text x="475" y="178" text-anchor="middle" font-size="9" fill="var(--muted)">Pro-rata scraps with every other creditor</text><text x="320" y="228" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="bold">One word apart = property vs debt (Stage 5.1's watershed, at its starkest in gold)</text></svg></figure>

### ④ Serial lookup, attestations & redemption: artisanal proof of reserve

Stage 8.3 covered the many shapes of proof of reserve; PAXG offers an “artisanal-grade” version with rare granularity:

- **Serial-number lookup**: enter your Ethereum address on Paxos's site and it returns **the list of bars backing your balance** — serial, refiner, weight, fineness. Not a macro statement of “total reserves ≥ total supply,” but a micro-level identification of “which bar your grams sit on.”
- **Monthly attestations**: a third-party accountant reconciles **total on-chain supply vs total allocated ounces in the vault** each month and issues an attestation report (remember Stage 4.2's caveat: an attestation is a point-in-time check, not a full audit).
- **Physical redemption**: large holders can withdraw whole 400 oz bars (a threshold naturally in the hundreds of thousands of dollars); smaller amounts can be converted to retail-size metal through partner dealer networks, or simply sold back to Paxos at the London spot price for dollars. **The redemption channel is the peg's foundation** — Stage 9.4's arbitrage machinery meshes exceptionally smoothly here, because the reference price comes from one of the deepest markets on Earth: London spot gold.

The fee structure deserves a look too: PAXG charges **no annualized custody fee** — Paxos earns from mint/redeem fees and a small on-chain transfer fee (~0.02%). That gives it a structural long-run cost advantage over the ETF, which we'll compute in ⑤.

### ⑤ The holding-cost race: PAXG vs GLD vs coins vs futures vs paper gold

Suppose you have $10,000, you're bullish on gold, and you hold for 10 years (gold price held flat, to isolate holding costs):

- **PAXG**: pay a small fee once at purchase, **zero annual fees** while holding; after 10 years ≈ **$9,980**. Risks: issuer and custodian risk (mitigated by regulation), smart contract risk.
- **GLD (ETF)**: the 0.40%/yr expense ratio is **scraped out of NAV daily**. Compounded over 10 years, (1−0.004)^10 ≈ 0.9608 — you're left with **$9,608**, nearly $400 quietly eaten. And what you hold are **trust shares** (a creditor-style structure), tradable only in market hours, with **no** retail redemption in metal.
- **Coins/bars in a safe**: a 3–8% buying premium, ~$100/yr storage + insurance, and an assay haircut when you sell. After 10 years ≈ **$8,500–9,200**.
- **Futures**: no metal held; quarterly **roll** costs typically bleed a fraction of a percent per year for long-term holders, plus leverage and margin-call risk — it's a trading instrument, not a holding instrument.
- **Unallocated paper gold**: cheapest of all, but you're the bank's unsecured creditor (the ending pictured in ③). The money you save is the price you got for selling your bankruptcy protection.

One close cousin belongs in the control group: **XAUT (Tether Gold)** — a similar promise (Swiss vaults, redeemable), with an issuer licensed in El Salvador and disclosure granularity plus regulatory intensity a notch below the NYDFS regime. Same asset, same promissory sentence structure — **one notch down in issuer quality is one notch down in risk quality** — Stage 4.2's stablecoin homework, transplanted whole. As of 2025, PAXG and XAUT together sit in the low-single-digit billions (with 2025's gold rally pushing PAXG alone past $1B).

### ⑥ Why gold went first and smoothest — and how other commodities fared

Zoom out for the pattern lesson. Gold tokenization was already working by 2019 and has run without major incident since, thanks to four preconditions other assets can only envy:

- **No cash flows**: no dividends, no rent — Stage 8.4's entire payout machine is simply unnecessary; and no NAV computation — there's no “fund share value,” just one gold price.
- **One global homogeneous price**: London spot, COMEX futures — one price worldwide. The oracle's job (Stage 8.1) is almost trivially easy.
- **Custody and assay standards over a century old**: LBMA's vaults, refiners, and chain-of-custody rules are a pre-built trust bridge; tokenization just plugged in (②'s stone-bridge metaphor).
- **A peg maintained by arbitrage against a bottomless market**: whenever PAXG drifts from spot, arbitrageurs mint/redeem it flat again (Stage 9.4), with humanity's oldest, deepest market as the counterparty.

Hold other commodities against those four criteria and their struggles explain themselves. **Silver**: bulky and low-value-per-volume, so storage costs bite, but the LBMA system covers it — workable. **Tokenized carbon credits**: Toucan/KlimaDAO bridged hundreds of millions of tonnes on-chain in 2021–22, and then the underlying registry, **Verra, simply prohibited** tokenizing issued credits — **when the off-chain registry says no, the token dies on the spot**, the cleanest specimen of Stage 5.3's register-conflict problem (Stage 10.6 performs the full autopsy). **Oil/uranium**: pilots exist, but the physical complexity of storage, transport, and delivery is brutal — crude has no “sit in a vault untouched for a century” option. **Agricultural warehouse receipts**: actually the oldest RWA idea of all — a warehouse issues a receipt, the receipt circulates as a claim; humanity has done this for centuries, and tokenization merely changes the receipt's medium.

If you take away one sentence: **gold is the textbook demonstration of RWA's golden rule — the older and harder the custody-and-assay trust bridge, the smoother the tokenization; and the one-word gap between “allocated” and “unallocated” is the chasm between property and debt, between walking out with your bar and queueing for scraps.**
`,

  demo: "gold-slicer",

  analogy: `
Think of it as two ways to check your coat. The first is a **cloakroom with numbered tags**: your coat hangs on hook 47, and the tag maps to that exact coat. Even if the theater goes bankrupt tonight and creditors seize it tomorrow, you present tag 47 and the coat on hook 47 is still yours — it was never the theater's property; the theater merely **kept it for you**. That is **allocated**: PAXG's tag has a gold bar's serial number written on it.

The second is a theater's “smart check-in”: your coat is tossed onto a big pile, and you get a card reading “this theater owes you one coat of equal quality.” On a normal night, retrieval is painless — faster, even. But on bankruptcy day you discover the pile holds thirty percent fewer coats than cards issued — the theater had quietly been lending coats out for working capital. Your card isn't a coat; it's the **theater's IOU**. That is **unallocated**: it saved on hangers by selling your property right.

The LBMA system is the century of trade practice behind that cloakroom: what counts as a “standard coat,” how hooks are numbered, which certified dry cleaners a coat may pass through without losing its identity — rules settled before you were born. All Paxos did was give every numbered tag an on-chain mirror, so you can check on hook 47 from the other side of the planet, and split your tag into a hundred million pieces to hand to others.

So don't be dazzled by the phrase “blockchain gold”: **the technologically revolutionary parts (slicing, 24/7 transfer) are precisely the easy parts; what's actually valuable is that hundred-year-old cloakroom**. That's the mantra for judging every commodity tokenization: before you look at the chain, ask how old the cloakroom is.
`,

  misconceptions: [
    "“PAXG and paper gold are about the same — both give gold exposure.” —— Worlds apart. PAXG is title to allocated, numbered bars (property) with Paxos as regulated bailee; paper gold (an unallocated account) is a bank's IOU for grams (debt). On bankruptcy day, one walks out with bars; the other queues for scraps.",
    "“A gold token just needs ‘a pile of gold’ behind it — enough in total.” —— PAXG resolves to bar serial numbers: enter your address and see which bars your balance is allocated across. ‘Enough in total’ is unallocated thinking; ‘identified to the bar’ is allocated — the difference in granularity IS the difference in legal status.",
    "“An ETF is more legitimate, so it must be cheaper.” —— GLD's 0.40%/yr expense ratio scrapes NAV daily and compounds to about 3.9% over 10 years; PAXG has no annual fee (it earns on mint/redeem and transfers). ‘Regulated’ doesn't mean ‘cheap’ — and GLD shares are trust interests with no retail redemption in metal.",
    "“XAUT is the same as PAXG — just pick the cheaper one.” —— Same promissory sentence, different issuer quality: an NYDFS limited purpose trust vs an El Salvador license, with a notch less disclosure granularity and regulatory intensity. Stage 4.2's homework: for the same asset, the issuer is part of the risk itself.",
    "“Gold worked, so every commodity can be tokenized.” —— Gold won on four innate conditions: no cash flows, one global price, century-old custody standards, and a bottomless spot market. Carbon credits were killed by a registry's decree (Verra 2022); oil is stuck on physical delivery — check the age of the trust bridge before talking about chains.",
  ],

  quiz: [
    {
      q: "What is the essential difference between “allocated” and “unallocated” gold accounts?",
      options: [
        "Allocated charges higher fees; otherwise identical",
        "Allocated = specific numbered bars earmarked to you, you hold property and the institution is a bailee; unallocated = the institution owes you grams and you are an unsecured creditor",
        "Only allocated gold earns from rising prices",
        "Unallocated gold has lower fineness",
      ],
      answer: 1,
      explain: "One word apart = property vs debt. On bankruptcy day one collects bars by serial number, the other joins the creditor queue — this lesson's legal heart (Stage 5.1's watershed).",
    },
    {
      q: "What does Paxos's “limited purpose trust company” charter most importantly mean for PAXG holders?",
      options: [
        "Faster token transfers",
        "Customer gold is legally segregated from Paxos's own assets and stays out of any bankruptcy estate, with custody continuously supervised by NYDFS",
        "A guarantee that the gold price won't fall",
        "All fees are waived",
      ],
      answer: 1,
      explain: "The trust charter upgrades Stage 5.2's segregation from “contractual promise” to “law + regulation, doubly enforced,” with examination powers and capital requirements attached.",
    },
    {
      q: "Why is gold the “smoothest” commodity to tokenize?",
      options: [
        "Because the gold price only goes up",
        "Because it has no cash flows, one global price, LBMA's century-old custody and assay standards ready-made, and a peg held by mint/redeem arbitrage against the world's deepest spot market",
        "Because gold tokens escape all regulation",
        "Because gold is compact and easy to ship",
      ],
      answer: 1,
      explain: "Four innate conditions: no payout machine needed (Stage 8.4), a trivial oracle job (Stage 8.1), a hundred-year-old trust bridge (Stage 1.3), and a rock-solid arbitrage peg (Stage 9.4).",
    },
    {
      q: "Holding $10,000 of gold exposure for 10 years (price flat), the cost gap between GLD and PAXG is roughly?",
      options: [
        "Practically none",
        "GLD's 0.40%/yr fee compounds to about $390 lost; PAXG, with no annual fee, keeps roughly full value",
        "PAXG charges 1%/yr custody and is dearer",
        "GLD is free while PAXG charges an annual fee",
      ],
      answer: 1,
      explain: "(1−0.004)^10 ≈ 0.9608, leaving about $9,608 in GLD after ten years; PAXG has zero annual fee (earning on mint/redeem and ~0.02% transfers) — a structural long-run advantage.",
    },
    {
      q: "What does the death of Toucan/KlimaDAO's tokenized carbon credits demonstrate?",
      options: [
        "Carbon prices are too volatile",
        "Once the off-chain registry (Verra) banned tokenization, the tokens instantly lost meaning — when the registry authority says no, the token dies: a living specimen of Stage 5.3's register conflict",
        "The smart contracts were hacked",
        "Carbon credits were always a scam",
      ],
      answer: 1,
      explain: "A token's force is parasitic on the off-chain registry system. One decree in 2022 orphaned hundreds of millions of bridged tonnes — if the custody/registry bridge won't nod, the chain holds nothing.",
    },
  ],

  further: [
    { label: "Paxos: PAX Gold product page (structure, fees, redemption)", url: "https://paxos.com/paxgold/" },
    { label: "LBMA: Good Delivery standard (bar specs & accredited refiners)", url: "https://www.lbma.org.uk/good-delivery" },
    { label: "SPDR Gold Shares (GLD) — read its trust structure and fees for contrast", url: "https://www.spdrgoldshares.com" },
    { label: "Tether Gold (XAUT) — compare the disclosure granularity", url: "https://gold.tether.to" },
    { label: "NYDFS: virtual currency businesses (the framework behind Paxos's charter)", url: "https://www.dfs.ny.gov/virtual_currency_businesses" },
  ],
};
