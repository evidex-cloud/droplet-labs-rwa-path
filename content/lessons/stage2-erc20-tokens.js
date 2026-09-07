export default {
  id: "erc20-tokens",
  stage: 2,
  order: 4,
  title: "ERC-20：同质化代币——一张“地址→余额”表",
  difficulty: "core",
  prereqs: ["smart-contracts"],

  oneLiner:
    "一枚 ERC-20 代币不是什么神秘的“数字硬币”——它就是一个智能合约，肚子里装着一张“地址→余额”表，外加六个标准函数。所谓“转账”，只是合约把表里一行的数字减掉、另一行加上，没有任何东西在“移动”。而正因为所有代币都遵守同一份接口标准，任何钱包、交易所、协议都能对一个素未谋面的新代币即插即用——这就是 RWA 拼命想继承的互操作性超能力。",

  intuition: `
打开你的钱包 App，里面躺着 100 USDC。停下来想一个问题：这 100 USDC **到底存在哪里**？

不在你的手机里——把手机砸了，币还在。也不在你的“地址”里——地址只是一串号码，不是保险箱。答案有点反直觉：**这 100 USDC 只是某一个智能合约内部、一张巨型表格里的一行记录**——“你的地址 → 100”。全世界几百万 USDC 持有者，全部挤在**同一个合约**的同一张表里，每人一行。你“持有”代币，意思仅仅是：那张表里有你这一行，而且只有你的私钥能让合约改动它（阶段 2.2 讲过为什么）。

这张表 + 围着它的六个标准函数，就是 **ERC-20**——以太坊上最成功的一份标准，稳定币（阶段 4）、代币化国债基金（阶段 10.1）、几乎所有 RWA 的份额代币，底层全是它。把它彻底拆开看明白，后面十个阶段你都不会再被“代币”这个词唬住。

**这一节，我们拆成五块：**

- **① 一个合约、一张表、六个函数——ERC-20 的全部**
- **② “转账”的真相：没有任何东西在移动**
- **③ 标准的超能力：为什么六个函数值一个万亿市场**
- **④ approve / transferFrom：把“扣款权”授权出去**
- **⑤ mint 与 burn：不在标准里，却是 RWA 的业务本身**
`,

  mechanics: `
### ① 一个合约、一张表、六个函数：ERC-20 的全部

上一节（阶段 2.3）说过，智能合约 = 代码 + 状态。一个 ERC-20 代币合约的**状态**，核心就两样：

- 一张映射表：\`mapping(address => uint256) balances\` ——“哪个地址，有多少枚”；
- 一个总数：\`totalSupply\` ——所有行加起来等于它，一枚不多一枚不少。

**代码**部分，标准只要求六个函数、两个事件：

- \`totalSupply()\` ——查总发行量；
- \`balanceOf(address)\` ——查某地址那一行的数字；
- \`transfer(to, amount)\` ——把自己的余额划一部分给别人；
- \`approve(spender, amount)\` ——授权某个地址日后替你划走至多 amount（见 ④）；
- \`allowance(owner, spender)\` ——查询这份授权还剩多少额度；
- \`transferFrom(from, to, amount)\` ——被授权者凭额度替 from 划账（见 ④）；
- 事件 \`Transfer(from, to, amount)\` 和 \`Approval(owner, spender, amount)\` ——每次划账/授权都对外广播一条日志，钱包和区块浏览器就是靠读这些事件给你画出“交易记录”的。

就这么多。**没有第七个必选函数了。**另外有个小细节值得记住：\`decimals\`（小数位）。链上余额都是整数，靠 decimals 决定小数点挪几位——多数代币用 18 位，**USDC 用 6 位**，所以表里存的“100000000”其实是 100 USDC。RWA 项目对接时搞错 decimals，是真实发生过的事故来源。

<figure>
<svg viewBox="0 0 640 290" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="erc20-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="16" y="70" width="150" height="90" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="91" y="96" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="600">Alice 的钱包</text>
  <text x="91" y="116" text-anchor="middle" font-size="10" fill="var(--muted)">只有私钥，</text>
  <text x="91" y="131" text-anchor="middle" font-size="10" fill="var(--muted)">没有存任何代币</text>
  <line x1="166" y1="112" x2="248" y2="112" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#erc20-arr)"/>
  <text x="207" y="98" text-anchor="middle" font-size="10" fill="var(--orange-ink)">transfer(Bob, 100)</text>
  <text x="207" y="128" text-anchor="middle" font-size="9" fill="var(--muted)">（用私钥签名）</text>
  <rect x="252" y="20" width="372" height="240" rx="12" fill="var(--orange-soft)" stroke="var(--orange-line)" stroke-width="1.5"/>
  <text x="438" y="44" text-anchor="middle" font-size="12" fill="var(--orange-ink)" font-weight="700">USDC 合约（一个地址、一段代码、一张表）</text>
  <rect x="276" y="58" width="200" height="128" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="376" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">balances 表（地址 → 余额）</text>
  <text x="292" y="100" font-size="11" fill="var(--ink)">0xAlice…</text>
  <text x="460" y="100" text-anchor="end" font-size="11" fill="var(--red)">300 → 200</text>
  <text x="292" y="122" font-size="11" fill="var(--ink)">0xBob…</text>
  <text x="460" y="122" text-anchor="end" font-size="11" fill="var(--green)">200 → 300</text>
  <text x="292" y="144" font-size="11" fill="var(--ink)">0xCarol…</text>
  <text x="460" y="144" text-anchor="end" font-size="11" fill="var(--ink)">500</text>
  <text x="292" y="172" font-size="10" fill="var(--muted)">totalSupply = 1000（不变）</text>
  <rect x="492" y="58" width="116" height="128" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="550" y="78" text-anchor="middle" font-size="10" fill="var(--muted)">六个函数</text>
  <text x="502" y="98" font-size="9" fill="var(--ink)">balanceOf</text>
  <text x="502" y="113" font-size="9" fill="var(--orange-ink)" font-weight="600">transfer</text>
  <text x="502" y="128" font-size="9" fill="var(--ink)">approve</text>
  <text x="502" y="143" font-size="9" fill="var(--ink)">allowance</text>
  <text x="502" y="158" font-size="9" fill="var(--ink)">transferFrom</text>
  <text x="502" y="173" font-size="9" fill="var(--ink)">totalSupply</text>
  <rect x="276" y="200" width="332" height="42" rx="8" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="442" y="218" text-anchor="middle" font-size="10" fill="var(--ink)">📢 事件日志：Transfer(Alice, Bob, 100)</text>
  <text x="442" y="233" text-anchor="middle" font-size="9" fill="var(--muted)">钱包与浏览器读这里，画出你看到的“交易记录”</text>
</svg>
<figcaption>“转账”全程发生在合约内部：一行减、一行加、广播一条事件。Alice 的钱包里自始至终只有私钥。</figcaption>
</figure>

### ② “转账”的真相：没有任何东西在移动

\`transfer(to, amount)\` 的内部逻辑，翻译成大白话只有四行：

- 检查：调用者那一行的余额 ≥ amount，否则整笔交易**回滚（revert）**，就当没发生过；
- 调用者那一行：减去 amount；
- 收款人那一行：加上 amount；
- 广播事件 \`Transfer(调用者, to, amount)\`。

注意**没有发生的事**：没有文件被发送，没有“数字硬币”从 A 飞到 B，你的钱包和对方的钱包之间没有任何通信。变化的只是那张表里的两个数字。这就是为什么把代币转给一个写错的地址无法撤销——不是“包裹寄丢了”，而是**账本已经把那一行记给了别人**，而没人有那个地址的私钥（阶段 2.1 讲过账本为什么改不回来）。

这也顺便解释了“**同质化（fungible）**”这个词：表里只记“多少枚”，不记“哪几枚”。你的 100 USDC 和我的 100 USDC 毫无区别，就像你银行账户里的 100 元和我的 100 元——**单位之间完全可互换**。美元是同质化的，房契不是：每张房契对应一栋特定的房子，换一张就是另一处房产。“每一件都独一无二”的资产需要另一套标准（ERC-721，下一节阶段 2.5 专讲）。

### ③ 标准的超能力：为什么六个函数值一个万亿市场

ERC-20 于 2015 年由 Fabian Vogelsteller 和 Vitalik Buterin 提出（EIP-20）。它规定的只是**接口**——函数叫什么名、收什么参数、抛什么事件——不管你内部怎么实现。就这么一份薄薄的约定，产生了一个化学反应级的后果：

- **钱包**（MetaMask 等）不需要认识你的代币：只要它是 ERC-20，调 \`balanceOf\` 就能显示余额，调 \`transfer\` 就能发起转账；
- **交易所和 DeFi 协议**同理：Uniswap 能为任意两个 ERC-20 开交易池，借贷协议能把任意 ERC-20 记为抵押品——**事先不需要任何商务对接**；
- 今天部署一个新代币，**全世界的基础设施当场兼容它**。

对比一下传统金融：一只新基金想进一家券商的 App，要谈接入、签协议、对接口，按月计。而 BlackRock 的 BUIDL、Circle 的 USDC 本质都是 ERC-20——发行当天，链上所有工具天然支持。**这就是 RWA 圈反复念叨的“互操作性/可组合性”，它不是玄学，就是“大家用同一份接口”**。截至 2025 年，以太坊上的 ERC-20 合约以百万计，稳定币一项的规模就在 2500 亿美元级——全部长在这六个函数上。

### ④ approve / transferFrom：把“扣款权”授权出去

六个函数里最费解、也最重要的是这一对。场景：你想在去中心化交易所用 100 USDC 换 ETH。交易所是个**合约**，它需要在成交的一瞬间“收走”你的 USDC——但 \`transfer\` 只能由你本人调用，合约没法替你转。怎么办？分两步：

- **第一步 \`approve(交易所合约, 100)\`**：你在 USDC 合约里登记一条授权——“允许这个地址日后从我这里划走至多 100”。这条记录存在 \`allowance\` 表里（所以 ERC-20 其实是**两张表**：余额表 + 授权表）；
- **第二步**：交易所合约执行成交时调用 \`transferFrom(你, 它自己, 100)\`。USDC 合约检查两件事——你的余额够不够、给它的授权额度够不够——都够，就划账并把 allowance 减掉 100。

这套“**先授权、后代扣**”就是 DeFi 可组合性的接线方式：借贷、做市、申购赎回，机器与机器之间的每一次“收款”都走它。RWA 也一样——你申购一只链上基金，第一笔交易几乎总是 approve。

⚠ 顺带一句安全常识：**授权钓鱼**是加密世界最高发的盗窃手法之一——骗子诱导你对一个恶意合约签下无上限 approve，然后慢慢把你划空。看到“approve 无限额度”要当心，闲置授权可以用 revoke.cash 这类工具定期清理。

### ⑤ mint 与 burn：不在标准里，却是 RWA 的业务本身

标准的六个函数里没有“发行”和“销毁”——但现实中几乎每个代币都有，通常写作 \`mint(to, amount)\`（totalSupply 与 to 的余额同时加上 amount，事件记作从零地址转出）和 \`burn(from, amount)\`（反向）。当然，这两个函数必须设权限（阶段 2.3 讲过 \`onlyOwner\`）——谁都能 mint 的代币一文不值。

在投机币的世界里，mint/burn 只是发行方的后台操作。**在 RWA 里，它们就是业务流程本身**（回想阶段 1.1 那枚代币的一生）：

- **mint = 申购**：你给 Circle 汇 100 万美元，Circle 在链上 mint 100 万 USDC 给你——链下进来 1 美元，链上多 1 枚，锚定就是这么维持的；
- **burn = 赎回**：你把 100 万 USDC 还给 Circle，它 burn 掉这些代币、给你汇回美元。代币化国债基金一模一样：申购铸份额、赎回烧份额，\`totalSupply\` 始终镜像着链下资产的规模（阶段 1.2 的“镜像原则”，谁来核实这面镜子——阶段 8.3 储备证明）。

最后，把镜头拉远，看清一件后面整整一个阶段都在处理的事：**基础版 \`transfer\` 只检查一件事——余额够不够**。它不问你是谁、在哪个国家、有没有资格、份额锁没锁定。对一枚游戏币这是优点；对一只受证券法管辖的基金份额，这是**致命缺陷**。先把这个念头存好——阶段 6.1 我们正面处理它。

这一节你只要带走一句话：**ERC-20 = 一个合约里的一张“地址→余额”表 + 六个标准函数；“转账”只是改表，而“标准”让全世界的钱包和协议即插即用——RWA 想要这份超能力，但还得给 transfer 加上“谁有资格”的检查。**
`,

  demo: "erc20-table",

  analogy: `
把 ERC-20 想成一所大学的**饭卡系统**。全校几万张饭卡，卡里其实**什么都没存**——余额全记在后勤中心那台服务器的一张表里：“学号 → 余额”。你在食堂刷卡，动的不是卡，是表：你那一行减 15，食堂那一行加 15。这就是 \`transfer\`——卡（私钥）只是让服务器确认“是本人”的凭证。

“同质化”也一目了然：表里只记你有多少钱，不记“哪几张钞票”。你卡里的 100 元和同学卡里的 100 元完全等价、随意互换——不像宿舍钥匙，每一把只开一扇门（那是下一节 NFT 的世界）。

\`approve\` 呢？就是**代扣授权**。你签一张单子：“允许图书馆每年从我饭卡里最多扣 200 元逾期费”。图书馆日后自己来划（\`transferFrom\`），后勤服务器核对两样：你余额够不够、授权额度剩多少。你从没把卡交给图书馆——只是登记了一条“它可以来扣”的记录。

而“标准”的威力在于：**全国高校约好用同一套饭卡接口**。任何新食堂、新书店、新自助机，装上读卡器当天就能收全校的卡——不用逐个谈判。mint 和 burn 则是充值窗口：你交 100 元现金，表里给你加 100（mint）；退卡时表里清零、退你现金（burn）。窗口收多少现金、表上加多少数字——这面“镜子”是否诚实，正是 RWA 全部信任问题的缩影。
`,

  misconceptions: [
    "“代币存在我的钱包 App 里，像照片存在手机里一样。” —— 不对。钱包里只有私钥。所有余额都记在代币合约内部的那张表里，钱包只是替你去合约查表（balanceOf）并替你签名改表（transfer）。手机丢了，表还在链上。",
    "“转账就是把代币‘发送’到对方地址。” —— 没有东西被发送。合约把表里你那一行减掉、对方那一行加上，再广播一条 Transfer 事件，仅此而已。也因此转错地址无法追回——不是快递丢件，而是账本已经改写。",
    "“ERC-20 是以太坊官方发行的某种代币。” —— ERC-20 是一份接口标准（EIP-20），不是代币本身。任何人都能照着它部署自己的代币——门槛低到几分钟搞定，所以“是 ERC-20”完全不代表“有价值”或“合规”。",
    "“approve 只是让对方‘看到’我的余额，没什么风险。” —— approve 授予的是划走你代币的权力（配合 transferFrom）。对恶意合约签下无上限授权，等于把卡交给了骗子。授权钓鱼是最高发的盗币手法之一，闲置授权应定期撤销。",
    "“mint/burn 是 ERC-20 标准的一部分，所有代币的总量都是固定的。” —— 都不对。标准只定义了六个函数，mint/burn 是各项目自己加的，且几乎人人都加。在 RWA 里它们就是申购与赎回本身；关键要看 mint 权限在谁手里、有没有制衡。",
    "“基础版 ERC-20 已经足够承载股票、基金这类证券。” —— 不够。裸 transfer 只检查余额，不问身份、资格、法域、锁定期——证券法要求的它一样都做不到。这正是许可型标准（ERC-3643 等，阶段 6）存在的理由。",
  ],

  quiz: [
    {
      q: "你钱包里的 100 USDC，本质上存在哪里？",
      options: ["加密后存在你的手机里", "分散存在你的地址对应的链上“保险箱”里", "记在 USDC 那个智能合约内部的“地址→余额”表里，你的地址对应一行", "存在 Circle 公司的银行账户里"],
      answer: 2,
      explain: "全体持有者共用同一个合约里的同一张表，每人一行。钱包只存私钥；银行账户里的是储备金，不是代币本身。",
    },
    {
      q: "调用 transfer(Bob, 100) 时，链上实际发生了什么？",
      options: ["100 枚代币被打包发送到 Bob 的钱包", "合约把你那一行减 100、Bob 那一行加 100，并广播一条 Transfer 事件", "你和 Bob 的钱包直接建立了一次加密通信", "矿工把 100 枚代币从你的地址搬运到 Bob 的地址"],
      answer: 1,
      explain: "转账 = 改表 + 发事件。没有任何东西在“移动”，两个钱包之间也没有通信。",
    },
    {
      q: "为什么说 ERC-20“标准”本身是一种超能力？",
      options: ["因为它让代币价格更稳定", "因为统一接口让任何钱包、交易所、协议无需事先对接就能支持任何新代币——即插即用的互操作性", "因为它由以太坊基金会审核，保证了代币质量", "因为它规定了代币的最大发行量"],
      answer: 1,
      explain: "标准只约定接口，不背书质量。它的价值在于：新代币部署当天，全世界的基础设施天然兼容——这正是 RWA 想继承的分发能力。",
    },
    {
      q: "approve + transferFrom 这对函数的作用是？",
      options: ["把代币冻结起来防盗", "让你授权某个地址（通常是合约）日后在额度内替你划走代币——DeFi 和 RWA 申购的标准收款方式", "把代币兑换成以太币", "向发行方申请增发"],
      answer: 1,
      explain: "先 approve 登记额度，对方再 transferFrom 代扣，合约同时检查余额与 allowance。这也是授权钓鱼盯上的机制。",
    },
    {
      q: "在 RWA 语境下，mint 和 burn 分别对应什么业务动作？",
      options: ["挖矿和销毁手续费", "mint = 申购（链下资金进来、链上铸出份额），burn = 赎回（份额销毁、链下资金退出）", "空投和回购", "抵押和清算"],
      answer: 1,
      explain: "mint/burn 不在标准里，却是 RWA 的核心业务：totalSupply 应始终镜像链下资产规模——镜子是否诚实，靠阶段 8 的储备证明去核验。",
    },
    {
      q: "基础版 ERC-20 的 transfer 在放行前检查什么？",
      options: ["余额是否足够、持有人是否通过 KYC、是否在锁定期", "只检查一件事：调用者余额是否 ≥ 转账金额", "收款方是否是合格投资者", "发行方是否批准了这笔转账"],
      answer: 1,
      explain: "只查余额——不问身份、资格、法域、锁定期。这对证券是致命缺陷，也是阶段 6 许可型代币标准全部工作的起点。",
    },
  ],

  further: [
    { label: "EIP-20：ERC-20 标准原文（六个函数与两个事件的官方定义）", url: "https://eips.ethereum.org/EIPS/eip-20" },
    { label: "ethereum.org：ERC-20 代币标准入门", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-20/" },
    { label: "OpenZeppelin ERC20 文档（业界最常用的实现）", url: "https://docs.openzeppelin.com/contracts/5.x/erc20" },
    { label: "Revoke.cash：查看并撤销你签过的代币授权", url: "https://revoke.cash" },
  ],
};
