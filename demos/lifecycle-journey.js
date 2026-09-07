// 交互演示：跟拍一枚代币化国债基金份额（TBF）的一生——发起→发行→交易→赎回，含“发行方倒闭”黑暗路径。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const A = {
    mgr: T("管理人", "Manager"), inv: T("投资者", "Investor"), adm: T("管理员", "Administrator"),
    cus: T("托管行", "Custodian"), chain: T("链", "Chain"), law: T("律师", "Lawyers"), kyc: T("合规", "Compliance"),
  };

  const base = [
    { who: [A.mgr], t: T("① 发起：选定资产", "① Origination: pick the assets"), d: T("买什么？三个月期美国国库券，目标年化 ~4.5%。（阶段 3.2）", "What to buy? 3-month T-bills, targeting ~4.5% annualized. (Stage 3.2)"), art: T("📄 投资策略书", "📄 Investment strategy") },
    { who: [A.mgr, A.law], t: T("② 法律结构：设立基金/SPV", "② Legal structuring: create the fund/SPV"), d: T("独立实体持有国债；文件写明“1 枚 TBF = 该实体 1 份份额”。（阶段 5）", "An independent entity holds the T-bills; the docs define “1 TBF = 1 share of this entity.” (Stage 5)"), art: T("📄 基金合同 + 发行文件", "📄 Fund charter + offering docs") },
    { who: [A.mgr, A.kyc], t: T("③ 合规搭建：谁可以持有", "③ Compliance setup: who may hold"), d: T("定资格（如合格投资者）、接 KYC 流水线、生成链上白名单。（阶段 7）", "Set eligibility (e.g. accredited only), wire up the KYC pipeline, generate the on-chain whitelist. (Stage 7)"), art: T("🛂 白名单规则", "🛂 Whitelist rules") },
    { who: [A.mgr, A.chain], t: T("④ 技术搭建：部署合约", "④ Tech setup: deploy the contract"), d: T("选链 + 许可型标准（转账自动查资格）+ 管控开关。总供应量 = 0。（阶段 6）", "Pick a chain + a permissioned standard (transfers auto-check eligibility) + control switches. Total supply = 0. (Stage 6)"), art: T("⛓ TBF 合约上线", "⛓ TBF contract live") },
    { who: [A.inv, A.cus, A.chain], t: T("⑤ 一级发行：铸造 = 申购", "⑤ Primary issuance: mint = subscription"), d: T("投资者过 KYC → 电汇 $1,000,000 → 到账确认 → 铸造 1,000,000 枚 TBF。气闸 1 开启。（阶段 9.1）", "Investor passes KYC → wires $1,000,000 → receipt confirmed → 1,000,000 TBF minted. Airlock 1 opens. (Stage 9.1)"), art: T("🪙 +1,000,000 TBF @ $1.00", "🪙 +1,000,000 TBF @ $1.00") },
    { who: [A.adm, A.chain], t: T("⑥ 服役期：净值·派息·鉴证", "⑥ In service: NAV · yield · attestations"), d: T("每日 NAV 上链（阶段 8.2）、每月派息 ~$4,000（阶段 8.4）、定期鉴证（阶段 8.3）。", "Daily NAV posted (Stage 8.2), ~$4,000 monthly yield (Stage 8.4), periodic attestations (Stage 8.3)."), art: T("📈 NAV $1.0000 → $1.0230", "📈 NAV $1.0000 → $1.0230") },
    { who: [A.inv, A.chain], t: T("⑦ 二级转让：换手", "⑦ Secondary transfer: hands change"), d: T("卖 500,000 枚给另一位合格持有人；transfer 自动跑白名单/国别/锁定期检查。资产一动不动。（阶段 7.3）", "Sell 500,000 to another eligible holder; transfer auto-runs whitelist/country/lockup checks. The assets don't move. (Stage 7.3)"), art: T("✅ 合规检查通过 → 换手", "✅ Compliance checks pass → transfer") },
    { who: [A.inv, A.cus, A.chain], t: T("⑧ 赎回：销毁 = 拿回现金", "⑧ Redemption: burn = cash out"), d: T("赎回 500,000 枚 @ NAV $1.0230 → 销毁代币 → 电汇 $511,500。气闸 2。（阶段 9.4）", "Redeem 500,000 @ NAV $1.0230 → tokens burned → $511,500 wired. Airlock 2. (Stage 9.4)"), art: T("🔥 −500,000 TBF / 💵 $511,500", "🔥 −500,000 TBF / 💵 $511,500") },
  ];

  const finales = {
    smooth: { who: [A.chain], t: T("⑨ 环线闭合", "⑨ The loop closes"), d: T("美元 → 气闸 1 → 代币 → 记账腾挪 → 气闸 2 → 美元。中间一切都只是账本内部的数字。", "Dollars → airlock 1 → tokens → bookkeeping → airlock 2 → dollars. Everything in between was just ledger entries."), art: T("🏁 一生走完", "🏁 Journey complete"), good: true },
    fail: { who: [A.mgr, A.law], t: T("⑨ 黑暗路径：管理人破产！", "⑨ Dark path: the manager goes bankrupt!"), d: T("国债不在管理人名下，而在破产隔离的 SPV 里——债主够不着。持有人凭 TBF 按份额受偿，换管理人或有序清算退款。（阶段 5.4）", "The T-bills aren't in the manager's name — they sit in a bankruptcy-remote SPV, out of creditors' reach. Holders recover pro-rata via TBF; a new manager steps in, or an orderly wind-down returns the cash. (Stage 5.4)"), art: T("🧱 SPV 防火墙挡住了债主", "🧱 The SPV firewall holds"), bad: true },
  };

  let scen = "smooth", shown = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🚉 一枚 TBF 的一生 · 九站旅程", "🚉 The life of one TBF · a nine-stop journey")}</div>
      <div class="demo-switch">${T("剧本：", "Script: ")}
        <button class="demo-btn active" data-scen="smooth">${T("顺利申购赎回", "Smooth subscribe & redeem")}</button>
        <button class="demo-btn" data-scen="fail">${T("发行方倒闭", "Issuer fails")}</button>
      </div>
      <div class="journey" id="lj-steps"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="lj-next">${T("▶ 出发", "▶ Depart")}</button>
        <button class="demo-btn" id="lj-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <p class="demo-tip" id="lj-tip"></p>
    </div>`;

  const stepsEl = root.querySelector("#lj-steps");
  const nextBtn = root.querySelector("#lj-next");
  const tipEl = root.querySelector("#lj-tip");

  function badge(w) {
    return `<span style="display:inline-block;padding:1px 7px;margin-right:4px;border-radius:999px;background:var(--surface-2);border:1px solid var(--line);font-size:11px;color:var(--muted)">${w}</span>`;
  }

  function paint() {
    const arr = base.concat([finales[scen]]);
    let html = "";
    for (let i = 0; i < shown && i < arr.length; i++) {
      const s = arr[i];
      const col = s.bad ? "var(--red)" : s.good ? "var(--green)" : "var(--orange-ink)";
      html += `
        <div class="jstep done">
          <div class="jn">${i + 1}</div>
          <div>
            <div class="jt">${s.t} &nbsp;${s.who.map(badge).join("")}</div>
            <div class="jd">${s.d}<br><span style="color:${col};font-weight:600">${s.art}</span></div>
          </div>
        </div>`;
    }
    if (shown >= arr.length) {
      html += `<div class="done-banner" style="margin:8px 0 0">${scen === "smooth"
        ? T("✅ 旅程结束：铸造与销毁是仅有的两道气闸，中间全是记账。", "✅ Journey over: mint and burn are the only two airlocks — everything between is bookkeeping.")
        : T("🧱 灾难剧本里救你的不是链，而是第 2 站搭好的法律防火墙——阶段 5 细讲。", "🧱 In the disaster script it isn't the chain that saves you — it's the legal firewall built at stop 2. Stage 5 goes deep.")}</div>`;
    }
    stepsEl.innerHTML = html;
    nextBtn.disabled = shown >= arr.length;
    nextBtn.textContent = shown === 0 ? T("▶ 出发", "▶ Depart") : shown >= arr.length ? T("✓ 到站", "✓ Arrived") : T("▶ 下一站", "▶ Next stop");
    tipEl.innerHTML = T(
      "留意每一站的<strong>角色徽章</strong>：链只在少数站出场，大多数活是链下的人干的。切换到“发行方倒闭”，看第 9 站的分岔——<strong>SPV 防火墙</strong>如何保住持有人。",
      "Watch the <strong>actor badges</strong> at each stop: the chain appears at only a few — most of the work is done by off-chain humans. Switch to “Issuer fails” to see the fork at stop 9 — how the <strong>SPV firewall</strong> saves the holders."
    );
  }

  root.querySelectorAll("[data-scen]").forEach((b) =>
    b.addEventListener("click", () => {
      scen = b.dataset.scen;
      if (shown > 0) shown = Math.min(shown, 9);
      root.querySelectorAll("[data-scen]").forEach((x) => x.classList.toggle("active", x.dataset.scen === scen));
      paint();
    }));
  nextBtn.addEventListener("click", () => { if (shown < 9) shown++; paint(); });
  root.querySelector("#lj-reset").addEventListener("click", () => { shown = 0; paint(); });
  paint();
}
