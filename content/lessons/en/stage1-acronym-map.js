export default {
  id: "acronym-map",
  stage: 1,
  order: 4,
  title: "The Acronym Map",
  difficulty: "intro",
  prereqs: [],

  oneLiner:
    "This lesson teaches nothing new — it just hands you a map: the forty-plus acronyms of the RWA world, sorted onto six “metro lines” — assets & finance, structure & law, chains & standards, compliance, data, and regulators — each with a one-line definition and a pointer to the stop on this course that teaches it in depth. You don't need to memorize anything: every term will formally introduce itself in its own stage. The cure for acronym anxiety isn't memory — it's knowing that every term has a home, a line, and a station where it gets fully explained.",

  intuition: `
Everyone entering the RWA world goes through the same suffocation: you open an industry article, and one paragraph hurls SPV, Reg D, NAV, KYC, ERC-3643, PoR, ATS at your face — you recognize none of them, each one seems important, you look one up and forget the last, and by the fifth lookup you've forgotten what the article was about. **This feeling has a name: acronym anxiety.** It drives away more people than any technical difficulty ever has.

This lesson exists to kill it, and the methodology is humble: **fear comes from not having a map.** Forty-plus acronyms scattered in front of you are a tangle; but they naturally belong to six families — just as a city's hundreds of metro stations sound terrifying until someone draws them as six color-coded lines, and suddenly it's all legible. You don't need to memorize the stations. You only need to know: **the red line is asset finance, the blue line is legal structure, the green line is on-chain standards**… Next time an acronym ambushes you in an article, you won't panic — you'll calmly think: “ah, compliance line — Stage 7 covers that.”

Three rules of use. First, **don't memorize** — every term will formally meet you in its own stage, with a full lesson, examples, and a demo; for now, a passing acquaintance is plenty. Second, **come back** — this page is your permanent tool page; whenever a forgotten term ambushes you in any later stage, swing by for a glance. Third, **play with the demo below** — filter by line, search, flip cards; five minutes of walking the six lines beats reading the list ten times.

**Here's the map — 6 parts (six lines):**

- **① The assets & finance line: the language of money itself**
- **② The structure & law line: the stack of paper behind the token**
- **③ The chains & standards line: part numbers of the code world**
- **④ The compliance line: the letters on the gates**
- **⑤ The data line: the jargon of carrying facts on-chain**
- **⑥ The regulators line: the license-givers and their laws**
`,

  mechanics: `
### ① The assets & finance line: the language of money itself

This line's terms come from traditional finance's daily life; Stage 3 is their home turf. RWA is, at bottom, a financial product — these ten words are the ticket in:

- **RWA** (Real-World Asset) — the umbrella term for turning the rights to a real-world asset into an on-chain token → Stage 0.1
- **T-Bill** (Treasury Bill) — US government debt of one year or less, issued at a discount; RWA's number-one underlying asset → Stage 3.2
- **MMF** (Money Market Fund) — a cash-management fund that buys short-term debt; the traditional prototype of the tokenized Treasury fund → Stage 3.3
- **NAV** (Net Asset Value) — (assets − liabilities) ÷ shares, the once-a-day “what is each share worth” a fund computes → Stage 3.3
- **AUM** (Assets Under Management) — how much money a fund or institution manages; the universal yardstick of size → Stage 3.3
- **bp** (basis point) — one ten-thousandth, i.e. 0.01%; a “15bp management fee” = 0.15% → Stage 3.2
- **DvP** (Delivery versus Payment) — cash and securities change hands simultaneously, no exposure left open; on-chain atomic settlement is its perfect form → Stage 3.4
- **T+1** — settlement one business day after the trade; US equities moved from T+2 to T+1 in May 2024 → Stage 3.4
- **LP** (Limited Partner) — the investor in a private fund who puts in money but doesn't run things → Stage 3.5
- **PE** (Private Equity) — equity investment in unlisted companies; the classic illiquid asset → Stage 3.5

### ② The structure & law line: the stack of paper behind the token

This line decides “what your token legally is”; Stages 5, 7, and 11 take turns hosting. These are the highest-frequency terms in any RWA offering document:

- **SPV** (Special Purpose Vehicle) — a “shell company” born to hold exactly one asset; the bankruptcy-remoteness firewall → Stage 5.2
- **PPM** (Private Placement Memorandum) — the “instruction manual” of a private offering; every risk and term lives in it → Stage 12.2
- **Reg D** — the US private-placement exemption: sell without registering, but generally only to accredited investors → Stage 7.2
- **Reg S** — the offshore-offering exemption: sell only to non-US persons and skip registration → Stage 7.2
- **Reg A+** — the “mini-IPO” exemption, up to $75M per year, open to the public → Stage 11.1
- **AI** (Accredited Investor) — the US threshold: $1M net worth (excluding primary residence) or $200k/$300k income → Stage 7.2
- **QP** (Qualified Purchaser) — one tier higher: $5M+ in investable assets; the entry bar for funds like BUIDL → Stage 7.2
- **ATS** (Alternative Trading System) — a licensed “mini-exchange” for matching securities trades; the legal venue for security-token secondary markets → Stage 11.1
- **TA** (Transfer Agent) — the licensed keeper of the shareholder register; whether an on-chain token can legally BE the register is a legal question → Stage 3.4
- **Rule 144** — the resale rule for private securities: generally a 12-month lockup before you can sell on → Stage 11.1
- **Howey** — the Howey test: investment of money + common enterprise + expectation of profit + from others' efforts = a security; the SEC's yardstick → Stage 11.1

### ③ The chains & standards line: part numbers of the code world

This line is engineer territory; Stage 2 lays the foundation and Stage 6 covers the specialized standards. Everything starting with “ERC” is a numbered Ethereum token standard:

- **ERC-20** — the fungible-token standard, at heart an “address → balance” table; transfers check nothing but balances, so it can't hold securities rules → Stage 2.4
- **ERC-721** — the NFT standard: every token unique; suited to certificates for indivisible assets like “the whole building” → Stage 2.5
- **ERC-3643** — the permissioned-token standard (nicknamed T-REX): every transfer first consults an identity registry; compliance built in → Stage 6.2
- **ERC-4626** — the tokenized-vault standard: “deposit assets, receive yield-bearing shares” as one uniform interface → Stage 6.4
- **EOA** (Externally Owned Account) — an ordinary on-chain account controlled directly by a private key, as opposed to a contract account → Stage 2.2
- **Gas** — the fuel fee of on-chain execution: every operation pays by computational weight → Stage 2.6
- **L1 / L2** — the base chain (Ethereum et al.) and the scaling layers built on top; a core siting decision for RWA issuers → Stage 2.6

### ④ The compliance line: the letters on the gates

This entire line is covered in Stage 7. Remember their shared mission: establishing “who you are, whether your money is clean, and whether you're eligible”:

- **KYC** (Know Your Customer) — identity verification before onboarding: passport, address, source of funds → Stage 7.1
- **AML** (Anti-Money Laundering) — the full system of rules and monitoring that keeps dirty money from being washed clean → Stage 7.1
- **CFT** (Countering the Financing of Terrorism) — AML's twin, watching where money flows to → Stage 7.1
- **OFAC** — the US Treasury's Office of Foreign Assets Control: keeper of the sanctions (SDN) list; touch it and it's a felony → Stage 7.1
- **FATF** (Financial Action Task Force) — the setter of global anti-money-laundering standards → Stage 7.1
- **PEP** (Politically Exposed Person) — public officials and their relatives; a customer category requiring enhanced diligence → Stage 7.1
- **SAR** (Suspicious Activity Report) — the report a financial institution must file when it spots a suspicious transaction → Stage 7.1
- **Travel Rule** — sender and recipient information must “travel” with the money on every transfer; pushed worldwide by FATF → Stage 7.1

### ⑤ The data line: the jargon of carrying facts on-chain

The shortest line, but it holds up the entire mirror sync (the bridge of Stage 1.2); Stage 8 unfolds it in full:

- **Oracle** — the pipeline that signs off-chain facts and writes them into on-chain contracts; a postman, not a detective → Stage 8.1
- **PoR** (Proof of Reserve) — turning “the money is still there” into a periodic, machine-readable on-chain signal → Stage 8.3
- **Heartbeat** — a feed's maximum update interval: even if the price hasn't moved, it must update when the clock runs out → Stage 8.2
- **Deviation** — the deviation threshold: a price move beyond the set percentage triggers an immediate update, working in tandem with the heartbeat → Stage 8.2

### ⑥ The regulators line: the license-givers and their laws

Half of this line is agency names, half is legislation; Stage 11 takes you around the globe:

- **SEC** (US Securities and Exchange Commission) — the US securities regulator; the referee no RWA can route around → Stage 11.1
- **CFTC** (US Commodity Futures Trading Commission) — regulates commodities and derivatives; the other side of the “security or commodity” fight → Stage 11.1
- **MiCA** (Markets in Crypto-Assets Regulation) — the EU's unified crypto framework, fully applicable since December 2024 → Stage 11.2
- **ESMA** (European Securities and Markets Authority) — the EU-level coordinator of securities regulation → Stage 11.2
- **MAS** (Monetary Authority of Singapore) — central bank and financial regulator in one; the operator of Project Guardian → Stage 11.3
- **SFC** (Hong Kong Securities and Futures Commission) — Hong Kong's securities regulator; one of the pioneers of tokenized-product rules → Stage 11.3
- **GENIUS Act** — the US federal payment-stablecoin law, signed July 2025; stablecoins' first major federal statute → Stage 4.4
- **eWpG** (German Electronic Securities Act) — the German law allowing securities to be registered in purely electronic (including blockchain) form → Stage 5.3
- **DLT Pilot** (EU DLT Pilot Regime) — since March 2023, lets licensed institutions experiment with on-chain trading and settlement under relaxed rules → Stage 11.2

<figure><svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><text x="320" y="22" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">The RWA acronym metro map · six lines</text><line x1="120" y1="60" x2="620" y2="60" stroke="var(--orange-line)" stroke-width="3"/><text x="20" y="64" font-size="11" fill="var(--orange-ink)" font-weight="700">① Finance</text><text x="150" y="50" font-size="9" fill="var(--muted)">T-Bill</text><text x="230" y="50" font-size="9" fill="var(--muted)">NAV</text><text x="310" y="50" font-size="9" fill="var(--muted)">MMF</text><text x="390" y="50" font-size="9" fill="var(--muted)">DvP</text><text x="470" y="50" font-size="9" fill="var(--muted)">T+1</text><text x="550" y="50" font-size="9" fill="var(--muted)">bp</text><line x1="120" y1="108" x2="620" y2="108" stroke="var(--line)" stroke-width="3"/><text x="20" y="112" font-size="11" fill="var(--ink)" font-weight="700">② Law</text><text x="150" y="98" font-size="9" fill="var(--muted)">SPV</text><text x="230" y="98" font-size="9" fill="var(--muted)">Reg D/S</text><text x="310" y="98" font-size="9" fill="var(--muted)">PPM</text><text x="390" y="98" font-size="9" fill="var(--muted)">ATS</text><text x="470" y="98" font-size="9" fill="var(--muted)">Howey</text><text x="550" y="98" font-size="9" fill="var(--muted)">QP</text><line x1="120" y1="156" x2="620" y2="156" stroke="var(--orange-line)" stroke-width="3"/><text x="20" y="160" font-size="11" fill="var(--orange-ink)" font-weight="700">③ Standards</text><text x="150" y="146" font-size="9" fill="var(--muted)">ERC-20</text><text x="230" y="146" font-size="9" fill="var(--muted)">ERC-3643</text><text x="320" y="146" font-size="9" fill="var(--muted)">ERC-4626</text><text x="410" y="146" font-size="9" fill="var(--muted)">Gas</text><text x="470" y="146" font-size="9" fill="var(--muted)">L1/L2</text><text x="550" y="146" font-size="9" fill="var(--muted)">EOA</text><line x1="120" y1="204" x2="620" y2="204" stroke="var(--line)" stroke-width="3"/><text x="20" y="208" font-size="11" fill="var(--ink)" font-weight="700">④ Compliance</text><text x="150" y="194" font-size="9" fill="var(--muted)">KYC</text><text x="220" y="194" font-size="9" fill="var(--muted)">AML</text><text x="290" y="194" font-size="9" fill="var(--muted)">OFAC</text><text x="370" y="194" font-size="9" fill="var(--muted)">FATF</text><text x="450" y="194" font-size="9" fill="var(--muted)">PEP</text><text x="520" y="194" font-size="9" fill="var(--muted)">Travel Rule</text><line x1="120" y1="252" x2="620" y2="252" stroke="var(--orange-line)" stroke-width="3"/><text x="20" y="256" font-size="11" fill="var(--orange-ink)" font-weight="700">⑤ Data</text><text x="180" y="242" font-size="9" fill="var(--muted)">Oracle</text><text x="300" y="242" font-size="9" fill="var(--muted)">PoR</text><text x="420" y="242" font-size="9" fill="var(--muted)">Heartbeat</text><text x="540" y="242" font-size="9" fill="var(--muted)">Deviation</text><line x1="120" y1="300" x2="620" y2="300" stroke="var(--line)" stroke-width="3"/><text x="20" y="304" font-size="11" fill="var(--ink)" font-weight="700">⑥ Regulators</text><text x="150" y="290" font-size="9" fill="var(--muted)">SEC</text><text x="220" y="290" font-size="9" fill="var(--muted)">MiCA</text><text x="300" y="290" font-size="9" fill="var(--muted)">MAS</text><text x="370" y="290" font-size="9" fill="var(--muted)">SFC</text><text x="440" y="290" font-size="9" fill="var(--muted)">GENIUS</text><text x="530" y="290" font-size="9" fill="var(--muted)">DLT Pilot</text></svg></figure>

If you take away one sentence: **you don't need to memorize this map — you only need to remember, next time an acronym ambushes you, that it has a line and a station where it gets fully explained, and come back here for a glance.**
`,

  demo: "acronym-map",

  analogy: `
Learning a new field's vocabulary is exactly like moving to an unfamiliar city. The first days are the worst: street names everywhere — this Gate, that Bridge, some Manor — every one of them mentioned by someone, none of them locatable, and you can't even tell a taxi driver where to go. Then someone hands you a **metro map**, and the world goes quiet: you still don't recognize the hundreds of station names, but they've all **found their places** — the red line follows the river, the blue line crosses downtown, the green line goes to the airport.

Notice that at this moment you haven't “memorized” a single station. The map's magic isn't memory, it's **framework**: next time someone says “meet at Guomao,” you don't know Guomao, but you check the map, see it's on Line 1, and feel grounded. **Panic comes from having nowhere to put things — not from there being too many things.**

Better still, after a year of living there you'll notice: the stations you frequent became familiar on their own — your office is at that one, your friend lives at this one; no memorizing was ever needed. The obscure stations you never visited? No harm done. Terms work the same: high-frequency words like NAV and KYC will greet you daily through Stages 3 and 7 until you couldn't forget them if you tried; an exotic one like eWpG can wait until the day you actually research a German issuance — look it up then, and you've lost nothing.

So the right attitude toward this acronym map is your attitude toward a metro map: **pin it on the wall, come back often, never force yourself to memorize it.** And when you finish the whole course and look back at this page, there will be a lovely moment — every acronym will have a story you can tell. By then it's no longer a map. It's your travel album.
`,

  misconceptions: [
    "“To learn RWA you must first memorize all these acronyms.” —— The opposite. This page is a map, not an exam syllabus: every term formally meets you in its own stage, with a full lesson and demo. A passing acquaintance now is plenty; come back whenever you forget one.",
    "“So many acronyms — this field must be smoke and mirrors.” —— Almost none of these words were invented by crypto: NAV, SPV, KYC, DvP have served traditional finance for decades. RWA stands at the junction of two mature industries (finance + blockchain) and inherits both vocabularies — the word count is evidence of deep roots, not obfuscation.",
    "“Reg D, Reg S, Reg A+ are all roughly the same — issuance exemptions.” —— Their audiences are entirely different: Reg D sells to US accredited investors, Reg S only to non-US persons, Reg A+ to the general public but capped at $75M. Pick the wrong one and the whole offering is illegal — exactly what Stages 7.2 and 11.1 dissect (compare Ondo wrapping the same asset into two products, one Reg D and one Reg S).",
    "“AI means artificial intelligence.” —— In RWA documents, AI almost always means Accredited Investor. The same acronym means different things in different industries; when you meet one, first check which line it's on — that's precisely what a line-sorted map is for.",
    "“Numbers like ERC-20 and ERC-3643 carry inner meaning — better study the numbering scheme.” —— The numbers are just serial numbers of Ethereum Improvement Proposals (EIPs), first come first numbered, no code to crack. ERC-3643 isn't “3,623 versions more advanced” than ERC-20 — they're simply standards for different jobs.",
  ],

  quiz: [
    {
      q: "What is NAV, and which line does it live on?",
      options: ["Compliance line: an identity-verification process", "Assets & finance line: (assets − liabilities) ÷ shares — the fund's per-share net value", "Chains & standards line: a token standard number", "Regulators line: a European regulatory agency"],
      answer: 1,
      explain: "NAV = Net Asset Value, the once-a-day “what is each share worth” — Stage 3.3 covers it in depth, and Stage 8.2 covers feeding it on-chain.",
    },
    {
      q: "An RWA offering document says “QPs only, offered under Reg D 506(c).” In plain language?",
      options: ["Anyone can buy, no limits", "Sold only to Qualified Purchasers ($5M+ in investable assets), under the US private-placement exemption", "Offered only in the EU", "Payable only in Bitcoin"],
      answer: 1,
      explain: "QP = Qualified Purchaser (a higher bar than accredited investor); Reg D = the US private-placement exemption. BlackRock's BUIDL uses exactly this structure (Stages 7.2, 10.1).",
    },
    {
      q: "What's the relationship between KYC and AML?",
      options: ["Two names for the same thing", "KYC verifies who you are; AML is the full system that keeps dirty money from being washed — KYC is the AML system's first gate", "KYC covers institutions, AML covers individuals", "KYC is an EU rule, AML is a US rule"],
      answer: 1,
      explain: "Only once you know who the customer is (KYC) can you monitor whether the money is clean (AML). Both unfold in Stage 7.1.",
    },
    {
      q: "The essential difference between ERC-20 and ERC-3643?",
      options: ["3643 is a bigger number, so it's more advanced", "An ERC-20 transfer checks nothing but balances; an ERC-3643 transfer first consults the identity registry and compliance rules — securities need the latter", "ERC-20 only works on testnets", "There is no difference"],
      answer: 1,
      explain: "A plain ERC-20 can't hold “who is eligible to hold this” — the very subject of Stage 6.1; ERC-3643 builds compliance into the transfer itself (Stage 6.2).",
    },
    {
      q: "What's the correct way to use this acronym map?",
      options: ["Memorize it fully before starting the next lessons", "As a permanent tool page: passing acquaintance now, come back whenever a forgotten term ambushes you — every term gets fully taught in its own stage", "Only memorize the regulators line; the rest doesn't matter", "Print it out for the exam"],
      answer: 1,
      explain: "Panic comes from having nowhere to put things, not from their quantity. With the line framework, frequent terms grow familiar on their own and rare ones can be looked up when needed.",
    },
  ],

  further: [
    { label: "SEC Investor.gov glossary (official definitions of the finance terms)", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary" },
    { label: "FATF: the Recommendations (the source of the compliance line's vocabulary)", url: "https://www.fatf-gafi.org/en/topics/fatf-recommendations.html" },
    { label: "ESMA: MiCA page (the EU regulators line in one place)", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" },
    { label: "ERC-3643 official site (home of the permissioned token standard)", url: "https://www.erc3643.org" },
    { label: "EIP-4626 (the tokenized vault standard, in the original)", url: "https://eips.ethereum.org/EIPS/eip-4626" },
  ],
};
