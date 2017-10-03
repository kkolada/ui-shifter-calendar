/**
 * UI Shifter Calendar Showcase
 */
var shifterCalendarShowcaseApp = angular.module('shifterCalendarShowcaseApp', ['UI.Shifter.Calendar']);

shifterCalendarShowcaseApp.controller('ShowcaseCtrl', function($scope) {

    $scope.momentJsTest = moment("20111031", "YYYYMMDD").fromNow();

});
/* EOF */