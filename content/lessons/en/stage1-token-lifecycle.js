export default {
  id: "token-lifecycle",
  stage: 1,
  order: 1,
  title: "The Journey of One RWA Token: Originate → Issue → Trade → Redeem",
  difficulty: "intro",
  prereqs: ["what-is-rwa"],

  oneLiner:
    "The life of an RWA token is a loop that starts in the cash world and ends back in it: a manager picks assets, lawyers build an entity, compliance officers install the gates, engineers deploy the contract — then an investor wires money, tokens are minted, NAV updates daily, yield pays monthly, holders trade hands, and finally tokens are burned and cash wired back. If you remember one thing: mint and burn are the only two airlocks between the cash world and the token world — everything in between is just bookkeeping on a shared ledger.",

  intuition: `
From Stage 0 you already know what an RWA is: the **rights** to a real-world asset, packaged as an on-chain token. But hiding inside the word “packaged” is an entire assembly line. It's like knowing that “shipping means moving a thing from A to B” — to really understand logistics, you have to follow **one specific parcel**: pickup, sorting, line-haul, delivery, signature — a different crew doing different work at every stop.

So in this lesson we won't do concepts; we'll tail **one specific token**. Let's name it **TBF** — a share token of a **tokenized US Treasury fund**. The fund buys short-term US Treasury bills (T-bills, the safest debt there is, yielding around 4% a year — Stage 3.2 goes deep), and each TBF represents one share of the fund. We'll start from the day it doesn't exist yet and follow it to the day it's destroyed, noting three things at every stop: **who acts, what happens, and which stop on this course teaches that craft in depth**.

You'll walk away with two things. First, a **story-form table of contents for the course** — every block of knowledge in the dozen stages ahead makes a cameo somewhere on this journey, so wherever you are later, you'll know your place on the map. Second, a mental model that runs through the whole course: **mint and burn are two “airlocks”** — dollars can only become tokens through one, and tokens can only become dollars again through the other; all the action in between (transfers, quotes, distributions) is just numbers moving around inside one ledger.

**Here's the map — 6 parts:**

- **① Before birth: pick assets, build the entity, install compliance, build the tech (stops 1–4)**
- **② Mint = subscription: the first airlock opens (stop 5)**
- **③ Life in service: NAV, distributions, attestations (stop 6)**
- **④ Secondary transfer: what the chain checks the instant hands change (stop 7)**
- **⑤ Burn = redemption: the second airlock (stop 8)**
- **⑥ The dark path: the day the issuer fails (stop 9)**
`,

  mechanics: `
### ① Before birth: pick assets, build the entity, install compliance, build the tech

Before a single TBF is minted, four stops of preparation happen — skip any one and it turns into an accident later.

**Stop 1 · Origination (who: the fund manager)**. The manager decides what the fund buys: three-month US Treasury bills, targeting roughly 4%–5% annualized (the market level as of 2025). Why Treasuries? Because they're the world's consensus pick for lowest credit risk and best liquidity — which is also why tokenized Treasuries became RWA's biggest category (roughly $7–8B by late 2025). How assets get picked and where the yield comes from: Stage 3.2.

**Stop 2 · Legal structuring (who: manager + lawyers)**. This stop decides what your token actually **is**. The lawyers set up an independent legal entity — usually a fund or an **SPV** (special purpose vehicle, a “shell company” that exists to do exactly one thing) — have **that entity** hold the Treasuries, then draft a full document set (fund charter, subscription agreement, offering memorandum) stating in black and white: **one TBF = one share of this entity**. Watch the wording: the token is not the Treasuries themselves, but a **claim** on “the entity that holds the Treasuries.” That sentence is the foundation of this whole course — Stage 5 spends an entire stage on it.

**Stop 3 · Compliance setup (who: manager + compliance provider)**. A security can't be sold to just anyone. This stop answers: **who is eligible to hold TBF** (say, accredited investors only), how identity gets verified (**KYC**, know your customer), and how money launderers and sanctioned parties get screened out (**AML** / sanctions lists). The answers become a “KYC pipeline” plus an **on-chain whitelist** — an address that hasn't passed review simply cannot receive TBF at the contract level. This gate system stars in Stage 7.

**Stop 4 · Tech setup (who: manager + engineers)**. Choose a chain (public or permissioned? Stage 2.6), choose a token standard — and note, **a plain ERC-20 won't do**, because a plain ERC-20 transfer checks nothing but balances and can't carry rules like “only whitelisted holders”; you need a permissioned standard (like ERC-3643, which auto-checks eligibility before every transfer), plus control switches reserved for the issuer (freeze, forced transfer — jarring, yes, but regulators require them; Stage 6.5 explains why). The contract deploys, and the TBF “container” is built — but still empty: **total supply is 0**.

### ② Mint = subscription: the first airlock opens

Now the first investor arrives: a corporate treasury we'll call “Acme,” which wants to park $1 million of idle cash in TBF to earn yield. Watch every move at this stop, because it's the most important mechanism in the course:

- Acme submits KYC documents, passes review, and its on-chain address is **added to the whitelist**;
- Acme **wires $1,000,000** to the fund's bank account — note that the money travels traditional bank rails, not the chain;
- The custodian confirms receipt, and the manager uses the cash to buy Treasuries;
- The fund instructs the contract: **mint 1,000,000 TBF to Acme's address** (NAV per share is $1.00 at this point).

<figure><svg viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="tlc-arrow-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-line)"/></marker></defs><rect x="14" y="50" width="150" height="90" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="89" y="78" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">Cash world</text><text x="89" y="98" text-anchor="middle" font-size="10" fill="var(--muted)">dollars · bank wires</text><text x="89" y="114" text-anchor="middle" font-size="10" fill="var(--muted)">T-bills · custody acct</text><rect x="196" y="58" width="96" height="74" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="244" y="86" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">Airlock 1</text><text x="244" y="104" text-anchor="middle" font-size="11" fill="var(--orange-ink)">mint = subscribe</text><rect x="324" y="50" width="150" height="90" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="399" y="78" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">Token world</text><text x="399" y="98" text-anchor="middle" font-size="10" fill="var(--muted)">balances · transfers</text><text x="399" y="114" text-anchor="middle" font-size="10" fill="var(--muted)">all bookkeeping</text><rect x="506" y="58" width="96" height="74" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="554" y="86" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">Airlock 2</text><text x="554" y="104" text-anchor="middle" font-size="11" fill="var(--orange-ink)">burn = redeem</text><line x1="164" y1="95" x2="194" y2="95" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tlc-arrow-en)"/><line x1="292" y1="95" x2="322" y2="95" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tlc-arrow-en)"/><line x1="474" y1="95" x2="504" y2="95" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#tlc-arrow-en)"/><text x="320" y="170" text-anchor="middle" font-size="11" fill="var(--muted)">Dollars enter and leave the token world only through these two airlocks; everything between them is internal bookkeeping</text></svg></figure>

**Minting is subscription.** A million tokens appear on-chain, matched by a very real million dollars newly sitting in an off-chain bank account. This “money in, tokens out” gate must stay one-to-one and independently verified — the moment someone can **mint without depositing**, the whole system becomes a counterfeit press (exactly the accident that proof-of-reserve in Stage 8.3 exists to catch). The full rulebook of primary issuance: Stage 9.1.

### ③ Life in service: NAV, distributions, attestations

Once minted, the token enters its long “service life.” Three routines cycle in the background:

- **Daily NAV.** The fund administrator (an independent third party) computes daily: (assets − liabilities) ÷ shares = NAV per share. T-bills accrue interest every day, so TBF's NAV crawls from $1.0000 to $1.0004, $1.0008… and the number is **published on-chain**, so the token world knows what each TBF is worth. How it's computed and fed on-chain: Stage 8.2.
- **Monthly distributions.** A month of accrued interest (on $1M principal at 4.8% annualized, about $4,000) is paid out to holders as cash or newly minted tokens — BlackRock's BUIDL pays dividends daily in new tokens. How cash flows back to the token: Stage 8.4.
- **Periodic attestations.** An accounting firm periodically reconciles “tokens issued on-chain vs assets in the custody account” and publishes an attestation report; some are pushed on-chain via oracles (proof of reserve). This is the searchlight against counterfeit minting: Stage 8.3.

Notice the contrast: **not one of these three happens on-chain** — NAV is computed by people and spreadsheets, the interest comes from off-chain Treasuries, the reconciling is done by accountants. The chain's only job is to **faithfully record the results**. This “the chain is a mirror, the real estate lives off-chain” relationship is exactly the subject of the next lesson (Stage 1.2).

### ④ Secondary transfer: what the chain checks the instant hands change

Six months later, Acme wants half its money back early but doesn't want to wait out the redemption process (say redemptions settle T+2). It finds “Bay Fund,” another KYC-passed investor, and agrees to sell 500,000 TBF at NAV. What happens on-chain is one line: \`transfer(bayAddress, 500000)\`.

But before that line succeeds, the contract **automatically runs a compliance check**: is Bay's address on the whitelist? Is Bay's country permitted? Does this trip a holder-count cap? Is a lockup in force? **Fail any one and the transfer simply reverts** — the biggest difference between a permissioned token and ordinary crypto: the rules live in the token contract, not in a lawyer's letter. Exactly how many checks one transfer must pass: Stage 7.3, item by item.

And notice again: in this trade, **the fund's Treasuries didn't move an inch and the bank account didn't move a cent**. Only the ledger's record of “who holds how many shares” changed, plus whatever Bay paid Acme privately. Every trade between the two airlocks is this kind of pure bookkeeping. The wider secondary-market game (order books, market making, why RWA liquidity is hard): Stage 9.

### ⑤ Burn = redemption: the second airlock

Another six months on, Bay Fund needs the cash and goes through formal redemption. The flow is minting in a mirror:

- Bay submits a redemption request to the manager: redeem 500,000 TBF;
- NAV has crawled to $1.0230 by now, so the amount due = 500,000 × 1.0230 = **$511,500**;
- The manager sells the corresponding Treasuries for cash (or pays straight from a cash buffer);
- The contract **burns 500,000 TBF from Bay's address**, and the custodian wires $511,500 to Bay's bank account.

**Burning is redemption**: tokens vanish, money leaves, one-to-one. And with that, this token (well, these 500,000 tokens) completes its life: dollars → airlock 1 → tokens → bookkeeping shuffles → airlock 2 → dollars. Redemption window design (T+0 or T+2? what daily caps?) directly determines whether the token's market price can hug NAV — Stage 9.4 covers that elegant arbitrage machine.

### ⑥ The dark path: the day the issuer fails

Finally, the fork nobody wants to take but every investor must think through in advance: **what if the manager goes bankrupt?**

Back to the seed planted at Stop 2: the Treasuries are not held in the manager's name, but in that **independent fund/SPV entity**. If the manager collapses, its creditors can carve up **the manager's own** assets — but they **cannot reach the Treasuries inside the SPV**. The legal term is **bankruptcy remoteness**. Holders claim pro-rata through their TBF (which is the share certificate of that entity); the worst case is swapping in a new manager, or an orderly wind-down that returns the cash.

But this firewall **does not exist automatically** — it depends on whether Stop 2's documents were drafted right, the registrations actually made, and the jurisdiction recognizes “token = share.” Botch it, and the token really is just “a string of ownerless digits.” How to judge whether a project's firewall is real: Stage 5.4 maps the full recourse path, and Stage 12 teaches you to verify it before you buy.

If you take away one sentence: **mint and burn are the only two airlocks between the cash world and the token world — the airlocks must be independently verified and legally backstopped, and everything in between is just bookkeeping.**
`,

  demo: "lifecycle-journey",

  analogy: `
Think of TBF's life as a **theme-park wristband**. At the gate you hand over $100 in cash and staff clip a stored-value wristband on you — that's **minting**: real money goes into the park's vault, and you get the credential that circulates inside.

Inside the park, the wristband swipes for rides and popcorn, and you can even transfer balance to a friend (if park rules allow) — all of it is **bookkeeping inside the ledger**: not a bill in the vault moves; only the record of “whose wristband holds how much” changes. The park counts the vault daily and posts its coverage ratio — just like a fund computing daily NAV and publishing periodic attestations.

On your way out, you return the wristband at the counter; the park cuts it off and refunds your unspent cash — that's **burn = redemption**. The wristband touches real money at exactly two moments: the way in and the way out.

And the question that matters most: **whose name is on the vault?** If it's the park owner's personal name, and the owner gambles it away and skips town, your balance is scrap plastic. If it's an independent custodial account with legal papers saying “this money belongs solely to wristband holders,” you can still line up and get your money back even after the owner flees. The entire legal engineering of RWA (Stage 5) is the craft of carving the right name onto that vault.
`,

  misconceptions: [
    "“Buying an RWA token means directly owning the asset.” —— No. You own a claim on the legal entity that holds the asset (a share, a note). The Treasuries are registered to the fund/SPV; your token is the certificate. This distinction decides whether you get your money back when the issuer fails (Stage 5.1).",
    "“When tokens move around on-chain, the underlying assets move with them.” —— They don't move at all. A secondary transfer only changes the ledger's record of who holds how many shares; the Treasuries and cash in custody don't budge. Assets truly move only at the two airlocks (bought at mint, sold at redemption).",
    "“Minting tokens is like launching a cryptocurrency — mint as many as you like.” —— For compliant RWA it's the exact opposite: every mint must match a real subscription payment received, every burn a real redemption payment sent. Minting without money received isn't issuance, it's fraud — precisely what attestations and proof of reserve (Stage 8.3) watch for.",
    "“The on-chain flow is automated, so there are no intermediaries.” —— This journey is lined with people the whole way: a manager picking assets, lawyers building the entity, a compliance shop running KYC, a custodian holding the money, an administrator computing NAV, accountants attesting. The chain replaces reconciliation-and-registry friction, not these roles (Stage 1.3 covers who to trust and how to verify).",
    "“If the issuer collapses, the token goes to zero.” —— Not if the structure was built right: the assets sit in a bankruptcy-remote SPV, out of the manager's creditors' reach, and holders recover pro-rata. But “built right” is the premise — you verify the firewall by reading the documents (Stage 5.4, Stage 12.2).",
  ],

  quiz: [
    {
      q: "In TBF's journey, what traditional fund action does “minting” correspond to?",
      options: ["Paying a dividend", "Subscription: once an investor's wire lands, the matching quantity of tokens is created to their address", "Listing on an exchange", "An audit"],
      answer: 1,
      explain: "Mint = subscription: money passes through the airlock into the custody account, and equivalent tokens are created on-chain, one-to-one.",
    },
    {
      q: "Acme sells 500,000 TBF to Bay Fund on the secondary market. What happens to the Treasuries in the fund's custody account?",
      options: ["Half the Treasuries are sold to Bay", "The Treasuries are re-registered to Bay", "Nothing — only the ledger's holding records change", "The Treasuries are frozen pending review"],
      answer: 2,
      explain: "Everything between the two airlocks is pure bookkeeping: the underlying assets move only at mint (buy) and redemption (sell).",
    },
    {
      q: "Why is “minting without money received” the most fatal accident in the system?",
      options: ["Because it wastes gas", "Because it's counterfeiting: on-chain certificates lose their one-to-one match with off-chain assets, diluting every holder", "Because regulators forbid using dollars", "Because the contract would crash"],
      answer: 1,
      explain: "The airlock's whole purpose is guaranteeing every token is matched by equal assets. Unbacked minting is what attestations and proof of reserve (Stage 8.3) exist to catch.",
    },
    {
      q: "When the manager goes bankrupt, why might TBF holders still get their money back?",
      options: ["Because the blockchain is immutable, so the token always has value", "Because the assets are registered to an independent fund/SPV, and bankruptcy remoteness keeps the manager's creditors away from them", "Because the custodian pays out of its own pocket", "Because the regulator prints money to cover it"],
      answer: 1,
      explain: "What saves you isn't the chain — it's the legal structure built at Stop 2: bankruptcy remoteness plus the token being defined as a share of that entity (Stage 5).",
    },
    {
      q: "Where, and by whom, is TBF's daily NAV computed?",
      options: ["The smart contract computes it automatically from on-chain data", "Miners vote on it", "Off-chain, by the fund administrator — and the result is then published on-chain", "Each holder's wallet estimates it independently"],
      answer: 2,
      explain: "NAV's raw ingredients (T-bill market prices, accrued interest, fees) all live off-chain; the administrator computes it, and the chain faithfully records the published result — the chain is the mirror, not the estate (Stage 1.2, Stage 8.2).",
    },
  ],

  further: [
    { label: "rwa.xyz: live dashboard of tokenized Treasuries and RWA", url: "https://app.rwa.xyz/" },
    { label: "Franklin Templeton BENJI: the first US-registered on-chain fund", url: "https://digitalassets.franklintempleton.com/benji/" },
    { label: "McKinsey: From ripples to waves — the transformational power of tokenizing assets", url: "https://www.mckinsey.com/industries/financial-services/our-insights/from-ripples-to-waves-the-transformational-power-of-tokenizing-assets" },
    { label: "Chainlink Education Hub: what asset tokenization is", url: "https://chain.link/education-hub/asset-tokenization" },
    { label: "SEC Investor.gov: net asset value basics", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/net-asset-value" },
  ],
};
