/**
 * Created by wangzhilong on 16/4/7.
 */
$(document).ready(function(){
    AV.initialize('iuO5g66bCpCVIhnRtQnmn3YA-gzGzoHsz', 'xkRJahD7klcYeHQ3BDVbbwDS');
});

function publish(){
    var status = new AV.Status('http://ww2.sinaimg.cn/large/8696f529jw1f2n5bct1owj20820aqwfc.jpg', '我喜欢了视频xxxx.');
    AV.Status.sendStatusToFollowers(status).then(function(status){
        //发布状态成功，返回状态信息
        console.dir(status);
    }, function(err){
        //发布失败
        console.dir(err);
    });
}

function queryAllStatus(){
    var query = new AV.Query('_Status');
    var statusHTML = "";
    query.find().then(function(resutls){
        resutls.forEach(function(obj){
            statusHTML += "<div><p></p><p>"+obj._serverData.message+"</p><img src='"+obj._serverData.image+"'></div>";
        });
        $("#status").append(statusHTML);
    },function(error){
        console.log(error);
    });
}