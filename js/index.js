/**
 * Created by xx on 16/3/20.
 */
//leancloud initlize
AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');

function register() {
	var userName = $("#register_name").val();
	var userEmail = $("#register_email").val();
	var userPassword = $("#register_password").val();
	if (userName && userEmail && userPassword) {
		var user = new AV.User();
		user.set('username', userName);
		user.set('password', userPassword);
		user.set('email', userEmail);
		user.signUp().then(function(user){
			alert("注册成功");
			window.location.reload();
		}, function(error){
			alert(error);
		});
	} else {
		alert("任意一项不能为空!");
	}

}