var exports = exports || {};

exports.createMapOfBoston = function createMapOfBoston() {
    var mapElement = document.getElementById('map');
    var mapOptions = {
        center: {lat: 42.3530715, lng: -71.0736387},
        zoom: 13,
        minZoom: 13,
        disableDefaultUI: true,
        clickableIcons: false,
        styles: [{
            "featureType": "all",
            "elementType": "all",
            "stylers": [{"hue": "#ff0000"}, {"saturation": -100},
                {"lightness": -30}]
        }, {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#ffffff"}]
        }, {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#353535"}]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{"color": "#656565"}]
        }, {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#505050"}]
        }, {
            "featureType": "poi",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#808080"}]
        }, {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"color": "#454545"}]
        }, {
            "featureType": "transit",
            "elementType": "labels",
            "stylers": [{"hue": "#007bff"}, {"saturation": 100},
                {"lightness": -40}, {"invert_lightness": true}, {"gamma": 1.5}]
        }, {
            "featureType": "transit.station.bus",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#08498f"}]
        }]
    };
    var map = new google.maps.Map(mapElement, mapOptions);

    google.maps.event.addListener(map, "click", function (event) {
        console.log(map.getCenter().lat(), map.getCenter().lng());
    });
    return map;
}

function initMap() {
    var map = exports.createMapOfBoston();
    fetchTrucks(map);
}

function fetchTrucks(map) {
    $.ajax({
        url: '/api/trucks',
        type: 'GET',
        dataType: 'JSON',
        success: function(data){
            addMapMarkers(map, data)
        }
    });
}

 var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">__NAME__</h1>'+
      '<div id="bodyContent">'+
      '<p><b>__NAME__</b> is a... </p>'+
      '<p>More information, <a href="https://www.google.com">'+
      'click here</a></p>'+
      '</div>'+
      '</div>';

function addMapMarkers(map, data) {
    data.forEach(function(truck) {
        addMapMarker(map, truck);
    });
}

function addMapMarker(map, truck) {
    var marker = new google.maps.Marker({
        position: {lat: truck.lat, lng: truck.lng},
        map: map,
        title: truck.title,
        icon: 'img/truck.png'
    });

    var windowContent = contentString.replace(/__NAME__/g, truck.title);
    var infowindow = new google.maps.InfoWindow({
        content: windowContent
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    return marker;
}
