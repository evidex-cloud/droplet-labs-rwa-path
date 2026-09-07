// 交互演示：Ondo 合规几何对比器——切换投资者画像看能买什么，逐行对比两条请求权链，再拖 USDY 的 40 天锁定时间轴。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const profiles = [
    { id: "usqp", name: T("美国 QP 机构", "US QP institution"), verdict: "OUSG", rule: T("美国人 → 走 Reg D；机构达到合格买家门槛 → OUSG 开门。USDY 反而禁止：Reg S 必须排除美国人。", "US person → Reg D path; institution clears the Qualified Purchaser bar → OUSG opens. USDY is forbidden: Reg S must exclude US persons.") },
    { id: "usretail", name: T("美国零售", "US retail"), verdict: T("都不行", "Neither"), rule: T("美国人被 Reg S 排除（USDY ✗）；又不满足 Reg D 的机构/合格门槛（OUSG ✗）。两扇门都关着——这就是几何的空角。", "Excluded from Reg S as a US person (USDY ✗); doesn't clear Reg D's institutional bar (OUSG ✗). Both doors shut — the empty corner of the geometry.") },
    { id: "sgretail", name: T("新加坡零售", "Singapore retail"), verdict: "USDY", rule: T("非美人士 → Reg S 开门，USDY 可买（KYC 后铸造，锁定 40+ 天）。OUSG 是美国 Reg D 私募，不面向他。", "Non-US person → Reg S opens; USDY is buyable (KYC, then mint with a 40+ day lock). OUSG is a US Reg D placement, not offered to them.") },
    { id: "cayman", name: T("开曼基金", "Cayman fund"), verdict: "USDY", rule: T("非美主体 → Reg S 路径，可买 USDY；锁定期满后还能把它接进 DeFi 策略。除非它够格作为美国关联机构走 OUSG 通道。", "A non-US entity → the Reg S path; can buy USDY and, after the lock, plug it into DeFi strategies. OUSG would need a qualifying US-facing route instead.") },
  ];

  const rows = [
    { k: T("请求权类型", "Claim type"), o: T("基金份额（股权型）", "Fund share (equity-style)"), u: T("有担保票据（债权型）", "Secured note (debt-style)") },
    { k: T("发行主体", "Issuer"), o: T("OUSG 基金", "The OUSG fund"), u: T("Ondo USDY LLC（破产隔离）", "Ondo USDY LLC (bankruptcy-remote)") },
    { k: T("担保 / 缓冲", "Collateral / cushion"), o: T("底层为代币化国债（含 BUIDL）", "Underlying tokenized Treasuries (incl. BUIDL)"), u: T("国债+存款抵押 · Ankura 担保代理 · 约 3% 首亏垫", "T-bills + deposits · Ankura as collateral agent · ~3% first-loss") },
    { k: T("锁定期", "Lock period"), o: T("无（但永远只能白名单内转）", "None (but whitelist-only forever)"), u: T("铸造后 40–50 天（Reg S 合规期）", "40–50 days after mint (Reg S compliance period)") },
    { k: T("转让规则", "Transferability"), o: T("每笔转账查白名单", "Every transfer checks the whitelist"), u: T("锁定期后非美人士间自由转让", "Free among non-US persons after the lock") },
    { k: T("DeFi 可用性", "DeFi usability"), o: T("✗ 进不了 DEX/借贷", "✗ can't enter DEXes/lending"), u: T("✓ 可上 DEX、当抵押品", "✓ DEX-listable, usable as collateral") },
    { k: T("收益渲染", "Yield rendering"), o: T("累积 NAV，价格上涨", "Accumulating NAV, price climbs"), u: T("USDY 价格涨 / rUSDY 余额涨", "USDY price climbs / rUSDY balance grows") },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("📐 Ondo 几何对比器：你是谁，决定你能买什么", "📐 Ondo geometry comparer: who you are decides what you can buy")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("① 选一个投资者画像：", "① Pick an investor profile:")}</div>
        <div class="demo-btns" id="oc-profiles">${profiles.map((p) => `<button class="demo-btn" data-p="${p.id}">${p.name}</button>`).join("")}</div>
        <div id="oc-verdict" style="margin-top:8px"></div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("② 两条请求权链逐行对比（悬停/点击一行高亮差异）：", "② The two claim chains, row by row (hover/click a row to highlight):")}</div>
        <div id="oc-rows"></div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("③ USDY 的一生：拖动“铸造后第 N 天”", "③ A USDY token's life: drag 'day N after mint'")}</div>
        <input type="range" id="oc-day" min="0" max="60" step="1" value="0" style="width:100%" />
        <div id="oc-lock" style="margin-top:6px"></div>
      </div>
      <p class="demo-tip">${T("一样的国债收益，两套法律几何——<strong>产品设计的自由度全在“卖给谁”这一步</strong>。", "The same Treasury yield, two legal geometries — <strong>all of the design freedom lives in the step called 'who are you selling to.'</strong>")}</p>
    </div>`;

  const verdictEl = root.querySelector("#oc-verdict");
  const rowsEl = root.querySelector("#oc-rows");
  const lockEl = root.querySelector("#oc-lock");

  function showProfile(id) {
    const p = profiles.find((x) => x.id === id);
    root.querySelectorAll("[data-p]").forEach((b) => b.classList.toggle("active", b.dataset.p === id));
    const ok = p.verdict === "OUSG" || p.verdict === "USDY";
    verdictEl.innerHTML = `
      <div style="border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--surface-2)">
        <div style="font-weight:700;color:${ok ? "var(--green)" : "var(--red)"}">${ok ? "✓ " : "✗ "}${T("可买：", "Can buy: ")}${p.verdict}</div>
        <div style="margin-top:4px;color:var(--muted);font-size:.88em">${p.rule}</div>
      </div>`;
  }

  rowsEl.innerHTML = rows.map((r, i) => `
    <div class="oc-row" data-i="${i}" style="display:grid;grid-template-columns:1fr 1.3fr 1.3fr;gap:8px;padding:6px 8px;border-bottom:1px solid var(--line);border-radius:8px;cursor:pointer">
      <div style="color:var(--muted);font-size:.85em;font-weight:600">${r.k}</div>
      <div style="font-size:.85em;color:var(--ink)"><span style="color:var(--orange-ink);font-weight:700">OUSG</span> · ${r.o}</div>
      <div style="font-size:.85em;color:var(--ink)"><span style="color:var(--orange-ink);font-weight:700">USDY</span> · ${r.u}</div>
    </div>`).join("");
  rowsEl.querySelectorAll(".oc-row").forEach((row) => {
    const hl = (on) => { row.style.background = on ? "var(--orange-soft)" : "transparent"; };
    row.addEventListener("mouseenter", () => hl(true));
    row.addEventListener("mouseleave", () => hl(false));
    row.addEventListener("click", () => hl(true));
  });

  function paintDay(d) {
    const locked = d < 44;
    const pct = Math.min(100, Math.round((d / 44) * 100));
    lockEl.innerHTML = `
      <div style="height:10px;border-radius:6px;background:var(--surface-2);overflow:hidden;border:1px solid var(--line)">
        <div style="height:100%;width:${pct}%;background:${locked ? "var(--red)" : "var(--green)"}"></div>
      </div>
      <div style="margin-top:6px;font-size:.88em;color:${locked ? "var(--red)" : "var(--green)"};font-weight:600">
        ${locked
          ? T(`第 ${d} 天：🔒 锁定中——Reg S 分销合规期（约 40–50 天），转账会被合约拒绝`, `Day ${d}: 🔒 locked — Reg S distribution compliance period (~40–50 days); transfers revert`)
          : T(`第 ${d} 天：🔓 自由转让——可在非美人士间流通、上 DEX、进 DeFi`, `Day ${d}: 🔓 freely transferable — circulates among non-US persons, DEX-listable, DeFi-ready`)}
      </div>`;
  }

  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => showProfile(b.dataset.p)));
  root.querySelector("#oc-day").addEventListener("input", (e) => paintDay(parseInt(e.target.value, 10)));
  showProfile("usqp");
  paintDay(0);
}
