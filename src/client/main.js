var map;

function initMap() {

    var mapElement = document.getElementById('map');
    var mapOptions = {
        center: { lat: 42.3530715, lng: -71.0736387 },
        zoom: 13,
        minZoom: 13,
        disableDefaultUI: true,
        styles: [{"featureType":"all","elementType":"all","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":-30}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#353535"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#656565"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#505050"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#808080"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#454545"}]},{"featureType":"transit","elementType":"labels","stylers":[{"hue":"#007bff"},{"saturation":100},{"lightness":-40},{"invert_lightness":true},{"gamma":1.5}]},{"featureType":"transit.station.bus","elementType":"geometry.fill","stylers":[{"color":"#08498f"}]}]
    };
    map = new google.maps.Map(mapElement, mapOptions);

    google.maps.event.addListener(map, "click", function(event) {
        console.log(map.getCenter().lat(), map.getCenter().lng());
    });

    fetchTruckData();
}

function fetchTruckData() {
    $.ajax({
        url: '/api/trucks',
        type: 'GET',
        dataType: 'JSON',
        success: handleTruckData
    });
}

var truck_icon = 'img/truck.png';
function handleTruckData(data) {
    data.forEach(function(truck) {
        var marker = new google.maps.Marker({
            position: { lat: truck.lat, lng: truck.lng },
            map: map,
            title: truck.title,
            icon: truck_icon
        });
    });
}
