const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// 儲存出價紀錄的變數
let bidData = [];

// 接收前端的出價資料
app.post('/submitBid', (req, res) => {
    const { name, phone, email, bidAmount, time } = req.body;

    // 新的出價資料推入陣列
    bidData.push({ Name: name, Phone: phone, Email: email, BidAmount: bidAmount, Time: time });

    // 自動生成Excel文件
    generateExcel();

    res.sendStatus(200);
});

// 生成並儲存Excel文件的函數
function generateExcel() {
    const worksheet = XLSX.utils.json_to_sheet(bidData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BidHistory");

    // 將Excel文件儲存在伺服端
    XLSX.writeFile(workbook, './BidHistory.xlsx');
}

app.listen(PORT, () => {
    console.log(`伺服器正在 http://localhost:${PORT} 上運行`);
});
