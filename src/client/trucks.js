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

    if (period === "p.m.") {
        hours += 12;
    }
    return getTodaysDate(hours, minutes);
}

/**
 * Returns the start time of a truck in the format '11:00'.
 * @param {string} availability Availability property from a truck in the format '11 a.m. - 3 p.m.'.
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
};


// Export in Node.js environment, for testing.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    exports.getStartTime = getStartTime;
    exports.getEndTime = getEndTime;
    exports.dateWithinAvailability = dateWithinAvailability;
}
