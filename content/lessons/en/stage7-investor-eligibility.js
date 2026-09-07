export default {
  id: "investor-eligibility",
  stage: 7,
  order: 2,
  title: "Who May Buy: Accredited Investors, Reg D & Reg S",
  difficulty: "systems",
  prereqs: ["kyc-aml", "token-vs-claim"],

  oneLiner:
    "Clearing the three gates only proves you're a clean, real person — securities law then asks a second question: are you eligible to buy this thing at all? US law slices buyers into a ladder — retail, accredited investor ($1M net worth or $200k income), qualified client, qualified purchaser ($5M in investments, BUIDL's world) — and the issuer picks a route off the exemption menu (Reg D, Reg S, Reg A+) that determines who may buy, whether it can advertise, and how long tokens stay locked. An RWA product's entire architecture is reverse-engineered from this first decision: which investors it targets.",

  intuition: `
Here's a strange fact. BlackRock's BUIDL is the world's largest tokenized Treasury fund, yet you — an ordinary person with flawless KYC and a spotless wallet — **cannot buy it at all**; entry starts at $5 million. Meanwhile Ondo's USDY can be bought by a university student in Kenya, but **not** by a hedge-fund manager in New York. Same chains, same technology — why is eligibility twisted completely opposite ways?

The answer isn't in the technology. It's in the **geometry of securities law**. Stage 7.1's three gates answered “are you clean?”; this lesson's question is entirely different: **“are you qualified to bear this risk?”** The regulator's logic is blunt: private securities come with thin disclosure, poor liquidity, and high risk, so only people who can “afford to lose and know what they're looking at” get in — and “afford to lose” gets translated by law into cold numeric thresholds: $1 million of net worth, $200k of income, $5 million of investments.

The issuer stands at the other end of the same map: **who I want to sell to determines which legal corridor I must walk.** Choose Reg D and you give up retail; choose Reg S and you give up Americans; want US retail and you're on the slow, expensive road of registration or Reg A+. This is not a parameter you tune after launch — it is **the first stroke of product design** — and the wrapper (Stage 5), the token standard configuration (Stage 6), and the transfer checks (Stage 7.3) are all reverse-engineered from it. Understand this map and you understand why BUIDL, USDY, and RealT grew into three completely different shapes.

**Here's the map — five parts:**

- **① The eligibility ladder: four rungs from retail to “qualified purchaser”**
- **② The issuer's exemption menu: Reg D, Reg S, Reg A+, Reg CF**
- **③ Resale rules: Rule 144 and the locks on the token**
- **④ The EU parallel: prospectus exemptions and professional clients**
- **⑤ The geometry: eligibility is the product's first decision**
`,

  mechanics: `
### ① The eligibility ladder: four rungs from retail to “qualified purchaser”

US securities law slices investors into a ladder. Each rung up buys access to more and keeps less protection. Memorize the four rungs and their **exact thresholds**:

- **Retail investors**: no threshold. They may buy only **registered public offerings** — mutual funds, listed stocks. The SEC's full disclosure regime does the protecting.
- **Accredited investor**: either of two tests — **net worth above $1 million (explicitly excluding the primary residence)**, or **income above $200k for two consecutive years ($300k jointly with a spouse)** with the same expected this year. In 2020 the SEC opened one more door: holders of **Series 7 / 65 / 82** securities licenses qualify — the first time “knowing” was accepted in place of “having.” Accredited investors may buy Reg D private placements — the threshold line for the vast majority of tokenized private products.
- **Qualified client**: **$2.2 million** net worth (inflation-adjusted). This line governs **whether a fund manager may charge you performance fees** (Advisers Act Rule 205-3) — below it, you can't even enter a “20% carry” fund.
- **Qualified purchaser**: **$5 million or more in investments** (note: *investments*, not net worth — the primary residence and your own operating business don't count). This is the bar for **3(c)(7) funds** — a fund that wants more than 100 investors without registering as a public fund must take qualified purchasers only. **BUIDL lives on this rung**: Reg D + 3(c)(7), $5 million minimum subscription — which is why you can't buy it.

<figure>
<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
<rect x="20" y="180" width="600" height="40" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
<text x="320" y="200" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Retail: no threshold</text>
<text x="320" y="214" text-anchor="middle" font-size="9" fill="var(--muted)">registered public offerings only (mutual funds, listed stocks)</text>
<rect x="90" y="128" width="460" height="42" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="320" y="146" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="600">Accredited: $1M net worth (ex-home) or $200k/$300k income</text>
<text x="320" y="162" text-anchor="middle" font-size="9" fill="var(--muted)">or Series 7/65/82 license (2020 expansion) → may buy Reg D placements</text>
<rect x="160" y="76" width="320" height="42" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="320" y="94" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="600">Qualified client: $2.2M net worth</text>
<text x="320" y="110" text-anchor="middle" font-size="9" fill="var(--muted)">managers may charge you performance fees</text>
<rect x="215" y="24" width="210" height="42" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
<text x="320" y="42" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Qualified purchaser: $5M investments</text>
<text x="320" y="58" text-anchor="middle" font-size="9" fill="var(--muted)">the 3(c)(7) fund bar — BUIDL's world</text>
</svg>
</figure>

### ② The issuer's exemption menu: Reg D, Reg S, Reg A+, Reg CF

Now switch to the issuer's seat. Selling securities in the US means **registration** by default (IPO-grade disclosure) — unless you squeeze through an **exemption** corridor. This menu is every RWA product's birth certificate:

- **Reg D 506(b)**: the old private-placement road. **No general solicitation** (no ads, no public sales page); accredited buyers may **self-certify**; up to 35 “sophisticated” non-accredited investors allowed. Quiet and cheap — but you can only reach buyers through existing relationships.
- **Reg D 506(c)**: the 2012 JOBS Act's new road. **You may advertise publicly** — at the price of having to **actively verify** every buyer's accredited status: tax returns, asset statements, or a letter from a CPA/attorney. That annoying step where a crypto platform makes you upload income documents? That's 506(c)'s verification duty at work. Most publicly marketed tokenized placements (Ondo OUSG and peers) walk this road.
- **Reg S**: an entirely different move — **offer exclusively offshore to non-US persons**, and the SEC's registration requirement doesn't reach you. It carries a **distribution compliance period** (typically 40 days to 1 year) during which the securities must not flow back to US persons. This is the door — shaped like a loophole, entirely legal — that nearly every “global” RWA product walks through: **USDY's design is exactly Reg S** — the answer to the Kenyan-student-yes, US-fund-manager-no riddle (dissected in Stage 10.2).
- **Reg A+**: the “mini-IPO.” Raise up to **$75 million per year**, requires SEC **qualification** in advance, but the reward is **selling to US retail**. The costs: months of review, six-figure legal bills, ongoing disclosure duties. A handful of real-estate/collectible tokenizations chasing US retail take this road.
- **Reg CF**: the crowdfunding channel, capped at **$5 million per year**, run through registered funding portals. Small; rare in RWA.

See the menu for what it is: **every corridor is a trade** — you surrender part of the market (retail / US persons / public marketing) in exchange for skipping registration's cost and delay. No corridor gives you “US retail + fast + cheap” at once.

### ③ Resale rules: Rule 144 and the locks on the token

Buying in is only half the story — **selling out** is the other, messier half. Securities bought in a private placement are **restricted securities**: resale requires either registration or another exemption. The workhorse safe harbor is **Rule 144**: for issuers that report to the SEC, a **6-month** holding period; for non-reporting issuers (most tokenized placements), **12 months**. During the lock, resale is essentially sealed shut.

This rule is **physically embodied in the token contract**: it's why ERC-3643's compliance modules carry lockup parameters, why USDY has a 40-plus-day transfer lock after mint, and why Stage 7.3's transfer pipeline has a station dedicated to “has the lockup elapsed?” — all of it is Rule 144 and Reg S's compliance period **compiled into code**. Better still: tokens minted in different batches carry different unlock dates, so the contract must do **per-lot accounting** — a genuine engineering wrinkle that Stage 7.3 unfolds.

### ④ The EU parallel: prospectus exemptions and professional clients

The EU map runs on the same logic with different nouns. Three things to remember:

- **Prospectus exemptions**: issuing securities requires a **prospectus** by default, exempted in three cases — selling only to **qualified investors**; fewer than **150 natural persons per member state**; or a total offer below the threshold (member states may set it up to **€8 million**).
- **Professional vs retail clients**: MiFID II sorts clients into retail / professional / eligible counterparties. Professional clients (large institutions, or individuals passing a portfolio-size-plus-trading-frequency test) get fewer protections and more access — functionally the EU's accredited investor.
- The combined play: EU RWA products typically run “qualified investors only” or “<150 persons per state” — a one-to-one echo of Reg D's private-placement logic. Add Stage 11.2's MiCA and DLT Pilot Regime and you have the EU half of the map.

### ⑤ The geometry: eligibility is the product's first decision

Pull the camera back and watch this decision chain propagate from “who may buy” into every technical detail:

- Target **US qualified purchasers** (big institutional money) → Reg D + 3(c)(7) → high minimums, no investor cap → wrap in a BVI/Cayman fund + Delaware feeder (Stage 5.2) → tiny whitelist, comparatively relaxed transfer rules → that's **BUIDL**.
- Target **global non-US retail** → Reg S → must block every US person (jurisdiction checks!) + a 40-day distribution-compliance lock → package the yield as an interest-bearing note → that's **USDY**.
- Target **US retail** → the slow Reg A+ lane, or full registration → months of review + disclosure costs → only a story like fractional real estate can carry that weight → that's the RealT category (and RealT itself chose instead to exclude US persons and take an exemption route — because Reg A+ costs too much).
- Notice the direction: **it is never “launch the token, then decide who to sell to” — it is “decide who to sell to, then reverse-engineer everything.”** Target investors determine the exemption corridor; the corridor determines disclosure, verification, and lockup duties; those duties determine the legal wrapper (Stage 5), the token standard and compliance-module parameters (Stage 6), even the choice of chain. When Stage 13.3 does stack selection, its first input is this lesson's answer.

If you take away one sentence: **the three gates check who you are; the eligibility ladder checks whether you may buy — and the corridor the issuer picks from the exemption menu determines the entire shape of the product.**
`,

  demo: "eligibility-quiz",

  analogy: `
Picture the securities market as an **amusement park with tiered admission**.

The public zone (registered public markets) is open to everyone, but every ride has a full safety harness, inspected item by item (SEC disclosure review). Deeper in are the **members-only zones**: to enter the “thrill-ride zone” (Reg D placements) you must show your “height card” — except it doesn't measure height, it measures **net worth**: the $1M line, the $2.2M line, the $5M line, one gate per tier. The park's logic isn't snobbery; it's that these rides skipped the full inspection, so **if you fall, you must be able to absorb the landing yourself**.

The park also runs a curious **overseas annex** (Reg S): the same rides, built just outside the park's borders, off-limits to domestic guests — but any foreign visitor may ride. Hence the counterintuitive scene: locals staring through the fence at rides they can't board, while tourists queue up happily (USDY).

And at every thrill ride's exit hangs a sign: **“tickets non-transferable for 12 months after riding”** (Rule 144). The ticket in your hand (the token) literally carries its unlock date — and tickets bought on different days carry different dates. A proprietor planning a new ride (an issuer) doesn't start with blueprints. The first decision is: **which zone does my ride go in?** Settle that, and everything else follows.
`,

  misconceptions: [
    "“Once I pass KYC I can buy any RWA.” —— KYC answers “are you clean”; eligibility answers “may you buy” — two independent checks. A US retail investor with a flawless identity still can't buy a Reg D placement. That's a legal threshold, not a risk-control one.",
    "“The accredited investor's $1M net worth can include my house.” —— Since Dodd-Frank in 2010, the primary residence is explicitly excluded. Many paper millionaires hold most of their net worth in their home and are not accredited under the legal definition — which is why the bar is higher than it sounds.",
    "“Accredited investor and qualified purchaser are roughly the same — rich people.” —— More than an order of magnitude apart: accredited is $1M net worth / $200k income; qualified purchaser is $5M in *investments* (excluding home and operating business). 3(c)(7) funds like BUIDL accept only the latter — plenty of accredited investors are locked out too.",
    "“506(c) allows advertising, so it must be the looser rule.” —— Backwards. 506(c) trades “may solicit publicly” for a heavier duty: the issuer must actively verify each buyer's accredited status (tax returns, asset statements) — self-certification no longer suffices. The hassle of uploading income proof is 506(c)'s price.",
    "“Reg S is a regulatory loophole that will get shut down.” —— Reg S is a formal SEC rule from 1990 with clean logic: US securities law governs the US market; offshore offers to non-US persons fall outside it (but the issuer must run jurisdiction checks and a distribution compliance period — hardly “no compliance”). It's a door shaped like a loophole, not a loophole.",
    "“Token transfer locks are the issuer being difficult.” —— Transfer locks are Rule 144's holding period and Reg S's compliance period compiled into code (Stage 7.3 enforces them). Without the lock, the issuer's exemption could be voided as a disguised public offering — the lock protects the legality of the entire product.",
  ],

  quiz: [
    {
      q: "What is the US “accredited investor” threshold?",
      options: [
        "Net worth of $500k, home included",
        "Net worth above $1M (excluding the primary residence), or income above $200k for two consecutive years ($300k jointly); Series 7/65/82 license holders also qualify",
        "Holding any amount of investments for 5 years",
        "Automatic upon passing KYC",
      ],
      answer: 1,
      explain: "Either of two financial tests (home explicitly excluded); since 2020 professional licenses count too — “knowing” accepted in place of “having” for the first time.",
    },
    {
      q: "BUIDL's $5M minimum and qualified-purchasers-only rule flow from which legal structure?",
      options: [
        "A Reg A+ mini-IPO",
        "A Reg S offshore offering",
        "A Reg D placement + the 3(c)(7) fund exemption — 3(c)(7) requires every investor to hold $5M+ in investments",
        "Reg CF crowdfunding",
      ],
      answer: 2,
      explain: "3(c)(7) lets a fund exceed 100 investors without registering as a public fund — at the price that all investors must be qualified purchasers ($5M in investments).",
    },
    {
      q: "The core difference between Reg D 506(b) and 506(c)?",
      options: [
        "506(b) caps the raise at $5M; 506(c) is uncapped",
        "506(b) forbids general solicitation but allows self-certification; 506(c) may advertise publicly but must actively verify every buyer's accredited status",
        "506(c) permits sales to retail investors",
        "They differ only in number, not in rules",
      ],
      answer: 1,
      explain: "“May you advertise” trades against “how heavy is the verification duty.” Uploading tax documents to a platform is 506(c)'s verification at work.",
    },
    {
      q: "USDY's “non-US retail may buy, Americans may not” design rests on?",
      options: [
        "A technical block: US IPs can't reach the chain",
        "Reg S: offering exclusively offshore to non-US persons avoids SEC registration, with a distribution compliance period and a standing duty to keep US persons out",
        "Americans don't need such a product",
        "Ondo skipped a US license — it's a violation",
      ],
      answer: 1,
      explain: "Reg S is a formal SEC rule: offshore offers to non-US persons don't trigger registration. Jurisdiction checks and transfer locks are that road's compliance cost (Stage 10.2).",
    },
    {
      q: "Rule 144's direct effect on RWA tokens?",
      options: [
        "It requires annual token audits",
        "Privately placed securities are restricted: 6-month lock for reporting issuers, 12 months for non-reporting ones — the source of the token contract's lockup parameters and per-lot unlock dates",
        "It bans tokens from all exchanges",
        "It applies to stocks only, not tokens",
      ],
      answer: 1,
      explain: "Transfer locks are Rule 144 (and Reg S's compliance period) compiled into code; different lots with different unlock dates is Stage 7.3's real engineering wrinkle.",
    },
    {
      q: "Why is the target investor the FIRST design decision of an RWA product?",
      options: [
        "Because investors have the most money",
        "Because target investors determine the exemption corridor; the corridor determines disclosure/verification/lockup duties, which determine the legal wrapper, token-standard configuration, even the chain — the whole architecture is reverse-engineered from it",
        "Because the law requires registering the investor list first",
        "Because technical architecture can't be changed later",
      ],
      answer: 1,
      explain: "BUIDL, USDY, and RealT took three shapes because they aimed at three audiences. Stage 13.3's stack-selection exercise takes this as its first input.",
    },
  ],

  further: [
    { label: "SEC: the official accredited-investor definition and the 2020 expansion", url: "https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/accredited-investor" },
    { label: "SEC: Reg D private-placement exemptions overview", url: "https://www.sec.gov/resources-small-businesses/exempt-offerings/private-placements-rule-506b" },
    { label: "SEC Investor.gov: Rule 144 and reselling restricted securities", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-144-selling-restricted-and-control-securities" },
    { label: "SEC: Regulation A (Reg A+) official page", url: "https://www.sec.gov/resources-small-businesses/exempt-offerings/regulation" },
    { label: "ESMA: prospectus rules (the EU exemptions' official entry point)", url: "https://www.esma.europa.eu/issuer-disclosure/prospectus" },
  ],
};
