export default {
  id: "erc4626-vaults",
  stage: 6,
  order: 4,
  title: "ERC-4626 金库：把“会生息的份额”标准化",
  difficulty: "systems",
  prereqs: ["erc20-tokens", "funds-nav"],

  oneLiner:
    "ERC-4626 把“基金”这门生意压缩成了六个函数：存入资产换份额、赎回份额换资产、随时可查“一份值多少”。份额价格 = totalAssets ÷ totalShares——你在阶段 3.3 学的 NAV 公式，原封不动变成了合约接口。因为所有金库长得一模一样，任何 DeFi 协议都能对一个陌生金库即插即用——标准化即分销。RWA 用它装代币化国债时，再加两样东西：一道准入门（合规检查）和一条 NAV 喂价（预言机）。但记住：标准≠安全，第一存款人通胀攻击就是教科书级的反例。",

  intuition: `
阶段 6 前三课解决的都是同一个问题：“**谁可以持有**”。这一课换一个问题：“**份额怎么生息、怎么计价**”——这是 RWA 世界第二重要的标准的领地。

回想阶段 3.3：一只基金的全部会计，浓缩成一个除法——**每份净值（NAV per share）= （总资产 − 总负债）÷ 总份额**。申购按它买入，赎回按它退出，每天算一次。现在问一个工程师式的问题：如果把这个除法做成智能合约接口，最少需要几个函数？

答案是六个左右，而且以太坊社区已经把它们标准化了：**ERC-4626，代币化金库标准（Tokenized Vault Standard）**。“金库（vault）”这个词听起来很 DeFi，但你把它翻译回传统金融的语言，会发现毫无新意——**装着一池资产、按比例发份额的容器**，这就是基金。ERC-4626 的份额本身就是一个 ERC-20 代币（阶段 2.4 的老朋友），所以钱包能显示、DEX 能交易、借贷协议能抵押。

为什么这对 RWA 至关重要？因为代币化国债基金（阶段 10.1 的 BUIDL、OUSG 们）本质上全是“会生息的份额”。谁来标准化“生息份额”的接口，谁就定义了 RWA 与整个 DeFi 乐高的接口面。这一课看懂 ERC-4626，阶段 9.3“RWA 进入 DeFi”你会觉得顺理成章。

**这一节，我们拆成五块：**

- **① 六个函数装下一只基金：接口速览**
- **② 份额数学：为什么中途进场的人不占任何人便宜**
- **③ 两种生息姿势：累积型 vs 重定基型**
- **④ 标准化的战略意义：可组合性就是分销渠道**
- **⑤ 标准 ≠ 安全：通胀攻击，与 RWA 金库的两件加装**
`,

  mechanics: `
### ① 六个函数装下一只基金：接口速览

ERC-4626 金库合约围绕两种东西转：**资产（asset）**——池子里装的底层 ERC-20（比如 USDC）；**份额（share）**——金库自己发行的 ERC-20，代表你对池子的比例索取权。核心接口：

- \`deposit(assets, receiver)\`：存入资产，按当前价格铸给你份额。
- \`withdraw(assets, receiver, owner)\` / \`redeem(shares, receiver, owner)\`：一对镜像——前者“我要取回多少资产”，后者“我要销毁多少份额”，都是烧份额、退资产。
- \`convertToShares(assets)\` / \`convertToAssets(shares)\`：**汇率查询器**，随时回答“这么多资产值多少份额”（反之亦然）。
- \`totalAssets()\`：池子里资产总值——整个合约最关键的一个数（见 ⑤）。

**份额价格 = totalAssets() ÷ totalSupply()**。认出来了吗？这就是 NAV per share，只是从基金管理人的 Excel 搬进了合约的只读函数。任何人、任何合约，任意时刻调用 \`convertToAssets(1e18)\`，都能拿到“一份值多少”的实时答案——**基金会计从每天下午 4 点的一份 PDF，变成了 7×24 的一个视图函数**。

### ② 份额数学：为什么中途进场的人不占任何人便宜

标准最精妙的保证藏在铸造公式里：**新份额 = 存入资产 × 总份额 ÷ 总资产**——永远按**当前**价格铸造。走一个完整例子：

- **第 1 天**：Alice 存 1,000 USDC。金库是空的，按 1:1 铸 1,000 份。totalAssets=1,000，totalShares=1,000，份额价格 $1.00。
- **半年后**：池子里的国债生了 24 USDC 利息（约 4.8% 年化的一半）。totalAssets=1,024，totalShares 仍是 1,000，份额价格涨到 **$1.024**。
- **此刻 Bob 进场**，存 1,024 USDC。按当前价格：铸 1,024 ÷ 1.024 = **1,000 份**（不是 1,024 份！）。现在 totalAssets=2,048，totalShares=2,000，价格仍 $1.024。
- **验算**：Alice 的 1,000 份值 1,024 USDC——她半年的利息一分没被稀释；Bob 的 1,000 份值他刚存的 1,024 USDC——他也没白拿别人半年的收益。

这就是 \`convertToShares\` 存在的全部意义：**任何时刻进出，都按“此刻的 NAV”结算，先来者的收益与后来者的本金互不侵犯**。传统基金靠“每日申赎按当日 NAV”实现同样的公平——ERC-4626 把它变成了每个区块都成立的数学不变量。

### ③ 两种生息姿势：累积型 vs 重定基型

同样的收益，可以用两种完全不同的“显示方式”交给持有人——这是新手最容易混淆、也最值得掰清楚的一对概念：

- **累积型（accumulating / accruing）**：你的**份额数量不变，份额价格上涨**。上面 Alice 的例子就是：永远 1,000 份，价格从 $1.00 爬到 $1.024。Ondo 的 **OUSG** 是这个风格。特点：钱包里数字不动（心理上“看不到利息”），转账/记账简单，税务上通常按**资本利得**处理（卖出时才实现）。
- **重定基型（rebasing）**：**份额价格钉在 ~$1，你的余额自己长**。今天 1,000 枚，明天早上打开钱包变成 1,000.13 枚。stETH（Lido 的质押凭证）、Ondo 的 **USDY 的 rUSDY 形态**走这条路。特点：体验像“银行账户天天付息”，直观；但对接麻烦——很多 DeFi 协议假设“余额不会自己变”，rebasing 代币塞进去会算错账。

**两者经济上完全等价**——同样的池子、同样的收益、同样的比例索取权，只是“价格动”还是“数量动”的渲染差异。所以生态里出现了**包装器（wrapper）**互相转换：wstETH 把重定基的 stETH 包成累积型（数量固定、价格上涨），专供不兼容 rebasing 的协议使用。看懂这对姿势，你在阶段 10.2 对比 OUSG/USDY 时会轻松很多。

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="v4626-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="16" y="16" width="296" height="264" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="164" y="42" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">累积型（OUSG 风格）</text>
  <text x="164" y="62" text-anchor="middle" font-size="10" fill="var(--muted)">份额数不变，价格上涨</text>
  <line x1="48" y1="240" x2="288" y2="240" stroke="var(--line)" stroke-width="1.2"/>
  <line x1="48" y1="240" x2="48" y2="80" stroke="var(--line)" stroke-width="1.2"/>
  <path d="M 48 200 L 128 186 L 208 170 L 288 152" fill="none" stroke="var(--orange-ink)" stroke-width="2.2" marker-end="url(#v4626-arr)"/>
  <text x="220" y="140" font-size="10" fill="var(--orange-ink)">价格 $1.00 → $1.048</text>
  <path d="M 48 120 L 288 120" fill="none" stroke="var(--green)" stroke-width="2.2" stroke-dasharray="6 4"/>
  <text x="220" y="108" font-size="10" fill="var(--green)">余额恒为 1,000 份</text>
  <text x="164" y="268" text-anchor="middle" font-size="9" fill="var(--muted)">税务常按资本利得 · DeFi 对接友好</text>
  <rect x="328" y="16" width="296" height="264" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="476" y="42" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">重定基型（stETH / rUSDY 风格）</text>
  <text x="476" y="62" text-anchor="middle" font-size="10" fill="var(--muted)">价格钉住 ~$1，余额自己长</text>
  <line x1="360" y1="240" x2="600" y2="240" stroke="var(--line)" stroke-width="1.2"/>
  <line x1="360" y1="240" x2="360" y2="80" stroke="var(--line)" stroke-width="1.2"/>
  <path d="M 360 200 L 440 186 L 520 170 L 600 152" fill="none" stroke="var(--green)" stroke-width="2.2" marker-end="url(#v4626-arr)"/>
  <text x="524" y="140" font-size="10" fill="var(--green)">余额 1,000 → 1,048 份</text>
  <path d="M 360 120 L 600 120" fill="none" stroke="var(--orange-ink)" stroke-width="2.2" stroke-dasharray="6 4"/>
  <text x="524" y="108" font-size="10" fill="var(--orange-ink)">价格恒 ≈ $1.00</text>
  <text x="476" y="268" text-anchor="middle" font-size="9" fill="var(--muted)">体验像日息账户 · 部分协议不兼容</text>
</svg>
<figcaption>同一份收益的两种渲染：动价格，或动数量。经济等价，接口与税务不等价。</figcaption>
</figure>

### ④ 标准化的战略意义：可组合性就是分销渠道

在 ERC-4626 之前，每个收益协议的金库接口各写各的：这家叫 \`stake\`，那家叫 \`supply\`，赎回有的叫 \`unstake\` 有的叫 \`exit\`，份额计价方式五花八门。想把 10 个金库接进一个聚合器？写 10 套适配器，audit 10 次。ERC-4626（2022 年定稿）之后：**写一次 4626 适配器，接入所有金库**。

对 RWA 这意味着什么？一只代币化国债金库如果实现了 4626，那么在借贷市场眼里，它和任何 DeFi 原生金库**长得一模一样**：可以直接被报价（\`convertToAssets\`）、被抵押、被打包进策略。**上架一个标准接口 = 同时接入了整个 DeFi 的货架**——标准化不是技术洁癖，是分销策略。这正是阶段 9.3 “RWA 作为 DeFi 抵押品”的技术前提。

当然，RWA 金库不能是完全开放的 4626——阶段 6 前三课的合规要求依然在。所以现实里是**带准入门的 4626**：\`deposit\`/\`withdraw\` 加上身份检查（只有 verified 地址能进出），或者外面套一层许可包装、里面留一个标准核心。合规是门，接口是货架。

### ⑤ 标准 ≠ 安全：通胀攻击，与 RWA 金库的两件加装

一段必须严肃讲的风控课。ERC-4626 有一个教科书级的坑：**第一存款人通胀攻击（inflation / donation attack）**。剧本：攻击者抢先给空金库存入 1 wei，拿到 1 份——此刻“1 份 = 1 wei”。然后他**直接向金库地址转账**（不走 deposit）10,000 USDC“捐赠”，把 totalAssets 硬拉到 10,000e6 wei 而 totalShares 仍是 1——份额价格被通胀到天文数字。受害者此时存入 5,000 USDC：按公式铸 5,000e6 × 1 ÷ 10,000e6 = 0.5 份，**向下取整 = 0 份**。钱进了池子，份额一无所得，池子里的一切归攻击者那 1 份所有。

防御已经成熟：**虚拟份额/虚拟资产**（计算时给分子分母各加一个虚拟量，OpenZeppelin 实现内置）、或部署时由发行方**烧掉一笔死份额**垫底。寓意要记牢：**“实现了标准”只说明接口长对了，说明不了实现是安全的**——这也是阶段 12.2 强调“读审计报告”的原因之一。

最后一件加装，把本课与全课程串起来：对纯 DeFi 金库，\`totalAssets()\` 数的是链上真金白银；对 RWA 金库，池子里躺着的是**链下的国债**，合约自己看不见。所以 \`totalAssets()\` 的数字必须由**预言机喂进来的 NAV**（基金管理人计算、oracle 上报，阶段 8.2 的整课主题）。金库是基金会计与代币机制的**交汇点**——上游是阶段 3.3 的 NAV 流水线，下游是阶段 9 的流动性乐高。

这一节你只要带走一句话：**4626 把“基金会计”压缩成六个函数；RWA 金库 = 这六个函数 + 一道准入门 + 一条 NAV 喂价。**
`,

  demo: "vault-shares",

  analogy: `
把 ERC-4626 金库想成一家**合伙经营的面包店**。

面包店的全部家当（面粉、烤箱、账上的现金）是 totalAssets；**合伙股份**是 shares。你想入伙？不是拍脑袋谈价，而是按**此刻的每股净值**——家当总值除以总股数——出资认购（deposit）。想退伙？按同一个数退钱（redeem）。店赚了钱、家当变多，每股就更值钱——**先来的合伙人不怕后来者摊薄，后来者也不用给先来的白送钱**，因为每一次入伙退伙都按当时的净值结算。

“累积型 vs 重定基型”就是**两种记账习惯**：一种是股数永远不变、每股越来越值钱（你有 10 股，从每股 100 元涨到 104.8 元）；另一种是每股永远记作 100 元，但**账本自动给你补股数**（10 股变成 10.48 股）。分红是同一笔，只是写在账本的不同栏里。

为什么全城的面包店要用**同一张股权合同模板**（标准化）？因为银行看得懂。你拿着模板化的股权证明去贷款，银行不用逐店研究章程——见过一份等于见过所有份。**模板即流动性**。但也别忘了：合同模板再标准，也拦不住某家店把账做烂——入伙之前，账本（审计）还是要翻的。
`,

  misconceptions: [
    "“金库（vault）是 DeFi 发明的新物种。” —— 剥掉术语，它就是“资产池 + 按比例份额”，即基金（阶段 3.3）。ERC-4626 只是把基金会计做成了标准合约接口，份额价格 = totalAssets ÷ totalShares 就是 NAV per share。",
    "“重定基型代币余额会自己变多，说明它收益更高。” —— 累积型与重定基型经济上完全等价：同样的池子、同样的收益，一个动价格、一个动数量。差别只在 UX、税务处理和协议兼容性——wstETH 这类包装器能在两种形态间转换，收益不变。",
    "“中途申购的人分走了老持有人已经攒下的收益。” —— 不会。铸造公式按当前份额价格计算：新人的钱按“此刻 NAV”换成份额，老人的浮盈已经反映在价格里。这正是 convertToShares 的存在意义。",
    "“实现了 ERC-4626 标准，说明这个金库是安全的。” —— 标准只规定接口，不保证实现。第一存款人通胀攻击就发生在完全“符合标准”的实现上，要靠虚拟份额/死份额等防御。标准≠审计——读阶段 12.2。",
    "“RWA 金库的 totalAssets 是合约自己算出来的。” —— 纯 DeFi 金库可以数链上资产；RWA 金库的底层是链下国债，合约看不见，totalAssets 依赖预言机喂入的 NAV（阶段 8.2）。喂价错，全盘错——这是 RWA 金库特有的信任链条。",
  ],

  quiz: [
    {
      q: "ERC-4626 金库的份额价格等于？",
      options: [
        "发行方设定的固定价",
        "totalAssets() ÷ totalSupply()——即链上版的 NAV per share",
        "最近一笔二级市场成交价",
        "存入时的历史成本价",
      ],
      answer: 1,
      explain: "份额价格就是总资产除以总份额——阶段 3.3 的 NAV 公式原样搬进合约，任何人可随时用 convertToAssets 查询。",
    },
    {
      q: "金库现有 totalAssets=1,024、totalShares=1,000。Bob 存入 1,024 USDC，会铸得多少份额？",
      options: [
        "1,024 份，按 1:1",
        "1,000 份——1,024 ÷ 当前价格 1.024",
        "512 份",
        "由发行方人工决定",
      ],
      answer: 1,
      explain: "新份额 = 存入资产 × 总份额 ÷ 总资产 = 1,024 × 1,000 ÷ 1,024 = 1,000 份。按当前 NAV 铸造，老持有人的浮盈不被稀释。",
    },
    {
      q: "累积型与重定基型份额的本质关系是？",
      options: [
        "重定基型收益更高",
        "经济上等价：同一收益，一个涨价格、一个涨数量；差别在 UX、税务与协议兼容性",
        "累积型不支持赎回",
        "两者底层资产必须不同",
      ],
      answer: 1,
      explain: "同一个池子的同一笔收益，只是“渲染方式”不同；wstETH 式包装器可互相转换。混淆两者会在对接协议和报税时踩坑。",
    },
    {
      q: "第一存款人通胀攻击的核心手法是？",
      options: [
        "暴力破解金库私钥",
        "先存 1 wei 拿 1 份，再绕过 deposit 直接“捐赠”大额资产拉高份额价格，让后续存款人因向下取整铸得 0 份",
        "贿赂预言机压低 NAV",
        "反复快速申购赎回赚差价",
      ],
      answer: 1,
      explain: "捐赠使 totalAssets 暴涨而份额只有攻击者的 1 份，价格被通胀后受害者的存款取整归零。防御：虚拟份额/死份额——标准合规的实现也需要这些加固。",
    },
    {
      q: "RWA 金库的 totalAssets() 数字从哪里来？",
      options: [
        "合约遍历链上资产自动求和",
        "由底层国债的托管银行直接写入",
        "来自预言机喂入的基金 NAV——链下管理人计算、oracle 上报（阶段 8.2）",
        "取二级市场代币价格乘以流通量",
      ],
      answer: 2,
      explain: "底层资产在链下，合约自己看不见；totalAssets 依赖 NAV 喂价。金库因此成为“基金会计遇上代币机制”的交汇点，也多出一条必须尽调的信任链。",
    },
  ],

  further: [
    { label: "EIP-4626：代币化金库标准原文", url: "https://eips.ethereum.org/EIPS/eip-4626" },
    { label: "ethereum.org：ERC-4626 开发者指南", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-4626/" },
    { label: "OpenZeppelin：ERC-4626 实现与通胀攻击缓解", url: "https://docs.openzeppelin.com/contracts/5.x/erc4626" },
    { label: "ERC-4626 Alliance：生态与金库列表", url: "https://erc4626.info/" },
    { label: "Lido：wstETH 与重定基/累积包装说明", url: "https://help.lido.fi/en/articles/5231836-what-is-wrapped-steth-wsteth" },
  ],
};
