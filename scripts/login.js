const crypto = require('crypto');
const http = require('http');

module.exports = {
  login: function(event, userData) {
    var userName=userData.name;
    var pwd = userData.password;
    pwd= crypto.createHash('md5').update(pwd).digest("hex");

    var url="http://localhost:8080/eventfest/rest/users/connect";
    url += "?login=" + userName;
    url += "&pass=" + pwd;

    var reqGet = http.request(url, function(res) {
          console.log("statusCode: ", res.statusCode);
            res.on('data', function(userDataResult) {
                //console.info('GET result:\n');
                //process.stdout.write(userDataResult);
                event.sender.send('actionLoginReply', userDataResult)
            });
        });
    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
  },

  signup: function(){}
}
