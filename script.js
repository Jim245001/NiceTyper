// ✅ script.js（使用 window.pipeline，不再 import）

let classifier, translator;

window.addEventListener("DOMContentLoaded", async () => {
  const pipeline = window.pipeline; // 使用 index.html 預載好的 pipeline

  classifier = await pipeline('sentiment-analysis');
  translator = await pipeline('translation', 'Xenova/mbart-large-50-many-to-many-mmt', {
    quantized: false,
    preload: true
  });

  const inputText = document.getElementById("inputText");
  inputText.addEventListener("input", async function () {
    let text = this.value;
    let textLength = text.length;
    let maxLength = 500;
    let charCount = document.getElementById("charCount");

    charCount.textContent = textLength + " /" + maxLength;
    charCount.classList.toggle("exceed", textLength > maxLength);

    updateSocialMetrics(text);

    const el = document.getElementById("SentimentScore");

    if (text.trim().length === 0) {
      el.className = "";
      el.textContent = "";
      return;
    }

    if (classifier && translator) {
      el.className = "score-row neutral";
      el.textContent = "⏳ 翻譯並分析中...";

      try {
        const translation = await translator(text, {
          src_lang: "zh_CN",
          tgt_lang: "en_XX"
        });
        const translatedText = translation[0].translation_text;

        const result = await classifier(translatedText);
        const tone = result[0];

        const sentimentText = `${tone.label} (${(tone.score * 100).toFixed(1)}%)`;
        let sentimentIcon = "😐";
        let sentimentHint = "中性文字，建議加入感性或行動語句";
        let sentimentClass = "neutral";

        if (tone.label === "POSITIVE") {
          sentimentIcon = "✅";
          sentimentHint = "✅ 正向文字能引發更多共鳴";
          sentimentClass = "good";
        } else if (tone.label === "NEGATIVE") {
          sentimentIcon = "⚠️";
          sentimentHint = "⚠️ 文字情緒偏負，建議加入鼓勵語氣";
          sentimentClass = "warn";
        }

        el.className = `score-row ${sentimentClass}`;
        el.innerHTML = `${sentimentIcon} 情緒值：${sentimentText}<br/><span class="hint">${sentimentHint}</span><br/><span class="hint">原文翻譯：${translatedText}</span>`;
      } catch (err) {
        el.className = "score-row warn";
        el.textContent = "❌ 無法分析：請檢查網路或模型資源是否成功載入";
        console.error(err);
      }
    }
  });
});

window.convertAndCopy = function () {
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
};

window.copyPromo = function () {
  const promoText = `一個自由討論各種思想、個人想法、社會時事、讀書心得，並且有文字辯論賽制的地方。\n\u200B\n普通哲思社，歡迎你。\n加入時有任何問題私訊社長Jim。\n\u200B\nhttps://discord.gg/r6mv8ew3X3`;
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
};

function updateSocialMetrics(text) {
  const filler = ["的", "就是", "自己", "一下", "有點", "那種", "其實", "可能", "應該", "一些"];
  const hookWords = ["你知道", "有沒有想過", "我剛剛", "你會不會", "為什麼大家都"];
  const cta = ["留言", "按讚", "分享", "你覺得呢", "你會怎麼做", "轉發"];
  const emojis = ["😂", "😢", "😡", "😳", "❤️", "🔥", "👍", "🥺", "😎"];

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

  updateScore("ClarityScore", "簡潔值", clarityScore, "（建議 <8）", clarityScore < 8 ? "good" : "warn");
  updateScore("HookScore", "吸睛值", hookScore, "（建議開頭要吸睛）", hookScore > 0 ? "good" : "warn");
  updateScore("EngageScore", "互動值", engageScore, "（建議有 CTA）", engageScore > 0 ? "good" : "warn");
  updateScore("ReadableScore", "段落數", paragraphCount, "（建議分段清晰）", paragraphCount >= 2 ? "good" : "warn");
}

function updateScore(id, label, value, hint, level) {
  const el = document.getElementById(id);
  el.className = `score-row ${level}`;
  let icon = "✅";
  if (level === "warn") icon = "⚠️";
  else if (level === "bad") icon = "❌";
  else if (level === "neutral") icon = "😐";

  el.innerHTML = `${icon} ${label}：${value} <span class=\"hint\">${hint}</span>`;
}

function showEmptyScores() {
  document.getElementById("ClarityScore").className = "";
  document.getElementById("ClarityScore").textContent = "請輸入文字以分析";
  ["HookScore", "EngageScore", "ReadableScore", "ToneScore", "SentimentScore"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.className = "";
      el.textContent = "";
    }
  });
}

function countText(text, keyword) {
  let count = 0, index = 0;
  while ((index = text.indexOf(keyword, index)) !== -1) {
    count++;
    index += keyword.length;
  }
  return count;
}