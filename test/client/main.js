var expect = require("chai").expect;

describe("Map", function() {
    describe("Markers", function() {
        it("ensure contains markers", function() {

            var map = undefined;// TODO(ben):Define
            var marker = undefined; //TODO(ben): Define
            var containsMarker = map.getBounds().contains(marker.getPosition())
            expect(containsMarker);
        });
    });
});