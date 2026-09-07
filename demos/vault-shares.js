// 交互演示：ERC-4626 金库模拟器——存入 USDC、按 APY 播放一年真实复利，切换“累积型/重定基型”看同一收益的两种渲染，另附第一存款人攻击的攻防重放。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  let apy = 4.8, mode = "acc", timer = null;
  let st = null; // { A: totalAssets, S: totalShares, user, bob, month }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏦 ERC-4626 金库模拟器", "🏦 ERC-4626 vault simulator")}</div>
      <div class="demo-block">
        <label class="demo-label">${T("国债年化收益（APY）", "T-bill APY")}：<b id="vs-apy">4.8%</b></label>
        <input class="demo-slider" id="vs-slider" type="range" min="1" max="10" step="0.1" value="4.8" />
      </div>
      <div class="demo-switch">${T("显示模式：", "Yield mode: ")}
        <button class="demo-btn active" data-m="acc">${T("累积型（价格涨）", "Accumulating (price rises)")}</button>
        <button class="demo-btn" data-m="reb">${T("重定基型（余额涨）", "Rebasing (balance grows)")}</button>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="vs-dep">${T("① 存入 1,000 USDC", "① Deposit 1,000 USDC")}</button>
        <button class="demo-btn" id="vs-play" disabled>${T("② ▶ 播放一年", "② ▶ Play one year")}</button>
        <button class="demo-btn" id="vs-reset">↺</button>
      </div>
      <div class="demo-block" id="vs-panel">${T("（先存入，金库还是空的）", "(deposit first — the vault is empty)")}</div>
      <div id="vs-log" style="font-size:.88em;color:var(--muted)"></div>
      <div class="demo-block">
        <div class="demo-label">${T("进阶 · 第一存款人通胀攻击重放", "Advanced · first-depositor inflation attack replay")}</div>
        <label style="font-size:.92em;color:var(--ink)"><input type="checkbox" id="vs-mit"> ${T("启用防御：发行方预铸 1,000 死份额", "Enable defense: issuer pre-mints 1,000 dead shares")}</label>
        <div id="vs-attack" style="margin-top:6px"></div>
      </div>
      <p class="demo-tip">${T("盯住两件事：① 切换显示模式，<strong>你的总价值一分不变</strong>——动价格还是动数量只是渲染；② 年中 Bob 进场按<strong>当时价格</strong>铸份额，谁也不稀释谁。下面的攻击重放则提醒你：<strong>标准≠安全</strong>（阶段 12.2）。", "Watch two things: ① toggle the mode — <strong>your total value doesn't change a cent</strong>; moving price vs quantity is just rendering. ② Bob enters mid-year minting at the <strong>current</strong> price, so nobody dilutes anybody. The attack replay below is the reminder that <strong>standard ≠ safe</strong> (Stage 12.2).")}</p>
    </div>`;

  const panel = root.querySelector("#vs-panel");
  const log = root.querySelector("#vs-log");
  const playBtn = root.querySelector("#vs-play");
  const fmt = (v, d) => v.toLocaleString("en-US", { minimumFractionDigits: d === undefined ? 2 : d, maximumFractionDigits: d === undefined ? 2 : d });

  function price() { return st.S > 0 ? st.A / st.S : 1; }

  function paint() {
    if (!st) { panel.innerHTML = T("（先存入，金库还是空的）", "(deposit first — the vault is empty)"); return; }
    const p = price();
    const reb = mode === "reb";
    const shown = reb ? st.user * p : st.user;
    const shownP = reb ? 1.0 : p;
    panel.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div>totalAssets：<b>${fmt(st.A)} USDC</b></div>
        <div>totalShares：<b>${fmt(st.S)}</b></div>
        <div>${T("份额价格", "Share price")}：<b style="color:var(--orange-ink)">$${fmt(shownP, 4)}</b></div>
        <div>${T("第", "Month")} <b>${st.month}</b>${T(" 个月", "")}</div>
      </div>
      <div style="margin-top:8px;border-top:1px solid var(--line);padding-top:8px">
        ${T("你的余额", "Your balance")}：<b style="color:var(--green)">${fmt(shown, reb ? 2 : 0)} ${T("份", "shares")}</b>
        → ${T("价值", "worth")} <b>${fmt(st.user * p)} USDC</b>
        ${st.bob > 0 ? `<br>Bob：${fmt(reb ? st.bob * p : st.bob, reb ? 2 : 0)} ${T("份", "shares")} → ${fmt(st.bob * p)} USDC` : ""}
      </div>`;
  }

  function attackPaint() {
    const mit = root.querySelector("#vs-mit").checked;
    let rows;
    if (!mit) {
      rows = [
        [T("攻击者 deposit 0.000001 USDC → 得 0.000001 份", "Attacker deposits 0.000001 USDC → 0.000001 shares"), null],
        [T("攻击者直接向金库地址“捐赠”10,000 USDC（绕过 deposit）", "Attacker “donates” 10,000 USDC straight to the vault (bypassing deposit)"), null],
        [T("份额价格被通胀到 1 份 ≈ 10,000,000,000 USDC", "Share price inflated to 1 share ≈ 10,000,000,000 USDC"), null],
        [T("受害者 deposit 5,000 USDC → 铸得 5,000×0.000001÷10,000 = 0 份（向下取整）", "Victim deposits 5,000 USDC → mints 5,000×0.000001÷10,000 = 0 shares (rounds down)"), "bad"],
        [T("池中 15,000 USDC 全归攻击者的那 0.000001 份 → 攻击者净赚 ≈ 5,000", "All 15,000 USDC belongs to the attacker's 0.000001 shares → profit ≈ 5,000"), "bad"],
      ];
    } else {
      rows = [
        [T("部署时发行方存 1,000 USDC 预铸 1,000 死份额", "At deployment the issuer deposits 1,000 USDC and mints 1,000 dead shares"), null],
        [T("攻击者捐赠 10,000 → 价格仅涨到 (11,000÷1,000) = $11/份", "Attacker donates 10,000 → price only rises to (11,000÷1,000) = $11/share"), null],
        [T("受害者 deposit 5,000 → 铸得 ≈ 454.5 份，价值仍 ≈ 5,000 USDC ✓", "Victim deposits 5,000 → mints ≈ 454.5 shares, still worth ≈ 5,000 USDC ✓"), "good"],
        [T("攻击者的 0.000001 份只值 ≈ 0.011 USDC → 捐出的 10,000 打了水漂", "The attacker's 0.000001 shares are worth ≈ 0.011 USDC → the 10,000 donation is forfeit"), "good"],
      ];
    }
    root.querySelector("#vs-attack").innerHTML = rows.map(([txt, cls]) =>
      `<div style="padding:3px 0;color:${cls === "bad" ? "var(--red)" : cls === "good" ? "var(--green)" : "var(--ink)"}">· ${txt}</div>`).join("") +
      `<div style="margin-top:4px;font-weight:600;color:${mit ? "var(--green)" : "var(--red)"}">${mit ? T("✅ 攻击失败——虚拟份额/死份额让价格无法被有效通胀", "✅ Attack defeated — dead/virtual shares make the price uninflatable") : T("⛔ 攻击成功——完全“符合标准”的实现照样被洗劫", "⛔ Attack succeeds — a perfectly “standard-compliant” implementation gets robbed")}</div>`;
  }

  root.querySelector("#vs-slider").addEventListener("input", (e) => {
    apy = parseFloat(e.target.value);
    root.querySelector("#vs-apy").textContent = apy.toFixed(1) + "%";
  });
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    root.querySelectorAll("[data-m]").forEach((x) => x.classList.toggle("active", x.dataset.m === mode));
    paint();
  }));
  root.querySelector("#vs-dep").addEventListener("click", () => {
    st = { A: 1000, S: 1000, user: 1000, bob: 0, month: 0 };
    log.innerHTML = T("· 你存入 1,000 USDC，空金库按 1:1 铸 1,000 份", "· You deposit 1,000 USDC; the empty vault mints 1,000 shares at 1:1");
    playBtn.disabled = false; paint();
  });
  playBtn.addEventListener("click", () => {
    if (!st || timer) return;
    playBtn.disabled = true;
    const monthly = Math.pow(1 + apy / 100, 1 / 12) - 1;
    timer = setInterval(() => {
      st.month++;
      st.A *= 1 + monthly; // 池内国债生息 → totalAssets 上涨（现实中由 NAV 喂价更新）
      if (st.month === 6 && st.bob === 0) {
        const p = price();
        const minted = 500 / p;
        st.bob = minted; st.A += 500; st.S += minted;
        log.innerHTML += "<br>" + T(`· 第 6 个月：Bob 存入 500 USDC，按当时价格 $${p.toFixed(4)} 铸 ${minted.toFixed(1)} 份——你的浮盈没有被稀释`, `· Month 6: Bob deposits 500 USDC, minting ${minted.toFixed(1)} shares at the then-current price $${p.toFixed(4)} — your accrued gain isn't diluted`);
      }
      if (st.month >= 12) {
        clearInterval(timer); timer = null;
        log.innerHTML += "<br>" + T(`· 一年结束：份额价格 $1.0000 → $${price().toFixed(4)}（复利 ${apy.toFixed(1)}% APY）`, `· Year over: share price $1.0000 → $${price().toFixed(4)} (compounding at ${apy.toFixed(1)}% APY)`);
      }
      paint();
    }, 260);
  });
  root.querySelector("#vs-reset").addEventListener("click", () => {
    if (timer) { clearInterval(timer); timer = null; }
    st = null; log.innerHTML = ""; playBtn.disabled = true; paint();
  });
  root.querySelector("#vs-mit").addEventListener("change", attackPaint);

  paint(); attackPaint();
}
