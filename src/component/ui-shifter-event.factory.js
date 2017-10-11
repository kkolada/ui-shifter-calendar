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
            var eventsToSort = angular.copy(events);

            // set unique id and default position for each event
            eventsToSort.forEach(function (element) {
                element.position = 0;
                element.uuid = uuidv4();
            });

            // sort array
            eventsToSort.sort(function (a, b) {
                var aDay = convertDaysToNumbers(a.day),
                    bDay = convertDaysToNumbers(b.day);

                return aDay - bDay;
            });

            // find best places for events
            eventsToSort = resolveEventPositions(eventsToSort);

            return eventsToSort;
        };

        /**
         * Handle 'resolving logic': separate array by days, calculate events positions and merge results.
         *
         * @param events
         * @returns {Array}
         */
        function resolveEventPositions(events) {
            var dayEvents = splitArrayByDays(events),
                eventsArr = null;

            dayEvents.forEach(function (dayEventArr) {
                eventsArr = new Array(24);
                dayEventArr.forEach(function (element) {
                    var event = {
                        time: {
                            from: {
                                hour: parseInt(element.from.substring(0, 2)),
                                minute: parseInt(element.from.substring(3, 5))
                            },
                            to: {
                                hour: parseInt(element.to.substring(0, 2)),
                                minute: parseInt(element.to.substring(3, 5))
                            }
                        },
                        event: element,
                        maxColumns: parseInt(element.fraction.substring(2, 3)),
                        eventLength: parseInt(element.fraction.substring(0, 1))
                    };

                    var position = 0;
                    while (isPositionOccupied(eventsArr, event.time, position, event.eventLength)) {
                        position++;
                    }

                    putEventIntoArray(eventsArr, event, position);
                });

                debugPrintTab(eventsArr);
                assignEventPositions(dayEventArr, eventsArr);
            });

            return mergeArraysOfDays(dayEvents);
        }

        /**
         * Produces array of arrays' events.
         *
         * @param events
         */
        function splitArrayByDays(events) {
            var dayEvents = [];

            events.forEach(function (event) {
                var dayNumber = convertDaysToNumbers(event.day);

                if (!dayEvents[dayNumber]) {
                    dayEvents[dayNumber] = [];
                }

                dayEvents[dayNumber].push(event);
            });

            return dayEvents;
        }

        /**
         * Consolidate all events into one array.
         *
         * @param dayEvents
         */
        function mergeArraysOfDays(dayEvents) {
            var allEvents = [];

            dayEvents.forEach(function (dayEventArr) {
                dayEventArr.forEach(function (event) {
                    allEvents.push(event);
                });
            });

            return allEvents;
        }

        /**
         * Method takes four parameters - actual events array, time frame (from and to), position and length of event.
         * Length of event is determined by fraction. For example we have event from 9:00 to 10:00, which has
         * 1/4 fraction, and suitable row in array, so it will look like this:
         *
         * | - | - | - | - |, where
         *
         * '-' free space in array.
         *
         * In order to check if position is free, there is iteration through time frames, but we are checking row with
         * full hours (10:00) only if there are some minutes past. If there is some event already on that position
         * method returns true, else after iterating all cells method returns false (position is free like depicted
         * above).
         *
         * @param eventsArr
         * @param time
         * @param position
         * @param length
         * @returns {boolean}
         */
        function isPositionOccupied(eventsArr, time, position, length) {
            var occupied = false,
                fromCounter = time.from.hour,
                toCounter = time.to.hour;

            if (time.to.minute === 0) {
                toCounter--;
            }

            for (var i = fromCounter; i <= toCounter; i++) {
                if (eventsArr[i]) {
                    for(var j = position; j < position + length; j++) {
                        if (eventsArr[i][j] && eventsArr[i][j].event) {
                            occupied = true;
                            break;
                        }
                    }
                }

                if (occupied) {
                    break;
                }
            }

            return occupied;
        }

        /**
         * Method takes events array, event source and position. Before event will be bound to cells, there is
         * important condition, which checks if events array has two-dimensional array value already assigned.
         * If not - creates new array with fraction denominator value (max columns value). For example we have event
         * from 9:00 to 10:00, which has 1/4 fraction and position 0 (and of course - suitable row in array). The final
         * result will look like this:
         *
         * | X | - | - | - |, where
         *
         * 'X' - event,
         * '-' free space in array.
         *
         *
         * @param eventsArr
         * @param event
         * @param position
         */
        function putEventIntoArray(eventsArr, event, position) {
            for (var i = event.time.from.hour; i <= event.time.to.hour; i++) {
                for (var j = position; j < position + event.eventLength; j++) {
                    if (i === event.time.to.hour && event.time.to.minute > 0) {
                        if (!eventsArr[i]) {
                            eventsArr[i] = new Array(event.maxColumns);
                        }
                        eventsArr[i][j] = event;
                    } else if (i < event.time.to.hour) {
                        if (!eventsArr[i]) {
                            eventsArr[i] = new Array(event.maxColumns);
                        }
                        eventsArr[i][j] = event;
                    }
                }
            }
        }

        /**
         * This method determines what is actual position of event. First occurence of UUID is considered as basic
         * event position. Returns array of (uuid: position) pairs.
         *
         * @param eventsArr
         * @returns {Array}
         */
        function createEventPositionsArray(eventsArr) {
            var uuidArray = [];

            for (var i = 0; i < eventsArr.length; i++) {
                if (eventsArr[i]) {
                    for (var j = 0; j < eventsArr[i].length; j++) {
                        if (eventsArr[i][j]) {
                            if (uuidArray[eventsArr[i][j].event.uuid] === undefined) {
                                uuidArray[eventsArr[i][j].event.uuid] = j;
                            }
                        }
                    }
                }
            }

            return uuidArray;
        }

        /**
         * This method rewrites calculated positions of events.
         *
         * @param events
         * @param eventsArr
         */
        function assignEventPositions(events, eventsArr) {
            var uuidArray = createEventPositionsArray(eventsArr);

            events.forEach(function (element) {
                element.position = uuidArray[element.uuid];
            });
        }

        /**
         * Debug method, draw simple event table. Delete after final algorithm implementation.
         * @param eventsArr
         */
        function debugPrintTab(eventsArr) {
            var print = '';

            for (var i = 0; i < eventsArr.length; i++) {
                if (eventsArr[i]) {
                    var printLine = '';
                    for (var j = 0; j < eventsArr[i].length; j++) {
                        if (eventsArr[i][j]) {
                            printLine += '| X ';
                        } else {
                            printLine += '| - ';
                        }
                    }
                    print += printLine + '|\n';
                }
            }

            console.log(print);
        }

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

        /**
         * Helper method which returns universally unique identifier.
         *
         * @returns {string}
         */
        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // public factory methods
        return uiShifterEvent;

    }

})();