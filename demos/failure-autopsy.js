// 交互演示：失败尸检台——6 张案例卡，读证据后从 5 张死因标签里选，正确诊断解锁完整病历与“哪一课能救你”。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const LABELS = [
    { id: "demand", t: T("无人接盘", "No secondary demand") },
    { id: "wrapper", t: T("法律包装缺失", "Missing legal wrapper") },
    { id: "reflexive", t: T("反身性锚", "Reflexive peg") },
    { id: "regulator", t: T("监管击毙", "Killed by regulator") },
    { id: "ops", t: T("运维塌方", "Operational collapse") },
  ];

  const CASES = [
    {
      id: "aspen", name: T("阿斯彭度假村币 (2018)", "Aspen Coin (2018)"), emoji: "🏨",
      ev: [
        T("结构图：Reg D 合规发行，圣瑞吉酒店部分股权，募得约 $1,800 万 ✅", "Structure: compliant Reg D raise, part of the St. Regis resort's equity, ~$18M raised ✅"),
        T("承诺：“把不流动的酒店股权变成可自由交易的代币”", "Promise: “turn illiquid resort equity into freely tradable tokens”"),
        T("数据：发行完成后，二级成交量长年近乎为零；持有人找不到下一个买家", "Data: after the raise, secondary volume sat near zero for years; holders found no next buyer"),
      ],
      ans: ["demand"], lesson: T("阶段 9.1 + 阶段 10.4", "Stage 9.1 + Stage 10.4"),
      story: T("发行做成了，分销没做。把酒店切碎乘的是持有人数，不是买家数——流动性幻觉的原型。这一代的结构性错误：相信“先代币化，流动性自然会来”。", "Issuance succeeded; distribution never existed. Slicing a hotel multiplies holders, not buyers — the prototype of the liquidity illusion. The era's structural error: believing “tokenize it and liquidity will come.”"),
    },
    {
      id: "tzero", name: T("tZERO 交易所", "tZERO exchange"), emoji: "📉",
      ev: [
        T("结构图：持牌 ATS（另类交易系统），Overstock 孵化，被称为“证券型代币的纳斯达克”", "Structure: a licensed ATS, incubated by Overstock, billed as “the Nasdaq of security tokens”"),
        T("承诺：为证券型代币提供合规二级市场", "Promise: a compliant secondary market for security tokens"),
        T("数据：订单簿常年稀薄、买卖价差极宽；多轮裁员与业务收缩", "Data: chronically thin books, very wide spreads; repeated layoffs and contraction"),
      ],
      ans: ["demand"], lesson: T("阶段 9.1 / 9.2", "Stage 9.1 / 9.2"),
      story: T("场地盖好了，观众没来。合规的交易场所本身不产生需求：没有有资格、有意愿、有资金的买家群体，再漂亮的撮合引擎也只是空转。", "The venue was built; the audience never came. A compliant trading venue does not create demand: without a population of eligible, willing, funded buyers, even a beautiful matching engine just spins."),
    },
    {
      id: "ust", name: T("Terra UST (2022年5月)", "Terra UST (May 2022)"), emoji: "💥",
      ev: [
        T("结构图：1 UST 永远可换 $1 等值的姊妹币 LUNA，反之亦然——无任何链下资产", "Structure: 1 UST always swappable for $1 of its sibling token LUNA, and back — with no off-chain asset at all"),
        T("承诺：“算法稳定”，Anchor 提供约 20% 存款收益", "Promise: “algorithmically stable,” with Anchor paying ~20% on deposits"),
        T("数据：一周内 $400 亿+ 蒸发，UST 归零，LUNA 归零", "Data: $40B+ evaporated in a week; UST to zero, LUNA to zero"),
      ],
      ans: ["reflexive"], lesson: T("阶段 4.1", "Stage 4.1"),
      story: T("“储备”是自己发行的币：信心跌→LUNA 跌→支撑更弱→信心更跌。定义性教训——如果储备是内生的，它就不是储备。RWA 的全部价值主张在这条线的另一侧。", "The “reserve” was a coin it printed itself: confidence falls → LUNA falls → backing weakens → confidence falls further. The definitional lesson — if the reserve is endogenous, it is not a reserve. RWA's entire value proposition lives on the other side of that line."),
    },
    {
      id: "celsius", name: T("Celsius 收益账户", "Celsius Earn accounts"), emoji: "🧊",
      ev: [
        T("结构图：用户资产按条款转移所有权给 Celsius，与自营资金混同，无破产隔离", "Structure: terms transferred asset ownership to Celsius, commingled with proprietary funds, no bankruptcy remoteness"),
        T("承诺：像存款一样“存币生息”，随时可取", "Promise: “deposit and earn,” withdrawable anytime"),
        T("数据：SEC 与多州认定为未注册证券；2022 年 7 月冻结提现后破产，用户成无担保债权人排队数年", "Data: SEC and multiple states deemed it an unregistered security; withdrawals frozen July 2022, bankruptcy followed, users queued for years as unsecured creditors"),
      ],
      ans: ["regulator", "wrapper"], lesson: T("阶段 5.2 + 阶段 11.1", "Stage 5.2 + Stage 11.1"),
      story: T("这具尸体死了两次：未注册证券（监管）+ 资产未隔离（包装）。“我账户里有 3 个 BTC”与“Celsius 欠我 3 个 BTC”在破产法庭是两个物种——与无分配黄金账户完全同构。", "This body died twice: unregistered securities (regulator) + unsegregated assets (wrapper). “There are 3 BTC in my account” and “Celsius owes me 3 BTC” are different species in bankruptcy court — structurally identical to an unallocated gold account."),
    },
    {
      id: "farm", name: T("假农场代币", "The fake farm token"), emoji: "🌾",
      ev: [
        T("结构图：无 SPV、无信托、无独立托管；土地权属文件从未提供", "Structure: no SPV, no trust, no independent custody; land title documents never produced"),
        T("承诺：“代币化种植园，年化 18%，链上可查”", "Promise: “tokenized plantation, 18% APY, verifiable on-chain”"),
        T("数据：合约与转账记录完全正常；实地核查发现农场不存在；团队失联", "Data: contract and transfer records perfectly normal; on-site checks found no farm; the team vanished"),
      ],
      ans: ["wrapper"], lesson: T("阶段 5.1 + 阶段 1.3", "Stage 5.1 + Stage 1.3"),
      story: T("链条根本没有第一环。“链上可查”只验证代币存在，从不验证资产存在——信任之桥一根柱子都没有。请求权链条审计几分钟就能识破。", "The chain had no first link. “Verifiable on-chain” proves only that the token exists — never that the asset does. The trust bridge had not a single pillar. A claim-chain audit would have caught it in minutes."),
    },
    {
      id: "carbon", name: T("碳信用代币 (Toucan/Klima)", "Carbon credit tokens (Toucan/Klima)"), emoji: "🌫",
      ev: [
        T("结构图：把 Verra 登记处已签发的碳信用桥接上链，链上池子自由交易", "Structure: bridged already-issued Verra registry credits on-chain, freely traded in on-chain pools"),
        T("承诺：给碳市场带来流动性与透明度", "Promise: bring liquidity and transparency to carbon markets"),
        T("数据：2022 年 Verra 直接宣布禁止已签发信用代币化；桥上代币瞬间成为孤儿", "Data: in 2022 Verra prohibited tokenizing issued credits outright; the bridged tokens were orphaned instantly"),
      ],
      ans: ["ops"], lesson: T("阶段 5.3 + 阶段 10.5", "Stage 5.3 + Stage 10.5"),
      story: T("代币的效力寄生在一个你不控制的链下登记处上。登记权威改规则，代币当场失效——运维塌方的变种：你依赖的机构随时可以掀桌。", "A token's force is parasitic on an off-chain registry you do not control. The registry authority changed the rules and the token died on the spot — the operational-collapse variant where the institution you depend on can flip the table at will."),
    },
  ];

  let open = null;
  const solved = {}; // id -> Set of chosen labels

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("⚰️ 失败尸检台 · 给每具尸体贴上死因标签", "⚰️ The autopsy table · label every cause of death")}</div>
      <div class="demo-label" id="fa-score"></div>
      <div id="fa-cards"></div>
      <p class="demo-tip">${T("尸检报告只有一句话——<strong>每一具尸体，都是这门课某一章的缺席</strong>。把这张死因表倒过来，就是 BUIDL / Ondo / PAXG 的幸存者画像。", "The autopsy report reads the same every time — <strong>every corpse is the absence of one chapter of this course</strong>. Invert the table and you get the survivor profile of BUIDL / Ondo / PAXG.")}</p>
    </div>`;

  const cardsEl = root.querySelector("#fa-cards");

  function rank(n) {
    if (n >= 6) return T("🏅 首席法医", "🏅 Chief Medical Examiner");
    if (n >= 4) return T("🔬 高级验尸官", "🔬 Senior Coroner");
    if (n >= 2) return T("🧪 实习验尸官", "🧪 Trainee Coroner");
    return T("🕯 刚进停尸房", "🕯 Just entered the morgue");
  }

  function paint() {
    const n = Object.keys(solved).length;
    root.querySelector("#fa-score").innerHTML =
      `${T("已确诊", "Diagnosed")}: <b>${n} / ${CASES.length}</b> · ${T("验尸官等级", "Coroner rank")}: <b style="color:var(--orange-ink)">${rank(n)}</b>`;

    cardsEl.innerHTML = CASES.map((c) => {
      const done = !!solved[c.id];
      const isOpen = open === c.id;
      let body = "";
      if (isOpen) {
        body = `<div style="margin-top:8px">
          <div class="demo-label">${T("证据", "Evidence")}</div>
          ${c.ev.map((e) => `<div style="font-size:12px;color:var(--ink);margin:3px 0">· ${e}</div>`).join("")}
          ${done ? `
            <div class="done-banner" style="margin:8px 0 6px">${T("✅ 诊断正确", "✅ Correct diagnosis")}: ${c.ans.map((a) => LABELS.find((l) => l.id === a).t).join(" + ")}</div>
            <div style="font-size:12px;color:var(--ink)">${c.story}</div>
            <div class="demo-label" style="margin-top:6px">${T("本课程哪一课能提前救你", "Which lesson would have saved you")}: <b style="color:var(--orange-ink)">${c.lesson}</b></div>`
            : `<div class="demo-label" style="margin-top:8px">${T("从抽屉里选死因", "Pick the cause from the drawer")}${c.ans.length > 1 ? T("（这张卡接受两个标签）", " (this card takes two labels)") : ""}：</div>
            <div class="demo-btns" style="flex-wrap:wrap">${LABELS.map((l) => `<button class="demo-btn" data-case="${c.id}" data-label="${l.id}">${l.t}</button>`).join("")}</div>
            <div class="demo-label" id="fa-msg-${c.id}"></div>`}
        </div>`;
      }
      return `<div class="demo-block" style="border-left:3px solid ${done ? "var(--green)" : "var(--line)"}">
        <div style="cursor:pointer;font-weight:600;color:var(--ink)" data-open="${c.id}">${c.emoji} ${c.name} ${done ? "✅" : (isOpen ? "▾" : "▸")}</div>
        ${body}</div>`;
    }).join("");

    cardsEl.querySelectorAll("[data-open]").forEach((el) =>
      el.addEventListener("click", () => { open = open === el.dataset.open ? null : el.dataset.open; paint(); }));

    cardsEl.querySelectorAll("[data-label]").forEach((b) =>
      b.addEventListener("click", () => {
        const c = CASES.find((x) => x.id === b.dataset.case);
        const msg = root.querySelector("#fa-msg-" + c.id);
        if (!c.ans.includes(b.dataset.label)) {
          msg.innerHTML = `<span style="color:var(--red)">${T("✗ 不是这个死因。再读一遍证据里的结构图与数据。", "✗ Not this cause. Re-read the structure and the data in the evidence.")}</span>`;
          return;
        }
        c._got = c._got || new Set();
        c._got.add(b.dataset.label);
        if (c._got.size >= c.ans.length) { solved[c.id] = true; paint(); }
        else msg.innerHTML = `<span style="color:var(--green)">${T("✓ 对了一个——这具尸体还有第二张标签。", "✓ One right — this body carries a second label.")}</span>`;
      }));
  }

  paint();
}
