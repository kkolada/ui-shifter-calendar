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

            if (height && height !== NaN) {
                newBooking[0].style.height = height + 'px';
            }

            if (width && width !== NaN) {
                newBooking[0].style.width = width + 'px';
            }

            // set event's top/left value
            var left = coordinates.left-1,
                top = coordinates.top;

            // top offset
            top += calculateTopOffset(element.from, coordinates.height);

            newBooking[0].style.left = left + 'px';
            newBooking[0].style.top = top + 'px';

            // append element to the DOM, check whether event is full (top part cutting)
            var target = $document[0].getElementById(targetId);
            if (target !== null) {
                angular.element(target).append(newBooking);
            } else {
                var recalculatedValues = cutEventTopPart(componentId, timeFilterStart, element);
                newBooking[0].style.height = recalculatedValues.height + 'px';
                newBooking[0].style.width = recalculatedValues.width + 'px';
                newBooking[0].style.top = top + 'px';
                var newTarget = $document[0].getElementById(componentId + '-' + timeFilterStart + '-' + element.day);
                angular.element(newTarget).append(newBooking);
                newBooking.addClass('cutTop');
            }

            // cut bottom border and shrink event in order to match time filter
            var heightDifference = cutEventBottomPart(componentId, newBooking[0].getBoundingClientRect());
            if (heightDifference > 0) {
                var indexOfPx = newBooking[0].style.height.indexOf('px');
                var currentHeight = parseInt(newBooking[0].style.height.substring(0, indexOfPx));
                newBooking[0].style.height = (currentHeight - heightDifference) + 'px';
                newBooking.addClass('cutBottom');
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
         * Returns top offset from table cell (rounded and shrunk by  ), when there is time difference between given time and full hour.
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
                var remainder = diff%30,
                    halfHours = (diff-remainder)/30,
                    relative = remainder/30;
                offset = (colHeight*halfHours + Math.round(colHeight*relative+0.5))-2;
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
            var remainder = time%30,
                halfHours = (time-remainder)/30,
                relative = remainder/30;

            return (colHeight*halfHours + Math.round(colHeight*relative+0.5))-5;
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
            var numerator = parseInt(fraction.substring(0, 1)),
                denominator = parseInt(fraction.substring(2, 3)),
                fractionValue = numerator/denominator;

            return (Math.round(colWidth*fractionValue))-5;
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
         * necessary (check time difference between event start time and filter time start).
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
            if (calculateMinuteDiff(timeFilterStart, event.from) < 0) {
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