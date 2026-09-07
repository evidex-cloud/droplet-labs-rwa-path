// 交互演示：裸 ERC-20 装证券的“地狱一周”——七天七次违规逐日播放；切换成许可型代币后同样七天全部被拦下。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const days = [
    {
      act: "transfer(0xRetail, 500)",
      via: T("DEX 池成交", "filled via DEX pool"),
      rule: T("Reg D 违规：公开劝诱 + 非合格投资者持有", "Reg D violated: general solicitation + non-accredited holder"),
      pen: T("私募豁免可能整体失效 → 未注册发行", "exemption at risk → unregistered offering"),
      revert: "RECEIVER_NOT_VERIFIED",
    },
    {
      act: "transfer(0xSDN…, 1200)",
      via: T("普通转账", "plain transfer"),
      rule: T("OFAC 制裁违规（严格责任）", "OFAC sanctions violation (strict liability)"),
      pen: T("单笔罚款可达数十万美元起", "fines from hundreds of thousands of dollars"),
      revert: "RECEIVER_SANCTIONED",
    },
    {
      act: "transfer(0xBuyer, 300)",
      via: T("发行后第 3 天转售", "resale on day 3 after issuance"),
      rule: T("Rule 144 锁定期（12 个月）内转售", "resale inside the Rule 144 12-month lockup"),
      pen: T("转售限制被击穿，发行方连带风险", "restriction breached; issuer exposure"),
      revert: "LOCKUP_ACTIVE",
    },
    {
      act: "transfer(0xNew2001, 10)",
      via: T("第 2,001 个持有人诞生", "holder #2,001 is born"),
      rule: T("《交易所法》12(g)：持有人破 2,000", "Exchange Act 12(g): holders exceed 2,000"),
      pen: T("被迫按公众公司注册披露", "forced public-company registration"),
      revert: "HOLDER_CAP_REACHED",
    },
    {
      act: T("（无交易——私钥已随持有人离世）", "(no tx — key died with the holder)"),
      via: T("继承人持法院文书求助", "heirs arrive with a court order"),
      rule: T("名册永久失真：无 recovery 机制", "register permanently wrong: no recovery"),
      pen: T("法律权利无法反映到链上", "legal title can't reach the chain"),
      revert: T("recoveryAddress() 可解 ✓", "recoveryAddress() solves it ✓"),
      noTx: true,
    },
    {
      act: T("（法院令：冻结 0xFraud 的代币）", "(court order: freeze 0xFraud's tokens)"),
      via: T("你翻遍合约找不到 freeze", "you search the contract — no freeze"),
      rule: T("无法执行有约束力的法院命令", "cannot execute a binding court order"),
      pen: T("藐视法庭 / 新增法律风险", "contempt risk / fresh legal exposure"),
      revert: T("setAddressFrozen() 可解 ✓", "setAddressFrozen() solves it ✓"),
      noTx: true,
    },
    {
      act: T("（过户代理报告日：导出名册）", "(transfer-agent day: export register)"),
      via: T("得到 5,000 个匿名 0x 地址", "you get 5,000 anonymous 0x addresses"),
      rule: T("股东名册无法履行报告义务", "register can't meet reporting duties"),
      pen: T("监管报告 = 一张白纸", "the report is a blank sheet"),
      revert: T("身份注册表 → 名册可读 ✓", "identity registry → readable register ✓"),
      noTx: true,
    },
  ];

  let mode = "naked"; // naked | permissioned
  let shown = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔥 地狱的一周：裸 ERC-20 装证券", "🔥 The week from hell: a security in a plain ERC-20")}</div>
      <div class="demo-switch">${T("代币类型：", "Token type: ")}
        <button class="demo-btn" data-mode="naked">${T("裸 ERC-20", "Plain ERC-20")}</button>
        <button class="demo-btn" data-mode="permissioned">${T("换成许可型代币", "Permissioned token")}</button>
      </div>
      <div class="journey" id="ef-days"></div>
      <div class="demo-block" id="ef-score" style="display:none"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="ef-next">${T("▶ 开始第 1 天", "▶ Start day 1")}</button>
        <button class="demo-btn" id="ef-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <p class="demo-tip">${T("这七天不是想象——每一条都有真实罚单原型。标准的全部意义 = 把“第 87 页的规则”编译成“transfer 里的 if”。切换到<strong>许可型代币</strong>重播同一周，看每一击如何被弹开。", "This week isn't fiction — every day has a real enforcement precedent behind it. The whole point of a standard = compiling “the rule on page 87” into “an if inside transfer.” Switch to the <strong>permissioned token</strong> and replay the same week to watch every hit bounce off.")}</p>
    </div>`;

  const daysEl = root.querySelector("#ef-days");
  const scoreEl = root.querySelector("#ef-score");
  const nextBtn = root.querySelector("#ef-next");

  function paint() {
    const naked = mode === "naked";
    let html = "";
    for (let i = 0; i < shown; i++) {
      const d = days[i];
      let outcome;
      if (naked) {
        outcome = `<div style="margin-top:4px"><span style="color:var(--red);font-weight:700">⛔ ${d.rule}</span><br><span style="color:var(--muted)">${T("后果：", "Exposure: ")}${d.pen}</span></div>`;
      } else if (d.noTx) {
        outcome = `<div style="margin-top:4px;color:var(--green);font-weight:600">🛡 ${d.revert}</div>`;
      } else {
        outcome = `<div style="margin-top:4px;color:var(--green);font-weight:600">🛡 ${T("转账回滚：", "transfer reverted: ")}<code>${d.revert}</code></div>`;
      }
      html += `
        <div class="jstep done">
          <div class="jn">${i + 1}</div>
          <div>
            <div class="jt">${T("第", "Day")} ${i + 1} ${T("天", "")} · <span style="color:var(--muted);font-weight:400">${d.via}</span></div>
            <div class="jd"><code style="font-family:var(--mono)">${d.act}</code>${outcome}</div>
          </div>
        </div>`;
    }
    daysEl.innerHTML = html;
    if (shown >= days.length) {
      const v = mode === "naked" ? days.length : 0;
      scoreEl.style.display = "block";
      scoreEl.innerHTML = `
        <div class="demo-label">${T("一周结算", "End-of-week scoreboard")}</div>
        <div style="font-weight:700;font-size:1.05em;color:${v ? "var(--red)" : "var(--green)"}">
          ${v
            ? T(`违规 ${v} / 7 天 😱 —— 证券法、制裁法、交易所法全部命中`, `Violations: ${v} / 7 days 😱 — securities, sanctions & Exchange Act all hit`)
            : T("违规 0 / 7 天 ✅ —— 每一击都被合约里的检查弹开", "Violations: 0 / 7 days ✅ — every hit bounced off a check in the contract")}
        </div>`;
    } else {
      scoreEl.style.display = "none";
    }
    nextBtn.disabled = shown >= days.length;
    nextBtn.textContent = shown >= days.length ? T("✓ 一周结束", "✓ Week over")
      : shown === 0 ? T("▶ 开始第 1 天", "▶ Start day 1")
      : T(`▶ 第 ${shown + 1} 天`, `▶ Day ${shown + 1}`);
  }

  root.querySelectorAll("[data-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      mode = b.dataset.mode; shown = 0;
      root.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("active", x.dataset.mode === mode));
      paint();
    }));
  nextBtn.addEventListener("click", () => { if (shown < days.length) { shown++; paint(); } });
  root.querySelector("#ef-reset").addEventListener("click", () => { shown = 0; paint(); });

  root.querySelector('[data-mode="naked"]').classList.add("active");
  paint();
}
