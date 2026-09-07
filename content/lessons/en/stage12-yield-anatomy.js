export default {
  id: "yield-anatomy",
  stage: 12,
  order: 4,
  title: "Anatomy of a Yield: Where the Money Comes From & When It Stops",
  difficulty: "mastery",
  prereqs: ["treasuries-yield", "rwa-in-defi"],

  oneLiner:
    "Every advertised yield decomposes into named parts — base rate, credit spread, illiquidity premium, leverage, token incentives, term premium, minus the fee stack. Whatever is left after an honest decomposition is the **residual**, and it has only two possible sources: risk you're carrying without being told, or your own principal coming back to you labeled “yield.” **If you can't find the source of the yield, you are the source of the yield.**",

  intuition: `
You can now draw risk as a shape (Stage 12.1), read the documents (Stage 12.2), and sequence the work with a checklist (Stage 12.3). Here comes the last step, the one that cashes in the first three: **price the thing**.

Recall Stage 12.1's third iron law: risk isn't bad — **unpriced risk is**. An emerging-market credit pool paying 10% can be entirely honest; a Treasury product paying 4.8% can be equally honest. Both pass. The real question is always the same one: **where does every single percentage point in that number come from?**

The good news is that this isn't mysticism, it's **addition**. Finance knows only a handful of yield sources; each has a name, a typical magnitude, and its own answer to “when does it stop.” Put the advertised number on the left, stack up the parts you can explain on the right, and subtract. If it balances, the product is honest (honest doesn't mean suitable, but at least you know what you bought). If it doesn't balance, the leftover is this lesson's main character.

That leftover is the **residual**. It doesn't come from nowhere — there is no free money in finance. A residual has exactly two possible explanations: **either you're carrying some undisclosed risk** (unstated leverage, concentration, maturity mismatch), **or it isn't yield at all** — new money paying old money, which is the definition of a Ponzi. So the line to memorize from this lesson is: **if you can't find the source of the yield, you are the source of the yield.**

**Here's the map — five parts:**

- **① The decomposition: six sources and one deduction**
- **② The residual rule: what the unbalanced part is**
- **③ Four worked examples: from 4.8% to 30%**
- **④ Sustainability stress tests: when does this yield stop?**
- **⑤ Closing the loop: four lessons make an expert**
`,

  mechanics: `
### ① The decomposition: six sources and one deduction

Write down this equation; it will serve you for life:

> **Advertised yield = base rate + credit spread + illiquidity premium + leverage contribution + token incentives + term premium − fee stack**

Take each in turn, asking three things of every part: **what it is, how big it typically is, and when it stops**.

- **Base rate (risk-free)**: the yield on short-dated US Treasuries, the floor under all pricing (Stage 3.2). It sat in the 4–5% band through 2023–25, easing toward 4% by late 2025. **When it stops**: it follows the Fed down when they cut — this is the beta of the entire tokenized-Treasury sector.
- **Credit spread**: your compensation for the borrower possibly defaulting. **It must map to the borrower's actual quality**: investment-grade corporate spreads run a point or two; unsecured emerging-market fintech lending demands several points or more (Stage 10.3). **When it stops**: in a downturn, when default rates jump — the spread is collected up front, the losses arrive later.
- **Illiquidity premium**: compensation for your money being locked up. Typically 1–5%, depending on lockups and gate clauses (Stage 3.5). **When it stops**: it doesn't “stop,” but you only find out what you sold when you actually need the money.
- **Leverage**: borrowing to amplify the position. It amplifies both the yield and the **speed of wipeout** — the carry loops of Stage 9.3 (deposit → borrow → redeposit) are exactly how 5% becomes 15%. **When it stops**: when rates rise or asset prices fall, the leverage layer blows first, and instantly.
- **Token incentives**: the part paid to you in the platform's own token. **It is finite by construction** — the emissions schedule lives in the tokenomics docs, with an explicit end date. **When it stops**: on the day emissions end, or the day the token's price falls (whichever comes first). See incentives, write the expiry date next to them.
- **Term premium**: compensation for taking interest-rate risk on longer-duration assets. **When it stops**: when rates rise, the price fall on long-duration assets eats that premium first (Stage 3.2's bond math).
- **Minus the fee stack**: management fee + stacked wrappers (Stage 10.2's OUSG-wrapping-BUIDL) + subscription/redemption spreads + gas. Treasury-type products should be all-in in the 0.15–0.5% band; **always compute all-in, never just the management-fee line.**

### ② The residual rule: what the unbalanced part is

<figure><svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><text x="20" y="28" font-size="12" font-weight="700" fill="var(--ink)">Advertised yield 15%</text><rect x="20" y="38" width="500" height="26" rx="4" fill="var(--surface-2)" stroke="var(--line)"/><text x="270" y="56" text-anchor="middle" font-size="11" fill="var(--muted)">15.0%</text><text x="20" y="94" font-size="12" font-weight="700" fill="var(--ink)">What you can explain</text><rect x="20" y="104" width="150" height="26" rx="4" fill="var(--green-soft)" stroke="var(--line)"/><text x="95" y="122" text-anchor="middle" font-size="10.5" fill="var(--ink)">base 4.5%</text><rect x="172" y="104" width="20" height="26" rx="4" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="182" y="122" text-anchor="middle" font-size="9" fill="var(--ink)">fee</text><text x="215" y="122" font-size="10.5" fill="var(--muted)">− 0.5% fees = 4.0% explained</text><text x="20" y="164" font-size="12" font-weight="700" fill="var(--red)">Residual = 11%</text><rect x="20" y="174" width="367" height="26" rx="4" fill="var(--red-soft)" stroke="var(--line)"/><text x="203" y="192" text-anchor="middle" font-size="11" fill="var(--ink)">11% unexplained — hidden risk, or your own principal</text><text x="400" y="192" font-size="10.5" fill="var(--orange-ink)">← only two possibilities</text></svg></figure>

After an honest decomposition, the **residual** has two sources and no third:

- **One: risk you're carrying without being told.** Undisclosed leverage, concentration in a single borrower, maturity mismatch (funding three-year assets with daily-redeemable money), counterparty risk. This kind of residual isn't necessarily a fraud, but it means **you're being paid for a risk list you've never seen** — and Stage 12.1's map warns that the layer you haven't seen is usually the weakest one.
- **Two: it isn't yield at all.** New money paying earlier money. That's the definition of a Ponzi, and it has a signature: **the yield is unrelated to size, unrelated to markets, and remarkably stable** — because it isn't generated by any real asset; it's simply declared.

Hence this lesson's line, the one that should ring in your head every time you see a big number: **if you can't find the source of the yield, you are the source of the yield.**

A practical threshold: a residual **under 2%** is usually your own estimation error (a misjudged spread, a fee you missed) and is acceptable; **2–5%** means there's a block you don't understand and must understand before deciding; **over 5%** in legitimate RWA almost always means undisclosed leverage, an expiring incentive program, or a money-in-money-out scheme.

### ③ Four worked examples: from 4.8% to 30%

**Example 1 · Tokenized Treasury fund, advertised 4.8%.** Decompose: base 5.1% (short T-bill yield at the time) − fees 0.3% (management + spreads) = **4.8%**. Residual **0** ✓ — boring and honest, exactly what a competent tokenized-Treasury product looks like: it doesn't create yield, it **transports** yield and honestly deducts the shipping. The question to ask isn't “why so low” but “why aren't the fees lower still.”

**Example 2 · Private credit pool, advertised 9%.** Decompose: base 4.5% + credit spread 4% + illiquidity 1% − fees 0.5% = **9%**. Residual **0** ✓. But balancing the equation is only half the work — **now verify that the 4% spread matches the real risk.** Do the default arithmetic: at a 70% recovery rate (a default loses 30% of principal), a 4% spread breaks even against roughly **4% ÷ 0.3 ≈ 13%** annual defaults… sounds safe? Careful — that's the theoretical ceiling. The real question is: **what is this pool's actual default history?** In Stage 10.3, several Goldfinch pools lost far more than expected because recoveries on unsecured cross-border credit often land well below 70% — drop recovery to 30% and the same 4% spread only covers about 5.7% defaults. **Whether the spread is adequate depends entirely on how honest your recovery assumption is.**

**Example 3 · The “stable and safe” 15%.** Decompose: base 5% + everything else explainable 0 (no credit disclosure, no lockup) = **5% explained, residual 10%**. Don't jump to “fraud” — **force it to explain**. Go into the tokenomics and the documents and find that 10%'s name:
Is it **undisclosed leverage**? (Search for “borrow,” “loop,” “leverage ratio” — 3× leverage turns 5% into 15%, and also zeroes you out on a 33% asset decline.)
Is it **token incentives**? (Find the emissions schedule — if it says emissions end in 14 months, you bought a **yield with an expiry date**: 15% becomes 4%, money stampedes for the door, and the secondary discount arrives before the redemption queue does.)
Or is it **inflows paying outflows**? (Signature: a constant yield, unrelated to markets, with heavy emphasis on recruiting.)
**All three answers are possible; giving you none of them amounts to the third.**

**Example 4 · Anything at 30%.** Don't decompose it. Arithmetically: **no legal RWA asset class has ever sustainably yielded 30% unlevered.** Historically, numbers like that come from short-lived dislocations that mean-revert, from leverage, or from fraud. The only correct action on seeing 30% is to walk — that's a Stage 12.3 kill criterion, not an analysis problem.

### ④ Sustainability stress tests: when does this yield stop?

Decomposition is static; the forward-looking half asks: **under what conditions does this yield disappear?** Four mandatory questions:

- **What if rates fall 300bp?** The tokenized-Treasury apocalypse: 4.8% → 1.8%. The product isn't broken, but its reason to exist shrinks and AUM leaves for elsewhere. The whole sector carries extreme beta to the Fed (Stage 3.2) — that isn't a risk so much as **a physical property of this product class**, and you must know it in advance.
- **What if the incentives end?** The cliff date is written in the tokenomics docs — **go read it**. The higher the incentive share, the steeper the cliff. A 15% product where 10% is emissions is fundamentally a 5% product plus a countdown timer.
- **What if defaults arrive at 2× the priced rate?** Reverse Example 2: a 4% spread at 70% recovery breaks even around 13% defaults; if actual defaults double against the pricing assumption while recoveries deteriorate at the same time, your 9% turns negative. **Spreads are collected first, losses arrive later** — that timing gap is the source of every pain in credit products.
- **What if redemptions surge?** Gates drop → the secondary market becomes the only exit → the discount widens → the discount itself triggers more panic (Stage 9.4's discount spiral). That's when you discover liquidity was never a “feature” but the amplifier from Stage 12.1.

### ⑤ Closing the loop: four lessons make an expert

Stage 12's four tools are now complete, and they form one coherent sequence:

- **Stage 12.1, the risk map** — draw the **shape** of the risk (six layers plus the liquidity amplifier; interrogate the weakest);
- **Stage 12.2, reading the docs** — turn marketing claims into **verifiable evidence** (seven questions + registries + EDGAR);
- **Stage 12.3, the red-flag checklist** — **sequence** the work (kill criteria → structure → data → market → ongoing monitoring);
- **Stage 12.4, yield anatomy** — **price** the deal (the decomposition, the residual rule, the stress tests).

Shape, evidence, order, price. Put together, you stop being the person who “feels good about this project” and become the person who says: “its risk concentrates at the issuer layer; of the 9% yield, 4% is credit spread, which is inadequate if recoveries fall to 30%; and its incentives end in 14 months.” **That is the entire difference between an expert and a novice — not better intuition, but intuition converted into a decomposition you can say out loud.**

If you take away one sentence: **a yield is an addition problem — the part that doesn't add up is the part you weren't told; and if you can't find the source of the yield, you are the source of the yield.**
`,

  demo: "yield-xray",

  analogy: `
Think of an advertised yield as the **total on a restaurant bill**. You ordered a table full of dishes, the server hands you the bill: **$880**. Someone who doesn't care just pays; someone who does takes a first step — **checking the bill against the menu**.

Every dish has a price on the menu: that's the decomposition. Braised pork 88, steamed fish 168, drinks 240, 10% service… you add it up and get **$790**. The remaining **$90 is the residual** — and it must correspond to something: maybe a corkage fee you didn't notice (**an undisclosed but real cost**), or maybe the server added a dish you never ordered (**you're paying for something that doesn't exist**). Either way, **your move is identical: point at the $90 and ask what it is.**

A “15% stable yield” bill is one where the total is 880 and the menu only accounts for 300. The restaurant then says, “our pricing reflects a range of integrated factors” — that isn't an explanation, that's a refusal to explain. **An honest bill always reconciles; when one doesn't, the problem isn't your arithmetic — it's that someone doesn't want you doing arithmetic.**

One last layer: **bills have shelf lives.** Today's 30%-off is a grand-opening promotion (token incentives) and next month the normal prices return. So reading a bill isn't only “what do I pay today” but “what sustains this price and when does it expire” — which is exactly the sustainability stress test.
`,

  misconceptions: [
    "“A high yield shows the product is good at generating returns.” —— A yield is the price of risk, not a certificate of skill. Two products at 9%: one is fair compensation for real credit risk, the other is undisclosed 3× leverage. Without decomposing, you can't tell them apart — and their endings are worlds apart.",
    "“If the decomposition balances, the product is fine.” —— Balancing is half the job. The other half is verifying that each block's **size matches the real risk**: what borrower quality does a 4% spread imply? Is the recovery assumption 70% or 30%? Spreads are collected up front; losses arrive later.",
    "“Token incentives are real money, so counting them as yield is fine.” —— Count them, but **write the expiry date next to them**. Incentives are finite by construction and the emissions schedule is in the tokenomics docs. A 15% product where 10% is emissions is a 5% product plus a countdown — and money usually leaves before the cliff arrives.",
    "“The residual is the operator's edge or informational advantage.” —— The residual has exactly two sources: risk you weren't told about, or your own principal returning as “yield.” There is no third kind of money in finance. When you can't find the source, you are the source.",
    "“Treasury products are the safest, so falling rates don't affect me.” —— Falling rates don't make the product worse, but the whole sector has extreme beta to the Fed: at 4.8% → 1.8%, the product still exists but the reason to hold it doesn't, and money leaves. That's not a risk event; it's a physical property of the class — know it in advance and you won't be surprised in a cutting cycle.",
  ],

  quiz: [
    {
      q: "A product advertises 15%; your honest decomposition explains only 5%. What can the remaining 10% residual be?",
      options: ["A premium for the operator's superior execution", "Undisclosed leverage, token incentives, or new money paying old money — there is no third category", "A permanent free lunch from market inefficiency", "Cost savings from using a blockchain"],
      answer: 1,
      explain: "A residual is either risk you weren't told about or your own principal returning as “yield.” When you can't find the source, you are the source.",
    },
    {
      q: "A 9% private-credit pool decomposes as base 4.5% + spread 4% + illiquidity 1% − fees 0.5%, residual 0. What should you do next?",
      options: ["Buy — it balances, so it's honest", "Verify that the 4% spread matches real defaults and recovery rates, testing the pricing assumption against the pool's history", "Add leverage and see if it reaches 15%", "Check the community's mood"],
      answer: 1,
      explain: "Balancing is half the work. A 4% spread survives ~13% defaults at 70% recovery, but only ~5.7% at 30% recovery — the honesty of the assumption decides whether the 9% is compensation or illusion.",
    },
    {
      q: "A large slice of a product's yield comes from token incentives. How should you book it?",
      options: ["Ignore it entirely", "Count it — but write the emissions end date beside it, since incentives are finite by construction and that's a yield cliff", "Treat it as sustainable long-term yield", "Count it only in bull markets"],
      answer: 1,
      explain: "The emissions schedule sits in the tokenomics docs with a definite end. A 15% product where 10% is emissions is a 5% product plus a countdown — and money usually runs before the cliff.",
    },
    {
      q: "Rates fall 300bp. For a tokenized Treasury fund, that means?",
      options: ["The product goes bankrupt", "The product is undamaged, but the yield falls from ~4.8% to ~1.8%, weakening its reason to exist as AUM leaves — the sector's Fed beta", "No effect, because it's tokenized", "Redemptions get suspended"],
      answer: 1,
      explain: "These products transport rather than create yield, so they track the base rate directly. Not a risk event — a physical property you should know in advance.",
    },
    {
      q: "Facing a “low-risk RWA” advertising 30% annually, the most professional move is?",
      options: ["Decompose its six yield sources into a detailed analysis", "Test it with a small position first", "Walk away — no legal RWA class sustainably yields 30% unlevered; this is a kill criterion, not an analysis problem", "Ask for more transparency, then decide"],
      answer: 2,
      explain: "Stage 12.3's triage logic: cheap kills first. 30% fails on arithmetic, and time spent decomposing it only baits the sunk-cost hook.",
    },
  ],

  further: [
    { label: "US Treasury: daily yield curve rates (the official base rate)", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve" },
    { label: "FRED: 3-month Treasury bill yield (historical base)", url: "https://fred.stlouisfed.org/series/DTB3" },
    { label: "SEC Investor Alerts & Bulletins (high-yield investment risks)", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts" },
    { label: "Investopedia: Credit Spread (how spreads get priced)", url: "https://www.investopedia.com/terms/c/creditspread.asp" },
    { label: "rwa.xyz: tokenized Treasury yields side by side", url: "https://app.rwa.xyz/treasuries" },
  ],
};
