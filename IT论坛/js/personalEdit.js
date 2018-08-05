let editButton=document.getElementById('editMessageButton'),
	personalArea=document.getElementById('personalArea'),
	personalDataArea=document.getElementById('personalDataArea'),
	returnMainButton=document.getElementById('returnMainButton'),
	fixedTool=document.getElementById('fixedTool'),
	userJson,
	xhrUrl='http://182.254.230.88:8080',
	loginAttentionList,
	user_name,
	replyToUserId;
editButton.onclick=disappear;
returnMainButton.onclick=disappear;
/*切换信息区域*/
function disappear(){
	personalArea.classList.toggle('disappear');
	personalDataArea.classList.toggle('disappear');
}

/*上传图片*/
function uploadFiles(){ 
	let excelFile=document.getElementById('excelFile');
	if(excelFile.files[0].size>5000000){
		coolAlert('图片不能大于5M');
	}
	else{
		let uploadFile = new FormData(document.getElementById("file"));
		if("undefined" != typeof(uploadFile) && uploadFile != null && uploadFile != ""){
		let	xhr=new XMLHttpRequest();
			xhr.open('post',xhrUrl+'/se52/userimg.do',true);
			xhr.send(uploadFile);
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					if(xhr.status==200){
						updateUser('user_img',xhr.responseText);
						changePhoto(xhr.responseText);
					}
				}
			}
		}
	}
}   

/*弹窗*/
function coolAlert(str){
	let coolAlert=document.getElementById('coolAlert');
	coolAlert.innerText=str;
	coolAlert.classList.add('coolAlertShow');
	setTimeout(function(){
		coolAlert.classList.remove('coolAlertShow');
	},3000);
}

/*获取数据*/
function getUserMessage(){
	let user_id=window.location.href.split('?')[1].split('#')[0],
		 xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/user/check.do',true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send("id="+user_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				userJson=(JSON.parse(xhr.responseText));
				fixedTool.classList.remove('disappear');
				showUserMessage((JSON.parse(xhr.responseText))['userinfo']);
			}
		}
	}
}

/*更新显示数据*/
function showUserMessage(str){
	if(str){
	changePhoto(str['user_img']);
	changeName(str['user_name']);
	document.getElementById('tel').value=str['user_tel'];
	document.getElementById('email').value=str['user_email'];
	}
}

/*更新数据*/
function updateUser(key,value){
	userJson['userinfo'][key]=value;
	let str="";
	for(let [key,value] of Object.entries(userJson['userinfo'])){
		let substr=key+'='+value;
		str+=substr;
		if(key!='user_img')
		str+='&';
	}
	if(userJson){
		let xhr=new XMLHttpRequest;
			xhr.open('post',xhrUrl+'/se52/user/modify.do',true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(str);
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					if(xhr.status==200){
						if(JSON.parse(xhr.responseText)['modifyResult']=='修改成功!'){
							coolAlert('更新数据成功');
						}
						else{
							coolAlert('更新数据失败');
						}
						
					}
				}
			}
			
	}
	else{
		coolAlert('数据加载中');
	}
}
/*改变图片显示*/
function changePhoto(url){
	document.getElementById("userPhoto").src=xhrUrl+url;
	if(!localStorage.nowUserId){
		document.getElementById("navItemUser").classList.add('disappear');
		document.getElementById("navLoginButton").classList.remove('disappear');
	}
	document.getElementById("personalUserPhoto").src=xhrUrl+url;
}
function changeName(str){
	document.getElementById('personalName').innerText=str;
	document.getElementById('userName').value=str;
	user_name=str;
}

/*监听修改信息*/
personalDataArea.addEventListener('click',function(e){
	let pattern;
	switch(e.target.id){
		case 'userNameSave':
			updateUser('user_name',document.getElementById('userName').value);
			break;
		case 'userTelSave':
			pattern=/^[0-9]+$/;
			if(pattern.test(document.getElementById('tel').value)){
			updateUser('user_tel',document.getElementById('tel').value);
			}
			else{
				coolAlert('电话号码只可以是数字！！');
			}
			break;
		case 'userEmailSave':
			pattern=/^[a-zA-Z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
			if(pattern.test(document.getElementById('email').value)){
				updateUser('user_email',document.getElementById('email').value);
			}
			else{
				coolAlert('邮箱格式错误');
			}
			break;
		case 'updatePassword':
			if(document.getElementById('oldPassword').value!=userJson['userinfo']['user_password']){
				coolAlert('密码输入错误');
			}
			else{
				if(document.getElementById('newPassword').value!=
					document.getElementById('newPasswordAgain').value){
					coolAlert('前后密码不一致');
				}
				else{
				updateUser('user_password',document.getElementById('newPasswordAgain').value)
				break;
				}
			}
		}
});

/*工具栏监听*/
fixedTool.addEventListener('click',function(e){
	switch(e.target.id){
		case 'signOut':
			delete localStorage.nowUserId;
			window.location.href="index.html";
	}
});
/*公告部分*/
function getNewAnnouncement(){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/findByType.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('type=announcement');
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				let array=JSON.parse(xhr.responseText)['list'],
				i=array.length-1;
				getAnnouncementContent(array[i]['note_id'],array[i]['note_title']);
			}
		}
	}
}
function getAnnouncementContent(note_id,title){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/viewNote.do',true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send('noteId='+note_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				let str=JSON.parse(xhr.responseText)['content'].substr(0,JSON.parse(xhr.responseText)['content'].length-4),
					li=`
						<p class="noticeTitle">${title}</p>
						<div class="noticeBody">
							${str}
						</div>
					`;
				document.getElementById('notice').innerHTML=li;
			}
		}
	}
}



/*关注用户*/
function getAttentionList(){/*查看用户的关注列表*/
	let xhr=new XMLHttpRequest(),
	    user_id=window.location.href.split('?')[1];
	xhr.open('post',xhrUrl+'/se52/showSubscribe.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_id='+user_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showAttentionList(JSON.parse(xhr.responseText)['userlist']);
			}
		}
	}
}

/*获得登陆者关注列表*/
function getAttentionOfLogin(){
	let xhr=new XMLHttpRequest(),
	    user_id=localStorage.nowUserId;
	xhr.open('post',xhrUrl+'/se52/showSubscribe.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_id='+user_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				loginAttentionList=JSON.parse(xhr.responseText)['userlist'];
				document.getElementById('attentionButton').onclick=addAttention;
				for(let i in loginAttentionList){
					if(loginAttentionList[i]['user_id']==window.location.href.split('?')[1].split('#')[0]){//判断是否关注
						document.getElementById('attentionButton').value="已关注";
						document.getElementById('attentionButton').onclick=deleteAttention;
					}
				}
			}
		}
	}
}
function addAttention(){/*添加关注*/
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/subscribeUser.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('subscribe_userid='+localStorage.nowUserId+'&subscribed__userid='+window.location.href.split('?')[1].split('#')[0]);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				if(JSON.parse(xhr.responseText)){
					document.getElementById('attentionButton').value="已关注";
					document.getElementById('attentionButton').onclick=deleteAttention;
				}

			}
		}
	}
}
function deleteAttention(){//取消关注
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/deleteSubscribe.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('subscribe_userid='+localStorage.nowUserId+'&subscribed__userid='+window.location.href.split('?')[1].split('#')[0]);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				if(JSON.parse(xhr.responseText)){
					document.getElementById('attentionButton').value="++关注";
					document.getElementById('attentionButton').onclick=addAttention;
				}

			}
		}
	}
}

function showAttentionList(array){
	let str="";
	for(let i in array){
		str+=`
			<li>
						<div class="doSomethingTitle">
								<span class="Something">关注用户</span>
								<span class="timeOfDoSomething">${array[i]['create_time']}</span>
						</div>	
						<div class="doSomethingContent">
							<a href="personal.html?${array[i]['user_id']}">	${array[i]['user_name']}</a>
						</div>
			</li>
			`
	}
	if(array.length==0){
		str=`
			<li>
				<div class="doSomethingTitle">
								<span class="Something">关注用户</span>
								<span class="timeOfDoSomething"></span>
						</div>	
						<div class="doSomethingContent">
							<a>暂无</a>
						</div>
			</li>
			`
	}
	document.getElementById('postList').innerHTML=str;
}

/*发送私信*/
function sendMessage(){
	if(!localStorage.nowUserId){
		coolAlert('请先登录');
		return false;
	}
	document.getElementById('sendMessageArea').style="top:60px";
	document.getElementById('accepterName').innerText=user_name;
}
/*回复私信*/
function replyMessage(toId,toName){
	replyToUserId=toId;
	document.getElementById('sendReplyMessageArea').style="top:60px";
	document.getElementById('accepterReplyName').innerText=toName;
}
document.getElementById('closeReplyMessageSend').onclick=function(){
	document.getElementById('sendReplyMessageArea').style="top:-260px";
}
document.getElementById('sendReplyNow').onclick=function(){
	let value=document.getElementById('sendReplyMessageContent').value,
		user_id=replyToUserId,
		send_user_id=localStorage.nowUserId;
	if(value){
		let xhr=new XMLHttpRequest();
		xhr.open('post',xhrUrl+'/se52/addMessage.do',true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send('content='+value+'&getterId='+user_id+'&user_id='+send_user_id);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					if(JSON.parse(xhr.responseText)['addflag']){
						document.getElementById('sendReplyMessageArea').style="top:-260px";
						coolAlert('发送成功');
					}
					else{
						coolAlert('发送失败');
					}
				}
			}
		}
	}
	else{
		coolAlert('说点东西吧');
	}
}
document.getElementById('closeMessageSend').onclick=function(){
	document.getElementById('sendMessageArea').style="top:-260px";
}
document.getElementById('sendNow').onclick=function(){
	let value=document.getElementById('sendMessageContent').value,
		user_id=window.location.href.split('?')[1],
		send_user_id=localStorage.nowUserId;
	if(value){
		let xhr=new XMLHttpRequest();
		xhr.open('post',xhrUrl+'/se52/addMessage.do',true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send('content='+value+'&getterId='+user_id+'&user_id='+send_user_id);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					if(JSON.parse(xhr.responseText)['addflag']){
						document.getElementById('sendMessageArea').style="top:-260px";
						coolAlert('发送成功');
					}
					else{
						coolAlert('发送失败');
					}
				}
			}
		}
	}
	else{
		coolAlert('说点东西吧');
	}
}
/*获取私信*/
function getYourMessage(){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/showMessage.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_id='+localStorage.nowUserId);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showYourMessage(JSON.parse(xhr.responseText)['count']);
			}
		}
	}
}
function showYourMessage(array){
	let str="";
	for(let i in array){
		str+=`
			<li onclick="deleteMessage('${array[i]['message_id']}',this)">
						<div class="doSomethingTitle">
								<span class="Something">发送者:${array[i]['poster_name']}</span>
								<span class="timeOfDoSomething">发送时间:${array[i]['create_time']}</span>
						</div>	
						<div class="doSomethingContent" >
							<a>	${array[i]['content']}</a>
						</div>

			</li>
			<input class="replyButton" type="button" value="回复此人" onclick="replyMessage('${array[i]['poster']}','${array[i]['poster_name']}')">
			`
	}
	if(array.length==0){
		str=`
			<li>
						<div class="doSomethingTitle">
								<span class="Something">暂无</span>
								<span class="timeOfDoSomething"></span>
						</div>	
						<div class="doSomethingContent">
							<a>暂无</a>
						</div>
			</li>
			`
	}
	document.getElementById('postList').innerHTML=str;
}

/*删除消息*/
function deleteMessage(message_id,dom){
	let result=confirm('确定删除吗？');
	if(result){
		let xhr=new XMLHttpRequest();
		xhr.open('post',xhrUrl+'/se52/deleteMessage.do',true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send('message_id='+message_id);
		xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					if(xhr.status==200){
						if(JSON.parse(xhr.responseText)["deleteflag"]){
							dom.style="display:none";
							coolAlert('删除成功');
						}
						else{
							coolAlert('删除失败');
						}
					}
				}
		}
	}
}
(function(){
	let user_id=window.location.href.split('?')[1];
	if(!user_id){
		window.location.href="index.html";
	}
	user_id=user_id.split('#')[0];
	if(user_id!=localStorage.nowUserId){
		let sendMessageButton=document.getElementById('sendMessageButton');
		editMessageButton.classList.add('disappear');
		sendMessageButton.classList.remove('disappear');
		sendMessageButton.addEventListener('click',sendMessage);
		if(localStorage.nowUserId){
			document.getElementById('attentionButton').classList.remove('disappear');
		}
	}

	if(localStorage.nowUserId){//判断用户是否登录
		let xhr=new XMLHttpRequest();
		xhr.open('post',xhrUrl+'/se52/user/check.do',true);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send("id="+localStorage.nowUserId);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					userJson=(JSON.parse(xhr.responseText));
					fixedTool.classList.remove('disappear');
					document.getElementById("navUserPhoto").src=xhrUrl+(JSON.parse(xhr.responseText))['userinfo']['user_img'];
				}
			}
		}
		if(user_id==localStorage.nowUserId){
			document.getElementById('yourMessage').style="display:block";
		}
		getAttentionOfLogin();
	}
	getUserMessage();
	getNewAnnouncement();
	getUserNoteList();
})();

/*获取动态*/
function getUserNoteList(){
	let user_id=window.location.href.split('?')[1].split('#')[0];
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/showNote.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_id='+user_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showNoteList(JSON.parse(xhr.responseText)['note'],'发布');
			}
			else{
				window.location.href="index.html";
			}
		}
		
	}
}
/*获取评论*/
function getUserCommontList(){
	let user_id=window.location.href.split('?')[1].split('#')[0];
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/findNote.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_id='+user_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showNoteList(JSON.parse(xhr.responseText)['nclist'],'评论');
			}
		}
	}
}
/*获取收藏*/
function getUserLikeList(){
	let user_id=window.location.href.split('?')[1].split('#')[0];
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/user/showCollection.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_id='+user_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showNoteList(JSON.parse(xhr.responseText)['collectedNote'],'收藏');
			}
		}
	}
}
function deleteSome(type,f_id,s_id){/*删除文章，评论，收藏*/
	let result=confirm('是否删除？');
	if(result){
		let url,data;
		if(type=='note'){
			url=xhrUrl+'/se52/note/delete.do';
			data="note_id="+f_id;
		}
		let xhr=new XMLHttpRequest(),
			thisLi=event.target.parentNode.parentNode;
		xhr.open('post',url,true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(data);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					if(JSON.parse(xhr.responseText)['message']){
							let parentUl=thisLi.parentNode;
						thisLi.parentNode.removeChild(thisLi);
						if(!parentUl.getElementsByTagName('li').length){
							parentUl.innerHTML=`
								<li>
									<div class="doSomethingTitle">
													<span class="Something">发布了文章</span>
													<span class="timeOfDoSomething"></span>
											</div>	
											<div class="doSomethingContent">
												<a>暂无</a>
											</div>
								</li>
							`
						}
					}
					else{
						coolAlert('删除失败');
					}
				}
			}
		}
	}
}
function showNoteList(array,dowhat){
	let str="",
		display="none",
		thisFun="";

	if(localStorage.nowUserId==window.location.href.split('?')[1]&&dowhat=="发布"){
		display="block";
	}
	for(let i in array){
		if(dowhat=="发布")
		thisFun=`onclick=deleteSome('note',${array[i]["note_id"]})`;
		str+=`
			<li>
						<div class="doSomethingTitle">
								<span class="Something">${dowhat}了文章</span>
								<span class="timeOfDoSomething">${array[i]['create_time']}</span>
								<span class="deleteThisLi fa fa-close" style="display:${display};" ${thisFun}></span>
						</div>	
						<div class="doSomethingContent">
							<a href="article.html?${array[i]['note_id']}">	${array[i]['note_title']}</a>
						</div>
			</li>
			`
	}
	if(array.length==0){
		str=`
			<li>
				<div class="doSomethingTitle">
								<span class="Something">${dowhat}了文章</span>
								<span class="timeOfDoSomething"></span>
						</div>	
						<div class="doSomethingContent">
							<a>暂无</a>
						</div>
			</li>
			`
	}
	document.getElementById('postList').innerHTML=str;

}

/*给指定子元素添加样式，其他子元素去除样式*/
function selectOne(fatherDom,tag,target,className){
	let array=fatherDom.getElementsByTagName(tag);
	for(let i of array){
		i.classList.remove(className);
	}
	target.classList.add(className);
}
document.getElementById('noteNavList').addEventListener('click',function(e){
	selectOne(document.getElementById('noteNavList'),'li',e.target,'active');
	switch(e.target.innerText){
		case '发布文章':getUserNoteList();break;
		case '评论':getUserCommontList();break;
		case '收藏':getUserLikeList();break;
		case '关注列表':getAttentionList("showAttentionList");break;
		case '消息':getYourMessage();break;
	}
})