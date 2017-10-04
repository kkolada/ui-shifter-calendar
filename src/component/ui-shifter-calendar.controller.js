(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .controller('uiShifterCalendarCtrl', ['$scope', uiShifterCalendarCtrl]);

    function uiShifterCalendarCtrl($scope) {
        var vm = this;
        vm.hours = [];

        var countRows = function(startTime, endTime) {
            var newHours = [];
            for (var i = startTime; i <= endTime; i++) {
                newHours.push({
                    time: moment({ hour: i, minute: 0 }).format("HH:mm")
                });
            }
            vm.hours = newHours;
        };

        $scope.$watch('vm.timeFilter', function (newValue, oldValue) {
            countRows(newValue.start, newValue.end);
        }, true);

        $scope.$watch('vm.dayFilter', function (newValue, oldValue) {
        }, true);

    }

})();

