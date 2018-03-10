// En el proceso de renderizado (página web).
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
  /*
  console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
  })
  ipcRenderer.send('asynchronous-message', 'ping')

*/



loginButton.addEventListener('click', function(){
    var loginName= document.getElementById('login_username').value;
    var loginPassword= document.getElementById('login_password').value;

    ipcRenderer.once('actionLoginReply', function(event, response){
      role.innerHTML = response.missatge.toString();

      if(response.token){
        username.innerHTML= "Has accedit com a: "+ loginName;
        homeLoginButton.style.visibility="hidden";
        homeSignupButton.style.visibility="hidden";
        homeLogoutButton.style.visibility = "visible";
        userLoggedName.style.visibility = "visible";
        userLoggedName.innerHTML=loginName;

        if(response.user_role== 0 || response.user_role== 1){
          adminToolsMenu.style.display = "block";
        }else{
          adminToolsMenu.style.display = "none";
        }
      }

      console.log(response + " render")
    })

   ipcRenderer.send('invokeLoginAction', {name: loginName, password: loginPassword});
});


signupButton.addEventListener('click', function(){
    var signupEmail= document.getElementById('signup_email').value;
    var signupName= document.getElementById('signup_username').value;
    var signupPassword= document.getElementById('signup_password').value;
    var isAdmin= document.getElementById('signup_admin').checked;

    ipcRenderer.once('actionSignupReply', function(event, response){
      console.log(response.missatge);
      var user=  JSON.parse(response);
      username.innerHTML= "Has accedit com a: "+ signupName ;
      useremail.innerHTML=  "Amb email: "+ signupEmail
      role.innerHTML = user.missatge.toString();
      console.log(response + " render")
    })

   ipcRenderer.send('invokeSignupAction', { email: signupEmail, name: signupName, password: signupPassword, admin: isAdmin});
});
