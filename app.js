/**
 * Created by wangzhilong on 16/5/9.
 */
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/',function(req, res){
  res.sendFile(__dirname + 'public/' + 'index.html');
});

var server = app.listen(3000,function(){
  console.log("server started on port 3000");
});