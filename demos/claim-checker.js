// 交互演示：身份与声明实验室——搭建一个投资人身份、申领声明，对照三只代币的要求实时看通过/拒绝矩阵，再体验“一键撤销、处处失效”。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 声明状态：0=未申领, 1=有效, 2=已撤销
  const state = { identity: false, kyc: 0, accred: 0, country: "SG" };

  const tokens = [
    {
      name: T("🏦 国债基金", "🏦 T-bill fund"),
      req: T("要求：KYC + 合格投资者（只认 KYCPro）", "Needs: KYC + accredited (trusts KYCPro only)"),
      check: () => {
        if (!state.identity) return T("无身份合约", "no identity contract");
        if (state.kyc !== 1) return state.kyc === 2 ? T("KYC 声明已撤销", "KYC claim revoked") : T("缺 KYC 声明", "missing KYC claim");
        if (state.accred !== 1) return state.accred === 2 ? T("资格声明已撤销", "accreditation revoked") : T("缺合格投资者声明", "missing accreditation claim");
        return null;
      },
    },
    {
      name: T("📄 零售票据", "📄 Retail note"),
      req: T("要求：仅 KYC（KYCPro 或 VerifyCo 均可）", "Needs: KYC only (KYCPro or VerifyCo)"),
      check: () => {
        if (!state.identity) return T("无身份合约", "no identity contract");
        if (state.kyc !== 1) return state.kyc === 2 ? T("KYC 声明已撤销", "KYC claim revoked") : T("缺 KYC 声明", "missing KYC claim");
        return null;
      },
    },
    {
      name: T("🇪🇺 欧盟代币", "🇪🇺 EU token"),
      req: T("要求：KYC + 国家 ∈ 欧盟", "Needs: KYC + country ∈ EU"),
      check: () => {
        if (!state.identity) return T("无身份合约", "no identity contract");
        if (state.kyc !== 1) return state.kyc === 2 ? T("KYC 声明已撤销", "KYC claim revoked") : T("缺 KYC 声明", "missing KYC claim");
        if (state.country !== "DE" && state.country !== "FR") return T("国家不在欧盟（COUNTRY_BLOCKED）", "country not in EU (COUNTRY_BLOCKED)");
        return null;
      },
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🛂 身份与声明实验室", "🛂 Identity & claim lab")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("第 1 步 · 搭建投资人", "Step 1 · Build the investor")}</div>
        <div class="demo-btns">
          <button class="demo-btn" id="cc-id">${T("① 部署身份合约", "① Deploy identity contract")}</button>
          <button class="demo-btn" id="cc-kyc" disabled>${T("② 向 KYCPro 申领 KYC 声明", "② Request KYC claim from KYCPro")}</button>
          <button class="demo-btn" id="cc-acc" disabled>${T("③ 向 KYCPro 申领“合格投资者”声明", "③ Request accreditation claim from KYCPro")}</button>
        </div>
        <div style="margin-top:6px">${T("国家（存于身份注册表）：", "Country (in the identity registry): ")}
          <select id="cc-ctry">
            <option value="SG">🇸🇬 ${T("新加坡", "Singapore")}</option>
            <option value="DE">🇩🇪 ${T("德国", "Germany")}</option>
            <option value="FR">🇫🇷 ${T("法国", "France")}</option>
            <option value="US">🇺🇸 ${T("美国", "United States")}</option>
          </select>
        </div>
      </div>
      <div class="demo-block" id="cc-wallet"></div>
      <div class="demo-block">
        <div class="demo-label">${T("第 2 步 · 同一身份 × 三只代币 = 通过/拒绝矩阵", "Step 2 · One identity × three tokens = pass/fail matrix")}</div>
        <div id="cc-matrix"></div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="cc-revoke" disabled>${T("💥 撤销 KYC 声明（KYCPro 发现问题）", "💥 Revoke the KYC claim (KYCPro finds fraud)")}</button>
        <button class="demo-btn" id="cc-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <p class="demo-tip">${T("注意两件事：① 护照原文始终躺在 KYCPro 的<strong>链下保险柜</strong>，链上只有签名和哈希；② 点撤销后三只代币<strong>同时</strong>翻红——一次撤销，处处生效。身份成了可复用的“资产”，但签声明的机构也成了“基础设施”。", "Watch two things: ① the passport originals never leave KYCPro's <strong>off-chain vault</strong> — the chain holds only a signature and a hash; ② after revocation all three tokens flip red <strong>simultaneously</strong> — one revocation, effective everywhere. Identity becomes a reusable asset; the claim issuer becomes infrastructure.")}</p>
    </div>`;

  const walletEl = root.querySelector("#cc-wallet");
  const matrixEl = root.querySelector("#cc-matrix");
  const btnId = root.querySelector("#cc-id");
  const btnKyc = root.querySelector("#cc-kyc");
  const btnAcc = root.querySelector("#cc-acc");
  const btnRev = root.querySelector("#cc-revoke");

  function claimCard(topic, st, issuer, hash) {
    const color = st === 1 ? "var(--green)" : "var(--red)";
    const label = st === 1 ? T("有效", "valid") : T("已撤销", "REVOKED");
    return `<div style="border:1px solid var(--line);border-radius:8px;padding:6px 10px;margin:4px 0;background:var(--surface-2)">
      <code style="font-family:var(--mono)">topic=${topic}</code> · issuer=${issuer} ·
      <span style="color:${color};font-weight:700">${label}</span><br>
      <span style="color:var(--muted);font-size:.85em">dataHash=${hash} · ${T("有效期至 2027-01", "expires 2027-01")} · ${T("原文在 KYCPro 保险柜 🔒", "originals in KYCPro's vault 🔒")}</span>
    </div>`;
  }

  function paint() {
    btnKyc.disabled = !state.identity || state.kyc !== 0;
    btnAcc.disabled = !state.identity || state.accred !== 0;
    btnRev.disabled = state.kyc !== 1;
    btnId.disabled = state.identity;

    if (!state.identity) {
      walletEl.innerHTML = `<div class="demo-label">${T("你的身份合约", "Your identity contract")}</div><span style="color:var(--muted)">${T("（尚未部署——链上还不存在“你”）", "(not deployed — “you” don't exist on-chain yet)")}</span>`;
    } else {
      let cards = "";
      if (state.kyc) cards += claimCard("1 (KYC)", state.kyc, "KYCPro", "0x9f3a…");
      if (state.accred) cards += claimCard(T("2 (合格投资者)", "2 (accredited)"), state.accred, "KYCPro", "0x41c7…");
      if (!cards) cards = `<span style="color:var(--muted)">${T("护照夹是空的——去申领声明", "The passport holder is empty — request some claims")}</span>`;
      walletEl.innerHTML = `<div class="demo-label">${T("你的身份合约 0xID42…（护照夹）", "Your identity contract 0xID42… (passport holder)")}</div>${cards}`;
    }

    matrixEl.innerHTML = tokens.map((tk) => {
      const fail = tk.check();
      const ok = fail === null;
      return `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding:6px 0;gap:8px">
        <div><b>${tk.name}</b><br><span style="color:var(--muted);font-size:.85em">${tk.req}</span></div>
        <div style="font-weight:700;color:${ok ? "var(--green)" : "var(--red)"};text-align:right">${ok ? T("✓ 放行", "✓ pass") : `✗ ${fail}`}</div>
      </div>`;
    }).join("");
  }

  btnId.addEventListener("click", () => { state.identity = true; paint(); });
  btnKyc.addEventListener("click", () => { state.kyc = 1; paint(); });
  btnAcc.addEventListener("click", () => { state.accred = 1; paint(); });
  btnRev.addEventListener("click", () => { state.kyc = 2; paint(); });
  root.querySelector("#cc-ctry").addEventListener("change", (e) => { state.country = e.target.value; paint(); });
  root.querySelector("#cc-reset").addEventListener("click", () => {
    state.identity = false; state.kyc = 0; state.accred = 0; state.country = "SG";
    root.querySelector("#cc-ctry").value = "SG"; paint();
  });

  paint();
}
