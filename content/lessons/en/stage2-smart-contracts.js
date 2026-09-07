export default {
  id: "smart-contracts",
  stage: 2,
  order: 3,
  title: "Smart Contracts: Self-Executing Programs on a Chain",
  difficulty: "core",
  prereqs: ["what-is-blockchain"],

  oneLiner:
    "A smart contract is **a program deployed at an address on the chain**: it has its own state, its own functions, even its own money. Anyone can call it by sending a transaction, and thousands of nodes each execute it and arrive at **exactly the same** result — so its promises are backed by consensus, not by a company on duty. But RWA-land holds a subtle twist: **“code is law” is a slogan, and real RWA contracts are almost always UPGRADEABLE** — because laws change, bugs happen, and courts issue orders. Which makes “who holds the upgrade key” a trust point you must diligence.",

  intuition: `
The last two lessons nailed down the ledger (Stage 2.1) and signatures (Stage 2.2): nobody can unilaterally edit the books, and no instruction counts without a signature. But so far this ledger records only one thing — “who sent how much to whom.” It's a **dead ledger**.

Real-world finance is far more than transfers. Take the most ordinary scenario: you're buying a used camera from a stranger — how do you guarantee cash-for-goods? The traditional answer is a **middleman**: an escrowed marketplace transaction — you pay the platform, the platform holds the money, you confirm delivery, and only then does the platform release it to the seller. It works, but what you're trusting is that “the platform won't vanish, won't play favorites, won't glitch.” The middleman takes a fee — and can become the problem at any moment.

A **smart contract** offers the other road: write the rules — “deposit → confirm → release/refund” — **as code, and deploy it onto the chain**. The money sits at the contract's address — not in the buyer's hands, not in the seller's, not in any company's; once deployed, **not even the author can meddle with how it executes**; and the instant the condition is met, thousands of nodes execute the release and witness it together. The middleman changes from “a company” to “a program everyone can read and no one can interfere with.”

For RWA, this is the engine room: BUIDL's share issuance and transfer checks (Stage 10.1), ERC-3643's compliance gates (Stage 6.2), automated redemption and distributions (Stage 8.4) — all smart contracts. This lesson first takes the machine apart, then faces a truth most tutorials dodge: **why RWA contracts, of all things, must be changeable.**

**Here's the map — five parts:**

- **① A contract = a program living at an address — state, functions, events**
- **② Walking through an escrow contract — deposit, confirm, release, end to end**
- **③ Why the outcome is “consensus-guaranteed” — and what gas is**
- **④ “Code is law” is a slogan — upgradeability and the proxy pattern**
- **⑤ Contracts can't reach off-chain — oracles, and a preview of “a token is just a contract”**
`,

  mechanics: `
### ① A contract = a program living at an address: state, functions, events

Stage 2.2 said an address usually has a keypair behind it. But Ethereum has a second kind of address: the **contract address** — no private key behind it, just a **program** in residence. A developer writes the code (the mainstream language is **Solidity**), sends a special transaction to **deploy** it, and the program permanently acquires an address, say \`0x7a25…\`. From then on it owns three things:

- **State (storage)**: its private database, recorded on-chain and replicated across thousands of nodes along with the ledger. For instance: “who the buyer is, how much is deposited, which step we're at.”
- **Functions**: the “buttons” the outside world can press. Anyone (or another contract) can call one by sending a **signed transaction** (Stage 2.2) to the contract's address naming the function. Functions can have door policies: “only the arbiter may press this button.”
- **Events**: the contract's **public diary**. At every key action it writes a log line — “Deposited 2 ETH,” “Released to seller” — changing no state, existing purely for outsiders (your wallet, audit software, block explorers) to subscribe to and check. It's the RWA auditor's favorite bedtime reading.

The key difference in one line: an ordinary program runs on **some company's server**, and the company can stop it, change it, or doctor its database; a contract runs **inside the ledger itself** — no server, no operator, no closing time.

### ② Walking through an escrow contract: deposit, confirm, release, end to end

Let's write a minimal **escrow** contract. Three roles: **buyer**, **seller**, **arbiter** (the third party whose word settles disputes). Here's the logic in readable pseudo-Solidity — every line earns its keep:

- \`state: buyer address, seller address, arbiter address, amount, phase (EMPTY → DEPOSITED → RELEASED / REFUNDED)\`
- \`function deposit(): require caller == buyer and phase == EMPTY; otherwise revert. Take the money attached to the transaction and lock it at the contract's own address; phase = DEPOSITED; emit event("Deposited")\`
- \`function release(): require caller == arbiter and phase == DEPOSITED; otherwise revert. Send the money to the seller; phase = RELEASED; emit event("Released")\`
- \`function refund(): require caller == arbiter and phase == DEPOSITED; otherwise revert. Return the money to the buyer; phase = REFUNDED; emit event("Refunded")\`

<figure><svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="sc-arr-en" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="var(--orange-line)"/></marker></defs><rect x="16" y="55" width="120" height="50" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="76" y="84" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">EMPTY</text><rect x="220" y="55" width="150" height="50" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="295" y="78" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">DEPOSITED</text><text x="295" y="95" font-size="9" fill="var(--muted)" text-anchor="middle">money locked at the contract</text><rect x="470" y="16" width="150" height="46" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="545" y="44" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">RELEASED → seller</text><rect x="470" y="106" width="150" height="46" rx="10" fill="var(--red-soft)" stroke="var(--line)"/><text x="545" y="134" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">REFUNDED → buyer</text><path d="M136 80 L216 80" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#sc-arr-en)"/><text x="176" y="70" font-size="10" fill="var(--orange-ink)" text-anchor="middle">buyer·deposit()</text><path d="M370 70 L466 42" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#sc-arr-en)"/><text x="418" y="42" font-size="10" fill="var(--orange-ink)" text-anchor="middle">arbiter·release()</text><path d="M370 92 L466 126" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#sc-arr-en)"/><text x="418" y="128" font-size="10" fill="var(--orange-ink)" text-anchor="middle">arbiter·refund()</text></svg></figure>

Notice the recurring “**require… otherwise revert**”: if the condition fails, the entire transaction **dies on the spot** — not one character of state changes, and only a failure record remains. Seller tries to call \`release()\` before anything's deposited? Revert. Buyer tries to press \`refund()\` themselves? Revert — the buttons have door policies, and the doorman checks exactly the signatures from Stage 2.2: **who you are, your signature proves; whether you may press, the code decides.** No customer service to plead with, no manager to make an exception — **the rules are fixed in advance, and execution doesn't read faces.**

### ③ Why the outcome is “consensus-guaranteed” — and what gas is

A natural question: this program has no server, so **where** does it run? Answer: **on every node, once each.** When your \`release()\` transaction lands in a block (Stage 2.1), thousands of nodes around the world **independently** execute the function. The code is deterministic: same starting state, same input, and thousands of executions produce a **byte-for-byte identical** new state — which therefore becomes part of consensus itself, protected at the same grade as “nobody can unilaterally edit the ledger.” A node that lies about its result? Its block fails validation, and slashing (Stage 2.1) awaits.

“Thousands of computers redoing the same arithmetic” is extravagant, of course, so execution is **metered**: every operation burns **gas**, paid in ETH by whoever sent the transaction. A plain transfer costs about 21,000 gas; a complex contract call can cost ten or a hundred times that. Gas doubles as the **safety valve** — code stuck in an infinite loop burns through its prepaid gas and is forcibly halted, so it can't paralyze the network. How fees behave, why they spike at rush hour, and how L2s crush them — that's Stage 2.6.

### ④ “Code is law” is a slogan: upgradeability and the proxy pattern

Early crypto's creed was **“Code is law”**: the rules are the code, deployment is legislation, and nobody gets to change it. In 2016, The DAO was drained of tens of millions of dollars in ETH through a contract bug, and the Ethereum community ultimately chose a hard fork to roll it back — turning “code is law” from a creed into a scar still argued over today. In RWA-land, the slogan is overwritten by reality, for hard reasons:

- **Laws change**: securities rules, sanctions lists, and tax requirements update every year; hardcoded compliance logic (Stage 7) is a time bomb.
- **Bugs happen**: code custodying hundreds of millions in real assets must be fixable the day a flaw is found.
- **Courts issue orders**: a judgment demands an address be frozen or shares force-transferred (\`forcedTransfer\`, Stage 6.5) — the contract must have a door through which to comply.

So real RWA contracts are almost universally deployed behind the **proxy pattern**: the address users interact with belongs to a **proxy contract** that contains almost no business logic — just a pointer, “the real logic lives at \`0x9c41…\`” — and forwards every call there. To upgrade, the issuer (typically via a **multisig**, Stage 2.2) repoints it at a new logic contract: **same address, same balances, same history — different rulebook.**

<figure><svg viewBox="0 0 640 165" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="sc-arr2-en" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="var(--orange-line)"/></marker></defs><rect x="16" y="52" width="130" height="56" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="81" y="76" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">Users</text><text x="81" y="94" font-size="9" fill="var(--muted)" text-anchor="middle">only ever see one address</text><rect x="230" y="42" width="160" height="76" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="310" y="66" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">Proxy 0x7a25…</text><text x="310" y="84" font-size="9" fill="var(--muted)" text-anchor="middle">holds balances &amp; all state</text><text x="310" y="100" font-size="9" fill="var(--orange-ink)" text-anchor="middle">pointer: where's the logic →</text><rect x="474" y="16" width="150" height="46" rx="10" fill="var(--surface-2)" stroke="var(--line)" stroke-dasharray="4 3"/><text x="549" y="36" font-size="11" fill="var(--muted)" text-anchor="middle">Logic v1 (old)</text><text x="549" y="52" font-size="9" fill="var(--muted)" text-anchor="middle">retired</text><rect x="474" y="102" width="150" height="46" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="549" y="122" font-size="11" fill="var(--ink)" font-weight="bold" text-anchor="middle">Logic v2 (new)</text><text x="549" y="138" font-size="9" fill="var(--muted)" text-anchor="middle">issuer multisig flips the switch</text><path d="M146 80 L226 80" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#sc-arr2-en)"/><path d="M390 96 L470 122" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#sc-arr2-en)"/><path d="M390 66 L470 40" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 3"/></svg></figure>

Now put on your investor glasses and see both faces of this coin. **Heads**: upgradeability lets the contract track the law and fix bugs — an existential necessity for RWA. **Tails**: it overturns the promise that “deployment is final” — **whoever holds the upgrade key can, in theory, swap the rules for anything**, including things that hurt you. So the diligence question shifts from “what does the code say” to a triple: **who can upgrade (a single key or a 3-of-5 multisig)? Is there a timelock (a waiting period that gives you a window to exit)? Is the upgrade history clean?** “Anonymous single key + no timelock” sits high on the Stage 12.3 red-flag checklist. And notice: **trust hasn't vanished — it has moved from “trust the company” to “trust the few people holding the key.”** The course's throughline surfaces again: the structure decides the trust; the token is just the receipt.

### ⑤ Contracts can't reach off-chain — oracles, and a preview of “a token is just a contract”

Two final puzzle pieces. **First: a contract is a program that cannot open its eyes** — it can read everything on-chain, but is congenitally unable to reach the outside world: it doesn't know today's dollar interest rate, doesn't know whether the goods arrived, doesn't even know the time except via block timestamps. In our escrow, “did the goods arrive” had to be told to the contract by the arbiter's transaction — generalize that role of “feeding off-chain facts into the chain,” and you get the **oracle**. RWA's NAV feeds and proof-of-reserve all ride on it; it stars in Stage 8.1.

**Second — and this is the doorway to the next lesson**: you now hold every part needed to understand a “token.” A **token** is nothing but **a smart contract whose state holds an “address → balance” table**, plus a few standard functions (\`transfer\`, \`balanceOf\`…). A “transfer” is a function call that decrements your number in the table and increments the recipient's. ERC-20 (Stage 2.4) merely standardizes that table's interface; an NFT (Stage 2.5) makes each row a one-of-a-kind item. And an RWA token is that same table with an entire compliance check bolted in front of every change (Stage 6.2's \`canTransfer\`).

If you take away one sentence: **smart contracts make “rules fixed in advance, execution blind to faces” real — but RWA's subtlety is that the rules must also be able to follow the law (upgradeability), which makes “who holds the upgrade key” itself a mandatory item on your diligence checklist.**
`,

  demo: "escrow-contract",

  analogy: `
The classic analogy for a smart contract is the **vending machine** — set it against the corner-store counter and every detail lines up.

The corner store runs its rules on **people**: you pay, the clerk hands you a cola. The clerk might miscount your change, might let a familiar face buy on credit, might be in a foul mood and refuse you — the rules live in his head, and execution reads faces. That's traditional finance: rules held by institutions, execution resting on institutional good behavior, and when something breaks you argue with customer service.

The vending machine **welds the rules into the box**: insert ¥5 → cola drops; insert ¥3 → the button won't light (**revert** — the machine won't swallow your three yuan and play dumb). It doesn't know you, doesn't care about your face, and is open at 3 a.m. — **unstaffed, yet usable by anyone**. A contract is a vending machine deployed inside the ledger: money held in the machine (the contract address), goods dispensed automatically when conditions are met (release), everything returned untouched when they aren't (revert), and a printed receipt with every transaction (the event log).

But the RWA world's vending machine has one special feature: a **replaceable rules panel** on its chassis (the proxy pattern). The operator can swap the panel because it must — tomorrow the beverage tax changes, the machine turns out to be foolable by a certain coin trick, a court orders a product pulled. Before you buy, though, take one extra look: **whose pocket holds the panel key?** A regulated company that posts a seven-day notice before any swap (a timelock) — or some anonymous stranger's trousers? The former is BlackRock's machine; the latter — walk away, fast (Stage 12.3).
`,

  misconceptions: [
    "“A smart contract is a signed, digital legal contract.” —— No. It's a program deployed on-chain that executes itself as code, and it runs fine without any legal force at all. Conversely, making a token legally represent an asset share depends on off-chain contracts and structure (Stage 5) — on-chain code and off-chain law are two layers, and RWA's whole job is stitching them together.",
    "“The contract runs on some server, and the operator can shut it down anytime.” —— A contract lives in the ledger itself; thousands of nodes each execute it and cross-check. There's no server to unplug and no operator to take it offline — unless the code itself includes a pause switch (many RWA contracts do, which is precisely the “issuer switch” Stage 6.5 scrutinizes).",
    "“A deployed contract can never change, so it's absolutely trustworthy.” —— The first half holds for bare contracts, but real RWA contracts are almost all deployed behind proxies: same address, logic swappable by the issuer (multisig). Upgradeability is required for compliance and bug fixes — but it means “trusting the code” is really “trusting whoever holds the upgrade key.” Always diligence it (Stage 12.3).",
    "“Contracts can fetch real-world information themselves — delivery status, interest rates.” —— They can't. A contract reads only on-chain data; off-chain facts must be fed in by transactions from oracles or authorized accounts (Stage 8.1). The feeder is a fresh trust point — in our escrow, if the arbiter lies, the contract faithfully executes the wrong payout.",
    "“Calling a contract is free.” —— Every step of execution is metered in gas, paid by the caller. It's the bill for “thousands of nodes redoing the computation” and the safety valve against infinite loops. Fee structure and L2 cost-crushing are Stage 2.6's subject.",
    "“Code is law — if there's a bug, tough luck.” —— Reality slapped that slogan in 2016 when The DAO was drained and the community hard-forked the funds back. RWA-land runs explicitly the other way: contracts must be upgradeable, freezable, and force-transferable, because court orders and securities law do not yield to code fundamentalism.",
  ],

  quiz: [
    {
      q: "What most fundamentally separates a smart contract from an ordinary program on a company server?",
      options: [
        "Smart contracts use a fancier programming language",
        "The contract is deployed inside the ledger; thousands of nodes each execute the same code and must reach the same result — no operator can stop it or tamper with its execution",
        "Smart contracts run faster",
        "Smart contracts require no code",
      ],
      answer: 1,
      explain: "A contract's promises are backed by consensus: deterministic code + network-wide re-execution + results entering consensus — not a company's server and good behavior.",
    },
    {
      q: "In the escrow contract, the seller calls release() before the buyer has deposited. What happens?",
      options: [
        "The contract sends whatever money it has to the seller",
        "The transaction reverts: the condition “phase == DEPOSITED” fails, state changes by nothing, and only a failure record remains",
        "The contract summons the arbiter to vote",
        "The transaction queues up and auto-executes after the deposit",
      ],
      answer: 1,
      explain: "“Require… otherwise revert” is the contract's door policy: unmet conditions kill the whole transaction. Rules fixed in advance; execution blind to faces.",
    },
    {
      q: "Why is a contract's execution result “consensus-guaranteed”?",
      options: [
        "Because a regulator reviews every execution",
        "Because the code is deterministic: thousands of nodes independently compute byte-identical state, which enters consensus with the block and enjoys the ledger's own level of protection",
        "Because all token holders vote before execution",
        "Because the contract code passed a security audit",
      ],
      answer: 1,
      explain: "Same code + same input = same output; a node reporting a false result produces an invalid block and gets slashed.",
    },
    {
      q: "Why do real RWA contracts almost universally use the upgradeable proxy pattern?",
      options: [
        "Because upgradeable contracts cost less gas",
        "Because laws change, bugs happen, and courts issue orders — compliance logic custodying real assets must be modifiable, and proxies let the logic change while the address and state stay put",
        "Because Ethereum mandates that all contracts be upgradeable",
        "Because the proxy pattern prevents hacks",
      ],
      answer: 1,
      explain: "Upgradeability is existential for RWA — but it converts “trust the code” into “trust the keyholders,” making it a mandatory diligence item (Stage 12.3).",
    },
    {
      q: "When assessing an RWA project's contract upgradeability, the most important diligence question is?",
      options: [
        "Which Solidity version the contract uses",
        "Who holds the upgrade power (single key or multisig), whether upgrades have a timelock, and whether the upgrade history is clean",
        "What year the contract was deployed",
        "How many lines of code the contract has",
      ],
      answer: 1,
      explain: "“Anonymous single key + no timelock” means the rules can be swapped for anything in an instant — high on the Stage 12.3 red-flag checklist.",
    },
    {
      q: "Which of the following can a smart contract NOT do by itself?",
      options: [
        "Send money locked at its own address to the seller",
        "Reject a call that fails its conditions",
        "Learn off-chain facts on its own (whether goods arrived, today's interest rate) — these must be fed in by an oracle or authorized account",
        "Record an event in its log",
      ],
      answer: 2,
      explain: "A contract cannot open its eyes: it reads only on-chain data. Feeding off-chain facts in credibly is the entirety of the Stage 8.1 oracle problem.",
    },
  ],

  further: [
    { label: "ethereum.org: official smart contracts intro", url: "https://ethereum.org/en/developers/docs/smart-contracts/" },
    { label: "Solidity official documentation (the contract language)", url: "https://docs.soliditylang.org/" },
    { label: "OpenZeppelin: The State of Smart Contract Upgrades (the proxy pattern)", url: "https://blog.openzeppelin.com/the-state-of-smart-contract-upgrades" },
    { label: "ethereum.org: Oracles (how contracts learn about the outside world, a Stage 8 preview)", url: "https://ethereum.org/en/developers/docs/oracles/" },
  ],
};
