# SEP 官網 V4.5｜2026-11-29 客戶回饋與驗收

## 變更一覽

| 客戶需求 | 修改內容 | 驗收狀態 |
|---|---|---|
| 26112803：產品篩選頁精簡 | 移除標題下的來源資料筆數、產品系列數、規格欄位列表及舊來源說明 | 已完成 HTML / JS 檢查 |
| 產品篩選頁_5：Filter Fields | 深藍標題列新增欄位選單；使用者勾選顯示欄位；不同分類各自保存偏好；隱藏已套用條件的欄位會清除該隱藏條件 | 程式已完成，仍需桌機與手機互動驗收 |
| 26112801：產品頁導覽列一致 | 獨立產品詳情頁使用與首頁相同的 header、Products / Applications Mega Menu、Support / About 下拉選單、語言選擇 | 已確認 HTML 結構相同；仍需跨裝置驗收 |
| 26112802：語系麵包屑 | 主頁分類標題及麵包屑依 nav.js 的繁中／簡中／英／日分類翻譯顯示；獨立產品頁麵包屑及 UI 標題亦翻譯 | 已實作，技術欄位及所有說明文案尚未全語系翻譯 |
| 固定料號 URL | 產品頁依料號而非 Excel row number 尋找資料；建立真正的靜態英文／繁中 BAT42W 範例及 WordPress 動態產品路由外掛 | GitHub Pages 僅示範兩個 SKU 語系頁；WordPress 外掛需安裝驗收 |

## 現在多語系如何製作

GitHub Pages 是前端 JavaScript 多語系：從 `assets/data/nav.js` 的 `en / zh / zhs / ja` 欄位讀取**已提供的分類翻譯**，加上 V4.5 的主要介面字串字典。這不是 WPML，尚未包含全部內容的正式譯文或在不同語系獨立管理頁面。

主要頁面語系以 `?lang=zh-tw` 等查詢參數切換，並呈現翻譯的產品分類麵包屑。WordPress 的永久 URL 建議統一為：

- `/zh-tw/products/KBJ2510/`
- `/en/products/KBJ2510/`
- 如有需求另支援 `/zh-cn/products/KBJ2510/`、`/ja/products/KBJ2510/`

**注意：KBJ2510 尚未出現在目前 18 組 Excel 轉換產品資料中，因此無法顯示其實際規格。** 現在使用實際有來源的 BAT42W 驗證如下：

- GitHub Pages：`https://martin-no1tw.github.io/sep-product-demos/en/products/BAT42W/`
- GitHub Pages：`https://martin-no1tw.github.io/sep-product-demos/zh-tw/products/BAT42W/`
- GitHub Pages 其他 SKU：仍使用穩定料號查詢，例如 `product.html?lang=zh-tw&part=MB10S`，**不是全部產品的靜態 SEO permalink**。
- **wpdev WordPress Bridge v1.1.0** 匯入 V4.5 GitHub 快照後，動態支援所有符合料號規則、存在來源資料的 `/{lang}/products/{part}/`。不存在的 SKU 回傳 HTTP 404。

## 驗收清單

- [ ] 開啟 `#products/011`，確認標題下方已移除 Source Rows 與 Category Parameters 兩行資訊
- [ ] 開啟 Filter Fields，選擇 Family／Package／VRRM／IO 等條件，顯示欄位同步增減
- [ ] 隱藏已勾選的 Package 時，原有 Package 條件會同步取消，搜尋結果重新計算
- [ ] 重新整理頁面，所選篩選欄位維持；切換不同產品分類時，各分類維持獨立偏好
- [ ] 選 Package=GBPC，檢查其餘條件與無效選項灰化仍正常
- [ ] 開啟產品詳情頁，確認 Header 與主頁有完整 Products／Applications／Support／About／語言選單
- [ ] 在主頁選「繁體中文」，麵包屑與產品分類標題改成中文；產品獨立頁亦可切語言
- [ ] 開啟 BAT42W 的 `/en/products/` 與 `/zh-tw/products/` 示範網址，內容一致、麵包屑語言不同
- [ ] 安裝 Bridge v1.1.0 後，刷新 WordPress 固定網址設定並匯入 GitHub main，驗證路由
- [ ] 測試不存在料號：WordPress 應回傳 404，而不是空白或錯誤產品頁
- [ ] 檢查桌機／手機版 Mega Menu、Filter Fields Popover、選單收合及固定網址直接開啟

## SEO 上線前必要事項

目前 wpdev 與 GitHub Demo 都是內部審核展示版，應維持 noindex。正式站上線前須完成：完整多語系內文及標題；正式唯一料號表與更新流程；產品頁 SSR／WordPress 模板；canonical 與 hreflang 規劃；sitemap；301 舊網址轉址；SEO plugin 衝突檢查；技術文件 PDF 與備份機制。

> 本輪沒有修改正式站 sepsemi.com，也未清空 WordPress 資料庫。GitHub main 合併後需依外掛手冊在 wpdev 手動升級／同步。
