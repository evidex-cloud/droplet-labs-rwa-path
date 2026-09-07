// 交互演示：把一栋 10 万美元的出租屋代币化，看周租滴落、现实事件砸盘、卖出测试揭穿“流动性幻觉”。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const $ = (v) => "$" + Math.round(v).toLocaleString("en-US");

  // 基础账本：$100k 房 · 月租 $800 · 物业 $80 · 税+保险 $220 → 净 $500/月
  const HOUSE = 100000, TOKENS = 2000, MINE = 20, NET_MO = 500;
  let step = 0, capLoss = 0, opsLoss = 0, mgrGone = false, heloc = false;

  const EVENTS = [
    { id: "roof", label: T("🕳 屋顶漏水 −$8,000", "🕳 Roof leak −$8,000"), cap: 8000, ops: 0 },
    { id: "vacancy", label: T("📦 租客退租 2 个月 −$1,600", "📦 Tenant leaves, 2 mo vacant −$1,600"), cap: 0, ops: 1600 },
    { id: "fine", label: T("🏛 市政罚单 −$2,500", "🏛 City fine −$2,500"), cap: 0, ops: 2500 },
    { id: "mgr", label: T("👻 物业公司失联（租金停发）", "👻 Property manager goes dark (rent halts)"), cap: 0, ops: 0, gone: true },
  ];
  const fired = new Set();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏚 地产碎片机 · 与现实对账", "🏚 Property fractionalizer · vs reality")}</div>
      <div class="journey" id="pf-steps"></div>
      <div class="demo-btns" id="pf-nav"></div>
      <p class="demo-tip">${T("把楼切成两千片，买家并不会多两千个——<strong>“可转让”与“卖得掉”隔着一整个市场</strong>。再注意：每个现实事件都直接砍收益线——链上收益是链下运营的奴隶。", "Slice a building into 2,000 pieces and you don't get 2,000 more buyers — <strong>“transferable” and “sellable” are a whole market apart</strong>. And notice: every reality event cuts the yield line directly — on-chain income is a slave of off-chain ops.")}</p>
    </div>`;

  const stepsEl = root.querySelector("#pf-steps");
  const navEl = root.querySelector("#pf-nav");

  function nav() {
    return NET_MO * 12 - opsLoss - (mgrGone ? 3000 : 0);
  }

  function paint() {
    const yearNet = mgrGone ? 0 : NET_MO * 12 - opsLoss;
    const houseNAV = HOUSE - capLoss;
    const navTok = houseNAV / TOKENS;
    const yieldPct = ((yearNet - capLoss) / HOUSE) * 100;
    const wk = (yearNet / 52) * (MINE / TOKENS);
    let html = "";

    // 步骤 1：代币化
    html += `<div class="jstep done"><div class="jn">1</div><div>
      <div class="jt">${T("代币化一栋 $100,000 的底特律出租屋", "Tokenize a $100,000 Detroit rental")}</div>
      <div class="jd">${step >= 1 ? T("✅ 系列 LLC 已注册 → 房契过户给 LLC → 铸造 2,000 枚代币（$50/枚）→ 你认购 <b>20 枚</b>。请求权链：你 → 代币 → LLC 权益 → 房产。", "✅ Series LLC formed → deed transferred to LLC → 2,000 tokens minted ($50 each) → you buy <b>20</b>. Claim chain: you → token → LLC units → house.") : T("点「▶ 开始代币化」", "Press “▶ Tokenize”")}</div></div></div>`;

    // 步骤 2：租金滴落
    if (step >= 2) html += `<div class="jstep done"><div class="jn">2</div><div>
      <div class="jt">${T("周租滴落（真实算术）", "Weekly rent drip (real math)")}</div>
      <div class="jd">${T("月租 $800 − 物业 $80 − 税/保险 $220 = 净 $500/月 → $6,000/年 ≈ 6% 毛收益。", "Rent $800 − mgmt $80 − tax/ins $220 = net $500/mo → $6,000/yr ≈ 6% gross.")}<br>
      ${T("当前年净流", "Current yearly net")}: <b style="color:${yearNet > 0 ? "var(--green)" : "var(--red)"}">${$(yearNet)}</b> · ${T("你的 20 枚每周", "Your 20 tokens/week")}: <b>${mgrGone ? "$0.00 ⛔" : "$" + wk.toFixed(2)} USDC</b> · ${T("综合收益率", "All-in yield")}: <b style="color:${yieldPct >= 0 ? "var(--green)" : "var(--red)"}">${yieldPct.toFixed(1)}%</b> · NAV/枚: <b>$${navTok.toFixed(2)}</b></div></div></div>`;

    // 步骤 3：现实事件
    if (step >= 3) html += `<div class="jstep done"><div class="jn">3</div><div>
      <div class="jt">${T("现实事件（每个都打在链下，疼在链上）", "Reality events (each hits off-chain, hurts on-chain)")}</div>
      <div class="jd"><span class="demo-btns" style="display:inline-flex;flex-wrap:wrap;gap:6px">${EVENTS.map((e) => `<button class="demo-btn${fired.has(e.id) ? " active" : ""}" data-ev="${e.id}" ${fired.has(e.id) ? "disabled" : ""}>${e.label}</button>`).join("")}</span>
      ${fired.size ? `<br>${T("已发生", "Fired")}: ${fired.size} · ${T("资本损失", "Capital loss")} ${$(capLoss)} · ${T("现金流损失", "Cash-flow loss")} ${$(opsLoss)}${mgrGone ? T("　⚠ 物业失联：合约完好，租金为零。", " ⚠ Manager gone: contract fine, rent zero.") : ""}` : ""}</div></div></div>`;

    // 步骤 4：卖出测试
    if (step >= 4) {
      let sellHtml;
      if (!heloc) {
        const bids = [
          { n: 30, p: navTok * 0.99 },
          { n: 30, p: navTok * 0.978 },
          { n: 20, p: navTok * 0.96 },
        ];
        const rest = 500 - 80;
        const restP = navTok * 0.75; // −25% 甩卖
        const proceeds = bids.reduce((s, b) => s + b.n * b.p, 0) + rest * restP;
        const paper = 500 * navTok;
        sellHtml = `${T("你挂出 <b>500 枚</b>。内部订单簿的全部买单：", "You list <b>500 tokens</b>. The entire internal book:")}<br>
          ${bids.map((b) => `· ${b.n} ${T("枚", "tokens")} @ $${b.p.toFixed(2)}`).join("<br>")}<br>
          ${T("→ 贴近“评估 NAV”的买单只吃掉 <b>80 枚</b>；其余 420 枚要折价 <b>15–30%</b>（按 −25% 计）。", "→ Bids near “appraisal NAV” absorb only <b>80 tokens</b>; the other 420 must discount <b>15–30%</b> (using −25%).")}<br>
          ${T("账面价值", "Paper value")}: <b>${$(paper)}</b> → ${T("实际回款", "Actual proceeds")}: <b style="color:var(--red)">${$(proceeds)}</b>（${(((proceeds - paper) / paper) * 100).toFixed(1)}%）
          <div class="demo-warn" style="margin-top:6px">${T("这就是<strong>流动性幻觉</strong>：2,000 个持有人，不等于 2,000 个买家。", "This is the <strong>liquidity illusion</strong>: 2,000 holders ≠ 2,000 buyers.")}</div>`;
      } else {
        sellHtml = `${T("同样卖出 ~$24,000 的<b>代币化 HELOC</b>（标准化贷款）：机构订单簿深达七位数，成交 @ 面值 99.6%，回款 <b>$23,900</b>。无聊，但好用——“纸”有深口袋买家，“楼”没有。", "Sell the same ~$24,000 of a <b>tokenized HELOC</b> (standardized loan): the institutional book is seven figures deep, fills @ 99.6% of par, proceeds <b>$23,900</b>. Boring but functional — the “paper” has deep-pocketed buyers; the “building” doesn't.")}`;
      }
      html += `<div class="jstep done"><div class="jn">4</div><div>
        <div class="jt">${T("卖出测试：退出 500 枚", "Sell test: exit 500 tokens")} <button class="demo-btn${heloc ? " active" : ""}" id="pf-heloc" style="margin-left:8px">${T("对照组：代币化 HELOC", "Control: tokenized HELOC")}</button></div>
        <div class="jd">${sellHtml}</div></div></div>`;
    }

    stepsEl.innerHTML = html;
    navEl.innerHTML = step < 4
      ? `<button class="demo-btn" id="pf-next">${["▶ " + T("开始代币化", "Tokenize"), "▶ " + T("开闸放租金", "Start the rent drip"), "▶ " + T("进入现实", "Enter reality"), "▶ " + T("试试卖掉", "Try to sell")][step]}</button>`
      : `<button class="demo-btn" id="pf-reset">↺ ${T("重来", "Reset")}</button>`;

    const nextB = root.querySelector("#pf-next");
    if (nextB) nextB.addEventListener("click", () => { step++; paint(); });
    const resetB = root.querySelector("#pf-reset");
    if (resetB) resetB.addEventListener("click", () => { step = 0; capLoss = 0; opsLoss = 0; mgrGone = false; heloc = false; fired.clear(); paint(); });
    const hB = root.querySelector("#pf-heloc");
    if (hB) hB.addEventListener("click", () => { heloc = !heloc; paint(); });
    root.querySelectorAll("[data-ev]").forEach((b) =>
      b.addEventListener("click", () => {
        const e = EVENTS.find((x) => x.id === b.dataset.ev);
        if (!e || fired.has(e.id)) return;
        fired.add(e.id); capLoss += e.cap; opsLoss += e.ops; if (e.gone) mgrGone = true;
        paint();
      }));
  }

  paint();
}
