/**
 * UI Shifter Calendar Showcase
 */
var shifterCalendarShowcaseApp = angular.module('shifterCalendarShowcaseApp', ['UI.Shifter.Calendar']);

shifterCalendarShowcaseApp.controller('ShowcaseCtrl', function($scope) {

    $scope.momentJsDate = moment().format('MMMM Do YYYY, HH:mm:ss');
    $scope.data = {
        availableHours: [
            {t:0}, {t:1}, {t:2}, {t:3}, {t:4}, {t:5}, {t:6}, {t:7}, {t:8}, {t:9}, {t:10}, {t:11}, {t:12},
            {t:13}, {t:14}, {t:15}, {t:16}, {t:17}, {t:18}, {t:19}, {t:20}, {t:21}, {t:22}, {t:23}, {t:24}
            ],
        startTime: {t:0},
        endTime: {t:15},
        availableDays: [
            {d:'Monday'}, {d:'Tuesday'}, {d:'Wednesday'}, {d:'Thursday'}, {d:'Friday'}, {d:'Saturday'}, {d:'Sunday'}
        ],
        daySelected: {d:'Monday'},
        availableTypes: [
            {t:'booking'}, {t:'openHour'}, {t:'shift'}
        ],
        typeSelected: {t:'booking'}
    };
    $scope.checkboxModel = {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true
    };
    $scope.activateWorkingDays = function () {
        $scope.checkboxModel.mon = true;
        $scope.checkboxModel.tue = true;
        $scope.checkboxModel.wed = true;
        $scope.checkboxModel.thu = true;
        $scope.checkboxModel.fri = true;
        $scope.checkboxModel.sat = false;
        $scope.checkboxModel.sun = false;
    };
    $scope.activateWeekend = function () {
        $scope.checkboxModel.mon = false;
        $scope.checkboxModel.tue = false;
        $scope.checkboxModel.wed = false;
        $scope.checkboxModel.thu = false;
        $scope.checkboxModel.fri = false;
        $scope.checkboxModel.sat = true;
        $scope.checkboxModel.sun = true;
    };
    $scope.teams = [
        'TeamA', 'TeamB'
    ];
    $scope.events = [
        {
            day: 'Monday',
            from: '03:00',
            to: '05:00',
            fraction: '2/4',
            position: 0,
            type: 'shift',
            team: 'TeamA'
        },
        {
            day: 'Tuesday',
            from: '01:00',
            to: '12:00',
            fraction: '1/1',
            position: 0,
            type: 'openHour',
            team: 'TeamA'
        },
        {
            day: 'Wednesday',
            from: '05:00',
            to: '10:00',
            fraction: '1/1',
            position: 0,
            type: 'openHour',
            team: 'TeamA'
        },
        {
            day: 'Thursday',
            from: '05:00',
            to: '09:00',
            fraction: '1/1',
            position: 0,
            type: 'openHour',
            team: 'TeamA'
        },
        {
            day: 'Friday',
            from: '01:00',
            to: '04:00',
            fraction: '1/1',
            position: 0,
            type: 'openHour',
            team: 'TeamA'
        },
        {
            day: 'Saturday',
            from: '01:00',
            to: '07:00',
            fraction: '1/1',
            position: 0,
            type: 'openHour',
            team: 'TeamA'
        },
        {
            day: 'Sunday',
            from: '04:00',
            to: '13:00',
            fraction: '1/1',
            position: 0,
            type: 'openHour',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '03:00',
            to: '05:00',
            fraction: '2/4',
            position: 0,
            type: 'shift',
            team: 'TeamB'
        },
        {
            day: 'Monday',
            from: '02:00',
            to: '06:00',
            fraction: '1/2',
            position: 0,
            type: 'openHour',
            team: 'TeamB'
        },
        {
            day: 'Monday',
            from: '05:30',
            to: '06:00',
            fraction: '1/1',
            position: 0,
            type: 'shift',
            team: 'TeamA'
        },
        {
            day: 'Tuesday',
            from: '10:00',
            to: '11:45',
            fraction: '1/2',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Tuesday',
            from: '05:20',
            to: '10:45',
            fraction: '3/4',
            position: 1,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '05:10',
            to: '07:45',
            fraction: '1/4',
            position: 1,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Wednesday',
            from: '07:13',
            to: '07:28',
            fraction: '5/8',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '05:00',
            to: '06:30',
            fraction: '1/4',
            position: 3,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Friday',
            from: '02:00',
            to: '03:15',
            fraction: '7/8',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '03:15',
            to: '07:00',
            fraction: '1/4',
            position: 2,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Sunday',
            from: '04:55',
            to: '11:45',
            fraction: '2/8',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '05:00',
            to: '09:00',
            fraction: '1/4',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Thursday',
            from: '07:00',
            to: '07:15',
            fraction: '3/8',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '08:30',
            to: '10:00',
            fraction: '3/4',
            position: 1,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '02:00',
            to: '03:00',
            fraction: '2/3',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '09:00',
            to: '11:00',
            fraction: '1/4',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Saturday',
            from: '03:00',
            to: '04:00',
            fraction: '1/3',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Saturday',
            from: '05:00',
            to: '06:00',
            fraction: '1/3',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Saturday',
            from: '04:00',
            to: '05:00',
            fraction: '1/4',
            position: 0,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Saturday',
            from: '03:00',
            to: '06:00',
            fraction: '2/3',
            position: 1,
            type: 'booking',
            team: 'TeamA'
        },
        {
            day: 'Monday',
            from: '01:00',
            to: '16:00',
            fraction: '1/1',
            position: 0,
            type: 'openHour',
            team: 'TeamA'
        }
    ];
    $scope.addNewEvent = function() {
        $scope.events.push({
            day: $scope.data.daySelected.d,
            from: $scope.eventStartTime,
            to: $scope.eventEndTime,
            fraction: $scope.eventFraction,
            position: $scope.position,
            type: $scope.data.typeSelected.t,
            team: $scope.teamName
        });
    };

    $scope.addNewTeam = function() {
        $scope.teams.push($scope.newTeamName);
    };

    $scope.deleteTeam = function(team) {
        var index = $scope.teams.indexOf(team);
        if (index > -1) {
            $scope.teams.splice(index, 1);
        }
    };

    /**
     * INIT
     */
    setTimeout(function() {
        $scope.$broadcast('UI.Shifter.Calendar:repaint');
    }, 2000);

});
/* EOF */