export default {
  id: "onchain-offchain",
  stage: 1,
  order: 2,
  title: "On-chain vs Off-chain: The Token Is On-chain, the Asset Isn't",
  difficulty: "intro",
  prereqs: ["token-lifecycle"],

  oneLiner:
    "Your TBF balance lives on-chain — but the Treasuries sit at a custodian, the cash sits in a bank, the contracts sit at a law firm, and the judge sits in a courthouse. The chain is a mirror: it reflects the estate that lives off-chain. Cryptography only guarantees the mirror itself won't smudge — it never guarantees the room hasn't been emptied. Every RWA failure is, at bottom, some form of mirror desync. And what keeps the mirror in sync isn't cryptography — it's process, attestation, and law.",

  intuition: `
In the last lesson (Stage 1.1) you tailed TBF through its whole life, and you may have noticed something awkward: the journey's most important events — money landing, Treasuries bought, NAV computed, a court paying out claims — **not one of them happened on-chain**. So what exactly is on the chain? What's off it? Who's responsible for what?

This isn't nitpicking. The RWA industry's favorite marketing move is to make “putting it on-chain” sound like the asset itself moved into the blockchain, henceforth immutable and absolutely safe. **That is the industry's most dangerous illusion.** The truth: only the **records** ever move on-chain. The asset itself stays exactly where it was — Treasuries in a custody account, the building in its city, the gold bar in a vault.

Here's an image you can use for the rest of your life: **the chain is a mirror.** It reflects the estate in the room off-chain. This mirror has one remarkable property — **it never smudges**: nobody can quietly retouch the image, the whole world can look at any time, and every frame of history is kept. But a mirror is still a mirror: **it can reflect in perfect detail — a room that was emptied out long ago.** An unsmudged mirror does not mean an unraided room.

In this lesson we put TBF on the table and sort its every part, asking one by one: do you live on-chain, or off? By the end you'll notice a row of “porters” standing in the middle — the bridge that carries off-chain facts into the mirror (oracles, attestations) — important enough to deserve their own lesson (Stage 1.3).

**Here's the map — 4 parts:**

- **① The on-chain inventory: what the mirror shows**
- **② The off-chain inventory: what the room actually holds**
- **③ The middle layer: who carries facts into the mirror**
- **④ Mirror desync: three accidents, and the real “synchronizers”**
`,

  mechanics: `
### ① The on-chain inventory: what the mirror shows

Take TBF apart, and the parts that truly **live on-chain** come down to five kinds:

- **Balances and transfers.** “Address 0xA1 holds 1,000,000” — this record is the chain's day job; changing it takes a private-key signature plus network consensus, and nobody can tamper unilaterally (Stage 2.1).
- **Compliance rules.** The whitelist, country restrictions, lockups — written into the token contract and executed automatically on every \`transfer\` (Stages 6, 7). Note: what lives on-chain is the **rule executor**; the review that decides “is Alice eligible” happens off-chain.
- **The issuer's control switches.** Freeze, pause, forced transfer (\`forcedTransfer\`) — the powers themselves are carved into the contract, and everyone can see both that the switches exist and every time they're used (Stage 6.5).
- **The published NAV number.** A storage slot on-chain reads “$1.0230 per share.” Watch the wording: what lives on-chain is **that number**, not the process that produced it.
- **Event history.** Every mint, burn, transfer, and distribution leaves a timestamped event log — queryable by anyone, forever. This is the chain's genuine gift to auditing.

See the pattern? Everything on-chain is **information**: numbers, rules, records. The chain is a registration machine, and it registers impeccably.

### ② The off-chain inventory: what the room actually holds

Now the parts that stay in the real world — each one far “heavier” than any on-chain record:

- **The Treasuries themselves.** TBF's $1,000,000 of T-bills, registered in an account the custodian (an institution like BNY Mellon) opened for the fund. They exist as **records in another database** (US Treasuries are themselves electronic book entries — Stage 3.4), with no physical connection to your chain whatsoever.
- **The cash.** Subscription money, redemption payables, accrued interest — sitting in bank accounts, moving by wire.
- **The legal documents.** Fund charter, subscription agreement, offering memorandum — **what the token “is” is defined by this stack of paper**, not by code. However beautiful the contract code, a courtroom reads the documents (Stage 5).
- **The KYC files.** Alice's passport scan, proof of address, source-of-funds letter. These must **never go on-chain** — the chain is public and permanent; putting personal data there is streaking in public with no way to ever take it back. On-chain holds only the conclusion (“this address passed review”); the files stay locked at the compliance provider (Stage 7.4 covers the privacy-vs-compliance balancing act).
- **The humans and the courts.** Manager, auditors, regulators, judges. The machinery that can ultimately **enforce** your rights — seizure, judgment, liquidation — is entirely off-chain.

See the contrast? Everything off-chain is **substance and power**: assets, cash, paper, people. Everything the mirror shows has its original in this room.

### ③ The middle layer: who carries facts into the mirror

Facts in the room don't jump into the mirror by themselves. “The Treasuries are still there,” “NAV rose to $1.0230,” “reserves are fully backed” — these off-chain facts need **porters** to carry them on-chain:

- **Oracles**: the pipeline that signs off-chain data and writes it into on-chain contracts. The administrator computes NAV → publishes it on-chain via an oracle → only then can DeFi protocols and wallets read it (Stages 8.1, 8.2).
- **Attestations / proof of reserve (PoR)**: accountants reconcile “tokens issued on-chain vs assets held off-chain,” and the conclusion is fed on-chain periodically as a machine-readable “the money is still there” signal (Stage 8.3).

Remember the porter's nature: **they carry; they do not make the facts true.** An oracle faithfully relays the number the manager hands it — if the manager miscalculated, or lied, the oracle carries the error on-chain just as faithfully. The trustworthiness of the bridge is the entire subject of the next lesson (Stage 1.3).

<figure><svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="ooc-arrow-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-line)"/></marker></defs><rect x="14" y="34" width="240" height="160" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="134" y="58" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">Off-chain: the room</text><text x="134" y="82" text-anchor="middle" font-size="10" fill="var(--muted)">T-bills · cash · custody acct</text><text x="134" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">fund docs · KYC files</text><text x="134" y="118" text-anchor="middle" font-size="10" fill="var(--muted)">manager · auditors · courts</text><text x="134" y="144" text-anchor="middle" font-size="10" fill="var(--orange-ink)">substance &amp; power</text><rect x="386" y="34" width="240" height="160" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="506" y="58" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">On-chain: the mirror</text><text x="506" y="82" text-anchor="middle" font-size="10" fill="var(--muted)">balances · transfers · events</text><text x="506" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">compliance rules · switches</text><text x="506" y="118" text-anchor="middle" font-size="10" fill="var(--muted)">the published NAV number</text><text x="506" y="144" text-anchor="middle" font-size="10" fill="var(--orange-ink)">information &amp; records</text><rect x="270" y="76" width="100" height="76" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="320" y="102" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="700">The bridge</text><text x="320" y="120" text-anchor="middle" font-size="10" fill="var(--orange-ink)">oracles · attestations</text><text x="320" y="136" text-anchor="middle" font-size="10" fill="var(--orange-ink)">proof of reserve</text><line x1="256" y1="114" x2="268" y2="114" stroke="var(--orange-line)" stroke-width="2"/><line x1="372" y1="114" x2="384" y2="114" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#ooc-arrow-en)"/><text x="320" y="216" text-anchor="middle" font-size="11" fill="var(--muted)">The bridge carries facts — it doesn't make them true. The mirror shows whatever the bridge brings in.</text></svg></figure>

### ④ Mirror desync: three accidents, and the real “synchronizers”

Now we can say the sentence you should remember for life: **every RWA failure is some form of mirror desync** — the image in the mirror no longer matches the objects in the room. Three classic scripts:

- **Script one · Stale image**: the assets in the room have dropped or been misappropriated, but the mirror's NAV still shows yesterday. Holders trade at the stale price, and when reality catches up with the mirror, whoever bought last eats the loss. (This is the essence of the March 2023 USDC event: $3.3B of reserves in trouble at Silicon Valley Bank, the market instantly losing faith in “is the image still accurate,” the token trading down to $0.87 — Stage 4.3 does the full post-mortem.)
- **Script two · Something from nothing**: nobody wired money, yet tokens got minted. The mirror shows possessions that don't exist — the most malignant fraud form, a counterfeit press diluting every holder. Several “fractional reserve” stablecoin controversies in history are this type (Stage 4.2).
- **Script three · Substance seized**: a court seizes the asset, or the custodian freezes the account — but the chain doesn't read the news, so the tokens keep trading on-chain as if nothing happened. Buyers are buying a mirror aimed at an empty room.

So what keeps the mirror in sync? Note carefully — **not cryptography**. Cryptography (signatures, hashes, consensus) guarantees exactly one thing: **the mirror itself doesn't smudge** — nobody can quietly retouch the records. What aligns image with substance is three far humbler things:

- **Process**: confirm receipt before minting, burn before wiring at redemption — turning “one-to-one” into an operating procedure nobody can skip (Stage 13.2);
- **Attestation**: an independent third party reconciles on a schedule — “how many tokens on-chain vs how much stuff in the room” — dragging any gap into the light (Stage 8.3);
- **Law**: liars lose licenses, pay fines, go to prison — making “keep the mirror synced” an obligation with teeth (Stage 11).

Which is where this course's throughline lands in this lesson: **the token is a receipt — the trust lives in the off-chain structure.** If you take away one sentence: **the chain is a mirror that never smudges, but what keeps the image matching the room is process, attestation, and law — so when evaluating any RWA, first ask what keeps its mirror in sync.**
`,

  demo: "onoff-sorter",

  analogy: `
Picture the RWA system as **the electronic display board in a bank lobby**. Scrolling across it: every depositor's balance, today's rates, the gold count in the vault. That board is the chain: public, real-time, visible to all — and suppose it has one magical property: **once something is written on it, nobody can secretly alter it**, not even the bank's president.

But a board is still a board. **The gold is in the basement vault, not in the board.** The board says the vault holds 10 tons — but if the security crew quietly trucked the gold away last week, the board will dutifully keep displaying “10 tons.” It isn't broken; it simply **hasn't been told the truth**. Depositors stare at a flawless board while making decisions on fake numbers.

So this bank's real safety hangs on three things that have nothing to do with the board: **the inventory clerk who goes down and counts the vault every day** (attestation), **the operator who honestly types the count into the board** (the oracle), and **the law that puts book-cookers in prison**. The board's immutability guarantees exactly one thing: whatever the operator entered can never be denied later.

That is the whole relationship between on-chain and off-chain: **the more perfect the board, the easier it is to forget the vault is the real thing.** When you look at an RWA project, don't be dazzled by the gorgeous board — ask first: who goes down to the vault? How often? And what happens to them if they lie?
`,

  misconceptions: [
    "“Once an asset is on-chain it's immutable and absolutely safe.” —— What's immutable is the on-chain record, not the off-chain asset. Treasuries can be misappropriated, buildings seized, custodians bankrupted — the chain knows nothing of any of it and keeps displaying the old image. An unsmudged mirror does not mean an unraided room.",
    "“NAV shows up on-chain, so the smart contract must compute it.” —— Only the published number lives on-chain. The computation (valuing the Treasuries, deducting fees, dividing by shares) is done off-chain by the administrator, then carried up by an oracle. The porter takes no responsibility for the number's truth (Stage 8.2).",
    "“KYC data should go on-chain too — the more transparency the better.” —— The exact opposite. The chain is public and permanent; personal files on-chain is a passport taped to the town square, forever. The right architecture: files stay off-chain with the compliance provider, and the chain holds only the conclusion — 'this address passed review' (Stage 7.4).",
    "“Cryptography secures RWA.” —— Cryptography secures only the mirror layer: records can't be retouched, signatures can't be forged. What keeps records matching reality is process, attestation, and law — none of which is cryptography. Conflating the two layers is RWA marketing's favorite sleight of hand.",
    "“On-chain data is real-time, so RWA information is always current.” —— On-chain writes are real-time, but the image of off-chain facts updates only when someone carries it over. NAV feeds once a day; attestations come monthly — between two deliveries, the mirror shows the past. The desync window is precisely the risk window (Stage 8.2 covers heartbeats and deviation thresholds).",
  ],

  quiz: [
    {
      q: "In TBF's “daily NAV,” which part lives on-chain?",
      options: ["The whole process of valuing the Treasuries and computing NAV", "Only the published number (e.g. $1.0230)", "The administrator's working papers", "The custodian's account statements"],
      answer: 1,
      explain: "On-chain holds the result number; the computation, working papers, and statements all live off-chain and are carried up by an oracle (Stage 8.2).",
    },
    {
      q: "Why must KYC files never go on-chain?",
      options: ["Because chain storage is too expensive", "Because the chain is public and permanent — personal data on-chain is an unretractable public streak", "Because regulators ban blockchain use", "Because the files are too large to fit"],
      answer: 1,
      explain: "The right architecture: files stay locked off-chain at the compliance provider; on-chain holds only the conclusion 'this address passed review' (Stage 7.4).",
    },
    {
      q: "What does “mirror desync” refer to?",
      options: ["A blockchain network fork", "On-chain records no longer matching off-chain reality — stale NAV, unbacked minting, or seized assets with tokens still trading", "Wallet balances displaying with a delay", "A failed cross-chain bridge transaction"],
      answer: 1,
      explain: "Every RWA failure is some desync: the mirror isn't smudged, but what it shows is no longer what the room holds.",
    },
    {
      q: "What actually keeps the on-chain image in sync with off-chain reality?",
      options: ["Stronger encryption algorithms", "Process (mint only after receipt) + attestation (periodic reconciliation) + law (lying has consequences)", "A faster blockchain", "More decentralized consensus"],
      answer: 1,
      explain: "Cryptography only guarantees the mirror itself doesn't smudge; aligning image with substance takes these three off-chain things.",
    },
    {
      q: "USDC traded down to $0.87 in March 2023. How does this lesson's framework read that event?",
      options: ["The Ethereum network was attacked", "The contract code had a bug", "The market lost confidence in whether the image was still accurate — $3.3B of reserves stuck at Silicon Valley Bank meant trouble in the room, so the mirror became suspect", "An oracle was manipulated by hackers"],
      answer: 2,
      explain: "The on-chain USDC contract was untouched — the trouble was in the off-chain reserves (the room) and in the market's confidence in mirror sync (Stage 4.3 does the full post-mortem).",
    },
  ],

  further: [
    { label: "Chainlink Education Hub: the oracle problem (why the bridge is hard)", url: "https://chain.link/education-hub/oracle-problem" },
    { label: "Nick Szabo: Wet code and dry code (the classic on legal code vs computer code)", url: "https://unenumerated.blogspot.com/2006/11/wet-code-and-dry.html" },
    { label: "BIS Annual Economic Report 2023, ch. III: the tokenization blueprint (a central-bank view of unified on/off-chain ledgers)", url: "https://www.bis.org/publ/arpdf/ar2023e3.htm" },
    { label: "Circle: USDC reserves and transparency page (watch a real project sync its mirror)", url: "https://www.circle.com/transparency" },
  ],
};
