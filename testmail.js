/**
 * Created by xx on 16/5/17.
 */
var taskUtil = require('./taskUtils');
var mailUtil = require('./mailUtils');
var AV = require('avoscloud-sdk');
AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');

var pushMailForUser = function(user){
    taskUtil.allTaskForUser(user.id,function(err,array){
        if (!err){
            for (var i = 0; i < array.length; i++) {
                if (array[i].complete == false) {
                    var message = {
                        subject: '有任务尚未完成',
                        text: array[i].taskname
                    };
                    console.log("发邮件给"+user.get("email"));
                    mailUtil.send(message,user.get("email"),function(err,body){});
                    break;
                }
            }
        }
    });
};
var query = new AV.Query('_User');
query.find().then(function(users){
    users.forEach(function(user){
        taskUtil.checkTaskStatus(user.id,function(err){
            pushMailForUser(user);
        });
    });
},function(err){});