export default {
  id: "erc20-tokens",
  stage: 2,
  order: 4,
  title: "ERC-20: Fungible Tokens — an Address→Balance Table",
  difficulty: "core",
  prereqs: ["smart-contracts"],

  oneLiner:
    "An ERC-20 token is not some mysterious “digital coin” — it's one smart contract holding an address→balance table plus six standard functions. A “transfer” is just the contract decrementing one row and incrementing another; nothing moves anywhere. And because every token obeys the same interface standard, any wallet, exchange, or protocol can plug into a brand-new token sight unseen — the interoperability superpower RWA is desperate to inherit.",

  intuition: `
Open your wallet app. There sit 100 USDC. Now pause and ask one question: **where exactly do those 100 USDC live?**

Not on your phone — smash the phone and the coins survive. Not “inside your address” either — an address is a number, not a vault. The answer is counterintuitive: **your 100 USDC are one row in a giant table inside a single smart contract** — “your address → 100.” Every USDC holder on Earth, millions of them, crowds into **the same contract's** same table, one row each. “Holding” a token means exactly this: that table has a row for you, and only your private key can make the contract change it (Stage 2.2 explained why).

That table plus the six standard functions around it is **ERC-20** — the most successful standard on Ethereum. Stablecoins (Stage 4), tokenized treasury funds (Stage 10.1), and virtually every RWA share token run on it underneath. Take it fully apart once, and the word “token” will never intimidate you again for the next ten stages.

**Here's the map — five parts:**

- **① One contract, one table, six functions — all of ERC-20**
- **② The truth about “transfers”: nothing moves**
- **③ The standard's superpower: why six functions are worth a trillion-dollar market**
- **④ approve / transferFrom: delegating the right to pull your money**
- **⑤ mint & burn: not in the standard, yet they ARE the RWA business**
`,

  mechanics: `
### ① One contract, one table, six functions: all of ERC-20

The last lesson (Stage 2.3) established that a smart contract = code + state. An ERC-20 token contract's **state** boils down to two things:

- A mapping table: \`mapping(address => uint256) balances\` — “which address holds how many”;
- One total: \`totalSupply\` — all rows sum to it, not one unit more or less.

For the **code**, the standard requires only six functions and two events:

- \`totalSupply()\` — read the total issued amount;
- \`balanceOf(address)\` — read one address's row;
- \`transfer(to, amount)\` — move part of your own balance to someone else;
- \`approve(spender, amount)\` — authorize an address to later pull up to amount from you (see ④);
- \`allowance(owner, spender)\` — check how much of that authorization remains;
- \`transferFrom(from, to, amount)\` — the authorized party spends the allowance to move funds on from's behalf (see ④);
- Events \`Transfer(from, to, amount)\` and \`Approval(owner, spender, amount)\` — every transfer/approval broadcasts a log entry; wallets and block explorers read these to draw the “transaction history” you see.

That's it. **There is no seventh mandatory function.** One small detail worth memorizing: \`decimals\`. On-chain balances are integers; decimals says where to put the decimal point — most tokens use 18, but **USDC uses 6**, so a stored “100000000” is really 100 USDC. Getting decimals wrong during an integration is a real, documented source of RWA incidents.

<figure>
<svg viewBox="0 0 640 290" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="erc20-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="16" y="70" width="150" height="90" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="91" y="96" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">Alice's wallet</text>
  <text x="91" y="116" text-anchor="middle" font-size="10" fill="var(--muted)">holds only a key —</text>
  <text x="91" y="131" text-anchor="middle" font-size="10" fill="var(--muted)">no tokens stored here</text>
  <line x1="166" y1="112" x2="248" y2="112" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#erc20-arr-en)"/>
  <text x="207" y="98" text-anchor="middle" font-size="10" fill="var(--orange-ink)">transfer(Bob, 100)</text>
  <text x="207" y="128" text-anchor="middle" font-size="9" fill="var(--muted)">(signed with her key)</text>
  <rect x="252" y="20" width="372" height="240" rx="12" fill="var(--orange-soft)" stroke="var(--orange-line)" stroke-width="1.5"/>
  <text x="438" y="44" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">USDC contract (one address, one program, one table)</text>
  <rect x="276" y="58" width="200" height="128" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="376" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">balances table (address → balance)</text>
  <text x="292" y="100" font-size="11" fill="var(--ink)">0xAlice…</text>
  <text x="460" y="100" text-anchor="end" font-size="11" fill="var(--red)">300 → 200</text>
  <text x="292" y="122" font-size="11" fill="var(--ink)">0xBob…</text>
  <text x="460" y="122" text-anchor="end" font-size="11" fill="var(--green)">200 → 300</text>
  <text x="292" y="144" font-size="11" fill="var(--ink)">0xCarol…</text>
  <text x="460" y="144" text-anchor="end" font-size="11" fill="var(--ink)">500</text>
  <text x="292" y="172" font-size="10" fill="var(--muted)">totalSupply = 1000 (unchanged)</text>
  <rect x="492" y="58" width="116" height="128" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="550" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">six functions</text>
  <text x="502" y="98" font-size="9" fill="var(--ink)">balanceOf</text>
  <text x="502" y="113" font-size="9" fill="var(--orange-ink)" font-weight="600">transfer</text>
  <text x="502" y="128" font-size="9" fill="var(--ink)">approve</text>
  <text x="502" y="143" font-size="9" fill="var(--ink)">allowance</text>
  <text x="502" y="158" font-size="9" fill="var(--ink)">transferFrom</text>
  <text x="502" y="173" font-size="9" fill="var(--ink)">totalSupply</text>
  <rect x="276" y="200" width="332" height="42" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="442" y="218" text-anchor="middle" font-size="10" fill="var(--ink)">📢 Event log: Transfer(Alice, Bob, 100)</text>
  <text x="442" y="233" text-anchor="middle" font-size="9" fill="var(--muted)">wallets & explorers read this to draw your “transaction history”</text>
</svg>
<figcaption>A “transfer” happens entirely inside the contract: one row down, one row up, one event broadcast. Alice's wallet never held anything but a key.</figcaption>
</figure>

### ② The truth about “transfers”: nothing moves

The internal logic of \`transfer(to, amount)\`, translated into plain speech, is four lines:

- Check: the caller's row ≥ amount, otherwise the whole transaction **reverts** — as if it never happened;
- The caller's row: minus amount;
- The recipient's row: plus amount;
- Broadcast the event \`Transfer(caller, to, amount)\`.

Note what did **not** happen: no file was sent, no “digital coin” flew from A to B, your wallet and the recipient's wallet never communicated. Only two numbers in that table changed. That's why sending tokens to a mistyped address is irreversible — it isn't “a lost parcel”; **the ledger has already recorded that row to someone else**, and nobody holds that address's private key (Stage 2.1 covered why the ledger can't be rolled back).

This also explains the word “**fungible**”: the table records only *how many*, never *which ones*. Your 100 USDC and my 100 USDC are indistinguishable, just like ¥100 in your bank account and ¥100 in mine — **every unit is perfectly interchangeable**. Dollars are fungible; property deeds are not: each deed names one specific house, and swapping deeds means swapping houses. Assets where “every piece is unique” need a different standard (ERC-721, next lesson, Stage 2.5).

### ③ The standard's superpower: why six functions are worth a trillion-dollar market

ERC-20 was proposed in 2015 by Fabian Vogelsteller and Vitalik Buterin (EIP-20). It specifies only the **interface** — function names, arguments, events — never the implementation. And this one thin agreement triggered a chemical-reaction-scale consequence:

- **Wallets** (MetaMask and friends) don't need to know your token exists: if it's ERC-20, calling \`balanceOf\` displays the balance and calling \`transfer\` sends it;
- **Exchanges and DeFi protocols** likewise: Uniswap can open a trading pool for any two ERC-20s, lending protocols can accept any ERC-20 as collateral — **with zero prior business integration**;
- Deploy a new token today, and **the entire world's infrastructure is compatible with it on the spot**.

Compare traditional finance: getting a new fund listed inside one broker's app means negotiating access, signing agreements, wiring up APIs — measured in months. BlackRock's BUIDL and Circle's USDC are, at bottom, ERC-20s — supported by every on-chain tool from day one. **This is the “interoperability / composability” the RWA world keeps chanting about. It isn't mystical; it's just “everyone uses the same interface.”** As of 2025, ERC-20 contracts on Ethereum number in the millions, and stablecoins alone are a ~$250B+ market — all of it standing on those six functions.

### ④ approve / transferFrom: delegating the right to pull your money

The most confusing — and most important — pair among the six. Scenario: you want to swap 100 USDC for ETH on a decentralized exchange. The exchange is a **contract**, and it needs to “collect” your USDC at the instant of the trade — but \`transfer\` can only be called by you, and no contract can call it on your behalf. The solution takes two steps:

- **Step one, \`approve(exchangeContract, 100)\`**: you register an authorization inside the USDC contract — “allow this address to pull up to 100 from me later.” The record lives in the \`allowance\` table (so an ERC-20 really keeps **two tables**: balances + allowances);
- **Step two**: when the trade executes, the exchange contract calls \`transferFrom(you, itself, 100)\`. The USDC contract checks two things — is your balance sufficient, and is the allowance you granted sufficient — and if both pass, it moves the funds and knocks 100 off the allowance.

This “**authorize first, pull later**” pattern is the wiring diagram of DeFi composability: lending, market-making, subscription and redemption — every machine-to-machine “payment collection” runs through it. RWA is no exception — when you subscribe to an on-chain fund, your first transaction is almost always an approve.

⚠ One sentence of security hygiene: **approval phishing** is among the most common theft techniques in crypto — a scammer lures you into signing an unlimited approve to a malicious contract, then drains you at leisure. Treat “approve unlimited” with suspicion, and periodically clean up idle approvals with a tool like revoke.cash.

### ⑤ mint & burn: not in the standard, yet they ARE the RWA business

The standard's six functions include no “issue” and no “destroy” — yet in practice nearly every token has both, usually written as \`mint(to, amount)\` (totalSupply and to's balance both increase; the event logs a transfer from the zero address) and \`burn(from, amount)\` (the reverse). Naturally both must be permission-gated (Stage 2.3 covered \`onlyOwner\`) — a token anyone can mint is worth nothing.

In the world of speculative coins, mint/burn are back-office operations. **In RWA, they are the business process itself** (recall the token's life story in Stage 1.1):

- **mint = subscription**: you wire Circle $1M, Circle mints 1M USDC to you on-chain — one dollar enters off-chain, one token appears on-chain. That is how the peg is maintained;
- **burn = redemption**: you return 1M USDC to Circle, it burns the tokens and wires your dollars back. Tokenized treasury funds work identically: subscribe → mint shares, redeem → burn shares, and \`totalSupply\` mirrors the off-chain asset base at all times (Stage 1.2's “mirror principle” — and who verifies the mirror is Stage 8.3, proof of reserve).

Finally, pull the camera back and register the fact an entire later stage is devoted to: **the base \`transfer\` checks exactly one thing — whether the balance suffices**. It never asks who you are, what country you're in, whether you're eligible, or whether the shares are locked up. For a game token that's a feature; for a fund share governed by securities law it's a **fatal flaw**. Park that thought — Stage 6.1 confronts it head-on.

If you take away one sentence: **ERC-20 = one contract holding an address→balance table + six standard functions; a “transfer” just edits the table, and the “standard” makes every wallet and protocol on Earth plug-and-play — RWA wants that superpower, but it still has to bolt a “who is eligible” check onto transfer.**
`,

  demo: "erc20-table",

  analogy: `
Think of ERC-20 as a university's **meal-card system**. Tens of thousands of cards on campus, and the cards themselves store **nothing** — every balance lives in one table on the facilities office's server: “student ID → balance.” When you tap your card at the cafeteria, it's not the card that changes, it's the table: your row minus 15, the cafeteria's row plus 15. That is \`transfer\` — the card (the private key) merely proves to the server that “it's really you.”

“Fungible” becomes obvious too: the table records how much money you have, never “which banknotes.” The ¥100 on your card and the ¥100 on your classmate's are perfectly equivalent and freely interchangeable — unlike dorm keys, where each one opens exactly one door (that's next lesson's NFT world).

And \`approve\`? That's a **direct-debit authorization**. You sign a slip: “the library may deduct up to ¥200 a year in late fees from my meal card.” Later the library pulls the money itself (\`transferFrom\`), and the server checks two things: does your balance cover it, and how much authorization remains. You never handed your card to the library — you just registered a record saying “it may come and deduct.”

The power of the “standard” is this: **every university in the country agrees on the same card interface.** Any new cafeteria, bookstore, or vending machine can accept every card on campus the day its reader is installed — no one-by-one negotiations. Mint and burn are the top-up counter: hand over ¥100 in cash and the table credits you 100 (mint); cancel the card and the table zeroes out while you get your cash back (burn). Whether the cash taken in truly matches the numbers credited — whether that mirror is honest — is the whole of RWA's trust problem in miniature.
`,

  misconceptions: [
    "“Tokens are stored in my wallet app, like photos on my phone.” —— No. The wallet holds only your private key. Every balance lives in the table inside the token contract; the wallet merely queries the table for you (balanceOf) and signs edits to it (transfer). Lose the phone and the table is still on-chain.",
    "“A transfer ‘sends’ tokens to the other address.” —— Nothing is sent. The contract decrements your row, increments theirs, and broadcasts a Transfer event — that's all. Which is also why a transfer to the wrong address can't be recovered: it isn't a lost parcel, the ledger has simply been rewritten.",
    "“ERC-20 is some official token issued by Ethereum.” —— ERC-20 is an interface standard (EIP-20), not a token. Anyone can deploy one — it takes minutes — so “it's an ERC-20” says nothing about value or legality.",
    "“approve just lets someone ‘see’ my balance; there's no risk.” —— approve grants the power to pull your tokens (via transferFrom). Signing an unlimited approval to a malicious contract is handing your card to a scammer. Approval phishing is one of the most common theft techniques; revoke idle approvals regularly.",
    "“mint/burn are part of the ERC-20 standard, and all tokens have a fixed supply.” —— Both wrong. The standard defines only six functions; mint/burn are added by each project — and nearly all add them. In RWA they ARE subscription and redemption; the real question is who holds the mint permission and what checks it.",
    "“A plain ERC-20 is good enough to carry a security like a stock or fund share.” —— It isn't. Bare transfer checks only the balance — never identity, eligibility, jurisdiction, or lockups, all of which securities law demands. That's exactly why permissioned standards (ERC-3643 and friends, Stage 6) exist.",
  ],

  quiz: [
    {
      q: "Where do the 100 USDC in your wallet fundamentally live?",
      options: ["Encrypted on your phone", "Scattered in an on-chain “vault” tied to your address", "As one row in the address→balance table inside the USDC smart contract", "In Circle's bank account"],
      answer: 2,
      explain: "All holders share one table in one contract, one row each. The wallet stores only keys; the bank account holds reserves, not the tokens themselves.",
    },
    {
      q: "When you call transfer(Bob, 100), what actually happens on-chain?",
      options: ["100 tokens are packaged and delivered to Bob's wallet", "The contract decrements your row by 100, increments Bob's by 100, and broadcasts a Transfer event", "Your wallet opens an encrypted channel to Bob's wallet", "Miners physically move 100 tokens from your address to Bob's"],
      answer: 1,
      explain: "A transfer = edit the table + emit an event. Nothing “moves,” and the two wallets never communicate.",
    },
    {
      q: "Why is the ERC-20 “standard” itself a superpower?",
      options: ["It makes token prices more stable", "A uniform interface lets any wallet, exchange, or protocol support any new token with zero prior integration — plug-and-play interoperability", "The Ethereum Foundation reviews each token, guaranteeing quality", "It fixes a maximum supply for every token"],
      answer: 1,
      explain: "The standard specifies an interface, not quality. Its value: the day a token deploys, the world's infrastructure is already compatible — the distribution power RWA wants to inherit.",
    },
    {
      q: "What does the approve + transferFrom pair do?",
      options: ["Freezes tokens against theft", "Lets you authorize an address (usually a contract) to pull your tokens later within a limit — the standard collection mechanism for DeFi and RWA subscriptions", "Converts tokens into ETH", "Requests the issuer to mint more"],
      answer: 1,
      explain: "First approve registers an allowance; then the counterparty calls transferFrom, and the contract checks both balance and allowance. It's also the mechanism approval phishing targets.",
    },
    {
      q: "In an RWA context, what business actions do mint and burn correspond to?",
      options: ["Mining and fee burning", "mint = subscription (off-chain money in, on-chain shares created); burn = redemption (shares destroyed, off-chain money out)", "Airdrops and buybacks", "Collateralization and liquidation"],
      answer: 1,
      explain: "mint/burn aren't in the standard, but they are RWA's core business: totalSupply should mirror the off-chain asset base — and Stage 8's proof of reserve is how the mirror gets verified.",
    },
    {
      q: "What does the base ERC-20 transfer check before letting a transfer through?",
      options: ["Balance sufficiency, KYC status, and lockup periods", "Exactly one thing: the caller's balance ≥ the transfer amount", "Whether the recipient is an accredited investor", "Whether the issuer approved this transfer"],
      answer: 1,
      explain: "Balance only — never identity, eligibility, jurisdiction, or lockups. Fatal for a security, and the starting point of everything Stage 6 builds.",
    },
  ],

  further: [
    { label: "EIP-20: the ERC-20 standard (official definition of the six functions and two events)", url: "https://eips.ethereum.org/EIPS/eip-20" },
    { label: "ethereum.org: ERC-20 token standard primer", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-20/" },
    { label: "OpenZeppelin ERC20 docs (the industry's most-used implementation)", url: "https://docs.openzeppelin.com/contracts/5.x/erc20" },
    { label: "Revoke.cash: inspect and revoke the token approvals you've signed", url: "https://revoke.cash" },
  ],
};
