export default {
  id: "case-ondo",
  stage: 10,
  order: 2,
  title: "Ondo OUSG 与 USDY：两种包装，两类客群",
  difficulty: "mastery",
  prereqs: ["case-buidl", "investor-eligibility"],

  oneLiner:
    "Ondo 把阶段 7.2 “合规几何学”的结论做成了公司：同一份底层收益（美国国债利息），造出两个法律设计完全相反的产品——OUSG 走 Reg D 卖给美国机构，代币是基金份额；USDY 走 Reg S 只卖给非美人士，代币是有担保票据，锁定 40 多天后可以自由流通、进 DeFi。资产本身毫无差别，差别全在“卖给谁”这一步。看懂这对产品，你就看懂了 RWA 发行方真正的护城河：不是选资产的能力，而是制造“合规形状”的能力。",

  intuition: `
上一课的 BUIDL 是“一个产品配一类客户”。这一课的 Ondo Finance 更进一步，把同一个问题做了**两遍**：手里的原料只有一样——**美国国债的利息**，全世界最无聊、最同质化的收益；但客户有两类——想要合规基金份额的**美国机构**，和想要“能转账、能进 DeFi 的美元生息代币”的**非美用户**。

一个资产，两类客户，怎么办？普通公司会做一个产品然后二选一。Ondo 的答案是：**做两套完全不同的法律包装**。OUSG 和 USDY 底层几乎是同一堆国债，但一个是基金、一个是票据；一个锁死在白名单里、一个锁定期后自由飞；一个只对美国合格买家、一个恰恰**禁止**美国人碰。

这是全课程里最漂亮的一次“合规几何学”实操：**产品设计的自由度，不在资产端，在客群端**。这一课我们把两套设计拆到螺丝级别。

**这一节，我们拆成五块：**

- **① 一份收益，两种包装——Ondo 的产品哲学**
- **② OUSG——卖给美国机构的基金份额（还套着 BUIDL）**
- **③ USDY——反向几何：非美人士的有担保票据**
- **④ USDY 与 rUSDY——同一经济，两种渲染**
- **⑤ 战略解读与诚实风险——护城河到底是什么**
`,

  mechanics: `
### ① 一份收益，两种包装：Ondo 的产品哲学

先复习阶段 7.2 的核心结论：证券发行没有“全球通用”模式，只有一张**豁免条款的几何地图**——Reg D 面向美国合格投资者（可以卖美国人，但门槛高、转让受限）；Reg S 面向离岸市场（门槛可以低，但**必须**把美国人挡在外面）。大多数发行方在地图上选**一个**位置站住。

Ondo 的洞察是：既然底层收益是**同质化商品**（国债利息谁做都一样），那竞争根本不在资产端——**在包装端**。于是它在几何地图上同时站了两个点：

- **OUSG**：Reg D 角落——美国机构、高门槛、强限制、基金份额。
- **USDY**：Reg S 角落——非美人士、低门槛、锁定后自由流通、担保票据。

两个产品共享投研、共享品牌、共享大部分后台，但法律文件、代币行为、目标用户**完全不同**。下面分开解剖。

### ② OUSG：卖给美国机构的基金份额（还套着 BUIDL）

**OUSG** 的定位是“机构的链上短期国债敞口”。结构上是你熟悉的题型：

- **法律形状**：Reg D 私募，面向美国合格投资者/合格买家级别的机构；代币 = **基金权益**（阶段 5.1 的标准请求权链条：代币 → 基金份额 → 基金资产）。
- **底层最有趣**：OUSG 的资产里有相当比例配置在**代币化国债基金**上——包括对 **BUIDL 的大额持仓**。对，你没看错：**一只代币化基金持有另一只代币化基金**。这是“包装套包装”模式——好处是直接继承 BUIDL 的即时申赎流动性；代价是**每一层都收一道费**（Ondo 的管理费叠在 BlackRock 的管理费上，阶段 12.4 拆收益时要算的账）。
- **价格行为**：**累积型 NAV**——不派息，收益滚进净值，OUSG 单价随时间爬升（阶段 6.4 讲过的“价格上涨型”渲染）。
- **流动性**：依托底层（BUIDL 等）的即时申赎通道，OUSG 做到了**分钟级的铸造与赎回**（美元稳定币进出）——把 BUIDL 的杀手锏转手批发给了自己的客户。

一句话给 OUSG 定位：**它是 BUIDL 的“再分销 + 增强层”**——起投门槛更低一点、操作体验更顺一点，代价是多一层费用和多一个对手方。

### ③ USDY：反向几何——非美人士的有担保票据

**USDY** 是这一课的主菜，因为它的每一个设计都和 OUSG **反着来**：

- **谁能买**：**仅限非美人士**（Reg S 离岸豁免，阶段 7.2）。美国人不但不能买——整个法律架构的有效性就建立在“真的没卖给美国人”上。
- **代币是什么**：不是基金份额，是一张**有担保票据（secured note）**——你是发行主体 **Ondo USDY LLC**（破产隔离的专设主体，阶段 5.2）的**债权人**。阶段 5.1 我们走过这条债权链，这里把关键零件再点一遍：**担保代理人（collateral agent）Ankura Trust** 代表全体持有人持有**第一顺位担保权益**；抵押品是**短期国债 + 银行活期存款**；结构**超额抵押**——Ondo 自己垫着约 3% 的首亏权益垫；每月出**抵押品报告**。
- **点睛之笔——40–50 天锁定期**：新铸造的 USDY 有 40 天以上的**转让锁定**。为什么？Reg S 有“分销合规期”（distribution compliance period）的要求，防止离岸发行的证券立刻回流美国。Ondo 把这条法律时限**直接写进了代币合约**（阶段 7.3 的“规则进代码”）。锁定期一过，USDY 就在非美人士之间**自由转让**——不需要逐笔白名单。
- **自由的回报**：正因为锁定期后可自由流通，USDY 能做到 OUSG 和 BUIDL 做不到的事：**上 DEX、进借贷协议、当 DeFi 抵押品**（阶段 9.3）——对它的目标客群来说，它用起来更像一个“会生息的稳定币”，而不是一只基金。

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="ondo-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <text x="160" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="var(--orange-ink)">OUSG（Reg D · 美国机构）</text>
  <rect x="40" y="40" width="240" height="44" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="160" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">投资者 = 基金份额持有人</text>
  <text x="160" y="74" text-anchor="middle" font-size="9.5" fill="var(--muted)">白名单转让 · 累积型 NAV</text>
  <rect x="40" y="112" width="240" height="44" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="160" y="130" text-anchor="middle" font-size="11" font-weight="700" fill="var(--orange-ink)">OUSG 基金</text>
  <text x="160" y="146" text-anchor="middle" font-size="9.5" fill="var(--muted)">股权型请求权（阶段 5.1）</text>
  <rect x="40" y="184" width="240" height="44" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="160" y="202" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">代币化国债（含 BUIDL）</text>
  <text x="160" y="218" text-anchor="middle" font-size="9.5" fill="var(--muted)">基金套基金 · 费上叠费</text>
  <line x1="160" y1="84" x2="160" y2="112" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <line x1="160" y1="156" x2="160" y2="184" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <text x="480" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="var(--orange-ink)">USDY（Reg S · 仅非美人士）</text>
  <rect x="360" y="40" width="240" height="44" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="480" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">投资者 = 票据债权人</text>
  <text x="480" y="74" text-anchor="middle" font-size="9.5" fill="var(--muted)">锁定 40+ 天 → 自由转让 · 可进 DeFi</text>
  <rect x="360" y="112" width="240" height="44" rx="10" fill="var(--orange-soft)" stroke="var(--orange-line)"/>
  <text x="480" y="130" text-anchor="middle" font-size="11" font-weight="700" fill="var(--orange-ink)">Ondo USDY LLC（破产隔离）</text>
  <text x="480" y="146" text-anchor="middle" font-size="9.5" fill="var(--muted)">债权型请求权 · 约 3% 首亏垫</text>
  <rect x="360" y="184" width="240" height="44" rx="10" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="480" y="202" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">抵押品：国债 + 银行存款</text>
  <text x="480" y="218" text-anchor="middle" font-size="9.5" fill="var(--muted)">担保代理 Ankura · 第一顺位 · 月报</text>
  <line x1="480" y1="84" x2="480" y2="112" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <line x1="480" y1="156" x2="480" y2="184" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ondo-arr)"/>
  <text x="320" y="270" text-anchor="middle" font-size="11" fill="var(--muted)">同一份国债收益 → 两条完全不同的请求权链</text>
</svg>
</figure>

### ④ USDY 与 rUSDY：同一经济，两种渲染

阶段 6.4 讲过：收益体现为“价格上涨”还是“数量变多”，纯粹是**渲染方式**，经济实质相同。Ondo 把这堂课直接做成了产品对：

- **USDY**：累积型——单价从 1 美元起随收益爬升，余额不变。适合当**储值资产**报税、记账。
- **rUSDY**：rebase 型——单价钉住 1 美元，**余额每天变多**。适合当**支付/计价资产**：合约按“1 rUSDY = 1 美元”处理最省事。

两者可以**互相转换**，背后是同一张票据。一个团队同时发两种皮肤，等于官方承认：**这只是前端渲染的选择题，不是金融工程**。

### ⑤ 战略解读与诚实风险：护城河到底是什么

把镜头拉远。Ondo 的资产选择能力毫无稀缺性——买国债不需要天才。它真正的生意是**分销（distribution）**：把同一份商品化收益，**制造成不同合规形状**，精准塞进每一类被法律隔开的客群。护城河 = 牌照 + 合规机器 + 交易所/钱包/DeFi 集成网络，而不是投资水平。它的下一步棋印证了这一点：Ondo 正推进代币化**股票**面向非美用户（Global Markets / Ondo Chain 的野心）——同一套 Reg S 几何，从国债平移到股市（阶段 ∞.1 的预告片）。

诚实的风险清单，两个产品分开写：

- **OUSG**：**包装套包装**——Ondo 的费叠在底层基金的费上，收益被剥两层（阶段 12.4）；且它的流动性是**借来的**，底层基金若限制申赎，OUSG 跟着卡住。
- **USDY**：别被“国债抵押”麻痹——你法律上是一家**年轻公司发行主体的债权人**，不是国债持有人。缓冲垫是真的（担保代理 + 超额抵押 + 月报，读文件！阶段 12.2），但债权就是债权，出事要走执行程序（阶段 5.4）。还有一条冷知识：**偷偷买入的美国人不受这套架构保护**——Reg S 的有效性以排除美国人为前提，混进去的人可能连主张权利的资格都成问题。

这一节你只要带走一句话：**Ondo 卖的不是国债收益，是“合规形状”——同一份商品化的利息，塞进基金壳给美国机构、塞进票据壳给全世界，护城河全在包装机上。**
`,

  demo: "ondo-compare",

  analogy: `
想象一家酒厂，酿的酒全世界只有一种：**最普通的清酒**（国债利息）。按理说这生意没法做出差异化——直到它雇了一位天才包装设计师。

对**持牌会所**（美国机构），它把酒装进**带封条的水晶瓶**：瓶子登记在册、只能在会员之间凭证转让、酒液不取出来、瓶身价值随酒的陈化上涨（OUSG：白名单 + 累积 NAV）。会所要的就是这种“一切有据可查”的形制——他们的合规官只认这种瓶子。

对**海外的大排档**（非美零售），它把同一缸酒灌进**易拉罐**：出厂后先在保税仓压 40 天（Reg S 锁定期），之后随便卖、随便转手、能进任何餐厅的菜单（DEX 和 DeFi）。罐底印着一行小字：这罐酒背后有公证处盯着的抵押酒窖，酒厂还自己垫了 3% 的押金（Ankura + 超额抵押）。

酒，从头到尾是同一缸。**利润全部来自包装线**——以及那张让两种包装都合法出厂的许可证。别的酒厂能酿一样的酒，却造不出这两条包装线，这就是护城河。
`,

  misconceptions: [
    "“OUSG 和 USDY 是两种不同的资产。” —— 底层几乎是同一样东西：短期美国国债的收益。不同的是法律包装（基金份额 vs 有担保票据）和目标客群（美国机构 vs 非美人士）。差异全在包装端，不在资产端。",
    "“USDY 持有人拥有国债。” —— 不。你是 Ondo USDY LLC 的债权人，持有一张有担保票据；国债是抵押品，由担保代理人 Ankura 代表持有人控制。债权 + 抵押 ≠ 直接所有权——出事要走担保执行程序（阶段 5.4）。",
    "“USDY 的 40 天锁定是 Ondo 为了防挤兑设计的。” —— 是法律要求：Reg S 的分销合规期，防止离岸证券立刻回流美国。Ondo 只是把监管时限写进了代币合约（阶段 7.3）。锁定期满后自由转让，这才是它能进 DeFi 的原因。",
    "“美国人偷偷买 USDY，大不了和其他人承担一样的风险。” —— 更糟。整个 Reg S 架构的有效性建立在排除美国人之上；违规混入的美国买家可能根本不在这套保护架构之内，连主张权利的资格都成问题。",
    "“OUSG 持有 BUIDL，等于免费继承了贝莱德的安全性。” —— 继承了流动性，也继承了费用：Ondo 的管理费叠在 BlackRock 的管理费上，两层包装两道费（阶段 12.4）。而且 OUSG 的即时申赎依赖底层通道——底层卡住，它跟着卡住。",
    "“rUSDY 收益更高，因为余额每天都在涨。” —— 收益完全相同。USDY 是价格上涨、rUSDY 是数量上涨，同一张票据的两种渲染（阶段 6.4），可互相转换。选哪个只关乎记账与集成习惯。",
  ],

  quiz: [
    {
      q: "OUSG 与 USDY 最根本的区别是什么？",
      options: ["OUSG 投国债，USDY 投公司债", "底层收益相同，但法律包装相反：OUSG 是 Reg D 下卖给美国机构的基金份额；USDY 是 Reg S 下只卖给非美人士的有担保票据", "OUSG 在以太坊，USDY 在别的链", "OUSG 收益更高"],
      answer: 1,
      explain: "这就是“合规几何学”的实操：一样的资产，按客群制造两种合规形状。差异在包装端，不在资产端。",
    },
    {
      q: "USDY 持有人的法律身份是？",
      options: ["国债的直接所有人", "OUSG 基金的份额持有人", "Ondo USDY LLC 的债权人——持有由担保代理人 Ankura 持第一顺位担保权益、超额抵押支持的有担保票据", "Ondo 公司的股东"],
      answer: 2,
      explain: "阶段 5.1 的债权链：你的请求权对着破产隔离的发行主体，国债与银行存款是抵押品，Ankura 代表全体持有人控制担保权益。",
    },
    {
      q: "USDY 新铸代币的 40–50 天转让锁定，来源是什么？",
      options: ["Ondo 防挤兑的风控设计", "Reg S 分销合规期的法律要求——防止离岸发行立刻回流美国，被直接写进了代币合约", "以太坊网络拥堵", "担保代理人的操作时间"],
      answer: 1,
      explain: "这是“监管规则进代码”（阶段 7.3）的典型：锁定期是法律时限的链上执行。期满后自由转让，USDY 因此能进 DEX 和 DeFi。",
    },
    {
      q: "USDY 和 rUSDY 的关系是？",
      options: ["两只不同的基金", "同一张票据的两种渲染：USDY 单价上涨、余额不变；rUSDY 单价钉 $1、余额每天变多——收益相同，可互相转换", "rUSDY 是 USDY 加了杠杆的版本", "rUSDY 面向美国人"],
      answer: 1,
      explain: "阶段 6.4 的“同一经济、两种渲染”被 Ondo 做成了真实产品对——选哪个只是记账与集成习惯问题。",
    },
    {
      q: "为什么说 Ondo 本质上是一家“分销公司”？",
      options: ["因为它的投资能力最强", "因为底层收益是同质化商品（国债利息），它的护城河是牌照、合规机器与集成网络——把同一份收益制造成不同合规形状卖给被法律隔开的客群", "因为它不持有任何资产", "因为它只做市场营销"],
      answer: 1,
      explain: "买国债不需要天才；把国债收益合法地送到美国机构和全球非美用户两类人手里，才是稀缺能力。它把同一几何平移到股票（Global Markets）也印证了这一点。",
    },
  ],

  further: [
    { label: "Ondo Finance 官网（OUSG 与 USDY 产品页）", url: "https://ondo.finance" },
    { label: "Ondo 文档（结构、抵押与月度报告入口）", url: "https://docs.ondo.finance" },
    { label: "SEC：私募发行豁免总览（Reg D / Reg S 的官方入口）", url: "https://www.sec.gov/smallbusiness/exemptofferings" },
    { label: "RWA.xyz：代币化国债数据（对比 OUSG/USDY/BUIDL 规模）", url: "https://app.rwa.xyz/treasuries" },
  ],
};
