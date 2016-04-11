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
			alert("发送成功");
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
		insertStatus(resutls);
	}, function(error) {
		console.log(error);
	});
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

function follow(e) {
	AV.User.current().follow(e.target.id).then(function() {
		alert('关注成功');
	}, function(err) {
		console.dir(err);
	});
}

function insertStatus(array) {
	var statusHTML = "";
	array.forEach(function(obj) {
		var followHTML = "";
		var userName = "我";
		if (AV.User.current().id != obj._serverData.source.id) {
			userName = "匿名用户";
			followHTML = "<button onclick='follow(event)' id='" + obj._serverData.source.id + "'>关注</button>";
		}
		var imgHTML = "";
		if (obj._serverData.image) {
			imgHTML = "<img src='" + obj._serverData.image + "'>";
		}
		statusHTML += "<div><p>" + userName + "</p><p>" + obj._serverData.message + "</p>" + imgHTML + followHTML + "</div>";

	});
	$("#status").empty();
	$("#status").append(statusHTML);
}

function insertStatusObj(array) {
	var statusHTML = "";
	array.forEach(function(obj) {
		var followHTML = "";
		var userName = "我";
		if (AV.User.current().id != obj.id) {
			console.log(obj.id);
			userName = "匿名用户";
		}
		var imgHTML = "";
		if (obj.data.image) {
			imgHTML = "<img src='" + obj._serverData.image + "'>";
		}
		statusHTML += "<div><p>" + userName + "</p><p>" + obj.data.message + "</p>" + imgHTML + followHTML + "</div>";
	});
	$("#status").empty();
	$("#status").append(statusHTML);
}