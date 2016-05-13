$(document).ready(function() {
	AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');
	var currentUser = AV.User.current();
	if (currentUser) {
		$('.sayHello').text('Hi ~ , ' + currentUser.get('username'));
		console.log(currentUser.get('username'));
	} else {
		$('.sayHello').text("未登录");
	}
	$('.show_yourCourse #nav-couser .nav li a').bind('click',function(){
		$('ul li a:not(this)').removeClass('clickClass'); 
		$(this).addClass('clickClass'); 
	})
});
//已学完
function get_finished() {	
	$('.all_course ul').children('li').remove();
	$('.all_course ul').text('');
	var kind = sessionStorage.getItem('kind');
	var currentUser = AV.User.current();
	if (currentUser) {
		var query = new AV.Query('Record');
		query.equalTo('user', currentUser.get('username'));
		query.find().then(function(results) {
			console.log('Successfully retrieved ' + results.length + ' posts.');
			// 处理返回的结果数据
//			if (results.length > 0) {
				for (var i = 0; i < results.length; i++) {
					var object = results[i];
					if (object.get('chapter') != "") {
						if (object.get('finish') == true) {
							console.log('已完成：' + object.get('courseKind') + ' - ' + object.get('chapter'));
							var htmlString = "<li><div class='card'><h5 class='course_name'>" + object.get('courseKind') + "</h5><p>最后一章了</p><div class='course_action'><a href='#' data-course = "+object.get('courseKind') +" onclick = 'get_study(event)'>重新学习</a></div></div></li>";
							console.log(htmlString);
							$('.all_course ul').append(htmlString);

						} 
					}
				}
//			}
			//console.log($('.all_course ul').children().length);
			if ($('.all_course ul').children().length == 0) {
				$('.all_course ul').text('暂无课程');
			}

		}, function(error) {
			console.log('Error: ' + error.code + ' ' + error.message);
		});
	} else {
		alert('请先登录');
	}
}
//正在学习
function get_continue() {
	$('.all_course ul').children('li').remove();
	$('.all_course ul').text('');
	var kind = sessionStorage.getItem('kind');
	var chapterNu = sessionStorage.getItem(kind);
	var currentUser = AV.User.current();
	if (currentUser) {
		var query = new AV.Query('Record');
		query.equalTo('user', currentUser.get('username'));
		query.find().then(function(results) {
			console.log('Successfully retrieved ' + results.length + ' posts.');
			// 处理返回的结果数据
			if (results.length > 0) {
				for (var i = 0; i < results.length; i++) {
					var object = results[i];
					if (object.get('chapter') != null ) {
						if (object.get('finish') == false) {
							console.log('未完成：' + object.get('courseKind') + ' - ' + object.get('chapter'));
							var htmlString = "<li><div class='card'><h5 class='course_name'>" + object.get('courseKind') + "</h5><p>已至第"+object.get('chapter')+"章</p><div class='course_action'><a href='#' data-course = "+object.get('courseKind') +" onclick='get_study(event)'>继续学习</a></div></div></li>";
							console.log(htmlString);
							$('.all_course ul').append(htmlString);
						}
					}
				}
			}
			if ($('.all_course ul').children().length == 0) {
				$('.all_course ul').text('暂无课程');
			}
		}, function(error) {
			console.log('Error: ' + error.code + ' ' + error.message);
		});
	} else {
		alert('请先登录');
	}

}
//继续学习、重新学习
function get_study(event) {
	var currentUser = AV.User.current();
	$('.show_yourCourse').addClass('hide');
	$('show_detail').removeClass('hide');
	console.log($(event.target).data('course'));
	sessionStorage.kind = $(event.target).data('course');
	var query = new AV.Query('Record');
		query.equalTo('user', currentUser.get('username'));
		query.equalTo('courseKind', sessionStorage.kind);
		query.find().then(function(results) {
			console.log(results.length);
			if (results.length == 0) {
				setRecord();
			} else {
				sessionStorage.recordID = results[0].id;
			}
		}, function(error) {
			console.log('Error: ' + error.code + ' ' + error.message);
		});
	loadCourse();	
}
//学习任务
function get_task() {
	$('.all_course ul').children('li').remove();
	$('.all_course ul').text('');
	var currentUser = AV.User.current();
	var HTMLString = " <ul class='collection'>";
	$.ajax({
             type: "GET",
             url: "/tasks?userid="+currentUser.id,
             success: function(data){
                        console.log(data);
                        data.forEach(function(t){
                        		if (t.complete) {
                        			HTMLString += "<li class='collection-item'>"+t.taskname+"<i class='mdi-action-done small green-text tooltipped' data-position='left' data-delay='50' data-tooltip='已完成'></i></li>";
                        		} else {
                        			HTMLString += "<li class='collection-item'>"+t.taskname+"<i class='mdi-action-schedule small red-text tooltipped' data-position='left' data-delay='50' data-tooltip='未完成'></i></li>";
                        		}
                        });
                        HTMLString += ' </ul>';
                        	$('.all_course ul').append(HTMLString);
                        	$('.tooltipped').tooltip({delay: 50});
                      }
         }); 
}
