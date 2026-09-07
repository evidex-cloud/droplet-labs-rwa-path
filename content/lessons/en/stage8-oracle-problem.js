export default {
  id: "oracle-problem",
  stage: 8,
  order: 1,
  title: "The Oracle Problem: The Chain Is Blind — Who Reads It the News",
  difficulty: "systems",
  prereqs: ["trust-bridge", "smart-contracts"],

  oneLiner:
    "A smart contract can only read data that's already on-chain — it can't visit a webpage, see a bank balance, or know today's Treasury price. Any off-chain fact has to be written in by someone, and that someone is an oracle. From that moment, the contract's correctness no longer depends only on its code, but on whether the reporter is honest and awake. For RWA this isn't a side issue — it's the load-bearing joint: every NAV, every reserve attestation, every default flag rides on an oracle's back.",

  intuition: `
Start with a thought experiment. You've written the perfect lending contract: if collateral falls below 120% of the loan, liquidate automatically. The logic is airtight, audited three times, not a single bug. Now ask a naive question: **how does the contract know what the collateral is worth right now?**

It doesn't. A smart contract (Stage 2.3) is a program running on a blockchain, and the blockchain's iron law is **determinism**: every node in the world, replaying this transaction today or ten years from now, must compute the exact same result — otherwise consensus collapses. That law leads straight to a conclusion: **a contract cannot make an HTTP request**. The same URL returns different content now versus next year; node A and node B hitting it at the same moment might get different answers. One network call, and every node is keeping its own version of the books.

So the chain is blind: it knows nothing about the world outside itself. Treasury prices, exchange rates, fund NAVs, a bank's balance, whether a loan defaulted — for any of these facts to reach the chain, there is exactly one road: **some off-chain party signs a transaction and writes the number in**. That person reading the newspaper aloud is the **oracle**.

Here's the problem: a blind man can only hear what the reader says. If the reader misreads, reads late, or deliberately lies, the blind man swallows it whole — and your "airtight" contract will **execute a wrong decision with flawless precision**. Blockchain's slogan is "don't trust, verify" — but at the oracle joint it degrades to "**verify the ledger, trust the reporter**." This is the data-layer face of the trust bridge from Stage 1.3 — and the shared protagonist of all four lessons in this stage.

**Here's the map — five parts:**

- **① Why the chain is born blind — the price of determinism and consensus**
- **② Oracles: the hand that writes off-chain facts into the chain**
- **③ Four ways it crashes — each with a real body count**
- **④ The engineering: aggregation, TWAPs, heartbeats & circuit breakers**
- **⑤ The RWA twist: when the data source is singular by nature**
`,

  mechanics: `
### ① Why the chain is born blind: the price of determinism and consensus

Stage 2.1 explained that a blockchain's security comes from "thousands of nodes each recomputing everything, and the results must match." For results to match, every contract execution must be a **pure function**: given the same inputs (on-chain state + transaction data), any node at any time computes the same output. That rules out every "look outside" operation — no \`fetch()\`, no randomness, no time source beyond the block, no file I/O.

- **No network**: the same API returns 4.9% today and 4.7% tomorrow; nodes replaying historical blocks would compute different results and the ledger would instantly fork.
- **No waiting**: a contract can't "wake up at 9 a.m. and pull data" — on-chain code runs only when a transaction triggers it. It doesn't even have the capacity to act on its own.
- **No perception**: bank balances, court rulings, the count of gold bars in a vault — none of it exists for the contract until someone turns it into an on-chain transaction.

Note that this is not a design flaw in Ethereum; it's the **defining cost of a decentralized ledger**: precisely because it refuses to depend on any single external party, it cannot fetch external facts on its own. To get external facts, you must reintroduce an external party — and "who, and how do we stop them from cheating" is the entire discipline of oracle engineering.

### ② Oracles: the hand that writes off-chain facts into the chain

An **oracle** is not a crystal ball; it's just an off-chain program (or a group of them): it fetches data from a source (an exchange API, a bank interface, a fund administrator's report), signs it, and sends an ordinary transaction calling the write function of an on-chain **feed contract**, storing \`(value, timestamp)\`. Afterwards, any contract that wants to "know" the Treasury price is actually reading **the last number written** into that feed contract.

One sentence to puncture the illusion: **a contract never reads "the price" — it reads "a historical snapshot of a price someone claimed."** From this moment your contract has two new failure dimensions:

- **Honesty**: the writer can lie. The contract cannot tell 4.9% from 49% — either is just a number.
- **Liveness**: the writer can vanish. Markets crash, the reporter's server dies, and the on-chain number sits frozen in the happy moment before the crash — while your contract keeps lending against it.

For RWA this joint carries even more weight than in DeFi. In the on-chain world of a tokenized Treasury fund (Stage 10.1's BUIDL), **the daily NAV is fed in, the reserve report is fed in, and even "the issuer defaulted" has to be fed in by someone**. The token is a receipt and the trust lives off-chain — and the oracle is the **only freight route** hauling off-chain truth onto the chain. The route's reliability is the ceiling on the whole system's reliability.

<figure>
<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs>
    <marker id="oracle-problem-arrow-en" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--orange-line)"/></marker>
  </defs>
  <rect x="16" y="30" width="180" height="170" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="106" y="52" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">Off-chain world</text>
  <text x="106" y="80" text-anchor="middle" font-size="11" fill="var(--muted)">T-bill yield 4.9%</text>
  <text x="106" y="100" text-anchor="middle" font-size="11" fill="var(--muted)">Fund NAV $1.0003</text>
  <text x="106" y="120" text-anchor="middle" font-size="11" fill="var(--muted)">Bank reserves $102M</text>
  <text x="106" y="140" text-anchor="middle" font-size="11" fill="var(--muted)">"Borrower defaulted"</text>
  <text x="106" y="180" text-anchor="middle" font-size="10" fill="var(--muted)">The contract sees none of this</text>
  <rect x="250" y="80" width="140" height="70" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="320" y="108" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">Oracle</text>
  <text x="320" y="128" text-anchor="middle" font-size="10" fill="var(--orange-ink)">fetch → sign → write</text>
  <rect x="444" y="30" width="180" height="170" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="534" y="52" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">On-chain world (blind)</text>
  <rect x="464" y="70" width="140" height="52" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="534" y="90" text-anchor="middle" font-size="10" fill="var(--muted)">Feed contract stores:</text>
  <text x="534" y="108" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">(4.9%, yesterday 18:00)</text>
  <text x="534" y="145" text-anchor="middle" font-size="10" fill="var(--muted)">Lending / vault / redemption</text>
  <text x="534" y="162" text-anchor="middle" font-size="10" fill="var(--muted)">contracts only read this snapshot</text>
  <line x1="196" y1="115" x2="248" y2="115" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#oracle-problem-arrow-en)"/>
  <line x1="390" y1="115" x2="442" y2="115" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#oracle-problem-arrow-en)"/>
  <text x="320" y="225" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="700">Contract correctness ≤ this hand's honesty × timeliness</text>
</svg>
</figure>

### ③ Four ways it crashes — each with a real body count

Oracle failures sort neatly into four classes. Walk through them one by one, each with a real corpse attached.

**One: manipulation — feed the contract a lie.** The most famous technique is the **flash-loan price attack**: within a single transaction, the attacker borrows a fortune, slams it into a thin market to send the price flying, lets the oracle that reads that market report the inflated price, then borrows real money against the inflated "collateral." **Mango Markets**, October 2022, is the textbook case: with roughly $5M of capital, the attacker pumped the extremely thin MNGO token about 20x in minutes; the platform's oracle faithfully read the manipulated price, and the attacker "legitimately" borrowed about **$114M** against the inflated valuation. Note the aftermath: the attacker publicly argued "I only used features the protocol allowed," yet in 2024 a US court convicted him of fraud — **"the code allowed it" is not "the law allows it."** File that sentence next to the legal lessons of Stage 5.

**Two: staleness — the truth changed, the feed didn't.** Nobody lied; the number is just old. Classic scene: during the ten minutes of a crash, the feed still shows the price from ten minutes ago. Or the subtler version — a private-credit position (Stage 3.5) is valued by a **quarterly appraisal report**, while the on-chain market trades every second. Pricing today's trades with last quarter's "truth" is functionally the same as pricing them with a wrong number. Staleness isn't a bug; it's the **mismatch between the data's cadence and the chain's cadence** — the next lesson (Stage 8.2) spends its entire length on it.

**Three: source failure — the source itself is wrong.** The oracle relays faithfully, but the thing it relays — some exchange's API, some bank interface — is down, returning garbage, or simply misquoting. Faithful relaying of garbage is still garbage in, garbage out.

**Four: centralization — one key, one bribery target.** If the feed is written by a single address, then the entire protocol's security equals **the security of that one private key**. Steal the key = set any price = drain the protocol. This is why "who feeds it, how many of them, and who are they" is a mandatory question when diligencing any RWA project (it's on Stage 12.3's red-flag checklist).

### ④ The engineering: aggregation, TWAPs, heartbeats & circuit breakers

A decade-plus of scar tissue has settled into a standard engineering stack, one layer per failure class:

- **Multi-source aggregation + median**: don't read one exchange, read ten; don't trust one node — have **N independent nodes** each fetch and sign, with an on-chain contract aggregating to the **median**. One or two manipulated or dead sources don't move a median. This is **Chainlink**'s basic price-feed model: independent node operators + an on-chain aggregation contract, with writes requiring M-of-N signatures. It dilutes "trust one person" into "trust the majority of N."
- **TWAP (time-weighted average price)**: use a weighted average over a window, not the instantaneous price. A flash loan can only send the price flying **within one block**; to move a 30-minute TWAP you must fight the entire market's arbitrageurs for a full 30 minutes — the cost goes from "one transaction" to "a war of attrition." Time-weighting is how you put a price on manipulation.
- **Heartbeat + deviation update policy**: push on a fixed interval in calm times (heartbeat); push immediately when the value moves past a threshold (deviation). Heartbeat guards against "falling asleep," deviation against "jumps." Parameter details belong to Stage 8.2.
- **Circuit breakers and sanity bounds**: the aggregator sets \`minAnswer\` / \`maxAnswer\` — a Treasury yield feed reporting 49%? Reject it, trip the breaker, and downstream contracts drop into conservative mode (pause lending, pause minting). Better to halt than to run poisoned.
- **Consumer-side checks**: the contract reading the feed must defend itself too — check that the timestamp isn't stale and the value is in bounds, instead of reading blindly. Always assume the feed will fail, and write "what happens when it does" into your own code.

Hold onto the structure: **no single layer saves you** — they stack. The median blocks single-point manipulation, TWAP blocks flash loans, the heartbeat blocks staleness, the breaker blocks absurd values — with all four in place, an attacker has to breach four doors at once.

### ⑤ The RWA twist: when the data source is singular by nature

By now you might think you can lift Chainlink's "31 nodes take a median" onto RWA and call it done. **You can't — RWA's data structure is fundamentally different from DeFi's.**

ETH's price is **discovered**: hundreds of exchanges and thousands of market makers quote it simultaneously — naturally multi-source, perfect for aggregation. But the NAV of a tokenized fund? **Exactly one fund administrator** in the world computes it (Stage 3.3): assets minus liabilities over shares, once a day, and the output is **the single official number**. You can't take a median of it across 31 nodes — 31 nodes can only copy the same homework. Reserve reports, default determinations, appraisal values: all the same — **the source is singular by nature**.

So the RWA oracle's role mutates: from "price discoverer" to **attestation carrier**. Multiple nodes here defend against "tampered in transit" and "lazy couriers" — they guarantee "the on-chain number = what the administrator said," but they **cannot guarantee "what the administrator said = the truth."** Trust therefore concentrates in the source's **identity and legal liability**: a NAV signed by a licensed fund administrator is backed by audit duties, professional liability insurance, and a license — if it's wrong, you can sue. A number signed by 31 anonymous nodes — whom do you sue? It's a **different trust model**: not better, not worse, but one to own honestly — in RWA, a "decentralized oracle" decentralizes the courier leg, **not the source**.

If you take away one sentence: **on-chain code never executes wrongly — what's wrong is always the number it believed, so when evaluating any RWA protocol, first ask "who writes this number in, and what happens when they lie or fall asleep."**
`,

  demo: "blind-chain",

  analogy: `
Picture a smart contract as a **blind chess genius**: his play is impeccable — give him any position and he finds the best move — but he cannot see the board. He relies entirely on a **caller** whispering "their knight went to f6."

As long as the caller is honest and prompt, the genius is unbeatable. But notice what just happened: **the ceiling on this game is no longer the genius's skill — it's the caller's character.** If the caller takes the opponent's money and announces "queen to d5" when it went to d8, the genius will play a "perfect" losing move on a board that doesn't exist. If the caller is accurate but five moves behind, the genius is playing against a five-move-old ghost. If the caller dozes off, the genius simply freezes.

The engineer's remedy is to give the genius **five callers who've never met**, with a rule that "at least three must agree before a move counts" (multi-source aggregation to a median); to require that "sudden changes must be announced instantly, and even calm positions get an update every minute" (deviation + heartbeat); and to teach the genius one survival rule: "if you hear nonsense like 'they have nine queens,' stop the game at once" (circuit breaker).

But RWA's chessboard has a special rule: for certain squares, **only one person in the world knows what happened** — like "today's fund NAV," which only the fund administrator can compute. Five callers, fifty callers — they can only relay that one person's words. At that point, what you should really watch is not the number of callers, but **that sole insider's license, audits, and liability** — he must answer in court for every syllable he misreads.
`,

  misconceptions: [
    "“Smart contracts are automatic, so they don't require trusting anyone.” —— Execution is automatic and trustless, but the off-chain data it executes on must be written in by an oracle. “Don't trust, verify” degrades at that joint into “verify the ledger, trust the reporter.” When evaluating a protocol, the oracle is a line on the trust ledger you can't skip.",
    "“An oracle attack means the oracle's code had a bug.” —— On the day of Mango Markets, the oracle code ran flawlessly: it faithfully read the market price. The problem was a market so thin that $5M could move it 20x. Most oracle failures aren't code bugs — they're manipulable, stale, or centralized data sources. Structural problems, not implementation ones.",
    "“Just add more nodes and it's safe.” —— More nodes defend the courier leg against a single rogue, not the source itself being wrong. A fund's NAV has one official origin; 31 nodes can only relay it together. In RWA, the trust anchor is the source's identity and legal liability, not the node count.",
    "“If the feed hasn't updated, the market hasn't moved.” —— Dangerous. A silent feed means one of two things: nothing changed, or the feed system died. A contract without a heartbeat check can't tell them apart — in the crashes of March 2020 and March 2023, protocols kept lending against hours-old prices. Consumers must check the timestamp and refuse anything past its age limit.",
    "“If the code allows an operation, it's legal.” —— That was exactly the Mango Markets attacker's defense; in 2024 he was convicted of fraud. Manipulating a market on-chain and off-chain are the same thing in the law's eyes. It's a general rule of the RWA world: code is the execution layer, law is the liability layer, and both are always running (Stage 5, Stage 11).",
  ],

  quiz: [
    {
      q: "Why can't a smart contract simply make an HTTP request to check the Treasury price?",
      options: [
        "Because blockchains lack the bandwidth",
        "Because consensus requires every node to get identical results when replaying a transaction at any time, and a network call's response varies by time and place — the ledger would fork",
        "Because HTTP is insecure",
        "Because miners block external requests",
      ],
      answer: 1,
      explain: "Determinism is the precondition of consensus: execution must be a pure function. External requests aren't reproducible, so they're forbidden at the protocol level — the defining cost of a decentralized ledger.",
    },
    {
      q: "What core problem did the Mango Markets incident (2022, ~$114M) expose?",
      options: [
        "A code vulnerability in the oracle contract",
        "The oracle faithfully read a price from an extremely thin, flash-capital-manipulable market — when the source is manipulable, the contract 'perfectly executes a wrong decision'",
        "Stolen node private keys",
        "Ethereum congestion delaying the feed",
      ],
      answer: 1,
      explain: "The oracle code didn't fail — it faithfully relayed a manipulated market. The defenses are multi-source aggregation and TWAPs, which turn manipulation from one transaction into a war of attrition.",
    },
    {
      q: "Why does a TWAP (time-weighted average price) resist flash-loan manipulation?",
      options: [
        "It encrypts the price data",
        "It makes the oracle update faster",
        "A flash loan can only spike the price within one block, while moving a 30-minute average requires fighting the whole market's arbitrageurs continuously — manipulation cost rises by orders of magnitude",
        "It bans large trades",
      ],
      answer: 2,
      explain: "Time-weighting puts a price on manipulation: an instantaneous fake price gets diluted in the average, so the attacker must sustain the fake price over time — and the cost explodes.",
    },
    {
      q: "What is the most fundamental difference between an RWA oracle and a DeFi price oracle?",
      options: [
        "RWA oracles update more frequently",
        "RWA data sources are often singular by nature (one fund administrator computes the NAV), so the oracle becomes an attestation carrier rather than a price discoverer, and trust shifts to the source's identity and legal liability",
        "RWA oracles don't need signatures",
        "RWA oracles run on permissioned chains and are therefore safer",
      ],
      answer: 1,
      explain: "ETH's price can be medianed across 31 nodes; a NAV has one official origin. Nodes guarantee 'on-chain number = what the admin said,' not 'what the admin said = the truth' — the latter is backed by licenses, audits, and suability.",
    },
    {
      q: "At minimum, what should a robust feed consumer (e.g., a lending protocol) do when reading a price feed?",
      options: [
        "Use the latest value directly — on-chain data is trustworthy",
        "Check that the timestamp isn't stale and the value is within sane bounds, and predefine a conservative-mode behavior for when the feed misbehaves",
        "Read it ten times and average",
        "Only read the feed during bull markets",
      ],
      answer: 1,
      explain: "Always assume the feed will fail: staleness checks catch 'fell asleep,' bounds checks catch absurd values, and conservative mode (pause lending/minting) ensures you halt rather than run poisoned.",
    },
  ],

  further: [
    { label: "samczsun: So you want to use a price oracle (the classic on oracle attacks)", url: "https://samczsun.com/so-you-want-to-use-a-price-oracle/" },
    { label: "ethereum.org: Oracles (official primer on the oracle problem)", url: "https://ethereum.org/en/developers/docs/oracles/" },
    { label: "Chainlink docs: Data Feeds (the engineering of aggregated feeds)", url: "https://docs.chain.link/data-feeds" },
    { label: "Chainlink Education: What Is a Blockchain Oracle", url: "https://chain.link/education/blockchain-oracles" },
    { label: "US DOJ: Mango Markets manipulation conviction (2024)", url: "https://www.justice.gov/usao-sdny/pr/avraham-eisenberg-convicted-manipulation-and-fraud-scheme-involving-mango-markets" },
  ],
};
