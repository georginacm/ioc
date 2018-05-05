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

//Al accedir a la pantalla d'Edició, estem subscrits a les dades d'un event, que utilitzarem per omplir els camps. En cas que anem a editar
//Si no rebem dades d'event vol dir que no estem editant cap event, i entrem en mode creació
ipcRenderer.on('store-data', function(event, eventAEditar){
  if(eventAEditar!=null){
    console.info(JSON.stringify(eventAEditar));
    eventNom.value = eventAEditar.event_title ? eventAEditar.event_title: eventAEditar.event_Title;
    datainici.value = eventAEditar.event_startDate;
    datafi.value = eventAEditar.event_finishDate;
    tipusevent.value = eventAEditar.event_type;
    descripcio.value = eventAEditar.event_description;
    direccioCompleta.value = eventAEditar.event_address;
    municipi.value = eventAEditar.event_city;
    eventid.innerHTML= eventAEditar.id;

    document.getElementById('pac-input').value= eventAEditar.event_address;
    document.getElementById('pac-input').innerHTML= eventAEditar.event_address;

    delete_event.style.visibility = "visible";
  }else{
    console.info("event a editar buit")
    clear();
  }

  let googleApiSrc="https://maps.googleapis.com/maps/api/js?key=AIzaSyC85tUwam0SSFR-ulhqn1d7kjUmd7JytvQ&libraries=places";
  loadScript(googleApiSrc).then(initMap);
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

//Comportament del botó de creació ie dició de l'event
eventCreateButton.addEventListener('click', function(){
  var createData= {
    nom : eventNom.value,
    datainici : datainici.value,
    datafi : datafi.value,
    tipus : tipusevent.value,
    descripcio :descripcio.value,
    direccio : direccioCompleta.value,
    municipi : municipi.value,
    id: eventid.innerHTML
  };

  var jsonData = JSON.stringify(createData);
  console.log(jsonData);

  ipcRenderer.once('actionCreateEventReply', function(event, response){
    var resposta=  JSON.parse(response);
    console.log(resposta.missatge);
    alert(resposta.missatge);
    clear();
  })

  ipcRenderer.send('invokeCreateEventAction', createData );
});

//Comportament del botó d'eliminació d'un event
eventDeleteButton.addEventListener('click', function(){
  console.log("event a eliminar: "+ eventid.innerHTML);
  ipcRenderer.once('actionDeleteEventReply', function(event, response){
    console.log(response.missatge);
    alert(response.missatge);
    clear();
  })

  ipcRenderer.send('invokeDeleteEventAction', {id: eventid.innerHTML} );
});

//Google Maps
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.8688, lng: 2.2195},
    zoom: 13
  });

  var geocoder = new google.maps.Geocoder();
  geocodeAddress(geocoder, map);

  var input = /** @type {!HTMLInputElement} */( document.getElementById('pac-input'));

  var types = document.getElementById('type-selector');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
    fillInAddress(place);
  });

};

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  //  country: 'long_name',
  postal_code: 'short_name'
};

function fillInAddress(place) {
  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
};

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

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('pac-input').value;
  if(address!=null && address!=''){
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
}
};
