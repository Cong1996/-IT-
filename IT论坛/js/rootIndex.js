let xhrUrl='http://182.254.230.88:8080';
~~(function getDate(){
	console.log('读取中');
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/getCount.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send(null);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				let array=JSON.parse(xhr.responseText);
				document.getElementById('userNumber').innerText=array["userCount"];
				document.getElementById('visitorNumber').innerText=array['visitCount'];
				document.getElementById('noteNumber').innerText=array['noteCount'];
				document.getElementById('blackListNumber').innerText=array['blackCount'];
			}
			else{
				console.log(xhr);
			}
		}
	}
})();