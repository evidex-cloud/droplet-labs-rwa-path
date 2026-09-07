// 交互演示：一个“活的”ERC-20 合约——一张地址→余额表 + transfer/mint/burn/approve/transferFrom，每个动作都写事件日志，失败则 revert。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const NAMES = ["Issuer", "Alice", "Bob", "Carol"];
  let balances = { Issuer: 1000, Alice: 0, Bob: 0, Carol: 0 };
  let totalSupply = 1000;
  let allowances = {}; // "owner→spender" : amount
  let log = [];

  const opts = NAMES.map((n) => `<option value="${n}">${n}</option>`).join("");

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🪙 一个活的 ERC-20 合约 · 亲手改这张表", "🪙 A live ERC-20 contract · edit the table yourself")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("合约状态：balances 表 + totalSupply", "Contract state: balances table + totalSupply")}</div>
        <div id="e20-table"></div>
        <div class="demo-label" style="margin-top:8px">${T("allowance 授权表", "allowance table")}：<span id="e20-allow" style="font-family:var(--mono)">${T("（空）", "(empty)")}</span></div>
      </div>
      <div class="demo-block">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <label class="demo-label">${T("甲", "A")}: <select id="e20-from">${opts}</select></label>
          <label class="demo-label">${T("乙", "B")}: <select id="e20-to">${opts.replace('value="Alice"', 'value="Alice" selected')}</select></label>
          <label class="demo-label">${T("数量", "Amount")}: <input id="e20-amt" type="number" value="100" min="1" style="width:70px" /></label>
        </div>
        <div class="demo-btns" style="margin-top:8px;flex-wrap:wrap">
          <button class="demo-btn" data-act="transfer">transfer ${T("甲→乙", "A→B")}</button>
          <button class="demo-btn" data-act="mint">mint ${T("给乙", "to B")}</button>
          <button class="demo-btn" data-act="burn">burn ${T("烧甲", "from A")}</button>
          <button class="demo-btn" data-act="approve">approve ${T("甲授权乙", "A authorizes B")}</button>
          <button class="demo-btn" data-act="transferFrom">transferFrom ${T("乙代扣甲", "B pulls from A")}</button>
        </div>
        <div class="demo-label" style="margin-top:6px">${T("mint/burn 视作发行方权限：申购=mint，赎回=burn。", "Treat mint/burn as issuer-only: subscription = mint, redemption = burn.")}</div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("📢 事件日志（钱包和浏览器读的就是这里）", "📢 Event log (this is what wallets & explorers read)")}</div>
        <div id="e20-log" style="font-family:var(--mono);font-size:12px;line-height:1.7;max-height:150px;overflow:auto">${T("（还没有事件）", "(no events yet)")}</div>
      </div>
      <p class="demo-tip">${T("试试：先 transfer 超过余额（revert）；再 approve 50 后 transferFrom 80（revert：额度不够）。<strong>整个“代币经济”的底层就是这张表 + 两类事件</strong>——RWA 要做的，是给 transfer 加上“谁有资格”的检查（阶段 6）。", "Try: transfer more than the balance (revert); then approve 50 and transferFrom 80 (revert: allowance too low). <strong>The entire “token economy” bottoms out in this table + two event types</strong> — what RWA adds is a “who is eligible” check on transfer (Stage 6).")}</p>
    </div>`;

  const tableEl = root.querySelector("#e20-table");
  const allowEl = root.querySelector("#e20-allow");
  const logEl = root.querySelector("#e20-log");

  function paint() {
    tableEl.innerHTML = NAMES.map((n) =>
      `<div style="display:flex;justify-content:space-between;padding:3px 8px;border-bottom:1px dashed var(--line);font-family:var(--mono);font-size:13px">
        <span style="color:var(--ink)">${n}</span><b style="color:var(--orange-ink)">${balances[n]}</b>
      </div>`).join("") +
      `<div style="display:flex;justify-content:space-between;padding:4px 8px;font-family:var(--mono);font-size:13px">
        <span style="color:var(--muted)">totalSupply</span><b style="color:var(--ink)">${totalSupply}</b>
      </div>`;
    const pairs = Object.entries(allowances).filter(([, v]) => v > 0);
    allowEl.textContent = pairs.length ? pairs.map(([k, v]) => `${k}: ${v}`).join("  ·  ") : T("（空）", "(empty)");
    logEl.innerHTML = log.length
      ? log.map((l) => `<div style="color:${l.err ? "var(--red)" : "var(--ink)"}">${l.msg}</div>`).join("")
      : T("（还没有事件）", "(no events yet)");
    logEl.scrollTop = logEl.scrollHeight;
  }

  function emit(msg) { log.push({ msg }); }
  function revert(reason) { log.push({ err: true, msg: `✗ revert: ${reason}` }); }

  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
    const from = root.querySelector("#e20-from").value;
    const to = root.querySelector("#e20-to").value;
    const amt = Math.max(1, parseInt(root.querySelector("#e20-amt").value, 10) || 0);
    const act = b.dataset.act;
    if (act === "transfer") {
      if (from === to) revert(T("甲乙相同，转了个寂寞", "A and B are the same address"));
      else if (balances[from] < amt) revert(T(`余额不足（${from} 只有 ${balances[from]}）`, `insufficient balance (${from} has ${balances[from]})`));
      else { balances[from] -= amt; balances[to] += amt; emit(`Transfer(${from}, ${to}, ${amt})`); }
    } else if (act === "mint") {
      balances[to] += amt; totalSupply += amt;
      emit(`Transfer(0x0, ${to}, ${amt})  ${T("← mint（申购）", "← mint (subscription)")}`);
    } else if (act === "burn") {
      if (balances[from] < amt) revert(T(`余额不足，烧不掉（${from} 只有 ${balances[from]}）`, `insufficient balance to burn (${from} has ${balances[from]})`));
      else { balances[from] -= amt; totalSupply -= amt; emit(`Transfer(${from}, 0x0, ${amt})  ${T("← burn（赎回）", "← burn (redemption)")}`); }
    } else if (act === "approve") {
      if (from === to) revert(T("自己授权自己没有意义", "approving yourself is pointless"));
      else { allowances[`${from}→${to}`] = amt; emit(`Approval(${from}, ${to}, ${amt})`); }
    } else if (act === "transferFrom") {
      const key = `${from}→${to}`;
      const al = allowances[key] || 0;
      if (al < amt) revert(T(`授权额度不足（${key} 只剩 ${al}，先 approve）`, `insufficient allowance (${key} has ${al} left — approve first)`));
      else if (balances[from] < amt) revert(T(`余额不足（${from} 只有 ${balances[from]}）`, `insufficient balance (${from} has ${balances[from]})`));
      else { allowances[key] = al - amt; balances[from] -= amt; balances[to] += amt; emit(`Transfer(${from}, ${to}, ${amt})  ${T("← 经 transferFrom 代扣", "← via transferFrom")}`); }
    }
    paint();
  }));

  paint();
}
