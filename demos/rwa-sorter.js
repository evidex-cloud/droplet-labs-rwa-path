// 交互演示：资产分类器——把 9 张资产卡分进「原生加密资产 / RWA / 想一想」，每答一张即时讲解，最后计分。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // cat: 0 = 原生加密, 1 = RWA, 2 = 想一想（tricky）
  const cards = [
    { icon: "₿", name: T("比特币 BTC", "Bitcoin (BTC)"), cat: 0,
      why: T("价值完全由链上规则与共识决定，背后没有发行方、托管方或链下资产——教科书级的原生加密资产。", "Its value comes entirely from on-chain rules and consensus — no issuer, custodian, or off-chain asset behind it. Textbook crypto-native.") },
    { icon: "💵", name: T("USDC 稳定币", "USDC stablecoin"), cat: 1,
      why: T("很多人答错：稳定币恰恰是 RWA！链下有美元与短期国债储备，Circle 承诺 1:1 赎回——三件套齐全。", "A common miss: a stablecoin IS an RWA! Off-chain dollar and T-bill reserves, with Circle promising 1:1 redemption — all three pieces present.") },
    { icon: "🏛️", name: T("代币化国债基金（如 BUIDL）", "Tokenized T-bill fund (e.g. BUIDL)"), cat: 1,
      why: T("链下是一篮子真实美债 + 基金架构，链上代币只是基金份额的收据。2024–25 机构浪潮的主角。", "Off-chain: a basket of real Treasuries plus a fund structure; the token is a receipt for fund shares. The star of the 2024–25 institutional wave.") },
    { icon: "◆", name: T("以太币 ETH", "Ether (ETH)"), cat: 0,
      why: T("以太坊网络自己的燃料与质押资产，价值内生于链上——没有链下那头。", "Ethereum's own fuel and staking asset; its value is native to the chain — there is no off-chain end.") },
    { icon: "🥇", name: T("PAXG 黄金代币", "PAXG gold token"), cat: 1,
      why: T("1 枚 = 伦敦金库里 1 金衡盎司实物金条（可赎回），Paxos 受 NYDFS 监管——链下有真金子。", "One token = one fine troy ounce of a physical bar in a London vault (redeemable), issued by NYDFS-regulated Paxos — real gold off-chain.") },
    { icon: "🐕", name: T("某只 Meme 币", "A memecoin"), cat: 0,
      why: T("虽然一文不值的可能性很大，但它没有链下资产支撑，价值（如果有）全靠共识——所以是原生加密资产，不是 RWA。", "It may well be worthless, but it has no off-chain asset behind it — its value (if any) is pure consensus. Crypto-native, not an RWA.") },
    { icon: "🏠", name: T("代币化的底特律出租屋（RealT）", "Tokenized Detroit rental (RealT)"), cat: 1,
      why: T("链下是一栋真房子 + 房产登记 + 租客。代币转账秒到，但漏水和物业税一样不少——最难搞的 RWA 品类。", "Off-chain: a real house, a land registry, tenants. Token transfers settle in seconds, but leaks and property tax remain — the hardest RWA category.") },
    { icon: "🌯", name: T("WBTC（包装比特币）", "Wrapped BTC (WBTC)"), cat: 2,
      why: T("最妙的边界案例：底层资产 BTC 是原生加密资产，但 WBTC 依赖托管方替你保管真 BTC——信任结构和 RWA 一模一样（托管方跑路，代币归零）。", "The best edge case: the underlying BTC is crypto-native, but WBTC relies on a custodian holding real BTC for you — its trust structure is exactly an RWA's (custodian fails, token dies).") },
    { icon: "⚔️", name: T("游戏里的一把传奇武器", "A legendary in-game sword"), cat: 2,
      why: T("看情况：若它是链上 NFT、规则全在合约里，就偏原生；但它能否使用取决于游戏公司的服务器——价值仍系于一个“链下发行方”，像极了 RWA 的信任问题。", "It depends: as an on-chain NFT with rules in the contract it leans native — but whether it works depends on the game company's servers, so its value still hangs on an “off-chain issuer,” exactly the RWA trust problem.") },
  ];

  const catNames = [T("原生加密资产", "Crypto-native"), T("RWA", "RWA"), T("想一想", "It's tricky")];
  let idx = 0, score = 0, answered = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🗂️ 资产分类器：这是 RWA 吗？", "🗂️ Asset sorter: is this an RWA?")}</div>
      <div class="demo-block" id="rs-card"></div>
      <div class="demo-btns" id="rs-btns">
        <button class="demo-btn" data-cat="0">${T("🔗 原生加密资产", "🔗 Crypto-native")}</button>
        <button class="demo-btn" data-cat="1">${T("🌍 RWA", "🌍 RWA")}</button>
        <button class="demo-btn" data-cat="2">${T("🤔 想一想（边界案例）", "🤔 It's tricky (edge case)")}</button>
      </div>
      <div id="rs-reveal"></div>
      <div class="demo-btns"><button class="demo-btn" id="rs-next" style="display:none"></button></div>
      <div id="rs-done"></div>
      <p class="demo-tip">${T("判断口诀只有一句：<strong>这枚代币值钱，是因为链下存在什么东西吗？</strong>是 → RWA；否 → 原生加密。注意两张“想一想”卡——它们的信任结构比标签更重要。", "One test only: <strong>is this token valuable because something exists off-chain?</strong> Yes → RWA; no → crypto-native. Watch the two “tricky” cards — their trust structure matters more than their label.")}</p>
    </div>`;

  const cardEl = root.querySelector("#rs-card");
  const revealEl = root.querySelector("#rs-reveal");
  const nextBtn = root.querySelector("#rs-next");
  const doneEl = root.querySelector("#rs-done");
  const btns = Array.from(root.querySelectorAll("[data-cat]"));

  function paint() {
    const c = cards[idx];
    cardEl.innerHTML = `
      <div class="demo-label">${T("第", "Card")} ${idx + 1} / ${cards.length}${T(" 张 · 它属于哪一类？", " · which bucket?")}</div>
      <div style="font-size:1.25rem;font-weight:700;color:var(--ink)">${c.icon} ${c.name}</div>`;
    revealEl.innerHTML = "";
    nextBtn.style.display = "none";
    answered = false;
    btns.forEach((b) => { b.disabled = false; b.classList.remove("active"); });
  }

  btns.forEach((b) => b.addEventListener("click", () => {
    if (answered) return;
    answered = true;
    const pick = +b.dataset.cat, c = cards[idx], right = pick === c.cat;
    if (right) score++;
    b.classList.add("active");
    btns.forEach((x) => (x.disabled = true));
    revealEl.innerHTML = `
      <div class="demo-block" style="border-left:3px solid ${right ? "var(--green)" : "var(--red)"}">
        <div style="font-weight:700;color:${right ? "var(--green)" : "var(--red)"}">${right ? T("✓ 答对了", "✓ Correct") : T("✗ 不对——正确答案：", "✗ Not quite — answer: ") + catNames[c.cat]}</div>
        <div style="color:var(--muted);margin-top:4px">${c.why}</div>
      </div>`;
    nextBtn.style.display = "";
    nextBtn.textContent = idx < cards.length - 1 ? T("▶ 下一张", "▶ Next card") : T("🏁 看结果", "🏁 See result");
  }));

  nextBtn.addEventListener("click", () => {
    if (idx < cards.length - 1) { idx++; paint(); return; }
    cardEl.innerHTML = ""; revealEl.innerHTML = ""; nextBtn.style.display = "none";
    root.querySelector("#rs-btns").style.display = "none";
    doneEl.innerHTML = `
      <div class="done-banner">${T(`✅ 完成！${score} / ${cards.length} 张分类正确。`, `✅ Done! ${score} / ${cards.length} sorted correctly.`)}</div>
      <div class="demo-block" style="margin-top:8px;color:var(--muted)">${T(
        "记住最反直觉的两点：<strong>稳定币是 RWA</strong>（链下有储备），<strong>WBTC 虽然包着 BTC，信任结构却像 RWA</strong>（要信托管方）。标签不重要，链下那头有没有、绑没绑牢才重要。",
        "Remember the two counterintuitive ones: <strong>a stablecoin IS an RWA</strong> (reserves off-chain), and <strong>WBTC wraps BTC yet trusts like an RWA</strong> (you must trust the custodian). The label matters less than whether an off-chain end exists — and how tightly it's tied down."
      )}</div>`;
  });

  paint();
}
