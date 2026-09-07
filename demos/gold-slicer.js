// 交互演示：黄金切片机——按克买 PAXG 看金条分配与请求权链，再跑 5/10/20 年持有成本竞速，附“无分配账户危机”开关。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 虚构但写实的金库清单（序列号查询体验）
  const BAR = { no: "PX-4471-B", refiner: "Valcambi 2019", oz: 402.35, vault: T("Brink's 伦敦金库", "Brink's London vault") };
  const OZ_G = 31.1035, PRICE_G = 108; // 约 $3,350/oz 量级
  let grams = 20, years = 10, crisis = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🥇 黄金切片机 · 与持有成本竞速", "🥇 Gold slicer · and the holding-cost race")}</div>
      <div class="demo-block">
        <label class="demo-label">${T("买入克数", "Grams to buy")}：<b id="gs-g">20 g</b>（<span id="gs-cost"></span>）</label>
        <input class="demo-slider" id="gs-grams" type="range" min="1" max="200" step="1" value="20" />
        <div id="gs-bar" style="margin-top:8px"></div>
        <div class="demo-label" style="margin-top:8px">${T("请求权链（无“发行方欠你”一环）", "Claim chain (no “issuer owes you” link)")}：</div>
        <div style="font-family:var(--mono);font-size:12px;color:var(--ink)" id="gs-chain"></div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("💰 持有成本竞速：$10,000 敞口，金价不变，只比成本", "💰 Holding-cost race: $10,000 exposure, flat gold price, costs only")}</div>
        <div class="demo-switch">${T("持有年限：", "Horizon: ")}
          <button class="demo-btn" data-y="5">5${T("年", "y")}</button>
          <button class="demo-btn active" data-y="10">10${T("年", "y")}</button>
          <button class="demo-btn" data-y="20">20${T("年", "y")}</button>
        </div>
        <div id="gs-race"></div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="gs-crisis">${T("⚠ 无分配账户危机：银行倒闭那天", "⚠ Unallocated crisis: the day the bank fails")}</button>
      </div>
      <div id="gs-crisis-out"></div>
      <p class="demo-tip">${T("黄金教科书级地示范了 RWA 的黄金法则——<strong>托管与鉴定的“信任桥”越老越硬，代币化就越顺</strong>。再看竞速图：GLD 那 0.4%/年是天天从净值里刮的复利损耗。", "Gold is the textbook demo of RWA's golden rule — <strong>the older and harder the custody-and-assay trust bridge, the smoother the tokenization</strong>. And watch the race: GLD's 0.4%/yr is a compounding drag scraped from NAV daily.")}</p>
    </div>`;

  const fmt = (v) => "$" + Math.round(v).toLocaleString("en-US");

  function paintSlice() {
    const barG = BAR.oz * OZ_G;
    const pct = Math.min(100, (grams / barG) * 100);
    root.querySelector("#gs-g").textContent = grams + " g";
    root.querySelector("#gs-cost").textContent = "≈ " + fmt(grams * PRICE_G) + T("，即 ", ", i.e. ") + (grams / OZ_G).toFixed(4) + " PAXG";
    root.querySelector("#gs-bar").innerHTML = `
      <div class="demo-label">${T("你的克数分配在这根条上（序列号查询返回）：", "Your grams are allocated on this bar (serial lookup):")}</div>
      <div style="border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--surface-2)">
        <div style="font-family:var(--mono);font-size:12px;color:var(--ink)">🧱 ${T("条号", "Bar")} <b>${BAR.no}</b> · ${BAR.refiner} · ${BAR.oz} oz (${Math.round(barG).toLocaleString("en-US")} g) · ${BAR.vault}</div>
        <div style="height:14px;border-radius:7px;background:var(--surface-2);border:1px solid var(--line);margin-top:6px;overflow:hidden">
          <div style="height:100%;width:${Math.max(pct, 0.5)}%;background:var(--orange-ink)"></div>
        </div>
        <div class="demo-label">${T("你的份额", "Your slice")}: ${pct.toFixed(2)}%${T("（可切到小数点后 18 位）", " (divisible to 18 decimals)")}</div>
      </div>`;
    root.querySelector("#gs-chain").textContent =
      T("你 → PAXG 代币 → Paxos 信托（受 NYDFS 监管的保管人） → ", "You → PAXG token → Paxos Trust (NYDFS-regulated bailee) → ") + BAR.vault + " · " + BAR.no;
  }

  function paintRace() {
    const base = 10000;
    const rows = [
      { name: "PAXG", note: T("零年费（~0.02% 转账费）", "no annual fee (~0.02% transfer)"), v: base * 0.998, color: "var(--orange-ink)" },
      { name: "GLD ETF", note: T("0.40%/年 复利损耗", "0.40%/yr compounding drag"), v: base * Math.pow(1 - 0.004, years), color: "var(--ink)" },
      { name: T("金币+保险柜", "Coins + safe"), note: T("5% 溢价 + $100/年", "5% premium + $100/yr"), v: base * 0.95 - 100 * years, color: "var(--muted)" },
      { name: T("期货长持", "Futures held long"), note: T("展期成本 ~0.5%/年", "roll cost ~0.5%/yr"), v: base * Math.pow(1 - 0.005, years), color: "var(--muted)" },
    ].sort((a, b) => b.v - a.v);
    const max = rows[0].v;
    root.querySelector("#gs-race").innerHTML = rows.map((r, i) => `
      <div style="margin:6px 0">
        <div style="display:flex;justify-content:space-between;font-size:12px"><span>${i === 0 ? "🏆 " : ""}<b>${r.name}</b> <span class="demo-label" style="display:inline">${r.note}</span></span><b style="color:${r.v < base * 0.93 ? "var(--red)" : "var(--green)"}">${fmt(r.v)}</b></div>
        <div style="height:10px;border-radius:5px;background:var(--surface-2);border:1px solid var(--line);overflow:hidden"><div style="height:100%;width:${(r.v / max) * 100}%;background:${r.color};transition:width .4s"></div></div>
      </div>`).join("") +
      `<div class="demo-label" style="margin-top:6px">${T("第 " + years + " 年：GLD 被刮走 ", "Year " + years + ": GLD has lost ")}<b>${fmt(base - base * Math.pow(1 - 0.004, years))}</b>${T("——每天从净值里扣，你从没见过账单。", " — scraped from NAV daily; you never saw a bill.")}</div>`;
  }

  function paintCrisis() {
    root.querySelector("#gs-crisis-out").innerHTML = !crisis ? "" : `
      <div class="demo-warn" style="margin-top:8px">
        <b>${T("🏦 托管银行倒闭了。两种持有人，两种结局：", "🏦 The custodian bank has failed. Two holders, two endings:")}</b><br>
        ✅ ${T("<b>有分配</b>（PAXG 式）：金条编号在你名下，金子不是银行财产、不进破产财产——指着 " + BAR.no + " 把条领走。", "<b>Allocated</b> (PAXG-style): bars are earmarked by serial to you; the gold was never the bank's property and stays out of the estate — point at " + BAR.no + " and take your bar.")}<br>
        ⛔ ${T("<b>无分配</b>：账户里那个“100 g”只是银行的欠条。你排进无担保债权人队伍，按比例分渣，等几年——阶段 5.2 的隔离课，一夜之间从理论变成现金。", "<b>Unallocated</b>: that “100 g” in your account was just the bank's IOU. You join the unsecured-creditor queue for pro-rata scraps, for years — Stage 5.2's segregation lesson turns from theory into cash overnight.")}
      </div>`;
  }

  root.querySelector("#gs-grams").addEventListener("input", (e) => { grams = parseInt(e.target.value); paintSlice(); });
  root.querySelectorAll("[data-y]").forEach((b) => b.addEventListener("click", () => {
    years = parseInt(b.dataset.y);
    root.querySelectorAll("[data-y]").forEach((x) => x.classList.toggle("active", x === b));
    paintRace();
  }));
  root.querySelector("#gs-crisis").addEventListener("click", (e) => { crisis = !crisis; e.target.classList.toggle("active", crisis); paintCrisis(); });

  paintSlice(); paintRace();
}
