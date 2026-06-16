function getChartOption(inputData, dataMax, unit) {
	const validData = inputData.filter(item => {
		const num = Number(item.value);
		return item.name.trim() !== "" && !isNaN(num) && num >= 0;
	}).map(item => {
		let name = item.name.trim();
		// 仅处理直辖市后缀：北京市→北京、上海市→上海
		name = name.replace(/^(.+市)$/, function(match, p1) {
			const cityList = ["北京", "上海", "天津", "重庆"];
			if (cityList.includes(p1)) return p1;
			return match;
		});
		return {
			name: name,
			value: Number(item.value)
		};
	});

	return {
		tooltip: {
			trigger: "item",
			formatter: function(params) {
				if (isNaN(params.value)) {
					return params.name + "<br/>暂无数据";
				}
				return `${params.name}<br/>数值：${params.value}${unit}`;
			}
		},
		visualMap: {
			min: 0,
			max: dataMax,
			left: "center",
			bottom: "3%",
			text: [`${dataMax}${unit}`, `0${unit}`],
			textStyle: { fontSize: 14 },
			calculable: false,
			inRange: {
				color: ["#f0f7ff", "#b8d8ff", "#63aaff", "#1b76e8", "#003380"]
			}
		},
		series: [
			{
				type: "map",
				map: "china",
				roam: true,
				zoom: 1.05,
				label: { show: true, fontSize: 9 },
				itemStyle: {
					borderColor: "#ffffff",
					borderWidth: 1,
					areaColor: "#f0f7ff"
				},
				emphasis: {
					itemStyle: { areaColor: "#4294ff" }
				},
				data: validData
			}
		]
	};
}
