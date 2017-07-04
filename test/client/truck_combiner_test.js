var expect = require("chai").expect;
var isEqual = require("lodash").isEqual;
var trucks = require('./example_trucks.json');
var trucksCombiner = require('../../src/server/truck_combiner.js');

describe("Truck combiner", function () {
    it("can combine availability", function () {

        var availabilities = ["11 a.m. - 3 p.m."];
        expect(trucksCombiner.canCombineAvailability(availabilities, "7 a.m. - 10 a.m."))
            .to.equal(false);
        expect(trucksCombiner.canCombineAvailability(availabilities, "7 a.m. - 11 a.m."))
            .to.equal(true);
        expect(trucksCombiner.canCombineAvailability(availabilities, "3 p.m. - 7 p.m."))
            .to.equal(true);
    });

    it("get combinable availability", function () {

        var availabilities = ["11 a.m. - 3 p.m."];
        expect(trucksCombiner.getCombinableAvailability(availabilities, "7 a.m. - 10 a.m."))
            .to.equal(null);
        expect(trucksCombiner.getCombinableAvailability(availabilities, "7 a.m. - 11 a.m."))
            .to.equal("11 a.m. - 3 p.m.");
        expect(trucksCombiner.getCombinableAvailability(availabilities, "3 p.m. - 7 p.m."))
            .to.equal("11 a.m. - 3 p.m.");
    });

    it("combine availability", function () {
        var actual = trucksCombiner.combineAvailabilities(["11 a.m. - 3 p.m."], "7 a.m. - 11 a.m.");

        expect(isEqual(actual, ["7 a.m. - 3 p.m."])).to.equal(true);

        var actual2 = trucksCombiner.combineAvailabilities(["11 a.m. - 3 p.m."], "3 p.m. - 7 p.m.");
        console.log("actual2: " + actual2);
        expect(isEqual(actual2,
                       ["11 a.m. - 7 p.m."])).to.equal(true);
    });

    it("check null combinable availability", function () {
        var availabilities = ["11 a.m. - 3 p.m."];
        expect(trucksCombiner.getCombinableAvailability(availabilities, "3 a.m. - 10 a.m."))
            .to.equal(null);
    });

});

describe("Combine two days of data for the same truck.", function () {

    it("given two trucks with the same location on different days" +
       "when I combine trucks together" +
       "the trucks should be the same object", function () {

        var uncombinedTrucks = [{
            "day": "Thursday",
            "title": "Tenoch Mexican",
            "location": "Maverick Square",
            "notes": " ",
            "website": "http://www.tenochmexican.com/",
            "availability": "3 p.m. - 8 p.m.",
            "lat": 42.3688714588863,
            "lng": -71.03974206301206
        },
            {
                "day": "Friday",
                "title": "Tenoch Mexican",
                "location": "Maverick Square",
                "notes": " ",
                "website": "http://www.tenochmexican.com/",
                "availability": "3 p.m. - 8 p.m.",
                "lat": 42.3688714588863,
                "lng": -71.03974206301206
            }];
        var combinedTrucks = trucksCombiner.combineTrucks(uncombinedTrucks);
        var expected = [{
            "days": {
                "Thursday": [
                    "3 p.m. - 8 p.m."
                ],
                "Friday": [
                    "3 p.m. - 8 p.m."
                ]
            },
            "title": "Tenoch Mexican",
            "location": "Maverick Square",
            "notes": " ",
            "website": "http://www.tenochmexican.com/",
            "lat": 42.3688714588863,
            "lng": -71.03974206301206
        }];
        expect(isEqual(combinedTrucks, expected)).to.equal(true);
    });
});

// BDD Style
describe("Trucks at the same location on different days should be"
         + " combined into the same record.", function () {
    it("given multiple trucks with the same location on different days" +
       "when I combine trucks together" +
       "then trucks with the same days should be in the same object", function () {

        var uncombinedTrucks = require('./uncombined_trucks.json');
        var combinedTrucks = trucksCombiner.combineTrucks(uncombinedTrucks);
        var expected = require('./combined_trucks.json');
        expect(isEqual(combinedTrucks, expected)).to.equal(true);
    });

});