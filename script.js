// 取得 DOM 元素
const inputText = document.getElementById('inputText');
const previewContent = document.getElementById('previewContent');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');
const hashtagCount = document.getElementById('hashtagCount');
const toast = document.getElementById('toast');

// 即時更新字數和預覽
inputText.addEventListener('input', function() {
  const length = this.value.length;
  charCount.textContent = `${length} / 500`;
  
  // 超過字數變紅
  if (length > 500) {
    charCount.classList.add('exceed');
  } else {
    charCount.classList.remove('exceed');
  }
  
  // 即時更新預覽
  updatePreview();
});

// 更新預覽函數
function updatePreview() {
  const text = inputText.value;
  
  // 更新預覽內容
  if (text.trim() === '') {
    previewContent.innerHTML = '<span style="color: #999;">在這裡會即時預覽你的貼文內容...</span>';
  } else {
    // 使用 textContent 保持換行，並確保文字顏色正確
    previewContent.textContent = text;
    previewContent.style.color = '#000';
  }

  // 更新統計資訊
  updateStats(text);
}

// 更新統計資訊
function updateStats(text) {
  // 字數統計（排除空白）
  const words = text.replace(/\s/g, '').length;
  wordCount.textContent = `字數：${words} 字`;

  // 行數統計
  const lines = text.split('\n').length;
  lineCount.textContent = `行數：${lines} 行`;

  // 標籤統計
  const hashtags = text.match(/#[\w\u4e00-\u9fa5]+/g);
  const hashtagNum = hashtags ? hashtags.length : 0;
  hashtagCount.textContent = `標籤：${hashtagNum} 個`;
}

// 複製文字到剪貼簿
function copyText() {
  const text = inputText.value;
  
  if (text.trim() === '') {
    showToast('⚠️ 請先輸入內容');
    return;
  }

  // 使用 Clipboard API
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ 已複製到剪貼簿！');
  }).catch(err => {
    // 如果 Clipboard API 失敗，使用舊方法
    fallbackCopy(text);
  });
}

// 備用複製方法（相容性更好）
function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    showToast('✅ 已複製到剪貼簿！');
  } catch (err) {
    showToast('❌ 複製失敗');
    console.error('複製失敗:', err);
  }
  
  document.body.removeChild(textArea);
}

// 顯示提示訊息
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
  updatePreview();
});
