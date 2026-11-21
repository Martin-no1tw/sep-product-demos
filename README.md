# SEP Semiconductor · 客戶選版 Demo V3.1

> **Private Repository 版本**：提供 SEP 半導體客戶審查 3 款網站樣式使用；本專案不是正式官網。

## 網站內容
- `index.html`：三款 Demo 選版入口
- `demo-a/`：經典企業藍白
- `demo-b/`：深藍科技形象
- `demo-c/`：清爽國際品牌
- 3 款均含互動式智慧城市應用圖、產品搜尋、規格篩選、產品詳細視窗、示範 PDF 與 CSV 匯出

所有料號、規格、PDF 為示範資料，不等於 SEP 正式產品資訊。表單不會實際寄信。

## 建立 Private Repository
1. 登入 GitHub 帳號 `Martin-no1tw`，前往 https://github.com/new
2. Repository name 填 `sep-product-demos`。
3. **Visibility 一定選 Private**。
4. 建立空白 Repository（先不要勾選 README、.gitignore、License）。
5. 解壓縮本檔，將 `index.html`、`demo-a/`、`demo-b/`、`demo-c/`、`previews/` 等**解壓縮後的檔案與資料夾**上傳到 repository 根目錄。
6. 提交（Commit changes），確認檔案已顯示在 `main` 分支。

### 在 Mac 終端機用 Git 上傳（替代第 5 步）
```bash
cd /path/to/SEP_GitHub_Private_Repo_V3.1
git init
git add .
git commit -m "Initial SEP V3.1 interactive demos"
git branch -M main
git remote add origin https://github.com/Martin-no1tw/sep-product-demos.git
git push -u origin main
```

## 如要給客戶「直接瀏覽網站」
**Private 程式碼與 Private 網站不是同一件事。**

- GitHub Free 的 GitHub Pages 不能以私人 Repository 作為發布來源。
- GitHub Pro / Team / Enterprise 的私有 Repository 可以設定 Pages，但一般 Pages **發布後仍可由網際網路公開訪問**。
- 需真正限制客戶登入才能訪問網站，建議在原有 Plesk staging 網域啟用密碼保護；或採用符合資格的 GitHub Enterprise Cloud 私人 Pages 功能。

如果 GitHub 帳號方案允許 Private Repo 啟用 Pages：
1. 前往 Repo `Settings → Pages`。
2. 在 `Build and deployment` 選擇 `Deploy from a branch`。
3. `main` + `/(root)`，按 Save。
4. GitHub 顯示成功後，預計網址：
   https://martin-no1tw.github.io/sep-product-demos/

**此網址目前尚未建立或發布，請不要直接發送給客戶。**

## 安全
- 沒有包含 WordPress、Plesk、資料庫密碼或 `wp-config.php`。
- `robots.txt` / `noindex` 只是希望搜尋引擎不要收錄，**不提供存取權限保護**。
- 正式產品資料、金鑰、合約檔請勿加入此展示 Repository。
