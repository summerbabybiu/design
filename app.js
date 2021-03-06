/**
 * Created by wangzhilong on 16/5/9.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var AV = require('avoscloud-sdk');
var taskUtils = require('./taskUtils');
var startSchedule = require('./scheduleJob')();

AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',function(req, res){
  res.sendFile(__dirname + 'public/' + 'index.html');
});

app.post('/sendmail', function(req,res){

});

app.get('/tasks', function(req,res){
  var userid = req.query.userid;
  console.log(userid);
  taskUtils.checkTaskStatus(userid,function(error){
    taskUtils.allTaskForUser(userid,function(err, result){
      if(err) {
        res.send(err);
      }else {
        res.send(result);
      }
    });
  });
});

app.post('/completetask',function(req,res){
  taskUtils.completeTask(req.body.userid,req.body.taskid, function(err){
    if(err) {
      res.send(err);
    }else {
      res.send({message:'success'});
    }
  });
});

app.post('/register', function(req, res){
  var user = new AV.User();
  user.set('username',req.body.username);
  user.set('password',req.body.password);
  user.set('email',req.body.email);
  user.signUp().then(function(user){
    taskUtils.addTaskForUser(user.id);
    res.send({success:true});
  },function(err){
    res.send(err);
  });
});

var server = app.listen(3000,function(){
  console.log("server started on port 3000");
});