// 交互演示：产权绑定场景机——选“镜像登记 / 链即登记”制度，跑“被盗 / 分叉 / 误转 / 去世”四个事故，逐步看法律归属与救济。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const S = {
    theft: {
      name: T("🦹 被盗", "🦹 Theft"),
      mirror: [
        T("小偷骗走私钥，链上把代币转进自己地址", "Thief phishes the key, moves tokens to his address on-chain"),
        T("但官方名册在链下——名册没更新（或拒绝更新）", "But the official register is off-chain — it never updates (or refuses to)"),
        T("法律所有权从未转移：名册上还是你", "Legal title never moved: the register still says you"),
        T("救济：发行方依名册在链上恢复你的余额 ✅ 快、确定", "Remedy: issuer restores your on-chain balance per the register ✅ fast, certain"),
      ],
      chain: [
        T("小偷骗走私钥，链上转走代币——而链就是登记册！", "Thief phishes the key and moves the tokens — and the chain IS the register!"),
        T("小偷现在“登记在册”……但登记 ≠ 合法取得", "The thief is now 'on the register'… but registration ≠ lawful acquisition"),
        T("法院认定：盗窃不转移所有权", "Court holds: theft passes no title"),
        T("救济：法院命令发行方 forcedTransfer 强制转回（阶段 6.5 的开关）——前提是标准里有这个开关 ⚠", "Remedy: court orders the issuer to forcedTransfer it back (Stage 6.5's switch) — IF the standard has the switch ⚠"),
      ],
    },
    fork: {
      name: T("🔱 分叉", "🔱 Fork"),
      mirror: [
        T("链分叉成两条，两条链上都有“你的代币”", "The chain splits — 'your tokens' now exist on both branches"),
        T("不慌：链只是影子，名册只有一本", "No panic: the chain is a shadow, and there's only one register"),
        T("发行方声明追随哪条链，名册照常运转", "The issuer declares which branch it follows; the register runs on"),
        T("救济：几乎不需要——法律世界没分叉 ✅", "Remedy: barely needed — the legal world never forked ✅"),
      ],
      chain: [
        T("链分叉成两条——哪条是“官方登记册”？", "The chain splits — which branch is THE official register?"),
        T("如果发行文件事先指定了权威链：按文件办 ✅", "If the offering docs pre-designated the canonical chain: follow the docs ✅"),
        T("如果没写：两边持有人都主张权利，一份资产两张凭证 ⚠", "If they didn't: holders on both branches claim the rights — one asset, two receipts ⚠"),
        T("教训：制度②下，发行文件必须点名权威账本", "Lesson: under regime ②, the docs must name the authoritative ledger"),
      ],
    },
    fatfinger: {
      name: T("🫠 误转", "🫠 Fat-finger"),
      mirror: [
        T("你想转 0x8a3f…，手滑转给了陌生人 0x8a3e…", "You meant 0x8a3f… but sent to a stranger at 0x8a3e…"),
        T("名册可拒绝确认这笔“无转让意思”的转移", "The register can refuse to recognize a transfer made with no intent"),
        T("法律所有权仍在你处，链上做一笔修正", "Legal title stays with you; a correcting entry fixes the chain"),
        T("救济：找发行方即可 ✅ 不用找到陌生人", "Remedy: go to the issuer ✅ no need to find the stranger"),
      ],
      chain: [
        T("你想转 0x8a3f…，手滑转给了陌生人 0x8a3e…", "You meant 0x8a3f… but sent to a stranger at 0x8a3e…"),
        T("链即登记：所有权表面上真的转移了", "Chain as register: title has, on its face, transferred"),
        T("你的武器：不当得利之诉——对方无合法原因受益，应返还", "Your weapon: an unjust-enrichment claim — benefit without legal cause must be returned"),
        T("现实难题：对方是谁？去哪国告？匿名地址 + 跨境 = 漫长 ⚠ 或说服发行方启用恢复机制", "Reality: who are they? Where to sue? Anonymous address + borders = a long road ⚠ or persuade the issuer to invoke recovery"),
      ],
    },
    death: {
      name: T("🪦 持有人去世", "🪦 Holder dies"),
      mirror: [
        T("持有人去世，私钥无人知晓", "The holder dies; nobody knows the private key"),
        T("份额法律上属于遗产——名册认遗嘱认证文书", "The shares legally belong to the estate — the register honors probate papers"),
        T("名册改登继承人，链上重发余额", "The register re-registers the heir; the balance is re-issued on-chain"),
        T("救济：走继承程序即可 ✅ 私钥丢了不丢权利", "Remedy: standard probate ✅ a lost key doesn't lose the right"),
      ],
      chain: [
        T("持有人去世，私钥随人而去——链只认私钥，不认法院文书", "The holder dies with the key — the chain honors keys, not court paperwork"),
        T("份额法律上属于遗产，继承人凭 probate 主张", "The shares legally belong to the estate; heirs claim through probate"),
        T("法院命令发行方用 recoveryAddress 类机制把份额重铸到继承人地址", "A court orders the issuer to re-mint the position to the heir via a recoveryAddress-style mechanism"),
        T("能恢复 = 有开关 = 有守门人 ⚠ 纯 ERC-20 无解", "Recoverable = a switch = a gatekeeper ⚠ plain ERC-20 has no answer"),
      ],
    },
  };

  let regime = "mirror", inc = "theft", shown = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("⚖️ 产权绑定场景机：转了代币，权利跟着走吗？", "⚖️ Title-binding scenario machine: does the right follow the token?")}</div>
      <div class="demo-switch">${T("制度：", "Regime: ")}
        <button class="demo-btn" data-r="mirror">${T("① 镜像登记（名册为王）", "① Mirror (register rules)")}</button>
        <button class="demo-btn" data-r="chain">${T("② 链即登记（账本为王）", "② Chain-as-register (ledger rules)")}</button>
      </div>
      <div class="demo-switch">${T("事故：", "Incident: ")}
        ${Object.keys(S).map((k) => `<button class="demo-btn" data-i="${k}">${S[k].name}</button>`).join("")}
      </div>
      <div class="journey" id="tb-steps"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="tb-next">${T("▶ 走一步", "▶ Step")}</button>
        <button class="demo-btn" id="tb-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="tb-score"></div>
      <p class="demo-tip">${T("<strong>“链即登记”不是技术选择，是立法选择</strong>——先问“哪国法律认这本账”。注意制度②里每条救济都以“标准里有开关 + 文件写清楚”为前提：三个因子相乘，缺一个就是零。", "<strong>'Chain as register' is not a technical choice — it's a legislative one</strong>: first ask which country's law recognizes this ledger. And note that every regime-② remedy presumes 'the standard has the switch + the docs spell it out': three factors multiplied — one zero and the product is zero.")}</p>
    </div>`;

  const stepsEl = root.querySelector("#tb-steps");
  const nextBtn = root.querySelector("#tb-next");
  const scoreEl = root.querySelector("#tb-score");

  function scorecard() {
    const rows = [
      [T("确定性（谁拥有什么）", "Certainty (who owns what)"), T("高——名册一锤定音", "High — the register settles it"), T("取决于法条+文件写没写全", "Depends on statute + docs completeness")],
      [T("救济速度", "Remedy speed"), T("快——找发行方改名册", "Fast — issuer amends the register"), T("可能要过法院，以月计", "May run through courts, months")],
      [T("去中心化纯度", "Decentralization purity"), T("低——中心化守门人", "Low — a central gatekeeper"), T("较高——但恢复开关也是守门人", "Higher — though recovery switches are gatekeepers too")],
    ];
    return `<div class="demo-block" style="margin-top:8px"><div class="demo-label">${T("对照记分卡", "Comparison scorecard")}</div>
      ${rows.map((r) => `<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:6px;font-size:11px;padding:4px 0;border-bottom:1px solid var(--line)">
        <div style="color:var(--ink);font-weight:600">${r[0]}</div>
        <div style="color:${regime === "mirror" ? "var(--orange-ink)" : "var(--muted)"}">① ${r[1]}</div>
        <div style="color:${regime === "chain" ? "var(--orange-ink)" : "var(--muted)"}">② ${r[2]}</div>
      </div>`).join("")}</div>`;
  }

  function paint() {
    root.querySelectorAll("[data-r]").forEach((b) => b.classList.toggle("active", b.dataset.r === regime));
    root.querySelectorAll("[data-i]").forEach((b) => b.classList.toggle("active", b.dataset.i === inc));
    const arr = S[inc][regime];
    let html = "";
    for (let i = 0; i < shown && i < arr.length; i++) {
      const last = i === arr.length - 1;
      html += `<div class="jstep done"><div class="jn">${i + 1}</div><div><div class="jt" style="${last ? "color:var(--orange-ink)" : ""}">${arr[i]}</div></div></div>`;
    }
    stepsEl.innerHTML = html;
    scoreEl.innerHTML = shown >= arr.length ? scorecard() : "";
    nextBtn.disabled = shown >= arr.length;
    nextBtn.textContent = shown === 0 ? T("▶ 事故发生", "▶ Incident strikes") : shown >= arr.length ? T("✓ 完成", "✓ Done") : T("▶ 走一步", "▶ Step");
  }

  root.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => { regime = b.dataset.r; shown = 0; paint(); }));
  root.querySelectorAll("[data-i]").forEach((b) => b.addEventListener("click", () => { inc = b.dataset.i; shown = 0; paint(); }));
  nextBtn.addEventListener("click", () => { if (shown < S[inc][regime].length) shown++; paint(); });
  root.querySelector("#tb-reset").addEventListener("click", () => { shown = 0; paint(); });

  paint();
}
