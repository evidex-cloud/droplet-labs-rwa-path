// 交互演示：同一股股票的三个时代（1950 纸 / 1985 数据库 / 2025 代币）——逐代对比“记录在哪、怎么转让、会出什么错”。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const eras = [
    {
      year: "1950", icon: "📜",
      name: T("纸质股票时代", "The paper certificate era"),
      record: T("一张印着你名字的纸质证书，锁在你家保险柜里。纸 = 所有权本身。", "A paper certificate with your name on it, locked in your home safe. The paper IS the ownership."),
      transfer: T("背书签字 → 邮寄给买方券商 → 人工核对防伪 → 通知公司改股东名册。全程数周。", "Endorse it → mail it to the buyer's broker → verify the engraving by hand → notify the company to update its register. Weeks, end to end."),
      risk: T("纸会被偷、被烧、寄丢；签名可以伪造；交易量一大，后台被纸活埋（1968 年纽交所被迫每周三休市）。", "Paper gets stolen, burned, or lost in the mail; signatures can be forged; and when volume spikes, back offices drown (in 1968 the NYSE closed every Wednesday)."),
      good: T("✓ 直接持有：券商倒闭与你无关，纸在你手里就是你的。", "✓ Direct holding: your broker's bankruptcy isn't your problem — the paper in your hand is yours."),
    },
    {
      year: "1985", icon: "🗄️",
      name: T("中心化数据库时代", "The centralized database era"),
      record: T("苹果名册上登记 Cede & Co. → DTC 记各券商份额 → 券商记你的 100 股。你持有的是“受益权益”（街名持有）。", "Apple's register lists Cede & Co. → DTC records each broker's position → your broker records your 100 shares. You hold a “beneficial interest” (street name)."),
      transfer: T("交易日内成交，攒一天轧差，T+5（后来 T+3 → T+2 → 2024 年 T+1）批量交割。纸永远不动——只改数字。", "Trades match intraday, get netted for the day, and settle in batch at T+5 (later T+3 → T+2 → T+1 in May 2024). The paper never moves — only numbers change."),
      risk: T("对手方可能在 T+N 的间隙违约；多层账本要永远互相对账（Dole 案：索赔股数比实际多约 1/3）；一切依赖中介存续。", "A counterparty can fail inside the T+N gap; stacked ledgers need perpetual reconciliation (Dole case: claims exceeded real shares by ~1/3); everything depends on intermediaries surviving."),
      good: T("✓ 规模与速度：DTCC 每年清算结算超 2000 万亿美元——纸时代做梦都不敢想。", "✓ Scale and speed: DTCC clears and settles over $2 quadrillion a year — unthinkable in the paper era."),
    },
    {
      year: "2025", icon: "🔗",
      name: T("共享账本（代币）时代", "The shared-ledger (token) era"),
      record: T("你的地址在一条共享账本上直接记着 100 枚代币。任何人可验证总量与流转；你可以自己保管私钥。", "Your address holds 100 tokens directly on a shared ledger. Anyone can verify supply and flows; you can custody your own keys."),
      transfer: T("一笔链上交易，代币与钱同时换手（原子结算），几分钟确认，7×24 全年无休——不用等周一开盘。", "One on-chain transaction: token and cash change hands together (atomic settlement), confirmed in minutes, 24/7/365 — no waiting for Monday's open."),
      risk: T("私钥丢了没有客服找回；合约可能有漏洞；且链上记录再完美，链下资产是否真在，仍要信发行方与托管方（阶段 5–8）。", "Lose your keys and there's no help desk; contracts can have bugs; and however perfect the record, whether the off-chain asset really exists still depends on the issuer and custodian (Stages 5–8)."),
      good: T("✓ 三代合体：直接持有（像纸）+ 规模速度（像数据库）+ 全新的可编程性。", "✓ Best of both: direct holding (like paper) + scale and speed (like the database) + brand-new programmability."),
    },
  ];

  let idx = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🕰️ 同一股股票，三个时代", "🕰️ The same share, three eras")}</div>
      <div class="demo-switch" id="ot-tabs">${eras.map((e2, i) => `<button class="demo-btn" data-i="${i}">${e2.icon} ${e2.year}</button>`).join("")}</div>
      <div id="ot-body"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="ot-prev">${T("◀ 上一代", "◀ Previous era")}</button>
        <button class="demo-btn" id="ot-next">${T("下一代 ▶", "Next era ▶")}</button>
      </div>
      <div id="ot-done"></div>
      <p class="demo-tip">${T("三个时代记的是<strong>同一件事</strong>：谁拥有这 100 股。变的只是账本——谁来记、怎么转、会怎么坏。注意每一代都用旧优点换新优点：纸有直接持有，数据库有规模，代币想两者都要。", "All three eras record <strong>the same fact</strong>: who owns these 100 shares. Only the ledger changes — who keeps it, how transfers work, how it breaks. Notice each era trades one virtue for another: paper had direct holding, databases had scale, tokens want both.")}</p>
    </div>`;

  const body = root.querySelector("#ot-body");
  const tabs = Array.from(root.querySelectorAll("#ot-tabs [data-i]"));
  const doneEl = root.querySelector("#ot-done");
  const seen = new Set();

  function paint() {
    const e2 = eras[idx];
    seen.add(idx);
    tabs.forEach((b) => b.classList.toggle("active", +b.dataset.i === idx));
    body.innerHTML = `
      <div class="demo-block">
        <div style="font-size:1.1rem;font-weight:700;color:var(--ink)">${e2.icon} ${e2.year} · ${e2.name}</div>
      </div>
      <div class="demo-block" style="border-left:3px solid var(--line)">
        <div class="demo-label">${T("📒 记录在哪", "📒 Who keeps the record")}</div>
        <div style="color:var(--ink)">${e2.record}</div>
      </div>
      <div class="demo-block" style="border-left:3px solid var(--orange-line)">
        <div class="demo-label">${T("🔁 怎么转让", "🔁 How a transfer works")}</div>
        <div style="color:var(--ink)">${e2.transfer}</div>
      </div>
      <div class="demo-block" style="border-left:3px solid var(--red)">
        <div class="demo-label">${T("💥 会出什么错", "💥 What can go wrong")}</div>
        <div style="color:var(--ink)">${e2.risk}</div>
      </div>
      <div class="demo-block" style="color:var(--green);font-weight:600">${e2.good}</div>`;
    root.querySelector("#ot-prev").disabled = idx === 0;
    root.querySelector("#ot-next").disabled = idx === eras.length - 1;
    doneEl.innerHTML = seen.size === eras.length
      ? `<div class="done-banner">${T("✅ 三代看完——所有权一直是记录，变的只是载体：纸 → 数据库 → 共享账本。", "✅ All three eras seen — ownership was always a record; only the medium changed: paper → database → shared ledger.")}</div>`
      : "";
  }

  tabs.forEach((b) => b.addEventListener("click", () => { idx = +b.dataset.i; paint(); }));
  root.querySelector("#ot-prev").addEventListener("click", () => { if (idx > 0) { idx--; paint(); } });
  root.querySelector("#ot-next").addEventListener("click", () => { if (idx < eras.length - 1) { idx++; paint(); } });

  paint();
}
