// JS que es carrega desde el index.html
const {ipcRenderer} = require('electron')
let username, useremail,role,loginButton,homeLoginButton,homeLogoutButton, homeSignupButton;
let signupButton, adminToolsMenu, editEventMenu,showEventsMenu,showMapMenu, userLoggedName,tableEvents,tableEventsToEdit,showEventsContainer, refreshButton;
let filter_name, filter_municipi, filter_inici, filter_fi, filter_tipus;

initObjects();

//comportament del botó de menú que mostra els events
showEventsMenu.addEventListener('click', function(){
  tableEventsToEdit.style.display = "none";
  refreshButton.style.visibility="hidden";
  tableEvents.style.display="";
  showEventsContainer.style.display="";
  filter_name.innerHTML="";
  filter_municipi.innerHTML="";
  filter_inici.innerHTML="";
  filter_fi.innerHTML="";
  filter_tipus.innerHTML="";
  fillTableEvents();
});

//comportament del botó de menú que mostra tots els events a un mapa
showMapMenu.addEventListener('click', function(){
  ipcRenderer.send('invokeShowMapAction', "");
});

//comportament del botó del filtre d'events 
search_button.addEventListener('click', function () {
  ipcRenderer.on('actionGetByFilterEventReply', function(event, response){
  });
  ipcRenderer.send('invokeGetEventsAction', {
     name:filter_name.value ,
     city:filter_municipi.value ,
     from:filter_inici.value ,
     to: filter_fi.value ,
     type:filter_tipus.value
  });

});

//Al botó d'administració li assignem un Listener que ens porta a la pantalla per a poder editar els events
adminToolsMenu.addEventListener('click', function(){
  tableEventsToEdit.style.display = "";
  tableEvents.style.display = "none";
  showEventsContainer.style.display="none";
  refreshButton.style.visibility="visible"
  fillTableEventsToEdit();
});

//Botó que permet actualitzar les dades de la taula que mostra els events
refreshButton.addEventListener('click', function(){
  tableEventsToEdit.style.display = "";
  tableEvents.style.display = "none";
  showEventsContainer.style.display="none";
  fillTableEventsToEdit();
});

// al loginButton li assignem un listener que fa que envii una senyal al mètode del main.js (invokeLoginAction)
//i se subscrigui als seus events de actionLoginReply
loginButton.addEventListener('click', function(){
  var loginName= document.getElementById('login_username').value;
  var loginPassword= document.getElementById('login_password').value;
  ipcRenderer.once('actionLoginReply', function(event, response){

    if(response.token){
      username.style.display="none"; //"Has accedit com a: "+ loginName;
      homeLoginButton.style.display="none";
      homeLogoutButton.style.visibility = "visible";
      userLoggedName.style.visibility = "visible";
      userLoggedName.innerHTML=loginName;

      tableEventsToEdit.style.display = "none";
      refreshButton.style.visibility="hidden";
      tableEvents.style.display = "";
      showEventsContainer.style.display="";
      showMapMenu.style.display="";

      //en cas de tenir rol administrador, es mostrarán unes opcions específiques del rol
      if(response.user_role== 0 || response.user_role== 1){
        adminToolsMenu.style.display = "block";
        editEventMenu.style.display = "block";
        document.getElementById('signup_admin').style.display="block"
        document.getElementById('signup_admin_label').style.display="block"
      }else{
        adminToolsMenu.style.display = "none";
        editEventMenu.style.display = "none";
        document.getElementById('signup_admin').style.display="none"
        document.getElementById('signup_admin_label').style.display="none"
      }
    }
    fillTableEvents();
  })

  ipcRenderer.send('invokeLoginAction', {name: loginName, password: loginPassword});
});

// al signupButton li assignem un listener que fa que envii una senyal al mètode del main.js (invokeSignupAction)
//i se subscrigui als seus events de actionSignupReply
signupButton.addEventListener('click', function(){
  var signupEmail= document.getElementById('signup_email').value;
  var signupName= document.getElementById('signup_username').value;
  var signupPassword= document.getElementById('signup_password').value;
  var isAdmin= document.getElementById('signup_admin').checked;

  ipcRenderer.once('actionSignupReply', function(event, response){
    console.log(response.missatge);
    var user=  JSON.parse(response);
    username.innerHTML= "S'ha registrat l'usuari: "+ signupName ;
    useremail.innerHTML=  "Amb email: "+ signupEmail
    role.innerHTML = user.missatge.toString();
    console.log(response + " render")
  })

  ipcRenderer.send('invokeSignupAction', { email: signupEmail, name: signupName, password: signupPassword, admin: isAdmin});
});

// al logoutButton li assignem un listener que fa que envii una senyal al mètode del main.js (invokeLogoutAction)
//i se subscrigui als seus events de actionLogoutReply
homeLogoutButton.addEventListener('click', function(){
  var loginName= document.getElementById('login_username').value;

  ipcRenderer.once('actionLogoutReply', function(event, response){
    username.style.display="";
    useremail.style.display = "none";
    homeLoginButton.style.display="initial";
    userLoggedName.style.visibility = "visible";
    userLoggedName.innerHTML="";
    homeLogoutButton.style.visibility = "hidden";
    adminToolsMenu.style.display = "none";
    editEventMenu.style.display = "none";
    tableEvents.style.display = "none";
    showEventsContainer.style.display="none";
    showMapMenu.style.display="none";
    tableEventsToEdit.style.display = "none";
    refreshButton.style.visibility="hidden";
    document.getElementById('signup_admin').style.display="none"
    document.getElementById('signup_admin_label').style.display="none"
    clearTable(tableEvents);
    clearTable(tableEventsToEdit);
  })

  ipcRenderer.send('invokeLogoutAction', {name: loginName});
});

//funció per a la taula d'events que permet assignar a cada event un link per a ser editat
editEvent.addEventListener('click', function(){
  console.log("editEventClick")
  ipcRenderer.send('invokeEditEventAction', "");
});


//funció que es crida al inici de la renderització i que cera tots els objetes amb els que es treballaran
function initObjects(){
  username= document.getElementById('userName_home');
  useremail = document.getElementById('userEmail_home');
  role = document.getElementById('userRole_home');
  loginButton = document.getElementById('loginbutton');
  homeLoginButton = document.getElementById('home_loginbutton');
  homeLogoutButton = document.getElementById('home_logoutbutton');
  homeSignupButton = document.getElementById('home_signupbutton');
  signupButton = document.getElementById('signupbutton');
  adminToolsMenu = document.getElementById('adminTools');
  editEventMenu = document.getElementById('editEvent');
  userLoggedName = document.getElementById('userLoggedName');
  tableEvents= document.getElementById('tableevents');
  tableEventsToEdit= document.getElementById('tableevents_toEdit');
  refreshButton = document.getElementById('refresh_button');
  showEventsMenu=document.getElementById('showEvents');
  showMapMenu= document.getElementById('showMap')
  showEventsContainer=document.getElementById('showEventsContainer');
  filter_name=document.getElementById('filter_name');
  filter_municipi=document.getElementById('filter_municipi');
  filter_inici=document.getElementById('filter_inici');
  filter_fi=document.getElementById('filter_fi');
  filter_tipus=document.getElementById('filter_tipus');
  tableEventsToEdit.style.display = "none";
  tableEvents.style.display = "none";
  showEventsContainer.style.display="none";
};
//Funció que omple la taula d'events i permet editar-los
function fillTableEventsToEdit(){
  ipcRenderer.on('actionGetByFilterEventToEditReply', function(event, response){
    clearTable(tableEventsToEdit);
    console.log("fillTableEventsToEdit");
    console.log(response);
    for (var item in response) {
      if(!document.getElementById("eventedit_"+response[item].id)){
        var row = tableEventsToEdit.insertRow(1);
        row.id="eventedit_"+response[item].id;
        var cellTitol = row.insertCell(0);
        var cellCity = row.insertCell(1);
        var cellStart = row.insertCell(2);
        var cellFinish = row.insertCell(3);
        var cellType= row.insertCell(4);
        var cellId= row.insertCell(5);
        cellTitol.innerHTML = (response[item].event_title ? response[item].event_title : response[item].event_Title );
        cellCity.innerHTML = response[item].event_city;
        cellStart.innerHTML = response[item].event_startDate;
        cellFinish.innerHTML = response[item].event_finishDate;
        cellType.innerHTML = response[item].event_type;
        cellId.innerHTML = "<a href='#'><strong>editar<strong></a>";
        cellId.value= response[item].id

        cellId.addEventListener('click', function(){
          ipcRenderer.send('invokeEditEventAction', {id: this.value});
        });
      }
    }
  })

  ipcRenderer.send('invokeGetEventsToEditAction', {});
};
//Funció que omple la taula d'events
function fillTableEvents(){
  ipcRenderer.on('actionGetByFilterEventReply', function(event, response){
    clearTable(tableEvents);
    console.log("fillTableEvents");
    console.log(response);
    for (var item in response) {
      if(!document.getElementById("event_"+response[item].id)){
        var row = tableEvents.insertRow(1);
        row.id= response[item].id;
        var cellTitol = row.insertCell(0);
        var cellCity = row.insertCell(1);
        var cellStart = row.insertCell(2);
        var cellFinish = row.insertCell(3);
        var cellType= row.insertCell(4);
        cellTitol.innerHTML = (response[item].event_title ? response[item].event_title : response[item].event_Title );
        cellCity.innerHTML = response[item].event_city;
        cellStart.innerHTML = response[item].event_startDate;
        cellFinish.innerHTML = response[item].event_finishDate;
        cellType.innerHTML = response[item].event_type;

        row.addEventListener('click', function(){
          ipcRenderer.send('invokeShowEventAction', {id: this.id});
        });
      }
    }
  })
  ipcRenderer.send('invokeGetEventsAction', {});
};

var clearTable = function(table){
  var tableHeaderRowCount = 1;
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount);
  }
};
