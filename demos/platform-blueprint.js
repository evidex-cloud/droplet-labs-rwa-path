// 交互演示：代币化平台架构蓝图浏览器——点盒子看内部/供应商/失灵形态，追踪三条数据流，拆掉某个盒子看什么会坏，逐盒 build/buy 汇总供应商数与时间。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const boxes = [
    {
      k: "legal", n: "①", name: T("法律与结构引擎", "Legal & Structuring"),
      job: T("设实体、起草文件、选登记制度", "Form the entity, draft docs, choose the register regime"),
      subs: T("SPV/基金设立 · PPM 与认购协议 · 登记制度选择 · 法律工单", "SPV/fund formation · PPM & subscription docs · register regime · legal tickets"),
      vendors: ["Law firm", "Corporate agent", "Transfer agent"],
      risk: T("阶段 12.1 第 3 层 · 法律/结构层", "Stage 12.1 Layer 3 · legal/structural"),
      fail: T("包装是假的、真实出售没做、两本账打架 → 请求权根本不存在", "Fake wrapper, no true sale, two registers disagreeing → the claim never existed"),
      breaks: T("代币不再对应任何法律权利；③ 的开关失去授权依据；投资人只剩一句“我们承诺”。", "Tokens map to no legal right; ③'s switches lose their authority; investors hold only a promise."),
      buy: { vendors: 2, months: 3, lic: 1 }, build: { vendors: 0, months: 30, lic: 1 },
    },
    {
      k: "compliance", n: "②", name: T("身份与合规层", "Identity & Compliance"),
      job: T("把“有资格持有”变成机器可查的事实", "Turn “eligible to hold” into a machine-checkable fact"),
      subs: T("KYC/AML 流水线 · 链上声明签发 · 资格引擎 · 持续筛查与撤销", "KYC/AML pipeline · claim issuance · eligibility engine · ongoing screening & revocation"),
      vendors: ["Sumsub-class KYC", "Sanctions data", "Claim registry"],
      risk: T("阶段 12.1 第 2 层 · 发行方/合规", "Stage 12.1 Layer 2 · issuer/compliance"),
      fail: T("放进来一个不该进的人 → 罚单落在 ① 的法律实体上", "Letting in someone who shouldn't be in → the fine lands on ①'s entity"),
      breaks: T("每一次 transfer 检查都无从判断；白名单僵死；制裁名单更新后没人能被冻结。", "Every transfer check loses its oracle; the allowlist ossifies; nobody can be frozen after a sanctions update."),
      buy: { vendors: 2, months: 2, lic: 0 }, build: { vendors: 0, months: 12, lic: 0 },
    },
    {
      k: "token", n: "③", name: T("代币引擎", "Token Engine"),
      job: T("部署标准、管铸销闸、握管控开关", "Deploy the standard, run mint/burn airlocks, hold the switches"),
      subs: T("ERC-3643/4626 选型 · 铸造与销毁闸 · pause/freeze/forcedTransfer · 升级治理", "ERC-3643/4626 choice · mint & burn airlocks · pause/freeze/forcedTransfer · upgrade governance"),
      vendors: ["Tokeny-class stack", "Audit firm", "Chain/RPC"],
      risk: T("阶段 12.1 第 6 层 · 合约/链层", "Stage 12.1 Layer 6 · contract/chain"),
      fail: T("合约漏洞、管理员钥匙被盗、桥被黑", "Contract bug, stolen admin key, hacked bridge"),
      breaks: T("没有代币可发；即使法律与合规完美，链上什么也不会发生——但注意：只有这一个盒子坏时，其余五个仍能靠传统账本运转。", "No token to issue; even with perfect law and compliance nothing happens on-chain — but note: with only this box down, the other five still run on traditional books."),
      buy: { vendors: 2, months: 2, lic: 0 }, build: { vendors: 1, months: 6, lic: 0 },
    },
    {
      k: "servicing", n: "④", name: T("资产服务层", "Asset Servicing"),
      job: T("托管、算 NAV、发分红、天天对账（最被低估）", "Custody, NAV, distributions, daily reconciliation (most underestimated)"),
      subs: T("托管行对接 · 基金行政方算 NAV · 分红与公司行为 · 三方对账", "Custodian links · fund-admin NAV · distributions & corporate actions · three-way reconciliation"),
      vendors: ["Custodian (BNY-class)", "Fund administrator", "Paying agent"],
      risk: T("阶段 12.1 第 4 层 · 托管 + 第 2 层 · 运营", "Stage 12.1 Layer 4 · custody + Layer 2 · operations"),
      fail: T("钱还在但取不出（SVB 周末）；干活的人跟不上（RealT 物业）", "The money is there but unreachable (the SVB weekend); the people can't keep up (RealT's properties)"),
      breaks: T("NAV 停更、分红断流、链上总量与托管对账单对不上——代币还在，但它已经不代表任何被服务的资产。这是最常被低估的一格。", "NAV stops, distributions stop, on-chain supply stops matching custodian statements — the token remains but no longer represents a serviced asset. The most underestimated cell of all."),
      buy: { vendors: 3, months: 4, lic: 1 }, build: { vendors: 1, months: 36, lic: 1 },
    },
    {
      k: "data", n: "⑤", name: T("数据与预言机层", "Data & Oracles"),
      job: T("把链下事实喂上链并可验证", "Feed off-chain facts on-chain, verifiably"),
      subs: T("NAV 喂价（心跳+偏差阈值）· 储备证明 · 违约标志 · 跨链供应对账", "NAV feeds (heartbeat + deviation) · Proof of Reserve · default flags · cross-chain supply recon"),
      vendors: ["Chainlink-class", "Self-run admin feed"],
      risk: T("阶段 12.1 第 5 层 · 数据/预言机层", "Stage 12.1 Layer 5 · data/oracle"),
      fail: T("链上数字陈旧、被操纵，或什么都证明不了", "On-chain numbers stale, manipulated, or proving nothing"),
      breaks: T("链上价格停在昨天：套利者按旧 NAV 吃你，DeFi 协议按幻觉估值放贷。", "The on-chain price freezes at yesterday: arbitrageurs feast on the stale NAV, DeFi protocols lend against a hallucination."),
      buy: { vendors: 1, months: 1, lic: 0 }, build: { vendors: 0, months: 5, lic: 0 },
    },
    {
      k: "markets", n: "⑥", name: T("分发与市场层", "Distribution & Markets"),
      job: T("一级认购/赎回，二级场所与 DeFi 适配", "Primary subscribe/redeem, secondary venues & DeFi adapters"),
      subs: T("门户 UX · 法币与稳定币轨道 · ATS 对接 · DeFi 适配器", "Portal UX · fiat & stablecoin rails · ATS integration · DeFi adapters"),
      vendors: ["ATS / venue", "Distributor", "DeFi protocol"],
      risk: T("流动性外环（不是某一层，是放大器）", "The liquidity ring (not a layer — an amplifier)"),
      fail: T("没人来买，或来了走不掉", "Nobody comes, or those who came can't leave"),
      breaks: T("产品在法律与技术上完美，却没有入口也没有出口——阶段 10.6 的第一死因原样重现。", "Legally and technically flawless, with no way in and no way out — Stage 10.6's death cause #1, replayed exactly."),
      buy: { vendors: 2, months: 5, lic: 1 }, build: { vendors: 0, months: 30, lic: 1 },
    },
  ];

  const flows = {
    sub: { label: T("认购事件", "Subscription"), path: ["markets", "compliance", "token", "servicing"], note: T("投资人打款 → 资格校验与发声明 → 铸造闸放行 → ④ 链下收钱买资产。", "Investor wires → eligibility & claim → mint airlock opens → ④ takes the cash and buys the asset off-chain.") },
    nav: { label: T("NAV 更新", "NAV update"), path: ["servicing", "data", "markets"], note: T("行政方收盘后算 NAV → 按心跳/偏差喂上链 → 门户与 DeFi 协议读到。", "Admin computes NAV after close → fed on-chain by heartbeat/deviation → read by portals and DeFi.") },
    court: { label: T("法院冻结令", "Court order"), path: ["legal", "token"], note: T("法律实体是被告 → ① 出具法律工单 → ③ 执行 freezePartialTokens / forcedTransfer。", "The legal entity is the defendant → ① issues a legal ticket → ③ executes freezePartialTokens / forcedTransfer.") },
  };

  let sel = "legal";
  let flow = null;
  let flowStep = -1;
  const off = {};
  const mode = {};
  boxes.forEach((b) => { off[b.k] = false; mode[b.k] = "buy"; });

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏗 架构蓝图浏览器 · 六个盒子与它们之间的箭头", "🏗 Blueprint explorer · six boxes and the arrows between them")}</div>
      <div class="demo-switch">${T("追踪数据流：", "Trace a flow: ")}
        <button class="demo-btn" data-flow="sub">${flows.sub.label}</button>
        <button class="demo-btn" data-flow="nav">${flows.nav.label}</button>
        <button class="demo-btn" data-flow="court">${flows.court.label}</button>
        <button class="demo-btn" data-flow="none">${T("清除", "Clear")}</button>
      </div>
      <div id="pb-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0"></div>
      <div id="pb-flownote" class="demo-label" style="min-height:18px;color:var(--orange-ink)"></div>
      <div class="demo-block" id="pb-detail"></div>
      <div class="demo-block" id="pb-summary"></div>
      <p class="demo-tip">${T("好架构不是六个盒子——是盒子之间那些<strong>“必须对得上”</strong>的箭头；对账死在哪条箭头上，风险就住在哪。试试把 ④ 资产服务层<strong>拆掉</strong>：代币照样在链上，但它已经不代表任何被服务的资产。", "Good architecture isn't six boxes — it's the arrows between them that <strong>must reconcile</strong>; whichever arrow the reconciliation dies on is where the risk lives. Try <strong>removing</strong> ④ asset servicing: the token still sits on-chain, but it no longer represents a serviced asset.")}</p>
    </div>`;

  const grid = root.querySelector("#pb-grid");
  const detail = root.querySelector("#pb-detail");
  const summary = root.querySelector("#pb-summary");
  const flownote = root.querySelector("#pb-flownote");

  function paintGrid() {
    grid.innerHTML = boxes.map((b) => {
      const dead = off[b.k];
      const active = flow && flows[flow].path.indexOf(b.k) >= 0 && flows[flow].path.indexOf(b.k) <= flowStep;
      const isSel = sel === b.k;
      const bg = dead ? "var(--surface-2)" : (active ? "var(--orange-soft)" : (isSel ? "var(--green-soft)" : "var(--surface-2)"));
      const bd = dead ? "var(--line)" : (active || isSel ? "var(--orange-line)" : "var(--line)");
      const order = flow ? flows[flow].path.indexOf(b.k) : -1;
      return `
        <div data-box="${b.k}" style="cursor:pointer;padding:9px;border-radius:9px;background:${bg};border:1.5px solid ${bd};opacity:${dead ? 0.42 : 1}">
          <div style="font-size:12px;font-weight:700;color:var(--ink)">${b.n} ${b.name}${dead ? " ✕" : ""}${order >= 0 ? ` <span style="color:var(--orange-ink)">→${order + 1}</span>` : ""}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:3px">${b.job}</div>
          <div style="font-size:10px;margin-top:5px;font-family:var(--mono);color:${mode[b.k] === "buy" ? "var(--green)" : "var(--orange-ink)"}">${mode[b.k] === "buy" ? T("采购", "BUY") : T("自建", "BUILD")}</div>
        </div>`;
    }).join("");
    grid.querySelectorAll("[data-box]").forEach((el) =>
      el.addEventListener("click", () => { sel = el.dataset.box; paint(); }));
  }

  function paintDetail() {
    const b = boxes.find((x) => x.k === sel);
    detail.innerHTML = `
      <div class="demo-label">${T("组件详情", "Component detail")}</div>
      <div style="font-weight:700;color:var(--ink);margin-bottom:4px">${b.n} ${b.name}</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:6px">${T("子组件", "Sub-components")}：${b.subs}</div>
      <div style="margin-bottom:6px">${b.vendors.map((v) => `<span style="display:inline-block;font-size:10px;font-family:var(--mono);background:var(--surface-2);border:1px solid var(--line);border-radius:20px;padding:2px 8px;margin:2px 4px 2px 0;color:var(--ink)">${v}</span>`).join("")}</div>
      <div style="font-size:11px;color:var(--red);margin-bottom:4px">${T("失灵形态", "Failure mode")}：${b.fail}</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">${T("对应风险层", "Maps to")}：${b.risk}</div>
      <div class="demo-btns">
        <button class="demo-btn ${off[b.k] ? "active" : ""}" id="pb-kill">${off[b.k] ? T("↺ 装回来", "↺ Restore") : T("🔨 拆掉这个盒子", "🔨 Remove this box")}</button>
        <button class="demo-btn ${mode[b.k] === "buy" ? "active" : ""}" data-mode="buy">${T("采购 BUY", "BUY")}</button>
        <button class="demo-btn ${mode[b.k] === "build" ? "active" : ""}" data-mode="build">${T("自建 BUILD", "BUILD")}</button>
      </div>
      ${off[b.k] ? `<div class="demo-warn" style="margin-top:8px;font-size:11px">${T("拆掉后会坏的东西", "What breaks")}：${b.breaks}</div>` : ""}`;
    detail.querySelector("#pb-kill").addEventListener("click", () => { off[sel] = !off[sel]; paint(); });
    detail.querySelectorAll("[data-mode]").forEach((el) =>
      el.addEventListener("click", () => { mode[sel] = el.dataset.mode; paint(); }));
  }

  function paintSummary() {
    let v = 0, lic = 0, longest = 0, builds = 0;
    boxes.forEach((b) => {
      const m = mode[b.k] === "buy" ? b.buy : b.build;
      v += m.vendors; lic += m.lic; longest = Math.max(longest, m.months);
      if (mode[b.k] === "build") builds++;
    });
    const dead = boxes.filter((b) => off[b.k]);
    summary.innerHTML = `
      <div class="demo-label">${T("组装汇总", "Assembly summary")}</div>
      <div style="font-size:12px;color:var(--ink)">${T("供应商数量", "Vendor count")}：<b style="font-family:var(--mono)">${v}</b>
        <span style="color:var(--muted);font-size:11px">${v >= 6 && v <= 10 ? T("（落在 6–10 家的典型区间——中介没消失，只是重新专业化了）", "(inside the typical 6–10 band — intermediaries didn't vanish, they re-specialized)") : T("（典型区间是 6–10 家）", "(the typical band is 6–10)")}</span></div>
      <div style="font-size:12px;color:var(--ink);margin-top:4px">${T("关键路径耗时", "Critical-path time")}：<b style="font-family:var(--mono)">${longest} ${T("个月", "months")}</b>　${T("需要牌照的组件", "Licensed components")}：<b style="font-family:var(--mono)">${lic}</b></div>
      <div style="font-size:11px;color:${builds >= 3 ? "var(--red)" : "var(--muted)"};margin-top:5px">${builds >= 3
        ? T("⚠ 你选择自建 " + builds + " 个盒子。凡是要牌照的都自建，上线日期会推到融资烧完之后——规则是：要牌照的买，差异化的建。", "⚠ You chose to BUILD " + builds + " boxes. Building anything license-bound pushes launch past the day the funding runs out — the rule is: buy what's licensed, build what differentiates.")
        : T("规则：凡是要牌照的，买；只有你的差异化，建。", "Rule: buy anything that requires a license; build only your differentiator.")}</div>
      ${dead.length ? `<div class="demo-warn" style="margin-top:8px;font-size:11px">${T("已拆掉", "Removed")}：${dead.map((b) => b.n + " " + b.name).join("、")} — ${T("这条链路已经断了：收据还在，但它背后的承诺没人兑现。", "The chain is broken: the receipt remains, but nobody is honoring the promise behind it.")}</div>` : ""}`;
  }

  function paint() { paintGrid(); paintDetail(); paintSummary(); }

  root.querySelectorAll("[data-flow]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = b.dataset.flow;
      root.querySelectorAll("[data-flow]").forEach((x) => x.classList.remove("active"));
      if (f === "none") { flow = null; flowStep = -1; flownote.textContent = ""; paint(); return; }
      b.classList.add("active");
      if (flow === f) { flowStep = (flowStep + 1) % (flows[f].path.length + 1); }
      else { flow = f; flowStep = 0; }
      const p = flows[f].path;
      const shown = p.slice(0, Math.min(flowStep + 1, p.length))
        .map((k) => boxes.find((x) => x.k === k).n).join(" → ");
      flownote.innerHTML = `${flows[f].label}：${shown} ${flowStep >= p.length - 1 ? "✓" : "…"} <span style="color:var(--muted)">${flowStep >= p.length - 1 ? flows[f].note : T("（再点一次推进一步）", "(click again to advance)")}</span>`;
      paint();
    }));

  paint();
}
