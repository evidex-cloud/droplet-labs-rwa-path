export default {
  id: "control-switches",
  stage: 6,
  order: 5,
  title: "Freeze, Clawback, Pause: The Issuer's Switches",
  difficulty: "systems",
  prereqs: ["erc3643", "legal-enforceability"],

  oneLiner:
    "An RWA token is not a bearer instrument where holding the key means owning the asset — the issuer or its agents hold a row of switches: halt all transfers, freeze an address, move your tokens without your signature, mint and burn, upgrade the contract logic. That isn't designer greed; it follows from a design theorem: you cannot simultaneously have a court-enforceable off-chain claim and unstoppable bearer-style transfers — enforceability requires an enforcement hook. So the question worth asking is never “are there switches?” but “who holds the keys, and what trail does one pull leave?”",

  intuition: `
Let's put it bluntly: **the RWA token you hold is not Bitcoin.**

Bitcoin is a **bearer instrument**: whoever holds the private key owns the coins, and nobody can take them out of your address. That's the romance of crypto and one of its whole value propositions. Open the contract of a tokenized Treasury fund, however, and you'll find a row of functions that simply don't exist in a plain ERC-20: \`pause\`, \`setAddressFrozen\`, \`forcedTransfer\`, \`mint\`, \`burn\`, plus an upgrade proxy pointing at an implementation address (Stage 2.3). **The issuer can freeze your balance and move your tokens without your knowledge or consent.**

The first reaction is usually indignation: isn't this just centralization? Whatever happened to decentralization?

Slow down. Recall the week from hell in Stage 6.1: on Day 5 an investor died and his key was buried with him; on Day 6 a court issued a freeze order you were technically unable to execute. Back then we wrote "freezable, forcibly transferable, recoverable" into the requirements spec — **those switches are that spec's implementation**. They aren't backdoors slipped in quietly; they're features the law asked for by name.

So the question shifts from "should there be switches?" to the two things this lesson actually teaches: **why each switch maps to a specific legal driver**, and **how to read a token's true power structure out of its contract** — because that same row of switches is both the compliance actuator and the biggest attack surface.

**Here's the map — five parts:**

- **① The switch inventory: each one, and the legal driver behind it**
- **② The design theorem: enforceability and unstoppability can't coexist**
- **③ Real-world pulls: USDC, USDT, and the sanctions lists**
- **④ Switches as attack surface: who holds the keys**
- **⑤ From "can't" to "won't": the process is the product**
`,

  mechanics: `
### ① The switch inventory: each one, and the legal driver behind it

Here are the admin powers in ERC-3643 (Stage 6.2) and the proprietary systems, each tagged with why the law demands it:

- \`pause()\` / \`unpause()\` — the **global emergency brake**, halting all transfers. Driver: market emergencies, a discovered contract vulnerability, damage control during a chain fork or bridge exploit. Its traditional-finance twin is a **trading halt** — an exchange suspending a stock isn't a scandal, it's a protection mechanism.
- \`setAddressFrozen(addr, true)\` — **freeze an entire address**. Driver: **sanctions designation** (OFAC strict liability — Day 2 of Stage 6.1), court preservation orders, temporary locks during an anti-money-laundering investigation.
- \`freezePartialTokens(addr, amount)\` — **freeze part of a balance**. Driver: **proportionality** when a dispute touches only part of a position — freeze the contested slice, let the rest keep circulating. This is a marker of good process: freeze exactly as much as the legal basis covers.
- \`forcedTransfer(from, to, amount)\` — **move tokens without the holder's signature**. Driver: **court judgments and their execution** (returning stolen assets to the victim), error correction (subscription funds sent to the wrong address), inheritance and estate distribution.
- \`recoveryAddress(lost, new, investorID)\` — **the lost-key remedy**. Driver: a legal claim doesn't die with a hardware wallet (Stages 5.1 and 5.3); the shareholder register must reflect true legal ownership, or the register is simply wrong.
- \`mint\` / \`burn\` — **issuance on subscription, destruction on redemption**. Driver: this is the fund's day-to-day business itself (the lifecycle in Stage 1.1).
- **Upgrading contract logic / swapping compliance rules** — Driver: regulatory change and defect repair. ERC-3643's modular compliance (Stage 6.2 ④) means most rule changes never touch the token itself, but the proxy-upgrade capability usually still exists.

Read the table and a pattern emerges: **behind every switch stands an external authority that can give the issuer orders** — a judge, a sanctions agency, a regulator, inheritance law. The switches aren't privileges the issuer granted itself; they're **enforceable promises it made to those authorities**.

### ② The design theorem: enforceability and unstoppability can't coexist

Distill that observation into this lesson's spine — call it the **design theorem**:

> **You cannot simultaneously have: (a) a court-enforceable off-chain claim, and (b) unstoppable bearer-style transfers.**

The reasoning is pure logic. (a) means: when something goes wrong, a court can order someone to do something, and that order actually lands. For an on-chain asset there is exactly one place it can land — **the token's state**. If no party can change the token's state (which is precisely the definition of (b)), then the court's order stops at the paper: the judgment says "return 1,000 shares to the victim," and the chain doesn't move a bit. **A right with no enforcement hook isn't a right; it's a wish.**

So the two worlds each made an honest choice:

- **Native crypto picks (b)**: permissionless tokens on Bitcoin and Ethereum — nobody can freeze you, and the price is that **when things go wrong, nobody helps**. Stolen, misaddressed, key lost — the chain offers no remedy; you eat it. That's a clearly priced trade.
- **RWA picks (a)**: behind the token sits a **legally real claim** (Stage 5.1: you don't own the asset, you own a claim on it), and a claim's entire value lies in **being enforceable**. To preserve that value, you must leave the court a hook that reaches the chain.

So when you see \`forcedTransfer\` on an RWA token, the correct reaction isn't "unsafe" but "**it has chosen world (a)**." What's genuinely dangerous is a project that claims **both a legal claim and complete unstoppability** — promise both and you deliver neither: no judicial remedy, and all the technical risk still yours alone.

**Know which world the thing in your hand belongs to.** That sentence is worth repeating.

<figure>
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="csw-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="16" y="20" width="290" height="210" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="161" y="46" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">(b) Native crypto</text>
  <text x="161" y="66" text-anchor="middle" font-size="10" fill="var(--muted)">bearer · unstoppable</text>
  <text x="36" y="96" font-size="10" fill="var(--green)">✓ Nobody can freeze or seize it</text>
  <text x="36" y="118" font-size="10" fill="var(--green)">✓ No issuer to trust</text>
  <text x="36" y="146" font-size="10" fill="var(--red)">✗ Theft, misaddress, lost key = gone</text>
  <text x="36" y="168" font-size="10" fill="var(--red)">✗ Court judgments can't reach the chain</text>
  <text x="161" y="206" text-anchor="middle" font-size="10" fill="var(--orange-ink)">Risk is yours, and clearly priced</text>
  <rect x="334" y="20" width="290" height="210" rx="12" fill="var(--orange-soft)" stroke="var(--orange-line)" stroke-width="1.5"/>
  <text x="479" y="46" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">(a) The RWA world</text>
  <text x="479" y="66" text-anchor="middle" font-size="10" fill="var(--muted)">registered · enforceable</text>
  <text x="354" y="96" font-size="10" fill="var(--green)">✓ Court judgments actually execute</text>
  <text x="354" y="118" font-size="10" fill="var(--green)">✓ Lost keys / inheritance have remedies</text>
  <text x="354" y="146" font-size="10" fill="var(--red)">✗ The issuer can freeze and claw back</text>
  <text x="354" y="168" font-size="10" fill="var(--red)">✗ You must trust whoever holds the keys</text>
  <text x="479" y="206" text-anchor="middle" font-size="10" fill="var(--orange-ink)">Want enforcement? Leave a hook</text>
  <line x1="306" y1="125" x2="330" y2="125" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#csw-arr-en)"/>
</svg>
<figcaption>The design theorem: the two columns' virtues don't stack. Pick a side, then run diligence by that side's rules.</figcaption>
</figure>

### ③ Real-world pulls: USDC, USDT, and the sanctions lists

These switches aren't theoretical. They have been pulled many times, at real scale:

- **USDC × Tornado Cash (August 2022)**: after the US Treasury's OFAC designated a set of addresses belonging to the mixer Tornado Cash, **Circle blacklisted the relevant addresses within hours**, freezing the USDC in them (hundreds of thousands of dollars). It was a watershed moment in crypto history, proving two things at once: **the freeze switch on a centralized stablecoin is real**, and **it will actually be used**. The industry argued about it for a long time, but from a compliance standpoint Circle had no choice: not freezing means providing financial services to a sanctioned party (strict liability).
- **USDT's freeze record**: Tether has long cooperated with law-enforcement agencies worldwide in freezing implicated addresses, with **cumulative freezes in the hundreds of millions of dollars** (as of 2025), typically for asset preservation in fraud and money-laundering cases.
- **Everyday life for tokenized funds**: products like BUIDL and OUSG (Stages 10.1 and 10.2) only ever issue to KYC'd whitelisted addresses in the first place; freezing and forced transfers are routine operations, spelled out in the offering documents and executed by the transfer agent.

An honest observation: almost none of these cases involve **an issuer seizing assets arbitrarily for its own gain** — the overwhelming majority are **responses to external legal directives**. That is exactly the line between good process and bad — see the next section.

### ④ Switches as attack surface: who holds the keys

Now switch to the diligence lens. That same row of switches turns from compliance actuator into **this token's largest single point of risk**. Four questions to ask, ready to drop straight into your checklist (Stage 12.3):

- **Who holds the keys?** — An **externally owned account (EOA)** (one person's private key; steal it and everything falls)? An **m-of-n multisig** (how many, who exactly, are they geographically and jurisdictionally diverse)? Or a multisig **plus a timelock** (critical operations must be announced N hours before they take effect, giving the market time to react)? These three differ in trust level by orders of magnitude.
- **What trail does one pull leave?** — Every freeze and forced transfer must **emit an event**, permanently on-chain and auditable by anyone. A contract that can change state silently, with no event, is a major red flag.
- **Is there a published policy?** — Has the issuer published "under what conditions we exercise these powers, what internal approvals we require, and how we disclose afterwards"? **A policy means power constrained by its own commitments**; no policy means power at whim.
- **Can whoever changes the rules also change the rules about the rules?** — What's the governance path on upgrade authority? Who can swap compliance modules; who can replace the proxy implementation? (Stage 2.3's upgrade governance becomes a money question right here.)

While we're at it, let's name a common marketing trick the industry calls **decentralization theater**: the copy talks about trustlessness and censorship resistance while a 2-of-3 multisig in the contract can freeze and seize everyone's assets at any moment. **Read the contract, not the copy.** The owner/agent address on a block explorer, whether it's a multisig, who its signers are — all public information, ten minutes of work, and far more revealing about the project's real power structure than any whitepaper.

### ⑤ From "can't" to "won't": the process is the product

Back to the trust ladder from Stage 1.3: trust can rest on "**they can't misbehave**" (technically impossible) or on "**they won't misbehave**" (constrained, penalized, supervised). Pure crypto chases the former; RWA lands realistically on the latter.

That isn't surrender — it's acknowledging a fact: **an RWA's asset is off-chain to begin with, and however much the chain says "can't," the custodian bank, the fund administrator, and the court still hold the real-world switches.** Since some trust must sit with institutions regardless, the right engineering goal isn't abolishing power but **wrapping power in process**:

- **Who can trigger it**: multisig plus role separation (the proposer ≠ the approver).
- **On what basis**: only on receipt of a court order, a sanctions directive, or a verified death/lost-key claim.
- **How long until effect**: non-emergency actions run through a timelock, giving holders a reaction window.
- **What trail it leaves**: on-chain events plus off-chain disclosure reports, so third parties can review after the fact.
- **Who supervises**: auditors, the custodian, independent directors, or token-holder representatives.

With all of that in place, a switch stops being "arbitrary power" and becomes **a constrained, verifiable enforcement capability** — which is this course's throughline: **turning trust by gut feel into trust by evidence.**

If you take away one sentence: **the switches themselves aren't evil — switches without process are; in diligence, ask first who holds the keys and what trail one pull leaves.**
`,

  demo: "issuer-switches",

  analogy: `
Think of an RWA token's admin powers as **a bank vault manager's key ring**.

A bank manager really can freeze your account, and really can move money out of it on a court's order. That sounds alarming — yet nobody concludes "banks are unsafe, I'll keep cash under the mattress." Why? Because everyone quietly understands one thing: **the existence of that key ring is the precondition for your deposits being legally protected**. When someone defrauds you, a court can order their bank to send the money back — if every bank were "technically unable to move funds," your winning judgment would be a piece of paper.

And what actually reassures people has never been "the manager has no keys." It's **the process built around the keys**: two people must be present to open the vault, every opening is on camera and in the log, moving client funds requires court documents, the action gets reported to the regulator, and internal and external auditors both go through those records. **Power wasn't abolished; it was wrapped in process.**

Cash under the mattress is the other world (native crypto): nobody can freeze it — and equally, if it's stolen nobody helps, if it burns nobody compensates. Both worlds are coherent, each with its own price. **What's absurd is a product claiming "kept in a bank, legally protected, and simultaneously untouchable by anyone, courts included"** — it is either lying, or it is mattress cash wearing a bank's facade.

So when you diligence a "bank," you don't ask whether the manager has keys (he must). You ask: **how many keys, on whom, is each opening logged, and does anyone read the log.**
`,

  misconceptions: [
    "“A token with forcedTransfer/freeze is a centralized scam — worse than a pure DeFi asset.” —— That measures two different worlds with one ruler. An RWA token is backed by an enforceable legal claim, and enforceability necessarily requires an enforcement hook (the design theorem). What deserves suspicion is a project claiming both legal protection and unstoppability — promise both and you get neither.",
    "“The issuer could seize my tokens at any time for profit.” —— The actual record of pulls is almost entirely responses to external directives (OFAC sanctions, court judgments, law-enforcement cooperation). The risk isn't absent, it's differently shaped: it comes from poor key management (a stolen single key) and missing process (no disclosure, no trail), not from routine issuer greed. Which is why diligence targets keys and process.",
    "“Only centralized stablecoins have freeze functions; tokenized funds don't do this.” —— The opposite. A tokenized fund is a registered security by nature; freezing, forced transfer, and address recovery are spelled out in its offering documents and executed routinely by the transfer agent. Stablecoins are simply discussed more because their scale and cases are public.",
    "“Handing the powers to a multisig makes it decentralized.” —— A 2-of-3 multisig can still freeze and seize everything at any moment; it merely turns one point into three. The real differences are whether signers are independent, whether jurisdictions are spread, whether a timelock and public announcement are layered on — and whether a published policy says when the powers may be used at all.",
    "“Since the issuer has switches, on-chain records are meaningless.” —— The opposite: the event log is the key constraint on that power — every freeze and forced transfer is permanently visible and auditable by anyone. Compared with traditional finance, where customers never see internal operations, this is an increase in transparency — provided the contract really emits events (silent state changes with no events are a major red flag).",
  ],

  quiz: [
    {
      q: "What does this lesson's “design theorem” state?",
      options: [
        "Every token ought to be freezable",
        "You cannot have both a court-enforceable off-chain claim and unstoppable bearer-style transfers — enforceability requires an enforcement hook",
        "The more decentralized, the lower the compliance cost",
        "A multisig is always safer than a single private key",
      ],
      answer: 1,
      explain: "For a court order to land, some party must be able to change the token's state. RWA chooses enforceability (a); native crypto chooses unstoppability (b) — know which world your holding belongs to.",
    },
    {
      q: "Compared with freezing a whole address, what principle does freezePartialTokens embody?",
      options: [
        "Saving gas",
        "Proportionality: when a dispute covers only part of a position, freeze only that part and let the rest circulate",
        "Making freezes harder to trace",
        "Bypassing court authorization",
      ],
      answer: 1,
      explain: "Freezing exactly as much as the legal basis covers is a marker of good process — the exercise of power should match the scope of its justification, not lock a holder's entire position by reflex.",
    },
    {
      q: "The most accurate reading of Circle freezing Tornado-Cash-linked USDC in August 2022 is?",
      options: [
        "Circle attacked a competitor for commercial reasons",
        "After the OFAC designation, strict liability left Circle no choice — the episode proved the freeze switch is both real and really used",
        "Ethereum's protocol layer executed the freeze",
        "It was only a drill; no funds were affected",
      ],
      answer: 1,
      explain: "Sanctions are strict liability: not freezing equals providing financial services to a sanctioned party. The event was a watershed that forced the industry to face the reality of centralized stablecoin switches.",
    },
    {
      q: "When diligencing an RWA token's admin powers, what should you confirm first?",
      options: [
        "Whether the token has a memorable name",
        "Who holds the keys (single EOA / m-of-n multisig / timelock present), and whether every use emits an on-chain event",
        "How many lines of code the contract has",
        "Whether the token is issued on multiple chains",
      ],
      answer: 1,
      explain: "The switches will exist; the question is power structure and traceability. A stolen single key loses everything; multisig + timelock + event logs + a published policy turn arbitrary power into verifiable enforcement capability.",
    },
    {
      q: "What is “decentralization theater”?",
      options: [
        "Filming a DAO governance promo",
        "Marketing copy touting trustlessness and censorship resistance while a small multisig in the contract can freeze and seize all assets",
        "A token launch event held in a theater",
        "Using zero-knowledge proofs to hide holder identities",
      ],
      answer: 1,
      explain: "Read the contract, not the copy: whether owner/agent is a multisig, who its signers are, whether a timelock exists — all publicly checkable, and far more revealing than any whitepaper.",
    },
  ],

  further: [
    { label: "EIP-3643: standard definitions of forcedTransfer / freeze / pause / recovery", url: "https://eips.ethereum.org/EIPS/eip-3643" },
    { label: "US Treasury OFAC: Tornado Cash sanctions announcement (August 2022)", url: "https://home.treasury.gov/news/press-releases/jy0916" },
    { label: "Circle: USDC blacklisting and compliance policy", url: "https://www.circle.com/blog/addressing-risk-and-compliance-in-usdc" },
    { label: "OpenZeppelin: Pausable / AccessControl (standard switch & role implementations)", url: "https://docs.openzeppelin.com/contracts/5.x/access-control" },
    { label: "Chainalysis: industry practice on asset freezes and law-enforcement cooperation", url: "https://www.chainalysis.com/blog/" },
  ],
};
