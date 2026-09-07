export default {
  id: "transfer-restrictions",
  stage: 7,
  order: 3,
  title: "Transfer Restrictions in Action: The Checks One Transfer Must Pass",
  difficulty: "systems",
  prereqs: ["investor-eligibility", "erc3643"],

  oneLiner:
    "A plain ERC-20 transfer checks exactly one thing: is the balance sufficient. A tokenized security, between “Alice wants to sell to Bob” and actual settlement, passes through a full eight check stations — identity, eligibility, jurisdiction, lockup, holder count, concentration, sanctions re-screen, freeze state — each one a regulation compiled into an if-statement. This is the synthesis lesson of the compliance arc: Stage 7.1's gates, Stage 7.2's eligibility, and Stage 6's standards all converge inside this single transfer. Where the checks physically live (in the token, in an allowlist, or at the venue) is a real architectural choice, each with its own price.",

  intuition: `
Alice holds 10,000 TBF — shares of some tokenized Treasury fund. She's agreed on a price with Bob over the counter; Bob wires her the stablecoins; she opens her wallet, sends the transfer to Bob's address, signs, broadcasts.

If TBF were a plain ERC-20, the story would end here: the contract checks \`balances[Alice] >= 10000\`, updates two rows, done. **One check.**

But TBF is a security. Before this transfer lands, the contract must answer, on the issuer's behalf, the string of questions a regulator would ask: Who is Bob? Is he eligible to hold this fund? Is he a US person? Has Alice's lockup elapsed? Would adding Bob push holders past 2,000? Would Bob's position become too concentrated? Is he on yesterday's sanctions-list update? Is the token paused right now? — **If any single answer is wrong, the whole transfer reverts on the spot**, leaving only a failure record and a reason code on-chain.

This is where the previous two lessons **land**. Stage 7.1's three gates produced the on-chain claims; Stage 7.2's eligibility rules defined who may buy; Stage 6.2's ERC-3643 supplied the enforcement machinery — and in this lesson we stand at the vantage point of **one concrete transfer** and watch the whole compliance machine run one full cycle. Understand this one transfer, and you understand the entire machine.

**Here's the map — four parts:**

- **① The eight stations: the complete checklist from “want to transfer” to “settled”**
- **② Where the checks live: in-token, external allowlist, venue — three architectures**
- **③ Rejections must explain themselves: machine-readable reason codes and pre-flight**
- **④ The price and the reality: gas, latency, and the truth behind most support tickets**
`,

  mechanics: `
### ① The eight stations: the complete checklist from “want to transfer” to “settled”

Setup: Alice sells 10,000 TBF to Bob. TBF's rulebook: accredited investors only, Reg S shares barred from US persons, 12-month Rule 144 lockup, 2,000-holder cap, 10% single-holder limit. Station by station:

- **Station ① Identity binding**: Is Bob's wallet bound to a verified identity? The contract queries the identity registry (Stage 6.3's ONCHAINID) — no entry, instant revert. An anonymous address gets nowhere with this class of token.
- **Station ② Valid eligibility claims**: Does Bob's identity carry the claims this product requires — “accredited investor” or “qualified purchaser” (Stage 7.2's ladder)? And crucially, are they **unexpired and unrevoked**: an accreditation verification letter commonly holds for only 90 days (the 506(c) standard) — expired counts as absent.
- **Station ③ Jurisdiction check**: Is Bob's country code on the allowed list? If this lot was issued under Reg S: is Bob a **US person**? Has the **distribution compliance period** (40 days–1 year) elapsed? ERC-3643's country module fires at this station.
- **Station ④ Lockup (per-lot!)**: Have Alice's tokens cleared the Rule 144 lockup? Here lies a genuine engineering trap: Alice may have subscribed for 6,000 in January and another 6,000 in August — **different lots carry different unlock dates**. When she tries to sell 10,000 in December, the January lot is free while the August lot is still locked — the contract must do **per-lot accounting** and release only the unlocked portion. Half of all “but my lockup has passed!” complaints come from users not knowing they hold multiple lots.
- **Station ⑤ Holder-count cap**: Exchange Act Section 12(g): reach **2,000 holders** (or 500 non-accredited), and the issuer trips into registration duties — the private status is pierced. So the contract maintains a holder counter: if Bob is a new holder and the count already stands at 2,000, **this transfer would make him holder #2,001 — revert**.
- **Station ⑥ Concentration / volume caps**: After receiving these 10,000 tokens, would Bob exceed the “10% single holder” cap? Some products add daily volume limits. This guards against silent control shifts and market manipulation.
- **Station ⑦ Sanctions re-screen**: Bob passing KYC last year counts for nothing — **the lists update daily** (Stage 7.1's strict liability). At transfer time, if Bob's identity or address matches the latest SDN update, revert. This is “compliance is a subscription” rendered in code.
- **Station ⑧ Pause / freeze state**: Has the token been \`pause()\`d wholesale (a corporate action in progress, a regulatory inquiry)? Are Alice's or Bob's addresses partially frozen via \`freezePartialTokens\` (Stage 6.5's switches)?

All eight green, and only then does the real \`transfer\` execute: update balances, update the holder counter, record the lot movement. **A plain ERC-20 checks 1 thing; TBF checked 9** (eight stations plus the balance itself).

<figure>
<svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
<defs><marker id="tr-ah-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--orange-line)"/></marker></defs>
<rect x="8" y="80" width="70" height="46" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
<text x="43" y="99" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="600">Alice</text>
<text x="43" y="114" text-anchor="middle" font-size="8.5" fill="var(--muted)">sells 10,000 TBF</text>
<rect x="102" y="20" width="120" height="40" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="162" y="37" text-anchor="middle" font-size="9.5" fill="var(--orange-ink)" font-weight="600">①identity ②claims</text>
<text x="162" y="52" text-anchor="middle" font-size="8.5" fill="var(--muted)">valid? unrevoked?</text>
<rect x="102" y="146" width="120" height="40" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="162" y="163" text-anchor="middle" font-size="9.5" fill="var(--orange-ink)" font-weight="600">③country ④lockup</text>
<text x="162" y="178" text-anchor="middle" font-size="8.5" fill="var(--muted)">US person? lot free?</text>
<rect x="252" y="20" width="120" height="40" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="312" y="37" text-anchor="middle" font-size="9.5" fill="var(--orange-ink)" font-weight="600">⑤count ⑥concentration</text>
<text x="312" y="52" text-anchor="middle" font-size="8.5" fill="var(--muted)">holder #2001? over 10%?</text>
<rect x="252" y="146" width="120" height="40" rx="8" fill="var(--red-soft)" stroke="var(--line)"/>
<text x="312" y="163" text-anchor="middle" font-size="9.5" fill="var(--ink)" font-weight="600">⑦sanctions ⑧freeze</text>
<text x="312" y="178" text-anchor="middle" font-size="8.5" fill="var(--muted)">list updated today</text>
<rect x="402" y="80" width="100" height="46" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
<text x="452" y="99" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="600">✓ settle</text>
<text x="452" y="114" text-anchor="middle" font-size="8.5" fill="var(--muted)">balances+count+lots</text>
<rect x="530" y="80" width="102" height="46" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
<text x="581" y="99" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="600">Bob</text>
<text x="581" y="114" text-anchor="middle" font-size="8.5" fill="var(--muted)">receives 10,000 TBF</text>
<line x1="78" y1="93" x2="102" y2="48" stroke="var(--orange-line)" stroke-width="1.4" marker-end="url(#tr-ah-en)"/>
<line x1="222" y1="40" x2="252" y2="40" stroke="var(--orange-line)" stroke-width="1.4" marker-end="url(#tr-ah-en)"/>
<line x1="162" y1="60" x2="162" y2="146" stroke="var(--orange-line)" stroke-width="1.4" marker-end="url(#tr-ah-en)"/>
<line x1="222" y1="166" x2="252" y2="166" stroke="var(--orange-line)" stroke-width="1.4" marker-end="url(#tr-ah-en)"/>
<line x1="372" y1="40" x2="402" y2="90" stroke="var(--orange-line)" stroke-width="1.4" marker-end="url(#tr-ah-en)"/>
<line x1="372" y1="166" x2="402" y2="116" stroke="var(--orange-line)" stroke-width="1.4" marker-end="url(#tr-ah-en)"/>
<line x1="502" y1="103" x2="530" y2="103" stroke="var(--orange-line)" stroke-width="1.4" marker-end="url(#tr-ah-en)"/>
<text x="320" y="205" text-anchor="middle" font-size="9.5" fill="var(--muted)">Any station failing → full revert + machine-readable reason code; a plain ERC-20 checks only “is the balance enough”</text>
</svg>
</figure>

### ② Where the checks live: in-token, external allowlist, venue — three architectures

The eight checks are the logic; **where they execute** is the architecture. Three mainstream designs, each a trade:

- **In-token**: the ERC-3643 route. \`transfer\` internally calls \`canTransfer(from, to, amount)\` first, and the compliance contract walks its modules; fail one, revert. **Upside**: the rules travel with the token, so **peer-to-peer (P2P) transfers are governed too** — two wallets transacting privately still pass all eight stations. **Price**: every transfer pays the checks' gas, and rule upgrades touch on-chain contracts (the modular design exists precisely for this).
- **External allowlist**: the token stays simple; \`transfer\` only asks an external registry “are both addresses on the list?” The eight checks run **off-chain**, and results sync into the list. **Upside**: cheap and flexible on-chain; rule changes never touch the token contract. **Price**: coarse granularity (the list only knows “in / out” — per-transfer logic like lockups and concentration caps can't fit and must be handled off-chain, with the list adjusted after the fact).
- **Venue-level**: the token flows nearly free; checks run only at the **trading venue** (the ATS or exchange) during matching and settlement. **Upside**: lightest on-chain, closest to plain-token UX. **Fatal flaw**: **it can't govern off-venue P2P** — two wallets bypassing the venue transfer directly and the checks are theater. So pure venue-level designs either pair with a hard rule of “tokens may only move to venue custody addresses,” or fit only products with a higher regulatory tolerance.

One line to remember the trade: **if P2P is to exist legally, the checks must live in the first two; checks living at a venue cannot govern transfers that bypass the venue.**

### ③ Rejections must explain themselves: machine-readable reason codes and pre-flight

Reverting is only half of compliance; **explaining why** is the other half — and it directly decides whether the product is usable.

Good implementations make \`canTransfer\` return **machine-readable reason codes**, not a bare revert: \`RECEIVER_NOT_VERIFIED\` (Bob has no KYC), \`CLAIM_EXPIRED\` (eligibility claim lapsed), \`JURISDICTION_BLOCKED\`, \`LOCKUP_ACTIVE\` (47 days remaining), \`HOLDER_CAP_REACHED\` (would become holder #2,001), \`SANCTIONS_HIT\`, \`TOKEN_PAUSED\`. Wallets and frontends take the code and translate “transaction failed” into human language: “The recipient hasn't completed investor verification — invite them to finish it and this transfer will go through.”

One step further is **pre-flight**: \`canTransfer\` is a **view function** — you can ask “would this transfer pass?” without spending any gas. So a good UI simulates **before you press send**: ineligible recipient addresses grey out, locked balances display separately as “transferable in 47 days,” and amounts breaching the concentration cap warn in real time. The user learns the answer **without spending a cent of gas**. The gap in compliance UX is the gap between “it reverted, go guess why” and “the button never lets you click wrong” — **compliance UX is product quality, not a cost line.**

### ④ The price and the reality: gas, latency, and the truth behind most support tickets

The honest ledger:

- **Gas**: eight stations mean several extra external calls and storage reads per transfer; gas can run at **multiples** of a plain ERC-20 (tens of thousands vs. one-to-two hundred thousand gas). On Ethereum mainnet at peak that's real money — and one direct reason many RWA issuers choose L2s or permissioned chains (Stage 2.6).
- **Latency and freshness**: on-chain claims are a cache of the three gates' conclusions (Stage 7.1), and caches go stale — the window where the sanctions list has updated off-chain but the claim hasn't been revoked on-chain yet is the compliance team's most nervous stretch.
- **The truth about tickets**: teams running these systems will tell you that the two biggest sources of “why won't my RWA transfer” tickets are utterly mundane: **expired eligibility claims** (the 90-day verification window lapsed and the user didn't know to renew) and **miscalculated lockups** (multi-lot positions the user assumed were fully unlocked). Not hackers, not bugs — **calendar problems**. Which circles back to ③: a system that can say “47 days remaining” cuts its ticket volume in half.

If you take away one sentence: **every check station is a regulation compiled into an if — identity, eligibility, jurisdiction, lockup, holder count, concentration, sanctions, freeze; only eight greens settle — and that is the whole compliance machine, seen through one transfer.**
`,

  demo: "transfer-gauntlet",

  analogy: `
Picture this transfer as an **international parcel clearing customs**.

Ship an ordinary domestic parcel (an ERC-20), and the courier checks one thing: enough postage on the box (the balance). Stamped? It ships.

Ship a **controlled good** (a tokenized security) — a medical device, say — and it's an entirely different pipeline: does the recipient hold an import license (identity + eligibility claims)? Does the destination country allow this category at all (jurisdiction check)? Has the post-manufacture quarantine period elapsed (lockup — and note, **each production batch has its own date**: half the crate may ship while the other half can't)? Does the destination country have a quota for this device class (holder cap)? Has a single buyer exceeded their purchase limit (concentration)? Was the embargo list updated the morning of shipping (sanctions re-screen)? Did customs suspend the whole category today (pause)?

What makes a good customs office isn't how much it blocks — it's that **it blocks legibly**: every returned parcel carries a standardized slip — “quarantine incomplete, 47 days remaining” — never a shrugging “does not comply.” The best offices offer **pre-clearance**: check online before shipping and learn exactly whether you'd pass and on which rule you'd fail, no wasted trip (the canTransfer pre-flight).

As for where the checkpoint sits — inside a **smart seal glued to every parcel** (in-token: even private hand-offs trigger it), inside **customs' own whitelist system** (external allowlist), or only at the **official carrier's counter** (venue-level: private trades escape it entirely) — that's a choice between three customs regimes, each with its own leaks and its own costs.
`,

  misconceptions: [
    "“Transfer restrictions just means checking a whitelist.” —— A whitelist covers only part of stations ① and ②. The full pipeline adds jurisdiction, per-lot lockups, holder counting, concentration, transfer-time sanctions re-screens, and freeze state — eight check families for eight bodies of regulation; drop one and you have a compliance hole.",
    "“Two people who both passed KYC can always transfer to each other.” —— Not necessarily. With both identities clean, a transfer can still die on: an expired eligibility claim, Reg S shares moving to a US person, an unfinished lockup, the recipient becoming holder #2,001, or a breached 10% concentration cap. Identity is only the first of eight stations.",
    "“Lockups run per account: once my first purchase clears 12 months, everything's unlocked.” —— Lockups run per lot: each subscription's tokens carry their own unlock date. Buy in January and again in August, and in December only the January lot moves. Half the “but my lockup passed!” tickets are this misunderstanding.",
    "“Checking at the exchange is enough — let the token float free.” —— Venue-level checks can't govern off-venue P2P: two wallets transferring directly bypass the exchange entirely. For peer-to-peer transfers to exist legally, checks must live in the token (canTransfer) or an external allowlist — the sharpest dividing line among the three architectures.",
    "“A failed transfer means the system is broken.” —— Most failures are the compliance machine working correctly: a lapsed claim, an unfinished lockup, a list update. Good implementations return machine-readable reason codes (LOCKUP_ACTIVE and friends) and support gas-free pre-flight — “failures that explain themselves” is core product quality in this category.",
    "“These checks defeat the point of tokenization — it's as much hassle as traditional securities.” —— The content of the checks is identical (the law didn't change), but the execution transformed: traditional markets run them through human transfer-agent review over T+N days; on-chain, eight stations complete inside one block, rejections explain themselves instantly, and pre-flight is free. Compliance didn't disappear — it got compiled.",
  ],

  quiz: [
    {
      q: "Roughly how do the check counts compare between an ERC-3643 transfer and a plain ERC-20 transfer?",
      options: [
        "Both check only the balance",
        "ERC-20 checks 1 thing (balance); a tokenized security passes about eight compliance stations (identity, eligibility, jurisdiction, lockup, count, concentration, sanctions, freeze) plus the balance",
        "ERC-20 checks more, being more decentralized",
        "Both check KYC, just in different orders",
      ],
      answer: 1,
      explain: "That's the meaning of the demo's counter: 1 vs 9. Every station is one regulation compiled into an if.",
    },
    {
      q: "Why must lockups be accounted per lot?",
      options: [
        "To collect more gas",
        "Because tokens subscribed at different times start their Rule 144 / Reg S clocks separately — one account can be half unlocked, half still locked",
        "Because blockchains can't store dates",
        "Because regulators require manual approval per transfer",
      ],
      answer: 1,
      explain: "The January lot and the August lot unlock on different days. The contract must release lot by lot — the number-one source of “but my lockup passed!” tickets.",
    },
    {
      q: "What does station ⑤'s 2,000-holder cap protect against?",
      options: [
        "Network congestion",
        "Exchange Act 12(g): reaching 2,000 holders triggers registration duties and pierces the private exemption — so the contract reverts rather than let Bob become holder #2,001",
        "A technical limit in wallet software",
        "Token price declines",
      ],
      answer: 1,
      explain: "The holder line is a legal red line, not a technical one. The on-chain holder counter exists to protect the issuer's exemption (Stage 7.2).",
    },
    {
      q: "Why does Bob — KYC'd a year ago — still face a sanctions re-screen (station ⑦) at transfer time?",
      options: [
        "The system distrusts old users",
        "Sanctions lists update daily and violations are strict liability — clean last year means nothing today, so every transfer re-checks against the latest list",
        "To increase gas revenue",
        "Only large transfers get re-screened",
      ],
      answer: 1,
      explain: "Stage 7.1's strict liability plus daily list updates dictate screening at every transfer, not once at onboarding.",
    },
    {
      q: "Which of the three architectures can govern off-venue peer-to-peer (P2P) transfers?",
      options: [
        "Only venue-level",
        "In-token (canTransfer) and external allowlists can — the checks travel with the token/list; venue-level cannot govern transfers that bypass the venue",
        "None of the three",
        "All three, just at different speeds",
      ],
      answer: 1,
      explain: "The critical dividing line: for P2P to exist legally, checks must live in the token or the list — not only at the exchange.",
    },
    {
      q: "What is the product value of canTransfer being a view function (pre-flight)?",
      options: [
        "Faster block inclusion",
        "The UI can simulate the checks free of gas before the user sends: grey out ineligible addresses, show “transferable in 47 days,” warn on cap breaches — turning “revert and guess” into “the button won't let you click wrong”",
        "It bypasses compliance checks",
        "It's visible only to the issuer",
      ],
      answer: 1,
      explain: "Pre-flight + machine-readable reason codes = compliance UX. Operations data agrees: systems that can say “N days remaining” halve their ticket volume.",
    },
  ],

  further: [
    { label: "ERC-3643 official site: the T-REX standard and compliance modules", url: "https://www.erc3643.org/" },
    { label: "EIP-3643: the full standard (canTransfer and friends)", url: "https://eips.ethereum.org/EIPS/eip-3643" },
    { label: "EIP-1404: the simple restricted-token standard (pioneer of reason codes)", url: "https://eips.ethereum.org/EIPS/eip-1404" },
    { label: "SEC Investor.gov: Rule 144 and restricted securities", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-144-selling-restricted-and-control-securities" },
    { label: "Securitize: compliant tokenization platform (DS Protocol) docs", url: "https://securitize.io/" },
  ],
};
