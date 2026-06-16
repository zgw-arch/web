const timeBox = document.getElementById('timeBox');
const dateBox = document.getElementById('dateBox');

function updateClock() {
	const now = new Date();
	// 时分秒补零
	const h = String(now.getHours()).padStart(2, '0');
	const m = String(now.getMinutes()).padStart(2, '0');
	const s = String(now.getSeconds()).padStart(2, '0');
	timeBox.textContent = `${h}:${m}:${s}`;

	// 纯公历日期，剔除星期
	const y = now.getFullYear();
	const mon = now.getMonth() + 1;
	const d = now.getDate();
	dateBox.textContent = `${y}年${mon}月${d}日`;
}

updateClock();
setInterval(updateClock, 1000);
