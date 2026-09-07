// 交互演示：四种隐私架构 × 三类观察者，看同一笔转账各自能看到什么；附 ZK 证明 prove→verify 微流程。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 可见性：2 = 全看得见, 1 = 只看得到密文/粗粒度, 0 = 看不见
  const archs = [
    {
      id: "public", name: T("全公开链", "Fully public chain"),
      cost: T("成本：机构裸奔——策略、赎回意图、对手关系全部实时公开。可组合性满分，隐私零分。", "Cost: institutional nakedness — strategy, redemption intent, counterparty graph all public in real time. Full composability, zero privacy."),
      see: { rival: [2, 2, 2, 2], reg: [2, 2, 2, 2], cp: [2, 2, 2, 2] },
    },
    {
      id: "permissioned", name: T("许可链（Canton 型）", "Permissioned chain (Canton-style)"),
      cost: T("成本：放弃公共可组合性（阶段 2.6）——资产进不了公链 DeFi 的流动性网络。成熟度：已投产。", "Cost: public composability surrendered (Stage 2.6) — the asset can't reach public-chain DeFi liquidity. Maturity: in production."),
      see: { rival: [0, 0, 0, 0], reg: [2, 2, 2, 2], cp: [2, 2, 1, 0] },
    },
    {
      id: "zk", name: T("ZK 资格证明", "ZK eligibility proof"),
      cost: T("成本：证明生成体验重、吊销新鲜度未解、监管信任曲线刚起步。成熟度：试点。", "Cost: heavy proving UX, unsolved revocation freshness, regulator trust curve just starting. Maturity: pilots."),
      see: { rival: [2, 0, 1, 1], reg: [2, 1, 1, 1], cp: [2, 0, 1, 0] },
    },
    {
      id: "viewkey", name: T("查看密钥", "View keys"),
      cost: T("成本：难点不在密码学，在“谁有权拿钥匙”如何写进法律文件与运营流程。成熟度：技术成熟、封装中。", "Cost: the hard part isn't cryptography but writing “who may hold the key” into legal docs and operations. Maturity: technically mature, packaging in progress."),
      see: { rival: [0, 0, 0, 0], reg: [2, 2, 2, 2], cp: [2, 1, 1, 0] },
    },
  ];

  const fields = [T("金额", "Amount"), T("交易双方身份", "Parties' identities"), T("资格依据", "Eligibility basis"), T("持仓总量", "Total holdings")];
  const observers = [
    { k: "rival", icon: "🕵️", name: T("竞争对手", "Competitor"), want: T("清单：什么都不该看到", "Checklist: should see nothing"), pass: (v) => v.every((x) => x === 0) },
    { k: "reg", icon: "🏛️", name: T("监管者 / 审计师", "Regulator / auditor"), want: T("清单：身份与资格必须可核查", "Checklist: identity & eligibility must be verifiable"), pass: (v) => v[1] >= 1 && v[2] >= 1 },
    { k: "cp", icon: "🤝", name: T("交易对手", "Counterparty"), want: T("清单：够结算即可，不必看到我的持仓", "Checklist: enough to settle, but not my holdings"), pass: (v) => v[0] >= 1 && v[3] === 0 },
  ];

  let cur = 0, zkStep = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔍 隐私架构探索器 · 同一笔转账，谁看得到什么", "🔍 Privacy architecture explorer · one transfer, who sees what")}</div>
      <div class="demo-switch" id="zt-tabs"></div>
      <div class="demo-block" id="zt-panels"></div>
      <div class="demo-block" style="border-left:3px solid var(--orange-line)">
        <div class="demo-label">${T("ZK 微流程：prove → verify（载荷是布尔值，不是数据）", "ZK mini-walkthrough: prove → verify (the payload is a boolean, not data)")}</div>
        <div class="journey" id="zt-zk"></div>
        <div class="demo-btns"><button class="demo-btn" id="zt-zkbtn">${T("▶ 走一步", "▶ Step")}</button></div>
      </div>
      <p class="demo-tip">${T("四个标签逐一点过去，找哪一种能同时满足三方清单——<strong>查看密钥与 ZK 最接近，各自带一张成本卡</strong>。<strong>隐私与合规不是单选题——“向谁透明”才是正确的问题。</strong>", "Click through all four tabs and find which satisfies all three checklists — <strong>view keys and ZK come closest, each with its own cost card</strong>. <strong>Privacy and compliance aren't a multiple-choice question — “transparent to whom” is the right question.</strong>")}</p>
    </div>`;

  const el = (id) => root.querySelector(id);
  el("#zt-tabs").innerHTML = archs.map((a, i) => `<button class="demo-btn" data-a="${i}">${a.name}</button>`).join("");

  const zkSteps = [
    { t: T("① 链下发证", "① Off-chain issuance"), d: T("认证机构跑完三道闸（阶段 7.1），用私钥签发可验证凭证 → 存在你的设备里，从不上链。", "The provider runs the three gates (Stage 7.1) and signs a verifiable credential → stored on your device, never on-chain.") },
    { t: T("② 本地生成证明", "② Local proof generation"), d: T("钱包在本地计算：凭证有效 ∧ 发证方可信 ∧ 我是合格投资者 ∧ 不在制裁快照中 → 生成一个证明。凭证原文不离开设备。", "Your wallet computes locally: credential valid ∧ issuer trusted ∧ I'm accredited ∧ absent from sanctions snapshot → one proof. The credential never leaves the device.") },
    { t: T("③ 链上验证", "③ On-chain verification"), d: T("验证器合约收到证明，跑一次数学检查（几十万 gas 量级）→ 输出 true。链上没有出现你的姓名、国籍、发证方。", "The verifier contract runs one mathematical check (a few hundred thousand gas) → outputs true. No name, country, or issuer ever appears on-chain.") },
    { t: T("④ 载荷是一个比特", "④ The payload is one bit"), d: T("验证器学到的全部信息：<b>true</b>。阶段 7.3 的站①② 就这样被替换成“验证一个证明”。", "Everything the verifier learned: <b>true</b>. That's how Stage 7.3's stations ① and ② become “verify a proof.”") },
  ];

  function dot(v) {
    const map = [[T("看不见", "invisible"), "var(--muted)", "var(--surface-2)"], [T("密文/粗粒度", "ciphertext / coarse"), "var(--orange-ink)", "var(--orange-soft)"], [T("完全可见", "fully visible"), "var(--red)", "var(--red-soft)"]];
    const [txt, col, bg] = map[v];
    return `<span style="display:inline-block;padding:1px 7px;border-radius:99px;font-size:.8em;background:${bg};color:${col};border:1px solid var(--line)">${txt}</span>`;
  }

  function paint() {
    const a = archs[cur];
    el("#zt-tabs").querySelectorAll("[data-a]").forEach((b) => b.classList.toggle("active", +b.dataset.a === cur));
    el("#zt-panels").innerHTML = observers.map((o) => {
      const v = a.see[o.k], ok = o.pass(v);
      return `<div style="margin:6px 0;padding:7px 9px;border-radius:9px;background:var(--surface-2);border-left:3px solid ${ok ? "var(--green)" : "var(--red)"}">
        <div style="font-weight:700;color:var(--ink)">${o.icon} ${o.name} <span style="color:${ok ? "var(--green)" : "var(--red)"};font-size:.85em">${ok ? T("✓ 清单满足", "✓ checklist met") : T("✗ 清单不满足", "✗ checklist unmet")}</span></div>
        <div class="demo-label" style="margin:2px 0 4px">${o.want}</div>
        <div>${fields.map((f, i) => `<span style="margin-right:10px;font-size:.85em;color:var(--muted)">${f} ${dot(v[i])}</span>`).join("")}</div>
      </div>`;
    }).join("") + `<div class="demo-warn" style="margin-top:8px">${a.cost}</div>`;

    el("#zt-zk").innerHTML = zkSteps.slice(0, zkStep).map((s, i) =>
      `<div class="jstep done"><div class="jn">${i + 1}</div><div><div class="jt">${s.t}</div><div class="jd">${s.d}</div></div></div>`).join("") +
      (zkStep >= zkSteps.length ? `<div class="done-banner" style="margin-top:8px">${T("✅ 验证者确信你合格，却什么都没看到——这就是零知识。", "✅ The verifier is convinced you're eligible and saw nothing — that is zero knowledge.")}</div>` : "");
    el("#zt-zkbtn").disabled = zkStep >= zkSteps.length;
  }

  el("#zt-tabs").querySelectorAll("[data-a]").forEach((b) =>
    b.addEventListener("click", () => { cur = +b.dataset.a; paint(); }));
  el("#zt-zkbtn").addEventListener("click", () => { if (zkStep < zkSteps.length) zkStep++; paint(); });
  paint();
}
