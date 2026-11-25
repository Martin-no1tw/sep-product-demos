# SEP ELECTRONICS｜客戶回饋互動 Demo V4.2

本版由 **V4.0 經典企業藍白版** 修改，根據客戶 2026-11-24 的四項回饋調整。這是可於瀏覽器操作的**前端驗收原型**，**不是已安裝於 wpdev.sepsemi.com 的 WordPress Plugin／Theme**，也尚未接上正式產品資料庫或真實 PDF。

## 開啟方式

1. 解壓縮整個 ZIP。
2. 使用 Chrome／Edge／Safari 開啟根目錄 `index.html`，或部署至一般靜態網站主機。
3. 頁面頂部選 `Products`、`Applications`、`Support`、`About SEP` 進行驗收。可在 `Products` → `Bridge Rectifiers` → `Single-Phase Bridge Rectifier` 實測規格欄位。

## V4.1 已完成的互動項目

### 1. 橫向階層式 Mega Menu

- **Products**：左側主分類導覽、右側依當前主分類顯示子分類，非一次平鋪所有類別。點擊子分類直接定位相應產品模板。
- **Applications**：依應用產業切換主分類與右側簡介；目前客戶提供的選單資料只有第二層，保留第三層擴充架構，正式關聯資料待審核。
- **Support / About**：一般下拉清單；Support 點擊分類會打開對應的文件篩選，About 進入展示頁並標記對應項目。
- 手機版 Mega Menu 改為可展開的區塊，避免桌面大選單在窄螢幕超出。

### 2. 產品 Parametric Search 改成表格上方

- 流程：**選分類 → 上方 Parametric Search → 下方全寬產品表格**。
- 只有篩選條件的外層區塊可以左右捲動；結果表格是獨立區塊（表格自身在窄螢幕上仍可按需要左右捲動）。
- 規格列由目前選定產品群的 Excel **動態生成**，不限制只能 3 欄；同一模板可達 10～20 欄以上。
- 每列自適應不同最小寬度（Package／Family 比 Status 寬）；篩選卡片統一高度；選項超過高度在欄內垂直捲動；多選項的欄位含搜尋。
- 類別／枚舉值使用多選 Checkbox；數值型欄位使用 Min／Max 輸入框，可組合範圍條件。未提供 Slider 的欄位不憑空生成 Slider。
- 勾選或輸入後**無需按 Apply**，結果自動更新；搜尋文字與數值輸入使用短暫 debounce。
- `Clear Filter` 清空當前規格條件；`Filter Toggle` 展開／收合；收合後結果保持不變。
- `Part Number: N` 顯示當前匹配的**不重複料號數**；分頁仍依來源資料列顯示，若重複料號會另加註。
- 保留規格詳細資料與 CSV 匯出，無需虛構 Datasheet PDF。

### 3. Support 分類篩選與表格

- 依客戶選單原始分類（Quality & Reliability、Environmental Compliance、Technical & Packaging Information、Product Notifications、Anti-Counterfeiting）生成分類 Checkbox 與 Keyword 搜尋。
- 下方使用結果表格；目前 Excel／選單並**無正式 Support PDF 檔案**，所以下載鈕標記 `Awaiting file` 且停用。
- 正式版收到 PDF 後需增加上傳後台與文件分類、下載連結、語系、版本資訊。

### 4. 原有功能保留

- 原 6 大產品群、18 組產品 Excel 規格、6,504 筆來源資料列、6,477 個不重複料號。
- 首頁 Hero、產品分類卡、應用領域圖卡、品質區塊、資源入口。
- 詳細規格視窗、CSV 匯出、分頁、排序。
- 客戶提供的中英文等分類名稱（主視覺與說明文字尚未全語翻譯）。

## 未完成／待客戶提供

1. 兩份 Google Drive Mega Menu 參考無法在此次工具環境中讀取；本版依**客戶詳細書面描述**及 Taiwan Semiconductor 網站的可讀取內容調整。若需一比一確認細節，請提供可公開下載的截圖或影片檔。
2. Application 第三層分類內容（目前只有 6 組產業第二層）。
3. Support 正式 PDF、文件標題、分類、版本、下載權限、多語檔案。
4. WordPress 正式整合：Avada Child Theme／獨立 Plugin、管理後台、資料庫、權限／驗證、WPML 內容翻譯、PDF Media IDs、AJAX/REST server-side 查詢與 SQL 索引。
5. 瀏覽器完整跨裝置 QA：此包已通過 JavaScript 語法、HTML 結構檢查與 Node VM 篩選邏輯測試；受測試環境的瀏覽器管理政策限制，未能跑真實瀏覽器自動化截圖。

## 建議 WordPress 實作方式

- **Mega Menu**：Avada Child Theme 註冊 `Products`、`Applications` 分層 Walker，依 `menu_item_parent`／分類階層展開；Support、About 使用正常子選單；鍵盤導航及手機 Accordion。
- **產品資料**：料號、分類、電性規格、PDF 路徑以客製資料表管理；CSV／Excel 批次匯入，保存原始單位與數值型態；按產品模板控制 filter 欄位顯示順序和類型。
- **Filter API**：頁面載入只取當前類別必要欄位，不把全量 6,504+ 筆送入瀏覽器；使用 REST API + 防抖 + 分頁 + 查詢索引；服務端篩選結果回傳 `distinct_part_numbers` 與 `rows`。
- **Support**：獨立 Documents CPT 或自訂表，存文件類別、標題、PDF 附件 ID、語言、版本、發布日和狀態。未提供附件不能產生假下載鏈結。
- **效能**：目前 wpdev Query Monitor 曾顯示 11.99s 後台頁面產生時間，與前端 Demo 無直接關係；應先解決 WP 啟動、OPcache／外掛與 WPML Clone 問題，再部署。勿用整包靜態檔覆蓋 WordPress 根目錄。

## 檔案結構

- `index.html` — 完整互動網頁
- `assets/css/site.css` — V4＋V4.1 Mega Menu／橫向 Filter／Support 樣式
- `assets/js/app.js` — 前端互動與篩選邏輯
- `assets/data/nav.js` — 客戶選單階層資料
- `assets/data/sheet-*.js` — 原始 18 份 Excel 資料轉換（Demo 專用）
- `SEP_V4.1_客戶回饋驗收清單.md` — 可逐項驗收與正式版待辦

正式網站 `sepsemi.com` 與 `wpdev.sepsemi.com` **均未被此 ZIP 自動修改**。


## V4.2 P1 (2026-11-24)

- Products mega menu: Product Family / Category / Overview with six distinct concept SVGs, explanations, View All links, pending Datasheets notice.
- Applications mega menu: Application / Application Focus / Related Product Families with selectable focus and illustrative image.
- About: six distinct hash routes under #about/ and dedicated content areas; official corporate copy, jobs, news and legal policy are placeholders pending SEP approval.
- Existing product filtering and Support document filter unchanged. The preview does not deploy to WordPress.


## V4.3 — 客戶第二輪回饋（2026-11-25）

1. **導覽選單遮蔽修正**：點選 Products／Applications／Support／About 連結後收起選單；支援點擊空白與 Esc 關閉。滑鼠離開主選單後可再次展開。
2. **規格區排版**：增加分類 → 篩選 → 結果流程提示、篩選欄捲動按鈕，保留上方 Filter Panel 與下方全寬 Results Table 分離。
3. **聯動篩選（Faceted Filtering）**：以其他已選欄位限制目前欄位可選值，無符合資料的 Checkbox 灰化並禁用；顯示每個選項符合資料列數。數值區間顯示隨條件更新的可用範圍。相同欄位仍可多選，已選值可取消。
4. **獨立產品詳情頁**：點選 Product Center 表格料號開啟 `product.html?sheet=031&row=0&part=BAT42W`，呈現規格、CSV、同系列產品及文件區塊。PDF 仍待客戶提供，不使用假的文件連結。
5. **排版參考尚待逐圖對照**：客戶提供的三份 Google Drive 參考本輪無法直接存取，因此目前以文字需求落實流程與版面優化；若需像素級對照，請另外提供可檢視的截圖。

本版只更新 GitHub Pages 前端展示；未修改 `sepsemi.com` 或 `wpdev.sepsemi.com`。正式 WordPress 尚需建立產品資料模型、文件後台與查詢 API。


## V4.4 — 產品分類與 Parametric Search 客戶版（2026-11-25）

依據客戶提供的「產品篩選頁」三張參考截圖調整：

- **產品頁版型**：移除 Products 頁的大型漸層 Banner；加入分類主標題、來源資料列數（Source Rows）、產品系列數（Product Families）、當前規格項目（Category Parameters）；將 Part Number 搜尋、Product Family 下拉、深藍色篩選列、Selected Filters、全寬搜尋結果表格，依照附件的操作順序排列。
- **Product Hierarchy**：新增六大產品群／18 個子分類的 3 × 2 分類彈窗。點擊項目即更新產品分類與表格，彈窗關閉；包含 ESC、點擊遮罩、鍵盤焦點限制。
- **聯動篩選**：維持跨欄位無效選項灰化；數值欄顯示其他條件下實際可用的規格值，提供「選取精確數值」按鈕；拒絕沒有產品結果的 Min/Max 組合並還原不合法輸入。
- **產品列表**：提供料號獨立詳情頁連結、可勾選產品列、Share（複製包含篩選條件的網址）、CSV Export、2–4 款 Excel 規格比對的 Compare 彈窗。
- **正式文件與庫存**：Datasheet 顯示 `PDF pending`；Stock Check 以 `Inquire` 郵件詢問作為替代入口，**不是即時庫存查詢**；PDF 以及即時庫存須等待客戶資料與正式串接。
- **分享與直接連結**：`#products/011` 指向「Single-Phase Bridge Rectifier」，`#products/share/<URL-encoded JSON>` 可帶入分類、已選規格、數值區間等篩選條件。
- **既有功能**：保留 Products／Applications 三欄 Mega Menu、Support／About 下拉、產品獨立詳情頁及 18 份來源 Excel 轉換資料。
- **範例驗證**：Single-Phase Bridge Rectifier 的實際來源 Excel 為 962 筆；GBPC + VRRM 600–1000V 得 12 筆，不使用附件示意的 195 筆作為真實資料。
- **部署邊界**：此版本為 GitHub Pages 前端 Demo。未更動正式 `sepsemi.com` 或開發 `wpdev.sepsemi.com`；WordPress 產品管理、上傳 PDF、庫存查詢及正式搜尋 API 尚需另外整合。

### 客戶可測試入口

- [Products / category](https://martin-no1tw.github.io/sep-product-demos/#products/011)
- [Products / Product Hierarchy](https://martin-no1tw.github.io/sep-product-demos/#products)（進入後點 Product Hierarchy）
- [產品獨立詳情 BAT42W](https://martin-no1tw.github.io/sep-product-demos/product.html?sheet=031&row=0&part=BAT42W)
