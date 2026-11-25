# SEP Electronics V4.4｜客戶需求驗收清單

版本：V4.4（2026-11-25）  
GitHub Pages：https://martin-no1tw.github.io/sep-product-demos/  
指定分類：https://martin-no1tw.github.io/sep-product-demos/#products/011

> 本清單區分「已從原始碼／來源產品資料驗證」與「仍需人工瀏覽器驗收」；目前僅為 GitHub Pages 展示版，非 WordPress 正式站。

## A. 選單收合
- [ ] 使用桌機滑鼠進入 Products Mega Menu，點選 Category → 選單關閉，不再遮蔽頁面
- [ ] Applications 的 Focus／Explore、Support、About 點選後自動收合
- [ ] 滑鼠移出 Header 後可以正常再次展開
- [ ] 手機漢堡選單、Escape 與點擊頁面外側均可關閉

## B. 客戶附件版型
- [x] Products 已改成緊湊式分類標題與導覽（程式確認）
- [x] Source Rows、Product Families、Category Parameters 根據來源資料動態顯示
- [x] Part Number 搜尋與 Product Family 下拉在同一列
- [x] 深藍色 Parametric Search 標題列；Clear Filter／Filter: ON/OFF
- [x] Filter Column 水平捲動，單欄多選項垂直捲動
- [x] Selected Filters 可移除；全寬 Results Table 不跟篩選區水平移動
- [x] Product Hierarchy 彈窗：六大產品群、18 個子分類入口，桌機 3 × 2 排版
- [ ] 使用者實際打開彈窗、選取分類、按 Esc 與 X 關閉（瀏覽器實測）
- [ ] 手機窄版排版、橫向與直向捲動無誤（瀏覽器實測）

## C. 聯動篩選
- [x] Checkbox：其他欄位在條件改變後重新計數，無結果的選項灰化且 disabled
- [x] 同一欄位保留多選能力，已選條件可以解除
- [x] 數值欄顯示目前可用的 Min／Max 和實際離散規格值
- [x] 對沒有產品的數值區間，拒絕並顯示提示
- [x] 來源測試：Single-Phase Bridge Rectifier 的 Excel 有 962 列；GBPC + VRRM 600–1000V 結果 12 列
- [ ] 互動測試：GBPC、VRRM、IO、Family、Circuit Configuration 各欄位聯動正確
- [ ] 清除條件、切換分類、重新整理與分享連結可正確恢復搜尋條件

## D. 結果表格／產品詳情
- [x] 結果表格包含勾選、Part Number、Datasheet、Stock Check／Inquire、Status 及適用規格欄位
- [x] 點料號開啟獨立 `product.html` 而非 Modal
- [x] 分享網址可包含分類、關鍵字、Checkbox 與 Min／Max
- [x] 最多四款產品以來源 Excel 規格表比較
- [x] CSV 匯出功能保留
- [ ] 瀏覽器測試：勾選兩到四筆產品後比較表顯示正確
- [ ] 瀏覽器測試：Share → 複製網址 → 無痕開啟，篩選條件仍存在
- [ ] 產品獨立頁跨分類、不同格式的 Excel 欄位可以正常呈現

## E. 正式資料待補（請勿誤認已串接）
- [ ] Datasheet PDF、Package Drawing、可靠度文件：需客戶提供並對應料號
- [ ] Stock Check：目前只有詢問 SEP 的 Email，不是即時庫存 API
- [ ] WordPress 後台、CSV/Excel 批次匯入、產品穩定永久網址與伺服器端篩選：待正式整合
- [ ] 已核准的圖片、產品描述、Applications 對應與公司文案：待客戶提供

> 附件示意的 Single-Phase 195 筆與目前來源 Excel 的 962 筆不同，展示版本以實際 Excel 列數為準。
