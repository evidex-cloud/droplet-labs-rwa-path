// 交互演示：搭一个投资者画像，实时算出 TA 的法律资格等级，再看 5 类 RWA 产品哪些开门、哪些锁死。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const M = (v) => "$" + (v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : (v / 1e3).toFixed(0) + "k");

  let p = { country: "US", income: 150000, netWorth: 400000, invest: 100000, s65: false };
  const presets = [
    { label: T("美国工程师（年薪 $150k）", "US engineer ($150k salary)"), v: { country: "US", income: 150000, netWorth: 400000, invest: 100000, s65: false } },
    { label: T("美国医生（$2M 净资产）", "US doctor ($2M net worth)"), v: { country: "US", income: 350000, netWorth: 2000000, invest: 1200000, s65: false } },
    { label: T("新加坡零售投资者", "Singapore retail investor"), v: { country: "SG", income: 60000, netWorth: 200000, invest: 50000, s65: false } },
    { label: T("家族办公室（美国）", "Family office (US)"), v: { country: "US", income: 900000, netWorth: 10000000, invest: 10000000, s65: false } },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🎯 资格路由器 · 谁能买哪种 RWA", "🎯 Eligibility router · who may buy which RWA")}</div>
      <div class="demo-switch" id="eq-presets"></div>
      <div class="demo-block">
        <div class="demo-label">${T("国籍 / 居住地", "Country / residence")}：
          <select id="eq-country" style="font:inherit">
            <option value="US">${T("美国", "United States")}</option>
            <option value="EU">${T("欧盟", "EU")}</option>
            <option value="SG">${T("新加坡", "Singapore")}</option>
            <option value="SANC">${T("受制裁法域", "Sanctioned jurisdiction")}</option>
          </select>
          &nbsp; <label><input type="checkbox" id="eq-s65"/> ${T("持 Series 65 执照", "Holds Series 65 license")}</label>
        </div>
        <label class="demo-label">${T("年收入", "Annual income")}：<b id="eq-iv"></b></label>
        <input class="demo-slider" id="eq-inc" type="range" min="0" max="1000000" step="10000"/>
        <label class="demo-label">${T("净资产（不含自住房）", "Net worth (ex primary residence)")}：<b id="eq-nv"></b></label>
        <input class="demo-slider" id="eq-nw" type="range" min="0" max="12000000" step="100000"/>
        <label class="demo-label">${T("投资资产（QP 口径）", "Investments (QP test)")}：<b id="eq-vv"></b></label>
        <input class="demo-slider" id="eq-in" type="range" min="0" max="12000000" step="100000"/>
      </div>
      <div class="demo-block"><div class="demo-label">${T("法律等级判定", "Legal classification")}</div><div id="eq-cls"></div></div>
      <div class="demo-block"><div class="demo-label">${T("5 类产品原型：开门 or 锁死", "5 product archetypes: open or blocked")}</div><div id="eq-matrix"></div></div>
      <p class="demo-tip">${T("试试把同一份收入/资产从“美国”切到“新加坡”：<strong>同一个人换个国籍，能买的 RWA 完全不同——这不是技术限制，是法律几何。</strong>再看家族办公室：再有钱，Reg S 产品照样锁死（因为是美国人）。", "Flip the same income/assets from “US” to “Singapore”: <strong>the same person with a different passport can buy a completely different set of RWAs — not a technical limit, but legal geometry.</strong> And note the family office: all that money, and the Reg S product is still locked (they're a US person).")}</p>
    </div>`;

  const el = (id) => root.querySelector(id);
  el("#eq-presets").innerHTML = presets.map((x, i) => `<button class="demo-btn" data-p="${i}">${x.label}</button>`).join("");

  function badge(ok, zh, ezh) {
    return `<span style="display:inline-block;margin:2px 6px 2px 0;padding:2px 8px;border-radius:99px;font-size:.85em;background:${ok ? "var(--green-soft)" : "var(--surface-2)"};color:${ok ? "var(--green)" : "var(--muted)"};border:1px solid var(--line)">${ok ? "✓ " : "✗ "}${T(zh, ezh)}</span>`;
  }

  function calc() {
    el("#eq-iv").textContent = M(p.income); el("#eq-nv").textContent = M(p.netWorth); el("#eq-vv").textContent = M(p.invest);
    el("#eq-inc").value = p.income; el("#eq-nw").value = p.netWorth; el("#eq-in").value = p.invest;
    el("#eq-country").value = p.country; el("#eq-s65").checked = p.s65;

    const sanc = p.country === "SANC";
    const acc = !sanc && (p.netWorth >= 1000000 || p.income >= 200000 || p.s65);
    const qc = !sanc && p.netWorth >= 2200000;
    const qp = !sanc && p.invest >= 5000000;
    const nonUS = p.country !== "US" && !sanc;

    el("#eq-cls").innerHTML =
      badge(acc, "合格投资者（$1M 净资产 或 $200k 收入 或 Series 65）", "Accredited ($1M net worth or $200k income or Series 65)") +
      badge(qc, "合格客户（$2.2M）", "Qualified client ($2.2M)") +
      badge(qp, "合格购买人（$5M 投资资产）", "Qualified purchaser ($5M investments)") +
      badge(nonUS, "非美国人（Reg S 口径）", "Non-US person (Reg S test)") +
      (sanc ? `<div style="color:var(--red);font-weight:700;margin-top:4px">${T("⛔ 受制裁法域：三道闸的闸③直接拦截（阶段 7.1）", "⛔ Sanctioned jurisdiction: gate ③ blocks outright (Stage 7.1)")}</div>` : "");

    const products = [
      { name: T("BUIDL 型国债基金", "BUIDL-style Treasury fund"), rule: T("Reg D + 3(c)(7)：仅合格购买人，最低 $5M", "Reg D + 3(c)(7): qualified purchasers only, $5M min"), ok: qp },
      { name: T("506(c) 私募信贷池", "506(c) private-credit pool"), rule: T("Reg D 506(c)：合格投资者，须核实（上传税单）", "Reg D 506(c): accredited, must be verified (tax docs)"), ok: acc && !nonUS ? true : acc },
      { name: T("Reg S 收益票据（USDY 型）", "Reg S yield note (USDY-style)"), rule: T("Reg S：仅非美国人，铸造后有转让锁", "Reg S: non-US persons only, transfer lock after mint"), ok: nonUS },
      { name: T("Reg A+ 地产代币", "Reg A+ property token"), rule: T("Reg A+：SEC 预审核，零售可买（≤$75M/年）", "Reg A+: SEC-qualified, retail-open (≤$75M/yr)"), ok: !sanc },
      { name: T("注册货币市场基金", "Registered money-market fund"), rule: T("注册公开发行：零售可买，全套披露", "Registered public offering: retail-open, full disclosure"), ok: !sanc },
    ];
    el("#eq-matrix").innerHTML = products.map((x) => `
      <div style="display:flex;gap:8px;align-items:baseline;padding:5px 8px;margin:3px 0;border-radius:8px;background:${x.ok ? "var(--green-soft)" : "var(--red-soft)"}">
        <span style="font-weight:700;color:${x.ok ? "var(--green)" : "var(--red)"}">${x.ok ? T("开门", "OPEN") : T("锁死", "BLOCKED")}</span>
        <span style="color:var(--ink);font-weight:600">${x.name}</span>
        <span style="color:var(--muted);font-size:.82em">${x.rule}</span>
      </div>`).join("");
  }

  el("#eq-presets").querySelectorAll("[data-p]").forEach((b) =>
    b.addEventListener("click", () => {
      p = Object.assign({}, presets[+b.dataset.p].v);
      el("#eq-presets").querySelectorAll("[data-p]").forEach((x) => x.classList.toggle("active", x === b));
      calc();
    }));
  el("#eq-country").addEventListener("change", (e) => { p.country = e.target.value; calc(); });
  el("#eq-s65").addEventListener("change", (e) => { p.s65 = e.target.checked; calc(); });
  el("#eq-inc").addEventListener("input", (e) => { p.income = +e.target.value; calc(); });
  el("#eq-nw").addEventListener("input", (e) => { p.netWorth = +e.target.value; calc(); });
  el("#eq-in").addEventListener("input", (e) => { p.invest = +e.target.value; calc(); });
  calc();
}
