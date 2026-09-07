// 交互演示：同一枚 TBF 代币的两个市场——一级按 NAV 申赎（有闸门），二级薄订单簿（有价差）。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const NAV = 1.0842;
  const AMT = 50000; // 每次操作 5 万份
  const books = {
    normal: {
      bids: [[1.0810, 20000], [1.0780, 15000], [1.0700, 30000]],
      asks: [[1.0900, 10000], [1.0960, 25000]],
    },
    gated: {
      bids: [[1.0300, 10000], [0.9800, 25000], [0.9500, 40000]],
      asks: [[1.0880, 5000], [1.0950, 20000]],
    },
  };
  let scen = "weekday"; // weekday | sunday | gated
  let eligible = true;
  let msg = "";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏛 两个市场 · 同一枚 TBF 代币（NAV = $1.0842）", "🏛 Two markets · the same TBF token (NAV = $1.0842)")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("任务：① 用最便宜的方式买入 5 万份；② 周日紧急卖出 5 万份。", "Tasks: ① acquire 50k shares the cheapest way; ② exit 50k shares urgently on a Sunday.")}</div>
      </div>
      <div class="demo-switch">${T("场景：", "Scenario: ")}
        <button class="demo-btn active" data-scen="weekday">${T("工作日 14:00", "Weekday 14:00")}</button>
        <button class="demo-btn" data-scen="sunday">${T("周日", "Sunday")}</button>
        <button class="demo-btn" data-scen="gated">${T("⚠ 赎回暂停", "⚠ Redemptions gated")}</button>
        <button class="demo-btn" id="tm-elig">${T("✓ 合格投资者", "✓ Eligible investor")}</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="demo-block" id="tm-primary"></div>
        <div class="demo-block" id="tm-secondary"></div>
      </div>
      <div id="tm-result"></div>
      <p class="demo-tip">${T("一级窗口开着时，它就是<strong>报价恒等于 NAV 的完美做市商</strong>——二级的宽价差没人光顾。切到“周日”或“赎回暂停”再试：二级价差就是“现在就要”的价格，而赎回被关时买盘会<strong>跳空下坠</strong>（阶段 9.4 细讲）。", "While the primary window is open it's a <strong>perfect market maker quoting exactly NAV</strong> — nobody pays the secondary's wide spread. Switch to “Sunday” or “gated” and try again: the spread is the price of “right now”, and when redemptions close the bids <strong>gap down</strong> (Stage 9.4 explains).")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function fill(levels, qty) {
    let left = qty, cost = 0, got = 0;
    for (const [p, size] of levels) {
      const take = Math.min(left, size);
      cost += take * p; got += take; left -= take;
      if (left <= 0) break;
    }
    return { avg: got ? cost / got : 0, got, cost, partial: got < qty };
  }

  function paint() {
    const primaryOpen = scen === "weekday";
    const redeemOpen = primaryOpen && scen !== "gated";
    const book = books[scen === "gated" ? "gated" : "normal"];

    $("#tm-primary").innerHTML = `
      <div class="demo-label">${T("一级市场 · 对手方 = 发行方", "Primary · counterparty = issuer")}</div>
      <div style="font-family:var(--mono);font-size:13px;color:var(--ink);margin:4px 0">${T("价格 = NAV = $1.0842（算出，无价差）", "Price = NAV = $1.0842 (computed, no spread)")}</div>
      <div class="demo-meta" style="color:var(--muted)">
        ${eligible ? "✅" : "🚫"} ${T("资格（QP）", "Eligibility (QP)")} ·
        ${T("最低 $10 万", "$100k min")} ·
        ${scen === "weekday" ? "✅ " + T("15:00 截止前", "before 15:00 cutoff") : "🚫 " + T("窗口关闭", "window closed")} ·
        ${T("赎回 T+1 到账", "redeem settles T+1")}
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="tm-sub" ${primaryOpen && eligible ? "" : "disabled"}>${T("申购 5 万份", "Subscribe 50k")}</button>
        <button class="demo-btn" id="tm-red" ${redeemOpen && eligible ? "" : "disabled"}>${T("赎回 5 万份", "Redeem 50k")}</button>
      </div>
      ${scen === "gated" ? `<div class="demo-warn">${T("⚠ 发行方公告：赎回暂停——套利环断裂", "⚠ Issuer notice: redemptions suspended — the arb loop is cut")}</div>` : ""}`;

    const rows = (arr, color) => arr.map(([p, s]) => `<div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:12px"><span style="color:${color}">$${p.toFixed(4)}</span><span style="color:var(--muted)">${(s / 1000)}k</span></div>`).join("");
    $("#tm-secondary").innerHTML = `
      <div class="demo-label">${T("二级市场 · 对手方 = 其他持有人（薄订单簿）", "Secondary · counterparty = other holders (thin book)")}</div>
      <div style="margin:4px 0">${rows(book.asks.slice().reverse(), "var(--red)")}
      <div style="text-align:center;font-size:11px;color:var(--muted);padding:2px 0">— NAV $1.0842 —</div>
      ${rows(book.bids, "var(--green)")}</div>
      <div class="demo-btns">
        <button class="demo-btn" id="tm-buy">${T("市价买 5 万份", "Market buy 50k")}</button>
        <button class="demo-btn" id="tm-sell">${T("市价卖 5 万份", "Market sell 50k")}</button>
      </div>`;

    $("#tm-result").innerHTML = msg;
    $("#tm-elig").textContent = eligible ? T("✓ 合格投资者", "✓ Eligible investor") : T("✗ 未通过资格", "✗ Not eligible");

    const on = (id, fn) => { const b = $(id); if (b && !b.disabled) b.addEventListener("click", fn); };
    on("#tm-sub", () => report(T(`✅ 一级申购成功：$${(AMT * NAV).toLocaleString()} 换 5 万份，价格恰好 = NAV，零滑点。这是“最便宜买入”的正确答案。`, `✅ Primary subscription: $${(AMT * NAV).toLocaleString()} for 50k shares at exactly NAV, zero slippage. The correct answer to “acquire cheapest.”`), true));
    on("#tm-red", () => report(T(`✅ 一级赎回登记：按 NAV 拿回 $${(AMT * NAV).toLocaleString()}，T+1 到账——便宜，但要等。`, `✅ Primary redemption booked: $${(AMT * NAV).toLocaleString()} at NAV, settling T+1 — cheap, but you wait.`), true));
    on("#tm-buy", () => {
      const f = fill(book.asks, AMT);
      const prem = ((f.avg / NAV - 1) * 100).toFixed(2);
      report(T(`二级买入：吃掉卖单 ${(f.got / 1000)}k 份，均价 $${f.avg.toFixed(4)}（较 NAV 溢价 ${prem}%）${f.partial ? "——簿子太薄，只成交了 " + (f.got / 1000) + "k，剩下的挂不上" : ""}。${scen === "weekday" && eligible ? "一级窗口开着——你多付了溢价！" : "一级关门，这是“现在就要”的价格。"}`, `Secondary buy: swept ${(f.got / 1000)}k from the asks at avg $${f.avg.toFixed(4)} (${prem}% over NAV)${f.partial ? " — book too thin, only " + (f.got / 1000) + "k filled" : ""}. ${scen === "weekday" && eligible ? "The primary window was open — you overpaid the premium!" : "Primary is closed; this is the price of “right now.”"}`), false);
    });
    on("#tm-sell", () => {
      const f = fill(book.bids, AMT);
      const disc = ((1 - f.avg / NAV) * 100).toFixed(2);
      report(T(`二级卖出：砸穿买单，均价 $${f.avg.toFixed(4)}（较 NAV 折价 ${disc}%）。${scen === "gated" ? "赎回暂停 → 买盘跳空，折价飙升——市场在给“下一次赎回的信心”定价。" : scen === "sunday" ? "周日一级关门——折价就是紧急流动性的价格。任务②完成。" : "工作日一级开着，按 NAV 赎回本可拿更多。"}`, `Secondary sell: punched through the bids at avg $${f.avg.toFixed(4)} (${disc}% below NAV). ${scen === "gated" ? "Redemptions gated → bids gapped down; the discount now prices confidence in the next redemption window." : scen === "sunday" ? "Sunday, primary closed — the discount is the price of urgent liquidity. Task ② done." : "The primary was open; redeeming at NAV would have paid more."}`), false);
    });
  }

  function report(text, good) {
    msg = good ? `<div class="done-banner" style="margin-top:8px">${text}</div>` : `<div class="demo-block" style="margin-top:8px;color:var(--ink)">${text}</div>`;
    paint();
  }

  root.querySelectorAll("[data-scen]").forEach((b) =>
    b.addEventListener("click", () => {
      scen = b.dataset.scen; msg = "";
      root.querySelectorAll("[data-scen]").forEach((x) => x.classList.toggle("active", x.dataset.scen === scen));
      paint();
    }));
  $("#tm-elig").addEventListener("click", () => { eligible = !eligible; msg = ""; paint(); });
  paint();
}
