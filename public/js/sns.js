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
				var mainHTML = "<div><p>"+obj.get("commenter")+"<span>"+FormatDate(obj.createdAt)+"</span></p><p>" + obj.get("content") + "</p></div><div class='divider'></div>"
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

function insertStatus(array) {
	var currentUser = AV.User.current();
	var statusHTML = "";
	array.forEach(function(obj) {
		var followHTML = "";
		var userName = "我";
		if (AV.User.current().id != obj._serverData.source.id) {
			userName = "匿名用户";
//			followHTML = "<button onclick='follow(event)' class='btn waves-effect waves-light follower' id='" + obj._serverData.source.id + "'>关注</button>";
		}
		var imgHTML = "";
		if (obj._serverData.image) {
			imgHTML = "<img src='" + obj._serverData.image + "'>";
		}
		var commentHTML = "<button onclick='commentModal(event)' id='" + obj.id + "' class= 'btn waves-effect waves-light seeComment'>查看评论</button>";
		statusHTML += "<div class='divider'></div><div class='cover'><h5 class='username'>" + userName + "<span class='time'>"+ FormatDate(obj.createdAt) +" </span></h5><p class='content'>" + obj._serverData.message + "</p>" + imgHTML +"<br/>"+ commentHTML + "</div>";
console.log( obj._serverData);
	});
	$("#status").empty();
	$("#status").append(statusHTML);
}

function FormatDate (strTime) {
	var date = new Date(strTime);
	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+' '+date.getHours()+":"+date.getMinutes() ;
}
