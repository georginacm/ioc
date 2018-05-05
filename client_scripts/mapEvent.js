const {ipcRenderer} = require('electron')
var events= "";



//Al accedir a la pantalla de visualització del mapa, estem subscrits a les dades de tots els events, que utilitzarem per omplir el mapa amb la api de GoogleMaps.

ipcRenderer.on('store-data', function(event, eventsDisponibles){
  if(eventsDisponibles!=null){
    events= eventsDisponibles;
    console.info(JSON.stringify(eventsDisponibles));
    let googleApiSrc="https://maps.googleapis.com/maps/api/js?key=AIzaSyC85tUwam0SSFR-ulhqn1d7kjUmd7JytvQ";
    loadScript(googleApiSrc).then(initMap);
  }else{
    console.info("events a visualitzar buits") //event_address
  }
});


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

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: {lat: 41.756, lng: 1.508}
  });
  addMarkers(map);
};

function addMarkers(map){
  for (i = 0; i < events.length; i++) {
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, events[i]);
  }
};


function geocodeAddress(geocoder, resultsMap, currentEvent) {
  var address= currentEvent.event_address;
  var infowindow = new google.maps.InfoWindow();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          var title= currentEvent.event_title ? currentEvent.event_title: currentEvent.event_Title;
          infowindow.setContent(title);
          infowindow.open(map, marker);
        }
      })(marker, i));

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};
