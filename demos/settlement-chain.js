// 交互演示：结算链条追踪器——“买 1 股”逐跳穿过传统管道（可切跨境），对比代币化的原子 DvP；计数器累计耗时/成本/账本数与对账工序。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const CHAINS = {
    domestic: [
      { n: T("经纪商", "Broker"), d: T("接单、路由到交易所——你的持仓只是它账本上的一行", "Takes your order, routes it — your position is one row in its ledger"), h: 0, c: 2, l: 1 },
      { n: T("交易所撮合", "Exchange match"), d: T("买卖单配对，“已成交”——但钱和券都还没动", "Buy meets sell: “filled” — yet no cash or shares have moved"), h: 0.1, c: 1, l: 0 },
      { n: "NSCC", d: T("盘后轧差：全市场交收量压缩 98%+，并站进每笔交易中间担保", "Post-close netting compresses settlement 98%+, then novation guarantees both sides"), h: 8, c: 1, l: 1 },
      { n: "DTC", d: T("T+1 簿记交收：数据库里两行数字改动，钱券才真正换手", "T+1 book-entry: two numbers change in a database — now cash and shares truly move"), h: 16, c: 1, l: 1 },
      { n: "Cede & Co.", d: T("法定登记持有人不变——你拿到的是穿过中介的“受益权”", "The registered holder never changes — you get a beneficial interest through intermediaries"), h: 0, c: 0, l: 1 },
      { n: T("对方链条", "Counterparty chain"), d: T("卖方的券商与客户账本做镜像更新——又是两本账", "The seller's broker and client ledgers mirror the update — two more books"), h: 0, c: 1, l: 2 },
    ],
    cross: [
      { n: T("本国托管人", "Home custodian"), d: T("你的券商先指令本国托管银行", "Your broker instructs your home custodian bank"), h: 8, c: 15, l: 1 },
      { n: "Euroclear (ICSD)", d: T("国际中央存管机构居中记账", "The international CSD keeps books in the middle"), h: 24, c: 20, l: 1 },
      { n: T("当地 CSD + 代理行", "Local CSD + agent bank"), d: T("目的国存管 + 当地代理行，各记各的账", "Destination-country depository plus a local agent bank — each with its own ledger"), h: 24, c: 25, l: 2 },
      { n: T("外汇兑换", "FX conversion"), d: T("两种货币、两套支付系统、两个时区——Herstatt 风险窗口", "Two currencies, two payment systems, two time zones — the Herstatt risk window"), h: 24, c: 30, l: 1 },
    ],
    token: [
      { n: T("合规检查", "Compliance check"), d: T("代币合约校验 canTransfer：白名单、锁定期——几百毫秒", "The token contract runs canTransfer: whitelist, lockups — a few hundred ms"), h: 0, c: 0.1, l: 0 },
      { n: T("原子 DvP", "Atomic DvP"), d: T("代币与稳定币在同一笔交易里互换：要么都发生，要么都不发生。转账即结算", "Token and stablecoin swap inside one transaction: both happen or neither. Transfer is settlement"), h: 0.005, c: 0.4, l: 1 },
    ],
  };

  let cross = false, token = false, shown = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔗 结算链条追踪器：“买 1 股”到底要过几手", "🔗 Settlement chain tracer: how many hands does “buy 1 share” pass through?")}</div>
      <div class="demo-switch">
        <button class="demo-btn" id="sc-cross">${T("🌍 跨境债券", "🌍 Cross-border bond")}</button>
        <button class="demo-btn" id="sc-token">${T("⚡ 代币化", "⚡ Tokenized")}</button>
      </div>
      <div style="display:flex;gap:8px;margin:8px 0;flex-wrap:wrap" id="sc-counters"></div>
      <div class="journey" id="sc-steps"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="sc-next">${T("▶ 走下一跳", "▶ Next hop")}</button>
        <button class="demo-btn" id="sc-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="sc-recon"></div>
      <p class="demo-tip">${T("先走完国内 6 跳，再开“跨境”看链条变多长；最后开“代币化”：2 跳、秒级、1 本账、0 道对账。<strong>代币化省掉的不是托管，是对账</strong>——账本从 N 本变 1 本，对账工序从 N−1 道归零。", "Walk the 6 domestic hops, flip on “cross-border” to watch the chain stretch, then flip “tokenized”: 2 hops, seconds, 1 ledger, 0 reconciliations. <strong>What tokenization eliminates isn't custody — it's reconciliation</strong>: N ledgers become 1, and N−1 matching belts drop to zero.")}</p>
    </div>`;

  const stepsEl = root.querySelector("#sc-steps");
  const countersEl = root.querySelector("#sc-counters");
  const reconEl = root.querySelector("#sc-recon");
  const nextBtn = root.querySelector("#sc-next");

  function chain() { return token ? CHAINS.token : (cross ? CHAINS.domestic.concat(CHAINS.cross) : CHAINS.domestic); }

  function fmtH(h) {
    if (h < 0.01) return T("≈15 秒", "≈15 sec");
    if (h < 24) return h.toFixed(1) + T(" 小时", " h");
    return (h / 24).toFixed(1) + T(" 天", " days");
  }

  function paint() {
    const arr = chain();
    let hours = 0, cost = 0, ledgers = 0;
    let html = "";
    for (let i = 0; i < shown && i < arr.length; i++) {
      const s = arr[i];
      hours += s.h; cost += s.c; ledgers += s.l;
      html += `
        <div class="jstep done">
          <div class="jn">${i + 1}</div>
          <div>
            <div class="jt">${s.n}</div>
            <div class="jd">${s.d}</div>
          </div>
        </div>`;
    }
    stepsEl.innerHTML = html;
    const box = (label, val, color) => `<div class="demo-block" style="flex:1;min-width:110px;margin:0;text-align:center"><div class="demo-label">${label}</div><div style="font-family:var(--mono);font-weight:700;font-size:15px;color:${color}">${val}</div></div>`;
    countersEl.innerHTML =
      box(T("累计耗时", "Elapsed"), fmtH(hours), hours > 48 ? "var(--red)" : "var(--ink)") +
      box(T("累计成本", "Cost"), "$" + cost.toFixed(2), cost > 20 ? "var(--red)" : "var(--ink)") +
      box(T("写过的账本", "Ledgers written"), ledgers, ledgers > 1 ? "var(--orange-ink)" : "var(--green)");
    const recons = Math.max(0, ledgers - 1);
    if (shown >= arr.length && shown > 0) {
      const pct = Math.min(100, recons * 12);
      reconEl.innerHTML = `
        <div class="done-banner" style="margin:8px 0">${token
          ? T("✅ 转账即结算：钱与券在同一笔交易里换手，没有 T+N。", "✅ Transfer is settlement: cash and asset swap in one transaction — no T+N.")
          : T("✅ 交收完成（" + fmtH(hours) + "后）——但后台的活才刚开始：", "✅ Settled (after " + fmtH(hours) + ") — but the back office is just getting started:")}</div>
        <div class="demo-block" style="margin-top:0">
          <div class="demo-label">${T("对账工序（账本两两核对：N 本账 → N−1 道对账）", "Reconciliation belts (ledger pairs to match: N ledgers → N−1 belts)")}</div>
          <div style="background:var(--surface-2);border-radius:6px;height:14px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${recons === 0 ? "var(--green)" : "var(--red)"};border-radius:6px"></div></div>
          <div style="font-family:var(--mono);font-size:12px;margin-top:4px;color:${recons === 0 ? "var(--green)" : "var(--red)"}">${recons} ${T("道永不停歇的对账", "never-ending reconciliations")}${recons === 0 ? " 🎉" : ""}</div>
        </div>`;
    } else {
      reconEl.innerHTML = "";
    }
    nextBtn.disabled = shown >= arr.length;
    nextBtn.textContent = shown === 0 ? T("▶ 开始追踪", "▶ Start tracing") : (shown >= arr.length ? T("✓ 走完了", "✓ Done") : T("▶ 走下一跳", "▶ Next hop"));
  }

  function toggles() {
    root.querySelector("#sc-cross").classList.toggle("active", cross && !token);
    root.querySelector("#sc-token").classList.toggle("active", token);
  }

  root.querySelector("#sc-cross").addEventListener("click", () => { cross = !cross; token = false; shown = 0; toggles(); paint(); });
  root.querySelector("#sc-token").addEventListener("click", () => { token = !token; shown = 0; toggles(); paint(); });
  nextBtn.addEventListener("click", () => { if (shown < chain().length) shown++; paint(); });
  root.querySelector("#sc-reset").addEventListener("click", () => { shown = 0; paint(); });

  toggles();
  paint();
}
