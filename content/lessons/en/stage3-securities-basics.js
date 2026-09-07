export default {
  id: "securities-basics",
  stage: 3,
  order: 1,
  title: "What a Security Is: Stocks, Bonds & Claims on Future Cash Flows",
  difficulty: "core",
  prereqs: [],

  oneLiner:
    "A security is, at bottom, a **tradable claim on future cash flows**: a stock is “a share of whatever profit is left over,” a bond is “principal and interest on a fixed schedule.” Price is just the market's grade on the present value of that stream — so when rates rise, old bonds must fall; that's arithmetic, not opinion. And “security” has a second identity: it's a **regulatory category**, and a token representing a share is a security no matter what technology wraps it. Master this lesson and your first reflex on any RWA yield becomes: a claim on which cash flows, standing where in line?",

  intuition: `
Imagine a friend opens a bubble-tea shop and asks you for $100,000. He offers two deals.

**Deal A**: “This buys you in — 20% of the shop is yours. If we profit, a fifth of it is yours; if we lose, we lose together.” — You get a certificate for **sharing future profits**: no ceiling, no floor.

**Deal B**: “This is a loan. I pay you $8,000 a year in interest, and in five years I return your $100,000. Whether the shop booms or limps is not your problem — as long as it's alive, I pay on schedule.” — You get a **fixed timetable**: when, and how much, in black and white.

Now write those two IOUs in a standard format so they can be resold to strangers — and a **security** is born. Deal A is a **stock (equity)**; Deal B is a **bond**. Wall Street's hundreds of trillions, stripped of jargon, is the industrialized version of those two bubble-tea IOUs.

Why does this lesson matter so much for RWA? Because **the things that get tokenized are overwhelmingly securities, or security-like claims**: tokenized Treasuries are bond claims (Stage 3.2), tokenized fund shares are bundles of claims (Stage 3.3), private-credit tokens are loan claims (Stage 3.5). The chain is merely a new way of keeping the books; **what's written in the books is still this lesson**. If you can't read a cash-flow claim, you can only buy RWA on vibes — and this whole course exists to replace trust-by-vibes with trust-by-evidence.

**Here's the map — five parts:**

- **① A security = a tradable claim on future cash flows**
- **② Equity vs debt: the leftovers, or the timetable**
- **③ Bond anatomy, and the price↔yield inverse you must internalize**
- **④ The risk–return spectrum, and funds as bundled claims**
- **⑤ The second meaning of “security”: a regulatory category**
`,

  mechanics: `
### ① A security = a tradable claim on future cash flows

A tighter definition: **a security is a standardized, transferable legal instrument whose content is “a share of certain future cash flows belongs to the holder.”** Three keywords, none optional:

- **Future cash flows**: dividends, interest, rent, principal repayment — a security's value comes not from the paper but from the stream of future money it points at.
- **Claim**: not “owning the tea machine,” but “the right to be paid as agreed.” Stage 5.1 expands this distinction into an entire lesson — you never buy the asset itself, you buy a claim on it.
- **Tradable**: the instrument is standardized (every share identical, every bond identical), so it can be sold to strangers. An IOU you can't transfer is just an IOU; an IOU you can transfer is the raw material of markets.

From this follows the first principle of valuation: **what a security is worth today = the sum of all its future cash flows, discounted back to the present**. We discount because next year's $100 is worth less than today's $100 — today's money could be earning the ~4% risk-free rate in the meantime (Stage 3.2). It sounds bland, but this single idea is the engine of this lesson and the entire fixed-income world; in ③ we run real numbers through it.

### ② Equity vs debt: the leftovers, or the timetable

**Stock (equity)**: one slice of ownership in a company. The holder gets — **profit sharing** (the company may pay profits out per share as **dividends**, or retain and reinvest them), **votes** (electing the board, approving major decisions), and, most importantly, the **residual claim**. “Residual” means: in a liquidation, taxes, wages, and every creditor get paid first, and shareholders get **what's left**. What's left is frequently zero.

**Bond**: a standardized loan. The holder gets a **fixed timetable**: a **coupon** every year (or half-year), and the **face value** — the principal — back at maturity. No votes, no share of profits — but **seniority over equity**: the company pays its debts before its shareholders.

One-line contrast: **bondholders get “certain but capped”; shareholders get “uncertain but unlimited.”** If the company booms, creditors still get only the agreed interest while shareholders eat the entire upside; if it fails, creditors recover first from the remains (perhaps 40 or 60 cents on the dollar) while shareholders usually get zero.

<figure>
<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <text x="320" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">The waterfall: a company's money flows down by seniority</text>
  <rect x="230" y="38" width="180" height="34" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="320" y="60" text-anchor="middle" font-size="12" fill="var(--orange-ink)">Company cash / liquidation value</text>
  <line x1="320" y1="72" x2="320" y2="94" stroke="var(--line)" stroke-width="2" marker-end="url(#securities-basics-arr)"/>
  <rect x="60" y="96" width="520" height="30" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="72" y="116" font-size="11" fill="var(--ink)">1st in line: taxes, wages, secured creditors (they hold collateral)</text>
  <line x1="320" y1="126" x2="320" y2="142" stroke="var(--line)" stroke-width="2" marker-end="url(#securities-basics-arr)"/>
  <rect x="60" y="144" width="520" height="30" rx="6" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="72" y="164" font-size="11" fill="var(--ink)">2nd in line: unsecured bondholders — coupons + principal, ahead of equity</text>
  <line x1="320" y1="174" x2="320" y2="190" stroke="var(--line)" stroke-width="2" marker-end="url(#securities-basics-arr)"/>
  <rect x="60" y="192" width="520" height="30" rx="6" fill="var(--red-soft)" stroke="var(--line)"/>
  <text x="72" y="212" font-size="11" fill="var(--ink)">3rd in line: shareholders — the residual claim, “whatever's left,” often zero</text>
  <defs><marker id="securities-basics-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--muted)"/></marker></defs>
</svg>
</figure>

From now on, your first expert question about any RWA is this picture: **which layer of the waterfall does my token sit in?** In the same real-estate deal, a “senior debt token” and a “junior equity token” are entirely different animals — and both may be marketed as “XX Property Yield Token.”

### ③ Bond anatomy, and the price↔yield inverse

A bond has four parameters — memorize them: **face value** — the principal returned at maturity, typically $1,000 or $100; **coupon rate** — annual interest as a percentage of face, so 5% on $100 face means $5 a year; **maturity** — the date the principal comes home; **price** — what it sells for in the market right now. The first three are printed on the bond and never change; **only the price moves every day**.

Now derive the inverse relationship. You hold a bond: $100 face, 5% coupon ($5 a year), 10 years left. Today the market shifts — **newly issued bonds of the same kind pay 6%**. Can you still sell your “$5-a-year” bond for $100?

No. A buyer reasons: $100 buys a new bond paying $6 a year — why would I pay $100 for yours that pays $5? You must **cut the price** until the buyer's actual return on your old bond also works out to 6%. Cut to what? Run the discounting formula for real — divide each future cash flow by (1+r) raised to its year, with r at the new market rate of 6%:

> Price = 5/1.06 + 5/1.06² + … + 5/1.06¹⁰ + 100/1.06¹⁰ = 5 × 7.3601 + 100 × 0.5584 ≈ **$92.64**

Run it the other way: if market rates fall to 4%, your bond that “locked in 5%” becomes desirable, and its price rises to 5 × 8.1109 + 100 × 0.6756 ≈ **$108.11**. That is **price and yield moving inversely**: rates up → existing bond prices down; rates down → existing bond prices up. Not sentiment — division.

This also introduces **yield to maturity (YTM)**: given the current price, the actual annualized return of holding to maturity — the r that makes the discounting equation balance. Buy at $92.64, collect $5 for 10 years plus the final $100, and your YTM is exactly 6%. When people say “this bond yields X,” they mean YTM. **Remember this inverse relationship — in Stage 4.3, it literally topples a bank** (Silicon Valley Bank loaded up on long bonds, rates spiked, paper losses gaped, a run began, the bank died in 48 hours — and dragged USDC off its peg on the way down).

### ④ The risk–return spectrum, and funds as bundled claims

Yields across securities aren't random; they form a **price scale for risk**. Rough markings as of 2025 (annualized, orders of magnitude):

- **US Treasury bills (T-bills)**: ~4–5%. The “risk-free rate,” the market's horizon line (Stage 3.2 is devoted to it).
- **Investment-grade corporate bonds (IG)**: ~5–6%. Apple- and Microsoft-grade borrowers, paying a small “credit spread” over Treasuries.
- **High-yield bonds (HY, a.k.a. junk)**: ~7–9%+. Default risk you can see with the naked eye; the spread is the market's quote on that probability.
- **Equities (long-run average)**: ~8–10%, with **violent year-to-year swings** (−30% to +30% is normal) — compensation for standing at the bottom of the waterfall.
- **Venture capital**: higher expected returns, but most individual bets go to zero.

The scale hands you a fraud detector: **when someone pitches “a safe, steady 15%,” they haven't discovered a new continent — they've hidden a risk you can't see (credit? liquidity? fraud?) inside the quote**. Stage 12.4 turns that one sentence into a full yield-dissection methodology.

A single claim concentrates risk, hence **diversification** and the **fund**: pour hundreds or thousands of securities into one pool, slice the pool into shares, and sell you the shares — **a fund share is itself a security, a “claim on claims.”** How it's priced daily (NAV), who computes it, and how subscriptions and redemptions work is the business of Stage 3.3; for now just note that BUIDL and BENJI (Stage 10.1), which you'll meet later, are legally exactly this: fund shares.

### ⑤ The second meaning of “security”: a regulatory category

So far “security” has been a financial concept. The word carries a second meaning that matters even more for this course: **it is a legal/regulatory category**. The moment something is deemed a security, a whole apparatus of obligations drops onto it — the offering must be **registered or fit an exemption**, investors must receive **disclosure**, sellers must be **licensed**, secondary venues are regulated. This regime (US securities law) was born after the 1929 crash, and its core logic is: **if you sell the public a promise of future money, you must show your cards first**.

The keystone case is the 1946 **Howey test**: if there is ① an investment of money, ② in a common enterprise, ③ with an expectation of profit, ④ derived from the efforts of others — it is an “investment contract,” hence a security, **whether it looks like an orange-grove contract or a token**. Therefore: a token representing company shares is a security; a token representing a bond is a security; swapping the tech stack for a blockchain **changes the regulatory classification by exactly zero**. This is why the RWA world is full of whitelists, accredited-investor gates, and transfer restrictions (Stages 6 and 7) — not issuer stinginess, but securities law projected onto tokens. The full dissection of Howey and the Reg D/S exemption lanes waits in Stage 11.1.

If you take away one sentence: **whenever an RWA yield lands in front of you, ask “a claim on which cash flows, standing where in line?” — and never touch a yield that can't answer.**
`,

  demo: "cashflow-machine",

  analogy: `
Think of securities as **three ways to sell a fruit tree**.

First way: sell you **20% of the tree itself**. Whatever it bears each year, a fifth is yours — bumper years you feast, blight years you get nothing, and if the tree dies you lose everything; but if it grows into a prized centenarian, your fifth grows with it. That's **equity**.

Second way: sell you an **IOU written by the orchard**: no matter the harvest, you get 50 pounds of fruit every autumn, and your principal back in ten years. In bumper years you envy the shareholders' dividends; in drought years you're glad of your guarantee — and even if the orchard collapses, the proceeds of selling the trees go **to IOU holders first**. That's a **bond**.

Third way: one tree feels too concentrated, so you join a fruit cooperative: it buys shares and IOUs across a hundred orchards on behalf of a thousand members, and slices the whole pool into ten thousand **co-op units**. You no longer hold a particular tree, but “one slice of a claim on a basket of trees.” That's a **fund**.

All three certificates can change hands — and the resale price forever swings on two things: **how much fruit this tree is expected to bear** (cash-flow expectations), and **what fruit is fetching elsewhere right now** (market interest rates). When everyone else's new IOUs pay 60 pounds, your old 50-pound IOU only sells at a discount. The entire securities market is these three orchard certificates, scaled up astronomically.
`,

  misconceptions: [
    "“Stocks and bonds are basically the same — just investments with different risk levels.” —— They are structurally different claims: equity is an uncapped, unguaranteed residual claim plus votes; debt is a fixed timetable with seniority. In the same bankruptcy, creditors may recover half while shareholders get zero — “basically the same” puts you on the wrong layer of the waterfall.",
    "“Rising rates are good for bondholders — more interest!” —— Newly bought bonds do pay more, but the price of the bonds **you already hold** must fall: an old bond paying $5 a year can only sell at a discount in a world where new ones pay $6 ($100 face drops to about $92.64). Price and yield move inversely — it's discounting arithmetic, not mood.",
    "“Bonds return your principal, so they're risk-free.” —— Bonds carry at least three risks: default (the issuer can't pay), interest-rate risk (rates rise, prices fall, and a forced mid-life sale locks in the loss — that's how the bank in Stage 4.3 died), and inflation (fixed coupons lose purchasing power). “Held to maturity without default” is the only case where face value comes home.",
    "“A 15% product just pays better — go for it.” —— Yield is the price tag of risk. When the risk-free benchmark is 4–5%, the extra 10 points must correspond to some risk: credit, liquidity, structure, or fraud. Not seeing the risk doesn't mean it's absent — it means it's well hidden.",
    "“A token isn't a stock — issue it on a blockchain and securities law can't touch it.” —— Howey looks at economic substance, not technological wrapping: money invested, common enterprise, expected profit from others' efforts = security. A token representing shares or debt is a security, and the whitelists and transfer restrictions of Stages 6–7 are precisely securities law projected on-chain.",
  ],

  quiz: [
    {
      q: "What is the essential definition of a security?",
      options: ["An electronic asset listed on an exchange", "A standardized, transferable claim on future cash flows", "Anything that can go up in value", "A government-issued license to invest"],
      answer: 1,
      explain: "Three elements, none optional: future cash flows, a claim (not direct ownership of the asset), and transferability (standardization is what lets it be sold to strangers).",
    },
    {
      q: "In a corporate liquidation, who comes first — unsecured bondholders or shareholders?",
      options: ["Shareholders, because they are the owners", "Both share pro-rata at the same time", "Bondholders are paid first; shareholders take the residue — often zero", "Whoever files a claim first"],
      answer: 2,
      explain: "Equity is the residual claim: taxes, wages, and all debts are settled before shareholders see a cent. That is exactly the risk equity's higher return compensates for.",
    },
    {
      q: "You hold a $100-face, 5%-coupon bond with 10 years left. Market rates rise from 5% to 6%. Your bond's price…",
      options: ["Stays put — face value is fixed", "Rises, because the rate environment improved", "Falls to about $92.64, so a buyer's actual return also reaches 6%", "Becomes void"],
      answer: 2,
      explain: "Discounting: Σ 5/(1.06)^t + 100/(1.06)^10 ≈ $92.64. A bond paying only $5 must be marked down to compete with new bonds paying $6.",
    },
    {
      q: "An RWA product advertises “a safe, steady 15% APY” while T-bills pay 4.5%. The expert's first reaction is…",
      options: ["Buy — it beats Treasuries by 10 points", "The excess yield must correspond to some hidden risk (credit / liquidity / structure / fraud) — find it before anything else", "15% means the team works harder", "The risk-free rate doesn't apply to crypto"],
      answer: 1,
      explain: "Yield is the price of risk. Anything above the risk-free benchmark is payment for bearing something — and when you can't find the something, it is very often fraud.",
    },
    {
      q: "A token on-chain represents shares of a company. What is it, in regulatory terms?",
      options: ["A cryptocurrency, governed by crypto rules", "A security — Howey looks at economic substance, not technology; registration, disclosure and licensing obligations apply as usual", "Not a security if labeled “experimental use only”", "It depends on which chain is used"],
      answer: 1,
      explain: "“Security” is a legal category: money invested in a common enterprise with profit expected from others' efforts. The tech wrapper changes nothing — this is the premise behind the entire RWA compliance stack (Stages 6, 7, 11).",
    },
  ],

  further: [
    { label: "Investor.gov: Stocks (the SEC's official primer)", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks" },
    { label: "Investor.gov: Bonds (elements and risks, official version)", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds" },
    { label: "FINRA: Bonds — yield, price and their inverse relationship", url: "https://www.finra.org/investors/investing/investment-products/bonds" },
    { label: "SEC: Framework for “Investment Contract” Analysis of Digital Assets (Howey applied to tokens; Stage 11.1 preview)", url: "https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets" },
  ],
};
