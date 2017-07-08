/**
 * @param {string} rawTime
 */
function convertTimeStringToDate(rawTime) {
    function getTodaysDate(hours, minutes) {
        var date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setMilliseconds(0);
        date.setSeconds(0);
        return date;
    }

    function singleDigitHour(rawTime) {
        return rawTime.indexOf(' ') === 1 || rawTime.indexOf(':') === 1;
    }

    if (singleDigitHour(rawTime)) {
        rawTime = "0" + rawTime;
    }

    var period = rawTime.substr(rawTime.length - 4);
    var hours = parseInt(rawTime.slice(0, 2));
    var minutes;
    if (rawTime.indexOf(':') === -1) {
        minutes = 0;
    } else {
        minutes = rawTime.slice(3, 5);
    }

    if (period === "p.m." && hours !== 12) {
        hours += 12;
    }else if (period === "a.m." && hours === 12) {
        hours = 0;
    }
    return getTodaysDate(hours, minutes);
}

function getStartTimeString(availability) {
    var hyphenPos = availability.indexOf("-");
    return availability.slice(0, hyphenPos - 1);
}
/**
 * Returns the start time of a truck in the format '11:00'.
 * @param {string} availability Availability property from a truck in the
 *     format '11 a.m. - 3 p.m.'.
 */
function getStartTime(availability) {
    var startRaw = getStartTimeString(availability);
    return convertTimeStringToDate(startRaw);
}

function getEndTimeString(availability) {
    var hyphenPos = availability.indexOf("-");
    return availability.substr(hyphenPos + 2);
}
function getEndTime(availability) {
    var startRaw = getEndTimeString(availability);
    return convertTimeStringToDate(startRaw);
}

function getCurrentWeekday(){
    var d = new Date();
    switch(d.getDay()) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        default:
            return "Saturday";
    }
}

function isCurrentlyAvailable (days) {
    var currentWeekday = getCurrentWeekday();
    if (! days.hasOwnProperty(currentWeekday)){
        return false;
    }

    var date = new Date();
    for (availability of days[currentWeekday]){
        if (date >= getStartTime(availability) && date <= getEndTime(availability)){
            return true;
        }
    }

    return false;
}

function isClosingSoon (days) {

    var currentWeekday = getCurrentWeekday();
    if (!days.hasOwnProperty(currentWeekday)){
        return false;
    }

    var date = new Date();
    for (availability of days[currentWeekday]){
        var endTime = getEndTime(availability);
        var startTime = new Date(endTime.getTime());
        startTime.setHours(startTime.getHours() - 1);
        if (date >= startTime && date <= endTime) {
            return true;
        }
    }

    return false;
}

function isOpenInMorning (truckDays, selectedDays) {
    return availabilitiesIntersect(truckDays, selectedDays, "5 a.m. - 12 p.m.");
}

function isOpenInAfternoon (truckDays, selectedDays) {
    return availabilitiesIntersect(truckDays, selectedDays, "12 p.m. - 5 p.m.");
}

function isOpenInEvening (truckDays, selectedDays) {
    return availabilitiesIntersect(truckDays, selectedDays, "5 p.m. - 9 p.m.");
}

/**
 * Exclusive for the beginning minute and last minute. So we don't say a
 * place is open in the afternoon if it closes at 12 p.m.
 * @param truckDays days from truck object
 * @param selectedDays the selected days from the ui
 * @param periodAvailability
 * @returns {boolean}
 */
function availabilitiesIntersect (truckDays, selectedDays, periodAvailability) {
    for (day of selectedDays){
        if (truckDays.hasOwnProperty(day)){
            var availabilities = truckDays[day];
            for (availability of availabilities){
                if (getStartTime(periodAvailability) < getEndTime(availability)
                    && getStartTime(availability) < getEndTime(periodAvailability)){
                    return true;
                }
            }
        }
    }

    return false;
}

function getLocationLatLng(location) {
    return new Promise(function(resolve, reject) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, function(results, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
                resolve(null);
                return;
            }
            resolve(results[0].geometry.location);
        });
    });
}

/**
 * Calculate the distance between the truck and the search location.
 * @param: truckLatitude - the latitude of the truck.
 * @param: truckLongitude - the longitude of the truck.
 * @param: locationLatLng - lat/lng object representing the location
 * @param: maxDistance - the furthest distance (in miles) from the location we want to find trucks.
 * @returns: True if the distance between the truck and the location is less than or equal to maxDistance.
 *          False if they are too far apart.
 *          Null if error in geocoding process.
 */
function locationIsNearby(truckLatitude, truckLongitude, locationLatLng, maxDistance) {
    var truckLatLng = new google.maps.LatLng(truckLatitude, truckLongitude);
    var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, truckLatLng);
    var distanceInMiles = distanceInMeters / 1609.34;
    return distanceInMiles <= maxDistance;
}



function getTruckTitles(trucks) {
    var companies = [];
    for (truck of trucks){
        if (companies.indexOf(truck.title) === -1){
            companies.push(truck.title);
        }
    }
    return companies.sort();
}

function getSearchAutocompleteSuggestions(trucks) {
    var companies = [];
    for (truck of trucks){
        if (companies.indexOf(truck.title) === -1){
            companies.push(truck.title);
        }
        if (companies.indexOf(truck.location) === -1){
            companies.push(truck.location);
        }
    }
    return companies.sort();
}

function filterBySearch(trucks, searchQuery) {
    searchQuery = searchQuery.toLowerCase();
    var splitQuery = searchQuery.split(/[ ,]+/);

    return trucks.filter(function(truck){
        var result = splitQuery.filter(function(query) {
            function getNotes() {
                if (truck.notes === undefined || truck.notes === null){
                    return "";
                }

                return truck.notes.toLowerCase();
            }

            return truck.title.toLowerCase().includes(query) || truck.website.toLowerCase().includes(query) || truck.location.toLowerCase().includes(query) ||
                   getNotes().includes(query);
        });
        return result.length == splitQuery.length;
    });
}



function isNodeJsEnvironment() {
    return typeof module !== 'undefined' &&
           typeof module.exports !== 'undefined';
}
function exportNodeJsFunctionsForTestingTrucks() {
    exports.getStartTime = getStartTime;
    exports.getEndTime = getEndTime;
    exports.isCurrentlyAvailable = isCurrentlyAvailable;
    exports.isOpenInMorning = isOpenInMorning;
    exports.isOpenInAfternoon = isOpenInAfternoon;
    exports.isOpenInEvening = isOpenInEvening;
    exports.availabilitiesIntersect = availabilitiesIntersect;
    exports.filterBySearch = filterBySearch;
    exports.getStartTimeString = getStartTimeString;
    exports.getEndTimeString = getEndTimeString;
    exports.getTruckTitles = getTruckTitles;
    exports.getSearchAutocompleteSuggestions = getSearchAutocompleteSuggestions;
}
if (isNodeJsEnvironment()) {
    exportNodeJsFunctionsForTestingTrucks();
}

