export default {
  id: "redflags-checklist",
  stage: 12,
  order: 3,
  title: "The Red-Flag Checklist: A Due-Diligence Playbook",
  difficulty: "mastery",
  prereqs: ["risk-map", "reading-docs"],

  oneLiner:
    "Diligence isn't “suspect everything” — it's **demanding evidence, item by item, in the right order** — and the order is the efficiency: run the five-minute kill criteria that can end the whole thing first, then spend an hour verifying structure, then data, then the market, and finally the monthly monitoring that never stops. This lesson compresses the previous two into an executable four-phase protocol and a ~20-item checklist — that checklist is what you take with you. Remember two lines: no red flags ≠ a green light; and diligence decays.",

  intuition: `
Stage 12.1 gave you a risk map; Stage 12.2 taught you to read the scores out of the documents. But the moment you face an actual product, the question becomes intensely practical: **what do I do first?**

That's not a small thing. Serious diligence done as “read every document cover to cover” costs you a full day per product. And the reality is that maybe half the products you encounter should be killed in **the first five minutes**. Spending a whole day on something promising “40% annually, risk-free” isn't rigor; it's waste.

So professionals run **triage** — like an emergency room, **cheap kills first**. The first gate is a handful of “kill criteria” that require no investigation at all: hit even one, walk away, do no further work. Only what survives gate one deserves your hour of structure verification; only what passes structure deserves data verification; only what passes data deserves a market check. Whatever is still alive after four gates is what you hand to Stage 12.4 to price.

The order carries a hidden benefit too: **it protects you from sunk cost.** Once you've read three hours of whitepaper and spoken with the founder twice, your brain will start manufacturing excuses on the product's behalf. Running the kill criteria first means judging before you're emotionally invested.

Finally, two lines that belong at the top of the checklist. First: **no red flags is not a green light** — a clean diligence pass earns the product the right to advance to the next analysis, not your money. Second: **diligence decays** — a clean check-up six months ago is history; custodians change, keys change, attestations lapse. That's why there's a fourth phase.

**Here's the map — five parts:**

- **① The triage logic: why order is efficiency**
- **② Phases 0 and 1: kill criteria and structure verification**
- **③ Phases 2 and 3: data and market verification**
- **④ Phase 4: the five metrics of post-investment monitoring**
- **⑤ The full checklist: grouped by the six layers, with weights**
`,

  mechanics: `
### ① The triage logic: why order is efficiency

<figure><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="redflags-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--orange-line)"/></marker></defs><rect x="20" y="60" width="105" height="60" rx="8" fill="var(--red-soft)" stroke="var(--line)"/><text x="72" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Phase 0</text><text x="72" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">kill criteria · 5 min</text><rect x="150" y="60" width="105" height="60" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="202" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Phase 1</text><text x="202" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">structure · 1 hour</text><rect x="280" y="60" width="105" height="60" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="332" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Phase 2</text><text x="332" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">data</text><rect x="410" y="60" width="105" height="60" rx="8" fill="var(--surface-2)" stroke="var(--line)"/><text x="462" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Phase 3</text><text x="462" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">market</text><rect x="540" y="60" width="85" height="60" rx="8" fill="var(--green-soft)" stroke="var(--line)"/><text x="582" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">Phase 4</text><text x="582" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">monthly</text><path d="M125 90 L148 90" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#redflags-arr)"/><path d="M255 90 L278 90" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#redflags-arr)"/><path d="M385 90 L408 90" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#redflags-arr)"/><path d="M515 90 L538 90" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#redflags-arr)"/><g font-size="10" fill="var(--red)"><text x="72" y="145" text-anchor="middle">↓ hit = walk</text><text x="202" y="145" text-anchor="middle">↓ hit = walk</text><text x="332" y="145" text-anchor="middle">↓ doubt = stop</text><text x="462" y="145" text-anchor="middle">↓ doubt = stop</text></g><text x="320" y="185" text-anchor="middle" font-size="11.5" fill="var(--ink)">Passing all four earns a Stage 12.4 yield analysis — not a green light</text><text x="320" y="210" text-anchor="middle" font-size="11" fill="var(--muted)">Why Phase 4 exists: diligence decays</text><text x="320" y="232" text-anchor="middle" font-size="10.5" fill="var(--orange-ink)">Cheap kills first: judge before you're emotionally invested</text></svg></figure>

That diagram is the whole protocol. To feel its power, accept one counterintuitive fact: **the goal of diligence is not to prove a product is good, but to find the cheapest, fastest reason to kill it.** Only when you fail to find one do you move on.

Three principles run throughout: **ascending cost** (free, five-minute moves go first), **negation first** (each gate is a filter, not a score), and **evidence over impression** (“the team looks professional” is not evidence; “registration no. 208xxxx is findable in the BVI registry” is).

### ② Phases 0 and 1: kill criteria and structure verification

**Phase 0 · Kill criteria (~5 minutes) — hit any one, walk away, do no further work:**

- **A yield above the asset class's ceiling, presented as riskless.** In an era of 4–5% T-bills (Stage 3.2), a product claiming 15% “stable and safe” fails on arithmetic — that extra 10% comes from somewhere (Stage 12.4 takes it apart).
- **No identifiable legal entity or jurisdiction.** No entity = no claim = you bought a sentence (Stage 5.1).
- **“Audited” without a named firm.** Projects that really got audited treat the firm's name as an asset and put it on the front page.
- **“Principal protected” / “guaranteed returns” language.** Lawful securities offerings can't say that; whoever does is usually outside any regulatory framework.
- **An anonymous team WITH admin keys over user funds.** Stage 6.5 explained the switches are necessary — but anonymity + switches = uninsurable: when it breaks, you don't even know whom to sue.
- **Referral / multi-tier reward mechanics.** When customer acquisition is paid for by recruiting more customers, the yield structure already carries Ponzi genetics.

**Phase 1 · Structure verification (~1 hour) — use Stage 12.2's method to turn claims into evidence:**

- **The claim chain traces to a real entity**: token → interest → entity, with the entity findable in an official registry (Delaware/BVI/Cayman search).
- **The custodian is named and independently confirmable**: not just a name in a document, but confirmation from the custodian's side or a regulator's license register that the relationship exists (Stage 12.2).
- **Offering traces exist**: Reg D should leave a Form D on EDGAR; licensed entities should appear in NMLS / NYDFS / MAS registers (Stages 11.1, 11.3).
- **The contract's source is verified on-explorer**, and **the admin-key setup matches disclosure**: a single EOA, a multisig, or a timelock? Documents saying multisig while the chain shows one key is worse than either fact alone (Stage 6.5).

### ③ Phases 2 and 3: data and market verification

**Phase 2 · Data verification** — check whether the numbers you see on-chain have a credible source (all of Stage 8, applied):

- **The attestation is recent**: the latest one within **90 days**; the issuing firm real and appropriately sized; the **scope meaningful** (does it cover all reserves, or one account on one day) — Stage 4.2's five questions.
- **If PoR is claimed, the feed must actually be moving**: open it and check the last update time (Stage 8.3). And remember its blind spot: it proves the assets are there, not that they're unpledged.
- **Cross-chain supply reconciles**: for multichain products, the sum of per-chain supply should equal total issuance (Stage 10.1's bridge surface). A mismatch is one of the hardest alarms available.
- **NAV cadence matches the asset type**: a product promising “daily redemption” whose NAV updates quarterly — that's Stage 3.5's maturity mismatch, surfacing as a data flare.

**Phase 3 · Market verification** — let the market vote for you:

- **Does the secondary price hug NAV?** The discount is the crowd's verdict (Stage 9.4). A persistent deep discount means someone learned something before you did.
- **Holder concentration**: check the top-10 addresses' share on a block explorer. In a “community project” where 90% sits in a few wallets, those wallets are your counterparty on the way out.
- **Has anyone publicly completed a redemption?** The single most underrated piece of evidence. Search the forums and social media — did anyone actually get their money back, and how long did it take? A product with mint records but no redemption records is a one-way door.

### ④ Phase 4: the five metrics of post-investment monitoring

Buying is not the end of diligence. **A clean check-up is history six months later**: the custodian may have changed, the keys may have changed, the attestations may have stopped. Give yourself ten minutes a month and look at just five things:

- **Attestation freshness**: is the latest one still within 90 days? A stopped cadence is itself a signal.
- **Secondary price / peg**: still hugging NAV? A widening discount is the earliest warning there is (Stage 9.4).
- **Supply / reserve ratio**: supply grew but reserves didn't? That's the eve of a depeg.
- **Admin-key changes**: set an explorer alert on the contract; ownership transfers, upgrades, and pause events all deserve a same-day look (Stage 6.5).
- **Issuer news**: lawsuits, regulatory letters, key-person departures. Issuer-layer risk (Stage 12.1) almost always shows up in the news before it shows up in the NAV.

### ⑤ The full checklist: grouped by the six layers, with weights

This is the lesson's **artifact** — grouped by Stage 12.1's six layers, each item weighted: **KILL = hit and walk**; **MAJOR = needs a satisfying explanation to continue**; **MINOR = note it; it affects pricing**.

**① Asset layer**: yield above the asset class ceiling while called riskless (**KILL**) · underlying class, rating and maturity clearly disclosed (**MAJOR**) · historical default/loss data available (**MINOR**).

**② Issuer layer**: anonymous team holding switches over user funds (**KILL**) · issuing entity has a findable identity and operating history (**MAJOR**) · related-party dealings exist and are disclosed (**MAJOR**) · key-person concentration (**MINOR**).

**③ Legal/structure layer**: no findable legal entity or jurisdiction (**KILL**) · “principal protected / guaranteed return” language (**KILL**) · true-sale and bankruptcy-remote structure present (**MAJOR**) · offering traces (Form D / licenses) exist (**MAJOR**) · liquidation rank stated (**MAJOR**) · transfer restrictions consistent with marketing claims (**MINOR**).

**④ Custody layer**: “audited” without a named firm (**KILL**) · custodian named, independent, confirmable (**MAJOR**) · documents permit pledging/rehypothecation (**MAJOR**) · assets segregated from the issuer's own (**MAJOR**).

**⑤ Data layer**: attestation within 90 days with meaningful scope (**MAJOR**) · PoR feed genuinely updating (**MAJOR**) · cross-chain supply reconciles (**MAJOR**) · NAV cadence matches the redemption promise (**MINOR**).

**⑥ Contract/chain layer**: contract source verified (**MAJOR**) · admin-key setup matches disclosure (**MAJOR**) · audit scope covers the deployed address and criticals are fixed (**MAJOR**) · number of bridges and their security record (**MINOR**).

**Cross-layer (market and ongoing)**: referral/multi-tier mechanics (**KILL**) · persistently abnormal secondary discount (**MAJOR**) · holder concentration (**MINOR**) · public evidence of completed redemptions (**MINOR**) · the five monthly re-checks are actually happening (**MAJOR**).

Three pieces of sidebar wisdom, easier to forget than the checklist itself:

- **No red flags ≠ a green light.** A clean run earns the product a Stage 12.4 yield analysis. A checklist can exclude known bads; it cannot prove unknown goods.
- **Diligence decays.** Hence Phase 4. Write the date of your last check into your own notes.
- **The social-proof trap.** A big name in a press release ≠ a big name's obligation in the documents. The favorite move of frauds is putting a famous logo on the homepage (Stage 10.6's fake-partnership deaths). **The correct action: search the documents for that name** — if it appears only in marketing and nowhere in the PPM or the custody agreement, that “partnership” does not legally exist.

If you take away one sentence: **diligence isn't suspecting everything — it's demanding evidence item by item from a list; hold the list, and the skill follows.**
`,

  demo: "redflag-hunt",

  analogy: `
Think of this protocol as an **emergency-room triage desk**. Patients flood in, and no doctor runs a full CT on each in arrival order — the most critical would die in the queue. What the triage nurse does first is a few **thirty-second checks**: consciousness, breathing, pulse. Fail one of the three and you're wheeled straight to resuscitation, all other tests deferred.

RWA kill criteria are those thirty-second checks: **15% promised risk-free, no findable entity, an anonymous team holding the switches** — hit one and you don't need to finish the whitepaper. Conversely, only a patient in no immediate danger gets bloodwork (structure), imaging (data), and observation (market) — **ascending cost is the whole wisdom of triage**.

The triage desk teaches a second lesson: **the nurse isn't trying to prove a patient is healthy, only to find fast who can't wait.** Diligence is the same — you're not scoring a product for excellence, you're looking for the reason to kill it immediately. If none appears, you continue.

Finally, hospitals have something matching Phase 4: **vital-sign monitoring during the stay.** Normal on admission doesn't mean normal on day three, so a nurse takes blood pressure every few hours. Your five monthly metrics (attestation freshness, peg, reserve ratio, key changes, issuer news) are those vitals — **diligence isn't a one-time surgery; it's continuous monitoring**.
`,

  misconceptions: [
    "“Diligence means reading all the materials.” —— That's the most expensive, slowest, most sunk-cost-vulnerable approach. The right order is triage: run the five-minute kill criteria first; only survivors deserve the hour on structure. Ascending cost, negation first.",
    "“Ran the checklist, found no red flags — time to buy.” —— No red flags only earns the product entry into the yield analysis (Stage 12.4). A checklist excludes known bads; it can't prove unknown goods. The next question is whether the yield's source adds up.",
    "“I did diligence six months ago, so I can add to the position now.” —— Diligence decays. Custodians change, admin keys change, attestations stop. That's what Phase 4's five monthly checks are for — a clean historical check-up isn't current health.",
    "“A famous institution's logo on the homepage means a real endorsement.” —— A press-release partner ≠ an obligation in the documents. The right move is to search the PPM and custody agreement for that name; a “partnership” that exists only in marketing does not exist in law (Stage 10.6's fake-partnership deaths).",
    "“Diligence means suspecting everything — better to over-flag.” —— No. Flagging everything is as bad as flagging nothing: treat normal private-placement transfer restrictions and normal legal boilerplate as danger and you'll reject every compliant product, leaving only the scams that “look simple.” Precision matters as much as sensitivity.",
  ],

  quiz: [
    {
      q: "Why run diligence in the order “Phase 0 kill criteria → Phase 1 structure → Phase 2 data → Phase 3 market” instead of reading everything front to back?",
      options: ["Because regulators require it", "Because of ascending cost + negation first: cheap kills go first, and you judge before becoming emotionally invested", "Because the later materials don't matter", "Because speed beats accuracy"],
      answer: 1,
      explain: "Triage logic: half of products should die in five minutes. Discover a problem after three hours of reading and sunk cost starts inventing excuses for it.",
    },
    {
      q: "Which of these is a “Phase 0 kill criterion” — hit it and walk, with no further work?",
      options: ["Management fee 0.2% above comparable products", "A 1.5% secondary-market discount", "An anonymous team that also holds admin keys over user funds", "NAV updated daily rather than in real time"],
      answer: 2,
      explain: "Anonymity + switches = uninsurable: when it breaks you don't even know whom to sue (Stage 6.5). The other three are pricing questions, not walk-away questions.",
    },
    {
      q: "For a multichain product, the hardest reconciliation in data verification is?",
      options: ["Website load speed", "Whether the sum of per-chain supply equals total issuance (bridge surface, Stage 10.1)", "Social media follower count", "Whitepaper page count"],
      answer: 1,
      explain: "A mismatch means something is wrong with the bridge, mint permissions, or disclosure — one of the few hard contradictions you can catch with public data alone.",
    },
    {
      q: "Among the five monthly re-checks, why does “attestation freshness” deserve its own line?",
      options: ["Because attestations are expensive", "Because a stopped cadence is itself a signal — diligence decays, and attestations are the fastest thing to expire", "Because regulators mandate monthly attestations", "Because attestations prove nothing is pledged"],
      answer: 1,
      explain: "Stage 12.3's standard is within 90 days. A firm that had been publishing quarterly and suddenly stops usually precedes any NAV signal. (Incidentally: attestations specifically cannot prove nothing is pledged — that's Stage 8.3's blind spot.)",
    },
    {
      q: "A project's homepage displays a well-known custodian's logo. The correct verification move is?",
      options: ["Screenshot it as an endorsement", "Search the PPM and custody agreement for that name, confirming a documented obligation rather than a PR appearance", "Just email the institution", "See whether anyone in the community objects"],
      answer: 1,
      explain: "A press-release partner isn't a documented obligation. A “partnership” that appears only in marketing does not exist in law (Stage 10.6).",
    },
  ],

  further: [
    { label: "SEC: Avoiding investment fraud (the official red-flag list)", url: "https://www.investor.gov/protect-your-investments/fraud" },
    { label: "SEC EDGAR full-text search (verify offering traces)", url: "https://www.sec.gov/edgar/search/" },
    { label: "NMLS Consumer Access (license verification)", url: "https://www.nmlsconsumeraccess.org/" },
    { label: "CFTC: Customer Advisories (digital-asset fraud patterns)", url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/index.htm" },
    { label: "rwa.xyz (cross-check product supply and size data)", url: "https://app.rwa.xyz/" },
  ],
};
