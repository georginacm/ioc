// En el proceso de renderizado (página web).
  const {ipcRenderer} = require('electron')
  let username= document.getElementById('userName_home')
  /*
  console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
  })
  ipcRenderer.send('asynchronous-message', 'ping')

*/

let loginButton = document.getElementById('loginbutton')

loginButton.addEventListener('click', function(){
    ipcRenderer.once('actionReply', function(event, response){
      username.innerHTML = response.toString()
      console.log(response + " render")
      //processResponse(response);
    })
   ipcRenderer.send('invokeAction', 'Georgina');

});
