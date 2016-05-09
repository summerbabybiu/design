/**
 * Created by wangzhilong on 16/5/9.
 */
var api_key = "key-75f9cf9639283b1080e762c9d9bd87db";
var domain = "noreply.stephenw.cc";
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var mailUtils = {
  send: function(message,receiver,callback){
    var data = {
      from: "noreply@stephenw.cc",
      to: receiver,
      subject: message.subject,
      text: message.text
    };
    mailgun.messages().send(data, function(err, body){
      callback(err, body);
    });
  }
};

module.exports = mailUtils;