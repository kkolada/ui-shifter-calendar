/**
 * UI Shifter Calendar Showcase
 */
var shifterCalendarShowcaseApp = angular.module('shifterCalendarShowcaseApp', ['UI.Shifter.Calendar']);

shifterCalendarShowcaseApp.controller('ShowcaseCtrl', function($scope) {

    $scope.momentJsDate = moment().format('MMMM Do YYYY, HH:mm:ss');

});
/* EOF */