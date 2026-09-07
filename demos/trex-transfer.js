// 交互演示：ERC-3643 转账安检流水线——配置接收方与代币规则，看一笔 transfer 逐站过检或在哪一站被拦下。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const presets = {
    happy: { label: T("✅ 一路绿灯", "✅ Happy path"), cfg: { id: true, valid: true, trusted: true, ctryOk: true, lock: false, cap: false, forced: false } },
    expired: { label: T("⏰ 声明过期", "⏰ Expired claim"), cfg: { id: true, valid: false, trusted: true, ctryOk: true, lock: false, cap: false, forced: false } },
    untrusted: { label: T("🕵️ 签发者不可信", "🕵️ Untrusted issuer"), cfg: { id: true, valid: true, trusted: false, ctryOk: true, lock: false, cap: false, forced: false } },
    country: { label: T("🌍 国别封禁", "🌍 Country blocked"), cfg: { id: true, valid: true, trusted: true, ctryOk: false, lock: false, cap: false, forced: false } },
    forced: { label: T("⚖️ 代理强制转账", "⚖️ Agent forcedTransfer"), cfg: { id: true, valid: false, trusted: false, ctryOk: false, lock: true, cap: false, forced: true } },
  };
  let cfg = Object.assign({}, presets.happy.cfg);
  let timer = null;

  const toggles = [
    ["id", T("接收方已注册身份（ONCHAINID）", "Receiver has a registered identity (ONCHAINID)")],
    ["valid", T("KYC 声明有效（未过期/未撤销）", "KYC claim valid (not expired / revoked)")],
    ["trusted", T("声明签发者在可信名单里", "Claim issuer is on the trusted list")],
    ["ctryOk", T("接收方国家不在封禁名单", "Receiver's country is not blocked")],
    ["lock", T("锁定期仍在生效", "Lockup still active")],
    ["cap", T("持有人数已达上限（接收方是新持有人）", "Holder cap reached (receiver is a new holder)")],
    ["forced", T("由代理调用 forcedTransfer", "Called by agent via forcedTransfer")],
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🦖 T-REX 转账安检台", "🦖 The T-REX transfer gauntlet")}</div>
      <div class="demo-switch" id="tt-presets">${T("场景：", "Scenario: ")}${Object.keys(presets).map((k) => `<button class="demo-btn" data-p="${k}">${presets[k].label}</button>`).join("")}</div>
      <div class="demo-block" id="tt-cfg">
        <div class="demo-label">${T("参数（可手动改）", "Parameters (editable)")}</div>
        ${toggles.map(([k, lb]) => `<label style="display:block;margin:3px 0;font-size:.92em;color:var(--ink)"><input type="checkbox" data-k="${k}"> ${lb}</label>`).join("")}
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="tt-run">${T("▶ 执行 transfer(to, 1000)", "▶ Run transfer(to, 1000)")}</button>
      </div>
      <div class="journey" id="tt-pipe"></div>
      <div id="tt-result"></div>
      <p class="demo-tip">${T("检查顺序与真实 T-REX 一致：先认人（isVerified），再问规则（canTransfer），全过才 _transfer。注意 <strong>forcedTransfer</strong> 会跳过安检——这不是漏洞，是执行法院判决的必备通道（阶段 6.5）。", "The check order matches real T-REX: identity first (isVerified), then rules (canTransfer), and only then _transfer. Note that <strong>forcedTransfer</strong> bypasses the gauntlet — not a bug, but the mandatory lane for executing court orders (Stage 6.5).")}</p>
    </div>`;

  const pipeEl = root.querySelector("#tt-pipe");
  const resEl = root.querySelector("#tt-result");

  function syncBoxes() {
    root.querySelectorAll("#tt-cfg input").forEach((b) => { b.checked = !!cfg[b.dataset.k]; });
  }

  function stations() {
    return [
      { name: "identityRegistry.isVerified(to)", sub: T("身份存在？", "identity exists?"), ok: cfg.id, err: "RECEIVER_NOT_VERIFIED" },
      { name: T("声明有效性检查", "claim validity check"), sub: T("必需主题的声明未过期/未撤销？", "required-topic claims unexpired / unrevoked?"), ok: cfg.valid, err: "CLAIM_EXPIRED_OR_REVOKED" },
      { name: T("签发者信任检查", "issuer trust check"), sub: T("签发者在 Trusted Issuers Registry？", "issuer in the Trusted Issuers Registry?"), ok: cfg.trusted, err: "ISSUER_NOT_TRUSTED" },
      { name: "compliance.canTransfer()", sub: T("国家模块投票", "country module votes"), ok: cfg.ctryOk, err: "COUNTRY_BLOCKED" },
      { name: "compliance.canTransfer()", sub: T("锁定期模块投票", "lockup module votes"), ok: !cfg.lock, err: "LOCKUP_ACTIVE" },
      { name: "compliance.canTransfer()", sub: T("持有人数模块投票", "holder-cap module votes"), ok: !cfg.cap, err: "HOLDER_CAP_REACHED" },
    ];
  }

  function run() {
    if (timer) clearInterval(timer);
    resEl.innerHTML = "";
    const st = stations();
    if (cfg.forced) {
      pipeEl.innerHTML = `<div class="jstep done"><div class="jn">⚖</div><div><div class="jt">forcedTransfer(from, to, 1000)</div><div class="jd" style="color:var(--orange-ink)">${T("代理权限：跳过全部安检站，直接 _transfer 并广播事件。", "Agent power: skips every checkpoint, calls _transfer directly and emits events.")}</div></div></div>`;
      resEl.innerHTML = `<div class="demo-warn">${T("✔ 转账完成（强制）。事件已上链、全网可见——权力可用，但必留痕。", "✔ Transfer completed (forced). Events are on-chain for all to see — power usable, trail mandatory.")}</div>`;
      return;
    }
    let i = 0, blocked = false;
    pipeEl.innerHTML = "";
    timer = setInterval(() => {
      if (i >= st.length || blocked) {
        clearInterval(timer); timer = null;
        if (!blocked) {
          pipeEl.innerHTML += `<div class="jstep done"><div class="jn">✓</div><div><div class="jt">_transfer(from, to, 1000)</div><div class="jd" style="color:var(--green)">${T("余额划转，Transfer 事件广播，compliance 更新计数。", "Balances move, Transfer event emitted, compliance counters updated.")}</div></div></div>`;
          resEl.innerHTML = `<div class="done-banner">${T("✅ 全部安检通过——这笔转账既是链上事实，也是合规事实。", "✅ All checks passed — this transfer is both an on-chain fact and a compliant one.")}</div>`;
        }
        return;
      }
      const s = st[i];
      const pass = s.ok;
      pipeEl.innerHTML += `
        <div class="jstep done">
          <div class="jn">${i + 1}</div>
          <div>
            <div class="jt"><code style="font-family:var(--mono)">${s.name}</code></div>
            <div class="jd">${s.sub} → ${pass ? `<span style="color:var(--green);font-weight:700">${T("通过 ✓", "pass ✓")}</span>` : `<span style="color:var(--red);font-weight:700">revert: ${s.err}</span>`}</div>
          </div>
        </div>`;
      if (!pass) {
        blocked = true;
        resEl.innerHTML = `<div class="demo-warn">⛔ ${T("交易回滚。链上状态未变，前端可把原因翻译给用户：", "Transaction reverted. No state changed; the front end can translate the reason: ")}<code>${s.err}</code></div>`;
      }
      i++;
    }, 420);
  }

  root.querySelectorAll("[data-p]").forEach((b) =>
    b.addEventListener("click", () => {
      cfg = Object.assign({}, presets[b.dataset.p].cfg);
      root.querySelectorAll("[data-p]").forEach((x) => x.classList.toggle("active", x === b));
      syncBoxes(); run();
    }));
  root.querySelectorAll("#tt-cfg input").forEach((b) =>
    b.addEventListener("change", () => { cfg[b.dataset.k] = b.checked; }));
  root.querySelector("#tt-run").addEventListener("click", run);

  root.querySelector('[data-p="happy"]').classList.add("active");
  syncBoxes();
}
