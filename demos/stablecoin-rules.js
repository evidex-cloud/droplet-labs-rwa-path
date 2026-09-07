// 交互演示：稳定币规则映射器——自己设计一家发行方，拿去 GENIUS（美国）和 MiCA（欧盟）逐条过审。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const opts = {
    reserve: [
      { id: "hqla", label: T("短期国债 + 现金 (HQLA)", "T-bills + cash (HQLA)") },
      { id: "cp", label: T("商业票据 + 公司债", "Commercial paper + corp bonds") },
      { id: "crypto", label: T("加密资产超额抵押", "Overcollateralized crypto") },
      { id: "algo", label: T("无储备（算法/自家代币）", "No reserves (algo / own token)") },
    ],
    interest: [
      { id: "no", label: T("不付息", "No interest") },
      { id: "yes", label: T("向持有人付息", "Pays holders interest") },
    ],
    license: [
      { id: "bank", label: T("银行子公司", "Bank subsidiary") },
      { id: "nonbank", label: T("持牌非银机构", "Licensed nonbank") },
      { id: "offshore", label: T("离岸，无牌照", "Offshore, unlicensed") },
    ],
    disclose: [
      { id: "monthly", label: T("每月披露 + 高管签字", "Monthly + exec certification") },
      { id: "quarterly", label: T("季度鉴证", "Quarterly attestation") },
      { id: "none", label: T("不披露", "None") },
    ],
  };

  const presets = {
    usdc: { reserve: "hqla", interest: "no", license: "nonbank", disclose: "monthly" },
    usdt: { reserve: "cp", interest: "no", license: "offshore", disclose: "quarterly" },
    ust: { reserve: "algo", interest: "yes", license: "offshore", disclose: "none" },
  };

  const state = { reserve: "hqla", interest: "no", license: "nonbank", disclose: "monthly" };

  function judge(regime) {
    const r = [];
    const ok = (rule, pass, quote) => r.push({ rule, pass, quote });
    if (regime === "us") {
      ok(T("储备资产", "Reserves"), state.reserve === "hqla",
        T("“1:1 储备须为现金、≤93 天国债、隔夜回购或政府货币基金”——商业票据/加密/无储备均不合格", "“1:1 reserves in cash, T-bills ≤93 days, overnight repo, or gov MMFs” — CP/crypto/none all fail"));
      ok(T("付息", "Interest"), state.interest === "no",
        T("“获准发行人不得向持有人支付利息或收益”", "“Permitted issuers may not pay holders interest or yield”"));
      ok(T("牌照", "License"), state.license !== "offshore",
        T("“仅限银行子公司或获批非银机构（联邦/州双轨）”——无照发行违法", "“Bank subsidiaries or approved nonbanks only (federal/state dual track)” — unlicensed issuance is illegal"));
      ok(T("披露", "Disclosure"), state.disclose === "monthly",
        T("“每月公开储备构成，CEO/CFO 签字担责”", "“Monthly public reserve composition, CEO/CFO certification”"));
    } else {
      ok(T("授权", "Authorization"), state.license !== "offshore",
        T("“EMT 发行方须为持牌电子货币机构或信贷机构”——Tether 因此退出欧盟场内", "“EMT issuers must be licensed e-money or credit institutions” — why Tether left EU venues"));
      ok(T("储备与赎回", "Reserves & redemption"), state.reserve === "hqla" || state.reserve === "crypto",
        T("“储备隔离托管、投向受限；持有人享有随时按面值赎回的法定权利”——无储备的算法锚定无法满足赎回权", "“Segregated, restricted reserves; holders have a legal right to redeem at par” — an unreserved algo peg cannot honor it"));
      ok(T("付息", "Interest"), state.interest === "no",
        T("“EMT 不得向持有人支付利息”", "“EMTs may not pay interest to holders”"));
      ok(T("白皮书/披露", "Whitepaper/disclosure"), state.disclose !== "none",
        T("“发行前须发布白皮书并持续披露”", "“A whitepaper before issuance, with ongoing disclosure”"));
    }
    return r;
  }

  function switchRow(key, title) {
    return `<div class="demo-switch">${title}
      ${opts[key].map((o) => `<button class="demo-btn${state[key] === o.id ? " active" : ""}" data-k="${key}" data-v="${o.id}">${o.label}</button>`).join("")}
    </div>`;
  }

  function render() {
    root.innerHTML = `
      <div class="demo">
        <div class="demo-head">${T("⚖️ 规则映射器：你的稳定币能过审吗", "⚖️ Rules mapper: would your stablecoin pass")}</div>
        <div class="demo-switch">${T("预设：", "Presets: ")}
          <button class="demo-btn" data-preset="usdc">${T("像 USDC", "Like USDC")}</button>
          <button class="demo-btn" data-preset="usdt">${T("像 USDT", "Like USDT")}</button>
          <button class="demo-btn" data-preset="ust">${T("像 UST（算法）", "Like UST (algo)")}</button>
        </div>
        ${switchRow("reserve", T("储备：", "Reserves: "))}
        ${switchRow("interest", T("收益：", "Yield: "))}
        ${switchRow("license", T("牌照：", "License: "))}
        ${switchRow("disclose", T("披露：", "Disclosure: "))}
        <div class="demo-btns">
          <button class="demo-btn" id="sr-us">${T("🇺🇸 在美国上市 (GENIUS)", "🇺🇸 Launch in the US (GENIUS)")}</button>
          <button class="demo-btn" id="sr-eu">${T("🇪🇺 在欧盟上市 (MiCA)", "🇪🇺 Launch in the EU (MiCA)")}</button>
        </div>
        <div id="sr-out"></div>
        <p class="demo-tip">${T("试试“像 USDT”过 MiCA、“像 UST”过任何一边。注意两部法律殊途同归：<strong>HQLA 储备 + 持牌 + 披露 + 不付息</strong>。立法把“稳定币”钉死成“不付息的支付工具”——想要收益？欢迎来到证券法的世界（阶段 10）。", "Try running “like USDT” through MiCA, or “like UST” through either. Notice how both laws converge: <strong>HQLA reserves + a license + disclosure + no interest</strong>. Legislation pinned the “stablecoin” down as a non-yielding payment tool — want yield? Welcome to securities law (Stage 10).")}</p>
      </div>`;

    root.querySelectorAll("[data-k]").forEach((b) =>
      b.addEventListener("click", () => { state[b.dataset.k] = b.dataset.v; render(); }));
    root.querySelectorAll("[data-preset]").forEach((b) =>
      b.addEventListener("click", () => { Object.assign(state, presets[b.dataset.preset]); render(); }));
    root.querySelector("#sr-us").addEventListener("click", () => showResult("us"));
    root.querySelector("#sr-eu").addEventListener("click", () => showResult("eu"));
  }

  function showResult(regime) {
    const rows = judge(regime);
    const passed = rows.every((x) => x.pass);
    const name = regime === "us" ? T("GENIUS（美国）", "GENIUS (US)") : T("MiCA（欧盟）", "MiCA (EU)");
    root.querySelector("#sr-out").innerHTML = `
      <div class="demo-block">
        <div class="demo-label">${name} ${T("审查结果", "review result")}</div>
        ${rows.map((x) => `
          <div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid var(--line)">
            <span style="color:${x.pass ? "var(--green)" : "var(--red)"};font-weight:700">${x.pass ? "✓" : "✗"}</span>
            <div><b style="color:var(--ink)">${x.rule}</b><div style="font-size:0.85em;color:var(--muted)">${x.quote}</div></div>
          </div>`).join("")}
        ${passed
          ? `<div class="done-banner" style="margin-top:8px">${T("✅ 全部通过——欢迎进入持牌支付稳定币俱乐部。", "✅ All rules passed — welcome to the licensed payment-stablecoin club.")}</div>`
          : `<div class="demo-warn" style="margin-top:8px">${T("⚠ 未通过。修改上面的设计再试一次——或者接受现实：这个设计只能活在监管之外的灰色地带。", "⚠ Rejected. Adjust the design and retry — or accept it: this design can only live in the unregulated gray zone.")}</div>`}
      </div>`;
  }

  render();
}
