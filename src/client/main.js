//var MARKER_CLUSTERER_MAX_ZOOM = 15;

var truckMarkerImage;
var truckClosingMarkerImage;
var truckUnavailableMarkerImage;
var truckExpandMarkerImage;

function initMap() {
    truckMarkerImage = {
        url: '/img/truck.png',
        size: new google.maps.Size(36, 26),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(18, 26)
    };
    truckClosingMarkerImage = {
        url: '/img/truck-closing.png',
        size: new google.maps.Size(36, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(18, 30)
    };
    truckUnavailableMarkerImage = {
        url: '/img/truck-unavailable.png',
        size: new google.maps.Size(36, 26),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(18, 26)
    };
    truckExpandMarkerImage = {
        url: '/img/truck-expand.png',
        size: new google.maps.Size(47, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(23, 15)
    };
    var map = createMapOfBoston();
    var infoWindow = createInfoWindow(map);
    var markerSpiderfier = createMarkerSpiderfier(map);
    fetchTrucks(map, infoWindow, markerSpiderfier);
}

function createMapOfBoston() {
    var mapElement = document.getElementById('map');
    var mapOptions = {
        center: {
            lat: 42.3530715,
            lng: -71.0736387
        },
        zoom: 13,
        minZoom: 13,
        maxZoom: 16,
        disableDefaultUI: true,
        clickableIcons: false,
        styles: [{
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{
                color: '#193341'
            }]
        }, {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{
                color: '#2c5a71'
            }]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{
                color: '#29768a'
            }, {
                lightness: -37
            }]
        }, {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{
                color: '#406d80'
            }]
        }, {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{
                color: '#406d80'
            }]
        }, {
            elementType: 'labels.text.stroke',
            stylers: [{
                visibility: 'on'
            }, {
                color: '#3e606f'
            }, {
                weight: 2
            }, {
                gamma: 0.84
            }]
        }, {
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#ffffff'
            }]
        }, {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{
                weight: 0.6
            }, {
                color: '#1a3541'
            }]
        }, {
            elementType: 'labels.icon',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{
                color: '#2c5a71'
            }]
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
        var image;
        if (status === OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE) {
            image = truckExpandMarkerImage;
        }
        else if (!isCurrentlyAvailable(marker.truck.days)) {
            image = truckUnavailableMarkerImage;
        }
        else if (isClosingSoon(marker.truck.days)) {
            image = truckClosingMarkerImage;
        }
        else {
            image = truckMarkerImage;
        }
        // console.log(image);
        marker.setIcon(image);
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
            var markers = addMapMarkers(map, infoWindow, markerSpiderfier, trucks);
            //var markerClusterer = addMarkerClusterer(map, markers);

            var options = $("#truckTitles");
            $.each(getTruckTitles(trucks), function() {
                options.append($("<option />").val(this).text(this));
            });

            var locationCircle = new google.maps.Circle({
                strokeColor: '#FFF',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#FFF',
                fillOpacity: 0.15,
                map: map,
                center: { lat: 0, lng: 0 },
                radius: 0
            });
            locationCircle.setVisible(false);
            google.maps.event.addListener(locationCircle, 'click', function() {
                google.maps.event.trigger(map, 'click', null);
            });

            attachUiEvents(markers, locationCircle);
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
    var website = truck.website !== undefined ? '<a href="' + truck.website + '">Click here</a>' : 'No website found';
    var notes = truck.notes !== undefined && truck.notes !== null && truck.notes.trim().length > 0 ? '<p>' + truck.notes + '</p>' : '';
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
        icon: truckMarkerImage,
        truck: truck
    });

    markerSpiderfier.addMarker(marker);

    var infoWindowContent = createInfoWindowContent(truck);
    marker.addListener('spider_click', function () {
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

function attachUiEvents(allMarkers, locationCircle/*, markerClusterer*/) {

    function getCurrentlySelectedDays(){
        var days = [];
        if ($('#sundayCheckbox').is(':checked')) days.push('Sunday');
        if ($('#mondayCheckbox').is(':checked')) days.push('Monday');
        if ($('#tuesdayCheckbox').is(':checked')) days.push('Tuesday');
        if ($('#wednesdayCheckbox').is(':checked')) days.push('Wednesday');
        if ($('#thursdayCheckbox').is(':checked')) days.push('Thursday');
        if ($('#fridayCheckbox').is(':checked')) days.push('Friday');
        if ($('#saturdayCheckbox').is(':checked')) days.push('Saturday');
        return days;
    }

    function getAllTrucks() {
        var allTrucks = [];
        allMarkers.forEach(function (marker) {
            allTrucks.push(marker.truck);
        }, this);
        return allTrucks;
    }

    function updateFilters(searchInput) {
        if(typeof searchInput === "undefined") {
            searchInput = $("#trucksearch").val();
        }

        var chosen = $("#showPeriodOfDay").val();
        var selectedDays = getCurrentlySelectedDays();

        var truckTitle = $("#truckTitles").val();
        console.log("Time filter changed to: " + chosen);
        console.log("Currently selected days: " + selectedDays);
        console.log("Search input is: " + searchInput);
        function isVisibleOnSelectedDays(days, selectedDays) {
            for (selectedDay of selectedDays){
                if(days.hasOwnProperty(selectedDay)){
                    return true;
                }
            }
            return false;
        }

        function filterByTime(trucks, timePeriod, selectedDays) {
            return trucks.filter(function(truck){
                if (timePeriod === "anytime") {
                    return isVisibleOnSelectedDays(truck.days, selectedDays);
                } else if (timePeriod === "currentlyAvailable") {
                    return isCurrentlyAvailable(truck.days);
                } else if (timePeriod === "morning") {
                    return isOpenInMorning(truck.days, selectedDays);
                } else if (timePeriod === "afternoon") {
                    return isOpenInAfternoon(truck.days, selectedDays);
                } else if (timePeriod === "evening") {
                    return isOpenInEvening(truck.days, selectedDays);
                } else {
                    return false;
                }
            });
        }

        if(chosen === "currentlyAvailable"){
            $('#daysButton').hide();
        } else {
            $('#daysButton').show();
        }

        // Rebuild trucks array. TODO: Store globally?
        var filteredTrucks = filterBySearch(getAllTrucks(), searchInput);
        console.log("Search results: " + filteredTrucks.length);
        filteredTrucks = filterByTime(filteredTrucks, chosen, selectedDays);
        console.log("Search and time filtered results: " + filteredTrucks.length);

        console.log("truck title: " + truckTitle);
        if( truckTitle !== "all"){
            filteredTrucks = filterBySearch(filteredTrucks, truckTitle);
            console.log("Search, time, and title filtered results: " + filteredTrucks.length);
        }

        for (var marker of allMarkers) {
            var truckIsVisible = filteredTrucks.indexOf(marker.truck) > -1;
            marker.setVisible(truckIsVisible);
        }
    }

    function showNearbyMarkers() {
        var location = $("#location").val();
        var maxDistance = parseFloat($("#distance").val());
        if (isNaN(maxDistance) || maxDistance <= 0) {
            alert('Please enter a valid number of miles.');
            return;
        }
        getLocationLatLng(location).then(function(locationLatLng) {
            if (locationLatLng === null) {
                alert('Could not find your search location.');
                return;
            }
            locationCircle.setCenter(locationLatLng);
            locationCircle.setRadius(maxDistance * 1609.34);
            locationCircle.setVisible(true);
            for (var marker of allMarkers) {
                var isNearby = locationIsNearby(marker.truck.lat, marker.truck.lng, locationLatLng, maxDistance);
                marker.setVisible(isNearby);
            }
        });
    }

    function clearLocation() {
        $('#location').val('');
        $('#distance').val('');
        locationCircle.setVisible(false);
    }

    $('#showPeriodOfDay').change(function() {
        updateFilters();
    });

    $('#trucksearch').on('input propertychange paste', function() {
        updateFilters();
    });

    $('#truckTitles').on('input propertychange paste', function() {
        updateFilters();
    });

    $( '#searchLocation' ).on( 'click', function( event ) {
        showNearbyMarkers();
    });

    $( '#clearLocation' ).on( 'click', function( event ) {
        clearLocation();
        updateFilters();
    });

    $( "#trucksearch" ).autocomplete({
         source: getSearchAutocompleteSuggestions(getAllTrucks()),
         select: function (e, ui) {
             updateFilters(ui.item.value);
         }
     });

    var options = [];
    $( '.dropdown-menu a' ).on( 'click', function( event ) {
        var $target = $( event.currentTarget ),
            val = $target.attr( 'data-value' ),
            $inp = $target.find( 'input' ),
            idx;

        function updateDaysButtonText() {
            if (getCurrentlySelectedDays().length === 7) {
                $('#daysButton').html('All Days <span class="caret"></span>');
            } else {
                $('#daysButton').html('Selected Days <span class="caret"></span>');
            }
        }

        if ( ( idx = options.indexOf( val ) ) > -1 ) {
            options.splice( idx, 1 );
            setTimeout( function() {
                $inp.prop( 'checked', true );
                updateFilters();
                updateDaysButtonText();
            }, 0);
        } else {
            options.push( val );
            setTimeout( function() {
                $inp.prop( 'checked', false);
                updateFilters();
                updateDaysButtonText();
            }, 0);
        }

        $( event.target ).blur();
        return false;
    });
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