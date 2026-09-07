export default {
  id: "why-not-erc20",
  stage: 6,
  order: 1,
  title: "Why a Plain ERC-20 Can't Hold a Security",
  difficulty: "systems",
  prereqs: ["erc20-tokens", "token-vs-claim"],

  oneLiner:
    "ERC-20's transfer checks exactly one thing: is the balance big enough. Every transfer of a security, by contrast, has dozens of legal checks riding on it: who the buyer is, whether they're eligible, what country they're in, whether the lockup has expired, whether anyone involved is sanctioned. Mint Reg D fund shares as a plain ERC-20 and within one week you can collect the full violation set — securities law, sanctions law, the Exchange Act. In this lesson we deliberately run that crash in full, then pull a requirements spec out of the wreckage — it's the blueprint for all of Stages 6 and 7.",

  intuition: `
In Stage 2.4 you saw everything ERC-20 owns: one address→balance table and six functions. Its \`transfer\` logic fits in a sentence: **if your balance ≥ the amount, it goes through**. It doesn't ask who you are, who the receiver is, what day it is, or what country either of you is in. That total defenselessness is its charm — and, in the world of securities, its death sentence.

Now run a thought experiment. You manage a fund. You've raised a Treasury fund from accredited investors under **Reg D** (the US private-placement exemption — Stage 7.2 covers it in depth), and then inspiration strikes: "Let's mint the shares as an ERC-20 and send them to investors. So convenient!" The moment the contract deploys, everything looks fine. Then the market starts doing what it does every single day: **transferring freely**.

Over the next seven days, every day brings one \`transfer\` that is perfectly legal in the ERC-20 world and detonates a landmine in the securities world. This is not an exaggeration — **every single day in this week has a real-world enforcement precedent behind it**. Watch the crash to the end and you'll see the point with total clarity: the problem isn't the blockchain — it's that **a plain ERC-20 leaves the transfer-restriction clause on page 87 of a PDF instead of compiling it into the \`transfer\` function**.

**Here's the map — four parts:**

- **① The week from hell: seven legal transfers, seven violations**
- **② The autopsy: a requirements spec pulled from the wreckage**
- **③ The fork in the road: enforce off-chain, or inside the token**
- **④ A brief history of the standards: ERC-1400 to ERC-3643**
`,

  mechanics: `
### ① The week from hell: seven legal transfers, seven violations

Open the calendar — one landmine per day. Each day, all that happens on-chain is one ordinary \`transfer\` — the balance is sufficient, so it succeeds.

- **Day 1: a retail buyer picks some up on a DEX.** Someone seeded the shares into an automated market maker pool, and an ordinary retail investor buys a slice for 500 USDC. Two Reg D red lines snap at once: **no general solicitation** (listing on a public trading pool ≈ advertising to the entire world), and **accredited investors only** (this buyer clearly isn't one). The private-placement exemption's foundation is broken; the whole offering risks being recharacterized as an unregistered public offering.
- **Day 2: an OFAC-sanctioned address receives tokens.** A holder transfers shares to an address on the sanctions list (the SDN List). Sanctions law is **strict liability** — "I didn't know" is not a defense. Even as a passive issuer, providing financial assets to a sanctioned party is a violation, with penalties starting in the hundreds of thousands of dollars per transaction.
- **Day 3: a resale inside the lockup.** Reg D private securities are bound by **Rule 144**: generally a **12-month** lockup before resale. It's day 3 after issuance, and an investor sells. The resale restriction is written in black and white on page 87 of the subscription agreement — but the \`transfer\` function can't read PDFs.
- **Day 4: the holder count blows past 2,000.** Fractionalization worked too well; on-chain addresses cross two thousand overnight. Section **12(g)** of the US Exchange Act: exceed 2,000 holders of record (or 500 non-accredited), and you're forced to register with the SEC and disclose like a public company — a small fund suddenly carrying public-company compliance costs.
- **Day 5: an investor dies, and the private key dies with him.** His heirs arrive with a court document: "Transfer the shares to the estate account." You can't — ERC-20 has no function whatsoever for moving tokens without the holder's signature. **The shareholder register is now permanently wrong**: legally the shares belong to the estate; on-chain they sit forever at an address nobody can move.
- **Day 6: a court orders you to freeze a specific address's tokens.** Proceeds of a fraud flowed into your token. A judge issues a freeze order requiring you to "prevent that address from transferring out." You go through the contract line by line: no \`freeze\`, no \`pause\`, nothing. **You are technically unable to comply with a court order that binds you** — which is itself a fresh legal risk.
- **Day 7: transfer-agent reporting day.** Regulation requires you to produce the shareholder register (Stage 3.4 covered the transfer agent's job). You export the on-chain holder list: **5,000 anonymous 0x addresses**. Names? Nationalities? Tax IDs? No comment. In the law's eyes this "register" is roughly a blank sheet of paper.

The week ends. The closing statement is one sentence: **every transfer was legal inside the EVM, because the only thing \`transfer\` checks is the balance — and of the dozens of things the law checks, it knows none.**

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="wn20-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="16" y="20" width="280" height="260" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="156" y="46" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">What ERC-20 transfer checks</text>
  <rect x="40" y="66" width="232" height="40" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="156" y="91" text-anchor="middle" font-size="11" fill="var(--ink)">balance ≥ amount? ✓ go</text>
  <text x="156" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">(That's it. Really.)</text>
  <rect x="344" y="20" width="280" height="260" rx="12" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="484" y="46" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">What securities law checks</text>
  <text x="364" y="74" font-size="10" fill="var(--ink)">□ Buyer KYC'd, identity known?</text>
  <text x="364" y="96" font-size="10" fill="var(--ink)">□ Buyer accredited (Reg D)?</text>
  <text x="364" y="118" font-size="10" fill="var(--ink)">□ Neither party sanctioned?</text>
  <text x="364" y="140" font-size="10" fill="var(--ink)">□ Buyer's jurisdiction allowed?</text>
  <text x="364" y="162" font-size="10" fill="var(--ink)">□ Rule 144 lockup expired?</text>
  <text x="364" y="184" font-size="10" fill="var(--ink)">□ Holder count under cap (12(g))?</text>
  <text x="364" y="206" font-size="10" fill="var(--ink)">□ Freeze orders enforceable?</text>
  <text x="364" y="228" font-size="10" fill="var(--ink)">□ Register named &amp; reportable?</text>
  <text x="484" y="260" text-anchor="middle" font-size="10" fill="var(--orange-ink)" font-weight="600">Each box is a potential fine</text>
  <line x1="296" y1="150" x2="340" y2="150" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#wn20-arr-en)"/>
</svg>
<figcaption>What the code checks on the left; what the law checks on the right — the gap between them is the bridge this stage builds.</figcaption>
</figure>

### ② The autopsy: a requirements spec pulled from the wreckage

The value of a post-mortem: the seven landmines reverse-engineer neatly into a **requirements spec for a securities-grade token**. This list is the table of contents for the lessons ahead — each item tagged with who solves it:

- **Identity-gated transfers**: both parties must be identified, verified people — not anonymous addresses → ERC-3643 in Stage 6.2 and on-chain identity in Stage 6.3.
- **Eligibility and jurisdiction rules**: only accredited investors may hold; some countries are banned outright → Stage 7.2.
- **Lockups / holding periods**: Rule 144-style time locks must bind at the contract layer → Stage 7.3.
- **Holder-count caps**: the contract must count heads and refuse new holders as it approaches 2,000 → this stage and Stage 7.3.
- **Freeze / forcedTransfer / pause**: court orders and sanctions directives must be technically executable → Stage 6.5.
- **Lost-key recovery**: a legal claim can't die with a hardware wallet → recoveryAddress in Stage 6.5.
- **Register sync**: the on-chain holder list must map to the legal shareholder register → Stage 5.3 (in some jurisdictions the token itself can be the register).
- **Auditability**: every admission, freeze, and forced transfer must leave a queryable event log for regulators and auditors.

Notice something: **not one item on this list is a "blockchain problem"** — every one is a century-old rule of securities operations. Tokenization invented no new obligations; it only turned "obligations on paper, enforced by intermediaries" into a multiple-choice question: do you compile the obligations **into code**?

### ③ The fork in the road: enforce off-chain, or inside the token

The multiple-choice question has two options.

**Option A: enforce off-chain.** Let the token transfer freely and have the rules enforced by the system's perimeter — use a permissioned chain to keep everyone irrelevant out entirely, or degenerate all the way to "a database with a nice front end." Most interbank settlement networks take this road (Stage 2.6 touched on permissioned chains). The price: you give up everything a public chain offers — no open wallet ecosystem, no composability, no globally reachable secondary market. You've built a more expensive database.

**Option B: enforce on-chain — compile the rules into the token itself.** \`transfer\` no longer just checks the balance; it first asks around: "Is the receiver verified? Eligible? Do all the rule modules approve?" Only then does it move the balance — otherwise it **reverts with a reason**. The token stays on the public chain, inheriting the entire infrastructure of wallets, explorers, and DeFi, but every transfer carries its own compliance check. The products of this route are the **security token standards**.

One pragmatic middle path in the real world is worth knowing: some flagship products (Securitize's DS protocol family, BlackRock's BUIDL — Stage 10.1 goes deep) keep the token itself close to ERC-20 and put the checking logic in **linked whitelist / compliance contracts** consulted at transfer time. Different shapes, same idea: **someone has to run the checks; the only question is which contract the checking code lives in.**

### ④ A brief history of the standards: ERC-1400 to ERC-3643

The 2017–2018 security-token boom (the STO wave — Stage 10.6 covers why it receded) produced the first generation of proposals: the **ERC-1400** family (partitioned balances and transfer restrictions with explanations) and **ERC-1404** (the minimalist route: bolt a \`detectTransferRestriction\` check onto transfer). They answered "can we block?" but left "how do we know who anyone is" — identity, eligibility, who vouches — blank.

**ERC-3643** (community name **T-REX**, Token for Regulated EXchanges) completed the puzzle: a full system of identity registries, trusted claims, modular compliance, and issuer powers — while staying **ERC-20 interface compatible**, so ordinary wallets still show balances and initiate transfers; the transfers just pass through security first. Shepherded by Tokeny (now part of the Apex Group), it became an official ERC in 2023 and claims tens of billions of dollars tokenized across its ecosystem (as of 2025) — the most widely adopted open standard among institutions. It's the star of the next lesson.

If you take away one sentence: **the plain ERC-20 died of "transfers that never ask who" — and the entire job of a securities-grade standard is to compile the rules on page 87 of the offering documents into the ifs inside \`transfer\`.**
`,

  demo: "erc20-fail",

  analogy: `
Think of a security as **prescription medicine**, and ERC-20 as a **vending machine**.

The vending machine is the king of retail: insert coins, dispense, sells to anyone, open 24 hours. For selling cola, it's perfect. But now you've loaded a row of prescription painkillers into it. The machine itself hasn't changed at all — it keeps running beautifully — and **every bottle it dispenses is perfectly consistent with the machine's logic while violating pharmaceutical law**: sold to people without prescriptions, sold to minors, sold into states where it's banned, and with no sales record kept.

A week later the drug regulator knocks — and the party held liable isn't the vending machine, it's **you**, the person who put the drugs in. Protesting that "the machine operated flawlessly" gets you nowhere: the problem was never that the machine broke, but that **checking prescriptions was never part of the machine's design**.

The way out isn't retreating to "pharmacist counters only" (that's abandoning automation — going back off-chain). The way out is building a **dispensing machine with a card reader**: swipe your health card to prove identity, verify the prescription against the network, and only when everything passes does the bottle drop — and when it refuses, the screen tells you exactly which requirement you're missing. You keep ninety percent of the convenience and go from zero compliance to full. That retrofitted machine is next lesson's ERC-3643.
`,

  misconceptions: [
    "“Writing the compliance clauses into the whitepaper and subscription agreement is enough; the chain can do whatever.” —— It isn't. When the Day 3 Rule 144 violation happened, the clause was sitting right there on page 87 — but the transfer function doesn't read PDFs. A legal obligation without a technical enforcement mechanism means hoping every anonymous address obeys the law voluntarily.",
    "“The violating holder did the transfer — it's not the issuer's problem.” —— A dangerous misunderstanding. Maintaining the private-placement exemption, sanctions compliance, and the 12(g) registration duty all fall primarily on the **issuer**. Holders transfer recklessly; the fines are mostly addressed to you.",
    "“This is a blockchain flaw — proof that securities don't belong on-chain.” —— The opposite. It's a flaw of the **plain ERC-20**, which was designed for permissionless fungible tokens in the first place; using it for securities is using the wrong tool. Securities-grade standards (ERC-3643 and kin) prove the chain can hold every one of these rules.",
    "“Just use a permissioned chain and all of this goes away.” —— A permissioned chain only solves “who gets in the building,” at the cost of the public chain's wallet ecosystem, composability, and liquidity. And among those admitted, you still must check eligibility, lockups, and holder counts — not one check disappears; it just gets written somewhere else.",
    "“The holder cap is a minor detail — what's the harm in a few extra addresses?” —— Cross 12(g)'s 2,000-holder red line and a small fund must register and disclose like a public company, at a compliance cost in the millions per year. That's why serious security-token contracts count holders in real time and refuse to let holder number 2,001 exist.",
  ],

  quiz: [
    {
      q: "Before letting a transfer through, what does ERC-20's transfer function check?",
      options: [
        "That the sender's balance is sufficient — that one thing only",
        "The balance, plus whether the receiver has passed KYC",
        "The balance, plus whether either party is sanctioned",
        "The balance, plus whether the transfer falls inside a lockup",
      ],
      answer: 0,
      explain: "A plain ERC-20 checks only the balance. Identity, eligibility, sanctions, lockups — it knows nothing of them, which is the root of the whole crash.",
    },
    {
      q: "Day 2 — tokens reaching a sanctioned address — is especially dangerous because of which feature of sanctions law?",
      options: [
        "Fines are fixed and small",
        "Strict liability — “I didn't know they were sanctioned” is not a defense",
        "It applies only to banks, not tokens",
        "Only active sending is illegal; passive receiving doesn't count",
      ],
      answer: 1,
      explain: "OFAC sanctions are strict liability: knowledge and intent don't matter — providing financial assets to a sanctioned party is a violation. Which is why a compliant token must block it at transfer time.",
    },
    {
      q: "What landmine does Exchange Act Section 12(g) plant under this fund?",
      options: [
        "It bans funds from using blockchains",
        "It requires all tokens to lock for 12 months",
        "Exceed 2,000 holders of record and you must register and disclose with the SEC like a public company",
        "It bans selling shares to foreigners",
      ],
      answer: 2,
      explain: "Fractionalization inflates holder counts easily; crossing the 2,000 line triggers public-company-grade registration and disclosure — so a compliant token must count heads and enforce a holder cap.",
    },
    {
      q: "What structural flaw does Day 5 — the investor's death and lost key — expose in a plain ERC-20?",
      options: [
        "Gas fees are too expensive for the heirs",
        "There is no mechanism to move tokens without the holder's signature, so legal changes of ownership can't reach the chain and the register is permanently wrong",
        "ERC-20 doesn't support large transfers",
        "The heirs would need to redo KYC",
      ],
      answer: 1,
      explain: "The legal claim doesn't vanish with the key (Stage 5.1), but a plain ERC-20 has no recovery / forcedTransfer enforcement hook — so the on-chain record permanently diverges from legal fact.",
    },
    {
      q: "At the fork of “where do the rules get enforced,” which route do security token standards take?",
      options: [
        "Retreat to permissioned chains; never issue securities on public chains",
        "Compile the rules into the token contract: transfer runs identity and compliance checks first, and reverts if any fail",
        "Rely on investors voluntarily honoring the subscription agreement",
        "Abolish secondary transfers; allow only subscription and redemption",
      ],
      answer: 1,
      explain: "Stay on the public chain and inherit wallets and composability, but make every transfer carry its own checks — ERC-3643 and kin are this route's products; some products put the checks in linked compliance contracts, same idea.",
    },
  ],

  further: [
    { label: "EIP-20: the original ERC-20 standard (see for yourself what it checks)", url: "https://eips.ethereum.org/EIPS/eip-20" },
    { label: "EIP-3643: the permissioned token standard (next lesson's star)", url: "https://eips.ethereum.org/EIPS/eip-3643" },
    { label: "SEC: Reg D private placements, official explainer", url: "https://www.sec.gov/resources-small-businesses/exempt-offerings/private-placements-rule-506b" },
    { label: "Investor.gov: Rule 144 resale restrictions", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-144-selling-restricted-and-control-securities" },
    { label: "ERC-1400 security token standard (the full early attempt)", url: "https://github.com/SecurityTokenStandard/EIP-Spec" },
  ],
};
