// 交互演示：NAV 喂价模拟器——选真实 NAV 曲线，调心跳与偏差阈值，看链上“阶梯”怎么追（或追不上）真相。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const DAYS = 30, STEP = 6; // 6 小时一步
  const N = (DAYS * 24) / STEP; // 120 步
  const PRESETS = {
    calm: { label: T("平稳生息", "Steady accrual"), make: () => { const a = []; let v = 1; for (let i = 0; i <= N; i++) { a.push(v); v *= 1.0000315; } return a; } },
    rate: { label: T("利率跳升", "Rate jump"), make: () => { const a = []; let v = 1; for (let i = 0; i <= N; i++) { a.push(v); v *= 1.0000315; if (i === Math.round((12 * 24) / STEP)) v *= 0.997; } return a; } },
    def:  { label: T("持仓违约", "Holding defaults"), make: () => { const a = []; let v = 1; for (let i = 0; i <= N; i++) { a.push(v); v *= 1.0000315; if (i === Math.round((15 * 24) / STEP)) v *= 0.95; } return a; } },
  };

  let preset = "calm", hb = 24, dev = 0.5;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("📡 NAV 喂价模拟器：心跳 × 偏差 × 30 天", "📡 NAV feed simulator: heartbeat × deviation × 30 days")}</div>
      <div class="demo-switch">${T("真实 NAV 走势：", "True NAV path: ")}
        ${Object.keys(PRESETS).map((k) => `<button class="demo-btn" data-p="${k}">${PRESETS[k].label}</button>`).join("")}
      </div>
      <div class="demo-block">
        <label class="demo-label">${T("心跳", "Heartbeat")}: <b id="nf-hb">24h</b></label>
        <input class="demo-slider" id="nf-hbs" type="range" min="6" max="48" step="6" value="24" />
        <label class="demo-label">${T("偏差阈值", "Deviation threshold")}: <b id="nf-dev">0.50%</b></label>
        <input class="demo-slider" id="nf-devs" type="range" min="0.05" max="2" step="0.05" value="0.5" />
      </div>
      <div class="demo-block" id="nf-chart"></div>
      <div class="demo-block" id="nf-stats"></div>
      <p class="demo-tip">${T("试试极端组合：<strong>持仓违约 + 心跳 48h + 偏差 2%</strong>——链上 NAV 在真相暴跌后还高挂两天，红色数字就是套利者能从借贷市场多借走的钱。<strong>心跳防“睡着”，偏差防“跳变”——参数不是玄学，是攻击窗口的宽度。</strong>", "Try the extreme combo: <strong>holding defaults + 48h heartbeat + 2% deviation</strong> — the on-chain NAV hangs high for two days after truth collapses, and the red number is what an arbitrageur could over-borrow from a lending market. <strong>Heartbeat guards sleep, deviation guards jumps — the parameters are the width of the attack window.</strong>")}</p>
    </div>`;

  const chart = root.querySelector("#nf-chart");
  const stats = root.querySelector("#nf-stats");

  function run() {
    const truth = PRESETS[preset].make();
    const chain = [], events = [];
    let last = truth[0], lastT = 0;
    for (let i = 0; i <= N; i++) {
      const hours = i * STEP;
      const drift = Math.abs(truth[i] - last) / last * 100;
      if (i > 0 && (hours - lastT >= hb || drift >= dev)) {
        const trig = drift >= dev ? "dev" : "hb";
        last = truth[i]; lastT = hours;
        events.push({ i, trig });
      }
      chain.push(last);
    }
    // 指标
    let maxGap = 0, badHours = 0, maxOver = 0;
    for (let i = 0; i <= N; i++) {
      const gap = (chain[i] - truth[i]) / truth[i];
      if (Math.abs(gap) > maxGap) maxGap = Math.abs(gap);
      if (Math.abs(gap) > 0.002) badHours += STEP;
      const over = Math.max(0, gap) * 10_000_000 * 0.9; // $10M 抵押、90% LTV
      if (over > maxOver) maxOver = over;
    }
    draw(truth, chain, events);
    const hbN = events.filter((e) => e.trig === "hb").length;
    const devN = events.filter((e) => e.trig === "dev").length;
    stats.innerHTML = `
      <div class="demo-label">${T("30 天结果", "30-day results")}</div>
      <div style="font-size:13px;color:var(--ink)">
        ${T("推送次数", "Pushes")}: <b>${events.length}</b>（⏰${T("心跳", "heartbeat")} ${hbN} · 📈${T("偏差", "deviation")} ${devN}）<br/>
        ${T("最大偏离", "Max divergence")}: <b>${(maxGap * 100).toFixed(2)}%</b> · ${T("偏离 >0.2% 的时长", "Time >0.2% off")}: <b>${badHours}h</b><br/>
        <span style="color:${maxOver > 1000 ? "var(--red)" : "var(--green)"};font-weight:700">${T("借贷市场错价窗口：按 $10M 抵押/90% LTV，最多可多借", "Lending mispricing window: on $10M collateral at 90% LTV, over-borrow up to")} $${Math.round(maxOver).toLocaleString()}</span>
      </div>`;
  }

  function draw(truth, chain, events) {
    const W = 600, H = 170, PAD = 8;
    const lo = Math.min(...truth, ...chain), hi = Math.max(...truth, ...chain);
    const x = (i) => PAD + (i / N) * (W - 2 * PAD);
    const y = (v) => H - PAD - ((v - lo) / (hi - lo || 1)) * (H - 2 * PAD);
    const tPts = truth.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    // 阶梯线
    let cPts = `${x(0).toFixed(1)},${y(chain[0]).toFixed(1)}`;
    for (let i = 1; i <= N; i++) cPts += ` ${x(i).toFixed(1)},${y(chain[i - 1]).toFixed(1)} ${x(i).toFixed(1)},${y(chain[i]).toFixed(1)}`;
    const marks = events.map((e) => `<text x="${x(e.i).toFixed(1)}" y="12" font-size="9" text-anchor="middle" fill="var(--muted)">${e.trig === "hb" ? "⏰" : "📈"}</text>`).join("");
    chart.innerHTML = `
      <div class="demo-label">${T("绿=真实 NAV · 橙=链上 NAV（阶梯）· 顶部图标=每次推送的触发原因", "Green = true NAV · Orange = on-chain NAV (staircase) · top icons = each push's trigger")}</div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${W}" height="${H}" fill="var(--surface-2)" rx="6"/>
        ${marks}
        <polyline points="${tPts}" fill="none" stroke="var(--green)" stroke-width="1.6"/>
        <polyline points="${cPts}" fill="none" stroke="var(--orange-ink)" stroke-width="1.6"/>
      </svg>`;
  }

  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
    preset = b.dataset.p;
    root.querySelectorAll("[data-p]").forEach((x) => x.classList.toggle("active", x.dataset.p === preset));
    run();
  }));
  root.querySelector("#nf-hbs").addEventListener("input", (e) => { hb = +e.target.value; root.querySelector("#nf-hb").textContent = hb + "h"; run(); });
  root.querySelector("#nf-devs").addEventListener("input", (e) => { dev = +e.target.value; root.querySelector("#nf-dev").textContent = dev.toFixed(2) + "%"; run(); });

  root.querySelector('[data-p="calm"]').classList.add("active");
  run();
}
