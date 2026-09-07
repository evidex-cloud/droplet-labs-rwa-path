// 交互演示：储备证明指挥台——你当发行方，试着违规铸造（被断路器拦下），再体会 PoR 的两个盲区。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  let supply = 100_000_000;        // 代币供应量
  let reserves = 100_300_000;      // 真实储备（未被抵押部分之外也算在内）
  let encumbered = 0;              // 已被抵押出去的储备（PoR 看不见）
  let fakeBoost = 0;               // 数据源造假的虚增额
  let breaker = true;              // 断路器开关
  let delay = 4;                   // 喂送更新延迟（小时）
  let published = reserves;        // 上次公开喂送的数字
  let pendingSince = null;         // 有未公布的变化
  let log = [];

  const fmt = (v) => "$" + Math.round(v).toLocaleString();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🛰️ 储备证明指挥台：你是发行方", "🛰️ PoR mission control: you are the issuer")}</div>
      <div class="demo-block" id="pm-gauges"></div>
      <div class="demo-switch">${T("断路器（secured mint）：", "Circuit breaker (secured mint): ")}
        <button class="demo-btn" id="pm-brk"></button>
        <span class="demo-label" style="margin-left:8px">${T("喂送延迟", "Feed delay")}: <b id="pm-dly">4h</b></span>
        <input class="demo-slider" id="pm-dlys" type="range" min="1" max="24" step="1" value="4" style="max-width:160px" />
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="pm-ok">${T("✅ 正常申购铸造 +$5M", "✅ Legit subscription mint +$5M")}</button>
        <button class="demo-btn" id="pm-bad">${T("⚠️ 违规铸造 +$5M（不入储备）", "⚠️ Rogue mint +$5M (no reserve)")}</button>
        <button class="demo-btn" id="pm-pub">${T("⏱ 让喂送更新一次", "⏱ Let the feed update")}</button>
      </div>
      <div class="demo-btns" style="margin-top:2px">
        <button class="demo-btn" id="pm-enc" style="opacity:.85">${T("🕶️ 抵押掉一半储备（暗操作）", "🕶️ Pledge half the reserves (dark)")}</button>
        <button class="demo-btn" id="pm-fake" style="opacity:.85">${T("🕶️ 数据源造假 +$20M", "🕶️ Falsify the data source +$20M")}</button>
        <button class="demo-btn" id="pm-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="pm-hidden"></div>
      <div id="pm-log" style="margin-top:6px"></div>
      <p class="demo-tip">${T("先开着断路器点“违规铸造”——交易直接被拦。关掉它，再看公开喂送要多久才揭穿你。然后按两个暗色按钮：<strong>抵押掉储备和数据源造假，仪表盘纹丝不动</strong>。PoR 管住了“偷偷增发”，管不住“一女二嫁”——知道工具的边界，才算会用工具。", "Leave the breaker on and hit “rogue mint” — the transaction is blocked. Turn it off and watch how long the public feed takes to expose you. Then press the two dark buttons: <strong>pledging reserves and falsifying the source move nothing on the dashboard</strong>. PoR stops minting in the dark; it can't stop selling the same bride twice — knowing a tool's boundary is knowing the tool.")}</p>
    </div>`;

  const gauges = root.querySelector("#pm-gauges");
  const hidden = root.querySelector("#pm-hidden");
  const logEl = root.querySelector("#pm-log");
  const brkBtn = root.querySelector("#pm-brk");

  function say(msg, color) {
    log.unshift(`<div style="font-size:12px;padding:2px 0;color:${color || "var(--muted)"}">${msg}</div>`);
    logEl.innerHTML = log.slice(0, 6).join("");
  }

  function paint() {
    const shown = published + fakeBoost;      // 公开喂送显示的储备
    const ratio = (shown / supply) * 100;
    const trueRatio = ((reserves - encumbered) / supply) * 100;
    const bar = (pct, col) => `<div style="height:10px;background:var(--surface-2);border-radius:5px;overflow:hidden"><div style="width:${Math.min(100, pct)}%;height:100%;background:${col}"></div></div>`;
    gauges.innerHTML = `
      <div class="demo-label">${T("公开面板（任何人、任何合约可读）", "Public dashboard (anyone and any contract can read)")}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">
        <div style="flex:1;min-width:150px">
          <div class="demo-label">${T("代币供应量", "Token supply")}</div>
          <div style="font-family:var(--mono);font-size:17px;color:var(--ink)">${fmt(supply)}</div>
        </div>
        <div style="flex:1;min-width:150px">
          <div class="demo-label">${T("PoR 喂送储备", "PoR reported reserves")}</div>
          <div style="font-family:var(--mono);font-size:17px;color:var(--ink)">${fmt(shown)}</div>
        </div>
        <div style="flex:1;min-width:150px">
          <div class="demo-label">${T("储备率", "Reserve ratio")}</div>
          <div style="font-family:var(--mono);font-size:17px;font-weight:700;color:${ratio >= 100 ? "var(--green)" : "var(--red)"}">${ratio.toFixed(2)}%</div>
        </div>
      </div>
      <div style="margin-top:6px">${bar(ratio, ratio >= 100 ? "var(--green)" : "var(--red)")}</div>
      ${pendingSince !== null ? `<div class="demo-label" style="color:var(--orange-ink);margin-top:6px">${T(`⏳ 储备已变化，但喂送还要 ${delay} 小时才刷新——这段时间公众看到的是旧数字`, `⏳ Reserves changed, but the feed refreshes in ${delay}h — until then the public sees the old number`)}</div>` : ""}`;

    const secrets = [];
    if (encumbered > 0) secrets.push(T(`已抵押给交易对手的储备：${fmt(encumbered)}（PoR 完全看不见）`, `Reserves pledged to a counterparty: ${fmt(encumbered)} (invisible to PoR)`));
    if (fakeBoost > 0) secrets.push(T(`数据源虚增：${fmt(fakeBoost)}（喂送忠实转述假数字）`, `Source inflation: ${fmt(fakeBoost)} (the feed faithfully relays a lie)`));
    hidden.innerHTML = secrets.length
      ? `<div class="demo-warn"><b>${T("🕶️ 隐藏负债面板（只有你看得见）", "🕶️ Hidden-liabilities panel (only you can see this)")}</b><br/>${secrets.join("<br/>")}<br/>${T("真实可用储备率", "True usable reserve ratio")}: <b style="color:var(--red)">${trueRatio.toFixed(2)}%</b></div>`
      : "";
    brkBtn.textContent = breaker ? T("🔒 开启", "🔒 ON") : T("🔓 关闭", "🔓 OFF");
    brkBtn.classList.toggle("active", breaker);
  }

  root.querySelector("#pm-ok").addEventListener("click", () => {
    supply += 5_000_000; reserves += 5_000_000; pendingSince = 1;
    say(T("✓ 正常申购：$5M 现金进储备，同时铸 5M 代币——比率不变。", "✓ Legit subscription: $5M cash into reserves, 5M tokens minted — ratio unchanged."), "var(--green)");
    paint();
  });

  root.querySelector("#pm-bad").addEventListener("click", () => {
    const shown = published + fakeBoost;
    if (breaker && supply + 5_000_000 > shown) {
      say(T("✗ REVERT：require(totalSupply + amount <= reserves) 未通过——断路器拦下了这次违规铸造。", "✗ REVERT: require(totalSupply + amount <= reserves) failed — the breaker blocked the rogue mint."), "var(--red)");
    } else {
      supply += 5_000_000; pendingSince = 1;
      say(T("⚠️ 违规铸造成功：供应 +5M，储备没动——比率开始劣化，等下次喂送更新就会暴露。", "⚠️ Rogue mint succeeded: supply +5M, reserves unchanged — the ratio degrades and the next feed update will expose it."), "var(--red)");
    }
    paint();
  });

  root.querySelector("#pm-pub").addEventListener("click", () => {
    published = reserves; pendingSince = null;
    const shown = published + fakeBoost;
    const r = (shown / supply) * 100;
    say(r >= 100
      ? T(`⏱ 喂送刷新：储备率 ${r.toFixed(2)}%，一切正常。`, `⏱ Feed refreshed: ratio ${r.toFixed(2)}%, all normal.`)
      : T(`⏱ 喂送刷新：储备率 ${r.toFixed(2)}% —— 低于 100%，公开暴露！检测延迟 ${delay} 小时。`, `⏱ Feed refreshed: ratio ${r.toFixed(2)}% — under 100%, publicly exposed! Detection lag ${delay}h.`),
      r >= 100 ? "var(--green)" : "var(--red)");
    paint();
  });

  root.querySelector("#pm-enc").addEventListener("click", () => {
    encumbered = Math.round(reserves / 2);
    say(T("🕶️ 一半储备被质押做了回购融资——资产仍在账户里，仪表盘纹丝不动。这就是 PoR 的最大盲区：权属负担。", "🕶️ Half the reserves were repo-pledged — the assets are still in the account and the dashboard doesn't budge. PoR's biggest blind spot: encumbrance."), "var(--orange-ink)");
    paint();
  });

  root.querySelector("#pm-fake").addEventListener("click", () => {
    fakeBoost = 20_000_000;
    say(T("🕶️ 数据源虚报 +$20M——喂送忠实地把假数字搬上链，断路器照样放行。垃圾进、垃圾出。", "🕶️ The source overstates by $20M — the feed faithfully hauls the lie on-chain and the breaker waves mints through. Garbage in, garbage out."), "var(--orange-ink)");
    paint();
  });

  brkBtn.addEventListener("click", () => { breaker = !breaker; paint(); });
  root.querySelector("#pm-dlys").addEventListener("input", (e) => { delay = +e.target.value; root.querySelector("#pm-dly").textContent = delay + "h"; paint(); });
  root.querySelector("#pm-reset").addEventListener("click", () => {
    supply = 100_000_000; reserves = 100_300_000; encumbered = 0; fakeBoost = 0;
    published = reserves; pendingSince = null; log = []; logEl.innerHTML = ""; paint();
  });

  paint();
}
