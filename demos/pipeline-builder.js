// 交互演示：发行流水线排序游戏——把 12 张打乱的步骤卡排成正确顺序（依赖规则会解释为什么错），
// 排对后“运行”甘特图：时间与成本累加，随机现实事件要求你选择应对，错误应对造成滑期。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const STEPS = [
    { id: 1, n: "①", t: T("资产甄选与尽调", "Asset selection & diligence"), w: 3, c: 15, own: T("发起方", "Sponsor") },
    { id: 2, n: "②", t: T("可行性与法域选择", "Feasibility & jurisdiction"), w: 4, c: 40, own: T("律师", "Counsel") },
    { id: 3, n: "③", t: T("结构设计（SPV/信托/基金）", "Structure design (SPV/trust/fund)"), w: 7, c: 180, own: T("律所", "Law firm") },
    { id: 4, n: "④", t: T("文件起草（PPM/认购）", "Document drafting (PPM/subscription)"), w: 6, c: 90, own: T("律所", "Law firm") },
    { id: 5, n: "⑤", t: T("监管路径执行（Form D 等）", "Regulatory filing (Form D etc.)"), w: 5, c: 45, own: T("合规", "Compliance") },
    { id: 6, n: "⑥", t: T("技术选型与部署（含审计）", "Tech selection & deployment (audited)"), w: 3, c: 95, own: T("CTO", "CTO") },
    { id: 7, n: "⑦", t: T("服务商签约（托管/行政/KYC）", "Sign vendors (custody/admin/KYC)"), w: 8, c: 120, own: T("运营", "Ops") },
    { id: 8, n: "⑧", t: T("合规机器点火（对抗性测试）", "Compliance machine live (adversarial tests)"), w: 3, c: 35, own: T("合规+技术", "Compliance+Eng") },
    { id: 9, n: "⑨", t: T("一级发行（认购窗口/铸造闸）", "Primary issuance (window/mint airlock)"), w: 5, c: 60, own: T("分销", "Distribution") },
    { id: 10, n: "⑩", t: T("服务化运营（NAV/分红/报告）", "Servicing ops (NAV/payouts/reports)"), w: 4, c: 130, own: T("运营团队", "Ops team") },
    { id: 11, n: "⑪", t: T("二级市场启用（ATS/DeFi）", "Enable secondary (ATS/DeFi)"), w: 6, c: 70, own: T("BD+法务", "BD+Legal") },
    { id: 12, n: "⑫", t: T("生命周期终点手册", "End-of-life runbook"), w: 2, c: 20, own: T("法务+运营", "Legal+Ops") },
  ];

  // 依赖解释：当学习者把 a 排在 b 之前而实际必须相反时给出的“为什么”
  const WHY = {
    "6<2": T("你还不知道要合规到哪国——买家决定豁免，豁免决定转账规则。技术先行 = 提前返工。", "You don't yet know which country you must comply with — buyers pick the exemption, the exemption picks the transfer rules. Tech first = rework first."),
    "6<3": T("合约的转账逻辑是结构的函数：SPV 还是基金、代币是不是登记簿，全在③决定。", "Transfer logic is a function of the structure: SPV or fund, token-as-register or not — all decided in ③."),
    "9<5": T("先发行再报备？证券法不是产品债务，不能迭代还清（阶段 12 的红旗第一条）。", "Issue first, file later? Securities law isn't product debt you can iterate away (red flag #1 in Stage 12)."),
    "11<9": T("二级市场排在一级之前 = 没有持有人的橱窗。阶段 10.6 闪回：50 个持有人的“流动性”只是一个 0 成交的挂牌。", "Secondary before primary = a shop window with no holders. Stage 10.6 flashback: “liquidity” for 50 holders is just a listing with zero volume."),
    "11<1": T("在验证需求之前就谈场地，是把“建好了没人来”写进项目计划书。", "Courting venues before validating demand writes “built it, nobody came” into your project plan."),
    "3<2": T("结构要为法域服务：先定 Reg D / Reg S / MiCA，再决定注册在哪、包成什么。", "Structure serves jurisdiction: settle Reg D / Reg S / MiCA first, then decide where to register and what shell to use."),
    "4<3": T("文件描述的是结构。结构没定，PPM 里写什么？", "Documents describe the structure. With no structure settled, what would the PPM say?"),
    "8<7": T("合规机器要接的是签下来的 KYC 供应商——供应商还没签，接什么？", "The compliance machine plugs into the KYC vendor you signed — no vendor, nothing to plug in."),
    "9<8": T("闸门没测就开门认购：合规系统的价值 100% 在它拒绝的交易上。", "Opening subscriptions before testing the gates: a compliance system's value is 100% in the transfers it refuses."),
    "10<9": T("还没发行就开始运营？可以准备，但计量从第一笔认购开始。", "Servicing before issuing? You can prepare, but the meter starts at the first subscription."),
    "1<": null,
  };

  const EVENTS = [
    {
      q: T("托管行入驻延期 6 周（他们要补审你的实体结构）", "The custodian's onboarding slips 6 weeks (they're re-reviewing your entity structure)"),
      opts: [
        { t: T("把发行窗口整体后移，并行推进⑧的对抗性测试", "Push the issuance window back and run ⑧'s adversarial tests in parallel"), dw: 6, dc: 10, ok: true, why: T("正确：吸收延期，同时把可并行的工作提前——总滑期 6 周，无返工。", "Right: absorb the delay and pull parallelizable work forward — 6 weeks total slip, no rework.") },
        { t: T("换一家更快的“托管方”（无牌照，愿意下周开户）", "Switch to a faster “custodian” (unlicensed, opens an account next week)"), dw: 1, dc: 120, ok: false, why: T("错误：把托管层风险直接买进了产品——阶段 12.3 的尽调红旗“托管方无名无姓”就是这么长出来的，后期整改代价远超延期。", "Wrong: you just bought custody-layer risk into the product — this is exactly how Stage 12.3's “unnamed custodian” red flag grows; remediation later costs far more than the delay.") },
        { t: T("先开认购、托管账户后补", "Open subscriptions now, sort custody afterwards"), dw: 3, dc: 200, ok: false, why: T("错误：钱到了没有合规托管账户接，等于挪用风险与监管风险同时点燃。", "Wrong: money arriving with no compliant custody account ignites misappropriation and regulatory risk at once.") },
      ],
    },
    {
      q: T("审计发现一个中危漏洞（铸造闸在特定顺序下可被绕过）", "The audit finds a medium-severity bug (the mint airlock can be bypassed in a specific ordering)"),
      opts: [
        { t: T("修复、重新审计变更部分、重新部署并更新已审计地址", "Fix, re-audit the delta, redeploy, and update the audited address"), dw: 2, dc: 25, ok: true, why: T("正确：而且注意——审计报告必须指向你实际部署的那个地址（阶段 12.2 第④问）。", "Right — and note: the audit report must point at the address you actually deployed (Stage 12.2, question ④).") },
        { t: T("中危而已，先上线，写进已知问题列表", "It's only medium — launch and note it as a known issue"), dw: 0, dc: 150, ok: false, why: T("错误：铸造闸是钱与代币之间的那道门，绕过它等于凭空增发。这不是中危，是你们业务的定义性风险。", "Wrong: the mint airlock is the door between money and tokens; bypassing it means minting from nothing. That's not medium — it's your business's defining risk.") },
      ],
    },
    {
      q: T("监管问询：为什么你们的官网写“随时赎回”，而 PPM 写“可暂停 90 天”？", "A regulator asks: why does your site say “redeem anytime” while the PPM says “may suspend for 90 days”?"),
      opts: [
        { t: T("立即统一口径：官网改为与文件一致，并向已认购者书面更正", "Align immediately: fix the site to match the docs and issue a written correction to subscribers"), dw: 2, dc: 30, ok: true, why: T("正确：营销话术超出文件条款是教科书级的证券欺诈定义，越早修正越便宜。", "Right: marketing promises exceeding document terms is the textbook definition of securities fraud — the earlier you fix it, the cheaper it is.") },
        { t: T("把 PPM 改成“随时赎回”以匹配官网", "Change the PPM to “redeem anytime” to match the site"), dw: 4, dc: 180, ok: false, why: T("错误：你没有能力兑现随时赎回（底层资产不是活期）。承诺流动性而不具备流动性，是挤兑的配方。", "Wrong: you can't honor anytime redemption (the underlying isn't demand-callable). Promising liquidity you lack is the recipe for a run.") },
        { t: T("暂不回复，等对方追问", "Don't reply yet; wait for a follow-up"), dw: 5, dc: 90, ok: false, why: T("错误：监管问询不会自己消失，沉默只会把它升级成检查。", "Wrong: regulatory inquiries don't evaporate; silence upgrades them into examinations.") },
      ],
    },
  ];

  let placed = [];
  let pool = STEPS.map((s) => s.id).sort(() => Math.random() - 0.5);
  let phase = "order"; // order | run | done
  let weeks = 0, cost = 0, evIdx = 0, slip = 0;
  let msg = "";
  let log = [];

  function correctOrderCheck() {
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        if (placed[i] > placed[j]) return { i, a: placed[i], b: placed[j] };
      }
    }
    return null;
  }

  function whyFor(a, b) {
    return WHY[a + "<" + b] || T("依赖冲突：第 " + b + " 步的产出是第 " + a + " 步的输入——法律定形，技术填形。", "Dependency conflict: step " + b + "'s output is step " + a + "'s input — law sets the shape, tech fills it in.");
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏭 发行流水线 · 把 12 步排对，然后运行它", "🏭 Issuance pipeline · order the 12 steps, then run it")}</div>
      <div class="demo-label" id="pl-hint"></div>
      <div class="demo-block" id="pl-pool"></div>
      <div class="demo-block" id="pl-line"></div>
      <div id="pl-msg"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="pl-undo">${T("↶ 撤回一张", "↶ Undo one")}</button>
        <button class="demo-btn" id="pl-run">${T("▶ 运行", "▶ Run")}</button>
        <button class="demo-btn" id="pl-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <p class="demo-tip">${T("流水线上最贵的不是任何一步，而是<strong>“顺序装反”的返工</strong>——法律定形，技术填形。注意运行时哪一条最长：④资产服务化那台永动机没有右边界。", "The most expensive thing on the pipeline is never a step — it's <strong>the rework from assembling it out of order</strong>. Law sets the shape; tech fills it in. When it runs, watch which bar is longest: the servicing forever-machine has no right edge.")}</p>
    </div>`;

  const poolEl = root.querySelector("#pl-pool");
  const lineEl = root.querySelector("#pl-line");
  const msgEl = root.querySelector("#pl-msg");
  const hintEl = root.querySelector("#pl-hint");

  function paint() {
    hintEl.textContent = phase === "order"
      ? T("按你认为正确的先后点击卡片（已排 " + placed.length + "/12）", "Click cards in the order you believe is correct (" + placed.length + "/12 placed)")
      : T("运行中：时间与成本累加，现实事件需要你决策", "Running: time and cost accrue; reality events need your call");

    if (phase === "order") {
      poolEl.innerHTML = `<div class="demo-label">${T("待排步骤（已打乱）", "Steps to sequence (shuffled)")}</div>` +
        (pool.length ? pool.map((id) => {
          const s = STEPS.find((x) => x.id === id);
          return `<button class="demo-btn" data-pick="${id}" style="margin:3px 4px 3px 0;font-size:11px">${s.t}</button>`;
        }).join("") : `<div class="demo-meta">${T("全部已排。点“运行”看结果。", "All placed. Hit Run.")}</div>`);
      poolEl.querySelectorAll("[data-pick]").forEach((b) =>
        b.addEventListener("click", () => {
          const id = parseInt(b.dataset.pick, 10);
          placed.push(id); pool = pool.filter((x) => x !== id); msg = ""; paint();
        }));
    } else {
      poolEl.innerHTML = `<div class="demo-label">${T("总账", "Running ledger")}</div>
        <div style="font-size:13px;color:var(--ink)">${T("已用时间", "Elapsed")}：<b style="font-family:var(--mono)">${weeks} ${T("周", "wks")}</b>
        （${(weeks / 4.33).toFixed(1)} ${T("个月", "months")}）　${T("累计支出", "Spend")}：<b style="font-family:var(--mono)">$${cost}k</b></div>
        <div style="font-size:11px;color:${slip > 6 ? "var(--red)" : "var(--muted)"};margin-top:4px">${T("因决策造成的滑期", "Slippage from your calls")}：${slip} ${T("周", "wks")}</div>`;
    }

    lineEl.innerHTML = `<div class="demo-label">${T("你的流水线", "Your pipeline")}</div>` +
      (placed.length ? placed.map((id, i) => {
        const s = STEPS.find((x) => x.id === id);
        const ran = phase !== "order" && i < evIdx * 4 + (phase === "done" ? 12 : 0);
        const barW = Math.min(100, s.w * 9);
        return `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
          <span style="font-size:10px;font-family:var(--mono);color:var(--muted);width:22px">${i + 1}.</span>
          <span style="font-size:11px;color:var(--ink);flex:0 0 190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.n} ${s.t}</span>
          <span style="display:inline-block;height:9px;width:${barW}px;border-radius:5px;background:${phase === "order" ? "var(--surface-2)" : (ran ? "var(--green-soft)" : "var(--orange-soft)")};border:1px solid var(--line)"></span>
          <span style="font-size:10px;color:var(--muted);font-family:var(--mono)">${s.w}w · $${s.c}k · ${s.own}</span>
        </div>`;
      }).join("") : `<div class="demo-meta">${T("还没有排任何一步。", "Nothing sequenced yet.")}</div>`);

    msgEl.innerHTML = msg;
  }

  function logHtml() {
    return log.join("");
  }

  function runEvent() {
    if (evIdx >= EVENTS.length) {
      phase = "done";
      const band = weeks >= 17 && weeks <= 39;
      const cband = cost >= 150 && cost <= 1000;
      msg = logHtml() + `<div class="done-banner" style="margin:8px 0">${T("✅ 首次发行完成", "✅ First issuance complete")}</div>
        <div class="demo-block" style="font-size:12px">
          <div>${T("总耗时", "Total time")}：<b style="font-family:var(--mono)">${weeks} ${T("周", "wks")} ≈ ${(weeks / 4.33).toFixed(1)} ${T("个月", "months")}</b> — ${band ? T("落在现实区间 4–9 个月 ✓", "inside the realistic 4–9 month band ✓") : T("超出现实区间 4–9 个月 ✗", "outside the realistic 4–9 month band ✗")}</div>
          <div style="margin-top:4px">${T("总支出", "Total spend")}：<b style="font-family:var(--mono)">$${cost}k</b> — ${cband ? T("落在 $150k–$1M 区间 ✓", "inside the $150k–$1M band ✓") : T("偏离 $150k–$1M 区间 ✗", "outside the $150k–$1M band ✗")}</div>
          <div style="margin-top:6px;color:var(--muted)">${T("注意构成：法律与结构约四成，技术部署只有几周。代币化不是技术项目。", "Note the composition: law and structure ≈ 40%, deployment only a couple of weeks. Tokenization is not a technology project.")}</div>
        </div>`;
      paint(); return;
    }
    const ev = EVENTS[evIdx];
    msg = logHtml() + `<div class="demo-warn" style="margin:8px 0"><b>${T("现实事件", "Reality event")} ${evIdx + 1}/${EVENTS.length}：</b>${ev.q}</div>` +
      ev.opts.map((o, i) => `<button class="demo-btn" data-opt="${i}" style="display:block;text-align:left;margin:4px 0;font-size:11px;width:100%">${o.t}</button>`).join("");
    paint();
    msgEl.querySelectorAll("[data-opt]").forEach((b) =>
      b.addEventListener("click", () => {
        const o = ev.opts[parseInt(b.dataset.opt, 10)];
        weeks += o.dw; cost += o.dc; if (!o.ok) slip += o.dw + 2;
        log.push(`<div class="demo-block" style="border-color:${o.ok ? "var(--green)" : "var(--red)"};font-size:11px;margin:6px 0"><div style="color:var(--muted)">${ev.q}</div><div style="color:${o.ok ? "var(--green)" : "var(--red)"};margin-top:3px">${o.ok ? "✓ " : "✗ "}${o.why}</div><div class="demo-meta" style="margin-top:3px">+${o.dw} ${T("周", "wks")} · +$${o.dc}k</div></div>`);
        evIdx++;
        runEvent();
      }));
  }

  root.querySelector("#pl-run").addEventListener("click", () => {
    if (phase !== "order") return;
    if (placed.length < 12) { msg = `<div class="demo-warn" style="margin-top:8px">${T("先把 12 步全部排完。", "Sequence all 12 steps first.")}</div>`; paint(); return; }
    const bad = correctOrderCheck();
    if (bad) {
      msg = `<div class="demo-warn" style="margin-top:8px"><b>${T("依赖冲突", "Dependency conflict")}：</b>${T("你把第 " + bad.a + " 步排在了第 " + bad.b + " 步之前。", "You placed step " + bad.a + " before step " + bad.b + ".")}<br><span style="color:var(--red)">→ ${whyFor(bad.a, bad.b)}</span></div>`;
      paint(); return;
    }
    phase = "run";
    weeks = STEPS.reduce((a, s) => a + s.w, 0) - 8; // ⑥⑦ 部分并行
    cost = STEPS.reduce((a, s) => a + s.c, 0);
    runEvent();
  });

  root.querySelector("#pl-undo").addEventListener("click", () => {
    if (phase !== "order" || !placed.length) return;
    pool.push(placed.pop()); msg = ""; paint();
  });

  root.querySelector("#pl-reset").addEventListener("click", () => {
    placed = []; pool = STEPS.map((s) => s.id).sort(() => Math.random() - 0.5);
    phase = "order"; weeks = 0; cost = 0; evIdx = 0; slip = 0; msg = ""; log = []; paint();
  });

  paint();
}
