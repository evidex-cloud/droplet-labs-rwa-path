export default {
  id: "onchain-identity",
  stage: 6,
  order: 3,
  title: "On-chain Identity & Claims: ONCHAINID & Whitelists",
  difficulty: "systems",
  prereqs: ["erc3643"],

  oneLiner:
    "Last lesson said “know the person, not the wallet”; this lesson answers “how does a chain know a person.” ONCHAINID gives every investor an identity contract — a passport holder — into which KYC providers place signed claims. The chain stores only the fact that someone vouched: the signature and a data hash; the private originals stay in the provider's vault. At transfer time the token asks one question: does this identity carry a valid claim, on every topic I require, from an issuer I trust? A KYC run costs $10–100 — and the claim it produces gets reused across the whole ecosystem. Identity becomes an asset; and the institutions that sign claims quietly become infrastructure.",

  intuition: `
In last lesson's security pipeline, one checkpoint got a single line: \`isVerified(to)\`. Now we take it apart down to the screws, because the entire trust topology of the regulated-token world hides inside that one station.

First, feel the contradiction it must resolve. Compliance requires the issuer to **know every holder** — name, nationality, proof of eligibility, nothing optional. A blockchain's nature is **public transparency** — every byte written on-chain is world-readable forever. Stack the two requirements naively and you get a disaster: putting investors' passport scans on-chain isn't compliance, it's **the world's largest personal-data breach, live**.

So the first principle of on-chain identity is a beautiful separation: **the chain doesn't store who you are — it stores that someone vouched for who you are**. The KYC provider inspects your passport and proof of assets off-chain — those originals never leave its vault; then it leaves a **signed claim** on-chain: "Topic 1 (KYC): passed." When a token needs to verify you, it doesn't look at a passport — it looks at that signature: **"an institution I trust vouched for this person"** — and that's enough.

This three-part pattern — **verify off-chain, attest on-chain, check at transfer** — is universal across every serious RWA project. The names differ — T-REX calls it ONCHAINID; Securitize runs its own investor-ID system — but the skeleton is identical.

**Here's the map — five parts:**

- **① The identity contract: your on-chain passport holder**
- **② Anatomy of a claim: signature on-chain, privacy off**
- **③ The verification flow: isVerified's three questions**
- **④ A claim's lifecycle: issuance, expiry, and revocation that propagates everywhere**
- **⑤ Reuse economics, and three identity architectures compared**
`,

  mechanics: `
### ① The identity contract: your on-chain passport holder

**ONCHAINID**'s core move: deploy, for each investor, **a smart contract of their own** — the identity contract. Note: not a database row, not an NFT, but a full contract with an address, storage, and key management. It works like a **passport holder**:

- **The holder itself** belongs to the investor: management rights are controlled by the investor's wallet keys, and keys can be added or replaced (so switching wallets doesn't lose the identity — just add the new wallet's key; this is exactly what Stage 6.2's recoveryAddress builds on).
- **What's inside** are **claims** placed there by others: attestation records written by claim issuers — KYC providers, auditors, issuers.
- **The holder's address** is referenced by each token's identity registry: Fund A's Identity Registry says "0xYourWallet → your identity contract," and Bond B's registry points to **the same** identity contract.

Technically the lineage runs back to Ethereum's early ERC-734 (key management) / ERC-735 (claim management) proposals — neither was finalized as a standard, but T-REX absorbed them as de facto components.

### ② Anatomy of a claim: signature on-chain, privacy off

Here is what a claim looks like on-chain — pay attention to **what is on-chain and what is not**:

- **topic**: what this claim vouches for. E.g. \`1\` = KYC passed, \`2\` = accredited investor, some agreed number = nationality verified. Topic meanings are ecosystem conventions.
- **issuer**: which institution signed — pointing to the issuer's own identity contract.
- **signature**: the issuer's private-key signature over "this identity + this topic + this data." Anyone can verify it; nobody can forge it.
- **data hash**: a **hash fingerprint** of the underlying KYC material. The originals (passport, proof of address, proof of assets) are **not on-chain** — they're locked in the provider's off-chain vault; the hash exists for later accountability: if challenged, the provider produces the originals, and a matching hash proves the attestation had substance.
- **validity**: claims can expire — KYC industry practice is a refresh every 1–2 years.

This is **privacy by design**: anyone on-chain can verify that **"a trusted institution vouched for this identity"** while seeing nothing of what the institution saw. Your passport number, home address, bank statements — not on-chain, ever. (Want to go further and hide even *whether* you've been vouched for? That takes zero-knowledge proofs — Stage 7.4's subject.)

<figure>
<svg viewBox="0 0 640 310" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="ocid-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="16" y="16" width="240" height="130" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="136" y="40" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">🔒 Off-chain: KYC vault</text>
  <text x="36" y="66" font-size="10" fill="var(--muted)">passport scan · proof of address</text>
  <text x="36" y="86" font-size="10" fill="var(--muted)">proof of assets · bank statements</text>
  <text x="36" y="106" font-size="10" fill="var(--muted)">(originals never go on-chain)</text>
  <text x="36" y="132" font-size="10" fill="var(--orange-ink)">review passed → issue claim ↓</text>
  <rect x="16" y="180" width="240" height="110" rx="12" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="136" y="204" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">⛓ On-chain: identity contract</text>
  <rect x="34" y="216" width="204" height="60" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="46" y="234" font-size="9" fill="var(--ink)">claim: topic=1 (KYC passed)</text>
  <text x="46" y="249" font-size="9" fill="var(--ink)">issuer=KYCPro · signature ✓</text>
  <text x="46" y="264" font-size="9" fill="var(--muted)">dataHash=0x9f3a… · expires 2027-01</text>
  <line x1="136" y1="146" x2="136" y2="176" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#ocid-arr-en)"/>
  <rect x="360" y="60" width="264" height="200" rx="12" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="492" y="86" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">What the token asks at transfer</text>
  <text x="378" y="116" font-size="10" fill="var(--ink)">① Does this address have an identity?</text>
  <text x="378" y="146" font-size="10" fill="var(--ink)">② Valid claims on all required topics?</text>
  <text x="378" y="176" font-size="10" fill="var(--ink)">③ Issuers on my trusted list?</text>
  <text x="378" y="212" font-size="10" fill="var(--orange-ink)">Nobody ever sees the passport —</text>
  <text x="378" y="230" font-size="10" fill="var(--orange-ink)">the chain proves “someone vouched.”</text>
  <line x1="256" y1="235" x2="356" y2="200" stroke="var(--line)" stroke-width="1.5" marker-end="url(#ocid-arr-en)"/>
</svg>
<figcaption>Verify off-chain, attest on-chain: the private originals stay in the vault; the chain holds only signatures and hashes.</figcaption>
</figure>

### ③ The verification flow: isVerified's three questions

Now zoom into that Stage 6.2 checkpoint. The token receives a transfer request and asks the identity registry \`isVerified(to)\`; the registry runs three questions:

- **Existence**: is \`to\` in the address→identity-contract mapping? Not there = never onboarded — instant refusal.
- **Coverage**: open the Claim Topics Registry's requirements list (say this fund requires topic 1 = KYC and topic 2 = accredited investor) — does the identity contract hold a claim for **every topic**? Do the signatures verify? None expired?
- **Provenance**: is each claim's issuer on this token's Trusted Issuers Registry — and is that issuer authorized for **this topic**? (KYCPro may be trusted to sign KYC yet have no authority to sign "accredited investor.")

All three pass = verified. Any one fails, the transfer reverts. Note the subtlety: **the same identity can get different verdicts from different tokens** — Fund A trusts KYCPro, so it admits; Fund B trusts only VerifyCo, so it refuses. **Trust is configured per issuer; identities and claims are shared by the whole ecosystem.**

### ④ A claim's lifecycle: issuance, expiry, and revocation that propagates everywhere

A claim isn't a permanent stamp; it has a full lifecycle:

- **Issuance**: off-chain KYC completes → the institution signs → the claim is written into the investor's identity contract.
- **Expiry**: it lapses automatically at the validity deadline. The investor "refreshes KYC" — an off-chain re-review, then a new claim.
- **Revocation** — the dramatic act. The institution discovers a problem — the client faked documents, landed on a sanctions list, forged papers — and marks that signature revoked in its own contract. The effect is **instant and universal**: every token that trusts this institution refuses this identity at its very next check. One revocation, effective everywhere.

Pause here and weigh both faces of this design. **The power**: compliance response time collapses from "send letters to each platform, delete from each list" (days to weeks in traditional finance) down to one block. **The fragility**: the claim issuer has become **critical infrastructure** — one mistaken revocation strips an innocent investor of eligibility across the whole ecosystem instantly; a stolen issuer key lets an attacker revoke in bulk and sow chaos; if the issuer goes out of business, every investor living on its claims must re-KYC. The honest assessment: **trust didn't disappear — it moved, concentrating from "every platform keeps its own list" into "a handful of claim institutions."** That is a form of centralization, and any serious evaluation must ask: who sets the issuer list? Can multiple issuers back each other up? (This question returns on Stage 12.3's due-diligence checklist.)

### ⑤ Reuse economics, and three identity architectures compared

**Why is all this complexity worth it? Run the numbers.** One institutional-grade KYC/eligibility review costs about **$10–100 per investor** (manual document review, database checks, sanctions screening). In the traditional model, the investor repeats it for every platform account — five platforms, five costs, five passport uploads. In the claims model: **KYC once, claim in the holder, eligible everywhere**. For investors that's experience; for issuers, onboarding cost; for the ecosystem, it turns the identity layer into **shared infrastructure**, like a settlement layer. It's also the key to why standards beat homegrown builds — a standard's value compounds with every reuse.

**Three architectures side by side**:

- **Per-token whitelist** (\`mapping(address => bool)\`): simplest and cheapest; knows addresses, not people; can't say *why* someone is listed; zero reuse. Its virtue: it exposes nothing on-chain, not even who vouched — but that's because it expresses nothing at all. Fine for one small private placement.
- **Identity contract + claims** (the ONCHAINID model): reusable, expressive (topics/issuers/expiry), revocable; the price is a new trust node — the issuer — plus contract complexity. The mainstream choice for institutional multi-token ecosystems.
- **W3C Verifiable Credentials (VC/DID)**: the newer generation — credentials live entirely **in the user's own wallet** (the chain can store nothing), presented **just-in-time** at transfer or onboarding, verified on the spot. Stronger privacy (selective disclosure) and a natural bridge to zero-knowledge proofs — "prove I'm eligible without saying who I am" (Stage 7.4). Still early in RWA, coexisting with the claims model.

One final calibration: whether the name is ONCHAINID, DS investor ID, or VC, **the pattern — verify off-chain, attest on-chain (or credential in hand), check at transfer — is universal across the industry**. Learn it once, recognize it everywhere.

If you take away one sentence: **on-chain identity replaces "who you are" with "who vouched for you" — identity thereby becomes a reusable asset, and the institutions that sign the claims quietly become infrastructure you must diligence.**
`,

  demo: "claim-checker",

  analogy: `
Think of the whole system as **the airport visa system**.

Your **passport holder** (the identity contract) is yours, and travels with you. The **visa pages** inside (claims) are not written by you — they're **issued and stamped by consulates** (claim issuers) after reviewing your materials. The consulate looked at your bank statements and employment letter — those stay in the consulate's archive (the off-chain vault); **the visa page carries only a stamp and a number** (the signature and hash), not your account balance.

What does the **boarding gate** (the token's transfer check) verify? The gate agent doesn't re-audit your bank statements — she checks three things: is this passport holder yours, is the visa required by the destination present, and **is the issuing consulate one this country recognizes**. The US recognizes consulate A's stamp; Japan accepts only consulate B's — the same passport holder gets different verdicts at different borders. That is isVerified's three questions.

Visas **expire** and need renewal. More dramatic is **cancellation**: the consulate discovers your documents were forged and voids the visa in its system — one second later, every boarding gate in the world refuses you, with no need to notify each airport. A miracle of efficiency, and a concentration of power: the consulate has become the **single switch** on your ability to travel the globe. So the traveler's ultimate question is the RWA investor's too: **the institution that stamped my papers — how trustworthy is it, itself?**
`,

  misconceptions: [
    "“On-chain identity = putting KYC files on the chain.” —— The opposite. The chain stores only a claim's existence, the issuer's signature, and a data hash; passports and bank statements stay off-chain with the issuer forever. The chain proves “someone vouched” without showing what they saw — privacy by design.",
    "“With ONCHAINID, anyone can look up my nationality and assets.” —— What's visible is only “some identity was vouched for on topic X by some institution.” The country code sits in the identity registry for rule evaluation, but proof of assets, home address, and other PII are not on-chain. Hiding even the fact of being vouched for is zero-knowledge territory (Stage 7.4).",
    "“Revoking a claim only affects the issuing institution's own business.” —— Revocation takes effect instantly ecosystem-wide: every token trusting that issuer refuses the identity at its next check. A compliance superpower — and it means an issuer's mistake or compromise collateralizes innocent holders. The issuer is critical infrastructure that must be diligenced.",
    "“Whitelists and claim systems are both just lists — no real difference.” —— A whitelist knows addresses, carries no semantics, reuses nothing; claims know people, carry topics/issuers/expiry, reuse across tokens, and can be revoked. At small scale a whitelist suffices; at ecosystem scale the two differ by an order of magnitude in cost and expressiveness.",
    "“If I switch wallets I must redo KYC.” —— Claims bind to the identity contract, not the wallet address. Add the new wallet's key to the identity (or rebind via recovery), and every claim follows untouched — that is what “know the person, not the wallet” means.",
  ],

  quiz: [
    {
      q: "Which of the following is NOT part of an on-chain claim?",
      options: [
        "The topic number (what is vouched for)",
        "The issuer's signature",
        "The underlying KYC originals (passport scans etc.)",
        "The hash fingerprint of the underlying data",
      ],
      answer: 2,
      explain: "Originals stay in the issuer's off-chain vault forever; on-chain there are only topic, signature, hash, and validity — enough to verify the attestation exists, without seeing its basis.",
    },
    {
      q: "The same investor identity is admitted by Fund A but refused by Fund B. The most likely reason?",
      options: [
        "The identity contract lives on two different chains",
        "The two funds trust different claim issuers (or require different topics)",
        "Fund B's gas fees are higher",
        "A claim can only be used once per token",
      ],
      answer: 1,
      explain: "Identities and claims are shared ecosystem-wide, but each issuer configures its own trusted issuers and required topics — the same identity naturally gets different verdicts under different trust configurations.",
    },
    {
      q: "What happens after a KYC provider revokes an investor's KYC claim?",
      options: [
        "Only tokens issued by that provider refuse the investor",
        "Every token trusting that provider refuses the identity at its next check — one revocation, effective everywhere",
        "The investor's token balances are automatically zeroed",
        "Nothing, until each issuer manually syncs",
      ],
      answer: 1,
      explain: "The revocation mark lives in the issuer's contract, and every relying party reads it at its next verification — instant propagation is both the power and the risk of the design.",
    },
    {
      q: "What is the economic basis of “KYC once, eligible everywhere”?",
      options: [
        "On-chain verification is free",
        "One institutional KYC run costs about $10–100, and claim reuse amortizes it across every token and platform in the ecosystem",
        "Regulators subsidize platforms that reuse claims",
        "Claims can be resold to other investors",
      ],
      answer: 1,
      explain: "Reuse is the claims model's core economic edge over per-token whitelists: the cost is incurred once and the value compounds with every reference — which is how identity becomes an “asset.”",
    },
    {
      q: "Compared with ONCHAINID claims, what mainly differentiates W3C Verifiable Credentials (VCs)?",
      options: [
        "VCs must write the full credential on-chain",
        "Credentials live in the user's own wallet and are presented just-in-time; the chain can store nothing, and selective disclosure bridges naturally to zero-knowledge proofs",
        "VCs need no issuing institutions at all",
        "VCs are only used in aviation",
      ],
      answer: 1,
      explain: "VC/DID moves storage from the on-chain identity contract into the user's wallet — stronger privacy and a natural ZK fit (Stage 7.4); the cost is that RWA support is still early. Both models still depend on trusting the issuer.",
    },
  ],

  further: [
    { label: "ONCHAINID official site (T-REX's identity layer)", url: "https://www.onchainid.com/" },
    { label: "EIP-3643: identity registry and claim-verification interfaces", url: "https://eips.ethereum.org/EIPS/eip-3643" },
    { label: "ERC-735: the claim-holder proposal (historical origin)", url: "https://github.com/ethereum/EIPs/issues/735" },
    { label: "W3C Verifiable Credentials data model (the VC standard)", url: "https://www.w3.org/TR/vc-data-model-2.0/" },
    { label: "Securitize: investor-identity infrastructure (a proprietary take on the same pattern)", url: "https://securitize.io/" },
  ],
};
