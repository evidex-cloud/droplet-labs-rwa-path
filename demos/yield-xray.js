// 交互演示：收益率 X 光机——输入广告收益率，用组件滑杆解释它，实时看“残差”条；再做可持续性压力测试。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const COMPS = [
    { k: "base", label: T("基准利率", "Base rate"), max: 8, col: "var(--green)", note: T("短期国债（阶段 3.2）", "Short T-bills (Stage 3.2)") },
    { k: "spread", label: T("信用利差", "Credit spread"), max: 12, col: "var(--orange-ink)", note: T("违约概率 × 损失率（阶段 10.3）", "Default prob × loss severity (Stage 10.3)") },
    { k: "illiq", label: T("流动性溢价", "Illiquidity premium"), max: 6, col: "var(--orange-ink)", note: T("锁定期与闸门的补偿（阶段 3.5）", "Pay for lockups & gates (Stage 3.5)") },
    { k: "lev", label: T("杠杆", "Leverage"), max: 15, col: "var(--red)", note: T("放大收益，也放大归零速度（阶段 9.3）", "Amplifies yield and wipeout speed (Stage 9.3)") },
    { k: "emis", label: T("代币补贴", "Token incentives"), max: 15, col: "var(--red)", note: T("按构造有限——写上到期日", "Finite by construction — write the expiry date") },
    { k: "fees", label: T("− 费用堆栈", "− Fee stack"), max: 3, col: "var(--muted)", note: T("管理费 + 包装叠加 + 价差（阶段 10.2）", "Mgmt + stacked wrappers + spreads (Stage 10.2)") },
  ];

  const PRESETS = {
    tbill: { apy: 4.8, v: { base: 5.1, spread: 0, illiq: 0, lev: 0, emis: 0, fees: 0.3 },
      name: T("① 代币化国债 4.8%", "① Tokenized Treasury 4.8%"),
      say: T("残差 0 ✓ 无聊而诚实：它不创造收益，它搬运收益，然后诚实扣掉搬运费。", "Residual 0 ✓ boring and honest: it doesn't create yield, it transports it and honestly deducts the shipping.") },
    credit: { apy: 9, v: { base: 4.5, spread: 4, illiq: 1, lev: 0, emis: 0, fees: 0.5 },
      name: T("② 私募信贷池 9%", "② Private credit pool 9%"),
      say: T("残差 0 ✓ 但只完成一半：4% 利差在 70% 回收率下可承受约 13% 违约；回收率掉到 30% 就只剩约 5.7%——去查这个池子的历史。", "Residual 0 ✓ but half done: a 4% spread survives ~13% defaults at 70% recovery, only ~5.7% at 30% — go check this pool's history.") },
    fake: { apy: 15, v: { base: 5, spread: 0, illiq: 0, lev: 0, emis: 0, fees: 0 },
      name: T("③ “稳定安全”15%", "③ “Stable & safe” 15%"),
      say: T("残差 10% —— 只能靠加“杠杆”或“代币补贴”块补平。试着拖动它们：能补平，说明这 10% 有名字；补不平，那名字就是你的本金。", "Residual 10% — only the leverage or incentives blocks can close it. Try dragging them: if it closes, the 10% has a name; if not, the name is your principal.") },
    scam: { apy: 30, v: { base: 5, spread: 0, illiq: 0, lev: 0, emis: 0, fees: 0 },
      name: T("④ 任何 30%", "④ Anything at 30%"),
      say: T("不必拆：合法 RWA 资产类别在不加杠杆下没有可持续的 30%。这是阶段 12.3 的秒杀项，不是分析题。", "Don't decompose: no legal RWA class sustainably yields 30% unlevered. A Stage 12.3 kill criterion, not an analysis problem.") },
  };

  let apy = 4.8, v = Object.assign({}, PRESETS.tbill.v), shock = null;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🩻 收益率 X 光机 · 把广告数字拆成有名字的几块", "🩻 Yield X-ray · break the advertised number into named parts")}</div>
      <div class="demo-btns" id="yx-presets">${Object.keys(PRESETS).map((k) => `<button class="demo-btn" data-p="${k}">${PRESETS[k].name}</button>`).join("")}</div>
      <div class="demo-block">
        <label class="demo-label">${T("广告收益率", "Advertised yield")}：<b id="yx-apy">4.8%</b></label>
        <input class="demo-slider" id="yx-apy-r" type="range" min="0" max="30" step="0.1" value="4.8" style="width:100%" />
      </div>
      <div class="demo-block" id="yx-comps"></div>
      <div class="demo-block" id="yx-bar"></div>
      <div class="demo-switch">${T("压力测试：", "Stress test: ")}
        <button class="demo-btn" data-s="rate">${T("基准 −300bp", "Base −300bp")}</button>
        <button class="demo-btn" data-s="emis">${T("补贴归零", "Incentives → 0")}</button>
        <button class="demo-btn" data-s="def">${T("违约翻倍（利差减半）", "Defaults 2× (spread halved)")}</button>
        <button class="demo-btn" data-s="none">${T("↺ 平时", "↺ Calm")}</button>
      </div>
      <div id="yx-note"></div>
      <p class="demo-tip">${T("收益率是一道加法题——<strong>加不平的部分，就是你没被告知的那部分</strong>。如果你找不到收益的来源，你就是收益的来源。", "A yield is an addition problem — <strong>the part that doesn't add up is the part you weren't told</strong>. If you can't find the source of the yield, you are the source of the yield.")}</p>
    </div>`;

  const compsEl = root.querySelector("#yx-comps"), barEl = root.querySelector("#yx-bar"), noteEl = root.querySelector("#yx-note");
  compsEl.innerHTML = COMPS.map((c) => `
    <div style="margin:6px 0">
      <label class="demo-label" style="color:${c.col}">${c.label}：<b data-val="${c.k}">0.0%</b> <span style="color:var(--muted);font-weight:400">· ${c.note}</span></label>
      <input class="demo-slider" data-sl="${c.k}" type="range" min="0" max="${c.max}" step="0.1" value="0" style="width:100%" />
    </div>`).join("");

  function shocked() {
    const w = Object.assign({}, v);
    if (shock === "rate") w.base = Math.max(0, w.base - 3);
    if (shock === "emis") w.emis = 0;
    if (shock === "def") w.spread = w.spread / 2;
    return w;
  }

  function paint() {
    const w = shocked();
    const explained = w.base + w.spread + w.illiq + w.lev + w.emis - w.fees;
    const resid = apy - explained;
    COMPS.forEach((c) => {
      root.querySelector(`[data-val="${c.k}"]`).textContent = v[c.k].toFixed(1) + "%";
      root.querySelector(`[data-sl="${c.k}"]`).value = v[c.k];
    });
    root.querySelector("#yx-apy").textContent = apy.toFixed(1) + "%";
    root.querySelector("#yx-apy-r").value = apy;

    const scale = Math.max(apy, explained, 1);
    const seg = COMPS.filter((c) => c.k !== "fees" && w[c.k] > 0)
      .map((c) => `<div style="width:${(w[c.k] / scale) * 100}%;background:${c.col};opacity:.75"></div>`).join("");
    const rcol = resid > 5 ? "var(--red)" : resid > 2 ? "var(--orange-ink)" : "var(--green)";
    const msg = resid < -0.05
      ? T("⚠ 残差为负：支出的比赚到的多——这是庞氏后期的形状，闸门倒计时开始。", "⚠ Negative residual: paying out more than it earns — the late-Ponzi shape; the countdown to a gate has begun.")
      : resid <= 2 ? T("✓ 残差在估算误差内：这个收益率说得通。", "✓ Residual within estimation error: this yield adds up.")
      : resid <= 5 ? T("⚠ 残差 2–5%：有一块你还没搞懂，搞懂再决定。", "⚠ Residual 2–5%: there's a block you don't understand yet — understand it first.")
      : T("🚩 残差 > 5%：未披露的杠杆、即将到期的补贴，或者新钱付旧钱。", "🚩 Residual > 5%: undisclosed leverage, expiring incentives, or new money paying old money.");

    barEl.innerHTML = `
      <div class="demo-label">${T("已解释", "Explained")} <b>${explained.toFixed(1)}%</b> ${T("／广告", "／ advertised")} <b>${apy.toFixed(1)}%</b>${w.fees > 0 ? ` <span style="color:var(--muted)">(${T("已扣费用", "fees deducted")} ${w.fees.toFixed(1)}%)</span>` : ""}</div>
      <div style="display:flex;height:22px;border:1px solid var(--line);border-radius:4px;overflow:hidden;margin:6px 0">${seg}</div>
      <div class="demo-label" style="color:${rcol};font-weight:700">${T("残差", "Residual")} = ${resid.toFixed(1)}%</div>
      <div style="height:22px;border:1px solid var(--line);border-radius:4px;overflow:hidden;background:var(--surface-2)"><div style="height:100%;width:${Math.min(100, Math.abs(resid) / scale * 100)}%;background:${rcol};opacity:.7"></div></div>
      <div style="font-size:12.5px;color:${rcol};margin-top:6px;font-weight:600">${msg}</div>`;
  }

  compsEl.addEventListener("input", (e) => {
    const k = e.target.dataset.sl; if (!k) return;
    v[k] = parseFloat(e.target.value); paint();
  });
  root.querySelector("#yx-apy-r").addEventListener("input", (e) => { apy = parseFloat(e.target.value); paint(); });
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
    const p = PRESETS[b.dataset.p]; apy = p.apy; v = Object.assign({}, p.v); shock = null;
    root.querySelectorAll("[data-p]").forEach((x) => x.classList.toggle("active", x === b));
    root.querySelectorAll("[data-s]").forEach((x) => x.classList.remove("active"));
    noteEl.innerHTML = `<div class="demo-block" style="border-left:3px solid var(--orange-line)"><div style="font-size:12.5px;color:var(--ink);line-height:1.6">${p.say}</div></div>`;
    paint();
  }));
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => {
    shock = b.dataset.s === "none" ? null : b.dataset.s;
    root.querySelectorAll("[data-s]").forEach((x) => x.classList.toggle("active", x === b && shock));
    paint();
  }));

  root.querySelector('[data-p="tbill"]').classList.add("active");
  noteEl.innerHTML = `<div class="demo-block" style="border-left:3px solid var(--orange-line)"><div style="font-size:12.5px;color:var(--ink);line-height:1.6">${PRESETS.tbill.say}</div></div>`;
  paint();
}
