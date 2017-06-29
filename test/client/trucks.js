var expect = require("chai").expect;
var trucks = require('../trucks.json');
var trucksjs = require('../../src/client/trucks.js');

describe("Trucks", function() {
    it("should not be empty", function() {
        expect(typeof trucks !== 'undefined' && trucks.length > 0);
    });
});


describe("Trucks", function() {
    describe("Availability", function () {
       it("Get start time", function () {
           var startTime = trucksjs.getStartTime("11 a.m. - 3 p.m.");
           expect(startTime.getHours()).to.equal(11);
           expect(startTime.getMinutes()).to.equal(0);

           var startTime2 = trucksjs.getStartTime("11:30 a.m. - 3 p.m.");
           expect(startTime2.getHours()).to.equal(11);
           expect(startTime2.getMinutes()).to.equal(30);

           var startTime3 = trucksjs.getStartTime("2 p.m. - 3 p.m.");
           expect(startTime3.getHours()).to.equal(14);
           expect(startTime3.getMinutes()).to.equal(0);
       });

        it("Get end time", function () {
            var endTime = trucksjs.getEndTime("7 a.m. - 11 a.m.");
            expect(endTime.getHours()).to.equal(11);
            expect(endTime.getMinutes()).to.equal(0);

            var endTime2 = trucksjs.getEndTime("10:30 a.m. - 11:30 a.m.");
            expect(endTime2.getHours()).to.equal(11);
            expect(endTime2.getMinutes()).to.equal(30);

            var endTime3 = trucksjs.getEndTime("2 p.m. - 3:30 p.m.");
            expect(endTime3.getHours()).to.equal(15);
            expect(endTime3.getMinutes()).to.equal(30);
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