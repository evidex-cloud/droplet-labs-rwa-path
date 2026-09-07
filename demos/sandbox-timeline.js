// 交互演示：沙盒时间线机器——2016→2026 可筛选时间线，点节点看“试了什么/发现了什么/变成了什么规则”；外加“预测下一阶段”的模式测验。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const TRACKS = [
    { k: "uk", n: T("英国", "UK") }, { k: "eu", n: T("欧盟", "EU") }, { k: "sg", n: "🇸🇬 SG" },
    { k: "hk", n: "🇭🇰 HK" }, { k: "ch", n: "🇨🇭 CH" }, { k: "bis", n: "BIS" }, { k: "us", n: T("美国", "US") },
  ];

  const NODES = [
    { y: 2016, t: "uk", n: T("FCA 监管沙盒", "FCA regulatory sandbox"),
      tried: T("全球第一个监管沙盒：企业分批进入，限客户数/金额/时长，监管专人对接。", "The world's first regulatory sandbox: firms admitted in cohorts under caps on customers, amounts and duration, each with a dedicated supervisor."),
      found: T("反复发现同一障碍：英国法只承认对有形物的“占有”，纯数字资产难以被法律“持有”。", "The same blocker kept recurring: English law recognizes possession only for tangible things, so purely digital assets are hard to legally 'hold'."),
      became: T("→ 被 50+ 法域复制；直接催生 2023 年法律委员会数字资产报告。", "→ Copied by 50+ jurisdictions; directly triggered the 2023 Law Commission digital assets report."), st: "law" },
    { y: 2021, t: "ch", n: T("瑞士 DLT 法生效", "Swiss DLT Act in force"),
      tried: T("把“账本式证券”写进《债法》——链上登记直接产生法律效力。", "Wrote 'ledger-based securities' into the Code of Obligations — an on-chain entry has direct legal effect."),
      found: T("不是试点，是直接立法：跳过沙盒阶段，先给产权地基。", "Not a pilot but legislation outright: skip the sandbox, lay the property foundation first."),
      became: T("→ SDX 拿到永久牌照（交易所+CSD 合一），成为欧盟试点制度模仿的对象。", "→ SDX received a permanent license (exchange + CSD in one), the model the EU Pilot Regime imitates."), st: "law" },
    { y: 2022, t: "sg", n: T("Guardian 首笔银行间 DeFi 外汇交易", "Guardian's first interbank DeFi FX trade"),
      tried: T("摩根大通 + DBS + SBI，在公链分叉上用改造版 DeFi 协议做代币化存款外汇与政府债券交易。", "JPMorgan + DBS + SBI executed tokenized-deposit FX and government-bond trades on a public-chain fork using modified DeFi protocols."),
      found: T("许可与无许可的混血可行：链上资格验证 + 真实机构资金跑通。", "The permissioned/permissionless hybrid works: on-chain eligibility checks plus real institutional money."),
      became: T("→ 扩展为多工作组（基金/固收）并产出行业框架文件；催生 GL1 共享账本倡议。", "→ Expanded into multiple workstreams (funds, fixed income) producing industry frameworks; spawned the GL1 shared-ledger initiative."), st: "law" },
    { y: 2023, t: "eu", n: T("欧盟 DLT 试点制度生效", "EU DLT Pilot Regime live"),
      tried: T("市场层面的豁免：DLT MTF / DLT SS / DLT TSS（交易+结算合一）豁免 CSDR、MiFID 管道规则。", "Market-level waivers: DLT MTF / DLT SS / DLT TSS (trading and settlement combined) exempted from CSDR and MiFID plumbing rules."),
      found: T("申请者寥寥——总量上限（约 60 亿欧元级）太低，机构算不过账。", "Very few applicants — aggregate caps (on the order of €6B) are too low for institutional economics."),
      became: T("→ 尚未毕业：正在评估是否上调上限（MiCA 2.0 讨论的一部分）。", "→ Hasn't graduated: caps under review as part of the MiCA 2.0 debate."), st: "purg" },
    { y: 2023, t: "hk", n: T("香港政府代币化绿债（8 亿港元）", "HK government tokenized green bond (HK$800M)"),
      tried: T("特区政府自任发行人，发行/结算/付息/兑付全流程在私有 DLT 上跑。", "The SAR government acted as issuer, running issuance, settlement, coupons and redemption end-to-end on private DLT."),
      found: T("主要经济体政府的第一只代币化政府债券——法律效力问题被从内部解决。", "The first tokenized government bond from a major government — the legal-force question settled from the inside."),
      became: T("→ 2024 年约 60 亿港元多币种绿债（汇丰 Orion 平台），并接入传统清算。", "→ A ~HK$6B multi-currency green bond in 2024 on HSBC's Orion platform, plugged into traditional clearing."), st: "law" },
    { y: 2023, t: "uk", n: T("《电子贸易单据法》", "Electronic Trade Documents Act"),
      tried: T("给提单、汇票等贸易单据的电子版与纸质版同等法律效力。", "Gave electronic bills of lading, bills of exchange and other trade documents the same legal effect as paper."),
      found: T("正是 2016 年沙盒反复发现的“占有”障碍的立法解药（法律委员会报告同年发布）。", "The legislative antidote to the 'possession' blocker the 2016 sandbox kept surfacing (the Law Commission report landed the same year)."),
      became: T("→ 数万亿美元贸易融资资产的产权地基就位——沙盒→报告→法律，用了 7 年。", "→ The property foundation for trillions in trade-finance assets — sandbox → report → law took 7 years."), st: "law" },
    { y: 2023, t: "ch", n: T("Project Helvetia：wCBDC 真实结算", "Project Helvetia: real wCBDC settlement"),
      tried: T("瑞士央行用真实批发型 CBDC（瑞郎央行货币）结算 SDX 上发行的真实数字债券。", "The SNB settled real digital bonds issued on SDX using real wholesale CBDC (central-bank francs)."),
      found: T("现金腿有解：央行货币上链后，原子化 DvP 不再是理论。", "The cash leg has an answer: with central-bank money on-ledger, atomic DvP stops being theoretical."),
      became: T("→ 从试点走向持续运行——不是试点表演，是生产系统。", "→ Moved from pilot to ongoing operation — production, not pilot theater."), st: "law" },
    { y: 2024, t: "bis", n: T("BIS 退出 Project mBridge", "BIS steps back from mBridge"),
      tried: T("多国央行共建的多边 CBDC 跨境支付平台（中国、香港、泰国、阿联酋等），已达 MVP。", "A multi-CBDC cross-border payment platform built by several central banks (China, Hong Kong, Thailand, the UAE), reaching MVP."),
      found: T("技术可行 ≠ 治理可行：跨境支付轨道本质是地缘政治问题。", "Technically feasible ≠ governable: cross-border payment rails are fundamentally geopolitical."),
      became: T("→ BIS 退出、参与方自行推进；BIS 转向 Agorá（代理行体系重建）。", "→ The BIS exited and participants continued alone; the BIS pivoted to Agorá (rebuilding correspondent banking)."), st: "purg" },
    { y: 2024, t: "uk", n: T("数字证券沙盒（DSS）", "Digital Securities Sandbox (DSS)"),
      tried: T("英格兰银行 + FCA 联合运营的市场层面试点：真实市场里做数字化发行、交易与结算。", "A market-level pilot jointly run by the Bank of England and the FCA: digitized issuance, trading and settlement in live markets."),
      found: T("已有实体获准进入；设计目标明写“为永久性规则提供依据”。", "Entrants already admitted; the design brief explicitly says it exists to supply the evidence base for permanent rules."),
      became: T("→ 预期毕业为常设制度——流水线的第 ④→⑤ 步正在进行中。", "→ Expected to graduate into a permanent regime — steps ④→⑤ of the pipeline, in progress."), st: "open" },
    { y: 2024, t: "eu", n: T("ECB 批发 DLT 结算试验", "ECB wholesale DLT settlement trials"),
      tried: T("数百亿欧元级真实交易，用央行货币与 DLT 平台联动结算（多方案并行测试）。", "Real transactions in the tens of billions of euros, settled in central-bank money linked to DLT platforms (several solutions in parallel)."),
      found: T("与 Helvetia 结论一致：技术不是瓶颈，缺的是长期性的央行货币结算安排。", "Same conclusion as Helvetia: technology isn't the bottleneck; what's missing is a durable central-bank-money settlement arrangement."),
      became: T("→ 2025 年起筹备更长期方案（阶段 11.2、∞.2）。", "→ From 2025, preparation for a longer-term facility (Stages 11.2, ∞.2)."), st: "open" },
    { y: 2025, t: "us", n: T("GENIUS 法案签署", "GENIUS Act signed"),
      tried: T("美国联邦支付稳定币框架：储备、赎回、发行方资格与监督（阶段 4.4）。", "A US federal payment-stablecoin framework: reserves, redemption, issuer eligibility and supervision (Stage 4.4)."),
      found: T("走的不是沙盒路线，而是“执法式监管”走到尽头后的直接立法。", "Not the sandbox route but direct legislation after regulation-by-enforcement hit its limits."),
      became: T("→ 市场结构法案（CLARITY 类）继续推进，划 SEC/CFTC 边界（阶段 11.1）。", "→ Market-structure bills (CLARITY-style) advance next, drawing the SEC/CFTC line (Stage 11.1)."), st: "law" },
    { y: 2025, t: "hk", n: T("香港稳定币条例生效", "Hong Kong stablecoin ordinance in force"),
      tried: T("法币稳定币发行须持牌：储备、赎回、反洗钱要求成文。", "Fiat-referenced stablecoin issuance requires a license: reserves, redemption and AML written into statute."),
      found: T("与 GENIUS、MiCA 形成第三套主要框架；Ensemble 的代币化存款实验同步推进。", "A third major framework alongside GENIUS and MiCA, alongside Ensemble's tokenized-deposit experiments."),
      became: T("→ 沙盒（Ensemble）与立法（条例）并行——亚洲枢纽的典型双轨（阶段 11.3）。", "→ Sandbox (Ensemble) and legislation (the ordinance) in parallel — the typical Asian-hub dual track (Stage 11.3)."), st: "law" },
  ];

  const QUIZ = [
    { s: T("【虚构】某国监管局宣布：向 8 家持牌银行开放“代币化存款清算沙盒”，单家上限 5000 万美元，为期 24 个月，结束须提交报告。",
           "[Fictional] A national regulator opens a 'tokenized deposit clearing sandbox' to 8 licensed banks, capped at $50M each, running 24 months, with a mandatory closing report."),
      a: "report", why: T("典型的企业层面沙盒（限参与者+限金额+限时长+退出报告）。下一步必然是那份报告——而“只对持牌银行开放”已暴露监管选定的赢家。",
                          "A classic firm-level sandbox (limited participants, amounts, duration, plus an exit report). The next step is necessarily that report — and 'licensed banks only' already reveals the regulator's chosen winners.") },
    { s: T("【虚构】三年过去：上述沙盒报告已发布，列出三大障碍（账本法律效力、现金腿、跨行互通），监管局公开征求意见。",
           "[Fictional] Three years on: that sandbox's report is published listing three blockers (ledger legal force, the cash leg, cross-bank interoperability), and the regulator opens a public consultation."),
      a: "law", why: T("报告 + 障碍清单 + 公开征求意见 = 立法草案的前奏。障碍清单就是待办法条清单——这正是英国 2016→2023 那条弧线。",
                       "Report + blocker list + public consultation = the prelude to a bill. The blocker list IS the list of provisions to draft — exactly the UK's 2016→2023 arc.") },
    { s: T("【虚构】又两年：该国通过《数字结算资产法》，承认链上记录的法律效力，并把沙盒上限提高 20 倍、向非银行机构开放。",
           "[Fictional] Two more years: the country passes a Digital Settlement Assets Act recognizing on-chain records' legal force, raises the sandbox cap 20x and opens it to non-banks."),
      a: "regime", why: T("上限大幅上调 + 准入放宽 + 立法承认，是从“沙盒”升级为“试点制度/常设制度”的标准信号（对照欧盟正在评估上调上限）。",
                          "A big cap increase + wider eligibility + statutory recognition is the standard signal of upgrading from sandbox to pilot regime or permanent regime (compare the EU reviewing its caps).") },
    { s: T("【虚构】某跨国项目达 MVP 后连续三年无新增参与者，年报只谈成功不谈障碍，两家创始机构悄悄退出。",
           "[Fictional] A cross-border project hits MVP, then goes three years with no new participants, annual notes that discuss successes but never blockers, and two founding institutions quietly withdraw."),
      a: "purgatory", why: T("教科书级“试点炼狱”症状。对照 BIS 退出 mBridge：技术不是问题，治理是。不毕业的试点是资源黑洞。",
                             "Textbook pilot-purgatory symptoms. Compare the BIS exiting mBridge: technology wasn't the problem, governance was. A pilot that never graduates is a resource sink.") },
  ];

  const STAGE_OPTS = [
    { k: "report", n: T("① 出退出报告", "① An exit report") },
    { k: "law", n: T("② 立法草案 / 征求意见", "② A bill / consultation") },
    { k: "regime", n: T("③ 升级为试点或常设制度", "③ Upgrade to a pilot or permanent regime") },
    { k: "purgatory", n: T("④ 试点炼狱（永不毕业）", "④ Pilot purgatory (never graduates)") },
  ];

  let filter = "all", sel = null, mode = "timeline", qi = 0, qscore = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🧪 沙盒时间线机器 · 2016 → 2026", "🧪 The sandbox timeline machine · 2016 → 2026")}</div>
      <div class="demo-switch" id="st-mode">
        <button class="demo-btn active" data-m="timeline">${T("时间线", "Timeline")}</button>
        <button class="demo-btn" data-m="quiz">${T("模式测验：预测下一步", "Pattern quiz: predict the next step")}</button>
      </div>
      <div id="st-body"></div>
      <p class="demo-tip">${T("沙盒报告是免费的水晶球——<strong>今天的豁免清单，就是三年后的正式规则草稿</strong>。注意红色的“试点炼狱”徽章：不毕业的试点是资源黑洞。", "A pilot report is a free crystal ball — <strong>today's waiver list is the first draft of the rules three years out</strong>. Watch the red 'pilot purgatory' badges: a pilot that never graduates is a resource sink.")}</p>
    </div>`;

  const body = root.querySelector("#st-body");

  function badge(st) {
    if (st === "law") return `<span style="font-size:10px;padding:1px 6px;border-radius:5px;background:var(--green-soft);color:var(--green);font-weight:700">${T("已成规则", "became rules")}</span>`;
    if (st === "purg") return `<span style="font-size:10px;padding:1px 6px;border-radius:5px;background:var(--red-soft);color:var(--red);font-weight:700">${T("试点炼狱", "pilot purgatory")}</span>`;
    return `<span style="font-size:10px;padding:1px 6px;border-radius:5px;background:var(--orange-soft);color:var(--orange-ink);font-weight:700">${T("进行中", "in progress")}</span>`;
  }

  function paintTimeline() {
    const shown = NODES.filter((n) => filter === "all" || n.t === filter);
    let h = `<div class="demo-switch"><button class="demo-btn${filter === "all" ? " active" : ""}" data-f="all">${T("全部", "All")}</button>` +
      TRACKS.map((t) => `<button class="demo-btn${filter === t.k ? " active" : ""}" data-f="${t.k}">${t.n}</button>`).join("") + `</div>`;
    h += `<div class="journey">`;
    shown.forEach((n, i) => {
      const isSel = sel === NODES.indexOf(n);
      h += `<div class="jstep" data-n="${NODES.indexOf(n)}" style="cursor:pointer">
        <div class="jn" style="font-family:var(--mono);font-size:11px">${n.y}</div>
        <div style="flex:1">
          <div class="jt">${n.n} ${badge(n.st)}</div>
          ${isSel ? `<div class="jd" style="margin-top:4px">
            <div><b>${T("试了什么", "What was tried")}：</b>${n.tried}</div>
            <div style="margin-top:3px"><b>${T("发现了什么", "What was found")}：</b>${n.found}</div>
            <div style="margin-top:3px;color:var(--orange-ink)"><b>${T("变成了什么", "What it became")}：</b>${n.became}</div>
          </div>` : `<div class="jd" style="color:var(--muted)">${T("点击查看：试了什么 / 发现了什么 / 变成了什么规则", "Click for: what was tried / found / what it became")}</div>`}
        </div></div>`;
    });
    h += `</div>`;
    body.innerHTML = h;
    body.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.f; sel = null; paintTimeline(); }));
    body.querySelectorAll("[data-n]").forEach((b) => b.addEventListener("click", () => {
      const i = +b.dataset.n; sel = sel === i ? null : i; paintTimeline();
    }));
  }

  function paintQuiz() {
    if (qi >= QUIZ.length) {
      body.innerHTML = `<div class="demo-block"><div class="done-banner">${T(`✅ 测验完成：${qscore}/${QUIZ.length}。你已经会用生命周期模型预测规则了。`, `✅ Quiz complete: ${qscore}/${QUIZ.length}. You can now predict rules with the lifecycle model.`)}</div>
        <div class="demo-btns"><button class="demo-btn" id="st-again">${T("↺ 再来一遍", "↺ Run it again")}</button></div></div>`;
      root.querySelector("#st-again").addEventListener("click", () => { qi = 0; qscore = 0; paintQuiz(); });
      return;
    }
    const q = QUIZ[qi];
    body.innerHTML = `<div class="demo-block">
      <div class="demo-label">${T("预测下一阶段", "Predict the next stage")} ${qi + 1}/${QUIZ.length}</div>
      <div style="color:var(--ink);margin:6px 0">${q.s}</div>
      <div class="demo-btns">${STAGE_OPTS.map((o) => `<button class="demo-btn" data-q="${o.k}">${o.n}</button>`).join("")}</div>
      <div id="st-fb" style="font-size:13px;margin-top:8px"></div></div>`;
    body.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.q === q.a;
      if (ok) qscore++;
      body.querySelector("#st-fb").innerHTML =
        `<div style="color:${ok ? "var(--green)" : "var(--red)"};font-weight:700">${ok ? T("✅ 对了", "✅ Correct") : T("❌ 不对——正确答案：", "❌ Not quite — correct answer: ") + (ok ? "" : STAGE_OPTS.find((o) => o.k === q.a).n)}</div>
         <div style="color:var(--muted);margin-top:4px">${q.why}</div>
         <div class="demo-btns" style="margin-top:6px"><button class="demo-btn" id="st-next">${T("▶ 下一题", "▶ Next")}</button></div>`;
      body.querySelector("#st-next").addEventListener("click", () => { qi++; paintQuiz(); });
    }));
  }

  root.querySelectorAll("#st-mode [data-m]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    root.querySelectorAll("#st-mode [data-m]").forEach((x) => x.classList.toggle("active", x.dataset.m === mode));
    if (mode === "timeline") paintTimeline(); else { qi = 0; qscore = 0; paintQuiz(); }
  }));

  paintTimeline();
}
