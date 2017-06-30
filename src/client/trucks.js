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

/**
 * Returns the start time of a truck in the format '11:00'.
 * @param {string} availability Availability property from a truck in the
 *     format '11 a.m. - 3 p.m.'.
 */
function getStartTime(availability) {
    var hyphenPos = availability.indexOf("-");
    var startRaw = availability.slice(0, hyphenPos - 1);
    return convertTimeStringToDate(startRaw);
}

function getEndTime(availability) {
    var hyphenPos = availability.indexOf("-");
    var startRaw = availability.substr(hyphenPos + 2);
    return convertTimeStringToDate(startRaw);
}

function dateWithinAvailability (availability, date) {
    return date >= getStartTime(availability) &&
           date <= getEndTime(availability);
}

function isOpenInMorning (truckAvailability) {
    return availabilitiesIntersect(truckAvailability, "5 a.m. - 12 p.m.");
}

function isOpenInAfternoon (truckAvailability) {
    return availabilitiesIntersect(truckAvailability, "12 p.m. - 5 p.m.");
}

function isOpenInEvening (truckAvailability) {
    return availabilitiesIntersect(truckAvailability, "5 p.m. - 9 p.m.");
}

/**
 * Exclusive for the beginning minute and last minute. So we don't say a
 * place is open in the afternoon if it closes at 12 p.m.
 * @param truckAvailability
 * @param periodAvailability
 * @returns {boolean}
 */
function availabilitiesIntersect (truckAvailability, periodAvailability) {
    return getStartTime(periodAvailability) < getEndTime(truckAvailability)
           && getStartTime(truckAvailability) < getEndTime(periodAvailability);
}



// TODO(ben): Add a date closing within 1 hour functionality


// Calculate the distance between the truck and the search location.
// Returns: True if the distance between the truck and the location is less than maxDistance.
//          False if they are too far apart.
function locationIsNearby(truckLatitude, truckLongitude, location, maxDistance) {
    return true;
}


function isNodeJsEnvironment() {
    return typeof module !== 'undefined' &&
           typeof module.exports !== 'undefined';
}
function exportNodeJsFunctionsForTestingTrucks() {
    exports.getStartTime = getStartTime;
    exports.getEndTime = getEndTime;
    exports.dateWithinAvailability = dateWithinAvailability;
    exports.isOpenInMorning = isOpenInMorning;
    exports.isOpenInAfternoon = isOpenInAfternoon;
    exports.isOpenInEvening = isOpenInEvening;
}
if (isNodeJsEnvironment()) {
    exportNodeJsFunctionsForTestingTrucks();
}
