var expect = require("chai").expect;
var isEqual = require("lodash").isEqual;
var trucks = require('./example_trucks.json');
var trucksCombiner = require('../../src/server/truck_combiner.js');

describe("Truck combiner", function () {
    it("can combine availability", function () {

        var availabilities = ["11 a.m. - 3 p.m."];
        expect(trucksCombiner.canCombineAvailability(availabilities, "7 a.m. - 11 a.m."))
            .to.equal(true);
        expect(trucksCombiner.canCombineAvailability(availabilities, "3 p.m. - 7 p.m."))
            .to.equal(true);
    });

    it("cannot combine availability", function () {

        var availabilities = ["11 a.m. - 3 p.m."];
        expect(trucksCombiner.canCombineAvailability(availabilities, "7 a.m. - 10 a.m."))
            .to.equal(false);
    });

    it("get combinable availability", function () {

        var availabilities = ["11 a.m. - 3 p.m."];
        expect(trucksCombiner.getCombinableAvailability(availabilities, "7 a.m. - 11 a.m."))
            .to.equal("11 a.m. - 3 p.m.");
        expect(trucksCombiner.getCombinableAvailability(availabilities, "3 p.m. - 7 p.m."))
            .to.equal("11 a.m. - 3 p.m.");
    });

    it("get combinable availability returns null when no combinable availabilty present", function () {

        var availabilities = ["11 a.m. - 3 p.m."];
        expect(trucksCombiner.getCombinableAvailability(availabilities, "7 a.m. - 10 a.m."))
            .to.equal(null);
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
    describe("Given two trucks with the same location on different days", function () {
        var uncombinedTrucks;
        beforeEach(function () {
            uncombinedTrucks = [{
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
        });
        describe("When I combine trucks together", function () {
            var combinedTrucks;
            beforeEach(function () {
                combinedTrucks = trucksCombiner.combineTrucks(uncombinedTrucks)
            });
            it("Then the trucks should be the same object", function () {
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
    });
});

describe("Trucks at the same location on different days should be"
         + " combined into the same record.", function() {
    describe("Given multiple trucks with the same location on different days", function () {
        var uncombinedTrucks;
        beforeEach(function () {
            uncombinedTrucks = require('./uncombined_trucks.json');
        });
        describe("When I combine trucks together", function () {
            var combinedTrucks;
            beforeEach(function () {
                combinedTrucks = trucksCombiner.combineTrucks(uncombinedTrucks)
            });
            it("Then trucks with the same days should be in the same object", function () {
                var expected = require('./combined_trucks.json');
                expect(isEqual(combinedTrucks, expected)).to.equal(true);
            });
        });
    });
});

describe("Don't combine two days of data for different trucks.", function () {
    describe("Given two trucks with the same availability on the same days", function () {
        var uncombinedTrucks;
        beforeEach(function () {
            uncombinedTrucks = [{
                "day": "Friday",
                "title": "Cookie Monstah",
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
        });
        describe("When I combine trucks together", function () {
            var combinedTrucks;
            beforeEach(function () {
                combinedTrucks = trucksCombiner.combineTrucks(uncombinedTrucks)
            });
            it("Then the trucks shouldn't be the same object", function () {
                var expected = [{
                    "days": {
                        "Friday": [
                            "3 p.m. - 8 p.m."
                        ]
                    },
                    "title": "Cookie Monstah",
                    "location": "Maverick Square",
                    "notes": " ",
                    "website": "http://www.tenochmexican.com/",
                    "lat": 42.3688714588863,
                    "lng": -71.03974206301206
                },
                    {
                        "days": {
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
    });
});