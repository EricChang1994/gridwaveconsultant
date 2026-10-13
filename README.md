# GridWave Power Consulting — 多頁網站更新版

本套檔案可直接部署至原本的 GitHub Pages。網站以英文呈現，保留深藍／青綠品牌色、既有工程示意圖與 Eric 的頭像。

## 網站內容

- `index.html`：首頁
- `services.html`：四項服務、工作範圍與交付方式
- `expertise.html`：設備、保護、測試、介面及工具
- `projects.html`：六個專案、類別篩選及文字搜尋
- `projects/*.html`：六個獨立專案頁，包含背景、你的參與內容、工程觀點及官方資料來源
- `about.html`：Founder、專業經歷、證照與學歷
- `contact.html`：Email、LinkedIn、複製信箱及詢問信草稿
- `404.html`：找不到頁面的導覽

## 更新 GitHub Pages

1. 先備份目前 repository 的網站檔案。
2. 解壓縮 ZIP，將 `gridwave_site` **裡面的內容**上傳到目前 GitHub Pages 的發布目錄，覆蓋同名檔案。不要把整個資料夾多包一層，`index.html` 仍需位於發布目錄最上層。
3. 一併上傳 `projects`、`assets` 資料夾、`styles.css`、`script.js`、`CNAME`、`.nojekyll`、`robots.txt` 及 `sitemap.xml`。
4. 保留原本 GitHub Pages 的發布分支／目錄及 HTTPS 設定。`CNAME` 內容仍為 `gridwavepower.com`，不需更動 DNS。
5. Commit changes，等 GitHub Pages 部署完成後，確認首頁、Projects 清單及六個專案頁均能開啟。若樣式仍舊，請強制重新整理。

本次交付是完整網站更新檔，沒有直接修改你的 GitHub repository，也沒有重新部署公開網域。

## 操作與預覽

可直接開啟 `index.html` 預覽主要頁面。若要以本機網站方式預覽，於本資料夾執行 `python3 -m http.server 8000`，再開啟 `http://localhost:8000`。不需 Node.js、npm 或建置流程。

- Projects 的類別和搜尋可共同使用；所有專案均有各自的 HTML 頁面，可直接分享連結。
- 行動版選單支援 Escape 關閉。停用 JavaScript 時，導覽和完整專案清單仍可使用。
- 聯絡表單只準備 `mailto:` 郵件草稿，**不會寄信或將資料儲存在網站**。若裝置未設定郵件程式，可以複製頁面提供的草稿。
- 複製信箱功能依賴瀏覽器剪貼簿權限；不支援時會提示手動複製。
- 網站未加入分析追蹤或第三方表單服務。字型來自 Google Fonts；無網路或字型被封鎖時會使用系統字型。

## 專案資料與表述

公開資料查核日期：2026-10-12。每個專案頁都保留可點擊的官方來源。

- Fengmiao I：495 MW 裝置容量；與 500 MW 電網容量／履歷中的 OSS 範圍分開說明。
- Coastal Virginia：採公開來源的約 2.6 GW，取代舊版四捨五入的 2.7 GW。
- Formosa 4：495 MW 風場容量；公開計畫中離岸／陸上變電站各 500 MW。
- Greater Changhua 2b & 4：920 MW；採有日期的里程碑，未自行推定已商轉。
- Greater Changhua 1 & 2a：900 MW；個人經驗聚焦陸上變電站及併網。
- Mailiao：1.8 GW 是原始三部機組合計及當時經驗背景，非宣稱目前仍有相同運轉容量。

個人職責根據本次提供的 CV，不是由公開新聞獨立驗證。專案經驗清楚歸屬於在 Semco Maritime、Ørsted 與 Formosa Plastics Group 任職期間，未宣稱為 GridWave 的公司合約或客戶背書。公司未公開的圖面、測試數據或文件不在此網站內。

工程圖片沿用舊網站的三張 AI 示意圖，並以不同版面配置於六個專案，均標示為示意圖，非實際工程照片。Founder 照片沿用你提供的頭像。網站未放入完整 CV PDF、手機號碼或證書掃描。

## 後續維護

所有頁面均為可直接編輯的 HTML；共用樣式和互動分別位於 `styles.css` 和 `script.js`。
`project-content.json` 是本次專案文字的整理參考，**修改它不會自動更新 HTML**；修改內容時請同步修改相關 HTML 頁面。

本版已檢查站內檔案、頁內錨點、圖片路徑及 JavaScript 語法／主要互動邏輯。執行環境沒有可用的瀏覽器 QA 工具，尚未完成實際瀏覽器桌機／手機視覺驗證；上傳前請依上述方式預覽，特別檢查手機選單與郵件程式開啟行為。
