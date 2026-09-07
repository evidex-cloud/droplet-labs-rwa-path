// 交互演示：红旗猎捕——在一个虚构 RWA 落地页上点出可疑元素；错插旗要扣分（精确度也算分）。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // flag:true = 真红旗；weight: kill/major/minor
  const ITEMS = [
    { id: "apy", label: T("大标题：12.5% 稳定收益", "Headline: 12.5% stable yield"), flag: true, weight: "kill",
      why: T("秒杀项：国债 4–5% 的年代，12.5% 被写成“稳定”，多出的 8 个点必然来自某处——杠杆、补贴，或你自己的本金（阶段 12.4）。", "Kill criterion: with T-bills at 4–5%, calling 12.5% “stable” means 8 extra points come from somewhere — leverage, emissions, or your own principal (Stage 12.4).") },
    { id: "guarantee", label: T("“本金保障 · 回购承诺”", "“Principal protected · buyback guarantee”"), flag: true, weight: "kill",
      why: T("秒杀项：合法证券发行不能这么写。“保证”只在两种情况下出现——有真实担保方（会点名），或没有监管（阶段 12.3 阶段 0）。", "Kill criterion: lawful securities offerings can't say this. “Guaranteed” appears only with a real named guarantor, or with no regulator at all (Stage 12.3 Phase 0).") },
    { id: "team", label: T("团队页：四张头像，只有名字缩写", "Team page: four portraits, initials only"), flag: true, weight: "kill",
      why: T("匿名团队 + 他们握有管理员密钥（见下）= 不可保险：出事时你连被告是谁都不知道（阶段 6.5）。头像还可反向图搜到图库素材。", "An anonymous team + the admin keys they hold (below) = uninsurable: you won't even know whom to sue (Stage 6.5). The portraits also reverse-image-search to stock photos.") },
    { id: "adminkey", label: T("浏览器面板：owner = 单个 EOA 地址", "Explorer panel: owner = a single EOA"), flag: true, weight: "kill",
      why: T("一个私钥就能暂停、冻结、增发。文件里若写“多签治理”，这个矛盾比任何一方单独看都严重（阶段 12.3 阶段 1）。", "One private key can pause, freeze, mint. If the docs claim “multisig governance,” the contradiction is worse than either fact alone (Stage 12.3 Phase 1).") },
    { id: "attest", label: T("鉴证徽章：Attestation（8 个月前）", "Attestation badge (8 months ago)"), flag: true, weight: "major",
      why: T("标准是 90 天内。而且注意措辞是 attestation（时点快照）而非 audit——阶段 4.2 的词差。停更本身就是信号。", "The standard is within 90 days. Note also the word: attestation (a snapshot), not audit — Stage 4.2's word gap. A stopped cadence is itself a signal.") },
    { id: "auditlink", label: T("“已审计”→ 链接到一份营销 PDF", "“Audited” → links to a marketing PDF"), flag: true, weight: "major",
      why: T("真审计报告有事务所抬头、范围声明、发现项清单和被审地址。链到宣传册 = 没有报告（阶段 12.2④）。", "A real audit has a firm's letterhead, a scope statement, a findings list, and the address covered. A link to a brochure means there is no report (Stage 12.2).") },
    { id: "logo", label: T("合作方 logo：某知名托管机构", "Partner logo: a well-known custodian"), flag: true, weight: "major",
      why: T("社会证明陷阱：新闻稿里的合作方 ≠ 文件里的义务。去 PPM 与托管协议里搜这个名字，查无此名则法律上不存在（阶段 10.6）。", "The social-proof trap: a press-release partner ≠ a documented obligation. Search the PPM and custody agreement for the name; absent there, it doesn't legally exist (Stage 10.6).") },
    { id: "docs", label: T("页脚：Offering Documents（PDF）", "Footer: Offering Documents (PDF)"), flag: false,
      why: T("无辜元素：提供发行文件是正常且必要的。真正该做的是<b>点进去用七问协议读它</b>（阶段 12.2），而不是把它当红旗。", "Innocent: providing offering documents is normal and necessary. The right move is to <b>open it and run the seven-question protocol</b> (Stage 12.2), not flag it.") },
    { id: "contract", label: T("合约地址（源码已验证）", "Contract address (source verified)"), flag: false,
      why: T("无辜元素：公开地址且源码已验证是加分项。它是核验的<b>入口</b>——你该点进去看 owner 与铸造权限（那才是红旗所在）。", "Innocent: a public address with verified source is a plus. It's the <b>entry point</b> for verification — click through to inspect owner and mint rights (that's where the flag was).") },
    { id: "riskpage", label: T("风险提示页：“加密资产价格可能波动”", "Risk page: “crypto prices may fluctuate”"), flag: false,
      why: T("套话——是家具，不是警报。每份正规材料都有。知道<b>不该怕什么</b>和知道该怕什么同样重要（阶段 12.2③）。", "Boilerplate — furniture, not an alarm. Every legitimate document has it. Knowing what <b>not</b> to fear matters as much as knowing what to fear (Stage 12.2).") },
    { id: "kyc", label: T("“投资前需完成 KYC”", "“KYC required before investing”"), flag: false,
      why: T("无辜元素：KYC 是合规的标配（阶段 7.1）。它反而说明有人在认真对待身份与制裁筛查。", "Innocent: KYC is standard compliance (Stage 7.1). If anything it suggests someone takes identity and sanctions screening seriously.") },
    { id: "fees", label: T("费用页：管理费 0.35%/年", "Fees page: 0.35%/yr management fee"), flag: false,
      why: T("无辜元素：国债类产品 0.15–0.5% 属正常区间（阶段 12.2 Q5）。要警惕的是<b>多层叠加</b>后的全包成本，而非这一行本身。", "Innocent: 0.15–0.5% is the normal band for Treasury-type products (Stage 12.2 Q5). Watch the <b>all-in stack</b>, not this single line.") },
    { id: "roadmap", label: T("路线图：Q3 上线二级市场", "Roadmap: secondary market in Q3"), flag: false,
      why: T("无辜元素：路线图是计划，不是承诺，也不是红旗。它只有在与文件冲突时才变红（营销喊流动性、文件写季度赎回）。", "Innocent: a roadmap is a plan, not a promise, and not a flag. It only turns red when it contradicts the documents (marketing shouts liquidity, docs say quarterly).") },
    { id: "testimonial", label: T("用户见证：“三个月赚了 14%”", "Testimonial: “made 14% in three months”"), flag: false,
      why: T("无辜元素本身——见证不能证明也不能证伪。真正有价值的是<b>公开的赎回完成记录</b>（阶段 12.3 阶段 3）：有人真的把钱拿回去过吗？", "Innocent on its own — a testimonial proves and disproves nothing. What has value is <b>public evidence of completed redemptions</b> (Stage 12.3 Phase 3): did anyone actually get money out?") },
  ];

  const REAL = ITEMS.filter((x) => x.flag).length;
  const picked = {};

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🚩 红旗猎捕 · TerraVault 落地页（虚构）", "🚩 Red-flag hunt · TerraVault landing page (fictional)")}</div>
      <div class="demo-block" style="text-align:center;background:var(--surface-2)">
        <div style="font-size:20px;font-weight:800;color:var(--ink)">TerraVault</div>
        <div style="font-size:13px;color:var(--muted);margin-top:2px">${T("12.5% 稳定收益 · 银行级安全 · 已审计", "12.5% stable yield · bank-grade security · audited")}</div>
      </div>
      <div class="demo-block"><div class="demo-label">${T("点击你认为可疑的元素插旗。注意：错插也扣分——精确度和敏感度一样重要。", "Click the elements you find suspicious. Note: wrong flags cost points — precision matters as much as sensitivity.")}</div></div>
      <div id="rh-items"></div>
      <div class="demo-btns"><button class="demo-btn" id="rh-done">${T("✓ 提交尽调结论", "✓ Submit findings")}</button><button class="demo-btn" id="rh-reset">${T("↺ 重来", "↺ Reset")}</button></div>
      <div id="rh-result"></div>
      <p class="demo-tip">${T("尽调不是怀疑一切，是<strong>按清单逐项要证据</strong>——列表在手，段位自来。本页共有 7 面真旗、7 个无辜元素：把正常的 KYC、费率、套话当红旗，你会错过所有合规产品。", "Diligence isn't suspecting everything — it's <strong>demanding evidence item by item</strong>. This page holds 7 real flags and 7 innocent elements: treat normal KYC, fees and boilerplate as danger and you'll reject every compliant product.")}</p>
    </div>`;

  const itemsEl = root.querySelector("#rh-items"), resEl = root.querySelector("#rh-result");
  itemsEl.innerHTML = ITEMS.map((x) => `
    <div class="demo-block" data-id="${x.id}" style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:8px 10px;margin:4px 0">
      <span data-mark="${x.id}" style="font-size:15px;width:20px">◻</span>
      <span style="font-size:13px;color:var(--ink)">${x.label}</span>
    </div>`).join("");

  itemsEl.addEventListener("click", (e) => {
    const row = e.target.closest("[data-id]"); if (!row) return;
    const id = row.dataset.id; picked[id] = !picked[id];
    root.querySelector(`[data-mark="${id}"]`).textContent = picked[id] ? "🚩" : "◻";
    row.style.borderLeft = picked[id] ? "3px solid var(--orange-line)" : "";
  });

  root.querySelector("#rh-done").addEventListener("click", () => {
    let hit = 0, miss = 0, wrong = 0;
    ITEMS.forEach((x) => { if (x.flag && picked[x.id]) hit++; else if (x.flag) miss++; else if (picked[x.id]) wrong++; });
    const score = Math.max(0, hit * 2 - wrong);
    const rank = score >= 13 ? T("尽调段位：机构级——真旗全中，无误伤", "Grade: institutional — every flag caught, no false positives")
      : score >= 9 ? T("尽调段位：熟练——主要杀招都抓到了", "Grade: proficient — you caught the kill criteria")
      : score >= 5 ? T("尽调段位：入门——再跑一遍阶段 0 秒杀项", "Grade: novice — run the Phase 0 kill criteria again")
      : T("尽调段位：危险——这一页会让你亏钱", "Grade: dangerous — this page would have taken your money");
    resEl.innerHTML = `
      <div class="done-banner">${rank}　(${T("命中", "hits")} ${hit}/${REAL} · ${T("漏掉", "missed")} ${miss} · ${T("误伤", "false flags")} ${wrong})</div>
      ${ITEMS.map((x) => {
        const ok = (!!picked[x.id]) === x.flag;
        const tag = x.flag ? (picked[x.id] ? T("✓ 抓到", "✓ caught") : T("✗ 漏掉", "✗ missed")) : (picked[x.id] ? T("✗ 误伤", "✗ false flag") : T("✓ 正确放过", "✓ correctly passed"));
        const w = x.weight ? ` <b style="color:var(--red)">[${x.weight === "kill" ? T("杀", "KILL") : T("重", "MAJOR")}]</b>` : "";
        return `<div class="demo-block" style="border-left:3px solid ${ok ? "var(--green)" : "var(--red)"};margin:4px 0">
          <div style="font-size:12.5px;font-weight:700;color:var(--ink)">${tag}${w} · ${x.label}</div>
          <div style="font-size:12.5px;color:var(--muted);line-height:1.6;margin-top:3px">${x.why}</div></div>`;
      }).join("")}`;
  });

  root.querySelector("#rh-reset").addEventListener("click", () => {
    Object.keys(picked).forEach((k) => delete picked[k]);
    root.querySelectorAll("[data-mark]").forEach((m) => { m.textContent = "◻"; });
    root.querySelectorAll("[data-id]").forEach((r) => { r.style.borderLeft = ""; });
    resEl.innerHTML = "";
  });
}
