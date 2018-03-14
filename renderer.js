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
  let userLoggedName = document.getElementById('userLoggedName');

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

        //en cas de tenir rol administrador, es mostrarán unes opcions específiques del rol
        if(response.user_role== 0 || response.user_role== 1){
          adminToolsMenu.style.display = "block";
          document.getElementById('signup_admin').style.display="block"
          document.getElementById('signup_admin_label').style.display="block"
        }else{
          adminToolsMenu.style.display = "none";
          document.getElementById('signup_admin').style.display="none"
          document.getElementById('signup_admin_label').style.display="none"
        }
      }

      console.log(response + " render")
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
    //  adminToolsMenu.style.visibility = "hidden";
      adminToolsMenu.style.display = "none";

      console.log(response + " render")
    })

   ipcRenderer.send('invokeLogoutAction', {name: loginName});
});
