(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .controller('uiShifterCalendarCtrl', ['$scope', '$document', '$moment', 'eventConst', 'uiShifterEvent',
            'uiShifterCalendarEvent', uiShifterCalendarCtrl]);

    function uiShifterCalendarCtrl($scope, $document, $moment, eventConst, uiShifterEvent, uiShifterCalendarEvent) {
        var vm = this,
            events = [];
        vm.hours = [];

        var countRows = function (startTime, endTime) {
            var newHours = [];
            for (var i = startTime; i <= endTime; i++) {
                newHours.push({
                    time: $moment({ hour: i, minute: 0 }).format("HH:mm")
                });
            }
            vm.hours = newHours;
        };

        var drawEvents = function () {
            clearAllEvents();
            events.forEach(function(element) {
                uiShifterCalendarEvent.createBooking(vm.id, element, vm.hours[0].time);
            });
        };

        var clearAllEvents = function () {
            var shifts = $document[0].getElementsByClassName(eventConst.BOOKING);

            while(shifts.length > 0){
                shifts[0].parentNode.removeChild(shifts[0]);
            }
        };

        $scope.$watch('vm.timeFilter', function (newValue, oldValue) {
            countRows(newValue.start, newValue.end);
            angular.element($document[0]).ready(function () {
                drawEvents();
            });
        }, true);

        $scope.$watch('vm.dayFilter', function (newValue, oldValue) {
            angular.element($document[0]).ready(function () {
                drawEvents();
            });
        }, true);

        $scope.$watch('vm.events', function (newValue, oldValue) {
            events = uiShifterEvent.initEvents(vm.events);
            angular.element($document[0]).ready(function () {
                drawEvents();
            });
        }, true);

        /**
         * INIT
         */
        angular.element($document[0]).ready(function () {
            drawEvents();
        });

    }

})();

