// 交互演示：枢纽对比器——先预测各枢纽在六个维度的评分，再对照模型分与真实证据；并按“我要发行 X”看哪扇门开得最大。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const AXES = [
    { k: "retail", n: T("零售可及", "Retail access") },
    { k: "inst", n: T("机构深度", "Institutional depth") },
    { k: "clarity", n: T("规则清晰", "Rule clarity") },
    { k: "pilot", n: T("官方试点力度", "Official pilot intensity") },
    { k: "stable", n: T("稳定币框架", "Stablecoin framework") },
    { k: "speed", n: T("速度", "Speed") },
  ];

  const HUBS = [
    { k: "sg", n: T("新加坡", "Singapore"), f: "🇸🇬",
      s: { retail: 2, inst: 5, clarity: 5, pilot: 5, stable: 5, speed: 4 },
      e: {
        retail: T("刻意保守：3AC/FTX 后限制零售广告、杠杆与信用卡买币。", "Deliberately conservative: post-3AC/FTX limits on retail ads, leverage and card purchases."),
        inst: T("摩根大通、UBS、DBS、Franklin 等全在 Guardian 里做真实交易。", "JPMorgan, UBS, DBS, Franklin and others all executed real trades inside Guardian."),
        clarity: T("《支付服务法》+ 2023 稳定币框架，条文明确。", "Payment Services Act plus the 2023 stablecoin framework — written and specific."),
        pilot: T("Project Guardian（2022–）+ GL1 共享机构账本倡议。", "Project Guardian (2022–) plus the GL1 shared institutional ledger initiative."),
        stable: T("2023 年 SCS 框架：全额储备 + 限期面值赎回，比 GENIUS 早两年。", "The 2023 SCS framework: full reserves plus par redemption within a deadline — two years before GENIUS."),
        speed: T("监管者与业界同城同楼，18 个月可从提案到上线。", "Regulator and industry share a city and often a building: proposal to launch in 18 months."),
      } },
    { k: "hk", n: T("香港", "Hong Kong"), f: "🇭🇰",
      s: { retail: 5, inst: 4, clarity: 4, pilot: 5, stable: 4, speed: 5 },
      e: {
        retail: T("2023 VASP 制度：持牌所可服务零售；2024 批现货 BTC/ETH ETF。", "The 2023 VASP regime lets licensed venues serve retail; spot BTC/ETH ETFs approved in 2024."),
        inst: T("汇丰 Orion 平台承载 2024 年约 60 亿港元多币种绿债。", "HSBC's Orion platform carried the ~HK$6B multi-currency green bond in 2024."),
        clarity: T("VASP + 2025 稳定币条例成文，代币化指引持续更新。", "VASP plus the 2025 stablecoin ordinance in statute, with tokenization guidance updated continuously."),
        pilot: T("政府自任发行人（2023 年 8 亿港元代币化绿债）+ Project Ensemble。", "The government became the issuer (HK$800M tokenized green bond, 2023) plus Project Ensemble."),
        stable: T("2025 年稳定币条例：法币稳定币发行需牌照。", "The 2025 stablecoin ordinance: fiat-referenced issuers must be licensed."),
        speed: T("2022 年底政策宣示 → 2023 年中制度生效，转向极快。", "Policy statement in late 2022 → regime live by mid-2023: a very fast turn."),
      } },
    { k: "jp", n: T("日本", "Japan"), f: "🇯🇵",
      s: { retail: 3, inst: 4, clarity: 5, pilot: 3, stable: 5, speed: 2 },
      e: {
        retail: T("严格但明确：交易所牌照制，杠杆受限。", "Strict but clear: licensed exchanges, capped leverage."),
        inst: T("信托银行模式发证券型代币；MUFG 的 Progmat 成为行业共用平台。", "Security tokens issued via the trust-bank model; MUFG's Progmat is shared industry infrastructure."),
        clarity: T("《金商法》修订明确电子记录移转权利的法律地位。", "FIEA amendments define the legal status of electronically recorded transferable rights."),
        pilot: T("以银行主导的平台建设为主，官方旗舰试点少于新加坡。", "Mostly bank-led platform building; fewer flagship official pilots than Singapore."),
        stable: T("2023 年生效的修法，最早给法币稳定币立法的主要经济体之一。", "Amendments effective 2023 — among the first major economies to legislate fiat stablecoins."),
        speed: T("立法严谨但周期长，共识文化下推进偏慢。", "Rigorous legislation on long cycles; consensus culture makes it slower."),
      } },
    { k: "ch", n: T("瑞士", "Switzerland"), f: "🇨🇭",
      s: { retail: 3, inst: 5, clarity: 5, pilot: 5, stable: 3, speed: 4 },
      e: {
        retail: T("不以零售为卖点，重心在机构与私人银行。", "Retail isn't the pitch; the focus is institutions and private banking."),
        inst: T("SDX：持牌数字交易所 + CSD 合一——欧盟试点制度想模仿的形态。", "SDX: a licensed digital exchange and CSD in one — the shape the EU Pilot Regime imitates."),
        clarity: T("2021 DLT 法把“账本式证券”写进《债法》，产权地基最干净。", "The 2021 DLT Act wrote ledger-based securities into the Code of Obligations — the cleanest property foundation."),
        pilot: T("Project Helvetia：真实瑞郎 wCBDC 结算真实数字债券，已生产化。", "Project Helvetia: real CHF wholesale CBDC settling real digital bonds, now in production."),
        stable: T("有稳健的银行/代币指引，但无 MiCA/GENIUS 式的统一专法。", "Solid banking and token guidance, but no single MiCA/GENIUS-style statute."),
        speed: T("法律修订高效，且直接给永久牌照而非带上限沙盒。", "Efficient amendments — and it grants permanent licenses instead of capped sandboxes."),
      } },
    { k: "ae", n: T("阿联酋", "UAE"), f: "🇦🇪",
      s: { retail: 5, inst: 3, clarity: 4, pilot: 3, stable: 3, speed: 5 },
      e: {
        retail: T("零售准入宽松，是全球加密从业者迁入热点。", "Permissive retail access; a magnet for relocating crypto operators."),
        inst: T("机构生态在快速积累，但深度不及新加坡/瑞士。", "The institutional ecosystem is building fast but isn't as deep as Singapore's or Switzerland's."),
        clarity: T("迪拜 VARA 按活动类型细分牌照；ADGM 提供普通法 + DLT 基础法。", "Dubai's VARA licenses by activity type; ADGM offers common law plus a DLT foundations regime."),
        pilot: T("地产代币化试点活跃（土地登记机关愿意配合），非央行级旗舰。", "Lively real-estate tokenization pilots (a cooperative land registry), but no central-bank flagship."),
        stable: T("有支付代币框架，规模与国际影响仍在建立中。", "A payment-token framework exists; scale and international weight are still forming."),
        speed: T("全球第一个专营虚拟资产的独立监管机构，设立与发牌都极快。", "The world's first standalone virtual-asset regulator — set up and licensing both very fast."),
      } },
    { k: "us", n: T("美国（对照组）", "US (control)"), f: "🇺🇸",
      s: { retail: 3, inst: 5, clarity: 3, pilot: 1, stable: 4, speed: 2 },
      e: {
        retail: T("分裂：现货 ETF 可买，代币化股票对散户仍未定（阶段 ∞.1）。", "Split: spot ETFs are available, retail tokenized equities remain undecided (Stage ∞.1)."),
        inst: T("全球最深资本池：BUIDL 数月做到数十亿美元，无需政府项目。", "The deepest capital pool: BUIDL reached billions in months with no government program."),
        clarity: T("历史上靠判例拼图（Howey、Ripple），2025 年起快速成文化。", "Historically a patchwork of case law (Howey, Ripple); codifying fast since 2025."),
        pilot: T("几乎没有监管者主导的旗舰试点——创新由私营部门推动。", "Almost no regulator-led flagship pilots — innovation is private-sector-led."),
        stable: T("GENIUS 法案（2025）给了联邦支付稳定币框架（阶段 4.4）。", "The GENIUS Act (2025) gave payment stablecoins a federal framework (Stage 4.4)."),
        speed: T("州+联邦双层、诉讼风险真实，改规则慢如转航母。", "State plus federal layers and real litigation risk: turning the rules is like turning a carrier."),
      } },
  ];

  const PRODUCTS = [
    { k: "fund", n: T("机构基金", "Institutional fund"), best: ["sg", "ch", "us"],
      why: T("要监管者当合作者 + 大行同台 → 新加坡（Guardian、GL1）；要最干净产权地基与央行货币结算 → 瑞士（DLT 法、SDX、Helvetia）；要最深资本与最快分销 → 美国（Reg D + ATS，阶段 11.1）。",
             "Want the regulator as collaborator and a seat beside global banks → Singapore (Guardian, GL1); want the cleanest property foundation and central-bank-money settlement → Switzerland (DLT Act, SDX, Helvetia); want deepest capital and fastest distribution → the US (Reg D + ATS, Stage 11.1).") },
    { k: "re", n: T("零售地产", "Retail real estate"), best: ["ae", "hk"],
      why: T("零售地产要两样：散户准入 + 产权登记机关配合。阿联酋两样都有（VARA + 土地局参与的产权代币化）；香港零售端开放但地产代币化仍在早期。新加坡会直接把散户挡在门外。",
             "Retail property needs two things: retail access and a cooperative land registry. The UAE has both (VARA plus Land Department title tokenization); Hong Kong is retail-open but its property tokenization is early. Singapore would simply keep retail out.") },
    { k: "stable", n: T("稳定币", "Stablecoin"), best: ["sg", "hk", "jp"],
      why: T("三套成文框架可选：新加坡 SCS（2023，最早的现代范式）、香港 2025 稳定币条例、日本 2023 修法（发行方限银行/信托/资金转移业者）。欧盟 MiCA 的 EMT 路径见阶段 11.2，美国 GENIUS 见阶段 4.4。",
             "Three written frameworks to choose from: Singapore's SCS (2023, the earliest modern template), Hong Kong's 2025 ordinance, and Japan's 2023 amendments (issuers limited to banks/trusts/transfer operators). The EU's EMT path is Stage 11.2; the US GENIUS path is Stage 4.4.") },
  ];

  let guesses = {}, revealed = false, prod = "fund", pop = null;
  HUBS.forEach((h) => { guesses[h.k] = {}; AXES.forEach((a) => { guesses[h.k][a.k] = 3; }); });

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🌏 枢纽对比器 · 先预测，再对答案", "🌏 Hub comparer · predict first, then check")}</div>
      <div class="demo-label">${T("给每个枢纽在每个维度打 1–5 分（拖动滑块），然后揭晓模型分。", "Score each hub 1–5 on each axis (drag the sliders), then reveal the model scores.")}</div>
      <div class="demo-block" id="hc-grid" style="overflow-x:auto"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="hc-reveal">${T("🔍 揭晓模型分", "🔍 Reveal model scores")}</button>
        <button class="demo-btn" id="hc-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div class="demo-block" id="hc-pop" style="display:none"></div>
      <div class="demo-block">
        <div class="demo-label">${T("我要发行：", "I want to issue:")}</div>
        <div class="demo-switch" id="hc-prod">${PRODUCTS.map((p, i) => `<button class="demo-btn${i === 0 ? " active" : ""}" data-p="${p.k}">${p.n}</button>`).join("")}</div>
        <div id="hc-prodout" style="font-size:13px;margin-top:6px"></div>
      </div>
      <p class="demo-tip">${T("监管地图是活的——但<strong>“小而开放的金融中心跑最快”</strong>这条规律，十年内都不会变。揭晓后点任意格子看真实证据（Guardian、Ensemble、Helvetia、绿债…）。", "The regulatory map is alive — but the rule that <strong>small, open financial hubs move fastest</strong> won't change this decade. After revealing, click any cell for the real evidence (Guardian, Ensemble, Helvetia, the green bonds…).")}</p>
    </div>`;

  const grid = root.querySelector("#hc-grid");
  const popEl = root.querySelector("#hc-pop");
  const prodOut = root.querySelector("#hc-prodout");

  function cellColor(v) { return v >= 5 ? "var(--green)" : v >= 4 ? "var(--orange-ink)" : v >= 3 ? "var(--muted)" : "var(--red)"; }

  function paintGrid() {
    let h = `<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:520px"><tr><th style="text-align:left;padding:4px;color:var(--muted)">${T("枢纽", "Hub")}</th>` +
      AXES.map((a) => `<th style="padding:4px;color:var(--muted);font-weight:600">${a.n}</th>`).join("") + `</tr>`;
    HUBS.forEach((hub) => {
      h += `<tr><td style="padding:4px;font-weight:600;color:var(--ink);white-space:nowrap">${hub.f} ${hub.n}</td>`;
      AXES.forEach((a) => {
        const g = guesses[hub.k][a.k], m = hub.s[a.k];
        if (!revealed) {
          h += `<td style="padding:3px;text-align:center"><input type="range" min="1" max="5" step="1" value="${g}" data-h="${hub.k}" data-a="${a.k}" style="width:56px"><div style="font-family:var(--mono);color:var(--muted)">${g}</div></td>`;
        } else {
          const diff = Math.abs(g - m);
          const mark = diff === 0 ? "✅" : diff === 1 ? "➖" : "❌";
          h += `<td style="padding:3px;text-align:center;cursor:pointer" data-cell="${hub.k}|${a.k}">
            <div style="font-family:var(--mono);font-weight:700;color:${cellColor(m)}">${m}</div>
            <div style="font-size:10px;color:var(--muted)">${T("你", "you")} ${g} ${mark}</div></td>`;
        }
      });
      h += `</tr>`;
    });
    h += `</table>`;
    grid.innerHTML = h;
    if (!revealed) {
      grid.querySelectorAll("input[type=range]").forEach((s) => s.addEventListener("input", (e) => {
        guesses[e.target.dataset.h][e.target.dataset.a] = +e.target.value;
        e.target.nextElementSibling.textContent = e.target.value;
      }));
    } else {
      grid.querySelectorAll("[data-cell]").forEach((c) => c.addEventListener("click", () => {
        const [hk, ak] = c.dataset.cell.split("|");
        const hub = HUBS.find((x) => x.k === hk), ax = AXES.find((x) => x.k === ak);
        popEl.style.display = "block";
        popEl.innerHTML = `<div class="demo-label">${hub.f} ${hub.n} · ${ax.n} · ${T("模型分", "model")} ${hub.s[ak]}/5</div>
          <div style="font-size:13px;color:var(--ink)">${hub.e[ak]}</div>`;
      }));
    }
  }

  function paintProd() {
    const p = PRODUCTS.find((x) => x.k === prod);
    prodOut.innerHTML = `<div style="margin-bottom:6px">${p.best.map((k) => {
      const hub = HUBS.find((x) => x.k === k);
      return `<span style="display:inline-block;padding:3px 8px;margin:2px;border-radius:6px;background:var(--green-soft);border:1px solid var(--line);font-weight:600">${hub.f} ${hub.n}</span>`;
    }).join("")}</div><div style="color:var(--muted)">${p.why}</div>`;
  }

  root.querySelector("#hc-reveal").addEventListener("click", () => {
    revealed = true;
    let hit = 0, tot = 0;
    HUBS.forEach((h) => AXES.forEach((a) => { tot++; if (guesses[h.k][a.k] === h.s[a.k]) hit++; }));
    paintGrid();
    popEl.style.display = "block";
    popEl.innerHTML = `<div class="done-banner">${T(`✅ 完全命中 ${hit}/${tot} 格。点任意格子看真实证据。`, `✅ Exact matches: ${hit}/${tot}. Click any cell for the real evidence.`)}</div>`;
  });
  root.querySelector("#hc-reset").addEventListener("click", () => {
    revealed = false; popEl.style.display = "none";
    HUBS.forEach((h) => AXES.forEach((a) => { guesses[h.k][a.k] = 3; }));
    paintGrid();
  });
  root.querySelectorAll("#hc-prod [data-p]").forEach((b) => b.addEventListener("click", () => {
    prod = b.dataset.p;
    root.querySelectorAll("#hc-prod [data-p]").forEach((x) => x.classList.toggle("active", x.dataset.p === prod));
    paintProd();
  }));

  paintGrid();
  paintProd();
}
