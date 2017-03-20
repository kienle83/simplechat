/**
 * BDD Testing
 */

describe("true", function() {
    it("should be true", () => {
        expect(true).toBeTruthy();
    });
});

describe('ChatControllerTest', function() {

    beforeEach(angular.mock.module('app'));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    describe('type on message input', function() {
        it('test should show text is typing if user type on message input', function() {
            // some codes here
        });

        it('test should show show message in container after user submit', function() {
            // for testing
        });
    });

});