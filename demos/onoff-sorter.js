// 交互演示：分拣游戏——把 TBF 的 12 个零件分到“链上 / 链下 / 桥”，即时判分并解释。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const ZONES = [
    { id: "on", label: T("⛓ 链上", "⛓ On-chain") },
    { id: "off", label: T("🏦 链下", "🏦 Off-chain") },
    { id: "bridge", label: T("🌉 桥", "🌉 Bridge") },
  ];

  const items = [
    { n: T("你的 TBF 余额", "Your TBF balance"), a: "on", why: T("“谁持有多少”正是链的本职：签名+共识才能改。", "“Who holds how much” is the chain's day job: signature + consensus to change.") },
    { n: T("国债本身", "The T-bills themselves"), a: "off", why: T("登记在托管行为基金开的账户里，和链没有物理连接。", "Registered in the fund's custody account — no physical link to the chain.") },
    { n: T("转账规则（白名单）", "Transfer rules (whitelist)"), a: "on", why: T("规则的执行器写在合约里，每笔 transfer 自动跑。", "The rule executor lives in the contract and runs on every transfer.") },
    { n: T("KYC 档案", "The KYC files"), a: "off", why: T("护照扫描件绝不能上公开永久的链——链上只放“已通过”的结论。", "Passport scans must never touch a public, permanent chain — only the “passed” conclusion goes on.") },
    { n: T("基金合同", "The fund contract"), a: "off", why: T("代币“是什么”由这摞纸定义，法庭认的是文件不是代码。", "What the token is gets defined by this paper; courts read documents, not code.") },
    { n: T("NAV 数字（$1.0230）", "The NAV number ($1.0230)"), a: "on", why: T("发布出来的那个数字住在链上存储槽里——但只是数字。", "The published number lives in an on-chain storage slot — but it's just the number.") },
    { n: T("NAV 的计算过程", "The NAV computation"), a: "off", why: T("估值、扣费、除份额——行政管理人在链下用表格算出来。", "Valuing, fee deduction, dividing by shares — done off-chain by the administrator.") },
    { n: T("托管账户里的现金", "Cash in the custody account"), a: "off", why: T("美元躺在银行，走电汇轨道进出。", "The dollars sit in a bank and move by wire.") },
    { n: T("转账历史", "The transfer history"), a: "on", why: T("每次铸造/销毁/转账的事件日志，人人可查、永不消失。", "Event logs of every mint/burn/transfer — queryable by anyone, forever.") },
    { n: T("法院判决", "A court judgment"), a: "off", why: T("能强制执行你权利的暴力机器全在链下。", "The machinery that can enforce your rights is entirely off-chain.") },
    { n: T("储备证明喂价", "The proof-of-reserve feed"), a: "bridge", why: T("典型的“桥”：链下核对的事实，被签名搬运到链上。", "The classic bridge: an off-chain reconciliation, signed and carried on-chain.") },
    { n: T("赎回的银行电汇", "The redemption bank wire"), a: "off", why: T("钱离开体系走的是银行轨道——链上只留下 burn 事件。", "The money leaves via bank rails — the chain only keeps the burn event.") },
  ];

  const state = items.map(() => null);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🗂 分拣游戏：TBF 的零件住在哪儿？", "🗂 Sorting game: where does each TBF part live?")}</div>
      <div class="demo-label" style="margin-bottom:6px">${T("给每张卡选一个归属，立刻判分：", "Assign each card a home — scored instantly:")} <b id="os-score">0 / ${items.length}</b></div>
      <div id="os-cards"></div>
      <div class="demo-btns"><button class="demo-btn" id="os-reset">${T("↺ 重新分拣", "↺ Sort again")}</button></div>
      <p class="demo-tip">${T("规律：链上住的全是<strong>信息</strong>（数字、规则、记录），链下住的全是<strong>实体与权力</strong>（资产、现金、纸、人），桥负责搬运事实。<strong>链是一面不会花的镜子——但让镜像与屋里实物对齐的，是流程、鉴证与法律。</strong>", "The pattern: on-chain holds <strong>information</strong> (numbers, rules, records); off-chain holds <strong>substance and power</strong> (assets, cash, paper, people); the bridge carries facts across. <strong>The chain is a mirror that never smudges — but what aligns the image with the room is process, attestation, and law.</strong>")}</p>
    </div>`;

  const cardsEl = root.querySelector("#os-cards");
  const scoreEl = root.querySelector("#os-score");

  function paint() {
    let score = 0;
    cardsEl.innerHTML = items.map((it, i) => {
      const st = state[i];
      const done = st !== null;
      const right = done && st === it.a;
      if (right) score++;
      const border = done ? (right ? "var(--green)" : "var(--red)") : "var(--line)";
      const zoneName = (id) => ZONES.find((z) => z.id === id).label;
      const btns = ZONES.map((z) =>
        `<button class="demo-btn" data-i="${i}" data-z="${z.id}" ${done ? "disabled" : ""} style="font-size:12px;padding:2px 10px${done && z.id === it.a ? ";border-color:var(--green);color:var(--green)" : ""}">${z.label}</button>`).join(" ");
      const verdict = !done ? "" :
        `<div style="font-size:12px;margin-top:5px;color:${right ? "var(--green)" : "var(--red)"}">${right ? T("✓ 正确", "✓ Correct") : T("✗ 应为 ", "✗ It's ") + zoneName(it.a)}<span style="color:var(--muted)"> —— ${it.why}</span></div>`;
      return `<div class="demo-block" style="border:1px solid ${border};margin-bottom:8px">
        <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:space-between">
          <b style="color:var(--ink)">${it.n}</b><span>${btns}</span>
        </div>${verdict}</div>`;
    }).join("");
    scoreEl.textContent = `${score} / ${items.length}`;
    cardsEl.querySelectorAll("button[data-i]").forEach((b) =>
      b.addEventListener("click", () => { state[+b.dataset.i] = b.dataset.z; paint(); }));
  }

  root.querySelector("#os-reset").addEventListener("click", () => { state.fill(null); paint(); });
  paint();
}
