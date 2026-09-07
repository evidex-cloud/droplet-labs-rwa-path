// 交互演示：选链决策器——拨 5 个优先级，用加权模型给 6 类“住址”打分排名，并对照真实 RWA 产品的选择。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const ATTRS = [
    { k: "priv", zh: "机构隐私", en: "Institutional privacy" },
    { k: "comp", zh: "DeFi 可组合性", en: "DeFi composability" },
    { k: "cost", zh: "成本敏感", en: "Cost sensitivity" },
    { k: "reg", zh: "监管舒适度", en: "Regulatory comfort" },
    { k: "retail", zh: "零售触达", en: "Retail reach" },
  ];

  const VENUES = [
    { zh: "以太坊 L1", en: "Ethereum L1", s: { priv: 2, comp: 10, cost: 2, reg: 7, retail: 8 },
      why: T("最贵但最正统：安全性、中立性、生态深度之最", "Priciest but most canonical: peak security, neutrality, ecosystem depth"),
      who: T("BlackRock BUIDL 的主场", "Home of BlackRock BUIDL") },
    { zh: "L2 Rollup（Arbitrum/Base…）", en: "L2 rollups (Arbitrum/Base…)", s: { priv: 2, comp: 8, cost: 8, reg: 6, retail: 8 },
      why: T("继承 L1 安全，费用降到几美分", "Inherits L1 security, fees drop to cents"),
      who: T("国债代币与收益稳定币的扩张地", "Where treasury tokens & yield stablecoins expand") },
    { zh: "Solana", en: "Solana", s: { priv: 2, comp: 7, cost: 9, reg: 5, retail: 9 },
      why: T("高吞吐低费用，零售分发强", "High throughput, tiny fees, strong retail distribution"),
      who: T("2024–25 各发行方竞逐的代币化阵地", "The tokenization venue issuers raced into 2024–25") },
    { zh: "Stellar", en: "Stellar", s: { priv: 3, comp: 3, cost: 9, reg: 8, retail: 7 },
      why: T("为支付而生，费用近零，监管关系稳", "Built for payments, near-zero fees, steady regulator relations"),
      who: T("Franklin BENJI 最初的家", "Original home of Franklin BENJI") },
    { zh: "Canton 类许可网络", en: "Canton-style permissioned network", s: { priv: 9, comp: 3, cost: 7, reg: 9, retail: 2 },
      why: T("隐私优先互联：各方只见与己相关的交易", "Privacy-first interop: each party sees only its own deals"),
      who: T("机构财团共建（Canton Network）", "Consortium-built (Canton Network)") },
    { zh: "银行私有链", en: "Bank private chain", s: { priv: 10, comp: 1, cost: 8, reg: 10, retail: 1 },
      why: T("全员实名、账本可控，合规部门最放心", "Fully identified, controlled ledger — compliance's favorite"),
      who: T("JPMorgan Kinexys · Provenance（$100 亿+ HELOC）", "JPMorgan Kinexys · Provenance ($10B+ HELOCs)") },
  ];

  const PRESETS = [
    { zh: "BlackRock 式机构基金", en: "BlackRock-style institutional fund", w: { priv: 3, comp: 8, cost: 2, reg: 9, retail: 6 } },
    { zh: "全球零售收益代币", en: "Global retail yield token", w: { priv: 1, comp: 8, cost: 8, reg: 4, retail: 10 } },
    { zh: "银行存款代币", en: "Bank deposit token", w: { priv: 10, comp: 1, cost: 3, reg: 10, retail: 1 } },
  ];

  let w = { priv: 5, comp: 5, cost: 5, reg: 5, retail: 5 };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🗺️ 选链决策器：你的优先级 → 该住哪条链", "🗺️ Chain picker: your priorities → where to live")}</div>
      <div class="demo-switch">${T("预设：", "Presets: ")}${PRESETS.map((p, i) => `<button class="demo-btn" data-preset="${i}">${en ? p.en : p.zh}</button>`).join("")}</div>
      <div class="demo-block">${ATTRS.map((a) => `
        <label class="demo-label">${en ? a.en : a.zh}：<b id="cp-v-${a.k}">${w[a.k]}</b>/10</label>
        <input class="demo-slider" data-attr="${a.k}" type="range" min="0" max="10" step="1" value="${w[a.k]}" />`).join("")}
      </div>
      <div id="cp-rank"></div>
      <p class="demo-tip">${T("留意：三个预设分别把<strong>以太坊 L1、L2/Solana、银行私链</strong>推上榜首——和 BUIDL、零售收益代币、Kinexys 在现实中的选择一致。选链的不是技术时尚，是买方画像。", "Notice: the three presets push <strong>Ethereum L1, L2/Solana, and the bank private chain</strong> to the top respectively — matching what BUIDL, retail yield tokens, and Kinexys actually chose. Buyers pick the chain, not tech fashion.")}</p>
    </div>`;

  const rankEl = root.querySelector("#cp-rank");

  function calc() {
    const total = ATTRS.reduce((s, a) => s + w[a.k], 0) || 1;
    const scored = VENUES.map((v) => ({
      v,
      score: ATTRS.reduce((s, a) => s + w[a.k] * v.s[a.k], 0) / total,
    })).sort((x, y) => y.score - x.score);
    rankEl.innerHTML = scored.map((r, i) => {
      const pct = Math.round(r.score * 10);
      const top = i === 0;
      return `<div class="demo-block" style="${top ? "border-color:var(--orange-line);background:var(--orange-soft)" : ""}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b style="color:${top ? "var(--orange-ink)" : "var(--ink)"}">${i + 1}. ${en ? r.v.en : r.v.zh}</b>
          <span style="font-family:var(--mono);font-weight:700;color:${top ? "var(--orange-ink)" : "var(--muted)"}">${r.score.toFixed(1)}/10</span>
        </div>
        <div style="height:6px;border-radius:3px;background:var(--surface-2);margin:6px 0;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${top ? "var(--orange-ink)" : "var(--line)"}"></div>
        </div>
        <div style="font-size:12px;color:var(--muted)">${r.v.why} · <strong style="color:var(--ink)">${r.v.who}</strong></div>
      </div>`;
    }).join("");
  }

  root.querySelectorAll("[data-attr]").forEach((sl) => sl.addEventListener("input", () => {
    w[sl.dataset.attr] = parseInt(sl.value, 10);
    root.querySelector(`#cp-v-${sl.dataset.attr}`).textContent = sl.value;
    calc();
  }));

  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    w = Object.assign({}, PRESETS[+b.dataset.preset].w);
    root.querySelectorAll("[data-preset]").forEach((x) => x.classList.toggle("active", x === b));
    ATTRS.forEach((a) => {
      root.querySelector(`[data-attr="${a.k}"]`).value = w[a.k];
      root.querySelector(`#cp-v-${a.k}`).textContent = w[a.k];
    });
    calc();
  }));

  calc();
}
