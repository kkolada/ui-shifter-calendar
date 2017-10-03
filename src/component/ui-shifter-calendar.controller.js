(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .controller('uiShifterCalendarCtrl', ['$scope', uiShifterCalendarCtrl]);

    function uiShifterCalendarCtrl($scope) {
        var vm = this;
        vm.test = 'variable';
    }

})();

