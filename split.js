(function () {
    "use strict";
  
    // 所有模組的定義會掛在這裡（模組 ID → function(module, exports, require)）
    const modules = {};
  
    // 已加載過的模組快取（模組 ID → module object）
    const cache = {};
  
    // chunk 的加載狀態（0: 已加載, [resolve, reject]: 加載中）
    const chunkStatus = {
      2272: 0,
      256: 0
    };
  
    // 延遲執行的 chunk 任務隊列
    const deferredQueue = [];
  
    /**
     * 自定義的 require 函式，模仿 CommonJS
     * @param {number|string} moduleId
     * @returns {*} module.exports
     */
    function require(moduleId) {
      if (cache[moduleId]) {
        return cache[moduleId].exports;
      }
  
      const module = cache[moduleId] = {
        id: moduleId,
        loaded: false,
        exports: {}
      };
  
      try {
        // 執行該模組定義函式，傳入模組物件
        modules[moduleId].call(module.exports, module, module.exports, require);
        module.loaded = true;
      } catch (err) {
        delete cache[moduleId];
        throw err;
      }
  
      return module.exports;
    }
  
    // 掛上模組定義表
    require.m = modules;
  
    /**
     * 處理 chunk queue：根據 chunkIds 檢查是否可執行，並觸發對應 callback
     * @param {*} result 回傳值
     * @param {Array} chunkIds 要等待的 chunk ID
     * @param {Function} fn 要執行的 callback
     * @param {number} priority 優先順序
     */
    require.O = function(result, chunkIds, fn, priority) {
      if (chunkIds) {
        // 將新任務加到 queue
        deferredQueue.push([chunkIds, fn, priority || 0]);
        return;
      }
  
      // 處理 queue：檢查有哪些任務可以執行
      let bestPriority = Infinity;
      for (let i = 0; i < deferredQueue.length; i++) {
        const [chunks, callback, p] = deferredQueue[i];
        const allLoaded = chunks.every(id => require.O.j(id));
        if (allLoaded && p <= bestPriority) {
          deferredQueue.splice(i--, 1);
          const res = callback();
          if (res !== undefined) result = res;
        }
      }
  
      return result;
    };
  
    /**
     * 判斷 chunk 是否已經加載完成
     * @param {number} id
     * @returns {boolean}
     */
    require.O.j = (id) => chunkStatus[id] === 0;
  
    /**
     * 載入指定 chunk（支援 Promise）
     * @param {number} chunkId
     * @returns {Promise}
     */
    require.e = (chunkId) => {
      return Promise.all(
        Object.keys(require.f).reduce((promises, key) => {
          require.f[key](chunkId, promises);
          return promises;
        }, [])
      );
    };
  
    /**
     * 實際用 <script> 載入 chunk
     * @param {string} url chunk 檔案位置
     * @param {Function} callback 成功或失敗都會被呼叫
     * @param {string} key chunk 名稱
     * @param {number} chunkId chunk ID
     */
    require.l = function(url, callback, key, chunkId) {
      const script = document.createElement('script');
      script.charset = 'utf-8';
      script.timeout = 120;
      script.src = url;
  
      // 設定 timeout
      let timer = setTimeout(() => {
        script.onerror({ type: 'timeout', target: script });
      }, 120000);
  
      // 成功或失敗都清掉 timeout
      script.onload = () => {
        clearTimeout(timer);
        callback();
      };
  
      script.onerror = () => {
        clearTimeout(timer);
        callback(new Error('Chunk load failed'));
      };
  
      document.head.appendChild(script);
    };
  
    /**
     * 將匯出標示為 ES Module
     * @param {object} exports
     */
    require.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  
    // public path，例如 Webpack 要從哪個目錄載入 chunk
    require.p = "/_next/";
  
    /**
     * 預設載入 chunk 的方式：JavaScript chunks
     * @param {number} chunkId
     * @param {Array} promises
     */
    require.f = {};
    require.f.j = function (chunkId, promises) {
      if (chunkStatus[chunkId] !== 0) {
        // 如果尚未載入，設為 Promise 並等待
        promises.push(new Promise((resolve, reject) => {
          chunkStatus[chunkId] = [resolve, reject];
        }));
      }
    };
  
    /**
     * 初始化：檢查是否已有 chunkQueue（全域變數 webpackChunk_N_E）
     */
    const chunkQueue = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
  
    // 已有的 chunk 任務（可能來自其他 <script>），先跑一遍
    chunkQueue.forEach((chunk) => require.O(undefined, chunk[0], chunk[1], chunk[2]));
  
    // 改寫 push 方法為 Webpack runtime 處理器
    chunkQueue.push = (entry) => require.O(undefined, entry[0], entry[1], entry[2]);
  
  })();
  