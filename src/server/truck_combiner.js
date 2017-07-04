var trucksjs = require('../client/trucks.js');
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
        if(trucksjs.getStartTime(availability).getTime() === trucksjs.getEndTime(truckAvailability).getTime() ||
           trucksjs.getStartTime(truckAvailability).getTime() === trucksjs.getEndTime(availability).getTime()){
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
        if (trucksjs.getStartTime(availability).getTime() === trucksjs.getEndTime(availability2).getTime()) {
            return trucksjs.getStartTimeString(availability2) + " - " + trucksjs.getEndTimeString(availability);
        }else if (trucksjs.getStartTime(availability2).getTime() === trucksjs.getEndTime(availability).getTime()) {
            return trucksjs.getStartTimeString(availability) + " - " + trucksjs.getEndTimeString(availability2);
        }else {
            console.log("Couldn't combine availabilities!");
            return null;
        }
    }

    while (canCombineAvailability(availabilities, availability)){
        var combinableAvailability = getCombinableAvailability(availabilities, availability);
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

function exportNodeJsFunctionsForTestingTruckCombiner() {
    exports.combineTrucks = combineTrucks;
    exports.canCombineAvailability = canCombineAvailability;
    exports.combineAvailabilities = combineAvailabilities;
    exports.getCombinableAvailability = getCombinableAvailability;

}

if (isNodeJsEnvironment()) {
    exportNodeJsFunctionsForTestingTruckCombiner();
}