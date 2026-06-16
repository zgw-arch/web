const statusText = document.getElementById('status');
const boardEl = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');

// 改为 7×7 棋盘，下标 0~6，中心坐标 (3, 3)
const size = 7;
let cells = [];
let gameOver = false;
// 新增标记：是否为AI回合，禁止玩家点击
let isAiTurn = false;
const human = 'black'; // 玩家黑棋先手
const ai = 'white';    // AI白棋后手

// 初始化7*7棋盘格子
function initBoard() {
	boardEl.innerHTML = '';
	cells = [];
	gameOver = false;
	isAiTurn = false;
	statusText.textContent = '你先行（黑棋）';
	for(let y = 0; y < size; y++){
		for(let x = 0; x < size; x++){
			const div = document.createElement('div');
			div.className = 'cell';
			div.dataset.x = x;
			div.dataset.y = y;
			boardEl.appendChild(div);
			cells.push(div);
			div.addEventListener('click', cellClick);
		}
	}
}

// 根据xy获取格子对象
function getCell(x, y) {
	if(x < 0 || x >= size || y <0 || y >= size) return null;
	return cells[y * size + x];
}

// 判断当前落子方是否五连获胜
function checkWin(chessType, x, y) {
	const dirs = [
		[1,0],  // 横向
		[0,1],  // 纵向
		[1,1],  // 右下斜
		[1,-1]  // 右上斜
	];
	for(let [dx, dy] of dirs){
		let count = 1;
		// 正向延伸
		let cx = x + dx, cy = y + dy;
		while(getCell(cx, cy)?.classList.contains(chessType)){
			count++;
			cx += dx; cy += dy;
		}
		// 反向延伸
		cx = x - dx; cy = y - dy;
		while(getCell(cx, cy)?.classList.contains(chessType)){
			count++;
			cx -= dx; cy -= dy;
		}
		if(count >= 5) return true;
	}
	return false;
}

// 获取所有空坐标
function getEmptyPositions() {
	const arr = [];
	cells.forEach(cell => {
		if(!cell.classList.contains('black') && !cell.classList.contains('white')){
			arr.push({
				x: Number(cell.dataset.x),
				y: Number(cell.dataset.y),
				el: cell
			});
		}
	});
	return arr;
}

// 锁定全部格子禁止点击
function lockAllCell() {
	cells.forEach(c => c.style.pointerEvents = 'none');
}

// AI核心逻辑：自己赢 → 堵人 → 占中心(3,3) → 随机
function aiMove() {
	if(gameOver) return;
	const empty = getEmptyPositions();
	let target = null;

	// 1. AI能直接赢，优先落子取胜
	for(let pos of empty){
		pos.el.classList.add(ai);
		if(checkWin(ai, pos.x, pos.y)){
			target = pos;
		}
		pos.el.classList.remove(ai);
		if(target) break;
	}

	// 2. 玩家即将赢，优先封堵
	if(!target){
		for(let pos of empty){
			pos.el.classList.add(human);
			if(checkWin(human, pos.x, pos.y)){
				target = pos;
			}
			pos.el.classList.remove(human);
			if(target) break;
		}
	}

	// 3. 优先抢占7×7棋盘中心 (3, 3)
	if(!target){
		const center = empty.find(p => p.x === 3 && p.y === 3);
		if(center) target = center;
	}

	// 4. 剩余位置随机落子
	if(!target){
		target = empty[Math.floor(Math.random() * empty.length)];
	}

	// AI落子渲染
	target.el.classList.add(ai);
	if(checkWin(ai, target.x, target.y)){
		statusText.textContent = 'AI白棋获胜！';
		gameOver = true;
		lockAllCell();
		return;
	}

	// 判断平局
	const newEmpty = getEmptyPositions();
	if(newEmpty.length === 0){
		statusText.textContent = '本局平局！';
		gameOver = true;
		lockAllCell();
		return;
	}

	statusText.textContent = '轮到你落子（黑棋）';
	isAiTurn = false; // AI回合结束，开放玩家操作
}

// 格子点击：玩家落子
function cellClick(e) {
	// 新增判断：AI回合 / 游戏结束 / 已有棋子，都禁止点击
	if(gameOver || isAiTurn) return;
	const cell = e.target;
	if(cell.classList.contains('black') || cell.classList.contains('white')) return;
	
	const x = Number(cell.dataset.x);
	const y = Number(cell.dataset.y);

	// 玩家落黑棋
	cell.classList.add(human);
	if(checkWin(human, x, y)){
		statusText.textContent = '你获胜！';
		gameOver = true;
		lockAllCell();
		return;
	}

	// 判断平局
	const empty = getEmptyPositions();
	if(empty.length === 0){
		statusText.textContent = '本局平局！';
		gameOver = true;
		lockAllCell();
		return;
	}

	statusText.textContent = 'AI思考中...';
	isAiTurn = true; // 进入AI回合，禁止玩家点击
	// 延迟模拟AI思考
	setTimeout(aiMove, 500);
}

// 重置开局
resetBtn.addEventListener('click', initBoard);
initBoard();
