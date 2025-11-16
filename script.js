// 取得 DOM 元素
const inputText = document.getElementById('inputText');
const previewContent = document.getElementById('previewContent');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');
const hashtagCount = document.getElementById('hashtagCount');
const imageCount = document.getElementById('imageCount');
const toast = document.getElementById('toast');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const previewImages = document.getElementById('previewImages');

// 儲存上傳的圖片
let uploadedImages = [];

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

// 處理圖片上傳
function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  
  // 檢查圖片數量限制
  if (uploadedImages.length + files.length > 10) {
    showToast('⚠️ 最多只能上傳 10 張圖片');
    return;
  }
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        uploadedImages.push({
          src: e.target.result,
          file: file
        });
        
        updateImagePreview();
        updateImageCount();
      };
      
      reader.readAsDataURL(file);
    }
  });
  
  // 清空 input，允許重複上傳相同檔案
  event.target.value = '';
}

// 更新圖片預覽（左側編輯區）
function updateImagePreview() {
  imagePreviewContainer.innerHTML = '';
  
  uploadedImages.forEach((image, index) => {
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = `上傳圖片 ${index + 1}`;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'image-remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = () => removeImage(index);
    
    previewItem.appendChild(img);
    previewItem.appendChild(removeBtn);
    imagePreviewContainer.appendChild(previewItem);
  });
  
  // 更新右側預覽
  updateThreadsImagePreview();
}

// 更新 Threads 預覽區的圖片顯示
function updateThreadsImagePreview() {
  previewImages.innerHTML = '';
  
  if (uploadedImages.length === 0) {
    return;
  }
  
  // 根據圖片數量調整佈局
  const imageCountClass = uploadedImages.length === 1 ? 'single' :
                         uploadedImages.length === 2 ? 'two' :
                         uploadedImages.length === 3 ? 'three' : 'four';
  previewImages.className = `preview-images ${imageCountClass}`;
  
  // 最多顯示 4 張圖片
  const displayCount = Math.min(uploadedImages.length, 4);
  
  for (let i = 0; i < displayCount; i++) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-image-item';
    
    const img = document.createElement('img');
    img.src = uploadedImages[i].src;
    img.alt = `圖片 ${i + 1}`;
    
    previewItem.appendChild(img);
    
    // 如果有超過 4 張圖片，在第 4 張顯示 +N
    if (i === 3 && uploadedImages.length > 4) {
      const moreOverlay = document.createElement('div');
      moreOverlay.className = 'preview-image-more';
      moreOverlay.textContent = `+${uploadedImages.length - 4}`;
      previewItem.appendChild(moreOverlay);
    }
    
    previewImages.appendChild(previewItem);
  }
}

// 移除圖片
function removeImage(index) {
  uploadedImages.splice(index, 1);
  updateImagePreview();
  updateImageCount();
}

// 更新圖片數量統計
function updateImageCount() {
  imageCount.textContent = `圖片：${uploadedImages.length} 張`;
}

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

// 轉換並複製功能
function convertAndCopy() {
  const text = inputText.value;
  
  if (text.trim() === '') {
    showToast('⚠️ 請先輸入內容');
    return;
  }

  // 將連續的換行符號轉換，插入特殊空格（零寬空格）來保留格式
  // 這樣在 Threads/IG/FB 貼上時才能保留空行
  const convertedText = text.replace(/\n/g, '\n\u200B');
  
  // 複製轉換後的文字
  navigator.clipboard.writeText(convertedText).then(() => {
    showToast('✅ 已轉換並複製到剪貼簿！');
  }).catch(err => {
    // 如果 Clipboard API 失敗，使用舊方法
    fallbackCopy(convertedText);
  });
}

// 複製文字到剪貼簿（原始文字，不轉換）
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
  updateImageCount();
});
