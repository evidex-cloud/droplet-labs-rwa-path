export default {
  id: "platform-architecture",
  stage: 13,
  order: 1,
  title: "The Architecture: Six Components of a Tokenization Platform",
  difficulty: "mastery",
  prereqs: ["risk-map"],

  oneLiner:
    "You've now seen RWA from every angle — time to move to the builder's chair. A tokenization platform is not “a smart contract”; it's six components meshing into one system: the legal & structuring engine, the identity & compliance layer, the token engine, the asset servicing layer, the data & oracle layer, and the distribution & markets layer. Better yet, the architecture is the risk map turned inside out: every risk layer in Stage 12.1 exists precisely because some component here can fail. This lesson is the master assembly drawing for the whole course.",

  intuition: `
Picture this: your CEO walks into the meeting room and says, “We've decided to tokenize our money-market fund, and you're leading it. Draw me the system diagram.” You uncap the whiteboard marker — and draw what?

If what pops into your head is “an ERC-3643 contract plus a website,” the knowledge from twelve stages is still lying around in pieces, unassembled. Because you already know: a token needs a **legal wrapper** to mean anything (Stage 5), every transfer must pass **compliance checks** (Stage 7), a fund needs someone to **compute NAV daily, manage custody, and pay distributions** (Stages 3.3, 8.4), the chain is blind so it needs a **data pipeline** (Stage 8), and investors need a **way in and a way out** (Stage 9). These aren't background reading — each one is a box you must draw on that whiteboard.

This lesson is the model answer for that whiteboard: **six boxes, plus the arrows between them that must reconcile**. And there's a beautiful symmetry to help you remember it: flip Stage 12.1's six-layer risk map **inside out** and you get this architecture — each risk layer is a risk layer precisely because one component here can fail. The evaluator sees risks from the outside; the builder sees components from the inside. **They are two faces of the same diagram.**

**Here's the map — five parts:**

- **① The master diagram: six boxes, and the arrows between them**
- **② The downstream three: legal engine, compliance layer, token engine**
- **③ The upstream three: asset servicing, data pipeline, distribution & markets**
- **④ Cross-cutting concerns: keys, the reconciliation spine, observability, jurisdiction routing**
- **⑤ BUILD vs BUY: the real landscape and the decision rule**
`,

  mechanics: `
### ① The master diagram: six boxes, and the arrows between them

Here's the full picture up front. Six components, arranged from “closest to the law” to “closest to the market”:

<figure><svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="parch-arr-en" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--orange-line)"/></marker></defs><rect x="20" y="30" width="185" height="70" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="112" y="58" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">① Legal &amp; Structuring</text><text x="112" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">SPV · docs · register regime</text><rect x="228" y="30" width="185" height="70" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="58" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">② Identity &amp; Compliance</text><text x="320" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">KYC → claims · revocation</text><rect x="436" y="30" width="185" height="70" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="528" y="58" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">③ Token Engine</text><text x="528" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">standard · airlocks · switches</text><rect x="20" y="220" width="185" height="70" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="112" y="248" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">④ Asset Servicing</text><text x="112" y="268" text-anchor="middle" font-size="10" fill="var(--muted)">custody · NAV · payouts · recon</text><rect x="228" y="220" width="185" height="70" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="248" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">⑤ Data &amp; Oracles</text><text x="320" y="268" text-anchor="middle" font-size="10" fill="var(--muted)">NAV feeds · PoR · supply recon</text><rect x="436" y="220" width="185" height="70" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="528" y="248" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="bold">⑥ Distribution &amp; Markets</text><text x="528" y="268" text-anchor="middle" font-size="10" fill="var(--muted)">primary portal · ATS · DeFi</text><path d="M205 65 L228 65" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#parch-arr-en)"/><path d="M413 65 L436 65" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#parch-arr-en)"/><path d="M205 255 L228 255" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#parch-arr-en)"/><path d="M413 255 L436 255" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#parch-arr-en)"/><path d="M528 220 L528 100" stroke="var(--orange-line)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#parch-arr-en)"/><text x="545" y="165" font-size="10" fill="var(--orange-ink)">subscribe→mint</text><path d="M112 100 L112 220" stroke="var(--line)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#parch-arr-en)"/><text x="120" y="165" font-size="10" fill="var(--muted)">custody orders</text><text x="320" y="330" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="bold">Three sample flows</text><text x="320" y="352" text-anchor="middle" font-size="10" fill="var(--muted)">Subscription: ⑥→②→③→④ · NAV: ④→⑤→⑥ · Court order: ①→③ (forcedTransfer)</text><text x="320" y="380" text-anchor="middle" font-size="10" fill="var(--muted)">Each failed box = one risk layer in Stage 12.1; each broken arrow = a reconciliation incident</text></svg></figure>

Learn to read the **arrows** first, because the arrows are the soul of this diagram. Trace three real flows. **A subscription** enters through ⑥'s portal (the investor fills forms, wires money), passes through ② (KYC, eligibility check, on-chain claim issued), reaches ③ (the mint airlock opens, tokens land in the investor's wallet) — while ④ receives fiat off-chain, buys the underlying asset, and updates the fund's books. **A NAV update** starts in ④ (the fund administrator computes it after each close), gets fed on-chain by ⑤ (heartbeats and deviation thresholds, Stage 8.2), and is finally read by the portal and DeFi protocols in ⑥. **A court freeze order** is served on ① (the legal entity is the defendant), whose compliance decision triggers \`freezePartialTokens\` or \`forcedTransfer\` in ③ (Stage 6.5). Notice: no flow touches only one box — **the essence of a tokenization platform is making six boxes give the same answer about the same transaction**.

### ② The downstream three: legal engine, compliance layer, token engine

**Box ① · The legal & structuring engine.** Job: form and maintain the issuing entity (Delaware LLC, BVI fund, trust — Stage 5.2), draft the offering documents (PPM, subscription agreement), and choose the **register regime** — is the token itself the legal register (the Wyoming/Luxembourg/Liechtenstein route, Stage 5.3), or is the transfer agent's ledger authoritative with the chain as a mirror? Interfaces: it gives ③ the legal authority behind every switch, and connects outward to the **transfer agent** and **corporate registrars**. Typical vendors: law firms in the fund's jurisdiction, corporate secretaries/registered agents, licensed transfer agents (Securitize's TA license exists for exactly this). Failure mode: fake wrappers, missing true sales, two registers contradicting each other — the source of Stage 12.1's **Layer 3 (legal/structural) risk**, and the ugliest deaths in Stage 10.6's graveyard.

**Box ② · The identity & compliance layer.** Job: turn “this person is eligible to hold” into a machine-checkable fact — after the KYC/AML pipeline (Stage 7.1) clears someone, issue a claim to an **on-chain claim registry** (ONCHAINID and kin, Stage 6.3) or add the address to an allowlist; run the **eligibility engine** (is this investor accredited? A US person? Would this breach a holder cap? — Stage 7.2); and the piece everyone forgets: **ongoing screening and revocation** — when a holder lands on a sanctions list, the claim must be revocable and the tokens freezable. Interfaces: upstream to KYC vendors and sanctions data feeds; downstream, it is consulted by every \`transfer\` check in ③ (the check chain of Stage 7.3). Typical vendors: Sumsub/Persona-class identity verification, sanctions and chain-analytics data providers. Failure mode: letting in someone who shouldn't be in — the fine lands on ①'s legal entity, and what it destroys is the **issuer layer and legal layer** of trust.

**Box ③ · The token engine.** Job: choose and deploy the token standard (ERC-3643 / ERC-20 + allowlist / ERC-4626 — the next lesson covers how to pick), manage the **mint/burn airlocks** (mint only after ④ confirms cash arrived; release redemption cash only after ③ burns the tokens), hold the **control switches** (\`pause\`, \`freezePartialTokens\`, \`forcedTransfer\`, \`recoveryAddress\`, Stage 6.5), and govern **upgrades** (who may swap the contract logic). Interfaces: deployed on one or more chains, integrating wallets and custody tech, constrained by ②'s eligibility checks, driven by ①'s legal authority. Typical vendors: Tokeny-class ERC-3643 suites, self-built on OpenZeppelin libraries, plus independent audit firms. Failure mode: contract bugs, stolen admin keys, hacked bridges — Stage 12.1's **Layer 6 (contract/chain)**.

### ③ The upstream three: asset servicing, data pipeline, distribution & markets

**Box ④ · The asset servicing layer.** This course has said it twice already; here's the third time: **this is the most underestimated box in the whole diagram.** Job: integrate custodians (the assets really are locked at a BNY-class custodian/vault/bank account, Stage 3.4), compute **NAV every day** with the fund administrator (Stage 3.3), execute **distributions and corporate actions** (how cash flows back to holders — BUIDL mints daily interest as new tokens, RealT pays weekly USDC rent, Stage 8.4), and the unglamorous but lethal word: **reconciliation** — on-chain token supply, the transfer agent's ledger, and the custodian's statements must agree, every day. Interfaces: upstream to custodians and banks; downstream it hands NAV and events to ⑤. Typical vendors: custodians (BNY, State Street tier), fund administrators, paying agents. Failure mode: the money is there but unreachable (the SVB weekend, Stage 4.3), or the people doing the work can't keep up (RealT's property mess, Stage 10.4) — **Layer 4 (custody) plus Layer 2 (issuer operations)**. Why so underestimated? Because issuance is a wedding and servicing is the decades of marriage that follow — budgets and headcount habitually go to the wedding.

**Box ⑤ · The data & oracle layer.** Job: feed ④'s NAV on-chain (an admin feed or an oracle network, heartbeat + deviation threshold, Stage 8.2), publish **Proof of Reserve** (Stage 8.3), maintain **default/event flags** (credit products especially need them), and, for multichain deployments, run **cross-chain supply reconciliation** — BUIDL's totals across seven chains must sum to the fund's share count (Stage 10.1). Interfaces: consumes ④'s data upstream; serves the portals, market makers, and DeFi protocols in ⑥. Typical vendors: Chainlink-class networks, or a self-run admin feed. Failure mode: on-chain numbers that are stale, manipulated, or prove nothing — **Layer 5 (data/oracle)**.

**Box ⑥ · The distribution & markets layer.** Job: the **primary portal** — the subscribe/redeem interface and backend (Stage 9.1) with fiat and stablecoin rails; **secondary integrations** — ATS/licensed-venue connections (Securitize Markets, tZERO, INX class), or DeFi adapters (plugging the token into Aave/Morpho-style markets, Stage 9.3). Interfaces: faces distributors, exchanges, and protocols, and calls back into ② for every new buyer's eligibility check. Failure mode: nobody comes to buy, or those who came can't leave — it maps not to one of the six layers but to the **liquidity amplifier** ring: the thinner ⑥ is, the harder it is for your investors to escape when any other layer fails.

The attentive reader notices one layer is missing: Stage 12.1's **Layer 1 (asset) risk** has no box in the architecture. Correct — **the quality of the asset itself isn't an architecture problem; it's a choice you made before drawing the diagram** (step ① of next lesson's pipeline). Architecture decides whether the receipt chain holds; it can't decide whether the thing behind the receipt is worth anything.

### ④ Cross-cutting concerns: keys, the reconciliation spine, observability, jurisdiction routing

Four things belong to no single box yet run through all of them — and they're the first things a senior engineer looks for in an architecture diagram.

- **Key management and separation of duties**: Who can mint? Who can freeze? Who can upgrade? The answer must never be “the same key.” Match the policy to the action's severity: a routine data feed can be a single-signer hot wallet; minting needs a multisig (say 3-of-5) that must verify ④'s cash confirmation; \`forcedTransfer\` and contract upgrades need multisig **plus a timelock** plus a legal ticket issued by ①. Stage 6.5 said it: every switch is an attack surface — key policy is how you shard, distribute, and lock that surface.
- **The register-sync spine**: If the legal register lives with the transfer agent and the chain is a mirror, then “who wins when chain and ledger disagree” needs a written **conflict-resolution runbook** (Stage 5.3) — after a stolen address is recovered via \`recoveryAddress\`, when and how does the TA ledger change, and who signs off. If this spine breaks, you're living in two parallel worlds at once.
- **Observability**: index every on-chain event, and set real-time alerts on **admin actions** (mints, freezes, upgrades, large outflows). Remember Phase 4 of Stage 12.3 — the ongoing monitoring investors are taught to run, five metrics plus admin-action watching? You're now on the other side of that wall: **proactively publish those five metrics as a public dashboard**, because investors trained by Stage 12.3 will come checking; if they find nothing, they leave.
- **Jurisdiction routing**: one platform usually runs several eligibility geometries at once — the same fund selling Reg D shares to US qualified purchasers and Reg S shares to non-US persons (Ondo's dual track, Stage 10.2). ②'s eligibility engine, ⑥'s portal, and ①'s documents must all route each investor to the correct rulebook by jurisdiction, not hard-code a single one.

### ⑤ BUILD vs BUY: the real landscape and the decision rule

Nobody builds all six boxes from scratch. The real landscape has two families. **Full-stack platforms**: Securitize holds a transfer agent + broker-dealer + ATS license set plus the tech stack — an issuer plugs in and runs (that's exactly how BUIDL did it, Stage 10.1); Tokeny and the Apex family offer the full ERC-3643 engine; Franklin Templeton chose to build nearly everything in-house — because it already was a licensed fund company, missing only the chain-facing sliver. **Point solutions**: buy KYC at the Sumsub/Persona tier, custody tech at the Fireblocks/Anchorage tier, oracles at the Chainlink tier, and act as your own general assembler.

The decision rule in one sentence: **buy anything that requires a license; build only your differentiator.** Transfer agency, broker-dealer, ATS, custody — these licenses take years to obtain, and the license moat is real (we priced it in Stage 10.2's Ondo discussion); your asset-selection skill, your distribution channel, your user experience are what deserve engineering hours. A seriously assembled platform typically signs **6 to 10 vendors**. Yes — recall Stage 10.1's punchline: tokenization didn't eliminate intermediaries; intermediaries **re-specialized**. Back then you read that line from the investor's chair; now you're in the builder's chair, personally signing 6 to 10 intermediaries into your architecture diagram. If you take away one sentence: **good architecture isn't six boxes — it's the arrows between them that must reconcile; whichever arrow the reconciliation dies on is the layer where the risk lives.**
`,

  demo: "platform-blueprint",

  analogy: `
Think of a tokenization platform as opening a **hospital**. Outsiders assume the heart of a hospital is the building and the equipment — just as outsiders assume the heart of a tokenization platform is the smart contract. Insiders know the building is the easy part.

A hospital's real six components map one-to-one onto your six boxes: the **medical license and legal entity** (the legal engine — without it, surgery is assault); **registration and triage** (the compliance layer — verify who you are and whether you should be admitted); the **operating theater** (the token engine — the one place where state actually changes, with the tightest permissions and fiercest audit); the **wards and logistics** (asset servicing — patients spend 95% of their time not on the table but in beds, being fed, turned, and re-bandaged; the most underestimated and most exhausting part); the **diagnostics lab** (the data layer — blood work must be fresh and accurate, because every other department decides based on it); and the **outpatient hall and discharge path** (distribution & markets — you can get in, and you can get out).

The cross-cutting concerns are the hospital's **infection control and key discipline**: the narcotics cabinet takes two people and two locks (multisig), every operation leaves a traceable record (observability), and international patients follow the international-patient process (jurisdiction routing).

Finally, no hospital builds its own CT scanners or runs its own pharmaceutical plant — **everything requiring accreditation is procured; only the flagship department is built in-house**. And you never judge a hospital by how new its building is — you judge it by whether the referral paperwork between departments **reconciles**: chart, prescription, and bill telling the same story is what makes a good hospital. The arrows, not the boxes.
`,

  misconceptions: [
    "“The core of a tokenization platform is the smart contract; everything else is periphery.” —— The opposite. The contract (box ③) is one-sixth, and the most standardized, easiest-to-buy sixth at that. What actually consumes budget and headcount is the legal engine and asset servicing — issuance is the wedding, servicing is the marriage.",
    "“The architecture diagram and the risk map are two separate bodies of knowledge.” —— They're two faces of one diagram. Every risk layer in Stage 12.1 corresponds to a component here that can fail: legal-layer risk = box ① failing, custody-layer risk = box ④ failing. Evaluators look from outside; builders look from inside.",
    "“Reconciliation is a back-office chore, not an architecture concern.” —— Reconciliation is the architecture's spine. On-chain supply, the transfer agent's ledger, and the custodian's statements must agree daily; wherever an arrow's reconciliation breaks is where risk erupts. RealT and countless dead projects lost right there.",
    "“Building everything yourself proves technical strength.” —— Any component needing a license (transfer agent, broker-dealer, ATS, custody) takes years to license; building it yourself postpones launch past the day your funding runs out. The rule: buy what's licensed, build what differentiates. Franklin built in-house because it already held the licenses.",
    "“Tokenization eliminated intermediaries, so the architecture should be thin.” —— A serious platform typically signs 6–10 vendors. Intermediaries didn't vanish; they re-specialized (Stage 10.1) — your architecture diagram is the seating chart for the new ones.",
    "“Asset-layer risk should get its own box too.” —— The asset's quality is decided before the diagram is drawn — that's the selection decision (step ① of next lesson's pipeline). Architecture decides whether the receipt chain holds, not whether the thing behind the receipt has value.",
  ],

  quiz: [
    {
      q: "From the investor wiring money to tokens landing in their wallet, which boxes does a subscription pass through, in order?",
      options: ["③ token engine → ⑥ portal, two steps", "⑥ distribution portal → ② compliance layer → ③ token engine, while ④ asset servicing receives cash off-chain and buys the asset", "① legal engine → ⑤ data layer", "Only ② the compliance layer"],
      answer: 1,
      explain: "A subscription passes the portal (⑥), eligibility checks and claims (②), and the mint airlock (③) — and ④ must confirm cash arrival and buy the underlying, because the airlock only opens on ④'s confirmation. No business flow touches just one box.",
    },
    {
      q: "Why is “the architecture is the risk map inverted”?",
      options: ["Because you draw the diagram upside down", "Because every risk layer in Stage 12.1 corresponds to a component here that can fail — the same diagram viewed from outside by evaluators, from inside by builders", "Because bigger risks mean simpler architecture", "It's only a metaphor with no real correspondence"],
      answer: 1,
      explain: "Legal-layer risk = box ① failing, custody = box ④, data = box ⑤… The one exception is the asset layer — that's the selection decision made before the diagram exists.",
    },
    {
      q: "Which box is the most underestimated in the whole diagram?",
      options: ["③ the token engine — contracts are hardest to write", "④ asset servicing — the forever-machine of NAV, distributions, and reconciliation that must run daily, while budgets only fund launch day", "⑥ distribution — markets are hardest", "① the legal engine — lawyers are most expensive"],
      answer: 1,
      explain: "Issuance is a wedding; servicing is the decades of marriage after. RealT's lesson (Stage 10.4): the token mechanics ran fine, and operations still failed.",
    },
    {
      q: "Which key-management setup follows the “severity-tiered” principle?",
      options: ["One multisig for every operation — safest", "Single-signer for routine feeds; 3-of-5 multisig with cash-confirmation checks for minting; multisig + timelock + a legal ticket for forcedTransfer and upgrades", "Single-signer hot wallets everywhere — efficiency first", "Hand every key to the custodian"],
      answer: 1,
      explain: "Every switch is an attack surface (Stage 6.5). The heavier the action, the more signatures, delay, and process it should require — one-size-fits-all is neither safe nor usable.",
    },
    {
      q: "What is the core BUILD vs BUY decision rule?",
      options: ["Build as much as possible to prove technical strength", "Outsource everything and keep only the brand", "Buy anything that requires a license (licenses take years); build only your differentiator; a typical platform signs 6–10 vendors", "Pick whatever is cheaper"],
      answer: 2,
      explain: "Transfer-agent, broker-dealer, ATS, and custody licenses are moats measured in years; engineering hours belong in asset selection, distribution, and experience — the real differentiators.",
    },
  ],

  further: [
    { label: "Securitize: a full-stack tokenization platform (TA + broker-dealer + ATS in the wild)", url: "https://securitize.io/" },
    { label: "Tokeny: ERC-3643 issuance & compliance engine", url: "https://tokeny.com/" },
    { label: "ERC-3643 official site (the standard & ecosystem)", url: "https://www.erc3643.org/" },
    { label: "Fireblocks: institutional key management & custody tech", url: "https://www.fireblocks.com/" },
    { label: "Chainlink Proof of Reserve docs (the data-layer component)", url: "https://docs.chain.link/data-feeds/proof-of-reserve" },
  ],
};
