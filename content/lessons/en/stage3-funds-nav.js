export default {
  id: "funds-nav",
  stage: 3,
  order: 3,
  title: "Funds & NAV: The Once-a-Day Price per Share",
  difficulty: "core",
  prereqs: ["securities-basics"],

  oneLiner:
    "A fund is a container that pools a basket of securities and slices it into shares; NAV (net asset value per share) = (total assets − total liabilities) ÷ shares outstanding, computed once a day by an independent fund administrator, with all subscriptions and redemptions executing at that number. Around the pool stand five mutually checking roles — manager, administrator, custodian, transfer agent, auditor — five separate firms, so no single one can lie about your money. Tokenization absorbs one or two of these roles (the chain can literally be the shareholder register) but cannot absorb the others: somebody still has to actually hold the T-bills and actually compute the NAV. The skeleton of BUIDL and BENJI is this lesson's money market fund.",

  intuition: `
Last lesson ended by calling a fund share “a claim on claims.” Now let's open the box and watch the machine run.

Start with a felt problem: you and nine friends pool $1 million into a basket of bonds, splitting by contribution. Three months later someone wants out, and a newcomer wants in — **how much should the leaver take? What should the newcomer pay per share?** You can't wing it: the bonds reprice daily, and yesterday's prices are unfair to both sides today. You need a **daily-updated price per share that everyone accepts**.

That price is the **NAV (Net Asset Value per share)**. Tens of trillions of dollars of mutual funds and money market funds perform the same ritual after every close: mark everything in the basket to market, subtract what's owed, divide by the share count — producing a number to four decimal places. Every subscription and redemption that day **executes at exactly that number**.

But a second, deeper question follows immediately: **who computes that number?** If the fund manager computes it himself, he can nudge losing positions “a little higher,” bury bad performance, and collect bigger fees — history offers a long queue of people who did exactly that. So traditional fund-land evolved a **separation of powers**: the one who counts, the one who keeps the money, the one who keeps the register, the one who makes decisions, and the one who checks the books yearly are **five different institutions**. That seemingly bloated structure is the entire reason you dare hand money to a fund run by strangers.

Why must an RWA learner understand this machine? Because **tokenized Treasury funds (BUIDL, BENJI — Stage 10.1) are legally money market funds or their close kin** — the token is just a new costume for the share. And “which of the five roles did tokenization actually rewire” is the central question for judging whether an RWA project is sound.

**Here's the map — five parts:**

- **① A fund = a pool of claims, sliced into shares**
- **② The NAV algorithm: a once-a-day accounting ritual**
- **③ The five roles: why no single firm can lie**
- **④ Money market funds and “breaking the buck”**
- **⑤ Fees, NAV vs market price, and what tokenization rewrites**
`,

  mechanics: `
### ① A fund = a pool of claims, sliced into shares

A **fund** is a **pooled investment vehicle**: an independent legal entity (a company, trust, or limited partnership) issues **shares (units)** to investors and deploys the proceeds into a **portfolio** according to a stated strategy. You don't hold any particular bond in the basket — you hold a **pro-rata claim on the whole pool**. Last lesson's waterfall logic applies unchanged; only the underlying became a basket.

Shares move in and out under two regimes, and the difference matters enormously: an **open-end** fund lets you **subscribe** for new shares and **redeem** old ones against the fund itself at any time — the share count breathes daily, and the deal price is that day's NAV. A **closed-end** fund has a fixed share count; you can only find a buyer on the secondary market, where the price floats freely — above NAV (premium) or below it (discount). Pin that thread for ⑤. Mutual funds and money market funds are open-end; the ETF is a hybrid (primary-market creation/redemption near NAV, continuous secondary trading).

### ② The NAV algorithm: a once-a-day accounting ritual

The formula fits on one line: **NAV = (total assets − total liabilities) ÷ shares outstanding**. Run a mini money market fund through it with real numbers:

- Assets: T-bills marked to market $62.0M + overnight repo $25.0M + cash $10.5M + **accrued interest** (interest earned but not yet received) $2.6M = **$100.1M**
- Liabilities: management fees payable $0.1M
- Shares: 100 million
- **NAV = (100,100,000 − 100,000) ÷ 100,000,000 = $1.0000**

A few details, each a real-world trap: valuation uses **mark to market**, not purchase cost — bond moves must show up daily (Stage 3.2's inverse relationship rewrites this number every day); **accrued interest counts** — interest “grows” day by day rather than materializing on coupon day; and the computation happens **once a day**, usually after 4 p.m. New York time, so every order that day queues for the same single number — **you don't know your execution price when you place the order** (the industry calls it forward pricing, blocking anyone from arbitraging a known price).

Dealing at NAV means an open-end fund's share price is always **fair**: newcomers buy at today's true per-share value, leavers exit at the same value, nobody skims anyone — provided the NAV itself is computed honestly. Which brings us to:

### ③ The five roles: why no single firm can lie

Traditional funds split the critical functions across **five mutually independent institutions**:

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <text x="320" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">A fund's five-role cast: separated powers, hence trust</text>
  <rect x="245" y="120" width="150" height="44" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="320" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="var(--orange-ink)">The fund (legal entity)</text>
  <text x="320" y="153" text-anchor="middle" font-size="9" fill="var(--muted)">holds the portfolio · issues shares</text>
  <rect x="30" y="40" width="170" height="48" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="115" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">Manager</text>
  <text x="115" y="74" text-anchor="middle" font-size="9" fill="var(--muted)">decides what to buy and sell</text>
  <rect x="440" y="40" width="170" height="48" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="525" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">Administrator</text>
  <text x="525" y="74" text-anchor="middle" font-size="9" fill="var(--muted)">independent valuation · daily NAV</text>
  <rect x="30" y="200" width="170" height="48" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="115" y="218" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">Custodian</text>
  <text x="115" y="234" text-anchor="middle" font-size="9" fill="var(--muted)">physically holds assets (BNY etc.)</text>
  <rect x="440" y="200" width="170" height="48" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="525" y="218" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">Transfer Agent</text>
  <text x="525" y="234" text-anchor="middle" font-size="9" fill="var(--muted)">keeps the register · handles subs/redemptions</text>
  <rect x="245" y="256" width="150" height="38" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="272" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">Auditor</text>
  <text x="320" y="286" text-anchor="middle" font-size="9" fill="var(--muted)">independent annual check</text>
  <line x1="200" y1="70" x2="252" y2="122" stroke="var(--line)" stroke-width="1.5"/>
  <line x1="440" y1="70" x2="388" y2="122" stroke="var(--line)" stroke-width="1.5"/>
  <line x1="200" y1="218" x2="252" y2="160" stroke="var(--line)" stroke-width="1.5"/>
  <line x1="440" y1="218" x2="388" y2="160" stroke="var(--line)" stroke-width="1.5"/>
  <line x1="320" y1="256" x2="320" y2="166" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 3"/>
</svg>
</figure>

- **Manager**: makes the investment decisions — which bond, when. Collects the management fee and the fame (BlackRock, Franklin Templeton).
- **Administrator**: **independent of the manager**, values the holdings, computes the daily NAV, keeps the accounting books. This is ②'s “who computes it” answer — **not the manager**.
- **Custodian**: physically holds the assets. The bonds sit in accounts at the custodian (BNY Mellon, State Street); the manager can only send instructions, never touch the money — so running off with the pot fails at the custodian's door (contrast: FTX misused customer assets precisely because it was exchange and custodian in one body — Stage 3.4).
- **Transfer agent**: keeps the **shareholder register** — who holds how many shares — and processes subscriptions, redemptions, and distributions. Legally, that register is the final proof that you are a shareholder.
- **Auditor**: checks independently once a year — are the assets really there? Was NAV computed correctly?

The design philosophy in one line: **make lying require a five-firm conspiracy instead of one firm's impulse**. Manager wants to inflate performance? The administrator's valuations won't cooperate. Wants to divert assets? They're at the custodian. Wants to doctor your holdings? The register lives with the transfer agent. It is not the most efficient structure — it is the structure with the **lowest cost of trust**. Keep these five roles handy: they all return in Stage 13.1 when you assemble a tokenization platform.

### ④ Money market funds and “breaking the buck”

The **Money Market Fund (MMF)** is a specialized open-end species: it buys only ultra-short, ultra-safe assets (T-bills, repo, top-tier commercial paper), aiming to **pin NAV at $1.00** — so the share behaves like “cash that earns interest.” US MMFs total over $6 trillion as of 2025.

The $1.00 pin relies on two tricks: on the asset side, holding only nearly motionless paper with a few dozen days of duration; on the accounting side, (for government MMFs) **amortized-cost** accounting that rounds tiny wobbles into $1.00. But “nearly motionless” is not “motionless” — when true per-share value drops below $0.995, rounding gives way, and the fund **breaks the buck**.

It has happened only a handful of times, most famously the **Reserve Primary Fund in September 2008**: it held $785 million of Lehman Brothers commercial paper, Lehman went bankrupt, the paper went to zero that week, and the NAV printed **$0.97**. The shock of “money funds can lose money” triggered an industry-wide run — hundreds of billions redeemed from institutional MMFs within days — forcing the US Treasury to guarantee the entire industry. The reforms that followed bolted **liquidity gates and redemption fees** onto MMFs: in extremis, redemptions can be suspended. Memorize the shape of this case: **NAV down 3% → run → gates**. Stage 4.3's USDC depeg is nearly the same script, refilmed with a stablecoin.

Why this section matters so much: **BUIDL and BENJI are the direct descendants of the money market fund** — same assets (T-bills/repo), same $1 target, same daily NAV, except the shares are recorded on-chain and the yield lands in your address daily (Stage 10.1). Understand the MMF, and those two flagship products hold no secrets.

### ⑤ Fees, NAV vs market price, and what tokenization rewrites

**Fees** are quoted in bp: management fees for MMFs and tokenized Treasury funds typically run **15–50bp**, accrued daily out of the pool (that's the “fees payable” liability in ②). Fees come straight out of yield; NAV is a **net-of-fees** value.

**NAV vs market price**: open-end funds deal at NAV, so price naturally hugs net value. But once shares can only change hands on a secondary market (closed-end funds — or **tokens with restricted redemption**), market price and NAV part ways: closed-end funds trading at 5–15% discounts for years is routine. This crack is a core RWA question: tokens trade 24/7 while NAV updates once a day — **what force keeps price glued to NAV?** The answer (subscription/redemption arbitrage) lives in Stage 9.4.

**What tokenization rewrites**: hold the five-role cast from ③ up to the light. The **transfer agent** is first to be absorbed: a shareholder register is at bottom a table of “who holds how much,” and that is precisely what a blockchain is; in Delaware, Wyoming, Luxembourg and a few other jurisdictions, the on-chain record can already serve as the legal register (Stage 5.3). Subscription/redemption workflows can likewise become smart contracts. But **the custodian and the administrator cannot be absorbed by the chain**: the T-bills live in off-chain custody accounts, and somebody must actually hold them; NAV is a valuation of off-chain assets that the chain cannot compute for itself — the administrator computes it and “feeds” it on-chain (the NAV oracles of Stage 8.2). The **auditor** is equally unremovable — the chain can prove the token ledger, never the Treasury ledger.

If you take away one sentence: **NAV is not a market price — it's a once-a-day accounting ritual. Tokenization can move the register and the subscription flow on-chain, but “who holds the assets” and “who computes the value” forever point at institutions off-chain.**
`,

  demo: "nav-calculator",

  analogy: `
Think of an open-end fund as a **communal pot of broth** everyone brews together.

Each person adds ingredients (subscribes) and receives “broth tickets” at **that moment's concentration**; anyone leaving (redeeming) converts tickets back into broth at the same day's concentration. Concentration is the NAV — and it must be measured daily, or the morning contributor and the evening contributor get unfair tickets.

The problem is who measures. The head chef (manager) knows the pot best, but let him self-report and he has ten thousand reasons to overstate the concentration — the tickets look more valuable, and his “culinary fee” rises with them. So this kitchen has a rule: **the one who stirs never touches the scale**. An independent lab tech (the administrator) measures; the pot itself is locked in the storekeeper's vault (the custodian), and the chef can only shout instructions through the hatch — “add two pounds of beef bone”; who owns how many tickets is written in the bookkeeper's ledger (the transfer agent); and at year-end an inspector (the auditor) reconciles vault against ledger. Five people, five firms — **cheating requires convincing the other four**.

“Breaking the buck” is the pot advertised as “forever constant concentration” — until one day the lab tech finds a bad batch of bones (Lehman paper) and the concentration honestly reads 0.97. Word gets out, everyone crowds the hatch to cash in tickets, and the kitchen nails boards over it (redemption gates).

What does tokenization change? The bookkeeper's ledger becomes a public on-chain one — genuinely faster and more transparent. But **the broth is still in the vault, and the concentration still needs the lab tech**. If anyone tells you that going on-chain removes the lab tech and the vault too — grip your broth tickets tighter.
`,

  misconceptions: [
    "“Fund shares reprice continuously, like stocks.” —— Not open-end funds. NAV is computed once daily (after the close), every order that day executes at that same NAV, and you don't know your price when you place the order (forward pricing). Continuous prices belong to exchange-traded stocks and ETFs — and this distinction is the starting point of Stage 9.4's question of how a token's price stays glued to NAV.",
    "“The fund manager computes the NAV.” —— Precisely not, and the “not” is the whole point: NAV comes from the independent administrator, assets sit with the custodian, the register lives with the transfer agent. The manager makes investment decisions and touches neither money nor books. Letting him compute NAV is letting the chef self-report the broth's concentration.",
    "“A money market fund is a deposit — $1 is always $1.” —— An MMF is an investment, not a deposit, with no deposit insurance. In 2008 Reserve Primary's Lehman paper drove NAV to $0.97, triggering an industry-wide run stopped only by a Treasury backstop. The $1.00 is a target plus accounting technique, not a legal promise.",
    "“After tokenization, smart contracts can replace all five roles.” —— Only the register (transfer agent) and the subscription/redemption flow are the chain's home turf; asset custody and NAV computation are inherently off-chain work — Treasuries don't live on-chain, and valuation needs off-chain market prices. Sorting “which roles were truly absorbed vs merely re-costumed” is the core due-diligence move on any RWA project (Stages 8.2, 13.1).",
    "“A fund holds a basket of bonds, so it's protected and can't lose money.” —— Diversification blunts single-issuer blowups, not systemic risk: when rates rise, the entire basket falls together and NAV falls with it. Bond funds broadly losing 10%+ in 2022 is the proof. The pool averages out “one grenade,” not “rain over the whole field.”",
  ],

  quiz: [
    {
      q: "A fund has $100.1M of assets, $0.1M of liabilities, and 100 million shares outstanding. Its NAV is…",
      options: ["$1.0010", "$1.0000", "$0.9990", "$100.10"],
      answer: 1,
      explain: "(100,100,000 − 100,000) ÷ 100,000,000 = $1.0000. Don't forget the liabilities: fees payable come off first.",
    },
    {
      q: "Why must the NAV be computed by the administrator rather than the fund manager?",
      options: ["Administrators are better at math", "Conflict of interest: a manager has every incentive to overvalue holdings to flatter performance and fees; independent computation makes fraud require collusion", "Managers are legally barred from using calculators", "Managers are too busy"],
      answer: 1,
      explain: "The five-way separation (manager / administrator / custodian / transfer agent / auditor) exists so that no single firm can lie to investors about their money.",
    },
    {
      q: "What directly caused Reserve Primary Fund to “break the buck” in 2008, and what followed?",
      options: ["Rising rates dented its T-bills; consequences were mild", "Its Lehman commercial paper went to zero and NAV printed $0.97; an industry-wide MMF run followed, ended by a Treasury guarantee", "The manager absconded; investors lost everything", "The auditor miscomputed NAV; a recount fixed it"],
      answer: 1,
      explain: "The shock of “$1 is no longer $1” triggered hundreds of billions in redemptions — the NAV-dip → run → gates script that replays with USDC in Stage 4.3.",
    },
    {
      q: "Which of the five roles does tokenization absorb most directly?",
      options: ["The custodian — the chain can hold Treasuries", "The administrator — smart contracts auto-compute NAV", "The transfer agent — a shareholder register is a “who holds how much” table, and the chain is that table (already legally recognized in some jurisdictions, Stage 5.3)", "The auditor — on-chain data needs no audit"],
      answer: 2,
      explain: "The register and the subscription/redemption flow are the chain's home turf; custody and off-chain valuation cannot move on-chain — only their results can be fed there (Stage 8.2).",
    },
    {
      q: "Open-end funds deal at NAV; closed-end fund shares only trade secondary. What typically happens to the latter?",
      options: ["Price always equals NAV", "Price can drift from NAV for years (5–15% discounts are common) — exactly the problem facing RWA tokens that can only trade secondary", "Closed-end funds don't compute NAV", "Closed-end funds yield more"],
      answer: 1,
      explain: "Without subscription/redemption arbitrage pulling price back to net value, market price and NAV part ways. Restrict a token's redemption and the same discount ghost appears — mechanics in Stage 9.4.",
    },
  ],

  further: [
    { label: "Investor.gov: Net Asset Value (the official definition)", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/net-asset-value" },
    { label: "Investor.gov: Mutual Funds and ETFs (fund mechanics and risks)", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etfs" },
    { label: "SEC: Reserve Primary Fund enforcement release (2009)", url: "https://www.sec.gov/news/press/2009/2009-104.htm" },
    { label: "ICI: Investment Company Fact Book (industry size and structure)", url: "https://www.ici.org/research/stats" },
  ],
};
