var MARKER_CLUSTERER_MAX_ZOOM = 15;

function createMapOfBoston() {
    var mapElement = document.getElementById('map');
    var mapOptions = {
        center: {lat: 42.3530715, lng: -71.0736387},
        zoom: 13,
        minZoom: 13,
        maxZoom: 16,
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

    return map;
}

function createInfoWindow(map) {

    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });

    return infoWindow;
}

function createMarkerSpiderfier(map) {

    var markerSpiderfierOptions = { 
        keepSpiderfied: true
    };
    var markerSpiderfier = new OverlappingMarkerSpiderfier(map, markerSpiderfierOptions);

    markerSpiderfier.addListener('format', function(marker, status) {
        var imageUrl;
        switch (status) {
            case OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED:
            case OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE:
                imageUrl = '/img/truck.png';
                break;
            case OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE:
                imageUrl = '/img/truck-expand.png';
                break;
            default:
                imageUrl = null;
        }
        if (imageUrl) {
            marker.setIcon({ url: imageUrl });
        }
    });

    return markerSpiderfier;
}

function initMap() {
    var map = createMapOfBoston();
    var infoWindow = createInfoWindow(map);
    var markerSpiderfier = createMarkerSpiderfier(map);
    fetchTrucks(map, infoWindow, markerSpiderfier);
}

function fetchTrucks(map, infoWindow, markerSpiderfier) {
    $.ajax({
        url: '/api/trucks',
        type: 'GET',
        dataType: 'JSON',
        success: function(trucks){
            var markers = addMapMarkers(map, infoWindow, markerSpiderfier, trucks);
            var markerClusterer = addMarkerClusterer(map, markers);
        }
    });
}

function addMarkerClusterer(map, markers) {
    return new MarkerClusterer(map, markers, {
        imagePath: '/img/marker-cluster',
        maxZoom: MARKER_CLUSTERER_MAX_ZOOM
    });
}

 var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">__NAME__</h1>'+
      '<div id="bodyContent">'+
      '<p><b>__NAME__</b> is a... </p>' +
      'Open from __HOURS__' +
      '<p>More information: <a href="__WEBSITE__">'+
      '__WEBSITE_TEXT__</a></p>'+
      '</div>'+
      '</div>';

function addMapMarkers(map, infoWindow, markerSpiderfier, trucks) {

    var markers = trucks.map(function(truck) {
        return addMapMarker(map, infoWindow, markerSpiderfier, truck);
    });

    return markers;
}

function addMapMarker(map, infoWindow, markerSpiderfier, truck) {
    var marker = new google.maps.Marker({
        position: {lat: truck.lat, lng: truck.lng},
        map: map,
        title: truck.title,
        icon: 'img/truck.png'
    });

    markerSpiderfier.addMarker(marker);

    var windowContent = contentString.replace(/__NAME__/g, truck.title);
    windowContent = windowContent.replace(/__HOURS__/g, truck.availability);
    if (truck.website) {
        windowContent = windowContent.replace(/__WEBSITE__/g, truck.website);
        windowContent = windowContent.replace(/__WEBSITE_TEXT__/g, truck.title + " website");
    }
    else {
        windowContent = windowContent.replace(/__WEBSITE__/g, "");
        windowContent = windowContent.replace(/__WEBSITE_TEXT__/g, "No website found");
    }

    marker.addListener('click', function () {
        infoWindow.setContent(windowContent);
        infoWindow.open(map, marker);
    });

    return marker;
}

// Export in Node.js environment, for testing.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    exports.createMapOfBoston = createMapOfBoston;
}
