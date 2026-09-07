// 交互演示：AMM 实验室——真实 x·y=k 数学：价格冲击、90 天 LVR 放血、锚定 NAV 曲线与喂价延迟、KYC 池深度。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const DRIFT = 0.00013; // 每日生息 +0.013%
  let kyc = false, mode = "dumb", delay = 0, size = 10000, simHTML = "";

  const reserves = () => (kyc ? 20000 : 100000); // KYC 池：LP 集合被砍 → 深度 1/5
  const fmt = (v, d = 0) => v.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🧪 AMM 实验室 · TBF/USDC 池（每日生息 +0.013%）", "🧪 AMM lab · TBF/USDC pool (asset accrues +0.013%/day)")}</div>
      <div class="demo-switch">
        <button class="demo-btn active" data-mode="dumb">${T("恒定乘积 x·y=k", "Constant product x·y=k")}</button>
        <button class="demo-btn" data-mode="anchored">${T("锚定 NAV 的曲线", "NAV-anchored curve")}</button>
        <button class="demo-btn" id="ap-kyc">${T("KYC 池：关", "KYC pool: off")}</button>
      </div>
      <div class="demo-block">
        <div class="demo-label" id="ap-poolinfo"></div>
        <label class="demo-label">${T("买入 TBF 数量", "Buy size (TBF)")}：<b id="ap-size">10,000</b></label>
        <input type="range" id="ap-slider" min="1000" max="30000" step="1000" value="10000" style="width:100%" />
        <div id="ap-trade" style="font-family:var(--mono);font-size:12.5px;margin-top:6px"></div>
      </div>
      <div class="demo-block" id="ap-delayblock" style="display:none">
        <label class="demo-label">${T("喂价延迟", "Feed delay")}：<b id="ap-delayv">0</b> ${T("分钟", "min")}</label>
        <input type="range" id="ap-delay" min="0" max="60" step="5" value="0" style="width:100%" />
        <div class="demo-meta" style="color:var(--muted)">${T("NAV 每天 10:00 场外更新；延迟期间，知情者可按旧价扫走锚点附近的集中深度（简化模型）。", "NAV updates off-chain at 10:00 daily; during the lag, the informed sweep the depth concentrated at the stale peg (simplified model).")}</div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("LP 视角：把 50/50 存入池子，跑 90 天（每天套利者把池价拉回公允价）", "LP view: deposit 50/50, run 90 days (arbs re-peg the pool to fair value daily)")}</div>
        <div class="demo-btns"><button class="demo-btn" id="ap-run">${T("▶ 跑 90 天", "▶ Run 90 days")}</button></div>
        <div id="ap-sim"></div>
      </div>
      <p class="demo-tip">${T("注意三件事：① 傻池子里 LP 的 TBF <strong>只减不增</strong>——升值的资产被套利者天天低价搬走（LVR），而鬼城池的手续费≈0，盖不住；② 换锚定曲线止血，但把<strong>喂价延迟</strong>拉大，抢跑损失比 LVR 更凶；③ 开 KYC 池，同一笔单，滑点 5 倍——<strong>流动性是“谁被允许参与”的问题</strong>。", "Watch three things: ① in the dumb pool the LP's TBF <strong>only ever shrinks</strong> — arbs haul the appreciating asset away at stale prices daily (LVR), and a ghost-town pool's fees ≈ 0 can't cover it; ② the anchored curve stops the bleed, but crank the <strong>feed delay</strong> and front-running losses dwarf LVR; ③ toggle the KYC pool and the same trade slips 5× — <strong>liquidity is a “who may participate” problem</strong>.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function paintTrade() {
    const R = reserves();
    $("#ap-poolinfo").textContent = T(`池子储备：${fmt(R)} TBF × ${fmt(R)} USDC（k = ${fmt(R * R)}）`, `Pool reserves: ${fmt(R)} TBF × ${fmt(R)} USDC (k = ${fmt(R * R)})`);
    $("#ap-size").textContent = fmt(size);
    const box = $("#ap-trade");
    if (size >= R) {
      box.innerHTML = `<span style="color:var(--red)">${T("⚠ 想买的量 ≥ 池内全部 TBF——恒定乘积下价格趋于无穷，根本成交不了。", "⚠ Size ≥ the pool's entire TBF — under constant product the price goes to infinity; the trade cannot fill.")}</span>`;
      return;
    }
    // x·y=k 真实计算
    const k = R * R, newX = R - size, newY = k / newX, pay = newY - R, avg = pay / size, impact = (avg / 1 - 1) * 100;
    if (mode === "dumb") {
      box.innerHTML = `${T("付出", "Pay")}: <b>${fmt(pay, 0)} USDC</b> · ${T("均价", "Avg price")}: <b>$${avg.toFixed(4)}</b> · <span style="color:${impact > 2 ? "var(--red)" : "var(--orange-ink)"}">${T("价格冲击", "Price impact")}: +${impact.toFixed(2)}%</span>${kyc ? `<div style="color:var(--red);margin-top:4px">${T("KYC 池：LP 从百万人缩到几百人，深度 1/5 → 同一笔单，冲击约 5 倍。", "KYC pool: LPs shrink from millions to hundreds, depth ÷5 → same order, ~5× the impact.")}</div>` : ""}`;
    } else {
      const band = Math.round(R * 0.6);
      const ok = size <= band;
      box.innerHTML = ok
        ? `${T("按 NAV±带内报价成交", "Filled inside the NAV± band")}: <b>${fmt(size * 1.0005, 0)} USDC</b> · ${T("均价", "Avg")}: <b>$1.0005</b> · <span style="color:var(--green)">${T("冲击 ≈ 0.05%（深度集中在锚附近）", "impact ≈ 0.05% (depth packed at the peg)")}</span>`
        : `<span style="color:var(--red)">${T(`⚠ 超出带内深度（≈${fmt(band)} TBF）——锚定曲线只在 NAV 附近有深度，出带就断崖。`, `⚠ Exceeds in-band depth (≈${fmt(band)} TBF) — an anchored curve only has depth near NAV; beyond the band it cliffs.`)}</span>`;
    }
  }

  function runSim() {
    const R = reserves(), k = R * R, P = Math.pow(1 + DRIFT, 90);
    const holdVal = R * P + R; // 不入池：一半 TBF 吃满 90 天漂移 + 一半 USDC
    let html;
    if (mode === "dumb") {
      const poolVal = 2 * Math.sqrt(k * P), endTBF = Math.sqrt(k / P), lvr = holdVal - poolVal;
      html = `
        <div class="demo-meta">${T("单纯持有（基准）", "Just hold (benchmark)")}: <b>$${fmt(holdVal, 0)}</b> · ${T("LP 头寸", "LP position")}: <b>$${fmt(poolVal, 0)}</b></div>
        <div class="demo-meta">${T("剩余 TBF", "TBF left")}: ${fmt(endTBF, 0)} / ${fmt(R)} —— ${T("升值的那边被套利者搬走了", "the appreciating side got hauled off by arbs")}</div>
        <div style="color:var(--red);font-weight:700">${T("累计 LVR 放血", "Cumulative LVR bleed")}: −$${lvr.toFixed(2)} ${T("（全部进了套利者口袋）", "(all of it into arb pockets)")}</div>
        <div class="demo-meta" style="color:var(--muted)">${T("手续费收入：≈ $0——鬼城池没有自然流量，只有天天来收漂移税的套利单。数额虽小，方向永远对你不利，且随波动与年限放大。", "Fee income: ≈ $0 — a ghost-town pool has no organic flow, only the daily drift-tax arb. Small in size, but never in your favor — and it scales with volatility and time.")}</div>`;
    } else {
      const snipe = 0.6 * R * DRIFT * Math.min(delay / 30, 1) * 90;
      html = `
        <div class="demo-meta">${T("锚定曲线：池价每天跟着 NAV 喂价走 → 漂移套利空间 = 0，LVR 止血 ✅", "Anchored curve: the pool tracks the NAV feed daily → drift arbitrage = 0, LVR stopped ✅")}</div>
        ${delay > 0
          ? `<div style="color:var(--red);font-weight:700">${T(`但喂价延迟 ${delay} 分钟 → 90 天被抢跑累计：−$${snipe.toFixed(2)}`, `But with a ${delay}-min feed lag → 90-day front-run losses: −$${snipe.toFixed(2)}`)}</div><div class="demo-meta" style="color:var(--muted)">${T("深度越集中，旧价被扫时损失越大——池子只和喂价一样新鲜（阶段 8.2）。", "The more concentrated the depth, the worse a stale-price sweep — the pool is only as fresh as its feed (Stage 8.2).")}</div>`
          : `<div style="color:var(--green);font-weight:700">${T("喂价零延迟：无抢跑损失——前提是预言机永远又快又对（阶段 8.1 会泼冷水）。", "Zero feed lag: no front-run loss — assuming the oracle is always fast and right (Stage 8.1 pours cold water).")}</div>`}`;
    }
    simHTML = `<div style="margin-top:6px">${html}</div>`;
    $("#ap-sim").innerHTML = simHTML;
  }

  root.querySelectorAll("[data-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      mode = b.dataset.mode; simHTML = "";
      root.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("active", x.dataset.mode === mode));
      $("#ap-delayblock").style.display = mode === "anchored" ? "" : "none";
      $("#ap-sim").innerHTML = ""; paintTrade();
    }));
  $("#ap-kyc").addEventListener("click", () => {
    kyc = !kyc;
    $("#ap-kyc").textContent = kyc ? T("KYC 池：开（LP 受限）", "KYC pool: on (LPs capped)") : T("KYC 池：关", "KYC pool: off");
    $("#ap-kyc").classList.toggle("active", kyc);
    $("#ap-sim").innerHTML = ""; paintTrade();
  });
  $("#ap-slider").addEventListener("input", (e) => { size = parseInt(e.target.value); paintTrade(); });
  $("#ap-delay").addEventListener("input", (e) => { delay = parseInt(e.target.value); $("#ap-delayv").textContent = delay; if (simHTML) runSim(); });
  $("#ap-run").addEventListener("click", runSim);
  paintTrade();
}
