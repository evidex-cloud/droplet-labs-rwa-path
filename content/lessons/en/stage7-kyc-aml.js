export default {
  id: "kyc-aml",
  stage: 7,
  order: 1,
  title: "KYC / AML / Sanctions Screening: The Three Gates",
  difficulty: "systems",
  prereqs: ["onchain-identity"],

  oneLiner:
    "KYC, AML, and sanctions screening get lumped into one blurry word, but they are three distinct gates asking three distinct questions: KYC asks WHO you are, AML asks whether your MONEY is clean, and sanctions screening asks whether you're on a LIST. All three run entirely off-chain, and their output is compressed into that single on-chain claim from Stage 6.3 — this is the intake valve of the compliance machine. RWA adds one gate traditional finance never had: wallet-address screening, which checks where your coins have been.",

  intuition: `
You want to buy $1,000 of tokenized Treasuries on some RWA platform. After you hit “sign up,” what awaits you is not a “connect wallet” button but a gauntlet: upload your passport, turn your head and blink at the camera, fill in a source-of-funds questionnaire, wait one to three days for review. Plenty of people churn right here, closing the tab while muttering “how is this still DeFi?”

But the issuer has no choice. Its **fund license, transfer-agent registration, and banking relationships** each exist on the premise that these checks were run — let one sanctioned person slip through and the fine is measured in tens of millions, with the license itself on the line. Binance's 2023 settlement with the US Department of Justice came to **$4.3 billion**, and a failed AML program was one of the core charges. For an RWA issuer, compliance isn't a cost line — it's a survival line.

The trouble is that most people call this whole pipeline “KYC,” and so they can explain neither why “I passed KYC but got frozen anyway” nor why “my passport is fine but I got rejected.” The truth: there are **three independent gates** here, checking three completely different questions. A person with a flawless identity and clean money can die at gate three; a person who clears all three can be frozen six months later when continuous monitoring trips an alert. In this lesson we take the gates apart one by one, then watch them compress into that single on-chain claim from Stage 6.3.

**Here's the map — five parts:**

- **① Gate one, KYC: who are you**
- **② Gate two, AML: is your money clean**
- **③ Gate three, sanctions: are you on a list — plus the chain-only gate, address screening**
- **④ The Travel Rule, and how three gates become one on-chain claim**
- **⑤ Costs, friction, and the moat: why nobody gets to skip this**
`,

  mechanics: `
### ① Gate one, KYC: who are you

**KYC (Know Your Customer)** answers one question: **is the person (or company) on the other side of the screen real, identifiable, and who they claim to be?** A typical individual KYC pipeline looks like this:

- **Document verification**: upload a passport or ID card; OCR extracts the fields; anti-forgery features are validated (MRZ check digits, chip signatures) and compared against the issuing country's document templates.
- **Liveness detection + selfie match**: you turn your head, blink, read out digits — proving there's a live human at the camera, not a photo or a deepfake; then the selfie is face-matched against the document photo, producing a similarity score (thresholds typically sit between 0.85 and 0.99, set by risk appetite).
- **Database cross-checks**: name + date of birth + address are run against government databases, credit bureaus, and utility records to confirm this identity actually exists and lives where stated.
- **PEP screening**: are you a **Politically Exposed Person** — a senior official, state-enterprise executive, military leader, or their close relative? Note carefully: **PEP is not a rejection reason**. It triggers **enhanced due diligence (EDD)** — corrupt money loves PEP channels, so you dig deeper into source of funds, keep more approval records, and monitor harder. Auto-rejecting PEPs is a common lazy shortcut, not what the rules require.

Corporate customers get one more layer: **UBO (Ultimate Beneficial Owner) look-through** — climbing the ownership structure level by level to find every natural person who **ultimately holds more than 25%**, then running the full individual KYC on each of them. Shell companies stacked on shell companies exist precisely to hide the real owner from this step; the US Corporate Transparency Act and the EU's UBO registers are both aimed squarely at this 25% look-through.

### ② Gate two, AML: is your money clean

KYC checks the person; **AML (Anti-Money Laundering) checks the money** — and it is not a one-time check but **continuous monitoring across the whole customer lifecycle**. Two phases:

- **At onboarding: source-of-funds / source-of-wealth checks.** You say this $500k came from selling a house? Show the transaction record. Salary savings? Show tax returns or an employer letter. The bigger the amount and the higher your risk score (say, you happen to be a PEP), the stricter the demands.
- **After onboarding: continuous transaction monitoring.** The system watches every flow in and out, running pattern-detection rules: **structuring** — splitting $100k into eleven transfers of $9,500 to dodge the $10k reporting line; **layering** — money spinning rapidly through multiple accounts, with inflows and outflows that never quite reconcile; counterparty links to known risky entities. Every customer carries a **dynamic risk score**, and when the score moves, the monitoring intensity moves with it.

What happens when an alert fires? The compliance team reviews it manually, and if it holds up, they file a **SAR (Suspicious Activity Report)** with the financial-intelligence unit (in the US, **FinCEN**). SARs have two counterintuitive properties. **First, they are filed in secret** — the institution not only won't tell you, but telling you (“tipping off”) is itself illegal. **Second, the volume is enormous** — roughly **4 million SARs per year** in the US. So “my account got restricted out of nowhere” very often has, behind it, a report you will never see.

### ③ Gate three, sanctions: are you on a list — plus the chain-only gate, address screening

The third gate is the coldest. **Sanctions screening** doesn't care who you are or whether your money is clean. It asks exactly one thing: **are you, or anyone connected to you, on a list?**

- **The lists**: the US Treasury OFAC **SDN list** (Specially Designated Nationals) is the most consequential, alongside EU, UN, and UK OFSI lists. The lists hold not just names but companies, ships, aircraft — and, since 2018, **cryptocurrency addresses**.
- **Jurisdiction blocks**: for comprehensively sanctioned jurisdictions (Iran, North Korea, Syria, Crimea, and so on), it isn't individual screening — every resident is turned away, judged three ways: IP, document-issuing country, residential address.
- **The crucial rule: strict liability.** Violating OFAC sanctions **requires no intent** — “I didn't know he was on the list” is not a defense; the transaction happening is the violation. This is why screening must re-run **at every transaction**, not once at onboarding: the lists **update daily**, and a name that was clean yesterday can be listed today (in Stage 7.3 this becomes check station ⑦ of a transfer).

On top of these three, RWA adds a gate traditional finance never had: **wallet-address screening**. On-chain funds are publicly traceable, and firms like Chainalysis, TRM Labs, and Elliptic do **cluster analysis** — grouping behaviorally linked addresses into entities, labeling known hacker addresses, mixers (like the OFAC-sanctioned Tornado Cash), darknet markets, and ransomware wallets — then answering one question: **within N hops, have this wallet's funds touched any of those tainted sources?** Your passport can be spotless, but if you once received money two hops downstream of a mixer, the risk engine lights up red anyway. This is a gate unique to on-chain finance: **a traditional bank cannot check where your banknote has been; a chain can check every hand it passed through.**

<figure>
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
<defs><marker id="kyc-ah-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--orange-line)"/></marker></defs>
<rect x="10" y="90" width="86" height="56" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
<text x="53" y="114" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Applicant</text>
<text x="53" y="132" text-anchor="middle" font-size="9" fill="var(--muted)">person / entity</text>
<rect x="130" y="30" width="130" height="70" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="195" y="54" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="600">Gate ① KYC</text>
<text x="195" y="72" text-anchor="middle" font-size="9" fill="var(--ink)">docs · liveness · PEP</text>
<text x="195" y="88" text-anchor="middle" font-size="9" fill="var(--muted)">UBO look-through &gt;25%</text>
<rect x="130" y="120" width="130" height="70" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
<text x="195" y="144" text-anchor="middle" font-size="11" fill="var(--orange-ink)" font-weight="600">Gate ② AML</text>
<text x="195" y="162" text-anchor="middle" font-size="9" fill="var(--ink)">funds · monitoring</text>
<text x="195" y="178" text-anchor="middle" font-size="9" fill="var(--muted)">SARs ~4M/yr</text>
<rect x="290" y="75" width="140" height="80" rx="10" fill="var(--red-soft)" stroke="var(--line)"/>
<text x="360" y="99" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Gate ③ Sanctions</text>
<text x="360" y="117" text-anchor="middle" font-size="9" fill="var(--muted)">OFAC SDN · geo blocks</text>
<text x="360" y="133" text-anchor="middle" font-size="9" fill="var(--muted)">+ address screening</text>
<text x="360" y="149" text-anchor="middle" font-size="9" fill="var(--muted)">strict liability!</text>
<rect x="470" y="82" width="158" height="66" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
<text x="549" y="106" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">On-chain claim / whitelist</text>
<text x="549" y="124" text-anchor="middle" font-size="9" fill="var(--muted)">ONCHAINID claim</text>
<text x="549" y="139" text-anchor="middle" font-size="9" fill="var(--muted)">revocable anytime</text>
<line x1="96" y1="105" x2="130" y2="70" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#kyc-ah-en)"/>
<line x1="96" y1="130" x2="130" y2="150" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#kyc-ah-en)"/>
<line x1="260" y1="70" x2="290" y2="100" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#kyc-ah-en)"/>
<line x1="260" y1="150" x2="290" y2="130" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#kyc-ah-en)"/>
<line x1="430" y1="115" x2="470" y2="115" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#kyc-ah-en)"/>
<text x="450" y="105" text-anchor="middle" font-size="9" fill="var(--muted)">all pass</text>
<text x="320" y="225" text-anchor="middle" font-size="10" fill="var(--muted)">All three gates run off-chain — only the “conclusion” goes on-chain; continuous monitoring can withdraw it anytime</text>
</svg>
</figure>

### ④ The Travel Rule, and how three gates become one on-chain claim

One more rule stitches the intermediaries together: the **FATF Travel Rule**. FATF (the Financial Action Task Force) requires **VASPs** (virtual-asset service providers — exchanges, custodians, and the like) to **pass originator and beneficiary information along with any transfer at or above the $1,000/€1,000 threshold** — names, account numbers/addresses, sometimes physical addresses. In other words: not only must you be identified, **your counterparty must be identifiable by your service provider too**. This rule is the main force squeezing anonymous transfers out of compliant channels, and the reason exchanges have built dedicated information-relay networks (TRUST, Notabene, and similar schemes).

Now swing the camera back on-chain and connect to Stage 6. All three gates run **off-chain** — OCR, face matching, list matching, graph analysis: none of it can run inside a smart contract. Once they finish, the result is **compressed into one minimal on-chain fact**:

- In the ERC-3643 world, a trusted issuer signs a **claim** onto your ONCHAINID — “this identity passed KYC, jurisdiction = SG, category = retail” (the mechanism of Stage 6.3);
- In simpler systems, your address is written into a **whitelist** contract.

Notice what this architecture implies: **the chain stores only the conclusion, never the private data** — your passport scan and face vectors stay in the compliance provider's database forever. And the conclusion is **alive**: AML monitoring never stops — six months later your wallet touches a mixer, or your name appears on a fresh SDN update, and the issuer **revokes** the claim, so your next transfer fails on the spot in Stage 7.3's checks. The three gates are not an entrance ritual; they are **a machine that never clocks out**.

### ⑤ Costs, friction, and the moat: why nobody gets to skip this

Let's do the honest arithmetic. This machine is neither cheap nor pleasant:

- **Money**: a single individual KYC runs about **$1–5** (fully automated) up to **$10–100+** (with manual review, EDD, corporate UBO look-through); continuous monitoring, list subscriptions, and on-chain analytics tools (Chainalysis-class annual fees run into the hundreds of thousands of dollars) are ongoing costs.
- **Time**: minutes to days for retail users; institutional onboarding routinely takes weeks.
- **False positives**: a name collision with the SDN list (false-positive rates are startlingly high), OCR failing on a glare-streaked photo, models that read some countries' documents poorly — every false positive is a frozen legitimate user and a support ticket.

So why can't it be skipped? Back to the opening: the issuer's **licenses are staked on it**. The securities exemption (Stage 7.2), the transfer-agent registration, the banking channel, the auditor's signature — every one of them presupposes this machine is running. Which also explains a market fact: **the compliance pipeline is itself a moat**. What Securitize, Tokeny, and their peers really sell is not a “token minting tool” but **the entire assembly line from three gates to on-chain claim** — issuers would rather pay than build, because building means owning not just software but licenses, audit liability, and the fine when something slips. This “boring” pipeline is precisely the hardest business in RWA to route around.

If you take away one sentence: **the three gates check three different questions — who you are (KYC), whether the money is clean (AML), whether you're on a list (sanctions) — they run continuously off-chain, and the chain holds only a conclusion that can be revoked at any moment.**
`,

  demo: "kyc-gates",

  analogy: `
Picture the three gates as **the three checkpoints of airport security**.

The first checkpoint is **passport control** (KYC): is the document genuine, is the photo you, are you who you say you are. Occasionally the officer asks a few extra questions — if your passport says you're a cabinet minister somewhere (a PEP), you're not barred from flying, you're invited into the side room for an extra ten minutes of conversation.

The second checkpoint is **baggage screening** (AML): the X-ray machine doesn't scan you, it scans **what you're carrying**. And the airport's cameras don't switch off after you board — odd behavior in the departure lounge (splitting one parcel into eleven checked bags) gets logged and reported without your ever knowing.

The third checkpoint is **the no-fly list** (sanctions screening): the most unforgiving of the three — however genuine the passport, however clean the luggage, a name match means no boarding, and the gate agent's “I didn't know they were listed” gets the airline fined all the same. And a new edition of the list arrives every morning.

The RWA airport installs one machine ordinary airports don't have: **a baggage-history scanner** (address screening) — it can tell that your suitcase spent time three months ago on the same warehouse shelf as contraband. Clear all four checkpoints and what you receive is not free passage but a **boarding pass that can be voided at any moment** (the on-chain claim) — if the list updates mid-flight, you'll be stopped on landing all the same.
`,

  misconceptions: [
    "“KYC, AML, and sanctions screening are the same thing — just call it KYC.” —— Three gates, three questions: KYC checks identity, AML checks money and keeps monitoring, sanctions checks list matches. Blur them together and you can't explain “clean identity, rejected anyway” (a list/address hit) or “passed onboarding, frozen later” (monitoring tripped).",
    "“Once KYC is done, it's done for good.” —— KYC is the one-time entrance check, but AML monitoring and sanctions matching are continuous: lists update daily, transaction patterns are scored in real time, and the on-chain claim can be revoked at any moment (Stage 6.3). Compliance is a subscription, not a purchase.",
    "“PEPs (politically exposed persons) get auto-rejected.” —— No. PEP status triggers enhanced due diligence (EDD) and stricter ongoing monitoring, not automatic rejection. Blanket-rejecting PEPs is an institution's own risk appetite, not what the rules demand — and it's why plenty of legitimate officials' relatives get wrongly burned.",
    "“I didn't mean to transact with a sanctioned party, so I'm innocent.” —— OFAC sanctions are strict liability: no intent required — the transaction itself is the violation. That is exactly why every transfer is re-screened rather than checking once at account opening.",
    "“On-chain transfers are anonymous, so compliance can't trace the money.” —— The opposite: a public chain's ledger is permanently open, and cluster analysis labels mixers, hackers, and darknet addresses while tracing funds N hops out. On-chain money history is far more transparent than cash — address screening is the gate traditional finance always wanted and never had.",
    "“Real on-chain compliance means putting the KYC data on-chain.” —— Badly wrong. The chain stores only the conclusion (a claim or whitelist entry); passports and face data stay off-chain with the compliance provider forever. Putting private data on-chain violates data-protection law and serves no purpose — and this “conclusions only” design is exactly where Stage 7.4's privacy discussion begins.",
  ],

  quiz: [
    {
      q: "Which is the correct mapping of the three gates to their questions?",
      options: [
        "KYC checks money, AML checks the person, sanctions checks addresses",
        "KYC asks “who are you,” AML asks “is the money clean (with ongoing monitoring),” sanctions asks “are you on a list”",
        "All three check identity, just with different strictness",
        "KYC is for individuals, AML for companies, sanctions for countries",
      ],
      answer: 1,
      explain: "Three independent gates: identity, funds (including continuous monitoring), and list matching. That independence is why “perfect identity, rejected anyway” can happen.",
    },
    {
      q: "Which statement about SARs (Suspicious Activity Reports) is true?",
      options: [
        "The institution must notify the customer before filing so they can respond",
        "SARs are filed in secret — tipping off the customer is itself illegal; the US sees roughly 4 million per year",
        "SARs only cover transactions above $1 million",
        "Once a SAR is filed the account must be permanently closed",
      ],
      answer: 1,
      explain: "Secretly filed and enormous in volume. Many a mysteriously restricted account has a report behind it that the user will never see.",
    },
    {
      q: "What does “strict liability” mean in the OFAC sanctions context?",
      options: [
        "Only intentional dealings with sanctioned parties are illegal",
        "Intent is irrelevant — the transaction occurring is the violation, which is why list screening must re-run at every transaction",
        "Liability only attaches above $10,000",
        "Only the customer is liable, never the institution",
      ],
      answer: 1,
      explain: "“I didn't know” is not a defense. Lists update daily — which is exactly why Stage 7.3's transfer pipeline re-screens at transfer time.",
    },
    {
      q: "Which check does RWA add that traditional finance never had?",
      options: [
        "Facial liveness detection",
        "Beneficial-ownership look-through",
        "Wallet-address screening: cluster analysis asking whether funds touched a mixer, hack, or darknet source within N hops",
        "A source-of-funds questionnaire",
      ],
      answer: 2,
      explain: "Public ledgers are traceable; Chainalysis/TRM/Elliptic-class tools label tainted sources and trace fund paths. A bank can't check a banknote's history — a chain can.",
    },
    {
      q: "What is the correct relationship between the three gates and the chain?",
      options: [
        "All three gates execute on-chain in smart contracts",
        "KYC data (passport, face) is encrypted and stored on-chain",
        "All three gates run off-chain; the result is compressed into an on-chain claim or whitelist entry, which continuous monitoring can revoke at any time",
        "Only sanctions screening runs on-chain; the rest is off-chain",
      ],
      answer: 2,
      explain: "OCR, face matching, and graph analysis can't run in a contract. The chain stores only the conclusion — and the conclusion stays alive via Stage 6.3's claim mechanism.",
    },
    {
      q: "A customer has a genuine identity and clean funds, but their wallet received money two hops downstream of Tornado Cash. The most likely outcome?",
      options: [
        "The three gates ignore on-chain history — approve",
        "Address screening flags red: manual review / enhanced due diligence, possibly demanding an explanation of the fund path or rejecting that wallet",
        "A fresh face scan fixes it",
        "The customer is automatically sued",
      ],
      answer: 1,
      explain: "Address screening is independent of identity and source-of-funds: taint exposure triggers the risk process. Tornado Cash was OFAC-sanctioned, so associated addresses carry high-risk labels.",
    },
  ],

  further: [
    { label: "FinCEN: the Bank Secrecy Act (BSA) and AML obligations", url: "https://www.fincen.gov/resources/statutes-and-regulations/bank-secrecy-act" },
    { label: "OFAC: the SDN (Specially Designated Nationals) list", url: "https://ofac.treasury.gov/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists" },
    { label: "FATF: virtual assets and the Travel Rule guidance", url: "https://www.fatf-gafi.org/en/topics/virtual-assets.html" },
    { label: "Chainalysis: on-chain analytics and the annual crypto-crime report", url: "https://www.chainalysis.com/" },
    { label: "ERC-3643 official site: how compliance claims plug into the token standard", url: "https://www.erc3643.org/" },
  ],
};
