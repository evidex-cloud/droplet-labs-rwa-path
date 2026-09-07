// 交互演示：现金流机器——股票 / 债券 / 基金份额三种请求权的现金流时间线；债券页用真实折现公式实时定价。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  let tab = "bond";
  let rate = 6, years = 10; // 债券页：市场利率 %、剩余年限
  const COUPON = 5, FACE = 100; // 固定票息 5%、面值 $100

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("💵 现金流机器：三种请求权，三条时间线", "💵 The cash-flow machine: three claims, three timelines")}</div>
      <div class="demo-switch">${T("凭证类型：", "Instrument: ")}
        <button class="demo-btn" data-tab="stock">${T("股票", "Stock")}</button>
        <button class="demo-btn" data-tab="bond">${T("债券", "Bond")}</button>
        <button class="demo-btn" data-tab="fund">${T("基金份额", "Fund share")}</button>
      </div>
      <div id="cm-body"></div>
      <p class="demo-tip">${T("在债券页把“市场利率”从 5% 拨到 8%：价格从 $100 一路跌穿 $80——<strong>利率升、旧债跌</strong>，这是折现除法的必然。记住这条反比关系——阶段 4.3 里它弄倒了一家银行。", "On the bond tab, drag “market rate” from 5% to 8%: price slides from $100 down through $80 — <strong>rates up, old bonds down</strong>, pure discounting arithmetic. Remember this inverse — in Stage 4.3 it topples a bank.")}</p>
    </div>`;

  const body = root.querySelector("#cm-body");

  function bars(items, maxV) {
    // items: [{label, v, color, note}] → 简易时间线柱状图
    return `<div style="display:flex;align-items:flex-end;gap:4px;height:110px;padding:8px 2px 0;overflow-x:auto">` +
      items.map((it) => `
        <div style="flex:1;min-width:22px;display:flex;flex-direction:column;align-items:center;gap:3px">
          <div style="font-size:10px;color:${it.color};font-weight:600;font-family:var(--mono)">${it.note}</div>
          <div style="width:100%;max-width:34px;height:${Math.max(3, (it.v / maxV) * 78)}px;background:${it.color};border-radius:4px 4px 0 0;opacity:.85"></div>
          <div style="font-size:9px;color:var(--muted)">${it.label}</div>
        </div>`).join("") + `</div>`;
  }

  function bondPrice(r, T_) {
    let p = 0;
    for (let t = 1; t <= T_; t++) p += COUPON / Math.pow(1 + r, t);
    return p + FACE / Math.pow(1 + r, T_);
  }

  function paint() {
    root.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    if (tab === "stock") {
      const divs = [1.2, 0, 2.0, 2.4, 0, 3.1, 3.5, 4.2];
      const items = divs.map((v, i) => ({ label: T("第", "Y") + (i + 1) + T("年", ""), v: v || 0.2, color: v ? "var(--green)" : "var(--red)", note: v ? "$" + v.toFixed(1) : "$0" }));
      body.innerHTML = `<div class="demo-block">
        <div class="demo-label">${T("股票：股息随利润起伏，可能为零；上不封顶，下不保底（剩余请求权）", "Stock: dividends follow profits, can be zero; no ceiling, no floor (residual claim)")}</div>
        ${bars(items, 4.2)}
        <div style="font-size:12px;color:var(--muted)">${T("注意第 2、5 年：公司亏损或留存利润，股息 $0——没人欠你。第 8 年 $4.2：超额全归你。", "Note years 2 and 5: losses or retained earnings mean $0 dividends — nobody owes you. Year 8's $4.2: the upside is all yours.")}</div>
      </div>`;
    } else if (tab === "bond") {
      const r = rate / 100;
      const price = bondPrice(r, years);
      const items = [];
      for (let t = 1; t <= years; t++) {
        const last = t === years;
        items.push({ label: T("第", "Y") + t + T("年", ""), v: last ? FACE + COUPON : COUPON, color: last ? "var(--orange-ink)" : "var(--green)", note: last ? "$" + (FACE + COUPON) : "$" + COUPON });
      }
      const above = price > FACE + 0.005, below = price < FACE - 0.005;
      const verdict = below
        ? T(`市场新券给 ${rate}%，你这张只给 5%——必须折价到 $${price.toFixed(2)}，买家实际回报才追平市场。`, `New bonds pay ${rate}% while yours pays 5% — it must trade at a discount, $${price.toFixed(2)}, so a buyer's actual return matches the market.`)
        : above
        ? T(`市场只给 ${rate}%，你这张锁定了 5%——它变香了，溢价到 $${price.toFixed(2)}。`, `The market pays only ${rate}% while yours locked in 5% — now desirable, trading at a premium of $${price.toFixed(2)}.`)
        : T("市场利率恰好等于票息率 5%，债券按面值 $100.00 交易。", "Market rate equals the 5% coupon, so the bond trades exactly at its $100.00 face value.");
      body.innerHTML = `<div class="demo-block">
        <div class="demo-label">${T("债券：面值 $100，票息 5%（每年 $5），到期还本——固定时间表", "Bond: $100 face, 5% coupon ($5/yr), principal at maturity — a fixed timetable")}</div>
        ${bars(items, FACE + COUPON)}
      </div>
      <div class="demo-block">
        <label class="demo-label">${T("市场利率", "Market rate")}: <b id="cm-r">${rate}%</b></label>
        <input class="demo-slider" id="cm-rate" type="range" min="1" max="10" step="0.5" value="${rate}" />
        <label class="demo-label">${T("剩余年限", "Years to maturity")}: <b id="cm-y">${years}</b></label>
        <input class="demo-slider" id="cm-years" type="range" min="1" max="30" step="1" value="${years}" />
        <div style="margin-top:8px;font-family:var(--mono);font-size:13px;color:var(--ink)">
          ${T("价格", "Price")} = Σ 5/(1+${(r).toFixed(3)})<sup>t</sup> + 100/(1+${(r).toFixed(3)})<sup>${years}</sup> =
          <b style="font-size:17px;color:${below ? "var(--red)" : above ? "var(--green)" : "var(--orange-ink)"}">$${price.toFixed(2)}</b>
        </div>
        <div style="margin-top:6px;font-size:12px;color:var(--muted)">${verdict}</div>
      </div>`;
      body.querySelector("#cm-rate").addEventListener("input", (e) => { rate = parseFloat(e.target.value); paint(); });
      body.querySelector("#cm-years").addEventListener("input", (e) => { years = parseInt(e.target.value); paint(); });
    } else {
      const flows = [3.0, 2.8, 3.2, 3.1, 2.9, 3.3, 3.2, 3.4];
      const items = flows.map((v, i) => ({ label: T("第", "Y") + (i + 1) + T("年", ""), v, color: "var(--orange-ink)", note: "$" + v.toFixed(1) }));
      body.innerHTML = `<div class="demo-block">
        <div class="demo-label">${T("基金份额：几百张股票+债券装进池子再切份——“请求权的请求权”", "Fund share: hundreds of stocks + bonds pooled and sliced — a “claim on claims”")}</div>
        ${bars(items, 3.4)}
        <div style="font-size:12px;color:var(--muted)">${T("单只股票的暴涨暴跌被池子摊平了：分散化用“放弃极端上涨”换“削掉极端下跌”。这份额每天怎么定价（NAV）、谁来算——阶段 3.3。", "One stock's wild swings are averaged out by the pool: diversification trades away extreme upside to shave off extreme downside. How this share is priced daily (NAV), and who computes it — Stage 3.3.")}</div>
      </div>`;
    }
  }

  root.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { tab = b.dataset.tab; paint(); }));
  paint();
}
