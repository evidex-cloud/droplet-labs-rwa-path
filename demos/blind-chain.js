// 交互演示：你就是那个“盲”的借贷合约——只能看喂价面板做决定，上帝视角看真实世界，体会预言机翻车与防御。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 每轮：true = 真实价格；raw = 无防御时喂价
  const SCEN = {
    manip: { label: T("闪电贷操纵", "Flash-loan pump"), true: [100, 100, 100, 100], raw: [100, 100, 400, 100] },
    stale: { label: T("数据停更", "Feed goes stale"), true: [100, 90, 75, 60], raw: [100, 100, 100, 100] },
    down:  { label: T("数据源宕机", "Source goes down"), true: [100, 100, 95, 95], raw: [100, 0, 0, 95] },
  };
  const MIT = [
    { id: "median", label: T("中位数聚合", "Median of sources") },
    { id: "twap", label: T("TWAP", "TWAP") },
    { id: "hb", label: T("心跳+偏差", "Heartbeat+deviation") },
    { id: "breaker", label: T("熔断", "Circuit breaker") },
  ];

  let scen = "manip", round = 0, loss = 0, log = [];
  const mit = { median: false, twap: false, hb: false, breaker: false };

  // 计算本轮喂价；返回 {v, paused}
  function feed(i) {
    const s = SCEN[scen];
    let v = s.raw[i];
    if (scen === "manip" && v > 150) {
      if (mit.median) v = 102;        // 只有一个源被操纵，中位数不动
      else if (mit.twap) v = 130;     // 瞬时尖峰被时间稀释
    }
    if (scen === "stale" && mit.hb) v = [100, 90, 76, 61][i]; // 偏差触发推送，喂价跟上
    if (scen === "down" && v === 0 && mit.median) v = s.true[i]; // 其余源仍在
    if (mit.breaker && (v > 150 || v < 50)) return { v, paused: true };
    return { v, paused: false };
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🕶️ 盲合约游戏：你只能相信喂价", "🕶️ The blind-contract game: the feed is all you get")}</div>
      <div class="demo-switch">${T("场景：", "Scenario: ")}
        ${Object.keys(SCEN).map((k) => `<button class="demo-btn" data-scen="${k}">${SCEN[k].label}</button>`).join("")}
      </div>
      <div class="demo-switch">${T("防御：", "Mitigations: ")}
        ${MIT.map((m) => `<button class="demo-btn" data-mit="${m.id}">${m.label}</button>`).join("")}
      </div>
      <div class="demo-block" id="bc-panels"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="bc-ok">${T("✅ 批准放贷", "✅ Approve loan")}</button>
        <button class="demo-btn" id="bc-no">${T("⛔ 拒绝", "⛔ Deny")}</button>
        <button class="demo-btn" id="bc-reset">${T("↺ 重来", "↺ Reset")}</button>
      </div>
      <div id="bc-log"></div>
      <p class="demo-tip">${T("先不开任何防御把三个场景玩一遍，看你亏多少；再打开对应防御重跑——<strong>中位数破单源操纵、TWAP 削尖峰、心跳救停更、熔断挡荒谬值</strong>。链上代码从不出错地执行——错的是它相信的那个数字。", "Play all three scenarios with no mitigations first and count your losses; then re-run with the right toggles — <strong>medians beat single-source pumps, TWAPs shave spikes, heartbeats cure staleness, breakers block absurd values</strong>. On-chain code never executes wrongly — what's wrong is the number it believed.")}</p>
    </div>`;

  const panels = root.querySelector("#bc-panels");
  const logEl = root.querySelector("#bc-log");
  const okBtn = root.querySelector("#bc-ok");
  const noBtn = root.querySelector("#bc-no");

  function paint() {
    const s = SCEN[scen];
    const over = round >= s.true.length;
    if (over) {
      panels.innerHTML = `<div class="${loss > 0 ? "demo-warn" : "done-banner"}">${
        loss > 0
          ? T(`💸 四轮结束，协议共亏损 $${loss.toLocaleString()}。打开防御再试一次。`, `💸 Four rounds done — the protocol lost $${loss.toLocaleString()}. Toggle mitigations and retry.`)
          : T("✅ 四轮结束，零亏损——防御（或你的直觉）起作用了。", "✅ Four rounds, zero losses — the mitigations (or your instincts) worked.")
      }</div>`;
      okBtn.disabled = noBtn.disabled = true;
      return;
    }
    okBtn.disabled = noBtn.disabled = false;
    const f = feed(round);
    const feedTxt = f.paused ? T("🛑 熔断：数值出界，合约暂停", "🛑 Breaker tripped: out of bounds, contract paused") : `$${f.v}`;
    panels.innerHTML = `
      <div class="demo-label">${T("第", "Round")} ${round + 1} / 4 ${T("轮 · 借款人请求：抵押 1000 单位，按喂价借走 70%", " · Borrower: pledge 1,000 units, borrow 70% at feed price")}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
        <div style="flex:1;min-width:180px;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--surface-2)">
          <div class="demo-label">${T("🌍 真实世界（上帝视角，合约看不见）", "🌍 Real world (god view — the contract can't see this)")}</div>
          <div style="font-family:var(--mono);font-size:20px;color:var(--ink)">$${s.true[round]}</div>
        </div>
        <div style="flex:1;min-width:180px;border:1px solid var(--orange-line);border-radius:8px;padding:8px;background:var(--orange-soft)">
          <div class="demo-label">${T("📟 喂价面板（合约唯一能看的）", "📟 The feed (all the contract can see)")}</div>
          <div style="font-family:var(--mono);font-size:20px;color:var(--orange-ink)">${feedTxt}</div>
        </div>
      </div>`;
    if (f.paused) { okBtn.disabled = true; } // 熔断时只能拒绝/跳过
  }

  function decide(approve) {
    const s = SCEN[scen];
    const f = feed(round);
    const trueV = s.true[round] * 1000;
    let line;
    if (approve && !f.paused) {
      const loan = 0.7 * f.v * 1000;
      const l = Math.max(0, Math.round(loan - trueV));
      loss += l;
      line = l > 0
        ? `<span style="color:var(--red)">💸 ${T(`放贷 $${loan.toLocaleString()}，抵押真值只有 $${trueV.toLocaleString()} → 亏 $${l.toLocaleString()}`, `Lent $${loan.toLocaleString()} against collateral truly worth $${trueV.toLocaleString()} → lost $${l.toLocaleString()}`)}</span>`
        : `<span style="color:var(--green)">✓ ${T("喂价接近真相，放贷安全", "Feed was near truth — safe loan")}</span>`;
    } else {
      const fair = Math.abs(f.v - s.true[round]) / s.true[round] < 0.05 && !f.paused;
      line = f.paused
        ? `<span style="color:var(--muted)">🛑 ${T("熔断生效，本轮无业务（也无亏损）", "Breaker active — no business, no loss")}</span>`
        : fair
          ? `<span style="color:var(--muted)">− ${T("拒绝了一笔正常业务（机会成本）", "Denied a fair loan (opportunity cost)")}</span>`
          : `<span style="color:var(--green)">✓ ${T("拒绝了危险喂价，躲过亏损", "Denied a lying feed — loss avoided")}</span>`;
    }
    log.push(`<div style="font-size:12px;padding:2px 0">${T("第", "R")}${round + 1}: ${line}</div>`);
    logEl.innerHTML = log.join("") + `<div style="font-size:12px;font-weight:700;color:${loss > 0 ? "var(--red)" : "var(--green)"}">${T("累计亏损", "Total loss")}: $${loss.toLocaleString()}</div>`;
    round++;
    paint();
  }

  function reset() { round = 0; loss = 0; log = []; logEl.innerHTML = ""; paint(); }

  root.querySelectorAll("[data-scen]").forEach((b) => b.addEventListener("click", () => {
    scen = b.dataset.scen;
    root.querySelectorAll("[data-scen]").forEach((x) => x.classList.toggle("active", x.dataset.scen === scen));
    reset();
  }));
  root.querySelectorAll("[data-mit]").forEach((b) => b.addEventListener("click", () => {
    mit[b.dataset.mit] = !mit[b.dataset.mit];
    b.classList.toggle("active", mit[b.dataset.mit]);
    reset();
  }));
  okBtn.addEventListener("click", () => decide(true));
  noBtn.addEventListener("click", () => decide(false));
  root.querySelector("#bc-reset").addEventListener("click", reset);

  root.querySelector('[data-scen="manip"]').classList.add("active");
  paint();
}
