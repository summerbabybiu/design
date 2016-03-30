/**
 * Created by xx on 16/3/20.
 */
//leancloud initlize
$(document).ready(function() {
	AV.initialize('5aqElVR9DnjVMhhKToDR7uli-gzGzoHsz', 'ljClHbp9oUN6HxOUjSiYkSXc');
	var currentUser = AV.User.current();
	if (currentUser) {
		// do stuff with the user
		$('#cover_name').text(currentUser.get('username'));
		$('#cover_name').append('<i class="mdi-navigation-arrow-drop-down right"></i>');
		$('#nav-mobile2').addClass('hide');
		$('#nav_user').removeClass('hide');
	}
});

function register() {
	var userName = $("#register_name").val();
	var userEmail = $("#register_email").val();
	var userPassword = $("#register_password").val();
	console.log('userName: ' + userName + 'userEmail: ' + userEmail + 'userPassword: ' + userPassword);
	if (userName && userEmail && userPassword) {
		var user = new AV.User();
		user.set('username', userName);
		user.set('password', userPassword);
		user.set('email', userEmail);
		user.signUp().then(function(user) {
			Materialize.toast("注册成功", 3000, 'rounded');
			window.location.reload();
		}, function(error) {

			alert(error.message);
		});
	} else {
		alert("任意一项不能为空!");
	}

}

function enter() {
	var typeEmail = $('#login_email').val();
	var typePassword = $('#login_password').val();
	AV.User.logIn(typeEmail, typePassword).then(function() {
		// 成功了，现在可以做其他事情了
		location.reload();
	}, function() {
		// 失败了
		Materialize.toast("密码或用户名不正确！", 3000, 'rounded');
	});

}

function log_out() {
	AV.User.logOut();
	location.reload();
}

function resetPassword() {
	console.log($('#login_email').val());
	//判断邮箱格式是否正确
	var myreg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if (myreg.test($('#login_email').val())) {
		//判断邮箱是存在
		var query = new AV.Query('_User');
		query.equalTo('email', $('#login_email').val());
		query.find().then(function(results) {
			if (results.length == 0) {
				Materialize.toast("邮箱未注册！请先注册", 3000, 'rounded');
			} else if (results.length == 1) {
				AV.User.requestPasswordReset($('#login_email').val()).then(function() {
					// Password reset request was sent successfully
					Materialize.toast("重置链接发送成功，请注意查收邮件！", 3000, 'rounded');
				}, function(error) {
					// Show the error message somewhere
					console.log('Error: ' + error.code + ' ' + error.message);
				});
			}
		}, function(error) {
			console.log('Error: ' + error.code + ' ' + error.message);
		});
	} else {
		alert('找回密码请输入正确的邮箱地址！');
	}
}

function changePassword() {
	var newpass = $('#new_p').val();
	var compass = $('#confirm_p').val();
	if (newpass === compass) {
		var user = AV.User.current();
		user.setPassword(newpass);
		user.save().then(function() {
  		// 成功
  		AV.User.logOut();
  		Materialize.toast("密码修改成功！", 1000, 'rounded');
		});
		setTimeout(function(){
			location.reload();
		},1001);
		
	} else {
		alert('两次密码不匹配！');
		$('#new_p').val('');
		$('#confirm_p').val('');
	}
	
}