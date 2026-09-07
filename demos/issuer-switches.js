// 交互演示：发行方控制台——四张工单（法院判决/制裁指定/丢钥匙+死亡证明/疑似被攻击），
// 你手握 pause/freeze/forcedTransfer/recovery/burn-remint/什么都不做六个开关，选择后评估法律必要性与比例性，
// 显示链上事件，并让“公众信任度”对越权与正确流程分别作出反应。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const switches = [
    ["pause", T("暂停全部转账 pause()", "Pause all transfers · pause()")],
    ["freeze", T("冻结该地址 setAddressFrozen()", "Freeze the address · setAddressFrozen()")],
    ["partial", T("部分冻结 freezePartialTokens()", "Partial freeze · freezePartialTokens()")],
    ["forced", T("强制转账 forcedTransfer()", "Forced transfer · forcedTransfer()")],
    ["recovery", T("地址恢复 recoveryAddress()", "Address recovery · recoveryAddress()")],
    ["burn", T("销毁并重铸 burn + mint", "Burn and re-mint")],
    ["none", T("什么都不做", "Do nothing")],
  ];

  const tickets = [
    {
      title: T("⚖️ 工单 1 · 法院判决", "⚖️ Ticket 1 · Court judgment"),
      body: T("法院终审判决：0xThief 地址上 5,000 份被盗代币，须返还受害人 0xVictim。判决书已送达，法域承认该代币为记名证券。", "A final judgment: the 5,000 stolen tokens at 0xThief must be returned to 0xVictim. The order has been served; the jurisdiction recognizes this token as a registered security."),
      best: "forced",
      verdicts: {
        forced: [10, T("✅ 正确。法院判决是 forcedTransfer 的教科书场景：有明确法律依据、范围精确（正好 5,000 份）、可事后复核。事件上链，任何人可审计。", "✅ Correct. A court judgment is the textbook case for forcedTransfer: clear legal basis, precise scope (exactly 5,000), reviewable afterwards. The event lands on-chain for anyone to audit.")],
        freeze: [-4, T("⚠️ 不足且过度。冻结整个地址既没有执行判决（受害人拿不到代币），又锁住了与本案无关的余额——比例失当。", "⚠️ Both insufficient and excessive. Freezing the whole address neither executes the judgment (the victim gets nothing) nor respects proportionality — unrelated balances are locked too.")],
        partial: [-2, T("⚠️ 只做了一半。冻住争议份额是合理的临时保全，但终审判决要求的是“返还”——最终仍需 forcedTransfer。", "⚠️ Half a job. Freezing the disputed slice is a reasonable interim hold, but a final judgment requires return — forcedTransfer is still needed.")],
        pause: [-12, T("❌ 严重越权。为了一个地址暂停全体持有人的转账，是典型的不合比例——所有无关投资人被迫承担成本。", "❌ Serious overreach. Halting every holder's transfers over one address is textbook disproportionality — all unrelated investors bear the cost.")],
        recovery: [-6, T("❌ 用错工具。recovery 是把同一投资人的余额搬到新钱包，不能用于在两个不同法律主体之间转移资产。", "❌ Wrong tool. Recovery moves one investor's balance to their own new wallet; it can't move assets between two different legal parties.")],
        burn: [-6, T("❌ 结果相近但记账错误。销毁重铸会打乱 totalSupply 与名册连续性，审计上无法解释——标准里有专门函数就该用它。", "❌ Similar outcome, wrong bookkeeping. Burn-and-remint disturbs totalSupply and register continuity and can't be explained to auditors — use the purpose-built function.")],
        none: [-14, T("❌ 不作为即违法。你受该判决约束，技术上有能力执行却不执行，构成新的法律风险（阶段 6.1 第 6 天的反面）。", "❌ Inaction is itself a violation. You are bound by the order and technically able to comply; refusing creates fresh legal exposure (the flip side of Stage 6.1's Day 6).")],
      },
    },
    {
      title: T("🚫 工单 2 · OFAC 新增制裁地址", "🚫 Ticket 2 · New OFAC sanctions designation"),
      body: T("今晨 OFAC 更新 SDN 名单，0xSanctioned 在列，其上持有 800 份。制裁为严格责任——继续为其提供金融服务即违法。", "OFAC updated the SDN list this morning; 0xSanctioned is on it, holding 800 tokens. Sanctions are strict liability — continuing to provide financial services to them is a violation."),
      best: "freeze",
      verdicts: {
        freeze: [10, T("✅ 正确。制裁指定要求立即阻断该地址的一切转移。整地址冻结此处是合比例的——制裁针对的是主体本身，不是某笔交易。", "✅ Correct. A designation requires immediately blocking all movement by that address. A full freeze is proportionate here — sanctions target the person, not one transaction.")],
        partial: [-5, T("⚠️ 不够。制裁针对主体全部资产，只冻一部分等于仍在为受制裁方服务——严格责任下没有“冻了一半”的辩护。", "⚠️ Not enough. Sanctions cover the party's entire holdings; freezing part still means servicing a sanctioned party — strict liability admits no “half-frozen” defense.")],
        forced: [-8, T("❌ 越权。制裁要求冻结（阻断），不是没收。未经许可把受制裁资产转走本身可能构成新的违规，正确做法是冻结并向监管报备。", "❌ Overreach. Sanctions require blocking, not confiscation. Moving sanctioned assets without a license may itself be a violation; freeze and report to the regulator instead.")],
        pause: [-10, T("❌ 不合比例。一个地址的制裁不该让全体持有人停摆，且全局暂停并不能满足“阻断该地址”的具体要求。", "❌ Disproportionate. One designation shouldn't halt every holder, and a global pause doesn't satisfy the specific requirement to block that address.")],
        recovery: [-8, T("❌ 用错工具，且危险。把受制裁方的资产“恢复”到别的钱包，等于协助规避制裁。", "❌ Wrong tool, and dangerous. “Recovering” a sanctioned party's assets to another wallet amounts to helping evade sanctions.")],
        burn: [-9, T("❌ 不可。销毁受制裁方的代币等于单方面消灭其财产，超出制裁要求（冻结≠没收），且无法向监管解释。", "❌ No. Burning a sanctioned party's tokens unilaterally extinguishes property beyond what sanctions require (blocking ≠ confiscation) and can't be justified to regulators.")],
        none: [-15, T("❌ 严格责任下的直接违规。“我还没来得及处理”不是抗辩理由，单笔罚款可达数十万美元起。", "❌ A direct violation under strict liability. “We hadn't gotten to it yet” is no defense; penalties start in the hundreds of thousands per transaction.")],
      },
    },
    {
      title: T("🔑 工单 3 · 持有人去世，私钥遗失", "🔑 Ticket 3 · Holder deceased, key lost"),
      body: T("持有人去世，继承人提交死亡证明、遗产法院文书与身份证明，其 ONCHAINID 身份可核验。钱包私钥随硬件钱包永久丢失，3,000 份被困。", "The holder has died. The heirs submit a death certificate, probate documents, and identity proof; the ONCHAINID identity verifies. The private key is permanently lost with the hardware wallet, stranding 3,000 tokens."),
      best: "recovery",
      verdicts: {
        recovery: [10, T("✅ 正确。这正是 recoveryAddress 的设计场景：核验身份后把新钱包绑回同一身份，余额随之迁移，名册与法律权属重新一致（阶段 5.3）。", "✅ Correct. This is exactly what recoveryAddress was designed for: verify the identity, bind the new wallet to it, migrate the balance, and realign the register with legal title (Stage 5.3).")],
        forced: [4, T("🟡 可行但不理想。结果类似，但 forcedTransfer 在审计记录里读作“强制执行”，而非“身份端点变更”——事件语义会误导后来的审阅者。", "🟡 Workable but not ideal. The outcome is similar, but forcedTransfer reads in the audit trail as an enforcement action rather than an endpoint change — misleading event semantics.")],
        burn: [-3, T("⚠️ 能达成目的，但破坏名册连续性与 totalSupply 记录，审计上难以解释——标准已提供更干净的函数。", "⚠️ It works, but it breaks register continuity and the totalSupply record, and is hard to explain in an audit — the standard offers a cleaner function.")],
        freeze: [-6, T("❌ 帮倒忙。冻结一个本就无人能动的地址毫无意义，只会让继承人更难拿回资产。", "❌ Counterproductive. Freezing an address nobody can move anyway achieves nothing and makes recovery harder for the heirs.")],
        partial: [-6, T("❌ 同上，无意义。困住的余额不需要再被冻结。", "❌ Likewise pointless. A stranded balance doesn't need freezing.")],
        pause: [-12, T("❌ 严重越权。一位持有人的继承事务，绝不应让全体投资人停止交易。", "❌ Serious overreach. One holder's probate matter must never stop trading for every investor.")],
        none: [-10, T("❌ 名册从此永久错误。法律上份额属于遗产，链上却停在死钱包——这正是阶段 6.1 第 5 天的失败。", "❌ The register is now permanently wrong. Legally the shares belong to the estate; on-chain they sit in a dead wallet — Stage 6.1's Day 5 failure exactly.")],
      },
    },
    {
      title: T("🚨 工单 4 · 合约疑似被攻击", "🚨 Ticket 4 · Suspected contract exploit"),
      body: T("监控告警：过去 10 分钟出现异常铸造模式，疑似合规模块存在漏洞被利用，攻击仍在进行中，受影响地址尚不明确。", "Monitoring alert: an abnormal minting pattern over the last 10 minutes suggests a vulnerability in a compliance module is being exploited. The attack is ongoing and the affected addresses are not yet identified."),
      best: "pause",
      verdicts: {
        pause: [10, T("✅ 正确。攻击进行中、影响面未知，全局暂停是唯一能立即止血的手段——这正是 pause 存在的理由（对应传统市场的停牌）。", "✅ Correct. With an attack in progress and unknown blast radius, a global pause is the only way to stop the bleeding immediately — precisely why pause exists (the trading halt of traditional markets).")],
        freeze: [2, T("🟡 部分有效。若已确认攻击者地址可以先冻结，但影响面未明时它拦不住尚未识别的攻击路径。", "🟡 Partially effective. Freezing a confirmed attacker address helps, but with unknown scope it won't stop attack paths you haven't identified yet.")],
        partial: [-2, T("⚠️ 太细粒度。紧急事件里精确外科手术需要时间，而攻击不会等你。", "⚠️ Too fine-grained. Precision surgery takes time in an emergency, and the attack won't wait.")],
        forced: [-6, T("❌ 顺序错了。先止血再追赃：攻击仍在进行时急于强转，只会在错误的状态上再叠一层操作。", "❌ Wrong order. Stop the bleeding before chasing assets: forcing transfers mid-attack layers actions onto a state you don't yet understand.")],
        recovery: [-8, T("❌ 完全不适用。这不是丢钥匙场景。", "❌ Entirely inapplicable. This is not a lost-key scenario.")],
        burn: [-7, T("❌ 危险。在尚未定位漏洞前销毁重铸，可能把攻击者铸出的代币“洗白”成合法余额。", "❌ Dangerous. Burning and re-minting before locating the flaw risks laundering attacker-minted supply into legitimate balances.")],
        none: [-15, T("❌ 灾难。攻击每分钟都在扩大损失，而你手里正握着刹车。", "❌ A disaster. Losses grow every minute while the brake sits in your hand.")],
      },
    },
  ];

  const events = {
    pause: "Paused(agent, block)",
    freeze: "AddressFrozen(addr, true, agent)",
    partial: "TokensFrozen(addr, amount)",
    forced: "Transfer(from, to, amount) + ForcedTransfer(agent)",
    recovery: "RecoverySuccess(lostWallet, newWallet, investorID)",
    burn: "Transfer(addr, 0x0, amount) + Transfer(0x0, addr2, amount)",
    none: T("（无事件——链上没有任何记录）", "(no event — nothing recorded on-chain)"),
  };

  let idx = 0, trust = 70, answered = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🎛 发行方控制台：你握着这只基金的管理员钥匙", "🎛 Issuer console: you hold this fund's admin keys")}</div>
      <div class="demo-block" id="is-ticket"></div>
      <div class="demo-block">
        <div class="demo-label">${T("你的开关（选一个）", "Your switches (choose one)")}</div>
        <div class="demo-btns" id="is-sw">
          ${switches.map(([k, lb]) => `<button class="demo-btn" data-s="${k}">${lb}</button>`).join("")}
        </div>
      </div>
      <div id="is-verdict"></div>
      <div class="demo-block">
        <div class="demo-label">${T("公众信任度（持有人与监管者怎么看你）", "Public-trust meter (how holders and regulators see you)")}</div>
        <div style="background:var(--surface-2);border:1px solid var(--line);border-radius:999px;height:14px;overflow:hidden">
          <div id="is-bar" style="height:100%;width:70%;background:var(--green);transition:width .4s"></div>
        </div>
        <div id="is-tnum" style="font-size:.88em;color:var(--muted);margin-top:4px"></div>
      </div>
      <div class="demo-btns"><button class="demo-btn" id="is-next" disabled>${T("下一张工单 →", "Next ticket →")}</button>
        <button class="demo-btn" id="is-reset">↺</button></div>
      <p class="demo-tip">${T("注意每一题的评分逻辑：<strong>法律是否要求</strong>、<strong>手段是否合比例</strong>、<strong>是否留下可审计的事件</strong>。开关本身不邪恶——没有流程的开关才邪恶；尽调时先问“钥匙在谁手里、动一次留什么痕”。", "Notice what each answer is scored on: <strong>is it legally required</strong>, <strong>is it proportionate</strong>, <strong>does it leave an auditable event</strong>. The switches aren't evil — switches without process are; in diligence, ask first who holds the keys and what trail one pull leaves.")}</p>
    </div>`;

  const tEl = root.querySelector("#is-ticket");
  const vEl = root.querySelector("#is-verdict");
  const bar = root.querySelector("#is-bar");
  const tnum = root.querySelector("#is-tnum");
  const nextBtn = root.querySelector("#is-next");

  function paintTicket() {
    const tk = tickets[idx];
    tEl.innerHTML = `<div style="font-weight:700;color:var(--ink);margin-bottom:4px">${tk.title} <span style="color:var(--muted);font-weight:400;font-size:.85em">(${idx + 1}/${tickets.length})</span></div>
      <div style="color:var(--ink)">${tk.body}</div>`;
    vEl.innerHTML = "";
    answered = false;
    nextBtn.disabled = true;
    root.querySelectorAll("[data-s]").forEach((b) => { b.classList.remove("active"); b.disabled = false; });
  }

  function paintTrust() {
    trust = Math.max(0, Math.min(100, trust));
    bar.style.width = trust + "%";
    bar.style.background = trust >= 70 ? "var(--green)" : trust >= 40 ? "var(--orange-ink)" : "var(--red)";
    tnum.textContent = trust + " / 100 · " + (trust >= 70
      ? T("流程可信：权力有依据、有比例、有留痕", "Trusted process: justified, proportionate, traceable")
      : trust >= 40
        ? T("受质疑：出现越权或不作为", "Under question: overreach or inaction observed")
        : T("信任崩塌：你的“开关”正在变成他人的风险", "Trust collapsed: your switches are now someone else's risk"));
  }

  function choose(key) {
    if (answered) return;
    answered = true;
    const tk = tickets[idx];
    const [delta, text] = tk.verdicts[key];
    trust += delta;
    root.querySelectorAll("[data-s]").forEach((b) => {
      b.disabled = true;
      if (b.dataset.s === key) b.classList.add("active");
    });
    const good = delta > 0;
    vEl.innerHTML = `
      <div class="${good ? "done-banner" : "demo-warn"}" style="margin:8px 0">${text}</div>
      <div class="demo-block">
        <div class="demo-label">${T("广播的链上事件", "On-chain event emitted")}</div>
        <code style="font-family:var(--mono);color:${key === "none" ? "var(--muted)" : "var(--orange-ink)"}">${events[key]}</code>
        <div style="font-size:.85em;color:var(--muted);margin-top:4px">${key === "none"
          ? T("没有动作，也就没有记录——但“不作为”同样可能是违规。", "No action means no record — but inaction can be a violation too.")
          : T("永久可查、人人可审计：这正是把“任意权力”变成“可检验执行力”的关键。", "Permanent and auditable by anyone — this is what turns arbitrary power into verifiable enforcement capability.")}</div>
        ${good ? "" : `<div style="font-size:.85em;color:var(--muted);margin-top:4px">${T("更好的选择：", "A better choice: ")}<b>${switches.find((s) => s[0] === tk.best)[1]}</b></div>`}
      </div>`;
    paintTrust();
    nextBtn.disabled = false;
    if (idx >= tickets.length - 1) nextBtn.textContent = T("✓ 全部处理完毕", "✓ All tickets handled");
  }

  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => choose(b.dataset.s)));
  nextBtn.addEventListener("click", () => {
    if (idx < tickets.length - 1) { idx++; paintTicket(); }
    else {
      nextBtn.disabled = true;
      vEl.innerHTML = `<div class="${trust >= 70 ? "done-banner" : "demo-warn"}" style="margin:8px 0">${trust >= 70
        ? T("四张工单处理完毕，信任度保持在高位——因为你每一次动用权力都有法律依据、范围相称、并留下了可审计的痕迹。<b>流程才是产品。</b>", "Four tickets handled with trust intact — because every use of power had a legal basis, matched scope, and left an auditable trail. <b>The process is the product.</b>")
        : T("四张工单处理完毕，但信任度受损。回看那几次越权或不作为：真正让持有人不安的从来不是开关的存在，而是<b>动开关时没有流程</b>。", "Four tickets handled, but trust took damage. Look back at the overreach and the inaction: what unsettles holders is never that the switches exist, but that <b>they were pulled without process</b>.")}</div>`;
    }
  });
  root.querySelector("#is-reset").addEventListener("click", () => { idx = 0; trust = 70; paintTicket(); paintTrust(); });

  paintTicket(); paintTrust();
}
