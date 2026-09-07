export default {
  id: "erc3643",
  stage: 6,
  order: 2,
  title: "ERC-3643 (T-REX): Permissioned Tokens with a Built-in Guest List",
  difficulty: "systems",
  prereqs: ["why-not-erc20"],

  oneLiner:
    "ERC-3643 (community name T-REX) is the complete answer to last lesson's requirements spec — and it isn't one contract but a five-contract chorus: the token itself stays ERC-20 compatible, an Identity Registry knows the people, a Trusted Issuers Registry decides whose vouching counts, a Claim Topics Registry decides what must be vouched for, and a Compliance contract holds hot-swappable rule modules. Every transfer passes two security gates — “who are you” and “do the rules allow it” — before a single balance moves; otherwise it reverts with a reason. It became an official ERC in 2023 and is the most widely adopted open standard for institutional tokenization.",

  intuition: `
At the end of last lesson you held a requirements spec distilled from the wreckage: know the people, check eligibility, lock time, count heads, freeze, recover, audit. Now the question is an engineering one: **how do you fit all of that into a token contract without turning it into a plate of spaghetti nobody dares touch?**

The intuitive approach is to hardcode every check into \`transfer\`: one long chain of ifs, a baked-in KYC whitelist, a baked-in country list, baked-in lockups. Three months later the law changes (which, in the securities world, is routine) and you must upgrade the whole token contract — and every upgrade is surgery, with hundreds of millions of dollars of assets on the table.

ERC-3643's answer is far more elegant: **split it apart**. Separate "who are you" and "do the rules allow it" into two independent contract systems; the token itself merely **asks them** at transfer time. The identity system knows people — and it knows *people*, not addresses: switch wallets and your identity survives. The rule system holds **pluggable modules** — when the law changes, swap a module; the token itself doesn't change a line. The architecture carries a memorable community name: **T-REX** (Token for Regulated EXchanges).

Understand it and you understand the skeleton of the entire regulated-token world — on-chain identity (Stage 6.3), transfer restrictions (Stage 7.3), and control switches (Stage 6.5) are all organs on this skeleton.

**Here's the map — five parts:**

- **① A five-contract chorus: the T-REX architecture**
- **② One transfer's full journey: walking the checkpoints line by line**
- **③ The issuer's power panel: forced transfer, freeze, recovery**
- **④ Two elegant design moves: reusable identity, hot-swappable rules**
- **⑤ Ecosystem and comparisons: T-REX, the DS protocol, and the plain whitelist**
`,

  mechanics: `
### ① A five-contract chorus: the T-REX architecture

A deployed ERC-3643 suite is **five cooperating contracts**, each with its own beat:

- **① Token**: stays **ERC-20 interface compatible** — \`balanceOf\`, \`transfer\`, the events, all present, so ordinary wallets display it and trading UIs can drive it. The only difference is inside \`transfer\`: before moving a balance, it consults the others.
- **② Identity Registry**: a mapping of "**address → identity contract + country code**." Note what it maps to: an **ONCHAINID identity contract** (one per investor — Stage 6.3 is devoted to it), not a bare address — so "it knows the person, not the wallet." The country code (ISO 3166 numeric, e.g. 840 = US, 702 = Singapore) lives here, feeding the country rules.
- **③ Trusted Issuers Registry**: defines "**whose vouching counts**" — which KYC providers' or auditors' signed claims this token accepts. Fund A can trust only KYCPro; Fund B can trust both KYCPro and VerifyCo.
- **④ Claim Topics Registry**: defines "**what must be vouched for**" — which claim topics this token requires: KYC passed, accredited investor, nationality verified… Topics are just numbers; the issuer defines their meaning.
- **⑤ Compliance**: holds a set of **rule modules**, each enforcing one independent rule: country allow/block lists, maximum holder count, per-investor caps, time locks, daily volume limits… Modules can be added, removed, and replaced (see ④).

<figure>
<svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="e3643-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="200" y="16" width="240" height="66" rx="12" fill="var(--orange-soft)" stroke="var(--orange-line)" stroke-width="1.5"/>
  <text x="320" y="42" text-anchor="middle" font-size="13" fill="var(--orange-ink)" font-weight="700">① Token (ERC-20 compatible)</text>
  <text x="320" y="62" text-anchor="middle" font-size="10" fill="var(--muted)">transfer() asks both sides first</text>
  <rect x="16" y="130" width="290" height="88" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="161" y="154" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">② Identity Registry</text>
  <text x="161" y="174" text-anchor="middle" font-size="10" fill="var(--muted)">address → identity contract + country</text>
  <text x="161" y="192" text-anchor="middle" font-size="10" fill="var(--muted)">isVerified(to)?</text>
  <rect x="16" y="238" width="140" height="76" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="86" y="262" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="600">③ Trusted Issuers</text>
  <text x="86" y="280" text-anchor="middle" font-size="9" fill="var(--muted)">whose vouching counts</text>
  <text x="86" y="296" text-anchor="middle" font-size="9" fill="var(--muted)">(list of KYC providers)</text>
  <rect x="168" y="238" width="140" height="76" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="238" y="262" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="600">④ Claim Topics</text>
  <text x="238" y="280" text-anchor="middle" font-size="9" fill="var(--muted)">what must be vouched</text>
  <text x="238" y="296" text-anchor="middle" font-size="9" fill="var(--muted)">(KYC / accreditation / country)</text>
  <rect x="348" y="130" width="276" height="184" rx="12" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="486" y="154" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">⑤ Compliance</text>
  <text x="486" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">canTransfer(from, to, amount)?</text>
  <rect x="366" y="184" width="240" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="486" y="200" text-anchor="middle" font-size="9" fill="var(--ink)">module: country allow/block list</text>
  <rect x="366" y="214" width="240" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="486" y="230" text-anchor="middle" font-size="9" fill="var(--ink)">module: max holders / per-investor cap</text>
  <rect x="366" y="244" width="240" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="486" y="260" text-anchor="middle" font-size="9" fill="var(--ink)">module: lockups / daily volume limits</text>
  <text x="486" y="296" text-anchor="middle" font-size="9" fill="var(--orange-ink)">swap modules when the law changes</text>
  <line x1="252" y1="82" x2="185" y2="126" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#e3643-arr-en)"/>
  <text x="180" y="106" text-anchor="middle" font-size="9" fill="var(--orange-ink)">“who is this?”</text>
  <line x1="388" y1="82" x2="460" y2="126" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#e3643-arr-en)"/>
  <text x="470" y="106" text-anchor="middle" font-size="9" fill="var(--orange-ink)">“is it allowed?”</text>
  <line x1="86" y1="238" x2="120" y2="222" stroke="var(--line)" stroke-width="1.4" marker-end="url(#e3643-arr-en)"/>
  <line x1="238" y1="238" x2="205" y2="222" stroke="var(--line)" stroke-width="1.4" marker-end="url(#e3643-arr-en)"/>
</svg>
<figcaption>The five-contract chorus: the token only asks questions; knowing people belongs to the identity system, rules to the compliance modules.</figcaption>
</figure>

### ② One transfer's full journey: walking the checkpoints line by line

Write \`transfer(to, amount)\`'s internals as pseudo-code and walk it line by line:

> \`transfer(to, amount):\`
> 　\`require(!paused, "TOKEN_PAUSED")\` — the token isn't globally paused
> 　\`require(!frozen[msg.sender] && !frozen[to], "ADDRESS_FROZEN")\` — neither side is frozen
> 　\`require(balance[msg.sender] - frozenTokens[msg.sender] >= amount, "INSUFFICIENT_UNFROZEN")\` — enough unfrozen balance
> 　\`require(identityRegistry.isVerified(to), "RECEIVER_NOT_VERIFIED")\` — receiver's identity clears
> 　\`require(compliance.canTransfer(msg.sender, to, amount), "COMPLIANCE_FAILURE")\` — every rule passes
> 　\`_transfer(msg.sender, to, amount)\` — only now does the balance move, and compliance is told to update its counters

The fourth line, \`isVerified(to)\`, expands into three questions: **does "to" have an identity contract in the Identity Registry?** (never registered = instant refusal) → **does that identity carry a claim for every topic the Claim Topics Registry requires?** → **were those claims signed by issuers on the Trusted Issuers Registry, with valid, unexpired, unrevoked signatures?** All three must be yes to count as verified.

The fifth line, \`canTransfer\`, puts it to **a vote of every compliance module**: the country module checks both parties' country codes, the holder-count module checks "is 'to' a new holder while the cap is full," the lockup module checks the clock, the limit module checks the amount — **one veto kills it**; if any module says no, the whole transaction reverts.

Savor the flavor of this design: failure isn't silent — it's a **revert with a reason**: \`RECEIVER_NOT_VERIFIED\`, \`COMPLIANCE_FAILURE\`. A front end can translate the reason for the user: "The counterparty hasn't completed KYC." The rule from page 87 in the last lesson has genuinely become a revert message.

### ③ The issuer's power panel: forced transfer, freeze, recovery

Days 5 and 6 of last lesson (inheritance after death; the court freeze order) demand that the issuer **must** be able to intervene. ERC-3643 makes these powers standard functions, callable by the **agent role** (the issuer or its delegated transfer agent):

- \`forcedTransfer(from, to, amount)\`: move tokens **without the holder's signature** — to execute court judgments or correct erroneous entries.
- \`setAddressFrozen(addr, bool)\` / \`freezePartialTokens(addr, amount)\`: freeze a whole address or a **partial balance** — responding to sanctions designations or litigation holds; partial freezing lets you "freeze the disputed slice, leave the rest live."
- \`pause()\` / \`unpause()\`: halt all transfers globally — the emergency brake during a market incident or a discovered vulnerability.
- \`recoveryAddress(lostWallet, newWallet, investorID)\`: **the lost-key remedy** — the core insight being "tokens bind to the identity, not the wallet." The investor proves who they are, binds a new wallet to the same ONCHAINID, and the agent moves the balance from the dead wallet in one call. Day 5's "USB stick buried with the coffin" problem finally gets a legally correct solution.
- \`mint\` / \`burn\`: agents issue on subscription and destroy on redemption (the lifecycle from Stage 1.1).

These powers are a double-edged sword — who holds them, how they're used, what trail they leave is the entire subject of Stage 6.5. For now, remember: **they are not backdoors; they are line items on the requirements spec.**

### ④ Two elegant design moves: reusable identity, hot-swappable rules

Two decisions in the T-REX architecture deserve separate admiration, because they determine the standard's economics.

**Identity is reusable.** The Identity Registry points to the investor's ONCHAINID identity contract — and that contract **belongs to no token**; it belongs to the investor. The same identity can be referenced simultaneously by Fund A's, Bond B's, and Platform C's registries. Do KYC once (at $10–100 per investor — Stage 6.3 runs the numbers) and the resulting claims work across the whole ecosystem: "**KYC once, eligible everywhere**." For issuers this slashes onboarding cost; for the ecosystem it turns the identity layer into shared infrastructure.

**Rules are hot-swappable.** The Compliance contract is modular: the day a new regulation demands "no single investor above 10%," the issuer deploys a new module and registers it into compliance — **not one line of the token changes, holders feel nothing, no migration**. Contrast the alternative: projects with rules hardcoded into the token must run a full contract-upgrade process on every legal change (Stage 2.3 covered the risk and governance cost of upgrades). A security's rules have a far shorter lifespan than the asset — a 10-year bond will live through several waves of regulation — so **decoupling rules from assets isn't fastidiousness, it's a hard requirement**.

### ⑤ Ecosystem and comparisons: T-REX, the DS protocol, and the plain whitelist

**Adoption reality** (as of 2025): ERC-3643 was long shepherded by Tokeny (now part of the Apex Group), passed through the Ethereum community process to become an **official ERC in 2023**, has the ERC3643 Association driving multi-institution interoperability, and the ecosystem claims a cumulative tokenized volume in the **tens of billions of dollars**. Outside the large US issuers' in-house systems, it has become the de facto open standard for institutional tokenization.

**Versus Securitize's DS protocol**: structurally the same idea — token + identity service + compliance service in layers, checked at transfer time — but DS is Securitize's **proprietary system**, with identity data closed inside its platform (BlackRock's BUIDL runs on it — Stage 10.1). Choosing it = choosing a full-service provider; choosing ERC-3643 = choosing an open standard plus your pick of providers.

**Versus the plain whitelist**: the simplest compliance retrofit is a \`mapping(address => bool) whitelist\` on an ERC-20, checked at transfer. Cheap, easy to understand, adequate for a small private placement. But it **knows addresses, not people** (new wallet = re-onboard), carries **no claim semantics** ("on the list" doesn't say why), and offers **zero reuse** (every token builds its own siloed list). Think of it as ERC-3643's degenerate form: the security gate remains, but the ID-card system is gone.

If you take away one sentence: **T-REX writes regulation as replaceable modules and turns identity into a reusable asset, while the token itself merely asks questions at transfer time — that is the canonical answer to "compliance as code."**
`,

  demo: "trex-transfer",

  analogy: `
Picture an ERC-3643 token as a **regulated international conference**, and a transfer as **handing your entry wristband to someone else**.

The plain-ERC-20 conference is a music festival: wristbands resell freely, and security checks one thing — "is the wristband genuine?" (is the balance sufficient?). This conference, though, has five departments cooperating. The **front desk** (Token) physically swaps the wristband, but makes two phone calls first. The first goes to the **registration office** (Identity Registry): "This person receiving the wristband — are they registered? What nationality?" The registration office doesn't verify identities itself — it checks the **reference letters** (claims) in the person's file: were they written by **referees the conference recognizes** (Trusted Issuers Registry)? Do they cover **exactly the items the conference requires** (Claim Topics Registry) — identity verified, professional credentials? Have any expired?

The second call goes to the **rules committee** (Compliance): "This breakout session caps at 200 — is it full? Is their nationality on the restricted list? How many times have they swapped wristbands today?" On the committee's desk sits a row of **loose-leaf rule cards** — when the conference adds a new rule, pull an old card, slot in a new one, and the front desk's procedure doesn't change for even a second.

Only when both calls say yes does the wristband change hands; if either says no, the front desk tells you **exactly which rule you tripped**. And the head of security (the agent) carries special keys: escort a troublemaker out (freeze), reclaim a wristband under a court summons (forcedTransfer), reissue one to someone who lost theirs but proved who they are (recovery). Best of all: the reference letters you earned at this conference **remain valid at the next conference that recognizes the same referees** — that's identity reuse.
`,

  misconceptions: [
    "“ERC-3643 is one token contract with some extra ifs in transfer.” —— It's a five-contract system: token, identity registry, trusted issuers registry, claim topics registry, compliance. The checking logic lives entirely outside the token — which is exactly why the law can change without touching the token.",
    "“Permissioned tokens aren't ERC-20 compatible, so ordinary wallets can't use them.” —— The opposite: ERC-3643 deliberately keeps the ERC-20 interface — balanceOf, transfer, the events — so wallets display and operate it as usual. Transfers simply pass through security first, and non-compliant ones revert with a reason.",
    "“A whitelist is just addresses in a mapping — ERC-3643 is the same thing.” —— A plain whitelist knows addresses, not people; doesn't distinguish why someone is on the list; and every token builds its own. ERC-3643 binds to identity contracts (switch wallets, identity survives), gives claims topics, issuers, and expiries, and reuses them across tokens — a different league of expressiveness.",
    "“forcedTransfer is a backdoor — proof the standard is unsafe.” —— It's a line item on the requirements spec: without it, court judgments can't be executed, estates can't inherit, and the register drifts permanently wrong (Days 5–6 last lesson). The real question isn't whether the switches exist but who holds them and what trail each use leaves — that's Stage 6.5.",
    "“Every legal change forces a security token to migrate to a new contract.” —— T-REX's modular compliance exists precisely to avoid that: a new rule = a new module plugged into compliance; the token and its holders feel nothing. Wholesale migration is the fate of designs that hardcode rules into the token.",
  ],

  quiz: [
    {
      q: "In the ERC-3643 system, which contract decides “whose KYC vouching counts”?",
      options: [
        "The Token itself",
        "The Trusted Issuers Registry",
        "The Compliance contract",
        "The Identity Registry",
      ],
      answer: 1,
      explain: "The Trusted Issuers Registry defines which claim issuers (KYC providers, etc.) the issuer recognizes; the Claim Topics Registry defines what must be vouched for; the Identity Registry only maps addresses to identities.",
    },
    {
      q: "During a transfer, what does a failed isVerified(to) most likely mean?",
      options: [
        "The receiver's balance is insufficient",
        "The receiver has no registered identity, or lacks a valid claim on a required topic, or the claim's issuer isn't trusted",
        "The token is globally paused",
        "The amount exceeds the daily limit",
      ],
      answer: 1,
      explain: "isVerified asks three things: is there an identity contract? Are all required topics covered by valid claims? Are the issuers trusted? Balance, pause, and limits are handled by other checks.",
    },
    {
      q: "A new regulation caps any single investor at 10%. The standard T-REX response is?",
      options: [
        "Upgrade the token contract and rewrite transfer",
        "Migrate all holders to a new token",
        "Deploy a new compliance module and register it into the Compliance contract; the token itself doesn't change",
        "Write the rule into the subscription agreement and trust investors to comply",
      ],
      answer: 2,
      explain: "Rules decoupled from assets: compliance modules are hot-swappable, so a legal change = swapping a module — no token change, no holder migration. That's T-REX's core advantage over hardcoding.",
    },
    {
      q: "Why can recoveryAddress solve the lost-key problem in a legally correct way?",
      options: [
        "It can crack the lost private key",
        "Tokens bind to the investor's on-chain identity rather than the wallet address, so after proving identity a new wallet is bound to the same identity and the agent moves the balance",
        "It returns the tokens to the issuer for resale",
        "It relies on an off-chain database backup",
      ],
      answer: 1,
      explain: "“Know the person, not the wallet” is the key: the legal claim belongs to the person, and the wallet is just an endpoint. The identity survives; swap the endpoint — precisely what a plain ERC-20 cannot do.",
    },
    {
      q: "The most accurate description of ERC-3643 versus Securitize's DS protocol is?",
      options: [
        "Mutually incompatible and philosophically opposed",
        "DS is the official implementation of ERC-3643",
        "Structurally the same idea (token + identity + compliance layers, checked at transfer), but DS is a proprietary closed system while ERC-3643 is an open standard",
        "DS performs no transfer checks at all",
      ],
      answer: 2,
      explain: "The pattern — verify off-chain, attest on-chain, check at transfer — is universal; the difference is open standard vs proprietary platform, i.e. ecosystem interoperability vs full-service convenience.",
    },
  ],

  further: [
    { label: "EIP-3643: the standard text (the five contract interfaces)", url: "https://eips.ethereum.org/EIPS/eip-3643" },
    { label: "ERC3643 Association (ecosystem and adoption)", url: "https://www.erc3643.org/" },
    { label: "Tokeny: lead developer of the T-REX protocol", url: "https://tokeny.com/" },
    { label: "T-REX reference implementation (GitHub source)", url: "https://github.com/TokenySolutions/T-REX" },
    { label: "Securitize (the DS protocol family, for comparison)", url: "https://securitize.io/" },
  ],
};
