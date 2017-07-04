var expect = require("chai").expect;
var isEqual = require("lodash").isEqual;
var trucks = require('./example_trucks.json');
var trucksjs = require('../../src/client/trucks.js');
var trucksCombiner = require('../../src/server/truck_combiner.js');

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
    });

    describe("Search", function () {
        it("Should return all Bibim box results when searching for it", function () {
            var searchResults = trucksjs.filterBySearch(trucks, "Bibim Box");
            expect(searchResults.length).to.equal(5);
        });

        it("Should return all Bibim box results when searching for it lowercase", function () {
            var searchResults = trucksjs.filterBySearch(trucks, "bibim box");
            expect(searchResults.length).to.equal(5);
        });

        it("Should return all Bibim box results when searching for Bibim", function () {
            var searchResults = trucksjs.filterBySearch(trucks, "Bibim");
            expect(searchResults.length).to.equal(5);
        });

        it("Should return all Bibim box results when searching for their website https://www.facebook.com/Bibim-Box-1751040118466317/", function () {
            var searchResults = trucksjs.filterBySearch(trucks, "https://www.facebook.com/Bibim-Box-1751040118466317/");
            expect(searchResults.length).to.equal(5);
        });

        it("Should return one Bibim box location when searching for their name and location", function () {
            var searchResults = trucksjs.filterBySearch(trucks, "Bibim Box Opera");
            expect(searchResults.length).to.equal(1);
        });
    });
});