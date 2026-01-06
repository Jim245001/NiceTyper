:root {
  --bg-color: #f0f2f5;
  --phone-border: #e2e2e2;
  --threads-black: #000000;
  --threads-gray: #999999;
  --accent-color: #0095f6;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* 版面容器：手機在中間，工具在旁邊 */
.wysiwyg-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1000px;
}

/* --- 手機模擬區 (核心) --- */
.phone-mockup {
  width: 375px; /* 模擬 iPhone SE / mini 寬度 */
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 8px solid #333;
  overflow: hidden;
  position: relative;
  height: 700px; /* 固定手機高度 */
  display: flex;
  flex-direction: column;
}

/* 手機頂部狀態列 */
.phone-status-bar {
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  background: #fff;
  z-index: 10;
}

/* Threads Header */
.threads-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  position: relative;
}
.threads-logo {
  font-weight: bold;
  font-size: 20px;
  font-family: sans-serif;
}

/* 貼文內容區 */
.post-scroll-area {
  flex: 1;
  overflow-y: auto; /* 內容過長可捲動 */
  padding: 0 16px;
}

.post-layout {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #333;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.post-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.time-ago {
  color: var(--threads-gray);
  font-weight: 400;
}

/* --- 核心編輯區 (Textarea 偽裝成普通文字) --- */
#wysiwyg-input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.5;
  font-family: inherit;
  min-height: 100px;
  margin-bottom: 10px;
  background: transparent;
  color: var(--threads-black);
}

#wysiwyg-input::placeholder {
  color: var(--threads-gray);
}

/* 圖片預覽 */
.preview-images-grid {
  display: grid;
  gap: 5px;
  margin-bottom: 10px;
  /* 簡易的格狀排版邏輯 */
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.preview-images-grid img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}

/* 底部互動按鈕 */
.post-actions {
  display: flex;
  gap: 16px;
  margin-top: 5px;
  margin-bottom: 20px;
  color: #333;
}
.action-icon {
  font-size: 20px;
  cursor: pointer;
}

/* --- 右側工具欄 --- */
.tools-sidebar {
  width: 300px;
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  height: fit-content;
}

.tools-section {
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}
.tools-section:last-child {
  border: none;
}

.tools-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.stat-value {
  font-weight: bold;
  color: #000;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: 0.2s;
  margin-bottom: 8px;
}

.btn-primary {
  background-color: var(--threads-black);
  color: white;
}
.btn-primary:hover {
  opacity: 0.8;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}
.btn-secondary:hover {
  background-color: #e0e0e0;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  display: none;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
