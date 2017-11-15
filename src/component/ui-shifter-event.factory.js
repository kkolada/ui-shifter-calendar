(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .factory('uiShifterEvent', uiShifterEvent);


    function uiShifterEvent() {
        var uiShifterEvent = {};

        /**
         * Takes array as an argument and creates deep copy of it in order to sort events and preserve angular from
         * triggering infinite watcher loop (if vm.events from scope is used).
         *
         * @param events
         * @returns {*}
         */
        uiShifterEvent.sortEvents = function (events) {
            var eventsToSort = angular.copy(events);

            // sort array by events' types and days
            eventsToSort.sort(function (a, b) {
                var dayDiff = compareHelperFn(convertDaysToNumbers(a.day), convertDaysToNumbers(b.day)),
                    typeDiff = compareHelperFn(convertEventTypesToNumbers(a.type), convertEventTypesToNumbers(b.type));

                return typeDiff == 0 ? dayDiff : typeDiff;
            });

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
                case 'Saturday':
                    convertedDay = 5;
                    break;
                case 'Sunday':
                    convertedDay = 6;
                    break;
            }

            return convertedDay;
        }

        /**
         * Helper method for sort functionality. Takes string (eventType) as a parameter and converts it to number as
         * follows: 0-openHour, 1-booking, 2-shift.
         *
         * @param eventType
         * @returns {number}
         */
        function convertEventTypesToNumbers(eventType) {
            var convertedEventType = -1;
            switch(eventType) {
                case 'openHour':
                    convertedEventType = 0;
                    break;
                case 'booking':
                    convertedEventType = 1;
                    break;
                case 'shift':
                    convertedEventType = 2;
                    break;
                default:
                    break;
            }

            return convertedEventType;
        }

        /**
         * Helper function in order to check position of event.
         *
         * @param left
         * @param right
         * @returns {number}
         */
        function compareHelperFn(left, right) {
            return left - right;
        }

        // public factory methods
        return uiShifterEvent;

    }

})();