/*globals dashboardApp,WidgetDirective*/
'use strict';
chatroomApp.run(['DashboardWidgetService', function(DashboardWidgetService) {
    DashboardWidgetService.register({
        name: 'Campfire Room',
        app: 'chatroom',
        description: 'Use this to track conversations in campfire rooms that you are a member of',
        directive: 'campfire-widget',
        icon:'/chatroom/images/campfire-logo.png',
        defaultSettings: {
        },
        displayOrder: 300,
        requiredSettings: [],
        unconfiguredViewFile: 'campfire_unconfigured',
        availableFilters : [],
        availableSettings : ['title'],
        hasCustomSettings: true,
        reportAs: 'html'
    });

}]);
chatroomApp.directive('campfireWidget',  ['DashboardWidgetService', 'ChatroomService', function(DashboardWidgetService, ChatroomService){

    var campfireWidget = DashboardWidgetService.getWidget('campfire-widget');
    campfireWidget.maximizedViewFile = 'campfire_widget_max';

    var campfireWidgetController = function textWidgetController ($scope){

        var fakeMessage = {
          "message": {
            "id": 1,
            "room-id": "1",
            "user-id": "2",
            "body": "Hello Room",
            "created-at": "2009-11-22T23:46:58Z",
            "type": "Starred",
            "starred": "true"
          }
        };

        var data = [];
        ChatroomService.getRecentMessages(599528).success(function(response){
            console.log(response);
            //data = response;
        });
        //console.log(data);
        $scope.data = data;
    };

    var campfireWidgetLink = angular.noop;

    return new WidgetDirective(campfireWidget, campfireWidgetLink, campfireWidgetController);
}]);
