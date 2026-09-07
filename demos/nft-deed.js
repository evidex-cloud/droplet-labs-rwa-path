// 交互演示：从“地契 NFT”到“ERC-20 碎片”——铸造、篡改元数据（哈希当场识破）、锁入金库发碎片、收购投票卖整栋楼。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const META0 = T('{ "名称": "长街 12 号公寓", "面积": "89㎡" }', '{ "name": "12 Long St Apartment", "area": "89 m2" }');
  const HOLDERS = [["Alice", 400], ["Bob", 350], ["Carol", 250]];
  const THRESHOLD = 667; // 2/3 of 1000

  function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return "0x" + h.toString(16).padStart(8, "0"); }
  const REGISTERED = hash(META0);

  let step = 0, metaMut = META0, metaHash = META0, votes = { Alice: false, Bob: false, Carol: false }, sellTried = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🏠 从一栋楼到一千份：地契 NFT → 碎片", "🏠 From one building to a thousand shares: deed NFT → fractions")}</div>
      <div class="demo-btns" id="nd-steps" style="flex-wrap:wrap">
        <button class="demo-btn" data-step="1">${T("① 铸造地契 NFT", "① Mint the deed NFT")}</button>
        <button class="demo-btn" data-step="2">${T("② 试着篡改元数据", "② Try tampering the metadata")}</button>
        <button class="demo-btn" data-step="3">${T("③ 锁入金库，发 1000 FRAC", "③ Lock in vault, issue 1000 FRAC")}</button>
        <button class="demo-btn" data-step="4">${T("④ 尝试卖掉整栋楼", "④ Try to sell the whole building")}</button>
      </div>
      <div id="nd-out"></div>
      <p class="demo-tip">${T("<strong>NFT=登记“这一件”，ERC-20=登记“多少份”</strong>——真实资产常常两层都要。另外留意 ②：可变网址的“房契”能被悄悄改掉，带内容哈希的一改就露馅。", "<strong>NFT = registers “this one item”; ERC-20 = registers “how many shares”</strong> — real assets often need both layers. And note ②: a mutable-URL “deed” can be silently edited; a content-hashed one breaks the moment it's touched.")}</p>
    </div>`;

  const out = root.querySelector("#nd-out");

  function metaCard(title, meta, hashed) {
    const ok = !hashed || hash(meta) === REGISTERED;
    const verdict = hashed
      ? (ok ? `<span style="color:var(--green)">✓ ${T("哈希匹配，未被篡改", "hash matches — untouched")}</span>`
            : `<span style="color:var(--red)">✗ ${T("验证失败！算出 ", "VERIFICATION FAILED! computed ")}${hash(meta)} ≠ ${REGISTERED}</span>`)
      : `<span style="color:var(--orange-ink)">⚠ ${T("无哈希可验——改了你也发现不了", "no hash to check — you'd never notice the edit")}</span>`;
    return `<div class="demo-block"><div class="demo-label">${title}</div>
      <div style="font-family:var(--mono);font-size:12px;color:var(--ink)">${meta}</div>
      ${hashed ? `<div style="font-family:var(--mono);font-size:11px;color:var(--muted)">${T("链上登记的哈希", "hash registered on-chain")}: ${REGISTERED}</div>` : ""}
      <div style="font-size:12px;margin-top:4px">${verdict}</div></div>`;
  }

  function paint() {
    let h = "";
    if (step >= 1) {
      h += `<div class="demo-block"><div class="demo-label">${T("地契 NFT 已铸造", "Deed NFT minted")}</div>
        <div style="font-family:var(--mono);font-size:13px;color:var(--ink)">tokenId: <b>#1</b> · ownerOf(#1): <b style="color:var(--orange-ink)">${step >= 3 ? T("金库合约 🔒", "Vault contract 🔒") : "Issuer"}</b></div>
        <div style="font-family:var(--mono);font-size:12px;color:var(--muted)">tokenURI(#1) → metadata.json</div></div>`;
    }
    if (step === 2) {
      h += metaCard(T("A · 可变网址版（https://issuer.com/deed/1.json）", "A · mutable-URL version (https://issuer.com/deed/1.json)"), metaMut, false);
      h += metaCard(T("B · 内容哈希版（哈希已写入链上）", "B · content-hashed version (hash registered on-chain)"), metaHash, true);
      h += `<div class="demo-btns"><button class="demo-btn" id="nd-tamper">${T("😈 把两份“面积”都改成 39㎡", "😈 Edit both areas to 39 m2")}</button>
        <button class="demo-btn" id="nd-restore">${T("↺ 恢复原文件", "↺ Restore the files")}</button></div>`;
    }
    if (step >= 3) {
      h += `<div class="demo-block"><div class="demo-label">${T("金库发行的 FRAC（ERC-20，共 1000 枚）", "FRAC issued by the vault (ERC-20, 1000 total)")}</div>` +
        HOLDERS.map(([n, v]) => `<div style="display:flex;justify-content:space-between;padding:2px 8px;font-family:var(--mono);font-size:13px"><span style="color:var(--ink)">${n}</span><b style="color:var(--orange-ink)">${v}</b></div>`).join("") + `</div>`;
    }
    if (step >= 4 && sellTried) {
      const tally = HOLDERS.reduce((s, [n, v]) => s + (votes[n] ? v : 0), 0);
      h += `<div class="demo-block"><div class="demo-label">${T("卖整栋楼 = 收购投票（报价已入金库；门槛 ≥ 2/3，即 667/1000 份）", "Selling the whole building = buyout vote (bid escrowed in vault; threshold ≥ 2/3 = 667/1000 shares)")}</div>
        <div class="demo-warn" style="margin:6px 0">${T("你不能直接转走 NFT——ownerOf(#1) 是金库合约，个人无权动它。", "You can't just transfer the NFT — ownerOf(#1) is the vault contract; no individual can move it.")}</div>` +
        HOLDERS.map(([n, v]) => `<label style="display:block;font-size:13px;color:var(--ink);padding:2px 0"><input type="checkbox" data-vote="${n}" ${votes[n] ? "checked" : ""}/> ${n} ${T("同意出售", "votes yes")}（${v} ${T("份", "shares")}）</label>`).join("") +
        `<div style="margin-top:6px;font-weight:700;color:${tally >= THRESHOLD ? "var(--green)" : "var(--red)"}">${T("赞成", "Yes")}: ${tally}/1000 ${tally >= THRESHOLD ? "" : T("（未达 667）", "(below 667)")}</div>` +
        (tally >= THRESHOLD ? `<div class="done-banner" style="margin-top:6px">${T("✅ 门槛达成：强制成交，NFT 交割给买家，1000 份持有人按份分钱。", "✅ Threshold met: forced settlement — the NFT goes to the buyer, all 1000 shares are paid out pro rata.")}</div>` : "") + `</div>`;
    }
    out.innerHTML = h || `<div class="demo-block demo-label">${T("从 ① 开始，一步步走完一栋楼的代币化。", "Start at ① and walk one building through tokenization.")}</div>`;

    root.querySelectorAll("[data-step]").forEach((b) => {
      const s = +b.dataset.step;
      b.classList.toggle("active", s <= step);
      b.disabled = s > step + 1;
    });
    const tb = root.querySelector("#nd-tamper");
    if (tb) tb.addEventListener("click", () => { metaMut = metaMut.replace(/89/, "39"); metaHash = metaHash.replace(/89/, "39"); paint(); });
    const rb = root.querySelector("#nd-restore");
    if (rb) rb.addEventListener("click", () => { metaMut = META0; metaHash = META0; paint(); });
    root.querySelectorAll("[data-vote]").forEach((c) => c.addEventListener("change", () => { votes[c.dataset.vote] = c.checked; paint(); }));
  }

  root.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
    const s = +b.dataset.step;
    if (s <= step + 1) { step = Math.max(step, s); if (s === 4) sellTried = true; paint(); }
  }));

  paint();
}
