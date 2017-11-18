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
            BOOKING_TRANSFERRED: 'booking-transferred',
            REPAINT_EVENTS: 'UI.Shifter.Calendar:repaint'
        });
})();