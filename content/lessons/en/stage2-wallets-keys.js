export default {
  id: "wallets-keys",
  stage: 2,
  order: 2,
  title: "Wallets, Keys & Addresses: On-chain Identity & Signatures",
  difficulty: "core",
  prereqs: ["what-is-blockchain"],

  oneLiner:
    "On-chain there are no usernames and no passwords — only a **private key**: a random number so large it will never collide with anyone else's in the lifetime of the universe. The private key derives a public key; the public key's hash is your **address**; to transfer, you “sign” with the private key, and anyone on the network can verify with the public key that “this instruction really came from the key's owner, and not one character has been altered.” A wallet holds keys, not coins — the balance lives on-chain. And the most counterintuitive fact in RWA-land: **regulated asset tokens deliberately avoid the “lose the key, lose everything” model of raw self-custody.**",

  intuition: `
The last lesson (Stage 2.1) left a hole. The ledger says \`address 0xAb…3F holds 100 TBF\`, and thousands of nodes will keep that record honestly. But — **how does the ledger know that an instruction to “spend those 100” actually came from the owner?**

There's no teller window on-chain, no customer service, no “photo ID, please.” Anyone can broadcast a message to the network: “transfer 0xAb…3F's 100 tokens to me.” If nodes can't tell genuine instructions from fake ones, the whole ledger is instantly worthless. A traditional bank leans on “account + password + face scan + SMS code,” with a company behind it checking who you are. A blockchain has no such company — it uses something older and harder: **mathematics**.

The answer is **asymmetric cryptography**: a pair of keys — a **private key** only you know, and a **public key** the whole world can see. The private key can produce something called a **digital signature**, and anyone holding the public key can verify two things at once: **this instruction was personally authorized by the private key's owner, and not a single bit of it has changed since it was signed**. No one needs to know you; no institution needs to vouch for you — verification is pure math, done in milliseconds.

This lesson takes that machinery apart, then answers three questions unique to the RWA world: why doesn't BlackRock use MetaMask? Why is “lost key = lost asset” actually **false** for compliant RWA tokens? And why is your on-chain address **not remotely anonymous** in RWA-land?

**Here's the map — five parts:**

- **① The private key — a random number too large to ever collide**
- **② From private key to address — a one-way street**
- **③ Signing and verifying — how the ledger confirms “it's you, and it's unaltered”**
- **④ Wallets and seed phrases — a keyring, not a purse**
- **⑤ The custody spectrum, and RWA's three counterintuitive truths**
`,

  mechanics: `
### ① The private key: a random number too large to ever collide

Strip away the mystique: **a private key is just a random number**. An Ethereum private key is a **256-bit** number — pick anything between 1 and roughly 2 to the 256th power. How big is that? About **10 to the 77th**, in the same league as the count of atoms in the observable universe (about 10 to the 80th). The odds that your randomly generated key collides with anyone else's are far smaller than winning the lottery jackpot a hundred times in a row — **the randomness itself is the security**.

So creating an on-chain identity needs no registration, no approval, no internet connection: an air-gapped computer flips 256 “cryptographic coins,” and an identity is born. **This is the first clean break from traditional finance**: a bank account is something a bank *opens for you*; an on-chain identity is something you *compute for yourself*, and nobody on earth can stop you from having an address. That's inclusion — and it's also the situation the compliance machinery (Stage 7) has to work so hard to tame.

### ② From private key to address: a one-way street

From your private key to the “house number” you show the world runs a **three-stage one-way street**, each step irreversible:

- **Private key → public key**: computed via **elliptic-curve multiplication** (Ethereum uses the secp256k1 curve). The forward computation takes under a millisecond; the reverse — deriving the private key from the public key — is the famous **discrete logarithm problem**: burn all of humanity's computing power until the sun goes out and you still won't solve it.
- **Public key → address**: hash the public key (our old friend from Stage 2.1) and keep part of the result — a 20-byte **address**, the 42-character \`0x…\` string you've seen.
- **Address → public**: paste your address anywhere you like. Nobody can work back from it to your public key, let alone your private key.

<figure><svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="wk-arr-en" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="var(--orange-line)"/></marker></defs><rect x="16" y="35" width="160" height="62" rx="10" fill="var(--red-soft)" stroke="var(--line)"/><text x="96" y="60" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">Private key (secret!)</text><text x="96" y="80" font-size="10" fill="var(--muted)" text-anchor="middle">256-bit random number</text><rect x="240" y="35" width="160" height="62" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="320" y="60" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">Public key</text><text x="320" y="80" font-size="10" fill="var(--muted)" text-anchor="middle">elliptic-curve multiply</text><rect x="464" y="35" width="160" height="62" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="544" y="60" font-size="12" fill="var(--ink)" font-weight="bold" text-anchor="middle">Address (public)</text><text x="544" y="80" font-size="10" fill="var(--muted)" text-anchor="middle">hash of public key, 0x…</text><path d="M176 66 L236 66" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#wk-arr-en)"/><path d="M400 66 L460 66" stroke="var(--orange-line)" stroke-width="2" marker-end="url(#wk-arr-en)"/><text x="320" y="130" font-size="11" fill="var(--orange-ink)" text-anchor="middle">→ Every step is one-way: a millisecond forward, humanly impossible backward →</text></svg></figure>

One line of intuition: **the address is the public key's nickname, and the public key is the private key's shadow — you can plaster the shadow all over town, but the original must never see daylight.**

### ③ Signing and verifying: how the ledger confirms “it's you, and it's unaltered”

Now the core move. You want to make a transfer; here's what actually happens:

- **Step one (you, locally)**: compose the instruction — \`transfer 100 TBF from 0xAb…3F to 0xCd…9E\` — hash the whole instruction, then run a signing computation over that hash with your **private key** (Ethereum uses the **ECDSA** algorithm), producing a **signature** a few dozen bytes long. Note: **the private key never leaves your device** — all that goes out is “instruction + signature.”
- **Step two (every node on the network)**: run a **verification computation** over the instruction, the signature, and your public key. The math guarantees: verification passes only if the signature was truly produced by the matching private key **and** the instruction is character-for-character what was signed.
- **Step three**: verification passes → the node checks balances → the transaction goes into a block (Stage 2.1). Verification fails → discarded outright, no fee even collected.

A signature kills two birds with one stone, locking down both at once:

- **Authentication**: only the private key's holder can produce a valid signature. The signature *is* the authorization.
- **Integrity**: a middleman changes \`100\` to \`1000\`? The instruction's hash avalanches, and the original signature instantly fails against the new hash. **Change one character and the signature dies** — you'll watch this happen with your own hands in the demo below.

One more stab, against replay: every transaction carries a **nonce** (sequence number), so the same signature can't be reused to drain you twice.

**This closes the blockchain's trust loop**: a ledger nobody can unilaterally edit (Stage 2.1) + instructions that don't count without a signature (this lesson) = a property system that needs no institution on duty.

### ④ Wallets and seed phrases: a keyring, not a purse

Time to correct a nearly universal misunderstanding: **there are no coins in your wallet**. Your balance is a row in the ledger, stored across thousands of nodes (Stage 2.1); the wallet (MetaMask, Ledger, a phone app) safeguards your **private key** and performs the “compose instruction → sign → broadcast” routine for you. Delete the wallet app and you lose nothing — as long as the private key survives, import it into another wallet and your assets are right where you left them.

The **seed phrase** is the private key's human-readable backup: 12 or 24 English words (drawn from a fixed 2048-word list under the BIP-39 standard), from which **all** your private keys can be mathematically derived. So the seed phrase is the master key: whoever copies those words has taken everything you own. Which explains the old saying — **“Not your keys, not your coins”**: park assets on an exchange and the exchange holds the keys; what you hold is merely its promise. When FTX collapsed in 2022 and users' “account balances” zeroed out overnight, that saying taught its most expensive lesson yet.

### ⑤ The custody spectrum, and RWA's three counterintuitive truths

Who guards the keys is a **spectrum**, with a price at each end:

- **Self-custody**: the private key is entirely in your hands. Trust no one — but **you are the single point of failure**: forget the seed phrase, drown the hard drive, click one phishing link, and there's no hotline to call. Bitcoin permanently frozen by lost keys is estimated in the millions of coins.
- **Custodial**: an institution like Coinbase holds the keys for you. It feels like a bank, passwords are recoverable — but **you've come full circle back to trusting an institution**, and institutions fail, get hacked, and get frozen.
- **The middle ground**: **multisig** — one address governed by several keys, e.g. “any 2 of 3 keys to move funds”; **MPC (multi-party computation)** — one key mathematically split into shards held on different devices and by different institutions, which cooperate to compute a signature while **the complete private key never exists anywhere**. Institutional custody (Fireblocks, Anchorage and similar technology) lives almost entirely in this zone.

Everything up to here is generic knowledge. The next three points are **counterintuitive truths unique to RWA** — and they're what this lesson really wants to teach you:

- **Truth one: regulated RWA almost never uses raw self-custody.** BlackRock BUIDL shares will not be sitting in someone's MetaMask fox — institutions use a **qualified custodian** (BUIDL sits in the BNY Mellon orbit, with MPC/multisig technology), and the tokens can only move between **whitelisted addresses**: each address pre-bound to a KYC-verified **identity**. Send to an address outside the list? The contract rejects the transaction outright — how those checks land on-chain is Stage 7.3's subject.
- **Truth two: “lost key = lost asset” is false for compliant RWA tokens.** Your shares are a **legal claim** (Stage 5.1), and a legal claim doesn't die with a USB stick. Permissioned standards like ERC-3643 reserve \`forcedTransfer\` and address-recovery powers for the issuer: re-verify your identity, and the issuer force-migrates the tokens from the old address to your new one. Sounds like heresy against “decentralization”? It is — and it's exactly where **legal reality outranks cryptographic romance**. Stage 6.5 is devoted to these “issuer switches.”
- **Truth three: in RWA-land, an address is not anonymous at all.** On a public chain an address is indeed just a string (so-called “pseudonymity”), but RWA's entire compliance machine — KYC, whitelists, on-chain identity claims (ONCHAINID, Stage 6.3) — exists **precisely to weld every address to a real identity**. When a regulator reads an RWA ledger, they're not looking at anonymous hexadecimal; they're looking at a shareholder register with real names on it.

If you take away one sentence: **a signature mathematically proves “the instruction is unaltered and truly came from the key's owner” — but it can never prove “who the key's owner is, or whether they're eligible to hold this asset,” and supplying that second half is exactly what RWA's entire compliance layer is for.**
`,

  demo: "key-sign",

  analogy: `
Think of the private key as a **one-of-a-kind personal seal**, and the public key as the matching **seal-verifier** issued with it. You hand out verifiers to the whole world for free (the public key is public) and lock the seal in a safe (the private key stays secret). You stamp a document (sign it), and anyone with a verifier takes one look: the imprint's grain matches → stamped by the owner, no doubt; another look reveals one altered character in the document → the grain instantly fails to match (change a word, void the stamp). The beauty: **inspect the verifier ten thousand times and you still can't forge the seal itself.**

A **wallet** isn't a purse — it's the **box that holds the seal**. Your property was never in the box; it's recorded in the city's public title register (the ledger from Stage 2.1). Lose the box and no matter — as long as the seal survives, so does your property. Lose the **seal**, and though the register still bears your name, you can never stamp again to move what's yours.

The **seed phrase** is the engraver's **recipe card**: 12 words from which an identical seal can be cut again. So the recipe is more precious than the seal — photograph it into a cloud drive, and you've published your seal to the world.

In **RWA-land**, the game changes: the seal matters too much for an institution to let one employee carry it in a pocket, so it goes to a **licensed seal depository** (a qualified custodian), or is **sawn into three pieces stored in three places** (MPC/multisig). More important, the title register becomes a **real-name edition**: every seal is registered with its owner's ID at issuance (the KYC whitelist); and if a seal truly is lost, the registry verifies your identity and **voids the old seal and cuts you a new one** (\`forcedTransfer\`) — because in the world of law, your house is not forfeit just because a seal fell in the river.
`,

  misconceptions: [
    "“My coins are stored in my wallet.” —— The wallet holds only your private key. Balances are records in the on-chain ledger, replicated across thousands of nodes. Deleting the wallet app costs you nothing; leaking the private key costs you everything — back up the key (seed phrase), not the app.",
    "“Private keys are complicated — someone might guess mine or collide with it.” —— Backwards: a private key's security comes precisely from being unguessable. A 256-bit random number spans about 10^77 values, on the order of the atoms in the universe; collision probability is zero for engineering purposes. Real thefts are almost all phishing, malware, and badly stored seed phrases — human holes, not mathematical ones.",
    "“Signing will expose my private key.” —— No. A signature is a piece of “evidence” computed with the private key; verifying it needs only the public key. Sign ten thousand times and nobody can work back to the key — that is asymmetric cryptography's entire design goal.",
    "“Lose the private key and the asset is gone forever — RWA included.” —— Broadly true for native crypto (BTC/ETH); false for compliant RWA tokens. Shares are a legal claim, and the issuer, after re-verifying your identity, can migrate tokens to a new address via forcedTransfer / recovery mechanisms (Stage 6.5). A legal claim doesn't die in a USB stick.",
    "“Blockchains are anonymous, so RWA investors are anonymous too.” —— A public-chain address is only a pseudonym, with every transaction permanently public; and RWA's compliance layer (KYC, whitelists, on-chain identity — Stage 6.3, Stage 7) exists precisely to bind addresses to real names. To a regulator, an RWA ledger reads as a real-name shareholder register — nothing anonymous about it.",
    "“Institutions entering RWA also self-custody with browser-extension wallets like MetaMask.” —— No. Regulated institutions use qualified custodians + MPC/multisig, with tokens moving only among whitelisted addresses backed by verified identities. Raw self-custody's single-point risk and the compliance requirements both rule it out as an institutional solution (Stage 7.3).",
  ],

  quiz: [
    {
      q: "How does the on-chain ledger confirm that a transfer “was really authorized by the asset's owner”?",
      options: [
        "Nodes phone the owner to check",
        "It checks the account password",
        "It verifies the digital signature attached to the transaction: only the matching private key can produce it, and altering one character of the instruction voids it",
        "It inspects the sender's IP address",
      ],
      answer: 2,
      explain: "A signature locks down both “sent by the key's owner” (authentication) and “unaltered” (integrity); verification needs only the public key — pure math, no institution.",
    },
    {
      q: "What is the relationship among private key, public key, and address?",
      options: [
        "Three equivalent IDs derivable from one another",
        "A one-way street: the private key computes the public key, whose hash gives the address; the reverse direction is computationally infeasible",
        "The address is an encrypted archive of the private key and can be unpacked",
        "The public key is secret; the private key and address are public",
      ],
      answer: 1,
      explain: "Elliptic-curve multiplication and hashing are both one-way: a millisecond forward, humanly impossible backward. Keep the private key secret; the address is public.",
    },
    {
      q: "What does a “wallet” actually safeguard?",
      options: ["Your token balances", "Your private key (plus the signing routine) — balances always live in the on-chain ledger", "A full copy of the ledger", "Your KYC documents"],
      answer: 1,
      explain: "The coins aren't in the wallet; they're in the ledger. A lost wallet is recoverable from the seed phrase; a leaked key or phrase is the real breach.",
    },
    {
      q: "Why is “lost key = lost asset” false for compliant RWA tokens?",
      options: [
        "Because RWA tokens' private keys are harder to lose",
        "Because your shares are a legal claim, and after re-verifying your identity the issuer can migrate tokens to a new address via recovery powers like forcedTransfer — a legal claim doesn't die with a USB stick",
        "Because the blockchain automatically backs up private keys",
        "Because the custodian keeps a copy of your private key",
      ],
      answer: 1,
      explain: "Permissioned standards (like ERC-3643) reserve recovery powers for the issuer — a requirement of legal reality, detailed in Stage 6.5.",
    },
    {
      q: "How do regulated institutions (say, BUIDL holders) typically manage RWA tokens?",
      options: [
        "Each fund manager keeps them in a personal browser-extension wallet",
        "A qualified custodian + MPC/multisig to distribute signing power, with tokens moving only between whitelisted addresses bound to verified identities",
        "Print the private key and lock it in a bank vault",
        "Fully anonymous addresses to dodge regulatory tracking",
      ],
      answer: 1,
      explain: "The institutional recipe = eliminate single points of failure (MPC/multisig) + satisfy compliance (real-name whitelisted addresses) — a different world from retail self-custody (Stage 7.3).",
    },
  ],

  further: [
    { label: "ethereum.org: official docs on accounts, keys & addresses", url: "https://ethereum.org/en/developers/docs/accounts/" },
    { label: "The BIP-39 standard (where seed phrases come from)", url: "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki" },
    { label: "Fireblocks: What is MPC (institutional key management)", url: "https://www.fireblocks.com/what-is-mpc/" },
    { label: "ERC-3643 official site (the permissioned token standard with recovery, a Stage 6 preview)", url: "https://www.erc3643.org/" },
  ],
};
