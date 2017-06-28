var expect    = require("chai").expect;

describe("Mocha", function() {
    describe("Boolean", function() {
        it("ensures true is true", function() {
            expect(true).to.equal(true);
        });
    });
});