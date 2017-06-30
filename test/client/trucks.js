var expect = require("chai").expect;
var trucks = require('../trucks.json');
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

        it("Date within availability", function () {
            var availability = "7 a.m. - 11 a.m.";
            var date = new Date();
            date.setHours(6);
            date.setMinutes(0);
            date.setMilliseconds(0);
            date.setSeconds(0);
            expect(trucksjs.dateWithinAvailability(availability, date)).to.equal(false);
            date.setHours(7);
            date.setMinutes(0);
            expect(trucksjs.dateWithinAvailability(availability, date)).to.equal(true);
            date.setHours(11);
            date.setMinutes(0);
            expect(trucksjs.dateWithinAvailability(availability, date)).to.equal(true);
            date.setHours(11);
            date.setMinutes(1);
            expect(trucksjs.dateWithinAvailability(availability, date)).to.equal(false);
        });
    });
});