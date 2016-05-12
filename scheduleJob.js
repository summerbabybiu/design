/**
 * Created by wangzhilong on 16/5/11.
 */
var taskUtil = require('./taskUtils');
var mailUtil = require('./mailUtils');


var pushMailForUser = function(user){
  taskUtil.allTaskForUser(user.id,function(err,array){
    if (!err){
      for (var i = 0; i < array.length; i++) {
        if (array[i].complete == false) {
          var message = {
            subject: '有任务尚未完成',
            text: array[i].taskname
          };
          mailUtil.send(message,user.get("email"),function(err,body){});
          break;
        }
      }
    }
  });
};


var startSchedule = function(){
  var schedule = require("node-schedule");
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(1, 6)];
  rule.hour = 1;
  rule.minute = 0;
  schedule.scheduleJob(rule,function(){
    var query = new AV.Query('_User');
    query.find().then(function(users){
      users.forEach(function(user){
        taskUtil.checkTaskStatus(user.id,function(err){
          pushMailForUser(user);
        });
      });
    },function(err){});
  });
};

module.exports = startSchedule;