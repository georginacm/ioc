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
    eventNom.value =eventAEditar.event_title ? eventAEditar.event_title: eventAEditar.event_Title  ;
    datainici.value = eventAEditar.event_startDate;
    datafi.value = eventAEditar.event_finishDate;
    tipusevent.value = eventAEditar.event_type;
    descripcio.innerHTML = eventAEditar.event_description;
    direccioCompleta.value = eventAEditar.event_address;

    document.getElementById('pac-input').value= eventAEditar.event_address;
    document.getElementById('pac-input').innerHTML= eventAEditar.event_address;

    let googleApiSrc="https://maps.googleapis.com/maps/api/js?key=AIzaSyC85tUwam0SSFR-ulhqn1d7kjUmd7JytvQ";
    loadScript(googleApiSrc).then(initMap);

  }else{
    console.info("event a visualitzar buit")
  }
});

//Funció que ens permet carregar asíncronament l'api de Google maps i tenir control del que farem quan estigui carregat
function loadScript(src) {
    return new Promise(function (resolve, reject) {
        var s;
        s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
};

//Tractament de GoogleMps
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: -34.397, lng: 150.644}
  });
  var geocoder = new google.maps.Geocoder();
  geocodeAddress(geocoder, map);
};

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('pac-input').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};
