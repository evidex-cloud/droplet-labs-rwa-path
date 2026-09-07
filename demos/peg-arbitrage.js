// 交互演示：套利游戏——你就是套利者。二级买卖 + 一级申赎，每走完一圈结算 P&L，
// 并把价格真的拉回 NAV；摩擦设置改变理论带宽；赎回暂停时套利环断裂，价格自由落体。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const NAV = 1.0000;
  const LOT = 10000;              // 每次操作 1 万份
  let price = 1.0000;             // 二级价格
  let tokens = 0, cash = 0, pnl = 0, loops = 0;
  let pending = null;             // 待结算的一级赎回/申购
  let friction = "daily";         // daily | quarterly | suspended
  let history = [];

  const F = {
    daily:     { fee: 0.0010, days: 1,  spread: 0.0005, elig: 0.0005, redeem: true,  sub: true,  label: T("日赎回 · 10bp 费 · T+1", "Daily redeem · 10bp fee · T+1") },
    quarterly: { fee: 0.0075, days: 90, spread: 0.0040, elig: 0.0300, redeem: true,  sub: true,  label: T("季度赎回 + 门槛 · 75bp 费 · 90 天", "Quarterly + gate · 75bp fee · 90 days") },
    suspended: { fee: 0.0010, days: 1,  spread: 0.0005, elig: 0.0005, redeem: false, sub: true,  label: T("⚠ 赎回暂停", "⚠ Redemptions suspended") },
  };

  const band = () => { const f = F[friction]; return f.fee + f.spread + f.elig + f.days * 0.00015; };
  const px = (v) => "$" + v.toFixed(4);
  const usd = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toFixed(2);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🎯 套利游戏 · 你就是那个把价格拉回 NAV 的人（NAV = $1.0000）", "🎯 The arbitrage game · you are the one pulling price back to NAV (NAV = $1.0000)")}</div>
      <div class="demo-switch">${T("摩擦设置：", "Friction: ")}
        <button class="demo-btn active" data-fr="daily">${T("日赎回国债基金", "Daily-redeem treasury fund")}</button>
        <button class="demo-btn" data-fr="quarterly">${T("季度+门槛私募信贷", "Quarterly + gated credit")}</button>
        <button class="demo-btn" data-fr="suspended">${T("赎回暂停", "Redemptions suspended")}</button>
      </div>
      <div class="demo-block">
        <div id="pa-chart"></div>
        <div id="pa-state" style="font-family:var(--mono);font-size:12.5px;margin-top:6px"></div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("二级市场（持有人 ↔ 持有人，含价差）", "Secondary (holder ↔ holder, spread applies)")}</div>
        <div class="demo-btns">
          <button class="demo-btn" id="pa-buy">${T("二级买入 1 万份", "Secondary buy 10k")}</button>
          <button class="demo-btn" id="pa-sell">${T("二级卖出 1 万份", "Secondary sell 10k")}</button>
        </div>
        <div class="demo-label" style="margin-top:8px">${T("一级市场（对手方 = 发行方，按 NAV，含费用与 T+n）", "Primary (counterparty = issuer, at NAV, fees + T+n)")}</div>
        <div class="demo-btns">
          <button class="demo-btn" id="pa-sub">${T("一级申购 1 万份", "Primary subscribe 10k")}</button>
          <button class="demo-btn" id="pa-red">${T("一级赎回 1 万份", "Primary redeem 10k")}</button>
          <button class="demo-btn" id="pa-tick">${T("⏭ 时间推进一天", "⏭ Advance one day")}</button>
        </div>
      </div>
      <div id="pa-log"></div>
      <p class="demo-tip">${T("每走完一圈，看两件事：<strong>你的 P&L</strong> 和<strong>价格被你拉近 NAV 多少</strong>——锚就是你干出来的。把摩擦切到“季度+门槛”，理论带宽立刻变宽、利润被吃掉；切到“赎回暂停”，回程腿消失，<strong>不存在任何有利可图的一圈</strong>，价格一路跌向恐惧定价的折价。锚 = 对下一次赎回的信心。", "After each completed lap watch two things: <strong>your P&amp;L</strong> and <strong>how far you pulled price toward NAV</strong> — you are the peg. Switch friction to “quarterly + gate” and the theoretical band widens while profit is eaten; switch to “suspended” and the return leg vanishes: <strong>no profitable lap exists</strong>, and price slides to a fear-priced discount. The peg = confidence in the next redemption window.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function drift() {
    // 随机游走；赎回暂停时价格单边下滑到恐惧定价
    if (!F[friction].redeem) price -= 0.004 + Math.random() * 0.010;
    else price += (Math.random() - 0.5) * 0.006;
    price = Math.max(0.55, Math.min(1.35, price));
  }

  function log(text, good) {
    history.unshift(`<div style="font-size:12px;color:${good ? "var(--green)" : "var(--ink)"};padding:2px 0">${text}</div>`);
    history = history.slice(0, 4);
    $("#pa-log").innerHTML = `<div class="demo-block" style="margin-top:8px">${history.join("")}</div>`;
  }

  function paint() {
    const f = F[friction], b = band();
    const dev = (price / NAV - 1) * 100;
    const inBand = Math.abs(price / NAV - 1) <= b;
    // 迷你图：NAV 线 + 带 + 当前价格点
    const y = (v) => 100 - Math.max(0, Math.min(1, (v - 0.55) / 0.8)) * 90;
    $("#pa-chart").innerHTML = `
      <svg viewBox="0 0 420 110" style="width:100%;height:auto" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="${y(NAV * (1 + b))}" width="380" height="${Math.max(2, y(NAV * (1 - b)) - y(NAV * (1 + b)))}" fill="var(--green-soft)"/>
        <line x1="30" y1="${y(NAV)}" x2="410" y2="${y(NAV)}" stroke="var(--orange-line)" stroke-width="1.4"/>
        <text x="4" y="${y(NAV) + 3}" font-size="8" fill="var(--orange-ink)">NAV</text>
        <circle cx="330" cy="${y(price)}" r="5" fill="${inBand ? "var(--green)" : "var(--red)"}"/>
        <text x="342" y="${y(price) + 4}" font-size="9" fill="var(--ink)">${px(price)}</text>
        <text x="30" y="14" font-size="9" fill="var(--muted)">${T("理论带宽", "Theoretical band")} ±${(b * 100).toFixed(2)}%</text>
      </svg>`;
    $("#pa-state").innerHTML = `
      ${T("摩擦", "Friction")}: ${f.label}<br/>
      ${T("二级价格", "Secondary price")}: <b style="color:${inBand ? "var(--green)" : "var(--red)"}">${px(price)}</b>
      （${dev >= 0 ? T("溢价", "premium") : T("折价", "discount")} ${Math.abs(dev).toFixed(2)}%）·
      ${inBand ? T("带内 ✅", "in band ✅") : T("出带 ⚠", "outside band ⚠")}<br/>
      ${T("持仓", "Position")}: ${tokens.toLocaleString()} ${T("份", "shares")} · ${T("已实现 P&L", "Realized P&L")}: <b style="color:${pnl >= 0 ? "var(--green)" : "var(--red)"}">${usd(pnl)}</b> · ${T("完成套利圈", "Loops closed")}: <b>${loops}</b>
      ${pending ? `<br/><span style="color:var(--orange-ink)">${T(`⏳ 一级${pending.kind === "redeem" ? "赎回" : "申购"}结算中：还剩 ${pending.left} 天（资金被占用，NAV 期间会动）`, `⏳ Primary ${pending.kind} settling: ${pending.left} day(s) left (capital tied up, NAV moves meanwhile)`)}</span>` : ""}
      ${!f.redeem ? `<br/><span style="color:var(--red)">${T("🚫 赎回暂停：套利环的回程腿被切断——买入再便宜也换不回 NAV。", "🚫 Redemptions suspended: the loop's return leg is cut — no matter how cheap you buy, you cannot convert back at NAV.")}</span>` : ""}`;
    $("#pa-red").disabled = !f.redeem || tokens < LOT || !!pending;
    $("#pa-sub").disabled = !!pending;
    $("#pa-sell").disabled = tokens < LOT;
  }

  function secondaryTrade(dir) {
    const f = F[friction];
    const fillPx = price * (1 + (dir === "buy" ? f.spread : -f.spread));
    const val = LOT * fillPx;
    if (dir === "buy") { tokens += LOT; cash -= val; price += 0.004; }
    else { tokens -= LOT; cash += val; price -= 0.004; }
    log(T(`二级${dir === "buy" ? "买入" : "卖出"} 1 万份 @ ${px(fillPx)}（含价差）→ 你的成交把价格推向 ${px(price)}——你的交易本身就是锚。`,
          `Secondary ${dir === "buy" ? "buy" : "sell"} 10k @ ${px(fillPx)} (spread included) → your fill nudges price to ${px(price)} — your trades ARE the peg.`), false);
    paint();
  }

  function primary(kind) {
    const f = F[friction];
    pending = { kind, left: f.days };
    log(T(`一级${kind === "redeem" ? "赎回" : "申购"}已登记：按 NAV ${px(NAV)}，费用 ${(f.fee * 100).toFixed(2)}%，需等待 ${f.days} 天结算——这段等待就是“时间风险”，也是带宽的主要来源。`,
          `Primary ${kind} filed: at NAV ${px(NAV)}, fee ${(f.fee * 100).toFixed(2)}%, settling in ${f.days} day(s) — that wait is the “time risk” that dominates band width.`), false);
    paint();
  }

  function tick() {
    const f = F[friction];
    if (pending) {
      pending.left -= 1;
      if (pending.left <= 0) {
        const gross = LOT * NAV, fee = gross * f.fee;
        if (pending.kind === "redeem") { tokens -= LOT; cash += gross - fee; price += 0.003; }
        else { tokens += LOT; cash -= gross + fee; price -= 0.003; }
        loops += 1;
        pnl = cash + tokens * price;
        log(T(`✅ 一级${pending.kind === "redeem" ? "赎回" : "申购"}结算完成（扣费 ${usd(fee)}）。第 ${loops} 圈闭合：累计 P&L ${usd(pnl)}；价格被拉向 NAV → ${px(price)}。`,
              `✅ Primary ${pending.kind} settled (fee ${usd(fee)}). Loop ${loops} closed: cumulative P&L ${usd(pnl)}; price pulled toward NAV → ${px(price)}.`), pnl >= 0);
        pending = null;
      }
    }
    drift();
    if (!F[friction].redeem && price < 0.80) {
      log(T(`价格 ${px(price)}：没有任何有利可图的一圈存在，买盘消失——现在定价的不是资产价值，是“对下一次赎回的信心”。`,
            `Price ${px(price)}: no profitable lap exists and bids evaporate — what's priced now isn't asset value but confidence in the next redemption.`), false);
    }
    paint();
  }

  root.querySelectorAll("[data-fr]").forEach((b) => b.addEventListener("click", () => {
    friction = b.dataset.fr; pending = null;
    root.querySelectorAll("[data-fr]").forEach((x) => x.classList.toggle("active", x.dataset.fr === friction));
    log(T(`切换摩擦设置 → ${F[friction].label}；理论带宽变为 ±${(band() * 100).toFixed(2)}%。`,
          `Friction switched → ${F[friction].label}; theoretical band is now ±${(band() * 100).toFixed(2)}%.`), false);
    paint();
  }));
  $("#pa-buy").addEventListener("click", () => secondaryTrade("buy"));
  $("#pa-sell").addEventListener("click", () => secondaryTrade("sell"));
  $("#pa-sub").addEventListener("click", () => primary("subscribe"));
  $("#pa-red").addEventListener("click", () => primary("redeem"));
  $("#pa-tick").addEventListener("click", tick);
  price = 0.9820; // 开局就有一个折价机会
  paint();
  log(T("开局：二级价格 $0.9820，低于 NAV $1.0000。想想套利环的两条腿——该先做哪一步？", "Opening: secondary at $0.9820, below NAV $1.0000. Think about the loop's two legs — which move comes first?"), false);
}
