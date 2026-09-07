// 交互演示：NAV 计算器——你来当基金行政管理人：编辑持仓、处理申赎、触发违约，实时重算每份净值（4 位小数）。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const INIT = { tbills: 62.0, repo: 25.0, cash: 10.5, accrued: 2.6, fees: 0.1, shares: 100.0 };
  let s = { ...INIT };
  let defaulted = false;
  let log = [];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🧮 NAV 计算器：今天你是行政管理人", "🧮 NAV calculator: today you are the administrator")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("迷你货币市场基金 · 持仓表（单位：百万美元，可编辑）", "Mini money market fund · holdings (in $M, editable)")}</div>
        <div id="nv-rows"></div>
      </div>
      <div class="demo-block" id="nv-out"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="nv-sub">${T("＋ 申购 $1,000 万", "+ Subscribe $10M")}</button>
        <button class="demo-btn" id="nv-red">${T("－ 赎回 $1,000 万", "− Redeem $10M")}</button>
        <button class="demo-btn" id="nv-def">${T("⚠ 持仓里 3% 的票据违约", "⚠ 3% of holdings default")}</button>
        <button class="demo-btn" id="nv-reset">${T("↺ 重置", "↺ Reset")}</button>
      </div>
      <div id="nv-banner"></div>
      <div id="nv-log" style="font-size:11px;color:var(--muted);font-family:var(--mono);margin-top:6px"></div>
      <p class="demo-tip">${T("先申购再赎回：NAV 纹丝不动——按净值进出，谁也没占谁便宜。再点“违约”：净值一秒跌到 $0.9968，你就明白 2008 年 Reserve Primary 的 $0.97 意味着什么。<strong>NAV 不是市场价，是会计</strong>——把这台“每天一次”的机器搬上链，就是阶段 8.2。", "Subscribe, then redeem: NAV doesn't budge — dealing at net value means nobody skims anybody. Then hit “default”: NAV drops to $0.9968 in a second, and you feel what Reserve Primary's $0.97 meant in 2008. <strong>NAV is accounting, not a market price</strong> — moving this once-a-day machine on-chain is Stage 8.2.")}</p>
    </div>`;

  const rowsEl = root.querySelector("#nv-rows");
  const outEl = root.querySelector("#nv-out");
  const bannerEl = root.querySelector("#nv-banner");
  const logEl = root.querySelector("#nv-log");

  const FIELDS = [
    { k: "tbills", zh: "T-bill（按市价）", e: "T-bills (marked to market)", liab: false },
    { k: "repo", zh: "隔夜回购", e: "Overnight repo", liab: false },
    { k: "cash", zh: "现金", e: "Cash", liab: false },
    { k: "accrued", zh: "应计利息", e: "Accrued interest", liab: false },
    { k: "fees", zh: "应付管理费（负债）", e: "Fees payable (liability)", liab: true },
  ];

  function nav() {
    const assets = s.tbills + s.repo + s.cash + s.accrued;
    return { assets, net: assets - s.fees, nav: (assets - s.fees) / s.shares };
  }

  function paintRows() {
    rowsEl.innerHTML = FIELDS.map((f) => `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid var(--line)">
        <span style="font-size:12px;color:${f.liab ? "var(--red)" : "var(--ink)"}">${T(f.zh, f.e)}</span>
        <span><span style="color:var(--muted);font-size:12px">${f.liab ? "−" : ""}$</span><input data-k="${f.k}" type="number" step="0.1" min="0" value="${s[f.k].toFixed(2)}" style="width:80px;font-family:var(--mono);background:var(--surface-2);color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:2px 6px"/> M</span>
      </div>`).join("");
    rowsEl.querySelectorAll("input[data-k]").forEach((inp) =>
      inp.addEventListener("input", () => { s[inp.dataset.k] = Math.max(0, parseFloat(inp.value) || 0); paintOut(); }));
  }

  function paintOut() {
    const { assets, net, nav: n } = nav();
    const broke = n < 0.995;
    const off = n < 0.99995 || n > 1.00005;
    outEl.innerHTML = `
      <div style="font-family:var(--mono);font-size:12px;color:var(--muted)">NAV = (${T("资产", "assets")} $${assets.toFixed(2)}M − ${T("负债", "liab.")} $${s.fees.toFixed(2)}M) ÷ ${s.shares.toFixed(2)}M ${T("份", "shares")}</div>
      <div style="font-size:24px;font-weight:700;margin-top:4px;color:${broke ? "var(--red)" : off ? "var(--orange-ink)" : "var(--green)"}">$${n.toFixed(4)}</div>
      <div style="font-size:11px;color:var(--muted)">${T("每份净值 · 精确到 4 位小数 · 每天只算一次", "net asset value per share · 4 decimals · computed once a day")}</div>`;
    bannerEl.innerHTML = defaulted ? `
      <div class="demo-warn" style="margin-top:8px">${T(
        `<strong>跌破一美元预警。</strong>$3.0M 的商业票据发行人违约，按约 89% 回收率减记 $0.32M → NAV 打印 <strong>$${n.toFixed(4)}</strong>。摊余成本法勉强还能进位到 $1.00，但披露一出，赎回潮就会开始；若减记加深、跌破 $0.995，即正式“breaking the buck”——2008 年 Reserve Primary 打到 $0.97，两天被赎走几千亿，最终靠流动性门槛（gates）暂停赎回。`,
        `<strong>Breaking-the-buck warning.</strong> A $3.0M commercial-paper issuer defaulted; written down at ~89% recovery, a $0.32M loss → NAV prints <strong>$${n.toFixed(4)}</strong>. Amortized-cost accounting can still round to $1.00 — but once disclosed, the run begins; deepen the writedown below $0.995 and the fund formally “breaks the buck.” Reserve Primary hit $0.97 in 2008, lost hundreds of billions of redemptions in days, and gates suspended withdrawals.`)}</div>` : "";
    logEl.innerHTML = log.slice(-4).map((l) => "· " + l).join("<br>");
  }

  root.querySelector("#nv-sub").addEventListener("click", () => {
    const n = nav().nav;
    const newShares = 10 / n;
    s.cash += 10; s.shares += newShares;
    log.push(T(`申购 $10M @ $${n.toFixed(4)} → 新发 ${newShares.toFixed(2)}M 份（现金+10，份额同步增，NAV 不动）`, `Subscribed $10M @ $${n.toFixed(4)} → issued ${newShares.toFixed(2)}M shares (cash +10, shares up in step, NAV unmoved)`));
    paintRows(); paintOut();
  });
  root.querySelector("#nv-red").addEventListener("click", () => {
    const n = nav().nav;
    if (s.cash < 10) { log.push(T("现金不足 $10M——现实中基金要卖持仓或启动门槛（gates）", "Cash below $10M — a real fund must sell holdings or invoke gates")); paintOut(); return; }
    const burned = 10 / n;
    s.cash -= 10; s.shares -= burned;
    log.push(T(`赎回 $10M @ $${n.toFixed(4)} → 注销 ${burned.toFixed(2)}M 份（NAV 仍然不动）`, `Redeemed $10M @ $${n.toFixed(4)} → cancelled ${burned.toFixed(2)}M shares (NAV still unmoved)`));
    paintRows(); paintOut();
  });
  root.querySelector("#nv-def").addEventListener("click", () => {
    if (defaulted) return;
    defaulted = true;
    s.tbills = Math.max(0, s.tbills - 0.32);
    log.push(T("违约事件：$3.0M 票据减记至 $2.68M（−$0.32M）", "Default event: $3.0M of paper written down to $2.68M (−$0.32M)"));
    paintRows(); paintOut();
  });
  root.querySelector("#nv-reset").addEventListener("click", () => { s = { ...INIT }; defaulted = false; log = []; paintRows(); paintOut(); });

  paintRows(); paintOut();
}
