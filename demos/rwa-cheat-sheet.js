// 交互演示：RWA 速查卡片网格——可搜索、可按类别过滤；点卡片翻面看定义与阶段交叉引用；
// 随机抽考模式先给背面让你回忆；打印视图渲染紧凑全表。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const CAT = {
    num: T("数字", "Numbers"), law: T("法规", "Regulation"), std: T("标准", "Standards"),
    tool: T("风险工具", "Risk tools"), fx: T("公式", "Formulas"), stage: T("阶段要点", "Stage takeaways"),
  };

  const cards = [
    // 数字
    { c: "num", f: T("稳定币总供应", "Total stablecoin supply"), b: T("约 2500–3000 亿美元（USDT ~1700 亿+，USDC ~650 亿+）", "≈ $250–300B (USDT ~$170B+, USDC ~$65B+)"), x: "4.1" },
    { c: "num", f: T("代币化美国国债", "Tokenized US treasuries"), b: T("约 70–80 亿美元（2025 年末）", "≈ $7–8B (late 2025)"), x: "10.1" },
    { c: "num", f: T("链上私募信贷", "On-chain private credit"), b: T("100 亿美元以上", "$10B+"), x: "10.3" },
    { c: "num", f: T("比例尺：美国国债市场", "Scale check: US Treasury market"), b: T("约 28 万亿美元——代币化是零头的零头；传统私募信贷约 1.7 万亿", "≈ $28T — tokenization is a rounding error; TradFi private credit ≈ $1.7T"), x: "0.4" },
    { c: "num", f: "BUIDL", b: T("规模约 20–30 亿美元，最低 500 万，Reg D 合格购买者，纽约梅隆托管，每日分红铸新币", "≈ $2–3B, $5M minimum, Reg D QPs, BNY Mellon custodian, daily dividends minted as tokens"), x: "10.1" },
    { c: "num", f: "Ondo USDY", b: T("Reg S 非美人士，铸造后 40–50 天转让锁定", "Reg S non-US persons, 40–50 day transfer lock after mint"), x: "10.2" },
    { c: "num", f: T("T-Bill 收益率区间", "T-bill yield band"), b: T("2023–25 年约 4–5%，2025 年末回落至约 4%", "≈ 4–5% through 2023–25, easing toward ~4% by late 2025"), x: "3.2" },
    { c: "num", f: T("代币化国债基金费率", "Tokenized treasury fund fees"), b: T("约 15–50 个基点；对照 GLD 约 40 个基点", "≈ 15–50 bps; compare GLD at ~40 bps"), x: "12.4" },
    { c: "num", f: T("KYC 成本", "KYC cost"), b: T("约 10–100 美元/投资人", "≈ $10–100 per investor"), x: "7.1" },
    { c: "num", f: T("ERC-3643 生态规模", "ERC-3643 ecosystem"), b: T("宣称代币化资产 280 亿美元以上", "claims $28B+ in tokenized assets"), x: "6.2" },
    { c: "num", f: T("USDC 脱锚（2023/3）", "USDC depeg (Mar 2023)"), b: T("33 亿美元困在硅谷银行 → 跌至 $0.87，FDIC 兜底后回锚", "$3.3B stuck at SVB → fell to $0.87, repegged after the FDIC backstop"), x: "4.3" },
    { c: "num", f: T("UST 崩盘（2022）", "UST collapse (2022)"), b: T("约 400 亿美元蒸发——算法稳定币的墓碑", "≈ $40B erased — the algorithmic stablecoin's headstone"), x: "10.6" },
    // 法规
    { c: "law", f: T("合格投资者", "Accredited investor"), b: T("净资产 100 万美元（不含自住房）或年收入 20 万/夫妻 30 万", "$1M net worth (ex-home) or $200k income / $300k joint"), x: "7.2" },
    { c: "law", f: T("合格购买者 QP", "Qualified purchaser (QP)"), b: T("投资资产 500 万美元——BUIDL 的 500 万起投正对应它", "$5M in investments — BUIDL's $5M minimum mirrors it"), x: "7.2" },
    { c: "law", f: "12(g)", b: T("2000 名登记持有人（或 500 名非合格）触发登记义务", "2,000 holders of record (or 500 non-accredited) triggers registration"), x: "11.1" },
    { c: "law", f: "Rule 144", b: T("私募转售锁定：报告公司 6 个月，非报告公司 12 个月", "Resale lock: 6 months (reporting), 12 months (non-reporting)"), x: "11.1" },
    { c: "law", f: "Reg A+", b: T("迷你 IPO，12 个月上限 7500 万美元", "Mini-IPO, $75M cap per 12 months"), x: "11.1" },
    { c: "law", f: "Reg D 506(b)/(c)", b: T("私募豁免；506(c) 可公开宣传但须逐个验资", "Private placement exemption; 506(c) allows solicitation with buyer verification"), x: "11.1" },
    { c: "law", f: "Reg S", b: T("离岸发行豁免——排除美国人，USDY 走的就是这条", "Offshore exemption — excludes US persons; USDY's path"), x: "11.1" },
    { c: "law", f: T("欧盟招股书门槛", "EU prospectus threshold"), b: T("800 万欧元（成员国可调）", "€8M (member states may vary)"), x: "11.2" },
    { c: "law", f: "MiCA", b: T("2024 年全面适用（稳定币条款 2024 年 6 月起）", "Fully applicable 2024 (stablecoin provisions from June 2024)"), x: "11.2" },
    { c: "law", f: T("GENIUS 法案", "GENIUS Act"), b: T("美国联邦支付稳定币法，2025 年 7 月签署", "US federal payment-stablecoin law, signed July 2025"), x: "4.4" },
    { c: "law", f: "T+1", b: T("美股 2024 年 5 月起 T+1 结算（此前 T+2）", "US equities settle T+1 since May 2024 (was T+2)"), x: "3.4" },
    { c: "law", f: T("Howey 测试", "The Howey test"), b: T("出资 + 共同事业 + 期待利润 + 来自他人努力 = 证券（1946）", "Investment of money + common enterprise + expectation of profit + from others' efforts = a security (1946)"), x: "11.1" },
    // 标准
    { c: "std", f: "ERC-20", b: T("transfer 只检查余额——证券装不进裸 ERC-20 的全部原因", "transfer checks only the balance — the entire reason a security doesn't fit"), x: "2.4" },
    { c: "std", f: "ERC-3643 (T-REX)", b: T("每次 transfer 查身份注册表 + 合规模块；forcedTransfer/freeze/pause/recovery", "Every transfer consults the identity registry + compliance module; forcedTransfer/freeze/pause/recovery"), x: "6.2" },
    { c: "std", f: "ERC-4626", b: T("代币化金库：deposit/withdraw/convertToShares——DeFi 已经会读的语言", "Tokenized vault: deposit/withdraw/convertToShares — a language DeFi already reads"), x: "6.4" },
    { c: "std", f: "ONCHAINID", b: T("链上身份与声明：可信签发者签的资格声明，可跨发行方复用", "On-chain identity & claims: eligibility signed by trusted issuers, reusable across issuers"), x: "6.3" },
    { c: "std", f: T("Proof of Reserve", "Proof of Reserve"), b: T("证明“某时刻钱包里有 X”，证明不了“没同时欠着 X”", "Proves “X was there at a moment,” never “X isn't simultaneously owed”"), x: "8.3" },
    { c: "std", f: T("NAV 喂价", "NAV feed"), b: T("心跳 + 偏差阈值；节奏必须与资产真实可计算频率一致", "Heartbeat + deviation threshold; cadence must match how often the asset is genuinely computable"), x: "8.2" },
    // 风险工具
    { c: "tool", f: T("六层风险地图", "The six-layer risk map"), b: T("资产 → 发行方 → 法律 → 托管 → 数据 → 合约；串联，最弱一层定生死", "Asset → issuer → legal → custody → data → contract; in series, the weakest decides"), x: "12.1" },
    { c: "tool", f: T("流动性放大器", "The liquidity amplifier"), b: T("不是第七层：不制造损失，只决定坏消息到达时你还剩多少选择", "Not a seventh layer: creates no loss, only decides your options when bad news arrives"), x: "12.1" },
    { c: "tool", f: T("尽调红旗 · 托管", "Red flag · custody"), b: T("托管方“无名无姓”（“与领先机构合作”）= 第一红旗", "An unnamed custodian (“we partner with leading institutions”) = red flag #1"), x: "12.3" },
    { c: "tool", f: T("尽调红旗 · 审计", "Red flag · audit"), b: T("审计报告指向的不是实际部署地址（审 v1.2、部署 v1.3 = 没审）", "The audit points at a different address than deployed (audit v1.2, ship v1.3 = no audit)"), x: "12.2" },
    { c: "tool", f: T("尽调红旗 · 赎回", "Red flag · redemption"), b: T("承诺“随时赎回”但底层明显不流动；官网与 PPM 表述不一致", "“Redeem anytime” over an illiquid underlying; site language contradicting the PPM"), x: "12.3" },
    { c: "tool", f: T("尽调红旗 · 密钥", "Red flag · keys"), b: T("管理员密钥是单个 EOA，无多签无时间锁", "Admin keys on a single EOA, no multisig, no timelock"), x: "12.3" },
    { c: "tool", f: T("七问文件清单", "The seven document questions"), b: T("资产 / 请求权 / 托管 / 审计地址 / 赎回 / 费用全貌 / 出事去哪告", "Asset / claim / custody / audited address / redemption / full fees / where to sue"), x: "12.2" },
    { c: "tool", f: T("每月 20 分钟例行", "The 20-minute monthly routine"), b: T("10 分钟过五个监控指标 + 5 分钟扫一个监管机构 + 5 分钟重读一节 PPM", "10 min on the five metrics + 5 min on one regulator + 5 min rereading one PPM section"), x: "13.4" },
    // 公式
    { c: "fx", f: "NAV", b: T("NAV = （资产 − 负债）÷ 份额，由基金行政方每日计算", "NAV = (assets − liabilities) ÷ shares, computed daily by the fund administrator"), x: "3.3" },
    { c: "fx", f: T("收益分解", "Yield decomposition"), b: T("净收益 = 底层收益 − 费用堆 ± 杠杆 ± 期限/信用溢价 − 未披露风险折价", "Net = underlying − fee stack ± leverage ± term/credit premium − undisclosed risk discount"), x: "12.4" },
    { c: "fx", f: T("风险溢价", "Risk premium"), b: T("产品收益 − 同期限国债 = 溢价；解释不了的部分就是你没看见的风险", "Product yield − same-tenor treasury = premium; whatever won't decompose is the risk you can't see"), x: "12.4" },
    { c: "fx", f: T("选型因果链", "The selection causal chain"), b: T("先选买家 → 买家选法律 → 法律选结构 → 结构选技术；倒着走的死在 10.6", "Buyers → law → structure → technology; running it backwards ends in Stage 10.6"), x: "13.3" },
    { c: "fx", f: T("发行现实区间", "Issuance reality band"), b: T("认真的首次发行：4–9 个月、15 万–100 万美元以上；技术部署只占几天", "A serious first issuance: 4–9 months, $150k–$1M+; deployment is days of it"), x: "13.2" },
    { c: "fx", f: T("供应商数量", "Vendor count"), b: T("组装一个平台通常签 6–10 家：中介没消失，只是重新专业化", "Assembling a platform usually means 6–10 vendors: intermediaries re-specialized, not vanished"), x: "13.1" },
    // 阶段要点
    { c: "stage", f: T("阶段 0", "Stage 0"), b: T("所有权只是一条记录；代币化换的是记账系统，不是资产本身", "Ownership is only a record; tokenization swaps the bookkeeping, not the asset"), x: "0.2" },
    { c: "stage", f: T("阶段 1", "Stage 1"), b: T("代币在链上、资产在现实里——那座信任之桥是全行业的核心问题", "The token is on-chain, the asset isn't — that trust bridge is the industry's core problem"), x: "1.3" },
    { c: "stage", f: T("阶段 4", "Stage 4"), b: T("稳定币的风险从来不在代码，在储备放在哪家银行", "A stablecoin's risk was never in the code — it's which bank holds the reserves"), x: "4.3" },
    { c: "stage", f: T("阶段 5", "Stage 5"), b: T("你买的不是资产，是对资产的请求权", "You don't own the asset — you own a claim on it"), x: "5.1" },
    { c: "stage", f: T("阶段 7", "Stage 7"), b: T("合规系统的价值 100% 体现在它拒绝的交易上", "A compliance system's value lives 100% in the transfers it refuses"), x: "7.3" },
    { c: "stage", f: T("阶段 9", "Stage 9"), b: T("价格贴着 NAV 走靠的是赎回通道，不是交易量", "Price hugs NAV because of the redemption channel, not trading volume"), x: "9.4" },
    { c: "stage", f: T("阶段 10", "Stage 10"), b: T("墓地的第一死因：建好了没人来——需求必须先于供给被验证", "The graveyard's #1 cause of death: built it, nobody came — validate demand before supply"), x: "10.6" },
    { c: "stage", f: T("阶段 13", "Stage 13"), b: T("法律定形，技术填形；好架构是盒子之间那些必须对得上的箭头", "Law sets the shape, tech fills it in; good architecture is the arrows that must reconcile"), x: "13.1" },
  ];

  let q = "";
  let cat = "all";
  let flipped = {};
  let quizMode = false;
  let quizCard = null;
  let quizShown = false;
  let printView = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("📖 RWA 速查表 · 可搜索 · 可自测", "📖 RWA cheat sheet · searchable · self-testable")}</div>
      <div class="demo-block">
        <input class="demo-inp" id="cs-q" style="width:100%" placeholder="${T("搜名词或数字，如：QP / Rule 144 / NAV / 红旗", "search a term or number, e.g. QP / Rule 144 / NAV / red flag")}" />
        <div class="demo-btns" id="cs-pills" style="margin-top:8px"></div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="cs-quiz">${T("🎲 随机抽考", "🎲 Random recall")}</button>
        <button class="demo-btn" id="cs-print">${T("🖨 打印视图", "🖨 Print view")}</button>
        <button class="demo-btn" id="cs-reset">${T("↺ 全部合上", "↺ Close all")}</button>
      </div>
      <div id="cs-out" style="max-height:340px;overflow:auto;margin-top:8px"></div>
      <p class="demo-tip">${T("专家的标志不是记住这一页，而是<strong>每个格子都能讲出背后的那一课</strong>。用“随机抽考”盖住正面自测：说不出来的那一格，就是你要回去重读的那一节。", "The mark of an expert isn't memorizing this page — it's <strong>being able to teach the lesson behind every cell</strong>. Use random recall to test yourself: whichever cell you can't say is the lesson to reread.")}</p>
    </div>`;

  const out = root.querySelector("#cs-out");
  const pills = root.querySelector("#cs-pills");
  const input = root.querySelector("#cs-q");

  function hits() {
    const ql = q.trim().toLowerCase();
    return cards.filter((c) => (cat === "all" || c.c === cat) &&
      (ql === "" || c.f.toLowerCase().includes(ql) || c.b.toLowerCase().includes(ql) || c.x.includes(ql)));
  }

  function render() {
    const keys = ["all"].concat(Object.keys(CAT));
    pills.innerHTML = keys.map((k) => `<button class="demo-btn ${k === cat ? "active" : ""}" data-c="${k}" style="font-size:11px">${k === "all" ? T("全部", "All") : CAT[k]}</button>`).join("");
    pills.querySelectorAll("[data-c]").forEach((b) =>
      b.addEventListener("click", () => { cat = b.dataset.c; quizMode = false; printView = false; render(); }));

    if (quizMode) {
      const c = quizCard;
      out.innerHTML = `
        <div class="demo-block" style="text-align:center;padding:18px">
          <div class="demo-label">${T("背面（先回忆正面是什么名词/数字）", "Back of the card (recall the term first)")}</div>
          <div style="font-size:13px;color:var(--ink);margin:10px 0;line-height:1.5">${c.b}</div>
          <div style="font-size:11px;color:var(--muted)">${CAT[c.c]} · ${T("阶段", "Stage")} ${c.x}</div>
          ${quizShown ? `<div style="margin-top:12px;padding:8px;border-radius:8px;background:var(--green-soft);border:1px solid var(--line)"><b style="color:var(--ink)">${c.f}</b></div>` : ""}
          <div class="demo-btns" style="justify-content:center;margin-top:12px">
            <button class="demo-btn" id="cs-show">${quizShown ? T("下一张", "Next card") : T("翻开正面", "Reveal")}</button>
            <button class="demo-btn" id="cs-exit">${T("退出抽考", "Exit recall")}</button>
          </div>
        </div>`;
      out.querySelector("#cs-show").addEventListener("click", () => {
        if (quizShown) { quizCard = cards[Math.floor(Math.random() * cards.length)]; quizShown = false; }
        else quizShown = true;
        render();
      });
      out.querySelector("#cs-exit").addEventListener("click", () => { quizMode = false; render(); });
      return;
    }

    const h = hits();
    if (printView) {
      out.innerHTML = `<div class="demo-block" style="font-size:11px;line-height:1.6">
        <div class="demo-label">${T("打印视图 · 全部 " + h.length + " 条", "Print view · all " + h.length + " entries")}</div>
        ${h.map((c) => `<div style="padding:3px 0;border-bottom:1px solid var(--line)"><b style="color:var(--ink)">${c.f}</b> — ${c.b} <span style="color:var(--muted);font-family:var(--mono)">[${c.x}]</span></div>`).join("")}
      </div>`;
      return;
    }

    out.innerHTML = `<div class="demo-meta" style="margin-bottom:8px">${T("命中", "Matches")} <b>${h.length}</b> / ${cards.length}　<span style="color:var(--muted)">${T("点卡片翻面", "click a card to flip")}</span></div>` +
      (h.length ? `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">` + h.map((c) => {
        const i = cards.indexOf(c);
        const isF = flipped[i];
        return `<div data-flip="${i}" style="cursor:pointer;padding:8px;border-radius:8px;background:${isF ? "var(--orange-soft)" : "var(--surface-2)"};border:1px solid ${isF ? "var(--orange-line)" : "var(--line)"}">
          <div style="font-size:11.5px;font-weight:700;color:var(--ink)">${c.f}</div>
          ${isF ? `<div style="font-size:10.5px;color:var(--muted);margin-top:4px;line-height:1.45">${c.b}</div>
            <div style="font-size:10px;color:var(--orange-ink);margin-top:4px;font-family:var(--mono)">${T("阶段", "Stage")} ${c.x}</div>` :
          `<div style="font-size:10px;color:var(--muted);margin-top:3px">${CAT[c.c]}</div>`}
        </div>`;
      }).join("") + `</div>` : `<div class="demo-meta">${T("没找到，换个词。", "Nothing — try another term.")}</div>`);

    out.querySelectorAll("[data-flip]").forEach((el) =>
      el.addEventListener("click", () => { const i = el.dataset.flip; flipped[i] = !flipped[i]; render(); }));
  }

  input.addEventListener("input", (e) => { q = e.target.value; quizMode = false; printView = false; render(); });
  root.querySelector("#cs-quiz").addEventListener("click", () => {
    quizMode = true; printView = false; quizShown = false;
    quizCard = cards[Math.floor(Math.random() * cards.length)];
    render();
  });
  root.querySelector("#cs-print").addEventListener("click", () => { printView = !printView; quizMode = false; render(); });
  root.querySelector("#cs-reset").addEventListener("click", () => { flipped = {}; quizMode = false; printView = false; render(); });

  render();
}
