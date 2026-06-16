function getPoem() {
	const btn = document.getElementById('refreshBtn');
	// 1. 禁用按钮，防止重复点击
	btn.disabled = true;
	btn.innerText = "加载中...";

	fetch('https://v1.jinrishici.com/all.json')
	.then(res => res.json())
	.then(data => {
		document.getElementById('poem').innerText = 
			`"${data.content}" —— ${data.author}《${data.origin}》`;
	})
	.catch(err => {
		console.log('诗词加载失败', err);
		document.getElementById('poem').innerText = "诗词加载出错";
	})
	.finally(() => {
		// 2. 无论成功/失败，都恢复按钮
		btn.disabled = false;
		btn.innerText = "点击更换诗词";
	});
}

// 页面初始化
getPoem();
document.getElementById('refreshBtn').addEventListener('click', getPoem);更改了哪些内容
