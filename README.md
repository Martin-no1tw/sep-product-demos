# SEP Electronics · 客戶選版 Demo V4.0

**樣式：經典企業藍白版**，首頁排版參考客戶提供的《首頁_V5.png》，非一比一複製圖面；最終影像、文案、證書、技術文件與多語翻譯需客戶驗收。

## 開啟 Demo

- 解壓縮，直接使用 Chrome / Edge / Safari 開啟根目錄 `index.html`。
- 首頁：上方導覽、輪播 Hero、六大產品類別、動態次分類、應用領域六卡、品質與技術資源。
- 產品中心：Part Number 搜尋、第一／第三層分類、封裝／狀態篩選、類型專屬 Min／Max 規格篩選、排序、分頁、詳細規格、CSV 匯出。
- 無 3D 城市互動地圖，無後端或外部 API；表單是純前端提示。

## 資料來源

- `SEP_網站選單階層表_V1.xlsx`：第一層導航與 Products 的 6 大分類、18 子分類，以及 Applications/Support/About/Contact 階層。內含英文、繁中、簡中、日文命名；Demo 目前以英語文案為主，選單可以切換四語名稱。
- `01_產品清單-20261122T162116Z-1-001.zip`：內含 **18 個產品 Excel**，已整理 **6,504 筆來源資料列、6,477 個不重複的 Part Number**。不同產品群使用各自的原始 Excel 規格欄位。
- Excel 內的 `021_General Purpose Rectifier` 對應選單上的 `Standard Recovery Rectifier`。
- 來源中部分料號重複，正式匯入前應確認是否可合併或屬不同規格／封裝。

## 重要事項

- PDF Datasheet **未**包含在本次 18 份 Excel 中：本 Demo 不提供虛構的正式 PDF，只支援真實來源規格下載為 CSV。
- IATF 16949、ISO 9001、ISO 14001 等標誌僅為版面參考項目，正式對外發布前應核對公司認證。
- 聯絡資料為使用者提供的首頁參考圖文字；請客戶核對。
- `Cross Reference` 和聯絡表單在此為 UI 示範，尚無實際對照資料與收件後端。
- 本 Demo 的圖像均為新繪製 SVG，未直接取用參考網站的圖片。
- GitHub Private Repository 與客戶公開預覽網址為兩回事。推送到 GitHub 不等於發布公開頁面。

## 建議後續 WordPress 實作

1. 產品資料與分類 ID 對照、重複料號驗證。
2. 依 18 種產品規格類型製作可重用欄位模板。
3. WP Custom Plugin：分類、料號、規格值、Excel 匯入、PDF 上傳。
4. Avada 前台模板與搜尋／篩選 AJAX API。
5. WPML 翻譯、權限、SEO、301 轉址與 QA。

原始網站：`sepsemi.com`。本 Demo 不修改 WordPress 正式站或資料庫。
