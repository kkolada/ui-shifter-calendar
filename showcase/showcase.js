/**
 * UI Shifter Calendar Showcase
 */
var shifterCalendarShowcaseApp = angular.module('shifterCalendarShowcaseApp', ['UI.Shifter.Calendar']);

shifterCalendarShowcaseApp.controller('ShowcaseCtrl', function($scope) {

    $scope.momentJsDate = moment().format('MMMM Do YYYY, HH:mm:ss');
    $scope.data = {
        availableHours: [
            {t:0}, {t:1}, {t:2}, {t:3}, {t:4}, {t:5}, {t:6}, {t:7}, {t:8}, {t:9}, {t:10}, {t:11}, {t:12},
            {t:13}, {t:14}, {t:15}, {t:16}, {t:17}, {t:18}, {t:19}, {t:20}, {t:21}, {t:22}, {t:23}, {t:24}
            ],
        startTime: {t:0},
        endTime: {t:1}
    };
    $scope.checkboxModel = {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true
    };
    $scope.activateWorkingDays = function() {
        $scope.checkboxModel.mon = true;
        $scope.checkboxModel.tue = true;
        $scope.checkboxModel.wed = true;
        $scope.checkboxModel.thu = true;
        $scope.checkboxModel.fri = true;
        $scope.checkboxModel.sat = false;
        $scope.checkboxModel.sun = false;
    };
    $scope.activateWeekend = function() {
        $scope.checkboxModel.mon = false;
        $scope.checkboxModel.tue = false;
        $scope.checkboxModel.wed = false;
        $scope.checkboxModel.thu = false;
        $scope.checkboxModel.fri = false;
        $scope.checkboxModel.sat = true;
        $scope.checkboxModel.sun = true;
    }

});
/* EOF */