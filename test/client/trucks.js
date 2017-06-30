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

        it("is open in morning", function () {
            expect(trucksjs.isOpenInMorning("3 a.m. - 4 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInMorning("3 a.m. - 5 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInMorning("3 a.m. - 5:30 a.m.")).to.equal(true);
            expect(trucksjs.isOpenInMorning("7 a.m. - 11 a.m.")).to.equal(true);
            expect(trucksjs.isOpenInMorning("10 a.m. - 12 p.m.")).to.equal(true);
            expect(trucksjs.isOpenInMorning("12 p.m. - 1 p.m.")).to.equal(false);
            expect(trucksjs.isOpenInMorning("12:01 p.m. - 1 p.m.")).to.equal(false);
        });

        it("is open in afternoon", function () {
            expect(trucksjs.isOpenInAfternoon("3 a.m. - 4 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInAfternoon("3 a.m. - 5 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInAfternoon("3 a.m. - 5:30 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInAfternoon("7 a.m. - 11 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInAfternoon("10 a.m. - 12 p.m.")).to.equal(false);
            expect(trucksjs.isOpenInAfternoon("12 p.m. - 1 p.m.")).to.equal(true);
            expect(trucksjs.isOpenInAfternoon("12:01 p.m. - 1 p.m.")).to.equal(true);
            expect(trucksjs.isOpenInAfternoon("12 p.m. - 5 p.m.")).to.equal(true);
            expect(trucksjs.isOpenInAfternoon("4 p.m. - 5 p.m.")).to.equal(true);
            expect(trucksjs.isOpenInAfternoon("5 p.m. - 6 p.m.")).to.equal(false);
        });

        it("is open in evening", function () {
            expect(trucksjs.isOpenInEvening("3 a.m. - 4 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("3 a.m. - 5 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("3 a.m. - 5:30 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("7 a.m. - 11 a.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("10 a.m. - 12 p.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("12 p.m. - 1 p.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("12:01 p.m. - 1 p.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("12 p.m. - 5 p.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("4 p.m. - 5 p.m.")).to.equal(false);
            expect(trucksjs.isOpenInEvening("5 p.m. - 6 p.m.")).to.equal(true);
            expect(trucksjs.isOpenInEvening("5 p.m. - 9 p.m.")).to.equal(true);
        });
    });
});