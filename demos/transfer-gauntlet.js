// 交互演示：配置 Bob 的档案，让 Alice→Bob 的 10,000 TBF 转账跑过 8 道检查站，红灯就修、修完重跑，直到结算。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const cfg = { verified: true, claimOk: false, usPerson: false, mintDays: 400, holders: 1997, bobHas: 0, sanctionHit: false, paused: false };
  const LOCK = 365, CAP = 2000, SUPPLY = 100000, CONC = 0.10, AMT = 10000;
  let running = false, timer = null;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏁 转账闯关 · Alice → Bob 卖 10,000 TBF", "🏁 The transfer gauntlet · Alice → Bob, 10,000 TBF")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("先配置这笔转账的“世界状态”：", "First, configure the world state of this transfer:")}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;font-size:.9em">
          <label><input type="checkbox" id="tg-v" checked/> ${T("Bob 已绑定验证身份", "Bob bound to a verified identity")}</label>
          <label><input type="checkbox" id="tg-c"/> ${T("Bob 合格投资者声明有效（未过期）", "Bob's accreditation claim valid (unexpired)")}</label>
          <label><input type="checkbox" id="tg-us"/> ${T("Bob 是美国人（本产品走 Reg S！）", "Bob is a US person (this product is Reg S!)")}</label>
          <label><input type="checkbox" id="tg-s"/> ${T("Bob 命中今晨更新的制裁名单", "Bob matches this morning's sanctions update")}</label>
          <label><input type="checkbox" id="tg-p"/> ${T("代币处于 pause() 暂停状态", "Token is pause()d")}</label>
        </div>
        <label class="demo-label" style="margin-top:6px">${T("Alice 这批代币铸造距今", "Days since Alice's lot was minted")}：<b id="tg-mv"></b> ${T("天（锁定期 365 天）", "days (lockup: 365)")}</label>
        <input class="demo-slider" id="tg-m" type="range" min="0" max="500" step="5" value="400"/>
        <label class="demo-label">${T("当前持有人数（上限 2000；Bob 是新持有人）", "Current holder count (cap 2,000; Bob is a new holder)")}：<b id="tg-hv"></b></label>
        <input class="demo-slider" id="tg-h" type="range" min="1990" max="2003" step="1" value="1997"/>
        <label class="demo-label">${T("Bob 已持有的 TBF（总供应 10 万，单人上限 10%）", "Bob's existing TBF (supply 100k, 10% single-holder cap)")}：<b id="tg-bv"></b></label>
        <input class="demo-slider" id="tg-b" type="range" min="0" max="8000" step="500" value="0"/>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="tg-run">${T("▶ 发起转账", "▶ Launch the transfer")}</button>
        <span class="demo-label" style="align-self:center">${T("普通 ERC-20 会跑的检查数：1（余额）", "Checks a plain ERC-20 would run: 1 (balance)")}</span>
      </div>
      <div class="journey" id="tg-out"></div>
      <p class="demo-tip">${T("默认配置会卡在<strong>声明过期</strong>——现实里最常见的失败原因。逐项修好红灯、重跑，数一数：到结算为止一共跑了 <strong>8 道检查 + 1 次余额</strong>。<strong>每一站都是某条法规编译成的 if——这就是“合规机器”的全貌。</strong>", "The default config dies at an <strong>expired claim</strong> — the most common real-world failure. Fix each red light and re-run; count them: <strong>8 checks + 1 balance read</strong> before settlement. <strong>Every station is a regulation compiled into an if — this is the whole compliance machine.</strong>")}</p>
    </div>`;

  const el = (id) => root.querySelector(id);
  const out = el("#tg-out");

  function stations() {
    const overCap = cfg.bobHas + AMT > SUPPLY * CONC;
    return [
      { t: T("① 身份绑定", "① Identity binding"), law: T("KYC 义务（阶段 7.1）", "KYC duty (Stage 7.1)"), ok: cfg.verified, code: "RECEIVER_NOT_VERIFIED" },
      { t: T("② 资格声明有效", "② Eligibility claim valid"), law: T("Reg D 合格投资者（阶段 7.2）", "Reg D accreditation (Stage 7.2)"), ok: cfg.claimOk, code: "CLAIM_EXPIRED" },
      { t: T("③ 法域检查", "③ Jurisdiction check"), law: T("Reg S：禁售美国人", "Reg S: no US persons"), ok: !cfg.usPerson, code: "JURISDICTION_BLOCKED" },
      { t: T("④ 锁定期（按批次）", "④ Lockup (per-lot)"), law: T("Rule 144：12 个月", "Rule 144: 12 months"), ok: cfg.mintDays >= LOCK, code: "LOCKUP_ACTIVE", extra: cfg.mintDays < LOCK ? T(`还剩 ${LOCK - cfg.mintDays} 天`, `${LOCK - cfg.mintDays} days remaining`) : "" },
      { t: T("⑤ 持有人数上限", "⑤ Holder-count cap"), law: T("交易法 12(g)：2000 人", "Exchange Act 12(g): 2,000"), ok: cfg.holders + 1 <= CAP, code: "HOLDER_CAP_REACHED", extra: cfg.holders + 1 > CAP ? T(`Bob 将成为第 ${cfg.holders + 1} 人`, `Bob would be holder #${cfg.holders + 1}`) : "" },
      { t: T("⑥ 集中度上限", "⑥ Concentration cap"), law: T("单一持有人 ≤10%", "Single holder ≤10%"), ok: !overCap, code: "CONCENTRATION_EXCEEDED", extra: overCap ? T(`转账后 Bob 持 ${((cfg.bobHas + AMT) / SUPPLY * 100).toFixed(1)}%`, `post-transfer Bob holds ${((cfg.bobHas + AMT) / SUPPLY * 100).toFixed(1)}%`) : "" },
      { t: T("⑦ 制裁重筛", "⑦ Sanctions re-screen"), law: T("OFAC 严格责任·名单日更", "OFAC strict liability · daily updates"), ok: !cfg.sanctionHit, code: "SANCTIONS_HIT" },
      { t: T("⑧ 暂停/冻结状态", "⑧ Pause / freeze state"), law: T("发行方开关（阶段 6.5）", "Issuer switches (Stage 6.5)"), ok: !cfg.paused, code: "TOKEN_PAUSED" },
    ];
  }

  function run() {
    if (running) return;
    running = true;
    const st = stations();
    let i = 0;
    out.innerHTML = "";
    const step = () => {
      if (i < st.length) {
        const s = st[i];
        const ok = s.ok;
        out.innerHTML += `<div class="jstep done"><div class="jn">${i + 1}</div><div>
          <div class="jt">${s.t} <span style="color:${ok ? "var(--green)" : "var(--red)"};font-weight:700">${ok ? "✓" : "✗ " + s.code}</span></div>
          <div class="jd">${T("执行的法规", "Enforces")}: ${s.law}${s.extra ? " · <span style='color:var(--red)'>" + s.extra + "</span>" : ""}</div></div></div>`;
        if (!ok) {
          out.innerHTML += `<div class="demo-warn" style="margin-top:8px">${T("⛔ 整笔转账回滚。修好上面的配置，再点“发起转账”重跑。", "⛔ Whole transfer reverted. Fix the config above and launch again.")}</div>`;
          running = false; return;
        }
        i++; timer = setTimeout(step, 350);
      } else {
        out.innerHTML += `<div class="done-banner" style="margin-top:8px">${T("✅ 8 站全绿 → 检查余额 → 结算：改余额、持有人数 +1、记录批次转移。共跑了 9 道检查。", "✅ All 8 green → balance check → settled: balances updated, holder count +1, lot movement recorded. 9 checks in total.")}</div>`;
        running = false;
      }
    };
    step();
  }

  const bind = (id, key, isCheck) => el(id).addEventListener(isCheck ? "change" : "input", (e) => {
    cfg[key] = isCheck ? e.target.checked : +e.target.value; paint();
  });
  function paint() {
    el("#tg-mv").textContent = cfg.mintDays;
    el("#tg-hv").textContent = cfg.holders;
    el("#tg-bv").textContent = cfg.bobHas;
  }
  bind("#tg-v", "verified", true); bind("#tg-c", "claimOk", true); bind("#tg-us", "usPerson", true);
  bind("#tg-s", "sanctionHit", true); bind("#tg-p", "paused", true);
  bind("#tg-m", "mintDays", false); bind("#tg-h", "holders", false); bind("#tg-b", "bobHas", false);
  el("#tg-run").addEventListener("click", () => { if (timer) clearTimeout(timer); running = false; run(); });
  paint();
}
