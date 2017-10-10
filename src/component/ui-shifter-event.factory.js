(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .factory('uiShifterEvent', uiShifterEvent);


    function uiShifterEvent() {
        var uiShifterEvent = {};

        /**
         * Takes array as an argument and creates deep copy of it in order to sort events and preserve angular from
         * triggering infinite watcher loop (if vm.events from scope is used). Compares only days (converted to
         * numbers).
         *
         * @param events
         * @returns {*}
         */
        uiShifterEvent.initEvents = function (events) {
            //console.log('unsorted', events);
            var eventsToSort = angular.copy(events);

            eventsToSort.sort(function (a, b) {
                var aDay = convertDaysToNumbers(a.day),
                    bDay = convertDaysToNumbers(b.day);

                return aDay - bDay;
            });

            //console.log('sorted', eventsToSort);

            return eventsToSort;
        };

        /**
         * Helper method in order to optimise sort functionality. Takes string (day) as a parameter and converts it
         * to number as follows: 0-Monday, 1-Tuesday, 2-Wednesday, 3-Thursday, 4-Friday, 5-Saturday, 6-Sunday.
         *
         * @param day
         * @returns {number}
         */
        function convertDaysToNumbers(day) {
            var convertedDay = -1;
            switch(day) {
                case 'Monday':
                    convertedDay = 0;
                    break;
                case 'Tuesday':
                    convertedDay = 1;
                    break;
                case 'Wednesday':
                    convertedDay = 2;
                    break;
                case 'Thursday':
                    convertedDay = 3;
                    break;
                case 'Friday':
                    convertedDay = 4;
                    break;
                case 'Sunday':
                    convertedDay = 5;
                    break;
                case 'Saturday':
                    convertedDay = 6;
                    break;
            }

            return convertedDay;
        }

        // public factory methods
        return uiShifterEvent;

    }

})();