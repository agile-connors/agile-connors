var expect = require("chai").expect;
var trucks = require('../trucks.json');

describe("Trucks", function() {
    it("should not be empty", function() {
        expect(typeof trucks !== 'undefined' && trucks.length > 0);
    });
});

describe("Filters", function() {
    describe("Current Time", function() {
        it("ensures true is true", function() {

            expect(true).to.equal(true);
        });
    });
});