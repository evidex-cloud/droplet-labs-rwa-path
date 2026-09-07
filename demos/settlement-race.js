// 交互演示：结算赛跑——传统跨境买债 vs 代币化原子交割，逐步推进看时间与费用怎么累积；周六开跑开关体验 7×24。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  let weekend = false, step = 0;

  function tradSteps() {
    const s = [
      { t: T("你向券商下单：买 1 万美元外国债券", "You order $10,000 of a foreign bond via your broker"), h: 0.5, fee: 25, note: T("券商佣金 $25", "broker commission $25") },
      { t: T("券商发指令给当地托管行", "Broker instructs the local custodian"), h: 4, fee: 10, note: T("托管指令费 $10", "custody instruction $10") },
      { t: T("中央存管机构（CSD）批量过户", "The central securities depository (CSD) settles in batch"), h: 48, fee: 15, note: T("T+2 批量交割 · 过户费 $15", "T+2 batch delivery · transfer fee $15") },
      { t: T("代理行换汇、付款到账", "Correspondent bank converts FX and pays"), h: 6, fee: 80, note: T("汇款费 $30 + 换汇点差 ≈$50", "wire $30 + FX spread ≈$50") },
    ];
    if (weekend) s.unshift({ t: T("周六 20:00 下单——Fedwire/SWIFT 关门，指令排队", "Ordered Saturday 8pm — Fedwire/SWIFT closed; instruction queues"), h: 36, fee: 0, note: T("⏸ 一直躺到周一开门", "⏸ sits until Monday opens"), bad: true });
    return s;
  }
  function chainSteps() {
    return [
      { t: T("一笔链上交易：债券代币 ⇄ 稳定币（原子 DvP）", "One on-chain transaction: bond token ⇄ stablecoin (atomic DvP)"), h: 0.05, fee: 1, note: T("链上手续费 ≈$1 · 周末照常", "network fee ≈$1 · weekends included"), key: true },
      { t: T("✓ 钱货两清，任何一方都不可能只收不付", "✓ Both legs settled — neither side can take without paying"), h: 0, fee: 0, note: T("对手方风险窗口 ≈ 0", "counterparty-risk window ≈ 0") },
    ];
  }

  function fmt(h) {
    if (h < 1) return Math.round(h * 60) + T(" 分钟", " min");
    if (h < 24) return (Math.round(h * 10) / 10) + T(" 小时", " h");
    return (Math.round((h / 24) * 10) / 10) + T(" 天", " days");
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏁 结算赛跑：跨境买一只债券", "🏁 The settlement race: buying a bond across borders")}</div>
      <div class="demo-switch">${T("开跑时间：", "Start time: ")}
        <button class="demo-btn active" id="sr-wd">${T("工作日上午", "Weekday morning")}</button>
        <button class="demo-btn" id="sr-we">${T("周六晚上 🌙", "Saturday night 🌙")}</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="demo-block"><div class="demo-label">🏦 ${T("传统路径", "Traditional route")}</div><div id="sr-tstat" style="font-weight:700;color:var(--ink)"></div><div class="journey" id="sr-tlane"></div></div>
        <div class="demo-block"><div class="demo-label">⛓️ ${T("代币化路径", "Tokenized route")}</div><div id="sr-cstat" style="font-weight:700;color:var(--ink)"></div><div class="journey" id="sr-clane"></div></div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="sr-next">${T("▶ 推进一步", "▶ Advance one step")}</button>
        <button class="demo-btn" id="sr-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="sr-done"></div>
      <p class="demo-tip">${T("注意两件事：传统路径的<strong>每一跳都是一家机构 + 一道费 + 一段等待</strong>，而原子 DvP 把整场交割压进一笔交易；切到“周六晚上”，传统路径直接躺 36 小时——<strong>链没有周末，这既是卖点，也是阶段 4.3 要讲的风险源</strong>。", "Notice two things: every hop on the traditional route is <strong>an institution + a fee + a wait</strong>, while atomic DvP squeezes the whole delivery into one transaction; switch to “Saturday night” and the traditional route just lies there for 36 hours — <strong>the chain has no weekend, which is both the selling point and the risk source of Stage 4.3</strong>.")}</p>
    </div>`;

  const tlane = root.querySelector("#sr-tlane"), clane = root.querySelector("#sr-clane");
  const tstat = root.querySelector("#sr-tstat"), cstat = root.querySelector("#sr-cstat");
  const doneEl = root.querySelector("#sr-done");

  function lane(el, statEl, arr, n) {
    let h = 0, fee = 0, html = "";
    for (let i = 0; i < Math.min(n, arr.length); i++) {
      const s = arr[i]; h += s.h; fee += s.fee;
      const col = s.bad ? "var(--red)" : (s.key ? "var(--orange-ink)" : "var(--muted)");
      html += `<div class="jstep done"><div class="jn">${i + 1}</div><div><div class="jt" style="font-size:.85rem">${s.t}</div><div class="jd" style="color:${col}">${s.note}${s.h ? ` · +${fmt(s.h)}` : ""}</div></div></div>`;
    }
    el.innerHTML = html;
    statEl.innerHTML = `${T("⏱ 累计", "⏱ Elapsed")}: <span style="color:${h > 24 ? "var(--red)" : "var(--green)"}">${fmt(h)}</span> &nbsp; ${T("💸 费用", "💸 Fees")}: <span style="color:${fee > 20 ? "var(--red)" : "var(--green)"}">$${fee}</span>`;
    return Math.min(n, arr.length) >= arr.length;
  }

  function paint() {
    const tArr = tradSteps(), cArr = chainSteps();
    const tDone = lane(tlane, tstat, tArr, step);
    const cDone = lane(clane, cstat, cArr, step);
    const maxLen = Math.max(tArr.length, cArr.length);
    root.querySelector("#sr-next").disabled = step >= maxLen;
    if (cDone && step >= cArr.length && !tDone) {
      doneEl.innerHTML = `<div class="demo-warn" style="margin-top:8px">${T("⛓️ 代币化那边已经结束了——传统路径还在路上。继续推进，看它还要走多久。", "⛓️ The tokenized side is already done — the traditional route is still in transit. Keep advancing to see how much longer it takes.")}</div>`;
    }
    if (tDone && cDone) {
      const tTot = tArr.reduce((a, s) => a + s.h, 0), tFee = tArr.reduce((a, s) => a + s.fee, 0);
      doneEl.innerHTML = `<div class="done-banner">${T(`✅ 终点：传统 ${fmt(tTot)} / $${tFee} 费用 vs 代币化 ≈3 分钟 / $1。差距不是“快一点”，是对手方风险窗口从几天变成几秒。`, `✅ Finish line: traditional ${fmt(tTot)} / $${tFee} in fees vs tokenized ≈3 minutes / $1. The gap isn't “a bit faster” — the counterparty-risk window collapses from days to seconds.`)}</div>`;
    }
  }

  root.querySelector("#sr-wd").addEventListener("click", () => { weekend = false; step = 0; doneEl.innerHTML = ""; root.querySelector("#sr-wd").classList.add("active"); root.querySelector("#sr-we").classList.remove("active"); paint(); });
  root.querySelector("#sr-we").addEventListener("click", () => { weekend = true; step = 0; doneEl.innerHTML = ""; root.querySelector("#sr-we").classList.add("active"); root.querySelector("#sr-wd").classList.remove("active"); paint(); });
  root.querySelector("#sr-next").addEventListener("click", () => { step++; paint(); });
  root.querySelector("#sr-reset").addEventListener("click", () => { step = 0; doneEl.innerHTML = ""; paint(); });

  paint();
}
