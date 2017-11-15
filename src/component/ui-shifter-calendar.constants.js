/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .constant('$moment', moment)
        .constant('eventConst', {
            OPEN_HOUR: 'openHour',
            BOOKING: 'booking',
            SHIFT: 'shift'
        });
})();