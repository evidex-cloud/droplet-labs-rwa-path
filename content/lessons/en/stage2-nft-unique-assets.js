export default {
  id: "nft-unique-assets",
  stage: 2,
  order: 5,
  title: "NFTs & ERC-721: One-of-a-Kind On-chain Certificates",
  difficulty: "core",
  prereqs: ["erc20-tokens"],

  oneLiner:
    "Last lesson's ERC-20 records “how many you hold”; this lesson's ERC-721 (the NFT standard) records “who owns this particular one” — every token has its own ID and its own owner, none interchangeable: a ledger of unique certificates. Don't let the ape avatars mislead you: in RWA, NFTs register a specific invoice, a specific building, a specific bond lot. And “NFT for the one thing, ERC-20 for the shares” are often stacked together — lock the building's deed NFT in a vault, issue 1,000 ERC-20 fractions, and you have an on-chain two-layer cap table.",

  intuition: `
ERC-20's “address→balance” table records dollars or fund shares flawlessly — because **every unit is identical**, so counting is all you need. Now try a different asset: record your house with it.

Write “you → 1”? Is that 12 Long Street or number 14 next door? The two differ in price by 3x. Write “you → 0.5”? Which half of the building? ERC-20's table is **congenitally unable to record “which one”** — it treats every unit as an indistinguishable drop of water. Yet a huge share of real-world assets are precisely “**each one is different**”: houses, invoices, bond lots, luxury watches, artworks. A $1M receivables invoice and another $1M invoice have different debtors, different maturities, different default risk — **they are simply not the same thing**.

So you need a different book: not “how many,” but “**ID → owner**.” Certificate #7 belongs to Alice, #8 to Bob; every number is unique with its own history. That is **ERC-721**, better known as the **NFT (Non-Fungible Token)**. In 2021 it went mainstream via absurdly priced ape avatars, earning a mixed reputation — but skim off the speculative froth and the machine underneath is exactly the tool RWA needs most: **a tamper-proof registry of one-of-a-kind items**.

**Here's the map — five parts:**

- **① ERC-721: a registry of “ID → owner”**
- **② tokenURI & metadata: what this token actually IS**
- **③ Beyond the apes: where RWA genuinely uses NFTs**
- **④ The decision rule: when ERC-20, when NFT**
- **⑤ Fractionalization: lock the NFT in a vault, issue ERC-20 shares**
`,

  mechanics: `
### ① ERC-721: a registry of “ID → owner”

Set it side by side with last lesson and the difference jumps out. ERC-20's core state is \`address → balance\`; ERC-721 (EIP-721, finalized 2018) flips it — the core state is:

- \`mapping(uint256 => address) owners\` — “**which ID (tokenId) belongs to which address**”;
- The queries flip too: ERC-20 asks \`balanceOf(you) = ? units\`; ERC-721's most important question is \`ownerOf(#7) = who\` (it also has a \`balanceOf\`, but that only answers “how many items you own,” never which ones).

The transfer function therefore looks different: \`transferFrom(from, to, tokenId)\` — note the last argument is an **ID**, not a quantity. You aren't transferring “3 units”; you're transferring “**item #7**.” Every tokenId is unique across the contract, indivisible (there is no 0.5 of #7), and individually approvable (\`approve(address, tokenId)\` authorizes exactly that one item — yet another mirror image of ERC-20's amount-based allowances).

One sentence to fix the model: **ERC-20 is a money ledger; ERC-721 is the registrar's title book.** Flip through the money ledger and you see numbers; flip through the title book and every page is a distinct asset.

### ② tokenURI & metadata: what this token actually IS

The registry says “#7 belongs to Alice” — but what **is** #7? A building? An invoice? An ape? That's answered by **metadata**. The standard approach: the contract exposes \`tokenURI(tokenId)\`, which returns a link to a JSON description file — name, image, attributes (for RWA: address, floor area, valuation report, debtor, maturity date…).

Now for this lesson's **most important trap**: that JSON usually lives **off-chain** (on-chain storage is brutally expensive — storing a 1MB image can cost hundreds or thousands of dollars in gas), sitting on some server or on IPFS. If \`tokenURI\` returns an **ordinary URL** (\`https://issuer.com/deed/7.json\`), then whoever runs the server **can change the file's contents at any time** — your “deed” says 12 Long Street, 89 m² today, and can be quietly edited to 39 m² tomorrow. The on-chain record “#7 is yours” stays **perfectly intact — and perfectly meaningless**. You own a pointer, and what the pointer points at is in someone else's hands.

The fix is **content addressing**: don't find the file by location, find it by **fingerprint**. Hash the metadata file (Stage 2.1: change one character and the fingerprint changes beyond recognition) and write the hash on-chain — or use IPFS, whose CID *is* a content hash. From then on, anyone holding the metadata file can re-hash it and compare against the chain: **match, and the file was never touched; mismatch, and the tampering is exposed on the spot**. Mind the limits, though: this guarantees “the file wasn't altered,” not “the file tells the truth.” Whether the flat really measures 89 m² still depends on off-chain appraisal and law (Stage 1.2's mirror principle: the chain can guard the mirror, not the physical thing outside it — Stage 1.3's trust bridge handles that part).

### ③ Beyond the apes: where RWA genuinely uses NFTs

The 2021 avatar mania nearly turned “NFT” into a slur. But strip out the speculation and look at assets that are **inherently one-of-a-kind** — there, the NFT is the natural registration tool:

- **A specific invoice / a specific loan**: Centrifuge's asset pools are built exactly this way — each real-world receivable, each mortgage, is first minted as **one NFT** (ID, debtor, amount, maturity in the metadata), then a pool packages a batch of NFTs for financing. When one claim defaults, you can trace it precisely to “invoice #47 went bad” instead of a blurred average;
- **A specific property**: the deed position is registered as an NFT — “this building,” not “some square meters.” Transferring the whole building = transferring one NFT;
- **A specific bond lot**: different lots within one issuance can carry different lockups and terms; the lot itself is a unique item;
- **Serial-numbered luxury goods**: watches, wine, diamonds — each carries a serial, and the NFT provides on-chain authenticity and provenance.

The common thread: these assets **must be traced item by item** — priced individually, defaulted individually, liquidated individually. Stuff them into ERC-20's quantity table and the information is destroyed on contact.

### ④ The decision rule: when ERC-20, when NFT

This is the first fork in any issuer's architecture (you'll meet it again choosing a stack in Stage 13.3), and the rule fits in one sentence:

- **Ask what the unit is.** If **many holders share one homogeneous pool** — money-market fund shares, treasury fund shares, grams of gold — every share identical, only quantities matter → **ERC-20**;
- If **the asset itself is the unit** and must be identified and traced individually — this invoice, this building, this lot → **NFT (ERC-721)**.

A quick litmus test: swap two holders' positions — does anyone lose? Swap fund shares and nobody cares (fungible); swap two invoices and the debtor and risk change entirely (non-fungible). The former is ERC-20, the latter NFT. There's an engineering angle too: ERC-20 is natively divisible (18 decimals), NFTs are indivisible — **and divisibility is the precondition for fractional investing**. Which raises the puzzle: a building is one item (wants an NFT), but you want 1,000 people to each buy a small slice (needs divisibility) — now what? That's ⑤.

### ⑤ Fractionalization: lock the NFT in a vault, issue ERC-20 shares

The standard answer is to **stack both layers** — the industry calls it **fractionalization**:

- **Layer one (the unique-item layer)**: mint “12 Long Street” as a deed NFT, registering full title to “this building”;
- **Lock it**: transfer the NFT into a **vault contract** — from then on \`ownerOf(deed) = the vault\`, and no individual can move it;
- **Layer two (the shares layer)**: the vault issues 1,000 ERC-20 tokens (call them FRAC) and sells them to investors. Alice buying 400 = holding 40% of the building's economic interest.

That is an **on-chain two-layer cap table**: the NFT layer answers “which item, held by which entity,” and the ERC-20 layer answers “how that entity's interest is divided.” Look familiar? It's the on-chain mirror of traditional finance's “the SPV holds the asset, shareholders hold the SPV” — Stage 5.2 shows how the legal layer (SPVs and bankruptcy remoteness) maps one-to-one onto these two token layers.

But the two-layer structure also **creates** new problems that the offering documents must spell out (a preview of investor rights, Stage 5.4):

- **Who can sell the whole building?** The building is indivisible; what happens when 1,000 fraction holders disagree? The common design is a **buyout / exit clause**: a bidder deposits the money into the vault, fraction holders vote (say, a two-thirds majority), and if it passes the sale is forced through, with proceeds split pro rata;
- **Deadlock risk**: set the threshold too high and the asset may never sell — fractions become orphans; too low, and a whale can force out small holders at a lowball price;
- **A fraction ≠ a deed**: what are Alice's 400 FRAC legally — SPV equity? A participation note? Or nothing at all? That determines whether she can stand in a courtroom when things go wrong (Stage 5.1 devotes itself to this question).

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="nft-arr-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="20" y="30" width="180" height="110" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)" stroke-width="1.5"/>
  <text x="110" y="54" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">Deed NFT #1</text>
  <text x="110" y="74" text-anchor="middle" font-size="10" fill="var(--ink)">12 Long St · 89 m²</text>
  <text x="110" y="92" text-anchor="middle" font-size="9" fill="var(--muted)">metadata hash 0x3f8a…c21d</text>
  <text x="110" y="112" text-anchor="middle" font-size="10" fill="var(--ink)">ownerOf(#1) = vault 🔒</text>
  <line x1="200" y1="85" x2="260" y2="85" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#nft-arr-en)"/>
  <text x="230" y="72" text-anchor="middle" font-size="9" fill="var(--muted)">lock</text>
  <rect x="264" y="30" width="160" height="110" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="344" y="54" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">Vault contract</text>
  <text x="344" y="74" text-anchor="middle" font-size="10" fill="var(--muted)">holds the NFT,</text>
  <text x="344" y="90" text-anchor="middle" font-size="10" fill="var(--muted)">issues 1,000 FRAC</text>
  <text x="344" y="112" text-anchor="middle" font-size="9" fill="var(--muted)">exit: buyout vote ≥ 2/3</text>
  <line x1="424" y1="85" x2="484" y2="85" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#nft-arr-en)"/>
  <text x="454" y="72" text-anchor="middle" font-size="9" fill="var(--muted)">issue shares</text>
  <rect x="488" y="30" width="132" height="110" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="554" y="54" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">FRAC (ERC-20)</text>
  <text x="500" y="76" font-size="10" fill="var(--ink)">Alice</text>
  <text x="608" y="76" text-anchor="end" font-size="10" fill="var(--ink)">400</text>
  <text x="500" y="94" font-size="10" fill="var(--ink)">Bob</text>
  <text x="608" y="94" text-anchor="end" font-size="10" fill="var(--ink)">350</text>
  <text x="500" y="112" font-size="10" fill="var(--ink)">Carol</text>
  <text x="608" y="112" text-anchor="end" font-size="10" fill="var(--ink)">250</text>
  <rect x="20" y="170" width="600" height="100" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="196" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="600">Two-layer cap table: the NFT layer records “which item, held by which entity”; the ERC-20 layer records “how it's divided”</text>
  <text x="320" y="220" text-anchor="middle" font-size="10" fill="var(--muted)">= the on-chain mirror of “SPV holds the asset, shareholders hold the SPV” (Stage 5.2)</text>
  <text x="320" y="244" text-anchor="middle" font-size="10" fill="var(--red)">New problems: who can sell the building? Buyout clauses, vote thresholds, deadlock risk — the docs must spell it out</text>
</svg>
<figcaption>Fractionalization = the unique-item layer (NFT) stacked with the shares layer (ERC-20). Each layer answers one question — and carries its own risk.</figcaption>
</figure>

If you take away one sentence: **an NFT is the chain's “registry of unique items” — ownerOf(id) records who owns this particular one, and content hashes keep the metadata tamper-evident; RWA uses it for invoices, properties, and lots that must be traced individually, while “lock the NFT in a vault, issue ERC-20 fractions” is the standard two-layer structure for splitting one unique asset among a thousand people.**
`,

  demo: "nft-deed",

  analogy: `
Visit a **land registry office**. The hall keeps two kinds of books. One is like a **bank ledger** — it only records how much money sits in each account, every dollar equal to every other: that's ERC-20. The other is the **title book** — one page per building, the page number is the tokenId, and each page states the location, the floor area, and the rights holder: that's ERC-721. You never ask “how many pages do I have?”; you ask “**the building on page 7 — whose name is on it?**” That question is \`ownerOf\`.

The title book has an ancient weakness: **the description on the page can be doctored**. If “89 m²” is written in pencil (metadata behind a mutable URL), a clerk with an eraser can make it “39 m²” — your name is still on the page, but what you own has changed. The countermeasure is an **embossed seal** on every page (the content hash): alter one character of the description and the seal no longer matches, and anyone can check. But the seal only guarantees “the page wasn't altered,” never “the page tells the truth” — whether the flat really has 89 m² is for the surveyor (off-chain verification and law) to establish.

Now someone wants to sell one building to 1,000 small investors. The registry's solution is not to tear the title page into 1,000 strips — title pages don't tear (NFTs are indivisible). Instead: transfer the page to a **purpose-built holding company** (the vault contract), and have the company print 1,000 **share certificates** (the ERC-20 fractions). The building belongs to the company; the company belongs to the shareholders — two books, two jobs.

But the company's charter must settle one thing in advance: **under what conditions may the building be sold**. When a bidder offers a high price for the whole building, does a two-thirds shareholder vote force the sale, or can one holdout veto it? Set the bar too high and the building is stuck forever; too low and big shareholders can squeeze out the small ones. That page of the charter is the part of any fractionalized-RWA offering document most worth reading word by word.
`,

  misconceptions: [
    "“NFTs are overpriced JPEGs / ape avatars — nothing to do with serious finance.” —— Avatars were merely the first application (and mostly a bubble). The machine itself is a tamper-proof registry of unique items; RWA uses it to register specific invoices (Centrifuge's pools are built on invoice NFTs), properties, bond lots, and serial-numbered luxury goods — anything that must be traced item by item.",
    "“When I buy an NFT, the image/file is ‘stored on-chain’ and belongs to me.” —— The chain usually holds only the ownerOf record and a tokenURI pointer; the metadata file itself lives off-chain. If the pointer is a mutable URL, the server's owner can change the content at will. The robust approach is content hashing / IPFS — and even that only prevents tampering, never proves the content true.",
    "“NFTs and ERC-20 are competitors; pick one.” —— They're often stacked: an NFT registers ‘this one item’ (the unique layer), then, locked in a vault, an ERC-20 registers ‘how many shares’ (the fraction layer). Virtually all fractional real-asset offerings use this two-layer structure.",
    "“You can sell part of an NFT — say 0.3 of it.” —— An ERC-721 tokenId is indivisible; there is no 0.3 of #7. To share it among many people you fractionalize: lock the whole NFT in a vault and have the vault issue divisible ERC-20 shares.",
    "“If the metadata hash checks out, the flat really is 89 m².” —— The hash only proves the file hasn't changed since registration, not that the file speaks the truth. ‘The mirror is clean’ and ‘the mirror reflects the real thing’ are different claims — the latter rests on off-chain appraisal, audits, and law (Stage 1.3, Stage 8).",
    "“After fractionalizing, selling the whole building is easy — just gather the fractions.” —— A thousand holders will almost never spontaneously reassemble. So the vault must pre-wire an exit mechanism (buyout bid + vote threshold + forced settlement), and the threshold cuts both ways: too high means deadlock, too low hurts small holders. It's one of the most critical clauses in the offering documents.",
  ],

  quiz: [
    {
      q: "What is the fundamental difference between ERC-721 and ERC-20 at the data-structure level?",
      options: ["ERC-721's table is bigger", "ERC-20 records “address→balance” (how many); ERC-721 records “ID→owner” (who owns this particular one), each token unique", "ERC-721 doesn't need a smart contract", "ERC-721 tokens can't be transferred"],
      answer: 1,
      explain: "One is a money ledger (quantities only), the other a title book (item-by-item). Hence ERC-721's key query is ownerOf(tokenId).",
    },
    {
      q: "If a “deed NFT's” tokenURI points to an ordinary URL (https://issuer.com/deed/7.json), what is the biggest risk?",
      options: ["The URL is long, so gas is expensive", "The server's owner can change the metadata at any time — the on-chain ownership record survives, but “what you actually own” has been rewritten", "Others can copy the URL", "The URL slows down transfers"],
      answer: 1,
      explain: "The pointer is on-chain; the content is in someone else's hands. The fix is content hashing / IPFS: change one character and the fingerprint no longer matches — verifiable by anyone.",
    },
    {
      q: "What does a successful content-hash verification of the metadata prove?",
      options: ["That the stated floor area is accurate", "That the file hasn't been tampered with since registration — whether its contents are TRUE still requires off-chain verification", "That the issuer is compliant", "That the NFT has legal force"],
      answer: 1,
      explain: "Hashes defend against alteration, not falsehood. A clean mirror is not the same as a truthful reflection — the latter needs appraisal, audits, and legal structure.",
    },
    {
      q: "Which asset below is best registered as an NFT (rather than ERC-20)?",
      options: ["Money-market fund shares", "Grams of gold", "Each specific invoice in a receivables batch (different debtors, amounts, maturities)", "A dollar stablecoin"],
      answer: 2,
      explain: "The test: is the unit homogeneous? Fund shares, gold grams, and dollars are identical per unit (ERC-20); each invoice carries its own risk and must be traced individually (NFT) — exactly Centrifuge's design.",
    },
    {
      q: "What is the standard structure for “fractionalizing” a building?",
      options: ["Cut the NFT into 1,000 mini-NFTs", "Mint the building directly as 1,000 ERC-20s, no NFT needed", "Mint a deed NFT registering “this building,” lock it in a vault contract, then have the vault issue 1,000 ERC-20 shares — a two-layer cap table", "Have 1,000 people share one private key"],
      answer: 2,
      explain: "The NFT layer answers “which item, held by which entity”; the ERC-20 layer answers “how the interest is divided” — the on-chain mirror of the SPV structure (Stage 5.2).",
    },
    {
      q: "What problem does a fractional vault's “buyout / exit clause” solve?",
      options: ["Lowering gas fees", "How the whole asset can still be sold when fractions are spread across many holders — bid deposited into the vault, forced settlement above a vote threshold, pro-rata payout; a mis-set threshold means deadlock or whales squeezing small holders", "Preventing NFT theft", "Stabilizing the fraction price"],
      answer: 1,
      explain: "One indivisible asset + a thousand holders = a built-in collective-action problem. The exit mechanism must be hard-wired in the offering docs — read that clause word by word in diligence.",
    },
  ],

  further: [
    { label: "EIP-721: the ERC-721 standard (official definition of ownerOf and tokenURI)", url: "https://eips.ethereum.org/EIPS/eip-721" },
    { label: "ethereum.org: ERC-721 standard primer", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-721/" },
    { label: "IPFS docs: content addressing (why a CID makes metadata tamper-evident)", url: "https://docs.ipfs.tech/concepts/content-addressing/" },
    { label: "Centrifuge docs: how real-world assets are minted as NFTs into pools", url: "https://docs.centrifuge.io/" },
  ],
};
