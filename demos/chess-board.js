// 交互演示：机构棋盘——六层架构 × 六个玩家，看谁在圈哪一层；推演三种 2030 情形；信号一响，概率就变。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const LAYERS = [
    { k: "dist", zh: "分发层", en: "Distribution" },
    { k: "data", zh: "数据层", en: "Data" },
    { k: "svc", zh: "服务层", en: "Services" },
    { k: "tok", zh: "代币层", en: "Token" },
    { k: "comp", zh: "合规层", en: "Compliance" },
    { k: "law", zh: "法律层", en: "Legal" },
  ];

  // now: 当前占位强度 1–3；A/B/C: 该情形下的强度变化
  const PLAYERS = [
    {
      id: "am", zh: "资产管理公司", en: "Asset managers", tag: "BlackRock · Franklin",
      now: { dist: 3, svc: 2, tok: 1 },
      moves: [T("BUIDL（2024/03，以太坊首发，Securitize 任过户代理）", "BUIDL (Mar 2024, Ethereum first, Securitize as transfer agent)"),
              T("Franklin BENJI/FOBXX：首只在链上的美国注册基金", "Franklin BENJI/FOBXX: the first US-registered fund on chain"),
              T("更多产品线申报中——图纸已公开", "More product filings — the blueprint is public")],
      fear: T("怕：自己的分发链被脱媒，降级成“产品供应商”", "Fears: its own distribution chain disintermediated, demoted to “product supplier”"),
      A: { dist: +1, tok: +1 }, B: { dist: -1 }, C: { dist: +1, svc: +1 },
    },
    {
      id: "bank", zh: "银行", en: "Banks", tag: "JPM · Citi · BNY",
      now: { svc: 3, law: 2, tok: 1, comp: 2 },
      moves: [T("Kinexys / 存款代币：把存款负债搬上链", "Kinexys / deposit tokens: deposit liabilities on-chain"),
              T("BNY 在 BUIDL 里当托管行 + 行政管理人", "BNY sits inside BUIDL as custodian + administrator"),
              T("银行联盟链参与（Canton 生态）", "Bank-consortium ledger participation (Canton ecosystem)")],
      fear: T("怕：沦为“哑托管”——资产还在，客户关系和数据归别人", "Fears: becoming “dumb custody” — assets stay, relationship and data leave"),
      A: { svc: -1, tok: -1 }, B: { svc: +1, tok: +2 }, C: { svc: +1, tok: +1 },
    },
    {
      id: "infra", zh: "交易所与市场基础设施", en: "Exchanges & infrastructure", tag: "Nasdaq · DTCC · Euroclear",
      now: { svc: 3, tok: 1, data: 2, comp: 2 },
      moves: [T("Nasdaq 2025 代币化结算申报", "Nasdaq's 2025 tokenized-settlement filing"),
              T("DTCC 自有 DLT 项目与代币化抵押品试点", "DTCC's own DLT projects and tokenized-collateral pilots"),
              T("交易所 24/7 交易的公开野心", "Exchanges' open 24/7 trading ambitions")],
      fear: T("怕：链本身就是竞争性的“交易所+CSD”（欧盟 DLT TSS 牌照）", "Fears: the chain is a competing exchange+CSD (the EU's DLT TSS license)"),
      A: { svc: -2, tok: -1 }, B: { svc: +1, tok: +1 }, C: { svc: 0, tok: +1 },
    },
    {
      id: "stbl", zh: "稳定币发行商", en: "Stablecoin issuers", tag: "Circle · Tether · Paxos",
      now: { tok: 3, dist: 2, comp: 1 },
      moves: [T("全球拿牌：GENIUS 法案路径 + MiCA 的 EMT", "Licenses everywhere: the GENIUS Act path + MiCA's EMT"),
              T("当现金腿：BUIDL→USDC 的 7×24 赎回通道", "Being the cash leg: BUIDL→USDC 24/7 redemption"),
              T("与各链绑定分发、贴收益产品做邻接", "Chain distribution deals, yield-product adjacency")],
      fear: T("怕：上有存款代币、下有 wCBDC，两头挤压", "Fears: squeezed between deposit tokens above and wholesale CBDC below"),
      A: { tok: +1, dist: +1 }, B: { tok: -2, dist: -1 }, C: { tok: 0, dist: +1 },
    },
    {
      id: "chain", zh: "公链与协议", en: "Public chains & protocols", tag: "Ethereum · Solana · Chainlink",
      now: { tok: 3, data: 3, comp: 1 },
      moves: [T("机构级功能：隐私方案（阶段 7.4）、合规钩子（阶段 6）", "Institutional features: privacy (Stage 7.4), compliance hooks (Stage 6)"),
              T("数据护城河：NAV 喂价与储备证明（阶段 8）", "Data moat: NAV feeds and proof of reserve (Stage 8)"),
              T("跨链结算与桥（多链 BUIDL）", "Cross-chain settlement and bridges (multichain BUIDL)")],
      fear: T("怕：许可制孤岛赢下机构，公链只剩零售长尾", "Fears: permissioned islands win institutions; public chains keep only retail"),
      A: { tok: +2, data: +1, comp: +1 }, B: { tok: -2, data: -1 }, C: { tok: +1, data: +1 },
    },
    {
      id: "reg", zh: "监管者与政府", en: "Regulators & governments", tag: "SEC · ESMA · MAS · SFC",
      now: { law: 3, comp: 3 },
      moves: [T("沙盒与试点：Project Guardian、DLT 试点制度", "Sandboxes and pilots: Project Guardian, the DLT Pilot Regime"),
              T("批发型央行数字货币（wCBDC）与共享账本倡议", "Wholesale CBDC and shared-ledger initiatives"),
              T("金融中心竞争：谁的牌照能干什么", "Financial-center competition: whose license may do what")],
      fear: T("怕：无关性——轨道迁到别人的法域", "Fears: irrelevance — the rails migrate to another jurisdiction"),
      A: { comp: -1 }, B: { law: +1, comp: +1 }, C: { comp: +1 },
    },
  ];

  const SCEN = {
    A: { zh: "A · 公链开放金融", en: "A · Open finance on public rails",
         note: T("资产在公共轨道结算，合规做成可插拔层。证据：BUIDL 首发以太坊、USDY 进 DeFi。障碍：隐私（阶段 7.4）与托管保守。", "Assets settle on public rails with pluggable compliance. Evidence: BUIDL launched on Ethereum, USDY in DeFi. Obstacle: privacy (Stage 7.4) and custody conservatism.") },
    B: { zh: "B · 许可链花园", en: "B · Permissioned gardens",
         note: T("机构在联盟账本结算，公链退到零售。障碍：n 个花园需要 n² 座桥——重建了阶段 3.4 的对账地狱。", "Institutions settle on consortium ledgers; public chains retreat to retail. Obstacle: n gardens need n² bridges — rebuilding Stage 3.4's reconciliation hell.") },
    C: { zh: "C · 混合双层", en: "C · Hybrid two-tier",
         note: T("公开轨道做分发、许可轨道做批发，受监管的桥连接。证据：BUIDL 已同时活在两边（名册在持牌过户代理，代币在公链）。", "Public rails for distribution, permissioned for wholesale, joined by regulated bridges. Evidence: BUIDL already lives on both sides (register at a licensed TA, token on a public chain).") },
  };

  // 极简贝叶斯玩具：先验 + 每个信号对三种情形的似然比
  const PRIOR = { A: 0.2, B: 0.2, C: 0.6 };
  const SIGNALS = [
    { id: "s1", zh: "wCBDC 规则要求批发结算仅限许可环境", en: "wCBDC rules confine wholesale settlement to permissioned venues", lr: { A: 0.3, B: 3.0, C: 1.0 } },
    { id: "s2", zh: "公链出现被机构接受的隐私方案", en: "An institution-accepted privacy solution ships on a public chain", lr: { A: 3.0, B: 0.5, C: 1.2 } },
    { id: "s3", zh: "某 Canton 规模的联盟账本重大失败", en: "A Canton-scale consortium ledger fails badly", lr: { A: 1.8, B: 0.2, C: 1.3 } },
    { id: "s4", zh: "大型托管行把公链当默认结算层", en: "A major custodian makes a public chain its default settlement layer", lr: { A: 2.5, B: 0.4, C: 1.2 } },
  ];
  const fired = {};
  SIGNALS.forEach((s) => { fired[s.id] = false; });

  let sel = "am", scen = null;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("♟ 机构棋盘 · 谁在抢哪一层", "♟ The institutional chessboard · who grabs which layer")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("选一个玩家（棋子会在它占据的层上亮起）：", "Pick a player (its pieces light up on the layers it occupies):")}</div>
        <div class="demo-switch" id="cb-players"></div>
      </div>
      <div class="demo-block" id="cb-board"></div>
      <div class="demo-block" id="cb-cards"></div>
      <div class="demo-block">
        <div class="demo-label">${T("🔭 推演：选一个 2030 情形，看棋子进退", "🔭 Play it out: pick a 2030 scenario and watch pieces advance or retreat")}</div>
        <div class="demo-switch" id="cb-scen">
          <button class="demo-btn" data-s="A">${T(SCEN.A.zh, SCEN.A.en)}</button>
          <button class="demo-btn" data-s="B">${T(SCEN.B.zh, SCEN.B.en)}</button>
          <button class="demo-btn" data-s="C">${T(SCEN.C.zh, SCEN.C.en)}</button>
          <button class="demo-btn" data-s="">${T("今天", "Today")}</button>
        </div>
        <div class="demo-meta" id="cb-note" style="margin-top:6px;color:var(--muted)"></div>
      </div>
      <div class="demo-block" id="cb-signals"></div>
      <p class="demo-tip">${T("棋盘不是链 vs 银行——是六层架构上的“层层圈地”；看懂谁在抢哪一层，新闻就全能读懂了。<strong>概率不是结论，是等着被信号更新的东西。</strong>", "The board isn't chains vs banks — it's a layer-by-layer land grab on the six-layer stack. Read who's grabbing what and every headline becomes legible. <strong>Probabilities aren't conclusions; they're things waiting to be updated by signals.</strong>")}</p>
    </div>`;

  const playersEl = root.querySelector("#cb-players");
  const boardEl = root.querySelector("#cb-board");
  const cardsEl = root.querySelector("#cb-cards");
  const noteEl = root.querySelector("#cb-note");
  const sigEl = root.querySelector("#cb-signals");

  const strength = (p, lk) => {
    const base = p.now[lk] || 0;
    if (!scen) return base;
    const d = (p[scen] && p[scen][lk]) || 0;
    return Math.max(0, Math.min(3, base + d));
  };

  function paintPlayers() {
    playersEl.innerHTML = PLAYERS.map((p) =>
      `<button class="demo-btn${p.id === sel ? " active" : ""}" data-p="${p.id}">${T(p.zh, p.en)}</button>`).join("");
    playersEl.querySelectorAll("[data-p]").forEach((b) =>
      b.addEventListener("click", () => { sel = b.dataset.p; paintPlayers(); paintBoard(); paintCards(); }));
  }

  function paintBoard() {
    boardEl.innerHTML = `<div class="demo-label">${T("六层架构（阶段 13.1）", "The six-layer stack (Stage 13.1)")}${scen ? ` · ${T("推演", "scenario")} ${scen}` : ""}</div>` +
      LAYERS.map((l) => {
        const chips = PLAYERS.map((p) => {
          const s = strength(p, l.k);
          if (s <= 0) return "";
          const mine = p.id === sel;
          const base = p.now[l.k] || 0;
          const delta = scen ? s - base : 0;
          const arrow = delta > 0 ? " ▲" : delta < 0 ? " ▼" : "";
          const bg = mine ? "var(--orange-soft)" : "var(--surface-2)";
          const bd = mine ? "var(--orange-line)" : "var(--line)";
          const fg = mine ? "var(--orange-ink)" : "var(--muted)";
          return `<span style="display:inline-block;margin:2px 4px 2px 0;padding:2px 7px;border-radius:99px;background:${bg};border:1px solid ${bd};color:${fg};font-size:10.5px">${T(p.zh, p.en)} ${"●".repeat(s)}${arrow}</span>`;
        }).join("");
        return `<div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px solid var(--line)">
            <div style="min-width:74px;font-size:11px;font-weight:700;color:var(--ink)">${T(l.zh, l.en)}</div>
            <div style="flex:1">${chips || `<span class="demo-meta">—</span>`}</div>
          </div>`;
      }).join("");
  }

  function paintCards() {
    const p = PLAYERS.find((x) => x.id === sel);
    cardsEl.innerHTML = `<div class="demo-label">${T("招法卡片：", "Move cards: ")}<b style="color:var(--orange-ink)">${T(p.zh, p.en)}</b> <span class="demo-meta">(${p.tag})</span></div>` +
      p.moves.map((m) => `<div class="demo-meta" style="margin:4px 0;padding:5px 8px;background:var(--surface-2);border-left:3px solid var(--orange-line);border-radius:4px">♟ ${m}</div>`).join("") +
      `<div class="demo-meta" style="margin-top:6px;color:var(--red)">⚠ ${p.fear}</div>`;
  }

  function posterior() {
    const w = { A: PRIOR.A, B: PRIOR.B, C: PRIOR.C };
    SIGNALS.forEach((s) => { if (fired[s.id]) { w.A *= s.lr.A; w.B *= s.lr.B; w.C *= s.lr.C; } });
    const sum = w.A + w.B + w.C;
    return { A: w.A / sum, B: w.B / sum, C: w.C / sum };
  }

  function paintSignals() {
    const post = posterior();
    const bars = ["A", "B", "C"].map((k) => {
      const pct = Math.round(post[k] * 100);
      const col = k === "C" ? "var(--green)" : "var(--orange-line)";
      return `<div style="margin:5px 0">
          <div class="demo-meta" style="display:flex;justify-content:space-between"><span>${T(SCEN[k].zh, SCEN[k].en)}</span><span style="font-family:var(--mono)">${pct}%</span></div>
          <div style="height:9px;width:${pct}%;background:${col};border-radius:5px"></div>
        </div>`;
    }).join("");
    sigEl.innerHTML = `<div class="demo-label">${T("📡 信号面板（先验 A 20% / B 20% / C 60%，可被信号更新）", "📡 Signal panel (priors A 20% / B 20% / C 60%, updated by signals)")}</div>` +
      SIGNALS.map((s) => `<label class="demo-meta" style="display:flex;gap:7px;align-items:flex-start;margin:5px 0;cursor:pointer">
          <input type="checkbox" data-sig="${s.id}" ${fired[s.id] ? "checked" : ""} style="margin-top:2px" />
          <span>${T(s.zh, s.en)}</span></label>`).join("") +
      `<div style="margin-top:8px">${bars}</div>
       <div class="demo-meta" style="margin-top:4px;color:var(--muted)">${T("这是个玩具模型：数字别当真，机制要当真——先验 + 信号 = 更新后的判断。", "A toy model: don't trust the numbers, trust the mechanism — prior + signal = updated judgment.")}</div>`;
    sigEl.querySelectorAll("[data-sig]").forEach((cb) =>
      cb.addEventListener("change", () => { fired[cb.dataset.sig] = cb.checked; paintSignals(); }));
  }

  root.querySelectorAll("#cb-scen [data-s]").forEach((b) =>
    b.addEventListener("click", () => {
      scen = b.dataset.s || null;
      root.querySelectorAll("#cb-scen [data-s]").forEach((x) => x.classList.toggle("active", x.dataset.s === (scen || "")));
      noteEl.textContent = scen ? T(SCEN[scen].zh, SCEN[scen].en) + " — " + SCEN[scen].note : T("显示今天的占位。", "Showing today's positions.");
      paintBoard();
    }));

  noteEl.textContent = T("显示今天的占位。", "Showing today's positions.");
  root.querySelector('#cb-scen [data-s=""]').classList.add("active");
  paintPlayers(); paintBoard(); paintCards(); paintSignals();
}
