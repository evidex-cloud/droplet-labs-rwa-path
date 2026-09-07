// 课程地图（双语 + 元数据）。路线图/侧栏只读这个文件。
// 每节字段：id, title(中), titleEn(英), module(中文正文路径), status('ready'可学/其它=编写中),
//           difficulty(1基础/2进阶/3高级), personas(相关学习目标)
// 英文正文在 ./content/lessons/en/ 下同名文件；难度与 persona 与语言无关。
// 加一节课 = 写一个 lessons 文件 + 把这里的 status 改成 'ready'，不动核心代码。

export const COURSE = {
  title: "Droplet Labs · RWA 之路",
  titleEn: "Droplet Labs · RWA Path",
  subtitle: "从浅到深，理解“真实世界资产（RWA）与代币化”背后的每一块技术——传统金融与区块链的交汇处",
  subtitleEn: "From the surface to the depths — understand every piece behind Real-World Assets & tokenization, where TradFi meets blockchain.",

  tiers: [
    { id: "intro",    label: "入门层 · 浅", labelEn: "Beginner · Surface", color: "#2dd4bf" },
    { id: "core",     label: "原理层",       labelEn: "Principles",         color: "#14b8a6" },
    { id: "systems",  label: "系统层",       labelEn: "Systems",            color: "#0d9488" },
    { id: "mastery",  label: "精通层 · 深",  labelEn: "Mastery · Deep",     color: "#0f766e" },
    { id: "infinity", label: "∞ 之后 · 方向与机会", labelEn: "∞ Beyond · Where It Goes", color: "#9333ea" },
  ],

  goals: [
    { id: "investor",  label: "投资者",       labelEn: "Investor" },
    { id: "developer", label: "开发者",       labelEn: "Developer" },
    { id: "issuer",    label: "资产发行方",   labelEn: "Asset Issuer" },
    { id: "curious",   label: "好奇者",       labelEn: "Curious" },
  ],

  stages: [
    {
      n: 0, tier: "intro", title: "为什么要把真实世界搬上链", titleEn: "Why Tokenize the Real World",
      blurb: "什么是 RWA · 所有权即记录 · 代币化修复什么 · 全景地图", blurbEn: "What RWA is · Ownership as records · What tokenization fixes · The landscape",
      lessons: [
        { id: "what-is-rwa", title: "什么是 RWA：把现实资产变成链上代币", titleEn: "What Is an RWA: Real Assets as On-chain Tokens", module: "./content/lessons/stage0-what-is-rwa.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer", "curious"] },
        { id: "ownership-records", title: "所有权的本质：从地契到数据库到代币", titleEn: "Ownership Is a Record: From Deeds to Databases to Tokens", module: "./content/lessons/stage0-ownership-records.js", status: "ready", difficulty: 1, personas: ["investor", "issuer", "curious"] },
        { id: "why-tokenize", title: "代币化到底修复了什么：结算·门槛·碎片化·可编程", titleEn: "What Tokenization Actually Fixes: Settlement · Access · Fractions · Programmability", module: "./content/lessons/stage0-why-tokenize.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer", "curious"] },
        { id: "rwa-landscape", title: "RWA 全景：国债·信贷·地产·大宗·基金·稳定币", titleEn: "The RWA Landscape: Treasuries · Credit · Real Estate · Commodities · Funds · Stablecoins", module: "./content/lessons/stage0-rwa-landscape.js", status: "ready", difficulty: 1, personas: ["investor", "curious"] },
      ],
    },
    {
      n: 1, tier: "intro", title: "全景：一枚代币的一生", titleEn: "The Big Picture: Life of a Token",
      blurb: "完整旅程 · 链上 vs 链下 · 信任之桥 · 名词地图", blurbEn: "The full journey · On/off-chain · The trust bridge · Acronym map",
      lessons: [
        { id: "token-lifecycle", title: "一枚 RWA 代币的完整旅程：发起→发行→交易→赎回", titleEn: "The Journey of One RWA Token: Originate → Issue → Trade → Redeem", module: "./content/lessons/stage1-token-lifecycle.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer", "curious"] },
        { id: "onchain-offchain", title: "链上 vs 链下：代币在链上，资产在现实里", titleEn: "On-chain vs Off-chain: The Token Is On-chain, the Asset Isn't", module: "./content/lessons/stage1-onchain-offchain.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer"] },
        { id: "trust-bridge", title: "信任之桥：谁向链证明“资产真的在”", titleEn: "The Trust Bridge: Who Tells the Chain the Asset Is Real", module: "./content/lessons/stage1-trust-bridge.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "curious"] },
        { id: "acronym-map", title: "名词地图：一次见全所有缩写", titleEn: "The Acronym Map", module: "./content/lessons/stage1-acronym-map.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer", "curious"] },
      ],
    },
    {
      n: 2, tier: "core", title: "区块链地基", titleEn: "Blockchain Foundations",
      blurb: "区块链 · 钱包 · 合约 · ERC-20 · NFT · Gas 与 L2", blurbEn: "Blockchains · Wallets · Contracts · ERC-20 · NFTs · Gas & L2s",
      lessons: [
        { id: "what-is-blockchain", title: "区块链是什么：一本没人能单方面改的账本", titleEn: "What a Blockchain Is: A Ledger Nobody Can Unilaterally Edit", module: "./content/lessons/stage2-what-is-blockchain.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer", "curious"] },
        { id: "wallets-keys", title: "钱包、私钥与地址：链上的“身份与签名”", titleEn: "Wallets, Keys & Addresses: On-chain Identity & Signatures", module: "./content/lessons/stage2-wallets-keys.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "curious"] },
        { id: "smart-contracts", title: "智能合约：跑在链上的自动执行程序", titleEn: "Smart Contracts: Self-Executing Programs on a Chain", module: "./content/lessons/stage2-smart-contracts.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
        { id: "erc20-tokens", title: "ERC-20：同质化代币——一张“地址→余额”表", titleEn: "ERC-20: Fungible Tokens — an Address→Balance Table", module: "./content/lessons/stage2-erc20-tokens.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
        { id: "nft-unique-assets", title: "NFT 与 ERC-721：独一无二的链上凭证", titleEn: "NFTs & ERC-721: One-of-a-Kind On-chain Certificates", module: "./content/lessons/stage2-nft-unique-assets.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "curious"] },
        { id: "gas-chains-l2", title: "Gas、公链与许可链：RWA 都住在哪些链上", titleEn: "Gas, Public & Permissioned Chains: Where RWAs Live", module: "./content/lessons/stage2-gas-chains-l2.js", status: "ready", difficulty: 2, personas: ["developer", "issuer"] },
      ],
    },
    {
      n: 3, tier: "core", title: "传统金融地基", titleEn: "TradFi Foundations",
      blurb: "证券 · 国债与收益率 · 基金与 NAV · 托管与清算 · 私募市场", blurbEn: "Securities · Treasuries & yield · Funds & NAV · Custody & settlement · Private markets",
      lessons: [
        { id: "securities-basics", title: "证券是什么：股票、债券与“对未来现金流的凭证”", titleEn: "What a Security Is: Stocks, Bonds & Claims on Future Cash Flows", module: "./content/lessons/stage3-securities-basics.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "curious"] },
        { id: "treasuries-yield", title: "美国国债与收益率：为什么 T-Bill 统治 RWA", titleEn: "Treasuries & Yield: Why T-Bills Rule RWA", module: "./content/lessons/stage3-treasuries-yield.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
        { id: "funds-nav", title: "基金与 NAV：每天算一次的“每份净值”", titleEn: "Funds & NAV: The Once-a-Day Price per Share", module: "./content/lessons/stage3-funds-nav.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
        { id: "custody-settlement", title: "托管、过户与清算：T+1 背后的管道工程", titleEn: "Custody, Transfer Agents & Settlement: The Plumbing Behind T+1", module: "./content/lessons/stage3-custody-settlement.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
        { id: "private-markets", title: "私募信贷与另类资产：那个流动性极差的世界", titleEn: "Private Credit & Alternatives: The Illiquid World", module: "./content/lessons/stage3-private-markets.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
      ],
    },
    {
      n: 4, tier: "core", title: "稳定币：第一个成功的 RWA", titleEn: "Stablecoins: The First RWA That Worked",
      blurb: "解剖 USDC/USDT · 储备与鉴证 · 脱锚 · 稳定币监管", blurbEn: "USDC/USDT anatomy · Reserves & attestations · Depegs · Stablecoin law",
      lessons: [
        { id: "stablecoin-anatomy", title: "解剖一枚法币稳定币：铸造、储备与赎回", titleEn: "Anatomy of a Fiat Stablecoin: Mint, Reserves, Redeem", module: "./content/lessons/stage4-stablecoin-anatomy.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer", "curious"] },
        { id: "reserves-attestation", title: "储备金去哪了：鉴证、审计与透明度", titleEn: "Where the Reserves Are: Attestations, Audits & Transparency", module: "./content/lessons/stage4-reserves-attestation.js", status: "ready", difficulty: 2, personas: ["investor", "issuer"] },
        { id: "depeg-anatomy", title: "脱锚时刻：2023 年 USDC 与硅谷银行 48 小时", titleEn: "When the Peg Breaks: USDC & SVB, 48 Hours in 2023", module: "./content/lessons/stage4-depeg-anatomy.js", status: "ready", difficulty: 2, personas: ["investor", "curious"] },
        { id: "stablecoin-regulation", title: "稳定币立法：GENIUS 法案与 MiCA 电子货币", titleEn: "Stablecoin Law: The GENIUS Act & MiCA E-money", module: "./content/lessons/stage4-stablecoin-regulation.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
      ],
    },
    {
      n: 5, tier: "systems", title: "法律包装：代币背后是什么", titleEn: "The Legal Wrapper",
      blurb: "代币=债权凭证 · SPV 与破产隔离 · 法律效力 · 投资者权利", blurbEn: "Token = claim · SPVs & bankruptcy remoteness · Legal force · Investor rights",
      lessons: [
        { id: "token-vs-claim", title: "你买的不是资产，是“对资产的请求权”", titleEn: "You Don't Own the Asset — You Own a Claim on It", module: "./content/lessons/stage5-token-vs-claim.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
        { id: "spv-structures", title: "SPV 与信托：破产隔离的“防火墙”", titleEn: "SPVs & Trusts: The Bankruptcy-Remoteness Firewall", module: "./content/lessons/stage5-spv-structures.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
        { id: "legal-enforceability", title: "让“代币=法律上的所有权”成立：登记与法域", titleEn: "Making Token = Legal Title: Registrars & Jurisdictions", module: "./content/lessons/stage5-legal-enforceability.js", status: "ready", difficulty: 3, personas: ["issuer", "developer"] },
        { id: "investor-rights", title: "违约了怎么办：赎回、清算与追索路径", titleEn: "When Things Go Wrong: Redemption, Liquidation & Recourse", module: "./content/lessons/stage5-investor-rights.js", status: "ready", difficulty: 2, personas: ["investor", "issuer"] },
      ],
    },
    {
      n: 6, tier: "systems", title: "RWA 代币标准", titleEn: "Token Standards for RWA",
      blurb: "为何裸 ERC-20 不行 · ERC-3643 · 链上身份 · ERC-4626 · 管控开关", blurbEn: "Why plain ERC-20 fails · ERC-3643 · On-chain identity · ERC-4626 · Control switches",
      lessons: [
        { id: "why-not-erc20", title: "为什么裸 ERC-20 装不下一只证券", titleEn: "Why a Plain ERC-20 Can't Hold a Security", module: "./content/lessons/stage6-why-not-erc20.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
        { id: "erc3643", title: "ERC-3643（T-REX）：自带“准入名单”的许可型代币", titleEn: "ERC-3643 (T-REX): Permissioned Tokens with a Built-in Guest List", module: "./content/lessons/stage6-erc3643.js", status: "ready", difficulty: 3, personas: ["developer", "issuer"] },
        { id: "onchain-identity", title: "链上身份与资格声明：ONCHAINID 与白名单", titleEn: "On-chain Identity & Claims: ONCHAINID & Whitelists", module: "./content/lessons/stage6-onchain-identity.js", status: "ready", difficulty: 3, personas: ["developer", "issuer"] },
        { id: "erc4626-vaults", title: "ERC-4626 金库：把“会生息的份额”标准化", titleEn: "ERC-4626 Vaults: Standardizing Yield-Bearing Shares", module: "./content/lessons/stage6-erc4626-vaults.js", status: "ready", difficulty: 3, personas: ["developer", "investor"] },
        { id: "control-switches", title: "冻结、没收、暂停：发行方手里的开关", titleEn: "Freeze, Clawback, Pause: The Issuer's Switches", module: "./content/lessons/stage6-control-switches.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer", "curious"] },
      ],
    },
    {
      n: 7, tier: "systems", title: "合规机器", titleEn: "The Compliance Machine",
      blurb: "KYC/AML · 投资者资格 · 链上转账限制 · 隐私与合规", blurbEn: "KYC/AML · Investor eligibility · On-chain restrictions · Privacy vs compliance",
      lessons: [
        { id: "kyc-aml", title: "KYC / AML / 制裁筛查：合规的三道闸", titleEn: "KYC / AML / Sanctions Screening: The Three Gates", module: "./content/lessons/stage7-kyc-aml.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer"] },
        { id: "investor-eligibility", title: "谁有资格买：合格投资者、Reg D 与 Reg S", titleEn: "Who May Buy: Accredited Investors, Reg D & Reg S", module: "./content/lessons/stage7-investor-eligibility.js", status: "ready", difficulty: 2, personas: ["investor", "issuer"] },
        { id: "transfer-restrictions", title: "转账限制的落地：一笔转账要过几道检查", titleEn: "Transfer Restrictions in Action: The Checks One Transfer Must Pass", module: "./content/lessons/stage7-transfer-restrictions.js", status: "ready", difficulty: 2, personas: ["developer", "issuer"] },
        { id: "privacy-compliance", title: "隐私 vs 合规：零知识证明能两全吗", titleEn: "Privacy vs Compliance: Can ZK Proofs Give You Both", module: "./content/lessons/stage7-privacy-compliance.js", status: "ready", difficulty: 3, personas: ["developer", "curious"] },
      ],
    },
    {
      n: 8, tier: "systems", title: "预言机、数据与链上 NAV", titleEn: "Oracles, Data & On-chain NAV",
      blurb: "预言机问题 · 价格/NAV 喂价 · 储备证明 · 派息与公司行为", blurbEn: "The oracle problem · Price/NAV feeds · Proof of reserve · Coupons & corporate actions",
      lessons: [
        { id: "oracle-problem", title: "预言机问题：链是个“盲人”，谁给它读报纸", titleEn: "The Oracle Problem: The Chain Is Blind — Who Reads It the News", module: "./content/lessons/stage8-oracle-problem.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "curious"] },
        { id: "nav-feeds", title: "把 NAV 喂上链：价格源、心跳与偏差阈值", titleEn: "Feeding NAV On-chain: Sources, Heartbeats & Deviation Thresholds", module: "./content/lessons/stage8-nav-feeds.js", status: "ready", difficulty: 3, personas: ["developer", "issuer"] },
        { id: "proof-of-reserve", title: "储备证明：让“钱还在”变成可机读的事实", titleEn: "Proof of Reserve: Making 'the Money Is Still There' Machine-Readable", module: "./content/lessons/stage8-proof-of-reserve.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
        { id: "corporate-actions", title: "派息、付息与公司行为：现金流怎么流回代币", titleEn: "Dividends, Coupons & Corporate Actions: How Cash Flows Back to the Token", module: "./content/lessons/stage8-corporate-actions.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
      ],
    },
    {
      n: 9, tier: "systems", title: "流动性与市场", titleEn: "Liquidity & Markets",
      blurb: "一级 vs 二级 · AMM 与订单簿 · RWA×DeFi · 赎回与锚定", blurbEn: "Primary vs secondary · AMMs & order books · RWA×DeFi · Redemption & the peg",
      lessons: [
        { id: "primary-secondary", title: "一级发行与二级流通：两个市场，两套规则", titleEn: "Primary Issuance vs Secondary Trading: Two Markets, Two Rulebooks", module: "./content/lessons/stage9-primary-secondary.js", status: "ready", difficulty: 2, personas: ["investor", "issuer"] },
        { id: "amm-orderbooks", title: "AMM 与订单簿：为什么 RWA 的流动性这么难", titleEn: "AMMs & Order Books: Why RWA Liquidity Is Hard", module: "./content/lessons/stage9-amm-orderbooks.js", status: "ready", difficulty: 2, personas: ["investor", "developer"] },
        { id: "rwa-in-defi", title: "RWA 进入 DeFi：抵押品、货币市场与 Sky/Maker", titleEn: "RWA Inside DeFi: Collateral, Money Markets & Sky/Maker", module: "./content/lessons/stage9-rwa-in-defi.js", status: "ready", difficulty: 3, personas: ["investor", "developer"] },
        { id: "redemption-peg", title: "赎回窗口与套利：价格为什么贴着 NAV 走", titleEn: "Redemption Windows & Arbitrage: Why Price Hugs NAV", module: "./content/lessons/stage9-redemption-peg.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer"] },
      ],
    },
    {
      n: 10, tier: "mastery", title: "案例研究：真实玩家", titleEn: "Case Studies: The Real Players",
      blurb: "BUIDL · Ondo · 私募信贷 · 地产 · 黄金 · 失败案例", blurbEn: "BUIDL · Ondo · Private credit · Real estate · Gold · Failures",
      lessons: [
        { id: "case-buidl", title: "BlackRock BUIDL：代币化国债基金的标杆", titleEn: "BlackRock BUIDL: The Benchmark Tokenized Treasury Fund", module: "./content/lessons/stage10-case-buidl.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
        { id: "case-ondo", title: "Ondo OUSG 与 USDY：两种包装，两类客群", titleEn: "Ondo OUSG & USDY: Two Wrappers, Two Audiences", module: "./content/lessons/stage10-case-ondo.js", status: "ready", difficulty: 2, personas: ["investor", "curious"] },
        { id: "case-private-credit", title: "链上私募信贷：Maple、Centrifuge 与 Goldfinch 的教训", titleEn: "On-chain Private Credit: Maple, Centrifuge & Goldfinch's Lessons", module: "./content/lessons/stage10-case-private-credit.js", status: "ready", difficulty: 3, personas: ["investor", "issuer"] },
        { id: "case-real-estate", title: "地产代币化：RealT 的碎片与“流动性幻觉”", titleEn: "Real Estate Tokenization: RealT's Fractions & the Liquidity Illusion", module: "./content/lessons/stage10-case-real-estate.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
        { id: "case-gold", title: "黄金与大宗：PAXG 怎么把金条切成克", titleEn: "Gold & Commodities: How PAXG Slices Bars into Grams", module: "./content/lessons/stage10-case-gold.js", status: "ready", difficulty: 2, personas: ["investor", "curious"] },
        { id: "case-failures", title: "死掉的项目教会我们什么", titleEn: "What the Dead Projects Teach Us", module: "./content/lessons/stage10-case-failures.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
      ],
    },
    {
      n: 11, tier: "mastery", title: "全球监管地图", titleEn: "The Global Regulatory Map",
      blurb: "美国 SEC 与 Howey · 欧盟 MiCA · 亚洲枢纽 · 沙盒与试点", blurbEn: "US SEC & Howey · EU MiCA · Asia hubs · Sandboxes & pilots",
      lessons: [
        { id: "us-regulation", title: "美国：Howey 测试、Reg D/S/A+ 与 ATS", titleEn: "The US: Howey, Reg D/S/A+ & ATSs", module: "./content/lessons/stage11-us-regulation.js", status: "ready", difficulty: 3, personas: ["investor", "issuer"] },
        { id: "eu-mica", title: "欧盟：MiCA、DLT 试点制度与招股书规则", titleEn: "The EU: MiCA, the DLT Pilot Regime & Prospectus Rules", module: "./content/lessons/stage11-eu-mica.js", status: "ready", difficulty: 3, personas: ["issuer", "investor"] },
        { id: "asia-hubs", title: "亚洲枢纽：新加坡 MAS、香港 SFC 与 Project Guardian", titleEn: "Asia's Hubs: Singapore MAS, Hong Kong SFC & Project Guardian", module: "./content/lessons/stage11-asia-hubs.js", status: "ready", difficulty: 2, personas: ["issuer", "investor", "curious"] },
        { id: "sandboxes-pilots", title: "沙盒、试点与机构实验：监管怎么“先试后立”", titleEn: "Sandboxes & Pilots: How Regulators Try Before They Legislate", module: "./content/lessons/stage11-sandboxes-pilots.js", status: "ready", difficulty: 2, personas: ["issuer", "curious"] },
      ],
    },
    {
      n: 12, tier: "mastery", title: "风险与尽调：像专家一样评估", titleEn: "Risk & Diligence: Evaluate Like an Expert",
      blurb: "风险地图 · 读文件 · 红旗清单 · 收益从哪来", blurbEn: "The risk map · Reading the docs · Red flags · Where yield comes from",
      lessons: [
        { id: "risk-map", title: "RWA 风险地图：六层风险一张图", titleEn: "The RWA Risk Map: Six Layers on One Chart", module: "./content/lessons/stage12-risk-map.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
        { id: "reading-docs", title: "怎么读发行文件与审计报告", titleEn: "How to Read Offering Docs & Audit Reports", module: "./content/lessons/stage12-reading-docs.js", status: "ready", difficulty: 3, personas: ["investor", "issuer"] },
        { id: "redflags-checklist", title: "红旗清单：一套可直接上手的尽调流程", titleEn: "The Red-Flag Checklist: A Due-Diligence Playbook", module: "./content/lessons/stage12-redflags-checklist.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
        { id: "yield-anatomy", title: "拆解收益率：钱到底从哪来，什么时候会断", titleEn: "Anatomy of a Yield: Where the Money Comes From & When It Stops", module: "./content/lessons/stage12-yield-anatomy.js", status: "ready", difficulty: 2, personas: ["investor", "curious"] },
      ],
    },
    {
      n: 13, tier: "mastery", title: "亲手设计一个代币化项目", titleEn: "Design a Tokenization Project by Hand",
      blurb: "整体架构 · 发行流水线 · 技术选型 · 速查表", blurbEn: "Architecture · Issuance pipeline · Choosing the stack · Cheat sheet",
      lessons: [
        { id: "platform-architecture", title: "整体架构：一个代币化平台的六大组件", titleEn: "The Architecture: Six Components of a Tokenization Platform", module: "./content/lessons/stage13-platform-architecture.js", status: "ready", difficulty: 3, personas: ["developer", "issuer"] },
        { id: "issuance-pipeline", title: "发行流水线：从一栋楼到一枚代币的每一步", titleEn: "The Issuance Pipeline: Every Step from a Building to a Token", module: "./content/lessons/stage13-issuance-pipeline.js", status: "ready", difficulty: 3, personas: ["developer", "issuer"] },
        { id: "choosing-stack", title: "技术选型：链、标准、托管方、预言机怎么挑", titleEn: "Choosing the Stack: Chain, Standard, Custodian, Oracle", module: "./content/lessons/stage13-choosing-stack.js", status: "ready", difficulty: 3, personas: ["developer", "issuer"] },
        { id: "cheat-sheet", title: "附录：关键名词与数字速查", titleEn: "Appendix: Key Terms & Numbers Cheat Sheet", module: "./content/lessons/stage13-cheat-sheet.js", status: "ready", difficulty: 1, personas: ["investor", "developer", "issuer", "curious"] },
      ],
    },
    {
      n: "∞", tier: "infinity", title: "之后去哪：趋势与机会", titleEn: "Where It Goes: Trends & Opportunities",
      blurb: "下一波资产 · 机构棋局 · 你的机会", blurbEn: "The next assets · The institutional chessboard · Your opportunities",
      lessons: [
        { id: "future-assets", title: "下一波：存款代币、代币化股票与“万物市场”", titleEn: "The Next Wave: Deposit Tokens, Tokenized Equities & Markets for Everything", module: "./content/lessons/stageInf-future-assets.js", status: "ready", difficulty: 2, personas: ["investor", "issuer", "curious"] },
        { id: "institutional-chessboard", title: "机构棋局：银行、资管与链的“三方博弈”", titleEn: "The Institutional Chessboard: Banks, Asset Managers & Chains", module: "./content/lessons/stageInf-institutional-chessboard.js", status: "ready", difficulty: 2, personas: ["investor", "curious"] },
        { id: "your-opportunities", title: "你的机会：在 RWA 里创业、就业与投资的切入点", titleEn: "Your Opportunities: Building, Working & Investing in RWA", module: "./content/lessons/stageInf-your-opportunities.js", status: "ready", difficulty: 2, personas: ["investor", "developer", "issuer", "curious"] },
      ],
    },
  ],
};
