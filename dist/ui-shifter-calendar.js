(function() {
'use strict';
(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar', []);

})();
angular.module('UI.Shifter.Calendar', ['src/templates/ui-shifter-calendar.tpl.html']);

angular.module('src/templates/ui-shifter-calendar.tpl.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('src/templates/ui-shifter-calendar.tpl.html',
    '<div class=ui-shifter-calendar><table id="{{vm.id + \'-Table\'}}" ng-class="[\'ui-shifter-calendar-week-wrapper\', {shadow: vm.shadow}]"><thead><tr><th></th><th ng-if=vm.dayFilter.mon>Monday</th><th ng-if=vm.dayFilter.tue>Tuesday</th><th ng-if=vm.dayFilter.wed>Wednesday</th><th ng-if=vm.dayFilter.thu>Thursday</th><th ng-if=vm.dayFilter.fri>Friday</th><th ng-if=vm.dayFilter.sat>Saturday</th><th ng-if=vm.dayFilter.sun>Sunday</th></tr><tr class=subhead><th></th><th ng-if=vm.dayFilter.mon>Team</th><th ng-if=vm.dayFilter.tue>Team</th><th ng-if=vm.dayFilter.wed>Team</th><th ng-if=vm.dayFilter.thu>Team</th><th ng-if=vm.dayFilter.fri>Team</th><th ng-if=vm.dayFilter.sat>Team</th><th ng-if=vm.dayFilter.sun>Team</th></tr></thead><tbody><tr class=first-half-hour ng-repeat-start="hour in vm.hours track by $index"><td id="{{vm.id + \'-\' + hour.time}}">{{hour.time}}</td><td id="{{vm.id + \'-\' + hour.time + \'-Monday\'}}" ng-if=vm.dayFilter.mon></td><td id="{{vm.id + \'-\' + hour.time + \'-Tuesday\'}}" ng-if=vm.dayFilter.tue></td><td id="{{vm.id + \'-\' + hour.time + \'-Wednesday\'}}" ng-if=vm.dayFilter.wed></td><td id="{{vm.id + \'-\' + hour.time + \'-Thursday\'}}" ng-if=vm.dayFilter.thu></td><td id="{{vm.id + \'-\' + hour.time + \'-Friday\'}}" ng-if=vm.dayFilter.fri></td><td id="{{vm.id + \'-\' + hour.time + \'-Saturday\'}}" ng-if=vm.dayFilter.sat></td><td id="{{vm.id + \'-\' + hour.time + \'-Sunday\'}}" ng-if=vm.dayFilter.sun></td></tr><tr class=second-half-hour ng-repeat-end><td>&nbsp;</td><td ng-if=vm.dayFilter.mon></td><td ng-if=vm.dayFilter.tue></td><td ng-if=vm.dayFilter.wed></td><td ng-if=vm.dayFilter.thu></td><td ng-if=vm.dayFilter.fri></td><td ng-if=vm.dayFilter.sat></td><td ng-if=vm.dayFilter.sun></td></tr></tbody></table></div>');
}]);

(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .factory('uiShifterCalendarEvent', ['$document', '$window', '$moment', 'eventConst', uiShiftCalendarEvent]);


    function uiShiftCalendarEvent($document, $window, $moment, eventConst) {
        var uiShiftCalendarEvent = {};

        /**
         * Main method of uiShiftCalendarEvent factory - it creates booking event and assign it to the DOM in proper
         * table cell.
         *
         * @param componentId
         * @param element
         * @param timeFilterStart
         */
        uiShiftCalendarEvent.createBooking = function (componentId, element, timeFilterStart) {
            var targetId = componentId + '-' + element.from.substring(0, 2) +':00-' + element.day,
                coordinates = getColumnCoordinates(componentId, element.day, element.from),
                newBooking = angular.element(
                '<div class="' + eventConst.BOOKING + '"><span>' + element.fraction + '<br>' +
                element.from + ' - ' + element.to + '</span></div>'
            );

            // set event's width and height
            var height = calculateHeight(calculateMinuteDiff(element.from, element.to), coordinates.height),
                width = calculateWidth(coordinates.width, element.fraction);

            if (height && !isNaN(height)) {
                newBooking[0].style.height = height + 'px';
            }

            if (width && !isNaN(width)) {
                newBooking[0].style.width = width + 'px';
            }

            // set event's top/left value
            var left = coordinates.left-1,
                top = coordinates.top;

            // set left offset (event position)
            if (!isNaN(left)) {
                left += calculateEventLeftOffset(element.position, element.fraction, coordinates.width);
                newBooking[0].style.left = left + 'px';
            }

            // top offset
            if (!isNaN(top)) {
                top += calculateTopOffset(element.from, coordinates.height);
                newBooking[0].style.top = top + 'px';
            }

            // append element to the DOM, check whether event is full (top part cutting)
            var target = $document[0].getElementById(targetId);
            if (target !== null) {
                angular.element(target).append(newBooking);
            } else {
                var recalculatedValues = cutEventTopPart(componentId, timeFilterStart, element);
                if (recalculatedValues.width !== 0 && recalculatedValues.height !== 0) {
                    newBooking[0].style.height = recalculatedValues.height + 'px';
                    newBooking[0].style.width = recalculatedValues.width + 'px';
                    top = recalculatedValues.coordinates.top;
                    newBooking[0].style.top = top + 'px';
                    left = recalculatedValues.coordinates.left-1;
                    left += calculateEventLeftOffset(
                        element.position,
                        element.fraction,
                        recalculatedValues.coordinates.width);
                    newBooking[0].style.left = left + 'px';

                    var newTarget = $document[0].getElementById(
                        componentId + '-' + timeFilterStart + '-' + element.day
                    );
                    angular.element(newTarget).append(newBooking);
                    newBooking.addClass('cutTop');
                }
            }

            // cut bottom border and shrink event in order to match time filter
            var heightDifference = cutEventBottomPart(componentId, newBooking[0].getBoundingClientRect());
            if (heightDifference > 0) {
                var indexOfPx = newBooking[0].style.height.indexOf('px');
                var currentHeight = parseInt(newBooking[0].style.height.substring(0, indexOfPx));
                newBooking[0].style.height = (currentHeight - heightDifference) + 'px';
                if (newBooking.hasClass('cutTop')) {
                    newBooking.removeClass('cutTop');
                    newBooking.addClass('cutTopAndBottom');
                } else {
                    newBooking.addClass('cutBottom');
                }
            }
        };

        // HELPERS ----------

        /**
         * It takes two parameters in format HH:mm. For example if you want to calculate time difference between 9:20am
         * and 1:00pm, you should convert those times to 09:20 and 13:00.
         *
         * Returns time difference in minutes.
         *
         * @param from
         * @param to
         * @returns {*|number}
         */
        function calculateMinuteDiff(from, to) {
            var hourFrom = from.substring(0, 2),
                minuteFrom = from.substring(3, 5),
                hourTo = to.substring(0, 2),
                minuteTo = to.substring(3, 5);

            var momentFrom = $moment({hour: hourFrom, minute: minuteFrom});
            var momentTo = $moment({hour: hourTo, minute: minuteTo});
            var timeDiff = momentTo.diff(momentFrom, 'minutes');

            return timeDiff;
        }

        /**
         * By default all events are attached to full hours, for example 9:20 Monday event booking will be assigned to
         * id-09:00-Monday table cell. In order to present offset on screen calculate relative space from 9:00 to 9:20
         * as table row height.
         *
         * Returns top offset from table cell (rounded and shrunk byc2), when there is time difference between given
         * time and full hour.
         *
         * @param timeFrom
         * @param colHeight
         * @returns {number}
         */
        function calculateTopOffset(timeFrom, colHeight) {
            var baseTime = timeFrom.substring(0, 2)+ ':00',
                diff = calculateMinuteDiff(baseTime, timeFrom),
                offset = 0;

            if (diff > 0) {
                var remainder = diff % 30,
                    halfHours = (diff - remainder) / 30,
                    relative = remainder / 30;
                offset = (colHeight * halfHours + Math.round((colHeight * relative) + 0.5)) - 1;
            }

            return offset;
        }

        /**
         * Calculate event height in pixels. It takes two parameters - time of event in minutes and current table
         * column height in order to calculate relative value.
         *
         * Returns event height (rounded and shrunk by default column padding).
         *
         * @param time
         * @param colHeight
         * @returns {number}
         */
        function calculateHeight(time, colHeight) {
            var remainder = time % 30,
                halfHours = (time-remainder) / 30,
                relative = remainder / 30;

            return (colHeight * halfHours + Math.round(colHeight * relative)) - 5;
        }

        /**
         * Calculate event width. Method takes two parameters - current column width and fraction of field in string
         * format, for example quarter of field - "1/4".
         *
         * Returns rounded width of booking shrunk by table cell padding.
         *
         * @param colWidth
         * @param fraction
         * @returns {number}
         */
        function calculateWidth(colWidth, fraction) {
            var parsedFraction = parseFraction(fraction),
                fractionValue = parsedFraction.numerator/parsedFraction.denominator;

            return (Math.round(colWidth * fractionValue)) - 5;
        }

        /**
         * Takes fraction as a string (for example '2/4') and returns parsed values as object with two fields.
         *
         * @param fraction
         * @returns {{numerator: Number, denominator: Number}}
         */
        function parseFraction(fraction) {
            var _numerator = parseInt(fraction.substring(0, 1)),
                _denominator = parseInt(fraction.substring(2, 3));

            return {
                numerator: _numerator,
                denominator: _denominator
            }
        }

        /**
         * Method takes three parameters - position of the event set by pack algorithm, fraction as a string and current
         * width of column. After parsing fraction it calculates the default virtual column width - for example 1/4 of
         * standard column. Returns offset from the left side as a number.
         *
         * When element is at the left side (position 0 it returns 0), if element is in second virtual column (position
         * 1 - it returns 1/4 of column).
         *
         * @param position
         * @param fraction
         * @param colWidth
         * @returns {number}
         */
        function calculateEventLeftOffset(position, fraction, colWidth) {
            var parsedFraction = parseFraction(fraction),
                fractionValue = 1/parsedFraction.denominator;

            return (Math.round(colWidth * fractionValue)) * position;
        }

        /**
         * Get basic table coordinates of desired cell. Main table id is required, since we can put many shift calendars
         * in one view/page. DOM ids of table cells are composed as: mainId-'hours':00-'day'. For example,
         * coordinates of 9:20 Monday booking of MyComponent(id) comes as follows: MyComponent-09:00-Monday.
         * This method returns object with absolute 'left' and 'top' values (compensated scroll value - due to boundary
         * implementation).
         *
         * @param day
         * @param hour
         * @returns {{left: number, top: number, width: number, height: number}}
         */
        function getColumnCoordinates(id, day, hour) {
            var col = $document[0].getElementById(id + '-' + hour.substring(0, 2) + ':00' + '-' + day);
            if (col !== null) {
                var boundingRectCol = col.getBoundingClientRect();
                var topCol = Math.round(boundingRectCol.top);
                var leftCol = Math.round(boundingRectCol.left);
                var widthCol = Math.round(boundingRectCol.width);
                var heightCol = Math.round(boundingRectCol.height);
            }

            return {
                left: $window.scrollX + leftCol + 3,
                top: $window.scrollY + topCol + 2,
                width: widthCol,
                height:  heightCol
            }
        }

        /**
         * Method takes one argument - id of table and returns bottom border position.
         * @param id
         * @returns {number}
         */
        function getTableBottomBorderPosition(id) {
            var table = $document[0].getElementById(id + '-Table');
            if (table !== null) {
                var boundingRect = table.getBoundingClientRect();
                var top = boundingRect.top;
                var height = boundingRect.height;
            }

            return Math.round($window.scrollY + top + height);
        }

        /**
         * This method checks bottom borders of table and given event. If necessary it calculates and returns height
         * difference which should be subtracted and handled in createEvent method in order to have time filter applied
         * and one clean event/table line.
         *
         * @param id
         * @param boundingClientRect
         * @returns {number}
         */
        function cutEventBottomPart(id, boundingClientRect) {
            var bottomTableBorder = getTableBottomBorderPosition(id),
                bottomEventBorder = boundingClientRect.top + $window.scrollY + boundingClientRect.height,
                diff = 0;

            if (bottomTableBorder < bottomEventBorder) {
                diff = bottomEventBorder - bottomTableBorder;
            }

            return diff;
        }

        /**
         * This method recalculates coordinates of table row (take first one row - chosen from time filter by user) if
         * necessary (check time difference between event start time/event end time and filter time start).
         *
         * @param componentId
         * @param timeFilterStart
         * @param event
         * @returns {{coordinates: *, height: number, width: number}}
         */
        function cutEventTopPart(componentId, timeFilterStart, event) {
            var recalculatedHeight = 0,
                recalculatedWidth = 0,
                newCoordinates = null;
            if (calculateMinuteDiff(timeFilterStart, event.from) < 0 &&
                calculateMinuteDiff(timeFilterStart, event.to) > 0) {
                newCoordinates = getColumnCoordinates(componentId, event.day, timeFilterStart);
                recalculatedHeight = calculateHeight(
                    calculateMinuteDiff(timeFilterStart, event.to),
                    newCoordinates.height
                );
                recalculatedWidth = calculateWidth(newCoordinates.width, event.fraction)
            }

            return {
                coordinates: newCoordinates,
                height: recalculatedHeight,
                width: recalculatedWidth
            };
        }

        // public factory methods
        return uiShiftCalendarEvent;

    }

})();
/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .constant('$moment', moment)
        .constant('eventConst', {
            BOOKING: 'booking'
        });
})();
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


(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .directive('uiShifterCalendar', uiShiftCalendarDirective);

    function link ($scope) {

    }

    function uiShiftCalendarDirective() {
        return {
            restrict: 'AE',
            templateUrl: 'src/templates/ui-shifter-calendar.tpl.html',
            controller: 'uiShifterCalendarCtrl',
            controllerAs: 'vm',
            scope: {
                id: '@',
                events: '=',
                timeFilter: '=',
                dayFilter: '=',
                shadow: '='
            },
            bindToController: true,
            link: link
        };
    }

})();
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
})();