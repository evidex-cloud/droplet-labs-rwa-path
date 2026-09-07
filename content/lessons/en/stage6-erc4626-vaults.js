export default {
  id: "erc4626-vaults",
  stage: 6,
  order: 4,
  title: "ERC-4626 Vaults: Standardizing Yield-Bearing Shares",
  difficulty: "systems",
  prereqs: ["erc20-tokens", "funds-nav"],

  oneLiner:
    "ERC-4626 compresses the entire business of a fund into six functions: deposit assets for shares, redeem shares for assets, and ask at any moment what one share is worth. Share price = totalAssets ÷ totalShares — the NAV formula you learned in Stage 3.3, transplanted verbatim into a contract interface. Because every vault looks identical, any DeFi protocol can plug into a vault it has never seen — standardization is distribution. When RWA uses it to hold tokenized Treasuries, it adds two things: an eligibility gate (compliance checks) and a NAV feed (an oracle). But remember: standard ≠ safe — the first-depositor inflation attack is the textbook counterexample.",

  intuition: `
The first three lessons of Stage 6 all attacked one question: “**who may hold**.” This lesson switches questions: “**how do shares earn yield, and how are they priced**” — the territory of the second most important standard in the RWA world.

Recall Stage 3.3: a fund's entire accounting compresses into one division — **NAV per share = (total assets − total liabilities) ÷ total shares**. Subscriptions buy in at it, redemptions exit at it, computed once a day. Now ask an engineer's question: if you turned that division into a smart-contract interface, what's the minimum number of functions?

The answer is about six, and the Ethereum community has already standardized them: **ERC-4626, the Tokenized Vault Standard**. The word “vault” sounds very DeFi, but translate it back into traditional finance and there's nothing new under the sun — **a container holding a pool of assets and issuing proportional shares** is precisely a fund. An ERC-4626 share is itself an ERC-20 token (our old friend from Stage 2.4), so wallets display it, DEXs trade it, lending protocols accept it as collateral.

Why does this matter so much for RWA? Because tokenized Treasury funds (Stage 10.1's BUIDL, the OUSGs of the world) are, at bottom, all “yield-bearing shares.” Whoever standardizes the interface of a yield-bearing share defines the surface where RWA meets the whole DeFi Lego set. Understand ERC-4626 here, and Stage 9.3 — “RWA inside DeFi” — will feel inevitable.

**Here's the map — five parts:**

- **① A fund in six functions: the interface at a glance**
- **② Share math: why a mid-stream entrant takes advantage of no one**
- **③ Two ways to pay yield: accumulating vs rebasing**
- **④ Why standardization is strategic: composability is distribution**
- **⑤ Standard ≠ safe: the inflation attack, and RWA's two retrofits**
`,

  mechanics: `
### ① A fund in six functions: the interface at a glance

An ERC-4626 vault contract revolves around two things: the **asset** — the underlying ERC-20 in the pool (say, USDC); and the **share** — an ERC-20 the vault itself issues, representing your proportional claim on the pool. The core interface:

- \`deposit(assets, receiver)\`: put assets in; shares are minted to you at the current price.
- \`withdraw(assets, receiver, owner)\` / \`redeem(shares, receiver, owner)\`: a mirrored pair — the former says “I want this many assets back,” the latter “burn this many shares” — both burn shares and return assets.
- \`convertToShares(assets)\` / \`convertToAssets(shares)\`: the **exchange-rate oracle**, answering at any moment “how many shares is this much asset worth” (and vice versa).
- \`totalAssets()\`: the total value of assets in the pool — the single most important number in the contract (see ⑤).

**Share price = totalAssets() ÷ totalSupply()**. Recognize it? That's NAV per share, moved from the fund administrator's Excel into a read-only contract function. Anyone — human or contract — can call \`convertToAssets(1e18)\` at any time and get a live answer to “what is one share worth” — **fund accounting goes from a 4 p.m. daily PDF to a 24/7 view function**.

### ② Share math: why a mid-stream entrant takes advantage of no one

The standard's most elegant guarantee hides in the minting formula: **new shares = assets deposited × total shares ÷ total assets** — always minted at the **current** price. A worked example, end to end:

- **Day 1**: Alice deposits 1,000 USDC. The vault is empty, so shares mint 1:1 — 1,000 shares. totalAssets=1,000, totalShares=1,000, share price $1.00.
- **Six months later**: the Treasuries in the pool have earned 24 USDC of interest (half of roughly 4.8% annualized). totalAssets=1,024, totalShares still 1,000 — the share price rises to **$1.024**.
- **Bob enters now**, depositing 1,024 USDC. At the current price he mints 1,024 ÷ 1.024 = **1,000 shares** (not 1,024!). Now totalAssets=2,048, totalShares=2,000, price still $1.024.
- **Check**: Alice's 1,000 shares are worth 1,024 USDC — not a cent of her six months' interest was diluted; Bob's 1,000 shares are worth exactly the 1,024 USDC he just put in — he got none of anyone else's accrued yield for free.

That is the entire reason \`convertToShares\` exists: **entry and exit at any moment settle at “NAV right now,” so early holders' gains and late arrivals' principal never touch**. Traditional funds achieve the same fairness with “daily subscriptions and redemptions at that day's NAV” — ERC-4626 turns it into a mathematical invariant that holds every block.

### ③ Two ways to pay yield: accumulating vs rebasing

The same yield can be rendered to holders in two entirely different ways — the pair beginners most often confuse, and most worth untangling:

- **Accumulating (accruing)**: your **share count stays fixed; the share price rises**. Alice's example above: always 1,000 shares, price climbing from $1.00 to $1.024. Ondo's **OUSG** is this style. Traits: the number in your wallet never moves (psychologically, “you can't see the interest”), transfers and bookkeeping are simple, and tax treatment is often **capital gains** (realized on sale).
- **Rebasing**: **the share price is pinned near $1, and your balance grows by itself**. 1,000 tokens today; open the wallet tomorrow and it reads 1,000.13. stETH (Lido's staking receipt) and the **rUSDY form of Ondo's USDY** take this road. Traits: it feels like “a bank account paying daily interest,” wonderfully intuitive; but integration is painful — many DeFi protocols assume “balances don't change on their own,” and a rebasing token fed into them mis-accounts.

**The two are economically identical** — same pool, same yield, same proportional claim; only “price moves” vs “quantity moves” differs in rendering. Hence the **wrappers** that convert between them: wstETH wraps rebasing stETH into an accumulating form (fixed quantity, rising price) for protocols that can't handle rebasing. Master this pair now, and comparing OUSG vs USDY in Stage 10.2 will be a stroll.

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="v4626-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="16" y="16" width="296" height="264" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="164" y="42" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">Accumulating (OUSG style)</text>
  <text x="164" y="62" text-anchor="middle" font-size="10" fill="var(--muted)">share count fixed, price rises</text>
  <line x1="48" y1="240" x2="288" y2="240" stroke="var(--line)" stroke-width="1.2"/>
  <line x1="48" y1="240" x2="48" y2="80" stroke="var(--line)" stroke-width="1.2"/>
  <path d="M 48 200 L 128 186 L 208 170 L 288 152" fill="none" stroke="var(--orange-ink)" stroke-width="2.2" marker-end="url(#v4626-arr-en)"/>
  <text x="212" y="140" font-size="10" fill="var(--orange-ink)">price $1.00 → $1.048</text>
  <path d="M 48 120 L 288 120" fill="none" stroke="var(--green)" stroke-width="2.2" stroke-dasharray="6 4"/>
  <text x="204" y="108" font-size="10" fill="var(--green)">balance fixed at 1,000</text>
  <text x="164" y="268" text-anchor="middle" font-size="9" fill="var(--muted)">often capital-gains tax · DeFi-friendly</text>
  <rect x="328" y="16" width="296" height="264" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="476" y="42" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">Rebasing (stETH / rUSDY style)</text>
  <text x="476" y="62" text-anchor="middle" font-size="10" fill="var(--muted)">price pinned ~$1, balance grows</text>
  <line x1="360" y1="240" x2="600" y2="240" stroke="var(--line)" stroke-width="1.2"/>
  <line x1="360" y1="240" x2="360" y2="80" stroke="var(--line)" stroke-width="1.2"/>
  <path d="M 360 200 L 440 186 L 520 170 L 600 152" fill="none" stroke="var(--green)" stroke-width="2.2" marker-end="url(#v4626-arr-en)"/>
  <text x="512" y="140" font-size="10" fill="var(--green)">balance 1,000 → 1,048</text>
  <path d="M 360 120 L 600 120" fill="none" stroke="var(--orange-ink)" stroke-width="2.2" stroke-dasharray="6 4"/>
  <text x="516" y="108" font-size="10" fill="var(--orange-ink)">price ≈ $1.00 always</text>
  <text x="476" y="268" text-anchor="middle" font-size="9" fill="var(--muted)">feels like daily interest · some protocols incompatible</text>
</svg>
<figcaption>Two renderings of the same yield: move the price, or move the quantity. Economically equal; interfaces and taxes are not.</figcaption>
</figure>

### ④ Why standardization is strategic: composability is distribution

Before ERC-4626, every yield protocol wrote its own vault interface: one called it \`stake\`, another \`supply\`; redemption was \`unstake\` here and \`exit\` there; share pricing came in every flavor. Want to plug 10 vaults into one aggregator? Write 10 adapters, audit 10 times. After ERC-4626 (finalized 2022): **write one 4626 adapter, integrate every vault**.

What does that mean for RWA? If a tokenized Treasury vault implements 4626, then to a lending market it looks **exactly like** any DeFi-native vault: it can be priced directly (\`convertToAssets\`), posted as collateral, packaged into strategies. **Shipping a standard interface = shelving your product across all of DeFi at once** — standardization isn't engineering tidiness, it's a distribution strategy. This is precisely the technical premise of Stage 9.3, “RWA as DeFi collateral.”

Of course, an RWA vault can't be a fully open 4626 — the compliance requirements from the first three lessons of this stage still stand. So reality runs **gated 4626s**: \`deposit\`/\`withdraw\` wrapped with identity checks (only verified addresses move in and out), or a permissioned wrapper around a permissionless standard core. Compliance is the door; the interface is the shelf.

### ⑤ Standard ≠ safe: the inflation attack, and RWA's two retrofits

Now for a risk lesson that must be taken seriously. ERC-4626 has a textbook trap: the **first-depositor inflation (donation) attack**. The script: the attacker races to deposit 1 wei into the empty vault, receiving 1 share — at this instant “1 share = 1 wei.” Then he **transfers 10,000 USDC directly to the vault's address** (bypassing deposit) as a “donation,” yanking totalAssets up to 10,000e6 wei while totalShares remains 1 — the share price is inflated to an astronomical number. The victim now deposits 5,000 USDC: the formula mints 5,000e6 × 1 ÷ 10,000e6 = 0.5 shares — **rounded down to 0 shares**. The money enters the pool, the victim holds nothing, and everything in the pool belongs to the attacker's single share.

The defenses are mature: **virtual shares/assets** (add a virtual quantity to numerator and denominator — built into OpenZeppelin's implementation), or the issuer **burning a batch of dead shares** at deployment. Engrave the moral: **“implements the standard” only means the interface is shaped right — it says nothing about the implementation being safe**. This is one reason Stage 12.2 hammers on reading audit reports.

One last retrofit ties this lesson to the whole course: for a pure DeFi vault, \`totalAssets()\` counts real tokens on-chain; for an RWA vault, the pool holds **off-chain Treasuries** the contract cannot see. So \`totalAssets()\` must come from **an oracle-posted NAV** (computed by the fund administrator, reported on-chain — the entire subject of Stage 8.2). The vault is the **junction where fund accounting meets token mechanics** — upstream, Stage 3.3's NAV pipeline; downstream, Stage 9's liquidity Lego.

If you take away one sentence: **4626 compresses fund accounting into six functions — and an RWA vault is those six functions plus an eligibility gate plus a NAV feed.**
`,

  demo: "vault-shares",

  analogy: `
Picture an ERC-4626 vault as a **bakery run as a partnership**.

The bakery's entire property (flour, ovens, cash in the till) is totalAssets; the **partnership shares** are the shares. Want to buy in? The price isn't haggled — you subscribe at **this moment's net value per share** — total property divided by total shares (deposit). Want out? You're paid out at the same number (redeem). When the shop profits and the property grows, each share is worth more — **early partners fear no dilution from latecomers, and latecomers hand no free gift to the early ones**, because every entry and exit settles at the net value of that moment.

“Accumulating vs rebasing” is just **two bookkeeping habits**: in one, the share count never changes and each share grows more valuable (you hold 10 shares as they climb from $100 to $104.80); in the other, each share is forever booked at $100 but **the ledger tops up your share count automatically** (10 shares become 10.48). Same profit, different column of the ledger.

Why should every bakery in town use **the same partnership-agreement template** (standardization)? Because the bank can read it. Walk in with a templated share certificate and the bank doesn't study each shop's bylaws — to have seen one is to have seen them all. **The template is liquidity.** But don't forget: however standard the template, it can't stop one shop from cooking its books — before you buy in, you still open the ledgers (the audit).
`,

  misconceptions: [
    "“A vault is a new species DeFi invented.” —— Strip the jargon and it's “asset pool + proportional shares” — a fund (Stage 3.3). ERC-4626 merely turns fund accounting into a standard contract interface; share price = totalAssets ÷ totalShares is NAV per share.",
    "“A rebasing token's balance grows by itself, so its yield must be higher.” —— Accumulating and rebasing are economically identical: same pool, same yield; one moves the price, the other the quantity. The differences are UX, tax treatment, and protocol compatibility — wrappers like wstETH convert between the forms without changing the yield.",
    "“Mid-stream subscribers skim yield the old holders already accrued.” —— They don't. The minting formula prices at the current share value: a newcomer's money converts at “NAV right now,” and the veterans' gains are already in the price. That is exactly why convertToShares exists.",
    "“Implementing ERC-4626 means the vault is safe.” —— The standard specifies the interface, not the implementation. The first-depositor inflation attack strikes perfectly “standard-compliant” implementations; defenses like virtual shares/dead shares are required. Standard ≠ audit — see Stage 12.2.",
    "“An RWA vault's totalAssets is computed by the contract itself.” —— A pure DeFi vault can count on-chain assets; an RWA vault's underlying is off-chain Treasuries the contract can't see, so totalAssets depends on an oracle-posted NAV (Stage 8.2). If the feed is wrong, everything is wrong — a trust link unique to RWA vaults.",
  ],

  quiz: [
    {
      q: "An ERC-4626 vault's share price equals?",
      options: [
        "A fixed price set by the issuer",
        "totalAssets() ÷ totalSupply() — the on-chain version of NAV per share",
        "The last secondary-market trade price",
        "The historical cost at deposit time",
      ],
      answer: 1,
      explain: "Share price is total assets divided by total shares — Stage 3.3's NAV formula moved verbatim into the contract, queryable by anyone at any time via convertToAssets.",
    },
    {
      q: "A vault has totalAssets=1,024 and totalShares=1,000. Bob deposits 1,024 USDC. How many shares does he mint?",
      options: [
        "1,024 shares, at 1:1",
        "1,000 shares — 1,024 ÷ the current price of 1.024",
        "512 shares",
        "Whatever the issuer manually decides",
      ],
      answer: 1,
      explain: "New shares = assets × total shares ÷ total assets = 1,024 × 1,000 ÷ 1,024 = 1,000. Minting at current NAV keeps existing holders' gains undiluted.",
    },
    {
      q: "The essential relationship between accumulating and rebasing shares is?",
      options: [
        "Rebasing pays a higher yield",
        "Economically identical: same yield, one raises the price, the other the quantity; they differ in UX, taxes, and protocol compatibility",
        "Accumulating shares can't be redeemed",
        "They must hold different underlying assets",
      ],
      answer: 1,
      explain: "One yield, two renderings; wstETH-style wrappers convert between them. Confusing the two causes real integration and tax mistakes.",
    },
    {
      q: "The core move of the first-depositor inflation attack is?",
      options: [
        "Brute-forcing the vault's private key",
        "Deposit 1 wei for 1 share, then “donate” a large sum directly to the vault (bypassing deposit) to inflate the share price so later depositors round down to 0 shares",
        "Bribing the oracle to lower the NAV",
        "Rapid subscribe-redeem cycling to skim spreads",
      ],
      answer: 1,
      explain: "The donation balloons totalAssets while shares stay at the attacker's 1; the inflated price rounds victims' mints to zero. Defenses: virtual shares / dead shares — even standard-compliant code needs the hardening.",
    },
    {
      q: "Where does an RWA vault's totalAssets() number come from?",
      options: [
        "The contract sums on-chain assets automatically",
        "The custodian bank of the underlying Treasuries writes it directly",
        "From an oracle-posted fund NAV — computed off-chain by the administrator, reported on-chain (Stage 8.2)",
        "Secondary-market token price times circulating supply",
      ],
      answer: 2,
      explain: "The underlying sits off-chain where the contract can't see it; totalAssets rides the NAV feed. The vault is where fund accounting meets token mechanics — and one more trust link to diligence.",
    },
  ],

  further: [
    { label: "EIP-4626: the Tokenized Vault Standard, original text", url: "https://eips.ethereum.org/EIPS/eip-4626" },
    { label: "ethereum.org: ERC-4626 developer guide", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-4626/" },
    { label: "OpenZeppelin: ERC-4626 implementation & inflation-attack mitigation", url: "https://docs.openzeppelin.com/contracts/5.x/erc4626" },
    { label: "ERC-4626 Alliance: ecosystem and vault lists", url: "https://erc4626.info/" },
    { label: "Lido: wstETH and the rebasing/accumulating wrapper explained", url: "https://help.lido.fi/en/articles/5231836-what-is-wrapped-steth-wsteth" },
  ],
};
