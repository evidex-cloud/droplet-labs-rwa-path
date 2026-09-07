// 交互演示：T-bill 定价器（真实贴现公式）+ “谁吃掉了收益”——稳定币发行方 vs 代币化国债基金的利息分配对比。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  let tab = "pricer";
  let days = 182, disc = 5.0; // tab1：天数、贴现率 %
  let rate = 5.0; // tab2：市场利率 %
  const FACE = 1000, RESERVE = 1e9, FEE_BP = 30;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏛️ T-Bill 定价器 & 利率周期探索器", "🏛️ T-bill pricer & rate-cycle explorer")}</div>
      <div class="demo-switch">
        <button class="demo-btn" data-tab="pricer">${T("① 买一张 T-Bill", "① Buy a T-bill")}</button>
        <button class="demo-btn" data-tab="who">${T("② 谁吃掉了收益", "② Who eats the yield")}</button>
      </div>
      <div id="tb-body"></div>
      <p class="demo-tip">${T("页 ①：注意贴现率 5% 算出的真实收益（BEY）约 5.2%——报价口径处处有坑。页 ②：把利率拨到 1% 再拨回 5%，看代币化基金给持有人的那根柱子怎么塌方又回血——<strong>利率是 RWA 行业的潮水位</strong>。", "Tab ①: note how a 5% discount rate works out to a ~5.2% true yield (BEY) — quoting conventions are full of traps. Tab ②: drag the rate to 1% and back to 5%, and watch the holders' bar collapse and recover — <strong>interest rates are the RWA industry's tide level</strong>.")}</p>
    </div>`;

  const body = root.querySelector("#tb-body");
  const fmt = (v) => "$" + v.toLocaleString(en ? "en-US" : "zh-CN", { maximumFractionDigits: 0 });

  function paint() {
    root.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    if (tab === "pricer") {
      const d = disc / 100;
      const price = FACE * (1 - d * days / 360);
      const earn = FACE - price;
      const bey = (earn / price) * (365 / days) * 100;
      body.innerHTML = `
        <div class="demo-block">
          <label class="demo-label">${T("距到期天数", "Days to maturity")}: <b id="tb-d">${days}</b></label>
          <input class="demo-slider" id="tb-days" type="range" min="30" max="364" step="1" value="${days}" />
          <label class="demo-label">${T("贴现率", "Discount rate")}: <b id="tb-r">${disc.toFixed(1)}%</b></label>
          <input class="demo-slider" id="tb-disc" type="range" min="0.5" max="8" step="0.1" value="${disc}" />
        </div>
        <div class="demo-block">
          <div style="font-family:var(--mono);font-size:12px;color:var(--muted)">${T("买入价", "Price")} = 1000 × (1 − ${(d).toFixed(3)} × ${days}/360)</div>
          <div style="font-size:20px;font-weight:700;color:var(--orange-ink);margin:4px 0">$${price.toFixed(2)}</div>
          <div style="font-size:12px;color:var(--ink)">${T("到期收回面值 $1,000，赚", "Collect $1,000 face at maturity — earning")} <b style="color:var(--green)">$${earn.toFixed(2)}</b></div>
          <div style="font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:6px">BEY = (${earn.toFixed(2)}/${price.toFixed(2)}) × (365/${days}) = <b style="color:var(--ink)">${bey.toFixed(2)}%</b></div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px">${T(`贴现率 ${disc.toFixed(1)}% 的“真实收益”（债券等价收益率）是 ${bey.toFixed(2)}%——因为你的本金只有 $${price.toFixed(2)}，不是 $1,000。`, `A ${disc.toFixed(1)}% discount rate really yields ${bey.toFixed(2)}% (bond-equivalent) — because your capital at work is $${price.toFixed(2)}, not $1,000.`)}</div>
        </div>`;
      body.querySelector("#tb-days").addEventListener("input", (e) => { days = parseInt(e.target.value); paint(); });
      body.querySelector("#tb-disc").addEventListener("input", (e) => { disc = parseFloat(e.target.value); paint(); });
    } else {
      const r = rate / 100;
      const total = RESERVE * r;
      const fee = RESERVE * (FEE_BP / 10000);
      const toHolders = Math.max(0, total - fee);
      const maxBar = RESERVE * 0.055;
      const bar = (v, color) => `<div style="height:16px;width:${Math.max(1, (v / maxBar) * 100)}%;background:${color};border-radius:4px;opacity:.85"></div>`;
      body.innerHTML = `
        <div class="demo-block">
          <div class="demo-label">${T("$10 亿储备，全部买成 T-bill。市场利率：", "A $1B reserve, fully in T-bills. Market rate:")} <b id="tb-mr">${rate.toFixed(1)}%</b></div>
          <input class="demo-slider" id="tb-rate" type="range" min="0" max="6" step="0.25" value="${rate}" />
          <div style="font-size:12px;color:var(--muted)">${T("年利息总额", "Total annual interest")}: <b style="color:var(--ink)">${fmt(total)}</b></div>
        </div>
        <div class="demo-block">
          <div class="demo-label">💰 ${T("模式一：稳定币发行方（利息全归自己，付持有人 0%）", "Model 1: stablecoin issuer (keeps all interest, pays holders 0%)")}</div>
          <div style="display:flex;align-items:center;gap:8px;margin:4px 0">${bar(total, "var(--red)")}<span style="font-family:var(--mono);font-size:12px;color:var(--red);white-space:nowrap">${fmt(total)} ${T("→ 发行方", "→ issuer")}</span></div>
          <div style="display:flex;align-items:center;gap:8px">${bar(0.0001, "var(--line)")}<span style="font-family:var(--mono);font-size:12px;color:var(--muted);white-space:nowrap">$0 ${T("→ 持有人", "→ holders")}</span></div>
        </div>
        <div class="demo-block">
          <div class="demo-label">🪙 ${T("模式二：代币化国债基金（收 30bp，其余给持有人）", "Model 2: tokenized Treasury fund (keeps 30bp, passes the rest)")}</div>
          <div style="display:flex;align-items:center;gap:8px;margin:4px 0">${bar(fee, "var(--orange-ink)")}<span style="font-family:var(--mono);font-size:12px;color:var(--orange-ink);white-space:nowrap">${fmt(Math.min(fee, total))} ${T("→ 基金（费）", "→ fund (fee)")}</span></div>
          <div style="display:flex;align-items:center;gap:8px">${bar(toHolders, "var(--green)")}<span style="font-family:var(--mono);font-size:12px;color:var(--green);white-space:nowrap">${fmt(toHolders)} ${T("→ 持有人", "→ holders")} (${Math.max(0, rate - 0.3).toFixed(2)}%)</span></div>
          <div style="font-size:12px;color:var(--muted);margin-top:6px">${rate <= 0.5
            ? T("⚠ 利率趴在地板上：扣掉 30bp 后持有人几乎一无所得——零利率时代这个品类根本不存在。", "⚠ Rates on the floor: after 30bp of fees, holders get almost nothing — in the zero-rate era this category simply didn't exist.")
            : T("利率越高，“把收益还给持有人”的卖点越硬——这就是 2022–23 加息催生代币化国债爆发的原因。", "The higher the rate, the stronger the “yield back to holders” pitch — exactly why the 2022–23 hikes ignited the tokenized-Treasury boom.")}</div>
        </div>`;
      body.querySelector("#tb-rate").addEventListener("input", (e) => { rate = parseFloat(e.target.value); paint(); });
    }
  }

  root.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { tab = b.dataset.tab; paint(); }));
  paint();
}
