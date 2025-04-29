// 監聽輸入文字並更新字數統計

document.getElementById("inputText").addEventListener("input", function () {
  let text = this.value;
  let textLength = text.length;
  let maxLength = 500;
  let charCount = document.getElementById("charCount");

  charCount.textContent = textLength + " /" + maxLength;
  charCount.classList.toggle("exceed", textLength > maxLength);

  updateSocialMetrics(text); // 更新簡潔值與段落分析
});

function copyPromo() {
  const promoText = `https://discord.gg/r6mv8ew3X3`;

  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = promoText;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextarea);

  const btn = document.getElementById("copyPromoBtn");
  btn.classList.remove("orange");
  btn.classList.add("after");
  btn.textContent = "✅ 已複製宣傳文";
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove("after");
    btn.classList.add("orange");
    btn.textContent = "📋 複製宣傳文";
    btn.disabled = false;
  }, 1000);
}

function convertAndCopy() {
  let input = document.getElementById("inputText").value;
  let zeroWidthSpace = "\u200B";
  let convertedText = input.replace(/\n\n/g, "\n" + zeroWidthSpace + "\n");

  let output = document.getElementById("output");
  output.textContent = convertedText;

  let tempTextarea = document.createElement("textarea");
  tempTextarea.value = convertedText;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextarea);

  const btn = document.getElementById("convertCopyBtn");
  btn.classList.remove("blue");
  btn.classList.add("after");
  btn.textContent = "✅ 已轉換";
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove("after");
    btn.classList.add("blue");
    btn.textContent = "轉換並複製";
    btn.disabled = false;
  }, 1000);
}

function updateSocialMetrics(text) {
  const filler = [
    "的", "就是", "自己", "一下", "有點", "那種", "其實", "可能", "應該", "一些",
    "然後", "就是說", "然後呢", "基本上", "就是呢", "就是說呢", "大概", "差不多", "這樣子",
    "這個", "那個", "嗯", "啊", "嘛", "啦", "喔", "欸", "其實呢", "感覺", "有沒有",
    "好像", "有時候", "偶爾", "可能會", "不一定", "多少", "稍微", "有點點", "略微",
    "我覺得", "我個人認為", "我想要說", "我會說", "其實我覺得", "坦白說", "老實說", "說真的",
    "的話", "來講", "來說", "上來說", "方面來看", "一方面", "之類的", "等等", "等等之類的",
    "或許", "好像是", "也許", "可能是", "也可能", "也還算", "也還好", "不太", "還算", "算是"
  ];

  if (text.trim().length === 0) {
    showEmptyScores();
    return;
  }

  const countOccurrences = (arr) => arr.reduce((sum, item) => sum + countText(text, item), 0);
  const clarityScore = countOccurrences(filler);

  const paragraphCount = text
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    .trim()
    .replace(/\r\n|\r|\n|\u2028/g, '\n')
    .split(/\n\s*\n+/)
    .filter(p => p.trim().length > 0).length;

  const clarityInfo = getClarityLevel(clarityScore);
  updateScore(
    "ClarityScore",
    `簡潔值｜${clarityInfo.label}`,
    clarityScore,
    "（Threads 建議 ≤9）",
    clarityInfo.level,
    clarityInfo.icon
  );

  const totalChars = text.replace(/\s/g, "").length;
const paragraphInfo = getParagraphLevel(paragraphCount, totalChars);
updateScore(
  "ReadableScore",
  `段落數｜${paragraphInfo.label}`,
  paragraphCount,
  "（根據字數動態評估）",
  paragraphInfo.level,
  paragraphInfo.icon
);

}

function getClarityLevel(score) {
  if (score <= 4) return { level: "good", icon: "🧊", label: "極簡風格" };
  if (score <= 9) return { level: "good", icon: "✅", label: "日常語氣" };
  if (score <= 14) return { level: "warn", icon: "⚠️", label: "微冗但可接受" };
  if (score <= 20) return { level: "warn", icon: "❗", label: "論述文風" };
  return { level: "bad", icon: "🧱", label: "冗言累句" };
}

function getParagraphLevel(count, totalChars) {
  if (totalChars < 100) {
    if (count === 0) return { level: "bad", icon: "❌", label: "無段落" };
    if (count === 1) return { level: "good", icon: "✅", label: "短訊節奏" };
    return { level: "warn", icon: "🌬️", label: "過度斷句" };
  }

  if (totalChars < 200) {
    if (count <= 1) return { level: "warn", icon: "☝️", label: "偏密集" };
    if (count <= 3) return { level: "good", icon: "✅", label: "自然節奏" };
    return { level: "warn", icon: "🌬️", label: "稍鬆散" };
  }

  if (totalChars < 350) {
    if (count <= 1) return { level: "bad", icon: "❌", label: "太密集" };
    if (count <= 4) return { level: "good", icon: "✅", label: "清晰易讀" };
    if (count <= 6) return { level: "warn", icon: "🌬️", label: "偏鬆" };
    return { level: "bad", icon: "🧻", label: "過度斷句" };
  }

  // 超過350字，可接受段落更多
  if (count <= 2) return { level: "warn", icon: "☝️", label: "太密集" };
  if (count <= 5) return { level: "good", icon: "✅", label: "合理段落" };
  if (count <= 8) return { level: "warn", icon: "🌬️", label: "偏鬆" };
  return { level: "bad", icon: "🧻", label: "段落過多" };
}


function updateScore(id, label, value, hint, level, icon = "✅") {
  const el = document.getElementById(id);
  el.className = `score-row ${level}`;
  el.innerHTML = `${icon} ${label}：${value} <span class="hint">${hint}</span>`;
}

function showEmptyScores() {
  document.getElementById("ClarityScore").className = "";
  document.getElementById("ClarityScore").textContent = "請輸入文字以分析";
  const el = document.getElementById("ReadableScore");
  el.className = "";
  el.textContent = "";
}

function countText(text, keyword) {
  let count = 0, index = 0;
  while ((index = text.indexOf(keyword, index)) !== -1) {
    count++;
    index += keyword.length;
  }
  return count;
}