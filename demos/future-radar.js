// 交互演示：可行性雷达——给 7 类候选资产的“四根柱子”打分，与课程模型对比，生成你的观察清单。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const AXES = [
    { k: "law", zh: "① 法律清晰度", en: "① Legal clarity" },
    { k: "cus", zh: "② 托管与桥", en: "② Custody & bridge" },
    { k: "dat", zh: "③ 估值与数据", en: "③ Valuation & data" },
    { k: "buy", zh: "④ 真实买家", en: "④ Real buyers" },
  ];

  const CANDS = [
    {
      id: "deposit", zh: "存款代币", en: "Deposit tokens",
      model: { law: 5, cus: 5, dat: 5, buy: 4 },
      why: {
        law: T("银行法直接延伸，不需要新制度。", "Banking law extends directly — no new regime needed."),
        cus: T("银行就是自己的托管人（阶段 1.3）。", "The bank is its own custodian (Stage 1.3)."),
        dat: T("1 代币 = 1 美元存款，估值天然。", "1 token = $1 of deposit; valuation is trivial."),
        buy: T("机构司库要 7×24 结算；但跨行不互清，扣一分。", "Treasurers want 24/7 settlement — but cross-bank clearing is missing, so minus one."),
      },
      trig: T("银行间共享结算层 / wCBDC 桥落地（JPMD 与 CitiToken 能互清）", "An interbank shared settlement layer / wCBDC bridge goes live (JPMD clears against CitiToken)"),
    },
    {
      id: "equity", zh: "代币化美股", en: "Tokenized US equities",
      model: { law: 2, cus: 4, dat: 5, buy: 5 },
      why: {
        law: T("真股份上链动的是证券结算核心制度——最缺的一根。", "Real shares on-chain touch core settlement institutions — the missing pillar."),
        cus: T("DTCC 托管成熟，但过户代理原生模型仍待批准。", "DTCC custody is mature, but TA-native models await approval."),
        dat: T("实时价格是全世界最好的（阶段 8）。", "Real-time prices are the best in the world (Stage 8)."),
        buy: T("全球散户需求在所有 RWA 里最强。", "Global retail demand is the strongest of any RWA."),
      },
      trig: T("SEC 批准过户代理原生的股票代币（Nasdaq/DTCC 结算层申报获批）", "SEC approves transfer-agent-native share tokens (a Nasdaq/DTCC settlement filing clears)"),
    },
    {
      id: "corp", zh: "公司债", en: "Corporate bonds",
      model: { law: 4, cus: 5, dat: 4, buy: 4 },
      why: {
        law: T("€10 万大面额机构门可绕开零售招股书（阶段 11.2）。", "The €100k-denomination institutional door dodges retail prospectus rules (Stage 11.2)."),
        cus: T("与国债共用同一套托管与清算管道。", "Shares the same custody and clearing plumbing as treasuries."),
        dat: T("有公认估值曲线，但多一层信用分析。", "Accepted valuation curves, plus a layer of credit analysis."),
        buy: T("机构买家真实；散户侧仍被面额挡住。", "Institutional buyers are real; retail is still blocked by denomination."),
      },
      trig: T("大型资管把 BUIDL 图纸复制到信用产品（首只规模化代币化公司债基金）", "A major asset manager copies the BUIDL blueprint to credit (the first at-scale tokenized corporate-bond fund)"),
    },
    {
      id: "invoice", zh: "贸易发票", en: "Trade invoices",
      model: { law: 4, cus: 3, dat: 4, buy: 4 },
      why: {
        law: T("英国 ETDA 2023 让电子提单具备法律效力——柱子刚立起来。", "The UK ETDA 2023 gave electronic bills of lading legal force — the pillar just rose."),
        cus: T("单据托管在起步阶段，各家平台各行其是。", "Document custody is early; every platform does its own thing."),
        dat: T("短期现金流可测，违约率有历史数据。", "Short-dated cash flows are measurable, with historical default data."),
        buy: T("私募信贷基金常年缺标准化资产（阶段 3.5）。", "Private credit funds are perpetually short of standardized assets (Stage 3.5)."),
      },
      trig: T("主要贸易法域跟进 ETDA + 出现跨平台单据标准", "Major trade jurisdictions follow ETDA + a cross-platform document standard emerges"),
    },
    {
      id: "music", zh: "音乐版税", en: "Music royalties",
      model: { law: 3, cus: 3, dat: 2, buy: 2 },
      why: {
        law: T("版权转让法律成熟，但代币化包装尚无标准。", "Copyright assignment law is mature; the tokenized wrapper has no standard."),
        cus: T("收款权托管靠合同，缺持牌托管人。", "Collection rights are held by contract; licensed custodians are scarce."),
        dat: T("未来十年播放量与折现率都靠猜——最难的一根。", "Ten-year stream counts and discount rates are guesswork — the hardest pillar."),
        buy: T("买家是小众另类资产玩家。", "Buyers are a niche alternatives crowd."),
      },
      trig: T("出现被广泛接受的版税估值数据商（版税界的“彭博”）", "A widely accepted royalty-valuation data vendor emerges (a “Bloomberg” of royalties)"),
    },
    {
      id: "carbon", zh: "碳信用", en: "Carbon credits",
      model: { law: 2, cus: 1, dat: 2, buy: 3 },
      why: {
        law: T("信用的法律性质在各法域都含糊。", "The legal nature of a credit is ambiguous nearly everywhere."),
        cus: T("注册表拔线过一次，桥是断的（阶段 10.5）。", "The registry pulled the plug once; the bridge is broken (Stage 10.5)."),
        dat: T("质量与增量性争议不断，价格分层混乱。", "Quality and additionality are disputed; pricing is fragmented."),
        buy: T("企业净零承诺提供真实但周期性的需求。", "Corporate net-zero pledges give real but cyclical demand."),
      },
      trig: T("Verra 一类主流注册表官方支持代币化对接（而非被动容忍）", "A mainstream registry (Verra-class) officially supports tokenized issuance, not passive tolerance"),
    },
    {
      id: "gpu", zh: "GPU 算力", en: "GPU compute",
      model: { law: 3, cus: 2, dat: 2, buy: 2 },
      why: {
        law: T("拆开看是预付费服务合约，不是证券——反而简单。", "Unpacked, it's a prepaid service contract, not a security — which is simpler."),
        cus: T("“托管”的是机器可用性承诺，无法扣押。", "What's “custodied” is an availability promise; you can't seize it."),
        dat: T("算力价格波动剧烈，无公认基准曲线。", "Compute prices swing violently, with no accepted benchmark curve."),
        buy: T("买算力的人要的是算力本身，转让需求待验证。", "Compute buyers want compute; transferability demand is unproven."),
      },
      trig: T("出现可结算的算力现货/期货基准价（算力的“布伦特原油”）", "A settleable spot/futures benchmark for compute appears (compute's “Brent crude”)"),
    },
  ];

  const state = {};
  CANDS.forEach((c) => { state[c.id] = { law: 3, cus: 3, dat: 3, buy: 3 }; });
  let cur = CANDS[0].id, reveal = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🛰 可行性雷达 · 下一波会是谁", "🛰 Feasibility radar · who's next")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("挑一个候选资产，给它的四根柱子打分（0–5）：", "Pick a candidate and score its four pillars (0–5):")}</div>
        <div class="demo-switch" id="fr-cands"></div>
      </div>
      <div class="demo-block" id="fr-sliders"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="fr-reveal">${T("🔍 对比课程模型", "🔍 Compare with the course model")}</button>
        <button class="demo-btn" id="fr-reset">${T("↺ 全部重置", "↺ Reset all")}</button>
      </div>
      <div class="demo-block" id="fr-chart"></div>
      <div class="demo-block" id="fr-watch"></div>
      <p class="demo-tip">${T("预测不是猜热点——是盯着四根柱子，看哪根先立起来。<strong>分数会过时，触发事件不会</strong>：把它们抄进你自己的观察清单。", "Forecasting isn't guessing hot topics — it's watching the four pillars to see which rises next. <strong>Scores go stale; trigger events don't</strong> — copy them into your own watchlist.")}</p>
    </div>`;

  const candsEl = root.querySelector("#fr-cands");
  const slidersEl = root.querySelector("#fr-sliders");
  const chartEl = root.querySelector("#fr-chart");
  const watchEl = root.querySelector("#fr-watch");

  const total = (s) => AXES.reduce((a, x) => a + s[x.k], 0);
  const cand = (id) => CANDS.find((c) => c.id === id);

  function paintCands() {
    candsEl.innerHTML = CANDS.map((c) =>
      `<button class="demo-btn${c.id === cur ? " active" : ""}" data-c="${c.id}">${T(c.zh, c.en)}</button>`).join("");
    candsEl.querySelectorAll("[data-c]").forEach((b) =>
      b.addEventListener("click", () => { cur = b.dataset.c; paintCands(); paintSliders(); paintChart(); }));
  }

  function paintSliders() {
    const c = cand(cur);
    const s = state[cur];
    slidersEl.innerHTML = `<div class="demo-label" style="margin-bottom:6px">${T("你的评分：", "Your scores: ")}<b style="color:var(--orange-ink)">${T(c.zh, c.en)}</b></div>` +
      AXES.map((a) => {
        const mine = s[a.k], m = c.model[a.k];
        const gap = reveal ? Math.abs(mine - m) : 0;
        const col = !reveal ? "var(--muted)" : (gap === 0 ? "var(--green)" : gap >= 2 ? "var(--red)" : "var(--orange-ink)");
        return `
        <div style="margin:8px 0">
          <label class="demo-label" style="display:flex;justify-content:space-between;align-items:center">
            <span>${T(a.zh, a.en)}</span>
            <span style="font-family:var(--mono)">${T("你", "you")} <b>${mine}</b>${reveal ? ` · ${T("模型", "model")} <b style="color:${col}">${m}</b>` : ""}</span>
          </label>
          <input class="demo-slider" type="range" min="0" max="5" step="1" value="${mine}" data-a="${a.k}" style="width:100%" />
          ${reveal ? `<div class="demo-meta" style="font-size:11px;color:var(--muted);margin-top:2px">💬 ${c.why[a.k]}</div>` : ""}
        </div>`;
      }).join("") +
      `<div class="demo-label" style="margin-top:8px">${T("你的总分", "Your total")}: <b>${total(s)}</b> / 20${reveal ? ` &nbsp;·&nbsp; ${T("模型总分", "Model total")}: <b>${total(c.model)}</b> / 20` : ""}</div>
       <div class="demo-meta" style="margin-top:6px;color:var(--orange-ink)">🎯 ${T("触发事件", "Trigger event")}: ${c.trig}</div>`;
    slidersEl.querySelectorAll("[data-a]").forEach((inp) =>
      inp.addEventListener("input", (e) => { state[cur][inp.dataset.a] = parseInt(e.target.value, 10); paintSliders(); paintChart(); }));
  }

  function paintChart() {
    const rows = CANDS.map((c) => {
      const mine = total(state[c.id]), m = total(c.model);
      const bar = (v, color) => `<div style="height:9px;width:${(v / 20) * 100}%;background:${color};border-radius:5px"></div>`;
      return `
        <div style="margin:7px 0">
          <div class="demo-meta" style="display:flex;justify-content:space-between">
            <span style="color:${c.id === cur ? "var(--orange-ink)" : "var(--ink)"};font-weight:${c.id === cur ? 700 : 500}">${T(c.zh, c.en)}</span>
            <span style="font-family:var(--mono);color:var(--muted)">${mine}${reveal ? ` / ${m}` : ""}</span>
          </div>
          ${bar(mine, "var(--orange-line)")}
          ${reveal ? bar(m, "var(--green)") : ""}
        </div>`;
    }).join("");
    let agree = "";
    if (reveal) {
      let diff = 0;
      CANDS.forEach((c) => AXES.forEach((a) => { diff += Math.abs(state[c.id][a.k] - c.model[a.k]); }));
      const pct = Math.max(0, Math.round((1 - diff / (CANDS.length * AXES.length * 5)) * 100));
      agree = `<div class="done-banner" style="margin-top:10px">${T("你与课程模型的一致度", "Agreement with the course model")}: <b>${pct}%</b> ${T("（不一致的地方最值钱——去看那一轴的理由）", "(the disagreements are the valuable part — read that axis's reasoning)")}</div>`;
    }
    chartEl.innerHTML = `<div class="demo-label">${T("就绪度排行（橙=你的，绿=课程模型）", "Readiness ranking (orange = yours, green = course model)")}</div>${rows}${agree}`;
  }

  function paintWatch() {
    watchEl.innerHTML = `<div class="demo-label">${T("📋 你的观察清单（可复制）", "📋 Your watchlist (copyable)")}</div>
      <textarea readonly id="fr-list" style="width:100%;min-height:132px;font-family:var(--mono);font-size:11px;line-height:1.6;color:var(--ink);background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:8px">${
        CANDS.map((c) => `[ ] ${T(c.zh, c.en)} — ${c.trig}`).join("\n")}</textarea>
      <div class="demo-btns"><button class="demo-btn" id="fr-copy">${T("⧉ 全选以复制", "⧉ Select all to copy")}</button></div>`;
    watchEl.querySelector("#fr-copy").addEventListener("click", () => {
      const ta = watchEl.querySelector("#fr-list");
      ta.focus(); ta.select();
    });
  }

  root.querySelector("#fr-reveal").addEventListener("click", () => {
    reveal = !reveal;
    root.querySelector("#fr-reveal").classList.toggle("active", reveal);
    root.querySelector("#fr-reveal").textContent = reveal
      ? T("🙈 隐藏模型评分", "🙈 Hide the model's scores")
      : T("🔍 对比课程模型", "🔍 Compare with the course model");
    paintSliders(); paintChart();
  });
  root.querySelector("#fr-reset").addEventListener("click", () => {
    CANDS.forEach((c) => { state[c.id] = { law: 3, cus: 3, dat: 3, buy: 3 }; });
    paintSliders(); paintChart();
  });

  paintCands(); paintSliders(); paintChart(); paintWatch();
}
