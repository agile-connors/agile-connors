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
    return new google.maps.Map(mapElement, mapOptions);
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
            console.log(JSON.stringify(trucks));
            var combinedTrucks = combineTrucks(trucks);
            var markers = addMapMarkers(map, infoWindow, markerSpiderfier, combinedTrucks);
            //var markerClusterer = addMarkerClusterer(map, markers);
            attachUiEvents(markers);
        }
    });
}



function addMapMarkers(map, infoWindow, markerSpiderfier, trucks) {
    return trucks.map(function(truck) {
        return addMapMarker(map, infoWindow, markerSpiderfier, truck);
    });
}

function getTruckAvailability(truck){
    var availability = "";
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (day of days){
        if (truck.days.hasOwnProperty(day)) {
            availability += day + ": " + truck.days[day] + "<br>"
        }
    }
    return availability;
}

function createInfoWindowContent(truck) {
    var website = (truck.website) ? '<a href="' + truck.website + '">Click here</a>' : 'No website found';
    var notes = truck.notes !== undefined && truck.notes.trim().length > 0 ? '<p>' + truck.notes + '</p>' : "";
    return '' +
        '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1>' + truck.title + '</h1>' +
            '<div id="bodyContent">' +
               '<p><strong>Located at ' + truck.location + '</strong></p>' +
                notes +
               '<p>Hours<br>' + getTruckAvailability(truck) + '</p>' +
               '<p>More information: ' + website + '</p>' +
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

function attachUiEvents(allMarkers/*, markerClusterer*/) {

    $('#showPeriodOfDay').change(function() {
        var chosen = $( "#showPeriodOfDay").val();
        console.log("Time filter changed to: " + chosen);
        for (var marker of allMarkers) {
            if (chosen === "anytime") {
                marker.setVisible(true);
            } else if (chosen === "currentlyAvailable"){
                var isAvailable = dateWithinAvailability(marker.truck.availability, new Date());
                marker.setVisible(isAvailable);
            } else if (chosen === "morning"){
                marker.setVisible(isOpenInMorning(marker.truck.availability));
            } else if (chosen === "afternoon"){
                marker.setVisible(isOpenInAfternoon(marker.truck.availability));
            } else if (chosen === "evening"){
                marker.setVisible(isOpenInEvening(marker.truck.availability));
            }

        }

    });
}

function showNearbyMarkers(allMarkers, location, maxDistance) {
    for (var marker of allMarkers) {
        var isNearby = locationIsNearby(marker.truck.latitude, marker.truck.longitude, location, maxDistance);
        marker.setVisible(isNearby);
    }
}




function isNodeJsEnvironment() {
    return typeof module !== 'undefined' &&
           typeof module.exports !== 'undefined';
}
function exportNodeJsFunctionsForTestingMain() {
    exports.isNodeJsEnvironment = isNodeJsEnvironment;
    exports.createMapOfBoston = createMapOfBoston;
}

if (isNodeJsEnvironment()) {
    exportNodeJsFunctionsForTestingMain();
}
