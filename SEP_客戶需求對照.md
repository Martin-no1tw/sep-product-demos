# SEP 客戶改版需求對照（Demo V4.0）

| 客戶回覆 | 本次處理結果 | 後續待確認 |
|---|---|---|
| 採用經典企業藍白版型 | 改為單一正式候選版型、主站首頁直接為新設計 | LOGO 原檔及字體授權 |
| 首頁可參考 `首頁_V5.png` | 參考頁面資訊架構：頂部導覽、Hero、產品卡片、應用領域、品質、資源、Footer | Banner 正式文案、攝影圖片、證書 |
| 產品架構 `SEP_網站選單階層表_V1.xlsx` | 65 列階層參考，涵蓋 Home、Products、Applications、Support、About、Contact；Products 6 大類／18 子類，已支援選單互動 | 其它頁面文案及文件下載連結 |
| 不需要立體城市互動地圖 | 新版首頁及 Applications 頁面完全不包含城市 SVG / 地圖熱點 | 無 |
| 產品清單 ZIP | 已接入 18 份 Excel 的 6,504 筆原始資料列；依類別顯示不同規格欄位、搜尋、篩選、CSV 匯出 | 產品重複料號 27 筆額外列、PDF Datasheet 實際來源 |

## 已知資料風險與說明

- 來源含 6,504 筆 Excel 資料列、6,477 個不重複 Part Number；不能未經確認直接以料號唯一化覆蓋。
- 「Standard Recovery Rectifier」選單對應產品 Excel `021_General Purpose Rectifier.xlsx`。此映射需客戶確認。
- MOSFETs 源資料部分電性欄位以文字儲存，本 Demo 會在篩選時計算可解析數值；正式匯入應建立型別檢核與正規化。
- 不包含官方 PDF Datasheet；不假裝已有可下載的真實 PDF。單筆規格與篩選結果提供 CSV 匯出。
- 「IATF 16949、ISO 9001、ISO 14001」圖像標示是首頁排版示例，非經核實的認證聲明。
- Cross Reference、正式聯絡表單寄送及完整多語內文不是本次 Demo 已完成的後端功能。

## 主要互動測試

- 首頁六大分類動態切換次分類。
- 產品中心 18 分類及不同欄位模板。
- 單筆料號查詢、Min／Max 過濾與 CSV 匯出。
- 應用領域六卡、品質／技術支援／公司／聯絡頁。
- 手機版選單及響應式版型。

部署：將 ZIP 解壓後**整個網站根目錄內容**部署到靜態主機；本 Demo 不是 WordPress Plugin，不會修改正式站。
