const crypto = require('crypto');
const http = require('http');
let token = null;
let eventFestHost= "localhost";
let eventFestPort ="8080";

//Mòdul que fa les crides al servidor relacionades amb el login d'usuari (login, signup i logout)
// i retorna a qui estigui subscrit al actionLoginReply, o actionSignupReply o actionLogoutReply ( els event onClick del render.js) el JSON amb els resultats del servidor

module.exports = {
  login: function(event, userData) {
    var userName=userData.name;
    var pwd = userData.password;
   pwd= crypto.createHash('md5').update(pwd).digest("hex");

    var url= "http://"+eventFestHost+":"+ eventFestPort+"/eventfest/rest/users/connect";
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

    var url="/eventfest/rest/users/create";

   console.log("signupurl:"+ url);
    var user= {
      user_login:userData.name,
      user_pass: pwd_signup,
      user_email:userData.email,
      user_role:rol
    };
    var jsonObject = JSON.stringify(user);
    console.log("signupdata: " + jsonObject);
    var postheaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
    };

    var optionsPost = {
        host : eventFestHost,
        port : eventFestPort,
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
  },

  logout: function(event, userData) {
    var userName=userData.name;

    var url= "http://"+eventFestHost+":"+ eventFestPort+ "/eventfest/rest/users/disconnect";
    url += "?login=" + userName;
    url += "&token=" + token;

    var reqGet = http.request(url, function(res) {
          console.log("statusCode: ", res.statusCode);
            res.on('data', function(userDataResult) {
              console.info(' result:\n');
              process.stdout.write(userDataResult);
                var user=  JSON.parse(userDataResult);
                token= null;
                console.log("token: " +token);
                event.sender.send('actionLogoutReply', user)
            });
        });
    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
  }
}
