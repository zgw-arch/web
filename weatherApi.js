const lat = 31.32;
const lon = 120.62;

// 【关键】加上daily参数，获取五天预报数据
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,uv_index&timezone=auto`;

// 天气文字映射
function getWeatherText(code) {
  switch(code) {
	case 0: return "晴";
	case 1: return "晴转多云";
	case 2: return "多云";
	case 3: return "阴";
	case 45:
	case 48: return "雾";
	case 51:
	case 53:
	case 55: return "小雨";
	case 61:
	case 63:
	case 65: return "雨";
	case 71:
	case 73:
	case 75: return "雪";
	case 80:
	case 81:
	case 82: return "阵雨";
	default: return "未知天气";
  }
}

// AQI等级转换
function getAqiLevel(aqi) {
  if (aqi <= 20) return "优";
  if (aqi <= 40) return "良";
  if (aqi <= 60) return "中";
  return "差";
}

// 风速等级判断
function getWindLevel(speed) {
	if (speed < 1) {
		return "无风";
	} else if (speed < 6) {
		return "软风";
	} else if (speed < 12) {
		return "轻风";
	} else if (speed < 20) {
		return "微风";
	} else if (speed < 29) {
		return "和风";
	} else if (speed < 39) {
		return "清劲风";
	} else if (speed < 50) {
		return "强风";
	} else if (speed < 62) {
		return "疾风";
	} else if (speed < 75) {
		return "大风";
	} else if (speed < 89) {
		return "烈风";
	} else if (speed < 103) {
		return "狂风";
	} else if (speed < 118) {
		return "暴风";
	} else {
		return "飓风";
	}
}

// 天气码映射修复：分开4、5两个key
const wMap={
  0:"晴",
  1:"晴转多云",
  2:"多云",
  3:"阴",
  4:"雾",
  5:"雾",
  51:"小雨",
  61:"雨",
  71:"雪",
  80:"阵雨"
};

// 自动生成未来5天：今天/明天/周三/周四……动态星期

function getNext5Months() {
   const months = [];
   const now = new Date();
   for (let i = 0; i < 5; i++) {
	 // 每次创建一个新日期对象，避免引用问题
	 const d = new Date(now);
	 d.setDate(now.getDate() + i); // 今天 + i天
	 // 提取月份并补零
	 const m = String(d.getMonth() + 1).padStart(2, '0');
	 months.push(m);
   }
   return months;
 }
 // 使用示例
 const fiveMonths = getNext5Months();
 console.log(fiveMonths); // ["06", "06", "06", "06", "06"]



function renderForecast(data){
  const daily = data.daily;
  const weekText = ["周日","周一","周二","周三","周四","周五","周六"];
  let h='';

  for(let i=0;i<5;i++){
	// 拿到当日日期对象
	const dateObj = new Date(daily.time[i]);
	const monthDay = fiveMonths[i]+"/"+dateObj.getDate(); // 几号
	const weekIdx = dateObj.getDay(); // 0周日~6周六

	let dayLabel;
	if(i === 0) dayLabel = "今天";
	else if(i === 1) dayLabel = "明天";
	else dayLabel = weekText[weekIdx];

	let w = wMap[daily.weathercode[i]] || "晴";
	let min = daily.temperature_2m_min[i],
		max = daily.temperature_2m_max[i];

	h+=`<div class="forecast-item">
	  <div class="forecast-day">
		<span class="date-num">${monthDay}</span>
		<span class="date-text">${dayLabel}</span>
	  </div>
	  <div class="weather-text">${w}</div>
	  <div class="forecast-temp">
		<span class="temp-low">${min}</span>
		<span class="temp-high">${max}</span>
	  </div>
	</div>`;
  }
  document.getElementById('forecastList').innerHTML=h;
}

async function loadWeather() {
  try {
	const [wRes, aRes] = await Promise.all([
	  fetch(weatherUrl),
	  fetch(airUrl)
	]);

	const wData = await wRes.json();
	const aData = await aRes.json();

	document.getElementById("currentTemp").innerText = wData.current_weather.temperature + "℃";
	document.getElementById("weatherText").innerText =  getWeatherText(wData.current_weather.weathercode);

	const windSpeedVal = wData.current_weather.windspeed;
	const windLevelText = getWindLevel(windSpeedVal);

document.getElementById("windSpeedNum").innerHTML = `风速<br>${windSpeedVal}km/h`;
	document.getElementById("windSpeedType").innerText = `·${windLevelText}`;

document.getElementById("aqiLevel").innerHTML = "空气质量<br>" + getAqiLevel(aData.current.european_aqi);
document.getElementById("uvIndex").innerHTML = "紫外线<br>" + aData.current.uv_index;

	renderForecast(wData);

  } catch (e) {
	console.error(e);
	document.getElementById("currentTemp").innerText = "加载失败";
  }
}

window.addEventListener("load", loadWeather);





// 打字机效果配置
const typeText = document.getElementById('typeText');
const textStr = "专注网页前端开发 | 静态页面制作 | 交互效果实现";
let index = 0;

function typeWrite() {
  if (index < textStr.length) {
	typeText.innerHTML += textStr.charAt(index);
	index++;
	setTimeout(typeWrite, 80); // 打字速度，数字越小越快
  }
}

// 页面加载后启动
window.addEventListener('load', function() {
  typeWrite();
});
