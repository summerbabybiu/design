/**
 * Created by wangzhilong on 16/5/9.
 */
var AV = require('avoscloud-sdk');

var TaskUtils = {
  allTaskForUser: function(userid,callback) {
    var query = new AV.Query('UserTask');
    query.equalTo('user',userid);
    query.find().then(function(results){
      var array = [];
      results.forEach(function(obj){
        array.push({
          taskname: obj.get("taskname"),
          complete: obj.get("complete"),
          taskid: obj.get("taskid")
        });
      });
      callback(null, array);
    },function(err){
      callback(err, null);
    });
  },
  completeTask: function(userid,taskid,callback) {
    var query = new AV.Query('UserTask');
    query.equalTo('user',userid);
    query.equalTo('task',taskid);
    query.find().then(function(results){
      if(results.length > 0) {
        results[0].complete = true;
        results[0].save().then(function(){
          callback(null);
        },function(err){
          callback(err);
        });
      }
    },function(error){
      callback(error);
    });
  },
};

module.exports = TaskUtils;