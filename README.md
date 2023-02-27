## cloud_demo

> 簡單的購物車 + 部落格 + API網站demo

* 後端使用node.js + Express + MongoDB(mongoose)
* 前端使用Bootstrap4.4.1

## 功能介紹
* 登入、登出、帳號資訊(暱稱、自介)、帳號頁面、個人首頁
* 部落格CRUD功能
* 購物車取放功能、結帳、補貨、購買過物品記錄、交易記錄
* 註冊活動、填自介活動、po文活動
* 氣象局API使用與確認資訊活動功能
* 每分點名活動，以"Wed Jan 01 2020 00:00:00 GMT+0800 (台北標準時間)"為基準
* 後台功能，後台使用權限待更新

## 其他
* 後台使用closure以大幅簡化程式碼(/routes/backstage.js)，其他類似寫法待更新
* 使用Promise語法處理mongoose非同步問題、以求順序正確及簡化語法
* 由於氣象局API需要key，請設定好環境變數apiCWBKey
* 氣象局API使用一介面[2020/1/1, 00:00(GMT +8)開始每6小時被動擷取一次]以串接客戶端，以防誤差產生
* 使用UTC方式傳輸時間再至客戶端解析，以簡化時區、日光節約時間問題
* 資料庫以"Wed Jan 01 2020 00:00:00 GMT+0800 (台北標準時間)"為基準，每小時重置一次(相關設定如設定檔/models/config.js)，首頁顯示下次重置時間



## 使用方法(環境須先確認port3000可作為伺服監聽port，以下以linux作為範例)

* 安裝node.js_vv12.14.0 + npm
* 安裝mongo4.2
* 執行mongo
```sh
$ sudo service mongod start
```
* 確認mongo成功執行，確認後離開
```sh
$ sudo service mongod status
```
* 至此工作目錄
* 安裝npm modules
```sh
$ npm install
```
* 初始化，確認完成後離開(initialize complete...)
```sh
$ node init.js
```
* 執行
```sh
$ node app.js
```


## npm modules use:
* [body-parser](https://www.npmjs.com/package/body-parser)
* [cors](https://www.npmjs.com/package/cors)
* [ejs](https://www.npmjs.com/package/ejs)
* [express](https://www.npmjs.com/package/express)
* [express-session](https://www.npmjs.com/package/express-session)
* [method-override](https://www.npmjs.com/package/method-override)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [passport](https://www.npmjs.com/package/passport)
* [passport-local](https://www.npmjs.com/package/passport-local)
* [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose)
* [request](https://www.npmjs.com/package/request)
