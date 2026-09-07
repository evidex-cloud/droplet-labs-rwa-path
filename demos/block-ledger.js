// 交互演示：一条可篡改实验的迷你区块链——改一条记录，真实 SHA-256 雪崩，下游区块全部断裂；重挖也过不了全网这一关。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const RECORDS = [
    T("创世发行：Alice: 100 TBF", "Genesis issue: Alice: 100 TBF"),
    T("Bob: 250 TBF", "Bob: 250 TBF"),
    T("Carol: 40 TBF", "Carol: 40 TBF"),
    T("Dan: 75 TBF", "Dan: 75 TBF"),
  ];
  const N = RECORDS.length;
  // blocks[i] = { data, prevHash, hash }；networkTip = 其他节点公认的末块哈希
  let blocks = [], networkTip = "", banner = "";

  async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const short = (h) => h.slice(0, 16) + "…";

  async function mineAll() {
    let prev = "0000000000000000";
    for (let i = 0; i < N; i++) {
      blocks[i].prevHash = prev;
      blocks[i].hash = await sha256(i + "|" + prev + "|" + blocks[i].data);
      prev = blocks[i].hash;
    }
  }

  async function init() {
    blocks = RECORDS.map((data) => ({ data, prevHash: "", hash: "" }));
    await mineAll();
    networkTip = blocks[N - 1].hash; // 其他节点存档的“正确末块”
    banner = "";
    paint();
  }

  function paint() {
    let html = "";
    for (let i = 0; i < N; i++) {
      const b = blocks[i];
      const linkOk = i === 0 || b.prevHash === blocks[i - 1].hash;
      const border = linkOk ? "var(--line)" : "var(--red)";
      html += `
        <div class="demo-block" style="border:1.5px solid ${border};margin-bottom:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <b style="color:var(--ink)">${T("区块", "Block")} #${i + 1}</b>
            ${linkOk ? "" : `<span style="color:var(--red);font-weight:700">✗ ${T("链断了：前块哈希对不上", "broken: prev-hash mismatch")}</span>`}
          </div>
          <div class="demo-label" style="margin-top:4px">${T("前块哈希", "prev hash")}: <code style="font-family:var(--mono);color:${linkOk ? "var(--muted)" : "var(--red)"}">${short(b.prevHash)}</code></div>
          <input data-i="${i}" value="${b.data.replace(/"/g, "&quot;")}" style="width:100%;margin:6px 0;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--surface-2);color:var(--ink);font-family:var(--mono);font-size:13px" />
          <div class="demo-label">${T("本块哈希", "this hash")}: <code style="font-family:var(--mono);color:var(--orange-ink)">${short(b.hash)}</code></div>
        </div>`;
    }
    const tipOk = blocks[N - 1].hash === networkTip && blocks.every((b, i) => i === 0 || b.prevHash === blocks[i - 1].hash);
    root.querySelector("#bl-chain").innerHTML = html;
    root.querySelector("#bl-net").innerHTML = `
      <div class="demo-label">${T("其他节点（全网副本）记录的末块哈希：", "Tip hash held by the other nodes (the network's copies):")}</div>
      <div style="font-family:var(--mono);font-size:13px;color:var(--muted)">${short(networkTip)}</div>
      <div style="margin-top:4px;font-weight:700;color:${tipOk ? "var(--green)" : "var(--red)"}">
        ${tipOk
          ? T("✓ 节点 A、B、C：与我一致，接受", "✓ Nodes A, B, C: matches mine — accepted")
          : T("✗ 节点 A、B、C：与我的副本不一致，拒绝你的链！", "✗ Nodes A, B, C: doesn't match my copy — chain rejected!")}
      </div>`;
    root.querySelector("#bl-banner").innerHTML = banner;
    // 重新挂输入监听（innerHTML 重绘后）
    root.querySelectorAll("input[data-i]").forEach((inp) =>
      inp.addEventListener("input", async (e) => {
        const i = +e.target.dataset.i;
        blocks[i].data = e.target.value;
        // 只重算被改的这一块——prevHash 保持原样，下游自然断裂
        blocks[i].hash = await sha256(i + "|" + blocks[i].prevHash + "|" + blocks[i].data);
        banner = `<div class="demo-warn">${T("⚠ 雪崩效应：这一块的哈希已面目全非，后面每一块记录的“前块哈希”都对不上了。", "⚠ Avalanche: this block's hash is unrecognizable — every later block's recorded “prev hash” now fails.")}</div>`;
        paintPreserveFocus(i, e.target);
      }));
  }

  // 重绘但保住正在输入的焦点与光标
  function paintPreserveFocus(i, oldInput) {
    const pos = oldInput.selectionStart;
    paint();
    const ni = root.querySelector(`input[data-i="${i}"]`);
    if (ni) { ni.focus(); ni.setSelectionRange(pos, pos); }
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("⛓️ 篡改一条链上记录，看看要付出什么", "⛓️ Tamper with one on-chain record and see what it costs")}</div>
      <div class="demo-label" style="margin-bottom:6px">${T("试试把区块 #2 里 Bob 的 250 改成 999（真实 SHA-256，当场计算）：", "Try changing Bob's 250 in block #2 to 999 (real SHA-256, computed live):")}</div>
      <div id="bl-chain"></div>
      <div class="demo-block" id="bl-net"></div>
      <div id="bl-banner"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="bl-remine">${T("⛏ 作弊者视角：重挖整条链", "⛏ Cheater's move: re-mine the chain")}</button>
        <button class="demo-btn" id="bl-reset">${T("↺ 恢复原账本", "↺ Restore the ledger")}</button>
      </div>
      <p class="demo-tip">${T("注意两件事：① 链<strong>拦不住</strong>你在输入框里写下任何谎言——它不验证内容真假；② 但任何<strong>事后修改</strong>都会立刻变得震耳欲聋：哈希雪崩、下游全断，就算你重算完整条链，全网其他副本仍会拒绝你。链防“改”，不防“骗”——防骗靠链下结构（阶段 1.3）。", "Notice two things: ① the chain <strong>cannot stop</strong> you from typing any lie into the box — it never verifies truth; ② but any <strong>after-the-fact edit</strong> instantly becomes deafening: hashes avalanche, everything downstream breaks, and even after re-mining the whole chain, the network's other copies still reject yours. The chain prevents edits, not lies — lies are for the off-chain structure to catch (Stage 1.3).")}</p>
    </div>`;

  root.querySelector("#bl-remine").addEventListener("click", async () => {
    // 找到第一处断裂，从那里向后逐块重算
    let firstBad = -1;
    for (let i = 1; i < N; i++) if (blocks[i].prevHash !== blocks[i - 1].hash) { firstBad = i; break; }
    if (firstBad === -1) {
      banner = `<div class="demo-warn">${T("链目前是完整的——先改一条记录再来重挖。", "The chain is intact — edit a record first, then re-mine.")}</div>`;
      paint(); return;
    }
    let count = 0;
    for (let i = firstBad; i < N; i++) {
      blocks[i].prevHash = blocks[i - 1].hash;
      blocks[i].hash = await sha256(i + "|" + blocks[i].prevHash + "|" + blocks[i].data);
      count++;
    }
    banner = `<div class="demo-warn">${T(`⛏ 你重算了 <strong>${count} 个区块</strong>才把链“缝”回去（真链上这是篡改点之后的<strong>数百万个块</strong>）。但看下面——其他节点手里的副本没变，你的链照样被拒收。`, `⛏ You recomputed <strong>${count} block(s)</strong> to stitch the chain back up (on a real chain that's <strong>millions of blocks</strong> after the tampering point). But look below — the other nodes' copies haven't changed, and your chain is still rejected.`)}</div>`;
    paint();
  });
  root.querySelector("#bl-reset").addEventListener("click", init);

  init();
}
