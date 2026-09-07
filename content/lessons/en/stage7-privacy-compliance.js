export default {
  id: "privacy-compliance",
  stage: 7,
  order: 4,
  title: "Privacy vs Compliance: Can ZK Proofs Give You Both",
  difficulty: "systems",
  prereqs: ["transfer-restrictions"],

  oneLiner:
    "A public chain broadcasts everyone's holdings and every flow to the entire world — for an institution, that's unacceptable nakedness; yet regulators and auditors must be able to see, and the compliance machine demands identity binding. This three-way tug-of-war isn't a multiple-choice question: the answer is to give transparency a direction. Permissioned chains show a deal only to its parties (Canton's route, already in production); view keys encrypt to the public while opening a window for the regulator (Zcash's precedent); zero-knowledge proofs prove “I'm eligible” without revealing “who I am” (still in pilots). The right question was never “transparent or not” — it's “transparent to whom.”",

  intuition: `
Imagine you run trading at an asset manager that just moved $200 million of fund shares onto a public chain. The next day you notice three things, each one a cold sweat.

First, **your competitors can see everything**. Once on-chain analytics label your wallet address, every rebalance, every subscription and redemption is visible to the world in real time — the equivalent of livestreaming your trading desk's screens. Second, **someone is front-running you**. Before every large redemption, some address always moves just ahead of you — the public mempool and visible positions turned your intent into somebody else's signal (Stage 9.4 covered redemption arbitrage; here it's pointed at you). Third, **your counterparties are profiling you**. Who you've traded with, which protocols you've touched — it's all in the graph.

So you want privacy. But sprinting to the other extreme hits a wall instantly: **regulators must be able to look** (or your licenses evaporate), **auditors must be able to look** (or nobody signs your financials), and Stage 7.3's eight checks **require every address to be bound to an identity**. Fully anonymous finance, in the eyes of FATF and FinCEN, is roughly a money-laundering machine — the Tornado Cash sanctions are the cautionary precedent.

Naked transparency won't do; a black box won't either. In this lesson we put every solution as of 2025 on the table: permissioned chains, venue privacy, zero-knowledge proofs, view keys — each one a different setting on the dial marked **“transparent to whom.”** Zero-knowledge proofs are the most magical and the most over-mythologized of the set, so we'll walk their real flow end to end, then say honestly whether you can use them today.

**Here's the map — five parts:**

- **① Stating the tension precisely: what each of the three parties actually wants**
- **② The mature answers: permissioned chains and venue privacy**
- **③ Zero-knowledge proofs: proving “I'm eligible” without revealing “who I am”**
- **④ View keys and privacy pools: leaving the regulator a window**
- **⑤ An honest maturity assessment: who can use what in 2025**
`,

  mechanics: `
### ① Stating the tension precisely: what each of the three parties actually wants

Break the vague phrase “privacy vs compliance” into three parties' **concrete checklists** and the problem clarifies immediately:

- **Institutional participants** want: positions hidden from competitors, trading intent safe from front-running, counterparty relationships kept out of the graph. Note that they **don't ask for anonymity** — they're already fully identified to their regulator. What they want is **confidentiality from the public and from counterparties**, exactly as in traditional markets (you can't see Bridgewater's live positions either).
- **Regulators and auditors** want: the ability to verify each holder's identity and eligibility (everything from Stages 7.1–7.3), to reconstruct fund flows, and to pull complete records during an investigation. They **don't require real-time publication to everyone** — traditional finance's supervisory data has always been reported to named recipients.
- **The compliance machine itself** wants: at transfer time, to verify that “the receiver holds a valid eligibility claim” (Stage 7.3's stations ① and ②) — but notice, that check needs a **boolean answer** (valid / invalid). It does not inherently need the receiver's name.

See it? The three sets of needs **don't actually conflict**: not one party asked for “all information public to all people.” A public chain's default total nakedness is a **technical by-product**, not anyone's requirement. The essence of every solution is to convert “transparent to everyone” into “**transparent to specific parties**.”

### ② The mature answers: permissioned chains and venue privacy

**Option one: sub-transaction privacy on a permissioned chain (the Canton route).** Canton Network (the DAML ecosystem from Digital Asset, with Goldman Sachs, Microsoft and others involved) pushes privacy down to the **sub-transaction level**: for any given transaction, **only the parties to that part** can see it. A sells B a bond; B finances the position with C via repo — C never sees that A exists, A never sees C's terms, while a supervisory node can be authorized to see the whole picture. This is **what institutions actually choose today**, running in production. The price you met in Stage 2.6: **you give up public composability** — your asset can't interact with public-chain DeFi legos, and liquidity stays inside the walls.

**Option two: venue privacy.** Matching and the order book live entirely inside an off-chain venue (an ATS); only the **settlement result** lands on-chain, sometimes only as periodic net amounts. The public sees coarse-grained transfers and never the strategy. It's the least-effort compromise, and the price is that the chain degrades into a bookkeeping tail — what you surrender is the on-chain market itself.

### ③ Zero-knowledge proofs: proving “I'm eligible” without revealing “who I am”

A **zero-knowledge proof (ZKP)** is cryptography's native answer to this problem: **prove a statement is true while leaking nothing beyond the statement**. Dropped into the RWA context, the statement reads:

> “I hold an unexpired KYC credential issued by one of the approved certification providers, that credential records me as an accredited investor, and my identity is absent from the sanctions-list snapshot.”

The verifier ultimately learns **one boolean: true**. Not your name, not your country, not which provider issued the credential — yet the cryptography guarantees you couldn't have forged that “true.” Here's the real flow (the common skeleton of zkKYC-style designs):

- **Step 1 · off-chain issuance**: you complete Stage 7.1's three gates with a certification provider (a compliance firm), and it signs you a **verifiable credential** with its private key — a blob of signed data that lives on your own device and **never goes on-chain**.
- **Step 2 · local proof generation**: when you want to buy an RWA, your wallet **locally** takes the credential plus the product's eligibility requirements and generates a zero-knowledge proof: “credential valid ∧ issuer on the trusted list ∧ I satisfy the accredited-investor test ∧ absent from the sanctions snapshot.” Generation happens on your device; the credential's contents never leave it.
- **Step 3 · on-chain verification**: a **verifier** contract receives the proof, runs one mathematical check (on the order of a few hundred thousand gas, depending on the proof system), and outputs true or false. On true, your address is issued a **session credential** (or the transfer is simply allowed) — that's Stage 7.3's stations ① and ② replaced by “verify a proof,” with your identity never appearing on-chain at any point.
- **The unresolved link · revocation freshness**: Stage 7.1 established that claims must be revocable. In the ZK world this gets hard — your proof rests on a “sanctions snapshot,” so how old a snapshot still counts as valid? Force proof regeneration daily? Use an on-chain revocation tree so proofs must reference the latest root? Every scheme trades freshness against generation cost, and this is one of the thorniest engineering problems standing between zkKYC and production.

### ④ View keys and privacy pools: leaving the regulator a window

**View keys** are the other pragmatic route, with **Zcash's viewing key** as the precedent: transactions are encrypted to the public, but the holder can hand a **read-only key** to designated parties — auditors, regulators — letting them decrypt and inspect the holder's complete history. This is the “**curtains drawn, but a window left for the regulator**” pattern: the public sees ciphertext, the authorized see plaintext, and the authorization is **targeted and revocable**. For institutional RWA this model reproduces traditional finance's information order almost exactly: the market can't see you, the regulator can.

The **Privacy Pools** concept (the direction of Buterin et al.'s 2023 paper) adds one more piece. The original sin of mixer-style privacy tools is that good actors and bad actors share one pool — which is why OFAC sanctioned all of Tornado Cash. Privacy Pools' design has you attach a zero-knowledge proof at withdrawal: “**my funds do not originate from that known set of hacker addresses**” — proving your innocence without revealing who you are. Privacy L2s in the **Aztec** mold turn “programmable privacy + compliance hooks” into a platform: deposits are screened, proofs of innocence are supported, privacy is the default and compliance is built in.

### ⑤ An honest maturity assessment: who can use what in 2025

Tag each route with its **maturity as of 2025**:

- **Permissioned-chain sub-transaction privacy: in production.** Canton has real institutions doing real settlement — this is what an institution wanting privacy actually uses today.
- **Venue privacy: in production**, with an explicit price (the chain becomes a tail).
- **View keys: technically mature** (Zcash has run them for years), **institutional packaging in progress** — the hard part isn't cryptography, it's writing “who is entitled to hold the key” into legal documents and operating procedures.
- **ZK eligibility proofs: pilot stage.** Three real obstacles: **proving UX** (generating a proof on an ordinary user's device still takes seconds to tens of seconds), the **revocation-freshness** problem above, and the **regulator's trust curve** — getting supervisors comfortable with “all I see is a boolean” takes time and precedent.
- **Regulatory posture**: FATF and FinCEN are deeply wary of full anonymity (the Tornado Cash sanctions were the landmark event), but pragmatic toward **“auditability by design”** frameworks — privacy that can demonstrate compliance and answer a subpoena is, in a regulator's eyes, a different species from privacy that can't.

The predicted convergence: **public settlement rails + selective disclosure** — assets keep their composability on public chains while privacy is supplied by ZK proofs and view keys, turning transparency into a **directional, grantable parameter**. On that day Stage 7.3's eight checks won't disappear; a few stations will simply take “a proof” as input where they once took a plaintext identity.

If you take away one sentence: **privacy and compliance are not a multiple-choice question — “transparent to whom” is the right question, and permissioned chains, view keys, and zero-knowledge proofs are three different settings on that dial.**
`,

  demo: "zk-tradeoff",

  analogy: `
Picture the four architectures as four kinds of **glass in a bank's dealing room**.

The **fully public chain** replaces all four walls with floor-to-ceiling glass and lays the ledger out in the display window: passers-by, rivals, and paparazzi can all copy down your flows. You've done nothing wrong, yet every piece of business you do has become a public spectacle — no serious institution wants to trade in a shop window.

The **permissioned chain** is a members-only club's **private rooms**: each deal is discussed in its own room, only the people present know its contents, and the club manager (the supervisory node) holds a master key. The price: the business in that room can only be done with people in that room — the loud, liquid market outside (public-chain DeFi) has nothing to do with you.

The **view key** is a **one-way mirror**: outsiders see only the mirrored surface (ciphertext), but you've handed the key to the observation room behind it to your auditor and your regulator — they can see everything about you, any time, with a key that you granted and can revoke.

The **zero-knowledge proof** is the cleverest of the four: it's the **age scanner** at a bar door. All the bouncer needs to know is “21 or over: yes/no.” The traditional method is to hand over your whole passport — birthday, name, home address, all exposed. The scanner just flashes a green light; the bouncer saw nothing, yet is mathematically certain you're old enough. Across the entire check you leaked **exactly the one bit that needed leaking**. None of the four glasses is right or wrong. There is only one question, asked all the way down: **who, under what conditions, do you want to be able to see what?**
`,

  misconceptions: [
    "“Blockchains are anonymous by nature, so privacy isn't really an issue.” —— Backwards. Public chains are pseudonymous: once an address is labeled (the daily work of on-chain analytics), your entire past and future is public in real time. For an institution a public chain is far more naked than a traditional market — privacy is an unavoidable obstacle to institutional RWA.",
    "“Privacy and compliance are zero-sum: every ounce of privacy costs an ounce of compliance.” —— Unpack the three parties' needs and nobody asked for “public to everyone”: institutions want confidentiality from the public, regulators want visibility for themselves. View keys and ZK proofs satisfy both at once — the design problem is transparency's direction, not its total quantity.",
    "“A zero-knowledge proof is just encryption — put encrypted data on-chain.” —— Completely different. Encryption turns data into ciphertext that a key turns back into the original; a ZKP transmits no data at all, only a proof about a statement, and the verifier learns a single boolean. “Prove I'm eligible” and “encrypt my passport” are two different paradigms.",
    "“ZK eligibility proofs are mature and about to replace traditional KYC.” —— As of 2025 they're in pilots: heavy proving UX, unsolved revocation freshness, a regulator trust curve just beginning. The three gates themselves (Stage 7.1) still run off-chain — ZK changes how the conclusion is verified, not whether the checks happen.",
    "“Regulators oppose all on-chain privacy.” —— What regulators oppose is unauditable anonymity (hence the Tornado Cash sanctions). Toward privacy that is auditable by design they are pragmatic: permissioned chains have supervisory nodes, view keys have targeted disclosure, privacy pools have proofs of innocence. Privacy that can answer a subpoena and privacy that can't are two different species.",
    "“Pick a permissioned chain and you're done.” —— The price of solving privacy that way appeared back in Stage 2.6: you give up public composability, and your asset can't reach public-chain DeFi's liquidity network. It's a genuine trade, not a free lunch — which is precisely why work continues on the “public rails + selective disclosure” route.",
  ],

  quiz: [
    {
      q: "The core reason institutions resist holding RWAs on a fully public chain?",
      options: [
        "Gas fees are too expensive",
        "Positions and flows are public to the world in real time: competitors read the strategy, redemption intent gets front-run, counterparties get graphed",
        "Public chains are too slow",
        "Public chains can't handle large transfers",
      ],
      answer: 1,
      explain: "Once addresses are labeled, a public chain is far more transparent than a traditional market — institutions don't want anonymity, they want the confidentiality from the public they already have in TradFi.",
    },
    {
      q: "What does an on-chain verifier learn from a ZK eligibility proof?",
      options: [
        "An encrypted version of your name and nationality",
        "A digest of your KYC file",
        "Only a boolean: “the statement is true” (credential valid, eligible, absent from the sanctions snapshot) — with no identity, country, or issuer revealed",
        "Your wallet's full transaction history",
      ],
      answer: 2,
      explain: "This is the essential difference from encryption: no data is transmitted, only a proof about a statement. The verifier is convinced it's true and yet saw nothing.",
    },
    {
      q: "What is the real sequence of a zkKYC flow?",
      options: [
        "Do KYC on-chain → store the passport on-chain → compare on-chain",
        "An off-chain provider issues a verifiable credential (stored on the user's device) → the user generates a proof locally → an on-chain verifier checks it → allow / issue a session credential",
        "The regulator approves each transfer directly on-chain",
        "The user uploads the credential to the contract, which holds it in custody",
      ],
      answer: 1,
      explain: "The credential's contents never go on-chain and never leave the device; only the proof and a boolean appear on-chain. The three gates still run off-chain — what changes is how the conclusion is verified.",
    },
    {
      q: "Which describes the view-key model accurately?",
      options: [
        "Everyone can use the key to view every transaction",
        "Transactions are encrypted to the public while the holder grants a read-only key to auditors/regulators — public sees ciphertext, the authorized see plaintext, and the grant is revocable",
        "The regulator holds a master private key that can move funds",
        "Losing the key freezes the assets permanently",
      ],
      answer: 1,
      explain: "Zcash's viewing key is the precedent. “Curtains drawn, a window left for the regulator” reproduces TradFi's information order: the market can't see you, the regulator can.",
    },
    {
      q: "As of 2025, which maturity ranking is correct?",
      options: [
        "ZK eligibility proofs are in mass production; permissioned chains are obsolete",
        "Permissioned-chain sub-transaction privacy (Canton) is in production; view keys are technically mature with packaging in progress; ZK eligibility proofs are in pilots (proving UX, revocation freshness, and regulator trust all unresolved)",
        "Every approach is still at the paper stage",
        "Venue privacy is the newest technology and nobody uses it yet",
      ],
      answer: 1,
      explain: "The honest timeline: institutions today use Canton-class permissioned chains; ZK is the direction but still climbing. The predicted convergence is “public rails + selective disclosure.”",
    },
    {
      q: "The core innovation of the Privacy Pools concept?",
      options: [
        "Mixing all funds together so nobody can trace them",
        "Attaching a zero-knowledge proof at withdrawal that “my funds don't come from the known hacker address set” — proving innocence without revealing identity, curing the original sin of mixers lumping good and bad together",
        "A government-operated official mixer",
        "A members-only mixer that bans hackers",
      ],
      answer: 1,
      explain: "Tornado Cash was sanctioned wholesale because good and bad shared a pool; Privacy Pools separates privacy from compliance with a proof of innocence — the model case for “auditability by design.”",
    },
  ],

  further: [
    { label: "Canton Network: institutional permissioned chain with sub-transaction privacy", url: "https://www.canton.network/" },
    { label: "Zcash: viewing keys, official documentation", url: "https://z.cash/learn/what-are-zcash-viewing-keys/" },
    { label: "Privacy Pools paper (Buterin et al., 2023)", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364" },
    { label: "Aztec Network: programmable privacy L2", url: "https://aztec.network/" },
    { label: "FATF: virtual-asset guidance (primary source on regulatory posture)", url: "https://www.fatf-gafi.org/en/topics/virtual-assets.html" },
  ],
};
