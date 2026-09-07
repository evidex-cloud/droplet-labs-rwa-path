// 交互演示：USDC×SVB 脱锚模拟器——沿着周四到周一的真实时间线，拨恐慌、看套利通道开关如何决定锚的命运。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 时间线：每一步设定“银行是否开门”“自动恐慌值”，字幕对应真实事件
  const steps = [
    { label: T("周四", "Thu"), banks: true, panic: 25, cap: T("周四 3/9：VC 群聊刷屏，一天 420 亿美元提款涌向 SVB——链下挤兑，光速进行。", "Thu Mar 9: VC group chats erupt; $42B of withdrawals hit SVB in one day — an off-chain run at light speed.") },
    { label: T("周五早", "Fri am"), banks: true, panic: 45, cap: T("周五 3/10 上午：监管关闭 SVB，FDIC 接管。市场开始追问：谁的钱在里面？", "Fri Mar 10, morning: regulators close SVB; FDIC takes over. The market starts asking: whose money is inside?") },
    { label: T("周五夜", "Fri night"), banks: false, panic: 90, cap: T("周五深夜：Circle 披露 33 亿美元储备在 SVB。银行已下班——套利循环最后一环断裂。", "Fri late night: Circle discloses $3.3B of reserves at SVB. Banks are closed — the arb loop's last link snaps.") },
    { label: T("周六", "Sat"), banks: false, panic: 90, cap: T("周六：恐慌全速蔓延，Coinbase 暂停周末兑换。试试拨动恐慌滑块——注意无论怎么拨，锚都回不去。", "Sat: panic at full speed; Coinbase suspends weekend conversions. Try the panic slider — notice no setting repegs the price.") },
    { label: T("周日", "Sun"), banks: false, panic: 85, cap: T("周日：华盛顿在开会。“官方兜底”按钮出现了——按不按，周一的世界完全不同。", "Sun: Washington is in session. The “official backstop” button appears — pressing it changes what Monday looks like.") },
    { label: T("周一", "Mon"), banks: true, panic: 35, cap: T("周一 3/13：银行开门，电汇恢复，套利循环重新接通——低买、按 $1 赎回，价差被迅速吃平。", "Mon Mar 13: banks open, wires flow, the arb loop reconnects — buy low, redeem at $1, the gap gets eaten fast.") },
  ];

  let idx = 0, panic = steps[0].panic, bailout = false;
  let history = [];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("📉 脱锚模拟器：USDC × SVB，周四 → 周一", "📉 Depeg simulator: USDC × SVB, Thu → Mon")}</div>
      <div class="demo-switch" id="ds-tl"></div>
      <div class="demo-block">
        <div id="ds-cap" style="font-size:0.92em;color:var(--ink)"></div>
      </div>
      <div class="demo-block" style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
        <div style="flex:1;min-width:180px">
          <label class="demo-label">${T("恐慌程度", "Panic level")}：<b id="ds-pv"></b></label>
          <input class="demo-slider" id="ds-panic" type="range" min="0" max="100" step="5" />
        </div>
        <div style="min-width:150px">
          <div class="demo-label">${T("赎回通道（银行电汇）", "Redemption rail (bank wires)")}</div>
          <div id="ds-banks" style="font-weight:700"></div>
        </div>
        <button class="demo-btn" id="ds-bail" style="display:none">${T("🏛 官方兜底（系统性风险例外）", "🏛 Official backstop (systemic risk exception)")}</button>
      </div>
      <div class="demo-block">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <div class="demo-label">${T("USDC 市场价", "USDC market price")}</div>
          <div id="ds-price" style="font-family:var(--mono);font-size:1.6em;font-weight:700"></div>
        </div>
        <svg id="ds-chart" viewBox="0 0 300 60" style="width:100%;height:60px"></svg>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="ds-next">${T("▶ 推进时间线", "▶ Advance timeline")}</button>
        <button class="demo-btn" id="ds-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="ds-done"></div>
      <p class="demo-tip">${T("周末试着把恐慌拨到最低——价格仍回不到 $1，因为<strong>套利产能 = 0</strong>：银行关门，赎回换不回美元。这次脱锚不是“代码坏了”，是“链下承诺的管道坏了”——RWA 的风险从来在链下那半边。", "Over the weekend, try dialing panic to the minimum — the price still won't reach $1, because <strong>arb capacity = 0</strong>: banks are closed, so redemptions can't turn into dollars. This depeg wasn't “broken code” — it was broken off-chain plumbing. RWA risk always lives on the off-chain half.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  // 价格模型：price = 1 − (基础不确定性 + 挤兑折价×恐慌) × (1 − 套利产能)
  function model() {
    const s = steps[idx];
    const arbCap = s.banks ? 1 : 0;
    const haircut = bailout ? 0 : 0.08; // SVB 敞口 33亿/400亿 ≈ 8%
    const base = s.banks ? 0 : 0.02;    // 通道关闭本身就有折价
    const p = 1 - (base + (0.05 + haircut) * (panic / 100)) * (1 - 0.92 * arbCap);
    return Math.max(0.85, Math.min(1.0, p));
  }

  function chart() {
    const w = 300, h = 60, n = history.length;
    if (n < 2) { $("#ds-chart").innerHTML = ""; return; }
    const pts = history.map((v, i) => {
      const x = (i / (n - 1)) * (w - 10) + 5;
      const y = h - 5 - ((v - 0.85) / 0.15) * (h - 10);
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    const pegY = h - 5 - ((1 - 0.85) / 0.15) * (h - 10);
    $("#ds-chart").innerHTML =
      `<line x1="5" y1="${pegY}" x2="${w - 5}" y2="${pegY}" stroke="var(--line)" stroke-dasharray="3 3"/>` +
      `<text x="${w - 8}" y="${pegY - 3}" text-anchor="end" font-size="7" fill="var(--muted)">$1.00</text>` +
      `<polyline points="${pts}" fill="none" stroke="var(--red)" stroke-width="1.5"/>`;
  }

  function paint() {
    const s = steps[idx];
    const price = model();
    history.push(price);
    if (history.length > 60) history.shift();

    $("#ds-tl").innerHTML = steps.map((st, i) =>
      `<button class="demo-btn${i === idx ? " active" : ""}" disabled style="opacity:${i <= idx ? 1 : 0.4}">${st.label}</button>`).join("");
    $("#ds-cap").textContent = s.cap;
    $("#ds-pv").textContent = panic + "%";
    $("#ds-panic").value = panic;
    $("#ds-banks").innerHTML = s.banks
      ? `<span style="color:var(--green)">🟢 ${T("开门——套利者可完成循环", "open — arbs can complete the loop")}</span>`
      : `<span style="color:var(--red)">🔴 ${T("关门——套利产能 = 0", "closed — arb capacity = 0")}</span>`;
    const pe = $("#ds-price");
    pe.textContent = "$" + price.toFixed(3);
    pe.style.color = price < 0.995 ? "var(--red)" : "var(--green)";
    $("#ds-bail").style.display = idx === 4 && !bailout ? "" : "none";
    $("#ds-next").disabled = idx >= steps.length - 1;
    chart();

    if (idx === steps.length - 1) {
      $("#ds-done").innerHTML = bailout
        ? `<div class="done-banner">${T("✅ 周一：兜底声明 + 电汇恢复 → 套利循环接通，价格数日内回锚。解开死结的不是代码，是财政部的一纸声明。", "✅ Monday: backstop + wires flowing → the arb loop reconnects and the price repegs within days. The knot was cut by a Treasury statement, not by code.")}</div>`
        : `<div class="demo-warn">${T("⚠ 周一银行开门，套利恢复了一部分——但没有兜底声明，33 亿美元敞口的不确定性仍压着价格。重来一次，周日按下兜底试试。", "⚠ Monday's open banks restore some arbitrage — but without the backstop, the $3.3B uncertainty still weighs on the price. Reset and try pressing the backstop on Sunday.")}</div>`;
    } else {
      $("#ds-done").innerHTML = "";
    }
  }

  $("#ds-panic").addEventListener("input", (e) => { panic = parseInt(e.target.value); paint(); });
  $("#ds-next").addEventListener("click", () => {
    if (idx < steps.length - 1) {
      idx++;
      panic = bailout && idx === 5 ? 15 : steps[idx].panic;
      paint();
    }
  });
  $("#ds-bail").addEventListener("click", () => {
    bailout = true;
    panic = Math.min(panic, 50);
    paint();
  });
  $("#ds-reset").addEventListener("click", () => { idx = 0; panic = steps[0].panic; bailout = false; history = []; paint(); });

  paint();
}
