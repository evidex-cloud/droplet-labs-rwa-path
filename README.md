<div align="center">

<img src="assets/logo.svg" width="84" alt="Droplet Labs logo" />

# Droplet Labs · RWA 之路 / RWA Path

**A local-first, bilingual, interactive course on Real-World Assets & tokenization — from zero to expert.**

中文 · English · runs in any browser · no build step

</div>

---

## English

**RWA Path** unpacks every layer behind real-world-asset tokenization — the place where traditional finance meets blockchain — as one shallow-to-deep path. It's built so that someone starting from zero can reach the point of *understanding* ERC-3643, SPV structures, NAV oracles, proof of reserve, and global regulation — and *designing a tokenization project by hand*.

### What's inside
- **5 tiers · 15 stages · 65 lessons**, each paired with an **in-browser interactive demo** (65 in total).
- Both foundations laid from zero: **blockchain** (ledgers, wallets, contracts, ERC-20/721, gas & chains) and **traditional finance** (securities, T-bills, NAV, custody & settlement, private markets).
- The full RWA stack: **stablecoins** as the first working RWA (anatomy, reserves, the USDC/SVB depeg, GENIUS Act & MiCA), **legal wrappers** (claims, SPVs, bankruptcy remoteness, register regimes), **token standards** (ERC-3643/T-REX, ONCHAINID, ERC-4626, issuer switches), the **compliance machine** (KYC/AML, Reg D/S, transfer restrictions, ZK privacy), **oracles & on-chain NAV** (feeds, proof of reserve, corporate actions), **liquidity & markets** (primary vs secondary, AMMs, RWA×DeFi, the peg-to-NAV mechanism), **case studies** (BUIDL, Ondo, Maple/Centrifuge/Goldfinch, RealT, PAXG, and the graveyard), **global regulation** (Howey, MiCA, Asia's hubs, sandboxes), an operating **risk & diligence toolkit** (six-layer risk map, doc reading, red flags, yield decomposition), and a **capstone**: architect, pipeline, and stack-select your own tokenization project — plus a bonus **Stage ∞** on where the industry goes next.
- A fixed lesson template — **Intuition → Mechanics → Demo → Analogy → Misconceptions → Quiz → Further reading** — to keep cognitive load low.
- Hand-drawn **inline SVG** diagrams for the hard ideas; many demos **compute for real** (real SHA-256 hashing and signatures, live NAV math, bond pricing, AMM curves, collateral liquidations, waterfall math).
- **Bilingual** 中文 / English (toggle in the UI). Progress lives only in your browser (`localStorage`). Filter lessons by persona (Investor / Developer / Asset Issuer / Curious).

### Run it
There's no build and no dependencies — it's a static site. You only need a local server, because the demos use `crypto.subtle` and dynamic `import`, which don't work over `file://`.

```bash
# Windows — just double-click, or:
launch.bat

# Any OS:
python -m http.server 8784
```

Then open **http://localhost:8784/**.

### Project layout
| Path | What it is |
| --- | --- |
| `index.html`, `app.js`, `styles.css` | The shell + renderer (vanilla JS) |
| `content/manifest.js` | The course map (tiers, stages, lessons, personas) |
| `content/lessons/stageX-*.js` | Chinese lesson content — one file per lesson |
| `content/lessons/en/` | English lesson content — same filenames |
| `demos/*.js` | One interactive demo per lesson (bilingual) |
| `assets/` | Logo and static assets |

### Tech
Plain HTML/CSS/JavaScript — no framework, no bundler, no npm. Content loads on demand via native ES modules. Works fully offline after the first load.

---

## 中文

**RWA 之路** 把「真实世界资产（RWA）与代币化」背后的每一层技术——传统金融与区块链的交汇处——拆成一条**从浅到深**的主线，让没有基础的人也能一步步走到「看懂 ERC-3643、SPV 结构、NAV 预言机、储备证明与全球监管，并亲手设计一个代币化项目」。

### 里面有什么
- **5 个层 · 15 个阶段 · 65 节课**，每节都配一个**浏览器内交互演示**（共 65 个）。
- 两个地基都从零打起：**区块链**（账本、钱包、合约、ERC-20/721、Gas 与公链）与**传统金融**（证券、国债、NAV、托管清算、私募市场）。
- 覆盖完整的 RWA 技术栈：**稳定币**——第一个成功的 RWA（解剖、储备、USDC/硅谷银行脱锚、GENIUS 法案与 MiCA）、**法律包装**（请求权、SPV、破产隔离、登记制度）、**代币标准**（ERC-3643/T-REX、ONCHAINID、ERC-4626、发行方开关）、**合规机器**（KYC/AML、Reg D/S、转账限制、ZK 隐私）、**预言机与链上 NAV**（喂价、储备证明、派息与公司行为）、**流动性与市场**（一二级市场、AMM、RWA×DeFi、锚定 NAV 的机制）、**案例研究**（BUIDL、Ondo、Maple/Centrifuge/Goldfinch、RealT、PAXG 与失败墓地）、**全球监管**（Howey、MiCA、亚洲枢纽、沙盒）、可直接上手的**风险与尽调工具箱**（六层风险地图、读文件、红旗清单、收益分解），以及**毕业设计**：亲手为一个代币化项目做架构、流水线与技术选型——外加一个探讨行业走向的彩蛋 **阶段 ∞**。
- 固定课模板——**直觉 → 原理 → 演示 → 类比 → 常见误解 → 自测 → 延伸**——把认知负担降到最低。
- 难点配**手绘内联 SVG** 图；很多演示**真算**（真实 SHA-256 哈希与签名、NAV 计算、债券定价、AMM 曲线、抵押清算、清偿瀑布）。
- **双语** 中文 / English（界面内切换）。进度只存在你自己的浏览器（`localStorage`）。可按学习目标（投资者 / 开发者 / 资产发行方 / 好奇者）过滤课程。

### 怎么运行
无需构建、零依赖——纯静态网页。只需一个本地服务器（演示用到 `crypto.subtle` 与动态 `import`，在 `file://` 下不可用）。

```bash
# Windows：直接双击，或：
launch.bat

# 任意系统：
python -m http.server 8784
```

然后打开 **http://localhost:8784/**。

### 技术
纯 HTML/CSS/JavaScript——无框架、无打包、无 npm。内容用原生 ES 模块按需加载；首次加载后可完全离线使用。

---

## License

**Proprietary — © 2026 Droplet Labs. All rights reserved.** See [LICENSE](LICENSE).

This repository is shared publicly for reference. It is **not** open-source: no reuse, modification, redistribution, or derivative works without prior written permission from Droplet Labs.

<div align="center"><sub>Developed by <b>Droplet Labs</b> · Internal Only</sub></div>
