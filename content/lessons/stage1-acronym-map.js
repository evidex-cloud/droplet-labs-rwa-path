export default {
  id: "acronym-map",
  stage: 1,
  order: 4,
  title: "名词地图：一次见全所有缩写",
  difficulty: "intro",
  prereqs: [],

  oneLiner:
    "这一课不教新知识，只发一张地图：把整个 RWA 世界的四十多个缩写按六条“地铁线”排好——资产与金融、结构与法律、链与标准、合规、数据、监管——每个词给一句话定义，再标注它在本课程哪一站细讲。你不需要背任何东西：每个词都会在它自己的阶段与你正式见面。缩写焦虑的解药不是记忆力，而是知道每个词都有个家、有条线、有一站会讲透它。",

  intuition: `
每个刚进 RWA 世界的人都经历过同一种窒息：随手打开一篇行业文章，一段话里迎面砸来 SPV、Reg D、NAV、KYC、ERC-3643、PoR、ATS——每个词都不认识，每个词好像都很重要，查了这个忘了那个，查到第五个已经忘了文章讲什么。**这种感觉有个名字：缩写焦虑。**它劝退的人，比任何技术难点都多。

这一课就是为杀死它而设的，方法论很朴素：**恐惧来自没有地图**。四十多个缩写散落在你面前是一团乱麻；但它们其实天然属于六个家族——就像一座城市几百个地铁站听起来吓人，画成六条颜色分明的线路图就一目了然。你不需要记住每一站，你只需要知道：**红线是资产金融、蓝线是法律结构、绿线是链上标准**……下次在文章里撞见一个缩写，你不再恐慌，而是淡定地想：“哦，合规线的，阶段 7 会讲。”

明确三个使用规则。第一，**别背**——每个词都会在自己的阶段与你正式见面，到时候有完整的课、例子和演示；现在只求混个脸熟。第二，**回来查**——这一页是你的常驻工具页，以后任何阶段撞见忘了的词，回这里扫一眼。第三，**用下面的演示玩**——按线路筛选、搜索、翻卡，五分钟把六条线走一遍，比读十遍列表都管用。

**这一节，我们拆成 6 块（六条线）：**

- **① 资产与金融线：钱本身的语言**
- **② 结构与法律线：代币背后那摞纸**
- **③ 链与标准线：代码世界的零件号**
- **④ 合规线：闸门上的字母**
- **⑤ 数据线：把事实搬上链的行话**
- **⑥ 监管线：发牌照的人与他们的法律**
`,

  mechanics: `
### ① 资产与金融线：钱本身的语言

这条线的词来自传统金融的日常，阶段 3 是它们的主场。RWA 说到底是金融产品，这十个词是入场券：

- **RWA**（Real-World Asset，真实世界资产）—— 把现实资产的权利做成链上代币的统称 → 阶段 0.1
- **T-Bill**（Treasury Bill，美国短期国库券）—— 一年期以内、贴现发行的美国政府债，RWA 的头号底层资产 → 阶段 3.2
- **MMF**（Money Market Fund，货币市场基金）—— 买短债管现金的基金，代币化国债基金的传统原型 → 阶段 3.3
- **NAV**（Net Asset Value，净值）——（资产 − 负债）÷ 份额数，基金每天算一次的“每份值多少钱” → 阶段 3.3
- **AUM**（Assets Under Management，管理规模）—— 一只基金或机构管着多少钱，衡量体量的通用尺子 → 阶段 3.3
- **bp**（basis point，基点）—— 万分之一，即 0.01%；“管理费 15bp”= 0.15% → 阶段 3.2
- **DvP**（Delivery versus Payment，券款对付）—— 一手交钱、一手交券，同时成交不留敞口；链上的原子结算是它的完美形态 → 阶段 3.4
- **T+1** —— 成交后 1 个工作日完成交收；美股 2024 年 5 月起从 T+2 缩到 T+1 → 阶段 3.4
- **LP**（Limited Partner，有限合伙人）—— 私募基金里出钱不管事的投资人 → 阶段 3.5
- **PE**（Private Equity，私募股权）—— 不上市公司的股权投资，典型的低流动性资产 → 阶段 3.5

### ② 结构与法律线：代币背后那摞纸

这条线决定“你的代币在法律上是什么”，阶段 5、7、11 轮流坐庄。RWA 项目文件里出现频率最高的就是它们：

- **SPV**（Special Purpose Vehicle，特殊目的实体）—— 只为持有一件资产而生的“壳公司”，破产隔离的防火墙 → 阶段 5.2
- **PPM**（Private Placement Memorandum，私募发行备忘录）—— 私募发行的“说明书”，风险与条款全在里面 → 阶段 12.2
- **Reg D** —— 美国证券私募豁免：不注册也能卖，但一般只能卖给合格投资者 → 阶段 7.2
- **Reg S** —— 离岸发行豁免：只卖给非美国人士就可豁免注册 → 阶段 7.2
- **Reg A+** —— “迷你 IPO”豁免，每年最多募 7,500 万美元，可向公众发售 → 阶段 11.1
- **AI**（Accredited Investor，合格投资者）—— 美国门槛：净资产 100 万美元（不含自住房）或年收入 20 万/30 万美元 → 阶段 7.2
- **QP**（Qualified Purchaser，合格购买者）—— 更高一档：可投资资产 500 万美元以上，BUIDL 这类基金的门槛 → 阶段 7.2
- **ATS**（Alternative Trading System，另类交易系统）—— 持牌撮合证券买卖的“小交易所”，证券代币二级市场的合法场地 → 阶段 11.1
- **TA**（Transfer Agent，过户代理）—— 维护股东名册的持牌机构；链上代币能否直接当名册，是个法律问题 → 阶段 3.4
- **Rule 144** —— 私募证券转售规则：一般锁定 12 个月才能转卖 → 阶段 11.1
- **Howey** —— 豪威测试：投钱 + 共同事业 + 盈利预期 + 依赖他人努力 = 证券，SEC 的判定标尺 → 阶段 11.1

### ③ 链与标准线：代码世界的零件号

这条线是工程师的领地，阶段 2 打地基、阶段 6 讲专用标准。“ERC”开头的都是以太坊代币标准的编号：

- **ERC-20** —— 同质化代币标准，本质一张“地址 → 余额”表；转账只查余额，装不下证券规则 → 阶段 2.4
- **ERC-721** —— NFT 标准，每枚代币独一无二，适合“整栋楼”这类不可分资产的凭证 → 阶段 2.5
- **ERC-3643** —— 许可型代币标准（绰号 T-REX）：每笔转账先查身份注册表，合规内建 → 阶段 6.2
- **ERC-4626** —— 代币化金库标准：把“存入资产、拿到生息份额”做成统一接口 → 阶段 6.4
- **EOA**（Externally Owned Account，外部账户）—— 由私钥直接控制的普通链上账户，与合约账户相对 → 阶段 2.2
- **Gas** —— 链上执行的燃料费：每笔操作按计算量付费 → 阶段 2.6
- **L1 / L2** —— 主链（以太坊等）与搭在其上的扩容层；RWA 发行方选址的核心考量 → 阶段 2.6

### ④ 合规线：闸门上的字母

这条线全部在阶段 7 讲透。记住它们的共同使命：确认“你是谁、你的钱干不干净、你有没有资格”：

- **KYC**（Know Your Customer，了解你的客户）—— 开户前核实身份：护照、地址、资金来源 → 阶段 7.1
- **AML**（Anti-Money Laundering，反洗钱）—— 一整套防止脏钱洗白的制度与监测 → 阶段 7.1
- **CFT**（Countering the Financing of Terrorism，反恐融资）—— AML 的孪生兄弟，盯资金流向 → 阶段 7.1
- **OFAC** —— 美国财政部海外资产控制办公室：维护制裁名单（SDN），碰了就是重罪 → 阶段 7.1
- **FATF**（Financial Action Task Force，金融行动特别工作组）—— 全球反洗钱标准的制定者 → 阶段 7.1
- **PEP**（Politically Exposed Person，政治敏感人物）—— 政要及其亲属，需强化尽调的客户类别 → 阶段 7.1
- **SAR**（Suspicious Activity Report，可疑活动报告）—— 金融机构发现可疑交易时必须提交的报告 → 阶段 7.1
- **Travel Rule** —— “旅行规则”：转账时发送方与接收方信息必须随款同行，FATF 推向全球 → 阶段 7.1

### ⑤ 数据线：把事实搬上链的行话

最短的一条线，但撑着整面镜子的同步（阶段 1.2 的桥），阶段 8 全面展开：

- **Oracle**（预言机）—— 把链下事实签名后写进链上合约的管道；邮差，不是侦探 → 阶段 8.1
- **PoR**（Proof of Reserve，储备证明）—— 把“钱还在”做成链上可机读的定期信号 → 阶段 8.3
- **Heartbeat**（心跳）—— 喂价的最长更新间隔：就算价格没动，到点也必须更新一次 → 阶段 8.2
- **Deviation**（偏差阈值）—— 价格偏离超过设定百分比就立刻触发更新，与心跳配合 → 阶段 8.2

### ⑥ 监管线：发牌照的人与他们的法律

这条线一半是机构名、一半是法规名，阶段 11 带你环球一圈：

- **SEC**（美国证券交易委员会）—— 管证券的美国监管者，RWA 绕不开的裁判 → 阶段 11.1
- **CFTC**（美国商品期货交易委员会）—— 管商品与衍生品；“证券还是商品”之争的另一方 → 阶段 11.1
- **MiCA**（欧盟加密资产市场法规）—— 欧盟统一加密监管框架，2024 年 12 月全面适用 → 阶段 11.2
- **ESMA**（欧洲证券与市场管理局）—— 欧盟层面的证券监管协调者 → 阶段 11.2
- **MAS**（新加坡金融管理局）—— 央行 + 金融监管一体，Project Guardian 的操盘手 → 阶段 11.3
- **SFC**（香港证监会）—— 香港证券市场监管者，代币化产品规则的先行者之一 → 阶段 11.3
- **GENIUS Act** —— 美国联邦支付稳定币法，2025 年 7 月签署，稳定币首部联邦大法 → 阶段 4.4
- **eWpG**（德国电子证券法）—— 允许证券以纯电子（含区块链）形式登记的德国法律 → 阶段 5.3
- **DLT Pilot**（欧盟 DLT 试点制度）—— 2023 年 3 月起让持牌机构在放宽规则下试验链上交易结算 → 阶段 11.2

<figure><svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><text x="320" y="22" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">RWA 名词地铁图 · 六条线</text><line x1="120" y1="60" x2="620" y2="60" stroke="var(--orange-line)" stroke-width="3"/><text x="20" y="64" font-size="11" fill="var(--orange-ink)" font-weight="700">① 资产金融</text><text x="150" y="50" font-size="9" fill="var(--muted)">T-Bill</text><text x="230" y="50" font-size="9" fill="var(--muted)">NAV</text><text x="310" y="50" font-size="9" fill="var(--muted)">MMF</text><text x="390" y="50" font-size="9" fill="var(--muted)">DvP</text><text x="470" y="50" font-size="9" fill="var(--muted)">T+1</text><text x="550" y="50" font-size="9" fill="var(--muted)">bp</text><line x1="120" y1="108" x2="620" y2="108" stroke="var(--line)" stroke-width="3"/><text x="20" y="112" font-size="11" fill="var(--ink)" font-weight="700">② 结构法律</text><text x="150" y="98" font-size="9" fill="var(--muted)">SPV</text><text x="230" y="98" font-size="9" fill="var(--muted)">Reg D/S</text><text x="310" y="98" font-size="9" fill="var(--muted)">PPM</text><text x="390" y="98" font-size="9" fill="var(--muted)">ATS</text><text x="470" y="98" font-size="9" fill="var(--muted)">Howey</text><text x="550" y="98" font-size="9" fill="var(--muted)">QP</text><line x1="120" y1="156" x2="620" y2="156" stroke="var(--orange-line)" stroke-width="3"/><text x="20" y="160" font-size="11" fill="var(--orange-ink)" font-weight="700">③ 链与标准</text><text x="150" y="146" font-size="9" fill="var(--muted)">ERC-20</text><text x="230" y="146" font-size="9" fill="var(--muted)">ERC-3643</text><text x="320" y="146" font-size="9" fill="var(--muted)">ERC-4626</text><text x="410" y="146" font-size="9" fill="var(--muted)">Gas</text><text x="470" y="146" font-size="9" fill="var(--muted)">L1/L2</text><text x="550" y="146" font-size="9" fill="var(--muted)">EOA</text><line x1="120" y1="204" x2="620" y2="204" stroke="var(--line)" stroke-width="3"/><text x="20" y="208" font-size="11" fill="var(--ink)" font-weight="700">④ 合规</text><text x="150" y="194" font-size="9" fill="var(--muted)">KYC</text><text x="220" y="194" font-size="9" fill="var(--muted)">AML</text><text x="290" y="194" font-size="9" fill="var(--muted)">OFAC</text><text x="370" y="194" font-size="9" fill="var(--muted)">FATF</text><text x="450" y="194" font-size="9" fill="var(--muted)">PEP</text><text x="520" y="194" font-size="9" fill="var(--muted)">Travel Rule</text><line x1="120" y1="252" x2="620" y2="252" stroke="var(--orange-line)" stroke-width="3"/><text x="20" y="256" font-size="11" fill="var(--orange-ink)" font-weight="700">⑤ 数据</text><text x="180" y="242" font-size="9" fill="var(--muted)">Oracle</text><text x="300" y="242" font-size="9" fill="var(--muted)">PoR</text><text x="420" y="242" font-size="9" fill="var(--muted)">Heartbeat</text><text x="540" y="242" font-size="9" fill="var(--muted)">Deviation</text><line x1="120" y1="300" x2="620" y2="300" stroke="var(--line)" stroke-width="3"/><text x="20" y="304" font-size="11" fill="var(--ink)" font-weight="700">⑥ 监管</text><text x="150" y="290" font-size="9" fill="var(--muted)">SEC</text><text x="220" y="290" font-size="9" fill="var(--muted)">MiCA</text><text x="300" y="290" font-size="9" fill="var(--muted)">MAS</text><text x="370" y="290" font-size="9" fill="var(--muted)">SFC</text><text x="440" y="290" font-size="9" fill="var(--muted)">GENIUS</text><text x="530" y="290" font-size="9" fill="var(--muted)">DLT Pilot</text></svg></figure>

这一节你只要带走一句话：**你不需要背这张地图——你只需要在下次撞见缩写时想起“它有条线、有一站会讲透它”，然后回到这里查一眼。**
`,

  demo: "acronym-map",

  analogy: `
学一个新领域的名词，和搬到一座陌生城市一模一样。刚落地那几天最难受：满街的地名——什么门、什么桥、什么庄——每个都听人提起过，每个都不知道在哪，打车都不知道怎么和司机说。这时候有人塞给你一张**地铁线路图**，世界瞬间安静了：几百个站名还是不认识，但它们**各就各位了**——红线沿江、蓝线穿城、绿线去机场。

注意你此刻并没有“记住”任何一站。地图的魔力不在记忆，在**框架**：下次有人说“在国贸见”，你不认识国贸，但你会查地图、看到它在一号线上、心里就有底了。**恐慌感来自“无处安放”，不来自“数量太多”。**

更妙的是，住上一年你会发现：常去的站自然就熟了——公司在那站、朋友住这站，根本不用背。生僻的站一辈子没去过，也毫无影响。名词也一样：NAV、KYC 这些高频词，学到阶段 3、阶段 7 时天天见面，想忘都难；eWpG 这种冷僻词，等真要研究德国发行时再回来查，一点不耽误。

所以对这张名词地图的正确态度，就是对地铁图的态度：**钉在墙上，常回来看，绝不逼自己背**。等你学完全部课程回头再看这一页，会有个奇妙的时刻——每个缩写你都能讲出一段故事。那时这张图就不再是地图，而是你的旅行相册。
`,

  misconceptions: [
    "“学 RWA 得先把这些缩写全背下来。” —— 恰恰相反。这一页是地图不是考纲：每个词会在自己的阶段与你正式见面，带着完整的课与演示。现在只需混个脸熟，忘了随时回来查。",
    "“缩写这么多，说明这个领域故弄玄虚。” —— 这些词几乎都不是加密行业发明的：NAV、SPV、KYC、DvP 在传统金融里用了几十年。RWA 站在两个成熟行业（金融 + 区块链）的交汇处，继承了两边的词汇表——词多恰恰说明它根基深。",
    "“Reg D、Reg S、Reg A+ 差不多，都是发行豁免。” —— 三者面向完全不同：Reg D 卖给美国合格投资者、Reg S 只卖给非美人士、Reg A+ 可向公众募集但限额 7,500 万美元。选错一个，整个发行就是违法的——这正是阶段 7.2 与 11.1 要细讲的（对比 Ondo 同一资产按 Reg D 和 Reg S 包装出两只产品）。",
    "“AI 就是人工智能。” —— 在 RWA 文件里，AI 几乎总是 Accredited Investor（合格投资者）。同一缩写在不同行业指不同的东西，遇到时先看它在哪条线上——这正是分线地图的用处。",
    "“ERC-20、ERC-3643 这些编号有内在含义，得研究编号规律。” —— 编号只是以太坊改进提案（EIP）的流水号，先来后到而已，没有任何密码。ERC-3643 不比 ERC-20 “高级 3623 号”，它们只是不同用途的标准。",
  ],

  quiz: [
    {
      q: "NAV 是什么、在哪条线上？",
      options: ["合规线：一种身份核查流程", "资产与金融线：（资产 − 负债）÷ 份额数，基金每份的净值", "链与标准线：一个代币标准编号", "监管线：一家欧洲监管机构"],
      answer: 1,
      explain: "NAV = Net Asset Value，基金每天算一次的“每份值多少钱”，阶段 3.3 细讲、阶段 8.2 讲怎么喂上链。",
    },
    {
      q: "一份 RWA 发行文件写着“仅限 QP，依据 Reg D 506(c) 发行”。翻译成人话是？",
      options: ["任何人都能买，无限额", "只卖给合格购买者（可投资产 500 万美元以上），走美国私募豁免", "只在欧盟发行", "只能用比特币支付"],
      answer: 1,
      explain: "QP = Qualified Purchaser（比合格投资者门槛更高），Reg D = 美国私募豁免。BlackRock BUIDL 用的正是这类结构（阶段 7.2、10.1）。",
    },
    {
      q: "KYC 与 AML 的关系是？",
      options: ["同一件事的两种叫法", "KYC 核实“你是谁”，AML 是防脏钱洗白的整套制度——KYC 是 AML 体系的第一道闸", "KYC 管机构、AML 管个人", "KYC 是欧盟规则、AML 是美国规则"],
      answer: 1,
      explain: "先知道客户是谁（KYC），才谈得上监测资金干不干净（AML）。两者都在阶段 7.1 展开。",
    },
    {
      q: "ERC-20 和 ERC-3643 的本质区别是？",
      options: ["3643 的编号更大所以更先进", "ERC-20 转账只查余额；ERC-3643 每笔转账先查身份注册表与合规规则——证券需要后者", "ERC-20 只能在测试网用", "两者没有区别"],
      answer: 1,
      explain: "裸 ERC-20 装不下“谁有资格持有”的规则，这正是阶段 6.1 的主题；ERC-3643 把合规内建进转账（阶段 6.2）。",
    },
    {
      q: "对这张名词地图的正确用法是？",
      options: ["全部背熟再开始学后面的课", "当常驻工具页：现在混个脸熟，以后撞见忘了的词随时回来查——每个词都会在自己的阶段被讲透", "只记监管线，其他不重要", "打印出来考试用"],
      answer: 1,
      explain: "恐慌来自“无处安放”而非“数量太多”。有了线路框架，高频词会自然熟，冷僻词用时再查。",
    },
  ],

  further: [
    { label: "SEC Investor.gov 术语表（官方口径的金融名词定义）", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary" },
    { label: "FATF 官网：反洗钱建议（合规线词汇的源头）", url: "https://www.fatf-gafi.org/en/topics/fatf-recommendations.html" },
    { label: "ESMA：MiCA 专页（欧盟监管线一站看全）", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" },
    { label: "ERC-3643 官网（许可型代币标准的家）", url: "https://www.erc3643.org" },
    { label: "EIP-4626 原文（代币化金库标准）", url: "https://eips.ethereum.org/EIPS/eip-4626" },
  ],
};
