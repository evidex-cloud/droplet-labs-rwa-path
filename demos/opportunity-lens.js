// 交互演示：机会透镜——填一份简短意向，生成三条排序过的路径、首 90 天动作与保持前沿的例行清单；最后是毕业回放。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const INTAKE = [
    { k: "bg", zh: "你的背景", en: "Your background", opts: [
      { v: "tech", zh: "技术", en: "Engineering" }, { v: "fin", zh: "金融", en: "Finance" },
      { v: "law", zh: "法律", en: "Legal" }, { v: "ops", zh: "运营", en: "Operations" },
      { v: "stu", zh: "学生/转行", en: "Student / switching" }] },
    { k: "risk", zh: "风险偏好", en: "Risk appetite", opts: [
      { v: "low", zh: "保守", en: "Conservative" }, { v: "mid", zh: "中等", en: "Moderate" }, { v: "high", zh: "进取", en: "Aggressive" }] },
    { k: "time", zh: "时间投入", en: "Time commitment", opts: [
      { v: "s", zh: "每周几小时", en: "A few hrs/week" }, { v: "m", zh: "兼职", en: "Part-time" }, { v: "l", zh: "全职", en: "Full-time" }] },
    { k: "goal", zh: "目标", en: "Goal", opts: [
      { v: "build", zh: "创业", en: "Build" }, { v: "job", zh: "就业", en: "Get hired" },
      { v: "inv", zh: "投资", en: "Invest" }, { v: "fun", zh: "兴趣", en: "Curiosity" }] },
  ];

  const PATHS = [
    { id: "svc", goal: "build", zh: "服务层运营自动化", en: "Services-layer ops automation",
      bg: { tech: 3, ops: 3, fin: 2, law: 0, stu: 1 }, time: { s: 0, m: 1, l: 3 }, risk: { low: 1, mid: 2, high: 3 },
      why: T("每个发行方都在派息、对账、预扣税上流血（阶段 8.4），现状是 Excel 加人力；无聊本身就是护城河。", "Every issuer bleeds on distributions, reconciliation, and withholding (Stage 8.4) — today it's spreadsheets plus humans. Boring is the moat."),
      a90: [T("挑 3 家中型发行方，把它们的派息与对账流程画成泳道图", "Map three mid-sized issuers' distribution and reconciliation flows as swimlanes"),
            T("做一个只解决“链上余额 vs 链下名册对账”的最小工具并找 1 家试用", "Ship a minimal tool that only reconciles on-chain balances vs the off-chain register; get one pilot"),
            T("诚实回答不公平优势测试：牌照 / 分发 / 运营，你占哪一样", "Answer the unfair-advantage test honestly: licenses, distribution, or ops — which do you hold")] },
    { id: "comp", goal: "build", zh: "合规中间件", en: "Compliance middleware",
      bg: { tech: 3, law: 3, fin: 1, ops: 1, stu: 1 }, time: { s: 0, m: 1, l: 3 }, risk: { low: 1, mid: 2, high: 3 },
      why: T("资格声明跨平台不互认（阶段 6.3），资格会过期却没人盯（阶段 7.2），跨法域可买清单各不相同。", "Eligibility claims don't travel across platforms (Stage 6.3), eligibility expires with nobody watching (Stage 7.2), and buyable lists differ by jurisdiction."),
      a90: [T("整理一张跨标准的声明格式对照表（ONCHAINID / 各平台自有体系）", "Build a cross-standard claim-format comparison table (ONCHAINID vs platform-native systems)"),
            T("做吊销状态监控的原型：资格过期即告警", "Prototype revocation monitoring: alert the moment eligibility lapses"),
            T("拿 Reg D / Reg S / MiCA 各写一套资格规则，验证引擎能同时表达", "Encode Reg D / Reg S / MiCA rule sets and verify one engine can express all three")] },
    { id: "data", goal: "build", zh: "数据与监控（RWA 界的穆迪）", en: "Data & monitoring (the Moody's of RWA)",
      bg: { tech: 3, fin: 3, ops: 1, law: 1, stu: 2 }, time: { s: 1, m: 2, l: 3 }, risk: { low: 2, mid: 3, high: 3 },
      why: T("把阶段 12.3 的清单做成产品：鉴证新鲜度、折价看板、管理员密钥监控、多链供应量对账——这把椅子是空的。", "Turn Stage 12.3's checklist into a product: attestation freshness, discount dashboards, admin-key watchers, multichain supply reconciliation — that seat is open."),
      a90: [T("对 5 个主流产品手工跑一遍清单，记录数据获取的难点", "Run the checklist by hand on five major products; log where the data is hard to get"),
            T("先做一个免费的公开看板（鉴证新鲜度 + 折价）建立信誉", "Publish a free dashboard first (attestation freshness + discount) to build credibility"),
            T("把告警做成订阅：谁最先愿意为“断流提醒”付钱", "Turn alerts into a subscription: who pays first for “feed went stale”")] },
    { id: "line", goal: "build", zh: "长尾资产装配线（贸易金融）", en: "Long-tail assembly line (trade finance)",
      bg: { ops: 3, fin: 3, law: 2, tech: 2, stu: 1 }, time: { s: 0, m: 1, l: 3 }, risk: { low: 0, mid: 2, high: 3 },
      why: T("ETDA 之后法律那根柱子立起来了（阶段 ∞.1），发票与提单标准化、现金流可测、买家真实——缺的是装配线。", "Post-ETDA the legal pillar stands (Stage ∞.1): invoices and bills of lading are standardized, cash flows measurable, buyers real — what's missing is the assembly line."),
      a90: [T("选一条贸易走廊，把单据流与法律要求逐步拆开", "Pick one trade corridor and take its document flow and legal requirements apart step by step"),
            T("找两家保理商聊：他们今天最贵的一步是什么", "Talk to two factoring firms: what's their most expensive step today"),
            T("做模板化发行套件，而不是通用平台", "Build a templated issuance kit — not a general-purpose platform")] },
    { id: "tokops", goal: "job", zh: "发行方/平台：代币运营与合规工程", en: "Issuer / platform: token ops & compliance engineering",
      bg: { tech: 3, ops: 3, fin: 2, law: 1, stu: 2 }, time: { s: 1, m: 2, l: 3 }, risk: { low: 2, mid: 3, high: 2 },
      why: T("铸造、白名单、派息执行与把规则写进 canTransfer 检查（阶段 6.2）——这类岗位要的正是“既懂链又懂运营”。", "Minting, whitelisting, distribution execution, and encoding rules into canTransfer checks (Stage 6.2) — these roles want exactly “chain plus ops.”"),
      a90: [T("在测试网部署一个 ERC-3643 代币，完整跑一遍身份注册与转账拒绝", "Deploy an ERC-3643 token on a testnet; walk identity registration and a rejected transfer end to end"),
            T("写一份 BUIDL 解剖（阶段 10.1），当作作品集", "Write a BUIDL anatomy (Stage 10.1) as a portfolio piece"),
            T("面试时白板现画风险雷达（阶段 12.1）", "Draw the risk radar (Stage 12.1) live on the whiteboard in interviews")] },
    { id: "desk", goal: "job", zh: "银行/资管：数字资产台与托管产品", en: "Bank / asset manager: digital-asset desk & custody product",
      bg: { fin: 3, ops: 3, law: 2, tech: 1, stu: 1 }, time: { s: 1, m: 2, l: 3 }, risk: { low: 3, mid: 2, high: 1 },
      why: T("岗位描述常写着“熟悉基金运营且理解链上结算”——这正是你的双证（阶段 3 + 阶段 6/8）。", "Postings routinely say “familiar with fund ops and comfortable with on-chain settlement” — precisely your dual certification (Stage 3 + Stages 6/8)."),
      a90: [T("把一只传统货币市场基金与 BUIDL 逐条对照写成两页备忘录", "Write a two-page memo comparing a traditional MMF against BUIDL line by line"),
            T("弄懂托管与过户代理的法律分工（阶段 3.4、阶段 5.3）", "Nail the legal division between custodian and transfer agent (Stages 3.4, 5.3)"),
            T("跟踪一家银行的存款代币进展，形成观点", "Track one bank's deposit-token program and form a view")] },
    { id: "trans", goal: "job", zh: "监管者/律所：翻译席", en: "Regulator / law firm: the translator seat",
      bg: { law: 3, fin: 2, ops: 1, tech: 2, stu: 2 }, time: { s: 2, m: 3, l: 3 }, risk: { low: 3, mid: 2, high: 1 },
      why: T("能把合约行为讲给监管者、把监管要求翻成产品约束的人长期紧缺（阶段 11）。", "People who can explain contract behavior to a supervisor and translate rules into product constraints stay chronically scarce (Stage 11)."),
      a90: [T("挑一条真实规则（如 Reg S 的 40 天锁定），写出它对应的链上实现", "Take one real rule (e.g. Reg S's 40-day lock) and write its on-chain implementation"),
            T("读完一份 DLT 试点/沙盒申请材料，做结构笔记", "Read a full DLT pilot / sandbox application and take structural notes"),
            T("公开发表一篇“监管者视角的智能合约风险”", "Publish one piece: “smart-contract risk from a supervisor's seat”")] },
    { id: "defi", goal: "job", zh: "DeFi 协议：RWA 集成风险", en: "DeFi protocol: RWA integration risk",
      bg: { tech: 3, fin: 3, ops: 1, law: 1, stu: 2 }, time: { s: 1, m: 2, l: 3 }, risk: { low: 1, mid: 2, high: 3 },
      why: T("协议把国债类资产收进抵押品池时，要评估赎回路径、发行方对手风险与预言机依赖（阶段 9.3）。", "When a protocol takes treasury assets into a collateral pool, someone must assess redemption paths, issuer counterparty risk, and oracle dependencies (Stage 9.3)."),
      a90: [T("给一个已上线的 RWA 抵押品写风险评估报告并公开", "Write and publish a risk assessment of one live RWA collateral asset"),
            T("模拟一次赎回挤兑：缓冲池抽干后会发生什么", "Simulate a redemption run: what happens once the buffer pool drains"),
            T("列出该协议对预言机与管理员密钥的全部依赖", "Enumerate every oracle and admin-key dependency the protocol carries")] },
    { id: "disc", goal: "inv", zh: "投资纪律路线（非投资建议）", en: "The investing-discipline path (not financial advice)",
      bg: { fin: 3, ops: 2, law: 2, tech: 2, stu: 2 }, time: { s: 3, m: 3, l: 2 }, risk: { low: 3, mid: 3, high: 2 },
      why: T("对任何仓位端到端跑工具包：12.1 形状 → 12.2 七问 → 12.3 清单 → 12.4 收益拆解；按六层而不是按产品分散。", "Run the toolkit end to end on any position: 12.1 shape → 12.2 seven questions → 12.3 checklist → 12.4 yield decomposition; diversify across the six layers, not product names."),
      a90: [T("用阶段 12 工具包写两份产品尽调备忘录并公开发布", "Write and publish two product diligence memos using the Stage 12 toolkit"),
            T("检查你现有持仓是否共用同一托管行/预言机/过户代理", "Check whether your existing positions share a custodian / oracle / transfer agent"),
            T("给每个仓位写一句“最坏情况我能拿回多少”，写不出就缩小规模", "Write one line per position: “worst case, how much comes back” — can't answer, cut the size")] },
    { id: "keep", goal: "fun", zh: "季度深潜与公开写作", en: "Quarterly deep dives & writing in public",
      bg: { stu: 3, tech: 2, fin: 2, law: 2, ops: 2 }, time: { s: 3, m: 3, l: 2 }, risk: { low: 3, mid: 3, high: 2 },
      why: T("专长靠次数复利：每季度挑一个新产品跑完整套工具包并写备忘录，四份之后你就超过大多数评论者。", "Expertise compounds through reps: one new product per quarter, the full toolkit, a written memo — after four you're ahead of most commentators."),
      a90: [T("本季度选定一个产品，走完七问与红旗清单", "Pick this quarter's product; complete the seven questions and the red-flag checklist"),
            T("建立一手信源饮食：1 数据面板 + 1 监管信源 + 2 发行方透明页", "Set the primary-source diet: 1 dashboard + 1 regulator feed + 2 issuer transparency pages"),
            T("把旧判断翻出来重新打分（校准）", "Re-score your old calls (calibration)")] },
  ];

  const ROUTINE = {
    build: T("每周：两家潜在客户访谈 · 每月：更新竞品与牌照地图 · 每季：重跑不公平优势测试", "Weekly: two customer interviews · Monthly: refresh the competitor and license map · Quarterly: re-run the unfair-advantage test"),
    job: T("每周：拆一个产品的接线图 · 每月：更新作品集（备忘录/看板）· 每季：一次白板演练（BUIDL 解剖 + 风险雷达）", "Weekly: diagram one product's wiring · Monthly: refresh the portfolio (memo/dashboard) · Quarterly: one whiteboard rehearsal (BUIDL anatomy + risk radar)"),
    inv: T("每周：查一次持仓的鉴证新鲜度与折价 · 每月：读一份监管更新 · 每季：一份新产品尽调备忘录 + 旧判断校准", "Weekly: check attestation freshness and discount on your positions · Monthly: read one regulatory update · Quarterly: one new diligence memo + calibrate old calls"),
    fun: T("每周：读一份一手材料（招股书/鉴证报告）· 每月：写一段公开笔记 · 每季：一次深潜备忘录", "Weekly: read one primary document (offering doc / attestation) · Monthly: post a public note · Quarterly: one deep-dive memo"),
  };

  const ARC = [
    T("阶段 0 · 所有权从来只是一条记录", "Stage 0 · Ownership was only ever a record"),
    T("阶段 1 · 代币在链上，资产在现实里", "Stage 1 · The token is on-chain; the asset isn't"),
    T("阶段 2 · 区块链只是一本没人能单方面改的账本", "Stage 2 · A blockchain is just a ledger nobody can unilaterally edit"),
    T("阶段 3 · T+1 的管道是用对账缝起来的", "Stage 3 · The T+1 plumbing is stitched together by reconciliation"),
    T("阶段 4 · 稳定币是第一个真正跑通的 RWA", "Stage 4 · Stablecoins were the first RWA that truly worked"),
    T("阶段 5 · 你买的不是资产，是请求权", "Stage 5 · You don't buy the asset — you buy a claim"),
    T("阶段 6 · 裸 ERC-20 装不下一只证券", "Stage 6 · A plain ERC-20 can't hold a security"),
    T("阶段 7 · 合规被写进转账前的检查里", "Stage 7 · Compliance is written into the checks before a transfer"),
    T("阶段 8 · 链是盲的，得有人给它读报纸", "Stage 8 · The chain is blind; someone must read it the news"),
    T("阶段 9 · 流动性不会因为切碎就出现", "Stage 9 · Liquidity doesn't appear just because you sliced it"),
    T("阶段 10 · BUIDL 换的是接线，不是角色", "Stage 10 · BUIDL rewired the roles without removing them"),
    T("阶段 11 · 监管者是玩家，不是裁判", "Stage 11 · Regulators are players, not referees"),
    T("阶段 12 · 收益说不清来源，就是风险没被定价", "Stage 12 · A yield you can't source is a risk you haven't priced"),
    T("阶段 13 · 你已经能从零画出这台机器", "Stage 13 · You can now draw the whole machine from scratch"),
    T("阶段 ∞ · 四根柱子，六层棋盘，和你的下一步", "Stage ∞ · Four pillars, a six-layer board, and your next move"),
  ];

  const pick = { bg: "tech", risk: "mid", time: "m", goal: "build" };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔭 机会透镜 · 把这门课换成你的下一步", "🔭 Opportunity lens · turn the course into your next move")}</div>
      <div class="demo-block" id="ol-intake"></div>
      <div class="demo-block" id="ol-paths"></div>
      <div class="demo-block" id="ol-routine"></div>
      <div class="demo-btns"><button class="demo-btn" id="ol-grad">${T("🎓 毕业：回放这条路", "🎓 Graduate: replay the path")}</button></div>
      <div id="ol-arc"></div>
      <p class="demo-tip">${T("这一课的输出不是知识，是你的下一步——<strong>选一条路，本周就走第一格</strong>。", "The output of this lesson isn't knowledge — it's your next move. <strong>Pick one path and take the first step this week.</strong>")}</p>
    </div>`;

  const intakeEl = root.querySelector("#ol-intake");
  const pathsEl = root.querySelector("#ol-paths");
  const routineEl = root.querySelector("#ol-routine");
  const arcEl = root.querySelector("#ol-arc");
  let open = null;

  function paintIntake() {
    intakeEl.innerHTML = INTAKE.map((f) => `
      <div style="margin:6px 0">
        <div class="demo-label">${T(f.zh, f.en)}</div>
        <div class="demo-switch">${f.opts.map((o) =>
          `<button class="demo-btn${pick[f.k] === o.v ? " active" : ""}" data-f="${f.k}" data-v="${o.v}">${T(o.zh, o.en)}</button>`).join("")}</div>
      </div>`).join("");
    intakeEl.querySelectorAll("[data-f]").forEach((b) =>
      b.addEventListener("click", () => { pick[b.dataset.f] = b.dataset.v; open = null; paintIntake(); paintPaths(); paintRoutine(); }));
  }

  function score(p) {
    return (p.goal === pick.goal ? 6 : 0) + (p.bg[pick.bg] || 0) * 1.5 + (p.time[pick.time] || 0) + (p.risk[pick.risk] || 0);
  }

  function paintPaths() {
    const top = PATHS.slice().sort((a, b) => score(b) - score(a)).slice(0, 3);
    pathsEl.innerHTML = `<div class="demo-label">${T("为你排序的三条路径（点开看首 90 天动作）", "Your three ranked paths (open one for the first-90-days actions)")}</div>` +
      top.map((p, i) => `
        <div style="margin:7px 0;border:1px solid ${open === p.id ? "var(--orange-line)" : "var(--line)"};border-radius:8px;overflow:hidden">
          <button class="demo-btn" data-path="${p.id}" style="width:100%;text-align:left;border:0;border-radius:0">
            <b style="color:var(--orange-ink)">#${i + 1}</b> ${T(p.zh, p.en)}
            <span class="demo-meta" style="float:right">${open === p.id ? "▾" : "▸"}</span>
          </button>
          <div class="demo-meta" style="padding:0 10px 8px;color:var(--muted)">${T("为什么给你这条", "Why this one")}: ${p.why}</div>
          ${open === p.id ? `<div style="padding:0 10px 10px">
            <div class="demo-label">${T("首 90 天", "First 90 days")}</div>
            <div class="journey">${p.a90.map((a, k) => `<div class="jstep"><div class="jn">${k + 1}</div><div><div class="jt">${a}</div></div></div>`).join("")}</div>
          </div>` : ""}
        </div>`).join("");
    pathsEl.querySelectorAll("[data-path]").forEach((b) =>
      b.addEventListener("click", () => { open = open === b.dataset.path ? null : b.dataset.path; paintPaths(); }));
  }

  function paintRoutine() {
    routineEl.innerHTML = `<div class="demo-label">${T("🧭 保持前沿：你的例行清单", "🧭 Staying current: your routine")}</div>
      <div class="demo-meta" style="padding:7px 9px;background:var(--surface-2);border-left:3px solid var(--green);border-radius:5px">${ROUTINE[pick.goal]}</div>
      <div class="demo-meta" style="margin-top:5px;color:var(--muted)">${T("一手信源饮食：1 个数据面板 + 1 个监管信源 + 2 个发行方透明度页。别用二手观点当输入。", "Primary-source diet: 1 dashboard + 1 regulator feed + 2 issuer transparency pages. Don't use second-hand opinions as inputs.")}</div>`;
  }

  root.querySelector("#ol-grad").addEventListener("click", () => {
    arcEl.innerHTML = `<div class="demo-block" id="ol-arcbox"><div class="demo-label">${T("这条路你已经走完了", "You've walked the whole path")}</div><div id="ol-lines"></div></div>`;
    const lines = arcEl.querySelector("#ol-lines");
    let i = 0;
    const tick = () => {
      if (i < ARC.length) {
        const d = document.createElement("div");
        d.className = "demo-meta";
        d.style.cssText = "margin:3px 0;color:var(--muted)";
        d.textContent = "· " + ARC[i];
        lines.appendChild(d);
        i++;
        setTimeout(tick, 260);
      } else {
        const b = document.createElement("div");
        b.className = "done-banner";
        b.style.cssText = "margin-top:10px;line-height:1.7";
        b.innerHTML = T(
          "🎓 <b>代币只是收据；信任是结构、流程与法律的手工业。</b><br>会读收据的人很多了——你现在是会审计“收据背后的整个工厂”的人。<br>路线图上最后一格是绿色的了——去用它。",
          "🎓 <b>The token is only a receipt; trust is a craft made of structure, process, and law.</b><br>Plenty can read a receipt — you can now audit the whole factory behind it.<br>The last square on the roadmap is green — go use it."
        );
        lines.appendChild(b);
      }
    };
    tick();
  });

  paintIntake(); paintPaths(); paintRoutine();
}
