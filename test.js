/**
 * Created by wangzhilong on 16/5/9.
 */
//var mailUtils = require('./mailUtils');
var AV = require('avoscloud-sdk');

AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');
//
//mailUtils.send({
//  subject:"hello",
//  text:"this is test mail"
//},"991405736@qq.com",function(err, body){
//  console.log(body);
//});
var UserTask = AV.Object.extend('UserTask');

//var Task = AV.Object.extend("Task");
var query = new AV.Query('Task');
query.find().then(function(results){
  if(results.length > 0) {
    results.forEach(function(obj){
      var usertask = new UserTask();
      usertask.set("user","5705111479bc44004c42436c596804755");
      usertask.set("taskid",obj.id);
      usertask.set("taskname",obj.get("name"));
      usertask.set("complete",false);
      usertask.save().then(function(){},function(err){
        console.log(err);
      });
    });
  }
},function(err){
  console.log(err);
});