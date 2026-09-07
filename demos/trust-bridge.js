// 交互演示：信任之桥——点击拆掉/恢复五根柱子（托管/审计/预言机/监管/法律），看各自会引发哪种灾难。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const pillars = [
    { id: "cust", icon: "🏦", name: T("托管", "Custody"), keeps: T("资产被独立隔离保管", "Assets held segregated & independent"),
      disaster: T("资产不翼而飞：没有独立托管人，发行方随手挪用——FTX 式混同，代币还在链上飞，铜早已不在仓库里。", "Assets walk away: with no independent custodian the issuer dips in at will — FTX-style commingling. Tokens keep flying on-chain; the copper left the warehouse long ago.") },
    { id: "audit", icon: "🧾", name: T("审计", "Audit"), keeps: T("定期核对“链上币 vs 链下货”", "Periodic on-chain vs off-chain reconciliation"),
      disaster: T("无锚铸币无人发现：没人对表，凭空铸的币和真币长得一模一样——仓库空了半年，单据照常交易。", "Unbacked minting goes unnoticed: nobody reconciles, and counterfeit tokens look identical to real ones — the warehouse sits empty for months while receipts keep trading.") },
    { id: "oracle", icon: "📡", name: T("预言机", "Oracle"), keeps: T("把 NAV/储备事实搬上链", "Carries NAV/reserve facts on-chain"),
      disaster: T("镜子过期：NAV 停在上周，二级市场按错误价格盲飞——真相追上来那天，最后接盘的人埋单。", "Stale mirror: NAV frozen at last week's number, the secondary market flying blind at wrong prices — when truth catches up, the last buyer eats the loss.") },
    { id: "reg", icon: "⚖️", name: T("监管", "Regulator"), keeps: T("发牌照 · 罚款 · 吊销 · 起诉", "Licenses · fines · revocations · prosecution"),
      disaster: T("撒谎零成本：没人发牌也没人追责，假仓库满街开——2017–19 年 STO 泡沫的灰色地带重演。", "Lying costs nothing: no licenses, no accountability, fake warehouses on every corner — the 2017–19 STO wave's gray zone all over again.") },
    { id: "law", icon: "🏛", name: T("法律", "Law"), keeps: T("“代币=请求权”可上法庭强制执行", "Makes “token = claim” court-enforceable"),
      disaster: T("请求权成空文：出事后你发现自己既非股东也非债权人，只是“持有一串数字的人”——攥着真单据，仓库门就是不开。", "The claim is a dead letter: after the blowup you're neither shareholder nor creditor, just “someone holding digits” — clutching a genuine receipt at a door that will not open.") },
  ];

  const removed = new Set();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🌉 信任之桥 · 拆一根柱子试试", "🌉 The trust bridge · try removing a pillar")}</div>
      <div class="demo-label">${T("点击柱子拆掉/恢复它：", "Click a pillar to remove/restore it:")}</div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:4px;margin:10px 0 0">
        <div style="flex:0 0 auto;text-align:center;padding:8px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface-2);font-size:11px;color:var(--ink)">${T("资产<br>世界", "Asset<br>world")}</div>
        <div style="flex:1">
          <div id="tb-deck" style="height:10px;border-radius:6px;margin-bottom:4px"></div>
          <div id="tb-pillars" style="display:flex;gap:4px;justify-content:space-between"></div>
        </div>
        <div style="flex:0 0 auto;text-align:center;padding:8px 6px;border:1px solid var(--line);border-radius:8px;background:var(--green-soft);font-size:11px;color:var(--ink)">${T("链上<br>世界", "On-chain<br>world")}</div>
      </div>
      <div id="tb-out" style="margin-top:10px"></div>
      <p class="demo-tip">${T("<strong>去掉哪根柱子都塌——所以尽调要一根根敲。</strong>每根柱子问三件事：具体是谁？多久验一次？撒谎会怎样？答不出名字的柱子，视同不存在。", "<strong>Remove any pillar and the bridge falls — which is why diligence means knocking on them one by one.</strong> Ask each pillar: who exactly? how often verified? what if they lie? A pillar with no name is a pillar that isn't there.")}</p>
    </div>`;

  const pillarsEl = root.querySelector("#tb-pillars");
  const deckEl = root.querySelector("#tb-deck");
  const outEl = root.querySelector("#tb-out");

  function paint() {
    const intact = removed.size === 0;
    deckEl.style.background = intact ? "var(--orange-soft)" : "var(--red-soft, var(--surface-2))";
    deckEl.style.border = `1px ${intact ? "solid var(--orange-line)" : "dashed var(--red)"}`;
    pillarsEl.innerHTML = pillars.map((p) => {
      const off = removed.has(p.id);
      return `<button data-p="${p.id}" style="flex:1;cursor:pointer;padding:10px 2px;border-radius:8px;font-family:inherit;
        border:1px ${off ? "dashed var(--red)" : "solid var(--orange-line)"};
        background:${off ? "transparent" : "var(--surface-2)"};
        color:${off ? "var(--red)" : "var(--ink)"};opacity:${off ? 0.55 : 1}">
        <div style="font-size:16px">${off ? "💥" : p.icon}</div>
        <div style="font-size:11px;font-weight:700">${p.name}</div>
      </button>`;
    }).join("");

    if (intact) {
      outEl.innerHTML = `<div class="done-banner">${T("✅ 五柱俱全：五个具名实体互相制衡，必须全部合谋才能骗你。", "✅ All five pillars standing: five named entities checking one another — they'd all have to collude to cheat you.")}</div>
        <div style="margin-top:8px">${pillars.map((p) => `<div style="font-size:12px;color:var(--muted);margin:3px 0">${p.icon} <b style="color:var(--ink)">${p.name}</b> —— ${p.keeps}</div>`).join("")}</div>`;
    } else {
      outEl.innerHTML = [...removed].map((id) => {
        const p = pillars.find((x) => x.id === id);
        return `<div class="demo-warn" style="margin:6px 0"><strong>${p.icon} ${T("拆掉", "Removed")}「${p.name}」→</strong> ${p.disaster}</div>`;
      }).join("") + (removed.size >= 3
        ? `<div style="font-size:12px;color:var(--red);font-weight:700;margin-top:6px">${T("⚠ 桥已塌成危房：这样的项目，代币印得再精美也只是收据——链下结构没了，信任无处可依。", "⚠ The bridge is condemned: however beautifully the token is printed, it's just a receipt — with the off-chain structure gone, trust has nowhere to stand.")}</div>` : "");
    }
    pillarsEl.querySelectorAll("[data-p]").forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.p;
        removed.has(id) ? removed.delete(id) : removed.add(id);
        paint();
      }));
  }
  paint();
}
