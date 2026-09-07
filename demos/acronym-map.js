// 交互演示：缩写图鉴——按六条线筛选 + 搜索，点卡片翻开全称、一句话定义与“在哪一站细讲”。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = (n) => (en ? `Stage ${n}` : `阶段 ${n}`);

  const CL = [
    { id: "fin", label: T("资产金融", "Finance") },
    { id: "law", label: T("结构法律", "Law") },
    { id: "chain", label: T("链与标准", "Standards") },
    { id: "comp", label: T("合规", "Compliance") },
    { id: "data", label: T("数据", "Data") },
    { id: "reg", label: T("监管", "Regulators") },
  ];

  const D = [
    ["fin", "RWA", "Real-World Asset", T("现实资产权利做成链上代币的统称", "Umbrella term for real-asset rights as on-chain tokens"), "0.1"],
    ["fin", "T-Bill", "Treasury Bill", T("一年内贴现发行的美国短期国库券，RWA 头号底层资产", "Short-term US government debt sold at a discount; RWA's #1 underlying"), "3.2"],
    ["fin", "MMF", "Money Market Fund", T("买短债管现金的基金，代币化国债基金的原型", "Cash-management fund holding short-term debt; prototype of tokenized Treasury funds"), "3.3"],
    ["fin", "NAV", "Net Asset Value", T("（资产−负债）÷份额，每天算一次的“每份多少钱”", "(Assets − liabilities) ÷ shares — the daily per-share value"), "3.3"],
    ["fin", "AUM", "Assets Under Management", T("一只基金/机构管着多少钱", "How much money a fund or institution manages"), "3.3"],
    ["fin", "bp", "basis point", T("万分之一（0.01%）；“15bp 管理费”= 0.15%", "One hundredth of a percent; a 15bp fee = 0.15%"), "3.2"],
    ["fin", "DvP", "Delivery versus Payment", T("一手交钱一手交券，原子结算的传统名字", "Cash and securities swap simultaneously — atomic settlement's TradFi name"), "3.4"],
    ["fin", "T+1", "Trade date + 1 day", T("成交后 1 个工作日交收；美股 2024 年 5 月起实行", "Settlement one business day after trade; US equities since May 2024"), "3.4"],
    ["fin", "LP", "Limited Partner", T("私募基金里出钱不管事的投资人", "The money-in, hands-off investor in a private fund"), "3.5"],
    ["fin", "PE", "Private Equity", T("不上市公司的股权投资，典型低流动性资产", "Equity in unlisted companies; classically illiquid"), "3.5"],
    ["law", "SPV", "Special Purpose Vehicle", T("只为持有一件资产而生的壳公司，破产隔离防火墙", "A shell entity born to hold one asset; the bankruptcy-remoteness firewall"), "5.2"],
    ["law", "PPM", "Private Placement Memorandum", T("私募发行说明书，风险与条款全在里面", "The private offering's manual — every risk and term inside"), "12.2"],
    ["law", "Reg D", "Regulation D", T("美国私募豁免：不注册可卖，一般限合格投资者", "US private-placement exemption; generally accredited investors only"), "7.2"],
    ["law", "Reg S", "Regulation S", T("离岸豁免：只卖给非美人士", "Offshore exemption: non-US persons only"), "7.2"],
    ["law", "Reg A+", "Regulation A+", T("“迷你 IPO”：可向公众募集，年上限 $75M", "The mini-IPO: open to the public, capped at $75M/year"), "11.1"],
    ["law", "AI", "Accredited Investor", T("合格投资者：净资产 $1M（除自住房）或收入达标", "Accredited investor: $1M net worth (ex-home) or income test"), "7.2"],
    ["law", "QP", "Qualified Purchaser", T("合格购买者：可投资产 $5M+，BUIDL 级门槛", "Qualified purchaser: $5M+ investable assets — the BUIDL-tier bar"), "7.2"],
    ["law", "ATS", "Alternative Trading System", T("持牌撮合证券的“小交易所”，证券代币二级市场场地", "Licensed mini-exchange; the legal venue for security-token trading"), "11.1"],
    ["law", "TA", "Transfer Agent", T("维护股东名册的持牌机构", "Licensed keeper of the shareholder register"), "3.4"],
    ["law", "Rule 144", "SEC Rule 144", T("私募证券转售规则：一般锁定 12 个月", "Resale rule for private securities: generally a 12-month lockup"), "11.1"],
    ["law", "Howey", "Howey Test", T("投钱+共同事业+盈利预期+靠他人努力 = 证券", "Money + common enterprise + profit expectation + others' efforts = security"), "11.1"],
    ["chain", "ERC-20", "Ethereum token standard 20", T("同质化代币标准：一张地址→余额表", "Fungible-token standard: an address→balance table"), "2.4"],
    ["chain", "ERC-721", "Ethereum token standard 721", T("NFT 标准：独一无二的链上凭证", "NFT standard: one-of-a-kind on-chain certificates"), "2.5"],
    ["chain", "ERC-3643", "T-REX permissioned token", T("许可型代币标准：转账前查身份注册表", "Permissioned standard: transfers consult an identity registry first"), "6.2"],
    ["chain", "ERC-4626", "Tokenized vault standard", T("代币化金库：存资产、拿生息份额的统一接口", "Tokenized vault: one interface for deposit-and-earn shares"), "6.4"],
    ["chain", "EOA", "Externally Owned Account", T("私钥直接控制的普通链上账户", "An ordinary account controlled directly by a private key"), "2.2"],
    ["chain", "Gas", "Gas fee", T("链上执行的燃料费，按计算量付", "The fuel fee of on-chain execution, paid by computational weight"), "2.6"],
    ["chain", "L1/L2", "Layer 1 / Layer 2", T("主链与搭在其上的扩容层", "The base chain and the scaling layers built on it"), "2.6"],
    ["comp", "KYC", "Know Your Customer", T("开户前核实身份：护照、地址、资金来源", "Identity verification before onboarding"), "7.1"],
    ["comp", "AML", "Anti-Money Laundering", T("防脏钱洗白的整套制度与监测", "The full system that keeps dirty money out"), "7.1"],
    ["comp", "CFT", "Countering the Financing of Terrorism", T("AML 的孪生兄弟，盯资金流向", "AML's twin — watches where money flows to"), "7.1"],
    ["comp", "OFAC", "Office of Foreign Assets Control", T("美财政部制裁办公室，维护 SDN 名单", "US Treasury's sanctions office; keeper of the SDN list"), "7.1"],
    ["comp", "FATF", "Financial Action Task Force", T("全球反洗钱标准制定者", "Setter of global anti-money-laundering standards"), "7.1"],
    ["comp", "PEP", "Politically Exposed Person", T("政要及亲属，需强化尽调的客户类别", "Officials and relatives — a category needing enhanced diligence"), "7.1"],
    ["comp", "SAR", "Suspicious Activity Report", T("发现可疑交易必须提交的报告", "The report filed when a suspicious transaction is spotted"), "7.1"],
    ["comp", "Travel Rule", "FATF Travel Rule", T("转账双方信息必须随款“旅行”", "Sender/recipient info must travel with the money"), "7.1"],
    ["data", "Oracle", "Blockchain oracle", T("把链下事实签名搬上链的管道；邮差非侦探", "Carries signed off-chain facts on-chain; a postman, not a detective"), "8.1"],
    ["data", "PoR", "Proof of Reserve", T("把“钱还在”做成链上可机读的定期信号", "Turns 'the money is still there' into a machine-readable signal"), "8.3"],
    ["data", "Heartbeat", "Feed heartbeat", T("喂价最长更新间隔：到点必须更新", "A feed's max update interval — update when the clock runs out"), "8.2"],
    ["data", "Deviation", "Deviation threshold", T("价格偏离超阈值即触发更新", "A price move beyond the threshold triggers an update"), "8.2"],
    ["reg", "SEC", "Securities and Exchange Commission", T("美国证券监管者，RWA 绕不开的裁判", "The US securities regulator — RWA's unavoidable referee"), "11.1"],
    ["reg", "CFTC", "Commodity Futures Trading Commission", T("美国商品与衍生品监管者", "US regulator of commodities and derivatives"), "11.1"],
    ["reg", "MiCA", "Markets in Crypto-Assets", T("欧盟统一加密监管，2024 年 12 月全面适用", "The EU's unified crypto framework, fully applicable Dec 2024"), "11.2"],
    ["reg", "ESMA", "European Securities and Markets Authority", T("欧盟层面的证券监管协调者", "EU-level coordinator of securities regulation"), "11.2"],
    ["reg", "MAS", "Monetary Authority of Singapore", T("新加坡央行+监管一体，Project Guardian 操盘手", "Singapore's central bank & regulator; runs Project Guardian"), "11.3"],
    ["reg", "SFC", "Securities and Futures Commission", T("香港证券监管者，代币化规则先行者", "Hong Kong's securities regulator; a tokenization-rules pioneer"), "11.3"],
    ["reg", "GENIUS Act", "US federal stablecoin law", T("美国支付稳定币联邦法，2025 年 7 月签署", "The US federal payment-stablecoin law, signed July 2025"), "4.4"],
    ["reg", "eWpG", "elektronische Wertpapiere Gesetz", T("德国电子证券法：证券可纯电子登记", "Germany's electronic securities act — purely electronic registration"), "5.3"],
    ["reg", "DLT Pilot", "EU DLT Pilot Regime", T("2023 年 3 月起的欧盟链上交易结算试点", "The EU's on-chain trading & settlement pilot, live Mar 2023"), "11.2"],
  ];

  let filter = "all", query = "", open = new Set();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🗺 缩写图鉴 · 六条线 · 点卡片翻开", "🗺 The acronym atlas · six lines · tap a card to flip it")}</div>
      <div class="demo-switch" id="am-chips" style="flex-wrap:wrap">
        <button class="demo-btn active" data-c="all">${T("全部", "All")} (${D.length})</button>
        ${CL.map((c) => `<button class="demo-btn" data-c="${c.id}">${c.label} (${D.filter((d) => d[0] === c.id).length})</button>`).join("")}
      </div>
      <input id="am-q" type="text" placeholder="${T("搜索缩写或全称…", "Search acronym or full name…")}"
        style="width:100%;box-sizing:border-box;margin:8px 0;padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface-2);color:var(--ink);font-family:inherit" />
      <div id="am-cards" style="display:flex;flex-wrap:wrap;gap:6px"></div>
      <p class="demo-tip">${T("别背——点开混个脸熟即可。每张卡都标着<strong>“阶段 N.M”</strong>：那一站会把它讲透。以后忘了词，回这页搜一下。", "Don't memorize — flip cards for a passing acquaintance. Every card names its <strong>“Stage N.M”</strong>: that stop teaches it in depth. Forget a term later? Come back and search.")}</p>
    </div>`;

  const cardsEl = root.querySelector("#am-cards");

  function paint() {
    const q = query.trim().toLowerCase();
    const list = D.filter((d) => (filter === "all" || d[0] === filter) && (!q || d[1].toLowerCase().includes(q) || d[2].toLowerCase().includes(q)));
    cardsEl.innerHTML = list.length ? list.map((d) => {
      const [cl, abbr, full, one, st] = d;
      const isOpen = open.has(abbr);
      const clLabel = CL.find((c) => c.id === cl).label;
      return `<div data-a="${abbr}" style="cursor:pointer;flex:${isOpen ? "1 1 100%" : "0 0 auto"};padding:6px 10px;border:1px solid ${isOpen ? "var(--orange-line)" : "var(--line)"};border-radius:8px;background:${isOpen ? "var(--orange-soft)" : "var(--surface-2)"}">
        <b style="color:${isOpen ? "var(--orange-ink)" : "var(--ink)"};font-family:var(--mono);font-size:13px">${abbr}</b>
        ${isOpen ? `<div style="font-size:12px;color:var(--ink);margin-top:4px"><i style="color:var(--muted)">${full}</i> · <span style="font-size:11px;color:var(--muted)">${clLabel}</span><br>${one} <b style="color:var(--orange-ink)">→ ${S(st)}</b></div>` : ""}
      </div>`;
    }).join("") : `<div style="color:var(--muted);font-size:13px;padding:8px">${T("没找到——换个关键词试试。", "Nothing found — try another keyword.")}</div>`;
    cardsEl.querySelectorAll("[data-a]").forEach((el) =>
      el.addEventListener("click", () => {
        const a = el.dataset.a;
        open.has(a) ? open.delete(a) : open.add(a);
        paint();
      }));
  }

  root.querySelectorAll("#am-chips [data-c]").forEach((b) =>
    b.addEventListener("click", () => {
      filter = b.dataset.c;
      root.querySelectorAll("#am-chips [data-c]").forEach((x) => x.classList.toggle("active", x.dataset.c === filter));
      paint();
    }));
  root.querySelector("#am-q").addEventListener("input", (e) => { query = e.target.value; paint(); });
  paint();
}
