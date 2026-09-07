// 交互演示：文件解码器——给一份虚构 PPM 摘录的 10 个条款分类（绿/黄/红），并看七问自动填表。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // verdict: g=绿(没问题) y=黄(需追问) r=红(照明弹)
  const CLAUSES = [
    {
      sec: T("§2 发行的证券", "§2 Securities Offered"),
      text: T("“本次发行的代币代表 Meridian Yield Ltd. 的 A 类有限合伙权益的数字表示。”", "“The Tokens offered hereby represent a digital representation of Class A limited partnership interests in Meridian Yield Ltd.”"),
      verdict: "g",
      why: T("Q1 答得干净：落到了一个法律名词（有限合伙权益），请求权链条清晰（阶段 5.1）。", "Q1 answered cleanly: it lands on a legal noun (LP interest), so the claim chain is clear (Stage 5.1)."),
      fills: 1,
    },
    {
      sec: T("§3 发行主体", "§3 The Issuer"),
      text: T("“Meridian Yield Ltd. 是一家开曼群岛豁免公司，注册号 MC-3xxxxx。”", "“Meridian Yield Ltd. is a Cayman Islands exempted company, registration no. MC-3xxxxx.”"),
      verdict: "y",
      why: T("Q2 有实体名和法域，是好事——但“黄”是因为你必须真的去注册处核一遍（阶段 12.2⑤）。没核过的实体名只是一串字符。", "Q2 gives an entity name and jurisdiction — good — but it's yellow because you must actually check the registry (Stage 12.2). An unverified name is just characters."),
      fills: 2,
    },
    {
      sec: T("§5 托管", "§5 Custody"),
      text: T("“基金资产由一家关联托管机构持有。”", "“Fund assets are held by an affiliated custodian.”"),
      verdict: "r",
      why: T("Q3 失守：托管方无名无姓，且是关联方——自己托管自己。托管层的经典深坑（阶段 12.1④、阶段 4.2）。", "Q3 fails: a nameless custodian, and an affiliate at that — custodying itself. The classic custody-layer crater (Stage 12.1, Stage 4.2)."),
      fills: 3,
    },
    {
      sec: T("§5.4 资产使用", "§5.4 Use of Assets"),
      text: T("“经理人可质押储备资产以取得融资。”", "“The Manager may pledge reserve assets to obtain financing.”"),
      verdict: "r",
      why: T("照明弹。一句 may pledge 就把“隔离保管”变成“可再抵押资金池”——储备证明恰恰证明不了这件事（阶段 8.3）。", "The flare. One “may pledge” turns segregated safekeeping into a rehypothecatable pool — precisely what proof of reserve cannot rule out (Stage 8.3)."),
      fills: 3,
    },
    {
      sec: T("§7 赎回", "§7 Redemptions"),
      text: T("“赎回可由经理人自行酌情暂停。”", "“Redemptions may be suspended at the Manager's sole discretion.”"),
      verdict: "r",
      why: T("Q4 失守：无触发条件、无期限、无复核。闸门条款该写“何时触发、最长多久”（阶段 5.4 / 9.4）；“自行酌情”= 你的退出权归对方所有。", "Q4 fails: no trigger, no time limit, no review. A gate clause should state when it fires and for how long (Stage 5.4 / 9.4); “sole discretion” means your exit belongs to them."),
      fills: 4,
    },
    {
      sec: T("§8 费用", "§8 Fees"),
      text: T("“管理费 1.25%/年；此外基金投资的标的基金另收 0.40% 管理费。”", "“Management fee 1.25%/yr; underlying funds in which the Fund invests charge a further 0.40%.”"),
      verdict: "y",
      why: T("Q5 需要你做加法：1.25% + 0.40% = 1.65% 全包拖累。披露是诚实的（所以不是红），但对国债类产品来说这层数太厚了（阶段 10.2 的包装叠包装）。", "Q5 needs your arithmetic: 1.25% + 0.40% = 1.65% all-in drag. The disclosure is honest (hence not red), but that's a thick stack for a Treasury-type product (Stage 10.2's wrapper-on-wrapper)."),
      fills: 5,
    },
    {
      sec: T("§9 分配瀑布", "§9 Distribution Waterfall"),
      text: T("“清算所得依次分配予：有担保债权人、经理人应计费用、A 类持有人。”", "“Liquidation proceeds are distributed in order to: secured creditors, accrued Manager fees, then Class A holders.”"),
      verdict: "y",
      why: T("Q6 答了——这本身值得肯定。但注意顺位：经理人的费用排在你前面（阶段 5.4）。这是常见安排，需要你知道并接受，而不是被蒙在鼓里。", "Q6 is answered — credit for that. But note the rank: the Manager's fees sit ahead of you (Stage 5.4). A common arrangement you should know and accept, not discover later."),
      fills: 6,
    },
    {
      sec: T("§11 转让限制", "§11 Transfer Restrictions"),
      text: T("“权益仅可在经经理人事前书面同意后，转让予名单内合格购买者。”", "“Interests may be transferred only to listed qualified purchasers, with the Manager's prior written consent.”"),
      verdict: "y",
      why: T("Q7 答了，条款本身对私募是正常的（阶段 7.3）——变红的条件是：它与营销页“随时交易、流动性充足”的说法冲突。落差才是测谎仪。", "Q7 answered, and for a private placement this clause is normal (Stage 7.3) — it turns red only when it contradicts a marketing page shouting “trade anytime.” The gap is the lie detector."),
      fills: 7,
    },
    {
      sec: T("§14 风险因素（其一）", "§14 Risk Factors (a)"),
      text: T("“数字资产相关的监管环境存在不确定性，未来法规可能对基金产生不利影响。”", "“The regulatory environment for digital assets is uncertain, and future regulation may adversely affect the Fund.”"),
      verdict: "g",
      why: T("套话——是家具，不是警报。每份正规文件都有，说明律师在正常干活。知道<b>不该怕什么</b>，和知道该怕什么一样值钱（阶段 12.2③）。", "Boilerplate — furniture, not an alarm. Every proper document has it; its presence means the lawyers did their job. Knowing what <b>not</b> to fear scores too (Stage 12.2)."),
      fills: 0,
    },
    {
      sec: T("§14 风险因素（其二）", "§14 Risk Factors (b)"),
      text: T("“基金全部底层贷款均来自单一发起平台，该平台亦为经理人的关联方。”", "“All of the Fund's underlying loans originate from a single platform, which is also an affiliate of the Manager.”"),
      verdict: "g",
      why: T("具体、难堪、且自愿写下——这是诚实的标志，也是自白：集中度风险 + 关联交易。它不是坏条款，它是<b>好披露</b>；真正该做的是拿它去追问定价（阶段 12.4）。", "Specific, unflattering, and volunteered — a mark of honesty and a confession at once: concentration plus related-party dealing. Not a bad clause but a <b>good disclosure</b>; the right response is to interrogate the pricing (Stage 12.4)."),
      fills: 0,
    },
  ];

  const Q7 = [
    T("Q1 我买的到底是什么", "Q1 What am I buying"),
    T("Q2 谁发行、注册在哪", "Q2 Who issues, registered where"),
    T("Q3 资产在哪、有无质押", "Q3 Where are assets, pledged?"),
    T("Q4 我怎么拿回钱", "Q4 How do I get money back"),
    T("Q5 费用一共几层", "Q5 How many fee layers"),
    T("Q6 出事了我排第几", "Q6 Where do I rank"),
    T("Q7 我能转给谁", "Q7 Who can I transfer to"),
  ];

  const LBL = { g: T("绿 · 没问题", "Green · fine"), y: T("黄 · 需追问", "Yellow · follow up"), r: T("红 · 照明弹", "Red · flare") };
  const COL = { g: "var(--green)", y: "var(--orange-ink)", r: "var(--red)" };
  const picks = CLAUSES.map(() => null);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔍 文件解码器 · Meridian Yield Token 私募备忘录（虚构）", "🔍 Doc decoder · Meridian Yield Token PPM (fictional)")}</div>
      <div class="demo-block"><div class="demo-label">${T("给每个条款判色：绿=没问题 / 黄=需追问 / 红=照明弹。判完看七问表被填了几格。", "Grade each clause: green = fine / yellow = follow up / red = flare. Then see how many of the seven questions got filled.")}</div></div>
      <div id="dd-list"></div>
      <div class="demo-block"><div class="demo-label">${T("七问自动填表（该文件回答了哪些）：", "The seven questions, auto-filled (what this document answered):")}</div><div id="dd-q7"></div></div>
      <div id="dd-score"></div>
      <p class="demo-tip">${T("好文件答完七问，坏文件答不完——而<strong>最危险的句子，永远写得最平静</strong>。注意两条“绿”：套话不该怕，具体而难堪的披露反而是诚实的标志。", "A good document answers all seven; a bad one can't — and <strong>the most dangerous sentences are always the calmest</strong>. Note the two greens: boilerplate isn't scary, and a specific, unflattering disclosure is a mark of honesty.")}</p>
    </div>`;

  const list = root.querySelector("#dd-list");
  list.innerHTML = CLAUSES.map((c, i) => `
    <div class="demo-block" data-c="${i}">
      <div class="demo-label">${c.sec}</div>
      <div style="font-size:13.5px;color:var(--ink);font-family:var(--mono);line-height:1.55;margin:4px 0 8px">${c.text}</div>
      <div class="demo-btns">
        <button class="demo-btn" data-v="g" data-i="${i}">${LBL.g}</button>
        <button class="demo-btn" data-v="y" data-i="${i}">${LBL.y}</button>
        <button class="demo-btn" data-v="r" data-i="${i}">${LBL.r}</button>
      </div>
      <div data-fb="${i}" style="font-size:12.5px;line-height:1.6;margin-top:6px"></div>
    </div>`).join("");

  const q7El = root.querySelector("#dd-q7"), scoreEl = root.querySelector("#dd-score");

  function paint() {
    const answered = new Set();
    CLAUSES.forEach((c, i) => { if (picks[i] && c.fills) answered.add(c.fills); });
    q7El.innerHTML = Q7.map((q, n) => {
      const ok = answered.has(n + 1);
      return `<div style="font-size:12.5px;margin:2px 0;color:${ok ? "var(--ink)" : "var(--muted)"}">${ok ? "✔" : "◻"} ${q}${ok ? "" : ` <span style="color:var(--muted)">— ${T("本文件未触及", "not addressed here")}</span>`}</div>`;
    }).join("");

    const done = picks.filter((p) => p).length;
    const right = picks.filter((p, i) => p === CLAUSES[i].verdict).length;
    if (done < CLAUSES.length) {
      scoreEl.innerHTML = `<div class="demo-label">${T("已判", "Graded")} ${done}/${CLAUSES.length}</div>`;
    } else {
      const msg = right >= 9 ? T("尽调段位：可以替别人看文件了", "Diligence grade: you can read docs for other people")
        : right >= 7 ? T("尽调段位：合格——红旗都抓到了", "Diligence grade: solid — you caught the flares")
        : T("尽调段位：再走一遍七问协议", "Diligence grade: run the seven-question protocol again");
      scoreEl.innerHTML = `<div class="done-banner">${right}/${CLAUSES.length} ${T("判对", "correct")} · ${msg}</div>`;
    }
  }

  list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]"); if (!b) return;
    const i = +b.dataset.i; picks[i] = b.dataset.v;
    root.querySelectorAll(`[data-i="${i}"]`).forEach((x) => x.classList.toggle("active", x === b));
    const c = CLAUSES[i], ok = picks[i] === c.verdict;
    root.querySelector(`[data-fb="${i}"]`).innerHTML =
      `<span style="color:${ok ? "var(--green)" : "var(--red)"};font-weight:700">${ok ? T("✓ 判对", "✓ correct") : T("✗ 应为 ", "✗ should be ") + (ok ? "" : LBL[c.verdict])}</span> <span style="color:var(--muted)">${c.why}</span>`;
    root.querySelector(`[data-fb="${i}"]`).style.borderLeft = `3px solid ${COL[c.verdict]}`;
    root.querySelector(`[data-fb="${i}"]`).style.paddingLeft = "8px";
    paint();
  });

  paint();
}
