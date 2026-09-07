export default {
  id: "case-buidl",
  stage: 10,
  order: 1,
  title: "BlackRock BUIDL：代币化国债基金的标杆",
  difficulty: "mastery",
  prereqs: ["token-vs-claim", "redemption-peg"],

  oneLiner:
    "BUIDL 是把整个课程装进一个产品的案例：全球最大资产管理公司贝莱德，把一只货币市场式基金的“股东名册”搬上了链。五个传统角色（管理人、托管行、行政管理人、过户代理、募集代理）一个都没少——只是重新接了线：名册变成代币，结算变成即时，赎回变成 7×24。它证明了机构级管道端到端走得通；但它没证明去中介化，也没证明散户可及——恰恰相反，它是穿着链上结算外衣的传统金融，而这正是它能第一个跑通的原因。",

  intuition: `
2024 年 3 月，管理着约 10 万亿美元的贝莱德（BlackRock）做了一件让整个行业坐直了的事：发行了自己的第一只代币化基金——**BlackRock USD Institutional Digital Liquidity Fund**，代码 **BUIDL**。几个月内规模冲过 5 亿美元，截至 2025 年约 20–30 亿美元，成了代币化国债这个类别的**标杆**。

你现在的位置很特殊：阶段 5 到阶段 9，你已经把法律包装、代币标准、合规机器、预言机、流动性机制全部学完了。这一课不教新概念——它是一场**实弹演习**：把你工具箱里的每一件工具都拿出来，对着一个真实产品用一遍。BUIDL 的每一个设计决定，都对应课程里的某一节。

看懂 BUIDL，你就看懂了机构做 RWA 的“标准解法”；看清它**没做到**的事，你才算真正毕业。

**这一节，我们拆成五块：**

- **① 阵容与结构——五个角色，一个都没少**
- **② 条款拆解——用课程的每一副透镜读一遍**
- **③ 杀手锏——7×24 的 USDC 赎回通道**
- **④ 增长与用途——它是怎么被真正用起来的**
- **⑤ 两面评估——它证明了什么，没证明什么**
`,

  mechanics: `
### ① 阵容与结构：五个角色，一个都没少

先把公开资料里的“演员表”排出来。BUIDL 是一只注册在**英属维尔京群岛（BVI）**的基金——离岸基金壳，专业投资者市场的常规操作（阶段 5.2 讲过为什么发行方偏爱这类法域）。围绕它的是一套你在阶段 3.3 见过的完整基金班底：

- **BlackRock（贝莱德）**：基金**管理人**，决定投什么——现金、短期美国国债、隔夜回购，目标是货币市场基金式的稳定 1 美元/份。
- **Securitize**：**代币化平台 + 在 SEC 注册的过户代理（transfer agent）+ 募集代理**。注意“过户代理”这四个字——它是法律意义上的股东名册保管人，而它维护的名册**就是链上的代币账本**。这正是阶段 5.3 讲的“链上登记与法律名册同步”问题的教科书解法：让同一家持牌机构同时管两边，两边就是一边。
- **BNY Mellon（纽约梅隆银行）**：**托管行 + 行政管理人**，链下资产（国债、现金、回购）躺在它的账户里，NAV 由它这条线计算。代币在链上飞，资产在 240 年历史的托管行里睡觉——阶段 1.2 那句“代币在链上，资产在现实里”的具象版。
- **链**：以太坊首发，之后通过 **Wormhole** 桥接扩展到 Aptos、Arbitrum、Avalanche、Optimism、Polygon、Solana 等多条链。这是阶段 2.6 讨论过的“**分发优先于纯粹**”：客户在哪条链上，产品就去哪条链——代价是多链供应量必须时刻对得上总名册，这正是阶段 8.3 储备证明/供应量对账要盯的事。

<figure>
<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="buidl-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <rect x="230" y="20" width="180" height="52" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="320" y="42" text-anchor="middle" font-size="12" font-weight="700" fill="var(--orange-ink)">BUIDL 基金（BVI）</text>
  <text x="320" y="60" text-anchor="middle" font-size="10" fill="var(--muted)">目标 $1/份 · 国债+现金+回购</text>
  <rect x="20" y="120" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="110" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">BlackRock</text>
  <text x="110" y="160" text-anchor="middle" font-size="10" fill="var(--muted)">管理人：决定投什么</text>
  <rect x="230" y="120" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Securitize</text>
  <text x="320" y="160" text-anchor="middle" font-size="10" fill="var(--muted)">过户代理：链=名册 · KYC</text>
  <rect x="440" y="120" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="530" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">BNY Mellon</text>
  <text x="530" y="160" text-anchor="middle" font-size="10" fill="var(--muted)">托管+行政：资产与 NAV</text>
  <rect x="20" y="240" width="180" height="52" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="110" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">合格买家（QP）</text>
  <text x="110" y="280" text-anchor="middle" font-size="10" fill="var(--muted)">白名单地址 · 最低 $5M</text>
  <rect x="230" y="240" width="180" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="320" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">以太坊 + 多链</text>
  <text x="320" y="280" text-anchor="middle" font-size="10" fill="var(--muted)">Wormhole 桥 · 供应量对账</text>
  <rect x="440" y="240" width="180" height="52" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="530" y="262" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Circle 赎回通道</text>
  <text x="530" y="280" text-anchor="middle" font-size="10" fill="var(--muted)">BUIDL → USDC · 7×24</text>
  <line x1="110" y1="120" x2="255" y2="72" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="320" y1="120" x2="320" y2="72" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="530" y1="120" x2="385" y2="72" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="320" y1="240" x2="320" y2="172" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="110" y1="240" x2="110" y2="172" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="200" y1="266" x2="230" y2="266" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
  <line x1="410" y1="266" x2="440" y2="266" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#buidl-arr)"/>
</svg>
</figure>

数一数：管理人、过户代理、托管行、行政管理人、募集代理、桥、赎回通道运营方。**没有一个角色被“去中介化”掉**——这个观察先记下，⑤ 会回来算总账。

### ② 条款拆解：用课程的每一副透镜读一遍

把 BUIDL 的公开条款一条条过，每条旁边标上它对应课程哪一节——这就是“全栈解剖”的意思：

- **代币 = 基金份额**。你持有的 BUIDL 代币是这只 BVI 基金的**股份**，一份对基金资产的请求权——阶段 5.1 债权解剖的标准题型：请求权对着基金，基金资产在 BNY 托管，破产隔离由基金结构本身提供。
- **谁能买**：Reg D 506(c) 私募 + 仅限**合格买家（Qualified Purchaser，通常要求 500 万美元以上可投资产，比“合格投资者”门槛高一个量级）**，最低申购 **500 万美元**。这是阶段 7.2 “合规几何学”的一个极端角落：门槛拉满，换来募集流程最顺。
- **转账限制**：BUIDL 只能在**白名单地址之间**转——每个地址背后都是 Securitize 完成 KYC 的合格买家（阶段 7.3 的转账检查落地）。注意：它用的是 Securitize 自家的 DS 系合规体系，**不是** ERC-3643——但检查逻辑同构：身份注册表 + 转账时验证。这是阶段 6.3 强调过的“**认模式，不认品牌**”：标准名字可以不同，许可型代币的骨架是一样的。
- **收益怎么给**：每日**计提**股息，每月以**新代币**的形式发到你地址——余额变多、单价维持 1 美元，货币市场基金的体验（阶段 3.3），用阶段 8.4 讲的 rebase 式分发实现。你不用做任何事，月底钱包里的 BUIDL 数量就长了一截。

每一条都不新鲜——**新鲜的是它们第一次被一家十万亿级资管，一次性、合规地、全部组装在一起**。

### ③ 杀手锏：7×24 的 USDC 赎回通道

如果只做到 ②，BUIDL 只是“又一只链上基金”。真正让它成为标杆的是这一条：Circle 提供了一个**智能合约赎回通道**——持有人可以**任何时刻**（深夜、周末、节假日）把 BUIDL 按 1:1 换成 **USDC**，几分钟内到账，不用等基金的申赎窗口。

用阶段 9.4 的语言说：这是一个**永不打烊的套利回路**。任何时候 BUIDL 在任何场合的价格敢低于 1 美元，套利者立刻买入、走通道换成 USDC，价差瞬间被吃掉——所以 BUIDL 的锚是市场上**最紧**的一类。对比一下传统货币市场基金：周五晚上想赎回？等周一下单，T+1 电汇到账，中间隔着整个周末。

这条通道还解锁了 ③ 的第二层价值：**可即时清算的资产才配当保证金**（阶段 9.3）。衍生品交易所接受 BUIDL 做抵押品，就是因为爆仓时它能在几分钟内变成 USDC，而不是“等基金下个赎回日”。收益率 + 即时流动性，这个组合在传统世界里不存在。

但要看清它的边界：通道里的 USDC 是**预先注资的缓冲池**，不是魔法。基金底层的国债仍然只在传统时段结算（阶段 3.4）；如果整个市场同时冲向出口、缓冲池被抽干，剩下的人还是要走传统赎回流程。7×24 的是**窗口**，不是底层资产。

### ④ 增长与用途：它是怎么被真正用起来的

数字（记住阶段 12 的纪律：市场数字看量级、别背精度）：发行后几个月规模突破 **5 亿美元**，截至 2025 年约 **20–30 亿美元**，长期占据代币化国债类别第一（该类别整体约 70–80 亿美元）。更有信息量的是**谁在用、怎么用**：

- **当储备资产**：Ethena 的稳定币 USDtb 把大部分储备放在 BUIDL 里——一个加密原生稳定币，用贝莱德的代币化基金当底仓。阶段 4 的稳定币和阶段 10 的代币化基金，在这里咬合成了一个环。
- **当保证金**：多家主要交易平台与机构经纪接受 BUIDL 作为衍生品抵押品——闲置保证金从“不生息的稳定币”换成“生息的国债份额”。
- **当模板**：BUIDL 之后，富达（Fidelity）等一线资管相继申报类似产品。它真正的产出不是 30 亿美元规模，而是**一张被验证过的图纸**。

### ⑤ 两面评估：它证明了什么，没证明什么

现在用专家的方式收尾——两列都要写满。

**BUIDL 证明了**：机构级管道**端到端走得通**。五个角色一个没少，但接线全变了：股东名册就是链上账本（不再对账）、结算即时（不再 T+1）、分红是合约动作（不再邮寄支票）、赎回 7×24（不再等窗口）。监管没有为它修改任何规则——它在**现有**法律缝隙里把全套流程跑通了。

**BUIDL 没证明的**，恰好是宣传里最常见的三句话：

- **没证明“人人可及”**：Reg D + 合格买家 + 500 万美元起投，这是比传统货币市场基金**更窄**的门（普通 MMF 一美元就能买）。
- **没证明“去中介化”**：回到 ① 数节点——BlackRock、Securitize、BNY Mellon、Circle、Wormhole……一只普通 MMF 反而没这么多具名中介。代币化消灭的不是中介，是中介之间的**对账与等待**。
- **没证明“链上价格发现”**：BUIDL 几乎没有二级市场，它是一台**一级市场机器**（阶段 9.1）：申购、持有、赎回，价格由 NAV 和赎回通道钉死，不由买卖盘决定。

这一节你只要带走一句话：**BUIDL 是穿着链上结算外衣的传统金融——五个角色原封不动，只是把名册和结算换成了链——而“没有颠覆任何人”恰恰是它能第一个跑通的原因。**
`,

  demo: "buidl-anatomy",

  analogy: `
把 BUIDL 想成一家**米其林三星老店开出的 24 小时自助取餐窗口**。

后厨完全没动：还是原来的主厨（BlackRock 决定菜单）、原来的冷库（BNY Mellon 存着食材）、原来的卫生监督员（审计与行政）。食材还是最保守的那几样——米、面、清汤（国债、现金、回购）。你若指望后厨发生革命，会失望。

变的是**前厅**。以前你要预约、排队、在营业时间内堂食结账（申赎窗口、T+1 电汇）；现在墙上开了一个刷卡即取的窗口（智能合约），深夜两点也能取餐，还能当场把餐券原价退成现金（USDC 赎回通道）。窗口边站着一位查证件的门卫（Securitize 的白名单）——但只要你有会员卡，一切都是即时的。

有意思的是：这家店的会员卡**只发给资产 500 万美元以上的老饕**。所以它证明的不是“人人都能吃上三星”，而是“三星后厨完全可以接上 24 小时窗口，一点不掉水准”。街对面的餐馆看到窗口排起的队，第二天全去装同款窗口了——这才是它真正改变行业的方式。
`,

  misconceptions: [
    "“BUIDL 让普通人也能买贝莱德的链上基金了。” —— 恰恰相反。Reg D 506(c) + 合格买家 + 最低 500 万美元，门槛比普通货币市场基金（一美元起）高得多。BUIDL 证明的是机构管道，不是普惠金融。",
    "“代币化 = 去中介化，BUIDL 干掉了中间人。” —— 数一数：BlackRock、Securitize、BNY Mellon、Circle、Wormhole——具名中介比一只普通 MMF 还多。代币化消灭的是中介之间的对账与等待（名册即账本、结算即时），不是中介本身。",
    "“BUIDL 的 1 美元是市场买卖交易出来的。” —— 它几乎没有二级市场。价格被 NAV 和 7×24 USDC 赎回通道的套利回路钉在 1 美元（阶段 9.4），这是一台一级市场机器，不是价格发现场所。",
    "“BUIDL 用的是 ERC-3643 标准。” —— 不是。Securitize 用自家 DS 系合规体系实现白名单与转账检查。但模式同构：身份注册 + 转账时验证。记住阶段 6.3 的原则：认模式，不认品牌。",
    "“7×24 赎回意味着底层资产也 7×24 流动了。” —— 通道是预先注资的 USDC 缓冲池。底层国债仍在传统时段结算；极端挤兑下缓冲耗尽，剩余赎回仍要走传统流程。7×24 的是窗口，不是资产。",
  ],

  quiz: [
    {
      q: "在 BUIDL 结构里，Securitize 扮演的最关键法律角色是什么？",
      options: ["基金管理人，决定投资组合", "SEC 注册的过户代理——它维护的法律股东名册就是链上代币账本", "托管行，保管底层国债", "做市商，维持二级市场价格"],
      answer: 1,
      explain: "过户代理身份让“链上账本=法律名册”成立（阶段 5.3）：同一家持牌机构管两边，两边就是一边。管理人是 BlackRock，托管是 BNY Mellon。",
    },
    {
      q: "BUIDL 的“杀手锏”——Circle 的 USDC 赎回通道——为什么能让它的锚特别紧？",
      options: ["因为贝莱德承诺回购", "因为它是一个 7×24 永不打烊的套利回路：价格一低于 $1 就有人买入换 USDC，价差瞬间被吃掉", "因为监管规定它必须等于 $1", "因为 BUIDL 交易量大，流动性好"],
      answer: 1,
      explain: "阶段 9.4 的机制：赎回通道随时开着，套利者随时能把折价搬平。这也是它能当衍生品保证金的原因——爆仓时几分钟变现。",
    },
    {
      q: "下面哪件事是 BUIDL 真正证明了的？",
      options: ["散户可以低门槛买入代币化国债", "代币化能减少金融中介的数量", "机构级管道端到端走得通：五个传统角色重新接线后，名册上链、结算即时、赎回 7×24", "链上二级市场能为基金份额做价格发现"],
      answer: 2,
      explain: "另外三项恰好是 BUIDL 没证明的：它 QP 限定（非散户）、具名中介更多（非去中介）、几乎无二级市场（非价格发现）。",
    },
    {
      q: "BUIDL 的月度分红机制是怎样的？",
      options: ["每月把 USDC 直接打到持有人银行账户", "份额单价每天上涨，体现累积收益", "每日计提股息，每月以新 BUIDL 代币发放——余额变多，单价保持 $1", "收益自动复投到 Ethena 的 USDtb"],
      answer: 2,
      explain: "这是货币市场基金式的稳定单价 + rebase 式分发（阶段 8.4）：价格钉住 $1，收益体现为代币数量增长。",
    },
    {
      q: "为什么说“BUIDL 是穿着链上结算外衣的传统金融，而这正是它成功的原因”？",
      options: ["因为它偷偷绕开了监管", "因为它没有改变任何法律与角色结构，只替换了名册与结算层——监管者与机构无需信任任何新东西，所以它能第一个合规跑通", "因为传统金融的技术本来就更好", "因为它不用区块链也能运行"],
      answer: 1,
      explain: "五个角色原封不动、全部持牌，创新被压缩在“接线方式”上。颠覆最少的方案，往往是第一个被放行的方案。",
    },
  ],

  further: [
    { label: "Securitize 官网（BUIDL 的过户代理与代币化平台）", url: "https://securitize.io" },
    { label: "BlackRock 新闻室（BUIDL 发行公告检索）", url: "https://www.blackrock.com/corporate/newsroom" },
    { label: "RWA.xyz：代币化国债实时数据面板", url: "https://app.rwa.xyz/treasuries" },
    { label: "Circle 官网（USDC 与赎回通道背景）", url: "https://www.circle.com" },
    { label: "SEC：私募发行豁免规则总览（Reg D 等）", url: "https://www.sec.gov/smallbusiness/exemptofferings" },
  ],
};
