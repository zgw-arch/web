const btn = document.getElementById('getMealBtn');
const loading = document.getElementById('loading');
const mealBox = document.getElementById('mealBox');

btn.addEventListener('click', getRandomMeal);
window.addEventListener('load', getRandomMeal);

async function getRandomMeal() {
	loading.classList.remove('hide');
	mealBox.classList.add('hide');
	loading.textContent = "正在获取食谱...";

	try {
		const mealRes = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
		const mealJson = await mealRes.json();
		const meal = mealJson.meals[0];

		// 食材整理
		let ingredientList = [];
		for (let i = 1; i <= 20; i++) {
			const ing = meal[`strIngredient${i}`];
			const measure = meal[`strMeasure${i}`];
			if (ing && ing.trim()) {
				ingredientList.push(`${measure} ${ing}`.trim());
			}
		}
		const ingRaw = ingredientList.join('、');

		// 直接使用原文，移除所有翻译调用
		const nameCn = meal.strMeal;
		const categoryCn = meal.strCategory;
		const ingredientsCn = ingRaw;
		const stepsCn = meal.strInstructions;

		// 渲染
		document.getElementById('mealImg').src = meal.strMealThumb;
		document.getElementById('mealName').innerText = nameCn;
		document.getElementById('mealCategory').innerText = categoryCn;
		document.getElementById('mealIngredients').innerText = ingredientsCn;
		document.getElementById('mealStep').innerText = stepsCn;

	} catch (err) {
		loading.innerText = '加载失败，请点击按钮重试';
		console.error(err);
	} finally {
		loading.classList.add('hide');
		mealBox.classList.remove('hide');
	}
}
