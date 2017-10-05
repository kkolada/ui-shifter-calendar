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
    '<div class=ui-shifter-calendar><table ng-class="[\'ui-shifter-calendar-week-wrapper\', {shadow: vm.shadow}]"><thead><tr><th></th><th ng-if=vm.dayFilter.mon>Monday</th><th ng-if=vm.dayFilter.tue>Tuesday</th><th ng-if=vm.dayFilter.wed>Wednesday</th><th ng-if=vm.dayFilter.thu>Thursday</th><th ng-if=vm.dayFilter.fri>Friday</th><th ng-if=vm.dayFilter.sat>Saturday</th><th ng-if=vm.dayFilter.sun>Sunday</th></tr><tr class=subhead><th></th><th ng-if=vm.dayFilter.mon>Team</th><th ng-if=vm.dayFilter.tue>Team</th><th ng-if=vm.dayFilter.wed>Team</th><th ng-if=vm.dayFilter.thu>Team</th><th ng-if=vm.dayFilter.fri>Team</th><th ng-if=vm.dayFilter.sat>Team</th><th ng-if=vm.dayFilter.sun>Team</th></tr></thead><tbody><tr class=first-half-hour ng-repeat-start="hour in vm.hours track by $index"><td id="{{vm.id + \'-\' + hour.time}}">{{hour.time}}</td><td id="{{vm.id + \'-\' + hour.time + \'-Monday\'}}" ng-if=vm.dayFilter.mon></td><td id="{{vm.id + \'-\' + hour.time + \'-Tuesday\'}}" ng-if=vm.dayFilter.tue></td><td id="{{vm.id + \'-\' + hour.time + \'-Wednesday\'}}" ng-if=vm.dayFilter.wed></td><td id="{{vm.id + \'-\' + hour.time + \'-Thursday\'}}" ng-if=vm.dayFilter.thu></td><td id="{{vm.id + \'-\' + hour.time + \'-Friday\'}}" ng-if=vm.dayFilter.fri></td><td id="{{vm.id + \'-\' + hour.time + \'-Saturday\'}}" ng-if=vm.dayFilter.sat></td><td id="{{vm.id + \'-\' + hour.time + \'-Sunday\'}}" ng-if=vm.dayFilter.sun></td></tr><tr class=second-half-hour ng-repeat-end><td>&nbsp;</td><td ng-if=vm.dayFilter.mon></td><td ng-if=vm.dayFilter.tue></td><td ng-if=vm.dayFilter.wed></td><td ng-if=vm.dayFilter.thu></td><td ng-if=vm.dayFilter.fri></td><td ng-if=vm.dayFilter.sat></td><td ng-if=vm.dayFilter.sun></td></tr></tbody></table></div>');
}]);

(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .controller('uiShifterCalendarCtrl', ['$scope', '$document', '$window', 'uiShifterCalendarEvent',
            uiShifterCalendarCtrl]);

    function uiShifterCalendarCtrl($scope, $document, $window, uiShifterCalendarEvent) {
        var vm = this;
        vm.hours = [];

        var countRows = function (startTime, endTime) {
            var newHours = [];
            for (var i = startTime; i <= endTime; i++) {
                newHours.push({
                    time: moment({ hour: i, minute: 0 }).format("HH:mm")
                });
            }
            vm.hours = newHours;
        };

        var drawEvents = function () {
            //console.log('drawing events', vm.events);
            clearAllEvents();
            vm.events.forEach(function(element) {
                uiShifterCalendarEvent.createEvent(
                    vm.id + '-' + element.from.substring(0, 2) +':00-' + element.day,
                    element,
                    getColumnCoordinates(element.day, element.from)
                );
            });
        };

        var clearAllEvents = function () {
            var shifts = $document[0].getElementsByClassName('shift');

            while(shifts.length > 0){
                shifts[0].parentNode.removeChild(shifts[0]);
            }
        };

        var getColumnCoordinates = function (day, hour) {
            var col = $document[0].getElementById(vm.id + '-' + hour.substring(0, 2) + ':00' + '-' + day);
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
        .factory('uiShifterCalendarEvent', ['$document', uiShiftCalendarEvent]);


    function uiShiftCalendarEvent($document) {
        var uiShiftCalendarEvent = {};

        uiShiftCalendarEvent.createEvent = function (targetId, element, coordinates) {
            //console.log('create event', element.from, element.to, element.day);
            var newEvent = angular.element(
                '<div class="shift"><span>' + element.fraction + '<br>' +
                element.from + '<br>' + element.to + '</span></div>'
            );

            // set event's width and height
            var height = calculateHeight(calculateMinuteDiff(element.from, element.to), coordinates.height),
                width = calculateWidth(coordinates.width, element.fraction);

            if (height && height !== NaN) {
                newEvent[0].style.height = height + 'px';
            }

            if (width && width !== NaN) {
                newEvent[0].style.width = width + 'px';
            }

            // set event's top/left value
            var left = coordinates.left,
                top = coordinates.top;

            // top offset
            top += calculateTopOffset(element.from, coordinates.height);

            newEvent[0].style.top = left + 'px';
            newEvent[0].style.top = top + 'px';

            var target = $document[0].getElementById(targetId);
            angular.element(target).append(newEvent);
        };

        function calculateMinuteDiff(from, to) {
            var hourFrom = from.substring(0, 2),
                minuteFrom = from.substring(3, 5),
                hourTo = to.substring(0, 2),
                minuteTo = to.substring(3, 5);

            var momentFrom = moment({hour: hourFrom, minute: minuteFrom});
            var momentTo = moment({hour: hourTo, minute: minuteTo});
            var timeDiff = momentTo.diff(momentFrom, 'minutes');

            return timeDiff;
        }

        function calculateTopOffset(timeFrom, colHeight) {
            var baseTime = timeFrom.substring(0, 2)+ ':00',
                diff = calculateMinuteDiff(baseTime, timeFrom),
                offset = 0;

            if (diff > 0) {
                var remainder = diff%30,
                    halfHours = (diff-remainder)/30,
                    relative = remainder/30;
                offset = (colHeight*halfHours + Math.round(colHeight*relative))-2;
            }

            return offset;
        }

        function calculateHeight(time, colHeight) {
            var remainder = time%30,
                halfHours = (time-remainder)/30,
                relative = remainder/30;

            return (colHeight*halfHours + Math.round(colHeight*relative))-4;
        }

        function calculateWidth(colWidth, fraction) {
            var numerator = parseInt(fraction.substring(0, 1)),
                denominator = parseInt(fraction.substring(2, 3)),
                fractionValue = numerator/denominator;

            return (Math.round(colWidth*fractionValue))-5;
        }

        return uiShiftCalendarEvent;
    }

})();
})();