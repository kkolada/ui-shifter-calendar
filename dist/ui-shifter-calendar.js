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
    '<div class=ui-shifter-calendar><table id="{{vm.id + \'-Table\'}}" ng-class="[\'ui-shifter-calendar-week-wrapper\', {shadow: vm.shadow}]"><thead><tr><th></th><th ng-if=vm.dayFilter.mon colspan={{vm.teams.length}}>Monday</th><th ng-if=vm.dayFilter.tue colspan={{vm.teams.length}}>Tuesday</th><th ng-if=vm.dayFilter.wed colspan={{vm.teams.length}}>Wednesday</th><th ng-if=vm.dayFilter.thu colspan={{vm.teams.length}}>Thursday</th><th ng-if=vm.dayFilter.fri colspan={{vm.teams.length}}>Friday</th><th ng-if=vm.dayFilter.sat colspan={{vm.teams.length}}>Saturday</th><th ng-if=vm.dayFilter.sun colspan={{vm.teams.length}}>Sunday</th></tr><tr class=subhead><th></th><th ng-if=vm.dayFilter.mon ng-repeat="team in vm.teams">{{team}}</th><th ng-if=vm.dayFilter.tue ng-repeat="team in vm.teams">{{team}}</th><th ng-if=vm.dayFilter.wed ng-repeat="team in vm.teams">{{team}}</th><th ng-if=vm.dayFilter.thu ng-repeat="team in vm.teams">{{team}}</th><th ng-if=vm.dayFilter.fri ng-repeat="team in vm.teams">{{team}}</th><th ng-if=vm.dayFilter.sat ng-repeat="team in vm.teams">{{team}}</th><th ng-if=vm.dayFilter.sun ng-repeat="team in vm.teams">{{team}}</th></tr></thead><tbody><tr class=first-half-hour ng-repeat-start="hour in vm.hours track by $index"><td id="{{vm.id + \'-\' + hour.time}}">{{hour.time}}</td><td id="{{vm.id + \'-\' + hour.time + \'-Monday-\' + team}}" ng-if=vm.dayFilter.mon ng-repeat="team in vm.teams"></td><td id="{{vm.id + \'-\' + hour.time + \'-Tuesday-\' + team}}" ng-if=vm.dayFilter.tue ng-repeat="team in vm.teams"></td><td id="{{vm.id + \'-\' + hour.time + \'-Wednesday-\' + team}}" ng-if=vm.dayFilter.wed ng-repeat="team in vm.teams"></td><td id="{{vm.id + \'-\' + hour.time + \'-Thursday-\' + team}}" ng-if=vm.dayFilter.thu ng-repeat="team in vm.teams"></td><td id="{{vm.id + \'-\' + hour.time + \'-Friday-\' + team}}" ng-if=vm.dayFilter.fri ng-repeat="team in vm.teams"></td><td id="{{vm.id + \'-\' + hour.time + \'-Saturday-\' + team}}" ng-if=vm.dayFilter.sat ng-repeat="team in vm.teams"></td><td id="{{vm.id + \'-\' + hour.time + \'-Sunday-\' + team}}" ng-if=vm.dayFilter.sun ng-repeat="team in vm.teams"></td></tr><tr class=second-half-hour ng-repeat-end><td>&nbsp;</td><td ng-if=vm.dayFilter.mon ng-repeat="team in vm.teams"></td><td ng-if=vm.dayFilter.tue ng-repeat="team in vm.teams"></td><td ng-if=vm.dayFilter.wed ng-repeat="team in vm.teams"></td><td ng-if=vm.dayFilter.thu ng-repeat="team in vm.teams"></td><td ng-if=vm.dayFilter.fri ng-repeat="team in vm.teams"></td><td ng-if=vm.dayFilter.sat ng-repeat="team in vm.teams"></td><td ng-if=vm.dayFilter.sun ng-repeat="team in vm.teams"></td></tr></tbody></table></div>');
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
            var targetId = componentId + '-' + element.from.substring(0, 2) +':00-' + element.day + '-' + element.team,
                coordinates = getColumnCoordinates(componentId, element.day, element.team, element.from),
                eventClass = getEventClass(element.type),
                newBooking = angular.element(
                '<div class="event ' + eventClass + '"><div>' + element.fraction + '<br>' +
                element.from + ' - ' + element.to + '</div></div>'
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
                        componentId + '-' + timeFilterStart + '-' + element.day + '-' + element.team
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
         * Returns top offset from table cell (rounded and shrunk), when there is time difference between given
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
        function getColumnCoordinates(id, day, team, hour) {
            var col = $document[0].getElementById(id + '-' + hour.substring(0, 2) + ':00' + '-' + day + '-' + team);

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
                newCoordinates = getColumnCoordinates(componentId, event.day, event.team, timeFilterStart);
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

        function getEventClass(type) {
            var eventClass = '';
            switch(type) {
                case eventConst.OPEN_HOUR:
                    eventClass = 'oh';
                    break;
                case eventConst.BOOKING:
                    eventClass = 'booking';
                    break;
                case eventConst.SHIFT:
                    eventClass = 'shift';
                    break;
                default:
                    break;
            }

            return eventClass;
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
            EVENT_CLASS: 'event',
            OPEN_HOUR: 'openHour',
            BOOKING: 'booking',
            SHIFT: 'shift',
            REPAINT_EVENTS: 'UI.Shifter.Calendar:repaint'
        });
})();
(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .controller('uiShifterCalendarCtrl', ['$scope', '$document', '$moment', 'eventConst', 'uiShifterEvent',
            'uiShifterCalendarEvent', '$window', uiShifterCalendarCtrl]);

    function uiShifterCalendarCtrl($scope, $document, $moment, eventConst, uiShifterEvent, uiShifterCalendarEvent,
                                   $window) {
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
            var shifts = $document[0].getElementsByClassName(eventConst.EVENT_CLASS);

            while(shifts.length > 0){
                shifts[0].parentNode.removeChild(shifts[0]);
            }
        };

        $scope.$watch('vm.timeFilter', function (newValue, oldValue) {
            countRows(newValue.start, newValue.end);
            redrawEvents();
        }, true);

        $scope.$watch('vm.dayFilter', function (newValue, oldValue) {
            redrawEvents();
        }, true);

        $scope.$watch('vm.teams', function (newValue, oldValue) {
            redrawEvents();
        }, true);

        $scope.$watch('vm.events', function (newValue, oldValue) {
            events = uiShifterEvent.sortEvents(vm.events);
            redrawEvents();
        }, true);

        // wait till table will be rendered and draw all events
        var redrawEvents = function () {
            angular.element($document[0]).ready(function () {
                drawEvents();
            });
        };

        // handle resize event
        angular.element($window).bind('resize', function () {
            drawEvents();
        });

        $scope.$on(eventConst.REPAINT_EVENTS, function() {
            redrawEvents();
        });

    }

})();


(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .directive('uiShifterCalendar', uiShiftCalendarDirective);

    function uiShiftCalendarDirective() {
        return {
            restrict: 'AE',
            templateUrl: 'src/templates/ui-shifter-calendar.tpl.html',
            controller: 'uiShifterCalendarCtrl',
            controllerAs: 'vm',
            scope: {
                id: '@',
                events: '=',
                teams: '=',
                timeFilter: '=',
                dayFilter: '=',
                shadow: '='
            },
            bindToController: true
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
})();