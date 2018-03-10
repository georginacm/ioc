// En el proceso de renderizado (página web).
  const {ipcRenderer} = require('electron')
  let username= document.getElementById('userName_home')
  let role = document.getElementById('userRole_home')
  let loginButton = document.getElementById('loginbutton')
  let adminToolsMenu = document.getElementById('adminTools')
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
      var user=  JSON.parse(response);
      username.innerHTML= "Has accedit com a: "+ loginName;
      role.innerHTML = user.missatge.toString()
      if(user.user_role== 0 || user.user_role== 1){
        adminToolsMenu.style.display = "block";
      }else{
        adminToolsMenu.style.display = "none";
      }
      console.log(response + " render")
      //processResponse(response);
    })

   ipcRenderer.send('invokeLoginAction', {name: loginName, password: loginPassword});
});
