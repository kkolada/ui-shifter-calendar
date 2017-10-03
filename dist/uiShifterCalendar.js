angular.module('UI.Shifter.Calendar', []);
angular.module('UI.Shifter.Calendar', ['src/templates/ui-shifter-calendar.tpl.html']);

angular.module('src/templates/ui-shifter-calendar.tpl.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('src/templates/ui-shifter-calendar.tpl.html',
    '<div>Template test.</div>');
}]);


angular.module('UI.Shifter.Calendar').directive('uiShifterCalendar', function() {
    return {
        restrict: 'AE',
        templateUrl: 'src/templates/ui-shifter-calendar.tpl.html'
    };
});