// 交互演示：把 5 份申请人档案依次推过 KYC / AML / 制裁三道闸，看每道闸各查什么、在哪儿卡住。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const PASS = "pass", COND = "cond", FAIL = "fail";
  const applicants = [
    {
      name: T("美国零售投资者（档案干净）", "US retail investor (clean file)"),
      dossier: T("护照真实 · 工资收入 · 钱包无污点 · 无名单匹配", "Genuine passport · salary income · untainted wallet · no list match"),
      gates: [
        { s: PASS, d: T("证件核验 ✓ 活体+人脸比对 0.97 ✓ 非 PEP ✓", "Docs verified ✓ liveness + face match 0.97 ✓ not a PEP ✓") },
        { s: PASS, d: T("资金来源=工资（税单佐证）✓ 无可疑模式 ✓", "Source of funds = salary (tax returns) ✓ no suspicious patterns ✓") },
        { s: PASS, d: T("SDN 无匹配 ✓ 法域=US 允许 ✓ 地址筛查：无污染源 ✓", "No SDN match ✓ jurisdiction US allowed ✓ address screen: no taint ✓") },
      ],
      verdict: { ok: true, txt: T("✅ 三闸全过 → 签发链上声明，进入白名单。", "✅ All three gates passed → claim issued, whitelisted.") },
    },
    {
      name: T("英国公司（30% 股东身份不明）", "UK company (murky 30% owner)"),
      dossier: T("公司注册真实 · 股权穿透：A 40%、B 30%（经两层 BVI 壳，拒绝提供证件）", "Real registration · ownership tree: A 40%, B 30% (behind two BVI shells, refuses ID)"),
      gates: [
        { s: FAIL, d: T("UBO 穿透：持股 >25% 的 B 无法完成个人 KYC → 闸① 卡死", "UBO look-through: B holds >25% but can't complete individual KYC → gate ① halts") },
      ],
      verdict: { ok: false, txt: T("❌ 拒绝：受益所有人穿透失败。壳公司叠壳公司，正是为了藏住这一步要找的人。", "❌ Rejected: UBO look-through failed. Stacked shells exist precisely to hide the person this step looks for.") },
    },
    {
      name: T("政治公众人物（PEP）", "Politically exposed person (PEP)"),
      dossier: T("某国前部长的女儿 · 证件真实 · 资金为家族企业分红", "Daughter of a former minister · genuine documents · funds from family-business dividends"),
      gates: [
        { s: COND, d: T("证件 ✓ 但 PEP 命中 → 触发加强尽调（EDD），不是拒绝！", "Docs ✓ but PEP hit → triggers enhanced due diligence (EDD), NOT rejection!") },
        { s: COND, d: T("资金来源要求更高：企业审计报告 + 分红决议均已提供 ✓", "Higher bar on source of funds: audited accounts + dividend resolutions provided ✓") },
        { s: PASS, d: T("SDN 无匹配 ✓ 法域允许 ✓ 钱包干净 ✓", "No SDN match ✓ jurisdiction allowed ✓ wallet clean ✓") },
      ],
      verdict: { ok: true, txt: T("✅ 有条件通过：签发声明 + 挂“加强持续监控”标签。PEP 是加强审查的触发器，不是自动拒绝。", "✅ Approved with conditions: claim issued + tagged for enhanced ongoing monitoring. PEP triggers scrutiny, not auto-rejection.") },
    },
    {
      name: T("干净的人 + 脏的钱包", "Clean person + tainted wallet"),
      dossier: T("身份完美 · 资金为卖房所得（有凭证）· 但钱包 2 跳前收过混币器流出的资金", "Perfect identity · house-sale proceeds (documented) · but wallet received mixer-linked funds 2 hops back"),
      gates: [
        { s: PASS, d: T("证件 ✓ 活体 ✓ 非 PEP ✓", "Docs ✓ liveness ✓ not a PEP ✓") },
        { s: PASS, d: T("卖房合同 + 银行流水齐全 ✓", "Sale contract + bank statements complete ✓") },
        { s: FAIL, d: T("名单无匹配 ✓ 但地址筛查：2 跳内触及 Tornado Cash 聚类 → 红灯", "No list match ✓ but address screen: Tornado Cash cluster within 2 hops → red") },
      ],
      verdict: { ok: false, txt: T("⚠️ 转人工复核：要求解释资金路径，或换一个干净钱包。传统金融没有这道闸——链上有。", "⚠️ Escalated to manual review: explain the fund path, or use a clean wallet. TradFi doesn't have this gate — chains do.") },
    },
    {
      name: T("受制裁法域居民", "Resident of a sanctioned country"),
      dossier: T("证件真实 · 资金为多年经商积蓄 · 居住地=全面制裁法域", "Genuine documents · savings from years of business · residence = comprehensively sanctioned jurisdiction"),
      gates: [
        { s: PASS, d: T("证件本身真实 ✓ 活体 ✓", "Documents themselves genuine ✓ liveness ✓") },
        { s: PASS, d: T("资金来源可解释 ✓", "Source of funds explainable ✓") },
        { s: FAIL, d: T("法域封锁：IP / 证件签发国 / 居住地址三重命中 → 严格责任，无裁量空间", "Jurisdiction block: IP / issuing country / address all hit → strict liability, zero discretion") },
      ],
      verdict: { ok: false, txt: T("❌ 拒绝：身份真实、钱也干净都救不了——制裁筛查只问“名单/法域命中没有”。", "❌ Rejected: genuine identity and clean money can't help — sanctions asks only “is there a list/jurisdiction hit.”") },
    },
  ];

  const gateNames = [T("闸① KYC：你是谁", "Gate ① KYC: who are you"), T("闸② AML：钱干净吗", "Gate ② AML: is the money clean"), T("闸③ 制裁：名单上有你吗", "Gate ③ Sanctions: are you listed")];
  let cur = 0, shown = 0;
  const seen = new Set();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🚧 三道闸处理器 · 5 份档案逐一过闸", "🚧 The three-gate processor · run 5 dossiers through")}</div>
      <div class="demo-switch" id="kg-who"></div>
      <div class="demo-block">
        <div class="demo-label">${T("档案摘要", "Dossier")}</div>
        <div id="kg-dossier" style="color:var(--ink);font-size:.92em"></div>
      </div>
      <div class="journey" id="kg-gates"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="kg-next">${T("▶ 推入下一道闸", "▶ Push through next gate")}</button>
        <span class="demo-label" id="kg-score" style="align-self:center"></span>
      </div>
      <p class="demo-tip">${T("<strong>三道闸查的是三个不同的问题：你是谁、钱干净吗、名单上有你吗。</strong>留意：PEP 是“加强审查”而非自动拒绝；而脏钱包和法域命中，再完美的身份也救不回来。", "<strong>The three gates ask three different questions: who are you, is the money clean, are you on a list.</strong> Notice: a PEP gets extra scrutiny, not auto-rejection — while a tainted wallet or a jurisdiction hit can't be saved by a perfect identity.")}</p>
    </div>`;

  const whoEl = root.querySelector("#kg-who");
  whoEl.innerHTML = applicants.map((a, i) => `<button class="demo-btn" data-i="${i}">${i + 1}. ${a.name}</button>`).join("");

  function paint() {
    const a = applicants[cur];
    root.querySelector("#kg-dossier").textContent = a.dossier;
    let html = "";
    for (let i = 0; i < shown && i < a.gates.length; i++) {
      const g = a.gates[i];
      const col = g.s === FAIL ? "var(--red)" : g.s === COND ? "var(--orange-ink)" : "var(--green)";
      const tag = g.s === FAIL ? T("✗ 卡住", "✗ halted") : g.s === COND ? T("△ 有条件", "△ conditional") : T("✓ 通过", "✓ pass");
      html += `<div class="jstep done"><div class="jn">${i + 1}</div><div>
        <div class="jt">${gateNames[i]} <span style="color:${col};font-weight:700">${tag}</span></div>
        <div class="jd">${g.d}</div></div></div>`;
    }
    const finished = shown >= a.gates.length;
    if (finished) {
      seen.add(cur);
      html += `<div class="${a.verdict.ok ? "done-banner" : "demo-warn"}" style="margin:8px 0 0">${a.verdict.txt}</div>`;
    }
    root.querySelector("#kg-gates").innerHTML = html;
    const btn = root.querySelector("#kg-next");
    btn.disabled = finished;
    btn.textContent = shown === 0 ? T("▶ 推入闸①", "▶ Push into gate ①") : finished ? T("✓ 处理完毕", "✓ Done") : T("▶ 推入下一道闸", "▶ Push through next gate");
    root.querySelector("#kg-score").textContent = T(`已处理 ${seen.size} / 5 份档案`, `${seen.size} / 5 dossiers processed`);
    whoEl.querySelectorAll("[data-i]").forEach((b) => b.classList.toggle("active", +b.dataset.i === cur));
  }

  whoEl.querySelectorAll("[data-i]").forEach((b) =>
    b.addEventListener("click", () => { cur = +b.dataset.i; shown = 0; paint(); }));
  root.querySelector("#kg-next").addEventListener("click", () => { shown++; paint(); });
  paint();
}
