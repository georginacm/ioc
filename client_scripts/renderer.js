// JS que es carrega desde el index.html
  const {ipcRenderer} = require('electron')
  let username= document.getElementById('userName_home')
  let useremail = document.getElementById('userEmail_home')
  let role = document.getElementById('userRole_home')
  let loginButton = document.getElementById('loginbutton')
  let homeLoginButton = document.getElementById('home_loginbutton')
  let homeLogoutButton = document.getElementById('home_logoutbutton')
  let homeSignupButton = document.getElementById('home_signupbutton')
  let signupButton = document.getElementById('signupbutton')
  let adminToolsMenu = document.getElementById('adminTools')
  let editEventMenu = document.getElementById('editEvent')
  let userLoggedName = document.getElementById('userLoggedName');
  let tableEvents= document.getElementById('tableevents');
  let tableEventsToEdit= document.getElementById('tableevents_toEdit');
  tableEventsToEdit.style.display = "none";
  tableEvents.style.display = "none";

  function fillTableEventsToEdit(){
    ipcRenderer.on('actionGetByFilterEventToEditReply', function(event, response){
      clearTable(tableEventsToEdit);
      console.log(fillTableEventsToEdit);
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
          cellTitol.innerHTML = response[item].event_title;
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

  function fillTableEvents(){
    ipcRenderer.on('actionGetByFilterEventReply', function(event, response){
      clearTable(tableEvents);
      console.log("fillTableEvents");
      console.log(response);
     for (var item in response) {
       if(!document.getElementById("event_"+response[item].id)){
         var row = tableEvents.insertRow(1);
         row.id="event_"+response[item].id;
         var cellTitol = row.insertCell(0);
         var cellCity = row.insertCell(1);
         var cellStart = row.insertCell(2);
         var cellFinish = row.insertCell(3);
         var cellType= row.insertCell(4);
         cellTitol.innerHTML = response[item].event_title;
         cellCity.innerHTML = response[item].event_city;
         cellStart.innerHTML = response[item].event_startDate;
         cellFinish.innerHTML = response[item].event_finishDate;
         cellType.innerHTML = response[item].event_type;
       }
      }
    })
   ipcRenderer.send('invokeGetEventsAction', {});
  };

adminToolsMenu.addEventListener('click', function(){
/*  tableEvents.style.visibility = "hidden";
  tableEventsToEdit.style.visibility = "visible";*/
  tableEventsToEdit.style.display = "block";
  tableEvents.style.display = "none";
  fillTableEventsToEdit();
});

// al loginButton li assignem un listener que fa que envii una senyal al mètode del main.js (invokeLoginAction)
//i se subscrigui als seus events de actionLoginReply
loginButton.addEventListener('click', function(){
    var loginName= document.getElementById('login_username').value;
    var loginPassword= document.getElementById('login_password').value;
    ipcRenderer.once('actionLoginReply', function(event, response){
    role.innerHTML = response.missatge.toString();

      if(response.token){
        username.innerHTML= "Has accedit com a: "+ loginName;
        homeLoginButton.style.display="none";
        homeLogoutButton.style.visibility = "visible";
        userLoggedName.style.visibility = "visible";
        userLoggedName.innerHTML=loginName;
        /*tableEvents.style.visibility = "visible";
        tableEventsToEdit.style.visibility = "hidden";*/

        tableEventsToEdit.style.display = "none";
        tableEvents.style.display = "block";

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
      role.innerHTML = response.missatge.toString();
      username.innerHTML= "Adéu!! "+ loginName;
      homeLoginButton.style.display="initial";
      userLoggedName.style.visibility = "visible";
      userLoggedName.innerHTML="";
      homeLogoutButton.style.visibility = "hidden";
      useremail.style.visibility = "hidden";
      adminToolsMenu.style.display = "none";
      editEventMenu.style.display = "none";
      tableEvents.style.display = "none";
      tableEventsToEdit.style.display = "none";
      clearTable(tableEvents);
      clearTable(tableEventsToEdit);
    })

   ipcRenderer.send('invokeLogoutAction', {name: loginName});
});


editEvent.addEventListener('click', function(){
      console.log("editEventClick")
   ipcRenderer.send('invokeEditEventAction', "");
});

var clearTable = function(table){
  var tableHeaderRowCount = 1;
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
      table.deleteRow(tableHeaderRowCount);
  }
};
