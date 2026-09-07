export default {
  id: "erc3643",
  stage: 6,
  order: 2,
  title: "ERC-3643（T-REX）：自带“准入名单”的许可型代币",
  difficulty: "systems",
  prereqs: ["why-not-erc20"],

  oneLiner:
    "ERC-3643（社区名 T-REX）是上一课那份需求清单的完整答卷：它不是一个合约，而是五个合约的合唱——代币本体保持 ERC-20 兼容，身份注册表认人，可信签发者注册表定“谁的担保算数”，声明主题注册表定“必须担保什么”，合规合约装着可热插拔的规则模块。每一笔 transfer 都要先过“你是谁”和“规则允许吗”两道安检，全部通过才划账，否则回滚并报出原因。它在 2023 年成为正式 ERC，是机构代币化采用最广的公开标准。",

  intuition: `
上一课结束时，你手里有一份从事故废墟里提炼的需求清单：认人、查资格、锁时间、数人头、可冻结、可恢复、可审计。现在的问题是工程问题：**这些东西怎么装进一个代币合约，还不把它变成一坨没人敢碰的面条代码？**

直觉的做法是把所有检查硬编码进 \`transfer\`：一长串 if，写死 KYC 白名单、写死国家列表、写死锁定期。三个月后法律变了（这在证券世界是常态），你就得升级整个代币合约——每一次升级都是一次手术，而病人是几亿美元的资产。

ERC-3643 的答案优雅得多：**拆**。把“你是谁”和“规则允许吗”拆成两套独立的合约体系，代币本体只负责在转账时**问它们**。身份体系认人——而且认的是“人”不是“地址”，一个人换了钱包身份还在；规则体系装的是**可插拔的模块**——法律变了，换个模块，代币本体一行代码不动。这套架构有个响亮的社区名字：**T-REX**（Token for Regulated EXchanges）。

理解了它，你就理解了整个受监管代币世界的骨架——后面讲的链上身份（阶段 6.3）、转账限制（阶段 7.3）、管控开关（阶段 6.5），全是这具骨架上的器官。

**这一节，我们拆成五块：**

- **① 五个合约的合唱：T-REX 架构总览**
- **② 一笔 transfer 的完整旅程：逐行走安检**
- **③ 发行方的权力面板：强转、冻结、恢复**
- **④ 两个优雅设计：身份可复用，规则可热插拔**
- **⑤ 生态与对比：T-REX、DS 协议与朴素白名单**
`,

  mechanics: `
### ① 五个合约的合唱：T-REX 架构总览

一套 ERC-3643 部署下来是**五个互相协作的合约**，各管一摊：

- **① Token（代币本体）**：保持 **ERC-20 接口兼容**——\`balanceOf\`、\`transfer\`、事件一个不少，所以普通钱包能显示它、交易界面能操作它。区别只在 \`transfer\` 内部：划账前要先问下面几位。
- **② Identity Registry（身份注册表）**：一张“**地址 → 身份合约 + 国家代码**”的映射。注意映射的对象是 **ONCHAINID 身份合约**（一个投资者一个，阶段 6.3 专讲），不是裸地址——所以“认的是人，不是钱包”。国家代码（ISO 3166 数字码，如 840=美国、702=新加坡）存在这里，供国别规则使用。
- **③ Trusted Issuers Registry（可信签发者注册表）**：定义“**谁的担保算数**”——哪些 KYC 机构、审计方签出的声明（claim）这只代币认。A 基金可以只认 KYCPro，B 基金可以认 KYCPro 和 VerifyCo。
- **④ Claim Topics Registry（声明主题注册表）**：定义“**必须担保什么**”——这只代币要求哪些主题的声明：KYC 通过、合格投资者、国籍核验……主题只是编号，含义由发行方定义。
- **⑤ Compliance（合规合约）**：装着一组**规则模块**，每个模块管一条独立规则：国家黑/白名单、最大持有人数、单人持仓上限、锁定期、每日转账量上限……模块可增可删可换（见 ④）。

<figure>
<svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <defs><marker id="e3643-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--orange-ink)"/></marker></defs>
  <rect x="200" y="16" width="240" height="66" rx="12" fill="var(--orange-soft)" stroke="var(--orange-line)" stroke-width="1.5"/>
  <text x="320" y="42" text-anchor="middle" font-size="13" fill="var(--orange-ink)" font-weight="700">① Token（ERC-20 兼容）</text>
  <text x="320" y="62" text-anchor="middle" font-size="10" fill="var(--muted)">transfer() 划账前先问两边</text>
  <rect x="16" y="130" width="290" height="88" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="161" y="154" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">② Identity Registry</text>
  <text x="161" y="174" text-anchor="middle" font-size="10" fill="var(--muted)">地址 → 身份合约 + 国家码</text>
  <text x="161" y="192" text-anchor="middle" font-size="10" fill="var(--muted)">isVerified(to)？</text>
  <rect x="16" y="238" width="140" height="76" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="86" y="262" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="600">③ 可信签发者</text>
  <text x="86" y="280" text-anchor="middle" font-size="9" fill="var(--muted)">谁的担保算数</text>
  <text x="86" y="296" text-anchor="middle" font-size="9" fill="var(--muted)">（KYC 机构名单）</text>
  <rect x="168" y="238" width="140" height="76" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="238" y="262" text-anchor="middle" font-size="10" fill="var(--ink)" font-weight="600">④ 声明主题</text>
  <text x="238" y="280" text-anchor="middle" font-size="9" fill="var(--muted)">必须担保什么</text>
  <text x="238" y="296" text-anchor="middle" font-size="9" fill="var(--muted)">（KYC / 资格 / 国籍）</text>
  <rect x="348" y="130" width="276" height="184" rx="12" fill="var(--green-soft)" stroke="var(--line)"/>
  <text x="486" y="154" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">⑤ Compliance（合规合约）</text>
  <text x="486" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">canTransfer(from, to, amount)？</text>
  <rect x="366" y="184" width="240" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="486" y="200" text-anchor="middle" font-size="9" fill="var(--ink)">模块：国家黑/白名单</text>
  <rect x="366" y="214" width="240" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="486" y="230" text-anchor="middle" font-size="9" fill="var(--ink)">模块：最大持有人数 / 单人上限</text>
  <rect x="366" y="244" width="240" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="486" y="260" text-anchor="middle" font-size="9" fill="var(--ink)">模块：锁定期 / 每日量上限</text>
  <text x="486" y="296" text-anchor="middle" font-size="9" fill="var(--orange-ink)">模块可增删换——法律变，换模块</text>
  <line x1="252" y1="82" x2="185" y2="126" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#e3643-arr)"/>
  <text x="180" y="106" text-anchor="middle" font-size="9" fill="var(--orange-ink)">“他是谁？”</text>
  <line x1="388" y1="82" x2="460" y2="126" stroke="var(--orange-ink)" stroke-width="1.6" marker-end="url(#e3643-arr)"/>
  <text x="466" y="106" text-anchor="middle" font-size="9" fill="var(--orange-ink)">“规则允许吗？”</text>
  <line x1="86" y1="238" x2="120" y2="222" stroke="var(--line)" stroke-width="1.4" marker-end="url(#e3643-arr)"/>
  <line x1="238" y1="238" x2="205" y2="222" stroke="var(--line)" stroke-width="1.4" marker-end="url(#e3643-arr)"/>
</svg>
<figcaption>五合约合唱：代币本体只问问题；认人交给身份体系，规则交给合规模块。</figcaption>
</figure>

### ② 一笔 transfer 的完整旅程：逐行走安检

把 \`transfer(to, amount)\` 的内部逻辑写成伪代码，逐行走一遍：

> \`transfer(to, amount):\`
> 　\`require(!paused, "TOKEN_PAUSED")\` —— 代币没被整体暂停
> 　\`require(!frozen[msg.sender] && !frozen[to], "ADDRESS_FROZEN")\` —— 双方都没被冻结
> 　\`require(balance[msg.sender] - frozenTokens[msg.sender] >= amount, "INSUFFICIENT_UNFROZEN")\` —— 未冻结余额够
> 　\`require(identityRegistry.isVerified(to), "RECEIVER_NOT_VERIFIED")\` —— 接收方身份过关
> 　\`require(compliance.canTransfer(msg.sender, to, amount), "COMPLIANCE_FAILURE")\` —— 规则全过
> 　\`_transfer(msg.sender, to, amount)\` —— 这才真正划账，并通知 compliance 更新计数

其中第四行 \`isVerified(to)\` 又展开成三问：**to 在身份注册表里有身份合约吗？**（没注册过 = 直接拒）→ **该身份上，声明主题注册表要求的每个主题都有声明吗？** → **这些声明的签发者在可信签发者注册表里吗？签名有效吗？没过期、没被撤销吗？**三问全“是”才算 verified。

第五行 \`canTransfer\` 则是让**每个合规模块投票**：国家模块查双方国家码、人数模块查“to 是不是新持有人且已达上限”、锁定期模块查时间、限额模块查数量——**一票否决制**，任何模块说不，整笔交易回滚。

体会一下这个设计的味道：转账失败不是静默失败，而是**带原因回滚**——\`RECEIVER_NOT_VERIFIED\`、\`COMPLIANCE_FAILURE\`。对接的前端可以把原因翻译给用户：“对方还没完成 KYC”。上一课第 87 页的规则，现在真的变成了 revert 消息。

### ③ 发行方的权力面板：强转、冻结、恢复

上一课的第 5、6 天（死亡继承、法院冻结令）要求发行方**必须**有干预能力。ERC-3643 把这些权力做成了标准函数，由**代理（agent）角色**（发行方或其委托的过户代理）调用：

- \`forcedTransfer(from, to, amount)\`：**不经持有人签名**移动代币——执行法院判决、纠正错账。
- \`setAddressFrozen(addr, bool)\` / \`freezePartialTokens(addr, amount)\`：整个地址或**部分余额**冻结——响应制裁指令或诉讼保全，部分冻结允许“冻住争议部分，其余照常”。
- \`pause()\` / \`unpause()\`：全局暂停一切转账——市场紧急事件、发现漏洞时的急刹车。
- \`recoveryAddress(lostWallet, newWallet, investorID)\`：**丢钥匙救济**——核心洞察是“代币绑定的是身份，不是钱包”。投资人证明身份、把新钱包绑到同一个 ONCHAINID 上，代理一键把余额从死钱包搬到新钱包。第 5 天的“U 盘随棺材下葬”问题，就此有了法律上正确的解法。
- \`mint\` / \`burn\`：由代理执行申购发行与赎回销毁（对应阶段 1.1 的生命周期）。

这些权力本身是把双刃剑——谁握着、怎么用、留什么痕，是阶段 6.5 的整课主题。这里先记住：**它们不是后门，是需求清单点名要的功能。**

### ④ 两个优雅设计：身份可复用，规则可热插拔

T-REX 架构里有两个决定值得单独欣赏，因为它们决定了这套标准的“经济性”。

**身份可复用。**身份注册表指向的是投资人的 ONCHAINID 身份合约，而这个身份合约**不属于任何一只代币**——它是投资人自己的。同一个身份可以同时被 A 基金、B 债券、C 平台的身份注册表引用。做一次 KYC（成本 10–100 美元/人，阶段 6.3 细算），拿到的声明在整个生态里通用——“**KYC 一次，处处可投**”。对发行方，这意味着获客成本骤降；对生态，这意味着身份层成了公共基础设施。

**规则可热插拔。**合规合约是模块化的：某天监管新规要求“单一投资者持仓不得超过 10%”，发行方部署一个新模块、注册进 compliance——**代币合约本身一行不改，持有人无感，无需迁移**。对比一下：把规则硬编码在代币里的项目，遇到法律变更要走完整的合约升级流程（阶段 2.3 讲过升级的风险与治理成本）。证券的规则寿命远短于资产寿命——一只 10 年期债券会经历多轮监管变化——**“规则与资产解耦”不是洁癖，是刚需**。

### ⑤ 生态与对比：T-REX、DS 协议与朴素白名单

**采用现实**（截至 2025 年）：ERC-3643 由 Tokeny（现属 Apex 集团）长期主导开发与推广，2023 年经以太坊社区流程成为**正式 ERC**；围绕它有 ERC3643 协会推动多机构互操作，生态宣称累计代币化规模达**数百亿美元**级。它成为除美国大型发行方自有体系外，机构代币化事实上的公开标准。

**对比 Securitize DS 协议**：思想同构——代币 + 身份服务 + 合规服务分层，转账时查检——但 DS 是 Securitize 的**专有体系**，身份数据在其平台内闭环（BlackRock BUIDL 用的就是这套，阶段 10.1）。选它 = 选一个全托管服务商；选 ERC-3643 = 选一个开放标准 + 自选服务商。

**对比朴素白名单**：最简单的合规化是在 ERC-20 上加一个 \`mapping(address => bool) whitelist\`，transfer 时查一下。便宜、好懂，小规模私募够用。但它**认地址不认人**（换钱包 = 重新入册）、**无声明语义**（“在名单上”不区分为什么在）、**零复用**（每只代币自建名单、各自为政）。可以把它看作 ERC-3643 的退化形态：安检门还在，但没了身份证系统。

这一节你只要带走一句话：**T-REX 把“监管”写成可替换的模块、把“身份”做成可复用的资产，代币本体只在转账时提问——这就是“合规即代码”的标准答案。**
`,

  demo: "trex-transfer",

  analogy: `
把一只 ERC-3643 代币想成一场**受管制的国际会议**，而转账就是**把入场手环递给另一个人**。

裸 ERC-20 的会议是音乐节：手环随便转卖，保安只看“手环是真的吗”（余额够吗）。而这场会议有五个部门在协作：**前台**（Token）负责实际换手环，但换之前要打两个电话。第一个电话打给**注册处**（Identity Registry）：“接手环的这位，登记过吗？哪国人？”注册处不自己核身份——它只查这个人档案袋里的**推荐信**（claims）：信是不是**大会认可的推荐人**（Trusted Issuers Registry）写的？写的是不是**大会要求的那几项**（Claim Topics Registry）——身份核验、职业资格？信过期没有？

第二个电话打给**会务规则组**（Compliance）：“这场分论坛限 200 人，满了吗？他的国籍在受限名单上吗？他今天已经换过几次手环了？”规则组桌上摆着一排**活页规则卡**——大会临时新增一条规定，抽一张旧卡、插一张新卡，前台的流程一秒都不用变。

两个电话都说“行”，手环才换到新人手上；任何一个说“不行”，前台会明确告诉你**卡在哪一条**。而大会保安长（agent）还有几把特殊钥匙：能把闹事者请出场（freeze）、能按法院传票收回手环（forcedTransfer）、能给丢了手环但证明了身份的人补发（recovery）。最妙的是：你在这场大会拿到的推荐信，**下一场认可同一批推荐人的大会照样有效**——这就是身份复用。
`,

  misconceptions: [
    "“ERC-3643 是一个代币合约，只是 transfer 里多了些 if。” —— 它是五个合约的体系：代币、身份注册表、可信签发者注册表、声明主题注册表、合规合约。检查逻辑全部住在代币之外，这正是它能“法律变了不动代币”的原因。",
    "“许可型代币不兼容 ERC-20，普通钱包用不了。” —— 恰好相反，ERC-3643 刻意保持 ERC-20 接口兼容：balanceOf、transfer、事件全都在，钱包照常显示与操作。只是转账会先过安检，不合规的会带原因回滚。",
    "“白名单就是把地址加进一个 mapping，ERC-3643 也一样。” —— 朴素白名单认地址不认人、不区分“为什么在名单上”、每只代币各建各的。ERC-3643 认的是身份合约（换钱包身份还在），声明有主题、签发者、有效期，且跨代币复用——表达力完全不在一个量级。",
    "“forcedTransfer 是后门，说明这标准不安全。” —— 它是需求清单点名要的功能：没有它，法院判决无法执行、死亡继承无法处理、名册会永久失真（上一课第 5、6 天）。真正的问题不是有没有开关，而是谁握着、动一次留什么痕——那是阶段 6.5 的主题。",
    "“法律一变，证券代币就得迁移合约、换新代币。” —— T-REX 的模块化合规正是为此设计：新规则 = 部署新模块插进 compliance，代币与持有人无感。需要整体迁移的是把规则硬编码进代币的那类设计。",
  ],

  quiz: [
    {
      q: "ERC-3643 体系里，“谁的 KYC 担保算数”由哪个合约决定？",
      options: [
        "Token 代币本体",
        "Trusted Issuers Registry（可信签发者注册表）",
        "Compliance 合规合约",
        "Identity Registry（身份注册表）",
      ],
      answer: 1,
      explain: "可信签发者注册表定义发行方认可哪些声明签发者（KYC 机构等）；声明主题注册表定义要担保什么；身份注册表只负责“地址→身份”的映射。",
    },
    {
      q: "一笔 transfer 中，isVerified(to) 检查失败最可能的含义是？",
      options: [
        "接收方余额不足",
        "接收方没有注册身份，或缺少必需主题的有效声明，或声明签发者不被信任",
        "代币被整体暂停了",
        "转账金额超过每日限额",
      ],
      answer: 1,
      explain: "isVerified 三问：有身份合约吗？要求的主题都有有效声明吗？签发者可信吗？余额、暂停、限额分别由其它检查负责。",
    },
    {
      q: "监管新规要求“单一投资者持仓不超 10%”，标准的 T-REX 应对方式是？",
      options: [
        "升级代币合约，重写 transfer",
        "让所有持有人迁移到新代币",
        "部署一个新合规模块并注册进 Compliance 合约，代币本体不动",
        "把规则写进认购协议，靠投资人自觉",
      ],
      answer: 2,
      explain: "规则与资产解耦：合规模块可热插拔，法律变更 = 换模块，不动代币、不迁移持有人——这是 T-REX 相对硬编码方案的核心优势。",
    },
    {
      q: "recoveryAddress 能“合法正确地”解决丢私钥问题，根本原因是？",
      options: [
        "它能破解丢失的私钥",
        "代币绑定的是投资人的链上身份而非钱包地址，证明身份后可把新钱包绑回同一身份、由代理搬移余额",
        "它把代币退回发行方重新发售",
        "它依赖链下数据库备份",
      ],
      answer: 1,
      explain: "“认人不认钱包”是关键：法律请求权属于人，钱包只是端点。身份还在，换个端点即可——这正是裸 ERC-20 做不到的。",
    },
    {
      q: "ERC-3643 与 Securitize DS 协议的关系，最准确的说法是？",
      options: [
        "两者互不兼容且思想对立",
        "DS 是 ERC-3643 的官方实现",
        "思想同构（代币+身份+合规分层、转账时查检），但 DS 是专有闭环体系，ERC-3643 是开放标准",
        "DS 不做任何转账检查",
      ],
      answer: 2,
      explain: "“验证在链下、担保在链上、检查在转账时”的模式是全行业通用的；差别在开放标准 vs 专有平台——选型时权衡的是生态互操作与全托管服务。",
    },
  ],

  further: [
    { label: "EIP-3643：标准原文（五合约接口定义）", url: "https://eips.ethereum.org/EIPS/eip-3643" },
    { label: "ERC3643 协会官网（生态与采用情况）", url: "https://www.erc3643.org/" },
    { label: "Tokeny：T-REX 协议主导开发方", url: "https://tokeny.com/" },
    { label: "T-REX 参考实现（GitHub 源码）", url: "https://github.com/TokenySolutions/T-REX" },
    { label: "Securitize（DS 协议体系，对照阅读）", url: "https://securitize.io/" },
  ],
};
