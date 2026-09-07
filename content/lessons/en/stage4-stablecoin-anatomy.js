export default {
  id: "stablecoin-anatomy",
  stage: 4,
  order: 1,
  title: "Anatomy of a Fiat Stablecoin: Mint, Reserves, Redeem",
  difficulty: "core",
  prereqs: ["erc20-tokens", "treasuries-yield"],

  oneLiner:
    "A fiat stablecoin is a “tokenized dollar receipt” — it fits the RWA definition from Stage 0 to the letter. The issuer takes your $1, mints one token, and parks the cash in T-bills; hand the token back and it burns the token and wires the money out. The $1 peg is held not by a promise but by arbitrageurs endlessly flattening the spread through the mint/redeem channel. It is the first RWA ever to reach hundreds of billions in scale, and everything later in this course — legal wrappers, proof of reserve, regulation — is a generalization of this one machine.",

  intuition: `
As of 2025, stablecoins total roughly **$250–300 billion**, moving **trillions of dollars** a year on-chain. For most people, their first time “holding an RWA” isn't buying tokenized Treasuries or on-chain gold — it's the moment a few **USDT** or **USDC** land in their wallet.

Yet almost nobody stops to ask: what **is** this one “digital dollar,” exactly? Why is it worth a dollar? When you send it to a friend, does a real dollar bill move anywhere?

The answer reframes the whole course: a fiat stablecoin is a **claim on off-chain dollar assets**. The issuer receives your dollars, mints an ERC-20 token on-chain as a receipt, invests the dollars in **short-term US Treasuries** (the star of Stage 3.2), and promises to swap back 1:1 at any time. Originate → issue → trade → redeem — exactly the token lifecycle from Stage 1.1. **A stablecoin isn't a “relative” of RWA — it IS the first RWA that worked**, and the biggest and most stress-tested one at that.

So in this stage we introduce no new concepts. Instead, we assemble everything you already know — Treasuries, NAV, custody, ERC-20 — into one machine that actually runs at scale. Once you understand stablecoins, every later RWA reduces to the same set of questions: **who issued it? where's the money? who checked? can you get out?**

**Here's the map — five parts:**

- **① Mint — reserve — redeem: the machine's three strokes**
- **② The peg is arbitrage, not a promise: why price hugs $1**
- **③ Who may mint and redeem directly: the gate that decides everything**
- **④ The issuer's business: the most profitable firm per head in history**
- **⑤ Three species of stablecoin: fiat-backed, crypto-collateralized, algorithmic**
`,

  mechanics: `
### ① Mint — reserve — redeem: the machine's three strokes

Take a regulated fiat-stablecoin issuer (think Circle and USDC) and walk the full cycle:

- **Deposit & mint**: a KYC-verified institutional customer wires **$1,000,000** to the issuer's bank account. Once the funds clear, the issuer calls \`mint(customer, 1_000_000e6)\` on the token contract — adding 1,000,000 tokens to the customer's row in the address→balance table from Stage 2.4. On-chain supply +1M; issuer's cash +$1M. The two sides match exactly.
- **Reserve management**: the issuer doesn't leave that $1M in a checking account. The bulk goes into **short-term T-bills and overnight repo**, with a slice kept as bank deposits for day-to-day redemptions. For USDC: roughly 80% sits in a government money-market fund managed by BlackRock (details in Stage 4.2), roughly 20% is cash at banks.
- **Redeem & burn**: when the customer wants dollars back, they return the tokens; the issuer calls \`burn(1_000_000e6)\` to destroy them and wires $1,000,000 to the customer's bank account. Supply −1M, reserves −$1M — the books balance again.

<figure>
<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
<defs><marker id="sa-ah-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--orange-line)"/></marker></defs>
<rect x="16" y="70" width="140" height="70" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
<text x="86" y="98" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">Institutional client</text>
<text x="86" y="118" text-anchor="middle" font-size="10" fill="var(--muted)">wires $1M ⇄ gets 1M tokens</text>
<rect x="250" y="60" width="150" height="90" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="325" y="88" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="600">Issuer</text>
<text x="325" y="108" text-anchor="middle" font-size="10" fill="var(--ink)">mint() / burn()</text>
<text x="325" y="126" text-anchor="middle" font-size="10" fill="var(--muted)">supply = reserves</text>
<rect x="480" y="60" width="144" height="90" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
<text x="552" y="88" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">Reserve assets</text>
<text x="552" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">~80% T-bills/repo</text>
<text x="552" y="126" text-anchor="middle" font-size="10" fill="var(--muted)">~20% bank cash</text>
<line x1="156" y1="90" x2="250" y2="90" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#sa-ah-en)"/>
<text x="203" y="82" text-anchor="middle" font-size="9" fill="var(--muted)">$1M wire</text>
<line x1="250" y1="122" x2="156" y2="122" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#sa-ah-en)"/>
<text x="203" y="140" text-anchor="middle" font-size="9" fill="var(--muted)">mint 1M tokens</text>
<line x1="400" y1="90" x2="480" y2="90" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#sa-ah-en)"/>
<text x="440" y="82" text-anchor="middle" font-size="9" fill="var(--muted)">invest</text>
<line x1="480" y1="122" x2="400" y2="122" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#sa-ah-en)"/>
<text x="440" y="140" text-anchor="middle" font-size="9" fill="var(--muted)">sell to redeem</text>
<text x="320" y="190" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="600">Iron rule: every token on-chain ↔ one dollar of assets off-chain</text>
<text x="320" y="212" text-anchor="middle" font-size="10" fill="var(--muted)">minting adds to both sides, burning subtracts from both — the books always balance</text>
</svg>
</figure>

Note what kind of institution this is: a **fully-reserved “narrow bank”** — no lending, no leverage (for compliant issuers), with every circulating token backed by an equal dollar of assets. That's the opposite of a fractional-reserve bank, and it's what makes a 1:1 anytime-redemption promise even possible. **Whether the promise is true, and how good the assets are — that's the attestation question, and it's all of Stage 4.2.**

### ② The peg is arbitrage, not a promise: why price hugs $1

On secondary markets (exchanges, DEXes), a stablecoin's price is set by supply and demand — **no code anywhere forces it to equal $1**. What actually nails the price down is the **arbitrage** enabled by the mint/redeem channel from ①:

- **Dips to $0.99**: an arbitrageur spends $990,000 buying 1,000,000 tokens on the market, redeems them with the issuer at face value, and receives $1,000,000 — **a risk-free $10,000**. The buying absorbs sell pressure and the redemption shrinks supply, pushing the price back to $1.
- **Rises to $1.01**: run it in reverse — wire $1M to mint 1M tokens, sell them for $1.01M, pocket $10,000. Fresh supply pushes the price down.

As long as the channel is open, any deviation is a free lunch that gets eaten instantly. So experts never ask “what does the issuer promise?” They ask: **can every step of the arbitrage loop be completed right now?** Redemption goes through the issuer (business hours? minimums?), the payout rides bank wires (closed on weekends!), the purchase needs market depth. Block any link and the peg starts to drift — in Stage 4.3 you'll watch the weekend of March 2023 when bank closures jammed the channel for two full days and USDC traded at $0.87. And this redemption-arbitrage mechanism isn't stablecoin-specific: tokenized funds hug their NAV by exactly the same force (Stage 9.4).

### ③ Who may mint and redeem directly: the gate that decides everything

We kept saying “customer” above — but **not everyone is a customer**. Direct mint and redeem access at Circle or Tether is reserved for KYC/AML-verified **institutional clients**: exchanges, market makers, payment firms. Tether adds a redemption minimum (from $100,000) and fees. Retail holders like you and me only ever touch the **secondary market**, effectively outsourcing “redeemable at par” to arbitrage desks.

In calm times this doesn't matter — arbitrageurs compress the spread to a few basis points and you never notice. Under stress, the gate becomes the line between outcomes: in a panic, retail can **only sell into the market**, not present tokens to the issuer; whether the price holds depends entirely on whether the small club with direct access can and will complete the loop. On the USDC depeg weekend of March 2023, plenty of retail holders capitulated at $0.90, while institutions inside the gate waited for Monday's wires and redeemed in full at $1. **Same token, two fates — the only difference was who could reach the redemption window.** This question returns in Stage 5.4 (investor rights) and Stage 9.1 (primary vs secondary markets).

### ④ The issuer's business: the most profitable firm per head in history

How does this machine make money? The answer is almost offensively simple: **the issuer keeps all the interest on the reserves; holders get none.**

- Hold 1,000 USDT for a year and your yield is **zero**.
- Tether takes your money (and everyone else's) and buys Treasuries. As of 2025, USDT exceeds **$170 billion** and T-bill yields run about 4–5% — that's roughly **$7–8 billion a year in interest alone**, and Tether now ranks among the top-twenty holders of US government debt.
- Add gains on its gold and bitcoin holdings, and Tether reported profits of about **$13 billion for 2024** — with a headcount around one hundred. **Per employee, it is plausibly the most profitable company in business history.**

This isn't a loophole; it's the business model. A stablecoin issuer is essentially a **money-market fund that pays its shareholders nothing**. And the “nothing” is about to be law, not custom: the US GENIUS Act of 2025 **explicitly prohibits** payment stablecoins from paying holders yield (Stage 4.4 explains why). Want that 4–5%? Then what you want isn't a stablecoin but a **tokenized Treasury product wrapped in securities law** — BUIDL, USDY (Stages 10.1, 10.2). The market splits into two species: non-yielding payment dollars, and yield-bearing security dollars.

### ⑤ Three species of stablecoin: fiat-backed, crypto-collateralized, algorithmic

“Stablecoin” is a family, and the pegging mechanism determines the risk profile:

- **Fiat-backed** (USDT, USDC — over 90% of the market): the machine from ①. The risks live **off-chain**: reserve quality, banks, custody, issuer honesty.
- **Crypto-collateralized** (DAI/USDS): trust no banks — **overcollateralize** with on-chain assets instead. Deposit $150 of ETH to borrow $100 of DAI; falling prices trigger automatic liquidation. The cost is capital inefficiency. The twist: MakerDAO (rebranded Sky in 2024) later moved a large share of its backing into **real-world Treasuries** — the on-chain purists came full circle and bought T-bills too (Stage 9.3 tells that story).
- **Algorithmic** (Terra's UST, May 2022: **~$40 billion to zero within a week**): no reserves at all. The peg rested on “UST can always be swapped for $1 of freshly minted LUNA.” Mathematically, the design is **reflexive**: the peg's credibility depends on LUNA's market value, and LUNA's market value depends on people believing in the peg — confidence itself is the only collateral. Once heavy selling pushed UST below $1, arbitrageurs redeemed into LUNA and dumped it; the lower LUNA fell, the more LUNA each redeemed UST minted, and the heavier the dumping — a **death spiral** that turned both to paper in days. The lesson is surgical: **an arbitrage channel can transport value, but it cannot create it. There must be real assets standing at the other end.**

If you take away one sentence: **a stablecoin is a tokenized claim on dollars; the peg lives on an open arbitrage channel; and the far end of that channel must hold real assets — “which assets, and who's watching them” is the entire subject of the next lesson.**
`,

  demo: "mint-redeem",

  analogy: `
Picture the stablecoin issuer as the **chip booth** at a huge amusement park. Visitors swap cash for chips 1:1 at the booth; everything inside the park is priced in chips; on the way out, the booth swaps chips back to cash. The chips themselves are plastic — they're worth something because **the booth really holds the matching cash**, and pays out on demand.

The booth owner soon spots something wonderful: visitors keep about 100 million yuan of chips in circulation at all times, which means 100 million yuan of cash sits idle in the booth at all times. He puts it in Treasury bills and keeps the interest — and the visitors don't mind, because all they ever wanted was chips that spend and redeem, not interest. That is Tether's business.

By the park gate stand the scalpers. Someone in a hurry to leave sells chips at 0.98; a scalper snaps them up, walks to the booth, redeems at 1.00, and pockets the 2%. The busier the scalpers, the tighter the chips' street price hugs face value. **The chips' value never rested on the owner's character — it rests on scalpers being able to complete the “buy low, redeem at par” loop at any moment.**

The day the booth posts “cash in transit, redemptions suspended,” the scalpers stop working and the street price craters on the spot — whether or not the cash is actually still there. That's a depeg (Stage 4.3). And a park with no booth at all — chips only convertible into shares of the park itself, shares whose value rests on faith in the park — that's UST. The ending is only a matter of time.
`,

  misconceptions: [
    "“The price is fixed at $1 by code.” —— No such code exists. Secondary-market price floats freely; it hugs $1 because arbitrageurs flatten every deviation through the mint/redeem channel. Jam the channel (weekend bank closures, suspended redemptions) and the peg drifts immediately.",
    "“I can redeem my USDC/USDT for $1 whenever I want.” —— You almost certainly can't. Direct mint/redeem is for KYC'd institutional clients only (Tether adds a $100k minimum and fees). Retail can only sell at the market price — which is ≈$1 in calm times and can be $0.90 in a panic.",
    "“Stablecoins aren't RWA — RWA means Treasuries and real estate.” —— The opposite: stablecoins are the first and largest RWA. A stablecoin is a tokenized claim on off-chain dollars/T-bills, structurally identical to every other RWA — it just pins the share value at $1.",
    "“Holding a stablecoin earns me the T-bill interest on the reserves.” —— Not a cent. Reserve yield goes 100% to the issuer — that IS the business model (Tether: ~$13B profit in 2024). The GENIUS Act outright bans paying holders interest. For yield you need securities-wrapped tokenized Treasuries (Stage 10).",
    "“Algorithmic stablecoins are just an immature technology that will eventually work.” —— UST's failure wasn't an engineering bug; it was structural. Backing your stablecoin with your own token's market value makes the collateral's worth depend on confidence in the system itself — reflexivity guarantees the death spiral. With no external real assets, the arbitrage channel transports air.",
    "“USDT and USDC both peg to $1, so they're interchangeable.” —— Same target, different risk structure: reserve composition, attestation/audit depth, jurisdiction, and redemption terms all differ. Next lesson you'll read both firms' reserve reports under a magnifying glass — the differences are large enough to change your choices.",
  ],

  quiz: [
    {
      q: "When USDC trades at $0.99, what force pulls it back to $1?",
      options: [
        "A smart contract resets the price to one dollar",
        "Arbitrageurs buy cheap tokens and redeem them at $1 with the issuer, absorbing sell pressure and shrinking supply until the gap closes",
        "Circle buys tokens on the market to defend the price",
        "The Federal Reserve guarantees it",
      ],
      answer: 1,
      explain: "The peg's engine is arbitrage, not code or promises. Corollary: when the redemption channel jams (banks closed on a weekend), the peg loses its engine.",
    },
    {
      q: "A retail holder and an institutional client hold the same stablecoin. The key difference is?",
      options: [
        "Institutions earn higher interest on the token",
        "Institutions use a different contract",
        "Institutions can mint/redeem at face value directly with the issuer; retail can only trade at market price on secondary markets",
        "There is no difference",
      ],
      answer: 2,
      explain: "Direct mint/redeem sits behind a KYC gate. In calm times arbitrage hides the difference; in a panic, those who can reach the window redeem at $1 while those who can't sell at whatever the market offers.",
    },
    {
      q: "What is the core business model of a stablecoin issuer?",
      options: [
        "Charging holders an annual fee",
        "Taking a cut of every transfer",
        "Investing the reserves in T-bills and similar assets and keeping all the interest, paying holders nothing",
        "Token price appreciation",
      ],
      answer: 2,
      explain: "An issuer is a money-market fund that doesn't pay dividends. $170B of reserves × 4–5% rates is how Tether's ~100 employees generated billions in profit.",
    },
    {
      q: "What was the structural cause of UST's collapse to zero in 2022?",
      options: [
        "Hackers exploited the contract",
        "The peg was backed by swaps into freshly minted LUNA, whose value depended on confidence in the system itself — reflexivity triggered a death spiral, with no real assets at the end of the channel",
        "US regulators shut it down",
        "The Treasuries in its reserve defaulted",
      ],
      answer: 1,
      explain: "An arbitrage channel can transport value but not create it. UST's “collateral” was confidence in UST — once broken, every redemption accelerated the collapse.",
    },
    {
      q: "Why do we call stablecoins “the first RWA that worked”?",
      options: [
        "Because they run on a blockchain",
        "Because they are tokenized claims on off-chain dollar assets (cash/T-bills), structurally identical to all RWA — and the biggest, most stress-tested instance",
        "Because banks issue them",
        "Because their price is stable",
      ],
      answer: 1,
      explain: "The token is a receipt; the trust lives in the off-chain structure. Stablecoins ran that thesis to hundreds of billions of dollars — everything later in this course generalizes from here.",
    },
  ],

  further: [
    { label: "Circle: USDC transparency page (reserve breakdown & monthly attestations)", url: "https://www.circle.com/transparency" },
    { label: "Tether: transparency page (reserve reports)", url: "https://tether.to/en/transparency/" },
    { label: "BIS working paper: Stablecoins — risks, potential and regulation", url: "https://www.bis.org/publ/work905.htm" },
    { label: "Terra/UST collapse (background)", url: "https://en.wikipedia.org/wiki/Terra_(blockchain)" },
  ],
};
