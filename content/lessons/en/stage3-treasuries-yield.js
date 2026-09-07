export default {
  id: "treasuries-yield",
  stage: 3,
  order: 2,
  title: "Treasuries & Yield: Why T-Bills Rule RWA",
  difficulty: "core",
  prereqs: ["securities-basics"],

  oneLiner:
    "The US Treasury market is roughly $28 trillion — the deepest asset pool on Earth — and its yield is the horizon line the whole market treats as the “risk-free rate.” In 2022–23 the Fed hauled rates from 0 to 5.25%, and idle cash suddenly earned real money: stablecoin issuers sat on $100B+ of T-bills and kept every cent of interest, while the entire tokenized-Treasury category is one sentence — hand the T-bill yield back to the token holder, minus 15–50 basis points. So the engine of RWA's biggest category isn't the blockchain; it's the rate cycle itself. When the tide (rates) recedes to zero, the engine stalls.",

  intuition: `
In 2021, $1,000,000 sitting in your account earned about… a few hundred dollars a year. Rates were near zero; cash was dead money, and nobody cared where it slept.

In 2023, the same million, parked in three-month US Treasury bills, threw off **more than $50,000 a year** — for doing nothing beyond lending to the US government for three months at a time and rolling it over. Rates going from 0 to 5.25% turned “where does idle cash sit” from a boring question into a 5%-a-year question.

Now look at an absurdity of that moment: you hold 100,000 USDC. Circle turns your 100,000 into T-bills, collects $5,000 a year in interest — **and pays you zero**. As of 2025, stablecoin issuers collectively hold over a hundred billion dollars of short-term Treasuries, swallowing billions in annual interest while holders get nothing. That arbitrage — “the interest on other people's money is mine” — is the business model of the entire stablecoin industry (dissected in Stage 4.1).

Which makes an obvious business jump out: **issue a token backed by the same T-bills, but pass the interest to the holder** — keeping only a 0.15%–0.5% management fee. That is the tokenized Treasury fund (BUIDL, BENJI, OUSG — Stage 10.1), roughly $7–8 billion by late 2025, the largest RWA category outside stablecoins. Its reason to exist is **built entirely on interest rates**. So in this lesson we nail down Treasuries, discounting, yield, and the rate cycle in one pass — the key that unlocks half the RWA map.

**Here's the map — five parts:**

- **① The $28 trillion “horizon line”: the Treasury market and the risk-free rate**
- **② T-bill anatomy: no coupon — sold at a discount**
- **③ The great rate swing: from 0 to 5.25%, then back toward 4%**
- **④ Who eats the yield: stablecoin arbitrage vs tokenized Treasury funds**
- **⑤ Duration risk: the blast radius of long bonds**
`,

  mechanics: `
### ① The $28 trillion “horizon line”: the Treasury market and the risk-free rate

**US Treasuries** are bonds issued by the US federal government — about **$28 trillion** outstanding as of 2025, the largest, most actively traded, tightest-spread securities market in the world. “Depth” means you can buy or sell a few hundred million dollars and the market doesn't blink. By maturity there are three flavors: **T-bills (≤1 year)**, **T-notes (2–10 years)**, **T-bonds (20–30 years)**. The latter two pay semiannual coupons in the standard bond structure from last lesson; the T-bill is a special case that ② covers.

Why is this called the **risk-free rate**? “Risk-free” means **default risk approaching zero** — the US government borrows in dollars, and it issues the dollars, so in nominal terms it can always pay (inflation and political brinkmanship are separate stories). Treasury yields thus become the market's **horizon line**: every other asset's return is quoted as “Treasuries plus something.” Corporate yield = Treasuries + credit spread; expected equity return = Treasuries + equity risk premium. The zero-mark on last lesson's risk ruler is nailed right here.

The direct RWA implication: **the T-bill is the easiest possible asset to tokenize** — lowest default risk, deepest liquidity, an indisputable market price every single day (unlike private credit's appraisal guesswork, Stage 3.5), and short maturities so interest-rate risk stays small. Tokenization starting with the simplest asset wasn't a coincidence; it was inevitable.

### ② T-bill anatomy: no coupon — sold at a discount

A T-bill differs from an ordinary bond: **it pays no coupon**. Its trick is being **sold at a discount** — you buy today below face value, collect full face at maturity, and the gap is your interest.

Walk it with real numbers. A **$1,000** face, **182-day** T-bill with an auction-set **discount rate** of 5%. US market convention annualizes the discount rate over 360 days, so:

> Purchase price = 1000 × (1 − 0.05 × 182/360) = 1000 × (1 − 0.02528) = **$974.72**

You pay $974.72 today and receive $1,000 in 182 days — earning **$25.28**. Note the subtlety: your true return is not 5%, because your capital at work was 974.72, not 1000. Converted to the **bond-equivalent yield** (365 days, on actual principal):

> BEY = (25.28 / 974.72) × (365/182) ≈ **5.20%**

That little trap — “5% discount rate ≠ 5.2% actual yield” — is a miniature of fixed income's countless quoting conventions: **whenever you see a yield number, first ask what convention produced it**. Last lesson's inverse relationship holds here too: market rates rise, existing T-bill prices fall — but with such short maturities the drop is tiny, which is precisely the technical reason bills are “safe” (⑤ shows the long-bond flip side).

### ③ The great rate swing: from 0 to 5.25%, then back toward 4%

Rates are not a constant; they are the Fed's policy variable. The last twenty years in one arc:

- **2008–2021: the near-zero era.** After the financial crisis the Fed pinned the federal funds rate at 0–0.25% and held it there for years (a brief climb to 2.5% in 2016–19, then back down). Cash yielded ≈0, savers were pushed to “reach for yield,” and money flooded into stocks, property, crypto.
- **2022–2023: the violent hikes.** Inflation hit 9%, and within 18 months the Fed dragged rates from near 0 to **5.25–5.5%** — the steepest climb in four decades. Suddenly the safest asset on Earth paid 5%+, and “boring cash management” became one of the best businesses in the market.
- **2024–2025: the slow ebb.** Inflation cooled; rates drifted back toward **~4%** (as of late 2025). Still meaty — but the tide is slowly going out.

<figure>
<svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <text x="320" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">Fed funds rate, 20 years: the RWA industry's tide level</text>
  <line x1="50" y1="170" x2="610" y2="170" stroke="var(--line)"/>
  <line x1="50" y1="170" x2="50" y2="40" stroke="var(--line)"/>
  <text x="40" y="174" text-anchor="end" font-size="10" fill="var(--muted)">0%</text>
  <text x="40" y="52" text-anchor="end" font-size="10" fill="var(--muted)">5%</text>
  <polyline points="50,60 90,150 120,166 300,166 340,140 370,166 420,166 450,52 500,52 560,90 610,95" fill="none" stroke="var(--orange-line)" stroke-width="2.5"/>
  <text x="120" y="150" font-size="10" fill="var(--muted)">2008 crisis → zero</text>
  <text x="215" y="185" font-size="10" fill="var(--muted)">A decade-plus near zero (2009–2021)</text>
  <text x="430" y="44" font-size="10" fill="var(--orange-ink)" font-weight="600">2022–23 hikes to 5.25%</text>
  <text x="530" y="115" font-size="10" fill="var(--muted)">2025: ebbing toward ~4%</text>
  <rect x="440" y="60" width="120" height="104" fill="var(--green-soft)" opacity="0.35"/>
  <text x="500" y="200" text-anchor="middle" font-size="10" fill="var(--green)">tokenized-Treasury boom window</text>
</svg>
</figure>

Stare at the green region: **tokenized Treasuries grew from under $1B to $7–8B precisely inside the highest-rate window**. Not coincidence — causation.

### ④ Who eats the yield: stablecoin arbitrage vs tokenized Treasury funds

Wire ③'s macro into micro with a $1 billion ledger.

**Model one: the stablecoin (issuer keeps everything).** Users hold $1B of USDT/USDC; the issuer parks the reserve in T-bills at 5%, collecting **$50 million a year**, and pays holders **$0**. Scale it up: as of 2025, stablecoins total roughly $250–300B, and issuers hold over a hundred billion dollars of short-term Treasuries — Tether alone books over ten billion dollars of annual profit, among the most profitable companies on the planet, all on “your principal, my interest.” This arbitrage **funds the entire stablecoin industry** (Stage 4.1) — and explains why regulation (the GENIUS Act, Stage 4.4) explicitly **bans** compliant payment stablecoins from paying interest: pay interest and you've become a security.

**Model two: the tokenized Treasury fund (yield goes to holders).** The same $1B buys T-bills; the fund charges **15–50bp** (basis points — 1bp = 0.01%) and passes the remaining ~**4.5–4.85%** to token holders via daily accrual or distribution. BUIDL pays its interest as new tokens dropped into your address every day (Stage 10.1). The whole category's product logic is one line: **hand the T-bill yield to the token holder and keep only a thin slice**.

Now you can read the industry's **rate sensitivity** — the line between experts and tourists: at 5% rates, “Treasury yield on-chain” is irresistible to stablecoin-heavy DeFi players, DAO treasuries, and offshore dollar-seekers; if rates return to 1%, then after 30bp of fees only 0.7% remains, and **the category's appeal caves in**. The tokenized-Treasury growth curve is the rate cycle re-plotted in different coordinates. When the tide turns matters far more than whose product is most elegantly engineered. MakerDAO/Sky at times drew over 30% of its revenue from RWA (T-bill) collateral (Stage 9.3) — another boat on the same tide line.

### ⑤ Duration risk: the blast radius of long bonds

The flip side of the T-bill's safety is the **duration** risk of long Treasuries — last lesson's inverse relationship, amplified: **the longer the maturity, the deeper the price crater from the same rate move**. Rule of thumb: a bond with duration ~8 loses roughly 8% of its price for every 1-percentage-point rise in rates.

Real numbers: you buy a 10-year Treasury in 2020 at 1.5%. By 2023 market rates are past 4%, and the bond's market price is **down more than 20%**. Note — it is still “default-risk-free,” and at maturity it still pays full face. But if you **can't wait for maturity and must sell today**, that 20% loss is real money.

“Must sell” is the exact shape of disaster. **Silicon Valley Bank (SVB)** poured depositors' demand deposits into long Treasuries and MBS; when rates spiked, its paper losses gaped into the tens of billions; depositors ran; the bank was forced to sell bonds at a loss, paper losses turned real, and in March 2023 it collapsed within 48 hours — dragging USDC, which had $3.3B of reserves inside, down to $0.87 (full post-mortem in Stage 4.3). This is also why compliant tokenized Treasury products and money-market funds **touch only short duration**: weighted-average maturity compressed to a few dozen days, so however rates jump, the price crater stays a few dozen basis points deep.

If you take away one sentence: **interest rates are the RWA industry's tide level — the T-bill yield decides how good this business is, and duration decides who drowns when the tide turns.**
`,

  demo: "tbill-pricer",

  analogy: `
Picture interest rates as **the tide**, and every “cash management business” as a fishing boat on the flats.

2009–2021 was one long **ebb**: the tide (rates) lay flat at zero, the flats cracked dry, and every boat that lived on collecting interest ran aground — money-market funds waived their fees just to avoid negative returns, savings-account interest wouldn't buy coffee, and nobody discussed “moving Treasury yield on-chain” because **there was no yield to move**.

In 2022 the tide **surged**: in eighteen months it rose from 0 to 5.25%, and every grounded boat floated at once. Stablecoin issuers were first to notice they were sitting on gold — hulls full of users' “dead money” by the hundreds of billions, which, turned into T-bills, became billions a year in interest, none of it shared. Right behind them, tokenized Treasury funds launched with a blunt pitch: “Board my boat — the interest is yours; I only charge the fare (15–50bp).”

But the rising tide also drowned someone: Silicon Valley Bank anchored short-term deposits in the farthest deep water (long bonds), and when the tide changed direction it couldn't swim back — duration is your distance from shore.

As of 2025 the tide is easing back toward 4%. The flats are still wet; the boats still run. But every serious RWA practitioner watches the tide table: **the engine of this industry's biggest category was never the propeller (technology) — it's the tide (rates).**
`,

  misconceptions: [
    "“A 5% T-bill means I collect 5% of face value in interest each year.” —— T-bills pay no interest at all; they work by discount: buy at $974.72, mature at $1,000, and the gap is the return. And a “5% discount rate” converts to a bond-equivalent yield of ~5.2% — fixed-income quoting conventions are full of traps, so ask about the convention before comparing numbers.",
    "“Treasuries are risk-free, so you can never lose money on them.” —— “Risk-free” refers only to default. Rate risk remains in full: a 10-year bought at 1.5% in 2020 was down over 20% by 2023. Face value is only guaranteed at maturity; forced to sell mid-way, paper losses turn real — that is exactly how SVB died (Stage 4.3).",
    "“Tokenized Treasuries' growth proves blockchain technology won.” —— The honest reading: it proves 5% rates won. The category didn't exist in the zero-rate era and exploded after the 2022–23 hikes. The technology (instant settlement, global reach, composability) is a real bonus, but the engine is the rate — return rates to 1% and, after fees, almost nothing remains; the growth logic caves in.",
    "“Stablecoins and tokenized Treasury funds are basically the same — both are backed by T-bills anyway.” —— Similar reserves, opposite cash-flow directions: the stablecoin issuer keeps all the interest (paying you 0%), while the tokenized fund passes the yield through (keeping 15–50bp). One is the issuer's money printer, the other is the holder's yield vehicle — two business models, not two brands.",
    "“Rates are high, so lock them in with long-term Treasuries.” —— Locking in yield means carrying duration: the longer the maturity, the harder the price falls if rates keep climbing, and your capital is pinned for the locked years. Short duration (T-bills) gives up a sliver of yield in exchange for “rates can jump and I barely move” — which is exactly why tokenized products almost uniformly choose it.",
  ],

  quiz: [
    {
      q: "What is the key structural difference between a T-bill and a coupon Treasury (T-note/T-bond)?",
      options: ["T-bills are issued by state governments", "A T-bill pays no coupon — it sells at a discount to face value and pays full face at maturity", "T-bills yield more", "T-bills cannot be transferred"],
      answer: 1,
      explain: "Bills (≤1 year) earn via discount: price = face × (1 − discount rate × days/360); the gap to face is the interest.",
    },
    {
      q: "A $1,000-face, 182-day T-bill at a 5% discount rate costs approximately…",
      options: ["$950.00", "$974.72", "$1,000.00", "$1,025.28"],
      answer: 1,
      explain: "1000 × (1 − 0.05 × 182/360) ≈ $974.72. Collect $1,000 at maturity, earn $25.28 — a bond-equivalent yield of about 5.2%.",
    },
    {
      q: "Stablecoin issuers and tokenized Treasury funds both hold T-bills. The core business-model difference is…",
      options: ["They use different chains", "The stablecoin issuer keeps all the interest (holders get 0), while the tokenized fund passes the yield to holders and keeps only a 15–50bp fee", "Tokenized funds are unregulated", "Stablecoin reserves are safer"],
      answer: 1,
      explain: "Same asset, opposite cash-flow direction. The issuer-keeps-the-spread model funds the stablecoin industry (Stage 4.1); the tokenized Treasury's entire pitch is giving that spread back to you.",
    },
    {
      q: "Why is RWA's biggest category highly sensitive to the rate cycle?",
      options: ["Because rates affect gas fees", "Because the appeal of “4.7% on-chain” comes entirely from the rate itself: at 1% rates, yield after fees approaches zero and the demand logic collapses", "Because the Fed regulates blockchains", "It isn't sensitive — technology is what matters"],
      answer: 1,
      explain: "Tokenized Treasuries didn't exist in the zero-rate era and boomed in the 5% era — the growth curve is a projection of the rate cycle. Tide out, engine off.",
    },
    {
      q: "A 10-year Treasury bought in 2020 at 1.5% — what happened to it by 2023, with rates above 4%?",
      options: ["Price unchanged, since the US government won't default", "Market price fell over 20%; hold to maturity and face value still comes home, but a forced sale locks in the loss — SVB's cause of death", "Price rose with the better rate environment", "It automatically re-rates to the new yield"],
      answer: 1,
      explain: "Duration amplifies the inverse relationship: longer maturity, deeper crater when rates climb. “No default risk” is not “no price risk” — whoever is forced to sell mid-way (like a bank facing a run) absorbs the full drop.",
    },
  ],

  further: [
    { label: "TreasuryDirect: Treasury Bills — official explainer (discount mechanics and auctions)", url: "https://treasurydirect.gov/marketable-securities/treasury-bills/" },
    { label: "SIFMA: US Treasury market statistics (size and volumes)", url: "https://www.sifma.org/resources/research/us-treasury-securities-statistics/" },
    { label: "Federal Reserve: the federal funds rate and open market operations", url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm" },
    { label: "rwa.xyz: live tokenized-Treasury dashboard (Stage 10.1 preview)", url: "https://app.rwa.xyz/treasuries" },
  ],
};
