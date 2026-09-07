export default {
  id: "reading-docs",
  stage: 12,
  order: 2,
  title: "How to Read Offering Docs & Audit Reports",
  difficulty: "mastery",
  prereqs: ["token-vs-claim", "investor-rights"],

  oneLiner:
    "Offering documents are written by lawyers whose goal is to be “technically true, sentence by sentence” — your job is to find out what exactly they're technically true ABOUT. This lesson hands you an adversarial reading protocol: know what each document is for, walk into the private placement memorandum (PPM) with seven fixed questions, read the “Risk Factors” as a confession list, then spend ten free minutes cross-examining registries and EDGAR. A good document answers all seven questions; a bad one can't — and the most dangerous sentences are always written in the calmest tone.",

  intuition: `
The last lesson (Stage 12.1) taught you to draw a product's hexagon. But where do those six scores come from? Not from the landing page — on the landing page, every product is “safe, transparent, institutional-grade.” The scores hide inside a pile of PDFs nobody enjoys reading: the private placement memorandum, the subscription agreement, the trust deed, the attestation reports.

This is the least glamorous skill in the whole course, and the most valuable. The reason is simple: **the marketing page is written for you; the legal documents are written for a judge.** When they conflict — marketing says “redeem anytime,” the documents say “quarterly, subject to Manager consent” — the one that counts in law is always the latter. Projects that cheat you put the lie in the headline; the truth is usually printed in the small type on page 47, betting you'll never flip that far.

The good news: you don't need a law degree. Offering documents are heavily templated, and the key facts always hide in the same few sections; you just walk in carrying **seven fixed questions** and hunt down the answers one by one. A document that yields answers is a document; a document that doesn't is a **signal** — a file that won't tell you who custodies the assets is itself the loudest disclosure of all.

Even better news: beyond the documents lies a free layer of verification. The issuer says it's a Delaware LLC? The Delaware state website confirms that in thirty seconds. Says it ran a Reg D offering? SEC's EDGAR will hold the Form D trace (Stage 11.1). Says the contract was audited? The audit report names the address it covered. **Almost every off-chain claim has an off-chain public database you can confront it with** — this lesson teaches you to run that checklist to the end.

**Here's the map — five parts:**

- **① The document zoo: what each file is actually for**
- **② The seven-question protocol: reading the PPM with intent**
- **③ “Risk Factors” forensics: boilerplate is furniture, specificity is confession**
- **④ Audit & attestation reports: scope first, conclusions second**
- **⑤ Beyond the documents: ten minutes of free verification**
`,

  mechanics: `
### ① The document zoo: what each file is actually for

A legitimate RWA product will dump a stack of files on you. Don't spread your effort evenly — each file has a role, and reading file A as if it were file B is the classic beginner's error:

- **Private Placement Memorandum (PPM / Offering Memorandum)**: the deal's **constitution**. What you're buying, who issues it, where the money goes, how you exit, who gets paid first when things break — the authoritative answers live here. The seven-question protocol (see ②) is aimed squarely at it.
- **Subscription Agreement**: the **promises you make** when you sign — you represent that you're accredited, understand the risks, accept the transfer restrictions (Stage 7.2). Understand before signing: this document mostly protects the issuer, not you.
- **Operating / Trust Agreement**: the **DNA** of the entity holding the assets (Stage 5.2's SPV). What powers the manager has, whether it can be replaced, whether investors can vote — it's all in here.
- **Fact Sheet**: **marketing**. The numbers are cherry-picked, the wording polished by the marketing team. Fine as an on-ramp, **never as evidence**.
- **Attestation / audit reports**: Stage 4.2 taught the gulf between the two — an attestation is “a limited check of a snapshot at one moment”; an audit is a far broader opinion. See ④.
- **Smart-contract audit**: a **scope-limited** review of **code** — it looks at no assets, no law, no custody, only contract logic. Waving a contract audit around to imply “the whole product is audited” is a classic move.
- **Terms of Service (ToS)**: where retail-facing products hide the real deal. Many retail yield products have no PPM at all; the true legal relationship lives in the ToS nobody reads — “your assets may be lent to third parties” is exactly the sentence Celsius users missed there.

### ② The seven-question protocol: reading the PPM with intent

Don't read page one to the end — walk in with seven questions and hunt the answers one by one. For each question, three things: **where to look, what a good answer looks like, what a bad one looks like.**

<figure><svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><rect x="20" y="20" width="230" height="260" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="135" y="44" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">PPM (~60–120 pages)</text><text x="38" y="70" font-size="10.5" fill="var(--muted)">Securities Offered</text><text x="38" y="92" font-size="10.5" fill="var(--muted)">The Issuer</text><text x="38" y="114" font-size="10.5" fill="var(--muted)">Custody &amp; Assets</text><text x="38" y="136" font-size="10.5" fill="var(--muted)">Redemptions</text><text x="38" y="158" font-size="10.5" fill="var(--muted)">Fees &amp; Expenses</text><text x="38" y="180" font-size="10.5" fill="var(--muted)">Distribution Waterfall</text><text x="38" y="202" font-size="10.5" fill="var(--muted)">Transfer Restrictions</text><text x="38" y="224" font-size="10.5" fill="var(--orange-ink)">Risk Factors (see ③)</text><text x="38" y="246" font-size="10.5" fill="var(--muted)">Subscription Procedures</text><g font-size="11" fill="var(--ink)"><text x="290" y="70">← Q1 What exactly am I buying?</text><text x="290" y="92">← Q2 Who issues, registered where?</text><text x="290" y="114">← Q3 Where are the assets? Pledged?</text><text x="290" y="136">← Q4 How do I get my money back?</text><text x="290" y="158">← Q5 How many fee layers?</text><text x="290" y="180">← Q6 Where do I rank when it breaks?</text><text x="290" y="202">← Q7 Who can I transfer to?</text></g><text x="290" y="240" font-size="10.5" fill="var(--orange-ink)">All seven answered = a document; unanswered = the answer</text></svg></figure>

- **Q1 · What exactly am I buying?** Find “Securities Offered / The Offering.” Are you getting a share, a note, or an LLC membership unit? Each maps to a different claim chain (Stage 5.1). Good answer: one sentence — “the token is a digital representation of XX interest in XX entity.” Bad answer: “token” everywhere, never landing on a legal noun.
- **Q2 · Who is the issuing entity, registered where?** Find the full entity name + jurisdiction. Good: “Meridian Fund Ltd., a BVI business company, registration no. 208xxxx” — checkable. Bad: brand name only, no entity name. **No findable entity = walk.** That's a kill criterion in Stage 12.3.
- **Q3 · Where are the assets, who custodies them, are they encumbered?** Find the “Custody” section, then full-text search one word: **pledge**. Stage 8.3 covered PoR's blind spot — one sentence like “the Manager **may pledge** reserve assets to obtain financing” is a flare: what you thought was segregated safekeeping is actually a rehypothecatable pool. Good answer: named custodian, segregated assets, an explicit ban on rehypothecation.
- **Q4 · How do I get my money back?** Find “Redemptions.” Frequency (daily/monthly/quarterly), notice period, redemption fees, **gates and suspension clauses** (Stage 5.4 / 9.4). Good: suspensions have objective triggers and time limits. Bad: “redemptions may be suspended at the Manager's sole discretion” — no criteria, no limit.
- **Q5 · How many layers of fees in total?** Find “Fees and Expenses,” then **do the addition yourself**: management fee + subscription/redemption spread + stacked wrapper fees (Stage 10.2's OUSG-wrapping-BUIDL is the two-layer example) + gas. A Treasury product's all-in drag should be in the 0.15–0.5% range; if your sum exceeds 1%, whose payroll is your yield funding?
- **Q6 · When things break, who gets paid first — where do I rank?** Find “Distribution Waterfall / Subordination.” Stage 5.4 walked the liquidation waterfall: secured creditors → unsecured → you. Good: your rank stated explicitly. Bad: not a word — meaning you rank last by default.
- **Q7 · Who can I transfer to?** Find “Transfer Restrictions.” Reg D privates carry a 12-month resale lock (Stage 11.1's Rule 144); permissioned tokens transfer only to whitelisted addresses (Stage 7.3). **Key move**: hold this section against the marketing page — marketing shouts “liquidity! trade anytime!” while the documents say “quarterly window + Manager consent.” That gap is this lesson's best lie detector.

### ③ “Risk Factors” forensics: boilerplate is furniture, specificity is confession

Every PPM has a dozen pages of “Risk Factors,” and most people skip them — wrong. The way this chapter gets written is exactly what makes it valuable: **to shield the issuer from liability, the lawyers force the issuer to put the real ugly facts in writing.** Your skill is telling two kinds of sentences apart:

- **Boilerplate**: “the regulatory environment is uncertain,” “digital asset prices may fluctuate,” “past performance is no guarantee.” Every document has these — standard hotel-room furniture. **Reading boilerplate should reassure you**: its presence means the lawyers are doing their normal job.
- **Confession (specific)**: “the Fund's **sole** custodian is a **single non-US** bank,” “an affiliate of the Manager also serves as the asset servicer,” “**all** underlying loans originate from a single platform.” These sentences are **not** in every document — when one appears, it's because the lawyers knew the fact couldn't be hidden and had to be written. **Sweep the Risk Factors end to end, copy out every specific sentence — that's the issuer's confession list.**

One practical trick: specific risk factors state the most alarming facts in the calmest register. “The Fund's assets may be commingled with those of affiliates” — in plain speech, “your money may sit in the same account as ours.” **The calmer the tone and the more specific the content, the harder you circle it in red.**

### ④ Audit & attestation reports: scope first, conclusions second

Stage 4.2 gave five questions for reading attestation reports (who issued it, as of when, covering which assets, under what standards, attestation or audit). Here's the skeleton again, extended to contract audits:

- **Attestation ≠ audit**: an attestation is “management gave us a list and we checked it at one point in time”; an audit is a far broader, far heavier opinion. A product page that says “audited” above a report headed “attestation” — log that word gap as a red flag.
- **Check the letterhead**: does the firm actually exist? Does its size match the product's? A product managing hundreds of millions with a report from a “firm” that has no findable website — the report itself is a prop.
- **Check the date**: attestations are snapshots. The latest one is 8 months old? Stage 12.3's standard is within 90 days.
- **Three extra questions for contract audits**: **does it cover the deployed address** (the report names a commit or address — hold it against what's actually running on the block explorer; upgraded after the audit = audit void); **what severity were the findings** (how many Critical/High?); **fixed or merely acknowledged** (a pile of acknowledged criticals equals unfixed).

### ⑤ Beyond the documents: ten minutes of free verification

Documents read — don't conclude yet. Every key claim in them has a **public database** you can confront for free. The full routine takes ten minutes:

- **Entity registries**: Delaware corporate search, the BVI registry… take the entity name from Q2 and search. Not found = instant kill.
- **SEC EDGAR**: a legitimate Reg D offering files a **Form D** within 15 days, permanently searchable on EDGAR (Stage 11.1). A product claiming “private placement to US accredited investors” with zero trace on EDGAR — **that silence is very loud.**
- **Regulator license lookups**: claims a money-transmitter license? Check NMLS. Claims to be a New York trust? Check the NYDFS list. Claims a Singapore license? Check MAS's financial-institution directory (Stage 11.3). Every regulator publishes a list; impostors bet you won't look.
- **Block explorer**: take the contract address — is the source verified? Is the admin a single EOA or a multisig (Stage 6.5)? Does the address match the audit report?
- **The PoR feed**: if the product claims proof of reserve, go see whether that feed is actually updating (Stage 8.3).

Nail the methodology down: this lesson isn't teaching “reading documents” — it's teaching **adversarial reading**. These files are drafted by professionals whose goal is to be technically true in every sentence; your job is to work out what exactly they are technically true **about**. If you take away one sentence: **a good document answers all seven questions, a bad one can't — and the most dangerous sentences are always written in the calmest tone.**
`,

  demo: "doc-decoder",

  analogy: `
Think of reading offering documents as **buying a used car**. The listing (the marketing page / fact sheet) says “one careful owner, meticulously maintained, like new” — the ad isn't lying, but every word was chosen.

The **service logbook and title history** (the PPM / operating agreement) are the car's real file: transmission replaced twice in three years? A total-loss accident? It's all in there — in the smallest font, in the calmest voice. “March 2022: full airbag replacement” — the file doesn't explain why, but you should know to ask. That's Risk Factors forensics: **the ad's job is to sound good, the file's job is to shield from liability — and shielding requires writing the ugly facts down.**

The **third-party inspection report** (audit/attestation)? Letterhead and scope first: is it from a roadside stall or a real institution? Did it verify “the engine ran fine on inspection day,” or the whole vehicle? — “engine fine on one day” doesn't mean “this car was never flooded,” just as an attestation snapshot isn't an audit, and a contract audit is nowhere near “the product is safe.”

The final step every pro takes: walk the VIN into the **motor-vehicle registry** — is the car actually titled to the seller? Any liens? That's the role of entity registries and EDGAR: what the seller says matters little; **what the official database records is what matters**. Ten minutes, free, decisive — and most buyers never do it, which is precisely the business model every fraudster is built on.
`,

  misconceptions: [
    "“When the marketing and the documents disagree, split the difference.” —— No. Only the documents count in law. Marketing says “redeem anytime,” documents say “quarterly + Manager consent” — the latter is what you bought. And the gap itself is one of the strongest red flags there is.",
    "“The Risk Factors are all lawyer boilerplate — skip them.” —— The boilerplate is indeed furniture, but the specific risk factors are confessions the lawyers forced the issuer to write (“the sole custodian is a single non-US bank”). Skipping the chapter means throwing away a confession list the issuer handed you personally.",
    "“There's an audit report, so the product is safe.” —— Ask three things first: audit or attestation? What did the scope cover (a snapshot isn't a running guarantee; a contract audit isn't asset verification)? Does the audited address match what's deployed on-chain? Outside the scope, the report says nothing at all.",
    "“The documents are too technical — retail readers can only rely on trust.” —— The seven-question protocol needs no law degree: each question maps to a fixed section; find the answer and copy it down. The real divide isn't “knowing law,” it's “bothering to check” — entity registries and EDGAR are free.",
    "“If the documents don't mention something, it's probably fine.” —— The opposite. A proper document's duty is full disclosure; silence on a key question (who is the custodian? where do I rank?) is not neutral — it's a loud signal. For a document that can't answer all seven questions, the missing answers are the conclusion.",
  ],

  quiz: [
    {
      q: "A PPM contains “the Manager may pledge reserve assets.” The correct reading is?",
      options: ["Legal boilerplate — every fund writes this", "A flare: what you thought was segregated custody is actually rehypothecatable — exactly the blind spot PoR can't prove away", "Good news — the manager has financing options", "It only affects institutional investors"],
      answer: 1,
      explain: "One “may pledge” turns “segregated assets” into “a re-pledgeable pool.” A calm tone doesn't mean a calm fact (Stage 8.3's blind spot, as it appears in documents).",
    },
    {
      q: "Why are “specific” risk factors worth more than boilerplate?",
      options: ["Because they're longer", "Because they're true statements the lawyers forced the issuer to write for liability protection — not every document has them; their appearance is a confession", "Because boilerplate has no legal force", "They're actually equally important"],
      answer: 1,
      explain: "Boilerplate is universal furniture; a sentence like “the sole custodian is a single non-US bank” gets written only because it couldn't be hidden. Sweep the chapter as a confession list.",
    },
    {
      q: "Marketing says “trade anytime, ample liquidity”; the documents say “quarterly redemption windows subject to Manager consent.” What did you legally buy?",
      options: ["A compromise between the two", "The marketing version, since that's the public promise", "The documents' version — and the gap itself is one of the best lie detectors available", "Whatever customer support says"],
      answer: 2,
      explain: "To a judge, only the documents count. Q7 of the protocol exists precisely to run this comparison.",
    },
    {
      q: "Reading a smart-contract audit, the most commonly missed critical check is?",
      options: ["Whether the report has enough pages", "Whether the audit covers the address/version actually deployed on-chain — upgraded after the audit means effectively unaudited", "The audit firm's nationality", "Whether the report has a translation"],
      answer: 1,
      explain: "An audit binds to a commit or address; if what's deployed is a later upgrade, the conclusions don't carry over. Thirty seconds on a block explorer settles it.",
    },
    {
      q: "A product claims “a Reg D private placement to US accredited investors,” but EDGAR shows no Form D at all. This means?",
      options: ["EDGAR is incomplete — normal", "Reg D requires no filing", "A very loud red flag: a legitimate Reg D offering leaves a Form D trace within 15 days", "Only that the product is new"],
      answer: 2,
      explain: "Form D is the public trace of a Reg D offering (Stage 11.1). Claiming one without the trace means either it didn't happen or it broke the rules — both are reasons to walk.",
    },
  ],

  further: [
    { label: "SEC EDGAR full-text search (find Form Ds & issuers)", url: "https://www.sec.gov/edgar/search/" },
    { label: "SEC Form D itself (what a Reg D trace looks like)", url: "https://www.sec.gov/about/forms/formd.pdf" },
    { label: "Delaware corporate entity search (Q2's thirty-second check)", url: "https://icis.corp.delaware.gov/ecorp/entitysearch/NameSearch.aspx" },
    { label: "NMLS Consumer Access (US money-services license lookup)", url: "https://www.nmlsconsumeraccess.org/" },
    { label: "NYDFS virtual currency licensee list", url: "https://www.dfs.ny.gov/virtual_currency_businesses" },
  ],
};
