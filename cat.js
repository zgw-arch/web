async function getCatImage(){
  try{
	const res = await fetch('https://api.thecatapi.com/v1/images/search');
	const data = await res.json();
	document.getElementById('catImg').src = data[0].url;
  }catch(err){
	console.error('加载失败',err);
  }
}
document.getElementById('getCatBtn').addEventListener('click', getCatImage);
window.onload = getCatImage;
