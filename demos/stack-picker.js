// 交互演示：选型引擎——回答 6 个问题（买家/法域/资产/DeFi 野心/二级需求/预算），
// 引擎输出完整技术栈（链/标准/托管/预言机/KYC/场地）+ 每项一句理由，并标出资格几何冲突；
// 三个预设按钮加载样板设计 A/B/C；“对比 BUIDL”把你的设计 A 与真实答案逐行 diff。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const Q = [
    { k: "buyer", label: T("目标买家", "Target buyers"), opts: [
      { v: "inst", t: T("机构（财资/基金）", "Institutions (treasury/funds)") },
      { v: "retail", t: T("全球零售", "Global retail") },
      { v: "proto", t: T("DeFi 协议与链上资金", "DeFi protocols & on-chain capital") },
    ] },
    { k: "juris", label: T("法域策略", "Jurisdiction strategy"), opts: [
      { v: "regd", t: T("美国 Reg D（合格投资者/购买者）", "US Reg D (accredited/QP)") },
      { v: "regs", t: T("Reg S（排除美国人）", "Reg S (non-US only)") },
      { v: "eu", t: T("欧盟（招股书豁免/MiCA）", "EU (prospectus exemption/MiCA)") },
    ] },
    { k: "asset", label: T("资产类型", "Asset type"), opts: [
      { v: "tsy", t: T("国债/货币基金", "Treasuries / money-market") },
      { v: "re", t: T("地产租金收益", "Real-estate rental income") },
      { v: "credit", t: T("私募信贷", "Private credit") },
    ] },
    { k: "defi", label: T("DeFi 野心", "DeFi ambition"), opts: [
      { v: "none", t: T("不需要", "None") },
      { v: "some", t: T("以后可能", "Maybe later") },
      { v: "core", t: T("可组合性就是产品", "Composability IS the product") },
    ] },
    { k: "sec", label: T("二级需求", "Secondary need"), opts: [
      { v: "no", t: T("一级为主", "Primary only") },
      { v: "p2p", t: T("持有人之间点对点", "P2P among holders") },
      { v: "venue", t: T("持牌场所挂牌", "Listed on a licensed venue") },
    ] },
    { k: "budget", label: T("预算档", "Budget band"), opts: [
      { v: "low", t: T("< $250k", "< $250k") },
      { v: "mid", t: T("$250k–600k", "$250k–600k") },
      { v: "high", t: T("> $600k", "> $600k") },
    ] },
  ];

  const PRESETS = {
    A: { buyer: "inst", juris: "regd", asset: "tsy", defi: "none", sec: "no", budget: "high" },
    B: { buyer: "retail", juris: "regs", asset: "re", defi: "some", sec: "p2p", budget: "mid" },
    C: { buyer: "proto", juris: "regs", asset: "tsy", defi: "core", sec: "p2p", budget: "mid" },
  };

  const BUIDL = {
    chain: "Ethereum L1", std: "ERC-20 + TA allowlist", cust: T("纽约梅隆（合格托管人）", "BNY Mellon (qualified custodian)"),
    oracle: T("行政方日算 NAV，管理员喂价", "Fund-admin daily NAV, admin feed"), kyc: T("Securitize（TA+经纪商+KYC）", "Securitize (TA + broker-dealer + KYC)"),
    venue: T("仅一级 + 即时 USDC 通道", "Primary only + instant USDC facility"),
  };

  let a = { buyer: "inst", juris: "regd", asset: "tsy", defi: "none", sec: "no", budget: "high" };

  function decide() {
    const r = {};
    // 链
    if (a.defi === "core" || a.buyer === "proto") r.chain = { v: T("公链 L1/L2", "Public L1/L2"), why: T("可组合性要求公链——DeFi 不会迁到你的许可链上。", "Composability demands a public chain — DeFi won't migrate to your permissioned chain.") };
    else if (a.buyer === "retail") r.chain = { v: "L2", why: T("小额高频分发（周付/月付租金）在主网上会被 gas 吃掉。", "Small, frequent distributions (weekly/monthly rent) get eaten by mainnet gas.") };
    else r.chain = { v: T("以太坊主网（蓝筹 L1）", "Ethereum mainnet (blue-chip L1)"), why: T("机构托管方的支持清单先划定可选集合，性能参数其次。", "The institutional custodian's supported-chain list defines the option set; performance comes second.") };
    // 标准
    if (a.defi === "core") r.std = { v: T("ERC-4626 + 转账门禁包装", "ERC-4626 + transfer-gated wrapper"), why: T("协议已经会读 deposit/convertToShares；门禁层保住合规。", "Protocols already read deposit/convertToShares; the gate layer preserves compliance.") };
    else if (a.sec === "p2p") r.std = { v: "ERC-3643 (T-REX)", why: T("已验证持有人之间要点对点转账，且声明可跨发行方复用。", "Verified holders need P2P transfers, and claims are reusable across issuers.") };
    else r.std = { v: T("ERC-20 + 外部白名单", "ERC-20 + external allowlist"), why: T("转让反正要过持牌过户代理/单一场所——链上声明体系用不上（BUIDL 式）。", "Transfers clear a licensed TA or single venue anyway — the on-chain claim system goes unused (BUIDL-style).") };
    // 托管
    if (a.asset === "tsy") r.cust = { v: T("合格托管人 + 独立基金行政方", "Qualified custodian + independent fund administrator"), why: T("证券类由资产类别决定；现金部分务必分散在多家银行（SVB 教训）。", "Securities custody is determined by asset class; keep the cash leg across multiple banks (the SVB lesson).") };
    else if (a.asset === "re") r.cust = { v: T("有名有姓的物业管理方 + 指定银行账户 + 运营 SLA", "Named property manager + named bank account + operational SLAs"), why: T("地产的“托管”其实是运营：修缮响应、空置率、物业税凭证要写进文件。", "Real-estate “custody” is really operations: repair response, vacancy, tax receipts must be in the docs.") };
    else r.cust = { v: T("服务商 + 抵押品管理（无实物可托管）", "Servicer + collateral management (nothing physical to custody)"), why: T("信贷没有实物，这一层退化为服务商能力与抵押品监控。", "Credit has no physical asset; this layer degenerates into servicer capability and collateral monitoring.") };
    // 预言机
    if (a.defi === "core" || a.buyer === "proto") r.oracle = { v: T("预言机网络喂 NAV + PoR", "Oracle-network NAV + PoR"), why: T("消费者是第三方协议，它们不该只信你的单签地址。", "Consumers are third-party protocols — they shouldn't have to trust your single signer.") };
    else if (a.asset === "re") r.oracle = { v: T("月度诚实 NAV（季度评估 + 月度租金调整）", "Monthly-honest NAV (quarterly appraisal + monthly rent adjustment)"), why: T("节奏必须与资产真实可计算频率一致——不要把季度估值包装成实时价格。", "Cadence must match how often the asset is genuinely computable — don't dress a quarterly appraisal as a live price.") };
    else r.oracle = { v: T("管理员 NAV 喂价（如实披露）+ 链上镜像", "Admin NAV feed (disclosed) + on-chain mirror"), why: T("消费者主要是自家门户，如实披露的单签喂价够用且便宜。", "Consumers are mainly your own portal; a disclosed single-signer feed is sufficient and cheaper.") };
    // KYC
    if (a.juris === "regs" && a.buyer === "retail") r.kyc = { v: T("新兴市场覆盖优先的 KYC 供应商 + 声明签发集成", "Emerging-market-coverage KYC vendor + claim-issuance integration"), why: T("覆盖深度是这个产品的成败关键；再看撤销 SLA。", "Coverage depth makes or breaks this product; then check the revocation SLA.") };
    else if (a.juris === "regd") r.kyc = { v: T("全栈 TA/经纪商级供应商（含合格投资者验资）", "Full-stack TA/broker-dealer-class vendor (with accreditation verification)"), why: T("506(c) 要求逐个买家验资，牌照方顺手一起买了更省事。", "506(c) requires verifying every buyer; buying it together with the licensed party is simpler.") };
    else r.kyc = { v: T("欧盟覆盖 + MiCA 适配供应商", "EU-coverage vendor aligned to MiCA"), why: T("欧盟的报告与分类要求要由供应商侧支撑。", "EU reporting and classification requirements must be supported vendor-side.") };
    // 场地
    if (a.sec === "venue") r.venue = { v: T("一级门户 + ATS/持牌场所", "Primary portal + ATS/licensed venue"), why: T("只在持有人基础支撑得起时才做——否则得到的是 0 成交的橱窗。", "Only when the holder base supports it — otherwise you get a shop window with zero volume.") };
    else if (a.defi === "core") r.venue = { v: T("一级申赎 + DeFi 适配器（需法律意见书）", "Primary subscribe/redeem + DeFi adapters (legal opinion required)"), why: T("池子会让未 KYC 地址间接获得敞口，资格几何必须有法务签字。", "A pool gives never-KYC'd addresses indirect exposure; the eligibility geometry needs legal sign-off.") };
    else r.venue = { v: T("一级门户（+ 内部撮合公告板）", "Primary portal (+ internal bulletin board)"), why: T("一级永远要有；二级等真实需求出现再说（阶段 9.1）。", "Primary always exists; secondary waits for real demand (Stage 9.1).") };
    return r;
  }

  function tensions() {
    const w = [];
    if (a.buyer === "inst" && a.defi === "core") w.push(T("资格几何冲突（阶段 7.2）：机构合格购买者产品要放进开放 DeFi 池 → 未 KYC 地址会获得间接敞口，与 Reg D 的转让限制正面冲突。", "Eligibility-geometry conflict (Stage 7.2): a QP-only product dropped into an open DeFi pool gives never-KYC'd addresses indirect exposure — a head-on clash with Reg D transfer restrictions."));
    if (a.juris === "regd" && a.buyer === "retail") w.push(T("Reg D 是私募豁免，卖不到零售广度；要零售就得换 Reg A+/招股书路径，成本与时间跳一个量级。", "Reg D is a private-placement exemption and can't reach retail breadth; retail means Reg A+/prospectus, which jumps cost and time by an order of magnitude."));
    if (a.sec === "venue" && a.budget === "low") w.push(T("预算档与 ATS 挂牌不匹配：场所对接通常 3–9 个月且要法务与合规投入。", "Budget band doesn't match an ATS listing: venue integration usually takes 3–9 months plus legal and compliance spend."));
    if (a.asset === "re" && a.buyer === "inst") w.push(T("机构买家通常要求可验证的日/月度估值，而单体地产靠季度评估——先把估值节奏诚实定下来（阶段 3.5）。", "Institutional buyers usually want verifiable daily/monthly valuation, but single properties rely on quarterly appraisal — settle the honest cadence first (Stage 3.5)."));
    if (a.defi === "core" && a.juris === "regd") w.push(T("Reg D + 可组合性几乎互斥：想要 DeFi 分发，Reg S 的非美路径（USDY 形状）才是可行解。", "Reg D and composability are near-exclusive: for DeFi distribution, the Reg S non-US path (the USDY shape) is the workable answer."));
    return w;
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🧭 选型引擎 · 从买家倒推整套技术栈", "🧭 Stack picker · derive the whole stack from your buyers")}</div>
      <div class="demo-switch">${T("载入样板设计：", "Load a worked design: ")}
        <button class="demo-btn" data-pre="A">${T("A 机构货币基金", "A Institutional MMF")}</button>
        <button class="demo-btn" data-pre="B">${T("B 全球零售地产", "B Global retail RE")}</button>
        <button class="demo-btn" data-pre="C">${T("C DeFi 国债金库", "C DeFi treasury vault")}</button>
      </div>
      <div class="demo-block" id="sp-form"></div>
      <div class="demo-block" id="sp-out"></div>
      <div id="sp-warn"></div>
      <div class="demo-btns"><button class="demo-btn" id="sp-diff">${T("🔍 对比 BUIDL", "🔍 Diff vs BUIDL")}</button></div>
      <div id="sp-diffout"></div>
      <p class="demo-tip">${T("每个技术选择的上游都是一个法律选择，每个法律选择的上游都是<strong>“卖给谁”</strong>——选型表只是这条因果链的照妖镜。试试把“机构买家”配上“可组合性就是产品”，看引擎怎么报警。", "Upstream of every technical choice is a legal choice, and upstream of that is <strong>who you're selling to</strong> — the selection table just mirrors that causal chain. Try pairing “institutions” with “composability IS the product” and watch the engine object.")}</p>
    </div>`;

  const form = root.querySelector("#sp-form");
  const out = root.querySelector("#sp-out");
  const warn = root.querySelector("#sp-warn");
  const diffOut = root.querySelector("#sp-diffout");

  function paint() {
    form.innerHTML = Q.map((q) => `
      <div style="margin-bottom:7px">
        <div class="demo-label">${q.label}</div>
        ${q.opts.map((o) => `<button class="demo-btn ${a[q.k] === o.v ? "active" : ""}" data-q="${q.k}" data-v="${o.v}" style="font-size:11px;margin:2px 4px 2px 0">${o.t}</button>`).join("")}
      </div>`).join("");
    form.querySelectorAll("[data-q]").forEach((b) =>
      b.addEventListener("click", () => { a[b.dataset.q] = b.dataset.v; diffOut.innerHTML = ""; paint(); }));

    const r = decide();
    const rows = [
      [T("链", "Chain"), r.chain], [T("代币标准", "Token standard"), r.std], [T("托管", "Custody"), r.cust],
      [T("预言机/数据", "Oracle/data"), r.oracle], [T("KYC/合规", "KYC/compliance"), r.kyc], [T("分发与场地", "Distribution & venue"), r.venue],
    ];
    out.innerHTML = `<div class="demo-label">${T("推荐技术栈（每项一句理由）", "Recommended stack (one line of reasoning each)")}</div>` +
      rows.map(([k, v]) => `
        <div style="margin:5px 0;padding:6px 8px;border-left:3px solid var(--orange-line);background:var(--surface-2);border-radius:0 6px 6px 0">
          <div style="font-size:12px;color:var(--ink)"><b>${k}</b>：<span style="font-family:var(--mono)">${v.v}</span></div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">${v.why}</div>
        </div>`).join("");

    const w = tensions();
    warn.innerHTML = w.length
      ? w.map((x) => `<div class="demo-warn" style="margin-top:8px;font-size:11px">⚠ ${x}</div>`).join("")
      : `<div class="demo-meta" style="margin-top:8px;color:var(--green)">${T("✓ 没有检测到资格几何冲突：买家、法域与分发路径互相自洽。", "✓ No eligibility-geometry conflicts: buyers, jurisdiction, and distribution path are mutually consistent.")}</div>`;
  }

  root.querySelectorAll("[data-pre]").forEach((b) =>
    b.addEventListener("click", () => {
      a = Object.assign({}, PRESETS[b.dataset.pre]);
      root.querySelectorAll("[data-pre]").forEach((x) => x.classList.toggle("active", x === b));
      diffOut.innerHTML = "";
      paint();
    }));

  root.querySelector("#sp-diff").addEventListener("click", () => {
    const r = decide();
    const mine = { chain: r.chain.v, std: r.std.v, cust: r.cust.v, oracle: r.oracle.v, kyc: r.kyc.v, venue: r.venue.v };
    const keys = [["chain", T("链", "Chain")], ["std", T("标准", "Standard")], ["cust", T("托管", "Custody")], ["oracle", T("数据", "Data")], ["kyc", "KYC/TA"], ["venue", T("分发", "Distribution")]];
    let same = 0;
    const rows = keys.map(([k, label]) => {
      const hit = mine[k].toLowerCase().slice(0, 8) === BUIDL[k].toLowerCase().slice(0, 8) ||
        (k === "chain" && /ethereum|以太坊/i.test(mine[k])) ||
        (k === "std" && /erc-20/i.test(mine[k])) ||
        (k === "cust" && /qualified|合格/i.test(mine[k])) ||
        (k === "oracle" && /admin|管理员/i.test(mine[k])) ||
        (k === "kyc" && /(full-stack|全栈)/i.test(mine[k])) ||
        (k === "venue" && /(primary|一级门户)/i.test(mine[k]));
      if (hit) same++;
      return `<div style="display:flex;gap:6px;font-size:11px;margin:3px 0">
        <span style="width:60px;color:var(--muted)">${label}</span>
        <span style="flex:1;color:${hit ? "var(--green)" : "var(--red)"};font-family:var(--mono)">${hit ? "✓" : "✗"} ${mine[k]}</span>
        <span style="flex:1;color:var(--muted);font-family:var(--mono)">${BUIDL[k]}</span>
      </div>`;
    }).join("");
    diffOut.innerHTML = `<div class="demo-block" style="margin-top:8px">
      <div class="demo-label">${T("你的设计 vs 真实的 BUIDL（阶段 10.1）", "Your design vs the real BUIDL (Stage 10.1)")}</div>
      ${rows}
      <div style="margin-top:8px;font-size:11px;color:${same >= 5 ? "var(--green)" : "var(--orange-ink)"}">${same >= 5
        ? T("对上 " + same + "/6 —— 你刚刚从第一性原理重新推导出了贝莱德的旗舰产品。约束条件唯一地决定了架构。", same + "/6 matched — you just re-derived BlackRock's flagship from first principles. Constraints determine architecture uniquely.")
        : T("对上 " + same + "/6 —— 把买家设为“机构”、法域设为 Reg D、DeFi 野心设为“不需要”，再试一次。", same + "/6 matched — set buyers to “institutions,” jurisdiction to Reg D, DeFi ambition to “none,” and try again.")}</div>
    </div>`;
  });

  paint();
}
