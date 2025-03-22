// 監聽輸入文字並更新字數統計
// 字數上限提示

// --- 原有功能 ---
document.getElementById("inputText").addEventListener("input", function () {
  let text = this.value;
  let textLength = text.length;
  let maxLength = 500;
  let charCount = document.getElementById("charCount");

  charCount.textContent = textLength + " /" + maxLength;
  charCount.classList.toggle("exceed", textLength > maxLength);

  updateSocialMetrics(text); // 加入社群短文分析功能
});

// 宣傳文複製功能
function copyPromo() {
  const promoText = `一個自由討論各種思想、個人想法、社會時事、讀書心得，並且有文字辯論賽制的地方。
\u200B
普通哲思社，歡迎你。
加入時有任何問題私訊社長Jim。
​\u200B
https://discord.gg/r6mv8ew3X3`;

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

// 雙換行轉換並複製
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
  const filler = ["的", "就是", "自己", "一下", "有點", "那種", "其實", "可能", "應該", "一些"];
  const hookWords = ["你知道", "有沒有想過", "我剛剛", "你會不會", "為什麼大家都"];
  const cta = ["留言", "按讚", "分享", "你覺得呢", "你會怎麼做", "轉發"];
  const emojis = ["😂", "😢", "😡", "😳", "❤️", "🔥", "👍", "🥺", "😎"];

  // 若為空，顯示提示並退出
  if (text.trim().length === 0) {
    showEmptyScores();
    return;
  }

  const countOccurrences = (arr) => arr.reduce((sum, item) => sum + countText(text, item), 0);

  const clarityScore = countOccurrences(filler);
  const hookScore = countOccurrences(hookWords);
  const engageScore = countOccurrences(cta);
  const emojiScore = countOccurrences(emojis);
  const paragraphCount = text.trim().split(/\n+/).filter(p => p.trim() !== "").length;

  // 顯示各項分數並加上等級樣式
  updateScore("ClarityScore", "簡潔值", clarityScore, "（建議 <8）", clarityScore < 8 ? "good" : "warn");
  updateScore("HookScore", "吸睛值", hookScore, "（建議開頭要吸睛）", hookScore > 0 ? "good" : "warn");
  updateScore("EngageScore", "互動值", engageScore, "（建議有 CTA）", engageScore > 0 ? "good" : "warn");
  updateScore("ToneScore", "表情值", emojiScore, "（建議 1–5）", emojiScore >= 1 && emojiScore <= 5 ? "good" : "warn");
  updateScore("ReadableScore", "段落數", paragraphCount, "（建議分段清晰）", paragraphCount >= 2 ? "good" : "warn");
}

function updateScore(id, label, value, hint, level) {
  const el = document.getElementById(id);
  el.className = `score-row ${level}`;
  let icon = "✅";

  if (level === "warn") icon = "⚠️";
  else if (level === "bad") icon = "❌";
  else if (level === "neutral") icon = "😐";

  el.innerHTML = `${icon} ${label}：${value} <span class="hint">${hint}</span>`;
}

function showEmptyScores() {
  document.getElementById("ClarityScore").className = "";
  document.getElementById("ClarityScore").textContent = "請輸入文字以分析";
  ["HookScore", "EngageScore", "ToneScore", "ReadableScore"].forEach(id => {
    const el = document.getElementById(id);
    el.className = "";
    el.textContent = "";
  });
}

// 簡單統計某關鍵字出現次數
function countText(text, keyword) {
  let count = 0, index = 0;
  while ((index = text.indexOf(keyword, index)) !== -1) {
    count++;
    index += keyword.length;
  }
  return count;
}


function countText(text, keyword) {
  let count = 0, index = 0;
  while ((index = text.indexOf(keyword, index)) !== -1) {
    count++;
    index += keyword.length;
  }
  return count;
}
