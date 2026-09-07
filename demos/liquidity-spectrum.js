// 交互演示：流动性光谱板——把 8 类资产按“按公允价卖出所需天数”排序，揭晓真实排序与急售折价；
// 再打开“代币化开关”，看卡片只是部分左移，并逐卡说明三条流动性障碍里代币化到底修好了哪几条（登记✓ 过户✓ 估值✗）。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // truth: 真实排序（days 越小越流动）。fix: 代币化后的天数；why: 逐卡解释。
  const ASSETS = [
    { id: "cash", zh: "现金", e: "Cash", days: 0, dayTxt: T("即时", "instant"), rush: 0, fix: 0,
      zhW: "本来就是结算终点，代币化只是换成链上稳定币——快的是转账，不是流动性本身。", eW: "Already the settlement endpoint; tokenizing just makes it an on-chain stablecoin — faster transfer, not new liquidity." },
    { id: "tbill", zh: "国债 (T-Bill)", e: "Treasury bill", days: 1, dayTxt: "T+1", rush: 0.1, fix: 0.01,
      zhW: "登记✓ 过户✓ 估值✓——唯一三项全过的资产：它本来就有每日市价。这正是代币化从国债起步的原因（阶段 3.2）。", eW: "Registry ✓ transfer ✓ valuation ✓ — the only asset passing all three: it already has a daily market price. Exactly why tokenization started here (Stage 3.2)." },
    { id: "stock", zh: "上市股票", e: "Listed stock", days: 1, dayTxt: "T+1", rush: 0.5, fix: 0.01,
      zhW: "登记✓（省掉 Cede & Co. 与多层中介）过户✓（秒级原子 DvP）估值✓（已有连续价格）——省的是对账，不是流动性（阶段 3.4）。", eW: "Registry ✓ (no Cede & Co. or intermediary layers) transfer ✓ (atomic DvP in seconds) valuation ✓ (continuous prices already) — it saves reconciliation, not liquidity (Stage 3.4)." },
    { id: "gold", zh: "黄金 ETF", e: "Gold ETF", days: 1, dayTxt: "T+1", rush: 0.5, fix: 0.01,
      zhW: "登记✓ 过户✓ 估值✓ — 伦敦金有连续报价，PAXG 就是这么做的（阶段 10.5）；金条仍需保管，托管省不掉。", eW: "Registry ✓ transfer ✓ valuation ✓ — London gold quotes continuously, which is how PAXG works (Stage 10.5); the bars still need a vault — custody never goes away." },
    { id: "corp", zh: "公司债", e: "Corporate bond", days: 3, dayTxt: T("2–5 天", "2–5 days"), rush: 2, fix: 0.05,
      zhW: "登记✓ 过户✓ 估值△——场外市场本就报价稀疏，代币化让转让变快，但冷门券的“公允价”依旧要靠询价。", eW: "Registry ✓ transfer ✓ valuation △ — OTC quotes are already sparse; tokenization speeds transfer, but an off-the-run bond's fair price still needs dealer inquiry." },
    { id: "re", zh: "房产（整套）", e: "Real estate (whole)", days: 90, dayTxt: T("60–180 天", "60–180 days"), rush: 20, fix: 30,
      zhW: "登记✓ 过户✓（产权链上化，几分钟）估值✗——评估师还是季度上门。RealT 的教训：代币好换手，房子还得有人修（阶段 10.4）。", eW: "Registry ✓ transfer ✓ (title on-chain, minutes) valuation ✗ — the appraiser still visits quarterly. RealT's lesson: the token moves easily, the building still needs a plumber (Stage 10.4)." },
    { id: "pc", zh: "私募信贷 LP", e: "Private credit LP", days: 120, dayTxt: T("1–6 个月", "1–6 months"), rush: 15, fix: 40,
      zhW: "登记✓（标准化代币替代定制 LPA 名册）过户✓（canTransfer 自动合规，几周→几分钟）估值✗——底层 30 笔贷款一季度才评估一次（阶段 10.3）。", eW: "Registry ✓ (standard tokens replace bespoke LPA registers) transfer ✓ (canTransfer automates compliance, weeks → minutes) valuation ✗ — the 30 underlying loans are appraised once a quarter (Stage 10.3)." },
    { id: "pe", zh: "PE 基金 LP", e: "PE fund LP", days: 200, dayTxt: T("3–12 个月", "3–12 months"), rush: 25, fix: 60,
      zhW: "登记✓ 过户✓ 估值✗✗——最硬的骨头：季度评估 + 未催缴承诺 + 十年锁定期。门槛从 500 万降到 1–2 万是真进步，但“谁来接盘”没解决。", eW: "Registry ✓ transfer ✓ valuation ✗✗ — the hardest bone: quarterly appraisals, uncalled commitments, a ten-year lock. Minimums dropping from $5M to $10–20k is real progress; “who will bid” remains unsolved." },
  ];

  // 洗牌后的初始顺序（固定，保证可复现）
  let order = ["pe", "cash", "re", "stock", "pc", "tbill", "corp", "gold"];
  let revealed = false, tokenized = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("📊 流动性光谱板：按“按公允价卖出要几天”排序", "📊 The liquidity spectrum: order these by “days to sell at fair value”")}</div>
      <div class="demo-label" id="ls-hint"></div>
      <div id="ls-cards" style="margin:8px 0"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="ls-reveal">${T("✓ 揭晓真实排序", "✓ Reveal the true order")}</button>
        <button class="demo-btn" id="ls-token">${T("⚡ 代币化开关", "⚡ Tokenization switch")}</button>
        <button class="demo-btn" id="ls-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="ls-note"></div>
      <p class="demo-tip">${T("打开代币化开关：左边四张几乎没动（它们本来就流动），右边四张只<strong>部分</strong>左移——登记✓ 过户✓ 估值✗。<strong>代币化能把“过户”从几周变几分钟，但变不出“愿意接盘的人”和“新鲜的估值”。</strong>", "Flip the tokenization switch: the left four barely move (they were already liquid), while the right four shift only <strong>partway</strong> — registry ✓ transfer ✓ valuation ✗. <strong>Tokenization turns transfers from weeks into minutes, but it cannot conjure willing buyers or fresh valuations.</strong>")}</p>
    </div>`;

  const cardsEl = root.querySelector("#ls-cards");
  const hintEl = root.querySelector("#ls-hint");
  const noteEl = root.querySelector("#ls-note");

  const get = (id) => ASSETS.find((a) => a.id === id);
  const daysOf = (a) => (tokenized ? a.fix : a.days);

  function fmtDays(d) {
    if (d < 0.02) return T("秒级", "seconds");
    if (d < 1) return T("分钟级", "minutes");
    if (d < 2) return T("1 天", "1 day");
    return Math.round(d) + T(" 天", " days");
  }

  function paint() {
    hintEl.innerHTML = revealed
      ? T("真实排序（含急售折价）。绿色=流动，红色=锁死。", "True order, with the discount if you must sell fast. Green = liquid, red = locked.")
      : T("用 ▲▼ 把最容易卖的排到最上面，再点“揭晓”。", "Use ▲▼ to move the easiest-to-sell to the top, then hit Reveal.");
    const list = revealed ? ASSETS.slice().sort((x, y) => daysOf(x) - daysOf(y)).map((a) => a.id) : order;
    cardsEl.innerHTML = list.map((id, i) => {
      const a = get(id);
      const d = daysOf(a);
      const col = d < 2 ? "var(--green)" : d < 30 ? "var(--orange-ink)" : "var(--red)";
      const bg = d < 2 ? "var(--green-soft)" : d < 30 ? "var(--orange-soft)" : "var(--red-soft)";
      const shift = Math.min(88, Math.log10(d + 1) * 42);
      return `
        <div style="display:flex;align-items:center;gap:6px;margin:4px 0">
          ${revealed ? `<span style="width:18px;font-family:var(--mono);font-size:11px;color:var(--muted)">${i + 1}</span>`
            : `<span style="display:flex;flex-direction:column;gap:1px">
                 <button class="demo-btn" data-up="${id}" style="padding:0 5px;font-size:10px;line-height:1.3">▲</button>
                 <button class="demo-btn" data-dn="${id}" style="padding:0 5px;font-size:10px;line-height:1.3">▼</button>
               </span>`}
          <div style="flex:1;background:var(--surface-2);border-radius:8px;padding:2px">
            <div style="margin-left:${revealed ? shift : 0}%;transition:margin-left .5s ease;background:${bg};border:1px solid var(--line);border-radius:7px;padding:5px 9px">
              <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline">
                <span style="font-size:12px;font-weight:600;color:var(--ink)">${T(a.zh, a.e)}</span>
                ${revealed ? `<span style="font-family:var(--mono);font-size:11px;color:${col}">${tokenized ? fmtDays(d) : a.dayTxt}${a.rush ? T(" · 急售 −" + a.rush + "%", " · rush −" + a.rush + "%") : ""}</span>` : ""}
              </div>
              ${revealed && tokenized ? `<div style="font-size:10.5px;color:var(--muted);margin-top:3px">${T(a.zhW, a.eW)}</div>` : ""}
            </div>
          </div>
        </div>`;
    }).join("");

    if (!revealed) {
      cardsEl.querySelectorAll("[data-up]").forEach((b) => b.addEventListener("click", () => move(b.dataset.up, -1)));
      cardsEl.querySelectorAll("[data-dn]").forEach((b) => b.addEventListener("click", () => move(b.dataset.dn, 1)));
      noteEl.innerHTML = "";
    } else if (!tokenized) {
      const hits = order.filter((id, i) => ASSETS.slice().sort((x, y) => x.days - y.days)[i].id === id).length;
      noteEl.innerHTML = `<div class="done-banner" style="margin-top:6px">${T(
        `你排对了 ${hits}/8 张。注意右侧三张的急售折价：私募 LP 份额急着脱手，二手市场常年只给 NAV 的 75–85%——那 15–25% 就是流动性的价格。`,
        `You placed ${hits}/8 correctly. Note the rush discounts on the right: an LP interest sold in a hurry clears at 75–85% of NAV on the secondaries market — that 15–25% is the price of liquidity.`)}</div>`;
    } else {
      noteEl.innerHTML = `<div class="demo-warn" style="margin-top:6px">${T(
        "三条流动性障碍，代币化的战绩：<strong>① 无标准登记 —— 修好了</strong>（份额变标准代币，链即名册）；<strong>② 转让受限 —— 修好了</strong>（GP 书面同意 + 律师，变成合约里的 canTransfer 自动校验，几周→几分钟）；<strong>③ 无价格发现 —— 没修</strong>（NAV 还是一季度评估一次）。所以 PE LP 从 200 天缩到约 60 天就停住了——剩下的不是登记摩擦，是没人知道它到底值多少钱。",
        "Three barriers, tokenization's scorecard: <strong>① no standard registry — fixed</strong> (interests become standard tokens; the chain is the register); <strong>② restricted transfer — fixed</strong> (written GP consent plus lawyers becomes an in-contract canTransfer check, weeks → minutes); <strong>③ no price discovery — not fixed</strong> (NAV is still appraised quarterly). That's why the PE LP stops at ~60 days instead of 200 — what remains isn't registration friction, it's that nobody knows what it's actually worth.")}</div>`;
    }
  }

  function move(id, dir) {
    const i = order.indexOf(id), j = i + dir;
    if (j < 0 || j >= order.length) return;
    order[i] = order[j]; order[j] = id;
    paint();
  }

  root.querySelector("#ls-reveal").addEventListener("click", () => { revealed = true; paint(); });
  root.querySelector("#ls-token").addEventListener("click", (e) => {
    tokenized = !tokenized; revealed = true;
    e.currentTarget.classList.toggle("active", tokenized);
    paint();
  });
  root.querySelector("#ls-reset").addEventListener("click", () => {
    order = ["pe", "cash", "re", "stock", "pc", "tbill", "corp", "gold"];
    revealed = false; tokenized = false;
    root.querySelector("#ls-token").classList.remove("active");
    paint();
  });

  paint();
}
