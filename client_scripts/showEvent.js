const {ipcRenderer} = require('electron')
let eventNom= document.getElementById('eventNom')
let datainici= document.getElementById('datainici')
let datafi= document.getElementById('datafi')
let tipusevent= document.getElementById('tipusevent')
let descripcio= document.getElementById('descripcio')
let direccioCompleta= document.getElementById('pac-input')


//Al accedir a la pantalla de visualització d'event, estem subscrits a les dades d'un event, que utilitzarem per omplir els camps.

ipcRenderer.on('store-data', function(event, eventAEditar){
  if(eventAEditar!=null){
    console.info(JSON.stringify(eventAEditar));
    eventNom.value =eventAEditar.event_title;
    datainici.value = eventAEditar.event_startDate;
    datafi.value = eventAEditar.event_finishDate;
    tipusevent.value = eventAEditar.event_type;
    descripcio.innerHTML = eventAEditar.event_description;
    direccioCompleta.value = eventAEditar.event_address;

    document.getElementById('pac-input').focus();
    document.getElementById('pac-input').value= eventAEditar.event_address;
    document.getElementById('pac-input').innerHTML= eventAEditar.event_address;
    document.getElementById('pac-input').blur();
  }else{
    console.info("event a visualitzar buit")
  }
});
