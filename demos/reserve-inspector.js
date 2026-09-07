// 交互演示：储备报告质检员——用五问清单逐行审两份虚构的稳定币储备报告，找出埋好的雷。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const reports = [
    {
      name: "StableX",
      lines: [
        { q: T("① 日期", "① Date"), text: T("快照日：上季度末（距今 45 天）", "Snapshot: last quarter-end (45 days ago)"), bad: true,
          note: T("⚠ 45 天前的快照对今天的偿付能力说明有限；只挑季度末拍照 = 窗口粉饰的高发区", "⚠ A 45-day-old snapshot says little about solvency today; quarter-end-only photos are prime window-dressing territory") },
        { q: T("② 性质", "② Nature"), text: T("“基于管理层声明执行约定程序（AUP）”", "“Agreed-upon procedures over management's assertion (AUP)”"), bad: true,
          note: T("⚠ 关键词暴露这是鉴证不是审计：只核对快照那一刻，不看内控、不覆盖期间", "⚠ The keywords give it away: attestation, not audit — one instant reconciled, no controls, no period coverage") },
        { q: T("③ 署名", "③ Signature"), text: T("“由一家国际咨询机构复核”（未具名）", "“Reviewed by an international consultancy” (unnamed)"), bad: true,
          note: T("⚠ 没有可吊销牌照的署名事务所，报告可信度归零", "⚠ No named firm with a license to lose — credibility rounds to zero") },
        { q: T("④ 颗粒度", "④ Granularity"), text: T("资产表：“现金及现金等价物 62%，其他投资 38%”", "Asset table: “cash & cash equivalents 62%, other investments 38%”"), bad: true,
          note: T("⚠ 烟雾弹桶：现金在哪些银行？“等价物”是国债还是商业票据？“其他投资”是什么？", "⚠ Smokescreen buckets: cash at which banks? Are the “equivalents” T-bills or CP? What are “other investments”?") },
        { q: T("⑤ 负担", "⑤ Encumbrance"), text: T("脚注 7：“部分资产为对关联方的有担保贷款”", "Footnote 7: “certain assets are secured loans to affiliates”"), bad: true,
          note: T("⚠ 关联方贷款在质量阶梯最底层，且全文没有“无质押/无再抵押”声明", "⚠ Affiliate loans sit at the bottom of the ladder — and nowhere does it say “unpledged / not rehypothecated”") },
      ],
    },
    {
      name: "SolidUSD",
      lines: [
        { q: T("① 日期", "① Date"), text: T("快照日：本月 25 日（6 天前），每月一次，日期不固定", "Snapshot: the 25th (6 days ago), monthly, on unannounced dates"), bad: false,
          note: T("✓ 快照新鲜、频率月度、日期不固定——粉饰窗口很难卡点", "✓ Fresh snapshot, monthly cadence, unannounced dates — hard to window-dress around") },
        { q: T("② 性质", "② Nature"), text: T("月度鉴证（ISAE 4400）+ 母公司年度完整审计", "Monthly attestation (ISAE 4400) + annual full audit of the parent"), bad: false,
          note: T("✓ 仍是鉴证（诚实标注），但叠加了年度审计——这已是行业最高配置", "✓ Still an attestation (honestly labeled), but stacked with an annual audit — the industry's best current setup") },
        { q: T("③ 署名", "③ Signature"), text: T("四大会计师事务所之一，签字盖章", "A Big Four firm, signed and stamped"), bad: false,
          note: T("✓ 有牌照可吊销的署名机构，造假成本极高", "✓ A named firm with a license to lose — lying is expensive") },
        { q: T("④ 颗粒度", "④ Granularity"), text: T("82% 政府 MMF（逐 CUSIP 列出持仓）+ 18% 现金（列出各银行名称与金额）", "82% gov MMF (holdings listed CUSIP by CUSIP) + 18% cash (banks named with amounts)"), bad: false,
          note: T("✓ 金标准颗粒度：能查到每一只国债、每一家银行", "✓ Gold-standard granularity: every T-bill and every bank is checkable") },
        { q: T("⑤ 负担", "⑤ Encumbrance"), text: T("声明：“所有储备资产无质押、无留置、未再抵押”", "Statement: “all reserve assets are unpledged, lien-free, not rehypothecated”"), bad: false,
          note: T("✓ 明确的无负担声明——只字不提才是红旗", "✓ An explicit encumbrance statement — silence would be the red flag") },
      ],
    },
  ];

  let opened = 0;
  const total = 10;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${T("🔍 储备报告质检员：五问清单实战", "🔍 Reserve-report inspector: the five questions in action")}</div>
      <div class="demo-label">${T("两家虚构发行方各交了一份“透明度报告”。逐行点击，用五问清单收集证据（已查 ", "Two fictional issuers filed “transparency reports.” Click each line and gather evidence with the five questions (inspected ")}<b id="ri-count">0</b>/${total}${T(" 行），然后判断谁更安全。", " lines), then judge which is safer.")}</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
        ${reports.map((r, ri) => `
          <div class="demo-block" style="flex:1;min-width:260px">
            <div style="font-weight:700;color:var(--ink);margin-bottom:6px">📄 ${r.name}</div>
            ${r.lines.map((l, li) => `
              <div class="ri-line" data-r="${ri}" data-l="${li}" style="border:1px solid var(--line);border-radius:8px;padding:6px 8px;margin-bottom:6px;cursor:pointer">
                <div style="font-size:0.85em;color:var(--muted)">${l.q}</div>
                <div style="font-size:0.9em;color:var(--ink)">${l.text}</div>
                <div class="ri-note" style="display:none;font-size:0.85em;margin-top:4px;color:${l.bad ? "var(--red)" : "var(--green)"}">${l.note}</div>
              </div>`).join("")}
          </div>`).join("")}
      </div>
      <div class="demo-btns">${T("更安全的发行方是：", "The safer issuer is: ")}
        <button class="demo-btn" data-pick="0">StableX</button>
        <button class="demo-btn" data-pick="1">SolidUSD</button>
      </div>
      <div id="ri-result"></div>
      <p class="demo-tip">${T("五问：<strong>日期、性质、署名、颗粒度、负担</strong>。注意 StableX 每一行都“恰好没答”你该问的问题——会读储备报告，你就已经超过 95% 的持币人。", "The five questions: <strong>date, nature, signature, granularity, encumbrance</strong>. Notice how every StableX line conveniently dodges exactly what you should ask — read reserve reports like this and you're ahead of 95% of holders.")}</p>
    </div>`;

  root.querySelectorAll(".ri-line").forEach((el) => {
    el.addEventListener("click", () => {
      const note = el.querySelector(".ri-note");
      if (note.style.display === "none") {
        note.style.display = "block";
        el.style.background = "var(--surface-2)";
        opened++;
        root.querySelector("#ri-count").textContent = opened;
      } else {
        note.style.display = "none";
        el.style.background = "";
      }
    });
  });

  root.querySelectorAll("[data-pick]").forEach((b) => {
    b.addEventListener("click", () => {
      const right = b.dataset.pick === "1";
      root.querySelector("#ri-result").innerHTML = right
        ? `<div class="done-banner">${T("✅ 正确。SolidUSD 五问全过：快照新鲜且突击、诚实标注鉴证并叠加审计、四大署名、逐 CUSIP 颗粒度、明确无负担声明。StableX 埋了五颗雷：45 天前的季度末快照、无名“复核”、烟雾弹资产桶、关联方贷款脚注、零负担声明。", "✅ Correct. SolidUSD passes all five: fresh unannounced snapshot, honestly-labeled attestation stacked with an audit, Big Four signature, CUSIP-level granularity, explicit encumbrance statement. StableX planted five mines: a 45-day-old quarter-end snapshot, an unnamed “review,” smokescreen buckets, an affiliate-loan footnote, and no encumbrance statement.")}</div>`
        : `<div class="demo-warn">${T("⚠ 再看一眼。StableX 的报告每一行都在回避五问：快照是 45 天前的季度末、核查方未具名、“现金及等价物”不拆分、脚注藏着关联方贷款、全文没有无负担声明。点开每一行的证据再判断。", "⚠ Look again. Every line of StableX's report dodges the five questions: a 45-day-old quarter-end snapshot, an unnamed reviewer, an unsplit “cash & equivalents” bucket, an affiliate loan buried in a footnote, and no encumbrance statement anywhere. Open each line's evidence and re-judge.")}</div>`;
    });
  });
}
