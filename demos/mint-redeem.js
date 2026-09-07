// 交互演示：稳定币铸造/赎回机器——申购、赎回、恐慌砸盘，然后看套利者怎么把锚拉回来。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 状态：供应量(百万枚)、储备(百万美元, 80%国债/20%现金)、市场价、套利者累计利润
  let supply = 10, price = 1.0, arbProfit = 0;
  let log = [];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏭 铸造—储备—赎回机器", "🏭 The mint–reserve–redeem machine")}</div>
      <div class="demo-block" style="display:flex;gap:16px;flex-wrap:wrap">
        <div style="flex:1;min-width:120px">
          <div class="demo-label">${T("市场价", "Market price")}</div>
          <div id="mr-price" style="font-family:var(--mono);font-size:1.5em;font-weight:700"></div>
          <div id="mr-gauge" style="height:6px;border-radius:3px;background:var(--surface-2);margin-top:4px;overflow:hidden"><div id="mr-bar" style="height:100%;width:50%;background:var(--green)"></div></div>
        </div>
        <div style="flex:1;min-width:120px">
          <div class="demo-label">${T("链上供应量", "On-chain supply")}</div>
          <div id="mr-supply" style="font-family:var(--mono);font-size:1.5em;font-weight:700;color:var(--ink)"></div>
        </div>
        <div style="flex:1;min-width:150px">
          <div class="demo-label">${T("储备账本", "Reserve ledger")}</div>
          <div id="mr-res" style="font-family:var(--mono);font-size:0.95em;color:var(--ink)"></div>
        </div>
        <div style="flex:1;min-width:120px">
          <div class="demo-label">${T("套利者累计利润", "Arb profit to date")}</div>
          <div id="mr-arb" style="font-family:var(--mono);font-size:1.5em;font-weight:700;color:var(--orange-ink)"></div>
        </div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="mr-mint">${T("🏦 机构申购 $1M", "🏦 Institution mints $1M")}</button>
        <button class="demo-btn" id="mr-redeem">${T("🏦 机构赎回 $1M", "🏦 Institution redeems $1M")}</button>
        <button class="demo-btn" id="mr-panic">${T("😱 市场恐慌卖出", "😱 Market panic-sells")}</button>
        <button class="demo-btn" id="mr-arb-btn">${T("⚡ 套利者出手", "⚡ Arbitrageur strikes")}</button>
      </div>
      <div class="demo-block"><div class="demo-label">${T("事件日志", "Event log")}</div><div id="mr-log" style="font-family:var(--mono);font-size:0.85em;line-height:1.7"></div></div>
      <p class="demo-tip">${T("先点几次“恐慌卖出”把价格砸下去，再点“套利者出手”——注意套利的三步循环：<strong>低价买入 → 按 $1 赎回 → 供应缩小</strong>，价格被拉回锚。锚不是“承诺”，是“套利通道通畅”；阶段 4.3 里通道被周末堵住，你会看到锚怎么松。", "Panic-sell a few times to knock the price down, then let the arbitrageur strike — watch the three-step loop: <strong>buy cheap → redeem at $1 → supply shrinks</strong>, and the price snaps back. The peg isn't a promise, it's an open arbitrage channel; in Stage 4.3 the channel gets jammed over a weekend and you'll watch the peg slip.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const fmt = (v) => "$" + v.toFixed(3);

  function addLog(msg, color) {
    log.unshift(`<span style="color:${color || "var(--muted)"}">${msg}</span>`);
    log = log.slice(0, 6);
    $("#mr-log").innerHTML = log.join("<br>");
  }

  function paint() {
    const p = $("#mr-price");
    p.textContent = fmt(price);
    p.style.color = price < 0.995 ? "var(--red)" : price > 1.005 ? "var(--orange-ink)" : "var(--green)";
    const pct = Math.max(0, Math.min(100, (price - 0.9) / 0.2 * 100));
    $("#mr-bar").style.width = pct + "%";
    $("#mr-bar").style.background = price < 0.995 ? "var(--red)" : "var(--green)";
    $("#mr-supply").textContent = supply.toFixed(1) + "M";
    $("#mr-res").innerHTML =
      T("国债", "T-bills") + ": $" + (supply * 0.8).toFixed(1) + "M<br>" +
      T("现金", "Cash") + ": $" + (supply * 0.2).toFixed(1) + "M<br>" +
      "<span style='color:var(--green)'>" + T("储备率 100%", "backing 100%") + "</span>";
    $("#mr-arb").textContent = "$" + Math.round(arbProfit * 1000) + "k";
  }

  $("#mr-mint").addEventListener("click", () => {
    supply += 1;
    price = Math.min(1.02, price + 0.002);
    addLog(T("电汇 $1M 到账 → mint() 铸出 1M 枚，储备 +$1M", "$1M wire clears → mint() creates 1M tokens, reserves +$1M"), "var(--green)");
    paint();
  });

  $("#mr-redeem").addEventListener("click", () => {
    if (supply < 1.5) { addLog(T("供应量太低，先申购一些", "Supply too low — mint some first")); return; }
    supply -= 1;
    addLog(T("收回 1M 枚 → burn() 销毁，电汇 $1M 出账，储备 −$1M", "1M tokens returned → burn(), $1M wired out, reserves −$1M"), "var(--muted)");
    paint();
  });

  $("#mr-panic").addEventListener("click", () => {
    price = Math.max(0.9, price - 0.03);
    addLog(T("😱 恐慌抛售！散户只能在二级市场砸盘卖出 → 市场价 " + fmt(price), "😱 Panic! Retail can only dump into the market → price " + fmt(price)), "var(--red)");
    paint();
  });

  $("#mr-arb-btn").addEventListener("click", () => {
    if (price < 0.999) {
      if (supply < 1.5) { addLog(T("供应量太低，无法演示", "Supply too low to demo")); return; }
      const buyAt = price;
      const profit = (1 - price) * 1;
      arbProfit += profit;
      supply -= 1;
      price = 1 - (1 - price) * 0.25;
      addLog(
        T("⚡ 套利循环：① 按 " + fmt(buyAt) + " 买入 1M 枚 → ② 向发行方按 $1.000 赎回 → ③ 供应 −1M，价差被吃掉，利润 +$" + Math.round(profit * 1000) + "k",
          "⚡ Arb loop: ① buy 1M tokens at " + fmt(buyAt) + " → ② redeem at $1.000 with the issuer → ③ supply −1M, gap eaten, profit +$" + Math.round(profit * 1000) + "k"),
        "var(--orange-ink)");
      if (price >= 0.999) addLog(T("✅ 价格回锚 " + fmt(price) + "——通道通畅时，偏离就是免费午餐", "✅ Back on peg at " + fmt(price) + " — with the channel open, deviations are free lunches"), "var(--green)");
    } else if (price > 1.001) {
      const profit = (price - 1) * 1;
      arbProfit += profit;
      supply += 1;
      price = 1 + (price - 1) * 0.25;
      addLog(T("⚡ 反向套利：铸 1M 枚按溢价卖出，供应 +1M，利润 +$" + Math.round(profit * 1000) + "k", "⚡ Reverse arb: mint 1M, sell at a premium, supply +1M, profit +$" + Math.round(profit * 1000) + "k"), "var(--orange-ink)");
    } else {
      addLog(T("价格贴着 $1，无利可套——这正是锚定“正常”的样子", "Price hugs $1 — nothing to arb. That's what a healthy peg looks like"));
    }
    paint();
  });

  addLog(T("初始状态：10M 枚流通，储备 $10M，价格 $1.000", "Start: 10M tokens, $10M reserves, price $1.000"));
  paint();
}
