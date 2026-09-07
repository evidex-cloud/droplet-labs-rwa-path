// 交互演示：真实密钥对实验室——生成 ECDSA 密钥、推导地址、给转账指令签名、验证、再篡改指令看签名当场作废。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  let keyPair = null, address = "", signature = null, signedMsg = "";

  const hex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const enc = (s) => new TextEncoder().encode(s);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔑 密钥实验室：生成 → 签名 → 验证 → 篡改", "🔑 Key lab: generate → sign → verify → tamper")}</div>
      <div class="demo-block">
        <div class="demo-label">${T("① 你的链上身份（真实 ECDSA P-256 密钥，当场生成）", "① Your on-chain identity (real ECDSA P-256 keys, generated live)")}</div>
        <div id="ks-id" style="font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:4px">${T("尚未生成——点下面的按钮。", "Not generated yet — hit the button below.")}</div>
      </div>
      <div class="demo-block">
        <div class="demo-label">${T("② 转账指令（可以随意编辑）", "② Transfer instruction (edit freely)")}</div>
        <input id="ks-msg" value="${T("转 100 TBF 给 Bob", "Send 100 TBF to Bob")}" style="width:100%;margin-top:6px;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--surface-2);color:var(--ink);font-family:var(--mono);font-size:13px" />
        <div id="ks-sig" style="font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:6px">${T("（尚无签名）", "(no signature yet)")}</div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="ks-gen">${T("🎲 生成密钥", "🎲 Generate keys")}</button>
        <button class="demo-btn" id="ks-sign" disabled>${T("✍️ 签名", "✍️ Sign")}</button>
        <button class="demo-btn" id="ks-verify" disabled>${T("🔍 验证", "🔍 Verify")}</button>
        <button class="demo-btn" id="ks-tamper" disabled>${T("😈 篡改后验证", "😈 Tamper, then verify")}</button>
      </div>
      <div id="ks-out"></div>
      <p class="demo-tip">${T("流程：生成密钥 → 签名 → 验证（✓）→ 篡改后验证（✗）。签名保证<strong>“指令没被改 + 确实是钥匙主人发的”</strong>，但保证不了<strong>钥匙主人是谁、有没有资格持有资产</strong>——那是合规层（阶段 7）的活。另注意：私钥全程没离开你的浏览器。", "Flow: generate → sign → verify (✓) → tamper then verify (✗). A signature guarantees <strong>“the instruction is unaltered + it truly came from the key's owner,”</strong> but never <strong>who that owner is, or whether they're eligible to hold the asset</strong> — that's the compliance layer's job (Stage 7). Also note: the private key never left your browser.")}</p>
    </div>`;

  const msgEl = root.querySelector("#ks-msg");
  const out = root.querySelector("#ks-out");
  const idEl = root.querySelector("#ks-id");
  const sigEl = root.querySelector("#ks-sig");
  const btn = (id) => root.querySelector(id);

  function say(html, ok) {
    const col = ok === true ? "var(--green)" : ok === false ? "var(--red)" : "var(--muted)";
    out.innerHTML = `<div class="demo-block" style="border-left:3px solid ${col};font-size:13px;color:var(--ink)">${html}</div>`;
  }

  btn("#ks-gen").addEventListener("click", async () => {
    keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    const raw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    const h = await crypto.subtle.digest("SHA-256", raw);
    address = "0x" + hex(h).slice(0, 40);
    signature = null; signedMsg = "";
    idEl.innerHTML = `${T("公钥", "public key")}: ${hex(raw).slice(0, 24)}…<br>${T("地址（公钥的哈希）", "address (hash of pubkey)")}: <b style="color:var(--orange-ink)">${address.slice(0, 14)}…${address.slice(-4)}</b><br><span style="color:var(--red)">${T("私钥：0x????……（只存在于你的浏览器内存里，永不示人）", "private key: 0x????…… (lives only in your browser's memory, never shown)")}</span>`;
    sigEl.textContent = T("（尚无签名）", "(no signature yet)");
    btn("#ks-sign").disabled = false; btn("#ks-verify").disabled = true; btn("#ks-tamper").disabled = true;
    say(T("✓ 密钥对已生成。这就是一个完整的链上身份——没注册、没审批、没联网请求。现在给指令签名吧。", "✓ Key pair generated. That's a complete on-chain identity — no registration, no approval, no network request. Now sign the instruction."), true);
  });

  btn("#ks-sign").addEventListener("click", async () => {
    signedMsg = msgEl.value;
    signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keyPair.privateKey, enc(signedMsg));
    sigEl.innerHTML = `${T("签名", "signature")}: <span style="color:var(--orange-ink)">${hex(signature).slice(0, 40)}…</span>`;
    btn("#ks-verify").disabled = false; btn("#ks-tamper").disabled = false;
    say(T(`✓ 已用<strong>私钥</strong>对指令 “${signedMsg}” 签名。接下来任何人都能用你的<strong>公钥</strong>验证它。`, `✓ Signed the instruction “${signedMsg}” with the <strong>private key</strong>. Now anyone can verify it with your <strong>public key</strong>.`), true);
  });

  async function verifyNow(prefix) {
    const current = msgEl.value;
    const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, keyPair.publicKey, signature, enc(current));
    if (ok) {
      say(`${prefix}✓ <strong>${T("验证通过", "Verification passed")}</strong> — ${T(`指令 “${current}” 与签名时一字不差，且签名确实出自地址 ${address.slice(0, 10)}… 的主人。节点会接受这笔交易。`, `the instruction “${current}” is exactly what was signed, and the signature truly came from the owner of ${address.slice(0, 10)}…. Nodes would accept this transaction.`)}`, true);
    } else {
      say(`${prefix}✗ <strong>${T("验证失败", "Verification FAILED")}</strong> — ${T(`当前指令 “${current}” 和签名对不上：要么内容被改过（原文是 “${signedMsg}”），要么签名不是这把钥匙生成的。节点会直接丢弃这笔交易。`, `the current instruction “${current}” doesn't match the signature: either the content changed (the original was “${signedMsg}”) or the signature came from a different key. Nodes would discard this transaction outright.`)}`, false);
    }
  }

  btn("#ks-verify").addEventListener("click", () => verifyNow(""));

  btn("#ks-tamper").addEventListener("click", async () => {
    // 中间人来了：把金额悄悄放大 10 倍（或在句尾加料）
    const v = msgEl.value;
    msgEl.value = v.includes("100") ? v.replace("100", "1000") : v + "!!";
    await verifyNow(`<span style="color:var(--red)">😈 ${T("中间人把指令改成了", "A middleman changed the instruction to")} “${msgEl.value}”。</span><br>`);
  });
}
