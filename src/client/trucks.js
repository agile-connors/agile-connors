// Utility methods for trucks
var exports = exports || {};

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
 * Returns the start time of a truck in the format `11:00`
 * @param availability from a truck in the format `11 a.m. - 3 p.m.`
 */
exports.getStartTime = function getStartTime(availability) {
    var hyphenPos = availability.indexOf("-");
    var startRaw = availability.slice(0, hyphenPos - 1);
    return convertTimeStringToDate(startRaw);
}

exports.getEndTime = function getEndTime(availability) {
    var hyphenPos = availability.indexOf("-");
    var startRaw = availability.substr(hyphenPos + 2);
    return convertTimeStringToDate(startRaw);
}

exports.dateWithinAvailability = function dateWithinAvailability (availability, date) {
    return date >= exports.getStartTime(availability) &&
           date <= exports.getEndTime(availability);
};