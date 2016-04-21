
var Comment = AV.Object.extend('Comment');

function setCommentForStatus(statusId,commentContent,callback) {
	var commentObj = new Comment();
	commentObj.set('status',statusId);
	commentObj.set('content',commentContent);
	commentObj.save().then(function(){
		callback('success',null);
	},function(err){
		callback(null,err);
	});
}

function getCommentForStatus(statusId,callback) {
	var query = new AV.Query('Comment');
	query.equalTo('status',statusId);
	query.find().then(function(data){
		callback(data, null);
	},function(err){
		callback(null, err);
	});
}
