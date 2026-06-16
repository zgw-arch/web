const snowCount = 30; // 雪花数量

function createSnow() {
	for (let i = 0; i < snowCount; i++) {
		const snow = document.createElement('div');
		snow.classList.add('snow');

		// 随机雪花大小
		const size = Math.random() * 4 + 1;
		// 横向位置 0~100%
		const left = Math.random() * 100;
		// 下落时长 2~6秒，大小雪花速度区分
		const duration = Math.random() * 9 + 3;
		// 透明度，远处雪花更淡
		const opacity = Math.random() * 0.5 + 0.4;

		snow.style.width = `${size}px`;
		snow.style.height = `${size}px`;
		snow.style.left = `${left}%`;
		snow.style.opacity = opacity;
		snow.style.animationDuration = `${duration}s`;

		document.body.appendChild(snow);
	}
}

createSnow();
