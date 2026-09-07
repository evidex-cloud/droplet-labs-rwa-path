// 交互演示：MiCA 分类映射器——走决策树，把 6 个代币放进正确的规则盒子，看牌照与护照权，并对照美国分析。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const Q = {
    fi: T("① 它是 MiFID II 意义上的“金融工具”吗？（可转让证券 / 基金份额 / 衍生品）",
          "① Is it a MiFID II \"financial instrument\"? (transferable security / fund unit / derivative)"),
    peg: T("② 它锚定价值吗？锚定什么？", "② Does it reference a value — and what?"),
  };

  const BOXES = {
    mifid: {
      label: T("传统证券法（MiCA 不管！）", "Traditional securities law (NOT MiCA!)"),
      reg: T("成员国证券监管机构 + ESMA", "National securities regulator + ESMA"),
      lic: T("招股书（或豁免：合格投资者 / <150 人 / ≥€100k 面额 / <€8M）；场所需 MiFID 牌照或 DLT 试点牌照", "Prospectus (or an exemption: qualified investors / <150 persons / ≥€100k denominations / <€8M); venues need a MiFID or DLT Pilot license"),
      pass: T("招股书护照：一国批准，全欧发行", "Prospectus passport: approved in one state, offer EU-wide"),
      color: "var(--orange-soft)",
    },
    emt: {
      label: T("MiCA · EMT（电子货币代币）", "MiCA · EMT (e-money token)"),
      reg: T("成员国央行/金融监管机构（重大 EMT 加码 EBA）", "National central bank / financial regulator (EBA for significant EMTs)"),
      lic: T("电子货币机构或信用机构牌照；1:1 储备、随时面值赎回、禁止付息", "E-money or credit institution license; 1:1 reserves, redemption at par on demand, no interest"),
      pass: T("✅ 护照通行 27 国（Circle 法国 EMI 牌照即此路）", "✅ Passports across 27 states (Circle's French EMI license took this road)"),
      color: "var(--green-soft)",
    },
    art: {
      label: T("MiCA · ART（资产参照代币）", "MiCA · ART (asset-referenced token)"),
      reg: T("成员国监管机构 + EBA（重大 ART）", "National regulator + EBA (significant ARTs)"),
      lic: T("事前授权 + 白皮书批准；储备、治理、赎回义务最严——Libra 的心理阴影", "Prior authorization + approved whitepaper; the strictest reserve, governance and redemption duties — Libra's scar tissue"),
      pass: T("✅ 护照通行，但重大 ART 受额外限制", "✅ Passports, but significant ARTs face extra limits"),
      color: "var(--red-soft)",
    },
    other: {
      label: T("MiCA · 其它加密资产", "MiCA · Other crypto-assets"),
      reg: T("成员国监管机构", "National regulator"),
      lic: T("发布白皮书并通知监管（无需事前批准），对误导性陈述负责", "Publish a whitepaper and notify the regulator (no prior approval); liability for misleading statements"),
      pass: T("✅ 白皮书通知后可全欧发售", "✅ Offer EU-wide after whitepaper notification"),
      color: "var(--surface-2)",
    },
    depends: {
      label: T("视情况（可能落在 MiCA 之外）", "It depends (may fall outside MiCA)"),
      reg: T("视具体设计而定", "Depends on the specific design"),
      lic: T("独一无二、不可替代的 NFT 原则上不适用 MiCA；但成系列大批量发行、或实质是金融工具/份额化的，会被重新归类", "Genuinely unique, non-fungible NFTs are out of MiCA's scope in principle; large fungible series, or anything substantively a financial instrument or fractionalized, gets reclassified"),
      pass: T("无统一护照——按重新归类的结果走", "No single passport — follow whatever box it's reclassified into"),
      color: "var(--surface-2)",
    },
  };

  const TOKENS = [
    { n: T("代币化债券", "Tokenized bond"), i: "📜", fi: true, box: "mifid",
      why: T("债券就是可转让证券——链只是记录技术。MiCA 一个字都不管。", "A bond is a transferable security — the chain is just recording tech. MiCA says nothing about it."),
      us: T("美国：Howey 四条全中 → 证券 → Reg D/S + ATS 交易（阶段 11.1）。", "US: all four Howey prongs hit → security → Reg D/S + ATS trading (Stage 11.1).") },
    { n: T("USDC 类 EMT", "USDC-type EMT"), i: "💵", fi: false, peg: "single", box: "emt",
      why: T("锚定单一法币 → EMT 盒子：电子货币逻辑，1:1 储备、面值赎回。", "Pegged to a single fiat currency → the EMT box: e-money logic, 1:1 reserves, redemption at par."),
      us: T("美国：无获利预期 → 非证券 → GENIUS 法案支付稳定币框架（阶段 4.4）。", "US: no profit expectation → not a security → the GENIUS Act payment-stablecoin framework (Stage 4.4).") },
    { n: T("一篮子稳定币 ART", "Basket stablecoin (ART)"), i: "🧺", fi: false, peg: "basket", box: "art",
      why: T("参照一篮子资产 → ART：MiCA 里最严的一格。", "References a basket → ART: MiCA's strictest box."),
      us: T("美国：GENIUS 只覆盖单一法币支付稳定币；一篮子设计可能被按证券或商品分析。", "US: GENIUS covers single-fiat payment stablecoins only; a basket design may get analyzed as a security or a commodity.") },
    { n: T("治理代币", "Governance token"), i: "🗳️", fi: false, peg: "none", box: "other",
      why: T("不锚定价值、也不是金融工具 → “其它加密资产”：白皮书 + 责任。", "No value peg and not a financial instrument → \"other crypto-assets\": whitepaper + liability."),
      us: T("美国：逐案分析——若有团队运营与获利预期，Howey 可能全中（阶段 11.1）。", "US: case by case — with an operating team and profit expectation, all four Howey prongs may hit (Stage 11.1).") },
    { n: T("代币化基金份额", "Tokenized fund share"), i: "🏦", fi: true, box: "mifid",
      why: T("基金份额是 MiFID 金融工具（UCITS/AIF 另有整套规则）→ 传统证券法。", "A fund unit is a MiFID financial instrument (with the UCITS/AIF rulebooks on top) → traditional securities law."),
      us: T("美国：教科书级证券——BUIDL 走 Reg D，只卖合格购买者（阶段 10.1）。", "US: textbook security — BUIDL went Reg D, Qualified Purchasers only (Stage 10.1).") },
    { n: T("NFT 艺术品", "NFT artwork"), i: "🎨", fi: false, peg: "none-nft", box: "depends",
      why: T("真正独一无二的 NFT 原则上在 MiCA 之外；但大批量同质系列或份额化就会被重新归类。", "A genuinely unique NFT is outside MiCA in principle; a large fungible series or a fractionalized one gets reclassified."),
      us: T("美国：艺术品收藏通常非证券；但份额化 + 收益承诺会触发 Howey。", "US: collectible art is usually not a security; fractionalize it and promise returns and Howey triggers.") },
  ];

  let idx = 0, step = 0, wrong = 0, done = 0;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🗺️ MiCA 分类映射器 · 走一遍决策树", "🗺️ MiCA classification mapper · walk the decision tree")}</div>
      <div class="demo-switch" id="mm-tabs"></div>
      <div class="demo-block" id="mm-q"></div>
      <div class="demo-block" id="mm-res" style="display:none"></div>
      <p class="demo-tip">${T("欧盟先画格子后放行——记住那条分界线：<strong>是金融工具的，MiCA 根本不管</strong>。再看每张卡片底部的“同一产品在美国”，双轨思维才是专家技能。", "The EU draws the boxes first and opens the gates second — remember the boundary: <strong>if it's a financial instrument, MiCA doesn't touch it</strong>. Then read each card's \"same product in the US\" line: dual-track thinking is the expert skill.")}</p>
    </div>`;

  const tabs = root.querySelector("#mm-tabs");
  const qEl = root.querySelector("#mm-q");
  const resEl = root.querySelector("#mm-res");

  function paintTabs() {
    tabs.innerHTML = TOKENS.map((t, i) =>
      `<button class="demo-btn${i === idx ? " active" : ""}" data-t="${i}">${t.i} ${t.n}</button>`).join("");
    tabs.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => {
      idx = +b.dataset.t; step = 0; resEl.style.display = "none"; paintTabs(); paint();
    }));
  }

  function opt(v, label) { return `<button class="demo-btn" data-o="${v}">${label}</button>`; }

  function landing() {
    const t = TOKENS[idx], b = BOXES[t.box];
    resEl.style.display = "block";
    resEl.innerHTML = `
      <div style="padding:10px;border:1px solid var(--line);border-radius:8px;background:${b.color}">
        <div style="font-weight:700;color:var(--ink)">${t.i} ${t.n} → ${b.label}</div>
        <div style="font-size:13px;color:var(--muted);margin-top:6px">${t.why}</div>
      </div>
      <div style="margin-top:8px;font-size:13px"><b>${T("监管者", "Regulator")}：</b>${b.reg}</div>
      <div style="margin-top:4px;font-size:13px"><b>${T("需要什么", "What you need")}：</b>${b.lic}</div>
      <div style="margin-top:4px;font-size:13px"><b>${T("护照权", "Passport rights")}：</b>${b.pass}</div>
      <div style="margin-top:10px;padding:8px;border-left:3px solid var(--orange-line);background:var(--surface-2);font-size:13px">
        <b style="color:var(--orange-ink)">${T("同一产品在美国 →", "Same product in the US →")}</b> ${t.us}</div>`;
    qEl.innerHTML = `<div class="done-banner">${T(`✅ 归位完成（本轮走错 ${wrong} 次）。已走完 ${done}/6 个代币。`, `✅ Landed (${wrong} wrong turns this round). ${done}/6 tokens walked.`)}</div>`;
  }

  function paint() {
    const t = TOKENS[idx];
    resEl.style.display = "none";
    if (step === 0) {
      qEl.innerHTML = `<div class="demo-label">${t.i} ${t.n}</div><div style="font-weight:600;color:var(--ink);margin:6px 0">${Q.fi}</div>
        <div class="demo-btns">${opt("y", T("是，是金融工具", "Yes — a financial instrument"))}${opt("n", T("否", "No"))}</div>
        <div id="mm-fb" style="font-size:13px;margin-top:6px"></div>`;
      qEl.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => {
        const said = b.dataset.o === "y";
        if (said === t.fi) {
          if (t.fi) { done++; landing(); } else { step = 1; paint(); }
        } else {
          wrong++;
          qEl.querySelector("#mm-fb").innerHTML = t.fi
            ? `<span style="color:var(--red)">❌ ${T("再想想：债券、股票、基金份额本身就是可转让证券/金融工具——代币化不改变它的法律性质。", "Think again: bonds, shares and fund units ARE transferable securities / financial instruments — tokenizing them doesn't change their legal nature.")}</span>`
            : `<span style="color:var(--red)">❌ ${T("边界规则：稳定币、治理代币、NFT 都不是 MiFID 金融工具——它们才是 MiCA 要管的部分。", "Boundary rule: stablecoins, governance tokens and NFTs are not MiFID financial instruments — they're exactly what MiCA is for.")}</span>`;
        }
      }));
    } else {
      qEl.innerHTML = `<div class="demo-label">${t.i} ${t.n}</div><div style="font-weight:600;color:var(--ink);margin:6px 0">${Q.peg}</div>
        <div class="demo-btns">${opt("single", T("锚定单一法币", "Pegged to one fiat currency"))}${opt("basket", T("参照一篮子资产", "References a basket"))}${opt("none", T("不锚定任何价值", "No value reference"))}${opt("none-nft", T("不锚定，且独一无二不可替代", "No peg, and genuinely unique"))}</div>
        <div id="mm-fb" style="font-size:13px;margin-top:6px"></div>`;
      qEl.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.o === t.peg) { done++; landing(); }
        else {
          wrong++;
          qEl.querySelector("#mm-fb").innerHTML = `<span style="color:var(--red)">❌ ${T("分界规则：单一法币 → EMT；一篮子 → ART（最严）；都不是 → 其它加密资产；真正独一无二的 NFT → 原则上在 MiCA 之外。", "Boundary rule: single fiat → EMT; a basket → ART (strictest); neither → other crypto-assets; a genuinely unique NFT → outside MiCA in principle.")}</span>`;
        }
      }));
    }
  }

  paintTabs();
  paint();
}
