let articleTypeArray=['推荐','前端','Android','后台','人工智能','iOS','工具资源','阅读','运维'],
	xhrUrl='http://182.254.230.88:8080',
	searchPostButton=document.getElementById('searchPostButton');
~~(function getAllPostList(){
	var xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/all.do',true);
	xhr.send(null);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showALLPostList(JSON.parse(xhr.responseText)['list']);
			}
		}
	}
})();
function showALLPostList(array){
	let str="",
		postList=document.getElementById('postList');
	for(let i in array){
		str+=`
			<li>
					<span>${array[i]['create_time']}</span>
					<span>${array[i]['poster_name']}</span>
					<span>${array[i]['poster_id']}</span>
					<span>${array[i]['note_title']}</span>
					<span>${array[i]['note_id']}</span>
					<span>${articleTypeArray[array[i]['categories_id']-1]}</span>
					<span>${array[i]['visitor_number']}</span>
					<span>
						<input class="deleteButton" type="button" value="删除"
						onclick="deletePost('${array[i]['note_id']}')">
					</span>
			</li>
		`
	}
	postList.innerHTML=str;
}
function deletePost(note_id){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/delete.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('note_id='+note_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				if(JSON.parse(xhr.responseText)['message']=="删除成功"){
					window.location.href="";
				}
				else{
					coolAlert('删除失败');
				}
			}
		}
	}
}
/*搜素*/
searchPostButton.addEventListener('click',function(){
	let searchPostValue=document.getElementById('searchPost').value;
	let searchByArray=document.getElementsByName('searchBy');
	if(searchByArray[0].checked)
		searchNote(searchPostValue);
	else{
		searchNoteByPoster(searchPostValue);
	}


});
function searchNote(value){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/findByTitle.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('note_title='+value);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showALLPostList(JSON.parse(xhr.responseText)['list']);
			}
		}
	}
}
function searchNoteByPoster(value){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/findByPosterName.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_name='+value);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showALLPostList(JSON.parse(xhr.responseText)['list']);
			}
		}
	}
}