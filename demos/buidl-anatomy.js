// 交互演示：BUIDL 解剖台——点击组织架构里的每个角色看职责与出处，再分标签页走三条资金流。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const nodes = [
    { id: "blackrock", name: "BlackRock", role: T("基金管理人：决定投什么——现金、短期国债、隔夜回购，目标稳定 $1/份。", "Fund manager: picks the assets — cash, T-bills, overnight repo — targeting a stable $1/share."), stage: T("阶段 3.3 基金与 NAV", "Stage 3.3 Funds & NAV"), fail: T("没有它：没人对投资组合与 $1 目标负责，产品只是个空壳。", "Without it: nobody owns the portfolio or the $1 target — the product is an empty shell.") },
    { id: "securitize", name: "Securitize", role: T("SEC 注册过户代理 + 代币化平台 + 募集：它维护的法律股东名册就是链上代币账本，并负责 KYC 白名单。", "SEC-registered transfer agent + tokenization platform + placement: the legal shareholder register it keeps IS the on-chain ledger; it runs the KYC whitelist."), stage: T("阶段 5.3 登记与法域 · 阶段 7.3 转账限制", "Stage 5.3 Registrars · Stage 7.3 Transfer restrictions"), fail: T("没有它：链上余额只是数据库副本，法律名册在别处——两本账，天天对账。", "Without it: on-chain balances are just a database copy while the legal register lives elsewhere — two books, daily reconciliation.") },
    { id: "bny", name: "BNY Mellon", role: T("托管行 + 行政管理人：链下资产（国债/现金/回购）在它账上，NAV 由这条线计算。", "Custodian + administrator: the off-chain assets (T-bills/cash/repo) sit in its accounts; NAV is computed down this line."), stage: T("阶段 3.4 托管与清算 · 阶段 1.3 信任之桥", "Stage 3.4 Custody & settlement · Stage 1.3 The trust bridge"), fail: T("没有它：代币背后“资产真的在”无人背书——桥断了，代币只是空气收据。", "Without it: nobody vouches that the assets are really there — the bridge is out, and the token is a receipt for air.") },
    { id: "circle", name: T("Circle 赎回通道", "Circle facility"), role: T("智能合约通道：任何时刻把 BUIDL 按 1:1 换成 USDC，几分钟到账——永不打烊的套利回路。", "Smart-contract facility: swap BUIDL 1:1 into USDC at any moment, settled in minutes — an arbitrage loop that never closes."), stage: T("阶段 9.4 赎回与锚定 · 阶段 9.3 RWA×DeFi", "Stage 9.4 Redemption & the peg · Stage 9.3 RWA×DeFi"), fail: T("没有它：赎回要等窗口，锚变松，BUIDL 也当不了衍生品保证金。", "Without it: redemptions wait for windows, the peg loosens, and BUIDL can't serve as derivatives margin.") },
    { id: "chains", name: T("以太坊 + 多链", "Ethereum + multichain"), role: T("以太坊首发，经 Wormhole 桥到 Aptos/Arbitrum/Avalanche/Optimism/Polygon/Solana——客户在哪，产品去哪。", "Ethereum first, bridged via Wormhole to Aptos/Arbitrum/Avalanche/Optimism/Polygon/Solana — go where the clients are."), stage: T("阶段 2.6 链的选择 · 阶段 8.3 储备证明", "Stage 2.6 Choosing chains · Stage 8.3 Proof of reserve"), fail: T("没有对账：多链供应量一旦对不上总名册，就可能凭空多出“影子份额”。", "Without reconciliation: if multichain supply drifts from the master register, phantom shares can appear from thin air.") },
    { id: "investor", name: T("投资者（QP）", "Investors (QP)"), role: T("合格买家（约 $5M+ 可投资产），最低申购 $500 万，Reg D 506(c)，地址须在白名单内。", "Qualified Purchasers (roughly $5M+ investable assets), $5M minimum, Reg D 506(c), whitelisted addresses only."), stage: T("阶段 7.2 投资者资格", "Stage 7.2 Investor eligibility"), fail: T("门槛就是产品的一部分：QP 限定换来了募集合规最顺——也意味着这不是散户产品。", "The bar is part of the product: QP-only buys the smoothest compliance path — and means this is not a retail product.") },
  ];

  const flows = {
    sub: { label: T("申购", "Subscribe"), steps: [
      [T("QP 完成 Securitize KYC，地址进白名单", "QP passes Securitize KYC; address is whitelisted"), T("阶段 7.3 的准入检查", "Stage 7.3's gate check")],
      [T("电汇 ≥$5M 美元到基金账户（BNY）", "Wire ≥ $5M to the fund's account (BNY)"), T("法币仍走传统轨道", "Fiat still rides traditional rails")],
      [T("BNY 确认到账，基金买入国债/回购", "BNY confirms funds; the fund buys T-bills/repo"), T("资产留在链下托管", "Assets stay in off-chain custody")],
      [T("Securitize 铸造等额 BUIDL 到投资者地址", "Securitize mints matching BUIDL to the investor's address"), T("铸造 = 更新法律名册", "Minting = updating the legal register")],
    ]},
    div: { label: T("月度派息", "Monthly dividend"), steps: [
      [T("每天：按持仓计提当日股息（记账，不动代币）", "Daily: dividends accrue per holding (bookkeeping only)"), T("阶段 3.3 的 MMF 式计提", "Stage 3.3's MMF-style accrual")],
      [T("月底：行政管理人汇总每个地址的应付股息", "Month-end: the administrator totals each address's payout"), T("链下计算，链上执行", "Computed off-chain, executed on-chain")],
      [T("铸造新 BUIDL 代币空投到各地址", "New BUIDL tokens are minted and dropped to each address"), T("阶段 8.4 的 rebase 式分发", "Stage 8.4's rebase-style distribution")],
      [T("结果：余额变多，单价仍是 $1", "Result: balances grow; the price holds at $1"), T("收益 = 代币数量，不是价格", "Yield shows up as count, not price")],
    ]},
    red: { label: T("7×24 赎回", "24/7 redeem"), steps: [
      [T("周六凌晨 2 点，持有人把 BUIDL 发进 Circle 通道合约", "2 a.m. Saturday: holder sends BUIDL into Circle's facility contract"), T("没有窗口，没有客服", "No window, no help desk")],
      [T("合约按 1:1 立即打出 USDC", "The contract pays out USDC 1:1 instantly"), T("约几分钟，链上完成", "Minutes, fully on-chain")],
      [T("对比：传统 MMF 周六想赎回 → 周一下单 → T+1 电汇", "Compare: a traditional MMF on Saturday → order Monday → T+1 wire"), T("≈ 3–4 天 vs ≈ 几分钟", "≈ 3–4 days vs ≈ minutes")],
      [T("这条永开的套利回路把价格钉死在 $1", "This always-open arb loop pins the price at $1"), T("阶段 9.4：最紧的锚", "Stage 9.4: the tightest peg")],
    ]},
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏛️ BUIDL 解剖台：角色 × 资金流", "🏛️ BUIDL anatomy: roles × flows")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("① 点一个角色，看它的职责、课程出处、缺了会怎样：", "① Click a role to see its job, its course lesson, and what breaks without it:")}</div>
        <div class="demo-btns" id="ba-nodes">${nodes.map((n) => `<button class="demo-btn" data-node="${n.id}">${n.name}</button>`).join("")}</div>
        <div id="ba-card" style="margin-top:8px"></div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("② 三条资金流：", "② Three flows:")}</div>
        <div class="demo-switch" id="ba-tabs">${Object.keys(flows).map((k) => `<button class="demo-btn" data-flow="${k}">${flows[k].label}</button>`).join("")}</div>
        <div class="journey" id="ba-flow"></div>
      </div>
      <p class="demo-tip">${T("<strong>数一数节点</strong>——代币化没有减少中介，它减少的是中介之间的“对账与等待”。", "<strong>Count the nodes</strong> — tokenization didn't reduce the intermediaries; it reduced the reconciliation and waiting between them.")}</p>
    </div>`;

  const card = root.querySelector("#ba-card");
  const flowEl = root.querySelector("#ba-flow");

  function showNode(id) {
    const n = nodes.find((x) => x.id === id);
    root.querySelectorAll("[data-node]").forEach((b) => b.classList.toggle("active", b.dataset.node === id));
    card.innerHTML = `
      <div style="border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--surface-2)">
        <div style="font-weight:700;color:var(--orange-ink)">${n.name}</div>
        <div style="margin-top:4px;color:var(--ink);font-size:.92em">${n.role}</div>
        <div style="margin-top:4px;color:var(--muted);font-size:.85em">📚 ${n.stage}</div>
        <div style="margin-top:4px;color:var(--red);font-size:.85em">⚠ ${n.fail}</div>
      </div>`;
  }

  function showFlow(k) {
    root.querySelectorAll("[data-flow]").forEach((b) => b.classList.toggle("active", b.dataset.flow === k));
    flowEl.innerHTML = flows[k].steps.map((s, i) => `
      <div class="jstep done">
        <div class="jn">${i + 1}</div>
        <div><div class="jt">${s[0]}</div><div class="jd">${s[1]}</div></div>
      </div>`).join("") + (k === "red" ? `<div class="done-banner" style="margin-top:8px">${T("⏱ 传统 MMF ≈ 3–4 天 → BUIDL ≈ 几分钟", "⏱ Traditional MMF ≈ 3–4 days → BUIDL ≈ minutes")}</div>` : "");
  }

  root.querySelectorAll("[data-node]").forEach((b) => b.addEventListener("click", () => showNode(b.dataset.node)));
  root.querySelectorAll("[data-flow]").forEach((b) => b.addEventListener("click", () => showFlow(b.dataset.flow)));
  showNode("securitize");
  showFlow("sub");
}
