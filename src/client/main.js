//var MARKER_CLUSTERER_MAX_ZOOM = 15;

function initMap() {
    var map = createMapOfBoston();
    var infoWindow = createInfoWindow(map);
    var markerSpiderfier = createMarkerSpiderfier(map);
    fetchTrucks(map, infoWindow, markerSpiderfier);
}

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
        keepSpiderfied: true,
        markersWontMove: true
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

function fetchTrucks(map, infoWindow, markerSpiderfier) {
    $.ajax({
        url: '/api/trucks',
        type: 'GET',
        dataType: 'JSON',
        success: function(trucks){
            var markers = addMapMarkers(map, infoWindow, markerSpiderfier, trucks);
            //var markerClusterer = addMarkerClusterer(map, markers);
            attachUiEvents(map, markers/*, markerClusterer*/);
        }
    });
}

function addMapMarkers(map, infoWindow, markerSpiderfier, trucks) {

    var markers = trucks.map(function(truck) {
        return addMapMarker(map, infoWindow, markerSpiderfier, truck);
    });

    return markers;
}

function createInfoWindowContent(truck) {
    return '' +
        '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1>' + truck.title + '</h1>' +
            '<div id="bodyContent">' +
                '<p><strong>' + truck.title + '</strong> is a... </p>' +
                '<p>Open from ' + truck.availability + '</p>' +
                '<p>More information: <a href="#">No website found</a></p>' +
            '</div>'+
        '</div>';
}

function addMapMarker(map, infoWindow, markerSpiderfier, truck) {

    var marker = new google.maps.Marker({
        position: {lat: truck.lat, lng: truck.lng},
        map: map,
        title: truck.title,
        icon: 'img/truck.png',
        truck: truck
    });

    markerSpiderfier.addMarker(marker);

    var infoWindowContent = createInfoWindowContent(truck);
    marker.addListener('click', function () {
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, marker);
    });

    return marker;
}

function addMarkerClusterer(map, markers) {
    return new MarkerClusterer(map, markers, {
        imagePath: '/img/marker-cluster',
        maxZoom: MARKER_CLUSTERER_MAX_ZOOM,
        ignoreHidden: true
    });
}

function attachUiEvents(map, allMarkers/*, markerClusterer*/) {

    $('#showCurrentlyAvailableCheckbox').click(function() {
        var isChecked = $(this).is(':checked');
        if (isChecked) {
            showCurrentlyAvailableMarkers(map, allMarkers);
        }
        else {
            showAllMarkers(map, allMarkers);
        }
    });
}

function showCurrentlyAvailableMarkers(map, allMarkers) {
    for (var marker of allMarkers) {
        var isAvailable = dateWithinAvailability(marker.truck.availability, new Date());
        marker.setVisible(isAvailable);
    }
}

function showAllMarkers(map, allMarkers) {
    for (var marker of allMarkers) {
        marker.setVisible(true);
    }
}

// Export in Node.js environment, for testing.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    exports.createMapOfBoston = createMapOfBoston;
}
