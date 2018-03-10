const crypto = require('crypto');
const http = require('http');
let token = null;

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
                var user=  JSON.parse(userDataResult);
                token= user.token;
                console.log("token " +token);
                event.sender.send('actionLoginReply', user)
            });
        });
    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
  },

  signup:  function(event, userData) {
    var rol = (userData.admin) ? 1 : 2;
    var pwd_signup = userData.password;
    pwd_signup= crypto.createHash('md5').update(pwd_signup).digest("hex");

    var url="/eventfest/rest/users/create?token=";
    url += token;

   console.log("signupurl:"+ url);
    var user= {
      user_login:userData.name,
      user_pass: pwd_signup,
      user_email:userData.email,
      user_role:rol,
      user_token: token
    };
    var jsonObject = JSON.stringify(user);
    console.log("signupdata: " + jsonObject);
    var postheaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
    };

    var optionsPost = {
        host : 'localhost',
        port : 8080,
        path : url,
        method : 'POST',
        headers : postheaders
    };

    var reqPost = http.request(optionsPost, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function(response) {
            console.info('POST result:\n');
            process.stdout.write(response);
            console.info('\n\nPOST completed');
            event.sender.send('actionSignupReply', response)
        });
    });

    reqPost.write(jsonObject);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });
  }
}
