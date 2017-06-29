var expect = require("chai").expect;
var mainjs = require('../../src/client/main.js');

describe("Main", function() {
    describe("NodeJs", function () {
        it("should be a node js environment", function () {
            expect(mainjs.isNodeJsEnvironment());
        });
    });
});