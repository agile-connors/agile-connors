var expect = require("chai").expect;
var isEqual = require("lodash").isEqual;
var trucks = require('./example_trucks.json');
var trucksjs = require('../../src/client/trucks.js');

describe("Trucks", function() {
    it("test data should not be empty", function() {
        expect(typeof trucks !== 'undefined' && trucks.length > 0);
    });

    describe("Availability", function () {
        it("should get hours when minutes aren't present", function () {
            var startTime = trucksjs.getStartTime("11 a.m. - 3 p.m.");
            expect(startTime.getHours()).to.equal(11);
            expect(startTime.getMinutes()).to.equal(0);
        });

        it("should get hours when minutes are present", function () {
            var startTime2 = trucksjs.getStartTime("11:30 a.m. - 3 p.m.");
            expect(startTime2.getHours()).to.equal(11);
            expect(startTime2.getMinutes()).to.equal(30);
        });

       it("should get hours when period is p.m.", function () {
           var startTime3 = trucksjs.getStartTime("2 p.m. - 3 p.m.");
           expect(startTime3.getHours()).to.equal(14);
           expect(startTime3.getMinutes()).to.equal(0);
       });

        it("Get end time", function () {
            var endTime = trucksjs.getEndTime("7 a.m. - 11 a.m.");
            expect(endTime.getHours()).to.equal(11);
            expect(endTime.getMinutes()).to.equal(0);
        });

        it("Get end time with minutes", function () {
            var endTime = trucksjs.getEndTime("10:30 a.m. - 11:30 a.m.");
            expect(endTime.getHours()).to.equal(11);
            expect(endTime.getMinutes()).to.equal(30);
        });

        it("Get end time in afternoon", function () {
            var endTime = trucksjs.getEndTime("2 p.m. - 3:30 p.m.");
            expect(endTime.getHours()).to.equal(15);
            expect(endTime.getMinutes()).to.equal(30);
        });

        it("Get end time open late", function () {
            var endTime = trucksjs.getEndTime("10 p.m. - 2 a.m.");
            expect(endTime.getHours()).to.equal(2);
            expect(endTime.getMinutes()).to.equal(0);
        });

        /**
         * Convert availability to day
         */
        function a2d(availability) {
            return {"Sunday" : [availability]};
        }
        var allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


        it("is open in morning", function () {
            expect(trucksjs.isOpenInMorning(a2d("3 a.m. - 4 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInMorning(a2d("3 a.m. - 5 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInMorning(a2d("3 a.m. - 5:30 a.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInMorning(a2d("7 a.m. - 11 a.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInMorning(a2d("10 a.m. - 12 p.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInMorning(a2d("12 p.m. - 1 p.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInMorning(a2d("12:01 p.m. - 1 p.m."), allDays)).to.equal(false);
        });

        it("is open in afternoon", function () {
            expect(trucksjs.isOpenInAfternoon(a2d("3 a.m. - 4 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInAfternoon(a2d("3 a.m. - 5 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInAfternoon(a2d("3 a.m. - 5:30 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInAfternoon(a2d("7 a.m. - 11 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInAfternoon(a2d("10 a.m. - 12 p.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInAfternoon(a2d("12 p.m. - 1 p.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInAfternoon(a2d("12:01 p.m. - 1 p.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInAfternoon(a2d("12 p.m. - 5 p.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInAfternoon(a2d("4 p.m. - 5 p.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInAfternoon(a2d("5 p.m. - 6 p.m."), allDays)).to.equal(false);
        });

        it("is open in evening", function () {
            expect(trucksjs.isOpenInEvening(a2d("3 a.m. - 4 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("3 a.m. - 5 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("3 a.m. - 5:30 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("7 a.m. - 11 a.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("10 a.m. - 12 p.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("12 p.m. - 1 p.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("12:01 p.m. - 1 p.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("12 p.m. - 5 p.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("4 p.m. - 5 p.m."), allDays)).to.equal(false);
            expect(trucksjs.isOpenInEvening(a2d("5 p.m. - 6 p.m."), allDays)).to.equal(true);
            expect(trucksjs.isOpenInEvening(a2d("5 p.m. - 9 p.m."), allDays)).to.equal(true);
        });

        it("is open in evening", function () {
            expect(trucksjs.availabilitiesIntersect(a2d("3 a.m. - 4 a.m."),
                                           allDays, "5 p.m. - 9 p.m.")).to.equal(false);
            expect(trucksjs.availabilitiesIntersect(a2d("3 a.m. - 6 p.m."),
                                                    allDays, "5 p.m. - 9 p.m.")).to.equal(true);
        });

        it("can combine availability", function () {

            var availabilities = ["11 a.m. - 3 p.m."];
            expect(trucksjs.canCombineAvailability(availabilities, "7 a.m. - 10 a.m."))
                .to.equal(false);
            expect(trucksjs.canCombineAvailability(availabilities, "7 a.m. - 11 a.m."))
                .to.equal(true);
            expect(trucksjs.canCombineAvailability(availabilities, "3 p.m. - 7 p.m."))
                .to.equal(true);
        });

        it("get combinable availability", function () {

            var availabilities = ["11 a.m. - 3 p.m."];
            expect(trucksjs.getCombinableAvailability(availabilities, "7 a.m. - 10 a.m."))
                .to.equal(null);
            expect(trucksjs.getCombinableAvailability(availabilities, "7 a.m. - 11 a.m."))
                .to.equal("11 a.m. - 3 p.m.");
            expect(trucksjs.getCombinableAvailability(availabilities, "3 p.m. - 7 p.m."))
                .to.equal("11 a.m. - 3 p.m.");
        });

        it("combine availability", function () {
            var actual = trucksjs.combineAvailabilities(["11 a.m. - 3 p.m."], "7 a.m. - 11 a.m.");

            expect(isEqual(actual, ["7 a.m. - 3 p.m."])).to.equal(true);

            var actual2 = trucksjs.combineAvailabilities(["11 a.m. - 3 p.m."], "3 p.m. - 7 p.m.");
            console.log("actual2: " + actual2);
            expect(isEqual(actual2,
                           ["11 a.m. - 7 p.m."])).to.equal(true);
        });

        it("check null combinable availability", function () {
            var availabilities = ["11 a.m. - 3 p.m."];
            expect(trucksjs.getCombinableAvailability(availabilities, "3 a.m. - 10 a.m."))
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
            var combinedTrucks = trucksjs.combineTrucks(uncombinedTrucks);
            var expected  = [{
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

    describe("Search", function () {
        it("Should return all Bibim box results when searching for it", function () {
            var searchResults = trucksjs.searchTrucks(trucks, "Bibim Box");
            var combinedResults = trucksjs.combineTrucks(searchResults);
            expect(combinedResults.length).to.equal(5);
        });

        it("Should return all Bibim box results when searching for it lowercase", function () {
            var searchResults = trucksjs.searchTrucks(trucks, "bibim box");
            var combinedResults = trucksjs.combineTrucks(searchResults);
            expect(combinedResults.length).to.equal(5);
        });

        it("Should return all Bibim box results when searching for Bibim", function () {
            var searchResults = trucksjs.searchTrucks(trucks, "Bibim");
            var combinedResults = trucksjs.combineTrucks(searchResults);
            expect(combinedResults.length).to.equal(5);
        });

        it("Should return all Bibim box results when searching for their website https://www.facebook.com/Bibim-Box-1751040118466317/", function () {
            var searchResults = trucksjs.searchTrucks(trucks, "https://www.facebook.com/Bibim-Box-1751040118466317/");
            var combinedResults = trucksjs.combineTrucks(searchResults);
            expect(combinedResults.length).to.equal(5);
        });

        it("Should return one Bibim box location when searching for their name and location", function () {
            var searchResults = trucksjs.searchTrucks(trucks, "Bibim Box Opera");
            var combinedResults = trucksjs.combineTrucks(searchResults);
            expect(combinedResults.length).to.equal(1);
        });
    });

    // BDD Style
    describe("Trucks at the same location on different days should be"
             + " combined into the same record.", function () {
        it("given multiple trucks with the same location on different days" +
           "when I combine trucks together" +
           "then trucks with the same days should be in the same object", function () {

            var uncombinedTrucks = require('./uncombined_trucks.json');
            var combinedTrucks = trucksjs.combineTrucks(uncombinedTrucks);
            var expected  = require('./combined_trucks.json');
            expect(isEqual(combinedTrucks, expected)).to.equal(true);
        });
    });


});