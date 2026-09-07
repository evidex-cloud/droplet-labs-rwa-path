export default {
  id: "stablecoin-regulation",
  stage: 4,
  order: 4,
  title: "Stablecoin Law: The GENIUS Act & MiCA E-money",
  difficulty: "core",
  prereqs: ["stablecoin-anatomy"],

  oneLiner:
    "In July 2025 the United States signed its first federal crypto law — the GENIUS Act — nailing the “payment stablecoin” down as a licensed, 1:1 HQLA-reserved, monthly-disclosed instrument that may not pay interest. The EU's MiCA got there first, caging stablecoins as “e-money” with redemption at par as a legal right. Different paths, same verdict: the fiat-backed model got officially legitimized, and algorithmic pegs got shown the door. And the interest ban's deepest consequence is that it split the market in two — non-yielding “payment dollars” and securities-wrapped “yield dollars,” the latter being the protagonists of Stage 10.",

  intuition: `
Stage 4.3 ended on a planted question: USDC repegged because the Treasury, the Fed, and the FDIC jointly backstopped SVB on a Sunday night — **the state effectively rescued a stablecoin**. So naturally: why should the state backstop for free? Of course it will write the rules.

Look at stablecoins through a regulator's eyes and four glaring facts appear: they **look like bank deposits** (on-demand, fixed face value) yet carry **no deposit insurance** — textbook run risk; they are already **payments infrastructure** ($250–300 billion as of 2025, trillions in annual transfer volume) — too big to ignore; they are a **sanctions and AML surface** (a borderless dollar pipe); and in Argentina, Turkey, and Nigeria, USDT is quietly replacing local currencies — a **monetary sovereignty** problem that keeps other countries' central bankers awake.

So in 2023–2025 the world's two big regulatory systems moved: the EU folded stablecoins into **MiCA**'s “e-money token” framework (applicable from June 2024); the US signed the **GENIUS Act** in July 2025 — the first federal crypto statute in American history. This lesson takes both laws apart: what each governs, punishes, and permits — plus one seemingly minor clause that reshapes the entire RWA landscape: the **interest ban**. By the end you'll see that legislation didn't sentence stablecoins to death; it handed them a business license with the boundaries written out.

**Here's the map — five parts:**

- **① Stablecoins through a regulator's eyes: four reasons they can't look away**
- **② The GENIUS Act: six conditions on a federal license**
- **③ The interest ban's second-order effect: a market split into two species**
- **④ The EU's MiCA: EMTs, ARTs & “redemption at par is a legal right”**
- **⑤ Two regulatory philosophies, one shared conclusion**
`,

  mechanics: `
### ① Stablecoins through a regulator's eyes: four reasons they can't look away

Replay Stages 4.1–4.3 from the regulator's seat and the logic surfaces on its own:

- **Run risk, uninsured**: a stablecoin is “the deposit experience, minus deposit insurance.” The USDC weekend of 2023 proved that runs not only happen — they happen at on-chain speed. Banks have the FDIC and the Fed's discount window; stablecoins have neither. When things break, the only recourse is an improvised bailout.
- **Payments-system importance**: once an instrument settles trillions a year, its failure stops being “one company's problem” and becomes a systemic event. Payment systems are heavily regulated in every country on earth.
- **Sanctions and AML exposure**: permissionless global dollar transfers are both the product's selling point and OFAC's nightmare. Issuers must be able to freeze and cooperate with law enforcement (the “switches” of Stage 6.5 exist precisely for this).
- **Monetary sovereignty**: in high-inflation economies, de facto “dollarization” via USDT erodes local monetary policy. This is the direct motive for the EU's usage caps on non-euro stablecoins (see ④).

### ② The GENIUS Act: six conditions on a federal license

The **GENIUS Act** (Guiding and Establishing National Innovation for U.S. Stablecoins, signed July 2025) creates a new regulated species — the **“permitted payment stablecoin issuer.”** Six conditions to hold the license:

- **Licensed entities only**: issuance is restricted to **bank subsidiaries** or **approved nonbank institutions**, under a **dual federal/state track** (large issuers federal, smaller ones may take state licenses). Issuing a payment stablecoin without a license becomes illegal.
- **1:1 reserves in high-quality liquid assets (HQLA)**: reserves may only be cash, **T-bills maturing within 93 days**, overnight repo, government money-market fund shares, and the like — the very top of Stage 4.2's quality ladder, written into statute. Commercial paper, corporate bonds, crypto: out.
- **Monthly public disclosure + executive certification**: reserve composition published monthly, with the CEO/CFO **personally certifying** accuracy (false statements carry criminal exposure) — the “attestations are too weak” problem from Stage 4.2, patched Sarbanes-Oxley style.
- **Holder priority in insolvency**: if the issuer fails, stablecoin holders' claims on the reserves **rank ahead of other creditors** — a direct answer to the old “what happens to my coins if Tether collapses” question (the legal-wrapper details unfold in Stage 5.4).
- **Redemption duty**: issuers must establish and disclose a timely redemption policy.
- **The interest ban**: permitted issuers **may not pay holders interest or yield in any form** — a clause that looks like a technicality and actually redraws the map of the entire market. It deserves its own section (③).

One-line summary: GENIUS takes the “best practices of a compliant issuer” described in Stage 4.1 and **makes them mandatory**, writing 4.2's disclosure problem and 4.3's run problem straight into statute.

### ③ The interest ban's second-order effect: a market split into two species

Why would legislators forbid the issuer from passing you the 4–5% T-bill yield? Two reasons. First, **a yield-paying “digital dollar” is functionally a bank deposit or a money-market fund**; letting it bypass both banking law and securities law would hollow out two regulatory regimes at once. Second, bank lobbying — yield-paying stablecoins would siphon deposits at scale.

But what you should remember is the **second-order effect**. Demand for yield doesn't vanish; it reroutes:

- **Payment stablecoins** (USDC, USDT, under GENIUS): no yield, freely transferable, used as money. The yield goes to the issuer.
- **Yield dollars** (BUIDL, USDY, etc. — Stages 10.1/10.2): they pay yield, but **must be issued as securities** — restricted audiences (qualified purchasers / non-US persons), transfer restrictions, KYC whitelists. The yield goes to holders; the freedom goes to zero.

<figure>
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
<defs><marker id="sr-ah-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--orange-line)"/></marker></defs>
<rect x="230" y="16" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
<text x="320" y="38" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">“a dollar on-chain”</text>
<text x="320" y="56" text-anchor="middle" font-size="10" fill="var(--muted)">does it pay yield? — the legal fork</text>
<line x1="270" y1="68" x2="160" y2="120" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#sr-ah-en)"/>
<line x1="370" y1="68" x2="480" y2="120" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#sr-ah-en)"/>
<text x="180" y="92" text-anchor="middle" font-size="10" fill="var(--orange-ink)">no yield</text>
<text x="462" y="92" text-anchor="middle" font-size="10" fill="var(--orange-ink)">pays yield</text>
<rect x="30" y="126" width="260" height="100" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
<text x="160" y="150" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">Payment stablecoin (GENIUS / MiCA EMT)</text>
<text x="160" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">USDC · USDT</text>
<text x="160" y="190" text-anchor="middle" font-size="10" fill="var(--muted)">used as money: free transfer, no investor gate</text>
<text x="160" y="208" text-anchor="middle" font-size="10" fill="var(--muted)">yield → issuer</text>
<rect x="350" y="126" width="260" height="100" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="480" y="150" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="600">Yield dollar (securities wrapper)</text>
<text x="480" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">BUIDL · USDY (Stage 10)</text>
<text x="480" y="190" text-anchor="middle" font-size="10" fill="var(--muted)">an investment: accredited only, restricted, whitelisted</text>
<text x="480" y="208" text-anchor="middle" font-size="10" fill="var(--muted)">yield → holders</text>
</svg>
</figure>

Understand this figure and you understand the engine behind tokenized Treasuries rocketing from zero to $7–8 billion in 2024–2025: **the interest ban dug the moat for tokenized money funds with its own hands.** A dollar token that pays you must, under US law, be a security — so BlackRock and Franklin Templeton simply built under securities law, bolting on transfer restrictions with the permissioned token standards of Stage 6. A payments statute became, indirectly, the best advertisement RWA securitization ever had.

### ④ The EU's MiCA: EMTs, ARTs & “redemption at par is a legal right”

The EU moved earlier and more comprehensively. **MiCA** (the Markets in Crypto-Assets Regulation; its stablecoin provisions applicable since June 2024) splits pegged tokens into two classes:

- **EMT (e-money token)**: pegged to a **single fiat currency** (USDC and EURC qualify). The issuer must be a licensed **e-money institution or credit institution**, and holders enjoy a **legal right to redeem at face value at any time** — note the wording: not the issuer's promise, but **a claim written into EU regulation**, enforceable in court.
- **ART (asset-referenced token)**: pegged to a basket (multiple currencies, commodities, etc.) — under stricter rules.

Supporting requirements: prior authorization and a whitepaper, **own-funds** capital floors, segregated custody of reserves with restricted investment, and a ban on paying interest (converging with GENIUS). The most distinctively European clause: **usage caps on large non-euro EMTs** — once a dollar stablecoin's payment usage in the euro area crosses thresholds (e.g. one million transactions or €200 million per day), regulators can order issuance halted. The motive is stated openly: **protecting the euro's monetary sovereignty**, lest euro-area payments be quietly taken over by dollar tokens.

The real-world consequences were immediate: **Tether declined to seek MiCA authorization** and was delisted from several EU exchanges from late 2024; **Circle obtained a French e-money license**, keeping USDC/EURC compliant in Europe. One market, two choices — the cost of regulatory arbitrage became visible to the naked eye for the first time. The full MiCA landscape and the DLT Pilot Regime unfold in Stage 11.2.

### ⑤ Two regulatory philosophies, one shared conclusion

Set the two laws side by side:

- **EU = comprehensive and ex-ante**: build the full framework first (authorization, whitepaper, own funds, conduct rules), then let anyone in — like a driver's license: pass the test, then drive. The cost: high compliance burden and the risk of innovation moving offshore.
- **US = reserves-and-disclosure centric**: don't re-architect the industry; grab the two jugulars — reserves must be HQLA, disclosures monthly with executives personally on the hook — like guardrails and speed cameras: the road stays open, crossing the line gets expensive.

But the **shared conclusion** matters more than the differences:

- **The fully-reserved fiat model got officially legitimized** — the USDC-style “Treasuries + cash + disclosure” recipe is now the global template;
- **Algorithmic stablecoins got shown the door** — MiCA simply won't authorize an unreserved peg, and GENIUS's reserve rules leave UST-style designs nowhere to register. Law ratified the market's verdict from Stage 4.1: real assets must stand at the far end of the arbitrage channel;
- **Interest is banned on both sides** — “stablecoin” is now legally pinned as a **non-yielding payment instrument**, and the demand for yield is pushed wholesale into the world of securities law.

If you take away one sentence: **legislation drew stablecoins a clean cage — 1:1 quality reserves, monthly disclosure, redemption on demand, no interest — inside the cage lives a payment tool; the yield-paying world outside the cage is called a security (see Stage 10).**
`,

  demo: "stablecoin-rules",

  analogy: `
Think of stablecoin regulation as the **health-permit system for restaurants**. In the era of unregulated street stalls, anyone could set up a wok and sell lunch: most vendors were honest, but every few years came a mass food-poisoning incident (the UST “poisoning” took down $40 billion). Diners could only judge hygiene by the stall's paint job and the owner's patter — trust by gut feel.

Enter the health permit. Want to hang a “restaurant” sign? Your kitchen must use certified ingredients (HQLA reserves), submit to monthly surprise inspections with results posted at the door (monthly disclosure), the owner signs the inspection report personally (executive certification), and if someone gets sick, diners get compensated before the landlord does (holder priority). Can't manage that? Fine — but you may not call yourself a restaurant, and no shopping mall will lease to you (unlicensed issuance is illegal).

The EU and the US are two health departments with different styles. The European one writes the full 200-page Restaurant Operations Code first, reviews your floor plan, and examines you before granting the license — rigorous, but the small stall owners flee (Tether exiting EU venues). The American one watches exactly two things: the cold chain and the notice board — everything else is your business, but cross those lines and the fines are ruinous.

The subtlest rule is the one that says “restaurants may not pay rebates to diners” (the interest ban). Want to share profits with your customers? Then you're not running a restaurant — you're **raising capital**. Please queue next door at the securities regulator (Stage 10's BUIDL and friends are the model students in that queue). One rule, and “places to eat” and “places to invest” became two permanently separate industries.
`,

  misconceptions: [
    "“Regulation landing = a crackdown on stablecoins.” —— The opposite. GENIUS and MiCA hand compliant issuers an explicit business license, replacing the sword of “might be banned someday” with written rules — which is exactly why institutional money finally dared to enter at scale. The only things cracked down on are unreserved algorithmic designs and players who refuse to license.",
    "“The GENIUS Act gives stablecoins a government guarantee, like deposit insurance.” —— It does not. The Act provides reserve rules, disclosure duties, and insolvency priority — not FDIC-style insurance. If the issuer fails you stand ahead of other creditors, but if the reserves truly have a hole, the loss is still yours.",
    "“The interest ban is a technicality with little impact.” —— It is the watershed of the whole RWA landscape: yield demand was rerouted into securities law, directly creating the $7–8B tokenized-Treasury lane (BUIDL/USDY). Understanding this one clause is the key to understanding Stage 10.",
    "“MiCA and GENIUS are basically the same thing.” —— Different philosophies: the EU authorizes comprehensively ex-ante (whitepaper, own funds, usage caps); the US focuses on reserves + disclosure. Different consequences too: Tether left EU venues while maneuvering within the US framework; USDC complied on both sides. An issuer's choice of jurisdiction is itself a signal.",
    "“The laws passed, but algorithmic stablecoins are just out of fashion — they'll be back.” —— In the major US and EU markets, unreserved pegs are now institutionally excluded: MiCA won't authorize them and GENIUS's HQLA rules leave them nowhere to register. They may survive in offshore gray zones, but the path to being “part of the regulated financial system” has been welded shut.",
  ],

  quiz: [
    {
      q: "What is the GENIUS Act's core requirement for reserve assets?",
      options: [
        "Reserves may be invested freely as long as they're disclosed",
        "1:1 in high-quality liquid assets — cash, T-bills within 93 days, overnight repo, government MMFs; commercial paper and crypto are out",
        "At least 50% in gold",
        "Everything must be deposited at the Federal Reserve",
      ],
      answer: 1,
      explain: "The top rung of Stage 4.2's quality ladder, written directly into statute — the legislators' definition of “good reserves” matches the market's hard-earned lessons exactly.",
    },
    {
      q: "What is the deepest market consequence of GENIUS banning interest payments to holders?",
      options: [
        "Stablecoin supply shrinks",
        "Yield demand reroutes into securities law, creating the tokenized-Treasury category (BUIDL/USDY) — the market splits into “payment dollars” and “yield dollars”",
        "Everyone switches to algorithmic stablecoins",
        "Banks stop issuing stablecoins",
      ],
      answer: 1,
      explain: "The interest ban dug the moat for tokenized money funds: a yield-paying dollar token must be a security under US law, so asset managers built exactly that (Stage 10).",
    },
    {
      q: "Under MiCA, what is the nature of an EMT holder's “redemption at par”?",
      options: [
        "A voluntary promise by the issuer",
        "A term of service of the exchange",
        "A legal right written into EU regulation — a claim enforceable in court",
        "Available to institutional clients only",
      ],
      answer: 2,
      explain: "This is MiCA's essential difference from “whatever the whitepaper says”: redemption at par upgraded from a commercial promise to a legal obligation.",
    },
    {
      q: "Why does MiCA impose usage caps on large non-euro EMTs?",
      options: [
        "To reduce blockchain congestion",
        "To protect the euro's monetary sovereignty — preventing euro-area daily payments from being de facto taken over by dollar stablecoins",
        "To fight tax evasion",
        "To favor local exchanges",
      ],
      answer: 1,
      explain: "Monetary sovereignty is one of the four regulatory motives — and the EU turned it into concrete transaction-count and volume thresholds.",
    },
    {
      q: "What conclusion do the US and EU regimes share despite different philosophies?",
      options: [
        "All stablecoins should pay interest",
        "The fully-reserved fiat model is officially blessed, algorithmic stablecoins are institutionally excluded, and interest is banned on both sides",
        "Stablecoins should be issued only by central banks",
        "Reserves should be kept secret to prevent runs",
      ],
      answer: 1,
      explain: "Law ratified the market's verdict: real assets must stand at the end of the arbitrage channel, and “stablecoin” is legally pinned as a non-yielding payment instrument.",
    },
  ],

  further: [
    { label: "GENIUS Act bill text (US Congress)", url: "https://www.congress.gov/bill/119th-congress/senate-bill/1582" },
    { label: "MiCA full text (EUR-Lex, Regulation 2023/1114)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114" },
    { label: "ESMA: MiCA topic page (implementing rules & timeline)", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" },
    { label: "BIS: stablecoins and the monetary system (a classic regulatory analysis)", url: "https://www.bis.org/publ/work905.htm" },
  ],
};
