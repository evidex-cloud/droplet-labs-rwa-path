// 交互演示：派息机器——$10M 代币化债券、5% 票息、三个持有人，跑一个完整付息周期，看三种分配模式与登记日难题。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const FACE = 10_000_000, RATE = 0.05, COUPON = FACE * RATE / 4;
  let mode = "airdrop";
  let trade = "none";        // none | before | after  —— Bob 在快照前/后卖给 Dana
  let step = -1;             // -1 未开始
  let defaulted = false;

  // 基础持仓（份额比例）
  const base = { Alice: 0.5, Bob: 0.3, Carol: 0.2 };

  function holders(atSnapshot) {
    const h = { Alice: base.Alice, Bob: base.Bob, Carol: base.Carol, Dana: 0 };
    // 快照名单：before = 卖在快照前（Dana 上名单）；after = 卖在快照后（Bob 仍在名单）
    if (trade === "before" || (trade === "after" && !atSnapshot)) { h.Dana = base.Bob; h.Bob = 0; }
    return h;
  }

  const STEPS = [
    { leg: "off", d: 0, zh: "债务人付款：借款企业电汇 $125,000 给 SPV", en: "Obligor pays: the borrower wires $125,000 to the SPV" },
    { leg: "off", d: 1, zh: "资金入账：钱落到 SPV 在托管行的账户", en: "Funds land: money settles in the SPV's custodian account" },
    { leg: "off", d: 3, zh: "管理人对账：核对条款、扣费扣税、计算各持有人应得，发出分配指令", en: "Admin reconciles: check terms, deduct fees & tax, compute per-holder amounts, issue instruction" },
    { leg: "on",  d: 3, zh: "链上快照：在区块 N 冻结持有人名单（决定谁有资格）", en: "On-chain snapshot: freeze the holder list at block N (this decides eligibility)" },
    { leg: "on",  d: 3, zh: "执行分配：按所选模式落到持有人地址", en: "Execute distribution: land it per the selected model" },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("💰 派息机器：$10M 债券 · 5% 票息 · 季付", "💰 The coupon machine: $10M bond · 5% coupon · quarterly")}</div>
      <div class="demo-switch">${T("分配模式：", "Distribution mode: ")}
        <button class="demo-btn" data-m="airdrop">${T("空投 USDC", "Airdrop USDC")}</button>
        <button class="demo-btn" data-m="rebase">${T("增发代币 rebase", "Rebase mint")}</button>
        <button class="demo-btn" data-m="accrue">${T("净值累积", "Accumulating NAV")}</button>
      </div>
      <div class="demo-switch">${T("中途交易：Bob 把全部持仓卖给 Dana", "Mid-cycle trade: Bob sells his entire position to Dana")}
        <button class="demo-btn" data-t="none">${T("不交易", "No trade")}</button>
        <button class="demo-btn" data-t="before">${T("快照前卖", "Sells BEFORE snapshot")}</button>
        <button class="demo-btn" data-t="after">${T("快照后卖", "Sells AFTER snapshot")}</button>
      </div>
      <div class="journey" id="cf-steps"></div>
      <div class="demo-block" id="cf-table"></div>
      <div id="cf-price"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="cf-next">${T("▶ 开始付息周期", "▶ Start the payment cycle")}</button>
        <button class="demo-btn" id="cf-def">${T("💥 债务人违约", "💥 Obligor defaults")}</button>
        <button class="demo-btn" id="cf-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <p class="demo-tip">${T("注意两件事：<strong>链下三步走了三天，链上两步只要几秒</strong>——决定派息速度的从来不是区块链；以及<strong>“快照后卖”时利息归 Bob，Dana 买到的是除息代币，价格该跌掉那笔应计利息</strong>（净价 vs 全价）。发行是一天的新闻，派息是十年的运维——RWA 的护城河一半在这台“月复一月”的机器里。", "Notice two things: <strong>the three off-chain steps take three days, the two on-chain steps take seconds</strong> — the blockchain was never the bottleneck; and <strong>selling AFTER the snapshot leaves the coupon with Bob, so Dana holds an ex-coupon token whose price should drop by the accrued interest</strong> (clean vs dirty price). Issuance is one day's news; distributions are ten years of operations — half of RWA's moat is in this month-after-month machine.")}</p>
    </div>`;

  const stepsEl = root.querySelector("#cf-steps");
  const tableEl = root.querySelector("#cf-table");
  const priceEl = root.querySelector("#cf-price");
  const nextBtn = root.querySelector("#cf-next");

  const money = (v) => "$" + v.toLocaleString(undefined, { maximumFractionDigits: 2 });

  function paint() {
    if (defaulted) {
      stepsEl.innerHTML = `<div class="demo-warn"><b>${T("💥 债务人未按期付息", "💥 The obligor missed the payment")}</b><br/>${T("→ 进入宽限期 → 逾期后由预言机把“违约”事件写上链（阶段 8.1）→ 触发暂停转账 / 按 NAV 减记 → 实际追偿走链下法律程序与偿付瀑布（阶段 5.4）。链上代币不能自动解决违约，只能忠实反映链下法律程序的结果。", "→ grace period → past it, an oracle writes the “default” event on-chain (Stage 8.1) → transfers pause / NAV write-down → actual recovery runs through off-chain legal process and the waterfall (Stage 5.4). A token can't resolve a default automatically; it only reflects the off-chain outcome.")}</div>`;
      tableEl.innerHTML = ""; priceEl.innerHTML = "";
      nextBtn.disabled = true;
      return;
    }
    let html = "";
    for (let i = 0; i <= step && i < STEPS.length; i++) {
      const s = STEPS[i];
      html += `<div class="jstep done"><div class="jn">${i + 1}</div><div>
        <div class="jt">${s.leg === "off" ? "🏦" : "⛓️"} ${T(s.zh, s.en)}</div>
        <div class="jd">${s.leg === "off" ? T("链下 · 第 " + s.d + " 天（银行日历）", "Off-chain · day " + s.d + " (bank calendar)") : T("链上 · 第 " + s.d + " 天（秒级）", "On-chain · day " + s.d + " (seconds)")}</div>
      </div></div>`;
    }
    stepsEl.innerHTML = html || `<div class="demo-label">${T("点“开始付息周期”，跟着一笔 $125,000 走完全程。", "Hit “Start the payment cycle” and follow one $125,000 coupon end to end.")}</div>`;
    nextBtn.disabled = step >= STEPS.length - 1;
    nextBtn.textContent = step < 0 ? T("▶ 开始付息周期", "▶ Start the payment cycle") : (step >= STEPS.length - 1 ? T("✓ 完成", "✓ Done") : T("▶ 下一步", "▶ Next step"));
    paintTable();
  }

  function paintTable() {
    const done = step >= STEPS.length - 1;
    const snapList = holders(true);   // 快照名单（决定资格）
    const nowList = holders(false);   // 当前实际持仓
    const names = ["Alice", "Bob", "Carol", "Dana"];
    let rows = "";
    names.forEach((n) => {
      const sh = nowList[n];
      const eligible = snapList[n];
      if (sh === 0 && eligible === 0) return;
      const pay = COUPON * eligible;
      const tokens = FACE * sh / 100;      // 以 $100 面值一枚计
      let got = "—";
      if (done && pay > 0) {
        if (mode === "airdrop") got = `+${money(pay)} USDC`;
        else if (mode === "rebase") got = `+${(pay / 100).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${T("枚代币", "tokens")}`;
        else got = T("净值 $100 → $101.25", "NAV $100 → $101.25");
      }
      rows += `<tr>
        <td style="padding:3px 6px;color:var(--ink)">${n}</td>
        <td style="padding:3px 6px;font-family:var(--mono);color:var(--muted)">${(sh * 100).toFixed(0)}%</td>
        <td style="padding:3px 6px;font-family:var(--mono);color:var(--muted)">${Math.round(tokens).toLocaleString()}</td>
        <td style="padding:3px 6px;color:${eligible > 0 ? "var(--green)" : "var(--red)"}">${eligible > 0 ? T("✓ 在名单", "✓ on list") : T("✗ 不在名单", "✗ not on list")}</td>
        <td style="padding:3px 6px;font-family:var(--mono);font-weight:700;color:${got === "—" ? "var(--muted)" : "var(--green)"}">${got}</td>
      </tr>`;
    });
    tableEl.innerHTML = `
      <div class="demo-label">${T(`本季应付票息 ${money(COUPON)}（$10M × 5% ÷ 4）· 模式：`, `Coupon due this quarter ${money(COUPON)} ($10M × 5% ÷ 4) · mode: `)}<b>${mode === "airdrop" ? T("空投", "airdrop") : mode === "rebase" ? T("增发", "rebase") : T("净值累积", "accumulating")}</b></div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:4px">
        <tr style="color:var(--muted);text-align:left">
          <th style="padding:3px 6px">${T("持有人", "Holder")}</th><th style="padding:3px 6px">${T("当前份额", "Share now")}</th>
          <th style="padding:3px 6px">${T("代币数", "Tokens")}</th><th style="padding:3px 6px">${T("登记日资格", "Record-date eligible")}</th>
          <th style="padding:3px 6px">${T("本次所得", "Received")}</th></tr>
        ${rows}
      </table>`;

    if (trade === "after") {
      priceEl.innerHTML = `<div class="demo-warn" style="font-size:12px">${T(
        `📉 除息效应：Bob 在快照后卖出，仍保留 ${money(COUPON * base.Bob)} 利息。Dana 买到的是“已除息”的代币——二级价格理应从全价（脏价）$101.25 跌回净价（干净价）$100.00，跌幅正是那笔应计利息。看到派息日“跳水”不要惊慌，那是除息不是暴跌。`,
        `📉 Ex-coupon effect: Bob sold after the snapshot and keeps ${money(COUPON * base.Bob)}. Dana holds an ex-coupon token — the secondary price should fall from the dirty price $101.25 back to the clean price $100.00, exactly the accrued interest. A “nosedive” on the coupon date is going ex, not a crash.`)}</div>`;
    } else if (trade === "before") {
      priceEl.innerHTML = `<div class="demo-block" style="font-size:12px;color:var(--muted)">${T(
        "Dana 在快照前买入，进入登记日名单，本季利息归 Dana——她付的是含息的全价，拿到利息理所应当。",
        "Dana bought before the snapshot, made the record-date list, and receives this quarter's coupon — she paid the dirty (cum-coupon) price, so the coupon is rightfully hers.")}</div>`;
    } else priceEl.innerHTML = "";
  }

  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    root.querySelectorAll("[data-m]").forEach((x) => x.classList.toggle("active", x.dataset.m === mode));
    paint();
  }));
  root.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => {
    trade = b.dataset.t;
    root.querySelectorAll("[data-t]").forEach((x) => x.classList.toggle("active", x.dataset.t === trade));
    paint();
  }));
  nextBtn.addEventListener("click", () => { if (step < STEPS.length - 1) step++; paint(); });
  root.querySelector("#cf-def").addEventListener("click", () => { defaulted = true; paint(); });
  root.querySelector("#cf-reset").addEventListener("click", () => { step = -1; defaulted = false; paint(); });

  root.querySelector('[data-m="airdrop"]').classList.add("active");
  root.querySelector('[data-t="none"]').classList.add("active");
  paint();
}
