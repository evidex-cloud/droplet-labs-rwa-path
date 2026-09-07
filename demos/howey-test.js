// 交互演示：Howey 机器——把 6 个资产逐一送过四道闸门，你先投票，再对照标准分析并计分。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const PRONGS = [
    T("① 投入金钱？", "① Investment of money?"),
    T("② 共同事业？", "② Common enterprise?"),
    T("③ 获利预期？", "③ Expectation of profit?"),
    T("④ 靠他人努力？", "④ From others' efforts?"),
  ];

  // ans: true/false/null(contested); note: 分析；verdict: 结论
  const ASSETS = [
    {
      name: T("代币化基金份额", "Tokenized fund share"), icon: "🏦",
      ans: [true, true, true, true],
      notes: [
        T("买家掏了真金白银。", "Buyers put in real money."),
        T("钱进同一个基金池，命运绑定。", "Funds pool into one vehicle; fates tied."),
        T("买它就是为了 4–5% 的国债收益。", "You buy it for the 4–5% Treasury yield."),
        T("收益来自管理团队的运作（BlackRock 等）。", "Yield comes from the manager's efforts (BlackRock etc.)."),
      ],
      verdict: T("证券（教科书级）→ 打开豁免菜单：Reg D / Reg S / 注册基金。BUIDL 走 Reg D。", "Security (textbook) → the exemption menu opens: Reg D / Reg S / registered fund. BUIDL took Reg D."),
      sec: true,
    },
    {
      name: "BTC", icon: "₿",
      ans: [true, false, null, false],
      notes: [
        T("掏钱买币，成立。", "Money in — yes."),
        T("没有资金池、没有发行方——网络去中心化。", "No pooled fund, no issuer — the network is decentralized."),
        T("多数人确有获利预期——但这条单独不够。", "Most holders do expect profit — but this prong alone isn't enough."),
        T("没有一个“比特币公司”替你打工。", "There is no 'Bitcoin Inc.' working for you."),
      ],
      verdict: T("非证券 → 商品（commodity），现货归 CFTC 反欺诈管辖。", "Not a security → a commodity; spot markets under CFTC anti-fraud jurisdiction."),
      sec: false,
    },
    {
      name: T("迷因币", "Memecoin"), icon: "🐸",
      ans: [true, null, true, null],
      notes: [
        T("掏钱，成立。", "Money in — yes."),
        T("有争议：没有资金池，但价格命运高度绑定。", "Contested: no pooled fund, yet fates are tightly correlated."),
        T("不为赚钱谁买迷因币。", "Nobody buys a memecoin except to profit."),
        T("有争议：纯社区起哄 → 可能不成立；团队喊单画饼 → 立刻反转。2025 年 SEC 工作人员声明倾向“多数不是”。", "Contested: pure community froth → may fail; a team hyping a roadmap → flips instantly. A 2025 SEC staff statement leaned 'mostly not.'"),
      ],
      verdict: T("逐案分析——律师们真的会吵。诚实答案：视发行方式而定。", "Case by case — real lawyers genuinely argue. Honest answer: depends on how it was launched."),
      sec: null,
    },
    {
      name: "USDC", icon: "💵",
      ans: [true, true, false, true],
      notes: [
        T("掏钱换币，成立。", "Money in — yes."),
        T("储备集中管理，可以说成立。", "Reserves are pooled and managed — arguably yes."),
        T("关键：1 USDC 永远兑 $1，不升值、不派息——没有获利预期。", "The key: 1 USDC always redeems for $1 — no appreciation, no interest, no profit expectation."),
        T("Circle 确实在干活——但你不靠它赚钱。", "Circle does work — but you don't profit from it."),
      ],
      verdict: T("非证券 → 支付工具，归 GENIUS 法案（阶段 4.4）。", "Not a security → a payment instrument, governed by the GENIUS Act (Stage 4.4)."),
      sec: false,
    },
    {
      name: "PAXG", icon: "🥇",
      ans: [true, null, true, false],
      notes: [
        T("掏钱，成立。", "Money in — yes."),
        T("金条集中保管，但每枚代币对应特定金条份额。", "Bars are vaulted together, but each token maps to allocated gold."),
        T("买它是赌金价涨，成立。", "You buy it betting gold rises — yes."),
        T("关键：利润来自金价波动，不是 Paxos 的经营努力——它只是保管员。", "The key: profit comes from the gold price, not Paxos's efforts — Paxos just vaults the bars."),
      ],
      verdict: T("大概率非证券 → 商品分析，像直接持有金条（阶段 10.5）。", "Most likely not a security → commodity analysis, like holding the bar itself (Stage 10.5)."),
      sec: false,
    },
    {
      name: T("收益型票据 (USDY)", "Yield note (USDY)"), icon: "📜",
      ans: [true, true, true, true],
      notes: [
        T("掏钱，成立。", "Money in — yes."),
        T("票据持有人共享同一资产池。", "Note holders share one asset pool."),
        T("买它就是为了收益。", "You buy it for the yield."),
        T("陷阱题：它是 note（票据），正式分析走 Reves “家族相似”测试而非 Howey——结论殊途同归。", "Trick question: it's a note — the formal analysis runs Reves's family-resemblance test, not Howey — same destination by another road."),
      ],
      verdict: T("证券（经 Reves 测试）→ 走 Reg S 只卖非美国人（阶段 10.2）。", "Security (via Reves) → sold under Reg S to non-US persons only (Stage 10.2)."),
      sec: true,
    },
  ];

  let idx = 0, prong = 0, votes = [], score = 0, total = 0, phase = "vote"; // vote | reveal | verdict

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("⚖️ Howey 机器 · 六个资产过四道闸门", "⚖️ The Howey machine · six assets, four gates")}</div>
      <div class="demo-switch" id="hw-tabs"></div>
      <div class="demo-block" id="hw-main"></div>
      <div class="demo-block" id="hw-score" style="display:none"></div>
      <p class="demo-tip">${T("Howey 看的是<strong>“经济实质”</strong>，不是“技术形式”——RWA 的成年礼是主动承认自己是证券。注意带“有争议”标记的格子：真实世界里，律师们就在那儿吵。", "Howey reads <strong>economic substance</strong>, not technical form — RWA's coming-of-age is admitting it's a security on purpose. Watch the 'contested' cells: that's exactly where real lawyers argue.")}</p>
    </div>`;

  const tabs = root.querySelector("#hw-tabs");
  const main = root.querySelector("#hw-main");
  const scoreEl = root.querySelector("#hw-score");

  function tag(v) {
    if (v === true) return `<span style="color:var(--red);font-weight:700">${T("是", "yes")}</span>`;
    if (v === false) return `<span style="color:var(--green);font-weight:700">${T("否", "no")}</span>`;
    return `<span style="color:var(--orange-ink);font-weight:700">${T("有争议", "contested")}</span>`;
  }

  function paintTabs() {
    tabs.innerHTML = ASSETS.map((a, i) =>
      `<button class="demo-btn${i === idx ? " active" : ""}" data-a="${i}">${a.icon} ${a.name}</button>`).join("");
    tabs.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
      idx = +b.dataset.a; prong = 0; votes = []; phase = "vote"; paintTabs(); paint();
    }));
  }

  function paint() {
    const a = ASSETS[idx];
    if (phase === "verdict") {
      const col = a.sec === true ? "var(--red)" : a.sec === false ? "var(--green)" : "var(--orange-ink)";
      main.innerHTML = `
        <div class="demo-label">${a.icon} ${a.name} · ${T("判定", "Verdict")}</div>
        ${a.ans.map((v, i) => `<div style="margin:4px 0;font-size:13px">${PRONGS[i]} → ${tag(v)} <span style="color:var(--muted)">${a.notes[i]}</span></div>`).join("")}
        <div style="margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--surface-2);color:${col};font-weight:600">${a.verdict}</div>
        <div class="demo-btns" style="margin-top:8px"><button class="demo-btn" id="hw-next">${idx < ASSETS.length - 1 ? T("▶ 下一个资产", "▶ Next asset") : T("🏁 看总分", "🏁 See score")}</button></div>`;
      root.querySelector("#hw-next").addEventListener("click", () => {
        if (idx < ASSETS.length - 1) { idx++; prong = 0; votes = []; phase = "vote"; paintTabs(); paint(); }
        else {
          scoreEl.style.display = "block";
          scoreEl.innerHTML = `<div class="done-banner">${T(`✅ 完成！你与“标准分析”一致 ${score}/${total}（争议格不计分）。`, `✅ Done! You matched the model analysis on ${score}/${total} (contested cells not scored).`)}</div>`;
        }
      });
      return;
    }
    const p = prong;
    let html = `<div class="demo-label">${a.icon} ${a.name} · ${T("闸门", "Gate")} ${p + 1}/4</div>
      <div style="font-weight:600;color:var(--ink);margin:6px 0">${PRONGS[p]}</div>`;
    if (phase === "vote") {
      html += `<div class="demo-btns">
        <button class="demo-btn" data-v="1">${T("是", "Yes")}</button>
        <button class="demo-btn" data-v="0">${T("否", "No")}</button></div>`;
      main.innerHTML = html;
      main.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
        const mine = b.dataset.v === "1";
        votes[p] = mine;
        if (a.ans[p] !== null) { total++; if (mine === a.ans[p]) score++; }
        phase = "reveal"; paint();
      }));
    } else {
      const model = a.ans[p], mine = votes[p];
      const hit = model === null ? null : mine === model;
      html += `<div style="font-size:13px;margin:6px 0">${T("你的投票", "Your vote")}：<b>${mine ? T("是", "yes") : T("否", "no")}</b> · ${T("标准分析", "Model analysis")}：${tag(model)} ${hit === null ? "🤝" : hit ? "✅" : "❌"}</div>
        <div style="font-size:13px;color:var(--muted)">${a.notes[p]}</div>
        <div class="demo-btns" style="margin-top:8px"><button class="demo-btn" id="hw-go">${p < 3 ? T("▶ 下一道闸门", "▶ Next gate") : T("⚖️ 出判定", "⚖️ Get the verdict")}</button></div>`;
      main.innerHTML = html;
      root.querySelector("#hw-go").addEventListener("click", () => {
        if (p < 3) { prong++; phase = "vote"; } else { phase = "verdict"; }
        paint();
      });
    }
  }

  paintTabs();
  paint();
}
