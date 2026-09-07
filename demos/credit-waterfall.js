// 交互演示：分层与瀑布实验台——自己搭一个 $10M 信贷池，调分层比例与票息，跑四种违约场景看真实的瀑布数学。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const POOL = 10; // $10M
  const BORROW_RATE = 0.12; // 借款人综合利率
  let seniorShare = 80, seniorCoupon = 8, juniorTarget = 15, scen = "full";

  const scens = [
    { id: "full", name: T("全部还款", "All repaid"), d: 0 },
    { id: "d10", name: T("违约 10%", "10% default"), d: 0.10 },
    { id: "d30", name: T("违约 30%", "30% default"), d: 0.30 },
    { id: "orth", name: T("重演 Orthogonal", "Replay Orthogonal"), d: 0.20 },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🌊 分层与瀑布实验台：$10M 信贷池", "🌊 Tranche & waterfall lab: a $10M credit pool")}</div>
      <div class="demo-block">
        <label class="demo-label">${T("高级层占比", "Senior share")}：<b id="cw-ss">80%</b>${T("（其余为次级层）", " (the rest is junior)")}</label>
        <input type="range" id="cw-share" min="50" max="95" step="5" value="80" style="width:100%" />
        <label class="demo-label" style="margin-top:6px">${T("高级层票息", "Senior coupon")}：<b id="cw-sc">8%</b>　${T("次级目标回报", "Junior target")}：<b id="cw-jc">15%</b></label>
        <input type="range" id="cw-scr" min="4" max="12" step="1" value="8" style="width:100%" />
        <input type="range" id="cw-jcr" min="8" max="25" step="1" value="15" style="width:100%" />
        <div class="demo-label" style="margin-top:4px">${T("借款人综合利率固定 12% → 池子到期应收 $11.2M", "Borrowers pay a blended 12% → the pool is owed $11.2M at maturity")}</div>
      </div>
      <div class="demo-switch" id="cw-scens">${scens.map((s) => `<button class="demo-btn" data-s="${s.id}">${s.name}</button>`).join("")}</div>
      <div id="cw-borrowers" class="demo-block" style="display:none"></div>
      <div class="demo-block" id="cw-out"></div>
      <div id="cw-recovery"></div>
      <p class="demo-tip">${T("<strong>分层不是消灭风险，是“标价谁先亏”</strong>——链上信贷的每一次爆雷，都是链下尽调的欠账。", "<strong>Tranching doesn't destroy risk — it prices who loses first.</strong> Every on-chain credit blowup is an unpaid bill from off-chain due diligence.")}</p>
    </div>`;

  const out = root.querySelector("#cw-out");
  const borrowersEl = root.querySelector("#cw-borrowers");
  const recoveryEl = root.querySelector("#cw-recovery");
  const m = (v) => "$" + v.toFixed(2) + "M";
  const pct = (v) => (v >= 0 ? "+" : "") + (v * 100).toFixed(1) + "%";

  function calc() {
    const sP = (seniorShare / 100) * POOL;
    const jP = POOL - sP;
    const seniorOwed = sP * (1 + seniorCoupon / 100);
    const totalOwed = POOL * (1 + BORROW_RATE);
    const d = scens.find((x) => x.id === scen).d;
    const collected = totalOwed * (1 - d);
    const seniorPaid = Math.min(collected, seniorOwed);
    const juniorPaid = Math.max(0, collected - seniorOwed);
    const sRet = seniorPaid / sP - 1;
    const jRet = jP > 0 ? juniorPaid / jP - 1 : 0;
    const wipe = 1 - seniorOwed / totalOwed;

    borrowersEl.style.display = scen === "orth" ? "" : "none";
    if (scen === "orth") {
      borrowersEl.innerHTML = `<div class="demo-label">${T("5 个借款人 × $2M——其中一个的报表是假的：", "5 borrowers × $2M — one of them faked its books:")}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${[1, 2, 3, 4, 5].map((i) => i === 3
          ? `<div style="flex:1;min-width:90px;border:1px solid var(--red);border-radius:8px;padding:6px;text-align:center;background:var(--red-soft)"><div style="font-weight:700;color:var(--red)">${T("借款人 C", "Borrower C")}</div><div style="font-size:.78em;color:var(--red)">${T("隐瞒破产 · 违约 $2M", "concealed insolvency · $2M default")}</div></div>`
          : `<div style="flex:1;min-width:90px;border:1px solid var(--line);border-radius:8px;padding:6px;text-align:center;background:var(--surface-2)"><div style="font-weight:700;color:var(--ink)">${T("借款人 ", "Borrower ")}${"ABCDE"[i - 1]}</div><div style="font-size:.78em;color:var(--green)">${T("正常还款", "repaying")}</div></div>`).join("")}</div>
        <div class="demo-label" style="margin-top:6px;color:var(--red)">${T("一个借款人 = 池子的 20%——这就是集中度上限存在的原因。", "One borrower = 20% of the pool — this is why per-borrower concentration caps exist.")}</div>`;
    }

    const bar = (paid, owed, color) => {
      const w = owed > 0 ? Math.min(100, (paid / owed) * 100) : 0;
      return `<div style="height:12px;border-radius:6px;background:var(--surface-2);border:1px solid var(--line);overflow:hidden;margin:3px 0"><div style="height:100%;width:${w}%;background:${color}"></div></div>`;
    };

    out.innerHTML = `
      <div class="demo-label">${T("到期回收", "Collected at maturity")}：<b>${m(collected)}</b> / ${T("应收", "owed")} ${m(totalOwed)}${d > 0 ? `（${T("违约", "defaults")} ${(d * 100).toFixed(0)}%）` : ""}</div>
      <div style="margin-top:6px;font-size:.9em"><b style="color:var(--green)">${T("① 高级层（先拿）", "① Senior (paid first)")}</b>：${m(seniorPaid)} / ${m(seniorOwed)} · ${T("回报", "return")} <b style="color:${sRet >= 0 ? "var(--green)" : "var(--red)"}">${pct(sRet)}</b></div>
      ${bar(seniorPaid, seniorOwed, sRet >= 0 ? "var(--green)" : "var(--red)")}
      <div style="font-size:.9em"><b style="color:var(--orange-ink)">${T("② 次级层（拿剩下的，先亏）", "② Junior (residual, loses first)")}</b>：${m(juniorPaid)} / ${T("本金", "principal")} ${m(jP)} · ${T("目标", "target")} +${juniorTarget}% → ${T("实际", "actual")} <b style="color:${jRet >= 0 ? "var(--green)" : "var(--red)"}">${pct(jRet)}</b></div>
      ${bar(juniorPaid, jP * (1 + juniorTarget / 100), jRet >= 0 ? "var(--orange-ink)" : "var(--red)")}
      <div class="demo-label" style="margin-top:6px">${T("次级清零点", "Junior wipe-out point")}：${T("违约率 ≥ ", "defaults ≥ ")}<b style="color:var(--red)">${(wipe * 100).toFixed(1)}%</b>${T(" 时次级颗粒无收；再往上就轮到高级层挨刀。", " leaves junior with nothing; beyond that the senior tranche starts bleeding.")}</div>
      ${d === 0 ? `<div class="done-banner" style="margin-top:6px">${T("注意次级的杠杆：借款人付 12%，高级只拿 " + seniorCoupon + "%，剩余利差全部归次级。", "Note junior's leverage: borrowers pay 12%, senior takes only " + seniorCoupon + "%, and the whole excess spread flows to junior.")}</div>` : ""}`;

    recoveryEl.innerHTML = scen === "orth" ? `
      <div class="demo-block"><div class="demo-label">${T("违约之后：链下追偿时间线（链帮不上忙的部分）", "After default: the off-chain workout timeline (where the chain can't help)")}</div>
        <div class="journey">
          ${[[T("第 0 月：违约确认，池子记减值", "Month 0: default confirmed; pool books the write-down"), T("瀑布自动执行——但只能分“已收到的钱”", "The waterfall executes — but only divides money actually received")],
             [T("第 3 月：律师函、债权申报、谈判开始", "Month 3: legal letters, claims filed, negotiations begin"), T("全部发生在法院与会议室", "All of it happens in courts and meeting rooms")],
             [T("第 18 月：重组落定，追回约 30%（$0.67M）", "Month 18: restructuring settles; ~30% recovered ($0.67M)"), T("追回款按瀑布归次级——晚到、且只有零头", "Recovery flows to junior via the waterfall — late, and only a fraction")]]
            .map((s, i) => `<div class="jstep done"><div class="jn">${i + 1}</div><div><div class="jt">${s[0]}</div><div class="jd">${s[1]}</div></div></div>`).join("")}
        </div></div>` : "";
  }

  root.querySelector("#cw-share").addEventListener("input", (e) => { seniorShare = +e.target.value; root.querySelector("#cw-ss").textContent = seniorShare + "%"; calc(); });
  root.querySelector("#cw-scr").addEventListener("input", (e) => { seniorCoupon = +e.target.value; root.querySelector("#cw-sc").textContent = seniorCoupon + "%"; calc(); });
  root.querySelector("#cw-jcr").addEventListener("input", (e) => { juniorTarget = +e.target.value; root.querySelector("#cw-jc").textContent = juniorTarget + "%"; calc(); });
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => {
    scen = b.dataset.s;
    root.querySelectorAll("[data-s]").forEach((x) => x.classList.toggle("active", x.dataset.s === scen));
    calc();
  }));
  root.querySelector('[data-s="full"]').classList.add("active");
  calc();
}
