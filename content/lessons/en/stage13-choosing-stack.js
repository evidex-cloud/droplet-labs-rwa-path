export default {
  id: "choosing-stack",
  stage: 13,
  order: 3,
  title: "Choosing the Stack: Chain, Standard, Custodian, Oracle",
  difficulty: "mastery",
  prereqs: ["issuance-pipeline"],

  oneLiner:
    "Choosing a stack isn't picking the newest, fastest thing — it's the tail end of a causal chain: **pick your buyers, buyers pick the law, law picks the structure, structure picks the technology**. This lesson gives you the decision inputs for six choices (chain, token standard, custodian, oracle, KYC vendor, distribution venue), then runs three complete worked designs through them — by the end you'll find you can reconstruct BUIDL from first principles.",

  intuition: `
In last lesson's pipeline, step ⑥ was only two or three weeks long. This lesson is every decision made inside those weeks.

Start with a fact many engineering teams dislike: **for none of these six choices is the right answer “the best technology.”** Ethereum mainnet isn't “better” than some new L1, ERC-3643 isn't “more advanced” than ERC-20, and a Chainlink oracle network isn't “more correct” than an admin feed. Each is right only for a **specific buyer with a specific asset**. The selection table is a mirror that reveals demons: what it exposes isn't your technical taste, it's whether you actually thought your buyers through back at step ②.

Concretely: you're launching a treasury fund for US qualified purchasers. Your buyers are institutions; their custodians are licensed qualified custodians; their compliance desks demand auditable transfer restrictions; they will never buy shares on Uniswap. So — public chain or permissioned? The answer is decided by which chains their custody tech supports, not by TPS. Do you want ERC-3643's on-chain claim system? If every transfer has to clear a licensed transfer agent anyway, you're paying for machinery you'll never use, and an ERC-20 with an external allowlist is cleaner — **which is exactly what BUIDL chose**.

At the end of this lesson we run three complete worked designs through the framework. After the first one you'll have an odd experience: **what you derived from nothing is nearly identical to what BlackRock actually built.**  That moment is what this whole course was for.

**Here's the map — five parts:**

- **① Choices 1–2: chain and token standard**
- **② Choices 3–4: custodian and oracle/data**
- **③ Choices 5–6: KYC vendor and distribution venue**
- **④ Three worked designs: the framework run end to end**
- **⑤ The causal chain in one sentence**
`,

  mechanics: `
### ① Choices 1–2: chain and token standard

**Choice 1 · The chain.** Four decision inputs, in order of weight:

- **Your buyers' custody capability** (most important): can your investors hold on-chain assets themselves? Retail can; for institutions you must ask which chains their qualified custodian supports — many institutional custodians support only Ethereum mainnet and a handful of blue-chip chains. **Institutional buyers → permissioned or blue-chip L1**; that isn't a technical preference, it's a list their compliance desk hard-coded.
- **Privacy needs** (Stage 7.4): must holdings be invisible to the public? If so, either use a permissioned chain/private subnet, or layer a privacy scheme on a public chain — and in 2025 the latter is still frontier work rather than a mature product.
- **DeFi distribution ambitions** (Stage 9.3): want Aave/Morpho-class protocols to accept your token as collateral? Then it must be a **public chain** — DeFi won't migrate to your permissioned chain for you.
- **Cost**: retail micro-transactions at high frequency (weekly rent, daily dividends) → **L2**. A $12 rent distribution costing $3 of mainnet gas is a product that doesn't work economically.

Stage 2.6 gave you a comparison table of chains; in this lesson that table turns from *descriptive* into **normative** — it's now a decision tool. One more piece of discipline: **settle your home chain first, go multichain later.** BUIDL launched on Ethereum and only spread to other chains once it was established (Stage 10.1) — each extra chain means another bridge, another cross-chain supply reconciliation job, another slab of attack surface.

**Choice 2 · The token standard.** Only two decision inputs: **transfer topology** (between whom does the token actually move) and **integration targets** (who needs to read your token).

- **ERC-3643 (T-REX)**: choose it when **peer-to-peer transfers among verified holders matter**. Its value is baking eligibility checks into \`transfer\` (Stage 6.2), and ONCHAINID claims are **reusable across issuers** — an investor KYC'd on one platform can be accepted by other issuers plugged into the same claim system. The ecosystem claims tokenized assets in the $28B+ range.
- **ERC-20 + external allowlist**: choose it when **every transfer is mediated by a single venue or transfer agent anyway**. Since the intermediary is unavoidably present, keeping the complexity off-chain is simpler, cheaper in gas, and far easier for exchanges and custodians to support. This is the **BUIDL-style** choice.
- **ERC-4626 wrapper**: choose it when **DeFi integration is the product** (Stage 6.4). \`deposit\`/\`convertToShares\` is a language protocols already speak; pair it with a transfer-gated wrapper and you get compliance and composability at once.
- **NFT / ERC-721 layer**: when the assets are **unique, indivisible units** (one house, one note, one artwork — Stage 2.5), or when each unit needs its own attributes and history.

### ② Choices 3–4: custodian and oracle/data

**Choice 3 · The custodian.** Separate two things here: **asset-side custody** (who holds the real-world thing) and **key-side custody** (who holds the on-chain private keys).

The asset side is almost entirely **determined by asset class**, with little freedom: securities → a qualified custodian or prime broker (BNY, State Street class, Stage 3.4); cash → **banks, plural** — March 2023's lesson, when Circle concentrated $3.3B at a single Silicon Valley Bank (Stage 4.3), cost a peg break; single-point concentration *is* the risk; gold → an LBMA-accredited vault and delivery chain (Stage 10.5), and ask whether it's allocated or unallocated; credit → nothing physical to custody, so this layer degenerates into servicers and collateral management.

The key side is a buy-or-build: institutional key-management tech at the Fireblocks/Anchorage tier (MPC/HSM plus a policy engine), or self-managed HSMs with multisig and timelocks (Stage 6.5's switch policies). Either way, apply the rule you already used in Stage 12.3 to judge others — **the custodian must be named and independently verifiable**. Now it applies to you: if your site only says “we partner with leading custodians,” then by your own red-flag checklist, you are the red flag.

**Choice 4 · Oracles and data.** The first question isn't technical, it's about **honesty**: **the NAV cadence must match how often the asset can genuinely be computed.** Underlying is treasuries and repo, computable daily → update daily. Underlying is a building valued by quarterly appraisal → say plainly “quarterly valuation, carried at cost in between,” don't dress it up as a real-time price (Stage 3.5). **Fake real-time is the data layer's most common lie.**

Only then comes the architecture choice: a **single-signer admin feed** (cheap, centralized — perfectly fine for a product serving only its own portal, as long as you disclose “this price is published by the issuer”); or an **oracle network** (when the consumers are third-party protocols that **shouldn't have to trust you alone** — if your token is used as collateral by a lending protocol, the price must be independently verifiable, Stage 8.2). Plus an optional piece: if your product claims reserves, it should carry a **PoR** feed (Stage 8.3) — while remembering its boundary: it proves “X was there at a moment,” never “X isn't simultaneously owed to someone else.”

### ③ Choices 5–6: KYC vendor and distribution venue

**Choice 5 · The KYC/compliance vendor.** Three screens, asked in order: **geographic coverage** (which countries are your target buyers in? Vendor depth in Southeast Asia, Africa, and Latin America varies enormously — and that's the make-or-break for a global Reg S retail product); **claim-issuance integration** (can it write claims directly into an ONCHAINID-class registry, or does it hand you a PDF you must carry on-chain yourself — the latter means building and operating a glue layer); and **monitoring & revocation SLAs** (Stage 7.1) — sanctions lists change daily, so how often does the vendor rescreen your existing holders, and how fast do they notify you on a hit? That SLA is literally the width of the window between “compliant” and “in violation.”

**Choice 6 · Distribution and venue.** **A primary portal is always required** — it's the one interface between you and your investors that necessarily exists. **An ATS or licensed venue only when secondary is real** (Stage 9.1's honesty: fifty holders don't need an exchange, they need more holders). **DeFi adapters require legal sign-off**: putting the token in a pool means addresses you never KYC'd can gain indirect exposure — is that pool's eligibility geometry compatible with your offering exemption? (Stage 9.3's “wrapped legal risk.”) That's not an engineering question; it's a gate that only a legal opinion opens.

### ④ Three worked designs: the framework run end to end

**Design A · An institutional tokenized money-market fund (qualified purchasers, Reg D).** The buyers are corporate treasuries and crypto-native funds; they want “on-chain cash that earns,” and it must pass their own compliance desks. Line by line: **chain** — Ethereum mainnet, because institutional custodians support it and L2 economics aren't needed (few subscriptions, each enormous); **standard** — ERC-20 + transfer-agent allowlist, because every transfer clears a licensed TA anyway, so the on-chain claim system would go unused; **custody** — a BNY-class qualified custodian plus an independent fund administrator computing NAV; **data** — an admin NAV feed with an on-chain mirror for transparency (the consumers are mainly your own portal, so no oracle network needed); **KYC/TA** — a Securitize-class full stack (TA license + broker-dealer + KYC); **distribution** — primary only, with an instant USDC subscription/redemption facility so institutions can move on weekends. Write that spec, then look back at Stage 10.1 — **you just re-derived BUIDL from first principles**: Ethereum first, Securitize as TA, BNY Mellon as custodian, $5M minimum, Reg D qualified purchasers, daily dividends minted as new tokens. That's not a coincidence; it's because **the constraints determine the architecture uniquely**.

**Design B · Global retail real-estate income (Reg S, US persons excluded).** The buyers are global (non-US) retail investors, $50–500 a ticket, expecting weekly or monthly rent. **Chain** — an L2, because a $12 rent distribution can't cost $3 in gas; **standard** — ERC-3643, because verified non-US holders need peer-to-peer transferability and reusable claims cut acquisition cost; **custody/operations** — a property manager (a named one) with a named bank account, and **operational SLAs written into the documents**: repair response times, vacancy reporting, proof of property-tax payment; **data** — monthly-honest NAV (quarterly third-party appraisal, adjusted monthly for rent cash flow) with the valuation method disclosed explicitly; **KYC** — a vendor with real emerging-market coverage (this single choice makes or breaks the product); **distribution** — a primary portal plus an internal bulletin-board match, with the documents stating plainly that **exit may take months**. This is **RealT plus the lessons** (Stage 10.4): the token mechanics were never the problem; what's added is operational SLAs, an honest valuation cadence, and correctly set exit expectations.

**Design C · A DeFi-facing treasury vault (non-US, Reg S).** The buyers are DeFi protocols and on-chain capital; the product's value proposition *is* **composability**. **Chain** — public L1/L2, no alternative; **standard** — ERC-4626 with a transfer-gated wrapper, so protocols integrate through an interface they already read; **data** — an **oracle-network NAV feed**, because the consumers are third parties who neither can nor should trust your single signer; plus a **PoR** feed for protocols to reference in liquidation logic; **custody** — a licensed custodian plus an independent administrator; **compliance** — Reg S non-US persons, with a **40-day transfer lock** after mint, then free float; **distribution** — DeFi adapters (with a legal opinion on pool eligibility) plus primary subscribe/redeem. That is the **shape of USDY** (Stage 10.2): non-US, Reg S, a yield-bearing note, a 40-plus-day lock, then free circulation on-chain.

Put the three side by side and you see that **every technical difference is driven by a buyer difference**: institutional buyers produced ERC-20+TA, global retail produced L2+ERC-3643, protocol buyers produced ERC-4626+oracle network. A and C are both “tokenized treasuries” and share almost no stack component — because their buyers differ.

### ⑤ The causal chain in one sentence

Compress the whole framework: **pick your buyers, buyers pick the law, law picks the structure, structure picks the technology; the projects that run it backwards all die in Stage 10.6.**

That sentence is also a diagnostic. Next time someone shows you an RWA project, one question suffices: “why did you choose that chain / that standard?” If the answer is a technical property (“it's faster,” “it's cheaper,” “it's more decentralized”), the project probably never reasoned backwards from buyers. If the answer is “because our target buyers' custodian only supports it,” you're talking to a team that has thought it through.

If you take away one sentence: **upstream of every technical choice is a legal choice, and upstream of every legal choice is “who are we selling to” — the selection table is just a mirror held up to that causal chain.**
`,

  demo: "stack-picker",

  analogy: `
Think of choosing a stack as **choosing a wedding venue**.

Beginners ask, “which venue is best?” — a question as unanswerable as “which chain is best.” A seasoned planner asks only three things: **how many guests, where are they coming from, what's the budget**. With those three answers the venue is practically derived: eighty guests flying in means near the airport, with accommodation; three hundred local relatives means parking and a big hall; a tight budget with an outdoor ceremony means avoiding peak-season Saturdays. **Nobody books a venue first and then decides whom to invite.**

Chains, standards, and custodians work the same way. “Our buyers are licensed institutions” is like “all guests are flying in”: **it locks a whole chain of downstream choices in one stroke** — the custodian must be on their approved list, the chain must be on the custody tech's supported list, and transfers must leave an auditable trail.

**Choosing an oracle is like deciding whether to hire a notary.** For a family dinner among relatives, the host announcing the count is fine; the moment a third party has to make decisions based on that number (an insurer, a court, a lending protocol), you need a witness the host didn't appoint.

Finally, weddings that book the flashiest venue first and back-solve the guest list share a familiar ending: a beautiful room, very few people. **That is the shape of the entire Stage 10.6 graveyard.**
`,

  misconceptions: [
    "“Choosing a chain is about TPS, fees, and decentralization.” —— For institutional products, the first decision input is which chains your buyers' qualified custodian supports. That list is hard-coded by their compliance desk and doesn't accept performance arguments. Technical parameters only start mattering inside that list.",
    "“ERC-3643 is more advanced than ERC-20, so security tokens should use it.” —— Its value is enabling peer-to-peer transfers among verified holders. If every transfer clears a licensed transfer agent anyway (BUIDL's situation), you pay for on-chain claim machinery you never use, and ERC-20 + external allowlist is cleaner.",
    "“More frequent NAV updates are obviously better.” —— The cadence must match how often the asset can genuinely be computed. A building priced by quarterly appraisal but ticking every second on-chain isn't advanced, it's invented. Saying “quarterly valuation” honestly is more professional than faking real-time (Stage 3.5).",
    "“It's only legitimate if it uses an oracle network.” —— If the data's only consumer is your own portal, a disclosed single-signer admin feed is sufficient and cheaper. The oracle network exists so third-party protocols that **shouldn't trust you alone** can use the number — consumer structure decides architecture, not prestige.",
    "“Pick a good custodian and the assets are safe.” —— Also ask how many. In March 2023 Circle's legal structure was flawless; the problem was $3.3B at one bank. Cash custody must be plural — a rule bought with USDC trading at $0.87.",
    "“Plugging the token into a DeFi pool is an engineering task.” —— It's a legal task. A pool means addresses you never KYC'd gain indirect exposure, and whether that eligibility geometry is compatible with your exemption needs a legal opinion (Stage 9.3). Engineering is only what happens after the opinion.",
  ],

  quiz: [
    {
      q: "When choosing a chain for a tokenized money-market fund aimed at US qualified purchasers, what's the first decision input?",
      options: ["The chain's TPS and fees", "Which chains the buyers' qualified custodian supports — a list hard-coded by their compliance desk", "How many DeFi protocols are in the ecosystem", "Which chain the founding team knows best"],
      answer: 1,
      explain: "Institutions won't change custodians for you. The custody tech's supported list defines the option set; technical parameters only matter inside it.",
    },
    {
      q: "When is ERC-20 + an external allowlist a better fit than ERC-3643?",
      options: ["Never — ERC-3643 is more advanced", "When every transfer clears a licensed transfer agent or a single venue anyway — the on-chain claim machinery goes unused; this is BUIDL's choice", "When peer-to-peer transfers are needed", "When integrating with DeFi"],
      answer: 1,
      explain: "The standard follows the transfer topology. With an intermediary unavoidably present, keeping complexity off-chain is simpler, cheaper in gas, and easier for custodians and exchanges to support.",
    },
    {
      q: "When must you use an oracle network instead of a single-signer admin feed?",
      options: ["Always, for any product with a NAV", "When the data's consumers are third-party protocols that shouldn't have to trust you alone — e.g. your token used as lending collateral", "When NAV updates daily", "When regulators require it"],
      answer: 1,
      explain: "Serving only your own portal, a disclosed admin feed is enough and cheaper. Consumer structure decides architecture: third-party protocols need an independently verifiable number.",
    },
    {
      q: "Why does Design B (global retail real-estate income) pick an L2 over Ethereum mainnet?",
      options: ["L2s are more decentralized", "Because small weekly/monthly rent distributions (say $12) would be eaten by mainnet gas — the product wouldn't work economically", "Because L2s pass regulation more easily", "Because mainnet doesn't support ERC-3643"],
      answer: 1,
      explain: "High-frequency small retail distributions are the textbook case for an L2. Cost is a decision input for this product, not an aesthetic preference.",
    },
    {
      q: "What is the whole selection framework in one sentence?",
      options: ["Pick the newest, fastest tech and the business will follow", "Pick your buyers, buyers pick the law, law picks the structure, structure picks the technology; projects that run it backwards die in Stage 10.6", "Pick the chain first and arrange everything else around it", "Budget first — save wherever possible"],
      answer: 1,
      explain: "The selection table is a mirror held up to that causal chain: ask a team why they chose their chain, and whether the answer is a technical property or a buyer constraint tells you whether they thought it through.",
    },
  ],

  further: [
    { label: "ERC-3643 official site (spec and ecosystem data)", url: "https://www.erc3643.org/" },
    { label: "EIP-4626: the tokenized vault standard", url: "https://eips.ethereum.org/EIPS/eip-4626" },
    { label: "Chainlink: NAV/SmartData and Proof of Reserve docs", url: "https://docs.chain.link/data-feeds/proof-of-reserve" },
    { label: "BlackRock BUIDL product page (check Design A against the real answer)", url: "https://securitize.io/blackrock/buidl" },
    { label: "Ondo Finance docs (check Design C against the real answer: USDY and its lock)", url: "https://docs.ondo.finance/" },
  ],
};
