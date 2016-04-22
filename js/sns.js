/**
 * Created by wangzhilong on 16/4/7.
 */
$(document).ready(function() {
	AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');
});

function publish() {
	var text = $("#status_to_public").val();
	var status = new AV.Status(null, text);
	if (text != "") {
		AV.Status.sendStatusToFollowers(status).then(function(status) {
			//发布状态成功，返回状态信息
			//			alert("发送成功");
			Materialize.toast("发送成功", 3000, 'rounded');
			location.reload();
		}, function(err) {
			//发布失败
			console.dir(err);
		});
	} else {
		Materialize.toast("内容不能为空", 3000, 'rounded');
	}

}

function queryAllStatus() {
	var query = new AV.Query('_Status');
	var statusHTML = "";
	query.find().then(function(resutls) {
		resutls.reverse();
		insertStatus(resutls);
	}, function(error) {
		console.log(error);
	});
}

function commentModal(event) {
	getCommentForStatus(event.target.id, function(results, err) {
		var contentHTML = "";
		if (results) {
			results.reverse();
			results.forEach(function(obj) {
				var mainHTML = "<p>"+obj.get("commenter")+"</p><p>" + obj.get("content") + "</p>"
				contentHTML += mainHTML;
			});
		}
		if(!results || results.length == 0) {
			contentHTML += "<p>没有评论</p>";
		}
		var addCommentHTML = "<input type='text' id='addCommentContent'/><button  class= 'btn waves-effect waves-light seeComment' onclick='addNewComment(event)' id='" + event.target.id + "'>添加评论</button>";
		contentHTML += addCommentHTML;
		$("#commentModalContent").empty();
		$("#commentModalContent").append(contentHTML);
		$('#commentModel').openModal();
	});
}

function addNewComment(event) {
	var content = $("#addCommentContent").val();
	var username = AV.User.current().getUsername();
	if (content.length > 0) {
		setCommentForStatus(event.target.id, {"content":content,"username":username}, function(success, err) {
			if (success) {
				$('#commentModel').closeModal();
			} else {
				Materialize.toast('failed', 3000, 'rounded');
			}
		});
	}
	else {
		alert("评论不能为空");
	}
}

function friends() {
	var query = AV.Status.inboxQuery(AV.User.current());
	query.find().then(function(statuses) {
		//查询成功，返回状态列表，每个对象都是 AV.Status
		insertStatusObj(statuses);
	}, function(err) {
		//查询失败
		console.dir(err);
	});
}
/*
function follow(e) {
	AV.User.current().follow(e.target.id).then(function() {
		alert('关注成功');
	}, function(err) {
		console.dir(err);
	});
}
*/
function insertStatus(array) {
	var currentUser = AV.User.current();
	var statusHTML = "";
	array.forEach(function(obj) {
		var followHTML = "";
		var userName = currentUser.get('username');
		if (AV.User.current().id != obj._serverData.source.id) {
			userName = "匿名用户";
//			followHTML = "<button onclick='follow(event)' class='btn waves-effect waves-light follower' id='" + obj._serverData.source.id + "'>关注</button>";
		}
		var imgHTML = "";
		if (obj._serverData.image) {
			imgHTML = "<img src='" + obj._serverData.image + "'>";
		}
		var commentHTML = "<button onclick='commentModal(event)' id='" + obj.id + "' class= 'btn waves-effect waves-light seeComment'>查看评论</button>";
		statusHTML += "<div class='divider'></div><div class='cover'><h5 class='username'>" + userName + "</h5><p class='content'>" + obj._serverData.message + "</p>" + imgHTML +"<br/>"+ commentHTML + "</div>";

	});
	$("#status").empty();
	$("#status").append(statusHTML);
}

function insertStatusObj(array) {
	var currentUser = AV.User.current();
	var statusHTML = "";
	array.forEach(function(obj) {
		var followHTML = "";
		var userName = currentUser.get('username');
		if (AV.User.current().id != obj.get('source').id) {
			userName = "匿名用户";
		}
		var imgHTML = "";
		if (obj.data.image) {
			imgHTML = "<img src='" + obj._serverData.image + "'>";
		}
		statusHTML += "<div class='divider'></div><div class='cover'><h5 class='username'>" + userName + "</h5><p class='content'>" + obj.data.message + "</p>" + imgHTML + commentHTML + "</div>";
	});

	$("#status").empty();
	$("#status").append(statusHTML);
}