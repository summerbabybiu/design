/**
 * Created by wangzhilong on 16/4/7.
 */
$(document).ready(function () {
    AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');
});

function publish() {
    var text = $("#status_to_public").val();
    var status = new AV.Status(null, text);
    if (text != "") {
        AV.Status.sendStatusToFollowers(status).then(function (status) {
            //发布状态成功，返回状态信息
            //			alert("发送成功");
            Materialize.toast("发送成功", 3000, 'rounded');
            location.reload();
        }, function (err) {
            //发布失败
            console.dir(err);
        });
    } else {
        Materialize.toast("内容不能为空", 3000, 'rounded');
    }
}


function queryAllStatus() {
    var query = new AV.Query('_Status');
    query.include("source");
    var statusHTML = "";
    query.find().then(function (resutls) {
        resutls.reverse();
        //console.log(resutls[0]);
        findCare(function(tempArray){
            insertStatus(resutls,tempArray);
        });
    }, function (error) {
        console.log(error);
    });
}

function commentModal(event) {
    getCommentForStatus(event.target.id, function (results, err) {
        var contentHTML = "";
        if (results) {
            results.reverse();
            results.forEach(function (obj) {
                var mainHTML = "<div><p>" + obj.get("commenter") + "<span>" + FormatDate(obj.createdAt) + "</span></p><p>" + obj.get("content") + "</p></div><div class='divider'></div>"
                contentHTML += mainHTML;
            });
        }
        if (!results || results.length == 0) {
            contentHTML += "<p>没有评论</p>";
        }
        var addCommentHTML = "<input type='text' id='addCommentContent'/><button  class= 'btn waves-effect waves-light seeComment' onclick='addNewComment(event)' id='" + event.target.id + "'>添加评论</button>";
        contentHTML += addCommentHTML;
        $("#commentModalContent").empty();
        $("#commentModalContent").append(contentHTML);
        $('#commentModel').openModal();
    });
}

function addNewComment(event) {
    var content = $("#addCommentContent").val();
    var username = AV.User.current().getUsername();
    if (content.length > 0) {
        setCommentForStatus(event.target.id, {"content": content, "username": username}, function (success, err) {
            if (success) {
                $('#commentModel').closeModal();
            } else {
                Materialize.toast('failed', 3000, 'rounded');
            }
        });
    }
    else {
        alert("评论不能为空");
    }
}

function insertStatus(array,followArray) {
    var currentUser = AV.User.current();
    var statusHTML = "";
    var careHTML = "";
    array.forEach(function (obj) {
        var followHTML = "";
        var userName = "我";
        if (AV.User.current().id != obj._serverData.source.id) {
            if (obj._serverData.source.attributes.username) {
                userName = obj._serverData.source.attributes.username;
            }
            if (contains(followArray,obj._serverData.source.id)) {
                careHTML = "<button class='btn waves-effect waves-light follower' id='" + obj.attributes.source.id + "' onclick='unfollow_2(event)' > 取消关注</button>";
            } else {
                careHTML = "<button class='btn waves-effect waves-light follower' id='" + obj.attributes.source.id + "' onclick='follow(event)' > + 关注</button>";
            }
        } else {
            careHTML = "";
        }
        var imgHTML = "";
        if (obj._serverData.image) {
            imgHTML = "<img src='" + obj._serverData.image + "'>";
        }
        var commentHTML = "<button onclick='commentModal(event)' id='" + obj.id + "' class= 'btn waves-effect waves-light seeComment'>查看评论</button>";
        statusHTML += "<div class='divider'></div><div class='cover'><h5 class='username'>" + userName + "<span class='time'>" + FormatDate(obj.createdAt) + " </span>" + careHTML + "</h5><p class='content'>" + obj._serverData.message + "</p>" + imgHTML + "<br/>" + commentHTML + "</div>";
    });
    $("#status").empty();
    $("#status").append(statusHTML);
}
//格式化时间
function FormatDate(strTime) {
    var date = new Date(strTime);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes();
}
//判断数组中知否存在某元素
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}



function friends() {
    findCare(function(tempArray){
        if (followee.length) {

            var iFollowee = new Array();
            var query = new AV.Query('_Status');
            query.include("source");
            var statusHTML = "";
            query.find().then(function (resutls) {
                resutls.reverse();
                resutls.forEach(function(sta){
                    if (contains(tempArray,sta.attributes.source.id)) {
                        var follow;
                        follow = sta;
                        iFollowee.push(follow);
                    }
                });
                console.log(iFollowee);
                insertStatusObj(iFollowee);
            }, function (error) {
                console.log(error);
            });
        } else {
            $('#status').html('');
            var tip = "<p style='text-align: center; padding-top: 200px'>未关注任何人</p>";
            $('#status').append(tip);
        }
    });
}

function insertStatusObj(array) {
    var currentUser = AV.User.current();
    var statusHTML = "";
    array.forEach(function (obj) {
        var userName = currentUser.get('username');
        if (AV.User.current().id != obj.get('source').id) {
            userName = "匿名用户";
            var careHTML = "<button class='btn waves-effect waves-light follower' id='" + obj.attributes.source.id + "' onclick='unfollow_1(event)' >- 取消关注</button>";
            console.log(careHTML);
            //if (obj._serverData.source.attributes.username) {
            //	userName = obj._serverData.source.attributes.username;
            //}
            if (obj.attributes.source.attributes.username) {
                userName = obj.attributes.source.attributes.username;
            }
            console.log(userName);
        } else {
            var careHTML = "";
        }
        var imgHTML = "";
        //if (obj.data.image) {
        //    imgHTML = "<img src='" + obj._serverData.image + "'>";
        //}
        var commentHTML = "<button onclick='commentModal(event)' id='" + obj.id + "' class= 'btn waves-effect waves-light seeComment'>查看评论</button>";
        statusHTML += "<div class='divider'></div><div class='cover'><h5 class='username'>" + userName + "<span class='time'>" + FormatDate(obj.createdAt) + " </span>" + careHTML + "</h5><p class='content'>" + obj.attributes.message + "</p>" + imgHTML + commentHTML + "</div>";
    });

    $("#status").empty();
    $("#status").append(statusHTML);
}

function unfollow_1(event) {
    console.log(event.target.id);
    AV.User.current().unfollow(event.target.id).then(function () {
        //取消关注成功
        console.log('取消关注成功');
        friends();
        Materialize.toast('已取消关注',3000,'rounded');
    }, function (err) {
        //取消关注失败
        console.dir(err);
    });
}
function unfollow_2(event) {
    console.log(event.target.id);
    AV.User.current().unfollow(event.target.id).then(function () {
        //取消关注成功
        console.log('取消关注成功');
        Materialize.toast('已取消关注',3000,'rounded');
        queryAllStatus();
    }, function (err) {
        //取消关注失败
        console.dir(err);
    });
}
function follow(event) {
    AV.User.current().follow(event.target.id).then(function () {
        //关注成功
        console.log('关注成功');
        Materialize.toast('关注成功',3000,'rounded');
        queryAllStatus();
    }, function (err) {
        //关注失败
        console.dir(err);
    });
}

var followee = null;
function findCare( callback) {
    var query = AV.User.current().followeeQuery();
    query.include('followee');
    query.find().then(function(followees){
        //关注的用户列表 followees
        var tempArray = [];
        followees.forEach(function(obj){
            var follow;
            follow= obj.id;
            tempArray.push(follow);
        });
        followee = tempArray;
        callback(tempArray);
        console.log(followee);

    }, function(err){
        var tempArray = [];
        callback(tempArray);
    });
}