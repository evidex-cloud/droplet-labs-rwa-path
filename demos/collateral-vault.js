// 交互演示：抵押品金库驾驶舱——存入代币化国债、借出 USDC、健康因子实时计算；
// 剧本“加密闪崩”对比 ETH 分钟级清算 vs RWA 天级赎回，激进 LTV 下产生坏账。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const COLL = 100000;        // 存入 10 万美元代币化国债
  const RWA_APY = 0.045;      // 抵押品年化 4.5%
  const LIQ_BUFFER = 0.05;    // 清算阈值 = LTV + 5pt
  let ltv = 0.75, borrowRate = 0.03, fastLane = false, day = 0, timer = null, crashed = false;

  const money = (v) => "$" + v.toLocaleString(undefined, { maximumFractionDigits: 0 });

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏦 抵押品金库驾驶舱 · 存入 10 万代币化国债", "🏦 Collateral vault cockpit · 100k tokenized T-bills deposited")}</div>
      <div class="demo-block">
        <label class="demo-label">${T("LTV（借款上限占抵押品比例）", "LTV (borrow cap vs collateral)")}：<b id="cv-ltvv">75%</b></label>
        <input type="range" id="cv-ltv" min="50" max="95" step="5" value="75" style="width:100%" />
        <div class="demo-btns" style="margin-top:4px">
          <button class="demo-btn" data-preset="75">${T("保守 75%", "Conservative 75%")}</button>
          <button class="demo-btn" data-preset="90">${T("激进 90%", "Aggressive 90%")}</button>
          <button class="demo-btn" id="cv-lane">${T("即时赎回通道：关", "Instant redemption rail: off")}</button>
        </div>
      </div>
      <div class="demo-block">
        <label class="demo-label">${T("稳定币借款利率", "Stablecoin borrow rate")}：<b id="cv-brv">3.0%</b></label>
        <input type="range" id="cv-br" min="10" max="120" step="5" value="30" style="width:100%" />
        <div id="cv-readout" style="font-family:var(--mono);font-size:12.5px;margin-top:6px"></div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="cv-crash">${T("⚡ 剧本：加密市场闪崩", "⚡ Scenario: crypto flash crash")}</button>
        <button class="demo-btn" id="cv-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="cv-crashbox"></div>
      <p class="demo-tip">${T("同一场闪崩：ETH 金库<strong>几分钟</strong>清算完毕，账清了；RWA 金库要等<strong>周一 NAV 窗口 + T+1</strong>——三天里债务在滚。激进 90% LTV 撑不过这三天（坏账），保守 75% 或即时赎回通道能撑住。<strong>缓冲垫不是保守，是全部的安全边际。</strong>", "Same crash: the ETH vault liquidates in <strong>minutes</strong> and the books clear; the RWA vault waits for <strong>Monday's NAV window + T+1</strong> — three days of compounding debt. A 90% LTV can't survive those days (bad debt); 75% or an instant-redemption rail can. <strong>The cushion isn't conservatism — it's the entire margin of safety.</strong>")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function paint() {
    const debt = COLL * ltv;
    const liqThreshold = Math.min(ltv + LIQ_BUFFER, 0.98);
    const hf = (COLL * liqThreshold) / debt;
    const netApy = (COLL * RWA_APY - debt * borrowRate) / COLL * 100;
    const hfColor = hf < 1.05 ? "var(--red)" : hf < 1.15 ? "var(--orange-ink)" : "var(--green)";
    $("#cv-readout").innerHTML = `
      ${T("抵押品", "Collateral")}: <b>${money(COLL)}</b> @ 4.5% ${T("年化，每天生息", "APY, accruing daily")}<br/>
      ${T("借出", "Borrowed")}: <b>${money(debt)}</b> @ ${(borrowRate * 100).toFixed(1)}% · ${T("清算阈值", "Liq. threshold")}: ${(liqThreshold * 100).toFixed(0)}%<br/>
      ${T("健康因子", "Health factor")}: <b style="color:${hfColor}">${hf.toFixed(3)}</b> ${hf < 1.05 ? T("← 一点风吹草动就触发清算", "← one nudge from liquidation") : ""}<br/>
      <span style="color:${netApy >= 0 ? "var(--green)" : "var(--red)"}">${T("套息净收益", "Carry net")}: ${netApy >= 0 ? "+" : ""}${netApy.toFixed(2)}% ${T("（抵押品收益 − 借款成本）", "(collateral yield − borrow cost)")}</span>`;
  }

  function crash() {
    if (timer) clearInterval(timer);
    crashed = true; day = 0;
    const debt0 = COLL * ltv;
    const steps = fastLane
      ? [T("周五 22:04 · 闪崩，健康因子跌破 1 → 清算触发", "Fri 22:04 · crash, health factor < 1 → liquidation fires"),
         T("周五 22:09 · 走即时赎回通道（USDC facility）——抵押品分钟级变现", "Fri 22:09 · instant-redemption rail (USDC facility) — collateral realized in minutes"),
         T("周五 22:11 · 债务还清，无坏账", "Fri 22:11 · debt repaid, no bad debt")]
      : [T("周五 22:04 · 闪崩，健康因子跌破 1 → 清算触发", "Fri 22:04 · crash, health factor < 1 → liquidation fires"),
         T("周五 22:06 · 清算人接手抵押品，但二级市场没有买家（阶段 9.1）", "Fri 22:06 · liquidator holds the collateral, but the secondary has no bids (Stage 9.1)"),
         T("周六–周日 · 一级窗口关闭，只能等——债务利息在滚", "Sat–Sun · primary window closed, only waiting — interest compounds"),
         T("周一 15:00 · 登记赎回，按当日 NAV", "Mon 15:00 · redemption filed at that day's NAV"),
         T("周二 · T+1 现金到账，清算结算", "Tue · T+1 cash lands, liquidation settles")];
    const days = fastLane ? 0.003 : 3;
    // 三天里：债务按危机期利率滚动，抵押品继续生息但紧急变现要打折
    const debtGrown = debt0 * (1 + (borrowRate * 4) * days / 365); // 危机期利率飙升 4 倍
    const recovered = COLL * (1 + RWA_APY * days / 365) * (fastLane ? 0.999 : 0.985); // 紧急变现折价
    const deficit = debtGrown - recovered;
    let html = `<div class="journey" style="margin-top:8px">` + steps.map((s, i) =>
      `<div class="jstep done"><div class="jn">${i + 1}</div><div><div class="jt">${s}</div></div></div>`).join("") + `</div>`;
    html += `<div class="demo-block" style="margin-top:6px;font-family:var(--mono);font-size:12.5px">
      ${T("清算耗时", "Time to liquidate")}: <b>${fastLane ? T("≈ 7 分钟", "≈ 7 min") : T("3 天（周五→周二）", "3 days (Fri→Tue)")}</b><br/>
      ${T("到账时债务", "Debt at settlement")}: ${money(debtGrown)} ${T("（危机期利率飙升）", "(crisis rates spiked)")}<br/>
      ${T("抵押品变现所得", "Collateral realized")}: ${money(recovered)}</div>`;
    html += deficit > 0
      ? `<div class="demo-warn" style="margin-top:6px"><b style="color:var(--red)">${T("💀 坏账", "💀 BAD DEBT")}: ${money(deficit)}</b> —— ${T(`LTV ${(ltv * 100).toFixed(0)}% 没有为“变现要三天”留下垫子，缺口由协议兜底、储户分摊。把 LTV 拉到 75% 或打开即时赎回通道再试一次。`, `At ${(ltv * 100).toFixed(0)}% LTV there was no cushion for “realization takes three days”; the shortfall is socialized across depositors. Retry at 75% LTV, or switch on the instant-redemption rail.`)}</div>`
      : `<div class="done-banner" style="margin-top:6px">${T(`✅ 撑住了：变现所得 ${money(recovered)} > 债务 ${money(debtGrown)}，安全边际 ${money(-deficit)}。${fastLane ? "即时赎回通道把“天”压成了“分钟”。" : "低 LTV 那块垫子买下了三天时间。"}`, `✅ Survived: ${money(recovered)} realized > ${money(debtGrown)} debt, margin ${money(-deficit)}. ${fastLane ? "The instant-redemption rail compressed days into minutes." : "The low-LTV cushion bought those three days."}`)}</div>`;
    html += `<div class="demo-block demo-meta" style="margin-top:6px">${T("对照组 · ETH 抵押金库：闪崩后 <b>4 分钟</b>拍卖 + 链上卖出完成，账清、无缺口——同一台清算机器，不同的抵押品时钟。", "Control · ETH-collateral vault: auctioned and sold on-chain <b>4 minutes</b> after the crash, books clear, no shortfall — same liquidation machine, different collateral clock.")}</div>`;
    $("#cv-crashbox").innerHTML = html;
  }

  $("#cv-ltv").addEventListener("input", (e) => {
    ltv = parseInt(e.target.value) / 100; $("#cv-ltvv").textContent = (ltv * 100).toFixed(0) + "%";
    root.querySelectorAll("[data-preset]").forEach((x) => x.classList.toggle("active", parseInt(x.dataset.preset) === Math.round(ltv * 100)));
    paint(); if (crashed) crash();
  });
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    ltv = parseInt(b.dataset.preset) / 100;
    $("#cv-ltv").value = String(Math.round(ltv * 100)); $("#cv-ltvv").textContent = (ltv * 100).toFixed(0) + "%";
    root.querySelectorAll("[data-preset]").forEach((x) => x.classList.toggle("active", x === b));
    paint(); if (crashed) crash();
  }));
  $("#cv-br").addEventListener("input", (e) => {
    borrowRate = parseInt(e.target.value) / 1000; $("#cv-brv").textContent = (borrowRate * 100).toFixed(1) + "%";
    paint(); if (crashed) crash();
  });
  $("#cv-lane").addEventListener("click", () => {
    fastLane = !fastLane;
    $("#cv-lane").textContent = fastLane ? T("即时赎回通道：开", "Instant redemption rail: on") : T("即时赎回通道：关", "Instant redemption rail: off");
    $("#cv-lane").classList.toggle("active", fastLane);
    if (crashed) crash();
  });
  $("#cv-crash").addEventListener("click", crash);
  $("#cv-reset").addEventListener("click", () => { crashed = false; $("#cv-crashbox").innerHTML = ""; });
  root.querySelector('[data-preset="75"]').classList.add("active");
  paint();
}
