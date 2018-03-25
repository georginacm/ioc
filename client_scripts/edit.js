const {ipcRenderer} = require('electron')
let eventNom= document.getElementById('eventNom')
let datainici= document.getElementById('datainici')
let datafi= document.getElementById('datafi')
let tipusevent= document.getElementById('tipusevent')
let descripcio= document.getElementById('descripcio')
let direccioCompleta= document.getElementById('pac-input')
let municipi= document.getElementById('locality')
let eventCreateButton = document.getElementById('save_event')
let eventDeleteButton = document.getElementById('delete_event')
let createResult = document.getElementById('create_result')


eventCreateButton.addEventListener('click', function(){
    var createData= {
       nom : eventNom.value,
       datainici : datainici.value,
       datafi : datafi.value,
       tipus : tipusevent.value,
       descripcio :descripcio.value,
       direccio : direccioCompleta.value,
       municipi : municipi.value
     };

    var jsonData = JSON.stringify(createData);
    console.log(jsonData);

    ipcRenderer.once('actionCreateEventReply', function(event, response){
      console.log(response.missatge);
      //var resposta=  JSON.parse(response);
      createResult.innerHTML = response.missatge.toString();
      console.log(response + " render")
    })

   ipcRenderer.send('invokeCreateEventAction', createData );
});
