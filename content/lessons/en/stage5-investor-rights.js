export default {
  id: "investor-rights",
  stage: 5,
  order: 4,
  title: "When Things Go Wrong: Redemption, Liquidation & Recourse",
  difficulty: "systems",
  prereqs: ["token-vs-claim"],

  oneLiner:
    "The yield is printed at the top of the landing page; the recourse path is written on page 87 of the offering documents — experts read page 87 first. On calm days what you need are the redemption terms: how often you can exit, how much notice, and when the issuer may slam the gate. On bad days what you need are the default mechanics: what counts as an event of default, who seizes the collateral on holders' behalf, and which layer of the liquidation waterfall you stand in. Remember the three orders of magnitude: on-chain transfers take seconds, redemptions take days, default recourse takes years. Answer the five downside questions before you buy, and you're already ahead of 90% of RWA investors.",

  intuition: `
Start with a real timing comparison. In late 2022 and through 2023, a borrower pool on the on-chain credit protocol Goldfinch went into default: the borrower — Tugende, a Ugandan motorcycle-finance company — couldn't pay. For token holders, the road from “default showing on the dashboard” through “restructuring talks” to “partial recovery” took **years**. And all that time, the pool tokens in their wallets still transferred in seconds.

That is the most overlooked lesson in RWA: **on-chain liquidity is transfer liquidity, not recourse liquidity**. However fast the token moves, when the underlying asset breaks, your money crawls back along a legal procedure: default determination, grace period, acceleration, collateral disposal, waterfall distribution — each step measured in weeks and months, all of it written in the dozens of pages you didn't read when you bought.

Stage 5.1 taught you to know whether you're a shareholder, creditor, or LLC member; Stage 5.2 taught you to inspect the firewall. This lesson closes the stage: **read the complete bad-day script in advance, on a good day.** The script has two acts — Act One is the **normal exit** (redemption terms: how wide the door is, how often it opens, when it gets welded shut), and Act Two is the **abnormal exit** (default, liquidation, recourse: how the queue forms, who fights for you, how long it takes).

By the end you'll have a **five-question downside checklist** you can apply to any RWA product. A product that can't answer all five — however seductive the yield — means you should at least know exactly what you're gambling on.

**Here's the map — 5 parts:**

- **① A taxonomy of redemption terms: how wide the door is, how often it opens**
- **② Events of default & acceleration: the collateral agent acts for you**
- **③ The liquidation waterfall: walking the tranche math with numbers**
- **④ Standing: whom can 3,000 pseudonymous holders sue**
- **⑤ Real outcomes + the five downside questions**
`,

  mechanics: `
### ① A taxonomy of redemption terms: how wide the door is, how often it opens

Redemption is the **front door** for turning tokens back into cash (the second airlock of Stage 1.1). Read any product's redemption terms along six dimensions:

- **Frequency**: daily? monthly? quarterly? Private-credit products are often quarterly with year-plus lockups; money-market-style funds can be daily.
- **Notice period**: how far ahead you must file — anywhere from T+0 to 90 days. A 90-day notice period means that in a crash, you watch the market fall for 90 days.
- **Minimums & fees**: minimum redemption size (institutional products like BUIDL deal in millions); redemption fees (0–2%, sometimes declining with holding period).
- **Cash or in-kind**: cash is cleanest; in-kind hands you the underlying itself — PAXG redemption gives you a bar, and some funds, in extremis, hand you a basket of bonds to liquidate yourself.
- **Gates** — the most critical and most skipped line: the terms almost always say that when redemption requests in a day/period exceed some share of net assets (commonly 5%–10%), the issuer **may suspend or pro-rate redemptions**. This is the lesson learned from traditional money-market-fund (MMF) runs: the exit has a fixed width, and when everyone rushes it at once, the only option is the gate. **A gate is not a scam — it's a disclosed rule**, but it means “daily redemption” silently becomes “queue slowly” in a crisis (Stage 9.4 shows how price then detaches from NAV).
- **The new gold standard and its limit**: BUIDL added a **24/7 instant USDC redemption facility** — swap BUIDL to USDC in seconds, weekends included. But mind the mechanism: it's a **pre-funded conversion pool with finite capacity**. It solves the experience of “small amounts leave anytime,” not the capacity of “everyone leaves at once” — in the extreme, the ultimate backstop is still the fund-level traditional redemption process.

### ② Events of default & acceleration: the collateral agent acts for you

Front door done — now the back door: **default**. Take a note structure like USDY (Stage 5.1 told you you're a secured creditor). The documents contain a section called **Events of Default**, with typical triggers: missed principal or interest, the collateral ratio falling below a floor (e.g., collateral market value < 100% of the debt), issuer bankruptcy or cessation of business, breach of key covenants (such as diverting collateral).

The mechanism that fires next is **acceleration**: all debt, whatever its original schedule, becomes **immediately due and payable in full**. Who pulls the trigger? Not you — the **collateral agent**. USDY's is Ankura Trust: it holds a **first-priority security interest** in the collateral (Treasuries + bank deposits) on behalf of all holders, and on default it may **seize and liquidate the collateral**, distributing proceeds pro-rata. Note the design intent: thousands of holders can't each race to court for the collateral, so **the collective-action problem is solved by one agent acting for everyone** — your protection isn't on the chain, it's in the collateral agency agreement.

### ③ The liquidation waterfall: walking the tranche math with numbers

After default, the assets are liquidated — who gets what? Follow the **waterfall**, top down: **secured creditors → administrative costs → senior notes → junior/equity**. Each layer fills completely before the next gets a cent.

Walk a tokenized credit pool with numbers. The pool is $10M in two tranches: **senior $8M at 8%; junior $2M at 15%**. Why does junior earn more? Because it's the senior tranche's **shield** — losses eat it first.

- **10% loss ($1M gone, $9M left)**: senior's $8M is paid first — covered, senior loses **nothing**; the remaining $1M goes to junior — $2M gets back $1M, a **50% loss**.
- **20% loss ($2M gone, $8M left)**: senior takes exactly its $8M, **0% loss**; junior is **wiped out, −100%**.
- **30% loss ($3M gone, $7M left)**: junior is long dead, and now senior bleeds: it recovers $7M, a **12.5% loss**.

<figure><svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><text x="320" y="20" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">$10M credit pool: losses consume tranches from the bottom up</text><rect x="60" y="40" width="150" height="90" rx="8" fill="var(--green-soft)" stroke="var(--line)"/><text x="135" y="76" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">Senior $8M · 8%</text><text x="135" y="94" text-anchor="middle" font-size="9" fill="var(--muted)">loses last · paid first</text><rect x="60" y="134" width="150" height="46" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="135" y="154" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="700">Junior $2M · 15%</text><text x="135" y="170" text-anchor="middle" font-size="9" fill="var(--orange-ink)">loses first · paid last (shield)</text><rect x="255" y="40" width="150" height="90" rx="8" fill="var(--green-soft)" stroke="var(--line)"/><text x="330" y="76" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">Senior: 0% loss</text><text x="330" y="94" text-anchor="middle" font-size="9" fill="var(--muted)">$8M paid in full</text><rect x="255" y="134" width="150" height="46" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="330" y="154" text-anchor="middle" font-size="11" fill="var(--red)" font-weight="700">Junior: −100%</text><text x="330" y="170" text-anchor="middle" font-size="9" fill="var(--red)">$2M wiped out</text><text x="330" y="200" text-anchor="middle" font-size="10" fill="var(--muted)">↑ outcome at a 20% loss</text><rect x="450" y="40" width="150" height="90" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="525" y="76" text-anchor="middle" font-size="11" fill="var(--red)" font-weight="700">Senior: −12.5%</text><text x="525" y="94" text-anchor="middle" font-size="9" fill="var(--red)">only $7M to distribute</text><rect x="450" y="134" width="150" height="46" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="525" y="154" text-anchor="middle" font-size="11" fill="var(--red)" font-weight="700">Junior: −100%</text><text x="525" y="200" text-anchor="middle" font-size="10" fill="var(--muted)">↑ outcome at a 30% loss</text><text x="135" y="200" text-anchor="middle" font-size="10" fill="var(--muted)">↑ structure (no losses)</text></svg></figure>

How to read this math forever after: **junior thickness = senior's safety cushion**. A 20% junior tranche means senior is untouched for any loss up to 20%. Before buying any tranched product, the first number to find is how thick the layer above (or below) you is — this exact tranche math replays in Stage 10.3's Maple / Goldfinch cases.

### ④ Standing: whom can 3,000 pseudonymous holders sue

Assume the worst: the collateral falls short and the issuer stonewalls. Can 3,000 pseudonymous holders across 40 countries actually litigate? This is the problem of **standing & collective action**, and practice offers four mechanisms:

- **The trustee / collateral agent acts in holders' place**: the bond world's standard answer — an indenture trustee or collateral agent sues, enforces, and settles **in its own name for all holders**. You never appear — but it also means **you can't jump the queue**: most note terms carry a “no individual action” clause, precisely to stop lone holders from racing off and wrecking a coordinated enforcement.
- **Holder meetings & quorum**: major decisions (waiving a default, restructuring terms) go to a holders' vote, with thresholds like 25% quorum and 66%+ approval. One genuine tokenization benefit: **an on-chain holdings snapshot makes “who gets to vote” verifiable**.
- **LLC members: mostly on your own**. Structures like RealT have no trustee fighting for you; your rights are whatever the operating agreement says — typically a vote to replace the manager, with individual lawsuits rarely worth their cost.
- **Class actions & the cross-border reality**: securities-type products in the US also have the class-action route. But lay out the geography: your claim is governed by **Delaware law**, you live in **Singapore**, the assets sit in **London** — you must win in a US court, then take the judgment to England for recognition and enforcement. Every hop costs money and years. This is the invoice version of Stage 5.3's rule that enforceability must anchor somewhere.

### ⑤ Real outcomes + the five downside questions

Three real timelines to calibrate your expectations:

- **Goldfinch / Tugende (2022–)**: Ugandan motorcycle loans default → disclosure, restructuring talks, phased partial recovery — **measured in years**, at recoveries far below face value.
- **Maple / Orthogonal (2022)**: FTX's collapse takes down trading firm Orthogonal; roughly $36M of uncollateralized loans on Maple default → pools written down, the protocol redesigned toward overcollateralization — lenders ate the loss, and **there was no collateral to seize**, because the loans were unsecured by design.
- **Celsius (2022–2024)**: about a year and a half of bankruptcy proceedings; depositors ultimately received **partial recovery paid in a mix of crypto and equity** — not a total loss, but far from whole, with funds frozen throughout.

Finally, compress the whole lesson into the **five downside questions** — dig the answers out of the documents before buying any RWA:

- **Ask about redemption**: how often can I exit? How long is the notice period? Under what conditions can the issuer gate?
- **Ask about the default definition**: what counts as an event of default? At what collateral ratio does it trigger? Who monitors and who declares?
- **Ask about the enforcer**: after default, **who** acts for holders — who is the trustee/collateral agent? (No such role = you'll be litigating across borders yourself.)
- **Ask about priority**: which layer of the waterfall am I in? How thick is the cushion below me?
- **Ask about time**: from default to money back, what does the document realistically imply? My funds are frozen for that entire stretch — can I carry that?

If you take away one sentence: **the yield is printed at the top; the recourse path is written on page 87 — experts read page 87 first, because on the bad day, your money travels the page-87 road.**
`,

  demo: "default-scenario",

  analogy: `
Think of an RWA product as a building's **fire-safety system**. The landing page shows you the lobby: chandeliers, marble, the rental-yield poster by the door. A seasoned tenant walks in and checks two other things first: **the fire-escape map** and **how wide the stairwells are**.

Redemption terms are the escape map: on ordinary days the elevator (the instant redemption facility) is fast and elegant; but the fine print says — in a fire alarm the elevators stop (the gate comes down), please use the stairs (the standard redemption process), the stairs admit 10% of residents at a time (pro-rata reduction), and the walk from the 32nd floor to the lobby takes 90 days (the notice period). Nobody reads the fine print on calm days; on fire day it decides everything.

The liquidation waterfall is the building's **floor plan**: floodwater (losses) rises from the basement. The junior tranche lives in the basement — its rent is cheap (yield is high) because the water reaches it first; the senior tranche lives on the 8th floor and won't wet its shoes unless the water tops 20%. Before signing the lease, the question isn't “how's my view” — it's “which floor am I on, and how many floors below me will soak first.”

And the collateral agent is the building's **fire chief**: when it burns, you don't need 3,000 residents each running in with a bucket — the chief executes the preplan, forces doors, salvages property, distributes by unit. A building without a fire chief (certain LLC structures) means 3,000 people @-ing each other in a group chat while it burns. Pick the building by whether it has a chief, then by your floor — and only then by the view.
`,

  misconceptions: [
    "“The token transfers on-chain anytime, so I can exit my investment anytime.” —— Transfer liquidity ≠ recourse liquidity. Transfers take seconds; redemptions take days (plus notice periods and gates); default recourse takes years. Crises maximize the spread: the token still moves, but nobody bids, redemptions queue, and recourse recedes over the horizon.",
    "“The terms let the issuer suspend redemptions — that's a scam signal.” —— The opposite: gates are standard engineering learned from money-market-fund runs. The exit has finite width; a disclosed rule beats a hidden default. The real red flag is terms that DON'T specify when the gate drops and in what order it lifts.",
    "“Junior pays 15% and senior only 8% — obviously buy junior.” —— About 7 of those 15 points are a die-first fee: losses eat upward from the bottom, and at a 20% asset loss junior is at −100% while senior sits at 0%. The yield spread is the price of standing in front of the bullet. Check your waterfall layer before you check the yield.",
    "“If something breaks, I'll just sue the issuer.” —— Individually, you likely can't and shouldn't: note terms usually bar individual suits, routing enforcement through the trustee/collateral agent for all holders; and with you in Singapore, the law in Delaware, and the assets in London, personal cross-border litigation costs more than it recovers. The real pre-purchase check: does the fight-for-you role exist at all.",
    "“There's a collateral agent and collateral, so a default returns my money quickly and in full.” —— 'Secured' sets your priority and eventual recovery, not your speed. Declaring default, acceleration, collateral disposal, distribution — each step runs weeks to months, and shrunken collateral pays pro-rata. Goldfinch, Maple, and Celsius all ran on year-scale clocks — calibrate now so you don't capitulate midway.",
  ],

  quiz: [
    {
      q: "What is a 'gate' in redemption terms?",
      options: ["A security module against hackers", "A disclosed clause letting the issuer suspend or pro-rate redemptions when requests exceed a set share of net assets (commonly 5%–10%)", "A compliance restriction barring US persons", "The whitelist check on token transfers"],
      answer: 1,
      explain: "Gates are standard design learned from MMF runs: the exit has finite width, and when everyone rushes at once, flow gets limited. It turns 'daily redemption' into 'queue slowly' in a crisis — know the trigger conditions before you buy.",
    },
    {
      q: "A $10M pool: senior $8M / junior $2M. At a 20% asset loss, what does each tranche lose?",
      options: ["Both lose 20%", "Senior loses 20%, junior loses 0%", "Senior: 0% loss; junior: −100% (wiped out)", "Senior −12.5%, junior −50%"],
      answer: 2,
      explain: "The remaining $8M pays senior's $8M exactly in full; junior gets nothing. Losses consume from the bottom up: junior's thickness (20%) is senior's cushion. Only at a 30% loss does senior start bleeding (−12.5%).",
    },
    {
      q: "When USDY defaults, who seizes and liquidates the collateral for all holders?",
      options: ["Ondo itself", "The largest token holder", "The collateral agent, Ankura — holding a first-priority security interest for holders and enforcing collectively on default", "The SEC"],
      answer: 2,
      explain: "Thousands of holders can't each grab at the collateral; the collective-action problem is solved by one agent acting for all. For any note product, confirm who the collateral agent is and which agreement grants its powers — no such role is a red flag.",
    },
    {
      q: "Why do most note terms bar individual holders from suing on their own?",
      options: ["To strip investors of rights", "To stop lone holders from racing off and wrecking coordinated enforcement — the trustee/collateral agent acts collectively for all", "Because courts won't hear token disputes", "To protect the issuer's reputation"],
      answer: 1,
      explain: "It's the bond world's standard no-action clause plus trustee substitution. A lone racer could drain the assets and leave everyone else worse off. The price: you lose individual standing — so verify who the enforcer is before buying.",
    },
    {
      q: "Which of the following is NOT one of the five downside questions?",
      options: ["Redemption frequency, notice period, and gate triggers", "The definition of events of default and who declares them", "My waterfall position and cushion thickness", "Which chain the token is deployed on and its consensus mechanism"],
      answer: 3,
      explain: "All five questions are legal and structural: redemption, default definition, enforcer, priority, time. Chain and consensus shape the transfer experience but never your waterfall position — on the bad day, your money travels the documents' road, not the chain's.",
    },
  ],

  further: [
    { label: "Ondo: USDY documentation (events of default, collateral agent & redemption)", url: "https://docs.ondo.finance/" },
    { label: "SEC investor education: interval funds & redemption limits", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/interval-funds" },
    { label: "Goldfinch governance forum: Tugende default disclosure & restructuring", url: "https://gov.goldfinch.finance/" },
    { label: "Maple Finance: official disclosures on the Orthogonal default (Dec 2022)", url: "https://maple.finance/news/" },
    { label: "Celsius bankruptcy docket (distribution plan & recovery details)", url: "https://cases.stretto.com/celsius/" },
  ],
};
