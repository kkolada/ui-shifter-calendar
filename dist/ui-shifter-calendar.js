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
    '<div class=ui-shifter-calendar><table ng-class="[\'ui-shifter-calendar-week-wrapper\', {shadow: vm.shadow}]"><thead><tr><th></th><th ng-if=vm.dayFilter.mon>Monday</th><th ng-if=vm.dayFilter.tue>Tuesday</th><th ng-if=vm.dayFilter.wed>Wednesday</th><th ng-if=vm.dayFilter.thu>Thursday</th><th ng-if=vm.dayFilter.fri>Friday</th><th ng-if=vm.dayFilter.sat>Saturday</th><th ng-if=vm.dayFilter.sun>Sunday</th></tr><tr class=subhead><th></th><th ng-if=vm.dayFilter.mon>Team</th><th ng-if=vm.dayFilter.tue>Team</th><th ng-if=vm.dayFilter.wed>Team</th><th ng-if=vm.dayFilter.thu>Team</th><th ng-if=vm.dayFilter.fri>Team</th><th ng-if=vm.dayFilter.sat>Team</th><th ng-if=vm.dayFilter.sun>Team</th></tr></thead><tbody><tr class=first-half-hour ng-repeat-start="hour in vm.hours track by $index"><td>{{hour.time}}</td><td ng-if=vm.dayFilter.mon><div ng-if="$index === 0" class=shift><span>Shift</span></div></td><td ng-if=vm.dayFilter.tue></td><td ng-if=vm.dayFilter.wed></td><td ng-if=vm.dayFilter.thu></td><td ng-if=vm.dayFilter.fri></td><td ng-if=vm.dayFilter.sat></td><td ng-if=vm.dayFilter.sun></td></tr><tr class=second-half-hour ng-repeat-end><td>&nbsp;</td><td ng-if=vm.dayFilter.mon></td><td ng-if=vm.dayFilter.tue></td><td ng-if=vm.dayFilter.wed></td><td ng-if=vm.dayFilter.thu></td><td ng-if=vm.dayFilter.fri></td><td ng-if=vm.dayFilter.sat></td><td ng-if=vm.dayFilter.sun></td></tr></tbody></table></div>');
}]);

(function() {
    'use strict';

    angular
        .module('UI.Shifter.Calendar')
        .controller('uiShifterCalendarCtrl', ['$scope', uiShifterCalendarCtrl]);

    function uiShifterCalendarCtrl($scope) {
        var vm = this;
        vm.hours = [];

        var countRows = function(startTime, endTime) {
            var newHours = [];
            for (var i = startTime; i <= endTime; i++) {
                newHours.push({
                    time: moment({ hour: i, minute: 0 }).format("HH:mm")
                });
            }
            vm.hours = newHours;
        };

        $scope.$watch('vm.timeFilter', function (newValue, oldValue) {
            countRows(newValue.start, newValue.end);
        }, true);

        $scope.$watch('vm.dayFilter', function (newValue, oldValue) {
        }, true);

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
                timeFilter: '=',
                dayFilter: '=',
                shadow: '='
            },
            bindToController: true,
            link: link
        };
    }

})();
})();