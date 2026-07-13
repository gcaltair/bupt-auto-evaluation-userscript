// ==UserScript==
// @name         强智教务系统自动评教助手（随机评语版）- 兼容 VPN
// @namespace    https://github.com/gcaltair/bupt-auto-evaluation-userscript
// @version      1.2.1
// @description  自动选择“完全符合”，勾选正面评语，并随机从语料库中抽取亮点与改进建议填入文本框。填充后请人工检查再保存。
// @author       gcaltair
// @license      MIT
// @match        *://*/*jsxsd/*
// @match        *://webvpn.bupt.edu.cn/*
// @run-at       document-end
// @allFrames    true
// @grant        none
// @homepageURL  https://github.com/gcaltair/bupt-auto-evaluation-userscript
// @supportURL   https://github.com/gcaltair/bupt-auto-evaluation-userscript/issues
// @downloadURL  https://raw.githubusercontent.com/gcaltair/bupt-auto-evaluation-userscript/main/bupt-auto-evaluation.user.js
// @updateURL    https://raw.githubusercontent.com/gcaltair/bupt-auto-evaluation-userscript/main/bupt-auto-evaluation.user.js
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "bupt-auto-evaluation-button";

  const advList = [
    "希望老师继续保持现有的优秀教学风格。",
    "教学已经很完美，希望未来能多跟我们分享一些业界的实际案例。",
    "希望老师能在后续课程中继续保持这种高水平的互动课堂。",
    "没有需要改进的地方，整体教学节奏和内容安排非常合理。",
    "希望老师未来能多推荐一些相关的拓展前沿文献或书籍。",
  ];

  const highlightList = [
    "老师教学思路清晰，课件制作精美，能够把复杂的概念讲得通俗易懂。",
    "课堂氛围轻松愉快，老师极其有耐心，对同学们的提问解答非常及时细致。",
    "老师拥有深厚的专业知识储备，讲课富有感染力，能有效调动大家的学习积极性。",
    "课程内容充实合理，理论与实际结合紧密，让我们在实践中真正掌握了技能。",
    "老师对待教学认真负责，治学严谨，同时又非常关爱学生，是一位德才兼备的好老师。",
  ];

  function notifyChange(element) {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function sample(items, count) {
    return [...items].sort(() => Math.random() - 0.5).slice(0, count);
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function init() {
    const textareas = document.querySelectorAll("textarea");
    const radios = document.querySelectorAll('input[type="radio"]');

    if ((textareas.length === 0 && radios.length === 0) || document.getElementById(BUTTON_ID)) {
      return;
    }

    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.type = "button";
    btn.textContent = "⚡ 随机一键好评";
    Object.assign(btn.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "99999",
      padding: "10px 20px",
      backgroundColor: "#008CBA",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      fontSize: "14px",
    });

    btn.addEventListener("click", () => {
      document.querySelectorAll("table tr").forEach((row) => {
        const rowRadios = row.querySelectorAll('input[type="radio"]');
        if (rowRadios.length > 0) {
          rowRadios[0].checked = true;
          notifyChange(rowRadios[0]);
        }
      });

      const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')];
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        notifyChange(checkbox);
      });

      const maxCandidateCount = Math.min(checkboxes.length, 10);
      const checkedCount = Math.min(maxCandidateCount, Math.floor(Math.random() * 3) + 3);
      sample(checkboxes.slice(0, maxCandidateCount), checkedCount).forEach((checkbox) => {
        checkbox.checked = true;
        notifyChange(checkbox);
      });

      const currentTextareas = document.querySelectorAll("textarea");
      if (currentTextareas.length >= 2) {
        currentTextareas[0].value = pickRandom(advList);
        notifyChange(currentTextareas[0]);
        currentTextareas[1].value = pickRandom(highlightList);
        notifyChange(currentTextareas[1]);
      } else if (currentTextareas.length === 1) {
        currentTextareas[0].value = pickRandom(highlightList);
        notifyChange(currentTextareas[0]);
      }

      alert("评教数据填充完成，请检查后点击[保存]！");
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    window.addEventListener("DOMContentLoaded", init);
  }
})();
