# SEP V4.1｜客戶回饋驗收清單

日期：2026-11-24　基準：V4.0 經典企業藍白版

| ID | 客戶需求 | V4.1 Demo 狀態 | 驗收方式 | WordPress 正式版注意事項 |
|---|---|---|---|---|
| NAV-01 | Products 階層 Mega Menu | 已實作 | 滑入／點按 Products，切換六大分類，右側子分類跟著更換 | 由 WP Menu／分類管理，非硬編 6 類 |
| NAV-02 | Applications 階層 Mega Menu | 已實作架構 | 滑入 Applications，切換 6 種產業，詳情按鈕可進應用頁 | 第三層分類待客戶提供 |
| NAV-03 | Support 一般下拉 | 已實作 | Support 下拉列 5 類、點擊可到文件分類 | URL 及頁面階層需與現站相符 |
| NAV-04 | About 一般下拉 | 已實作 | About 顯示 6 項，點擊跳到 About Demo | 正式子頁文字／網址待客戶確認 |
| PF-01 | Parametric Search 在表格上方 | 已實作 | 篩選列位於完整寬度表格之前 | Avada Template／Shortcode 共用 |
| PF-02 | 依資料型態多選、數值 Min/Max | 已實作 | 在單相 Bridge Rectifier 嘗試 Package + VRRM 篩選 | 可擴充 Slider，後台需欄位型別設定 |
| PF-03 | Filter 區水平捲動 | 已實作 | 橫向移動篩選區，下方表格不跟著移動 | 桌機滑鼠/觸控板/手機 QA |
| PF-04 | 不同欄位寬度 | 已實作 | 比較 Package 與 Status 寬度 | 欄位 min-width 由型態和選項數決定 |
| PF-05 | 欄位內垂直捲動 | 已實作 | 找 Package 可見獨立垂直捲軸 | 可搜尋多選項 |
| PF-06 | 每欄高度一致 | 已實作 | 同列短列表與長列表對齊 | 高度需根據螢幕可調 |
| PF-07 | Clear Filter | 已實作 | 設定後點 Clear Filter，結果恢復 | 清除欄位但保留大類/系列定位 |
| PF-08 | Filter Toggle | 已實作 | 收合後仍顯示相同產品結果 | 支援 aria-expanded |
| PF-09 | 即時刷新 / Part Number 計數 | 已實作（Demo 端） | 勾選 Package，計數立刻縮小；無 Search 按鈕 | 上線需後端分頁與 count distinct |
| PF-10 | Filter 和結果表格互相獨立 | 已實作 | 收合篩選，上下分頁與排序仍可操作 | 表格手機自身可能需要獨立橫捲 |
| SP-01 | Support 分類篩選 | 已實作 | 勾選 Quality & Reliability，下方剩 3 個分類項目 | 資料以正式文件 metadata 為準 |
| SP-02 | PDF 文件表格及下載 | 介面已實作，PDF 尚缺 | 表格顯示 Awaiting file、按鈕停用 | 需客戶提供真實 PDF 方可上線 |
| SEC-01 | 不更動正式站／已建 wpdev | 已遵守 | 本包為獨立 HTML Demo | WordPress 需另外實作及部署 |

## 客戶提供資料清單

- Applications 若要第三層：各產業 → 次分類 → 對應 URL 與圖文。
- Support：文件類別、名稱、PDF、語系、版本、生效日，及是否公開。
- Products：新增篩選欄位（若 Excel 尚無）、欄位型別、顯示名稱、單位、範圍上下限、排序與多選方式。
- Mega Menu 兩支 Drive 範例的截圖或影片：用於最後確認視覺動線。
