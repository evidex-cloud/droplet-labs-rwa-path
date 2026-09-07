// 交互演示：托管合约状态机——三方角色随便点按钮，合约只放行合法转换，非法调用当场回滚并说明原因。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const PHASES = {
    EMPTY: T("空", "EMPTY"), DEP: T("已存入", "DEPOSITED"), CONF: T("已确认", "CONFIRMED"),
    DISP: T("争议中", "DISPUTED"), REL: T("已放款", "RELEASED"), REF: T("已退款", "REFUNDED"),
  };
  let phase, bal, log, scen = "smooth";

  function reset() {
    phase = "EMPTY";
    bal = { buyer: 5, seller: 0, contract: 0 };
    log = [];
    paint();
  }

  // 每个动作 = 谁在调用 + 合约里的 require 检查
  const ACTIONS = [
    { actor: T("🧍 买家", "🧍 Buyer"), label: T("存入 2 ETH", "deposit 2 ETH"), run() {
        if (phase !== "EMPTY") return T("要求 阶段==空——钱已经存过了", "require phase==EMPTY — already deposited");
        bal.buyer -= 2; bal.contract += 2; phase = "DEP";
        return { ev: T("📥 事件：已存入(买家, 2 ETH)——钱现在锁在合约地址里", "📥 event: Deposited(buyer, 2 ETH) — money now locked at the contract address") };
      } },
    { actor: T("🧍 买家", "🧍 Buyer"), label: T("确认收货", "confirm delivery"), run() {
        if (phase !== "DEP") return T("要求 阶段==已存入——现在没有待确认的交易", "require phase==DEPOSITED — nothing awaiting confirmation");
        phase = "CONF";
        return { ev: T("✅ 事件：已确认(买家)——等仲裁人放款", "✅ event: Confirmed(buyer) — awaiting arbiter release") };
      } },
    { actor: T("🧍 买家", "🧍 Buyer"), label: T("发起争议", "raise dispute"), run() {
        if (phase !== "DEP") return T("要求 阶段==已存入——没有可争议的交易", "require phase==DEPOSITED — nothing to dispute");
        phase = "DISP";
        return { ev: T("⚡ 事件：争议(买家)——“货一直没到！”等仲裁人裁决", "⚡ event: Disputed(buyer) — “goods never arrived!” awaiting the arbiter's ruling") };
      } },
    { actor: T("🧑‍💼 卖家", "🧑‍💼 Seller"), label: T("把钱转给自己", "grab the money"), run() {
        return T("要求 调用者==仲裁人——卖家没有放款权限，想都别想", "require caller==arbiter — the seller has no release power, not a chance");
      } },
    { actor: T("⚖️ 仲裁人", "⚖️ Arbiter"), label: T("放款给卖家", "release to seller"), run() {
        if (phase !== "CONF" && phase !== "DISP") return T("要求 阶段==已确认或争议中——还没到放款环节", "require phase==CONFIRMED or DISPUTED — not at the release step yet");
        bal.contract -= 2; bal.seller += 2; phase = "REL";
        return { ev: T("💸 事件：已放款(卖家, 2 ETH)——交易完成", "💸 event: Released(seller, 2 ETH) — deal complete") };
      } },
    { actor: T("⚖️ 仲裁人", "⚖️ Arbiter"), label: T("退款给买家", "refund the buyer"), run() {
        if (phase !== "DISP") return T("要求 阶段==争议中——没有争议就不能退款", "require phase==DISPUTED — no refund without a dispute");
        bal.contract -= 2; bal.buyer += 2; phase = "REF";
        return { ev: T("↩️ 事件：已退款(买家, 2 ETH)——卖家一分拿不到", "↩️ event: Refunded(buyer, 2 ETH) — the seller gets nothing") };
      } },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("⚖️ 托管合约状态机：随便点，合约只认规则", "⚖️ Escrow state machine: click anything — the contract only obeys its rules")}</div>
      <div class="demo-switch">${T("剧本：", "Script: ")}
        <button class="demo-btn active" data-scen="smooth">${T("顺利交付", "Smooth delivery")}</button>
        <button class="demo-btn" data-scen="rug">${T("卖家跑路", "Seller vanishes")}</button>
      </div>
      <div class="demo-block" id="ec-hint"></div>
      <div class="demo-block" id="ec-state"></div>
      <div id="ec-btns"></div>
      <div class="demo-block"><div class="demo-label">${T("事件日志（合约的公开日记）", "Event log (the contract's public diary)")}</div><div id="ec-log" style="font-size:12.5px;font-family:var(--mono)"></div></div>
      <div class="demo-btns"><button class="demo-btn" id="ec-reset">${T("↺ 重新部署合约", "↺ Redeploy the contract")}</button></div>
      <p class="demo-tip">${T("试着乱点：卖家想直接拿钱、仲裁人想提前放款——统统<strong>回滚（revert）</strong>并附上原因，状态分毫不动。合约的力量=<strong>“规则先写死、执行不看脸”</strong>；RWA 的微妙处=规则还得能跟着法律改（<strong>可升级性</strong>，谁握升级钥匙就成了新的信任点）。", "Try clicking out of order: the seller grabbing the money, the arbiter releasing early — everything <strong>reverts</strong> with a reason, and state doesn't budge. A contract's power = <strong>rules fixed in advance, execution blind to faces</strong>; RWA's subtlety = the rules must still be able to follow the law (<strong>upgradeability</strong> — and whoever holds the upgrade key becomes the new trust point).")}</p>
    </div>`;

  const stateEl = root.querySelector("#ec-state"), logEl = root.querySelector("#ec-log"),
        btnsEl = root.querySelector("#ec-btns"), hintEl = root.querySelector("#ec-hint");

  function paint() {
    const done = phase === "REL" || phase === "REF";
    const col = phase === "REL" ? "var(--green)" : phase === "REF" ? "var(--red)" : phase === "EMPTY" ? "var(--muted)" : "var(--orange-ink)";
    stateEl.innerHTML = `
      <div class="demo-label">${T("合约状态（链上 storage，人人可读）", "Contract state (on-chain storage, readable by all)")}</div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:4px;font-size:13px;color:var(--ink)">
        <span>${T("阶段", "phase")}: <b style="color:${col}">${PHASES[phase]}</b></span>
        <span>${T("合约锁定", "contract holds")}: <b style="font-family:var(--mono)">${bal.contract} ETH</b></span>
        <span>${T("买家", "buyer")}: <b style="font-family:var(--mono)">${bal.buyer} ETH</b></span>
        <span>${T("卖家", "seller")}: <b style="font-family:var(--mono)">${bal.seller} ETH</b></span>
      </div>
      ${done ? `<div class="done-banner" style="margin-top:8px">${phase === "REL" ? T("✅ 终态：已放款——流程走完，合约不再接受任何调用。", "✅ Final state: RELEASED — flow complete, the contract accepts no further calls.") : T("✅ 终态：已退款——买家的钱回来了，流程走完。", "✅ Final state: REFUNDED — the buyer got the money back, flow complete.")}</div>` : ""}`;
    btnsEl.innerHTML = ACTIONS.map((a, i) =>
      `<div style="display:inline-block;margin:3px 6px 3px 0"><button class="demo-btn" data-a="${i}" ${done ? "disabled" : ""}>${a.actor} · ${a.label}()</button></div>`).join("");
    logEl.innerHTML = log.length ? log.join("") : `<div style="color:var(--muted)">${T("（空——合约刚部署）", "(empty — contract just deployed)")}</div>`;
    hintEl.innerHTML = `<div class="demo-label">${scen === "smooth"
      ? T("剧本提示【顺利交付】：买家·存入 → 买家·确认收货 → 仲裁人·放款。也欢迎故意点错，看合约怎么拒绝。", "Script hint [smooth delivery]: buyer·deposit → buyer·confirm → arbiter·release. Feel free to click wrong on purpose and watch the contract refuse.")
      : T("剧本提示【卖家跑路】：买家·存入 → （货没到）买家·发起争议 → 仲裁人·退款。注意卖家自始至终碰不到这笔钱。", "Script hint [seller vanishes]: buyer·deposit → (goods never arrive) buyer·raise dispute → arbiter·refund. Note the seller can never touch the money.")}</div>`;
    btnsEl.querySelectorAll("[data-a]").forEach((b) =>
      b.addEventListener("click", () => {
        const a = ACTIONS[+b.dataset.a];
        const r = a.run();
        if (typeof r === "string") {
          log.push(`<div style="color:var(--red);margin-top:3px">✗ ${a.actor} ${T("调用", "calls")} ${a.label}() → ${T("回滚", "REVERT")}: ${r}</div>`);
        } else {
          log.push(`<div style="color:var(--ink);margin-top:3px">${r.ev}</div>`);
        }
        paint();
      }));
  }

  root.querySelectorAll("[data-scen]").forEach((b) =>
    b.addEventListener("click", () => {
      scen = b.dataset.scen;
      root.querySelectorAll("[data-scen]").forEach((x) => x.classList.toggle("active", x.dataset.scen === scen));
      reset();
    }));
  root.querySelector("#ec-reset").addEventListener("click", reset);

  reset();
}
