document.getElementById("inputText").addEventListener("input", function () {
    let textLength = this.value.length; // 目前字數
    let maxLength = 500; // 最大限制
    let charCount = document.getElementById("charCount");
  
    charCount.textContent = textLength + " /" + maxLength; // 顯示字數
  
    // 若超過字數限制顯示紅色
    if (textLength > maxLength) {
      charCount.classList.add("exceed");
    } else {
      charCount.classList.remove("exceed");
    }
  });
  
  function convertAndCopy() {
    let input = document.getElementById("inputText").value; // 取得輸入文字
    let zeroWidthSpace = "\u200B"; // 零寬空白字元
    let convertedText = input.replace(/\n\n/g, "\n" + zeroWidthSpace + "\n"); // 雙換行中插入零寬空白
  
    let output = document.getElementById("output");
    output.textContent = convertedText; // 更新隱藏輸出區
  
    // 建立暫存 textarea 來複製內容
    let tempTextarea = document.createElement("textarea");
    tempTextarea.value = convertedText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
  
    // 切換按鈕樣式顯示「已轉換」
    const btn = document.getElementById("convertCopyBtn");
    btn.classList.remove("blue");
    btn.classList.add("after");
    btn.textContent = "✅ 已轉換";
    btn.disabled = true;
  
    // 一秒後恢復按鈕原狀
    setTimeout(() => {
      btn.classList.remove("after");
      btn.classList.add("blue");
      btn.textContent = "轉換並複製";
      btn.disabled = false;
    }, 1000);
  }
  