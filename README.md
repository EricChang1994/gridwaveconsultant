# GridWave Power Consulting — 官方網站

[gridwavepower.com](https://gridwavepower.com) 的原始碼。純靜態網站（HTML / CSS / 少量 JavaScript），由 GitHub Pages 直接發布，不需要後端、資料庫或建置服務。

## 目錄結構

```
├─ index.html, services.html, expertise.html,
│  projects.html, about.html, contact.html, 404.html   ← 發布的頁面（由產生器輸出）
├─ projects/            七個專案頁（由產生器輸出）
├─ styles.css           全站樣式
├─ script.js            選單、專案篩選／搜尋、聯絡表單
├─ assets/              圖片與 favicon
├─ sitemap.xml          由產生器輸出
├─ CNAME, .nojekyll, robots.txt   GitHub Pages 設定
└─ src/                 原始內容（修改請改這裡）
   ├─ build.mjs         產生器：共用頁首／頁尾、專案頁版型
   ├─ projects.json     七個專案的全部文字資料
   └─ pages/*.html      各頁的主要內容
```

## 修改內容

頁首、頁尾與專案頁版型只寫在一處，所以**請修改 `src/` 內的檔案，再重新產生**，不要直接改根目錄的 HTML（下次產生時會被覆蓋）。

| 想改什麼 | 改哪個檔案 |
| --- | --- |
| 專案文字、新增／移除專案 | `src/projects.json` |
| 首頁、服務、專長、關於、聯絡頁內容 | `src/pages/` 內對應的檔案 |
| 導覽列、頁尾、Email、LinkedIn、專案頁版型 | `src/build.mjs` |
| 顏色、字體、版面 | `styles.css` |

改完後執行（需要 [Node.js](https://nodejs.org) 18 以上，無需安裝任何套件）：

```bash
node src/build.mjs
```

新增專案時，另外在 `script.js` 的 `projectNames` 加上一行，聯絡表單才會自動帶入該專案名稱。

## 本機預覽

```bash
python -m http.server 8000
```

然後開啟 <http://localhost:8000>。

## 發布到 GitHub Pages

Repository 的根目錄就是網站根目錄，`index.html` 必須在最上層。

**用 Git：**

```bash
git init
git add .
git commit -m "Redesign GridWave website"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<repository>.git
git push -u origin main
```

**不裝 Git：** 在 GitHub 的 repository 頁面選 *Add file → Upload files*，把本資料夾的內容（不含 `.zip` 與 `.claude`）拖進去後 Commit。`.nojekyll` 是隱藏檔，請確認有一併上傳。

接著到 *Settings → Pages*，Source 選 `Deploy from a branch`、分支 `main`、資料夾 `/ (root)`。`CNAME` 已設為 `gridwavepower.com`，DNS 不需更動。

## 內容表述原則

- 專案經驗皆為創辦人於 Semco Maritime、Ørsted、Formosa Plastics Group 任職期間取得，網站未將其表述為 GridWave 的公司合約或客戶背書。
- 專案背景數據均附公開來源連結；個人職責依據創辦人履歷，未經公開來源獨立驗證。
- 首頁與 Expertise 頁的兩張情境圖為 AI 生成示意圖，已於圖說標示；首頁的單線圖為示意，非特定專案圖面。
- 聯絡表單只會開啟使用者自己的郵件程式並帶入草稿，網站不傳送也不儲存任何資料。網站沒有分析追蹤；字體由 Google Fonts 載入，載入失敗時改用系統字體。

© 2026 GridWave Power Consulting LLC. All rights reserved.


## 中英文版本

- 預設首頁 `index.html` 為英文；繁體中文首頁為 `zh-TW/index.html`。
- 全站右上角提供 EN／繁體中文切換，會切換到對應頁面，並保留網址的專案／服務參數與章節。
- 中文版的站內導覽會維持中文；不依瀏覽器語言自動跳轉，因此預設仍為英文。
- 請繼續修改 `src/pages/`、`src/projects.json` 及共用版型；繁體中文文字對照集中於 `src/zh-TW.json`，由 `src/localize.mjs` 產生中文靜態頁。新增文字時請在對照表補上翻譯，產生器會檢查未登錄的頁面文字。
- 執行 `node src/build.mjs` 會一次更新全部 14 個英文頁面、14 個中文頁面與雙語 sitemap，無需安裝套件。
- 表單的專案預填、服務選擇、郵件草稿、搜尋結果計數及複製提示均支援中英文。
- 上傳網站時請包含 `zh-TW/` 目錄；原有 GitHub Pages 設定與網域保持相同。
- East Anglia ONE North 的顯示容量已設為 **800MW**；原有創辦人參與期間保留在專案事實與職責說明中。


## 專案名稱與小標更新

繁體中文版中，除麥寮發電廠外，專案名稱皆保留英文。專案 01–05 小標為 Offshore substation／海上變電站；06 為 Onshore substation／陸域變電站；07 為 Power plant operation／電廠維護運轉。英文頁與中文頁各顯示對應語言，並同步套用於首頁、專案列表、詳情頁及聯絡表單的專案名稱。
