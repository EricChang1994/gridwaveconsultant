# Eric Chang, PE, PMP — 個人專業網站

Wen Jui (Eric) Chang 的個人專業形象網站：高壓與電力基礎建設工程師的經歷、專長與專案紀錄。純靜態網站（HTML / CSS / 少量 JavaScript），可直接由 GitHub Pages 發布。

本資料夾是獨立的網站，請建立**自己的 repository**，不要和公司網站放在同一個 repository。

## 目錄結構

```
├─ index.html, focus.html, expertise.html,
│  projects.html, about.html, contact.html, 404.html   ← 發布的頁面（由產生器輸出）
├─ projects/            七個專案頁（由產生器輸出）
├─ styles.css           全站樣式
├─ script.js            選單、專案篩選／搜尋、聯絡表單
├─ assets/              圖片與 favicon
└─ src/                 原始內容（修改請改這裡）
   ├─ build.mjs         產生器：共用頁首／頁尾、專案頁版型、網站設定
   ├─ projects.json     七個專案的全部文字資料
   └─ pages/*.html      各頁的主要內容
```

## 上線前要先做的一件事：填入網址

打開 `src/build.mjs`，把最上方 `SITE.url` 填成網站的正式網址（結尾不要加斜線），例如：

```js
url: 'https://<你的帳號>.github.io',            // repository 名稱為 <你的帳號>.github.io 時
url: 'https://<你的帳號>.github.io/<repository>', // 一般 repository
url: 'https://你的網域',                         // 自訂網域
```

然後重新產生。填入後才會輸出 canonical 連結、社群分享預覽圖網址與 `sitemap.xml`，404 頁的連結也才會在任何路徑下都正確。若使用自訂網域，另外在根目錄新增一個只寫網域的 `CNAME` 檔。

## 修改內容

請修改 `src/` 內的檔案再重新產生，不要直接改根目錄的 HTML（會被覆蓋）。

| 想改什麼 | 改哪個檔案 |
| --- | --- |
| 專案文字、新增／移除專案 | `src/projects.json` |
| 首頁、專注領域、專長、關於、聯絡頁內容 | `src/pages/` 內對應的檔案 |
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

```bash
git init
git add .
git commit -m "Personal site"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<repository>.git
git push -u origin main
```

沒有安裝 Git 的話，在 GitHub 的 repository 頁面選 *Add file → Upload files*，把本資料夾的內容拖進去後 Commit（隱藏檔 `.nojekyll` 要一併上傳）。

接著到 *Settings → Pages*，Source 選 `Deploy from a branch`、分支 `main`、資料夾 `/ (root)`。

## 內容表述原則

- 全站以第一人稱撰寫，不含任何公司品牌；專案經驗皆標明是在 Semco Maritime、Ørsted、Formosa Plastics Group 任職期間的個人工作範圍，並註明不代表這些公司發言。
- 專案背景數據均附公開來源連結；個人職責未經公開來源獨立驗證。
- 首頁與 Expertise 頁的兩張情境圖為 AI 生成示意圖，已於圖說標示；首頁的單線圖為示意，非特定專案圖面。
- 聯絡表單只會開啟訪客自己的郵件程式並帶入草稿，網站不傳送也不儲存任何資料。網站沒有分析追蹤；字體由 Google Fonts 載入，載入失敗時改用系統字體。

© 2026 Wen Jui (Eric) Chang. All rights reserved.
