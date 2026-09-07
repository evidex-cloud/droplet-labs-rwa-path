// 交互演示：破产隔离防火墙模拟器——直接发行 vs SPV 结构，触发“母公司破产 / 假出售 / 资产从未交割”，看两边持有人各拿回多少。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  let scen = "calm"; // calm | bk | fake | fraud
  let recov = 40;    // unsecured recovery, cents on the dollar

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔥 防火墙模拟器：谁的破产烧到谁", "🔥 Firewall simulator: whose bankruptcy burns whom")}</div>
      <div class="demo-switch">
        <button class="demo-btn" data-s="calm">${T("风平浪静", "Calm")}</button>
        <button class="demo-btn" data-s="bk">${T("💥 母公司破产！", "💥 Parent goes bankrupt!")}</button>
        <button class="demo-btn" data-s="fake">${T("💥 破产 + 假出售", "💥 Bankruptcy + defective true sale")}</button>
        <button class="demo-btn" data-s="fraud">${T("🕳 资产从未交割（欺诈）", "🕳 Assets never delivered (fraud)")}</button>
      </div>
      <div class="demo-block">
        <label class="demo-label">${T("无担保债权人的清偿率（历史破产案常见 10–60¢）", "Unsecured recovery rate (10–60¢ typical in real bankruptcies)")}：<b id="fw-recov">40¢ / $1</b></label>
        <input class="demo-slider" id="fw-slider" type="range" min="0" max="100" step="5" value="40" />
      </div>
      <div id="fw-cols" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div>
      <div id="fw-note"></div>
      <p class="demo-tip">${T("SPV 挡得住<strong>“别人的破产”</strong>：真实出售把资产切出母公司的破产财产。但“假出售”会被法院追回、“资产从未交割”则两种结构一起完蛋——<strong>结构管归属，验证管存在</strong>。", "The SPV blocks <strong>other people's bankruptcies</strong>: a true sale carves the assets out of the parent's estate. But a defective sale gets clawed back, and 'assets never delivered' kills both architectures — <strong>structure governs ownership, verification governs existence</strong>.")}</p>
    </div>`;

  const cols = root.querySelector("#fw-cols");
  const note = root.querySelector("#fw-note");

  function card(title, lines, holderLine, bad) {
    return `<div class="demo-block" style="margin:0;border:1px solid ${bad ? "var(--red)" : "var(--line)"}">
      <div style="font-weight:700;color:var(--ink);margin-bottom:6px">${title}</div>
      ${lines.map((l) => `<div style="font-size:12px;margin:3px 0;color:${l.c || "var(--muted)"}">${l.t}</div>`).join("")}
      <div style="margin-top:8px;padding:6px 8px;border-radius:8px;background:${bad ? "var(--red-soft)" : "var(--green-soft)"};font-size:12px;font-weight:700;color:${bad ? "var(--red)" : "var(--green)"}">${holderLine}</div>
    </div>`;
  }

  function paint() {
    root.querySelectorAll("[data-s]").forEach((b) => b.classList.toggle("active", b.dataset.s === scen));
    const ok = T("✅ 持有人：资产 100% 仍归你们", "✅ Holders: assets 100% still yours");
    let A, B, msg = "";

    if (scen === "calm") {
      A = card(T("A · 直接发行", "A · Direct issuance"),
        [{ t: T("OperatingCo 名下：国债 + 贷款业务 + 房租工资", "OperatingCo holds: Treasuries + loan book + payroll & rent") }],
        T("😌 持有人：一切正常（但资产和别人的生意在一锅里）", "😌 Holders: all fine (but assets share a pot with other business)"), false);
      B = card(T("B · SPV 结构", "B · SPV structure"),
        [{ t: T("发起方 —真实出售→ SPV（只持资产、只发凭证）", "Originator —true sale→ SPV (holds assets, issues claims, nothing else)") }],
        ok, false);
      msg = T("现在点“母公司破产”，看两种结构各自的下场。", "Now hit 'Parent goes bankrupt' and watch each architecture's fate.");
    } else if (scen === "bk") {
      A = card(T("A · 直接发行", "A · Direct issuance"),
        [{ t: T("💥 贷款业务爆雷 → OperatingCo 资不抵债", "💥 Loan book blows up → OperatingCo insolvent"), c: "var(--red)" },
         { t: T("法院：名下一切（含国债）进破产财产", "Court: everything in its name (incl. Treasuries) enters the estate"), c: "var(--red)" },
         { t: T("清偿顺位：担保债权人 → 管理费 → 员工/税 → 你", "Waterfall: secured → admin → wages/tax → you") }],
        T(`⚠ 持有人 = 无担保债权人：拿回约 ${recov}¢ / $1（历时数年）`, `⚠ Holders = unsecured creditors: recover ~${recov}¢ / $1 (over years)`), true);
      B = card(T("B · SPV 结构", "B · SPV structure"),
        [{ t: T("💥 发起方破产 → 债主冲向资产……", "💥 Originator fails → creditors rush the assets…"), c: "var(--red)" },
         { t: T("🧱 防火墙：资产已真实出售给 SPV，不在破产财产内", "🧱 Firewall: assets were truly sold to the SPV — outside the estate"), c: "var(--green)" },
         { t: T("独立董事拒绝把 SPV 拖入破产；备份服务商接管", "Independent director blocks a filing; backup servicer steps in") }],
        ok, false);
      msg = T("同一场破产，两种命运。差别只在“资产登记在谁名下”。", "Same bankruptcy, two fates. The only difference: whose name the assets are in.");
    } else if (scen === "fake") {
      A = card(T("A · 直接发行", "A · Direct issuance"),
        [{ t: T("💥 破产（同前）", "💥 Bankruptcy (as before)"), c: "var(--red)" }],
        T(`⚠ 持有人拿回约 ${recov}¢ / $1`, `⚠ Holders recover ~${recov}¢ / $1`), true);
      B = card(T("B · SPV 结构（但出售有瑕疵）", "B · SPV (but the sale was defective)"),
        [{ t: T("发起方留了回购权 + 对价明显偏低……", "Originator kept a buy-back right + off-market price…"), c: "var(--red)" },
         { t: T("法院：这实质是担保借款，不是出售", "Court: in substance a secured loan, not a sale"), c: "var(--red)" },
         { t: T("🧱→💨 资产被追回（claw back）进破产财产", "🧱→💨 Assets clawed back into the estate"), c: "var(--red)" }],
        T(`⚠ 防火墙塌了：持有人同样排队，约 ${recov}¢ / $1`, `⚠ Wall down: holders queue too, ~${recov}¢ / $1`), true);
      msg = T("SPV 三个字母救不了你——真实出售做得不干净，一纸判决墙就没了。", "The letters S-P-V won't save you — a dirty true sale and one ruling erases the wall.");
    } else {
      A = card(T("A · 直接发行", "A · Direct issuance"),
        [{ t: T("🕳 “国债”从未买入 / 从未过户", "🕳 The 'Treasuries' were never bought / never transferred"), c: "var(--red)" }],
        T("💀 持有人：收据背后是空的", "💀 Holders: the receipt points at nothing"), true);
      B = card(T("B · SPV 结构", "B · SPV structure"),
        [{ t: T("🕳 章程完美，但 SPV 里从来就没有资产", "🕳 Perfect charter — but no assets ever entered the SPV"), c: "var(--red)" },
         { t: T("你隔离的是一个空壳", "You segregated an empty shell"), c: "var(--red)" }],
        T("💀 持有人：结构再好也隔离不出资产来", "💀 Holders: no structure can segregate assets into existence"), true);
      msg = T("这种火只有“验证”能防：托管对账 + 储备证明（阶段 8.3）+ 审计。结构管归属，验证管存在。", "Only verification stops this fire: custody reconciliation + proof of reserve (Stage 8.3) + audits. Structure governs ownership; verification governs existence.");
    }

    cols.innerHTML = A + B;
    note.innerHTML = `<div class="${scen === "fraud" || scen === "fake" ? "demo-warn" : "demo-block"}" style="margin-top:10px;font-size:12px">${msg}</div>`;
  }

  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { scen = b.dataset.s; paint(); }));
  root.querySelector("#fw-slider").addEventListener("input", (e) => {
    recov = parseInt(e.target.value);
    root.querySelector("#fw-recov").textContent = recov + "¢ / $1";
    paint();
  });

  paint();
}
