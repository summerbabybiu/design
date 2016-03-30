/**
 * Created by xx on 16/3/20.
 */
//leancloud initlize
$(document).ready(function(){
	AV.initialize('5aqElVR9DnjVMhhKToDR7uli-gzGzoHsz', 'ljClHbp9oUN6HxOUjSiYkSXc');
	var currentUser = AV.User.current();
	if (currentUser) {
	  // do stuff with the user
	  	$('#cover_name').text(currentUser.get('username'));
		$('#nav-mobile2').addClass('hide');
		$('#nav_user').removeClass('hide');
	}
});



function register() {
	var userName = $("#register_name").val();
	var userEmail = $("#register_email").val();
	var userPassword = $("#register_password").val();
	console.log('userName: '+userName+'userEmail: '+userEmail+'userPassword: '+userPassword);
	if (userName && userEmail && userPassword) {
		var user = new AV.User();
		user.set('username', userName);
		user.set('password', userPassword);
		user.set('email', userEmail);
		user.signUp().then(function(user){
			Materialize.toast("注册成功", 3000, 'rounded');
			window.location.reload();
		}, function(error){
			Materialize.toast(error.message, 3000, 'rounded');
		});
	} else {
		alert("任意一项不能为空!");
	}

}

function enter(){
	var typeEmail = $('#login_email').val();
	var typePassword = $('#login_password').val();
	AV.User.logIn(typeEmail, typePassword).then(function() {
  		// 成功了，现在可以做其他事情了
  		Materialize.toast("登陆成功", 3000, 'rounded');
		$('#cover_name').text(typeEmail);
		$('#nav-mobile2').addClass('hide');
		$('#nav_user').removeClass('hide');
		$("#logIn").addClass('hide');
	}, function() {
	  	// 失败了
	  Materialize.toast("密码或用户名不正确！", 3000, 'rounded');
	});
	
}

function log_out(){
	AV.User.logOut();
	$('#nav-mobile2').removeClass('hide');
	$('#nav_user').addClass('hide');
}
