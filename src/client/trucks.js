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
    var startRaw = availability.slice(0, hyphenPos - 1);
    return startRaw;
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
    var startRaw = availability.substr(hyphenPos + 2);
    return startRaw;
}
function getEndTime(availability) {
    var startRaw = getEndTimeString(availability);
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

function combineTrucks (uncombinedTrucks) {
    var combinedTrucksMap = new Map;
    for (truck of uncombinedTrucks) {
        var key = truck.title + truck.location + truck.notes + truck.website +
            truck.lat + truck.lng;
        var value;
        if(combinedTrucksMap.has(key)){
            value = combinedTrucksMap.get(key);
        } else {
            value = {
                "days": {},
                "title":truck.title,
                "location": truck.location,
                "notes": truck.notes,
                "website": truck.website,
                "lat": truck.lat,
                "lng": truck.lng
            };
        }
        if (! value.days.hasOwnProperty(truck.day)){
            value.days[truck.day] = [];
        }

        var availabilities = value.days[truck.day];
        if (canCombineAvailability(availabilities, truck.availability)){
            availabilities = combineAvailabilities(availabilities, truck.availability);
        } else {
            availabilities.push(truck.availability);
        }


        value.days[truck.day] = availabilities;
        combinedTrucksMap.set(key, value);
    }
    return Array.from(combinedTrucksMap.values());
}

function getCombinableAvailability(availabilities, truckAvailability) {
    for (availability of availabilities){
        if(getStartTime(availability).getTime() === getEndTime(truckAvailability).getTime() ||
           getStartTime(truckAvailability).getTime() === getEndTime(availability).getTime()){
            return availability;
        }
    }

    return null;
}

function canCombineAvailability(availabilities, truckAvailability) {
    return getCombinableAvailability(availabilities, truckAvailability) !== null;
}
function combineAvailabilities(availabilities, availability) {
    function combineAvailability(availability, availability2) {
        if (getStartTime(availability).getTime() === getEndTime(availability2).getTime()) {
            return getStartTimeString(availability2) + " - " + getEndTimeString(availability);
        }else if (getStartTime(availability2).getTime() === getEndTime(availability).getTime()) {
            return getStartTimeString(availability) + " - " + getEndTimeString(availability2);
        }else {
            console.log("Couldn't combine availabilities!");
            return null;
        }
    }

    while (canCombineAvailability(availabilities, availability)){
        var combinableAvailability = getCombinableAvailability(availabilities, availability);
        console.log(availabilities);
        console.log(availability);
        var index = availabilities.indexOf(combinableAvailability);
        if (index > -1) {
            availabilities.splice(index, 1);
        }
        availabilities.push(combineAvailability(availability, combinableAvailability));
    }

    return availabilities;
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
    exports.combineTrucks = combineTrucks;
    exports.canCombineAvailability = canCombineAvailability;
    exports.combineAvailabilities = combineAvailabilities;
}
if (isNodeJsEnvironment()) {
    exportNodeJsFunctionsForTestingTrucks();
}

