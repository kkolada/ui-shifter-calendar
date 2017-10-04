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
    '<div class=ui-shifter-calendar><table ng-class="[\'ui-shifter-calendar-week-wrapper\', {shadow: vm.shadow}]"><thead><tr><th></th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th><th>Sunday</th></tr><tr class=subhead><th></th><th>Team</th><th>Team</th><th>Team</th><th>Team</th><th>Team</th><th>Team</th><th>Team</th></tr></thead><tbody><tr class=first-half-hour ng-repeat-start="hour in vm.hours track by $index"><td>{{hour.time}}</td><td><div ng-if="$index === 0" class=shift><span>Shift</span></div></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=second-half-hour ng-repeat-end><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div>');
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
                shadow: '='
            },
            bindToController: true,
            link: link
        };
    }

})();
})();