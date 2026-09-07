export default {
  id: "us-regulation",
  stage: 11,
  order: 1,
  title: "美国：Howey 测试、Reg D/S/A+ 与 ATS",
  difficulty: "mastery",
  prereqs: ["investor-eligibility", "stablecoin-regulation"],

  oneLiner:
    "美国管 RWA 的核心不是某部“加密法”，而是一个 1946 年的判例：Howey 测试——只看经济实质，不看技术形式。四个问题答完，一枚代币要么是证券（进 SEC 的合规菜单：注册、Reg D、Reg S、Reg A+），要么不是（去 CFTC 或 GENIUS 法案那边报到）。而 RWA 的成年礼恰恰是：大多数 RWA 代币**故意**做成证券——游戏不是躲 Howey，是高效地合规。",

  intuition: `
1946 年，佛罗里达州。一家叫 **W.J. Howey** 的公司想了个好主意：把自家的橙子园切成小块卖给游客——你买下几排橙子树，再顺手签一份“服务合同”，Howey 公司替你种、替你摘、替你卖，年底给你分利润。买家大多是外地来度假的酒店客人，一辈子没碰过锄头。

SEC 把 Howey 告上了法庭：这哪是卖地？这是**卖投资**——只是没有注册成证券。官司一路打到最高法院。Howey 的辩词很耳熟：“我们卖的是土地和服务合同，都是普通商业合同，不是证券。”换成今天的话就是：“我们卖的是代币，是软件，不是证券。”

最高法院的回答定义了之后八十年：**看经济实质，不看合同外衣**（substance over form）。你管它叫地契、叫橙子树、叫代币都行——只要买家掏钱、指望别人干活、自己等着分钱，它就是**投资合同**，就是证券，就归证券法管。这四个判断条件，后来被称为 **Howey 测试**，至今仍是美国监管加密资产的第一把尺子。

对读到阶段 11 的你，这一课的任务是把散落在前面的碎片拼成整图：阶段 4.4 讲过 GENIUS 稳定币法、阶段 7.2 讲过 Reg D/S 的买家资格、阶段 5.3 讲过登记法——现在我们站在**发行方和监管者**的视角，把美国这台机器完整看一遍。（例行提醒：本阶段是教育性梳理，不是法律意见——真要发币，请雇真律师。）

**这一节，我们拆成五块：**

- **① Howey 测试：四个问题，逐个资产过堂**
- **② 合规菜单：发行方视角的注册与豁免**
- **③ 交易与中介层：broker-dealer、ATS、过户代理与托管**
- **④ 从“执法式监管”到“规则式监管”：2017–2025 的弧线**
- **⑤ 州这一层：纽约、怀俄明、特拉华**
`,

  mechanics: `
### ① Howey 测试：四个问题，逐个资产过堂

**投资合同（investment contract）**——也就是证券的一种——的四个构成要件：**(1) 投入金钱**（investment of money）；**(2) 投入一个共同事业**（common enterprise，大家的钱混在一起、命运绑定）；**(3) 有获利预期**（expectation of profit）；**(4) 利润主要来自他人的努力**（from the efforts of others——有个干活的“发起人”）。四条**全部**满足才是证券，缺一条就不是。

<figure><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif"><defs><marker id="usreg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--orange-line)"/></marker></defs><rect x="20" y="95" width="110" height="52" rx="10" fill="var(--surface-2)" stroke="var(--line)"/><text x="75" y="117" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">任何交易</text><text x="75" y="134" font-size="10" fill="var(--muted)" text-anchor="middle">代币 / 地契 / 橙子树</text><g><rect x="160" y="20" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="38" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">① 投入金钱？</text><text x="235" y="54" font-size="9" fill="var(--muted)" text-anchor="middle">法币、加密货币都算</text><rect x="160" y="76" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="94" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">② 共同事业？</text><text x="235" y="110" font-size="9" fill="var(--muted)" text-anchor="middle">资金池 · 命运绑定</text><rect x="160" y="132" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="150" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">③ 获利预期？</text><text x="235" y="166" font-size="9" fill="var(--muted)" text-anchor="middle">买来是为了赚钱吗</text><rect x="160" y="188" width="150" height="44" rx="8" fill="var(--orange-soft)" stroke="var(--orange-line)"/><text x="235" y="206" font-size="11" fill="var(--orange-ink)" text-anchor="middle" font-weight="600">④ 靠他人努力？</text><text x="235" y="222" font-size="9" fill="var(--muted)" text-anchor="middle">有个干活的发起人</text></g><path d="M130 121 L156 121" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#usreg-arr)"/><path d="M310 126 L360 126" stroke="var(--orange-line)" stroke-width="1.5" marker-end="url(#usreg-arr)"/><rect x="364" y="40" width="250" height="72" rx="10" fill="var(--red-soft)" stroke="var(--line)"/><text x="489" y="64" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">四条全中 → 证券</text><text x="489" y="82" font-size="10" fill="var(--muted)" text-anchor="middle">SEC 管辖 · 注册或找豁免</text><text x="489" y="98" font-size="10" fill="var(--muted)" text-anchor="middle">（Reg D / Reg S / Reg A+ …）</text><rect x="364" y="132" width="250" height="72" rx="10" fill="var(--green-soft)" stroke="var(--line)"/><text x="489" y="156" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">缺任何一条 → 不是证券</text><text x="489" y="174" font-size="10" fill="var(--muted)" text-anchor="middle">商品 → CFTC · 支付稳定币 → GENIUS</text><text x="489" y="190" font-size="10" fill="var(--muted)" text-anchor="middle">（但可能落入其它法律）</text></svg><figcaption>Howey 测试：四道闸门，全过才是证券。看的是经济实质，不是合同名字。</figcaption></figure>

拿六个你已经认识的资产逐个过堂——这是本课 demo 要练的肌肉：

- **代币化基金份额（如 BUIDL，阶段 10.1）**：投钱 ✓；资金进同一个基金池 ✓；买它就是为了 4–5% 的国债收益 ✓；收益来自 BlackRock 团队管理 ✓。**四条全中，教科书级证券**——所以 BUIDL 从第一天就走 Reg D，只卖给合格购买者。
- **BTC**：投钱 ✓；但**没有共同事业、没有发起人**——没有一个“比特币公司”替你打工，网络是去中心化的。SEC 历任领导都承认 BTC 不是证券，它被当作**商品**（commodity），现货归 CFTC 的反欺诈管辖。
- **迷因币**：投钱 ✓；获利预期 ✓（不然买它干嘛）；但“共同事业”和“他人努力”**有争议**——如果没有团队在运营、纯靠社区起哄，第 4 条可能不成立。2025 年 SEC 工作人员声明倾向于认为多数迷因币不是证券——但发行时若有团队喊单画饼，分析立刻反转。诚实的答案是：**逐案分析，律师们真的会吵**。
- **USDC**：投钱 ✓；但**没有获利预期**——1 USDC 永远兑 1 美元，你买它是为了支付和避险，不是升值。第 3 条不成立 → 不是证券 → 这就是它落进**支付工具**范畴、由 GENIUS 法案（阶段 4.4）接管的法律逻辑。
- **PAXG（阶段 10.5）**：投钱 ✓；有获利预期（赌金价涨）✓；但利润来自**金价波动**，不是 Paxos 的经营努力——Paxos 只是保管金条。第 4 条大概率不成立 → 商品分析，像买金条本身。
- **收益型票据（如 USDY）**：注意，它不走 Howey——它自称 **note（票据）**，票据有自己的判例：**Reves v. Ernst & Young（1990）的“家族相似”测试**（family resemblance test），推定票据是证券，除非它长得像商业票据等豁免家族。USDY 的结论殊途同归：是证券，所以只按 Reg S 卖给非美国人（阶段 10.2）。这个脚注是真正的专家分水岭：**知道 Howey 不是唯一测试**。

**RWA 的点睛之笔**：2017 年 ICO 时代的游戏是“把代币包装得不像证券”（utility token 话术），结果尸横遍野。成熟 RWA 的游戏**完全相反**：BUIDL、OUSG、代币化私募信贷……它们**主动承认自己是证券**，然后在合规菜单里挑一条最高效的路。躲 Howey 是 2017 年的玩法；**高效合规**才是 2025 年的玩法。

### ② 合规菜单：发行方视角的注册与豁免

阶段 7.2 你站在买家角度学过“谁有资格买”；现在换到**发行方**的椅子上：确认是证券之后，你有五扇门——

- **全面注册（S-1）**：像 IPO 一样递交注册声明，之后**持续披露**（年报 10-K、季报 10-Q）。任何人都能买、能自由转让——但律师费、审计费、持续合规成本以百万美元计。Franklin Templeton 的 BENJI 走的就是注册基金路线（1940 年法案基金），所以散户能买。
- **Reg D 506(b)**：不注册、不公开宣传，卖给不限量的**合格投资者**（accredited：100 万美元净资产（不含自住房）或 20/30 万美元年收入）+ 至多 35 名老练非合格投资者。最常用的私募门。
- **Reg D 506(c)**：可以**公开宣传**，但必须**验证**（不是自我声明）每个买家都合格。RWA 平台爱用它，因为网站本身就是宣传。
- **Reg S**：只卖给**非美国人**，在美国境外发行。USDY 的门。常与 Reg D 并用：一个池子两条腿，美国合格投资者走 D、海外走 S。
- **Reg A+**：“迷你 IPO”，两档，最高 **7500 万美元**/12 个月，可卖散户，需 SEC 审核发行文件（Form 1-A）+ 持续半年报。听着美好，但审核要几个月、费用不低——地产类代币化项目试过，规模化的不多。**Reg CF**（众筹，≤500 万美元）更小众。

代价对照：豁免省了注册，但换来**转售锁定**（Rule 144：私募证券 12 个月锁定期——这就是为什么 RWA 二级市场难做，阶段 9.1）和**披露责任差异**（私募靠 PPM 私募备忘录，反欺诈条款仍然适用：可以少披露，不能说谎）。还有一根隐藏的绊线：**《交易法》12(g) 条**——持有人超过 **2,000 名**（或 500 名非合格投资者）且资产超 1000 万美元，就被迫成为公开报告公司。这就是阶段 6.1 说过的“为什么许可型代币要设持有人上限”的法律根源：\`canTransfer\` 里那个 holder cap，防的就是这根绊线。

### ③ 交易与中介层：broker-dealer、ATS、过户代理与托管

发出来只是开始，**在哪交易、谁来撮合**是另一套牌照：

- **Broker-dealer（经纪自营商）**：替人买卖证券要注册为 broker-dealer，受 FINRA 监管。数字资产证券的 broker-dealer 还有专门的托管指引（special purpose broker-dealer）。
- **ATS（Alternative Trading System，另类交易系统）**：证券代币的**持牌交易场所**。不是“交易所”（那是 NYSE 级别的注册），而是挂在 broker-dealer 牌照下的撮合系统。阶段 9.1 提过的 **Securitize Markets、tZERO、INX** 都是 ATS。流动性薄，但合法——这是证券代币二级市场目前的现实。
- **过户代理（transfer agent）**：维护股东名册的注册中介（阶段 3.4）。Securitize 的聪明之处（阶段 10.1）：**注册成过户代理**，然后主张“链上代币账本 = 我维护的官方名册”——把区块链塞进了现有法律框架的缝里。
- **托管**：谁能合法保管客户的数字资产证券？“合格托管人（qualified custodian）”的定义吵了多年。会计层面曾有个著名路障：**SAB 121**（2022）要求托管方把客户加密资产计入自家资产负债表——银行一算资本金要求，直接劝退。2025 年初 SAB 121 被**撤销**（SAB 122），银行做加密托管的大门重新打开——这是机构 RWA 基础设施 2025 年提速的安静推手之一。

### ④ 从“执法式监管”到“规则式监管”：2017–2025 的弧线

把八年压成一条时间线，看清方向感——

- **2017 · DAO Report**：SEC 发布调查报告：“DAO 代币是证券，**现有法律适用**，不需要新法。”这是对整个 ICO 时代的宣战书。
- **2018–2019 · ICO 执法潮**：数百个项目被罚、退款、关停。
- **2020 · Telegram/TON**：Telegram 向合格投资者私募 17 亿美元发 Gram 币，主张“交割时已不是证券”。法院不买账，项目被禁，钱退了——教训：**两步走结构骗不过经济实质分析**。
- **2023 · Ripple 分裂判决**：法院裁定 XRP **对机构的直接销售**是证券发行（买家指望 Ripple 努力），但**交易所上的程序化销售**不是（匿名买家不知道钱给了谁）。同一枚代币，不同销售场景，不同结论——把“代币本身是不是证券”这个问题拆成了“**这笔交易**是不是证券交易”。
- **2023 · Coinbase / Kraken 被诉**：SEC 起诉主流交易所“经营未注册证券交易所”——“执法式监管”（regulation by enforcement）的顶点：不写规则，靠案子画线。
- **2025 · 转向**：新一届 SEC 领导层上任，多数加密诉讼**撤销或和解**（含 Coinbase 案）；成立 **Crypto Task Force**（Hester Peirce 主持）系统性制定规则；官员公开讨论代币化的“**创新豁免**”；**GENIUS 法案**签署（阶段 4.4），给支付稳定币联邦框架；**CLARITY 类市场结构法案**在国会推进——核心是划清 SEC/CFTC 边界（证券 vs 商品现货）。方向：**从执法画线，转向规则立框**。

诚实的收尾：仍未解决的两块——**面向散户的代币化股票**（券商在试，SEC 态度未定，阶段 ∞.1）和 **DeFi 协议的法律地位**（没有发行方的市场怎么监管）。方向变了，地图还没画完。

### ⑤ 州这一层：一段话讲完

联邦之下还有 50 个州。三个记住就够：**纽约 NYDFS**——BitLicense + 信托牌照，Paxos 的 PAXG 和稳定币都靠纽约信托牌照背书（阶段 10.5），NYDFS 是事实上最严也最有公信力的州监管者；**怀俄明**——SPDI 特殊目的存款机构（Kraken 曾拿此牌照）、全美第一个 **DAO LLC** 法（给 DAO 一个有限责任外壳）；**特拉华**——2017 年修公司法允许**区块链股东名册**（阶段 5.3），美国一半以上大公司注册在此，这条修法给“代币=法定股份记录”开了门。州与联邦叠加：一个合规的 RWA 发行，往往同时踩着联邦豁免 + 州货币传输/信托规则走。

这一节你只要带走一句话：**美国用一个 1946 年的橙子园判例管住了 2025 年的代币——看经济实质、不看技术形式；而成熟 RWA 的标志，是不再躲这把尺子，而是拿着它挑一条最高效的合规路线。**
`,

  demo: "howey-test",

  analogy: `
把美国证券监管想成一座**机场安检系统**。Howey 测试是**第一道分流闸机**：四个感应器逐一扫过——投钱了吗？钱进共同池了吗？想赚钱吗？靠别人干活吗？四个灯全亮，你就被引到“证券航站楼”；有一个不亮，你走的是另一个航站楼（商品楼归 CFTC，支付楼归 GENIUS）。闸机不看你穿什么衣服（“我是 utility token！”）——它只扫你口袋里的经济实质。

进了证券航站楼，眼前是**五条安检通道**：全面注册是“国际出发”——查得最全、什么乘客都能带，但排队最长、费用最贵；Reg D 是“贵宾通道”——快，但只放合格投资者；Reg S 是“国际中转”——不进美国境内就行；Reg A+ 是“团队通道”——中等规模、中等审查。没有免检通道，只有不同的排队方式。

过了安检还没完：**登机口有登机口的规矩**。你不能在停机坪上随便找架飞机——证券代币只能停靠持牌的登机口（ATS），行李要交给持牌的行李系统（过户代理、托管人）。2017 年那批 ICO 就像一群人试图翻墙直接冲上跑道，结局你在阶段 10.6 见过了。

而 2017 到 2025 的变化，是机场管理方从“**抓到一个罚一个**”（执法式）转向“**把指示牌立清楚**”（规则式）。跑道没变、安检标准没变，变的是：现在你能提前知道哪条队怎么排了。
`,

  misconceptions: [
    "“代币是软件，不是证券。” —— Howey 看的是经济实质，不是载体。橙子树、地契、代币都可以是“投资合同”。1946 年 Howey 公司说“我们卖的是土地和服务合同”，最高法院的回答八十年没变：看你卖的经济关系，不看你给它起的名字。",
    "“所有加密代币都是证券（或都不是）。” —— 逐个分析。BTC 缺共同事业和发起人（不是证券）；USDC 缺获利预期（不是证券，是支付工具）；BUIDL 四条全中（是证券）；PAXG 利润来自金价而非经营努力（商品分析）。一刀切的两个方向都是错的。",
    "“RWA 项目的目标是设计得‘不像证券’以躲开 SEC。” —— 恰恰相反。成熟 RWA 项目主动承认自己是证券，然后用 Reg D/S 高效合规。躲 Howey 是 2017 年 ICO 的玩法，坟场在阶段 10.6；2025 年的玩法是拿着菜单点菜。",
    "“走了 Reg D 豁免就万事大吉、永远不用理 SEC。” —— 豁免只免注册，不免反欺诈责任（说谎照样被告），还带着 Rule 144 的 12 个月转售锁定和 12(g) 的 2,000 持有人绊线——超线就被迫变成公开报告公司。豁免是“换一组约束”，不是“没有约束”。",
    "“Ripple 案判了 XRP 不是证券。” —— 判决比这精细得多：对机构的直接销售**是**证券发行，交易所上的程序化销售**不是**。它把问题从“代币是什么”改写成“这笔交易是什么”——同一枚代币在不同场景下答案不同。",
    "“2025 年监管转向 = 美国不管了。” —— 是从“执法画线”转向“规则立框”：GENIUS 立了稳定币框架、市场结构法案在划 SEC/CFTC 边界、托管会计路障（SAB 121）被拆。规则更清晰通常意味着管得更系统，而不是不管。",
  ],

  quiz: [
    {
      q: "Howey 测试判断“投资合同”的四个要件是？",
      options: [
        "用了区块链、发了代币、有白皮书、公开销售",
        "投入金钱、共同事业、获利预期、利润主要来自他人努力",
        "注册公司、请律师、做审计、找托管",
        "价格波动、有二级市场、有做市商、有交易所上市",
      ],
      answer: 1,
      explain: "四条全中才是证券；技术形式（用不用链、叫不叫代币）完全不在测试里——看的是经济实质。",
    },
    {
      q: "USDC 通常不被当作证券，最关键卡在哪一条？",
      options: [
        "没有投入金钱",
        "没有共同事业",
        "没有获利预期——1 USDC 永远兑 1 美元，买它是为了支付不是升值",
        "Circle 不是美国公司",
      ],
      answer: 2,
      explain: "稳定币不升值、不派息（合规稳定币也被禁止付息），第 3 条不成立 → 落入支付工具范畴，归 GENIUS 法案（阶段 4.4）。",
    },
    {
      q: "发行方选择 Reg D 506(c) 而不是 506(b)，主要换来了什么？",
      options: [
        "可以卖给任何散户",
        "可以公开宣传（网站、广告），代价是必须实质验证每个买家都是合格投资者",
        "不再受反欺诈条款约束",
        "代币可以立刻自由转让",
      ],
      answer: 1,
      explain: "506(b) 禁止公开劝诱、允许买家自我声明；506(c) 反过来：能公开宣传，但要验证。转售锁定（Rule 144）两者都躲不掉。",
    },
    {
      q: "《交易法》12(g) 条的“2,000 持有人绊线”解释了 RWA 代币设计里的哪个特征？",
      options: [
        "为什么代币要用预言机喂价",
        "为什么许可型代币的合规合约里要设持有人数量上限（holder cap）",
        "为什么代币要每天派息",
        "为什么代币要多链部署",
      ],
      answer: 1,
      explain: "持有人超 2,000（或 500 名非合格投资者）+ 资产超线 → 被迫成为公开报告公司。ERC-3643 式合规模块里的 holder cap（阶段 6.1）就是防这根绊线的代码化。",
    },
    {
      q: "Ripple（2023）判决的精细之处在于？",
      options: [
        "宣布所有加密代币都不是证券",
        "同一枚代币：对机构的直接销售构成证券发行，交易所程序化销售不构成——把问题从“代币是什么”变成“这笔交易是什么”",
        "宣布 XRP 是商品，归 CFTC",
        "判 SEC 无权监管加密资产",
      ],
      answer: 1,
      explain: "机构买家明知钱给了 Ripple、指望其努力（Howey 第 4 条成立）；交易所匿名买家不知道对手方——同一资产、不同交易场景、不同结论。",
    },
    {
      q: "2025 年美国监管环境的“转向”，最准确的概括是？",
      options: [
        "SEC 解散，加密彻底不受监管",
        "从“执法式监管”转向“规则式监管”：撤诉/和解、Crypto Task Force 立规则、GENIUS 立稳定币法、市场结构法案划 SEC/CFTC 边界",
        "所有代币被宣布为证券",
        "监管权全部移交各州",
      ],
      answer: 1,
      explain: "方向是把“靠案子画线”换成“靠框架立规”；仍未解决的包括散户代币化股票和 DeFi 的地位——地图还没画完。",
    },
  ],

  further: [
    { label: "SEC v. W.J. Howey Co.（1946）判决原文", url: "https://supreme.justia.com/cases/federal/us/328/293/" },
    { label: "SEC：数字资产“投资合同”分析框架（2019）", url: "https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets" },
    { label: "SEC：DAO 调查报告（2017，“现有法律适用”的源头）", url: "https://www.sec.gov/litigation/investreport/34-81207.pdf" },
    { label: "SEC Crypto Task Force（2025 年转向的官方入口）", url: "https://www.sec.gov/about/crypto-task-force" },
    { label: "Investor.gov：合格投资者（accredited investor）定义", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/accredited-investors" },
  ],
};
