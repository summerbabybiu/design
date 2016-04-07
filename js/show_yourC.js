
$(document).ready(function() {
	AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');

	var query = new AV.Query('Record');
	var currentUser = AV.User.current();
	console.log(currentUser.get('username'));
	query.equalTo('user',currentUser.get('username'));
	query.find().then(function(results) {
		console.log('Successfully retrieved ' + results.length + ' posts.');
		// 处理返回的结果数据
		for (var i = 0; i < results.length; i++) {
			var object = results[i];
			if (object.get('chapter') !== undefined) {
				// console.log(object.get('courseKind') + ' - ' + object.get('chapter'));
				sessionStorage.setItem([object.get('courseKind')], [object.get('chapter')]);
			}

		}
	}, function(error) {
		console.log('Error: ' + error.code + ' ' + error.message);
	});
	
});





