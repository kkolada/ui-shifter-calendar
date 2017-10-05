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