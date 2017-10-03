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
    '<div class=ui-shifter-calendar><table class=ui-shifter-calendar-week-wrapper><thead><tr><th></th><th>Mon 10/2</th><th>Tue 10/3</th><th>Wed 10/4</th><th>Thu 10/5</th><th>Fri 10/6</th><th>Sat 10/7</th><th>Sun 10/1</th></tr><tr class=subhead><th>all-day</th><th>Team</th><th>Team</th><th>Team</th><th>Team</th><th>Team</th><th>Team</th><th>Team</th></tr></thead><tbody><tr class=half-hour><td>12am</td><td><div class=shift><span>Shift</span></div></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>1pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>2pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>3pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>4pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>5pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>6pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>7pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr class=half-hour><td>8pm</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div>');
}]);

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
            bindToController: true,
            link: link
        };
    }

})();
})();