let emailCodeNumber;/*登记邮箱验证码*/

/*登录框初始化*/
function initAlert(loginButtonId){
	document.body.innerHTML+=`
		<div id="alertArea" class="loginAlertArea disappear">
		<div  class="loginAlert">
			<div id="login" class="">
				<div class="title"><span>登录</span><i id="closeLoginButton" class="fa fa-close"></i></div>
				<ul id="loginForm" class="formArea">
					<li>
						<input id="loginId" type='text' placeholder='输入用户名'>
						<span id="loginIdError" class="somethingError disappear">用户名只能由数字和字母组成</span>
					</li>					
					<li>
						<input id="loginPassword" type='password' placeholder='输入密码'>
						<span id="loginPasswordError" class="somethingError disappear">密码不能为空</span>
					</li>
				</ul>
				<button id="loginButton" class="submitButton">登录</button>
				<span id="loginText" class="submitText">没有账号？注册</span>	
			</div>
			<div id="register" class="disappear">
				<div class="title"><span>注册</span><i id="closeRegisterButton" class="fa fa-close"></i></div>
				<ul id="registerForm" class="formArea">
					<li>
						<input id="registerId" type='text' placeholder='输入用户账号' maxlength='16'>
						<span id="registerIdError" class="somethingError disappear">用户账号只能由数字和字母组成</span>
					</li>
					<li>
						<input id="registerName" type='text' placeholder='输入用户名'>
						<span id="registerNameError" class="somethingError disappear">用户名不能为空</span>
					</li>
					<li>
						<input id="registerPassword" type='password' placeholder='输入密码'>
						<span id="registerPasswordError" class="somethingError disappear">密码不能为空</span>
					</li>
					<li>
						<input id="registerEmail" type='text' placeholder='输入邮箱'>
						<span id="registerEmailError" class="somethingError disappear">邮箱格式不正确</span>
					</li>
					<li>
						<input id="sendEmailButton" type='button' value='点击发送验证码'>
					</li>
					<li>
						<input id="emailCode" type='text' placeholder='输入验证码'>
						<span id="emailCodeError" class="somethingError disappear">验证码错误</span>
					</li>
					
				</ul>
				<button id="registerButton" class="submitButton">注册</button>
				<span id="registerText" class="submitText">已有账号登录</span>	

			</div>		
		</div>
	</div>
	<div id="coolAlert">something is Error</div>	
	`;
	let login=document.getElementById('login'),
	register=document.getElementById('register'),
	alertArea=document.getElementById('alertArea'),
	registerId=document.getElementById('registerId'),
	registerEmail=document.getElementById('registerEmail'),
	emailCode=document.getElementById('emailCode'),
	navLoginButton=document.getElementById(loginButtonId);
	navLoginButton.onclick=disappearArea;
	document.getElementById('newPostButton').addEventListener('click',function(){
		if(localStorage.getItem('nowUserId')){
			window.location.href="newPost.html";
		}
		else{
			coolAlert('请先登录');
			disappearArea();
		}
	});
	alertArea.addEventListener('click',function(e){
		switch(e.target.id){
			case 'loginText':
			case 'registerText':
				disappearForm();break;
			case 'closeLoginButton':
			case 'closeRegisterButton':
				disappearArea();
				break;
			case 'loginButton':
				serialize('loginForm');break;
			case 'registerButton':
				serialize('registerForm');break;
			case 'sendEmailButton':
				serialize('sendEmailButton');
				break;
		}
	});
	alertArea.addEventListener('blur',function(e){
		switch(e.target.id){
			case 'registerId':
			case 'loginId':
			case 'registerPassword':
			case 'loginPassword':
			case 'registerEmail':
			case 'emailCode':
			case 'registerName':
				testInput(e.target)
				break;
		}
	},true);
	/*测试数据是否正确*/
	function testInput(dom){
		var pattern=/^[A-Za-z0-9]+$/;
		switch(dom.id){
			case 'registerId':
			case 'loginId':
				ragExpText(dom,pattern);
				break;
			case 'registerEmail':
				pattern=/^[a-zA-Z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
				ragExpText(dom,pattern);
				break;
			case 'emailCode':
				if(!emailCodeNumber||dom.value!=emailCodeNumber){
					document.getElementById(dom.id+'Error').classList.remove('disappear');
					dom.style="border-color:rgb(255,108,0)";
				}
				else{
					document.getElementById(dom.id+'Error').classList.add('disappear');
					dom.style="";
				}
				break;
			case 'registerName':
			case 'registerPassword':
				if(!dom.value){
					document.getElementById(dom.id+'Error').classList.remove('disappear');
					dom.style="border-color:rgb(255,108,0)";
				}
				else{
					document.getElementById(dom.id+'Error').classList.add('disappear');
					dom.style="";
				}
				break;
		}
	}
	function ragExpText(dom,pattern){
		if(!pattern.test(dom.value)){
			document.getElementById(dom.id+'Error').classList.remove('disappear');
			dom.style="border-color:rgb(255,108,0)";
		}
		else{
			document.getElementById(dom.id+'Error').classList.add('disappear');
			dom.style="";
		}
	}
	function disappearForm(){
		login.classList.toggle('disappear');
		register.classList.toggle('disappear');
	}
	function disappearArea(){
		alertArea.classList.toggle('disappear');
	}
};


/*表单验证*/
function serialize(str){
	let formArea,arrayList,emailCode;
	if(str=='sendEmailButton'){/*获取验证码*/
		formArea=document.getElementById('registerForm');
		arrayList=formArea.getElementsByTagName('input');
		let sendEmail=true,
			emailNumber=0;
		for(let value of arrayList){
			if(value.type=='text'&&value.id!='emailCode'){
				if(value.value==""||value.style.borderColor=='rgb(255, 108, 0)')
					sendEmail=false;
			}
			if(value.id=="registerEmail")
				emailNumber=value.value;
		}
		if(sendEmail){
			document.getElementById(str).disabled="disabled";
			document.getElementById(str).value="请等待。。。";
			getEmailCode(emailNumber);
		}
		else
			console.log('不可发送验证码');
	}
	else{/*登录或者注册*/
		formArea=document.getElementById(str),
		arrayList=formArea.getElementsByTagName('input');
		let submitValue=true,
			data;
		for(let value of arrayList){
			if(value.type=='text'||value.type=='password'){
				if(value.value==""||value.style.borderColor=='rgb(255, 108, 0)')
					submitValue=false;
			}
		}
		if(submitValue){
			if(str=="registerForm"){/*注册部分*/
				if(document.getElementById('registerId').value.length<6){
					coolAlert('用户名不可以小于6个字')
				}
				else{
					data=`user_id=${document.getElementById('registerId').value}&user_name=${document.getElementById('registerName').value}&user_password=${document.getElementById('registerPassword').value}&user_email=${document.getElementById('registerEmail').value}&user_tel=null`;
				document.getElementById('registerButton').innerText="请等待。。。";
				document.getElementById('registerButton').disabled=true;
				register(data);	
				}
			}
			else{/*登录部分*/
				data=`id=${document.getElementById('loginId').value}&password=${document.getElementById('loginPassword').value}`;
				document.getElementById('loginButton').innerText="请等待。。。";
				document.getElementById('loginButton').disabled=true;
				login(data);	
			}
		}
	}
}

/*获取邮箱验证码*/
function getEmailCode(emailNumber){
	let xhr=ajax('post','http://202.116.162.57:8080/se52/checkEmail.do',true,
		'user_email='+emailNumber);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				emailCodeNumber=JSON.parse(xhr.responseText).message;
				document.getElementById("sendEmailButton").value="已发送(一分钟后才能再次发送)";
				setTimeout(function(){
					document.getElementById("sendEmailButton").value="点击发送验证码";
					document.getElementById("sendEmailButton").disabled="";
				},60000)
			}
		}
	}
}
/*注册*/
function register(data){
	let xhr=ajax('post','http://202.116.162.57:8080/se52/register.do',true,data);
		xhr.onreadystatechange = function(){
		    if(xhr.readyState === 4){
		        if(xhr.status == 200){
		        	if(JSON.parse(xhr.responseText).message=="成功"){ 
					document.getElementById('navLoginButton').classList.add('disappear');
					document.getElementById('navItemUser').classList.remove('disappear');
					document.getElementById('alertArea').style.display="none";
					data=data.split('&');
					data=data[0].split('=');
					localStorage.setItem('nowUserId',data[1]);
					window.location.href="";
					document.getElementById('fixedTool').classList.remove('disappear');
					getUserPhoto();
					} 
					else{
						coolAlert('用户已存在');
					}
					document.getElementById('registerButton').innerText="注册";
					document.getElementById('registerButton').disabled=false;
		        }
   			}
		}
}
/*登录*/
function login(data){
	let xhr=ajax('post','http://202.116.162.57:8080/se52/login.do',true,data);
	xhr.onreadystatechange = function(){
		    if(xhr.readyState === 4){
		        if(xhr.status == 200){
		        	if(JSON.parse(xhr.responseText).result=="1"){ 
					document.getElementById('navLoginButton').classList.add('disappear');
					document.getElementById('navItemUser').classList.remove('disappear');
					document.getElementById('alertArea').style.display="none";
					data=data.split('&');
					data=data[0].split('=');
					localStorage.setItem('nowUserId',data[1]);
					window.location.href="";
					document.getElementById('fixedTool').classList.remove('disappear');
					getUserPhoto();
					} 
					else{
						coolAlert('用户或密码错误');
					}
					document.getElementById('loginButton').innerText="登录";
					document.getElementById('loginButton').disabled=false;
		        }
   			}
		}
}
/*封装ajax*/
function ajax(method,url,async,data){
	let xhr=new XMLHttpRequest();
	xhr.open(method,url,async);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send(data);
	return xhr;
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
function getUserPhoto(){
	let xhr=new XMLHttpRequest();
	xhr.open('post','http://202.116.162.57:8080/se52/user/check.do',true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send("id="+localStorage.getItem('nowUserId'));
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				let userJson=(JSON.parse(xhr.responseText));
				document.getElementById("userPhoto").src="http://202.116.162.57:8080"+userJson['userinfo']['user_img'];
			}
		}
	}
}

/*页面加载完成后添加事件*/
function loadAddEvent(){
	document.getElementById('fixedTool').addEventListener('click',function(e){
	switch(e.target.id){
		case 'signOut':
			delete localStorage.nowUserId;
			window.location.href="index.html";
	}
	});

}
~~(function(){
initAlert('navLoginButton');/*加载登录框*/
	let nowUserId=localStorage.getItem('nowUserId'),
		fixedTool=document.getElementById('fixedTool');
	if(nowUserId){
		document.getElementById('navLoginButton').classList.add('disappear');
		document.getElementById('navItemUser').classList.remove('disappear');
		document.getElementById('alertArea').style.display="none";
		fixedTool.classList.remove('disappear');
		document.getElementById('navItemPerson').href="personal.html?"+nowUserId;
		getUserPhoto();
	};
	loadAddEvent();
})();
	