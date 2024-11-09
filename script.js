const historyList = document.getElementById("historyList");
const currentBid = document.getElementById("currentBid");

let highestBid = 0;  // 追踪目前最高出價
const minIncrement = 10;  // 最低增量限制

// 設置拍賣結束時間（例如10分鐘後）
const auctionEndTime = new Date().getTime() + 10 * 60 * 1000; // 10分鐘後

// 更新倒數計時器
function updateTimer() {
    const now = new Date().getTime();
    const timeLeft = auctionEndTime - now;

    // 計算分鐘和秒數
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // 顯示倒數時間
    document.getElementById("timer").textContent = `${minutes}分 ${seconds}秒`;

    // 拍賣結束，禁用出價表單
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = "拍賣已結束";
        document.getElementById("form").removeEventListener("submit", submitBid); // 停止接收出價
        document.querySelector("button[type='submit']").disabled = true;
    }
}

// 每秒更新一次倒數計時器
const timerInterval = setInterval(updateTimer, 1000);

function submitBid(event) {
    event.preventDefault(); // 防止表單提交刷新頁面

    // 獲取表單數據
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const bidAmount = parseFloat(document.getElementById("bidAmount").value);

    // 簡單的資料驗證
    if (!name || !phone || !email || !bidAmount) {
        alert("請填寫所有資訊！");
        return;
    }

    // 檢查出價是否符合最低增量
    if (bidAmount < highestBid + minIncrement) {
        alert(`您的出價必須至少高於 $${highestBid + minIncrement}`);
        return;
    }

    // 更新當前最高出價
    highestBid = bidAmount;
    currentBid.textContent = `$${highestBid}`;

    // 更新出價紀錄（匿名顯示）
    const bidItem = document.createElement("li");
    const time = new Date().toLocaleString();
    bidItem.textContent = `匿名出價 $${bidAmount} - ${time}`;
    historyList.prepend(bidItem);

    // 發送出價資料到伺服端
    fetch('/submitBid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            phone,
            email,
            bidAmount,
            time
        })
    }).then(response => {
        if (response.ok) {
            console.log("出價資料已成功傳送至伺服端");
        } else {
            console.error("出價資料傳送失敗");
        }
    });

    // 清空表單
    document.getElementById("form").reset();
}
