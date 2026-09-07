// 交互演示：六层风险雷达图——载入真实产品画像，或回答 12 个问题画出你自己产品的形状，再联合压力测试。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const AXES = [
    T("资产", "Asset"), T("发行方", "Issuer"), T("法律", "Legal"),
    T("托管", "Custody"), T("数据", "Data"), T("合约/链", "Contract"),
  ];
  // 每个预设：六轴分数(0-5，越高越危险) + 流动性评语 + 每轴理由（含训练该轴的阶段）
  const PRESETS = {
    buidl: {
      name: "BUIDL", scores: [1, 1, 1, 1, 2, 3],
      liq: T("流动性：一级赎回极好（USDC 即时通道），二级仅限白名单", "Liquidity: excellent primary (instant USDC facility), whitelist-only secondary"),
      why: [
        T("短期美国国债，违约史为零（阶段 3.2）", "Short-dated T-bills, zero default history (Stage 3.2)"),
        T("贝莱德 + Securitize，机构级运营（阶段 10.1）", "BlackRock + Securitize, institutional ops (Stage 10.1)"),
        T("BVI 基金 + Reg D 正规发行（阶段 5.2）", "BVI fund + proper Reg D offering (Stage 5.2)"),
        T("纽约梅隆托管，资产隔离（阶段 3.4）", "BNY Mellon custody, segregated (Stage 3.4)"),
        T("行政方日算 NAV，链上日更（阶段 8.2）", "Administrator computes NAV daily (Stage 8.2)"),
        T("7 条链 + 许可合约管理员开关 = 最大的一块面（阶段 10.1 / 6.5）", "7 chains + permissioned admin switches = the biggest surface (Stage 10.1 / 6.5)"),
      ],
    },
    usdy: {
      name: "USDY", scores: [1, 2, 2, 2, 2, 2],
      liq: T("流动性：铸造后 40+ 天锁定，之后链上可转", "Liquidity: 40+ day lock after mint, then transferable on-chain"),
      why: [
        T("底层仍是短期国债类资产（阶段 10.2）", "Underlying is still short-dated Treasuries (Stage 10.2)"),
        T("Ondo 比贝莱德年轻得多，履历更短（阶段 10.2）", "Ondo is far younger than BlackRock (Stage 10.2)"),
        T("收益型票据而非注册基金——结构多绕一层（阶段 10.2）", "A yield-bearing note, not a registered fund (Stage 10.2)"),
        T("托管安排正规但层级更多（阶段 3.4）", "Proper custody but more intermediation (Stage 3.4)"),
        T("有第三方核验与定期披露（阶段 4.2）", "Third-party verification & periodic disclosure (Stage 4.2)"),
        T("合约较简单，链上足迹小于 BUIDL（阶段 6）", "Simpler contracts, smaller footprint than BUIDL (Stage 6)"),
      ],
    },
    credit: {
      name: T("信贷池", "Credit pool"), scores: [4, 3, 3, 2, 3, 3],
      liq: T("流动性：差——违约后近乎冻结（阶段 10.3）", "Liquidity: poor — near-frozen after a default (Stage 10.3)"),
      why: [
        T("无抵押新兴市场金融科技贷款，违约史真实存在（阶段 10.3）", "Unsecured EM fintech loans with real default history (Stage 10.3)"),
        T("依赖借款方运营与催收能力（阶段 10.3）", "Depends on borrower ops & servicing (Stage 10.3)"),
        T("跨国追索：诉讼在乌干达/肯尼亚法院（阶段 5.4）", "Cross-border recourse: courts in Uganda/Kenya (Stage 5.4)"),
        T("信贷无实物可托管，退化为合同管理（阶段 3.5）", "Nothing physical to custody; contract management (Stage 3.5)"),
        T("NAV 依赖借款方报数（阶段 8.2）", "NAV relies on borrower-reported numbers (Stage 8.2)"),
        T("池子合约 + 分层逻辑，复杂度不低（阶段 6.4）", "Pool contracts + tranche logic (Stage 6.4)"),
      ],
    },
    scam: {
      name: T("“15% 稳定”", "“15% stable”"), scores: [2, 4, 5, 5, 4, 3],
      liq: T("流动性：营销说“随时退出”，条款里写“经理人酌情”", "Liquidity: marketing says “exit anytime”, terms say “manager's discretion”"),
      why: [
        T("可能真买了点国债当道具——资产层是诱饵（阶段 12.1⑤）", "May hold some real T-bills as props — the asset layer is bait (Stage 12.1)"),
        T("团队匿名，却握着管理员密钥（阶段 6.5）", "Anonymous team holding admin keys (Stage 6.5)"),
        T("注册处查无实体：请求权可能不存在（阶段 10.6）", "No entity in any registry: the claim may not exist (Stage 10.6)"),
        T("“合作托管方”无名无姓（阶段 4.2）", "A nameless “partner custodian” (Stage 4.2)"),
        T("无鉴证、无 PoR、无 NAV 来源（阶段 8.3）", "No attestation, no PoR, no NAV source (Stage 8.3)"),
        T("合约未验证源码（阶段 12.3）", "Unverified contract source (Stage 12.3)"),
      ],
    },
  };
  // 自建模式：12 个问题（每轴 2 个），答“否/不知道”加分（更危险）
  const QS = [
    { ax: 0, q: T("底层是国债级资产（而非私人信贷/另类）？", "Underlying is Treasury-grade (not private credit/alts)?") },
    { ax: 0, q: T("底层期限短（<1 年）？", "Underlying maturity is short (<1yr)?") },
    { ax: 1, q: T("发行方团队实名、有多年可查履历？", "Issuer team is named with a verifiable track record?") },
    { ax: 1, q: T("发行方倒闭时资产与其破产隔离？", "Assets are bankruptcy-remote from the issuer?") },
    { ax: 2, q: T("法律实体能在官方注册处查到？", "Legal entity findable in an official registry?") },
    { ax: 2, q: T("有真实出售/过户文件与明确法域？", "True-sale docs & clear jurisdiction exist?") },
    { ax: 3, q: T("托管方有名字、独立、可独立核实？", "Custodian named, independent, verifiable?") },
    { ax: 3, q: T("文件明确禁止储备被质押/再抵押？", "Docs forbid pledging/rehypothecating reserves?") },
    { ax: 4, q: T("NAV 至少日更、由独立行政方计算？", "NAV at least daily, by an independent administrator?") },
    { ax: 4, q: T("有近 90 天内的鉴证或实时 PoR？", "Attestation <90 days old, or live PoR?") },
    { ax: 5, q: T("合约审计覆盖已部署地址？", "Audit covers the deployed address?") },
    { ax: 5, q: T("管理员密钥是多签/时间锁（非单个 EOA）？", "Admin keys multisig/timelocked (not one EOA)?") },
  ];
  const STRESS = {
    rate: { label: T("⚡ 利率冲击", "⚡ Rate shock"), add: [2, 0, 0, 1, 1, 0], note: T("利率急升：资产层浮亏 + 托管行债券组合承压 + NAV 波动加大（阶段 4.3 的 SVB 链条）", "Rates spike: asset losses + custodian bond books under stress + NAV swings (Stage 4.3's SVB chain)") },
    scandal: { label: T("⚡ 发行方丑闻", "⚡ Issuer scandal"), add: [0, 3, 1, 1, 1, 0], note: T("发行方暴雷：法律与托管安排被重新审视，数据可信度同步下降", "Issuer blows up: legal & custody arrangements get re-examined, data credibility drops with it") },
    exploit: { label: T("⚡ 链上攻击", "⚡ Chain exploit"), add: [0, 0, 0, 0, 2, 3], note: T("桥或合约被攻击：合约层直接受损，喂价与储备数据陷入迷雾（阶段 9.3）", "A bridge/contract exploit: contract layer hit, feeds and reserve data go dark (Stage 9.3)") },
  };

  let mode = "buidl", stress = null, answers = QS.map(() => false);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🕸️ 风险雷达 · 画出产品的形状", "🕸️ Risk radar · draw the product's shape")}</div>
      <div class="demo-switch">${T("画像：", "Portrait: ")}
        <button class="demo-btn" data-m="buidl">BUIDL</button>
        <button class="demo-btn" data-m="usdy">USDY</button>
        <button class="demo-btn" data-m="credit">${T("信贷池", "Credit pool")}</button>
        <button class="demo-btn" data-m="scam">${T("15%“稳定”", "15% “stable”")}</button>
        <button class="demo-btn" data-m="custom">${T("🛠 自建", "🛠 Build your own")}</button>
      </div>
      <div id="rr-qs" class="demo-block" style="display:none"></div>
      <div class="demo-block" style="text-align:center"><svg id="rr-svg" viewBox="0 0 300 240" style="max-width:340px;width:100%"></svg></div>
      <div class="demo-block" id="rr-why"></div>
      <div class="demo-btns" id="rr-stress"></div>
      <div id="rr-note"></div>
      <p class="demo-tip">${T("专家和小白的区别：小白问“安全吗”，专家画出六边形，指着<strong>最凹的那个角</strong>问问题。再按一下压力测试——注意几层是<strong>一起</strong>恶化的。", "The novice asks “is it safe?”; the expert draws the hexagon and interrogates <strong>the deepest dent</strong>. Then hit a stress test — notice how several layers degrade <strong>together</strong>.")}</p>
    </div>`;

  const svg = root.querySelector("#rr-svg"), whyEl = root.querySelector("#rr-why");
  const qsEl = root.querySelector("#rr-qs"), noteEl = root.querySelector("#rr-note");
  const stressEl = root.querySelector("#rr-stress");

  stressEl.innerHTML = Object.keys(STRESS).map((k) => `<button class="demo-btn" data-s="${k}">${STRESS[k].label}</button>`).join("") +
    `<button class="demo-btn" data-s="none">${T("↺ 平时", "↺ Calm")}</button>`;
  qsEl.innerHTML = `<div class="demo-label">${T("回答 12 问（勾选 = 是）：", "Answer 12 questions (check = yes):")}</div>` +
    QS.map((x, i) => `<label style="display:block;margin:3px 0;font-size:13px;color:var(--ink)"><input type="checkbox" data-q="${i}"> ${x.q}</label>`).join("");

  function currentScores() {
    let base;
    if (mode === "custom") {
      base = [0, 0, 0, 0, 0, 0];
      QS.forEach((x, i) => { if (!answers[i]) base[x.ax] += 2.5; });
    } else base = PRESETS[mode].scores.slice();
    if (stress) base = base.map((v, i) => Math.min(5, v + STRESS[stress].add[i]));
    return base;
  }

  function pt(i, r) {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    return [150 + r * Math.cos(a) * 16, 115 + r * Math.sin(a) * 16].map((n) => n.toFixed(1)).join(",");
  }

  function paint() {
    const sc = currentScores();
    const worst = sc.indexOf(Math.max(...sc));
    let g = "";
    for (let r = 1; r <= 5; r++) g += `<polygon points="${[0,1,2,3,4,5].map((i) => pt(i, r)).join(" ")}" fill="none" stroke="var(--line)" stroke-width="0.6"/>`;
    for (let i = 0; i < 6; i++) {
      g += `<line x1="150" y1="115" x2="${pt(i, 5).split(",")[0]}" y2="${pt(i, 5).split(",")[1]}" stroke="var(--line)" stroke-width="0.6"/>`;
      const [lx, ly] = pt(i, 6.4).split(",");
      g += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="11" fill="${i === worst ? "var(--red)" : "var(--muted)"}" font-weight="${i === worst ? "700" : "400"}">${AXES[i]} ${sc[i].toFixed(0)}</text>`;
    }
    g += `<polygon points="${sc.map((v, i) => pt(i, Math.max(v, 0.15))).join(" ")}" fill="var(--orange-soft)" stroke="${stress ? "var(--red)" : "var(--orange-line)"}" stroke-width="2"/>`;
    svg.innerHTML = g;

    const liq = mode === "custom" ? T("流动性：请对照阶段 9.4 的赎回条款与二级深度自评", "Liquidity: self-assess redemption terms & secondary depth per Stage 9.4") : PRESETS[mode].liq;
    let why = `<div class="demo-label">${liq}</div>`;
    why += `<div style="font-weight:700;color:var(--red);margin:6px 0">${T("⚠ 最弱一层：", "⚠ Weakest layer: ")}${AXES[worst]} — ${T("你的真实风险 = 最深的那个坑，不是平均分", "your real risk = the deepest crater, not the average")}</div>`;
    if (mode !== "custom") why += PRESETS[mode].why.map((w, i) => `<div style="font-size:12.5px;color:var(--muted);margin:2px 0">▸ <b style="color:var(--ink)">${AXES[i]}</b>：${w}</div>`).join("");
    whyEl.innerHTML = why;
    noteEl.innerHTML = stress ? `<div class="demo-warn">${STRESS[stress].note} — ${T("注意：多层同时变深，这就是“联合压力测试”的意义", "notice several layers deepening at once — that's why stress tests must be joint")}</div>` : "";
    qsEl.style.display = mode === "custom" ? "" : "none";
  }

  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m; stress = null;
    root.querySelectorAll("[data-m]").forEach((x) => x.classList.toggle("active", x === b));
    root.querySelectorAll("[data-s]").forEach((x) => x.classList.remove("active"));
    paint();
  }));
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => {
    stress = b.dataset.s === "none" ? null : b.dataset.s;
    root.querySelectorAll("[data-s]").forEach((x) => x.classList.toggle("active", x === b && stress));
    paint();
  }));
  qsEl.addEventListener("change", (e) => { if (e.target.dataset.q != null) { answers[+e.target.dataset.q] = e.target.checked; paint(); } });

  root.querySelector('[data-m="buidl"]').classList.add("active");
  paint();
}
