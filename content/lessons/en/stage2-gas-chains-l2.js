export default {
  id: "gas-chains-l2",
  stage: 2,
  order: 6,
  title: "Gas, Public & Permissioned Chains: Where RWAs Live",
  difficulty: "core",
  prereqs: ["erc20-tokens"],

  oneLiner:
    "Every on-chain operation burns compute, and the fee (gas) is paid in the chain's own coin — spiking when the network is congested. That makes “which chain to live on” a hard-money business decision. RWA's addresses are all over the map: BlackRock's BUIDL lives on expensive-but-canonical Ethereum mainnet, Franklin's BENJI was born on payments-friendly Stellar, and JPMorgan simply built its own private residence (Kinexys). The real tradeoff isn't tech fashion but one axis: a public chain's composability and distribution versus a permissioned chain's privacy and control — and the final call belongs to your buyers' custody capability and privacy needs.",

  intuition: `
So far we've said “the chain” as if there were only one. In reality there are hundreds — and **which chain to live on is one of the earliest calls an RWA issuer must make**. Get it wrong and the product is too expensive to use, too slow to trade, or too exposed for institutional clients to touch.

First, feel the texture of the problem. At Ethereum's most congested moments in 2021, one ERC-20 transfer cost tens of dollars in fees — **$50 of tolls to move $100 of tokens**. That business doesn't work. Hence Layer-2 networks (L2s) ten to a hundred times cheaper, and a crop of new public chains. But is cheap everything? When BlackRock launched BUIDL in 2024, it knew Ethereum mainnet was the most expensive venue — and made it home anyway: **institutions aren't buying savings, they're buying maximum security and neutrality**. JPMorgan went further still: it lives on no public chain at all, having built a bank-only private one. Three choices, three logics, none of them wrong — only different answers to “**who is this product sold to**.”

This lesson takes the siting question apart: what gas money actually is, which “districts” exist, which real RWA tenants live in each, and which axes experts actually weigh. Afterwards, the line “deployed on chain XX” in any RWA announcement will read completely differently to you.

**Here's the map — four parts:**

- **① Gas: every step on-chain pays a fuel fee**
- **② The venue menu: six addresses, and their real RWA tenants**
- **③ The real tradeoff axis: public composability vs private control**
- **④ Rule of thumb: the buyers pick the chain, not tech fashion**
`,

  mechanics: `
### ① Gas: every step on-chain pays a fuel fee

Recall Stage 2.1: a chain is thousands of computers each re-executing the same transaction. Your one transfer gets computed and stored by the entire network — someone has to pay for that, and the unit of payment is called **gas**. The mechanism in three sentences:

- **Every operation has a posted price**, measured in compute. A plain ETH transfer costs 21,000 gas; an ERC-20 \`transfer\` (editing the contract's table) about 50,000–65,000 gas; deploying a contract runs to millions;
- **The unit price floats with congestion**: what you pay = gas used × gas price, set by an auction-like mechanism — the more people trying to squeeze into the next block, the higher it goes. Fees are paid in **the chain's own coin** (ETH on Ethereum), so even if you only ever move stablecoins, your wallet needs ETH for tolls;
- **Congestion hurts**: on Ethereum mainnet (the industry says **L1**, layer one), an ERC-20 transfer costs tens of cents to a few dollars in calm times; in past manias it spiked above $50. As of 2025 it mostly hovers around $1 — imperceptible on a million-dollar institutional subscription, fatal for a $50 retail fraction.

L1 is expensive, but expensively justified: it is the **supreme court of settlement** — the most decentralized, longest-lived, hardest-to-attack ledger. Which raises the next question: if you'd rather not pay supreme-court prices, where else can you go?

### ② The venue menu: six addresses, and their real RWA tenants

As of 2025, the RWA map falls into roughly six districts, each with tenants you can name:

- **Ethereum L1**: priciest, slowest, most canonical. **BUIDL's home turf** — BlackRock chose it knowing the gas bill, because institutional clients want maximum security, neutrality, and the deepest stablecoin/DeFi ecosystem. The bulk of tokenized treasuries still sits here;
- **L2 rollups (Arbitrum, Base, Optimism…)**: batch and compress hundreds of transactions “upstairs,” then post the results back to Ethereum L1 for the record — **inheriting L1's security while cutting fees to cents**. Skip the internals; remember “L2 = a cheaper floor anchored to L1.” Treasury tokens and yield-bearing stablecoins have spread fast across L2s in the last two years — the natural habitat for retail-facing RWA;
- **Other public L1s**: **Stellar** — built for payments, near-zero fees, **the original home of Franklin Templeton's BENJI** (2021, the first US-registered fund on a chain); **Solana** — very high throughput, tiny fees, the tokenization venue issuers raced into through 2024–25; **Avalanche** offers subnets where institutions can carve out semi-custom zones;
- **Permissioned / institutional chains**: an entirely different philosophy — **who may validate and who may see the books both require approval**. Three flagships: **JPMorgan's Kinexys** (formerly Onyx) — a bank-run private chain settling interbank repo and payments, billions of dollars a day; **Canton Network** — a “privacy-first interoperability network” for institutions, where each participant sees only the transactions that concern it, built by a consortium of financial giants; **Provenance** — the ledger on which Figure has registered **$10B+ of HELOCs** (home-equity loans), perhaps the biggest “silent RWA” story;
- Boundary note: permissioned chains have no anonymous retail, and gas is often a non-issue (or not charged at all) — but **the outside world can't plug in either**: no DeFi, no public liquidity. That's the core tradeoff of the next section.

<figure>
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="gcl2-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <line x1="40" y1="60" x2="600" y2="60" stroke="var(--orange-ink)" stroke-width="2" marker-end="url(#gcl2-arr-en)"/>
  <line x1="600" y1="60" x2="40" y2="60" stroke="var(--orange-ink)" stroke-width="2" marker-end="url(#gcl2-arr-en)"/>
  <text x="60" y="40" font-size="12" fill="var(--ink)" font-weight="700">Public · composable · visible to all</text>
  <text x="600" y="40" text-anchor="end" font-size="12" fill="var(--ink)" font-weight="700">Private · controlled · by permission</text>
  <rect x="40" y="86" width="100" height="64" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="90" y="108" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="600">Ethereum L1</text>
  <text x="90" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">pricey, canonical</text>
  <text x="90" y="141" text-anchor="middle" font-size="9" fill="var(--ink)">BUIDL's home</text>
  <rect x="152" y="86" width="100" height="64" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="202" y="108" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">L2 rollups</text>
  <text x="202" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">inherit L1 security</text>
  <text x="202" y="141" text-anchor="middle" font-size="9" fill="var(--ink)">fees in cents</text>
  <rect x="264" y="86" width="100" height="64" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="314" y="108" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Solana/Stellar</text>
  <text x="314" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">speed, near-zero fees</text>
  <text x="314" y="141" text-anchor="middle" font-size="9" fill="var(--ink)">BENJI born on Stellar</text>
  <rect x="376" y="86" width="100" height="64" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="426" y="108" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Canton-style</text>
  <text x="426" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">privacy-first interop</text>
  <text x="426" y="141" text-anchor="middle" font-size="9" fill="var(--ink)">consortium-built</text>
  <rect x="488" y="86" width="112" height="64" rx="8" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="544" y="108" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Bank private</text>
  <text x="544" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">Kinexys / Provenance</text>
  <text x="544" y="141" text-anchor="middle" font-size="9" fill="var(--ink)">permission only</text>
  <rect x="40" y="176" width="560" height="60" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="320" y="200" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Go left: maximum distribution & composability — and everyone sees your every flow</text>
  <text x="320" y="220" text-anchor="middle" font-size="11" fill="var(--ink)">Go right: maximum privacy & control — and no outside liquidity or DeFi can plug in</text>
</svg>
<figcaption>Six addresses on one axis: public-composable at one end, private-controlled at the other. Real RWA tenants live along its whole length — there is no “right answer,” only “sold to whom.”</figcaption>
</figure>

### ③ The real tradeoff axis: public composability vs private control

Strip away the marketing and these are the axes experts actually weigh:

- **Distribution & composability**: on a public chain your token auto-connects to wallets, exchanges, and DeFi protocols (Stage 2.4's standard superpower) — distribution comes free. On a permissioned chain every new participant goes through onboarding, and the ecosystem is near zero;
- **Who can see the flows**: on a public chain **every transfer is globally visible**. For retail that's a transparency virtue; for institutions it's a business-intelligence disaster — competitors watch your addresses to reconstruct positions, and market makers who spot a large subscription or redemption brewing can **front-run your NAV trades** (Stage 7.4 tackles this tension head-on; zero-knowledge proofs are the candidate cure);
- **Who can validate (run the ledger)**: anyone on a public chain — maximum censorship resistance; only approved institutions on a permissioned one — which regulators actually like: when something breaks, there's a named party to hold accountable;
- **Regulatory comfort**: a bank's compliance department approves “all participants identified, ledger permissions controlled” far more easily; though on the public side, acceptance has risen year by year as flagships like BUIDL prove out;
- **The multichain reality**: this isn't single-choice. **BUIDL bridges to 7+ chains via Wormhole** — the master ledger sits on Ethereum, but shares flow out to Solana, Avalanche, and the L2s to reach different users. Why bother? Because **distribution wins** — at the price of **bridge risk** (bridge hacks have cost billions across crypto's history; it's a new line item that must appear on the risk list).

### ④ Rule of thumb: the buyers pick the chain, not tech fashion

Compress the axes into one actionable rule: **don't ask “which chain has the best tech” — ask “what can my buyers custody, and how much exposure can they tolerate.”**

- Selling to **qualified institutions** (like BUIDL, $5M minimum): your buyers use custodians like BNY Mellon or Coinbase Custody — you live wherever the custodian supports and the auditor recognizes. That usually means Ethereum L1, where gas is a rounding error against seven-figure tickets;
- Selling to **global retail** (like yield-bearing stablecoins): your buyers hold phone wallets, so cent-level fees and second-level confirmation are non-negotiable — L2s, Solana, and Stellar are the natural habitat, and you go multichain to chase distribution;
- Selling to **fellow banks** (deposit tokens, interbank repo): privacy and regulatory accountability trump everything — permissioned environments like Kinexys and Canton are practically the only option.

Notice that **not one of those three lines was decided by “whose tech is better”** — every one was decided by the customer base. In Stage 13.3 (choosing the stack) this rule expands into a full decision checklist covering custodians, standards, and oracles too.

If you take away one sentence: **gas makes “which chain to live on” a hard-money business decision, and the siting yardstick is a single axis — a public chain's distribution and composability traded against a permissioned chain's privacy and control; the final call comes not from tech fashion but from who your buyers are.**
`,

  demo: "chain-picker",

  analogy: `
Think of choosing a chain as **choosing a storefront** for a new shop. **Ethereum L1** is prime street-level frontage in the global financial capital: the highest rent, the slowest build-out, but foot traffic from the whole world — and “we're located here” is itself a credential. BlackRock put its flagship store on this street precisely for the address's legitimacy.

**L2s** are the **second floor of the same tower**: the elevator connects straight down (security underwritten by the building), and rent is a hundredth of street level. Volume-driven, price-sensitive retail naturally moves upstairs. **Solana and Stellar** are new commercial districts in other cities: fresh infrastructure, cheap rents, distinctive crowds — Stellar is like a port town that specializes in remittances, which is why Franklin opened its first store there.

**Permissioned chains** are a different business model altogether: **members-only private clubs**. No street frontage, no sign on the door; entry requires an invitation (admission permissioning), and no outsider hears a word of the deals inside. JPMorgan's Kinexys is a club the bank built for itself; Canton is a cluster of clubs co-built by giants, with private rooms invisible to one another. The club's cost is equally plain: **street traffic can never come in** — you've given up the entire public market's flow.

Finally there's **chain-store expansion**: BUIDL keeps its flagship in the capital (Ethereum) and opens branches in seven or eight other cities over “bridges” (multichain deployment) — more branches, more customers, but every bridge between two cities is an armored-truck route that must be defended. The ultimate storefront question was never “which building looks grandest.” It is: **who are your customers, and which door will they walk through?**
`,

  misconceptions: [
    "“Gas is a percentage of the amount transferred — send more, pay more.” —— No. Gas prices compute, not value: moving $100 of USDC and moving $100M cost nearly the same fee. That's exactly why large institutional settlement is cheap on-chain while small retail gets eaten alive on L1.",
    "“The cheapest chain is the best chain — everyone will migrate there eventually.” —— BUIDL is the counterexample: it made the most expensive venue, Ethereum L1, its home because institutions buy security, neutrality, and canonicity, and gas is a rounding error. Fees are one axis among several; the customer base decides.",
    "“An L2 is just another independent chain that must defend itself.” —— Rollup-style L2s post their transaction batches back to Ethereum L1 for the record, anchoring their security to L1 — the essential difference from a from-scratch new chain, and the reason institutions accept L2s more readily.",
    "“Permissioned chains aren't decentralized, so they're ‘fake blockchains’ with no value.” —— For interbank business, “all participants identified, ledger permissions controlled” is the requirement, not a defect: Kinexys settles billions a day, and Provenance carries $10B+ of HELOCs. The test is fit-for-business, not decentralization purity.",
    "“Public-chain transfers are anonymous, so institutions needn't worry about exposure.” —— Addresses are pseudonymous, not anonymous: a large institution's addresses get identified fast and tracked continuously, turning subscription/redemption flows into public business intelligence — even front-run. It's one of institutions' most practical objections to public chains (Stage 7.4).",
    "“Multichain deployment is pure upside — the more chains the better.” —— Every added chain adds a bridge, and bridges are among the most-hacked component classes in crypto history. BUIDL bridging to 7+ chains is a judged tradeoff — distribution gain > bridge risk — not a free lunch. In diligence, always ask whose bridge is underneath.",
  ],

  quiz: [
    {
      q: "What is a gas fee priced on?",
      options: ["A percentage of the amount transferred", "The compute an operation consumes × a unit price that floats with congestion, paid in the chain's own coin", "A fixed monthly fee", "Issuers subsidize it; users always pay nothing"],
      answer: 1,
      explain: "Compute, not value: $100 and $100M cost nearly the same to move. Great for large institutional settlement, brutal for small retail on L1.",
    },
    {
      q: "BlackRock knew Ethereum L1 had the highest gas, yet made it BUIDL's home. The most likely reason?",
      options: ["Ethereum paid for promotion", "Institutional clients want maximum security, neutrality, and ecosystem canonicity — gas is negligible next to million-dollar subscriptions", "No other chain supports ERC-20", "L1 has the fastest transfers"],
      answer: 1,
      explain: "For a $5M-minimum product, clients weigh the ledger's attack cost and custodian/auditor support — not a few dollars of tolls.",
    },
    {
      q: "What is the essential difference between an L2 rollup and a from-scratch new public chain?",
      options: ["L2 tokens are cheaper", "An L2 posts its transaction batches back to Ethereum L1 for the record, anchoring its security to L1; a new chain must secure itself with its own validator set", "L2s don't support smart contracts", "L2s can only run stablecoins"],
      answer: 1,
      explain: "“Inherit L1 security + fees in cents” is the entire L2 pitch — and why retail-facing RWA is flooding there.",
    },
    {
      q: "Institutions' most practical objection to public chains is that “flows are visible to all.” What concrete harm does that cause?",
      options: ["Higher gas fees", "Competitors track positions, and market makers spotting large subscriptions/redemptions can front-run NAV trades — business intelligence laid bare", "Tokens get frozen", "Regulators ban it outright"],
      answer: 1,
      explain: "Addresses are pseudonymous, not anonymous; big institutions get identified and tracked. Reconciling privacy with compliance is Stage 7.4's subject.",
    },
    {
      q: "BUIDL bridges to 7+ chains via Wormhole. What are the gain and the price of that decision?",
      options: ["Gain: cheaper gas; price: slower speed", "Gain: maximum distribution — shares reach different users on each chain; price: cross-chain bridges, a component class with a brutal loss history", "Gain: compliance; price: liquidity", "There is no price — multichain is a free lunch"],
      answer: 1,
      explain: "“Distribution wins” is the public-chain iron law, but every bridge is a new attack surface — bridge hacks total billions, and diligence must cover it.",
    },
    {
      q: "By this lesson's rule of thumb, where should an interbank deposit token live?",
      options: ["The public chain with the cheapest gas", "The public chain with the most users", "A permissioned chain like Kinexys/Canton — identified participants, controlled ledger, guaranteed privacy, matching banks' compliance and accountability needs", "Anywhere; bridges fix everything"],
      answer: 2,
      explain: "Buyers pick the chain: interbank business puts privacy and regulatory accountability above all, and public composability has nothing to offer it. Stage 13.3 expands this into a full selection checklist.",
    },
  ],

  further: [
    { label: "ethereum.org: gas and fee mechanics", url: "https://ethereum.org/en/developers/docs/gas/" },
    { label: "L2Beat: scale, tech, and risk comparison across L2s (the industry's standard reference)", url: "https://l2beat.com" },
    { label: "Canton Network: the privacy-first institutional interoperability network", url: "https://www.canton.network/" },
    { label: "JPMorgan Kinexys (formerly Onyx): the bank-run blockchain platform", url: "https://www.jpmorgan.com/kinexys" },
    { label: "ethereum.org: what is Layer 2", url: "https://ethereum.org/en/layer-2/" },
  ],
};
