// 交互演示：请求权链条探索器——选一个真实产品，逐层点开“你→代币→凭证→实体→资产→托管”，或并排对比四条链。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const P = {
    buidl: {
      name: "BUIDL", identity: T("股东", "Shareholder"), idCol: "var(--green)",
      layers: [
        { t: T("你", "You"), what: T("合格购买者（Reg D，最低 $5M）", "Qualified Purchaser (Reg D, $5M min)"), doc: T("认购协议 + KYC", "Subscription agreement + KYC"), brk: T("KYC 未过 → 地址收不到代币", "Fail KYC → address can't receive tokens") },
        { t: T("代币", "Token"), what: T("链上余额，与股东名册同步", "On-chain balance, synced with the register"), doc: T("Securitize 过户代理协议", "Securitize transfer-agent agreement"), brk: T("链与名册脱钩（阶段 5.3）", "Chain/register desync (Stage 5.3)") },
        { t: T("法律凭证：基金份额", "Instrument: fund share"), what: T("你是这只基金的股东", "You are a shareholder of the fund"), doc: T("基金章程 / 发行备忘录", "Fund constitution / offering memo"), brk: T("条款里的赎回门槛与暂停权", "Redemption gates & suspension terms"), key: true },
        { t: T("发行实体", "Entity"), what: T("BVI 注册的 BlackRock 数字流动性基金", "BVI-incorporated BlackRock digital liquidity fund"), doc: T("BVI 基金注册文件", "BVI fund registration"), brk: T("管理人失灵 → 可换管理人", "Manager failure → manager replaceable") },
        { t: T("资产", "Asset"), what: T("现金 + 短期国债 + 回购", "Cash + short-term Treasuries + repo"), doc: T("投资管理协议", "Investment management agreement"), brk: T("资产本身几乎无信用风险", "Asset itself: minimal credit risk") },
        { t: T("托管处", "Custody"), what: T("纽约梅隆银行（BNY Mellon）", "BNY Mellon"), doc: T("托管协议", "Custody agreement"), brk: T("托管行操作/破产风险（受监管隔离）", "Custodian ops/bankruptcy risk (regulated segregation)") },
      ],
    },
    usdy: {
      name: "USDY", identity: T("债权人", "Creditor"), idCol: "var(--orange-ink)",
      layers: [
        { t: T("你", "You"), what: T("非美国人（Reg S），铸后锁 40+ 天", "Non-US person (Reg S), 40+ day lock"), doc: T("购买协议", "Purchase agreement"), brk: T("美国人持有 → 违反发行条件", "US person holding → breaches offering terms") },
        { t: T("代币", "Token"), what: T("代币化的借据，赎回价每日上涨", "Tokenized IOU, redemption price rises daily"), doc: T("代币条款", "Token terms"), brk: T("转让限制期内无法卖出", "Can't sell during the lock") },
        { t: T("法律凭证：有担保本票", "Instrument: secured note"), what: T("你借钱给发行方，是有担保债权人", "You lent to the issuer — a secured creditor"), doc: T("票据契约 + 担保协议", "Note indenture + security agreement"), brk: T("违约后走处置程序，以月计", "Default → collateral process, months"), key: true },
        { t: T("发行实体", "Entity"), what: T("Ondo USDY LLC（专设发行公司）", "Ondo USDY LLC (dedicated issuer)"), doc: T("LLC 设立文件", "LLC formation docs"), brk: T("发行方违约 → 触发加速到期（阶段 5.4）", "Issuer default → acceleration (Stage 5.4)") },
        { t: T("资产", "Asset"), what: T("短期国债 + 银行存款（担保品）", "Short-term Treasuries + bank deposits (collateral)"), doc: T("担保品清单", "Collateral schedule"), brk: T("担保品缩水 → 按比例受偿", "Collateral shortfall → pro-rata recovery") },
        { t: T("托管处", "Custody"), what: T("担保代理人 Ankura 监督的账户", "Accounts overseen by collateral agent Ankura"), doc: T("担保代理协议（第一顺位）", "Collateral agency agreement (first priority)"), brk: T("代理人替持有人没收、变卖担保品", "Agent seizes & liquidates for holders") },
      ],
    },
    paxg: {
      name: "PAXG", identity: T("物权人", "Title holder"), idCol: "var(--green)",
      layers: [
        { t: T("你", "You"), what: T("KYC 通过的持有人", "KYC-passed holder"), doc: T("Paxos 用户协议", "Paxos user agreement"), brk: T("赎实物有最低量与手续费", "Physical redemption: minimums & fees") },
        { t: T("代币", "Token"), what: T("1 枚 = 1 金衡盎司已分配实物金", "1 token = 1 fine troy oz, allocated"), doc: T("PAXG 条款", "PAXG terms"), brk: T("可查金条序列号", "Bar serial number is queryable") },
        { t: T("法律凭证：物权", "Instrument: title"), what: T("对具体金条具体部分的所有权", "Ownership of a specific part of a specific bar"), doc: T("NYDFS 信托框架", "NYDFS trust framework"), brk: T("金子不进 Paxos 破产财产", "Gold sits outside a Paxos estate"), key: true },
        { t: T("发行实体", "Entity"), what: T("Paxos 信托公司（NYDFS 监管）", "Paxos Trust Company (NYDFS-regulated)"), doc: T("信托牌照", "Trust charter"), brk: T("链条极短：实体不“持有”你的金子", "Ultra-short chain: entity doesn't own your gold") },
        { t: T("资产", "Asset"), what: T("伦敦合格交割金条", "London Good Delivery bars"), doc: T("分配记录", "Allocation records"), brk: T("金价波动是你唯一的“收益”", "Gold price is your only 'yield'") },
        { t: T("托管处", "Custody"), what: T("伦敦专业金库", "Professional London vaults"), doc: T("金库托管协议", "Vault custody agreement"), brk: T("金库失窃/欺诈（有保险与稽核）", "Vault theft/fraud (insured & audited)") },
      ],
    },
    realt: {
      name: "RealT", identity: T("LLC 成员", "LLC member"), idCol: "var(--red)",
      layers: [
        { t: T("你", "You"), what: T("非美国人为主，~$50 一份", "Mostly non-US persons, ~$50 fractions"), doc: T("认购协议", "Subscription agreement"), brk: T("基本无赎回，只能二级找买家", "No redemption — find a buyer yourself") },
        { t: T("代币", "Token"), what: T("每周以 USDC 分租金", "Weekly rent paid in USDC"), doc: T("代币条款", "Token terms"), brk: T("流动性稀薄（阶段 9.2）", "Thin liquidity (Stage 9.2)") },
        { t: T("法律凭证：成员权益", "Instrument: membership units"), what: T("你是这栋房子专属 LLC 的成员", "You're a member of this house's own LLC"), doc: T("LLC 运营协议", "LLC operating agreement"), brk: T("四种凭证里保护最少", "Fewest built-in protections of the four"), key: true },
        { t: T("发行实体", "Entity"), what: T("一栋房一个系列（series LLC）", "One series per house (series LLC)"), doc: T("系列设立文件", "Series designation"), brk: T("运营方倒了，谁管房子？", "Operator dies — who manages the house?") },
        { t: T("资产", "Asset"), what: T("一栋底特律出租屋", "One Detroit rental house"), doc: T("房产地契（登记在 LLC 名下）", "Deed (registered to the LLC)"), brk: T("空置、维修直接吃掉收益", "Vacancy & repairs eat the yield") },
        { t: T("托管处", "Custody"), what: T("县产权登记处 + 物业管理方", "County registry + property manager"), doc: T("物业管理合同", "Property management contract"), brk: T("“代币没事，房子很麻烦”", "'Token fine, asset messy'") },
      ],
    },
  };

  let cur = "buidl", sel = 2, compare = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔗 请求权链条探索器：顺着链条摸到资产", "🔗 Claim-chain explorer: trace it to the asset")}</div>
      <div class="demo-switch" id="cc-prods">
        ${Object.keys(P).map((k) => `<button class="demo-btn" data-p="${k}">${P[k].name}</button>`).join("")}
        <button class="demo-btn" data-p="__cmp">${T("⇄ 四链对比", "⇄ Compare all 4")}</button>
      </div>
      <div id="cc-body"></div>
      <p class="demo-tip">${T("专家的第一反应永远是<strong>“顺着链条摸到资产”</strong>。点每一层看：它是什么、哪份文件创造它、会在哪断。同样的代币，第 3 层不同，你的法律身份就完全不同。", "An expert's first reflex is always to <strong>trace the chain down to the asset</strong>. Click each layer: what it is, which document creates it, where it can break. Same-looking tokens — but a different Layer 3 gives you a completely different legal identity.")}</p>
    </div>`;

  const body = root.querySelector("#cc-body");

  function paintChain() {
    const p = P[cur];
    const L = p.layers;
    let html = `<div class="demo-block"><div class="demo-label">${p.name} — ${T("你的身份：", "Your identity: ")}<b style="color:${p.idCol}">${p.identity}</b></div>`;
    L.forEach((l, i) => {
      const on = i === sel;
      html += `<div data-i="${i}" style="cursor:pointer;margin:4px 0;padding:8px 10px;border-radius:8px;border:1px solid ${on ? "var(--orange-line)" : "var(--line)"};background:${l.key ? "var(--orange-soft)" : on ? "var(--surface-2)" : "transparent"}">
        <div style="font-weight:${l.key || on ? "700" : "500"};color:${l.key ? "var(--orange-ink)" : "var(--ink)"};font-size:13px">${i + 1}. ${l.t}${l.key ? " ★" : ""}</div>
        ${on ? `<div style="font-size:12px;color:var(--muted);margin-top:6px">🧾 ${T("这一层是什么", "What this layer is")}：<span style="color:var(--ink)">${l.what}</span></div>
        <div style="font-size:12px;color:var(--muted)">📜 ${T("哪份文件创造它", "Document that creates it")}：<span style="color:var(--ink)">${l.doc}</span></div>
        <div style="font-size:12px;color:var(--muted)">⚡ ${T("会在哪断", "Where it can break")}：<span style="color:var(--red)">${l.brk}</span></div>` : ""}
      </div>`;
      if (i < L.length - 1) html += `<div style="text-align:center;color:var(--muted);font-size:11px;line-height:1">↓</div>`;
    });
    html += `</div>`;
    body.innerHTML = html;
    body.querySelectorAll("[data-i]").forEach((el) => el.addEventListener("click", () => { sel = +el.dataset.i; paintChain(); }));
  }

  function paintCompare() {
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px">`;
    Object.keys(P).forEach((k) => {
      const p = P[k];
      html += `<div class="demo-block" style="margin:0">
        <div style="font-weight:700;color:var(--ink)">${p.name}</div>
        <div style="font-size:12px;margin:2px 0 6px">${T("身份", "Identity")}：<b style="color:${p.idCol}">${p.identity}</b></div>
        ${p.layers.map((l, i) => `<div style="font-size:11px;padding:4px 6px;margin:3px 0;border-radius:6px;border:1px solid var(--line);background:${l.key ? "var(--orange-soft)" : "var(--surface-2)"};color:${l.key ? "var(--orange-ink)" : "var(--muted)"};font-weight:${l.key ? "700" : "400"}">${i + 1}. ${l.t}</div>`).join("")}
      </div>`;
    });
    html += `</div><div class="done-banner" style="margin-top:8px">${T("BUIDL=股东 · USDY=债权人 · PAXG=物权 · RealT=LLC 成员——第 3 层（★）决定破产那天你排哪个队。", "BUIDL=shareholder · USDY=creditor · PAXG=title · RealT=LLC member — Layer 3 (★) decides your queue on bankruptcy day.")}</div>`;
    body.innerHTML = html;
  }

  function paint() { compare ? paintCompare() : paintChain(); }

  root.querySelectorAll("[data-p]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.p === "__cmp") { compare = true; } else { compare = false; cur = b.dataset.p; sel = 2; }
      root.querySelectorAll("[data-p]").forEach((x) => x.classList.toggle("active", x.dataset.p === (compare ? "__cmp" : cur)));
      paint();
    }));

  root.querySelector('[data-p="buidl"]').classList.add("active");
  paint();
}
