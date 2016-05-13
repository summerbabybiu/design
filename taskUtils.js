/**
 * Created by wangzhilong on 16/5/9.
 */
var AV = require('avoscloud-sdk');
var TASK_NAME = ['完成5节HTML课程', '完成全部HTML课程', '完成5节JavaScript课程', '完成全部JavaScript课程'];

var TaskUtils = {
  addTaskForUser: function (userid) {
    var Task = AV.Object.extend("Task");
    var UserTask = AV.Object.extend('UserTask');
    var query = new AV.Query('Task');
    query.find().then(function (results) {
      if (results.length > 0) {
        results.forEach(function (obj) {
          var usertask = new UserTask();
          usertask.set("user", userid);
          usertask.set("taskid", obj.id);
          usertask.set("taskname", obj.get("name"));
          usertask.set("complete", false);
          usertask.save();
        });
      }
    }, function (err) {
    });
  },
  allTaskForUser: function (userid, callback) {
    var query = new AV.Query('UserTask');
    query.equalTo('user', userid+'');
    query.find().then(function (results) {
      var array = [];
      results.forEach(function (obj) {
        array.push({
          taskname: obj.get("taskname"),
          complete: obj.get("complete"),
          taskid: obj.get("taskid")
        });
      });
      callback(null, array);
    }, function (err) {
      callback(err, null);
    });
  },
  checkTaskStatus: function (userid, callback) {
    var verfyFunc = this.verifyTaskStatusForUser;
    var query = new AV.Query('_User');
    query.get(userid).then(function (user) {
      console.log(user);
      var name = user.get("username");
      var query = new AV.Query('Record');
      query.equalTo('user', name);
      query.find().then(function (result) {
        result.forEach(function (obj) {
          verfyFunc(obj, user);
        });
      }, function (err) {
        callback(err);
      });

    }, function (err) {
      callback(err);
    });
  },
  verifyTaskStatusForUser: function (record, user) {
    var completeTaskFunc = TaskUtils.completeTask;
    var kind = record.get("courseKind");
    var chapter = parseInt(record.get("chapter"));
    var complete = record.get("finish");
    var needUpdate = false;
    var query = new AV.Query("UserTask");
    var taskname = null;
    if (kind == "HTML") {
      if (chapter >= 5) {
        taskname = TASK_NAME[0];
        completeTaskFunc(user.id, taskname, function (err) {
        });
      }
      if (complete) {
        taskname = TASK_NAME[1];
        completeTaskFunc(user.id, taskname, function (err) {
        });
      }
    }
    if (kind == "JS") {
      if (chapter >= 5) {
        taskname = TASK_NAME[2];
        completeTaskFunc(user.id, taskname, function (err) {
        });
      }
      if (complete) {
        taskname = TASK_NAME[3];
        completeTaskFunc(user.id, taskname, function (err) {
        });
      }
    }
  },
  completeTask: function (userid, taskid, callback) {
    var query = new AV.Query('UserTask');
    query.equalTo('user', userid);
    query.equalTo('taskname', taskid);
    query.find().then(function (results) {
      if (results.length > 0) {
        results[0].set('complete', true);
        results[0].save().then(function () {
          callback(null);
        }, function (err) {
          console.log(err);
          callback(err);
        });
      }
    }, function (error) {
      callback(error);
    });
  },
};

module.exports = TaskUtils;