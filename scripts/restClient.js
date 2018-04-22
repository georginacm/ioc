const crypto = require('crypto');
const http = require('http');
let token = null;
let user_id=null;
let eventFestHost= "192.168.1.42";
let eventFestPort ="8080";
let events=[];

//Mòdul que fa les crides al servidor
// i retorna a qui estigui subscrit als events de resposta com actionLoginReply, o actionSignupReply o actionLogoutReply, actionCreateEventReply, etc.
// ( els event onClick del render.js i de edit.js) el JSON amb els resultats del servidor

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
        console.log("afeterlogin: "+ userDataResult);
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
  },

  create:  function(event, eventData) {

    var url="/eventfest/rest/events/create";
    url += "?token=" + token;
    console.log("createurl:"+ url);

    var createData= {
      event_title : eventData.nom,
      event_startDate : eventData.datainici,
      event_finishDate : eventData.datafi,
      event_type : eventData.tipus,
      event_description : eventData.descripcio,
      event_address : eventData.direccio,
      users_id: 1,
      event_city : eventData.municipi
    };

    var jsonObject = JSON.stringify(createData);
    console.log("createdata: " + jsonObject);
    var postheaders = {
      'Content-Type' : 'application/json; charset=utf-8',
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
        event.sender.send('actionCreateEventReply', response)
      });
    });

    reqPost.write(jsonObject);
    reqPost.end();
    reqPost.on('error', function(e) {
      console.error(e);
    });

  },

  update: function(event, eventData){
    var eventId=eventData.id;
    var url="/eventfest/rest/events/update";
    url += "?token=" + token;
    url += "&id=" + eventId;
    console.log("updateurl:"+ url);

    var createData= {
      event_title : eventData.nom,
      event_startDate : eventData.datainici,
      event_finishDate : eventData.datafi,
      event_type : eventData.tipus,
      event_description : eventData.descripcio,
      event_address : eventData.direccio,
      users_id: 1,
      event_city : eventData.municipi
    };

    var jsonObject = JSON.stringify(createData);
    console.log("createdata: " + jsonObject);
    var postheaders = {
      'Content-Type' : 'application/json; charset=utf-8',
      'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
    };

    var optionsPut = {
      host : eventFestHost,
      port : eventFestPort,
      path : url,
      method : 'PUT',
      headers : postheaders
    };

    var reqPut = http.request(optionsPut, function(res) {
      console.log("statusCode: ", res.statusCode);
      res.on('data', function(response) {
        process.stdout.write(response); // escriu a la consola
        var eventResposta= JSON.parse(response);
        var resposta="";
        process.stdout.write("id:"+ eventResposta.id);
        if(eventResposta.id!=undefined){
          resposta=JSON.stringify({missatge: "Event modificat correctament"});
        }else{
          resposta=response;
        }
        event.sender.send('actionCreateEventReply', resposta);
      });
    });

    reqPut.write(jsonObject);
    reqPut.end();
    reqPut.on('error', function(e) {
      event.sender.send('actionCreateEventReply', JSON.stringify({missatge: "Error modificant l'event"}));
      console.error(e);
    });
  },

  delete: function(event, eventData){
    var eventId=eventData.id;

    var url= "http://"+eventFestHost+":"+ eventFestPort+"/eventfest/rest/events/delete";
    url += "?token=" + token;
    url += "&id=" + eventId;
    console.log("deleteurl:"+ url);

    var optionsPost = {
      host : eventFestHost,
      port : eventFestPort,
      path : url,
      method : 'DELETE'
    };

    var reqGet = http.request(optionsPost, function(res) {
      console.log("statusCode: ", res.statusCode);
      res.on('data', function(eventDataResult) {
        var eventResult=  JSON.parse(eventDataResult);
        event.sender.send('actionDeleteEventReply', eventResult);
      });
    });
    reqGet.end();
    reqGet.on('error', function(e) {
      console.error(e);
    });
  },

  getByFilter: function(event, eventFilterData, allowEdit){
    var nom= "qualsevol nom";
    var municipi="qualsevol municipi";
    var tipus="";
    var datafrom="qualsevol data";
    var dataTo="";

    if(eventFilterData.name!=null){ nom=eventFilterData.name }
    if(eventFilterData.city!=null){ municipi=eventFilterData.name }
    if(eventFilterData.type!=null){ tipus= eventFilterData.type }
    if(eventFilterData.from!=null){ datafrom= eventFilterData.from }
    if(eventFilterData.to!=null){ dataTo= eventFilterData.to }

    var url= "http://"+eventFestHost+":"+ eventFestPort+"/eventfest/rest/events/getByFilter";
    url += "?token=" + token;
    url += "&nom="+ nom +"&data="+ +"qualsevol data""&municipi=";


    var reqGet = http.request(url, function(res) {
      console.log("statusCode: ", res.statusCode);
      res.on('data', function(eventDataResult) {
        events=[];
        console.log("getByFilter response:"+ eventDataResult);
        var eventResult=  JSON.parse(eventDataResult);
        events=eventResult;
        if(allowEdit==true){
          event.sender.send('actionGetByFilterEventToEditReply', eventResult);
        }else{
          event.sender.send('actionGetByFilterEventReply', eventResult);
        }
      });
    });
    reqGet.end();
    reqGet.on('error', function(e) {
      console.error(e);
    });

  },

  getEventbyId: function(event, id){
    let result= null;
    if(events!=null){
      var resultat =  events.filter(function(item) {
        return item.id == id;
      });
      result= resultat[0];
    }
    return result;
  }
}
