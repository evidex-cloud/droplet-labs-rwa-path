// 交互演示：RWA 全景地图——板块卡片按规模/难度/增速三种方式重排，点开看规模、龙头、法律实质与成熟度。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // size: 相对面积权重; diff: 代币化难度 1易-6难; growth: 增速排名 1最快
  const sectors = [
    { icon: "💵", name: T("稳定币", "Stablecoins"), size: T("≈ $2500–3000 亿", "≈ $250–300B"), sz: 6, diff: 1, growth: 3, stars: "★★★★★",
      leaders: "USDT · USDC", legal: T("对发行方的美元索赔权（GENIUS 法案 / MiCA EMT）", "A dollar claim on the issuer (GENIUS Act / MiCA EMT)"),
      why: T("五因子几乎全满 + “不关门的美元”刚需——所以最先跑通、规模碾压全场。", "Near-perfect factor score plus rigid demand for “dollars that never close” — first to work, dwarfs the field.") },
    { icon: "🏛️", name: T("代币化国债", "Tokenized Treasuries"), size: T("≈ $70–80 亿", "≈ $7–8B"), sz: 4, diff: 2, growth: 1, stars: "★★★★☆",
      leaders: "BUIDL · BENJI · Ondo", legal: T("基金份额（Reg D 等证券规则）", "Fund shares (Reg D and other securities rules)"),
      why: T("T-Bill 五项全满：同质、主权信用、生息 4–5%、法律成熟、纯电子——增速全场第一。", "T-bills score five for five: fungible, sovereign, 4–5% yield, mature law, purely electronic — fastest growth on the board.") },
    { icon: "🏦", name: T("私募信贷", "Private credit"), size: T("链上余额 $100 亿+", "$10B+ on-chain"), sz: 4.4, diff: 4, growth: 2, stars: "★★★☆☆",
      leaders: "Figure · Maple · Centrifuge", legal: T("贷款收益权的票据/基金份额", "Notes or fund interests in loan pools"),
      why: T("闷声的巨头：Figure 的 HELOC 流水线占大头；Maple/Goldfinch 交过违约学费——选平台比选品类重要。", "The quiet giant: Figure's HELOC pipeline holds most balances; Maple/Goldfinch paid default tuition — platform choice beats category choice.") },
    { icon: "🥇", name: T("黄金/大宗", "Gold / commodities"), size: T("≈ $10–20 亿", "≈ $1–2B"), sz: 3, diff: 3, growth: 4, stars: "★★★½",
      leaders: "PAXG · XAUT", legal: T("对具体编号金条的信托权益（可赎实物）", "Trust interest in specific numbered bars (redeemable)"),
      why: T("产品成立但被黄金 ETF 衬得小——对多数人还没解决“非它不可”的问题。", "A sound product that looks small next to gold ETFs — it doesn't yet solve a problem nothing else can.") },
    { icon: "📜", name: T("代币化债券", "Tokenized bonds"), size: T("试点 · 数亿/笔", "Pilots · $100M+/issue"), sz: 2.4, diff: 3.5, growth: 5, stars: "★★½",
      leaders: T("欧投行 · 香港绿债", "EIB · HK green bonds"), legal: T("债券本身直接上链发行", "The bond itself, issued directly on-chain"),
      why: T("政府亲自试管道：测试“不需要 CSD 的债券市场”。意义大于规模，等常态化。", "Governments testing the pipes themselves: a bond market without a CSD. Meaning exceeds size — awaiting routine use.") },
    { icon: "🏠", name: T("房地产", "Real estate"), size: T("数亿美元级", "Hundreds of $M"), sz: 1.8, diff: 6, growth: 6, stars: "★★☆☆☆",
      leaders: "RealT", legal: T("持有房产的 SPV 权益（登记处不认代币）", "Equity in a property-holding SPV (registries don't recognize tokens)"),
      why: T("最直觉的用例、最难的品类：非标、法律重、未电子化——碎片 ≠ 流动性。", "The most intuitive use case, the hardest category: non-standard, law-heavy, not electronic — and fractions ≠ liquidity.") },
    { icon: "📈", name: T("股票", "Equities"), size: T("试点 · 零头", "Pilots · crumbs"), sz: 1.5, diff: 5, growth: 7, stars: "★½",
      leaders: T("Robinhood 欧洲 · xStocks", "Robinhood EU · xStocks"), legal: T("多为跟踪股价的衍生品/凭证——无投票权、不上股东名册", "Mostly price-tracking derivatives/certificates — no vote, not on the register"),
      why: T("要等公司法认可链上股东名册（特拉华/怀俄明已开口子）——比想象的慢。", "Waits on corporate law recognizing on-chain registers (Delaware/Wyoming cracked the door) — slower than people expect.") },
  ];

  const modes = [
    { id: "size", label: T("按今天的规模", "By size today"), sort: (a, b) => b.sz - a.sz, cap: T("规模排序：稳定币一骑绝尘——一个品类顶其余总和十倍以上。", "Sorted by size: stablecoins dwarf everything — one category beats the rest combined tenfold.") },
    { id: "diff", label: T("按代币化难度", "By difficulty"), sort: (a, b) => a.diff - b.diff, cap: T("难度排序（易→难）：和规模排序几乎同序——这不是巧合，是五因子规律。", "Sorted easy → hard: nearly the same order as size — not a coincidence, that's the five-factor rule.") },
    { id: "growth", label: T("按增速", "By growth"), sort: (a, b) => a.growth - b.growth, cap: T("增速排序：国债第一（两年十几倍）——收益率是 RWA 的第一推动力。", "Sorted by growth: Treasuries first (10x+ in two years) — yield is RWA's prime mover.") },
  ];

  let mode = modes[0], open = -1;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🗺️ RWA 全景地图（截至 2025）", "🗺️ The RWA landscape map (as of 2025)")}</div>
      <div class="demo-switch" id="lm-modes">${modes.map((m, i) => `<button class="demo-btn${i === 0 ? " active" : ""}" data-m="${i}">${m.label}</button>`).join("")}</div>
      <div class="demo-label" id="lm-cap" style="margin:4px 0 8px"></div>
      <div id="lm-grid"></div>
      <p class="demo-tip">${T("切换三种排序，注意<strong>“规模大”和“难度低”的顺序几乎一样</strong>——什么资产先上链不是抽签，是规律：越标准化、越高质量、会生息、法律简单、已电子化，越先跑出来。点开每张卡，看“代币在法律上是什么”那一行：全都是<strong>收据</strong>，不是资产本身。", "Flip the three sorts and notice <strong>“biggest” and “easiest” are nearly the same order</strong> — which assets tokenize first isn't a lottery, it's a rule: more standardized, higher-quality, yield-bearing, legally simple, already-electronic assets break out first. Open each card and read “what the token legally is”: every one is a <strong>receipt</strong>, never the asset itself.")}</p>
    </div>`;

  const grid = root.querySelector("#lm-grid");
  const cap = root.querySelector("#lm-cap");

  function paint() {
    cap.textContent = mode.cap;
    const arr = sectors.slice().sort(mode.sort);
    grid.innerHTML = arr.map((s) => {
      const i = sectors.indexOf(s);
      const w = 30 + Math.round((s.sz / 6) * 70);
      const bar = `<div style="height:6px;border-radius:3px;background:var(--orange-soft);width:${w}%;margin-top:6px"><div style="height:6px;border-radius:3px;background:var(--orange-line);width:100%"></div></div>`;
      const head = `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <span style="font-weight:700;color:var(--ink)">${s.icon} ${s.name}</span>
          <span style="color:var(--muted);font-family:var(--mono);font-size:.8rem">${s.size}</span>
        </div>${bar}`;
      const body = open === i ? `
        <div style="margin-top:8px;font-size:.85rem;display:grid;gap:4px">
          <div><span class="demo-label">${T("龙头：", "Leaders: ")}</span><span style="color:var(--ink)">${s.leaders}</span></div>
          <div><span class="demo-label">${T("代币在法律上是：", "What the token legally is: ")}</span><span style="color:var(--ink)">${s.legal}</span></div>
          <div><span class="demo-label">${T("成熟度：", "Maturity: ")}</span><span style="color:var(--orange-ink)">${s.stars}</span></div>
          <div style="color:var(--muted)">${s.why}</div>
        </div>` : `<div class="demo-label" style="margin-top:4px">${T("点击展开 ▾", "Click to expand ▾")}</div>`;
      return `<div class="demo-block" data-i="${i}" style="cursor:pointer;border-left:3px solid ${open === i ? "var(--orange-line)" : "var(--line)"}">${head}${body}</div>`;
    }).join("");
    grid.querySelectorAll("[data-i]").forEach((el) =>
      el.addEventListener("click", () => { open = open === +el.dataset.i ? -1 : +el.dataset.i; paint(); }));
  }

  root.querySelectorAll("#lm-modes [data-m]").forEach((b) =>
    b.addEventListener("click", () => {
      mode = modes[+b.dataset.m];
      root.querySelectorAll("#lm-modes [data-m]").forEach((x) => x.classList.toggle("active", x === b));
      paint();
    }));

  paint();
}
