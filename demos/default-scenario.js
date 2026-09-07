// 交互演示：违约走查——$10M 分层信贷池，拨亏损滑杆看清算瀑布的实时数学；再步进走完违约时间线（以月计，不是以块计）。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const POOL = 10, SEN = 8, JUN = 2;
  let lossPct = 20, shown = 0;

  const timeline = [
    { t: T("违约事件", "Event of default"), d: T("到期未付 / 担保率跌破下限——担保代理人确认并宣布", "Missed payment / collateral ratio breaches the floor — the collateral agent confirms & declares"), dur: T("第 0 天", "Day 0") },
    { t: T("宽限期", "Grace period"), d: T("给借款方最后的补救窗口（补足担保、付清欠款）", "The borrower's last window to cure (top up collateral, pay arrears)"), dur: T("+5–30 天", "+5–30 days") },
    { t: T("加速到期", "Acceleration"), d: T("全部债务立即到期应付——分期约定作废", "All debt becomes immediately due in full — schedules void"), dur: T("+1–2 周", "+1–2 weeks") },
    { t: T("抵押品处置", "Collateral disposal"), d: T("担保代理人没收并变卖担保品（国债快，贷款/地产慢）", "The agent seizes & liquidates (Treasuries fast; loans/real estate slow)"), dur: T("+1–6 个月", "+1–6 months") },
    { t: T("分配", "Distribution"), d: T("按瀑布分层派发：优先层拿满，次级层拿剩余", "Waterfall payout: senior filled first, junior takes what's left"), dur: T("+2–8 周", "+2–8 weeks") },
    { t: T("剩余追索", "Residual recourse"), d: T("缺口部分向发行方 / 担保人继续追偿——跨境诉讼以年计", "Chasing the shortfall from issuer/guarantors — cross-border litigation runs on years"), dur: T("+1–3 年", "+1–3 years") },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🌊 违约走查：$10M 分层池的瀑布与时间线", "🌊 Default walkthrough: a $10M tranched pool's waterfall & timeline")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("结构：优先层 $8M（约定 8%）＋ 次级层 $2M（约定 15%）——亏损自下而上吞噬", "Structure: senior $8M (8% promised) + junior $2M (15% promised) — losses eat bottom-up")}</div>
        <label class="demo-label">${T("资产亏损严重度", "Loss severity")}：<b id="ds-loss">20%</b>（<span id="ds-lossusd">$2.0M</span>）</label>
        <input class="demo-slider" id="ds-slider" type="range" min="0" max="100" step="5" value="20" />
      </div>
      <div id="ds-water"></div>
      <div class="demo-block" style="margin-top:10px">
        <div class="demo-label">${T("然后呢？违约时间线（以月计，不是以块计）", "Then what? The default timeline (months, not blocks)")}</div>
        <div class="journey" id="ds-steps"></div>
        <div class="demo-btns">
          <button class="demo-btn" id="ds-next">${T("▶ 下一步", "▶ Next step")}</button>
          <button class="demo-btn" id="ds-reset">${T("↺ 重来", "↺ Reset")}</button>
        </div>
      </div>
      <p class="demo-tip">${T("收益率写在最上面，追索路径写在第 87 页——<strong>专家先读第 87 页</strong>。拨到 20%：次级层正好全灭、优先层毫发无损——次级层的厚度就是优先层的安全垫。再看时间线：链上转账以秒计，<strong>追索以年计</strong>。", "The yield is printed at the top; the recourse path is on page 87 — <strong>experts read page 87 first</strong>. Slide to 20%: junior is wiped exactly as senior stays whole — junior's thickness IS senior's cushion. Then read the timeline: transfers take seconds, <strong>recourse takes years</strong>.")}</p>
    </div>`;

  const water = root.querySelector("#ds-water");
  const stepsEl = root.querySelector("#ds-steps");
  const nextBtn = root.querySelector("#ds-next");

  function money(v) { return "$" + v.toFixed(1) + "M"; }

  function calc() {
    const remaining = POOL * (1 - lossPct / 100);
    const senBack = Math.min(SEN, remaining);
    const junBack = Math.max(0, remaining - SEN);
    const senLoss = (senBack / SEN - 1) * 100;
    const junLoss = (junBack / JUN - 1) * 100;
    root.querySelector("#ds-loss").textContent = lossPct + "%";
    root.querySelector("#ds-lossusd").textContent = money(POOL * lossPct / 100);

    function bar(label, promised, back, lossP, col) {
      const pct = Math.max(0, Math.round((back / promised) * 100));
      return `<div style="margin:6px 0">
        <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--ink);font-weight:600">${label}</span>
          <span style="color:${lossP < 0 ? "var(--red)" : "var(--green)"};font-weight:700">${T("拿回", "recovers")} ${money(back)} · ${lossP >= 0 ? "0%" : lossP.toFixed(1) + "%"}</span></div>
        <div style="height:14px;border-radius:7px;background:var(--red-soft);overflow:hidden;border:1px solid var(--line)">
          <div style="height:100%;width:${pct}%;background:${col}"></div>
        </div></div>`;
    }

    water.innerHTML = `<div class="demo-block" style="margin:0">
      <div style="font-size:12px;color:var(--muted);margin-bottom:4px">${T("清算后剩余可分配", "Left to distribute after liquidation")}：<b style="color:var(--ink)">${money(remaining)}</b> ${T("（瀑布：优先层先拿满，次级层拿剩余）", "(waterfall: senior fills first, junior takes the rest)")}</div>
      ${bar(T("优先层 $8M", "Senior $8M"), SEN, senBack, senLoss, "var(--green)")}
      ${bar(T("次级层 $2M（肉盾）", "Junior $2M (the shield)"), JUN, junBack, junLoss, "var(--orange-ink)")}
      ${junBack <= 0 && lossPct > 0 ? `<div class="demo-warn" style="margin-top:6px;font-size:12px">${T("次级层全灭。", "Junior wiped out.")}${senLoss < 0 ? T(" 优先层也开始失血——安全垫已击穿。", " Senior is bleeding too — the cushion is breached.") : T(" 优先层仍完好：这就是 20% 安全垫的含义。", " Senior still whole: that's what a 20% cushion means.")}</div>` : ""}
    </div>`;
  }

  function paintSteps() {
    let html = "";
    for (let i = 0; i < shown; i++) {
      const s = timeline[i];
      html += `<div class="jstep done"><div class="jn">${i + 1}</div><div>
        <div class="jt">${s.t} <span style="color:var(--orange-ink);font-size:11px;font-weight:700">⏱ ${s.dur}</span></div>
        <div class="jd">${s.d}</div></div></div>`;
    }
    if (shown >= timeline.length) html += `<div class="done-banner" style="margin:8px 0 0">${T("⏳ 全程走完：以月和年计——这期间你的资金完全冻结。", "⏳ Full path complete: months and years — your funds frozen throughout.")}</div>`;
    stepsEl.innerHTML = html;
    nextBtn.disabled = shown >= timeline.length;
    nextBtn.textContent = shown === 0 ? T("▶ 宣布违约", "▶ Declare default") : shown >= timeline.length ? T("✓ 完成", "✓ Done") : T("▶ 下一步", "▶ Next step");
  }

  root.querySelector("#ds-slider").addEventListener("input", (e) => { lossPct = parseInt(e.target.value); calc(); });
  nextBtn.addEventListener("click", () => { if (shown < timeline.length) shown++; paintSteps(); });
  root.querySelector("#ds-reset").addEventListener("click", () => { shown = 0; paintSteps(); });

  calc();
  paintSteps();
}
