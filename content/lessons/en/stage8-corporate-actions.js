export default {
  id: "corporate-actions",
  stage: 8,
  order: 4,
  title: "Dividends, Coupons & Corporate Actions: How Cash Flows Back to the Token",
  difficulty: "systems",
  prereqs: ["erc4626-vaults", "nav-feeds"],

  oneLiner:
    "Issuance is one day's news; paying coupons is ten years of operations. A single bond coupon has to travel from the borrower's bank account through the SPV, the custodian, and the administrator's reconciliation before it becomes a number in each on-chain holder's balance — and along that road sit three distribution designs (airdrop, rebase, accumulating), the record-date problem of who actually qualifies for the money, and the ugliest workflow of all: default. Half of an RWA platform's real moat hides inside this month-after-month machine.",

  intuition: `
So far this course has mostly covered **how to get an asset onto the chain**: legal wrappers (Stage 5), token standards (Stage 6), compliance checks (Stage 7), oracle data (Stages 8.1–8.3). Do all of that, the tokens go out, the launch photos get taken — and then what?

Then comes **a decade**.

For a five-year tokenized bond, issuance is day 1; across the following 1,825 days, **interest must be paid every quarter**: the borrower wires funds, the SPV receives them, the administrator reconciles, tax is withheld, the amount is split pro-rata among hundreds or thousands of on-chain addresses, reports are filed, holder emails are answered. At maturity, principal is repaid, tokens are burned, the SPV is wound down. Any quarter that goes wrong — paid late, computed wrong, paid to someone ineligible, tax not withheld — is a real legal dispute.

This is the **servicing layer**, where RWA turns from an issuance event into an operating business. There's a pattern that recurs across the industry: teams spend 90% of their energy on "how do we launch" and 10% on "how do we survive after launch" — while the real cost distribution is exactly the reverse (Stage 13.2 returns here with a budget spreadsheet).

For you as a learner, the value of this lesson is this: **read a product's distribution design and you can read its operational maturity**. Which distribution model did it choose? How is the record date set? What happens if someone sells one second before the coupon? On the day the borrower defaults, what happens on-chain? — The answers to those questions say more than any whitepaper's vision statement.

**Here's the map — five parts:**

- **① The full path of one coupon: from the borrower's account to your wallet**
- **② Three distribution designs: airdrop, rebase, accumulating**
- **③ The record-date problem: who gets paid when tokens changed hands**
- **④ Other corporate actions: calls, maturity, splits, default, withholding**
- **⑤ The real cost of operations: this is where the moat lives**
`,

  mechanics: `
### ① The full path of one coupon: from the borrower's account to your wallet

Trace one bond coupon end to end. Assume a **$10,000,000 tokenized corporate bond, 5% coupon, paid quarterly** — each quarter owes \`10,000,000 × 5% ÷ 4 = $125,000\`.

- **Step 1 (off-chain), the obligor pays**: on the payment date the borrowing company wires $125,000 from its bank account to the **SPV** (the bankruptcy-remote shell from Stage 5.2). **Mind the timing: bank wires are not instant**, and cross-border ones answer to two business calendars (Stage 3.4's old complaint: the traditional rails don't work nights or weekends).
- **Step 2 (off-chain), funds land**: the money settles in the SPV's account at the **custodian**.
- **Step 3 (off-chain), the administrator reconciles and instructs**: the **fund/asset administrator** checks the amount against the bond's terms, deducts servicing fees and withholding tax, computes each holder's share, and issues a **distribution instruction** to the on-chain operator. This step is human or semi-automated accounting work and typically takes 1–3 business days.
- **Step 4 (on-chain), execute the distribution**: via one of the three models in ② below, land the cash or the shares in holders' addresses.
- **Step 5 (off- and on-chain), report**: holder statements and tax documents off-chain; an auditable transaction record on-chain.

From the borrower's wire to the holder's receipt: typically **T+2 to T+5**. Puncture an illusion here: **the on-chain part is only the last mile, and it's the fastest leg**; what sets the pace is the banking and accounting steps in front of it. "Blockchain makes distributions real-time" is only partly true when **the money itself is also on-chain** (paid and received in stablecoins) — which is exactly what the deposit tokens of Stage ∞.1 are trying to fix.

### ② Three distribution designs: airdrop, rebase, accumulating

Stage 6.4 touched on how yield shows up from the vault-standard angle; here we redo it from the **operational execution** angle, and each model carries a different bill:

- **① Airdrop / push**: the contract transfers **USDC directly to every holder**, pro-rata. In the example above, a 30% holder receives $37,500 USDC. Upside: straightforward, holders immediately have usable cash, and it matches the traditional "cash dividend" experience. Downside: **gas cost grows linearly with holder count** — trivial for 3 holders, a serious expense for 30,000 (hence the common pairing with a Merkle claim so holders come collect themselves); it also requires a **snapshot** first to fix the eligibility list (see ③); and there's a subtler nuisance: **pushing money to inactive addresses** just leaves it stranded there.
- **② Rebase (dividend in shares)**: no cash — **mint new tokens pro-rata to each holder**. **BUIDL uses exactly this model**: dividends **accrue daily** and are **paid monthly as new BUIDL tokens**, so your **balance grows** while each token's price stays anchored near $1. Upside: holders don't have to reinvest cash, and the stable price makes a convenient unit of account. Downside: balances move, which is **extra integration burden for exchanges, accounting systems, and every integrator** (many systems assume balances never change on their own).
- **③ Accumulating**: **transfer nothing** — the yield stays in the assets and the **NAV per share rises**. **Ondo OUSG is the archetype**: token count unchanged, NAV climbing from $100 toward $105. Upside: the cleanest operations (no distribution transactions, no snapshots, no gas bill) and simpler tax treatment in some jurisdictions. Downside: **the yield is invisible** — holders see no cash until they sell; and it shifts the entire load onto the NAV feed, so every heartbeat, deviation, and front-running problem from Stage 8.2 applies here in full, because the NAV *is* the yield.

A practical read: **which model a product picks usually leaks who its customers are**. Products meant to serve as DeFi collateral prefer accumulating (a monotonically rising price keeps liquidation logic simple); products for institutional cash management prefer rebase or airdrops (visible cash flow, easier to book).

<figure>
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs>
    <marker id="corporate-actions-arrow-en" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--orange-line)"/></marker>
  </defs>
  <text x="16" y="20" font-size="10" fill="var(--muted)">Off-chain (days; the bank calendar rules)</text>
  <rect x="12" y="30" width="104" height="48" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="64" y="50" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="700">Obligor</text>
  <text x="64" y="66" text-anchor="middle" font-size="9" fill="var(--muted)">pays $125,000</text>
  <rect x="140" y="30" width="104" height="48" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="192" y="50" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="700">SPV @ custodian</text>
  <text x="192" y="66" text-anchor="middle" font-size="9" fill="var(--muted)">funds land</text>
  <rect x="268" y="30" width="118" height="48" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="327" y="50" text-anchor="middle" font-size="10" fill="var(--orange-ink)" font-weight="700">Admin reconciles</text>
  <text x="327" y="66" text-anchor="middle" font-size="9" fill="var(--orange-ink)">fees · tax · instruct</text>
  <line x1="116" y1="54" x2="138" y2="54" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#corporate-actions-arrow-en)"/>
  <line x1="244" y1="54" x2="266" y2="54" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#corporate-actions-arrow-en)"/>
  <line x1="386" y1="54" x2="420" y2="54" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#corporate-actions-arrow-en)"/>
  <text x="470" y="20" font-size="10" fill="var(--muted)">On-chain (the last mile, the fastest leg)</text>
  <rect x="424" y="30" width="204" height="48" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="526" y="50" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="700">Snapshot → distribute</text>
  <text x="526" y="66" text-anchor="middle" font-size="9" fill="var(--muted)">one of the three models</text>
  <rect x="30" y="120" width="180" height="84" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="120" y="140" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="700">① Airdrop USDC</text>
  <text x="120" y="158" text-anchor="middle" font-size="9" fill="var(--muted)">balance flat, wallet gains cash</text>
  <text x="120" y="174" text-anchor="middle" font-size="9" fill="var(--muted)">gas scales with holders</text>
  <text x="120" y="192" text-anchor="middle" font-size="9" fill="var(--muted)">needs a snapshot list</text>
  <rect x="230" y="120" width="180" height="84" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="140" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="700">② Rebase mint</text>
  <text x="320" y="158" text-anchor="middle" font-size="9" fill="var(--muted)">balance grows, price ≈ $1</text>
  <text x="320" y="174" text-anchor="middle" font-size="9" fill="var(--muted)">BUIDL's model</text>
  <text x="320" y="192" text-anchor="middle" font-size="9" fill="var(--muted)">integrators must handle it</text>
  <rect x="430" y="120" width="180" height="84" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="520" y="140" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="700">③ Accumulating</text>
  <text x="520" y="158" text-anchor="middle" font-size="9" fill="var(--muted)">no transfer, NAV rises</text>
  <text x="520" y="174" text-anchor="middle" font-size="9" fill="var(--muted)">OUSG's model</text>
  <text x="520" y="192" text-anchor="middle" font-size="9" fill="var(--muted)">yield invisible, all on the feed</text>
  <text x="320" y="232" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="700">Same $125,000, three landings, three completely different ops bills</text>
</svg>
</figure>

### ③ The record-date problem: who gets paid when tokens changed hands

This is the technical core of the lesson. A coupon period is an **interval** (say January 1 to March 31), but the token may change hands dozens of times inside those three months. When the coupon pays on March 31, **who should get the money?**

Traditional markets solve it with a **record date + ex-date**: whoever holds the security at the record date's close receives the coupon, and anyone buying after that buys it "ex" the coupon. On-chain there are two corresponding routes:

- **Snapshot**: record every address's balance at a specific **block height N** and pay per that moment's list. That's what the ERC-20 Snapshot / checkpoint pattern is for: the contract records balance-change history on each transfer, so at any later time you can query "what was address A's balance at block N." **Clear rules, auditable — the mainstream approach.** The cost: the snapshot moment must be public and predictable, or it's a black box — and once predictable, someone will buy right before it and sell right after (a close cousin of Stage 8.2's front-running logic).
- **Continuous accrual / streaming**: no record date at all — the contract **accrues interest per address by actual holding time**, so 47 days held earns 47 days of coupon. In theory the fairest, and it kills the front-running incentive, but **bookkeeping complexity and gas costs are far higher** (every transfer must settle both sides' accruals); you see it in more finely engineered protocols.

Now a bond-market concept you must own, because tokenized bonds **inherit it verbatim**: **clean vs dirty price**. Between two coupon dates, a bond accrues interest every day. If you sell the token after the snapshot but before the payment, **the seller keeps that coupon** (they held on the record date), so the buyer is getting a bond whose interest has already been stripped out — **the secondary price should therefore drop by roughly the accrued amount**. Markets typically quote the **clean price** (excluding accrued interest) while settling trades at the **dirty price (clean + accrued interest)**.

Why does this matter for RWA? Because in on-chain secondary markets (the AMM pools of Stage 9.2), **price forms automatically from supply and demand, and nobody separates clean from dirty for you**. If a tokenized bond's AMM pool shows an "inexplicable nosedive" around the coupon date, it's most likely not a crash but **going ex-coupon** — and anyone who doesn't know the concept will draw exactly the wrong conclusion. Issuers can also sidestep the whole thing with the accumulating model (②③): no distribution, no ex-coupon drop.

### ④ Other corporate actions: calls, maturity, splits, default, withholding

Coupons are just the most frequent case. Here are the other corporate actions and their token mechanics:

- **Early redemption / call**: the issuer repays early at an agreed price → on-chain, **burn tokens at the call price** and pay the consideration. Watch out for partial calls: burn a pro-rata slice of everyone, or run a lottery? The rule must be written into the offering documents.
- **Maturity**: principal is repaid → typically **freeze transfers and switch to redeem-only mode**, holders come cash out one by one, and the contract winds to zero. This step is often left undesigned, which leaves matured tokens still trading in secondary markets — a certificate that has already expired.
- **Splits / consolidations**: technically just a rebase (scale every balance proportionally) — relatively easy.
- **Restructuring / default**: the ugliest class. On-chain there are three levers: **pause transfers** (the switches of Stage 6.5), **write down through the NAV** (acknowledge the asset is worth 60%), or **exchange old tokens for new ones** (the on-chain version of a debt restructuring — needs holder consent and takes a long time). This is Stage 5.4's world, and the key insight is: **an on-chain token cannot "automatically" resolve a default; it can only faithfully reflect the outcome of an off-chain legal process.**
- **Withholding tax**: some distributions must withhold according to **the holder's jurisdiction** — the same coupon might be withheld at 30% for a holder in country A, 15% under a treaty for country B, and zero for country C. That's a **per-holder computation** requiring each holder's tax status (on-chain identity, Stage 6.3), and getting "how much to withhold" wrong carries legal liability. **This single requirement is what pushes many issuers back toward transfer-agent-mediated distributions** — purely anonymous on-chain payouts simply don't work under tax rules.

### ⑤ The real cost of operations: this is where the moat lives

Back to the opening line. Lay all of the above out as a **monthly task list**: reconcile receipts, deduct fees, withhold tax, set the snapshot, compute allocations, execute on-chain transactions, handle failed addresses, produce holder statements, produce regulatory reports, answer inquiries, keep the NAV feed current (Stage 8.2), maintain PoR (Stage 8.3)… **every month, forever.**

Three conclusions to internalize:

- **This is a recurring human cost, not a one-time development cost.** It needs accounting, compliance, and operations staff — it does not "run itself once the contracts are written." It's also why management fees on tokenized Treasuries sit around **0.15%–0.5%** — that's not a fat margin, it's the bill for this machine.
- **Costs don't fall linearly with scale, but revenue rises linearly with it.** The bulk of this machine's cost is **fixed** (one ops team serving $50M vs $5B doesn't differ much), which makes RWA a business with **powerful economies of scale** — explaining why leading products keep compounding while small issuers keep struggling ("operating costs crushed the small issuer" is a recurring cause of death in Stage 10.6's failure cases).
- **It is the actual moat.** Contract code can be copied and legal structures can be copied, but a distribution machine that has **run five years straight, error-free, with a regulatory record** cannot be — it's a product of time and reputation. BlackRock's advantage in Stage 10.1 is half brand, and half "we've been operating funds this way for decades."

If you take away one sentence: **issuance is one day's news, distributions are ten years of operations — half of RWA's moat lives inside this month-after-month machine, so when you evaluate any product, ask how it plans to survive the next hundred and twenty months.**
`,

  demo: "coupon-flow",

  analogy: `
Picture a tokenized bond as a rental apartment building you bought with two other people, each of you holding a different share.

**Issue day** is the day you sign and get the keys — festive, ceremonial, photo-worthy. But what actually decides whether the investment works is **the rent, every month after**: did the tenant pay on time, how much was deducted for maintenance, how are taxes filed, how is it split three ways, and — when one owner sells their share mid-month — whose rent is it?

The three ways to split rent are this lesson's three distribution models. **Wire cash to the three owners every month** (airdrop): most intuitive, but every transfer costs a fee, and with many owners it becomes a chore. **Skip the cash and give each owner slightly more equity each month** (rebase): everyone's recorded share grows, which suits people who don't want to handle cash — but re-registering ownership means notifying every counterparty each time. **Or don't distribute at all: keep the rent in the building for maintenance and debt service, so the building itself appreciates** (accumulating): the least work, but you never touch a cent until you sell.

**The record-date problem** is that classic neighborly dispute: the rent lands on March 31, but you sold your share to a new owner on March 20 — whose rent is it? The rule has to be fixed in advance ("whoever is on the list on March 25 gets paid"), and the buyer should know they're buying a share **with this month's rent already stripped out**, which is why they should pay a bit less — precisely the bond market's clean-versus-dirty price.

And finally the truth everyone forgets: everyone is thrilled on the day the building is bought, but the profit is actually eaten by **the next hundred and twenty months of property management**. Whoever can run that machine quietly for a decade wins.
`,

  misconceptions: [
    "“Once it's on-chain, distributions are real-time.” —— The on-chain leg is only the last mile. The borrower's wire, the SPV's receipt, the administrator's reconciliation and withholding all still run on the bank calendar — typically T+2 to T+5. Speed only genuinely improves when the money itself is on-chain (stablecoin settlement), which is what deposit tokens aim at (Stage ∞.1).",
    "“A token whose balance never changes (accumulating) pays no yield.” —— The yield shows up as a rising NAV rather than a growing balance. That's OUSG: token count fixed, NAV climbing from $100 to $105. Conversely BUIDL's balance grows while price stays anchored at $1. To judge whether a product yields, ask which dimension carries it — don't just read the wallet number.",
    "“The token price crashed on the coupon date, so something is wrong.” —— Most likely it went ex-coupon. Whoever sold after the snapshot kept the coupon, so the buyer received a stripped bond and the price should fall by roughly the accrued interest — the clean-versus-dirty price distinction. Someone who doesn't know the concept will misread it as a crash and panic-sell.",
    "“Distribution is just paying out on current balances — simple.” —— Current balances are the wrong list. A coupon covers an entire period during which the token may have changed hands dozens of times, so eligibility must come from a record-date snapshot (balances at a block height) or continuous accrual. Paying on the coupon-day balance hands a full quarter's interest to whoever bought in the last second.",
    "“Tax withholding can be fully automated on-chain.” —— The withholding rate depends on each holder's tax residency and applicable treaties — a per-holder legal determination with liability attached if you get it wrong. That's exactly why many issuers keep a transfer agent in the middle of distributions; purely anonymous on-chain payouts fail tax compliance (Stage 6.3, Stage 7.1).",
    "“Once the contracts are written, operations run themselves.” —— The opposite: reconcile, snapshot, distribute, report, withhold, answer inquiries — one round every month, forever. This recurring human cost is where the management fee goes (0.15%–0.5% for Treasuries), it's a common cause of death for small issuers, and it is the leaders' real moat.",
  ],

  quiz: [
    {
      q: "Which distribution model does BUIDL use?",
      options: [
        "Airdropping USDC to holders",
        "Dividends accrue daily and are paid monthly as new BUIDL tokens — the balance grows while price stays anchored near $1",
        "Accumulating, with the token price rising from $1 to $1.05",
        "No distributions; a single payment at maturity",
      ],
      answer: 1,
      explain: "That's the rebase / dividend-in-shares model: holders don't have to reinvest cash and the stable price is a convenient unit of account, at the cost of integrators having to handle changing balances.",
    },
    {
      q: "A quarterly coupon pays on March 31. Bob sells to Dana after the snapshot block but before the payment. Who gets the coupon, and what should the secondary price do?",
      options: [
        "Dana gets it; price unchanged",
        "Bob gets it (he held on the record date); Dana bought an ex-coupon token, so the price should fall by roughly the accrued interest",
        "They split it; price rises",
        "The issuer keeps it; price unchanged",
      ],
      answer: 1,
      explain: "The record-date snapshot fixes eligibility. The seller keeps the coupon and the buyer gets a clean-price asset — the bond market's clean/dirty logic transplanted on-chain.",
    },
    {
      q: "Which statement about the operational cost of the three distribution models is correct?",
      options: [
        "Airdrops are cheapest on gas since it's one transaction",
        "Accumulating requires a monthly snapshot",
        "Airdrop gas grows linearly with holder count and needs a snapshot; accumulating has no distribution transaction and no snapshot but shifts the entire load onto the accuracy of the NAV feed",
        "Rebase requires no on-chain transactions at all",
      ],
      answer: 2,
      explain: "Each costs differently: airdrops pay in gas and snapshots, rebase pays in integrator adaptation, accumulating is cheapest to operate but wholly dependent on the feed (all of Stage 8.2's heartbeat, deviation, and front-running issues apply).",
    },
    {
      q: "The borrower misses a coupon payment. What should happen on-chain?",
      options: [
        "The smart contract automatically seizes the borrower's assets and compensates holders",
        "The tokens are automatically burned",
        "A grace period runs; past it, an oracle writes a 'default' event on-chain, triggering pause/write-down, while actual recovery follows off-chain legal process and the payment waterfall",
        "Nothing — a chain cannot reflect a default",
      ],
      answer: 2,
      explain: "A default determination is an off-chain fact that must be fed on-chain (Stage 8.1). Tokens can't resolve a default automatically; they only reflect the outcome of the off-chain legal process (Stage 5.4's waterfall).",
    },
    {
      q: "Why does withholding tax often push issuers back toward transfer-agent-mediated distributions?",
      options: [
        "Because on-chain transfers are too expensive",
        "Because the withholding rate depends on each holder's tax residency and treaty position — a per-holder legal determination with liability attached — which purely anonymous on-chain payouts cannot perform",
        "Because regulators prohibit on-chain distributions",
        "Because transfer agents charge less",
      ],
      answer: 1,
      explain: "The same coupon is withheld differently across jurisdictions. That requires on-chain identity (Stage 6.3) and an entity that carries the legal liability — anonymous addresses can't supply either.",
    },
    {
      q: "Why is half of an RWA platform's moat said to live in distribution operations?",
      options: [
        "Because distributions carry the highest margin",
        "Because the bulk of ops cost is fixed (strong economies of scale), and a track record of years of error-free, regulator-visible operation cannot be copied — contracts and legal structures can be replicated; time and reputation cannot",
        "Because regulators require platforms to build their own distribution systems",
        "Because smart contracts can't handle distributions",
      ],
      answer: 1,
      explain: "Operations are a recurring human cost and the main destination of the management fee (0.15%–0.5%); fixed costs plus scale effects compound the leaders, while an operating record is purely a product of time (Stage 10.6, Stage 13.2).",
    },
  ],

  further: [
    { label: "Securitize: BUIDL product page (daily accrual, monthly payment in new tokens)", url: "https://securitize.io/blackrock/buidl" },
    { label: "Ondo Finance docs (OUSG's accumulating model)", url: "https://docs.ondo.finance/" },
    { label: "ERC-4626 specification (share/asset conversion — how yield shows in NAV)", url: "https://eips.ethereum.org/EIPS/eip-4626" },
    { label: "OpenZeppelin: ERC-20 checkpoints/votes implementation (snapshots & historical balances)", url: "https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20Votes" },
    { label: "Investor.gov: ex-dividend dates (record date / ex-date basics)", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/ex-dividend-dates-understanding-dividend-risk" },
  ],
};
