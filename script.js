/* script.js - 終極整合版 */

// 全域變數：儲存上傳的圖片，方便管理刪除
let uploadedImages = [];

// DOM 元素快取
const dom = {
  input: document.getElementById('wysiwyg-input'),
  imageContainer: document.getElementById('preview-images-container'),
  stats: {
    char: document.getElementById('char-count'),
    line: document.getElementById('line-count'),
    tag: document.getElementById('tag-count')
  },
  toast: document.getElementById('toast')
};

// 1. 自動調整輸入框高度 (所見即所得核心)
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}

// 2. 更新統計數據 (整合參考代碼的精準邏輯)
function updateStats() {
  const text = dom.input.value;
  
  // 字數 (包含標點，但排除前後空白)
  const length = text.length;
  dom.stats.char.innerText = `${length} / 500`;
  
  // 行數
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
  dom.stats.line.innerText = lines;

  // 標籤 (支援中文與英文 Hashtag)
  // Regex: # 開頭，後接 文字或底線 (不含空白)
  const hashtags = text.match(/#[\w\u4e00-\u9fa5]+/g);
  const hashtagNum = hashtags ? hashtags.length : 0;
  dom.stats.tag.innerText = hashtagNum;

  // 字數超限警告
  if (length > 500) {
    dom.stats.char.style.color = '#ff0033';
    dom.stats.char.style.fontWeight = 'bold';
  } else {
    dom.stats.char.style.color = 'black';
    dom.stats.char.style.fontWeight = 'normal';
  }
}

// 3. 處理圖片上傳
function handleImages(event) {
  const files = Array.from(event.target.files);
  
  // 檢查數量限制
  if (uploadedImages.length + files.length > 10) {
    showToast('⚠️ 最多只能上傳 10 張圖片');
    // 清空 input 讓使用者能重新選擇
    event.target.value = ''; 
    return;
  }

  // 讀取檔案
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // 將圖片資料存入陣列
        uploadedImages.push({
          src: e.target.result,
          file: file
        });
        // 重新渲染圖片區
        renderImages();
      };
      
      reader.readAsDataURL(file);
    }
  });

  // 清空 input，允許重複上傳相同檔案
  event.target.value = '';
}

// 4. 渲染圖片 (含刪除按鈕)
function renderImages() {
  dom.imageContainer.innerHTML = '';

  uploadedImages.forEach((image, index) => {
    // 建立圖片容器
    const wrapper = document.createElement('div');
    wrapper.className = 'img-wrapper';
    // 設定樣式讓它包含刪除按鈕 (inline style 方便快速應用)
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    // 圖片本體
    const img = document.createElement('img');
    img.src = image.src;
    
    // 刪除按鈕
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '×';
    removeBtn.className = 'remove-btn';
    // 刪除按鈕樣式
    Object.assign(removeBtn.style, {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'rgba(0,0,0,0.6)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0'
    });
    
    // 綁定刪除事件
    removeBtn.onclick = () => removeImage(index);

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    dom.imageContainer.appendChild(wrapper);
  });
  
  // 更新介面上的圖片計數提示 (選用)
  // updateImageCountDisplay(); 
}

// 5. 移除圖片邏輯
function removeImage(index) {
  uploadedImages.splice(index, 1);
  renderImages();
}

// 6. 複製功能 (整合強制換行與備用方案)
function copyText() {
  let text = dom.input.value;
  
  if (text.trim() === '' && uploadedImages.length === 0) {
    showToast('⚠️ 請先輸入內容');
    return;
  }

  // --- 🔥 強制換行處理 ---
  // 1. 統一換行符號
  text = text.replace(/\r\n/g, '\n');
  // 2. 插入零寬空格 (\u200B) 防止吃行距
  const convertedText = text.replace(/\n/g, '\n\u200B');

  // 嘗試使用 Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(convertedText)
      .then(() => showToast('✅ 已複製！(防吃字格式)'))
      .catch(err => {
        console.warn('Clipboard API 失敗，嘗試備用方案', err);
        fallbackCopy(convertedText);
      });
  } else {
    // 不支援 Clipboard API 則直接用備用方案
    fallbackCopy(convertedText);
  }
}

// 7. 備用複製方法 (相容舊瀏覽器/WebView)
function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // 隱藏在視窗外
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast('✅ 已複製！(相容模式)');
    } else {
      showToast('❌ 複製失敗，請手動複製');
    }
  } catch (err) {
    console.error('Fallback copy failed', err);
    showToast('❌ 複製失敗');
  }
  
  document.body.removeChild(textArea);
}

// 8. 清空所有內容
function clearAll() {
  if(confirm("確定要清空所有文字與圖片嗎？")) {
    // 清空文字
    dom.input.value = "";
    autoResize(dom.input);
    
    // 清空圖片陣列與畫面
    uploadedImages = [];
    renderImages();
    
    // 更新統計
    updateStats();
  }
}

// 9. Toast 提示訊息
function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.style.display = 'block';
  
  // 動畫重置
  dom.toast.style.animation = 'none';
  dom.toast.offsetHeight; /* trigger reflow */
  dom.toast.style.animation = 'fadeIn 0.3s';

  setTimeout(() => {
    dom.toast.style.display = 'none';
  }, 2000);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  if(dom.input.value) {
    autoResize(dom.input);
    updateStats();
  }
});
