const {ipcRenderer} = require('electron')
let eventNom= document.getElementById('eventNom')
let datainici= document.getElementById('datainici')
let datafi= document.getElementById('datafi')
let tipusevent= document.getElementById('tipusevent')
let descripcio= document.getElementById('descripcio')
let direccioCompleta= document.getElementById('pac-input')
let municipi= document.getElementById('locality')
let eventid = document.getElementById('event_id')
let eventCreateButton = document.getElementById('save_event')
let eventDeleteButton = document.getElementById('delete_event')
let createResult = document.getElementById('create_result')


ipcRenderer.on('store-data', function(event, eventAEditar){
  if(eventAEditar!=null){
    console.info(JSON.stringify(eventAEditar));
    eventNom.value =eventAEditar.event_title;
    datainici.value = eventAEditar.event_startDate;
    datafi.value = eventAEditar.event_finishDate;
    tipusevent.value = eventAEditar.event_type;
    descripcio.value = eventAEditar.event_description;
    direccioCompleta.value = eventAEditar.event_address;
    municipi.value = eventAEditar.event_city;
    eventid.innerHTML= eventAEditar.id;

    document.getElementById('pac-input').focus();
    document.getElementById('pac-input').value= eventAEditar.event_address;
    document.getElementById('pac-input').innerHTML= eventAEditar.event_address;
    document.getElementById('pac-input').blur();

    delete_event.style.visibility = "visible";
  }else{
    console.info("event a editar buit")
    clear();
  }
});

function clear(){
  console.log("clear");
    eventNom.value ="";
    datainici.value = "";
    datafi.value = "";
    tipusevent.value = "";
    descripcio.value = "";
    direccioCompleta.value = "";
    municipi.value = "";
    eventid.innerHTML= "";
    delete_event.style.visibility = "hidden";
  };


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
      clear();
      alert(response.missatge.toString());
      console.log(response + " render")
    })

   ipcRenderer.send('invokeCreateEventAction', createData );
});

eventDeleteButton.addEventListener('click', function(){
    ipcRenderer.once('actionDeleteEventReply', function(event, response){
      console.log(response.missatge);
      createResult.innerHTML = response.missatge.toString();
    })

   ipcRenderer.send('invokeDeleteEventAction', {id: eventid.innerText} );
});
